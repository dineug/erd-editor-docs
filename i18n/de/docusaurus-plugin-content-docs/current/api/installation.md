---
sidebar_position: 1
description: "@dineug/erd-editor über npm oder ein CDN installieren, die Elemente Editor und Viewer registrieren, die Dateidialoge anbinden und ein Upgrade von 4.x oder 3.x durchführen."
---

# Installation

```sh
npm install @dineug/erd-editor
```

Das Paket ist ausschließlich ESM (`"type": "module"`) und liefert nur seinen Ordner `dist` aus.
Es gibt keinen CommonJS-Build, daher funktioniert `require('@dineug/erd-editor')` nicht.

Es enthält zwei Custom Elements: `<erd-editor>`, den Editor, und seit `5.0.0` `<erd-viewer>`, das ein Diagramm schreibgeschützt zeigt – siehe [ErdViewerElement](./erd-viewer-element.md).
Seit `5.0.0` definiert der Import des Paketstamms keines von beiden. Jedes Element hat einen eigenen Einstiegspunkt, der es definiert – siehe [Die Elemente registrieren](#registering-the-elements).

Seine Laufzeitabhängigkeiten bleiben extern, als Bare Imports, die Ihr Bundler auflöst, dedupliziert und per Tree-Shaking reduziert. Seit `5.0.0` enthält sein `dist` eine Datei pro Modul, sodass ein Bundler nur die Module behält, die eine Seite erreicht – siehe [Einstiegspunkte](#entry-points).
Seine Shared Worker werden als eigene Einstiegsdateien unter `dist/workers/` ausgegeben und mit `new URL('./…', import.meta.url)` erzeugt, der Schreibweise, die Vite, webpack 5 und Rspack als Worker-Einstiegspunkt bündeln. Siehe [Web Worker](#web-workers).
Für eine Seite, hinter der kein Bundler steht, gibt es zwei eigenständige Builds – siehe [Script-Tag](#script-tag).

## Verwendung {#usage}

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

`@dineug/erd-editor/erd-editor.js` definiert `<erd-editor>` beim Import. Eine Seite, die ein Diagramm nur zeigt, importiert stattdessen `@dineug/erd-editor/erd-viewer.js` – siehe [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` hat keine eigene Größe. Geben Sie dem Element (oder seinem Container) eine explizite Breite und Höhe.
Seit `4.1.0` dockt ein geöffneter [Explorer](../guide/guides/explorer.md) innerhalb des Elements links neben der ERD-Zeichenfläche an und verschmälert die Zeichenfläche, statt sie zu überdecken. Ein neuer Editor startet mit geschlossenem Explorer.
Der Bereich wird nie schmaler als `200px` gezeichnet und lässt der Zeichenfläche mindestens `320px`, daher wird ein geöffneter Explorer in einem Element, das schmaler als `520px` ist, erst gezeichnet, wenn das Element breiter wird – siehe [Neben der Zeichenfläche](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` beginnt ein neues, leeres Dokument. Eine Zuweisung an `value` lädt ein Dokument dagegen als Änderung, sodass es im Verlauf landet.
Seit `4.0.0` ist `editor.value` das Dokument in der Form, die eine Datei enthält, und genau diesen Wert sollten Sie speichern. `editor.runtimeValue` ist das Dokument, wie der Editor es hält, entfernte Entitäten eingeschlossen: Es dient zum Initialisieren eines Mitbearbeiters und gelangt nie in eine Datei – siehe [runtimeValue](./erd-editor-element.md#runtimevalue).
Seit `4.0.0` sind bei einem neuen Dokument außerdem alle [Einstellungssperren](../guide/guides/settings.md#lock) eingeschaltet: der Ansichtsbereich, die Registerkarte, die Sprache des Codegenerators, beide Schreibweisen, der Begrenzertyp und seit `4.2.0` die [Namensansicht](../guide/guides/logical-names.md#name-view). Scrollen, Zoomen, ein Wechsel der Registerkarte, ein Wechsel der Namensansicht oder die Änderung einer der übrigen Einstellungen lässt `editor.value` unverändert und löst kein Ereignis `change` aus. Ein aus Text geladenes Dokument behält die Sperren, die es angibt. Ein Dokument, das keine angibt, wie jede vor `4.0.0` gespeicherte Datei, öffnet sich mit allen Sperren im eingeschalteten Zustand, bei einer Zoomstufe von 100 % und auf der Registerkarte ERD, unabhängig davon, welchen Ansichtsbereich und welche Registerkarte es gespeichert hat. Sein Ansichtsbereich ist am Ursprung `0, 0` gesperrt, und die Ansicht öffnet sich stattdessen auf dem Diagramm, wenn dort kein Teil davon gezeichnet ist – siehe [setInitialValue](./erd-editor-element.md#setinitialvalue).
Eine vor `4.2.0` gespeicherte Datei öffnet sich mit einer auf `Physical Names` gesperrten Namensansicht, auch dann, wenn alle anderen Sperren ausgeschaltet sind. Ein Editor der Version `4.0.0` oder `4.1.0` lässt die Sperre der Namensansicht beim Speichern unverändert, verwirft aber die Namensansicht selbst, daher bleibt eine Datei von `4.2.0`, die mit entsperrter Namensansicht gespeichert wurde, entsperrt, öffnet sich aber wieder in der Ansicht `Physical Names`.
Zur übrigen API siehe [ErdEditorElement](./erd-editor-element.md).

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

`esm.run` löst die externen Abhängigkeiten des Pakets für Sie auf, daher funktioniert dies ohne Bundler.
Jeder Einstiegspunkt wird über seinen Pfad hinter der Version erreicht: `…/erd-editor.js` definiert den Editor und `…/erd-viewer.js` den Viewer, der jede Anzeigesprache außer Englisch erst vom CDN holt, wenn eine Seite sie anfordert. Die einfache Paket-URL `https://esm.run/@dineug/erd-editor@5.0.0` liefert den Stamm, der kein Element definiert.
Eine URL ohne Versionsangabe liefert immer die neueste Version. Fixieren Sie eine Version, wie oben, wenn Sie nicht möchten, dass ein Major-Upgrade Ihre Seite unangekündigt erreicht.
`5.0.0` ist selbst ein solches: Eine Seite, die bei 4.x bleiben muss, fixiert `@4.2.0` – siehe [Upgrade von 4.x](#upgrading-from-4x).

`esm.run` liefert die Shared Worker von `cdn.jsdelivr.net` aus, und ein Browser startet keinen Shared Worker von einem anderen Ursprung als dem der Seite. Ein auf diese Weise geladener Editor läuft daher ohne seine Worker, wie auf einem Host, der sie blockiert – siehe [Web Worker](#web-workers). Der Build mit [Script-Tag](#script-tag) trägt sie in seiner Datei.

### Script-Tag {#script-tag}

Seit `3.6.0` liefert das Paket außerdem einen UMD-Build aus, der alle Abhängigkeiten und alle Shared Worker in einer einzigen Datei enthält, `dist/erd-editor.umd.js`.
Auf ihn verweisen die Felder `unpkg` und `jsdelivr`, daher liefert ihn die einfache Paket-URL auf beiden CDNs aus, und er definiert `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Beim Laden definiert er `<erd-editor>`. `window.ErdEditor` enthält die beiden Datei-Callbacks `ErdEditor.setExportFileCallback` und `ErdEditor.setImportFileCallback`, seit `3.9.2` `ErdEditor.createKeyBindingMap`, seit `4.2.0` `ErdEditor.dictionaryRowChords` – siehe [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – und seit `5.0.0` `ErdEditor.ErdEditorElement` und `ErdEditor.defineErdEditor` – siehe [Die Elemente registrieren](#registering-the-elements). Er enthält kein [toImage](./to-image.md).

Seit `5.0.0` definiert eine zweite Datei, `dist/erd-viewer.umd.js`, `<erd-viewer>` und legt `ErdViewerElement` und `defineErdViewer` auf `window.ErdViewer`. Sie startet keinen Worker, enthält alle 25 Anzeigesprachen und fordert nichts an außer dem `src`, das ihr gegeben wird.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Keine der beiden Dateien definiert das Tag der anderen, und jede hinterlässt auf der Seite kein globales Objekt außer ihrem eigenen und `window.Konva`.
Die Exports-Map verweist einen Bundler weiterhin auf die ES-Module, daher verwendet eine Installation über npm keine der beiden Dateien.
Eine Seite, die kein eigenes Skript laden kann, kann stattdessen den gehosteten Viewer von erd-editor.io/embed einbinden – siehe [Einbetten](../guide/guides/embedding.md).

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

Seit `4.0.0` fügt `enable-locale-picker` die Sprachauswahl `Display Language` in der Symbolleiste hinzu und `enable-welcome-screen` den Willkommensbildschirm, den ein leeres Diagramm zeigt – siehe [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) und [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Eine Seite, die wie in [Verwendung](#usage) ein Dokument lädt, schaltet `enableWelcomeScreen` nicht im Markup ein, sondern erst, wenn `setInitialValue()` das Dokument geladen hat, sodass der Bildschirm nie über einer Datei aufblitzt, die noch geladen wird.
Der Editor enthält alle 25 Anzeigesprachen, im ES-Build ebenso wie im Script-Tag-Build, daher muss keine Sprachdatei bereitgestellt und nichts registriert werden. Ohne Sprachauswahl und ohne Aufruf von `setLocale()` zeigt der Editor Englisch an.

Wenn Sie hier `readonly` hinzufügen, öffnet sich der Editor als Leser: Zuweisungen an `value`, Aufrufe von `clear()` und jeder Aufruf von `setSchema*()` – `setSchemaJSON()` und das Anhängen eingeschlossen – werden ignoriert, und das Ereignis `change` wird nie ausgelöst. Seine Registerkarten, der Explorer und die Schnellsuche bleiben zum Lesen, und jedes Bedienelement, das das Diagramm bearbeiten würde, fehlt.
Das Lesen von `editor.value` und `editor.runtimeValue` funktioniert weiterhin, und beide behalten die eigenen Einstellungen des Dokuments: Eine Ansichtseinstellung, die der Leser ändert, etwa der Zoom oder die Datenbank, bleibt auf dem Bildschirm dieses Editors. Laden Sie stattdessen mit `setInitialValue()` – siehe [readonly](./erd-editor-element.md#readonly).

### Serverseitiges Rendering {#server-side-rendering}

Jeder Einstiegspunkt außer `engine.js` und `peer.js` benötigt ein DOM und wirft daher in Node einen Fehler. `erd-editor.js` und `erd-viewer.js` definieren ihr Element auf Modulebene, und der Paketstamm, der seit `5.0.0` nichts definiert, baut beim Laden weiterhin beide Elementklassen auf.
Erreichen Sie in Next.js, Nuxt, SvelteKit oder Astro den Einstiegspunkt des Elements über einen Codepfad, der nur im Client ausgeführt wird, und einen benannten Import aus dem Stamm, etwa `setExportFileCallback` oder `toImage`, über denselben Pfad.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Fügen Sie in der Entwicklung das ELK-Bundle, das der Layout-Worker des Editors importiert, dem Pre-Bundling von Vite hinzu, sonst schlagen die Layouts dieses Workers fehl: `Flow`, `Tree - vertical` und `Tree - horizontal` von Auto Layout, der Flow-Modus der Registerkarte Visualisierung und ein durch Flow platzierter Import.
Vite 7 und älter müssen außerdem den Editor vom Pre-Bundling ausnehmen, da ihr Pre-Bundle die URLs der Worker auf Dateien zeigen lässt, die es nie schreibt, sodass alle drei Worker fehlschlagen. Lassen Sie dieses `exclude` bei Vite 8 weg, da es nur dazu führt, dass der Dev-Server jede Datei des Pakets einzeln abruft. Ein Produktions-Build braucht beides nicht.

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

Der Import von `@dineug/erd-editor/erd-editor.js` ergänzt `HTMLElementTagNameMap` um `erd-editor`, und der von `@dineug/erd-editor/erd-viewer.js` um `erd-viewer`, daher ist das Element ohne Cast typisiert. Jeder Import aus dem Stamm, auch der eines reinen Typs, bringt beide.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` wird exportiert, damit Sie Ihre eigenen Variablen und Props annotieren können. Seit `5.0.0` ist es auch die Klasse des Elements, und `ErdViewerElement` ist die Schnittstelle und Klasse des Viewers – siehe [Die Elemente registrieren](#registering-the-elements).
Seit `4.0.0` exportiert das Paket außerdem die Typen `LocaleCode`, `LocaleOption` und `SchemaSQLOptions` und seit `5.0.0` `ToImageOptions` – siehe [Einstiegspunkte](#entry-points). Die Optionen, die die Methoden `setSchema*()` annehmen, haben keinen exportierten Namen; leiten Sie sie vom Element ab, als `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Seit `5.0.0` typisiert `typesVersions` des Pakets jeden Einstiegspunkt eines Unterpfads auch unter `moduleResolution: "node10"`, das keine Exports-Map liest.

## Die Elemente registrieren {#registering-the-elements}

Seit `5.0.0` definiert das Paket ein Tag nur dort, wo eine Seite es anfordert.

| Import | Definiert |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nichts |

Jeder der beiden Einstiegspunkte definiert sein Tag bei der Auswertung und exportiert nichts, wird also nur wegen seiner Wirkung importiert, und keiner definiert das Tag des anderen.
Der Stamm exportiert beide Elementklassen, `ErdEditorElement` und `ErdViewerElement`, sowie `defineErdEditor()` und `defineErdViewer()`, die ihr Tag dort definieren, wo Sie sie aufrufen:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Ein Aufruf bewirkt nichts, solange das Tag diese Klasse bereits hält, sodass ein Einstiegspunkt und ein Define-Aufruf oder zwei Define-Aufrufe in einer Seite zusammentreffen können. Er wirft einen `Error` mit dem Namen des Tags, wenn eine andere Klasse es hält, etwa weil eine zweite Kopie des Pakets in dieselbe Seite gebündelt wurde: `Another element class already defines the custom element name erd-editor`.
Die Klassen des Stamms sind die, die die Einstiegspunkte definieren, daher gilt `customElements.get('erd-editor') === ErdEditorElement`, sobald einer von beiden gelaufen ist. Solange das Tag nicht definiert ist, erzeugt `document.createElement('erd-editor')` ein einfaches `HTMLElement` ohne eines der Mitglieder des Editors, und `new ErdEditorElement()` wirft einen Fehler.

Für ein eigenes Tag definieren Sie die Klasse selbst unter ihm und ergänzen das Tag selbst in `HTMLElementTagNameMap`. Tun Sie das in einem Fenster, das weder den Einstiegspunkt dieses Elements noch seinen Build mit [Script-Tag](#script-tag) lädt und keine Define-Funktion dafür aufruft, da eine Klasse pro Fenster einen Namen erhält:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Ein Bundle, das beide Elemente enthält, lässt Vite und Rolldown einmal für jede Anzeigesprache außer Englisch eine Warnung `INEFFECTIVE_DYNAMIC_IMPORT` ausgeben. Der Viewer lädt jede davon mit einem eigenen `import()`, und der Editor importiert jedes Wörterbuch auf einmal, sodass sie im Chunk des Editors bleiben und mit ihm geladen werden. Nichts schlägt fehl, und ein Bundle nur mit dem Viewer hält jede Sprache in einem eigenen Chunk.

## Syntaxhervorhebung {#syntax-highlighting}

Die Bereiche Schema SQL und Codegenerator werden von [Shiki](https://shiki.style) in einem eigenen Shared Worker hervorgehoben, und seit `4.0.0` gilt das auch für die Skripte `Before tables` und `After tables` der Registerkarte Schema SQL.
Seit `3.7.0` muss nichts installiert und nichts registriert werden: Der Worker wird erzeugt, wenn ein Codebereich zum ersten Mal gerendert wird, daher lädt eine Seite, die keinen öffnet, die Grammatiken nie.

| | |
| --- | --- |
| Sprachen | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Designs | `github-dark` und `github-light`, je nach hellem oder dunklem Erscheinungsbild des Editors |

Das sind genau die Sprachen, die die Bereiche ausgeben: `JPA` wird als Java hervorgehoben, `SQLAlchemy` als Python, `TypeORM`, `Sequelize`, `Drizzle` und `Zod` als TypeScript, `Doctrine` als PHP, `SeaORM` als Rust, `JSON Schema` als JSON sowie `DBML` und `AML` als SQL, die nächstliegende Grammatik im Bundle – siehe [Codegenerator](../guide/guides/code-generator.md).

Die Regex-Engine ist reines JavaScript, daher benötigt keine Richtlinie eines Hosts `wasm-unsafe-eval`.
Wo `SharedWorker` fehlt – Chrome unter Android vor Chrome 148, Safari vor 16.4 –, wird der Fehler protokolliert und der Code als reiner Text angezeigt; die Skripte lassen sich weiterhin bearbeiten.

Upgrade von `3.6.0` oder älter: `@dineug/erd-editor-shiki-worker` wird nicht mehr veröffentlicht, und `setGetShikiServiceCallback` ist damit ebenfalls entfallen.
Entfernen Sie die Installation und die Registrierung; eine Seite, die den Worker von einem CDN geladen hat, entfernt außerdem dieses zweite Tag `<script>`.

## Web Worker {#web-workers}

Der Editor führt drei Aufgaben in Instanzen von `SharedWorker` aus: Syntaxhervorhebung, Bildexport und das Tabellenlayout, auf dem [Automatisches Layout](../guide/guides/table-related-functions.md#auto-layout), der [Flow-Modus](../guide/guides/visualization.md#how-flow-is-placed) der Registerkarte Visualisierung und seit `4.0.0` die Anordnung eines importierten Schemas beruhen.
Alle drei sind in `@dineug/erd-editor` enthalten. Keinen davon müssen Sie einrichten, aber jeden davon kann ein Host blockieren.
Seit `5.0.0` wird jeder Worker in einem eigenen Modul erzeugt, sodass ein Bundle nur die Worker trägt, die seine Module erreichen: Ein Bundle aus [toImage](./to-image.md) und keinem Element trägt allein den Worker für den Bildexport, und `<erd-viewer>` startet überhaupt keinen Worker – siehe [Einstiegspunkte](#entry-points).
Der Worker, der die Garbage Collection des Dokuments ausführte, wurde in `4.0.0` zusammen mit der Garbage Collection selbst entfernt.

| Worker | Ohne ihn |
| --- | --- |
| Syntaxhervorhebung | Die Bereiche Schema SQL und Codegenerator sowie die Skripte von Schema SQL bleiben reiner Text |
| Bildexport | PNG, SVG, `Copy to clipboard`, die Vorschau des Dialogs `Export image` und seit `5.0.0` [toImage()](./to-image.md) werden im Hauptthread gezeichnet, was die Seite während des Zeichnens blockiert |
| Tabellenlayout | Die Layouts `Flow`, `Tree - vertical` und `Tree - horizontal` im Automatischen Layout sowie der Flow-Modus der Registerkarte Visualisierung enden mit `Could not place tables`; ein von Flow angeordneter Import – eine SQL-, GraphQL-, DBML- oder AML-Datei über `Import` oder `Import and Add` oder ein Aufruf von `setSchema*()` mit `placement: 'auto'` – legt seine Tabellen ohne Meldung in Zeilen ab; `Force` und der Graph-Modus sind nicht betroffen, da sie im Editor selbst laufen |

Der Bildexport wartet zehn Sekunden auf eine Antwort seines Workers und zeichnet dann im Hauptthread, und die Syntaxhervorhebung belässt den Code als reinen Text, sobald ihr Worker ausfällt, daher kostet ein Host, der Worker blockiert, Leistung statt Funktionalität.
Das Tabellenlayout ist die Ausnahme: Die Engine, die ein Layout berechnet, ist umfangreicher als der Editor selbst und wird nie im selben Prozess geladen, daher wartet das Tabellenlayout bei der ersten Anordnung dreißig Sekunden auf seinen Worker, und sobald der Worker geantwortet hat, wartet es sechzig Sekunden auf ein Layout.
Läuft eine der beiden Wartezeiten ab, endet die Anordnung so wie ohne den Worker. Das Automatische Layout zeigt den Hinweis `Placing tables`, sobald es startet, während der Flow-Modus und ein von Flow angeordneter Import ihn erst zeigen, wenn eine Anordnung, den Start ihres Workers eingeschlossen, sechs Sekunden lang gelaufen ist.

Vite, webpack 5 und Rspack geben die Worker als Dateien neben Ihren Chunks aus. esbuild und Rolldown, wenn es für sich allein statt über Vite verwendet wird, geben keine aus, sodass eine damit gebaute Seite ohne die Worker läuft.
Unter dem experimentellen `experiments.outputModule` von webpack startet kein Worker, da jeder auf einen von ihm abgespaltenen Chunk wartet, den nichts lädt. Behalten Sie die Standardausgabe von webpack bei, oder setzen Sie `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Eine Seite unter einer strengen Content Security Policy braucht diese Direktiven für die Elemente:

- `worker-src 'self'` für den gebündelten Build, dessen Worker Dateien neben dem Paket sind, sowie `blob:`, wo Ihr Bundler einen Worker inline einbettet. Im Build für das [Script-Tag](#script-tag) sind alle drei als URLs vom Typ `data:` in der Datei enthalten, daher benötigt diese Seite stattdessen `worker-src data:`. `<erd-viewer>` braucht keines von beiden, da es keinen Worker startet.
- Seit `5.0.0` gestalten sich beide Elemente mit Constructed Stylesheets, die `style-src 'self'` durchlässt. Die Codebereiche des Editors färben ihren Text weiterhin mit `style`-Attributen, und die Vorschau des Dialogs `Export image` ist ein Bild unter einer `blob:`-URL, sodass der Editor dafür außerdem `style-src 'unsafe-inline'` und `img-src blob:` braucht.
- Ein Browser ohne Constructed Stylesheets, etwa Firefox vor 101, bekommt stattdessen Elemente `<style>`, die für jedes der beiden Elemente `style-src 'unsafe-inline'` brauchen.
- `<erd-viewer>` ruft sein `src` ab, daher gehört dieser Ursprung in `connect-src` – siehe [Was es einer Seite hinzufügt](./erd-viewer-element.md#what-it-adds-to-a-page).

## Einstiegspunkte {#entry-points}

Das Paket hat fünf Einstiegspunkte:

| Einstiegspunkt | Was er ist |
| --- | --- |
| `@dineug/erd-editor` | Der Stamm: die unten aufgeführten Exporte. Seit `5.0.0` definiert er kein Element, braucht zum Laden aber weiterhin ein DOM |
| `@dineug/erd-editor/erd-editor.js` | Seit `5.0.0`. Definiert `<erd-editor>` und exportiert nichts |
| `@dineug/erd-editor/erd-viewer.js` | Seit `5.0.0`. Definiert `<erd-viewer>` und exportiert nichts |
| `@dineug/erd-editor/engine.js` | Der Dokument-Store ohne DOM |
| `@dineug/erd-editor/peer.js` | Seit `3.9.1`. Der Teilnehmer im Headless-Modus des MCP-Servers |

Der Stamm exportiert beide Elementklassen und ihre Define-Funktionen, zwei Callback-Setter, seit `3.9.2` die Standard-Tastenbelegungen mit ihren Typen, seit `4.0.0` die Typen für die Anzeigesprache und den Typ der Optionen von `getSchemaSQL()`, seit `4.2.0` die Tastenkombinationen für die Zeilen der Registerkarte Wörterbuch und seit `5.0.0` `toImage`.

| Export | Beschreibung |
| --- | --- |
| `ErdEditorElement` | Die Schnittstelle des Elements – siehe [ErdEditorElement](./erd-editor-element.md). Seit `5.0.0` auch seine Klasse, als die `<erd-editor>` definiert wird – siehe [Die Elemente registrieren](#registering-the-elements). |
| `ErdViewerElement` | Seit `5.0.0`. Die Schnittstelle und Klasse des Viewers – siehe [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Seit `5.0.0`. Definieren `<erd-editor>` oder `<erd-viewer>` als seine Klasse. Ein Aufruf bewirkt nichts, solange das Tag diese Klasse hält, und wirft einen `Error`, wenn eine andere Klasse es hält – siehe [Die Elemente registrieren](#registering-the-elements). |
| `toImage(value, options)` | Seit `5.0.0`. Zeichnet ein Dokument als PNG-`Blob` oder SVG-Zeichenkette, mit den Optionen des Dialogs `Export image` – siehe [toImage](./to-image.md). |
| `ToImageOptions` (Typ) | Seit `5.0.0`. Die Optionen, die `toImage()` annimmt: `format`, `background`, `darkMode` und `scale`. |
| `setExportFileCallback(cb)` | Ersetzt den Download des Browsers, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Ersetzt die Dateiauswahl des Browsers, `({ type, op, accept, mode }) => void`; `mode` seit `4.0.0`. Seit `4.2.0` öffnet die Schaltfläche `Import CSV` der Registerkarte Wörterbuch auch bei gesetztem Callback die Dateiauswahl des Browsers – siehe [Dateidialoge](#file-dialogs). |
| `createKeyBindingMap()` | Gibt bei jedem Aufruf die Standard-Tastenbelegungen als neue `KeyBindingMap` zurück – siehe [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (Typen) | Eine Map der Tastenbelegungen, die Union ihrer Befehlsnamen und eine einzelne Belegung. |
| `dictionaryRowChords(map)` | Seit `4.2.0`. Gibt bei jedem Aufruf als neues `ShortcutOption[]` die Tastenkombinationen zurück, mit denen das Raster der Registerkarte [Wörterbuch](../guide/guides/dictionary.md#adding-and-deleting-rows) unter der übergebenen `KeyBindingMap` Zeilen einfügt und löscht. Die Tastenkombination, die Zeilen oberhalb einfügt, bei den Standardbelegungen `Alt+Shift+Enter`, ist in keiner Belegung enthalten – siehe [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (Typen) | Seit `4.0.0`. Die 25 Codes der Anzeigesprachen sowie diese Codes plus `'system'`, die `setLocale()` annimmt – siehe [Anzeigesprache](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (Typ) | Seit `4.0.0`. Die Optionen, die `getSchemaSQL()` annimmt: `statements`, `header` und seit `4.2.0` `logicalNameAsComment` – siehe [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Seit `5.0.0` enthält `dist` eine nicht minifizierte Datei pro Modul, jeweils mit ihrer Deklaration daneben, und `sideEffects` in `package.json` nennt nur die beiden Tag-Einstiegspunkte und zwei Stubs, die die Worker-Dateien brauchen. So verwirft ein Bundler jedes Modul, das eine Seite nicht erreicht, und minifiziert einmal:

- Ein benannter Import aus dem Stamm, etwa `setExportFileCallback`, bündelt weder ein Element noch einen Worker.
- `toImage` bringt den Worker für den Bildexport und kein Element.
- `erd-editor.js` bringt den Editor und alle drei Shared Worker.
- `erd-viewer.js` bringt den Viewer und keinen Worker, mit Englisch darin und jeder anderen Anzeigesprache in einem eigenen Chunk, der geladen wird, sobald eine Seite sie anfordert.

`@dineug/erd-editor/engine.js` führt den Store des Dokuments ohne DOM aus, daher funktioniert er in einem Web Worker – siehe [Remote-Speicherung](./advanced/remote-storage.md).
Er exportiert `createReplicationStore` und den Typ `ReplicationStore`. Seit `3.10.0` exportiert er außerdem den Typ `ReplicationChange`, `{ value: string; changed: boolean }`, den der Listener für `change` eines Replikats erhält – siehe [on@change](./advanced/remote-storage.md#onchange).
Seit `4.0.0` hat ein `ReplicationStore` außerdem eine Eigenschaft `runtimeValue`. Sein Wert `value` und der Wert, den ein Ereignis `change` übergibt, sind wie beim Element die Speicherform, die eine Datei enthält – siehe [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` ist der Teilnehmer im Headless-Modus, über den der [MCP-Server](../mcp/introduction.md) ein Dokument bearbeitet. Er existiert für diesen Server, und diese Seiten dokumentieren ihn nicht.

### Dateidialoge {#file-dialogs}

Import und Export laufen über injizierbare Callbacks, daher kann ein Host ohne Dateidialog des Browsers – zum Beispiel die Webview einer IDE – einen eigenen bereitstellen.
Die beiden sind nicht symmetrisch: Der Export übergibt Ihnen die fertige Datei, während der Import nur eine anfordert und Sie den Inhalt selbst einspeisen.
Seit `4.2.0` ist der Import über `Import CSV` der Registerkarte Wörterbuch der einzige, der den Import-Callback nie aufruft, dessen `type` keinen Wert für CSV hat. Er öffnet immer die eigene Dateiauswahl des Browsers, für Dateien `.csv` – siehe [CSV importieren und exportieren](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` ist `set` oder `diff` – ein `diff` geht unabhängig vom Wert von `type` an `setDiffValue()`. Andernfalls wählt `type` die Methode, und `accept` enthält die Dateiendungen dieses Typs, bereit zur Übergabe an einen Dateidialog des Hosts.
Seit `4.0.0` enthält ein `set` den Wert `mode: 'append'`, wenn der Benutzer [Importieren und hinzufügen](../guide/guides/file-import-export.md#import-and-add) gewählt hat, und bei einem einfachen Import kein `mode`. Geben Sie den Wert weiter: Ein Callback, der ihn verwirft, ersetzt das Diagramm, das der Benutzer ergänzen wollte.

| `type` | `accept` | Methode |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` ordnet die Tabellen vor dem Ablegen anhand ihrer Beziehungen an, wie es der eigene Import des Editors tut, und lässt den Aufruf ein Promise zurückgeben. Ohne diese Option landen sie sofort in Zeilen – siehe [setSchemaSQL](./erd-editor-element.md#setschemasql) und [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Fragen Sie jeden Wert von `type`, den Sie behandeln, einzeln ab, und ignorieren Sie die übrigen.
Ein ersetzender Aufruf von `setSchemaJSON()` leert wie eine Zuweisung an `value` das Dokument vor dem Parsen; werden dorthin also Daten geleitet, die kein Dokument `.erd.json` sind – über einen allgemeinen Zweig `else` oder weil ein später hinzugekommener Wert von `type` durchgerutscht ist –, wird das Diagramm geleert, statt dass etwas importiert wird.

Der Wert von `fileName`, den der Editor erzeugt, ist `<database name>-<timestamp>` zuzüglich der Dateiendung, wobei der Zeitstempel die lokale Zeit im Format `yyyy-MM-dd'T'HH_mm_ss` ist. Bei einem leeren Datenbanknamen wird `unnamed` verwendet. Bei einer CSV-Datei des Wörterbuchs steht vor der Endung der Name ihres Blatts, wie in `<database name>-<timestamp>-words.csv`.
Der Export-Callback erhält diese Dateien. Seit `4.0.0` gehören die SVG-Datei und die Dateien des Codegenerators dazu, und die Datei `.sql` stammt aus `Save file` der Registerkarte Schema SQL statt direkt aus `Export`. Seit `4.2.0` gehört auch die CSV-Datei der Registerkarte Wörterbuch dazu. [toImage()](./to-image.md) ruft keinen der beiden Callbacks auf: Es gibt sein Bild an Sie zurück.

| Datei | Endung | `type` des Blobs |
| --- | --- | --- |
| Der JSON-Export | `.erd.json` | `application/json` |
| `Save file` der Registerkarte Schema SQL mit dem Text, den die Registerkarte anzeigt – siehe [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | keiner |
| Der Dialog [Bild exportieren](../guide/guides/file-import-export.md#image) | `.png` oder `.svg` | `image/png` oder `image/svg+xml` |
| `Save file` der Registerkarte Codegenerator – siehe [Codegenerator](../guide/guides/code-generator.md) | Die Endung der Sprache: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` oder `.mmd` | keiner |
| `Export CSV` der Registerkarte Wörterbuch mit allen Zeilen des angezeigten Blatts, unabhängig davon, was seine Suche auflistet – siehe [CSV importieren und exportieren](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Ein Host, der einen Handler nach Dateiendung auswählt, benötigt für jede dieser Dateien einen.

Sind keine Callbacks gesetzt, verwendet der Editor das eigene Download- und Dateiauswahlverhalten des Browsers. Übergeben Sie `null`, um dazu zurückzukehren.

## Browserunterstützung {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – die ES2022-Basis, für die die veröffentlichten Bundles gebaut werden.
Es werden keine Polyfills mitgebündelt. Fügen Sie eigene hinzu, wenn Sie ältere Browser erreichen müssen.

## Upgrade von 4.x {#upgrading-from-4x}

`5.0.0` ist eine Major-Version. Prüfen Sie jeden dieser Punkte, wenn Sie eine Seite von 4.x umstellen:

- `import '@dineug/erd-editor'` definiert `<erd-editor>` nicht mehr. Importieren Sie stattdessen `@dineug/erd-editor/erd-editor.js` wegen seiner Wirkung, oder rufen Sie `defineErdEditor()` auf, und behalten Sie Ihre benannten Importe aus dem Stamm bei. TypeScript beanstandet eine Seite mit dem alten Import nicht, da die Deklarationen des Stamms das Tag weiterhin in `HTMLElementTagNameMap` nennen, aber das erzeugte Element ist ein einfaches `HTMLElement`, sodass sein erster Methodenaufruf einen `TypeError` wirft – siehe [Die Elemente registrieren](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Auf einem CDN gilt dasselbe für `https://esm.run/@dineug/erd-editor`, das nun den Stamm liefert und nichts definiert: Importieren Sie `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Die einfachen URLs von jsDelivr und unpkg liefern weiterhin den Build für das Script-Tag, der `<erd-editor>` wie zuvor definiert. Eine URL ohne Versionsangabe liefert nun die neueste 5.x-Version; fixieren Sie `@4.2.0`, um bei 4.x zu bleiben – siehe [CDN](#cdn) und [Script-Tag](#script-tag).
- Der Stamm definiert nichts, braucht aber weiterhin ein DOM, daher bleibt bei serverseitigem Rendering ein benannter Import daraus, etwa `setExportFileCallback`, neben dem Einstiegspunkt des Elements auf dem Pfad nur für den Client – siehe [Serverseitiges Rendering](#server-side-rendering).
- `window.ErdEditor` erhält `ErdEditorElement` und `defineErdEditor`. Der Script-Tag-Build des Viewers legt `ErdViewerElement` und `defineErdViewer` auf `window.ErdViewer`, und keines der beiden Globals enthält `toImage`.
- Ein `readonly`-Editor öffnet sich als Leser. Seine sechs Registerkarten, der Explorer, die Schnellsuche und die Präsenz bleiben, und jedes Bedienelement, das das Diagramm bearbeiten würde, fehlt, statt deaktiviert zu sein: Die Symbolleiste zeigt den Namen der Datenbank als Text, die Registerkarte Einstellungen zeigt ihre Einstellungen mit deaktivierten Bedienelementen unter einem Badge `Read only`, und die schwebende Symbolleiste behält nur den Zoom, die Namensansicht, den Zen-Modus und den Kompass, sodass `Hand` und `Select` entfallen und ein Ziehen die Zeichenfläche verschiebt. Ein Druck wählt nichts aus: Die einzige Auswahl ist der Umriss, den ein Sprung aus dem Explorer oder der Schnellsuche um das legt, was er erreicht, den ein Klick ohne Bewegung aufhebt, und die Tastenkombinationen zum Alles-Auswählen wählen nichts aus. Das Einschalten von `readonly` beendet, was offen stand, etwa die Auswahl, das Hand-Werkzeug, einen Zelleneditor, ein Ziehen, Map Columns, die Vorschau `Force` von Auto Layout und Time Travel, und behält das Scrollen, den Zoom, die Registerkarte und die Namensansicht – siehe [readonly](./erd-editor-element.md#readonly).
- Die Einstellungen, die der Leser eines `readonly`-Editors ändert, bleiben auf dem Bildschirm dieses Editors, was auch immer ihre Sperren besagen: das Scrollen und der Zoom, die Registerkarte, die Namensansicht, View Option, die Datenbank sowie Sprache, Schreibweisen und Begrenzertyp des Codegenerators. `value`, `runtimeValue` und der JSON-Export behalten die eigenen Einstellungen des Dokuments, die die Änderungen eines Lesers in 4.x erreichen konnten, und `getSharedStore()` sendet keine davon an die anderen Editoren. `getSchemaSQL()` ohne Datenbanksystem schreibt die Datenbank, die der Leser gewählt hat. Das Ausschalten von `readonly` setzt die Datenbank, die Code-Einstellungen und View Option auf die des Dokuments zurück und lässt das Scrollen, den Zoom, die Registerkarte und die Namensansicht dort, wo der Leser sie gelassen hat.
- Die Zeile `Recalculation table width` der Registerkarte Einstellungen ist entfallen. Ein Laden und ein Einfügen passen die Breite jeder Tabelle weiterhin ihrem Text an.
- Entfernen Sie bei Vite 8 ein `exclude: ['@dineug/erd-editor']` aus `optimizeDeps`, das nur Vite 7 und älter noch brauchen, und behalten Sie das `include` für ELK bei – siehe [Vite](#vite).

## Upgrade von 3.x {#upgrading-from-3x}

`4.0.0` ist eine Major-Version. Prüfen Sie jeden dieser Punkte, wenn Sie eine Seite von 3.x umstellen, und danach die unter [Upgrade von 4.x](#upgrading-from-4x) für `5.0.0`:

- `editor.value`, der Wert `value` eines Replikats und der Wert `value`, den sein Ereignis `change` übergibt, sind die Speicherform, die eine Datei enthält: ohne entfernte Entitäten, gemessene Breiten, Stapelreihenfolge und Beziehungsanker. Speichern Sie weiterhin `value`, und lesen Sie diese Angaben aus `runtimeValue`; Zeitstempel von Entitäten (`meta`) sind ganz entfallen. Initialisieren Sie einen Mitbearbeiter oder ein Replikat, das einer laufenden Sitzung beitritt, aus dem `runtimeValue` eines laufenden Teilnehmers, nicht aus `value` oder der Datei, und speichern Sie `runtimeValue` nie – siehe [value](./erd-editor-element.md#value) und [runtimeValue](./erd-editor-element.md#runtimevalue).
- Einstellungssperren ersetzen `Save Scroll Information` und `Save Zoom Information`. Bei einem neuen Dokument und bei jedem vor `4.0.0` gespeicherten Dokument sind alle Sperren eingeschaltet, daher lassen Scrollen, Zoomen, ein Wechsel der Registerkarte oder eine Änderung der Sprache des Codegenerators, einer Schreibweise oder des Begrenzertyps `value` unverändert und lösen kein Ereignis `change` aus. Eine Seite, die die Ansicht über `change` gespeichert hat, muss `Viewport` (und für die Registerkarte `Canvas Type`) auf der Registerkarte Einstellungen entsperren oder ein Dokument verwenden, dessen `settings.lockSettings` diese Bits nicht setzt – siehe [Sperren](../guide/guides/settings.md#lock).
- `settings` hat die Felder `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` und `ignoreSaveSettings` nicht mehr, und die Konstanten `SaveSettingType` sind entfallen. `settings.lockSettings` mit den Bits von `LockSettingType` tritt an die Stelle von `ignoreSaveSettings`, das `4.0.0` oder neuer weder liest noch schreibt – siehe [Settings](./advanced/schema.md#settings).
- Das [JSON Schema](./advanced/schema.md#json-schema), das jede Datei in `$schema` angibt, beschreibt jetzt allein die Speicherform und ist geschlossen: Es lehnt eine von einer früheren Version gespeicherte Datei ab, bis ein Speichern mit `4.0.0` oder neuer sie neu schreibt.
- Die Garbage Collection des Dokuments ist zusammen mit ihrem Worker entfallen, daher bleibt eine entfernte Entität in `runtimeValue`, bis das Dokument das nächste Mal aus seiner Datei geöffnet wird. Drei Shared Worker bleiben – siehe [Web Worker](#web-workers).
- Halten Sie jeden Editor und jedes Replikat in einer gemeinsamen Sitzung auf `4.0.0` oder neuer. Eine frühere Version ignoriert die neuen Aktionstypen: die für Tabellengruppen, den Dialog „Spalten zuordnen“, die Sperren und die Skripte von Schema SQL – siehe [Gemischte Versionen](./advanced/collaborative-editing.md#mixing-releases).
- Der Import-Callback erhält bei „Importieren und hinzufügen“ den Wert `mode: 'append'`, den ein Callback weitergeben muss. Der Export-Callback erhält jetzt auch Dateien `.svg` und Dateien des Codegenerators, und `Export` ▸ `Schema SQL` öffnet die Registerkarte Schema SQL, statt zu speichern, daher kommt die Datei `.sql` nur über `Save file` dieser Registerkarte – siehe [Dateidialoge](#file-dialogs).
- `Delete` und `Backspace` sind an den neuen Befehl `removeSelection` gebunden. Solange der Editor den Fokus außerhalb eines Textfelds hat, wird die Standardaktion der Taste auf jeder Registerkarte verhindert, und auf der Registerkarte ERD wird die Auswahl entfernt. `KeyBindingName` und `KeyBindingMap` erhalten ihn, und `setKeyBindingMap({ removeSelection: [] })` überlässt beide Tasten der Seite – siehe [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` nimmt auch `'system'` an, die Option `System` der Designauswahl, die beim Einschalten von `systemDarkMode` gesetzt wird. `changePresetTheme` meldet `'system'`, solange diese Option ausgewählt ist, daher speichern Sie den Wert unverändert und geben ihn an `setPresetTheme` zurück. Bei eingeschaltetem `systemDarkMode` bleibt ein Aufruf von `setPresetTheme()` mit `'light'` oder `'dark'` jetzt bestehen, statt bei der nächsten Änderung des Betriebssystems überschrieben zu werden – siehe [systemDarkMode](./erd-editor-element.md#systemdarkmode) und [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` oder neuer, die Erweiterung für VS Code `4.0.0` oder neuer und die Plugins für Obsidian und JetBrains `1.0.0` oder neuer sprechen das Hub-Protokoll 2. Der Server `1.0.0` oder neuer und eine frühere Editor-Version, die Agenten bedient, oder ein früherer Server und einer dieser Editoren lehnen einander mit `protocolMismatch` ab und nennen die Seite, die aktualisiert werden muss – siehe [Aktualisieren](../mcp/installation.md#updating).
- Eine CDN-URL ohne Versionsangabe liefert die neueste Version, seit `5.0.0` 5.x. Fixieren Sie `@3.10.0`, um bei 3.x zu bleiben – siehe [CDN](#cdn).
