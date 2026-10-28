---
sidebar_position: 16
description: Datentyp-Synchronisierung für Beziehungen und Domänen, maximale Kommentarbreite, Sperren von Einstellungen (Ansicht, Registerkarte, Codeeinstellungen und Namensansicht), Anzeigereihenfolge der Spalten, die Liste der Tastenkombinationen und die Registerkarte Einstellungen eines schreibgeschützten Editors.
---

# Einstellungen

Öffnen Sie die Einstellungen mit der Schaltfläche `Settings` in der Symbolleiste oder über die [Schnellsuche](./quick-search.md) unter `Tab`.
Der Einstellungsbildschirm hat zwei Registerkarten: `Preferences` und `Shortcuts`. Zuerst öffnet sich `Preferences`, außer beim Öffnen über den Eintrag `Shortcuts` des [Willkommensbildschirms](./editing-start.md#welcome-screen), der `Shortcuts` öffnet.

Das Design und die Anzeigesprache befinden sich nicht auf diesem Bildschirm. Die Schaltflächen `Theme` und `Display Language` der Symbolleiste öffnen sie – siehe [Sprache und Design](./language-and-theme.md).

## Datentyp-Synchronisierung für Beziehungen {#relationship-datatype-sync}

Legt fest, ob Datentypen synchronisiert werden. Die Einstellung ist standardmäßig eingeschaltet.
Wenn Sie dann den Datentyp einer Spalte ändern, wird er auf jede Spalte übertragen, die über eine Beziehung mit ihr verbunden ist, und zwar entlang der Kette von beiden Enden aus, sodass ein Fremdschlüssel nie von dem Schlüssel abweicht, den er referenziert.
Von einem Schlüssel zu seinen Fremdschlüsseln wird ein Serial-Typ als der Ganzzahltyp weitergegeben, den er speichert, wie beim Zeichnen einer Beziehung – siehe [Identifizierende Beziehungen](./relationship-editing.md#identifying-relationships). Wenn Sie also unter PostgreSQL einen Schlüssel auf `serial` ändern, erhalten seine Fremdschlüssel `integer`, und die Änderung setzt sich von dort aus die Kette hinunter fort.
Von einem Fremdschlüssel zurück zu seinem Schlüssel wird der Typ so weitergegeben, wie er geschrieben ist, nur dass ein Serial-Schlüssel seinen Typ behält und die Änderung dort endet.
Auch der Dialog [Spalten zuordnen](./relationship-editing.md#map-columns) folgt dieser Einstellung: Solange sie eingeschaltet ist, erhält jede vorhandene Spalte, die der Dialog zuordnet, den Typ, den ihr Elternschlüssel einem Fremdschlüssel gibt, und die Änderung setzt sich wie oben entlang der Beziehungen fort. Solange sie ausgeschaltet ist oder wenn der Schlüssel keinen Datentyp hat, behält die Spalte ihren eigenen.

Eine [Domäne](./dictionary.md#domains-and-data-types) gibt ihren `Data Type` an die mit ihr verknüpften Spalten weiter, wenn sich dieser Typ ändert und wenn eine Spalte verknüpft wird. Solange diese Einstellung eingeschaltet ist, setzt sich die Änderung von jeder dieser Spalten aus wie oben entlang der Beziehungen fort; solange sie ausgeschaltet ist, ändern sich nur die verknüpften Spalten. Eine Spalte, die in diesem Schritt den Typ ihrer Domäne erhält, behält ihn, auch dort, wo die Synchronisierung ihr einen anderen geben würde, etwa den Ganzzahltyp, den ein Serial-Schlüssel seinen Fremdschlüsseln gibt.
Erhält eine verknüpfte Spalte durch die Synchronisierung oder den Dialog „Spalten zuordnen“ einen anderen Typ als den ihrer eigenen Domäne, wird ihre Verknüpfung mit dieser Domäne im selben Schritt aufgehoben – siehe [Verknüpfung aufheben](./dictionary.md#unlinking). Kein Einfügen von Spalten gibt über diese Einstellung einen Typ weiter, nicht einmal den Typ einer Domäne, die das Einfügen verknüpft – siehe [Spalten kopieren/einfügen](./table-editing.md#copyingpasting-columns). Ein auf dem Blatt `Domains` der Registerkarte Wörterbuch eingefügter `Data Type` gibt ihn weiter, wie es jede Änderung am Typ einer Domäne tut.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Einstellung zur Datentyp-Synchronisierung für Beziehungen" loading="lazy" />

![members.id auf BIGINT UNSIGNED ändern, wodurch jede damit verbundene member_id aktualisiert wird](/img/demo-relationship-data-type-sync.webp)

## Maximale Kommentarbreite {#maximum-comment-width}

Legt die maximale Breite der Kommentarspalte in Pixeln fest (`60` ~ `200`).
Das Ausschalten des Schalters hebt die Begrenzung auf, und das Eingabefeld ist deaktiviert, solange er ausgeschaltet ist.
Beim Einschalten beginnt der Wert bei `60px`. Ein außerhalb des Bereichs eingegebener Wert wird auf die nächstgelegene Bereichsgrenze gesetzt.

![Maximum comment width einschalten, 120 eingeben und die Registerkarte ERD mit den auf diese Breite gekürzten Kommentaren](/img/demo-settings-comment-width.webp)

## Sperren {#lock}

Die Liste `Lock` enthält sieben Einstellungen. Solange die Sperre einer Einstellung eingeschaltet ist, behält die Datei den Wert, den die Einstellung beim Sperren hatte, sodass eine Änderung auf dem Bildschirm die Datei unverändert lässt.

| Zeile | Was die Datei behält | In einem neuen Diagramm |
| --- | --- | --- |
| `Viewport` | Die Zoomstufe und die Ansichtsposition der ERD-Zeichenfläche, unter einer einzigen Sperre | `100% · 0, 0` |
| `Canvas Type` | Die Registerkarte, auf der sich das Diagramm öffnet: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` oder `Dictionary` | `ERD` |
| `Language` | Die Sprache des [Codegenerators](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | Die [Schreibweise der Tabellennamen](./code-generator.md#name-case) des Codegenerators | `Pascal` |
| `Column Name Case` | Die [Schreibweise der Spaltennamen](./code-generator.md#name-case) des Codegenerators | `Camel` |
| `Bracket Type` | Die Option `Bracket` der Registerkarte [Schema SQL](./schema-sql.md#database-and-bracket) und der Ziele des [Codegenerators](./code-generator.md#bracket), die sie anbieten | `None` |
| `Name View` | Die [Namensansicht](./logical-names.md#name-view), in der sich das Diagramm öffnet: `Physical Names`, `Logical Names` oder `Both Names` | `Physical Names` |

Jede Zeile zeigt einen Wert und eine Sperrschaltfläche, und ein Klick auf die Schaltfläche schaltet genau diese eine Sperre ein oder aus.
Solange eine Sperre eingeschaltet ist, zeigt die Schaltfläche ein geschlossenes Schloss mit dem Tooltip `Unlock Viewport` (entsprechend für jede Zeile), und der Wert mit dem Tooltip `Locked value` ist der, den die Datei behält.
Solange sie ausgeschaltet ist, zeigt die Schaltfläche ein offenes Schloss mit dem Tooltip `Lock Viewport`, und der abgeblendete Wert mit dem Tooltip `Current value` ist die Einstellung in ihrem aktuellen Zustand.
`Viewport` zeigt zuerst den Zoom und dann die Ansichtsposition, etwa `75% · -40, 91`. Die Ansichtsposition ist der Punkt auf dem Bildschirm in Pixeln, an dem die Koordinate `0, 0` des Diagramms liegt, und eine Koordinate ab tausend wird abgekürzt, wie in `1.2k` oder `-24k`.

Beim Sperren wird die Einstellung so übernommen, wie sie in diesem Moment ist.
Solange eine Sperre eingeschaltet ist, funktioniert die Einstellung auf dem Bildschirm weiterhin: Sie können scrollen und zoomen, die Registerkarte wechseln, in den Menüs, den Optionsbereichen oder der Schnellsuche eine andere Sprache, Schreibweise oder einen anderen Begrenzer wählen und die Namensansicht an jeder Stelle wechseln, an der sie sich auswählen lässt – siehe [Ansicht wechseln](./logical-names.md#switching-the-view).
Die Datei behält jedoch den gesperrten Wert, und die Zeile zeigt ihn weiterhin an, sodass sich das Diagramm wieder in der gesperrten Ansicht, auf der gesperrten Registerkarte, in der gesperrten Namensansicht und mit der gesperrten Sprache, den gesperrten Schreibweisen und dem gesperrten Begrenzer öffnet. Auch ein JSON-Export schreibt die gesperrten Werte.
Um zu speichern, was der Bildschirm zeigt, schalten Sie die Sperre aus, und die Datei folgt von da an der Einstellung: Ist `Viewport` ausgeschaltet, öffnet sich das Diagramm dort, wo Sie es verlassen haben. Um stattdessen einen neuen Wert zu sperren, etwa eine neue Startansicht, schalten Sie die Sperre aus und wieder ein.
Zeigt die gesperrte Ansicht beim Öffnen der Datei nichts vom Diagramm, bewegt sich die Anzeige trotzdem zum Diagramm, und der gesperrte Wert bleibt unverändert.
`Canvas Type` behält nie die Registerkarte Einstellungen. Beim Einschalten wird die letzte andere Registerkarte gesperrt, auf der Sie waren, und solange die Sperre ausgeschaltet ist, nennt die Zeile diese Registerkarte.

![Viewport entsperren, das Diagramm scrollen und zoomen und Viewport in der neuen Ansicht, die seine Zeile zeigt, wieder sperren](/img/demo-settings-locks.webp)

Das Ein- oder Ausschalten einer Sperre ändert die Datei, da die Datei speichert, welche Sperren eingeschaltet sind, wird aber wie der Rest der Registerkarte Einstellungen nicht im [Verlauf](./undo-redo.md#what-the-history-records) aufgezeichnet. Auch ein Wechsel der Namensansicht wird nicht aufgezeichnet, ob gesperrt oder nicht.
Jede andere Einstellung wird so gespeichert, wie sie ist: die Datenbank, die Schalter in [`View Option`](./table-related-functions.md#table-view-options) und der Rest der Registerkarte `Preferences`.
Ein schreibgeschützter Editor ändert die Datei durch keine davon, was auch immer die Sperren sagen: Seine Sperrschaltflächen und die übrigen Bedienelemente von `Preferences` sind deaktiviert, und die Einstellungen, die er noch ändern lässt, bleiben auf diesem Bildschirm – siehe [Schreibgeschützte Editoren](#read-only-editors).

In einem neuen Diagramm, also einem von Grund auf neu begonnenen, sind alle Sperren eingeschaltet: eine leere Datei, die in VS Code, Obsidian oder einer JetBrains-IDE geöffnet wird (`ERD Editor: Create new diagram` und `New ERD` in Obsidian erstellen eine solche), ein neues Schema in der Web-App, eine Datei, die über das Menü New von Google Drive erstellt wird, oder ein Element `<erd-editor>`, dem kein Wert übergeben wird.
Auch ein Schema oder eine Datei in Google Drive, die die Web-App durch das Importieren einer SQL-, DBML-, AML- oder GraphQL-Datei erstellt, beginnt mit allen eingeschalteten Sperren. Was aus einer JSON-Datei erstellt wird, behält die Sperren, die diese Datei verzeichnet.
Eine Datei, die Sie öffnen, behält die Sperren, mit denen sie gespeichert wurde, jeweils mit ihrem gesperrten Wert.
Eine Datei, die keine Sperren verzeichnet, etwa eine, die von einer Version vor Einführung der Sperren gespeichert oder von Hand geschrieben wurde, öffnet sich mit allen eingeschalteten Sperren: die Ansicht auf `100% · 0, 0` und die Registerkarte auf `ERD`, gleich welche Ansicht und Registerkarte sie gespeichert hat, und ihre Sprache, ihre Schreibweisen, ihr Begrenzertyp und ihre Namensansicht so gesperrt, wie sie sie gespeichert hat.
Eine Datei, die von einer Version vor Einführung der Sperre für die Namensansicht gespeichert wurde, öffnet sich in der Ansicht `Physical Names` mit eingeschalteter Sperre `Name View`, auch wenn jede andere Sperre, die sie verzeichnet, ausgeschaltet ist.
Auch ein `Import`, der das Diagramm ersetzt, setzt die Sperren: Eine JSON-Datei bringt die Sperren mit, die sie verzeichnet, samt den Werten, die diese halten, und eine SQL-, DBML-, AML- oder GraphQL-Datei behält Ihre Sperren bei, setzt die Ansicht aber auf `100% · 0, 0` zurück, ob gesperrt oder nicht – siehe [Externe Dateien importieren](./file-import-export.md#importing-external-files). Wird der Import rückgängig gemacht, kehren die Sperren und gesperrten Werte zurück, die er ersetzt hat.

Eine Änderung, die eine Sperre aus der Datei heraushält, zählt nicht als Änderung. VS Code markiert die Registerkarte nicht als geändert, und Obsidian und eine JetBrains-IDE lassen die Datei unverändert, sowohl wenn sie von selbst speichern als auch wenn die Registerkarte geschlossen wird.
Sind alle Sperren eingeschaltet, erscheinen das Umsehen in einem Diagramm, das Wechseln der Registerkarte, das Ausprobieren einer anderen Sprache, Schreibweise oder eines anderen Begrenzers und das Wechseln der Namensansicht daher nie in `git diff`.
Ist `Viewport` ausgeschaltet, ändern Scrollen und Zoomen die Datei; ist `Canvas Type` ausgeschaltet, gilt das auch für das Wechseln der Registerkarte, einschließlich des Wechsels zur Registerkarte Einstellungen; und ist `Name View` ausgeschaltet, gilt das auch für das Wechseln der Namensansicht.
Die leere Datei eines neuen Diagramms bleibt leer bis zur ersten Änderung, die die Datei übernimmt: eine Bearbeitung, eine Änderung an einer Einstellung, die keine Sperre hält, oder das Ein- oder Ausschalten einer Sperre.
Wird ein Diagramm ohne eine solche Änderung geöffnet und wieder geschlossen, bleibt die Datei unverändert, gleich welche Version oder welcher Rechner sie geschrieben hat. Die Datei enthält nur, was das Diagramm ausmacht, in einer festen Reihenfolge, und eine in einer älteren Form gespeicherte Datei wird einmalig, bei ihrer ersten solchen Änderung, in diese Form umgeschrieben – siehe [Speicherform und Laufzeitwert](../../api/advanced/schema.md#storage-form-and-runtime-value).
In VS Code ist eine Revision, die mit `Reopen Editor With...` als Diagramm wieder geöffnet wird, etwa eine Git-Revision oder ein Eintrag aus Local History, schreibgeschützt und wird nie als geändert markiert.
In Google Drive wird ein Scrollen, ein Zoomen oder ein Wechsel zu einer anderen Registerkarte nie für sich allein gespeichert, ob gesperrt oder nicht. Ist `Viewport` ausgeschaltet, wird die Ansicht nur zusammen mit einer anderen Änderung geschrieben, sodass sich eine Drive-Datei dort öffnet, wo die Ansicht beim letzten Speichern war, und dasselbe gilt für die Registerkarte, wenn `Canvas Type` ausgeschaltet ist. Ein Wechsel der Namensansicht bei ausgeschalteter Sperre `Name View` wird wie eine Bearbeitung gespeichert, und ein Wechsel bei eingeschalteter Sperre oder in einem schreibgeschützten Editor wird nie gespeichert.

In einer [gemeinsamen Sitzung](../../api/advanced/collaborative-editing.md) erreicht das Ein- oder Ausschalten einer Sperre jeden Editor, und eine Sperre behält den Wert des Editors, der sie eingeschaltet hat.
Das Ausschalten von `Language`, einer Schreibweise, `Bracket Type` oder `Name View` gibt jedem Editor den Wert, der in dem Editor angezeigt wird, der die Sperre ausgeschaltet hat, sodass alle denselben Wert speichern. Das Ausschalten von `Viewport` oder `Canvas Type` verändert bei niemandem die Ansicht oder die Registerkarte.
Eine Sprache, eine Schreibweise oder ein Begrenzer, die gewählt werden, während ihre Sperre eingeschaltet ist, erreichen weiterhin jeden Editor, doch solange `Name View` eingeschaltet ist, hat jeder Editor seine eigene Namensansicht: Ein Wechsel ist nur in dem Editor zu sehen, der ihn vorgenommen hat, und das Einschalten der Sperre verändert bei niemandem die Ansicht. Solange sie ausgeschaltet ist, schaltet ein Wechsel in einem beliebigen Editor, der nicht schreibgeschützt ist, alle Editoren um.
Ein Coding-Agent, der über den MCP-Server arbeitet, hat kein Tool für die Sperren oder für die Einstellungen, die sie halten, und er liest eine gesperrte Sprache, Schreibweise oder einen gesperrten Begrenzertyp mit dem Wert, den die Datei behält. Nur seine Importe im Modus `replace` erreichen sie, wie ein `Import` – siehe [Einstellungen](../../mcp/tools.md#settings) und [Import](../../mcp/tools.md#import). Sein Tool `erd_list` und das Format `snapshot` von `erd_read` lassen die Namensansicht weg, und er bearbeitet das Schema einschließlich der logischen Namen, gleich welche Ansicht eine Person betrachtet.

## Spaltenreihenfolge anpassen {#adjusting-column-order}

Legt die Anzeigereihenfolge der Spalten in Tabellen fest.
Ziehen Sie eine Zeile, um sie zu verschieben – die ganze Zeile lässt sich ziehen, und das Griffsymbol kennzeichnet sie. Die neun Zeilen sind in ihrer Standardreihenfolge `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` und `Comment`.
Die Zeile `Logical Name` legt fest, wo die Zelle des logischen Namens steht, die eine Zeile in der Ansicht `Both Names` zeigt. In der Ansicht `Logical Names` steht der logische Name stattdessen an der Stelle der Zeile `Name`, und die Ansicht `Physical Names` zeigt keinen – siehe [Namensansicht](./logical-names.md#name-view). Die Zeile `Domain` legt fest, wo die Domänenzelle steht, die View Option → `Domain` einblendet – siehe [Die Domänenzelle](./logical-names.md#the-domain-cell).
Eine Zelle, die durch eine [Ansichtsoption für Tabellen](./table-related-functions.md#table-view-options) ausgeblendet ist oder die die Namensansicht weglässt, behält ihren Platz in der Liste, sodass die Reihenfolge für die jeweils angezeigten Zellen gilt.
Ein Diagramm, dessen Reihenfolge festgelegt wurde, bevor `Logical Name` und `Domain` Zeilen waren, erhält `Logical Name` direkt vor `Name` und `Domain` direkt nach `DataType`, wo auch immer diese in seiner Reihenfolge stehen.
Ein Diagramm, das eine spätere Version gespeichert hat, behält seine Reihenfolge ebenfalls, selbst wenn diese Version eine Zeile hat, die diese hier nicht kennt: Die Zeilen, die diese Version hat, stehen in der Reihenfolge, die die Datei vorgibt, und die unbekannte Zeile wird weggelassen. Das Speichern des Diagramms hier schreibt die Reihenfolge ohne sie, und die spätere Version setzt diese Zeile in ihrer eigenen Standardreihenfolge wieder neben ihren Nachbarn.
Die Markierung für [Alternativschlüssel](./table-related-functions.md#alternate-keys) (`AK1.1` usw.) gehört nicht zu diesen Zeilen. Sie steht in einer Zeile immer ganz hinten, nach der Zelle, die diese Reihenfolge an die letzte Stelle setzt.

![Zu Column Order hinunterscrollen und die Zeile Comment nach oben unter Name ziehen, wodurch jeder Kommentar direkt hinter seinem Spaltennamen steht](/img/demo-settings-column-order.webp)

## Tastenkombinationen {#shortcuts}

Die Registerkarte `Shortcuts` ist eine schreibgeschützte Tabelle mit `Command` und `Keybinding`, die die Belegungen für die Plattform auflistet, die Sie verwenden.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` und dann `G` | `T` und dann `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

Die meisten davon funktionieren nur auf der Registerkarte ERD und sind unterdrückt, solange die Schnellsuche, die Tabelleneigenschaften, die Diff-Ansicht, die Vorschau des Automatischen Layouts, die Zeitreise, der Dialog [`Export image`](./file-import-export.md#image) oder [`Map Columns`](./relationship-editing.md#map-columns) geöffnet ist.
`Search`, `Toggle Explorer` und `Stop` sind die Ausnahmen: `Search` blendet die Schnellsuche auf jeder Registerkarte ein und aus, `Toggle Explorer` öffnet den [Explorer](./explorer.md#opening-and-closing) von jeder Registerkarte aus mit seiner Suche und holt die Registerkarte ERD nach vorn, und `Stop` ist die Taste, die die Schnellsuche, die Tabelleneigenschaften, die Diff-Ansicht, die Vorschau des Automatischen Layouts, die Zeitreise, den Dialog `Export image`, `Map Columns`, die Designauswahl, die Sprachauswahl `Display Language`, die Farbauswahl, die Liste, die eine Schaltfläche `Name View` öffnet, und ein geöffnetes Kontextmenü schließt.
`Toggle Explorer` schließt den Explorer wieder, solange er auf der Registerkarte ERD geöffnet und nicht durch den Zen-Modus ausgeblendet ist, wie die Schaltfläche `Explorer` der Symbolleiste. Wenn die Schnellsuche, die Tabelleneigenschaften, die Designauswahl, die Sprachauswahl `Display Language`, der Dialog `Export image` oder `Map Columns` geöffnet ist, schließt die Tastenkombination stattdessen das Geöffnete und setzt den Tastaturfokus in die Suche des Explorers.
`Toggle Explorer` bewirkt nichts, solange eine Zelle, eine Notiz oder der Name einer Tabellengruppe bearbeitet wird. Weder diese Tastenkombination noch `Search` bewirkt etwas, solange eine Zelle der Registerkarte [Wörterbuch](./dictionary.md) bearbeitet wird, sodass der dort eingegebene Text erhalten bleibt. Solange die Diff-Ansicht, die Vorschau des Automatischen Layouts oder die Zeitreise geöffnet ist, überlässt `Toggle Explorer` seine Taste dem Browser oder dem Host – siehe [Die Suchleiste des Browsers](./find-and-replace.md#the-browsers-find-bar).
Auf der Registerkarte ERD beendet `Stop` einen geöffneten Editor für eine Zelle oder Notiz, schließt das Namensfeld einer [Tabellengruppe](./table-groups.md), ohne die Gruppe umzubenennen, oder bricht das Zeichnen einer Beziehung oder einer Gruppe mit `New Table Group` ab und lässt die Auswahl, wie sie ist. Ist nichts davon geöffnet, hebt `Stop` die Auswahl auf, entfernt den Fokus von der fokussierten Zelle und schließt mit demselben Tastendruck eine geöffnete Farbauswahl. Eine geöffnete Designauswahl oder Sprachauswahl `Display Language` schließt sich in jedem Fall mit demselben Tastendruck.
In einer Zelle des logischen Namens mit geöffneter Begriffsliste schließt der erste Druck auf `Stop` nur die Liste – siehe [Begriffsnamen vervollständigen](./logical-names.md#completing-term-names).
Ein geöffneter Explorer, eine geöffnete Designauswahl oder Sprachauswahl `Display Language` unterdrückt keine der Tastenkombinationen auf der Zeichenfläche. `Stop` schließt den Explorer nie. Zur Wirkung von `Stop` und den anderen Tasten im Explorer siehe [Tasten im Explorer](./explorer.md#keys-in-the-explorer), zu ihrer Wirkung in der Sprachauswahl siehe [Sprache auswählen](./language-and-theme.md#picking-a-language).
`Delete Selection` entfernt alle ausgewählten Tabellen, Notizen und Tabellengruppen oder, wenn eine einzelne Tabelle mit einigen ihrer Spalten ausgewählt ist und der Zoom über `70%` liegt, diese Spalten – siehe [Tabellen und Notizen löschen](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` entfernt auch ausgewählte Tabellengruppen.
`Add Table Group` beginnt das Zeichnen einer Gruppe mit [`New Table Group`](./table-groups.md#drawing-a-group), wie die Schaltfläche `New Table Group` der [Symbolleiste der Zeichenfläche](./table-related-functions.md#canvas-toolbar), und ein zweiter Druck bricht das Zeichnen ab. `Group Selected Tables` besteht aus zwei Tastendrücken ohne Zusatztaste, `T` und dann `G` innerhalb einer Sekunde. Die Tastenkombination legt die ausgewählten Tabellen in eine neue Gruppe und öffnet deren Namensfeld, wie `Group selected tables` im Kontextmenü einer Tabelle, und bewirkt nichts, wenn keine Tabelle ausgewählt ist – siehe [Ausgewählte Tabellen gruppieren](./table-groups.md#grouping-selected-tables). Beide bewirken nichts in einem schreibgeschützten Editor oder solange die Gruppen [ausgeblendet](./table-groups.md#hiding-groups) sind.
In einem schreibgeschützten Editor funktionieren nur die Tasten, die lesen: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` und `Focus on this table` auf der Tabelle, die ein Sprung ausgewählt hat, die drei Zoom-Tasten, `Zen Mode`, Kopieren und die Pfeiltasten, die die fokussierte Zelle bewegen. `Editing`, jede Taste `Add` und `Remove`, `Delete Selection`, `Primary Key`, beide Tasten zum Auswählen aller Elemente, die vier Beziehungstasten, `Add Table Group`, `Group Selected Tables`, `Hand Tool` und Einfügen bewirken nichts, und `Undo` und `Redo` machen nichts rückgängig und stellen nichts wieder her – siehe [Schreibgeschützte Editoren](./table-related-functions.md#read-only-editors).
`Zoom In`, `Zoom Out` und `Zoom Reset` zoomen auch die Registerkarte [Visualisierung](./visualization.md#toolbar), in `Graph` wie in `Flow`, sofern die Schnellsuche nicht geöffnet ist.
In `Flow` gehen `Undo` und `Redo` durch das, worauf Flow eingegrenzt wurde, einen Schritt zurück und vor, wie die Schaltflächen `Previous table` und `Next table`, sofern die Schnellsuche nicht geöffnet ist. Dort machen sie nie eine Änderung am Diagramm rückgängig, und in `Graph` bewirken sie nichts – siehe [Vorherige und nächste Tabelle](./visualization.md#previous-table-and-next-table).
Auf der Registerkarte Visualisierung schließt `Stop` außerdem das Menü der [Zeilenanzeige](./visualization.md#row-display) und bricht ein noch laufendes [Flow-Layout](./visualization.md#how-flow-is-placed) ab; eine mit `Focus on this table` eingeschränkte Ansicht erweitert `Stop` nicht.
`Focus on this table` öffnet die Registerkarte Visualisierung in `Flow`, eingeschränkt auf die ausgewählten Tabellen und alle Tabellen, die direkt über eine Beziehung mit ihnen verbunden sind, und bewirkt nichts, wenn keine Tabelle ausgewählt ist – siehe [Auf Tabellen fokussieren](./visualization.md#focusing-on-tables).
Auf der Registerkarte Wörterbuch wirken `Undo` und `Redo` auf den Verlauf des angezeigten Blatts statt auf den des Diagramms und bewirken auf dem Blatt `Checks` nichts – siehe [Wörterbuchblätter](./undo-redo.md#dictionary-sheets). Auf den Blättern `Domains`, `Words` und `Terms` fügt `Add Column` Zeilen unter der Auswahl ein, seine Taste mit zusätzlichem `Shift` fügt sie darüber ein, und `Remove Column` löscht die Zeilen, die die Auswahl abdeckt – siehe [Zeilen hinzufügen und löschen](./dictionary.md#adding-and-deleting-rows). Zu den anderen Tasten der Registerkarte siehe [Tasten auf der Registerkarte](./dictionary.md#keys-on-the-tab).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` und `Group Selected Tables` lassen einem Textcursor den Vortritt: Während Sie eine Zelle oder eine Notiz bearbeiten oder in ein Textfeld wie das Suchfeld des Explorers tippen, wählt `Ctrl + A` (Windows/Linux) oder `⌘ + A` (Mac) den Text aus, `Space` gibt ein Leerzeichen ein, `Delete` und `Backspace` löschen Text, und `T` und dann `G` gibt die beiden Buchstaben ein.
Kopieren und Einfügen sind die browsereigenen Tastenkombinationen `Ctrl + C` und `Ctrl + V` (Windows/Linux) oder `⌘ + C` und `⌘ + V` (Mac), daher stehen sie nicht in dieser Liste – siehe [Tabellen bearbeiten](./table-editing.md).

Die Belegungen lassen sich auf dieser Registerkarte nicht ändern.
Ein Host, der den Editor einbettet, belegt sie mit [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) neu, außer `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` und `Zoom Reset`, die fest vorgegeben sind.
Die Registerkarte `Shortcuts` listet dann die Belegungen des Hosts auf: Ein Befehl, den der Host nicht neu belegt, behält seine Standardbelegung, und ein Befehl, den der Host an keine Taste bindet, zeigt keine an.
Die Zeilentasten der Registerkarte Wörterbuch folgen `Add Column` und `Remove Column`, sodass sie mitwandern, wenn einer der beiden neu belegt wird – siehe [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

In Obsidian erreichen diese Tasten den Editor, solange die Obsidian-Registerkarte des Diagramms aktiv ist, auch dort, wo ein Obsidian-Hotkey dieselbe Taste verwendet, etwa `Alt + Enter`, `Ctrl + K` und `Ctrl + F` (Windows/Linux) oder `⌥ + Enter`, `⌘ + K` und `⌘ + F` (Mac). Ebenso erreicht ihn die Tastenkombination `Alt + Shift + Enter` (Windows/Linux) oder `⌥ + Shift + Enter` (Mac) der Registerkarte Wörterbuch, die in keiner Zeile dieser Liste steht. Alle anderen Obsidian-Hotkeys funktionieren dort weiterhin. Zu `Ctrl + F` oder `⌘ + F` siehe [Die Suchleiste des Browsers](./find-and-replace.md#the-browsers-find-bar).

## Schreibgeschützte Editoren {#read-only-editors}

In einem [`readonly`](../../api/erd-editor-element.md#readonly)-Editor zeigt die Registerkarte Einstellungen die Einstellungen des Diagramms und ändert keine davon. Ein Kennzeichen `Read only` steht neben der Überschrift jeder Seite, `Preferences` und `Shortcuts`.
Die Schalter `Relationship DataType Sync` und `Maximum comment width` sowie das Breitenfeld sind deaktiviert, ebenso jede Sperrschaltfläche. Die Zeilen von `Column Order` zeigen keinen Griff und lassen sich nicht ziehen.
Jede Zeile von `Lock` zeigt weiterhin ihren Wert. Eine gesperrte Zeile zeigt den Wert, den die Datei behält, und eine entsperrte die Einstellung, wie dieser Bildschirm sie hat, was von der der Datei abweichen kann, wie unten beschrieben.

Die Einstellungen, die bestimmen, was der Bildschirm zeigt, lassen sich dort weiterhin ändern: die Ansichtsposition und der Zoom, die Registerkarte, die Namensansicht, die Datenbank, die Sprache des Code-Generators, beide Schreibweisen, der Begrenzer und die Schalter von [`View Option`](./table-related-functions.md#table-view-options).
Jede ändert nur diesen Bildschirm, was auch immer ihre Sperre sagt. Sie wird nicht in der Datei gespeichert und nicht von einem JSON-Export geschrieben, nicht im Verlauf aufgezeichnet, nicht als Änderung gezählt und erreicht nie Mitbearbeiter. Die Optionsbereiche der Registerkarten [Schema SQL](./schema-sql.md#options-panel) und [Code Generator](./code-generator.md#options-panel) beschriften diese Auswahlen dort mit `This window only` anstelle von `Saved in the document`.
Wenn der Editor wieder beschreibbar wird, kehren die Datenbank, die Sprache, die Schreibweisen, der Begrenzer und die Schalter von View Option zu den Werten der Datei zurück. Die Ansicht, die Registerkarte und die Namensansicht bleiben, wie Sie sie verlassen haben, und die Datei übernimmt jede davon, soweit ihre Sperre es erlaubt, mit Ihrer nächsten Änderung daran.
