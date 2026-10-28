---
sidebar_position: 1
description: Inštalácia balíka @dineug/erd-editor z npm alebo CDN, registrácia elementov editora a prehliadača, prepojenie dialógových okien súborov a prechod z verzie 4.x alebo 3.x.
---

# Inštalácia

```sh
npm install @dineug/erd-editor
```

Balík je určený výhradne pre ESM (`"type": "module"`) a obsahuje iba priečinok `dist`.
Zostavenie CommonJS neexistuje, takže volanie `require('@dineug/erd-editor')` nefunguje.

Obsahuje dva vlastné elementy: `<erd-editor>`, editor, a od verzie `5.0.0` `<erd-viewer>`, ktorý zobrazuje diagram iba na čítanie – pozrite si stránku [ErdViewerElement](./erd-viewer-element.md).
Od verzie `5.0.0` import koreňa balíka nedefinuje ani jeden z nich. Každý element má vlastný vstupný bod, ktorý ho definuje – pozrite si časť [Registrácia elementov](#registering-the-elements).

Závislosti balíka za behu zostávajú externé, ako importy podľa samotného názvu balíka (bare imports), ktoré bundler rozrieši, zbaví duplicít a očistí od nepoužívaného kódu (tree shaking). Od verzie `5.0.0` obsahuje jeho `dist` jeden súbor na modul, takže bundler ponechá iba moduly, ktorých sa stránka dotkne – pozrite si časť [Vstupné body](#entry-points).
Shared workery balíka sa generujú ako samostatné vstupné súbory v priečinku `dist/workers/` a vytvárajú sa pomocou `new URL('./…', import.meta.url)`, teda zápisu, ktorý Vite, webpack 5 a Rspack zabalia ako vstupný bod workera. Pozrite si časť [Web Workers](#web-workers).
Pre stránku bez bundlera existujú dve samostatné zostavenia – pozrite si časť [Značka script](#script-tag).

## Použitie {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` definuje `<erd-editor>` pri importe. Stránka, ktorá iba zobrazuje diagram, namiesto toho importuje `@dineug/erd-editor/erd-viewer.js` – pozrite si stránku [ErdViewerElement](./erd-viewer-element.md).

Element `<erd-editor>` nemá vlastnú veľkosť. Nastavte jemu (alebo jeho kontajneru) explicitnú šírku a výšku.
Od verzie `4.1.0` je otvorený [prieskumník](../guide/guides/explorer.md) ukotvený vnútri elementu naľavo od plátna ERD a plátno nezakrýva, ale zužuje. Nový editor sa spúšťa so zatvoreným prieskumníkom.
Panel sa nikdy nevykreslí užší ako `200px` a plátnu ponechá aspoň `320px`, takže v elemente užšom ako `520px` sa otvorený prieskumník nevykreslí, kým sa element nerozšíri – pozrite si časť [Vedľa plátna](../guide/guides/explorer.md#beside-the-canvas).

Volanie `setInitialValue('')` začne nový, prázdny dokument. Priradenie vlastnosti `value` naopak načíta dokument ako úpravu, takže sa dostane do histórie zmien.
Od verzie `4.0.0` je vlastnosť `editor.value` dokument vo forme, v akej ho uchováva súbor, a práve ju treba ukladať. Vlastnosť `editor.runtimeValue` je dokument tak, ako ho uchováva editor, vrátane odstránených entít: slúži na inicializáciu spolupracovníka a nikdy sa nedostane do súboru – pozrite si časť [runtimeValue](./erd-editor-element.md#runtimevalue).
Od verzie `4.0.0` má nový dokument zapnuté aj všetky [zamknutia nastavení](../guide/guides/settings.md#lock): zobrazovacej oblasti, karty, jazyka na karte Generátor kódu, oboch štýlov názvov, typu úvodzoviek a od verzie `4.2.0` aj [Zobrazenia názvov](../guide/guides/logical-names.md#name-view). Posúvanie, zmena priblíženia, prepínanie kariet, prepnutie Zobrazenia názvov alebo zmena niektorého z ostatných nastavení ponechá `editor.value` bez zmeny a nevyvolá udalosť `change`. Dokument načítaný z textu si ponechá zamknutia, ktoré uvádza. Dokument, ktorý žiadne neuvádza, napríklad každý súbor uložený pred verziou `4.0.0`, sa otvorí so všetkými zamknutiami zapnutými, s priblížením 100 % a na karte ERD bez ohľadu na to, akú zobrazovaciu oblasť a akú kartu uložil. Jeho zobrazovacia oblasť je zamknutá v počiatku `0, 0` a zobrazenie sa namiesto toho otvorí na diagrame, ak sa tam nevykresľuje žiadna jeho časť – pozrite si časť [setInitialValue](./erd-editor-element.md#setinitialvalue).
Súbor uložený pred verziou `4.2.0` sa otvorí so Zobrazením názvov zamknutým na zobrazení `Physical Names`, a to aj vtedy, keď má všetky ostatné zamknutia vypnuté. Editor verzie `4.0.0` alebo `4.1.0` pri uložení ponechá zamknutie Zobrazenia názvov tak, ako je, ale samotné zobrazenie zahodí, takže súbor verzie `4.2.0` uložený s odomknutým Zobrazením názvov zostane odomknutý, no znova sa otvorí v zobrazení `Physical Names`.
Zvyšok API opisuje stránka [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

Služba `esm.run` za vás rozrieši externé závislosti balíka, takže tento spôsob funguje bez bundlera.
Každý vstupný bod sa dosiahne cestou za verziou: `…/erd-editor.js` definuje editor a `…/erd-viewer.js` prehliadač, ktorý stiahne každý jazyk zobrazenia okrem angličtiny z CDN, až keď si ho stránka vyžiada. Adresa URL samotného balíka, `https://esm.run/@dineug/erd-editor@5.0.0`, poskytuje koreň, ktorý nedefinuje žiadny element.
Adresa URL bez verzie vždy poskytuje najnovšie vydanie. Ak nechcete, aby sa na vašu stránku bez ohlásenia dostala nová hlavná verzia, pripnite si verziu, ako je uvedené vyššie.
Verzia `5.0.0` je práve takou novou hlavnou verziou: stránka, ktorá musí zostať na verzii 4.x, si pripne `@4.2.0` – pozrite si časť [Prechod z verzie 4.x](#upgrading-from-4x).

`esm.run` poskytuje shared workery z `cdn.jsdelivr.net` a prehliadač nespustí shared worker z iného pôvodu, než má stránka. Editor načítaný týmto spôsobom preto beží bez svojich workerov, rovnako ako na hostiteľovi, ktorý ich blokuje – pozrite si časť [Web Workers](#web-workers). Zostavenie pre [značku script](#script-tag) ich nesie vo vlastnom súbore.

### Značka script {#script-tag}

Od verzie `3.6.0` balík obsahuje aj zostavenie UMD, v ktorom sú všetky závislosti a všetky shared workery v jednom súbore, `dist/erd-editor.umd.js`.
Práve naň odkazujú polia `unpkg` a `jsdelivr`, takže ho na oboch CDN poskytuje adresa URL so samotným názvom balíka. Toto zostavenie definuje objekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Jeho načítanie definuje `<erd-editor>`. Objekt `window.ErdEditor` obsahuje dve spätné volania pre súbory, `ErdEditor.setExportFileCallback` a `ErdEditor.setImportFileCallback`, od verzie `3.9.2` `ErdEditor.createKeyBindingMap`, od verzie `4.2.0` `ErdEditor.dictionaryRowChords` – pozrite si časť [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – a od verzie `5.0.0` `ErdEditor.ErdEditorElement` a `ErdEditor.defineErdEditor` – pozrite si časť [Registrácia elementov](#registering-the-elements). Neobsahuje [toImage](./to-image.md).

Od verzie `5.0.0` druhý súbor, `dist/erd-viewer.umd.js`, definuje `<erd-viewer>` a vkladá `ErdViewerElement` a `defineErdViewer` do objektu `window.ErdViewer`. Nespúšťa žiadny worker, obsahuje všetkých 25 jazykov zobrazenia a nevyžiada nič okrem adresy `src`, ktorú dostane.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Ani jeden súbor nedefinuje značku toho druhého a každý nechá na stránke iba svoj vlastný globálny objekt a `window.Konva`.
Mapa exportov naďalej smeruje bundler na moduly ES, takže inštalácia z npm ani jeden z týchto súborov nikdy nepoužije.
Stránka, ktorá nemôže načítať vlastný skript, môže namiesto toho vložiť hostovaný prehliadač z erd-editor.io/embed – pozrite si stránku [Vkladanie](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
Editor nesie všetkých 25 jazykov zobrazenia, v zostavení ES rovnako ako v zostavení pre značku script, takže netreba poskytovať žiadny jazykový súbor ani nič registrovať. Bez výberu jazyka a bez volania `setLocale()` editor zobrazuje angličtinu.

Pridanie atribútu `readonly` na tomto mieste otvorí editor ako čitateľa: priradenie vlastnosti `value`, volanie `clear()` a každé volanie `setSchema*()` – vrátane `setSchemaJSON()` a volania v režime pridávania – sa ignorujú a udalosť `change` sa nikdy nevyvolá. Jeho karty, prieskumník a rýchle vyhľadávanie zostávajú na čítanie a každý ovládací prvok, ktorý by upravoval diagram, zmizne.
Čítanie `editor.value` a `editor.runtimeValue` naďalej funguje a obe si ponechávajú nastavenia samotného dokumentu: nastavenie zobrazenia, ktoré čitateľ zmení, napríklad priblíženie alebo databáza, zostane na obrazovke tohto editora. Dokument namiesto toho načítajte metódou `setInitialValue()` – pozrite si časť [readonly](./erd-editor-element.md#readonly).

### Vykresľovanie na strane servera {#server-side-rendering}

Každý vstupný bod okrem `engine.js` a `peer.js` potrebuje DOM, takže v prostredí Node vyvolá výnimku. `erd-editor.js` a `erd-viewer.js` definujú svoj element na úrovni modulu a koreň balíka, ktorý od verzie `5.0.0` nedefinuje nič, pri načítaní stále vytvára triedy oboch elementov.
V rámcoch Next.js, Nuxt, SvelteKit alebo Astro importujte vstupný bod elementu z kódu, ktorý beží iba na klientovi, a pomenovaný import z koreňa, napríklad `setExportFileCallback` alebo `toImage`, z toho istého kódu.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Vo vývoji pridajte balík ELK, ktorý importuje worker rozloženia editora, do predbežného bundlovania Vite, inak rozloženia tohto workera zlyhajú: `Flow`, `Tree - vertical` a `Tree - horizontal` automatického rozloženia, režim Flow na karte Vizualizácia a import rozmiestnený rozložením Flow.
Vite 7 a staršie navyše potrebujú, aby bol editor vynechaný z predbežného bundlovania, pretože ich predbežný bundle smeruje adresy URL workerov na súbory, ktoré nikdy nezapíše, takže zlyhajú všetky tri workery. Vo Vite 8 toto `exclude` vynechajte, čo spôsobí iba to, že vývojový server stiahne každý súbor balíka samostatne. Produkčné zostavenie nepotrebuje ani jedno.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Import `@dineug/erd-editor/erd-editor.js` pridá `erd-editor` do rozhrania `HTMLElementTagNameMap` a `@dineug/erd-editor/erd-viewer.js` pridá `erd-viewer`, takže element má typ aj bez pretypovania. Akýkoľvek import z koreňa, aj čisto typový, prinesie oba.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Typ `ErdEditorElement` sa exportuje na typové anotácie vašich vlastných premenných a vlastností (props). Od verzie `5.0.0` je to aj trieda elementu a `ErdViewerElement` je rozhranie a trieda prehliadača – pozrite si časť [Registrácia elementov](#registering-the-elements).
Od verzie `4.0.0` balík exportuje aj typy `LocaleCode`, `LocaleOption` a `SchemaSQLOptions` a od verzie `5.0.0` `ToImageOptions` – pozrite si časť [Vstupné body](#entry-points). Možnosti, ktoré prijímajú metódy `setSchema*()`, nemajú exportovaný názov; odvoďte ich z elementu ako `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Od verzie `5.0.0` pole `typesVersions` v balíku určuje typy každého vstupného bodu podcesty aj pri `moduleResolution: "node10"`, ktoré nečíta mapu exportov.

## Registrácia elementov {#registering-the-elements}

Od verzie `5.0.0` balík definuje značku iba tam, kde si o to stránka požiada.

| Import | Definuje |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nič |

Každý z dvoch vstupných bodov definuje svoju značku pri vyhodnotení a nič neexportuje, takže sa importuje kvôli vedľajšiemu účinku a ani jeden nedefinuje značku toho druhého.
Koreň exportuje obe triedy elementov, `ErdEditorElement` a `ErdViewerElement`, a `defineErdEditor()` a `defineErdViewer()`, ktoré definujú svoju značku tam, kde ich zavoláte:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Volanie nič neurobí, kým značku drží táto trieda, takže vstupný bod a volanie define, alebo dve volania define, sa môžu stretnúť na jednej stránke. Vyvolá `Error` s názvom značky, keď ju drží iná trieda, ako by to spravila druhá kópia balíka zabalená do tej istej stránky: `Another element class already defines the custom element name erd-editor`.
Triedy koreňa sú tie, ktoré definujú vstupné body, takže `customElements.get('erd-editor') === ErdEditorElement`, hneď ako sa niektorý z nich vykonal. Kým značka nie je definovaná, `document.createElement('erd-editor')` vytvorí obyčajný `HTMLElement` bez členov editora a `new ErdEditorElement()` vyvolá výnimku.

Pre vlastnú značku definujte triedu pod ňou sami a pridajte značku do `HTMLElementTagNameMap` tiež sami. Urobte to v okne, ktoré nenačítava vstupný bod daného elementu ani jeho zostavenie pre [značku script](#script-tag) a nevolá preň žiadnu funkciu define, pretože trieda dostane v jednom okne jeden názov:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Bundle, ktorý obsahuje oba elementy, spôsobí, že Vite a Rolldown raz pre každý jazyk zobrazenia okrem angličtiny varujú pred `INEFFECTIVE_DYNAMIC_IMPORT`. Prehliadač načítava každý z nich vlastným volaním `import()` a editor importuje všetky slovníky naraz, takže zostanú v časti (chunk) editora a načítajú sa s ňou. Nič nezlyháva a bundle iba s prehliadačom ponechá každý jazyk vo vlastnej časti.

## Zvýrazňovanie syntaxe {#syntax-highlighting}

Panely Schéma SQL a Generátor kódu zvýrazňuje knižnica [Shiki](https://shiki.style) vo vlastnom shared workeri a od verzie `4.0.0` aj skripty `Before tables` a `After tables` na karte Schéma SQL.
Od verzie `3.7.0` netreba nič inštalovať ani registrovať: worker sa vytvorí pri prvom vykreslení panela s kódom, takže stránka, ktorá žiadny taký panel neotvorí, gramatiky nikdy nestiahne.

| | |
| --- | --- |
| Jazyky | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Motívy | `github-dark` a `github-light` podľa svetlého alebo tmavého vzhľadu editora |

Sú to presne jazyky, ktoré panely generujú: `JPA` sa zvýrazňuje ako Java, `SQLAlchemy` ako Python, `TypeORM`, `Sequelize`, `Drizzle` a `Zod` ako TypeScript, `Doctrine` ako PHP, `SeaORM` ako Rust, `JSON Schema` ako JSON a `DBML` aj `AML` ako SQL, čo je najbližšia gramatika v balíku – pozrite si stránku [Generátor kódu](../guide/guides/code-generator.md).

Modul regulárnych výrazov je čistý kód JavaScript, takže žiadna politika hostiteľa nemusí povoľovať `wasm-unsafe-eval`.
V prostrediach bez rozhrania `SharedWorker` – Chrome v systéme Android pred verziou Chrome 148, Safari pred verziou 16.4 – sa chyba zaznamená do protokolu a kód sa zobrazí ako obyčajný text; skripty sa dajú naďalej upravovať.

Prechod z verzie `3.6.0` alebo staršej: balík `@dineug/erd-editor-shiki-worker` sa už nepublikuje a funkcia `setGetShikiServiceCallback` zanikla spolu s ním.
Odstráňte inštaláciu aj registráciu; stránka, ktorá načítavala worker z CDN, odstráni aj tú druhú značku `<script>`.

## Web Workers {#web-workers}

Editor spúšťa tri úlohy v inštanciách `SharedWorker`: zvýrazňovanie syntaxe, export obrázka a rozloženie tabuliek, na ktorom stojí [automatické rozloženie](../guide/guides/table-related-functions.md#auto-layout), [režim Flow](../guide/guides/visualization.md#how-flow-is-placed) na karte Vizualizácia a od verzie `4.0.0` aj rozmiestnenie importovanej schémy.
Všetky tri sú súčasťou balíka `@dineug/erd-editor`. Žiadny z nich nemusíte nastavovať, ale každý z nich môže hostiteľ zablokovať.
Od verzie `5.0.0` sa každý worker vytvára vo vlastnom module, takže bundle nesie iba workery, ktorých sa jeho moduly dotknú: bundle funkcie [toImage](./to-image.md) bez elementu nesie iba worker exportu obrázka a `<erd-viewer>` nespúšťa žiadny worker – pozrite si časť [Vstupné body](#entry-points).
Worker, ktorý vykonával zber nepotrebných údajov (garbage collection) dokumentu, bol vo verzii `4.0.0` odstránený spolu so samotným zberom.

| Worker | Bez neho |
| --- | --- |
| Zvýrazňovanie syntaxe | Panely Schéma SQL a Generátor kódu a skripty na karte Schéma SQL zostanú obyčajným textom |
| Export obrázka | Export PNG a SVG, `Copy to clipboard`, ukážka v dialógovom okne `Export image` a od verzie `5.0.0` [toImage()](./to-image.md) sa vykresľujú v hlavnom vlákne, čo počas vykresľovania blokuje stránku |
| Rozloženie tabuliek | Rozloženia `Flow`, `Tree - vertical` a `Tree - horizontal` automatického rozloženia a režim Flow na karte Vizualizácia skončia hlásením `Could not place tables`; import rozmiestňovaný rozložením Flow – súbor SQL, GraphQL, DBML alebo AML z položky `Import` alebo `Import and Add` alebo volanie `setSchema*()` s `placement: 'auto'` – vloží svoje tabuľky do riadkov bez akéhokoľvek hlásenia; rozloženia `Force` a režimu Graph sa to netýka, pretože bežia vnútri editora |

Export obrázka čaká na odpoveď svojho workera desať sekúnd a potom kreslí v hlavnom vlákne a zvýrazňovanie syntaxe ponechá kód ako obyčajný text, hneď ako jeho worker zlyhá, takže hostiteľ, ktorý blokuje workery, prichádza o výkon, nie o funkčnosť.
Výnimkou je rozloženie tabuliek: modul, ktorý rozloženie počíta, je väčší ako samotný editor a nikdy sa nenačítava v rámci toho istého procesu, takže pri prvom rozmiestnení čaká na svoj worker tridsať sekúnd a keď už worker odpovedal, dá výpočtu rozloženia šesťdesiat sekúnd na vrátenie výsledku.
Ak niektorá z týchto čakacích lehôt uplynie, rozmiestnenie skončí rovnako ako bez workera. Automatické rozloženie zobrazí upozornenie `Placing tables` hneď na začiatku, zatiaľ čo režim Flow a import rozmiestňovaný rozložením Flow ho zobrazia až vtedy, keď rozmiestňovanie vrátane spustenia jeho workera trvá už šesť sekúnd.

Vite, webpack 5 a Rspack generujú workery ako súbory vedľa vašich častí (chunks). esbuild a Rolldown použitý samostatne, nie cez Vite, nevygenerujú žiadne, takže stránka, ktorú zostavia, beží bez workerov.
Pri experimentálnom nastavení webpacku `experiments.outputModule` sa nespustí žiadny worker, pretože každý čaká na časť (chunk) od neho oddelenú, ktorú nič nenačíta. Ponechajte predvolený výstup webpacku alebo nastavte `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Stránka s prísnou politikou Content Security Policy potrebuje pre elementy tieto direktívy:

- `worker-src 'self'` pre zostavenie spracované bundlerom, ktorého workery sú súbory vedľa balíka, a navyše `blob:` tam, kde bundler vkladá worker priamo do kódu. V zostavení pre [značku script](#script-tag) sú všetky tri priamo v súbore ako adresy URL `data:`, takže taká stránka namiesto toho potrebuje `worker-src data:`. `<erd-viewer>` nepotrebuje ani jedno, pretože nespúšťa žiadny worker.
- Od verzie `5.0.0` oba elementy štylizujú samy seba konštruovanými štýlovými tabuľkami, ktoré `style-src 'self'` prepúšťa. Panely s kódom editora však farbia text atribútmi `style` a ukážka v dialógovom okne `Export image` je obrázok na adrese `blob:`, takže editor potrebuje aj `style-src 'unsafe-inline'` a `img-src blob:`.
- Prehliadač bez konštruovaných štýlových tabuliek, napríklad Firefox pred verziou 101, dostane namiesto nich elementy `<style>`, ktoré pre ktorýkoľvek element potrebujú `style-src 'unsafe-inline'`.
- `<erd-viewer>` sťahuje svoj `src`, takže tento pôvod patrí do `connect-src` – pozrite si časť [Čo pridáva na stránku](./erd-viewer-element.md#what-it-adds-to-a-page).

## Vstupné body {#entry-points}

Balík má päť vstupných bodov:

| Vstupný bod | Čo to je |
| --- | --- |
| `@dineug/erd-editor` | Koreň: exporty nižšie. Od verzie `5.0.0` nedefinuje žiadny element, hoci na načítanie stále potrebuje DOM |
| `@dineug/erd-editor/erd-editor.js` | Od verzie `5.0.0`. Definuje `<erd-editor>` a nič neexportuje |
| `@dineug/erd-editor/erd-viewer.js` | Od verzie `5.0.0`. Definuje `<erd-viewer>` a nič neexportuje |
| `@dineug/erd-editor/engine.js` | Úložisko dokumentu bez DOM |
| `@dineug/erd-editor/peer.js` | Od verzie `3.9.1`. Účastník bez používateľského rozhrania servera MCP |

Koreň exportuje obe triedy elementov a ich funkcie define, dva settery spätných volaní, od verzie `3.9.2` predvolené klávesové skratky s ich typmi, od verzie `4.0.0` typy jazykov zobrazenia a typ možností metódy `getSchemaSQL()`, od verzie `4.2.0` kombinácie klávesov pre riadky na karte Slovník a od verzie `5.0.0` `toImage`.

| Export | Popis |
| --- | --- |
| `ErdEditorElement` | Rozhranie elementu – pozrite si stránku [ErdEditorElement](./erd-editor-element.md). Od verzie `5.0.0` aj jeho trieda, tá, ako ktorá je definovaný `<erd-editor>` – pozrite si časť [Registrácia elementov](#registering-the-elements). |
| `ErdViewerElement` | Od verzie `5.0.0`. Rozhranie a trieda prehliadača – pozrite si stránku [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Od verzie `5.0.0`. Definujú `<erd-editor>` alebo `<erd-viewer>` ako jeho triedu. Volanie nič neurobí, kým značku drží táto trieda, a vyvolá `Error`, keď ju drží iná trieda – pozrite si časť [Registrácia elementov](#registering-the-elements). |
| `toImage(value, options)` | Od verzie `5.0.0`. Nakreslí dokument ako PNG `Blob` alebo reťazec SVG s možnosťami dialógového okna `Export image` – pozrite si stránku [toImage](./to-image.md). |
| `ToImageOptions` (typ) | Od verzie `5.0.0`. Možnosti, ktoré prijíma `toImage()`: `format`, `background`, `darkMode` a `scale`. |
| `setExportFileCallback(cb)` | Nahrádza sťahovanie v prehliadači, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nahrádza výber súboru v prehliadači, `({ type, op, accept, mode }) => void`; `mode` od verzie `4.0.0`. Od verzie `4.2.0` tlačidlo `Import CSV` na karte Slovník otvorí výber súboru v prehliadači aj vtedy, keď je spätné volanie nastavené – pozrite si časť [Dialógové okná súborov](#file-dialogs). |
| `createKeyBindingMap()` | Pri každom volaní vráti predvolené klávesové skratky ako nový objekt `KeyBindingMap` – pozrite si časť [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (typy) | Mapa klávesových skratiek, zjednotenie (union) názvov jej príkazov a jedna klávesová skratka. |
| `dictionaryRowChords(map)` | Od verzie `4.2.0`. Pri každom volaní vráti ako nové pole `ShortcutOption[]` kombinácie klávesov, ktorými mriežka na karte [Slovník](../guide/guides/dictionary.md#adding-and-deleting-rows) vkladá a odstraňuje riadky podľa odovzdaného objektu `KeyBindingMap`. Kombinácia, ktorá vkladá riadky nad výber, pri predvolených skratkách `Alt+Shift+Enter`, nie je súčasťou žiadnej klávesovej skratky – pozrite si časť [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (typy) | Od verzie `4.0.0`. Kódy 25 jazykov zobrazenia a tieto kódy spolu s `'system'`, ktoré prijíma metóda `setLocale()` – pozrite si časť [Jazyk zobrazenia](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (typ) | Od verzie `4.0.0`. Možnosti, ktoré prijíma metóda `getSchemaSQL()`: `statements`, `header` a od verzie `4.2.0` `logicalNameAsComment` – pozrite si časť [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Od verzie `5.0.0` obsahuje `dist` jeden neminifikovaný súbor na modul, každý vedľa svojej deklarácie, a pole `sideEffects` v `package.json` uvádza iba dva vstupné body značiek a dva stuby, ktoré potrebujú súbory workerov. Bundler tak zahodí každý modul, ktorého sa stránka nedotkne, a minifikuje raz:

- Pomenovaný import z koreňa, napríklad `setExportFileCallback`, nezabalí ani jeden element a žiadny worker.
- `toImage` prinesie worker exportu obrázka a žiadny element.
- `erd-editor.js` prinesie editor a všetky tri shared workery.
- `erd-viewer.js` prinesie prehliadač a žiadny worker, s angličtinou vnútri a každým iným jazykom zobrazenia vo vlastnej časti (chunk), ktorá sa načíta, až keď si ju stránka vyžiada.

`@dineug/erd-editor/engine.js` spúšťa úložisko dokumentu bez DOM, takže funguje v prostredí Web Worker – pozrite si stránku [Vzdialené ukladanie](./advanced/remote-storage.md).
Exportuje funkciu `createReplicationStore` a typ `ReplicationStore`. Od verzie `3.10.0` exportuje aj typ `ReplicationChange`, `{ value: string; changed: boolean }`, ktorý dostáva poslucháč udalosti `change` repliky – pozrite si časť [on@change](./advanced/remote-storage.md#onchange).
Od verzie `4.0.0` má objekt `ReplicationStore` aj vlastnosť `runtimeValue`. Jeho vlastnosť `value` a hodnota, ktorú odovzdá udalosť `change`, sú v úložnej forme, v akej ich uchováva súbor, rovnako ako v prípade elementu – pozrite si časť [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` je účastník bez používateľského rozhrania (headless), prostredníctvom ktorého [server MCP](../mcp/introduction.md) upravuje dokument. Existuje pre tento server a tieto stránky ho neopisujú.

### Dialógové okná súborov {#file-dialogs}

Import a export prechádzajú cez nastaviteľné spätné volania, takže hostiteľ bez dialógového okna súborov prehliadača – napríklad webview v IDE – môže poskytnúť vlastné.
Tieto dve spätné volania nie sú symetrické: export vám odovzdá hotový súbor, kým import o súbor iba požiada, a obsah do editora vložíte späť sami.
Od verzie `4.2.0` je tlačidlo `Import CSV` na karte Slovník jediným importom, ktorý nikdy nevolá spätné volanie importu, ktorého parameter `type` nemá žiadnu hodnotu pre CSV. Vždy otvorí vlastný výber súboru prehliadača, a to pre súbory `.csv` – pozrite si časť [Import a export CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

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

Hodnota `fileName`, ktorú editor vygeneruje, je `<database name>-<timestamp>` s príponou súboru, kde časová pečiatka je miestny čas vo formáte `yyyy-MM-dd'T'HH_mm_ss`. Ak je názov databázy prázdny, použije sa `unnamed`. Súbor CSV z karty Slovník uvádza pred príponou názov svojho hárka, napríklad `<database name>-<timestamp>-words.csv`.
Spätné volanie exportu dostáva tieto súbory. Od verzie `4.0.0` medzi ne patria aj súbor SVG a súbory z karty Generátor kódu, pričom súbor `.sql` pochádza z tlačidla `Save file` na karte Schéma SQL, a nie priamo z ponuky `Export`. Od verzie `4.2.0` medzi ne patrí aj súbor CSV z karty Slovník. [toImage()](./to-image.md) nevolá ani jedno spätné volanie: svoj obrázok vráti vám.

| Súbor | Prípona | `type` objektu Blob |
| --- | --- | --- |
| Export JSON | `.erd.json` | `application/json` |
| Súbor z tlačidla `Save file` na karte Schéma SQL s textom, ktorý karta zobrazuje – pozrite si stránku [Schéma SQL](../guide/guides/schema-sql.md) | `.sql` | žiadny |
| Dialógové okno [Exportovať obrázok](../guide/guides/file-import-export.md#image) | `.png` alebo `.svg` | `image/png` alebo `image/svg+xml` |
| Súbor z tlačidla `Save file` na karte Generátor kódu – pozrite si stránku [Generátor kódu](../guide/guides/code-generator.md) | Podľa jazyka: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` alebo `.mmd` | žiadny |
| Súbor z tlačidla `Export CSV` na karte Slovník so všetkými riadkami zobrazeného hárka bez ohľadu na to, čo uvádza jeho vyhľadávanie – pozrite si časť [Import a export CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Hostiteľ, ktorý vyberá obslužnú funkciu podľa prípony, potrebuje jednu pre každý z nich.

Ak spätné volania nenastavíte, editor použije vlastné správanie prehliadača pri sťahovaní a výbere súborov. Na návrat k nemu odovzdajte `null`.

## Podpora prehliadačov {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – základná úroveň ES2022, pre ktorú sú publikované zostavenia vytvorené.
Žiadne polyfilly nie sú pribalené. Ak potrebujete podporovať staršie prehliadače, pridajte vlastné.

## Prechod z verzie 4.x {#upgrading-from-4x}

Verzia `5.0.0` je novou hlavnou verziou. Pri prechode stránky z verzie 4.x skontrolujte každý z týchto bodov:

- `import '@dineug/erd-editor'` už nedefinuje `<erd-editor>`. Namiesto toho importujte `@dineug/erd-editor/erd-editor.js` kvôli jeho účinku alebo zavolajte `defineErdEditor()` a pomenované importy z koreňa ponechajte tak, ako sú. TypeScript stránku s ponechaným holým importom neoznačí, pretože deklarácie koreňa stále uvádzajú značku v `HTMLElementTagNameMap`, ale element, ktorý vytvorí, je obyčajný `HTMLElement`, takže jeho prvé volanie metódy vyvolá `TypeError` – pozrite si časť [Registrácia elementov](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Na CDN platí to isté pre `https://esm.run/@dineug/erd-editor`, ktorá teraz poskytuje koreň a nič nedefinuje: importujte `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Holé adresy jsDelivr a unpkg naďalej poskytujú zostavenie pre značku script, ktoré definuje `<erd-editor>` ako predtým. Adresa URL bez verzie teraz poskytuje najnovšie vydanie 5.x; pripnite `@4.2.0`, ak chcete zostať na verzii 4.x – pozrite si časti [CDN](#cdn) a [Značka script](#script-tag).
- Koreň nedefinuje nič, ale stále potrebuje DOM, takže pri vykresľovaní na strane servera zostáva pomenovaný import z neho, napríklad `setExportFileCallback`, v kóde, ktorý beží iba na klientovi, vedľa vstupného bodu elementu – pozrite si časť [Vykresľovanie na strane servera](#server-side-rendering).
- Objekt `window.ErdEditor` získal `ErdEditorElement` a `defineErdEditor`. Zostavenie prehliadača pre značku script vkladá `ErdViewerElement` a `defineErdViewer` do objektu `window.ErdViewer` a ani jeden globálny objekt neobsahuje `toImage`.
- Editor s `readonly` sa otvorí ako čitateľ. Zostanú jeho šesť kariet, prieskumník, rýchle vyhľadávanie a prítomnosť a každý ovládací prvok, ktorý by upravoval diagram, zmizne namiesto toho, aby bol vypnutý: panel nástrojov zobrazuje názov databázy ako text, karta Nastavenia zobrazuje svoje nastavenia so všetkými ovládacími prvkami vypnutými pod odznakom `Read only` a plávajúci panel nástrojov si ponecháva iba priblíženie, Zobrazenie názvov, režim Zen a kompas, takže `Hand` a `Select` zmizli a ťahanie posúva plátno. Stlačenie nič nevyberie: jediným výberom je obrys, ktorý skok z prieskumníka alebo rýchleho vyhľadávania vloží okolo toho, k čomu sa dostane, a nehybné kliknutie ho zruší, a skratky na výber všetkého nič nevyberú. Zapnutie `readonly` ukončí všetko, čo bolo otvorené, napríklad výber, nástroj Ruka, editor bunky, ťahanie, Map Columns, náhľad `Force` automatického rozloženia a Time Travel, a ponechá posunutie, priblíženie, kartu a Zobrazenie názvov – pozrite si časť [readonly](./erd-editor-element.md#readonly).
- Nastavenia, ktoré čitateľ s `readonly` zmení, zostávajú na obrazovke tohto editora bez ohľadu na ich zamknutia: posunutie a priblíženie, karta, Zobrazenie názvov, View Option, databáza a jazyk, štýly názvov a typ úvodzoviek Generátora kódu. `value`, `runtimeValue` a export JSON si ponechávajú vlastné hodnoty dokumentu, ku ktorým sa zmeny čitateľa vo verzii 4.x mohli dostať, a `getSharedStore()` žiadnu z nich neodosiela ostatným editorom. `getSchemaSQL()` bez databázového systému zapíše databázu, ktorú čitateľ vybral. Vypnutie `readonly` vráti databázu, nastavenia kódu a View Option na hodnoty dokumentu a posunutie, priblíženie, kartu a Zobrazenie názvov ponechá tam, kde ich čitateľ nechal.
- Riadok `Recalculation table width` na karte Nastavenia zanikol. Načítanie a prilepenie naďalej prispôsobia šírku každej tabuľky jej textu.
- Vo Vite 8 odstráňte `exclude: ['@dineug/erd-editor']` z `optimizeDeps`, ktoré ešte potrebuje iba Vite 7 a staršie, a ponechajte `include` pre ELK – pozrite si časť [Vite](#vite).

## Prechod z verzie 3.x {#upgrading-from-3x}

Verzia `4.0.0` je novou hlavnou verziou. Pri prechode stránky z verzie 3.x skontrolujte každý z týchto bodov a potom body časti [Prechod z verzie 4.x](#upgrading-from-4x) pre verziu `5.0.0`:

- Vlastnosť `editor.value`, vlastnosť `value` repliky a hodnota `value`, ktorú odovzdá jej udalosť `change`, sú v úložnej forme, v akej ich uchováva súbor: bez odstránených entít, nameraných šírok, poradia prekrývania a bodov ukotvenia vzťahov. Naďalej ukladajte vlastnosť `value` a tieto údaje čítajte z vlastnosti `runtimeValue`; časové pečiatky entít (`meta`) úplne zanikli. Spolupracovníka alebo repliku, ktorá sa pripája k prebiehajúcej relácii, inicializujte z vlastnosti `runtimeValue` spusteného účastníka, nie z `value` ani zo súboru, a `runtimeValue` nikdy neukladajte – pozrite si časti [value](./erd-editor-element.md#value) a [runtimeValue](./erd-editor-element.md#runtimevalue).
- Zamknutia nastavení nahrádzajú možnosti `Save Scroll Information` a `Save Zoom Information`. Nový dokument, ako aj každý dokument uložený pred verziou `4.0.0`, má zapnuté všetky zamknutia, takže posunutie, zmena priblíženia, prepnutie karty alebo zmena jazyka na karte Generátor kódu, štýlu názvov či typu úvodzoviek ponechá `value` bez zmeny a nevyvolá udalosť `change`. Stránka, ktorá si uchovávala zobrazenie prostredníctvom udalosti `change`, potrebuje mať na karte Nastavenia odomknuté nastavenie `Viewport` (a kvôli karte aj `Canvas Type`) alebo dokument, ktorého pole `settings.lockSettings` ponecháva tieto bity vynulované – pozrite si časť [Zamknutie](../guide/guides/settings.md#lock).
- Objekt `settings` už nemá polia `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ani `ignoreSaveSettings` a konštanty `SaveSettingType` zanikli. Pole `settings.lockSettings` s bitmi `LockSettingType` nahrádza pole `ignoreSaveSettings`, ktoré verzia `4.0.0` alebo novšia nečíta ani nezapisuje – pozrite si časť [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema), ktorú každý súbor uvádza v poli `$schema`, teraz opisuje iba úložnú formu a je uzavretá: odmietne súbor uložený staršou verziou, kým ho uloženie vo verzii `4.0.0` alebo novšej neprepíše.
- Zber nepotrebných údajov dokumentu zanikol spolu so svojím workerom, takže odstránená entita zostáva vo vlastnosti `runtimeValue`, kým sa dokument znova neotvorí zo svojho súboru. Zostávajú tri shared workery – pozrite si časť [Web Workers](#web-workers).
- Všetky editory a repliky v zdieľanej relácii udržiavajte vo verzii `4.0.0` alebo novšej. Staršia verzia ignoruje nové typy akcií: akcie skupín tabuliek, dialógového okna Mapovať stĺpce, zamknutí a skriptov na karte Schéma SQL – pozrite si časť [Kombinovanie verzií](./advanced/collaborative-editing.md#mixing-releases).
- Spätné volanie importu dostáva pri možnosti Importovať a pridať hodnotu `mode: 'append'`, ktorú musí odovzdať ďalej. Spätné volanie exportu teraz dostáva aj súbory `.svg` a súbory z karty Generátor kódu. Položka `Export` ▸ `Schema SQL` namiesto uloženia otvorí kartu Schéma SQL, takže súbor `.sql` prichádza iba z tlačidla `Save file` na tejto karte – pozrite si časť [Dialógové okná súborov](#file-dialogs).
- Klávesy `Delete` a `Backspace` sú priradené novému príkazu `removeSelection`. Kým má editor fokus mimo textového poľa, predvolené správanie klávesu sa na každej karte potlačí a na karte ERD sa odstráni výber. Do typov `KeyBindingName` a `KeyBindingMap` tento príkaz pribudol a volanie `setKeyBindingMap({ removeSelection: [] })` ponechá oba klávesy stránke – pozrite si časť [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Pole `ThemeOptions.appearance` prijíma aj `'system'`, teda možnosť `System` vo výbere motívu, ktorú nastaví zapnutie atribútu `systemDarkMode`. Udalosť `changePresetTheme` hlási `'system'`, kým je táto možnosť vybratá, preto túto hodnotu uložte bez zmeny a odovzdajte ju späť metóde `setPresetTheme`. Keď je atribút `systemDarkMode` zapnutý, volanie `setPresetTheme()` s hodnotou `'light'` alebo `'dark'` teraz zostane platné namiesto toho, aby ho prepísala ďalšia zmena v operačnom systéme – pozrite si časti [systemDarkMode](./erd-editor-element.md#systemdarkmode) a [changePresetTheme](./erd-editor-element.md#changepresettheme).
- Balík `@dineug/erd-editor-mcp` vo verzii `1.0.0` alebo novšej, rozšírenie pre VS Code vo verzii `4.0.0` alebo novšej a doplnky pre Obsidian a JetBrains vo verzii `1.0.0` alebo novšej používajú protokol hubu verzie 2. Server vo verzii `1.0.0` alebo novšej a staršia verzia editora, ktorá obsluhuje agentov, alebo starší server a jeden z týchto editorov sa navzájom odmietnu chybou `protocolMismatch`, ktorá uvádza stranu, ktorú treba aktualizovať – pozrite si časť [Aktualizácia](../mcp/installation.md#updating).
- Adresa URL na CDN bez verzie poskytuje najnovšie vydanie, od verzie `5.0.0` 5.x. Ak chcete zostať na verzii 3.x, pripnite `@3.10.0` – pozrite si časť [CDN](#cdn).
