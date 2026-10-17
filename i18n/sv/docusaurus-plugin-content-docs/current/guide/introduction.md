---
sidebar_position: 1
description: erd-editor är en editor för entitetsrelationsdiagram i webbläsaren, Google Drive, VS Code, IntelliJ, Obsidian och på din egen sida.
---

# Introduktion

erd-editor är en editor för entitetsrelationsdiagram.
Den finns som webbapp, Google Drive-app, VS Code-tillägg, IntelliJ-plugin och Obsidian-plugin, och som det anpassade elementet `<erd-editor>`, som du kan bädda in på din egen sida.
Det är en och samma editor och ett och samma dokumentformat i dem alla.

![Ett butiksdiagram: pekaren hålls över en relation, en kolumn läggs till och vyn fokuserar på orders i flödet](/img/demo-overview.webp)

## Var du hittar den {#where-to-get-it}

| Plattform | Installation | Vad du får |
| --- | --- | --- |
| Webbapp | [erd-editor.io](https://erd-editor.io) | Installerbar PWA, fungerar offline, gemensam redigering i realtid |
| Google Drive | [Google Workspace Marketplace](https://workspace.google.com/marketplace/app/erd_editor/428467403360) | Lägger till ERD Editor i menyerna Open with och New i Drive och sparar tillbaka till samma fil |
| VS Code | [Marketplace](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) | Öppnar `.erd.json`-filer i en anpassad editor |
| IntelliJ | [JetBrains Marketplace](https://plugins.jetbrains.com/plugin/23594-erd-editor) | Samma editor, för IntelliJ-baserade IDE:er |
| Obsidian | [Community plugins](https://community.obsidian.md/plugins/erd-editor) | Öppnar `.erd`- och `.erd.json`-filer i en flik i valvet, endast i skrivbordsversionen |
| Din sida | `npm install @dineug/erd-editor` | Det ramverksoberoende anpassade elementet `<erd-editor>` – se [Installera](../api/installation.md) |
| Kodagenter | [`@dineug/erd-editor-mcp`](../mcp/installation.md) | En MCP-server som låter Claude Code, Codex eller en annan klient redigera ett diagram live i VS Code, en JetBrains-IDE eller Obsidian, eller i själva filen |

För att prova den i en IDE skapar du en tom fil med filändelsen `.erd.json` och öppnar den.
I Obsidian kör du `ERD Editor: Create new diagram` från kommandopaletten eller väljer `New ERD` i snabbmenyn för en mapp i filutforskaren. Båda skapar en tom `.erd`-fil och öppnar den.
I Google Drive väljer du New → More → ERD Editor och loggar sedan in med Google. ERD Editor kommer bara åt de filer som du skapar eller öppnar med den.
I webbappen, Google Drive, VS Code, en JetBrains-IDE och Obsidian öppnas ett nytt, tomt diagram på [välkomstskärmen](./guides/editing-start.md#welcome-screen), en meny med första steg: `New Table`, `New Memo`, `Import`, `Command Palette` och `Shortcuts`.
Att rulla, zooma och byta flik lämnar den tomma filen för ett nytt diagram som den är, eftersom alla lås är på i ett nytt diagram. Se [Lås](./guides/settings.md#lock).
VS Code öppnar en ERD-fil som JSON-text i Source Control, Local History och Compare with Saved, i granskningen av ändringar från chatten i VS Code och från kodagenter som GitHub Copilot och Claude Code, och i revisionsvyerna i tillägg som GitLens, GitHub Pull Requests och Git Graph, så att en ändring jämförs rad för rad. `Reopen Editor With...` visar en Git-revision som ett skrivskyddat diagram.

Starta om Obsidian när du har uppdaterat Obsidian-pluginet: fram till dess behåller fönstret den editor som den tidigare versionen läste in.
Uppdatera ERD Editor överallt där du delar diagram: en version från tiden före tabellgrupper visar inga primärnyckelikoner i en fil som den aktuella versionen har sparat, och om filen sparas där försvinner dess tabellgrupper och Schema SQL-skript.
En fil som en sådan version har sparat skrivs om i det aktuella formatet vid den första ändring som filen behåller – se [Lås](./guides/settings.md#lock). Fram till dess rapporterar en JSON-editor som validerar filen mot dess `$schema` att den är ogiltig.

## Vad den gör {#what-it-does}

- Rita tabeller, kolumner och anteckningar på en obegränsad arbetsyta och koppla ihop dem med fyra relationstyper: `Zero One`, `Zero N`, `One Only`, `One N`. Se [Börja redigera](./guides/editing-start.md). Index definieras i tabellens egenskapspanel. Ett unikt index över två eller fler kolumner är en alternativ nyckel, och när visningsalternativet `Alternate Key` är på märker diagrammet dess kolumner med `AK1.1`, `AK1.2` och så vidare. Se [Index](./guides/table-related-functions.md#indexes) och [Alternativa nycklar](./guides/table-related-functions.md#alternate-keys).
- Låt en relation sluta i kolumner som en tabell redan har: medan du ritar en med en mus eller en penna parar `Map to existing columns`, bredvid tabellen där den slutar, ihop föräldratabellens nyckel med den tabellens kolumner, och `Create new columns` lägger till nya. `Map Columns` i en relations snabbmeny ändrar dess kolumner i efterhand. Se [Mappa kolumner](./guides/relationship-editing.md#map-columns). En relation kan också ha åtgärderna ON DELETE och ON UPDATE. Se [ON DELETE och ON UPDATE](./guides/relationship-editing.md#on-delete-and-on-update).
- Redigera snabbt: `Alt + N` lägger till en tabell; `Alt + Enter` lägger till en kolumn; `Alt + K` slår på och av primärnyckeln för den fokuserade kolumnen, eller för varje markerad kolumn när den är en av dem; och `Delete` eller `Backspace` tar bort markeringen. Varje kortkommando ångras i ett steg. Se [Kortkommandon](./guides/settings.md#shortcuts). [Arbetsytans verktygsfält](./guides/table-related-functions.md#canvas-toolbar) längst ned på arbetsytan lägger också till en tabell eller en anteckning med ett klick.
- Färglägg en tabell, en anteckning eller en tabellgrupp med en färgväljare som har förinställda färger och de färger som diagrammet redan använder, och ta bort en färg med `No color` eller `Remove color`. Se [Ange färg för tabeller och anteckningar](./guides/table-related-functions.md#table-and-memo-color-specification).
- Samla relaterade tabeller i [tabellgrupper](./guides/table-groups.md): en ruta bakom dem som du kan namnge och färglägga. Rita en med `Alt + G` eller med `New Table Group` i arbetsytans snabbmeny, arbetsytans verktygsfält eller snabbsökningen, eller skapa en grupp av de markerade tabellerna med `T` och sedan `G` eller med `Group selected tables` i deras snabbmeny. En tabell går med i en grupp när du släpper den inuti gruppen och lämnar gruppen när du släpper den utanför, och om du drar en grupp i namnlisten följer dess tabeller med. DBML för över grupper åt båda hållen, som block av typen `TableGroup`.
- Importera ett befintligt schema från `json`, `Schema SQL`, `GraphQL`, `DBML` eller `AML`. Se [Importera eller exportera filer](./guides/file-import-export.md). En Schema SQL-, GraphQL-, DBML- eller AML-fil läses in med tabellerna placerade längs relationerna, eller i rader när den inte har några. [`Import and Add`](./guides/file-import-export.md#import-and-add) lägger till en fil under diagrammet i stället för att ersätta det.
- Exportera diagrammet som `json`; som Schema SQL från fliken [Schema SQL](./guides/schema-sql.md#saving-or-copying-the-sql), sparad som en `.sql`-fil eller kopierad; eller från dialogrutan [`Export image`](./guides/file-import-export.md#image) som en PNG- eller SVG-bild, eller som en PNG-bild i Urklipp.
- Skriv Schema SQL i syntaxen för åtta databassystem: Databricks, MSSQL, MariaDB, MySQL, Oracle, PostgreSQL, Snowflake och SQLite. Se [Tabellfunktioner](./guides/table-related-functions.md#databases). Alternativpanelen på fliken [Schema SQL](./guides/schema-sql.md) väljer vilka satser, vilken inledning och vilka tabellgrupper som ska skrivas, och rymmer din egen SQL-kod, sparad i diagrammet, som skrivs före och efter tabellerna.
- Generera kod för tjugotvå mål: språken C#, Go, Java, Kotlin, PHP, Rust, Scala, Swift och TypeScript; ORM-ramverken Doctrine, Drizzle, JPA, SeaORM, Sequelize, SQLAlchemy och TypeORM; och AML, DBML, GraphQL, JSON Schema, Mermaid och Zod. Alternativpanelen på fliken Kodgenerator väljer språk, databas och skiftlägen för namn, och koden sparas som en fil med språkets filändelse eller kopieras. Se [Kodgenerator](./guides/code-generator.md).
- Läs schemat på fliken [Visualisering](./guides/visualization.md), i `Graph` som en kraftbaserad graf eller i `Flow` som ett flöde av tabellkort placerade längs sina relationer, där allt som en tabell berör lyses upp när du håller pekaren över den. Tryck på `Alt + F` på ERD-fliken för att [fokusera på de markerade tabellerna](./guides/visualization.md#focusing-on-tables) och tabellerna som är relaterade till dem.
- Arbeta på en arbetsyta utan kanter: panorera överallt dit diagrammet når, zooma från `10%` till `150%` med `Ctrl + Wheel` (`⌘ + Wheel` på Mac), tangentbordet eller en nypgest, och rensa bort allt utom diagrammet med zenläget. Att dra med mittenknappen panorerar från var som helst på arbetsytan, även över en tabell. Se [Navigera på arbetsytan](./guides/table-related-functions.md#getting-around-the-canvas).
- Ordna ett helt diagram i ett steg med [automatisk layout](./guides/table-related-functions.md#auto-layout): en kraftsimulering, ett flöde från vänster till höger eller ett träd i endera riktningen, där varje tabellgrupp hålls samman.
- Kör ett kommando var du än är med [snabbsökningen](./guides/quick-search.md), eller börja sökningen med `#`, `@` eller `:` för att hoppa till en tabell, en kolumn eller en kommentar eller anteckning. Stega igenom redigeringshistoriken med [Ångra och Gör om](./guides/undo-redo.md), spela upp den här sessionens historik på arbetsytan med [tidsresan](./guides/undo-redo.md#time-travel) eller jämför diagrammet med en annan `.json`-fil i [diff-visaren](./guides/table-related-functions.md#diff-viewer). Diff-visarens träd, bredvid de två versionerna, listar de tabeller, kolumner, index, sekundärnycklar, anteckningar och tabellgrupper som har lagts till, ändrats, tagits bort eller bytt namn.
- Bläddra i diagrammet i [utforskaren](./guides/explorer.md), ett träd som är dockat vid arbetsytans vänsterkant: tabellerna, var och en med sina kolumner, index och sekundärnycklar, och sedan tabellgrupperna och anteckningarna. Klicka på en rad för att gå till det den representerar på arbetsytan; en rad för en sekundärnyckel lyser även upp dess relation. Knappen `Explorer` i verktygsfältet, bredvid `Search`, öppnar och stänger den.
- Hitta text med funktionen [Sök och ersätt](./guides/find-and-replace.md) högst upp i utforskaren. Den söker i namn på tabeller, kolumner, index och tabellgrupper, och i kommentarer och anteckningar när du slår på dem, och visar träffarna i utforskarens träd. Ersätt en träff eller alla; `Preserve Case` ger varje ersättning skiftläget hos texten den ersätter. `Ctrl + F` (`⌘ + F` på Mac) öppnar utforskaren med textmarkören i sökfältet, och om du trycker på det igen stängs utforskaren.
- Använd editorn på 25 språk, som du väljer med knappen `Display Language` i verktygsfältet eller i snabbsökningen. `System` följer språket i webbläsaren eller värdprogrammet, och på arabiska, hebreiska och persiska läggs editorn ut från höger till vänster medan diagrammet förblir från vänster till höger. Bara editorns egen text ändras: namn, SQL och genererad kod lämnas som de är skrivna. Med temaverktyget i verktygsfältet väljer du utseende (`System`, `Light` eller `Dark`), en gråton och en accentfärg. Se [Språk och tema](./guides/language-and-theme.md).
- Håll diffarna rena: rullningspositionen och zoomnivån, den öppna fliken, kodgeneratorns språk och skiftlägen för namn samt typen av citattecken är [låsta](./guides/settings.md#lock) som standard, så filen behåller de värden de hade när de låstes, och rullning, zoomning eller flikbyten ändrar den aldrig. Filen skrivs i en fast ordning och utelämnar uppmätta bredder, staplingsordningen, relationslinjernas fästpunkter och borttagna objekt, så om du öppnar ett diagram och stänger det utan att redigera lämnas filen som den var.
- Låt en kodagent som Claude Code eller Codex redigera diagrammet via [MCP-servern](../mcp/introduction.md): live i VS Code, Obsidian eller en JetBrains-IDE, där varje ändring syns på arbetsytan medan den sker, eller i själva filen.
- Redigera tillsammans i realtid i webbappen (experimentellt). Sessionerna är peer-to-peer och end-to-end-krypterade, så ingen server lagrar ditt schema, och deltagarna ser varandras markörer, fokus och markeringar. På din egen sida ger [`getSharedStore()`](../api/advanced/collaborative-editing.md) dig samma ström av åtgärder över den transport du väljer.

Börja med [redigeringsguiden](/docs/category/guides).

## Bakgrunden till projektet {#reason-behind-this-project}

Befintliga modelleringsverktyg erbjöd inte den nivå av användarupplevelse som jag önskade.  
Därför startade jag det här projektet för att leverera den ultimata användarupplevelsen.  
Projektets högsta prioritet är användarens redigeringsupplevelse.  
Det kommer att ge dig en häpnadsväckande upplevelse när du redigerar.
