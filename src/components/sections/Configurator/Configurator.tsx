import { useState } from 'react';
import { Flower } from '../../ui/Flower/Flower';
import { FabricSwatch } from '../../ui/FabricSwatch/FabricSwatch';
import { Input } from '../../ui/Input/Input';
import { NotebookPreview } from '../../ui/NotebookPreview/NotebookPreview';
import { OptionGroup } from '../../ui/OptionGroup/OptionGroup';
import type { OptionGroupOption } from '../../ui/OptionGroup/OptionGroup';
import { SizeComparison } from '../../ui/SizeComparison/SizeComparison';
import { Stepper } from '../../ui/Stepper/Stepper';
import { Switch } from '../../ui/Switch/Switch';
import { ConfiguratorBar, ConfiguratorExtras } from './ConfiguratorSummary';
import { PageIntro } from '../PageIntro/PageIntro';
import { content } from '../../../content';
import { hasCoverText } from '../../../domain/notebook/restrictions';
import type { Adjustment, UnavailableReason } from '../../../domain/notebook/restrictions';
import { useConfigurator } from '../../../hooks/useConfigurator';
import type { ConfiguratorData, NotebookConfiguration, OptionKind } from '../../../types/notebook';
import styles from './Configurator.module.css';

const text = content.configurator;

export interface ConfiguratorProps {
  /** Datos configurables (la page lo verifica con `isConfigurable`). */
  data: ConfiguratorData;
  /** Para retomar un diseño guardado. */
  initialConfiguration?: NotebookConfiguration;
}

/** Busca una opción por id; si ya no existe, usa la primera (nunca rompe la pantalla). */
function pick<T extends { id: string }>(options: T[], id: string): T {
  return options.find((option) => option.id === id) ?? options[0];
}

function nameOf(options: { id: string; name: string }[], id: string) {
  return options.find((option) => option.id === id)?.name ?? '';
}

/** Configurador de cuadernos: opciones, vista previa, precio y acciones. */
export function Configurator({ data, initialConfiguration }: ConfiguratorProps) {
  const configurator = useConfigurator(data, initialConfiguration);
  const { configuration, update, unavailableReason, sheetLimits } = configurator;
  const [wantsText, setWantsText] = useState(() => hasCoverText(configuration));

  const size = pick(data.sizes, configuration.sizeId);
  const binding = pick(data.bindings, configuration.bindingId);
  const fabric = pick(data.fabrics, configuration.fabricId);
  const largestHeight = Math.max(...data.sizes.map((option) => option.heightCm));
  const maxSheetsOverall = Math.max(sheetLimits.max, ...data.bindings.map((b) => b.maxSheets));

  function reasonText(reason: UnavailableReason | null) {
    if (!reason) return undefined;
    if (reason.type === 'notForSize') {
      return text.unavailable.notForSize(nameOf(data.sizes, reason.sizeId));
    }
    return text.unavailable[reason.type];
  }

  function toOptions<T extends { id: string; name: string }>(
    kind: OptionKind,
    options: T[],
    detail?: (option: T) => string | undefined,
  ): OptionGroupOption[] {
    return options.map((option) => {
      const reason = unavailableReason(kind, option.id);
      return {
        value: option.id,
        label: option.name,
        detail: detail?.(option),
        disabled: reason !== null,
        disabledReason: reasonText(reason),
      };
    });
  }

  function surchargeText(amount: number | undefined) {
    return amount ? text.surcharge(amount) : undefined;
  }

  function adjustmentText(adjustment: Adjustment) {
    switch (adjustment.type) {
      case 'option': {
        const options = { size: data.sizes, paper: data.papers, fabric: data.fabrics };
        return text.adjustments.option(
          text.steps[adjustment.kind],
          nameOf(options[adjustment.kind], adjustment.toId),
        );
      }
      case 'binding':
        return text.adjustments.binding(
          nameOf(data.bindings, adjustment.fromId),
          nameOf(data.bindings, adjustment.toId),
          nameOf(data.sizes, adjustment.sizeId),
        );
      case 'sheets':
        return text.adjustments.sheets(adjustment.to, nameOf(data.bindings, adjustment.bindingId));
      case 'coverText':
        return adjustment.reason === 'disabled'
          ? text.adjustments.coverTextDisabled
          : text.adjustments.coverTextTrimmed;
    }
  }

  function handleWantsText(checked: boolean) {
    setWantsText(checked);
    if (!checked) update({ coverText: '' });
  }

  const summaryProps = {
    data,
    configuration,
    price: configurator.price,
    productionDays: configurator.productionDays,
  };

  const previewAlt = text.preview.alt(
    fabric.name,
    size.name,
    binding.name,
    configuration.coverText.trim(),
  );

  return (
    <div className={styles.configurator}>
      <PageIntro
        eyebrow={text.eyebrow}
        title={text.title}
        lead={text.intro}
        className={styles.intro}
      />

      <div className={styles.layout}>
        <div className={styles.previewColumn}>
          <div className={styles.previewSticky}>
            <div className={styles.previewFrame}>
              <Flower size="sm" className={styles.frameFlower} />
              <NotebookPreview
                fabricImage={fabric.image}
                widthCm={size.widthCm}
                heightCm={size.heightCm}
                referenceHeightCm={largestHeight}
                binding={binding.previewStyle}
                thickness={configuration.sheets / maxSheetsOverall}
                coverText={configuration.coverText}
                alt={previewAlt}
              />
              <div className={styles.sizeComparison}>
                <SizeComparison sizes={data.sizes} selectedId={size.id} />
              </div>
            </div>
            <p className={styles.previewCaption}>
              <strong>{size.name}</strong> · {text.sizeDetail(size.widthCm, size.heightCm)} ·{' '}
              {text.sheets.unit(configuration.sheets)}
            </p>
          </div>

          <div className={styles.summaryPanel}>
            <ConfiguratorBar
              {...summaryProps}
              canAdd={configurator.isValid}
              notices={configurator.adjustments.map(adjustmentText)}
              noticeVersion={configurator.version}
            />
            <div className={styles.extras}>
              <ConfiguratorExtras {...summaryProps} />
            </div>
          </div>
        </div>

        <div className={styles.options}>
          <section className={styles.step}>
            <OptionGroup
              legend={text.steps.fabric}
              layout="swatches"
              value={configuration.fabricId}
              onChange={(fabricId) => update({ fabricId })}
              options={toOptions('fabric', data.fabrics, (option) =>
                surchargeText(data.pricing.fabricSurcharge[option.id]),
              ).map((option) => ({
                ...option,
                media: <FabricSwatch image={pick(data.fabrics, option.value).image} />,
              }))}
            />
          </section>

          <section className={styles.step}>
            <OptionGroup
              legend={text.steps.size}
              value={configuration.sizeId}
              onChange={(sizeId) => update({ sizeId })}
              options={toOptions('size', data.sizes, (option) =>
                text.sizeDetail(option.widthCm, option.heightCm),
              )}
            />
          </section>

          <section className={styles.step}>
            <OptionGroup
              legend={text.steps.binding}
              layout="list"
              value={configuration.bindingId}
              onChange={(bindingId) => update({ bindingId })}
              options={toOptions('binding', data.bindings, (option) =>
                [
                  option.description,
                  text.upToSheets(option.maxSheets),
                  surchargeText(data.pricing.bindingSurcharge[option.id]),
                ]
                  .filter(Boolean)
                  .join(' · '),
              )}
            />
          </section>

          <section className={styles.step}>
            <Stepper
              label={text.steps.sheets}
              value={configuration.sheets}
              min={sheetLimits.min}
              max={sheetLimits.max}
              step={sheetLimits.step}
              onChange={(sheets) => update({ sheets })}
              formatValue={text.sheets.unit}
              decrementLabel={text.sheets.decrease(sheetLimits.step)}
              incrementLabel={text.sheets.increase(sheetLimits.step)}
              hint={text.sheets.hint(sheetLimits.min, sheetLimits.max, binding.name)}
            />
          </section>

          <section className={styles.step}>
            <OptionGroup
              legend={text.steps.paper}
              value={configuration.paperId}
              onChange={(paperId) => update({ paperId })}
              options={toOptions('paper', data.papers, (option) => option.description)}
            />
          </section>

          {data.personalization.enabled && (
            <section className={styles.step} aria-labelledby="personalization-title">
              <h2 id="personalization-title" className={styles.stepTitle}>
                {text.steps.personalization}
              </h2>
              <Switch
                label={text.personalization.toggle}
                detail={text.personalization.toggleDetail(
                  data.pricing.personalizationSurcharge,
                  data.production.personalizationExtraDays,
                )}
                checked={wantsText}
                onChange={handleWantsText}
              />
              {wantsText && (
                <Input
                  label={text.personalization.inputLabel}
                  hint={text.personalization.inputHint(data.personalization.maxLength)}
                  placeholder={text.personalization.placeholder}
                  maxLength={data.personalization.maxLength}
                  showCounter
                  value={configuration.coverText}
                  onChange={(event) => update({ coverText: event.target.value })}
                />
              )}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
