---
sidebar_position: 3
description: Die API des Elements erd-viewer – ein schreibgeschütztes Diagramm aus einem value oder einer src-URL, seine Minimap und Steuerleiste, die Ereignisse load und error, Designs, Anzeigesprache, Fokus und Tasten, das Laden und was es einer Seite hinzufügt.
---

# ErdViewerElement

Seit `5.0.0` liefert das Paket auch `<erd-viewer>`, eine schreibgeschützte Ansicht eines Dokuments: Ein Leser verschiebt, zoomt, sucht und bringt Beziehungen zum Leuchten, und nichts darin bearbeitet. Es zeichnet allein die ERD-Zeichenfläche mit ihren Scrollleisten, einer [Minimap](#minimap), einer [Steuerleiste](#controls) und einer Palette, die das Dokument durchsucht, und hat keine Symbolleiste, keine Registerkarten, keinen Explorer und kein Kontextmenü.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Der Frame oben ist dieses Element, wie erd-editor.io/embed es zeigt, hier mit dem Beispiel bookstore: Klicken Sie ihn an, um ihm den Fokus zu geben, und zoomen und suchen Sie dann mit den Tasten unter [Fokus und Tasten](#focus-and-keys); unter [Einbetten](../guide/guides/embedding.md) erfahren Sie, wie Sie ohne Code ein eigenes Dokument einbinden.

Der Viewer ist ein einfaches `HTMLElement`.  
Seine Typdefinition lautet wie folgt.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Der Import von `@dineug/erd-editor/erd-viewer.js` definiert `<erd-viewer>` und lässt `<erd-editor>` undefiniert. Der Import des Paketstamms definiert keines von beiden: Er exportiert die Klasse `ErdViewerElement` und `defineErdViewer()`, das das Tag dort definiert, wo Sie es aufrufen, sodass eine Seite die Klasse auch unter einem eigenen Tag definieren kann – siehe [Die Elemente registrieren](./installation.md#registering-the-elements).  
Jeder Einstiegspunkt außer `engine.js` und `peer.js` braucht ein DOM, dieser auch, daher importiert eine serverseitig gerenderte Seite ihn im Client – siehe [Serverseitiges Rendering](./installation.md#server-side-rendering).  
Der Import des Einstiegspunkts ergänzt `HTMLElementTagNameMap` um `erd-viewer`, sodass `document.createElement('erd-viewer')` und `document.querySelector('erd-viewer')` ohne Cast als `ErdViewerElement` typisiert sind.

Wie der Editor rendert der Viewer in ein geschlossenes Shadow Root, sodass `viewer.shadowRoot` `null` ist und Stile der Seite weder hinein- noch hinauslecken; gestalten Sie ihn über [setTheme](#settheme) und die Custom Properties `--erd-editor-*`. Mehrere Viewer auf einer Seite behalten jeweils ihr eigenes Dokument, ihre eigene Ansicht, ihr eigenes Design und ihre eigene Sprache.  
`<erd-viewer>` hat keine eigene Größe. Ein Custom Element ist inline, geben Sie ihm daher wie oben `display: block` und eine Höhe. Die Ansicht füllt das Feld des Elements und folgt ihm bei Größenänderungen, wobei sie ihren Zoom behält.

`src`, `name-view`, `minimap` und `controls` sind seine einzigen Attribute, jedes mit einer gleichnamigen Eigenschaft, `nameView` für `name-view`. [value](#value) ist allein eine Eigenschaft.  
Ein `value`, `src`, `nameView`, `minimap` oder `controls`, das auf dem Element gesetzt wird, bevor sein Tag definiert ist, etwa von einem Framework, das das Element rendert, bevor der Einstiegspunkt geladen ist, wird übernommen, sobald das Tag definiert ist, und zwar vor den Attributen, die das Markup ihm gegeben hat. Sie werden in der Reihenfolge übernommen, in der die Seite sie zuerst geschrieben hat, sodass das spätere von `value` und `src` gewinnt. Ein `value`, das kein Dokument enthält, hat dann keinen Aufrufer mehr, an den es werfen könnte: Es wird als nicht abgefangener Fehler gemeldet, und der Viewer bleibt leer.

Der Build für das Script-Tag, `dist/erd-viewer.umd.js`, enthält allein den Viewer mit allen Abhängigkeiten. Er definiert `<erd-viewer>` und legt `ErdViewerElement` und `defineErdViewer` auf `window.ErdViewer`. Eine CDN-URL ohne Pfad liefert stattdessen den Build des Editors, nennen Sie also die Datei – siehe [Script-Tag](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

Die URL eines Dokuments, das der Viewer abrufen und zeigen soll. Standardmäßig ist es `''`, also keines.  
Der Abruf ist ein einfaches `fetch()`, ein `GET` ohne eigene Optionen, sodass die CORS-Regeln des Browsers ihn bestimmen: Ein Dokument von einem anderen Ursprung braucht einen Server, der den Ursprung der Seite erlaubt, und Cookies gehen nur an den eigenen Ursprung der Seite. Eine relative URL wird gegen die Seite aufgelöst.  
Die Antwort muss ein Dokument enthalten, wie es eine Datei `.erd.json` tut, die Speicherform, die der [value](./erd-editor-element.md#value) des Editors und jeder offizielle Host schreiben. Kein anderes Format wird gelesen: Eine SQL-, GraphQL-, DBML- oder AML-Datei scheitert als Text, der sich nicht parsen lässt.  
Ein Dokument, das sich parsen lässt, landet an die Ansicht angepasst und löst [load](#load) aus. Eine Anfrage, die das Netzwerk oder CORS verweigert hat, eine Antwort, die nicht `ok` ist, oder Text, der sich nicht parsen lässt, löst [error](#error) aus und hinterlässt ein leeres Diagramm – siehe [Laden](#loading).

Nur die letzte Anfrage zählt. Ein neues `src` bricht den noch laufenden Abruf ab, sodass eine langsame Antwort nie über einem späteren Dokument landet. Auch das Zuweisen von [value](#value) bricht ihn ab, ebenso das Entfernen von `src` oder das Setzen auf `''`, was aufhört, ihm zu folgen, und das Dokument so lässt, wie es angezeigt wurde.  
Was von `value` und `src` zuletzt gesetzt wird, gewinnt, über die Eigenschaft wie über das Attribut. Ein `src`, das nach einem `value` geschrieben wird, wird abgerufen, auch wenn es die zuvor abgerufene URL nennt. Wird es erneut über das Dokument geschrieben, das es bereits zeigt, ruft es nichts ab.  
Der Viewer ruft nur ab, solange er in einer Seite ist. Wird er herausgenommen, bricht ein noch laufender Abruf ab, und beim Zurücksetzen ruft er ein `src` ab, das er noch nicht gezeigt hat, auch eines, das gescheitert ist, nie eines, das er bereits zeigt.  
`src` ist das einzige `fetch()`, das das Paket ausführt, daher führt eine strenge Content Security Policy den Ursprung des Dokuments in `connect-src` auf.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Liefert das angezeigte Dokument, ob es aus `src` oder `value` stammt, als JSON-Zeichenkette in der Speicherform, die der [value](./erd-editor-element.md#value) des Editors schreibt. Bevor etwas angezeigt wird, ist es ein neues, leeres Dokument, dessen `doc` `{}` ist.  
Solange die [Sperre](../guide/guides/settings.md#lock) `Viewport` des Dokuments eingeschaltet ist, wie in einem neuen Dokument, schreibt es den Zoom und das Scrollen, bei denen das Dokument gesperrt ist, wohin der Leser die Ansicht auch bewegt hat. Nur bei ausgeschalteter Sperre schreibt es, wo die Ansicht steht, die Anpassung beim Landen eingeschlossen.  
Es schreibt die Namensansicht, die das Dokument enthält, nie die, die [nameView](#nameview) oder die Steuerleiste darüber zeigt, auch in einem Dokument, dessen Sperre `Name View` ausgeschaltet ist.  
Es liefert das Dokument auch nach [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Zeigt ein Dokument aus seinem Text, ersetzt das angezeigte und passt es an die Ansicht an – siehe [Laden](#loading). Es nimmt den Text an, den eine Datei oder der `value` des Editors enthält.  
Text, der sich nicht parsen lässt, wirft, bevor sich etwas ändert, und das angezeigte Dokument bleibt: ein `SyntaxError` bei Text, der kein JSON ist, ein `TypeError` bei JSON, das kein Dokument enthält, etwa `7`. Eine leere Zeichenkette oder alles, was keine Zeichenkette ist, zeigt ein leeres Diagramm.  
Die Zuweisung bricht einen noch laufenden Abruf von `src` ab und löst weder `load` noch `error` aus.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Zeigt das Diagramm in einer [Namensansicht](../guide/guides/logical-names.md#name-view) über der, die das Dokument enthält: `'physical'` für `Physical Names`, `'logical'` für `Logical Names` oder `'both'` für `Both Names`. `null`, der Standard, zeigt die eigene des Dokuments, und ein Attributwert außer den dreien wird als `null` gelesen.  
Sie bleibt über jedem Dokument in Kraft, das nach ihr geladen wird, und [value](#value) schreibt sie nie. Das Entfernen des Attributs kehrt zur eigenen Ansicht des Dokuments zurück.  
Die Liste `Name View` der [Steuerleiste](#controls) wechselt die Ansicht ebenfalls, bis das nächste Dokument landet oder `nameView` sich das nächste Mal ändert. Ein Wechsel dort wird ebenfalls nicht in `value` geschrieben.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Zeigt die Minimap in der oberen rechten Ecke, solange das Dokument eine Tabelle, eine angezeigte Notiz oder eine angezeigte Tabellengruppe enthält. Sie ist standardmäßig eingeschaltet.  
Sie funktioniert wie die des Editors: Klicken Sie darauf, um die Ansicht dorthin zu bewegen, oder ziehen Sie ihr Ansichtsrechteck, um zu verschieben – siehe [Auf der Zeichenfläche navigieren](../guide/guides/table-related-functions.md#getting-around-the-canvas). Ein Finger darauf gehört der Seite, bis der Viewer den Fokus hat.  
Nur `minimap="false"` schaltet sie aus. Ein Attribut ohne Wert, jeder andere Wert und kein Attribut lassen sie eingeschaltet.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Zeigt die Steuerleiste über der Mitte des unteren Rands der Zeichenfläche. Sie ist standardmäßig eingeschaltet und enthält von links nach rechts:

- Den Zoom: `Zoom out`, die aktuelle Zoomstufe als Prozentwert und `Zoom in`. Die beiden Schaltflächen stufen den Zoom wie die Zoom-Tasten, und ein Klick auf den Prozentwert, `Reset zoom`, setzt ihn auf `100%` zurück. Jede nennt ihre Taste in ihrem Tooltip.
- `Fit`, das so zoomt und scrollt, dass das ganze Diagramm in der Ansicht erscheint, zentriert.
- `Name View`, eine Schaltfläche, die die geltende Ansicht nennt und über der Leiste eine Liste von `Physical Names`, `Logical Names` und `Both Names` öffnet – siehe [nameView](#nameview).
- Den Kompass `Go to content`, der nur so lange am Ende der Leiste erscheint, wie nichts vom Diagramm auf dem Bildschirm zu sehen ist, und die Ansicht zum nächstgelegenen Teil davon bringt.

Die Leiste steht in jeder Sprache von links nach rechts.  
Nur `controls="false"` schaltet sie aus, mit ihrem Kompass und ihrer Liste `Name View`. Ein Attribut ohne Wert, jeder andere Wert und kein Attribut lassen sie eingeschaltet. Auch ohne die Leiste zoomen das Mausrad, ein Pinch und die Tasten weiterhin, sobald der Viewer den Fokus hat.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Ereignisse {#event}

`load` und `error` sind die einzigen beiden Ereignisse, und beide berichten über `src`. Keines läuft im Bubbling nach oben, daher lauschen Sie am Element selbst.

### load {#load}

Wird ausgelöst, sobald das Dokument, das `src` nennt, abgerufen und angezeigt wurde. `event.detail` ist `null`.  
Das Zuweisen von `value` löst keines aus, ebenso wenig ein Abruf, den ein späteres `src`, ein `value`, das Herausnehmen des Elements aus der Seite oder [destroy](#destroy) abgebrochen hat.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Wird ausgelöst, wenn der Abruf von `src` scheitert: Das Netzwerk oder CORS hat die Anfrage verweigert, die Antwort war nicht `ok`, oder ihr Text ließ sich nicht parsen. Der Viewer zeigt dann ein leeres Diagramm und den Hinweis `Couldn't load the diagram` – siehe [Laden](#loading).  
`event.detail` ist die Ursache: der `TypeError`, mit dem `fetch()` abgelehnt wird, ein `Error`, der den Status nennt, etwa `GET /missing.erd.json answered 404 Not Found`, oder der `SyntaxError` oder `TypeError` des Parsers.  
Ein Abruf, den etwas abgebrochen hat, löst nichts aus.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Legt ein vordefiniertes Design fest und nimmt die `ThemeOptions` des Editors an – siehe [setPresetTheme](./erd-editor-element.md#setpresettheme).  
Der Viewer beginnt mit `appearance: 'system'`, `grayColor: 'slate'` und `accentColor: 'indigo'`, zeigt also vom ersten Frame an das Hell oder Dunkel, das das Betriebssystem meldet, und wechselt, wenn sich das ändert. Der Editor beginnt dagegen dunkel.  
Jedes Feld wird für sich angewendet, sodass ein Teilaufruf die anderen beiden lässt, wie sie sind. Ein Wert, der keiner der Namen ist, wird ignoriert, und der Aufruf wirft nie.  
Der Viewer hat keine Designauswahl und kein `systemDarkMode` und löst für ein Design kein Ereignis aus.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Benennt das Hell oder Dunkel, das das Erscheinungsbild `'system'` zeigt, für eine Seite mit einem eigenen Hell und Dunkel. Solange eines benannt ist, werden die Änderungen des Betriebssystems ignoriert.  
`null` oder jeder Wert außer `'dark'` oder `'light'` kehrt dazu zurück, dem Betriebssystem zu folgen.  
Solange das Erscheinungsbild `'light'` oder `'dark'` ist, ändert es nichts auf dem Bildschirm, aber der Wert wird behalten und gilt, sobald das Erscheinungsbild `'system'` wird. Es löst nichts aus.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Überschreibt Design-Token über dem vordefinierten Design und nimmt die `Theme`-Token des Editors an – siehe [setTheme](./erd-editor-element.md#settheme).  
Jeder Aufruf ersetzt die gesamte Überlagerung, übergeben Sie also `{}`, um zum vordefinierten Design zurückzukehren. Nur die Namen der Token mit Zeichenkettenwerten werden behalten, und ein späteres `setPresetTheme` tauscht das vordefinierte Design darunter aus, während die Überschreibungen bleiben.  
Die CSS-Custom-Properties `--erd-editor-*` erreichen auch den Viewer, auf dem Element oder irgendwo darüber gesetzt – siehe [CSS-Variablen](./erd-editor-element.md#css-variables). Die Zeichenfläche, die kein Stylesheet erreicht, liest sie erneut, wenn sich ein Stylesheet im `head` der Seite ändert oder wenn sich das Attribut `class` oder `style` des Elements oder eines Elements darüber ändert. Eine mit `insertRule()` hinzugefügte Regel ändert nichts davon, sodass die Zeichenfläche sie bei der nächsten solchen Änderung übernimmt.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Legt die Anzeigesprache fest: `'system'`, der Standard, oder einen der 25 Codes, die die [Anzeigesprache](./erd-editor-element.md#display-language) des Editors auflistet. Alles andere, etwa ein einfaches `'ko'` oder ein Wert, der keine Zeichenkette ist, wird ignoriert.  
Die Sprache ändert die Tooltips der Steuerleiste, die Liste `Name View`, die Palette, die Ladehinweise und die Wörter, die das Diagramm selbst zeichnet, etwa `unnamed`. Namen, Kommentare und der Rest des Dokuments werden nie übersetzt.

Englisch ist Teil des Einstiegspunkts des Viewers und gilt, bevor der Aufruf zurückkehrt. Jede andere Sprache ist ein eigenes Modul, das Ihr Bundler als Chunk neben dem Viewer ausgibt und das der Viewer aus Ihrem Bundle abruft, wenn eine Seite diese Sprache zum ersten Mal anfordert, einmal für alle Viewer der Seite. Bis es gelandet ist, zeigt der Viewer weiter die Sprache, die er zeigte, im ersten Frame Englisch. Schlägt das Laden fehl, zeigt der Viewer Englisch, und eine erneute Anforderung dieser Sprache versucht es erneut.  
Der Build für das [Script-Tag](./installation.md#script-tag) enthält alle 25 Sprachen und ruft daher keine ab. Ein Bundle, das auch den Editor enthält, lädt jede Sprache mit dem Chunk des Editors – siehe [Die Elemente registrieren](./installation.md#registering-the-elements).  
Das `Promise`, das es zurückgibt, wird aufgelöst, sobald diese Sprache gelandet oder gescheitert ist, und nie abgelehnt. Diese Sprache oder nach einem Fehler Englisch gilt dann, es sei denn, ein späterer Aufruf hat eine andere angefordert: Der spätere Aufruf gewinnt, in welcher Reihenfolge die Sprachen auch landen.

Hebräisch, Arabisch und Persisch ordnen die Palette und die Ladehinweise von rechts nach links an. Die Zeichenfläche, die Minimap, die Scrollleisten und die Steuerleiste mit ihrem Kompass bleiben von links nach rechts, wie die Zeichenfläche des Editors – siehe [Sprachen mit Schreibrichtung von rechts nach links](../guide/guides/language-and-theme.md#right-to-left-languages).  
Der Viewer setzt `lang` und `dir` auf seinem eigenen Root innerhalb des geschlossenen Shadow Roots, nie auf dem Host-Element oder der Seite.  
Es löst nichts aus, und der Viewer hat keine Sprachauswahl und speichert nichts.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Benennt die Sprache, für die `'system'` steht, als BCP-47-Tag, für eine Seite mit einer eigenen Spracheinstellung.  
Das Tag wird getrimmt. `null`, eine leere Zeichenkette oder ein Wert, der keine Zeichenkette ist, kehrt zu den Sprachen der Seite zurück.  
Das sind das `<html lang>` der Seite, dann `navigator.languages` des Browsers, einmal gelesen, wenn der Viewer sich zum ersten Mal verbindet. `'system'` nimmt die erste davon, für die der Viewer eine Sprache hat, nach der Regel des Editors unter [setSystemLocale](./erd-editor-element.md#setsystemlocale), und Englisch, wenn er keine davon hat. Eine Seite, deren `<html lang>` eine Sprache nennt, die der Viewer hat, zeigt also diese Sprache, was der Browser auch bevorzugt, und eine spätere Änderung von `lang` oder der Browsersprachen bewegt keinen Viewer.  
Es zählt nur, solange die geltende Option `'system'` ist, und sein `Promise` wird aufgelöst wie das von [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Beendet den Viewer endgültig. Er nimmt die Ansicht herunter, bevor er zurückkehrt, ob das Element noch in der Seite ist oder zuvor herausgenommen wurde, bricht einen noch laufenden Abruf von `src` ab und hört auf, dem Farbschema des Betriebssystems und den Stilen der Seite zu folgen.  
Ein zerstörter Viewer zeichnet nichts mehr, ruft nichts ab und fordert keine Sprache an, auch wenn er einer Seite erneut hinzugefügt wird. Das Lesen von [value](#value) liefert weiterhin das Dokument, das er hielt.  
Das Herausnehmen des Elements aus der Seite zerstört es nicht: Zurückgesetzt, macht es weiter und ruft ein `src` ab, das es noch nicht gezeigt hat – siehe [Laden](#loading).

```js
viewer.destroy();
```

## Fokus und Tasten {#focus-and-keys}

Ein Viewer nimmt beim Einhängen, beim Landen eines Dokuments und beim Schließen seiner Palette keinen Fokus, sodass er die Seite nie zu sich scrollt und die Tasten der Seite nicht übernimmt.  
Ein Klick oder Tippen auf seine Zeichenfläche fokussiert ihn, ohne die Seite zu scrollen, und er ist eine Station der Taste `Tab`. Anders als der Editor hat er kein eigenes Mitglied `focus()` oder `blur()`. Ein Druck an einer beliebigen anderen Stelle der Seite nimmt den Fokus wieder weg.

Solange der Viewer den Fokus nicht hat, behält die Seite das Mausrad, das die Seite scrollt, und einen Trackpad-Pinch. Ein Finger auf der Zeichenfläche scrollt die Seite und verschiebt nichts, und jede Taste erreicht die Seite, ohne unterdrückt zu werden.  
Sobald er den Fokus hat:

- Das Mausrad verschiebt die Ansicht, und `Shift + Wheel` verschiebt sie seitwärts. Über einer Notiz, deren Text überläuft, scrollt das Mausrad die Notiz.
- `Ctrl + Wheel` (Windows/Linux) oder `⌘ + Wheel` (Mac), ein Trackpad-Pinch oder zwei Finger auf einem Touchscreen zoomen.
- Ein Finger verschiebt die Ansicht.
- `Ctrl + Plus` und `Ctrl + Minus` (Windows/Linux) oder `⌘ + Plus` und `⌘ + Minus` (Mac) stufen den Zoom wie die Schaltflächen `Zoom in` und `Zoom out`, und `Ctrl + 0` (Windows/Linux) oder `⌘ + 0` (Mac) geht direkt zurück auf `100%`, wobei die Mitte des Bildschirms an ihrem Platz bleibt.
- `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac) öffnet die Palette, und `Esc` schließt sie.

Das sind seine einzigen Tasten, und sie lassen sich nicht neu belegen. Jede andere Taste erreicht die Seite, ohne unterdrückt zu werden, fokussiert oder nicht: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` und jede Tastenkombination, die im Editor bearbeitet.

Die Palette durchsucht allein das Dokument und listet keinen Befehl auf. Ihre leere Eingabe zeigt die Präfixe: `#` durchsucht die Tabellen, `@` die Spalten, `:` die Kommentare und Notizen, und `?` listet die Präfixe auf, wie im Editor – siehe [Das Diagramm durchsuchen](../guide/guides/quick-search.md#searching-the-diagram). Ein Wort ohne Präfix zeigt `No commands match` über den Zeilen, die das Diagramm danach durchsuchen.  
Die Wahl einer Zeile bewegt die Ansicht nach der Regel des Editors, [Wohin ein Sprung führt](../guide/guides/table-related-functions.md#where-a-jump-lands), lässt den Zoom, wie er ist, und umrandet, was sie erreicht hat, nach vorn gebracht: die Tabelle, die Tabelle, die die Spalte oder den Kommentar enthält, oder die Notiz.  
Die Wahl einer Zeile oder `Esc` schließt die Palette und lässt den Fokus bei keinem Element, sodass das nächste Mausrad die Seite scrollt; klicken Sie die Ansicht an, um ihr das Mausrad und die Tasten wieder zu geben. Solange die Palette geöffnet ist, scrollt das Mausrad ihre Liste, und die Zoom-Tasten bewirken nichts.

Fokussiert oder nicht verschiebt ein Ziehen mit der Haupttaste der Maus die Ansicht von jeder Stelle der Zeichenfläche aus, auch über einer Tabelle. Ein Klick oder Tippen ohne Bewegung bringt Beziehungen zum Leuchten: auf einer Tabelle deren Beziehungen, auf einer Beziehungslinie diese Linie, an jeder anderen Stelle, auch einer Notiz, löscht er die Hervorhebung. Ein solcher Klick hebt auch den Umriss auf, den ein Sprung der Palette hinterlassen hat. Der Zeiger, der auf einer Tabelle ruht, bringt deren Beziehungen zum Leuchten, solange er dort ist.  
Kein Druck wählt etwas aus, verschiebt oder bearbeitet etwas. Es gibt keine Auswahl außer dem Umriss eines Sprungs, keinen Auswahlrahmen, und kein Doppelklick und kein `Enter` öffnet eine Zelle.

## Laden {#loading}

Während `src` lädt, zeigt ein Hinweis über der Mitte der Zeichenfläche `Loading diagram` neben einem sich drehenden Ladesymbol. Scheitert ein Laden, zeigt er `Couldn't load the diagram` neben einem Warnzeichen, bis ein neues `src` oder ein `value` seinen Platz einnimmt oder `src` entfernt wird. Drücke gehen durch den Hinweis hindurch zur Zeichenfläche, und er erscheint in der Anzeigesprache, bei einer Sprache von rechts nach links ebenfalls von rechts nach links.

Jedes Dokument, das landet, aus `src` oder aus `value`, wird an das Feld des Viewers angepasst: so gezoomt und gescrollt, dass das ganze Diagramm erscheint, zentriert, wie es `Fit` tut, wobei Zoom und Scrollen, die die Datei gespeichert hat, beiseitebleiben. Ein Dokument, das übergeben wird, bevor der Viewer eine Größe hat, gesetzt bevor er in einer Seite ist oder solange sein Feld leer ist, wird angepasst, sobald er eine hat. Eine spätere Größenänderung behält den Zoom; `Fit` passt erneut an.

Der Viewer ruft ein `src` nur ab, solange er in einer Seite ist. Wird er herausgenommen, bricht ein noch laufender Abruf ab, und beim Zurücksetzen ruft er ein `src` ab, das er noch nicht gezeigt hat, auch eines, das gescheitert ist, nie eines, das er bereits zeigt. Ein Viewer, der nicht mehr gebraucht wird, wird mit [destroy](#destroy) beendet.

## Was es einer Seite hinzufügt {#what-it-adds-to-a-page}

- Keinen Worker. Er startet keinen, sodass eine Content Security Policy dafür kein `worker-src` braucht.
- Keinen Speicher. Er schreibt weder ein Cookie noch `localStorage`, `sessionStorage` oder IndexedDB.
- Zwei Arten von Anfragen: den Abruf von [src](#src), dessen Ursprung eine strenge Policy in `connect-src` aufführt, und das Modul einer anderen Anzeigesprache als Englisch, aus Ihrem eigenen Bundle – siehe [setLocale](#setlocale).
- Stile in Constructed Stylesheets, die ein strenges `style-src` durchlässt. Ein Browser ohne Constructed Stylesheets, etwa Firefox vor 101, bekommt stattdessen Elemente `<style>`, die `style-src 'unsafe-inline'` brauchen.
- Listener auf `window`. Der Import des Einstiegspunkts fügt für die Lebensdauer der Seite drei hinzu, für `mousedown`, `touchstart` und das eigene Ereignis `@dineug/erd-editor/internal-forward-move-start` des Pakets. Konva, das die Zeichenfläche zeichnet, setzt `window.Konva` und fügt mit seiner ersten Stage Maus- und Touch-Listener auf `window` und einen Listener für `visibilitychange` auf `document` hinzu, die es nie entfernt. Der Einstiegspunkt des Editors fügt dieselben hinzu.
- Bis [destroy](#destroy) folgt jeder Viewer dem Farbschema des Betriebssystems und beobachtet die Stile der Seite auf die Custom Properties, die [setTheme](#settheme) beschreibt.
