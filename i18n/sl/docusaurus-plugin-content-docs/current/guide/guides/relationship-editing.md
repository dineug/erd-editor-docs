---
sidebar_position: 6
description: Brisanje relacije, sprememba njene vrste, nastavitev njenih dejanj ON DELETE in ON UPDATE, preslikava na obstoječe stolpce z oknom Preslikaj stolpce, branje notacije povezovalne črte, delo z relacijami N:M in identifikacijskimi relacijami ter način poimenovanja novih stolpcev tujega ključa.
---

# Urejanje relacij

Relacije se rišejo prek priročnega menija platna, orodne vrstice platna, [hitrega iskanja](./quick-search.md#what-the-palette-lists) ali z bližnjico – glejte stran [Začetek urejanja](./editing-start.md).  
Ta stran opisuje, kaj lahko z relacijo naredite, ko že obstaja, kako jo okno [Preslikaj stolpce](#map-columns) konča na stolpcih, ki jih podrejena tabela že ima, in kako se poimenujejo stolpci tujega ključa, ki jih relacija doda.

## Brisanje {#deletion}

Relacijo lahko izbrišete prek priročnega menija relacije.

![Brisanje relacije od products do reviews prek njenega priročnega menija](/img/demo-relationship-remove.webp)

Bližnjice za to ni, ker se relacija ne izbira tako kot tabela ali beležka: tipki `Delete` in `Backspace`, ki odstranita izbrano, nikoli ne odstranita samo relacije – glejte razdelek [Brisanje tabel in beležk](./table-related-functions.md#table-and-memo-deletion).  
Relacije se odstranijo tudi skupaj s tem, kar povezujejo: brisanje tabele odstrani vse relacije, ki se je dotikajo, brisanje stolpca pa vse relacije, ki ga uporabljajo.

## Sprememba vrste {#type-change}

Vrsto lahko spremenite s postavko `Relationship Type` v priročnem meniju relacije.  
Na voljo so štiri vrste, trenutna pa je označena s kljukico:

- Zero One
- Zero N
- One Only
- One N

![Spreminjanje relacije iz Zero N v One Only in nato v One N v njenem priročnem meniju](/img/demo-relationship-type.webp)

To so iste štiri vrste, s katerimi začnete risati relacijo, vsaka s svojo bližnjico – glejte stran [Začetek urejanja](./editing-start.md).

## ON DELETE in ON UPDATE {#on-delete-and-on-update}

Nastavite ju s postavkama `On Delete` in `On Update` v priročnem meniju relacije, med postavkama `Relationship Type` in `Map Columns`.  
Vsaka ponuja istih šest postavk, trenutna pa je označena s kljukico:

- Not set
- NO ACTION
- CASCADE
- SET NULL
- SET DEFAULT
- RESTRICT

Postavka `Not set` ne zapiše nobenega določila, zato velja privzeto vedenje same zbirke podatkov. Nova relacija, narisana ali ustvarjena v oknu [Preslikaj stolpce](#map-columns), ima sprva obe dejanji nastavljeni na `Not set`, poznejša izbira postavke `Not set` pa dejanje počisti.  
Dejanji sta med seboj neodvisni: sprememba enega pusti drugo nespremenjeno.  
Povezovalna črta prikazuje, kaj je nastavljeno – glejte razdelek [Branje povezovalne črte](#reading-a-connector).  
Relacija, ki jo kopirate in prilepite ali podvojite skupaj z njenimi tabelami, ohrani obe dejanji, uvoz Sheme SQL, DBML ali AML pa prinese dejanja, ki jih določa datoteka – glejte stran [Uvoz in izvoz datotek](./file-import-export.md).

![Nastavljanje ON DELETE CASCADE in ON UPDATE RESTRICT za relacijo od orders do order_items prek njenega priročnega menija, pri čemer oznaka kaže D:C U:R, nato pa premik kazalca nad črto za ponoven ogled obeh dejanj](/img/demo-referential-actions.webp)

Vsako dejanje lahko izberete ne glede na zbirko podatkov.  
Ob dejanju, ki ga izbrana [zbirka podatkov](./table-related-functions.md#databases) izpusti iz svoje Sheme SQL, je bleda opomba, na primer `not in MySQL`. Postavka `Not set` je nikoli nima, zamenjava zbirke podatkov pa opombe posodobi.  
Dejanje z opombo je na relaciji še vedno shranjeno: povezovalna črta ga prikazuje, formati JSON, DBML in AML ga ohranijo, vendar Shema SQL za to zbirko podatkov določilo izpusti, zato velja privzeto vedenje zbirke podatkov.

[Shema SQL](./schema-sql.md) zapiše ta dejanja, ostala pa izpusti:

| Zbirka podatkov | ON DELETE | ON UPDATE |
| --- | --- | --- |
| Databricks | `NO ACTION` | `NO ACTION` |
| MSSQL | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` | `NO ACTION`, `CASCADE`, `SET NULL`, `SET DEFAULT` |
| MariaDB | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| MySQL | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` | `NO ACTION`, `CASCADE`, `SET NULL`, `RESTRICT` |
| Oracle | `CASCADE`, `SET NULL` | Nobeno |
| PostgreSQL | Vseh pet | Vseh pet |
| Snowflake | `NO ACTION` | `NO ACTION` |
| SQLite | Vseh pet | Vseh pet |

Shema SQL za Snowflake za vsako izpuščeno dejanje zapiše tudi komentar z njegovim imenom – glejte razdelek [Referenčna dejanja](./schema-sql.md#referential-actions).

Katera dejanja zapišejo cilji ORM generatorja kode, je odvisno tako od cilja kot od izbrane zbirke podatkov – glejte stran [Generator kode](./code-generator.md#on-delete-and-on-update).

## Preslikaj stolpce {#map-columns}

Okno Preslikaj stolpce poveže ključ nadrejene tabele s stolpci podrejene tabele, po eno vrstico za vsak stolpec ključa.  
Vsaka vrstica bodisi uporabi stolpec, ki ga podrejena tabela že ima, bodisi doda nov stolpec tujega ključa, zato se relacija lahko konča na stolpcih, ki že obstajajo.

![Risanje relacije Zero N od members do orders, izbira Map to existing columns in preslikava stolpca id na obstoječi stolpec member_id](/img/demo-map-columns.webp)

Okno se odpre na dva načina:

- Med risanjem relacije z gumbom `Map to existing columns` ob podrejeni tabeli – glejte razdelek [Ustvarjanje relacije](./editing-start.md#relationship-creation). Gumb `Map` nato doda relacijo vrste, ki jo rišete.
- S postavko `Map Columns` v priročnem meniju relacije, da spremenite stolpce obstoječe relacije. Gumb `Save` nato zapiše spremembo. V urejevalniku samo za branje je ta postavka izpuščena.

Podnaslov okna navaja obe tabeli in vrsto relacije, na primer `users → posts · One N`. Vrsta je tu prikazana, ne pa tudi spremenjena – za spremembo glejte razdelek [Sprememba vrste](#type-change).

Polje `References` določa ključ, na katerega kaže relacija: `Primary Key` s stolpci v vrstnem redu tabele, nato `Unique: <column>` za vsak stolpec z zastavico `Unique`. Prikaže se le, ko je na voljo več kot ena izbira.  
Enoličen indeks tu ne šteje za ključ, stolpec z zastavico `Unique`, ki je celoten primarni ključ, pa ni naveden dvakrat.  
Izbira drugega ključa vrstice zgradi znova. Vrstica ohrani svojo izbiro, dokler je ta stolpec še v podrejeni tabeli.

Pod naslovoma `Referenced column` in `Foreign key column` vsaka vrstica prikaže stolpec ključa z njegovim podatkovnim tipom in seznam stolpcev podrejene tabele, s katerimi ga lahko povežete:

- Postavka `Pick a column` pusti vrstico prazno.
- Postavka `New column: <name>` doda nov stolpec tujega ključa. Prikazano ime je tisto, ki ga bo stolpec dobil, kot je opisano v razdelku [Imena stolpcev tujega ključa](#foreign-key-column-names), oštevilčeno glede na stolpce podrejene tabele in druge vrstice, ki dodajo nov stolpec. Ni na voljo, ko bi bilo ime prazno, na primer pri ključu brez imena.
- Vsak stolpec podrejene tabele, kot `<name> (<data type>)`. Stolpec, ki ga je izbrala druga vrstica, je prikazan kot `<name> (<data type>) · in use` in ga ni mogoče izbrati, zato si nobeni dve vrstici ne delita istega stolpca. Stolpec, ki ga že uporablja druga relacija, je še vedno mogoče izbrati, zato lahko stolpec, na primer skupni `tenant_id`, služi več relacijam.

V oknu z gumbom `Map` je vrstica sprva izpolnjena le, ko se ime natanko enega stolpca podrejene tabele ne glede na velikost črk ujema z imenom, ki bi ga zanjo dobil nov stolpec tujega ključa pred kakršnim koli številčenjem `_2`, na primer `users_id` za `id` v tabeli `users` in `member_id` za `member_id`. Dokler je možnost [`Bracket`](./schema-sql.md#database-and-bracket) nastavljena na `None`, kar je privzeto, šteje tudi ime, zgrajeno iz tabelnega dela imena tabele s shemo, zato se `id` v tabeli `public.users` poveže s stolpcem `public.users_id` ali `users_id`. Pri ključu `Unique` šteje tudi lastno ime stolpca ključa, zato se `vin` poveže s stolpcem `vin`. Vse druge vrstice se začnejo pri postavki `Pick a column`.  
V oknu z gumbom `Save` se vsaka vrstica začne pri stolpcu, ki ga relacija uporablja zdaj. V obeh primerih izbira drugega ključa v polju `References` izpolni prazne vrstice tega ključa po istih imenih.

Kadar se podatkovni tip izbranega stolpca razlikuje od tipa, ki ga stolpec nadrejene tabele dodeli tujemu ključu, to pove opomba pod vrstico.  
Ko je [sinhronizacija tipa podatkov v relacijah](./settings.md#relationship-datatype-sync) vklopljena in ima stolpec nadrejene tabele podatkovni tip, se opomba glasi `<column> becomes <type>`, kar je tip, ki ga bo zapisala preslikava. Sicer se glasi `Types differ: <parent type> and <child type>`, stolpec pa obdrži svoj tip.

Gumb `Map` ali `Save` ostane onemogočen, dokler kaj ovira preslikavo, sporočilo pod vrsticami pa pove, kaj:

- `Pick a foreign key column for every referenced column`: vrstica je še prazna.
- `At least one column must reference a different column`: rekurzivna relacija, v kateri vsaka vrstica izbere kar svoj stolpec nadrejene tabele.
- `These columns are already linked by another relationship`: druga relacija med istima tabelama povezuje natanko te stolpce.
- `<parent> has no key to reference`: v oknu z gumbom `Map` nadrejena tabela nima niti primarnega ključa niti stolpca z zastavico `Unique`.

Gumb `Save` ostane onemogočen tudi, dokler se preslikava ne razlikuje od trenutne preslikave relacije.  
V oknu z gumbom `Save` je vrstica prikazana kot `(removed)`, ko je bil njen stolpec odstranjen iz svoje tabele. Izberite drug stolpec podrejene tabele ali pa za stolpec nadrejene tabele, ki ga ni več, izberite ključ v polju `References`. V oknu z gumbom `Map` se vrstica, katere izbrani stolpec je odstranjen, vrne na `Pick a column`.

Za relacijo, katere stolpci nadrejene tabele niso natanko eden od ključev nadrejene tabele, se okno odpre z izbrano dodatno možnostjo na koncu polja `References`, `Current columns (not a key)`, ki te stolpce ohrani takšne, kot so. Kadar nadrejena tabela sploh nima ključa, je to edina izbira in polje `References` ni prikazano.  
Sporočilo `The referenced columns are not a key of <parent>` ali, kadar nadrejena tabela sploh nima ključa, `<parent> has no key to reference` je tam obvestilo, ne napaka: gumb `Save` še vedno deluje, zato lahko spremenite stolpce podrejene tabele in ohranite sklic.  
Relacija, pri kateri obeh seznamov stolpcev ni mogoče povezati v pare, na primer ker sta različno dolga, prikaže vrstice `(invalid)`, gumb `Save` pa ostane onemogočen, dokler ne izberete ključa v polju `References` ali, če ga nadrejena tabela nima, ne dodate nadrejeni tabeli primarnega ključa ali stolpca z zastavico `Unique`.

Medtem ko je okno odprto, sledi diagramu, vključno s spremembami sodelavca ali agenta za kodiranje, in ohrani, kar ste izbrali.  
Če se medtem spremenijo stolpci relacije ali ključ, s katerim se je okno odprlo, okno doda sporočilo `This relationship changed while the dialog was open`.

Kaj zapišeta gumba `Map` in `Save`:

- Gumb `Map` doda relacijo z možnostma `On Delete` in `On Update`, nastavljenima na `Not set`. Gumb `Save` spremeni le stolpce relacije, pri čemer konec pri nadrejeni tabeli usmeri na ključ, izbran v polju `References`, in ohrani njeno vrsto ter njeni dejanji ON DELETE in ON UPDATE.
- Vrstica `New column` doda stolpec na konec podrejene tabele, tako kot risanje: `NOT NULL`, poimenovan po svojem ključu, s podatkovnim tipom, privzeto vrednostjo in komentarjem ključa – glejte razdelek [Identifikacijske relacije](#identifying-relationships).
- Izbrani stolpec se nikoli ne preimenuje, njegova zastavica `Not Null`, primarni ključ, zastavica `Unique`, privzeta vrednost in komentar pa ostanejo nespremenjeni. Njegov podatkovni tip se spremeni le, ko je nastavitev `Relationship DataType Sync` vklopljena in ima stolpec nadrejene tabele podatkovni tip: prevzame tip, ki ga stolpec nadrejene tabele dodeli tujemu ključu, pri ključu serial tako kot nov stolpec celoštevilski tip, sprememba pa se po relacijah prenaša naprej tako, kot to počne sinhronizacija.
- Stolpec, ki ga preslikava preneha uporabljati, ostane v podrejeni tabeli in ni več označen kot tuji ključ, razen če se na njem še vedno konča druga relacija.
- Vse, kar zapiše en pritisk gumba `Map` ali `Save`, vključno z novimi stolpci in spremembami tipov, je en korak razveljavitve.

Ali je relacija identifikacijska in kako je narisan njen konec pri nadrejeni tabeli, se tako kot pri vsaki relaciji določi iz preslikanih stolpcev podrejene tabele. Preslikava na stolpce primarnega ključa podrejene tabele jo takoj naredi identifikacijsko, preslikava na stolpec, ki dovoljuje `NULL`, pa na konec pri nadrejeni tabeli postavi krožec – glejte razdelek [Branje povezovalne črte](#reading-a-connector).  
Tuji ključ v Shemi SQL se sklicuje na ključ, ki ste ga izbrali, na primer `REFERENCES vehicle (vin)` za ključ `Unique`.

Če diagram ob pritisku gumba `Map` ali `Save` preslikavo že vsebuje, ker vas je prehitel sodelavec ali agent za kodiranje, se ne zapiše nič.  
Če se je diagram spremenil tako, da preslikava ne ustreza več, se ne zapiše nič, pojavno obvestilo pa sporoči `Couldn't map columns: the diagram changed`.

Gumb `Cancel`, gumb `x`, tipka `Escape` ali klik na zatemnjeno območje zunaj pogovornega okna ga zapre, ne da bi se kar koli zapisalo.  
Zatemnjeno območje prekrije ves urejevalnik, vključno z orodno vrstico, odprt [raziskovalec](./explorer.md#dialogs-beside-it) pa ostane odprt pod njim.  
Okno se zapre tudi, ko odprete hitro iskanje, ko zapustite zavihek ERD ali ko urejevalnik preklopi v način samo za branje.  
Bližnjica `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) ga prav tako zapre in postavi kazalko v iskalno polje [iskanja](./find-and-replace.md#opening-and-closing) v raziskovalcu, pri čemer raziskovalca odpre, če je zaprt. V urejevalniku, ki je preozek za prikaz raziskovalca, bližnjica okno še vedno zapre, vendar namesto premika kazalke prikaže pojavno obvestilo – glejte razdelek [Odpiranje in zapiranje](./explorer.md#opening-and-closing).  
Če je ena od njegovih tabel ali relacija odstranjena, medtem ko je okno odprto, se okno zapre s pojavnim obvestilom, na primer `Map Columns closed: the relationship was removed`.  
Medtem ko je okno odprto, bližnjice platna, razveljavitev in uveljavitev ter kopiranje in lepljenje ne naredijo ničesar.

Agent za kodiranje nima orodja Preslikaj stolpce. Relacijo znova preslika tako, da jo odstrani z orodjem `erd_remove_relationship`, ki ohrani njene stolpce tujega ključa, in jo z orodjem `erd_link_columns` znova nariše na obstoječih stolpcih, oboje v enem paketu `erd_batch` – glejte stran [Orodja](../../mcp/tools.md#relationships).

## Relacije N:M {#nm-relationships}

Ker urejevalnik temelji na fizičnem modelu, se relacija N:M izrazi z vezno tabelo, kot je prikazano spodaj.

![Risanje relacij iz products in nato iz tags v prazno tabelo product_tags s ⌘ + ⌥ + 2, pri čemer se dodata product_id in nato tag_id](/img/demo-relationship-n-m.webp)

Kadar vezna tabela že ima svoje stolpce ključa, na primer `product_id` in `tag_id` v tabeli `product_tags`, narišite vsako relacijo z gumbom `Map to existing columns` in izberite te stolpce, namesto da dodate nove – glejte razdelek [Preslikaj stolpce](#map-columns). Če ti stolpci tvorijo primarni ključ vezne tabele, je vsaka relacija takoj identifikacijska.

Uvoz GraphQL, DBML ali AML vezno tabelo ustvari namesto vas.  
Deklaracija relacije mnogo proti mnogo se uvozi kot tabela z imenom `<left>_<right>` in komentarjem `Junction table inferred from <left> <-> <right>`, ki je z obema stranema povezana z identifikacijskimi relacijami.  
Glejte stran [Uvoz in izvoz datotek](./file-import-export.md).

## Identifikacijske relacije {#identifying-relationships}

Risanje relacije s klikom na podrejeno tabelo ali z gumbom `Create new columns` vsak primarni ključ nadrejene tabele kopira v podrejeno tabelo kot stolpec tujega ključa `NOT NULL`, zato je nova relacija sprva neidentifikacijska.  
Kopija prevzame podatkovni tip, privzeto vrednost in komentar ključa, ne pa tudi zastavic `Unique` ali `Auto Increment`, ime pa dobi, kot je opisano v razdelku [Imena stolpcev tujega ključa](#foreign-key-column-names).  
Izjema pri podatkovnem tipu je ključ serial: njegova kopija prevzame celoštevilski tip, ki ga hrani serial. Tipa `smallserial` in `serial2` pri vsaki zbirki podatkov dasta `smallint`, tip `serial4` da `integer`, tipa `bigserial` in `serial8` pa dasta `bigint`. Sam tip `serial` da `integer` pri PostgreSQL in `bigint unsigned` pri MySQL in MariaDB, pri vsaki drugi zbirki podatkov pa ostane `serial`.  
Šteje le celotno ime tipa, ne glede na velikost črk, zato se tip `serial(4)` kopira tako, kot je zapisan. Tip, zapisan z velikimi črkami, da velike črke: tip `SERIAL` da `INTEGER` pri PostgreSQL. Stolpec tujega ključa, ki ima v shranjenem diagramu že tip `serial`, ta tip obdrži.  
Če želite relacijo narediti identifikacijsko, te stolpce tujega ključa v podrejeni tabeli nastavite kot primarne ključe: izberite jih vse in enkrat pritisnite `Alt + K` (Windows/Linux) ali `⌥ + K` (Mac) ali pa v priročnem meniju tabele izberite postavko `Primary Key`, ki se glasi `Primary Key on selected columns`, ko sta izbrana vsaj dva stolpca – glejte razdelek [Primarni ključ stolpca](./table-editing.md#column-primary-key).

![Preklapljanje stolpca product_id kot primarnega ključa z Alt + K, pri čemer njegova povezovalna črta postane polna in nato črtkana](/img/demo-identifying-relationship.webp)

Urejevalnik to samodejno sproti usklajuje.  
Relacija je identifikacijska, dokler je vsak stolpec na strani podrejene tabele primarni ključ, in postane neidentifikacijska, takoj ko eden od njih ni.

## Imena stolpcev tujega ključa {#foreign-key-column-names}

Risanje relacije vsak stolpec tujega ključa, ki ga doda, poimenuje po ključu nadrejene tabele, ki ga ta stolpec kopira:

- Ime ključa iz ene besede, na primer `id`, `ID` ali `uuid`, dobi spredaj ime nadrejene tabele in podčrtaj: ključ `id` v tabeli `products` postane `products_id`.
- Ime ključa iz več besed, na primer `member_id`, `userId` ali `UserID`, ostane nespremenjeno.
- Nespremenjeno ostane tudi ime ključa iz ene besede, ki je ne glede na velikost črk kar ime same tabele: ključ `currency` v tabeli `currency` ostane `currency`. Ključ, ki ime tabele le vsebuje, predpono še vedno dobi: ključ `username` v tabeli `user` postane `user_username`.

Ime je ena beseda, kadar vsebuje le črke in števke brez menjave velikosti črk.  
Vsak drug znak ga razdeli, zato so `_id`, `order no` in `order-no` več besed.  
Razdeli ga tudi menjava velikosti črk, ki se bere tako kot camelCase: mala črka, ki ji sledi velika (`userId`), dve veliki črki, ki jima sledi mala (`IDCard`, `IDs`), ali črka pisave brez velikih in malih črk, na primer hangul, kana ali kitajske pismenke, ob črki pisave z velikimi in malimi črkami (`회원ID`).  
Števke besede ne razdelijo, zato sta `id2` in `SHA256` ena beseda. Tudi zloženka, zapisana z enotno velikostjo črk, je ena beseda: ključ `memberid` v tabeli `members` postane `members_memberid`.

Ime tabele se uporabi tako, kot je zapisano, razen presledkov na začetku in koncu: velikost črk, notranji presledki in pike se ohranijo, ime se ne pretvori v ednino, nastavitvi generatorja kode `Table Name Case` in `Column Name Case` pa pri tem nimata nobene vloge. Tabela `Users` s ključem `ID` da `Users_ID`.  
Vsak stolpec sestavljenega ključa se poimenuje posebej: tabela `orders` s ključem (`tenant_id`, `id`) doda `tenant_id` in `orders_id`.

Ime, ki ga podrejena tabela ne glede na velikost črk že ima, se oštevilči s pripono `_2`, `_3` in tako naprej, pri čemer dobi prvo prosto število.  
Druga relacija iz tabele `users` s ključem `id` v isto tabelo doda `users_id_2`, rekurzivna relacija na tabeli `members` s ključem `member_id` pa doda `member_id_2`.  
Stolpci enega sestavljenega ključa se na enak način oštevilčijo drug glede na drugega, ime, ki ostane nespremenjeno, pa si mesto zagotovi prvo: tabela `user` s ključem (`id`, `user_id`) doda `user_id` za `user_id` in `user_id_2` za `id`.

Pri nadrejeni tabeli brez imena ostane ime ključa nespremenjeno, ob podvojitvi pa se oštevilči kot vsako drugo ime.  
Ključ brez imena da stolpec tujega ključa brez imena.  
To velja tudi za primarni ključ, ki ga urejevalnik doda nadrejeni tabeli, ki ga nima, razen če ga poimenujete, preden kliknete podrejeno tabelo.

Imena se določijo ob risanju relacije. Poznejše preimenovanje nadrejene tabele ali njenega ključa jih ne preimenuje.  
Vrstice `New column` v oknu [Preslikaj stolpce](#map-columns) se poimenujejo po istih pravilih, seznam pa vsako ime prikaže, preden ga izberete.  
Relacije, ki nastanejo na že obstoječih stolpcih (z uvozom, lepljenjem, podvajanjem ali v oknu Preslikaj stolpce, ki poveže obstoječe stolpce), ohranijo imena, ki jih imajo ti stolpci.  
Agent za kodiranje, ki relacijo doda z orodjem `erd_add_relationship`, dobi enaka imena in podatkovne tipe – glejte stran [Orodja](../../mcp/tools.md#relationships).

## Branje povezovalne črte {#reading-a-connector}

- Identifikacijska relacija je narisana s polno črto, neidentifikacijska pa s črtkano.
- Konec pri podrejeni tabeli nosi simbol kardinalnosti vrste relacije: krožec in črtico pri Zero One, krožec in vranjo nogo pri Zero N, dve črtici pri One Only ter črtico in vranjo nogo pri One N.
- Konec pri nadrejeni tabeli je krožec in črtica, kot pri Zero One, kadar kateri koli od stolpcev tujega ključa dovoljuje `NULL`, in dve črtici, kot pri One Only, kadar so vsi `NOT NULL`.
- Ko je kazalec nad povezovalno črto, se ta poudari skupaj s stolpci, ki jih povezuje v obeh tabelah.

![Zaporedno premikanje kazalca nad tri povezovalne črte, pri čemer se vsaka osvetli skupaj s stolpci, ki jih povezuje](/img/demo-relationship-hover.webp)

Relacija, ki nastavlja [ON DELETE ali ON UPDATE](#on-delete-and-on-update), ima ob koncu pri podrejeni tabeli oznako, na primer `D:C U:R`: `D:` in dejanje ON DELETE, nato `U:` in dejanje ON UPDATE, vsako le, kadar je nastavljeno.  
Dejanja so okrajšana po notaciji orodja erwin: `C` za CASCADE, `R` za RESTRICT, `SN` za SET NULL, `SD` za SET DEFAULT in `NA` za NO ACTION. Relacija, ki ne nastavlja nobenega od obeh dejanj, nima oznake.  
Oznaka leži na strani proč od podrejene tabele, nad črto, kadar povezovalna črta zapusti levo ali desno stran te tabele, in desno od črte, kadar zapusti zgornjo ali spodnjo stran, tako da ne prekriva simbola kardinalnosti.  
Narisana je v barvi povezovalne črte na majhnem pravokotniku v barvi ozadja platna in se osvetli skupaj s svojo povezovalno črto. Oznake so narisane nad vsemi povezovalnimi črtami, zato gre črta, ki prečka oznako, pod njo.  
Prikazuje dejanje, shranjeno na relaciji, ne glede na to, kaj zapiše izbrana zbirka podatkov, zato je ON DELETE SET DEFAULT tudi pri MySQL še vedno prikazan kot `D:SD`.

Ko je kazalec nad povezovalno črto relacije, ki nastavlja katero koli od obeh dejanj, se prikaže tudi opis orodja z izpisanimi določili, po eno v vrstici, na primer `ON DELETE CASCADE` in `ON UPDATE RESTRICT`.  
Opis orodja se prikaže, tudi kadar je oznaka skrita.

Prehod na relacijo jo osvetli: izbira vrstice pod mapo `Foreign Keys` tabele v [raziskovalcu](./explorer.md#going-to-a-row) ali vrstice tujega ključa v [pregledovalniku razlik](./table-related-functions.md#going-to-a-change) nariše njeno povezovalno črto in njeno oznako v barvi ob lebdenju. V pregledovalniku razlik osvetli povezovalno črto na vsaki strani, ki vsebuje relacijo, zato dodan tuji ključ osvetli le trenutno stran, odstranjen pa le shranjeno stran.  
Skok izbere le podrejeno tabelo z njenimi stolpci tujega ključa, s fokusom na celici prvega od njih; sama relacija še vedno nikoli ni izbrana. Za to, kam se premakne pogled, glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands).  
Osvetlitev ugasne ob naslednjem pritisku levega ali desnega gumba miške na platnu, ne glede na to, ali je na praznem mestu, tabeli, beležki, skupini tabel ali povezovalni črti, tudi ob pritisku, ki izbor pusti nespremenjen. Ugasne jo tudi prehod na drugo vrstico ali iskalni zadetek v raziskovalcu in prav tako prehod na drugo vrstico v pregledovalniku razlik, in sicer na vsaki strani, na katero vodi ta vrstica.  
Premikanje pogleda s srednjim gumbom miške ali z orodjem Roka osvetlitev ohrani, prav tako jo ohranijo strnitev ali razširitev vrstice v raziskovalcu ali pregledovalniku razlik, počistitev izbora s tipko `Escape` ter skok iz [hitrega iskanja](./quick-search.md) ali z [gumba na kartici](./visualization.md#card-buttons) za zunanjo povezavo v načinu Tok.  
Osvetlitev se ne shrani in ni v zgodovini razveljavitev, sodelavci pa je ne vidijo.

Skrijte povezovalne črte na platnu ERD z možnostjo pogleda `Relationship` ali le njihove oznake z možnostjo pogleda `Referential Actions`, ki je privzeto vklopljena – glejte razdelek [Možnosti pogleda tabel](./table-related-functions.md#table-view-options).  
Oznake se ne rišejo pri povečavi `70%` in manj, kjer se tabele strnejo na svoje ime.  
[Izvoz slike](./file-import-export.md#image) se vedno nariše pri 100 %, zato oznake nariše ne glede na povečavo platna, razen če jih skrije možnost pogleda. Ko je možnost `Background` izklopljena, je prozoren tudi pravokotnik za vsako oznako.  
[Način Tok](./visualization.md#flow-mode) na zavihku Vizualizacija nariše povezovalne črte tudi, ko je možnost `Relationship` izklopljena, vsako kot eno gladko polno sivo krivuljo z enakimi simboli na koncih, zato črtkana črta, oznake, opis orodja, osvetlitev po skoku in pravokotno usmerjanje, opisani na tej strani, veljajo le za platno ERD. Relacija iz tabele v isto tabelo se tudi v načinu Tok ukrivi okoli zgornjega desnega vogala – glejte razdelek [Usmerjanje povezovalnih črt](#connector-routing).

## Usmerjanje povezovalnih črt {#connector-routing}

Povezovalne črte se usmerjajo pravokotno.  
Pot obide tabele, ki ležijo med njenima koncema, namesto da bi jih prečkala, njeni vogali pa so zaobljeni.  
Vsak konec zapusti svojo tabelo s kratkim ravnim odsekom, preden zavije, zato dve tabeli, ki sta blizu skupaj in katerih konca povezovalne črte sta poravnana, poveže ena ravna črta namesto obvoza.  
Poti, ki zapuščajo isto stran tabele, se razporedijo v ločene koridorje, da se ne prekrivajo.  
Izogibajo se le tabelam: povezovalna črta lahko prečka beležko ali okvir skupine tabel in je narisana nad skupinami tabel ter pod tabelami in beležkami.

Relacija iz tabele v isto tabelo je narisana kot ena krivulja okoli zgornjega desnega vogala tabele, ki na koncu pri nadrejeni tabeli izstopi iz zgornje strani, na koncu pri podrejeni tabeli pa vstopi v desno stran.  
Nadaljnje rekurzivne relacije na isti tabeli se gnezdijo zunaj prve, zato njihove krivulje ne sekajo ne druga druge ne tabele.

Nastavljati ni treba ničesar.  
Poti se samodejno znova izračunajo, kadar koli se kar koli na platnu premakne ali spremeni velikost, zato jih nikoli ni treba popravljati ročno.

![Vlečenje tabele members navzdol in nazaj, medtem ko povezovalna črta iz orders izmenično poteka desno od categories in okoli njene leve strani, vsi vogali pa so zaobljeni](/img/demo-connector-routing.webp)
