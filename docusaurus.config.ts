import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

// Search language must be chosen per locale, because @easyops-cn/docusaurus-search-local
// cannot serve CJK locales from one shared index:
//   - any `language` containing `zh` forces `lunr.zh.tokenizer` on every index, and that
//     tokenizer only matches /\w+|\p{Unified_Ideograph}+/u — it silently drops kana AND
//     hangul, breaking both Japanese and Korean search.
//   - Japanese only gets its TinySegmenter tokenizer when `language` is exactly ['ja']
//     (see the plugin's buildIndex/tokenize: a multi-language list falls back to the
//     whitespace tokenizer, which cannot split Japanese).
// Docusaurus sets DOCUSAURUS_CURRENT_LOCALE when it loads this config for a locale.
// The plugin caches its lunr setup in module state, so each locale must be built in its
// own process — that is why `pnpm build` runs one `docusaurus build --locale ...` per locale.
const currentLocale = process.env.DOCUSAURUS_CURRENT_LOCALE ?? 'en';
const searchLanguage = {
  ko: ['en', 'ko'],
  ja: ['ja'],
  'zh-CN': ['en', 'zh'],
}[currentLocale] ?? ['en'];

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
    locales: ['en', 'ko', 'ja', 'zh-CN'],
    // baseUrl is set explicitly so that a single-locale build
    // (`docusaurus build --locale ko`) still emits /ko/ and writes to build/ko.
    // Docusaurus otherwise flattens a single-locale build to baseUrl '/'.
    localeConfigs: {
      en: { label: 'English', baseUrl: '/' },
      ko: { label: '한국어', baseUrl: '/ko/' },
      ja: { label: '日本語', baseUrl: '/ja/' },
      'zh-CN': { label: '简体中文', baseUrl: '/zh-CN/' },
    },
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
        language: searchLanguage,
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
