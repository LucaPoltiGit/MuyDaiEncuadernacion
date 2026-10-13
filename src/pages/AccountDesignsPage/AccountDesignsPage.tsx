import { SavedDesigns } from '../../components/sections/SavedDesigns/SavedDesigns';
import { Button } from '../../components/ui/Button/Button';
import { LoadingState } from '../../components/ui/LoadingState/LoadingState';
import { content } from '../../content';
import { useConfiguratorData } from '../../hooks/useConfiguratorData';
import { useMyDesigns } from '../../hooks/useMyAccount';
import styles from './AccountDesignsPage.module.css';

const text = content.account.designs;

/** Mi cuenta → Mis diseños. */
export function AccountDesignsPage() {
  const { state, designs, remove } = useMyDesigns();
  const configurator = useConfiguratorData();

  if (state.status === 'loading' || configurator.status === 'loading') {
    return <LoadingState label={text.loading} />;
  }
  if (state.status === 'error' || configurator.status === 'error') {
    const retry =
      state.status === 'error'
        ? state.retry
        : configurator.status === 'error'
          ? configurator.retry
          : undefined;
    return (
      <div role="alert" className={styles.error}>
        <p>{text.error}</p>
        <Button variant="secondary" onClick={retry}>
          {text.retry}
        </Button>
      </div>
    );
  }
  return <SavedDesigns designs={designs} data={configurator.data} onRemove={remove} />;
}
