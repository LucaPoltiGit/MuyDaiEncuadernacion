import { Link } from 'react-router';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { ROUTES } from '../../constants/routes';
import type { RouteKey } from '../../constants/routes';
import { content } from '../../content';

const text = content.pages.comingSoon;

export interface ComingSoonPageProps {
  /** Qué página es, para mostrar su nombre. */
  pageKey: RouteKey;
}

/** Lugar reservado para las páginas que se construyen en partes siguientes. */
export function ComingSoonPage({ pageKey }: ComingSoonPageProps) {
  return (
    <PageMessage
      eyebrow={text.eyebrow}
      title={text.titles[pageKey]}
      text={text.text}
      actions={
        pageKey !== 'home' && (
          <Link to={ROUTES.home} className={buttonClassName({ variant: 'secondary' })}>
            {text.backHome}
          </Link>
        )
      }
    />
  );
}
