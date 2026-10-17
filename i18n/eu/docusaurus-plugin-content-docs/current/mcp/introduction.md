---
sidebar_position: 1
description: "Utzi Claude Code edo Codex bezalako kodetze-agente bati erd-editor diagramak editatzen @dineug/erd-editor-mcp MCP zerbitzariaren bidez, zuzenean VS Code, Obsidian edo JetBrains IDE batean, edo diskoan bertan."
---

# Sarrera

`@dineug/erd-editor-mcp` MCP zerbitzari bat da, eta kodetze-agente bati erd-editor diagramak editatzen uzten dio.
Claude Code, Codex eta [Model Context Protocol](https://modelcontextprotocol.io) protokoloaren beste edozein bezerok tresna bat jasotzen dute dokumentu baten gaineko eragiketa bakoitzeko: taula bat gehitzea, zutabe bati izena aldatzea, bi taula erlazionatzea, DDL iraulketa bat inportatzea, eskema SQL gisa berriro irakurtzea.

Dokumentua [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) edo [JetBrains IDE bat](https://plugins.jetbrains.com/plugin/23594-erd-editor) barruko ERD Editor editorean irekita dagoenean, agentea editorera batzen da, lankide bat bezala.
Aldaketa bakoitza gertatu ahala agertzen da oihalean, eta agenteak, desegitean, bere edizioak soilik leheneratzen ditu.
VS Code editoreak agentearen aldaketak gorde gabe uzten ditu agenteak edo zuk gorde arte; Obsidian aplikazioak eta JetBrains IDE batek, berriz, zure aldaketak gordetzen dituzten bezala gordetzen dituzte.
Dokumentua daukan editorerik ez badago, tresna berek fitxategia bera editatzen dute.

![Kodetze-agente bat VS Code editorean irekitako diagrama bati taulak eta erlazioak gehitzen](/img/coding-agents.webp)

## Agente batek zer egin dezakeen {#what-an-agent-can-do}

- Eskema bat sortzea edo aldatzea elkarrizketan: taulak, zutabeak eta zutabe-aukera guztiak, erlazioak beren kardinalitatearekin eta beren ON DELETE eta ON UPDATE ekintzekin, indizeak, oharrak, koloreak eta oihaleko kokapenak. Ikus [Erlazioak](./tools.md#relationships).
- Taulak [taula-taldeetan](../guide/guides/table-groups.md) biltzea: talde bat gehitzea izendatzen dituen taulen inguruan edo oihaleko eremu baten gainean, eta ondoren taldeari izena aldatzea, koloreztatzea, bere taulekin mugitzea, tamainaz aldatzea, taulak sartzea edo ateratzea, edo kentzea; taldea kentzeak haren taulak dauden lekuan uzten ditu. Ikus [Taula-taldeak](./tools.md#table-groups).
- Dokumentua ordeztea SQL DDL, GraphQL SDL, DBML edo AML formatutik analizatutako eskema batekin, edo beste `.erd.json` dokumentu batekin. Edo eskema edo dokumentu hori diagramaren azpian gehitzea eta lehendik dagoen guztia mantentzea, editorearen [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) aukerak egiten duen bezala. DBML `TableGroup` bat taula-talde gisa iristen da bi kasuetan. Ikus [Inportazioa](./tools.md#import).
- Diagrama berriro irakurtzea ID zerrenda gisa, entitate oso gisa, gordetzeak idazten duen `.erd.json` testu gisa, edo zortzi datu-baseetako edozeinen DDL gisa, [SQL eskema](../guide/guides/schema-sql.md) fitxako `Statements` eta `Header` aukerekin. Milaka taulako eskema batean, orrialde bat, taula gutxi batzuk edo taula-talde gutxi batzuen taulak irakurtzen ditu aldi bakoitzean. Ikus [Dokumentu bat irakurtzea](./tools.md#reading-a-document).
- Datu-basea, datu-basearen izena eta SQL eskeman taulen aurretik eta ondoren idazten diren [scriptak](../guide/guides/schema-sql.md#before-and-after-scripts) ezartzea, hala nola taulen aurretik `CREATE EXTENSION` sententzia edo ondoren `GRANT` sententzia. `erd_read` tresnak scriptak bakarrik ematen ditu, edo dokumentu osoaren DDLaren barruan. Ikus [Ezarpenak](./tools.md#settings).
- Hainbat edizio edizio bakar gisa exekutatzea, denak ala bat ere ez; desegite bakar batek leheneratzen ditu. Ikus [erd_batch](./tools.md#erd_batch).
- Bere edizioak desegitea eta berregitea, inoiz ez zureak.

Zer ez duen egiten:

- Zooma aldatzea, korritzea edo fitxaz aldatzea. Horiek ikusle bakoitzari dagozkio; beraz, ez dago hori egiten duen tresnarik. Hala ere, dokumentua ordezten duen inportazio batek ikuspegia mugitzen du, baita `Viewport` blokeoa aktibatuta egonda ere, editorearen `Import` aukerak egiten duen bezala: oihalaren hasierara, % 100ean, edo, `erd_import_json` tresnarekin, kargatzen duen dokumentuaren ikuspegira, eta haren fitxara ere, dokumentu horrek `Canvas Type` blokeatuta ez badu. Ikus [Inportazioa](./tools.md#import).
- [`View Option`](../guide/guides/table-related-functions.md#table-view-options) aukerak, Kode-sortzailearen lengoaia eta izenen idazkerak, mugatzaile mota, edo [Ezarpenak](../guide/guides/settings.md) fitxako `Relationship DataType Sync`, `Maximum comment width` eta `Column Order` aukerak aldatzea. Horiek zuk ezartzen dituzu editorean, eta agenteak fitxategian gordeta dauden bezala irakurtzen ditu.
- [Blokeo](../guide/guides/settings.md#lock) bat aktibatzea edo desaktibatzea. Dokumentu osoa ordezten duen `erd_import_json` tresnak soilik aldatzen ditu blokeoak edo goiko ezarpenak, kargatzen duen dokumentuarenetara. `lockSettings` eremurik ez duen dokumentu batek, hala nola `4.0.0` bertsioa baino lehenagoko VS Code luzapenak edo `1.0.0` bertsioa baino lehenagoko Obsidian edo JetBrains pluginak gordetako fitxategi batek, blokeo guztiak aktibatzen ditu. Dokumentua ordeztu duen edozein inportazio desegiteak dokumentuak lehen zituen ezarpenak eta blokeoak itzultzen ditu.
- Erlazio bat beste zutabe batzuetara berriro mapatzea, [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) aukerak egiten duen bezala. Horren ordez, agenteak erlazioa kentzen du, eta haren gako arrotzeko zutabeak beren lekuan geratzen dira; ondoren, nahi dituen zutabeak lotzen ditu `erd_link_columns` tresnarekin, desegite bakar batek leheneratzen duen `erd_batch` dei bakarrean.
- Kode-sortzailea exekutatzea. `erd_read` tresnak DDLa edo JSONa ematen du erantzun gisa, eta agenteak berak idazten du kodea hortik abiatuta.

## Nola funtzionatzen duen {#how-it-works}

Zerbitzaria zure MCP bezeroak abiarazten duen stdio prozesu bat da.
Dei bakoitzean, dokumentua daukan editore bat bilatzen du: VS Code leiho bat, Obsidian biltegi-leiho bat edo JetBrains IDE bat, bakoitza ERD Editor luzapenarekin edo pluginarekin.

- **Zuzenean** — editore batek dokumentua bere lan-eremuan, bere biltegian edo bere proiektu irekietako batean dauka, edo irekita dauka. Zerbitzaria editore horren edizio-saioan sartzen da, eta edizioa editorean gauzatzen da: VS Code editorean, gorde gabe, eta Obsidian aplikazioan eta JetBrains IDE batean, zure edizioak gordetzen diren bezala gordeta.
- **Editorerik gabe** — ez dago editorerik. Zerbitzariak fitxategia kargatzen du, edizioa aplikatzen du eta fitxategia berriro idazten du.
- **Ukatua** — editore batek dauka dokumentua, baina agente-gunea desaktibatuta du. Zerbitzariak diskotik irakurtzen du, baina ez du ezer idazten, irekita dagoen editoreak fitxategia gainidatz baitezake hurrengo gordetzean. Gunea aktibatuta duen JetBrains IDE batek ere ukatu egiten du fidagarritzat ez dituen proiektuek soilik daukaten dokumentu bat aldatzea, baina agenteak irakur dezake oraindik. Editorearen gunea aktibatuta dagoenean, baina haren ERD Editor luzapenak edo pluginak zerbitzariarenaz bestelako gune-protokolo bat erabiltzen duenean, dokumentuaren gaineko dei oro ukatzen da, irakurketak barne, `protocolMismatch` kodearekin eta eguneratu beharreko aldea izendatzen duen mezu batekin. Ikus [Eguneratzea](./installation.md#updating).

Xehetasunetarako, ikus [Zuzenean eta editorerik gabe](./live-and-headless.md).

## Eskakizunak {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` edo berriagoa, zerbitzaria exekutatzeko |
| MCP bezero bat | Claude Code, Codex edo stdio zerbitzari bat abiaraz dezakeen edozein bezero |
| VS Code, zuzeneko ediziorako | `1.101.0` edo berriagoa, ERD Editor luzapenaren `4.0.0` bertsioarekin edo berriagoarekin |
| Obsidian, zuzeneko ediziorako | Mahaigaineko aplikazioaren `1.5.7` bertsioa edo berriagoa, ERD Editor pluginaren `1.0.0` bertsioarekin edo berriagoarekin |
| JetBrains IDE bat, zuzeneko ediziorako | IntelliJ plataforman oinarritutako IDE baten `2025.2` bertsioa edo berriagoa, ERD Editor pluginaren `1.0.0` bertsioarekin edo berriagoarekin |

`1.0.0` bertsioko zerbitzariak eta goiko taulako bertsioek gune-protokoloaren 2. bertsioa erabiltzen dute.
Agenteei zerbitzua ematen dieten aurreko bertsioek protokoloaren 1. bertsioa erabiltzen dute: VS Code luzapenaren `3.0.0` bertsiotik `3.1.0` bertsiora artekoek, Obsidian pluginaren `0.1.0` eta `0.2.0` bertsioek, eta JetBrains pluginaren `0.9.0` eta `0.10.0` bertsioek.
Horrelako bertsio batek eta `1.0.0` bertsioko zerbitzariak elkar ukatzen dute, baita aurreko zerbitzari batek eta goiko taulako bertsioek ere. Ikus [Eguneratzea](./installation.md#updating).
`3.0.0` bertsioa baino lehenagoko VS Code luzapen batek edo `0.9.0` bertsioa baino lehenagoko JetBrains plugin batek ez du agente-gunerik; beraz, zerbitzariak ez du ikusten, eta diskoko fitxategia editatzen du, baita bertan irekita dagoen diagrama bat ere.

Hurrengoa: [Instalazioa](./installation.md).
