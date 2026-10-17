---
sidebar_position: 3
description: Dodajanje, izbiranje, prerazporejanje in brisanje stolpcev, preklapljanje možnosti stolpcev ter kopiranje in lepljenje stolpcev.
---

# Urejanje tabel

Urejanje tabel v osnovi ponuja izkušnjo urejanja, podobno kot v programu Excel.  
Način urejanja se začne s tipko `Enter` ali z dvoklikom na celico.  
Tipka `Enter` ali `Escape` ga konča. Kar vnesete, se uporabi že med tipkanjem, zato tipka `Escape` besedilo ohrani in ga ne povrne v prejšnje stanje.  
Tipka `Escape` pusti fokus na celici in tabelo izbrano, drugi pritisk tipke `Escape` pa počisti oboje.  
Medtem ko vnosna metoda še sestavlja besedilo, tipka `Escape` pusti način urejanja odprt.

![Dodajanje tabele z Alt + N in izpolnjevanje dveh stolpcev](/img/demo-table-edit.webp)

## Dodajanje stolpcev {#adding-columns}

Stolpec ustvarite z bližnjico `Alt + Enter` (Windows/Linux) ali `⌥ + Enter` (Mac).  
Vsaki izbrani tabeli se doda stolpec.

## Tipka Tab {#tab-key}

Pritisnite `Tab`, da preidete neposredno v način urejanja naslednje celice.  
Pritisk tipke `Tab` v zadnji celici ustvari nov stolpec.  
Z bližnjico `Shift + Tab` se pomaknete v način urejanja prejšnje celice.  
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

Klik z desno tipko miške na vrstico stolpca določi, na katere stolpce deluje priročni meni tabele, ne glede na to, katero modifikatorsko tipko držite.  
Na vrstici, ki je že izbrana, izbor ostane, fokus pa se premakne na to vrstico. Na kateri koli drugi vrstici se izbere samo ta vrstica. To velja kjer koli na vrstici, vključno z ikono ključa in oznako [alternativnega ključa](./table-related-functions.md#alternate-keys).  
Če želite torej prek menija delovati na več stolpcev, kot v razdelku [Primarni ključ stolpca](#column-primary-key) ali [Brisanje stolpcev](#column-deletion), kliknite z desno tipko miške na eno od izbranih vrstic.  
Na računalniku Mac meni odpre tudi `Ctrl + click`, vendar šteje kot navaden klik, zato na celici pred odprtjem menija izbere samo to vrstico.

## Prerazporejanje in premikanje stolpcev {#rearranging-and-moving-columns}

Deluje s potezo `dragging` in omogoča premikanje v druge tabele.  
Povlečene vrstice sledijo kazalcu, vrstice okoli mesta spusta pa se umaknejo vstran in naredijo prostor.  
Stolpec spustite tik pod zadnjo vrstico tabele, da ga premaknete na konec te tabele. Tabela brez stolpcev sprejme spust kjer koli na njej.

![Vlečenje stolpca na novo mesto, nato v drugo tabelo](/img/demo-column-move.webp)

Podprto je premikanje več stolpcev s `Ctrl + drag` (Windows/Linux) ali `⌘ + drag` (Mac).

![Izbiranje treh stolpcev in njihovo premikanje v drugo tabelo s Ctrl/⌘ + drag](/img/demo-column-multi-move.webp)

## Brisanje stolpcev {#column-deletion}

Izbriše izbrane stolpce tabele s fokusom. Klik na celico izbere njen stolpec, zato s klikom na celico in pritiskom tipke `Delete` odstranite samo ta stolpec.  
Bližnjice:

- `Delete` ali `Backspace` (`⌫` na računalniku Mac). Ti tipki odstranita izbrane stolpce, dokler je njihova tabela edino, kar je izbrano. Kadar ni izbran noben stolpec (fokus je na imenu ali komentarju tabele), kadar je izbrano še kar koli drugega ali pri povečavi `70%` in manj, kjer tabele prikazujejo le svoja imena, namesto tega odstranita celoten izbor – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` ali `Alt + Delete` (Windows/Linux), `⌥ + ⌫` ali `⌥ + Delete` (Mac). Te bližnjice odstranijo izbrane stolpce tabele s fokusom, tudi kadar so hkrati izbrane druge tabele ali beležke. Ničesar ne odstranijo med urejanjem celice ali pri povečavi `70%` in manj.

![Brisanje enega stolpca, nato dveh izbranih stolpcev, z Alt + Backspace](/img/demo-column-remove.webp)

Enako naredi priročni meni tabele. Ko je tabela edino, kar je izbrano, kliknite z desno tipko miške na vrstico stolpca: zadnja postavka menija se glasi `Delete column` ali, kadar ta vrstica pripada enemu od dveh ali več izbranih stolpcev, `Delete columns`.

Med urejanjem celice tipki `Delete` in `Backspace` le brišeta besedilo. Če ju pridržite zunaj urejanja celice, odstranita le enkrat.  
Po odstranitvi se fokus premakne na najbližji preostali stolpec nad stolpcem, ki je imel fokus. Kadar nad njim ne ostane noben, se fokus premakne na ime tabele, tudi če pod njim ostanejo stolpci, zato naslednji pritisk tipke `Delete` ali `Backspace` odstrani tabelo in ne stolpca.  
Relacije in indeksi, ki uporabljajo odstranjeni stolpec, se odstranijo skupaj z njim. Potrditve ni, celotna odstranitev pa je en korak razveljavitve.

## Kopiranje/lepljenje stolpcev {#copyingpasting-columns}

Deluje kot tabelarično odložišče.  
Bližnjice: `Ctrl + C` (Windows/Linux) ali `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ali `⌘ + V` (Mac)

Kopiranje v preglednico, lepljenje iz nje in lepljenje v tabelo, v kateri ima fokus celica stolpca, uporabljajo celice, ki jih tabele prikazujejo, v vrstnem redu, v katerem jih prikazujejo – glejte razdelka [Možnosti pogleda tabel](./table-related-functions.md#table-view-options) in [Prilagajanje vrstnega reda stolpcev](./settings.md#adjusting-column-order).  
Stolpci, kopirani v urejevalniku in prilepljeni, ko je izbrana glava tabele, ali v druge izbrane tabele, prenesejo vse celice kopiranih stolpcev, vključno s skritimi, kot sta Enolično in Samodejno povečevanje.  
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

## Kopiranje/lepljenje tabel in beležk {#copyingpasting-tables-and-memos}

Kadar v tabeli s fokusom ni izbran noben stolpec, iste bližnjice kopirajo same izbrane tabele in beležke – glejte stran [Funkcije za tabele](./table-related-functions.md).

## Primarni ključ stolpca {#column-primary-key}

Preklopi primarni ključ na stolpcu s fokusom, to je na stolpcu, ki mu pripada celica s fokusom.  
Kadar je stolpec s fokusom eden od dveh ali več izbranih stolpcev, preklop velja za vse izbrane stolpce: če kateri od njih ni ključ, postanejo ključi vsi, če pa so ključi že vsi, se ključ odstrani vsem. Stolpci zunaj izbora ostanejo nespremenjeni.  
Uporabite priročni meni tabele ali bližnjico `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac). Kadar preklop zajame dva ali več stolpcev, se postavka menija namesto `Primary Key` glasi `Primary Key on selected columns`.  
Ikona ključa v vrstici je le prikazna, zato klik nanjo ključa ne nastavi.

Če želite iz več stolpcev narediti en sestavljeni ključ, jih [izberite](#selecting-multiple-columns) in nato pritisnite `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac) ali pa kliknite z desno tipko miške na eno od izbranih vrstic in izberite `Primary Key on selected columns`. Vsak preklop je en korak razveljavitve.

![Izbiranje dveh stolpcev s Shift + Arrow Down, nato nastavitev obeh kot primarnega ključa z ⌥ + K in izklop obeh z drugim pritiskom](/img/demo-column-pk.webp)
