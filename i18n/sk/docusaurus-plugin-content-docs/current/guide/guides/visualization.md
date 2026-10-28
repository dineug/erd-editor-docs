---
sidebar_position: 11
description: Preskúmanie schémy ako silovo riadeného grafu v režime Graph alebo ako kartičiek tabuliek v režime Flow – zmena priblíženia a posúvanie zobrazenia, zvýraznenie tabuliek súvisiacich s danou tabuľkou, zameranie naraz na niekoľko tabuliek a postupný návrat k predchádzajúcim zameraniam.
---

# Vizualizácia

Zobrazuje prehľad celého dokumentu v jednom z dvoch režimov:

- `Graph`, silovo riadený graf všetkých tabuliek, ich stĺpcov a vzťahov medzi nimi – pozrite si časť [Režim Graph](#graph-mode).
- `Flow`, každá tabuľka vykreslená ako kartička a rozmiestnená podľa svojich vzťahov – pozrite si časť [Režim Flow](#flow-mode).

Otvorte ju z karty `Visualization` na paneli nástrojov hore alebo z [rýchleho vyhľadávania](./quick-search.md) cez položku `Tab`.  
Na karte ERD ju klávesová skratka `Alt + F` (Windows/Linux) alebo `⌥ + F` (Mac) a položka `Focus on this table` v kontextovej ponuke tabuľky otvoria priamo v režime `Flow`, zúženú na tabuľky, ktoré ste vybrali, a na tabuľky vzdialené o jeden vzťah – pozrite si časť [Zameranie na tabuľky](#focusing-on-tables).

Medzi režimami prepínajte tlačidlami `Graph` a `Flow` na ľavom konci [panela nástrojov](#toolbar).  
Novo otvorený editor začína v režime `Graph`. Režim, ktorý zvolíte, zostane zachovaný, kým je editor otvorený, aj pri prechode na iné karty, no neukladá sa do dokumentu.

## Panel nástrojov {#toolbar}

Nad stredom spodného okraja karty sa vznáša panel nástrojov. Zľava doprava:

- `Graph` a `Flow`, pričom aktuálny režim je zvýraznený.
- `Previous table` a `Next table`, iba v režime `Flow`: šípka doľava a šípka doprava, ktorými sa prechádza o krok späť a dopredu cez tabuľky, na ktoré bol režim Flow zúžený – pozrite si časť [Predchádzajúca a nasledujúca tabuľka](#previous-table-and-next-table). Každá je stlmená, kým týmto smerom nie je kam prejsť.
- `Zoom out`, aktuálne priblíženie v percentách, napríklad `100%`, a `Zoom in`. Každé stlačenie zmení priblíženie o 4 percentuálne body, pričom stred obrazovky zostane na mieste. Percentá ukazujú priblíženie režimu, v ktorom sa nachádzate, a kliknutím na ne sa toto priblíženie vráti na `100%`.
- `Fit`, ktorým sa do zobrazenia dostane všetko, čo režim ukazuje: každý uzol v režime `Graph`, každá kartička v režime `Flow`.
- `Tidy Up`, iba v režime `Flow`, ktorým sa kartičky znova rozmiestnia – pozrite si časť [Ako režim Flow rozmiestňuje kartičky](#how-flow-is-placed).
- Ponuka zobrazenia riadkov, iba v režime `Flow`, označená aktuálnou voľbou – pozrite si časť [Zobrazenie riadkov](#row-display).
- Zoznam `Name View`, iba v režime `Flow`, označený aktuálnym zobrazením – pozrite si časť [Názvy na kartičkách](#names-on-the-cards).
- `Show all`, iba v režime `Flow` a iba vtedy, keď je zobrazenie zúžené, ktorým sa vrátite k celému diagramu – pozrite si časť [Zameranie na tabuľky](#focusing-on-tables).
- Kompas `Go to content`, ktorý sa pripojí na koniec panela nástrojov iba vtedy, keď na obrazovke nie je žiadny uzol ani kartička. Zobrazuje šípku smerujúcu k najbližšiemu uzlu alebo kartičke a údaj o tom, ako je ďaleko, napríklad `1.2k`. Kliknutím naň presuniete tento uzol alebo kartičku do stredu bez zmeny priblíženia.

Tlačidlá priblíženia a obe šípky uvádzajú svoje klávesové skratky v bublinových popisoch, napríklad `Zoom in (Ctrl + Plus)` (Windows/Linux) alebo `Zoom in (⌘ + Plus)` (Mac) a `Previous table (Ctrl + Z)` (Windows/Linux) alebo `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` a `Ctrl + Minus` (Windows/Linux) alebo `⌘ + Plus` a `⌘ + Minus` (Mac) menia priblíženie po krokoch rovnako ako tlačidlá, v oboch režimoch, a `Ctrl + 0` (Windows/Linux) alebo `⌘ + 0` (Mac) ho vráti priamo na `100%`. V režime `Flow` prechádzajú `Ctrl + Z` a `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Z` a `⌘ + Shift + Z` (Mac) po krokoch rovnako ako obe šípky.  
Kliknutie na percentá má rovnaký účinok ako `Ctrl + 0` (Windows/Linux) alebo `⌘ + 0` (Mac) a ich bublinový popis túto skratku uvádza. Kým je otvorené rýchle vyhľadávanie, klávesové skratky nemajú žiadny účinok.

## Režim Graph {#graph-mode}

Vykresľuje celý dokument ako silovo riadený graf, takže jediným pohľadom zistíte, ako tabuľky navzájom súvisia a ktoré z nich sú v strede domény.

![Otvorenie režimu Graph, podržanie ukazovateľa nad tabuľkou na zobrazenie jej ukážky, presunutie uzla myšou, oddialenie a opätovné priblíženie](/img/demo-visualization.webp)

### Čítanie grafu {#reading-the-graph}

Každá tabuľka a každý stĺpec je uzol a oba druhy sa vykresľujú rôznymi farbami. Poznámky a [skupiny tabuliek](./table-groups.md) sa nevykresľujú.  
Každý uzol stĺpca je prepojený s tabuľkou, do ktorej patrí, a dve tabuľky spojené vzťahom sú prepojené navzájom.  
Tabuľky spojené viacerými vzťahmi v rovnakom smere sú prepojené iba raz a vzťah, ktorý začína a končí v tej istej tabuľke, nevykreslí žiadne prepojenie.

Názvy tabuliek sa na grafe objavujú pri približovaní, pričom sa medzi `50%` a `100%` postupne zviditeľňujú, a názov dlhší ako 15 znakov sa skráti. Uzly stĺpcov nemajú popis pri žiadnej úrovni priblíženia.  
Popisy sa riadia Zobrazením názvov – pozrite si časť [Mimo plátna](./logical-names.md#beyond-the-canvas). V zobrazení `Both Names` dáva popis logický názov na jeden riadok a fyzický názov na riadok pod ním a každý riadok sa skracuje samostatne.

### Pohyb v grafe {#getting-around-the-graph}

Koliesko myši mení priblíženie okolo bodu pod ukazovateľom, od `10%` do `400%`.  
Stiahnutie prstov na touchpade mení priblíženie rovnako a dva prsty na dotykovej obrazovke menia priblíženie okolo bodu medzi nimi a pri pohybe posúvajú zobrazenie.  
Zobrazenie posúvajte ťahaním pozadia alebo ťahaním stredným tlačidlom myši odkiaľkoľvek, aj z uzla, rovnako ako na [plátne ERD](./table-related-functions.md#getting-around-the-canvas). Ťahanie stredným tlačidlom iba posúva zobrazenie: uzlom nikdy nepohne.

Tlačidlá priblíženia na [paneli nástrojov](#toolbar) a klávesové skratky priblíženia namiesto toho držia na mieste stred obrazovky, v rovnakom rozsahu, a tlačidlo `Fit` dostane do zobrazenia všetky uzly.

### Ukážka pri podržaní ukazovateľa {#hover-preview}

Podržte ukazovateľ nad uzlom tabuľky a vedľa kurzora sa zobrazí ukážka tejto tabuľky.  
Podržanie ukazovateľa nad uzlom stĺpca okolo neho iba vykreslí krúžok; žiadna ukážka sa neotvorí.

Ukážka zobrazuje tie isté stĺpce a bunky ako plátno ERD, v rovnakom poradí, a pomenúva ich tak ako plátno v Zobrazení názvov, v ktorom sa nachádzate – pozrite si časti [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options), [Úprava poradia stĺpcov](./settings.md#adjusting-column-order) a [Zobrazenie názvov](./logical-names.md#name-view).  
Keď je zapnutá možnosť zobrazenia `Alternate Key`, každý stĺpec [alternatívneho kľúča](./table-related-functions.md#alternate-keys) má na konci riadka svoje označenie, napríklad `AK1.1`, a ukážka sa kvôli nemu rozšíri, rovnako ako tabuľka na plátne ERD.  
Na rozdiel od tabuľky na plátne ERD jej hlavička nikdy nepreberá farbu [skupiny](./table-groups.md#coloring-a-group), do ktorej tabuľka patrí, a jej názvy nikdy nenesú [označenia](./dictionary.md#marks-on-the-canvas), ktoré kontroly slovníkov umiestňujú na plátno.  
Slúži iba na zobrazenie a počas presúvania uzla myšou alebo posúvania zobrazenia je skrytá.

### Zvýraznenie okolia {#highlighting-a-neighbourhood}

Podržanie ukazovateľa nad tabuľkou zvýrazní aj jej okolie: samotnú tabuľku, jej vlastné stĺpce, tabuľky, s ktorými ju spájajú jej vzťahy v ktoromkoľvek smere, a prepojenia medzi nimi.  
Všetko ostatné na grafe vybledne, takže to, s čím tabuľka súvisí, vynikne samostatne.

### Presúvanie uzlov {#moving-nodes}

Ak uzol presuniete myšou s ľavým tlačidlom, potiahnete ho spolu so všetkým, čo je s ním prepojené, na novú pozíciu.  
Kým ho držíte, uzol zostáva pripnutý pod ukazovateľom a rozloženie sa okolo neho znova rozhýbe.  
Keď ho pustíte, uzol sa znova ustáli – nič nezostane pripnuté na mieste, kde ste ho pustili.  
Stlačenie alebo ťahanie pravým tlačidlom na uzle ho nepotiahne ani neposunie zobrazenie.

### Graf je snímka stavu {#the-graph-is-a-snapshot}

Graf sa zostaví z dokumentu v stave, v akom je v okamihu otvorenia tejto karty, a pri každom návrate na ňu sa zostaví úplne odznova.  
Prepnutie z režimu `Flow` do režimu `Graph` ho tiež zostaví odznova a každé nové zostavenie začína opäť na `100%`.

## Režim Flow {#flow-mode}

Vykresľuje každú tabuľku ako kartičku a kartičky rozmiestňuje podľa ich vzťahov. Poznámky a [skupiny tabuliek](./table-groups.md) sa nevykresľujú.  
Nejde o rozloženie `Flow` [automatického rozloženia](./table-related-functions.md#auto-layout), ktoré presúva samotné tabuľky na karte ERD.

Každá kartička sa vykresľuje ako tabuľka na karte ERD: farba tabuľky pozdĺž ľavého okraja, hlavička s ikonou tabuľky a názvami tabuľky tak, ako ich ukazuje [Zobrazenie názvov](#names-on-the-cards), a potom riadky, ktoré určuje [zobrazenie riadkov](#row-display). Na rozdiel od tabuľky na karte ERD kartička vykresľuje aj čiaru medzi svojimi riadkami a jej hlavička nikdy nepreberá farbu [skupiny](./table-groups.md#coloring-a-group), do ktorej tabuľka patrí. Kartičky si tento vzhľad zachovávajú pri každom priblížení a nikdy sa nezbalia na svoj názov, ako to robia tabuľky na karte ERD pri `70%` a menej. Na kartičke nemožno nič upraviť.

Spojnica je jedna plynulá krivka od tabuľky k tabuľke, vykreslená pod kartičkami, takže môže prechádzať za niektorou z nich. Vzťah tabuľky so sebou samou sa ohýba okolo pravého horného rohu kartičky, rovnako ako na karte ERD – pozrite si časť [Vedenie spojníc](./relationship-editing.md#connector-routing). Každá spojnica sa vykresľuje ako rovnaká plná sivá čiara bez ohľadu na to, či je vzťah identifikujúci, s rovnakými značkami na koncoch ako na karte ERD – pozrite si časť [Čítanie spojnice](./relationship-editing.md#reading-a-connector). Režim Flow vykresľuje spojnice, aj keď je vypnutá [možnosť zobrazenia](./table-related-functions.md#table-view-options) `Relationship`. Nikdy nevykresľuje popisy `D:` a `U:` akcií ON DELETE a ON UPDATE vzťahu ani nezobrazuje bublinový popis, ktorý ich vypisuje, bez ohľadu na nastavenie možnosti zobrazenia `Referential Actions`.

V zobrazení celého diagramu sa tabuľky, ktoré žiadny vzťah nespája s inou tabuľkou, zhromaždia do jedného bloku namiesto toho, aby boli rozptýlené medzi ostatnými.

![Prepnutie do režimu Flow, podržanie ukazovateľa nad orders na zvýraznenie tabuľky a jej susedov, pripnutie zvýraznenia, výber Keys only, potom priblíženie pomocou ⌘ + Wheel a stlačenie Fit](/img/demo-visualization-flow.webp)

### Zobrazenie riadkov {#row-display}

Ponuka zobrazenia riadkov na [paneli nástrojov](#toolbar) určuje, koľko z každej kartičky sa vykreslí. Jej označením je aktuálna voľba a jej bublinový popis znie napríklad `Row display: Name only`.  
Ponuka sa otvorí nad panelom nástrojov so značkou začiarknutia pri aktuálnej voľbe. Zatvorí sa, keď niektorú voľbu vyberiete, znova kliknete na označenie, kliknete kdekoľvek inde v editore, stlačíte `Escape` alebo prepnete do režimu `Graph`.

| Zobrazenie riadkov | Čo zobrazuje každá kartička |
| --- | --- |
| `Name only` | Iba hlavičku. |
| `Keys only` | Stĺpce primárneho kľúča a cudzieho kľúča a navyše každý ďalší stĺpec, na ktorom končí vzťah. |
| `All fields` | Všetky stĺpce. |

Riadky sú uvedené v poradí stĺpcov tabuľky. Každý riadok zobrazuje názov stĺpca, pred ktorým je ikona kľúča, ak je stĺpec primárnym kľúčom, cudzím kľúčom alebo oboma, a vpravo typ údajov, či už je kartička [zvýraznená](#lighting-related-tables), alebo nie. [Zobrazenie názvov](#names-on-the-cards) určuje, ktoré názvy riadok zobrazuje a či zobrazuje doménu stĺpca.  
Žiadna iná bunka ani označenie alternatívneho kľúča sa nevykresľuje a na kartičky sa nevzťahujú ani [Možnosti zobrazenia tabuliek](./table-related-functions.md#table-view-options), ani [Úprava poradia stĺpcov](./settings.md#adjusting-column-order), ktorá určuje poradie buniek v riadku.

Keď sa režim Flow otvorí prvýkrát, začína s voľbou `Name only` alebo s voľbou `Keys only`, ak ho otvorilo [zameranie na tabuľky](#focusing-on-tables). Potom sa zobrazenie riadkov zmení iba vtedy, keď vyberiete inú voľbu, a zúženie alebo rozšírenie zobrazenia ho zachová.  
Zmena zobrazenia riadkov mení veľkosť kartičiek, preto ich režim Flow znova rozmiestni a prispôsobí oknu.

### Názvy na kartičkách {#names-on-the-cards}

Kartička pomenúva svoju tabuľku a stĺpce v Zobrazení názvov, v tom istom, v ktorom vykresľuje karta ERD – pozrite si časť [Zobrazenie názvov](./logical-names.md#name-view).  
Tu ho prepnete zoznamom `Name View` na [paneli nástrojov](#toolbar). Jeho tlačidlo uvádza aktuálne zobrazenie, `Physical Names`, `Logical Names` alebo `Both Names`, a jeho bublinový popis znie `Name View`. Zoznam sa otvorí nad panelom nástrojov so značkou začiarknutia pri aktuálnom zobrazení a zatvára sa rovnako ako ponuka [zobrazenia riadkov](#row-display). Výber prepne celý editor vrátane karty ERD, rovnako ako prepnutie vykonané kdekoľvek inde – pozrite si časť [Prepnutie zobrazenia](./logical-names.md#switching-the-view).

Kartičky usporadúvajú svoje bunky iba podľa Zobrazenia názvov. Žiadna [možnosť zobrazenia](./table-related-functions.md#table-view-options) ich nemení vrátane možnosti `Domain`:

| Zobrazenie názvov | Hlavička | Každý riadok |
| --- | --- | --- |
| `Physical Names` | Názov tabuľky. | Názov stĺpca, potom typ údajov. |
| `Logical Names` | Logický názov tabuľky. | Logický názov stĺpca, potom názov jeho [domény](./dictionary.md#domains-and-data-types) alebo jeho typ údajov, kým žiadnu doménu nemá. |
| `Both Names` | Logický názov, potom tlmený názov tabuľky. | Logický názov, fyzický názov, doména a typ údajov. |

Kým je logický názov prázdny, zobrazenie `Logical Names` ukazuje na jeho mieste stlmený fyzický názov alebo zástupný text `table` či `column`, keď je prázdny aj fyzický názov, a zobrazenie `Both Names` ukazuje stlmený zástupný text `logical`. V zobrazení `Both Names` ukazuje stĺpec bez domény stlmený zástupný text `domain`.  
Kartička nikdy nenesie [označenia](./dictionary.md#marks-on-the-canvas), ktoré kontroly slovníkov umiestňujú na názvy na karte ERD.  
Prepnutie Zobrazenia názvov mení veľkosť kartičiek, preto ich režim Flow znova rozmiestni – pozrite si časť [Ako režim Flow rozmiestňuje kartičky](#how-flow-is-placed).

### Pohyb v režime Flow {#getting-around-the-flow}

Koliesko myši posúva zobrazenie a `Shift + Wheel` ho posúva do strán. `Ctrl + Wheel` (Windows/Linux) alebo `⌘ + Wheel` (Mac) mení priblíženie, pričom stred obrazovky zostáva na mieste.  
Stiahnutie prstov na touchpade mení priblíženie okolo bodu, kde prsty sťahujete, a dva prsty na dotykovej obrazovke menia priblíženie okolo bodu medzi nimi a pri pohybe posúvajú zobrazenie.  
Zobrazenie posúvajte ťahaním pozadia alebo ťahaním stredným tlačidlom myši odkiaľkoľvek, aj z kartičky. Ťahanie stredným tlačidlom iba posúva zobrazenie a výber ponechá tak, ako je. Posúvanie nemá hranice, rovnako ako na [plátne ERD](./table-related-functions.md#getting-around-the-canvas).  
Priblíženie sa pohybuje od `10%` do `150%`. Režim Flow si udržiava vlastné priblíženie a posunutie zobrazenia, nezávislé od karty ERD, a ani jedno sa neukladá do dokumentu.

Stlačenie tlačidla myši na pozadí zruší výber a `Ctrl + drag` (Windows/Linux) alebo `⌘ + drag` (Mac) na pozadí nakreslí výberový rámec.  
Režim Flow nemá minimapu ani posúvacie pruhy. Keď po posunutí nezostane na obrazovke žiadna kartička, použite kompas `Go to content` na [paneli nástrojov](#toolbar).

### Zvýraznenie súvisiacich tabuliek {#lighting-related-tables}

Podržaním ukazovateľa nad kartičkou zvýrazníte samotnú kartičku, tabuľky vzdialené od nej o jeden vzťah a spojnice, ktoré ju s týmito tabuľkami spájajú. Spojnica medzi dvoma z týchto tabuliek zostane nezvýraznená.  
Zvýraznená kartička dostane okraj a žiaru vo farbe zvýraznenia a jej riadky, na ktorých končí vzťah, sa zafarbia. Zvýraznená spojnica získa farbu zvýraznenia.  
Na rozdiel od režimu [Graph](#highlighting-a-neighbourhood) nič iné nevybledne a nič nie je zvýraznené, kým ukazovateľ nie je nad žiadnou kartičkou a žiadna kartička nie je pripnutá.

Kliknutím na kartičku pripnete jej zvýraznenie, takže zostane zvýraznená, aj keď ukazovateľ prejde inam. Pripnutie zrušíte opätovným kliknutím na tú istú kartičku alebo kliknutím na pozadie; kliknutie na inú kartičku presunie pripnutie na ňu. Kartička pod ukazovateľom a pripnutá kartička sa zvýraznia spoločne.  
Presúvanie myšou, `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac), posúvanie zobrazenia a [tlačidlá na kartičke](#card-buttons) kartičku nepripnú ani jej pripnutie nezrušia.

Po každej zvýraznenej spojnici sa pohybujú častice od konca pri nadradenej tabuľke, kde je primárny kľúč, ku koncu pri podradenej tabuľke. Keď je naraz zvýraznených viac ako 60 spojníc, častice sa zastavia a zvýraznenie zostane.

### Tlačidlá na kartičke {#card-buttons}

Kým je ukazovateľ nad kartičkou, na pravom konci jej hlavičky sa zobrazia dve tlačidlá s ikonou, obe bez bublinového popisu:

- Ikona trasových bodov, rovnaká ako na tlačidle `Flow`, zúži režim Flow na danú tabuľku a tabuľky vzdialené o jeden vzťah – pozrite si časť [Zameranie na tabuľky](#focusing-on-tables). To, čo režim Flow zobrazoval predtým, zostane o jedno stlačenie tlačidla `Previous table` späť – pozrite si časť [Predchádzajúca a nasledujúca tabuľka](#previous-table-and-next-table).
- Ikona externého odkazu prepne na kartu ERD, vyberie iba danú tabuľku, presunie ju dopredu a umiestni aktívnu bunku na jej názov, v zobrazeniach `Logical Names` a `Both Names` na jej logický názov, pokiaľ už aktívnou bunkou nie je niektorá bunka tejto tabuľky. Plátno sa posunie k tabuľke iba vtedy, ak už nie je dobre viditeľná – pozrite si časť [Kam vedie skok](./table-related-functions.md#where-a-jump-lands). Nikdy nezačne ani nedokončí práve kreslený vzťah.

Stlačenie ktoréhokoľvek z tlačidiel sa týka iba samotného tlačidla: na rozdiel od stlačenia na inom mieste kartičky ju nevyberie ani nepresunie dopredu. Tlačidlo trasových bodov preto ponechá výber, ktorý ste mali; tlačidlo externého odkazu vyberie tabuľku iba v rámci prepnutia na kartu ERD. Obe tlačidlá reagujú iba na kliknutie ľavým tlačidlom myši.

### Presúvanie kartičiek {#moving-cards}

Kartičku presuňte myšou s ľavým tlačidlom za ktorúkoľvek jej časť okrem dvoch tlačidiel na kartičke; ťahanie pravým tlačidlom nič nepresunie.  
Stlačenie kartičky ju vyberie, `Ctrl + click` (Windows/Linux) alebo `⌘ + click` (Mac) ju pridá do výberu a presunutie vybratej kartičky myšou presunie všetky vybraté kartičky. Je to ten istý výber, ktorý používa karta ERD, takže to, čo tu vyberiete, zostane vybraté aj po návrate.

Kartička sa presúva iba v režime Flow: jej tabuľka zostáva na karte ERD tam, kde je.  
Presunutá kartička zostáva na mieste pri posúvaní zobrazenia, zmene priblíženia aj pri použití tlačidla `Fit`. Na miesto, kam ju umiestnilo rozloženie, sa vráti, keď opustíte kartu alebo prepnete do režimu `Graph` a vrátite sa, a keď tlačidlo `Show all` alebo [krok](#previous-table-and-next-table) obnoví rozloženie, ktoré už režim Flow má. Nové rozloženie ju umiestni znova a zohľadní pritom, kde ste ju nechali – pozrite si časť [Ako režim Flow rozmiestňuje kartičky](#how-flow-is-placed).

### Zameranie na tabuľky {#focusing-on-tables}

Na karte ERD vyberte jednu alebo viac tabuliek a stlačte `Alt + F` (Windows/Linux) alebo `⌥ + F` (Mac), prípadne kliknite pravým tlačidlom na tabuľku a vyberte položku `Focus on this table`.  
Karta Vizualizácia sa otvorí v režime `Flow`, zúžená na tieto tabuľky a všetky tabuľky vzdialené o jeden vzťah od ktorejkoľvek z nich, v ľubovoľnom smere. Vykreslia sa iba spojnice medzi zobrazenými tabuľkami.

Keď je tabuľka, na ktorú kliknete pravým tlačidlom, jednou z viacerých vybratých tabuliek, položka má názov `Focus on selected tables` a zameria sa na celý výber. Pri kliknutí pravým tlačidlom na tabuľku mimo výberu sa zameranie týka iba tejto tabuľky.  
Klávesová skratka `Alt + F` použije vybraté tabuľky a poznámky a [skupiny tabuliek](./table-groups.md) vynechá. Keď nie je vybratá žiadna tabuľka, nemá žiadny účinok, ani keď je vybratá skupina: najprv vyberte položku `Select tables` v kontextovej ponuke skupiny – pozrite si časť [Výber skupín](./table-groups.md#selecting-groups).  
Ignoruje sa, kým sa upravuje bunka, poznámka alebo názov skupiny, kým je fokus klávesnice v [prieskumníkovi](./explorer.md#keys-in-the-explorer) alebo kým je otvorené rýchle vyhľadávanie, panel Vlastnosti tabuľky, prehliadač rozdielov, ukážka automatického rozloženia, cestovanie v čase, dialógové okno [`Export image`](./file-import-export.md#image) alebo [`Map Columns`](./relationship-editing.md#map-columns).

V režime Flow zúži zobrazenie rovnakým spôsobom [tlačidlo na kartičke](#card-buttons) s trasovými bodmi, a to na túto jednu tabuľku. Tlačidlo `Show all` na [paneli nástrojov](#toolbar) vráti zobrazenie k celému diagramu. Tlačidlá `Previous table` a `Next table` na paneli nástrojov alebo ich klávesy prechádzajú o krok späť a dopredu cez to, na čo bol režim Flow zúžený – pozrite si časť [Predchádzajúca a nasledujúca tabuľka](#previous-table-and-next-table).  
Zúžené zobrazenie sa rozmiestni samostatne a prispôsobí oknu. Zostane zúžené, aj keď opustíte kartu alebo prepnete do režimu `Graph` a vrátite sa, a kláves `Escape` ho nerozšíri.

![Zameranie na orders pomocou ⌥ + F, zúženie na members tlačidlom trasových bodov na jej kartičke, potom Show all](/img/demo-visualization-focus.webp)

### Predchádzajúca a nasledujúca tabuľka {#previous-table-and-next-table}

Režim Flow si pamätá, na čo bol zúžený, podobne ako história prehliadača. Vždy, keď sa zobrazenie presunie na iné tabuľky – [zameraním na tabuľky](#focusing-on-tables) z karty ERD, [tlačidlom na kartičke](#card-buttons) s trasovými bodmi alebo tlačidlom `Show all` –, to, čo zobrazovalo predtým, sa uchová ako krok späť, či už to bolo niekoľko tabuliek, alebo celý diagram.

![Zúženie režimu Flow na orders pomocou ⌥ + F a potom na members, krok späť tlačidlom Previous table, dopredu pomocou ⌘ + Shift + Z a späť pomocou ⌘ + Z, potom Show all](/img/demo-visualization-steps.webp)

- Tlačidlo `Previous table` na [paneli nástrojov](#toolbar) sa vráti o krok späť a tlačidlo `Next table` prejde znova dopredu na to, čo tlačidlo `Previous table` opustilo.
- V režime `Flow` sa `Ctrl + Z` (Windows/Linux) alebo `⌘ + Z` (Mac) vráti o krok späť rovnako ako tlačidlo `Previous table` a `Ctrl + Shift + Z` (Windows/Linux) alebo `⌘ + Shift + Z` (Mac) prejde o krok dopredu rovnako ako tlačidlo `Next table`. Tam nikdy nevracajú späť ani znova nevykonávajú úpravu diagramu. V režime `Graph` a vtedy, keď je otvorené rýchle vyhľadávanie, nemajú žiadny účinok.
- Zúženie zobrazenia alebo stlačenie tlačidla `Show all` po kroku späť zahodí kroky dopredu. Opätovné zameranie presne na tabuľky, na ktoré je režim Flow už zúžený, nepridá žiadny krok ani žiadny nezahodí.
- Uchováva sa posledných 100 krokov späť a ako prvý sa zahadzuje najstarší.

Krok zobrazí tie zo svojich tabuliek, ktoré sú stále v diagrame, spolu so všetkými tabuľkami vzdialenými o jeden vzťah, rovnako ako zameranie. Krok, ktorého tabuľky boli všetky odstránené, sa preskočí a zahodí, a rovnako aj krok, ktorý by režim Flow ponechal tam, kde je: na presne tých tabuľkách, na ktoré je zúžený teraz, alebo na celom diagrame, keď ho režim Flow už zobrazuje.  
Tlačidlo je stlmené a nemá žiadny účinok, kým týmto smerom nezostáva žiadny krok. Obe sú stlmené pri prvom otvorení režimu Flow, či už nad celým diagramom, alebo na tabuľkách, s ktorými ho otvorilo zameranie. Keď je režim Flow raz otvorený, neskoršie zameranie z karty ERD uchová ako krok späť to, čo režim Flow zobrazoval, keď ste ho opustili.  
Krok sa rozmiestni a prispôsobí oknu rovnako ako zameranie – pozrite si časť [Ako režim Flow rozmiestňuje kartičky](#how-flow-is-placed) – a zobrazenie riadkov zostane tak, ako je.

Kroky patria iba režimu Flow. Uchovávajú sa, kým je editor otvorený, aj pri návštevách iných kariet a režimu `Graph`, ale neukladajú sa do dokumentu, neposielajú sa spolupracovníkom a nepridávajú nič do histórie zmien. Nahradenie celého dokumentu ich zahodí spolu so zvyškom režimu Flow.

V jazyku zobrazenia písanom sprava doľava si panel nástrojov zachová svoje poradie a obe šípky si vymenia funkciu, takže tlačidlo `Previous table` je šípka smerujúca doprava. Klávesy zostávajú rovnaké – pozrite si časť [Jazyky písané sprava doľava](./language-and-theme.md#right-to-left-languages).

### Ako režim Flow rozmiestňuje kartičky {#how-flow-is-placed}

Pri prvom zobrazení režimu `Flow` sa tabuľky, ktoré zobrazuje, rozmiestnia mimo hlavného vlákna a výsledok sa prispôsobí oknu.  
Rozloženie sa uchováva, kým je editor otvorený. Ak opustíte kartu alebo prepnete do režimu `Graph` a vrátite sa, režim Flow ho použije znova, s priblížením a posunutím zobrazenia tam, kde ste ich nechali.  
Režim Flow uchováva jedno rozloženie pre celý diagram a jedno pre tabuľky, na ktoré bol naposledy zúžený, takže tlačidlo `Show all` sa vráti k rozloženiu celého diagramu a prispôsobí ho oknu bez toho, aby ho znova vypočítavalo, pokiaľ sa nezmenilo nič z toho, z čoho bolo toto rozloženie vytvorené. [Krok](#previous-table-and-next-table) na celý diagram alebo na tabuľky, na ktoré bol režim Flow naposledy zúžený, použije príslušné rozloženie znova rovnakým spôsobom.

Režim Flow znova rozmiestni kartičky, keď:

- Stlačíte tlačidlo `Tidy Up`. Výsledok sa prispôsobí oknu.
- Zmeníte zobrazenie riadkov, zúžite zobrazenie na iné tabuľky alebo prejdete na iné tabuľky tlačidlom `Previous table` alebo `Next table`. Výsledok sa prispôsobí oknu.
- Vyberiete iné zobrazenie v zozname `Name View`. Výsledok sa prispôsobí oknu.
- Pridajú sa alebo odstránia tabuľky či vzťahy alebo sa prepne Zobrazenie názvov – kým ste mimo režimu Flow, pričom sa zmeny prevezmú po návrate, alebo spolupracovníkom, kým ste v režime Flow. Priblíženie a posunutie zobrazenia zostanú tak, ako sú.

Každé rozloženie zohľadňuje, kde sa kartičky práve nachádzajú, takže tlačidlo `Tidy Up` nemusí nutne obnoviť predchádzajúce usporiadanie.  
Zmena, ktorá iba mení veľkosť kartičky, napríklad premenovanie tabuľky, zápis logického názvu alebo pridanie stĺpca, kartičky znova nerozmiestni. Ak sa kartičky nakoniec prekrývajú, stlačte `Tidy Up`.

Rozloženie, ktoré trvá dlhšie ako 6 sekúnd, zobrazí upozornenie `Placing tables` s otáčajúcim sa indikátorom načítania a tlačidlom `Cancel`.  
Tlačidlo `Cancel` alebo kláves `Escape` stlačený kedykoľvek počas výpočtu rozloženia ho zruší; tlačidlo `Tidy Up` alebo návrat do režimu `Flow` si ho vyžiada znova.  
Ak rozloženie zlyhá – hostiteľ nespúšťa žiadny shared worker, worker sa nepodarí spustiť alebo sa do 60 sekúnd nevráti žiadne rozloženie –, režim Flow zobrazí upozornenie `Could not place tables` s výstražným znakom a tlačidlo `Tidy Up` to skúsi znova. Pozrite si časť [Web Workers](../../api/installation.md#web-workers).  
Režim Flow vykresľuje iba tabuľky, ktoré umiestnilo jeho posledné rozloženie, v zobrazení celého diagramu aj v zúženom zobrazení, takže pri prvom zobrazení nemusí byť až do úspešného rozloženia vidieť vôbec žiadne kartičky.  
Vždy, keď režim Flow znova rozmiestňuje kartičky, napríklad keď zúžite zobrazenie na iné tabuľky, predchádzajúce usporiadanie zostane na obrazovke, kým nedorazí nové rozloženie, a zostane tam aj vtedy, ak sa toto rozloženie zruší alebo zlyhá.

Keď sa nahradí celý dokument, napríklad importom súboru, rozloženia, zameranie, kroky tlačidiel `Previous table` a `Next table`, zobrazenie riadkov, priblíženie a posunutie zobrazenia režimu Flow sa zahodia a pri ďalšom otvorení začne režim Flow odznova tak ako prvýkrát: s celým diagramom alebo zúžený, ak ho otvoríte [zameraním na tabuľky](#focusing-on-tables).

### Režim Flow nikdy neupravuje dokument {#flow-never-edits-the-document}

Režim Flow diagram iba číta. Zmena priblíženia, posúvanie zobrazenia, presúvanie kartičiek, tlačidlo `Tidy Up`, zobrazenie riadkov, pripnutia, zameranie a prechádzanie tlačidlami `Previous table` a `Next table` nepridávajú nič do [histórie zmien](./undo-redo.md#what-the-history-records).  
Ani v diagrame nič nezmenia. Stlačenie kartičky síce presunie jej tabuľku dopredu, rovnako ako kliknutie na tabuľku na karte ERD, takže je vpredu aj tam, ale poradie prekrývania sa neukladá – pozrite si časť [Presúvanie viacerých tabuliek](./table-related-functions.md#moving-multiple-tables). Režim `Graph` rovnako necháva diagram nedotknutý.  
Výnimkou je zoznam `Name View`, a to iba vtedy, keď je [zamknutie](./settings.md#lock) `Name View` vypnuté: výber potom prepne Zobrazenie názvov diagramu, ktoré sa ukladá a s ktorým sa prepnú aj spolupracovníci. Kým je zamknutie zapnuté, ako je predvolene, výber zmení iba vašu vlastnú obrazovku. V oboch prípadoch nepridá nič do histórie zmien.  
Stlačenie kartičky nikdy nepridá vzťah. Ak ste kartu ERD opustili počas kreslenia vzťahu, stlačenie kartičky vyberie jej tabuľku ako začiatočnú, ak ešte žiadna vybratá nebola, a inak kreslenie ukončí.  
[Tlačidlo na kartičke](#card-buttons) s ikonou externého odkazu ide ďalej, pretože vás vyvedie z režimu Flow: keď sa karta ERD musí posunúť k tabuľke, toto posunutie sa zaznamená ako každá iná zmena polohy zobrazenia.

Úpravy spolupracovníkov sa do diagramu dostanú aj vtedy, keď ste v režime Flow, a kartičky sledujú tabuľky a vzťahy, ktoré pridajú alebo odstránia – pozrite si časť [Ako režim Flow rozmiestňuje kartičky](#how-flow-is-placed).  
Ich obrysy výberu a fokusu sa na kartičkách vykresľujú, ich kurzory a ťahané rámce však nie – pozrite si stránku [Spoločné úpravy](../../api/advanced/collaborative-editing.md).

Oba režimy vrátane zamerania na tabuľky a prechádzania po krokoch fungujú aj v editore s atribútom [`readonly`](../../api/erd-editor-element.md#readonly) a rovnako aj zoznam `Name View`, ktorý tam prepína iba vašu vlastnú obrazovku.  
Na karte ERD editora iba na čítanie obsahuje ponuka tabuľky iba `Table Properties` a stlačenie nevyberie žiadnu tabuľku, takže zameranie urobte klávesmi `Alt + F` (Windows/Linux) alebo `⌥ + F` (Mac) na tabuľke, ktorú vybral skok z [prieskumníka](./explorer.md#going-to-a-row) alebo [rýchleho vyhľadávania](./quick-search.md).
