import { Link, useParams } from 'react-router';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { ProductDetail } from '../../components/sections/ProductDetail/ProductDetail';
import { Button } from '../../components/ui/Button/Button';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { useShopData } from '../../hooks/useShopData';

const text = content.product;

export function ProductPage() {
  const { slug } = useParams();
  const state = useShopData();

  if (state.status === 'loading') return <LoadingState label={content.catalog.loading} />;
  if (state.status === 'error') {
    return (
      <PageMessage
        title={content.catalog.error.title}
        text={content.catalog.error.text}
        actions={<Button onClick={state.retry}>{content.catalog.error.retry}</Button>}
      />
    );
  }

  const { catalog, configurator } = state.data;
  const product = catalog.products.find((candidate) => candidate.slug === slug);
  if (!product) {
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

  const category = catalog.categories.find((option) => option.id === product.categoryId);
  return <ProductDetail product={product} categoryName={category?.name} data={configurator} />;
}
