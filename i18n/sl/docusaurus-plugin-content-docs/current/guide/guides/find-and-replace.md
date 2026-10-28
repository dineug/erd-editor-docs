---
sidebar_position: 10
description: Iskanje na vrhu raziskovalca po imenih tabel, stolpcev, indeksov in skupin tabel, logičnih imenih, komentarjih in beležkah, premikanje po zadetkih v njegovem drevesu in na platnu ter zamenjava enega zadetka ali vseh.
---

# Iskanje in zamenjava

Poišče besedilo v celotnem diagramu, vas pripelje do vsakega zadetka na platnu ERD in zamenja en zadetek ali vse.  
Preiskuje osem vrst besedila: imena tabel, komentarje tabel, imena stolpcev, komentarje stolpcev, beležke, imena indeksov, imena skupin tabel ter [logična imena](./logical-names.md) tabel in stolpcev – glejte razdelek [Kaj preiskuje](#what-it-searches).

Nahaja se na vrhu [raziskovalca](./explorer.md), plošče, zasidrane levo od platna ERD, med naslovno vrstico raziskovalca in njegovim drevesom. Svojega naslova nima. Od zgoraj navzdol vsebuje:

- Iskalno polje, v katerem so na koncu tri [možnosti](#options), pred njim pa puščico `Toggle Replace`.
- Vrstico `Replace`, ki je sprva strnjena – glejte razdelek [Zamenjevanje](#replacing).
- Števec, nato puščici navzgor in navzdol za premikanje po zadetkih ter gumb `Search In` s tremi pikami.
- [Vrste besedila](#what-it-searches), ki jih razširi gumb `Search In`.

Dokler je v iskalnem polju besedilo, drevo raziskovalca prikazuje zadetke – glejte razdelek [Rezultati](#the-results).  
Na nizkem platnu iskanje ohrani polno višino, drevo pod njim pa zavzame preostali prostor in se pomika.

![Odpiranje iskanja in zamenjave v raziskovalcu s ⌘ + F, premikanje po šestih zadetkih besede member, nato pa ob vklopljeni možnosti Preserve Case zamenjava vseh šestih z user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Odpiranje in zapiranje {#opening-and-closing}

Bližnjica `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) ter postavka `Toggle Explorer` v [hitrem iskanju](./quick-search.md) ali v priročnem meniju platna odpreta iskanje v raziskovalcu. Kazalka se premakne v iskalno polje z izbranim besedilom, iskanje po iskalnem nizu pa se ponovi brez trenutnega zadetka.  
Gumb `Explorer` v orodni vrstici ploščo samo odpre ali zapre. Kazalke ne postavi v iskalno polje, iskalni niz in trenutni zadetek pa pusti takšna, kot sta bila.  
Ko bližnjica kazalko le vrne v raziskovalca, ki je že prikazan, kot se zgodi, ko je odprto hitro iskanje ali eno od petih pogovornih oken iz razdelka [Pogovorna okna ob njem](./explorer.md#dialogs-beside-it), trenutni zadetek ostane trenutni.

Kako se raziskovalec zapre, kaj naredijo bližnjica in obe postavki `Toggle Explorer`, ko je odprt, in katera pogovorna okna zaprejo, je opisano v razdelku [Odpiranje in zapiranje](./explorer.md#opening-and-closing) na strani o raziskovalcu.  
Razdelek [Ko se umakne](./explorer.md#when-it-stands-aside) opisuje, kako ga skrijeta drug zavihek in način zen ter kako ga pregledovalnik razlik, potovanje skozi čas in predogled samodejne postavitve skrijejo in preprečijo njegovo odpiranje. Razdelek [Ob platnu](./explorer.md#beside-the-canvas) opisuje urejevalnik, ki je zanj preozek.

Ponovno odpiranje ohrani zadnji iskalni niz, pa tudi besedilo za zamenjavo, [možnosti](#options), [vrste besedila](#what-it-searches), ki so bile vklopljene, ter to, ali so bile vrstica `Replace` in vrste besedila razširjene.  
Ohranijo se, dokler je urejevalnik odprt, in se ne shranijo v dokument. Na novo odprt urejevalnik začne z vsemi izklopljenimi možnostmi, s strnjeno vrstico `Replace` in strnjenimi vrstami besedila ter z vklopljenimi samo štirimi vrstami imen in vrsto `Logical names` – glejte razdelek [Kaj preiskuje](#what-it-searches).

## Iskalna vrstica brskalnika {#the-browsers-find-bar}

Dokler ima urejevalnik fokus tipkovnice, bližnjica `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) na vsakem zavihku pripada njemu, tudi v njegovih lastnih besedilnih poljih, zato se iskalna vrstica brskalnika ne odpre.  
Bližnjica gre naprej do brskalnika ali gostitelja, dokler je odprt pregledovalnik razlik, potovanje skozi čas ali predogled samodejne postavitve, in dokler je fokus zunaj urejevalnika.

- Spletna aplikacija in Google Drive: iskalna vrstica brskalnika se odpre samo v teh dveh primerih.
- VS Code: razširitev v urejevalniku ERD Editor pusti lastni pripomoček za iskanje VS Code izklopljen, zato ga bližnjica tam nikoli ne odpre.
- Obsidian: bližnjica doseže urejevalnik vedno, ko je zavihek diagrama aktiven, namesto ukaza `Search current file` aplikacije Obsidian.
- Razvojno okolje JetBrains: če nabor bližnjic razvojnega okolja `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) zadrži zase, odprite iskanje s postavko `Toggle Explorer` v hitrem iskanju ali v priročnem meniju platna ali pa odprite raziskovalca z gumbom `Explorer` v orodni vrstici in kliknite v iskalno polje.

Stran, ki vdela urejevalnik, lahko bližnjico premakne ali odstrani – glejte razdelek [Spreminjanje bližnjice](#changing-the-shortcut).

## Kaj preiskuje {#what-it-searches}

Osem gumbov določa, katere vrste besedila se preiskujejo, v tem vrstnem redu: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` in `Logical names`.  
Sprva so strnjeni. Gumb `Search In` na koncu vrstice s števcem jih razširi pod to vrstico in jih znova strne, dokler so prikazani, pa je poudarjen.  
Poudarjen gumb vrste je vklopljen. Kliknite gumb, da ga vklopite ali izklopite, in iskanje se znova izvede. Ko je izklopljenih vseh osem, se ne najde nič.

Iskanje se sprva odpre s štirimi vrstami imen, `Table names`, `Column names`, `Index names` in `Table group names`, ter z vrsto `Logical names`, zato preimenovanje ne seže do komentarjev in beležk, razen če jih vklopite.  
Vrsta `Logical names` je ena sama za logična imena tabel in stolpcev.  
Imena indeksov so imena indeksov na zavihku `Indexes` v oknu [Lastnosti tabele](./table-related-functions.md#indexes), ne ključi `PK_` in `UQ_`, navedeni nad njimi.

Nič drugega se ne preiskuje: niti podatkovni tipi, domena stolpca, privzete vrednosti, stolpci indeksa, ime zbirke podatkov, [Shema SQL](./schema-sql.md) s skriptoma `Before tables` in `After tables`, ustvarjena koda niti listi zavihka [Slovar](./dictionary.md), ki imajo [svoje iskanje](./dictionary.md#searching).  
Logična imena se preiskujejo ne glede na to, kaj izriše [prikaz imen](./logical-names.md#name-view), tudi v prikazu `Physical Names`, v katerem jih platno ne prikazuje. Prav tako se še vedno preiskuje komentar, skrit z [možnostjo pogleda tabel](./table-related-functions.md#table-view-options). Beležke, skrite z View Option → `Memos`, in [skupine tabel](./table-groups.md#hiding-groups), skrite z View Option → `Table Groups`, se ne, tudi če je njihov gumb vklopljen, zato `Replace All` nikoli ne prepiše beležke ali preimenuje skupine, ki je ne vidite.

## Možnosti {#options}

Tri stikala v iskalnem polju, na njegovem koncu, spreminjajo, kako se iskalni niz ujema. Njihova imena so navedena v opisih orodij, ko so vklopljena, pa so poudarjena. Vsa tri so sprva izklopljena, sprememba katerega koli od njih pa znova sproži iskanje.

- `Match Case`: ko je stikalo izklopljeno, se ujemanje preverja ne glede na velikost črk.
- `Match Whole Word`: zadetek šteje le tam, kjer se na nobeni strani ne nadaljuje v besedo. Črke, števke in diakritična znamenja katere koli pisave štejejo za besedne znake, prav tako podčrtaj. Zato se `user` ujema v `user id` in `user.id`, ne pa znotraj `users`, `user_id` ali `superuser`. Konec iskalnega niza, ki sam ni besedni znak, kot je pika v `.id`, tam ne potrebuje meje.
- `Use Regular Expression`: iskalni niz je regularni izraz JavaScript, vedno v načinu Unicode, zato `\p{L}` deluje. `^` in `$` se ujemata na začetku in koncu vsake vrstice večvrstičnega komentarja ali beležke, `.` pa ne prestopi preloma vrstice. Ubežna zaporedja, ki se pogosto pišejo v imenih, kot sta `\_` in `\-`, so sprejeta.

Regularni izraz, ki ga ni mogoče razčleniti, kot je `user(`, ne najde ničesar: števec v rdeči barvi prikaže `Invalid regular expression`, iskalno polje pa je obrobljeno z rdečo.  
`Match Case` in `Match Whole Word` veljata tudi za regularni izraz. Zadetek ničelne dolžine, kot je samostojni `^`, ni nikoli naveden.

Navadno besedilo se išče med tipkanjem. Regularni izraz se išče, ko se tipkanje ustavi, ali takoj, ko pritisnete `Enter`, gumb za premikanje, `Replace` ali `Replace All` ali izberete vrstico, ki vsebuje zadetek.  
Iskanje nima časovne omejitve, zato lahko regularni izraz z obsežnim vračanjem pusti urejevalnik neodziven, dokler se ne konča.

Četrto stikalo, `Preserve Case`, je v polju `Replace` na njegovem koncu, zato je prikazano le, ko je vrstica `Replace` razširjena. Sprva je izklopljeno. Ne spremeni ničesar pri tem, kaj se najde, le to, kako `Replace` in `Replace All` zapišeta zamenjavo – glejte razdelek [Zamenjevanje](#replacing). Vklop ali izklop ne sproži iskanja, trenutni zadetek pa ostane trenutni.

## Rezultati {#the-results}

Števec na začetku vrstice pod polji pove, kje ste. Prazen je, dokler je iskalno polje prazno.

| Števec | Kdaj |
| --- | --- |
| `No results` | Nič se ne ujema. |
| `12 matches` | Preden se premaknete na enega od njih; `1 match` za en sam zadetek. |
| `3 of 12` | Trenutni je tretji zadetek. |
| `Invalid regular expression` | Regularnega izraza ni mogoče razčleniti. |
| `Replaced 12 matches` | Ukaz `Replace All` je spremenil toliko zadetkov; `Replaced 1 match` za en sam zadetek. |
| `No changes` | Ukaz `Replace All` ni spremenil ničesar. |
| `No more matches` | Zaporedje pritiskov `Replace` se je vrnilo tja, kjer se je začelo – glejte razdelek [Zamenjevanje](#replacing). |

Sporočila `Replaced …`, `No changes` in `No more matches` se ob naslednjem iskanju ali premiku umaknejo števcu, tudi ob iskanju, ki ga sproži sprememba ali razveljavitev.

Dokler je v iskalnem polju besedilo, [drevo](./explorer.md#the-tree) raziskovalca namesto celotnega diagrama prikazuje rezultate: samo vrstice, ki vsebujejo zadetek, in vrstice nad njimi. Ko se nič ne ujema ali regularnega izraza ni mogoče razčleniti, je prazno. Izbris iskalnega niza vrne celotno drevo, strnjeno tako, kot je bilo prej.

- Mape `Tables`, `Table Groups` in `Memos` so prikazane le, kadar vsebujejo zadetek, število ob vsaki mapi pa je število vrstic neposredno pod njo v rezultatih.
- Pod mapo `Tables` so tabele, ki vsebujejo zadetek, razvrščene po imenu, nikoli po logičnem imenu. Pod vsako tabelo je najprej vrstica za vsak zadetek v njenem komentarju, nato mapa `Columns` s stolpci, ki vsebujejo zadetek, v vrstnem redu stolpcev, vsak z vrstico za vsak zadetek v svojem komentarju, nato pa mapa `Indexes` z indeksi, katerih ime se ujema. Mape `Foreign Keys` ni.
- Pod mapo `Table Groups` so skupine, katerih ime se ujema, razvrščene po imenu, brez svojih tabel. Najdena tabela je prikazana pod mapo `Tables`.
- Pod mapo `Memos` so beležke, ki vsebujejo zadetek, v vrstnem redu dokumenta, vsaka prikazana s svojo prvo vrstico in z vrstico za vsak zadetek v njej.

Zadetek v imenu je poudarjen v vrstici tega imena, zato je ime, ki iskalni niz vsebuje dvakrat, ena vrstica z dvema poudarkoma. Zadetek v logičnem imenu tabele ali stolpca je prav tako v vrstici te tabele ali stolpca, nikoli v svoji vrstici.  
Te vrstice navajajo tabelo ali stolpec z imenom, kot ga prikazuje [prikaz imen](./logical-names.md#beyond-the-canvas), v vsakem od obeh imen, ki ju vrstica lahko prikaže, pa so poudarjeni samo njegovi zadetki. Vrstica, najdena samo v imenu, ki ga njen prikaz izpusti, torej v logičnem imenu v prikazu `Physical Names` ali v imenu v prikazu `Logical Names`, za prikazanim imenom doda še to ime, bledo kot v prikazu `Both Names`, s poudarjenim zadetkom. Kadar zadetek vsebuje tudi prikazano ime, vrstica prikaže samo to ime, zato se zadetki v imenu, ki ga njen prikaz izpusti, štejejo in se po njih lahko premikate, vendar niso poudarjeni.  
Zadetek v komentarju ali beležki ima svojo vrstico: oblaček za komentar tabele ali stolpca oziroma samolepilni listek za beležko, nato izsek besedila s poudarjenim zadetkom. Dolgo besedilo je odrezano z `…`, prelomi vrstic pa so prikazani kot presledki. Za prikaz celotnega besedila premaknite kazalec nad vrstico.  
Vse druge vrstice so videti tako kot zunaj iskanja: stolpec prikazuje svoj podatkovni tip, indeks svoje stolpce, prazno ime pa je prikazano kot `unnamed`.

Ko se iskanje začne, je vsaka vrstica, pod katero so druge vrstice, razširjena. Vrstica, ki jo strnete sami ali jo strne gumb `Collapse All`, ostane strnjena, dokler zadetek pod njo ne postane trenutni ali dokler se ne spremeni iskalni niz, `Match Case`, `Match Whole Word`, `Use Regular Expression` ali vrsta besedila oziroma dokler se iskanje ne odpre znova z bližnjico ali postavko `Toggle Explorer`.  
Vrstica trenutnega zadetka je poudarjena in se pomakne na vidno mesto. Drevo navede vse zadetke, ne glede na to, koliko jih je.  
Premikanje po zadetkih poteka v vrstnem redu drevesa: tabela za tabelo, logično ime, ime in komentar tabele, nato logično ime, ime in komentar vsakega njenega stolpca v vrstnem redu stolpcev, nato imena njenih indeksov; nato imena skupin tabel; nato beležke.

Dokler je raziskovalec prikazan, rezultati sledijo dokumentu. Ko se spreminjanje ustavi, vsaka sprememba preiskovanih besedil znova sproži iskanje, trenutni zadetek pa ostane trenutni, če še obstaja. To zajema urejanje imena, logičnega imena, komentarja ali besedila beležke, dodajanje ali odstranjevanje tabele, stolpca, indeksa, beležke ali skupine tabel, premik stolpca ter skrivanje ali prikazovanje beležk ali skupin tabel z možnostmi pogleda, kar njihove zadetke odstrani iz drevesa ali jih vrne vanj. Šteje vse: sprememba na platnu, razveljavitev ali uveljavitev, uvoz in sprememba sodelavca ali agenta za kodiranje. Izbiranje, premikanje tabel, beležk ali skupin na platnu, pomikanje, spreminjanje povečave in premikanje kazalca nad elemente pa ne.  
Prav tako ne preklop prikaza imen, ki ne spremeni nobenega besedila, ki ga bere iskanje: zadetki ostanejo isti, vrstice pa prevzamejo imena, ki jih prikazuje novi prikaz.  
Spremembe, narejene, ko je raziskovalec zaprt ali ni viden, se upoštevajo v iskanju takoj, ko se znova prikaže.

## Prehod na zadetek {#going-to-a-match}

Tipka `Enter` v iskalnem polju preide na naslednji zadetek, `Shift + Enter` pa na prejšnjega. Enako naredita gumba s puščicama navzgor in navzdol za števcem; njuna opisa orodij sta `Previous Match (Shift+Enter)` in `Next Match (Enter)`, dokler ni nobenega zadetka, pa sta onemogočena.  
Premikanje se na obeh koncih nadaljuje na nasprotnem koncu. Dokler se prvič ne premaknete, noben zadetek ni trenutni, zato prvi `Enter` preide na prvi zadetek, prvi `Shift + Enter` pa na zadnjega.

Klik na vrstico rezultatov ali pritisk tipke `Enter` ali `Space`, ko je na njej fokus tipkovnice, naredi eno od naslednjega:

- Vrstica, ki ima zadetek v svojem imenu ali logičnem imenu, preide na svoj prvi zadetek, najprej v logičnem imenu in šele nato v imenu.
- Vrstica, ki prikazuje izsek komentarja ali beležke, preide na ta zadetek.
- Vsaka druga vrstica, kot je tabela, katere ime in logično ime se ne ujemata, ali lastna vrstica beležke, preide na to, kar vrstica predstavlja, trenutni zadetek pa pusti takšen, kot je – glejte razdelek [Prehod na vrstico](./explorer.md#going-to-a-row).
- Mapa se strne ali razširi.

Kadar koli zadetek postane trenutni, drevo razširi vse strnjene vrstice nad njim in tja premakne vrstico s fokusom tipkovnice, zato puščične tipke v drevesu nadaljujejo od njega.

Prehod na zadetek zapre okno Lastnosti tabele, če je odprto, nato pa:

- Pri imenu, logičnem imenu ali komentarju tabele ali stolpca izbere samo to tabelo, jo postavi v ospredje in fokus premakne na celico, ki vsebuje zadetek. Zadetek v komentarju, skritem z [možnostjo pogleda tabel](./table-related-functions.md#table-view-options), namesto tega premakne fokus na ime ob njem. Kjer [prikaz imen](./logical-names.md#name-view) ne izriše celice za ime ali logično ime, fokus preide na celico, izrisano na njenem mestu: na ime v prikazu `Physical Names`, na logično ime v prikazu `Logical Names`.
- Pri imenu indeksa izbere samo tabelo indeksa in jo postavi v ospredje, fokus pa premakne na ime tabele ali v prikazih `Logical Names` in `Both Names` na njeno logično ime, razen če je celica s fokusom že v tej tabeli. Imena indeksov na platnu niso narisana.
- Pri imenu skupine tabel izbere samo skupino in jo skupaj z njenimi tabelami postavi v ospredje.
- Pri beležki izbere samo beležko in jo postavi v ospredje.

Platno se pomakne le, kadar cilj prehoda še ni dobro viden, povečava pa se nikoli ne spremeni – glejte razdelek [Kam pripelje skok](./table-related-functions.md#where-a-jump-lands).

Po pritisku tipke `Enter` v iskalnem polju kazalka ostane tam, po izbiri vrstice pa fokus tipkovnice ostane v drevesu, zato to, kar vnesete nato, ne doseže izbrane tabele.  
Prehod na zadetek nikoli ne začne ali dokonča risanja relacije.

## Zamenjevanje {#replacing}

Vrstica `Replace` je sprva strnjena. Puščica pred iskalnim poljem, katere opis orodja je `Toggle Replace`, jo razširi in strne. Ko jo strnete, besedilo za zamenjavo ostane.  
Vrstica vsebuje polje `Replace` s stikalom `Preserve Case` na njegovem koncu in dva gumba, katerih opisa orodij sta `Replace (Enter)` in `Replace All`. Dokler ni nobenega zadetka, sta oba gumba onemogočena.

Ukaz `Replace` se izvede s tipko `Enter` v polju za zamenjavo, s tipko `Shift` ali brez nje, ali z njegovim gumbom:

- Ko noben zadetek ni trenutni, prvi pritisk le preide na naslednji zadetek, tako da vidite, kaj bi spremenil, preden se kar koli spremeni.
- Ko je zadetek trenutni, zamenja to eno pojavitev, druge pojavitve v istem besedilu pa pusti, in nadaljuje do naslednjega zadetka za besedilom, ki ga je zapisal. Zapisano besedilo se preskoči, tudi če vsebuje iskalni niz: zamenjava `user` s `super_user` se nato ne ustavi znotraj `super_user`.
- Zadetek, ki bi ga zamenjava zapisala natanko takšnega, kot je bil, ostane nespremenjen, pritisk pa le preide na naslednji zadetek.
- Zamenjava in pomik do naslednjega zadetka sta en korak razveljavitve.

Zaporedje pritiskov `Replace` se ustavi, ko pride naokrog do mesta, kjer se je začelo. Števec prikaže `No more matches`, noben zadetek ni trenutni, nadaljnji pritiski pa ne zamenjajo ničesar.  
Besedilo `Customer`, zamenjano z `Big Customer`, se zato zamenja enkrat, namesto da bi zraslo v `Big Big Customer`.  
Novo zaporedje začne prehod na zadetek, sprememba iskalnega niza, `Match Case`, `Match Whole Word`, `Use Regular Expression` ali vrste besedila, odpiranje iskanja z bližnjico ali postavko `Toggle Explorer` ali ukaz `Replace All`, prav tako pa tudi razveljavitev ali katera koli druga sprememba, ki spremeni besedilo, v katerem se je zaporedje začelo. Sprememba besedila za zamenjavo ali `Preserve Case` ga ne začne, prav tako ga ne začne bližnjica, kadar kazalko le vrne v raziskovalca, ki je že prikazan.  
Dokler zaporedje traja, tabela ali skupina tabel, ki jo preimenuje, obdrži svoje mesto v drevesu in v vrstnem redu zadetkov, zato zaporedje ne naleti znova nanjo, tudi če bi jo preimenovanje uvrstilo pozneje. Naslednje zaporedje drevo spet razvrsti po imenih, preimenovana vrstica pa se premakne na svoje novo mesto.

Ukaz `Replace All` se izvede z bližnjico `Ctrl + Enter` (Windows/Linux) ali `⌘ + Enter` (Mac) v polju za zamenjavo ali z njegovim gumbom:

- Zamenja vse zadetke v vrstah besedila, ki so vklopljene, drugih vrst pa ne spreminja, razen fizičnih imen, ki jih izpelje zamenjano logično ime in ki jih zapiše, tudi ko sta vrsti `Table names` in `Column names` izklopljeni – glejte spodaj. S privzetimi vrstami preimenuje tabele, stolpce, indekse in skupine tabel ter prepiše logična imena tabel in stolpcev, komentarji in beležke pa ostanejo nespremenjeni.
- Vse, kar spremeni, je en korak razveljavitve – glejte razdelek [Ena poteza, en korak](./undo-redo.md#one-gesture-one-step).
- Števec prikaže `Replaced N matches` in pri tem šteje le pojavitve, katerih besedilo se je dejansko spremenilo. Kadar se ni spremenila nobena, prikaže `No changes` in v zgodovino se ne zabeleži nič, kot pri zamenjavi regularnega izraza `(user)` z `$1`.
- Iskanje se nato ponovi brez trenutnega zadetka, zato lahko rezultati navajajo zadetke, ki jih vsebuje novo besedilo.

Oba ukaza prebereta vsako besedilo takšno, kot je ob pritisku, ne takšno, kot ga je našlo zadnje iskanje.

Kako se uporabi besedilo za zamenjavo:

- Ko je stikalo `Use Regular Expression` izklopljeno, znak `$` nima posebnega pomena, besedilo za zamenjavo pa se uporabi tako, kot je vneseno, razen velikosti črk, ki mu jo da `Preserve Case`.
- Ko je stikalo `Use Regular Expression` vklopljeno, se zaporedja od `$1` do `$99`, `$<name>`, `$&`, `` $` ``, `$'` in `$$` razširijo tako kot v metodi JavaScript `String.prototype.replace`.
- Ko je stikalo `Preserve Case` izklopljeno, se velikost črk najdenega besedila ne prenese: ob izklopljenem stikalu `Match Case` zamenjava `user` z `member` spremeni `Users` v `members`.
- Ko je stikalo `Preserve Case` vklopljeno, dobi vsaka zamenjava velikost črk po besedilu, ki ga zamenja, potem ko se razširijo `$1` in druga zaporedja, zato ista zamenjava spremeni `Users` v `Members`:
  - Zadetek, napisan samo z velikimi črkami, dobi zamenjavo samo z velikimi črkami, zadetek, napisan samo z malimi črkami, pa zamenjavo samo z malimi črkami: `USER` z `account` da `ACCOUNT`, `user` z `Account` pa `account`.
  - Pri vsakem drugem zadetku dobi prvi znak zamenjave velikost prvega znaka zadetka, preostanek pa ostane takšen, kot je vnesen: `UserId` z `accountKey` da `AccountKey`, `uSER` z `AccountKey` pa `accountKey`. Kadar prvi znak zadetka ni ne velika ne mala črka, ostane zamenjava takšna, kot je vnesena: `_Ab` z `xyz` da `xyz`.
  - Kadar zadetek in zamenjava oba vsebujeta `-` ali oba vsebujeta `_` in ju to ločilo razdeli na enako število delov, dobi vsak del velikost črk po ustreznem delu: `USER_id` z `account_key` da `ACCOUNT_key`, `User-Name` z `account-key` pa `Account-Key`. Kadar ju na ta način razdelita tako `-` kot `_`, se velikost črk določi za celoto kot za en del.
  - Zadetek brez velikih in malih črk, kot je `123`, pusti zamenjavo takšno, kot je vnesena.
  - Zadetek, zapisan nazaj takšen, kot je bil, se ne šteje: ob izklopljenem stikalu `Match Case` zamenjava `customer` s `Customer` zapiše `customer`, `Customer` in `CUSTOMER` nazaj nespremenjene in noben od njih se ne šteje.
- Prazno polje za zamenjavo zadetek izbriše.

Zamenjava je običajna sprememba, enaka, kot če bi sami vnesli novo ime tabele, ime stolpca, logično ime, komentar ali besedilo beležke, preimenovali indeks v oknu Lastnosti tabele ali preimenovali skupino tabel.  
Zabeleži se v zgodovino ter doseže sodelavce in agenta za kodiranje kot vsaka druga sprememba.

Ime tabele ali stolpca, ki ga zapiše zamenjava, zato postane vaše ime, ki ga pozneje vneseno logično ime pusti nespremenjeno, dokler ga ukaz [Znova izpelji fizična imena](./dictionary.md#derive-physical-names-again) ne vrne v upravljanje slovarjem. Ime, ki ga zamenjava pusti prazno, pa se namesto tega vrne v upravljanje slovarjem, tako kot vsako izbrisano ime – glejte razdelek [Vaša imena](./dictionary.md#names-of-your-own).  
Dokler je fizično ime tabele ali stolpca prazno ali je bilo samo izpeljano, ga zamenjano logično ime izpelje iz slovarjev, tako kot zaprtje celice logičnega imena z novim logičnim imenom – glejte razdelek [Izpeljava fizičnih imen](./dictionary.md#deriving-physical-names). V tem primeru stolpec, katerega novo logično ime je izraz, prevzame tudi domeno izraza in z njo podatkovni tip domene. Kar izpelje, je del koraka razveljavitve zamenjave in se ne šteje v `Replaced N matches`.  
Kadar en ukaz `Replace All` prepiše logično ime in ime iste tabele ali stolpca, ima ime, ki ga zapiše, prednost pred imenom, ki bi ga izpeljalo novo logično ime.

## Tipke v iskalnih poljih {#keys-in-the-search-fields}

- V iskalnem polju `Enter` preide na naslednji zadetek, `Shift + Enter` pa na prejšnjega.
- V polju za zamenjavo `Enter` zamenja, s tipko `Shift` ali brez nje, `Ctrl + Enter` (Windows/Linux) ali `⌘ + Enter` (Mac) pa zamenja vse.
- Medtem ko vnosna metoda v katerem koli od obeh polj sestavlja besedilo, `Enter` pripada sestavljanju ter niti ne premika niti ne zamenjuje.

Kaj v teh poljih naredijo `Escape`, bližnjice urejevalnika, ki še delujejo, in vse druge tipke, je opisano v razdelku [Tipke v raziskovalcu](./explorer.md#keys-in-the-explorer).

## Urejevalniki samo za branje {#read-only-editors}

V urejevalniku z lastnostjo [`readonly`](../../api/erd-editor-element.md#readonly) iskanje samo išče. Ni puščice `Toggle Replace` in ni vrstice `Replace`, zato tudi ni polja za zamenjavo, `Preserve Case`, `Replace` ali `Replace All`.  
Iskalno polje, njegove tri možnosti, vrste besedila, števec, rezultati in prehod na zadetek – vse to deluje. Prehod na zadetek izbere, kar doseže, kot v razdelku [Prehod na zadetek](#going-to-a-match), ta izbor pa je edini, ki ga naredi urejevalnik samo za branje: klik na platno, ki se ne premakne, ga počisti.  
Iskanje odprite s tipko ali s postavko `Toggle Explorer` v hitrem iskanju, saj priročni meni platna tam nima postavke `Toggle Explorer`. Preostanek raziskovalca je opisan v razdelku [Urejevalniki samo za branje](./explorer.md#read-only-editors) na strani o raziskovalcu.

V VS Code se revizija diagrama, kot je revizija Git ali vnos v Local History, odpre kot besedilo JSON. Ko jo z ukazom `Reopen Editor With...` znova odprete kot diagram, je samo za branje in dobi to iskanje brez zamenjave.

## Spreminjanje bližnjice {#changing-the-shortcut}

Stran, ki vdela urejevalnik, lahko dodelitev `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) pod imenom `findReplace` z metodo [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) spremeni ali odstrani.  
Ko je dodelitev odstranjena, je tipka na vsakem zavihku prepuščena strani. Gumb `Explorer` v orodni vrstici še vedno odpira in zapira raziskovalca, postavka `Toggle Explorer` v hitrem iskanju in v priročnem meniju platna pa še vedno odpre iskanje ali zapre raziskovalca, vendar ob nobenem od njih ni prikazana bližnjica, zato je opis orodja gumba samo `Explorer`. Tudi vrstica `Toggle Explorer` na zavihku [Bližnjice](./settings.md#shortcuts) v nastavitvah ne prikazuje nobene tipke. Po spremembi dodelitve vsi prikazujejo novo tipko.
