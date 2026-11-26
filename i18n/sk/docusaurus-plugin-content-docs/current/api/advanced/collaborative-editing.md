---
sidebar_position: 1
description: Preposielanie zmien editora medzi inštanciami pomocou getSharedStore, inicializácia pripájajúceho sa editora z runtimeValue a registrov úložiska, zosúladenie úprav urobených v tom istom okamihu a zobrazenie kurzora, fokusu, výberu a ťahaného rámca každého spolupracovníka.
---

# Spoločné úpravy

Metóda `getSharedStore()` mení editor na uzol v relácii spoločných úprav.  
Každú zmenu vysiela ako prúd akcií a aplikuje akcie, ktoré mu späť posielajú ostatné editory – prenos medzi nimi zabezpečujete sami (WebSocket, WebRTC alebo čokoľvek iné, čo dokáže preniesť JSON).  
Je to jedna z metód elementu [ErdEditorElement](../erd-editor-element.md) a používa sa spolu s funkciou [Vzdialené ukladanie](./remote-storage.md), keď treba preposielané zmeny aj ukladať.  
Od verzie `5.1.0` previažte editor pomocou balíka `@dineug/erd-editor-yjs`, ak chcete diagram zdieľať cez dokument Yjs a ktorýkoľvek z jeho poskytovateľov namiesto vlastného zapojenia prenosu; pozrite si stránku [Yjs](./yjs.md).

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

Balík `@dineug/erd-editor` neexportuje pod názvom ani jeden z týchto typov. Kód v TypeScripte sa k nim dostane cez `ErdEditorElement`, napríklad `ReturnType<ErdEditorElement['getSharedStore']>`.

Akcia je obyčajný serializovateľný objekt, ktorý opisuje jednu zmenu dokumentu, takže na ceste k prenosu bez ujmy prejde funkciou `JSON.stringify`.  
Akcie prichádzajú v dávkach: metóda `subscribe` vám odovzdá pole a toto pole je jeden celok – celé ho preposlite a na druhej strane ho celé odovzdajte metóde dispatch.  
S akciou zaobchádzajte ako s nepriehľadnou hodnotou a namiesto čítania alebo prepisovania ju odovzdávajte ďalej presne tak, ako je, pretože práve pomocné údaje, ktoré nesie, napríklad jej [verzia](#concurrent-edits), udržiavajú editory synchronizované.

Časť toho, čo editor robí, zostáva iba v ňom.  
Presunutie tabuľky, poznámky alebo skupiny tabuliek dopredu, ku ktorému dochádza aj pri ich výbere, sa neodosiela.  
Neodosielajú sa ani voľby `Statements`, `Header`, `Write logical names into empty comments` (od verzie `4.2.0`) a `Tables` na karte [Schéma SQL](../../guide/guides/schema-sql.md), ktoré patria oknu, v ktorom sa urobili.  
Od verzie `4.1.0` zostáva vo svojom editore aj [prieskumník](../../guide/guides/explorer.md): to, či je otvorený, jeho šírka, zbalené riadky, riadok s fokusom klávesnice, poloha posunutia stromu ani jeho vyhľadávanie a možnosti sa neodosielajú.  
Neodosiela sa ani [zvýraznenie](../../guide/guides/relationship-editing.md#reading-a-connector), ktorým prechod na cudzí kľúč označí spojnicu jeho vzťahu.  
Od verzie `4.2.0` zostáva vo svojom editore aj karta [Slovník](../../guide/guides/dictionary.md): to, ktorý hárok sa zobrazuje, ani vyhľadávanie, výber, posunutie a šírky stĺpcov každého hárka sa neodosielajú. Jej úpravy, zoradenia a importy súborov CSV sa odosielajú.  
Posunutie, priblíženie alebo prepnutie karty sa odošle, ale nikdy neposunie zobrazenie ani neprepne kartu iného používateľa. Platí to aj pre posunutie, ktoré spôsobí skok z prieskumníka, pre prepnutie na kartu ERD, keď sa prieskumník otvorí z inej karty, a pre prepnutie karty a posunutie pri skoku z hárka [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) na karte Slovník na tabuľku alebo stĺpec. Skok z tohto hárka na slovo, termín alebo doménu zostáva na karte Slovník, takže sa z neho nič neodošle.

Od verzie `4.2.0` sa odosiela aj prepnutie [Zobrazenia názvov](../../guide/guides/logical-names.md#switching-the-view) a o tom, čo s ním urobia ostatné editory, rozhoduje jeho [zamknutie](../../guide/guides/settings.md#lock). Zamknutie `Name View` je zapnuté v novom diagrame a v každom dokumente spred verzie `4.2.0`.  
Kým je zamknutie zapnuté, prepnutie sa prejaví iba v editore, ktorý ho urobil: odošle sa síce, ale každý iný editor a každá replika ho zahodí, takže každý používateľ sa môže pozerať na iné zobrazenie, zatiaľ čo `value` uchováva zamknuté zobrazenie.  
Kým je zamknutie vypnuté, prepnutie urobené v editore, ktorý môže upravovať, zmení Zobrazenie názvov v každom editore a replike, pričom platí posledné prepnutie, a každý z nich ho uloží.  
Vlastné prepnutie v editore iba na čítanie vždy zostane v tomto editore a tento editor sa naďalej riadi zdieľanými prepnutiami ostatných.

Od verzie `5.1.0` sa zmena jazyka [Generátora kódu](../../guide/guides/code-generator.md), štýlu názvov tabuliek, štýlu názvov stĺpcov alebo typu úvodzoviek riadi vlastným zamknutím (`Language`, `Table Name Case`, `Column Name Case` alebo `Bracket Type`) rovnako, s jedným rozdielom: kým je zamknutie zapnuté, zmena sa neodosiela vôbec.  
Prejaví sa iba v editore, ktorý ju urobil, a riadia sa ňou jeho karty Generátor kódu a Schéma SQL; žiadny iný editor ani replika ju nevidí. Hodnoty `value` a `runtimeValue` uchovávajú zamknutú hodnotu, takže ju nevidí ani pripájajúci sa editor inicializovaný z ktoréhokoľvek editora a každý používateľ sa môže pozerať na iný jazyk, štýl názvov alebo typ úvodzoviek, kým je zamknutie zapnuté.  
Kým je zamknutie vypnuté, zmena urobená v editore, ktorý môže upravovať, sa odošle označená ako zdieľaná (`shared: true` v jej údajoch). Zmení nastavenie v každom editore a replike, pričom platí posledná zmena, a každý z nich ho uloží. Editor alebo replika verzie `5.1.0` aplikuje označenú zmenu bez ohľadu na vlastné zamknutie, takže zmena urobená hneď po odomknutí sa presadí všade, aj tam, kam dorazí pred odomknutím.  
Pred verziou `5.1.0` sa takáto zmena dostala do každého editora a repliky bez ohľadu na to, či bolo jej zamknutie zapnuté, zatiaľ čo súbor uchovával zamknutú hodnotu.

Od verzie `5.0.0` editor [iba na čítanie](../erd-editor-element.md#readonly) neodosiela žiadnu zmenu. Posunutie, priblíženie, karta, Zobrazenie názvov, databáza, jazyk Generátora kódu, štýly názvov, typ úvodzoviek a riadky `View Option`, ktoré jeho čitateľ zmení, zostanú na jeho obrazovke bez ohľadu na ich zamknutia; pred verziou `5.0.0` sa jeho posunutia, priblíženia, prepnutia kariet, databáza a nastavenia kódu odosielali ako v editore, ktorý možno upravovať.  
Jeho store naďalej odosiela to, čo odosielajú jeho sledovače kurzora, fokusu, výberu a rámika presúvania čitateľa, odpovedá na registre, o ktoré žiada pripájajúci sa editor, a aplikuje každú zmenu, ktorú pošlú ostatné. Zmena databázy, nastavenia Generátora kódu alebo riadku `View Option` sa dostane do jeho dokumentu a aj na jeho obrazovku, pokiaľ tam čitateľ toto nastavenie nezmenil, a zdieľané prepnutie Zobrazenia názvov sa na jeho obrazovke prejaví tak či onak. Od verzie `5.1.0` dostane nastavenie Generátora kódu iba vtedy, keď sa toto nastavenie zmenilo pri vypnutom zamknutí alebo ho prináša odomknutie.  
Keď sa editor prepne do režimu iba na čítanie, najprv odošle to, čo store ešte drží z presúvania alebo posunutia, tak ako to robí [flushStreamBuffers](#flushstreambuffers), takže ostatné si ponechajú jeho posledný stav.

[Zamknutia](../../guide/guides/settings.md#lock) sú zdieľané: v každom editore platí posledné zamknutie alebo odomknutie nastavenia a zamknutie nesie hodnoty editora, ktorý ho zapol, takže každý editor aj každá replika ukladá rovnakú hodnotu.  
Zamknutie `Viewport` preto uloží zobrazenie editora, ktorý ho zapol, a zamknutie `Canvas Type` poslednú kartu, na ktorej bol tento editor pred kartou Nastavenia, kde sa zamknutia zapínajú.  
Vypnutie zamknutia `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` alebo od verzie `4.2.0` `Name View` zároveň zmení toto nastavenie v každom editore na hodnotu zobrazenú v editore, ktorý ho vypol, vrátane jeho vlastnej zmeny urobenej pod zamknutím, takže všetky editory naďalej ukladajú jednu hodnotu. Vypnutie zamknutia `Viewport` alebo `Canvas Type` nikomu neposunie zobrazenie ani neprepne kartu.

Úprava skriptu `Before tables` alebo `After tables` sa odošle celá, keď jeho pole stratí fokus. Oba skripty sa zosúlaďujú samostatne, takže úprava jedného z nich od spolupracovníka nikdy neprepíše druhý.

Nič, čo sa urobí v [režime Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) na karte Vizualizácia, nie je zmenou dokumentu, takže editor v režime Flow neposiela ostatným žiadne zmeny a zmeny, ktoré posielajú ony, sa v ňom medzitým naďalej aplikujú.  
Výnimky sú dve. Odchod z režimu Flow na inú kartu je prepnutím karty a odošle sa ako každé iné. Od verzie `4.2.0` je výber v zozname Zobrazenia názvov na paneli nástrojov režimu Flow prepnutím Zobrazenia názvov, ktoré sa odošle a aplikuje rovnako ako prepnutie urobené na plátne.  
Tlačidlá `Previous table` a `Next table` a klávesy na vrátenie späť a opätovné vykonanie, ktorými sa v režime Flow [krokuje medzi zobrazeniami](../../guide/guides/visualization.md#previous-table-and-next-table), sa neodosielajú.  
Tlačidlo externého odkazu na kartičke, výsledok [rýchleho vyhľadávania](../../guide/guides/quick-search.md#searching-the-diagram) vybratý po zadaní `#`, `@` alebo `:` a otvorenie [prieskumníka](../../guide/guides/explorer.md#opening-and-closing) prepnú z režimu Flow na kartu ERD. Odošle sa aj posunutie, ktoré tam spôsobí tlačidlo na kartičke alebo výsledok rýchleho vyhľadávania.

## Dva editory na jednej stránke {#two-editors-on-one-page}

Prepojenie subscribe s dispatch tu zastupuje sieť, takže vidíte podobu relácie bez toho, aby jej prekážal prenos.

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

Oba editory tu začínajú z rovnakého nového, prázdneho dokumentu, takže ani jeden netreba inicializovať.  
Pri troch alebo viacerých editoroch posielajte dávky každého z nich všetkým ostatným: editor nikdy neposúva ďalej to, čo prijal.

## Inicializácia spolupracovníka {#seeding-a-collaborator}

Zdieľané úložisko preposiela zmeny tak, ako vznikajú, a nikdy neodovzdá pripájajúcemu sa editoru dokument v jeho aktuálnom stave, takže editor, ktorý sa pripája k už prebiehajúcej relácii, musí najprv dostať dokument.  
Od verzie `4.0.0` ho inicializujte hodnotou [`runtimeValue`](../erd-editor-element.md#runtimevalue) z editora, ktorý už v relácii je, nie hodnotou `value` ani uloženým súborom.  
Miestnosť previazaná balíkom [`@dineug/erd-editor-yjs`](./yjs.md) drží dokument sama, hneď ako ju klient [inicializoval](./yjs.md#seeding-a-room), takže každý editor, ktorý je s ňou previazaný, otvorí tento dokument bez odovzdanej hodnoty `runtimeValue`.

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
Od verzie `4.0.0` zároveň zahodí registre spolupráce editora, ktoré zosúlaďujú [súbežné úpravy](#concurrent-edits). Ak už zdieľané úložisko editora malo odberateľa, úložisko znova požiada ostatné editory o ich registre, rovnako ako pri svojom prvom volaní [subscribe](#subscribe), takže editor, ktorý sa znova načíta uprostred relácie, zosúlaďuje úpravy rovnako ako ostatné.  
Priradenie vlastnosti `value` registre zachová, ale na rozdiel od metódy `setInitialValue` sa preposiela: keď už má editor zdieľané úložisko, každý editor v relácii načíta priradený dokument, preto pripájajúci sa editor takto nikdy neinicializujte.

Hodnota `value` ani `runtimeValue` neobsahuje registre ani verziu, ktorú dosiahli hodiny editora, takže pripájajúci sa editor inicializovaný iba z `runtimeValue` ich preberie z odpovede, ktorú pošlú editory v relácii na jeho prvé volanie subscribe.  
Kým táto odpoveď nepríde, úprava urobená pripájajúcim sa editorom môže niesť nižšiu verziu, než akú majú ostatné, takže ju ostatné odmietnu, zatiaľ čo v ňom zostane, a starší zápis, ktorý je ešte na ceste, prepíše novší zápis, ktorý obsahuje inicializácia. Tam, kde neodpovedá žiadny bežiaci editor, napríklad keď dokument relácie drží server alebo úložisko dokumentov, ich pripájajúci sa editor nikdy nedostane.  
Od verzie `5.1.0` ich odovzdajte spolu s hodnotou. V editore, ktorý je v relácii, zavolajte [`flushStreamBuffers()`](#flushstreambuffers), aby najprv odišlo ťahanie alebo zmena farby, ktoré ešte zadržiava, a potom v tom istom okamihu prečítajte hodnotu `runtimeValue` a zavolajte metódy [`getLWW()`](#getlww) a [`getVersion()`](#getversion) jeho úložiska. Pripájajúci sa editor načíta hodnotu metódou `setInitialValue` a zvyšok potom prevezme metódou [`mergeLWW`](#mergelww) vlastného úložiska, v tomto poradí, pretože každé volanie `setInitialValue` registre zahodí. Jeho ďalšia úprava potom nesie verziu vyššiu než každá, ktorú inicializácia obsahuje, takže sa presadí bez čakania na odpoveď. Na úložisku, ktoré už existuje, urobí oboje jedným volaním metóda [`reseed`](#reseed).

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

Takto uchovaná inicializácia na otvorenie ďalších pripájajúcich sa editorov obsahuje všetky tri údaje spolu. Nie je to súbor: do úložiska sa naďalej zapisuje `value`.  
[Úložisko replicationStore](./remote-storage.md#runtimevalue-getter) neodovzdáva žiadne registre, takže pripájajúci sa editor inicializovaný z jeho hodnoty `runtimeValue` ich naďalej preberá z odpovede editorov.

## Súbežné úpravy {#concurrent-edits}

Každý editor a replika uchováva pre každý názov a takmer každé iné pole verziu zápisu, ktorý ho nastavil: sú to jeho registre spolupráce. Zápis sa presadí iba vtedy, keď jeho verzia nie je nižšia než uchovávaná, takže editory, ktoré počujú tie isté zmeny v rôznom poradí, skončia na tom istom dokumente.  
Od verzie `5.1.0` nesie každá verzia pod svojím počítadlom vlastnú pozíciu zapisujúceho editora, odvodenú z jeho identifikátora. Verzie preto rastú po krokoch 4 194 304 a keď počítadlo dosiahne 512, presiahnu 32-bitové celé číslo. `JSON.stringify` a `JSON.parse` ich prenášajú neporušené, ale služba, ktorá ich preposiela alebo ukladá a parsuje ich v inom jazyku, ich musí uchovávať ako 64-bitové čísla, nikdy nie ako 32-bitové celé čísla.

Od verzie `5.1.0` dva editory, ktoré zmenia jeden názov alebo pole v tom istom okamihu, s výnimkou nižšie uvedených, skončia s rovnakou hodnotou v každom editore a každej replike: hoci zapisujú pri tej istej hodnote počítadla, označia dve rôzne verzie a vyššia vyhrá všade. Pred verziou `5.1.0` mohli obe označiť jednu verziu a každý editor si ponechal tú, ktorú počul naposledy, takže mohli skončiť odlišne. Dva editory zdieľajú pozíciu s pravdepodobnosťou 1 ku 4 194 304 na dvojicu a vtedy, rovnako ako predtým, označia tú istú verziu.

Od verzie `5.1.0` sa poloha tabuľky, poloha a veľkosť poznámky alebo skupiny tabuliek a počiatok zobrazenia a úroveň priblíženia verzujú rovnako a to, čo ich posúva, sa odosiela ako miesto, kde skončí:

- ťahanie ako jedna akcia `table.moveTo`, `memo.moveTo` alebo `tableGroup.moveTo` na každú presunutú entitu, v jednej dávke, takže ťahanie skupiny nesie body jej tabuliek a od verzie `5.1.1` aj jej poznámok spolu s bodom skupiny;
- vrátenie späť alebo opätovné vykonanie ťahania ako bod, na ktorý každú entitu umiestni;
- posunutie ako `settings.scrollTo` a priblíženie ako `settings.changeZoomLevel`;
- zmena veľkosti poznámky alebo skupiny tabuliek ako jej poloha a veľkosť spolu.

Dvaja používatelia, ktorí v tom istom okamihu presunú tú istú tabuľku, poznámku alebo skupinu tabuliek, alebo ju presunú a zmenia jej veľkosť, preto v každom editore a každej replike skončia s ňou v jednom bode a s jednou veľkosťou. Bod dostane zápis s vyššou verziou, obe osi spolu. Presun nezapisuje veľkosť, takže zmena veľkosti si ponechá svoju veľkosť, aj keď bod prevezme súčasne urobený presun.  
Pred verziou `5.1.0` sa ťahanie odosielalo ako prejdená vzdialenosť, takže dve ťahania jednej tabuľky sa sčítali a súčasný presun a zmena veľkosti jednej poznámky alebo skupiny tabuliek mohli skončiť odlišne.  
Ťahanie kratšie ako 20 px, ktoré nezanechá záznam v histórii zmien, sa odosiela ako každé iné, takže ako bod môže prebiť ťahanie tej istej entity, ktoré v tom istom okamihu urobil iný používateľ. Dávka ťahania, posunutia alebo priblíženia, ktorú prenos doručí dvakrát, nepresunie nič dvakrát.

Jednou výnimkou je zmena farby. Odosiela sa bez verzie a každý editor a replika ju označí vlastnou a ponechá si farbu, ktorú počul naposledy, takže dvaja používatelia, ktorí v tom istom okamihu zmenia farbu jednej tabuľky, poznámky alebo skupiny tabuliek, môžu skončiť s rôznymi farbami.  
Niekoľko zmien nemá verziu vôbec, takže ich každý editor a replika aplikuje v poradí, v akom ich počuje, a dve urobené v tom istom okamihu môžu tiež skončiť odlišne: presun stĺpca v rámci jeho tabuľky alebo indexu (`column.move`, `indexColumn.move`) a zmena [databázy](../../guide/guides/table-related-functions.md#databases), riadka [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) alebo položky `Relationship DataType Sync`, `Maximum comment width` či `Column Order` na karte [Nastavenia](../../guide/guides/settings.md).  
Entity, ktoré dvaja používatelia pridajú v tom istom okamihu, napríklad dve tabuľky alebo dva stĺpce jednej tabuľky, môžu mať tiež v každom editore a každej replike iné poradie a `value` každého z nich ukladá jeho vlastné poradie.

To všetko platí medzi editormi a replikami verzie `5.1.0` alebo novšej; čo mení staršia, opisuje časť [Kombinovanie verzií](#mixing-releases).

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

Editor starší ako verzia `4.0.0` nové typy akcií ignoruje: nikdy neuvidí skupinu tabuliek ani to, ktoré tabuľky do nej patria, hoci presúvanie skupiny myšou v ňom tabuľky skupiny aj tak presunie, pretože odosiela aj presun každej z týchto tabuliek.  
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

Editor verzie `5.1.0` neposiela žiadny nový typ akcie, takže editory a repliky spred verzie `5.1.0` s ním naďalej zdieľajú reláciu a pri preposielaní akcií bez zmeny netreba nič nové. To, čo opisuje časť [Súbežné úpravy](#concurrent-edits), však platí iba medzi editormi a replikami verzie `5.1.0`:

- Ťahania editora verzie `5.1.0` sa prenášajú ako body v akciách `table.moveTo`, `memo.moveTo` a `tableGroup.moveTo`, ktoré starší editor už aplikuje, a jeho posunutia a priblíženia ako body v akciách `settings.scrollTo` a `settings.changeZoomLevel`, ktoré, ako každé posunutie a priblíženie, nijaký iný editor neaplikuje a preberajú ich iba repliky. Starší editor aplikuje každý bod ťahania v poradí, v akom príde, mimo akéhokoľvek registra, a staršia replika robí to isté s každým bodom ťahania, posunutia alebo priblíženia, takže dva body odoslané naraz pre jednu entitu alebo pre zobrazenie tam môžu skončiť odlišne.
- Ťahanie staršieho editora sa naďalej prenáša ako prejdená vzdialenosť, ktorú každý editor a replika pripočíta mimo svojich registrov, a jeho posunutie alebo priblíženie tiež ako vzdialenosť, ktorú každá replika pripočíta rovnako. Vzdialenosť a bod urobené naraz na jednej entite môžu skončiť odlišne v editoroch a replikách, ktoré ich počujú v rôznom poradí, a vzdialenosť, ktorú prenos doručí dvakrát, sa pripočíta dvakrát.
- Mimo výnimiek, ktoré uvádza časť [Súbežné úpravy](#concurrent-edits), zápis názvu alebo poľa urobený editorom verzie `5.1.0` v tom istom okamihu ako zápis staršieho editora takmer vždy vyhrá, s rovnakým výsledkom v každom editore a replike. Dva staršie editory môžu stále skončiť odlišne pri jednom poli zapísanom naraz.
- Editor verzie `5.1.0` odosiela zmenu jazyka, štýlu názvov alebo typu úvodzoviek Generátora kódu iba vtedy, keď je jeho zamknutie vypnuté, s označením `shared: true`, ktoré starší editor ignoruje a zmenu aplikuje ako predtým. Starší editor naďalej odosiela zmenu urobenú pod zamknutím bez označenia: editor alebo replika verzie `5.1.0` ju zahodí, kým je dané nastavenie tam zamknuté, a staršie editory ju aplikujú. Pod zamknutím sa teda staršie editory riadia výbermi jeden druhého, zatiaľ čo editory verzie `5.1.0` si ponechávajú vlastné, a súbor tak či onak uchováva zamknutú hodnotu. Odomknutie urobené v ktorejkoľvek verzii prenesie hodnotu editora, ktorý odomkol, do každého editora a repliky.
- Načítanie, ktoré nahradí dokument, napríklad priradená hodnota `value`, `clear()` alebo nahrádzajúci import, ukončí kreslenie vzťahu v každom editore verzie `5.1.0`, v tom, ktorý ho urobil, aj v každom, ktorý ho prijme. Starší editor ponechá kreslenie vzťahu aktívne aj po ňom.

Všetky editory v relácii a každé úložisko [replicationStore](./remote-storage.md#dispatch-dispatchsync), ktoré ukladá jej dokument, udržiavajte vo verzii `5.1.0` alebo novšej, aby úpravy urobené v tom istom okamihu skončili všade rovnako, s výnimkou tých, ktoré uvádza časť [Súbežné úpravy](#concurrent-edits); logické názvy a slovníky naďalej zachováva verzia `4.2.0` alebo novšia. [Server MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) starší ako verzia `1.2.0` sa tu počíta ako editor spred verzie `5.1.0` a editor spred verzie `5.1.0` sa nedá previazať s miestnosťou [Yjs](./yjs.md) vôbec.

Od verzie `5.1.1` sa pridanie poznámky do [skupiny tabuliek](../../guide/guides/table-groups.md) alebo jej odchod zo skupiny prenáša novým typom akcie `memo.changeGroup` a pri preposielaní akcií bez zmeny preň netreba nič nové. Odosiela sa pre poznámku pustenú do skupiny alebo zo skupiny, pre novú skupinu nakreslenú okolo zobrazených poznámok bez skupiny, pre položku `Group selected tables` s poznámkami vybratými popri tabuľkách, pre položku `Remove from group` s poznámkami vo výbere, pre každú poznámku odstránenej skupiny, pre volania programovacieho agenta týkajúce sa skupín poznámok cez [server MCP](../../mcp/tools.md#table-groups) a pre vrátenie späť a opätovné vykonanie každej z týchto zmien. Akciu odosiela aj pridanie cez položku `Import and Add` alebo metódu `setSchemaJSON`, ktorého skupiny obsahujú poznámky, a rovnako aj jeho opätovné vykonanie, zatiaľ čo jeho vrátenie späť iba odstráni tieto poznámky.

Editor alebo replika spred verzie `5.1.1` akciu `memo.changeGroup` ignoruje a pri parsovaní zahodí pole `groupId` každej poznámky, takže poznámku v skupine nikdy nevidí, hoci ťahanie skupiny v editore verzie `5.1.1` aj tam stále presunie poznámky skupiny, pretože pre každú z nich odošle aj akciu `memo.moveTo`. Jeho vlastné úpravy o skupinách poznámok nič nevedia, čo má v novších editoroch tieto následky:

- Poznámka, ktorú presunie do rámca skupiny, zostane mimo skupiny, a keď presunie poznámku patriacu do skupiny mimo rámca, poznámka v skupine zostane a rámec sa roztiahne, aby ju zahrnul.
- Jeho ťahanie skupiny, rovnako ako jeho príkaz `Auto Layout`, presunie skupinu a jej tabuľky, ale poznámky skupiny nechá tam, kde stoja, a rámec sa roztiahne, aby tam zahrnul tie z nich, ktoré sú zobrazené.
- Položka `Import and Add` v ňom nevloží do pridaných skupín žiadnu poznámku.
- Keď odstráni skupinu, pole `groupId` každej jej poznámky ju naďalej označuje: poznámky sa považujú za poznámky bez skupiny, a keď odstránenie vráti späť, poznámky sa do skupiny vrátia.
- Keď vráti späť načítanie, import alebo volanie `clear()`, načíta v každom editore svoju vlastnú kópiu dokumentu a táto kópia nemá žiadnu poznámku v žiadnej skupine.

Dokument uložený takým editorom alebo replikou nemá žiadnu poznámku v žiadnej skupine, hoci editor od verzie `4.0.0` ponecháva skupiny jeho tabuliek.  
Všetky editory v relácii a každé úložisko [replicationStore](./remote-storage.md#dispatch-dispatchsync), ktoré ukladá jej dokument, udržiavajte vo verzii `5.1.1` alebo novšej, aby poznámky zostali vo svojich skupinách tabuliek; o úpravách urobených v tom istom okamihu naďalej rozhoduje verzia `5.1.0` alebo novšia. [Server MCP](../../mcp/installation.md#updating) starší ako verzia `1.2.1` rovnako nevidí ani neuchováva, v ktorej skupine tabuliek poznámka je.

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
Keď dávka obsahuje žiadosť iného editora o registre, ako ju posiela prvé volanie [subscribe](#subscribe) pripájajúceho sa editora, úložisko odpovie cez svojich odberateľov svojimi registrami a svojou verziou, okrem prípadu, keď žiadne registre nemá.  
Od verzie `5.1.0` najprv odošle každú dávku prúdu, ktorú ešte zadržiava, tak ako to robí [flushStreamBuffers](#flushstreambuffers), takže každá verzia v jeho odpovedi stojí na zápise, ktorý už bol ostatným odoslaný. Príchod pripájajúceho sa editora preto prinúti každý editor v relácii odoslať naraz ťahanie, posunutie, priblíženie, zmenu farby alebo zmenu veľkosti poznámky, ktoré ešte drží.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Prihlási sa na odber zmien v editore.  
Kým nie je aspoň jeden odberateľ, z editora nič neodíde a zmeny urobené predtým sa ukladajú do vyrovnávacej pamäte.  
Prvé volanie subscribe zároveň požiada ostatné editory o ich registre spolupráce, ktoré zosúlaďujú [súbežné úpravy](#concurrent-edits), takže ich editor, ktorý sa pripojí neskôr, zosúlaďuje rovnako.  
Dokument neprinesie, preto editor, ktorý sa pripája neskôr, najprv [inicializujte](#seeding-a-collaborator); od verzie `5.1.0` môže inicializácia niesť aj registre.  
Od verzie `4.0.0` úložisko požiada znova vždy, keď metóda `setInitialValue`, a od verzie `5.1.0` aj metóda [reseed](#reseed), po tomto prvom volaní subscribe načíta do jeho editora dokument.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Okamžite odošle dávky prúdov, ktoré toto úložisko ešte zadržiava, a nečaká na uplynutie ich obdobia pokoja.  
Od verzie `3.9.2` funguje na úložisku z metódy `getSharedStore`; vo verzii `3.9.1` metóda v type existuje, ale nemá žiadny účinok.  
Presúvanie tabuľky, poznámky alebo skupiny tabuliek, zmena ich farby, zmena veľkosti poznámky aj posúvanie alebo zmena priblíženia zobrazenia sa robia vždy ako prúd malých zmien. Pri zmene veľkosti skupiny tabuliek to tak nie je: odošle sa raz, keď sa ťahanie skončí.  
Úložisko zhromaždí každý prúd do jednej dávky a zadržiava ju, kým prúd na 200 ms neutíchne, v dvoch fázach. Zmena farby alebo zmena veľkosti poznámky prejde oboma, takže odíde približne 400 ms po poslednej zmene, ako každý prúd pred verziou `5.1.0`. Od verzie `5.1.0` ťahanie, posunutie alebo priblíženie odíde po prvej fáze, približne 200 ms po poslednom kroku, ako miesto, kde skončí (pozrite si časť [Súbežné úpravy](#concurrent-edits)).  
Volanie toto čakanie v oboch fázach ukončí. Kým je úložisko pripojené, odberateľ dostane dávku skôr, než sa volanie skončí. Ak nie je nič zadržané, volanie nič neodošle.  
Metóda `destroy` úložiska aj editora zahodí dávku, ktorá je ešte zadržaná, preto keď úložisko uvoľňujete a ostatné editory majú zachovať poslednú zmenu, napríklad keď sa zatvára karta, zavolajte najprv metódu flushStreamBuffers.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Od verzie `5.1.0` vráti kópiu registrov spolupráce editora (pozrite si časť [Súbežné úpravy](#concurrent-edits)).  
Kópia sa vytvorí cez JSON, takže je to obyčajný objekt pripravený na `JSON.stringify` a zmena v nej nechá registre úložiska tak, ako boli.  
Odovzdajte ju bez zmeny metóde [mergeLWW](#mergelww) alebo [reseed](#reseed) iného úložiska. Jej tvar patrí samotnému editoru, preto z nej nečítajte žiadne pole.  
Prečítajte ju spolu s metódou [getVersion](#getversion) a hodnotou `runtimeValue` editora v tom istom okamihu, aby ste [inicializovali pripájajúci sa editor](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Od verzie `5.1.0` prevezme registre, ktoré iné úložisko odovzdalo metódou [getLWW](#getlww), do registrov tohto úložiska, pričom z každého ponechá vyššiu verziu, a hodnotu `version` prevezme do hodín editora, ktoré si ponechajú vyššiu z vlastnej a zadanej verzie.  
V dokumente nič nezmení: nezmení ani bajt hodnoty `value` či `runtimeValue`, nevytvorí záznam v histórii zmien a nevyvolá udalosť `change`. Iba zvýši verzie, ktoré musí neskorší zápis prekonať, takže zápis starší než zadané registre sa potom odmietne a ďalšia úprava editora nesie verziu vyššiu než `version`.  
Nič neodosiela a na nič neodpovedá. Je to to, čo prvé volanie subscribe pripájajúceho sa editora získa z odpovede ostatných, prevzaté priamo.  
Volajte ju po volaní `setInitialValue`, nikdy pred ním: každé volanie `setInitialValue` aj každé volanie [reseed](#reseed) zahodí uchovávané registre, a s nimi aj to, čo prevzalo volanie `mergeLWW` pred ním.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Od verzie `5.1.0` vráti najvyššiu verziu, ktorú hodiny editora zlúčili: najväčšiu z verzií zmien, ktoré urobil alebo prevzal, žiadostí o registre a odpovedí, ktoré si pri pripojení vymieňa, a každej hodnoty `version` zadanej metóde `mergeLWW` alebo `reseed`.  
Nehýbu ňou kurzory, fokus, výbery ani ťahané rámce, vlastné ani cudzie.  
Odovzdajte ju spolu s hodnotou [getLWW()](#getlww), prečítanou v tom istom okamihu, metóde [mergeLWW](#mergelww) alebo [reseed](#reseed) pripájajúceho sa editora. Je to [verzia](#concurrent-edits) ako tie, ktoré nesú jeho akcie.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Od verzie `5.1.0` okamžite odstráni kurzor, fokus, výber a ťahaný rámec, ktoré poslal editor so zadaným identifikátorom, aj časovač vypršania, na ktorý každý z nich čakal. Údaje každého iného editora zostanú.  
Identifikátor je `meta.editorId`, ktoré nesie každá akcia, ktorú pošle zdieľané úložisko daného editora. Identifikátor, o ktorom tento editor nič nemá, nič nezmení.  
Zavolajte ju, keď sa váš prenos dozvie, že účastník odišiel. Inak zostane to, čo účastník poslal, vykreslené, kým nevyprší: jeho kurzor 30 sekúnd po poslednom prijatom, jeho fokus a výber 90 sekúnd po ňom a jeho ťahaný rámec 3 sekundy po ňom.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Od verzie `5.1.0` znova otvorí v editore dokument relácie, ako pri opätovnom pripojení. Väzba [Yjs](./yjs.md) ju volá, aby otvorila dokument miestnosti, keď sa previaže s už inicializovanou miestnosťou, a znova pri každom opätovnom pripojení, pričom obrazovku ponechá, keď už bol k miestnosti pripojený.  
Načíta `value` tak, ako to robí [setInitialValue](../erd-editor-element.md#setinitialvalue), a `lww` a `version` prevezme tak, ako to robí [mergeLWW](#mergelww), takže úložisko potom drží presne zadané registre a jeho hodiny vyššiu z vlastnej verzie a `version`. Vyprázdni aj históriu zmien a na rozdiel od `setInitialValue` zahodí výber a fokus, pretože môžu pomenúvať to, čo hodnota už neobsahuje.  
Okrem odvodenia logického názvu uvedeného nižšie nevytvorí záznam v histórii zmien, nevyvolá udalosť `change` a neodošle žiadnu zmenu. Ak už úložisko malo odberateľa, odošle žiadosť o registre, ktorú posiela každé takéto načítanie a ktorú môže prenos, ktorý už registre odovzdal, zahodiť, a pri zapnutom sledovači [focusTracker](#focustracker) aj vymazaný výber a fokus.  
Rovnako ako `setInitialValue` funguje, aj keď je nastavený atribút [readonly](../erd-editor-element.md#readonly), zruší zobrazenie v režime Flow, ukončí kreslenie vzťahu a zatvorí editory poznámky, názvu skupiny tabuliek a bunky, pričom to, čo sa v nich napísalo, ponechá alebo zahodí rovnako; názov, ktorý zatváraná bunka logického názvu odvodí z toho, čo do nej napísal čitateľ, je bežná úprava: odošle sa, dá sa vrátiť späť a vyvolá udalosť `change`.

Bez `keepScreen` obrazovka ukazuje to, čo hodnota obsahuje, ako po `setInitialValue`. S `keepScreen: true` sa nad načítaným dokumentom obnoví to, čo mal čitateľ na obrazovke, a to iba na tejto obrazovke:

- poloha posunutia a úroveň priblíženia, ak ich už element zobrazil; ak sa nikdy nezobrazili alebo sa načítali, kým bol element skrytý, a odvtedy sa nezobrazili, otvoria sa tam, kam ich umiestňuje hodnota, ako pri editore, ktorý sa pripojil neskôr;
- karta, keď ju načítanie presunulo, a na karte Nastavenia aj karta, z ktorej čitateľ prišiel, ktorú pomenúva tam zapnuté zamknutie `Canvas Type`;
- Zobrazenie názvov a každé nastavenie Generátora kódu, ktoré mal čitateľ pod jeho zamknutím zobrazené po svojom, ale iba vtedy, keď bolo toto zamknutie zapnuté už pred načítaním, je zapnuté aj po ňom a drží tú istú zamknutú hodnotu. Ak teda medzitým účastník nastavenie odomkol, zmenil a znova zamkol s inou hodnotou, editor sa otvorí na novej zamknutej hodnote, a tam, kde je zamknutie pred načítaním alebo po ňom vypnuté, zobrazí načítanú hodnotu;
- každé nastavenie, ktoré čitateľ iba na čítanie zmenil na vlastnej obrazovke, bez ohľadu na zamknutia.

Nič z toho sa neodosiela a `value` a `runtimeValue` naďalej hlásia načítaný dokument. Neskoršie odomknutie účastníkom nahradí takto ponechané nastavenie kódu, ako každé odomknutie.  
Ďalšie posunutie alebo priblíženie čitateľa urobené, kým editor môže upravovať, urobí ponechanú polohu posunutia a úroveň priblíženia znova súčasťou dokumentu a odíde tak, že mu predchádza miesto, kde obrazovka stojí, takže toto priblíženie prevezmú aj repliky.

Volanie metódy `reseed` ponechá to, čo úložisko zadržiava, tak, ako je. Ťahanie, posunutie alebo priblíženie, ktoré sa ešte drží, odíde po ňom, vyčítané z dokumentu po novej inicializácii; zmena farby alebo zmena veľkosti poznámky odíde tak, ako bola urobená, hoci ju editor už nezobrazuje; a to, čo zadržalo `disconnect()`, odíde pri `connection()`.  
Najprv preto zavolajte [flushStreamBuffers](#flushstreambuffers), odošlite, čo vyšle, a znova inicializujte hodnotou, ktorá to obsahuje. Nikdy nevolajte `reseed` v odpojenom stave.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Úplne zničí inštanciu sharedStore.  
Samotného editora sa to nedotkne, takže po opustení relácie zostane dokument upraviteľný.  
Sledovače myši a fokusu sa zastavia, keď sa zničí posledné úložisko sharedStore, ktoré editor vydal.  
Dávka prúdu, ktorú úložisko ešte zadržiava, sa zahodí spolu s ním; ak ju chcete odoslať, najprv zavolajte metódu [flushStreamBuffers](#flushstreambuffers).  
Kurzory, fokus, výbery a ťahané rámce, ktoré poslali ostatné editory, zostanú vykreslené, kým nevypršia; od verzie `5.1.0` metóda [forgetPeer](#forgetpeer) okamžite odstráni tie, ktoré poslal jeden editor.

```js
sharedStore.destroy();
```
