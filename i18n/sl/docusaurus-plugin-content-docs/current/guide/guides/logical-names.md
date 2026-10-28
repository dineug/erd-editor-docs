---
sidebar_position: 4
description: Dodeljevanje logičnih imen tabelam in stolpcem, prikaz fizičnih imen, logičnih imen ali obeh s prikazom imen, samodokončanje imen izrazov med tipkanjem, povezovanje stolpcev z domenami in pregled, kje drugje imena sledijo prikazu.
---

# Logična imena

Tabela in vsak njen stolpec imajo lahko poleg imena tudi logično ime. Logično ime je tisto, ki ga berejo ljudje, na primer `Customer Name` za `CUST_NM`. Samo ime je fizično ime, tisto, ki ga zapišeta [Shema SQL](./schema-sql.md) in [generator kode](./code-generator.md).  
Prikaz imen določa, katero od obeh imen izriše platno ERD: imena, logična imena ali oboje – glejte razdelek [Prikaz imen](#name-view).  
Logično ime lahko svoji tabeli ali stolpcu da tudi fizično ime, izpeljano iz besed in izrazov na zavihku [Slovar](./dictionary.md) – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names).  
Stolpec lahko povežete z domeno, to je s podatkovnim tipom z imenom, kot je `Name` za `VARCHAR(100)`, ki je shranjen na listu `Domains` na zavihku Slovar, in stolpec ima nato podatkovni tip domene – glejte razdelek [Celica domene](#the-domain-cell).  
Shema SQL lahko vsako logično ime zapiše v prazen komentar – glejte razdelek [Logična imena kot komentarji](./schema-sql.md#logical-names-as-comments).

## Prikaz imen {#name-view}

Na voljo so trije prikazi in vsak na svoj način izriše glavo in vrstice tabele:

- Prikaz `Physical Names`, ki ga ima nov diagram, ne izriše nobenega logičnega imena. Glava prikazuje ime tabele in, medtem ko je vklopljena možnost View Option → `Table Comment`, njen komentar, vsaka vrstica pa prikazuje svoje celice v [vrstnem redu stolpcev](./settings.md#adjusting-column-order).
- Prikaz `Logical Names` izriše logično ime namesto vsakega imena: v glavi in v vsaki vrstici na mestu, kjer je v vrstnem redu stolpcev `Name`. Celica tipa v vrstici lahko predstavlja domeno stolpca, kot je opisano spodaj.
- Prikaz `Both Names` izriše logično ime poleg imena. Glava prikazuje logično ime, nato ime in nato komentar, vsaka vrstica pa dobi celico `Logical Name`, ki jo vrstni red stolpcev privzeto postavi tik pred `Name`.

Namesto praznega logičnega imena, tudi takega iz samih presledkov, se prikaže zatemnjen nadomestek. V prikazu `Logical Names` je to ime, izrisano na njegovem mestu, ali nadomestno besedilo `table` ali `column`, kadar je prazno tudi ime. V prikazu `Both Names` je to nadomestno besedilo `logical`.

V prikazu `Logical Names` stolpec, povezan z domeno z imenom na listu `Domains` na zavihku Slovar, v celici tipa namesto podatkovnega tipa prikazuje ime te domene. Vsak drug stolpec tam prikazuje svoj podatkovni tip.  
Medtem ko je vklopljena možnost View Option → `Domain`, ima domena svojo celico, celica tipa pa ohrani podatkovni tip, zato nobena vrstica ne prikaže domene dvakrat – glejte razdelek [Celica domene](#the-domain-cell).

Vsaka tabela je tako široka kot celice, ki jih izriše v prikazu, zato preklop spremeni velikost tabel in znova razporedi njihove povezovalne črte. Nobena tabela se ne premakne.  
Pri `70%` in manj se tabela strne na ime – glejte razdelek [Povečava/pomanjšava](./table-related-functions.md#zoom-inout). V prikazu `Logical Names` prikaže logično ime ali, dokler tega ni, zatemnjeno ime. V prikazu `Both Names` prikaže logično ime z imenom v vrstici pod njim ali, dokler logičnega imena ni, samo ime.

Preverjanja zavihka Slovar lahko logično ime ali ime, ki ga označijo, izrišejo v rdeči ali jantarni barvi – glejte razdelek [Oznake na platnu](./dictionary.md#marks-on-the-canvas).

## Preklapljanje prikaza {#switching-the-view}

Prikaz preklopite na štirih mestih, vsako pa navaja `Physical Names`, `Logical Names` in `Both Names` s kljukico ob trenutnem prikazu:

- Gumb `Name View` v [orodni vrstici platna](./table-related-functions.md#canvas-toolbar), med štirimi notacijami relacij in načinom zen. Na njem je napisan trenutni prikaz s puščico navzdol, njegov opis orodja pa je `Name View`. Klik odpre seznam nad orodno vrstico, izbira pa ga zapre.
- Postavka `Name View` v priročnem meniju platna, takoj za `View Option`: podmeni s tremi prikazi. Meni po izbiri ostane odprt.
- Isti seznam v orodni vrstici zavihka Vizualizacija v načinu `Flow`, za menijem prikaza vrstic – glejte razdelek [Orodna vrstica](./visualization.md#toolbar).
- Postavka `Name View` v [hitrem iskanju](./quick-search.md#what-the-palette-lists), takoj za postavko `Tab`, navedena samo na zavihku ERD. Njen podmeni se odpre s poudarkom na trenutnem prikazu.

![Preklapljanje prikaza imen na Logical Names v orodni vrstici platna, na Both Names v meniju platna in nazaj na Physical Names, pri čemer je ordered_at, ki nima logičnega imena, najprej zatemnjen in nato prikazan kot nadomestno besedilo logical](/img/demo-name-view.webp)

Vsa štiri mesta nastavijo isti prikaz. Zgornja orodna vrstica zanj nima gumba.

Preklop ohrani izbor in se ne zabeleži v [zgodovino razveljavitev](./undo-redo.md#what-the-history-records).  
Če novi prikaz celice s fokusom ne izriše, se fokus premakne na celico, izrisano na njenem mestu: ime in logično ime se nadomeščata, prav tako tip in domena. Urejanje, odprto na tej celici, se zapre. Vklop ali izklop možnosti View Option → `Domain` premakne fokus na enak način.  
Ko je zaklep `Name View` vklopljen, kot je v novem diagramu, preklop spremeni samo vaš zaslon, datoteka pa ohrani prikaz, pri katerem je bil zaklenjen. Ko je zaklep izklopljen, datoteka shrani prikaz, na katerega preklopite – glejte razdelek [Zaklepanje](./settings.md#lock).

## Vnos logičnega imena {#writing-a-logical-name}

Prikaz `Physical Names` ne izriše nobenega logičnega imena, zato za vnos logičnega imena na platnu preklopite na prikaz `Logical Names` ali `Both Names`:

- V prikazu `Logical Names` celice imena v glavi in vrsticah vsebujejo logična imena, zato fizičnega imena v tem prikazu na platnu ni mogoče urejati.
- V prikazu `Both Names` celice logičnega imena vsebujejo logična imena, celice imena pa fizična imena.

Celico logičnega imena urejate kot vsako drugo celico: začnite s tipko `Enter` ali z dvoklikom – glejte stran [Urejanje tabel](./table-editing.md). Ko urejanje odprete na praznem logičnem imenu, vnosno polje kot nadomestno besedilo prikaže, kar je izrisala celica: ime v prikazu `Logical Names`, `logical` v prikazu `Both Names`.  
Tipkanje vnese samo logično ime. Ko se urejanje spremenjenega logičnega imena zapre (`Enter`, `Tab`, `Escape` ali klik drugam), se iz njega izpelje fizično ime, in sicer kot samostojen korak razveljavitve za vašim tipkanjem. Fizično ime, ki ste ga vnesli sami, ostane nespremenjeno – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names).

`Tab` in `Shift + Tab` se po vrsti premikata po celicah, ki jih izriše prikaz – glejte razdelek [Tipka Tab](./table-editing.md#tab-key):

- V prikazu `Logical Names`: logično ime v glavi, nato komentar, nato celice vsake vrstice v vrstnem redu stolpcev, z logičnim imenom na mestu imena.
- V prikazu `Both Names`: logično ime, ime in komentar v glavi, nato celice vsake vrstice v vrstnem redu stolpcev, privzeto najprej celica `Logical Name`.

`Alt + Enter` (Windows/Linux) ali `⌥ + Enter` (Mac) doda stolpec in postavi fokus na prvo celico, ki jo njegova vrstica nariše. Pri privzetem vrstnem redu stolpcev je to njegova celica imena, ki je v prikazu `Logical Names` njegovo logično ime, v prikazu `Both Names` pa njegova celica `Logical Name`, tako da lahko začnete z logičnim imenom – glejte razdelek [Dodajanje stolpcev](./table-editing.md#adding-columns).

Stolpec tujega ključa, ki ga doda relacija, skupaj s tipom kopira tudi logično ime in domeno svojega ključa – glejte razdelek [Identifikacijske relacije](./relationship-editing.md#identifying-relationships).  
Kopiranje stolpcev v preglednico in lepljenje stolpcev iz nje uporabljata celice, ki jih izriše prikaz, vključno s celicami logičnega imena in celicami domene – glejte razdelek [Kopiranje/lepljenje stolpcev](./table-editing.md#copyingpasting-columns).

## Samodokončanje imen izrazov {#completing-term-names}

Med tipkanjem v celico logičnega imena, v glavi ali v vrstici, seznam pod celico ponudi izraze, katerih imena se začnejo z vnesenim besedilom, ne glede na velikost črk in morebitne presledke pred njim. Izraz je celotno logično ime, shranjeno na listu `Terms` na zavihku Slovar, skupaj s fizičnim imenom in domeno, ki ju da. Seznam prikaže največ osem izrazov, razvrščenih po imenu, s poudarjenim vnesenim besedilom. Dokler se noben izraz ne začne tako, seznama ni.

![Dodajanje stolpca z ⌥ + Enter v prikazu Both Names, izbira izraza Order Amount s seznama izrazov pod njegovim logičnim imenom, ki izpolni ORD_AMT, DECIMAL(10,2) in domeno Amount, nato vnos Order Date, katerega ime ORD_DT dajo besede, ko Enter zapre urejanje](/img/demo-logical-names.webp)

- Sprva ni poudarjeno nič. `↑` in `↓` premikata poudarek, ki se na obeh koncih nadaljuje na nasprotnem koncu, poudarjeni izraz pa prikazuje tipko `Enter`.
- `Enter` na poudarjenem izrazu vnese njegovo ime kot logično ime in konča urejanje. Razen če je fizično ime tisto, ki ste ga vnesli sami, isti korak razveljavitve takoj izpelje fizično ime iz izraza, stolpcu pa da tudi domeno izraza. `Enter`, ko ni poudarjeno nič, konča urejanje in ohrani, kar ste vnesli.
- Klik na izraz ga vnese na enak način in pusti urejanje odprto.
- `Escape`, medtem ko je seznam prikazan, zapre samo seznam, naslednji `Escape` pa konča urejanje.
- `Tab` nadaljuje z besedilom, kot ste ga vnesli, iz njega pa se ob zaprtju urejanja izpelje fizično ime.
- Medtem ko vnosna metoda sestavlja besedilo, puščice in `Enter` pripadajo sestavljanju.

Kaj izraz da tabeli ali stolpcu, je opisano v razdelku [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names).

## Celica domene {#the-domain-cell}

Možnost View Option → `Domain`, ki je privzeto izklopljena, vsaki vrstici v vsakem prikazu doda celico domene na mestu, kjer je v vrstnem redu stolpcev `Domain`, privzeto takoj za `DataType` – glejte razdelek [Možnosti pogleda tabel](./table-related-functions.md#table-view-options).  
Celica prikazuje ime domene, s katero je stolpec povezan, ali pa zatemnjeno nadomestno besedilo `domain` za stolpec, ki ni povezan z nobeno domeno, ki jo navaja list `Domains`.

![Vklop View Option → Domain, izbira domene Amount v celici domene stolpca PAY_AMT po zožitvi seznama z amo, sprememba vrednosti Data Type domene Amount v DECIMAL(12,2) na zavihku Slovar, pri čemer se z njo spremeni tudi stolpec, nato vnos NUMERIC(12,2) v stolpec, kar prekine njegovo povezavo z domeno](/img/demo-domains.webp)

`Enter` ali dvoklik odpre nad celico izbirnik domene: prazno polje z besedilom celice kot nadomestnim besedilom, pod njim pa `None` in nato vse domene z imenom z lista `Domains` v vrstnem redu na listu. Poudarek je sprva na povezani domeni ali na `None`.

- Tipkanje navede samo domene, katerih imena vsebujejo vneseno besedilo, ne glede na velikost črk, izpusti `None` in poudari prvo. `↑` in `↓` premikata poudarek.
- `Enter` poveže stolpec s poudarjeno domeno, klik pa s kliknjeno. Oboje da stolpcu podatkovni tip domene kot en korak razveljavitve in konča urejanje. `None` prekine povezavo stolpca z domeno in ohrani njegov podatkovni tip.
- Kar vnesete, se nikoli ne zapiše v stolpec. Dokler list `Domains` nima nobene domene z imenom, seznama ni, `Enter` pa konča urejanje, ne da bi kar koli zapisal.

V prikazu `Logical Names`, ko je možnost View Option → `Domain` izklopljena, celica tipa, ki prikazuje ime domene, odpre ta izbirnik, celica, ki prikazuje podatkovni tip, pa odpre urejanje podatkovnega tipa – glejte razdelek [Samodokončanje podatkovnega tipa](./table-editing.md#datatype-autocomplete). Če želite stolpec brez domene povezati z domeno, vklopite celico domene.  
Povezan stolpec ima podatkovni tip svoje domene in mu sledi, ko se tip domene spremeni, vnos drugega tipa v njegovo celico DataType pa prekine njegovo povezavo z domeno – glejte razdelek [Domene in podatkovni tipi](./dictionary.md#domains-and-data-types).

## Zunaj platna {#beyond-the-canvas}

Večina drugih mest, ki navajajo ime tabele ali stolpca, prav tako sledi prikazu imen:

- Prikaz `Physical Names` prikaže ime.
- Prikaz `Logical Names` prikaže logično ime ali, dokler je logično ime prazno, ime, zatemnjeno tam, kjer ga mesto lahko zatemni.
- Prikaz `Both Names` prikaže logično ime, za njim pa ime: bledo v vrstici besedila, v drugi vrstici oznake v načinu Graf in v oklepaju tam, kjer mora eno besedilo vsebovati oboje, na primer `Member (member)`. Tabela ali stolpec brez logičnega imena prikaže samo svoje ime.

Seznam, razvrščen po imenu, kot so tabele v raziskovalcu ali vrstice `#` v hitrem iskanju, ostane v vsakem prikazu razvrščen po imenu, nikoli po logičnem imenu.

Mesta, ki sledijo prikazu:

- Na zavihku Vizualizacija kartice načina Tok – glejte razdelek [Imena na karticah](./visualization.md#names-on-the-cards) – ter oznake in predogled ob lebdenju v načinu Graf – glejte razdelka [Branje grafa](./visualization.md#reading-the-graph) in [Predogled ob lebdenju](./visualization.md#hover-preview).
- Okno [Lastnosti tabele](./table-related-functions.md#table-properties): njegove ploščice, na zavihku `Indexes` pa vrstice `Columns` in seznam `Index order` – glejte razdelek [Indeksi](./table-related-functions.md#indexes).
- Vrstice tabel in stolpcev v [raziskovalcu](./explorer.md#the-tree) ter tabele, navedene pod vsako skupino tabel.
- Vrstice `#` v hitrem iskanju – glejte razdelek [Iskanje po diagramu](./quick-search.md#searching-the-diagram).
- Drevo sprememb in obe strani [pregledovalnika razlik](./table-related-functions.md#diff-viewer).
- Okno [Preslikaj stolpce](./relationship-editing.md#map-columns) in opis orodja `<parent> has no primary key to copy`, ki ga lahko med risanjem relacije prikaže `Create new columns` – glejte razdelek [Ustvarjanje relacije](./editing-start.md#relationship-creation).
- Kopija vrstic, ki jo vlečenje stolpca nosi nad praznim platnom in ki prikazuje celici imena in tipa vsake vrstice tako, kot ju izriše vrstica – glejte razdelek [Prerazporejanje in premikanje stolpcev](./table-editing.md#rearranging-and-moving-columns).
- Stolpec `Target` na listu `Checks` na zavihku Slovar – glejte razdelek [List Preverjanja](./dictionary.md#the-checks-sheet).
- [Izvožena slika](./file-import-export.md#image).

Nekaj mest ohrani imena ne glede na prikaz: vrstice indeksov in tujih ključev v raziskovalcu, `Keys` na zavihku `Indexes` v oknu Lastnosti tabele, `New column: <name>` v oknu Preslikaj stolpce in navedba mesta ob vrstici `@` ali `:` v hitrem iskanju.

Pregledovalnik razlik, [potovanje skozi čas](./undo-redo.md#time-travel), predogled `Force` [samodejne postavitve](./table-related-functions.md#auto-layout) in okno `Export image` se odprejo v prikazu imen, ki ga gledate, ne glede na to, kateri prikaz hrani datoteka. Vsak od njih ohrani ta prikaz, dokler je odprt.  
Vsaka samodejna postavitev in vsak uvoz Sheme SQL, GraphQL, DBML ali AML z ukazom `Import` ali `Import and Add` razporedi tabele s širinami, ki jih imajo v vašem prikazu.

## Iskanje po logičnem imenu {#finding-by-logical-name}

Logična imena se najdejo v vsakem prikazu imen, tudi v prikazu `Physical Names`, v katerem jih platno ne izriše:

- [Iskanje in zamenjava](./find-and-replace.md#what-it-searches) jih preiskuje kot eno vrsto besedila, `Logical names`, za tabele in stolpce enako, ta vrsta pa je vklopljena, ko se iskanje prvič odpre. Zamenjava logičnega imena iz njega izpelje fizično ime, tako kot vnos logičnega imena.
- V [hitrem iskanju](./quick-search.md#searching-the-diagram) `#` najde tabelo po imenu ali logičnem imenu, `@` pa stolpec po enem ali drugem, pri čemer je ob zadetku v logičnem imenu prikazano `Logical name`. Del `@` za tabelo, pred `.`, se prav tako ujema z imenom ali logičnim imenom tabele.

Preklop prikaza imen spremeni, kako so rezultati poimenovani, nikoli pa tega, kaj se najde.

## Sodelavci {#collaborators}

V [sodelovalni seji](../../api/advanced/collaborative-editing.md) logična imena in povezave z domenami dosežejo vsak urejevalnik kot vsaka druga sprememba.  
Ko je zaklep `Name View` vklopljen, ima vsak urejevalnik svoj prikaz, preklop pa se pokaže samo v urejevalniku, v katerem je bil narejen. Ko je izklopljen, preklop v katerem koli urejevalniku, ki ni samo za branje, preklopi vse urejevalnike – glejte razdelek [Zaklepanje](./settings.md#lock), ki opisuje tudi, kaj vklop ali izklop zaklepa naredi s prikazom posameznega urejevalnika.  
Kadar je celica s fokusom udeleženca taka, ki je vaš prikaz ne izriše, se njegova barva pokaže na celici, ki jo vaš prikaz izriše na njenem mestu: celica imena v prikazu `Physical Names` se pokaže na vaši celici logičnega imena v prikazu `Logical Names` in obratno, celica tipa in domena, ki stoji na njenem mestu, pa se ujemata na enak način.

Agent za kodiranje, ki deluje prek strežnika MCP, nastavlja logična imena in povezuje stolpce z domenami ne glede na prikaz, ki ga gledate, in nima orodja, ki bi preklopilo prikaz imen – glejte razdelka [Slovarji](../../mcp/tools.md#dictionaries) in [Nastavitve](../../mcp/tools.md#settings).

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo [`readonly`](../../api/erd-editor-element.md#readonly) deluje vsak izbirnik prikaza imen: gumb `Name View` v orodni vrstici platna, `Name View` v priročnem meniju platna in v hitrem iskanju ter seznam v orodni vrstici načina Tok.  
Preklop tam ne glede na zaklep spremeni samo ta zaslon: datoteka, sodelavci in zgodovina razveljavitev ohranijo prikaz, kakršen je bil. Ko je urejevalnik spet mogoče urejati, izbrani prikaz ostane na tistem zaslonu do naslednjega preklopa tam ali, dokler je zaklep izklopljen, dokler ga sodelavec ne preklopi ali dokumenta ne naložite znova.  
Logičnih imen in domen tam ni mogoče urejati, zato se ne odpre noben urejevalnik celice, seznam izrazov ali izbirnik domene, nobena od postavk `Derive Physical Name Again` in `Derive Physical Names Again` pa ni na voljo.  
View Option → `Domain` tam prikaže ali skrije celico Domain samo na tistem zaslonu, kot to tam velja za vsako [možnost pogleda](./table-related-functions.md#table-view-options), ko pa je urejevalnik spet mogoče urejati, se vrnejo možnosti pogleda, ki jih vsebuje dokument.
