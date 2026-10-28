---
sidebar_position: 1
description: Vidarebefordra editorändringar mellan instanser med getSharedStore, initiera en anslutande editor från runtimeValue och visa varje medarbetares markör, fokus, markering och dragruta.
---

# Gemensam redigering

`getSharedStore()` gör en editor till en nod i en session för gemensam redigering.  
Den skickar varje ändring som en ström av åtgärder och tillämpar de åtgärder som andra editorer skickar tillbaka – du tillhandahåller transporten mellan dem (WebSocket, WebRTC eller något annat som kan föra över JSON).  
Den är en av metoderna i [ErdEditorElement](../erd-editor-element.md) och kombineras med [fjärrlagring](./remote-storage.md) när de vidarebefordrade ändringarna också måste lagras.

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

En åtgärd är ett vanligt serialiserbart objekt som beskriver en ändring av dokumentet, så den klarar `JSON.stringify` på vägen till transporten.  
De kommer i batcher: `subscribe` ger dig en array, och den arrayen är en enhet – vidarebefordra den i sin helhet och skicka den i sin helhet till dispatch på andra sidan.  
Behandla en åtgärd som ogenomskinlig och skicka den vidare oförändrad i stället för att läsa eller skriva om den, eftersom det är bokföringen den bär med sig som håller editorerna synkroniserade.

En del av det som en editor gör stannar i den editorn.  
Att lägga en tabell, en anteckning eller en tabellgrupp överst, vilket sker när du markerar den, skickas inte.  
Inte heller skickas valen `Statements`, `Header`, `Write logical names into empty comments` (sedan `4.2.0`) och `Tables` på fliken [Schema SQL](../../guide/guides/schema-sql.md), som hör till det fönster där de görs.  
Sedan `4.1.0` stannar även [utforskaren](../../guide/guides/explorer.md) i sin editor: om den är öppen, dess bredd, dess hopfällda rader, raden med tangentbordsfokus, var dess träd är rullat samt dess sökning och alternativ skickas inte.  
Inte heller skickas det [ljus](../../guide/guides/relationship-editing.md#reading-a-connector) som tänds på relationens relationslinje när du går till en sekundärnyckel.  
Sedan `4.2.0` stannar även fliken [Ordlista](../../guide/guides/dictionary.md) i sin editor: vilket blad som visas samt varje blads sökning, markering, rullning och kolumnbredder skickas inte. Dess redigeringar, sorteringar och CSV-importer skickas däremot.  
En rullning, en zoomning eller ett flikbyte skickas, men det flyttar aldrig en annan användares vy eller flik. Det gäller även rullningen som ett hopp från utforskaren gör, bytet till ERD-fliken när utforskaren öppnas från en annan flik samt flikbytet och rullningen vid ett hopp från bladet [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) på fliken Ordlista till en tabell eller kolumn. Ett hopp från det bladet till ett ord, en term eller en domän stannar på fliken Ordlista, så ingenting av det skickas.

Sedan `4.2.0` skickas även ett byte av [namnvisning](../../guide/guides/logical-names.md#switching-the-view), och namnvisningens [lås](../../guide/guides/settings.md#lock) avgör vad de andra editorerna gör med bytet. Låset `Name View` är på i ett nytt diagram och i varje dokument från före `4.2.0`.  
När låset är på syns bytet bara i den editor som gjorde det: det skickas ändå, men alla andra editorer och alla repliker kastar det, så varje användare kan titta på en egen visning medan `value` behåller den låsta. En ändring av språk, skiftläge eller typ av citattecken är annorlunda: den når alla editorer oavsett om dess lås är på eller inte.  
När låset är av ändrar ett byte som görs i en redigerbar editor namnvisningen i alla editorer och repliker, där det senaste bytet vinner, och var och en av dem sparar den.  
En skrivskyddad editors eget byte stannar alltid i den editorn, och editorn följer ändå de andras delade byten.

Sedan `5.0.0` skickar en [skrivskyddad](../erd-editor-element.md#readonly) editor inga ändringar alls. Rullningen, zoomningen, fliken, namnvisningen, databasen, kodgeneratorns språk, skiftlägena, typen av citattecken och raderna under `View Option` som läsaren ändrar stannar på dess skärm, oavsett vad deras lås anger. Före `5.0.0` skickades dess rullningar, zoomningar, flikbyten, databas och kodinställningar som en redigerbar editors.  
Dess store skickar ändå det som dess spårare skickar av läsarens markör, fokus, markering och dragruta, svarar på de register som en editor som ansluter ber om och tillämpar varje ändring som de andra skickar. En ändring av databasen, av en inställning i kodgeneratorn eller av en rad under `View Option` når dess dokument, och dess skärm också om inte läsaren har ändrat den inställningen där, och ett delat byte av namnvisning syns på dess skärm i båda fallen.  
När editorn blir skrivskyddad skickar den först det som storen ännu håller tillbaka av ett drag eller en rullning, så som [flushStreamBuffers](#flushstreambuffers) gör, så att de andra behåller det sista av det.

[Lås](../../guide/guides/settings.md#lock) delas: den senaste låsningen eller upplåsningen av en inställning vinner i alla editorer, och ett lås bär med sig värdena från editorn som slog på det, så att alla editorer och repliker sparar samma värde.  
Låset `Viewport` sparar därför vyn i editorn som slog på det, och låset `Canvas Type` den sista flik som den editorn var på före fliken Inställningar, där lås slås på.  
Att slå av låset `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` eller, sedan `4.2.0`, `Name View` ställer också in den inställningen i alla editorer på det värde som visas i editorn som slog av det, så att de fortsätter att spara ett och samma värde. Att slå av `Viewport` eller `Canvas Type` flyttar ingens vy eller flik.

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
Sedan `4.0.0` rensar den också editorns samarbetsregister, som avgör samtidiga redigeringar. Om editorns delade store redan har haft en prenumerant ber storen de andra editorerna om deras register igen, som vid dess första [subscribe](#subscribe), så att en editor som läses in på nytt mitt i en session avgör redigeringar på samma sätt som de andra.  
Att tilldela `value` behåller registren, men till skillnad från `setInitialValue` vidarebefordras det: så snart editorn har en delad store läser varje editor i sessionen in det tilldelade dokumentet, så initiera aldrig en anslutande editor på det sättet.

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

En editor från före `4.0.0` ignorerar de nya åtgärdstyperna: den ser aldrig en tabellgrupp eller vilka tabeller som ingår i den, men när en grupp dras flyttas gruppens tabeller ändå där, eftersom draget också skickar deras `table.move`.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Prenumererar på ändringar i editorn.  
Ingenting lämnar editorn förrän det finns minst en prenumerant, och ändringar som görs innan dess buffras.  
Den första prenumerationen ber också de andra editorerna om deras samarbetsregister, som avgör samtidiga redigeringar, så att en editor som ansluter sent avgör dem på samma sätt.  
Den för inte med sig dokumentet, så [initiera](#seeding-a-collaborator) en sent anslutande editor först.  
Sedan `4.0.0` frågar storen igen varje gång `setInitialValue` läser in ett dokument i dess editor efter den första prenumerationen.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Skickar direkt de strömbatcher som den här storen fortfarande håller inne, i stället för efter deras viloperiod.  
Sedan `3.9.2` fungerar den på en store från `getSharedStore`; i `3.9.1` finns metoden i typen men gör ingenting.  
Att flytta en tabell, en anteckning eller en tabellgrupp, ändra dess färg, ändra storlek på en anteckning och rulla eller zooma vyn kommer var för sig fram som en ström av små ändringar. Att ändra storlek på en tabellgrupp gör det inte: det skickas en gång, när draget avslutas.  
Storen samlar varje ström i en batch och håller inne den tills strömmen har varit tyst i 200 ms. Den gör detta i två steg, så batchen skickas ungefär 400 ms efter den sista ändringen.  
Ett anrop avslutar den väntan i båda stegen. Medan storen är ansluten tar en prenumerant emot batchen innan anropet returnerar. Ett anrop när ingenting hålls inne skickar ingenting.  
`destroy`, storens egen eller editorns, kastar en batch som fortfarande hålls inne, så anropa den här metoden först när du släpper en store och de andra ska behålla den sista ändringen, som när en flik stängs.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Förstör instansen av sharedStore helt.  
Själva editorn lämnas orörd, så dokumentet förblir redigerbart när du lämnar en session.  
Mus- och fokusspårarna stannar när den sista sharedStore som editorn har lämnat ut förstörs.  
En strömbatch som storen fortfarande håller inne kastas tillsammans med den; anropa [flushStreamBuffers](#flushstreambuffers) först för att skicka den.

```js
sharedStore.destroy();
```
