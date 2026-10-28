---
sidebar_position: 9
description: Brskanje po tabelah diagrama z njihovimi stolpci, indeksi in tujimi ključi, po njegovih skupinah tabel in beležkah v drevesu, zasidranem ob platnu ERD, ter prehod na kateri koli od teh elementov s klikom.
---

# Raziskovalec

Raziskovalec je plošča, zasidrana ob levem robu platna ERD, ki diagram navaja v obliki drevesa: njegove tabele, vsako z njenimi stolpci, indeksi in tujimi ključi, nato njegove [skupine tabel](./table-groups.md) in nato njegove beležke. Kliknite vrstico, da preidete na to, kar predstavlja na platnu.  
Raziskovalec platno zoži, namesto da bi ga prekril. Je del urejevalnika diagramov, ne pogled Explorer v VS Code ali raziskovalec datotek v aplikaciji Obsidian.

![Odpiranje raziskovalca iz orodne vrstice, prehod na products, nato na stolpec status in tuji ključ member_id tabele orders, strnjevanje z gumbom Collapse All, razširjanje plošče in njeno zapiranje](/img/demo-explorer.webp)

Na njegovem vrhu, med njegovo naslovno vrstico in drevesom, je [iskanje in zamenjava](./find-and-replace.md). Dokler je v iskalnem polju besedilo, drevo prikazuje samo to, kar se ujema – glejte razdelek [Rezultati](./find-and-replace.md#the-results).  
Samo drevo diagrama nikoli ne spremeni: nima preimenovanja, vlečenja, brisanja niti prikazovanja in skrivanja. Zamenjava je edina sprememba, ki jo plošča naredi.

Lastno stanje raziskovalca je samo vaše: ali je odprt, njegova širina, katere vrstice so strnjene, vrstica, na kateri je fokus tipkovnice, kam je pomaknjen, in iskanje.  
Nič od tega se ne shrani v datoteko, ne zabeleži v zgodovino razveljavitev, ne deli s sodelavci in ne hrani v brskalniku. Ohrani se, dokler urejevalnik ostane odprt, tudi ko preklapljate med zavihki in ko v isti urejevalnik naložite druge dokumente. Na novo odprt urejevalnik začne z zaprtim raziskovalcem.

## Odpiranje in zapiranje {#opening-and-closing}

Odprite ga na enega od teh načinov:

- Gumb `Explorer` v orodni vrstici, takoj za gumbom `Search`, z ikono drevesa. Njegov opis orodja je `Explorer (Ctrl + F)` (Windows/Linux) ali `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac), ki se na zavihku [Bližnjice](./settings.md#shortcuts) v nastavitvah imenuje `Toggle Explorer`.
- Postavka `Toggle Explorer` v [hitrem iskanju](./quick-search.md), navedena na vsakem zavihku. Prikaže se, ko vnesete `find`, `replace`, `rename`, `tree`, `outline` ali `objects`.
- Postavka `Toggle Explorer` v priročnem meniju platna: z desno tipko miške kliknite prazno mesto na platnu ERD, zunaj katere koli [skupine tabel](./table-groups.md). Je za postavkami `New Table`, `New Memo` in `New Table Group`, pred postavko `Relationship`. Meni platna urejevalnika samo za branje te vrstice nima – glejte razdelek [Urejevalniki samo za branje](#read-only-editors).

Obe postavki `Toggle Explorer` prikazujeta bližnjico na desni.  
Gumb v orodni vrstici, bližnjica in postavka v hitrem iskanju delujejo na vsakem zavihku. Z zavihka Vizualizacija, Shema SQL, Generator kode, Slovar ali Nastavitve najprej preklopijo na zavihek ERD, ker je raziskovalec prikazan samo tam.

Gumb v orodni vrstici ploščo samo odpre in zapre. Kazalke ne postavi v iskalno polje, okno Lastnosti tabele, izbirnik teme in izbirnik `Display Language` pa pusti odprte.  
Bližnjica in obe postavki `Toggle Explorer` odprejo iskanje v raziskovalcu: kazalka se premakne v iskalno polje z izbranim besedilom, katero koli od petih pogovornih oken iz razdelka [Pogovorna okna ob njem](#dialogs-beside-it) pa se zapre. Kaj iskanje ohrani med odpiranji, je opisano v razdelku [Odpiranje in zapiranje](./find-and-replace.md#opening-and-closing) na strani o iskanju in zamenjavi.  
Bližnjica ne naredi ničesar, dokler se ureja celica tabele, beležka ali ime skupine tabel ali dokler je na zavihku [Slovar](./dictionary.md#keys-on-the-tab) odprto urejanje celice, vključno s seznamom domen izraza.

Gumb v orodni vrstici je videti pritisnjen, dokler je raziskovalec odprt na zavihku ERD in ga ne skriva [način zen](#when-it-stands-aside). Dokler je tako, gumb, bližnjica in vsaka od obeh postavk `Toggle Explorer` raziskovalca zaprejo, fokus tipkovnice, ki je bil v plošči, pa se vrne v urejevalnik.  
Bližnjica ga nikoli ne zapre, dokler je odprto hitro iskanje ali eno od petih pogovornih oken. Namesto tega zapre paleto ali pogovorno okno in premakne fokus tipkovnice v iskalno polje z izbranim besedilom, pri čemer se trenutni zadetek ohrani, če je bil raziskovalec že prikazan. Postavka `Toggle Explorer` v hitrem iskanju te izjeme ne pozna: ko jo zaženete, zapre paleto in nato odprtega raziskovalca.

Gumb `x` v naslovni vrstici, katerega opis orodja je `Close`, prav tako zapre raziskovalca in preda fokus tipkovnice platnu. Tipka `Escape` ga ne zapre – glejte razdelek [Tipke v raziskovalcu](#keys-in-the-explorer).  
Ko raziskovalca znova odprete, se vrne z enako širino, z drevesom, strnjenim in pomaknjenim tako kot prej, ter z enakim iskalnim nizom. Če ga odprete z bližnjico ali s postavko `Toggle Explorer`, ta iskalni niz znova poišče in vse rezultate prikaže razširjene – glejte razdelek [Rezultati](./find-and-replace.md#the-results).

Ko bližnjica ali postavka `Toggle Explorer` odpre raziskovalca v urejevalniku, ki je zanj preozek, se prikaže pojavno obvestilo `Widen the window to show the Explorer`, fokus tipkovnice pa ostane, kjer je bil – glejte razdelek [Ob platnu](#beside-the-canvas).  
Raziskovalec je kljub temu odprt, gumb v orodni vrstici pa pritisnjen, in ko je urejevalnik dovolj širok, se prikaže z že izvedenim iskanjem, ne da bi prevzel fokus tipkovnice. Odpiranje z gumbom v orodni vrstici ne prikaže pojavnega obvestila.

## Ob platnu {#beside-the-canvas}

Raziskovalec se razteza ob levem robu zavihka ERD, pod orodno vrstico, po celotni višini platna.  
Platno se zoži, da mu naredi prostor, zato noben del diagrama ne leži pod ploščo, [orodna vrstica platna](./table-related-functions.md#canvas-toolbar), mini zemljevid in [pozdravni zaslon](./editing-start.md#welcome-screen) pa so vsi na platnu ob njem.  
Odpiranje, zapiranje ali spreminjanje velikosti raziskovalca ne pomakne diagrama in v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records) ne zabeleži ničesar.

V na novo odprtem urejevalniku je sprva širok `260px`. Povlecite njegov desni rob, da mu nastavite širino kjer koli od `200px` do `480px`, ali dvokliknite rob, da se vrne na `260px`.

Platno ob raziskovalcu vedno ohrani vsaj `320px`:

- V urejevalniku, ki je ožji od širine raziskovalca, povečane za `320px`, se raziskovalec nariše ožji, da se prilega, do najmanj `200px`.
- V urejevalniku, ki je ožji od `520px`, se umakne. Ni narisan, vendar ostane odprt, zato je gumb v orodni vrstici še vedno videti pritisnjen, pritisk nanj pa raziskovalca zapre. Ko je urejevalnik dovolj širok, se vrne s svojo širino.

Šteje širina samega urejevalnika, ne širina okna brskalnika, čeprav pojavno obvestilo iz razdelka [Odpiranje in zapiranje](#opening-and-closing) govori o oknu.

V [jeziku prikaza, ki se piše od desne proti levi](./language-and-theme.md#right-to-left-languages), raziskovalec ostane levo od platna, ker platno nikoli ni zrcaljeno.  
Njegova vsebina se bere od desne proti levi: naslovna vrstica, iskanje in vrstice se zrcalijo, vrstice pa se zamikajo od desne. Rob, ki ga vlečete, ostane na njegovi desni strani, ob platnu. Podatkovni tipi, stolpci indeksov in besedilo tujih ključev ohranijo vrstni red od leve proti desni.

## Ko se umakne {#when-it-stands-aside}

Raziskovalec je prikazan samo na zavihku ERD.  
Preklop na drug zavihek ga skrije, gumb v orodni vrstici pa ni več videti pritisnjen. Ko se vrnete na zavihek ERD, se znova prikaže tak, kot ste ga pustili, enako strnjen in pomaknjen.

Dokler je odprt [pregledovalnik razlik](./table-related-functions.md#diff-viewer), [potovanje skozi čas](./undo-redo.md#time-travel) ali predogled [samodejne postavitve](./table-related-functions.md#auto-layout), raziskovalca nič ne odpre in ne zapre:

- Odprt raziskovalec se skrije in se znova prikaže, ko se zaprejo.
- Gumb v orodni vrstici je zatemnjen in ne naredi ničesar.
- Hitro iskanje izpusti postavko `Toggle Explorer`.
- Bližnjica je prepuščena brskalniku ali gostitelju – glejte razdelek [Iskalna vrstica brskalnika](./find-and-replace.md#the-browsers-find-bar).

Pregledovalnik razlik svoje spremembe navaja v drevesu enake vrste – glejte razdelek [Pregledovalnik razlik](./table-related-functions.md#diff-viewer).

Vklop [načina zen](./table-related-functions.md#canvas-toolbar) z `Alt + Z` (Windows/Linux) ali `⌥ + Z` (Mac) odprtega raziskovalca skrije, ne da bi ga zaprl, izklop načina zen pa raziskovalca vrne.  
V načinu zen bližnjica in obe postavki `Toggle Explorer` še vedno odprejo iskanje v raziskovalcu, način zen pa ostane vklopljen. Raziskovalec se tedaj razteza po celotni višini urejevalnika, ker zgornje orodne vrstice ni, in ostane prikazan, ko se način zen izklopi. Ponovni vklop načina zen ga znova skrije.

Kadar koli plošča izgine, medtem ko je fokus tipkovnice v njej, ne glede na to, ali je zaprta, skrita ali umaknjena, se fokus tipkovnice vrne v urejevalnik.

## Drevo {#the-tree}

Naslovna vrstica prikazuje `Explorer` in vsebuje dva gumba: `Collapse All` in `x`, ki zapre raziskovalca. Pod njo je iskanje – glejte stran [Iskanje in zamenjava](./find-and-replace.md) – pod tem pa drevo.

Najvišja raven vsebuje tri mape, v tem vrstnem redu: `Tables`, `Table Groups` in `Memos`. Pod vsako tabelo so njene lastne mape `Columns`, `Indexes` in `Foreign Keys`.  
Mapa brez vsebine se ne prikaže, zato prazen diagram ne prikaže nobene vrstice. Mapa `Table Groups` je izpuščena tudi, dokler [View Option](./table-related-functions.md#table-view-options) → `Table Groups` skriva skupine, mapa `Memos` pa, dokler View Option → `Memos` skriva beležke.  
Vrstica mape prikazuje ikono mape, njeno ime in na skrajnem koncu število vrstic neposredno pod njo, zato je število ob mapi `Tables` število tabel v diagramu. Število združuje tisočice tako, kot to počne jezik prikaza, vedno s števkami od 0 do 9, na primer `1,234` v angleščini in `1.234` v nemščini.

Tabele so razvrščene po imenu ne glede na velikost črk, tabele z enakim imenom pa ohranijo vrstni red iz dokumenta. Enako so razvrščene skupine tabel in tudi tabele pod vsako skupino. Stolpci tabele ohranijo vrstni red same tabele, njeni indeksi, njeni tuji ključi in beležke pa vrstni red iz dokumenta.  
Drevo sledi spremembam diagrama, ne glede na to, ali jih povzroči sprememba na platnu, razveljavitev ali uveljavitev, uvoz, sodelavec ali agent za kodiranje, zato preimenovanje tabele premakne njeno vrstico.  
Vrstni red v vsakem [prikazu imen](./logical-names.md#name-view) sledi imenu, nikoli logičnemu imenu. Preklop prikaza spremeni imena na vrsticah tabel in stolpcev, ne da bi katero koli premaknil, enako pa velja, ko tabeli ali stolpcu v prikazu `Logical Names` ali `Both Names` date logično ime. Fizično ime, [izpeljano](./dictionary.md#deriving-physical-names) iz novega logičnega imena, pa je preimenovanje kot vsako drugo, zato lahko premakne vrstico tabele.

Glede na vrsto vrstica prikazuje:

- Tabela: ikono tabele in njeno ime.
- Stolpec: ikono ključa za stolpec primarnega ali tujega ključa, obarvano tako, kot celica ključa v sami tabeli obarva primarni ključ, tuji ključ ali oboje, za vsak drug stolpec pa ikono seznama. Nato njegovo ime in v bledem besedilu njegov podatkovni tip, ki mu sledi `PK`, `FK` ali oboje, kot je `id` `BIGINT PK` ali `user_id` `BIGINT FK`. Prikazani tip je vedno podatkovni tip stolpca, nikoli njegova [domena](./logical-names.md#the-domain-cell), ne glede na prikaz imen.
- Indeks: ikono indeksa in njegovo ime. Nato v bledem besedilu `UNIQUE` za enoličen indeks in njegove stolpce v oklepajih v vrstnem redu indeksa, z `DESC` za padajočim stolpcem, kot je `orders_user_idx` `UNIQUE (user_id DESC, total)` ali samo `(total)`.
- Tuji ključ: naveden je samo pod podrejeno tabelo, torej tisto, ki vsebuje stolpce tujega ključa, in samo, dokler je nadrejena tabela v diagramu. Njegova ikona ključa prevzame barvo povezovalne črte: barvo primarnega in tujega ključa pri [identifikacijski relaciji](./relationship-editing.md#identifying-relationships), sicer barvo tujega ključa. Prikazuje ključne stolpce podrejene tabele, ločene z vejicami, nato v bledem besedilu `→` z nadrejeno tabelo in njenimi stolpci, kot je `user_id` `→ users(id)`.
- Skupina tabel: piko v barvi skupine, sivo pri skupini brez barve, in njeno ime. Njene tabele so navedene pod njo po imenu in vsaka vodi do svoje tabele. Skupina brez tabel nima ničesar, kar bi se dalo razširiti.
- Beležka: ikono samolepilnega listka in prvo vrstico beležke.

Vrstice tabel, tabele, navedene pod skupino, in vrstice stolpcev sledijo prikazu imen – glejte razdelek [Zunaj platna](./logical-names.md#beyond-the-canvas). V prikazu `Both Names` se vrstica stolpca na primer glasi `Total Amount` `total` `NUMERIC`: logično ime, nato ime in podatkovni tip, oba v bledem besedilu.  
V vsakem prikazu vrstice indeksov in tujih ključev prikazujejo svoje stolpce po imenu, vrstica tujega ključa pa po imenu prikazuje tudi svojo nadrejeno tabelo.  
Dokler je v iskalnem polju besedilo, vrstica, najdena samo v imenu, ki ga njen prikaz izpusti, prikaže tudi to ime v bledem besedilu – glejte razdelek [Rezultati](./find-and-replace.md#the-results).

Prazno ime ali beležka s prazno prvo vrstico se prikaže kot `unnamed` v ležečem tisku. V prikazih `Logical Names` in `Both Names` se tabela ali stolpec prikaže kot `unnamed` le, kadar je prazno tudi njegovo logično ime.  
Na ozki plošči se bledo besedilo skrajša z `…`, še preden se skrajša ime, s katerim se vrstica začne. Premaknite kazalec nad ime ali njegovo bledo besedilo, da ga vidite v celoti.

Sprva je razširjena samo mapa `Tables`. Kliknite vrstico mape ali na njej pritisnite `Enter` ali `Space`, da jo strnete ali razširite.  
Puščica na začetku vrstice to vrstico strne ali razširi brez kakršnega koli prehoda. Ima jo vsaka vrstica tabele, tudi tabela, pod katero ni ničesar. Tudi `→` in `←` strneta in razširita – glejte razdelek [Tipke v raziskovalcu](#keys-in-the-explorer).  
Gumb `Collapse All` ob vsakem pritisku strne eno raven: najglobljo raven razširjenih vrstic, ki so prikazane, zato pritiski strnjujejo od spodaj navzgor. Pritisk, ki doseže najvišjo raven, strne vse vrstice, vključno s tistimi pod že strnjeno vrstico, tako da ostanejo samo mape najvišje ravni.  
Urejanje, razveljavitev in uveljavitev ter spremembe sodelavcev ali agenta za kodiranje pustijo strnjene in razširjene vrstice takšne, kot so.

## Prehod na vrstico {#going-to-a-row}

Kliknite vrstico ali pritisnite `Enter` ali `Space`, ko je na njej fokus tipkovnice, da preidete na to, kar predstavlja na platnu ERD. Vrstica mape se samo strne ali razširi, puščične tipke pa premikajo fokus samo po drevesu.

- Vrstica tabele ali tabela, navedena pod skupino, izbere samo to tabelo in jo postavi v ospredje. Razen če je celica s fokusom že v tej tabeli, se fokus premakne na prvo celico glave tabele: na ime ali v prikazih `Logical Names` in `Both Names` na logično ime.
- Vrstica stolpca izbere samo njegovo tabelo in fokus postavi na ime stolpca ali v prikazu `Logical Names` na logično ime, izrisano na njegovem mestu.
- Vrstica indeksa izbere njegovo tabelo, tako kot vrstica tabele. Sam indeks ni posebej označen; indeksi se urejajo v oknu [Lastnosti tabele](./table-related-functions.md#indexes).
- Vrstica tujega ključa prikaže obe tabeli relacije skupaj v pogledu ali podrejeno tabelo, kadar sta tabeli preveč narazen, da bi ju bilo mogoče prikazati skupaj. Izbere samo podrejeno tabelo z njenimi stolpci tujega ključa, s fokusom na celici prvega od njih, in osvetli povezovalno črto relacije – glejte razdelek [Branje povezovalne črte](./relationship-editing.md#reading-a-connector).
- Vrstica skupine tabel prikaže okvir skupine v pogledu, pri čemer se ravna po njegovi naslovni vrstici, izbere samo skupino in jo skupaj z njenimi tabelami postavi v ospredje.
- Vrstica beležke izbere samo beležko in jo postavi v ospredje.

Pogled se premakne po pravilu, ki velja za vse prehode: povečava se nikoli ne spremeni, platno pa se pomakne le, kadar cilj prehoda še ni dobro viden – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands).  
Prehod na vrstico najprej zapre okno Lastnosti tabele, če je odprto, in nikoli ne začne ali konča risanja relacije.  
Dokler je v iskalnem polju besedilo, vrstica, katere ime ali logično ime vsebuje zadetek, ali vrstica, ki prikazuje izsek komentarja ali beležke, namesto tega pripelje do svojega prvega zadetka – glejte razdelek [Prehod na zadetek](./find-and-replace.md#going-to-a-match).

Po kliku fokus tipkovnice ostane v drevesu, zato `Delete`, `Backspace` in druge tipke za urejanje ne dosežejo novega izbora, dokler ne pritisnete tipke `Escape` ali ne kliknete platna – glejte razdelek [Tipke v raziskovalcu](#keys-in-the-explorer).

## Tipke v raziskovalcu {#keys-in-the-explorer}

Tipka `Tab` se na drevesu ustavi samo enkrat, dokler drevo nima vrstic, pa ga preskoči.  
Ko se vanj premaknete s tipko Tab, fokus pristane na vrstici, na kateri je bil nazadnje, sicer na vrstici trenutnega zadetka ali na prvi vrstici, ki je v celoti vidna, ta vrstica pa se pomakne v pogled. Vrstica s fokusom tipkovnice je narisana enako kot vrstica pod kazalcem miške.

V drevesu:

- `↑` in `↓` premakneta fokus za eno vrstico in se na prvi in zadnji vrstici ustavita, namesto da bi preskočila na drugi konec. `Home` in `End` preideta na prvo in zadnjo vrstico.
- `→` razširi strnjeno vrstico ali se premakne na prvo podrejeno vrstico razširjene vrstice. `←` strne razširjeno vrstico ali se premakne ven na nadrejeno vrstico. V jeziku prikaza, ki se piše od desne proti levi, tipki zamenjata vlogi.
- `Enter` in `Space` delujeta kot klik: preideta na vrstico ali strneta oziroma razširita mapo – glejte razdelek [Prehod na vrstico](#going-to-a-row).
- Tipkanje črke ne povzroči skoka na vrstico.

Tipka `Escape`, pritisnjena kjer koli v raziskovalcu, v drevesu, v iskalnem polju ali polju za zamenjavo ali na enem od njegovih gumbov, vrne fokus tipkovnice platnu. Raziskovalec ostane odprt, izbor pa ostane nespremenjen.  
Pritisk tipke `Escape`, ki konča sestavljanje z vnosno metodo, konča samo sestavljanje. Tipka `Escape` raziskovalca nikoli ne zapre, ne glede na to, ali jo pritisnete v njem ali na platnu.

Nekaj bližnjic urejevalnika deluje tudi, ko je fokus tipkovnice v raziskovalcu – glejte razdelek [Bližnjice](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) deluje tako kot na platnu: zapre raziskovalca ali, dokler je ob njem odprto okno Lastnosti tabele, zapre okno Lastnosti tabele in kazalko postavi v iskalno polje – glejte razdelek [Odpiranje in zapiranje](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac) preklopi hitro iskanje.
- `Undo` in `Redo` razveljavita in uveljavita spremembe diagrama, ne besedila v polju.
- `Zoom In`, `Zoom Out` in `Zoom Reset` spreminjajo povečavo platna.

Vse druge bližnjice urejevalnika ostanejo v raziskovalcu, prav tako puščične tipke, `Tab`, `Enter`, `Space`, `Home`, `End` in vsaka tipka, pritisnjena med sestavljanjem z vnosno metodo.  
Nobena od njih ne doseže platna: `Delete` in `Backspace` nikoli ne izbrišeta izbora, `Alt + N` (Windows/Linux) ali `⌥ + N` (Mac) ne doda tabele, `T` in nato `G` pa ne združi ničesar v skupino. V polju delujejo kot običajne tipke za besedilo: `Ctrl + A` (Windows/Linux) ali `⌘ + A` (Mac) izbere besedilo polja, `Delete` in `Backspace` brišeta besedilo, `Space` pa vnese presledek. `Tab` premika fokus med gumbi, polji in drevesom raziskovalca.  
Tipke samega iskalnega polja in polja za zamenjavo so opisane v razdelku [Tipke v iskalnih poljih](./find-and-replace.md#keys-in-the-search-fields).  
Tipke, ki jih urejevalnik nima dodeljenih, na primer gostiteljeve lastne tipke za shranjevanje ali paleto ukazov, kot običajno dosežejo gostitelja.

## Pogovorna okna ob njem {#dialogs-beside-it}

Okno [Lastnosti tabele](./table-related-functions.md#table-properties), [izbirnik teme](./language-and-theme.md#theme), izbirnik [`Display Language`](./language-and-theme.md#picking-a-language), pogovorno okno [`Export image`](./file-import-export.md#image) in okno [Preslikaj stolpce](./relationship-editing.md#map-columns) ob odpiranju pustijo raziskovalca odprtega.

- Okno Lastnosti tabele se odpre na sredini platna ob raziskovalcu in zatemni samo platno. Raziskovalec ostane uporaben: izbira vrstice zapre okno Lastnosti tabele in nato preide na vrstico.
- Pogovorno okno `Export image` in okno Preslikaj stolpce zatemnita celoten urejevalnik, vključno z orodno vrstico in raziskovalcem. Raziskovalec ostane odprt pod zatemnjenim območjem, klik tam pa zapre pogovorno okno, tako kot klik kjer koli na zatemnjenem območju; okno Preslikaj stolpce se pri tem zapre, ne da bi kar koli preslikalo.
- V jeziku prikaza, ki se piše od leve proti desni, se izbirnik teme in izbirnik `Display Language` odpreta tik ob raziskovalcu namesto čezenj in se premakneta, če se raziskovalec odpre ali zapre, medtem ko sta prikazana. V jeziku, ki se piše od desne proti levi, ohranita svoje mesto na desni. Pritisk v raziskovalcu ju zapre, tako kot vsak pritisk zunaj njiju, razen pritiska na orodno vrstico.

Odpiranje iskanja z bližnjico ali s postavko `Toggle Explorer` zapre vseh pet, okno Preslikaj stolpce pa, ne da bi kar koli preslikalo.  
Tudi [hitro iskanje](./quick-search.md) pusti raziskovalca odprtega, tipka `Escape` pa nato zapre samo paleto.

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo [`readonly`](../../api/erd-editor-element.md#readonly) raziskovalec deluje tako kot v vsakem drugem: gumb v orodni vrstici z enakim opisom orodja, bližnjica, postavka `Toggle Explorer` v hitrem iskanju, drevo, strnjevanje in gumb `Collapse All`. Tudi tam je njegov naslov `Explorer`. Priročni meni platna tam nima postavke `Toggle Explorer`, saj ohrani samo vrstice, ki berejo – glejte razdelek [Urejevalniki samo za branje](./table-related-functions.md#read-only-editors).

Prehod na vrstico deluje kot v razdelku [Prehod na vrstico](#going-to-a-row): pogled se premakne po istem pravilu, tabela, skupina tabel ali beležka vrstice pa se izbere, na platnu obrobi, s celico v fokusu tam, kamor jo postavi vrstica.  
To je edini način, na katerega urejevalnik samo za branje kar koli izbere. Pritisk na platno ne izbere ničesar, klik, ki se ne premakne, pa počisti izbor, ki ga je pustila vrstica. Tabela, ki jo je izbral, se odpre v oknu [Lastnosti tabele](./table-related-functions.md#table-properties) z `Alt + Space` (Windows/Linux) ali `⌥ + Space` (Mac), samo za branje, `Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac) pa kopira, kar je izbral, kot v vsakem urejevalniku.  
Njegovo iskanje samo išče – glejte razdelek [Urejevalniki samo za branje](./find-and-replace.md#read-only-editors) na strani o iskanju in zamenjavi.
