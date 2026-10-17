---
sidebar_position: 1
description: "@dineug/erd-editor über npm oder ein CDN installieren, das Custom Element einbinden, die Dateidialoge anbinden und ein Upgrade von 3.x durchführen."
---

# Installation

```sh
npm install @dineug/erd-editor
```

Das Paket ist ausschließlich ESM (`"type": "module"`) und liefert nur seinen Ordner `dist` aus.
Es gibt keinen CommonJS-Build, daher funktioniert `require('@dineug/erd-editor')` nicht.

Seine Laufzeitabhängigkeiten bleiben extern, als Bare Imports, die Ihr Bundler auflöst, dedupliziert und per Tree-Shaking reduziert.
Seine Shared Worker werden als eigene Einstiegsdateien unter `dist/workers/` ausgegeben und mit `new URL('./…', import.meta.url)` erzeugt, der Schreibweise, die Vite, webpack 5 und Rspack als Worker-Einstiegspunkt bündeln. Siehe [Web Worker](#web-workers).
Für eine Seite, hinter der kein Bundler steht, gibt es einen zweiten, eigenständigen Build – siehe [Script-Tag](#script-tag).

## Verwendung {#usage}

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

`<erd-editor>` hat keine eigene Größe. Geben Sie dem Element (oder seinem Container) eine explizite Breite und Höhe.
Seit `4.1.0` dockt ein geöffneter [Explorer](../guide/guides/explorer.md) innerhalb des Elements links neben der ERD-Zeichenfläche an und verschmälert die Zeichenfläche, statt sie zu überdecken. Ein neuer Editor startet mit geschlossenem Explorer.
Der Bereich wird nie schmaler als `200px` gezeichnet und lässt der Zeichenfläche mindestens `320px`, daher wird ein geöffneter Explorer in einem Element, das schmaler als `520px` ist, erst gezeichnet, wenn das Element breiter wird – siehe [Neben der Zeichenfläche](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` beginnt ein neues, leeres Dokument. Eine Zuweisung an `value` lädt ein Dokument dagegen als Änderung, sodass es im Verlauf landet.
Seit `4.0.0` ist `editor.value` das Dokument in der Form, die eine Datei enthält, und genau diesen Wert sollten Sie speichern. `editor.runtimeValue` ist das Dokument, wie der Editor es hält, entfernte Entitäten eingeschlossen: Es dient zum Initialisieren eines Mitbearbeiters und gelangt nie in eine Datei – siehe [runtimeValue](./erd-editor-element.md#runtimevalue).
Seit `4.0.0` sind bei einem neuen Dokument außerdem alle [Einstellungssperren](../guide/guides/settings.md#lock) eingeschaltet: Ansichtsbereich, Registerkarte, Sprache des Codegenerators, beide Schreibweisen und Begrenzertyp. Scrollen, Zoomen, ein Wechsel der Registerkarte oder die Änderung einer dieser Einstellungen lässt `editor.value` unverändert und löst kein Ereignis `change` aus. Ein aus Text geladenes Dokument behält die Sperren, die es angibt. Ein Dokument, das keine angibt, wie jede vor `4.0.0` gespeicherte Datei, öffnet sich mit allen Sperren im eingeschalteten Zustand, bei einer Zoomstufe von 100 % und auf der Registerkarte ERD, unabhängig davon, welche Ansicht und Registerkarte es gespeichert hat. Seine Ansicht ist am Ursprung `0, 0` gesperrt und öffnet sich stattdessen auf dem Diagramm, wenn dort kein Teil davon gezeichnet ist – siehe [setInitialValue](./erd-editor-element.md#setinitialvalue).
Zur übrigen API siehe [ErdEditorElement](./erd-editor-element.md).

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

`esm.run` löst die externen Abhängigkeiten des Pakets für Sie auf, daher funktioniert dies ohne Bundler.
Die URL ohne Versionsangabe liefert immer die neueste Version. Fixieren Sie eine Version – `https://esm.run/@dineug/erd-editor@4.1.0` –, wenn Sie nicht möchten, dass ein Major-Upgrade Ihre Seite unangekündigt erreicht.
`4.0.0` ist selbst ein solches: Eine Seite, die bei 3.x bleiben muss, fixiert `@3.10.0` – siehe [Upgrade von 3.x](#upgrading-from-3x).

### Script-Tag {#script-tag}

Seit `3.6.0` liefert das Paket außerdem einen UMD-Build aus, der alle Abhängigkeiten und alle Shared Worker in einer einzigen Datei enthält.
Auf ihn verweisen die Felder `unpkg` und `jsdelivr`, daher liefert ihn die einfache Paket-URL auf beiden CDNs aus, und er definiert `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Wird er importiert, registriert er `<erd-editor>` auf dieselbe Weise; `window.ErdEditor` enthält die beiden Datei-Callbacks `ErdEditor.setExportFileCallback` und `ErdEditor.setImportFileCallback` sowie seit `3.9.2` `ErdEditor.createKeyBindingMap`.
Die Exports-Map verweist einen Bundler weiterhin auf die ES-Module, daher verwendet eine Installation über npm diese Datei nie.

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

Seit `4.0.0` fügt `enable-locale-picker` die Sprachauswahl `Display Language` in der Symbolleiste hinzu und `enable-welcome-screen` den Willkommensbildschirm, den ein leeres Diagramm zeigt – siehe [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) und [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Eine Seite, die wie in [Verwendung](#usage) ein Dokument lädt, schaltet `enableWelcomeScreen` nicht im Markup ein, sondern erst, wenn `setInitialValue()` das Dokument geladen hat, sodass der Bildschirm nie über einer Datei aufblitzt, die noch geladen wird.
Alle 25 Anzeigesprachen sind im Paket enthalten, im ES-Build ebenso wie im Script-Tag-Build, daher muss keine Sprachdatei bereitgestellt und nichts registriert werden. Ohne Sprachauswahl und ohne Aufruf von `setLocale()` zeigt der Editor Englisch an.

Wenn Sie hier `readonly` hinzufügen, wird das Bearbeiten blockiert: Zuweisungen an `value`, Aufrufe von `clear()` und jeder Aufruf von `setSchema*()` – `setSchemaJSON()` und das Anhängen eingeschlossen – werden ignoriert, und das Ereignis `change` wird nie ausgelöst. Das Lesen von `editor.value` und `editor.runtimeValue` funktioniert weiterhin. Laden Sie stattdessen mit `setInitialValue()`.

### Serverseitiges Rendering {#server-side-rendering}

Der Import des Pakets registriert das Custom Element auf Modulebene, daher benötigt das Paket ein DOM und wirft in Node einen Fehler.
Importieren Sie es in Next.js, Nuxt, SvelteKit oder Astro aus einem Codepfad, der nur im Client ausgeführt wird.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Der Import des Pakets ergänzt `HTMLElementTagNameMap` um `erd-editor`, daher ist das Element ohne Cast typisiert.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` wird exportiert, damit Sie Ihre eigenen Variablen und Props annotieren können.
Seit `4.0.0` exportiert das Paket außerdem die Typen `LocaleCode`, `LocaleOption` und `SchemaSQLOptions` – siehe [Einstiegspunkte](#entry-points). Die Optionen, die die Methoden `setSchema*()` annehmen, haben keinen exportierten Namen; leiten Sie sie vom Element ab, als `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Syntaxhervorhebung {#syntax-highlighting}

Die Bereiche Schema SQL und Codegenerator werden von [Shiki](https://shiki.style) in einem eigenen Shared Worker hervorgehoben, und seit `4.0.0` gilt das auch für die Skripte `Before tables` und `After tables` der Registerkarte Schema SQL.
Seit `3.7.0` muss nichts installiert und nichts registriert werden: Der Worker wird erzeugt, wenn ein Codebereich zum ersten Mal gerendert wird, daher lädt eine Seite, die keinen öffnet, die Grammatiken nie.

| | |
| --- | --- |
| Sprachen | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Designs | `github-dark` und `github-light`, je nach hellem oder dunklem Erscheinungsbild des Editors |

Das sind genau die Sprachen, die die Bereiche ausgeben: `JPA` wird als Java hervorgehoben, `SQLAlchemy` als Python, `TypeORM`, `Sequelize`, `Drizzle` und `Zod` als TypeScript, `Doctrine` als PHP, `SeaORM` als Rust, `JSON Schema` als JSON sowie `DBML` und `AML` als SQL, die nächstliegende Grammatik im Bundle – siehe [Codegenerator](../guide/guides/code-generator.md).

Die Regex-Engine ist reines JavaScript, daher benötigt keine Richtlinie eines Hosts `wasm-unsafe-eval`.
Wo `SharedWorker` fehlt – Chrome unter Android, Safari vor 16.4 –, wird der Fehler protokolliert und der Code als reiner Text angezeigt; die Skripte lassen sich weiterhin bearbeiten.

Upgrade von `3.6.0` oder älter: `@dineug/erd-editor-shiki-worker` wird nicht mehr veröffentlicht, und `setGetShikiServiceCallback` ist damit ebenfalls entfallen.
Entfernen Sie die Installation und die Registrierung; eine Seite, die den Worker von einem CDN geladen hat, entfernt außerdem dieses zweite Tag `<script>`.

## Web Worker {#web-workers}

Der Editor führt drei Aufgaben in Instanzen von `SharedWorker` aus: Syntaxhervorhebung, Bildexport und das Tabellenlayout, auf dem [Automatisches Layout](../guide/guides/table-related-functions.md#auto-layout), der [Flow-Modus](../guide/guides/visualization.md#how-flow-is-placed) der Registerkarte Visualisierung und seit `4.0.0` die Anordnung eines importierten Schemas beruhen.
Alle drei sind in `@dineug/erd-editor` enthalten. Keinen davon müssen Sie einrichten, aber jeden davon kann ein Host blockieren.
Der Worker, der die Garbage Collection des Dokuments ausführte, wurde in `4.0.0` zusammen mit der Garbage Collection selbst entfernt.

| Worker | Ohne ihn |
| --- | --- |
| Syntaxhervorhebung | Die Bereiche Schema SQL und Codegenerator sowie die Skripte von Schema SQL bleiben reiner Text |
| Bildexport | PNG, SVG, `Copy to clipboard` und die Vorschau des Dialogs `Export image` werden im Hauptthread gezeichnet, was die Seite während des Zeichnens blockiert |
| Tabellenlayout | Die Layouts `Flow`, `Tree - vertical` und `Tree - horizontal` im Automatischen Layout sowie der Flow-Modus der Registerkarte Visualisierung enden mit `Could not place tables`; ein von Flow angeordneter Import – eine SQL-, GraphQL-, DBML- oder AML-Datei über `Import` oder `Import and Add` oder ein Aufruf von `setSchema*()` mit `placement: 'auto'` – legt seine Tabellen ohne Meldung in Zeilen ab; `Force` und der Graph-Modus sind nicht betroffen, da sie im Editor selbst laufen |

Der Bildexport wartet zehn Sekunden auf eine Antwort seines Workers und zeichnet dann im Hauptthread, und die Syntaxhervorhebung belässt den Code als reinen Text, sobald ihr Worker ausfällt, daher kostet ein Host, der Worker blockiert, Leistung statt Funktionalität.
Das Tabellenlayout ist die Ausnahme: Die Engine, die ein Layout berechnet, ist umfangreicher als der Editor selbst und wird nie im selben Prozess geladen, daher wartet das Tabellenlayout bei der ersten Anordnung dreißig Sekunden auf seinen Worker, und sobald der Worker geantwortet hat, wartet es sechzig Sekunden auf ein Layout.
Läuft eine der beiden Wartezeiten ab, endet die Anordnung so wie ohne den Worker. Das Automatische Layout zeigt den Hinweis `Placing tables`, sobald es startet, während der Flow-Modus und ein von Flow angeordneter Import ihn erst zeigen, wenn eine Anordnung, den Start ihres Workers eingeschlossen, sechs Sekunden lang gelaufen ist.

Im gebündelten Build werden alle drei als Dateien neben dem Paket ausgegeben, daher benötigt eine strenge CSP `worker-src 'self'` – sowie `blob:`, wo Ihr Bundler einen Worker inline einbettet.
Im Build für das [Script-Tag](#script-tag) sind alle drei als URLs vom Typ `data:` in der Datei enthalten, daher benötigt diese Seite stattdessen `worker-src data:`.

## Einstiegspunkte {#entry-points}

Der Import von `@dineug/erd-editor` registriert `<erd-editor>` als Nebeneffekt. Darüber hinaus exportiert das Paket den Elementtyp, zwei Callback-Setter, seit `3.9.2` die Standard-Tastenbelegungen mit ihren Typen und seit `4.0.0` die Typen für die Anzeigesprache und den Typ der Optionen von `getSchemaSQL()`.

| Export | Beschreibung |
| --- | --- |
| `ErdEditorElement` (Typ) | Die Schnittstelle des Elements – siehe [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Ersetzt den Download des Browsers, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Ersetzt die Dateiauswahl des Browsers, `({ type, op, accept, mode }) => void`; `mode` seit `4.0.0`. |
| `createKeyBindingMap()` | Gibt bei jedem Aufruf die Standard-Tastenbelegungen als neue `KeyBindingMap` zurück – siehe [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (Typen) | Eine Map der Tastenbelegungen, die Union ihrer Befehlsnamen und eine einzelne Belegung. |
| `LocaleCode`, `LocaleOption` (Typen) | Seit `4.0.0`. Die 25 Codes der Anzeigesprachen sowie diese Codes plus `'system'`, die `setLocale()` annimmt – siehe [Anzeigesprache](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (Typ) | Seit `4.0.0`. Die Optionen `statements` und `header`, die `getSchemaSQL()` annimmt – siehe [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` ist ein zweiter Einstiegspunkt. Er führt den Store des Dokuments ohne DOM aus, daher funktioniert er in einem Web Worker – siehe [Remote-Speicherung](./advanced/remote-storage.md).
Er exportiert `createReplicationStore` und den Typ `ReplicationStore`. Seit `3.10.0` exportiert er außerdem den Typ `ReplicationChange`, `{ value: string; changed: boolean }`, den der Listener für `change` eines Replikats erhält – siehe [on@change](./advanced/remote-storage.md#onchange).
Seit `4.0.0` hat ein `ReplicationStore` außerdem eine Eigenschaft `runtimeValue`. Sein Wert `value` und der Wert, den ein Ereignis `change` übergibt, sind wie beim Element die Speicherform, die eine Datei enthält – siehe [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Seit `3.9.1` gibt es einen dritten, `@dineug/erd-editor/peer.js`: den Teilnehmer im Headless-Modus, über den der [MCP-Server](../mcp/introduction.md) ein Dokument bearbeitet. Er existiert für diesen Server, und diese Seiten dokumentieren ihn nicht.

### Dateidialoge {#file-dialogs}

Import und Export laufen über injizierbare Callbacks, daher kann ein Host ohne Dateidialog des Browsers – zum Beispiel die Webview einer IDE – einen eigenen bereitstellen.
Die beiden sind nicht symmetrisch: Der Export übergibt Ihnen die fertige Datei, während der Import nur eine anfordert und Sie den Inhalt selbst einspeisen.

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

Der Wert von `fileName`, den der Editor erzeugt, ist `<database name>-<timestamp>` zuzüglich der Dateiendung, wobei der Zeitstempel die lokale Zeit im Format `yyyy-MM-dd'T'HH_mm_ss` ist. Bei einem leeren Datenbanknamen wird `unnamed` verwendet.
Der Export-Callback erhält diese Dateien. Seit `4.0.0` gehören die SVG-Datei und die Dateien des Codegenerators dazu, und die Datei `.sql` stammt aus `Save file` der Registerkarte Schema SQL statt direkt aus `Export`.

| Datei | Endung | `type` des Blobs |
| --- | --- | --- |
| Der JSON-Export | `.erd.json` | `application/json` |
| `Save file` der Registerkarte Schema SQL mit dem Text, den die Registerkarte anzeigt – siehe [Schema SQL](../guide/guides/schema-sql.md) | `.sql` | keiner |
| Der Dialog [Bild exportieren](../guide/guides/file-import-export.md#image) | `.png` oder `.svg` | `image/png` oder `image/svg+xml` |
| `Save file` der Registerkarte Codegenerator – siehe [Codegenerator](../guide/guides/code-generator.md) | Die Endung der Sprache: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` oder `.mmd` | keiner |

Ein Host, der einen Handler nach Dateiendung auswählt, benötigt für jede dieser Dateien einen.

Sind keine Callbacks gesetzt, verwendet der Editor das eigene Download- und Dateiauswahlverhalten des Browsers. Übergeben Sie `null`, um dazu zurückzukehren.

## Browserunterstützung {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – die ES2022-Basis, für die die veröffentlichten Bundles gebaut werden.
Es werden keine Polyfills mitgebündelt. Fügen Sie eigene hinzu, wenn Sie ältere Browser erreichen müssen.

## Upgrade von 3.x {#upgrading-from-3x}

`4.0.0` ist eine Major-Version. Prüfen Sie jeden dieser Punkte, wenn Sie eine Seite von 3.x umstellen:

- `editor.value`, der Wert `value` eines Replikats und der Wert `value`, den sein Ereignis `change` übergibt, sind die Speicherform, die eine Datei enthält: ohne entfernte Entitäten, gemessene Breiten, Stapelreihenfolge und Beziehungsanker. Speichern Sie weiterhin `value`, und lesen Sie diese Angaben aus `runtimeValue`; Zeitstempel von Entitäten (`meta`) sind ganz entfallen. Initialisieren Sie einen Mitbearbeiter oder ein Replikat, das einer laufenden Sitzung beitritt, aus dem `runtimeValue` eines laufenden Teilnehmers, nicht aus `value` oder der Datei, und speichern Sie `runtimeValue` nie – siehe [value](./erd-editor-element.md#value) und [runtimeValue](./erd-editor-element.md#runtimevalue).
- Einstellungssperren ersetzen `Save Scroll Information` und `Save Zoom Information`. Bei einem neuen Dokument und bei jedem vor `4.0.0` gespeicherten Dokument sind alle Sperren eingeschaltet, daher lassen Scrollen, Zoomen, ein Wechsel der Registerkarte oder eine Änderung der Sprache des Codegenerators, einer Schreibweise oder des Begrenzertyps `value` unverändert und lösen kein Ereignis `change` aus. Eine Seite, die die Ansicht über `change` gespeichert hat, muss `Viewport` (und für die Registerkarte `Canvas Type`) auf der Registerkarte Einstellungen entsperren oder ein Dokument verwenden, dessen `settings.lockSettings` diese Bits nicht setzt – siehe [Sperren](../guide/guides/settings.md#lock).
- `settings` hat die Felder `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` und `ignoreSaveSettings` nicht mehr, und die Konstanten `SaveSettingType` sind entfallen. `settings.lockSettings` mit den Bits von `LockSettingType` tritt an die Stelle von `ignoreSaveSettings`, das `4.0.0` oder neuer weder liest noch schreibt – siehe [Settings](./advanced/schema.md#settings).
- Das [JSON Schema](./advanced/schema.md#json-schema), das jede Datei in `$schema` angibt, beschreibt jetzt allein die Speicherform und ist geschlossen: Es lehnt eine von einer früheren Version gespeicherte Datei ab, bis ein Speichern mit `4.0.0` oder neuer sie neu schreibt.
- Die Garbage Collection des Dokuments ist zusammen mit ihrem Worker entfallen, daher bleibt eine entfernte Entität in `runtimeValue`, bis das Dokument das nächste Mal aus seiner Datei geöffnet wird. Drei Shared Worker bleiben – siehe [Web Worker](#web-workers).
- Halten Sie jeden Editor und jedes Replikat in einer gemeinsamen Sitzung auf `4.0.0` oder neuer. Eine frühere Version ignoriert die neuen Aktionstypen: die für Tabellengruppen, den Dialog „Spalten zuordnen“, die Sperren und die Skripte von Schema SQL – siehe [Gemischte Versionen](./advanced/collaborative-editing.md#mixing-releases).
- Der Import-Callback erhält bei „Importieren und hinzufügen“ den Wert `mode: 'append'`, den ein Callback weitergeben muss. Der Export-Callback erhält jetzt auch Dateien `.svg` und Dateien des Codegenerators, und `Export` ▸ `Schema SQL` öffnet die Registerkarte Schema SQL, statt zu speichern, daher kommt die Datei `.sql` nur über `Save file` dieser Registerkarte – siehe [Dateidialoge](#file-dialogs).
- `Delete` und `Backspace` sind an den neuen Befehl `removeSelection` gebunden. Solange der Editor den Fokus außerhalb eines Textfelds hat, wird die Standardaktion der Taste auf jeder Registerkarte verhindert, und auf der Registerkarte ERD wird die Auswahl entfernt. `KeyBindingName` und `KeyBindingMap` erhalten ihn, und `setKeyBindingMap({ removeSelection: [] })` überlässt beide Tasten der Seite – siehe [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` nimmt auch `'system'` an, die Option `System` der Designauswahl, die beim Einschalten von `systemDarkMode` gesetzt wird. `changePresetTheme` meldet `'system'`, solange diese Option ausgewählt ist, daher speichern Sie den Wert unverändert und geben ihn an `setPresetTheme` zurück. Bei eingeschaltetem `systemDarkMode` bleibt ein Aufruf von `setPresetTheme()` mit `'light'` oder `'dark'` jetzt bestehen, statt bei der nächsten Änderung des Betriebssystems überschrieben zu werden – siehe [systemDarkMode](./erd-editor-element.md#systemdarkmode) und [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0`, die Erweiterung für VS Code `4.0.0` oder neuer und die Plugins für Obsidian und JetBrains `1.0.0` oder neuer sprechen das Hub-Protokoll 2. Der Server `1.0.0` und eine frühere Editor-Version, die Agenten bedient, oder ein früherer Server und einer dieser Editoren lehnen einander mit `protocolMismatch` ab und nennen die Seite, die aktualisiert werden muss – siehe [Aktualisieren](../mcp/installation.md#updating).
- Eine CDN-URL ohne Versionsangabe liefert jetzt die neueste 4.x-Version. Fixieren Sie `@3.10.0`, um bei 3.x zu bleiben – siehe [CDN](#cdn).
