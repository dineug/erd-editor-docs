---
sidebar_position: 9
description: Prehliadanie tabuliek diagramu s ich stĺpcami, indexmi a cudzími kľúčmi, jeho skupín tabuliek a poznámok v strome ukotvenom vedľa plátna ERD a prechod na ktorúkoľvek z týchto položiek kliknutím.
---

# Prieskumník

Prieskumník je panel ukotvený pri ľavom okraji plátna ERD, ktorý zobrazuje diagram ako strom: jeho tabuľky, každú s jej stĺpcami, indexmi a cudzími kľúčmi, potom jeho [skupiny tabuliek](./table-groups.md) a potom jeho poznámky. Kliknutím na riadok prejdete na to, čo riadok predstavuje na plátne.  
Prieskumník plátno zúži namiesto toho, aby ho zakryl. Je súčasťou editora diagramu, nie zobrazením Explorer view vo VS Code ani prieskumníkom súborov v aplikácii Obsidian.

![Otvorenie prieskumníka z panela nástrojov, prechod na products, potom na stĺpec status a cudzí kľúč member_id tabuľky orders, zbalenie pomocou Collapse All, rozšírenie panela a jeho zatvorenie](/img/demo-explorer.webp)

[Hľadanie a nahrádzanie](./find-and-replace.md) sa nachádza v hornej časti prieskumníka, medzi jeho záhlavím a stromom. Kým pole hľadania obsahuje text, strom zobrazuje iba to, čo zodpovedá hľadanému textu – pozrite si časť [Výsledky](./find-and-replace.md#the-results).  
Samotný strom diagram nikdy nemení: neumožňuje premenovanie, presúvanie myšou, odstraňovanie ani zobrazovanie a skrývanie. Nahradenie je jediná úprava, ktorú panel vykonáva.

Vlastný stav prieskumníka patrí iba vám: či je otvorený, jeho šírka, stav zbalenia, riadok, na ktorom je fokus klávesnice, poloha posunutia a vyhľadávanie.  
Nič z toho sa neukladá do súboru, nezaznamenáva do histórie zmien, nezdieľa so spolupracovníkmi ani neuchováva v prehliadači. Zachováva sa, kým editor zostáva otvorený, pri prepínaní kariet aj naprieč dokumentmi načítanými do toho istého editora. Novo otvorený editor začína so zatvoreným prieskumníkom.

## Otvorenie a zatvorenie {#opening-and-closing}

Otvoriť ho môžete ktorýmkoľvek z týchto spôsobov:

- Tlačidlo `Explorer` na paneli nástrojov, hneď za tlačidlom `Search`, s ikonou stromu. Jeho bublinový popis znie `Explorer (Ctrl + F)` (Windows/Linux) alebo `Explorer (⌘ + F)` (Mac).
- Klávesová skratka `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac), ktorá sa na karte [Klávesové skratky](./settings.md#shortcuts) karty Nastavenia nazýva `Toggle Explorer`.
- Položka `Toggle Explorer` v [rýchlom vyhľadávaní](./quick-search.md), uvedená na každej karte. Zobrazí sa po zadaní `find`, `replace`, `rename`, `tree`, `outline` alebo `objects`.
- Položka `Toggle Explorer` v kontextovej ponuke plátna: kliknite pravým tlačidlom na prázdne miesto na plátne ERD mimo akejkoľvek [skupiny tabuliek](./table-groups.md). Nachádza sa za položkami `New Table`, `New Memo` a `New Table Group` a pred položkou `Relationship`.

Obe položky `Toggle Explorer` zobrazujú vpravo klávesovú skratku.  
Tlačidlo na paneli nástrojov, klávesová skratka a položka rýchleho vyhľadávania fungujú na každej karte. Z karty Vizualizácia, Schéma SQL, Generátor kódu, Slovník alebo Nastavenia najprv prepnú na kartu ERD, pretože prieskumník sa zobrazuje iba tam.

Tlačidlo na paneli nástrojov panel iba otvára a zatvára. Neumiestni textový kurzor do poľa hľadania a panel Vlastnosti tabuľky, výber motívu a výber jazyka `Display Language` nechá otvorené.  
Klávesová skratka a obe položky `Toggle Explorer` otvoria prieskumníka s fokusom na jeho vyhľadávaní: textový kurzor prejde do poľa hľadania s vybratým textom a ktorékoľvek z piatich dialógových okien z časti [Dialógové okná vedľa prieskumníka](#dialogs-beside-it) sa zatvorí. Čo si vyhľadávanie zachováva medzi otvoreniami, opisuje časť [Otvorenie a zatvorenie](./find-and-replace.md#opening-and-closing) na stránke Hľadanie a nahrádzanie.  
Klávesová skratka nemá žiadny účinok, kým sa upravuje bunka tabuľky, poznámka alebo názov skupiny tabuliek, ani kým je otvorená úprava bunky na karte [Slovník](./dictionary.md#keys-on-the-tab) vrátane zoznamu domén termínu.

Tlačidlo na paneli nástrojov vyzerá ako stlačené, kým je prieskumník otvorený na karte ERD a nie je skrytý [režimom Zen](#when-it-stands-aside). Vtedy tlačidlo, klávesová skratka aj ktorákoľvek z oboch položiek `Toggle Explorer` prieskumníka zatvoria, a ak bol fokus klávesnice v paneli, vráti sa do editora.  
Klávesová skratka ho nikdy nezatvorí, kým je otvorené rýchle vyhľadávanie alebo jedno z piatich dialógových okien. Namiesto toho zatvorí paletu alebo dialógové okno a presunie fokus klávesnice do poľa hľadania s vybratým textom, pričom ak sa prieskumník už zobrazoval, zachová sa aktuálna zhoda. Položka `Toggle Explorer` v rýchlom vyhľadávaní takúto výnimku nerobí: jej spustenie zatvorí paletu a potom otvoreného prieskumníka.

Prieskumníka zatvorí aj tlačidlo `x` v záhlaví, ktorého bublinový popis znie `Close`, a fokus klávesnice odovzdá plátnu. Kláves `Escape` ho nezatvorí – pozrite si časť [Klávesy v prieskumníkovi](#keys-in-the-explorer).  
Po opätovnom otvorení sa prieskumník vráti s rovnakou šírkou, so stromom zbaleným a posunutým rovnako ako predtým a s tým istým hľadaným textom. Ak sa otvorí klávesovou skratkou alebo položkou `Toggle Explorer`, vyhľadá tento text znova so všetkými výsledkami rozbalenými – pozrite si časť [Výsledky](./find-and-replace.md#the-results).

Keď klávesová skratka alebo položka `Toggle Explorer` otvorí prieskumníka v editore, ktorý je pre neho príliš úzky, zobrazí sa oznámenie `Widen the window to show the Explorer` a fokus klávesnice zostane tam, kde bol – pozrite si časť [Vedľa plátna](#beside-the-canvas).  
Prieskumník je napriek tomu otvorený, tlačidlo na paneli nástrojov je stlačené a hneď, ako je editor dostatočne široký, sa prieskumník zobrazí už s vykonaným vyhľadávaním a bez prevzatia fokusu klávesnice. Pri otvorení tlačidlom na paneli nástrojov sa žiadne oznámenie nezobrazí.

## Vedľa plátna {#beside-the-canvas}

Prieskumník sa tiahne pozdĺž ľavého okraja karty ERD pod panelom nástrojov po celej výške plátna.  
Plátno sa zúži, aby mu uvoľnilo miesto, takže žiadna časť diagramu neleží pod panelom a [panel nástrojov plátna](./table-related-functions.md#canvas-toolbar), minimapa aj [uvítacia obrazovka](./editing-start.md#welcome-screen) sa nachádzajú na plátne vedľa neho.  
Otvorenie, zatvorenie ani zmena veľkosti prieskumníka diagram neposunie a do [histórie zmien](./undo-redo.md#what-the-history-records) nič nezaznamená.

V novo otvorenom editore má na začiatku šírku `260px`. Ťahaním pravého okraja nastavíte šírku na ľubovoľnú hodnotu od `200px` do `480px` a dvojitým kliknutím na okraj ju vrátite na `260px`.

Plátnu vždy zostáva vedľa prieskumníka aspoň `320px`:

- V editore užšom, ako je šírka prieskumníka plus `320px`, sa prieskumník vykreslí užší, aby sa zmestil, a to až na `200px`.
- V editore užšom ako `520px` prieskumník ustúpi nabok. Nevykreslí sa, ale zostane otvorený, takže tlačidlo na paneli nástrojov stále vyzerá ako stlačené a jeho stlačenie prieskumníka zatvorí. Keď je editor dostatočne široký, prieskumník sa vráti so svojou vlastnou šírkou.

Rozhoduje šírka samotného editora, nie okna prehliadača, aj keď oznámenie z časti [Otvorenie a zatvorenie](#opening-and-closing) hovorí o okne.

V [jazyku zobrazenia písanom sprava doľava](./language-and-theme.md#right-to-left-languages) zostáva prieskumník vľavo od plátna, pretože plátno sa nikdy zrkadlovo neotáča.  
Jeho obsah sa číta sprava doľava: záhlavie, vyhľadávanie a riadky sú zrkadlovo otočené a riadky sa odsadzujú sprava. Okraj, ktorý ťaháte, zostáva na jeho pravej strane, pri plátne. Typy údajov, stĺpce indexov a text cudzích kľúčov si zachovávajú poradie zľava doprava.

## Kedy sa prieskumník nezobrazuje {#when-it-stands-aside}

Prieskumník sa zobrazuje iba na karte ERD.  
Prepnutie na inú kartu ho skryje a tlačidlo na paneli nástrojov už nevyzerá ako stlačené. Po návrate na kartu ERD sa znova zobrazí tak, ako ste ho nechali, rovnako zbalený a posunutý.

Kým je otvorený [prehliadač rozdielov](./table-related-functions.md#diff-viewer), [cestovanie v čase](./undo-redo.md#time-travel) alebo ukážka [automatického rozloženia](./table-related-functions.md#auto-layout), prieskumníka nič neotvorí ani nezatvorí:

- Otvorený prieskumník sa skryje a znova sa zobrazí, keď sa zatvoria.
- Tlačidlo na paneli nástrojov je stlmené a nemá žiadny účinok.
- Rýchle vyhľadávanie vynechá položku `Toggle Explorer`.
- Klávesová skratka sa ponechá prehliadaču alebo hostiteľskej aplikácii – pozrite si časť [Panel hľadania v prehliadači](./find-and-replace.md#the-browsers-find-bar).

Prehliadač rozdielov uvádza svoje zmeny v strome rovnakého druhu – pozrite si časť [Prehliadač rozdielov](./table-related-functions.md#diff-viewer).

Zapnutie [režimu Zen](./table-related-functions.md#canvas-toolbar) pomocou `Alt + Z` (Windows/Linux) alebo `⌥ + Z` (Mac) otvoreného prieskumníka skryje bez toho, aby ho zatvorilo, a vypnutie režimu Zen prieskumníka vráti.  
V režime Zen klávesová skratka a obe položky `Toggle Explorer` naďalej otvárajú prieskumníka s fokusom na jeho vyhľadávaní a režim Zen zostane zapnutý. Prieskumník sa potom tiahne po celej výške editora, pretože horný panel nástrojov nie je zobrazený, a po vypnutí režimu Zen zostane zobrazený. Opätovné zapnutie režimu Zen ho znova skryje.

Vždy, keď panel zmizne, kým je v ňom fokus klávesnice, či už sa zatvorí, skryje alebo ustúpi nabok, fokus klávesnice sa vráti do editora.

## Strom {#the-tree}

V záhlaví je nápis `Explorer` a dve tlačidlá: `Collapse All` a `x`, ktoré prieskumníka zatvorí. Pod ním je vyhľadávanie – pozrite si stránku [Hľadanie a nahrádzanie](./find-and-replace.md) – a pod vyhľadávaním strom.

Najvyššia úroveň obsahuje tri priečinky v tomto poradí: `Tables`, `Table Groups` a `Memos`. Pod každou tabuľkou sú jej vlastné priečinky `Columns`, `Indexes` a `Foreign Keys`.  
Prázdny priečinok sa nezobrazuje, takže pri prázdnom diagrame sa nezobrazí vôbec žiadny riadok. Priečinok `Table Groups` sa vynechá aj vtedy, keď [View Option](./table-related-functions.md#table-view-options) → `Table Groups` skryje skupiny, a priečinok `Memos`, keď View Option → `Memos` skryje poznámky.  
Riadok priečinka zobrazuje ikonu priečinka, jeho názov a na samom konci počet riadkov priamo pod ním, takže počet vedľa priečinka `Tables` je počet tabuliek v diagrame. Počet zoskupuje tisíce tak, ako to robí jazyk zobrazenia, vždy číslicami 0 až 9, napríklad `1,234` v angličtine a `1.234` v nemčine.

Tabuľky sú zoradené podľa názvu bez ohľadu na veľkosť písmen a tabuľky s rovnakým názvom si zachovávajú poradie z dokumentu. Rovnako sú zoradené skupiny tabuliek aj tabuľky pod každou skupinou. Stĺpce tabuľky si zachovávajú poradie, ktoré majú v tabuľke, a jej indexy, jej cudzie kľúče a poznámky poradie z dokumentu.  
Strom sleduje zmeny diagramu, či už ide o úpravu na plátne, vrátenie späť alebo opätovné vykonanie, import alebo zmenu od spolupracovníka či programovacieho agenta, takže premenovanie tabuľky presunie jej riadok.  
Poradie sa v každom [Zobrazení názvov](./logical-names.md#name-view) riadi názvom, nikdy nie logickým názvom. Prepnutie zobrazenia zmení označenia riadkov tabuliek a stĺpcov bez toho, aby niektorý z nich presunulo, a rovnako aj priradenie logického názvu tabuľke alebo stĺpcu v zobrazení `Logical Names` alebo `Both Names`. Fyzický názov [odvodený](./dictionary.md#deriving-physical-names) z nového logického názvu je však premenovanie ako každé iné, takže môže riadok tabuľky presunúť.

Jednotlivé druhy riadkov zobrazujú:

- Tabuľka: ikona tabuľky a jej názov.
- Stĺpec: ikona kľúča pri stĺpci primárneho alebo cudzieho kľúča, zafarbená tak, ako bunka kľúča samotnej tabuľky zafarbuje primárny kľúč, cudzí kľúč alebo oboje, a ikona zoznamu pri každom inom stĺpci. Potom jeho názov a tlmeným písmom jeho typ údajov, za ktorým nasleduje `PK`, `FK` alebo oboje, napríklad `id` `BIGINT PK` alebo `user_id` `BIGINT FK`. Zobrazený typ je bez ohľadu na Zobrazenie názvov vždy typ údajov stĺpca, nikdy nie jeho [doména](./logical-names.md#the-domain-cell).
- Index: ikona indexu a jeho názov. Potom tlmeným písmom `UNIQUE` pri jedinečnom indexe a jeho stĺpce v zátvorkách v poradí indexu, pričom za zostupným stĺpcom nasleduje `DESC`, napríklad `orders_user_idx` `UNIQUE (user_id DESC, total)` alebo iba `(total)`.
- Cudzí kľúč: uvádza sa iba pod podradenou tabuľkou, teda tou, ktorá obsahuje stĺpce cudzieho kľúča, a iba vtedy, keď je nadradená tabuľka v diagrame. Jeho ikona kľúča preberá farbu spojnice: farbu primárneho a cudzieho kľúča pri [identifikujúcom vzťahu](./relationship-editing.md#identifying-relationships), inak farbu cudzieho kľúča. Zobrazuje stĺpce kľúča podradenej tabuľky oddelené čiarkami, potom tlmeným písmom `→` s nadradenou tabuľkou a jej stĺpcami, napríklad `user_id` `→ users(id)`.
- Skupina tabuliek: bodka vo farbe skupiny, sivá pri skupine bez farby, a jej názov. Jej tabuľky sú pod ňou zoradené podľa názvu a každý takýto riadok prejde na svoju tabuľku. Skupina bez tabuliek nemá čo rozbaliť.
- Poznámka: ikona lepiaceho lístka a prvý riadok poznámky.

Riadky tabuliek, tabuľky uvedené pod skupinou a riadky stĺpcov sa riadia Zobrazením názvov – pozrite si časť [Mimo plátna](./logical-names.md#beyond-the-canvas). V zobrazení `Both Names` napríklad riadok stĺpca znie `Total Amount` `total` `NUMERIC`: logický názov, potom názov a typ údajov, oba tlmeným písmom.  
V každom zobrazení riadky indexov a cudzích kľúčov uvádzajú svoje stĺpce podľa názvu a riadok cudzieho kľúča uvádza podľa názvu aj svoju nadradenú tabuľku.  
Kým pole hľadania obsahuje text, riadok nájdený iba v názve, ktorý jeho zobrazenie vynecháva, zobrazuje tlmeným písmom aj tento názov – pozrite si časť [Výsledky](./find-and-replace.md#the-results).

Prázdny názov alebo poznámka s prázdnym prvým riadkom sa zobrazí ako `unnamed` kurzívou. V zobrazeniach `Logical Names` a `Both Names` sa tabuľka alebo stĺpec zobrazí ako `unnamed`, iba keď je prázdny aj logický názov.  
Na úzkom paneli sa tlmený text skráti a ukončí znakom `…` skôr ako názov, ktorým riadok začína. Podržaním ukazovateľa nad názvom alebo jeho tlmeným textom zobrazíte celé znenie.

Na začiatku je rozbalený iba priečinok `Tables`. Kliknutím na riadok priečinka alebo stlačením klávesu `Enter` alebo `Space` na ňom ho zbalíte alebo rozbalíte.  
Šípka na začiatku riadka tento riadok zbalí alebo rozbalí bez prechodu kamkoľvek. Má ju každý riadok tabuľky, aj pri tabuľke, pod ktorou nič nie je. Klávesy `→` a `←` tiež zbaľujú a rozbaľujú – pozrite si časť [Klávesy v prieskumníkovi](#keys-in-the-explorer).  
Tlačidlo `Collapse All` pri každom stlačení zbalí jednu úroveň: najhlbšiu zobrazenú úroveň rozbalených riadkov, takže stlačenia zbaľujú zdola nahor. Stlačenie, ktoré dosiahne najvyššiu úroveň, zbalí všetky riadky vrátane tých pod už zbaleným riadkom, takže zostanú iba priečinky najvyššej úrovne.  
Úpravy, vrátenie späť a opätovné vykonanie a zmeny od spolupracovníkov alebo programovacieho agenta ponechajú stav zbalenia bez zmeny.

## Prechod na riadok {#going-to-a-row}

Kliknutím na riadok alebo stlačením klávesu `Enter` alebo `Space`, keď je na ňom fokus klávesnice, prejdete na to, čo riadok predstavuje na plátne ERD. Riadok priečinka sa iba zbalí alebo rozbalí a klávesy so šípkami sa pohybujú iba v rámci stromu.

- Riadok tabuľky alebo tabuľka uvedená pod skupinou vyberie iba túto tabuľku a presunie ju dopredu. Pokiaľ aktívna bunka už nie je v tejto tabuľke, presunie sa na prvú bunku hlavičky tabuľky: na názov, prípadne na logický názov v zobrazeniach `Logical Names` a `Both Names`.
- Riadok stĺpca vyberie iba jeho tabuľku a umiestni aktívnu bunku na názov stĺpca, prípadne v zobrazení `Logical Names` na logický názov vykreslený na jeho mieste.
- Riadok indexu vyberie jeho tabuľku rovnako ako riadok tabuľky. Samotný index sa nijako nevyznačí; indexy sa upravujú v paneli [Vlastnosti tabuľky](./table-related-functions.md#indexes).
- Riadok cudzieho kľúča posunie do zobrazenia obe tabuľky vzťahu naraz, prípadne iba podradenú tabuľku, ak sú od seba príliš ďaleko na to, aby sa zobrazili spolu. Vyberie iba podradenú tabuľku s jej stĺpcami cudzieho kľúča, s aktívnou bunkou na prvom z nich, a zvýrazní spojnicu vzťahu – pozrite si časť [Čítanie spojnice](./relationship-editing.md#reading-a-connector).
- Riadok skupiny tabuliek posunie rámec skupiny do zobrazenia podľa jeho záhlavia, vyberie iba túto skupinu a presunie ju dopredu spolu s jej tabuľkami.
- Riadok poznámky vyberie iba túto poznámku a presunie ju dopredu.

Zobrazenie sa presúva podľa pravidla spoločného pre všetky prechody: priblíženie sa nikdy nemení a plátno sa posunie iba vtedy, ak to, na čo prechádzate, už nie je dobre viditeľné – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands).  
Prechod na riadok najprv zatvorí panel Vlastnosti tabuľky, ak je otvorený, a nikdy nezačne ani nedokončí práve kreslený vzťah.  
Kým pole hľadania obsahuje text, riadok, ktorého názov alebo logický názov obsahuje zhodu, alebo riadok, ktorý zobrazuje úryvok komentára alebo poznámky, namiesto toho prejde na svoju prvú zhodu – pozrite si časť [Prechod na zhodu](./find-and-replace.md#going-to-a-match).

Po kliknutí zostane fokus klávesnice v strome, takže klávesy `Delete`, `Backspace` a ostatné klávesy na úpravy sa k novému výberu nedostanú, kým nestlačíte `Escape` alebo nekliknete na plátno – pozrite si časť [Klávesy v prieskumníkovi](#keys-in-the-explorer).

## Klávesy v prieskumníkovi {#keys-in-the-explorer}

Pri prechádzaní klávesom `Tab` je strom jedna zastávka, ktorá sa preskočí, kým strom nemá žiadne riadky.  
Po vstupe do stromu tabulátorom sa fokus klávesnice ocitne na riadku, na ktorom bol naposledy, ak taký nie je, na riadku aktuálnej zhody, prípadne na prvom riadku, ktorý je celý viditeľný, a tento riadok sa posunie do zobrazenia. Riadok s fokusom klávesnice sa vykresľuje ako riadok pod ukazovateľom.

V strome:

- `↑` a `↓` posúvajú o jeden riadok a na prvom a poslednom riadku sa zastavia namiesto toho, aby pokračovali od druhého konca. `Home` a `End` prejdú na prvý a posledný riadok.
- `→` rozbalí zbalený riadok alebo prejde na prvý vnorený riadok rozbaleného riadka. `←` zbalí rozbalený riadok alebo prejde von na jeho nadradený riadok. V jazyku zobrazenia písanom sprava doľava sa tieto dva klávesy vymenia.
- `Enter` a `Space` fungujú ako kliknutie: prejdú na riadok alebo zbalia či rozbalia priečinok – pozrite si časť [Prechod na riadok](#going-to-a-row).
- Napísanie písmena nespôsobí skok na riadok.

Kláves `Escape`, stlačený kdekoľvek v prieskumníkovi, v strome, v poli hľadania alebo nahradenia či na niektorom z jeho tlačidiel, vráti fokus klávesnice plátnu. Prieskumník zostane otvorený a výber zostane tak, ako je.  
Kláves `Escape`, ktorý ukončí skladanie znakov metódou vstupu, ukončí iba skladanie znakov. Kláves `Escape` prieskumníka nikdy nezatvorí, či už ho stlačíte v ňom, alebo na plátne.

Niekoľko klávesových skratiek editora funguje aj vtedy, keď je fokus klávesnice v prieskumníkovi – pozrite si časť [Klávesové skratky](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) funguje rovnako ako na plátne: zatvorí prieskumníka, alebo, kým je vedľa neho otvorený panel Vlastnosti tabuľky, zatvorí tento panel a umiestni textový kurzor do poľa hľadania – pozrite si časť [Otvorenie a zatvorenie](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac) otvorí alebo zatvorí rýchle vyhľadávanie.
- `Undo` a `Redo` vracajú späť a znova vykonávajú zmeny diagramu, nie textu v poli.
- `Zoom In`, `Zoom Out` a `Zoom Reset` menia priblíženie plátna.

Všetky ostatné klávesové skratky editora zostávajú v prieskumníkovi a rovnako aj klávesy so šípkami, `Tab`, `Enter`, `Space`, `Home`, `End` a každý kláves stlačený počas skladania znakov metódou vstupu.  
Nič z toho sa nedostane k plátnu: `Delete` a `Backspace` nikdy neodstránia výber, `Alt + N` (Windows/Linux) alebo `⌥ + N` (Mac) nepridá tabuľku a `T` a potom `G` nič nezoskupí. V poli fungujú ako bežné textové klávesy: `Ctrl + A` (Windows/Linux) alebo `⌘ + A` (Mac) vyberie text poľa, `Delete` a `Backspace` mažú text a `Space` napíše medzeru. `Tab` prechádza medzi tlačidlami, poľami a stromom prieskumníka.  
Klávesy samotných polí hľadania a nahradenia opisuje časť [Klávesy v poliach hľadania](./find-and-replace.md#keys-in-the-search-fields).  
Klávesy, ktoré editor nemá priradené, napríklad vlastné ukladanie alebo paleta príkazov hostiteľskej aplikácie, sa ako zvyčajne dostanú k hostiteľskej aplikácii.

## Dialógové okná vedľa prieskumníka {#dialogs-beside-it}

Pri otvorení panela [Vlastnosti tabuľky](./table-related-functions.md#table-properties), [výberu motívu](./language-and-theme.md#theme), výberu jazyka [`Display Language`](./language-and-theme.md#picking-a-language), dialógového okna [`Export image`](./file-import-export.md#image) a dialógového okna [Mapovať stĺpce](./relationship-editing.md#map-columns) zostáva prieskumník otvorený.

- Vlastnosti tabuľky sa otvoria uprostred plátna vedľa prieskumníka a stmavia iba plátno. Prieskumník zostane použiteľný: výber riadka zatvorí panel Vlastnosti tabuľky a potom prejde na riadok.
- Dialógové okná `Export image` a Mapovať stĺpce stmavia celý editor vrátane panela nástrojov a prieskumníka. Prieskumník zostane otvorený pod stmavenou oblasťou a kliknutie tam zatvorí dialógové okno, rovnako ako kliknutie kdekoľvek na stmavenú oblasť; dialógové okno Mapovať stĺpce sa potom zatvorí bez toho, aby niečo namapovalo.
- V jazyku zobrazenia písanom zľava doprava sa výber motívu a výber jazyka `Display Language` otvoria tesne za prieskumníkom namiesto toho, aby ho prekryli, a ak sa prieskumník otvorí alebo zatvorí, kým sú zobrazené, posunú sa spolu s ním. V jazyku písanom sprava doľava si zachovajú svoje miesto vpravo. Stlačenie tlačidla myši v prieskumníkovi ich zatvorí, rovnako ako akékoľvek stlačenie mimo nich okrem stlačenia na paneli nástrojov.

Otvorenie vyhľadávania klávesovou skratkou alebo položkou `Toggle Explorer` zatvorí všetkých päť, dialógové okno Mapovať stĺpce bez toho, aby niečo namapovalo.  
Aj pri otvorení [rýchleho vyhľadávania](./quick-search.md) zostane prieskumník otvorený a kláves `Escape` potom zatvorí iba paletu.

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) funguje prieskumník rovnako ako v ktoromkoľvek inom: tlačidlo na paneli nástrojov s rovnakým bublinovým popisom, klávesová skratka, obe položky `Toggle Explorer`, strom, zbaľovanie, tlačidlo `Collapse All` a prechod na riadok, ktorý ako zvyčajne vyberie to, na čo prechádza. Aj tam je jeho nadpis `Explorer`.  
Jeho vyhľadávanie iba hľadá – pozrite si časť [Editory iba na čítanie](./find-and-replace.md#read-only-editors) na stránke Hľadanie a nahrádzanie.
