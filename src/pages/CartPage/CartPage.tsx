import { CartView } from '../../components/sections/Cart/CartView';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useShopData } from '../../hooks/useShopData';

const text = content.cart;

export function CartPage() {
  const state = useShopData();

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
  return <CartView shop={state.data} />;
}
