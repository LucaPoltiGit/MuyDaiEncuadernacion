import { useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Link } from 'react-router';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { CheckoutSummary } from './CheckoutSummary';
import { ContactFields } from './ContactFields';
import { DeliveryFields } from './DeliveryFields';
import { PageIntro } from '../PageIntro/PageIntro';
import { PageMessage } from '../PageMessage/PageMessage';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import { summarizeCart } from '../../../domain/cart/pricing';
import {
  CHECKOUT_FIELD_ORDER,
  emptyCheckoutForm,
  validateCheckoutForm,
} from '../../../domain/checkout/form';
import type { CheckoutForm } from '../../../domain/checkout/form';
import {
  buildNewOrder,
  checkoutTotals,
  productionDaysOf,
  quoteFromForm,
} from '../../../domain/checkout/order';
import { estimateDelivery } from '../../../domain/shipping';
import { useCart } from '../../../hooks/useCart';
import { useCartDiscount } from '../../../hooks/useCartDiscount';
import type { CheckoutData } from '../../../hooks/useCheckoutData';
import { formatPrice } from '../../../domain/money';
import { usePlaceOrder } from '../../../hooks/usePlaceOrder';
import type { PlaceOrderError } from '../../../hooks/usePlaceOrder';
import { useSession } from '../../../hooks/useSession';
import styles from './CheckoutView.module.css';

const text = content.checkout;

export interface CheckoutViewProps {
  data: CheckoutData;
}

/**
 * Checkout en una sola pantalla: datos, entrega y resumen con el pago. Al
 * pagar se crea el pedido y se pasa a Mercado Pago (simulado).
 */
export function CheckoutView({ data }: CheckoutViewProps) {
  const session = useSession();
  const { placeOrder, placing, error: placeError, clearError } = usePlaceOrder();
  const { items } = useCart();
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState<CheckoutForm>(emptyCheckoutForm);
  const [submitted, setSubmitted] = useState(false);

  const cart = useMemo(
    () =>
      summarizeCart(items, { configurator: data.configurator, products: data.catalog.products }),
    [items, data],
  );
  const { state: discountState } = useCartDiscount(cart);
  const discount =
    discountState.status === 'applied'
      ? { id: discountState.discount.id, code: discountState.code, amount: discountState.amount }
      : null;
  const subtotalAfterDiscount = cart.subtotal - (discount?.amount ?? 0);
  const quote = quoteFromForm(form, data.shipping, subtotalAfterDiscount);
  const totals = checkoutTotals(cart.subtotal, discount?.amount ?? 0, quote);
  const estimate = quote
    ? estimateDelivery(productionDaysOf(cart, data.configurator), data.shipping, quote)
    : null;
  // Los errores se muestran desde el primer intento de pago y se actualizan al corregir.
  // El código postal sin cobertura se avisa enseguida (no hace falta esperar).
  const allErrors = validateCheckoutForm(form, data.shipping);
  const errors = submitted
    ? allErrors
    : allErrors.postalCode === 'noCoverage'
      ? { postalCode: allErrors.postalCode }
      : {};

  if (items.length === 0) {
    return (
      <PageMessage
        title={text.emptyCart.title}
        text={text.emptyCart.text}
        actions={
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            {text.emptyCart.action}
          </Link>
        }
      />
    );
  }

  if (cart.hasProblems) {
    return (
      <PageMessage
        title={text.cartProblems.title}
        text={text.cartProblems.text}
        actions={
          <Link to={ROUTES.cart} className={buttonClassName()}>
            {text.cartProblems.action}
          </Link>
        }
      />
    );
  }

  const errorCount = Object.keys(allErrors).length;

  function placeErrorText(error: PlaceOrderError) {
    if (error.type === 'conflict') {
      const names = cart.lines
        .filter((line) => line.product && error.productIds.includes(line.product.id))
        .map((line) => line.product?.name)
        .join(', ');
      return names ? text.errors.conflict(names) : text.errors.conflictUnknown;
    }
    if (error.type === 'discountUnavailable') return text.errors.discountUnavailable;
    return text.errors.submit;
  }

  const summaryError =
    submitted && errorCount > 0
      ? text.errors.summary(errorCount)
      : placeError
        ? placeErrorText(placeError)
        : null;

  function update(changes: Partial<CheckoutForm>) {
    setForm((current) => ({ ...current, ...changes }));
    clearError();
  }

  function focusFirstError() {
    const field = CHECKOUT_FIELD_ORDER.find((candidate) => allErrors[candidate]);
    const element = field ? formRef.current?.elements.namedItem(field) : null;
    if (element instanceof HTMLElement) element.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (placing) return;
    setSubmitted(true);
    if (errorCount > 0 || !quote) {
      focusFirstError();
      return;
    }
    await placeOrder(
      buildNewOrder({
        form,
        cart,
        discount,
        quote,
        shipping: data.shipping,
        configurator: data.configurator,
        userId: session.status === 'ready' ? (session.user?.id ?? null) : null,
      }),
    );
  }

  return (
    <div className={styles.checkout}>
      <PageIntro title={text.title} lead={text.lead} />
      {/* En mobile el resumen queda al final: el total se ve desde arriba. */}
      <a href="#checkout-summary-title" className={styles.jumpToSummary}>
        {text.summary.jumpToSummary(formatPrice(totals.total))}
      </a>
      <form ref={formRef} className={styles.layout} onSubmit={handleSubmit} noValidate>
        <div className={styles.steps}>
          <ContactFields form={form} errors={errors} onChange={update} />
          <DeliveryFields
            form={form}
            errors={errors}
            shipping={data.shipping}
            quote={quote}
            onChange={update}
          />
        </div>
        <div className={styles.summary}>
          <CheckoutSummary
            cart={cart}
            configurator={data.configurator}
            totals={totals}
            discountCode={discount?.code ?? null}
            quote={quote}
            estimate={estimate}
            submitting={placing}
            error={summaryError}
          />
        </div>
      </form>
    </div>
  );
}
