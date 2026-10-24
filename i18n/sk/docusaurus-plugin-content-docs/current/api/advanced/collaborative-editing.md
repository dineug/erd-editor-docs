---
sidebar_position: 1
description: Preposielanie zmien editora medzi inštanciami pomocou getSharedStore, inicializácia pripájajúceho sa editora z runtimeValue a zobrazenie kurzora, fokusu, výberu a ťahaného rámca každého spolupracovníka.
---

# Spoločné úpravy

Metóda `getSharedStore()` mení editor na uzol v relácii spoločných úprav.  
Každú zmenu vysiela ako prúd akcií a aplikuje akcie, ktoré mu späť posielajú ostatné editory – prenos medzi nimi zabezpečujete sami (WebSocket, WebRTC alebo čokoľvek iné, čo dokáže preniesť JSON).  
Je to jedna z metód elementu [ErdEditorElement](../erd-editor-element.md) a používa sa spolu s funkciou [Vzdialené ukladanie](./remote-storage.md), keď treba preposielané zmeny aj ukladať.

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

Akcia je obyčajný serializovateľný objekt, ktorý opisuje jednu zmenu dokumentu, takže na ceste k prenosu bez ujmy prejde funkciou `JSON.stringify`.  
Akcie prichádzajú v dávkach: metóda `subscribe` vám odovzdá pole a toto pole je jeden celok – celé ho preposlite a na druhej strane ho celé odovzdajte metóde dispatch.  
S akciou zaobchádzajte ako s nepriehľadnou hodnotou a namiesto čítania alebo prepisovania ju odovzdávajte ďalej presne tak, ako je, pretože práve pomocné údaje, ktoré nesie, udržiavajú editory synchronizované.

Časť toho, čo editor robí, zostáva iba v ňom.  
Presunutie tabuľky, poznámky alebo skupiny tabuliek dopredu, ku ktorému dochádza aj pri ich výbere, sa neodosiela.  
Neodosielajú sa ani voľby `Statements`, `Header`, `Write logical names into empty comments` (od verzie `4.2.0`) a `Tables` na karte [Schéma SQL](../../guide/guides/schema-sql.md), ktoré patria oknu, v ktorom sa urobili.  
Od verzie `4.1.0` zostáva vo svojom editore aj [prieskumník](../../guide/guides/explorer.md): to, či je otvorený, jeho šírka, zbalené riadky, riadok s fokusom klávesnice, poloha posunutia stromu ani jeho vyhľadávanie a možnosti sa neodosielajú.  
Neodosiela sa ani [zvýraznenie](../../guide/guides/relationship-editing.md#reading-a-connector), ktorým prechod na cudzí kľúč označí spojnicu jeho vzťahu.  
Od verzie `4.2.0` zostáva vo svojom editore aj karta [Slovník](../../guide/guides/dictionary.md): to, ktorý hárok sa zobrazuje, ani vyhľadávanie, výber, posunutie a šírky stĺpcov každého hárka sa neodosielajú. Jej úpravy, zoradenia a importy súborov CSV sa odosielajú.  
Posunutie, priblíženie alebo prepnutie karty sa odošle, ale nikdy neposunie zobrazenie ani neprepne kartu iného používateľa. Platí to aj pre posunutie, ktoré spôsobí skok z prieskumníka, pre prepnutie na kartu ERD, keď sa prieskumník otvorí z inej karty, a pre prepnutie karty a posunutie pri skoku z hárka [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) na karte Slovník na tabuľku alebo stĺpec. Skok z tohto hárka na slovo, termín alebo doménu zostáva na karte Slovník, takže sa z neho nič neodošle.

Od verzie `4.2.0` sa odosiela aj prepnutie [Zobrazenia názvov](../../guide/guides/logical-names.md#switching-the-view) a o tom, čo s ním urobia ostatné editory, rozhoduje jeho [zamknutie](../../guide/guides/settings.md#lock). Zamknutie `Name View` je zapnuté v novom diagrame a v každom dokumente spred verzie `4.2.0`.  
Kým je zamknutie zapnuté, prepnutie sa prejaví iba v editore, ktorý ho urobil: odošle sa síce, ale každý iný editor a každá replika ho zahodí, takže každý používateľ sa môže pozerať na iné zobrazenie, zatiaľ čo `value` uchováva zamknuté zobrazenie. Inak je to pri zmene jazyka, štýlu názvov alebo typu úvodzoviek: tá sa dostane do každého editora bez ohľadu na to, či je jej zamknutie zapnuté.  
Kým je zamknutie vypnuté, prepnutie urobené v editore, ktorý môže upravovať, zmení Zobrazenie názvov v každom editore a replike, pričom platí posledné prepnutie, a každý z nich ho uloží.  
Vlastné prepnutie v editore iba na čítanie vždy zostane v tomto editore a tento editor sa naďalej riadi zdieľanými prepnutiami ostatných.

[Zamknutia](../../guide/guides/settings.md#lock) sú zdieľané: v každom editore platí posledné zamknutie alebo odomknutie nastavenia a zamknutie nesie hodnoty editora, ktorý ho zapol, takže každý editor aj každá replika ukladá rovnakú hodnotu.  
Zamknutie `Viewport` preto uloží zobrazenie editora, ktorý ho zapol, a zamknutie `Canvas Type` poslednú kartu, na ktorej bol tento editor pred kartou Nastavenia, kde sa zamknutia zapínajú.  
Vypnutie zamknutia `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` alebo od verzie `4.2.0` `Name View` zároveň zmení toto nastavenie v každom editore na hodnotu zobrazenú v editore, ktorý ho vypol, takže všetky editory naďalej ukladajú jednu hodnotu. Vypnutie zamknutia `Viewport` alebo `Canvas Type` nikomu neposunie zobrazenie ani neprepne kartu.

Úprava skriptu `Before tables` alebo `After tables` sa odošle celá, keď jeho pole stratí fokus. Oba skripty sa zosúlaďujú samostatne, takže úprava jedného z nich od spolupracovníka nikdy neprepíše druhý.

Nič, čo sa urobí v [režime Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) na karte Vizualizácia, nie je zmenou dokumentu, takže editor v režime Flow neposiela ostatným žiadne zmeny a zmeny, ktoré posielajú ony, sa v ňom medzitým naďalej aplikujú.  
Výnimky sú dve. Odchod z režimu Flow na inú kartu je prepnutím karty a odošle sa ako každé iné. Od verzie `4.2.0` je výber v zozname Zobrazenia názvov na paneli nástrojov režimu Flow prepnutím Zobrazenia názvov, ktoré sa odošle a aplikuje rovnako ako prepnutie urobené na plátne.  
Tlačidlá `Previous table` a `Next table` a klávesy na vrátenie späť a opätovné vykonanie, ktorými sa v režime Flow [krokuje medzi zobrazeniami](../../guide/guides/visualization.md#previous-table-and-next-table), sa neodosielajú.  
Tlačidlo externého odkazu na kartičke, výsledok [rýchleho vyhľadávania](../../guide/guides/quick-search.md#searching-the-diagram) vybratý po zadaní `#`, `@` alebo `:` a otvorenie [prieskumníka](../../guide/guides/explorer.md#opening-and-closing) prepnú z režimu Flow na kartu ERD. Odošle sa aj posunutie, ktoré tam spôsobí tlačidlo na kartičke alebo výsledok rýchleho vyhľadávania.

## Dva editory na jednej stránke {#two-editors-on-one-page}

Prepojenie subscribe s dispatch tu zastupuje sieť, takže vidíte podobu relácie bez toho, aby jej prekážal prenos.

```js
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

Oba editory tu začínajú z rovnakého nového, prázdneho dokumentu, takže ani jeden netreba inicializovať.  
Pri troch alebo viacerých editoroch posielajte dávky každého z nich všetkým ostatným: editor nikdy neposúva ďalej to, čo prijal.

## Inicializácia spolupracovníka {#seeding-a-collaborator}

Zdieľané úložisko preposiela zmeny tak, ako vznikajú, a nikdy neodovzdá pripájajúcemu sa editoru dokument v jeho aktuálnom stave, takže editor, ktorý sa pripája k už prebiehajúcej relácii, musí najprv dostať dokument.  
Od verzie `4.0.0` ho inicializujte hodnotou [`runtimeValue`](../erd-editor-element.md#runtimevalue) z editora, ktorý už v relácii je, nie hodnotou `value` ani uloženým súborom.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Hodnota za behu stále obsahuje to, čo sa od otvorenia dokumentu odstránilo, takže keď iný editor neskôr vráti späť odstránenie, pripojený editor obnoví tabuľku aj s jej názvom a stĺpcami.  
Vlastnosť [`value`](../erd-editor-element.md#value) je forma, ktorú obsahuje súbor, bez odstránených entít, takže pripojený editor inicializovaný z nej alebo zo súboru by namiesto toho obnovil prázdnu tabuľku bez názvu.  
Od verzie `4.2.0` to isté platí pre slovo, termín alebo doménu odstránenú z hárka karty [Slovník](../../guide/guides/dictionary.md): keď iný editor vráti odstránenie späť, pripojený editor inicializovaný z `runtimeValue` znova uvedie celý riadok, kým editor inicializovaný z `value` uvedie prázdny riadok, ktorý potom jeho vlastná vlastnosť `value` vynechá.  
Do trvalého úložiska naďalej zapisujte hodnotu `value`: hodnota `runtimeValue` slúži iba na inicializáciu ďalšieho editora, druhého zobrazenia alebo úložiska [replicationStore](./remote-storage.md).  
Editory vo VS Code, v aplikácii Obsidian, v IDE od JetBrains a vo webovej aplikácii takto inicializujú druhé zobrazenie otvoreného dokumentu.

Volanie metódy `setInitialValue` sa nepreposiela, takže inicializácia pripájajúceho sa editora v ostatných nič nezmení.  
Od verzie `4.0.0` zároveň zahodí registre spolupráce editora, ktoré zosúlaďujú súbežné úpravy. Ak už zdieľané úložisko editora malo odberateľa, úložisko znova požiada ostatné editory o ich registre, rovnako ako pri svojom prvom volaní [subscribe](#subscribe), takže editor, ktorý sa znova načíta uprostred relácie, zosúlaďuje úpravy rovnako ako ostatné.  
Priradenie vlastnosti `value` registre zachová, ale na rozdiel od metódy `setInitialValue` sa preposiela: keď už má editor zdieľané úložisko, každý editor v relácii načíta priradený dokument, preto pripájajúci sa editor takto nikdy neinicializujte.

## Kombinovanie verzií {#mixing-releases}

Editor aplikuje iba typy akcií, ktoré pozná jeho vlastná verzia, takže v relácii s rôznymi verziami staršie editory prídu o všetko, čo sa prenáša novším typom.

Od verzie `3.10.0` sa zmena nastavenia [ON DELETE alebo ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) vzťahu prenáša ako jeden z dvoch nových typov akcií, `relationship.changeOnDelete` a `relationship.changeOnUpdate`, a akcia `relationship.add` môže niesť obe. Pri preposielaní akcií bez zmeny pre ne netreba nič nové.  
Editor starší ako verzia `3.10.0` tieto typy akcií a polia ignoruje: nikdy sa nedozvie nastavenie ON DELETE ani ON UPDATE vzťahu a dokument z neho uložený neobsahuje ani jedno. Vzťah, ktorý pridá starší editor, prichádza bez nich, takže obe začínajú na hodnote `Not set`.

Každá iná zmena, ktorú posiela editor verzie `3.10.0`, sa prenáša typmi akcií, ktoré staršie editory už poznajú.  
Tlačidlo `Replace All` v [hľadaní a nahrádzaní](../../guide/guides/find-and-replace.md#replacing) odošle svoje úpravy ako jednu dávku tých istých akcií pre premenovanie, komentáre a poznámky, aké odosiela ručná úprava. [Možnosti zobrazenia](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` a `Referential Actions` sa prenášajú existujúcou akciou `settings.changeShow`.

Od verzie `4.0.0` sa tieto zmeny prenášajú novými typmi akcií a pri preposielaní akcií bez zmeny pre ne netreba nič nové:

- pridanie, presun, zmena veľkosti, premenovanie, zmena farby alebo odstránenie [skupiny tabuliek](../../guide/guides/table-groups.md): `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` a `tableGroup.remove`; pripojenie tabuľky k skupine alebo jej odchod zo skupiny: `table.changeGroup`;
- uloženie tlačidlom `Save` v dialógovom okne [Mapovať stĺpce](../../guide/guides/relationship-editing.md#map-columns) pri existujúcom vzťahu, ktoré naraz nastaví oba jeho zoznamy stĺpcov: `relationship.changeColumns`;
- zapnutie alebo vypnutie [zamknutia](../../guide/guides/settings.md#lock): `settings.changeLockSettings`;
- úprava skriptu `Before tables` alebo `After tables` na karte [Schéma SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Možnosti zobrazenia `Table Groups` a `Memos` sa prenášajú existujúcou akciou `settings.changeShow`.  
Akcia `settings.changeIgnoreSaveSettings`, ktorú posielali prepínače `Save Scroll Information` a `Save Zoom Information` predtým, ako ich nahradili zamknutia, sa už neodosiela a akcia `settings.changeRelationshipOptimization` už neexistuje. Editor verzie `4.0.0`, ktorý prijme ktorúkoľvek z nich, nič nezmení.

Editor starší ako verzia `4.0.0` nové typy akcií ignoruje: nikdy neuvidí skupinu tabuliek ani to, ktoré tabuľky do nej patria, hoci presúvanie skupiny myšou v ňom tabuľky skupiny aj tak presunie, pretože odosiela aj ich akcie `table.move`.  
Po uložení tlačidlom `Save` v dialógovom okne Mapovať stĺpce si ponechá staré stĺpce vzťahu a keď sa v ňom odstráni stĺpec tohto starého mapovania, vzťah zmizne vo všetkých editoroch. Nemá žiadne zamknutia ani skripty.  
Dokument z neho uložený nič z toho neobsahuje a editor verzie `4.0.0` ho otvorí so všetkými zamknutiami zapnutými.  
Všetky editory v relácii a každé úložisko [replicationStore](./remote-storage.md#dispatch-dispatchsync), ktoré ukladá jej dokument, udržiavajte vo verzii `4.0.0` alebo novšej.

Editor verzie `4.1.0` neposiela žiadny nový typ akcie, takže editory a repliky verzií `4.0.0` a `4.1.0` zdieľajú jednu reláciu a nič im neunikne.  
Jeho [hľadanie a nahrádzanie](../../guide/guides/find-and-replace.md#replacing) prehľadáva aj názvy indexov a názvy skupín tabuliek a tlačidlá `Replace` a `Replace All` ich premenúvajú akciami `index.changeName` a `tableGroup.changeName`, ktoré editor verzie `4.0.0` už aplikuje.

Od verzie `4.2.0` sa tieto zmeny prenášajú novými typmi akcií a pri preposielaní akcií bez zmeny pre ne netreba nič nové:

- [logický názov](../../guide/guides/logical-names.md) tabuľky alebo stĺpca: `table.changeLogicalName` a `column.changeLogicalName`; to, či bol ich názov [odvodený zo slovníkov](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` a `column.changeNameDerived`;
- prepojenie stĺpca s [doménou](../../guide/guides/dictionary.md#domains-and-data-types) alebo jeho odpojenie: `column.changeDomain`;
- pridanie, zmena (vrátane poradia v hárku, ako ho nastaví zoradenie) alebo odstránenie slova, termínu alebo domény na karte [Slovník](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` a `dictionary.remove`;
- prepnutie [Zobrazenia názvov](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Zamknutie `Name View` sa prenáša existujúcou akciou `settings.changeLockSettings`, možnosť zobrazenia `Domain` akciou `settings.changeShow` a presun riadka `Logical Name` alebo `Domain` v [poradí stĺpcov](../../guide/guides/settings.md#adjusting-column-order) akciou `settings.changeColumnOrder`.  
Akcie `editor.clear` a `editor.loadJson` importu schémy vo formáte SQL, GraphQL, DBML alebo AML z položky `Import` nesú `keepDictionaries: true`, čo v každom editore zachová slová, termíny a domény. Rovnako aj akcie nahrádzajúceho volania [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` alebo `setSchemaAML`.  
Fyzický názov, ktorý sa odvodí zo slovníkov, sa prenáša akciou `table.changeName` alebo `column.changeName` a typ údajov, ktorý doména dáva svojim stĺpcom, akciou `column.changeDataType`, teda akciami, ktoré posiela ručná úprava.

Editor starší ako verzia `4.2.0` nové typy akcií ignoruje: nemá logické názvy, prepojenia s doménami, slovníky ani Zobrazenie názvov. Zamknutie alebo odomknutie `Name View` v ňom nič nezmení a nezmení nič ani presun riadka `Logical Name` alebo `Domain` v poradí stĺpcov, ani presun iného riadka na miesto niektorého z nich. Nič nezmení ani zamknutie `Canvas Type`, ktoré zapol editor, ktorý na kartu Nastavenia prešiel z karty Slovník: starší editor túto kartu nepozná, a preto ponechá nastavenie `Canvas Type` odomknuté. Naďalej zobrazuje fyzické názvy, ktoré sa odvodia zo slovníkov, a typy údajov, ktoré dávajú domény.  
Jeho vlastné úpravy nevedia nič o logických názvoch, doménach ani slovníkoch, čo má na novšie editory tieto účinky:

- Tabuľka alebo stĺpec, ktoré ručne premenuje, si ponechajú názov označený ako odvodený, takže logický názov, ktorý sa pre ne neskôr zapíše v novšom editore, môže znova odvodiť názov a prepísať ním ten, ktorý zadal starší editor.
- Typ údajov, ktorý dá stĺpcu prepojenému s doménou, prepojenie ponechá, takže hárok `Checks` uvedie kontrolu `Domain type mismatch` a ďalšia zmena typu domény dá stĺpcu znova typ domény.
- Stĺpce cudzieho kľúča vzťahu, ktorý pridá, nedostanú zo svojho kľúča logický názov ani doménu.
- Tabuľka, ktorú prilepí alebo duplikuje, príde bez logických názvov a prepojení s doménami.
- Import schémy vo formáte SQL, GraphQL, DBML alebo AML v ňom neposiela `keepDictionaries`, takže vyprázdni slová, termíny a domény v každom editore.
- Keď sa v ňom vráti späť načítanie, import alebo volanie `clear()`, v každom editore sa načíta jeho vlastná kópia dokumentu a táto kópia nemá logické názvy, prepojenia s doménami ani slovníky.
- Táto kópia a dokument, ktorý v ňom načíta import schémy vo formáte SQL, GraphQL, DBML alebo AML, zároveň v každom editore vrátia zamknutie `Name View` do stavu, v akom ho našiel tento starší editor. Každý editor potom ako Zobrazenie názvov ukladá zobrazenie `Physical Names`, a ak je zamknutie vypnuté, aj ho zobrazuje.

Dokument z neho uložený nemá logické názvy, prepojenia s doménami, slovníky ani Zobrazenie názvov, takže ho editor verzie `4.2.0` otvorí v zobrazení `Physical Names`. Zamknutie `Name View` však starší editor uloží tak, ako ho našiel, takže dokument odomknutý v editore verzie `4.2.0` zostane odomknutý.  
Všetky editory v relácii a každé úložisko [replicationStore](./remote-storage.md#dispatch-dispatchsync), ktoré ukladá jej dokument, udržiavajte vo verzii `4.2.0` alebo novšej.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Nastaví prezývku, ktorá sa v ostatných editoroch zobrazuje vedľa kurzora myši tohto používateľa.  
Ak prezývka chýba alebo je prázdna, ostatní používatelia vidia `user`.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Vysiela kurzor myši tohto používateľa do ostatných editorov. Predvolená hodnota je `true`.  
Kurzory, ktoré posielajú ostatní používatelia, sa na plátne ERD zobrazujú vždy.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Vysiela, na čom tento používateľ pracuje. Predvolená hodnota je `true`.  
Tabuľka a bunka, na ktorých máte fokus, tabuľky, poznámky a skupiny tabuliek, ktoré máte vybraté, a rámec, ktorý ťaháte na plátne, sa odosielajú do ostatných editorov a tam sa vykresľujú.  
Každý používateľ dostane vlastnú farbu, takže ich rozoznáte: obrys tabuľky s fokusom, podčiarknutie bunky s fokusom, orámovanie okolo vybratých tabuliek, poznámok a skupín tabuliek a prerušovaný obdĺžnik pre ťahaný rámec.  
Od verzie `4.2.0` sa každý používateľ môže pozerať na iné [Zobrazenie názvov](../../guide/guides/logical-names.md#collaborators), kým je jeho zamknutie zapnuté, alebo po vlastnom prepnutí v editore iba na čítanie. Bunka s fokusom, ktorú vaše zobrazenie nevykresľuje, sa podčiarkne na bunke, ktorú vykresľuje namiesto nej: fyzický názov a logický názov sa navzájom zastupujú, rovnako ako typ údajov a doména.  
Údaje o prítomnosti, ktoré prichádzajú od ostatných používateľov, sa na vašom plátne vykresľujú vždy, či je táto možnosť zapnutá, alebo nie.  
V režime Flow na karte Vizualizácia sa fokus a výber ostatných používateľov vykresľujú na kartičkách tabuliek, ich ťahané rámce však nie. Tabuľky, ktoré tam vyberiete, sa stále odosielajú; rámec, ktorý tam ťaháte, nie.

```js
editor.getSharedStore({ focusTracker: false });
```

Vypnite oba sledovače, ak chcete zdieľané úložisko používať iba na preposielanie, bez zverejňovania vlastných údajov o prítomnosti.  
Údaje o prítomnosti, ktoré posielajú ostatné editory, sa aj tak prijímajú a vykresľujú.  
Takto to robia editory vo VS Code, v aplikácii Obsidian, v IDE od JetBrains a v službe Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Kurzor, fokus, výber a ťahaný rámec sa prenášajú tým istým prúdom ako zmeny dokumentu, sú však prchavé.  
Nikdy sa nedostanú do dokumentu, histórie zmien ani do vlastnosti `editor.value`, takže prenos ich môže pokojne zahodiť a úložisko replicationStore ich ignoruje.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Tieto metódy nastavujú aktuálny stav pripojenia.  
V odpojenom stave sa zmeny interne ukladajú do vyrovnávacej pamäte.  
Zmeny z vyrovnávacej pamäte sa odošlú odberateľom, len čo je prenos znova možný.  
Predvolený stav je pripojený (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplikuje zmeny z iných inštancií editora na aktuálnu inštanciu editora.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Prihlási sa na odber zmien v editore.  
Kým nie je aspoň jeden odberateľ, z editora nič neodíde a zmeny urobené predtým sa ukladajú do vyrovnávacej pamäte.  
Prvé volanie subscribe zároveň požiada ostatné editory o ich registre spolupráce, ktoré zosúlaďujú súbežné úpravy, takže ich editor, ktorý sa pripojí neskôr, zosúlaďuje rovnako.  
Dokument neprinesie, preto editor, ktorý sa pripája neskôr, najprv [inicializujte](#seeding-a-collaborator).  
Od verzie `4.0.0` úložisko požiada znova vždy, keď metóda `setInitialValue` po tomto prvom volaní subscribe načíta do jeho editora dokument.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Okamžite odošle dávky prúdov, ktoré toto úložisko ešte zadržiava, a nečaká na uplynutie ich obdobia pokoja.  
Od verzie `3.9.2` funguje na úložisku z metódy `getSharedStore`; vo verzii `3.9.1` metóda v type existuje, ale nemá žiadny účinok.  
Presúvanie tabuľky, poznámky alebo skupiny tabuliek, zmena ich farby, zmena veľkosti poznámky aj posúvanie alebo zmena priblíženia zobrazenia prichádzajú vždy ako prúd malých zmien. Pri zmene veľkosti skupiny tabuliek to tak nie je: odošle sa raz, keď sa ťahanie skončí.  
Úložisko zhromaždí každý prúd do jednej dávky a zadržiava ju, kým prúd na 200 ms neutíchne. Robí to v dvoch fázach, takže dávka odíde približne 400 ms po poslednej zmene.  
Volanie toto čakanie v oboch fázach ukončí. Kým je úložisko pripojené, odberateľ dostane dávku skôr, než sa volanie skončí. Ak nie je nič zadržané, volanie nič neodošle.  
Metóda `destroy` úložiska aj editora zahodí dávku, ktorá je ešte zadržaná, preto keď úložisko uvoľňujete a ostatné editory majú zachovať poslednú zmenu, napríklad keď sa zatvára karta, zavolajte najprv metódu flushStreamBuffers.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Úplne zničí inštanciu sharedStore.  
Samotného editora sa to nedotkne, takže po opustení relácie zostane dokument upraviteľný.  
Sledovače myši a fokusu sa zastavia, keď sa zničí posledné úložisko sharedStore, ktoré editor vydal.  
Dávka prúdu, ktorú úložisko ešte zadržiava, sa zahodí spolu s ním; ak ju chcete odoslať, najprv zavolajte metódu [flushStreamBuffers](#flushstreambuffers).

```js
sharedStore.destroy();
```
