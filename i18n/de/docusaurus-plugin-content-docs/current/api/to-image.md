---
sidebar_position: 4
description: Ein Dokument mit toImage und den Optionen des Dialogs Export image aus eigenem Code als PNG oder SVG zeichnen, in einem Browser und, wo es einen gibt, im Export-Worker.
---

# toImage

Seit `5.0.0` exportiert der Paketstamm `toImage()`, das ein Dokument ohne Editor auf der Seite als PNG oder SVG zeichnet.  
Es schreibt die Dateien, die die Schaltflächen `PNG` und `SVG` des Dialogs [Export image](../guide/guides/file-import-export.md#image) schreiben, mit den drei Optionen des Dialogs, `Background`, `Dark mode` und `Scale`, und keinen weiteren.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` wird daneben als Typ exportiert – siehe [Einstiegspunkte](./installation.md#entry-points).

## value {#value}

Der Text des Dokuments: was eine Datei `.erd.json` enthält, der [value](./erd-editor-element.md#value) oder [runtimeValue](./erd-editor-element.md#runtimevalue) eines Editors oder jeder andere Text, den [setInitialValue](./erd-editor-element.md#setinitialvalue) lädt.  
Leerer Text oder nur Leerraum zeichnet ein leeres Diagramm, ebenso JSON, das keines der Felder eines Dokuments enthält, die der Parser mit Standardwerten füllt.

## Optionen {#options}

| Option | Standard | Beschreibung |
| --- | --- | --- |
| `format` | Keiner; sie ist erforderlich | `'png'` liefert einen `Blob` vom Typ `image/png`, `'svg'` das Markup des SVG als Zeichenkette. |
| `background` | `true` | Malt die Farbe der Zeichenfläche hinter das Diagramm. `false` lässt sie transparent, auch den Kasten unter einer Beschriftung ON DELETE oder ON UPDATE. |
| `darkMode` | `false` | Zeichnet das dunkle Design statt des hellen. |
| `scale` | `2` | `1`, `2` oder `3` Bildpixel pro Einheit des Diagramms bei 100 %. Sie bestimmt allein die Größe des PNG; ein SVG hat die Größe des Diagramms, welche Skalierung auch gilt. |

`toImage()` liest keinen anderen Schlüssel, sodass ein Schlüssel, den die Tabelle nicht aufführt, nichts ändert.

## Was gezeichnet wird {#what-it-draws}

Das Bild ist das, das der Dialog zeichnet:

- Das ganze Diagramm, zugeschnitten auf das, was es zeichnet, plus einen Rand und immer bei 100 %, mit welchem Zoom das Dokument auch gespeichert wurde, sodass jede Tabelle vollständig gezeichnet wird. Was [View Option](../guide/guides/table-related-functions.md#table-view-options) im Dokument ausblendet, wird weder gezeichnet noch bekommt es Platz, Tabellengruppen werden hinter allem anderen gezeichnet, und die Farben, die die [Prüfungen des Wörterbuchs](../guide/guides/dictionary.md#marks-on-the-canvas) Namen geben, werden nicht gezeichnet.
- Ein PNG hat die Größe des Diagramms bei 100 % mal `scale`. Eines, das für eine Browser-Canvas zu groß ist, wird mit verringerter Auflösung geschrieben, statt zu scheitern, und `toImage()` sagt das nicht.
- Ein SVG behält seinen Text als Text und nennt seine Schriften, statt sie einzubetten, sodass ein Viewer ohne die Schrift des Editors eine andere zeichnet. Schatten entfallen.

Wo der Dialog den Bildschirm des Editors nimmt, nimmt `toImage()` allein das Dokument, sodass ein Dokument auf jeder Seite gleich gezeichnet wird:

- Seine Farben sind das Preset aus dem Standardgrau und der Standardakzentfarbe des Elements, `slate` und `indigo`, hell, solange `darkMode` nicht `true` ist. Kein Design der Seite, keine Überschreibung mit [setTheme](./erd-editor-element.md#settheme) und keine Änderung in der [Designauswahl](../guide/guides/language-and-theme.md) erreicht es.
- Seine Tabellen und Spalten tragen die Namen der [Namensansicht](../guide/guides/logical-names.md#name-view), die das Dokument enthält, bei einer Datei mit eingeschalteter Sperre `Name View` also der gesperrten.
- Die Wörter, die das Diagramm selbst zeichnet, etwa der Platzhalter einer unbenannten Tabelle, sind auf Englisch.

## Wo es läuft {#where-it-runs}

`toImage()` braucht eine Browserseite, da es auf einer Canvas misst und zeichnet. Der Paketstamm, aus dem es kommt, braucht zum Laden ein DOM, sodass es von Node oder einem Web Worker aus nicht erreichbar ist – siehe [Serverseitiges Rendering](./installation.md#server-side-rendering).  
Es wartet, bis die Schriften der Seite fertig geladen sind, bevor es zeichnet.

Es zeichnet im Shared Worker des Bildexports, wo der Host einen ausführt, wie es der Dialog tut, sodass die Seite währenddessen ansprechbar bleibt, und im Hauptthread, wo es keinen gibt oder der Worker nicht rechtzeitig antwortet – siehe [Web Worker](./installation.md#web-workers).  
Ein Bundle, das `toImage` und kein Element importiert, trägt allein den Worker des Bildexports.  
Keiner der beiden Builds für das [Script-Tag](./installation.md#script-tag) trägt es: `window.ErdEditor` und `window.ErdViewer` haben kein `toImage`.

## Ablehnungen {#rejections}

Das Promise, das es zurückgibt, wird abgelehnt, bevor etwas gezeichnet wird, wenn:

- die Seite kein `document` hat: ein `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` keine Zeichenkette ist, etwa ein Dokument, das bereits zu einem Objekt geparst wurde: ein `TypeError`;
- eine Option einen Wert enthält, den die Tabelle unter [Optionen](#options) nicht aufführt, auch ein fehlendes `format`, ebenso ein `scale` von `'2'`, das mit einem SVG übergeben wird: ein `TypeError`, der die Option nennt, wie in `toImage: scale cannot be 4`;
- der Text kein Dokument ist, das der Parser lesen kann: der Fehler des Parsers, ein `SyntaxError` bei Text, der kein JSON ist.

## Dialog „Export image“ {#export-image-dialog}

Der Dialog und `toImage()` zeichnen über denselben Export, sodass sie mit denselben Optionen dasselbe Bild schreiben, aber von unterschiedlichen Ausgangspunkten ausgehen:

| | Dialog `Export image` | `toImage()` |
| --- | --- | --- |
| Dokument | Das Diagramm, wie es beim Öffnen des Dialogs war | Der Text, den Sie übergeben |
| Dark mode | Beginnt passend zum Erscheinungsbild des Editors und zeichnet, solange es passt, die eigenen Farben des Bildschirms | Aus, solange `darkMode` nicht `true` ist, und immer das Preset |
| Namensansicht | Die, die der Editor zeigt | Die, die das Dokument enthält |
| Sprache der eigenen Wörter | Die Anzeigesprache des Editors | Englisch |
| Ergebnis | Über den Browser oder den [Export-Callback](./installation.md#file-dialogs) gespeichert oder in die Zwischenablage kopiert | An Sie zurückgegeben; keiner der beiden Datei-Callbacks wird aufgerufen |

`Copy to clipboard` hat keine Entsprechung. Eine Seite, die eines möchte, schreibt den PNG-`Blob` selbst in die Zwischenablage.
