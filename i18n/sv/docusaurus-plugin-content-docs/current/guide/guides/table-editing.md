---
sidebar_position: 3
description: Lägg till, markera, ordna om och ta bort kolumner, slå på och av kolumnalternativ och kopiera eller klistra in kolumner.
---

# Redigera tabeller

Tabellredigeringen erbjuder i grunden en redigeringsupplevelse som liknar Excel.  
[Namnvisningen](./logical-names.md#name-view) avgör om en tabell ritar namnen, de logiska namnen eller båda i sitt tabellhuvud och sina rader.  
Redigeringsläget startas med `Enter` eller genom att du dubbelklickar på en cell.  
`Enter` eller `Escape` avslutar det. Det du skriver tillämpas medan du skriver, så `Escape` behåller texten i stället för att återställa den. En [domäncell](./logical-names.md#the-domain-cell) är undantaget: den väljer bara ur sin lista och behåller aldrig det du skriver. Om du stänger en [cell för logiskt namn](./logical-names.md#writing-a-logical-name) på ett ändrat logiskt namn kan även det fysiska namnet fyllas i.  
Efter `Escape` förblir cellen fokuserad och tabellen markerad, och ett andra tryck på `Escape` tar bort både fokus och markering. Medan en cell för logiskt namn visar sin [lista med termer](./logical-names.md#completing-term-names) stänger det första trycket på `Escape` bara listan.  
Medan en inmatningsmetod fortfarande sätter samman tecken håller `Escape` redigeringsläget öppet.

![En tabell läggs till med Alt + N och två kolumner fylls i](/img/demo-table-edit.webp)

## Lägga till kolumner {#adding-columns}

Kolumner skapas med kortkommandot `Alt + Enter` (Windows/Linux) eller `⌥ + Enter` (Mac), som lägger till en kolumn i varje markerad tabell, eller med knappen `+` i en tabells rubrik, som lägger till en i just den tabellen.  
Den nya kolumnens första cell får fokus, den första som dess rad ritar i [kolumnordningen](./settings.md#adjusting-column-order). Med standardordningen är det dess namn, som i `Logical Names` är dess logiska namn och i `Both Names` dess cell `Logical Name` – se [Namnvisning](./logical-names.md#name-view).  
En kolumn som läggs till med `Tab` från den sista cellen, och den primärnyckel som en relationsritning lägger till i en föräldratabell som saknar en, börjar också på den cellen.

## Tabbtangenten {#tab-key}

Tryck på `Tab` för att gå direkt till redigeringsläget i nästa cell.  
Ett tryck på `Tab` i den sista cellen skapar en ny kolumn och öppnar dess första cell för redigering – se [Lägga till kolumner](#adding-columns).  
Använd `Shift + Tab` för att gå till redigeringsläget i föregående cell.  
`Tab` och `Shift + Tab` går igenom de celler som tabellen ritar, i deras ordning, så namnvisningen och View Option → `Domain` avgör om celler för logiskt namn och domänceller finns bland dem – se [Skriva ett logiskt namn](./logical-names.md#writing-a-logical-name).  
Märkena för [alternativa nycklar](./table-related-functions.md#alternate-keys) som ritas efter en rads sista cell är inga celler, så tangentbordsfokus hoppar över dem och de öppnas aldrig för redigering.

![Tab flyttar genom radens celler och lägger till en kolumn från den sista cellen, och Shift + Tab går tillbaka](/img/demo-table-tab.webp)

## Autokomplettering av datatyp {#datatype-autocomplete}

Börja redigera cellen `DataType` och skriv. Matchande typer från den valda databasen föreslås, och den del av ett förslag som ordagrant innehåller det du skrev framhävs.  
Själva matchningen är ungefärlig, så `vch` hittar också `VARCHAR`.

- `Arrow Up` eller `Arrow Down`: gå igenom förslagen
- `Arrow Right`, `Tab` eller `Enter`: acceptera det framhävda förslaget
- `Arrow Left`: gå tillbaka till texten du skrev

Du kan också klicka på ett förslag.  
Listan visar upp till tio förslag åt gången och rullar för att visa resten.  
Ingenting är tvingande, så en typ som inte finns i listan kan skrivas fritt, även med argument, som `VARCHAR(255)`. Listan stängs så snart det du skriver går längre än ett helt typnamn, som `VARCHAR(255)` eller `BIGINT UNSIGNED` gör.  
Förslagen följer den valda databasen. Om du byter databas ändras det som erbjuds, och befintliga kolumner lämnas som de är.

Om du skriver i cellen `DataType` för en kolumn som är kopplad till en domän, eller accepterar ett förslag där, kopplas kolumnen från så snart dess typ skiljer sig från domänens – se [Domäner och datatyper](./dictionary.md#domains-and-data-types).  
I `Logical Names`, medan View Option → `Domain` är av, visar typcellen för en kolumn som är kopplad till en namngiven domän namnet på domänen, och när du redigerar cellen öppnas [domänväljaren](./logical-names.md#the-domain-cell) i stället för de här förslagen. I en typcell som visar en datatyp redigeras datatypen som ovan.

![Celler för DataType fylls i från ungefärliga förslag med piltangenterna, Tab och Enter](/img/demo-data-type-autocomplete.webp)

## Inte null, Unik, Automatisk uppräkning {#not-null-unique-auto-increment}

De här tre cellerna är växlingsknappar i stället för text.  
Dubbelklicka på en av dem, eller tryck på `Enter` medan den är fokuserad, för att växla den.

Cellen Inte null visar `N-N` när flaggan är satt och `NULL` när den inte är det.  
`UQ` och `AI` är nedtonade när de är av och framhävda när de är på.

![Inte null växlas med ett dubbelklick, och Unik och Automatisk uppräkning med Enter](/img/demo-column-options.webp)

Celler som döljs av [visningsalternativen för tabeller](./table-related-functions.md) kan inte växlas.

## Markera flera kolumner {#selecting-multiple-columns}

Det finns fem sätt:

- `Shift + Arrow Up/Down`: utöka markeringen en rad i taget
- `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac): lägg till en enskild kolumn
- `Shift + click`: markera intervallet från den senast fokuserade kolumnen
- `Ctrl + Shift + click` (Windows/Linux) eller `⌘ + Shift + click` (Mac): lägg till det intervallet i markeringen
- `Alt + A` (Windows/Linux) eller `⌥ + A` (Mac): Markera alla

![Kolumner markeras med Shift + Arrow Down, Ctrl/⌘ + click, Shift + click och Alt + A](/img/demo-column-select.webp)

Om du vill flytta de markerade kolumnerna tillsammans drar du i handtaget bredvid den fokuserade – se [Ordna om och flytta kolumner](#rearranging-and-moving-columns).

Ett högerklick på en kolumns rad avgör vilka kolumner tabellens snabbmeny verkar på, oavsett vilken modifierartangent som hålls ned.  
På en rad som redan är markerad behålls markeringen och fokus flyttas till den raden. På någon annan rad markeras enbart den raden. Detta gäller var som helst på raden, även på nyckelikonen och på ett märke för en [alternativ nyckel](./table-related-functions.md#alternate-keys).  
Om du vill använda menyn på flera kolumner, som i [Primärnyckel för kolumner](#column-primary-key) eller [Ta bort kolumner](#column-deletion), högerklickar du därför på en av de markerade raderna.  
På en Mac öppnar `Ctrl + click` också menyn, men det räknas som ett vanligt klick, så på en cell markerar det enbart den raden innan menyn öppnas.

## Ordna om och flytta kolumner {#rearranging-and-moving-columns}

En kolumn flyttas med sitt draghandtag, en liten knapp med ett greppmönster som står precis utanför tabellens vänstra kant, bredvid den fokuserade raden.  
Fokusera någon cell i kolumnen, genom att klicka på den eller med piltangenterna eller `Tab`, så visas handtaget bredvid dess rad. Ingen rad har något handtag medan fokus ligger på tabellhuvudet.  
Handtaget ritas svagt tills pekaren är på det, och pekaren blir då en hand. Enbart ett tryck gör ingenting: dragningen börjar när pekaren rör sig, och den kan föra kolumnen till en annan plats i dess tabell eller in i en annan tabell.  
Över en tabells rader flyttas de dragna raderna på plats, och raderna runt platsen där du släpper glider undan för att ge plats. Över tom arbetsyta, eller över tabellhuvudet på en tabell som har kolumner, följer en genomskinlig kopia av raderna pekaren och visar varje rads namn- och typceller så som raden ritar dem i den aktuella [namnvisningen](./logical-names.md#name-view).  
Släpp precis under en tabells sista rad för att flytta kolumnen till slutet av den tabellen. En tabell utan kolumner tar emot kolumnen var du än släpper den på tabellen. Remsan precis till vänster om en tabell, där handtaget står, räknas också som tabellens rader, så en dragning rakt nedåt längs handtaget ordnar om kolumnerna utan att pekaren kommer in i tabellen.  
En kolumn som flyttas in i en annan tabell behåller sitt logiska namn och sin domän.

![En kolumn fokuseras och handtaget bredvid dess rad dras till en ny position, och sedan dras en annan kolumns handtag in i en annan tabell](/img/demo-column-move.webp)

Om du vill flytta flera kolumner på en gång [markerar du dem](#selecting-multiple-columns) och drar i handtaget bredvid den fokuserade. Medan den fokuserade kolumnen är en av två eller fler markerade kolumner i sin tabell bär handtaget med sig alla; annars bär det med sig sin egen kolumn.  
Ingen modifierartangent behövs. Om du håller ned `Alt` (Windows/Linux) eller `⌥` (Mac) på handtaget flyttas kolumnerna som vid en vanlig dragning, och ingenting dupliceras.

![Tre kolumner markeras, och sedan dras handtaget bredvid den fokuserade in i en annan tabell medan de andra markerade kolumnerna följer med](/img/demo-column-multi-move.webp)

En dragning som börjar på en kolumns rad i stället för på dess handtag flyttar tabellen, som en dragning i tabellhuvudet gör – se [Flytta flera tabeller](./table-related-functions.md#moving-multiple-tables). `Alt + drag` (Windows/Linux) eller `⌥ + drag` (Mac) på en rad duplicerar tabellen – se [Duplicera tabeller och anteckningar](./table-related-functions.md#duplicating-tables-and-memos).  
Inget handtag ritas vid en zoom på `70%` och lägre, där tabellerna bara visar sina namn, eller i en skrivskyddad editor, så kolumner kan inte ordnas om där.  
Ett kolumndrag som pågår när editorn blir skrivskyddad avslutas direkt: kopian som följer pekaren och greppande handen försvinner, och att släppa flyttar ingen kolumn. Rader som draget redan hade flyttat stannar där det flyttade dem.

## Ta bort kolumner {#column-deletion}

Tar bort de markerade kolumnerna i den fokuserade tabellen. Ett klick på en cell markerar dess kolumn, så om du klickar på en cell och trycker på `Delete` tas just den kolumnen bort.  
Kortkommandon:

- `Delete` eller `Backspace`. De tar bort de markerade kolumnerna medan deras tabell är det enda som är markerat. När ingen kolumn är markerad (fokus ligger på tabellens namn, [logiska namn](./logical-names.md#name-view) eller kommentar), när något annat också är markerat eller vid en zoom på `70%` och lägre, där tabellerna bara visar sina namn, tar de i stället bort hela markeringen – se [Ta bort tabeller och anteckningar](./table-related-functions.md#table-and-memo-deletion).
- `Alt + Backspace` eller `Alt + Delete` (Windows/Linux), `⌥ + Backspace` eller `⌥ + Delete` (Mac). De tar bort den fokuserade tabellens markerade kolumner även när andra tabeller eller anteckningar också är markerade. De tar inte bort något medan en cell redigeras eller vid `70%` och lägre.

![En kolumn och sedan två markerade kolumner tas bort med Alt + Backspace](/img/demo-column-remove.webp)

Tabellens snabbmeny gör samma sak. Högerklicka på en kolumns rad medan tabellen är det enda som är markerat: det sista menyalternativet visar `Delete column`, eller `Delete columns` när raden är en av två eller fler markerade kolumner.

Medan en cell redigeras raderar `Delete` och `Backspace` bara text. När de hålls ned utanför cellens redigeringsfält tar de bort bara en gång.  
Efter en borttagning flyttas fokus till den närmaste kvarvarande kolumnen ovanför den fokuserade. När ingen finns kvar ovanför flyttas fokus till tabellnamnet (i `Logical Names` det logiska namnet som ritas i dess ställe) även om kolumner finns kvar nedanför, så nästa `Delete` eller `Backspace` tar bort tabellen i stället för en kolumn.  
Relationer och index som använder en borttagen kolumn tas bort med den. Det finns ingen bekräftelse, och hela borttagningen ångras i ett steg.

## Kopiera/klistra in kolumner {#copyingpasting-columns}

Fungerar som ett tabellbaserat Urklipp.  
Kortkommandon: `Ctrl + C` (Windows/Linux) eller `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) eller `⌘ + V` (Mac)

När du kopierar ut till ett kalkylblad, klistrar in från ett eller klistrar in i den tabell vars kolumncell är fokuserad används de celler som tabellerna visar, i den ordning de visar dem – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options), [Ändra kolumnordning](./settings.md#adjusting-column-order) och [Namnvisning](./logical-names.md#name-view). Namnvisningen ändrar vad några av de cellerna innehåller:

- I `Logical Names` innehåller namnets cell det logiska namnet, eller ingenting medan det är tomt. Medan View Option → `Domain` är av innehåller typcellen namnet på kolumnens domän där den visar ett sådant, och annars datatypen.
- I `Both Names` kopieras och klistras cellen `Logical Name` in där kolumnordningen placerar den.
- En visad domäncell innehåller domänens namn, eller ingenting för en kolumn som inte visar någon domän.

Kolumner som kopieras i editorn och klistras in med ett tabellhuvud markerat, eller i de andra markerade tabellerna, tar med varje cell i de kopierade kolumnerna, även dolda celler som Unik och Automatisk uppräkning, och deras logiska namn.  
De behåller en domänkoppling bara medan det här diagrammet listar samma domän, inte enbart en med samma namn, och domänen fortfarande har den kopierade kolumnens typ. Annars hamnar de okopplade, med den typ de kopierades med. Deras namn räknas som skrivna av dig, utom när ett inklistrat namn är tomt och det logiska namnet härleder ett – se [Härleda fysiska namn](./dictionary.md#deriving-physical-names).  
Märken för [alternativa nycklar](./table-related-functions.md#alternate-keys), som `AK1.1`, är inga celler, så kopiering och inklistring utelämnar dem även när de visas.

Du kan klistra in från editorn i Excel och från Excel tillbaka i editorn.  
Cellvärden går ut exakt som de skrevs in, så ett värde som `<label>` eller `a &amp; b` når ett kalkylblad eller ett dokument oförändrat.  
Kolumnerna i ett kalkylblad matchas mot de synliga cellerna efter position, inte efter namn, så bladets kolumner måste följa cellernas ordning.  
För kolumnerna nedan tolkas vart och ett av dessa värden som sant (skiftlägesokänsligt):

- Automatisk uppräkning: `TRUE`, `1`, `YES`, `Y`
- Unik: `TRUE`, `1`, `YES`, `Y`
- Inte null: `TRUE`, `1`, `YES`, `Y`, `NOT NULL`

När kolumner kopieras ut skriver editorn `TRUE` eller `FALSE` för Automatisk uppräkning och Unik, och `NOT NULL` eller `NULL` för Inte null.  
Unik och Automatisk uppräkning är dolda som standard, så `TRUE` och `FALSE` skrivs och läses först när de cellerna visas.

![Fyra kolumner klistras in i ett kalkylblad, med flaggorna skrivna som TRUE/FALSE och NOT NULL/NULL](/img/demo-copy-column-to-sheet.webp)

![Tre rader från ett kalkylblad klistras in i en tabell som kolumner, där YES, 1 och NOT NULL tolkas som sant](/img/demo-copy-sheet-column.webp)

Var en inklistring hamnar beror på fokus:

- När ett tabellhuvud är markerat läggs de inklistrade raderna till som nya kolumner i varje markerad tabell.
- När en kolumncell är fokuserad skrivs den tabellens markerade rader, och sedan raderna under den sista av dem, över i tur och ordning, lika många som klistrades in. Rader mellan separata markeringar hoppas över. En överskriven rad får de inklistrade värdena i sina synliga celler och behåller sina dolda, och de rader som blir över läggs till som nya kolumner. I alla andra markerade tabeller läggs de inklistrade raderna till som nya kolumner.

![Två kolumner kopieras och klistras in i två markerade tabeller på en gång](/img/demo-copy-column-multi.webp)

En inklistrad rad skriver logiska namn och domäner så här:

- Ett logiskt namn, från en cell `Logical Name` eller från namnets cell i `Logical Names`, räknas som fullständigt inskrivet. Medan kolumnens namn är tomt eller fortfarande härlett härleder [ordlistorna](./dictionary.md#deriving-physical-names) det fysiska namnet från det och kopplar den domän som dess term ger, om inte radens egen domäncell kopplar en. Ett namn som samma rad klistrar in behålls och räknas som skrivet av dig.
- En domäncell, eller typcellen i `Logical Names` medan View Option → `Domain` är av, kopplar den domän som dess text namnger om diagrammet listar en sådan. All annan text, eller en tom cell, kopplar ingen domän och kopplar från kolumnen, även från en domän av den inklistrade typen. Text i typcellen som inte namnger någon domän tolkas som en datatyp. Rader som har kopierats i editorn kopplar i stället den domän de kopierades med, och bara medan det här diagrammet listar den med den kopierade typen, som nya kolumner gör.
- En kopplad domän ger kolumnen sin datatyp, om inte raden klistrar in en egen typ. Då kopplas en domän av en annan typ inte, och kolumnen får den inklistrade typen.
- I en rad utan domäncell gör en inklistrad typ att kolumnen kopplas från en domän av en annan typ, precis som när du skriver typen.
- Ingen inklistring för en typ vidare via [Synkronisera datatyp i relationer](./settings.md#relationship-datatype-sync).

## Kopiera/klistra in tabeller och anteckningar {#copyingpasting-tables-and-memos}

När ingen kolumn är markerad i en fokuserad tabell kopierar samma kortkommandon själva de markerade tabellerna och anteckningarna – se [Tabellfunktioner](./table-related-functions.md).

## Primärnyckel för kolumner {#column-primary-key}

Slår på och av primärnyckeln på den fokuserade kolumnen, det vill säga den kolumn som den fokuserade cellen tillhör.  
När den fokuserade kolumnen är en av två eller fler markerade kolumner gäller växlingen alla markerade kolumner: om någon av dem inte är en nyckel blir alla nycklar, och om alla redan är det tas nyckeln bort från alla. Kolumner utanför markeringen lämnas orörda.  
Använd tabellens snabbmeny eller kortkommandot `Alt + K` (Windows/Linux) eller `⌥ + K` (Mac). När växlingen omfattar två eller fler kolumner visar menyalternativet `Primary Key on selected columns` i stället för `Primary Key`.  
Nyckelikonen på raden är endast till för visning, så ett klick på den sätter inte nyckeln.

Om du vill göra flera kolumner till en sammansatt nyckel [markerar du dem](#selecting-multiple-columns) och trycker sedan på `Alt + K` (Windows/Linux) eller `⌥ + K` (Mac), eller högerklickar på en av de markerade raderna och väljer `Primary Key on selected columns`. Varje växling ångras i ett steg.

![Två kolumner markeras med Shift + Arrow Down, sedan görs båda till primärnyckel med ⌥ + K, och ett andra tryck tar bort nyckeln från båda](/img/demo-column-pk.webp)

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) öppnas ingen cell för redigering och ingen kolumn ändras.  
Ett klick på en cell fokuserar ingenting och tar bort den markering som ett hopp lämnade. `Enter` och ett dubbelklick öppnar ingen redigerare och växlar ingen omkopplare, `Tab` överlåts åt sidan, och kortkommandona som lägger till, markerar eller tar bort kolumner, växlingen av primärnyckel och en inklistring gör ingenting.  
Att gå till en kolumn från [utforskaren](./explorer.md#going-to-a-row) eller [snabbsökningen](./quick-search.md) fokuserar dess cell. Piltangenterna flyttar sedan fokus från cell till cell, och kolumnen de når markeras ensam, eftersom `Shift` inte lägger till någon kolumn där.  
`Ctrl + C` (Windows/Linux) eller `⌘ + C` (Mac) kopierar fortfarande den markerade kolumnen, eller den tabell som ett hopp markerade – se [Kopiera/klistra in kolumner](#copyingpasting-columns).
