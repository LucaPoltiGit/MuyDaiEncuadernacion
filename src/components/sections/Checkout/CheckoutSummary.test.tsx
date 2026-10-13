import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CheckoutSummary } from './CheckoutSummary';
import { content } from '../../../content';
import { summarizeCart } from '../../../domain/cart/pricing';
import { buildCustomItem, buildProduct, buildProductItem } from '../../../domain/cart/testFixture';
import { checkoutTotals } from '../../../domain/checkout/order';
import { buildShippingConfig } from '../../../domain/checkout/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { quoteShipping } from '../../../domain/shipping';
import { renderWithRouter } from '../../../test/renderWithRouter';

const text = content.checkout.summary;
const configurator = buildTestData();
const cart = summarizeCart([buildProductItem(), buildCustomItem()], {
  configurator,
  products: [buildProduct()],
});
const quote = quoteShipping(buildShippingConfig().zones[0], 70000);

describe('CheckoutSummary', () => {
  it('muestra cada cuaderno, el descuento, el envío gratis y el plazo', () => {
    renderWithRouter(
      <form>
        <CheckoutSummary
          cart={cart}
          configurator={configurator}
          totals={checkoutTotals(cart.subtotal, 3620, quote)}
          discountCode="HOLA10"
          quote={quote}
          estimate={{ min: 8, max: 9 }}
          submitting={false}
          error={null}
        />
      </form>,
    );
    expect(screen.getByText('Cuaderno Flores')).toBeInTheDocument();
    expect(screen.getByText(content.notebook.customName)).toBeInTheDocument();
    expect(screen.getByText(text.discount('HOLA10'))).toBeInTheDocument();
    expect(screen.getByText(text.shippingFree)).toBeInTheDocument();
    expect(screen.getByText(/Llega en 8 a 9 días hábiles/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: text.pay })).toHaveAttribute('type', 'submit');
  });

  it('mientras prepara el pago, no deja tocar el botón de nuevo', () => {
    renderWithRouter(
      <CheckoutSummary
        cart={cart}
        configurator={configurator}
        totals={checkoutTotals(cart.subtotal, 0, null)}
        discountCode={null}
        quote={null}
        estimate={null}
        submitting
        error={null}
      />,
    );
    expect(screen.getByRole('button', { name: text.paying })).toBeDisabled();
    expect(screen.getByText(text.shippingPending)).toBeInTheDocument();
  });
});
