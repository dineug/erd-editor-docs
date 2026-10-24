---
sidebar_position: 2
description: Repliceer een live editor naar een headless store buiten de hoofdthread en serialiseer het document voor opslag.
---

# Externe opslag

Het is inefficiënt om bij elke wijziging de volledige status van de editor te versturen.  
Voor dat geval biedt de editor een API voor realtime replicatie van gegevens.

## Installatie {#installation}

```sh
npm install @dineug/erd-editor
```

De replicatiestore staat in het subpad `@dineug/erd-editor/engine.js`, niet in de root van het pakket.  
Dat ingangspunt raakt de DOM niet aan, dus het draait in een Web Worker of ergens anders buiten de hoofdthread.  
Importeer je in plaats daarvan de root van het pakket, dan wordt het custom element `<erd-editor>` geregistreerd, dat een document nodig heeft.

## Gebruik {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Een live editor repliceren {#replicating-a-live-editor}

De acties komen uit de gedeelde store van een live editor.  
Zie [Gezamenlijk bewerken](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Alleen de wijziging gaat over de grens, nooit het hele document.  
De replica past de wijziging toe en serialiseert het resultaat aan haar eigen kant.  
`change` geeft je dat resultaat als `value`, en `changed` vertelt je wanneer het de moeite waard is om het weg te schrijven.

Initialiseer de replica sinds `4.0.0` zoals hierboven met de `runtimeValue` van de editor, in plaats van met het opgeslagen bestand of de `value` van de editor.  
Het bestand mist de bewerkingen die sinds het opslaan zijn gedaan, en `value` mist de entiteiten die in de sessie zijn verwijderd.  
Een replica die zonder een verwijderde tabel is geïnitialiseerd, brengt die tabel zonder naam of kolommen terug wanneer een editor de verwijdering ongedaan maakt, en slaat haar zo op.  
Sinds `4.2.0` geldt hetzelfde voor een woord, term of domein dat van een blad van het [Woordenboek](../../guide/guides/dictionary.md) is verwijderd.  
Wanneer een editor de verwijdering ongedaan maakt, toont een replica die zonder de rij is geïnitialiseerd, die rij weer leeg, en omdat `value` een lege rij weglaat, slaat de replica het document zonder die rij op.  
Bij een domein blijven ook de kolommen en termen die eraan gekoppeld waren in die replica ontkoppeld, omdat de replica de koppelingen nooit had en het ongedaan maken ze niet verstuurt.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Meet een string in pixels.  
De store heeft geen DOM en kan tekst dus niet zelf meten, en hij berekent de kolombreedtes met deze functie opnieuw telkens wanneer een naam, gegevenstype, standaardwaarde of opmerking verandert.  
Sinds `4.2.0` hoort daar ook de [logische naam](../../guide/guides/logical-names.md) van een tabel of kolom bij.  
Hij meet de domeincel van een kolom, die de naam toont van het domein waaraan de kolom is gekoppeld, telkens wanneer de kolom aan een domein wordt gekoppeld of ervan wordt ontkoppeld en telkens wanneer dat domein wordt toegevoegd, hernoemd of verwijderd.  
Ook meet hij elke tabel en kolom opnieuw wanneer [setInitialValue](#setinitialvalue) een document laadt.  
Sinds `4.0.0` worden de breedtes alleen in [runtimeValue](#runtimevalue-getter) bewaard, nooit in `value`.  
Een document dat deze versie heeft opgeslagen, levert bij het teruglezen dus byte voor byte dezelfde `value` op, waar het ook is opgeslagen en hoe tekst daar ook werd gemeten.

Meet zoals de editor dat doet — `400 12px` in de lettertypereeks van de editor, afgerond, plus 2 px padding.  
Anders wijken de breedtes in `runtimeValue` af van die op het scherm.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` is de terugvaloptie als er geen canvas beschikbaar is.  
Dat volstaat voor een store waarvan het document alleen wordt opgeslagen en nooit gerenderd.

## ReplicationStore {#replicationstore}

### value-getter {#value-getter}

Serialiseert de huidige status van de editor.  
Geeft een JSON-string terug, klaar om ongewijzigd op te slaan — geen geparseerd object.

```js
const data = replicationStore.value;
```

Sinds `4.0.0` is `value` de opslagvorm: het document zoals een bestand het bevat, dezelfde tekst die de eigenschap [value](../erd-editor-element.md#value) van het element teruggeeft.  
De opslagvorm bevat alleen de niet-verwijderde entiteiten, in een vaste volgorde, zonder de verwijderde, zonder de stapelvolgorde en zonder alles wat bij het laden opnieuw wordt bepaald, zoals de breedtes die [toWidth](#towidth) meet.  
Sinds `4.2.0` bevat de opslagvorm ook de logische namen, of elke naam uit de woordenboeken is afgeleid, de domeinkoppelingen en de woorden, termen en domeinen van het tabblad [Woordenboek](../../guide/guides/dictionary.md).  
Ook laat de opslagvorm sinds `4.2.0` elk leeg tekstveld van een entiteit weg, elke lijst in `doc` en elke collectie die niets bevat, en `collections` zelf wanneer elke collectie leeg is.  
De tekst is met twee spaties ingesprongen, met elke woordenboekrij op een eigen regel, en eindigt met een regeleinde, zodat hetzelfde document altijd dezelfde bytes oplevert.  
Zie [Opslagvorm en runtimewaarde](./schema.md#storage-form-and-runtime-value) voor wat erin staat.

Elke instelling waarvan de [vergrendeling](../../guide/guides/settings.md#lock) aanstaat, wordt geschreven met de waarde waarop ze is vergrendeld, en elke andere instelling zoals ze op dat moment staat.  
De vergrendeling `Viewport` omvat de oorsprong van de weergave en het zoomniveau samen, en het tabblad, de taal van de Codegenerator, beide naamnotaties en het type aanhalingstekens hebben elk een eigen vergrendeling.  
Sinds `4.2.0` heeft ook de [naamweergave](../../guide/guides/logical-names.md#name-view) een eigen vergrendeling, `Name View`, die in een nieuw document aanstaat.  
De vergrendelingen vervangen het veld `ignoreSaveSettings` van het document, dat sinds `4.0.0` gelezen noch geschreven wordt.  
Vóór `4.0.0` was `value` het hele document zoals de store het bevatte, waarop de scroll- en zoombits van dat veld waren toegepast.

### runtimeValue-getter {#runtimevalue-getter}

Serialiseert sinds `4.0.0` het document zoals de replica het bevat, inclusief de verwijderde entiteiten en alles wat bij het laden wordt bepaald.  
Ook hier wordt elke vergrendelde instelling met haar vergrendelde waarde geschreven.

```js
const snapshot = replicationStore.runtimeValue;
```

Gebruik het om een editor of een andere store die later aansluit, via zijn `setInitialValue` te initialiseren; zie [Gezamenlijk bewerken](./collaborative-editing.md).  
Sla het nooit op als het bestand: het bevat de verwijderde entiteiten, en het gepubliceerde [JSON Schema](./schema.md#json-schema) weigert het.  
Juist die verwijderde entiteiten zorgen ervoor dat het later verstuurde ongedaan maken van een verwijdering de entiteit volledig terugbrengt in de store die ermee is geïnitialiseerd.  
Ze blijven bestaan tot het document de volgende keer vanuit zijn bestand wordt geopend, waarvan de vorm ze weglaat.

### setInitialValue {#setinitialvalue}

Laadt de eerder opgeslagen status van de editor.

```js
replicationStore.setInitialValue('json...');
```

De methode accepteert de opslagvorm, een runtimewaarde of een document dat een eerdere versie heeft opgeslagen, ook een v2-document.  
Een lege string, of alles wat geen string is, laadt een nieuw, leeg document in plaats van een fout te veroorzaken.  
Een store die nooit een waarde heeft gekregen, begint met hetzelfde nieuwe document.  
Sinds `4.0.0` staat in dat document elke [vergrendeling](../../guide/guides/settings.md#lock) aan, zodat de `value` ervan de weergave, het tabblad, de taal van de Codegenerator, de naamnotaties en het type aanhalingstekens behoudt waarmee het begon, terwijl de editors die de store repliceert, scrollen, zoomen, van tabblad wisselen of die instellingen wijzigen. In `3.10.0` sloeg het noch de scrollpositie noch het zoomniveau op, en daarvoor sloeg het beide op.  
Sinds `4.2.0` behoudt het ook zijn naamweergave, `Physical Names`, terwijl de editors van weergave wisselen.  
Een opgeslagen document behoudt de vergrendelingen die het vermeldt.  
Een document dat er geen vermeldt, en dat is elk document dat vóór `4.0.0` is opgeslagen, ook een v2-document, wordt geladen met elke vergrendeling aan: de oorsprong van de weergave op `0, 0`, het zoomniveau op `1` en het tabblad op ERD, ongeacht wat het heeft opgeslagen, en de taal van de Codegenerator, de naamnotaties en het type aanhalingstekens zoals het die heeft opgeslagen.  
Een document dat vóór `4.2.0` is opgeslagen, vermeldt geen vergrendeling `Name View` en wordt dus geladen met die vergrendeling aan en in de weergave `Physical Names`, ook als het is opgeslagen met elke andere vergrendeling uit.  
Sinds `4.0.0` wist `setInitialValue` ook de samenwerkingsregisters die voor het vorige document werden bijgehouden, zoals de methode [setInitialValue](../erd-editor-element.md#setinitialvalue) van het element dat doet.  
Ook tekst die geen JSON is, zoals een bestand met achtergebleven markeringen van een mergeconflict, veroorzaakt geen fout: de parseerfout wordt alleen in de console gelogd, het document wordt leeggemaakt en de instellingen blijven zoals ze waren.

Sinds `4.0.0` voert het laden geen garbage collection uit, zodat verwijderde entiteiten in [runtimeValue](#runtimevalue-getter) blijven.  
Daarvoor verwijderde het de entiteiten die niet meer in `doc` voorkwamen en al vier dagen of langer niet waren gewijzigd.

De herschrijvingen bij het laden zijn klaar voordat `setInitialValue` terugkeert: de sleutelmarkeringen op kolommen, afgeleid uit de opties van elke kolom en uit de relaties; elke tabel- en kolombreedte, opnieuw gemeten met `toWidth`; de punten waar elke verbindingslijn op haar tabellen aansluit; en van elke relatie de vlag die aangeeft of ze identificerend is en het symbool aan de kant van de oudertabel.  
Geen ervan hoort bij `value`, maar `replicationStore.runtimeValue` bevat ze allemaal al wanneer je het direct na de aanroep leest.  
Een actie die direct na het laden binnenkomt, zoals een opnieuw afgespeelde scroll, wordt afgemeten aan het geladen document, zodat het laden zelf nooit als [`changed`](#onchange) wordt gemeld.

Noch het laden noch een van deze herschrijvingen verstuurt `change`.  
Lees `replicationStore.value` zelf zodra `setInitialValue` terugkeert als je het geladen document in de opslagvorm wilt terugschrijven.

### on@change {#onchange}

Abonneert zich op wijzigingen in de status van de editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` heeft een debounce van 200 ms, zodat een snelle reeks acties als één notificatie binnenkomt.  
Het treedt alleen op bij acties van een soort die het document kan wijzigen, plus de `settings.changeIgnoreSaveSettings` die een oudere editor nog kan versturen (zie [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Een doorgestuurde aanwezigheidsactie of `editor.mergeLWW` wekt het nooit.  
Roep de geretourneerde functie aan om het abonnement op te zeggen.

Sinds `3.10.0` ontvangt de listener een `ReplicationChange`, een type dat `@dineug/erd-editor/engine.js` naast `ReplicationStore` exporteert.  
Vóór `3.10.0` ontving de listener niets, en een listener die het argument negeert, blijft werken.  
`value` is het geserialiseerde document in de opslagvorm, dezelfde string die `replicationStore.value` op dat moment teruggeeft, dus je hoeft het niet opnieuw te serialiseren.  
`changed` is `false` wanneer de acties sinds de vorige `change`, of sinds het laden, `value` byte voor byte ongewijzigd hebben gelaten.

Een wijziging die een [vergrendeling](../../guide/guides/settings.md#lock) buiten `value` houdt, leidt toch tot `change`, met `changed` op `false`, dus schrijf alleen weg wanneer `changed` `true` is.  
Het gaat om een scroll of zoom terwijl `Viewport` vergrendeld is, een tabbladwissel terwijl `Canvas Type` vergrendeld is en een wijziging van de taal van de Codegenerator, een naamnotatie of het type aanhalingstekens terwijl de eigen vergrendeling daarvan aanstaat.  
Sinds `4.2.0` geldt dat ook voor een wissel van naamweergave terwijl `Name View` vergrendeld is: de editor verstuurt hem nog steeds, maar de replica laat hem vallen, net als de andere editors.  
Een wissel van naamweergave die in een editor in alleen-lezenmodus wordt gemaakt, laat de replica op dezelfde manier vallen, hoe de vergrendeling ook staat.  
Het event [change](../erd-editor-element.md#change) van het element laat zo'n wijziging weg, maar de replica meldt die toch.  
In een nieuw document en in een document dat vóór `4.0.0` is opgeslagen, staat elke vergrendeling aan, en in elk document dat vóór `4.2.0` is opgeslagen, is `Name View` vergrendeld.  
Is `Viewport` ontgrendeld, dan wijzigt een scroll of zoom `value`; is `Canvas Type` ontgrendeld, dan doet het openen van een ander tabblad van de editor dat ook; en is `Name View` ontgrendeld, dan doet een wissel van naamweergave vanuit een editor die niet alleen-lezen is dat ook.  
Ook het in- of uitschakelen van een vergrendeling wijzigt `value`.

Sinds `4.0.0` vergelijkt `changed` de opslagvorm, die noch de verwijderde entiteiten noch de stapelvolgorde bevat.  
Een tabel die binnen één `change` wordt toegevoegd en weer verwijderd, een bewerking die terechtkomt op een entiteit die een andere medebewerker heeft verwijderd en een doorgestuurde laadactie die alleen de stapelvolgorde wijzigt, leveren dus allemaal ook `changed` op `false` op.  
Sinds `4.2.0` geldt dat ook voor een rij die aan een blad van het Woordenboek wordt toegevoegd en leeg blijft, omdat de opslagvorm een rij weglaat die niets bevat.

`changed` vergelijkt nooit met je opgeslagen bestand, dat na het laden al van `value` kan afwijken: dat geldt voor een bestand dat een eerdere versie heeft opgeslagen, ook een v2-bestand, en evengoed voor een bestand dat met een byte order mark begint en een bestand dat met de hand is bewerkt.  
Sinds `4.2.0` geldt dat ook voor een bestand dat `4.0.0` of `4.1.0` heeft opgeslagen, omdat `value` de lege tekstvelden van de entiteiten en de lege lijsten in `doc` en lege collecties weglaat die zo'n bestand bevat.  
Een bytevergelijking met zo'n bestand zou zelfs een scroll die door een vergrendeling wordt weggelaten, als bewerking tellen.  
De eerste `change` met `changed` op `true` geeft zo'n bestand terug in de opslagvorm, zodat het wegschrijven ervan het bestand eenmalig herschrijft.  
Een bestand dat deze versie heeft opgeslagen, wijkt niet af, waar het ook is opgeslagen, zoals [toWidth](#towidth) uitlegt.  
Als `setInitialValue` wordt aangeroepen terwijl er nog een `change` uitstaat, en er niets wordt gedispatcht voordat het zover is, komt die `change` toch, met de geladen `value` en `changed` op `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Past wijzigingen van externe editors toe op de replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` stelt het toepassen uit tot een microtask, en `dispatchSync` past de batch meteen toe.

Je kunt de stream van een gedeelde store ongefilterd doorgeven.  
Beide methoden behouden alleen de acties van een soort die het document kan wijzigen, plus de twee die aan het einde van dit gedeelte worden beschreven, en laten de rest vallen, zodat de aanwezigheidsgegevens die een sessie voor gezamenlijk bewerken meestuurt — de muiscursor, de focus, de selectie en het sleepkader van elke gebruiker — zonder effect passeren.

Sinds `3.10.0` horen `relationship.changeOnDelete` en `relationship.changeOnUpdate` bij de behouden acties, en bevat `relationship.add` de velden `onDelete` en `onUpdate`.  
Een store uit een eerdere versie laat die acties vallen en negeert die velden, waardoor hij van een relatie de acties [ON DELETE en ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) verliest.

Sinds `4.0.0` horen bij de behouden acties ook `table.changeGroup`, zeven van de acht acties van `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` en `tableGroup.changeColor`, alle behalve de wijziging van de stapelvolgorde `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` en `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` bestaat niet meer, dus beide methoden laten die actie vallen.  
Een store uit een eerdere versie laat de nieuwe acties vallen en verliest zo de [tabelgroepen](../../guide/guides/table-groups.md), de [vergrendelingen](../../guide/guides/settings.md#lock), de scripts van [Schema SQL](../../guide/guides/schema-sql.md) en de kolommen die de functie [Kolommen toewijzen](../../guide/guides/relationship-editing.md#map-columns) aan een bestaande relatie geeft.  
Draai de replica op dezelfde versie als de editors, of op een nieuwere.

`4.1.0` voegt geen actietype toe en laat `@dineug/erd-editor/engine.js` ongewijzigd, zodat een replica van `4.0.0` elke wijziging behoudt die een editor van `4.1.0` verstuurt, net als een replica van `4.1.0`.  
Sinds `4.1.0` wijzigen `Replace` en `Replace All` in [Zoeken en vervangen](../../guide/guides/find-and-replace.md#replacing) ook de namen van indexen en tabelgroepen, via de acties `index.changeName` en `tableGroup.changeName` die een replica van `4.0.0` al behoudt.  
De eigen status van de [Verkenner](../../guide/guides/explorer.md) wordt nooit verstuurd, en een tabbladwissel of scroll die de Verkenner uitvoert, komt binnen zoals elke andere tabbladwissel of scroll; zie [Gezamenlijk bewerken](./collaborative-editing.md).

Sinds `4.2.0` horen bij de behouden acties ook `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` en `dictionary.add`, `dictionary.update` en `dictionary.remove`, die elke bewerking, sortering en CSV-import op de bladen van het [Woordenboek](../../guide/guides/dictionary.md) overbrengen.  
Een replica past alleen de wissels van naamweergave toe die een bewerkbare editor maakt terwijl `Name View` ontgrendeld is, en laat de rest vallen (zie [on@change](#onchange)).  
Een store uit een eerdere versie laat al deze acties vallen en verliest zo de [logische namen](../../guide/guides/logical-names.md), de domeinkoppelingen, de informatie of elke naam van de woordenboeken komt, de woorden, termen en domeinen en de naamweergave.  
Een editor van vóór `4.2.0` in de sessie kan een replica van `4.2.0` nog steeds een deel hiervan afnemen.  
Een `Import` van Schema SQL, GraphQL, DBML of AML op die editor, al geldt dat niet voor een `Import and Add`, maakt de woorden, termen en domeinen van de replica leeg.  
Wanneer die editor een laadactie, een `Import` of `clear()` ongedaan maakt, laadt hij zijn eigen kopie van het document in de replica, zonder logische namen, domeinkoppelingen of woordenboeken; zie [Versies combineren](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` exporteert dezelfde `createReplicationStore`, `ReplicationStore` en `ReplicationChange` als voorheen, en `createReplicationStore` accepteert dezelfde context.

Sinds `4.0.0` passen beide methoden ook `editor.mergeLWW` toe, dat de samenwerkingsregisters bevat waarmee een editor antwoordt wanneer een andere editor zich bij de sessie aansluit, zodat de replica gelijktijdige bewerkingen op dezelfde manier afhandelt als de editors.  
Dat wijzigt geen enkele byte van `value` en leidt niet tot `change`.  
`settings.changeIgnoreSaveSettings`, dat een editor van vóór `4.0.0` nog kan versturen, wordt behouden maar wijzigt niets: het leidt tot `change` met `changed` op `false`.

### destroy {#destroy}

Vernietigt de replicationStore-instantie volledig.

```js
replicationStore.destroy();
```

Daarna verstuurt de store geen `change` meer en negeert hij verdere dispatches.  
Het document bevriest op zijn laatste waarde in plaats van een fout te veroorzaken.  
Maak een nieuwe store om opnieuw te beginnen.
