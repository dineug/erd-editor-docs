---
sidebar_position: 11
description: Utforska schemat som en kraftbaserad graf eller som ett flöde av tabellkort – zooma och panorera, lys upp en tabells relaterade tabeller, fokusera på några tabeller i taget och gå tillbaka genom tidigare fokuseringar.
---

# Visualisering

Fliken Visualisering ger en överblick över hela dokumentet i ett av två lägen:

- `Graph`, en kraftbaserad graf över alla tabeller, deras kolumner och relationerna mellan dem – se [Grafläge](#graph-mode).
- `Flow`, där varje tabell ritas som ett kort och placeras ut längs sina relationer – se [Flödesläge](#flow-mode).

Öppna den från fliken `Visualization` i verktygsfältet längst upp eller från [snabbsökningen](./quick-search.md) under `Tab`.  
På ERD-fliken öppnar `Alt + F` (Windows/Linux) eller `⌥ + F` (Mac) och menyalternativet `Focus on this table` i tabellens snabbmeny den direkt i `Flow`, avgränsad till de tabeller du valde och tabellerna en relation bort – se [Fokusera på tabeller](#focusing-on-tables).

Byt läge med knapparna `Graph` och `Flow` längst till vänster i [verktygsfältet](#toolbar).  
En nyöppnad editor startar i `Graph`. Läget du väljer behålls så länge editorn är öppen, även när du besöker andra flikar, men det sparas inte i dokumentet.

## Verktygsfält {#toolbar}

Ett verktygsfält svävar över mitten av flikens nederkant. Från vänster till höger:

- `Graph` och `Flow`, där det aktuella läget är framhävt.
- `Previous table` och `Next table`, endast i `Flow`: en vänsterpil och en högerpil som går bakåt och framåt genom de tabeller som flödet har avgränsats till – se [Föregående och nästa tabell](#previous-table-and-next-table). Var och en är nedtonad medan det inte finns något att gå till åt det hållet.
- `Zoom out`, den aktuella zoomnivån i procent, till exempel `100%`, och `Zoom in`. Varje tryck ändrar zoomen med 4 procentenheter, och mitten av skärmen ligger kvar där den är. Procentsatsen visar zoomnivån i det läge du befinner dig i, och ett klick på den återställer den zoomnivån till `100%`.
- `Fit`, som får in allt som läget visar i vyn: varje nod i `Graph`, varje kort i `Flow`.
- `Tidy Up`, endast i `Flow`, som placerar ut korten på nytt – se [Hur flödet placeras](#how-flow-is-placed).
- Radvisningsmenyn, endast i `Flow`, som har det aktuella valet som etikett – se [Radvisning](#row-display).
- Listan `Name View`, endast i `Flow`, som har den aktuella visningen som etikett – se [Namn på korten](#names-on-the-cards).
- `Show all`, endast i `Flow` och endast medan vyn är avgränsad, som går tillbaka till hela diagrammet – se [Fokusera på tabeller](#focusing-on-tables).
- Kompassen `Go to content`, som läggs till i slutet av verktygsfältet endast medan inga noder eller kort syns på skärmen. Den visar en pil som pekar mot närmaste nod eller kort och hur långt bort det är, till exempel `1.2k`. Klicka på den för att centrera den noden eller det kortet utan att ändra zoomnivån.

Zoomknapparna och de två pilarna anger sina kortkommandon i sina knappbeskrivningar, till exempel `Zoom in (Ctrl + Plus)` (Windows/Linux) eller `Zoom in (⌘ + Plus)` (Mac) och `Previous table (Ctrl + Z)` (Windows/Linux) eller `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` och `Ctrl + Minus` (Windows/Linux) eller `⌘ + Plus` och `⌘ + Minus` (Mac) ändrar zoomen stegvis som knapparna, i båda lägena, och `Ctrl + 0` (Windows/Linux) eller `⌘ + 0` (Mac) går direkt tillbaka till `100%`. I `Flow` går `Ctrl + Z` och `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Z` och `⌘ + Shift + Z` (Mac) bakåt och framåt som de två pilarna.  
Ett klick på procentsatsen gör samma sak som `Ctrl + 0` (Windows/Linux) eller `⌘ + 0` (Mac), och dess knappbeskrivning anger det kortkommandot. Kortkommandona gör ingenting medan snabbsökningen är öppen.

## Grafläge {#graph-mode}

Grafläget ritar hela dokumentet som en kraftbaserad graf, så att du med en blick kan se hur tabellerna hänger ihop med varandra och vilka som ligger i centrum av en domän.

![Öppna grafläget, hålla pekaren över en tabell för att se dess förhandsgranskning, dra en nod och zooma ut och in igen](/img/demo-visualization.webp)

### Läsa grafen {#reading-the-graph}

Varje tabell och varje kolumn är en nod, och de två typerna ritas i olika färger. Anteckningar och [tabellgrupper](./table-groups.md) ritas inte.  
Varje kolumnnod är länkad till tabellen den hör till, och två tabeller som förenas av en relation är länkade till varandra.  
Tabeller som förenas av mer än en relation i samma riktning länkas bara en gång, och en relation som börjar och slutar i samma tabell ritar ingen länk.

Tabellnamnen visas i grafen när du zoomar in och tonas fram mellan `50%` och `100%`, och ett namn som är längre än 15 tecken kortas av. Kolumnnoder har ingen etikett på någon zoomnivå.  
Etiketterna följer namnvisningen – se [Utanför arbetsytan](./logical-names.md#beyond-the-canvas). I `Both Names` placerar en etikett det logiska namnet på en rad och namnet på raden under, och varje rad kortas av för sig.

### Navigera i grafen {#getting-around-the-graph}

Mushjulet zoomar kring det som pekaren befinner sig över, från `10%` till `400%`.  
En nypgest på styrplattan zoomar på samma sätt, och två fingrar på en pekskärm zoomar kring punkten mellan dem och panorerar när de rör sig.  
Dra i bakgrunden för att panorera, eller dra med mittenknappen var som helst, även på en nod, som på [ERD-arbetsytan](./table-related-functions.md#getting-around-the-canvas). En dragning med mittenknappen panorerar bara: den drar aldrig i en nod.

Zoomknapparna i [verktygsfältet](#toolbar) och kortkommandona för zoom håller i stället mitten av skärmen stilla, inom samma intervall, och `Fit` får in alla noder i vyn.

### Förhandsgranskning vid hovring {#hover-preview}

Håll pekaren över en tabellnod för att förhandsgranska tabellen, intill markören.  
Att hålla pekaren över en kolumnnod ritar bara en ring runt den; ingen förhandsgranskning öppnas.

Förhandsgranskningen visar samma kolumner och celler som ERD-arbetsytan, i samma ordning, och namnger dem så som arbetsytan gör i den namnvisning du befinner dig i – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options), [Ändra kolumnordning](./settings.md#adjusting-column-order) och [Namnvisning](./logical-names.md#name-view).  
När visningsalternativet `Alternate Key` är på har varje kolumn i en [alternativ nyckel](./table-related-functions.md#alternate-keys) sitt märke, till exempel `AK1.1`, sist på sin rad, och förhandsgranskningen breddas för att få plats med det, precis som tabellen på ERD-arbetsytan gör.  
Till skillnad från en tabell på ERD-arbetsytan får dess tabellhuvud aldrig färgen från tabellens [grupp](./table-groups.md#coloring-a-group), och dess namn får aldrig de [märkningar](./dictionary.md#marks-on-the-canvas) som ordlistornas kontroller sätter på arbetsytan.  
Den är endast till för visning och döljs medan du drar en nod eller panorerar.

### Framhäva en omgivning {#highlighting-a-neighbourhood}

Att hålla pekaren över en tabell lyser också upp dess omgivning: själva tabellen, dess egna kolumner, de tabeller som dess relationer förenar den med oavsett riktning och länkarna mellan dem.  
Allt annat i grafen tonas ned, så att det som tabellen berör framträder för sig.

### Flytta noder {#moving-nodes}

Dra i en nod med vänster musknapp för att flytta den, och allt som är länkat till den, till en ny position.  
Noden fästs under pekaren så länge du håller i den, och layouten sätts i rörelse igen runt den.  
Den lägger sig till ro igen när du släpper – ingenting förblir fäst där du släppte det.  
Ett tryck eller en dragning med höger musknapp på en nod varken drar i den eller panorerar.

### Grafen är en ögonblicksbild {#the-graph-is-a-snapshot}

Grafen byggs från dokumentet som det ser ut i det ögonblick du öppnar den här fliken, och den byggs om från grunden varje gång du kommer tillbaka till den.  
Att byta från `Flow` till `Graph` bygger också om den, och varje ombyggnad börjar om på `100%`.

## Flödesläge {#flow-mode}

Flödesläget ritar varje tabell som ett kort och placerar ut korten längs deras relationer. Anteckningar och [tabellgrupper](./table-groups.md) ritas inte.  
Det är inte layouten `Flow` i [automatisk layout](./table-related-functions.md#auto-layout), som flyttar tabellerna på själva ERD-fliken.

Varje kort ritas som en tabell på ERD-fliken: tabellens färg längs vänsterkanten, ett tabellhuvud med en tabellikon och tabellens namn så som [namnvisningen](#names-on-the-cards) visar dem, sedan de rader som [radvisningen](#row-display) kräver. Till skillnad från en tabell på ERD-fliken ritar ett kort också en linje mellan sina rader, och dess tabellhuvud får aldrig färgen från tabellens [grupp](./table-groups.md#coloring-a-group). Korten behåller det utseendet på alla zoomnivåer och fälls aldrig ihop till sitt namn så som tabeller på ERD-fliken gör vid `70%` och lägre. Ingenting på ett kort kan redigeras.

En relationslinje är en enda mjuk kurva från tabell till tabell, ritad under korten, så den kan passera bakom ett kort. En relation från en tabell till sig själv böjer sig runt kortets övre högra hörn, som på ERD-fliken – se [Dragning av relationslinjer](./relationship-editing.md#connector-routing). Varje relationslinje ritas som samma heldragna grå linje, oavsett om relationen är identifierande eller inte, med samma ändsymboler som på ERD-fliken – se [Läsa en relationslinje](./relationship-editing.md#reading-a-connector). Flödet ritar relationslinjer även när [visningsalternativet](./table-related-functions.md#table-view-options) `Relationship` är av. Det ritar aldrig etiketterna `D:` och `U:` för en relations ON DELETE- och ON UPDATE-åtgärder och visar aldrig knappbeskrivningen som skriver ut dem, oavsett vad visningsalternativet `Referential Actions` är inställt på.

I hela diagrammet samlas tabeller som ingen relation förenar med en annan tabell i ett enda block i stället för att spridas ut bland de övriga.

![Byta till flödet, hålla pekaren över orders för att lysa upp den och dess grannar, fästa ljuset, välja Keys only, sedan zooma in med ⌘ + Wheel och trycka på Fit](/img/demo-visualization-flow.webp)

### Radvisning {#row-display}

Radvisningsmenyn i [verktygsfältet](#toolbar) anger hur mycket av varje kort som ritas. Dess etikett är det aktuella valet, och dess knappbeskrivning visar till exempel `Row display: Name only`.  
Menyn öppnas ovanför verktygsfältet med en bock bredvid det aktuella valet. Den stängs när du väljer ett alternativ, klickar på etiketten igen, klickar någon annanstans i editorn, trycker på `Escape` eller byter till `Graph`.

| Radvisning | Vad varje kort visar |
| --- | --- |
| `Name only` | Endast tabellhuvudet. |
| `Keys only` | Primärnyckel- och sekundärnyckelkolumner samt alla andra kolumner som en relation slutar i. |
| `All fields` | Alla kolumner. |

Raderna listas i tabellens kolumnordning. Varje rad visar kolumnnamnet, med en nyckelikon framför när kolumnen är en primärnyckel, en sekundärnyckel eller båda, och datatypen till höger, oavsett om kortet är [upplyst](#lighting-related-tables) eller inte. [Namnvisningen](#names-on-the-cards) avgör vilka namn en rad visar och om den visar kolumnens domän.  
Inga andra celler eller AK-märken ritas, och varken [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options) eller [Ändra kolumnordning](./settings.md#adjusting-column-order), som ordnar cellerna inom en rad, gäller för korten.

När flödet öppnas första gången startar det med `Name only`, eller med `Keys only` om det var [fokusering på tabeller](#focusing-on-tables) som öppnade det. Därefter ändras radvisningen bara när du väljer en annan, och den behålls när du avgränsar eller vidgar vyn.  
Att ändra radvisningen ändrar kortens storlek, så flödet placerar ut dem på nytt och anpassar dem till skärmen.

### Namn på korten {#names-on-the-cards}

Ett kort namnger sin tabell och sina kolumner i namnvisningen, samma namnvisning som ERD-fliken ritar i – se [Namnvisning](./logical-names.md#name-view).  
Byt den här med listan `Name View` i [verktygsfältet](#toolbar). Dess knapp visar den aktuella visningen, `Physical Names`, `Logical Names` eller `Both Names`, och dess knappbeskrivning visar `Name View`. Listan öppnas ovanför verktygsfältet med en bock bredvid den aktuella visningen och stängs på samma sätt som menyn för [radvisning](#row-display). Ett val byter visning i hela editorn, inklusive ERD-fliken, precis som ett byte som görs någon annanstans – se [Byta visning](./logical-names.md#switching-the-view).

Korten lägger upp sina celler enbart efter namnvisningen. Inget [visningsalternativ](./table-related-functions.md#table-view-options) ändrar dem, inte heller `Domain`:

| Namnvisning | Tabellhuvud | Varje rad |
| --- | --- | --- |
| `Physical Names` | Tabellnamnet. | Kolumnnamnet, sedan datatypen. |
| `Logical Names` | Tabellens logiska namn. | Kolumnens logiska namn, sedan namnet på dess [domän](./dictionary.md#domains-and-data-types), eller dess datatyp medan den saknar domän. |
| `Both Names` | Det logiska namnet, sedan tabellnamnet, dämpat. | Det logiska namnet, namnet, domänen och datatypen. |

Medan ett logiskt namn är tomt visar `Logical Names` namnet i dess ställe, nedtonat, eller platshållaren `table` eller `column` när även namnet är tomt, och `Both Names` visar den nedtonade platshållaren `logical`. I `Both Names` visar en kolumn utan domän den nedtonade platshållaren `domain`.  
Ett kort får aldrig de [märkningar](./dictionary.md#marks-on-the-canvas) som ordlistornas kontroller sätter på namn på ERD-fliken.  
Att byta namnvisning ändrar kortens storlek, så flödet placerar ut dem på nytt – se [Hur flödet placeras](#how-flow-is-placed).

### Navigera i flödet {#getting-around-the-flow}

Mushjulet panorerar, och `Shift + Wheel` panorerar i sidled. `Ctrl + Wheel` (Windows/Linux) eller `⌘ + Wheel` (Mac) zoomar, och mitten av skärmen ligger kvar där den är.  
En nypgest på styrplattan zoomar kring punkten där du nyper, och två fingrar på en pekskärm zoomar kring punkten mellan dem och panorerar när de rör sig.  
Dra i bakgrunden för att panorera, eller dra med mittenknappen var som helst, även på ett kort. En dragning med mittenknappen panorerar bara och lämnar markeringen som den är. Panoreringen har inga gränser, som på [ERD-arbetsytan](./table-related-functions.md#getting-around-the-canvas).  
Zoomnivån går från `10%` till `150%`. Flödet har en egen zoomnivå och panorering, skilda från ERD-flikens, och ingen av dem sparas i dokumentet.

Ett tryck på bakgrunden avmarkerar allt, och `Ctrl + drag` (Windows/Linux) eller `⌘ + drag` (Mac) på bakgrunden ritar en markeringsram.  
Flödet har ingen minikarta och inga rullningslister. När en panorering inte lämnar något kort kvar på skärmen använder du kompassen `Go to content` i [verktygsfältet](#toolbar).

### Lysa upp relaterade tabeller {#lighting-related-tables}

Håll pekaren över ett kort för att lysa upp det, tabellerna en relation bort från det och relationslinjerna som förbinder det med de tabellerna. En relationslinje mellan två av de tabellerna lyses inte upp.  
Ett upplyst kort får en kantlinje och ett sken i accentfärgen, och dess rader där en relation slutar får en färgton. En upplyst relationslinje får accentfärgen.  
Inget annat tonas ned, till skillnad från i [grafläget](#highlighting-a-neighbourhood), och ingenting lyses upp så länge pekaren inte hålls över något kort och inget kort är fäst.

Klicka på ett kort för att fästa dess ljus, så att det förblir upplyst när pekaren flyttas vidare. Klicka på samma kort igen, eller klicka på bakgrunden, för att släppa det; ett klick på ett annat kort flyttar det fästa ljuset dit. Kortet som pekaren hålls över och det fästa kortet lyses upp samtidigt.  
Dragning, `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac), panorering och [kortknapparna](#card-buttons) varken fäster eller släpper ett kort.

Partiklar löper längs varje upplyst relationslinje, från föräldratabellens ände, där primärnyckeln finns, till barntabellens ände. När fler än 60 relationslinjer är upplysta samtidigt stannar partiklarna och ljuset ligger kvar.

### Kortknappar {#card-buttons}

Medan pekaren hålls över ett kort visas två ikonknappar, ingen av dem med knappbeskrivning, längst till höger i dess tabellhuvud:

- Vägpunktsikonen, samma som knappen `Flow` visar, avgränsar flödet till den tabellen och tabellerna en relation bort – se [Fokusera på tabeller](#focusing-on-tables). Det som flödet visade innan finns kvar ett tryck på `Previous table` bort – se [Föregående och nästa tabell](#previous-table-and-next-table).
- Ikonen för extern länk byter till ERD-fliken, markerar endast den tabellen, lägger den överst och flyttar den fokuserade cellen till dess namn, eller till dess logiska namn i `Logical Names` och `Both Names`, om inte en cell i den tabellen redan är fokuserad. Arbetsytan rullar till tabellen endast om den inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). Den påbörjar eller slutför aldrig en relation som håller på att ritas.

Ett tryck på någon av knapparna gäller enbart knappen: till skillnad från ett tryck någon annanstans på kortet markerar det inte kortet och lägger det inte överst. Vägpunktsknappen behåller därför den markering du hade; knappen för extern länk markerar tabellen endast som en del av bytet till ERD-fliken. Båda knapparna reagerar endast på vänsterklick.

### Flytta kort {#moving-cards}

Dra ett kort med vänster musknapp i valfri del av det utom de två kortknapparna; en dragning med höger musknapp flyttar ingenting.  
Ett tryck på ett kort markerar det, `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac) lägger till det i markeringen och en dragning av ett markerat kort flyttar alla markerade kort. Markeringen är densamma som ERD-fliken använder, så det du markerar här är fortfarande markerat när du går tillbaka.

Ett kort flyttas bara i flödet: dess tabell stannar där den är på ERD-fliken.  
Ett flyttat kort ligger kvar vid panorering, zoomning och `Fit`. Det går tillbaka dit layouten placerade det när du lämnar fliken eller byter till `Graph` och kommer tillbaka, och när `Show all` eller ett [steg](#previous-table-and-next-table) återgår till en layout som flödet redan har. En ny layout placerar det på nytt med hänsyn till var du lämnade det – se [Hur flödet placeras](#how-flow-is-placed).

### Fokusera på tabeller {#focusing-on-tables}

Markera en eller flera tabeller på ERD-fliken och tryck på `Alt + F` (Windows/Linux) eller `⌥ + F` (Mac), eller högerklicka på en tabell och välj `Focus on this table`.  
Fliken Visualisering öppnas i `Flow`, avgränsad till de tabellerna och alla tabeller som ligger en relation bort från någon av dem, oavsett riktning. Endast relationslinjerna mellan de tabeller som visas ritas.

När tabellen du högerklickar på är en av flera markerade tabeller visar menyalternativet `Focus on selected tables` och fokuserar på hela markeringen. Ett högerklick på en tabell utanför markeringen fokuserar endast på den tabellen.  
`Alt + F` tar de markerade tabellerna och utelämnar anteckningar och [tabellgrupper](./table-groups.md). Om ingen tabell är markerad gör det ingenting, inte ens när en grupp är markerad: välj först `Select tables` i gruppens snabbmeny – se [Markera grupper](./table-groups.md#selecting-groups).  
Det ignoreras medan en cell, en anteckning eller ett gruppnamn redigeras, medan tangentbordsfokus ligger i [utforskaren](./explorer.md#keys-in-the-explorer) eller medan snabbsökningen, panelen Tabellegenskaper, diff-visaren, förhandsgranskningen av automatisk layout, tidsresan, dialogrutan [`Export image`](./file-import-export.md#image) eller [`Map Columns`](./relationship-editing.md#map-columns) är öppen.

I flödet avgränsar [kortknappen](#card-buttons) med vägpunktsikonen vyn på samma sätt, till enbart den tabellen. `Show all` i [verktygsfältet](#toolbar) går tillbaka till hela diagrammet. `Previous table` och `Next table` i verktygsfältet, eller deras tangenter, går bakåt och framåt genom det som flödet har avgränsats till – se [Föregående och nästa tabell](#previous-table-and-next-table).  
En avgränsad vy får en egen layout och anpassas till skärmen. Den förblir avgränsad när du lämnar fliken eller byter till `Graph` och kommer tillbaka, och `Escape` vidgar den inte.

![Fokusera på orders med ⌥ + F, avgränsa till members med vägpunktsknappen på dess kort, sedan Show all](/img/demo-visualization-focus.webp)

### Föregående och nästa tabell {#previous-table-and-next-table}

Flödet kommer ihåg vad det har avgränsats till, som en webbläsares historik. Varje gång vyn flyttas till andra tabeller – genom [fokusering på tabeller](#focusing-on-tables) från ERD-fliken, med [kortknappen](#card-buttons) med vägpunktsikonen eller med `Show all` – sparas det som den visade innan som ett steg bakåt, oavsett om det var några tabeller eller hela diagrammet.

![Avgränsa flödet till orders med ⌥ + F och sedan till members, gå ett steg bakåt med Previous table, framåt med ⌘ + Shift + Z och bakåt med ⌘ + Z, sedan Show all](/img/demo-visualization-steps.webp)

- `Previous table` i [verktygsfältet](#toolbar) går ett steg bakåt, och `Next table` går framåt igen till det som `Previous table` lämnade.
- I `Flow` går `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac) ett steg bakåt som `Previous table`, och `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Shift + Z` (Mac) går ett steg framåt som `Next table`. Där ångrar eller gör de aldrig om en redigering av diagrammet. I `Graph`, och medan snabbsökningen är öppen, gör de ingenting.
- Om du avgränsar vyn eller trycker på `Show all` efter att ha gått bakåt försvinner stegen framåt. Att fokusera igen på exakt de tabeller som flödet redan är avgränsat till lägger inte till något steg och tar inte bort något.
- De senaste 100 stegen bakåt sparas, och det äldsta försvinner först.

Ett steg visar de av dess tabeller som fortfarande finns i diagrammet, med alla tabeller som ligger en relation bort, så som fokusering gör. Ett steg vars tabeller alla har tagits bort hoppas över och tas bort, och detsamma gäller ett steg som skulle lämna flödet där det står: på exakt de tabeller som det är avgränsat till nu, eller över hela diagrammet medan flödet redan visar det.  
En knapp är nedtonad, och gör ingenting, medan det inte finns något steg kvar åt det hållet. Båda är nedtonade när flödet öppnas första gången, oavsett om det är över hela diagrammet eller på de tabeller som en fokusering öppnade det med. När flödet väl har öppnats behåller en senare fokusering från ERD-fliken det som flödet visade när du lämnade det som ett steg bakåt.  
Ett steg får en layout och anpassas till skärmen på samma sätt som en fokusering – se [Hur flödet placeras](#how-flow-is-placed) – och radvisningen förblir som den är.

Stegen hör till flödet självt. De behålls så länge editorn är öppen, även när du besöker andra flikar och `Graph`, men de sparas inte i dokumentet och skickas inte till medarbetare, och de lägger inte till något i ångrahistoriken. Om hela dokumentet ersätts kasseras de tillsammans med resten av flödet.

I ett visningsspråk som skrivs från höger till vänster behåller verktygsfältet sin ordning och de två pilarna byter funktion, så `Previous table` är pilen som pekar åt höger. Tangenterna förblir desamma – se [Språk som skrivs från höger till vänster](./language-and-theme.md#right-to-left-languages).

### Hur flödet placeras {#how-flow-is-placed}

Första gången `Flow` visas beräknas layouten utanför huvudtråden för de tabeller som läget visar, och resultatet anpassas till skärmen.  
Layouten behålls så länge editorn är öppen. Lämna fliken eller byt till `Graph` och kom tillbaka, så återanvänder flödet den, med zoomnivån och panoreringen där du lämnade dem.  
Flödet har en layout för hela diagrammet och en för de tabeller som det senast avgränsades till, så `Show all` går tillbaka till layouten för hela diagrammet och anpassar den till skärmen utan att beräkna den på nytt, så länge ingenting som layouten byggdes av har ändrats. Ett [steg](#previous-table-and-next-table) till hela diagrammet, eller till de tabeller som flödet senast avgränsades till, återanvänder den layouten på samma sätt.

Flödet placerar ut korten på nytt när:

- Du trycker på `Tidy Up`. Resultatet anpassas till skärmen.
- Du ändrar radvisningen, avgränsar vyn till andra tabeller eller går till andra tabeller med `Previous table` eller `Next table`. Resultatet anpassas till skärmen.
- Du väljer en annan visning i listan `Name View`. Resultatet anpassas till skärmen.
- Tabeller eller relationer läggs till eller tas bort, eller namnvisningen byts – medan du är borta från flödet, vilket fångas upp när du kommer tillbaka, eller av en medarbetare medan du är i flödet. Zoomnivån och panoreringen stannar där de är.

Varje layout tar hänsyn till var korten står just nu, så `Tidy Up` återställer inte nödvändigtvis en tidigare placering.  
En ändring som bara ändrar storleken på ett kort, till exempel att byta namn på en tabell, skriva ett logiskt namn eller lägga till en kolumn, placerar inte ut korten på nytt. Tryck på `Tidy Up` om korten hamnar ovanpå varandra.

En layout som tar längre tid än 6 sekunder visar meddelandet `Placing tables` med en snurrande laddningsindikator och `Cancel`.  
`Cancel`, eller `Escape` när som helst medan layouten pågår, avbryter den; `Tidy Up`, eller att komma tillbaka till `Flow`, begär den på nytt.  
Om en layout misslyckas – värdprogrammet kör ingen shared worker, workern startar inte eller ingen layout kommer tillbaka inom 60 sekunder – visar flödet meddelandet `Could not place tables` med en varningssymbol, och `Tidy Up` försöker igen. Se [Web Workers](../../api/installation.md#web-workers).  
Flödet ritar bara de tabeller som dess senaste layout placerade, både i hela diagrammet och i en avgränsad vy, så första gången det visas kanske det inte finns några kort alls förrän en layout lyckas.  
Varje gång flödet placerar ut korten på nytt, till exempel när du avgränsar vyn till andra tabeller, ligger den föregående placeringen kvar på skärmen tills den nya layouten är klar, och den ligger kvar där om den layouten avbryts eller misslyckas.

När hela dokumentet ersätts, till exempel genom att du importerar en fil, kasseras flödets layouter, fokus, steg för `Previous table` och `Next table`, radvisning, zoomnivå och panorering, och nästa gång du öppnar flödet börjar det om som första gången: över hela diagrammet, eller avgränsat om du öppnar det genom att [fokusera på tabeller](#focusing-on-tables).

### Flödet redigerar aldrig dokumentet {#flow-never-edits-the-document}

Flödet läser bara diagrammet. Zoomning, panorering, förflyttning av kort, `Tidy Up`, radvisningen, fästa kort, fokusering och stegning med `Previous table` och `Next table` lägger inte till något i [ångrahistoriken](./undo-redo.md#what-the-history-records).  
De ändrar inte heller något i diagrammet. Ett tryck på ett kort lägger visserligen dess tabell överst, precis som ett klick på en tabell på ERD-fliken gör, så den ligger överst även där, men staplingsordningen sparas inte – se [Flytta flera tabeller](./table-related-functions.md#moving-multiple-tables). `Graph` lämnar diagrammet orört på samma sätt.  
Listan `Name View` är ett undantag, och bara medan [låset](./settings.md#lock) `Name View` är av: ett val byter då diagrammets namnvisning, som sparas och som också byts hos medarbetarna. Medan låset är på, vilket det är som standard, ändrar ett val bara din egen skärm. I båda fallen lägger det inte till något i ångrahistoriken.  
Ett tryck på ett kort lägger aldrig till en relation. Om du lämnade ERD-fliken medan du ritade en relation väljer ett tryck på ett kort dess tabell som startpunkt när ingen tabell har valts ännu och avslutar annars ritningen.  
[Kortknappen](#card-buttons) för extern länk går längre, eftersom den tar dig ut ur flödet: när ERD-fliken måste rulla till tabellen registreras den rullningen som vilken annan ändring av vypositionen som helst.

Medarbetarnas ändringar når fortfarande diagrammet medan du är i flödet, och korten följer de tabeller och relationer som de lägger till eller tar bort – se [Hur flödet placeras](#how-flow-is-placed).  
Deras markerings- och fokusringar ritas på korten, men inte deras markörer och dragrutor – se [Gemensam redigering](../../api/advanced/collaborative-editing.md).

Båda lägena, inklusive fokusering och stegning, fungerar även i en editor med [`readonly`](../../api/erd-editor-element.md#readonly), och det gör även listan `Name View`, som där bara byter visning på din egen skärm.  
På ERD-fliken i en skrivskyddad editor innehåller tabellmenyn enbart `Table Properties` och ett tryck markerar ingen tabell, så fokusera med `Alt + F` (Windows/Linux) eller `⌥ + F` (Mac) på den tabell som ett hopp från [utforskaren](./explorer.md#going-to-a-row) eller [snabbsökningen](./quick-search.md) markerade.
