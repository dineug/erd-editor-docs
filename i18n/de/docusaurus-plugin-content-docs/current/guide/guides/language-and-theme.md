---
sidebar_position: 17
description: Die 25 Anzeigesprachen des Editors, die Anordnung von rechts nach links, die Erscheinungsbilder System, Light und Dark der Designauswahl und ihre Farben sowie der Ort, an dem jeder Host sie speichert.
---

# Sprache und Design

Der eigene Text des Editors liegt in 25 Sprachen vor, und sein Aussehen ist ein Design: ein Erscheinungsbild (`System`, `Light` oder `Dark`), ein Grauton und eine Akzentfarbe.  
Beides gehört zu der Person, die den Editor verwendet, nicht zum Diagramm. Keines von beiden wird in der Datei gespeichert, im [Verlauf](./undo-redo.md) aufgezeichnet oder mit Mitbearbeitern geteilt, sodass jede Person ihre eigene Wahl sieht, und eine Änderung an einem von beiden markiert eine Datei nie als geändert.

Keines von beiden befindet sich auf der Registerkarte [Einstellungen](./settings.md). Die Symbolleiste hat eine Schaltfläche `Theme` und direkt danach eine Schaltfläche `Display Language`, beide hinter der Schaltfläche [`Explorer`](./explorer.md). Die [Schnellsuche](./quick-search.md) listet `Theme` und `Display Language` auf jeder Registerkarte auf.  
Die Web-App, Google Drive, VS Code, JetBrains-IDEs und Obsidian bieten beides an und merken sich Ihre Wahl – siehe [In den einzelnen Hosts](#in-each-host). Beides funktioniert auch in einem schreibgeschützten Editor.

## Anzeigesprache {#display-language}

Die Sprache gilt für den eigenen Text des Editors: Tooltips der Symbolleiste, die Schaltfläche [`Name View`](./logical-names.md#switching-the-view) auf der Symbolleiste der Zeichenfläche und auf der Symbolleiste von Flow, das Menü der Zeilenanzeige von Flow, Kontextmenüs, die Schnellsuche, Bereiche und Dialoge, die Registerkarte [Wörterbuch](./dictionary.md) (ihre Blattnamen, Spaltenköpfe, Werkzeuge, ihr Menü, ihre Statuszeile und die Prüfungsarten, die das Blatt `Checks` auflistet), die Registerkarte Einstellungen, den [Willkommensbildschirm](./editing-start.md#welcome-screen), Meldungen und Nachrichten sowie den Platzhalter, den ein leerer Name, logischer Name oder Datentyp, eine leere Domäne oder ein leerer Standardwert oder Kommentar auf der Zeichenfläche und in einem exportierten Bild zeigt.  
Folgendes bleibt in jeder Sprache so, wie es geschrieben ist: Ihre Tabellen- und Spaltennamen, [logischen Namen](./logical-names.md), Kommentare und Notizen; die Wörter, Begriffe und Domänen, die Sie auf der Registerkarte Wörterbuch pflegen; Datenbanksysteme, die Sprachen des Codegenerators und Dateiformate; Datentypen, SQL-Schlüsselwörter und die Aktionen für `ON DELETE` und `ON UPDATE`; die Optionen `Create`, `If not exists`, `Drop & re-create`, `USE` und `CREATE + USE` von Schema SQL; die Markierungen `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` und `AK1.1`; die Statusbuchstaben `A`, `M`, `D`, `R` und `~` der [Diff-Ansicht](./table-related-functions.md#diff-viewer); die Auswahlmöglichkeiten für die Schreibweise und für `Bracket` außer `None`; die Namen der Tasten; die Farbnamen der Designauswahl; generiertes SQL und generierter Code; die Kopfzeile einer exportierten CSV-Datei des Wörterbuchs sowie die Namen exportierter Dateien.

Auf der Registerkarte Wörterbuch ordnet eine Sortierung die Zeilen in der alphabetischen Reihenfolge der Anzeigesprache, und die Suche des Blatts `Checks` gleicht dessen Zellen so ab, wie sie in der Anzeigesprache lauten – siehe [Sortieren](./dictionary.md#sorting) und [Suchen](./dictionary.md#searching).

Die Sprachen in der Reihenfolge, in der die Sprachauswahl sie auflistet:

| In der Sprachauswahl | Sprache | Code |
| --- | --- | --- |
| Bahasa Indonesia | Indonesisch | `id-ID` |
| Deutsch | Deutsch | `de-DE` |
| English | Englisch | `en` |
| Español | Spanisch | `es-ES` |
| Euskara | Baskisch | `eu-ES` |
| Français | Französisch | `fr-FR` |
| Italiano | Italienisch | `it-IT` |
| Nederlands | Niederländisch | `nl-NL` |
| Polski | Polnisch | `pl-PL` |
| Português | Portugiesisch | `pt-PT` |
| Português Brasileiro | Brasilianisches Portugiesisch | `pt-BR` |
| Română | Rumänisch | `ro-RO` |
| Slovenčina | Slowakisch | `sk-SK` |
| Slovenščina | Slowenisch | `sl-SI` |
| Svenska | Schwedisch | `sv-SE` |
| Türkçe | Türkisch | `tr-TR` |
| Русский | Russisch | `ru-RU` |
| Українська | Ukrainisch | `uk-UA` |
| עברית | Hebräisch | `he-IL` |
| العربية | Arabisch | `ar-SA` |
| فارسی | Persisch | `fa-IR` |
| 日本語 | Japanisch | `ja-JP` |
| 简体中文 | Vereinfachtes Chinesisch | `zh-CN` |
| 繁體中文 | Traditionelles Chinesisch | `zh-TW` |
| 한국어 | Koreanisch | `ko-KR` |

Der Eintrag `Language`, den die Schnellsuche auf der Registerkarte Codegenerator anbietet, und die Zeile `Language` der Liste [Sperren](./settings.md#lock) auf der Registerkarte Einstellungen sind die [Zielsprache des Codegenerators](./code-generator.md#language), nicht die Anzeigesprache.

### Sprache auswählen {#picking-a-language}

Die Schaltfläche `Display Language` (ein Sprachensymbol) öffnet die Sprachauswahl `Display Language`, einen Bereich mit dem Titel `Display Language` unterhalb der Symbolleiste, über der gerade geöffneten Registerkarte.  
`System` kommt zuerst, daneben die Sprache, für die es gerade steht, und bleibt sichtbar, während die Liste gescrollt wird. Es folgen die 25 Sprachen, jede unter ihrem eigenen Namen, und ein Häkchen markiert die geltende Option.

![Die Anzeigesprache über die Symbolleiste auf 한국어 umstellen, dann auf العربية, das die Symbolleiste spiegelt, nicht aber das Diagramm, und zurück auf System](/img/demo-display-language.webp)

Der Bereich öffnet sich mit dem Tastaturfokus auf der Zeile mit dem Häkchen:

- `↑` und `↓` bewegen sich zyklisch durch die Zeilen, und `Home` und `End` springen zur ersten und zur letzten Zeile.
- `Enter` oder `Space` wählt die fokussierte Zeile aus, wie ein Klick.

Eine Wahl wirkt sofort, schließt den Bereich und gibt den Tastaturfokus an den Editor zurück.

Schließen Sie die Sprachauswahl, ohne etwas zu wählen, mit `Escape`, mit der Schaltfläche `x` neben dem Titel, deren Tooltip `Close (ESC)` lautet, mit einem Druck an einer beliebigen Stelle im Editor außerhalb des Bereichs, außer auf der Symbolleiste, oder erneut mit der Schaltfläche `Display Language`.  
Das Öffnen der Sprachauswahl schließt die Designauswahl und die Tabelleneigenschaften. Ein geöffneter [Explorer](./explorer.md#dialogs-beside-it) bleibt geöffnet, und in einer Sprache mit Schreibrichtung von links nach rechts steht die Sprachauswahl direkt neben ihm statt über ihm.  
Das Öffnen der Schnellsuche oder der Designauswahl schließt sie, ebenso `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac). Diese Tastenkombination öffnet den [Explorer](./explorer.md#opening-and-closing) mit seiner Suche oder hält den Explorer, wenn er bereits geöffnet ist, geöffnet und bringt den Tastaturfokus in sein Suchfeld. Die Schaltfläche `Explorer` der Symbolleiste lässt die Sprachauswahl geöffnet.

Solange der Bereich den Tastaturfokus hat, funktionieren einige Tastenkombinationen des Editors weiterhin: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` und `Zoom Reset` – siehe [Tastenkombinationen](./settings.md#shortcuts). Alle anderen Tastenkombinationen des Editors, die Pfeiltasten und `Tab` gelangen nicht über den Bereich hinaus, sodass der Editor nicht auf sie reagiert. Tasten, die der Editor nicht belegt, etwa die Tastenkombination des Hosts zum Speichern, erreichen den Host wie gewohnt.

In der [Schnellsuche](./quick-search.md) listet der Befehl `Display Language` die Option `System` und die 25 Sprachen auf, mit einem Häkchen an der geltenden Option. Eine Sprache wird dort auch über ihren englischen Namen oder ihren Code gefunden, daher findet `german` oder `de-DE` den Eintrag `Deutsch`.

### Wonach sich System richtet {#what-system-follows}

In der Web-App, in Google Drive, VS Code, JetBrains-IDEs und Obsidian steht die Sprache anfangs auf `System`. Diese Option richtet sich nach der Sprache des Hosts:

- In der Web-App, in Google Drive und auf Ihrer eigenen Seite: die bevorzugten Sprachen des Browsers. Eine Änderung daran wird sofort übernommen.
- In VS Code: die Anzeigesprache von VS Code.
- In einer JetBrains-IDE: die Sprache, in der die IDE ihre eigene Oberfläche anzeigt.
- In Obsidian: die Sprache von Obsidian.

`System` nimmt die erste dieser Sprachen, die der Editor unterstützt, und Englisch, wenn er keine davon unterstützt.  
Eine regionale Variante zählt als ihre Sprache, daher ergibt `de-AT` Deutsch und `fr-CA` Français. Chinesisch richtet sich nach der Schrift: Eine traditionelle Schrift ergibt 繁體中文 und jede andere Schrift 简体中文. Ist keine Schrift angegeben, ergibt Taiwan, Hongkong oder Macau 繁體中文 und anderes Chinesisch 简体中文. Portugiesisch ergibt Português Brasileiro, außer wenn eine andere Region als Brasilien angegeben ist, daher ergibt `pt-PT` Português; auch das Portugiesisch von Obsidian ergibt Português.

### Sprachen mit Schreibrichtung von rechts nach links {#right-to-left-languages}

עברית (Hebräisch), العربية (Arabisch) und فارسی (Persisch) ordnen den Editor von rechts nach links an: Die Symbolleiste, die Menüs, die Bereiche und Dialoge, die Schnellsuche, die Leiste und die Statuszeile der Registerkarte Wörterbuch und die Registerkarte Einstellungen werden gespiegelt. Die Untermenüs eines Kontextmenüs öffnen sich nach links, und die Symbole für Rückgängig und Wiederholen in der Symbolleiste werden vertauscht, sodass Rückgängig für eine Person, die von rechts nach links liest, nach hinten zeigt.

Das Diagramm selbst wird nie gespiegelt. Die Zeichenfläche mit ihren Tabellen, Spalten, Beziehungen und Notizen bleibt von links nach rechts angeordnet, ebenso die Minimap, die Scrollleisten, die [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar), die [Visualisierung](./visualization.md) und ihre Symbolleiste, die Datentypzellen, die Blätter auf der Registerkarte Wörterbuch und die Domänenliste eines Begriffs, der Code auf den Registerkarten Schema SQL und Codegenerator, die Farbauswahl, die beiden Seiten der Diff-Ansicht, die Zeitreise und die Vorschau des Automatischen Layouts.  
In Flow behalten die beiden Pfeile auf der Symbolleiste der Visualisierung ihre Plätze und tauschen ihre Funktion: Der nach rechts zeigende Pfeil ist `Previous table` und der nach links zeigende `Next table`, sodass das Zurückgehen in dieselbe Richtung zeigt wie Rückgängig. Die Tasten für Rückgängig und Wiederholen gehen weiterhin einen Schritt zurück und vor – siehe [Vorherige und nächste Tabelle](./visualization.md#previous-table-and-next-table).  
Der [Explorer](./explorer.md#beside-the-canvas) bleibt links von der Zeichenfläche und der Änderungsbaum der Diff-Ansicht links in dieser, jeweils mit dem ziehbaren Rand auf seiner rechten Seite. Innen verlaufen beide von rechts nach links: Ihre Felder und Zeilen werden gespiegelt, Zeilen werden von rechts eingerückt, und in beiden Bäumen klappt `←` eine Zeile aus oder wechselt zu ihrem ersten untergeordneten Element, während `→` sie einklappt oder zu ihrem übergeordneten Element zurückwechselt – siehe [Tasten im Explorer](./explorer.md#keys-in-the-explorer).  
Namen, Kommentare und anderer Text, den Sie eingegeben haben, behalten ihre eigene Schreibrichtung, daher liest sich ein hebräischer, arabischer oder persischer Name auch auf der Zeichenfläche von rechts nach links. Auch jeder Name, den eine Meldung des Wörterbuchs auflistet, behält seine eigene Schreibrichtung.

## Design {#theme}

Die Schaltfläche `Theme` (ein Kontrastsymbol) öffnet die Designauswahl, einen Bereich mit dem Titel `Theme` unterhalb der Symbolleiste, über der gerade geöffneten Registerkarte. Sie hat drei Teile:

- `Accent color`: 26 Farbfelder. Der Tooltip jedes Farbfelds nennt seinen Namen, etwa `indigo`.
- `Gray color`: 6 Farbfelder, `gray`, `mauve`, `slate`, `sage`, `olive` und `sand`.
- `Appearance`: `System`, `Light` und `Dark`.

![Die Designauswahl über die Symbolleiste öffnen, eine Akzentfarbe und einen Grauton auswählen und das Erscheinungsbild auf Light und dann auf System umstellen](/img/demo-theme-builder.webp)

In jedem Teil ist die geltende Option markiert, und eine Wahl wirkt sofort, während die Designauswahl geöffnet bleibt.  
Die Wahl einer Farbe lässt das Erscheinungsbild, wie es ist, sodass eine unter `System` gewählte Farbe `System` beibehält.

`System` zeigt das helle oder dunkle Erscheinungsbild wie der Host und wechselt, wenn der Host wechselt:

- In der Web-App, in Google Drive und auf Ihrer eigenen Seite: der helle oder dunkle Modus, den der Browser meldet und der dem Betriebssystem folgt.
- In VS Code: hell bei einem hellen Farbdesign und dunkel bei einem dunklen oder einem der beiden Designs mit hohem Kontrast.
- In einer JetBrains-IDE: das helle oder dunkle Design der IDE.
- In Obsidian: das helle oder dunkle Design von Obsidian.

Schließen Sie die Designauswahl mit `Escape`, mit der Schaltfläche `x` neben dem Titel, deren Tooltip `Close (ESC)` lautet, mit einem Druck an einer beliebigen Stelle im Editor außerhalb des Bereichs, außer auf der Symbolleiste, oder erneut mit der Schaltfläche `Theme`.  
Das Öffnen der Designauswahl schließt die Tabelleneigenschaften und die Sprachauswahl `Display Language`. Ein geöffneter [Explorer](./explorer.md#dialogs-beside-it) bleibt geöffnet, und in einer Sprache mit Schreibrichtung von links nach rechts steht die Designauswahl direkt neben ihm statt über ihm.  
Das Öffnen der Schnellsuche oder der Sprachauswahl `Display Language` schließt sie, ebenso `Ctrl + F` (Windows/Linux) oder `⌘ + F` (Mac). Diese Tastenkombination öffnet den [Explorer](./explorer.md#opening-and-closing) mit seiner Suche oder hält den Explorer, wenn er bereits geöffnet ist, geöffnet und bringt den Tastaturfokus in sein Suchfeld. Die Schaltfläche `Explorer` der Symbolleiste lässt die Designauswahl geöffnet.  
Die Designauswahl hält keine Tasten zurück, daher funktionieren die Tastenkombinationen des Editors, solange sie geöffnet ist.

In der [Schnellsuche](./quick-search.md) listet der Befehl `Theme` die Optionen `System`, `Light` und `Dark` auf, mit einem Häkchen am geltenden Erscheinungsbild. Die Wahl einer davon ändert nur das Erscheinungsbild und lässt Grauton und Akzentfarbe unverändert.

## In den einzelnen Hosts {#in-each-host}

Was Sie im Editor über die Symbolleiste oder die Schnellsuche auswählen, wird dort gespeichert, wo der Host es aufbewahrt, und jedes geöffnete Diagramm übernimmt eine Änderung daran sofort, wo auch immer sie vorgenommen wird.  
In VS Code, einer JetBrains-IDE und Obsidian entspricht die Option `Auto` des Hosts (der Wert `auto` in VS Code) der Option `System` des Editors. Die Wahl von `System` speichert `Auto`, und die Wahl von `Light` oder `Dark` speichert dieses Erscheinungsbild, auch wenn `Auto` es bereits angezeigt hat.  
Die eigenen Einstellungen und Hinweise der Erweiterung und der Plugins sind unabhängig von der Anzeigesprache auf Englisch.

### Web-App und Google Drive {#web-app-and-google-drive}

Auf erd-editor.io, einschließlich der gemeinsamen Sitzungen, und in Google Drive gelten eine Sprache und ein Design für die App und jedes Diagramm darin.  
Beides wird in diesem Browser gespeichert, nicht im Schema oder in der Drive-Datei, und alle Browsertabs mit erd-editor.io teilen sich beides: Eine Wahl in einem Browsertab ändert die anderen sofort.

Die Sprache ist `System`, das den bevorzugten Sprachen des Browsers folgt, bis Sie eine auswählen.  
Der eigene Text der App, etwa in der Seitenleiste, im Papierkorb, bei der Zusammenarbeit und auf den Bildschirmen für Google Drive, folgt derselben Sprache, und auf Hebräisch, Arabisch und Persisch wird die gesamte App von rechts nach links angeordnet. Die Datenschutzerklärung, die Nutzungsbedingungen und die Supportseiten bleiben auf Englisch.  
Zusätzlich zum Bereich des Editors und zur Schnellsuche gibt es in der untersten Zeile der Seitenleiste eine Sprachschaltfläche, deren Tooltip `Display Language` lautet, neben den Links `Privacy` und `Terms`. Ihr Menü listet die Option `System` mit der Sprache, für die sie steht, und dann die 25 Sprachen auf.

Das Design steht anfangs auf `System`, mit dem Grauton `olive` und der Akzentfarbe `jade`.  
Zusätzlich zur Designauswahl und zur Schnellsuche gibt es am unteren Rand der Seitenleiste drei Symbolschaltflächen, `System`, `Light` und `Dark`: auf erd-editor.io neben `Trash` und in Google Drive neben `Sign out`. Sie setzen dasselbe Erscheinungsbild wie die Designauswahl.

### VS Code {#vs-code}

Die Einstellungen der Erweiterung stehen in den Einstellungen von VS Code unter ERD Editor:

| Einstellung | Werte | Standardwert |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` oder ein Code aus der [Sprachtabelle](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | die sechs Grautöne | `slate` |
| `dineug.erd-editor.theme.accentColor` | die 26 Akzentfarben | `indigo` |

Der Einstellungseditor listet für die Spracheinstellung die Option `Auto` und dann jede Sprache unter ihrem eigenen Namen auf. Ein Wert in `settings.json`, der keine Sprache nennt, gilt als `auto`.  
Eine Designwahl im Editor schreibt alle drei Designeinstellungen. Eine Wahl wird dort geschrieben, wo ihre Einstellung bereits gesetzt ist: im Arbeitsbereichsordner, sonst im Arbeitsbereich, sonst in den Benutzereinstellungen.

### JetBrains-IDEs {#jetbrains-ides}

Settings | Tools | ERD Editor enthält `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` und `Display language:` (`Auto`, dann jede Sprache unter ihrem eigenen Namen), gespeichert für die gesamte IDE.  
Sie stehen anfangs auf `Auto`, `Slate`, `Indigo` und `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor enthält `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` und `Display language` (`Auto`, dann jede Sprache unter ihrem eigenen Namen), gespeichert pro Vault.  
Sie stehen anfangs auf `Auto`, `Slate`, `Indigo` und `Auto`.  
Eine Änderung gilt für jede ERD-Registerkarte des Vaults, auch für die in Pop-out-Fenstern.

### Ihre eigene Seite {#your-own-page}

Ein Element `<erd-editor>` auf Ihrer eigenen Seite zeigt weder die Schaltfläche `Theme` noch die Schaltfläche `Display Language`, und die Schnellsuche listet keines von beiden auf, bis die Seite sie mit [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) und [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker) einschaltet.  
Bis die Seite eine Sprache festlegt oder der Leser eine auswählt, zeigt der Editor Englisch an oder folgt `System`, solange `enableLocalePicker` eingeschaltet ist.  
Das Design steht anfangs auf `Dark`, mit dem Grauton `slate` und der Akzentfarbe `indigo`, sofern die Seite kein anderes festlegt oder [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode) einschaltet.  
Die Wahl des Lesers wirkt sofort, aber das Element speichert keine der beiden Einstellungen: Die Seite legt die Anfangswerte fest und speichert die Wahl des Lesers selbst – siehe [Design](../../api/erd-editor-element.md#theme) und [Anzeigesprache](../../api/erd-editor-element.md#display-language) in der API.
