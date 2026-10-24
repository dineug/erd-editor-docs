---
sidebar_position: 14
description: Samla diagrammets domäner, ord och termer på fliken Ordlista, härled fysiska namn från logiska namn, låt en domän bestämma datatypen för sina kolumner, läs vad bladet Kontroller hittar, redigera och sortera bladen som i ett kalkylblad och importera och exportera dem som CSV-filer.
---

# Ordlista

Fliken Ordlista innehåller diagrammets namnstandard i tre ordlistor, var och en på ett blad som du redigerar som ett kalkylblad:

- `Domains`: namngivna datatyper, som `Name` för `VARCHAR(100)`. En kolumn som är kopplad till en domän har domänens datatyp.
- `Words`: de standardord som logiska namn består av, vart och ett med den förkortning som ett fysiskt namn använder för det, som `Customer` och `CUST`.
- `Terms`: hela logiska namn, vart och ett med det fysiska namn och den domän som det ger, som `Customer Name` med `CUST_NM`.

En tabells eller en kolumns [logiska namn](./logical-names.md) härleder dess fysiska namn från de här ordlistorna, och en kolumns term kan också koppla kolumnen till en domän – se [Härleda fysiska namn](#deriving-physical-names).  
Ett fjärde blad, `Checks`, listar vad ordlistorna hittar för fel i diagrammets namn och typer och i själva ordlistorna, till exempel ett förbjudet ord i ett logiskt namn – se [Bladet Kontroller](#the-checks-sheet).

## Öppna fliken {#opening-the-tab}

Byt till fliken `Dictionary` i verktygsfältet, knappen med en bokikon mellan `Code Generator` och `Settings`, eller välj `Dictionary` under `Tab` i [snabbsökningen](./quick-search.md).  
Den kan vara fliken som diagrammet öppnas på – se `Canvas Type` i [Lås](./settings.md#lock).

Fliken öppnas på bladet `Domains` tills du väljer ett annat.  
Varje gång fliken öppnas kommer bladet tillbaka med den markering och den rullningsposition som du lämnade, eller med sin första cell markerad vid ett första besök. Dess rutnät får tangentbordsfokus, så att det du skriver och piltangenterna verkar direkt.

Det visade bladet och varje blads sökning, markering, rullningsposition och kolumnbredder är bara dina egna.  
Inget av det sparas i filen, registreras i ångrahistoriken eller delas med medarbetare. Det behålls medan editorn är öppen, både när du byter flik och när andra dokument läses in i samma editor.

## Bladen {#the-sheets}

Listen högst upp innehåller de fyra bladknapparna, `Domains`, `Words`, `Terms` och `Checks`, och knappen för det visade bladet ser intryckt ut. Var och en visar ett antal bredvid sitt namn: hur många rader dess blad innehåller, oavsett vad sökningen visar, eller på `Checks` antalet kontroller, färgat efter deras nivå – se [Bladet Kontroller](#the-checks-sheet).  
Sedan kommer sökfältet – se [Söka](#searching). I slutet av listen, på `Domains`, `Words` och `Terms` och inte i en skrivskyddad editor, finns fyra verktyg: `Add Row`, `Delete Rows`, `Import CSV` och `Export CSV` – se [Lägga till och ta bort rader](#adding-and-deleting-rows) och [Importera och exportera CSV](#importing-and-exporting-csv).  
I en smal panel eller med ett visningsspråk med långa texter bryts listen på flera rader, så att alla knappar förblir åtkomliga.

Under rutnätet räknar en statusrad de rader som sökningen lämnar kvar, som i `4 rows`, och, medan markeringen omfattar någon rad, hur många den omfattar, som i `1 selected`. En rad som två områden delar räknas en gång, så det antalet är hur många rader `Delete Rows` skulle ta bort.  
Radnumren längs vänsterkanten räknar raderna så som bladet visar dem, från 1. En skrivskyddad cell, vilket är varje cell på `Checks` och varje cell i en skrivskyddad editor, ritas på grå bakgrund, utom där en kontroll märker den.  
Ett tomt blad `Domains`, `Words` eller `Terms` visar `Import a CSV file or add a row`, utom i en skrivskyddad editor.

Varje blads kolumner, i ordning:

| Blad | Kolumner |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

Vad cellerna gör:

- En domäns `Data Type` skrivs som en kolumntyp, som `VARCHAR(100)` eller `NUMERIC(15,2)`, och varje kolumn som är kopplad till domänen har den typen – se [Domäner och datatyper](#domains-and-data-types).
- Ett ords `Abbreviation` är det som ett fysiskt namn använder för ordet – se [Från orden](#from-the-words).
- Ett ords `Synonyms` och `Forbidden Words` listar andra ord för samma sak, åtskilda med kommatecken. Varje post trimmas, en tom post utelämnas och en post som är lika med själva ordet ignoreras. Ett logiskt namn som använder ett sådant ord bildar inget fysiskt namn, och bladet `Checks` pekar ut det och anger vilket ord som ska användas i stället – se [Vad varje kontroll hittar](#what-each-check-finds).
- En terms `Term` är ett helt logiskt namn, och dess `Physical Name` är det namn som det logiska namnet ger – se [Från en term](#from-a-term).
- En terms `Domain` visar namnet på den domän som termen är kopplad till och är tom medan termen inte är kopplad till någon domän eller är kopplad till en domän som sedan har tagits bort – se [En terms domän](#a-terms-domain).
- `Category`, `English Name`, varje `Description` och en terms `Synonyms` är noteringar. De ändrar ingenting, och ingen kontroll läser dem.

I ett [visningsspråk som skrivs från höger till vänster](./language-and-theme.md#right-to-left-languages) är listen, rutnätets meny och statusraden spegelvända, medan bladen och en terms domänlista förblir från vänster till höger.

## Härleda fysiska namn {#deriving-physical-names}

Ordlistorna kan ge en tabell eller en kolumn dess fysiska namn, det namn som Schema SQL och kodgeneratorn skriver, utifrån dess logiska namn. Först söks en term vars `Term` är det logiska namnet; annars bildas namnet av ordens förkortningar.  
Med till exempel orden `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) och `Date` (`DT`) och termen `Customer Number` med det fysiska namnet `CUST_NO` och domänen `Number`, vars datatyp är `INT`:

- Det logiska namnet `Customer Number` ger en kolumn namnet `CUST_NO`, kopplar den till `Number` och ger den typen `INT`.
- `Order Date` bildar `ORD_DT`.
- En tabell med det logiska namnet `Customer` får namnet `CUST`.

När både bladet `Words` och bladet `Terms` är tomma härleds ingenting.

### När ett namn härleds {#when-a-name-is-derived}

Ett fysiskt namn härleds när ett logiskt namn skrivs:

- På arbetsytan, när redigeringen i cellen för logiskt namn stängs med ett annat logiskt namn än det som den öppnades med, genom `Enter`, `Tab`, `Escape` eller ett klick någon annanstans. Varje tangenttryckning skriver bara det logiska namnet – se [Skriva ett logiskt namn](./logical-names.md#writing-a-logical-name).
- Direkt, när du väljer en term i listan under cellen – se [Komplettera termnamn](./logical-names.md#completing-term-names).
- När en inklistring skriver i en cell för logiskt namn – se [Kopiera/klistra in kolumner](./table-editing.md#copyingpasting-columns).
- När [Sök och ersätt](./find-and-replace.md#replacing) ersätter ett logiskt namn, en träff eller alla.
- När en kodagent anger ett logiskt namn.

Det härleds bara medan det fysiska namnet är tomt eller självt har härletts – se [Egna namn](#names-of-your-own).  
En vald term, en inklistring eller en ersättning skriver det logiska namnet och det som det härleder som ett steg i ångrahistoriken. På arbetsytan är namnet som härleds när redigeringen stängs ett eget steg efter skrivandet: den första ångringen tar tillbaka det härledda namnet, tillsammans med den domän och typ som en term förde med sig, och lämnar kvar det logiska namn som du skrev.

Ingenting härleds igen senare av sig självt. Ett ords nya `Abbreviation`, en terms nya `Physical Name` eller `Domain` och nya ord eller termer lämnar de redan härledda namnen som de är; använd [Härled fysiska namn igen](#derive-physical-names-again) för det. En domäns `Data Type` är undantaget: den når domänens kolumner direkt.

### Från en term {#from-a-term}

Först söks bladet `Terms` igenom efter en term vars `Term` är lika med det logiska namnet. Blanksteg i början och slutet och Unicode-normalformen ignoreras, men skiftläget spelar roll, så `customer number` matchar inte `Customer Number`. Av två termer med samma namn gäller den som står först på bladet.

- Termen ger sitt `Physical Name`, eller, medan det är tomt, det namn som dess ord bildar, som nedan, om de bildar ett.
- För en kolumn kopplar termen också kolumnen till sin `Domain` medan bladet `Domains` listar domänen, vilket ger kolumnen domänens datatyp – se [Koppla en kolumn](#linking-a-column). Det gör den även när termen inte ger något namn. En term utan domän kopplar inte från något.
- En tabell får bara termens fysiska namn.

### Från orden {#from-the-words}

Utan någon matchande term bildar orden namnet:

1. Det logiska namnet delas vid blanksteg, `_`, `-`, `·` och `/`, och inget ord sträcker sig över en delning.
2. Varje del läses från vänster, och vid varje punkt tas den längsta text som bladet `Words` listar, som ett `Word`, en synonym eller ett förbjudet ord, utan att någonsin gå tillbaka. Med orden `가입`, `가입일` och `일자` läses `가입일자` som `가입일` och `자`, vilket lämnar `자` oregistrerat, medan `가입 일자` läses som `가입` och `일자`. Skiftläget spelar roll: `member` är inte ordet `Member`.
3. Det fysiska namnet är ordens `Abbreviation`, var och en exakt som den är skriven, sammanfogade med `_`, som `ORD_DT`. Av två ord med samma namn ger det som står först på bladet förkortningen. Ingen längdgräns gäller, och `Table Name Case` och `Column Name Case` i kodgeneratorn spelar ingen roll.

Det är allt eller inget. Om något avsnitt är en synonym, ett förbjudet ord eller text som inget ord listar, eller om ett ord har en tom `Abbreviation`, bildas inget namn, och det fysiska namnet förblir som det är.

### Egna namn {#names-of-your-own}

Ordlistorna fyller i ett fysiskt namn bara medan det är tomt eller självt har fyllts i av dem. Editorn minns detta för varje tabell och kolumn, även om ingenting på arbetsytan visar det.

- Ett namn som du skriver blir ditt eget: när du skriver i en namncell, ersätter ett tabell- eller kolumnnamn med Sök och ersätt eller klistrar in över en kolumns namncell, och när en kodagent byter namn. Ett logiskt namn som skrivs senare lämnar det som det är, skriver bara det logiska namnet och kopplar ingen domän.
- Att tömma namnet lämnar tillbaka det till ordlistorna, eftersom ett tomt namn alltid härleds.
- Ett logiskt namn som inte härleder något lämnar det fysiska namnet och dess tillstånd som de var: ett tomt namn förblir tomt, och ett härlett namn behåller sitt namn och tillhör fortfarande ordlistorna.
- En ny tabell eller kolumn börjar med ett tomt namn, så dess första logiska namn härleder det. En sekundärnyckelkolumn som en relation lägger till får sitt namn efter sin nyckel, och namnet räknas som ditt eget – se [Namn på sekundärnyckelkolumner](./relationship-editing.md#foreign-key-column-names).
- De namn som `Import` eller `Import and Add` från Schema SQL, GraphQL, DBML eller AML för in, och namnen i ett diagram som har skapats av en version från före fliken Ordlista, räknas som dina egna, så ett logiskt namn som skrivs på dem senare härleder ingenting.
- En [duplicerad tabell](./table-related-functions.md#duplicating-tables-and-memos), en kolumn som [flyttas till en annan tabell](./table-editing.md#rearranging-and-moving-columns) med sitt draghandtag, en inklistring av kopierade tabeller och `Import and Add` av en JSON-fil behåller varje namns tillstånd. Kolumner som klistras in i markerade tabeller som nya kolumner räknas som dina egna, utom när det inklistrade namnet är tomt och deras logiska namn härleder ett.
- [Härled fysiska namn igen](#derive-physical-names-again) lämnar tillbaka ett eget namn till ordlistorna, även ett importerat.

### Två kolumner, ett namn {#two-columns-one-name}

En kolumn härleder ingenting när en annan kolumn i dess tabell redan har det namn som den skulle härleda. Den behåller sitt namn, sitt tillstånd och sin domänkoppling, och bara dess logiska namn skrivs. Namnen jämförs utan hänsyn till skiftläge och blanksteg i början och slutet, på samma sätt som namn på sekundärnyckelkolumner.  
När en ändring skulle ge två kolumner samma namn, vilket `Replace All` eller `Derive Physical Names Again` över en tabell kan göra, får den första i tabellen namnet.  
Till exempel lägger en självrefererande relation på `members` med nyckeln `MBR_NO` till `MBR_NO_2`, som kopierar det logiska namnet `Member Number`. `Derive Physical Names Again` skulle ge den namnet `MBR_NO`, som nyckeln har, så den behåller `MBR_NO_2`.  
Tabeller har ingen sådan regel: två tabeller kan härleda samma namn.

## Härled fysiska namn igen {#derive-physical-names-again}

Använd `Derive Physical Names Again` när du har ändrat ett ords `Abbreviation` eller en terms `Physical Name` eller `Domain`, eftersom de ändringarna inte byter namn på något av sig själva. Kommandot lämnar tillbaka de namn som det omfattar till ordlistorna och härleder dem igen enligt reglerna ovan, även namn som du själv har skrivit. Det finns bara på ERD-fliken och inte i en skrivskyddad editor:

- Tabellens snabbmeny, direkt efter `Focus on this table` eller `Focus on selected tables`. Medan tabellen är en av två eller fler markerade tabeller omfattar `Derive Physical Names Again` alla, var du än högerklickar på tabellen. Annars ger ett högerklick på en kolumns rad `Derive Physical Name Again`, för bara den kolumnen, och ett högerklick på tabellhuvudet `Derive Physical Names Again`, för tabellens namn och varje kolumn.
- Arbetsytans snabbmeny, direkt efter `Name View`: `Derive Physical Names Again`, för varje tabell och kolumn i diagrammet. Det utelämnas medan diagrammet inte har någon tabell.
- [Snabbsökningen](./quick-search.md#what-the-palette-lists), som poster för den fokuserade kolumnen, den fokuserade tabellen, de markerade tabellerna och hela diagrammet.

![Förkortningen för Number ändras från NO till NUM på bladet Words, de fysiska namnen förblir MBR_NO och PAY_NO i diagrammet, och sedan gör Derive Physical Names Again i arbetsytans meny om dem till MBR_NUM och PAY_NUM, medan ORD_NO, som dess term ger, står kvar](/img/demo-derive-physical-names.webp)

Varje omfattad tabell och kolumn som har ett logiskt namn härleds igen. En kolumn får också den domän som dess term ger, och därmed domänens typ, som sprids längs relationerna medan [Synkronisera datatyp i relationer](./settings.md#relationship-datatype-sync) är på.  
Kommandot lämnar en tabell eller kolumn utan logiskt namn orörd, liksom en kolumn vars nya namn en annan kolumn i dess tabell har – se [Två kolumner, ett namn](#two-columns-one-name). Var och en av dessa behåller sitt namn och sitt tillstånd, ditt eget eller ordlistornas, och en kolumn behåller också sin domänkoppling.  
Ett logiskt namn som nu inte härleder något lämnar det fysiska namnet som det är men lämnar tillbaka det till ordlistorna, så att nästa logiska namn som du skriver härleder det.  
Kommandot ångras i ett steg, hur många namn, kopplingar och typer det än ändrar. Det registrerar inget steg bara när det inte ändrar något, och att lämna tillbaka ett eget namn till ordlistorna räknas som en ändring, även när namnet redan är det som de ger.

En terms eget `Physical Name` bildas inte på nytt av ändrade ord, så redigera termen innan du härleder igen.

## Domäner och datatyper {#domains-and-data-types}

En kolumn som är kopplad till en domän har domänens `Data Type`. En kolumn som kopplas får den typen direkt.  
När en domäns `Data Type` ändras, oavsett om den redigeras, klistras in eller importeras på bladet `Domains` eller ändras av en medarbetare eller en kodagent, får varje kolumn som är kopplad till domänen den nya typen i samma steg. Medan [Synkronisera datatyp i relationer](./settings.md#relationship-datatype-sync) är på fortsätter var och en av de ändringarna längs relationerna, på samma sätt som en inskriven ändring gör; medan den är av ändras bara de kopplade kolumnerna.  
Att byta namn på en domän ändrar bara det namn som kolumnernas domänceller visar.

En typändring som görs på bladet `Domains` ångras där, tillsammans med de kolumntyper som den gav – se [Ordlistans blad](./undo-redo.md#dictionary-sheets).  
Ett ångrat eller omgjort steg på ERD-fliken som kopplar en kolumn till en domän igen, eller som återställer en kolumn som är kopplad till en domän, ger kolumnen domänens typ som den är nu. Ett steg som återställer en annan typ kopplar från kolumnen.

### Koppla en kolumn {#linking-a-column}

En kolumn kopplas till en domän genom:

- Att välja domänen i kolumnens domäncell, som View Option → `Domain` visar, eller, i `Logical Names`, i den typcell som står i dess ställe – se [Domäncellen](./logical-names.md#the-domain-cell).
- Ett logiskt namn vars term ger en domän – se [Från en term](#from-a-term). Det sker bara medan namnet härleds, alltså inte för ett eget namn eller för en kolumn vars härledda namn en annan kolumn har.
- `Derive Physical Name Again` eller `Derive Physical Names Again`, som kopplar varje omfattad kolumn till domänen för dess term.
- En relation: en sekundärnyckelkolumn kopierar sin nyckels domän, tillsammans med nyckelns typ och logiska namn – se [Identifierande relationer](./relationship-editing.md#identifying-relationships). En nyckel vars kopia får en annan typ, som en serial-nyckels kopia gör, för inte vidare någon domän.
- Att duplicera dess tabell eller flytta den till en annan tabell med dess draghandtag, vilket i båda fallen behåller kopplingen. En inklistring av kopierade tabeller eller kolumner behåller den bara medan det här diagrammet listar domänen och domänen fortfarande har den kopierade kolumnens typ, så en kopia från ett annat diagram hamnar okopplad – se [Kopiera/klistra in tabeller och anteckningar](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` kopplar ingen kolumn.
- Ett domännamn som klistras in i en domäncell – se [Kopiera/klistra in kolumner](./table-editing.md#copyingpasting-columns).

### Koppla från {#unlinking}

- Att skriva en typ i cellen `DataType` för en kopplad kolumn, eller att godta ett förslag, kopplar från kolumnen så snart dess typ skiljer sig från domänens, och kolumnen behåller typen som du skrev – se [Autokomplettering av datatyp](./table-editing.md#datatype-autocomplete). Om du skriver domänens typ igen kopplas kolumnen inte på nytt; välj domänen i kolumnens domäncell i stället. En inklistring över cellen `DataType` och en kodagents typändring kopplar från på samma sätt.
- Medan Synkronisera datatyp i relationer är på frånkopplas i samma steg varje kolumn som en typändring når och vars nya typ skiljer sig från typen för dess egen domän, till exempel en sekundärnyckel som är kopplad till en egen domän. [Mappa kolumner](./relationship-editing.md#map-columns) kopplar på samma sätt från de kolumner som den ändrar typ på.
- `None` i domäncellen kopplar från kolumnen och behåller dess typ.
- Att ändra eller tömma en terms `Domain`, eller att ta bort en term, ändrar ingen kolumn.

### Ta bort en domän {#removing-a-domain}

Om du tar bort en domäns rad behåller dess kolumner sina typer, och deras kopplingar finns kvar. Kolumnerna visar ingen domän, och bladet `Checks` listar `Unknown domain` för var och en av dem medan bladet `Domains` fortfarande innehåller någon domän. Om du ångrar borttagningen på bladet `Domains` visas kopplingarna igen.  
Medan domänen är borta kopplas en sådan kolumn från för gott om du skriver in en annan typ än domänens, och likaså med `None` i dess domäncell.  
Filen utelämnar de kopplingarna när den sparas, så diagrammet öppnas igen med de kolumnerna okopplade.

En term som är kopplad till en borttagen domän visar en tom cell `Domain`, märkt som `Unknown domain`. `Delete` eller `Backspace` på cellen kopplar från termen – se [En terms domän](#a-terms-domain).

## Bladet Kontroller {#the-checks-sheet}

Bladet `Checks` listar vad ordlistornas kontroller hittar i ordlistorna och i diagrammets tabeller och kolumner. Kontrollerna läser bara: de ändrar ingenting.  
Varje kontroll körs bara medan bladet som den läser innehåller en rad, och ordkontrollerna bara medan bladet `Words` innehåller ett ord med ett namn, så ett diagram med tomma ordlistor listar ingenting.

![Customer Num ritat i rött och Order Stat i bärnstensgult i Logical Names, bladet Checks listar deras tre kontroller med ett rött antal, ett dubbelklick på raden Forbidden word går tillbaka till Customer Num i diagrammet, och det skrivs om till Member Number, vilket lämnar en kontroll](/img/demo-dictionary-checks.webp)

Dess tre kolumner är skrivskyddade:

- `Type` anger kontrollen – se [Vad varje kontroll hittar](#what-each-check-finds).
- `Target` anger ett ord, en term eller en domän med dess namn, en tabell med dess namn och en kolumn som `table.column`, där tabellen och kolumnen namnges så som [namnvisningen](./logical-names.md#beyond-the-canvas) namnger dem, med `unnamed` där visningen inte visar något namn.
- `Detail` visar vad kontrollen hittade och, efter `→`, vad ordlistorna erbjuder i stället, flera åtskilda med kommatecken, som `멤버 → 회원`. En tom sida visas som `—`, som i `— → NUMERIC(15)`.

Ordens kontroller kommer först, sedan termernas och domänernas, sedan tabell för tabell, där varje tabell följs av sina kolumner.  
Listan följer varje redigering så snart den görs, även en medarbetares och en kodagents, och varje byte av namnvisning.  
Antalet på knappen `Checks` är rött medan någon kontroll är ett fel, bärnstensgult medan alla är varningar och dämpat när det inte finns några.

Raderna kan inte redigeras, läggas till, tas bort, sorteras, importeras eller exporteras: listen visar inga verktyg, ett högerklick öppnar inte rutnätets meny, och Ångra och Gör om gör ingenting. Sökning, markering och kopiering fungerar som på de andra bladen.

`Enter` eller ett dubbelklick på en rad går till det som raden anger:

- Ett ord, en term eller en domän: fliken visar dess blad med den cell som kontrollen läser markerad, namnet eller en terms `Domain`, och dess rad överst i vyn. Bladets sökning töms om den döljer raden. En rad som sedan har tagits bort leder ingenstans.
- En tabell eller en kolumn: ERD-fliken visas med bara tabellen markerad och den cell som kontrollen läser fokuserad. Det är namnet, det logiska namnet eller domäncellen, eller, där raden inte ritar den cellen, den cell som ritas i dess ställe. Arbetsytan får tangentbordsfokus, och vyn flyttas enligt regeln i [Var ett hopp hamnar](./table-related-functions.md#where-a-jump-lands).

Ett dubbelklick på en kolumnrubrik, en kolumnkant, en rullningslist eller under raderna leder ingenstans.  
En kodagent listar samma kontroller, i samma ordning, med `erd_list_checks` – se [Ordlistornas kontroller](../../mcp/tools.md#dictionary-checks).

De andra tre bladen märker de celler som kontrollerna läser, ett namn eller en terms `Domain`, med röd eller bärnstensgul text på tonad bakgrund:

- Röd: ett namn som en annan rad på samma blad har, en terms `Domain` som kopplar till en borttagen domän och en `Term` som använder ett förbjudet ord.
- Bärnstensgul: en `Term` som använder en synonym eller ett oregistrerat ord.

En cell får den allvarligare av sina nivåer. Märkningarna visas även i en skrivskyddad editor, och själva bladet `Checks` färgas inte. Se [Märkningar på arbetsytan](#marks-on-the-canvas) för märkningarna på ERD-arbetsytan.

### Vad varje kontroll hittar {#what-each-check-finds}

| `Type` | Nivå | Hittar | `Detail`, till exempel |
| --- | --- | --- | --- |
| `Duplicate name` | Fel | Ett `Word`, en `Term` eller en `Domain` som en annan rad på samma blad också har. Var och en av raderna listas. | `Member` |
| `Unknown domain` | Fel | En kolumn eller en term som fortfarande är kopplad till en borttagen domän, medan bladet `Domains` innehåller någon domän | Den borttagna domänens namn |
| `Forbidden word` | Fel | Ett avsnitt av ett logiskt namn eller av en `Term` som ett ord listar i sina `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Varning | Ett avsnitt av en tabells eller en kolumns logiska namn, eller av en `Term`, som inget ord listar | `자` |
| `Synonym` | Varning | Ett avsnitt som ett ord listar i sina `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Varning | En tabell eller en kolumn vars logiska namn matchar en term men vars fysiska namn inte är det som termen ger | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Varning | En kolumn vars `DataType` inte är `Data Type` för den domän som den är kopplad till | `INT → NUMERIC(15)` |

- Namnen jämförs trimmade och med hänsyn till skiftläge, så `Member` och `member` är två namn, och ett tomt namn är aldrig en dubblett. Bladen nekar en redigering som skulle ge två rader samma namn, så `Duplicate name` dyker bara upp där två redigeringar har krockat, till exempel när två medarbetare namnger rader samtidigt, eller i en fil som har redigerats någon annanstans.
- Ordkontrollerna läser ett namn så som [Från orden](#from-the-words) beskriver och listar varje unikt avsnitt en gång per namn. `Forbidden word` och `Synonym` erbjuder det ord som listar avsnittet.
- `Physical name mismatch` jämför namnet, trimmat, med termens `Physical Name`, eller med det som termens ord bildar medan den inte har något, och säger ingenting medan termen inte ger något namn. En sekundärnyckelkolumn som har kopierat sin nyckels logiska namn får den här kontrollen så snart dess eget namn skiljer sig från termens, som `members_id → MBR_ID`. `Derive Physical Name Again` åtgärdar det, om inte en annan kolumn har det namnet.
- `Domain type mismatch` uppstår aldrig av redigeringar i en och samma editor, eftersom en kopplad kolumn alltid hamnar på sin domäns typ. Den kan uppstå när en medarbetare kopplar en kolumn medan en annan ändrar den domänens typ, eller i en fil som har skrivits någon annanstans. Om du väljer domänen igen i kolumnens domäncell får kolumnen domänens typ, och `None` kopplar från den. En koppling till en borttagen domän visas bara som `Unknown domain`.

### Märkningar på arbetsytan {#marks-on-the-canvas}

ERD-arbetsytan skriver ett namn som kontrollerna pekar ut i kontrollens färg:

- En cell för logiskt namn, i tabellhuvudet eller på en kolumns rad, är röd medan dess logiska namn använder ett förbjudet ord och annars bärnstensgul medan det använder en synonym eller ett ord som saknas på bladet `Words`.
- En cell för fysiskt namn, i tabellhuvudet eller på en rad, är bärnstensgul medan den term som dess logiska namn matchar ger ett annat fysiskt namn.

Bara de två celltyperna märks, aldrig domäncellen eller cellen `DataType`, så en kolumns `Unknown domain` och `Domain type mismatch` visas bara på bladet `Checks`.  
En cell märks bara för det som den ritar: `Physical Names` kan bara märka fysiska namn, `Logical Names` bara logiska namn och `Both Names` varje cell efter dess egna kontroller – se [Namnvisning](./logical-names.md#name-view). En tom cell behåller platshållarens färg, och tomma ordlistor märker ingenting.  
I tabellhuvudet för en tabell i en färgad [tabellgrupp](./table-groups.md) behåller en märkning sin färg bara medan den förblir läsbar mot gruppens färg; annars får namnet tabellhuvudets egen svarta eller vita färg.

Märkningarna visas på ERD-arbetsytan, i [tidsresan](./undo-redo.md#time-travel) och i förhandsgranskningen av [automatisk layout](./table-related-functions.md#auto-layout), även i en skrivskyddad editor. Fliken Visualisering, de två sidorna i [diff-visaren](./table-related-functions.md#diff-viewer) och en exporterad bild ritar inga.  
De följer varje ändring när den sker, oavsett om den gäller ett namn eller ett ord, en term eller en domän.

## Söka {#searching}

Sökfältet visar `Search` och finns på alla fyra bladen, även i en skrivskyddad editor. Varje blad har sin egen sökning.  
En rad matchar när en av de genomsökta cellerna innehåller texten, utan hänsyn till skiftläge, Unicode-normalform och blanksteg runt sökningen. En träff sträcker sig aldrig över två celler. De celler som söks:

- `Domains`: `Domain`, `Data Type` och `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` och `Description`.
- `Terms`: `Term`, `Physical Name` och `Description`.
- `Checks`: alla tre, så som de visas på visningsspråket.

En ny sökning placerar markeringen på den första cellen och rullar till toppen.  
Medan fältet innehåller text tömmer en knapp `x` med knappbeskrivningen `Clear search` fältet och lämnar textmarkören kvar i det. `Escape` i fältet tömmer det också.  
I fältet ångrar `Ctrl + Z` (Windows/Linux) eller `⌘ + Z` (Mac) det du har skrivit, inte bladet, och radtangenterna i [Lägga till och ta bort rader](#adding-and-deleting-rows) är texttangenter.  
`Add Row` och infogningarna tömmer först sökningen, eftersom en tom rad inte matchar någon sökning. En import behåller den.

## Markera och flytta {#selecting-and-moving}

Rutnätet markerar som ett kalkylblad gör:

- Ett klick markerar en cell, och en dragning markerar ett område och rullar vid bladets kant. `Shift + click` utökar markeringen från den aktiva cellen, och `Ctrl + click` (Windows/Linux) eller `⌘ + click` (Mac) lägger till ytterligare ett område.
- En kolumnrubrik markerar sin kolumn, ett radnummer sin rad och det övre vänstra hörnet alla celler, som `Ctrl + A` (Windows/Linux) eller `⌘ + A` (Mac) gör.
- På en Mac är `Ctrl + click` ett högerklick – se [Rutnätets meny](#the-grids-menu).

Med tangentbordet:

- Piltangenterna flyttar en cell och går, med `Ctrl` (Windows/Linux) eller `⌘` (Mac) nedtryckt, till bladets kant i den riktningen.
- `Home` och `End` går till radens första och sista cell, och med `Ctrl` eller `⌘` nedtryckt till bladets första och sista cell.
- `Page Up` och `Page Down` flyttar en skärm med rader.
- Om du håller ned `Shift` med någon av tangenterna ovan utökas markeringen i stället.
- `Tab` och `Shift + Tab` flyttar åt höger och vänster, och `Shift + Enter` flyttar uppåt. `Enter` ensamt redigerar cellen – se [Redigera celler](#editing-cells).

När rader försvinner under markeringen, genom en ångring eller genom att en medarbetare tar bort dem, dras markeringen tillbaka in bland de rader som finns kvar.

Dra i en kolumnrubriks högra kant för att ändra kolumnens storlek, eller dubbelklicka på kanten för att anpassa kolumnen efter den bredaste texten bland de rader som syns. Ingen tangent ändrar storlek på en kolumn.

## Redigera celler {#editing-cells}

Om du skriver på den markerade cellen ersätts dess värde. `Enter`, `F2` eller ett dubbelklick redigerar värdet som det är, med textmarkören i slutet.  
En cell rymmer en rad, så ett tabbtecken eller en radbrytning som klistras in i den blir ett blanksteg.

- `Enter` skriver redigeringen och flyttar nedåt, och `Tab` skriver den och flyttar åt höger. Med `Shift` flyttar de uppåt eller åt vänster.
- Ett klick någon annanstans, eller att tangentbordsfokus lämnar rutnätet, skriver den också.
- `Escape` avbryter den.

![Redigering av bladet Words: NUM skrivs över en cell, följt av ett tryck på Enter, en rad infogas med ⌥ + Enter och fylls i med Tab, raderna sorteras efter Word i rutnätets meny, och sedan söks det efter ord och sökningen töms med Esc](/img/demo-dictionary-editing.webp)

En redigering som lämnar värdet som det var skriver ingenting, och en skriven redigering är ett steg i bladets ångrahistorik, hur mycket som än skrevs.  
`Delete` eller `Backspace` tömmer, när ingen redigering är öppen, varje markerad cell i ett steg.  
Medan en redigering är öppen verkar tangenterna för att ångra och göra om på det du har skrivit i cellen, och radtangenterna skriver text – se [Tangenter på fliken](#keys-on-the-tab).  
Varje cell på `Checks`, och varje cell i en skrivskyddad editor, är skrivskyddad och öppnar ingen redigering.

När någon rad i en redigering, en inklistring eller en tömning nekas sparas ingenting av den, och ett felmeddelande anger varför, räknar raderna och namnger de tre första:

- Ett namn som en annan rad på bladet har, eller som en annan rad i samma inklistring skriver: `Nothing saved: 1 row shares a name with another row (Member)` eller `Nothing saved: 2 rows share a name with another row (…)`. Namnen jämförs trimmade och med hänsyn till skiftläge, så `Member` och `member` skiljer sig åt. Ett tomt namn nekas aldrig.
- En terms `Domain` angiven som text som ingen domän på bladet `Domains` har: `Nothing saved: 1 row names an unknown domain (…)`.
- En rad som en medarbetare tog bort medan du redigerade den: `Nothing saved: the row was removed`.

En skrivning kan nå utanför sin cell:

- En term som får en `Term` medan dess `Physical Name` är tomt får det namn som dess ord bildar, när de bildar ett – se [Från orden](#from-the-words). Det sker en gång: namnet bildas inte på nytt när orden ändras senare.
- En domäns nya `Data Type` ger varje kolumn som är kopplad till domänen en ny typ, i samma steg i ångrahistoriken – se [Domäner och datatyper](#domains-and-data-types).

### En terms domän {#a-terms-domain}

`Enter`, `F2` eller ett dubbelklick på en terms cell `Domain` öppnar en lista under cellen, eller ovanför den där det finns mer utrymme, med ett sökfält som visar `Domain`.  
Listan innehåller `None` och sedan varje namngiven domän i samma ordning som på bladet `Domains`, och framhävningen börjar på den domän som termen är kopplad till, eller på `None`. Om du skriver ett tecken på cellen öppnas listan redan filtrerad efter det tecknet.

- Det du skriver begränsar listan till de domäner vars namn innehåller texten, utan hänsyn till skiftläge, tar bort `None` och framhäver den första träffen.
- `↑` och `↓` flyttar framhävningen, som går runt vid båda ändarna.
- `Enter` eller `Tab` väljer den framhävda raden, och ett klick den rad som du klickar på, som ett steg i ångrahistoriken. Termen kopplas till exakt den domän som väljs, även en av två domäner med samma namn, och `None` kopplar från den.
- `Escape` eller ett klick utanför stänger listan utan att skriva något av det som har skrivits in.

När det inte finns någon namngiven domän på bladet `Domains` öppnas fältet utan lista.  
Inklistrad text kopplar termen till den första listade domänen med det namnet, tom text kopplar från, och text som är lika med det som cellen visar behåller kopplingen som den är. Alla andra namn nekas – se [Redigera celler](#editing-cells). `Delete` eller `Backspace` på cellen kopplar från termen, även från en borttagen domän.

## Kopiera och klistra in {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) eller `⌘ + C` (Mac) kopierar markeringen som tabbavgränsad text, en textrad per rad, så som kalkylblad skriver den, så att den klistras in i ett kalkylblad som celler. Ett tabbtecken eller en radbrytning i ett värde blir ett blanksteg.  
Flera områden kopieras tillsammans bara när de omfattar samma rader, sida vid sida, eller samma kolumner, ovanför varandra. Annars kopieras ingenting, och felmeddelandet `Nothing copied: the ranges share no rows or columns` visas.

`Ctrl + V` (Windows/Linux) eller `⌘ + V` (Mac) klistrar in tabbavgränsad text, som celler som har kopierats från ett kalkylblad, från den aktiva cellen nedåt och åt höger:

- Citattecken klistras in som text, så en kalkylbladscell som innehåller en radbrytning klistras inte in som en cell.
- Ett enskilt värde fyller varje markerat område.
- Rader efter den sista raden läggs till som nya rader, i ordning, så en inklistring i ett tomt blad fyller det.
- Kolumner efter den sista kolumnen utelämnas, och när resten har sparats talar meddelandet `Columns past the last one weren't pasted` om det.
- En inklistring av flera celler markerar sedan det block som den skrev.

En inklistring ångras i ett steg, inklusive de rader som den lägger till, och nekas i sin helhet vid ett dubblettnamn eller en okänd domän – se [Redigera celler](#editing-cells).  
En kopiering, en inklistring eller en tömning över mer än en miljon celler gör ingenting, och felmeddelandet `Nothing done: the selection covers too many cells` visas.  
Klipp ut, `Ctrl + X` (Windows/Linux) eller `⌘ + X` (Mac), gör ingenting på ett blad. Kopiering och inklistring på den här fliken når aldrig diagrammet, och medan en cellredigering är öppen verkar de på texten i cellen.

## Lägga till och ta bort rader {#adding-and-deleting-rows}

`Add Row` lägger till en tom rad i slutet av bladet. Den tömmer sökningen, markerar den nya radens första cell och ger rutnätet tangentbordsfokus, så att det du skriver fyller den cellen.  
`Delete Rows` tar bort varje rad som markeringen omfattar, i vilken kolumn som helst, och en enda ångring sätter tillbaka dem alla på sina platser. Dess knappbeskrivning anger den tangent som gör samma sak.

Med tangentbordsfokus i rutnätet och ingen cell under redigering:

- `Alt + Enter` (Windows/Linux) eller `⌥ + Enter` (Mac) infogar lika många tomma rader under markeringen som den omfattar.
- `Alt + Shift + Enter` (Windows/Linux) eller `⌥ + Shift + Enter` (Mac) infogar dem ovanför.
- `Alt + Backspace` eller `Alt + Delete` (Windows/Linux), eller `⌥ + Backspace` eller `⌥ + Delete` (Mac), tar bort de rader som markeringen omfattar.

De gör samma sak som alternativen för att infoga och ta bort rader i rutnätets meny – se [Rutnätets meny](#the-grids-menu). En infogning tömmer sökningen och placerar de nya raderna direkt ovanför den första rad som markeringen omfattar, eller direkt under dess sista. Den markerar dem i den första kolumnen, med den första av dem aktiv, och ångras i ett steg.

De här tangenterna är bindningarna `Add Column` och `Remove Column` på fliken [Kortkommandon](./settings.md#shortcuts), så ett värdprogram som binder om dem med [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) flyttar dem också. `Alt + Shift + Enter` är tangenten för `Add Column` med `Shift` tillagd och har ingen egen rad där.  
I en öppen redigering och i sökfältet är de texttangenter, så på en Mac tar `⌥ + Backspace` bort ett ord. På `Checks` och i en skrivskyddad editor gör de ingenting. På den här fliken lägger de aldrig till eller tar bort en kolumn i en tabell.  
I Obsidian når de fliken även där ett kortkommando i Obsidian använder samma tangent.

En rad som aldrig har fyllts i, eller en som har tömts på alla värden, visas på sitt blad och når medarbetare, men filen utelämnar den, så den är borta när diagrammet öppnas igen.

## Rutnätets meny {#the-grids-menu}

Högerklicka på en cell på `Domains`, `Words` eller `Terms` för att öppna rutnätets meny. En cell utanför markeringen blir först den nya markeringen.  
Ett högerklick under den sista raden eller till höger om den sista kolumnen öppnar menyn för markeringen som den är, så på ett tomt blad öppnas den var som helst under kolumnrubrikerna. Menytangenten eller `Shift + F10` öppnar den för den aktiva cellen.

- `Insert 1 row above`, `Insert 1 row below` och `Delete 1 row`, som vart och ett räknar de rader som markeringen omfattar, som i `Insert 3 rows above`, med sin tangent till höger – se [Lägga till och ta bort rader](#adding-and-deleting-rows).
- `Sort by <column>, ascending` och `Sort by <column>, descending`, som anger den kolumn som du högerklickade på, som i `Sort by Word, ascending` – se [Sortera](#sorting). De utelämnas till höger om den sista kolumnen.
- `Import CSV` och `Export CSV`, som gör det som knapparna i listen gör – se [Importera och exportera CSV](#importing-and-exporting-csv).

När ingen rad visas, på ett tomt blad eller under en sökning som inte matchar något, visas bara `Insert 1 row below`, `Import CSV` och `Export CSV`.  
`Checks` och en skrivskyddad editor öppnar webbläsarens egen meny i stället, och det gör även ett högerklick på en kolumnrubrik eller en rullningslist.  
Menyn stängs vid ett val, vid `Escape`, vid ett tryck någon annanstans på fliken, när markeringen eller bladet ändras och när bladets rader ändras, genom din redigering eller en medarbetares.

## Sortera {#sorting}

`Sort by <column>, ascending` och `Sort by <column>, descending` ändrar ordningen på själva raderna i bladet, inte bara i vyn. Den nya ordningen sparas i filen, syns för medarbetare och följs av `Export CSV`, och en enda ångring återställer den gamla ordningen.  
Raderna jämförs efter den text som cellen visar, en terms `Domain` efter domänens namn, i visningsspråkets alfabetiska ordning, och tal jämförs efter värde, så `2` kommer före `10`. Tomma celler hamnar sist i båda riktningarna, och rader som jämförs som lika behåller sin ordning. Att sortera ett blad som redan har den ordningen registrerar ingenting.  
Sökningen förblir som den var, och det gör även markeringen, vars celler nu innehåller andra rader.

## Importera och exportera CSV {#importing-and-exporting-csv}

Vart och ett av `Domains`, `Words` och `Terms` importeras från en CSV-fil och exporteras till en. De här filerna tillhör fliken Ordlista: `Import` och `Export` i arbetsytans snabbmeny varken läser eller skriver dem – se [Importera eller exportera filer](./file-import-export.md).

### Importera {#importing}

`Import CSV`, i listen eller i rutnätets meny, öppnar webbläsarens egen filväljare för `.csv`-filer, inte värdprogrammets importdialogruta. Om du väljer samma fil igen importeras den igen.  
Filen hamnar i den ordlista som dess rubrikrad anger, oavsett vilket blad som visas, och fliken visar sedan det bladet och ger dess rutnät tangentbordsfokus. Bladet behåller sin sökning, markering och rullningsposition, så rader som sökningen döljer, eller rader som läggs till nedanför vyn, förblir utom synhåll.  
Filen läses som UTF-8, med eller utan byteordningsmärke (BOM), eller som EUC-KR när den inte är giltig UTF-8, vilket gäller äldre filer enligt standarden för offentliga data.

![Fliken Ordlista öppnas från verktygsfältet, och sedan importeras domäner, ord och termer med Import CSV, där varje fil växlar fliken till sitt eget blad och rapporterar vad den lade till](/img/demo-dictionary-import.webp)

Så hamnar raderna:

- Varje rad med ett namn uppdaterar bladets rad med det namnet, i de fält som filen har kolumner för. Kolumner som saknas i filen lämnar de fälten som de är. Namnen jämförs trimmade och med hänsyn till skiftläge.
- Namn som saknas på bladet läggs till efter dess sista rad, i filens ordning.
- En import tar aldrig bort en rad.
- En rad med ett tomt namn hoppas över. När filen innehåller ett namn två gånger vinner den senare raden, och den tidigare räknas som överhoppad. Tomma rader i filen räknas inte som rader.
- En terms domän hittas efter sitt namn, den första domänen med det namnet, och ett namn som ingen domän har lämnar termen okopplad, så importera domänerna först.

En import är ett steg i det bladets ångrahistorik.  
Meddelandet visar sedan till exempel `1 added · 1 updated · 2 skipped`. En rad som är likadan som bladets räknas varken som tillagd eller uppdaterad, så en ny import av samma fil ändrar ingenting och registrerar inget steg.  
När filens termer anger domäner som saknas i diagrammet namnger en andra rad de tre första, som i `4 unknown domains: 연월일, 금액, 번호`.  
En fil vars rubrikrad inte matchar någon layout, eller matchar två, för inte in något, och felmeddelandet `Couldn't read this file as words, terms or domains` visas.

### Fillayouter {#file-layouts}

Varje ordlista läser två layouter. Den första är editorns egen, som `Export CSV` skriver, med fältnamnen som rubrikrad:

| Ordlista | Rubrikrad | En fil behöver |
| --- | --- | --- |
| Ord | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Termer | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domäner | `name,category,dataType,description` | `name`, `dataType` |

Kolumnerna kan komma i valfri ordning, en terms `domain` innehåller domänens namn, och alla andra kolumner ignoreras. Skiftläget spelar roll i rubrikraden, och cellerna läses exakt som de är skrivna, blanksteg inräknade.

Den andra är layouten för filerna enligt Koreas standard för offentliga data (공통표준):

| Ordlista | En fil behöver | Läses också |
| --- | --- | --- |
| Ord | `공통표준단어명` | `공통표준단어영문약어명` (förkortning), `공통표준단어 영문명` (engelskt namn), `공통표준단어 설명` (beskrivning), `이음동의어 목록` (synonymer), `금칙어 목록` (förbjudna ord) |
| Termer | `공통표준용어명` | `공통표준용어영문약어명` (fysiskt namn), `공통표준도메인명` (domän, efter namn), `공통표준용어설명` (beskrivning), `용어 이음동의어 목록` (synonymer) |
| Domäner | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (kategori), `공통표준도메인설명` (beskrivning), `데이터길이`, `데이터소수점길이` |

En domäns `데이터타입`, `데이터길이` och `데이터소수점길이` slås ihop till en datatyp: `NUMERIC(15,2)`, `CHAR(8)`, bara typen där det inte finns någon längd, som `DATE`, och en skala på 0 utelämnas, som i `NUMERIC(15)`.  
I de här filerna trimmas cellerna, och andra kolumner, som revisionshistoriken, ignoreras.  
I båda layouterna spelar blanksteg i ett rubriknamn ingen roll.

### Exportera {#exporting}

`Export CSV`, i listen eller i rutnätets meny, sparar det visade bladet i editorns egen layout: varje rad i bladets ordning, oavsett vad sökningen visar, med en terms domän skriven med sitt namn, eller tom för en borttagen domän.  
Filen är UTF-8 med byteordningsmärke och CRLF-radslut, och bara ett fält som innehåller ett citattecken, ett kommatecken eller en radbrytning omges av citattecken. Den går att öppna i ett kalkylblad och importeras tillbaka till samma rader.  
Den får namnet `<database name>-<timestamp>-words.csv`, `-terms.csv` eller `-domains.csv` och sparas på samma sätt som editorns andra exporter – se [Exportera](./file-import-export.md#exporting).

`Checks` har ingen export, och en skrivskyddad editor erbjuder ingen import eller export.

## Ångra och gör om {#undo-and-redo}

`Domains`, `Words` och `Terms` har var sin egen ångrahistorik, skild från diagrammets. På den här fliken verkar `Ctrl + Z` och `Ctrl + Shift + Z` (Windows/Linux) eller `⌘ + Z` och `⌘ + Shift + Z` (Mac), och `Undo` och `Redo` i verktygsfältet, på det visade bladet, och verktygsfältet visar ingen `Time Travel`. På `Checks` gör de ingenting.  
Ångra på ERD-fliken tar aldrig tillbaka en redigering på ett blad – se [Ordlistans blad](./undo-redo.md#dictionary-sheets).

## Tangenter på fliken {#keys-on-the-tab}

Medan tangentbordsfokus ligger på fliken verkar de här kortkommandona i editorn – se [Kortkommandon](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac), öppnar [snabbsökningen](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac), byter till ERD-fliken och öppnar [utforskaren](./explorer.md#opening-and-closing) med dess sökning.
- `Undo` och `Redo` verkar på det visade bladet – se [Ångra och gör om](#undo-and-redo).
- `Add Column` och `Remove Column` infogar och tar bort rader – se [Lägga till och ta bort rader](#adding-and-deleting-rows).

Medan en cellredigering är öppen, även en terms domänlista, gör `Search` och `Toggle Explorer` ingenting, så den inskrivna texten går inte förlorad.

Alla andra kortkommandon i editorn stannar på fliken och når aldrig arbetsytan: `Alt + N` (Windows/Linux) eller `⌥ + N` (Mac) lägger inte till någon tabell, och `Delete` och `Backspace` tar inte bort något på arbetsytan.  
Rutnätets egna tangenter verkar på bladet i stället: `Enter` redigerar cellen, `Delete` och `Backspace` tömmer de markerade cellerna, `Ctrl + A` (Windows/Linux) eller `⌘ + A` (Mac) markerar alla celler, och `Escape` avbryter en redigering, stänger rutnätets meny eller tömmer sökfältet. Kopiera, klipp ut och klistra in stannar också på fliken – se [Kopiera och klistra in](#copying-and-pasting).

## Skrivskyddade editorer {#read-only-editors}

I en editor med [`readonly`](../../api/erd-editor-element.md#readonly) öppnas fliken och visar alla blad.  
Att byta blad, söka, markera, rulla, ändra kolumnernas storlek och kopiera fungerar som vanligt, och det gör även att gå till en kontroll från `Checks` med `Enter` eller ett dubbelklick. Kontrollernas märkningar visas också.

Ingen cell tar emot en redigering, en inklistring eller en tömning, och varje cell som ingen kontroll märker ritas på den grå bakgrunden för skrivskyddade celler.  
`Add Row`, `Delete Rows`, `Import CSV` och `Export CSV` är dolda, radtangenterna gör ingenting, och ett högerklick öppnar webbläsarens meny. Ett tomt blad visar ingen ledtext, och verktygsfältet visar varken `Undo` eller `Redo`.

## Medarbetare och filen {#collaborators-and-the-file}

Diagrammets fil innehåller orden, termerna och domänerna i bladens ordning, även en ordning som en sortering har gett, och utelämnar en rad som inte innehåller något värde.  
Den innehåller också varje tabells och kolumns logiska namn, huruvida varje fysiskt namn tillhör ordlistorna och varje kolumns domänkoppling medan domänen är listad. Kontrollerna och märkningarna beräknas utifrån detta och sparas aldrig.

I en [session för gemensam redigering](../../api/advanced/collaborative-editing.md) ser editorerna varandras redigeringar i ordlistorna så snart de görs, även sorteringar och infogningar. Var och en behåller sitt eget blad, sin sökning och sin markering, och historikerna för dess blad innehåller bara dess egna redigeringar.  
En redigering eller en inklistring på en rad som en medarbetare under tiden har tagit bort sparar ingenting, och meddelandet `Nothing saved: the row was removed` visas.  
En editor från en version före fliken Ordlista sparar diagrammet utan dess logiska namn, domänkopplingar och ordlistor – se [Blanda versioner](../../api/advanced/collaborative-editing.md#mixing-releases).

`Import` från Schema SQL, GraphQL, DBML eller AML behåller ordlistorna, `Import` från JSON ersätter dem med filens, och `Import and Add` för inte in några – se [Importera externa filer](./file-import-export.md#importing-external-files).  
En kodagent redigerar orden, termerna och domänerna, anger logiska namn och domäner, härleder fysiska namn igen och listar kontrollerna via MCP-servern – se [Ordlistor](../../mcp/tools.md#dictionaries) och [Ordlistornas kontroller](../../mcp/tools.md#dictionary-checks). Den har inget verktyg för CSV-filer.
