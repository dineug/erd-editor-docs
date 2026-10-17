---
sidebar_position: 7
description: Otvorenie palety príkazov na prepnutie karty, spustenie príkazu pre aktuálnu kartu, otvorenie alebo zatvorenie prieskumníka, zmenu motívu či jazyka zobrazenia alebo prechod na tabuľku, stĺpec, komentár alebo poznámku zadaním predpony.
---

# Rýchle vyhľadávanie

Rýchle vyhľadávanie je paleta príkazov editora.  
Zobrazuje príkazy dostupné na karte, na ktorej sa nachádzate. Ak hľadanie začnete znakom `#`, `@` alebo `:`, prehľadáte namiesto toho diagram a prejdete na tabuľku, stĺpec alebo komentár či poznámku.

Otvorte ho klávesovou skratkou `Ctrl + K` (Windows/Linux) alebo `⌘ + K` (Mac) alebo kliknite na tlačidlo `Search` na paneli nástrojov.  
Zatvorí ho tá istá klávesová skratka, ako aj `Esc` a kliknutie mimo panela. Jeho otvorenie zatvorí panel Vlastnosti tabuľky, [výber motívu](./language-and-theme.md#theme), výber jazyka [`Display Language`](./language-and-theme.md#picking-a-language), dialógové okno [`Export image`](./file-import-export.md#image) a dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns), pričom sa zahodí to, čo ste v ňom vybrali. Neotvorí sa, kým upravujete bunku tabuľky, poznámku alebo názov skupiny tabuliek.

Hneď za tlačidlom `Search` je na paneli nástrojov tlačidlo `Explorer`. Otvára alebo zatvára [prieskumníka](./explorer.md), strom diagramu ukotvený naľavo od plátna, v ktorého hornej časti je hľadanie a nahrádzanie.  
Otvorenie palety ponechá prieskumníka otvoreného a `Esc` potom zatvorí iba paletu. Stlačenie `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac) v palete ju zatvorí a presunie fokus klávesnice do poľa hľadania prieskumníka, pričom ak sa prieskumník nezobrazuje, otvorí ho s fokusom na jeho vyhľadávaní. Na rozdiel od položky `Toggle Explorer` táto klávesová skratka prieskumníka z palety nikdy nezatvorí – pozrite si časť [Otvorenie a zatvorenie](./explorer.md#opening-and-closing). Kým je otvorený prehliadač rozdielov, cestovanie v čase alebo ukážka automatického rozloženia, editor klávesovú skratku nespracuje: paleta zostane otvorená a skratka sa odovzdá prehliadaču alebo hostiteľskej aplikácii – pozrite si časť [Panel hľadania v prehliadači](./find-and-replace.md#the-browsers-find-bar).  
Hostiteľská aplikácia, ktorá editor vkladá, môže rýchle vyhľadávanie priradiť k inému klávesu a bublinový popis tlačidla `Search` potom zobrazuje tento kláves – pozrite si časť [Klávesové skratky](./settings.md#shortcuts).

![Otvorenie palety pomocou ⌘ + K, potom skok na tabuľku pomocou #pay, na stĺpec pomocou @price a na komentár tabuľky pomocou :address](/img/demo-quick-search.webp)

## Vyhľadávanie a navigácia {#searching-and-navigating}

Písaním zoznam filtrujete. Každé stlačenie klávesu znova prehľadá celý zoznam, ktorý máte pred sebou, takže odstránenie znakov alebo napísanie nového slova namiesto slova, ktoré nič nenašlo, vráti zodpovedajúce položky späť.  
Zhoda je približná a zahŕňa názov položky aj kľúčové slová zobrazené vedľa nej. Napríklad v podponuke `Import` nájde `sdl` položku `GraphQL`, `dbdiagram` položku `DBML` a `azimutt` položku `AML`. Aj drobný preklep svoju položku stále nájde, tak ako `tabel` nájde `New Table` a `imprt` nájde `Import`, ale položka, ktorá sa napísanému textu podobá iba vzdialene, sa vynechá: `memo` zobrazí iba `New Memo`. Položka, ktorej názov alebo kľúčové slová obsahujú napísaný text bez ohľadu na veľkosť písmen, sa zobrazí vždy a tá, ktorú približná zhoda nezachytí, nasleduje za približnými zhodami. Napísaný text sa zvýrazní všade, kde ho položka obsahuje, bez ohľadu na veľkosť písmen.  
V inom jazyku zobrazenia ako angličtina sa príkazy a položky podponúk nájdu aj podľa svojich anglických názvov a kľúčových slov, ktoré zoznam nezobrazuje, takže `new table` nájde `New Table` bez ohľadu na to, v akom jazyku sa zobrazuje.  
Zoznamom sa pohybujte klávesmi `↑` a `↓` – na oboch koncoch prechádza dokola – a zvýraznenú položku spustite klávesom `Enter`. Príkaz, ktorý má vlastnú klávesovú skratku, ju zobrazuje na konci svojho riadka: vpravo, prípadne vľavo, ak je jazyk zobrazenia písaný sprava doľava. Kým metóda vstupu ešte skladá znaky, napríklad uprostred kórejskej slabiky, patria `↑`, `↓` a `Enter` jej a nepresúvajú zvýraznenie ani nespúšťajú položku.

Položka, napríklad `Database`, `Import` alebo `Auto Layout`, otvorí podponuku: jej položky nahradia zoznam a vyhľadávacie pole sa vymaže. Podponuky položiek `Database`, `Bracket`, `Language`, oboch štýlov názvov, `Schema SQL: Statements`, `Schema SQL: Header`, `Theme` a `Display Language` majú začiarknutú aktuálnu voľbu a otvoria sa so zvýraznením na nej, takže `Enter` ju ponechá; ostatné podponuky sa otvoria bez zvýraznenej položky.  
Filtrovanie sa vždy vzťahuje iba na zoznam, ktorý máte pred sebou, a na vyššiu úroveň sa vrátiť nedá, takže na začatie odznova paletu zatvorte a znova otvorte. V podponuke sú `#`, `@`, `:` a `?` obyčajný text, nie [predpony](#searching-the-diagram).

## Čo paleta zobrazuje {#what-the-palette-lists}

Zoznam závisí od karty, na ktorej sa nachádzate. Zoznam na každej karte začína položkou `Tab`, ktorá prepne na `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator` alebo `Settings`, pričom vynechá kartu, na ktorej už ste.

Na karte ERD: `Database`, `Import`, `Import and Add` a `Export`, potom `New Table`, `New Memo`, `New Table Group` a `Group Selected Tables`, štyri typy vzťahov a `Auto Layout`. Tabuľky sa tu nezobrazujú; ak chcete [prejsť na niektorú z nich](#searching-the-diagram), napíšte `#`.  
Položka `Import and Add` sa vynechá v editore iba na čítanie a položka `New Memo`, kým [View Option](./table-related-functions.md#table-view-options) → `Memos` skrýva poznámky. Položka `New Table Group` začne kresliť [skupinu tabuliek](./table-groups.md) na plátne a položka `Group Selected Tables` vloží vybraté tabuľky do novej skupiny a otvorí úpravu jej názvu. Obe sa vynechajú v editore iba na čítanie a kým View Option → `Table Groups` skrýva skupiny, a položka `Group Selected Tables` navyše vyžaduje, aby bola vybratá aspoň jedna tabuľka. Ich riadky zobrazujú klávesy: `Alt + G` (Windows/Linux) alebo `⌥ + G` (Mac) pre [nakreslenie skupiny](./table-groups.md#drawing-a-group) a `T` a potom `G` pre [zoskupenie vybratých tabuliek](./table-groups.md#grouping-selected-tables).  
Tieto položky spúšťajú rovnaké príkazy ako kontextová ponuka plátna, okrem položky `Group Selected Tables`, ktorá zodpovedá položke `Group selected tables` v ponuke tabuľky; `View Option` a `Diff Viewer` sú iba v kontextovej ponuke. Položka `Export` ponúka rovnaké možnosti `json`, `Schema SQL` a `Image` ako kontextová ponuka a napísanie `png` alebo `svg` v nej nájde `Image`.  
Na stránke [Import a export súborov](./file-import-export.md) nájdete, čo robia jednotlivé formáty, funkcia [Importovať a pridať](./file-import-export.md#import-and-add) a [export obrázka](./file-import-export.md#image), a na stránke [Funkcie pre tabuľky](./table-related-functions.md#databases), na čo má vplyv voľba databázy.

Na karte Schéma SQL: opäť položka `Database` a položka `Bracket`, ktorá nastavuje znak úvodzoviek okolo názvov tabuliek, stĺpcov, obmedzení a indexov vo vygenerovanom SQL – `SingleQuote`, `DoubleQuote`, `Backtick` alebo `None` bez akýchkoľvek úvodzoviek. Potom položky `Schema SQL: Statements` a `Schema SQL: Header`, ktoré ponúkajú rovnaké voľby ako panel možností tejto karty, ale uvádzajú iba tie, ktoré vybratá databáza zapisuje, a položka `Schema SQL: Options panel`, ktorá tento panel zobrazí alebo skryje. Čo jednotlivé voľby zapisujú, nájdete na stránke [Schéma SQL](./schema-sql.md).

Na karte Generátor kódu: `Database`, `Bracket`, kým je nastavený jazyk `Doctrine`, `JPA` alebo `SeaORM`, potom `Language`, `Table Name Case`, `Column Name Case` a položka `Code Generator: Options panel`, ktorá zobrazí alebo skryje panel možností tejto karty. Čo vytvára každý cieľový jazyk, nájdete na stránke [Generátor kódu](./code-generator.md).

Karty Vizualizácia a Nastavenia nemajú vlastné príkazy, iba `Tab` a nižšie uvedené príkazy, ktoré zobrazuje každá karta.

Blízko konca zoznamu každej karty, aj v editore iba na čítanie, je položka `Toggle Explorer`, ktorá zobrazuje svoju klávesovú skratku `Ctrl + F` (Windows/Linux) alebo `⌘ + F` (Mac). Nájde ju aj napísanie `find`, `replace`, `rename`, `tree`, `outline` alebo `objects`.  
Jej spustenie zatvorí paletu a urobí to isté, čo klávesová skratka na plátne. Kým je tlačidlo `Explorer` na paneli nástrojov zobrazené ako stlačené, teda kým je prieskumník otvorený na karte ERD a nie je skrytý režimom Zen, zatvorí prieskumníka. Inak prepne na kartu ERD a otvorí prieskumníka s fokusom na jeho vyhľadávaní a s textovým kurzorom v poli hľadania – pozrite si časť [Otvorenie a zatvorenie](./explorer.md#opening-and-closing). Vynechá sa, kým je otvorený prehliadač rozdielov, cestovanie v čase alebo ukážka automatického rozloženia.

### Motív a jazyk zobrazenia {#theme-and-display-language}

Za položkou `Toggle Explorer` zobrazuje každá karta položky `Theme` a `Display Language`, aj v editore iba na čítanie. Každá z nich sa zobrazuje iba tam, kde editor ponúka príslušný výber, ako ukazujú tlačidlá `Theme` a `Display Language` na paneli nástrojov. Webová aplikácia, Google Drive, VS Code, IDE od JetBrains a Obsidian ponúkajú oba výbery – pozrite si časť [V jednotlivých hostiteľských aplikáciách](./language-and-theme.md#in-each-host).

Položka `Theme` otvorí možnosti `System`, `Light` a `Dark`, pričom aktuálny vzhľad je začiarknutý. Zvolená možnosť zmení iba vzhľad a ponechá odtieň sivej aj farbu zvýraznenia, rovnako ako tlačidlá `Appearance` vo výbere motívu.  
Položka `Display Language` otvorí možnosť `System` a potom 25 jazykov, každý s názvom vo svojom jazyku a v poradí výberu jazyka, pričom aktuálna možnosť je začiarknutá. Jazyk sa tu nájde aj podľa anglického názvu alebo kódu: `german` alebo `de-DE` nájde `Deutsch` a `korean` nájde `한국어`.  
Voľba v ktorejkoľvek z nich sa prejaví okamžite, zatvorí paletu a zostane zachovaná rovnako ako voľba vo výbere motívu alebo vo výbere jazyka `Display Language`. Ak sa jazyk zobrazenia zmení, kým je paleta otvorená, zoznam sa prepne do tohto jazyka a zachová napísaný text aj podponuku, v ktorej sa nachádzate.

## Vyhľadávanie v diagrame {#searching-the-diagram}

Ak hľadanie začnete predponou, prehľadáte namiesto príkazov diagram: `#` pre tabuľky, `@` pre stĺpce, `:` pre komentáre a poznámky alebo `?` na zobrazenie zoznamu predpôn. Predpona funguje na ktorejkoľvek karte. Platí iba ako prvý znak, pričom medzery pred ňou sa ignorujú. Medzera za ňou je voliteľná, takže `#users` a `# users` sú to isté hľadanie. Platia aj znaky plnej šírky `＃`, `＠`, `：` a `？`, ktoré píše japonská alebo čínska metóda vstupu.  
Kým je vstupné pole na najvyššej úrovni prázdne, riadok pod ním zobrazuje štyri predpony; kliknutím na predponu ju napíšete. Kým predpona platí, koniec vstupného poľa uvádza jej rozsah: `Tables`, `Columns`, `Comments & memos` alebo `Help`. Ak sa chcete vrátiť k príkazom, predponu odstráňte.

Predpona `#` zobrazí tabuľky, každú s označením `Table` vedľa nej, a tabuľka s prázdnym názvom sa zobrazí ako `unnamed`. Ak za `#` nie je nič, tabuľky sú zoradené podľa názvu. Text za `#` sa porovnáva iba s názvami tabuliek, približnou zhodou ako vyššie, a tabuľky, ktorých názov ho obsahuje, sú prvé. Názvy skupín tabuliek a názvy indexov sa neprehľadávajú pri žiadnej predpone; [hľadanie a nahrádzanie](./find-and-replace.md#what-it-searches) prehľadáva oboje.

Predpona `@` zobrazí stĺpce podľa názvu, každý s umiestnením uvedeným vedľa neho, napríklad `users.email · Column`. Text za `@` sa musí nachádzať v názve stĺpca bez ohľadu na veľkosť písmen; táto zhoda nie je približná. Text pred prvou bodkou `.` zúži hľadanie na tabuľky, ktorých názov ho obsahuje: `@users.em` zobrazí stĺpce obsahujúce `em` v tabuľkách, ktorých názov obsahuje `users`, `@users.` zobrazí stĺpce týchto tabuliek a `@.em` prehľadá všetky tabuľky. Ak za `@` nie je nič, stĺpce sa zobrazia bez filtrovania.

Predpona `:` zobrazí komentáre tabuliek, komentáre stĺpcov a poznámky, nikdy nie názvy. Každý riadok zobrazuje úryvok textu okolo zhody s označením `users · Table comment`, `users.email · Column comment` alebo `Memo` vedľa neho. Text za `:` sa musí nachádzať v komentári alebo poznámke bez ohľadu na veľkosť písmen, rovnako ako pri `@`. Ak za `:` nie je nič, zobrazia sa komentáre a poznámky, ktoré nie sú prázdne. Kým View Option → `Memos` skrýva poznámky, `:` nezobrazí žiadnu poznámku.

Predpony `@` a `:` zobrazujú svoje riadky v poradí, v akom sú v dokumente: tabuľku po tabuľke, komentár každej tabuľky pred jej stĺpcami v poradí stĺpcov a poznámky na konci.

Predpona `?` zobrazí `Tables`, `Columns` a `Comments & memos` a text za `?` ich filtruje. Zvolenie jednej z nich nahradí obsah vstupného poľa jej predponou a ponechá paletu otvorenú.

Zoznam s predponou obsahuje všetky zhody bez ohľadu na ich počet. Ak hľadanie s predponou nič nenájde, zoznam zostane prázdny a nezobrazí sa žiadna správa.

Zvolenie tabuľky, stĺpca, komentára alebo poznámky zatvorí paletu a prepne na kartu ERD, ak sa nachádzate na inej karte.  
Plátno sa posunie k zvolenému objektu, pokiaľ už nie je dobre viditeľný – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Tabuľka sa potom vyberie ako jediná a presunie sa dopredu, pričom fokus získa jej názov, pokiaľ fokus už nebol v tejto tabuľke.  
Poznámka sa vyberie ako jediná a presunie sa dopredu. Pri stĺpci alebo komentári sa jeho tabuľka vyberie ako jediná, presunie sa dopredu a fokus sa nastaví na bunku, ktorá obsahuje text, alebo na názov vedľa komentára, ktorý je skrytý [možnosťou zobrazenia tabuliek](./table-related-functions.md#table-view-options).  
Žiadny skok nezačne ani nedokončí práve kreslený vzťah.

Ak potrebujete možnosti `Match Case`, `Match Whole Word` alebo `Use Regular Expression` alebo chcete nahradiť text, použite [hľadanie a nahrádzanie](./find-and-replace.md) v hornej časti prieskumníka.

## Keď nezodpovedá žiadny príkaz {#when-no-command-matches}

Ak na najvyššej úrovni bez predpony žiadny zobrazený príkaz neobsahuje napísaný text bez ohľadu na veľkosť písmen, za príkazmi nasledujú tri riadky: `Search tables for "…"`, `Search columns for "…"` a `Search comments & memos for "…"`, každý s príslušnou predponou ako ikonou. Zvolený riadok napíše túto predponu pred váš text, takže z `users` sa stane `#users`. Paleta pritom zostane otvorená s týmito výsledkami.  
Ak hľadanie nenájde vôbec žiadny príkaz, nad zoznamom sa zobrazí správa `No commands match` a zoznam potom obsahuje iba tieto tri riadky. Ak nájde iba príkazy, ktoré text neobsahujú, zaradia sa na začiatok: na karte ERD bez vybratej tabuľky zobrazí hľadaný text `tables` pred tromi riadkami položky `New Table`, `Database` a tam, kde je k dispozícii, aj `New Table Group`. Keď je vybratá tabuľka, položka `Group Selected Tables`, ak je k dispozícii, obsahuje `tables`, takže sa tri riadky nezobrazia.  
Ak hľadanie v podponuke nič nenájde, zoznam zostane prázdny a nezobrazí sa žiadna správa.

## Vyhľadávanie v kórejčine {#searching-in-korean}

Hľadaný text, ktorý obsahuje písmo hangul, sa porovnáva aj podľa jednotlivých písmen, a to v príkazoch, v podponukách aj pri každej predpone.  
Každý medzistav, ktorým kórejská metóda vstupu prechádza, naďalej nachádza riadok, ku ktorému písaním smerujete, takže `ㅅ`, `사`, `상`, `사요` aj `사용` nájdu `사용자`. Hľadaný text zložený iba z počiatočných spoluhlások sa porovnáva s počiatočnými spoluhláskami slabík, pričom sa medzery preskakujú: `ㅅㅇㅈ` nájde `사용자` a `ㅈㅁ` nájde `주문 내역`. Zoskupenie spoluhlások, ktoré metóda vstupu v systéme Windows zloží z dvoch počiatočných spoluhlások napísaných za sebou, napríklad `ㅄ`, sa počíta ako tieto dve (`ㅂㅅ`), zatiaľ čo zdvojená spoluhláska, napríklad `ㄲ`, zostáva jedným písmenom. Text uložený v rozloženej podobe, ako sú názvy súborov v systéme macOS, sa porovnáva tak, ako keby bol zložený.  
Na prvom mieste sú riadky, ktorých celý text sa zhoduje s hľadaným textom písmeno po písmene alebo počiatočná spoluhláska po počiatočnej spoluhláske, potom riadky, ktoré ním začínajú, a potom riadky, ktoré ho obsahujú. Pri predponách `@` a `:` sú pred všetkými týmito riadkami riadky, ktoré obsahujú hľadaný text presne tak, ako bol napísaný, v poradí, v akom sú v dokumente. Zvýraznenie pokrýva celé slabiky, takže `상` zvýrazní `사용` v `사용자`.
