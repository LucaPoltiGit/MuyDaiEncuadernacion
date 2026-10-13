import { Link } from 'react-router';
import { Butterfly } from '../../ui/Butterfly/Butterfly';
import { buttonClassName } from '../../ui/Button/buttonClassName';
import { Flower } from '../../ui/Flower/Flower';
import { Icon } from '../../ui/Icon/Icon';
import { WaveEdge } from '../../ui/WaveEdge/WaveEdge';
import { Wordmark } from '../../ui/Wordmark/Wordmark';
import { CONSUMER_DEFENSE_URL, SOCIAL_LINKS, whatsappLink } from '../../../constants/contact';
import { ROUTES } from '../../../constants/routes';
import { content } from '../../../content';
import styles from './SiteFooter.module.css';

const text = content.layout;

export function SiteFooter() {
  const year = new Date().getFullYear();
  const social = [
    { href: SOCIAL_LINKS.instagram, label: text.footer.instagram, icon: 'instagram' as const },
    {
      href: whatsappLink(text.whatsapp.message),
      label: text.footer.whatsapp,
      icon: 'whatsapp' as const,
    },
  ];

  return (
    <>
      <WaveEdge edge="top" fill="var(--color-dark-bg)" />
      <footer className={styles.footer}>
        <Flower size="xl" className={styles.flower} />
        <Butterfly size="lg" tone="onDark" className={styles.butterfly} />
        <div className={styles.inner}>
          <div className={styles.brandBlock}>
            <Wordmark name={text.brandName} size="lg" />
            <p className={styles.tagline}>{text.footer.tagline}</p>
            <ul className={styles.social} aria-label={text.footer.socialLabel}>
              {social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className={styles.socialLink}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={item.label}
                  >
                    <Icon name={item.icon} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-help" className={styles.column}>
            <h2 id="footer-help" className={styles.columnTitle}>
              {text.footer.helpTitle}
            </h2>
            <ul className={styles.links}>
              <li>
                <Link to={ROUTES.faq}>{text.footer.faq}</Link>
              </li>
              <li>
                <Link to={ROUTES.shippingPolicy}>{text.footer.shippingPolicy}</Link>
              </li>
              <li>
                <Link to={ROUTES.terms}>{text.footer.terms}</Link>
              </li>
            </ul>
          </nav>

          <div className={styles.column}>
            <h2 className={styles.columnTitle}>{text.footer.contactTitle}</h2>
            <p className={styles.muted}>{text.footer.contactText}</p>
            <a
              href={whatsappLink(text.whatsapp.message)}
              target="_blank"
              rel="noreferrer"
              className={buttonClassName({ variant: 'inverse', className: styles.contact })}
            >
              {text.footer.contactButton}
            </a>
          </div>
        </div>

        <div className={styles.legal}>
          <p>{text.footer.copyright(year)}</p>
          {/* Res. 424/2020: link con este nombre exacto, de fácil acceso. */}
          <ul className={styles.legalLinks}>
            <li>
              <Link to={ROUTES.withdrawal}>{text.footer.withdrawal}</Link>
            </li>
            <li>
              <a href={CONSUMER_DEFENSE_URL} target="_blank" rel="noreferrer">
                {text.footer.consumerDefense}
              </a>
            </li>
          </ul>
        </div>
      </footer>
    </>
  );
}
