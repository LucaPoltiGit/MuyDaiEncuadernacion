import { OrderHistory } from '../../components/sections/OrderHistory/OrderHistory';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useConfiguratorData } from '../../hooks/useConfiguratorData';
import { useMyOrders } from '../../hooks/useMyAccount';
import styles from './AccountOrdersPage.module.css';

const text = content.account.orders;

/** Mi cuenta → Mis compras. */
export function AccountOrdersPage() {
  const orders = useMyOrders();
  const configurator = useConfiguratorData();

  if (orders.status === 'loading' || configurator.status === 'loading') {
    return <LoadingState label={text.loading} />;
  }
  if (orders.status === 'error' || configurator.status === 'error') {
    const retry =
      orders.status === 'error'
        ? orders.retry
        : configurator.status === 'error'
          ? configurator.retry
          : undefined;
    return (
      <div role="alert" className={styles.error}>
        <p>{text.error}</p>
        <Button variant="secondary" onClick={retry}>
          {text.retry}
        </Button>
      </div>
    );
  }
  return <OrderHistory orders={orders.data} data={configurator.data} />;
}
