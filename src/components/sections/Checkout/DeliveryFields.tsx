import { Input } from '../../ui/Input/Input';
import { OptionGroup } from '../../ui/OptionGroup/OptionGroup';
import { Select } from '../../ui/Select/Select';
import { PROVINCES } from '../../../constants/argentina';
import { whatsappLink } from '../../../constants/contact';
import { content } from '../../../content';
import type { CheckoutErrors, CheckoutForm } from '../../../domain/checkout/form';
import type { ShippingQuote } from '../../../domain/shipping';
import type { DeliveryMethod, ShippingConfig } from '../../../types/shipping';
import { CheckoutStep } from './CheckoutStep';
import styles from './DeliveryFields.module.css';

const text = content.checkout;

export interface DeliveryFieldsProps {
  form: CheckoutForm;
  errors: CheckoutErrors;
  shipping: ShippingConfig;
  /** Cotización actual (envío o retiro), si ya hay datos suficientes. */
  quote: ShippingQuote | null;
  onChange: (changes: Partial<CheckoutForm>) => void;
}

/** Envío a domicilio (con cotización por código postal) o retiro. */
export function DeliveryFields({ form, errors, shipping, quote, onChange }: DeliveryFieldsProps) {
  const error = (field: keyof CheckoutErrors) => {
    const type = errors[field];
    return type ? text.errors[type] : undefined;
  };
  const hasPickup = shipping.pickupPoints.length > 0;

  function changeMethod(method: string) {
    const changes: Partial<CheckoutForm> = { method: method as DeliveryMethod };
    // Con un solo punto de retiro, queda elegido solo.
    if (method === 'pickup' && !form.pickupPointId && shipping.pickupPoints.length > 0) {
      changes.pickupPointId = shipping.pickupPoints[0].id;
    }
    onChange(changes);
  }

  return (
    <CheckoutStep number={2} title={text.delivery.title}>
      {hasPickup && (
        <OptionGroup
          legend={text.delivery.methodLegend}
          layout="list"
          value={form.method}
          onChange={changeMethod}
          options={[
            {
              value: 'shipping',
              label: text.delivery.shipping,
              detail: text.delivery.shippingDetail,
            },
            { value: 'pickup', label: text.delivery.pickup, detail: text.delivery.pickupDetail },
          ]}
        />
      )}

      {form.method === 'shipping' ? (
        <>
          <div className={styles.postalCode}>
            <Input
              label={text.delivery.postalCode}
              name="postalCode"
              autoComplete="postal-code"
              hint={text.delivery.postalCodeHint}
              value={form.postalCode}
              onChange={(event) => onChange({ postalCode: event.target.value })}
              error={error('postalCode')}
            />
          </div>
          <ShippingQuoteNotice quote={quote} />
          {errors.postalCode === 'noCoverage' && (
            <p className={styles.help}>
              {text.delivery.noCoverageHelp}{' '}
              <a
                href={whatsappLink(text.delivery.whatsappMessage(form.postalCode.trim()))}
                target="_blank"
                rel="noreferrer"
              >
                {content.layout.footer.whatsapp}
              </a>
            </p>
          )}
          <Input
            label={text.delivery.street}
            name="street"
            autoComplete="address-line1"
            value={form.street}
            onChange={(event) => onChange({ street: event.target.value })}
            error={error('street')}
          />
          <div className={styles.row}>
            <Input
              label={text.delivery.apartment}
              name="apartment"
              autoComplete="address-line2"
              value={form.apartment}
              onChange={(event) => onChange({ apartment: event.target.value })}
            />
            <Input
              label={text.delivery.city}
              name="city"
              autoComplete="address-level2"
              value={form.city}
              onChange={(event) => onChange({ city: event.target.value })}
              error={error('city')}
            />
          </div>
          <Select
            label={text.delivery.province}
            name="province"
            autoComplete="address-level1"
            placeholder={text.delivery.provincePlaceholder}
            options={PROVINCES.map((province) => ({ value: province, label: province }))}
            value={form.province}
            onChange={(event) => onChange({ province: event.target.value })}
            error={error('province')}
          />
        </>
      ) : (
        <OptionGroup
          legend={text.delivery.pickupLegend}
          layout="list"
          value={form.pickupPointId || null}
          onChange={(pickupPointId) => onChange({ pickupPointId })}
          options={shipping.pickupPoints.map((point) => ({
            value: point.id,
            label: point.name,
            detail: `${point.address} · ${point.schedule}`,
          }))}
        />
      )}
    </CheckoutStep>
  );
}

/** Lo que cuesta y tarda el envío al código postal ingresado (se actualiza al escribir). */
function ShippingQuoteNotice({ quote }: { quote: ShippingQuote | null }) {
  return (
    <div role="status" className={styles.quote}>
      {quote?.method === 'shipping' && (
        <>
          <p>{text.delivery.quote(quote.zone.name, quote.zone.days.min, quote.zone.days.max)}</p>
          {quote.free && <p className={styles.free}>{text.delivery.free}</p>}
          {quote.missingForFree !== null && (
            <p className={styles.quoteHint}>{text.delivery.missingForFree(quote.missingForFree)}</p>
          )}
        </>
      )}
    </div>
  );
}
