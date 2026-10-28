---
sidebar_position: 10
description: Hľadanie v názvoch tabuliek, stĺpcov, indexov a skupín tabuliek, v logických názvoch, komentároch a poznámkach z hornej časti prieskumníka, prechádzanie zhodami v jeho strome a na plátne a nahradenie jednej zhody alebo všetkých.
---

# Hľadanie a nahrádzanie

Vyhľadá text v celom diagrame, prenesie vás ku každej zhode na plátne ERD a nahradí jednu zhodu alebo všetky.  
Prehľadáva osem druhov textu: názvy tabuliek, komentáre tabuliek, názvy stĺpcov, komentáre stĺpcov, poznámky, názvy indexov, názvy skupín tabuliek a [logické názvy](./logical-names.md) tabuliek a stĺpcov – pozrite si časť [Čo sa prehľadáva](#what-it-searches).

Nachádza sa v hornej časti [prieskumníka](./explorer.md), panela ukotveného naľavo od plátna ERD, medzi záhlavím prieskumníka a jeho stromom. Nemá vlastný nadpis. Zhora nadol obsahuje:

- Pole hľadania s tromi [možnosťami](#options) vnútri, na jeho konci, a šípku `Toggle Replace` pred ním.
- Riadok `Replace`, na začiatku zbalený – pozrite si časť [Nahrádzanie](#replacing).
- Počet, za ním šípky nahor a nadol, ktoré prechádzajú zhodami, a tlačidlo s tromi bodkami `Search In`.
- [Druhy textu](#what-it-searches), ktoré rozbalí tlačidlo `Search In`.

Kým pole hľadania obsahuje text, strom prieskumníka zobrazuje zhody – pozrite si časť [Výsledky](#the-results).  
Na nízkom plátne si hľadanie zachová plnú výšku a strom pod ním zaberie zvyšný priestor a posúva sa.

![Otvorenie hľadania a nahrádzania v prieskumníkovi pomocou ⌘ + F, prechádzanie šiestimi zhodami member a potom so zapnutou možnosťou Preserve Case nahradenie všetkých šiestich textom user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Otvorenie a zatvorenie {#opening-and-closing}

`Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) a položka `Toggle Explorer` v [rýchlom vyhľadávaní](./quick-search.md) alebo v kontextovej ponuke plátna otvoria hľadanie v prieskumníkovi. Textový kurzor sa presunie do poľa hľadania s vybratým textom a hľadaný text sa znova vyhľadá bez aktuálnej zhody.  
Tlačidlo `Explorer` na paneli nástrojov panel iba otvorí alebo zatvorí. Nepresunie textový kurzor do poľa hľadania a hľadaný text aj aktuálnu zhodu ponechá tak, ako boli.  
Keď klávesová skratka iba vráti textový kurzor do už zobrazeného prieskumníka, ako to robí, kým je otvorené rýchle vyhľadávanie alebo jedno z piatich dialógových okien z časti [Dialógové okná vedľa prieskumníka](./explorer.md#dialogs-beside-it), aktuálna zhoda zostane aktuálna.

Zatváranie prieskumníka, to, čo klávesová skratka a dve položky `Toggle Explorer` robia, keď je otvorený, a dialógové okná, ktoré zatvárajú, opisuje časť [Otvorenie a zatvorenie](./explorer.md#opening-and-closing) na stránke prieskumníka.  
Časť [Kedy sa prieskumník nezobrazuje](./explorer.md#when-it-stands-aside) opisuje, ako ho skryje iná karta a režim Zen a ako ho prehliadač rozdielov, cestovanie v čase a ukážka automatického rozloženia skryjú a nedovolia ho otvoriť. Časť [Vedľa plátna](./explorer.md#beside-the-canvas) opisuje editor, ktorý je naň príliš úzky.

Pri opätovnom otvorení zostane posledný hľadaný text spolu s textom nahradenia, [možnosťami](#options), [druhmi textu](#what-it-searches), ktoré boli zapnuté, a s tým, či boli riadok `Replace` a druhy textu rozbalené.  
Zachovajú sa, kým je editor otvorený, a neukladajú sa do dokumentu. Novo otvorený editor začína so všetkými možnosťami vypnutými, so zbaleným riadkom `Replace` a zbalenými druhmi textu a so zapnutými iba štyrmi druhmi názvov a druhom `Logical names` – pozrite si časť [Čo sa prehľadáva](#what-it-searches).

## Panel hľadania v prehliadači {#the-browsers-find-bar}

Kým má editor fokus klávesnice, `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) mu patrí na každej karte, aj v jeho vlastných textových poliach, takže sa panel hľadania v prehliadači neotvorí.  
Klávesová skratka prejde ďalej do prehliadača alebo hostiteľskej aplikácie, kým je otvorený prehliadač rozdielov, cestovanie v čase alebo ukážka automatického rozloženia a kým je fokus mimo editora.

- Webová aplikácia a Google Drive: panel hľadania v prehliadači sa otvorí iba v týchto dvoch prípadoch.
- VS Code: rozšírenie necháva vlastný panel hľadania VS Code v editore ERD Editor vypnutý, takže ho tam klávesová skratka nikdy neotvorí.
- Obsidian: klávesová skratka sa dostane k editoru vždy, keď je karta diagramu aktívna, namiesto príkazu `Search current file` aplikácie Obsidian.
- IDE od JetBrains: ak si IDE vo svojej mape klávesov ponecháva `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) pre seba, otvorte hľadanie položkou `Toggle Explorer` v rýchlom vyhľadávaní alebo v kontextovej ponuke plátna, alebo otvorte prieskumníka tlačidlom `Explorer` na paneli nástrojov a kliknite do poľa hľadania.

Stránka, ktorá editor vkladá, môže klávesovú skratku priradiť inému klávesu alebo ju odstrániť – pozrite si časť [Zmena klávesovej skratky](#changing-the-shortcut).

## Čo sa prehľadáva {#what-it-searches}

Druhy prehľadávaného textu vyberá osem tlačidiel v tomto poradí: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` a `Logical names`.  
Na začiatku sú zbalené. Tlačidlo `Search In` na konci riadka s počtom ich rozbalí pod týmto riadkom a znova zbalí a je zvýraznené, kým sú zobrazené.  
Zvýraznené tlačidlo druhu je zapnuté. Kliknutím na tlačidlo ho zapnete alebo vypnete a hľadanie sa spustí znova. Keď je všetkých osem vypnutých, nenájde sa nič.

Hľadanie sa prvýkrát otvorí so štyrmi druhmi názvov, `Table names`, `Column names`, `Index names` a `Table group names`, a s druhom `Logical names`, takže premenovanie nezasiahne komentáre a poznámky, pokiaľ ich nezapnete.  
Druh textu `Logical names` je jeden spoločný druh pre logické názvy tabuliek aj stĺpcov.  
Názvy indexov sú názvy indexov na karte `Indexes` panela [Vlastnosti tabuľky](./table-related-functions.md#indexes), nie kľúče `PK_` a `UQ_` uvedené nad nimi.

Nič iné sa neprehľadáva: ani typy údajov, doména stĺpca, predvolené hodnoty, stĺpce indexu, názov databázy, [Schéma SQL](./schema-sql.md) so skriptami `Before tables` a `After tables`, vygenerovaný kód, ani hárky karty [Slovník](./dictionary.md), ktoré majú [vlastné vyhľadávanie](./dictionary.md#searching).  
Logické názvy sa prehľadávajú bez ohľadu na to, čo vykresľuje [Zobrazenie názvov](./logical-names.md#name-view), a to aj v zobrazení `Physical Names`, v ktorom ich plátno nezobrazuje. Komentár skrytý [možnosťou zobrazenia tabuliek](./table-related-functions.md#table-view-options) sa tiež naďalej prehľadáva. Poznámky skryté cez View Option → `Memos` a [skupiny tabuliek](./table-groups.md#hiding-groups) skryté cez View Option → `Table Groups` sa neprehľadávajú, ani keď je ich tlačidlo zapnuté, takže `Replace All` nikdy neprepíše poznámku ani nepremenuje skupinu, ktorú nevidíte.

## Možnosti {#options}

Tri prepínače vnútri poľa hľadania, na jeho konci, menia spôsob, akým sa hľadaný text zhoduje. Ich názvy uvádzajú bublinové popisy a sú zvýraznené, kým sú zapnuté. Všetky tri sú na začiatku vypnuté a zmena ktoréhokoľvek z nich spustí hľadanie znova.

- `Match Case`: keď je vypnutý, zhoda sa hľadá bez ohľadu na veľkosť písmen.
- `Match Whole Word`: zhoda sa počíta iba tam, kde na žiadnej strane nepokračuje do slova. Za znaky slova sa považujú písmená, číslice a kombinačné znaky akéhokoľvek písma a takisto podčiarkovník. `user` sa preto nájde v `user id` a `user.id`, ale nie vnútri `users`, `user_id` ani `superuser`. Koniec hľadaného textu, ktorý sám nie je znakom slova, napríklad bodka v `.id`, tam hranicu nepotrebuje.
- `Use Regular Expression`: hľadaný text je regulárny výraz jazyka JavaScript, vždy v režime Unicode, takže `\p{L}` funguje. `^` a `$` zodpovedajú začiatku a koncu každého riadka viacriadkového komentára alebo poznámky a `.` neprechádza cez zlom riadka. Únikové sekvencie, ktoré sa často píšu v názvoch, napríklad `\_` a `\-`, sa akceptujú.

Regulárny výraz, ktorý sa nedá spracovať, napríklad `user(`, nenájde nič: na mieste počtu sa červenou farbou zobrazí `Invalid regular expression` a pole hľadania dostane červený obrys.  
`Match Case` a `Match Whole Word` platia aj pre regulárny výraz. Zhoda nulovej dĺžky, napríklad samotné `^`, sa nikdy neuvedie.

Obyčajný text sa vyhľadáva počas písania. Regulárny výraz sa vyhľadá, keď sa písanie preruší, alebo okamžite, keď stlačíte `Enter`, navigačné tlačidlo, `Replace` či `Replace All` alebo keď vyberiete riadok so zhodou.  
Hľadanie nemá časový limit, takže regulárny výraz s rozsiahlym spätným navracaním (backtracking) môže spôsobiť, že editor nebude reagovať, kým sa hľadanie neskončí.

Štvrtý prepínač, `Preserve Case`, sa nachádza vnútri poľa `Replace` na jeho konci, takže sa zobrazuje, iba kým je riadok `Replace` rozbalený. Na začiatku je vypnutý. Nemení nič na tom, čo sa nájde, iba to, ako `Replace` a `Replace All` zapíšu náhradný text – pozrite si časť [Nahrádzanie](#replacing). Jeho zapnutie alebo vypnutie nespustí hľadanie a aktuálna zhoda zostane aktuálna.

## Výsledky {#the-results}

Počet na začiatku riadka pod poliami ukazuje, kde sa nachádzate. Je prázdny, kým je pole hľadania prázdne.

| Počet | Kedy |
| --- | --- |
| `No results` | Hľadanému textu nič nezodpovedá. |
| `12 matches` | Pred prechodom na niektorú z nich; pri jednej zhode `1 match`. |
| `3 of 12` | Aktuálna je tretia zhoda. |
| `Invalid regular expression` | Regulárny výraz sa nedá spracovať. |
| `Replaced 12 matches` | Pomocou `Replace All` sa zmenilo toľko zhôd; pri jednej zhode `Replaced 1 match`. |
| `No changes` | Pomocou `Replace All` sa nič nezmenilo. |
| `No more matches` | Séria stlačení `Replace` sa vrátila tam, kde začala – pozrite si časť [Nahrádzanie](#replacing). |

Texty `Replaced …`, `No changes` a `No more matches` pri ďalšom hľadaní alebo prechode na zhodu vystrieda počet, a to aj pri hľadaní, ktoré spustí úprava alebo vrátenie späť.

Kým pole hľadania obsahuje text, [strom](./explorer.md#the-tree) prieskumníka namiesto celého diagramu zobrazuje výsledky: iba riadky, ktoré obsahujú zhodu, a riadky nad nimi. Keď sa nič nezhoduje alebo sa regulárny výraz nedá spracovať, je prázdny. Odstránením hľadaného textu sa vráti celý strom, zbalený tak ako predtým.

- Priečinky `Tables`, `Table Groups` a `Memos` sa zobrazia, iba keď obsahujú zhodu, a počet pri každom priečinku je počet riadkov priamo pod ním vo výsledkoch.
- Pod priečinkom `Tables` sú tabuľky, ktoré obsahujú zhodu, zoradené podľa názvu, nikdy nie podľa logického názvu. Pod každou tabuľkou je riadok pre každú zhodu v jej komentári, potom priečinok `Columns` so stĺpcami, ktoré obsahujú zhodu, v poradí stĺpcov, každý s riadkom pre každú zhodu v jeho komentári, a potom priečinok `Indexes` s indexmi, ktorých názov sa zhoduje. Priečinok `Foreign Keys` tu nie je.
- Pod priečinkom `Table Groups` sú skupiny, ktorých názov sa zhoduje, zoradené podľa názvu, bez svojich tabuliek. Nájdená tabuľka sa zobrazí pod priečinkom `Tables`.
- Pod priečinkom `Memos` sú poznámky, ktoré obsahujú zhodu, v poradí podľa dokumentu, každá zobrazená svojím prvým riadkom a s riadkom pre každú zhodu v nej.

Zhoda v názve je zvýraznená priamo v riadku daného názvu, takže názov, ktorý obsahuje hľadaný text dvakrát, je jeden riadok s dvoma zvýrazneniami. Zhoda v logickom názve tabuľky alebo stĺpca sa tiež zobrazí v riadku danej tabuľky alebo stĺpca, nikdy nie vo vlastnom riadku.  
Tieto riadky pomenúvajú tabuľku alebo stĺpec tak, ako ich zobrazuje [Zobrazenie názvov](./logical-names.md#beyond-the-canvas), a každý z dvoch názvov, ktoré riadok môže zobrazovať, zvýrazňuje iba svoje vlastné zhody. Riadok nájdený iba v názve, ktorý jeho zobrazenie vynecháva, teda v logickom názve v zobrazení `Physical Names` alebo v názve v zobrazení `Logical Names`, pridá tento názov za ten, ktorý zobrazuje, tlmený ako v zobrazení `Both Names` a so zvýraznenou zhodou. Keď zhodu obsahuje aj zobrazený názov, riadok zobrazí iba tento názov, takže zhody v názve, ktorý zobrazenie vynecháva, sa započítajú a prechádza sa nimi, ale nezvýraznia sa.  
Zhoda v komentári alebo poznámke má vlastný riadok: rečovú bublinu pri komentári tabuľky alebo stĺpca alebo lepiaci lístok pri poznámke a potom úryvok textu so zvýraznenou zhodou. Dlhý text sa skráti pomocou `…` a zlomy riadkov sa zobrazia ako medzery. Celý text uvidíte, keď podržíte ukazovateľ nad riadkom.  
Každý iný riadok vyzerá tak ako mimo hľadania: stĺpec zobrazuje svoj typ údajov, index svoje stĺpce a prázdny názov sa zobrazí ako `unnamed`.

Každý riadok, pod ktorým sú ďalšie riadky, sa na začiatku hľadania zobrazí rozbalený. Riadok, ktorý zbalíte alebo ktorý zbalí `Collapse All`, zostane zbalený, kým sa aktuálnou nestane zhoda pod ním, kým sa nezmení hľadaný text, `Match Case`, `Match Whole Word`, `Use Regular Expression` alebo druh textu, alebo kým sa hľadanie znova neotvorí klávesovou skratkou alebo položkou `Toggle Explorer`.  
Riadok aktuálnej zhody je zvýraznený a posunie sa do viditeľnej oblasti. Strom uvádza každú zhodu, nech ich je koľkokoľvek.  
Zhodami sa prechádza v poradí stromu: tabuľku po tabuľke, logický názov, názov a komentár tabuľky, potom logický názov, názov a komentár každého z jej stĺpcov v poradí stĺpcov, potom názvy jej indexov; potom názvy skupín tabuliek; potom poznámky.

Kým je prieskumník zobrazený, výsledky sledujú dokument. Keď sa úpravy prerušia, akákoľvek zmena prehľadávaných textov spustí hľadanie znova a aktuálna zhoda zostane aktuálna, ak tam stále je. Patrí sem úprava názvu, logického názvu, komentára alebo textu poznámky, pridanie alebo odstránenie tabuľky, stĺpca, indexu, poznámky alebo skupiny tabuliek, presun stĺpca a skrytie alebo zobrazenie poznámok či skupín tabuliek cez View Option, ktoré ich zhody zo stromu odoberie alebo ich doň vráti. Počíta sa úprava na plátne, vrátenie späť alebo opätovné vykonanie, import aj úprava od spolupracovníka alebo programovacieho agenta. Výber, presúvanie tabuliek, poznámok alebo skupín na plátne, posúvanie, zmena priblíženia a podržanie ukazovateľa sa nepočítajú.  
Nepočíta sa ani prepnutie Zobrazenia názvov, ktoré nemení žiadny text, ktorý hľadanie číta: zostanú tie isté zhody a riadky prevezmú názvy, ktoré zobrazuje nové zobrazenie.  
Úpravy vykonané, kým je prieskumník zatvorený alebo mimo dohľadu, sa prehľadajú hneď, ako sa znova zobrazí.

## Prechod na zhodu {#going-to-a-match}

`Enter` v poli hľadania prejde na ďalšiu zhodu a `Shift + Enter` na predchádzajúcu. Rovnako fungujú tlačidlá so šípkou nahor a nadol za počtom; ich bublinové popisy znejú `Previous Match (Shift+Enter)` a `Next Match (Enter)` a sú neaktívne, kým nie je žiadna zhoda.  
Prechádzanie na oboch koncoch pokračuje z opačného konca. Kým sa prvýkrát nepresuniete, žiadna zhoda nie je aktuálna, takže prvý `Enter` prejde na prvú zhodu a prvý `Shift + Enter` na poslednú.

Kliknutie na riadok výsledkov alebo `Enter` či `Space`, keď je na ňom fokus klávesnice, urobí jedno z nasledujúceho:

- Pri riadku, ktorého vlastný názov alebo logický názov obsahuje zhodu, sa prejde na jeho prvú zhodu, pričom zhoda v logickom názve má prednosť pred zhodou v názve.
- Pri riadku, ktorý zobrazuje úryvok komentára alebo poznámky, sa prejde na danú zhodu.
- Pri akomkoľvek inom riadku, napríklad pri tabuľke, ktorej názov ani logický názov sa nezhoduje, alebo pri vlastnom riadku poznámky, sa prejde na to, čo riadok predstavuje, a aktuálna zhoda zostane bez zmeny – pozrite si časť [Prechod na riadok](./explorer.md#going-to-a-row).
- Priečinok sa zbalí alebo rozbalí.

Vždy, keď sa zhoda stane aktuálnou, strom rozbalí všetky zbalené riadky nad ňou a presunie tam fokus klávesnice, takže klávesy so šípkami v strome pokračujú od nej.

Prechod na zhodu zatvorí panel Vlastnosti tabuľky, ak je otvorený, a potom:

- Pri názve, logickom názve alebo komentári tabuľky či stĺpca vyberie iba túto tabuľku, presunie ju dopredu a nastaví aktívnu bunku na bunku, ktorá obsahuje zhodu. Zhoda v komentári skrytom [možnosťou zobrazenia tabuliek](./table-related-functions.md#table-view-options) namiesto toho nastaví aktívnu bunku na názov vedľa neho. Tam, kde [Zobrazenie názvov](./logical-names.md#name-view) pre názov alebo logický názov nevykresľuje žiadnu bunku, sa aktívna bunka presunie na bunku vykreslenú na jeho mieste: na názov v zobrazení `Physical Names` a na logický názov v zobrazení `Logical Names`.
- Pri názve indexu vyberie iba tabuľku indexu a presunie ju dopredu, pričom aktívna bunka bude na názve tabuľky, prípadne na jej logickom názve v zobrazeniach `Logical Names` a `Both Names`, pokiaľ už nie je v tejto tabuľke. Názvy indexov sa na plátne nevykresľujú.
- Pri názve skupiny tabuliek vyberie iba túto skupinu a presunie ju dopredu spolu s jej tabuľkami.
- Pri poznámke vyberie iba túto poznámku a presunie ju dopredu.

Plátno sa posunie, iba keď cieľ prechodu ešte nie je dobre viditeľný, a priblíženie sa nikdy nemení – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands).

Po stlačení `Enter` v poli hľadania tam textový kurzor zostane a po výbere riadka zostane fokus klávesnice v strome, takže to, čo napíšete potom, sa nedostane do vybratej tabuľky.  
Prechod na zhodu nikdy nezačne ani nedokončí kreslenie vzťahu.

## Nahrádzanie {#replacing}

Riadok `Replace` je na začiatku zbalený. Šípka pred poľom hľadania, ktorej bublinový popis znie `Toggle Replace`, ho rozbaľuje a zbaľuje. Zbalenie zachová text nahradenia.  
Riadok obsahuje pole `Replace` s prepínačom `Preserve Case` vnútri, na jeho konci, a dve tlačidlá, ktorých bublinové popisy znejú `Replace (Enter)` a `Replace All`. Obe tlačidlá sú neaktívne, kým nie je žiadna zhoda.

`Replace` sa vykoná stlačením `Enter` v poli nahradenia, s klávesom `Shift` alebo bez neho, alebo tlačidlom:

- Keď nie je aktuálna žiadna zhoda, prvé stlačenie iba prejde na ďalšiu zhodu, takže uvidíte, čo by sa zmenilo, skôr ako sa niečo zmení.
- Keď je zhoda aktuálna, nahradí tento jeden výskyt, ostatné výskyty v tom istom texte ponechá a pokračuje na ďalšiu zhodu za textom, ktorý zapísal. Zapísaný text sa preskočí, aj keď obsahuje hľadaný text: nahradenie `user` textom `super_user` sa potom nezastaví vnútri `super_user`.
- Zhoda, ktorú by nahradenie zapísalo presne tak, ako bola, zostane bez zmeny a stlačenie iba prejde na ďalšiu zhodu.
- Nahradenie a posun na ďalšiu zhodu sú jeden krok histórie zmien.

Séria stlačení `Replace` sa zastaví, keď sa dostane späť tam, kde začala. Počet zobrazí `No more matches`, žiadna zhoda nie je aktuálna a ďalšie stlačenia nič nenahradia.  
Text `Customer` nahrádzaný textom `Big Customer` sa preto nahradí raz, namiesto toho, aby sa rozrástol na `Big Big Customer`.  
Prechod na zhodu, zmena hľadaného textu, `Match Case`, `Match Whole Word`, `Use Regular Expression` alebo druhu textu, otvorenie hľadania klávesovou skratkou alebo položkou `Toggle Explorer` alebo použitie `Replace All` spustí novú sériu a spustí ju aj vrátenie späť alebo akákoľvek iná úprava, ktorá zmení text, v ktorom séria začala. Zmena textu nahradenia alebo `Preserve Case` ju nespustí a nespustí ju ani klávesová skratka, keď iba vráti textový kurzor do už zobrazeného prieskumníka.  
Kým séria trvá, tabuľka alebo skupina tabuliek, ktorú premenuje, si zachová svoje miesto v strome aj v poradí zhôd, takže ak by ju premenovanie zoradilo ďalej, séria na ňu znova nenarazí. Ďalšia séria vráti strom do poradia podľa názvu a premenovaný riadok sa presunie na svoje nové miesto.

`Replace All` sa vykoná stlačením `Ctrl + Enter` (Windows/Linux) alebo `⌘ + Enter` (Mac) v poli nahradenia alebo tlačidlom:

- Nahradí každú zhodu v zapnutých druhoch textu a ostatné druhy nechá tak, s výnimkou fyzických názvov, ktoré odvodí nahradený logický názov a ktoré zapíše, aj keď sú druhy `Table names` a `Column names` vypnuté – pozrite si informácie nižšie. S predvolenými druhmi premenuje tabuľky, stĺpce, indexy a skupiny tabuliek a prepíše logické názvy tabuliek a stĺpcov; komentáre a poznámky zostanú nedotknuté.
- Všetko, čo zmení, je jeden krok histórie zmien – pozrite si časť [Jedno gesto, jeden krok](./undo-redo.md#one-gesture-one-step).
- Počet zobrazí `Replaced N matches`, pričom započíta iba výskyty, ktorých text sa skutočne zmenil. Keď sa nezmenil žiadny, zobrazí `No changes` a do histórie sa nič nezaznamená, ako pri nahradení regulárneho výrazu `(user)` textom `$1`.
- Výsledky sa potom vyhľadajú znova bez aktuálnej zhody, takže môžu uvádzať zhody, ktoré sa nachádzajú v novom texte.

Obe akcie čítajú každý text tak, ako vyzerá v okamihu stlačenia, nie tak, ako ho našlo posledné hľadanie.

Ako sa používa text nahradenia:

- Bez možnosti `Use Regular Expression` nemá `$` žiadny osobitný význam a text nahradenia sa použije tak, ako je napísaný, okrem veľkosti písmen, ktorú mu dá `Preserve Case`.
- S možnosťou `Use Regular Expression` sa `$1` až `$99`, `$<name>`, `$&`, `` $` ``, `$'` a `$$` rozvinú tak ako v metóde `String.prototype.replace` jazyka JavaScript.
- Bez možnosti `Preserve Case` sa veľkosť písmen nájdeného textu neprenáša: keď je možnosť `Match Case` vypnutá, nahradenie `user` textom `member` zmení `Users` na `members`.
- S možnosťou `Preserve Case` sa veľkosť písmen každého náhradného textu po rozvinutí `$1` a ostatných odvodí od textu, ktorý nahrádza, takže to isté nahradenie zmení `Users` na `Members`:
  - Zhoda celá veľkými písmenami dostane náhradný text celý veľkými písmenami a zhoda celá malými písmenami ho dostane celý malými písmenami: `USER` s `account` dá `ACCOUNT` a `user` s `Account` dá `account`.
  - Každá iná zhoda dá prvému znaku náhradného textu veľkosť prvého znaku zhody a zvyšok ponechá tak, ako je napísaný: `UserId` s `accountKey` dá `AccountKey` a `uSER` s `AccountKey` dá `accountKey`. Keď prvý znak zhody nemá veľkosť písmena, náhradný text zostane tak, ako je napísaný: `_Ab` s `xyz` dá `xyz`.
  - Keď zhoda aj náhradný text obsahujú `-` alebo obidva obsahujú `_` a tento oddeľovač ich rozdelí na rovnaký počet častí, veľkosť písmen každej časti sa odvodí od zodpovedajúcej časti: `USER_id` s `account_key` dá `ACCOUNT_key` a `User-Name` s `account-key` dá `Account-Key`. Keď ich takto rozdelia `-` aj `_`, veľkosť písmen sa odvodí pre text ako celok.
  - Zhoda, ktorá neobsahuje žiadne písmená s rozlíšením veľkosti, napríklad `123`, ponechá náhradný text tak, ako je napísaný.
  - Zhoda zapísaná späť tak, ako bola, sa nezapočíta: keď je možnosť `Match Case` vypnutá, nahradenie `customer` textom `Customer` zapíše `customer`, `Customer` a `CUSTOMER` späť tak, ako boli, a žiadna z nich sa nezapočíta.
- Prázdne pole nahradenia zhodu odstráni.

Nahradenie je bežná úprava, rovnaká, ako keby ste sami napísali nový názov tabuľky, názov stĺpca, logický názov, komentár alebo text poznámky, premenovali index v paneli Vlastnosti tabuľky alebo premenovali skupinu tabuliek.  
Zaznamená sa do histórie a dostane sa k spolupracovníkom aj k programovaciemu agentovi ako každá iná úprava.

Názov tabuľky alebo stĺpca, ktorý nahradenie zapíše, sa preto stane vlastným názvom, ktorý logický názov zapísaný neskôr ponechá nezmenený, kým ho príkaz [Znova odvodiť fyzické názvy](./dictionary.md#derive-physical-names-again) nevráti slovníkom. Názov, ktorý nahradenie nechá prázdny, sa naopak vráti slovníkom ako každý vymazaný názov – pozrite si časť [Vlastné názvy](./dictionary.md#names-of-your-own).  
Kým je fyzický názov tabuľky alebo stĺpca prázdny alebo bol sám odvodený, nahradený logický názov ho odvodí pomocou slovníkov rovnako ako zatvorenie bunky logického názvu s novým logickým názvom – pozrite si časť [Odvodzovanie fyzických názvov](./dictionary.md#deriving-physical-names). Stĺpec, ktorého nový logický názov je termín, vtedy prevezme aj doménu termínu a s ňou aj typ údajov domény. To, čo sa odvodí, je súčasťou kroku histórie zmien nahradenia a nezapočítava sa do `Replaced N matches`.  
Keď jedno použitie `Replace All` prepíše logický názov aj názov tej istej tabuľky alebo stĺpca, názov, ktorý zapíše, má prednosť pred názvom, ktorý by odvodil nový logický názov.

## Klávesy v poliach hľadania {#keys-in-the-search-fields}

- V poli hľadania `Enter` prejde na ďalšiu zhodu a `Shift + Enter` na predchádzajúcu.
- V poli nahradenia `Enter` nahrádza, s klávesom `Shift` alebo bez neho, a `Ctrl + Enter` (Windows/Linux) alebo `⌘ + Enter` (Mac) nahradí všetko.
- Kým metóda vstupu v niektorom z polí skladá znaky, `Enter` patrí skladaniu znakov a neprechádza na zhodu ani nenahrádza.

Čo v týchto poliach robí `Escape`, klávesové skratky editora, ktoré stále fungujú, a každý ďalší kláves, opisuje časť [Klávesy v prieskumníkovi](./explorer.md#keys-in-the-explorer).

## Editory iba na čítanie {#read-only-editors}

V editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) hľadanie iba vyhľadáva. Nie je tam šípka `Toggle Replace` ani riadok `Replace`, takže chýba aj pole nahradenia, `Preserve Case`, `Replace` a `Replace All`.  
Pole hľadania, jeho tri možnosti, druhy textu, počet, výsledky aj prechod na zhodu fungujú. Prechod na zhodu vyberie to, na čom pristane, ako v časti [Prechod na zhodu](#going-to-a-match), a tento výber je jediný, ktorý editor iba na čítanie vytvorí: kliknutie na plátno bez pohybu ho zruší.  
Vyhľadávanie otvorte klávesom alebo položkou `Toggle Explorer` v rýchlom vyhľadávaní, keďže kontextová ponuka plátna tam položku `Toggle Explorer` nemá. Zvyšok prieskumníka opisuje časť [Editory iba na čítanie](./explorer.md#read-only-editors) na stránke Prieskumník.

Vo VS Code sa revízia diagramu, napríklad revízia v systéme Git alebo položka Local History, otvorí ako text JSON. Keď ju znova otvoríte ako diagram pomocou `Reopen Editor With...`, je iba na čítanie a má k dispozícii toto hľadanie bez nahrádzania.

## Zmena klávesovej skratky {#changing-the-shortcut}

Stránka, ktorá editor vkladá, môže skratku `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) pod názvom `findReplace` priradiť inému klávesu alebo odstrániť pomocou metódy [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Po odstránení skratky necháva editor tieto klávesy stránke na každej karte. Tlačidlo `Explorer` na paneli nástrojov naďalej otvára a zatvára prieskumníka a položka `Toggle Explorer` v rýchlom vyhľadávaní a v kontextovej ponuke plátna naďalej otvára hľadanie alebo zatvára prieskumníka, ale ani jedno z nich nezobrazuje klávesovú skratku, takže bublinový popis tlačidla znie iba `Explorer`. Ani riadok `Toggle Explorer` na karte [Klávesové skratky](./settings.md#shortcuts) karty Nastavenia nezobrazuje žiadny kláves. Po zmene priradenia všetky zobrazujú nový kláves.
