---
sidebar_position: 6
description: Združevanje sorodnih tabel v poimenovan, obarvan okvir za njimi; ustvarjanje, poimenovanje, barvanje, premikanje, spreminjanje velikosti in odstranjevanje skupin, prehod nanje iz raziskovalca, spreminjanje, katere tabele vsebujejo, skrivanje skupin ter njihovo ohranjanje pri samodejni postavitvi, v Shemi SQL in v DBML.
---

# Skupine tabel

Skupina tabel je poimenovan, obarvan okvir, ki je narisan za sorodnimi tabelami na platnu ERD in pokaže, katere tabele spadajo skupaj.  
Tabela je v največ eni skupini. Skupine se shranijo z diagramom, skupaj s tem, v kateri skupini je vsaka tabela.

Okvir ima ob zgornjem robu naslovno vrstico z ikono skupine, imenom skupine v krepkem tisku in, dokler je kazalec nad skupino, znakom `x`, ki skupino odstrani – glejte razdelek [Odstranjevanje skupine](#removing-a-group). Skupina brez imena se prikaže kot `unnamed`, ime, ki je predolgo za vrstico, pa se skrajša z `…`.  
Okvir vedno zajema svoje tabele: ohrani velikost, ki jo je dobil, vendar se raztegne tako, da je vsaka tabela v njem, s `24px` prostora okoli nje in z naslovno vrstico nad njo. Tabela, ki se poveča, raztegne okvir s seboj, enako pa velja za tabelo, spuščeno blizu roba, katere središče je še vedno v okviru. Med vlečenjem tabel se okvir niti ne poveča niti ne zmanjša. Raztezanje se ne shrani: okvir se vrne na svojo velikost, ko tabela prostora ne potrebuje več.

Skupine se narišejo za vsem drugim na platnu: za tabelami, beležkami in povezovalnimi črtami.  
Kjer se skupine prekrivajo, je v ospredju narisana tista, ki ste jo nazadnje pritisnili ali dodali, notranjost nobene skupine pa nikoli ne prekrije naslovne vrstice druge skupine. Vrstni red se ne shrani, zato znova odprt diagram skupine zloži v vrstnem redu dodajanja.  
Skupine se prikažejo na platnu ERD, na mini zemljevidu in na izvoženi sliki, navaja pa jih tudi [raziskovalec](./explorer.md) – glejte razdelek [Prehod na skupino](#going-to-a-group). Zavihek [Vizualizacija](./visualization.md) v nobenem od načinov ne nariše skupin niti barv skupin.

Tudi agent za kodiranje lahko ustvarja in spreminja skupine ter bere DDL izbranih skupin – glejte razdelek [Skupine tabel](../../mcp/tools.md#table-groups) med orodji MCP.

![Vklop risanja skupine z ⌥ + G, risanje skupine čez orders in payments, poimenovanje z imenom Billing, spuščanje order_items vanjo, nato pa premikanje skupine in spreminjanje njene velikosti](/img/demo-table-group.webp)

## Ustvarjanje skupine {#creating-a-group}

Skupino lahko ustvarite na dva načina, vsak s svojo bližnjico. Noben od njiju ni na voljo v urejevalniku samo za branje ali dokler so skupine [skrite](#hiding-groups), njuni bližnjici pa takrat ne naredita ničesar.  
Tako kot druge bližnjice platna delujeta samo na zavihku ERD in sta onemogočeni, dokler urejate celico, beležko ali ime skupine – glejte razdelek [Bližnjice](./settings.md#shortcuts).

### Risanje skupine {#drawing-a-group}

Kliknite gumb `New Table Group` v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar), pritisnite `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac) ali pa izberite `New Table Group` v priročnem meniju platna, kjer sledi postavkama `New Table` in `New Memo`, ali v [hitrem iskanju](./quick-search.md) na zavihku ERD. Nato povlecite okvir po platnu.  
Gumb in bližnjica risanje preklapljata, zato ga pritisk katerega koli od njiju, ko je vklopljeno, konča, ne glede na to, kako se je začelo; postavka priročnega menija in hitro iskanje ga lahko le začneta. Začetek risanja izklopi orodje Roka in prekliče relacijo, ki jo rišete.  
Ko je risanje vklopljeno, ima kazalec obliko križca, pritisk pa začne okvir tam, kamor pritisnete, celo nad tabelo, namesto da bi izbral ali premaknil tisto, kar je pod njim. Orodna vrstica platna takrat označi svoj gumb `New Table Group`, ne pa orodja Roka ali orodja Izbira.

Ko spustite gumb miške, se v tem okviru doda skupina, ki ni nikoli ožja od `160px` ali nižja od `100px`, vključno z naslovno vrstico, ne glede na to, kako kratko je bilo vlečenje. Klik brez vlečenja doda skupino, široko `480px` in visoko `320px`, z zgornjim levim kotom na mestu klika.  
Vsaka tabela brez skupine, katere središče leži znotraj novega okvira, se pridruži skupini. Tabela, ki je že v drugi skupini, ostane v njej.

Srednji gumb miške še vedno premika pogled platna in pusti risanje vklopljeno. Risanje brez dodajanja skupine končajo naslednja dejanja:

- Tipka `Escape` ali bližnjica `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac) pred pritiskom ali med vlečenjem. Pred pritiskom pustita izbor nespremenjen; pritisk, ki začne okvir, ga je že počistil.
- Klik z desno tipko miške, ki počisti izbor. Priročni meni se ne odpre.
- Preklop na orodje Roka s tipko `Space` ali v orodni vrstici platna, klik na orodje Izbira ali na gumb `New Table Group` v orodni vrstici ali začetek risanja relacije.
- Preklop na drug zavihek, skritje skupin ali preklop urejevalnika v način samo za branje.

### Združevanje izbranih tabel v skupino {#grouping-selected-tables}

Izberite eno ali več tabel in pritisnite `T` in nato `G` ali pa izberite `Group selected tables` v priročnem meniju tabele ali `Group Selected Tables` v hitrem iskanju, ki ta ukaz navaja, dokler je izbrana kakšna tabela.  
Nova skupina se nariše okoli izbranih tabel s `24px` prostora na vsaki strani in z naslovno vrstico nad njimi. Vsaka izbrana tabela se ji pridruži in zapusti skupino, v kateri je bila, skupina, ki jo je zapustila, pa ostane, tudi če je zdaj prazna. Beležke v izboru se preskočijo.

Bližnjica `T` in nato `G` je zaporedje dveh pritiskov brez modifikatorske tipke, pri čemer `G` pritisnete v eni sekundi po `T`. Če ni izbrana nobena tabela, ne naredi ničesar, v besedilnem polju, kot je iskalno polje raziskovalca, pa vnese obe črki.

![Združevanje categories in products v skupino s T in nato G, poimenovanje skupine z imenom Catalog, nato pa barvanje z barvo Violet v njenem meniju, tako da obe glavi prevzameta barvo](/img/demo-table-group-selected.webp)

V obeh primerih nova skupina nima niti imena niti barve. Izbrana je samo ta skupina, nad naslovno vrstico pa se odpre polje za ime, tako da lahko ime takoj vnesete – glejte razdelek [Poimenovanje skupine](#naming-a-group).  
Skupina in tabele, ki jih zajame, so en korak razveljavitve, ime, ki ga vnesete, pa drugi.

## Poimenovanje skupine {#naming-a-group}

Ime skupine se ureja v polju, ki se odpre nad njeno naslovno vrstico. Polje se odpre samodejno, ko se skupina ustvari, ob dvokliku na naslovno vrstico in s postavko `Rename` v priročnem meniju skupine.  
Tipka `Enter` ali klik kamor koli drugam ime shrani. Tipka `Escape` zapre polje, ne da bi spremenila ime, in pusti skupino izbrano, drugi pritisk tipke `Escape` pa počisti izbor.  
Spremenjeno ime je en korak razveljavitve; shranjevanje nespremenjenega imena ne zabeleži ničesar. Prazno ime ali ime iz samih presledkov se prikaže kot `unnamed`.  
Dokler je polje odprto, so bližnjice platna onemogočene, bližnjici za hitro iskanje in `Toggle Explorer` pa ne naredita ničesar, tako kot med urejanjem celice tabele.

[Iskanje in zamenjava](./find-and-replace.md#what-it-searches) preiskuje imena skupin pod možnostjo `Table group names`, dokler so skupine prikazane, ukaza `Replace` in `Replace All` pa skupine preimenujeta – glejte razdelek [Zamenjevanje](./find-and-replace.md#replacing). [Hitro iskanje](./quick-search.md#searching-the-diagram) imen skupin ne preiskuje.

## Barvanje skupine {#coloring-a-group}

V priročnem meniju skupine izberite `Color`, da odprete izbirnik barv z barvo skupine.  
Tako kot pri tabelah in beležkah izbirnik obarva vsako izbrano tabelo, beležko in skupino, postavka `Remove color` v meniju ali možnost `No color` v izbirniku pa odstrani barvo z vseh – glejte razdelek [Določanje barve tabel in beležk](./table-related-functions.md#table-and-memo-color-specification). Barva skupine je na voljo tudi pod `Document colors` v izbirniku.

Obarvana skupina nariše naslovno vrstico in obrobo v tej barvi, notranjost pa v bledem tonu te barve. Skupina brez barve uporablja nevtralne sive tone teme.  
Vsaka tabela v obarvani skupini ima barvo skupine čez celotno glavo, svojo barvo pa obdrži na levem robu, tako da sta vidni obe.  
Besedilo in gumbi na taki glavi postanejo beli, na svetli barvi, kjer je črna precej bolj berljiva, pa črni, enako kot ime, ikona in znak `x` v naslovni vrstici skupine. Med prednastavljenimi barvnimi vzorci izbirnika dobijo Orange, Amber, Yellow in Lime črno barvo, ostali pa belo.  
Tabela obdrži svojo glavo, dokler njena skupina nima barve, dokler so skupine skrite, pri povečavi `70%` ali manjši, kjer se tabele strnejo na ime, ter na zavihku Vizualizacija.

Sprememba barve se zabeleži v [zgodovino razveljavitev](./undo-redo.md#one-gesture-one-step) tako kot pri tabelah in beležkah.

## Izbiranje skupin {#selecting-groups}

Kliknite naslovno vrstico skupine, da izberete samo to skupino, ali uporabite `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac), da jo dodate izboru.  
Pritisk na naslovno vrstico skupine, ki je že izbrana, ohrani celoten izbor, zato vlečenje nato premakne vse izbrano.  
Pritisk na naslovno vrstico ali klik z desno tipko miške na skupino postavi skupino pred druge skupine, njene tabele pa pred vse druge tabele in beležke.

Notranjost, tj. območje pod naslovno vrstico, se za levi gumb miške vede kot platno: vlečenje premika pogled, `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac) nariše okvir izbora, klik pa počisti izbor. Tabele, beležke in povezovalne črte nad notranjostjo se na kazalec odzivajo kot običajno.

Okvir izbora zajame skupino samo, če obkroži celoten okvir skupine, zato okvir, narisan znotraj skupine, izbere tabele, skupine pa ne – glejte razdelek [Večkratni izbor](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) ali `⌘ + A` (Mac) nikoli ne izbere skupine.

Postavka `Select tables` v priročnem meniju skupine zamenja izbor s tabelami skupine, same skupine pa ne vključi, tako da naslednji ukaz doseže samo tabele.  
Uporabite jo pred ukazi, ki vplivajo samo na tabele, kot sta kopiranje ali [osredotočanje na tabele](./table-related-functions.md#focusing-on-tables), ki izbrano skupino preskočita.

Obroba izbrane skupine se obarva z barvo izbora. V [sodelovalni seji](../../api/advanced/collaborative-editing.md) je skupina, ki jo izbere drug udeleženec, obkrožena z barvo tega udeleženca.

## Prehod na skupino {#going-to-a-group}

[Raziskovalec](./explorer.md#the-tree) navaja skupine v mapi `Table Groups` po imenu, vsako z njenimi tabelami pod njo. Hitro iskanje skupin ne navaja.

Izbira vrstice skupine v raziskovalcu, zadetka [iskanja in zamenjave](./find-and-replace.md#going-to-a-match) v imenu skupine ali vrstice skupine na seznamu [pregledovalnika razlik](./table-related-functions.md#the-change-tree) vas pripelje do te skupine.  
Prehod prikaže okvir skupine v pogledu in se ravna po njeni naslovni vrstici, kadar je okvir višji od platna – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Nato izbere samo to skupino in jo skupaj z njenimi tabelami postavi v ospredje, tako kot pritisk na njeno naslovno vrstico.  
Dokler so skupine [skrite](#hiding-groups) ali ko je skupina odstranjena, prehod nanjo ne naredi ničesar.  
V pregledovalniku razlik vsaka stran preide na skupino samo, če jo njen lasten dokument vsebuje in prikazuje – glejte razdelek [Prehod na spremembo](./table-related-functions.md#going-to-a-change).

## Premikanje skupine in spreminjanje njene velikosti {#moving-and-resizing-a-group}

Povlecite skupino za naslovno vrstico, da jo premaknete skupaj z vsemi njenimi tabelami.  
Če je skupina del večjega izbora, se z njo premakne celoten izbor, tabela, ki je hkrati izbrana in v skupini, pa se premakne enkrat.  
Vlečenje se začne šele, ko se kazalec premakne za kratko razdaljo, zato klik ali dvoklik na naslovno vrstico ostane klik. `Alt + drag` na naslovni vrstici premakne skupino tako kot navadno vlečenje; skupina se nikoli ne podvoji.  
Premik je skupaj z vsemi tabelami, ki jih prenese, en korak razveljavitve.

Vlečenje posamezne tabele premakne samo to tabelo in jo lahko premakne v skupino ali iz nje – glejte razdelek [Dodajanje in odstranjevanje tabel](#adding-and-removing-tables).

Vsaka skupina ima, tako kot beležka, ročice za spreminjanje velikosti na svojih štirih robovih in štirih kotih, ne glede na to, ali je izbrana ali ne.  
Povlecite eno od njih z levim gumbom miške: okvir sledi kazalcu, nova velikost pa se shrani, ko gumb spustite, kot en korak razveljavitve.  
Skupine ni mogoče zmanjšati pod `160px` × `100px` niti pod velikost njenih tabel s `24px` prostora okoli njih in z naslovno vrstico. Rob se tam ustavi, ne glede na to, kako daleč se premakne kazalec.

## Dodajanje in odstranjevanje tabel {#adding-and-removing-tables}

Tabela se pridruži skupini ali jo zapusti glede na to, kam jo spustite.  
Ko tabele povlečete in spustite, se o vsaki povlečeni tabeli, ki je ne prenaša izbrana skupina, odloči glede na njeno središče. Pridruži se najvišji skupini, katere okvir vsebuje njeno središče, ali pa zapusti svojo skupino, če njeno središče ne leži v okviru nobene skupine. Najvišja skupina je tista, ki je narisana v ospredju.  
Skupina, ki je vlečenje ne premakne, obdrži okvir, ki ga je imela ob začetku vlečenja, zato tabela, ki jo rahlo premaknete znotraj njene skupine, v njej ostane, da pa bi jo zapustila, jo morate vleči, dokler njeno središče ni zunaj tega okvira.  
Med vlečenjem se obrobi vsaka skupina, v katero bi spust postavil tabelo.

Če tabele spustite v približno `200ms` po zadnjem premiku, je sprememba skupine del koraka razveljavitve vlečenja, zato ena razveljavitev vrne tabele tja, kjer so bile, in v skupine, v katerih so bile. Po daljšem premoru pred spustom je sprememba skupine samostojen korak – glejte razdelek [Ena poteza, en korak](./undo-redo.md#one-gesture-one-step).  
Klik ali vlečenje za nekaj slikovnih pik ne spremeni nobene skupine, dokler so skupine skrite, pa nobena tabela ne zamenja skupine.

Drugi načini za spreminjanje tabel, ki jih vsebuje skupina:

- Postavka `Remove from group` v priročnem meniju tabele odstrani vsako izbrano tabelo iz njene skupine. Prikaže se, ko je kakšna izbrana tabela v skupini, tudi ko so skupine skrite, in je en korak razveljavitve.
- Postavka `Group selected tables` premakne izbrane tabele v novo skupino – glejte razdelek [Združevanje izbranih tabel v skupino](#grouping-selected-tables).
- Odstranitev skupine pusti njene tabele brez skupine.

Tabela, prilepljena ali podvojena s tipko `Alt`, ni v nobeni skupini, tudi če pristane znotraj okvira skupine. Ko jo pozneje povlečete, se uporabi pravilo spusta.

## Odstranjevanje skupine {#removing-a-group}

Odstranitev skupine nikoli ne odstrani njenih tabel: ostanejo, kjer so, brez skupine.

- Znak `x` na koncu naslovne vrstice, ki se prikaže, ko je kazalec nad skupino, odstrani samo to skupino.
- Postavka `Delete` v priročnem meniju skupine odstrani skupino. Ko je skupina eden od več izbranih elementov, se postavka glasi `Delete selected` in odstrani vse izbrano: tabele, beležke in skupine.
- Ko so izbrane skupine, tipka `Delete` ali `Backspace` odstrani izbrane skupine skupaj z vsemi izbranimi tabelami in beležkami, enako pa delujeta `Ctrl + Backspace` in `Ctrl + Delete` (Windows/Linux) ali `⌘ + Backspace` in `⌘ + Delete` (Mac) – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion).

Vsaka odstranitev je en korak razveljavitve, ki skupino povrne skupaj z njenimi tabelami v njej.

## Meni skupine {#the-group-menu}

Kliknite naslovno vrstico, notranjost ali rob skupine z desno tipko miške, da odprete njen meni. Na računalniku Mac ga odpre tudi `Ctrl + click`, na zaslonu na dotik pa dolg pritisk.  
Klik z desno tipko miške najprej izbere skupino, in sicer samo njo, razen če je že del izbora, zato `Color` in `Delete selected` dosežeta preostanek izbora samo, če je bila skupina v njem.

- `Select tables`: izbere samo tabele skupine – glejte razdelek [Izbiranje skupin](#selecting-groups).
- `Rename`: odpre polje za ime – glejte razdelek [Poimenovanje skupine](#naming-a-group).
- `Color`: odpre izbirnik barv – glejte razdelek [Barvanje skupine](#coloring-a-group).
- `Remove color`: prikaže se, ko ima kateri od izbranih elementov barvo.
- `Delete` ali `Delete selected`, ko je skupina eden od več izbranih elementov, na desni pa je prikazana tipka `Delete` – glejte razdelek [Odstranjevanje skupine](#removing-a-group).

Priročni meni tabele doda postavki `Group selected tables` in `Remove from group` za postavkama `Color` in `Remove color`, pred svojo postavko Delete, priročni meni platna pa doda `New Table Group`.  
Postavka `Group selected tables` na desni prikazuje svoje tipke, `T` in nato `G`, postavka `New Table Group` pa `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac).

## Skrivanje skupin {#hiding-groups}

`View Option` → `Table Groups` v priročnem meniju platna prikaže ali skrije vse skupine. Možnost je privzeto označena – glejte razdelek [Možnosti pogleda tabel](./table-related-functions.md#table-view-options).  
Ko ni označena, okvirji skupin in barve skupin na glavah tabel izginejo s platna, mini zemljevida in izvoženih slik, drsni trakovi in mini zemljevid pa ne puščajo več prostora za skupine. Nič se ne premakne ali spremeni velikosti, vsaka tabela pa ostane v svoji skupini.  
Skritje skupin prekliče njihov izbor, konča risanje `New Table Group` in zapre odprto polje za ime.

Dokler so skupine skrite:

- Postavki `New Table Group` in `Group selected tables` nista na voljo v menijih niti ukaza `New Table Group` in `Group Selected Tables` v hitrem iskanju, orodna vrstica platna pa izpusti svoj gumb `New Table Group`. Postavka `Remove from group` je še vedno na voljo.
- Bližnjici `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac) ter `T` in nato `G` ne naredita ničesar.
- Vlečenje tabel ne spremeni nobene skupine, okvir izbora pa ne zajame nobene skupine.
- Raziskovalec izpusti svojo mapo `Table Groups`, iskanje in zamenjava pa imen skupin ne najde niti ne zamenja, tudi ko je možnost `Table group names` vklopljena.
- [Samodejna postavitev](#auto-layout) še vedno ohrani tabele vsake skupine skupaj, zavihek Shema SQL še vedno ponuja [skupine za izbiro](#schema-sql-by-group), DBML jih še vedno zapiše, ukaz [Uvozi in dodaj](./file-import-export.md#import-and-add) pa še vedno postavi dodano pod skrite okvirje.

Izbira se shrani v dokument in zabeleži v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records), tako kot druga stikala v možnostih pogleda. V urejevalniku samo za branje ostane namesto tega na tistem zaslonu – glejte razdelek [Urejevalniki samo za branje](#read-only-editors).

## Samodejna postavitev {#auto-layout}

Vsaka [samodejna postavitev](./table-related-functions.md#auto-layout) ohrani tabele vsake skupine skupaj, ne glede na to, ali so skupine prikazane.

- `Force` premakne vsako skupino z njenimi tabelami kot en okvir, pri čemer tabele ohranijo svoja mesta v njem, okvir vsake skupine pa drži vsaj `100px` stran od drugih skupin in od tabel brez skupine. Predogled prikaže vsako skupino tam, kamor se bo premaknila.
- `Flow`, `Tree - vertical` in `Tree - horizontal` razporedijo tabele vsake skupine znotraj skupine in postavijo skupine glede na relacije med njimi, tabele brez skupine pa razporedijo okoli njih.

Nato se vsaka skupina, ki vsebuje tabele, prilagodi tem tabelam: njen okvir se ujema z njihovimi mejami, s `24px` prostora in z naslovno vrstico. Skupina brez tabel ohrani svoje mesto in velikost.  
Postavitev tabel in skupin je en korak razveljavitve.

Uvoz DBML na enak način prilagodi vsako skupino okoli njenih tabel, kjer koli so postavljene – glejte razdelek [DBML](./file-import-export.md#dbml).

## Shema SQL po skupinah {#schema-sql-by-group}

Zavihek [Shema SQL](./schema-sql.md) lahko zapiše samo tabele izbranih skupin.  
Dokler dokument vsebuje kakšno skupino, prikazano ali skrito, plošča z možnostmi zavihka pod `This window only` prikazuje vrstico `Tables` s potrditvenim poljem za `All`, po enim za vsako skupino in enim za `No group`, tj. za tabele brez skupine – glejte razdelek [Tabele](./schema-sql.md#tables).  
Izbira pripada oknu urejevalnika in se ne shrani v dokument.

## Uvoz, izvoz in kopiranje {#import-export-and-copying}

- DBML prenaša skupine v obe smeri. Uvoz DBML vsak blok `TableGroup` spremeni v skupino – glejte razdelek [DBML](./file-import-export.md#dbml) – cilj `DBML` generatorja kode pa zapiše blok `TableGroup` za vsako skupino, ki vsebuje tabelo – glejte stran [Generator kode](./code-generator.md#language).
- Datoteka JSON ohrani svoje skupine. Noben drug format jih ne prenaša: uvozi SQL, GraphQL in AML ne prinesejo nobene, Shema SQL in drugi cilji generatorja kode pa nobene ne zapišejo.
- Ukaz [Uvozi in dodaj](./file-import-export.md#import-and-add) prinese skupine datoteke kot nove skupine z njihovimi tabelami in jih, dokler so skupine prikazane, izbere skupaj z novimi tabelami, tako da vlečenje dodanega bloka prenese tudi njegove skupine.
- [Izvožena slika](./file-import-export.md#image) nariše prikazane skupine za tabelami, z barvami skupin na njihovih glavah.
- Kopiranje in lepljenje ali podvajanje s tipko `Alt` nikoli ne kopira skupine – glejte razdelka [Kopiranje/lepljenje tabel in beležk](./table-related-functions.md#copyingpasting-tables-and-memos) in [Dodajanje in odstranjevanje tabel](#adding-and-removing-tables).

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo [`readonly`](../../api/erd-editor-element.md#readonly) se skupine kot običajno narišejo in navedejo v raziskovalcu, nanje lahko preidete, ne morete pa jih spremeniti:

- [Prehod na skupino](#going-to-a-group) jo izbere in to je edini način, na katerega je tam skupina izbrana. Pritisk na naslovno vrstico ne izbere ničesar in ne premakne ničesar: povlečena premika platno, klik, ki se ne premakne, pa odstrani izbor, ki ga je pustil skok.
- Ni ročic za spreminjanje velikosti in ni znaka `x`, dvoklik na naslovno vrstico pa ne odpre polja za ime.
- Desni klik na skupino ne odpre nobenega menija, meni tabele pa vsebuje samo `Table Properties`.
- Meni platna nima postavke `New Table Group`, hitro iskanje pa ne navaja nobenega od obeh ukazov za skupine. Risanje `New Table Group` se konča, ko urejevalnik preklopi v način samo za branje.
- [Orodna vrstica platna](./table-related-functions.md#canvas-toolbar) ohrani samo svoje kontrolnike pogleda, zato nima gumba `New Table Group`, bližnjici `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac) ter `T` in nato `G` pa ne naredita ničesar.
- Vlečenje tabel ali skupine, ki poteka, ko urejevalnik preklopi v način samo za branje, se ustavi, kjer je, in ne spremeni nobene skupine, spreminjanje velikosti skupine, ki poteka, pa se konča brez spremembe velikosti.
- `View Option` → `Table Groups` prikaže ali skrije skupine samo na tistem zaslonu, kot to tam velja za vsako možnost View Option: dokument, sodelavci in zgodovina razveljavitev ohranijo izbiro, kakršna je bila, ko pa je urejevalnik spet mogoče urejati, se izbira dokumenta vrne.
- Izbira `Tables` na zavihku Shema SQL še vedno deluje.
