---
sidebar_position: 3
description: Kako se strežnik MCP odloči med urejanjem v živo v urejevalniku (VS Code, Obsidian ali razvojno okolje JetBrains) in urejanjem datoteke na disku ter kaj v vsakem od obeh načinov naredijo shranjevanje, razveljavitev in zaprt urejevalnik.
---

# V živo in brez vmesnika

Ob vsakem klicu strežnik poišče urejevalnik, ki ima dokument, in sicer prek zaklepnih datotek, ki jih urejevalniki hranijo v `~/.erd-editor/ide/`.
Vsako okno VS Code in vsako okno trezorja aplikacije Obsidian z urejevalnikom ERD Editor hrani eno, razvojno okolje JetBrains pa eno za celotno razvojno okolje, v kateri so navedeni vsi projekti, ki so odprti v njem.
Urejevalnik ob zaprtju odstrani svojo zaklepno datoteko.
Od tega, kaj strežnik najde, je odvisno, kam gre sprememba.

| Kaj najde | Kaj naredi sprememba |
| --- | --- |
| Urejevalnik, katerega delovni prostor, trezor ali odprt projekt vsebuje dokument ali ki ima dokument odprt | **V živo.** Po potrebi odpre dokument v urejevalniku ERD Editor, se pridruži seji urejanja in tam izvede spremembo. Spremembe se prikažejo takoj in se shranijo tako, kot urejevalnik shranjuje vaše – glejte razdelek [Shranjevanje](#saving). |
| Ni urejevalnika | **Brez vmesnika.** Naloži datoteko, izvede spremembo in zamenja datoteko, preden odgovori, zato rezultat navaja `saved: true`, orodje `erd_save` pa nima česa narediti. |
| Urejevalnik z izklopljenim središčem | **Zavrnjeno.** Branje še vedno deluje, in sicer z diska. Sprememba, ki bi se mimo odprtega urejevalnika zapisala v datoteko, bi se lahko ob njegovem naslednjem shranjevanju prepisala, zato strežnik ne zapiše ničesar. |
| Urejevalnik z vklopljenim središčem, ki pa uporablja drug protokol kot strežnik: pri strežniku različice `1.0.0` ali novejše razširitev za VS Code različice `3.x`, vtičnik za Obsidian različice `0.x` ali vtičnik za JetBrains različice `0.9.0` ali `0.10.0`; pri strežniku pred različico `1.0.0` razširitev različice `4.0.0` ali novejše ali vtičnik različice `1.0.0` ali novejše | **Zavrnjeno**, vključno z branjem, s kodo `protocolMismatch`. Sporočilo navede stran, ki jo je treba posodobiti: razširitev ali vtičnik ali pa strežnik – glejte razdelek [Posodabljanje](./installation.md#updating). |
| V sistemu Windows urejevalnik, ki ima dokument pod drugo potjo do iste datoteke: agent ga je navedel prek omrežne skupne rabe ali preslikanega pogona tega računalnika, kot je `\\localhost\C$\…`, urejevalnik pa ga ima pod potjo s črko pogona, ali obratno | **Zavrnjeno**, vključno z branjem, s kodo `invalidPath`. Sporočilo navede pot, pod katero ima urejevalnik dokument; pokličite znova s to potjo. |
| V sistemu Windows urejevalnik, do katerega Windows agentu ne dovoli dostopa: urejevalnik, ki je bil zagnan kot skrbnik, agent pa ne, ali kateri koli urejevalnik, ko agent teče v peskovniku | **Zavrnjeno**, vključno z branjem, s kodo `hubUnreachable` in sporočilom, ki pove, zakaj. Urejevalnik in agenta zaženite z enakimi pravicami, na primer tako, da urejevalnik znova zaženete brez skrbniških pravic. |

Rezultat spremembe navede način, v katerem je bila izvedena, `live` ali `headless`, zavrnjena sprememba pa pove, zakaj.
Iskanje se izvede znova ob vsakem klicu, zato odpiranje ali zapiranje urejevalnika ustrezno preusmeri naslednji klic.

Ko je dokument pri več urejevalnikih, ima tisti, pri katerem je dokument odprt, prednost pred tistim, ki samo streže mapo z dokumentom, med tistimi, ki strežejo mapo, pa ima prednost tisti, katerega mapa leži najgloblje.
Pri izenačenju, na primer ko imata dokument odprt dva urejevalnika, ima prednost tisti, katerega zaklepna datoteka se je spremenila nazadnje.
Dokument v trezorju aplikacije Obsidian znotraj mape delovnega prostora VS Code zato pripade aplikaciji Obsidian, razen če ga ima VS Code odprtega, Obsidian pa ne.

Klici za isti dokument se izvajajo eden za drugim, v vrstnem redu, v katerem so prispeli do strežnika. Klici za različne dokumente se izvajajo vzporedno.

## V živo {#live}

Agent se urejevalniku pridruži kot še en sodelavec.
Njegove spremembe takoj dosežejo vsak urejevalnik, v katerem je dokument odprt, njegov fokus pa se prikaže na tabeli in celici, ki ju ureja, tako kot fokus sodelavca – glejte razdelek [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Branje nikoli ne odpre urejevalnika. Sprememba odpre dokument v urejevalniku ERD Editor, če še ni odprt, ne da bi prevzela fokus tipkovnice.

Urejevalnik z razširitvijo za VS Code pred različico `4.2.0` ali vtičnikom za Obsidian ali JetBrains pred različico `1.2.0` še vedno sprejema spremembe agenta v živo, vendar logičnih imen, povezav z domeno in vrstic slovarjev, ki jih zapiše agent, niti ne prikaže niti ne ohrani – glejte razdelek [Posodabljanje](./installation.md#updating).

### Shranjevanje {#saving}

Vsak urejevalnik shranjuje spremembe agenta tako, kot shranjuje vaše.

V VS Code spremembe agenta tako kot vaše označijo zavihek kot neshranjen, na disk pa pridejo šele, ko se dokument shrani.
Orodje `erd_save` ga shrani prek VS Code, tako kot njegov lastni ukaz za shranjevanje. Namesto tega ga lahko shranite sami z bližnjico `Ctrl + S` (Windows/Linux) ali `⌘ + S` (Mac).
Ob zaprtju urejevalnika z neshranjenimi spremembami agenta se prikaže vprašanje, ali naj se shranijo, tako kot pri vsaki drugi neshranjeni spremembi.

Aplikacija Obsidian shrani spremembe agenta približno dve sekundi po koncu urejanja, zaprtje zavihka pa jih shrani brez vprašanja.
Razvojno okolje JetBrains jih zapiše delček sekunde po koncu urejanja, zaprtje zavihka pa zapiše, kar še čaka; zavihek se nikoli ne prikaže kot spremenjen.
V obeh jih orodje `erd_save` zapiše takoj.

Orodje `erd_save` najprej počaka do dve sekundi, da ima urejevalnik vse spremembe, ki jih je naredil agent.
Zavrne se s kodo `notSaved`, ko urejevalnik tega ni mogel potrditi ali datoteke ni zapisal: VS Code pusti zavihek neshranjen, če se je datoteka na disku spremenila, razvojno okolje JetBrains pa je ni moglo zapisati, na primer ko je bilo odprto pogovorno okno ali ko datoteke ni mogoče zapisati.

V VS Code in v razvojnem okolju JetBrains orodje `erd_save` pri dokumentu, v katerem ni več ničesar za shranjevanje, uspe in pusti datoteko, kakršna je.
Tako je, ko so shranjene vse spremembe, kar razvojno okolje JetBrains naredi samodejno, in tako ostane, dokler je vsaka poznejša sprememba taka, ki je [zaklep](../guide/guides/settings.md#lock) ne spusti v datoteko, na primer pomikanje ali spreminjanje povečave, ko je nastavitev `Viewport` zaklenjena, preklapljanje zavihkov, ko je nastavitev `Canvas Type` zaklenjena, ali preklapljanje [prikaza imen](../guide/guides/logical-names.md#name-view), ko je nastavitev `Name View` zaklenjena. Vsi zaklepi so privzeto vklopljeni.
Pri datoteki, ki je razvojno okolje JetBrains ne more zapisati, sledi zavrnitev tudi takrat.

Ko urejevalnik po zadnji spremembi agenta zapre dokument, naslednji klic agenta vsebuje opombo, da so te spremembe v datoteki le, če so bile shranjene, preden se je urejevalnik zaprl.

### Razveljavitev {#undo}

Orodje `erd_undo` razveljavi zadnjo spremembo, ki jo je naredil agent, nikoli vaše, orodje `erd_redo` pa jo znova uveljavi.
Lastna [razveljavitev](../guide/guides/undo-redo.md) urejevalnika deluje obratno: razveljavi vaše spremembe in nikoli sprememb agenta, ker se spremembe, ki pridejo iz drugega urejevalnika, ne beležijo v vašo zgodovino.

Nekaj sprememb v urejevalniku ne ustvari vnosa za razveljavitev: `erd_set_database` in `erd_set_database_name` med [orodji za nastavitve](./tools.md#settings) ter `erd_resize_memo`.
Prav tako ga ne ustvari klic `erd_move_table_group`, ki skupino premakne za manj kot 20 slikovnih pik, pri čemer se vodoravni in navpični premik seštejeta, čeprav skupina ostane tam, kamor se je premaknila.
Vnosa ne ustvari niti klic, ki ničesar ne spremeni: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` ali `erd_set_index_column_order`, ki nastavi vrednost, ki jo dokument že ima; `erd_add_index_column` s stolpcem, ki je že v indeksu; `erd_set_table_group` s tabelami, ki so že v tej skupini (ali že v nobeni, z vrednostjo `null` argumenta `groupId`); `erd_move_table_group` na točko, kjer skupina že stoji; `erd_resize_table_group` na pravokotnik, ki ga skupina že ima; `erd_sort_tables` pri dokumentu brez tabel; `erd_set_table_logical_name` ali `erd_set_column_logical_name` z logičnim imenom, ki ga tabela ali stolpec že ima, kadar izpeljava iz njega ne bi ničesar spremenila; `erd_set_column_domain` z domeno, s katero je stolpec že povezan, kadar stolpec že ima tip te domene in [sinhronizacija tipa podatkov v relacijah](../guide/guides/settings.md#relationship-datatype-sync) ne bi spremenila tipa nobenega stolpca po njegovih relacijah; `erd_update_word`, `erd_update_term` ali `erd_update_domain` samo z vrednostmi, ki jih vrstica že ima, razen če izraz, ki nima fizičnega imena, prejme argument `name` in njegove besede sestavijo fizično ime; `erd_derive_physical_names`, kadar vsako ime, ki ga zajame in ima logično ime, že vsebuje to, kar mu dajo [slovarji](./tools.md#dictionaries), in je označeno kot izpeljano; ali uvoz z vrednostjo `append` argumenta `mode`, ki ne prinese nobene tabele (pri `erd_import_json` nobene tabele in nobene beležke).
Orodje `erd_undo` jih preskoči in jih navede v svojem rezultatu.
Druge spremembe, kot so `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` in `erd_set_ddl_script`, ustvarijo vnos tudi takrat, ko nastavijo vrednost, ki jo dokument že ima.

Zgodovina razveljavitev agenta se konča, rezultat pa to navede v opombi, v naslednjih primerih:

- Agent se znova pridruži dokumentu, na primer potem ko ga je urejevalnik izključil iz dokumenta.
- Urejevalnik se zapre ali pa zapre dokument in ga neha streči, agent pa nadaljuje urejanje datoteke na disku.
- Urejevalnik prevzame dokument, ki ga je agent urejal na disku.

Strežnik zapre tudi dokument, za katerega agent 30 minut ni opravil nobenega klica, z njim pa brez opombe izgine tudi zgodovina razveljavitev.

### Ko urejevalnika ni več {#when-the-editor-goes-away}

Dokler je dokument pri urejevalniku, strežnik nikoli sam od sebe ne preklopi na datoteko.
Če se povezava prekine, se znova poveže.
Šele ko se je urejevalnik zaprl ali je zaprl dokument in ne navaja več niti njega niti mape, v kateri je, strežnik preide na urejanje datoteke in to navede v rezultatu.
To se zgodi, ko zaprete diagram, ki leži zunaj vseh map, ki jih urejevalnik streže (v VS Code diagram, odprt izven delovnega prostora), ko v aplikaciji Obsidian izklopite vtičnik ERD Editor in ko v razvojnem okolju JetBrains zaprete projekt, ki vsebuje dokument, ali tam izklopite vtičnik.
Zaprt diagram v mapi, ki jo urejevalnik streže, ostane pri urejevalniku, naslednja sprememba agenta pa ga znova odpre.

Urejevalnik, ki še vedno teče, vendar njegove zaklepne datoteke ni več in se je njegova povezava zaprla, ne da bi zaprl dokument, zavrne naslednjo spremembo s kodo `hubGone`.
Sporočilo pove, kaj sprosti dokument: v VS Code znova naložite to okno ali ga zaprite, da bo agent lahko neposredno urejal datoteko; v aplikaciji Obsidian znova vklopite vtičnik ERD Editor ali zaprite to okno; v razvojnem okolju JetBrains znova vklopite vtičnik ali zaprite razvojno okolje.

Branje namesto tega poteka iz datoteke na disku, z opombo, da manjkajo spremembe, ki v urejevalniku še niso shranjene, in sicer v dveh primerih: ko je središče urejevalnika, ki ima dokument, izklopljeno, in v zgornjem primeru `hubGone`.
Branje, ki se ne more povezati s središčem urejevalnika, se zavrne s kodo `hubUnreachable`, tako kot sprememba.

## Brez vmesnika {#headless}

Ko dokumenta ne streže noben urejevalnik, vsako urejanje naloži datoteko, izvede spremembo in datoteko zapiše nazaj, preden odgovori, zato njegov rezultat navaja `saved: true` – glejte razdelek [Rezultati](./tools.md#results).
Zapis gre v začasno datoteko poleg dokumenta, imenovano `.<name>.<id>.tmp`, ki nato zamenja dokument, zato dokument nikoli ne ostane napol zapisan, razen v sistemu Windows v spodaj opisanem primeru zapisa na mestu.

Pred tem zadnjim korakom strežnik preveri, ali se je datoteka med klicem na disku spremenila.
Če se je, se nič ne zapiše, datoteka se znova naloži, klic pa se zavrne s kodo `conflict`. Agent pokliče znova.
Datoteka, ki se je spremenila med dvema klicema, se preprosto znova naloži, zgodovina razveljavitev agenta pred tem pa se zavrže.

Datoteka samo za branje ostane nespremenjena, sprememba pa se zavrne s kodo `readonly`: to je datoteka, pri kateri lastnik nima dovoljenja za pisanje, ali v sistemu Windows datoteka z atributom samo za branje, na primer datoteka v sistemu Perforce ali TFVC, ki ni izvlečena.
Omogočite pisanje vanjo in nato pokličite znova. Branje še vedno deluje.

Če urejevalnik začne streči dokument, medtem ko ga agent ureja na disku, se ta ena sprememba zavrne s kodo `hubAppeared` in se nič ne zapiše. Naslednji klic ureja prek urejevalnika.

V sistemu Windows veljata še dve pravili:

- Dokument z lastnimi dovoljenji, drugačnimi od dovoljenj njegove mape, se namesto zamenjave zapiše na mestu, da jih obdrži, začasna datoteka pa se nato odstrani. Program, ki med tem zapisovanjem bere dokument, lahko naleti na besedilo, ki ga ni mogoče razčleniti.
- Datoteke, ki jo ima odprto drug program, ni mogoče zamenjati, zato strežnik poskuša znova največ dve sekundi. Vsak poskus najprej znova poišče urejevalnik, urejevalnik, ki je medtem začel streči dokument, pa zapis zavrne s kodo `hubAppeared` ali, ko je njegovo središče izklopljeno, s kodo `blocked`. Če je datoteka po dveh sekundah še vedno zasedena, se nič ne zapiše, datoteka se znova naloži, klic pa ne uspe s sporočilom, ki navaja sistemsko napako.

Strežnik pred različico `1.1.0` prebere dokument brez njegovih logičnih imen, povezav njegovih stolpcev z domeno ter njegovih besed, izrazov in domen, zato jih prva sprememba, ki jo zapiše v datoteko, izpusti. Posodobite strežnik – glejte razdelek [Posodabljanje](./installation.md#updating).

## Zavrnjeno {#refused}

Okno VS Code obdrži svojo zaklepno datoteko tudi takrat, ko je njegovo središče izklopljeno: ko je nastavitev `dineug.erd-editor.agentHub.enabled` izklopljena, ko delovni prostor ni zaupanja vreden ali ko njegovo središče ni moglo začeti poslušati.
Okno trezorja v aplikaciji Obsidian obdrži svojo zaklepno datoteko z izklopljenim središčem, ko je nastavitev Coding agents izklopljena in ko njegovo središče ni moglo začeti poslušati.
Razvojno okolje JetBrains obdrži svojo zaklepno datoteko z izklopljenim središčem, ko je nastavitev Coding agents izklopljena, ko njegovo središče ni moglo začeti poslušati in medtem ko se razvojno okolje zapira.

Sprememba takega dokumenta se zavrne s kodo `blocked`, ker bi odprt urejevalnik ob naslednjem shranjevanju lahko prepisal spremembo, zapisano v datoteko.
Branje še vedno deluje, in sicer iz datoteke na disku.

Da bo agent lahko urejal, znova vklopite središče, kot za ta urejevalnik pove sporočilo: v VS Code zaupajte delovnemu prostoru in vklopite nastavitev ali znova naložite okno; v aplikaciji Obsidian vklopite Coding agents ali znova naložite aplikacijo Obsidian; v razvojnem okolju JetBrains vklopite Coding agents ali, če je ta nastavitev že vklopljena, znova zaženite razvojno okolje.

Razvojno okolje JetBrains s kodo `hubDisabled` zavrne tudi spreminjanje dokumenta, ki je samo v projektih, ki jim ne zaupa.
Agenti lahko tak dokument še vedno berejo, orodje `erd_list_documents` pa ga navede kot `readonly`. Zaupajte projektu in nato pokličite znova.

Urejevalnik, ki ne hrani zaklepne datoteke, ne varuje ničesar, agent pa ureja datoteko na disku, tudi ko je diagram odprt v njem.
Tako je pri aplikaciji Obsidian ali razvojnem okolju JetBrains, nameščenem kot Flatpak v sistemu Linux, pri razvojnem okolju JetBrains brez JCEF in pri razvojnem okolju JetBrains, katerega središče se ni moglo zagnati – glejte razdelka [Nastavitev aplikacije Obsidian](./installation.md#set-up-obsidian) in [Nastavitev razvojnega okolja JetBrains](./installation.md#set-up-a-jetbrains-ide).
Zaklepne datoteke ne hranita niti razširitev za VS Code pred različico `3.0.0` niti vtičnik za JetBrains pred različico `0.9.0`, saj nimata središča.

## Dokumenti {#documents}

Dokument se navede s potjo `path`, absolutno ali relativno glede na delovni imenik strežnika.

- Novi dokumenti so datoteke `.erd.json`. Orodje `erd_open_document` z argumentom `create` ustvari datoteko in imenu brez končnice doda `.erd.json`. Tako kot nov diagram v urejevalniku ima nov dokument vklopljene vse [zaklepe](../guide/guides/settings.md#lock), zato pomikanje, spreminjanje povečave, preklapljanje zavihkov, preklapljanje prikaza imen ali izbira drugega jezika generatorja kode, zapisa imen ali vrste narekovajev v urejevalniku nikoli ne spremeni datoteke. Nobeno orodje ne vklopi ali izklopi posameznega zaklepa: to naredite v urejevalniku na zavihku Nastavitve. Orodje `erd_import_json` v načinu `replace` jih vse zamenja z zaklepi dokumenta, ki ga naloži – glejte razdelek [Uvoz](./tools.md#import).
- Odprejo se tudi obstoječe datoteke `.erd`, `.vuerd` in `.vuerd.json`. Pot s katero koli drugo končnico se zavrne s kodo `invalidPath`.
- V sistemu Windows se pot z imenom, ki ga Windows ne shrani tako, kot je zapisano, zavrne s kodo `invalidPath`, preden se dokument prebere ali zapiše, vključno z branjem: ime z dvopičjem ali drugim znakom, ki ga Windows zavrne, kot je `orders:v2.erd`; ime naprave, kot je `NUL.erd` ali `CON.erd`, ne glede na velikost črk; ali ime, ki se konča s piko ali presledkom. Preimenujte ga, na primer z znakom `-` namesto `:`.
- Datoteka, ki ni dokument, ki ga urejevalnik lahko prebere, na primer datoteka, v kateri so ostale oznake konfliktov pri spajanju, se zavrne s kodo `invalidDocument` in ostane nespremenjena. Nikoli se ne naloži kot prazen diagram in ne zapiše nazaj.

Agent dokument spreminja samo prek orodij in ima navodilo, naj datoteke nikoli ne zapisuje sam.

Orodje `erd_list_documents` navede dokumente s polji `path`, `open`, `active`, `dirty` in `readonly`.
Vpraša urejevalnik, ki streže delovni imenik in je izbran tako kot pri dokumentu, ter navede diagrame, odprte v njem, nato pa datoteke ERD, ki jih streže: tiste v mapah delovnega prostora okna VS Code, v trezorju aplikacije Obsidian ali v vseh projektih, odprtih v razvojnem okolju JetBrains.
Sicer navede datoteke ERD v delovnem imeniku, pri čemer je datoteka samo za branje označena kot `readonly`, ime, ki ga Windows ne shrani tako, kot je zapisano, pa je v sistemu Windows izpuščeno.
