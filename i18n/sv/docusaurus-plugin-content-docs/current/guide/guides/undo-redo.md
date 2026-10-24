---
sidebar_position: 15
description: Ångra och gör om redigeringar, vad historiken registrerar, de egna historikerna för bladen på fliken Ordlista och hur du stegar igenom diagrammets historik med tidsresan.
---

# Ångra, gör om

Du kan gå tillbaka till ett tidigare tillstånd i redigeringen eller framåt till ett senare.  
Historiken rymmer upp till `2048` ändringar.

- Ångra: `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac)
- Gör om: `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Shift + Z` (Mac)

På ERD-fliken finns samma två kommandon i verktygsfältet i form av knapparna `Undo` och `Redo`, bredvid `Time Travel`. På fliken Ordlista visar verktygsfältet `Undo` och `Redo` utan `Time Travel`, och ingen annan flik visar dem.  
De lyser bara upp när det finns något att ångra eller göra om. En editor med `readonly` döljer dem, och kortkommandona varken ångrar eller gör om något.

Ångra och Gör om verkar på diagrammets historik bara på ERD-fliken.  
Kortkommandona är inaktiva där medan snabbsökningen, `Table Properties`, `Diff Viewer`, förhandsgranskningen av `Auto Layout`, dialogrutan [`Export image`](./file-import-export.md#image), [Mappa kolumner](./relationship-editing.md#map-columns) eller tidsresan är öppen.  
De fortsätter att fungera medan tangentbordsfokus är var som helst i [utforskaren](./explorer.md#keys-in-the-explorer), inklusive dess träd, och medan [färgväljaren](./table-related-functions.md#table-and-memo-color-specification) är öppen. Även med textmarkören i något av deras fält, som sökfältet, ersättningsfältet eller `Hex`, ångrar och gör de om i diagrammet i stället för i texten i fältet.

På de andra flikarna:

- Ordlista: de ångrar och gör om redigeringarna på det visade bladet, `Domains`, `Words` eller `Terms`, från det bladets egen historik, aldrig diagrammets. På `Checks` gör de ingenting – se [Ordlistans blad](#dictionary-sheets).
- Visualisering: i `Flow` går samma tangenter bakåt och framåt genom det som flödet har visat, så som `Previous table` och `Next table` gör, även i en editor med `readonly`. De ångrar eller gör aldrig om något i diagrammet där – se [Föregående och nästa tabell](./visualization.md#previous-table-and-next-table). I `Graph` gör de ingenting.
- Schema SQL, Kodgenerator och Inställningar: de är inte tillgängliga. I fälten `Before tables` och `After tables` på fliken Schema SQL används samma tangenter i stället till att ångra och göra om det du skriver i fältet.

Historiken finns i minnet under den aktuella sessionen. Den sparas inte i dokumentet, så när du öppnar ett diagram igen börjar det med en tom historik.

![En tabell flyttas och en kolumn tas bort med ⌥ + Backspace, och sedan ångras båda med ⌘ + Z och görs om med ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Vad historiken registrerar {#what-the-history-records}

Registreras:

- Tabeller och anteckningar: tillägg, borttagning, flytt och färg; en tabells namn, logiska namn och kommentar; en antecknings text och storlek.
- Tabellgrupper: tillägg, borttagning, flytt, storleksändring, namn, färg och vilken grupp varje tabell ingår i – se [Tabellgrupper](./table-groups.md).
- Kolumner: tillägg, borttagning, ändrad ordning, logiskt namn, den domän som varje kolumn är kopplad till och varje kolumnalternativ.
- De fysiska namn som ordlistorna härleder, och om varje namn är ditt eget eller tillhör ordlistorna: en ångring återställer ett namn och det tillståndet tillsammans – se [Egna namn](./dictionary.md#names-of-your-own).
- `Derive Physical Name Again` och `Derive Physical Names Again` – se [Härled fysiska namn igen](./dictionary.md#derive-physical-names-again).
- Relationer: tillägg, borttagning, typändring, kolumnerna som anges i [Mappa kolumner](./relationship-editing.md#map-columns) och varje val i `On Delete` eller `On Update` – se [ON DELETE och ON UPDATE](./relationship-editing.md#on-delete-and-on-update). När en borttagning ångras kommer relationen tillbaka med sina ON DELETE- och ON UPDATE-åtgärder.
- Index och deras kolumner.
- Vyposition, zoomnivå och alternativen i `View Option`.
- Skripten `Before tables` och `After tables` på fliken Schema SQL, ett steg för varje ändring som du tillämpar genom att lämna fältet – se [Skript före och efter tabellerna](./schema-sql.md#before-and-after-scripts).
- Att importera en fil och att lägga till en med [`Import and Add`](./file-import-export.md#import-and-add).

Registreras inte:

- Databassystemet och databasnamnet.
- Kodgeneratorns språk, `Table Name Case` och `Column Name Case`.
- Typen av citattecken, oavsett om den anges på fliken Schema SQL eller på fliken Kodgenerator.
- Valen `Statements`, `Header`, `Write logical names into empty comments` och `Tables` på fliken Schema SQL, som hör till editorfönstret – se [Alternativpanelen](./schema-sql.md#options-panel).
- Allt på fliken Inställningar, inklusive raderna under [`Lock`](./settings.md#lock).
- Byte av namnvisning, från vilken plats som helst, oavsett om dess lås är på eller av – se [Byta visning](./logical-names.md#switching-the-view).
- Temat och visningsspråket – se [Språk och tema](./language-and-theme.md).
- Vilken tabell, anteckning eller grupp som ritas framför de andra.
- [Utforskaren](./explorer.md): att öppna, stänga eller ändra storlek på den, att fälla ihop dess träd samt söktexten och sökalternativen. Det som `Replace` och `Replace All` ändrar registreras dock, liksom rullningen som ett hopp gör – se [En gest, ett steg](#one-gesture-one-step).
- Zoomning och panorering på fliken Visualisering i båda lägena, flytt av noder i grafläget eller kort i flödesläget, `Tidy Up`, radvisningen, fokusering på tabeller och stegning med `Previous table` och `Next table` – se [Flödet redigerar aldrig dokumentet](./visualization.md#flow-never-edits-the-document).
- Det visade bladet på fliken Ordlista samt varje blads sökning, markering, rullning och kolumnbredder – se [Öppna fliken](./dictionary.md#opening-the-tab).

Ändringar av något av detta kan inte ångras.

Redigeringar som görs på fliken Ordlista kan ångras, men de hamnar i historiken för sitt eget blad i stället för i den här, så Ångra på ERD-fliken tar aldrig tillbaka någon av dem, inte ens en domäns nya `Data Type` och de kolumntyper den ändrar – se [Ordlistans blad](#dictionary-sheets).

Ändringar som kommer från en annan editor registreras inte heller, så Ångra återställer bara dina egna. I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) ångrar varje editor sina egna ändringar, och en kodagent som redigerar via [MCP-servern](../../mcp/live-and-headless.md#undo) ångrar sina egna med `erd_undo`.

Om du ångrar en `Import`, som ersätter hela diagrammet, kommer det tidigare diagrammet tillbaka så som editorn hade det när du importerade, med varje [lås](./settings.md#lock) på eller av och varje låst värde så som de var då.  
Om det diagrammet hade `Viewport` låst går vyn och zoomen tillbaka till den låsta vyn, där diagrammet öppnas, i stället för dit du var. Om dess `Viewport` var upplåst går de tillbaka dit du var när du importerade. De andra låsta inställningarna, som fliken du är på, kodgeneratorns språk eller namnvisningen, förblir som de är på din skärm.  
Ett nytt diagram börjar med alla lås på. Lås upp `Viewport` innan du importerar för att behålla din vy genom en sådan ångring. Att låsa upp det efteråt, eller att importera en JSON-fil vars eget lås `Viewport` är av, ändrar inte vart ångringen tar dig.

Om du ångrar importen av en JSON-fil kommer också de ord, termer och domäner som det tidigare diagrammet hade tillbaka. En import av Schema SQL, GraphQL, DBML eller AML behåller ordlistorna, så när den ångras eller görs om lämnas de som de är, inklusive redigeringar som har gjorts på fliken Ordlista sedan dess.

Om ett steg som ångras eller görs om på ERD-fliken kopplar en kolumn till en domän igen, eller återställer en kolumn som är kopplad till en, får kolumnen domänens datatyp så som den är nu. Om det i stället återställer en annan typ på en kopplad kolumn kopplas kolumnen från – se [Domäner och datatyper](./dictionary.md#domains-and-data-types).

## En gest, ett steg {#one-gesture-one-step}

Allt som en enda gest skickar blir ett steg i historiken.  
Att klistra in flera tabeller och anteckningar på en gång, eller att duplicera dem med `Alt + drag`, ångras i ett enda steg.

Ett tryck på `Delete` eller `Backspace`, eller `Delete selected` eller `Delete columns` i en snabbmeny, är ett steg, oavsett hur många tabeller, anteckningar, tabellgrupper eller kolumner det tar bort.  
Att växla primärnyckeln för flera markerade kolumner är ett steg, oavsett om det sker med `Alt + K` (Windows/Linux) eller `⌥ + K` (Mac) eller med `Primary Key on selected columns` i en tabells snabbmeny.  
Att ange färgen för markeringen, eller att ta bort den med `No color` eller `Remove color`, är ett steg, oavsett hur många tabeller, anteckningar och grupper som är markerade. Att välja en färg som allt markerat redan har registrerar inget steg, och det gör inte heller `No color` när inget markerat har någon färg.  
`Map` eller `Save` i [Mappa kolumner](./relationship-editing.md#map-columns) är ett steg, tillsammans med de sekundärnyckelkolumner det lägger till och de datatyper det ändrar.  
`Import and Add` är ett steg, tillsammans med den rullning som visar det tillagda blocket när en sådan behövs.

Att välja en term i listan under en cell för logiskt namn är ett steg: det logiska namnet, det fysiska namn som härleds från det och, för en kolumn, termens domän med dess datatyp – se [Komplettera termnamn](./logical-names.md#completing-term-names).  
Att välja en domän i en kolumns domäncell är ett steg, tillsammans med den datatyp som den ger kolumnen och det som [Synkronisera datatyp i relationer](./settings.md#relationship-datatype-sync) för vidare längs relationerna. Att välja `None`, vilket kopplar från kolumnen, är också ett steg – se [Domäncellen](./logical-names.md#the-domain-cell). Om du skriver in en annan datatyp än domänens i en kopplad kolumn kopplas kolumnen från i samma steg som den inmatningen.  
`Derive Physical Name Again` eller `Derive Physical Names Again` är ett steg, oavsett hur många namn, domänkopplingar och datatyper det ändrar. Det registrerar inget steg bara när det inte ändrar något. Att lämna tillbaka ett eget namn till ordlistorna är en ändring, även när namnet redan har det som ordlistorna ger.

Att skapa en [tabellgrupp](./table-groups.md), genom att rita den eller genom att gruppera de markerade tabellerna med `Group selected tables` eller `T` och sedan `G`, är ett steg tillsammans med varje tabell den tar in. Att ta bort en grupp är ett steg, och om du ångrar det kommer gruppen tillbaka med sina tabeller i den.  
Om du drar en grupp i dess namnlist flyttas gruppen och alla dess tabeller i ett steg. Tabeller som släpps in i eller ut ur en grupp byter grupp i samma steg som dragningen när du släpper inom ungefär `200ms` efter den sista rörelsen, så en ångring flyttar tillbaka dem dit de var och till de grupper de ingick i. Efter en längre paus innan du släpper är gruppbytet ett eget steg, och den första ångringen tar bara tillbaka det.  
Att ändra storlek på en grupp med en kant eller ett hörn registreras en gång, när du släpper.  
Att tillämpa [automatisk layout](./table-related-functions.md#auto-layout) är ett steg, inklusive de grupper som den anpassar efter deras tabeller.

`Replace All` i [Sök och ersätt](./find-and-replace.md#replacing) är också ett steg, oavsett hur många tabellnamn, kolumnnamn, logiska namn, indexnamn, tabellgruppsnamn, kommentarer och anteckningar den ändrar, inklusive de fysiska namn och domänkopplingar som de logiska namnen härleder. När den inte ändrar något, som när `Preserve Case` skriver tillbaka varje träff oförändrad, registrerar den inget steg.  
En enskild `Replace` är ett steg, inklusive det som ett logiskt namn härleder och rullningen till nästa träff när den träffen behöver en rullning. När den skriver tillbaka sin träff oförändrad registrerar den bara den rullningen, eller ingenting när det inte finns någon.  
Att gå till en träff rullar arbetsytan bara när träffen inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). Den rullningen registreras som alla andra ändringar av vypositionen, så när du har gått igenom träffar tar Ångra först tillbaka de rullningarna, en per steg.  
De andra hoppen som landar på arbetsytan registrerar sina rullningar på samma sätt: att välja en rad i utforskaren, ett resultat i snabbsökningen, en kontroll som anger en tabell eller en kolumn på bladet `Checks` på fliken Ordlista eller [kortknappen](./visualization.md#card-buttons) för extern länk i flödesläget. Ett hopp som lämnar vyn där den är registrerar ingenting. Att välja en rad i listan i `Diff Viewer` registrerar inte heller något, eftersom det bara flyttar diff-visarens egna skrivskyddade sidor.

En sammanhängande dragning, panorering av arbetsytan, zoomning, nypgest eller färgändring buffras i ungefär `200ms` och blir också ett enda steg.  
En dragning som flyttar mindre än `20px` totalt registrerar ingen flytt. Bara ett eventuellt gruppbyte som den gör registreras.

Det du skriver i en cell eller en anteckning registreras per inmatning i stället för per gest: varje skrivet tecken, varje inklistring och varje steg i en teckensammansättning med IME är ett eget steg.  
En cell för logiskt namn registreras på samma sätt. När dess redigeringsfält stängs med ett annat logiskt namn än det som fältet öppnades med är det fysiska namn som ordlistorna härleder från det ytterligare ett steg efter skrivandet. Den första ångringen tar bara tillbaka det namnet, tillsammans med den domän och datatyp som en term förde med sig, och lämnar kvar det logiska namn som du skrev. När ingenting härleds registreras inget mer – se [Skriva ett logiskt namn](./logical-names.md#writing-a-logical-name).  
En tabellgrupps namn registreras en gång, när det sparas med `Enter` eller när du lämnar fältet, så namnet som du skriver i en grupp som du just har skapat är ett annat steg än skapandet. `Esc`, eller ett namn som lämnas oförändrat, registrerar ingenting.

## Ordlistans blad {#dictionary-sheets}

Bladen `Domains`, `Words` och `Terms` på fliken Ordlista har var sin egen historik, skild från diagrammets. Varje redigering som görs på fliken hamnar i historiken för det blad vars rader den skriver. Liksom diagrammets rymmer varje historik upp till `2048` steg och finns i minnet under sessionen.

- Med tangentbordsfokus på fliken ångrar `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac) den senaste redigeringen på det visade bladet, och `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Shift + Z` (Mac) gör om den senast ångrade.
- Knapparna `Undo` och `Redo` i verktygsfältet gör samma sak och lyser bara upp när det visade bladet har en redigering att ångra eller göra om. Ett tryck på dem lämnar tangentbordsfokus där det var, i rutnätet eller i sökfältet. Fliken har ingen `Time Travel`.
- På `Checks`, där ingenting redigeras, förblir knapparna släckta, och varken de eller tangenterna gör något.
- När en cell redigeras, eller textmarkören står i flikens sökfält, används tangenterna i stället till att ångra och göra om det du skriver där.

Historikerna blandas aldrig. Ångra på ERD-fliken tar aldrig tillbaka en redigering på ett blad, och Ångra på ett blad tar aldrig tillbaka en redigering på ett annat blad eller i diagrammet. Varje blad behåller sin historik medan du byter blad eller flik.

Vart och ett av följande är ett steg i sitt blads historik:

- En cellredigering, som registreras en gång när den skrivs i stället för per skrivet tecken, och bara när den ändrar värdet – se [Redigera celler](./dictionary.md#editing-cells).
- En inklistring, inklusive de rader den lägger till, och att rensa de markerade cellerna med `Delete` eller `Backspace` – se [Kopiera och klistra in](./dictionary.md#copying-and-pasting).
- `Add Row` och varje infogning eller borttagning av rader, från listen, rutnätets meny eller tangenterna, oavsett hur många rader den omfattar – se [Lägga till och ta bort rader](./dictionary.md#adding-and-deleting-rows).
- En terms domän som väljs i dess lista, inklusive `None` – se [En terms domän](./dictionary.md#a-terms-domain).
- En sortering – se [Sortera](./dictionary.md#sorting).
- En enda CSV-fil som importeras med `Import CSV`, oavsett hur många rader den lägger till eller uppdaterar. Det är ett steg i historiken för det blad som filen fyller, vilket fliken sedan visar, oavsett vilket blad du importerade den från – se [Importera](./dictionary.md#importing).

En skrivning som inte ändrar något, till exempel samma fil importerad igen eller en sortering av ett blad som redan har den ordningen, registrerar inget steg, och det gör inte heller en som nekas med meddelandet `Nothing saved: …`. När en term utan `Physical Name` får ett namn ingår det fysiska namn som dess ord bildar i den redigeringens steg.

En domäns nya `Data Type` är ett steg på bladet `Domains`, tillsammans med de typer som den ger kolumnerna som är kopplade till domänen och de typer som Synkronisera datatyp i relationer för vidare från dem – se [Domäner och datatyper](./dictionary.md#domains-and-data-types).  
Att ångra eller göra om det ändrar typen på de kolumner som är kopplade till domänen i det ögonblicket, så en kolumn som du sedan dess har kopplat till en annan domän eller gett en annan typ behåller sin typ. En kolumn som steget kopplade från, till exempel en sekundärnyckel med en egen domän som synkroniseringen kopplade från, kopplas igen bara medan den fortfarande är okopplad och fortfarande har den typ som steget lämnade den med.

En editor med `readonly` döljer knapparna, och tangenterna varken ångrar eller gör om något.  
Ändringar från medarbetare och kodagenter registreras inte heller i ett blads historik.

Varje blads historik töms när ordlistorna ersätts: av en `Import` av en JSON-fil, din eller en medarbetares, när den ångras eller görs om och när ett annat diagram läses in i editorn. En `Import` av Schema SQL, GraphQL, DBML eller AML behåller ordlistorna, och med dem varje blads historik, även när den ångras eller görs om.

## Tidsresa {#time-travel}

Tidsresan öppnas med knappen `Time Travel` i verktygsfältet, bredvid Ångra och Gör om på ERD-fliken.  
Knappen gör ingenting förrän diagrammets historik har minst en registrerad ändring.

Tidsresan öppnar en separat, skrivskyddad kopia av diagrammet, med den rullningsposition, zoomnivå och [namnvisning](./logical-names.md#name-view) som arbetsytan visar, oavsett om låset `Viewport` eller `Name View` är på eller inte.  
Den stegar bara igenom diagrammets historik, så redigeringarna på bladen på fliken Ordlista finns inte bland dess punkter.  
Dra i skjutreglaget, eller klicka var som helst på dess spår, för att gå igenom hela redigeringshistoriken och förhandsgranska varje punkt. Skjutreglagets position längst till vänster är tillståndet ett steg före den första registrerade ändringen, och det öppnas med reglaget på det aktuella tillståndet.  
Förhandsgranskningen är passiv: den ritar en minikarta, men du kan inte panorera, rulla eller redigera den, och det verkliga dokumentet förblir orört tills du tillämpar.

Tryck på `Apply` för att återställa den valda punkten, eller på `Cancel` eller `Esc` för att lämna dokumentet oförändrat.

![Tidsresan öppnas, skjutreglaget dras bakåt genom sessionen och en tidigare punkt tillämpas](/img/demo-time-travel.webp)
