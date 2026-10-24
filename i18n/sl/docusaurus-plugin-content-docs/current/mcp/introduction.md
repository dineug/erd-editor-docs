---
sidebar_position: 1
description: Omogočite agentu za kodiranje, kot je Claude Code ali Codex, da prek strežnika MCP @dineug/erd-editor-mcp ureja diagrame erd-editor v živo v VS Code, aplikaciji Obsidian ali razvojnem okolju JetBrains ali neposredno na disku.
---

# Uvod

`@dineug/erd-editor-mcp` je strežnik MCP, ki agentu za kodiranje omogoča urejanje diagramov erd-editor.
Claude Code, Codex in vsak drug odjemalec protokola [Model Context Protocol](https://modelcontextprotocol.io) dobijo po eno orodje za vsako operacijo na dokumentu: dodajanje tabele, preimenovanje stolpca, povezovanje dveh tabel z relacijo, uvoz izpisa DDL, branje sheme nazaj v obliki kode SQL.

Ko je dokument odprt v urejevalniku ERD Editor v [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [aplikaciji Obsidian](https://community.obsidian.md/plugins/erd-editor) ali [razvojnem okolju JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), se agent pridruži urejevalniku kot sodelavec.
Vsaka sprememba se na platnu prikaže takoj, ko se zgodi, razveljavitev agenta pa razveljavi samo njegove lastne spremembe.
VS Code pusti spremembe agenta neshranjene, dokler jih ne shrani agent ali jih ne shranite vi, aplikacija Obsidian in razvojno okolje JetBrains pa jih shranjujeta tako, kot shranjujeta vaše.
Če dokumenta ne streže noben urejevalnik, ista orodja urejajo neposredno datoteko.

![Agent za kodiranje, ki dodaja tabele in relacije v diagram, odprt v VS Code](/img/coding-agents.webp)

## Kaj zmore agent {#what-an-agent-can-do}

- V pogovoru zgradi ali spremeni shemo: tabele, stolpce in vse možnosti stolpcev, relacije z njihovo kardinalnostjo in njihovimi dejanji ON DELETE in ON UPDATE, indekse, beležke, barve in položaje na platnu. Glejte razdelek [Relacije](./tools.md#relationships).
- Združi tabele v [skupine tabel](../guide/guides/table-groups.md): doda skupino okoli tabel, ki jih navede, ali čez območje platna, nato jo preimenuje, pobarva, premakne skupaj z njenimi tabelami, ji spremeni velikost, vanjo doda tabele ali jih iz nje vzame ali pa jo odstrani, pri čemer njene tabele ostanejo tam, kjer so. Glejte razdelek [Skupine tabel](./tools.md#table-groups).
- Poimenuje tabele in stolpce z besedami in izrazi zavihka [Slovar](../guide/guides/dictionary.md) urejevalnika ter poveže stolpce z njegovimi domenami, ki jim dajo podatkovne tipe. Nastavi [logična imena](../guide/guides/logical-names.md) tabel in stolpcev, slovarji pa iz njih izpeljejo fizična imena tako kot v urejevalniku, čeprav ročno vneseno fizično ime ostane, razen če je prazno. Dodaja, spreminja in odstranjuje domene, besede in izraze, po spremembi besede ali izraza pa znova izpelje fizična imena za en stolpec, eno tabelo ali celoten dokument. Navede, kar najde list `Checks` na zavihku: prepovedane besede, neregistrirane besede in sopomenke; imena, ki si jih delita dve vrstici istega slovarja; povezave z domeno, ki je dokument ne navaja; fizična imena, ki se razlikujejo od tistega, ki ga da njihov izraz; ter stolpce, ki odstopajo od podatkovnega tipa svoje domene. Glejte razdelka [Slovarji](./tools.md#dictionaries) in [Preverjanja slovarjev](./tools.md#dictionary-checks).
- Zamenja dokument s shemo, razčlenjeno iz SQL DDL, GraphQL SDL, DBML ali AML, ali z drugim dokumentom `.erd.json`. Ali pa to shemo ali dokument doda pod diagram in ohrani vse, kar je že v njem, tako kot ukaz [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) urejevalnika. `TableGroup` iz DBML v obeh primerih postane skupina tabel. Shema, ki zamenja dokument, ohrani slovarje dokumenta, dokument, ki ga zamenja, prinese svoje, dodajanje pa ne prinese nobenih. Glejte razdelek [Uvoz](./tools.md#import).
- Diagram prebere nazaj, z njegovimi logičnimi imeni in vrsticami slovarjev, kot seznam identifikatorjev, kot cele entitete ali kot besedilo `.erd.json`, ki ga zapiše shranjevanje. Ali pa ga prebere kot DDL za katero koli od osmih zbirk podatkov, z možnostma `Statements` in `Header` zavihka [Shema SQL](../guide/guides/schema-sql.md) in njegovim stikalom [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). Pri shemi s tisoči tabel naenkrat prebere eno stran, nekaj tabel ali tabele nekaj skupin tabel. Glejte razdelek [Branje dokumenta](./tools.md#reading-a-document).
- Nastavi zbirko podatkov, ime zbirke podatkov in [skripte](../guide/guides/schema-sql.md#before-and-after-scripts), ki se v Shemi SQL zapišejo pred tabelami in za njimi, na primer `CREATE EXTENSION` pred njimi ali `GRANT` za njimi. Orodje `erd_read` vrne skripte same ali znotraj DDL celotnega dokumenta. Glejte razdelek [Nastavitve](./tools.md#settings).
- Več sprememb izvede kot eno, vse ali nič, ena razveljavitev pa jih razveljavi skupaj. Glejte razdelek [erd_batch](./tools.md#erd_batch).
- Razveljavi in znova uveljavi svoje lastne spremembe, nikoli vaših.

Česa ne počne:

- Spreminjanja povečave, pomikanja ali preklapljanja zavihkov. Ta dejanja pripadajo vsakemu gledalcu posebej, zato jih ne izvaja nobeno orodje. Uvoz, ki zamenja dokument, kljub temu premakne pogled, tudi ko je nastavitev `Viewport` zaklenjena, tako kot ukaz `Import` urejevalnika: nazaj na začetek platna pri 100 % ali pri orodju `erd_import_json` na pogled dokumenta, ki ga naloži, in tudi na njegov zavihek, razen če ima ta dokument vklopljen zaklep `Canvas Type`. Glejte razdelek [Uvoz](./tools.md#import).
- Preklapljanja [prikaza imen](../guide/guides/logical-names.md#switching-the-view) med prikazi `Physical Names`, `Logical Names` in `Both Names`. Dokler je njegov [zaklep](../guide/guides/settings.md#lock) vklopljen, kot je v novem diagramu, pripada vsakemu gledalcu posebej, ko je zaklep izklopljen, pa ga izberete vi v urejevalniku, zato tega ne počne nobeno orodje. Agent bere in zapisuje logična imena ne glede na prikaz. Orodje `erd_import_json`, ki zamenja dokument, prinese prikaz imen dokumenta, ki ga naloži, samo, kadar ima ta dokument izklopljen zaklep `Name View`.
- Spreminjanja stikal [`View Option`](../guide/guides/table-related-functions.md#table-view-options), jezika in zapisa imen generatorja kode, vrste narekovajev ali možnosti `Relationship DataType Sync`, `Maximum comment width` in `Column Order` na zavihku [Nastavitve](../guide/guides/settings.md). Te nastavitve so vaše in jih določite v urejevalniku, agent pa jih prebere tako, kot jih shrani datoteka.
- Vklapljanja ali izklapljanja [zaklepa](../guide/guides/settings.md#lock). Zaklepe ali zgornje nastavitve spremeni samo orodje `erd_import_json`, ko zamenja celoten dokument, in sicer v tiste iz dokumenta, ki ga naloži. Dokument brez polja `lockSettings`, na primer datoteka, ki jo je shranila razširitev za VS Code pred različico `4.0.0` ali vtičnik za Obsidian ali JetBrains pred različico `1.0.0`, vklopi vse zaklepe. Razveljavitev katerega koli uvoza, ki je zamenjal dokument, povrne nastavitve in zaklepe, ki jih je dokument imel prej.
- Ponovne preslikave relacije na druge stolpce, kot to naredi okno [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Namesto tega agent odstrani relacijo, pri čemer njeni stolpci tujega ključa ostanejo na mestu, in z orodjem `erd_link_columns` poveže stolpce, ki jih želi, vse v enem klicu `erd_batch`, ki ga razveljavi ena razveljavitev.
- Uvoza ali izvoza slovarja v obliki CSV, razvrščanja lista ali vstavljanja vrstic nad vrstico ali pod njo, kot to naredi zavihek [Slovar](../guide/guides/dictionary.md). Agent dodaja, spreminja in odstranjuje vrstice, tudi več hkrati v enem klicu `erd_batch`, nova vrstica pa se doda na konec svojega lista.
- Zaganjanja generatorja kode. Orodje `erd_read` vrne DDL ali JSON, agent pa iz tega sam napiše kodo.

## Kako deluje {#how-it-works}

Strežnik je proces stdio, ki ga zažene vaš odjemalec MCP.
Ob vsakem klicu poišče urejevalnik, ki ima dokument: okno VS Code, okno trezorja v aplikaciji Obsidian ali razvojno okolje JetBrains, vsako z razširitvijo ali vtičnikom ERD Editor.

- **V živo** – urejevalnik ima dokument v svojem delovnem prostoru, trezorju ali enem od svojih odprtih projektov ali pa ga ima odprtega. Strežnik se pridruži seji urejanja tega urejevalnika, sprememba pa se izvede v urejevalniku: v VS Code ostane neshranjena, v aplikaciji Obsidian in razvojnem okolju JetBrains pa se shrani tako, kot se shranijo vaše spremembe.
- **Brez vmesnika** – ni urejevalnika. Strežnik naloži datoteko, izvede spremembo in datoteko zapiše nazaj.
- **Zavrnjeno** – urejevalnik ima dokument, vendar ima izklopljeno središče. Strežnik bere z diska, ne zapiše pa ničesar, ker bi odprti urejevalnik lahko ob naslednjem shranjevanju prepisal datoteko. Razvojno okolje JetBrains z vklopljenim središčem prav tako zavrne spremembo dokumenta, ki ga vsebujejo samo projekti, ki jim ne zaupa, čeprav ga agent še vedno lahko bere. Ko je središče urejevalnika vklopljeno, njegova razširitev ali vtičnik ERD Editor pa uporablja drug protokol središča kot strežnik, se vsak klic za ta dokument zavrne, vključno z branjem, s kodo `protocolMismatch` in sporočilom, ki pove, katero stran je treba posodobiti – glejte razdelek [Posodabljanje](./installation.md#updating).

Za podrobnosti glejte stran [V živo in brez vmesnika](./live-and-headless.md).

## Zahteve {#requirements}

| | |
| --- | --- |
| Node.js | Različica `22.12` ali novejša, za zagon strežnika |
| Odjemalec MCP | Claude Code, Codex ali kateri koli odjemalec, ki lahko zažene strežnik stdio |
| VS Code, za urejanje v živo | Različica `1.101.0` ali novejša z razširitvijo ERD Editor različice `4.0.0` ali novejše |
| Obsidian, za urejanje v živo | Namizna aplikacija različice `1.5.7` ali novejše z vtičnikom ERD Editor različice `1.0.0` ali novejše |
| Razvojno okolje JetBrains, za urejanje v živo | Razvojno okolje, ki temelji na IntelliJ, različice `2025.2` ali novejše z vtičnikom ERD Editor različice `1.0.0` ali novejše |

Strežnik različice `1.0.0` ali novejše in zgornje izdaje uporabljajo protokol središča 2.
Starejše izdaje, ki strežejo agentom, uporabljajo protokol 1: razširitev za VS Code od različice `3.0.0` do `3.1.0`, vtičnik za Obsidian različic `0.1.0` in `0.2.0` ter vtičnik za JetBrains različic `0.9.0` in `0.10.0`.
Taka izdaja in strežnik različice `1.0.0` ali novejše se med seboj zavračata, prav tako pa tudi starejši strežnik in zgornje izdaje – glejte razdelek [Posodabljanje](./installation.md#updating).
Razširitev za VS Code pred različico `3.0.0` ali vtičnik za JetBrains pred različico `0.9.0` nima središča, zato strežnik takega urejevalnika ne vidi in ureja datoteko na disku, tudi diagram, ki je odprt v njem.

Orodja za logična imena, domene in slovarje potrebujejo strežnik različice `1.1.0` ali novejše in povsod, kjer je dokument odprt, vsaj razširitev za VS Code različice `4.2.0` ali vtičnik za Obsidian ali JetBrains različice `1.2.0`.
Med zgornjimi izdajami razširitev pred različico `4.2.0` ali vtičnik pred različico `1.2.0` agentu še vedno omogoča urejanje v živo, ker uporablja protokol 2, vendar logična imena, povezave z domeno in vrstice slovarjev, ki jih zapiše agent, prezre in jih ob shranjevanju datoteke izpusti.
Strežnik pred različico `1.1.0`, ki ureja datoteko na disku, jo zapiše nazaj brez njenih logičnih imen, povezav z domeno in vrstic slovarjev – glejte razdelek [Posodabljanje](./installation.md#updating).

Naprej: [Namestitev](./installation.md).
