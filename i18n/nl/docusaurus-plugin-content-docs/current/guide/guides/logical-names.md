---
sidebar_position: 4
description: Geef tabellen en kolommen logische namen, toon met de naamweergave fysieke namen, logische namen of beide, vul termnamen aan terwijl je typt, koppel kolommen aan domeinen en zie waar namen de weergave nog meer volgen.
---

# Logische namen

Een tabel en elk van haar kolommen kunnen naast hun naam een logische naam hebben. De logische naam is de naam die mensen lezen, zoals `Customer Name` voor `CUST_NM`. De naam zelf is de fysieke naam, de naam die [Schema SQL](./schema-sql.md) en de [Codegenerator](./code-generator.md) schrijven.  
De naamweergave bepaalt welke van de twee het ERD-canvas toont: de namen, de logische namen of beide — zie [Naamweergave](#name-view).  
Een logische naam kan de tabel of kolom ook een fysieke naam geven, afgeleid uit de woorden en termen op het tabblad [Woordenboek](./dictionary.md) — zie [Fysieke namen afleiden](./dictionary.md#deriving-physical-names).  
Een kolom kan worden gekoppeld aan een domein, een gegevenstype met een naam, zoals `Name` voor `VARCHAR(100)`, dat op het blad `Domains` van het tabblad Woordenboek staat, en heeft dan het gegevenstype van het domein — zie [De domeincel](#the-domain-cell).  
Schema SQL kan elke logische naam in een lege opmerking schrijven — zie [Logische namen als opmerkingen](./schema-sql.md#logical-names-as-comments).

## Naamweergave {#name-view}

Er zijn drie weergaven, en elke weergave toont de kop en de rijen van een tabel op haar eigen manier:

- `Physical Names`, de weergave van een nieuw diagram, toont geen logische naam. De kop toont de naam van de tabel en, zolang View Option → `Table Comment` aanstaat, haar opmerking, en elke rij toont haar cellen in de [kolomvolgorde](./settings.md#adjusting-column-order).
- `Logical Names` toont de logische naam op de plaats van elke naam: in de kop, en in elke rij op de plaats waar `Name` in de kolomvolgorde staat. De typecel van een rij kan voor het domein van de kolom staan, zoals hieronder beschreven.
- `Both Names` toont de logische naam naast de naam. De kop toont de logische naam, daarna de naam en daarna de opmerking, en elke rij krijgt een cel `Logical Name`, die de kolomvolgorde standaard direct vóór `Name` plaatst.

Een lege logische naam, ook een die alleen uit spaties bestaat, toont een gedimde vervanger. In de weergave `Logical Names` is dat de naam die op zijn plaats wordt getoond, of de tijdelijke aanduiding `table` of `column` als ook de naam leeg is. In de weergave `Both Names` is het de tijdelijke aanduiding `logical`.

In de weergave `Logical Names` toont een kolom die is gekoppeld aan een domein met een naam op het blad `Domains` van het tabblad Woordenboek, in haar typecel de naam van dat domein in plaats van haar gegevenstype. Elke andere kolom toont daar haar gegevenstype.  
Zolang View Option → `Domain` aanstaat, heeft het domein een eigen cel en houdt de typecel het gegevenstype, zodat geen enkele rij het domein twee keer toont — zie [De domeincel](#the-domain-cell).

Elke tabel is zo breed als de cellen die ze in de weergave toont, dus het wisselen van weergave wijzigt de grootte van de tabellen en legt hun verbindingslijnen opnieuw aan. Geen enkele tabel wordt verplaatst.  
Bij `70%` en lager klapt een tabel in tot haar naam — zie [In- en uitzoomen](./table-related-functions.md#zoom-inout). In de weergave `Logical Names` toont ze de logische naam, of gedimd de naam zolang er geen is. In de weergave `Both Names` toont ze de logische naam met de naam op een regel eronder, of alleen de naam zolang er geen logische naam is.

De controles van het Woordenboek kunnen een logische naam of een naam in rood of amber weergeven waar ze die signaleren — zie [Markeringen op het canvas](./dictionary.md#marks-on-the-canvas).

## De weergave wisselen {#switching-the-view}

Op vier plaatsen kun je de weergave wisselen, en elk ervan toont `Physical Names`, `Logical Names` en `Both Names`, met de weergave die van kracht is aangevinkt:

- De knop `Name View` op de [canvaswerkbalk](./table-related-functions.md#canvas-toolbar), tussen de vier relatienotaties en de zen-modus. Hij toont de naam van de weergave die van kracht is, met een pijl omlaag, en zijn knopinfo toont `Name View`. Een klik opent de lijst boven de werkbalk, en een keuze sluit die.
- `Name View` in het contextmenu van het canvas, direct na `View Option`: een submenu met de drie weergaven. Het menu blijft na een keuze open.
- Dezelfde lijst op de werkbalk van het tabblad Visualisatie in de modus `Flow`, na het menu voor de rijweergave — zie [Werkbalk](./visualization.md#toolbar).
- `Name View` in [Snel zoeken](./quick-search.md#what-the-palette-lists), direct na `Tab` en alleen op het ERD-tabblad in de lijst. Het submenu ervan opent met de markering op de weergave die van kracht is.

![De naamweergave via de canvaswerkbalk op Logical Names zetten, via het canvasmenu op Both Names en weer terug op Physical Names, waarbij de kolom ordered_at, die geen logische naam heeft, eerst gedimd en daarna als de tijdelijke aanduiding logical wordt getoond](/img/demo-name-view.webp)

Alle vier stellen dezelfde weergave in. De bovenste werkbalk heeft er geen knop voor.

Het wisselen van weergave behoudt de selectie en wordt niet vastgelegd in de [geschiedenis](./undo-redo.md#what-the-history-records).  
De focus op een cel die de nieuwe weergave niet toont, gaat naar de cel die op haar plaats wordt getoond: de naam en de logische naam vervangen elkaar, net als het type en het domein. Een celeditor die op die cel open is, sluit. Het in- of uitschakelen van View Option → `Domain` verplaatst de focus op dezelfde manier.  
Zolang de vergrendeling `Name View` aanstaat, zoals in een nieuw diagram, verandert het wisselen alleen je eigen scherm en houdt het bestand de weergave waarop het is vergrendeld. Staat de vergrendeling uit, dan slaat het bestand de weergave op waarnaar je wisselt — zie [Vergrendeling](./settings.md#lock).

## Een logische naam invoeren {#writing-a-logical-name}

De weergave `Physical Names` toont geen logische naam, dus wissel naar `Logical Names` of `Both Names` om er een op het canvas in te voeren:

- In de weergave `Logical Names` bevatten de naamcellen van de kop en de rijen de logische namen, dus in deze weergave kan een fysieke naam niet op het canvas worden bewerkt.
- In de weergave `Both Names` bevatten de cellen van de logische naam de logische namen en de naamcellen de fysieke namen.

De cel van een logische naam bewerk je zoals elke andere cel: begin met `Enter` of een dubbelklik — zie [Tabellen bewerken](./table-editing.md). Geopend op een lege logische naam toont de editor wat de cel als tijdelijke aanduiding toonde: de naam in de weergave `Logical Names`, `logical` in de weergave `Both Names`.  
Typen wijzigt alleen de logische naam. De fysieke naam wordt daaruit afgeleid zodra de editor met een gewijzigde logische naam sluit (`Enter`, `Tab`, `Escape` of een klik elders), als een eigen stap in de geschiedenis na wat je hebt getypt. Een fysieke naam die je zelf hebt ingevoerd, blijft zoals hij is — zie [Fysieke namen afleiden](./dictionary.md#deriving-physical-names).

`Tab` en `Shift + Tab` lopen langs de cellen die de weergave toont, in hun volgorde — zie [De Tab-toets](./table-editing.md#tab-key):

- In de weergave `Logical Names` de logische naam van de kop, daarna de opmerking ervan en daarna de cellen van elke rij in de kolomvolgorde, met de logische naam op de plaats van de naam.
- In de weergave `Both Names` de logische naam, de naam en de opmerking van de kop, daarna de cellen van elke rij in de kolomvolgorde, standaard met de cel `Logical Name` als eerste.

`Alt + Enter` (Windows/Linux) of `⌥ + Enter` (Mac) voegt een kolom toe en focust de eerste cel die haar rij tekent. Onder de standaardkolomvolgorde is dat haar naamcel, die in de weergave `Logical Names` haar logische naam is, en in `Both Names` haar cel `Logical Name`, zodat je met de logische naam kunt beginnen — zie [Kolommen toevoegen](./table-editing.md#adding-columns).

Een kolom met refererende sleutel die een relatie toevoegt, neemt naast het type ook de logische naam en het domein van haar sleutel over — zie [Identificerende relaties](./relationship-editing.md#identifying-relationships).  
Kolommen naar een spreadsheet kopiëren en kolommen vanuit een spreadsheet plakken gebruiken de cellen die de weergave toont, inclusief de cellen van de logische naam en de domeincellen — zie [Kolommen kopiëren/plakken](./table-editing.md#copyingpasting-columns).

## Termnamen aanvullen {#completing-term-names}

Terwijl je typt in de cel van een logische naam, die van de kop of die van een rij, biedt een lijst onder de cel de termen aan waarvan de naam met de tekst begint, ongeacht hoofdlettergebruik en spaties ervoor. Een term is een volledige logische naam op het blad `Terms` van het tabblad Woordenboek, met de fysieke naam en het domein die hij oplevert. De lijst toont er maximaal acht, gesorteerd op naam, met de getypte tekst gemarkeerd. Zolang geen enkele term zo begint, is er geen lijst.

![In Both Names een kolom toevoegen met ⌥ + Enter, Order Amount kiezen uit de termenlijst onder haar logische naam om ORD_AMT, DECIMAL(10,2) en het domein Amount in te vullen, en daarna Order Date typen, waarvan de woorden de naam ORD_DT opleveren wanneer Enter de editor sluit](/img/demo-logical-names.webp)

- Eerst is niets gemarkeerd. `↑` en `↓` verplaatsen de markering, die aan beide uiteinden rondloopt, en de gemarkeerde term toont de toets `Enter`.
- `Enter` op een gemarkeerde term schrijft de naam ervan als logische naam en beëindigt het bewerken. Tenzij je de fysieke naam zelf hebt ingevoerd, leidt dezelfde stap in de geschiedenis de fysieke naam meteen af uit de term en geeft een kolom ook het domein van de term. `Enter` zonder markering beëindigt het bewerken en behoudt wat je hebt getypt.
- Een klik op een term schrijft die op dezelfde manier en laat de editor open.
- `Escape` sluit, zolang de lijst wordt getoond, alleen de lijst, en de volgende `Escape` beëindigt het bewerken.
- `Tab` gaat verder met de tekst zoals getypt, en de fysieke naam wordt daaruit afgeleid wanneer de editor sluit.
- Zolang een invoermethode aan het samenstellen is, horen de pijltoetsen en `Enter` bij die samenstelling.

Wat een term een tabel of kolom oplevert, staat beschreven in [Fysieke namen afleiden](./dictionary.md#deriving-physical-names).

## De domeincel {#the-domain-cell}

View Option → `Domain`, dat standaard uitstaat, geeft elke rij in elke weergave een domeincel, op de plaats waar `Domain` in de kolomvolgorde staat, standaard direct na `DataType` — zie [Weergaveopties voor tabellen](./table-related-functions.md#table-view-options).  
De cel toont de naam van het domein waaraan de kolom is gekoppeld, of gedimd de tijdelijke aanduiding `domain` voor een kolom die aan geen enkel domein op het blad `Domains` is gekoppeld.

![View Option → Domain inschakelen, in de domeincel van PAY_AMT Amount kiezen nadat de lijst met amo is ingeperkt, op het tabblad Woordenboek het Data Type van Amount wijzigen in DECIMAL(12,2) en zien dat de kolom is meeveranderd, en daarna NUMERIC(12,2) in de kolom typen, waardoor die wordt ontkoppeld](/img/demo-domains.webp)

`Enter` of een dubbelklik opent een kiezer over de cel: een leeg veld met de tekst van de cel als tijdelijke aanduiding, en daaronder `None` en daarna elk domein met een naam van het blad `Domains`, in de volgorde van het blad. De markering begint op het gekoppelde domein, of op `None`.

- Typen toont alleen de domeinen waarvan de naam de tekst bevat, ongeacht hoofdlettergebruik, laat `None` weg en markeert het eerste. `↑` en `↓` verplaatsen de markering.
- `Enter` koppelt het gemarkeerde domein, en een klik koppelt het aangeklikte domein. Beide geven de kolom het gegevenstype van het domein, als één stap in de geschiedenis, en beëindigen het bewerken. `None` ontkoppelt de kolom en behoudt haar gegevenstype.
- Wat je typt, wordt nooit in de kolom geschreven. Zolang het blad `Domains` geen domein met een naam heeft, is er geen lijst, en beëindigt `Enter` het bewerken zonder iets te schrijven.

Als View Option → `Domain` uitstaat, opent in de weergave `Logical Names` een typecel die de naam van een domein toont, deze kiezer, en een typecel die een gegevenstype toont, de editor voor gegevenstypen — zie [Gegevenstypen automatisch aanvullen](./table-editing.md#datatype-autocomplete). Schakel de domeincel in om een domein te koppelen aan een kolom die er geen heeft.  
Een gekoppelde kolom heeft het gegevenstype van haar domein en volgt dat wanneer het type van het domein verandert, en als je een ander type in haar cel DataType typt, wordt ze ontkoppeld — zie [Domeinen en gegevenstypen](./dictionary.md#domains-and-data-types).

## Buiten het canvas {#beyond-the-canvas}

De meeste andere plaatsen die een tabel of kolom bij naam noemen, volgen ook de naamweergave:

- `Physical Names` toont de naam.
- `Logical Names` toont de logische naam, of zolang die leeg is de naam, gedimd waar die plaats dat kan.
- `Both Names` toont de logische naam met de naam erna: gedempt in een tekstregel, op een tweede regel in een label van de graaf, en tussen haakjes waar één tekst beide moet bevatten, zoals `Member (member)`. Een tabel of kolom zonder logische naam toont alleen haar naam.

Een lijst die op naam is gesorteerd, zoals de tabellen in de Verkenner of de rijen van `#` in Snel zoeken, blijft in elke weergave op naam gesorteerd, nooit op logische naam.

De plaatsen die de weergave volgen:

- Op het tabblad Visualisatie de kaarten van de stroomweergave — zie [Namen op de kaarten](./visualization.md#names-on-the-cards) — en de labels en het voorbeeld bij aanwijzen van de graaf — zie [De graaf lezen](./visualization.md#reading-the-graph) en [Voorbeeld bij aanwijzen](./visualization.md#hover-preview).
- [Tabeleigenschappen](./table-related-functions.md#table-properties): de chips, en op het tabblad `Indexes` de rijen van `Columns` en de lijst `Index order` — zie [Indexen](./table-related-functions.md#indexes).
- De tabel- en kolomrijen van de [Verkenner](./explorer.md#the-tree), en de tabellen die onder elke tabelgroep staan.
- De rijen van `#` in Snel zoeken — zie [Het diagram doorzoeken](./quick-search.md#searching-the-diagram).
- De wijzigingsboom van de [Verschilweergave](./table-related-functions.md#diff-viewer) en beide kanten ervan.
- [Kolommen toewijzen](./relationship-editing.md#map-columns), en de knopinfo `<parent> has no primary key to copy` die `Create new columns` kan tonen terwijl een relatie wordt getekend — zie [Relaties maken](./editing-start.md#relationship-creation).
- De kopie van de rijen die het slepen van een kolom over leeg canvas meeneemt, met de naam- en typecellen van elke rij zoals de rij ze toont — zie [Kolommen herschikken en verplaatsen](./table-editing.md#rearranging-and-moving-columns).
- De kolom `Target` van het blad `Checks` van het tabblad Woordenboek — zie [Het blad Controles](./dictionary.md#the-checks-sheet).
- Een [geëxporteerde afbeelding](./file-import-export.md#image).

Enkele plaatsen tonen de namen, welke weergave ook geldt: de rijen voor indexen en refererende sleutels in de Verkenner, de `Keys` op het tabblad `Indexes` van Tabeleigenschappen, `New column: <name>` in Kolommen toewijzen en de plaats die naast een rij van `@` of `:` in Snel zoeken staat.

De Verschilweergave, [Tijdreizen](./undo-redo.md#time-travel), het voorbeeld van [Automatische indeling](./table-related-functions.md#auto-layout) `Force` en het dialoogvenster `Export image` openen in de naamweergave die je voor je hebt, welke weergave het bestand ook bewaart. Elk ervan houdt die weergave zolang het open is.  
Elke automatische indeling, en een `Import` of `Import and Add` van Schema SQL, GraphQL, DBML of AML, plaatst de tabellen met de breedte die ze in je weergave hebben.

## Zoeken op logische naam {#finding-by-logical-name}

Logische namen worden in elke naamweergave gevonden, ook in `Physical Names`, waarin het canvas er geen toont:

- [Zoeken en vervangen](./find-and-replace.md#what-it-searches) doorzoekt ze als één soort tekst, `Logical names`, zowel voor tabellen als voor kolommen, en die soort staat aan wanneer de zoekfunctie voor het eerst opent. Een logische naam vervangen leidt daaruit de fysieke naam af, net als het invoeren ervan.
- In [Snel zoeken](./quick-search.md#searching-the-diagram) vindt `#` een tabel op haar naam of haar logische naam, en `@` een kolom op een van beide, waarbij een overeenkomst in de logische naam `Logical name` ernaast toont. Het tabeldeel van `@`, vóór de `.`, komt ook overeen met de naam of de logische naam van een tabel.

Het wisselen van de naamweergave verandert hoe de resultaten worden genoemd, nooit wat er wordt gevonden.

## Medebewerkers {#collaborators}

In een [sessie voor gezamenlijk bewerken](../../api/advanced/collaborative-editing.md) bereiken logische namen en domeinkoppelingen elke editor zoals elke andere bewerking.  
Zolang de vergrendeling `Name View` aanstaat, houdt elke editor een eigen weergave, en is het wisselen alleen zichtbaar in de editor waarin het gebeurde. Zolang ze uitstaat, wisselt elke editor mee wanneer een editor die niet alleen-lezen is van weergave wisselt — zie [Vergrendeling](./settings.md#lock), waar ook staat wat het in- of uitschakelen van de vergrendeling met de weergave van elke editor doet.  
Als de gefocuste cel van een deelnemer een cel is die jouw weergave niet toont, verschijnt de kleur van die deelnemer op de cel die jouw weergave op die plaats toont: een naamcel in `Physical Names` verschijnt op je cel van de logische naam in `Logical Names`, en omgekeerd, en een typecel en het domein dat ervoor in de plaats staat, komen op dezelfde manier overeen.

Een codeeragent die via de MCP-server werkt, stelt logische namen in en koppelt domeinen, welke weergave je ook voor je hebt, en heeft geen tool die de naamweergave wisselt — zie [Woordenboeken](../../mcp/tools.md#dictionaries) en [Instellingen](../../mcp/tools.md#settings).

## Editors in alleen-lezenmodus {#read-only-editors}

In een editor met [`readonly`](../../api/erd-editor-element.md#readonly) werkt elke kiezer voor de naamweergave: de knop `Name View` op de canvaswerkbalk, `Name View` in het contextmenu van het canvas en in Snel zoeken, en de lijst op de werkbalk van de stroomweergave.  
Een wissel daar verandert alleen dat scherm, hoe de vergrendeling ook staat: het bestand, medebewerkers en de ongedaanmakingsgeschiedenis behouden de weergave zoals ze was. Zodra de editor weer bewerkbaar wordt, blijft de gekozen weergave op dat scherm staan tot de volgende wissel daar, of, zolang de vergrendeling uitstaat, tot een medebewerker haar wisselt of het document opnieuw wordt geladen.  
Logische namen en domeinen kunnen daar niet worden bewerkt, dus er opent geen celeditor, termenlijst of domeinkiezer, en geen van de items `Derive Physical Name Again` en `Derive Physical Names Again` wordt aangeboden.  
View Option → `Domain` toont of verbergt de cel Domain alleen op dat scherm, zoals elke [weergaveoptie](./table-related-functions.md#table-view-options) daar doet, en als de editor weer bewerkbaar wordt, komen de weergaveopties van het document terug.
