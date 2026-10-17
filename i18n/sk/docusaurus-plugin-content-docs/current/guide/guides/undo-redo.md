---
sidebar_position: 13
description: Vrátenie späť a opätovné vykonanie úprav, čo zaznamenáva história a prechádzanie históriou pomocou cestovania v čase.
---

# Vrátiť späť, znova vykonať

Môžete sa vrátiť do predchádzajúceho stavu úprav alebo prejsť dopredu do neskoršieho.  
História uchováva až `2048` zmien.

- Vrátiť späť: `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac)
- Znova vykonať: `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Shift + Z` (Mac)

Panel nástrojov ponúka tie isté dva príkazy ako tlačidlá `Undo` a `Redo` vedľa tlačidla `Time Travel`.  
Zvýraznia sa, iba keď je čo vrátiť späť alebo znova vykonať. Editor s atribútom `readonly` skryje všetky tri a klávesové skratky nemajú žiadny účinok.

Príkazy Vrátiť späť a Znova vykonať fungujú iba na karte ERD. Na kartách Vizualizácia, Schéma SQL, Generátor kódu a Nastavenia nie sú k dispozícii. V poliach `Before tables` a `After tables` na karte Schéma SQL tie isté klávesy namiesto toho vracajú späť a znova vykonávajú písanie v danom poli.  
Klávesové skratky sú neaktívne aj vtedy, keď je otvorené rýchle vyhľadávanie, `Table Properties`, `Diff Viewer`, ukážka `Auto Layout`, dialógové okno [`Export image`](./file-import-export.md#image), dialógové okno [Mapovať stĺpce](./relationship-editing.md#map-columns) alebo cestovanie v čase.  
Fungujú ďalej, kým je fokus klávesnice kdekoľvek v [prieskumníkovi](./explorer.md#keys-in-the-explorer) vrátane jeho stromu a kým je otvorený [výber farby](./table-related-functions.md#table-and-memo-color-specification). Aj keď je textový kurzor v niektorom z ich polí, napríklad v poli hľadania, v poli nahradenia alebo v poli `Hex`, vracajú späť a znova vykonávajú úpravy diagramu, a nie textu v poli.

História sa uchováva v pamäti počas aktuálnej relácie. Neukladá sa do dokumentu, takže znova otvorený diagram začína s prázdnou históriou.

![Presun tabuľky a odstránenie stĺpca pomocou ⌥ + Backspace, potom vrátenie oboch úprav späť pomocou ⌘ + Z a ich opätovné vykonanie pomocou ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Čo zaznamenáva história {#what-the-history-records}

Zaznamenáva sa:

- Tabuľky a poznámky: pridanie, odstránenie, presun, farba, názov a komentár, text a veľkosť poznámky.
- Skupiny tabuliek: pridanie, odstránenie, presun, zmena veľkosti, názov, farba a to, do ktorej skupiny patrí každá tabuľka – pozrite si stránku [Skupiny tabuliek](./table-groups.md).
- Stĺpce: pridanie, odstránenie, zmena poradia a každá možnosť stĺpca.
- Vzťahy: pridanie, odstránenie, zmena typu, stĺpce nastavené v dialógovom okne [Mapovať stĺpce](./relationship-editing.md#map-columns) a každá voľba z položky `On Delete` alebo `On Update` – pozrite si časť [ON DELETE a ON UPDATE](./relationship-editing.md#on-delete-and-on-update). Vrátenie odstránenia späť obnoví vzťah aj s jeho akciami ON DELETE a ON UPDATE.
- Indexy a ich stĺpce.
- Poloha zobrazenia, úroveň priblíženia a prepínače `View Option`.
- Skripty `Before tables` a `After tables` na karte Schéma SQL, jeden krok za každú úpravu, ktorú použijete opustením poľa – pozrite si časť [Skripty pred tabuľkami a za nimi](./schema-sql.md#before-and-after-scripts).
- Import súboru a pridanie súboru pomocou položky [`Import and Add`](./file-import-export.md#import-and-add).

Nezaznamenáva sa:

- Databázový systém a názov databázy.
- Jazyk na karte Generátor kódu, `Table Name Case` a `Column Name Case`.
- Typ úvodzoviek, či už je nastavený na karte Schéma SQL, alebo na karte Generátor kódu.
- Voľby `Statements`, `Header` a `Tables` na karte Schéma SQL, ktoré patria k oknu editora – pozrite si časť [Panel možností](./schema-sql.md#options-panel).
- Všetko na karte Nastavenia vrátane riadkov [`Lock`](./settings.md#lock).
- Motív a jazyk zobrazenia – pozrite si stránku [Jazyk a motív](./language-and-theme.md).
- To, ktorá tabuľka, poznámka alebo skupina sa vykresľuje pred ostatnými.
- [Prieskumník](./explorer.md): jeho otvorenie, zatvorenie alebo zmena veľkosti, zbalenie jeho stromu a hľadaný text a možnosti hľadania. To, čo zmenia `Replace` a `Replace All`, sa však zaznamenáva, a rovnako aj posunutie, ktoré vykoná prechod – pozrite si časť [Jedno gesto, jeden krok](#one-gesture-one-step).
- Zmena priblíženia a posúvanie zobrazenia na karte Vizualizácia v ktoromkoľvek režime, presúvanie uzlov grafu alebo kartičiek režimu Flow, tlačidlo `Tidy Up`, zobrazenie riadkov a zameranie na tabuľky – pozrite si časť [Režim Flow nikdy neupravuje dokument](./visualization.md#flow-never-edits-the-document).

Zmenu čohokoľvek z toho nemožno vrátiť späť.

Nezaznamenávajú sa ani zmeny, ktoré prichádzajú z iného editora, takže príkaz Vrátiť späť vracia iba vaše vlastné zmeny. V [relácii spoločných úprav](../../api/advanced/collaborative-editing.md) vracia každý editor späť svoje vlastné zmeny a programovací agent, ktorý upravuje cez [server MCP](../../mcp/live-and-headless.md#undo), vracia späť svoje pomocou nástroja `erd_undo`.

Keď vrátite späť import cez položku `Import`, ktorý nahrádza celý diagram, obnoví sa predchádzajúci diagram v stave, v akom ho editor mal v čase importu, pričom každé [zamknutie](./settings.md#lock) je zapnuté alebo vypnuté a každá zamknutá hodnota nastavená tak, ako to bolo vtedy.  
Ak mal tento diagram zamknuté nastavenie `Viewport`, zobrazenie a priblíženie sa vrátia na zamknuté zobrazenie, kde sa diagram otvára, a nie tam, kde ste boli. Pri odomknutom nastavení `Viewport` sa vrátia tam, kde ste boli v čase importu. Ostatné zamknuté nastavenia, napríklad karta, na ktorej sa nachádzate, alebo jazyk na karte Generátor kódu, zostanú tak, ako ich máte na obrazovke.  
Nový diagram začína so všetkými zamknutiami zapnutými. Ak si chcete pri takomto vrátení späť zachovať svoje zobrazenie, pred importom odomknite nastavenie `Viewport`. Jeho neskoršie odomknutie ani import súboru JSON, ktorého vlastné zamknutie `Viewport` je vypnuté, nezmení, kam vás vrátenie späť presunie.

## Jedno gesto, jeden krok {#one-gesture-one-step}

Všetko, čo vyvolá jedno gesto, tvorí jeden záznam histórie.  
Prilepenie viacerých tabuliek a poznámok naraz alebo ich duplikovanie pomocou `Alt + drag` sa vráti späť jedným krokom.

Stlačenie klávesu `Delete` alebo `Backspace`, prípadne položka `Delete selected` alebo `Delete columns` v kontextovej ponuke, je jeden krok bez ohľadu na to, koľko tabuliek, poznámok, skupín tabuliek alebo stĺpcov odstráni.  
Prepnutie primárneho kľúča na viacerých vybratých stĺpcoch je jeden krok, či už pomocou `Alt + K` (Windows/Linux) alebo `⌥ + K` (Mac), alebo pomocou položky `Primary Key on selected columns` v kontextovej ponuke tabuľky.  
Nastavenie farby výberu alebo jej odstránenie pomocou `No color` alebo `Remove color` je jeden krok bez ohľadu na to, koľko tabuliek, poznámok a skupín je vybratých. Zvolenie farby, ktorú už má všetko vybraté, nezaznamená žiadny krok a nezaznamená ho ani `No color`, keď nič z vybratého nemá farbu.  
Stlačenie tlačidla `Map` alebo `Save` v dialógovom okne [Mapovať stĺpce](./relationship-editing.md#map-columns) je jeden krok spolu so stĺpcami cudzieho kľúča, ktoré pridá, a typmi údajov, ktoré zmení.  
Položka `Import and Add` je jeden krok spolu s posunutím zobrazenia na pridaný blok, ak je potrebné.

Vytvorenie [skupiny tabuliek](./table-groups.md), či už jej nakreslením, alebo zoskupením vybratých tabuliek pomocou položky `Group selected tables` alebo `T` a potom `G`, je jeden krok spolu so všetkými tabuľkami, ktoré zahrnie. Odstránenie skupiny je jeden krok a jeho vrátenie späť obnoví skupinu aj s tabuľkami v nej.  
Presunutie skupiny myšou za jej záhlavie presunie skupinu a všetky jej tabuľky jedným krokom. Tabuľky pustené do skupiny alebo mimo nej zmenia skupinu v tom istom kroku ako ich presun, keď uvoľníte tlačidlo približne do `200ms` od posledného pohybu, takže jedno vrátenie späť ich umiestni späť tam, kde boli, a do skupín, v ktorých boli. Po dlhšej pauze pred uvoľnením tlačidla je zmena skupiny samostatným krokom a prvé vrátenie späť zruší iba túto zmenu.  
Zmena veľkosti skupiny ťahaním za okraj alebo roh sa zaznamená raz, keď uvoľníte tlačidlo.  
Použitie [automatického rozloženia](./table-related-functions.md#auto-layout) je jeden krok vrátane skupín, ktoré prispôsobí ich tabuľkám.

Aj príkaz `Replace All` v [hľadaní a nahrádzaní](./find-and-replace.md#replacing) je jeden krok bez ohľadu na to, koľko názvov tabuliek, názvov stĺpcov, názvov indexov, názvov skupín tabuliek, komentárov a poznámok zmení. Keď nič nezmení, napríklad keď `Preserve Case` zapíše každú zhodu späť tak, ako bola, nezaznamená žiadny krok.  
Jedno použitie príkazu `Replace` je jeden krok vrátane posunutia na ďalšiu zhodu, keď ho táto zhoda vyžaduje. Keď zapíše svoju zhodu späť tak, ako bola, zaznamená iba toto posunutie, alebo nič, keď k nemu nedôjde.  
Prechod na zhodu posunie plátno, iba keď zhoda ešte nie je dobre viditeľná – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Toto posunutie sa zaznamená ako každá iná zmena polohy zobrazenia, takže po prechádzaní zhodami príkaz Vrátiť späť najprv vráti späť tieto posunutia, po jednom v každom kroku.  
Ostatné prechody, ktoré vedú na plátno, zaznamenávajú svoje posunutia rovnako: zvolenie riadka v prieskumníkovi, výsledku rýchleho vyhľadávania alebo [tlačidla na kartičke](./visualization.md#card-buttons) pre externý odkaz v režime Flow. Prechod, ktorý ponechá zobrazenie na mieste, nezaznamená nič. Nič nezaznamená ani zvolenie riadka v zozname okna `Diff Viewer`, pretože posúva iba vlastné strany prehliadača rozdielov, ktoré sú iba na čítanie.

Súvislé ťahanie, posúvanie plátna, zmena priblíženia, stiahnutie prstov alebo zmena farby sa približne `200ms` zhromažďuje a tiež sa zapíše ako jeden záznam.  
Presunutie myšou s celkovým posunom menším ako `20px` nezaznamená žiadny presun. Zaznamená sa iba zmena skupiny, ktorú prípadne spôsobí.

Písanie do bunky alebo poznámky sa zaznamenáva po jednotlivých vstupoch, a nie po gestách: každý napísaný znak, každé prilepenie a každý krok skladania znakov cez IME je samostatný krok.  
Názov skupiny tabuliek sa zaznamená raz, keď ho uloží kláves `Enter` alebo opustenie poľa, takže názov, ktorý zadáte do práve vytvorenej skupiny, je krok oddelený od jej vytvorenia. Kláves `Esc` ani nezmenený názov nezaznamenajú nič.

## Cestovanie v čase {#time-travel}

Otvára sa tlačidlom `Time Travel` na paneli nástrojov vedľa tlačidiel Vrátiť späť a Znova vykonať.  
Tlačidlo nemá žiadny účinok, kým relácia neobsahuje aspoň jednu zaznamenanú zmenu.

Cestovanie v čase otvorí samostatnú kópiu diagramu iba na čítanie s polohou zobrazenia a úrovňou priblíženia, ktoré plátno práve ukazuje, bez ohľadu na to, či je zamknutie `Viewport` zapnuté.  
Ťahajte posúvač alebo kliknite kamkoľvek na jeho dráhu, ak sa chcete pohybovať celou históriou úprav a zobraziť ukážku každého bodu. Krajná ľavá poloha posúvača zodpovedá stavu jeden krok pred prvou zaznamenanou zmenou a pri otvorení je jazdec na aktuálnom stave.  
Ukážka je neaktívna: vykresľuje minimapu, ale nemôžete ju posúvať ťahaním ani rolovaním, ani ju upravovať, a skutočný dokument zostane nedotknutý, kým vybratý bod nepoužijete.

Stlačte tlačidlo `Apply`, ak chcete obnoviť vybratý bod, alebo tlačidlo `Cancel` či kláves `Esc`, ak chcete ponechať dokument bez zmeny.

![Otvorenie cestovania v čase, ťahanie posúvača späť v rámci relácie a použitie skoršieho bodu](/img/demo-time-travel.webp)
