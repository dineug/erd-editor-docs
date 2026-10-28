---
sidebar_position: 18
description: Ein Diagramm ohne Code schreibgeschützt auf einer anderen Website zeigen, indem Sie erd-editor.io/embed einbinden, im Builder seine URL und seine iframe-Zeile erzeugen, Design, Sprache, Namensansicht, Minimap, Steuerleiste und Farben in der URL festlegen und die Datei von GitHub oder einem Server ausliefern, der CORS erlaubt.
---

# Einbetten

[erd-editor.io/embed](https://erd-editor.io/embed) zeigt ein Diagramm schreibgeschützt in einem Viewer, der die Seite ausfüllt, damit eine andere Website ihn einbinden kann: ein Wiki, ein Blog, ein Website-Baukasten oder jede Seite, die kein eigenes Skript laden kann.  
Sein Parameter `src` nennt das Dokument, die Adresse einer Datei, wie ERD Editor sie speichert, etwa einer Datei `.erd.json`. Der Rest der URL legt fest, wie der Viewer es zeigt, und der Builder unter derselben Adresse schreibt die URL und ihre iframe-Zeile für Sie.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Dieser Frame zeigt [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) aus dem Repository von erd-editor, und das ist die Zeile, die ihn in eine Seite einsetzt:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Was der Frame zeigt {#what-the-frame-shows}

Der Frame zeigt die Tabellen, Spalten, Beziehungen, Notizen und Tabellengruppen des Diagramms, und nichts darin bearbeitet das Diagramm oder die Datei.  
Das Diagramm wird beim Laden an den Frame angepasst, unabhängig davon, welchen Zoom und welche Scrollposition die Datei gespeichert hat; die Größe des Frames bestimmt also den Zoom, mit dem er sich öffnet.

Über der Zeichenfläche liegen:

- Die Minimap, solange das Diagramm Inhalt hat.
- Die Steuerleiste am unteren Rand: `Zoom out`, die Zoomstufe, die beim Klicken den Zoom zurücksetzt, `Zoom in`, `Fit`, die Liste `Name View` und `Go to content`, solange nichts vom Diagramm auf dem Bildschirm zu sehen ist.
- Der Link `erd-editor.io` unten rechts, der erd-editor.io in einem neuen Tab öffnet und keinen Referrer sendet, sodass der Klick der Website nichts über das Dokument verrät, das der Frame zeigt. In einem schmalen Frame kann er einen Teil der Steuerleiste verdecken.

Solange die Datei lädt, zeigt der Frame `Loading diagram`. Kann sie nicht abgerufen werden oder enthält sie kein Dokument, zeigt der Frame ein leeres Diagramm mit `Couldn't load the diagram` – siehe [Dateien auf GitHub](#files-on-github) und [Dateien auf anderen Servern](#files-on-other-servers).

Der Frame richtet sich allein nach seiner URL und dem System des Besuchers. Die eigene Sprache und das eigene Design eines Besuchers auf erd-editor.io gelten in ihm nicht.

## Der Builder {#the-builder}

Öffnen Sie [erd-editor.io/embed](https://erd-editor.io/embed) ohne `src`, um den Builder zu erhalten, eine Seite mit dem Titel `Embed a diagram`:

1. Fügen Sie die Adresse des Dokuments in `Document URL` ein. Sie wird übernommen, wenn Sie `Enter` drücken oder das Feld verlassen, sodass Tippen nichts abruft. Sobald sie übernommen ist, nennt eine Zeile `Loads from` unter dem Feld die Adresse, die der Viewer abruft: die, die Sie angegeben haben, oder, bei einer Seite auf GitHub, ihre Adresse auf dem Raw-Host von GitHub – siehe [Dateien auf GitHub](#files-on-github).
2. Wählen Sie die Optionen. Jede wirkt sofort auf die Vorschau, die URL und die iframe-Zeile:
   - `Theme`: `System`, `Light` oder `Dark`.
   - `Display Language`: `System`, daneben die Sprache, für die es in Ihrem Browser steht, dann die 25 Sprachen, jede unter ihrem eigenen Namen.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` oder `Both Names`. `As Saved` zeigt die Namensansicht, die die Datei gespeichert hat.
   - `Accent color` und `Gray color`, jeweils mit Namen und einem Farbmuster aufgelistet.
   - `Minimap` und `Controls`, zwei Schalter, beide eingeschaltet.
   - `Height` in Pixeln, anfangs `480`. Eine Höhe, die keine positive ganze Zahl ist, zählt als `480`.
3. Prüfen Sie die `Preview`: den Viewer, wie der Frame ihn zeigen wird, mit dem Link `erd-editor.io`, in einem Feld, das so hoch ist wie `Height`. Seine Sprache `System` ist die Ihres Browsers, in welcher Sprache erd-editor.io selbst auch angezeigt wird.
4. Kopieren Sie das Ergebnis. `Embed URL` ist die Adresse des Frames und `Embed code` die iframe-Zeile mit der eingestellten Höhe und der Breite `100%`. Jede hat eine Schaltfläche `Copy`, die deaktiviert bleibt, bis eine Dokument-URL übernommen ist, und die nach dem Kopieren einen Moment lang `Copied` zeigt, bis eine Änderung das Kopierte neu schreibt.

Das Leeren von `Document URL` leert die Vorschau und die beiden Ergebnisse, sobald es übernommen ist.

## URL-Parameter {#url-parameters}

| Parameter | Werte | Standard |
| --- | --- | --- |
| `src` | Die Adresse des Dokuments, URL-kodiert. | Keiner: Ohne ihn oder mit einem leeren ist die Seite der Builder. |
| `theme` | `light`, `dark` oder `system`. | `system`: der helle oder dunkle Modus, den der Browser des Besuchers meldet. |
| `locale` | `system` oder ein Code aus der [Sprachtabelle](./language-and-theme.md#display-language), etwa `de-DE`. | `system`: die Browsersprachen des Besuchers, so abgeglichen, wie [System](./language-and-theme.md#what-system-follows) sie abgleicht, und Englisch, wenn der Viewer keine davon hat. |
| `name-view` | `physical`, `logical` oder `both`. | Die Namensansicht, die die Datei gespeichert hat. |
| `minimap` | `false` blendet die Minimap aus. | Angezeigt. |
| `controls` | `false` blendet die Steuerleiste aus. | Angezeigt. |
| `accent-color` | Eine der 26 Akzentfarben der [Designauswahl](./language-and-theme.md#theme), etwa `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` oder `sand`. | `slate` |

Die Standardwerte sind die des Viewers, nicht die der Web-App, die mit `jade` und `olive` beginnt.

- Der Builder lässt jede Option mit ihrem Standardwert aus der URL weg, sodass eine Embed-URL nur enthält, was abweicht.
- Ein Wert, den der Viewer nicht annimmt, wird ignoriert, und seine Option behält den Standardwert. Werte werden genau so abgeglichen, wie sie aufgelistet sind, daher wird `theme=Dark` ignoriert, und `minimap` und `controls` bleiben bei jedem Wert außer `false` angezeigt.
- Ein Parameter, der zweimal angegeben wird, nimmt seinen ersten Wert.
- `src` ist URL-kodiert, wie der Builder es schreibt, da eine Adresse mit einem eigenen `&` oder `#` sonst abgeschnitten wird.

## Dateien auf GitHub {#files-on-github}

Eine Datei oder ein Gist auf GitHub kann mit der Adresse angegeben werden, die ihre Seite zeigt, wie beim Frame oben. Der Viewer ruft sie stattdessen vom Raw-Host von GitHub ab, der die Anfrage einer anderen Website beantwortet, wo die eigene Adresse der Seite es nicht tut:

- Die Seite einer Datei, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, oder ihre `raw`-Adresse, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, wird von `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>` geladen. `<ref>` ist ein Branch, ein Tag oder ein Commit: Ein Branch zeigt die Datei, wie dieser Branch sie hat, und ein Tag oder ein Commit behält diese Version.
- Die Seite eines Gists, `https://gist.github.com/<user>/<id>`, wird von `https://gist.githubusercontent.com/<user>/<id>/raw` geladen, der ersten Datei des Gists. Belassen Sie das Diagramm als einzige Datei des Gists.

Die Embed-URL behält die Adresse, die Sie angegeben haben, und die Zeile `Loads from` des Builders zeigt die abgerufene.  
Das funktioniert nur bei öffentlichen Repositorys und öffentlichen Gists. Der Raw-Host speichert jede Datei fünf Minuten im Cache, sodass eine Änderung, die Sie pushen, so lange brauchen kann, bis sie im Frame erscheint.

## Dateien auf anderen Servern {#files-on-other-servers}

Der Viewer auf erd-editor.io ruft die Datei mit einem einfachen `GET` aus dem Browser des Besuchers ab, daher muss der Server, der sie hält, diese Cross-Origin-Anfrage erlauben (CORS): Seine Antwort braucht einen Header `Access-Control-Allow-Origin`, der `https://erd-editor.io` erlaubt, etwa `*`.  
Die Anfrage trägt keine Cookies, daher muss die Datei ohne Anmeldung lesbar sein.  
Ohne diesen Header oder bei einer Adresse, die mit einem Fehler oder mit etwas anderem als einem ERD-Editor-Dokument antwortet, zeigt der Frame `Couldn't load the diagram`.

## Im Frame {#in-the-frame}

Der Frame nimmt kein Mausrad, keine Geste und keine Taste an, bis ein Besucher ihn anklickt oder antippt oder ihn mit `Tab` erreicht. Bis dahin scrollen oder zoomen das Mausrad, eine Wischgeste und ein Pinch die Seite um ihn herum wie gewohnt.  
Sobald er den Fokus hat, verschiebt das Mausrad das Diagramm, `Ctrl + Wheel` (Windows/Linux) oder `⌘ + Wheel` (Mac) und ein Pinch zoomen es, und `Ctrl + K` (Windows/Linux) oder `⌘ + K` (Mac) öffnet eine Suche über das Dokument, in der `#` eine Tabelle, `@` eine Spalte und `:` einen Kommentar oder eine Notiz findet.  
Ein Ziehen verschiebt das Diagramm, ob der Frame den Fokus hat oder nicht, und ein Klick oder Tippen bringt Beziehungen zum Leuchten: die der angeklickten Tabelle oder die eine angeklickte Beziehung. Die Tabelle, auf der der Zeiger ruht, bringt ihre eigenen zum Leuchten. Alle Tasten stehen unter [Fokus und Tasten](../../api/erd-viewer-element.md#focus-and-keys).

Um es an einem größeren Diagramm auszuprobieren, mit Zoomen und Suchen, öffnen Sie das [Beispiel bookstore](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), neun Tabellen und zwei Tabellengruppen, auf einer eigenen Seite.

## Analytics {#analytics}

erd-editor.io zählt Besuche des Frames mit Google Analytics, wie es Besuche der Web-App zählt. Die Adresse, die es für einen Frame erfasst, ist allein `erd-editor.io/embed`, ohne die Dokumentadresse, die `src` nennt.  
Siehe die [Datenschutzerklärung](https://erd-editor.io/privacy).

## Den Viewer selbst laden {#loading-the-viewer-yourself}

Eine Seite, die Skripte laden kann, kann ein Diagramm stattdessen mit dem Element [`<erd-viewer>`](../../api/erd-viewer-element.md) aus dem Paket `@dineug/erd-editor` zeigen. Es nimmt dieselben Optionen als Attribute und Methoden an, sendet keine Anfrage an erd-editor.io und kann ein Dokument von der eigenen Website der Seite laden, was kein CORS braucht.
