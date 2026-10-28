---
sidebar_position: 1
description: Stuur wijzigingen in de editor door tussen instanties met getSharedStore, initialiseer een editor die aansluit vanuit runtimeValue en toon de cursor, focus, selectie en het sleepkader van elke medebewerker.
---

# Gezamenlijk bewerken

`getSharedStore()` maakt van een editor een knooppunt in een sessie voor gezamenlijk bewerken.  
Hij verstuurt elke wijziging als een stream van acties en past de acties toe die andere editors terugsturen — voor het transport ertussen zorg je zelf (WebSocket, WebRTC of iets anders dat JSON kan overbrengen).  
Dit is een van de methoden van [ErdEditorElement](../erd-editor-element.md) en werkt samen met [Externe opslag](./remote-storage.md) wanneer de doorgestuurde wijzigingen ook moeten worden opgeslagen.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Een actie is een serialiseerbaar dataobject dat één wijziging in het document beschrijft, zodat hij `JSON.stringify` doorstaat op weg naar het transport.  
Acties komen in batches binnen: `subscribe` geeft je een array, en die array is één eenheid — stuur hem in zijn geheel door en dispatch hem aan de andere kant ook in zijn geheel.  
Behandel een actie als ondoorzichtig en geef hem ongewijzigd door in plaats van hem te lezen of te herschrijven, want juist de boekhouding die hij meedraagt, houdt de editors synchroon.

Een deel van wat een editor doet, blijft op die editor.  
Het naar voren halen van een tabel, memo of tabelgroep, wat ook gebeurt wanneer je er een selecteert, wordt niet verstuurd.  
Ook de keuzes `Statements`, `Header`, `Write logical names into empty comments` (sinds `4.2.0`) en `Tables` op het tabblad [Schema SQL](../../guide/guides/schema-sql.md) worden niet verstuurd, want ze horen bij het venster waarin ze zijn gemaakt.  
Sinds `4.1.0` blijft ook de [Verkenner](../../guide/guides/explorer.md) op zijn eigen editor: of hij open is, zijn breedte, zijn samengevouwen rijen, de rij waarop de toetsenbordfocus staat, de scrollpositie van zijn boomstructuur en zijn zoekopdracht en opties worden niet verstuurd.  
Ook het [oplichten](../../guide/guides/relationship-editing.md#reading-a-connector) van de verbindingslijn van de bijbehorende relatie wanneer je naar een refererende sleutel gaat, wordt niet verstuurd.  
Sinds `4.2.0` blijft ook het tabblad [Woordenboek](../../guide/guides/dictionary.md) op zijn eigen editor: welk blad wordt getoond en van elk blad de zoekopdracht, de selectie, de scrollpositie en de kolombreedtes worden niet verstuurd. Bewerkingen, sorteringen en CSV-imports op het tabblad worden wel verstuurd.  
Scrollen, zoomen of van tabblad wisselen wordt wel verstuurd, maar verandert nooit de weergave of het tabblad van een andere gebruiker. Dat geldt ook voor het scrollen door een sprong vanuit de Verkenner, voor de wissel naar het ERD-tabblad wanneer de Verkenner vanaf een ander tabblad wordt geopend, en voor de tabbladwissel en het scrollen bij een sprong vanaf het blad [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) van het tabblad Woordenboek naar een tabel of kolom. Een sprong vanaf dat blad naar een woord, term of domein blijft op het tabblad Woordenboek, dus daarvan wordt niets verstuurd.

Sinds `4.2.0` wordt ook een wissel van [naamweergave](../../guide/guides/logical-names.md#switching-the-view) verstuurd, en de [vergrendeling](../../guide/guides/settings.md#lock) ervan bepaalt wat de andere editors ermee doen. De vergrendeling `Name View` staat aan in een nieuw diagram en in elk document van vóór `4.2.0`.  
Zolang de vergrendeling aanstaat, is de wissel alleen zichtbaar op de editor waarop hij is gemaakt: hij wordt nog steeds verstuurd, maar elke andere editor en elke replica laat hem vallen, zodat elke gebruiker naar een andere weergave kan kijken terwijl `value` de vergrendelde weergave behoudt. Een wijziging van de taal, een naamnotatie of het type aanhalingstekens werkt anders: die bereikt elke editor, of de vergrendeling ervan nu aanstaat of niet.  
Zolang de vergrendeling uitstaat, verandert een wissel in een editor die kan bewerken, de naamweergave op elke editor en replica, waarbij de laatste wissel de doorslag geeft, en slaan ze die allemaal op.  
Een wissel die een editor in alleen-lezenmodus zelf maakt, blijft altijd op die editor, en die editor volgt nog steeds de gedeelde wissels van de andere editors.

Sinds `5.0.0` verstuurt een editor in [alleen-lezenmodus](../erd-editor-element.md#readonly) helemaal geen wijzigingen. Het scrollen, zoomen, wisselen van tabblad, de naamweergave, het databasesysteem, de taal van de Codegenerator, de naamnotaties, het type aanhalingstekens en de rijen `View Option` die zijn lezer wijzigt, blijven op zijn scherm, wat hun vergrendelingen ook aangeven; vóór `5.0.0` werden zijn scrolls, zooms, tabbladwissels, databasesysteem en code-instellingen verstuurd als die van een bewerkbare editor.  
Zijn store verstuurt nog steeds wat zijn trackers versturen van de cursor, de focus, de selectie en het selectiekader van de lezer, beantwoordt de registers waar een editor die erbij komt om vraagt, en past elke wijziging toe die de anderen sturen. Een wijziging van het databasesysteem, van een instelling van de Codegenerator of van een rij `View Option` bereikt zijn document, en ook zijn scherm tenzij zijn lezer die instelling daar heeft gewijzigd, en een gedeelde wissel van de naamweergave verschijnt hoe dan ook op zijn scherm.  
Op het moment dat de editor in alleen-lezenmodus gaat, verstuurt hij eerst wat de store nog achterhoudt van een sleepbeweging of een scroll, zoals [flushStreamBuffers](#flushstreambuffers) dat doet, zodat de anderen het laatste ervan houden.

[Vergrendelingen](../../guide/guides/settings.md#lock) worden gedeeld: de laatste vergrendeling of ontgrendeling van een instelling geeft op elke editor de doorslag, en een vergrendeling neemt de waarden mee van de editor die haar heeft ingeschakeld, zodat elke editor en replica dezelfde waarde opslaat.  
Een vergrendeling `Viewport` slaat daarom de weergave op van de editor die haar heeft ingeschakeld, en een vergrendeling `Canvas Type` het laatste tabblad waarop die editor was vóór het tabblad Instellingen, waar vergrendelingen worden ingeschakeld.  
Het uitschakelen van de vergrendeling `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` of, sinds `4.2.0`, `Name View` zet die instelling op elke editor ook op de waarde die wordt getoond op de editor die de vergrendeling heeft uitgeschakeld, zodat ze één waarde blijven opslaan. Het uitschakelen van `Viewport` of `Canvas Type` verandert bij niemand de weergave of het tabblad.

Een bewerking van het script `Before tables` of `After tables` wordt in zijn geheel verstuurd wanneer het veld ervan de focus verliest. De twee scripts worden los van elkaar afgehandeld, zodat de bewerking van een medebewerker in het ene script nooit het andere overschrijft.

Niets wat je in de [stroommodus](../../guide/guides/visualization.md#flow-never-edits-the-document) van het tabblad Visualisatie doet, is een wijziging in het document, dus een editor in de stroomweergave stuurt de andere editors geen wijzigingen, en de wijzigingen die zij sturen, worden nog steeds toegepast zolang hij daar is.  
Er zijn twee uitzonderingen. Het verlaten van de stroomweergave voor een ander tabblad is een wissel van tabblad, die wordt verstuurd zoals elke andere. Sinds `4.2.0` is een keuze in de lijst voor de naamweergave op de werkbalk van de stroomweergave een wissel van naamweergave, die wordt verstuurd en toegepast zoals een wissel op het canvas.  
`Previous table`, `Next table` en de toetsen voor ongedaan maken en opnieuw uitvoeren, die in de stroomweergave [door de weergaven stappen](../../guide/guides/visualization.md#previous-table-and-next-table), worden niet verstuurd.  
De kaartknop voor een externe link, een resultaat van [Snel zoeken](../../guide/guides/quick-search.md#searching-the-diagram) dat na `#`, `@` of `:` is gekozen, en het openen van de [Verkenner](../../guide/guides/explorer.md#opening-and-closing) verlaten allemaal de stroomweergave en gaan naar het ERD-tabblad. Ook het scrollen dat de kaartknop of een resultaat van Snel zoeken daar veroorzaakt, wordt verstuurd.

## Twee editors op één pagina {#two-editors-on-one-page}

De koppeling van subscribe aan dispatch neemt hier de plaats van het netwerk in, zodat je de opzet van een sessie kunt zien zonder dat er een transport in de weg zit.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Beide editors beginnen hier met hetzelfde nieuwe, lege document, dus geen van beide hoeft te worden geïnitialiseerd.  
Stuur bij drie of meer editors de batches van elke editor naar alle andere: een editor geeft nooit door wat hij heeft ontvangen.

## Een medebewerker initialiseren {#seeding-a-collaborator}

Een gedeelde store stuurt wijzigingen door zodra ze worden gemaakt en geeft een nieuwe deelnemer nooit het document zoals het op dat moment is, dus een editor die aansluit bij een sessie die al loopt, moet eerst het document krijgen.  
Sinds `4.0.0` initialiseer je hem met de [`runtimeValue`](../erd-editor-element.md#runtimevalue) van een editor die al in de sessie zit, niet met `value` of het opgeslagen bestand.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

De runtimewaarde bevat nog wat er sinds het openen van het document is verwijderd, dus als een andere editor later een verwijdering ongedaan maakt, brengt de nieuwe deelnemer de tabel terug met naam en kolommen.  
[`value`](../erd-editor-element.md#value) is de vorm die een bestand bevat, zonder verwijderde entiteiten, dus een nieuwe deelnemer die daarmee of met het bestand is geïnitialiseerd, zou in plaats daarvan een lege tabel zonder naam terugbrengen.  
Sinds `4.2.0` geldt hetzelfde voor een woord, term of domein dat van een blad van het [Woordenboek](../../guide/guides/dictionary.md) is verwijderd: wanneer een andere editor de verwijdering ongedaan maakt, toont een nieuwe deelnemer die met `runtimeValue` is geïnitialiseerd, de rij weer volledig, en een deelnemer die met `value` is geïnitialiseerd, een lege rij, die zijn eigen `value` vervolgens weglaat.  
Blijf `value` naar de opslag schrijven: `runtimeValue` is alleen bedoeld om een andere editor, een tweede weergave of een [replicationStore](./remote-storage.md) te initialiseren.  
De editors in VS Code, Obsidian, een JetBrains-IDE en de webapp initialiseren zo een tweede weergave van een geopend document.

`setInitialValue` wordt niet doorgestuurd, dus het initialiseren van de nieuwe deelnemer verandert niets op de andere editors.  
Sinds `4.0.0` wist het ook de samenwerkingsregisters van de editor, die gelijktijdige bewerkingen afhandelen. Als de gedeelde store van de editor al een abonnee heeft gehad, vraagt de store de andere editors opnieuw om hun registers, zoals bij de eerste [subscribe](#subscribe), zodat een editor die midden in een sessie opnieuw wordt geladen, bewerkingen op dezelfde manier afhandelt als de andere.  
Een toewijzing aan `value` behoudt de registers, maar wordt in tegenstelling tot `setInitialValue` wel doorgestuurd: zodra de editor een gedeelde store heeft, laadt elke editor in de sessie het toegewezen document, dus initialiseer een nieuwe deelnemer nooit op die manier.

## Versies combineren {#mixing-releases}

Een editor past alleen de actietypen toe die zijn eigen versie kent, dus in een sessie met verschillende versies missen de oudere editors alles wat met een nieuwer type wordt verstuurd.

Sinds `3.10.0` wordt een wijziging van [ON DELETE of ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) van een relatie verstuurd als een van twee nieuwe actietypen, `relationship.changeOnDelete` en `relationship.changeOnUpdate`, en kan `relationship.add` beide meenemen. Een relay die acties ongewijzigd doorstuurt, heeft daarvoor niets nieuws nodig.  
Een editor van vóór `3.10.0` negeert die actietypen en velden: hij krijgt ON DELETE of ON UPDATE van een relatie nooit te weten, en een document dat vanuit zo'n editor is opgeslagen, bevat geen van beide. Een relatie die een oudere editor toevoegt, komt zonder deze waarden binnen, zodat beide op `Not set` beginnen.

Elke andere wijziging die een editor van `3.10.0` verstuurt, gaat via actietypen die oudere editors al kennen.  
`Replace All` in [Zoeken en vervangen](../../guide/guides/find-and-replace.md#replacing) verstuurt zijn bewerkingen als één batch met dezelfde acties voor naamswijzigingen, opmerkingen en memo's die een handmatige bewerking verstuurt. De [weergaveopties](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` en `Referential Actions` gaan via de bestaande actie `settings.changeShow`.

Sinds `4.0.0` gaan deze wijzigingen via nieuwe actietypen, en een relay die acties ongewijzigd doorstuurt, heeft daarvoor niets nieuws nodig:

- een [tabelgroep](../../guide/guides/table-groups.md) die wordt toegevoegd, verplaatst, van grootte veranderd, hernoemd, van kleur veranderd of verwijderd: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` en `tableGroup.remove`; een tabel die bij een groep komt of een groep verlaat: `table.changeGroup`;
- een `Save` in [Kolommen toewijzen](../../guide/guides/relationship-editing.md#map-columns) voor een bestaande relatie, wat beide kolomlijsten ervan tegelijk instelt: `relationship.changeColumns`;
- een [vergrendeling](../../guide/guides/settings.md#lock) die wordt in- of uitgeschakeld: `settings.changeLockSettings`;
- een bewerking van het script `Before tables` of `After tables` op het tabblad [Schema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

De weergaveopties `Table Groups` en `Memos` gaan via de bestaande actie `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, die de schakelaars `Save Scroll Information` en `Save Zoom Information` verstuurden voordat de vergrendelingen ze vervingen, wordt niet meer verstuurd, en `settings.changeRelationshipOptimization` bestaat niet meer. Een editor van `4.0.0` die een van beide ontvangt, verandert niets.

Een editor van vóór `4.0.0` negeert de nieuwe actietypen: hij ziet nooit een tabelgroep of welke tabellen erin zitten, al verplaatst het slepen van een groep de tabellen van die groep daar nog wel, omdat het ook hun `table.move` verstuurt.  
Hij behoudt de oude kolommen van een relatie na een `Save` in Kolommen toewijzen, en wanneer op die editor een kolom van de oude toewijzing wordt verwijderd, verdwijnt de relatie op elke editor. Hij heeft geen vergrendelingen en geen scripts.  
Een document dat vanuit zo'n editor is opgeslagen, bevat niets hiervan, en een editor van `4.0.0` opent het met alle vergrendelingen ingeschakeld.  
Houd elke editor in een sessie, en elke [replicationStore](./remote-storage.md#dispatch-dispatchsync) die het document ervan opslaat, op `4.0.0` of later.

Een editor van `4.1.0` verstuurt geen nieuw actietype, dus editors en replica's van `4.0.0` en `4.1.0` delen een sessie zonder dat er iets wordt gemist.  
In die editor doorzoekt de functie [Zoeken en vervangen](../../guide/guides/find-and-replace.md#replacing) ook indexnamen en tabelgroepnamen, en `Replace` en `Replace All` hernoemen ze via de acties `index.changeName` en `tableGroup.changeName`, die een editor van `4.0.0` al toepast.

Sinds `4.2.0` gaan deze wijzigingen via nieuwe actietypen, en een relay die acties ongewijzigd doorstuurt, heeft daarvoor niets nieuws nodig:

- de [logische naam](../../guide/guides/logical-names.md) van een tabel of kolom: `table.changeLogicalName` en `column.changeLogicalName`; of de naam ervan [uit de woordenboeken is afgeleid](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` en `column.changeNameDerived`;
- een kolom die aan een [domein](../../guide/guides/dictionary.md#domains-and-data-types) wordt gekoppeld of ervan wordt ontkoppeld: `column.changeDomain`;
- een woord, term of domein dat op het tabblad [Woordenboek](../../guide/guides/dictionary.md) wordt toegevoegd, gewijzigd (inclusief de plaats ervan op het blad, zoals een sortering die bepaalt) of verwijderd: `dictionary.add`, `dictionary.update` en `dictionary.remove`;
- een wissel van [naamweergave](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

De vergrendeling `Name View` gaat via de bestaande actie `settings.changeLockSettings`, de weergaveoptie `Domain` via `settings.changeShow` en een verplaatsing van `Logical Name` of `Domain` in de [kolomvolgorde](../../guide/guides/settings.md#adjusting-column-order) via `settings.changeColumnOrder`.  
De acties `editor.clear` en `editor.loadJson` van een import van Schema SQL, GraphQL, DBML of AML via `Import` bevatten `keepDictionaries: true`, waardoor de woorden, termen en domeinen op elke editor behouden blijven. Dat geldt ook voor die van een vervangende [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` of `setSchemaAML`.  
Een fysieke naam die de woordenboeken afleiden, gaat via `table.changeName` of `column.changeName`, en het gegevenstype dat een domein zijn kolommen geeft via `column.changeDataType`: de acties die een handmatige bewerking verstuurt.

Een editor van vóór `4.2.0` negeert de nieuwe actietypen: hij heeft geen logische namen, domeinkoppelingen, woordenboeken of naamweergave. Het vergrendelen of ontgrendelen van `Name View` verandert daar niets, en ook een verplaatsing van `Logical Name` of `Domain` in de kolomvolgorde, of een verplaatsing naar een van beide, verandert daar niets. Ook een vergrendeling `Canvas Type` die is ingeschakeld door een editor die vanaf het tabblad Woordenboek naar het tabblad Instellingen ging, verandert daar niets: de oudere editor kent dat tabblad niet en laat `Canvas Type` dus ontgrendeld. Hij toont nog wel de fysieke namen die de woordenboeken afleiden en de gegevenstypen die domeinen geven.  
Zijn eigen bewerkingen weten niets van logische namen, domeinen of de woordenboeken, met deze gevolgen voor de nieuwere editors:

- Een tabel of kolom die hij handmatig hernoemt, houdt haar naam gemarkeerd als afgeleid, zodat een logische naam die er later op een nieuwere editor voor wordt ingevoerd, de naam die hij typte kan vervangen door een opnieuw afgeleide naam.
- Een gegevenstype dat hij geeft aan een kolom die aan een domein is gekoppeld, laat de koppeling staan, zodat het blad `Checks` `Domain type mismatch` vermeldt en de volgende typewijziging van het domein de kolom weer het type van het domein geeft.
- De kolommen met refererende sleutel van een relatie die hij toevoegt, krijgen geen logische naam of domein van hun sleutel.
- Een tabel die hij plakt of dupliceert, komt binnen zonder logische namen of domeinkoppelingen.
- Een import van Schema SQL, GraphQL, DBML of AML op die editor verstuurt geen `keepDictionaries` en maakt dus de woorden, termen en domeinen op elke editor leeg.
- Wanneer hij een laadactie, een import of `clear()` ongedaan maakt, laadt hij zijn eigen kopie van het document op elke editor, en die kopie heeft geen logische namen, domeinkoppelingen of woordenboeken.
- Die kopie, en het document dat een import van Schema SQL, GraphQL, DBML of AML op die editor laadt, zetten ook de vergrendeling `Name View` op elke editor terug naar de stand waarin die editor haar aantrof. Elke editor slaat dan `Physical Names` op als naamweergave en toont die ook als de vergrendeling uitstaat.

Een document dat vanuit zo'n editor is opgeslagen, heeft geen logische namen, domeinkoppelingen, woordenboeken of naamweergave, dus een editor van `4.2.0` opent het in de weergave `Physical Names`. De oudere editor slaat de vergrendeling `Name View` wel op zoals hij haar aantrof, zodat een document dat in een editor van `4.2.0` is ontgrendeld, ontgrendeld blijft.  
Houd elke editor in een sessie, en elke [replicationStore](./remote-storage.md#dispatch-dispatchsync) die het document ervan opslaat, op `4.2.0` of later.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Stelt de bijnaam in die op de andere editors naast de muiscursor van deze gebruiker wordt getoond.  
Andere gebruikers zien `user` wanneer de bijnaam ontbreekt of leeg is.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Zendt de muiscursor van deze gebruiker uit naar de andere editors. De standaardwaarde is `true`.  
Cursors die andere gebruikers versturen, worden altijd op het ERD-canvas getoond.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Zendt uit waar deze gebruiker mee bezig is. De standaardwaarde is `true`.  
De tabel en cel waarop je de focus hebt, de tabellen, memo's en tabelgroepen die je hebt geselecteerd en het kader dat je over het canvas sleept, worden naar de andere editors verstuurd en daar getekend.  
Elke gebruiker krijgt een eigen kleur, zodat je ze uit elkaar kunt houden: een omlijning om de tabel met focus, een onderstreping onder de cel met focus, een ring om de geselecteerde tabellen, memo's en tabelgroepen en een gestreepte rechthoek voor het sleepkader.  
Sinds `4.2.0` kunnen gebruikers elk een andere [naamweergave](../../guide/guides/logical-names.md#collaborators) voor zich hebben zolang de vergrendeling ervan aanstaat, of nadat een editor in alleen-lezenmodus zelf heeft gewisseld. Een cel met focus die jouw weergave niet toont, wordt onderstreept op de cel die jouw weergave op haar plaats toont: de naam en de logische naam vervangen elkaar, net als het gegevenstype en het domein.  
Aanwezigheid die van andere gebruikers binnenkomt, wordt altijd op je canvas getekend, of deze optie nu aanstaat of niet.  
In de stroommodus van het tabblad Visualisatie worden de focus en selectie van andere gebruikers op de tabelkaarten getekend, maar hun sleepkaders niet. De tabellen die je daar selecteert, worden nog steeds verstuurd; het kader dat je daar sleept, niet.

```js
editor.getSharedStore({ focusTracker: false });
```

Schakel beide trackers uit om de gedeelde store te gebruiken als pure relay die zelf geen aanwezigheid publiceert.  
Aanwezigheid die andere editors versturen, wordt nog steeds ontvangen en getekend.  
Dit doen de editors in VS Code, Obsidian, een JetBrains-IDE en Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

De cursor, focus, selectie en het sleepkader gaan via dezelfde stream als de wijzigingen in het document, maar ze zijn vluchtig.  
Ze komen nooit in het document, de geschiedenis of `editor.value` terecht, dus een transport mag ze laten vallen en een replicationStore negeert ze.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Deze methoden stellen de huidige verbindingsstatus in.  
Zolang de verbinding verbroken is, worden wijzigingen intern gebufferd.  
De gebufferde wijzigingen worden naar abonnees verstuurd zodra verzenden weer mogelijk is.  
De standaardstatus is verbonden (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Past wijzigingen van andere editorinstanties toe op de huidige editorinstantie.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Abonneert zich op wijzigingen in de editor.  
Er verlaat niets de editor totdat er minstens één abonnee is, en wijzigingen van vóór dat moment worden gebufferd.  
De eerste subscribe vraagt de andere editors ook om hun samenwerkingsregisters, die gelijktijdige bewerkingen afhandelen, zodat een deelnemer die later aansluit, ze op dezelfde manier afhandelt.  
Het document wordt daarbij niet meegestuurd, dus [initialiseer](#seeding-a-collaborator) eerst een deelnemer die later aansluit.  
Sinds `4.0.0` vraagt de store er telkens opnieuw om wanneer `setInitialValue` na die eerste subscribe een document in zijn editor laadt.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Verstuurt de streambatches die deze store nog achterhoudt, nu meteen, in plaats van na hun rustperiode.  
Werkt sinds `3.9.2` op een store uit `getSharedStore`; in `3.9.1` staat de methode wel in het type, maar doet ze niets.  
Het verplaatsen van een tabel, memo of tabelgroep, het wijzigen van de kleur ervan, het wijzigen van de grootte van een memo en het scrollen of zoomen van de weergave komen elk binnen als een stream van kleine wijzigingen. Het wijzigen van de grootte van een tabelgroep niet: dat wordt één keer verstuurd, wanneer het slepen eindigt.  
De store verzamelt elke stream in één batch en houdt die vast totdat de stream 200 ms stil is geweest. Dat doet hij in twee fasen, dus de batch wordt ongeveer 400 ms na de laatste wijziging verstuurd.  
Een aanroep beëindigt dat wachten in beide fasen. Zolang de store verbonden is, ontvangt een abonnee de batch voordat de aanroep terugkeert. Een aanroep terwijl er niets wordt achtergehouden, verstuurt niets.  
`destroy`, die van de store zelf of die van de editor, laat een batch vallen die nog wordt achtergehouden, dus roep deze methode eerst aan wanneer je een store loslaat en de andere editors de laatste wijziging moeten behouden, zoals wanneer een tabblad sluit.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Vernietigt de sharedStore-instantie volledig.  
De editor zelf blijft ongemoeid, dus na het verlaten van een sessie blijft het document bewerkbaar.  
De muis- en focustrackers stoppen zodra de laatste sharedStore die de editor heeft uitgegeven, is vernietigd.  
Een streambatch die de store nog achterhoudt, gaat daarbij verloren; roep eerst [flushStreamBuffers](#flushstreambuffers) aan om die te versturen.

```js
sharedStore.destroy();
```
