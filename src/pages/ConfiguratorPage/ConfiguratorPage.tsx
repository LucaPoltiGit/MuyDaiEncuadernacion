import { Link } from 'react-router';
import { Configurator } from '../../components/sections/Configurator/Configurator';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { Flower } from '../../components/ui/Flower/Flower';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { isConfigurable } from '../../domain/notebook/restrictions';
import { useConfiguratorData } from '../../hooks/useConfiguratorData';
import styles from './ConfiguratorPage.module.css';

const text = content.configurator;

export function ConfiguratorPage() {
  const state = useConfiguratorData();

  if (state.status === 'loading') {
    return (
      <div className={styles.loading} role="status">
        <Flower size="lg" className={styles.spinner} />
        <p>{text.loading}</p>
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <PageMessage
        title={text.error.title}
        text={text.error.text}
        actions={<Button onClick={state.retry}>{text.error.retry}</Button>}
      />
    );
  }

  // Si el admin dejó algo sin stock o sin precio, mejor avisar que romper.
  if (!isConfigurable(state.data)) {
    return (
      <PageMessage
        title={text.paused.title}
        text={text.paused.text}
        actions={
          <Link to={ROUTES.catalog} className={buttonClassName()}>
            {text.paused.goToCatalog}
          </Link>
        }
      />
    );
  }

  return <Configurator data={state.data} />;
}
