import { Catalog } from '../../components/sections/Catalog/Catalog';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useShopData } from '../../hooks/useShopData';

const text = content.catalog;

export function CatalogPage() {
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
  return <Catalog catalog={state.data.catalog} data={state.data.configurator} />;
}
