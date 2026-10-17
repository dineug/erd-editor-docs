---
sidebar_position: 1
description: Låt en kodagent som Claude Code eller Codex redigera erd-editor-diagram via MCP-servern @dineug/erd-editor-mcp, live i VS Code, Obsidian eller en JetBrains-IDE, eller direkt på disken.
---

# Introduktion

`@dineug/erd-editor-mcp` är en MCP-server som låter en kodagent redigera erd-editor-diagram.
Claude Code, Codex och alla andra klienter för [Model Context Protocol](https://modelcontextprotocol.io) får ett verktyg per operation på ett dokument: lägga till en tabell, byta namn på en kolumn, skapa en relation mellan två tabeller, importera en DDL-dump, läsa tillbaka schemat som SQL.

När dokumentet är öppet i ERD Editor i [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) eller en [JetBrains-IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor) ansluter agenten till editorn som en medarbetare.
Varje ändring syns på arbetsytan i samma stund som den görs, och agentens ångring återställer bara dess egna redigeringar.
VS Code behåller agentens ändringar osparade tills agenten eller du sparar, medan Obsidian och en JetBrains-IDE sparar dem som de sparar dina egna.
Utan någon editor för dokumentet redigerar samma verktyg själva filen.

![En kodagent som lägger till tabeller och relationer i ett diagram som är öppet i VS Code](/img/coding-agents.webp)

## Vad en agent kan göra {#what-an-agent-can-do}

- Bygga eller ändra ett schema i en konversation: tabeller, kolumner och alla kolumnalternativ, relationer med sin kardinalitet och sina åtgärder för ON DELETE och ON UPDATE, index, anteckningar, färger och positioner på arbetsytan. Se [Relationer](./tools.md#relationships).
- Samla tabeller i [tabellgrupper](../guide/guides/table-groups.md): lägga till en grupp runt de tabeller som agenten anger eller över ett område på arbetsytan, och sedan byta namn på den, färglägga den, flytta den med dess tabeller, ändra dess storlek, lägga in tabeller i den, ta ut tabeller ur den eller ta bort den, vilket lämnar kvar dess tabeller där de är. Se [Tabellgrupper](./tools.md#table-groups).
- Ersätta dokumentet med ett schema som har tolkats från SQL DDL, GraphQL SDL, DBML eller AML, eller med ett annat `.erd.json`-dokument. Eller lägga till det schemat eller dokumentet under diagrammet och behålla allt som redan finns där, som editorns [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) gör. En `TableGroup` i DBML importeras som en tabellgrupp i båda fallen. Se [Import](./tools.md#import).
- Läsa tillbaka diagrammet som en lista med id:n, som hela entiteter, som den `.erd.json`-text som skrivs när dokumentet sparas eller som DDL-kod för vilken som helst av de åtta databaserna, med valen `Statements` och `Header` på fliken [Schema SQL](../guide/guides/schema-sql.md). I ett schema med tusentals tabeller läser den en sida, några tabeller eller tabellerna i några tabellgrupper i taget. Se [Läsa ett dokument](./tools.md#reading-a-document).
- Ange databasen, databasnamnet och de [skript](../guide/guides/schema-sql.md#before-and-after-scripts) som skrivs före och efter tabellerna i Schema SQL, till exempel `CREATE EXTENSION` före dem eller `GRANT` efter dem. `erd_read` returnerar skripten för sig eller i DDL-koden för hela dokumentet. Se [Inställningar](./tools.md#settings).
- Köra flera redigeringar som en enda, allt eller inget, som ångras i ett steg. Se [erd_batch](./tools.md#erd_batch).
- Ångra och göra om sina egna redigeringar, aldrig dina.

Det här gör den inte:

- Zooma, rulla eller byta flik. Det hör till varje enskild betraktare, så inget verktyg gör det. En import som ersätter dokumentet flyttar ändå vyn, även när `Viewport` är låst, som editorns `Import` gör: tillbaka till början av arbetsytan vid 100 %, eller, med `erd_import_json`, till vyn i det dokument som läses in, och även till dess flik om inte det dokumentet låser `Canvas Type`. Se [Import](./tools.md#import).
- Ändra [`View Option`](../guide/guides/table-related-functions.md#table-view-options), kodgeneratorns språk och skiftlägen för namn, typen av citattecken eller `Relationship DataType Sync`, `Maximum comment width` och `Column Order` på fliken [Inställningar](../guide/guides/settings.md). Dem ställer du själv in i editorn, och agenten läser dem så som filen sparar dem.
- Slå på eller av ett [lås](../guide/guides/settings.md#lock). Bara när `erd_import_json` ersätter hela dokumentet ändras låsen eller inställningarna ovan, till dem i det dokument som läses in. Ett dokument utan fältet `lockSettings`, till exempel en fil som har sparats av VS Code-tillägget före `4.0.0` eller av Obsidian- eller JetBrains-pluginet före `1.0.0`, slår på alla lås. Att ångra vilken import som helst som ersatte dokumentet återställer de inställningar och lås som dokumentet hade innan.
- Mappa om en relation till andra kolumner, som [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) gör. I stället tar agenten bort relationen, vilket lämnar kvar dess sekundärnyckelkolumner, och länkar de önskade kolumnerna med `erd_link_columns`, i en enda `erd_batch` som ångras i ett steg.
- Köra kodgeneratorn. `erd_read` svarar med DDL eller JSON, och agenten skriver själv kod utifrån det.

## Hur det fungerar {#how-it-works}

Servern är en stdio-process som din MCP-klient startar.
Vid varje anrop letar den efter en editor som innehåller dokumentet: ett VS Code-fönster, ett valvfönster i Obsidian eller en JetBrains-IDE, var och en med tillägget eller pluginet ERD Editor.

- **Live** – en editor har dokumentet i sitt arbetsområde, sitt valv eller ett av sina öppna projekt, eller har det öppet. Servern ansluter till den editorns redigeringssession och redigeringen hamnar i editorn: osparad i VS Code och sparad på samma sätt som dina egna redigeringar i Obsidian och en JetBrains-IDE.
- **Headless** – ingen editor. Servern läser in filen, tillämpar redigeringen och skriver tillbaka filen.
- **Nekad** – en editor innehåller dokumentet men har hubben avstängd. Servern läser från disken men skriver ingenting, eftersom den öppna editorn kan skriva över filen nästa gång den sparar. En JetBrains-IDE med hubben på nekar också ändringar av ett dokument som bara finns i projekt som den inte litar på, men agenten kan fortfarande läsa det. När editorns hubb är på men dess tillägg eller plugin ERD Editor använder ett annat hubbprotokoll än servern nekas varje anrop som gäller dokumentet, även läsningar, med `protocolMismatch` och ett meddelande som anger vilken sida som ska uppdateras – se [Uppdatera](./installation.md#updating).

Se [Live och headless](./live-and-headless.md) för detaljerna.

## Krav {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` eller senare, för att köra servern |
| En MCP-klient | Claude Code, Codex eller vilken klient som helst som kan starta en stdio-server |
| VS Code, för live-redigering | `1.101.0` eller senare, med tillägget ERD Editor `4.0.0` eller senare |
| Obsidian, för live-redigering | Skrivbordsappen `1.5.7` eller senare, med pluginet ERD Editor `1.0.0` eller senare |
| En JetBrains-IDE, för live-redigering | En IntelliJ-baserad IDE `2025.2` eller senare, med pluginet ERD Editor `1.0.0` eller senare |

Servern i version `1.0.0` och versionerna ovan använder hubbprotokoll 2.
De tidigare versioner som betjänar agenter använder protokoll 1: VS Code-tillägget `3.0.0` till `3.1.0`, Obsidian-pluginet `0.1.0` och `0.2.0` samt JetBrains-pluginet `0.9.0` och `0.10.0`.
En sådan version och servern i version `1.0.0` nekar varandra, och det gör även en tidigare server och versionerna ovan – se [Uppdatera](./installation.md#updating).
Ett VS Code-tillägg före `3.0.0` eller ett JetBrains-plugin före `0.9.0` har ingen hubb, så servern ser det inte och redigerar filen på disken, även ett diagram som är öppet i det.

Nästa steg: [Installera](./installation.md).
