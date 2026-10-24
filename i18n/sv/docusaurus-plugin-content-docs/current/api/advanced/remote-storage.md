---
sidebar_position: 2
description: Replikera en live-editor till en headless store utanför huvudtråden och serialisera dokumentet för lagring.
---

# Fjärrlagring

Att skicka hela editorns tillstånd vid varje ändring är ineffektivt.  
För sådana fall erbjuder editorn ett API för datareplikering i realtid.

## Installation {#installation}

```sh
npm install @dineug/erd-editor
```

Replikeringsstoren finns under undersökvägen `@dineug/erd-editor/engine.js`, inte i paketets rot.  
Den ingångspunkten rör inte DOM, så den körs i en Web Worker eller någon annanstans utanför huvudtråden.  
Om du i stället importerar paketets rot registreras det anpassade elementet `<erd-editor>`, som behöver ett dokument.

## Användning {#usage}

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

## Replikera en live-editor {#replicating-a-live-editor}

Åtgärderna kommer från den delade storen i en live-editor.  
Se [Gemensam redigering](./collaborative-editing.md).

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

Bara ändringen passerar gränsen, aldrig hela dokumentet.  
Repliken tillämpar den och serialiserar resultatet på sin egen sida.  
`change` lämnar det resultatet till dig som `value`, och `changed` talar om när det är värt att skriva det.

Sedan `4.0.0` ska du initiera repliken med editorns `runtimeValue`, som ovan, i stället för med den sparade filen eller editorns `value`.  
Filen saknar de redigeringar som gjorts sedan den sparades, och `value` saknar de entiteter som tagits bort under sessionen.  
En replik som initierats utan en borttagen tabell återskapar den utan namn eller kolumner när en editor ångrar borttagningen, och sparar den på det sättet.  
Sedan `4.2.0` gäller samma sak för ett ord, en term eller en domän som tagits bort från ett blad i [ordlistan](../../guide/guides/dictionary.md).  
När en editor ångrar borttagningen listar en replik som initierats utan raden den på nytt, men tom, och eftersom `value` utelämnar en tom rad sparar repliken dokumentet utan den.  
För en domän förblir också de kolumner och termer som var kopplade till den okopplade i den repliken, eftersom den aldrig hade kopplingarna och ångringen inte skickar dem.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mäter en sträng i pixlar.  
Storen har ingen DOM, så den kan inte mäta text själv, och den beräknar om kolumnbredderna med den här funktionen varje gång ett namn, en datatyp, ett standardvärde eller en kommentar ändras.  
Sedan `4.2.0` gäller det även en tabells eller kolumns [logiska namn](../../guide/guides/logical-names.md).  
Den mäter en kolumns domäncell, som visar namnet på den domän som kolumnen är kopplad till, varje gång kolumnen kopplas till eller från en domän och varje gång den domänen läggs till, byter namn eller tas bort.  
Den mäter också alla tabeller och kolumner på nytt varje gång [setInitialValue](#setinitialvalue) läser in ett dokument.  
Sedan `4.0.0` lagras bredderna bara i [runtimeValue](#runtimevalue-getter), aldrig i `value`.  
Ett dokument som den här versionen har sparat ger därför samma `value` byte för byte när det läses in igen, var det än sparades och hur text än mättes där.

Mät på samma sätt som editorn – `400 12px` i editorns typsnittsstack, avrundat, plus 2 px utfyllnad.  
Annars avviker bredderna i `runtimeValue` från dem på skärmen.

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

`text.length * 10` är reservlösningen när ingen canvas är tillgänglig.  
Den räcker för en store vars dokument bara lagras och aldrig renderas.

## ReplicationStore {#replicationstore}

### value-getter {#value-getter}

Serialiserar editorns aktuella tillstånd.  
Returnerar en JSON-sträng som kan lagras som den är – inte ett tolkat objekt.

```js
const data = replicationStore.value;
```

Sedan `4.0.0` är `value` lagringsformen: dokumentet så som en fil innehåller det, samma text som elementets [value](../erd-editor-element.md#value) returnerar.  
Den innehåller bara de befintliga entiteterna, i en fast ordning, utan de borttagna entiteterna, staplingsordningen eller något som en inläsning räknar ut på nytt, till exempel bredderna som [toWidth](#towidth) mäter.  
Sedan `4.2.0` innehåller den också de logiska namnen, om varje namn härleddes från ordlistorna, domänkopplingarna samt orden, termerna och domänerna på fliken [Ordlista](../../guide/guides/dictionary.md).  
Den utelämnar också, sedan `4.2.0`, varje tomt textfält i en entitet, varje lista i `doc` och varje samling som inte innehåller något samt själva `collections` när alla samlingar är tomma.  
Den är indragen med två blanksteg, med varje rad från ordlistorna på en egen textrad, och slutar med en radbrytning, så samma dokument ger alltid samma byte.  
Se [Lagringsform och körtidsvärde](./schema.md#storage-form-and-runtime-value) för vad den innehåller.

Varje inställning vars [lås](../../guide/guides/settings.md#lock) är på skrivs med det värde den låstes med, och varje annan inställning med sitt aktuella värde.  
Låset `Viewport` omfattar vyns origo och zoomnivån tillsammans, och fliken, kodgeneratorns språk, båda skiftlägena för namn och typen av citattecken har vart och ett sitt eget lås.  
Sedan `4.2.0` har även [namnvisningen](../../guide/guides/logical-names.md#name-view) ett eget lås, `Name View`, som är på i ett nytt dokument.  
Låsen ersätter dokumentets `ignoreSaveSettings`, som varken läses eller skrivs sedan `4.0.0`.  
Före `4.0.0` var `value` hela dokumentet så som storen höll det, med fältets bitar för rullning och zoom tillämpade.

### runtimeValue-getter {#runtimevalue-getter}

Serialiserar sedan `4.0.0` dokumentet så som repliken håller det, inklusive de borttagna entiteterna och allt som en inläsning räknar ut.  
Varje låst inställning skrivs med sitt låsta värde även här.

```js
const snapshot = replicationStore.runtimeValue;
```

Använd den för att initiera en editor eller en annan store som ansluter senare, via dess `setInitialValue`; se [Gemensam redigering](./collaborative-editing.md).  
Lagra den aldrig som filen: den bär med sig de borttagna entiteterna, och det publicerade [JSON Schema](./schema.md#json-schema) avvisar den.  
Det är de borttagna entiteterna som gör att en ångrad borttagning som skickas senare kan återställa entiteten i sin helhet i den store som initierats med den.  
De finns kvar tills dokumentet nästa gång öppnas från sin fil, vars form utelämnar dem.

### setInitialValue {#setinitialvalue}

Läser in editorns tidigare lagrade tillstånd.

```js
replicationStore.setInitialValue('json...');
```

Den tar emot lagringsformen, ett körtidsvärde eller ett dokument som en tidigare version har sparat, inklusive ett v2-dokument.  
En tom sträng, eller något som inte är en sträng, läser in ett nytt, tomt dokument i stället för att utlösa ett fel.  
En store som aldrig har fått något värde startar som samma nya dokument.  
Sedan `4.0.0` är alla [lås](../../guide/guides/settings.md#lock) på i det dokumentet, så dess `value` behåller den vy, den flik, det språk i kodgeneratorn, de skiftlägen för namn och den typ av citattecken som det startade med, medan editorerna som storen replikerar rullar, zoomar, byter flik eller ändrar de inställningarna. I `3.10.0` sparade det varken rullningsläget eller zoomnivån, och innan dess sparade det båda.  
Sedan `4.2.0` behåller det också sin namnvisning, `Physical Names`, medan editorerna byter sina.  
Ett lagrat dokument behåller de lås som det anger.  
Ett dokument som inte anger några lås, vilket gäller varje dokument som sparats före `4.0.0`, inklusive v2-dokument, läses in med alla lås på: vyns origo på `0, 0`, zoomnivån på `1` och fliken på ERD, oavsett vad det sparade, och kodgeneratorns språk, skiftlägena för namn och typen av citattecken så som det sparade dem.  
Ett dokument som sparats före `4.2.0` anger inte låset `Name View`, så det läses in med det låset på och i `Physical Names`, även ett dokument som sparats med alla andra lås av.  
Sedan `4.0.0` kastar `setInitialValue` också bort de samarbetsregister som hölls för det föregående dokumentet, som elementets [setInitialValue](../erd-editor-element.md#setinitialvalue) gör.  
Text som inte är JSON, till exempel en fil med kvarlämnade märken för sammanslagningskonflikter, utlöser inte heller något fel: tolkningsfelet loggas bara till konsolen, dokumentet töms och inställningarna förblir som de var.

Sedan `4.0.0` kör inläsningen ingen skräpinsamling, så borttagna entiteter finns kvar i [runtimeValue](#runtimevalue-getter).  
Tidigare tog den bort de entiteter som inte längre fanns i `doc` och som inte hade rörts på fyra dagar eller mer.

Inläsningens omskrivningar är klara innan `setInitialValue` returnerar: nyckelmärkena på kolumnerna, som läses av från varje kolumns alternativ och relationerna; varje tabell- och kolumnbredd, som mäts om med `toWidth`; punkterna där varje relationslinje möter sina tabeller; och varje relations flagga för identifierande relation och symbolen vid dess föräldraände.  
Inget av dem ingår i `value`, men `replicationStore.runtimeValue` som läses direkt efter anropet innehåller redan dem alla.  
En åtgärd som anländer direkt efter inläsningen, till exempel en återuppspelad rullning, jämförs med det inlästa dokumentet, så inläsningen i sig rapporteras aldrig som [`changed`](#onchange).

Varken inläsningen eller någon av de här omskrivningarna skickar `change`.  
Läs `replicationStore.value` själv när `setInitialValue` har returnerat om du vill att det inlästa dokumentet ska skrivas tillbaka i lagringsformen.

### on@change {#onchange}

Prenumererar på ändringar i editorns tillstånd.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` använder debounce på 200 ms, så en skur av åtgärder kommer fram som en enda avisering.  
Den utlöses bara för åtgärder av en typ som kan ändra dokumentet, samt åtgärden `settings.changeIgnoreSaveSettings` som en äldre editor fortfarande kan skicka (se [dispatch, dispatchSync](#dispatch-dispatchsync)).  
En vidarebefordrad närvaroåtgärd eller `editor.mergeLWW` väcker den aldrig.  
Anropa den returnerade funktionen för att avsluta prenumerationen.

Sedan `3.10.0` tar lyssnaren emot en `ReplicationChange`, en typ som `@dineug/erd-editor/engine.js` exporterar tillsammans med `ReplicationStore`.  
Före `3.10.0` tog den inte emot något, och en lyssnare som ignorerar argumentet fortsätter att fungera.  
`value` är det serialiserade dokumentet i lagringsformen, samma sträng som `replicationStore.value` returnerar i det ögonblicket, så du behöver inte serialisera det igen.  
`changed` är `false` när åtgärderna sedan föregående `change`, eller sedan inläsningen, har lämnat `value` byte för byte som det var.

En ändring som ett [lås](../../guide/guides/settings.md#lock) håller utanför `value` utlöser ändå `change`, med `changed` satt till `false`, så skriv bara när `changed` är `true`.  
Det gäller en rullning eller zoomning när `Viewport` är låst, ett flikbyte när `Canvas Type` är låst och en ändring av kodgeneratorns språk, ett skiftläge för namn eller typen av citattecken när dess eget lås är på.  
Sedan `4.2.0` gäller det även ett byte av namnvisning när `Name View` är låst: editorn skickar det ändå, men repliken kastar det, som de andra editorerna gör.  
Ett byte av namnvisning som görs i en skrivskyddad editor kastas på samma sätt, oavsett låset.  
Elementets händelse [change](../erd-editor-element.md#change) utelämnar en sådan ändring, men repliken rapporterar den ändå.  
Alla lås är på i ett nytt dokument och i ett som sparats före `4.0.0`, och `Name View` är låst i varje dokument som sparats före `4.2.0`.  
När `Viewport` är upplåst ändrar en rullning eller zoomning `value`, när `Canvas Type` är upplåst gäller detsamma när en annan av editorns flikar öppnas, och när `Name View` är upplåst gäller detsamma för ett byte av namnvisning från en editor som inte är skrivskyddad.  
Att slå på eller av ett lås ändrar också `value`.

Sedan `4.0.0` jämför `changed` lagringsformen, som varken innehåller de borttagna entiteterna eller staplingsordningen.  
En tabell som läggs till och tas bort igen inom en och samma `change`, en redigering som träffar en entitet som en annan medarbetare har tagit bort och en vidarebefordrad inläsning som bara ändrar staplingsordningen får därför alla också `changed` satt till `false`.  
Sedan `4.2.0` gäller det även en rad som läggs till på ett blad i ordlistan och lämnas tom, eftersom lagringsformen utelämnar en rad som inte innehåller något.

`changed` jämför aldrig med din lagrade fil, som redan kan skilja sig från `value` när den har lästs in: det gör en fil som en tidigare version har sparat, inklusive en v2-fil, och likaså en fil som börjar med ett byteordningsmärke och en fil som har redigerats för hand.  
Sedan `4.2.0` gäller det även en fil som `4.0.0` eller `4.1.0` har sparat, eftersom `value` utelämnar de tomma textfälten i dess entiteter och de tomma listorna i `doc` och tomma samlingarna som en sådan fil innehåller.  
En bytejämförelse med en sådan fil skulle räkna till och med en rullning som ett lås håller utanför som en redigering.  
Den första `change` med `changed` satt till `true` lämnar tillbaka en sådan fil i lagringsformen, så filen skrivs om en gång när du skriver den.  
En fil som den här versionen har sparat skiljer sig inte, var den än sparades, som [toWidth](#towidth) förklarar.  
Om `setInitialValue` körs medan en `change` fortfarande väntar, och inget dispatch-anrop görs innan den ska levereras, kommer den ändå, med det inlästa `value` och `changed` satt till `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Tillämpar ändringar från fjärreditorer på replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` skjuter upp arbetet till en microtask, och `dispatchSync` tillämpar batchen direkt.

Du kan skicka vidare strömmen från en delad store utan att filtrera den.  
Båda metoderna behåller bara åtgärder av en typ som kan ändra dokumentet, samt de två som beskrivs i slutet av det här avsnittet, och kastar resten, så närvaron som en session för gemensam redigering bär med sig – varje användares musmarkör, fokus, markering och dragruta – passerar igenom utan att göra något.

Sedan `3.10.0` ingår `relationship.changeOnDelete` och `relationship.changeOnUpdate` bland de behållna åtgärderna, och `relationship.add` bär med sig `onDelete` och `onUpdate`.  
En store från en tidigare version kastar de åtgärderna och ignorerar de fälten, så den förlorar referensåtgärderna [ON DELETE och ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) för en relation.

Sedan `4.0.0` ingår även `table.changeGroup`, sju av de åtta åtgärderna för `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` och `tableGroup.changeColor`, alla utom staplingsändringen `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` och `settings.changeDDLScript` bland de behållna åtgärderna.  
`settings.changeRelationshipOptimization` finns inte längre, så båda metoderna kastar den.  
En store från en tidigare version kastar de nya åtgärderna, så den förlorar [tabellgrupper](../../guide/guides/table-groups.md), [låsen](../../guide/guides/settings.md#lock), skripten för [Schema SQL](../../guide/guides/schema-sql.md) och de kolumner som [Mappa kolumner](../../guide/guides/relationship-editing.md#map-columns) ger en befintlig relation.  
Kör repliken på samma version som editorerna, eller en nyare.

`4.1.0` lägger inte till någon åtgärdstyp och lämnar `@dineug/erd-editor/engine.js` som det var, så en replik med `4.0.0` behåller varje ändring som en editor med `4.1.0` skickar, precis som en replik med `4.1.0` gör.  
Sedan `4.1.0` byter `Replace` och `Replace All` i [Sök och ersätt](../../guide/guides/find-and-replace.md#replacing) också namn på index och tabellgrupper, genom åtgärderna `index.changeName` och `tableGroup.changeName` som en replik med `4.0.0` redan behåller.  
[Utforskarens](../../guide/guides/explorer.md) eget tillstånd skickas aldrig, och ett flikbyte eller en rullning som den gör kommer fram som vilket annat flikbyte eller vilken annan rullning som helst; se [Gemensam redigering](./collaborative-editing.md).

Sedan `4.2.0` ingår även `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` samt `dictionary.add`, `dictionary.update` och `dictionary.remove` bland de behållna åtgärderna, där de tre sista bär varje redigering, sortering och CSV-import på bladen i [ordlistan](../../guide/guides/dictionary.md).  
Av bytena av namnvisning tillämpar en replik bara de som en editor som inte är skrivskyddad gör medan `Name View` är upplåst, och kastar resten (se [on@change](#onchange)).  
En store från en tidigare version kastar alla dessa åtgärder, så den förlorar de [logiska namnen](../../guide/guides/logical-names.md), domänkopplingarna, uppgiften om varje namn kom från ordlistorna, orden, termerna och domänerna samt namnvisningen.  
En editor från före `4.2.0` i sessionen kan ändå ta bort en del av detta från en replik med `4.2.0`.  
En `Import` av Schema SQL, GraphQL, DBML eller AML i den editorn, dock inte en `Import and Add`, tömmer replikens ord, termer och domäner.  
När den ångrar en inläsning, en `Import` eller `clear()` läser den in sin egen kopia av dokumentet i repliken, utan logiska namn, domänkopplingar eller ordlistor; se [Blanda versioner](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` exporterar samma `createReplicationStore`, `ReplicationStore` och `ReplicationChange` som tidigare, och `createReplicationStore` tar emot samma kontext.

Sedan `4.0.0` tillämpar båda metoderna också `editor.mergeLWW`, som bär de samarbetsregister som en editor svarar med när en annan ansluter till sessionen, så repliken avgör samtidiga redigeringar på samma sätt som editorerna.  
Den ändrar ingen byte i `value` och utlöser ingen `change`.  
`settings.changeIgnoreSaveSettings`, som en editor som släppts före `4.0.0` fortfarande kan skicka, behålls men ändrar ingenting: den utlöser `change` med `changed` satt till `false`.

### destroy {#destroy}

Förstör instansen av replicationStore helt.

```js
replicationStore.destroy();
```

Därefter slutar storen att skicka `change` och ignorerar ytterligare dispatch-anrop.  
Dokumentet fryses vid sitt senaste värde i stället för att utlösa ett fel.  
Skapa en ny store för att börja om.
