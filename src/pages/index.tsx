import Link from '@docusaurus/Link';
import Translate, { translate } from '@docusaurus/Translate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './index.module.css';

// siteConfig.tagline cannot be translated through code.json, so the hero
// subtitle is its own translatable string.
const tagline = () =>
  translate({
    id: 'homepage.tagline',
    message: 'Entity-Relationship Diagram Editor',
    description: 'The hero subtitle and the browser tab title of the homepage',
  });

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{tagline()}</p>
        <img
          className={styles.heroImage}
          src={require('@site/static/img/erd-editor-vscode.png').default}
          alt={translate({
            id: 'homepage.heroImageAlt',
            message: 'erd-editor running inside VS Code',
            description: 'Alt text for the homepage screenshot',
          })}
          width={1279}
          height={881}
        />
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/category/guides"
          >
            <Translate
              id="homepage.cta"
              description="Label of the call-to-action button on the homepage"
            >
              Editing Guide — 5 min ⏱️
            </Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title={tagline()}
      description={translate({
        id: 'homepage.metaDescription',
        message:
          'erd-editor is an Entity-Relationship Diagram editor available as a web app, a VSCode extension, an IntelliJ plugin, and an embeddable web component.',
        description: 'The meta description of the homepage',
      })}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
