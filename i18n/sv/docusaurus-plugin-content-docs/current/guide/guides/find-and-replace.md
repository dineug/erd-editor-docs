---
sidebar_position: 9
description: Sök i tabell-, kolumn-, index- och tabellgruppsnamn, kommentarer och anteckningar högst upp i utforskaren, stega igenom träffarna i dess träd och på arbetsytan och ersätt en träff eller alla.
---

# Sök och ersätt

Söker efter text i hela diagrammet, tar dig till varje träff på ERD-arbetsytan och ersätter en träff eller alla.  
Funktionen söker i sju texttyper: tabellnamn, tabellkommentarer, kolumnnamn, kolumnkommentarer, anteckningar, indexnamn och tabellgruppsnamn – se [Vad som söks](#what-it-searches).

Den ligger högst upp i [utforskaren](./explorer.md), panelen som är dockad till vänster om ERD-arbetsytan, mellan utforskarens namnlist och dess träd. Den har ingen egen rubrik. Uppifrån och ned innehåller den:

- Sökfältet, med de tre [alternativen](#options) inne i fältet vid dess slut, och pilen `Toggle Replace` framför det.
- Raden `Replace`, som är ihopfälld från början – se [Ersätta](#replacing).
- Räknaren, sedan upp- och nedpilarna som stegar igenom träffarna och knappen `Search In` med tre punkter.
- [Texttyperna](#what-it-searches), som `Search In` fäller ut.

Medan sökfältet innehåller text visar utforskarens träd träffarna – se [Resultaten](#the-results).  
Sökdelen behåller sin fulla höjd på en låg arbetsyta, och trädet under den tar det utrymme som blir kvar och rullar.

![Sök och ersätt öppnas i utforskaren med ⌘ + F, de sex träffarna på member stegas igenom och sedan, med Preserve Case på, ersätts alla sex med user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Öppna och stänga {#opening-and-closing}

`Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) och `Toggle Explorer` i [snabbsökningen](./quick-search.md) eller i arbetsytans snabbmeny öppnar sökningen i utforskaren. Textmarkören hamnar i sökfältet med dess text markerad, och sökfrågan söks på nytt utan någon aktuell träff.  
Knappen `Explorer` i verktygsfältet öppnar eller stänger bara panelen. Den placerar inte textmarkören i sökfältet, och den lämnar sökfrågan och den aktuella träffen som de var.  
När tangenten bara för tillbaka textmarkören till en utforskare som redan visas, som den gör medan snabbsökningen eller en av de fem dialogrutorna i [Dialogrutor bredvid utforskaren](./explorer.md#dialogs-beside-it) är öppen, förblir den aktuella träffen aktuell.

Hur du stänger utforskaren, vad tangenten och de två posterna `Toggle Explorer` gör medan den är öppen och vilka dialogrutor de stänger beskrivs i [Öppna och stänga](./explorer.md#opening-and-closing) på sidan om utforskaren.  
[När den viker undan](./explorer.md#when-it-stands-aside) beskriver hur en annan flik och zenläget döljer den och hur diff-visaren, tidsresan och förhandsgranskningen av automatisk layout döljer den och hindrar den från att öppnas. [Bredvid arbetsytan](./explorer.md#beside-the-canvas) beskriver en editor som är för smal för den.

Vid återöppning behålls den senaste sökfrågan, tillsammans med ersättningstexten, [alternativen](#options), de [texttyper](#what-it-searches) som var på och om raden `Replace` och texttyperna var utfällda.  
De behålls medan editorn är öppen och sparas inte i dokumentet. En nyöppnad editor startar med alla alternativ av, raden `Replace` och texttyperna ihopfällda och bara de fyra namntyperna på – se [Vad som söks](#what-it-searches).

## Webbläsarens sökruta {#the-browsers-find-bar}

Medan editorn har tangentbordsfokus tillhör `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) editorn på varje flik, även i dess egna textfält, så webbläsarens sökruta öppnas inte.  
Tangenten går vidare till webbläsaren eller värdprogrammet medan diff-visaren, tidsresan eller förhandsgranskningen av automatisk layout är öppen och medan fokus ligger utanför editorn.

- Webbapp och Google Drive: webbläsarens sökruta öppnas bara i de två fallen.
- VS Code: tillägget håller den inbyggda sökwidgeten i VS Code avstängd i ERD Editor, så tangenten öppnar aldrig någon sådan där.
- Obsidian: tangenten når editorn alltid när diagrammets flik är aktiv, i stället för `Search current file` i Obsidian.
- JetBrains-IDE: om tangentmappningen i IDE:n behåller `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) för eget bruk, öppna sökningen med `Toggle Explorer` i snabbsökningen eller i arbetsytans snabbmeny, eller öppna utforskaren med knappen `Explorer` i verktygsfältet och klicka i sökfältet.

En sida som bäddar in editorn kan flytta eller ta bort tangenten – se [Ändra kortkommandot](#changing-the-shortcut).

## Vad som söks {#what-it-searches}

Sju knappar väljer vilka texttyper som söks, i den här ordningen: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names` och `Table group names`.  
De är ihopfällda från början. Knappen `Search In` i slutet av räknarens rad fäller ut dem under den raden och fäller ihop dem igen, och den är framhävd medan de visas.  
En framhävd typknapp är på. Klicka på en för att slå på eller slå av den, så körs sökningen på nytt. När alla sju är av hittas ingenting.

Sökningen öppnas först med de fyra namntyperna, `Table names`, `Column names`, `Index names` och `Table group names`, så ett namnbyte når inte kommentarer och anteckningar om du inte slår på dem.  
Indexnamn är namnen på indexen på fliken `Indexes` i panelen [Tabellegenskaper](./table-related-functions.md#indexes), inte nycklarna `PK_` och `UQ_` som listas ovanför dem.

Ingenting annat söks: inte datatyper, standardvärden, kolumnerna i ett index, databasnamnet, [Schema SQL](./schema-sql.md) med dess skript `Before tables` och `After tables` eller genererad kod.  
En kommentar som döljs av ett [visningsalternativ för tabeller](./table-related-functions.md#table-view-options) söks ändå. Anteckningar som döljs med View Option → `Memos` och [tabellgrupper](./table-groups.md#hiding-groups) som döljs med View Option → `Table Groups` söks inte, inte ens när deras knapp är på, så `Replace All` skriver aldrig om en anteckning eller byter namn på en grupp som du inte kan se.

## Alternativ {#options}

Tre växlingsknappar inne i sökfältet, vid dess slut, ändrar hur sökfrågan matchar. De namnges i sina knappbeskrivningar och är framhävda medan de är på. Alla tre är av från början, och om du ändrar en körs sökningen på nytt.

- `Match Case`: när den är av ignorerar matchningen skiftläge.
- `Match Whole Word`: en träff räknas bara där den inte fortsätter in i ett ord på någon av sidorna. Bokstäver, siffror och diakritiska tecken i alla skriftsystem räknas som ordtecken, och det gör även understrecket. `user` matchar därför i `user id` och `user.id`, men inte inuti `users`, `user_id` eller `superuser`. En ände av sökfrågan som inte själv är ett ordtecken, som punkten i `.id`, behöver ingen ordgräns där.
- `Use Regular Expression`: sökfrågan är ett reguljärt uttryck i JavaScript, alltid i Unicode-läge, så `\p{L}` fungerar. `^` och `$` matchar i början och slutet av varje rad i en kommentar eller anteckning med flera rader, och `.` matchar inte över en radbrytning. Escape-sekvenser som ofta skrivs i namn, som `\_` och `\-`, accepteras.

Ett reguljärt uttryck som inte går att tolka, som `user(`, hittar ingenting: räknaren visar `Invalid regular expression` i rött, och sökfältet får en röd kontur.  
`Match Case` och `Match Whole Word` gäller även för ett reguljärt uttryck. En träff utan längd, som `^` ensamt, listas aldrig.

Vanlig text söks medan du skriver. Ett reguljärt uttryck söks när du gör en paus i skrivandet, eller direkt när du trycker på `Enter`, en navigeringsknapp, `Replace` eller `Replace All` eller väljer en rad som innehåller en träff.  
Sökningen har ingen tidsgräns, så ett reguljärt uttryck med mycket backtracking kan göra att editorn slutar svara tills sökningen är klar.

En fjärde växlingsknapp, `Preserve Case`, sitter inne i fältet `Replace` vid dess slut, så den visas bara medan raden `Replace` är utfälld. Den är av från början. Den ändrar inte vad som hittas, bara hur `Replace` och `Replace All` skriver ersättningen – se [Ersätta](#replacing). Att slå på eller slå av den startar ingen sökning, och den aktuella träffen förblir aktuell.

## Resultaten {#the-results}

Räknaren, i början av raden under fälten, visar var du är. Den är tom medan sökfältet är tomt.

| Räknare | När |
| --- | --- |
| `No results` | Ingenting matchar. |
| `12 matches` | Innan du går till någon av dem; `1 match` för en enda. |
| `3 of 12` | Den tredje träffen är aktuell. |
| `Invalid regular expression` | Det reguljära uttrycket går inte att tolka. |
| `Replaced 12 matches` | `Replace All` ändrade så många träffar; `Replaced 1 match` för en enda. |
| `No changes` | `Replace All` ändrade ingenting. |
| `No more matches` | En serie med `Replace` har kommit tillbaka dit den började – se [Ersätta](#replacing). |

`Replaced …`, `No changes` och `No more matches` ersätts av räknaren vid nästa sökning eller förflyttning, även den sökning som en redigering eller en ångring startar.

Medan sökfältet innehåller text visar utforskarens [träd](./explorer.md#the-tree) resultaten i stället för hela diagrammet: bara de rader som innehåller en träff och raderna ovanför dem. När ingenting matchar, eller när det reguljära uttrycket inte går att tolka, är det tomt. Om du tar bort sökfrågan kommer hela trädet tillbaka, ihopfällt som det var tidigare.

- `Tables`, `Table Groups` och `Memos` visas bara när de innehåller en träff, och siffran vid varje mapp anger antalet rader direkt under den i resultaten.
- Under `Tables` kommer de tabeller som innehåller en träff, i namnordning. Under varje tabell kommer en rad för varje träff i dess kommentar, sedan en mapp `Columns` med de kolumner som innehåller en träff, i kolumnordning, var och en med en rad för varje träff i dess kommentar, och sedan en mapp `Indexes` med de index vars namn matchar. Det finns ingen mapp `Foreign Keys`.
- Under `Table Groups` kommer de grupper vars namn matchar, i namnordning, utan sina tabeller. En tabell som hittas visas under `Tables`.
- Under `Memos` kommer de anteckningar som innehåller en träff, i dokumentordning, var och en visad med sin första rad och med en rad för varje träff i den.

En träff i ett namn framhävs på namnets egen rad, så ett namn som innehåller sökfrågan två gånger blir en rad med två framhävningar.  
En träff i en kommentar eller en anteckning har en egen rad: en pratbubbla för en tabell- eller kolumnkommentar eller en klisterlapp för en anteckning, sedan ett utdrag ur texten med träffen framhävd. En lång text kortas av med `…`, och radbrytningar visas som blanksteg. Håll pekaren över raden för att se hela texten.  
Alla andra rader ser ut som de gör utanför en sökning: en kolumn visar sin datatyp, ett index sina kolumner och ett tomt namn visas som `unnamed`.

Varje rad med rader under sig visas utfälld när en sökning startar. En rad som du fäller ihop, eller som `Collapse All` fäller ihop, förblir ihopfälld tills en träff under den blir aktuell, eller tills sökfrågan, `Match Case`, `Match Whole Word`, `Use Regular Expression` eller en texttyp ändras, eller tills sökningen öppnas igen med tangenten eller en av posterna `Toggle Explorer`.  
Den aktuella träffens rad framhävs och rullas in i vyn. Trädet listar varje träff, hur många de än är.  
Träffarna stegas igenom i trädets ordning: tabell för tabell, tabellens namn, dess kommentar, namn och kommentar för var och en av dess kolumner i kolumnordning och dess indexnamn; sedan tabellgruppsnamnen; sedan anteckningarna.

Resultaten följer dokumentet medan utforskaren visas. När redigeringarna gör en paus leder varje ändring av de genomsökta texterna till en ny sökning, och den aktuella träffen förblir aktuell om den fortfarande finns kvar. Det omfattar ett namn, en kommentar eller en anteckningstext som redigeras, en tabell, en kolumn, ett index, en anteckning eller en tabellgrupp som läggs till eller tas bort, en kolumn som flyttas och anteckningar eller tabellgrupper som döljs eller visas med View Option, vilket tar bort deras träffar från trädet eller för tillbaka dem. En redigering på arbetsytan, ett ångrat eller omgjort steg, en import och en redigering av en medarbetare eller en kodagent räknas alla. Markering, förflyttning av tabeller, anteckningar eller grupper på arbetsytan, rullning, zoomning och hovring räknas inte.  
Redigeringar som görs medan utforskaren är stängd eller inte syns söks igenom så snart den visas igen.

## Gå till en träff {#going-to-a-match}

`Enter` i sökfältet går till nästa träff och `Shift + Enter` till föregående. Pilknapparna upp och ned efter räknaren gör samma sak; deras knappbeskrivningar visar `Previous Match (Shift+Enter)` och `Next Match (Enter)`, och de är inaktiverade medan det inte finns någon träff.  
Förflyttningen går runt vid båda ändarna. Ingen träff är aktuell förrän du flyttar dig första gången, så det första `Enter` går till den första träffen och det första `Shift + Enter` till den sista.

Ett klick på en rad i resultaten, eller `Enter` eller `Space` när raden har tangentbordsfokus, gör något av följande:

- En rad vars eget namn innehåller en träff går till namnets första träff.
- En rad som visar ett utdrag ur en kommentar eller anteckning går till den träffen.
- Varje annan rad, som en tabell vars namn inte matchar eller en antecknings egen rad, går till det som raden står för och lämnar den aktuella träffen som den är – se [Gå till en rad](./explorer.md#going-to-a-row).
- En mapp fälls ihop eller ut.

Varje gång en träff blir aktuell fäller trädet ut alla ihopfällda rader ovanför den och flyttar tangentbordsfokus till dess rad, så piltangenterna i trädet fortsätter därifrån.

Att gå till en träff stänger panelen Tabellegenskaper om den är öppen, och sedan:

- För ett tabellnamn eller en tabellkommentar, eller ett kolumnnamn eller en kolumnkommentar, markeras bara tabellen, den läggs överst och den fokuserade cellen hamnar på cellen som innehåller träffen. En träff i en kommentar som döljs av ett [visningsalternativ för tabeller](./table-related-functions.md#table-view-options) placerar i stället den fokuserade cellen på namnet bredvid den.
- För ett indexnamn markeras bara indexets tabell och läggs överst, och den fokuserade cellen hamnar på tabellens namn om den inte redan finns i den tabellen. Indexnamn ritas inte på arbetsytan.
- För ett tabellgruppsnamn markeras bara gruppen och läggs överst med sina tabeller.
- För en anteckning markeras bara anteckningen och läggs överst.

Arbetsytan rullar bara när det du går till inte redan syns väl, och zoomen ändras aldrig – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands).

Efter `Enter` i sökfältet stannar textmarkören där, och efter att en rad har valts stannar tangentbordsfokus i trädet, så det du skriver härnäst når inte den markerade tabellen.  
Att gå till en träff startar eller avslutar aldrig en relation som håller på att ritas.

## Ersätta {#replacing}

Raden `Replace` är ihopfälld från början. Pilen framför sökfältet, med knappbeskrivningen `Toggle Replace`, fäller ut och fäller ihop den. När du fäller ihop den behålls ersättningstexten.  
Raden innehåller fältet `Replace`, med växlingsknappen `Preserve Case` inne i fältet vid dess slut, och två knappar med knappbeskrivningarna `Replace (Enter)` och `Replace All`. Båda knapparna är inaktiverade medan det inte finns någon träff.

`Replace` körs med `Enter` i ersättningsfältet, med eller utan `Shift`, eller med sin knapp:

- Om ingen träff är aktuell går det första trycket bara till nästa träff, så att du ser vad det skulle ändra innan något ändras.
- Om en träff är aktuell ersätter trycket just den förekomsten, lämnar andra förekomster i samma text kvar och går vidare till nästa träff efter texten som det skrev. Det som skrevs hoppas över även när det innehåller sökfrågan: om `user` ersätts med `super_user` stannar `Replace` sedan inte inuti `super_user`.
- En träff som ersättningen skulle skriva tillbaka exakt som den var lämnas som den är, och trycket går bara vidare till nästa träff.
- Ersättningen och rullningen till nästa träff är ett steg i ångrahistoriken.

En serie tryck på `Replace` stannar när den har kommit runt tillbaka dit den började. Räknaren visar `No more matches`, ingen träff är aktuell och fler tryck ersätter ingenting.  
`Customer` som ersätts med `Big Customer` ersätts därför en gång, i stället för att växa till `Big Big Customer`.  
Att gå till en träff, att ändra sökfrågan, `Match Case`, `Match Whole Word`, `Use Regular Expression` eller en texttyp, att öppna sökningen med tangenten eller en av posterna `Toggle Explorer` eller att köra `Replace All` startar en ny serie, och det gör även en ångring eller någon annan redigering som ändrar texten som serien började i. Att ändra ersättningstexten eller `Preserve Case` gör det inte, och det gör inte heller tangenten när den bara för tillbaka textmarkören till en utforskare som redan visas.  
Medan en serie pågår behåller en tabell eller tabellgrupp som serien byter namn på sin plats i trädet och i träffarnas ordning, så ett namnbyte som skulle sortera den längre fram påträffas inte igen. Nästa serie återställer trädet till namnordning, och den omdöpta raden flyttas till sin nya plats.

`Replace All` körs med `Ctrl + Enter` (Windows/Linux) eller `⌘ + Enter` (Mac) i ersättningsfältet, eller med sin knapp:

- Den ersätter varje träff i de texttyper som är på och lämnar de andra typerna orörda. Med standardtyperna byter den namn på tabeller, kolumner, index och tabellgrupper, och kommentarer och anteckningar förblir oförändrade.
- Allt den ändrar ångras i ett steg – se [En gest, ett steg](./undo-redo.md#one-gesture-one-step).
- Räknaren visar `Replaced N matches` och räknar bara de förekomster vars text faktiskt ändrades. När ingen ändrades visar den `No changes` och ingenting registreras i historiken, som när det reguljära uttrycket `(user)` ersätts med `$1`.
- Resultaten söks sedan på nytt utan någon aktuell träff, så de kan lista träffar som den nya texten innehåller.

Båda läser varje text som den är när du trycker, inte som den senaste sökningen hittade den.

Så används ersättningstexten:

- Utan `Use Regular Expression` har `$` ingen särskild betydelse, och ersättningstexten används som den skrevs, bortsett från det skiftläge som `Preserve Case` ger den.
- Med `Use Regular Expression` expanderas `$1` till och med `$99`, `$<name>`, `$&`, `` $` ``, `$'` och `$$` som de gör i `String.prototype.replace` i JavaScript.
- Utan `Preserve Case` förs skiftläget i den matchade texten inte över: med `Match Case` av gör en ersättning av `user` med `member` att `Users` blir `members`.
- Med `Preserve Case` får varje ersättning skiftläge efter texten den ersätter, efter att `$1` och de övriga har expanderats, så samma ersättning gör `Users` till `Members`:
  - En träff med bara versaler får ersättningen med bara versaler, och en träff med bara gemener får den med bara gemener: `USER` med `account` ger `ACCOUNT`, och `user` med `Account` ger `account`.
  - Varje annan träff ger ersättningens första tecken samma skiftläge som träffens första tecken och lämnar resten som det skrevs: `UserId` med `accountKey` ger `AccountKey`, och `uSER` med `AccountKey` ger `accountKey`. När träffens första tecken saknar skiftläge lämnas ersättningen som den skrevs: `_Ab` med `xyz` ger `xyz`.
  - När både träffen och ersättningen innehåller `-`, eller båda innehåller `_`, och den avgränsaren delar dem i lika många delar, får varje del skiftläge efter motsvarande del: `USER_id` med `account_key` ger `ACCOUNT_key`, och `User-Name` med `account-key` ger `Account-Key`. När både `-` och `_` delar dem på det sättet får helheten skiftläge som en enda del.
  - En träff utan bokstäver med skiftläge, som `123`, lämnar ersättningen som den skrevs.
  - En träff som skrivs tillbaka som den var räknas inte: med `Match Case` av skriver en ersättning av `customer` med `Customer` tillbaka `customer`, `Customer` och `CUSTOMER` som de var, och ingen av dem räknas.
- Ett tomt ersättningsfält tar bort träffen.

En ersättning är en vanlig redigering, samma sak som att själv skriva det nya tabellnamnet, kommentaren, kolumnnamnet eller anteckningstexten, att byta namn på indexet i panelen Tabellegenskaper eller att byta namn på tabellgruppen.  
Den registreras i historiken och når medarbetare och en kodagent som vilken annan redigering som helst.

## Tangenter i sökfälten {#keys-in-the-search-fields}

- I sökfältet går `Enter` till nästa träff och `Shift + Enter` till föregående.
- I ersättningsfältet ersätter `Enter`, med eller utan `Shift`, och `Ctrl + Enter` (Windows/Linux) eller `⌘ + Enter` (Mac) ersätter alla.
- Medan en inmatningsmetod sätter samman tecken i något av fälten tillhör `Enter` teckensammansättningen och varken flyttar eller ersätter.

Vad `Escape`, de kortkommandon i editorn som fortfarande fungerar och alla andra tangenter gör i de här fälten beskrivs i [Tangenter i utforskaren](./explorer.md#keys-in-the-explorer).

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) används sökningen bara för att hitta. Det finns ingen pil `Toggle Replace` och ingen rad `Replace`, och därför inget ersättningsfält, `Preserve Case`, `Replace` eller `Replace All`.  
Sökfältet, dess tre alternativ, texttyperna, räknaren, resultaten och att gå till en träff fungerar alla. Utforskaren runt den fungerar som i vilken annan editor som helst – se [Skrivskyddade editorer](./explorer.md#read-only-editors).

I VS Code öppnas en revision av ett diagram, som en Git-revision eller en post i Local History, som JSON-text. När den öppnas igen som diagram med `Reopen Editor With...` är den skrivskyddad och får den här sökningen som bara hittar.

## Ändra kortkommandot {#changing-the-shortcut}

En sida som bäddar in editorn kan binda om `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac), eller ta bort kortkommandot, under namnet `findReplace` med [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
När kortkommandot är borttaget går tangenten vidare till sidan på varje flik. Knappen `Explorer` i verktygsfältet öppnar och stänger fortfarande utforskaren, och `Toggle Explorer` i snabbsökningen och i arbetsytans snabbmeny öppnar fortfarande sökningen eller stänger utforskaren, men ingen av dem visar något kortkommando, så knappbeskrivningen för knappen visar bara `Explorer`. Raden `Toggle Explorer` på fliken [Kortkommandon](./settings.md#shortcuts) i Inställningar visar inte heller någon tangent. Efter en ombindning visar alla den nya tangenten.
