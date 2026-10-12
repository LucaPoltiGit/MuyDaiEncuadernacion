import { Link } from 'react-router';
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
    { href: SOCIAL_LINKS.facebook, label: text.footer.facebook, icon: 'facebook' as const },
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
            <h2 className={styles.columnTitle}>{text.footer.withdrawalTitle}</h2>
            <p className={styles.muted}>{text.footer.withdrawalText}</p>
            <Link
              to={ROUTES.withdrawal}
              className={buttonClassName({ variant: 'inverse', className: styles.withdrawal })}
            >
              {text.footer.withdrawalButton}
            </Link>
          </div>
        </div>

        <div className={styles.legal}>
          <p>{text.footer.copyright(year)}</p>
          <a href={CONSUMER_DEFENSE_URL} target="_blank" rel="noreferrer">
            {text.footer.consumerDefense}
          </a>
        </div>
      </footer>
    </>
  );
}
