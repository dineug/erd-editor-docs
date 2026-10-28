---
sidebar_position: 16
description: Synkronisering av datatyp i relationer och domäner, maximal kommentarsbredd, inställningslås (vy, flik, kodinställningar och namnvisning), kolumnernas visningsordning, listan över kortkommandon och fliken Inställningar i en skrivskyddad editor.
---

# Inställningar

Öppna fliken Inställningar med knappen `Settings` i verktygsfältet eller från [snabbsökningen](./quick-search.md) under `Tab`.
Inställningsskärmen har två flikar: `Preferences` och `Shortcuts`. `Preferences` öppnas först, utom från raden `Shortcuts` på [välkomstskärmen](./editing-start.md#welcome-screen), som öppnar `Shortcuts`.

Temat och visningsspråket finns inte på den här skärmen. Knapparna `Theme` och `Display Language` i verktygsfältet öppnar dem – se [Språk och tema](./language-and-theme.md).

## Synkronisera datatyp i relationer {#relationship-datatype-sync}

Avgör om datatyper ska synkroniseras. Inställningen är på som standard.
När du ändrar en kolumns datatyp tillämpas typen då på varje kolumn som är kopplad till den via en relation, och kedjan följs från båda ändarna, så att en sekundärnyckel aldrig avviker från nyckeln som den refererar till.
Från en nyckel till dess sekundärnycklar förs en serial-typ vidare som den heltalstyp den lagrar, på samma sätt som när en relation ritas – se [Identifierande relationer](./relationship-editing.md#identifying-relationships). Om du ändrar en nyckel till `serial` får dess sekundärnycklar alltså `integer` i PostgreSQL, och ändringen fortsätter nedåt i kedjan därifrån.
Från en sekundärnyckel tillbaka till dess nyckel förs typen vidare som den är skriven, förutom att en serial-nyckel behåller sin typ och att ändringen stannar där.
[Mappa kolumner](./relationship-editing.md#map-columns) följer också den här inställningen: medan den är på får varje befintlig kolumn som mappas den typ som dess föräldranyckel ger en sekundärnyckel, och ändringen fortsätter längs relationerna som ovan. Medan den är av, eller när nyckeln saknar datatyp, behåller kolumnen sin egen.

En [domän](./dictionary.md#domains-and-data-types) ger sin `Data Type` till de kolumner som är kopplade till den, när den typen ändras och när en kolumn kopplas. Medan den här inställningen är på fortsätter ändringen längs relationerna från var och en av de kolumnerna som ovan; medan den är av ändras bara de kopplade kolumnerna. En kolumn som får sin domäns typ i det steget behåller den, även där synkroniseringen skulle ge den en annan, till exempel den heltalstyp som en serial-nyckel ger sina sekundärnycklar.
En kopplad kolumn som synkroniseringen eller Mappa kolumner ger en annan typ än den egna domänens kopplas från den domänen i samma steg – se [Koppla från](./dictionary.md#unlinking). Ingen inklistring av kolumner för vidare en typ enligt den här inställningen, inte ens typen hos en domän som inklistringen kopplar kolumner till – se [Kopiera/klistra in kolumner](./table-editing.md#copyingpasting-columns). En `Data Type` som klistras in på bladet `Domains` på fliken Ordlista gör det, som varje ändring av en domäns typ gör.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Inställningen för synkronisering av datatyp i relationer" loading="lazy" />

![members.id ändras till BIGINT UNSIGNED, vilket uppdaterar varje member_id som är kopplad till den](/img/demo-relationship-data-type-sync.webp)

## Maximal kommentarsbredd {#maximum-comment-width}

Anger kommentarskolumnens maximala bredd i pixlar (`60` ~ `200`).
Om du slår av växlingsknappen tas gränsen bort, och inmatningsfältet är inaktiverat medan den är av.
När du slår på den börjar värdet på `60px`. Ett inskrivet värde utanför intervallet justeras till närmaste gräns.

![Maximum comment width slås på, 120 anges och ERD-fliken visar kommentarerna avkortade till den bredden](/img/demo-settings-comment-width.webp)

## Lås {#lock}

Listan `Lock` innehåller sju inställningar. Medan en inställnings lås är på behåller filen det värde som inställningen hade när den låstes, så en ändring på skärmen lämnar filen som den var.

| Rad | Det som filen behåller | I ett nytt diagram |
| --- | --- | --- |
| `Viewport` | ERD-arbetsytans zoomnivå och vyposition, som ett enda lås | `100% · 0, 0` |
| `Canvas Type` | Fliken som diagrammet öppnas på: `ERD`, `Visualization`, `Schema SQL`, `Code Generator` eller `Dictionary` | `ERD` |
| `Language` | Språket i [kodgeneratorn](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | Kodgeneratorns [skiftläge för tabellnamn](./code-generator.md#name-case) | `Pascal` |
| `Column Name Case` | Kodgeneratorns [skiftläge för kolumnnamn](./code-generator.md#name-case) | `Camel` |
| `Bracket Type` | Alternativet `Bracket` på fliken [Schema SQL](./schema-sql.md#database-and-bracket) och i de mål i [kodgeneratorn](./code-generator.md#bracket) som erbjuder det | `None` |
| `Name View` | Den [namnvisning](./logical-names.md#name-view) som diagrammet öppnas i: `Physical Names`, `Logical Names` eller `Both Names` | `Physical Names` |

Varje rad visar ett värde och en låsknapp, och ett klick på knappen slår på eller av just det låset.
Medan ett lås är på visar knappen ett stängt lås med knappbeskrivningen `Unlock Viewport` (och så vidare för varje rad), och värdet, med knappbeskrivningen `Locked value`, är det som filen behåller.
Medan det är av visar knappen ett öppet lås med knappbeskrivningen `Lock Viewport`, och värdet, nedtonat och med knappbeskrivningen `Current value`, är inställningen så som den är just nu.
`Viewport` visar zoomnivån och sedan vypositionen, till exempel `75% · -40, 91`. Vypositionen är den punkt på skärmen, i pixlar, där diagrammets `0, 0` ligger, och en koordinat på tusen eller mer förkortas, som i `1.2k` eller `-24k`.

När du låser låses inställningen så som den är i det ögonblicket.
Medan ett lås är på fungerar inställningen fortfarande på skärmen: du kan rulla och zooma, byta flik, välja ett annat språk, skiftläge för namn eller citattecken i menyerna, alternativpanelerna eller snabbsökningen och byta namnvisning från vilken som helst av dess väljare – se [Byta visning](./logical-names.md#switching-the-view).
Filen behåller dock det låsta värdet, och raden fortsätter att visa det, så diagrammet öppnas igen i den låsta vyn, på den låsta fliken, i den låsta namnvisningen och med det låsta språket, de låsta skiftlägena för namn och den låsta typen av citattecken. En JSON-export skriver också de låsta värdena.
Slå av låset om du vill spara det som skärmen visar, så följer filen inställningen från och med då: när `Viewport` är upplåst öppnas diagrammet där du lämnade det. Slå av låset och på igen om du i stället vill låsa ett nytt värde, till exempel en ny startvy.
Om den låsta vyn inte visar någon del av diagrammet när filen öppnas flyttas vyn ändå till diagrammet, och det låsta värdet förblir som det är.
`Canvas Type` behåller aldrig fliken Inställningar. När låset slås på låses den senaste andra flik som du var på, och medan det är av visar raden namnet på den fliken.

![Viewport låses upp, diagrammet rullas och zoomas, och Viewport låses igen vid den nya vy som raden visar](/img/demo-settings-locks.webp)

Att slå på eller av ett lås ändrar filen, eftersom filen lagrar vilka lås som är på, men liksom resten av fliken Inställningar registreras det inte i [ångrahistoriken](./undo-redo.md#what-the-history-records). Det gör inte heller ett byte av namnvisning, låst eller inte.
Alla andra inställningar sparas så som de är: databasen, alternativen i [`View Option`](./table-related-functions.md#table-view-options) och resten av fliken `Preferences`.
En skrivskyddad editor ändrar filen genom ingen av dem, oavsett lås: dess låsknappar och de andra kontrollerna under `Preferences` är inaktiverade, och de inställningar som den ändå låter dig ändra stannar på den skärmen – se [Skrivskyddade editorer](#read-only-editors).

Alla lås är på i ett nytt diagram, ett som startas från grunden: en tom fil som öppnas i VS Code, Obsidian eller en JetBrains-IDE (`ERD Editor: Create new diagram` och `New ERD` i Obsidian skapar en sådan), ett nytt schema i webbappen, en fil som skapas från menyn New i Google Drive eller ett `<erd-editor>` som inte får något värde.
Ett schema eller en Google Drive-fil som webbappen skapar genom att importera en SQL-, DBML-, AML- eller GraphQL-fil startar också med alla lås på. Ett schema eller en fil som skapas från en JSON-fil behåller de lås som den filen anger.
En fil som du öppnar behåller de lås som den sparades med, vart och ett med sitt låsta värde.
En fil som inte anger några lås, till exempel en som har sparats av en version från före låsen eller som har skrivits för hand, öppnas med alla lås på: vyn på `100% · 0, 0` och fliken på `ERD`, oavsett vilken vy och flik den sparade, och dess språk, skiftlägen för namn, typ av citattecken och namnvisning låsta så som den sparade dem.
En fil som har sparats av en version från före låset för namnvisning öppnas i `Physical Names` med `Name View` låst, även om alla andra lås som den anger är av.
En `Import` som ersätter diagrammet sätter också låsen: en JSON-fil tar med sig de lås som den anger och de värden som de håller, och en SQL-, DBML-, AML- eller GraphQL-fil behåller dina lås men återställer vyn till `100% · 0, 0`, låst eller inte – se [Importera externa filer](./file-import-export.md#importing-external-files). Om du ångrar importen kommer de lås och låsta värden som den ersatte tillbaka.

En ändring som ett lås håller utanför filen räknas inte som en ändring. VS Code markerar inte fliken som ändrad, och Obsidian och en JetBrains-IDE lämnar filen som den var, både när de sparar automatiskt och när fliken stängs.
Med alla lås på syns det därför aldrig i `git diff` att du tittar runt i ett diagram, byter flik, provar ett annat språk, skiftläge för namn eller citattecken och byter namnvisning.
När `Viewport` är upplåst ändrar rullning och zoomning filen; när `Canvas Type` är upplåst gör ett flikbyte det också, även till fliken Inställningar; och när `Name View` är upplåst gör ett byte av namnvisning det också.
Den tomma filen för ett nytt diagram förblir tom fram till den första ändring som filen behåller: en redigering, en ändring av en inställning som inget lås håller eller ett lås som slås på eller av.
Om du öppnar ett diagram och stänger det utan någon sådan ändring lämnas filen som den var, oavsett vilken version eller dator som skrev den. Filen innehåller bara det som diagrammet är, i en fast ordning, och en fil som har sparats i en äldre form skrivs om i den här formen en gång, vid sin första sådana ändring – se [Lagringsform och körtidsvärde](../../api/advanced/schema.md#storage-form-and-runtime-value).
I VS Code är en revision som öppnas igen som diagram med `Reopen Editor With...`, till exempel en Git-revision eller en post i Local History, skrivskyddad och markeras aldrig som ändrad.
I Google Drive sparas en rullning, en zoomning eller ett byte till en annan flik aldrig för sig, låst eller inte. När `Viewport` är upplåst skrivs vyn bara tillsammans med en annan ändring, så en Drive-fil öppnas där vyn var vid den senaste sparningen, och detsamma gäller fliken när `Canvas Type` är upplåst. Ett byte av namnvisning som görs när `Name View` är upplåst sparas på samma sätt som en redigering, och ett som görs medan `Name View` är låst, eller i en skrivskyddad editor, sparas aldrig.

I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) når det alla editorer när ett lås slås på eller av, och ett lås behåller värdet från den editor som slog på det.
När `Language`, ett skiftläge för namn, `Bracket Type` eller `Name View` slås av får alla editorer det värde som visas i editorn som slog av låset, så att alla sparar samma värde. Att slå av `Viewport` eller `Canvas Type` ändrar ingens vy eller flik.
Ett språk, ett skiftläge för namn eller ett citattecken som väljs medan dess lås är på når ändå alla editorer, men namnvisningen är varje editors egen medan `Name View` är låst: ett byte syns bara i den editor som gjorde det, och att slå på låset ändrar ingens visning. Medan låset är av byts visningen i alla editorer när en editor som inte är skrivskyddad byter den.
En kodagent som arbetar via MCP-servern har inget verktyg för låsen eller för de inställningar som de håller, och den läser ett låst språk, ett låst skiftläge för namn eller en låst typ av citattecken med det värde som filen behåller. Bara dess importer i läget `replace` når dem, så som `Import` gör – se [Inställningar](../../mcp/tools.md#settings) och [Import](../../mcp/tools.md#import). Dess `erd_list` och formatet `snapshot` för `erd_read` utelämnar namnvisningen, och den redigerar schemat, inklusive logiska namn, oavsett vilken visning en person tittar på.

## Ändra kolumnordning {#adjusting-column-order}

Anger visningsordningen för kolumner i tabeller.
Dra en rad för att flytta den – hela raden går att dra, och ikonen med draghandtaget utmärker den. De nio raderna är, i standardordning, `Logical Name`, `Name`, `DataType`, `Domain`, `Not Null`, `Unique`, `Auto Increment`, `Default` och `Comment`.
`Logical Name` placerar den cell för logiskt namn som en rad ritar i `Both Names`. I `Logical Names` står det logiska namnet i stället på platsen för raden `Name`, och `Physical Names` ritar ingen – se [Namnvisning](./logical-names.md#name-view). `Domain` placerar den domäncell som View Option → `Domain` visar – se [Domäncellen](./logical-names.md#the-domain-cell).
En cell som döljs av ett [visningsalternativ för tabeller](./table-related-functions.md#table-view-options) eller utelämnas av namnvisningen behåller sin plats i listan, så ordningen gäller de celler som visas.
Ett diagram vars ordning ställdes in innan `Logical Name` och `Domain` fanns som rader får `Logical Name` direkt före `Name` och `Domain` direkt efter `DataType`, var de än står i dess ordning.
Ett diagram som sparats av en senare version behåller också sin ordning, även när den versionen har en rad som den här saknar: de rader som den här versionen har står i den ordning som filen anger, och den okända raden utelämnas. Att spara diagrammet här skriver ordningen utan den, och den senare versionen lägger tillbaka den raden bredvid sin granne i sin egen standardordning.
Märket för en [alternativ nyckel](./table-related-functions.md#alternate-keys) (`AK1.1` och så vidare) är inte någon av de här raderna. Det står alltid sist på en rad, efter den cell som den här ordningen placerar sist.

![Sidan rullas ned till Column Order och raden Comment dras upp under Name, vilket placerar varje kommentar direkt efter namnet på dess kolumn](/img/demo-settings-column-order.webp)

## Kortkommandon {#shortcuts}

Fliken `Shortcuts` är en skrivskyddad tabell med `Command` och `Keybinding` som listar bindningarna för den plattform du använder.

| Command | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` och sedan `G` | `T` och sedan `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

De flesta av dem fungerar bara på ERD-fliken, och de spärras medan snabbsökningen, panelen Tabellegenskaper, diff-visaren, förhandsgranskningen av automatisk layout, tidsresan, dialogrutan [`Export image`](./file-import-export.md#image) eller [`Map Columns`](./relationship-editing.md#map-columns) är öppen.
`Search`, `Toggle Explorer` och `Stop` är undantagen: `Search` visar och döljer snabbsökningen från vilken flik som helst, `Toggle Explorer` öppnar [utforskaren](./explorer.md#opening-and-closing) med dess sökning från vilken flik som helst och tar fram ERD-fliken, och `Stop` är det som stänger snabbsökningen, panelen Tabellegenskaper, diff-visaren, förhandsgranskningen av automatisk layout, tidsresan, dialogrutan `Export image`, `Map Columns`, temaverktyget, väljaren `Display Language`, färgväljaren, den lista som en knapp `Name View` öppnar och en öppen snabbmeny.
`Toggle Explorer` stänger utforskaren igen medan den är öppen på ERD-fliken och inte dold av zenläget, så som knappen `Explorer` i verktygsfältet gör. När snabbsökningen, panelen Tabellegenskaper, temaverktyget, väljaren `Display Language`, dialogrutan `Export image` eller `Map Columns` är öppen stänger `Toggle Explorer` i stället det som är öppet och flyttar tangentbordsfokus till utforskarens sökning.
`Toggle Explorer` gör ingenting medan en cell, en anteckning eller en tabellgrupps namn redigeras. Varken den eller `Search` gör något medan en cell på fliken [Ordlista](./dictionary.md) redigeras, så den text som skrivs där behålls. Medan diff-visaren, förhandsgranskningen av automatisk layout eller tidsresan är öppen lämnar `Toggle Explorer` sin tangent åt webbläsaren eller värdprogrammet – se [Webbläsarens sökruta](./find-and-replace.md#the-browsers-find-bar).
På ERD-fliken avslutar `Stop` ett öppet redigeringsfält för en cell eller anteckning, stänger namnfältet för en [tabellgrupp](./table-groups.md) utan att byta namn på gruppen eller avbryter en relation eller en `New Table Group` som håller på att ritas, och lämnar markeringen som den är. När inget av detta är öppet avmarkerar `Stop` allt, tar bort fokus från den fokuserade cellen och stänger i samma tryck en öppen färgväljare. Är temaverktyget eller väljaren `Display Language` öppen stängs den i samma tryck i båda fallen.
I en cell för logiskt namn med termlistan öppen stänger det första trycket på `Stop` bara listan – se [Komplettera termnamn](./logical-names.md#completing-term-names).
Om utforskaren, temaverktyget eller väljaren `Display Language` är öppen spärras inget av kortkommandona på arbetsytan. `Stop` stänger aldrig utforskaren. Se [Tangenter i utforskaren](./explorer.md#keys-in-the-explorer) för vad `Stop` och de andra tangenterna gör i utforskaren och [Välja ett språk](./language-and-theme.md#picking-a-language) för vad de gör i väljaren.
`Delete Selection` tar bort alla markerade tabeller, anteckningar och tabellgrupper, eller, när en enda tabell är markerad tillsammans med några av sina kolumner och zoomnivån är över `70%`, de kolumnerna – se [Ta bort tabeller och anteckningar](./table-related-functions.md#table-and-memo-deletion). `Remove Table, Memo` tar också bort markerade tabellgrupper.
`Add Table Group` startar ritläget för en [`New Table Group`](./table-groups.md#drawing-a-group), så som knappen `New Table Group` i [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar) gör, och ett andra tryck avbryter ritläget. `Group Selected Tables` är två tryck utan modifierartangent, `T` och sedan `G` inom en sekund. Kortkommandot lägger de markerade tabellerna i en ny grupp och öppnar dess namnfält, så som `Group selected tables` i en tabells snabbmeny gör, och gör ingenting när ingen tabell är markerad – se [Gruppera markerade tabeller](./table-groups.md#grouping-selected-tables). Inget av dem gör något i en skrivskyddad editor eller medan grupperna är [dolda](./table-groups.md#hiding-groups).
I en skrivskyddad editor fungerar bara de tangenter som läser: `Search`, `Toggle Explorer`, `Stop`, `Table Properties` och `Focus on this table` på den tabell som ett hopp markerade, de tre zoomtangenterna, `Zen Mode`, kopiering och piltangenterna, som flyttar den fokuserade cellen. `Editing`, varje tangent för `Add` och `Remove`, `Delete Selection`, `Primary Key`, båda tangenterna för att markera allt, de fyra relationstangenterna, `Add Table Group`, `Group Selected Tables`, `Hand Tool` och inklistring gör ingenting, och `Undo` och `Redo` ångrar och gör om ingenting – se [Skrivskyddade editorer](./table-related-functions.md#read-only-editors).
`Zoom In`, `Zoom Out` och `Zoom Reset` zoomar också fliken [Visualisering](./visualization.md#toolbar), i både `Graph` och `Flow`, utom när snabbsökningen är öppen.
I `Flow` går `Undo` och `Redo` bakåt och framåt genom det som flödet har avgränsats till, så som knapparna `Previous table` och `Next table` i flödet gör, utom när snabbsökningen är öppen. De ångrar aldrig något i diagrammet där, och i `Graph` gör de ingenting – se [Föregående och nästa tabell](./visualization.md#previous-table-and-next-table).
På fliken Visualisering stänger `Stop` också menyn för [radvisning](./visualization.md#row-display) och avbryter en [layout av flödet](./visualization.md#how-flow-is-placed) som fortfarande pågår; en vy som har avgränsats med `Focus on this table` vidgas inte.
`Focus on this table` öppnar fliken Visualisering i `Flow`, avgränsad till de markerade tabellerna och varje tabell som ligger en relation bort, och gör ingenting när ingen tabell är markerad – se [Fokusera på tabeller](./visualization.md#focusing-on-tables).
På fliken Ordlista verkar `Undo` och `Redo` på historiken för det visade bladet i stället för diagrammets, och de gör ingenting på `Checks` – se [Ordlistans blad](./undo-redo.md#dictionary-sheets). På bladen `Domains`, `Words` och `Terms` infogar `Add Column` rader nedanför markeringen, samma tangentkombination med `Shift` tillagd infogar dem ovanför, och `Remove Column` tar bort de rader som markeringen omfattar – se [Lägga till och ta bort rader](./dictionary.md#adding-and-deleting-rows). Se [Tangenter på fliken](./dictionary.md#keys-on-the-tab) för flikens övriga tangenter.
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` och `Group Selected Tables` ger företräde åt en textmarkör: medan du redigerar en cell eller en anteckning eller skriver i ett textfält som utforskarens sökfält markerar `Ctrl + A` (Windows/Linux) eller `⌘ + A` (Mac) texten, `Space` skriver ett mellanslag, `Delete` och `Backspace` raderar text och `T` och sedan `G` skriver de två bokstäverna.
Kopiera och klistra in är webbläsarens egna `Ctrl + C` och `Ctrl + V` (Windows/Linux) eller `⌘ + C` och `⌘ + V` (Mac), så de finns inte i den här listan – se [Redigera tabeller](./table-editing.md).

Bindningarna går inte att ändra från den här fliken.
Ett värdprogram som bäddar in editorn mappar om dem med [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), utom `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` och `Zoom Reset`, som är fasta.
Fliken `Shortcuts` listar då värdprogrammets bindningar: ett kommando som värdprogrammet inte mappar om behåller sin standardbindning, och ett som värdprogrammet inte binder till någon tangent visar ingen.
Radtangenterna på fliken Ordlista följer `Add Column` och `Remove Column`, så om du mappar om något av dem flyttas de – se [`dictionaryRowChords`](../../api/erd-editor-element.md#dictionaryrowchords).

I Obsidian når de här tangenterna editorn så länge diagrammets flik i Obsidian är aktiv, även där ett kortkommando i Obsidian använder samma tangent, som `Alt + Enter`, `Ctrl + K` och `Ctrl + F` (Windows/Linux) eller `⌥ + Enter`, `⌘ + K` och `⌘ + F` (Mac). Det gör även `Alt + Shift + Enter` (Windows/Linux) eller `⌥ + Shift + Enter` (Mac) på fliken Ordlista, som inte finns på någon rad i den här listan. Alla andra kortkommandon i Obsidian fungerar fortfarande där. Se [Webbläsarens sökruta](./find-and-replace.md#the-browsers-find-bar) för `Ctrl + F` eller `⌘ + F`.

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) visar fliken Inställningar diagrammets inställningar och ändrar ingen av dem. En etikett `Read only` står bredvid rubriken på varje sida, `Preferences` och `Shortcuts`.
Reglagen `Relationship DataType Sync` och `Maximum comment width` och breddfältet är inaktiverade, och det är varje låsknapp också. Raderna under `Column Order` visar inget grepp och går inte att dra.
Varje rad under `Lock` visar fortfarande sitt värde. En låst rad visar det värde som filen behåller, och en upplåst den inställning som den skärmen har, vilket kan skilja sig från filens, som nedan.

De inställningar som avgör vad skärmen visar går fortfarande att ändra där: vyns position och zoom, fliken, namnvisningen, databasen, kodgeneratorns språk, båda skiftlägena för namn, citattecknen och växlarna under [`View Option`](./table-related-functions.md#table-view-options).
Var och en ändrar bara den skärmen, oavsett lås. Ändringen sparas inte i filen eller skrivs av en JSON-export, registreras inte i ångra-historiken, räknas inte som en ändring och når aldrig medarbetare. Alternativpanelerna på flikarna [Schema SQL](./schema-sql.md#options-panel) och [Kodgenerator](./code-generator.md#options-panel) rubricerar de valen `This window only` där, i stället för `Saved in the document`.
När editorn blir skrivbar igen går databasen, språket, skiftlägena, citattecknen och växlarna under View Option tillbaka till filens värden. Vyn, fliken och namnvisningen stannar som du lämnade dem, och filen tar emot var och en av dem, så långt dess lås tillåter, med din nästa ändring av den.
