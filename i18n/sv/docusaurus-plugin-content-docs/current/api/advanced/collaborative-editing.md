---
sidebar_position: 1
description: Vidarebefordra editorändringar mellan instanser med getSharedStore, initiera en anslutande editor från runtimeValue och storens register, avgöra redigeringar som görs samtidigt och visa varje medarbetares markör, fokus, markering och dragruta.
---

# Gemensam redigering

`getSharedStore()` gör en editor till en nod i en session för gemensam redigering.  
Den skickar varje ändring som en ström av åtgärder och tillämpar de åtgärder som andra editorer skickar tillbaka – du tillhandahåller transporten mellan dem (WebSocket, WebRTC eller något annat som kan föra över JSON).  
Den är en av metoderna i [ErdEditorElement](../erd-editor-element.md) och kombineras med [fjärrlagring](./remote-storage.md) när de vidarebefordrade ändringarna också måste lagras.  
Sedan `5.1.0` binder du editorn med `@dineug/erd-editor-yjs` för att dela ett diagram via ett Yjs-dokument och någon av dess providers i stället för att koppla transporten själv; se [Yjs](./yjs.md).

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

`@dineug/erd-editor` exporterar ingen av de här typerna med namn. TypeScript-kod når dem via `ErdEditorElement`, som i `ReturnType<ErdEditorElement['getSharedStore']>`.

En åtgärd är ett vanligt serialiserbart objekt som beskriver en ändring av dokumentet, så den klarar `JSON.stringify` på vägen till transporten.  
De kommer i batcher: `subscribe` ger dig en array, och den arrayen är en enhet – vidarebefordra den i sin helhet och skicka den i sin helhet till dispatch på andra sidan.  
Behandla en åtgärd som ogenomskinlig och skicka den vidare oförändrad i stället för att läsa eller skriva om den, eftersom det är bokföringen den bär med sig, till exempel dess [version](#concurrent-edits), som håller editorerna synkroniserade.

En del av det som en editor gör stannar i den editorn.  
Att lägga en tabell, en anteckning eller en tabellgrupp överst, vilket sker när du markerar den, skickas inte.  
Inte heller skickas valen `Statements`, `Header`, `Write logical names into empty comments` (sedan `4.2.0`) och `Tables` på fliken [Schema SQL](../../guide/guides/schema-sql.md), som hör till det fönster där de görs.  
Sedan `4.1.0` stannar även [utforskaren](../../guide/guides/explorer.md) i sin editor: om den är öppen, dess bredd, dess hopfällda rader, raden med tangentbordsfokus, var dess träd är rullat samt dess sökning och alternativ skickas inte.  
Inte heller skickas det [ljus](../../guide/guides/relationship-editing.md#reading-a-connector) som tänds på relationens relationslinje när du går till en sekundärnyckel.  
Sedan `4.2.0` stannar även fliken [Ordlista](../../guide/guides/dictionary.md) i sin editor: vilket blad som visas samt varje blads sökning, markering, rullning och kolumnbredder skickas inte. Dess redigeringar, sorteringar och CSV-importer skickas däremot.  
En rullning, en zoomning eller ett flikbyte skickas, men det flyttar aldrig en annan användares vy eller flik. Det gäller även rullningen som ett hopp från utforskaren gör, bytet till ERD-fliken när utforskaren öppnas från en annan flik samt flikbytet och rullningen vid ett hopp från bladet [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) på fliken Ordlista till en tabell eller kolumn. Ett hopp från det bladet till ett ord, en term eller en domän stannar på fliken Ordlista, så ingenting av det skickas.

Sedan `4.2.0` skickas även ett byte av [namnvisning](../../guide/guides/logical-names.md#switching-the-view), och namnvisningens [lås](../../guide/guides/settings.md#lock) avgör vad de andra editorerna gör med bytet. Låset `Name View` är på i ett nytt diagram och i varje dokument från före `4.2.0`.  
När låset är på syns bytet bara i den editor som gjorde det: det skickas ändå, men alla andra editorer och alla repliker kastar det, så varje användare kan titta på en egen visning medan `value` behåller den låsta.  
När låset är av ändrar ett byte som görs i en redigerbar editor namnvisningen i alla editorer och repliker, där det senaste bytet vinner, och var och en av dem sparar den.  
En skrivskyddad editors eget byte stannar alltid i den editorn, och editorn följer ändå de andras delade byten.

Sedan `5.1.0` följer en ändring av språket i [kodgeneratorn](../../guide/guides/code-generator.md), av skiftläget för tabellnamn, av skiftläget för kolumnnamn eller av typen av citattecken sitt eget lås (`Language`, `Table Name Case`, `Column Name Case` eller `Bracket Type`) på samma sätt, med en skillnad: medan låset är på skickas ändringen inte alls.  
Den syns bara i editorn som gjorde den, vars flikar Kodgenerator och Schema SQL följer den, och ingen annan editor eller replik ser den. `value` och `runtimeValue` behåller det låsta värdet, så inte heller en anslutande editor som initieras från någon editor ser den, och varje användare kan titta på ett eget språk, skiftläge eller en egen typ av citattecken medan låset är på.  
Medan låset är av skickas en ändring som görs i en editor som kan redigera märkt som delad (`shared: true` i dess nyttolast). Den ändrar inställningen i alla editorer och repliker, där den senaste ändringen vinner, och var och en av dem sparar den. En editor eller replik med `5.1.0` tillämpar en märkt ändring oavsett vad dess eget lås anger, så en ändring som görs direkt efter en upplåsning landar överallt, även där den kommer fram före upplåsningen.  
Före `5.1.0` nådde en sådan ändring alla editorer och repliker oavsett om dess lås var på eller inte, medan filen behöll det låsta värdet.

Sedan `5.0.0` skickar en [skrivskyddad](../erd-editor-element.md#readonly) editor inga ändringar alls. Rullningen, zoomningen, fliken, namnvisningen, databasen, kodgeneratorns språk, skiftlägena, typen av citattecken och raderna under `View Option` som läsaren ändrar stannar på dess skärm, oavsett vad deras lås anger. Före `5.0.0` skickades dess rullningar, zoomningar, flikbyten, databas och kodinställningar som en redigerbar editors.  
Dess store skickar ändå det som dess spårare skickar av läsarens markör, fokus, markering och dragruta, svarar på de register som en editor som ansluter ber om och tillämpar varje ändring som de andra skickar. En ändring av databasen, av en inställning i kodgeneratorn eller av en rad under `View Option` når dess dokument, och dess skärm också om inte läsaren har ändrat den inställningen där, och ett delat byte av namnvisning syns på dess skärm i båda fallen. Sedan `5.1.0` får den en inställning i kodgeneratorn bara när den inställningen ändrades med låset av eller en upplåsning bär med sig den.  
När editorn blir skrivskyddad skickar den först det som storen ännu håller tillbaka av ett drag eller en rullning, så som [flushStreamBuffers](#flushstreambuffers) gör, så att de andra behåller det sista av det.

[Lås](../../guide/guides/settings.md#lock) delas: den senaste låsningen eller upplåsningen av en inställning vinner i alla editorer, och ett lås bär med sig värdena från editorn som slog på det, så att alla editorer och repliker sparar samma värde.  
Låset `Viewport` sparar därför vyn i editorn som slog på det, och låset `Canvas Type` den sista flik som den editorn var på före fliken Inställningar, där lås slås på.  
Att slå av låset `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` eller, sedan `4.2.0`, `Name View` ställer också in den inställningen i alla editorer på det värde som visas i editorn som slog av det, inklusive dess egen ändring som gjordes under låset, så att de fortsätter att spara ett och samma värde. Att slå av `Viewport` eller `Canvas Type` flyttar ingens vy eller flik.

En redigering av skriptet `Before tables` eller `After tables` skickas i sin helhet när dess fält tappar fokus. De två skripten avgörs var för sig, så en medarbetares redigering av det ena skriver aldrig över det andra.

Ingenting som görs i [flödesläget](../../guide/guides/visualization.md#flow-never-edits-the-document) på fliken Visualisering är en ändring av dokumentet, så en editor i flödet skickar inga ändringar till de andra, och de ändringar som de skickar fortsätter att tillämpas medan den är där.  
Det finns två undantag. Att lämna flödet för en annan flik är ett flikbyte, som skickas som alla andra. Sedan `4.2.0` är ett val i listan för namnvisning i flödets verktygsfält ett byte av namnvisning, som skickas och tillämpas som ett byte på arbetsytan.  
`Previous table`, `Next table` och tangenterna för att ångra och göra om, som [stegar igenom vyerna](../../guide/guides/visualization.md#previous-table-and-next-table) i flödet, skickas inte.  
Kortknappen för extern länk, öppnandet av [utforskaren](../../guide/guides/explorer.md#opening-and-closing) och ett resultat i [snabbsökningen](../../guide/guides/quick-search.md#searching-the-diagram) som väljs efter `#`, `@` eller `:` lämnar alla flödet för ERD-fliken. En rullning som kortknappen eller ett resultat i snabbsökningen gör där skickas också.

## Två editorer på en sida {#two-editors-on-one-page}

Kopplingen från subscribe till dispatch här står i stället för nätverket, så att du kan se hur en session är uppbyggd utan att en transport står i vägen.

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

Båda editorerna här utgår från samma nya, tomma dokument, så ingen av dem behöver initieras.  
Med tre eller fler editorer skickar du varje editors batcher till alla andra: en editor skickar aldrig vidare det som den har tagit emot.

## Initiera en medarbetare {#seeding-a-collaborator}

En delad store vidarebefordrar ändringar när de görs och ger aldrig en anslutande editor dokumentet som det ser ut, så en editor som ansluter till en session som redan pågår måste först få dokumentet.  
Sedan `4.0.0` initierar du den med [`runtimeValue`](../erd-editor-element.md#runtimevalue) från en editor som redan är med i sessionen, inte med `value` eller den sparade filen.  
Ett rum som är bundet med [`@dineug/erd-editor-yjs`](./yjs.md) håller själv dokumentet när en klient har [initierat](./yjs.md#seeding-a-room) det, så varje editor som är bunden till det öppnar det dokumentet utan att något `runtimeValue` lämnas över.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Körtidsvärdet innehåller fortfarande det som har tagits bort sedan dokumentet öppnades, så när en annan editor senare ångrar en borttagning återställer den anslutande editorn tabellen med dess namn och kolumner.  
[`value`](../erd-editor-element.md#value) är den form som en fil innehåller, utan borttagna entiteter, så en anslutande editor som initieras med den, eller med filen, skulle i stället återställa en tom tabell utan namn.  
Sedan `4.2.0` gäller samma sak för ett ord, en term eller en domän som tagits bort från ett blad i [ordlistan](../../guide/guides/dictionary.md): när en annan editor ångrar borttagningen listar en anslutande editor som initierats med `runtimeValue` raden igen i sin helhet, och en som initierats med `value` listar en tom rad, som dess egen `value` sedan utelämnar.  
Fortsätt att skriva `value` till lagringen: `runtimeValue` är bara till för att initiera en annan editor, en andra vy eller en [replicationStore](./remote-storage.md).  
Editorerna i VS Code, Obsidian, en JetBrains-IDE och webbappen initierar en andra vy av ett öppet dokument på det här sättet.

`setInitialValue` vidarebefordras inte, så när du initierar den anslutande editorn ändras ingenting hos de andra.  
Sedan `4.0.0` rensar den också editorns register för gemensam redigering, som avgör [samtidiga redigeringar](#concurrent-edits). Om editorns delade store redan har haft en prenumerant ber storen de andra editorerna om deras register igen, som vid dess första [subscribe](#subscribe), så att en editor som läses in på nytt mitt i en session avgör redigeringar på samma sätt som de andra.  
Att tilldela `value` behåller registren, men till skillnad från `setInitialValue` vidarebefordras det: så snart editorn har en delad store läser varje editor i sessionen in det tilldelade dokumentet, så initiera aldrig en anslutande editor på det sättet.

Varken `value` eller `runtimeValue` innehåller registren eller den version som editorns klocka har nått, så en anslutande editor som initieras enbart från `runtimeValue` får dem från svaret som editorerna i sessionen skickar på dess första subscribe.  
Tills det svaret kommer fram kan en redigering som den anslutande editorn gör bära en lägre version än den som de andra håller, så de nekar den medan den blir kvar hos den anslutande editorn, och en äldre skrivning som fortfarande är på väg landar över den nyare som initieringen håller. Där ingen editor som körs svarar, till exempel när en server eller ett dokumentlager håller sessionens dokument, får den anslutande editorn dem aldrig.  
Sedan `5.1.0` lämnar du över dem tillsammans med värdet. Anropa [`flushStreamBuffers()`](#flushstreambuffers) på en editor i sessionen, så att ett drag eller en färgändring som den fortfarande håller inne skickas först, och läs sedan `runtimeValue` och dess stores [`getLWW()`](#getlww) och [`getVersion()`](#getversion) i samma ögonblick. Den anslutande editorn läser in värdet med `setInitialValue` och tar sedan resten med sin egen stores [`mergeLWW`](#mergelww), i den ordningen, eftersom varje `setInitialValue` rensar registren. Dess nästa redigering bär då en version som ligger över varje version som initieringen håller, så den landar utan något svar att vänta på. På en store som redan finns gör [`reseed`](#reseed) båda i ett anrop.

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

En initiering som sparas på det här sättet för att öppna senare anslutande editorer håller alla tre tillsammans. Den är ingen fil: `value` är fortfarande det som ska skrivas till lagringen.  
En [replicationStore](./remote-storage.md#runtimevalue-getter) lämnar inte över några register, så en anslutande editor som initieras från dess `runtimeValue` tar dem fortfarande från editorernas svar.

## Samtidiga redigeringar {#concurrent-edits}

Varje editor och replik håller, för varje namn och nästan varje annat fält, versionen av skrivningen som satte det: det är dess register för gemensam redigering. En skrivning landar bara när dess version inte ligger under den som hålls, så editorer som hör samma ändringar i olika ordning slutar med samma dokument.  
Sedan `5.1.0` bär varje version, under sin räknare, en plats som tillhör den skrivande editorn själv och som tas från dess id. Versioner växer därför i steg om 4 194 304 och växer ur ett 32-bitars heltal när räknaren når 512. `JSON.stringify` och `JSON.parse` för dem vidare oskadda, men ett relä eller en lagring som tolkar dem i ett annat språk måste behålla dem som 64-bitars tal, aldrig som 32-bitars heltal.

Sedan `5.1.0` slutar två editorer som ändrar ett namn eller ett fält samtidigt, bortsett från undantagen nedan, med samma värde i varje editor och replik: de skriver med en och samma räknare men stämplar två olika versioner, och den större vinner överallt. Före `5.1.0` kunde båda stämpla en och samma version, och varje editor behöll den som den hörde sist, så de kunde sluta olika. Två editorer delar plats med oddsen 1 på 4 194 304 per par, och då står de lika som förut.

Sedan `5.1.0` versioneras en tabells position, en antecknings eller tabellgrupps position och storlek samt vyns ursprung och zoomnivå på samma sätt, och det som flyttar dem skickas som var de hamnar:

- ett drag som en enda `table.moveTo`, `memo.moveTo` eller `tableGroup.moveTo` per flyttad entitet, i en batch, så att ett gruppdrag bär sina tabellers punkter, och sedan `5.1.1` även sina anteckningars, tillsammans med gruppens;
- en ångring eller omgörning av ett drag som den punkt som den lägger varje entitet på;
- en panorering som `settings.scrollTo` och en zoomning som `settings.changeZoomLevel`;
- en storleksändring av en anteckning eller tabellgrupp som dess position och storlek tillsammans.

Två användare som flyttar, eller flyttar och ändrar storlek på, en och samma tabell, anteckning eller tabellgrupp samtidigt slutar därför med den på en och samma punkt och i en och samma storlek i varje editor och replik. Punkten går till skrivningen med den större versionen, båda axlarna tillsammans. En flytt skriver ingen storlek, så en storleksändring behåller sin storlek även där en flytt som görs samtidigt tar punkten.  
Före `5.1.0` skickades ett drag som sträckan som flyttats, så två drag av en tabell adderades, och en flytt och en storleksändring av en anteckning eller tabellgrupp som gjordes samtidigt kunde sluta olika.  
Ett drag under 20 px, som inte lämnar något steg i ångrahistoriken, skickas som alla andra, så som en punkt kan det åsidosätta ett drag av samma entitet som en annan användare gjorde samtidigt. En batch med drag, panorering eller zoomning som en transport levererar två gånger flyttar ingenting två gånger.

En färgändring är ett undantag. Den skickas utan version, och varje editor och replik stämplar den med sin egen och behåller den färg som den hörde sist, så två användare som ändrar färg på en och samma tabell, anteckning eller tabellgrupp samtidigt kan sluta med olika färger.  
Några ändringar har ingen version alls, så varje editor och replik tillämpar dem i den ordning den hör dem, och två som görs samtidigt kan också sluta olika: en kolumn som flyttas inom sin tabell eller sitt index (`column.move`, `indexColumn.move`) samt en ändring av [databasen](../../guide/guides/table-related-functions.md#databases), av en rad under [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) eller av `Relationship DataType Sync`, `Maximum comment width` eller `Column Order` på fliken [Inställningar](../../guide/guides/settings.md).  
Entiteter som två användare lägger till samtidigt, till exempel två tabeller eller två kolumner i en tabell, kan också stå i olika ordning i varje editor och replik, och var och ens `value` sparar sin egen ordning.

Allt det här gäller mellan editorer och repliker med `5.1.0` eller senare; [Blanda versioner](#mixing-releases) säger vad en äldre ändrar.

## Blanda versioner {#mixing-releases}

En editor tillämpar bara de åtgärdstyper som dess egen version känner till, så i en session som blandar versioner missar de äldre editorerna allt som skickas med en nyare typ.

Sedan `3.10.0` skickas en ändring av en relations [ON DELETE eller ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) som en av två nya åtgärdstyper, `relationship.changeOnDelete` och `relationship.changeOnUpdate`, och `relationship.add` kan bära båda. Ett relä som skickar åtgärder vidare oförändrade behöver inget nytt för dem.  
En editor från före `3.10.0` ignorerar de åtgärdstyperna och fälten: den får aldrig veta en relations ON DELETE eller ON UPDATE, och ett dokument som sparas från en sådan editor har ingetdera. En relation som en äldre editor lägger till kommer fram utan dem, så båda börjar som `Not set`.

Alla andra ändringar som en editor med `3.10.0` skickar använder åtgärdstyper som äldre editorer redan känner till.  
`Replace All` i [Sök och ersätt](../../guide/guides/find-and-replace.md#replacing) skickar sina ändringar som en enda batch av samma åtgärder för namnbyte, kommentarer och anteckningar som en redigering för hand skickar. [Visningsalternativen](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` och `Referential Actions` skickas med den befintliga åtgärden `settings.changeShow`.

Sedan `4.0.0` skickas de här ändringarna med nya åtgärdstyper, och ett relä som skickar åtgärder vidare oförändrade behöver inget nytt för dem:

- en [tabellgrupp](../../guide/guides/table-groups.md) som läggs till, flyttas, ändrar storlek, byter namn, byter färg eller tas bort: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` och `tableGroup.remove`; en tabell som går med i eller lämnar en grupp: `table.changeGroup`;
- en sparning med `Save` i [Mappa kolumner](../../guide/guides/relationship-editing.md#map-columns) för en befintlig relation, som anger båda dess kolumnlistor på en gång: `relationship.changeColumns`;
- ett [lås](../../guide/guides/settings.md#lock) som slås på eller av: `settings.changeLockSettings`;
- en redigering av skriptet `Before tables` eller `After tables` på fliken [Schema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Visningsalternativen `Table Groups` och `Memos` skickas med den befintliga åtgärden `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, som växlingsknapparna `Save Scroll Information` och `Save Zoom Information` skickade innan låsen ersatte dem, skickas inte längre, och `settings.changeRelationshipOptimization` finns inte kvar. En editor med `4.0.0` som tar emot någon av dem ändrar ingenting.

En editor från före `4.0.0` ignorerar de nya åtgärdstyperna: den ser aldrig en tabellgrupp eller vilka tabeller som ingår i den, men när en grupp dras flyttas gruppens tabeller ändå där, eftersom draget också skickar en flytt av var och en av de tabellerna.  
Den behåller en relations gamla kolumner efter en sparning med `Save` i Mappa kolumner, och när en kolumn i den gamla mappningen tas bort i den editorn försvinner relationen i alla editorer. Den har inga lås och inga skript.  
Ett dokument som sparas från en sådan editor har inget av detta, och en editor med `4.0.0` öppnar det med alla lås på.  
Håll alla editorer i en session, och varje [replicationStore](./remote-storage.md#dispatch-dispatchsync) som lagrar dess dokument, på `4.0.0` eller senare.

En editor med `4.1.0` skickar ingen ny åtgärdstyp, så editorer och repliker med `4.0.0` och `4.1.0` delar en session utan att något går förlorat.  
Dess funktion [Sök och ersätt](../../guide/guides/find-and-replace.md#replacing) söker också i indexnamn och tabellgruppsnamn, och `Replace` och `Replace All` byter namn på dem med åtgärderna `index.changeName` och `tableGroup.changeName`, som en editor med `4.0.0` redan tillämpar.

Sedan `4.2.0` skickas de här ändringarna med nya åtgärdstyper, och ett relä som skickar åtgärder vidare oförändrade behöver inget nytt för dem:

- en tabells eller kolumns [logiska namn](../../guide/guides/logical-names.md): `table.changeLogicalName` och `column.changeLogicalName`; om dess namn [härleddes från ordlistorna](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` och `column.changeNameDerived`;
- en kolumn som kopplas till en [domän](../../guide/guides/dictionary.md#domains-and-data-types) eller kopplas från: `column.changeDomain`;
- ett ord, en term eller en domän som läggs till, ändras (inklusive dess plats på bladet, som en sortering anger den) eller tas bort på fliken [Ordlista](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` och `dictionary.remove`;
- ett byte av [namnvisning](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Låset `Name View` skickas med den befintliga åtgärden `settings.changeLockSettings`, visningsalternativet `Domain` med `settings.changeShow` och en flytt av `Logical Name` eller `Domain` i [kolumnordningen](../../guide/guides/settings.md#adjusting-column-order) med `settings.changeColumnOrder`.  
Åtgärderna `editor.clear` och `editor.loadJson` i en import av Schema SQL, GraphQL, DBML eller AML från `Import` bär `keepDictionaries: true`, som behåller orden, termerna och domänerna i alla editorer. Det gör även åtgärderna från ett ersättande anrop till [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` eller `setSchemaAML`.  
Ett fysiskt namn som ordlistorna härleder skickas med `table.changeName` eller `column.changeName`, och den datatyp som en domän ger sina kolumner med `column.changeDataType`, samma åtgärder som en redigering för hand skickar.

En editor från före `4.2.0` ignorerar de nya åtgärdstyperna: den har inga logiska namn, domänkopplingar, ordlistor eller namnvisning. En låsning eller upplåsning av `Name View` ändrar ingenting där, och det gör inte heller en flytt av `Logical Name` eller `Domain` i kolumnordningen, eller en flytt till någon av dem. Detsamma gäller låset `Canvas Type` när det slås på av en editor som kom till fliken Inställningar från fliken Ordlista: den äldre editorn känner inte till den fliken, så den behåller `Canvas Type` upplåst. Den visar ändå de fysiska namn som ordlistorna härleder och de datatyper som domänerna ger.  
Dess egna redigeringar känner inte till logiska namn, domäner eller ordlistorna, med följande effekter i de nyare editorerna:

- En tabell eller kolumn som den byter namn på för hand behåller sitt namn märkt som härlett, så ett logiskt namn som senare skrivs för den i en nyare editor kan härleda namnet igen och ersätta det som den äldre editorn skrev in.
- En datatyp som den ger en kolumn som är kopplad till en domän lämnar kopplingen kvar, så bladet `Checks` listar `Domain type mismatch` och domänens nästa typändring ger kolumnen domänens typ igen.
- Sekundärnyckelkolumnerna i en relation som den lägger till får inget logiskt namn och ingen domän från sin nyckel.
- En tabell som den klistrar in eller duplicerar kommer fram utan logiska namn och domänkopplingar.
- En import av Schema SQL, GraphQL, DBML eller AML i den skickar inget `keepDictionaries`, så den tömmer orden, termerna och domänerna i alla editorer.
- När den ångrar en inläsning, en import eller `clear()` läser den in sin egen kopia av dokumentet i alla editorer, och den kopian har inga logiska namn, domänkopplingar eller ordlistor.
- Den kopian, och dokumentet som en import av Schema SQL, GraphQL, DBML eller AML i den läser in, återställer också låset `Name View` i alla editorer till det läge som den äldre editorn fann det i. Alla editorer sparar sedan `Physical Names` som namnvisning och visar den också om låset är av.

Ett dokument som sparas från en sådan editor har inga logiska namn, domänkopplingar, ordlistor eller namnvisning, så en editor med `4.2.0` öppnar det i `Physical Names`. Den äldre editorn sparar dock låset `Name View` som den fann det, så ett dokument som låsts upp i en editor med `4.2.0` förblir upplåst.  
Håll alla editorer i en session, och varje [replicationStore](./remote-storage.md#dispatch-dispatchsync) som lagrar dess dokument, på `4.2.0` eller senare.

En editor med `5.1.0` skickar ingen ny åtgärdstyp, så editorer och repliker från före `5.1.0` delar fortfarande en session med den, och ett relä som skickar åtgärder vidare oförändrade behöver inget nytt. Det som [Samtidiga redigeringar](#concurrent-edits) beskriver gäller dock bara mellan editorer och repliker med `5.1.0`:

- Drag från en editor med `5.1.0` skickas som punkter på `table.moveTo`, `memo.moveTo` och `tableGroup.moveTo`, som äldre editorer redan tillämpar, och dess panoreringar och zoomningar som punkter på `settings.scrollTo` och `settings.changeZoomLevel`, som, liksom varje panorering och zoomning, ingen annan editor tillämpar och bara repliker tar emot. En äldre editor tillämpar varje punkt i ett drag i den ordning den kommer fram, utanför alla register, och en äldre replik gör detsamma med varje punkt i ett drag, en panorering eller en zoomning, så två punkter som skickas samtidigt för en entitet, eller för vyn, kan sluta olika där.
- En äldre editors drag skickas fortfarande som en sträcka som flyttats, som varje editor och replik adderar utanför sina register, och dess panorering eller zoomning likaså som en sträcka, som varje replik adderar på samma sätt. En sträcka och en punkt för en och samma entitet som görs samtidigt kan sluta olika på editorer och repliker som hör dem i olika ordning, och en sträcka som en transport levererar två gånger adderas två gånger.
- Utanför undantagen som [Samtidiga redigeringar](#concurrent-edits) nämner vinner nästan alltid en skrivning av ett namn eller fält från en editor med `5.1.0` som görs samtidigt med en äldre editors skrivning av det, med samma svar i varje editor och replik. Två äldre editorer kan fortfarande sluta olika över ett fält som skrivs samtidigt.
- En editor med `5.1.0` skickar en ändring av språk, skiftläge eller typ av citattecken i kodgeneratorn bara medan dess lås är av, med märket `shared: true`, som en äldre editor bortser från: den tillämpar ändringen som förut. En äldre editor skickar fortfarande en ändring som den gör under låset, utan märke: en editor eller replik med `5.1.0` kastar den medan den inställningen är låst där, och äldre editorer tillämpar den. Under ett lås följer alltså de äldre editorerna varandras val medan editorerna med `5.1.0` behåller sina egna, och filen behåller det låsta värdet i båda fallen. En upplåsning som görs i någondera versionen bär upplåsarens värde till varje editor och replik.
- En inläsning som ersätter dokumentet, till exempel ett tilldelat `value`, `clear()` eller en ersättande import, avslutar ritandet av en relation i varje editor med `5.1.0`, både den som gjorde den och varje editor som tar emot den. En äldre editor behåller sitt ritläge aktivt genom den.

Håll alla editorer i en session, och varje [replicationStore](./remote-storage.md#dispatch-dispatchsync) som lagrar dess dokument, på `5.1.0` eller senare, så att redigeringar som görs samtidigt slutar lika överallt, bortsett från undantagen som [Samtidiga redigeringar](#concurrent-edits) nämner; `4.2.0` eller senare är fortfarande det som behåller logiska namn och ordlistor. En [MCP-server](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) före `1.2.0` räknas här som en editor före `5.1.0`, och en editor före `5.1.0` kan inte alls bindas till ett [Yjs](./yjs.md)-rum.

Sedan `5.1.1` skickas det med en ny åtgärdstyp, `memo.changeGroup`, när en anteckning går med i eller lämnar en [tabellgrupp](../../guide/guides/table-groups.md), och ett relä som skickar åtgärder vidare oförändrade behöver inget nytt för den. Den skickas för en anteckning som släpps i eller utanför en grupp, för en ny grupp som ritas runt synliga anteckningar som inte ingår i någon grupp, för `Group selected tables` med anteckningar markerade tillsammans med tabellerna, för `Remove from group` med anteckningar i markeringen, för varje anteckning i en borttagen grupp, för en kodagents anrop som ändrar anteckningars grupper via [MCP-servern](../../mcp/tools.md#table-groups) och för ångring och omgörning av vart och ett av dem. Ett tillägg med `Import and Add` eller `setSchemaJSON` vars grupper innehåller anteckningar skickar den också, och det gör även dess omgörning, medan dess ångring bara tar bort de anteckningarna.

En editor eller replik från före `5.1.1` ignorerar `memo.changeGroup`, och dess tolkning tar bort varje antecknings `groupId`, så att den aldrig ser en anteckning i en grupp, även om ett gruppdrag i en editor med `5.1.1` fortfarande flyttar gruppens anteckningar där, eftersom det också skickar en `memo.moveTo` för var och en av dem. Dess egna redigeringar vet ingenting om anteckningarnas grupper, med de här följderna för de nyare editorerna:

- En anteckning som den drar in i en grupps ruta förblir utanför gruppen, och en anteckning i gruppen som den drar ut ur rutan stannar kvar i gruppen, medan rutan sträcks ut så att den rymmer anteckningen.
- Dess gruppdrag, liksom dess `Auto Layout`, flyttar gruppen och dess tabeller men låter gruppens anteckningar stå kvar där de är, och rutan sträcks ut så att den rymmer de synliga anteckningarna där.
- En `Import and Add` i den lägger ingen anteckning i de grupper som den lägger till.
- När den tar bort en grupp anger `groupId` för var och en av gruppens anteckningar fortfarande gruppen: anteckningarna räknas som om de inte ingick i någon grupp, och när den ångrar borttagningen läggs de tillbaka i gruppen.
- När den ångrar en inläsning, en import eller `clear()` läser den in sin egen kopia av dokumentet i alla editorer, och den kopian har ingen anteckning i någon grupp.

Ett dokument som sparas från en sådan editor har ingen anteckning i någon grupp, men en sådan editor från `4.0.0` och senare behåller tabellernas grupper.  
Håll alla editorer i en session, och varje [replicationStore](./remote-storage.md#dispatch-dispatchsync) som lagrar dess dokument, på `5.1.1` eller senare för att behålla anteckningarna i sina tabellgrupper; `5.1.0` eller senare är fortfarande det som avgör redigeringar som görs samtidigt. En [MCP-server](../../mcp/installation.md#updating) före `1.2.1` varken ser eller behåller på samma sätt vilken tabellgrupp en anteckning ingår i.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Anger smeknamnet som visas bredvid den här användarens musmarkör i de andra editorerna.  
Andra användare ser `user` när smeknamnet saknas eller är tomt.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Sänder den här användarens musmarkör till de andra editorerna. Standardvärdet är `true`.  
Markörer som andra användare skickar visas alltid på ERD-arbetsytan.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Sänder vad den här användaren arbetar med. Standardvärdet är `true`.  
Tabellen och cellen som du har fokuserat, tabellerna, anteckningarna och tabellgrupperna som du har markerat och rutan som du drar upp på arbetsytan skickas till de andra editorerna och ritas där.  
Varje användare får en egen färg så att du kan skilja dem åt: en kontur på den fokuserade tabellen, en understrykning under den fokuserade cellen, en ring runt de markerade tabellerna, anteckningarna och tabellgrupperna och en streckad rektangel för dragrutan.  
Sedan `4.2.0` kan användarna titta på var sin [namnvisning](../../guide/guides/logical-names.md#collaborators) medan dess lås är på, eller efter ett eget byte i en skrivskyddad editor. En fokuserad cell som din visning inte ritar stryks under på den cell som din visning ritar i dess ställe: namnet och det logiska namnet ersätter varandra, liksom datatypen och domänen gör.  
Närvaroinformation som kommer från andra användare ritas alltid på din arbetsyta, oavsett om det här alternativet är på eller inte.  
I flödesläget på fliken Visualisering ritas andra användares fokus och markering på tabellkorten, men inte deras dragrutor. De tabeller som du markerar där skickas ändå; rutan som du drar upp där skickas inte.

```js
editor.getSharedStore({ focusTracker: false });
```

Slå av båda spårarna för att använda den delade storen som ett enkelt relä som inte publicerar någon egen närvaroinformation.  
Närvaroinformation som andra editorer skickar tas ändå emot och ritas.  
Så gör editorerna i VS Code, Obsidian, en JetBrains-IDE och Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Markören, fokus, markeringen och dragrutan skickas i samma ström som dokumentändringarna, men de är flyktiga.  
De hamnar aldrig i dokumentet, ångrahistoriken eller `editor.value`, så en transport kan fritt kasta dem och en replicationStore ignorerar dem.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

De här metoderna anger det aktuella anslutningstillståndet.  
Medan anslutningen är bruten buffras ändringar internt.  
De buffrade ändringarna skickas till prenumeranterna så snart överföring är möjlig igen.  
Standardtillståndet är anslutet (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Tillämpar ändringar från andra editorinstanser på den aktuella editorinstansen.  
När en batch innehåller en annan editors begäran om register, som en anslutande editors första [subscribe](#subscribe) skickar, svarar storen genom sina prenumeranter med sina register och sin version, om den inte saknar register.  
Sedan `5.1.0` skickar den först varje strömbatch som den fortfarande håller inne, som [flushStreamBuffers](#flushstreambuffers) gör, så att varje version som svaret bär vilar på en skrivning som de andra har fått. En anslutande editors ankomst gör därför att varje editor i sessionen på en gång skickar ett drag, en panorering, en zoomning, en färgändring eller en storleksändring av en anteckning som den fortfarande håller inne.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Prenumererar på ändringar i editorn.  
Ingenting lämnar editorn förrän det finns minst en prenumerant, och ändringar som görs innan dess buffras.  
Den första prenumerationen ber också de andra editorerna om deras register för gemensam redigering, som avgör [samtidiga redigeringar](#concurrent-edits), så att en editor som ansluter sent avgör dem på samma sätt.  
Den för inte med sig dokumentet, så [initiera](#seeding-a-collaborator) en sent anslutande editor först; sedan `5.1.0` kan initieringen bära registren också.  
Sedan `4.0.0` frågar storen igen varje gång `setInitialValue`, eller sedan `5.1.0` [reseed](#reseed), läser in ett dokument i dess editor efter den första prenumerationen.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Skickar direkt de strömbatcher som den här storen fortfarande håller inne, i stället för efter deras viloperiod.  
Sedan `3.9.2` fungerar den på en store från `getSharedStore`; i `3.9.1` finns metoden i typen men gör ingenting.  
Att flytta en tabell, en anteckning eller en tabellgrupp, ändra dess färg, ändra storlek på en anteckning och rulla eller zooma vyn görs var för sig som en ström av små ändringar. Att ändra storlek på en tabellgrupp görs inte så: det skickas en gång, när draget avslutas.  
Storen samlar varje ström i en batch och håller inne den tills strömmen har varit tyst i 200 ms, i två steg. En färgändring eller en storleksändring av en anteckning passerar båda, så den skickas ungefär 400 ms efter den sista ändringen, som varje ström gjorde före `5.1.0`. Sedan `5.1.0` skickas ett drag, en panorering eller en zoomning efter det första steget, ungefär 200 ms efter dess sista ändring, som var det hamnar (se [Samtidiga redigeringar](#concurrent-edits)).  
Ett anrop avslutar den väntan i båda stegen. Medan storen är ansluten tar en prenumerant emot batchen innan anropet returnerar. Ett anrop när ingenting hålls inne skickar ingenting.  
`destroy`, storens egen eller editorns, kastar en batch som fortfarande hålls inne, så anropa den här metoden först när du släpper en store och de andra ska behålla den sista ändringen, som när en flik stängs.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Returnerar sedan `5.1.0` en kopia av editorns register för gemensam redigering (se [Samtidiga redigeringar](#concurrent-edits)).  
Kopian görs via JSON, så den är ett vanligt objekt som är redo för `JSON.stringify`, och en ändring av den lämnar storens register som de var.  
Lämna över den som den är till en annan stores [mergeLWW](#mergelww) eller [reseed](#reseed). Dess form är editorns egen, så läs inget fält i den.  
Läs den tillsammans med [getVersion](#getversion) och editorns `runtimeValue` i samma ögonblick för att [initiera en anslutande editor](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Tar sedan `5.1.0` in register som en annan store lämnade ut med [getLWW](#getlww) i den här storens, och behåller den större versionen av vart och ett, och tar in `version` i editorns klocka, som behåller den större av sin egen och den givna.  
Den ändrar ingenting i dokumentet: inte en enda byte av `value` eller `runtimeValue`, inget steg i ångrahistoriken och ingen händelse `change`. Den höjer bara de versioner som en senare skrivning måste slå, så en skrivning som är äldre än de givna registren nekas efteråt, och editorns nästa redigering bär en version över `version`.  
Den skickar ingenting och svarar inte på något. Det är vad en anslutande editors första subscribe får från de andras svar, taget in direkt.  
Anropa den efter `setInitialValue`, aldrig före: varje `setInitialValue` och varje [reseed](#reseed) rensar de register som hålls, och med dem det som en `mergeLWW` före den tog in.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Returnerar sedan `5.1.0` den högsta version som editorns klocka har slagit ihop: den största av versionerna för de ändringar som den gjorde eller tog in, för begäranden om register och svaren som en anslutning utbyter, och för varje `version` som getts till `mergeLWW` eller `reseed`.  
Markörer, fokus, markeringar och dragrutor, både dess egna och en annan editors, flyttar den inte.  
Lämna över den tillsammans med [getLWW()](#getlww), läst i samma ögonblick, till en anslutande editors [mergeLWW](#mergelww) eller [reseed](#reseed). Den är en [version](#concurrent-edits) av samma slag som dem som dess åtgärder bär.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Tar sedan `5.1.0` genast bort markören, fokus, markeringen och dragrutan som editorn med det givna id:t skickade, och den utgångstid som var och en väntade på. Alla andra editorers ligger kvar.  
Id:t är det `meta.editorId` som varje åtgärd från den editorns delade store bär. Ett id som den här editorn inte håller något av ändrar ingenting.  
Anropa den när din transport får veta att en deltagare har lämnat. Annars ligger det som deltagaren skickade kvar ritat tills det löper ut: dess markör 30 sekunder efter den senast mottagna, dess fokus och markering 90 sekunder efter och dess dragruta 3 sekunder efter.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Öppnar sedan `5.1.0` en sessions dokument i editorn på nytt, som en återanslutning gör. Bindningen till [Yjs](./yjs.md) anropar den för att öppna ett rums dokument när den binds till ett rum som har initierats, och på nytt vid varje återanslutning, då den behåller skärmen när editorn väl hade anslutit till rummet.  
Den läser in `value` som [setInitialValue](../erd-editor-element.md#setinitialvalue) gör och tar `lww` och `version` som [mergeLWW](#mergelww) gör, så att storen sedan håller exakt de givna registren och dess klocka den större av sin egen version och `version`. Den tömmer också ångrahistoriken och, till skillnad från `setInitialValue`, släpper markeringen och fokus, eftersom de kan peka på något som värdet inte längre innehåller.  
Bortsett från härledningen av logiska namn nedan gör den inget steg i ångrahistoriken, skickar ingen händelse `change` och skickar ingen ändring. När storen väl har haft en prenumerant skickar den begäran om register som varje sådan inläsning skickar, som en transport som redan har lämnat över registren kan kasta, och, med [focusTracker](#focustracker) på, den rensade markeringen och det rensade fokuset.  
Liksom `setInitialValue` fungerar den medan [readonly](../erd-editor-element.md#readonly) är satt, rensar flödet, avslutar ritandet av en relation och stänger redigerarna för anteckningar, tabellgruppsnamn och celler, och behåller eller släpper det som skrevs in i dem på samma sätt; när en cell för logiskt namn stängs och härleder ett namn från det som dess läsare skrev är det namnet en vanlig redigering: det skickas, går att ångra och skickas även som händelsen `change`.

Utan `keepScreen` visar skärmen det som värdet innehåller, som efter `setInitialValue`. Med `keepScreen: true` läggs läsarens skärm tillbaka över det inlästa dokumentet, på den skärmen enbart:

- rullningsläget och zoomnivån, när elementet har visat dem; ett som aldrig har visats, eller lästs in medan det var dolt och inte visats sedan dess, öppnas där värdet lägger det, som en sent anslutande editor gör;
- fliken, när inläsningen flyttade den, och på fliken Inställningar också fliken som läsaren kom från, som ett lås `Canvas Type` som slås på där anger;
- namnvisningen och varje inställning i kodgeneratorn som läsaren visade på egen hand under sitt lås, men bara när det låset var på före inläsningen, fortfarande är på efter den och håller samma låsta värde. När en deltagare alltså har låst upp, ändrat och låst en inställning igen med ett annat värde under tiden öppnas editorn på det nya låsta värdet, och där låset är av före eller efter inläsningen visar den det inlästa värdet;
- varje inställning som en skrivskyddad läsare ändrade på sin egen skärm, oavsett vad låsen anger.

Inget av detta skickas, och `value` och `runtimeValue` rapporterar fortfarande det inlästa dokumentet. En deltagares senare upplåsning ersätter en kodinställning som behållits på det här sättet, som varje upplåsning gör.  
Läsarens nästa rullning eller zoomning som görs medan editorn kan redigera gör det behållna rullningsläget och den behållna zoomnivån till dokumentets igen, och skickas med skärmens aktuella läge först, så att repliker tar den zoomen också.

En återinitiering lämnar det som storen håller inne som det är. Ett drag, en panorering eller en zoomning som fortfarande hålls inne skickas efter den, avläst från det återinitierade dokumentet; en färgändring eller en storleksändring av en anteckning skickas som den gjordes, fastän editorn inte längre visar den; och det som `disconnect()` höll inne skickas vid `connection()`.  
Anropa därför [flushStreamBuffers](#flushstreambuffers) först, skicka det den sänder ut och återinitiera med ett värde som innehåller det. Återinitiera aldrig medan anslutningen är bruten.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Förstör instansen av sharedStore helt.  
Själva editorn lämnas orörd, så dokumentet förblir redigerbart när du lämnar en session.  
Mus- och fokusspårarna stannar när den sista sharedStore som editorn har lämnat ut förstörs.  
En strömbatch som storen fortfarande håller inne kastas tillsammans med den; anropa [flushStreamBuffers](#flushstreambuffers) först för att skicka den.  
Markörerna, fokus, markeringarna och dragrutorna som andra editorer skickade ligger kvar ritade tills de löper ut; sedan `5.1.0` tar [forgetPeer](#forgetpeer) bort en editors på en gång.

```js
sharedStore.destroy();
```
