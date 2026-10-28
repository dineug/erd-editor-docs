---
sidebar_position: 3
description: Pridávanie, výber, zmena poradia a odstraňovanie stĺpcov, prepínanie možností stĺpcov a kopírovanie alebo prilepovanie stĺpcov.
---

# Úprava tabuliek

Úprava tabuliek v zásade ponúka podobný spôsob úprav ako Excel.  
[Zobrazenie názvov](./logical-names.md#name-view) určuje, či tabuľka vo svojej hlavičke a riadkoch vykresľuje názvy, logické názvy alebo oba.  
Režim úprav sa spustí klávesom `Enter` alebo dvojitým kliknutím na bunku.  
Ukončí ho kláves `Enter` alebo `Escape`. To, čo píšete, sa použije už počas písania, takže kláves `Escape` text ponechá, namiesto aby ho vrátil do pôvodného stavu. Výnimkou je [bunka domény](./logical-names.md#the-domain-cell): iba vyberá zo svojho zoznamu a nikdy neponechá to, čo napíšete. Zatvorenie [bunky logického názvu](./logical-names.md#writing-a-logical-name) na zmenenom logickom názve môže doplniť aj fyzický názov.  
Kláves `Escape` ponechá bunku aktívnu a tabuľku vybratú, druhé stlačenie klávesu `Escape` zruší oboje. Kým bunka logického názvu zobrazuje svoj [zoznam termínov](./logical-names.md#completing-term-names), prvé stlačenie klávesu `Escape` zavrie iba zoznam.  
Kým metóda vstupu ešte skladá znaky, kláves `Escape` režim úprav neukončí.

![Pridanie tabuľky pomocou Alt + N a vyplnenie dvoch stĺpcov](/img/demo-table-edit.webp)

## Pridávanie stĺpcov {#adding-columns}

Vytvárajú sa klávesovou skratkou `Alt + Enter` (Windows/Linux) alebo `⌥ + Enter` (Mac), ktorá pridá stĺpec do každej vybratej tabuľky, alebo tlačidlom `+` v záhlaví tabuľky, ktoré ho pridá do tejto tabuľky.  
Prvá bunka nového stĺpca získa fokus, a to prvá, ktorú jeho riadok vykresľuje v [poradí stĺpcov](./settings.md#adjusting-column-order). V predvolenom poradí je to jeho názov, ktorým je v zobrazení `Logical Names` jeho logický názov a v zobrazení `Both Names` jeho bunka `Logical Name` – pozrite si časť [Zobrazenie názvov](./logical-names.md#name-view).  
Stĺpec pridaný klávesom `Tab` z poslednej bunky a primárny kľúč, ktorý pridá nakreslenie vzťahu do nadradenej tabuľky, ktorá žiadny nemá, začínajú tiež na tejto bunke.

## Kláves Tab {#tab-key}

Stlačením klávesu `Tab` prejdete priamo do režimu úprav nasledujúcej bunky.  
Stlačenie klávesu `Tab` v poslednej bunke vytvorí nový stĺpec a otvorí jeho prvú bunku na úpravy – pozrite si časť [Pridávanie stĺpcov](#adding-columns).  
Pomocou `Shift + Tab` prejdete do režimu úprav predchádzajúcej bunky.  
Klávesy `Tab` a `Shift + Tab` prechádzajú bunkami, ktoré tabuľka vykresľuje, v ich poradí, takže to, či sú medzi nimi aj bunky logického názvu a bunky domény, určujú Zobrazenie názvov a možnosť View Option → `Domain` – pozrite si časť [Zápis logického názvu](./logical-names.md#writing-a-logical-name).  
Označenia [alternatívneho kľúča](./table-related-functions.md#alternate-keys) vykreslené za poslednou bunkou riadka nie sú bunky, takže ich fokus klávesnice preskočí a nikdy sa neotvoria na úpravu.

![Prechod klávesom Tab cez bunky riadka, pridanie stĺpca z poslednej bunky a návrat pomocou Shift + Tab](/img/demo-table-tab.webp)

## Automatické dopĺňanie typu údajov {#datatype-autocomplete}

Začnite upravovať bunku `DataType` a píšte. Navrhnú sa zodpovedajúce typy z vybratej databázy a časť návrhu, ktorá doslova obsahuje to, čo ste napísali, sa zvýrazní.  
Samotná zhoda je približná, takže `vch` nájde aj `VARCHAR`.

- `Arrow Up` alebo `Arrow Down`: pohyb medzi návrhmi
- `Arrow Right`, `Tab` alebo `Enter`: prijatie zvýrazneného návrhu
- `Arrow Left`: návrat k textu, ktorý ste napísali

Na návrh môžete aj kliknúť.  
Zoznam zobrazuje naraz najviac desať návrhov a ostatné sú dostupné posúvaním.  
Nič sa nevynucuje, takže typ, ktorý v zozname nie je, sa dá voľne napísať vrátane argumentov, napríklad `VARCHAR(255)`. Zoznam sa zavrie, keď to, čo píšete, presiahne celý názov typu, ako je to pri `VARCHAR(255)` alebo `BIGINT UNSIGNED`.  
Návrhy sa riadia vybratou databázou. Zmena databázy zmení to, čo sa ponúka, a existujúce stĺpce ponechá tak, ako sú.

Písanie do bunky `DataType` stĺpca prepojeného s doménou alebo prijatie návrhu v nej odpojí stĺpec od domény, len čo sa jeho typ líši od typu domény – pozrite si časť [Domény a typy údajov](./dictionary.md#domains-and-data-types).  
V zobrazení `Logical Names`, kým je možnosť View Option → `Domain` vypnutá, zobrazuje bunka typu stĺpca prepojeného s pomenovanou doménou názov domény a jej úprava otvorí namiesto týchto návrhov [výber domény](./logical-names.md#the-domain-cell). Bunka typu, ktorá zobrazuje typ údajov, ho upravuje tak, ako je opísané vyššie.

![Vyplnenie buniek DataType z približných návrhov pomocou klávesov so šípkami, Tab a Enter](/img/demo-data-type-autocomplete.webp)

## NOT NULL, Jedinečný, Automatický prírastok {#not-null-unique-auto-increment}

Tieto tri bunky nie sú text, ale prepínače.  
Bunku prepnete dvojitým kliknutím alebo stlačením klávesu `Enter`, keď je na nej fokus.

Bunka NOT NULL zobrazuje `N-N`, keď je nastavená, a `NULL`, keď nie je.  
Označenia `UQ` a `AI` sú vo vypnutom stave stlmené a v zapnutom stave zvýraznené.

![Prepnutie NOT NULL dvojitým kliknutím a príznakov Jedinečný a Automatický prírastok klávesom Enter](/img/demo-column-options.webp)

Bunky skryté [možnosťami zobrazenia tabuliek](./table-related-functions.md) sa nedajú prepnúť.

## Výber viacerých stĺpcov {#selecting-multiple-columns}

Podporuje päť spôsobov:

- `Shift + Arrow Up/Down`: rozšírenie výberu vždy o jeden riadok
- `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac): pridanie jedného stĺpca
- `Shift + click`: výber rozsahu od stĺpca, ktorý bol naposledy aktívny
- `Ctrl + Shift + click` (Windows/Linux) alebo `⌘ + Shift + click` (Mac): pridanie tohto rozsahu do výberu
- `Alt + A` (Windows/Linux) alebo `⌥ + A` (Mac): výber všetkého

![Výber stĺpcov pomocou Shift + Arrow Down, Ctrl/⌘ + click, Shift + click a Alt + A](/img/demo-column-select.webp)

Ak chcete vybraté stĺpce presunúť spolu, presuňte myšou úchyt vedľa aktívneho stĺpca – pozrite si časť [Zmena poradia a presúvanie stĺpcov](#rearranging-and-moving-columns).

Kliknutie pravým tlačidlom na riadok stĺpca určí, na ktoré stĺpce sa použije kontextová ponuka tabuľky, bez ohľadu na to, aký modifikačný kláves držíte.  
Na riadku, ktorý už je vybratý, sa výber zachová a fokus sa presunie na tento riadok. Na akomkoľvek inom riadku sa vyberie iba tento riadok. Platí to kdekoľvek na riadku vrátane ikony kľúča a označenia [alternatívneho kľúča](./table-related-functions.md#alternate-keys).  
Ak teda chcete položku ponuky použiť na viacero stĺpcov, ako v častiach [Primárny kľúč stĺpca](#column-primary-key) alebo [Odstraňovanie stĺpcov](#column-deletion), kliknite pravým tlačidlom na jeden z vybratých riadkov.  
Na Macu ponuku otvorí aj `Ctrl + click`, počíta sa však ako obyčajné kliknutie, takže na bunke vyberie iba jej riadok ešte predtým, ako sa ponuka otvorí.

## Zmena poradia a presúvanie stĺpcov {#rearranging-and-moving-columns}

Stĺpec sa presúva pomocou úchytu na presúvanie, malého tlačidla so symbolom úchytu, ktoré sa nachádza tesne za ľavým okrajom tabuľky vedľa aktívneho riadka.  
Presuňte fokus na ktorúkoľvek bunku stĺpca kliknutím na ňu, klávesmi so šípkami alebo klávesom `Tab` a vedľa jej riadka sa zobrazí úchyt. Kým je fokus na hlavičke tabuľky, žiadny riadok úchyt nemá.  
Úchyt je vykreslený nevýrazne, kým naň nepresuniete ukazovateľ, a ukazovateľ sa potom zmení na ruku. Samotné stlačenie nemá žiadny účinok: presúvanie sa začne, až keď sa ukazovateľ pohne, a môže stĺpec presunúť na iné miesto v jeho tabuľke alebo do inej tabuľky.  
Nad riadkami tabuľky sa presúvané riadky posúvajú na miesto a riadky okolo miesta pustenia sa odsunú nabok, aby uvoľnili miesto. Nad prázdnym plátnom alebo nad hlavičkou tabuľky, ktorá má stĺpce, sa za ukazovateľom pohybuje priesvitná kópia riadkov, ktorá zobrazuje bunky názvu a typu každého riadka tak, ako ich riadok vykresľuje v aktuálnom [Zobrazení názvov](./logical-names.md#name-view).  
Ak stĺpec pustíte tesne pod posledný riadok tabuľky, presunie sa na koniec tejto tabuľky. Tabuľka bez stĺpcov prijme stĺpec pustený kdekoľvek na nej. Pás tesne vľavo od tabuľky, kde sa nachádza úchyt, sa tiež počíta ako riadky tabuľky, takže ťahaním priamo nadol pozdĺž úchytu zmeníte poradie stĺpcov bez toho, aby ukazovateľ vstúpil do tabuľky.  
Stĺpec presunutý do inej tabuľky si ponechá svoj logický názov aj doménu.

![Presunutie fokusu na stĺpec a presunutie úchytu vedľa jeho riadka myšou na novú pozíciu, potom presunutie úchytu ďalšieho stĺpca do inej tabuľky](/img/demo-column-move.webp)

Ak chcete presunúť viacero stĺpcov naraz, [vyberte ich](#selecting-multiple-columns) a presuňte myšou úchyt vedľa aktívneho stĺpca. Kým je aktívny stĺpec jedným z dvoch alebo viacerých vybratých stĺpcov svojej tabuľky, úchyt prenáša všetky tieto stĺpce, inak prenáša iba vlastný stĺpec.  
Nie je potrebný žiadny modifikačný kláves. Podržanie klávesu `Alt` (Windows/Linux) alebo `⌥` (Mac) na úchyte presunie stĺpce rovnako ako obyčajné presúvanie a nič neduplikuje.

![Výber troch stĺpcov a potom presunutie úchytu vedľa aktívneho stĺpca do inej tabuľky, pričom sa s ním presúvajú aj ostatné vybraté stĺpce](/img/demo-column-multi-move.webp)

Presúvanie, ktoré sa začne na riadku stĺpca, a nie na jeho úchyte, presúva tabuľku rovnako ako presúvanie za jej hlavičku – pozrite si časť [Presúvanie viacerých tabuliek](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) alebo `⌥ + drag` (Mac) na riadku duplikuje tabuľku – pozrite si časť [Duplikovanie tabuliek a poznámok](./table-related-functions.md#duplicating-tables-and-memos).  
Pri priblížení `70%` a nižšom, pri ktorom tabuľky zobrazujú iba svoje názvy, ani v editore iba na čítanie sa úchyt nevykresľuje, takže poradie stĺpcov sa tam zmeniť nedá.  
Ťahanie stĺpca, ktoré prebieha, keď sa editor prepne do režimu iba na čítanie, sa okamžite skončí: kópia sledujúca ukazovateľ a zatvorená ruka zmiznú a pustenie neprenesie žiadny stĺpec. Riadky, ktoré ťahanie už presunulo, zostanú tam, kam ich presunulo.

## Odstraňovanie stĺpcov {#column-deletion}

Odstráni vybraté stĺpce aktívnej tabuľky. Kliknutie na bunku vyberie jej stĺpec, takže kliknutím na bunku a stlačením klávesu `Delete` odstránite práve tento jeden stĺpec.  
Klávesové skratky:

- `Delete` alebo `Backspace`. Tieto klávesy odstránia vybraté stĺpce, kým je ich tabuľka jediným vybratým objektom. Ak nie je vybratý žiadny stĺpec (fokus je na názve, [logickom názve](./logical-names.md#name-view) alebo komentári tabuľky), ak je zároveň vybraté čokoľvek iné alebo pri priblížení `70%` a nižšom, pri ktorom tabuľky zobrazujú iba svoje názvy, namiesto toho odstránia celý výber – pozrite si časť [Odstraňovanie tabuliek a poznámok](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` alebo `Alt + Delete` (Windows/Linux), `⌥ + Backspace` alebo `⌥ + Delete` (Mac). Tieto skratky odstránia vybraté stĺpce aktívnej tabuľky, aj keď sú zároveň vybraté iné tabuľky alebo poznámky. Neodstránia nič, kým sa upravuje bunka, ani pri priblížení `70%` a nižšom.

![Odstránenie jedného stĺpca a potom dvoch vybratých stĺpcov pomocou Alt + Backspace](/img/demo-column-remove.webp)

To isté robí kontextová ponuka tabuľky. Keď je tabuľka jediným vybratým objektom, kliknite pravým tlačidlom na riadok stĺpca: posledná položka ponuky znie `Delete column`, prípadne `Delete columns`, ak je tento riadok jedným z dvoch alebo viacerých vybratých stĺpcov.

Kým sa upravuje bunka, klávesy `Delete` a `Backspace` iba mažú text. Ak ich podržíte stlačené mimo editora bunky, odstránenie vykonajú iba raz.  
Po odstránení sa fokus presunie na najbližší zostávajúci stĺpec nad stĺpcom, ktorý bol aktívny. Keď nad ním žiadny nezostal, fokus sa presunie na názov tabuľky (v zobrazení `Logical Names` na logický názov vykreslený na jeho mieste), aj keď pod ním ešte zostávajú stĺpce, takže ďalšie stlačenie klávesu `Delete` alebo `Backspace` odstráni tabuľku, a nie stĺpec.  
Vzťahy a indexy, ktoré používajú odstránený stĺpec, sa odstránia spolu s ním. Nevyžaduje sa žiadne potvrdenie a celé odstránenie je jeden krok histórie zmien.

## Kopírovanie/prilepovanie stĺpcov {#copyingpasting-columns}

Funguje ako schránka založená na tabuľkách.  
Klávesové skratky: `Ctrl + C` (Windows/Linux) alebo `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) alebo `⌘ + V` (Mac)

Kopírovanie do tabuľkového hárka, prilepovanie z neho a prilepovanie do tabuľky, v ktorej je aktívna bunka stĺpca, používajú bunky, ktoré tabuľky zobrazujú, v poradí, v akom ich zobrazujú – pozrite si časti [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options), [Úprava poradia stĺpcov](./settings.md#adjusting-column-order) a [Zobrazenie názvov](./logical-names.md#name-view). Zobrazenie názvov mení obsah niektorých z týchto buniek:

- V zobrazení `Logical Names` obsahuje bunka názvu logický názov, prípadne nič, kým je prázdny. Kým je možnosť View Option → `Domain` vypnutá, bunka typu obsahuje názov domény stĺpca tam, kde ju zobrazuje, a inak typ údajov.
- V zobrazení `Both Names` sa bunka `Logical Name` kopíruje a prilepuje na miesto, kam ju umiestňuje poradie stĺpcov.
- Zobrazená bunka domény obsahuje názov domény, prípadne nič pri stĺpci, ktorý nezobrazuje žiadnu doménu.

Stĺpce skopírované v editore a prilepené pri vybratej hlavičke tabuľky alebo do ostatných vybratých tabuliek prenášajú všetky bunky skopírovaných stĺpcov vrátane skrytých, napríklad Jedinečný a Automatický prírastok, a aj svoje logické názvy.  
Prepojenie s doménou si ponechajú, iba ak tento diagram obsahuje tú istú doménu, nie iba doménu s rovnakým názvom, a doména má stále typ skopírovaného stĺpca. Inak sa prilepia bez prepojenia, s typom, s ktorým boli skopírované. Ich názvy sa považujú za vlastné, ibaže je prilepený názov prázdny a odvodí sa z logického názvu – pozrite si časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names).  
Označenia [alternatívneho kľúča](./table-related-functions.md#alternate-keys), napríklad `AK1.1`, nie sú bunky, takže sa pri kopírovaní a prilepovaní vynechávajú, aj keď sú zobrazené.

Z editora môžete prilepovať do aplikácie Excel a z aplikácie Excel späť do editora.  
Hodnoty buniek sa prenesú presne tak, ako boli napísané, takže hodnota, napríklad `<label>` alebo `a &amp; b`, sa do tabuľkového hárka alebo dokumentu dostane nezmenená.  
Stĺpce tabuľkového hárka sa priraďujú k viditeľným bunkám podľa pozície, nie podľa názvu, takže stĺpce hárka musia dodržať ich poradie.  
Pri nasledujúcich stĺpcoch sa ako pravda interpretuje ktorákoľvek z týchto hodnôt (bez ohľadu na veľkosť písmen):

- Automatický prírastok: `TRUE`, `1`, `YES`, `Y`
- Jedinečný: `TRUE`, `1`, `YES`, `Y`
- NOT NULL: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

Pri kopírovaní von editor zapisuje do stĺpcov Automatický prírastok a Jedinečný hodnotu `TRUE` alebo `FALSE` a do stĺpca NOT NULL hodnotu `NOT NULL` alebo `NULL`.  
Bunky Jedinečný a Automatický prírastok sú predvolene skryté, takže hodnoty `TRUE` a `FALSE` sa zapisujú a čítajú, až keď sa tieto bunky zobrazia.

![Prilepenie štyroch stĺpcov do tabuľkového hárka s príznakmi zapísanými ako TRUE/FALSE a NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Prilepenie troch riadkov tabuľkového hárka do tabuľky ako stĺpcov, pričom YES, 1 a NOT NULL sa interpretujú ako pravda](/img/demo-copy-sheet-column.webp)

Kam sa prilepený obsah umiestni, závisí od fokusu:

- Keď je vybratá hlavička tabuľky, prilepené riadky sa pridajú ako nové stĺpce do každej vybratej tabuľky.
- Keď je aktívna bunka stĺpca, postupne sa prepíšu vybraté riadky tejto tabuľky a potom riadky pod posledným z nich, a to toľko, koľko riadkov sa prilepilo. Riadky medzi oddelenými výbermi sa preskočia. Prepísaný riadok prevezme prilepené hodnoty do svojich viditeľných buniek, skryté bunky si ponechá a zvyšné riadky sa pridajú ako nové stĺpce. Do každej ďalšej vybratej tabuľky sa prilepené riadky pridajú ako nové stĺpce.

![Skopírovanie dvoch stĺpcov a ich prilepenie naraz do dvoch vybratých tabuliek](/img/demo-copy-column-multi.webp)

Prilepený riadok zapisuje logické názvy a domény takto:

- Logický názov z bunky `Logical Name` alebo z bunky názvu v zobrazení `Logical Names` sa považuje za napísaný celý. Kým je názov stĺpca prázdny alebo stále odvodený, [slovníky](./dictionary.md#deriving-physical-names) z neho odvodia fyzický názov a prepoja stĺpec s doménou, ktorú dáva jeho termín, pokiaľ doménu neprepojí vlastná bunka domény daného riadka. Názov, ktorý prilepí ten istý riadok, sa zachová a považuje sa za vlastný.
- Bunka domény, prípadne bunka typu v zobrazení `Logical Names`, kým je možnosť View Option → `Domain` vypnutá, prepojí stĺpec s doménou, ktorú jej text pomenúva, ak ju diagram obsahuje. Akýkoľvek iný text alebo prázdna bunka neprepojí žiadnu doménu a stĺpec od domény odpojí, a to aj od domény s prilepeným typom. Text v bunke typu, ktorý nepomenúva žiadnu doménu, sa interpretuje ako typ údajov. Riadky skopírované v editore namiesto toho prepoja stĺpec s doménou, s ktorou boli skopírované, a to iba vtedy, ak ju tento diagram obsahuje so skopírovaným typom, rovnako ako nové stĺpce.
- Prepojená doména dá stĺpcu svoj typ údajov, pokiaľ riadok neprilepí vlastný typ. Vtedy sa doména s iným typom neprepojí a stĺpec prevezme prilepený typ.
- V riadku bez bunky domény prilepený typ odpojí stĺpec od domény s iným typom rovnako ako jeho napísanie.
- Žiadne prilepenie nešíri typ ďalej prostredníctvom [synchronizácie typu údajov vo vzťahoch](./settings.md#relationship-datatype-sync).

## Kopírovanie/prilepovanie tabuliek a poznámok {#copyingpasting-tables-and-memos}

Keď vnútri aktívnej tabuľky nie je vybratý žiadny stĺpec, rovnaké klávesové skratky skopírujú samotné vybraté tabuľky a poznámky – pozrite si stránku [Funkcie pre tabuľky](./table-related-functions.md).

## Primárny kľúč stĺpca {#column-primary-key}

Prepne primárny kľúč aktívneho stĺpca, teda stĺpca, do ktorého patrí aktívna bunka.  
Keď je aktívny stĺpec jedným z dvoch alebo viacerých vybratých stĺpcov, prepnutie sa použije na všetky vybraté stĺpce: ak niektorý z nich nie je kľúčom, kľúčom sa stanú všetky a ak už kľúčom sú všetky, kľúč sa zruší pri všetkých. Stĺpce mimo výberu zostanú nezmenené.  
Použite kontextovú ponuku tabuľky alebo klávesovú skratku `Alt + K` (Windows/Linux) alebo `⌥ + K` (Mac). Keď sa prepnutie týka dvoch alebo viacerých stĺpcov, položka ponuky znie `Primary Key on selected columns` namiesto `Primary Key`.  
Ikona kľúča v riadku slúži iba na zobrazenie, takže kliknutím na ňu kľúč nenastavíte.

Ak chcete z viacerých stĺpcov vytvoriť jeden zložený kľúč, [vyberte ich](#selecting-multiple-columns), potom stlačte `Alt + K` (Windows/Linux) alebo `⌥ + K` (Mac) alebo kliknite pravým tlačidlom na jeden z vybratých riadkov a vyberte položku `Primary Key on selected columns`. Každé prepnutie je jeden krok histórie zmien.

![Výber dvoch stĺpcov pomocou Shift + Arrow Down, potom nastavenie oboch ako primárneho kľúča pomocou ⌥ + K a zrušenie oboch druhým stlačením](/img/demo-column-pk.webp)

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) sa žiadna bunka neotvorí na úpravy a nezmení sa žiadny stĺpec.  
Kliknutie na bunku nič nezaostrí a zruší výber, ktorý zanechal skok. `Enter` a dvojité kliknutie neotvoria žiadny editor ani neprepnú žiadny prepínač, `Tab` sa ponechá stránke a klávesové skratky, ktoré pridávajú, vyberajú všetky alebo odstraňujú stĺpce, prepínač primárneho kľúča a prilepenie nič nerobia.  
Prechod na stĺpec z [prieskumníka](./explorer.md#going-to-a-row) alebo [rýchleho vyhľadávania](./quick-search.md) zaostrí jeho bunku. Klávesy so šípkami potom presúvajú fokus z bunky na bunku, pričom stĺpec, ku ktorému sa dostanú, sa vyberie samostatne, keďže `Shift` tam nepridáva žiadny stĺpec.  
`Ctrl + C` (Windows/Linux) alebo `⌘ + C` (Mac) naďalej kopíruje vybraný stĺpec alebo tabuľku, ktorú vybral skok – pozrite si časť [Kopírovanie/prilepovanie stĺpcov](#copyingpasting-columns).
