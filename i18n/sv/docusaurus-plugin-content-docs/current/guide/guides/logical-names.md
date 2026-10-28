---
sidebar_position: 4
description: Ge tabeller och kolumner logiska namn, visa fysiska namn, logiska namn eller båda med namnvisningen, komplettera termnamn medan du skriver, koppla kolumner till domäner och se var namnen följer visningen på andra ställen.
---

# Logiska namn

En tabell och var och en av dess kolumner kan ha ett logiskt namn bredvid sitt namn. Det logiska namnet är det som människor läser, som `Customer Name` för `CUST_NM`. Själva namnet är det fysiska namnet, det som [Schema SQL](./schema-sql.md) och [kodgeneratorn](./code-generator.md) skriver.  
Namnvisningen avgör vilket av de två som ERD-arbetsytan ritar: namnen, de logiska namnen eller båda – se [Namnvisning](#name-view).  
Ett logiskt namn kan också ge sin tabell eller kolumn ett fysiskt namn, härlett från orden och termerna på fliken [Ordlista](./dictionary.md) – se [Härleda fysiska namn](./dictionary.md#deriving-physical-names).  
En kolumn kan kopplas till en domän, en namngiven datatyp som `Name` för `VARCHAR(100)` som finns på bladet `Domains` på fliken Ordlista, och har då domänens datatyp – se [Domäncellen](#the-domain-cell).  
Schema SQL kan skriva varje logiskt namn i en tom kommentar – se [Logiska namn som kommentarer](./schema-sql.md#logical-names-as-comments).

## Namnvisning {#name-view}

Det finns tre visningar, och var och en ritar tabellhuvudet och raderna i en tabell på sitt eget sätt:

- `Physical Names`, visningen i ett nytt diagram, ritar inget logiskt namn. Tabellhuvudet visar tabellens namn och, medan View Option → `Table Comment` är på, dess kommentar, och varje rad visar sina celler i [kolumnordningen](./settings.md#adjusting-column-order).
- `Logical Names` ritar det logiska namnet i stället för varje namn: i tabellhuvudet och i varje rad där `Name` står i kolumnordningen. En rads typcell kan stå för kolumnens domän, som beskrivs nedan.
- `Both Names` ritar det logiska namnet bredvid namnet. Tabellhuvudet visar det logiska namnet, sedan namnet och sedan kommentaren, och varje rad får en cell `Logical Name`, som kolumnordningen som standard placerar precis före `Name`.

Ett tomt logiskt namn, även ett som bara består av blanksteg, visar en nedtonad ersättning. I `Logical Names` är det namnet som ritas i dess ställe, eller platshållaren `table` eller `column` när även namnet är tomt. I `Both Names` är det platshållaren `logical`.

I `Logical Names` visar en kolumn som är kopplad till en namngiven domän på bladet `Domains` på fliken Ordlista den domänens namn i sin typcell i stället för sin datatyp. Alla andra kolumner visar sin datatyp där.  
Medan View Option → `Domain` är på har domänen en egen cell och typcellen behåller datatypen, så ingen rad visar domänen två gånger – se [Domäncellen](#the-domain-cell).

Varje tabell är lika bred som de celler den ritar i visningen, så ett byte ändrar storlek på tabellerna och drar om deras relationslinjer. Ingen tabell flyttas.  
Vid `70%` och lägre fälls en tabell ihop till sitt namn – se [Zooma in/ut](./table-related-functions.md#zoom-inout). I `Logical Names` visar den det logiska namnet, eller namnet nedtonat medan det saknas. I `Both Names` visar den det logiska namnet med namnet på en rad under, eller bara namnet medan det inte finns något logiskt namn.

Ordlistornas kontroller kan skriva ett logiskt namn eller ett namn i rött eller bärnstensgult där de pekar ut det – se [Märkningar på arbetsytan](./dictionary.md#marks-on-the-canvas).

## Byta visning {#switching-the-view}

Visningen byts på fyra ställen, och vart och ett listar `Physical Names`, `Logical Names` och `Both Names` med den aktuella visningen ikryssad:

- Knappen `Name View` i [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar), mellan de fyra relationsnotationerna och zenläget. Den visar namnet på den aktuella visningen, med en nedåtpil, och dess knappbeskrivning visar `Name View`. Ett klick öppnar listan ovanför verktygsfältet, och ett val stänger den.
- `Name View` i arbetsytans snabbmeny, direkt efter `View Option`: en undermeny med de tre visningarna. Menyn förblir öppen efter ett val.
- Samma lista i verktygsfältet på fliken Visualisering i läget `Flow`, efter menyn för radvisning – se [Verktygsfält](./visualization.md#toolbar).
- `Name View` i [snabbsökningen](./quick-search.md#what-the-palette-lists), direkt efter `Tab` och listad endast på ERD-fliken. Dess undermeny öppnas med den aktuella visningen framhävd.

![Byta namnvisning till Logical Names från arbetsytans verktygsfält, till Both Names från arbetsytans meny och tillbaka till Physical Names, där ordered_at, som saknar logiskt namn, först är nedtonat och sedan visas som platshållaren logical](/img/demo-name-view.webp)

Alla fyra ställer in samma visning. Verktygsfältet överst har ingen knapp för den.

Ett byte behåller markeringen och registreras inte i [ångrahistoriken](./undo-redo.md#what-the-history-records).  
Fokus på en cell som den nya visningen inte ritar flyttas till den cell som ritas i dess ställe: namnet och det logiska namnet ersätter varandra, liksom typen och domänen gör. Ett redigeringsfält som är öppet i den cellen stängs. Om du slår på eller av View Option → `Domain` flyttas fokus på samma sätt.  
När `Name View` är låst, som i ett nytt diagram, ändrar ett byte bara din egen skärm och filen behåller den visning som den låstes vid. När låset är av sparar filen den visning du byter till – se [Lås](./settings.md#lock).

## Skriva ett logiskt namn {#writing-a-logical-name}

`Physical Names` ritar inget logiskt namn, så byt till `Logical Names` eller `Both Names` för att skriva ett på arbetsytan:

- I `Logical Names` innehåller namncellerna i tabellhuvudet och raderna de logiska namnen, så ett fysiskt namn kan inte redigeras på arbetsytan i den här visningen.
- I `Both Names` innehåller cellerna för logiskt namn de logiska namnen och namncellerna de fysiska namnen.

En cell för logiskt namn redigeras som alla andra celler: börja med `Enter` eller ett dubbelklick – se [Redigera tabeller](./table-editing.md). När redigeringsfältet öppnas på ett tomt logiskt namn visar fältet den text som cellen ritade, som platshållare: namnet i `Logical Names`, `logical` i `Both Names`.  
Det du skriver hamnar bara i det logiska namnet. Det fysiska namnet härleds från det när redigeringsfältet stängs (`Enter`, `Tab`, `Escape` eller ett klick någon annanstans) på ett ändrat logiskt namn, som ett eget steg i ångrahistoriken efter det du skrev. Ett fysiskt namn som du själv har skrivit lämnas som det är – se [Härleda fysiska namn](./dictionary.md#deriving-physical-names).

`Tab` och `Shift + Tab` går igenom de celler som visningen ritar, i deras ordning – se [Tabbtangenten](./table-editing.md#tab-key):

- I `Logical Names` tabellhuvudets logiska namn, sedan dess kommentar och sedan varje rads celler i kolumnordningen, med det logiska namnet på namnets plats.
- I `Both Names` tabellhuvudets logiska namn, namn och kommentar och sedan varje rads celler i kolumnordningen, som standard med radens cell `Logical Name` först.

`Alt + Enter` (Windows/Linux) eller `⌥ + Enter` (Mac) lägger till en kolumn och fokuserar den första cell som dess rad ritar. Med standardkolumnordningen är det dess namncell, som i `Logical Names` är dess logiska namn och i `Both Names` dess cell `Logical Name`, så du kan börja med det logiska namnet – se [Lägga till kolumner](./table-editing.md#adding-columns).

En sekundärnyckelkolumn som en relation lägger till kopierar sin nyckels logiska namn och domän, tillsammans med dess typ – se [Identifierande relationer](./relationship-editing.md#identifying-relationships).  
När du kopierar kolumner till ett kalkylblad och klistrar in kolumner från ett används de celler som visningen ritar, även cellerna för logiskt namn och domäncellerna – se [Kopiera/klistra in kolumner](./table-editing.md#copyingpasting-columns).

## Komplettera termnamn {#completing-term-names}

Medan du skriver i en cell för logiskt namn, i tabellhuvudet eller i en rad, erbjuder en lista under cellen de termer vars namn börjar med texten, oavsett skiftläge och eventuella blanksteg före den. En term är ett helt logiskt namn som finns på bladet `Terms` på fliken Ordlista, med det fysiska namnet och den domän som den ger. Listan visar upp till åtta, sorterade efter namn, med den skrivna texten framhävd. Ingen lista visas medan ingen term börjar så.

![Lägga till en kolumn med ⌥ + Enter i Both Names, välja Order Amount i termlistan under dess logiska namn så att ORD_AMT, DECIMAL(10,2) och domänen Amount fylls i, och sedan skriva Order Date, vars namn ORD_DT orden ger när Enter stänger redigeringsfältet](/img/demo-logical-names.webp)

- Från början är ingenting framhävt. `↑` och `↓` flyttar framhävningen och går runt vid båda ändarna, och den framhävda termen visar tangenten `Enter`.
- `Enter` på en framhävd term skriver dess namn som det logiska namnet och avslutar redigeringen. Om det fysiska namnet inte är ett som du själv har skrivit härleder samma steg i ångrahistoriken genast det fysiska namnet från termen och ger dessutom en kolumn termens domän. `Enter` utan något framhävt avslutar redigeringen och behåller det du skrev.
- Ett klick på en term skriver den på samma sätt och låter redigeringsfältet vara öppet.
- `Escape` medan listan visas stänger bara listan, och nästa `Escape` avslutar redigeringen.
- `Tab` går vidare med texten som den skrevs, och det fysiska namnet härleds från den när redigeringsfältet stängs.
- Medan en inmatningsmetod sätter samman tecken hör piltangenterna och `Enter` till teckensammansättningen.

Vad en term ger en tabell eller en kolumn beskrivs i [Härleda fysiska namn](./dictionary.md#deriving-physical-names).

## Domäncellen {#the-domain-cell}

View Option → `Domain`, som är av som standard, ger varje rad en domäncell i varje visning, där `Domain` står i kolumnordningen, som standard direkt efter `DataType` – se [Visningsalternativ för tabeller](./table-related-functions.md#table-view-options).  
Cellen visar namnet på den domän som kolumnen är kopplad till, eller platshållaren `domain`, nedtonad, för en kolumn som inte är kopplad till någon domän som bladet `Domains` listar.

![Slå på View Option → Domain, välja Amount i domäncellen för PAY_AMT efter att ha begränsat listan med amo, ändra Data Type för Amount till DECIMAL(12,2) på fliken Ordlista och se att kolumnen har ändrats med den, och sedan skriva NUMERIC(12,2) i kolumnen, vilket kopplar från den](/img/demo-domains.webp)

`Enter` eller ett dubbelklick öppnar en väljare över cellen: ett tomt fält med cellens text som platshållare, och under det `None` och sedan varje namngiven domän på bladet `Domains` i bladets ordning. Framhävningen börjar på den kopplade domänen eller på `None`.

- När du skriver listas bara de domäner vars namn innehåller texten, oavsett skiftläge, `None` tas bort och den första framhävs. `↑` och `↓` flyttar framhävningen.
- `Enter` kopplar den framhävda domänen, och ett klick kopplar den som du klickar på. Båda ger kolumnen domänens datatyp, som ett steg i ångrahistoriken, och avslutar redigeringen. `None` kopplar från kolumnen och behåller dess datatyp.
- Det du skriver skrivs aldrig in i kolumnen. Medan bladet `Domains` saknar namngivna domäner visas ingen lista, och `Enter` avslutar redigeringen utan att skriva något.

I `Logical Names` med View Option → `Domain` av öppnar en typcell som visar en domäns namn den här väljaren, och en som visar en datatyp öppnar redigeringen av datatypen – se [Autokomplettering av datatyp](./table-editing.md#datatype-autocomplete). Om du vill koppla en domän till en kolumn som inte har någon slår du på domäncellen.  
En kopplad kolumn har sin domäns datatyp och följer den när domänens typ ändras, och om du skriver en annan typ i dess cell DataType kopplas den från – se [Domäner och datatyper](./dictionary.md#domains-and-data-types).

## Utanför arbetsytan {#beyond-the-canvas}

De flesta andra ställen som namnger en tabell eller en kolumn följer också namnvisningen:

- `Physical Names` visar namnet.
- `Logical Names` visar det logiska namnet, eller namnet, nedtonat där stället kan tona ned det, medan det logiska namnet är tomt.
- `Both Names` visar det logiska namnet med namnet efter: dämpat i en textrad, på en andra rad i en etikett i grafen och inom parentes där en enda text måste rymma båda, som `Member (member)`. En tabell eller kolumn utan logiskt namn visar bara sitt namn.

En lista som är sorterad efter namn, som tabellerna i utforskaren eller raderna för `#` i snabbsökningen, förblir sorterad efter namn i varje visning, aldrig efter logiskt namn.

De ställen som följer visningen:

- Korten i flödet på fliken Visualisering – se [Namn på korten](./visualization.md#names-on-the-cards) – och grafens etiketter och förhandsgranskning vid hovring – se [Läsa grafen](./visualization.md#reading-the-graph) och [Förhandsgranskning vid hovring](./visualization.md#hover-preview).
- Panelen [Tabellegenskaper](./table-related-functions.md#table-properties): dess brickor, och på fliken `Indexes` raderna `Columns` och listan `Index order` – se [Index](./table-related-functions.md#indexes).
- Tabell- och kolumnraderna i [utforskaren](./explorer.md#the-tree) och tabellerna som listas under varje tabellgrupp.
- Raderna för `#` i snabbsökningen – se [Söka i diagrammet](./quick-search.md#searching-the-diagram).
- Ändringsträdet i [diff-visaren](./table-related-functions.md#diff-viewer) och båda dess sidor.
- Dialogrutan [Mappa kolumner](./relationship-editing.md#map-columns) och knappbeskrivningen `<parent> has no primary key to copy` som `Create new columns` kan visa medan en relation ritas – se [Skapa relationer](./editing-start.md#relationship-creation).
- Kopian av raderna som en kolumndragning bär över tom arbetsyta, som visar varje rads namn- och typceller så som raden ritar dem – se [Ordna om och flytta kolumner](./table-editing.md#rearranging-and-moving-columns).
- Kolumnen `Target` på bladet `Checks` på fliken Ordlista – se [Bladet Kontroller](./dictionary.md#the-checks-sheet).
- En [exporterad bild](./file-import-export.md#image).

Några ställen behåller namnen oavsett visning: index- och sekundärnyckelraderna i utforskaren, `Keys` på fliken `Indexes` i panelen Tabellegenskaper, `New column: <name>` i Mappa kolumner och platsen som skrivs bredvid en rad för `@` eller `:` i snabbsökningen.

Diff-visaren, [tidsresan](./undo-redo.md#time-travel), förhandsgranskningen av den [automatiska layouten](./table-related-functions.md#auto-layout) `Force` och dialogrutan `Export image` öppnas i den namnvisning du tittar på, oavsett vilken visning filen behåller. Var och en behåller den visningen medan den är öppen.  
Varje automatisk layout, och en `Import` eller `Import and Add` av Schema SQL, GraphQL, DBML eller AML, placerar tabellerna med de bredder de har i din visning.

## Söka efter logiskt namn {#finding-by-logical-name}

Logiska namn hittas i varje namnvisning, även i `Physical Names`, där arbetsytan inte ritar några:

- [Sök och ersätt](./find-and-replace.md#what-it-searches) söker i dem som en egen texttyp, `Logical names`, för både tabeller och kolumner, och texttypen är på när sökningen öppnas första gången. När ett logiskt namn ersätts härleds det fysiska namnet från det, precis som när du skriver ett.
- I [snabbsökningen](./quick-search.md#searching-the-diagram) hittar `#` en tabell efter dess namn eller dess logiska namn, och `@` hittar en kolumn efter endera, där en träff på det logiska namnet visar `Logical name` bredvid sig. Tabelldelen av `@`, före `.`, matchar också en tabells namn eller logiska namn.

Ett byte av namnvisning ändrar hur resultaten namnges, aldrig vad som hittas.

## Medarbetare {#collaborators}

I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) når logiska namn och domänkopplingar varje editor som alla andra ändringar.  
När `Name View` är låst behåller varje editor en egen visning, och ett byte syns bara i den editor som gjorde det. När låset är av ändrar ett byte i en editor som inte är skrivskyddad visningen i alla editorer – se [Lås](./settings.md#lock), som också beskriver hur varje editors visning påverkas när låset slås på eller av.  
När en deltagares fokuserade cell är en som din visning inte ritar visas deltagarens färg på den cell som din visning ritar i dess ställe: en namncell i `Physical Names` visas på din cell för logiskt namn i `Logical Names` och tvärtom, och en typcell och domänen som står i dess ställe motsvarar varandra på samma sätt.

En kodagent som arbetar via MCP-servern sätter logiska namn och kopplar domäner oavsett vilken visning du tittar på, och har inget verktyg som byter namnvisning – se [Ordlistor](../../mcp/tools.md#dictionaries) och [Inställningar](../../mcp/tools.md#settings).

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) fungerar varje väljare för namnvisning: knappen `Name View` i arbetsytans verktygsfält, `Name View` i arbetsytans snabbmeny och i snabbsökningen samt listan i flödets verktygsfält.  
Ett byte där ändrar bara den skärmen, oavsett lås: filen, medarbetarna och ångra-historiken behåller vyn som den var. När editorn blir skrivbar igen stannar den valda vyn på den skärmen tills nästa byte där, eller, medan låset är av, tills en medarbetare byter den eller dokumentet läses in igen.  
Logiska namn och domäner kan inte redigeras där, så ingen cellredigerare, termlista eller domänväljare öppnas, och ingen av raderna `Derive Physical Name Again` och `Derive Physical Names Again` erbjuds.  
View Option → `Domain` visar eller döljer domäncellen bara på den skärmen, som varje [visningsalternativ](./table-related-functions.md#table-view-options) gör där, och när editorn blir skrivbar igen kommer de visningsalternativ som dokumentet innehåller tillbaka.
