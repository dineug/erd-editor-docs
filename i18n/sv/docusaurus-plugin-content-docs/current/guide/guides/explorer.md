---
sidebar_position: 9
description: Bläddra bland diagrammets tabeller med deras kolumner, index och sekundärnycklar, dess tabellgrupper och dess anteckningar i ett träd som är dockat bredvid ERD-arbetsytan, och gå till vilket av dem som helst med ett klick.
---

# Utforskaren

Utforskaren är en panel, dockad vid ERD-arbetsytans vänsterkant, som listar diagrammet som ett träd: dess tabeller, var och en med sina kolumner, index och sekundärnycklar, sedan dess [tabellgrupper](./table-groups.md) och sedan dess anteckningar. Klicka på en rad för att gå till det den representerar på arbetsytan.  
Utforskaren gör arbetsytan smalare i stället för att täcka den. Den är en del av diagrameditorn, inte vyn Explorer i VS Code eller filutforskaren i Obsidian.

![Utforskaren öppnas från verktygsfältet, används för att gå till products och sedan till kolumnen status och sekundärnyckeln member_id i orders, fälls ihop med Collapse All, görs bredare och stängs](/img/demo-explorer.webp)

[Sök och ersätt](./find-and-replace.md) ligger högst upp i den, mellan dess namnlist och trädet. Medan sökfältet innehåller text visar trädet bara det som matchar – se [Resultaten](./find-and-replace.md#the-results).  
Själva trädet ändrar aldrig diagrammet: det går inte att byta namn på, dra, ta bort eller visa och dölja något i det. En ersättning är den enda redigering som panelen gör.

Utforskarens eget tillstånd är bara ditt: om den är öppen, dess bredd, vad som är ihopfällt, raden där tangentbordsfokus står, dess rullningsläge och sökningen.  
Inget av det sparas i filen, registreras i ångrahistoriken, delas med medarbetare eller lagras i webbläsaren. Det behålls så länge editorn är öppen, vid flikbyten och mellan dokument som läses in i samma editor. En nyöppnad editor startar med utforskaren stängd.

## Öppna och stänga {#opening-and-closing}

Öppna den på något av följande sätt:

- Knappen `Explorer` i verktygsfältet, direkt efter `Search`, med en trädikon. Dess knappbeskrivning visar `Explorer (Ctrl + F)` (Windows/Linux) eller `Explorer (⌘ + F)` (Mac).
- `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac), med namnet `Toggle Explorer` på fliken [Kortkommandon](./settings.md#shortcuts) i Inställningar.
- `Toggle Explorer` i [snabbsökningen](./quick-search.md), listad på varje flik. Om du skriver `find`, `replace`, `rename`, `tree`, `outline` eller `objects` visas posten.
- `Toggle Explorer` i arbetsytans snabbmeny: högerklicka på en tom plats på ERD-arbetsytan, utanför alla [tabellgrupper](./table-groups.md). Det ligger efter `New Table`, `New Memo` och `New Table Group`, före `Relationship`.

De två posterna `Toggle Explorer` visar kortkommandot till höger.  
Knappen i verktygsfältet, kortkommandot och posten i snabbsökningen fungerar från varje flik. Från fliken Visualisering, Schema SQL, Kodgenerator, Ordlista eller Inställningar växlar de först till ERD-fliken, eftersom utforskaren bara visas där.

Knappen i verktygsfältet öppnar och stänger bara panelen. Den placerar inte textmarkören i sökfältet, och den lämnar panelen Tabellegenskaper, temaverktyget och väljaren `Display Language` öppna.  
Kortkommandot och de två posterna `Toggle Explorer` öppnar utforskaren med fokus på sökningen: textmarkören hamnar i sökfältet med dess text markerad, och en öppen dialogruta av de fem i [Dialogrutor bredvid utforskaren](#dialogs-beside-it) stängs. Vad sökningen behåller mellan öppningarna står i [Öppna och stänga](./find-and-replace.md#opening-and-closing) i Sök och ersätt.  
Kortkommandot gör ingenting medan en tabellcell, en anteckning eller en tabellgrupps namn redigeras, eller medan en cellredigering är öppen på fliken [Ordlista](./dictionary.md#keys-on-the-tab), även en terms domänlista.

Knappen i verktygsfältet ser intryckt ut medan utforskaren är öppen på ERD-fliken och inte dold av [zenläget](#when-it-stands-aside). Så länge den gör det stänger knappen, kortkommandot och endera posten `Toggle Explorer` utforskaren, och om tangentbordsfokus var i panelen går det tillbaka till editorn.  
Kortkommandot stänger den aldrig medan snabbsökningen eller någon av de fem dialogrutorna är öppen. I stället stänger det paletten eller dialogrutan och flyttar tangentbordsfokus till sökfältet, med dess text markerad och, om utforskaren redan visades, med den aktuella träffen kvar. Posten `Toggle Explorer` i snabbsökningen gör inget sådant undantag: om du kör den stängs paletten och sedan en öppen utforskare.

Knappen `x` i namnlisten, vars knappbeskrivning visar `Close`, stänger också utforskaren och ger tangentbordsfokus till arbetsytan. `Escape` stänger den inte – se [Tangenter i utforskaren](#keys-in-the-explorer).  
När utforskaren öppnas igen kommer den tillbaka med samma bredd, med trädet ihopfällt och rullat som förut och med samma sökfråga. Om den öppnas med kortkommandot eller en post `Toggle Explorer` söker den på den sökfrågan igen med alla resultat utfällda – se [Resultaten](./find-and-replace.md#the-results).

När kortkommandot eller en post `Toggle Explorer` öppnar utforskaren i en editor som är för smal för den visas meddelandet `Widen the window to show the Explorer`, och tangentbordsfokus stannar där det var – se [Bredvid arbetsytan](#beside-the-canvas).  
Utforskaren är ändå öppen, med knappen i verktygsfältet intryckt, och visas, med sökningen redan gjord, så snart editorn är tillräckligt bred, utan att ta tangentbordsfokus. Om du öppnar den med knappen i verktygsfältet visas inget meddelande.

## Bredvid arbetsytan {#beside-the-canvas}

Utforskaren löper längs ERD-flikens vänsterkant, under verktygsfältet, över arbetsytans hela höjd.  
Arbetsytan blir smalare för att ge plats åt den, så ingen del av diagrammet ligger under panelen, och [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar), minikartan och [välkomstskärmen](./editing-start.md#welcome-screen) ligger alla på arbetsytan bredvid den.  
Att öppna, stänga eller ändra storlek på utforskaren rullar inte diagrammet och registrerar ingenting i [ångrahistoriken](./undo-redo.md#what-the-history-records).

I en nyöppnad editor är den `260px` bred från början. Dra i dess högerkant för att ställa in bredden till valfritt värde från `200px` till `480px`, eller dubbelklicka på kanten för att gå tillbaka till `260px`.

Arbetsytan behåller alltid minst `320px` bredvid utforskaren:

- I en editor som är smalare än utforskarens bredd plus `320px` ritas utforskaren smalare så att den får plats, ned till `200px`.
- I en editor som är smalare än `520px` viker den undan. Den ritas inte, men den förblir öppen, så knappen i verktygsfältet ser fortfarande intryckt ut och ett tryck stänger den. Så snart editorn är tillräckligt bred kommer den tillbaka med sin egen bredd.

Det som räknas är bredden på själva editorn, inte på webbläsarfönstret, även om meddelandet i [Öppna och stänga](#opening-and-closing) talar om fönstret.

I ett [visningsspråk som skrivs från höger till vänster](./language-and-theme.md#right-to-left-languages) stannar utforskaren till vänster om arbetsytan, eftersom arbetsytan aldrig speglas.  
Dess innehåll läses från höger till vänster: namnlisten, sökningen och raderna speglas, och raderna dras in från höger. Kanten som du drar i stannar på dess högra sida, mot arbetsytan. Datatyper, indexkolumner och sekundärnyckeltext behåller sin ordning från vänster till höger.

## När den viker undan {#when-it-stands-aside}

Utforskaren visas bara på ERD-fliken.  
Om du växlar till en annan flik döljs den, och knappen i verktygsfältet ser inte längre intryckt ut. Tillbaka på ERD-fliken visas den igen som du lämnade den, ihopfälld och rullad på samma sätt.

Medan [diff-visaren](./table-related-functions.md#diff-viewer), [tidsresan](./undo-redo.md#time-travel) eller förhandsgranskningen av [automatisk layout](./table-related-functions.md#auto-layout) är öppen kan ingenting öppna eller stänga utforskaren:

- En öppen utforskare döljs och visas igen när de stängs.
- Knappen i verktygsfältet är nedtonad och gör ingenting.
- Snabbsökningen utelämnar `Toggle Explorer`.
- Kortkommandot lämnas åt webbläsaren eller värdprogrammet – se [Webbläsarens sökruta](./find-and-replace.md#the-browsers-find-bar).

Diff-visaren listar sina ändringar i ett träd av samma slag – se [Diff-visaren](./table-related-functions.md#diff-viewer).

Om du slår på [zenläget](./table-related-functions.md#canvas-toolbar) med `Alt + Z` (Windows/Linux) eller `⌥ + Z` (Mac) döljs en öppen utforskare utan att stängas, och när du slår av zenläget kommer utforskaren tillbaka.  
I zenläget öppnar kortkommandot och de två posterna `Toggle Explorer` fortfarande utforskaren med fokus på sökningen, och zenläget förblir på. Utforskaren löper då över editorns hela höjd, eftersom det övre verktygsfältet är borta, och förblir synlig när zenläget slås av. Om du slår på zenläget igen döljs den igen.

Varje gång panelen försvinner med tangentbordsfokus i sig, oavsett om den stängs, döljs eller viker undan, går tangentbordsfokus tillbaka till editorn.

## Trädet {#the-tree}

Namnlisten visar `Explorer` och innehåller två knappar: `Collapse All` och knappen `x`, som stänger utforskaren. Under den finns sökningen – se [Sök och ersätt](./find-and-replace.md) – och under den trädet.

Den översta nivån innehåller tre mappar, i den här ordningen: `Tables`, `Table Groups` och `Memos`. Under varje tabell finns dess egna mappar `Columns`, `Indexes` och `Foreign Keys`.  
En mapp utan innehåll visas inte, så ett tomt diagram visar inga rader alls. `Table Groups` utelämnas också medan [View Option](./table-related-functions.md#table-view-options) → `Table Groups` döljer grupperna, och `Memos` medan View Option → `Memos` döljer anteckningarna.  
En mapprad visar en mappikon, sitt namn och längst ut antalet rader direkt under den, så antalet bredvid `Tables` är antalet tabeller i diagrammet. Antalet delar upp tusental så som visningsspråket gör, alltid med siffrorna 0 till 9, till exempel `1,234` på engelska och `1.234` på tyska.

Tabeller listas efter namn, utan hänsyn till skiftläge, och tabeller med samma namn behåller dokumentets ordning. Tabellgrupper listas på samma sätt, och likaså tabellerna under varje grupp. En tabells kolumner behåller tabellens egen ordning, och dess index, dess sekundärnycklar och anteckningarna behåller dokumentets.  
Trädet följer diagrammet när det ändras, oavsett om det sker genom en redigering på arbetsytan, ett ångrat eller omgjort steg, en import, en medarbetare eller en kodagent, så om du byter namn på en tabell flyttas dess rad.  
Ordningen följer namnet i varje [namnvisning](./logical-names.md#name-view), aldrig det logiska namnet. Ett byte av visning ger tabell- och kolumnraderna nya etiketter utan att flytta någon av dem, och det gör även ett logiskt namn som du ger en tabell eller kolumn i `Logical Names` eller `Both Names`. Ett fysiskt namn som [härleds](./dictionary.md#deriving-physical-names) från ett nytt logiskt namn är dock ett namnbyte som alla andra, så det kan flytta en tabells rad.

Varje typ av rad visar:

- En tabell: en tabellikon och dess namn.
- En kolumn: en nyckelikon för en primärnyckel- eller sekundärnyckelkolumn, färgad så som tabellens egen nyckelcell färgar en primärnyckel, en sekundärnyckel eller båda, och en listikon för alla andra kolumner. Sedan dess namn och, nedtonat, dess datatyp följd av `PK`, `FK` eller båda, som `id` `BIGINT PK` eller `user_id` `BIGINT FK`. Typen som visas är alltid kolumnens datatyp, aldrig dess [domän](./logical-names.md#the-domain-cell), oavsett namnvisning.
- Ett index: en indexikon och dess namn. Sedan, nedtonat, `UNIQUE` för ett unikt index och dess kolumner inom parentes i indexordning, med `DESC` efter en fallande kolumn, som `orders_user_idx` `UNIQUE (user_id DESC, total)`, eller bara `(total)`.
- En sekundärnyckel: listas bara under barntabellen, den som innehåller sekundärnyckelkolumnerna, och bara medan föräldratabellen finns i diagrammet. Dess nyckelikon får relationslinjens färg: färgen för primärnyckel och sekundärnyckel för en [identifierande relation](./relationship-editing.md#identifying-relationships), annars färgen för sekundärnyckel. Den visar barntabellens nyckelkolumner, kommaseparerade, sedan, nedtonat, `→` med föräldratabellen och dess kolumner, som `user_id` `→ users(id)`.
- En tabellgrupp: en punkt i gruppens färg, grå för en grupp utan färg, och dess namn. Dess tabeller listas under den efter namn, och var och en går till sin tabell. En grupp utan tabeller har inget att fälla ut.
- En anteckning: en klisterlappsikon och anteckningens första rad.

Tabellrader, tabellerna som listas under en grupp och kolumnrader följer namnvisningen – se [Utanför arbetsytan](./logical-names.md#beyond-the-canvas). I `Both Names` visar till exempel en kolumnrad `Total Amount` `total` `NUMERIC`: det logiska namnet och sedan namnet och datatypen, båda nedtonade.  
I varje visning visar index- och sekundärnyckelrader sina kolumner med namn, och en sekundärnyckelrad visar också sin föräldratabell med namn.  
Medan sökfältet innehåller text visar en rad som bara hittas i det namn som dess visning utelämnar också det namnet, nedtonat – se [Resultaten](./find-and-replace.md#the-results).

Ett tomt namn, eller en anteckning vars första rad är tom, visar `unnamed` i kursiv stil. I `Logical Names` och `Both Names` visar en tabell eller kolumn `unnamed` bara när även dess logiska namn är tomt.  
På en smal panel kortas den nedtonade texten av med `…` innan det namn som raden börjar med kortas av. Håll pekaren över ett namn eller dess nedtonade text för att se den i sin helhet.

Bara `Tables` är utfälld från början. Klicka på en mapprad, eller tryck på `Enter` eller `Space` på den, för att fälla ihop eller fälla ut den.  
Pilen i början av en rad fäller ihop eller fäller ut den raden utan att gå någonstans. Varje tabellrad har en, även en tabell som inte har något under sig. `→` och `←` fäller också ihop och ut – se [Tangenter i utforskaren](#keys-in-the-explorer).  
`Collapse All` fäller ihop en nivå per tryck: den djupaste nivån av utfällda rader som visas, så trycken fäller ihop nedifrån och upp. Det tryck som når den översta nivån fäller ihop alla rader, inklusive dem under en redan ihopfälld rad, så att bara mapparna på den översta nivån blir kvar.  
Redigeringar, ångra och göra om och ändringar från medarbetare eller en kodagent lämnar ihopfällningen som den är.

## Gå till en rad {#going-to-a-row}

Klicka på en rad, eller tryck på `Enter` eller `Space` medan tangentbordsfokus står på den, för att gå till det den representerar på ERD-arbetsytan. En mapprad fälls bara ihop eller ut, och piltangenterna flyttar bara inom trädet.

- En tabellrad, eller en tabell som listas under en grupp, markerar enbart den tabellen och lägger den överst. Om den fokuserade cellen inte redan finns i den tabellen flyttas den till den första cellen i tabellhuvudet: namnet, eller det logiska namnet i `Logical Names` och `Both Names`.
- En kolumnrad markerar enbart sin tabell och placerar den fokuserade cellen på kolumnens namn, eller i `Logical Names` på det logiska namnet som ritas i dess ställe.
- En indexrad markerar sin tabell, som en tabellrad gör. Själva indexet pekas inte ut; index redigeras i panelen [Tabellegenskaper](./table-related-functions.md#indexes).
- En sekundärnyckelrad visar relationens båda tabeller tillsammans i vyn, eller barntabellen när de två ligger för långt ifrån varandra för att visas tillsammans. Den markerar enbart barntabellen med dess sekundärnyckelkolumner, med den fokuserade cellen på den första av dem, och lyser upp relationslinjen – se [Läsa en relationslinje](./relationship-editing.md#reading-a-connector).
- En tabellgruppsrad visar gruppens ruta i vyn, med namnlisten som huvuddel, markerar enbart gruppen och lägger den överst tillsammans med dess tabeller.
- En anteckningsrad markerar enbart anteckningen och lägger den överst.

Vyn flyttas enligt den regel som alla hopp delar: zoomen ändras aldrig, och arbetsytan rullar bara när det du går till inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands).  
Att gå till en rad stänger först panelen Tabellegenskaper om den är öppen, och startar eller slutför aldrig ritningen av en relation.  
Medan sökfältet innehåller text går en rad vars namn eller logiska namn innehåller en träff, eller en rad som visar ett utdrag ur en kommentar eller anteckning, i stället till sin första träff – se [Gå till en träff](./find-and-replace.md#going-to-a-match).

Efter ett klick stannar tangentbordsfokus i trädet, så `Delete`, `Backspace` och de andra redigeringstangenterna når inte den nya markeringen förrän du trycker på `Escape` eller klickar på arbetsytan – se [Tangenter i utforskaren](#keys-in-the-explorer).

## Tangenter i utforskaren {#keys-in-the-explorer}

Trädet är ett enda stopp för `Tab` och hoppas över medan det inte har några rader.  
När du tabbar in i det hamnar du på raden där tangentbordsfokus senast stod, eller annars på den aktuella träffens rad eller på den första raden som syns helt, och den raden rullas in i vyn. Raden med tangentbordsfokus ritas som en rad under pekaren.

I trädet:

- `↑` och `↓` flyttar en rad och stannar vid den första och den sista raden i stället för att slå runt. `Home` och `End` går till den första och den sista raden.
- `→` fäller ut en ihopfälld rad eller flyttar in till en utfälld rads första underordnade rad. `←` fäller ihop en utfälld rad eller flyttar ut till dess överordnade rad. I ett visningsspråk som skrivs från höger till vänster byter de två plats.
- `Enter` och `Space` fungerar som ett klick: de går till raden eller fäller ihop eller ut en mapp – se [Gå till en rad](#going-to-a-row).
- Att skriva en bokstav hoppar inte till någon rad.

Ett tryck på `Escape` var som helst i utforskaren, i trädet, i sök- eller ersättningsfältet eller på en av dess knappar, ger tangentbordsfokus tillbaka till arbetsytan. Utforskaren förblir öppen och markeringen förblir som den är.  
Ett `Escape` som avslutar en teckensammansättning i en inmatningsmetod avslutar bara teckensammansättningen. `Escape` stänger aldrig utforskaren, oavsett om tangenten trycks i den eller på arbetsytan.

Några av editorns kortkommandon fungerar fortfarande medan tangentbordsfokus är i utforskaren – se [Kortkommandon](./settings.md#shortcuts):

- `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) fungerar som på arbetsytan: det stänger utforskaren, eller, medan panelen Tabellegenskaper är öppen bredvid den, stänger panelen Tabellegenskaper och placerar textmarkören i sökfältet – se [Öppna och stänga](#opening-and-closing).
- `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac) öppnar och stänger snabbsökningen.
- `Undo` och `Redo` ångrar och gör om i diagrammet i stället för i texten i ett fält.
- `Zoom In`, `Zoom Out` och `Zoom Reset` zoomar arbetsytan.

Alla andra kortkommandon i editorn stannar i utforskaren, och detsamma gäller piltangenterna, `Tab`, `Enter`, `Space`, `Home`, `End` och alla tangenter som trycks medan en inmatningsmetod sätter samman tecken.  
Ingen av dem når arbetsytan: `Delete` och `Backspace` tar aldrig bort markeringen, `Alt + N` (Windows/Linux) eller `⌥ + N` (Mac) lägger inte till någon tabell, och `T` och sedan `G` grupperar ingenting. I ett fält fungerar de som vanliga texttangenter: `Ctrl + A` (Windows/Linux) eller `⌘ + A` (Mac) markerar fältets text, `Delete` och `Backspace` raderar text och `Space` skriver ett blanksteg. `Tab` flyttar mellan utforskarens knappar, fält och träd.  
Tangenterna i själva sök- och ersättningsfälten beskrivs i [Tangenter i sökfälten](./find-and-replace.md#keys-in-the-search-fields).  
Tangenter som editorn inte binder, till exempel värdprogrammets egna tangenter för att spara eller för kommandopaletten, når värdprogrammet som vanligt.

## Dialogrutor bredvid utforskaren {#dialogs-beside-it}

Panelen [Tabellegenskaper](./table-related-functions.md#table-properties), [temaverktyget](./language-and-theme.md#theme), väljaren [`Display Language`](./language-and-theme.md#picking-a-language), dialogrutan [`Export image`](./file-import-export.md#image) och dialogrutan [Mappa kolumner](./relationship-editing.md#map-columns) lämnar utforskaren öppen när de öppnas.

- Panelen Tabellegenskaper öppnas mitt på arbetsytan bredvid utforskaren och tonar bara ned arbetsytan. Utforskaren förblir användbar: om du väljer en rad stängs panelen Tabellegenskaper, och sedan går du till raden.
- Dialogrutorna `Export image` och Mappa kolumner tonar ned hela editorn, inklusive verktygsfältet och utforskaren. Utforskaren förblir öppen under det nedtonade området, och ett klick där stänger dialogrutan, som ett klick var som helst på det nedtonade området gör; dialogrutan Mappa kolumner stängs då utan att något mappas.
- I ett visningsspråk som skrivs från vänster till höger öppnas temaverktyget och väljaren `Display Language` precis bredvid utforskaren i stället för över den, och de flyttar med om den öppnas eller stängs medan de visas. I ett språk som skrivs från höger till vänster behåller de sin plats till höger. Ett tryck i utforskaren stänger dem, liksom alla tryck utanför dem utom ett på verktygsfältet.

Om du öppnar sökningen med kortkommandot eller en post `Toggle Explorer` stängs alla fem, dialogrutan Mappa kolumner utan att något mappas.  
[Snabbsökningen](./quick-search.md) lämnar också utforskaren öppen, och `Escape` stänger då bara paletten.

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) fungerar utforskaren som i alla andra: knappen i verktygsfältet med samma knappbeskrivning, kortkommandot, båda posterna `Toggle Explorer`, trädet, ihopfällningen, `Collapse All` och att gå till en rad, som markerar det den går till som vanligt. Dess titel visar `Explorer` även där.  
Dess sökning hittar bara – se [Skrivskyddade editorer](./find-and-replace.md#read-only-editors) i Sök och ersätt.
