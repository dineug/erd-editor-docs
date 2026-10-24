---
sidebar_position: 2
description: Den Server @dineug/erd-editor-mcp bei Claude Code, Codex oder einem anderen MCP-Client registrieren und VS Code, Obsidian oder eine JetBrains-IDE für die Live-Bearbeitung einrichten.
---

# Installation

Der Server ist auf npm als `@dineug/erd-editor-mcp` veröffentlicht.
Er besteht aus einer einzigen eigenständigen Datei ohne Laufzeitabhängigkeiten, und `npx` lädt ihn herunter, wenn der Agent ihn zum ersten Mal startet, sodass nichts weiter zu installieren ist.
Er benötigt Node.js `22.12` oder neuer.

Damit der Agent ein Diagramm live bearbeiten kann, richten Sie auch den Editor ein, der es hält: [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) oder [eine JetBrains-IDE](#set-up-a-jetbrains-ide).
Bedient kein Editor das Dokument, bearbeitet der Agent die Datei auf dem Datenträger – siehe [Live und Headless](./live-and-headless.md).

## Claude Code {#claude-code}

Führen Sie in Ihrem Projektordner Folgendes aus:

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Fügen Sie `--scope project` vor `--transport` hinzu, um den Server stattdessen in die Datei `.mcp.json` des Projekts zu schreiben, wo ihn jeder übernimmt, der das Projekt klont.

## Codex {#codex}

Führen Sie Folgendes einmal aus. Die CLI, die App und die IDE-Erweiterung von Codex teilen sich die Einstellung:

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Oder tragen Sie den Server in `~/.codex/config.toml` ein oder in einem vertrauenswürdigen Projekt in `.codex/config.toml`:

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Andere MCP-Clients {#any-other-mcp-client}

Führen Sie `npx -y @dineug/erd-editor-mcp` als stdio-Server aus: Der Befehl ist `npx`, und die Argumente sind `-y` und `@dineug/erd-editor-mcp`.

Der Server löst einen relativen Dokumentpfad ausgehend von seinem Arbeitsverzeichnis auf. Starten Sie ihn daher in Ihrem Projektordner.
Er spricht die MCP-Protokollversionen `2025-06-18`, `2025-03-26` und `2024-11-05` und antwortet einem Client, der eine neuere Version verwendet, mit `2025-06-18`.

## VS Code einrichten {#set-up-vs-code}

Ein Fenster von VS Code bedient die Diagramme in seinen Arbeitsbereichsordnern und jedes darin geöffnete Diagramm.

1. Installieren Sie die [Erweiterung ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` oder neuer. Sie benötigt VS Code `1.101.0` oder neuer.
2. Öffnen Sie den Projektordner und vertrauen Sie dem Arbeitsbereich. Die Erweiterung bedient Agenten nur in einem vertrauenswürdigen Arbeitsbereich.
3. Lassen Sie die Einstellung `dineug.erd-editor.agentHub.enabled` eingeschaltet. Sie ist standardmäßig eingeschaltet.

Eine Erweiterung von `3.0.0` bis `3.1.0` und der Server `1.0.0` oder neuer lehnen einander ab, und eine Erweiterung vor `3.0.0` bedient keine Agenten.
Eine Erweiterung `4.0.0` oder `4.1.0` verbindet sich, zeigt die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die der Agent schreibt, aber weder an, noch behält sie sie – siehe [Aktualisieren](#updating).

Die Erweiterung startet in einem Arbeitsbereich, der Dateien mit der Endung `.erd`, `.erd.json`, `.vuerd` oder `.vuerd.json` enthält, sodass ein Agent diese Diagramme erreicht, bevor Sie eines öffnen.
In einem Arbeitsbereich ohne solche Dateien startet sie, wenn Sie ein Diagramm öffnen, und bis dahin arbeitet der Agent auf dem Datenträger.

| Einstellung | Standardwert | Wirkung |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Erlaubt dem MCP-Server eines Agenten, die Dokumente dieses Fensters über einen lokalen Socket zu bearbeiten, unter Windows über eine Named Pipe. Ist die Einstellung ausgeschaltet oder der Arbeitsbereich nicht vertrauenswürdig, können Agenten die Diagramme des Fensters weiterhin vom Datenträger lesen, schreiben aber nie ein Diagramm an seinem Editor vorbei. |

## Obsidian einrichten {#set-up-obsidian}

Ein Vault-Fenster von Obsidian bedient die Diagramme in seinem Vault.

1. Installieren Sie das [Plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` oder neuer über Community plugins und schalten Sie es ein. Es läuft nur in der Desktop-App und benötigt Obsidian `1.5.7` oder neuer.
2. Lassen Sie Settings → ERD Editor → Coding agents eingeschaltet. Die Einstellung ist standardmäßig eingeschaltet, und jeder Vault hat seine eigene.

Ein Plugin vor `1.0.0` und der Server `1.0.0` oder neuer lehnen einander ab.
Ein Plugin `1.0.0` oder `1.1.0` verbindet sich, zeigt die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die der Agent schreibt, aber weder an, noch behält es sie – siehe [Aktualisieren](#updating).

Ein Vault-Fenster bedient Agenten ab dem Moment, in dem das Plugin geladen wird, sodass ein Agent die Diagramme des Vaults erreicht, bevor Sie eines öffnen.
Einen Vertrauensschritt gibt es nicht.
Eine Datei, die der Vault nicht auflistet, etwa eine in einem Ordner, dessen Name mit einem Punkt beginnt, lässt sich nicht im ERD Editor öffnen, daher wird eine Änderung daran abgelehnt.

Bitten Sie den Agenten, neue Diagramme mit der Endung `.erd` zu benennen.
Ein Name ohne Endung erhält `.erd.json`, und der Dateiexplorer von Obsidian listet eine Datei `.erd.json` nur auf, solange Settings → Files and links → Detect all file extensions eingeschaltet ist.

| Einstellung | Standardwert | Wirkung |
| --- | --- | --- |
| Coding agents | Ein | Erlaubt dem MCP-Server eines Agenten, die Diagramme dieses Vaults über einen lokalen Socket zu bearbeiten, unter Windows über eine Named Pipe. Ist die Einstellung ausgeschaltet, können Agenten die Diagramme des Vaults weiterhin vom Datenträger lesen, schreiben aber nie ein Diagramm an seinem Editor vorbei. |

Ein über Flathub installiertes Obsidian läuft in einer Flatpak-Sandbox, die der Server nicht erreichen kann.
Dort bedient das Plugin keine Agenten und legt keine Sperrdatei an, sodass der Agent die Dateien auf dem Datenträger bearbeitet, selbst ein Diagramm, das Sie geöffnet haben.
Obsidian lädt das Diagramm neu, wie nach jeder Änderung, die außerhalb von Obsidian vorgenommen wurde, und eine Änderung von Ihnen, die es noch nicht gespeichert hat, weicht der des Agenten.
Das Plugin weist bei jedem Öffnen des Vaults darauf hin, bis Sie Coding agents ausschalten.

## Eine JetBrains-IDE einrichten {#set-up-a-jetbrains-ide}

Eine JetBrains-IDE bedient die Diagramme jedes darin geöffneten Projekts und jedes Diagramm, das in ihrem ERD Editor geöffnet ist.

1. Installieren Sie das [Plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` oder neuer. Es benötigt eine auf IntelliJ basierende IDE `2025.2` oder neuer, die auf der JetBrains Runtime läuft.
2. Öffnen Sie das Projekt und vertrauen Sie ihm. In einem Projekt, dem die IDE nicht vertraut, etwa einem im abgesicherten Modus geöffneten, lesen Agenten die Diagramme, ändern sie aber nie.
3. Lassen Sie Settings | Tools | ERD Editor → Coding agents angehakt. Die Einstellung ist standardmäßig eingeschaltet und gilt für die gesamte IDE.

Ein Plugin `0.9.0` oder `0.10.0` und der Server `1.0.0` oder neuer lehnen einander ab, und ein Plugin vor `0.9.0` bedient keine Agenten.
Ein Plugin `1.0.0` oder `1.1.0` verbindet sich, zeigt die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die der Agent schreibt, aber weder an, noch behält es sie – siehe [Aktualisieren](#updating).

Die IDE bedient Agenten ab dem Moment, in dem das erste Projekt geöffnet wird, sodass ein Agent die Diagramme eines Projekts erreicht, bevor Sie eines öffnen.

| Einstellung | Standardwert | Wirkung |
| --- | --- | --- |
| Coding agents | Ein | Erlaubt dem MCP-Server eines Agenten, die Diagramme dieser IDE über einen lokalen Socket zu bearbeiten, unter Windows über eine Named Pipe. Ist die Einstellung ausgeschaltet, können Agenten die Diagramme der geöffneten Projekte weiterhin vom Datenträger lesen, ändern aber nie ein Diagramm an seinem Editor vorbei. |

Die Einstellungsseite zeigt an, wenn Coding-Agenten nicht verfügbar sind: in einer IDE ohne JCEF (in der auch der ERD Editor nicht laufen kann), in einer unter Linux als Flatpak installierten IDE und wenn ihr Hub nicht starten konnte.
In diesen Fällen legt die IDE keine Sperrdatei an, und der Agent bearbeitet die Dateien auf dem Datenträger.
Der ERD Editor lädt ein auf dem Datenträger geändertes Diagramm nicht neu, solange es geöffnet ist, und Ihre nächste Änderung darin schreibt das ganze Diagramm über die Änderungen des Agenten zurück. Schließen Sie das Diagramm daher zuerst.

## Ausprobieren {#try-it}

1. Öffnen Sie den Ordner, der Ihre Diagramme enthält: in VS Code als Arbeitsbereich, dem Sie vertrauen; in Obsidian als Vault; in einer JetBrains-IDE als Projekt, dem Sie vertrauen.
2. Starten Sie den Agenten im selben Ordner und formulieren Sie Ihre Bitte in einfachen Worten, zum Beispiel _„In schema.erd.json eine Tabelle reviews hinzufügen, die mit users und products in Beziehung steht“_.
3. Sehen Sie zu, wie die Änderung auf der Zeichenfläche erscheint. Speichern Sie in VS Code mit `Ctrl + S` (Windows/Linux) oder `⌘ + S` (Mac), oder bitten Sie den Agenten darum. Obsidian und eine JetBrains-IDE speichern die Änderung so, wie sie Ihre eigenen Änderungen speichern, und wenn Sie den Agenten bitten zu speichern, schreibt er sie sofort.

Ein noch nicht geöffnetes Diagramm öffnet sich bei der ersten Änderung des Agenten im ERD Editor, ohne den Tastaturfokus zu übernehmen.
Der Agent legt ein neues Dokument mit `erd_open_document` an, und ein Name ohne Endung erhält `.erd.json`.

## Aktualisieren {#updating}

Die obigen Befehle nennen keine Version, daher prüft `npx` jedes Mal, wenn der Agent den Server startet, ob auf npm eine neuere Version davon vorliegt.
Ein bereits laufender Server behält seine Version, bis der Agent ihn erneut startet.

Der Server prüft vor dem Verbinden, welche Protokollversion der Editor spricht.
Unterscheiden sich die beiden, wird jeder Aufruf, der diesen Editor erreicht, mit `protocolMismatch` abgelehnt, Lesevorgänge und `erd_list_documents` eingeschlossen, und es wird nichts geschrieben.
Die Meldung nennt die Seite, die zu aktualisieren ist: den Server oder den ERD Editor im Editor, also die Erweiterung in VS Code und das Plugin in Obsidian und einer JetBrains-IDE.

Der Server `1.0.0` oder neuer, die Erweiterung für VS Code `4.0.0` oder neuer, das Plugin für Obsidian `1.0.0` oder neuer und das Plugin für JetBrains `1.0.0` oder neuer sprechen Protokoll 2.
Jeder ältere Server spricht Protokoll 1, und ebenso jede ältere Editorversion, die Agenten bedient: die Erweiterung für VS Code von `3.0.0` bis `3.1.0`, das Plugin für Obsidian `0.1.0` und `0.2.0` sowie das Plugin für JetBrains `0.9.0` und `0.10.0`.
Ein solcher Editor und der Server `1.0.0` oder neuer lehnen einander ab, und ebenso ein älterer Server und ein Editor, der Protokoll 2 spricht.
Eine Erweiterung für VS Code vor `3.0.0` oder ein Plugin für JetBrains vor `0.9.0` bedient überhaupt keine Agenten, sodass der Agent die Dateien auf dem Datenträger bearbeitet, selbst ein darin geöffnetes Diagramm.

| Kombination | Die Meldung endet mit |
| --- | --- |
| Server `1.0.0` oder neuer mit einer Erweiterung oder einem Plugin, das Protokoll 1 spricht | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Ein älterer Server mit einer Erweiterung oder einem Plugin, das Protokoll 2 spricht | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Aktualisieren Sie den Server zusammen mit der Erweiterung oder dem Plugin.
Ein Server und ein Editor, die dasselbe Protokoll sprechen, verbinden sich, gleich welcher von beiden älter ist, aber nur der Server `1.1.0` oder neuer hat Tools für logische Namen, Domänen und die Wörterbücher – siehe [Wörterbücher](./tools.md#dictionaries).
Nur die Erweiterung für VS Code `4.2.0` oder neuer und die Plugins für Obsidian und JetBrains `1.2.0` oder neuer zeigen und behalten die logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen, die diese Tools schreiben.
Eine ältere Erweiterung oder ein älteres Plugin, das sich verbindet, ignoriert sie, obwohl der Aufruf des Agenten gelingt.
Die physischen Namen, die die Wörterbücher ableiten, und die Datentypen, die die Domänen geben, werden trotzdem übernommen.
Ein Server vor `1.1.0` liest eine Datei ohne ihre logischen Namen, Domänenverknüpfungen und Wörterbuchzeilen und lässt sie weg, wenn er die Datei auf dem Datenträger bearbeitet – siehe [Headless](./live-and-headless.md#headless).

Aktualisieren Sie ERD Editor außerdem überall dort, wo die Diagramme geöffnet werden.
Die Erweiterung für VS Code vor `4.2.0`, das Plugin für Obsidian vor `1.2.0` und das Plugin für JetBrains vor `1.2.0` öffnen ein Diagramm, das eine neuere Version gespeichert oder das der Agent auf dem Datenträger bearbeitet hat, ohne die logischen Namen seiner Tabellen und Spalten, die Domänenverknüpfungen seiner Spalten und seine Wörter, Begriffe und Domänen.
Wenn sie die Datei speichern, lassen sie diese weg.
Die Erweiterung für VS Code vor `4.0.0`, das Plugin für Obsidian vor `1.0.0` und das Plugin für JetBrains vor `1.0.0` zeigen ein solches Diagramm außerdem ohne seine Primärschlüsselsymbole an und verwerfen beim Speichern der Datei seine Tabellengruppen und die Skripte von Schema SQL.
Die Erweiterung für VS Code vor `3.1.0`, das Plugin für Obsidian vor `0.2.0` und das Plugin für JetBrains vor `0.10.0` verwerfen beim Speichern der Datei außerdem die Aktionen für ON DELETE und ON UPDATE eines Diagramms.
Starten Sie in Obsidian die App nach dem Aktualisieren des Plugins neu: Bis dahin führt ein Vault-Fenster weiterhin den ERD Editor der Plugin-Version aus, die es zuerst geladen hat.
