---
sidebar_position: 8
description: Öppna kommandopaletten för att byta flik eller namnvisning, köra ett kommando för den aktuella fliken, öppna eller stänga utforskaren, ändra tema eller visningsspråk eller gå till en tabell, kolumn, kommentar eller anteckning genom att skriva ett prefix.
---

# Snabbsökning

Snabbsökningen är editorns kommandopalett.  
Den listar de kommandon som finns på den flik du är på. Börja sökningen med `#`, `@` eller `:` för att i stället söka i diagrammet och gå till en tabell, en kolumn eller en kommentar eller anteckning.

Öppna den med `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac), eller klicka på `Search` i verktygsfältet.  
Samma kortkommando stänger den, liksom `Esc` och ett klick utanför panelen. När den öppnas stängs panelen Tabellegenskaper, [temaverktyget](./language-and-theme.md#theme), väljaren [`Display Language`](./language-and-theme.md#picking-a-language), dialogrutan [`Export image`](./file-import-export.md#image) och dialogrutan [Mappa kolumner](./relationship-editing.md#map-columns), varvid det du hade valt i den går förlorat. Den öppnas inte medan du redigerar en tabellcell, en anteckning, namnet på en tabellgrupp eller en cell på fliken [Ordlista](./dictionary.md).

Knappen direkt efter `Search` i verktygsfältet är `Explorer`. Den öppnar eller stänger [utforskaren](./explorer.md), ett träd över diagrammet som är dockat till vänster om arbetsytan, med Sök och ersätt högst upp.  
När paletten öppnas förblir utforskaren öppen, och `Esc` stänger då bara paletten. `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) i paletten stänger den och flyttar tangentbordsfokus till utforskarens sökfält, och om utforskaren inte visas öppnas den med fokus på sökningen. Till skillnad från posten `Toggle Explorer` stänger tangenten aldrig utforskaren från paletten – se [Öppna och stänga](./explorer.md#opening-and-closing). Medan diff-visaren, tidsresan eller förhandsgranskningen av automatisk layout är öppen låter editorn tangenten vara: paletten förblir öppen och tangenten går vidare till webbläsaren eller värdprogrammet – se [Webbläsarens sökruta](./find-and-replace.md#the-browsers-find-bar).  
Ett värdprogram som bäddar in editorn kan binda snabbsökningen till en annan tangent, som knappbeskrivningen för `Search` då visar – se [Kortkommandon](./settings.md#shortcuts).

![Paletten öppnas med ⌘ + K, följt av hopp till en tabell med #pay, till en kolumn med @price och till en tabellkommentar med :address](/img/demo-quick-search.webp)

## Söka och navigera {#searching-and-navigating}

Skriv för att filtrera listan. Varje tangenttryckning söker på nytt i hela listan framför dig, så om du tar bort tecken, eller skriver ett nytt ord i stället för ett som inte hittade något, kommer matchande poster tillbaka.  
Matchningen är ungefärlig och omfattar både postens namn och de nyckelord som visas bredvid den. I undermenyn `Import` hittar till exempel `sdl` posten `GraphQL`, `dbdiagram` posten `DBML` och `azimutt` posten `AML`. Ett mindre stavfel hittar ändå sin post, som när `tabel` hittar `New Table` och `imprt` hittar `Import`, men en post som bara vagt liknar det du skrev utelämnas: `memo` listar enbart `New Memo`. En post vars namn eller nyckelord innehåller det du skrev, oavsett skiftläge, listas alltid, och en sådan post som den ungefärliga matchningen missar hamnar efter de ungefärliga träffarna. Det du skrev framhävs överallt där en post innehåller det, oavsett skiftläge.  
Med ett annat visningsspråk än engelska hittas kommandon och poster i undermenyer även via sina engelska namn och nyckelord, som listan inte visar, så `new table` hittar `New Table` oavsett vilket språk posten visas på.  
Flytta dig i listan med `↑` och `↓` – den går runt i båda ändarna – och kör den framhävda posten med `Enter`. Listan rullar så att den framhävda posten hålls i vyn, och i ett lågt editorfönster krymper den till det utrymme som finns under sökrutan, så att varje post fortfarande går att nå och den framhävda stannar i vyn. Ett kommando som har ett eget kortkommando visar det i slutet av sin rad: till höger, eller till vänster med ett visningsspråk som skrivs från höger till vänster. Medan en inmatningsmetod fortfarande sätter samman tecken, som mitt i en koreansk stavelse, tillhör `↑`, `↓` och `Enter` inmatningsmetoden och varken flyttar framhävningen eller kör någon post.

En post som `Database`, `Import` eller `Auto Layout` öppnar en undermeny: dess poster ersätter listan och sökrutan töms. Undermenyerna för `Name View`, `Database`, `Bracket`, `Language`, de två skiftlägena för namn, `Schema SQL: Statements`, `Schema SQL: Header`, `Theme` och `Display Language` har en bock vid det aktuella valet och öppnas med framhävningen på det, så `Enter` behåller det; de andra undermenyerna öppnas utan någon framhävd post.  
Filtreringen gäller alltid bara listan framför dig, och det går inte att gå tillbaka upp en nivå, så stäng och öppna paletten igen för att börja om. I en undermeny är `#`, `@`, `:` och `?` vanlig text, inte [prefix](#searching-the-diagram).

## Vad paletten listar {#what-the-palette-lists}

Listan beror på vilken flik du är på. Listan på varje flik börjar med `Tab`, som växlar till `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator`, `Dictionary` eller `Settings` och utelämnar den flik du redan är på.

På ERD-fliken: `Name View` och upp till fyra rader som [härleder fysiska namn igen](./dictionary.md#derive-physical-names-again), sedan `Database`, `Import`, `Import and Add` och `Export`, sedan `New Table`, `New Memo`, `New Table Group` och `Group Selected Tables`, de fyra relationstyperna och `Auto Layout`. Tabeller listas inte här; skriv `#` för att [gå till en](#searching-the-diagram).  
`Name View` öppnar `Physical Names`, `Logical Names` och `Both Names`, med en bock vid den aktuella visningen, och ett val byter visning så som `Name View` i arbetsytans snabbmeny gör – se [Byta visning](./logical-names.md#switching-the-view). Den listas bara på ERD-fliken, även i en skrivskyddad editor.  
Härledningsraderna skiljs åt av nyckelorden bredvid dem. `Derive Physical Name Again`, med `column` bredvid sig, härleder den fokuserade kolumnens namn. `Derive Physical Names Again` finns som tre rader: med `table`, för den tabell som fokus ligger i, dess namn och varje kolumn; med `selected tables`, för de markerade tabellerna medan två eller fler är markerade; och med `whole document`, för varje tabell i diagrammet. Var och en listas bara medan den har något att omfatta, och ingen av dem i en skrivskyddad editor.  
`New Memo` utelämnas medan [View Option](./table-related-functions.md#table-view-options) → `Memos` döljer anteckningarna. `New Table Group` börjar rita en [tabellgrupp](./table-groups.md) på arbetsytan, och `Group Selected Tables` lägger de markerade tabellerna i en ny grupp och öppnar dess namnfält så att du kan skriva ett namn. Båda utelämnas medan View Option → `Table Groups` döljer grupperna, och `Group Selected Tables` kräver dessutom att minst en tabell är markerad. Deras rader visar tangenterna: `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) för att [rita en grupp](./table-groups.md#drawing-a-group) och `T` och sedan `G` för att [gruppera de markerade tabellerna](./table-groups.md#grouping-selected-tables).  
De kör samma kommandon som arbetsytans snabbmeny, utom där de kör tabellmenyns: `Group Selected Tables` kör dess `Group selected tables`, och härledningsraderna med `column`, `table` och `selected tables` kör dess `Derive Physical Name Again` eller `Derive Physical Names Again`, på fokus eller markeringen i stället för där du högerklickar. `View Option` och `Diff Viewer` finns bara i snabbmenyn. `Export` erbjuder samma `json`, `Schema SQL` och `Image` som snabbmenyn, och om du skriver `png` eller `svg` i den hittas `Image`.  
Se [Importera eller exportera filer](./file-import-export.md) för vad varje format, [Importera och lägg till](./file-import-export.md#import-and-add) och [bildexporten](./file-import-export.md#image) gör, och [Tabellfunktioner](./table-related-functions.md#databases) för vad valet av databas påverkar.

På fliken Schema SQL: `Database` igen och `Bracket`, som anger vilket citattecken som omger tabell-, kolumn-, begränsnings- och indexnamn i den genererade SQL-koden – `SingleQuote`, `DoubleQuote`, `Backtick` eller `None` för inga citattecken alls. Sedan `Schema SQL: Statements` och `Schema SQL: Header`, som gör samma val som flikens alternativpanel men bara listar dem som skrivs för den valda databasen, och `Schema SQL: Options panel`, som visar eller döljer den panelen. Se [Schema SQL](./schema-sql.md) för vad varje val skriver.

På fliken Kodgenerator: `Database`, `Bracket` medan språket är `Doctrine`, `JPA` eller `SeaORM`, sedan `Language`, `Table Name Case`, `Column Name Case` och `Code Generator: Options panel`, som visar eller döljer flikens alternativpanel. Se [Kodgenerator](./code-generator.md) för vad varje mål genererar.

Flikarna Visualisering, Ordlista och Inställningar har inga egna kommandon, bara `Tab` och de kommandon nedan som varje flik listar.

Nära slutet av listan på varje flik, även i en skrivskyddad editor, finns `Toggle Explorer`, som visar sitt kortkommando, `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac). Om du skriver `find`, `replace`, `rename`, `tree`, `outline` eller `objects` hittas den också.  
När den körs stänger den paletten och gör det som kortkommandot gör på arbetsytan. Medan knappen `Explorer` i verktygsfältet ser intryckt ut, det vill säga medan utforskaren är öppen på ERD-fliken och inte dold av zenläget, stänger den utforskaren. Annars växlar den till ERD-fliken och öppnar utforskaren med fokus på sökningen, med textmarkören i sökfältet – se [Öppna och stänga](./explorer.md#opening-and-closing). Den utelämnas medan diff-visaren, tidsresan eller förhandsgranskningen av automatisk layout är öppen.

### Tema och visningsspråk {#theme-and-display-language}

Efter `Toggle Explorer` listar varje flik `Theme` och `Display Language`, även i en skrivskyddad editor. Var och en listas bara där editorn erbjuder dess väljare, vilket syns på knapparna `Theme` och `Display Language` i verktygsfältet. Webbappen, Google Drive, VS Code, JetBrains-IDE:er och Obsidian erbjuder båda – se [I varje värdprogram](./language-and-theme.md#in-each-host).

`Theme` öppnar `System`, `Light` och `Dark`, med en bock vid det aktuella utseendet. Om du väljer ett av dem ändras bara utseendet, och gråtonen och accentfärgen behålls, som när du använder knapparna `Appearance` i temaverktyget.  
`Display Language` öppnar `System` och sedan de 25 språken, vart och ett med namnet på sitt eget språk och i väljarens ordning, med en bock vid det aktuella alternativet. Här hittas ett språk även via sitt engelska namn eller sin kod: `german` eller `de-DE` hittar `Deutsch`, och `korean` hittar `한국어`.  
Ett val i någon av dem gäller direkt, stänger paletten och behålls precis som ett val som görs i temaverktyget eller i väljaren `Display Language`. Om visningsspråket ändras medan paletten är öppen byter listan till det språket och behåller det du skrev och den undermeny du är i.

### Skrivskyddade editorer {#read-only-editors}

En editor med [`readonly`](../../api/erd-editor-element.md#readonly) listar inget kommando som skulle ändra diagrammet, i stället för att lista det nedtonat.  
På ERD-fliken behåller den `Tab`, `Name View`, `Database`, `Export` med alla tre sina poster, `Toggle Explorer`, `Theme` och `Display Language`. Den utelämnar `Import`, `Import and Add`, härledningsraderna, `New Table`, `New Memo`, `New Table Group`, `Group Selected Tables`, de fyra relationstyperna och `Auto Layout`.  
De andra flikarna listar det som de listar i vilken editor som helst. Överallt där de listas ändrar `Tab`, `Name View`, `Database`, `Bracket`, `Language` och de två skiftlägena för namn bara den skärmen och sparas aldrig – se [Skrivskyddade editorer](./settings.md#read-only-editors) i Inställningar.  
Om editorn blir skrivskyddad, eller skrivbar igen, medan paletten är öppen ritas listan om med det som editorn då erbjuder och söks igen efter det du skrev. En undermeny vars rad försvann ger vika för den översta nivån.

Prefixen `#`, `@` och `:` söker i diagrammet som i vilken editor som helst, och ett hopp markerar det som det landar på, som det beskrivs i [Söka i diagrammet](#searching-the-diagram). I en skrivskyddad editor är det det enda sättet att markera något: ett tryck på arbetsytan markerar ingenting, och ett klick som inte flyttar sig tar bort det som hoppet markerade – se [Skrivskyddade editorer](./table-related-functions.md#read-only-editors).

## Söka i diagrammet {#searching-the-diagram}

Börja sökningen med ett prefix för att söka i diagrammet i stället för bland kommandona: `#` för tabeller, `@` för kolumner, `:` för kommentarer och anteckningar eller `?` för att lista prefixen. Ett prefix fungerar från varje flik. Det räknas bara när det är första tecknet, bortsett från blanksteg före det. Ett blanksteg efter det är valfritt, så `#users` och `# users` är samma sökning, och de fullbreddstecken `＃`, `＠`, `：` och `？` som en japansk eller kinesisk inmatningsmetod skriver räknas också.  
Medan inmatningsfältet är tomt på den översta nivån visar en rad under det de fyra prefixen; klicka på ett för att skriva det. Medan ett prefix gäller visar slutet av inmatningsfältet dess omfång: `Tables`, `Columns`, `Comments & memos` eller `Help`. Ta bort prefixet för att få tillbaka kommandona.

`#` listar tabellerna, var och en med `Table` bredvid sig. En rad namnger sin tabell så som [namnvisningen](./logical-names.md#beyond-the-canvas) gör, till exempel `Accounts (users)` i `Both Names`, och en tabell utan något namn att visa listas som `unnamed`. När inget står efter `#` sorteras tabellerna efter namn, aldrig efter logiskt namn, i varje visning. Text efter `#` matchas ungefärligt, som ovan, mot varje tabells namn och dess logiska namn oavsett vad visningen visar, så `#accounts` listar `users` även i `Physical Names`. Tabeller vars namn eller logiska namn innehåller texten kommer först. Namn på tabellgrupper och index söks inte under något prefix; [Sök och ersätt](./find-and-replace.md#what-it-searches) söker i båda.

`@` listar kolumner, var och en med sin plats bredvid sig, till exempel `users.email · Column`. Text efter `@` måste finnas i kolumnens namn eller dess logiska namn, oavsett skiftläge och oavsett vad namnvisningen visar; den här matchningen är inte ungefärlig. Varje namn som innehåller texten blir en egen rad: en träff på det logiska namnet visar det logiska namnet, med `users.email · Logical name` bredvid sig, så en kolumn vars namn och logiska namn båda innehåller texten listas två gånger. Text före den första `.` begränsar sökningen till de tabeller vars namn eller logiska namn innehåller den: `@users.em` listar kolumnerna som innehåller `em` i tabeller vars namn eller logiska namn innehåller `users`, `@users.` listar kolumnerna i de tabellerna och `@.em` söker i alla tabeller. En tabells eget logiska namn ger ingen rad under `@`; `#` hittar det. När inget står efter `@` listas varje kolumn en gång, med sitt namn.

`:` listar tabellkommentarer, kolumnkommentarer och anteckningar, aldrig namn eller logiska namn. Varje rad visar ett utdrag ur texten runt träffen, med `users · Table comment`, `users.email · Column comment` eller `Memo` bredvid sig. Text efter `:` måste finnas i kommentaren eller anteckningen, oavsett skiftläge, precis som med `@`. När inget står efter `:` listas de kommentarer och anteckningar som inte är tomma. Medan View Option → `Memos` döljer anteckningarna listar `:` ingen anteckning.

`@` och `:` listar sina rader i den ordning dokumentet har dem: tabell för tabell, med varje tabells kommentar före dess kolumner i kolumnordning, och anteckningarna sist. Under `@` kommer en kolumns rad för det logiska namnet före raden för dess namn.  
Platsen bredvid en rad för `@` eller `:` anger tabellens och kolumnens namn, aldrig deras logiska namn, i varje visning.

`?` listar `Tables`, `Columns` och `Comments & memos`, och text efter `?` filtrerar dem. Om du väljer en av dem ersätts texten i inmatningsfältet med dess prefix, och paletten förblir öppen.

En lista med prefix innehåller varje träff, hur många de än är. Ett prefix vars sökning inte hittar något lämnar listan tom, utan något meddelande.

När du väljer en tabell, kolumn, kommentar eller anteckning stängs paletten, och editorn växlar till ERD-fliken om du är på en annan flik.  
Arbetsytan rullar till det valda om det inte redan syns väl – se [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands). En tabell markeras sedan ensam och läggs överst. Om fokus inte redan fanns i den tabellen fokuseras den första cellen i dess tabellhuvud: dess namn, eller dess logiska namn i `Logical Names` och `Both Names`.  
En anteckning markeras ensam och läggs överst. För en kolumn eller en kommentar markeras dess tabell ensam och läggs överst, och den fokuserade cellen hamnar på den cell som innehåller texten. Där visningen inte ritar den cellen hamnar fokus på den cell som ritas i dess ställe: ett logiskt namn som hittas i `Physical Names` hamnar på namnet, och ett namn som hittas i `Logical Names` på det logiska namnet. En kommentar som ett [visningsalternativ för tabeller](./table-related-functions.md#table-view-options) döljer hamnar på namnet bredvid den, eller, i `Logical Names`, på det logiska namnet.  
Inget hopp påbörjar eller slutför en relation som håller på att ritas.

Använd [Sök och ersätt](./find-and-replace.md) högst upp i utforskaren för `Match Case`, `Match Whole Word` eller `Use Regular Expression`, eller för att ersätta text.

## När inget kommando matchar {#when-no-command-matches}

Om inget listat kommando på den översta nivån, utan prefix, innehåller det du skrev, oavsett skiftläge, följer tre rader efter kommandona: `Search tables for "…"`, `Search columns for "…"` och `Search comments & memos for "…"`, var och en med sitt prefix som ikon. Om du väljer en av dem skrivs dess prefix före din text, så `users` blir `#users`, och paletten förblir öppen med de resultaten.  
Om sökningen inte hittar något kommando alls visas `No commands match` ovanför listan, som då bara innehåller de tre raderna. Om den bara hittar kommandon som inte innehåller texten kommer de först: på ERD-fliken utan markerad tabell listar sökningen `tables` posterna `New Table`, `Database` och, där den erbjuds, `New Table Group` före de tre raderna. Med en markerad tabell innehåller `Group Selected Tables`, där den erbjuds, texten `tables`, så de tre raderna visas inte.  
I en undermeny lämnar en sökning som inte hittar något listan tom, utan något meddelande.

## Söka på koreanska {#searching-in-korean}

En sökning som innehåller hangul matchar även via sina bokstäver, bland kommandona, i undermenyer och under varje prefix.  
I varje steg som en koreansk inmatningsmetod går igenom hittas fortfarande den rad du är på väg att skriva, så `ㅅ`, `사`, `상`, `사요` och `사용` hittar alla `사용자`. En sökning som bara består av begynnelsekonsonanter matchar stavelsernas begynnelsekonsonanter, och blanksteg hoppas över: `ㅅㅇㅈ` hittar `사용자`, och `ㅈㅁ` hittar `주문 내역`. Ett konsonantkluster som en inmatningsmetod i Windows sätter samman av två begynnelsekonsonanter som skrivs i följd, som `ㅄ`, räknas som de två (`ㅂㅅ`), medan en dubbelkonsonant som `ㄲ` förblir en bokstav. Text som lagras i uppdelad form, som filnamn i macOS, matchar som om den vore sammansatt.  
Rader vars hela text stavar sökningen, bokstav för bokstav eller begynnelsekonsonant för begynnelsekonsonant, kommer först, sedan rader som börjar med den och sedan rader som innehåller den. Under `@` och `:` kommer rader som innehåller sökningen precis som den skrevs före alla dessa, i dokumentordning. Framhävningen omfattar hela stavelser, så `상` lyser upp `사용` i `사용자`.
