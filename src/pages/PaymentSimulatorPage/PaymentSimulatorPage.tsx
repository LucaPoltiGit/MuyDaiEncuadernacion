import { Link, useSearchParams } from 'react-router';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { PaymentSimulator } from '../../components/sections/PaymentSimulator/PaymentSimulator';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { PAYMENT_PARAMS, ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { usePaymentSimulator } from '../../hooks/usePaymentSimulator';

const text = content.checkout.simulator;

/**
 * Hace las veces de Mercado Pago en modo prueba. Va en el layout de
 * pantallas sueltas, como una "pasarela" aparte de la misma familia visual.
 */
export function PaymentSimulatorPage() {
  const [params] = useSearchParams();
  const { state, resolve } = usePaymentSimulator(params.get(PAYMENT_PARAMS.preference) ?? '');

  function body() {
    if (state.status === 'loading') return <LoadingState label={text.processing} />;
    // Un pago ya resuelto no se vuelve a pagar (ej. volver atrás desde el resultado).
    if (state.status === 'error' || !state.data || state.data.payment.status !== 'pending') {
      return (
        <PageMessage
          title={text.notFound.title}
          text={text.notFound.text}
          actions={
            <Link to={ROUTES.cart} className={buttonClassName()}>
              {text.notFound.action}
            </Link>
          }
        />
      );
    }
    return <PaymentSimulator order={state.data} onResolve={resolve} />;
  }

  return body();
}
