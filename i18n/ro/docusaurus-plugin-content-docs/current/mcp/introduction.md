---
sidebar_position: 1
description: Permiteți unui agent de programare, de exemplu Claude Code sau Codex, să editeze diagramele erd-editor prin serverul MCP @dineug/erd-editor-mcp, în direct în VS Code, Obsidian sau un IDE JetBrains, ori direct pe disc.
---

# Introducere

`@dineug/erd-editor-mcp` este un server MCP care permite unui agent de programare să editeze diagrame erd-editor.
Claude Code, Codex și orice alt client al [Model Context Protocol](https://modelcontextprotocol.io) primesc câte un instrument pentru fiecare operație asupra unui document: adăugarea unui tabel, redenumirea unei coloane, crearea unei relații între două tabele, importul unui dump DDL, citirea schemei sub formă de SQL.

Când documentul este deschis în ERD Editor din [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) sau dintr-un [IDE JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), agentul se alătură editorului ca un colaborator.
Fiecare modificare apare pe pânză în momentul în care se produce, iar anularea făcută de agent vizează doar propriile sale editări.
VS Code păstrează modificările agentului nesalvate până la o salvare făcută de agent sau de dumneavoastră, în timp ce Obsidian și un IDE JetBrains le salvează așa cum le salvează pe ale dumneavoastră.
Când niciun editor nu deține documentul, aceleași instrumente editează fișierul însuși.

![Un agent de programare care adaugă tabele și relații într-o diagramă deschisă în VS Code](/img/coding-agents.webp)

## Ce poate face un agent {#what-an-agent-can-do}

- Construiește sau modifică o schemă prin conversație: tabele, coloane și toate opțiunile coloanelor, relații cu cardinalitatea lor și cu acțiunile ON DELETE și ON UPDATE, indexuri, note, culori și poziții pe pânză. Consultați [Relații](./tools.md#relationships).
- Reunește tabele în [grupuri de tabele](../guide/guides/table-groups.md): adaugă un grup în jurul tabelelor pe care le indică sau peste o zonă a pânzei, apoi îl redenumește, îl colorează, îl mută împreună cu tabelele sale, îl redimensionează, introduce tabele în el sau le scoate ori îl elimină, ceea ce lasă tabelele sale acolo unde se află. Consultați [Grupuri de tabele](./tools.md#table-groups).
- Denumește tabele și coloane pe baza cuvintelor și termenilor din fila [Dicționar](../guide/guides/dictionary.md) a editorului și leagă coloane de domeniile acesteia, care le dau tipurile de date. Setează [numele logice](../guide/guides/logical-names.md) ale tabelelor și coloanelor, iar dicționarele derivă din ele numele fizice așa cum o fac în editor, deși un nume fizic scris manual rămâne, cu excepția cazului în care este gol. Adaugă, modifică și elimină domenii, cuvinte și termeni și, după ce un cuvânt sau un termen se modifică, derivă din nou numele fizice pentru o coloană, un tabel sau întregul document. Listează ce detectează foaia `Checks` a filei: cuvinte interzise, neînregistrate și sinonime; nume pe care le au în comun două rânduri ale aceluiași dicționar; legături cu un domeniu pe care documentul nu îl listează; nume fizice diferite de cel pe care îl dă termenul lor; precum și coloane al căror tip de date diferă de cel al domeniului lor. Consultați [Dicționare](./tools.md#dictionaries) și [Verificările dicționarelor](./tools.md#dictionary-checks).
- Înlocuiește documentul cu o schemă obținută prin parsarea codului SQL DDL, GraphQL SDL, DBML sau AML ori cu un alt document `.erd.json`. Sau adaugă acea schemă ori acel document sub diagramă și păstrează tot ce există deja, așa cum face elementul [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) al editorului. Un bloc `TableGroup` din DBML devine un grup de tabele în ambele cazuri. O schemă care înlocuiește documentul păstrează dicționarele documentului, un document care îl înlocuiește le aduce pe ale sale, iar o adăugare nu aduce niciunul. Consultați [Import](./tools.md#import).
- Citește diagrama, cu numele logice și rândurile dicționarelor, ca listă de ID-uri, ca entități întregi sau ca textul `.erd.json` pe care îl scrie o salvare. Sau o citește ca DDL pentru oricare dintre cele opt sisteme de baze de date, cu opțiunile `Statements` și `Header` ale filei [Schemă SQL](../guide/guides/schema-sql.md) și cu comutatorul ei [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). La o schemă cu mii de tabele, citește pe rând câte o pagină, câteva tabele sau tabelele câtorva grupuri de tabele. Consultați [Citirea unui document](./tools.md#reading-a-document).
- Setează baza de date, numele bazei de date și [scripturile](../guide/guides/schema-sql.md#before-and-after-scripts) scrise înainte și după tabele în fila Schemă SQL, de exemplu `CREATE EXTENSION` înaintea lor sau `GRANT` după ele. Instrumentul `erd_read` returnează scripturile separat sau în cadrul codului DDL al întregului document. Consultați [Setări](./tools.md#settings).
- Rulează mai multe editări ca una singură, aplicate toate sau niciuna, iar o singură anulare le inversează pe toate. Consultați [erd_batch](./tools.md#erd_batch).
- Anulează și reface propriile editări, niciodată pe ale dumneavoastră.

Ce nu face:

- Nu modifică zoomul, nu derulează și nu comută filele. Acestea țin de fiecare persoană care privește diagrama, așa că niciun instrument nu face acest lucru. Un import care înlocuiește documentul mută totuși vizualizarea, chiar și cu rândul `Viewport` blocat, așa cum face elementul `Import` al editorului: înapoi la începutul pânzei, la 100%, sau, cu instrumentul `erd_import_json`, la vizualizarea documentului pe care îl încarcă și, în plus, la fila acestuia, cu excepția cazului în care acel document blochează rândul `Canvas Type`. Consultați [Import](./tools.md#import).
- Nu schimbă [modul de afișare a numelor](../guide/guides/logical-names.md#switching-the-view) între `Physical Names`, `Logical Names` și `Both Names`. Acesta ține de fiecare persoană care privește diagrama cât timp [blocarea](../guide/guides/settings.md#lock) sa este activată, cum este într-o diagramă nouă, iar după dezactivarea blocării îl alegeți dumneavoastră în editor, așa că niciun instrument nu face acest lucru. Agentul citește și scrie nume logice indiferent de modul de afișare. Un apel `erd_import_json` care înlocuiește documentul aduce modul de afișare a numelor al documentului pe care îl încarcă doar când acel document are blocarea `Name View` dezactivată.
- Nu modifică [`View Option`](../guide/guides/table-related-functions.md#table-view-options), limbajul și stilurile de denumire ale generatorului de cod, tipul de delimitator sau opțiunile `Relationship DataType Sync`, `Maximum comment width` și `Column Order` din fila [Setări](../guide/guides/settings.md). Pe acestea le setați dumneavoastră în editor, iar agentul le citește așa cum le salvează fișierul.
- Nu activează și nu dezactivează nicio [blocare](../guide/guides/settings.md#lock). Doar instrumentul `erd_import_json`, când înlocuiește întregul document, schimbă blocările sau setările de mai sus cu cele ale documentului pe care îl încarcă. Un document fără câmpul `lockSettings`, de exemplu un fișier salvat de extensia pentru VS Code înainte de versiunea `4.0.0` sau de pluginul pentru Obsidian ori JetBrains înainte de versiunea `1.0.0`, activează toate blocările. Anularea oricărui import care a înlocuit documentul readuce setările și blocările pe care documentul le avea înainte.
- Nu remapează o relație pe alte coloane, așa cum face caseta de dialog [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). În schimb, agentul elimină relația, ceea ce lasă pe loc coloanele sale cheie străină, și leagă coloanele pe care le dorește cu instrumentul `erd_link_columns`, într-un singur apel `erd_batch`, pe care o singură anulare îl inversează.
- Nu importă și nu exportă un dicționar ca CSV, nu sortează o foaie și nu inserează rânduri deasupra sau dedesubtul unui rând, așa cum face fila [Dicționar](../guide/guides/dictionary.md). Agentul adaugă, modifică și elimină rânduri, multe deodată, într-un singur apel `erd_batch`, iar un rând nou ajunge la sfârșitul foii sale.
- Nu rulează generatorul de cod. Instrumentul `erd_read` răspunde cu DDL sau JSON, iar agentul scrie singur codul pe baza acestuia.

## Cum funcționează {#how-it-works}

Serverul este un proces stdio pe care îl pornește clientul MCP.
La fiecare apel, caută un editor care deține documentul: o fereastră VS Code, o fereastră a unui seif Obsidian sau un IDE JetBrains, fiecare cu extensia sau pluginul ERD Editor.

- **În direct** – un editor are documentul în spațiul său de lucru, în seiful său sau într-unul dintre proiectele sale deschise ori îl are deschis. Serverul se alătură sesiunii de editare a acelui editor, iar editarea ajunge în editor: nesalvată în VS Code și salvată așa cum sunt salvate editările dumneavoastră în Obsidian și într-un IDE JetBrains.
- **Fără interfață** – niciun editor. Serverul încarcă fișierul, aplică editarea și rescrie fișierul.
- **Refuzat** – un editor deține documentul, dar are hubul dezactivat. Serverul citește de pe disc, dar nu scrie nimic, deoarece editorul deschis ar putea suprascrie fișierul la următoarea salvare. Un IDE JetBrains cu hubul activat refuză, de asemenea, să modifice un document deținut doar de proiecte pe care nu le consideră de încredere, deși agentul îl poate citi în continuare. Când hubul editorului este activat, dar extensia sau pluginul său ERD Editor folosește alt protocol al hubului decât serverul, fiecare apel asupra documentului este refuzat, inclusiv citirile, cu codul `protocolMismatch` și un mesaj care indică partea ce trebuie actualizată (consultați [Actualizarea](./installation.md#updating)).

Pentru detalii, consultați [În direct și fără interfață](./live-and-headless.md).

## Cerințe {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` sau o versiune ulterioară, pentru a rula serverul |
| Un client MCP | Claude Code, Codex sau orice client care poate porni un server stdio |
| VS Code, pentru editarea în direct | `1.101.0` sau o versiune ulterioară, cu extensia ERD Editor `4.0.0` sau o versiune ulterioară |
| Obsidian, pentru editarea în direct | Aplicația pentru desktop `1.5.7` sau o versiune ulterioară, cu pluginul ERD Editor `1.0.0` sau o versiune ulterioară |
| Un IDE JetBrains, pentru editarea în direct | Un IDE bazat pe IntelliJ `2025.2` sau o versiune ulterioară, cu pluginul ERD Editor `1.0.0` sau o versiune ulterioară |

Versiunea `1.0.0` sau o versiune ulterioară a serverului și versiunile de mai sus folosesc protocolul 2 al hubului.
Versiunile anterioare care deservesc agenți folosesc protocolul 1: extensia pentru VS Code de la versiunea `3.0.0` până la versiunea `3.1.0`, pluginul pentru Obsidian în versiunile `0.1.0` și `0.2.0` și pluginul pentru JetBrains în versiunile `0.9.0` și `0.10.0`.
O astfel de versiune și versiunea `1.0.0` sau o versiune ulterioară a serverului se refuză reciproc, la fel ca o versiune anterioară a serverului și versiunile de mai sus (consultați [Actualizarea](./installation.md#updating)).
O extensie pentru VS Code anterioară versiunii `3.0.0` sau un plugin pentru JetBrains anterior versiunii `0.9.0` nu are hub, așa că serverul nu îl vede și editează fișierul pe disc, chiar și pe cel al unei diagrame deschise în acesta.

Instrumentele pentru nume logice, domenii și dicționare necesită versiunea `1.1.0` sau o versiune ulterioară a serverului și, oriunde este deschis documentul, cel puțin extensia pentru VS Code `4.2.0` sau pluginul pentru Obsidian ori JetBrains `1.2.0`.
Dintre versiunile de mai sus, o extensie anterioară versiunii `4.2.0` sau un plugin anterior versiunii `1.2.0` permite în continuare agentului să editeze în direct, deoarece folosește protocolul 2, dar ignoră numele logice, legăturile cu domeniile și rândurile dicționarelor pe care le scrie agentul și le omite când salvează fișierul.
Un server anterior versiunii `1.1.0` care editează un fișier pe disc îl rescrie fără numele logice, legăturile cu domeniile și rândurile dicționarelor (consultați [Actualizarea](./installation.md#updating)).

Pasul următor: [Instalare](./installation.md).
