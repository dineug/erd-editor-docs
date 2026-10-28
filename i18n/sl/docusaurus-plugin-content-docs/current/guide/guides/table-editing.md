---
sidebar_position: 3
description: Dodajanje, izbiranje, prerazporejanje in brisanje stolpcev, preklapljanje možnosti stolpcev ter kopiranje in lepljenje stolpcev.
---

# Urejanje tabel

Urejanje tabel v osnovi ponuja izkušnjo urejanja, podobno kot v programu Excel.  
[Prikaz imen](./logical-names.md#name-view) določa, ali tabela v glavi in vrsticah izriše imena, logična imena ali oboje.  
Način urejanja se začne s tipko `Enter` ali z dvoklikom na celico.  
Tipka `Enter` ali `Escape` ga konča. Kar vnesete, se uporabi že med tipkanjem, zato tipka `Escape` besedilo ohrani in ga ne povrne v prejšnje stanje. Izjema je [celica domene](./logical-names.md#the-domain-cell): samo izbira s svojega seznama in nikoli ne ohrani, kar vnesete. Zaprtje [celice logičnega imena](./logical-names.md#writing-a-logical-name) s spremenjenim logičnim imenom lahko izpolni tudi fizično ime.  
Tipka `Escape` pusti fokus na celici in tabelo izbrano, drugi pritisk tipke `Escape` pa počisti oboje. Medtem ko celica logičnega imena prikazuje svoj [seznam izrazov](./logical-names.md#completing-term-names), prvi pritisk tipke `Escape` zapre samo seznam.  
Medtem ko vnosna metoda še sestavlja besedilo, tipka `Escape` pusti način urejanja odprt.

![Dodajanje tabele z Alt + N in izpolnjevanje dveh stolpcev](/img/demo-table-edit.webp)

## Dodajanje stolpcev {#adding-columns}

Stolpec ustvarite z bližnjico `Alt + Enter` (Windows/Linux) ali `⌥ + Enter` (Mac), ki doda stolpec vsaki izbrani tabeli, ali z gumbom `+` v glavi tabele, ki ga doda tej tabeli.  
Prva celica novega stolpca prevzame fokus, in sicer prva, ki jo njegova vrstica nariše v [vrstnem redu stolpcev](./settings.md#adjusting-column-order). Pri privzetem vrstnem redu je to njegovo ime, ki je v prikazu `Logical Names` njegovo logično ime, v prikazu `Both Names` pa njegova celica `Logical Name` – glejte razdelek [Prikaz imen](./logical-names.md#name-view).  
Stolpec, dodan s tipko `Tab` iz zadnje celice, in primarni ključ, ki ga risanje relacije doda nadrejeni tabeli brez njega, se začneta na tej celici prav tako.

## Tipka Tab {#tab-key}

Pritisnite `Tab`, da preidete neposredno v način urejanja naslednje celice.  
Pritisk tipke `Tab` v zadnji celici ustvari nov stolpec in odpre njegovo prvo celico za urejanje – glejte razdelek [Dodajanje stolpcev](#adding-columns).  
Z bližnjico `Shift + Tab` se pomaknete v način urejanja prejšnje celice.  
`Tab` in `Shift + Tab` se po vrsti premikata po celicah, ki jih izriše tabela, zato prikaz imen in možnost View Option → `Domain` določata, ali so med njimi celice logičnega imena in celice domene – glejte razdelek [Vnos logičnega imena](./logical-names.md#writing-a-logical-name).  
Oznake [alternativnih ključev](./table-related-functions.md#alternate-keys), ki so narisane za zadnjo celico vrstice, niso celice, zato jih fokus tipkovnice preskoči in se nikoli ne odprejo za urejanje.

![Premikanje po celicah vrstice s tipko Tab, dodajanje stolpca iz zadnje celice in vračanje nazaj s Shift + Tab](/img/demo-table-tab.webp)

## Samodokončanje podatkovnega tipa {#datatype-autocomplete}

Začnite urejati celico `DataType` in tipkajte. Urejevalnik predlaga ujemajoče se tipe iz izbrane zbirke podatkov in v predlogu poudari del, ki dobesedno vsebuje to, kar ste vnesli.  
Samo ujemanje je približno, zato niz `vch` najde tudi `VARCHAR`.

- `Arrow Up` ali `Arrow Down`: premikanje po predlogih
- `Arrow Right`, `Tab` ali `Enter`: sprejem poudarjenega predloga
- `Arrow Left`: vrnitev k besedilu, ki ste ga vnesli

Predlog lahko tudi kliknete.  
Seznam naenkrat prikaže največ deset predlogov, preostali pa so dosegljivi s pomikanjem.  
Nič ni vsiljeno, zato lahko tip, ki ga ni na seznamu, prosto vnesete, vključno z argumenti, kot je `VARCHAR(255)`. Seznam se zapre, ko vneseno besedilo preseže celotno ime tipa, kot se zgodi pri `VARCHAR(255)` ali `BIGINT UNSIGNED`.  
Predlogi sledijo izbrani zbirki podatkov. Sprememba zbirke podatkov spremeni ponujene predloge, obstoječe stolpce pa pusti takšne, kot so.

Tipkanje v celico `DataType` stolpca, povezanega z domeno, ali sprejem predloga v njej prekine povezavo stolpca z domeno, takoj ko se njegov tip razlikuje od tipa domene – glejte razdelek [Domene in podatkovni tipi](./dictionary.md#domains-and-data-types).  
V prikazu `Logical Names`, medtem ko je možnost View Option → `Domain` izklopljena, celica tipa stolpca, povezanega z domeno z imenom, prikazuje ime domene, njeno urejanje pa namesto teh predlogov odpre [izbirnik domene](./logical-names.md#the-domain-cell). Celica tipa, ki prikazuje podatkovni tip, ga ureja, kot je opisano zgoraj.

![Izpolnjevanje celic DataType iz približnih predlogov s puščičnimi tipkami, Tab in Enter](/img/demo-data-type-autocomplete.webp)

## Ni NULL, Enolično, Samodejno povečevanje {#not-null-unique-auto-increment}

Te tri celice so stikala in ne besedilo.  
Celico preklopite z dvoklikom ali s pritiskom tipke `Enter`, ko ima fokus.

Celica Ni NULL prikazuje `N-N`, ko je nastavljena, in `NULL`, ko ni.  
Oznaki `UQ` in `AI` sta zatemnjeni, ko sta izklopljeni, in poudarjeni, ko sta vklopljeni.

![Preklop zastavice Ni NULL z dvoklikom ter zastavic Enolično in Samodejno povečevanje s tipko Enter](/img/demo-column-options.webp)

Celic, ki jih skrivajo [možnosti pogleda tabel](./table-related-functions.md), ni mogoče preklopiti.

## Izbiranje več stolpcev {#selecting-multiple-columns}

Podprtih je pet načinov:

- `Shift + Arrow Up/Down`: razširitev izbora za eno vrstico naenkrat
- `Ctrl + click` (Windows/Linux) ali `⌘ + click` (Mac): dodajanje posameznega stolpca
- `Shift + click`: izbor obsega od stolpca, ki je nazadnje imel fokus
- `Ctrl + Shift + click` (Windows/Linux) ali `⌘ + Shift + click` (Mac): dodajanje tega obsega v izbor
- `Alt + A` (Windows/Linux) ali `⌥ + A` (Mac): izbor vseh stolpcev

![Izbiranje stolpcev s Shift + Arrow Down, Ctrl/⌘ + click, Shift + click in Alt + A](/img/demo-column-select.webp)

Če želite izbrane stolpce premakniti skupaj, povlecite ročico ob stolpcu s fokusom – glejte razdelek [Prerazporejanje in premikanje stolpcev](#rearranging-and-moving-columns).

Klik z desno tipko miške na vrstico stolpca določi, na katere stolpce deluje priročni meni tabele, ne glede na to, katero modifikatorsko tipko držite.  
Na vrstici, ki je že izbrana, izbor ostane, fokus pa se premakne na to vrstico. Na kateri koli drugi vrstici se izbere samo ta vrstica. To velja kjer koli na vrstici, vključno z ikono ključa in oznako [alternativnega ključa](./table-related-functions.md#alternate-keys).  
Če želite torej prek menija delovati na več stolpcev, kot v razdelku [Primarni ključ stolpca](#column-primary-key) ali [Brisanje stolpcev](#column-deletion), kliknite z desno tipko miške na eno od izbranih vrstic.  
Na računalniku Mac meni odpre tudi `Ctrl + click`, vendar šteje kot navaden klik, zato na celici pred odprtjem menija izbere samo to vrstico.

## Prerazporejanje in premikanje stolpcev {#rearranging-and-moving-columns}

Stolpec premaknete z ročico za vlečenje, majhnim gumbom z oznako za oprijem, ki stoji tik zunaj levega roba tabele ob vrstici s fokusom.  
Postavite fokus na katero koli celico stolpca, s klikom nanjo ali s puščičnimi tipkami ali tipko `Tab`, in ročica se prikaže ob njegovi vrstici. Medtem ko je fokus na glavi tabele, je nima nobena vrstica.  
Ročica je izrisana bledo, dokler kazalec ni nad njo, kazalec pa se nato spremeni v roko. Sam pritisk ne naredi ničesar: vlečenje se začne, ko se kazalec premakne, in lahko stolpec prenese na drugo mesto v njegovi tabeli ali v drugo tabelo.  
Nad vrsticami tabele se povlečene vrstice premaknejo na mesto, vrstice okoli mesta spusta pa se umaknejo vstran in naredijo prostor. Nad praznim platnom ali nad glavo tabele, ki ima stolpce, kazalcu sledi prosojna kopija vrstic, ki prikazuje celici imena in tipa vsake vrstice tako, kot ju vrstica izriše v trenutnem [prikazu imen](./logical-names.md#name-view).  
Stolpec spustite tik pod zadnjo vrstico tabele, da ga premaknete na konec te tabele. Tabela brez stolpcev sprejme spust kjer koli na njej. Pas tik levo od tabele, kjer stoji ročica, prav tako šteje za vrstice tabele, zato vlečenje naravnost navzdol ob ročici spremeni vrstni red stolpcev, ne da bi kazalec vstopil v tabelo.  
Stolpec, premaknjen v drugo tabelo, ohrani svoje logično ime in domeno.

![Postavitev fokusa na stolpec in vlečenje ročice ob njegovi vrstici na novo mesto, nato vlečenje ročice drugega stolpca v drugo tabelo](/img/demo-column-move.webp)

Če želite premakniti več stolpcev hkrati, jih [izberite](#selecting-multiple-columns) in povlecite ročico ob stolpcu s fokusom. Kadar je stolpec s fokusom eden od dveh ali več izbranih stolpcev svoje tabele, ročica prenese vse, sicer prenese samo svoj stolpec.  
Modifikatorska tipka ni potrebna. Če na ročici držite `Alt` (Windows/Linux) ali `⌥` (Mac), se stolpci premaknejo tako kot pri navadnem vlečenju in nič se ne podvoji.

![Izbiranje treh stolpcev, nato vlečenje ročice ob stolpcu s fokusom v drugo tabelo, pri čemer se z njim premaknejo tudi drugi izbrani stolpci](/img/demo-column-multi-move.webp)

Vlečenje, ki se začne na vrstici stolpca in ne na njegovi ročici, premakne tabelo, tako kot vlečenje njene glave – glejte razdelek [Premikanje več tabel](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) ali `⌥ + drag` (Mac) na vrstici podvoji tabelo – glejte razdelek [Podvajanje tabel in beležk](./table-related-functions.md#duplicating-tables-and-memos).  
Pri povečavi `70%` in manj, kjer tabele prikazujejo le svoja imena, in v urejevalniku samo za branje ročica ni izrisana, zato tam vrstnega reda stolpcev ni mogoče spreminjati.  
Vlečenje stolpca, ki poteka, ko urejevalnik postane samo za branje, se konča takoj: kopija, ki sledi kazalcu, in roka za prijemanje izgineta, spust pa ne premakne nobenega stolpca. Vrstice, ki jih je vlečenje že premaknilo, ostanejo tam, kamor jih je premaknilo.

## Brisanje stolpcev {#column-deletion}

Izbriše izbrane stolpce tabele s fokusom. Klik na celico izbere njen stolpec, zato s klikom na celico in pritiskom tipke `Delete` odstranite samo ta stolpec.  
Bližnjice:

- `Delete` ali `Backspace`. Ti tipki odstranita izbrane stolpce, dokler je njihova tabela edino, kar je izbrano. Kadar ni izbran noben stolpec (fokus je na imenu, [logičnem imenu](./logical-names.md#name-view) ali komentarju tabele), kadar je izbrano še kar koli drugega ali pri povečavi `70%` in manj, kjer tabele prikazujejo le svoja imena, namesto tega odstranita celoten izbor – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ali `Alt + Delete` (Windows/Linux), `⌥ + Backspace` ali `⌥ + Delete` (Mac). Te bližnjice odstranijo izbrane stolpce tabele s fokusom, tudi kadar so hkrati izbrane druge tabele ali beležke. Ničesar ne odstranijo med urejanjem celice ali pri povečavi `70%` in manj.

![Brisanje enega stolpca, nato dveh izbranih stolpcev, z Alt + Backspace](/img/demo-column-remove.webp)

Enako naredi priročni meni tabele. Ko je tabela edino, kar je izbrano, kliknite z desno tipko miške na vrstico stolpca: zadnja postavka menija se glasi `Delete column` ali, kadar ta vrstica pripada enemu od dveh ali več izbranih stolpcev, `Delete columns`.

Med urejanjem celice tipki `Delete` in `Backspace` le brišeta besedilo. Če ju pridržite zunaj urejanja celice, odstranita le enkrat.  
Po odstranitvi se fokus premakne na najbližji preostali stolpec nad stolpcem, ki je imel fokus. Kadar nad njim ne ostane noben, se fokus premakne na ime tabele (v prikazu `Logical Names` na logično ime, izrisano na njegovem mestu), tudi če pod njim ostanejo stolpci, zato naslednji pritisk tipke `Delete` ali `Backspace` odstrani tabelo in ne stolpca.  
Relacije in indeksi, ki uporabljajo odstranjeni stolpec, se odstranijo skupaj z njim. Potrditve ni, celotna odstranitev pa je en korak razveljavitve.

## Kopiranje/lepljenje stolpcev {#copyingpasting-columns}

Deluje kot tabelarično odložišče.  
Bližnjice: `Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ali `⌘ + V` (Mac)

Kopiranje v preglednico, lepljenje iz nje in lepljenje v tabelo, v kateri ima fokus celica stolpca, uporabljajo celice, ki jih tabele prikazujejo, v vrstnem redu, v katerem jih prikazujejo – glejte razdelke [Možnosti pogleda tabel](./table-related-functions.md#table-view-options), [Prilagajanje vrstnega reda stolpcev](./settings.md#adjusting-column-order) in [Prikaz imen](./logical-names.md#name-view). Prikaz imen spremeni, kaj vsebujejo nekatere od teh celic:

- V prikazu `Logical Names` celica imena vsebuje logično ime ali nič, dokler je to prazno. Medtem ko je možnost View Option → `Domain` izklopljena, celica tipa vsebuje ime domene stolpca, kadar jo prikazuje, sicer pa podatkovni tip.
- V prikazu `Both Names` se celica `Logical Name` kopira in prilepi na mestu, kamor jo postavi vrstni red stolpcev.
- Prikazana celica domene vsebuje ime domene ali nič za stolpec, ki ne prikazuje nobene domene.

Stolpci, kopirani v urejevalniku in prilepljeni, ko je izbrana glava tabele, ali v druge izbrane tabele, prenesejo vse celice kopiranih stolpcev, vključno s skritimi, kot sta Enolično in Samodejno povečevanje, in svoja logična imena.  
Povezavo z domeno ohranijo le, če ta diagram navaja prav to domeno, ne le domene z enakim imenom, in ima domena še vedno tip kopiranega stolpca. Sicer pristanejo brez povezave z domeno, s tipom, s katerim so bili kopirani. Njihova imena štejejo za imena, ki ste jih vnesli sami, razen če je prilepljeno ime prazno in ga izpelje logično ime – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names).  
Oznake [alternativnih ključev](./table-related-functions.md#alternate-keys), kot je `AK1.1`, niso celice, zato jih kopiranje in lepljenje izpustita, tudi ko so prikazane.

Iz urejevalnika lahko lepite v program Excel in iz programa Excel nazaj v urejevalnik.  
Vrednosti celic se kopirajo natanko tako, kot so vnesene, zato vrednost, kot je `<label>` ali `a &amp; b`, nespremenjena doseže preglednico ali dokument.  
Stolpci preglednice se vidnim celicam priredijo po položaju, ne po imenu, zato morajo stolpci delovnega lista slediti njihovemu vrstnemu redu.  
Za spodnje stolpce se katera koli od teh vrednosti prebere kot resnična (ne glede na velikost črk):

- Samodejno povečevanje: `TRUE`, `1`, `YES`, `Y`
- Enolično: `TRUE`, `1`, `YES`, `Y`
- Ni NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Pri kopiranju ven urejevalnik v stolpca Samodejno povečevanje in Enolično zapiše `TRUE` ali `FALSE`, v stolpec Ni NULL pa `NOT NULL` ali `NULL`.  
Celici Enolično in Samodejno povečevanje sta privzeto skriti, zato se `TRUE` in `FALSE` zapisujeta in bereta šele, ko sta ti celici prikazani.

![Lepljenje štirih stolpcev v preglednico, pri čemer so zastavice zapisane kot TRUE/FALSE in NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Lepljenje treh vrstic preglednice v tabelo kot stolpcev, pri čemer se YES, 1 in NOT NULL preberejo kot resnične vrednosti](/img/demo-copy-sheet-column.webp)

Kam se vsebina prilepi, je odvisno od fokusa:

- Ko je izbrana glava tabele, se prilepljene vrstice dodajo kot novi stolpci v vsako izbrano tabelo.
- Ko ima fokus celica stolpca, se izbrane vrstice te tabele in nato vrstice pod zadnjo od njih po vrsti prepišejo, in sicer toliko, kolikor jih je bilo prilepljenih. Vrstice med ločenimi izbori se preskočijo. Prepisana vrstica prevzame prilepljene vrednosti v vidnih celicah in ohrani vrednosti skritih celic, preostale vrstice pa se dodajo kot novi stolpci. Vsaki drugi izbrani tabeli se prilepljene vrstice dodajo kot novi stolpci.

![Kopiranje dveh stolpcev in njuno lepljenje v dve izbrani tabeli hkrati](/img/demo-copy-column-multi.webp)

Prilepljena vrstica logična imena in domene zapiše takole:

- Logično ime iz celice `Logical Name` ali iz celice imena v prikazu `Logical Names` šteje, kot da je bilo v celoti vneseno. Dokler je ime stolpca prazno ali še izpeljano, [slovarji](./dictionary.md#deriving-physical-names) iz njega izpeljejo fizično ime in povežejo stolpec z domeno, ki jo da njegov izraz, razen če stolpec z domeno poveže lastna celica domene v vrstici. Ime, ki ga prilepi ista vrstica, se ohrani in šteje za ime, ki ste ga vnesli sami.
- Celica domene ali celica tipa v prikazu `Logical Names`, medtem ko je možnost View Option → `Domain` izklopljena, poveže stolpec z domeno, ki jo imenuje njeno besedilo, če jo diagram navaja. Kakršno koli drugo besedilo ali prazna celica stolpca ne poveže z nobeno domeno in prekine povezavo stolpca z domeno, tudi z domeno prilepljenega tipa. Besedilo v celici tipa, ki ne imenuje nobene domene, se prebere kot podatkovni tip. Vrstice, kopirane v urejevalniku, namesto tega povežejo stolpec z domeno, s katero so bile kopirane, in to le, če jo ta diagram navaja s kopiranim tipom, tako kot novi stolpci.
- Povezana domena da stolpcu svoj podatkovni tip, razen če vrstica prilepi svoj tip. Takrat se domena drugega tipa ne poveže, stolpec pa prevzame prilepljeni tip.
- V vrstici brez celice domene prilepljeni tip prekine povezavo stolpca z domeno drugega tipa, tako kot če ga vnesete.
- Nobeno lepljenje ne prenese tipa naprej s [sinhronizacijo tipa podatkov v relacijah](./settings.md#relationship-datatype-sync).

## Kopiranje/lepljenje tabel in beležk {#copyingpasting-tables-and-memos}

Kadar v tabeli s fokusom ni izbran noben stolpec, iste bližnjice kopirajo same izbrane tabele in beležke – glejte stran [Funkcije za tabele](./table-related-functions.md).

## Primarni ključ stolpca {#column-primary-key}

Preklopi primarni ključ na stolpcu s fokusom, to je na stolpcu, ki mu pripada celica s fokusom.  
Kadar je stolpec s fokusom eden od dveh ali več izbranih stolpcev, preklop velja za vse izbrane stolpce: če kateri od njih ni ključ, postanejo ključi vsi, če pa so ključi že vsi, se ključ odstrani vsem. Stolpci zunaj izbora ostanejo nespremenjeni.  
Uporabite priročni meni tabele ali bližnjico `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac). Kadar preklop zajame dva ali več stolpcev, se postavka menija namesto `Primary Key` glasi `Primary Key on selected columns`.  
Ikona ključa v vrstici je le prikazna, zato klik nanjo ključa ne nastavi.

Če želite iz več stolpcev narediti en sestavljeni ključ, jih [izberite](#selecting-multiple-columns) in nato pritisnite `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac) ali pa kliknite z desno tipko miške na eno od izbranih vrstic in izberite `Primary Key on selected columns`. Vsak preklop je en korak razveljavitve.

![Izbiranje dveh stolpcev s Shift + Arrow Down, nato nastavitev obeh kot primarnega ključa z ⌥ + K in izklop obeh z drugim pritiskom](/img/demo-column-pk.webp)

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku [`readonly`](../../api/erd-editor-element.md#readonly) se nobena celica ne odpre za urejanje in noben stolpec se ne spremeni.  
Klik na celico ne postavi fokusa nikamor in odstrani izbor, ki ga je pustil skok. `Enter` in dvoklik ne odpreta nobenega urejevalnika in ne preklopita nobenega stikala, `Tab` je prepuščen strani, bližnjice, ki dodajo, izberejo vse ali izbrišejo stolpce, preklop primarnega ključa in lepljenje pa ne naredijo ničesar.  
Prehod na stolpec iz [raziskovalca](./explorer.md#going-to-a-row) ali [hitrega iskanja](./quick-search.md) postavi fokus na njegovo celico. Smerne tipke nato premikajo fokus od celice do celice, stolpec, ki ga dosežejo, pa je izbran sam, saj `Shift` tam ne doda nobenega stolpca.  
`Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac) še vedno kopira izbrani stolpec ali tabelo, ki jo je izbral skok – glejte razdelek [Kopiranje/lepljenje stolpcev](#copyingpasting-columns).
