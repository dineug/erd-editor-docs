---
sidebar_position: 2
description: Replicirajte delujoč urejevalnik v shrambo brez vmesnika zunaj glavne niti in serializirajte dokument za shranjevanje.
---

# Oddaljena shramba

Pošiljanje celotnega stanja urejevalnika ob vsaki spremembi je neučinkovito.  
V takšnem primeru urejevalnik ponuja API za replikacijo podatkov v realnem času.

## Namestitev {#installation}

```sh
npm install @dineug/erd-editor
```

Shramba za replikacijo je na podpoti `@dineug/erd-editor/engine.js`, ne v korenu paketa.  
Ta vstopna točka ne dostopa do modela DOM, zato deluje v niti Web Worker ali kjer koli drugje zunaj glavne niti.  
Uvoz korena paketa namesto tega potrebuje dokument: od različice `5.0.0` ne definira nobenega elementa, vendar ob vrednotenju zgradi oba razreda elementov. Pred različico `5.0.0` je registriral element po meri `<erd-editor>`.

## Uporaba {#usage}

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

## Replikacija delujočega urejevalnika {#replicating-a-live-editor}

Dejanja prihajajo iz skupne shrambe delujočega urejevalnika.  
Glejte stran [Sodelovalno urejanje](./collaborative-editing.md).

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

Mejo prečka samo sprememba, nikoli celoten dokument.  
Replika jo uporabi in rezultat serializira na svoji strani.  
Dogodek `change` vam ta rezultat preda kot `value`, lastnost `changed` pa vam pove, kdaj ga je vredno zapisati.

Od različice `4.0.0` repliko inicializirajte iz lastnosti `runtimeValue` urejevalnika, kot je prikazano zgoraj, in ne iz shranjene datoteke ali iz lastnosti `value` urejevalnika.  
Datoteki manjkajo spremembe, narejene po njenem shranjevanju, lastnosti `value` pa manjkajo entitete, odstranjene v seji.  
Replika, inicializirana brez odstranjene tabele, jo povrne brez imena in stolpcev, ko urejevalnik razveljavi odstranitev, in jo takšno tudi shrani.  
Od različice `4.2.0` enako velja za besedo, izraz ali domeno, odstranjeno z lista na zavihku [Slovar](../../guide/guides/dictionary.md).  
Ko urejevalnik razveljavi odstranitev, replika, inicializirana brez vrstice, to vrstico znova navede prazno, in ker lastnost `value` prazno vrstico izpusti, replika dokument shrani brez nje.  
Pri domeni v tej repliki tudi stolpci in izrazi, ki so bili povezani z njo, ostanejo brez povezave z domeno, saj replika povezav ni nikoli hranila, razveljavitev pa jih ne pošlje.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Izmeri širino niza v slikovnih pikah.  
Shramba nima modela DOM, zato besedila ne more izmeriti sama, širine stolpcev pa s to funkcijo znova izračuna vsakič, ko se spremeni ime, podatkovni tip, privzeta vrednost ali komentar.  
Od različice `4.2.0` to vključuje tudi [logično ime](../../guide/guides/logical-names.md) tabele ali stolpca.  
Celico domene stolpca, ki prikazuje ime domene, s katero je stolpec povezan, izmeri vsakič, ko se stolpec poveže z domeno ali se mu povezava z domeno prekine, in vsakič, ko se ta domena doda, preimenuje ali odstrani.  
Vse tabele in stolpce izmeri znova tudi vsakič, ko metoda [setInitialValue](#setinitialvalue) naloži dokument.  
Od različice `4.0.0` se širine hranijo samo v lastnosti [runtimeValue](#runtimevalue-getter), nikoli pa v lastnosti `value`.  
Zato se dokument, ki ga je shranila ta izdaja, znova prebere v enako vrednost `value` bajt za bajtom, ne glede na to, kje je bil shranjen in kako se je tam merilo besedilo.

Merite tako kot urejevalnik – `400 12px` v naboru pisav urejevalnika, zaokroženo, z dodatnimi 2 px notranjega odmika.  
Sicer se širine v lastnosti `runtimeValue` začnejo razlikovati od tistih na zaslonu.

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

`text.length * 10` je nadomestni izračun, kadar platno ni na voljo.  
Zadošča za shrambo, katere dokument se samo shranjuje, nikoli pa ne izrisuje.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializira trenutno stanje urejevalnika.  
Vrne niz JSON, ki ga lahko shranite takšnega, kot je – ne razčlenjenega objekta.

```js
const data = replicationStore.value;
```

Od različice `4.0.0` je lastnost `value` oblika za shranjevanje: dokument, kakršnega hrani datoteka, isto besedilo, ki ga vrne lastnost [value](../erd-editor-element.md#value) elementa.  
Vsebuje samo žive entitete v stalnem vrstnem redu, brez odstranjenih, brez vrstnega reda prekrivanja in brez vsega, kar nalaganje znova izpelje, kot so širine, ki jih izmeri funkcija [toWidth](#towidth).  
Od različice `4.2.0` vsebuje tudi logična imena, podatek, ali je bilo posamezno ime izpeljano iz slovarjev, povezave z domenami ter besede, izraze in domene z zavihka [Slovar](../../guide/guides/dictionary.md).  
Od različice `4.2.0` izpusti tudi vsako prazno besedilno polje entitete, vsak seznam v `doc` in vsako kolekcijo, ki ne vsebuje ničesar, ter samo polje `collections`, kadar so vse kolekcije prazne.  
Zamaknjena je za dva presledka, vsaka vrstica slovarja je v svoji vrstici besedila, konča pa se z znakom za novo vrstico, zato isti dokument vedno da enake bajte.  
Za njeno vsebino glejte razdelek [Oblika za shranjevanje in vrednost med izvajanjem](./schema.md#storage-form-and-runtime-value).

Vsaka nastavitev z vklopljenim [zaklepom](../../guide/guides/settings.md#lock) se zapiše z vrednostjo, pri kateri je bila zaklenjena, vsaka druga nastavitev pa takšna, kot je.  
Zaklep `Viewport` hkrati zajema izhodišče pogleda in stopnjo povečave, zavihek, jezik generatorja kode, oba zapisa imen in vrsta narekovajev pa imajo vsak svoj zaklep.  
Od različice `4.2.0` ima svoj zaklep tudi [prikaz imen](../../guide/guides/logical-names.md#name-view), katerega zaklep `Name View` je v novem dokumentu vklopljen.  
Zaklepi nadomeščajo polje `ignoreSaveSettings` dokumenta, ki se od različice `4.0.0` ne bere in ne zapisuje.  
Pred različico `4.0.0` je bila lastnost `value` celoten dokument, kot ga je hranila shramba, z uporabljenima bitoma tega polja za pomik in povečavo.

### runtimeValue getter {#runtimevalue-getter}

Od različice `4.0.0` serializira dokument, kot ga hrani replika, vključno z odstranjenimi entitetami in vsem, kar izpelje nalaganje.  
Tudi tu se vsaka zaklenjena nastavitev zapiše z zaklenjeno vrednostjo.

```js
const snapshot = replicationStore.runtimeValue;
```

Vrednost uporabite, da prek metode `setInitialValue` inicializirate urejevalnik ali drugo shrambo, ki se pridruži pozneje; glejte stran [Sodelovalno urejanje](./collaborative-editing.md).  
Nikoli je ne shranjujte kot datoteko: vsebuje odstranjene entitete, objavljena shema [JSON Schema](./schema.md#json-schema) pa jo zavrne.  
Prav te odstranjene entitete omogočajo, da pozneje poslana razveljavitev odstranitve v shrambi, inicializirani iz nje, povrne celotno entiteto.  
Ostanejo, dokler se dokument naslednjič ne odpre iz svoje datoteke, katere oblika jih izpušča.

### setInitialValue {#setinitialvalue}

Naloži prej shranjeno stanje urejevalnika.

```js
replicationStore.setInitialValue('json...');
```

Sprejme obliko za shranjevanje, vrednost med izvajanjem ali dokument, ki ga je shranila starejša izdaja, vključno z dokumentom v2.  
Prazen niz ali kar koli, kar ni niz, naloži nov prazen dokument, namesto da bi prišlo do napake.  
Shramba, ki ji nikoli ni bila podana vrednost, začne z enakim novim dokumentom.  
Od različice `4.0.0` ima ta dokument vklopljene vse [zaklepe](../../guide/guides/settings.md#lock), zato njegova lastnost `value` ohrani pogled, zavihek, jezik generatorja kode, zapise imen in vrsto narekovajev, s katerimi je začel, medtem ko urejevalniki, ki jih shramba replicira, pomikajo pogled, spreminjajo povečavo, preklapljajo med zavihki ali spreminjajo te nastavitve. V različici `3.10.0` ni shranjeval ne pomika ne povečave, pred tem pa je shranjeval oboje.  
Od različice `4.2.0` ohrani tudi svoj prikaz imen, `Physical Names`, medtem ko urejevalniki preklapljajo svojega.  
Shranjen dokument ohrani zaklepe, ki jih navaja.  
Dokument, ki ne navaja nobenega, kar velja za vsak dokument, shranjen pred različico `4.0.0`, vključno z dokumentom v2, se naloži z vsemi vklopljenimi zaklepi: z izhodiščem pogleda pri `0, 0`, stopnjo povečave `1` in zavihkom ERD ne glede na to, kaj je shranil, ter z jezikom generatorja kode, zapisi imen in vrsto narekovajev, kot jih je shranil.  
Dokument, shranjen pred različico `4.2.0`, ne navaja zaklepa `Name View`, zato se naloži s tem zaklepom vklopljenim in v prikazu `Physical Names`, tudi če je bil shranjen z vsemi drugimi zaklepi izklopljenimi.  
Od različice `4.0.0` metoda `setInitialValue` tudi zavrže registre sodelovanja, hranjene za prejšnji dokument, tako kot metoda [setInitialValue](../erd-editor-element.md#setinitialvalue) elementa.  
Tudi besedilo, ki ni JSON, na primer datoteka, v kateri so ostale oznake konfliktov pri združevanju, ne sproži napake: napaka razčlenjevanja se samo zapiše v konzolo, dokument se izprazni, nastavitve pa ostanejo, kot so bile.

Od različice `4.0.0` nalaganje ne izvaja zbiranja smeti, zato odstranjene entitete ostanejo v lastnosti [runtimeValue](#runtimevalue-getter).  
Prej je zavrglo entitete, ki se niso več pojavljale v polju `doc` in jih štiri dni ali dlje ni nihče spremenil.

Prepisi ob nalaganju se zaključijo, še preden se metoda `setInitialValue` konča: oznake ključev na stolpcih, razbrane iz možnosti vsakega stolpca in iz relacij; vse širine tabel in stolpcev, znova izmerjene s funkcijo `toWidth`; točke, kjer se vsaka povezovalna črta stika s svojima tabelama; ter identifikacijska zastavica vsake relacije in simbol na njenem koncu pri nadrejeni tabeli.  
Noben od teh podatkov ni del lastnosti `value`, vendar jih lastnost `replicationStore.runtimeValue`, prebrana takoj po klicu, že vsebuje vse.  
Dejanje, ki prispe takoj za nalaganjem, na primer ponovno predvajan pomik, se primerja z naloženim dokumentom, zato se nalaganje samo nikoli ne sporoči kot [`changed`](#onchange).

Niti nalaganje niti kateri koli od teh prepisov ne sproži dogodka `change`.  
Če želite naloženi dokument znova zapisati v obliki za shranjevanje, sami preberite lastnost `replicationStore.value`, ko se metoda `setInitialValue` konča.

### on@change {#onchange}

Naroči se na spremembe stanja urejevalnika.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

Dogodek `change` se zakasni za 200 ms, zato hiter niz dejanj prispe kot eno obvestilo.  
Sproži se samo za dejanja tistih vrst, ki lahko spremenijo dokument, in za dejanje `settings.changeIgnoreSaveSettings`, ki ga starejši urejevalnik morda še pošilja (glejte razdelek [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Posredovano dejanje prisotnosti ali dejanje `editor.mergeLWW` ga nikoli ne prebudi.  
Če se želite odjaviti, pokličite vrnjeno funkcijo.

Od različice `3.10.0` poslušalec prejme vrednost tipa `ReplicationChange`, ki ga modul `@dineug/erd-editor/engine.js` izvaža poleg tipa `ReplicationStore`.  
Pred različico `3.10.0` ni prejel ničesar, poslušalec, ki argument prezre, pa deluje še naprej.  
Lastnost `value` je serializiran dokument v obliki za shranjevanje, isti niz, ki ga v tistem trenutku vrne `replicationStore.value`, zato ga ni treba znova serializirati.  
Lastnost `changed` ima vrednost `false`, ko so dejanja od prejšnjega dogodka `change` ali od nalaganja pustila lastnost `value` bajt za bajtom nespremenjeno.

Sprememba, ki jo [zaklep](../../guide/guides/settings.md#lock) izpusti iz lastnosti `value`, vseeno sproži dogodek `change` z lastnostjo `changed`, nastavljeno na `false`, zato zapisujte samo, ko ima lastnost `changed` vrednost `true`.  
Takšne spremembe so pomik ali sprememba povečave, ko je nastavitev `Viewport` zaklenjena, preklop zavihka, ko je nastavitev `Canvas Type` zaklenjena, ter sprememba jezika generatorja kode, zapisa imen ali vrste narekovajev, ko je vklopljen zaklep te nastavitve.  
Od različice `4.2.0` je takšna sprememba tudi preklop prikaza imen, ko je nastavitev `Name View` zaklenjena: urejevalnik ga še vedno pošlje, replika pa ga zavrže, tako kot drugi urejevalniki.  
Preklop prikaza imen, opravljen v urejevalniku samo za branje, se zavrže na enak način, ne glede na njegov zaklep.  
Dogodek [change](../erd-editor-element.md#change) elementa takšno spremembo izpusti, vendar jo replika vseeno sporoči.  
V novem dokumentu in v dokumentu, shranjenem pred različico `4.0.0`, so vklopljeni vsi zaklepi, nastavitev `Name View` pa je zaklenjena v vsakem dokumentu, shranjenem pred različico `4.2.0`.  
Ko je nastavitev `Viewport` odklenjena, pomik ali sprememba povečave spremeni lastnost `value`, ko je odklenjena nastavitev `Canvas Type`, jo spremeni tudi odpiranje drugega zavihka urejevalnika, ko je odklenjena nastavitev `Name View`, pa jo spremeni tudi preklop prikaza imen iz urejevalnika, ki ni samo za branje.  
Tudi vklop ali izklop zaklepa spremeni lastnost `value`.

Od različice `4.0.0` lastnost `changed` primerja obliko za shranjevanje, ki ne vsebuje ne odstranjenih entitet ne vrstnega reda prekrivanja.  
Zato se lastnost `changed` nastavi na `false` tudi pri tabeli, ki se doda in znova odstrani znotraj enega dogodka `change`, pri spremembi, ki zadene entiteto, ki jo je odstranil drug sodelavec, in pri posredovanem nalaganju, ki spremeni samo vrstni red prekrivanja.  
Od različice `4.2.0` enako velja za vrstico, ki se doda na list zavihka Slovar in ostane prazna, saj oblika za shranjevanje izpusti vrstico, ki ne vsebuje ničesar.

Lastnost `changed` nikoli ne primerja dokumenta z vašo shranjeno datoteko, ki se lahko od lastnosti `value` razlikuje že takoj po nalaganju: razlikuje se datoteka, ki jo je shranila starejša izdaja, vključno z datoteko v2, prav tako pa tudi datoteka, ki se začne z oznako vrstnega reda bajtov, in ročno urejena datoteka.  
Od različice `4.2.0` to vključuje tudi datoteko, ki jo je shranila različica `4.0.0` ali `4.1.0`, saj lastnost `value` izpusti prazna besedilna polja njenih entitet ter prazne sezname v `doc` in prazne kolekcije, ki jih takšna datoteka vsebuje.  
Primerjava bajtov s takšno datoteko bi kot spremembo štela celo pomik, ki ga zaklep izpusti.  
Prvi dogodek `change` z lastnostjo `changed`, nastavljeno na `true`, vrne takšno datoteko v obliki za shranjevanje, zato se datoteka ob zapisu enkrat prepiše.  
Datoteka, ki jo je shranila ta izdaja, se ne razlikuje, ne glede na to, kje je bila shranjena, kot pojasnjuje razdelek [toWidth](#towidth).  
Če se metoda `setInitialValue` izvede, ko dogodek `change` še čaka, in se do izteka njegove zakasnitve ne odpošlje nič, ta dogodek `change` vseeno prispe z naloženo vrednostjo `value` in lastnostjo `changed`, nastavljeno na `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Uporabi spremembe oddaljenega urejevalnika v shrambi replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

Metoda `dispatch` izvedbo odloži v mikroopravilo, metoda `dispatchSync` pa paket uporabi takoj.

Tok skupne shrambe lahko predate nefiltriran.  
Obe metodi obdržita samo dejanja tistih vrst, ki lahko spremenijo dokument, in dve dejanji, opisani na koncu tega razdelka, ostala pa zavržeta, zato prisotnost, ki jo prenaša sodelovalna seja – kazalec miške, fokus, izbor in okvir vlečenja vsakega uporabnika – gre skozi brez učinka.

Od različice `3.10.0` sta med obdržanimi dejanji `relationship.changeOnDelete` in `relationship.changeOnUpdate`, dejanje `relationship.add` pa prenaša `onDelete` in `onUpdate`.  
Shramba iz starejše izdaje ti dejanji zavrže in ti polji prezre, zato izgubi dejanja [ON DELETE in ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) relacije.

Od različice `4.0.0` so med obdržanimi dejanji tudi `table.changeGroup`, sedem od osmih dejanj `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` in `tableGroup.changeColor`, vsa razen spremembe vrstnega reda prekrivanja `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` in `settings.changeDDLScript`.  
Dejanje `settings.changeRelationshipOptimization` ne obstaja več, zato ga obe metodi zavržeta.  
Shramba iz starejše izdaje nova dejanja zavrže, zato izgubi [skupine tabel](../../guide/guides/table-groups.md), [zaklepe](../../guide/guides/settings.md#lock), skripte [Sheme SQL](../../guide/guides/schema-sql.md) in stolpce, ki jih okno [Preslikaj stolpce](../../guide/guides/relationship-editing.md#map-columns) dodeli obstoječi relaciji.  
Repliko poganjajte na isti izdaji, kot jo uporabljajo urejevalniki, ali na novejši.

Različica `4.1.0` ne doda nobene vrste dejanja in modul `@dineug/erd-editor/engine.js` pusti nespremenjen, zato replika različice `4.0.0` ohrani vsako spremembo, ki jo pošlje urejevalnik različice `4.1.0`, prav tako kot replika različice `4.1.0`.  
Od različice `4.1.0` ukaza `Replace` in `Replace All` v [iskanju in zamenjavi](../../guide/guides/find-and-replace.md#replacing) preimenujeta tudi indekse in skupine tabel, in sicer z dejanjema `index.changeName` in `tableGroup.changeName`, ki ju replika različice `4.0.0` že obdrži.  
Lastno stanje [raziskovalca](../../guide/guides/explorer.md) se nikoli ne pošlje, preklop zavihka ali pomik, ki ga ta sproži, pa prispe tako kot vsak drug preklop zavihka ali pomik; glejte stran [Sodelovalno urejanje](./collaborative-editing.md).

Od različice `4.2.0` so med obdržanimi dejanji tudi `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` ter `dictionary.add`, `dictionary.update` in `dictionary.remove`, ki prenašajo vsako spremembo, razvrščanje in uvoz CSV na listih zavihka [Slovar](../../guide/guides/dictionary.md).  
Od preklopov prikaza imen replika uporabi samo tiste, ki jih opravi urejevalnik, ki ni samo za branje, medtem ko je nastavitev `Name View` odklenjena, ostale pa zavrže (glejte razdelek [on@change](#onchange)).  
Shramba iz starejše izdaje vsa ta dejanja zavrže, zato izgubi [logična imena](../../guide/guides/logical-names.md), povezave z domenami, podatek, ali je bilo posamezno ime izpeljano iz slovarjev, besede, izraze in domene ter prikaz imen.  
Urejevalnik pred različico `4.2.0` v seji lahko repliki različice `4.2.0` še vedno odvzame nekaj od tega.  
Uvoz Sheme SQL, GraphQL, DBML ali AML z ukazom `Import` v tem urejevalniku, ne pa tudi z ukazom `Import and Add`, izprazni besede, izraze in domene replike.  
Njegova razveljavitev nalaganja, ukaza `Import` ali metode `clear()` v repliko naloži njegovo lastno kopijo dokumenta brez logičnih imen, povezav z domenami ali slovarjev; glejte razdelek [Mešanje izdaj](./collaborative-editing.md#mixing-releases).  
Modul `@dineug/erd-editor/engine.js` izvaža iste `createReplicationStore`, `ReplicationStore` in `ReplicationChange` kot prej, `createReplicationStore` pa sprejme isti kontekst.

Od različice `4.0.0` obe metodi uporabita tudi dejanje `editor.mergeLWW`, ki prenaša registre sodelovanja, s katerimi urejevalnik odgovori, ko se seji pridruži drug urejevalnik, zato replika sočasne spremembe razreši tako kot urejevalniki.  
Ne spremeni niti enega bajta lastnosti `value` in ne sproži dogodka `change`.  
Dejanje `settings.changeIgnoreSaveSettings`, ki ga urejevalnik, izdan pred različico `4.0.0`, morda še pošilja, se obdrži, vendar ne spremeni ničesar: sproži dogodek `change` z lastnostjo `changed`, nastavljeno na `false`.

### destroy {#destroy}

Popolnoma uniči primerek shrambe replicationStore.

```js
replicationStore.destroy();
```

Nato shramba preneha sprožati dogodek `change` in prezre nadaljnja odpošiljanja.  
Dokument zamrzne pri svoji zadnji vrednosti, namesto da bi prišlo do napake.  
Za ponoven začetek ustvarite novo shrambo.
