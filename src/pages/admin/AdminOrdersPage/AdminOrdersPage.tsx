import { useState } from 'react';
import { AdminOrders } from '../../../components/sections/AdminOrders/AdminOrders';
import { AdminSaveStatus } from '../../../components/sections/AdminSaveStatus/AdminSaveStatus';
import { ErrorState } from '../../../components/ui/ErrorState/ErrorState';
import { LoadingState } from '../../../components/ui/LoadingState/LoadingState';
import { content } from '../../../content';
import { useAdminSave } from '../../../hooks/useAdminSave';
import { useAsyncData } from '../../../hooks/useAsyncData';
import { useConfiguratorData } from '../../../hooks/useConfiguratorData';
import { getAllOrders, updateOrderStatus } from '../../../services/adminService';
import type { Order, OrderStatus } from '../../../types/order';

const text = content.admin;

export function AdminOrdersPage() {
  const orders = useAsyncData(getAllOrders);
  const configurator = useConfiguratorData();
  const save = useAdminSave(updateOrderStatus);
  // Pedidos ya actualizados en esta visita: se muestran sin recargar la lista.
  const [updated, setUpdated] = useState<Record<string, Order>>({});

  if (orders.status === 'loading' || configurator.status === 'loading') {
    return <LoadingState label={text.loading} />;
  }
  if (orders.status === 'error' || configurator.status === 'error') {
    const retry = orders.status === 'error' ? orders.retry : () => window.location.reload();
    return <ErrorState message={text.loadError} retryLabel={text.retry} onRetry={retry} />;
  }

  async function changeStatus(orderId: string, status: OrderStatus) {
    const order = await save.run(orderId, status);
    if (order) setUpdated((current) => ({ ...current, [order.id]: order }));
    return order !== null;
  }

  return (
    <>
      <AdminSaveStatus state={save.state} />
      <AdminOrders
        orders={orders.data.map((order) => updated[order.id] ?? order)}
        data={configurator.data}
        onStatusChange={changeStatus}
      />
    </>
  );
}
