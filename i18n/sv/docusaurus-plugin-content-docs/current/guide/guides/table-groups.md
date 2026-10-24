---
sidebar_position: 6
description: Samla relaterade tabeller i en namngiven, färgad ruta bakom dem; skapa, namnge, färglägg, flytta, ändra storlek på och ta bort grupper, gå till dem från utforskaren, ändra vilka tabeller de innehåller, dölj dem och behåll dem i automatisk layout, Schema SQL och DBML.
---

# Tabellgrupper

En tabellgrupp är en namngiven, färgad ruta som ritas bakom relaterade tabeller på ERD-arbetsytan för att visa vilka tabeller som hör ihop.  
En tabell ingår i högst en grupp. Grupperna sparas med diagrammet, tillsammans med vilken grupp varje tabell ingår i.

Rutan har en namnlist längs överkanten med en gruppikon, gruppens namn i fetstil och, medan pekaren hålls över gruppen, ett `x` som tar bort den – se [Ta bort en grupp](#removing-a-group). En grupp utan namn visar `unnamed`, och ett namn som är för långt för namnlisten kortas av med `…`.  
Rutan rymmer alltid sina tabeller: den behåller den storlek den har fått, men sträcks ut så att varje tabell ryms inuti med `24px` utrymme runt sig och namnlisten ovanför. En tabell som växer sträcker ut rutan med sig, och det gör även en tabell som släpps nära en kant med mitten fortfarande inne i rutan. Rutan varken växer eller krymper medan tabeller dras. Utsträckningen sparas inte: rutan återgår till sin egen storlek så snart tabellen inte längre behöver utrymmet.

Grupper ritas bakom allt annat på arbetsytan: tabeller, anteckningar och relationslinjer.  
Där grupper överlappar varandra ritas den grupp längst fram som sist trycktes ned eller lades till, och ingen grupps yta täcker någonsin en annan grupps namnlist. Ordningen sparas inte, så ett diagram som öppnas igen staplar sina grupper i den ordning de lades till.  
Grupper visas på ERD-arbetsytan, i minikartan och i en exporterad bild, och [utforskaren](./explorer.md) listar dem – se [Gå till en grupp](#going-to-a-group). Fliken [Visualisering](./visualization.md) ritar varken grupper eller gruppfärger i något av lägena.

En kodagent kan också skapa och ändra grupper och läsa DDL-koden för valda grupper – se [Tabellgrupper](../../mcp/tools.md#table-groups) bland MCP-verktygen.

![Ritläget för en grupp aktiveras med ⌥ + G, gruppen ritas över orders och payments och får namnet Billing, order_items släpps i den, och sedan flyttas gruppen och ändras i storlek](/img/demo-table-group.webp)

## Skapa en grupp {#creating-a-group}

Det finns två sätt att skapa en grupp, vart och ett med ett kortkommando. Inget av dem erbjuds i en skrivskyddad editor eller medan grupper är [dolda](#hiding-groups), och deras kortkommandon gör då ingenting.  
Liksom arbetsytans övriga kortkommandon fungerar de bara på ERD-fliken och spärras medan en cell, en anteckning eller ett gruppnamn redigeras – se [Kortkommandon](./settings.md#shortcuts).

### Rita en grupp {#drawing-a-group}

Klicka på knappen `New Table Group` i [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar), tryck på `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) eller välj `New Table Group` i arbetsytans snabbmeny, där alternativet kommer efter `New Table` och `New Memo`, eller i [snabbsökningen](./quick-search.md) på ERD-fliken. Dra sedan upp en ruta på arbetsytan.  
Knappen och kortkommandot slår på och av ritläget, så ett tryck på någon av dem medan det är aktivt avslutar det, oavsett hur det startades; menyalternativet i snabbmenyn och snabbsökningen startar det bara. Att starta det slår av handverktyget och avbryter en relation som håller på att ritas.  
Medan ritläget är aktivt är markören ett hårkors, och ett tryck startar rutan var det än hamnar, även över en tabell, i stället för att markera eller flytta det som ligger under. Arbetsytans verktygsfält framhäver då sin knapp `New Table Group` och varken handen eller pekaren.

När du släpper läggs en grupp till i den rutan, aldrig mindre än `160px` bred och `100px` hög, namnlisten inräknad, hur kort du än drar. Ett klick utan att dra lägger till en grupp som är `480px` bred och `320px` hög med sitt övre vänstra hörn vid klicket.  
Varje tabell utan grupp vars mitt ligger inuti den nya rutan går med i gruppen. En tabell som redan ingår i en annan grupp stannar kvar där.

Mittenknappen panorerar fortfarande arbetsytan och lämnar ritläget aktivt. Följande avslutar ritläget utan att lägga till en grupp:

- `Escape`, eller `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac), före trycket eller medan du drar. Före trycket lämnar de markeringen som den är; trycket som startar rutan har redan avmarkerat allt.
- Ett högerklick, som avmarkerar allt. Ingen snabbmeny öppnas.
- Att byta till handverktyget med `Space` eller arbetsytans verktygsfält, att klicka på verktygsfältets pekare eller dess knapp `New Table Group` eller att påbörja en relation.
- Att byta till en annan flik, att dölja grupperna eller att editorn blir skrivskyddad.

### Gruppera markerade tabeller {#grouping-selected-tables}

Markera en eller flera tabeller och tryck på `T` och sedan `G`, eller välj `Group selected tables` i en tabells snabbmeny eller `Group Selected Tables` i snabbsökningen, som listar kommandot medan en tabell är markerad.  
Den nya gruppen ritas runt de markerade tabellerna med `24px` utrymme på varje sida och namnlisten ovanför. Varje markerad tabell går med i den och lämnar den grupp den eventuellt ingick i, och gruppen den lämnade finns kvar, även om den nu är tom. Anteckningar i markeringen hoppas över.

`T` och sedan `G` är två tryck utan modifierartangent, `G` inom en sekund efter `T`. Utan någon markerad tabell gör det ingenting, och i ett textfält, till exempel utforskarens sökfält, skriver det de två bokstäverna.

![Tabellerna categories och products grupperas med T och sedan G, gruppen får namnet Catalog och sedan färgen Violet från sin meny, så att båda tabellhuvudena får färgen](/img/demo-table-group-selected.webp)

Oavsett vilket sätt du använder har den nya gruppen inget namn och ingen färg. Den markeras ensam, och dess namnfält öppnas över namnlisten så att du kan skriva ett namn direkt – se [Namnge en grupp](#naming-a-group).  
Gruppen och tabellerna den tar in är ett steg i ångrahistoriken, och namnet du skriver är ett till.

## Namnge en grupp {#naming-a-group}

En grupps namn redigeras i ett fält som öppnas över dess namnlist. Fältet öppnas av sig självt när en grupp har skapats, vid ett dubbelklick på namnlisten och via `Rename` i gruppens snabbmeny.  
`Enter`, eller ett klick någon annanstans, sparar namnet. `Escape` stänger fältet utan att ändra namnet och lämnar gruppen markerad, och ett andra tryck på `Escape` avmarkerar allt.  
Ett ändrat namn är ett steg i ångrahistoriken; att spara namnet oförändrat registrerar ingenting. Ett tomt namn eller ett namn med enbart blanksteg visas som `unnamed`.  
Medan fältet är öppet spärras arbetsytans kortkommandon, och kortkommandona för snabbsökningen och `Toggle Explorer` gör ingenting, liksom när en tabellcell redigeras.

Funktionen [Sök och ersätt](./find-and-replace.md#what-it-searches) söker i gruppnamn under `Table group names` medan grupper visas, och dess `Replace` och `Replace All` byter namn på grupper – se [Ersätta](./find-and-replace.md#replacing). [Snabbsökningen](./quick-search.md#searching-the-diagram) söker inte i gruppnamn.

## Färglägga en grupp {#coloring-a-group}

Välj `Color` i gruppens snabbmeny för att öppna färgväljaren med gruppens färg.  
Liksom för tabeller och anteckningar färgar väljaren varje markerad tabell, anteckning och grupp, och `Remove color` i menyn, eller `No color` i väljaren, tar bort färgen från dem alla – se [Ange färg för tabeller och anteckningar](./table-related-functions.md#table-and-memo-color-specification). En grupps färg erbjuds också under `Document colors` i väljaren.

En färgad grupp ritar sin namnlist och kontur i färgen och sin yta i en blek nyans av den. En grupp utan färg använder temats neutrala gråtoner.  
Varje tabell i en färgad grupp bär gruppens färg över sitt tabellhuvud och behåller sin egen färg på sin vänstra kant, så att båda syns.  
Texten och knapparna på ett sådant tabellhuvud blir vita, eller svarta på en ljus färg där svart är mycket lättare att läsa, och detsamma gäller namnet, ikonen och `x` på gruppens namnlist. Bland väljarens förinställda färger får Orange, Amber, Yellow och Lime svart, och resten får vitt.  
En tabell behåller sitt eget tabellhuvud medan dess grupp saknar färg, medan grupper är dolda, vid zoomnivån `70%` och lägre, där tabeller fälls ihop till sitt namn, och på fliken Visualisering.

En färgändring registreras i [ångrahistoriken](./undo-redo.md#one-gesture-one-step) på samma sätt som för tabeller och anteckningar.

## Markera grupper {#selecting-groups}

Klicka på en grupps namnlist för att markera gruppen ensam, eller använd `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac) för att lägga till den i markeringen.  
Ett tryck på namnlisten för en grupp som redan är markerad behåller hela markeringen, så att en dragning då flyttar allt.  
Ett tryck på namnlisten, eller ett högerklick på gruppen, lägger gruppen framför de andra grupperna och dess tabeller framför alla andra tabeller och anteckningar.

Gruppens yta, området under namnlisten, fungerar som arbetsytan för vänster musknapp: att dra i den panorerar, `Ctrl + drag` (Windows/Linux) eller `⌘ + drag` (Mac) ritar en markeringsram och ett klick avmarkerar allt. Tabellerna, anteckningarna och relationslinjerna över ytan svarar på pekaren som vanligt.

En markeringsram tar med en grupp bara när den omsluter gruppens hela ruta, så en ram som ritas inuti en grupp plockar ut tabeller utan gruppen – se [Markera flera objekt](./table-related-functions.md#multiple-selection).  
`Ctrl + A` (Windows/Linux) eller `⌘ + A` (Mac) markerar aldrig en grupp.

`Select tables` i gruppens snabbmeny ersätter markeringen med gruppens tabeller och utelämnar själva gruppen, så att nästa kommando bara når tabellerna.  
Använd det före kommandon som enbart verkar på tabeller, som att kopiera eller [fokusera på tabeller](./table-related-functions.md#focusing-on-tables), vilka hoppar över en markerad grupp.

En markerad grupps kontur får markeringsfärgen. I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) får en grupp som en annan deltagare markerar en ram i den deltagarens färg.

## Gå till en grupp {#going-to-a-group}

[Utforskaren](./explorer.md#the-tree) listar grupperna i sin mapp `Table Groups`, efter namn, var och en med sina tabeller under sig. Snabbsökningen listar inga grupper.

Om du väljer en grupprad i utforskaren, en träff i ett gruppnamn i [Sök och ersätt](./find-and-replace.md#going-to-a-match) eller en grupprad i listan i [diff-visaren](./table-related-functions.md#the-change-tree) går du till den gruppen.  
Gruppens ruta visas då i vyn, med namnlisten som huvuddel när rutan är högre än arbetsytan – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). Därefter markeras gruppen ensam och läggs överst tillsammans med sina tabeller, på samma sätt som vid ett tryck på dess namnlist.  
Medan grupper är [dolda](#hiding-groups), eller när gruppen har tagits bort, gör det ingenting att gå till den.  
I diff-visaren går varje sida till gruppen bara om dess eget dokument innehåller och visar den – se [Gå till en ändring](./table-related-functions.md#going-to-a-change).

## Flytta en grupp och ändra dess storlek {#moving-and-resizing-a-group}

Dra en grupp i dess namnlist för att flytta den med alla dess tabeller.  
Om gruppen ingår i en större markering flyttas hela markeringen med den, och en tabell som både är markerad och ingår i gruppen flyttas en gång.  
Dragningen börjar först när pekaren har flyttats en kort bit, så ett klick eller dubbelklick på namnlisten förblir ett klick. `Alt + drag` på en namnlist flyttar gruppen som en vanlig dragning gör; en grupp dupliceras aldrig.  
Flytten, med varje tabell den tar med sig, är ett steg i ångrahistoriken.

Att dra en tabell för sig flyttar bara den tabellen och kan flytta den in i eller ut ur en grupp – se [Lägga till och ta bort tabeller](#adding-and-removing-tables).

Varje grupp har storlekshandtag på sina fyra kanter och fyra hörn, markerad eller inte, liksom en anteckning.  
Dra i ett av dem med vänster musknapp: rutan följer pekaren, och den nya storleken sparas när du släpper, som ett steg i ångrahistoriken.  
En grupp kan inte göras mindre än `160px` gånger `100px`, och inte heller mindre än sina tabeller med deras `24px` utrymme och namnlisten. Kanten stannar där hur långt pekaren än går.

## Lägga till och ta bort tabeller {#adding-and-removing-tables}

En tabell går med i eller lämnar en grupp där du släpper den.  
När du drar tabeller och släpper bedöms varje dragen tabell som inte förs med av en markerad grupp utifrån sin mitt. Den går med i den översta grupp vars ruta innehåller dess mitt, eller lämnar sin grupp om dess mitt inte ligger i någon grupps ruta. Den översta gruppen är den som ritas längst fram.  
En grupp som dragningen lämnar på plats behåller den ruta den hade när dragningen började, så en tabell som flyttas en aning inom sin egen grupp stannar kvar i den och måste dras tills dess mitt är utanför den rutan för att lämna den.  
Medan du drar visas en kontur runt varje grupp som släppet skulle placera en tabell i.

När du släpper inom ungefär `200ms` efter den sista rörelsen ingår gruppbytet i dragningens steg i ångrahistoriken, så att en enda ångring flyttar tillbaka tabellerna dit de var och till de grupper de ingick i. Efter en längre paus innan du släpper är gruppbytet ett eget steg – se [En gest, ett steg](./undo-redo.md#one-gesture-one-step).  
Ett klick, eller en dragning på några få pixlar, ändrar ingen grupp, och ingenting byter grupp medan grupper är dolda.

De andra sätten att ändra vilka tabeller en grupp innehåller:

- `Remove from group` i en tabells snabbmeny tar ut varje markerad tabell ur sin grupp. Det visas medan en markerad tabell ingår i en grupp, även medan grupper är dolda, och är ett steg i ångrahistoriken.
- `Group selected tables` flyttar de markerade tabellerna till en ny grupp – se [Gruppera markerade tabeller](#grouping-selected-tables).
- Att ta bort en grupp lämnar dess tabeller utan grupp.

En tabell som klistras in eller dupliceras med `Alt` ingår inte i någon grupp, även när den hamnar inuti en grupps ruta. Om du drar den efteråt tillämpas släppregeln.

## Ta bort en grupp {#removing-a-group}

Att ta bort en grupp tar aldrig bort dess tabeller: de stannar där de är, utan grupp.

- `x` i slutet av namnlisten, som visas medan pekaren hålls över gruppen, tar bort enbart den gruppen.
- `Delete` i gruppens snabbmeny tar bort gruppen. När gruppen är ett av flera markerade objekt visar raden `Delete selected` och tar bort allt markerat: tabeller, anteckningar och grupper.
- När grupper är markerade tar `Delete` eller `Backspace` bort de markerade grupperna tillsammans med eventuella markerade tabeller och anteckningar, liksom `Ctrl + Backspace` och `Ctrl + Delete` (Windows/Linux) eller `⌘ + Backspace` och `⌘ + Delete` (Mac) – se [Ta bort tabeller och anteckningar](./table-related-functions.md#table-and-memo-deletion).

Varje borttagning ångras i ett steg, som tar tillbaka gruppen med dess tabeller i den.

## Gruppmenyn {#the-group-menu}

Högerklicka på en grupps namnlist, yta eller kant för att öppna dess meny. På en Mac öppnar `Ctrl + click` också menyn, och det gör även ett långt tryck på en pekskärm.  
Högerklicket markerar först gruppen, ensam om den inte redan ingår i markeringen, så `Color` och `Delete selected` når resten av markeringen bara när gruppen ingick i den.

- `Select tables`: markerar enbart gruppens tabeller – se [Markera grupper](#selecting-groups).
- `Rename`: öppnar namnfältet – se [Namnge en grupp](#naming-a-group).
- `Color`: öppnar färgväljaren – se [Färglägga en grupp](#coloring-a-group).
- `Remove color`: visas medan något markerat har en färg.
- `Delete`, eller `Delete selected` när gruppen är ett av flera markerade objekt, med tangenten `Delete` visad till höger – se [Ta bort en grupp](#removing-a-group).

En tabells snabbmeny lägger till `Group selected tables` och `Remove from group` efter `Color` och `Remove color`, före sin rad Delete, och arbetsytans snabbmeny lägger till `New Table Group`.  
`Group selected tables` visar sina tangenter, `T` och sedan `G`, till höger, och `New Table Group` visar `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac).

## Dölja grupper {#hiding-groups}

`View Option` → `Table Groups` i arbetsytans snabbmeny visar eller döljer alla grupper. Alternativet är ikryssat som standard – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options).  
När det är urkryssat försvinner grupprutorna och gruppfärgerna på tabellhuvudena från arbetsytan, minikartan och exporterade bilder, och rullningslisterna och minikartan lämnar inte längre plats åt grupperna. Ingenting flyttas eller ändrar storlek, och varje tabell stannar kvar i sin grupp.  
Att dölja grupperna avmarkerar dem, avslutar ritläget för `New Table Group` och stänger ett öppet namnfält.

Medan grupper är dolda:

- `New Table Group` och `Group selected tables` erbjuds inte i menyerna, inte heller `New Table Group` och `Group Selected Tables` i snabbsökningen, och arbetsytans verktygsfält utelämnar sin knapp `New Table Group`. `Remove from group` erbjuds fortfarande.
- `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) samt `T` och sedan `G` gör ingenting.
- Att dra tabeller ändrar ingen grupp, och en markeringsram tar inte med någon grupp.
- Utforskaren utelämnar sin mapp `Table Groups`, och funktionen Sök och ersätt varken hittar eller ersätter gruppnamn, även när `Table group names` är på.
- [Automatisk layout](#auto-layout) håller fortfarande ihop varje grupps tabeller, fliken Schema SQL erbjuder fortfarande [grupperna att välja bland](#schema-sql-by-group), DBML skriver dem fortfarande och [Importera och lägg till](./file-import-export.md#import-and-add) lägger fortfarande till nedanför de dolda rutorna.

Valet sparas i dokumentet och registreras i [ångrahistoriken](./undo-redo.md#what-the-history-records), liksom de andra visningsalternativen.

## Automatisk layout {#auto-layout}

Varje [automatisk layout](./table-related-functions.md#auto-layout) håller ihop varje grupps tabeller, oavsett om grupper visas eller inte.

- `Force` flyttar varje grupp med dess tabeller som en enda ruta, där tabellerna behåller sina platser inuti den, och håller varje grupps ruta minst `100px` från andra grupper och från tabeller utan grupp. Förhandsgranskningen visar varje grupp där den kommer att hamna.
- `Flow`, `Tree - vertical` och `Tree - horizontal` ordnar varje grupps tabeller inuti gruppen och placerar grupperna efter relationerna mellan dem, med tabellerna utan grupp ordnade runt dem.

Efteråt anpassas varje grupp som innehåller tabeller efter dem: dess ruta blir deras yttre gränser med `24px` utrymme och namnlisten. En grupp utan tabeller behåller sin plats och storlek.  
Tabellerna och grupperna hamnar på plats som ett steg i ångrahistoriken.

En DBML-import anpassar varje grupp runt dess tabeller på samma sätt, var de än placeras – se [DBML](./file-import-export.md#dbml).

## Schema SQL per grupp {#schema-sql-by-group}

Fliken [Schema SQL](./schema-sql.md) kan skriva enbart tabellerna i valda grupper.  
Medan dokumentet innehåller en grupp, synlig eller dold, visar flikens alternativpanel raden `Tables` under `This window only`, med en kryssruta för `All`, en för varje grupp och en för `No group`, tabellerna utan grupp – se [Tabeller](./schema-sql.md#tables).  
Valet hör till editorfönstret och sparas inte i dokumentet.

## Import, export och kopiering {#import-export-and-copying}

- DBML för över grupper åt båda hållen. En DBML-import gör varje block `TableGroup` till en grupp – se [DBML](./file-import-export.md#dbml) – och kodgeneratorns `DBML` skriver ett block `TableGroup` för varje grupp som innehåller en tabell – se [Kodgenerator](./code-generator.md#language).
- En JSON-fil behåller sina grupper. Inget annat format för över dem: SQL-, GraphQL- och AML-importer tar inte med några, och Schema SQL och kodgeneratorns övriga mål skriver inga.
- [Importera och lägg till](./file-import-export.md#import-and-add) tar in en fils grupper som nya grupper med deras tabeller i och markerar dem tillsammans med de nya tabellerna medan grupper visas, så att en dragning av det tillagda blocket tar med sig dess grupper.
- En [exporterad bild](./file-import-export.md#image) ritar de synliga grupperna bakom tabellerna, med gruppfärgerna på deras tabellhuvuden.
- Att kopiera och klistra in, eller duplicera med `Alt`, kopierar aldrig en grupp – se [Kopiera/klistra in tabeller och anteckningar](./table-related-functions.md#copyingpasting-tables-and-memos) och [Lägga till och ta bort tabeller](#adding-and-removing-tables).

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) ritas grupperna och listas i utforskaren som vanligt, och de går att markera och gå till men inte att ändra:

- Ett tryck på en namnlist markerar gruppen och flyttar ingenting. Det finns inga storlekshandtag och inget `x`.
- Ett dubbelklick på namnlisten öppnar inget namnfält, och gruppmenyn innehåller enbart `Select tables`.
- Arbetsytans meny har inget `New Table Group`, tabellmenyn har varken `Group selected tables` eller `Remove from group`, och snabbsökningen listar inget av de två gruppkommandona. Ritläget för `New Table Group` avslutas när editorn blir skrivskyddad.
- [Arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) visar ingen av sina knappar för att lägga till, `New Table Group` inräknad, och `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) samt `T` och sedan `G` gör ingenting.
- Visningsalternativet `Table Groups` ändrar ingenting, liksom alla visningsalternativ.
- Valet `Tables` på fliken Schema SQL fungerar fortfarande.
