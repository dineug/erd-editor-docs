---
sidebar_position: 15
description: Razveljavitev in uveljavitev sprememb, kaj beleži zgodovina, lastne zgodovine listov zavihka Slovar in pomikanje po zgodovini diagrama korak za korakom s potovanjem skozi čas.
---

# Razveljavitev, uveljavitev

Lahko se vrnete v prejšnje stanje urejanja ali se pomaknete naprej v poznejše.  
Zgodovina hrani do `2048` sprememb.

- Razveljavitev: `Ctrl + Z` (Windows/Linux) ali `⌘ + Z` (Mac)
- Uveljavitev: `Ctrl + Shift + Z` (Windows/Linux) ali `⌘ + Shift + Z` (Mac)

Na zavihku ERD orodna vrstica ponuja ista dva ukaza kot gumba `Undo` in `Redo`, ob gumbu `Time Travel`. Na zavihku Slovar prikazuje gumba `Undo` in `Redo` brez gumba `Time Travel`, noben drug zavihek pa ju ne prikazuje.  
Osvetlita se samo, kadar je na voljo kaj za razveljavitev ali uveljavitev. Urejevalnik z lastnostjo `readonly` ju skrije skupaj z gumbom `Time Travel`, bližnjice pa ne razveljavijo in ne uveljavijo ničesar.

Razveljavitev in uveljavitev delujeta na zgodovino diagrama samo na zavihku ERD.  
Bližnjice so tam neaktivne, dokler je odprto hitro iskanje, okno `Table Properties`, `Diff Viewer`, predogled `Auto Layout`, pogovorno okno [`Export image`](./file-import-export.md#image), okno [Preslikaj stolpce](./relationship-editing.md#map-columns) ali potovanje skozi čas.  
Še naprej pa delujejo, dokler je tipkovnica kjer koli v [raziskovalcu](./explorer.md#keys-in-the-explorer), vključno z njegovim drevesom, in dokler je odprt [izbirnik barv](./table-related-functions.md#table-and-memo-color-specification). Tudi ko je kazalka v enem od njunih polj, na primer v iskalnem polju, polju za zamenjavo ali polju `Hex`, razveljavijo in uveljavijo spremembe v diagramu, ne v besedilu polja.

Na drugih zavihkih:

- Slovar: razveljavljata in uveljavljata spremembe prikazanega lista, `Domains`, `Words` ali `Terms`, iz lastne zgodovine tega lista, nikoli iz zgodovine diagrama. Na listu `Checks` ne naredita ničesar – glejte razdelek [Listi zavihka Slovar](#dictionary-sheets).
- Vizualizacija: v načinu `Flow` iste tipke naredijo korak nazaj in naprej po tem, kar je prikazal način Tok, tako kot gumba `Previous table` in `Next table`, tudi v urejevalniku z lastnostjo `readonly`. Diagrama tam nikoli ne razveljavijo in ne uveljavijo – glejte razdelek [Prejšnja in naslednja tabela](./visualization.md#previous-table-and-next-table). V načinu `Graph` ne naredijo ničesar.
- Shema SQL, Generator kode in Nastavitve: nista na voljo. V poljih `Before tables` in `After tables` na zavihku Shema SQL iste tipke namesto tega razveljavijo in uveljavijo vaše tipkanje v polju.

Zgodovina se hrani v pomnilniku za trenutno sejo. Ne shrani se v dokument, zato znova odprt diagram začne s prazno zgodovino.

![Premikanje tabele in odstranjevanje stolpca z ⌥ + Backspace, nato razveljavitev obeh sprememb z ⌘ + Z in njuna uveljavitev z ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Kaj beleži zgodovina {#what-the-history-records}

Zabeleženo:

- Tabele in beležke: dodajanje, odstranjevanje, premikanje in barva; ime, logično ime in komentar tabele; besedilo in velikost beležke.
- Skupine tabel: dodajanje, odstranjevanje, premikanje, spreminjanje velikosti, ime, barva in to, v kateri skupini je vsaka tabela – glejte stran [Skupine tabel](./table-groups.md).
- Stolpci: dodajanje, odstranjevanje, spreminjanje vrstnega reda, logično ime, domena, s katero je povezan posamezni stolpec, in vsaka možnost stolpca.
- Fizična imena, ki jih izpeljejo slovarji, in to, ali je posamezno ime vaše ali ga upravljajo slovarji: ena razveljavitev povrne ime in to stanje skupaj – glejte razdelek [Vaša imena](./dictionary.md#names-of-your-own).
- Ukaza `Derive Physical Name Again` in `Derive Physical Names Again` – glejte razdelek [Znova izpelji fizična imena](./dictionary.md#derive-physical-names-again).
- Relacije: dodajanje, odstranjevanje, sprememba vrste, stolpci, nastavljeni v oknu [Preslikaj stolpce](./relationship-editing.md#map-columns), in vsaka izbira v podmeniju `On Delete` ali `On Update` – glejte razdelek [ON DELETE in ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Razveljavitev odstranitve povrne relacijo skupaj z njenima dejanjema ON DELETE in ON UPDATE.
- Indeksi in njihovi stolpci.
- Položaj pogleda, stopnja povečave in stikala `View Option`.
- Skripta `Before tables` in `After tables` na zavihku Shema SQL, en korak za vsako spremembo, ki jo uporabite tako, da zapustite polje – glejte razdelek [Skripti pred tabelami in za njimi](./schema-sql.md#before-and-after-scripts).
- Uvoz datoteke in dodajanje datoteke z ukazom [`Import and Add`](./file-import-export.md#import-and-add).

Ni zabeleženo:

- Vrsta zbirke podatkov in ime zbirke podatkov.
- Jezik generatorja kode, `Table Name Case` in `Column Name Case`.
- Vrsta narekovajev, ne glede na to, ali je nastavljena na zavihku Shema SQL ali na zavihku Generator kode.
- Izbire `Statements`, `Header`, `Write logical names into empty comments` in `Tables` na zavihku Shema SQL, ki pripadajo oknu urejevalnika – glejte razdelek [Plošča z možnostmi](./schema-sql.md#options-panel).
- Vse na zavihku Nastavitve, vključno z vrsticami [`Lock`](./settings.md#lock).
- Preklapljanje prikaza imen s katerega koli mesta, kjer je na voljo, ne glede na to, ali je njegov zaklep vklopljen ali izklopljen – glejte razdelek [Preklapljanje prikaza](./logical-names.md#switching-the-view).
- Tema in jezik prikaza – glejte stran [Jezik in tema](./language-and-theme.md).
- Katera tabela, beležka ali skupina je narisana pred drugimi.
- [Raziskovalec](./explorer.md): njegovo odpiranje, zapiranje ali spreminjanje velikosti, strnjevanje njegovega drevesa ter iskalni niz in možnosti iskanja. Vendar se zabeleži, kar spremenita ukaza `Replace` in `Replace All`, prav tako pa tudi pomik, ki ga povzroči prehod – glejte razdelek [Ena poteza, en korak](#one-gesture-one-step).
- Povečava in premikanje pogleda na zavihku Vizualizacija v obeh načinih, premikanje vozlišč grafa ali kartic v načinu Tok, `Tidy Up`, prikaz vrstic, osredotočanje na tabele in koraki z gumboma `Previous table` in `Next table` – glejte razdelek [Način Tok nikoli ne ureja dokumenta](./visualization.md#flow-never-edits-the-document).
- Prikazani list zavihka Slovar ter iskanje, izbor, položaj pomika in širine stolpcev posameznega lista – glejte razdelek [Odpiranje zavihka](./dictionary.md#opening-the-tab).

Sprememb česar koli od naštetega ni mogoče razveljaviti.

Urejevalnik samo za branje sploh ničesar ne beleži. Položaj pogleda, povečava in stikala `View Option` se tam še vedno spreminjajo, skupaj z zavihkom, prikazom imen, zbirko podatkov in nastavitvami kode, vendar samo na tistem zaslonu, zato ni ničesar za razveljavitev – glejte razdelek [Urejevalniki samo za branje](./settings.md#read-only-editors) v Nastavitvah.

Spremembe na zavihku Slovar je mogoče razveljaviti, vendar gredo v zgodovino svojega lista, ne v to zgodovino, zato razveljavitev na zavihku ERD nikoli ne odpravi nobene od njih, niti nove vrednosti `Data Type` domene in tipov stolpcev, ki jih ta spremeni – glejte razdelek [Listi zavihka Slovar](#dictionary-sheets).

Tudi spremembe, ki prispejo iz drugega urejevalnika, se ne zabeležijo, zato razveljavitev odpravi samo vaše lastne. V [sodelovalni seji](../../api/advanced/collaborative-editing.md) vsak urejevalnik razveljavi svoje spremembe, agent za kodiranje, ki ureja prek [strežnika MCP](../../mcp/live-and-headless.md#undo), pa svoje razveljavi z orodjem `erd_undo`.

Razveljavitev ukaza `Import`, ki nadomesti celoten diagram, povrne prejšnji diagram takšen, kakršen je bil v urejevalniku ob uvozu: vsak [zaklep](./settings.md#lock) je vklopljen ali izklopljen tako kot takrat, vsaka zaklenjena vrednost pa je enaka takratni.  
Če je bila v tem diagramu nastavitev `Viewport` zaklenjena, se pogled in povečava vrneta na zaklenjeni pogled, v katerem se diagram odpre, ne pa tja, kjer ste bili. Če je bila njegova nastavitev `Viewport` odklenjena, se vrneta tja, kjer ste bili ob uvozu. Druge zaklenjene nastavitve, kot so zavihek, na katerem ste, jezik generatorja kode ali prikaz imen, ostanejo takšne, kot so na vašem zaslonu.  
V novem diagramu so vsi zaklepi vklopljeni. Če želite ob taki razveljavitvi ohraniti svoj pogled, pred uvozom odklenite `Viewport`. Če ga odklenete pozneje ali uvozite datoteko JSON, katere lastni zaklep `Viewport` je izklopljen, se mesto, kamor vas pripelje razveljavitev, ne spremeni.

Razveljavitev uvoza datoteke JSON povrne tudi besede, izraze in domene, ki jih je imel prejšnji diagram. Uvoz Sheme SQL, GraphQL, DBML ali AML ohrani slovarje, zato jih njegova razveljavitev in uveljavitev pustita takšne, kot so, vključno s spremembami, ki so bile od tedaj narejene na zavihku Slovar.

Razveljavitev ali uveljavitev na zavihku ERD, ki stolpec znova poveže z domeno ali povrne stolpec, povezan z domeno, stolpcu da podatkovni tip domene, kakršen je zdaj. Tista, ki povezanemu stolpcu povrne drug tip, prekine njegovo povezavo z domeno – glejte razdelek [Domene in podatkovni tipi](./dictionary.md#domains-and-data-types).

## Ena poteza, en korak {#one-gesture-one-step}

Vse, kar odpošlje ena sama poteza, postane en vnos v zgodovini.  
Lepljenje več tabel in beležk hkrati ali njihovo podvajanje z `Alt + drag` se razveljavi v enem koraku.

En pritisk tipke `Delete` ali `Backspace`, enako pa tudi postavka `Delete selected` ali `Delete columns` v priročnem meniju, je en korak, ne glede na to, koliko tabel, beležk, skupin tabel ali stolpcev odstrani.  
Preklop primarnega ključa na več izbranih stolpcih je en korak, ne glede na to, ali ga izvedete z `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac) ali s postavko `Primary Key on selected columns` v priročnem meniju tabele.  
Nastavitev barve izbora ali njena odstranitev z možnostjo `No color` ali postavko `Remove color` je en korak, ne glede na to, koliko tabel, beležk in skupin je izbranih. Izbira barve, ki jo že ima vse izbrano, ne zabeleži nobenega koraka, prav tako pa ga ne zabeleži možnost `No color`, kadar nič izbranega nima barve.  
Pritisk gumba `Map` ali `Save` v oknu [Preslikaj stolpce](./relationship-editing.md#map-columns) je en korak, skupaj s stolpci tujega ključa, ki jih doda, in podatkovnimi tipi, ki jih spremeni.  
Ukaz `Import and Add` je en korak, skupaj s pomikom, ki pripelje dodani blok v pogled, kadar je ta pomik potreben.

Izbira izraza s seznama pod celico logičnega imena je en korak: logično ime, fizično ime, ki ga to izpelje, in pri stolpcu domena izraza z njenim podatkovnim tipom – glejte razdelek [Samodokončanje imen izrazov](./logical-names.md#completing-term-names).  
Izbira domene v celici domene stolpca je en korak, skupaj s podatkovnim tipom, ki ga ta da stolpcu, in s tem, kar [sinhronizacija tipa podatkov v relacijah](./settings.md#relationship-datatype-sync) prenese po relacijah. Tudi izbira možnosti `None`, ki prekine povezavo stolpca z domeno, je en korak – glejte razdelek [Celica domene](./logical-names.md#the-domain-cell). Vnos podatkovnega tipa, ki se razlikuje od tipa domene, v povezan stolpec prekine povezavo stolpca z domeno v koraku tega vnosa.  
Ukaz `Derive Physical Name Again` ali `Derive Physical Names Again` je en korak, ne glede na to, koliko imen, povezav z domeno in podatkovnih tipov spremeni. Nobenega koraka ne zabeleži samo, kadar ne spremeni ničesar. Vrnitev vašega imena v upravljanje slovarjem je sprememba, tudi kadar ime že vsebuje to, kar dajo slovarji.

Ustvarjanje [skupine tabel](./table-groups.md), bodisi z risanjem bodisi z združevanjem izbranih tabel s postavko `Group selected tables` ali z bližnjico `T` in nato `G`, je skupaj z vsemi tabelami, ki jih zajame, en korak. Odstranitev skupine je en korak, njena razveljavitev pa povrne skupino skupaj z njenimi tabelami v njej.  
Vlečenje skupine za naslovno vrstico premakne skupino in vse njene tabele v enem koraku. Tabele, ki jih povlečete v skupino ali iz nje, zamenjajo skupino v istem koraku kot njihovo vlečenje, če jih spustite v približno `200ms` po zadnjem premiku, zato jih ena razveljavitev vrne tja, kjer so bile, in v skupine, v katerih so bile. Po daljšem premoru pred spustom je sprememba skupine samostojen korak, prva razveljavitev pa odpravi samo to spremembo.  
Spreminjanje velikosti skupine prek roba ali kota se zabeleži enkrat, ko spustite gumb miške.  
Uporaba [samodejne postavitve](./table-related-functions.md#auto-layout) je en korak, vključno s skupinami, ki jih prilagodi tako, da obdajajo svoje tabele.

Tudi ukaz `Replace All` v [iskanju in zamenjavi](./find-and-replace.md#replacing) je en korak, ne glede na to, koliko imen tabel, imen stolpcev, logičnih imen, imen indeksov, imen skupin tabel, komentarjev in beležk spremeni, vključno s fizičnimi imeni in povezavami z domeno, ki jih izpeljejo logična imena. Kadar ne spremeni ničesar, na primer ko možnost `Preserve Case` vsak zadetek zapiše nazaj takšen, kot je bil, ne zabeleži nobenega koraka.  
En sam ukaz `Replace` je en korak, vključno s tem, kar izpelje logično ime, in s pomikom do naslednjega zadetka, kadar ta zadetek pomik potrebuje. Kadar svoj zadetek zapiše nazaj takšen, kot je bil, zabeleži samo ta pomik ali nič, kadar pomika ni.  
Prehod na zadetek pomakne platno samo, kadar zadetek še ni dobro viden – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Ta pomik se zabeleži kot vsaka druga sprememba položaja pogleda, zato razveljavitev po pomikanju med zadetki najprej odpravi te pomike, po enega na korak.  
Drugi prehodi, ki pristanejo na platnu, zabeležijo svoje pomike na enak način: izbira vrstice v raziskovalcu, rezultata hitrega iskanja, preverjanja na listu `Checks` zavihka Slovar, ki navaja tabelo ali stolpec, ali [gumba na kartici](./visualization.md#card-buttons) z ikono zunanje povezave v načinu Tok. Prehod, ki pusti pogled, kjer je, ne zabeleži ničesar. Tudi izbira vrstice na seznamu okna `Diff Viewer` ne zabeleži ničesar, ker premakne le lastni strani pregledovalnika razlik, ki sta samo za branje.

Tudi neprekinjeno vlečenje, premikanje pogleda platna, povečava, stisk prstov ali sprememba barve se približno `200ms` zbira v medpomnilniku in se zapiše kot en vnos.  
Vlečenje, pri katerem je skupni premik manjši od `20px`, ne zabeleži premika. Zabeleži se samo sprememba skupine, ki jo morebiti povzroči.

Tipkanje v celico ali beležko se beleži po posameznih vnosih, ne po potezah: korak zase je vsak vtipkani znak, vsako lepljenje in vsak korak sestavljanja z vnosno metodo (IME).  
Celica logičnega imena se beleži na enak način. Ko se njeno urejanje zapre z logičnim imenom, ki se razlikuje od tistega, s katerim se je odprlo, je fizično ime, ki ga slovarji izpeljejo iz njega, še en korak po tipkanju. Prva razveljavitev odpravi samo to ime skupaj z domeno in podatkovnim tipom, ki ju je prinesel izraz, logično ime, ki ste ga vnesli, pa pusti. Kadar se nič ne izpelje, se nič več ne zabeleži – glejte razdelek [Vnos logičnega imena](./logical-names.md#writing-a-logical-name).  
Ime skupine tabel se zabeleži enkrat, ko ga shrani tipka `Enter` ali zapustitev polja, zato je ime, ki ga vnesete v pravkar ustvarjeno skupino, ločen korak od njenega ustvarjanja. Tipka `Esc` ali nespremenjeno ime ne zabeleži ničesar.

## Listi zavihka Slovar {#dictionary-sheets}

Listi `Domains`, `Words` in `Terms` na zavihku Slovar imajo vsak svojo zgodovino, ločeno od zgodovine diagrama. Vsaka sprememba na zavihku gre v zgodovino lista, v katerega vrstice piše. Tako kot zgodovina diagrama vsaka od njih hrani do `2048` korakov in je shranjena v pomnilniku za trajanje seje.

- Ko je tipkovnica na zavihku, `Ctrl + Z` (Windows/Linux) ali `⌘ + Z` (Mac) razveljavi zadnjo spremembo prikazanega lista, `Ctrl + Shift + Z` (Windows/Linux) ali `⌘ + Shift + Z` (Mac) pa uveljavi zadnjo razveljavljeno.
- Gumba `Undo` in `Redo` v orodni vrstici naredita enako in se osvetlita samo, kadar ima prikazani list spremembo za razveljavitev ali uveljavitev. Pritisk nanju pusti tipkovnico tam, kjer je bila, v mreži ali v iskalnem polju. Zavihek nima gumba `Time Travel`.
- Na listu `Checks`, kjer se nič ne ureja, gumba ostaneta neosvetljena, niti gumba niti tipke pa ne naredijo ničesar.
- Ko je odprto urejanje celice ali je kazalka v iskalnem polju zavihka, tipke namesto tega razveljavijo in uveljavijo vaše tipkanje tam.

Zgodovine se nikoli ne mešajo. Razveljavitev na zavihku ERD nikoli ne odpravi spremembe lista, razveljavitev na listu pa nikoli ne odpravi spremembe drugega lista ali diagrama. Vsak list ohrani svojo zgodovino, medtem ko preklapljate med listi ali zavihki.

Vsako od naslednjih dejanj je en korak v zgodovini svojega lista:

- Urejanje celice, ki se zabeleži enkrat, ko se zapiše, in ne po vsakem vtipkanem znaku, ter samo, kadar spremeni vrednost – glejte razdelek [Urejanje celic](./dictionary.md#editing-cells).
- Lepljenje, vključno z vrsticami, ki jih doda, in brisanje vsebine izbranih celic s tipko `Delete` ali `Backspace` – glejte razdelek [Kopiranje in lepljenje](./dictionary.md#copying-and-pasting).
- Gumb `Add Row` ter vsako vstavljanje ali brisanje vrstic iz zgornjega pasu, iz menija mreže ali s tipkami, ne glede na to, koliko vrstic zajame – glejte razdelek [Dodajanje in brisanje vrstic](./dictionary.md#adding-and-deleting-rows).
- Izbira domene izraza z njegovega seznama, vključno z možnostjo `None` – glejte razdelek [Domena izraza](./dictionary.md#a-terms-domain).
- Razvrščanje – glejte razdelek [Razvrščanje](./dictionary.md#sorting).
- Uvoz ene datoteke CSV z ukazom `Import CSV`, ne glede na to, koliko vrstic doda ali posodobi. Je korak lista, ki ga datoteka napolni in ki ga zavihek nato prikaže, ne glede na to, s katerega lista ste jo uvozili – glejte razdelek [Uvoz](./dictionary.md#importing).

Zapis, ki ne spremeni ničesar, na primer ponovni uvoz iste datoteke ali razvrščanje lista, ki je že v tem vrstnem redu, ne zabeleži nobenega koraka, prav tako pa ga ne zabeleži zapis, zavrnjen s pojavnim obvestilom `Nothing saved: …`. Kadar izraz brez vrednosti `Physical Name` dobi ime, je fizično ime, ki ga sestavijo njegove besede, del koraka tega urejanja.

Nova vrednost `Data Type` domene je en korak lista `Domains`, skupaj s tipi, ki jih da stolpcem, povezanim z domeno, in s tipi, ki jih od teh stolpcev naprej prenese sinhronizacija tipa podatkov v relacijah – glejte razdelek [Domene in podatkovni tipi](./dictionary.md#domains-and-data-types).  
Njena razveljavitev ali uveljavitev znova nastavi tip stolpcev, ki so v tistem trenutku povezani z domeno, zato stolpec, ki ste ga medtem povezali z drugo domeno ali mu spremenili tip, ohrani svoj tip. Stolpec, ki mu je korak prekinil povezavo z domeno, na primer tuji ključ, ki mu je sinhronizacija prekinila povezavo z njegovo lastno domeno, se znova poveže samo, če je še vedno brez povezave z domeno in ima še vedno tip, s katerim ga je pustil korak.

Urejevalnik z lastnostjo `readonly` skrije gumba, tipke pa ne razveljavijo in ne uveljavijo ničesar.  
Tudi spremembe sodelavcev in agentov za kodiranje se ne zabeležijo v zgodovino lista.

Zgodovina vsakega lista se izprazni, ko se slovarji nadomestijo: z ukazom `Import` datoteke JSON, vašim ali sodelavčevim, z njegovo razveljavitvijo ali uveljavitvijo in z nalaganjem drugega diagrama v urejevalnik. Ukaz `Import` datoteke Sheme SQL, GraphQL, DBML ali AML ohrani slovarje in z njimi zgodovino vsakega lista, tudi ob svoji razveljavitvi in uveljavitvi.

## Potovanje skozi čas {#time-travel}

Odpre se z gumbom `Time Travel` v orodni vrstici, ob gumbih za razveljavitev in uveljavitev na zavihku ERD.  
Gumb ne naredi ničesar, dokler zgodovina diagrama nima vsaj ene zabeležene spremembe. Urejevalnik samo za branje takega gumba ne prikaže, urejevalnik, ki postane samo za branje, pa zapre Time Travel, ne da bi ga uveljavil.

Potovanje skozi čas odpre ločeno kopijo diagrama samo za branje, na položaju pomika, pri stopnji povečave in v [prikazu imen](./logical-names.md#name-view), ki jih prikazuje platno, ne glede na to, ali je zaklep `Viewport` ali `Name View` vklopljen.  
Premika se samo po zgodovini diagrama, zato spremembe na listih zavihka Slovar niso med njegovimi točkami.  
Povlecite drsnik ali kliknite kjer koli na njegovem traku, da se pomikate po celotni zgodovini urejanja in si vsako točko ogledate v predogledu. Skrajni levi položaj drsnika je stanje en korak pred prvo zabeleženo spremembo, ob odprtju pa je ročica drsnika na trenutnem stanju.  
Predogled je neinteraktiven: nariše mini zemljevid, vendar v njem ne morete premikati pogleda, se pomikati ali urejati, pravi dokument pa ostane nedotaknjen, dokler izbire ne uporabite.

Pritisnite gumb `Apply`, da obnovite izbrano točko, ali gumb `Cancel` oziroma tipko `Esc`, da dokument pustite nespremenjen.

![Odpiranje potovanja skozi čas, vlečenje drsnika nazaj skozi sejo in uporaba zgodnejše točke](/img/demo-time-travel.webp)
