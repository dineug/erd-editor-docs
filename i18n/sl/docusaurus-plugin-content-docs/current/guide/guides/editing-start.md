---
sidebar_position: 1
description: Začetek na pozdravnem zaslonu ter ustvarjanje tabel, beležk, skupin tabel in relacij v priročnem meniju platna, z orodno vrstico platna ali z bližnjico.
---

# Začetek urejanja

Urejanje se začne v priročnem meniju, ki ga odprete s klikom z desno tipko miške.

![Klik z desno tipko miške na platno, odpiranje podmenija Relationship, dodajanje tabele in nato odpiranje njenega lastnega menija](/img/demo-context-menu.webp)

Klik z desno tipko miške na tabelo, beležko, skupino tabel ali relacijo namesto tega odpre lastni meni tega elementa.  
Klik z desno tipko miške na tabelo, beležko ali skupino tabel, ki je že izbrana, ohrani celoten izbor, zato postavke, kot sta `Color` in `Delete selected`, delujejo na ves izbor – glejte razdelek [Večkratni izbor](./table-related-functions.md#multiple-selection).

## Pozdravni zaslon {#welcome-screen}

V spletni aplikaciji, v storitvi Google Drive, v VS Code, v aplikaciji Obsidian in v razvojnem okolju JetBrains se prazen diagram odpre s pozdravnim zaslonom nad platnom ERD. Element `<erd-editor>` na vaši lastni strani ga prikaže le, če ga stran vklopi z lastnostjo [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Diagram šteje za prazen, dokler ne vsebuje nobene tabele, nobene prikazane beležke niti nobene prikazane skupine tabel, zato beležke in skupine, skrite z možnostmi pogleda, ne štejejo. Zaslon izgine, takoj ko diagram vsebuje enega od teh elementov, in se vrne vsakič, ko je diagram spet prazen, na primer potem, ko izbrišete zadnjo tabelo ali razveljavite dodajanje prve.  
Ne prikaže se v urejevalniku samo za branje, v načinu zen, medtem ko je odprto okno Lastnosti tabele, ali medtem ko platno prevzame pregledovalnik razlik, predogled samodejne postavitve ali potovanje skozi čas.

![Pozdravni zaslon na praznem diagramu: odpiranje formatov postavke Import, vrnitev z Esc, dodajanje tabele z New Table, nato pa ponovni prikaz zaslona s ⌘ + Z](/img/demo-welcome-screen.webp)

Pod naslovom `Right-click the canvas for every action.` je meni:

- Postavka `New Table` doda tabelo, tako kot `Alt + N`.
- Postavka `New Memo` doda beležko, tako kot `Alt + M`. Dokler so beležke skrite, je izpuščena.
- Postavka `Import` meni zamenja s postavko `Back` in formati `json`, `Schema SQL`, `GraphQL`, `DBML` in `AML`. Ko izberete format, vas urejevalnik pozove k izbiri datoteke tega formata in jo naloži namesto praznega diagrama – glejte stran [Uvoz in izvoz datotek](./file-import-export.md). Postavka `Back` ali tipka `Escape` vas vrne v prvi meni.
- Postavka `Command Palette` odpre [hitro iskanje](./quick-search.md), tako kot `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac).
- Postavka `Shortcuts` odpre nastavitve na zavihku [`Shortcuts`](./settings.md#shortcuts).

Kjer je platno dovolj široko, postavke `New Table`, `New Memo` in `Command Palette` prikažejo tipko, ki je trenutno dodeljena njihovemu ukazu, vključno s tipko, ki jo je na novo dodelil gostitelj.  
Ko ima postavka fokus tipkovnice, tipki `↑` in `↓` krožno premikata fokus po postavkah, tipki `Home` in `End` skočita na prvo in zadnjo, tipka `Enter` ali `Space` pa pritisne postavko s fokusom. Vse druge bližnjice še vedno delujejo, zato tudi od tam `Alt + N` doda tabelo.  
Klike sprejema samo meni: pritisk kjer koli drugje na zaslonu doseže platno, klik z desno tipko miške na platno pa kot običajno odpre priročni meni.

Kjer je na platnu dovolj prostora, ročno narisane puščice kažejo na:

- gumb `Search` v orodni vrstici: `Search commands and tables`
- gumba `Theme` in `Display Language`: `Pick a theme and a language`, ko pa orodna vrstica prikazuje le enega od njiju, `Pick a theme` ali `Pick a language` – glejte stran [Jezik in tema](./language-and-theme.md)
- [orodno vrstico platna](./table-related-functions.md#canvas-toolbar) na dnu: `Pan, zoom and draw relationships`

Dokler je prikazan [raziskovalec](./explorer.md), pozdravni zaslon prekriva le platno ob njem.  
Puščica, katere gumb v orodni vrstici stoji nad raziskovalcem, je izpuščena. Puščica za `Theme` in `Display Language` je izpuščena le, ko oba njena gumba stojita nad raziskovalcem; do takrat kaže na tistega, ki je še nad platnom.  
Oznaka, ki ob svoji puščici nima prostora, namesto tega visi pod puščico.

## Ustvarjanje tabele {#table-creation}

Tabelo ustvarite v priročnem meniju, z gumbom `New Table` v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar) ali z bližnjico `Alt + N`.

## Ustvarjanje beležke {#memo-creation}

Beležko ustvarite v priročnem meniju, z gumbom `New Memo` v orodni vrstici platna ali z bližnjico `Alt + M`.  
Dokler je možnost View Option → `Memos` izklopljena, so beležke skrite, postavka `New Memo` ni nikjer na voljo, `Alt + M` pa ne doda nobene beležke – glejte razdelek [Možnosti pogleda tabel](./table-related-functions.md#table-view-options).

Beležka je zapis s prostim besedilom na platnu. Kliknite v njeno notranjost in tipkajte; besedilo se shrani z dokumentom.  
Tipka `Escape` konča urejanje beležke, pri čemer ohrani, kar ste vnesli, in pusti beležko izbrano, drugi pritisk tipke `Escape` pa počisti izbor.  
Povlecite njen rob, da spremenite velikost. Znak `x` v njeni glavi, ki je prikazan, dokler je kazalec nad beležko, jo izbriše.  
Klik z desno tipko miške na beležko namesto urejanja odpre njen meni: `Color`, `Remove color`, dokler ima kateri od izbranih elementov barvo, in `Delete`, ki se glasi `Delete selected`, dokler je beležka eden od dveh ali več izbranih elementov. Izbrana beležka se izbriše tudi s tipkami, ki brišejo tabele – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion).

![Dodajanje beležke z Alt + M, vnos besedila in vlečenje roba za spremembo velikosti](/img/demo-memo.webp)

## Ustvarjanje skupine tabel {#table-group-creation}

Skupina tabel je okvir, ki vsebuje tabele, dodelite pa ji lahko ime in barvo. Ustvarite jo na enega od dveh načinov:

- Izberite `New Table Group` v priročnem meniju ali v hitrem iskanju, kliknite gumb `New Table Group` v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar) ali pritisnite `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac), nato pa povlecite okvir po platnu. Vsaka tabela, katere središče leži znotraj okvira, se pridruži novi skupini, razen če je že v drugi skupini – glejte razdelek [Risanje skupine](./table-groups.md#drawing-a-group).
- Izberite tabele in v priročnem meniju tabele izberite `Group selected tables` ali v hitrem iskanju `Group Selected Tables` ali pa pritisnite `T` in nato `G` – glejte razdelek [Združevanje izbranih tabel v skupino](./table-groups.md#grouping-selected-tables).

Poimenovanje, barvanje, premikanje, spreminjanje velikosti in vse drugo je opisano na strani [Skupine tabel](./table-groups.md).

## Ustvarjanje relacije {#relationship-creation}

Risanje relacije začnite v priročnem meniju, v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar) na dnu platna ali z bližnjico. Vsaka vrsta relacije ima svojo:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) ali `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) ali `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) ali `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) ali `⌘ + ⌥ + 4` (Mac)

Ko je vrsta vklopljena, se kazalec spremeni. Najprej kliknite nadrejeno tabelo, nato pa podrejeno tabelo.  
Nadrejena tabela dobi primarni ključ, če ga nima, podrejena tabela pa za vsak stolpec primarnega ključa nadrejene tabele dobi stolpec tujega ključa z zastavico `Not Null` ter z enakim podatkovnim tipom, privzeto vrednostjo, komentarjem, [logičnim imenom](./logical-names.md) in [domeno](./dictionary.md#domains-and-data-types).  
Izjema je ključ serial: njegov tuji ključ prevzame celoštevilski tip, ki ga hrani serial, na primer `integer` za `serial4`, in takrat ni povezan z nobeno domeno – glejte razdelek [Identifikacijske relacije](./relationship-editing.md#identifying-relationships).  
Vsak stolpec tujega ključa dobi ime po svojem ključu: enobesedno ime, kot je `id`, dobi pred seboj ime nadrejene tabele (`user_id`), ime iz več besed, kot je `member_id`, se ohrani, ime, ki ga podrejena tabela že ima, pa se oštevilči (`user_id_2`) – glejte razdelek [Imena stolpcev tujega ključa](./relationship-editing.md#foreign-key-column-names).  
Če dvakrat kliknete isto tabelo, se nariše rekurzivna relacija.  
Nova relacija ima na začetku obe možnosti, `On Delete` in `On Update`, nastavljeni na `Not set`; spremenite ju v njenem priročnem meniju – glejte razdelek [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Za preklic pritisnite tipko `Escape` ali znova pritisnite isto bližnjico. Preklic pusti izbor nespremenjen, naslednji pritisk tipke `Escape` pa ga počisti.

Ko je nadrejena tabela izbrana, se tabela, pri kateri se relacija lahko konča, obrobi, ko je kazalec nad njo, ob njej pa se prikažeta dva gumba:

- Gumb `Create new columns` (`+`) nariše relacijo z novimi stolpci tujega ključa, tako kot klik na tabelo.
- Gumb `Map to existing columns` (ikona povezave) konča risanje in za obe tabeli odpre okno [Preslikaj stolpce](./relationship-editing.md#map-columns), da lahko relacija uporabi stolpce, ki jih podrejena tabela že ima. Nič se ne zapiše, dokler ne pritisnete gumba `Map`.

Gumba se prikažeta tudi ob nadrejeni tabeli, ko se kazalec nekoliko odmakne od mesta, kjer ste jo kliknili, zato je mogoče tudi rekurzivno relacijo preslikati na obstoječe stolpce.  
Prst ne more premakniti kazalca nad tabelo, zato se gumba pri risanju s prstom nikoli ne prikažeta, ko pa tapnete podrejeno tabelo, se relacija takoj nariše; pri pisalu se gumba prikažeta tako kot pri miški.  
Če je nadrejena tabela do trenutka, ko pridete do podrejene, izgubila primarni ključ, na primer zaradi razveljavitve ali sodelavčeve spremembe, je gumb `Create new columns` zatemnjen z opisom orodja `<parent> has no primary key to copy`, klik na podrejeno tabelo pa konča risanje, ne da bi se kar koli narisalo.  
Opis orodja poimenuje nadrejeno tabelo tako, kot določa [prikaz imen](./logical-names.md#beyond-the-canvas).

![Risanje relacije One N s ⌘ + ⌥ + 4, nato pa relacije Zero N z orodno vrstico platna, pri čemer je podrejena tabela obrobljena, ob njej pa sta gumba Map to existing columns in Create new columns](/img/demo-relationship.webp)

## Podvajanje tabel in beležk {#duplicating-tables-and-memos}

Obstoječe tabele in beležke lahko kopirate, prilepite in z vlečenjem ob pridržani tipki `Alt` podvojite – glejte stran [Funkcije za tabele](./table-related-functions.md#copyingpasting-tables-and-memos).
