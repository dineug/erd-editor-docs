import Translate, { translate } from '@docusaurus/Translate';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import type { ReactNode } from 'react';

import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: translate({
      id: 'homepage.feature.easy.title',
      message: 'Easy to Use',
    }),
    description: (
      <Translate id="homepage.feature.easy.description">
        Focuses on simplicity and core functionalities.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.feature.editing.title',
      message: 'Editing Experience',
    }),
    description: (
      <Translate id="homepage.feature.editing.description">
        The project's top priority is the user's editing experience.
      </Translate>
    ),
  },
  {
    title: translate({
      id: 'homepage.feature.portability.title',
      message: 'Portability',
    }),
    description: (
      <Translate id="homepage.feature.portability.description">
        Developed using standard web components, making it usable anywhere
        regardless of the framework.
      </Translate>
    ),
  },
];

function Feature({ title, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h2" className={styles.featureTitle}>
          {title}
        </Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
