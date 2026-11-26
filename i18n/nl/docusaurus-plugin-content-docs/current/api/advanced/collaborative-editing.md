---
sidebar_position: 1
description: Stuur wijzigingen in de editor door tussen instanties met getSharedStore, initialiseer een editor die aansluit vanuit runtimeValue en de registers van de store, handel bewerkingen op hetzelfde moment af en toon de cursor, focus, selectie en het sleepkader van elke medebewerker.
---

# Gezamenlijk bewerken

`getSharedStore()` maakt van een editor een knooppunt in een sessie voor gezamenlijk bewerken.  
Hij verstuurt elke wijziging als een stream van acties en past de acties toe die andere editors terugsturen — voor het transport ertussen zorg je zelf (WebSocket, WebRTC of iets anders dat JSON kan overbrengen).  
Dit is een van de methoden van [ErdEditorElement](../erd-editor-element.md) en werkt samen met [Externe opslag](./remote-storage.md) wanneer de doorgestuurde wijzigingen ook moeten worden opgeslagen.  
Sinds `5.1.0` bind je de editor met `@dineug/erd-editor-yjs` om een diagram te delen via een Yjs-document en een van de providers ervan, in plaats van zelf het transport te regelen; zie [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` exporteert geen van deze typen onder een eigen naam. TypeScript-code bereikt ze via `ErdEditorElement`, zoals in `ReturnType<ErdEditorElement['getSharedStore']>`.

Een actie is een serialiseerbaar dataobject dat één wijziging in het document beschrijft, zodat hij `JSON.stringify` doorstaat op weg naar het transport.  
Acties komen in batches binnen: `subscribe` geeft je een array, en die array is één eenheid — stuur hem in zijn geheel door en dispatch hem aan de andere kant ook in zijn geheel.  
Behandel een actie als ondoorzichtig en geef hem ongewijzigd door in plaats van hem te lezen of te herschrijven, want juist de boekhouding die hij meedraagt, zoals de [versie](#concurrent-edits) ervan, houdt de editors synchroon.

Een deel van wat een editor doet, blijft op die editor.  
Het naar voren halen van een tabel, memo of tabelgroep, wat ook gebeurt wanneer je er een selecteert, wordt niet verstuurd.  
Ook de keuzes `Statements`, `Header`, `Write logical names into empty comments` (sinds `4.2.0`) en `Tables` op het tabblad [Schema SQL](../../guide/guides/schema-sql.md) worden niet verstuurd, want ze horen bij het venster waarin ze zijn gemaakt.  
Sinds `4.1.0` blijft ook de [Verkenner](../../guide/guides/explorer.md) op zijn eigen editor: of hij open is, zijn breedte, zijn samengevouwen rijen, de rij waarop de toetsenbordfocus staat, de scrollpositie van zijn boomstructuur en zijn zoekopdracht en opties worden niet verstuurd.  
Ook het [oplichten](../../guide/guides/relationship-editing.md#reading-a-connector) van de verbindingslijn van de bijbehorende relatie wanneer je naar een refererende sleutel gaat, wordt niet verstuurd.  
Sinds `4.2.0` blijft ook het tabblad [Woordenboek](../../guide/guides/dictionary.md) op zijn eigen editor: welk blad wordt getoond en van elk blad de zoekopdracht, de selectie, de scrollpositie en de kolombreedtes worden niet verstuurd. Bewerkingen, sorteringen en CSV-imports op het tabblad worden wel verstuurd.  
Scrollen, zoomen of van tabblad wisselen wordt wel verstuurd, maar verandert nooit de weergave of het tabblad van een andere gebruiker. Dat geldt ook voor het scrollen door een sprong vanuit de Verkenner, voor de wissel naar het ERD-tabblad wanneer de Verkenner vanaf een ander tabblad wordt geopend, en voor de tabbladwissel en het scrollen bij een sprong vanaf het blad [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) van het tabblad Woordenboek naar een tabel of kolom. Een sprong vanaf dat blad naar een woord, term of domein blijft op het tabblad Woordenboek, dus daarvan wordt niets verstuurd.

Sinds `4.2.0` wordt ook een wissel van [naamweergave](../../guide/guides/logical-names.md#switching-the-view) verstuurd, en de [vergrendeling](../../guide/guides/settings.md#lock) ervan bepaalt wat de andere editors ermee doen. De vergrendeling `Name View` staat aan in een nieuw diagram en in elk document van vóór `4.2.0`.  
Zolang de vergrendeling aanstaat, is de wissel alleen zichtbaar op de editor waarop hij is gemaakt: hij wordt nog steeds verstuurd, maar elke andere editor en elke replica laat hem vallen, zodat elke gebruiker naar een andere weergave kan kijken terwijl `value` de vergrendelde weergave behoudt.  
Zolang de vergrendeling uitstaat, verandert een wissel in een editor die kan bewerken, de naamweergave op elke editor en replica, waarbij de laatste wissel de doorslag geeft, en slaan ze die allemaal op.  
Een wissel die een editor in alleen-lezenmodus zelf maakt, blijft altijd op die editor, en die editor volgt nog steeds de gedeelde wissels van de andere editors.

Sinds `5.1.0` volgt een wijziging van de taal van de [Codegenerator](../../guide/guides/code-generator.md), de notatie van tabelnamen, de notatie van kolomnamen of het type aanhalingstekens op dezelfde manier haar eigen vergrendeling (`Language`, `Table Name Case`, `Column Name Case` of `Bracket Type`), met één verschil: zolang de vergrendeling aanstaat, wordt de wijziging helemaal niet verstuurd.  
Ze is alleen zichtbaar op de editor die haar heeft gemaakt, waarvan de tabbladen Codegenerator en Schema SQL haar volgen, en geen enkele andere editor of replica ziet haar. `value` en `runtimeValue` behouden de vergrendelde waarde, dus ook een deelnemer die vanuit een willekeurige editor is geïnitialiseerd, ziet haar niet, en elke gebruiker kan naar een andere taal, naamnotatie of ander type aanhalingstekens kijken zolang de vergrendeling aanstaat.  
Zolang de vergrendeling uitstaat, wordt een wijziging in een editor die kan bewerken, als gedeeld gemarkeerd verstuurd (`shared: true` in de payload). Ze wijzigt de instelling op elke editor en replica, waarbij de laatste wijziging de doorslag geeft, en ze slaan die allemaal op. Een editor of replica van `5.1.0` past een gemarkeerde wijziging toe, wat zijn eigen vergrendeling ook aangeeft, dus een wijziging die vlak na een ontgrendeling wordt gemaakt, komt overal terecht, ook waar ze eerder aankomt dan de ontgrendeling.  
Vóór `5.1.0` bereikte zo'n wijziging elke editor en replica, of de vergrendeling nu aanstond of niet, terwijl het bestand de vergrendelde waarde behield.

Sinds `5.0.0` verstuurt een editor in [alleen-lezenmodus](../erd-editor-element.md#readonly) helemaal geen wijzigingen. Het scrollen, zoomen, wisselen van tabblad, de naamweergave, het databasesysteem, de taal van de Codegenerator, de naamnotaties, het type aanhalingstekens en de rijen `View Option` die zijn lezer wijzigt, blijven op zijn scherm, wat hun vergrendelingen ook aangeven; vóór `5.0.0` werden zijn scrolls, zooms, tabbladwissels, databasesysteem en code-instellingen verstuurd als die van een bewerkbare editor.  
Zijn store verstuurt nog steeds wat zijn trackers versturen van de cursor, de focus, de selectie en het selectiekader van de lezer, beantwoordt de registers waar een editor die erbij komt om vraagt, en past elke wijziging toe die de anderen sturen. Een wijziging van het databasesysteem, van een instelling van de Codegenerator of van een rij `View Option` bereikt zijn document, en ook zijn scherm tenzij zijn lezer die instelling daar heeft gewijzigd, en een gedeelde wissel van de naamweergave verschijnt hoe dan ook op zijn scherm. Sinds `5.1.0` krijgt hij een instelling van de Codegenerator alleen wanneer die instelling is gewijzigd terwijl haar vergrendeling uitstond of een ontgrendeling haar meeneemt.  
Op het moment dat de editor in alleen-lezenmodus gaat, verstuurt hij eerst wat de store nog achterhoudt van een sleepbeweging of een scroll, zoals [flushStreamBuffers](#flushstreambuffers) dat doet, zodat de anderen het laatste ervan houden.

[Vergrendelingen](../../guide/guides/settings.md#lock) worden gedeeld: de laatste vergrendeling of ontgrendeling van een instelling geeft op elke editor de doorslag, en een vergrendeling neemt de waarden mee van de editor die haar heeft ingeschakeld, zodat elke editor en replica dezelfde waarde opslaat.  
Een vergrendeling `Viewport` slaat daarom de weergave op van de editor die haar heeft ingeschakeld, en een vergrendeling `Canvas Type` het laatste tabblad waarop die editor was vóór het tabblad Instellingen, waar vergrendelingen worden ingeschakeld.  
Het uitschakelen van de vergrendeling `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` of, sinds `4.2.0`, `Name View` zet die instelling op elke editor ook op de waarde die wordt getoond op de editor die de vergrendeling heeft uitgeschakeld, inclusief de wijziging die die editor zelf onder de vergrendeling heeft gemaakt, zodat ze één waarde blijven opslaan. Het uitschakelen van `Viewport` of `Canvas Type` verandert bij niemand de weergave of het tabblad.

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
Een room die is gebonden met [`@dineug/erd-editor-yjs`](./yjs.md) bevat het document zelf zodra een client haar heeft [geïnitialiseerd](./yjs.md#seeding-a-room), dus elke editor die eraan is gebonden, opent dat document zonder dat er een `runtimeValue` wordt doorgegeven.

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
Sinds `4.0.0` wist het ook de samenwerkingsregisters van de editor, die [gelijktijdige bewerkingen](#concurrent-edits) afhandelen. Als de gedeelde store van de editor al een abonnee heeft gehad, vraagt de store de andere editors opnieuw om hun registers, zoals bij de eerste [subscribe](#subscribe), zodat een editor die midden in een sessie opnieuw wordt geladen, bewerkingen op dezelfde manier afhandelt als de andere.  
Een toewijzing aan `value` behoudt de registers, maar wordt in tegenstelling tot `setInitialValue` wel doorgestuurd: zodra de editor een gedeelde store heeft, laadt elke editor in de sessie het toegewezen document, dus initialiseer een nieuwe deelnemer nooit op die manier.

Noch `value` noch `runtimeValue` bevat de registers of de versie die de klok van de editor heeft bereikt, dus een deelnemer die alleen vanuit `runtimeValue` is geïnitialiseerd, haalt ze uit het antwoord dat de editors in de sessie op zijn eerste subscribe sturen.  
Totdat dat antwoord binnenkomt, kan een bewerking van de nieuwe deelnemer een lagere versie dragen dan de andere editors hebben, zodat zij haar weigeren terwijl ze alleen op de nieuwe deelnemer blijft staan, en een oudere schrijfactie die nog onderweg is, landt over de nieuwere waarde die de initialisatie bevat. Waar geen lopende editor antwoordt, zoals wanneer een server of een documentopslag het document van de sessie bewaart, krijgt de nieuwe deelnemer ze nooit.  
Sinds `5.1.0` geef je ze samen met de waarde door. Roep op een editor in de sessie [`flushStreamBuffers()`](#flushstreambuffers) aan, zodat een sleepbeweging of kleurwijziging die hij nog achterhoudt, eerst wordt verstuurd, en lees dan op hetzelfde moment `runtimeValue` en de [`getLWW()`](#getlww) en [`getVersion()`](#getversion) van zijn store. De nieuwe deelnemer laadt de waarde met `setInitialValue` en neemt de rest daarna op met de [`mergeLWW`](#mergelww) van zijn eigen store, in die volgorde, omdat elke `setInitialValue` de registers wist. Zijn volgende bewerking draagt dan een hogere versie dan elke versie die de initialisatie bevat, dus ze landt zonder dat er op een antwoord hoeft te worden gewacht. Op een store die al bestaat, doet [`reseed`](#reseed) beide in één aanroep.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Een initialisatie die je zo bewaart om latere deelnemers mee te openen, bevat de drie samen. Het is geen bestand: `value` is nog steeds wat je naar de opslag schrijft.  
Een [replicationStore](./remote-storage.md#runtimevalue-getter) geeft geen registers door, dus een deelnemer die vanuit de `runtimeValue` ervan is geïnitialiseerd, haalt ze nog steeds uit het antwoord van de editors.

## Gelijktijdige bewerkingen {#concurrent-edits}

Elke editor en replica houdt voor elke naam en bijna elk ander veld de versie bij van de schrijfactie die het heeft ingesteld: dit zijn zijn samenwerkingsregisters. Een schrijfactie landt alleen als haar versie niet lager is dan de bewaarde, zodat editors die dezelfde wijzigingen in een andere volgorde horen, op hetzelfde document uitkomen.  
Sinds `5.1.0` draagt elke versie onder haar teller een plaats van de schrijvende editor zelf, afgeleid van zijn id. Versies groeien daarom in stappen van 4.194.304 en passen ze niet meer in een 32-bits geheel getal zodra de teller 512 bereikt. `JSON.stringify` en `JSON.parse` laten ze intact, maar een relay of store die ze in een andere taal parseert, moet ze als 64-bits getallen bewaren, nooit als 32-bits gehele getallen.

Sinds `5.1.0` komen twee editors die op hetzelfde moment één naam of veld wijzigen, op elke editor en replica op dezelfde waarde uit, afgezien van de onderstaande uitzonderingen: ook bij dezelfde teller zetten ze twee verschillende versies, en de grotere wint overal. Vóór `5.1.0` konden beide dezelfde versie zetten, en elke editor hield de waarde aan die hij het laatst hoorde, zodat ze uiteen konden lopen. Twee editors delen een plaats met een kans van 1 op 4.194.304 per paar, en dan staan ze gelijk, zoals eerder.

Sinds `5.1.0` worden de positie van een tabel, de positie en grootte van een memo of tabelgroep, en de oorsprong en het zoomniveau van de weergave op dezelfde manier van een versie voorzien, en wat ze verplaatst, wordt verstuurd als de plek waar ze eindigen:

- een sleepbeweging als één `table.moveTo`, `memo.moveTo` of `tableGroup.moveTo` per verplaatste entiteit, in één batch, zodat het slepen van een groep de punten van zijn tabellen, en sinds `5.1.1` die van zijn memo's, meeneemt met die van de groep;
- het ongedaan maken of opnieuw uitvoeren van een sleepbeweging als het punt waarop het elke entiteit zet;
- een pan als `settings.scrollTo` en een zoom als `settings.changeZoomLevel`;
- het wijzigen van de grootte van een memo of tabelgroep als haar positie en grootte samen.

Twee gebruikers die één tabel, memo of tabelgroep op hetzelfde moment verplaatsen, of verplaatsen en van grootte wijzigen, houden er dus één punt en één grootte aan over op elke editor en replica. Het punt gaat naar de schrijfactie met de grotere versie, beide assen samen. Een verplaatsing schrijft geen grootte, dus een wijziging van de grootte behoudt haar grootte, ook waar een tegelijk gemaakte verplaatsing het punt overneemt.  
Vóór `5.1.0` werd een sleepbeweging verstuurd als de afgelegde afstand, zodat twee sleepbewegingen van één tabel bij elkaar werden opgeteld, en een verplaatsing en een wijziging van de grootte van één memo of tabelgroep die tegelijk werden gemaakt, uiteen konden lopen.  
Een sleepbeweging van minder dan 20 px, die geen stap in de geschiedenis achterlaat, wordt verstuurd zoals elke andere, dus als punt kan ze een sleepbeweging van dezelfde entiteit overschrijven die een andere gebruiker op hetzelfde moment maakte. Een batch van een sleepbeweging, pan of zoom die een transport twee keer aflevert, verplaatst niets twee keer.

Een kleurwijziging is een uitzondering. Ze wordt zonder versie verstuurd, en elke editor en replica zet er zijn eigen versie op en houdt de kleur aan die hij het laatst hoorde, zodat twee gebruikers die één tabel, memo of tabelgroep op hetzelfde moment een andere kleur geven, met verschillende kleuren kunnen eindigen.  
Een paar wijzigingen houden helemaal geen versie bij, dus elke editor en replica past ze toe in de volgorde waarin hij ze hoort, en twee wijzigingen op hetzelfde moment kunnen ook uiteenlopen: een kolom die binnen haar tabel of index wordt verplaatst (`column.move`, `indexColumn.move`), en een wijziging van het [databasesysteem](../../guide/guides/table-related-functions.md#databases), van een rij [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) of van `Relationship DataType Sync`, `Maximum comment width` of `Column Order` op het tabblad [Instellingen](../../guide/guides/settings.md).  
Entiteiten die twee gebruikers op hetzelfde moment toevoegen, zoals twee tabellen of twee kolommen van één tabel, kunnen op elke editor en replica ook in een andere volgorde staan, en de `value` van elke editor en replica slaat zijn eigen volgorde op.

Dit alles geldt tussen editors en replica's van `5.1.0` of later; [Versies combineren](#mixing-releases) zegt wat een oudere verandert.

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

Een editor van vóór `4.0.0` negeert de nieuwe actietypen: hij ziet nooit een tabelgroep of welke tabellen erin zitten, al verplaatst het slepen van een groep de tabellen van die groep daar nog wel, omdat het ook een verplaatsing van elk van die tabellen verstuurt.  
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

Een editor van `5.1.0` verstuurt geen nieuw actietype, dus editors en replica's van vóór `5.1.0` delen nog steeds een sessie met hem, en een relay die acties ongewijzigd doorstuurt, heeft niets nieuws nodig. Wat [Gelijktijdige bewerkingen](#concurrent-edits) beschrijft, geldt echter alleen tussen editors en replica's van `5.1.0`:

- De sleepbewegingen van een editor van `5.1.0` gaan als punten via `table.moveTo`, `memo.moveTo` en `tableGroup.moveTo`, die oudere editors al toepassen, en zijn pans en zooms als punten via `settings.scrollTo` en `settings.changeZoomLevel`, die, zoals elke pan en zoom, geen andere editor toepast en alleen replica's overnemen. Een oudere editor past elk punt van een sleepbeweging toe in de volgorde waarin het binnenkomt, buiten elk register, en een oudere replica doet hetzelfde met elk punt van een sleepbeweging, pan of zoom, dus twee punten die tegelijk voor één entiteit of voor de weergave worden verstuurd, kunnen daar uiteenlopen.
- De sleepbeweging van een oudere editor gaat nog steeds als een afgelegde afstand, die elke editor en replica buiten zijn registers optelt, en zijn pan of zoom ook als afstand, die elke replica op dezelfde manier optelt. Een afstand en een punt voor één entiteit die tegelijk worden gemaakt, kunnen uiteenlopen op editors en replica's die ze in een andere volgorde horen, en een afstand die een transport twee keer aflevert, wordt twee keer opgeteld.
- Buiten de uitzonderingen die [Gelijktijdige bewerkingen](#concurrent-edits) noemt, wint de schrijfactie van een editor van `5.1.0` voor een naam of veld bijna altijd van de schrijfactie van een oudere editor op hetzelfde moment, met op elke editor en replica hetzelfde antwoord. Twee oudere editors kunnen nog steeds uiteenlopen over één veld dat tegelijk wordt geschreven.
- Een editor van `5.1.0` verstuurt een wijziging van de taal van de Codegenerator, de naamnotatie of het type aanhalingstekens alleen terwijl haar vergrendeling uitstaat, met de markering `shared: true`, die een oudere editor negeert, waarbij hij de wijziging toepast zoals eerder. Een oudere editor verstuurt er nog steeds een die hij onder de vergrendeling maakt, zonder markering: een editor of replica van `5.1.0` laat haar vallen zolang die instelling daar is vergrendeld, en oudere editors passen haar toe. Onder een vergrendeling volgen de oudere editors dus elkaars keuzes, terwijl de editors van `5.1.0` hun eigen keuze behouden, en het bestand behoudt hoe dan ook de vergrendelde waarde. Een ontgrendeling in een van beide versies neemt de waarde van wie ontgrendelt mee naar elke editor en replica.
- Een laadactie die het document vervangt, zoals een toegewezen `value`, `clear()` of een vervangende import, sluit het tekenen van een relatie af op elke editor van `5.1.0`, zowel op de editor die de laadactie maakte als op elke editor die haar ontvangt. Een oudere editor houdt zijn tekenactie daarbij actief.

Houd elke editor in een sessie, en elke [replicationStore](./remote-storage.md#dispatch-dispatchsync) die het document ervan opslaat, op `5.1.0` of later, zodat bewerkingen op hetzelfde moment overal op hetzelfde uitkomen, afgezien van de uitzonderingen die [Gelijktijdige bewerkingen](#concurrent-edits) noemt; `4.2.0` of later blijft wat logische namen en woordenboeken behoudt. Een [MCP-server](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) van vóór `1.2.0` telt hier als een editor van vóór `5.1.0`, en een editor van vóór `5.1.0` kan helemaal niet aan een room van [Yjs](./yjs.md) worden gebonden.

Sinds `5.1.1` gaat een wijziging waarbij een memo in een [tabelgroep](../../guide/guides/table-groups.md) komt of hem verlaat, via een nieuw actietype, `memo.changeGroup`, en een relay die acties ongewijzigd doorstuurt, heeft daarvoor niets nieuws nodig. Het wordt verstuurd voor een memo die in of buiten een groep wordt neergezet, een nieuwe groep die rond getoonde memo's zonder groep wordt getekend, `Group selected tables` met memo's die naast de tabellen zijn geselecteerd, `Remove from group` met memo's in de selectie, elke memo van een verwijderde groep, de aanroepen van een codeeragent via de [MCP-server](../../mcp/tools.md#table-groups) die de groep van memo's wijzigen, en het ongedaan maken en opnieuw uitvoeren van elk daarvan. Een toevoeging via `Import and Add` of `setSchemaJSON` waarvan de groepen memo's bevatten, verstuurt het ook, en het opnieuw uitvoeren daarvan ook, terwijl het ongedaan maken alleen die memo's verwijdert.

Een editor of replica van vóór `5.1.1` negeert `memo.changeGroup`, en bij het parseren laat hij de `groupId` van elke memo weg, dus hij ziet nooit een memo in een groep, al verplaatst het slepen van een groep door een editor van `5.1.1` de memo's van die groep daar nog wel, omdat het ook voor elk daarvan een `memo.moveTo` verstuurt. Zijn eigen bewerkingen weten niets van de groepen van memo's, met deze gevolgen voor de nieuwere editors:

- Een memo die hij naar het kader van een groep sleept, blijft buiten de groep, en een lidmemo die hij uit het kader sleept, blijft erin, waarbij het kader uitrekt om hem te omvatten.
- Het slepen van een groep op die editor verplaatst, net als zijn `Auto Layout`, de groep en zijn tabellen, maar laat de memo's van de groep staan waar ze staan, en het kader rekt uit om de getoonde memo's daar te omvatten.
- Een `Import and Add` op die editor zet geen memo in de groepen die hij toevoegt.
- Een groep die hij verwijdert, laat de `groupId` van elk van zijn memo's die groep noemen: de memo's gelden dan als memo's zonder groep, en als hij het verwijderen ongedaan maakt, zet dat ze weer in de groep.
- Wanneer hij een laadactie, een import of `clear()` ongedaan maakt, laadt hij zijn eigen kopie van het document op elke editor, en die kopie heeft geen memo in een groep.

Een document dat vanuit zo'n editor is opgeslagen, heeft geen memo in een groep, al behoudt een editor van `4.0.0` of later de groepen van de tabellen.  
Houd elke editor in een sessie, en elke [replicationStore](./remote-storage.md#dispatch-dispatchsync) die het document ervan opslaat, op `5.1.1` of later om memo's in hun tabelgroepen te houden; `5.1.0` of later blijft wat bewerkingen op hetzelfde moment regelt. Een [MCP-server](../../mcp/installation.md#updating) van vóór `1.2.1` ziet en behoudt evenzo niet in welke tabelgroep een memo zit.

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
Wanneer een batch het verzoek van een andere editor om registers bevat, zoals de eerste [subscribe](#subscribe) van een nieuwe deelnemer verstuurt, antwoordt de store via zijn abonnees met zijn registers en zijn versie, tenzij hij geen registers heeft.  
Sinds `5.1.0` verstuurt hij eerst elke streambatch die hij nog achterhoudt, zoals [flushStreamBuffers](#flushstreambuffers) dat doet, zodat elke versie die zijn antwoord draagt, rust op een schrijfactie die naar de anderen is verstuurd. Dat een nieuwe deelnemer aansluit, laat dus elke editor in de sessie in één keer een sleepbeweging, pan, zoom, kleurwijziging of wijziging van de grootte van een memo versturen die hij nog achterhoudt.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Abonneert zich op wijzigingen in de editor.  
Er verlaat niets de editor totdat er minstens één abonnee is, en wijzigingen van vóór dat moment worden gebufferd.  
De eerste subscribe vraagt de andere editors ook om hun samenwerkingsregisters, die [gelijktijdige bewerkingen](#concurrent-edits) afhandelen, zodat een deelnemer die later aansluit, ze op dezelfde manier afhandelt.  
Het document wordt daarbij niet meegestuurd, dus [initialiseer](#seeding-a-collaborator) eerst een deelnemer die later aansluit; sinds `5.1.0` kan de initialisatie ook de registers meenemen.  
Sinds `4.0.0` vraagt de store er telkens opnieuw om wanneer `setInitialValue`, of sinds `5.1.0` [reseed](#reseed), na die eerste subscribe een document in zijn editor laadt.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Verstuurt de streambatches die deze store nog achterhoudt, nu meteen, in plaats van na hun rustperiode.  
Werkt sinds `3.9.2` op een store uit `getSharedStore`; in `3.9.1` staat de methode wel in het type, maar doet ze niets.  
Het verplaatsen van een tabel, memo of tabelgroep, het wijzigen van de kleur ervan, het wijzigen van de grootte van een memo en het scrollen of zoomen van de weergave worden elk gemaakt als een stream van kleine wijzigingen. Het wijzigen van de grootte van een tabelgroep niet: dat wordt één keer verstuurd, wanneer het slepen eindigt.  
De store verzamelt elke stream in één batch en houdt die vast totdat de stream 200 ms stil is geweest, in twee fasen. Een kleurwijziging of een wijziging van de grootte van een memo doorloopt beide, dus ze wordt ongeveer 400 ms na de laatste wijziging verstuurd, zoals elke stream vóór `5.1.0`. Sinds `5.1.0` wordt een sleepbeweging, pan of zoom na de eerste fase verstuurd, ongeveer 200 ms na de laatste stap, als de plek waar ze eindigt (zie [Gelijktijdige bewerkingen](#concurrent-edits)).  
Een aanroep beëindigt dat wachten in beide fasen. Zolang de store verbonden is, ontvangt een abonnee de batch voordat de aanroep terugkeert. Een aanroep terwijl er niets wordt achtergehouden, verstuurt niets.  
`destroy`, die van de store zelf of die van de editor, laat een batch vallen die nog wordt achtergehouden, dus roep deze methode eerst aan wanneer je een store loslaat en de andere editors de laatste wijziging moeten behouden, zoals wanneer een tabblad sluit.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Geeft sinds `5.1.0` een kopie terug van de samenwerkingsregisters van de editor (zie [Gelijktijdige bewerkingen](#concurrent-edits)).  
De kopie wordt via JSON gemaakt, dus ze is een gewoon object dat klaar is voor `JSON.stringify`, en een wijziging eraan laat de registers van de store zoals ze waren.  
Geef haar ongewijzigd door aan de [mergeLWW](#mergelww) of [reseed](#reseed) van een andere store. De vorm ervan is die van de editor zelf, dus lees er geen enkel veld van.  
Lees haar op hetzelfde moment als [getVersion](#getversion) en de `runtimeValue` van de editor om [een nieuwe deelnemer te initialiseren](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Neemt sinds `5.1.0` registers die een andere store met [getLWW](#getlww) heeft uitgegeven op in die van deze store, waarbij van elk de grotere versie wordt behouden, en neemt `version` op in de klok van de editor, die de grotere houdt van zijn eigen versie en de opgegeven versie.  
Het verandert niets in het document: geen byte van `value` of `runtimeValue`, geen stap in de geschiedenis en geen event `change`. Het verhoogt alleen de versies die een latere schrijfactie moet overtreffen, dus een schrijfactie die ouder is dan de opgegeven registers wordt daarna geweigerd, en de volgende bewerking van de editor draagt een hogere versie dan `version`.  
Het verstuurt niets en beantwoordt niets. Het is wat een eerste subscribe van een nieuwe deelnemer uit het antwoord van de anderen krijgt, rechtstreeks opgenomen.  
Roep het aan na `setInitialValue`, nooit ervoor: elke `setInitialValue` en elke [reseed](#reseed) wist de bewaarde registers, en daarmee wat een `mergeLWW` ervoor had opgenomen.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Geeft sinds `5.1.0` de hoogste versie terug die de klok van de editor heeft samengevoegd: de grootste van de versies van de wijzigingen die hij maakte of opnam, van de verzoeken om registers en de antwoorden die een toetreding uitwisselt, en van elke `version` die aan `mergeLWW` of `reseed` is gegeven.  
Cursors, focus, selecties en sleepkaders, zijn eigen of die van een andere editor, veranderen er niets aan.  
Geef haar door met [getLWW()](#getlww), op hetzelfde moment gelezen, aan de [mergeLWW](#mergelww) of [reseed](#reseed) van een nieuwe deelnemer. Ze is een [versie](#concurrent-edits) zoals die welke de acties van de editor dragen.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Verwijdert sinds `5.1.0` meteen de cursor, focus, selectie en het sleepkader die de editor met het opgegeven id heeft verstuurd, en de verlooptijd waarop elk wachtte. Die van elke andere editor blijven staan.  
Het id is de `meta.editorId` die elke actie draagt die de gedeelde store van die editor verstuurt. Een id waarvan deze editor niets heeft, verandert niets.  
Roep het aan wanneer je transport merkt dat een peer is vertrokken. Anders blijft wat de peer verstuurde getekend totdat het verloopt: zijn cursor 30 seconden na de laatste die is ontvangen, zijn focus en selectie 90 seconden erna en zijn sleepkader 3 seconden erna.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Opent sinds `5.1.0` het document van een sessie opnieuw in de editor, zoals bij opnieuw aansluiten. De binding met [Yjs](./yjs.md) roept het aan om het document van een room te openen wanneer ze zich bindt aan een room die is geïnitialiseerd, en opnieuw bij elke nieuwe aansluiting, waarbij het scherm behouden blijft zodra de editor bij de room is aangesloten.  
Het laadt `value` zoals [setInitialValue](../erd-editor-element.md#setinitialvalue) dat doet en neemt `lww` en `version` op zoals [mergeLWW](#mergelww) dat doet, zodat de store daarna precies de opgegeven registers heeft, en zijn klok de grotere van zijn eigen versie en `version`. Het leegt ook de geschiedenis en wist, in tegenstelling tot `setInitialValue`, de selectie en de focus, omdat die kunnen verwijzen naar wat de waarde niet meer bevat.  
Afgezien van de afleiding van een logische naam hieronder maakt het geen stap in de geschiedenis aan, geeft het geen event `change` af en verstuurt het geen wijziging. Zodra de store een abonnee heeft gehad, verstuurt hij het verzoek om registers dat elke dergelijke laadactie verstuurt, dat een transport dat de registers al heeft doorgegeven, mag laten vallen, en, met de [focusTracker](#focustracker) aan, de gewiste selectie en focus.  
Net als `setInitialValue` werkt het terwijl [readonly](../erd-editor-element.md#readonly) is ingesteld, verwerpt het een stroomweergave, beëindigt het het tekenen van een relatie en sluit het de memo-, tabelgroepnaam- en celeditors, waarbij wat erin is getypt op dezelfde manier wordt behouden of verworpen; een naam die een cel van de logische naam bij het sluiten afleidt uit wat de lezer typte, is een gewone bewerking: ze wordt verstuurd, kan ongedaan worden gemaakt en leidt tot een event `change`.

Zonder `keepScreen` toont het scherm wat de waarde bevat, zoals na `setInitialValue`. Met `keepScreen: true` wordt het scherm van de lezer weer over het geladen document gelegd, op dat scherm alleen:

- de scrollpositie en het zoomniveau, zodra het element ze heeft getoond; een element dat ze nooit heeft getoond, of dat verborgen is geladen en sindsdien niet is getoond, opent waar de waarde ze plaatst, zoals bij een deelnemer die later aansluit;
- het tabblad, wanneer de laadactie het heeft verplaatst, en op het tabblad Instellingen ook het tabblad waar de lezer vandaan kwam, dat een daar ingeschakelde vergrendeling `Canvas Type` noemt;
- de naamweergave en elke instelling van de Codegenerator die de lezer onder haar vergrendeling zelf toonde, maar alleen wanneer die vergrendeling vóór de laadactie aanstond, daarna nog aanstaat en dezelfde vergrendelde waarde bevat. Dus wanneer een peer intussen een instelling heeft ontgrendeld, gewijzigd en weer vergrendeld met een andere waarde, opent de editor met de nieuwe vergrendelde waarde, en waar de vergrendeling vóór of na de laadactie uitstaat, toont hij de geladen waarde;
- elke instelling die een lezer in alleen-lezenmodus op zijn eigen scherm heeft gewijzigd, wat de vergrendelingen ook aangeven.

Niets hiervan wordt verstuurd, en `value` en `runtimeValue` geven nog steeds het geladen document weer. Een latere ontgrendeling door een peer vervangt een op deze manier behouden instelling van de code, zoals elke ontgrendeling doet.  
Het volgende scrollen of zoomen van de lezer terwijl de editor kan bewerken, maakt de behouden scrollpositie en het behouden zoomniveau weer die van het document, en wordt verstuurd met de stand van het scherm voorop, zodat replica's dat zoomniveau ook overnemen.

`reseed` laat wat de store achterhoudt zoals het is. Een sleepbeweging, pan of zoom die nog wordt achtergehouden, wordt erna verstuurd, afgelezen van het opnieuw geïnitialiseerde document; een kleurwijziging of een wijziging van de grootte van een memo wordt verstuurd zoals ze is gemaakt, ook al toont de editor haar niet meer; en wat `disconnect()` achterhield, wordt verstuurd bij `connection()`.  
Roep dus eerst [flushStreamBuffers](#flushstreambuffers) aan, verstuur wat het uitzendt en initialiseer dan opnieuw met een waarde die het bevat. Initialiseer nooit opnieuw terwijl de verbinding verbroken is.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Vernietigt de sharedStore-instantie volledig.  
De editor zelf blijft ongemoeid, dus na het verlaten van een sessie blijft het document bewerkbaar.  
De muis- en focustrackers stoppen zodra de laatste sharedStore die de editor heeft uitgegeven, is vernietigd.  
Een streambatch die de store nog achterhoudt, gaat daarbij verloren; roep eerst [flushStreamBuffers](#flushstreambuffers) aan om die te versturen.  
De cursors, focus, selecties en sleepkaders die andere editors hebben verstuurd, blijven getekend totdat ze verlopen; sinds `5.1.0` verwijdert [forgetPeer](#forgetpeer) die van één editor meteen.

```js
sharedStore.destroy();
```
