---
sidebar_position: 1
description: Laat een codeeragent zoals Claude Code of Codex erd-editor-diagrammen bewerken via de MCP-server @dineug/erd-editor-mcp, live in VS Code, Obsidian of een JetBrains-IDE, of rechtstreeks op schijf.
---

# Inleiding

`@dineug/erd-editor-mcp` is een MCP-server waarmee een codeeragent erd-editor-diagrammen kan bewerken.
Claude Code, Codex en elke andere client van het [Model Context Protocol](https://modelcontextprotocol.io) krijgen één tool per bewerking op een document: een tabel toevoegen, de naam van een kolom wijzigen, een relatie tussen twee tabellen leggen, een DDL-dump importeren, het schema als SQL teruglezen.

Als het document geopend is in de ERD Editor van [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) of een [JetBrains-IDE](https://plugins.jetbrains.com/plugin/23594-erd-editor), sluit de agent zich bij de editor aan zoals een medebewerker.
Elke wijziging verschijnt op het canvas terwijl ze gebeurt, en ongedaan maken door de agent draait alleen zijn eigen bewerkingen terug.
In VS Code blijven de wijzigingen van de agent niet opgeslagen tot de agent of jij opslaat, terwijl Obsidian en een JetBrains-IDE ze opslaan zoals ze die van jou opslaan.
Als geen editor het document bedient, bewerken dezelfde tools het bestand zelf.

![Een codeeragent die tabellen en relaties toevoegt aan een diagram dat in VS Code geopend is](/img/coding-agents.webp)

## Wat een agent kan doen {#what-an-agent-can-do}

- Een schema in een gesprek opbouwen of wijzigen: tabellen, kolommen en elke kolomoptie, relaties met hun kardinaliteit en hun acties voor ON DELETE en ON UPDATE, indexen, memo's, kleuren en posities op het canvas. Zie [Relaties](./tools.md#relationships).
- Tabellen in [tabelgroepen](../guide/guides/table-groups.md) samenbrengen: een groep toevoegen rond de tabellen die de agent noemt of over een gebied van het canvas, en daarna de naam ervan wijzigen, de groep kleuren, samen met zijn tabellen verplaatsen, de grootte ervan wijzigen, er tabellen in plaatsen of uit halen, of de groep verwijderen, waarbij zijn tabellen blijven staan waar ze staan. Zie [Tabelgroepen](./tools.md#table-groups).
- Het document vervangen door een schema dat uit SQL DDL, GraphQL SDL, DBML of AML is geparseerd, of door een ander `.erd.json`-document. Of dat schema of document onder het diagram toevoegen en alles behouden wat er al staat, zoals [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) in de editor dat doet. Een `TableGroup` uit DBML wordt in beide gevallen een tabelgroep. Zie [Importeren](./tools.md#import).
- Het diagram teruglezen als een lijst met id's, als volledige entiteiten, als de `.erd.json`-tekst die bij het opslaan wordt geschreven, of als DDL voor elk van de acht databases, met de keuzes `Statements` en `Header` van het tabblad [Schema SQL](../guide/guides/schema-sql.md). Bij een schema met duizenden tabellen leest de agent telkens een pagina, een paar tabellen of de tabellen van een paar tabelgroepen. Zie [Een document lezen](./tools.md#reading-a-document).
- De database, de databasenaam en de [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) instellen die in de Schema SQL vóór en na de tabellen worden geschreven, zoals `CREATE EXTENSION` vóór de tabellen of `GRANT` erna. `erd_read` geeft de scripts los, of binnen de DDL van het hele document. Zie [Instellingen](./tools.md#settings).
- Meerdere bewerkingen als één bewerking uitvoeren, alles of niets, die als één stap ongedaan wordt gemaakt. Zie [erd_batch](./tools.md#erd_batch).
- Zijn eigen bewerkingen ongedaan maken en opnieuw uitvoeren, nooit die van jou.

Wat de agent niet doet:

- Zoomen, scrollen of van tabblad wisselen. Die horen bij elke kijker afzonderlijk, dus geen enkele tool doet dat. Een import die het document vervangt, verplaatst de weergave toch, zelfs als `Viewport` vergrendeld is, zoals `Import` in de editor dat doet: terug naar het begin van het canvas op 100%, of, met `erd_import_json`, naar de weergave van het document dat hij laadt, en ook naar het tabblad daarvan, tenzij dat document `Canvas Type` vergrendelt. Zie [Importeren](./tools.md#import).
- [`View Option`](../guide/guides/table-related-functions.md#table-view-options), de taal en de naamnotaties van de Codegenerator, het type aanhalingstekens of de instellingen `Relationship DataType Sync`, `Maximum comment width` en `Column Order` van het tabblad [Instellingen](../guide/guides/settings.md) wijzigen. Die stel je zelf in de editor in, en de agent leest ze zoals het bestand ze opslaat.
- Een [vergrendeling](../guide/guides/settings.md#lock) in- of uitschakelen. Alleen `erd_import_json`, wanneer die het hele document vervangt, wijzigt de vergrendelingen of de instellingen hierboven, in die van het document dat hij laadt. Een document zonder veld `lockSettings`, zoals een bestand dat is opgeslagen door de VS Code-extensie vóór `4.0.0` of door de Obsidian- of JetBrains-plug-in vóór `1.0.0`, schakelt elke vergrendeling in. Het ongedaan maken van elke import die het document heeft vervangen, brengt de instellingen en vergrendelingen terug die het document eerder had.
- Een relatie opnieuw aan andere kolommen toewijzen, zoals [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) doet. In plaats daarvan verwijdert de agent de relatie, waarbij de kolommen met refererende sleutel ervan blijven staan, en koppelt hij de gewenste kolommen met `erd_link_columns`, in één `erd_batch` die als één stap ongedaan wordt gemaakt.
- De Codegenerator uitvoeren. `erd_read` geeft DDL of JSON terug, en op basis daarvan schrijft de agent zelf de code.

## Hoe het werkt {#how-it-works}

De server is een stdio-proces dat je MCP-client start.
Bij elke aanroep zoekt hij een editor die het document beheert: een VS Code-venster, een Obsidian-kluisvenster of een JetBrains-IDE, elk met de ERD Editor-extensie of -plug-in.

- **Live** — een editor heeft het document in zijn werkruimte, zijn kluis of een van zijn geopende projecten, of heeft het geopend. De server neemt deel aan de bewerkingssessie van die editor en de bewerking komt in de editor terecht: niet opgeslagen in VS Code, en opgeslagen zoals jouw eigen bewerkingen in Obsidian en een JetBrains-IDE.
- **Headless** — geen editor. De server laadt het bestand, past de bewerking toe en schrijft het bestand terug.
- **Geweigerd** — een editor beheert het document, maar zijn hub staat uit. De server leest van schijf maar schrijft niets, omdat de geopende editor het bestand de volgende keer dat hij opslaat zou kunnen overschrijven. Een JetBrains-IDE waarvan de hub aanstaat, weigert ook een document te wijzigen dat alleen in projecten staat die hij niet vertrouwt, al kan de agent het nog wel lezen. Als de hub van de editor aanstaat, maar zijn ERD Editor-extensie of -plug-in een ander hubprotocol gebruikt dan de server, wordt elke aanroep op het document geweigerd, leesopdrachten inbegrepen, met `protocolMismatch` en een bericht dat de kant noemt die moet worden bijgewerkt — zie [Bijwerken](./installation.md#updating).

Zie [Live en headless](./live-and-headless.md) voor de details.

## Vereisten {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` of later, om de server uit te voeren |
| Een MCP-client | Claude Code, Codex of elke client die een stdio-server kan starten |
| VS Code, voor live bewerken | `1.101.0` of later, met de ERD Editor-extensie `4.0.0` of later |
| Obsidian, voor live bewerken | De desktopapp `1.5.7` of later, met de ERD Editor-plug-in `1.0.0` of later |
| Een JetBrains-IDE, voor live bewerken | Een op IntelliJ gebaseerde IDE `2025.2` of later, met de ERD Editor-plug-in `1.0.0` of later |

Server `1.0.0` en de versies hierboven gebruiken hubprotocol 2.
De eerdere versies die agents bedienen, gebruiken protocol 1: de VS Code-extensie `3.0.0` tot en met `3.1.0`, de Obsidian-plug-in `0.1.0` en `0.2.0` en de JetBrains-plug-in `0.9.0` en `0.10.0`.
Zo'n versie en server `1.0.0` weigeren elkaar, en dat doen ook een eerdere server en de versies hierboven — zie [Bijwerken](./installation.md#updating).
Een VS Code-extensie vóór `3.0.0` of een JetBrains-plug-in vóór `0.9.0` heeft geen hub, dus ziet de server hem niet en bewerkt hij het bestand op schijf, zelfs een diagram dat erin geopend is.

Volgende: [Installeren](./installation.md).
