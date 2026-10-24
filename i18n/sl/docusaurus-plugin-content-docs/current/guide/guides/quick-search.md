---
sidebar_position: 8
description: Odprite paleto ukazov, da preklopite zavihek ali prikaz imen, zaženete ukaz za trenutni zavihek, odprete ali zaprete raziskovalca, spremenite temo ali jezik prikaza ali z vnosom predpone skočite na tabelo, stolpec, komentar ali beležko.
---

# Hitro iskanje

Hitro iskanje je paleta ukazov urejevalnika.  
Navaja ukaze, ki so na voljo na zavihku, na katerem ste. Iskanje začnite z znakom `#`, `@` ali `:`, da namesto tega preiščete diagram in skočite na tabelo, stolpec ali komentar oziroma beležko.

Odprite ga z bližnjico `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac) ali kliknite gumb `Search` v orodni vrstici.  
Zapre ga ista bližnjica, prav tako tipka `Esc` in klik zunaj plošče. Ko ga odprete, se zaprejo okno Lastnosti tabele, [izbirnik teme](./language-and-theme.md#theme), izbirnik [`Display Language`](./language-and-theme.md#picking-a-language), pogovorno okno [`Export image`](./file-import-export.md#image) in okno [Preslikaj stolpce](./relationship-editing.md#map-columns), pri čemer se izgubi, kar ste v njem izbrali. Ne odpre se, medtem ko urejate celico tabele, beležko, ime skupine tabel ali celico na zavihku [Slovar](./dictionary.md).

Gumb v orodni vrstici takoj za gumbom `Search` je `Explorer`. Odpre ali zapre [raziskovalca](./explorer.md), drevo diagrama, zasidrano levo od platna, z iskanjem in zamenjavo na vrhu.  
Ko odprete paleto, raziskovalec ostane odprt, tipka `Esc` pa nato zapre samo paleto. Bližnjica `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac), pritisnjena v paleti, paleto zapre in premakne fokus tipkovnice v iskalno polje raziskovalca, pri čemer odpre iskanje v raziskovalcu, če raziskovalec ni prikazan. Za razliko od postavke `Toggle Explorer` ta bližnjica raziskovalca iz palete nikoli ne zapre – glejte razdelek [Odpiranje in zapiranje](./explorer.md#opening-and-closing). Dokler je odprt pregledovalnik razlik, potovanje skozi čas ali predogled samodejne postavitve, urejevalnik bližnjice ne prestreže: paleta ostane odprta, bližnjica pa gre naprej do brskalnika ali gostitelja – glejte razdelek [Iskalna vrstica brskalnika](./find-and-replace.md#the-browsers-find-bar).  
Gostitelj, ki vdela urejevalnik, lahko hitro iskanje dodeli drugi tipki, ki jo nato prikaže opis orodja gumba `Search` – glejte razdelek [Bližnjice](./settings.md#shortcuts).

![Odpiranje palete s ⌘ + K, nato skok na tabelo z vnosom #pay, na stolpec z vnosom @price in na komentar tabele z vnosom :address](/img/demo-quick-search.webp)

## Iskanje in premikanje {#searching-and-navigating}

Tipkajte, da filtrirate seznam. Vsak pritisk tipke znova preišče celoten seznam pred vami, zato brisanje znakov ali vnos nove besede namesto besede, ki ni našla ničesar, vrne ujemajoče se postavke.  
Ujemanje je približno in zajema tako ime postavke kot ključne besede, prikazane ob njej. V podmeniju `Import` na primer `sdl` najde `GraphQL`, `dbdiagram` najde `DBML`, `azimutt` pa `AML`. Manjša tipkarska napaka še vedno najde svojo postavko, tako kot `tabel` najde `New Table` in `imprt` najde `Import`, postavka, ki le ohlapno spominja na vneseno besedilo, pa je izpuščena: `memo` navede samo `New Memo`. Postavka, katere ime ali ključne besede vsebujejo vneseno besedilo, ne glede na velikost črk, je vedno navedena, tista, ki jo približno ujemanje zgreši, pa je za zadetki približnega ujemanja. Vneseno besedilo je poudarjeno povsod, kjer ga postavka vsebuje, ne glede na velikost črk.  
V jeziku prikaza, ki ni angleščina, se ukazi in postavke podmenijev najdejo tudi po angleških imenih in ključnih besedah, ki jih seznam ne prikazuje, zato `new table` najde ukaz `New Table` ne glede na to, v katerem jeziku je prikazan.  
Po seznamu se premikajte s tipkama `↑` in `↓` – na obeh koncih se seznam nadaljuje z nasprotnega konca – poudarjeno postavko pa zaženite s tipko `Enter`. Ukaz, ki ima lastno bližnjico, jo prikaže na koncu svoje vrstice: na desni ali, v jeziku prikaza, ki se piše od desne proti levi, na levi. Dokler vnosna metoda še sestavlja, na primer sredi korejskega zloga, tipke `↑`, `↓` in `Enter` pripadajo njej ter ne premaknejo poudarka niti ne zaženejo postavke.

Postavka, kot je `Database`, `Import` ali `Auto Layout`, odpre podmeni: njegove postavke zamenjajo seznam, iskalno polje pa se izprazni. Podmeniji postavk `Name View`, `Database`, `Bracket`, `Language`, obeh zapisov imen, `Schema SQL: Statements`, `Schema SQL: Header`, `Theme` in `Display Language` s kljukico označijo trenutno izbiro in se odprejo s poudarkom na njej, zato jo tipka `Enter` ohrani; drugi podmeniji se odprejo brez poudarjene postavke.  
Filtriranje vedno velja samo za seznam pred vami in vrnitev na višjo raven ni mogoča, zato paleto zaprite in znova odprite, da začnete od začetka. V podmeniju so `#`, `@`, `:` in `?` navadno besedilo, ne [predpone](#searching-the-diagram).

## Kaj navaja paleta {#what-the-palette-lists}

Seznam je odvisen od zavihka, na katerem ste. Seznam vsakega zavihka se začne s postavko `Tab`, ki preklopi na `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator`, `Dictionary` ali `Settings`, pri čemer izpusti zavihek, na katerem že ste.

Na zavihku ERD: `Name View` in do štiri vrstice, ki [znova izpeljejo fizična imena](./dictionary.md#derive-physical-names-again), nato `Database`, `Import`, `Import and Add` in `Export`, nato `New Table`, `New Memo`, `New Table Group` in `Group Selected Tables`, štiri vrste relacij in `Auto Layout`. Tabele tu niso navedene; vnesite `#`, da [skočite na eno od njih](#searching-the-diagram).  
Postavka `Name View` odpre `Physical Names`, `Logical Names` in `Both Names`, pri čemer je trenutni prikaz označen s kljukico, izbira pa preklopi prikaz tako kot postavka `Name View` v priročnem meniju platna – glejte razdelek [Preklapljanje prikaza](./logical-names.md#switching-the-view). Navedena je samo na zavihku ERD, tudi v urejevalniku samo za branje.  
Vrstice za izpeljavo se razlikujejo po ključnih besedah ob njih. Postavka `Derive Physical Name Again` s ključno besedo `column` ob njej izpelje stolpec s fokusom. Postavka `Derive Physical Names Again` je navedena v treh vrsticah: s `table` za tabelo, v kateri je fokus, njeno ime in vsak stolpec; s `selected tables` za izbrane tabele, ko sta izbrani vsaj dve; ter z `whole document` za vse tabele v diagramu. Vsaka je navedena samo, kadar ima kaj zajeti, v urejevalniku samo za branje pa nobena.  
Postavka `Import and Add` je izpuščena v urejevalniku samo za branje, postavka `New Memo` pa, dokler [View Option](./table-related-functions.md#table-view-options) → `Memos` skriva beležke. Postavka `New Table Group` začne risanje [skupine tabel](./table-groups.md) na platnu, postavka `Group Selected Tables` pa izbrane tabele postavi v novo skupino in odpre polje za vnos njenega imena. Obe sta izpuščeni v urejevalniku samo za branje in dokler View Option → `Table Groups` skriva skupine, postavka `Group Selected Tables` pa potrebuje tudi vsaj eno izbrano tabelo. Njuni vrstici prikazujeta tipke: `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac) za [risanje skupine](./table-groups.md#drawing-a-group) ter `T` in nato `G` za [združevanje izbranih tabel v skupino](./table-groups.md#grouping-selected-tables).  
Te postavke zaženejo iste ukaze kot priročni meni platna, razen tam, kjer zaženejo ukaze menija tabele: `Group Selected Tables` zažene njegovo postavko `Group selected tables`, vrstice za izpeljavo `column`, `table` in `selected tables` pa njegovo postavko `Derive Physical Name Again` ali `Derive Physical Names Again`, in sicer na fokusu ali izboru namesto tam, kjer kliknete z desno tipko miške. Postavki `View Option` in `Diff Viewer` sta samo v priročnem meniju. Postavka `Export` ponuja iste možnosti `json`, `Schema SQL` in `Image` kot priročni meni, vnos `png` ali `svg` v njenem podmeniju pa najde `Image`.  
Na strani [Uvoz in izvoz datotek](./file-import-export.md) je opisano, kaj naredijo posamezni formati, ukaz [Uvozi in dodaj](./file-import-export.md#import-and-add) in [izvoz slike](./file-import-export.md#image), na strani [Funkcije za tabele](./table-related-functions.md#databases) pa, na kaj vpliva izbira zbirke podatkov.

Na zavihku Shema SQL: znova `Database` in `Bracket`, ki določa narekovaj okoli imen tabel, stolpcev, omejitev in indeksov v ustvarjeni kodi SQL – `SingleQuote`, `DoubleQuote`, `Backtick` ali `None` za imena brez vsakršnih narekovajev. Nato `Schema SQL: Statements` in `Schema SQL: Header`, ki omogočata iste izbire kot plošča z možnostmi na zavihku, a navajata samo tiste, ki jih izbrana zbirka podatkov zapiše, ter `Schema SQL: Options panel`, ki to ploščo prikaže ali skrije. Za to, kaj zapiše posamezna izbira, glejte stran [Shema SQL](./schema-sql.md).

Na zavihku Generator kode: `Database`, `Bracket`, dokler je jezik `Doctrine`, `JPA` ali `SeaORM`, nato `Language`, `Table Name Case`, `Column Name Case` in `Code Generator: Options panel`, ki prikaže ali skrije ploščo z možnostmi na zavihku. Za to, kaj ustvari posamezen cilj, glejte stran [Generator kode](./code-generator.md).

Zavihki Vizualizacija, Slovar in Nastavitve nimajo lastnih ukazov, temveč samo `Tab` in spodaj opisane ukaze, ki jih navaja vsak zavihek.

Blizu konca seznama vsakega zavihka, tudi v urejevalniku samo za branje, je postavka `Toggle Explorer`, ki prikazuje svojo bližnjico, `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac). Najde jo tudi vnos `find`, `replace`, `rename`, `tree`, `outline` ali `objects`.  
Ko jo zaženete, zapre paleto in naredi to, kar bližnjica naredi na platnu. Dokler je gumb `Explorer` v orodni vrstici prikazan kot pritisnjen, torej dokler je raziskovalec odprt na zavihku ERD in ga ne skriva način zen, raziskovalca zapre. Sicer preklopi na zavihek ERD in odpre iskanje v raziskovalcu, s kazalko v iskalnem polju – glejte razdelek [Odpiranje in zapiranje](./explorer.md#opening-and-closing). Izpuščena je, dokler je odprt pregledovalnik razlik, potovanje skozi čas ali predogled samodejne postavitve.

### Tema in jezik prikaza {#theme-and-display-language}

Za postavko `Toggle Explorer` vsak zavihek navaja postavki `Theme` in `Display Language`, tudi v urejevalniku samo za branje. Vsaka je navedena samo tam, kjer urejevalnik ponuja njen izbirnik, kar kažeta gumba `Theme` in `Display Language` v orodni vrstici. Oba izbirnika ponujajo spletna aplikacija, Google Drive, VS Code, razvojna okolja JetBrains in Obsidian – glejte razdelek [V posameznih gostiteljih](./language-and-theme.md#in-each-host).

Postavka `Theme` odpre `System`, `Light` in `Dark`, pri čemer je trenutni videz označen s kljukico. Izbira možnosti spremeni samo videz, sive tone in barvo poudarka pa ohrani, tako kot gumbi `Appearance` v izbirniku teme.  
Postavka `Display Language` odpre `System` in nato 25 jezikov, vsakega z izvirnim imenom in v vrstnem redu izbirnika, pri čemer je trenutna možnost označena s kljukico. Tu se jezik najde tudi po angleškem imenu ali kodi: `german` ali `de-DE` najde `Deutsch`, `korean` pa `한국어`.  
Izbira v katerem koli od obeh podmenijev začne veljati takoj, zapre paleto in se ohrani tako kot izbira v izbirniku teme ali izbirniku `Display Language`. Če se jezik prikaza spremeni, medtem ko je paleta odprta, seznam preklopi nanj, pri čemer ohrani vneseno besedilo in podmeni, v katerem ste.

## Iskanje po diagramu {#searching-the-diagram}

Iskanje začnite s predpono, da preiščete diagram namesto ukazov: `#` za tabele, `@` za stolpce, `:` za komentarje in beležke ali `?` za prikaz seznama predpon. Predpona deluje na vsakem zavihku. Šteje samo kot prvi znak, pri čemer se presledki pred njo ne upoštevajo. Presledek za njo ni obvezen, zato sta `#users` in `# users` isto iskanje, štejejo pa tudi znaki polne širine `＃`, `＠`, `：` in `？`, ki jih vnese japonska ali kitajska vnosna metoda.  
Dokler je vnosno polje na najvišji ravni prazno, vrstica pod njim prikazuje štiri predpone; kliknite eno, da jo vnesete. Dokler predpona velja, je na koncu vnosnega polja naveden njen obseg iskanja: `Tables`, `Columns`, `Comments & memos` ali `Help`. Izbrišite predpono, da se ukazi vrnejo.

Predpona `#` navede tabele, vsako z oznako `Table` ob njej. Vrstica poimenuje svojo tabelo tako kot [prikaz imen](./logical-names.md#beyond-the-canvas), na primer `Accounts (users)` v prikazu `Both Names`, tabela brez imena za prikaz pa je navedena kot `unnamed`. Če za `#` ni ničesar, so tabele v vsakem prikazu razvrščene po imenu, nikoli po logičnem imenu. Besedilo za `#` se približno, kot zgoraj, primerja z imenom in logičnim imenom vsake tabele, ne glede na trenutni prikaz, zato `#accounts` navede `users` tudi v prikazu `Physical Names`. Tabele, katerih ime ali logično ime vsebuje besedilo, so na začetku. Imen skupin tabel in imen indeksov ne preiskuje nobena predpona; [iskanje in zamenjava](./find-and-replace.md#what-it-searches) preiskuje oboje.

Predpona `@` navede stolpce, vsakega s podatkom o tem, kje je, na primer `users.email · Column`. Besedilo za `@` se mora pojaviti v imenu ali logičnem imenu stolpca, ne glede na velikost črk in ne glede na to, kaj prikazuje prikaz imen; to ujemanje ni približno. Vsako ime, ki ga vsebuje, je svoja vrstica: zadetek v logičnem imenu prikaže logično ime z `users.email · Logical name` ob njem, zato je stolpec, katerega ime in logično ime vsebujeta besedilo, naveden dvakrat. Besedilo pred prvo piko `.` zoži iskanje na tabele, katerih ime ali logično ime ga vsebuje: `@users.em` navede stolpce, ki vsebujejo `em`, v tabelah, katerih ime ali logično ime vsebuje `users`, `@users.` navede stolpce teh tabel, `@.em` pa preišče vse tabele. Lastno logično ime tabele pri `@` ne ustvari vrstice; najde ga `#`. Če za `@` ni ničesar, je vsak stolpec naveden enkrat, s svojim imenom.

Predpona `:` navede komentarje tabel, komentarje stolpcev in beležke, imen in logičnih imen pa nikoli. Vsaka vrstica prikazuje izsek besedila okoli zadetka, ob njem pa `users · Table comment`, `users.email · Column comment` ali `Memo`. Besedilo za `:` se mora pojaviti v komentarju ali beležki, ne glede na velikost črk, tako kot pri `@`. Če za `:` ni ničesar, so navedeni komentarji in beležke, ki niso prazni. Dokler View Option → `Memos` skriva beležke, predpona `:` ne navede nobene beležke.

Predponi `@` in `:` navajata svoje vrstice v vrstnem redu, v katerem jih hrani dokument: tabelo za tabelo, komentar vsake tabele pred njenimi stolpci v vrstnem redu stolpcev, beležke pa na koncu. Pri `@` je vrstica logičnega imena stolpca pred vrstico njegovega imena.  
Navedba mesta ob vrstici `@` ali `:` v vsakem prikazu vsebuje ime tabele in stolpca, nikoli logičnih imen.

Predpona `?` navede `Tables`, `Columns` in `Comments & memos`, besedilo za `?` pa jih filtrira. Izbira ene od teh postavk nadomesti vsebino vnosnega polja z njeno predpono in pusti paleto odprto.

Seznam s predpono vsebuje vse zadetke, ne glede na to, koliko jih je. Predpona, katere iskanje ne najde ničesar, pusti seznam prazen, brez sporočila.

Izbira tabele, stolpca, komentarja ali beležke zapre paleto in preklopi na zavihek ERD, če ste na drugem zavihku.  
Platno se pomakne do cilja, razen če je ta že dobro viden – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands). Tabela se nato izbere kot edina in postavi v ospredje. Razen če je bil fokus že v tej tabeli, dobi fokus prva celica njene glave: njeno ime ali v prikazih `Logical Names` in `Both Names` njeno logično ime.  
Beležka se izbere kot edina in postavi v ospredje. Pri stolpcu ali komentarju se njegova tabela izbere kot edina in postavi v ospredje, fokus pa dobi celica, ki vsebuje besedilo. Kjer prikaz te celice ne izriše, fokus preide na celico, izrisano na njenem mestu: logično ime, najdeno v prikazu `Physical Names`, pristane na imenu, ime, najdeno v prikazu `Logical Names`, pa na logičnem imenu. Komentar, ki ga skriva [možnost pogleda tabel](./table-related-functions.md#table-view-options), pristane na imenu ob njem ali v prikazu `Logical Names` na logičnem imenu.  
Noben skok ne začne risanja relacije niti ga ne dokonča.

Za možnosti `Match Case`, `Match Whole Word` ali `Use Regular Expression` ali za zamenjavo besedila uporabite [iskanje in zamenjavo](./find-and-replace.md) na vrhu raziskovalca.

## Ko se ne ujema noben ukaz {#when-no-command-matches}

Če na najvišji ravni brez predpone noben navedeni ukaz ne vsebuje vnesenega besedila, ne glede na velikost črk, ukazom sledijo tri vrstice: `Search tables for "…"`, `Search columns for "…"` in `Search comments & memos for "…"`, vsaka s svojo predpono kot ikono. Izbira ene od njih vnese to predpono pred vaše besedilo, tako da `users` postane `#users`, paleta pa ostane odprta s temi rezultati.  
Če iskanje ne najde nobenega ukaza, se nad seznamom prikaže sporočilo `No commands match`, seznam pa nato vsebuje samo tri vrstice. Če najde samo ukaze, ki besedila ne vsebujejo, so ti na začetku: na zavihku ERD brez izbrane tabele vnos `tables` pred tremi vrsticami navede `New Table`, `Database` in, kadar je na voljo, `New Table Group`. Ko je izbrana tabela, postavka `Group Selected Tables`, kadar je na voljo, vsebuje `tables`, zato se tri vrstice ne prikažejo.  
V podmeniju iskanje, ki ne najde ničesar, pusti seznam prazen, brez sporočila.

## Iskanje v korejščini {#searching-in-korean}

Iskanje, ki vsebuje znake hangul, se ujema tudi po posameznih črkah, in sicer v ukazih, v podmenijih in pri vsaki predponi.  
Vsak korak, skozi katerega gre korejska vnosna metoda, še naprej najde vrstico, katere besedilo vnašate, zato `ㅅ`, `사`, `상`, `사요` in `사용` vsi najdejo `사용자`. Iskanje, sestavljeno samo iz začetnih soglasnikov, se ujema z začetnimi soglasniki zlogov, pri čemer se presledki preskočijo: `ㅅㅇㅈ` najde `사용자`, `ㅈㅁ` pa `주문 내역`. Soglasniški sklop, ki ga vnosna metoda v sistemu Windows sestavi iz dveh zaporedno vnesenih začetnih soglasnikov, kot je `ㅄ`, šteje kot dva soglasnika (`ㅂㅅ`), podvojeni soglasnik, kot je `ㄲ`, pa ostane ena črka. Besedilo, shranjeno v razstavljeni obliki, kot so shranjena imena datotek v sistemu macOS, se ujema, kot da bi bilo sestavljeno.  
Najprej so navedene vrstice, katerih celotno besedilo se po črkah ali po začetnih soglasnikih ujema z iskalnim nizom, nato vrstice, ki se z njim začnejo, in nato vrstice, ki ga vsebujejo. Pri predponah `@` in `:` so pred vsemi temi vrstice, ki vsebujejo iskalni niz tako, kot je vnesen, v vrstnem redu dokumenta. Poudarek zajema cele zloge, zato `상` v `사용자` osvetli `사용`.
