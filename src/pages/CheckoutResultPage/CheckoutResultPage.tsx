import { Link, useSearchParams } from 'react-router';
import { CheckoutResult } from '../../components/sections/CheckoutResult/CheckoutResult';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { PAYMENT_PARAMS, ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { useCheckoutResult } from '../../hooks/useCheckoutResult';

const text = content.checkout.result;

/** A donde vuelve Mercado Pago: muestra cómo terminó el pago del pedido. */
export function CheckoutResultPage() {
  const [params] = useSearchParams();
  const { state, retry, retrying, retryFailed } = useCheckoutResult(
    params.get(PAYMENT_PARAMS.order) ?? '',
  );

  if (state.status === 'loading') return <LoadingState label={text.loading} />;
  if (state.status === 'error' || !state.data) {
    return (
      <PageMessage
        title={text.notFound.title}
        text={text.notFound.text}
        actions={
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            {text.notFound.action}
          </Link>
        }
      />
    );
  }

  return (
    <CheckoutResult
      order={state.data}
      onRetry={retry}
      retrying={retrying}
      retryFailed={retryFailed}
    />
  );
}
