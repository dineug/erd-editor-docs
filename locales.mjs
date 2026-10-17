// Every locale the docs are published in, in the order the locale menu lists them: the editor's own
// Display Language order (packages/erd-editor/src/i18n/locales.ts in erd-editor), each by its own name.
// docusaurus.config.ts builds its i18n config from this list, and scripts/build.mjs builds each locale.
//
// `search` is the @easyops-cn/docusaurus-search-local `language` for the locale's index — see the note
// above `searchLanguage` in docusaurus.config.ts for ja, ko and the Chinese locales. lunr-languages has
// no Basque, Indonesian, Slovak or Slovenian, so those index with English alone; their words are Latin
// script, which lunr's default trimmer keeps. That trimmer drops every word written wholly outside
// ASCII, so Persian borrows Arabic's word characters and Ukrainian Russian's.

/** @type {ReadonlyArray<{ code: string; label: string; direction?: 'rtl'; search: string[] }>} */
export const locales = [
  { code: 'id', label: 'Bahasa Indonesia', search: ['en'] },
  { code: 'de', label: 'Deutsch', search: ['en', 'de'] },
  { code: 'en', label: 'English', search: ['en'] },
  { code: 'es', label: 'Español', search: ['en', 'es'] },
  { code: 'eu', label: 'Euskara', search: ['en'] },
  { code: 'fr', label: 'Français', search: ['en', 'fr'] },
  { code: 'it', label: 'Italiano', search: ['en', 'it'] },
  { code: 'nl', label: 'Nederlands', search: ['en', 'nl'] },
  { code: 'pl', label: 'Polski', search: ['en', 'pl'] },
  { code: 'pt-PT', label: 'Português', search: ['en', 'pt'] },
  { code: 'pt-BR', label: 'Português Brasileiro', search: ['en', 'pt'] },
  { code: 'ro', label: 'Română', search: ['en', 'ro'] },
  { code: 'sk', label: 'Slovenčina', search: ['en'] },
  { code: 'sl', label: 'Slovenščina', search: ['en'] },
  { code: 'sv', label: 'Svenska', search: ['en', 'sv'] },
  { code: 'tr', label: 'Türkçe', search: ['en', 'tr'] },
  { code: 'ru', label: 'Русский', search: ['en', 'ru'] },
  { code: 'uk', label: 'Українська', search: ['en', 'ru'] },
  { code: 'he', label: 'עברית', direction: 'rtl', search: ['en', 'he'] },
  { code: 'ar', label: 'العربية', direction: 'rtl', search: ['en', 'ar'] },
  { code: 'fa', label: 'فارسی', direction: 'rtl', search: ['en', 'ar'] },
  { code: 'ja', label: '日本語', search: ['ja'] },
  { code: 'zh-CN', label: '简体中文', search: ['en', 'zh'] },
  { code: 'zh-TW', label: '繁體中文', search: ['en', 'zh'] },
  { code: 'ko', label: '한국어', search: ['en', 'ko'] },
];
