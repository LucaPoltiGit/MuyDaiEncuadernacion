import { Flower } from '../../ui/Flower/Flower';
import styles from './PageIntro.module.css';

export interface PageIntroProps {
  /** Texto chico arriba del título, con una florcita. */
  eyebrow?: string;
  title: string;
  lead?: string;
  className?: string;
}

/** Encabezado de página: el único h1 de la pantalla. */
export function PageIntro({ eyebrow, title, lead, className }: PageIntroProps) {
  return (
    <header className={[styles.intro, className].filter(Boolean).join(' ')}>
      {eyebrow && (
        <p className={styles.eyebrow}>
          <Flower size="xs" />
          {eyebrow}
        </p>
      )}
      <h1 className={styles.title}>{title}</h1>
      {lead && <p className={styles.lead}>{lead}</p>}
    </header>
  );
}
