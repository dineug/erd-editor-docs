---
sidebar_position: 2
description: Replikácia spusteného editora do úložiska bez používateľského rozhrania mimo hlavného vlákna a serializácia dokumentu na uloženie.
---

# Vzdialené ukladanie

Posielať celý stav editora pri každej zmene je neefektívne.  
Pre takýto prípad poskytuje editor API na replikáciu údajov v reálnom čase.

## Inštalácia {#installation}

```sh
npm install @dineug/erd-editor
```

Replikačné úložisko sa nachádza v podceste `@dineug/erd-editor/engine.js`, nie v koreni balíka.  
Tento vstupný bod nepoužíva DOM, takže beží v prostredí Web Worker alebo kdekoľvek inde mimo hlavného vlákna.  
Ak namiesto toho importujete koreň balíka, potrebuje dokument: od verzie `5.0.0` nedefinuje žiadny element, ale jeho vyhodnotenie vytvorí triedy oboch elementov. Pred verziou `5.0.0` registroval vlastný element `<erd-editor>`.

## Použitie {#usage}

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

## Replikácia spusteného editora {#replicating-a-live-editor}

Akcie pochádzajú zo zdieľaného úložiska spusteného editora.  
Pozrite si stránku [Spoločné úpravy](./collaborative-editing.md).

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

Hranicu prekračuje iba zmena, nikdy nie celý dokument.  
Replika ju aplikuje a výsledok serializuje na svojej strane.  
Udalosť `change` vám tento výsledok odovzdá ako pole `value` a pole `changed` vám povie, kedy sa ho oplatí zapísať.

Od verzie `4.0.0` inicializujte repliku z vlastnosti `runtimeValue` editora ako v príklade vyššie, nie z uloženého súboru ani z vlastnosti `value` editora.  
V súbore chýbajú úpravy vykonané od jeho uloženia a vo vlastnosti `value` chýbajú entity odstránené počas relácie.  
Replika inicializovaná bez odstránenej tabuľky ju obnoví bez názvu a stĺpcov, keď niektorý editor vráti jej odstránenie späť, a v takom stave ju aj uloží.  
Od verzie `4.2.0` to isté platí pre slovo, termín alebo doménu odstránenú z hárka karty [Slovník](../../guide/guides/dictionary.md).  
Keď niektorý editor vráti odstránenie späť, replika inicializovaná bez tohto riadka ho znova uvedie prázdny, a keďže `value` prázdny riadok vynecháva, replika uloží dokument bez neho.  
Pri doméne zostanú v tejto replike neprepojené aj stĺpce a termíny, ktoré s ňou boli prepojené, pretože replika tieto prepojenia nikdy neuchovávala a vrátenie späť ich neodošle.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Meria šírku reťazca v pixeloch.  
Úložisko nemá DOM, takže samo nedokáže merať text, a pomocou tejto funkcie prepočítava šírky stĺpcov vždy, keď sa zmení názov, typ údajov, predvolená hodnota alebo komentár.  
Od verzie `4.2.0` k tomu patrí aj [logický názov](../../guide/guides/logical-names.md) tabuľky alebo stĺpca.  
Bunku domény stĺpca, ktorá zobrazuje názov domény prepojenej so stĺpcom, meria vždy, keď sa stĺpec prepojí s doménou alebo sa od nej odpojí, a vždy, keď sa táto doména pridá, premenuje alebo odstráni.  
Všetky tabuľky a stĺpce zmeria znova aj vždy, keď metóda [setInitialValue](#setinitialvalue) načíta dokument.  
Od verzie `4.0.0` sa šírky uchovávajú iba vo vlastnosti [runtimeValue](#runtimevalue-getter), nikdy nie vo vlastnosti `value`.  
Dokument uložený touto verziou preto po opätovnom načítaní dá bajt po bajte rovnakú hodnotu `value`, nech bol uložený kdekoľvek a nech sa tam text meral akokoľvek.

Merajte rovnako ako editor – `400 12px` v sade písiem editora, so zaokrúhlením a s pridanými 2 px výplne.  
Inak sa šírky vo vlastnosti `runtimeValue` odchýlia od tých na obrazovke.

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

Výraz `text.length * 10` je záložné riešenie, keď nie je k dispozícii žiadny canvas.  
Postačuje pre úložisko, ktorého dokument sa iba ukladá a nikdy nevykresľuje.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializuje aktuálny stav editora.  
Vracia reťazec JSON pripravený na uloženie tak, ako je – nie rozparsovaný objekt.

```js
const data = replicationStore.value;
```

Od verzie `4.0.0` je vlastnosť `value` úložnou formou: dokumentom tak, ako ho uchováva súbor, rovnakým textom, aký vracia vlastnosť [value](../erd-editor-element.md#value) elementu.  
Obsahuje iba aktuálne entity v pevnom poradí, bez odstránených entít, bez poradia prekrývania a bez čohokoľvek, čo načítanie znova vypočíta, napríklad šírok, ktoré meria funkcia [toWidth](#towidth).  
Od verzie `4.2.0` obsahuje aj logické názvy, informáciu o tom, či bol každý názov odvodený zo slovníkov, prepojenia s doménami a slová, termíny a domény z karty [Slovník](../../guide/guides/dictionary.md).  
Od verzie `4.2.0` zároveň vynecháva každé prázdne textové pole entity, každý zoznam v objekte `doc` a každú kolekciu, ktoré nič neobsahujú, a samotné pole `collections`, keď sú všetky kolekcie prázdne.  
Je odsadená o dve medzery, s každým riadkom slovníka na samostatnom riadku, a končí znakom nového riadka, takže rovnaký dokument vždy dá rovnaké bajty.  
Informácie o tom, čo obsahuje, nájdete v časti [Úložná forma a hodnota za behu](./schema.md#storage-form-and-runtime-value).

Každé nastavenie, ktorého [zamknutie](../../guide/guides/settings.md#lock) je zapnuté, sa zapíše s hodnotou, na ktorej bolo zamknuté, a každé iné nastavenie tak, ako práve je.  
Zamknutie `Viewport` pokrýva počiatok zobrazenia a úroveň priblíženia spoločne a vlastné zamknutie má karta, jazyk na karte Generátor kódu, každý z oboch štýlov názvov aj typ úvodzoviek.  
Od verzie `4.2.0` má vlastné zamknutie aj [Zobrazenie názvov](../../guide/guides/logical-names.md#name-view), ktorého zamknutie `Name View` je v novom dokumente zapnuté.  
Zamknutia nahrádzajú pole `ignoreSaveSettings` dokumentu, ktoré sa od verzie `4.0.0` nečíta ani nezapisuje.  
Pred verziou `4.0.0` bola vlastnosť `value` celým dokumentom tak, ako ho uchovávalo úložisko, s uplatnenými bitmi posúvania a priblíženia z tohto poľa.

### runtimeValue getter {#runtimevalue-getter}

Od verzie `4.0.0` serializuje dokument tak, ako ho uchováva replika, vrátane odstránených entít a všetkého, čo načítanie vypočíta.  
Každé zamknuté nastavenie sa aj tu zapíše so svojou zamknutou hodnotou.

```js
const snapshot = replicationStore.runtimeValue;
```

Pomocou tejto hodnoty inicializujte editor alebo ďalšie úložisko, ktoré sa pripojí neskôr, cez jeho metódu `setInitialValue`; pozrite si stránku [Spoločné úpravy](./collaborative-editing.md).  
Nikdy ju neukladajte ako súbor: obsahuje odstránené entity a publikovaná [JSON Schema](./schema.md#json-schema) ju odmietne.  
Práve vďaka týmto odstráneným entitám dokáže neskôr odoslané vrátenie odstránenia späť obnoviť celú entitu v úložisku, ktoré sa z nej inicializovalo.  
Zostávajú tam, kým sa dokument nabudúce neotvorí zo svojho súboru, ktorého forma ich vynecháva.

### setInitialValue {#setinitialvalue}

Načíta predtým uložený stav editora.

```js
replicationStore.setInitialValue('json...');
```

Prijíma úložnú formu, hodnotu za behu alebo dokument uložený staršou verziou vrátane dokumentu verzie v2.  
Prázdny reťazec alebo čokoľvek, čo nie je reťazec, namiesto vyhodenia chyby načíta nový, prázdny dokument.  
Úložisko, ktoré nikdy nedostalo hodnotu, začína s rovnakým novým dokumentom.  
Od verzie `4.0.0` má tento dokument zapnuté všetky [zamknutia](../../guide/guides/settings.md#lock), takže jeho vlastnosť `value` si zachováva zobrazenie, kartu, jazyk na karte Generátor kódu, štýly názvov a typ úvodzoviek, s ktorými začínal, zatiaľ čo editory, ktoré replikuje, posúvajú zobrazenie, menia priblíženie, prepínajú karty alebo menia tieto nastavenia. Vo verzii `3.10.0` neukladal posunutie ani priblíženie a predtým ukladal obe.  
Od verzie `4.2.0` si zachováva aj svoje Zobrazenie názvov, teda zobrazenie `Physical Names`, zatiaľ čo editory prepínajú svoje.  
Uložený dokument si zachová zamknutia, ktoré uvádza.  
Dokument, ktorý neuvádza žiadne, teda každý dokument uložený pred verziou `4.0.0` vrátane dokumentu verzie v2, sa načíta so všetkými zamknutiami zapnutými: s počiatkom zobrazenia na `0, 0`, úrovňou priblíženia `1` a kartou ERD bez ohľadu na to, čo uložil, a s jazykom na karte Generátor kódu, štýlmi názvov a typom úvodzoviek tak, ako ich uložil.  
Dokument uložený pred verziou `4.2.0` neuvádza zamknutie `Name View`, takže sa načíta s týmto zamknutím zapnutým a v zobrazení `Physical Names`, a to aj vtedy, keď bol uložený so všetkými ostatnými zamknutiami vypnutými.  
Od verzie `4.0.0` zahodí metóda `setInitialValue` aj registre spolupráce uchovávané pre predchádzajúci dokument, rovnako ako metóda [setInitialValue](../erd-editor-element.md#setinitialvalue) elementu.  
Ani text, ktorý nie je JSON, napríklad súbor so zostávajúcimi značkami konfliktu zlúčenia, nevyhodí chybu: chyba parsovania sa iba zapíše do konzoly, dokument sa vyprázdni a nastavenia zostanú tak, ako boli.

Od verzie `4.0.0` nespúšťa načítanie zber nepotrebných údajov (garbage collection), takže odstránené entity zostávajú vo vlastnosti [runtimeValue](#runtimevalue-getter).  
Predtým zahadzovalo entity, ktoré sa už nenachádzali v poli `doc` a štyri dni alebo dlhšie neboli upravené.

Prepisy pri načítaní sa dokončia ešte pred návratom z metódy `setInitialValue`: značky kľúčov pri stĺpcoch, zistené z možností každého stĺpca a zo vzťahov; šírka každej tabuľky a každého stĺpca, znova zmeraná funkciou `toWidth`; body, v ktorých sa každá spojnica stretáva so svojimi tabuľkami; a pri každom vzťahu príznak identifikujúceho vzťahu a symbol na jeho konci pri nadradenej tabuľke.  
Žiadny z nich nie je súčasťou hodnoty `value`, ale hodnota `replicationStore.runtimeValue` prečítaná hneď po volaní ich už obsahuje všetky.  
Akcia, ktorá príde hneď po načítaní, napríklad znova prehrané posunutie, sa porovnáva s načítaným dokumentom, takže samotné načítanie sa nikdy nehlási ako [`changed`](#onchange).

Ani načítanie, ani žiadny z týchto prepisov nevyvolá udalosť `change`.  
Ak chcete načítaný dokument zapísať späť v úložnej forme, po návrate z metódy `setInitialValue` si sami prečítajte hodnotu `replicationStore.value`.

### on@change {#onchange}

Prihlási sa na odber zmien stavu editora.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

Udalosť `change` sa vyvoláva s oneskorením (debounce) 200 ms, takže séria akcií príde ako jedno hlásenie.  
Vyvolá sa iba pri akciách takého druhu, ktorý môže zmeniť dokument, a navyše pri akcii `settings.changeIgnoreSaveSettings`, ktorú môže stále posielať starší editor (pozrite si časť [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Preposlaná akcia prítomnosti ani akcia `editor.mergeLWW` ju nikdy nevyvolá.  
Odber zrušíte zavolaním vrátenej funkcie.

Od verzie `3.10.0` dostáva poslucháč hodnotu typu `ReplicationChange`, ktorý vstupný bod `@dineug/erd-editor/engine.js` exportuje popri type `ReplicationStore`.  
Pred verziou `3.10.0` nedostával nič a poslucháč, ktorý argument ignoruje, funguje naďalej.  
Pole `value` je serializovaný dokument v úložnej forme, ten istý reťazec, aký v danej chvíli vracia `replicationStore.value`, takže ho netreba znova serializovať.  
Pole `changed` má hodnotu `false`, keď akcie od predchádzajúcej udalosti `change` alebo od načítania ponechali pole `value` bajt po bajte bez zmeny.

Zmena, ktorú [zamknutie](../../guide/guides/settings.md#lock) z hodnoty `value` vynechá, aj tak vyvolá udalosť `change` s poľom `changed` nastaveným na `false`, preto zapisujte iba vtedy, keď má pole `changed` hodnotu `true`.  
Ide o posunutie alebo zmenu priblíženia, kým je zamknuté nastavenie `Viewport`, prepnutie karty, kým je zamknuté nastavenie `Canvas Type`, a zmenu jazyka na karte Generátor kódu, štýlu názvov alebo typu úvodzoviek, kým je zapnuté jeho vlastné zamknutie.  
Od verzie `4.2.0` ide aj o prepnutie Zobrazenia názvov, kým je zamknuté nastavenie `Name View`: editor ho síce naďalej odošle, ale replika ho zahodí, rovnako ako ostatné editory.  
Prepnutie Zobrazenia názvov urobené v editore iba na čítanie sa zahodí rovnakým spôsobom bez ohľadu na jeho zamknutie.  
Udalosť [change](../erd-editor-element.md#change) elementu takú zmenu vynechá, ale replika ju aj tak ohlási.  
V novom dokumente a v dokumente uloženom pred verziou `4.0.0` sú zapnuté všetky zamknutia a v každom dokumente uloženom pred verziou `4.2.0` je zamknuté nastavenie `Name View`.  
Pri odomknutom nastavení `Viewport` mení hodnotu `value` posunutie alebo zmena priblíženia, pri odomknutom nastavení `Canvas Type` ju mení aj otvorenie inej karty editora a pri odomknutom nastavení `Name View` aj prepnutie Zobrazenia názvov z editora, ktorý nie je iba na čítanie.  
Hodnotu `value` mení aj zapnutie alebo vypnutie zamknutia.

Od verzie `4.0.0` porovnáva pole `changed` úložnú formu, ktorá neobsahuje odstránené entity ani poradie prekrývania.  
Preto tabuľka pridaná a znova odstránená v rámci jednej udalosti `change`, úprava, ktorá zasiahne entitu odstránenú iným spolupracovníkom, a preposlané načítanie, ktoré mení iba poradie prekrývania, takisto všetky skončia s poľom `changed` nastaveným na `false`.  
Od verzie `4.2.0` rovnako skončí aj riadok pridaný do hárka karty Slovník a ponechaný prázdny, pretože úložná forma vynecháva riadok, ktorý nič neobsahuje.

Pole `changed` nikdy neporovnáva s vaším uloženým súborom, ktorý sa po načítaní už môže líšiť od hodnoty `value`: líši sa súbor uložený staršou verziou vrátane súboru verzie v2 a takisto súbor, ktorý začína značkou poradia bajtov (byte order mark), a ručne upravený súbor.  
Od verzie `4.2.0` sa líši aj súbor uložený verziou `4.0.0` alebo `4.1.0`, pretože `value` vynecháva prázdne textové polia jeho entít, ako aj prázdne zoznamy v objekte `doc` a prázdne kolekcie, ktoré takýto súbor obsahuje.  
Porovnávanie bajtov s takým súborom by za úpravu považovalo aj posunutie, ktoré zamknutie vynechá.  
Prvá udalosť `change` s poľom `changed` nastaveným na `true` vráti takýto súbor v úložnej forme, takže jeho zapísaním sa súbor raz prepíše.  
Súbor uložený touto verziou sa nelíši, nech bol uložený kdekoľvek, ako vysvetľuje časť [toWidth](#towidth).  
Ak sa metóda `setInitialValue` zavolá, kým udalosť `change` ešte čaká, a pred uplynutím jej oneskorenia sa nič neodošle, táto udalosť `change` aj tak príde s načítanou hodnotou `value` a s poľom `changed` nastaveným na `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplikuje zmeny zo vzdialeného editora na úložisko replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

Metóda `dispatch` odloží spracovanie do mikroúlohy a metóda `dispatchSync` aplikuje dávku okamžite.

Prúd zo zdieľaného úložiska môžete odovzdať bez filtrovania.  
Obe metódy ponechajú iba akcie takého druhu, ktorý môže zmeniť dokument, a navyše dve akcie opísané na konci tejto časti, pričom zvyšok zahodia, takže prítomnosť prenášaná reláciou spoločných úprav – kurzor myši, fokus, výber a ťahaný rámec každého používateľa – prejde bez akéhokoľvek účinku.

Od verzie `3.10.0` patria medzi ponechané akcie `relationship.changeOnDelete` a `relationship.changeOnUpdate` a akcia `relationship.add` nesie polia `onDelete` a `onUpdate`.  
Úložisko zo staršej verzie tieto akcie zahodí a tieto polia ignoruje, takže stratí referenčné akcie [ON DELETE a ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) vzťahov.

Od verzie `4.0.0` patria medzi ponechané akcie aj `table.changeGroup`, sedem z ôsmich akcií `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` a `tableGroup.changeColor`, všetky okrem zmeny poradia prekrývania `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` a `settings.changeDDLScript`.  
Akcia `settings.changeRelationshipOptimization` už neexistuje, preto ju obe metódy zahodia.  
Úložisko zo staršej verzie nové akcie zahodí, takže stratí [skupiny tabuliek](../../guide/guides/table-groups.md), [zamknutia](../../guide/guides/settings.md#lock), skripty na karte [Schéma SQL](../../guide/guides/schema-sql.md) a stĺpce, ktoré existujúcemu vzťahu priradí dialógové okno [Mapovať stĺpce](../../guide/guides/relationship-editing.md#map-columns).  
Repliku spúšťajte v rovnakej verzii ako editory alebo v novšej.

Verzia `4.1.0` nepridáva žiadny typ akcie a vstupný bod `@dineug/erd-editor/engine.js` ponecháva bez zmeny, takže replika verzie `4.0.0` si ponechá každú zmenu, ktorú pošle editor verzie `4.1.0`, rovnako ako replika verzie `4.1.0`.  
Od verzie `4.1.0` premenúvajú tlačidlá `Replace` a `Replace All` v [hľadaní a nahrádzaní](../../guide/guides/find-and-replace.md#replacing) aj indexy a skupiny tabuliek, a to prostredníctvom akcií `index.changeName` a `tableGroup.changeName`, ktoré replika verzie `4.0.0` už ponecháva.  
Vlastný stav [prieskumníka](../../guide/guides/explorer.md) sa nikdy neposiela a prepnutie karty alebo posunutie, ktoré vykoná, príde rovnako ako akékoľvek iné prepnutie karty alebo posunutie; pozrite si stránku [Spoločné úpravy](./collaborative-editing.md).

Od verzie `4.2.0` patria medzi ponechané akcie aj `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` a `dictionary.add`, `dictionary.update` a `dictionary.remove`, ktoré nesú každú úpravu, zoradenie a import CSV v hárkoch karty [Slovník](../../guide/guides/dictionary.md).  
Z prepnutí Zobrazenia názvov replika aplikuje iba tie, ktoré urobí editor, ktorý nie je iba na čítanie, kým je nastavenie `Name View` odomknuté, a ostatné zahodí (pozrite si časť [on@change](#onchange)).  
Úložisko zo staršej verzie všetky tieto akcie zahodí, takže stratí [logické názvy](../../guide/guides/logical-names.md), prepojenia s doménami, informáciu o tom, či každý názov pochádza zo slovníkov, slová, termíny a domény a Zobrazenie názvov.  
Editor starší ako verzia `4.2.0` môže v relácii časť z toho replike verzie `4.2.0` aj tak vziať.  
Import schémy vo formáte SQL, GraphQL, DBML alebo AML položkou `Import` v tomto editore, nie však položkou `Import and Add`, vyprázdni slová, termíny a domény repliky.  
Keď sa v ňom vráti späť načítanie, import položkou `Import` alebo volanie `clear()`, načíta sa do repliky jeho vlastná kópia dokumentu bez logických názvov, prepojení s doménami a slovníkov; pozrite si časť [Kombinovanie verzií](./collaborative-editing.md#mixing-releases).  
Vstupný bod `@dineug/erd-editor/engine.js` exportuje rovnakú funkciu `createReplicationStore` a rovnaké typy `ReplicationStore` a `ReplicationChange` ako predtým a funkcia `createReplicationStore` prijíma rovnaký kontext.

Od verzie `4.0.0` aplikujú obe metódy aj akciu `editor.mergeLWW`, ktorá nesie registre spolupráce, ktorými editor odpovedá, keď sa k relácii pripojí ďalší editor, takže replika zosúlaďuje súbežné úpravy rovnako ako editory.  
Nezmení ani jeden bajt hodnoty `value` a nevyvolá žiadnu udalosť `change`.  
Akcia `settings.changeIgnoreSaveSettings`, ktorú môže stále posielať editor vydaný pred verziou `4.0.0`, sa ponechá, ale nič nemení: vyvolá udalosť `change` s poľom `changed` nastaveným na `false`.

### destroy {#destroy}

Úplne zničí inštanciu replicationStore.

```js
replicationStore.destroy();
```

Potom úložisko prestane vyvolávať udalosť `change` a ignoruje ďalšie odosielané akcie.  
Dokument namiesto vyhodenia chyby zostane zmrazený na svojej poslednej hodnote.  
Ak chcete začať odznova, vytvorte nové úložisko.
