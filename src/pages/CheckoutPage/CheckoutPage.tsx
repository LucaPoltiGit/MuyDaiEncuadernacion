import { CheckoutView } from '../../components/sections/Checkout/CheckoutView';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useCheckoutData } from '../../hooks/useCheckoutData';

const text = content.checkout;

export function CheckoutPage() {
  const state = useCheckoutData();

  if (state.status === 'loading') return <LoadingState label={text.loading} />;
  if (state.status === 'error') {
    return (
      <PageMessage
        title={text.error.title}
        text={text.error.text}
        actions={<Button onClick={state.retry}>{text.error.retry}</Button>}
      />
    );
  }
  return <CheckoutView data={state.data} />;
}
