import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';

const text = content.pages.error;

/**
 * Se muestra si una ruta falla al renderizar. Va sin el layout (que podría
 * ser justo lo que falló) y usa un `<a>` común para recargar la app entera.
 */
export function RouteErrorPage() {
  return (
    <main>
      <PageMessage
        title={text.title}
        text={text.text}
        actions={
          <a href={ROUTES.home} className={buttonClassName()}>
            {text.backHome}
          </a>
        }
      />
    </main>
  );
}
