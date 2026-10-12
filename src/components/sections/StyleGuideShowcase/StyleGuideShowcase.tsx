import { useState } from 'react';
import { Badge } from '../../ui/Badge/Badge';
import { Button } from '../../ui/Button/Button';
import { Card } from '../../ui/Card/Card';
import { FabricSwatch } from '../../ui/FabricSwatch/FabricSwatch';
import { Flower } from '../../ui/Flower/Flower';
import { WaveEdge } from '../../ui/WaveEdge/WaveEdge';
import { Input } from '../../ui/Input/Input';
import { OptionGroup } from '../../ui/OptionGroup/OptionGroup';
import { Select } from '../../ui/Select/Select';
import { content } from '../../../content';
import styles from './StyleGuideShowcase.module.css';

const text = content.styleGuide;

/** Muestra tokens y componentes `ui/` con textos de `content/`. */
export function StyleGuideShowcase() {
  const [size, setSize] = useState<string | null>('a5');
  const [fabric, setFabric] = useState<string | null>('flores');

  return (
    <div className={styles.showcase}>
      <header className={styles.header}>
        <h1 className={styles.title}>{text.title}</h1>
        <p className={styles.intro}>{text.intro}</p>
      </header>

      <section className={styles.block} aria-labelledby="sg-colors">
        <h2 id="sg-colors" className={styles.blockTitle}>
          {text.colors.title}
        </h2>
        <ul className={styles.colorGrid}>
          {text.colors.swatches.map((swatch) => (
            <li key={swatch.token} className={styles.colorItem}>
              <span
                className={styles.colorChip}
                style={{ backgroundColor: `var(${swatch.token})` }}
                aria-hidden="true"
              />
              <span className={styles.colorName}>{swatch.name}</span>
              <span className={styles.colorUse}>{swatch.use}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className={styles.block} aria-labelledby="sg-type">
        <h2 id="sg-type" className={styles.blockTitle}>
          {text.typography.title}
        </h2>
        <p className={styles.displaySample}>{text.typography.display}</p>
        <p className={styles.note}>{text.typography.displayNote}</p>
        <p className={styles.bodySample}>{text.typography.body}</p>
        <p className={styles.note}>{text.typography.bodyNote}</p>
      </section>

      <section className={styles.block} aria-labelledby="sg-decoration">
        <h2 id="sg-decoration" className={styles.blockTitle}>
          {text.decoration.title}
        </h2>
        <div className={styles.decorationGrid}>
          <Card variant="muted">
            <div className={styles.flowerRow}>
              <Flower size="xl" />
              <Flower size="lg" />
              <Flower size="md" />
              <Flower size="sm" />
              <Flower size="lg" tone="soft" />
            </div>
            <h3 className={styles.cardTitle}>{text.decoration.flowerTitle}</h3>
            <p>{text.decoration.flowerText}</p>
          </Card>
          <Card variant="muted">
            <div className={styles.waveSample}>
              <WaveEdge edge="bottom" fill="var(--color-surface)" />
              <WaveEdge edge="top" fill="var(--color-dark-bg)" />
            </div>
            <h3 className={styles.cardTitle}>{text.decoration.waveTitle}</h3>
            <p>{text.decoration.waveText}</p>
          </Card>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="sg-buttons">
        <h2 id="sg-buttons" className={styles.blockTitle}>
          {text.buttons.title}
        </h2>
        <div className={styles.row}>
          <Button>{text.buttons.primary}</Button>
          <Button variant="secondary">{text.buttons.secondary}</Button>
          <Button variant="ghost">{text.buttons.ghost}</Button>
          <Button disabled>{text.buttons.disabled}</Button>
        </div>
        <Button size="lg" fullWidth className={styles.mobileFull}>
          {text.buttons.large}
        </Button>
      </section>

      <section className={styles.block} aria-labelledby="sg-cards">
        <h2 id="sg-cards" className={styles.blockTitle}>
          {text.cards.title}
        </h2>
        <div className={styles.cardGrid}>
          <Card>
            <h3 className={styles.cardTitle}>{text.cards.plainTitle}</h3>
            <p>{text.cards.plainText}</p>
          </Card>
          <Card variant="muted">
            <h3 className={styles.cardTitle}>{text.cards.mutedTitle}</h3>
            <p>{text.cards.mutedText}</p>
          </Card>
          <Card variant="stitched">
            <h3 className={styles.cardTitle}>{text.cards.stitchedTitle}</h3>
            <p>{text.cards.stitchedText}</p>
          </Card>
        </div>
      </section>

      <section className={styles.block} aria-labelledby="sg-inputs">
        <h2 id="sg-inputs" className={styles.blockTitle}>
          {text.inputs.title}
        </h2>
        <div className={styles.formGrid}>
          <Input label={text.inputs.nameLabel} autoComplete="name" />
          <Input label={text.inputs.emailLabel} hint={text.inputs.emailHint} type="email" />
          <Input
            label={text.inputs.postalLabel}
            error={text.inputs.postalError}
            defaultValue="14"
            inputMode="numeric"
          />
          <Input
            label={text.inputs.initialsLabel}
            hint={text.inputs.initialsHint}
            maxLength={12}
            showCounter
            defaultValue="M.D."
          />
          <Select
            label={text.select.label}
            placeholder={text.select.placeholder}
            options={[...text.select.options]}
          />
        </div>
      </section>

      <section className={styles.block} aria-labelledby="sg-options">
        <h2 id="sg-options" className={styles.blockTitle}>
          {text.optionGroup.title}
        </h2>
        <div className={styles.stack}>
          <OptionGroup
            legend={text.optionGroup.sizeLegend}
            hint={text.optionGroup.sizeHint}
            options={[...text.optionGroup.sizes]}
            value={size}
            onChange={setSize}
          />
          <OptionGroup
            legend={text.optionGroup.fabricLegend}
            layout="swatches"
            value={fabric}
            onChange={setFabric}
            options={text.optionGroup.fabrics.map((option) => ({
              ...option,
              media: <FabricSwatch image={option.image} />,
            }))}
          />
        </div>
      </section>

      <section className={styles.block} aria-labelledby="sg-badges">
        <h2 id="sg-badges" className={styles.blockTitle}>
          {text.badges.title}
        </h2>
        <div className={styles.row}>
          {text.badges.items.map((badge) => (
            <Badge key={badge.label} tone={badge.tone} withDot>
              {badge.label}
            </Badge>
          ))}
        </div>
      </section>
    </div>
  );
}
