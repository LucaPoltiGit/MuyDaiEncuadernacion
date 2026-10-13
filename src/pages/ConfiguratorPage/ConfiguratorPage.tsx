import { Link, useLocation } from 'react-router';
import { Configurator } from '../../components/sections/Configurator/Configurator';
import { PageMessage } from '../../components/sections/PageMessage/PageMessage';
import { Button } from '../../components/ui/Button/Button';
import { buttonClassName } from '../../components/ui/Button/buttonClassName';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { ROUTES } from '../../constants/routes';
import { content } from '../../content';
import { isNotebookConfiguration } from '../../domain/notebook/guards';
import { isConfigurable } from '../../domain/notebook/restrictions';
import { useConfiguratorData } from '../../hooks/useConfiguratorData';

const text = content.configurator;

/** Configuración de partida si se llegó desde otra pantalla (ej. "Personalizar" en una ficha). */
function useBaseConfiguration() {
  const { state } = useLocation();
  const candidate: unknown =
    typeof state === 'object' && state !== null && 'baseConfiguration' in state
      ? state.baseConfiguration
      : undefined;
  return isNotebookConfiguration(candidate) ? candidate : undefined;
}

export function ConfiguratorPage() {
  const state = useConfiguratorData();
  const baseConfiguration = useBaseConfiguration();

  if (state.status === 'loading') return <LoadingState label={text.loading} />;

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

  return <Configurator data={state.data} initialConfiguration={baseConfiguration} />;
}
