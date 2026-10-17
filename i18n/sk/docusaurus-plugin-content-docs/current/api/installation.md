---
sidebar_position: 1
description: Inštalácia balíka @dineug/erd-editor z npm alebo CDN, pripojenie vlastného elementu, prepojenie dialógových okien súborov a prechod z verzie 3.x.
---

# Inštalácia

```sh
npm install @dineug/erd-editor
```

Balík je určený výhradne pre ESM (`"type": "module"`) a obsahuje iba priečinok `dist`.
Zostavenie CommonJS neexistuje, takže volanie `require('@dineug/erd-editor')` nefunguje.

Závislosti balíka za behu zostávajú externé, ako importy podľa samotného názvu balíka (bare imports), ktoré bundler rozrieši, zbaví duplicít a očistí od nepoužívaného kódu (tree shaking).
Shared workery balíka sa generujú ako samostatné vstupné súbory v priečinku `dist/workers/` a vytvárajú sa pomocou `new URL('./…', import.meta.url)`, teda zápisu, ktorý Vite, webpack 5 a Rspack zabalia ako vstupný bod workera. Pozrite si časť [Web Workers](#web-workers).
Pre stránku bez bundlera existuje druhé, samostatné zostavenie – pozrite si časť [Značka script](#script-tag).

## Použitie {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

Element `<erd-editor>` nemá vlastnú veľkosť. Nastavte jemu (alebo jeho kontajneru) explicitnú šírku a výšku.
Od verzie `4.1.0` je otvorený [prieskumník](../guide/guides/explorer.md) ukotvený vnútri elementu naľavo od plátna ERD a plátno nezakrýva, ale zužuje. Nový editor sa spúšťa so zatvoreným prieskumníkom.
Panel sa nikdy nevykreslí užší ako `200px` a plátnu ponechá aspoň `320px`, takže v elemente užšom ako `520px` sa otvorený prieskumník nevykreslí, kým sa element nerozšíri – pozrite si časť [Vedľa plátna](../guide/guides/explorer.md#beside-the-canvas).

Volanie `setInitialValue('')` začne nový, prázdny dokument. Priradenie vlastnosti `value` naopak načíta dokument ako úpravu, takže sa dostane do histórie zmien.
Od verzie `4.0.0` je vlastnosť `editor.value` dokument vo forme, v akej ho uchováva súbor, a práve ju treba ukladať. Vlastnosť `editor.runtimeValue` je dokument tak, ako ho uchováva editor, vrátane odstránených entít: slúži na inicializáciu spolupracovníka a nikdy sa nedostane do súboru – pozrite si časť [runtimeValue](./erd-editor-element.md#runtimevalue).
Od verzie `4.0.0` má nový dokument zapnuté aj všetky [zamknutia nastavení](../guide/guides/settings.md#lock): zobrazovacej oblasti, karty, jazyka na karte Generátor kódu, oboch štýlov názvov a typu úvodzoviek. Posúvanie, zmena priblíženia, prepínanie kariet alebo zmena niektorého z týchto nastavení ponechá `editor.value` bez zmeny a nevyvolá udalosť `change`. Dokument načítaný z textu si ponechá zamknutia, ktoré uvádza. Dokument, ktorý žiadne neuvádza, napríklad každý súbor uložený pred verziou `4.0.0`, sa otvorí so všetkými zamknutiami zapnutými, s priblížením 100 % a na karte ERD bez ohľadu na to, aké zobrazenie a akú kartu uložil. Jeho zobrazenie je zamknuté v počiatku `0, 0` a otvorí sa namiesto toho na diagrame, ak sa tam nevykresľuje žiadna jeho časť – pozrite si časť [setInitialValue](./erd-editor-element.md#setinitialvalue).
Zvyšok API opisuje stránka [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

Služba `esm.run` za vás rozrieši externé závislosti balíka, takže tento spôsob funguje bez bundlera.
Adresa URL bez verzie vždy poskytuje najnovšiu verziu. Ak nechcete, aby sa na vašu stránku bez ohlásenia dostala nová hlavná verzia, pripnite si verziu – `https://esm.run/@dineug/erd-editor@4.1.0`.
Verzia `4.0.0` je práve takou novou hlavnou verziou: stránka, ktorá musí zostať na verzii 3.x, si pripne `@3.10.0` – pozrite si časť [Prechod z verzie 3.x](#upgrading-from-3x).

### Značka script {#script-tag}

Od verzie `3.6.0` balík obsahuje aj zostavenie UMD, v ktorom sú všetky závislosti a všetky shared workery v jednom súbore.
Práve naň odkazujú polia `unpkg` a `jsdelivr`, takže ho na oboch CDN poskytuje adresa URL so samotným názvom balíka. Toto zostavenie definuje objekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Jeho načítanie zaregistruje element `<erd-editor>` rovnakým spôsobom; objekt `window.ErdEditor` obsahuje dve spätné volania pre súbory, `ErdEditor.setExportFileCallback` a `ErdEditor.setImportFileCallback`, a od verzie `3.9.2` aj `ErdEditor.createKeyBindingMap`.
Mapa exportov naďalej smeruje bundler na moduly ES, takže inštalácia z npm tento súbor nikdy nepoužije.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Od verzie `4.0.0` atribút `enable-locale-picker` pridá na panel nástrojov výber jazyka `Display Language` a atribút `enable-welcome-screen` uvítaciu obrazovku, ktorú zobrazuje prázdny diagram – pozrite si časti [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) a [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Stránka, ktorá načítava dokument, ako to robí príklad v časti [Použitie](#usage), zapne vlastnosť `enableWelcomeScreen` až potom, ako ho metóda `setInitialValue()` načíta, a nie priamo v kóde HTML, takže obrazovka nikdy nepreblikne nad súborom, ktorý sa ešte načítava.
Všetkých 25 jazykov zobrazenia je súčasťou balíka, v zostavení ES rovnako ako v zostavení pre značku script, takže netreba poskytovať žiadny jazykový súbor ani nič registrovať. Bez výberu jazyka a bez volania `setLocale()` editor zobrazuje angličtinu.

Pridanie atribútu `readonly` na tomto mieste zablokuje úpravy: priradenie vlastnosti `value`, volanie `clear()` a každé volanie `setSchema*()` – vrátane `setSchemaJSON()` a volania v režime pridávania – sa ignorujú a udalosť `change` sa nikdy nevyvolá. Čítanie `editor.value` a `editor.runtimeValue` naďalej funguje. Dokument namiesto toho načítajte metódou `setInitialValue()`.

### Vykresľovanie na strane servera {#server-side-rendering}

Import balíka zaregistruje vlastný element na úrovni modulu, takže potrebuje DOM a v prostredí Node vyvolá výnimku.
V rámcoch Next.js, Nuxt, SvelteKit alebo Astro ho importujte z kódu, ktorý beží iba na klientovi.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Import balíka pridá `erd-editor` do rozhrania `HTMLElementTagNameMap`, takže element má typ aj bez pretypovania.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Typ `ErdEditorElement` sa exportuje na typové anotácie vašich vlastných premenných a vlastností (props).
Od verzie `4.0.0` balík exportuje aj typy `LocaleCode`, `LocaleOption` a `SchemaSQLOptions` – pozrite si časť [Vstupné body](#entry-points). Možnosti, ktoré prijímajú metódy `setSchema*()`, nemajú exportovaný názov; odvoďte ich z elementu ako `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Zvýrazňovanie syntaxe {#syntax-highlighting}

Panely Schéma SQL a Generátor kódu zvýrazňuje knižnica [Shiki](https://shiki.style) vo vlastnom shared workeri a od verzie `4.0.0` aj skripty `Before tables` a `After tables` na karte Schéma SQL.
Od verzie `3.7.0` netreba nič inštalovať ani registrovať: worker sa vytvorí pri prvom vykreslení panela s kódom, takže stránka, ktorá žiadny taký panel neotvorí, gramatiky nikdy nestiahne.

| | |
| --- | --- |
| Jazyky | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Motívy | `github-dark` a `github-light` podľa svetlého alebo tmavého vzhľadu editora |

Sú to presne jazyky, ktoré panely generujú: `JPA` sa zvýrazňuje ako Java, `SQLAlchemy` ako Python, `TypeORM`, `Sequelize`, `Drizzle` a `Zod` ako TypeScript, `Doctrine` ako PHP, `SeaORM` ako Rust, `JSON Schema` ako JSON a `DBML` aj `AML` ako SQL, čo je najbližšia gramatika v balíku – pozrite si stránku [Generátor kódu](../guide/guides/code-generator.md).

Modul regulárnych výrazov je čistý kód JavaScript, takže žiadna politika hostiteľa nemusí povoľovať `wasm-unsafe-eval`.
V prostrediach bez rozhrania `SharedWorker` – Chrome v systéme Android, Safari pred verziou 16.4 – sa chyba zaznamená do protokolu a kód sa zobrazí ako obyčajný text; skripty sa dajú naďalej upravovať.

Prechod z verzie `3.6.0` alebo staršej: balík `@dineug/erd-editor-shiki-worker` sa už nepublikuje a funkcia `setGetShikiServiceCallback` zanikla spolu s ním.
Odstráňte inštaláciu aj registráciu; stránka, ktorá načítavala worker z CDN, odstráni aj tú druhú značku `<script>`.

## Web Workers {#web-workers}

Editor spúšťa tri úlohy v inštanciách `SharedWorker`: zvýrazňovanie syntaxe, export obrázka a rozloženie tabuliek, na ktorom stojí [automatické rozloženie](../guide/guides/table-related-functions.md#auto-layout), [režim Flow](../guide/guides/visualization.md#how-flow-is-placed) na karte Vizualizácia a od verzie `4.0.0` aj rozmiestnenie importovanej schémy.
Všetky tri sú súčasťou balíka `@dineug/erd-editor`. Žiadny z nich nemusíte nastavovať, ale každý z nich môže hostiteľ zablokovať.
Worker, ktorý vykonával zber nepotrebných údajov (garbage collection) dokumentu, bol vo verzii `4.0.0` odstránený spolu so samotným zberom.

| Worker | Bez neho |
| --- | --- |
| Zvýrazňovanie syntaxe | Panely Schéma SQL a Generátor kódu a skripty na karte Schéma SQL zostanú obyčajným textom |
| Export obrázka | Export PNG a SVG, `Copy to clipboard` a ukážka v dialógovom okne `Export image` sa vykresľujú v hlavnom vlákne, čo počas vykresľovania blokuje stránku |
| Rozloženie tabuliek | Rozloženia `Flow`, `Tree - vertical` a `Tree - horizontal` automatického rozloženia a režim Flow na karte Vizualizácia skončia hlásením `Could not place tables`; import rozmiestňovaný rozložením Flow – súbor SQL, GraphQL, DBML alebo AML z položky `Import` alebo `Import and Add` alebo volanie `setSchema*()` s `placement: 'auto'` – vloží svoje tabuľky do riadkov bez akéhokoľvek hlásenia; rozloženia `Force` a režimu Graph sa to netýka, pretože bežia vnútri editora |

Export obrázka čaká na odpoveď svojho workera desať sekúnd a potom kreslí v hlavnom vlákne a zvýrazňovanie syntaxe ponechá kód ako obyčajný text, hneď ako jeho worker zlyhá, takže hostiteľ, ktorý blokuje workery, prichádza o výkon, nie o funkčnosť.
Výnimkou je rozloženie tabuliek: modul, ktorý rozloženie počíta, je väčší ako samotný editor a nikdy sa nenačítava v rámci toho istého procesu, takže pri prvom rozmiestnení čaká na svoj worker tridsať sekúnd a keď už worker odpovedal, dá výpočtu rozloženia šesťdesiat sekúnd na vrátenie výsledku.
Ak niektorá z týchto čakacích lehôt uplynie, rozmiestnenie skončí rovnako ako bez workera. Automatické rozloženie zobrazí upozornenie `Placing tables` hneď na začiatku, zatiaľ čo režim Flow a import rozmiestňovaný rozložením Flow ho zobrazia až vtedy, keď rozmiestňovanie vrátane spustenia jeho workera trvá už šesť sekúnd.

V zostavení spracovanom bundlerom sa všetky tri generujú ako súbory vedľa balíka, takže prísna politika CSP potrebuje `worker-src 'self'` – a navyše `blob:` tam, kde bundler vkladá worker priamo do kódu.
V zostavení pre [značku script](#script-tag) sú všetky tri priamo v súbore ako adresy URL `data:`, takže taká stránka namiesto toho potrebuje `worker-src data:`.

## Vstupné body {#entry-points}

Import balíka `@dineug/erd-editor` zaregistruje element `<erd-editor>` ako vedľajší účinok. Okrem toho exportuje typ elementu, dva settery spätných volaní, od verzie `3.9.2` predvolené klávesové skratky s ich typmi a od verzie `4.0.0` typy jazykov zobrazenia a typ možností metódy `getSchemaSQL()`.

| Export | Popis |
| --- | --- |
| `ErdEditorElement` (typ) | Rozhranie elementu – pozrite si stránku [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Nahrádza sťahovanie v prehliadači, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nahrádza výber súboru v prehliadači, `({ type, op, accept, mode }) => void`; `mode` od verzie `4.0.0`. |
| `createKeyBindingMap()` | Pri každom volaní vráti predvolené klávesové skratky ako nový objekt `KeyBindingMap` – pozrite si časť [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typy) | Mapa klávesových skratiek, zjednotenie (union) názvov jej príkazov a jedna klávesová skratka. |
| `LocaleCode`, `LocaleOption` (typy) | Od verzie `4.0.0`. Kódy 25 jazykov zobrazenia a tieto kódy spolu s `'system'`, ktoré prijíma metóda `setLocale()` – pozrite si časť [Jazyk zobrazenia](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Od verzie `4.0.0`. Možnosti `statements` a `header`, ktoré prijíma metóda `getSchemaSQL()` – pozrite si časť [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Druhým vstupným bodom je `@dineug/erd-editor/engine.js`. Spúšťa úložisko dokumentu bez DOM, takže funguje v prostredí Web Worker – pozrite si stránku [Vzdialené ukladanie](./advanced/remote-storage.md).
Exportuje funkciu `createReplicationStore` a typ `ReplicationStore`. Od verzie `3.10.0` exportuje aj typ `ReplicationChange`, `{ value: string; changed: boolean }`, ktorý dostáva poslucháč udalosti `change` repliky – pozrite si časť [on@change](./advanced/remote-storage.md#onchange).
Od verzie `4.0.0` má objekt `ReplicationStore` aj vlastnosť `runtimeValue`. Jeho vlastnosť `value` a hodnota, ktorú odovzdá udalosť `change`, sú v úložnej forme, v akej ich uchováva súbor, rovnako ako v prípade elementu – pozrite si časť [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Od verzie `3.9.1` existuje tretí vstupný bod, `@dineug/erd-editor/peer.js`: účastník bez používateľského rozhrania (headless), prostredníctvom ktorého [server MCP](../mcp/introduction.md) upravuje dokument. Existuje pre tento server a tieto stránky ho neopisujú.

### Dialógové okná súborov {#file-dialogs}

Import a export prechádzajú cez nastaviteľné spätné volania, takže hostiteľ bez dialógového okna súborov prehliadača – napríklad webview v IDE – môže poskytnúť vlastné.
Tieto dve spätné volania nie sú symetrické: export vám odovzdá hotový súbor, kým import o súbor iba požiada, a obsah do editora vložíte späť sami.

Parameter `op` je `set` alebo `diff` – `diff` smeruje do metódy `setDiffValue()` bez ohľadu na hodnotu `type`. Inak metódu určuje parameter `type` a parameter `accept` obsahuje prípony daného typu, pripravené na odovzdanie dialógovému oknu súborov hostiteľa.
Od verzie `4.0.0` obsahuje operácia `set` hodnotu `mode: 'append'`, keď používateľ vybral možnosť [Importovať a pridať](../guide/guides/file-import-export.md#import-and-add), a pri obyčajnom importe parameter `mode` chýba. Odovzdajte ho ďalej: spätné volanie, ktoré ho zahodí, nahradí diagram, do ktorého chcel používateľ pridávať.

| `type` | `accept` | Metóda |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Možnosť `placement: 'auto'` rozmiestni tabuľky podľa ich vzťahov ešte pred ich vložením, rovnako ako vlastný import editora, a spôsobí, že volanie vráti objekt Promise. Bez nej sa tabuľky okamžite vložia do riadkov – pozrite si časti [setSchemaSQL](./erd-editor-element.md#setschemasql) a [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Pre každú hodnotu `type`, ktorú spracúvate, majte samostatnú vetvu a ostatné hodnoty ignorujte.
Nahrádzajúce volanie `setSchemaJSON()`, rovnako ako priradenie vlastnosti `value`, pred spracovaním vymaže dokument, takže smerovanie obsahu, ktorý nie je dokumentom `.erd.json`, do tohto volania – cez univerzálnu vetvu `else` alebo preto, že neskôr pridaný `type` prepadol až sem – diagram vyprázdni namiesto toho, aby sa čokoľvek importovalo.

Hodnota `fileName`, ktorú editor vygeneruje, je `<database name>-<timestamp>` s príponou súboru, kde časová pečiatka je miestny čas vo formáte `yyyy-MM-dd'T'HH_mm_ss`. Ak je názov databázy prázdny, použije sa `unnamed`.
Spätné volanie exportu dostáva tieto súbory. Od verzie `4.0.0` medzi ne patria aj súbor SVG a súbory z karty Generátor kódu, pričom súbor `.sql` pochádza z tlačidla `Save file` na karte Schéma SQL, a nie priamo z ponuky `Export`.

| Súbor | Prípona | `type` objektu Blob |
| --- | --- | --- |
| Export JSON | `.erd.json` | `application/json` |
| Súbor z tlačidla `Save file` na karte Schéma SQL s textom, ktorý karta zobrazuje – pozrite si stránku [Schéma SQL](../guide/guides/schema-sql.md) | `.sql` | žiadny |
| Dialógové okno [Exportovať obrázok](../guide/guides/file-import-export.md#image) | `.png` alebo `.svg` | `image/png` alebo `image/svg+xml` |
| Súbor z tlačidla `Save file` na karte Generátor kódu – pozrite si stránku [Generátor kódu](../guide/guides/code-generator.md) | Podľa jazyka: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` alebo `.mmd` | žiadny |

Hostiteľ, ktorý vyberá obslužnú funkciu podľa prípony, potrebuje jednu pre každý z nich.

Ak spätné volania nenastavíte, editor použije vlastné správanie prehliadača pri sťahovaní a výbere súborov. Na návrat k nemu odovzdajte `null`.

## Podpora prehliadačov {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – základná úroveň ES2022, pre ktorú sú publikované zostavenia vytvorené.
Žiadne polyfilly nie sú pribalené. Ak potrebujete podporovať staršie prehliadače, pridajte vlastné.

## Prechod z verzie 3.x {#upgrading-from-3x}

Verzia `4.0.0` je novou hlavnou verziou. Pri prechode stránky z verzie 3.x skontrolujte každý z týchto bodov:

- Vlastnosť `editor.value`, vlastnosť `value` repliky a hodnota `value`, ktorú odovzdá jej udalosť `change`, sú v úložnej forme, v akej ich uchováva súbor: bez odstránených entít, nameraných šírok, poradia prekrývania a bodov ukotvenia vzťahov. Naďalej ukladajte vlastnosť `value` a tieto údaje čítajte z vlastnosti `runtimeValue`; časové pečiatky entít (`meta`) úplne zanikli. Spolupracovníka alebo repliku, ktorá sa pripája k prebiehajúcej relácii, inicializujte z vlastnosti `runtimeValue` spusteného účastníka, nie z `value` ani zo súboru, a `runtimeValue` nikdy neukladajte – pozrite si časti [value](./erd-editor-element.md#value) a [runtimeValue](./erd-editor-element.md#runtimevalue).
- Zamknutia nastavení nahrádzajú možnosti `Save Scroll Information` a `Save Zoom Information`. Nový dokument, ako aj každý dokument uložený pred verziou `4.0.0`, má zapnuté všetky zamknutia, takže posunutie, zmena priblíženia, prepnutie karty alebo zmena jazyka na karte Generátor kódu, štýlu názvov či typu úvodzoviek ponechá `value` bez zmeny a nevyvolá udalosť `change`. Stránka, ktorá si uchovávala zobrazenie prostredníctvom udalosti `change`, potrebuje mať na karte Nastavenia odomknuté nastavenie `Viewport` (a kvôli karte aj `Canvas Type`) alebo dokument, ktorého pole `settings.lockSettings` ponecháva tieto bity vynulované – pozrite si časť [Zamknutie](../guide/guides/settings.md#lock).
- Objekt `settings` už nemá polia `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ani `ignoreSaveSettings` a konštanty `SaveSettingType` zanikli. Pole `settings.lockSettings` s bitmi `LockSettingType` nahrádza pole `ignoreSaveSettings`, ktoré verzia `4.0.0` alebo novšia nečíta ani nezapisuje – pozrite si časť [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema), ktorú každý súbor uvádza v poli `$schema`, teraz opisuje iba úložnú formu a je uzavretá: odmietne súbor uložený staršou verziou, kým ho uloženie vo verzii `4.0.0` alebo novšej neprepíše.
- Zber nepotrebných údajov dokumentu zanikol spolu so svojím workerom, takže odstránená entita zostáva vo vlastnosti `runtimeValue`, kým sa dokument znova neotvorí zo svojho súboru. Zostávajú tri shared workery – pozrite si časť [Web Workers](#web-workers).
- Všetky editory a repliky v zdieľanej relácii udržiavajte vo verzii `4.0.0` alebo novšej. Staršia verzia ignoruje nové typy akcií: akcie skupín tabuliek, dialógového okna Mapovať stĺpce, zamknutí a skriptov na karte Schéma SQL – pozrite si časť [Kombinovanie verzií](./advanced/collaborative-editing.md#mixing-releases).
- Spätné volanie importu dostáva pri možnosti Importovať a pridať hodnotu `mode: 'append'`, ktorú musí odovzdať ďalej. Spätné volanie exportu teraz dostáva aj súbory `.svg` a súbory z karty Generátor kódu. Položka `Export` ▸ `Schema SQL` namiesto uloženia otvorí kartu Schéma SQL, takže súbor `.sql` prichádza iba z tlačidla `Save file` na tejto karte – pozrite si časť [Dialógové okná súborov](#file-dialogs).
- Klávesy `Delete` a `Backspace` sú priradené novému príkazu `removeSelection`. Kým má editor fokus mimo textového poľa, predvolené správanie klávesu sa na každej karte potlačí a na karte ERD sa odstráni výber. Do typov `KeyBindingName` a `KeyBindingMap` tento príkaz pribudol a volanie `setKeyBindingMap({ removeSelection: [] })` ponechá oba klávesy stránke – pozrite si časť [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Pole `ThemeOptions.appearance` prijíma aj `'system'`, teda možnosť `System` vo výbere motívu, ktorú nastaví zapnutie atribútu `systemDarkMode`. Udalosť `changePresetTheme` hlási `'system'`, kým je táto možnosť vybratá, preto túto hodnotu uložte bez zmeny a odovzdajte ju späť metóde `setPresetTheme`. Keď je atribút `systemDarkMode` zapnutý, volanie `setPresetTheme()` s hodnotou `'light'` alebo `'dark'` teraz zostane platné namiesto toho, aby ho prepísala ďalšia zmena v operačnom systéme – pozrite si časti [systemDarkMode](./erd-editor-element.md#systemdarkmode) a [changePresetTheme](./erd-editor-element.md#changepresettheme).
- Balík `@dineug/erd-editor-mcp` `1.0.0`, rozšírenie pre VS Code vo verzii `4.0.0` alebo novšej a doplnky pre Obsidian a JetBrains vo verzii `1.0.0` alebo novšej používajú protokol hubu verzie 2. Server vo verzii `1.0.0` a staršia verzia editora, ktorá obsluhuje agentov, alebo starší server a jeden z týchto editorov sa navzájom odmietnu chybou `protocolMismatch`, ktorá uvádza stranu, ktorú treba aktualizovať – pozrite si časť [Aktualizácia](../mcp/installation.md#updating).
- Adresa URL na CDN bez verzie teraz poskytuje najnovšiu verziu 4.x. Ak chcete zostať na verzii 3.x, pripnite `@3.10.0` – pozrite si časť [CDN](#cdn).
