import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
  title: 'erd-editor',
  tagline: 'Entity-Relationship Diagram Editor',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://docs.erd-editor.io',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'dineug', // Usually your GitHub org/user name.
  projectName: 'erd-editor', // Usually your repo name.

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ko'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl: 'https://github.com/dineug/erd-editor-docs/blob/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
        gtag: {
          trackingID: ['G-T2T7XQTWW2'],
        },
      } satisfies Preset.Options,
    ],
  ],

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        hashed: true,
        language: ['en', 'ko'],
        indexDocs: true,
        indexBlog: false,
        indexPages: false,
        docsRouteBasePath: '/docs',
        highlightSearchTermsOnTargetPage: true,
        searchResultContextMaxLength: 80,
        explicitSearchResultPath: true,
      },
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/erd-editor-vscode.png',
    navbar: {
      title: 'erd-editor',
      logo: {
        alt: 'erd-editor Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'docs',
          label: 'Guide',
        },
        {
          type: 'docSidebar',
          position: 'left',
          sidebarId: 'api',
          label: 'API',
        },
        {
          href: 'https://erd-editor.io',
          position: 'left',
          label: 'Web App',
          target: '_blank',
        },
        {
          href: 'https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode',
          position: 'left',
          label: 'VSCode Extension',
          target: '_blank',
        },
        {
          href: 'https://plugins.jetbrains.com/plugin/23594-erd-editor',
          position: 'left',
          label: 'IntelliJ Plugin',
          target: '_blank',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
        {
          href: 'https://github.com/dineug/erd-editor',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    colorMode: {
      defaultMode: 'dark',
    },
    prism: {
      additionalLanguages: ['bash', 'typescript', 'json', 'javascript'],
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
