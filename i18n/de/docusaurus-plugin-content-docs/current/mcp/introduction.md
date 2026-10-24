---
sidebar_position: 1
description: Einen Coding-Agenten wie Claude Code oder Codex über den MCP-Server @dineug/erd-editor-mcp Diagramme von erd-editor bearbeiten lassen, live in VS Code, Obsidian oder einer JetBrains-IDE oder direkt auf dem Datenträger.
---

# Einführung

`@dineug/erd-editor-mcp` ist ein MCP-Server, mit dem ein Coding-Agent Diagramme von erd-editor bearbeiten kann.
Claude Code, Codex und jeder andere Client des [Model Context Protocol](https://modelcontextprotocol.io) erhalten ein Tool pro Vorgang an einem Dokument: eine Tabelle hinzufügen, eine Spalte umbenennen, zwei Tabellen in Beziehung setzen, einen DDL-Dump importieren, das Schema als SQL auslesen.

Ist das Dokument im ERD Editor von [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) oder einer [JetBrains-IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor) geöffnet, tritt der Agent dem Editor wie ein Mitbearbeiter bei.
Jede Änderung erscheint auf der Zeichenfläche, sobald sie geschieht, und das Rückgängigmachen des Agenten nimmt nur seine eigenen Änderungen zurück.
VS Code lässt die Änderungen des Agenten ungespeichert, bis der Agent oder Sie speichern, während Obsidian und eine JetBrains-IDE sie so speichern, wie sie Ihre eigenen speichern.
Hält kein Editor das Dokument, bearbeiten dieselben Tools die Datei selbst.

![Ein Coding-Agent, der einem in VS Code geöffneten Diagramm Tabellen und Beziehungen hinzufügt](/img/coding-agents.webp)

## Was ein Agent tun kann {#what-an-agent-can-do}

- Ein Schema im Gespräch aufbauen oder ändern: Tabellen, Spalten und sämtliche Spaltenoptionen, Beziehungen mit ihrer Kardinalität und ihren Aktionen für ON DELETE und ON UPDATE, Indizes, Notizen, Farben und Positionen auf der Zeichenfläche. Siehe [Beziehungen](./tools.md#relationships).
- Tabellen in [Tabellengruppen](../guide/guides/table-groups.md) zusammenfassen: eine Gruppe um die angegebenen Tabellen oder über einem Bereich der Zeichenfläche hinzufügen, sie dann umbenennen, einfärben, mit ihren Tabellen verschieben, ihre Größe ändern, Tabellen aufnehmen oder herausnehmen oder die Gruppe entfernen, wobei ihre Tabellen bleiben, wo sie sind. Siehe [Tabellengruppen](./tools.md#table-groups).
- Tabellen und Spalten mit den Wörtern und Begriffen der Registerkarte [Wörterbuch](../guide/guides/dictionary.md) des Editors benennen und Spalten mit deren Domänen verknüpfen, die ihnen ihre Datentypen geben. Er legt die [logischen Namen](../guide/guides/logical-names.md) von Tabellen und Spalten fest, und die Wörterbücher leiten daraus die physischen Namen ab, wie sie es im Editor tun, wobei ein von Hand geschriebener physischer Name bestehen bleibt, sofern er nicht leer ist. Er fügt Domänen, Wörter und Begriffe hinzu, ändert und entfernt sie und leitet, nachdem sich ein Wort oder Begriff geändert hat, die physischen Namen für eine Spalte, eine Tabelle oder das ganze Dokument neu ab. Er listet auf, was das Blatt `Checks` der Registerkarte findet: verbotene, nicht registrierte und als Synonym geführte Wörter; Namen, die zwei Zeilen eines Wörterbuchs gemeinsam haben; Verknüpfungen mit einer Domäne, die das Dokument nicht führt; physische Namen, die von dem abweichen, den ihr Begriff ergibt; und Spalten, die vom Datentyp ihrer Domäne abweichen. Siehe [Wörterbücher](./tools.md#dictionaries) und [Wörterbuchprüfungen](./tools.md#dictionary-checks).
- Das Dokument durch ein Schema ersetzen, das aus SQL DDL, GraphQL SDL, DBML oder AML eingelesen wird, oder durch ein anderes Dokument im Format `.erd.json`. Oder dieses Schema oder Dokument unterhalb des Diagramms hinzufügen und alles behalten, was bereits vorhanden ist, so wie [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) im Editor. Ein Block `TableGroup` aus DBML kommt in beiden Fällen als Tabellengruppe an. Ein Schema, das das Dokument ersetzt, behält die Wörterbücher des Dokuments bei, ein Dokument, das es ersetzt, bringt seine eigenen mit, und ein Hinzufügen bringt keine mit. Siehe [Import](./tools.md#import).
- Das Diagramm samt seinen logischen Namen und Wörterbuchzeilen als Liste von IDs, als vollständige Entitäten oder als Text im Format `.erd.json`, wie ihn ein Speichern schreibt, auslesen. Oder es als DDL für eine beliebige der acht Datenbanken auslesen, mit den Optionen `Statements` und `Header` der Registerkarte [Schema SQL](../guide/guides/schema-sql.md) und ihrem Schalter [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). Bei einem Schema mit Tausenden von Tabellen liest er jeweils eine Seite, einige Tabellen oder die Tabellen einiger Tabellengruppen. Siehe [Dokument lesen](./tools.md#reading-a-document).
- Die Datenbank, den Datenbanknamen und die [Skripte](../guide/guides/schema-sql.md#before-and-after-scripts) festlegen, die in Schema SQL vor und nach den Tabellen geschrieben werden, etwa `CREATE EXTENSION` davor oder `GRANT` danach. `erd_read` liefert die Skripte für sich allein oder innerhalb der DDL des ganzen Dokuments. Siehe [Einstellungen](./tools.md#settings).
- Mehrere Änderungen ganz oder gar nicht als eine einzige ausführen, die ein einziges Rückgängigmachen zurücknimmt. Siehe [erd_batch](./tools.md#erd_batch).
- Seine eigenen Änderungen rückgängig machen und wiederholen, nie Ihre.

Was er nicht tut:

- Zoomen, scrollen oder Registerkarten wechseln. Das ist Sache jedes einzelnen Betrachters, daher tut das kein Tool. Ein Import, der das Dokument ersetzt, verschiebt die Ansicht trotzdem, selbst wenn `Viewport` gesperrt ist, wie es `Import` im Editor tut: zurück zum Anfang der Zeichenfläche bei 100 % oder mit `erd_import_json` zur Ansicht des geladenen Dokuments und auch zu dessen Registerkarte, es sei denn, dieses Dokument sperrt `Canvas Type`. Siehe [Import](./tools.md#import).
- Die [Namensansicht](../guide/guides/logical-names.md#switching-the-view) zwischen `Physical Names`, `Logical Names` und `Both Names` wechseln. Sie gehört jedem einzelnen Betrachter, solange ihre [Sperre](../guide/guides/settings.md#lock) eingeschaltet ist, wie in einem neuen Diagramm, und wird, sobald die Sperre ausgeschaltet ist, von Ihnen im Editor gewählt, daher tut das kein Tool. Der Agent liest und schreibt logische Namen unabhängig von der Ansicht. Ein `erd_import_json`, das das Dokument ersetzt, bringt die Namensansicht des geladenen Dokuments nur mit, wenn bei diesem Dokument die Sperre `Name View` ausgeschaltet ist.
- [`View Option`](../guide/guides/table-related-functions.md#table-view-options), die Sprache und die Schreibweisen des Codegenerators, den Begrenzertyp oder `Relationship DataType Sync`, `Maximum comment width` und `Column Order` auf der Registerkarte [Einstellungen](../guide/guides/settings.md) ändern. Diese legen Sie im Editor fest, und der Agent liest sie so, wie die Datei sie speichert.
- Eine [Sperre](../guide/guides/settings.md#lock) ein- oder ausschalten. Nur `erd_import_json` ändert die Sperren oder die oben genannten Einstellungen, wenn es das ganze Dokument ersetzt, und zwar auf die des Dokuments, das es lädt. Ein Dokument ohne das Feld `lockSettings`, etwa eine Datei, die die Erweiterung für VS Code vor `4.0.0` oder das Plugin für Obsidian oder JetBrains vor `1.0.0` gespeichert hat, schaltet jede Sperre ein. Das Rückgängigmachen eines beliebigen Imports, der das Dokument ersetzt hat, stellt die Einstellungen und Sperren wieder her, die das Dokument vorher hatte.
- Eine Beziehung anderen Spalten neu zuordnen, wie es [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) tut. Stattdessen entfernt der Agent die Beziehung, wobei ihre Fremdschlüsselspalten erhalten bleiben, und verknüpft die gewünschten Spalten mit `erd_link_columns`, und zwar in einem einzigen `erd_batch`, das ein einziges Rückgängigmachen zurücknimmt.
- Ein Wörterbuch als CSV importieren oder exportieren, ein Blatt sortieren oder Zeilen über oder unter einer Zeile einfügen, wie es die Registerkarte [Wörterbuch](../guide/guides/dictionary.md) tut. Der Agent fügt Zeilen hinzu, ändert und entfernt sie, viele auf einmal in einem einzigen `erd_batch`, und eine neue Zeile kommt ans Ende ihres Blatts.
- Den Codegenerator ausführen. `erd_read` liefert DDL oder JSON, und der Agent schreibt daraus selbst Code.

## Funktionsweise {#how-it-works}

Der Server ist ein stdio-Prozess, den Ihr MCP-Client startet.
Bei jedem Aufruf sucht er nach einem Editor, der das Dokument hält: einem Fenster von VS Code, einem Vault-Fenster von Obsidian oder einer JetBrains-IDE, jeweils mit der Erweiterung oder dem Plugin ERD Editor.

- **Live** – ein Editor hat das Dokument in seinem Arbeitsbereich, seinem Vault oder einem seiner geöffneten Projekte oder hat es geöffnet. Der Server tritt der Bearbeitungssitzung dieses Editors bei, und die Änderung landet im Editor: in VS Code ungespeichert und in Obsidian und einer JetBrains-IDE so gespeichert wie Ihre eigenen Änderungen.
- **Headless** – kein Editor. Der Server lädt die Datei, wendet die Änderung an und schreibt die Datei zurück.
- **Abgelehnt** – ein Editor hält das Dokument, hat aber seinen Hub ausgeschaltet. Der Server liest vom Datenträger, schreibt aber nichts, da der geöffnete Editor die Datei bei seinem nächsten Speichern überschreiben könnte. Eine JetBrains-IDE mit eingeschaltetem Hub lehnt es außerdem ab, ein Dokument zu ändern, das nur in Projekten liegt, denen sie nicht vertraut, doch der Agent kann es weiterhin lesen. Ist der Hub des Editors eingeschaltet, spricht aber seine Erweiterung oder sein Plugin ERD Editor ein anderes Hub-Protokoll als der Server, wird jeder Aufruf für das Dokument abgelehnt, Lesevorgänge eingeschlossen, und zwar mit `protocolMismatch` und einer Meldung, die die zu aktualisierende Seite nennt – siehe [Aktualisieren](./installation.md#updating).

Einzelheiten finden Sie unter [Live und Headless](./live-and-headless.md).

## Voraussetzungen {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` oder neuer, um den Server auszuführen |
| Ein MCP-Client | Claude Code, Codex oder jeder Client, der einen stdio-Server starten kann |
| VS Code für die Live-Bearbeitung | `1.101.0` oder neuer, mit der Erweiterung ERD Editor `4.0.0` oder neuer |
| Obsidian für die Live-Bearbeitung | Die Desktop-App `1.5.7` oder neuer, mit dem Plugin ERD Editor `1.0.0` oder neuer |
| Eine JetBrains-IDE für die Live-Bearbeitung | Eine auf IntelliJ basierende IDE `2025.2` oder neuer, mit dem Plugin ERD Editor `1.0.0` oder neuer |

Der Server `1.0.0` oder neuer und die oben genannten Versionen sprechen das Hub-Protokoll 2.
Die früheren Versionen, die Agenten bedienen, sprechen Protokoll 1: die Erweiterung für VS Code von `3.0.0` bis `3.1.0`, das Plugin für Obsidian `0.1.0` und `0.2.0` sowie das Plugin für JetBrains `0.9.0` und `0.10.0`.
Eine solche Version und der Server `1.0.0` oder neuer lehnen einander ab, und ebenso ein älterer Server und die oben genannten Versionen – siehe [Aktualisieren](./installation.md#updating).
Eine Erweiterung für VS Code vor `3.0.0` oder ein Plugin für JetBrains vor `0.9.0` hat keinen Hub und ist daher für den Server unsichtbar, sodass er die Datei auf dem Datenträger bearbeitet, selbst ein darin geöffnetes Diagramm.

Die Tools für logische Namen, Domänen und die Wörterbücher benötigen den Server `1.1.0` oder neuer und, wo immer das Dokument geöffnet ist, mindestens die Erweiterung für VS Code `4.2.0` oder das Plugin für Obsidian oder JetBrains `1.2.0`.
Von den oben genannten Versionen lässt eine Erweiterung vor `4.2.0` oder ein Plugin vor `1.2.0` den Agenten weiterhin live bearbeiten, da diese Versionen Protokoll 2 sprechen, ignoriert aber die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die der Agent schreibt, und lässt sie beim Speichern der Datei weg.
Ein Server vor `1.1.0`, der eine Datei auf dem Datenträger bearbeitet, schreibt sie ohne ihre logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen zurück – siehe [Aktualisieren](./installation.md#updating).

Weiter: [Installation](./installation.md).
