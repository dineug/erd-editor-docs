---
sidebar_position: 13
description: Ångra och gör om redigeringar, vad historiken registrerar och hur du stegar igenom den med tidsresan.
---

# Ångra, gör om

Du kan gå tillbaka till ett tidigare tillstånd i redigeringen eller framåt till ett senare.  
Historiken rymmer upp till `2048` ändringar.

- Ångra: `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac)
- Gör om: `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Shift + Z` (Mac)

I verktygsfältet finns samma två kommandon i form av knapparna `Undo` och `Redo`, bredvid `Time Travel`.  
De lyser bara upp när det finns något att ångra eller göra om. En editor med `readonly` döljer alla tre, och kortkommandona gör ingenting.

Ångra och Gör om fungerar bara på ERD-fliken. De är inte tillgängliga på flikarna Visualisering, Schema SQL, Kodgenerator och Inställningar. I fälten `Before tables` och `After tables` på fliken Schema SQL används samma tangenter i stället till att ångra och göra om det du skriver i fältet.  
Kortkommandona är också inaktiva medan snabbsökningen, `Table Properties`, `Diff Viewer`, förhandsgranskningen av `Auto Layout`, dialogrutan [`Export image`](./file-import-export.md#image), [Mappa kolumner](./relationship-editing.md#map-columns) eller tidsresan är öppen.  
De fortsätter att fungera medan tangentbordsfokus är var som helst i [utforskaren](./explorer.md#keys-in-the-explorer), inklusive dess träd, och medan [färgväljaren](./table-related-functions.md#table-and-memo-color-specification) är öppen. Även med textmarkören i något av deras fält, som sökfältet, ersättningsfältet eller `Hex`, ångrar och gör de om i diagrammet i stället för i texten i fältet.

Historiken finns i minnet under den aktuella sessionen. Den sparas inte i dokumentet, så när du öppnar ett diagram igen börjar det med en tom historik.

![En tabell flyttas och en kolumn tas bort med ⌥ + Backspace, och sedan ångras båda med ⌘ + Z och görs om med ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Vad historiken registrerar {#what-the-history-records}

Registreras:

- Tabeller och anteckningar: tillägg, borttagning, flytt, färg, namn och kommentar, anteckningarnas text och storlek.
- Tabellgrupper: tillägg, borttagning, flytt, storleksändring, namn, färg och vilken grupp varje tabell ingår i – se [Tabellgrupper](./table-groups.md).
- Kolumner: tillägg, borttagning, ändrad ordning och varje kolumnalternativ.
- Relationer: tillägg, borttagning, typändring, kolumnerna som anges i [Mappa kolumner](./relationship-editing.md#map-columns) och varje val i `On Delete` eller `On Update` – se [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update). När en borttagning ångras kommer relationen tillbaka med sina ON DELETE- och ON UPDATE-åtgärder.
- Index och deras kolumner.
- Vyposition, zoomnivå och alternativen i `View Option`.
- Skripten `Before tables` och `After tables` på fliken Schema SQL, ett steg för varje ändring som du tillämpar genom att lämna fältet – se [Skript före och efter tabellerna](./schema-sql.md#before-and-after-scripts).
- Att importera en fil och att lägga till en med [`Import and Add`](./file-import-export.md#import-and-add).

Registreras inte:

- Databassystemet och databasnamnet.
- Kodgeneratorns språk, `Table Name Case` och `Column Name Case`.
- Typen av citattecken, oavsett om den anges på fliken Schema SQL eller på fliken Kodgenerator.
- Valen `Statements`, `Header` och `Tables` på fliken Schema SQL, som hör till editorfönstret – se [Alternativpanelen](./schema-sql.md#options-panel).
- Allt på fliken Inställningar, inklusive raderna under [`Lock`](./settings.md#lock).
- Temat och visningsspråket – se [Språk och tema](./language-and-theme.md).
- Vilken tabell, anteckning eller grupp som ritas framför de andra.
- [Utforskaren](./explorer.md): att öppna, stänga eller ändra storlek på den, att fälla ihop dess träd samt söktexten och sökalternativen. Det som `Replace` och `Replace All` ändrar registreras dock, liksom rullningen som ett hopp gör – se [En gest, ett steg](#one-gesture-one-step).
- Zoomning och panorering på fliken Visualisering i båda lägena, flytt av noder i grafläget eller kort i flödesläget, `Tidy Up`, radvisningen och fokusering på tabeller – se [Flödet redigerar aldrig dokumentet](./visualization.md#flow-never-edits-the-document).

Ändringar av något av detta kan inte ångras.

Ändringar som kommer från en annan editor registreras inte heller, så Ångra återställer bara dina egna. I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) ångrar varje editor sina egna ändringar, och en kodagent som redigerar via [MCP-servern](../../mcp/live-and-headless.md#undo) ångrar sina egna med `erd_undo`.

Om du ångrar en `Import`, som ersätter hela diagrammet, kommer det tidigare diagrammet tillbaka så som editorn hade det när du importerade, med varje [lås](./settings.md#lock) på eller av och varje låst värde så som de var då.  
Om det diagrammet hade `Viewport` låst går vyn och zoomen tillbaka till den låsta vyn, där diagrammet öppnas, i stället för dit du var. Om dess `Viewport` var upplåst går de tillbaka dit du var när du importerade. De andra låsta inställningarna, som fliken du är på eller kodgeneratorns språk, förblir som de är på din skärm.  
Ett nytt diagram börjar med alla lås på. Lås upp `Viewport` innan du importerar för att behålla din vy genom en sådan ångring. Att låsa upp det efteråt, eller att importera en JSON-fil vars eget lås `Viewport` är av, ändrar inte vart ångringen tar dig.

## En gest, ett steg {#one-gesture-one-step}

Allt som en enda gest skickar blir ett steg i historiken.  
Att klistra in flera tabeller och anteckningar på en gång, eller att duplicera dem med `Alt + drag`, ångras i ett enda steg.

Ett tryck på `Delete` eller `Backspace`, eller `Delete selected` eller `Delete columns` i en snabbmeny, är ett steg, oavsett hur många tabeller, anteckningar, tabellgrupper eller kolumner det tar bort.  
Att växla primärnyckeln för flera markerade kolumner är ett steg, oavsett om det sker med `Alt + K` (Windows/Linux) eller `⌥ + K` (Mac) eller med `Primary Key on selected columns` i en tabells snabbmeny.  
Att ange färgen för markeringen, eller att ta bort den med `No color` eller `Remove color`, är ett steg, oavsett hur många tabeller, anteckningar och grupper som är markerade. Att välja en färg som allt markerat redan har registrerar inget steg, och det gör inte heller `No color` när inget markerat har någon färg.  
`Map` eller `Save` i [Mappa kolumner](./relationship-editing.md#map-columns) är ett steg, tillsammans med de sekundärnyckelkolumner det lägger till och de datatyper det ändrar.  
`Import and Add` är ett steg, tillsammans med den rullning som visar det tillagda blocket när en sådan behövs.

Att skapa en [tabellgrupp](./table-groups.md), genom att rita den eller genom att gruppera de markerade tabellerna med `Group selected tables` eller `T` och sedan `G`, är ett steg tillsammans med varje tabell den tar in. Att ta bort en grupp är ett steg, och om du ångrar det kommer gruppen tillbaka med sina tabeller i den.  
Om du drar en grupp i dess namnlist flyttas gruppen och alla dess tabeller i ett steg. Tabeller som släpps in i eller ut ur en grupp byter grupp i samma steg som dragningen när du släpper inom ungefär `200ms` efter den sista rörelsen, så en ångring flyttar tillbaka dem dit de var och till de grupper de ingick i. Efter en längre paus innan du släpper är gruppbytet ett eget steg, och den första ångringen tar bara tillbaka det.  
Att ändra storlek på en grupp med en kant eller ett hörn registreras en gång, när du släpper.  
Att tillämpa [automatisk layout](./table-related-functions.md#auto-layout) är ett steg, inklusive de grupper som den anpassar efter deras tabeller.

`Replace All` i [Sök och ersätt](./find-and-replace.md#replacing) är också ett steg, oavsett hur många tabellnamn, kolumnnamn, indexnamn, tabellgruppsnamn, kommentarer och anteckningar den ändrar. När den inte ändrar något, som när `Preserve Case` skriver tillbaka varje träff oförändrad, registrerar den inget steg.  
En enskild `Replace` är ett steg, inklusive rullningen till nästa träff när den träffen behöver en rullning. När den skriver tillbaka sin träff oförändrad registrerar den bara den rullningen, eller ingenting när det inte finns någon.  
Att gå till en träff rullar arbetsytan bara när träffen inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). Den rullningen registreras som alla andra ändringar av vypositionen, så när du har gått igenom träffar tar Ångra först tillbaka de rullningarna, en per steg.  
De andra hoppen som landar på arbetsytan registrerar sina rullningar på samma sätt: att välja en rad i utforskaren, ett resultat i snabbsökningen eller [kortknappen](./visualization.md#card-buttons) för extern länk i flödesläget. Ett hopp som lämnar vyn där den är registrerar ingenting. Att välja en rad i listan i `Diff Viewer` registrerar inte heller något, eftersom det bara flyttar diff-visarens egna skrivskyddade sidor.

En sammanhängande dragning, panorering av arbetsytan, zoomning, nypgest eller färgändring buffras i ungefär `200ms` och blir också ett enda steg.  
En dragning som flyttar mindre än `20px` totalt registrerar ingen flytt. Bara ett eventuellt gruppbyte som den gör registreras.

Det du skriver i en cell eller en anteckning registreras per inmatning i stället för per gest: varje skrivet tecken, varje inklistring och varje steg i en teckensammansättning med IME är ett eget steg.  
En tabellgrupps namn registreras en gång, när det sparas med `Enter` eller när du lämnar fältet, så namnet som du skriver i en grupp som du just har skapat är ett annat steg än skapandet. `Esc`, eller ett namn som lämnas oförändrat, registrerar ingenting.

## Tidsresa {#time-travel}

Tidsresan öppnas med knappen `Time Travel` i verktygsfältet, bredvid Ångra och Gör om.  
Knappen gör ingenting förrän sessionen har minst en registrerad ändring.

Tidsresan öppnar en separat, skrivskyddad kopia av diagrammet, med den rullningsposition och zoomnivå som arbetsytan visar, oavsett om låset `Viewport` är på eller inte.  
Dra i skjutreglaget, eller klicka var som helst på dess spår, för att gå igenom hela redigeringshistoriken och förhandsgranska varje punkt. Skjutreglagets position längst till vänster är tillståndet ett steg före den första registrerade ändringen, och det öppnas med reglaget på det aktuella tillståndet.  
Förhandsgranskningen är passiv: den ritar en minikarta, men du kan inte panorera, rulla eller redigera den, och det verkliga dokumentet förblir orört tills du tillämpar.

Tryck på `Apply` för att återställa den valda punkten, eller på `Cancel` eller `Esc` för att lämna dokumentet oförändrat.

![Tidsresan öppnas, skjutreglaget dras bakåt genom sessionen och en tidigare punkt tillämpas](/img/demo-time-travel.webp)
