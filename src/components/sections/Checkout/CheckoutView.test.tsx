import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { CheckoutView } from './CheckoutView';
import { content } from '../../../content';
import { buildCustomItem, buildProduct, buildProductItem } from '../../../domain/cart/testFixture';
import { buildOrder, buildShippingConfig } from '../../../domain/checkout/testFixture';
import { buildTestData } from '../../../domain/notebook/testFixture';
import { saveCartItems } from '../../../services/cartService';
import { createOrder } from '../../../services/orderService';
import { renderWithRouter } from '../../../test/renderWithRouter';
import type { CartItem } from '../../../types/cart';

const text = content.checkout;
const data = {
  configurator: buildTestData(),
  catalog: { categories: [], products: [buildProduct()] },
  shipping: buildShippingConfig(),
};
const simulatorRoute = [{ path: '/checkout/pago-de-prueba', element: <p>Simulador de pago</p> }];

function renderCheckout(items: CartItem[] = [buildProductItem(), buildCustomItem()]) {
  saveCartItems(items);
  return renderWithRouter(<CheckoutView data={data} />, { routes: simulatorRoute });
}

async function fillContact() {
  await userEvent.type(screen.getByLabelText(text.contact.name), 'Ana Pérez');
  await userEvent.type(screen.getByLabelText(text.contact.email), 'ana@example.com');
  await userEvent.type(screen.getByLabelText(text.contact.phone), '11 5555 1234');
}

/** Un pedido nuevo (de otra persona) con esa pieza de la tienda. */
function buildOrderFor(productId: string) {
  const { lines, ...rest } = buildOrder();
  return {
    customer: rest.customer,
    lines: [{ ...lines[0], productId }],
    subtotal: rest.subtotal,
    discount: null,
    delivery: rest.delivery,
    total: rest.total,
    estimatedDays: rest.estimatedDays,
  };
}

function totalRow() {
  return screen.getByText(text.summary.total).closest('div');
}

describe('CheckoutView', () => {
  it('con sesión, completa "Tus datos" con los de la cuenta', () => {
    saveCartItems([buildProductItem()]);
    renderWithRouter(
      <CheckoutView
        data={data}
        contact={{ name: 'Ana Pérez', email: 'ana@example.com', phone: '11 5555 1234' }}
      />,
    );
    expect(screen.getByLabelText(text.contact.name)).toHaveValue('Ana Pérez');
    expect(screen.getByLabelText(text.contact.email)).toHaveValue('ana@example.com');
  });

  it('con el carrito vacío, lleva a la tienda', () => {
    renderCheckout([]);
    expect(screen.getByRole('heading', { name: text.emptyCart.title })).toBeInTheDocument();
  });

  it('con problemas en el carrito, lleva a revisarlo', () => {
    renderCheckout([buildProductItem({ productId: 'borrado' })]);
    expect(screen.getByRole('link', { name: text.cartProblems.action })).toHaveAttribute(
      'href',
      '/carrito',
    );
  });

  it('cotiza el envío al escribir el código postal y lo suma al total', async () => {
    // Tienda $20.000 + a medida $16.200 = $36.200
    renderCheckout();
    expect(screen.getByText(text.summary.shippingPending)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(text.delivery.postalCode), '1414');
    expect(screen.getByText(/CABA: llega/)).toBeInTheDocument();
    expect(
      screen.getByText(text.delivery.missingForFree(23800).replace(/\s+/g, ' ')),
    ).toBeInTheDocument();
    expect(totalRow()).toHaveTextContent(/39\.700/);
  });

  it('avisa enseguida si no hay envíos a ese código postal, con salida por WhatsApp', async () => {
    renderCheckout();
    await userEvent.type(screen.getByLabelText(text.delivery.postalCode), '9410');
    expect(screen.getByText(text.errors.noCoverage)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: content.layout.footer.whatsapp })).toHaveAttribute(
      'href',
      expect.stringContaining('wa.me'),
    );
  });

  it('retirar en el taller no cobra envío ni pide dirección', async () => {
    renderCheckout();
    await userEvent.click(screen.getByRole('radio', { name: new RegExp(text.delivery.pickup) }));
    expect(screen.queryByLabelText(text.delivery.street)).not.toBeInTheDocument();
    expect(totalRow()).toHaveTextContent(/36\.200/);
    expect(screen.getByText(/Listo para retirar en 7 días hábiles/)).toBeInTheDocument();
  });

  it('al pagar con datos incompletos, marca los errores y lleva el foco al primero', async () => {
    renderCheckout();
    await userEvent.click(screen.getByRole('button', { name: text.summary.pay }));
    // Nombre, email, teléfono, CP, calle, localidad y provincia.
    expect(screen.getByRole('alert')).toHaveTextContent(text.errors.summary(7));
    expect(screen.getByLabelText(text.contact.name)).toHaveFocus();
    expect(screen.getByLabelText(text.contact.name)).toBeInvalid();
  });

  it('si una pieza se vendió mientras compraba, lo dice y no pasa al pago', async () => {
    // Otra persona ya está pagando el mismo cuaderno.
    await createOrder(buildOrderFor('p-flores'));
    renderCheckout();
    await fillContact();
    await userEvent.click(screen.getByRole('radio', { name: new RegExp(text.delivery.pickup) }));
    await userEvent.click(screen.getByRole('button', { name: text.summary.pay }));
    expect(
      await screen.findByText(text.errors.conflict('Cuaderno Flores'), {}, { timeout: 3000 }),
    ).toBeInTheDocument();
    expect(screen.queryByText('Simulador de pago')).not.toBeInTheDocument();
  });

  it('con todo completo, crea el pedido y pasa al pago', async () => {
    renderCheckout();
    await fillContact();
    await userEvent.click(screen.getByRole('radio', { name: new RegExp(text.delivery.pickup) }));
    await userEvent.click(screen.getByRole('button', { name: text.summary.pay }));
    expect(await screen.findByText('Simulador de pago', {}, { timeout: 3000 })).toBeInTheDocument();
  });
});
