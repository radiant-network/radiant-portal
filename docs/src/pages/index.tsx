import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type Guide = {
  to: string;
  title: ReactNode;
  description: ReactNode;
};

const guides: Guide[] = [
  {
    to: '/docs/user-guide/intro',
    title: <Translate id="homepage.guides.user.title">User guide</Translate>,
    description: (
      <Translate id="homepage.guides.user.description">
        Use the portal: explore cases, filter variants and browse files.
      </Translate>
    ),
  },
  {
    to: '/docs/technical-guide/intro',
    title: <Translate id="homepage.guides.technical.title">Technical guide</Translate>,
    description: (
      <Translate id="homepage.guides.technical.description">
        Architecture, data model, API, deployment and contribution.
      </Translate>
    ),
  },
];

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={styles.hero}>
      <div className="container">
        <Heading as="h1" className={styles.title}>
          {siteConfig.title}
        </Heading>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/user-guide/intro">
            <Translate id="homepage.button.userGuide">User guide</Translate>
          </Link>
          <Link className="button button--outline button--primary button--lg" to="/docs/technical-guide/intro">
            <Translate id="homepage.button.technicalGuide">Technical guide</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={translate({ id: 'homepage.title', message: 'Radiant documentation' })}
      description={translate({ id: 'homepage.description', message: 'Documentation of the Radiant portal' })}>
      <HomepageHeader />
      <main className="container">
        <div className={styles.guides}>
          {guides.map(guide => (
            <Link key={guide.to} className={styles.card} to={guide.to}>
              <Heading as="h2" className={styles.cardTitle}>
                {guide.title} <span aria-hidden="true">→</span>
              </Heading>
              <p className={styles.cardText}>{guide.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </Layout>
  );
}
