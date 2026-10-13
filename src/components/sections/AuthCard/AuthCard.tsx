import type { ReactNode } from 'react';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { Card } from '../../ui/Card/Card';
import { PageIntro } from '../PageIntro/PageIntro';
import styles from './AuthCard.module.css';

export interface AuthCardProps {
  eyebrow: string;
  title: string;
  lead: string;
  /** El formulario. */
  children: ReactNode;
  /** Debajo de la tarjeta: el link a la otra opción ("¿Ya tenés cuenta?"). */
  footer?: ReactNode;
}

/** Tarjeta angosta y centrada para ingresar o crear la cuenta. */
export function AuthCard({ eyebrow, title, lead, children, footer }: AuthCardProps) {
  return (
    <div className={styles.wrapper}>
      <Card variant="stitched" padding="lg" className={styles.card}>
        <Butterfly size="lg" className={styles.butterfly} />
        <PageIntro eyebrow={eyebrow} title={title} lead={lead} />
        {children}
      </Card>
      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
