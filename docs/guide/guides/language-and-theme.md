---
sidebar_position: 14
description: The editor's 25 display languages, right-to-left layout, the theme builder's System, Light, and Dark appearances and its colors, and where each host keeps them.
---

# Language and Theme

The editor's own text comes in 25 languages, and its look is a theme: an appearance (`System`, `Light`, or `Dark`), a gray color, and an accent color.  
Both belong to the person using the editor, not to the diagram. Neither is saved in the file, recorded in the [undo history](./undo-redo.md), or shared with collaborators, so each person sees their own, and changing either never marks a file modified.

Neither is on the [Settings](./settings.md) tab. The toolbar has a `Theme` button and, right after it, a `Display Language` button, both after the [Find and Replace](./find-and-replace.md) button. [Quick Search](./quick-search.md) lists `Theme` and `Display Language` on every tab.  
The web app, Google Drive, VS Code, JetBrains IDEs, and Obsidian all offer both and remember your picks — see [In Each Host](#in-each-host). Both work in a read-only editor too.

## Display Language

The language covers the editor's own text: toolbar tooltips, context menus, Quick Search, panels and dialogs, the Settings tab, the [welcome screen](./editing-start.md#welcome-screen), toasts and messages, and the placeholder an empty name, data type, default, or comment shows on the canvas and in an exported image.  
It leaves these as written in every language: your table and column names, comments, and memos; database vendors, Code Generator languages, and file formats; data types, SQL keywords, and the `ON DELETE` and `ON UPDATE` actions; the Schema SQL options `Create`, `If not exists`, `Drop & re-create`, `USE`, and `CREATE + USE`; the marks `PK`, `UQ`, `AI`, `N-N`, `NULL`, and `AK1.1`; the name case and `Bracket` choices other than `None`; the names of keyboard keys; the theme builder's color names; generated SQL and code; and exported file names.

The languages, in the order the picker lists them:

| In the picker | Language | Code |
| --- | --- | --- |
| Bahasa Indonesia | Indonesian | `id-ID` |
| Deutsch | German | `de-DE` |
| English | English | `en` |
| Español | Spanish | `es-ES` |
| Euskara | Basque | `eu-ES` |
| Français | French | `fr-FR` |
| Italiano | Italian | `it-IT` |
| Nederlands | Dutch | `nl-NL` |
| Polski | Polish | `pl-PL` |
| Português | Portuguese | `pt-PT` |
| Português Brasileiro | Brazilian Portuguese | `pt-BR` |
| Română | Romanian | `ro-RO` |
| Slovenčina | Slovak | `sk-SK` |
| Slovenščina | Slovenian | `sl-SI` |
| Svenska | Swedish | `sv-SE` |
| Türkçe | Turkish | `tr-TR` |
| Русский | Russian | `ru-RU` |
| Українська | Ukrainian | `uk-UA` |
| עברית | Hebrew | `he-IL` |
| العربية | Arabic | `ar-SA` |
| فارسی | Persian | `fa-IR` |
| 日本語 | Japanese | `ja-JP` |
| 简体中文 | Simplified Chinese | `zh-CN` |
| 繁體中文 | Traditional Chinese | `zh-TW` |
| 한국어 | Korean | `ko-KR` |

The `Language` that Quick Search offers on the Code Generator tab, and the `Language` row of the [Lock](./settings.md#lock) list on the Settings tab, are the [Code Generator's target language](./code-generator.md#language), not the display language.

### Picking a Language

The `Display Language` button (a languages icon) opens the `Display Language` picker, a panel titled `Display Language` below the toolbar, over whichever tab is open.  
`System` comes first, with the language it stands for right now beside it, and stays in view while the list scrolls. The 25 languages follow, each in its own name, and a check marks the option in force.

![Switching the display language from the toolbar to 한국어, then to العربية, which mirrors the toolbar but not the diagram, and back to System](/img/demo-display-language.webp)

The panel opens with the keyboard on the checked row:

- `↑` and `↓` move through the rows and wrap around, and `Home` and `End` jump to the first and last.
- `Enter` or `Space` picks the focused row, as a click does.

A pick applies at once, closes the panel, and gives the keyboard back to the editor.

Close it without a pick with `Escape`, with the `x` button beside the title, whose tooltip reads `Close (ESC)`, with a press anywhere in the editor outside the panel except on the toolbar, or with the `Display Language` button again.  
Opening it closes the theme builder, Table Properties, and the Find and Replace panel. Opening Quick Search, the Find and Replace panel, or the theme builder closes it.

While the panel has the keyboard, a few editor shortcuts still work: `Search`, `Find and Replace`, `Undo`, `Redo`, `Zoom In`, `Zoom Out`, and `Zoom Reset` — see [Shortcuts](./settings.md#shortcuts). Every other editor shortcut, the arrow keys, and `Tab` go no further than the panel, so the editor does not act on them. Keys the editor does not bind, such as the host's own save, reach the host as usual.

In [Quick Search](./quick-search.md), `Display Language` lists `System` and the 25 languages, with a check on the option in force. A language is also found there by its English name or its code, so `german` or `de-DE` finds `Deutsch`.

### What System Follows

`System` is where the language starts in the web app, Google Drive, VS Code, JetBrains IDEs, and Obsidian. It follows the host's language:

- In the web app, Google Drive, and your own page: the browser's preferred languages. A change to them is followed at once.
- In VS Code: VS Code's display language.
- In a JetBrains IDE: the language the IDE shows its own interface in.
- In Obsidian: Obsidian's language.

`System` takes the first of those languages the editor has, and English when it has none of them.  
A regional variant counts as its language, so `de-AT` gives Deutsch and `fr-CA` gives Français. Chinese goes by script: a Traditional script gives 繁體中文 and any other script 简体中文. With no script named, Taiwan, Hong Kong, or Macau gives 繁體中文, and other Chinese gives 简体中文. Portuguese gives Português Brasileiro unless a region other than Brazil is named, so `pt-PT` gives Português; Obsidian's Portuguese also gives Português.

### Right-to-left Languages

עברית (Hebrew), العربية (Arabic), and فارسی (Persian) lay the editor out right to left: the toolbar, the menus, the panels and dialogs, Quick Search, and the Settings tab are mirrored. A context menu's submenus open to the left, and the toolbar's Undo and Redo icons swap, so that Undo points back the way a right-to-left reader goes.

The diagram itself is never mirrored. The canvas with its tables, columns, relationships, and memos stays left to right, and so do the minimap, the scrollbars, the [canvas toolbar](./table-related-functions.md#canvas-toolbar), [Visualization](./visualization.md) and its toolbar, the data type cells, the code on the Schema SQL and Code Generator tabs, the color picker, the diff viewer, time travel, and the Auto Layout preview.  
The Find and Replace panel stays at the left edge of the canvas.  
Names, comments, and other text you typed keep their own direction, so a Hebrew, Arabic, or Persian name reads right to left on the canvas as well.

## Theme

The `Theme` button (a contrast icon) opens the theme builder, a panel titled `Theme` below the toolbar, over whichever tab is open. It has three parts:

- `Accent color`: 26 swatches. Each one's tooltip names it, such as `indigo`.
- `Gray color`: 6 swatches, `gray`, `mauve`, `slate`, `sage`, `olive`, and `sand`.
- `Appearance`: `System`, `Light`, and `Dark`.

![Opening the theme builder from the toolbar, picking an accent and a gray color, and switching the appearance to Light and then to System](/img/demo-theme-builder.webp)

The choice in force in each part is marked, and a pick applies at once while the builder stays open.  
Picking a color leaves the appearance as it is, so a color picked under `System` keeps `System`.

`System` shows light or dark as the host does, and switches when the host does:

- In the web app, Google Drive, and your own page: the light or dark mode the browser reports, which follows the operating system.
- In VS Code: light under a light color theme, and dark under a dark one or either high contrast theme.
- In a JetBrains IDE: the IDE's light or dark theme.
- In Obsidian: Obsidian's light or dark theme.

Close the builder with `Escape`, with the `x` button beside the title, whose tooltip reads `Close (ESC)`, with a press anywhere in the editor outside the panel except on the toolbar, or with the `Theme` button again.  
Opening it closes Table Properties, the `Display Language` picker, and the Find and Replace panel. Opening Quick Search, the Find and Replace panel, or the `Display Language` picker closes it.  
The builder holds no keys back, so the editor's shortcuts work while it is open.

In [Quick Search](./quick-search.md), `Theme` lists `System`, `Light`, and `Dark`, with a check on the appearance in force. Picking one changes the appearance alone and leaves the gray and accent colors as they are.

## In Each Host

What you pick in the editor, from the toolbar or Quick Search, is saved where the host keeps it, and every open diagram follows a change to it at once, wherever it is made.  
In VS Code, a JetBrains IDE, and Obsidian, the host's `Auto` (the value `auto` in VS Code) is the editor's `System`. Picking `System` stores `Auto`, and picking `Light` or `Dark` stores that appearance, even when `Auto` was showing it already.  
The extension's and the plugins' own settings and notices are in English whatever the display language.

### Web App and Google Drive

On erd-editor.io, its collaboration sessions included, and in Google Drive, one language and one theme serve the app and every diagram in it.  
Both are kept in this browser, not in the schema or the Drive file, and every erd-editor.io tab shares them: a pick in one tab changes the others at once.

The language is `System`, which follows the browser's preferred languages, until you pick one.  
The app's own text, such as the sidebar, the trash, collaboration, and the Google Drive screens, follows the same language, and in Hebrew, Arabic, and Persian the whole app is laid out right to left. The Privacy Policy, Terms of Service, and support pages stay in English.  
Besides the editor's panel and Quick Search, the bottom row of the sidebar has a language button, whose tooltip reads `Display Language`, beside the `Privacy` and `Terms` links. Its menu lists `System`, with the language it stands for, and then the 25 languages.

The theme starts at `System`, with the gray color `olive` and the accent color `jade`.  
Besides the theme builder and Quick Search, the bottom of the sidebar has three icon buttons, `System`, `Light`, and `Dark`: beside `Trash` on erd-editor.io, and beside `Sign out` in Google Drive. They set the same appearance as the builder.

### VS Code

The extension's settings are under ERD Editor in VS Code's Settings:

| Setting | Values | Default |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto`, or a code from the [language table](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | the six gray colors | `slate` |
| `dineug.erd-editor.theme.accentColor` | the 26 accent colors | `indigo` |

The Settings editor lists the language setting as `Auto` and then each language by its own name. A value in `settings.json` that names no language reads as `auto`.  
A theme pick in the editor writes all three theme settings. A pick is written where its setting is already set: the workspace folder, else the workspace, else the user settings.

### JetBrains IDEs

Settings | Tools | ERD Editor has `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:`, and `Display language:` (`Auto`, then each language by its own name), kept for the whole IDE.  
They start at `Auto`, `Slate`, `Indigo`, and `Auto`.

### Obsidian

Settings → ERD Editor has `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color`, and `Display language` (`Auto`, then each language by its own name), kept per vault.  
They start at `Auto`, `Slate`, `Indigo`, and `Auto`.  
A change applies to every ERD tab of the vault, those in popout windows included.

### Your Own Page

An `<erd-editor>` in your own page shows no `Theme` or `Display Language` button, and Quick Search lists neither, until the page turns them on with [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) and [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Until the page sets a language or the reader picks one, the editor shows English, or follows `System` while `enableLocalePicker` is on.  
The theme starts at `Dark`, with the gray color `slate` and the accent color `indigo`, unless the page sets another or turns on [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
A reader's pick applies at once, but the element saves neither choice: the page sets the starting ones and saves the reader's picks itself — see [Theme](../../api/erd-editor-element.md#theme) and [Display Language](../../api/erd-editor-element.md#display-language) in the API.
