import { Flower } from '../Flower/Flower';
import styles from './Wordmark.module.css';

export interface WordmarkProps {
  /** Nombre de la marca. Si termina en "i", su punto es una florcita. */
  name: string;
  /** `responsive` crece en desktop. */
  size?: 'md' | 'lg' | 'responsive';
}

/**
 * Logotipo tipográfico. El nombre accesible es el texto completo; la flor
 * que reemplaza el punto de la "i" final es solo visual.
 */
export function Wordmark({ name, size = 'md' }: WordmarkProps) {
  const endsWithI = name.endsWith('i');
  const base = endsWithI ? name.slice(0, -1) : name;

  return (
    <span className={[styles.wordmark, styles[size]].join(' ')}>
      <span className="visually-hidden">{name}</span>
      <span aria-hidden="true">
        {base}
        {endsWithI && (
          <span className={styles.lastLetter}>
            ı
            <Flower className={styles.dot} plain />
          </span>
        )}
      </span>
    </span>
  );
}
