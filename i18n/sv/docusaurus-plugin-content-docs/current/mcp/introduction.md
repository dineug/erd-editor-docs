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
- Namnge tabeller och kolumner utifrån orden och termerna på fliken [Ordlista](../guide/guides/dictionary.md) i editorn och koppla kolumner till flikens domäner, som ger dem deras datatyper. Den anger tabellers och kolumners [logiska namn](../guide/guides/logical-names.md), och ordlistorna härleder de fysiska namnen från dem på samma sätt som i editorn, men ett fysiskt namn som har skrivits för hand står kvar om det inte är tomt. Den lägger till, ändrar och tar bort domäner, ord och termer, och när ett ord eller en term har ändrats härleder den de fysiska namnen igen för en kolumn, en tabell eller hela dokumentet. Den listar det som bladet `Checks` på fliken hittar: förbjudna, oregistrerade och synonyma ord; namn som två rader i samma ordlista delar; kopplingar till en domän som dokumentet inte listar; fysiska namn som skiljer sig från det som deras term ger samt kolumner som avviker från sin domäns datatyp. Se [Ordlistor](./tools.md#dictionaries) och [Ordlistornas kontroller](./tools.md#dictionary-checks).
- Ersätta dokumentet med ett schema som har tolkats från SQL DDL, GraphQL SDL, DBML eller AML, eller med ett annat `.erd.json`-dokument. Eller lägga till det schemat eller dokumentet under diagrammet och behålla allt som redan finns där, som editorns [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) gör. En `TableGroup` i DBML importeras som en tabellgrupp i båda fallen. Ett schema som ersätter dokumentet behåller dokumentets ordlistor, ett dokument som ersätter det tar med sig sina egna och en import som lägger till tar inte med sig några. Se [Import](./tools.md#import).
- Läsa tillbaka diagrammet, med dess logiska namn och rader i ordlistorna, som en lista med id:n, som hela entiteter eller som den `.erd.json`-text som skrivs när dokumentet sparas. Eller läsa det som DDL-kod för vilken som helst av de åtta databaserna, med valen `Statements` och `Header` på fliken [Schema SQL](../guide/guides/schema-sql.md) och flikens växlingsknapp [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). I ett schema med tusentals tabeller läser den en sida, några tabeller eller tabellerna i några tabellgrupper i taget. Se [Läsa ett dokument](./tools.md#reading-a-document).
- Ange databasen, databasnamnet och de [skript](../guide/guides/schema-sql.md#before-and-after-scripts) som skrivs före och efter tabellerna i Schema SQL, till exempel `CREATE EXTENSION` före dem eller `GRANT` efter dem. `erd_read` returnerar skripten för sig eller i DDL-koden för hela dokumentet. Se [Inställningar](./tools.md#settings).
- Köra flera redigeringar som en enda, allt eller inget, som ångras i ett steg. Se [erd_batch](./tools.md#erd_batch).
- Ångra och göra om sina egna redigeringar, aldrig dina.

Det här gör den inte:

- Zooma, rulla eller byta flik. Det hör till varje enskild betraktare, så inget verktyg gör det. En import som ersätter dokumentet flyttar ändå vyn, även när `Viewport` är låst, som editorns `Import` gör: tillbaka till början av arbetsytan vid 100 %, eller, med `erd_import_json`, till vyn i det dokument som läses in, och även till dess flik om inte det dokumentet låser `Canvas Type`. Se [Import](./tools.md#import).
- Byta [namnvisning](../guide/guides/logical-names.md#switching-the-view) mellan `Physical Names`, `Logical Names` och `Both Names`. Den hör till varje enskild betraktare medan dess [lås](../guide/guides/settings.md#lock) är på, som det är i ett nytt diagram, och när låset är av väljer du den själv i editorn, så inget verktyg gör det. Agenten läser och skriver logiska namn oavsett vilken visning som gäller. En `erd_import_json` som ersätter dokumentet tar med sig namnvisningen från det dokument som läses in bara när `Name View` är upplåst i det dokumentet.
- Ändra [`View Option`](../guide/guides/table-related-functions.md#table-view-options), kodgeneratorns språk och skiftlägen för namn, typen av citattecken eller `Relationship DataType Sync`, `Maximum comment width` och `Column Order` på fliken [Inställningar](../guide/guides/settings.md). Dem ställer du själv in i editorn, och agenten läser dem så som filen sparar dem.
- Slå på eller av ett [lås](../guide/guides/settings.md#lock). Bara när `erd_import_json` ersätter hela dokumentet ändras låsen eller inställningarna ovan, till dem i det dokument som läses in. Ett dokument utan fältet `lockSettings`, till exempel en fil som har sparats av VS Code-tillägget före `4.0.0` eller av Obsidian- eller JetBrains-pluginet före `1.0.0`, slår på alla lås. Att ångra vilken import som helst som ersatte dokumentet återställer de inställningar och lås som dokumentet hade innan.
- Mappa om en relation till andra kolumner, som [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) gör. I stället tar agenten bort relationen, vilket lämnar kvar dess sekundärnyckelkolumner, och länkar de önskade kolumnerna med `erd_link_columns`, i en enda `erd_batch` som ångras i ett steg.
- Importera eller exportera en ordlista som CSV, sortera ett blad eller infoga rader ovanför eller nedanför en rad, som fliken [Ordlista](../guide/guides/dictionary.md) gör. Agenten lägger till, ändrar och tar bort rader, många åt gången i en enda `erd_batch`, och en ny rad hamnar sist i sitt blad.
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

Servern i version `1.0.0` eller senare och versionerna ovan använder hubbprotokoll 2.
De tidigare versioner som betjänar agenter använder protokoll 1: VS Code-tillägget `3.0.0` till `3.1.0`, Obsidian-pluginet `0.1.0` och `0.2.0` samt JetBrains-pluginet `0.9.0` och `0.10.0`.
En sådan version och servern i version `1.0.0` eller senare nekar varandra, och det gör även en tidigare server och versionerna ovan – se [Uppdatera](./installation.md#updating).
Ett VS Code-tillägg före `3.0.0` eller ett JetBrains-plugin före `0.9.0` har ingen hubb, så servern ser det inte och redigerar filen på disken, även ett diagram som är öppet i det.

Verktygen för logiska namn, domäner och ordlistorna kräver servern i version `1.1.0` eller senare och, överallt där dokumentet är öppet, minst VS Code-tillägget `4.2.0` eller Obsidian- eller JetBrains-pluginet `1.2.0`.
Bland versionerna ovan låter ett tillägg före `4.2.0` eller ett plugin före `1.2.0` fortfarande agenten redigera live, eftersom det använder protokoll 2, men det ignorerar de logiska namn, domänkopplingar och rader i ordlistorna som agenten skriver och utelämnar dem när det sparar filen.
En server före `1.1.0` som redigerar en fil på disken skriver tillbaka den utan dess logiska namn, domänkopplingar och rader i ordlistorna – se [Uppdatera](./installation.md#updating).

Nästa steg: [Installera](./installation.md).
