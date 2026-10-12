import { Link } from 'react-router';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';

const text = content.pages.notFound;

export function NotFoundPage() {
  return (
    <PageMessage
      title={text.title}
      text={text.text}
      actions={
        <>
          <Link to={ROUTES.home} className={buttonClassName()}>
            {text.backHome}
          </Link>
          <Link to={ROUTES.catalog} className={buttonClassName({ variant: 'secondary' })}>
            {text.goToCatalog}
          </Link>
        </>
      }
    />
  );
}
