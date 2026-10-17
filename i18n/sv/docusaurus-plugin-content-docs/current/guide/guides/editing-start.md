---
sidebar_position: 1
description: Börja från välkomstskärmen och skapa tabeller, anteckningar, tabellgrupper och relationer via arbetsytans snabbmeny, arbetsytans verktygsfält eller ett kortkommando.
---

# Börja redigera

Redigeringen börjar i snabbmenyn, som du öppnar med ett högerklick.

![Arbetsytan högerklickas, undermenyn Relationship öppnas, en tabell läggs till och sedan öppnas tabellens egen meny](/img/demo-context-menu.webp)

Om du högerklickar på en tabell, en anteckning, en tabellgrupp eller en relation öppnas i stället objektets egen meny.  
Ett högerklick på en tabell, anteckning eller tabellgrupp som redan är markerad behåller hela markeringen, så menyalternativ som `Color` och `Delete selected` gäller för hela markeringen – se [Markera flera objekt](./table-related-functions.md#multiple-selection).

## Välkomstskärmen {#welcome-screen}

I webbappen, Google Drive, VS Code, Obsidian och en JetBrains-IDE öppnas ett tomt diagram med en välkomstskärm över ERD-arbetsytan. Ett `<erd-editor>` på din egen sida visar den bara när sidan slår på den med [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
Ett diagram räknas som tomt så länge det inte innehåller någon tabell, någon synlig anteckning eller någon synlig tabellgrupp, så anteckningar och grupper som döljs med View Option räknas inte. Skärmen försvinner så snart diagrammet innehåller något av dessa och kommer tillbaka när diagrammet blir tomt igen, till exempel efter att du har tagit bort den sista tabellen eller ångrat att du lade till den första.  
Den visas inte i en skrivskyddad editor, i zenläget, medan panelen Tabellegenskaper är öppen eller medan diff-visaren, förhandsgranskningen av automatisk layout eller tidsresan tar över arbetsytan.

![Välkomstskärmen i ett tomt diagram: formaten under Import visas, Esc leder tillbaka, en tabell läggs till med New Table och sedan visas skärmen igen med ⌘ + Z](/img/demo-welcome-screen.webp)

Under rubriken `Right-click the canvas for every action.` finns en meny:

- `New Table` lägger till en tabell, som `Alt + N` gör.
- `New Memo` lägger till en anteckning, som `Alt + M` gör. Alternativet utelämnas medan anteckningarna är dolda.
- `Import` byter ut menyn mot `Back` och formaten `json`, `Schema SQL`, `GraphQL`, `DBML` och `AML`. När du väljer ett format får du välja en fil i det formatet, och den läses in i stället för det tomma diagrammet – se [Importera eller exportera filer](./file-import-export.md). `Back`, eller `Escape`, leder tillbaka till den första menyn.
- `Command Palette` öppnar [snabbsökningen](./quick-search.md), som `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac) gör.
- `Shortcuts` öppnar fliken [`Shortcuts`](./settings.md#shortcuts) under fliken Inställningar.

Där arbetsytan är tillräckligt bred visar `New Table`, `New Memo` och `Command Palette` den tangentkombination som för närvarande är kopplad till deras kommando, även en som ett värdprogram har kopplat om.  
När en rad har tangentbordsfokus flyttar `↑` och `↓` mellan raderna och fortsätter från andra änden, `Home` och `End` hoppar till den första respektive sista raden och `Enter` eller `Space` trycker på den fokuserade raden. Alla andra kortkommandon fungerar fortfarande, så `Alt + N` lägger till en tabell även därifrån.  
Bara menyn tar emot klick: ett tryck någon annanstans på skärmen når arbetsytan, och ett högerklick på arbetsytan öppnar snabbmenyn som vanligt.

Där arbetsytan har plats pekar handritade pilar på:

- knappen `Search` i verktygsfältet: `Search commands and tables`
- knapparna `Theme` och `Display Language`: `Pick a theme and a language`, eller `Pick a theme` eller `Pick a language` när verktygsfältet bara visar en av dem – se [Språk och tema](./language-and-theme.md)
- [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) längst ned: `Pan, zoom and draw relationships`

Medan [utforskaren](./explorer.md) visas täcker välkomstskärmen bara arbetsytan bredvid den.  
En pil vars knapp i verktygsfältet står ovanför utforskaren utelämnas. Pilen för `Theme` och `Display Language` utelämnas bara när båda dess knappar står ovanför utforskaren; fram till dess pekar den på den knapp som fortfarande står över arbetsytan.  
En etikett som inte får plats bredvid sin pil hänger i stället under pilen.

## Skapa tabeller {#table-creation}

Skapa en tabell från snabbmenyn, med knappen `New Table` i [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) eller med kortkommandot `Alt + N`.

## Skapa anteckningar {#memo-creation}

Skapa en anteckning från snabbmenyn, med knappen `New Memo` i arbetsytans verktygsfält eller med kortkommandot `Alt + M`.  
Medan View Option → `Memos` är av döljs anteckningarna, ingenting erbjuder `New Memo` och `Alt + M` lägger inte till någon – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options).

En anteckning är en lapp med fri text på arbetsytan. Klicka i anteckningens textyta och skriv; texten sparas med dokumentet.  
`Escape` stänger anteckningens redigeringsfält, behåller det du har skrivit och lämnar anteckningen markerad, och ett andra tryck på `Escape` avmarkerar allt.  
Dra i anteckningens kant för att ändra storlek på den. `x` i dess huvud, som visas medan pekaren hålls över anteckningen, tar bort den.  
Ett högerklick på en anteckning öppnar dess meny i stället för redigeringsfältet: `Color`, `Remove color` medan ett markerat objekt har en färg, och `Delete`, som visar `Delete selected` medan anteckningen är ett av två eller fler markerade objekt. En markerad anteckning tas också bort med de tangenter som tar bort tabeller – se [Ta bort tabeller och anteckningar](./table-related-functions.md#table-and-memo-deletion).

![En anteckning läggs till med Alt + M, en text skrivs in och anteckningens kant dras för att ändra storleken](/img/demo-memo.webp)

## Skapa tabellgrupper {#table-group-creation}

En tabellgrupp är en ruta som rymmer tabeller, och du kan ge den ett namn och en färg. Skapa en på något av två sätt:

- Välj `New Table Group` i snabbmenyn eller snabbsökningen, klicka på knappen `New Table Group` i [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) eller tryck på `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) och dra sedan upp en ruta på arbetsytan. Varje tabell vars mitt ligger inuti rutan går med i den nya gruppen, om den inte redan ingår i en annan grupp – se [Rita en grupp](./table-groups.md#drawing-a-group).
- Markera tabeller och välj `Group selected tables` i en tabells snabbmeny eller `Group Selected Tables` i snabbsökningen, eller tryck på `T` och sedan `G` – se [Gruppera markerade tabeller](./table-groups.md#grouping-selected-tables).

Namngivning, färgläggning, flyttning, storleksändring och resten beskrivs i [Tabellgrupper](./table-groups.md).

## Skapa relationer {#relationship-creation}

Påbörja en relation från snabbmenyn, från [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) längst ned på arbetsytan eller med ett kortkommando. Varje relationstyp har sitt eget:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) eller `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) eller `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) eller `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) eller `⌘ + ⌥ + 4` (Mac)

När en typ är aktiverad ändras markören. Klicka först på föräldratabellen och sedan på barntabellen.  
Föräldratabellen får en primärnyckel om den inte har någon, och för var och en av föräldratabellens primärnyckelkolumner får barntabellen en sekundärnyckelkolumn med `Not Null` och samma datatyp, standardvärde och kommentar.  
En nyckel av typen serial är undantaget: dess sekundärnyckel får den heltalstyp som serial-typen lagrar, till exempel `integer` för `serial4` – se [Identifierande relationer](./relationship-editing.md#identifying-relationships).  
Varje sekundärnyckelkolumn namnges efter sin nyckel: ett namn på ett ord, som `id`, får föräldratabellens namn framför sig (`user_id`), ett namn på flera ord, som `member_id`, behålls och ett namn som barntabellen redan har numreras (`user_id_2`) – se [Namn på sekundärnyckelkolumner](./relationship-editing.md#foreign-key-column-names).  
Om du klickar två gånger på samma tabell ritas en självrefererande relation.  
En ny relation börjar med både `On Delete` och `On Update` inställda på `Not set`; ändra dem i relationens snabbmeny – se [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Tryck på `Escape`, eller tryck på samma kortkommando igen, för att avbryta. Om du avbryter förblir markeringen som den är, och nästa tryck på `Escape` avmarkerar allt.

När föräldratabellen har valts och du pekar på en tabell som relationen kan sluta i, får den tabellen en kontur och två knappar visas bredvid den:

- `Create new columns` (`+`) ritar relationen med nya sekundärnyckelkolumner, som ett klick på tabellen gör.
- `Map to existing columns` (en länkikon) avslutar ritningen och öppnar [Mappa kolumner](./relationship-editing.md#map-columns) för de två tabellerna, så att relationen kan använda kolumner som barntabellen redan har. Ingenting skrivs förrän du trycker på `Map`.

Föräldratabellen visar också knapparna när pekaren har flyttats en bit från stället där du klickade på den, så att även en självrefererande relation kan mappas till befintliga kolumner.  
Ett finger ger ingen hovring, så när du ritar med ett finger visas knapparna aldrig och ett tryck på barntabellen ritar relationen direkt; en penna visar dem som en mus gör.  
Om föräldratabellen har förlorat sin primärnyckel när du når barntabellen, till exempel genom att ett steg ångras eller genom en medarbetares ändring, är knappen `Create new columns` nedtonad med knappbeskrivningen `<parent> has no primary key to copy`, och ett klick på barntabellen avslutar ritningen utan att något ritas.

![En One N-relation ritas med ⌘ + ⌥ + 4 och sedan en Zero N-relation från arbetsytans verktygsfält, där barntabellen får en kontur och knapparna Map to existing columns och Create new columns](/img/demo-relationship.webp)

## Duplicera tabeller och anteckningar {#duplicating-tables-and-memos}

Befintliga tabeller och anteckningar kan kopieras, klistras in och dupliceras genom att dras med `Alt` nedtryckt – se [Tabellfunktioner](./table-related-functions.md#copyingpasting-tables-and-memos).
