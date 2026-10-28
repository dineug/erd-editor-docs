---
sidebar_position: 5
description: Markera, flytta, kopiera, duplicera och ta bort tabeller och anteckningar, ange färger och visningsalternativ, definiera index och alternativa nycklar, välj en databas, navigera på den oändliga arbetsytan och jämför dokument.
---

# Tabellfunktioner

Allt du gör med tabeller och anteckningar när de väl finns – markera, flytta, kopiera, ta bort, färglägga och ställa in vad arbetsytan visar – samt arbetsytans kontroller runt dem.  
Först kommer kommandona för tabeller och anteckningar; sedan panelen Tabellegenskaper, fokusering på tabeller, index och alternativa nycklar, automatisk layout och databassystemet; därefter själva arbetsytan: arbetsytans verktygsfält, zoom, panorering och var ett hopp hamnar samt diff-visaren; och sist vad en skrivskyddad editor behåller av allt detta.  
Tabellgrupper, rutorna som samlar tabeller, har en egen sida – se [Tabellgrupper](./table-groups.md).  
Det gör även logiska namn och namnvisningen, som avgör vilka namn tabellerna visar – se [Logiska namn](./logical-names.md).

## Markera flera objekt {#multiple-selection}

Det finns tre sätt:

- `Ctrl + drag` (Windows/Linux) eller `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac)
- `Ctrl + A` eller `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` eller `⌘ + ⌥ + A` (Mac)

Anteckningar markeras på samma sätt, och båda kortkommandona för att markera alla tar med varje tabell och anteckning på en gång. Anteckningar som döljs med View Option → `Memos` tas inte med när du markerar alla eller drar en markeringsram – se [Visningsalternativ för tabeller](#table-view-options).  
[Tabellgrupper](./table-groups.md#selecting-groups) läggs till i markeringen med `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac) på namnlisten, men när du markerar alla tas aldrig någon grupp med.  
`Ctrl + A` ger företräde åt textmarkören, så medan du redigerar en cell markerar kortkommandot texten i stället för diagrammet.  
En markeringsram markerar en tabell eller anteckning när den täcker dess mitt, inte när den bara nuddar en kant. Den tar med en tabellgrupp bara när den omsluter gruppens hela ruta, så en ram som dras inuti en grupp markerar tabeller utan gruppen.  
Ett högerklick på något som redan är markerat behåller hela markeringen, så menyalternativ som `Color`, `Group selected tables` och `Delete selected` verkar på allt som är markerat. Ett högerklick på någon annan tabell, anteckning eller tabellgrupp markerar enbart den, även med `Ctrl` eller `⌘` nedtryckt, och ett högerklick på en relation eller på tom arbetsyta avmarkerar allt.  
`Escape` avmarkerar allt. Medan en cell, en anteckning eller namnet på en tabellgrupp redigeras, eller medan en relation eller en `New Table Group` ritas, avslutar ett första tryck på `Escape` detta, och ett andra tryck avmarkerar allt.  
En skrivskyddad editor har inget av de här sätten att markera: bara ett hopp markerar där – se [Skrivskyddade editorer](#read-only-editors).

![Tabeller markeras med ⌘ + drag och ⌘ + click, och sedan varje tabell och anteckning med ⌘ + A](/img/demo-table-select.webp)

I en session för gemensam redigering ritas varje deltagares markering, fokuserade cell och markeringsram på arbetsytan i den deltagarens färg – se [Gemensam redigering](../../api/advanced/collaborative-editing.md).  
För en deltagare som tittar på en annan namnvisning ritas den fokuserade cellen på den cell som din visning ritar i dess ställe, till exempel deltagarens namncell på din cell för logiskt namn – se [Medarbetare](./logical-names.md#collaborators).

## Flytta flera tabeller {#moving-multiple-tables}

Dra en tabell eller anteckning som redan ingår i markeringen, så flyttas hela markeringen med den – ingen modifierartangent behövs.  
En tabell dras i sitt tabellhuvud eller i någon av sina kolumnrader, så en dragning som börjar på en kolumnrad flyttar tabellen, inte kolumnen. Kolumner flyttas i stället med draghandtaget bredvid den fokuserade raden – se [Ordna om och flytta kolumner](./table-editing.md#rearranging-and-moving-columns).  
På en cell i tabellhuvudet eller en kolumnrad börjar tabellen flyttas först när pekaren har förflyttats en kort bit, så ett klick där fokuserar fortfarande cellen och ett dubbelklick öppnar fortfarande dess redigeringsfält. En dragning startar aldrig från en tabells färgkant, som öppnar färgväljaren, från knapparna `+` och `x` i dess tabellhuvud eller från knappen `x` på en kolumnrad.  
Om du drar något utanför markeringen blir det ensamt markerat och flyttas för sig. `Ctrl + drag` (Windows/Linux) eller `⌘ + drag` (Mac) behåller markeringen i båda fallen.  
Bara vänster musknapp flyttar tabeller och anteckningar. Ett högerklick väljer vad snabbmenyn verkar på och flyttar ingenting, och en dragning med mittenknappen panorerar i stället arbetsytan – se [Navigera på arbetsytan](#getting-around-the-canvas).

![Om du drar en av två markerade tabeller flyttas båda, och relationen följer med](/img/demo-table-multiple-move.webp)

En markerad [tabellgrupp](./table-groups.md) flyttas också och tar med sig sina tabeller, och en tabell som både är markerad och ligger i en grupp som dras flyttas en enda gång.  
Beroende på var du släpper en tabell kan den flyttas in i eller ut ur en grupp – se [Lägga till och ta bort tabeller](./table-groups.md#adding-and-removing-tables).

Tabeller och anteckningar delar en och samma staplingsordning. Ett tryck på en tabell eller anteckning, med vänster eller höger knapp, lägger den framför alla andra tabeller och anteckningar, och ett tryck på en tabellgrupps namnlist, eller ett högerklick på dess yta, lägger gruppens tabeller överst.  
Ordningen sparas inte: ett diagram som öppnas igen staplar sina tabeller i den ordning filen listar dem, med alla anteckningar ovanpå.

## Kopiera/klistra in tabeller och anteckningar {#copyingpasting-tables-and-memos}

Kopierar de markerade tabellerna och anteckningarna och klistrar in dem igen som nya.  
Kortkommandon: `Ctrl + C` (Windows/Linux) eller `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) eller `⌘ + V` (Mac)

En kopierad tabell behåller sitt namn, sitt logiska namn, sin kommentar, sina kolumner och sin färg; en kopierad anteckning behåller sin text, sin storlek och sin färg.  
Varje kopierad kolumn behåller sitt logiska namn, och varje tabell- och kolumnnamn behåller uppgiften om huruvida det har härletts från ordlistorna – se [Härleda fysiska namn](./dictionary.md#deriving-physical-names).  
En inklistrad kolumn behåller sin domänkoppling bara när två villkor är uppfyllda: diagrammet som den hamnar i listar just den domänen, inte bara en med samma namn, och domänen har fortfarande den datatyp som kolumnen kopierades med. Annars hamnar kolumnen utan domän och behåller den typ som den kopierades med – se [Koppla en kolumn](./dictionary.md#linking-a-column).  
Index och relationer följer också med: ett index kopieras i sin helhet till den kopierade tabellen, och en relation kopieras med sin typ och sina åtgärder för ON DELETE och ON UPDATE när båda tabellerna som den förbinder ingår i det som kopieras. En halv relation utelämnas i stället för att lämnas kvar och peka tillbaka på originalet.  
De inklistrade kopiorna blir den nya markeringen, och om du klistrar in samma kopia igen förskjuts den ytterligare `50px` varje gång, så att upprepade inklistringar inte hamnar ovanpå varandra.  
En kopia behåller inte sin [tabellgrupp](./table-groups.md): den inklistrade tabellen ligger inte i någon grupp, även när den hamnar inuti en grupps ruta, och en markerad grupp kopieras inte.  
Medan View Option → `Memos` döljer anteckningarna lägger en inklistring ändå till de anteckningar den innehåller, dolda och omarkerade, så att bara de inklistrade tabellerna blir markeringen.

![Två relaterade tabeller kopieras och klistras in två gånger, relationen inräknad](/img/demo-table-copy-paste.webp)

När kolumner är markerade i en fokuserad tabell kopierar samma kortkommando i stället de kolumnerna – se [Redigera tabeller](./table-editing.md).

## Duplicera tabeller och anteckningar {#duplicating-tables-and-memos}

Håll ned `Alt` och dra en tabell eller anteckning med vänster musknapp.  
Du tar tag i en tabell i dess tabellhuvud eller i någon kolumnrad, så `Alt + drag` på en kolumnrad duplicerar tabellen och lämnar kolumnordningen orörd. `Alt` nedtryckt på kolumnens draghandtag duplicerar ingenting: kolumnen flyttas som en vanlig dragning i handtaget flyttar den – se [Ordna om och flytta kolumner](./table-editing.md#rearranging-and-moving-columns).  
En halvgenomskinlig förhandsgranskning följer pekaren, och när du släpper knappen placeras kopian där förhandsgranskningen ligger.  
Om det du tar tag i redan ingår i en markering dupliceras hela markeringen. Annars ersätts markeringen av entiteten under pekaren.  
`Alt + click` utan förflyttning placerar kopian `50px` nedåt och åt höger, och ytterligare ett steg bort varje gång den platsen redan är upptagen.

En dubblett tar med samma saker som en [inklistring](#copyingpasting-tables-and-memos): namn och logiska namn, kommentarer, kolumner, färger, anteckningsstorlekar samt de index och relationer som helt tillhör det du kopierade. Eftersom den stannar i samma diagram behåller den varje kolumns domänkoppling som den är. Liksom en inklistring hamnar den inte i någon tabellgrupp.  
`Alt + drag` på en tabellgrupps namnlist flyttar gruppen som en vanlig dragning gör; en grupp dupliceras aldrig.

![En tabell dupliceras med Alt + drag, och sedan ger Alt + click ytterligare en kopia nedåt och åt höger](/img/demo-table-duplicate.webp)

## Ta bort tabeller och anteckningar {#table-and-memo-deletion}

Tar bort de markerade tabellerna, anteckningarna och [tabellgrupperna](./table-groups.md).  
Kortkommandon:

- `Delete` eller `Backspace`. De tar bort hela markeringen, utom när det enda som är markerat är en tabell där några av kolumnerna är markerade och zoomen är över `70%`: då tar de i stället bort de kolumnerna – se [Ta bort kolumner](./table-editing.md#column-deletion).
- `Ctrl + Backspace` eller `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` eller `⌘ + Delete` (Mac). De tar alltid bort de markerade tabellerna, anteckningarna och tabellgrupperna, även när kolumner är markerade.

![En tabell och dess relationer tas bort med tangenten Delete, och sedan en tabell och en anteckning tillsammans med Delete selected i anteckningens meny](/img/demo-table-remove.webp)

Snabbmenyerna kan också ta bort. Det sista menyalternativet i menyn för en tabell eller en anteckning visar `Delete selected` när tabellen eller anteckningen är ett av två eller fler markerade objekt, och tar då bort hela markeringen. Annars visar det `Delete` och tar enbart bort den tabellen eller anteckningen. Över raden för en markerad kolumn visar tabellens meny i stället `Delete column` eller `Delete columns`, som i [Ta bort kolumner](./table-editing.md#column-deletion).

När du tar bort en tabell tas dess relationer och index bort med den. När du tar bort en tabellgrupp behålls dess tabeller, utan grupp – se [Ta bort en grupp](./table-groups.md#removing-a-group).  
Det finns ingen bekräftelse, varje borttagning ångras i ett steg, och i en editor med `readonly` tas ingenting bort.  
När de hålls ned tar `Delete` och `Backspace` bort bara en gång, och de tar aldrig bort en relation – se [Redigera relationer](./relationship-editing.md#deletion). Medan du skriver i en cell, en anteckning eller något annat textfält redigerar de i stället texten.  
Under fliken Inställningar listas de två tangenterna som `Delete Selection` – se [Kortkommandon](./settings.md#shortcuts).

## Ange färg för tabeller och anteckningar {#table-and-memo-color-specification}

Du kan tilldela färger för att särskilja efter kategori.  
En tabell bär sin färg längs vänsterkanten och en anteckning längs överkanten. Klicka på kanten eller remsan med vänster knapp, eller välj `Color` i tabellens eller anteckningens snabbmeny, för att öppna färgväljaren vid pekaren. Färgen tillämpas på varje markerad tabell, anteckning och tabellgrupp, inte bara på den du klickade på.  
En tabellgrupp färgläggs med `Color` i gruppens egen meny, och en tabell i en färglagd grupp bär gruppens färg över sitt tabellhuvud men behåller sin egen färg på vänsterkanten – se [Färglägga en grupp](./table-groups.md#coloring-a-group).

![Den förinställda färgen Blue väljs från en antecknings färgremsa för två markerade tabeller och anteckningen, och sedan tas färgen bort med No color](/img/demo-table-color.webp)

Färgväljaren innehåller, uppifrån och ned:

- En yta för mättnad och ljusstyrka, sedan skjutreglaget för nyans med en förhandsgranskning av färgen bredvid. Där webbläsaren erbjuder en pipett hämtar en pipettknapp före reglaget, `Pick a color from the screen`, en färg var som helst på skärmen.
- Fälten `Hex`, `R`, `G` och `B`. `Hex` tar emot 3, 4, 6 eller 8 hexadecimala siffror, med eller utan `#`, eller ett inklistrat `rgb()`, `hsl()` eller CSS-färgnamn. Ett fullständigt värde med 6 eller 8 siffror tillämpas medan du skriver, och allt annat vid `Enter` eller när du lämnar fältet. `R`, `G` och `B` tar emot heltal, tolkar allt över `255` som `255` och tillämpas vid `Enter` eller när du lämnar fältet. Text som färgväljaren inte kan tolka ignoreras.
- Sexton förinställda färgrutor i två rader om åtta: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown och Gray. När du håller pekaren över en färgruta visas dess hexkod.
- `Document colors`: upp till åtta färger som dokumentets tabeller, anteckningar och tabellgrupper redan använder, de mest använda först. Raden visas bara när det finns några.
- `No color`.

En färg är alltid ogenomskinlig: färgväljaren har ingen kontroll för genomskinlighet och tar bort all genomskinlighet som ett inskrivet eller inklistrat värde har.  
Att öppna färgväljaren ändrar ingenting, och att välja den färg som markeringen redan har lägger inte till något steg i ångrahistoriken.

`No color` tar bort färgen från varje markerad tabell, anteckning och tabellgrupp som ett steg i ångrahistoriken och stänger färgväljaren. `Remove color`, som finns direkt under `Color` i snabbmenyerna för tabeller, anteckningar och tabellgrupper när något markerat objekt har en färg, gör samma sak utan att öppna färgväljaren.

Färgväljaren tar tangentbordsfokus när den öppnas, och `Tab` och `Shift + Tab` går runt bland dess kontroller. Piltangenterna flyttar positionen i ytan och på nyansreglaget med 1, eller med 10 med `Shift`, och flyttar från färgruta till färgruta och tillämpar varje färg på vägen.  
Medan färgväljaren har tangentbordsfokus når ångra och göra om, zoomkortkommandona, `Search` och `Toggle Explorer` fortfarande editorn, men editorns övriga kortkommandon gör det inte: kortkommandona för [borttagning](#table-and-memo-deletion) tar inte bort något, och `Delete` och `Backspace` redigerar bara texten i fälten `Hex`, `R`, `G` och `B`.  
`Escape` stänger färgväljaren, och det gör även ett tryck på arbetsytan utanför den.  
Ett tryck i [utforskaren](./explorer.md) är inget tryck på arbetsytan, så färgväljaren förblir öppen. En rad som väljs där ändrar markeringen, och nästa färgval färgar den nya markeringen.

## Visningsalternativ för tabeller {#table-view-options}

Följande visningsalternativ finns:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Domain`, `Unique`, `Alternate Key` och `Auto Increment` är av som standard, och resten är på.  
Vilka namn tabellerna visar är inget visningsalternativ: `Name View`, direkt efter `View Option` i arbetsytans snabbmeny, väljer fysiska namn, logiska namn eller båda – se [Byta visning](./logical-names.md#switching-the-view).  
`Domain` ger varje kolumn en cell, placerad enligt [kolumnordningen](./settings.md#adjusting-column-order), med namnet på den domän som kolumnen är kopplad till. En kolumn som inte är kopplad till någon domän som bladet `Domains` listar visar där platshållaren `domain`, nedtonad. Cellen visas i varje namnvisning. Medan `Domain` är av visar `Logical Names` i stället en kopplad domäns namn i typcellen – se [Domäncellen](./logical-names.md#the-domain-cell).  
`Alternate Key` märker kolumnerna i varje alternativ nyckel, till exempel `AK1.1` – se [Alternativa nycklar](#alternate-keys).  
`Referential Actions` visar etiketterna `D:` och `U:` som en relations åtgärder för ON DELETE och ON UPDATE sätter vid barnänden av dess relationslinje – se [Läsa en relationslinje](./relationship-editing.md#reading-a-connector). Om du slår av alternativet döljs bara de etiketterna, och ingen tabell eller relationslinje flyttas.  
`Table Groups` visar [tabellgrupperna](./table-groups.md) och gruppfärgerna på deras tabellers tabellhuvuden. Om du slår av alternativet döljs de på arbetsytan, i minikartan och i bildexporter, ingen tabell flyttas och varje tabell stannar i sin grupp – se [Dölja grupper](./table-groups.md#hiding-groups). Det tar också bort mappen `Table Groups` från [utforskaren](./explorer.md#the-tree) och `New Table Group` från [arbetsytans verktygsfält](#canvas-toolbar), och utforskarens sökning slutar hitta gruppnamn.  
`Memos` visar anteckningarna. Om du slår av alternativet döljs varje anteckning på arbetsytan, i minikartan och i bildexporter, och ingen tabell eller relationslinje flyttas. Dolda anteckningar tar ingen plats, så rullningslisterna, minikartan och kompassen `Go to content` bortser från dem.  
Om du döljer anteckningarna avmarkeras de, och ett öppet redigeringsfält för en anteckning stängs. [Utforskaren](./explorer.md#the-tree) tar bort sin mapp `Memos`, och varken dess sökning med [Sök och ersätt](./find-and-replace.md) eller snabbsökningens `:` söker i dem. Medan de är dolda försvinner `New Memo` från snabbmenyn, [arbetsytans verktygsfält](#canvas-toolbar), snabbsökningen och [välkomstskärmen](./editing-start.md#welcome-screen), och `Alt + M` lägger inte till någon anteckning. En inklistring eller [Importera och lägg till](./file-import-export.md#import-and-add) lägger ändå till de anteckningar den innehåller, dolda och omarkerade.  
I en skrivskyddad editor fungerar växlarna fortfarande, men bara på den skärmen: de sparas inte, registreras inte i ångrahistoriken och delas inte, och de går tillbaka till filens värden när editorn blir skrivbar igen – se [Skrivskyddade editorer](./settings.md#read-only-editors) i Inställningar.

![Alternativ i View Option slås på och av medan tabellerna ordnas om, ett sammansatt unikt index märks AK1.1 och AK1.2 med Alternate Key, och sedan slås Memos av och på](/img/demo-view-options.webp)

Korten i läget `Flow` på fliken Visualisering följer inte de här alternativen, inte heller `Domain`: de använder sin egen [radvisning](./visualization.md#row-display) och ritar sina relationslinjer även när `Relationship` är av. Vilka celler ett kort lägger upp beror enbart på namnvisningen – se [Namn på korten](./visualization.md#names-on-the-cards).

## Tabellegenskaper {#table-properties}

Öppnar en tabells egenskapspanel.  
Börja med `Table Properties` i tabellens snabbmeny, som öppnar panelen för tabellen du högerklickade på, eller markera en tabell och tryck på `Alt + Space`.  
Panelen öppnas mitt på en nedtonad arbetsyta. Bara arbetsytan tonas ned, så en öppen [utforskare](./explorer.md#dialogs-beside-it) förblir öppen och användbar bredvid den. Panelens rubrikrad innehåller titeln `Table Properties`, de fem senast öppnade tabellerna som brickor med den aktuella framhävd och en stängningsknapp. Varje bricka namnger sin tabell så som [namnvisningen](./logical-names.md#beyond-the-canvas) gör. Klicka på en bricka för att gå till den tabellen utan att öppna panelen igen.  
Under rubrikraden finns tre flikar: `Indexes`, `Schema SQL` och `Code Generator`. Panelen har samma storlek för alla tre, så när du byter flik varken flyttas den eller ändrar storlek.  
Stäng den med stängningsknappen, med `Escape` eller genom att klicka utanför den på arbetsytan.  
Om du väljer en rad som inte är en mapp i utforskaren, eller går till en träff i dess sökning, stängs panelen Tabellegenskaper före hoppet. Detsamma gäller `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac), som öppnar utforskarens sökning eller placerar textmarkören i dess sökfält när utforskaren redan är öppen. Alla andra klick i utforskaren, även på en mapprad, eller på knappen `Explorer` i verktygsfältet lämnar panelen Tabellegenskaper öppen. Ett tryck på `Escape` medan tangentbordsfokus är i utforskaren återför bara tangentbordsfokus till arbetsytan, så det krävs ett andra tryck på `Escape` för att stänga panelen Tabellegenskaper.

Fliken `Indexes` beskrivs i [Index](#indexes).  
Fliken `Schema SQL` visar tabellens DDL-kod för den valda [databasen](#databases): dess `CREATE TABLE`, de separata begränsningar som vissa databaser skriver för dess kolumner med flaggan Unik och dess index. Den skriver alltid vanliga satser av typen `CREATE`, utan inledning, utan skript före eller efter och utan logiska namn i tomma kommentarer, oavsett hur fliken [Schema SQL](./schema-sql.md) i verktygsfältet är inställd – se [Logiska namn som kommentarer](./schema-sql.md#logical-names-as-comments). Den har ingen alternativpanel, och dess snabbmeny erbjuder bara `Database` och `Bracket`.  
Fliken `Code Generator` genererar kod för enbart den här tabellen – se [Kodgenerator](./code-generator.md).

I en skrivskyddad editor öppnas panelen ändå, från `Table Properties`, den enda raden i en tabells snabbmeny där, eller med `Alt + Space` på den tabell som ett hopp markerade. Den visar etiketten `Read only` bredvid titeln, och dess flik `Indexes` erbjuder inga redigeringsmöjligheter.  
En panel som är öppen när editorn blir skrivskyddad förblir öppen och blir skrivskyddad med den – se [Skrivskyddade editorer](#read-only-editors).

## Fokusera på tabeller {#focusing-on-tables}

Öppnar fliken Visualisering i läget `Flow`, begränsad till de valda tabellerna och varje tabell som ligger en relation bort från dem.  
Börja i tabellens snabbmeny med `Focus on this table`, eller markera en eller flera tabeller och tryck på `Alt + F`.  
När tabellen du högerklickar på är en av flera markerade tabeller visar menyalternativet `Focus on selected tables` och fokuserar på hela markeringen. Ett högerklick på en tabell utanför markeringen fokuserar enbart på den tabellen.  
Kortkommandot tar de markerade tabellerna, utelämnar anteckningar och gör ingenting när ingen tabell är markerad. En skrivskyddad editors tabellmeny har inget `Focus on this table`, och kortkommandot tar den tabell som ett hopp markerade där – se [Skrivskyddade editorer](#read-only-editors).  
En markerad [tabellgrupp](./table-groups.md) räknas inte alls här, varken i kortkommandot eller i menyalternativet: gruppens tabeller tas med bara när de själva är markerade, vilket `Select tables` i gruppens meny åstadkommer.  
Vad den begränsade vyn visar, och hur du kommer tillbaka till hela diagrammet, beskrivs i [Visualisering](./visualization.md#focusing-on-tables), och hur du går bakåt och framåt genom det som flödet har visat tidigare i [Föregående och nästa tabell](./visualization.md#previous-table-and-next-table).

## Index {#indexes}

Index definieras på fliken `Indexes` i tabellens egenskapspanel och ingår i den exporterade Schema SQL-koden.

Den vänstra sidan listar tabellens nycklar och index i två grupper.  
`Keys`, som visas när tabellen har några, listar de nycklar som dess kolumner deklarerar: `PK_<table name>` över kolumnerna märkta PK, sedan `UQ_<table name>_<column name>` för varje kolumn med flaggan Unik, i kolumnordning. Namnen är de fysiska namn som Schema SQL för den valda databasen skriver, oavsett namnvisning, så med `Bracket` satt till `None` visas `PK_users` för en schemakvalificerad tabell som `sales.users` under alla databaser utom Databricks och Snowflake – se [Schemakvalificerade tabellnamn](./schema-sql.md#schema-qualified-table-names). Varje nyckel har etiketten `PK` eller `UQ` och är märkt med ett lås. De är skrivskyddade här och ändras bara med kolumnernas flaggor [PK](./table-editing.md#column-primary-key) och [Unik](./table-editing.md#not-null-unique-auto-increment).  
`Indexes` listar tabellens index i den ordning de lades till. Varje index har en växlingsknapp `UQ` som gör det unikt, ett namnfält och ett `x` som tar bort det. Ett index som är en [alternativ nyckel](#alternate-keys) visar också sitt nummer, till exempel `AK1`. Lägg till ett index med `Add Index` längst ned i listan.

Den högra sidan listar tabellens kolumner under `Columns`, var och en med en kryssruta. Varje rad visar samma celler som kolumnens rad på arbetsytan och följer kolumnordningen, visningsalternativen och [namnvisningen](./logical-names.md#beyond-the-canvas). Ingenting går att redigera förrän ett index är markerat till vänster.  
Kryssa i en kolumn för att lägga till den i det markerade indexet, och kryssa ur den för att ta bort den. Om du markerar en nyckel visas dess kolumner ikryssade, men rutorna förblir inaktiverade.  
Kolumnerna i det markerade indexet listas nedanför under `Index order`, var och en med det namn som namnvisningen ger den, med namnet inom parentes efter det logiska namnet i `Both Names`, till exempel `Member Number (member_no)`. Dra dem i draghandtaget för att ändra ordning på dem, och klicka på brickan `ASC` eller `DESC` på en rad för att vända dess sorteringsordning. I en alternativ nyckel slutar varje rad med sitt märke `AK<n>.<m>`. Listan visar tre rader åt gången, och resten nås genom att rulla.

I en skrivskyddad editor visas fortfarande kolumnerna när du markerar en nyckel eller ett index, men det finns inget `Add Index` och inget `x`, och ingenting annat på fliken kan ändras: namnen tar emot ingen inmatning, varje kryssruta är inaktiverad och raderna under `Index order` varken dras eller byter sorteringsordning.

[Utforskaren](./explorer.md#the-tree) listar varje tabells index i tabellens mapp `Indexes`, och om du väljer ett där går du till dess tabell. Dess sökning hittar också indexnamn och kan byta namn på dem – se [Vad som söks](./find-and-replace.md#what-it-searches).

![Tabellegenskaper öppnas för orders, där fliken Indexes listar nycklarna PK och UQ ovanför indexen, och sedan läggs ett index över member_id och ordered_at DESC till och läses tillbaka på fliken Schema SQL](/img/demo-table-properties.webp)

## Alternativa nycklar {#alternate-keys}

En alternativ nyckel är ett unikt index över två eller fler kolumner: ett index på fliken `Indexes` med växlingsknappen `UQ` påslagen och minst två av tabellens kolumner ikryssade.  
Ett unikt index över en enda kolumn säger inget mer än den kolumnens flagga Unik, så det är ingen alternativ nyckel, och det är inte heller ett vanligt index, primärnyckeln eller en kolumn med flaggan Unik.

När `Alternate Key` är på i [visningsalternativen](#table-view-options) märker diagrammet kolumnerna i varje alternativ nyckel så som erwin och IDEF1X skriver dem: `AK1.1`, `AK1.2` och så vidare. Alternativet är av som standard.

Nycklarna numreras efter var deras kolumner står i tabellen, inte efter den ordning som indexen lades till i. Den nyckel vars första kolumn i dess `Index order` står högst upp i tabellen är `AK1`. Vid lika läge avgör nästa kolumn i varje nyckel, och en nyckel som utgör den inledande delen av en längre nyckel kommer före den.  
Om du flyttar en kolumn inom tabellen, eller ändrar ordningen i en nyckels `Index order`, kan nycklarna numreras om. Om du ångrar borttagningen av en nyckel får den tillbaka sitt nummer, och alla medarbetare ser samma nummer.

Varje kolumn i en nyckel märks `AK<n>.<m>`, där `n` är nyckelns nummer och `m` kolumnens plats i nyckelns `Index order`. En kolumn som ingår i flera nycklar bär alla märken, sammanfogade med kommatecken.  
I en tabell med kolumnerna `a`, `b` och `c` blir till exempel unika index över (`c`, `a`) och (`b`, `a`) `AK1` = (`b`, `a`) och `AK2` = (`c`, `a`), eftersom `b` står ovanför `c`. Därför visar `b` märket `AK1.1`, `c` märket `AK2.1` och `a` märket `AK1.2,AK2.2`.

Märket ritas sist på raden, efter den cell som [kolumnordningen](./settings.md#adjusting-column-order) placerar sist. Det är ingen cell, så det fokuseras, redigeras eller kopieras aldrig – se [Redigera tabeller](./table-editing.md).  
En primärnyckel- eller sekundärnyckelkolumn kan också bära ett AK-märke, eftersom märket inte ersätter något: nyckelikonen i början av raden visar fortfarande PK och FK, och cellen Unik behåller sitt eget `UQ`.  
En tabell som har en alternativ nyckel reserverar utrymme efter den sista cellen på varje rad för sitt längsta märke; en tabell utan alternativ nyckel behåller sin bredd.  
Märkena visas på ERD-arbetsytan, där en tabell som är hopfälld till sitt namn vid `70%` och lägre inte visar några, och i en [bildexport](./file-import-export.md#image), som ritar varje tabell i sin helhet oavsett zoom. [Förhandsgranskningen vid hovring](./visualization.md#hover-preview) på fliken Visualisering visar dem också i läget `Graph`; korten i `Flow` visar dem aldrig.

Fliken `Indexes` visar numren oavsett om alternativet är på eller inte – se [Index](#indexes).

## Automatisk layout {#auto-layout}

Ordnar alla tabeller på arbetsytan åt dig.  
Öppna `Auto Layout` från arbetsytans snabbmeny eller från snabbsökningen och välj en av fyra layouter:

| Layout | Vad den ritar |
| --- | --- |
| `Force` | En simulering: relationer drar ihop tabeller, grannar stöter bort varandra och överlappande tabeller skiljs åt. |
| `Flow` | Från vänster till höger längs relationerna, där varje relationslinje får en egen fästpunkt på en tabell. Den försöker hålla korsningarna få men kan lämna kvar några som en annan layout skulle undvika. |
| `Tree - vertical` | I lager nedåt: en föräldratabell placeras ovanför de tabeller som har en sekundärnyckel till den. |
| `Tree - horizontal` | Samma lagerindelning, från vänster till höger. |

`Force` öppnar en förhandsgranskning medan layouten stabiliseras, med `Apply` och `Cancel` i meddelandet som visas.  
Förhandsgranskningen är inramad kring diagrammet så som det såg ut när layouten startade, så tabeller kan röra sig ut ur ramen medan layouten stabiliseras. Den ritas vid `70%` eller mindre, så dess tabeller visas hopfällda till sitt namn och sin färgkant. Den öppnas i den namnvisning du tittar på, oavsett vilken visning filen behåller – se [Utanför arbetsytan](./logical-names.md#beyond-the-canvas).  
`Apply` behåller positionerna som de är i det ögonblicket, och layouten tillämpas av sig själv när den har kommit till vila. `Cancel` eller `Escape` lämnar diagrammet som det var.

De andra tre beräknas i ett svep, utanför huvudtråden, så det finns inget att titta på: ett meddelande visas medan layouten beräknas, och den färdiga placeringen centreras på det område som diagrammet redan täcker. `Cancel` eller `Escape` avbryter en layout som du inte längre väntar på, och i ett värdprogram som inte kör någon shared worker slutar layouten med `Could not place tables` – se [Web Workers](../../api/installation.md#web-workers). En layout som inte har kommit tillbaka inom 60 sekunder slutar på samma sätt.

Vilken du än väljer flyttas tabeller och tabellgrupper, medan anteckningar stannar där de är. Tabellerna placeras med de bredder som de har i den namnvisning du tittar på. En relation från en tabell till sig själv ignoreras, och flera relationer mellan samma två tabeller räknas som en.  
Varje layout håller ihop varje grupps tabeller, oavsett om grupperna visas eller inte, och anpassar varje grupp som innehåller tabeller så att den omsluter dem – se [Tabellgrupper](./table-groups.md#auto-layout).  
Resultatet blir ett enda steg i historiken, så en enda ångring flyttar tillbaka varje tabell och grupp dit den var.  
En skrivskyddad editor erbjuder ingen `Auto Layout`. En som fortfarande pågår när editorn blir skrivskyddad avslutas där: förhandsgranskningen `Force` stängs med sitt meddelande och behåller inga av sina positioner, och en layout som fortfarande beräknas kastas tillsammans med sitt meddelande, så ingen tabell flyttas, varken då eller när editorn blir skrivbar igen.

![En hög med tabeller städas upp med den automatiska layouten Flow från arbetsytans snabbmeny, som ställer upp dem från vänster till höger längs deras relationer](/img/demo-automatic-table-placement.webp)

## Databaser {#databases}

Databaser som stöds är bland annat:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Välj en via `Database` i arbetsytans snabbmeny, i snabbsökningen eller i alternativpanelen eller snabbmenyn på flikarna Schema SQL och Kodgenerator. Alla ändrar samma inställning. En skrivskyddad editors snabbmeny för arbetsytan har ingen `Database`, och ett val i de andra ändrar bara den skärmen – se [Skrivskyddade editorer](#read-only-editors).

De här alternativen avgör syntaxen för Schema SQL vid export, autokompletteringen av datatyp och de typer som genererad kod och importerade scheman löses upp till.  
De avgör vilka val under `Statements` och `Header` som fliken [Schema SQL](./schema-sql.md#options-panel) kan skriva. Ett val som databasen saknar finns kvar i alternativpanelen, nedtonat, och SQL-koden faller tillbaka på det närmaste val som databasen har.  
De avgör också vilka åtgärder för ON DELETE och ON UPDATE som Schema SQL och kodgeneratorns ORM-mål skriver, och vilka som relationsmenyerna märker med `not in <database>` – se [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update) och [Kodgenerator](./code-generator.md#database).  
Import av Schema SQL behåller en kolumns datatyp, inklusive argumentlistan, oavsett om editorn listar den eller inte, till exempel `TIMESTAMP WITH TIME ZONE`, `public.mood` eller `integer[]` – se [Datatyper](./file-import-export.md#data-types). Autokompletteringen av datatyp föreslår bara de typer som den valda databasen listar.

![Databasen byts till PostgreSQL, och sedan väljs en PostgreSQL-typ i autokompletteringen](/img/demo-database.webp)

![Ungefärlig autokomplettering av datatyp, som styrs med piltangenterna och accepteras med Right, Tab eller Enter](/img/demo-data-type-autocomplete.webp)

## Arbetsytans verktygsfält {#canvas-toolbar}

Ett litet verktygsfält svävar över mitten av arbetsytans nederkant och innehåller, från vänster till höger, verktygen som verkar på själva arbetsytan och kommandona som lägger till saker på den:

- Handen och pekaren. Pekaren är standard; handen gör varje dragning till en panorering, över tabeller såväl som över tom yta. `Space` växlar mellan dem. Medan ritläget för [`New Table Group`](./table-groups.md#drawing-a-group) är aktivt är knappen `New Table Group` framhävd i stället för någon av dem, och om du klickar på någon av dem, trycker på `Space` eller väljer en relationsnotation avslutas ritläget utan att någon grupp läggs till.
- `New Table`, `New Memo` och `New Table Group`. `New Table` lägger till en tabell som `Alt + N` gör, och `New Memo` lägger till en anteckning som `Alt + M` gör. `New Table Group` aktiverar [ritläget för grupper](./table-groups.md#drawing-a-group) som `Alt + G` gör och slår av handen; ett andra klick avslutar, liksom ett andra `Alt + G`, ritläget utan att lägga till någon grupp. `New Memo` visas inte medan View Option → `Memos` döljer anteckningarna, och `New Table Group` inte medan View Option → `Table Groups` döljer grupperna.
- Zoomen: `Zoom out`, den aktuella zoomen i procent och `Zoom in`. De två knapparna ändrar zoomen i steg på samma sätt som zoomkortkommandona, och ett klick på procenttalet återställer den till `100%`.
- De fyra relationsnotationerna, samma fyra som du startar en relation med – se [Börja redigera](./editing-start.md). Om du väljer en växlar du tillbaka till pekaren, eftersom en relation ritas genom att du klickar på två tabeller.
- `Name View`, en knapp med en nedåtpil som visar den aktuella visningen: `Physical Names`, `Logical Names` eller `Both Names`. Den har samma bredd oavsett vilken visning den visar, så ett byte flyttar aldrig verktygsfältet. Ett klick öppnar en lista med de tre ovanför verktygsfältet, med en bock vid den aktuella. Om du väljer en byts visningen till den och listan stängs; ett andra klick på knappen, ett tryck någon annanstans eller `Escape` stänger listan utan att byta. Vad varje visning ritar beskrivs i [Namnvisning](./logical-names.md#name-view), och om ett byte sparas beskrivs i [Byta visning](./logical-names.md#switching-the-view).
- Zenläget, `Alt + Z`, som rensar bort allt utom arbetsytan och det här verktygsfältet. `Alt + Z` igen, eller knappen, tar tillbaka resten. En öppen utforskare döljs med resten, utan att stängas, och kommer tillbaka med den. Den kan fortfarande öppnas i zenläget – se [När den viker undan](./explorer.md#when-it-stands-aside).
- Kompassen `Go to content`, som läggs till i slutet av verktygsfältet bara när ingen tabell, synlig anteckning eller synlig tabellgrupp finns på skärmen – se [Navigera på arbetsytan](#getting-around-the-canvas).

Varje knapp med ett kortkommando anger det i sin knappbeskrivning, till exempel `New Table (Alt + N)` (Windows/Linux) eller `New Table (⌥ + N)` (Mac).  
Verktygsfältet viker undan medan förhandsgranskningen av den automatiska layouten `Force`, panelen Tabellegenskaper, tidsresan eller diff-visaren är öppen, och kommer tillbaka när den stängs.  
En skrivskyddad editors verktygsfält behåller zoomen, `Name View`, zenläget och kompassen `Go to content`. Det har varken hand eller pekare, inget `New Table`, `New Memo` eller `New Table Group` och inga notationer, och får tillbaka dem när editorn blir skrivbar igen.

![En tabell och en anteckning läggs till från verktygsfältet, New Table Group aktiveras och avaktiveras, arbetsytan panoreras med handen, zoomen ändras i steg och zenläget slås på och av med ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Zooma in/ut {#zoom-inout}

Du zoomar med `Ctrl + Wheel` (Windows/Linux) eller `⌘ + Wheel` (Mac). Mushjulet ensamt panorerar arbetsytan.  
En nypgest på styrplattan zoomar också, kring punkten där du nyper, och det gör även två fingrar på en pekskärm, som dessutom panorerar när de rör sig.  
Kortkommandon: `Ctrl + Plus` (Windows/Linux) eller `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) eller `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) eller `⌘ + 0` (Mac) går direkt tillbaka till `100%` och behåller skärmens mitt där den är.

Knapparna `Zoom out` och `Zoom in` i [arbetsytans verktygsfält](#canvas-toolbar) ändrar zoomen i steg som kortkommandona `Minus` och `Plus`: varje tryck ändrar den med 4 procentenheter och behåller skärmens mitt där den är. Procenttalet mellan dem visar den aktuella zoomen, och ett klick på det går direkt tillbaka till `100%`, som `Ctrl + 0` (Windows/Linux) eller `⌘ + 0` (Mac).

Zoomen går från `10%` till `150%`.  
Vid `70%` och lägre fälls tabellerna ihop till sitt namn och sin färgkant, och cellredigering, cellkortkommandona samt kopiering och inklistring slutar fungera tills du zoomar in igen. Namnet som en hopfälld tabell visar följer namnvisningen – se [Namnvisning](./logical-names.md#name-view).

Samma tre kortkommandon zoomar också fliken Visualisering, i både läget `Graph` och läget `Flow`, varje läge inom sitt eget intervall – se [Visualisering](./visualization.md#toolbar).

![Arbetsytan zoomas ut med ⌘ + Wheel tills tabellerna fälls ihop till sitt namn, och sedan ändras zoomen tillbaka stegvis med ⌘ + Plus, ⌘ + Minus och ⌘ + 0](/img/demo-zoom.webp)

## Navigera på arbetsytan {#getting-around-the-canvas}

Arbetsytan har inga kanter och ingen storlek att ställa in. Tabeller och anteckningar ligger där du placerar dem, och allt nedan beskriver diagrammet snarare än en fast sida.

Dra på ett tomt område av arbetsytan för att panorera, eller växla till handverktyget med `Space` och dra var som helst, även över en tabell. Mushjulet panorerar också, och `Shift + Wheel` panorerar i sidled.  
Ytan i en [tabellgrupp](./table-groups.md#selecting-groups), området under namnlisten, räknas som tom arbetsyta för vänster knapp: en dragning där panorerar, `Ctrl + drag` (Windows/Linux) eller `⌘ + drag` (Mac) ritar en markeringsram och ett klick avmarkerar allt.  
Panoreringen har inga gränser: mushjulet, en dragning och handverktyget tar vyn så långt du flyttar den, förbi tabellerna åt alla håll.

Dra med mittenknappen (tryck ned mushjulet) för att panorera var som helst på arbetsytan, med både pekaren och handen. Det fungerar även när trycket hamnar på en tabell, en anteckning, en cell, en ikon eller en relation.  
En dragning med mittenknappen markerar, flyttar och klickar ingenting, och behåller markeringen. Den stänger en öppen snabbmeny och färgväljaren, och webbläsarens egen rullning och inklistring med mittenklick startar inte.  
Ett tryck med mittenknappen på rullningslisterna, minikartan, arbetsytans verktygsfält eller ett öppet redigeringsfält för en cell eller anteckning panorerar inte.

Minikartan i det övre högra hörnet avbildar diagrammet med en skärms utrymme på varje sida om det, rullningslisternas räckvidd, avrundat utåt till ett grovt rutnät, så ju mer du zoomar ut, desto mindre blir diagrammet i den. Klicka på den för att flytta vyn till den punkten, eller dra rektangeln för visningsområdet för att panorera. När du zoomar ut växer rektangeln för visningsområdet och täcker mer av kartan.  
Den ritar varje tabell i tabellens färg, och varje synlig tabellgrupp som en ruta i gruppens färg bakom dess tabeller.  
Rullningslisterna längs höger- och nederkanten beskriver samma rörelseomfång, som sträcker sig från läget där diagrammet ligger precis utanför ena sidan av skärmen till läget precis utanför den andra, så det är minst en skärm längre än det ritade diagrammet, och ännu längre medan vyn står bortom det. Utanför zenläget visas båda rullningslisterna så snart dokumentet innehåller en tabell, en synlig anteckning eller en synlig tabellgrupp, även när allt får plats på skärmen. Ett dokument utan något av detta, till exempel ett vars enda anteckningar är dolda med View Option → `Memos`, visar ingen av dem och ingen minikarta.  
Att dra i en rullningslists rullningsruta eller i minikartans rektangel för visningsområdet är den enda panorering som stannar: den går inte längre än till tabellerna precis utanför skärmen, eller till där dragningen började om det var längre ut.

Om en panorering inte lämnar någon tabell, synlig anteckning eller synlig tabellgrupp på skärmen läggs kompassen `Go to content` till i slutet av [arbetsytans verktygsfält](#canvas-toolbar), med en pil mot det närmaste objektet och hur långt bort det är. Klicka på den för att centrera det objektet utan att ändra zoomen.

![Panorering genom att dra på tom arbetsyta, med mushjulet, genom att dra med mittenknappen över en tabell och från minikartan, och sedan Shift + wheel förbi innehållet och tillbaka genom att följa kompassen Go to content](/img/demo-canvas-navigation.webp)

### Var ett hopp hamnar {#where-a-jump-lands}

Varje hopp som tar dig till något på arbetsytan flyttar vyn enligt en och samma regel: resultaten för `#`, `@` och `:` i [snabbsökningen](./quick-search.md#searching-the-diagram), raderna i [utforskaren](./explorer.md#going-to-a-row) och träffarna i dess sökning med [Sök och ersätt](./find-and-replace.md#going-to-a-match), raderna i listan i [diff-visaren](#going-to-a-change), [kortknappen](./visualization.md#card-buttons) för extern länk i flödesläget, en kontroll som anger en tabell eller en kolumn på [bladet Kontroller](./dictionary.md#the-checks-sheet) på fliken Ordlista och landningen efter [Importera och lägg till](./file-import-export.md#import-and-add). Vart och ett av de avsnitten säger vad hoppet markerar; det här avsnittet säger vart vyn går.

Ett hopp ändrar aldrig zoomen och gör högst en rullning. Från en annan flik växlar det först till ERD-fliken.  
Det mäter arbetsytan så som den visas: under det övre verktygsfältet, eller hela höjden i zenläget, och till höger om en öppen utforskare, som gör arbetsytan smalare i stället för att täcka den.

Sidled och höjdled bedöms var för sig, och en riktning där målet redan syns väl lämnas exakt som den är:

- Ett mål som inte är längre än halva arbetsytan i den riktningen ligger kvar så länge dess mitt ligger i arbetsytans mittersta halva, mellan en fjärdedel och tre fjärdedelar av vägen i sidled eller i höjdled. Annars flyttas dess mitt till arbetsytans mitt.
- Ett längre mål som ändå får plats med `40px` till godo i varje ände ligger kvar så länge det syns helt. Annars centreras det i sidled; i höjdled flyttas dess överkant till `40px` under arbetsytans överkant.
- Ett mål som är längre än så ligger kvar så länge det syns helt, eller, när det är längre än arbetsytan, så länge dess huvuddel, som listas nedan, syns. Annars centreras det om det får plats, och placeras annars så nära mitten som går med båda ändarna av huvuddelen minst `40px` innanför arbetsytan; en huvuddel som är för lång för det får sin början placerad `40px` in.

En liten tabell nära arbetsytans vänsterkant, halvvägs ned, flyttas alltså bara i sidled.

Vad ett hopp visar, och den huvuddel som måste synas när helheten inte får plats:

- En tabell: hela tabellen, med namnraden överst som huvuddel, eller med kommentarscellen vid en träff i tabellkommentaren medan View Option → `Table Comment` visar kommentarerna. Vid `70%` och lägre, där tabellerna fälls ihop till sitt namn, med namnet mitt i rutan.
- En kolumn: dess rad, med cellen som hoppet går till som huvuddel: namnet, det logiska namnet vid en träff i ett logiskt namn eller en kontroll av det logiska namnet, domäncellen vid en kontroll av domänen, eller kommentaren som en träff finns i medan View Option → `Column Comment` visar kommentarerna. Där raden inte ritar någon sådan cell går hoppet till den cell som ritas i dess ställe: det logiska namnet för namnet i `Logical Names`, namnet för det logiska namnet i `Physical Names` och typcellen för domäncellen medan View Option → `Domain` är av, eller raden som helhet medan även `DataType` är av. Vid `70%` och lägre visar en kolumn sin tabell enligt tabellens regel.
- En cell som är för bred för att visas helt, till exempel en lång kommentar: med den matchade texten i den som huvuddel. Ett hopp till den cell som ritas i stället för den som träffen finns i, till exempel namnet för en träff i ett logiskt namn i `Physical Names`, har inte den matchade texten som huvuddel.
- En relation: rutan som omfattar dess två tabeller, med barntabellen som huvuddel.
- En tabellgrupp: dess ruta, med namnlisten som huvuddel.
- En anteckning, eller blocket som Importera och lägg till placerar: hela objektet.

När ingen av riktningarna skulle flyttas sker ingen rullning, så om du går till samma ställe två gånger i rad flyttas ingenting den andra gången. Ett hopp som rullar arbetsytan registrerar rullningen i [ångrahistoriken](./undo-redo.md#what-the-history-records) som alla andra ändringar av vypositionen, och ett hopp som inte flyttar något lämnar inget att ångra. Vid Importera och lägg till ingår rullningen i samma steg som tillägget. En rad i diff-visarens lista flyttar bara vyns skrivskyddade sidor, så den registrerar ingenting, och en skrivskyddad editor registrerar inget hopp alls.  
Inget hopp startar eller slutför ritningen av en relation. Kompassen `Go to content` är inget hopp: den centrerar det den pekar på.

## Diff-visaren {#diff-viewer}

Du kan jämföra tidigare sparade dokument med det aktuella dokumentet.  
Välj `Diff Viewer` i arbetsytans snabbmeny och välj ett `.json`-dokument som du har exporterat tidigare.

Vyn öppnas över arbetsytan: det som har ändrats till vänster, sedan det sparade dokumentet och det aktuella sida vid sida.  
Det aktuella dokumentet jämförs som det ser ut när vyn öppnas; ändringar som görs efter det, även en medarbetares, når inte vyn. Båda sidorna öppnas, och förblir, i den namnvisning du tittar på, oavsett vilken visning någon av filerna behåller – se [Utanför arbetsytan](./logical-names.md#beyond-the-canvas). En öppen [utforskare](./explorer.md#when-it-stands-aside) döljs medan vyn är öppen, så att vyn tar editorns hela bredd.  
Varje sida panoreras med mushjulet, genom att dra på ett tomt område eller en tabellgrupps yta, eller genom att dra med mittenknappen var som helst över den, och zoomas med `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) eller en nypgest. Vid `70%` och lägre fälls dess tabeller ihop som på arbetsytan – se [Märkningar på båda sidorna](#marks-on-the-two-sides).  
Båda sidorna är skrivskyddade, så ingenting i ditt dokument ändras. Varje sida har sin egen markering, och ett klick på en tabell där markerar den enbart på den sidan.  
Stäng vyn med knappen `Close` i meddelandet `Diff Viewer` som den öppnas med, eller med `Escape`.  
En skrivskyddad editor erbjuder också `Diff Viewer`, och vyn fungerar där som i vilken editor som helst, och ett klick på en sidas tabell markerar den fortfarande på den sidan. En vy som är öppen när editorn blir skrivskyddad förblir öppen.

![Diff-visaren öppnas för en sparad .json-fil, rader märkta A, M, D och R klickas i dess träd, raderna filtreras efter namn och vyn stängs](/img/demo-diff-viewer.webp)

### Vad som jämförs {#what-is-compared}

Tabeller, kolumner, index, sekundärnycklar, anteckningar och tabellgrupper jämförs alla.  
Varje objekt paras först ihop efter sitt id, så mot en tidigare version av samma fil, som behåller id:n, är en tabell, en kolumn, ett index eller en tabellgrupp som har bytt namn fortfarande ett objekt, listat som omdöpt.  
Det som återstår paras ihop ett mot ett efter det som det behåller: en tabell eller en tabellgrupp efter sitt namn, med hänsyn till skiftläge; en kolumn eller ett index efter sin tabell och sitt namn; en sekundärnyckel efter sina två tabeller och sina kolumnpar; och en anteckning efter sin text och sedan sin position. Ett index utan namn paras ihop efter sina kolumner, deras ordning och riktning och om det är unikt, och en tabellgrupp utan namn efter den grupp som den delar flest tabeller med.  
Mot en fil från annat håll, till exempel ett diagram som byggts om med SQL-import, visas en omdöpt tabell därför som en borttagen och en tillagd.

Vad som räknas som en ändring:

- En tabell: dess namn, kommentar, tabellgrupp, position och färg.
- En kolumn: dess namn, kommentar, datatyp, standardvärde, Automatisk uppräkning, primärnyckel, Unik, Inte null och dess plats i tabellen. Bara de kolumner som ligger utanför den ordning som båda dokumenten delar räknas som flyttade, så om en kolumn läggs till, tas bort eller flyttas märks inte de andra.
- Ett index: dess namn, UNIQUE och dess kolumner, med deras ordning och riktning.
- En sekundärnyckel: dess kolumnpar, relationstyp och åtgärder för ON DELETE och ON UPDATE.
- En anteckning: dess text, position, storlek och färg.
- En tabellgrupp: dess namn, tabellerna den innehåller, färg, position och storlek.

En tabell, anteckning eller grupp som bara har flyttats, fått ny storlek eller fått ny färg räknas alltså som ändrad. Positioner och storlekar jämförs i hela pixlar, och staplingsordningen och var en relationslinje möter en tabell räknas aldrig.  
Logiska namn, domänkopplingar och orden, termerna och domänerna på fliken [Ordlista](./dictionary.md) jämförs inte, så en ändring av enbart dem varken listas eller märks. En datatyp som en domän har ändrat räknas däremot, som en ändring av kolumnens datatyp.

### Ändringsträdet {#the-change-tree}

Listan till vänster ritas som [utforskarens träd](./explorer.md#the-tree) och innehåller bara det som har ändrats: `Tables`, `Table Groups` och `Memos`, var och en bara när den innehåller en rad, och under en tabell dess egna `Columns`, `Indexes` och `Foreign Keys`. En sekundärnyckel listas under sin barntabell, och en tillagd eller borttagen tabell listar ingenting inuti sig.  
Varje mapp visar hur många rader den innehåller, och varje mapp och tabell är utfälld från början.  
En tabell- eller kolumnrad namnges i den namnvisning som sidorna öppnades i. I `Both Names` visar den det logiska namnet med namnet efter, dämpat, och på en borttagen rad är det dämpade namnet genomstruket tillsammans med resten. Tabeller och tabellgrupper listas efter namn, utan hänsyn till skiftläge, oavsett visning. Anteckningar, och en tabells kolumner, index och sekundärnycklar, behåller det aktuella dokumentets ordning, och ett borttaget objekt sätts tillbaka där det stod. En anteckningsrad visar anteckningens första rad, och en sekundärnyckelrad visar sina barnkolumner, sedan `→` med föräldratabellen och dess kolumner, till exempel `user_id → users(id)`. Ett tomt namn visas som `unnamed` i kursiv stil.

Varje rad slutar med en bokstav, och en rad märkt `A`, `D`, `M` eller `R` har sitt namn i bokstavens färg:

- `A`, tillagd, i grönt: bara i det aktuella dokumentet.
- `D`, borttagen, i rött och genomstruken: bara i det sparade dokumentet.
- `M`, ändrad, i bärnstensgult: i båda, ändrad.
- `R`, omdöpt, i blått: i båda, med ett nytt namn. Ett namnbyte går före alla andra ändringar, som knappbeskrivningen ändå listar.
- `~`, i bärnstensgult, avslutar varje mapp och varje tabell som listas bara för det som har ändrats inuti den; deras namn behåller den vanliga färgen.

Håll pekaren över en rads namn för att se dess knappbeskrivning: statusen, `Added`, `Deleted`, `Modified`, `Renamed` eller `Changed inside`, och sedan en rad per ändring, till exempel `Name: users → members` eller `NN: ✗ → ✓`. En text citeras med sin första rad, avkortad efter 40 tecken, och ett tomt värde visas som `—`. Knappbeskrivningen för ett tillagt eller borttaget objekt är enbart dess status.

`Filter by name`, ovanför trädet, behåller de rader vars aktuella eller sparade namn, eller aktuella eller sparade logiska namn, innehåller det du skriver, utan hänsyn till skiftläge, i varje namnvisning. En tabell vars namn matchar behåller alla sina rader, och en som inte gör det behåller bara de rader som matchar. Ett filter som inte matchar något lämnar trädet tomt.  
När de två dokumenten inte skiljer sig åt alls visar trädet `No changes`.

Dra trädets högerkant för att göra det bredare eller smalare, från `200px` till `480px`, och dubbelklicka på kanten för att återställa bredden till `260px`. Varje jämförelse öppnas med `260px`, och de två sidorna delar lika på resten av bredden.  
Tangentbordet navigerar i trädet som i utforskarens träd – se [Tangenter i utforskaren](./explorer.md#keys-in-the-explorer) – men här stänger `Escape` vyn, i trädet såväl som i `Filter by name`.

### Gå till en ändring {#going-to-a-change}

Klicka på en rad, eller tryck på `Enter` eller `Space` när tangentbordsfokus är på den, för att gå till dess objekt på varje sida som innehåller det: ett tillagt objekt bara på den aktuella sidan, ett borttaget bara på den sparade sidan och allt som båda innehåller på båda sidorna. En mapprad fäller bara ihop eller ut, och det gör även pilen i början av en tabellrad.

- En tabell-, kolumn- eller indexrad markerar enbart tabellen.
- En sekundärnyckelrad visar sina två tabeller, eller barntabellen när de två ligger för långt ifrån varandra för att visas samtidigt, markerar barntabellen med dess sekundärnyckelkolumner och lyser upp relationslinjen – se [Läsa en relationslinje](./relationship-editing.md#reading-a-connector).
- En anteckningsrad markerar anteckningen, och en tabellgruppsrad markerar gruppen. En anteckning eller grupp som en sidas dokument döljer leder ingenstans på den sidan.

Varje sida flyttas enligt regeln i [Var ett hopp hamnar](#where-a-jump-lands), mätt på den sidan, så ett nytt klick på samma rad flyttar ingenting.

### Märkningar på båda sidorna {#marks-on-the-two-sides}

De två sidorna färgar text, konturer och relationslinjer, och fyller ingenting. Tillagt är grönt och visas bara på den aktuella sidan, borttaget är rött och visas bara på den sparade sidan, och ändrat, i bärnstensgult, och omdöpt, i blått, visas på båda sidorna. Allt oförändrat ritas som vanligt.

- En tillagd eller borttagen tabell eller tabellgrupp får en kontur i den färgen, och dess namn får samma färg. En tillagd eller borttagen anteckning får en kontur.
- En tillagd eller borttagen kolumn i en tabell som finns i båda dokumenten färgar hela sin rad, och en kolumn som har flyttats gör hela sin rad bärnstensgul. Ingenting inuti en tillagd eller borttagen tabell märks för sig.
- Texten i en ändrad cell blir bärnstensgul: en tabells kommentar, en kolumns kommentar, datatyp, standardvärde, Automatisk uppräkning, Unik eller Inte null, eller en antecknings text. En ändring av primärnyckeln gör kolumnens nyckelikon bärnstensgul.
- En omdöpt tabell, kolumn eller tabellgrupp har sitt namn i blått.
- En tabell, anteckning eller tabellgrupp med en ändring som saknar egen cell, till exempel en flytt, en ny storlek eller färg, eller ett byte av grupp eller av en grupps tabeller, får en bärnstensgul kontur.
- En tillagd, borttagen eller ändrad sekundärnyckel ritar sin relationslinje i den färgen. När du håller pekaren över den, eller när en rad lyser upp den, ritas den i stället i den vanliga hovringsfärgen.
- En indexändring märker ingenting på någon av sidorna; den visas bara i trädet.

Varje sida följer sitt eget dokuments visningsalternativ. En ändring i en cell som sidan inte ritar visas i stället på namnet. En kolumnändring i en cell som ett visningsalternativ döljer, till exempel `Unique` eller `Auto Increment`, som båda är av som standard, gör kolumnens namn bärnstensgult, och det gör även en ändring av primärnyckeln på en rad som inte visar någon nyckelikon. En ändring av tabellkommentaren medan `Table Comment` är av gör tabellens namn bärnstensgult. Ett namnbytes blå färg går före den här bärnstensgula. En anteckning eller tabellgrupp som dess dokument döljer listas i trädet men ritas inte på den sidan.

I `Logical Names`, som inte ritar någon namncell, hamnar ett namnbytes blå färg och det bärnstensgula från en ändring i en cell som sidan inte ritar på det logiska namn som ritas i namnets ställe. En ändring av datatypen gör typcellen bärnstensgul i varje namnvisning, även där cellen visar en domäns namn. Ingen av sidorna ritar de färger som ordlistornas kontroller ger namn på arbetsytan – se [Märkningar på arbetsytan](./dictionary.md#marks-on-the-canvas).

Vid `70%` och lägre behåller hopfällda tabeller sin kontur. Namnet behåller det gröna eller röda för en tillagd eller borttagen tabell, eller ett namnbytes blå, och får annars det bärnstensgula från en kommentarsändring. Kolumnändringar ritas inte förrän du zoomar in igen; trädet listar dem ändå.

## Skrivskyddade editorer {#read-only-editors}

En editor med [`readonly`](../../api/erd-editor-element.md#readonly), till exempel en Git-revision som öppnats igen som diagram i VS Code, är en läsare. Dess sex flikar, [utforskaren](./explorer.md#read-only-editors), minikartan, rullningslisterna och medarbetarnas markörer och markeringar finns kvar, och varje kontroll som skulle ändra diagrammet är borta i stället för nedtonad.

På ERD-arbetsytan:

- Ett drag panorerar, var det än börjar: på tom arbetsyta, en tabell, en anteckning eller en tabellgrupp lika. Mittenknappen, mushjulet, en nypning och zoomtangenterna fungerar som i vilken editor som helst.
- När pekaren vilar på en tabell lyser dess relationer upp. Ett klick som inte flyttar sig lyser upp relationerna för tabellen det landar på, eller relationen det landar på, och ett klick någon annanstans släcker ljuset.
- Ingenting markeras av ett tryck, en markeringsram eller en tangent för att markera allt. Bara ett hopp markerar: en rad i [utforskaren](./explorer.md#going-to-a-row), en träff i dess [Sök och ersätt](./find-and-replace.md#going-to-a-match) eller ett resultat efter `#`, `@` eller `:` i [snabbsökningen](./quick-search.md#searching-the-diagram) markerar det som det landar på, med kontur som vilken markering som helst, med den fokuserade cellen där hoppet lägger den. Ett klick som inte flyttar sig tar bort den markeringen.
- Piltangenterna flyttar den fokuserade cellen. Kopiering, `Table Properties` och `Focus on this table` fungerar på det som ett hopp markerade, med sina tangenter, och en inklistring lägger inte till något. De andra tangenterna finns i [Kortkommandon](./settings.md#shortcuts).
- Inget namn på en cell, en anteckning eller en tabellgrupp öppnas för redigering. Det finns inga knappar `+` eller `x` på tabeller, anteckningar och grupper, inga kanter att ändra storlek med på anteckningar och grupper, inget handtag för att dra kolumner och ingen färgväljare.

Arbetsytans snabbmeny behåller `View Option`, `Name View`, `Export` och `Diff Viewer`. Den har inget `New Table`, `New Memo`, `New Table Group`, `Toggle Explorer`, `Relationship`, `Derive Physical Names Again`, `Database`, `Import`, `Import and Add` eller `Auto Layout`.  
En tabells meny behåller enbart `Table Properties`, som öppnar panelen skrivskyddad för den tabellen – se [Tabellegenskaper](#table-properties). En anteckning, en relation och en tabellgrupp öppnar ingen meny.  
[Arbetsytans verktygsfält](#canvas-toolbar) behåller zoomen, `Name View`, zenläget och kompassen `Go to content`. Det översta verktygsfältet visar databasens namn som text som inte går att redigera, och ingen `Undo`, `Redo` eller `Time Travel`.  
[Export](./file-import-export.md#exporting), med alla tre sina poster, och [diff-visaren](#diff-viewer) fungerar som i vilken editor som helst.

[`View Option`](#table-view-options), `Name View`, databasen, fliken, vyns position och zoomen ändras fortfarande där, men bara på den skärmen: ingenting sparar, registrerar eller delar dem – se [Skrivskyddade editorer](./settings.md#read-only-editors) i Inställningar.

Att göra en editor skrivskyddad avslutar det som stod öppet för redigering: en redigerare för en cell, en anteckning eller en tabellgrupps namn, en relation eller `New Table Group` som ritas, markeringen och den fokuserade cellen, handverktyget, färgväljaren, [Map Columns](./relationship-editing.md#map-columns) och [Time Travel](./undo-redo.md#time-travel). Vyn, zoomen, fliken och namnvisningen förblir som de var, och Tabellegenskaper, diff-visaren och dialogrutan `Export image` förblir öppna.  
En rörelse som pågår avslutas också där. Ett drag av tabeller eller anteckningar stannar där det är, ett `Alt + drag` släpper ingen kopia, ett kolumndrag avslutas, en storleksändring av en anteckning stannar där den är, en storleksändring av en tabellgrupp kastas och en [automatisk layout](#auto-layout) kastas med sitt meddelande, så ingen tabell flyttas.  
När editorn blir skrivbar igen ger den tillbaka kontrollerna ovan, och inget av det som flytten stängde öppnas igen.
