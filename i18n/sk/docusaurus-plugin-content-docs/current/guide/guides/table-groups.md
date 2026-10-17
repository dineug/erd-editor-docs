---
sidebar_position: 5
description: Zoskupenie súvisiacich tabuliek do pomenovaného farebného rámca za nimi; vytvorenie, pomenovanie, nastavenie farby, presun, zmena veľkosti a odstránenie skupín, prechod na ne z prieskumníka, zmena tabuliek, ktoré obsahujú, ich skrytie a zachovanie pri automatickom rozložení, na karte Schéma SQL a v DBML.
---

# Skupiny tabuliek

Skupina tabuliek je pomenovaný farebný rámec vykreslený za súvisiacimi tabuľkami na plátne ERD, ktorý ukazuje, ktoré tabuľky patria k sebe.  
Tabuľka patrí najviac do jednej skupiny. Skupiny sa ukladajú s diagramom spolu s tým, do ktorej skupiny jednotlivé tabuľky patria.

Rámec má pozdĺž hornej strany záhlavie, na ktorom je ikona skupiny, tučne zobrazený názov skupiny a, kým je ukazovateľ nad skupinou, aj tlačidlo `x`, ktoré skupinu odstráni – pozrite si časť [Odstránenie skupiny](#removing-a-group). Pri skupine bez názvu sa zobrazuje `unnamed` a názov, ktorý sa do záhlavia nezmestí, sa skráti a ukončí znakom `…`.  
Rámec vždy obsiahne svoje tabuľky: zachováva veľkosť, ktorá mu bola nastavená, ale roztiahne sa tak, aby každá tabuľka zostala vnútri s voľným priestorom `24px` okolo seba a pod záhlavím. Tabuľka, ktorá sa zväčší, roztiahne rámec so sebou, a rovnako aj tabuľka pustená blízko okraja, ktorej stred je stále vnútri rámca. Kým sa tabuľky presúvajú myšou, rámec sa nezväčšuje ani nezmenšuje. Roztiahnutie sa neukladá: rámec sa vráti na svoju vlastnú veľkosť, hneď ako tabuľka tento priestor už nepotrebuje.

Skupiny sa vykresľujú za všetkým ostatným na plátne: za tabuľkami, poznámkami a spojnicami vzťahov.  
Kde sa skupiny prekrývajú, vpredu sa vykreslí naposledy stlačená alebo pridaná skupina a plocha žiadnej skupiny nikdy nezakryje záhlavie inej skupiny. Poradie sa neukladá, takže znova otvorený diagram usporiada skupiny nad sebou v poradí, v akom boli pridané.  
Skupiny sa zobrazujú na plátne ERD, v minimape a v exportovanom obrázku a uvádza ich aj [prieskumník](./explorer.md) – pozrite si časť [Prechod na skupinu](#going-to-a-group). Karta [Vizualizácia](./visualization.md) v žiadnom z režimov nevykresľuje skupiny ani farby skupín.

Aj programovací agent môže skupiny vytvárať a meniť, ako aj čítať kód DDL zvolených skupín – pozrite si časť [Skupiny tabuliek](../../mcp/tools.md#table-groups) v nástrojoch MCP.

![Aktivovanie kreslenia skupiny pomocou ⌥ + G, nakreslenie skupiny cez orders a payments, zadanie názvu Billing, pustenie order_items do skupiny a potom presun a zmena veľkosti skupiny](/img/demo-table-group.webp)

## Vytvorenie skupiny {#creating-a-group}

Skupinu možno vytvoriť dvoma spôsobmi, pričom každý má vlastnú klávesovú skratku. Ani jeden z nich nie je k dispozícii v editore iba na čítanie ani vtedy, keď sú skupiny [skryté](#hiding-groups), a ich klávesové skratky potom nemajú žiadny účinok.  
Podobne ako ostatné klávesové skratky plátna aj tieto fungujú iba na karte ERD a sú potlačené, kým sa upravuje bunka, poznámka alebo názov skupiny – pozrite si časť [Klávesové skratky](./settings.md#shortcuts).

### Nakreslenie skupiny {#drawing-a-group}

Kliknite na tlačidlo `New Table Group` na [paneli nástrojov plátna](./table-related-functions.md#canvas-toolbar), stlačte `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac), prípadne vyberte položku `New Table Group` z kontextovej ponuky plátna, kde nasleduje za položkami `New Table` a `New Memo`, alebo z [rýchleho vyhľadávania](./quick-search.md) na karte ERD. Potom ťahaním vytvorte rámec na plátne.  
Tlačidlo aj klávesová skratka kreslenie zapínajú a vypínajú, takže stlačenie ktoréhokoľvek z nich počas aktivovaného kreslenia ho ukončí bez ohľadu na to, ako sa začalo; položka kontextovej ponuky a rýchle vyhľadávanie ho iba spúšťajú. Spustenie kreslenia vypne nástroj Ruka a zruší práve kreslený vzťah.  
Kým je kreslenie aktivované, kurzor má tvar nitkového kríža a stlačenie tlačidla myši začne rámec presne tam, kde nastane, aj nad tabuľkou, namiesto toho, aby vybralo alebo presunulo to, čo je pod ním. Panel nástrojov plátna potom označuje ako aktívne tlačidlo `New Table Group`, a nie ruku ani ukazovateľ.

Po uvoľnení tlačidla sa v nakreslenom rámci pridá skupina, nikdy nie užšia ako `160px` ani nižšia ako `100px` vrátane záhlavia, akokoľvek krátke je ťahanie. Kliknutie bez ťahania pridá skupinu so šírkou `480px` a výškou `320px`, ktorej ľavý horný roh je v mieste kliknutia.  
Každá tabuľka bez skupiny, ktorej stred leží vnútri nového rámca, sa do skupiny pridá. Tabuľka, ktorá už patrí do inej skupiny, v nej zostane.

Stredné tlačidlo myši naďalej posúva zobrazenie plátna a kreslenie nechá aktivované. Kreslenie bez pridania skupiny ukončia tieto akcie:

- `Escape`, prípadne `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac), pred stlačením tlačidla myši alebo počas ťahania. Pred stlačením ponechajú výber tak, ako je; stlačenie, ktorým sa rámec začína, ho už zrušilo.
- Kliknutie pravým tlačidlom, ktoré zruší výber. Kontextová ponuka sa neotvorí.
- Prepnutie na nástroj Ruka klávesom `Space` alebo na paneli nástrojov plátna, kliknutie na ukazovateľ alebo tlačidlo `New Table Group` na paneli nástrojov, prípadne začatie kreslenia vzťahu.
- Prepnutie na inú kartu, skrytie skupín alebo prepnutie editora do režimu iba na čítanie.

### Zoskupenie vybratých tabuliek {#grouping-selected-tables}

Vyberte jednu alebo viac tabuliek a stlačte `T` a potom `G`, prípadne vyberte položku `Group selected tables` z kontextovej ponuky tabuľky alebo položku `Group Selected Tables` z rýchleho vyhľadávania, ktoré ju uvádza, kým je vybratá nejaká tabuľka.  
Nová skupina sa vykreslí okolo vybratých tabuliek s voľným priestorom `24px` na každej strane a so záhlavím nad nimi. Každá vybratá tabuľka sa do nej pridá a opustí skupinu, v ktorej bola, pričom opustená skupina zostane, aj keď je teraz prázdna. Poznámky vo výbere sa vynechajú.

Skratka `T` a potom `G` pozostáva z dvoch stlačení bez modifikačného klávesu, pričom `G` nasleduje do jednej sekundy po `T`. Bez vybratej tabuľky nemá žiadny účinok a v textovom poli, napríklad v poli hľadania v prieskumníkovi, napíše obe písmená.

![Zoskupenie categories a products pomocou T a potom G, zadanie názvu skupiny Catalog a potom zafarbenie skupiny na fialovo z jej ponuky, takže túto farbu prevezmú obe hlavičky](/img/demo-table-group-selected.webp)

V oboch prípadoch nová skupina nemá názov ani farbu. Vyberie sa iba táto skupina a nad jej záhlavím sa otvorí editor názvu, aby ste mohli okamžite zadať názov – pozrite si časť [Pomenovanie skupiny](#naming-a-group).  
Skupina spolu s tabuľkami, ktoré zahrnie, je jeden krok histórie zmien a zadaný názov je ďalší krok.

## Pomenovanie skupiny {#naming-a-group}

Názov skupiny sa upravuje v poli, ktoré sa otvorí nad jej záhlavím. Otvorí sa samo po vytvorení skupiny, po dvojitom kliknutí na záhlavie a cez položku `Rename` v kontextovej ponuke skupiny.  
Kláves `Enter` alebo kliknutie inam názov uloží. Kláves `Escape` zatvorí pole bez zmeny názvu a ponechá skupinu vybratú, pričom druhé stlačenie klávesu `Escape` zruší výber.  
Zmenený názov je jeden krok histórie zmien; uloženie nezmeneného názvu sa nezaznamená. Prázdny názov alebo názov iba z medzier sa zobrazí ako `unnamed`.  
Kým je pole otvorené, klávesové skratky plátna sú potlačené a klávesové skratky rýchleho vyhľadávania a `Toggle Explorer` nemajú žiadny účinok, rovnako ako pri úprave bunky tabuľky.

[Hľadanie a nahrádzanie](./find-and-replace.md#what-it-searches) prehľadáva názvy skupín v rámci druhu textu `Table group names`, kým sú skupiny zobrazené, a jeho príkazy `Replace` a `Replace All` skupiny premenúvajú – pozrite si časť [Nahrádzanie](./find-and-replace.md#replacing). [Rýchle vyhľadávanie](./quick-search.md#searching-the-diagram) názvy skupín neprehľadáva.

## Nastavenie farby skupiny {#coloring-a-group}

Vyberte položku `Color` v kontextovej ponuke skupiny a otvorí sa výber farby nastavený na farbu skupiny.  
Rovnako ako pri tabuľkách a poznámkach výber farby zafarbí každú vybratú tabuľku, poznámku aj skupinu a položka `Remove color` v ponuke alebo možnosť `No color` vo výbere farby odstráni farbu zo všetkých – pozrite si časť [Nastavenie farby tabuliek a poznámok](./table-related-functions.md#table-and-memo-color-specification). Farba skupiny sa ponúka aj vo výbere farby v sekcii `Document colors`.

Zafarbená skupina vykreslí záhlavie a obrys v tejto farbe a plochu v jej bledom odtieni. Skupina bez farby používa neutrálne odtiene sivej motívu.  
Každá tabuľka v zafarbenej skupine má na celej hlavičke farbu skupiny a na ľavom okraji si ponechá vlastnú farbu, takže sú viditeľné obe.  
Text a tlačidlá na takejto hlavičke sa zmenia na biele, prípadne na čierne, ak ide o svetlú farbu, na ktorej je čierna oveľa čitateľnejšia; rovnako sa zmenia aj názov, ikona a tlačidlo `x` v záhlaví skupiny. Spomedzi prednastavených farieb vo výbere farby dostanú Orange, Amber, Yellow a Lime čiernu a ostatné bielu.  
Tabuľka si ponechá vlastnú hlavičku, kým jej skupina nemá farbu, kým sú skupiny skryté, pri priblížení `70%` a menšom, pri ktorom sa tabuľky zbalia na svoj názov, a na karte Vizualizácia.

Zmena farby sa zaznamená do [histórie zmien](./undo-redo.md#one-gesture-one-step) rovnako ako pri tabuľkách a poznámkach.

## Výber skupín {#selecting-groups}

Kliknutím na záhlavie skupiny vyberiete iba túto skupinu a pomocou `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac) ju pridáte do výberu.  
Stlačenie tlačidla myši na záhlaví skupiny, ktorá je už vybratá, zachová celý výber, takže následné presunutie myšou presunie všetko vybraté.  
Stlačenie tlačidla myši na záhlaví alebo kliknutie pravým tlačidlom na skupinu presunie skupinu dopredu pred ostatné skupiny a jej tabuľky pred všetky ostatné tabuľky a poznámky.

Plocha, teda oblasť pod záhlavím, sa pre ľavé tlačidlo myši správa ako plátno: ťahanie posúva zobrazenie, `Ctrl + drag` (Windows/Linux) alebo `⌘ + drag` (Mac) nakreslí výberový rámec a kliknutie zruší výber. Tabuľky, poznámky a spojnice vzťahov nad plochou reagujú na ukazovateľ ako zvyčajne.

Výberový rámec zahrnie skupinu iba vtedy, keď obklopí celý jej rámec, takže výberový rámec nakreslený vnútri skupiny vyberie tabuľky, ale nie skupinu – pozrite si časť [Viacnásobný výber](./table-related-functions.md#multiple-selection).  
Klávesová skratka `Ctrl + A` (Windows/Linux) alebo `⌘ + A` (Mac) nikdy nevyberie skupinu.

Položka `Select tables` v kontextovej ponuke skupiny nahradí výber tabuľkami skupiny bez samotnej skupiny, takže ďalší príkaz sa týka iba tabuliek.  
Použite ju pred príkazmi, ktoré pôsobia iba na tabuľky, napríklad pred kopírovaním alebo [zameraním na tabuľky](./table-related-functions.md#focusing-on-tables), ktoré vybratú skupinu vynechajú.

Obrys vybratej skupiny sa zmení na farbu výberu. V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) je skupina, ktorú vyberie iný účastník, orámovaná farbou tohto účastníka.

## Prechod na skupinu {#going-to-a-group}

[Prieskumník](./explorer.md#the-tree) uvádza skupiny v priečinku `Table Groups` podľa názvu, každú s jej tabuľkami pod ňou. Rýchle vyhľadávanie skupiny neuvádza.

Na skupinu prejdete zvolením jej riadka v prieskumníkovi, zhody [hľadania a nahrádzania](./find-and-replace.md#going-to-a-match) v názve skupiny alebo riadka skupiny v zozname [prehliadača rozdielov](./table-related-functions.md#the-change-tree).  
Prechod posunie rámec skupiny do zobrazenia, pričom ak je rámec vyšší ako plátno, riadi sa jeho záhlavím – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Potom sa vyberie iba táto skupina a presunie sa dopredu spolu so svojimi tabuľkami, rovnako ako pri stlačení tlačidla myši na jej záhlaví.  
Ak sú skupiny [skryté](#hiding-groups) alebo ak už bola skupina odstránená, prechod na ňu nemá žiadny účinok.  
V prehliadači rozdielov prejde každá strana na skupinu iba vtedy, keď ju jej vlastný dokument obsahuje a zobrazuje – pozrite si časť [Prechod na zmenu](./table-related-functions.md#going-to-a-change).

## Presun a zmena veľkosti skupiny {#moving-and-resizing-a-group}

Ak chcete skupinu presunúť so všetkými jej tabuľkami, presuňte ju myšou za záhlavie.  
Ak je skupina súčasťou väčšieho výberu, presunie sa s ňou celý výber a tabuľka, ktorá je vybratá a zároveň patrí do skupiny, sa presunie iba raz.  
Presúvanie sa začne až vtedy, keď sa ukazovateľ posunie o kúsok, takže kliknutie alebo dvojité kliknutie na záhlavie zostane kliknutím. `Alt + drag` na záhlaví presunie skupinu rovnako ako obyčajné presunutie myšou; skupina sa nikdy neduplikuje.  
Presun spolu so všetkými tabuľkami, ktoré presúva, je jeden krok histórie zmien.

Presunutie samotnej tabuľky myšou presunie iba túto tabuľku a môže ju presunúť do skupiny alebo zo skupiny – pozrite si časť [Pridávanie a odstraňovanie tabuliek](#adding-and-removing-tables).

Každá skupina má, vybratá aj nevybratá, úchyty na zmenu veľkosti na svojich štyroch okrajoch a štyroch rohoch, rovnako ako poznámka.  
Ťahajte niektorý z nich ľavým tlačidlom myši: rámec sleduje ukazovateľ a nová veľkosť sa po uvoľnení tlačidla uloží ako jeden krok histórie zmien.  
Skupinu nemožno zmenšiť pod `160px` × `100px` ani pod veľkosť jej tabuliek s ich voľným priestorom `24px` a záhlavím. Okraj sa tam zastaví bez ohľadu na to, ako ďaleko sa ukazovateľ posunie.

## Pridávanie a odstraňovanie tabuliek {#adding-and-removing-tables}

Tabuľka sa do skupiny pridá alebo ju opustí podľa toho, kam ju pustíte.  
Keď tabuľky presuniete myšou a pustíte, každá presúvaná tabuľka, ktorú nepresúva vybratá skupina, sa posudzuje podľa svojho stredu. Pridá sa do najvrchnejšej skupiny, ktorej rámec obsahuje jej stred, alebo opustí svoju skupinu, ak jej stred neleží v žiadnom rámci skupiny. Najvrchnejšia skupina je tá, ktorá je vykreslená vpredu.  
Skupina, ktorú presúvanie nechá na mieste, si zachová rámec, aký mala na začiatku presúvania, takže tabuľka mierne posunutá vnútri svojej skupiny v nej zostane a na to, aby ju opustila, ju treba presunúť tak, aby bol jej stred mimo tohto rámca.  
Počas presúvania sa obrysom zvýrazní každá skupina, do ktorej by sa po pustení pridala tabuľka.

Keď uvoľníte tlačidlo približne do `200ms` od posledného pohybu, zmena skupiny je súčasťou kroku histórie zmien presúvania, takže jedno vrátenie späť umiestni tabuľky späť tam, kde boli, a do skupín, v ktorých boli. Po dlhšej pauze pred uvoľnením je zmena skupiny samostatným krokom – pozrite si časť [Jedno gesto, jeden krok](./undo-redo.md#one-gesture-one-step).  
Kliknutie alebo presunutie o niekoľko pixelov nezmení žiadnu skupinu a kým sú skupiny skryté, žiadna tabuľka skupinu nezmení.

Ďalšie spôsoby, ako zmeniť, ktoré tabuľky skupina obsahuje:

- Položka `Remove from group` v kontextovej ponuke tabuľky odstráni každú vybratú tabuľku z jej skupiny. Zobrazuje sa, kým je niektorá vybratá tabuľka v skupine, aj keď sú skupiny skryté, a predstavuje jeden krok histórie zmien.
- Položka `Group selected tables` presunie vybraté tabuľky do novej skupiny – pozrite si časť [Zoskupenie vybratých tabuliek](#grouping-selected-tables).
- Po odstránení skupiny zostanú jej tabuľky bez skupiny.

Tabuľka prilepená alebo duplikovaná pomocou `Alt` nepatrí do žiadnej skupiny, ani keď sa ocitne vnútri rámca skupiny. Ak ju potom presuniete myšou, uplatní sa pravidlo pre pustenie.

## Odstránenie skupiny {#removing-a-group}

Odstránenie skupiny nikdy neodstráni jej tabuľky: zostanú tam, kde sú, bez skupiny.

- Tlačidlo `x` na konci záhlavia, ktoré sa zobrazuje, kým je ukazovateľ nad skupinou, odstráni iba túto skupinu.
- Položka `Delete` v kontextovej ponuke skupiny odstráni skupinu. Keď je skupina jedným z viacerých vybratých objektov, položka znie `Delete selected` a odstráni všetko vybraté: tabuľky, poznámky a skupiny.
- Keď sú vybraté skupiny, kláves `Delete` alebo `Backspace` odstráni vybraté skupiny spolu so všetkými vybratými tabuľkami a poznámkami, rovnako ako `Ctrl + Backspace` a `Ctrl + Delete` (Windows/Linux) alebo `⌘ + Backspace` a `⌘ + Delete` (Mac) – pozrite si časť [Odstraňovanie tabuliek a poznámok](./table-related-functions.md#table-and-memo-deletion).

Každé odstránenie je jeden krok histórie zmien, ktorého vrátenie späť obnoví skupinu aj s tabuľkami v nej.

## Ponuka skupiny {#the-group-menu}

Kliknutím pravým tlačidlom na záhlavie, plochu alebo okraj skupiny otvoríte jej ponuku. Na Macu ju otvorí aj `Ctrl + click` a rovnako aj dlhé stlačenie na dotykovej obrazovke.  
Kliknutie pravým tlačidlom najprv skupinu vyberie, a to samostatne, pokiaľ už nie je súčasťou výberu, takže položky `Color` a `Delete selected` sa týkajú zvyšku výberu iba vtedy, keď v ňom skupina bola.

- `Select tables`: vyberie iba tabuľky skupiny – pozrite si časť [Výber skupín](#selecting-groups).
- `Rename`: otvorí editor názvu – pozrite si časť [Pomenovanie skupiny](#naming-a-group).
- `Color`: otvorí výber farby – pozrite si časť [Nastavenie farby skupiny](#coloring-a-group).
- `Remove color`: zobrazuje sa, kým má niečo z výberu farbu.
- `Delete` alebo `Delete selected`, keď je skupina jedným z viacerých vybratých objektov, s klávesom `Delete` zobrazeným vpravo – pozrite si časť [Odstránenie skupiny](#removing-a-group).

Kontextová ponuka tabuľky pridáva položky `Group selected tables` a `Remove from group` za položky `Color` a `Remove color`, pred svoju položku Delete, a kontextová ponuka plátna pridáva položku `New Table Group`.  
Položka `Group selected tables` zobrazuje vpravo svoje klávesy, `T` a potom `G`, a položka `New Table Group` zobrazuje `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac).

## Skrytie skupín {#hiding-groups}

Položka `View Option` → `Table Groups` v kontextovej ponuke plátna zobrazí alebo skryje všetky skupiny. Predvolene je začiarknutá – pozrite si časť [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options).  
Keď nie je začiarknutá, rámce skupín a farby skupín na hlavičkách tabuliek zmiznú z plátna, minimapy a exportovaných obrázkov a posúvacie pruhy a minimapa už pre skupiny nevyhradzujú miesto. Nič sa nepresunie ani nezmení veľkosť a každá tabuľka zostane vo svojej skupine.  
Skrytie skupín zruší ich výber, ukončí kreslenie pomocou `New Table Group` a zatvorí otvorený editor názvu.

Kým sú skupiny skryté:

- Položky `New Table Group` a `Group selected tables` sa v ponukách neponúkajú, rovnako ani `New Table Group` a `Group Selected Tables` v rýchlom vyhľadávaní, a panel nástrojov plátna vynechá svoje tlačidlo `New Table Group`. Položka `Remove from group` sa ponúka aj naďalej.
- Klávesové skratky `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac) ani `T` a potom `G` nemajú žiadny účinok.
- Presúvanie tabuliek myšou nezmení žiadnu skupinu a výberový rámec nezahrnie žiadnu skupinu.
- Prieskumník vynechá svoj priečinok `Table Groups` a hľadanie a nahrádzanie názvy skupín nenájde ani nenahradí, ani keď je zapnutý druh textu `Table group names`.
- [Automatické rozloženie](#auto-layout) naďalej drží tabuľky každej skupiny pohromade, karta Schéma SQL naďalej ponúka [skupiny na výber](#schema-sql-by-group), DBML ich naďalej zapisuje a príkaz [Importovať a pridať](./file-import-export.md#import-and-add) naďalej vkladá obsah pod skryté rámce.

Voľba sa ukladá do dokumentu a zaznamenáva do [histórie zmien](./undo-redo.md#what-the-history-records) rovnako ako ostatné prepínače ponuky Možnosti zobrazenia.

## Automatické rozloženie {#auto-layout}

Každé [automatické rozloženie](./table-related-functions.md#auto-layout) drží tabuľky každej skupiny pohromade bez ohľadu na to, či sú skupiny zobrazené.

- Rozloženie `Force` presúva každú skupinu s jej tabuľkami ako jeden rámec, pričom tabuľky si v ňom zachovajú svoje miesta, a rámec každej skupiny drží aspoň `100px` od ostatných skupín a od tabuliek bez skupiny. Ukážka zobrazuje každú skupinu tam, kam sa presúva.
- Rozloženia `Flow`, `Tree - vertical` a `Tree - horizontal` rozmiestnia tabuľky každej skupiny vnútri skupiny a skupiny umiestnia podľa vzťahov medzi nimi, pričom tabuľky bez skupiny rozmiestnia okolo nich.

Potom sa každá skupina, ktorá obsahuje tabuľky, prispôsobí svojim tabuľkám: jej rámec sa zmení na ich hranice s voľným priestorom `24px` a záhlavím. Skupina bez tabuliek si zachová svoje miesto aj veľkosť.  
Nové umiestnenie tabuliek a skupín je jeden krok histórie zmien.

Import DBML rovnakým spôsobom prispôsobí rámec každej skupiny jej tabuľkám bez ohľadu na to, kde sú umiestnené – pozrite si časť [DBML](./file-import-export.md#dbml).

## Schéma SQL podľa skupín {#schema-sql-by-group}

Karta [Schéma SQL](./schema-sql.md) môže vypísať iba tabuľky zvolených skupín.  
Kým dokument obsahuje nejakú skupinu, zobrazenú alebo skrytú, panel možností karty zobrazuje pod nadpisom `This window only` riadok `Tables` so začiarkavacím políčkom pre `All`, ďalším pre každú skupinu a ďalším pre `No group`, teda pre tabuľky bez skupiny – pozrite si časť [Tabuľky](./schema-sql.md#tables).  
Voľba patrí k oknu editora a neukladá sa do dokumentu.

## Import, export a kopírovanie {#import-export-and-copying}

- DBML prenáša skupiny oboma smermi. Import DBML zmení každý blok `TableGroup` na skupinu – pozrite si časť [DBML](./file-import-export.md#dbml) – a cieľ `DBML` na karte Generátor kódu zapíše blok `TableGroup` pre každú skupinu, ktorá obsahuje nejakú tabuľku – pozrite si stránku [Generátor kódu](./code-generator.md#language).
- Súbor JSON si svoje skupiny zachováva. Žiadny iný formát ich neprenáša: importy SQL, GraphQL a AML neprinášajú žiadne a karta Schéma SQL ani ostatné ciele na karte Generátor kódu žiadne nezapisujú.
- Príkaz [Importovať a pridať](./file-import-export.md#import-and-add) pridá skupiny zo súboru ako nové skupiny obsahujúce ich tabuľky a, kým sú skupiny zobrazené, vyberie ich spolu s novými tabuľkami, takže presunutie pridaného bloku myšou presunie aj jeho skupiny.
- [Exportovaný obrázok](./file-import-export.md#image) vykreslí zobrazené skupiny za tabuľkami s farbami skupín na ich hlavičkách.
- Kopírovanie a prilepenie ani duplikovanie pomocou `Alt` nikdy neskopíruje skupinu – pozrite si časti [Kopírovanie/prilepovanie tabuliek a poznámok](./table-related-functions.md#copyingpasting-tables-and-memos) a [Pridávanie a odstraňovanie tabuliek](#adding-and-removing-tables).

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) sa skupiny vykresľujú a v prieskumníkovi uvádzajú ako zvyčajne a možno ich vyberať a prechádzať na ne, ale nie meniť:

- Stlačenie tlačidla myši na záhlaví skupinu vyberie a nič nepresunie. Nie sú k dispozícii úchyty na zmenu veľkosti ani tlačidlo `x`.
- Dvojité kliknutie na záhlavie neotvorí editor názvu a ponuka skupiny obsahuje iba položku `Select tables`.
- Ponuka plátna neobsahuje položku `New Table Group`, ponuka tabuľky neobsahuje položky `Group selected tables` ani `Remove from group` a rýchle vyhľadávanie neuvádza ani jeden z príkazov pre skupiny. Kreslenie pomocou `New Table Group` sa ukončí pri prepnutí editora do režimu iba na čítanie.
- [Panel nástrojov plátna](./table-related-functions.md#canvas-toolbar) nezobrazuje žiadne zo svojich tlačidiel na pridávanie vrátane tlačidla `New Table Group` a klávesové skratky `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac) ani `T` a potom `G` nemajú žiadny účinok.
- Možnosť zobrazenia `Table Groups` nič nemení, rovnako ako všetky možnosti v ponuke Možnosti zobrazenia.
- Voľba `Tables` na karte Schéma SQL naďalej funguje.
