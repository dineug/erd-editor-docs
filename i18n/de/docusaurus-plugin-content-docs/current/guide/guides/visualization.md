---
sidebar_position: 10
description: Das Schema als kräftebasierten Graphen oder als Flow aus Tabellenkarten erkunden – zoomen und die Ansicht verschieben, die verbundenen Tabellen einer Tabelle hervorheben und jeweils auf wenige Tabellen fokussieren.
---

# Visualisierung

Zeigt das gesamte Dokument auf einen Blick, in einem von zwei Modi:

- `Graph`, ein kräftebasierter Graph aller Tabellen, ihrer Spalten und der Beziehungen zwischen ihnen – siehe [Graph-Modus](#graph-mode).
- `Flow`, in dem jede Tabelle als Karte gezeichnet und entlang ihrer Beziehungen angeordnet wird – siehe [Flow-Modus](#flow-mode).

Öffnen Sie die Visualisierung über die Registerkarte `Visualization` in der Symbolleiste oben oder über die [Schnellsuche](./quick-search.md) unter `Tab`.  
Auf der Registerkarte ERD öffnen `Alt + F` (Windows/Linux) oder `⌥ + F` (Mac) und der Eintrag `Focus on this table` im Kontextmenü der Tabelle sie direkt in `Flow`, eingeschränkt auf die von Ihnen gewählten Tabellen und die direkt über eine Beziehung mit ihnen verbundenen Tabellen – siehe [Auf Tabellen fokussieren](#focusing-on-tables).

Wechseln Sie den Modus mit den Schaltflächen `Graph` und `Flow` am linken Ende der [Symbolleiste](#toolbar).  
Ein neu geöffneter Editor beginnt mit `Graph`. Der gewählte Modus bleibt erhalten, solange der Editor geöffnet ist, auch über Besuche anderer Registerkarten hinweg, wird aber nicht im Dokument gespeichert.

## Symbolleiste {#toolbar}

Eine Symbolleiste schwebt mittig über dem unteren Rand der Registerkarte. Von links nach rechts:

- `Graph` und `Flow`, wobei der aktuelle Modus hervorgehoben ist.
- `Zoom out`, der aktuelle Zoom als Prozentwert, etwa `100%`, und `Zoom in`. Jedes Drücken ändert den Zoom um 4 Prozentpunkte, wobei die Bildschirmmitte an ihrem Platz bleibt. Der Prozentwert zeigt den Zoom des Modus, in dem Sie sich befinden, und ein Klick darauf setzt diesen Zoom auf `100%` zurück.
- `Fit`, das alles, was der Modus zeigt, in den Ansichtsbereich holt: jeden Knoten in `Graph`, jede Karte in `Flow`.
- `Tidy Up`, nur in `Flow`, das die Karten neu anordnet – siehe [Wie Flow die Karten anordnet](#how-flow-is-placed).
- Das Menü der Zeilenanzeige, nur in `Flow`, beschriftet mit der aktuellen Wahl – siehe [Zeilenanzeige](#row-display).
- `Show all`, nur in `Flow` und nur, solange die Ansicht eingeschränkt ist, das zum gesamten Diagramm zurückkehrt – siehe [Auf Tabellen fokussieren](#focusing-on-tables).
- Der Kompass `Go to content`, der sich nur dann am Ende der Symbolleiste einreiht, wenn kein Knoten und keine Karte auf dem Bildschirm zu sehen ist. Er zeigt einen Pfeil, der auf den nächstgelegenen Knoten oder die nächstgelegene Karte weist, sowie die Entfernung dorthin, etwa `1.2k`. Klicken Sie darauf, um diesen Knoten oder diese Karte zu zentrieren, ohne den Zoom zu ändern.

Die Zoomschaltflächen nennen ihre Tastenkombinationen in ihren Tooltips, zum Beispiel `Zoom in (Ctrl + Plus)` (Windows/Linux) oder `Zoom in (⌘ + Plus)` (Mac).  
`Ctrl + Plus` und `Ctrl + Minus` (Windows/Linux) oder `⌘ + Plus` und `⌘ + Minus` (Mac) ändern den Zoom schrittweise wie die Schaltflächen, in beiden Modi, und `Ctrl + 0` (Windows/Linux) oder `⌘ + 0` (Mac) springt direkt zurück auf `100%`.  
Der Prozentwert bewirkt beim Klicken dasselbe wie `Ctrl + 0` (Windows/Linux) oder `⌘ + 0` (Mac) und nennt diese Tastenkombination in seinem Tooltip. Die Tastenkombinationen bewirken nichts, solange die Schnellsuche geöffnet ist.

## Graph-Modus {#graph-mode}

Zeichnet das gesamte Dokument als kräftebasierten Graphen, sodass Sie auf einen Blick sehen, wie die Tabellen miteinander zusammenhängen und welche im Zentrum einer Domäne stehen.

![Graph-Modus öffnen, für die Vorschau mit dem Zeiger auf eine Tabelle zeigen, einen Knoten ziehen sowie verkleinern und wieder vergrößern](/img/demo-visualization.webp)

### Den Graphen lesen {#reading-the-graph}

Jede Tabelle und jede Spalte ist ein Knoten, und die beiden Arten werden in unterschiedlichen Farben gezeichnet. Notizen und [Tabellengruppen](./table-groups.md) werden nicht gezeichnet.  
Jeder Spaltenknoten ist mit der Tabelle verknüpft, zu der er gehört, und zwei durch eine Beziehung verbundene Tabellen sind miteinander verknüpft.  
Tabellen, die durch mehr als eine Beziehung in derselben Richtung verbunden sind, werden nur einmal verknüpft, und für eine Beziehung, die an derselben Tabelle beginnt und endet, wird keine Verknüpfung gezeichnet.

Tabellennamen erscheinen beim Vergrößern im Graphen, wobei sie zwischen `50%` und `100%` allmählich eingeblendet werden, und ein Name mit mehr als 15 Zeichen wird abgeschnitten. Spaltenknoten haben bei keiner Zoomstufe eine Beschriftung.

### Im Graphen navigieren {#getting-around-the-graph}

Das Mausrad zoomt um die Stelle, über der sich der Zeiger befindet, von `10%` bis `400%`.  
Eine Pinch-Geste auf dem Trackpad zoomt auf dieselbe Weise, und zwei Finger auf einem Touchscreen zoomen um den Punkt zwischen ihnen und verschieben die Ansicht, während sie sich bewegen.  
Ziehen Sie den Hintergrund, um die Ansicht zu verschieben, oder ziehen Sie mit der mittleren Maustaste von einer beliebigen Stelle aus, auch von einem Knoten, wie auf der [ERD-Zeichenfläche](./table-related-functions.md#getting-around-the-canvas). Ziehen mit der mittleren Maustaste verschiebt nur die Ansicht: Es bewegt nie einen Knoten.

Die Zoomschaltflächen in der [Symbolleiste](#toolbar) und die Tastenkombinationen zum Zoomen halten stattdessen die Bildschirmmitte fest, innerhalb derselben Spanne, und `Fit` holt jeden Knoten in den Ansichtsbereich.

### Hover-Vorschau {#hover-preview}

Zeigen Sie mit dem Zeiger auf einen Tabellenknoten, um neben dem Mauszeiger eine Vorschau dieser Tabelle zu sehen.  
Wenn Sie mit dem Zeiger auf einen Spaltenknoten zeigen, wird nur ein Ring um ihn gezeichnet; es öffnet sich keine Vorschau.

Die Vorschau zeigt dieselben Spalten wie die ERD-Zeichenfläche, in derselben Reihenfolge – siehe [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options) und [Spaltenreihenfolge anpassen](./settings.md#adjusting-column-order).  
Ist die Ansichtsoption `Alternate Key` eingeschaltet, trägt jede Spalte eines [Alternativschlüssels](./table-related-functions.md#alternate-keys) ihre Markierung, etwa `AK1.1`, am Ende ihrer Zeile, und die Vorschau wird dafür breiter, so wie die Tabelle auf der ERD-Zeichenfläche.  
Anders als bei einer Tabelle auf der ERD-Zeichenfläche übernimmt der Tabellenkopf der Vorschau nie die Farbe der [Gruppe](./table-groups.md#coloring-a-group), zu der die Tabelle gehört.  
Die Vorschau dient nur der Anzeige und wird ausgeblendet, während Sie einen Knoten ziehen oder die Ansicht verschieben.

### Nachbarschaft hervorheben {#highlighting-a-neighbourhood}

Wenn Sie mit dem Zeiger auf eine Tabelle zeigen, wird außerdem ihre Nachbarschaft hervorgehoben: die Tabelle selbst, ihre eigenen Spalten, die Tabellen, mit denen ihre Beziehungen sie in beliebiger Richtung verbinden, und die Verknüpfungen zwischen ihnen.  
Alles andere im Graphen verblasst, sodass alles, was die Tabelle berührt, für sich allein lesbar wird.

### Knoten verschieben {#moving-nodes}

Ziehen Sie einen Knoten mit der linken Maustaste, um ihn samt allem, was mit ihm verknüpft ist, an eine neue Position zu bewegen.  
Der Knoten bleibt unter dem Zeiger fixiert, solange Sie ihn halten, und das Layout kommt um ihn herum wieder in Bewegung.  
Wenn Sie loslassen, kommt es wieder zur Ruhe – kein Knoten bleibt dort fixiert, wo Sie ihn abgelegt haben.  
Drücken oder Ziehen mit der rechten Maustaste auf einem Knoten bewegt ihn weder, noch verschiebt es die Ansicht.

### Der Graph ist eine Momentaufnahme {#the-graph-is-a-snapshot}

Der Graph wird aus dem Dokument in seinem Zustand zum Zeitpunkt des Öffnens dieser Registerkarte aufgebaut und bei jeder Rückkehr zu ihr von Grund auf neu erstellt.  
Auch ein Wechsel von `Flow` zu `Graph` baut ihn neu auf, und jeder Neuaufbau beginnt wieder bei `100%`.

## Flow-Modus {#flow-mode}

Zeichnet jede Tabelle als Karte und ordnet die Karten entlang ihrer Beziehungen an. Notizen und [Tabellengruppen](./table-groups.md) werden nicht gezeichnet.  
Dies ist nicht das Layout `Flow` der Funktion [Automatisches Layout](./table-related-functions.md#auto-layout), die die Tabellen auf der Registerkarte ERD selbst verschiebt.

Jede Karte wird wie eine Tabelle auf der Registerkarte ERD gezeichnet: die Farbe der Tabelle entlang ihres linken Rands, ein Tabellenkopf mit einem Tabellensymbol und dem Tabellennamen, dann die Zeilen, die ihre [Zeilenanzeige](#row-display) vorsieht. Anders als eine Tabelle auf der Registerkarte ERD zeichnet eine Karte zudem eine Linie zwischen ihren Zeilen, und ihr Tabellenkopf übernimmt nie die Farbe der [Gruppe](./table-groups.md#coloring-a-group), zu der die Tabelle gehört. Karten behalten dieses Aussehen bei jeder Zoomstufe und schrumpfen nie auf ihren Namen zusammen, wie es Tabellen auf der Registerkarte ERD bei `70%` und darunter tun. Nichts auf einer Karte lässt sich bearbeiten.

Eine Verbindungslinie ist eine einzige glatte Kurve von Tabelle zu Tabelle, die unter den Karten gezeichnet wird, sodass sie hinter einer Karte verlaufen kann. Eine Beziehung von einer Tabelle zu sich selbst führt in einem Bogen um die obere rechte Ecke der Karte, wie auf der Registerkarte ERD – siehe [Verlauf der Verbindungslinien](./relationship-editing.md#connector-routing). Jede Verbindungslinie wird als dieselbe durchgezogene graue Linie gezeichnet, unabhängig davon, ob die Beziehung identifizierend ist oder nicht, mit denselben Endmarkierungen wie auf der Registerkarte ERD – siehe [Verbindungslinien lesen](./relationship-editing.md#reading-a-connector). Flow zeichnet Verbindungslinien auch dann, wenn die [Ansichtsoption](./table-related-functions.md#table-view-options) `Relationship` ausgeschaltet ist. Flow zeichnet nie die Beschriftungen `D:` und `U:` der Aktionen ON DELETE und ON UPDATE einer Beziehung und zeigt auch nicht den Tooltip, der sie ausschreibt, ganz gleich, wie die Ansichtsoption `Referential Actions` eingestellt ist.

Bei Anzeige des gesamten Diagramms werden Tabellen, die durch keine Beziehung mit einer anderen Tabelle verbunden sind, in einem Block gesammelt, statt zwischen den übrigen verstreut zu werden.

![Zu Flow wechseln, mit dem Zeiger auf orders zeigen, um sie und ihre Nachbarn hervorzuheben, die Hervorhebung fixieren, Keys only wählen, dann mit ⌘ + Wheel vergrößern und Fit drücken](/img/demo-visualization-flow.webp)

### Zeilenanzeige {#row-display}

Das Menü der Zeilenanzeige in der [Symbolleiste](#toolbar) legt fest, wie viel von jeder Karte gezeichnet wird. Seine Beschriftung ist die aktuelle Wahl, und sein Tooltip lautet zum Beispiel `Row display: Name only`.  
Das Menü öffnet sich oberhalb der Symbolleiste, mit einem Häkchen neben der aktuellen Wahl. Es schließt sich, wenn Sie eine Wahl treffen, erneut auf die Beschriftung klicken, an eine beliebige andere Stelle im Editor klicken, `Escape` drücken oder zu `Graph` wechseln.

| Zeilenanzeige | Was jede Karte zeigt |
| --- | --- |
| `Name only` | Nur den Tabellenkopf. |
| `Keys only` | Primärschlüssel- und Fremdschlüsselspalten sowie jede andere Spalte, an der eine Beziehung endet. |
| `All fields` | Alle Spalten. |

Die Zeilen werden in der Reihenfolge der Spalten der Tabelle aufgeführt. Jede Zeile zeigt den Spaltennamen, mit einem Schlüsselsymbol davor, wenn die Spalte ein Primärschlüssel, ein Fremdschlüssel oder beides ist, und rechts den Datentyp, der nur erscheint, solange die Karte [hervorgehoben](#lighting-related-tables) ist.  
Keine andere Zelle und keine Markierung eines Alternativschlüssels wird gezeichnet, und weder [Ansichtsoptionen für Tabellen](./table-related-functions.md#table-view-options) noch [Spaltenreihenfolge anpassen](./settings.md#adjusting-column-order), womit die Zellen innerhalb einer Zeile angeordnet werden, gilt für Karten.

Beim ersten Öffnen beginnt Flow mit `Name only` oder mit `Keys only`, wenn es durch das [Fokussieren auf Tabellen](#focusing-on-tables) geöffnet wurde. Danach ändert sich die Zeilenanzeige nur, wenn Sie eine andere wählen, und beim Einschränken oder Erweitern der Ansicht bleibt sie erhalten.  
Eine Änderung der Zeilenanzeige verändert die Größe der Karten, daher ordnet Flow sie neu an und passt sie in den Bildschirm ein.

### In Flow navigieren {#getting-around-the-flow}

Das Mausrad verschiebt die Ansicht, und `Shift + Wheel` verschiebt sie seitwärts. `Ctrl + Wheel` (Windows/Linux) oder `⌘ + Wheel` (Mac) zoomt, wobei die Bildschirmmitte an ihrem Platz bleibt.  
Eine Pinch-Geste auf dem Trackpad zoomt um den Punkt, an dem Sie sie ausführen, und zwei Finger auf einem Touchscreen zoomen um den Punkt zwischen ihnen und verschieben die Ansicht, während sie sich bewegen.  
Ziehen Sie den Hintergrund, um die Ansicht zu verschieben, oder ziehen Sie mit der mittleren Maustaste von einer beliebigen Stelle aus, auch von einer Karte. Ziehen mit der mittleren Maustaste verschiebt nur die Ansicht und lässt die Auswahl unverändert. Das Verschieben ist unbegrenzt, wie auf der [ERD-Zeichenfläche](./table-related-functions.md#getting-around-the-canvas).  
Der Zoom reicht von `10%` bis `150%`. Flow hat einen eigenen Zoom und eine eigene Ansichtsposition, getrennt von denen der Registerkarte ERD, und keines von beiden wird im Dokument gespeichert.

Drücken auf den Hintergrund hebt die Auswahl auf, und `Ctrl + drag` (Windows/Linux) oder `⌘ + drag` (Mac) auf dem Hintergrund zieht einen Auswahlrahmen auf.  
Flow hat keine Minimap und keine Scrollleisten. Wenn nach dem Verschieben keine Karte mehr auf dem Bildschirm zu sehen ist, verwenden Sie den Kompass `Go to content` in der [Symbolleiste](#toolbar).

### Verbundene Tabellen hervorheben {#lighting-related-tables}

Zeigen Sie mit dem Zeiger auf eine Karte, um sie, die direkt über eine Beziehung mit ihr verbundenen Tabellen und die Verbindungslinien zwischen ihr und diesen Tabellen hervorzuheben. Eine Verbindungslinie zwischen zwei dieser Tabellen bleibt nicht hervorgehoben.  
Eine hervorgehobene Karte erhält einen Rahmen und ein Leuchten in der Akzentfarbe, ihre Datentypen werden eingeblendet, und ihre Zeilen, an denen eine Beziehung endet, werden farbig hinterlegt. Eine hervorgehobene Verbindungslinie nimmt die Akzentfarbe an.  
Anders als in [Graph](#highlighting-a-neighbourhood) verblasst nichts anderes, und nichts ist hervorgehoben, solange auf keine Karte gezeigt wird und keine fixiert ist.

Klicken Sie auf eine Karte, um ihre Hervorhebung zu fixieren, sodass sie hervorgehoben bleibt, wenn der Zeiger weiterwandert. Klicken Sie erneut auf dieselbe Karte oder auf den Hintergrund, um sie zu lösen; ein Klick auf eine andere Karte verlegt die Fixierung dorthin. Die Karte unter dem Zeiger und die fixierte Karte werden gemeinsam hervorgehoben.  
Ziehen, `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac), das Verschieben der Ansicht und die [Kartenschaltflächen](#card-buttons) fixieren eine Karte weder, noch lösen sie sie.

Partikel laufen entlang jeder hervorgehobenen Verbindungslinie, vom Ende an der Elterntabelle, wo der Primärschlüssel liegt, zum Ende an der Kindtabelle. Wenn mehr als 60 Verbindungslinien gleichzeitig hervorgehoben sind, halten die Partikel an, und die Hervorhebung bleibt.

### Kartenschaltflächen {#card-buttons}

Solange sich der Zeiger über einer Karte befindet, erscheinen am rechten Ende ihres Tabellenkopfs zwei Symbolschaltflächen, beide ohne Tooltip:

- Das Wegpunktsymbol, dasselbe, das die Schaltfläche `Flow` zeigt, schränkt Flow auf diese Tabelle und die direkt über eine Beziehung mit ihr verbundenen Tabellen ein – siehe [Auf Tabellen fokussieren](#focusing-on-tables).
- Das Symbol für externe Links wechselt zur Registerkarte ERD, wählt nur diese Tabelle aus, holt sie in den Vordergrund und setzt die fokussierte Zelle auf ihren Namen, sofern nicht bereits eine Zelle dieser Tabelle den Fokus hat. Die Zeichenfläche scrollt nur dann zur Tabelle, wenn diese nicht bereits gut zu sehen ist – siehe [Wohin ein Sprung führt](./table-related-functions.md#where-a-jump-lands). Es beginnt oder beendet nie das Zeichnen einer Beziehung.

Ein Drücken auf eine der beiden Schaltflächen gilt nur der Schaltfläche: Anders als ein Drücken an einer anderen Stelle der Karte wählt es die Karte nicht aus und holt sie nicht in den Vordergrund. Die Wegpunktschaltfläche lässt Ihre bisherige Auswahl daher unverändert; die Schaltfläche für externe Links wählt die Tabelle nur im Rahmen ihres Wechsels zur Registerkarte ERD aus. Beide Schaltflächen reagieren nur auf einen Linksklick.

### Karten verschieben {#moving-cards}

Ziehen Sie eine Karte mit der linken Maustaste an einer beliebigen Stelle außer den beiden Kartenschaltflächen; Ziehen mit der rechten Maustaste bewegt nichts.  
Drücken auf eine Karte wählt sie aus, `Ctrl + click` (Windows/Linux) oder `⌘ + click` (Mac) fügt sie der Auswahl hinzu, und das Ziehen einer ausgewählten Karte verschiebt alle ausgewählten Karten. Die Auswahl ist dieselbe, die die Registerkarte ERD verwendet, sodass das, was Sie hier auswählen, noch ausgewählt ist, wenn Sie zurückwechseln.

Eine Karte bewegt sich nur in Flow: Die zugehörige Tabelle bleibt auf der Registerkarte ERD, wo sie ist.  
Eine verschobene Karte bleibt beim Verschieben der Ansicht, beim Zoomen und bei `Fit` an ihrem Platz. Sie kehrt an die Stelle zurück, an die das Layout sie gesetzt hat, wenn Sie die Registerkarte verlassen oder zu `Graph` wechseln und zurückkehren, und wenn `Show all` zu einem Layout des gesamten Diagramms zurückkehrt, das Flow bereits hat. Ein neues Layout platziert sie erneut und berücksichtigt dabei, wo Sie sie abgelegt haben – siehe [Wie Flow die Karten anordnet](#how-flow-is-placed).

### Auf Tabellen fokussieren {#focusing-on-tables}

Wählen Sie auf der Registerkarte ERD eine oder mehrere Tabellen aus und drücken Sie `Alt + F` (Windows/Linux) oder `⌥ + F` (Mac), oder klicken Sie mit der rechten Maustaste auf eine Tabelle und wählen Sie `Focus on this table`.  
Die Registerkarte Visualisierung öffnet sich in `Flow`, eingeschränkt auf diese Tabellen und jede Tabelle, die mit einer von ihnen direkt über eine Beziehung verbunden ist, in beliebiger Richtung. Nur die Verbindungslinien zwischen den angezeigten Tabellen werden gezeichnet.

Ist die Tabelle, auf die Sie mit der rechten Maustaste klicken, eine von mehreren ausgewählten Tabellen, lautet der Eintrag `Focus on selected tables` und fokussiert auf die gesamte Auswahl. Ein Rechtsklick auf eine Tabelle außerhalb der Auswahl fokussiert nur auf diese Tabelle.  
`Alt + F` übernimmt die ausgewählten Tabellen und lässt Notizen und [Tabellengruppen](./table-groups.md) außen vor. Ist keine Tabelle ausgewählt, bewirkt es nichts, auch wenn eine Gruppe ausgewählt ist: Wählen Sie zuerst `Select tables` im Kontextmenü der Gruppe – siehe [Gruppen auswählen](./table-groups.md#selecting-groups).  
Die Tastenkombination wird ignoriert, während eine Zelle, eine Notiz oder der Name einer Gruppe bearbeitet wird, während der Tastaturfokus im [Explorer](./explorer.md#keys-in-the-explorer) liegt oder während die Schnellsuche, die Tabelleneigenschaften, die Diff-Ansicht, die Vorschau des Automatischen Layouts, die Zeitreise, der Dialog [`Export image`](./file-import-export.md#image) oder [`Map Columns`](./relationship-editing.md#map-columns) geöffnet ist.

Innerhalb von Flow schränkt die [Kartenschaltfläche](#card-buttons) mit dem Wegpunktsymbol die Ansicht auf dieselbe Weise ein, auf diese eine Tabelle. `Show all` in der [Symbolleiste](#toolbar) kehrt zum gesamten Diagramm zurück.  
Eine eingeschränkte Ansicht wird eigenständig angeordnet und in den Bildschirm eingepasst. Sie bleibt eingeschränkt, wenn Sie die Registerkarte verlassen oder zu `Graph` wechseln und zurückkehren, und `Escape` erweitert sie nicht.

![Mit ⌥ + F auf orders fokussieren, mit der Wegpunktschaltfläche ihrer Karte auf members einschränken, dann Show all](/img/demo-visualization-focus.webp)

### Wie Flow die Karten anordnet {#how-flow-is-placed}

Wenn `Flow` zum ersten Mal angezeigt wird, werden die angezeigten Tabellen außerhalb des Hauptthreads angeordnet, und das Ergebnis wird in den Bildschirm eingepasst.  
Das Layout bleibt erhalten, solange der Editor geöffnet ist. Wenn Sie die Registerkarte verlassen oder zu `Graph` wechseln und zurückkehren, verwendet Flow es wieder, mit Zoom und Ansichtsposition so, wie Sie sie zurückgelassen haben.  
Flow behält ein Layout für das gesamte Diagramm und eines für die eingeschränkte Ansicht, sodass `Show all` zum Layout des gesamten Diagramms zurückkehrt und es in den Bildschirm einpasst, ohne es neu zu berechnen, solange sich nichts von dem geändert hat, woraus dieses Layout erstellt wurde.

Flow ordnet die Karten in folgenden Fällen neu an:

- Sie drücken `Tidy Up`. Das Ergebnis wird in den Bildschirm eingepasst.
- Sie ändern die Zeilenanzeige oder schränken die Ansicht auf andere Tabellen ein. Das Ergebnis wird in den Bildschirm eingepasst.
- Tabellen oder Beziehungen werden hinzugefügt oder entfernt – auf der Registerkarte ERD, während Sie nicht hier sind, und bei Ihrer Rückkehr übernommen, oder von einem Mitbearbeiter, während Sie in Flow sind. Zoom und Ansichtsposition bleiben, wie sie sind.

Jedes Layout berücksichtigt, wo die Karten gerade stehen, daher stellt `Tidy Up` nicht unbedingt eine frühere Anordnung wieder her.  
Eine Änderung, die nur die Größe einer Karte beeinflusst, etwa das Umbenennen einer Tabelle oder das Hinzufügen einer Spalte, ordnet die Karten nicht neu an. Drücken Sie `Tidy Up`, wenn sich Karten dadurch überlappen.

Dauert ein Layout länger als 6 Sekunden, erscheint ein Hinweis `Placing tables` mit einer sich drehenden Ladeanzeige und `Cancel`.  
`Cancel` oder `Escape` zu einem beliebigen Zeitpunkt, während das Layout läuft, verwirft es; `Tidy Up` oder die Rückkehr zu `Flow` fordert es erneut an.  
Schlägt ein Layout fehl – der Host führt keinen Shared Worker aus, der Worker startet nicht oder innerhalb von 60 Sekunden kommt kein Layout zurück –, zeigt Flow einen Hinweis `Could not place tables` mit einem Warnsymbol, und `Tidy Up` versucht es erneut. Siehe [Web Worker](../../api/installation.md#web-workers).  
Flow zeichnet nur die Tabellen, die sein letztes Layout platziert hat, bei Anzeige des gesamten Diagramms ebenso wie in einer eingeschränkten Ansicht, sodass beim ersten Anzeigen möglicherweise gar keine Karten zu sehen sind, bis ein Layout gelingt.  
Immer wenn Flow die Karten neu anordnet, etwa wenn Sie die Ansicht auf andere Tabellen einschränken, bleibt die vorherige Anordnung auf dem Bildschirm, bis das neue Layout eintrifft, und sie bleibt dort, wenn dieses Layout abgebrochen wird oder fehlschlägt.

Wenn das gesamte Dokument ersetzt wird, zum Beispiel durch den Import einer Datei, werden die Layouts, der Fokus, die Zeilenanzeige, der Zoom und die Ansichtsposition von Flow verworfen, und beim nächsten Öffnen beginnt Flow neu wie beim ersten Mal: mit dem gesamten Diagramm oder eingeschränkt, wenn Sie Flow durch das [Fokussieren auf Tabellen](#focusing-on-tables) öffnen.

### Flow ändert das Dokument nie {#flow-never-edits-the-document}

Flow liest das Diagramm nur. Zoomen, Verschieben der Ansicht, Verschieben von Karten, `Tidy Up`, die Zeilenanzeige, Fixierungen und Fokussieren fügen dem [Verlauf](./undo-redo.md#what-the-history-records) nichts hinzu.  
Sie ändern auch nichts am Diagramm. Das Drücken auf eine Karte holt zwar ihre Tabelle in den Vordergrund, genau wie ein Klick auf eine Tabelle auf der Registerkarte ERD, sodass sie auch dort vorn liegt, aber die Stapelreihenfolge wird nicht gespeichert – siehe [Mehrere Tabellen verschieben](./table-related-functions.md#moving-multiple-tables). `Graph` lässt das Diagramm auf dieselbe Weise unberührt.  
Das Drücken auf eine Karte fügt nie eine Beziehung hinzu. Haben Sie die Registerkarte ERD verlassen, während Sie eine zeichneten, wählt ein Drücken auf eine Karte deren Tabelle als Ausgangspunkt, wenn noch keine gewählt wurde, und beendet andernfalls das Zeichnen.  
Die [Kartenschaltfläche](#card-buttons) für externe Links geht weiter, weil sie Sie aus Flow herausführt: Wenn die Registerkarte ERD zur Tabelle scrollen muss, wird dieser Bildlauf wie jede andere Änderung der Ansichtsposition aufgezeichnet.

Änderungen von Mitbearbeitern erreichen das Diagramm weiterhin, während Sie in Flow sind, und die Karten folgen den Tabellen und Beziehungen, die diese hinzufügen oder entfernen – siehe [Wie Flow die Karten anordnet](#how-flow-is-placed).  
Deren Auswahl- und Fokusringe werden auf den Karten gezeichnet, ihre Mauszeiger und Auswahlrahmen jedoch nicht – siehe [Gemeinsame Bearbeitung](../../api/advanced/collaborative-editing.md).

Beide Modi, einschließlich des Fokussierens, funktionieren auch in einem Editor mit `readonly`.
