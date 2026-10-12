import styles from './FabricSwatch.module.css';

export interface FabricSwatchProps {
  /** URL de la textura; se repite como la trama de una tela. */
  image: string;
  /** Texto alternativo. Vacío si el nombre de la tela ya está visible al lado. */
  alt?: string;
}

export function FabricSwatch({ image, alt = '' }: FabricSwatchProps) {
  return (
    <span
      className={styles.swatch}
      style={{ backgroundImage: `url("${image}")` }}
      role={alt ? 'img' : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
    />
  );
}
