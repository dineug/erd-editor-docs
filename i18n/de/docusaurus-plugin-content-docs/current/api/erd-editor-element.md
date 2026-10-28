---
sidebar_position: 2
description: Die API des Elements erd-editor – Registrierung, Attribute, value und runtimeValue, Ereignisse, Designs, Anzeigesprache, der Willkommensbildschirm, Tastenbelegungen sowie Import und Export von Schemas.
---

# ErdEditorElement

Der Editor ist ein einfaches `HTMLElement`, das Tag `<erd-editor>`, das der Import von `@dineug/erd-editor/erd-editor.js` definiert.  
Seit `5.0.0` definiert der Import des Paketstamms kein Tag. Der Stamm exportiert `ErdEditorElement` als Typ und als Klasse des Elements sowie `defineErdEditor()`, das das Tag dort definiert, wo Sie es aufrufen – siehe [Die Elemente registrieren](./installation.md#registering-the-elements).  
Für eine Seite, die ein Diagramm nur zeigt, ist [`<erd-viewer>`](./erd-viewer-element.md) ein eigenes schreibgeschütztes Element.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Seine Typdefinition lautet wie folgt.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Der Editor rendert in einen geschlossenen Shadow Root, daher ist `editor.shadowRoot` gleich `null`, und Stile der Seite gelangen weder hinein noch hinaus.  
Nichts im Inneren ist mit einem Selektor erreichbar – gestalten Sie den Editor stattdessen über [setTheme](#settheme) und die Custom Properties `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` und `enable-welcome-screen` sind die einzigen Attribute, und alle fünf haben den Standardwert `false`. Die letzten beiden sind neu in `4.0.0`. Jedes liest seinen Wert so, wie es unter [readonly](#readonly) beschrieben ist.

Seit `4.1.0` hat die Registerkarte ERD einen [Explorer](../guide/guides/explorer.md), einen links neben der Zeichenfläche angedockten Baum des Diagramms mit Suchen und Ersetzen an seinem oberen Rand. Kein Attribut, keine Eigenschaft, keine Methode und kein Ereignis öffnet oder schließt ihn oder meldet seinen Zustand: Er öffnet sich über die Schaltfläche `Explorer` der Symbolleiste, über `Toggle Explorer` in der Schnellsuche oder im Kontextmenü der Zeichenfläche oder mit der Belegung [`findReplace`](#setkeybindingmap).  
Jedes Element startet mit geschlossenem Explorer. Ob er geöffnet ist, seine Breite, sein Einklappzustand und seine Suche bleiben so lange erhalten wie das Element, über Wechsel der Registerkarte und jedes Laden hinweg, `setInitialValue` eingeschlossen, und stehen nie in `value`, `runtimeValue`, im Verlauf oder in einem gemeinsamen Store.

Seit `4.2.0` können Tabellen und Spalten neben ihren Namen [logische Namen](../guide/guides/logical-names.md) haben, und die Namensansicht, eine Dokumenteinstellung wie die Registerkarte, legt fest, ob die Zeichenfläche ihre Namen, ihre logischen Namen oder beide zeigt.  
Die Symbolleiste hat außerdem eine Registerkarte [Wörterbuch](../guide/guides/dictionary.md) zwischen `Code Generator` und `Settings`, die die Wörter, Begriffe und Domänen des Dokuments sowie ein Blatt `Checks` enthält. Sie ist eine Registerkarte wie die anderen: Ihr `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, wird von der Sperre `Canvas Type` umfasst, sodass sich ein auf ihr gespeicherter Text über [setInitialValue](#setinitialvalue) auf ihr öffnet, und ein Wechsel zu ihr wird nur dann in `value` geschrieben und löst [change](#change) aus, wenn diese Sperre ausgeschaltet ist. Sie hat kein eigenes Attribut, keine eigene Eigenschaft, keine eigene Methode und kein eigenes Ereignis, das sie öffnet oder ihren Zustand meldet. Ihre Änderungen sind Änderungen des Dokuments: Sie stehen in `value`, lösen [change](#change) aus und erreichen die Mitbearbeiter, aber ihr Rückgängigmachen und Wiederholen läuft über den eigenen Verlauf jedes Blatts, nicht über den des Dokuments.  
Der eigene Zustand der Registerkarte – welches Blatt angezeigt wird, anfangs `Domains`, sowie Suche, Auswahl, Scrollposition und Spaltenbreiten jedes Blatts – bleibt so lange erhalten wie das Element, über Wechsel der Registerkarte und jedes Laden hinweg, und steht nie in `value`, `runtimeValue`, einem Verlauf oder einem gemeinsamen Store.  
Die Schnittstelle `ErdEditorElement` erhält kein neues Mitglied. Neu in der API sind `logicalNameAsComment` in den Optionen von [getSchemaSQL](#getschemasql), zwölf [Design-Token](#settheme) und der Export [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Legt fest, ob der Editor bearbeitet werden kann.  
Solange es gesetzt ist, werden das Zuweisen von `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, Rückgängig und Wiederholen, seit `4.2.0` auch die eines Wörterbuchblatts, ignoriert, und das Ereignis `change` wird nie ausgelöst. Laden Sie ein Dokument stattdessen mit [setInitialValue](#setinitialvalue).  
Seit `5.0.0` ist ein schreibgeschützter Editor ein Leser statt eines Editors mit deaktivierten Bedienelementen. Er behält seine sechs Registerkarten, den [Explorer](../guide/guides/explorer.md#read-only-editors), die Minimap, die Schnellsuche, die Tabelleneigenschaften, die [Diff-Ansicht](../guide/guides/table-related-functions.md#diff-viewer), `Export`, den Zen-Modus sowie die Cursor, den Fokus und die Auswahlen von Mitbearbeitern, und jedes Bedienelement, das das Diagramm bearbeiten würde, fehlt, statt deaktiviert gezeichnet zu werden. Vor `5.0.0` wurden viele seiner Bearbeitungselemente noch gezeichnet, und der Editor verwarf, was sie sendeten.

Auf der Registerkarte ERD verschiebt ein Ziehen die Zeichenfläche, wo immer es beginnt, auch auf einer Tabelle, und ein Druck wählt nichts aus, verschiebt nichts und öffnet nichts. Ruht der Zeiger auf einer Tabelle, leuchten deren Beziehungen auf, ein Klick ohne Bewegung auf eine Tabelle oder eine Beziehung behält diese Hervorhebung, und ein Klick ohne Bewegung an anderer Stelle löscht sie, wie in [`<erd-viewer>`](./erd-viewer-element.md). Die einzige Auswahl ist der Umriss, den ein Sprung hinterlässt: Das Wechseln zu einer Explorer-Zeile, einem ihrer Suchtreffer oder einem Ergebnis der Schnellsuche nach `#`, `@` oder `:` wählt aus, worauf es landet, und der nächste Klick ohne Bewegung hebt die Auswahl auf. Kopieren kopiert, was diese Auswahl enthält.  
Die [Symbolleiste der Zeichenfläche](../guide/guides/table-related-functions.md#canvas-toolbar) behält `Zoom out`, die Zoomstufe (`Reset zoom`), `Zoom in`, die Liste der Namensansicht, `Zen Mode` und den Kompass, ohne `Hand` oder `Select`, ohne `New Table`, `New Memo` oder `New Table Group` und ohne Beziehungsschaltflächen. Das Zeichenflächenmenü behält `View Option`, `Name View`, `Export` und `Diff Viewer`, das Tabellenmenü behält `Table Properties`, und eine Notiz, eine Beziehung oder eine Tabellengruppe öffnet kein Menü. Die Schnellsuche listet auf der Registerkarte ERD keine Zeile auf, die das Diagramm schreibt: Sie behält `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, die Zeilen `Theme` und `Display Language`, die [enableThemeBuilder](#enablethemebuilder) und [enableLocalePicker](#enablelocalepicker) einschalten, sowie die Suchen mit `#`, `@` und `:`. Auf den anderen Registerkarten listet sie auf, was sie in einem bearbeitbaren Editor auflistet. Die Symbolleiste zeigt den Namen der Datenbank als Text und keine Schaltfläche `Undo`, `Redo` oder `Time Travel`.  
Nichts bietet `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, eine Zeile für Tabellengruppen (siehe [Tabellengruppen](../guide/guides/table-groups.md#read-only-editors)) oder [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) an, und es wird kein [Willkommensbildschirm](#enablewelcomescreen) gezeigt.  
Die Belegungen, die hinzufügen, entfernen oder bearbeiten, bewirken nichts: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, die vier Beziehungsbelegungen und `handTool`, jeweils weiterhin unterdrückt, wie es ihre Option festlegt. Ein Einfügen und `Tab` bewirken ebenfalls nichts und erreichen die Seite, ohne unterdrückt zu werden. Die Zoom-Belegungen, `zenMode`, `focusView`, `tableProperties` auf der Tabelle, die ein Sprung ausgewählt hat, `search`, `findReplace`, Kopieren, `Escape` und die Pfeiltasten funktionieren weiterhin. Kein Editor für den Namen einer Zelle, Notiz oder Tabellengruppe öffnet sich, und keine Beziehung wird gezeichnet.

[Suchen und Ersetzen](../guide/guides/find-and-replace.md#read-only-editors) am oberen Rand des Explorers sucht nur, ohne den Pfeil `Toggle Replace` und ohne die Ersetzungszeile. Der Bereich trägt den Titel `Explorer`, und der Tooltip der Schaltfläche in der Symbolleiste lautet in jedem Editor `Explorer (Ctrl + F)` (Windows/Linux) oder `Explorer (⌘ + F)` (Mac). Der Explorer öffnet sich in einem schreibgeschützten Editor seit `4.1.0`; von `3.10.0` bis `4.0.0` öffnete sich dort Suchen und Ersetzen als schwebender Bereich nur zum Suchen mit dem Titel `Find`.  
Die Tabelleneigenschaften öffnen sich über das Tabellenmenü oder die Belegung `tableProperties`, und seit `3.10.0` zeigen sie neben ihrem Titel ein Badge `Read only`, und ihre Registerkarte `Indexes` lässt keine Änderungen zu – siehe [Tabelleneigenschaften](../guide/guides/table-related-functions.md#table-properties).  
Die Registerkarte Einstellungen trägt dasselbe Badge `Read only` und zeigt jede Einstellung in einem Bedienelement, das keinen Druck annimmt: Ihre beiden Schalter, das Feld `Maximum comment width` und die sieben Schaltflächen `Lock` sind deaktiviert, und die Zeilen von `Column Order` lassen sich nicht ziehen. Die Skripte `Before tables` und `After tables` der Registerkarte Schema SQL nehmen keine Eingabe an. Die Registerkarte [Visualisierung](../guide/guides/visualization.md) funktioniert wie in einem bearbeitbaren Editor, da dort nichts das Dokument bearbeitet; `Previous table` und `Next table` in Flow wechseln weiterhin schrittweise, über ihre Schaltflächen oder die Tasten für Rückgängig und Wiederholen.  
Die Registerkarte [Wörterbuch](../guide/guides/dictionary.md#read-only-editors) öffnet sich weiterhin: Ihre Blätter lassen sich wechseln, durchsuchen, auswählen und scrollen, aus ihnen lässt sich kopieren, und eine Zeile des Blatts `Checks` wechselt weiterhin zu dem, was sie nennt. Keine Zelle nimmt eine Bearbeitung, ein Einfügen oder ein Leeren an, die Registerkarte zeigt keines der Werkzeuge `Add Row`, `Delete Rows`, `Import CSV` und `Export CSV` und kein Menü im Raster, und ihre Tastenkombinationen für Zeilen fügen nichts ein und löschen nichts. Das Tabellenmenü, das Kontextmenü der Zeichenfläche und die Schnellsuche bieten weder [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) noch `Derive Physical Name Again` an.

Seit `5.0.0` bleiben die Einstellungen, die ein Leser noch ändern kann, auf dem Bildschirm dieses Editors: das Scrollen und der Zoom, die Registerkarte, die Datenbank, die Sprache des Codegenerators, beide Schreibweisen, der Begrenzertyp, die Zeilen von `View Option` und die [Namensansicht](../guide/guides/logical-names.md#read-only-editors) über jede ihrer Auswahlen, die seit `4.2.0` auf dem Bildschirm bleibt. Was auch immer ihre [Sperren](../guide/guides/settings.md#lock) besagen, keine davon erreicht `value`, `runtimeValue`, den Export `json`, den Verlauf, das Ereignis [change](#change) oder einen gemeinsamen Store, sodass `value` die Einstellungen des Dokuments behält, wie auch immer der Leser es betrachtet. Die Optionsbereiche von [Schema SQL](../guide/guides/schema-sql.md#read-only-editors) und Codegenerator beschriften diese Einstellungen mit `This window only`, solange `readonly` gesetzt ist, wo ein bearbeitbarer Editor `Saved in the document` zeigt. Was die beiden Registerkarten anzeigen, kopieren und speichern, folgt dem Bildschirm, und ebenso [getSchemaSQL](#getschemasql) ohne Datenbanksystem aufgerufen.  
Vor `5.0.0` gingen das Scrollen, der Zoom, der Wechsel der Registerkarte, die Datenbank und die Code-Einstellungen eines Lesers in `value` ein, solange keine Sperre sie hielt, was bei der Datenbank nie der Fall ist, und ein gemeinsamer Store sendete sie an die anderen Editoren.  
Die eigenen Auswahlen `This window only` der Registerkarte Schema SQL, `Statements`, `Header`, seit `4.2.0` `Write logical names into empty comments` und `Tables`, werden in keinem Editor gespeichert und wirken weiterhin, ebenso der Dialog [`Export image`](../guide/guides/file-import-export.md#image), die Designauswahl und die Sprachauswahl. Eine Wahl in der Designauswahl oder der Sprachauswahl löst weiterhin [changePresetTheme](#changepresettheme) oder [changeLocale](#changelocale) aus.

Solange es gesetzt ist, gelangt nichts in den Verlauf, auch kein Scrollen oder Zoomen, und ein [gemeinsamer Store](#getsharedstore) des Editors sendet keine Änderung: nur was seine Tracker vom Cursor, Fokus, der Auswahl und dem Auswahlrahmen des Lesers senden sowie die Register, die ein anderer Editor beim Beitritt anfordert (siehe [Gemeinsame Bearbeitung](./advanced/collaborative-editing.md)). Er wendet weiterhin jede Änderung an, die die anderen senden. Eine Änderung der Datenbank, einer Einstellung des Codegenerators oder einer Zeile von `View Option` erreicht das Dokument und auch den Bildschirm, es sei denn, der Leser hat diese Einstellung dort geändert, und ein gemeinsamer Wechsel der Namensansicht ist in jedem Fall auf dem Bildschirm zu sehen.

Wird es eingeschaltet, endet, was offen stand: der Editor für den Namen einer Zelle, Notiz oder Tabellengruppe, eine Beziehung, die gerade gezeichnet wird, ein Ziehen einer Tabelle, Notiz, Tabellengruppe oder Spalte, die Kopien eines Alt-Ziehens, die Größenänderung einer Notiz oder Tabellengruppe, eine noch laufende Vorschau oder Platzierung von Auto Layout, `Map Columns`, Time Travel und die Farbauswahl. Es hebt die Auswahl auf, legt das Hand-Werkzeug ab und sendet zuerst, was jeder gemeinsame Store von einem Ziehen oder Scrollen noch zurückhält, wie es [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) tut. Die Tabelleneigenschaften, nun schreibgeschützt, die Diff-Ansicht und der Dialog `Export image` bleiben geöffnet, und das Scrollen, der Zoom, die Registerkarte und die Namensansicht bleiben, wie sie waren. Ein Element, das beim ersten Einhängen schreibgeschützt ist, beginnt genauso, und eines, das ein Host in der Seite verschiebt, behält den Umriss, den ein Sprung hinterlassen hat.  
Wird es ausgeschaltet, kehren die Bearbeitungselemente zurück, ohne dass etwas ausgewählt oder geöffnet ist. Die Datenbank, die Sprache des Codegenerators, beide Schreibweisen, der Begrenzertyp und die Zeilen von `View Option` kehren zu denen des Dokuments zurück, während das Scrollen, der Zoom, die Registerkarte und die Namensansicht dort bleiben, wo der Leser sie gelassen hat, und `value` die des Dokuments behält, bis der Leser sie wieder ändert. Keiner der beiden Wechsel löst `change` aus.  
Ein Attribut ohne Wert, `=""` und `="true"` werden alle als `true` gelesen. `="false"` wird als `false` gelesen, ebenso jede andere Zeichenkette – einschließlich der HTML-typischen Schreibweise `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Legt fest, ob sich der Editor automatisch mit dem dunklen/hellen Modus des Systems synchronisiert.  
Seit `4.0.0` setzt das Einschalten den Wert `appearance` des Designs auf `'system'`, wie `setPresetTheme({ appearance: 'system' })`. Der Editor zeigt dann das helle oder dunkle Erscheinungsbild, das das Betriebssystem meldet, oder dasjenige, das [setSystemAppearance](#setsystemappearance) angibt, und wechselt, wenn sich dieses ändert.  
Ein späteres [setPresetTheme](#setpresettheme) mit `'light'` oder `'dark'` oder die Wahl von `Light` oder `Dark` in der Designauswahl oder der Schnellsuche ersetzt `'system'` und bleibt bestehen: Die nächste Änderung im Betriebssystem überschreibt es nicht mehr, obwohl `systemDarkMode` weiterhin `true` ist. Vor `4.0.0` überschrieb es die nächste Änderung im Betriebssystem.  
Das Ausschalten, während das Erscheinungsbild `'system'` ist, behält das in diesem Moment angezeigte helle oder dunkle Erscheinungsbild bei. Das Ausschalten, nachdem das Erscheinungsbild von `'system'` auf einen anderen Wert geändert wurde, lässt es unverändert.  
Eine Änderung löst kein Ereignis aus.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Legt fest, ob eine Oberfläche bereitgestellt wird, mit der sich vordefinierte Designs einfach einstellen lassen.  
Es blendet die Schaltfläche `Theme` der Symbolleiste ein, die die Designauswahl mit `Accent color`, `Gray color` und `Appearance` öffnet. Seit `4.0.0` bietet `Appearance` neben `Light` und `Dark` auch `System` an, und solange dies eingeschaltet ist, listet die Schnellsuche `Theme` mit `System`, `Light` und `Dark` auf. Siehe [Sprache und Design](../guide/guides/language-and-theme.md).

![Die Designauswahl über die Symbolleiste öffnen, Akzentfarbe und Grauton auswählen und das Erscheinungsbild auf Light und dann auf System umstellen](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Eine Änderung des vordefinierten Designs in diesem Bereich oder in der Schnellsuche löst das Ereignis [changePresetTheme](#changepresettheme) aus.

## enableLocalePicker {#enablelocalepicker}

Legt seit `4.0.0` fest, ob eine Oberfläche zur Auswahl der Anzeigesprache des Editors bereitgestellt wird.  
Es blendet die Schaltfläche `Display Language` der Symbolleiste ein, hinter `Theme`, wenn beide angezeigt werden. Die Schaltfläche öffnet die Sprachauswahl, und die Schnellsuche listet `Display Language` auf. Beide bieten `System` und die 25 Sprachen an – siehe [Sprache und Design](../guide/guides/language-and-theme.md).  
Es bestimmt außerdem, was ein Editor anzeigt, bevor [setLocale](#setlocale) aufgerufen oder eine Sprache ausgewählt wird: `'system'`, solange es eingeschaltet ist, Englisch, solange es ausgeschaltet ist, sodass ein Element, das nichts konfiguriert, bei dem Englisch bleibt, das es immer gezeigt hat. Das Ein- oder Ausschalten wechselt sofort zwischen beiden. Sobald eine Sprache gesetzt oder ausgewählt wurde, bleibt diese Wahl bestehen, egal wie es geschaltet wird.  
Setzen Sie es, bevor das Element eingefügt wird, damit bereits der erste Frame `'system'` folgt.  
Eine Auswahl löst [changeLocale](#changelocale) aus.

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Legt seit `4.0.0` fest, ob ein leeres Diagramm den Benutzer mit dem [Willkommensbildschirm](../guide/guides/editing-start.md#welcome-screen) begrüßt.  
Er liegt über der Registerkarte ERD, solange das Dokument keine Tabelle, keine angezeigte Notiz und keine angezeigte Tabellengruppe enthält. Er wird nicht angezeigt, solange `readonly` gesetzt ist, im Zen-Modus oder solange die Tabelleneigenschaften, die Diff-Ansicht, die Zeitreise oder die Vorschau des Automatischen Layouts geöffnet ist. Die erste Tabelle, angezeigte Notiz oder angezeigte Tabellengruppe lässt ihn verschwinden, und ein Rückgängigmachen bis zu einem leeren Diagramm holt ihn zurück.  
Seine Einträge `New Table`, `New Memo` und `Command Palette` zeigen die erste Tastenkombination von `addTable`, `addMemo` und `search` so, wie [setKeyBindingMap](#setkeybindingmap) sie belassen hat, und keine für einen leer gelassenen Namen. Seine Pfeile zeigen nur dort auf die Schaltflächen `Theme` und `Display Language`, wo `enableThemeBuilder` und `enableLocalePicker` sie einblenden.  
In seinem Menü wechseln `↑`, `↓`, `Home` und `End` zwischen den Zeilen, und bei ihnen wird die Standardaktion verhindert und die Weitergabe gestoppt. Bei `Enter` und `Space` wird die Weitergabe gestoppt, die Standardaktion aber nicht verhindert, sodass die fokussierte Zeile sie erhält, und `Escape` bei den Formaten von `Import` führt zurück, mit verhinderter Standardaktion und gestoppter Weitergabe. Jede andere Taste erreicht den Editor und die Seite wie gewohnt.  
Er ändert nichts am Dokument, lässt also `value` unverändert und löst kein `change` aus.  
Schalten Sie die Option ein, sobald [setInitialValue](#setinitialvalue) das Dokument geladen hat, wie es die offiziellen Hosts tun, damit der Bildschirm nie kurz über einer Datei aufblitzt, die noch geladen wird.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Liefert das aktuelle Dokument als JSON-Zeichenkette im [Schema](./advanced/schema.md), das der Editor definiert.  
Seit `4.0.0` ist der Wert die Speicherform, also das Dokument, wie eine Datei es enthält, und damit auch das, was der Export `json` schreibt und die offiziellen Hosts speichern. Er enthält nur die vorhandenen Entitäten, ohne die entfernten, die Stapelreihenfolge oder das, was der Editor selbst ermittelt, etwa gemessene Breiten, Schlüsselmarkierungen und Ankerpunkte von Beziehungen. Die Schlüssel seiner Entitäten stehen in fester Reihenfolge, er ist mit zwei Leerzeichen eingerückt und endet mit einem Zeilenumbruch, sodass dasselbe Dokument immer dieselben Bytes ergibt.  
Seit `4.2.0` lässt er außerdem weg, was leer ist: eine leere Liste `doc`, eine leere Collection, eine Wörterbuchzeile, die nichts enthält, und ein leeres Textfeld einer Entität, etwa einen Namen, einen Kommentar, einen Datentyp, einen Standardwert oder eine Farbe. Eine Liste innerhalb einer Entität, etwa `columnIds` einer Tabelle, wird auch leer weiterhin geschrieben. Das `doc` eines neuen Dokuments ist `{}`, und es hat keine `collections`, lesen Sie ein fehlendes Feld, eine fehlende Liste oder eine fehlende Collection daher als leer. Er enthält die logischen Namen und die Kennzeichen abgeleiteter Namen von Tabellen und Spalten, die Domänenverknüpfungen der Spalten sowie die Wörter, Begriffe und Domänen, wobei jedes Wörterbuch als eine Kopfzeile aus Feldnamen geschrieben wird, gefolgt von seinen Zeilen, jede auf einer eigenen Textzeile, in der Reihenfolge des Blatts. Siehe [Speicherform und Laufzeitwert](./advanced/schema.md#storage-form-and-runtime-value).  
Jede Einstellung, deren [Sperre](../guide/guides/settings.md#lock) eingeschaltet ist, wird mit dem gesperrten Wert geschrieben, nicht so, wie der Bildschirm sie zeigt. Die Sperre `Viewport` umfasst `originX`, `originY` und `zoomLevel`, und `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` und seit `4.2.0` `Name View` umfassen jeweils ihre eigene Einstellung. Die Namensansicht wird als `nameViewMode` geschrieben, und zwar nur, solange sie nicht `'physical'` ist. Jede andere Einstellung wird so geschrieben, wie sie gerade ist, und `lockSettings` wird immer geschrieben. Zu den Bits siehe [Settings](./advanced/schema.md#settings); das Bit der Sperre `Name View` wird umgekehrt gelesen.  
Seit `5.0.0` werden auch die Einstellungen, die der Leser eines [schreibgeschützten](#readonly) Editors ändert, mit den Werten des Dokuments geschrieben, gesperrt oder nicht, da sie auf diesem Bildschirm bleiben.  
In einem neuen Dokument sind alle Sperren eingeschaltet, ob es das Dokument ist, das ein Element zeigt, bevor es einen Wert erhält, oder eines, das aus einem leeren Wert geladen wurde. Sein `value` behält den Ursprung bei `0, 0`, die Zoomstufe bei `1`, die Registerkarte ERD, die Standardsprache des Codegenerators, die Standardschreibweisen und den Standardbegrenzertyp sowie seit `4.2.0` die Ansicht `Physical Names`, bis die zugehörige Sperre ausgeschaltet wird.  
Vor `4.0.0` lieferte der Getter das gesamte Dokument so, wie der Editor es hielt, mit angewendetem `ignoreSaveSettings`. Das Dokument, wie der Editor es hält, ist jetzt [runtimeValue](#runtimevalue), und `ignoreSaveSettings` wird nicht mehr gelesen oder geschrieben.

```js
const data = editor.value;
```

### setter {#setter}

Lädt einen zuvor gespeicherten Zustand des Editors. Er ersetzt das gesamte Dokument – das aktuelle wird zuerst geleert. Seit `4.2.0` gilt das auch für die Wörter, Begriffe und Domänen: Das Dokument übernimmt die, die der Text enthält, oder keine, und der eigene Verlauf jedes Wörterbuchblatts wird geleert.  
Wie `clear()`, `setInitialValue()` und die Methoden `setSchema*` in ihrem Standardmodus `mode: 'replace'` verwirft er außerdem die Flow-Ansicht der Registerkarte Visualisierung: ihr Layout, die Tabellen, auf die sie eingeschränkt ist, ihre Zeilenanzeige, Zoom und Verschiebung sowie seit `4.2.0` die Tabellen, durch die `Previous table` und `Next table` in ihr schrittweise wechseln. Ein Anhängen (`mode: 'append'`) verwirft sie nicht.  
Er wird im Verlauf aufgezeichnet, sodass `Undo, Redo` möglich ist, und löst `change` aus.  
Er nimmt die Speicherform, einen [runtimeValue](#runtimevalue) oder eine Datei an, die eine frühere Version gespeichert hat.  
Eine leere Zeichenkette oder alles, was keine Zeichenkette ist, lädt ein neues Dokument, statt einen Fehler auszulösen, prüfen Sie den Wert also, bevor Sie ihn zuweisen.  
Dieses neue Dokument ist dasjenige, mit dem `setInitialValue('')` beginnt: leer, mit Standardeinstellungen und seit `4.0.0` mit allen Sperren eingeschaltet. In `3.10.x` speicherte es weder die Scrollposition noch die Zoomstufe, und davor speicherte es beides.  
Ein gemeinsamer Store leitet dieses Laden mit dem vollständigen JSON des neuen Dokuments an die Mitbearbeiter weiter, sodass jeder Teilnehmer, auch einer mit einer älteren Version, es lädt, wobei ein Editor vor `4.2.0` verwirft, was er nicht kennt, etwa die logischen Namen, Domänenverknüpfungen und Wörterbücher – siehe [Gemischte Versionen](./advanced/collaborative-editing.md#mixing-releases).  
Seit `4.0.0` stammen die Sperren des geladenen Dokuments und die gesperrten Werte, die `value` anschließend schreibt, aus dem Text, und die Ansicht landet dort, wo der Text sie hinsetzt, oder auf dem Diagramm, wenn dort nichts davon gezeichnet ist. Für jede andere Einstellung, die der Text sperrt – die Registerkarte, die Sprache des Codegenerators, die Schreibweisen, den Begrenzertyp und seit `4.2.0` die Namensansicht –, zeigt der Editor weiterhin, was er vor dem Laden gezeigt hat. Eine Einstellung, die der Text nicht sperrt, übernimmt den Wert aus dem Text. Eine vor `4.2.0` gespeicherte Datei nennt keine Sperre `Name View`, es sei denn, ein Editor der Version `4.2.0` hat diese Sperre darin ausgeschaltet, daher wird sie mit der auf `Physical Names` gesperrten Namensansicht geladen, und der Editor behält die Namensansicht bei, die er gezeigt hat. [setInitialValue](#setinitialvalue) übernimmt dagegen jeden Wert, den der Text enthält; siehe dort auch zu einem Text, der keine Sperren nennt.  
Auch Text, der kein JSON ist, etwa eine Datei mit zurückgebliebenen Merge-Konfliktmarkierungen, löst keinen Fehler aus: Das Dokument wird geleert, seine Einstellungen bleiben, wie sie waren, und der Parse-Fehler wird in der Konsole protokolliert.  
Er wird ignoriert, solange `readonly` gesetzt ist; verwenden Sie [setInitialValue](#setinitialvalue), um in einen schreibgeschützten Editor zu laden.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Liefert seit `4.0.0` das Dokument so, wie dieser Editor es hält, als JSON-Zeichenkette. Es gibt keinen Setter, daher löst eine Zuweisung in Code im Strict Mode einen Fehler aus.  
Der Wert enthält, was [value](#value) weglässt: entfernte Entitäten und ihre Reihenfolge, die Stapelreihenfolge, gemessene Breiten, Schlüsselmarkierungen, Ankerpunkte von Beziehungen und Sequenzen sowie seit `4.2.0` die leeren Textfelder, Listen `doc` und Collections; die aus einem Wörterbuchblatt entfernten Zeilen und diejenigen, die nichts enthalten; den Sortierschlüssel jeder Wörterbuchzeile; die Listen `doc` der Wörter, Begriffe und Domänen; und eine Verknüpfung mit einer entfernten Domäne. Gesperrte Einstellungen werden auch hier mit ihren gesperrten Werten geschrieben.  
Verwenden Sie ihn, um einen weiteren Editor, der einer bereits laufenden Sitzung beitritt, etwa einen Mitbearbeiter oder eine zweite Ansicht desselben Dokuments, über dessen [setInitialValue](#setinitialvalue) zu initialisieren. Ein Rückgängigmachen einer Entfernung, das die Sitzung später sendet, stellt die Entität dort dann vollständig wieder her, während ein aus `value` initialisierter Editor keine entfernte Entität hält und stattdessen eine leere, namenlose Tabelle oder seit `4.2.0` eine leere Wörterbuchzeile wiederherstellt. Siehe [Gemeinsame Bearbeitung](./advanced/collaborative-editing.md).  
Entfernte Entitäten werden nicht mehr eingesammelt, daher bleiben sie darin, bis das Dokument das nächste Mal aus seiner Datei geöffnet wird.  
Schreiben Sie ihn nie in eine Datei: Speichern Sie `value`, den das [JSON Schema](./advanced/schema.md#json-schema) akzeptiert, diesen Wert hier aber nicht.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Lädt einen zuvor gespeicherten Zustand des Editors. Das Laden selbst wird nicht im Verlauf aufgezeichnet, kann also nicht rückgängig gemacht werden, und es wird kein Ereignis `change` ausgelöst.  
Die Methode leert außerdem den Verlauf, sodass nichts, was vor dem Laden geschah, am geladenen Dokument rückgängig gemacht oder wiederholt werden kann, und seit `4.2.0` auch den eigenen Verlauf jedes Wörterbuchblatts.  
Sie nimmt die Speicherform, einen [runtimeValue](#runtimevalue) oder eine Datei an, die eine frühere Version gespeichert hat, und übernimmt anders als das Zuweisen von `value` jede Einstellung, die der Text enthält, einschließlich der Registerkarte und der Code-Einstellungen.  
Eine leere Zeichenkette oder alles, was keine Zeichenkette ist, lädt ein neues Dokument, statt einen Fehler auszulösen, daher beginnt `setInitialValue('')` ein leeres Diagramm.  
Seit `4.0.0` sind in diesem neuen Dokument, das auch ein Element zeigt, bevor es irgendeinen Wert erhält, alle Sperren eingeschaltet. Scrollen, Zoomen, der Wechsel der Registerkarte und eine Änderung der Sprache des Codegenerators, der Schreibweisen, des Begrenzertyps oder seit `4.2.0` der Namensansicht lassen `value` unverändert und lösen kein `change` aus. In `3.10.x` speicherte es weder die Scrollposition noch die Zoomstufe, und davor speicherte es beides.  
Ein aus Text geladenes Dokument behält die Sperren, die es nennt. Eines, das keine nennt – jede vor `4.0.0` gespeicherte Datei, gleich was ihr `ignoreSaveSettings` besagte, und eine v2-Datei `.vuerd` –, öffnet sich mit allen Sperren eingeschaltet, mit `Viewport` gesperrt auf Ursprung `0, 0` und Zoomstufe `1`, auf der Registerkarte ERD und mit Sprache, Schreibweisen und Begrenzertyp so, wie es sie gespeichert hat.  
Seit `4.2.0` öffnet sich ein Text, der seine Sperren nennt, die Sperre `Name View` aber nicht, ebenfalls mit eingeschalteter Sperre `Name View`, selbst wenn jede andere Sperre ausgeschaltet ist. Eine vor `4.2.0` gespeicherte Datei ist ein solcher Text, es sei denn, ein Editor der Version `4.2.0` hat diese Sperre darin ausgeschaltet (siehe [Settings](./advanced/schema.md#settings)). Sie öffnet sich in der Ansicht `Physical Names`, wie ein Text, der gar keine Sperre nennt.  
In beiden Fällen öffnet sich die Ansicht an der Ansichtsposition des Dokuments – an der, die der Text gespeichert hat, wenn er seine Sperren nennt, bei Ursprung `0, 0` und Zoomstufe `1`, wenn er keine nennt – oder auf dem Diagramm, wenn dort nichts davon gezeichnet ist. Ein gesperrter `Viewport` behält seine gesperrten Werte in `value` dennoch bei.  
Seit `4.0.0` verwirft die Methode außerdem den Zustand der Zusammenarbeit des zuvor gehaltenen Dokuments, und ein bereits abonnierter [gemeinsamer Store](#getsharedstore) dieses Editors fragt die anderen Editoren erneut nach deren Zustand, sodass ein in einer laufenden Sitzung neu geladener Editor aufholt. Initialisieren Sie einen solchen Editor mit dem [runtimeValue](#runtimevalue) eines anderen Editors.  
Auch Text, der kein JSON ist, löst keinen Fehler aus: Das Dokument wird geleert, seine Einstellungen bleiben, wie sie waren, und der Parse-Fehler wird in der Konsole protokolliert.  
Anders als das Zuweisen von `value` wird die Methode nicht durch `readonly` blockiert, daher laden Sie mit ihr ein Dokument in einen schreibgeschützten Editor. Ein schreibgeschützter Editor zeigt dann die Einstellungen, die der geladene Text enthält, und verwirft die, die sein Leser auf dem Bildschirm geändert hatte.

```js
editor.setInitialValue('json...');
```

Beim Start laden, bei Änderungen speichern.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Ereignisse {#event}

`change`, `changePresetTheme` und `changeLocale` sind die einzigen drei öffentlichen Ereignisse; `changeLocale` ist neu in `4.0.0`.  
Das Element löst für seine eigene Verdrahtung außerdem interne Ereignisse `@dineug/erd-editor/internal-*` an sich selbst aus; diese gehören nicht zur API.

### change {#change}

Wenn es Änderungen im Editor gibt, löst er ein Ereignis aus.  
Das Ereignis wird um 200 ms entprellt und nicht ausgelöst, solange `readonly` den Wert `true` hat.  
Es wird bei jeder Änderung des Dokuments ausgelöst – einer Bearbeitung in der Oberfläche, dem Zuweisen von `value`, `clear()`, jeder der Methoden `setSchema*` und seit `4.0.0` `setSchemaJSON()` und `Import and Add`. `setInitialValue` löst es nicht aus.  
Seit `4.2.0` gehören dazu jede Änderung auf der Registerkarte [Wörterbuch](../guide/guides/dictionary.md) und jedes Rückgängigmachen oder Wiederholen einer solchen Änderung, eine Änderung eines logischen Namens oder einer Domänenverknüpfung, `Derive Physical Names Again` und ein Wechsel der Namensansicht, solange die Sperre `Name View` ausgeschaltet ist.  
Nichts, was im Flow-Modus der Registerkarte Visualisierung geschieht, löst es aus – Zoom, Verschieben der Ansicht, Verschieben von Karten, `Tidy Up`, die Zeilenanzeige, das Einschränken der Ansicht von einer Karte aus oder seit `4.2.0` das schrittweise Wechseln mit `Previous table` und `Next table` oder den Tasten für Rückgängig und Wiederholen –, da nichts davon eine Änderung des Dokuments ist. Seine Liste `Name View` ist die Ausnahme: Ein Wechsel dort löst es aus, solange die Sperre `Name View` ausgeschaltet ist, wie ein Wechsel auf der Registerkarte ERD.  
Seit `4.0.0` löst auch eine Änderung an einer Einstellung, deren [Sperre](../guide/guides/settings.md#lock) eingeschaltet ist, es nicht aus, weil sie nur den Bildschirm verändert und nie `value`: ein Scrollen oder Zoomen der ERD-Zeichenfläche, solange `Viewport` gesperrt ist, ein Wechsel der Registerkarte, solange `Canvas Type` gesperrt ist, eine Änderung der Sprache des Codegenerators, der Schreibweise der Tabellennamen, der Schreibweise der Spaltennamen oder des Begrenzertyps, solange die jeweils eigene Sperre eingeschaltet ist, und seit `4.2.0` ein Wechsel der Namensansicht, solange `Name View` gesperrt ist. Nur diese Änderungen entfallen, daher löst ein Stapel, der zusätzlich das Dokument bearbeitet, es weiterhin aus. Das Sperren oder Entsperren einer Einstellung löst es aus.  
In einem neuen Dokument und in jeder vor `4.0.0` gespeicherten Datei sind alle Sperren eingeschaltet, und die Sperre `Name View` ist in jeder vor `4.2.0` gespeicherten Datei eingeschaltet, es sei denn, ein Editor der Version `4.2.0` hat sie dort ausgeschaltet, daher lösen Scrollen, Zoomen, der Wechsel der Registerkarte und der Wechsel der Namensansicht standardmäßig nichts aus. Das umfasst das Fokussieren auf Tabellen von der Registerkarte ERD aus, die Kartenschaltfläche mit dem Symbol für externe Links, die Sie von Flow zurück zur Registerkarte ERD bringt, den Wechsel zu einer Zeile des Explorers oder zu einem Suchtreffer, das Öffnen des Explorers oder den Wechsel zu einem Ergebnis der Schnellsuche von einer anderen Registerkarte aus sowie seit `4.2.0` den Wechsel zu einer Tabelle oder Spalte von einer Zeile des Blatts `Checks` der Registerkarte Wörterbuch aus. Jede dieser Aktionen löst nur dann ein `change` aus, wenn eine Sperre, die sie abdeckt, ausgeschaltet ist: `Canvas Type` für den Wechsel der Registerkarte und `Viewport` für das Scrollen, das eine Kartenschaltfläche, ein Ergebnis der Schnellsuche, eine Zeile des Explorers, ein Suchtreffer oder eine Zeile des Blatts `Checks` zusätzlich bewirkt. Seit `4.1.0` folgt jeder dieser Scrollvorgänge einer einzigen Regel, [Wohin ein Sprung führt](../guide/guides/table-related-functions.md#where-a-jump-lands), daher scrollt ein Tabellenergebnis der Schnellsuche nicht mehr jedes Mal, und ein Sprung, bei dem die Regel die Ansicht an Ort und Stelle lässt, erzeugt kein Scrollen, das ein Ereignis auslösen könnte. Das Öffnen, Schließen oder Ändern der Breite des Explorers verschmälert oder verbreitert die Zeichenfläche, ohne ihren Ursprung zu verschieben, und löst ebenfalls nichts aus. Vor `4.0.0` lösten Scrollen, Zoomen und der Wechsel der Registerkarte es immer aus, auch wenn `editor.value` gleich blieb.  
Um Schreibvorgänge zu überspringen, die nichts ändern, vergleichen Sie `editor.value` mit dem Wert, den Sie zuletzt gespeichert haben, nicht mit der Datei, die Sie geladen haben: Eine Datei, die eine frühere Version geschrieben hat, eine v2-Datei oder eine von Hand bearbeitete Datei kann in `value` gleich nach dem Laden anders ausfallen, weil `value` sie in der Speicherform schreibt. Dasselbe gilt für eine Datei, deren Sperre `Viewport` ausgeschaltet ist und deren Ursprung auf diesem Bildschirm nichts vom Diagramm zeigt: Das Laden verschiebt die Ansicht auf das Diagramm, und `value` schreibt, wo sie landet. Seit `4.0.0` verursachen gemessene Breiten dies nicht mehr, weil `value` keine enthält. Seit `4.2.0` kann auch eine Datei, die `4.0.0` oder `4.1.0` gespeichert hat, anders ausfallen, da `value` nun ihre leeren Textfelder, Listen und Collections weglässt, sodass eine solche Datei einmal, beim nächsten Speichern, neu geschrieben wird. Ein Host, der Dateien schreibt, kann stattdessen mit dem Wert `changed` eines Replikations-Stores eine Bearbeitung von einer Änderung der Ansicht unterscheiden – siehe [on@change](./advanced/remote-storage.md#onchange).  
Das Ereignis trägt kein `detail`, steigt nicht auf (kein Bubbling) und überschreitet die Shadow-Grenze nicht, registrieren Sie den Listener daher am Element selbst und lesen Sie `editor.value` im Handler.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Wird ausgelöst, wenn das vordefinierte Design in der eingebauten Designauswahl oder seit `4.0.0` über `Theme` in der Schnellsuche geändert wird. Jede Auswahl löst es aus, auch die Auswahl der bereits geltenden Option.  
Ein eigener Aufruf von [setPresetTheme](#setpresettheme) oder [setSystemAppearance](#setsystemappearance) oder das Ein- oder Ausschalten von [systemDarkMode](#systemdarkmode) löst es nicht aus.  
`event.detail` ist das vollständige `ThemeOptions` nach der Auswahl – `{ appearance, grayColor, accentColor }` –, nicht das angeforderte Teilobjekt. Seit `4.0.0` hat sein Feld `appearance` den Wert `'system'`, solange `System` ausgewählt ist, nicht den des angezeigten hellen oder dunklen Erscheinungsbilds, speichern Sie den Wert daher unverändert und übergeben Sie ihn wieder an `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Wird seit `4.0.0` ausgelöst, wenn im Editor eine Sprache ausgewählt wird, in der Sprachauswahl oder über `Display Language` in der Schnellsuche, die beide von [enableLocalePicker](#enablelocalepicker) eingeschaltet werden.  
Es wird ausgelöst, nachdem die Sprache angewendet wurde, bei jeder Auswahl, auch bei der Auswahl der bereits geltenden Option. [setLocale](#setlocale) und [setSystemLocale](#setsystemlocale) lösen es nie aus, ebenso wenig eine Änderung der Sprachen des Browsers. Ein Sprachwechsel löst kein `change` aus.  
`event.detail` ist `{ locale }`, eine `LocaleOption`: `'system'`, wenn `System` ausgewählt wurde, sonst der Code der Sprache. Das Element merkt sich die Auswahl nicht, speichern Sie sie daher und übergeben Sie sie beim nächsten Laden an `setLocale`.  
Wie `change` steigt es nicht auf, registrieren Sie den Listener daher am Element selbst.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Setzt den Fokus auf den Editor.

```js
editor.focus();
```

## blur {#blur}

Entfernt den Fokus vom Editor.

```js
editor.blur();
```

## clear {#clear}

Leert das Dokument und entfernt jede Tabelle, Spalte, Beziehung, jeden Index und jede Notiz, seit `4.0.0` jede Tabellengruppe und seit `4.2.0` die Wörter, Begriffe und Domänen der Registerkarte Wörterbuch, wobei auch der eigene Verlauf jedes Blatts geleert wird.  
Jede Einstellung bleibt erhalten, einschließlich der Datenbank, der Ansichtsposition, der Zoomstufe, der Ansichtsoptionen für Tabellen, jeder Sperre mit dem Wert, den sie hält, und der Skripte `Before tables` und `After tables` der Registerkarte Schema SQL, sodass eine geleerte Datei weiterhin speichert, was sie gespeichert hat. Um stattdessen ein neues Dokument zu beginnen, weisen Sie `value` den Wert `''` zu oder rufen Sie `setInitialValue('')` auf.  
Die Methode wird im Verlauf aufgezeichnet, kann also rückgängig gemacht werden, und löst `change` aus. Ein Rückgängigmachen stellt das Dokument so wieder her, wie der Editor es hielt, einschließlich seiner Wörter, Begriffe und Domänen, jede gesperrte Einstellung mit ihrem gesperrten Wert. Solange `readonly` gesetzt ist, wird sie ignoriert.

```js
editor.clear();
```

## destroy {#destroy}

Zerstört die Editorinstanz vollständig, sodass sie nicht mehr wiederverwendet werden kann.  
Die Methode gibt die Listener und Abonnements des Editors frei und zerstört jeden gemeinsamen Store, den [getSharedStore](#getsharedstore) zurückgegeben hat.  
Ein Stream-Stapel, den ein gemeinsamer Store noch zurückhält, wird mit ihm verworfen; rufen Sie zuvor [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) dieses Stores auf, um ihn zu senden.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Definiert Tastenkombinationen neu.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` und `zoomReset` sind fest und können nicht neu definiert werden.  
Nur die einundzwanzig unten aufgeführten Namen werden geschrieben; alles andere im Objekt wird ignoriert, auch die festen Namen.  
Seit `3.10.0` kann `search` neu definiert werden, und `findReplace` ist neu. Davor war `search` fest. Seit `4.0.0` ist `removeSelection` neu. Seit `4.1.0` sind `addTableGroup` und `groupSelectedTables` neu.  
Der Wert einer Belegung muss ein `ShortcutOption[]` sein. Eine bloße Zeichenkette wird ignoriert, schreiben Sie also `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` statt `{ addTable: 'Alt+KeyN' }`.  
Ein leeres Array wird akzeptiert und belegt nichts: `setKeyBindingMap({ findReplace: [] })` überlässt `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac) der Seite, und `{ search: [] }` tut dasselbe für `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac). Die Schaltfläche `Search` der Symbolleiste öffnet weiterhin die Schnellsuche, die Schaltfläche `Explorer` der Symbolleiste öffnet und schließt weiterhin den Explorer, und `Toggle Explorer` in der Schnellsuche und im Kontextmenü der Zeichenfläche öffnet weiterhin seine Suche oder schließt ihn; keine davon zeigt eine Tastenkombination für einen leer gelassenen Namen. `{ removeSelection: [] }` überlässt `Delete` und `Backspace` der Seite, und die Löscheinträge des Tabellenmenüs, des Notizmenüs und des Gruppenmenüs (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) zeigen dann keine Tastenkombination.  
Seit `4.1.0` überlässt `{ addTableGroup: [] }` der Seite `Alt + G` (Windows/Linux) oder `⌥ + G` (Mac), und `{ groupSelectedTables: [] }` überlässt ihr `T` und dann `G`. `New Table Group` in der Symbolleiste der Zeichenfläche, im Kontextmenü der Zeichenfläche und in der Schnellsuche, `Group selected tables` im Tabellenmenü und `Group Selected Tables` in der Schnellsuche funktionieren weiterhin, ohne dass eine Tastenkombination angezeigt wird. Die Tooltips der Schaltflächen `New Table`, `New Memo` und `New Table Group` in der Symbolleiste der Zeichenfläche nennen die erste Tastenkombination von `addTable`, `addMemo` und `addTableGroup` oder bei einer leer gelassenen Belegung nur die Schaltfläche.  
Seit `4.2.0` geben `addColumn` und `removeColumn` außerdem dem Raster der Registerkarte Wörterbuch seine Tastenkombinationen für Zeilen, wie unten beschrieben, sodass eine neue Belegung eines der beiden diese Tastenkombinationen mitnimmt. `{ addColumn: [] }` lässt dem Raster keine Tastenkombination zum Einfügen von Zeilen, und die beiden Einfügeeinträge des Rastermenüs zeigen dann keine Tastenkombination; `{ removeColumn: [] }` lässt ihm keine zum Löschen, und der Löscheintrag des Menüs und der Tooltip von `Delete Rows` zeigen dann keine.  
Der Aufruf ist eine teilweise Zusammenführung: Namen, die Sie weglassen, behalten ihre Standardwerte, und ein zweiter Aufruf behält die früheren Änderungen bei. Es gibt keinen Getter für die aktuellen Belegungen: [createKeyBindingMap](#createkeybindingmap) liefert die Standardbelegungen, nicht das, was `setKeyBindingMap` geändert hat.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` und seit `4.1.0` `groupSelectedTables` lassen einem Textcursor den Vortritt: Solange der Fokus in einem Eingabefeld, einem mehrzeiligen Textfeld oder einem Element mit `contenteditable` liegt, wählt `$mod + A` den Text aus, `Space` gibt ein Leerzeichen ein, `Delete` und `Backspace` löschen Text, und `T` und dann `G` gibt die beiden Buchstaben ein, statt die Zeichenfläche zu erreichen. Bei keinem dieser Tastendrücke wird die Standardaktion verhindert. Jede Taste, mit der Sie sie neu belegen, verhält sich genauso.

Seit `4.0.0` entfernt `removeSelection` (`Delete` oder `Backspace`) die Auswahl auf der Registerkarte ERD als einen Rückgängig-Schritt, ohne nachzufragen. Wenn die fokussierte Tabelle als Einziges ausgewählt ist, eine oder mehrere ihrer Spalten ausgewählt sind und ihre Zeilen bei der aktuellen Zoomstufe gezeichnet werden, entfernt es diese Spalten; andernfalls entfernt es jede ausgewählte Tabelle, Notiz und Tabellengruppe, wobei die Tabellen einer Gruppe erhalten bleiben. Siehe [Tabellen und Notizen löschen](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Eine gehaltene Taste entfernt nur einmal, und nichts wird entfernt, solange ein Editor für eine Zelle, eine Notiz oder den Namen einer Tabellengruppe geöffnet ist. Außerhalb eines Textfelds und der Bereiche und Registerkarten, die Belegungen zurückhalten (siehe [createKeyBindingMap](#createkeybindingmap)), wird die Standardaktion des Tastendrucks auf jeder Registerkarte verhindert, solange der Editor den Fokus hat, auch auf einer fokussierten Schaltfläche der Symbolleiste und in einem schreibgeschützten Editor, wo er nichts entfernt.

Seit `4.1.0` aktiviert `addTableGroup` (`Alt+KeyG`) auf der Registerkarte ERD das Zeichnen mit `New Table Group`, bei dem der nächste Druck der primären Maustaste auf der Zeichenfläche die Gruppe zeichnet, und ein erneuter Tastendruck deaktiviert das Zeichnen wieder, wie die Schaltfläche `New Table Group` in der Symbolleiste der Zeichenfläche. `groupSelectedTables` (`KeyT KeyG`, `T` und dann `G`) legt die ausgewählten Tabellen in eine neue Gruppe und öffnet deren Namenseditor, wie `Group selected tables` im Kontextmenü einer Tabelle. Ohne ausgewählte Tabelle fügt es nichts hinzu; eine ausgewählte Notiz oder Tabellengruppe zählt nicht. Siehe [Gruppe zeichnen](../guide/guides/table-groups.md#drawing-a-group) und [Ausgewählte Tabellen gruppieren](../guide/guides/table-groups.md#grouping-selected-tables).  
Beide wirken nur dort, wo die Menüs eine Gruppe anbieten: nicht, solange `readonly` gesetzt ist, solange die Ansichtsoption `Table Groups` die Gruppen ausblendet oder solange ein Editor für eine Zelle, eine Notiz oder den Namen einer Tabellengruppe geöffnet ist. Wie die anderen Belegungen der Zeichenfläche wirken sie nur auf der Registerkarte ERD und nicht, solange die Schnellsuche, die Tabelleneigenschaften, die Diff-Ansicht, die Zeitreise, die Vorschau des Automatischen Layouts, `Export image` oder `Map Columns` geöffnet ist. Wo sie nichts bewirken, wird die Standardaktion des Tastendrucks trotzdem verhindert, außer wenn `groupSelectedTables` einem Textcursor den Vortritt lässt. Bei `addTableGroup` wird außerdem die Weitergabe gestoppt, wie bei `focusView` und `zenMode`, sodass ein Listener für `keydown` der Seite in der Bubbling-Phase den Tastendruck nie empfängt.

Seit `4.2.0` fügt auf der Registerkarte [Wörterbuch](../guide/guides/dictionary.md#adding-and-deleting-rows) jede Tastenkombination von `addColumn`, die aus einem einzigen Tastendruck besteht, so viele Zeilen unter der Auswahl ein, wie die Auswahl umfasst, dieselbe Tastenkombination mit zusätzlich gehaltenem `Shift` fügt sie darüber ein, und jede Tastenkombination von `removeColumn`, die aus einem einzigen Tastendruck besteht, löscht die Zeilen, die die Auswahl umfasst: mit den Standardbelegungen `Alt+Enter`, `Alt+Shift+Enter` und `Alt+Backspace` oder `Alt+Delete`. Sie wirken im Raster der Blätter `Domains`, `Words` und `Terms`, solange keine Zellbearbeitung geöffnet ist. Eine Tastenkombination von `addColumn`, die bereits `Shift` enthält, ergibt keine Tastenkombination zum Einfügen darüber, und eine Tastenfolge, die einem der beiden Namen zugewiesen ist, gibt dem Raster nichts.  
Bei jedem solchen Tastendruck wird die Standardaktion verhindert, wie seine Option es angibt, und die Weitergabe immer gestoppt, sodass er auf der Registerkarte ERD keine Spalte hinzufügt oder entfernt. Auf dem Blatt `Checks` und in einem schreibgeschützten Editor bewirkt er nichts, obwohl Standardaktion und Weitergabe weiterhin verhindert und gestoppt werden. In einer geöffneten Zellbearbeitung oder im Suchfeld der Registerkarte bleiben die Tastenkombinationen dem Text überlassen: Ihre Weitergabe wird dort gestoppt, ihre Standardaktion aber nicht verhindert, sodass das Feld darauf reagiert wie überall sonst (auf einem Mac löscht `⌥ + Backspace` ein Wort). [dictionaryRowChords](#dictionaryrowchords) führt sie auf.

Seit `3.10.0` öffnet `findReplace` (`$mod+KeyF`) [Suchen und Ersetzen](../guide/guides/find-and-replace.md). Seit `4.1.0` blendet es den [Explorer](../guide/guides/explorer.md#opening-and-closing), der Suchen und Ersetzen enthält, ein und aus, und die Registerkarte Tastenkombinationen führt es als `Toggle Explorer`.  
Solange die Schaltfläche `Explorer` der Symbolleiste gedrückt erscheint (der Explorer auf der Registerkarte ERD geöffnet und nicht durch den Zen-Modus ausgeblendet), schließt es den Explorer, außer wenn die Schnellsuche, die Tabelleneigenschaften, die Designauswahl, die Sprachauswahl, der Dialog `Export image` oder `Map Columns` geöffnet ist. Andernfalls schließt es, was davon geöffnet ist, holt die Registerkarte ERD von jeder anderen Registerkarte aus nach vorn und öffnet den Explorer mit dem Textcursor in seinem Feld `Find` und ausgewähltem Suchbegriff. Ein Editor, der zu schmal ist, um den Explorer neben der Zeichenfläche anzuzeigen, hält ihn geöffnet, aber beiseite, und zeigt die Meldung `Widen the window to show the Explorer`. Vor `4.1.0` öffnete es den schwebenden Bereich Suchen und Ersetzen oder gab dessen Feld die Tastatur zurück und schloss ihn nie.  
Es lässt einem Textcursor nicht den Vortritt: Solange der Editor den Fokus hat, wird es auf jeder Registerkarte abgefangen, von der Zeichenfläche aus oder aus einem Eingabefeld im Editor. Die Standardaktion des Tastendrucks wird verhindert, sodass der Browser keine Suchleiste öffnet, und seine Weitergabe wird gestoppt, sodass kein Listener für `keydown` der Seite in der Bubbling-Phase ihn empfängt. Bei geöffnetem Editor für eine Zelle oder Notiz, seit `4.0.0` für den Namen einer Tabellengruppe oder seit `4.2.0` bei einer geöffneten Zellbearbeitung im Raster der Registerkarte Wörterbuch werden Standardaktion und Weitergabe weiterhin verhindert und gestoppt, aber die Belegung bewirkt nichts. Im letzten Fall bewirkt auch `search` nichts, sodass der bisher eingegebene Text erhalten bleibt.  
Solange die Diff-Ansicht, die Zeitreise oder die Vorschau des Automatischen Layouts geöffnet ist, auf welcher Registerkarte auch immer, oder solange eine IME noch Zeichen zusammensetzt, wird weder die Standardaktion verhindert noch die Weitergabe gestoppt, sodass die eigene Suche des Browsers oder des Hosts den Tastendruck erhält. Im Explorer wird bei einem Tastendruck während des Zusammensetzens die Weitergabe gestoppt, die Standardaktion aber nicht verhindert. Jede Taste, mit der Sie `findReplace` neu belegen, verhält sich genauso.

`focusView` wirkt nur auf der Registerkarte ERD. Mit mindestens einer ausgewählten Tabelle öffnet es die Registerkarte Visualisierung im Flow-Modus, eingeschränkt auf diese Tabellen und jede Tabelle, die direkt über eine Beziehung mit ihnen verbunden ist; eine ausgewählte Notiz oder Tabellengruppe zählt nicht, und ohne ausgewählte Tabelle bewirkt es nichts. Siehe [Auf Tabellen fokussieren](../guide/guides/visualization.md#focusing-on-tables).

`undo` und `redo` wirken je nach Registerkarte. Auf der Registerkarte ERD machen sie Schritte im Verlauf des Dokuments rückgängig und wiederholen sie. Seit `4.2.0` wirken sie auf der Registerkarte Wörterbuch auf den eigenen Verlauf des angezeigten Blatts und auf dem Blatt `Checks` auf nichts – siehe [Wörterbuchblätter](../guide/guides/undo-redo.md#dictionary-sheets). Im Flow-Modus der Registerkarte Visualisierung gehen sie einen Schritt zurück und vor, wie es [`Previous table` und `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) tun, und lassen den Verlauf des Dokuments unberührt. Auf den anderen Registerkarten und im Graph-Modus machen sie nichts rückgängig.

`stop` (`Escape`) beendet auf der Registerkarte ERD einen geöffneten Editor für eine Zelle oder Notiz oder das Zeichnen einer Beziehung und lässt die Auswahl unverändert. Seit `4.0.0` beendet es außerdem einen Namenseditor einer Tabellengruppe, ohne einen Namen zu schreiben, sowie das Zeichnen mit `New Table Group`. Der Editor ruft für diesen Tastendruck `preventDefault()` auf.  
Ist nichts davon geöffnet, hebt `Escape` die Auswahl und die fokussierte Zelle auf, und seine Standardaktion wird nicht verhindert. Eine Bearbeitung zu verlassen und die Auswahl aufzuheben, erfordert daher zwei Tastendrücke.  
Seit `4.2.0` schließt das erste `Escape`, solange die Begriffsliste einer Zelle des logischen Namens angezeigt wird (siehe [Begriffsnamen vervollständigen](../guide/guides/logical-names.md#completing-term-names)), nur die Liste und lässt den Editor geöffnet. Bei diesem Tastendruck werden an der Zelle die Standardaktion verhindert und die Weitergabe gestoppt, sodass weder `stop` noch ein Listener für `keydown` der Seite in der Bubbling-Phase ihn empfängt.  
Abgesehen vom Explorer, den Formaten von `Import` im [Willkommensbildschirm](#enablewelcomescreen), der Begriffsliste einer Zelle des logischen Namens, der Registerkarte [Wörterbuch](../guide/guides/dictionary.md#keys-on-the-tab) und den unten genannten Auswahlen und Dialogen stoppt der Editor die Weitergabe von `Escape` nie, sodass eine Seite, die selbst darauf lauscht, etwa um einen eigenen Dialog zu schließen, beide Tastendrücke empfängt und denjenigen überspringen kann, dessen `defaultPrevented` den Wert `true` hat.  
Solange die Schnellsuche, die Tabelleneigenschaften, die Diff-Ansicht, die Vorschau des Automatischen Layouts oder die Zeitreise geöffnet ist, schließt `Escape` stattdessen diese und lässt die Auswahl unverändert. Auch bei diesem Tastendruck wird die Standardaktion nicht verhindert.  
Seit `4.0.0` nimmt auch ein geöffneter Dialog [`Export image`](../guide/guides/file-import-export.md#image) oder [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) `Escape` entgegen, schließt sich und lässt die Auswahl unverändert. Jeder übernimmt beim Öffnen die Tastatur, und bei diesem `Escape` wird sowohl die Standardaktion verhindert als auch die Weitergabe gestoppt.  
Seit `4.1.0` gibt ein `Escape`, das mit dem Fokus im [Explorer](../guide/guides/explorer.md#keys-in-the-explorer) gedrückt wird, in seinem Baum, seinen Feldern oder seinen Schaltflächen, die Tastatur an die Zeichenfläche zurück und lässt den Explorer geöffnet und die Auswahl unverändert. Der Editor ruft dafür sowohl `preventDefault()` als auch `stopPropagation()` auf, sodass es nie einen Listener für `keydown` der Seite in der Bubbling-Phase erreicht.  
Ein `Escape` auf der Zeichenfläche schließt den Explorer nie. Vor `4.1.0` schloss ein `Escape` im Bereich Suchen und Ersetzen diesen, und eines auf der Zeichenfläche schloss ihn mit demselben Tastendruck, der die Auswahl aufhob.  
Seit `4.0.0` schließen sich die Sprachauswahl und die Farbauswahl mit `Escape`: Darin wird seine Standardaktion verhindert und seine Weitergabe gestoppt, und auf der Zeichenfläche schließt es sie mit demselben Tastendruck, der die Auswahl aufhebt, ohne dass die Standardaktion verhindert oder die Weitergabe gestoppt wird.  
Ein `Escape`, das gedrückt wird, während eine IME noch Zeichen zusammensetzt, gehört zum Zusammensetzen. Es lässt einen geöffneten Editor unverändert, und seine Standardaktion wird nicht verhindert, daher kann eine Seite auch einen Tastendruck überspringen, dessen `isComposing` den Wert `true` hat oder dessen `keyCode` `229` lautet. Im Explorer wird bei einem solchen Tastendruck, wie bei jeder dort während des Zusammensetzens gedrückten Taste, außerdem die Weitergabe gestoppt, und die Tastatur bleibt im Feld.  
Vor `3.9.2` beendete ein einziges `Escape` eine Bearbeitung oder ein Zeichnen und hob zugleich die Auswahl auf, und der Editor verhinderte seine Standardaktion nie.

### createKeyBindingMap {#createkeybindingmap}

Seit `3.9.2` exportiert das Paket `createKeyBindingMap()` und zusammen damit die Typen `KeyBindingMap`, `KeyBindingName` und `ShortcutOption`.  
Die Funktion liefert die Standard-Tastenbelegungen, alle 28 Namen einschließlich der festen, bei jedem Aufruf als neue Map, sodass eine Änderung der zurückgegebenen Map nichts anderes ändert.  
Von dieser Belegung geht jeder Editor aus, und ein Aufruf von `setKeyBindingMap` zeigt sich darin nicht.  
Von diesen vier ist nur `createKeyBindingMap` ein Laufzeitexport; die anderen drei sind Typen. Seit `4.2.0` wird daneben [dictionaryRowChords](#dictionaryrowchords) exportiert.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Jeder Wert `shortcut` ist eine Tastenkombination in der Syntax von [tinykeys](https://github.com/jamiebuilds/tinykeys), die ihre Taste über `KeyboardEvent.code` benennt, wobei [`$mod`](#mod) unter macOS `⌘` und sonst `Control` ist.  
Seit `4.0.0` liest der Editor diese Tastenkombinationen selbst statt über tinykeys, in derselben Syntax. Eine Taste passt über ihren `code` oder über ihren `key` in beliebiger Groß-/Kleinschreibung, und ein Tastendruck passt nur, wenn genau die genannten Zusatztasten gehalten werden. `AltGraph` zählt unter Windows als `Control` und `Alt` und unter macOS als `Alt`. Durch ein Leerzeichen getrennte Tastendrücke bilden eine Tastenfolge, die nach einer Sekunde ohne keydown von vorn beginnt.  
Seit `4.1.0` ist eine Standardbelegung eine Tastenfolge: `groupSelectedTables` ist `KeyT KeyG`, `T` und dann `G`. Eine Tastenfolge wird bei dem Tastendruck ausgeführt, der sie vervollständigt, und nur dieser Tastendruck erhält ihr `preventDefault` und `stopPropagation`, sodass mit den Standardbelegungen `T` die Seite erreicht und nur bei `G` die Standardaktion verhindert wird. Menüs, die Schnellsuche und die Registerkarte Tastenkombinationen zeigen eine Tastenfolge als eine Taste pro Tastendruck.  
Die festen Namen sind mit `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) und `$mod+Digit0` (`zoomReset`) belegt. `edit` und `stop` tragen keine Flags; die anderen fünf tragen `preventDefault` und `stopPropagation`. Die übrigen sind die oben gezeigten Standardbelegungen, darunter `search` und `findReplace`.

Der Editor lauscht an seinem eigenen Element auf diese Tasten, daher muss ein Host, der Tasten vor dem Editor abgreift, mit globalen Hotkeys oder einem Listener für `keydown` in der Capture-Phase, sie durchlassen, solange der Editor den Fokus hat.  
Bauen Sie die Liste der durchzulassenden Tasten aus `createKeyBindingMap()` auf, mit den Belegungen, die Sie an `setKeyBindingMap` übergeben haben, anstelle der Standardbelegungen.  
Seit `3.10.0` enthält diese Liste `$mod+KeyF`, die Tastenkombination der browsereigenen Suche. Ein Host, der seine eigene Suche auf dieser Tastenkombination behalten will, ruft `setKeyBindingMap({ findReplace: [] })` auf.  
Seit `4.0.0` enthält sie außerdem `Delete` und `Backspace` ohne Zusatztaste. Ein Host, der diese Tasten behalten will, ruft `setKeyBindingMap({ removeSelection: [] })` auf.  
Seit `4.1.0` enthält sie außerdem `Alt+KeyG` und die Tastenfolge `KeyT KeyG`, die als eine einzige Zeichenkette kommt: Teilen Sie sie am Leerzeichen und lassen Sie jeden Tastendruck durch, auch `T` und `G` ohne Zusatztaste, da eine Tastenfolge, der ein Tastendruck fehlt, nie vollständig wird. Ein Host, der diese Tasten behalten will, ruft `setKeyBindingMap({ addTableGroup: [] })` oder `setKeyBindingMap({ groupSelectedTables: [] })` auf.  
Fügen Sie ihr seit `4.2.0` die Tastenkombinationen hinzu, die [dictionaryRowChords](#dictionaryrowchords) für dieselbe Map liefert, darunter `Alt+Shift+Enter`. Ein Host, der diese Tasten behalten will, ruft `setKeyBindingMap({ addColumn: [] })` oder `setKeyBindingMap({ removeColumn: [] })` auf, wodurch sie auf der Registerkarte ERD auch keine Spalten mehr hinzufügen oder entfernen.

Solange der Fokus im Explorer liegt, in seinem Baum, seinen Feldern `Find` und `Replace` oder seinen Schaltflächen, werden `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` und `zoomReset` an den Editor durchgelassen, sodass `findReplace` dort wie auf der Zeichenfläche wirkt. Jede andere Belegung, wie sie gerade eingestellt ist, wird am Explorer angehalten, eine Tastenfolge mit ihrem letzten Tastendruck (mit den Standardbelegungen ein `G` ohne Zusatztaste), und ebenso die Pfeiltasten, `Tab`, `Enter`, `Space`, `Home`, `End` und jede Taste, die gedrückt wird, während eine IME noch Zeichen zusammensetzt. Abgesehen von `Escape`, das die Tastatur an die Zeichenfläche zurückgibt, wird ihre Weitergabe gestoppt, ohne dass ihre Standardaktion verhindert wird, sodass sie in den Feldern, Schaltflächen und im Baum des Explorers als gewöhnliche Tasten wirken und weder die Zeichenfläche noch einen Listener für `keydown` der Seite in der Bubbling-Phase erreichen: `Alt + N` fügt dort keine Tabelle hinzu, und `Delete` entfernt nichts. Bei den Tasten, die den Fokus durch die Zeilen des Baums bewegen, eine Zeile einklappen oder zu ihr wechseln, und bei `Enter` im Feld `Find` oder `Replace`, das durch die Treffer wechselt oder ersetzt, wird zusätzlich die Standardaktion verhindert.  
Jede andere Taste, etwa die Tastenkombination eines Hosts zum Speichern oder für seine Befehlspalette, gelangt wie gewohnt zur Seite. Siehe [Tasten im Explorer](../guide/guides/explorer.md#keys-in-the-explorer). Vor `4.1.0` hielt der schwebende Bereich Suchen und Ersetzen Tasten auf dieselbe Weise zurück, abgesehen von `Home`, `End`, dem letzten Tastendruck einer Tastenfolge und `Space`, solange `handTool` auf eine andere Taste gelegt war.  
Seit `4.0.0` hält die Sprachauswahl Tasten auf dieselbe Weise zurück: Dieselben sieben Belegungen werden durchgelassen, und bei jeder anderen Belegung (seit `4.1.0` bei einer Tastenfolge mit ihrem letzten Tastendruck), den Pfeiltasten und `Tab` wird dort die Weitergabe gestoppt, ohne dass die Standardaktion verhindert wird, ebenso bei jeder Taste, die gedrückt wird, während eine IME noch Zeichen zusammensetzt. `↑`, `↓`, `Home`, `End`, `Enter` und `Space` auf einer ihrer Zeilen wechseln durch die Zeilen oder wählen eine aus, und bei ihnen wird zusätzlich die Standardaktion verhindert.

Seit `4.2.0` hält auch die Registerkarte [Wörterbuch](../guide/guides/dictionary.md#keys-on-the-tab) Tasten zurück, wobei nur `search`, `findReplace`, `undo` und `redo` an den Editor durchgelassen werden. `undo` und `redo` wirken auf den eigenen Verlauf des angezeigten Blatts, und bei geöffneter Zellbearbeitung oder mit dem Fokus im Suchfeld der Registerkarte bleiben sie dem Text überlassen, wobei ihre Weitergabe dort gestoppt, ihre Standardaktion aber nicht verhindert wird. `search` und `findReplace` bewirken nichts, solange eine Zellbearbeitung geöffnet ist, wie oben beschrieben. Die Tastenkombinationen für Zeilen wirken im Raster, wie oben unter `addColumn` und `removeColumn` beschrieben.  
Jede andere Belegung, wie sie gerade eingestellt ist, wird an der Registerkarte angehalten, eine Tastenfolge mit ihrem letzten Tastendruck, und ebenso die Pfeiltasten, `Tab`, `Enter`, `Space`, `Home`, `End` und jede Taste, die gedrückt wird, während eine IME noch Zeichen zusammensetzt. Keine davon erreicht die Zeichenfläche oder einen Listener für `keydown` der Seite in der Bubbling-Phase: `Alt + N` fügt dort keine Tabelle hinzu, und `Delete` entfernt nichts aus dem Diagramm. Ereignisse zum Kopieren, Ausschneiden und Einfügen in der Registerkarte werden dort ebenfalls angehalten, sodass das Diagramm sie nie als seine eigenen liest. Jede andere Taste gelangt wie gewohnt zur Seite.

### dictionaryRowChords {#dictionaryrowchords}

Seit `4.2.0` exportiert das Paket `dictionaryRowChords()`. Die Funktion liefert bei jedem Aufruf als neues `ShortcutOption[]` jede Tastenkombination, mit der das Raster der Registerkarte Wörterbuch unter der übergebenen Map der Tastenbelegungen Zeilen einfügt oder löscht.  
Der Reihe nach sind das die Tastenkombinationen von `addColumn`, die aus einem einzigen Tastendruck bestehen und Zeilen unter der Auswahl einfügen; jede davon mit zusätzlich gehaltenem `Shift`, die Zeilen darüber einfügt, wobei es für eine Tastenkombination, die bereits `Shift` enthält, keine gibt; und die Tastenkombinationen von `removeColumn`, die aus einem einzigen Tastendruck bestehen und Zeilen löschen. Jede behält `preventDefault` und `stopPropagation` der Belegung, aus der sie stammt, und eine Tastenfolge entfällt. Siehe [Zeilen hinzufügen und löschen](../guide/guides/dictionary.md#adding-and-deleting-rows).  
Die Tastenkombination, die Zeilen darüber einfügt, mit den Standardbelegungen `Alt+Shift+Enter`, steht in keiner Belegung, daher lässt ein Host, der Zusatztasten exakt abgleicht und seine Liste der durchzulassenden Tasten allein aus [createKeyBindingMap](#createkeybindingmap) aufbaut, sie nie durch. Lassen Sie beide Listen durch, wie es das Plugin für Obsidian tut.  
Die Funktion liest nur die Map, die sie erhält, nicht die Belegungen des Elements, übergeben Sie ihr also die Map, aus der Sie Ihre Liste der Tasten aufgebaut haben.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Tauscht die Taste `Control` je nach Umgebung aus.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabelle der Tastenkombinationen {#shortcut-table}

Verwendet die Eigenschaften `key, code` des Tastaturereignisses.  
Verwenden Sie `code` für absolute Positionen und `key` für Eingabewerte.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| entfällt      | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | entfällt      | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2` usw. | `1`, `2` usw.   | `1`, `2` usw. | `Digit1`, `Digit2` usw.        |
| `a`, `b` usw. | `a`, `b` usw.   | `a`, `b` usw. | `KeyA`, `KeyB` usw.            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Design {#theme}

### setPresetTheme {#setpresettheme}

Legt ein vordefiniertes Design fest.  
Die Standardwerte sind `appearance: 'dark'`, `grayColor: 'slate'` und `accentColor: 'indigo'`.  
Jedes Feld wird für sich angewendet, sodass ein teilweiser Aufruf die anderen beiden unverändert lässt. Ein Wert, der keiner der unten aufgeführten Namen ist, wird ignoriert, und der Aufruf löst nie einen Fehler aus.  
Seit `4.0.0` nimmt `appearance` auch `'system'` an, die Option `System` der Designauswahl. Dieser Wert zeigt das helle oder dunkle Erscheinungsbild, das das Betriebssystem meldet, oder dasjenige, das [setSystemAppearance](#setsystemappearance) angibt, und wechselt, wenn sich dieses ändert.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Gibt seit `4.0.0` an, welches helle oder dunkle Erscheinungsbild das Erscheinungsbild `'system'` zeigt, für einen Host mit eigenem hellem und dunklem Erscheinungsbild, etwa einem IDE-Design. Solange eines angegeben ist, werden Änderungen im Betriebssystem ignoriert.  
`null` oder jeder andere Wert als `'dark'` oder `'light'` kehrt dazu zurück, dem Betriebssystem zu folgen.  
Solange das Erscheinungsbild `'light'` oder `'dark'` ist, ändert die Methode nichts auf dem Bildschirm, aber der Wert bleibt erhalten und wirkt, sobald das Erscheinungsbild `'system'` wird. Andernfalls wirkt er sofort. Dabei löst sie nichts aus, und `changePresetTheme` meldet weiterhin `'system'`.  
Die Hosts für VS Code, JetBrains und Obsidian rufen sie mit ihrem eigenen hellen oder dunklen Erscheinungsbild auf und erneut, sobald sich dieses ändert.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Ermöglicht es, das Design anzupassen.  
Jeder Aufruf ersetzt die gesamte benutzerdefinierte Überlagerung, übergeben Sie also erneut das vollständige Objekt, um ein Token zusätzlich zu einer bestehenden Überschreibung zu ändern, und übergeben Sie `{}`, um zum vordefinierten Design zurückzukehren.  
Nur die unten aufgeführten Token-Namen mit Zeichenkettenwerten werden behalten; alles andere wird ohne Fehler verworfen.  
Die Überlagerung liegt über dem vordefinierten Design, sodass ein späteres `setPresetTheme` das darunterliegende vordefinierte Design austauscht, während Ihre Überschreibungen bleiben.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` und `memoShadow` sind die Farbe des Schattens, den Tabellen und Notizen auf die ERD-Zeichenfläche werfen. Das dunkle vordefinierte Design lässt sie `transparent`, was keinen Schatten wirft, wie die Übergabe von `none` oder einer leeren Zeichenkette an `setTheme`; das helle vordefinierte Design verwendet `rgba(0, 0, 0, 0.18)`.

Seit `4.0.0` gibt es neun weitere Token:

- `tableGroupHeaderBackground`, `tableGroupBackground` und `tableGroupBorder` färben die Titelleiste, die Innenfläche und den Umriss einer [Tabellengruppe](../guide/guides/table-groups.md), die keine eigene Farbe hat.
- `toastSuccess` und `toastError` färben das Symbol einer Meldung, die berichtet, wie etwas ausgegangen ist.
- `findReplaceError` und `mapColumnsError` färben die Fehler, die Suchen und Ersetzen und der Dialog „Spalten zuordnen“ anzeigen. Suchen und Ersetzen verwendete zuvor `diffDeleteForeground`, daher färbt eine Überschreibung dieses Tokens Suchen und Ersetzen nicht mehr um.
- `schemaSqlWarningBackground` und `schemaSqlWarningForeground` färben die Warnungen in den Optionen der Registerkarte Schema SQL.

Seit `4.1.0` gibt es neun weitere Token:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` und `treeMatch` färben den Baum, den sich der [Explorer](../guide/guides/explorer.md#the-tree) und die [Diff-Ansicht](../guide/guides/table-related-functions.md#diff-viewer) teilen: seinen Hintergrund, der auch die Felder `Find` und `Replace` des Explorers füllt; eine Zeile unter dem Zeiger, die Zeile mit dem Tastaturfokus, solange der Baum den Fokus hat, und eine Schaltfläche unter dem Zeiger im Kopf und in der Suche des Explorers; die Zeile des aktuellen Suchtreffers; abgeschwächten Text wie Anzahlen, Datentypen und die Pfeile zum Einklappen; und die Markierung hinter dem Text, den eine Suche gefunden hat.
- `explorerBackground` und `explorerBorder` färben den Bereich des Explorers und seine Linien: seinen Rand neben der Zeichenfläche, die Linie unter seiner Suche und die Ränder seiner Felder und der Schaltflächen, die `Search In` ausklappt. `explorerBorder` zeichnet außerdem den Rand des Baums der Diff-Ansicht, die Linie unter seinem Feld `Filter by name` und den Rand dieses Felds. Die Schlüsselsymbole des Explorers verwenden `keyPK`, `keyFK` und `keyPFK`.
- `diffModifyForeground` und `diffRenameForeground` färben, was die Diff-Ansicht als geändert und umbenannt markiert, in ihrem Baum und in beiden Dokumenten. `diffModifyForeground` umrandet außerdem eine Tabelle, Notiz oder Tabellengruppe, die verschoben, in der Größe geändert, umgefärbt oder einer anderen Gruppe zugeordnet wurde, egal was sich sonst daran geändert hat, und zeichnet die Verbindungslinie eines geänderten Fremdschlüssels.

`diffInsertForeground` und `diffDeleteForeground` färben jetzt, was die Diff-Ansicht als hinzugefügt und entfernt markiert, in ihrem Baum und in dem Dokument, das es enthält, gleichermaßen in Text, Umrissen und Verbindungslinien. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` und `diffCrossForeground` wurden in `4.1.0` entfernt, da die Diff-Ansicht keine Zellen mehr füllt. `setTheme` verwirft sie wie jeden anderen Namen, der nicht in `Theme` steht, und ihre Hooks `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` und `--erd-editor-diff-cross-foreground` werden nicht mehr gelesen.

Seit `4.2.0` gibt es zwölf weitere Token:

- `columnHandleBackground` und `columnHandleBorder` füllen und umranden den [Ziehgriff für Spalten](../guide/guides/table-editing.md#rearranging-and-moving-columns), der knapp außerhalb des linken Rands einer Tabelle neben einer fokussierten Spaltenzeile gezeichnet wird, und `columnHandleHoverBackground` und `columnHandleHoverBorder` übernehmen, solange der Zeiger darauf steht. Sein Griffsymbol erhält `foreground` und unter dem Zeiger `active`.
- `dictionaryErrorForeground` und `dictionaryWarningForeground` färben, was die [Wörterbuchprüfungen](../guide/guides/dictionary.md#what-each-check-finds) finden, einen Fehler oder eine Warnung: einen gemeldeten Namen auf der ERD-Zeichenfläche (siehe [Markierungen auf der Zeichenfläche](../guide/guides/dictionary.md#marks-on-the-canvas)), den Text einer gemeldeten Zelle auf den Blättern `Domains`, `Words` und `Terms` sowie die Anzahl von `Checks`. `dictionaryErrorBackground` und `dictionaryWarningBackground` füllen eine solche Zelle. `dictionaryErrorForeground` färbt außerdem das Werkzeug `Delete Rows` unter dem Zeiger.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` und `dictionaryHeaderSelect` färben das Blatt der Registerkarte [Wörterbuch](../guide/guides/dictionary.md#the-sheets): seine Zellen, deren Farbe auch das Suchfeld der Registerkarte und die Domänenliste eines Begriffs füllt; seine Spaltenköpfe und Zeilennummern; die Linien zwischen den Zellen, deren Farbe auch die Leiste der Registerkarte und die Ränder ihrer Felder zeichnet; und einen Kopf, dessen Zeile oder Spalte die Auswahl schneidet. Der Rest des Blatts verwendet gemeinsame Token: `foreground` für die Beschriftungen der Köpfe, `active` für den Zelltext, `grayColor7` für die Linie, die die Spaltenköpfe und die Zeilennummern von den Zellen abgrenzt, `focus` für den Rand der aktiven Zelle, `accentColor9` für den Rand eines ausgewählten Bereichs und, mit 20 % Deckkraft, für dessen Füllung, `accentColor6` für den Kopf einer vollständig ausgewählten Zeile oder Spalte, `grayColor3` für schreibgeschützte Zellen sowie die Token der Scrollleiste. Ist `accentColor9` nicht als `#rgb` oder `#rrggbb` geschrieben, bleibt ein ausgewählter Bereich ungefüllt.

#### CSS-Variablen {#css-variables}

Jedes Token in `Theme` hat einen passenden CSS-Hook, dessen Name `--erd-editor-` plus der Schlüssel in Kebab-Case ist: `grayColor10` ist `--erd-editor-gray-color-10`, `keyPK` ist `--erd-editor-key-pk`, und `keyPFK` ist `--erd-editor-key-pfk`.  
Die Hooks werden in den Editor vererbt, setzen Sie sie also dort, wo sie wirken sollen. Auf `:root` gestalten sie jeden Editor auf der Seite; auf dem Element selbst nur genau diesen.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Seit `3.4.0` werden die falsch geschriebenen Token `dargSelect` als `dragSelect` geschrieben, und ihre Hooks wurden von `--erd-editor-darg-select-background` und `--erd-editor-darg-select-border` in `--erd-editor-drag-select-background` und `--erd-editor-drag-select-border` geändert. Ein Stylesheet, das noch die alten Namen verwendet, wird ignoriert.

<details>
<summary>Standardwerte des Designs</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Anzeigesprache {#display-language}

Seit `4.0.0` gibt es den eigenen Text des Editors – seine Menüs, Bereiche, Dialoge, die Schnellsuche, Meldungen und die Wörter, die er auf das Diagramm zeichnet, etwa `unnamed`, Bildexporte eingeschlossen – in 25 Sprachen. Tabellen- und Spaltennamen, SQL, Datentypen und generierter Code werden nie übersetzt. Siehe [Sprache und Design](../guide/guides/language-and-theme.md).  
Bevor [setLocale](#setlocale) aufgerufen oder eine Sprache ausgewählt wird, zeigt der Editor Englisch oder folgt `'system'`, solange [enableLocalePicker](#enablelocalepicker) eingeschaltet ist.  
Der Editor setzt `lang` und `dir` an seiner eigenen Wurzel innerhalb des geschlossenen Shadow Roots, nie am Host-Element oder an der Seite, sodass eine Seite mit Schreibrichtung von rechts nach links den Editor nicht spiegelt und eine Sprache mit Schreibrichtung von rechts nach links die Seite nicht spiegelt. Hebräisch, Arabisch und Persisch ordnen die Oberfläche des Editors von rechts nach links an; das Diagramm selbst wird nie gespiegelt. Seit `4.1.0` bleibt der [Explorer](../guide/guides/explorer.md) in jeder Sprache links von der Zeichenfläche, wobei seine eigenen Zeilen in diesen drei Sprachen von rechts nach links verlaufen.  
Das Paket exportiert die Typen `LocaleCode` (einer der unten aufgeführten Codes) und `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Code    | Angezeigt als        | Sprache                       |
| ------- | -------------------- | ----------------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesisch                   |
| `de-DE` | Deutsch              | Deutsch                       |
| `en`    | English              | Englisch                      |
| `es-ES` | Español              | Spanisch                      |
| `eu-ES` | Euskara              | Baskisch                      |
| `fr-FR` | Français             | Französisch                   |
| `it-IT` | Italiano             | Italienisch                   |
| `nl-NL` | Nederlands           | Niederländisch                |
| `pl-PL` | Polski               | Polnisch                      |
| `pt-PT` | Português            | Portugiesisch                 |
| `pt-BR` | Português Brasileiro | Brasilianisches Portugiesisch |
| `ro-RO` | Română               | Rumänisch                     |
| `sk-SK` | Slovenčina           | Slowakisch                    |
| `sl-SI` | Slovenščina          | Slowenisch                    |
| `sv-SE` | Svenska              | Schwedisch                    |
| `tr-TR` | Türkçe               | Türkisch                      |
| `ru-RU` | Русский              | Russisch                      |
| `uk-UA` | Українська           | Ukrainisch                    |
| `he-IL` | עברית                | Hebräisch                     |
| `ar-SA` | العربية              | Arabisch                      |
| `fa-IR` | فارسی                | Persisch                      |
| `ja-JP` | 日本語                  | Japanisch                     |
| `zh-CN` | 简体中文                 | Vereinfachtes Chinesisch      |
| `zh-TW` | 繁體中文                 | Traditionelles Chinesisch     |
| `ko-KR` | 한국어                  | Koreanisch                    |

### setLocale {#setlocale}

Legt die Anzeigesprache fest: `'system'` oder einen der oben aufgeführten Codes. Alles andere, etwa ein bloßes `'ko'`, ein unbekannter Code oder ein Wert, der keine Zeichenkette ist, wird ohne Fehler ignoriert.  
Die Sprache wird angewendet, bevor die Methode zurückkehrt, sodass eine vor dem Einfügen des Elements gesetzte Sprache bereits in dessen erstem Frame erscheint.  
Die Methode löst nichts aus, weder `changeLocale` noch `change`, und berührt weder `value` noch den Verlauf noch einen gemeinsamen Store.  
Die Wahl bleibt bestehen, egal wie `enableLocalePicker` geschaltet ist, und `setLocale('system')` folgt dem System auch bei ausgeschalteter Sprachauswahl.  
Der Editor speichert nichts. Um die Wahl eines Benutzers zu behalten, lauschen Sie auf [changeLocale](#changelocale) und übergeben Sie sie beim nächsten Laden wieder.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Gibt als BCP-47-Tag die Sprache an, für die `'system'` steht, für einen Host mit eigener Anzeigesprache. Die Hosts für VS Code, JetBrains und Obsidian rufen die Methode mit ihrer eigenen Anzeigesprache auf.  
Leerraum am Anfang und Ende des Tags wird entfernt. `null`, eine leere Zeichenkette oder ein Wert, der keine Zeichenkette ist, kehrt zu `navigator.languages` des Browsers zurück, dem der Editor bei jeder Änderung folgt.  
Die Methode ist nur von Bedeutung, solange die geltende Option `'system'` ist, und wirkt sofort. Die Zeile `System` der Sprachauswahl nennt die Sprache, zu der die Option aufgelöst wird.  
Das Tag oder der Reihe nach jede Sprache des Browsers wird anhand des Sprach-Subtags zur ersten Sprache aufgelöst, die der Editor hat, wobei Groß-/Kleinschreibung und Unterstriche ignoriert werden: `de-AT` ergibt `de-DE` und `en-GB` ergibt `en`. Chinesisch richtet sich nach seiner Schrift, wobei `Hant` `zh-TW` und `Hans` `zh-CN` ergibt, und ohne Schrift nach der Region, wobei `TW`, `HK` und `MO` `zh-TW` und jede andere `zh-CN` ergeben. `pt` ergibt `pt-BR`, sofern keine andere Region als `BR` genannt ist. Wenn nichts passt, zeigt der Editor Englisch.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Lädt eine Datei mit Schema SQL.  
Standardmäßig ersetzt die Methode das aktuelle Dokument, statt die Datei mit ihm zusammenzuführen; siehe `mode` unten. Die bereits vorhandenen Einstellungen bleiben erhalten, einschließlich jeder Sperre und ihres gesperrten Werts, abgesehen von der Ansichtsposition und der Zoomstufe, und die Tabellen werden angeordnet, sobald die Datei gelesen ist, in Zeilen, sofern `placement` unten nichts anderes verlangt. Mit gesperrtem `Viewport` schreibt `value` dann die Ansicht, mit der der Import beginnt, Ursprung `0, 0` bei Zoomstufe `1`. In einem Dokument, das in ein Element importiert wird, das nie einen Wert erhalten hat, sind daher alle Sperren eingeschaltet, wie in einem neuen Dokument.  
Seit `4.2.0` behält ein Ersetzen außerdem die Wörter, Begriffe und Domänen des Dokuments, die der Text nicht enthalten kann, samt dem Verlauf jedes Wörterbuchblatts, und ein Rückgängigmachen oder Wiederholen des Imports behält sie ebenfalls. Ein ersetzendes [setSchemaJSON](#setschemajson) und das Zuweisen von `value` übernehmen stattdessen diejenigen, die ihr Dokument enthält.  
Die Methode wird im Verlauf aufgezeichnet, sodass `Undo, Redo` möglich ist, und löst `change` aus. Eine leere Zeichenkette wird ignoriert, und der Aufruf bewirkt nichts, solange `readonly` gesetzt ist.  
`setSchemaGraphQL`, `setSchemaDBML` und `setSchemaAML` verhalten sich genauso, und ihre Parser schlagen nie fehl: Text, den sie nicht lesen können, lädt ein leeres Dokument, statt einen Fehler auszulösen.  
Seit `4.0.0` nehmen alle vier ein optionales zweites Argument `{ placement, mode }` an:

- `placement: 'grid'`, der Standardwert, setzt die Tabellen sofort in Zeilen, wie bisher, und der Aufruf gibt nichts zurück.
- `placement: 'auto'` ordnet die Tabellen zuerst nach ihren Beziehungen an, wie `Import` im Editor, und gibt ein `Promise` zurück, das aufgelöst wird, sobald der Import als ein Rückgängig-Schritt eingefügt ist. Weniger als zwei Tabellen, keine Beziehung, ein fehlschlagendes Layout, eine Seite ohne `SharedWorker` oder `Cancel` im Hinweis `Placing tables` setzen sie stattdessen in Zeilen. Ein Laden in der Zwischenzeit – ein weiterer ersetzender Import, das Zuweisen von `value`, `setInitialValue()`, `clear()`, das Laden durch einen Mitbearbeiter oder ein Rückgängigmachen oder Wiederholen eines Ladens oder von `clear()` – löst ihn ab, und das `Promise` wird aufgelöst, ohne dass etwas geladen wurde. Auf diese Weise angeordnete Importe werden in der Reihenfolge eingefügt, in der sie gestartet wurden.
- `mode: 'replace'`, der Standardwert, ersetzt das Dokument. `mode: 'append'` fügt die Datei unterhalb des Diagramms hinzu, wie [Importieren und hinzufügen](../guide/guides/file-import-export.md#import-and-add), und lässt jede bereits vorhandene Tabelle unverändert, ebenso jede Einstellung außer der Registerkarte und der Ansichtsposition. Von einer anderen Registerkarte aus wird zuerst die Registerkarte ERD nach vorn geholt. Die neuen Tabellen und die Tabellengruppen, die eine DBML-Datei mitbringt, solange Tabellengruppen angezeigt werden, werden zur Auswahl, und die Ansicht scrollt zu ihnen, sofern sie nicht bereits gut sichtbar sind, nach der Regel, der seit `4.1.0` jeder Sprung folgt – siehe [Wohin ein Sprung führt](../guide/guides/table-related-functions.md#where-a-jump-lands). Ein einziges Rückgängigmachen entfernt die gesamte Ergänzung. Text, der sich nicht lesen lässt, fügt nichts hinzu und lässt das Dokument unverändert.

Solange `readonly` gesetzt ist, wird ein Ersetzen ignoriert, ein Anhängen fügt nichts hinzu, und ein Aufruf mit `placement: 'auto'` wird sofort aufgelöst.  
Seit `3.10.0` liest `setSchemaSQL` die Datei für die aktuelle Datenbank des Dokuments: Ist Databricks ausgewählt, folgen Zeichenketten in einfachen Anführungszeichen den Backslash-Escapes von Spark. Siehe [Kommentare](../guide/guides/file-import-export.md#comments).  
Seit `3.10.0` liest `setSchemaSQL` ein `UNIQUE` über zwei oder mehr Spalten als einen eindeutigen Index statt als Kennzeichen Eindeutig an jeder Spalte. Siehe [Eindeutige Schlüssel und Indizes](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Seit `3.10.0` behalten Importe aus SQL, DBML und AML die Aktionen `ON DELETE` und `ON UPDATE` der gelesenen Fremdschlüssel bei.  
Seit `4.0.0` behält `setSchemaSQL` den vollständigen Ausdruck `DEFAULT` einer Spalte bei, liest `ADD DEFAULT … FOR` und die Kommentare `MS_Description` von SQL Server, macht aus Serial- und Identity-Spalten von PostgreSQL Spalten mit Autoinkrement, behält `UNSIGNED` und `ZEROFILL` in einem Datentyp bei und liest einen Primärschlüssel, den `ALTER TABLE … ADD PRIMARY KEY` als `CLUSTERED`, `NONCLUSTERED` oder `USING BTREE` kennzeichnet. Siehe [Schema SQL](../guide/guides/file-import-export.md#schema-sql).  
Zur Syntax, die jeder Parser akzeptiert, siehe [Dateien importieren oder exportieren](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Lädt ein GraphQL-SDL-Dokument.  
Definitionen von Objekttypen werden zu Tabellen, und ein Feld, dessen Typ eine andere Tabelle ist, wird zu einer Beziehung.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Lädt eine DBML-Datei, das Format, das dbdiagram.io und dbdocs verwenden.  
Seit `4.0.0` wird jede `TableGroup` zu einer [Tabellengruppe](../guide/guides/table-groups.md), und das `headercolor` einer Tabelle wird zu ihrer Farbe. Siehe [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Lädt eine AML-Datei (Azimutt Markup Language). Sowohl die aktuelle Schreibweise als auch die alte Schreibweise von v1 werden akzeptiert.  
Seit `4.0.0` wird die Farbe einer Entität, einer der Farbnamen von Azimutt oder ein Hexwert in Anführungszeichen, zur Farbe ihrer Tabelle. Siehe [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Lädt seit `4.0.0` ein Dokument `.erd.json`, etwa den Text, den [value](#value) liefert.  
Im Standardmodus `mode: 'replace'` lädt die Methode das Dokument wie das Zuweisen von `value`: Das Laden wird im Verlauf aufgezeichnet, löst `change` aus und übernimmt die Sperren des Dokuments auf dieselbe Weise, und seit `4.2.0` ersetzen die Wörter, Begriffe und Domänen des Dokuments die des Editors. Anders als bei `value` wird eine leere Zeichenkette oder ein Wert, der keine Zeichenkette ist, ignoriert, statt ein neues Dokument zu beginnen. Text, der kein JSON ist, leert das Dokument, wie bei `value`.  
`mode: 'append'` fügt die Tabellen, Beziehungen, Indizes, Notizen und Tabellengruppen des Dokuments unterhalb des Diagramms unter neuen IDs hinzu, behält ihre Lage zueinander bei und lässt die Einstellungen des Dokuments weg, wie [Importieren und hinzufügen](../guide/guides/file-import-export.md#import-and-add) bei einer Datei im Format `json`. Seit `4.2.0` behält die Methode dabei die logischen Namen und die Kennzeichen abgeleiteter Namen der Tabellen und Spalten, lässt aber die Wörter, Begriffe und Domänen des Dokuments zurück, sodass keine seiner Spalten mit einer Domäne verknüpft ist. Text, der sich nicht lesen lässt, oder ein Dokument ohne Tabelle und ohne Notiz fügt nichts hinzu. Andernfalls wird es wie ein Anhängen mit [setSchemaSQL](#setschemasql) eingefügt, wobei seine neuen Notizen und Tabellengruppen zusammen mit seinen Tabellen ausgewählt werden, jede Art, solange sie angezeigt wird.  
Die Methode kehrt zurück, sobald das Dokument geladen ist, und wird ignoriert, solange `readonly` gesetzt ist.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exportiert den aktuellen Zustand des Editors als Schema SQL.  
Ist `databaseVendor` nicht angegeben, schreibt die Methode für das Datenbanksystem, das der Editor zeigt: das des Dokuments, es sei denn, der Leser eines [schreibgeschützten](#readonly) Editors hat ein anderes gewählt, was seit `5.0.0` auf diesem Bildschirm bleibt und das ist, was seine Registerkarte Schema SQL zeigt. Ein Name, der nicht in der Liste unten steht, wird ebenso behandelt, ohne einen Fehler auszulösen.  
Namen werden mit dem Begrenzertyp eingefasst, den der Editor anzeigt. Solange `Bracket Type` [gesperrt](../guide/guides/settings.md#lock) ist, oder in einem schreibgeschützten Editor, dessen Leser seit `5.0.0` einen anderen gewählt hat, kann dieser von dem abweichen, den `value` speichert und mit dem [`erd_read`](../mcp/tools.md#reading-a-document) eines Coding-Agenten Namen einfasst. Geschrieben werden immer die physischen Namen, unabhängig von der Namensansicht.  
Seit `4.0.0` wählt ein optionales Argument `options` die Anweisungen und den Vorspann, wie die Optionen der Registerkarte [Schema SQL](../guide/guides/schema-sql.md), und seit `4.2.0`, ob logische Namen leere Kommentare füllen. `SchemaSQLOptions` wird als Typ exportiert.

- `statements`: `'create'`, der Standardwert; `'ifNotExists'`, das bei MySQL, MariaDB, PostgreSQL, SQLite und Databricks `IF NOT EXISTS` schreibt und sonst auf `'create'` zurückfällt; oder `'recreate'`, das die Tabellen vor dem Erstellen löscht, wobei Snowflake stattdessen `CREATE OR REPLACE TABLE` schreibt.
- `header`: `'none'`, der Standardwert; `'use'`, das zur Datenbank oder zum Schema des Dokuments wechselt; oder `'createAndUse'`, das sie zuerst erstellt, falls sie nicht existiert, und dann zu ihr wechselt. Eine Datenbank, der die angeforderte Variante fehlt, fällt wie die Registerkarte zurück: Oracle schreibt `'use'` für `'createAndUse'`, PostgreSQL schreibt für `'use'` keinen Vorspann, und SQLite schreibt keinen. Ein Vorspann wird nur geschrieben, solange der Datenbankname des Dokuments ein einfacher Bezeichner ist – ASCII-Buchstaben, Ziffern und `_`, nicht mit einer Ziffer beginnend.
- `logicalNameAsComment`, seit `4.2.0`: `true` schreibt den logischen Namen einer Tabelle oder Spalte als ihren Kommentar, wo ihr eigener Kommentar leer ist oder nur aus Leerraum besteht und der logische Name nicht, in der Form, in der diese Datenbank einen Kommentar schreibt. Ein Kommentar mit Text wird wie bisher geschrieben. Nur `true` schaltet die Option ein: Fehlt sie oder hat sie den Wert `false` oder einen anderen Wert, etwa `'true'` oder `1`, wird kein logischer Name geschrieben. Sie bewirkt dasselbe wie der Schalter [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) der Registerkarte.

Eine weggelassene Option oder eine mit unbekanntem Wert gilt als ihr Standardwert, sodass ein Aufruf ohne Optionen wie bisher einfache Anweisungen `CREATE` ohne Vorspann schreibt.  
Seit `4.0.0` enthält die Ausgabe immer die Skripte `Before tables` und `After tables` des Dokuments, in der Reihenfolge Vorspann, Skript vor den Tabellen, DROP-Anweisungen, Tabellen, Skript nach den Tabellen. Die eigenen Auswahlen `Statements`, `Header`, `Write logical names into empty comments` und `Tables` der Registerkarte Schema SQL wirken sich nie auf diesen Aufruf aus, der immer das gesamte Dokument schreibt.  
Seit `3.10.0` trägt jeder Fremdschlüssel die Klauseln `ON DELETE` und `ON UPDATE` der Beziehung. Eine Klausel wird nur geschrieben, wenn ihre Aktion gesetzt ist und das Datenbanksystem sie akzeptiert, sodass eine Aktion, die dieses Datenbanksystem nicht annimmt, entfällt und ihr Standardverhalten gilt. Seit `4.0.0` akzeptiert Snowflake nur `NO ACTION`. Was jede Datenbank schreibt, zeigt [ON DELETE und ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Seit `3.10.0` wird ein einfaches Anführungszeichen in einem Tabellen- oder Spaltenkommentar maskiert, sodass ein Kommentar wie `it's` die Anweisung nicht mehr ungültig macht. Jedes Datenbanksystem, das Kommentare als Zeichenkettenliterale schreibt, verdoppelt es, außer Databricks, das vor jedes Anführungszeichen und jeden Backslash einen Backslash setzt. SQLite schreibt Kommentare weiterhin als Zeilen mit `--`.  
Seit `4.2.0` schreibt SQL Server jeden Kommentar als nationales Literal, `N'…'`, sodass Text außerhalb der Codepage der Datenbank, etwa Koreanisch, erhalten bleibt. Oracle schreibt jede Folge von Leerzeilen in einem Kommentar als einen einzigen Zeilenumbruch, und SQLite schreibt die Zeilenumbrüche eines Kommentars als Leerzeichen, sodass er auf seiner Zeile mit `--` bleibt. Siehe [Kommentare](../guide/guides/schema-sql.md#comments).  
Seit `4.0.0` schreiben mehrere Datenbanken außerdem Schlüsselnamen, Standardwerte und Autoinkrement anders. Siehe [Was die DDL schreibt](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Gibt einen Store für die gemeinsame Bearbeitung in Echtzeit zurück.  
`config` ist `{ getNickname?, mouseTracker?, focusTracker? }`. Beide Tracker haben den Standardwert `true`: `mouseTracker` überträgt den Mauszeiger dieses Editors an die anderen, und `focusTracker` überträgt seine fokussierte Zelle, seine Auswahl und seinen Auswahlrahmen.  
Seit `5.0.0` sendet der Store keine Änderung, solange [readonly](#readonly) gesetzt ist, nur was seine Tracker senden und die Register, die ein beitretender Editor anfordert, und er wendet weiterhin an, was die anderen senden.  
Siehe [Gemeinsame Bearbeitung](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Öffnet die Diff-Ansicht und vergleicht das aktuell geöffnete Dokument mit dem, das Sie übergeben.  
Die Methode gibt nichts zurück und verändert das Dokument nicht, sodass das Schließen der Ansicht den Editor genau so lässt, wie er war.  
Ein leerer Wert oder alles, was keine Zeichenkette ist, wird mit einem leeren Dokument verglichen.  
Dies ist dieselbe Überlagerung wie [Diff-Ansicht](../guide/guides/table-related-functions.md#diff-viewer) im Kontextmenü der Zeichenfläche.  
Seit `4.1.0` ordnet die Diff-Ansicht den Inhalt der beiden Dokumente zuerst nach ID einander zu und erst dann nach dem, was jedes enthält, etwa dem Namen einer Tabelle oder dem Text einer Notiz – siehe [Was verglichen wird](../guide/guides/table-related-functions.md#what-is-compared). Gegenüber einer früheren Version desselben Dokuments, etwa einer Git-Revision seiner Datei, erscheint eine Umbenennung daher als ein umbenanntes Element; gegenüber einem Dokument mit abweichenden IDs erscheint sie als eine Entfernung und eine Hinzufügung. Die Ansicht listet die Änderungen in einem Baum neben den beiden Dokumenten auf und markiert sie farbig, statt Zellen zu füllen.  
Seit `4.2.0` öffnen sich beide Dokumente in der Namensansicht, die dieser Editor zeigt, gleich was das übergebene Dokument gespeichert hat, und auch der Baum benennt Tabellen und Spalten danach – siehe [Außerhalb der Zeichenfläche](../guide/guides/logical-names.md#beyond-the-canvas). Logische Namen, Domänenverknüpfungen und die Wörterbücher werden nicht verglichen, sodass eine Änderung allein an ihnen keine Änderung anzeigt.

```js
editor.setDiffValue('prev json...');
```
