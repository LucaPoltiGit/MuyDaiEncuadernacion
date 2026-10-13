import { notebookSpecValues } from './notebookSummary';
import { content } from '../../../content';
import type { ConfiguratorData, NotebookConfiguration } from '../../../types/notebook';
import styles from './NotebookSpecs.module.css';

const text = content.notebook;

export interface NotebookSpecsProps {
  configuration: NotebookConfiguration;
  data: ConfiguratorData;
}

/** Ficha técnica de un cuaderno: tamaño, encuadernación, hojas, tela y texto. */
export function NotebookSpecs({ configuration, data }: NotebookSpecsProps) {
  const values = notebookSpecValues(configuration, data);
  const rows = [
    { label: text.specs.size, value: values.size },
    { label: text.specs.binding, value: values.binding },
    { label: text.specs.sheets, value: values.sheets },
    { label: text.specs.paper, value: values.paper },
    { label: text.specs.fabric, value: values.fabric },
    ...(values.coverText
      ? [{ label: text.specs.coverText, value: text.coverTextValue(values.coverText) }]
      : []),
  ];

  return (
    <dl className={styles.specs}>
      {rows.map((row) => (
        <div key={row.label} className={styles.row}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
