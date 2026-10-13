import { CheckoutView } from '../../components/sections/Checkout/CheckoutView';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useCheckoutData } from '../../hooks/useCheckoutData';
import { useSession } from '../../hooks/useSession';

const text = content.checkout;

export function CheckoutPage() {
  const state = useCheckoutData();
  const session = useSession();

  // Se espera a la sesión para completar "Tus datos" con los de la cuenta.
  if (state.status === 'loading' || session.status === 'loading') {
    return <LoadingState label={text.loading} />;
  }
  if (state.status === 'error') {
    return (
      <PageMessage
        title={text.error.title}
        text={text.error.text}
        actions={<Button onClick={state.retry}>{text.error.retry}</Button>}
      />
    );
  }
  const user = session.user;
  return (
    <CheckoutView
      data={state.data}
      contact={user ? { name: user.name, email: user.email, phone: user.phone } : undefined}
    />
  );
}
