---
sidebar_position: 1
description: Posredovanje sprememb urejevalnika med primerki z getSharedStore, inicializacija urejevalnika, ki se pridruži, iz runtimeValue in registrov shrambe, razreševanje sprememb, narejenih v istem trenutku, ter prikaz kazalca, fokusa, izbora in okvira vlečenja vsakega sodelavca.
---

# Sodelovalno urejanje

Metoda `getSharedStore()` urejevalnik spremeni v vozlišče sodelovalne seje.  
Vsako spremembo odda kot tok dejanj in uporabi dejanja, ki mu jih pošljejo drugi urejevalniki – prenos med njimi (WebSocket, WebRTC ali kar koli drugega, kar lahko prenaša JSON) zagotovite sami.  
Je ena od metod elementa [ErdEditorElement](../erd-editor-element.md) in se dopolnjuje z [oddaljeno shrambo](./remote-storage.md), kadar je treba posredovane spremembe tudi shraniti.  
Od različice `5.1.0` urejevalnik povežite s paketom `@dineug/erd-editor-yjs`, če želite diagram deliti prek dokumenta Yjs in katerega koli njegovega ponudnika, namesto da prenos vzpostavite sami; glejte stran [Yjs](./yjs.md).

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

Paket `@dineug/erd-editor` nobenega od teh tipov ne izvozi po imenu. Koda TypeScript do njih pride prek `ErdEditorElement`, kot v `ReturnType<ErdEditorElement['getSharedStore']>`.

Dejanje je navaden objekt, ki ga je mogoče serializirati in ki opisuje eno spremembo dokumenta, zato na poti do prenosa prestane `JSON.stringify`.  
Dejanja prihajajo v paketih: metoda `subscribe` vam preda polje in to polje je ena enota – posredujte ga v celoti in ga v celoti odpošljite tudi na drugi strani.  
Dejanje obravnavajte kot neprozoren objekt in ga posredujte nespremenjenega, namesto da bi ga brali ali prepisovali, saj prav evidenčni podatki, ki jih nosi, kot je njegova [različica](#concurrent-edits), ohranjajo urejevalnike usklajene.

Nekaj tega, kar naredi urejevalnik, ostane samo v tem urejevalniku.  
Postavitev tabele, beležke ali skupine tabel v ospredje, kot se zgodi ob njenem izboru, se ne pošlje.  
Prav tako se ne pošljejo izbire `Statements`, `Header`, `Write logical names into empty comments` (od različice `4.2.0`) in `Tables` na zavihku [Shema SQL](../../guide/guides/schema-sql.md), ki pripadajo oknu, v katerem se izberejo.  
Od različice `4.1.0` tudi [raziskovalec](../../guide/guides/explorer.md) ostane v svojem urejevalniku: ali je odprt, njegova širina, strnjene vrstice, vrstica s fokusom tipkovnice, položaj pomika drevesa ter iskanje in možnosti se ne pošljejo.  
Prav tako se ne pošlje [osvetlitev](../../guide/guides/relationship-editing.md#reading-a-connector), ki jo prehod na tuji ključ prižge na povezovalni črti njegove relacije.  
Od različice `4.2.0` tudi zavihek [Slovar](../../guide/guides/dictionary.md) ostane v svojem urejevalniku: kateri list je prikazan ter iskanje, izbor, položaj pomika in širine stolpcev vsakega lista se ne pošljejo. Njegove spremembe, razvrščanja in uvozi CSV pa se pošljejo.  
Pomik, povečava ali preklop zavihka se pošlje, vendar nikoli ne premakne pogleda drugega uporabnika in ne zamenja njegovega zavihka. To velja tudi za pomik, ki ga izvede skok iz raziskovalca, za preklop na zavihek ERD, ko se raziskovalec odpre z drugega zavihka, ter za preklop zavihka in pomik ob skoku z lista [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) na zavihku Slovar na tabelo ali stolpec. Skok s tega lista na besedo, izraz ali domeno ostane na zavihku Slovar, zato se od njega ne pošlje nič.

Od različice `4.2.0` se pošlje tudi preklop [prikaza imen](../../guide/guides/logical-names.md#switching-the-view), o tem, kaj z njim naredijo drugi urejevalniki, pa odloča njegov [zaklep](../../guide/guides/settings.md#lock). Zaklep `Name View` je vklopljen v novem diagramu in v vsakem dokumentu izpred različice `4.2.0`.  
Dokler je zaklep vklopljen, se preklop pokaže samo v urejevalniku, v katerem je bil opravljen: še vedno se pošlje, vendar ga vsi drugi urejevalniki in vse replike zavržejo, zato lahko vsak uporabnik gleda drug prikaz, lastnost `value` pa ohrani zaklenjenega.  
Dokler je zaklep izklopljen, preklop v urejevalniku, ki lahko ureja, spremeni prikaz imen v vseh urejevalnikih in replikah, pri čemer obvelja zadnji preklop, vsi pa ga tudi shranijo.  
Lastni preklop urejevalnika samo za branje vedno ostane v tem urejevalniku, ta pa še vedno sledi skupnim preklopom drugih.

Od različice `5.1.0` sprememba jezika [generatorja kode](../../guide/guides/code-generator.md), zapisa imen tabel, zapisa imen stolpcev ali vrste narekovajev na enak način sledi svojemu zaklepu (`Language`, `Table Name Case`, `Column Name Case` oziroma `Bracket Type`), z eno razliko: dokler je zaklep vklopljen, se sprememba sploh ne pošlje.  
Pokaže se samo v urejevalniku, v katerem je bila narejena, njegova zavihka Generator kode in Shema SQL pa ji sledita; noben drug urejevalnik ali replika je ne vidi. Lastnosti `value` in `runtimeValue` ohranita zaklenjeno vrednost, zato je ne vidi niti urejevalnik, ki se pridruži in je inicializiran iz katerega koli urejevalnika, vsak uporabnik pa lahko, dokler je zaklep vklopljen, gleda drug jezik, zapis imen ali vrsto narekovajev.  
Dokler je zaklep izklopljen, se sprememba, narejena v urejevalniku, ki lahko ureja, pošlje z oznako, da je skupna (`shared: true` v podatkih dejanja). Nastavitev spremeni v vseh urejevalnikih in replikah, pri čemer obvelja zadnja sprememba, vsi pa jo tudi shranijo. Urejevalnik ali replika različice `5.1.0` uporabi označeno spremembo ne glede na lasten zaklep, zato sprememba, narejena tik po odklepu, doseže vse, tudi tam, kjer prispe pred odklepom.  
Pred različico `5.1.0` je taka sprememba dosegla vse urejevalnike in replike ne glede na to, ali je bil njihov zaklep vklopljen, datoteka pa je ohranila zaklenjeno vrednost.

Od različice `5.0.0` urejevalnik [samo za branje](../erd-editor-element.md#readonly) sploh ne pošilja sprememb. Pomik, povečava, zavihek, prikaz imen, zbirka podatkov, jezik generatorja kode, zapisi imen, vrsta narekovajev in vrstice `View Option`, ki jih spremeni njegov bralec, ostanejo na njegovem zaslonu, ne glede na njihove zaklepe; pred različico `5.0.0` so se njegovi pomiki, povečave, preklopi zavihkov, zbirka podatkov in nastavitve kode pošiljali kot pri urejevalniku, ki ga je mogoče urejati.  
Njegova shramba še vedno pošilja, kar pošiljajo njeni sledilniki kazalca, fokusa, izbora in okvira vlečenja bralca, odgovarja na zahteve za registre urejevalnika, ki se pridruži, in uporabi vsako spremembo, ki jo pošljejo drugi. Sprememba zbirke podatkov, nastavitve generatorja kode ali vrstice `View Option` doseže njegov dokument, in njegov zaslon, razen če je njegov bralec to nastavitev tam spremenil, skupni preklop prikaza imen pa se na njegovem zaslonu pokaže v vsakem primeru. Od različice `5.1.0` nastavitev generatorja kode prejme samo, kadar je bila spremenjena, ko je bil njen zaklep izklopljen, ali jo nosi odklep.  
Ko urejevalnik postane samo za branje, najprej pošlje, kar shramba še zadržuje od vlečenja ali pomika, kot to naredi [flushStreamBuffers](#flushstreambuffers), da drugi obdržijo zadnji del.

[Zaklepi](../../guide/guides/settings.md#lock) so skupni: v vseh urejevalnikih obvelja zadnje zaklepanje ali odklepanje nastavitve, zaklep pa nosi vrednosti urejevalnika, ki ga je vklopil, zato vsi urejevalniki in replike shranijo isto vrednost.  
Zaklep `Viewport` zato shrani pogled urejevalnika, ki ga je vklopil, zaklep `Canvas Type` pa zadnji zavihek, na katerem je bil ta urejevalnik pred zavihkom Nastavitve, kjer se zaklepi vklapljajo.  
Izklop zaklepa `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ali od različice `4.2.0` zaklepa `Name View` to nastavitev v vseh urejevalnikih postavi tudi na vrednost, prikazano v urejevalniku, ki ga je izklopil, vključno z njegovo lastno spremembo, narejeno pod zaklepom, tako da vsi še naprej shranjujejo eno samo vrednost. Izklop zaklepa `Viewport` ali `Canvas Type` nikomur ne premakne pogleda in ne zamenja zavihka.

Sprememba skripta `Before tables` ali `After tables` se pošlje v celoti, ko njegovo polje izgubi fokus. Skripta se razrešujeta ločeno, zato sprememba enega, ki jo naredi sodelavec, nikoli ne prepiše drugega.

Nič, kar se naredi v [načinu Tok](../../guide/guides/visualization.md#flow-never-edits-the-document) na zavihku Vizualizacija, ni sprememba dokumenta, zato urejevalnik v načinu Tok drugim ne pošilja sprememb, spremembe, ki jih pošiljajo drugi, pa se medtem še naprej uporabljajo.  
Izjemi sta dve. Izhod iz načina Tok na drug zavihek je preklop zavihka in se pošlje kot vsak drug. Od različice `4.2.0` je izbira na seznamu prikaza imen v orodni vrstici načina Tok preklop prikaza imen, ki se pošlje in uporabi tako kot preklop na platnu.  
Gumba `Previous table` in `Next table` ter bližnjici za razveljavitev in uveljavitev, ki v načinu Tok [prehajajo med pogledi](../../guide/guides/visualization.md#previous-table-and-next-table), se ne pošljejo.  
Gumb na kartici za zunanjo povezavo, rezultat [hitrega iskanja](../../guide/guides/quick-search.md#searching-the-diagram), izbran po `#`, `@` ali `:`, in odpiranje [raziskovalca](../../guide/guides/explorer.md#opening-and-closing) vsi preklopijo iz načina Tok na zavihek ERD. Pošlje se tudi pomik, ki ga tam izvede gumb na kartici ali rezultat hitrega iskanja.

## Dva urejevalnika na eni strani {#two-editors-on-one-page}

Povezava od subscribe do dispatch tu nadomešča omrežje, tako da lahko vidite zgradbo seje, ne da bi vam bil v napoto prenos.

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

Oba urejevalnika tu začneta z istim novim, praznim dokumentom, zato nobenega ni treba inicializirati.  
Pri treh ali več urejevalnikih pakete vsakega pošljite vsem drugim: urejevalnik nikoli ne posreduje naprej tega, kar je prejel.

## Inicializacija sodelavca {#seeding-a-collaborator}

Skupna shramba posreduje spremembe sproti, ko nastajajo, in novemu udeležencu nikoli ne izroči dokumenta v trenutnem stanju, zato je treba urejevalniku, ki se pridruži že potekajoči seji, najprej dati dokument.  
Od različice `4.0.0` ga inicializirajte z lastnostjo [`runtimeValue`](../erd-editor-element.md#runtimevalue) urejevalnika, ki je že v seji, ne pa z lastnostjo `value` ali s shranjeno datoteko.  
Soba, povezana z [`@dineug/erd-editor-yjs`](./yjs.md), sama hrani dokument, ko ga odjemalec [inicializira](./yjs.md#seeding-a-room), zato vsak urejevalnik, povezan z njo, odpre ta dokument, ne da bi mu bilo treba predati `runtimeValue`.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

Vrednost med izvajanjem še vedno hrani to, kar je bilo odstranjeno, odkar je bil dokument odprt, zato novi udeleženec, ko drug urejevalnik pozneje razveljavi odstranitev, tabelo povrne z njenim imenom in stolpci.  
Lastnost [`value`](../erd-editor-element.md#value) je oblika, ki jo hrani datoteka, brez odstranjenih entitet, zato bi novi udeleženec, inicializiran iz nje ali iz datoteke, namesto tega povrnil prazno tabelo brez imena.  
Od različice `4.2.0` enako velja za besedo, izraz ali domeno, odstranjeno z lista na zavihku [Slovar](../../guide/guides/dictionary.md): ko drug urejevalnik razveljavi odstranitev, novi udeleženec, inicializiran iz lastnosti `runtimeValue`, vrstico znova navede v celoti, udeleženec, inicializiran iz lastnosti `value`, pa navede prazno vrstico, ki jo lastnost `value` tega udeleženca nato izpusti.  
Lastnost `value` še naprej zapisujte v shrambo: lastnost `runtimeValue` je namenjena samo inicializaciji drugega urejevalnika, drugega pogleda ali shrambe [replicationStore](./remote-storage.md).  
Urejevalniki v VS Code, v aplikaciji Obsidian, v razvojnem okolju JetBrains in v spletni aplikaciji na ta način inicializirajo drugi pogled odprtega dokumenta.

Metoda `setInitialValue` se ne posreduje, zato inicializacija novega udeleženca v drugih urejevalnikih ne spremeni ničesar.  
Od različice `4.0.0` tudi zavrže registre sodelovanja urejevalnika, ki razrešujejo [sočasne spremembe](#concurrent-edits). Če je skupna shramba urejevalnika že imela naročnika, shramba druge urejevalnike znova zaprosi za njihove, kot ob prvem klicu [subscribe](#subscribe), tako da urejevalnik, ki se sredi seje znova naloži, spremembe razrešuje enako kot drugi.  
Prirejanje vrednosti lastnosti `value` registre ohrani, vendar se v nasprotju z metodo `setInitialValue` posreduje: brž ko ima urejevalnik skupno shrambo, vsak urejevalnik v seji naloži prirejeni dokument, zato novega udeleženca nikoli ne inicializirajte na ta način.

Lastnosti `value` in `runtimeValue` ne hranita ne registrov ne različice, ki jo je dosegla ura urejevalnika, zato udeleženec, inicializiran samo iz lastnosti `runtimeValue`, prevzame oboje iz odgovora, ki ga urejevalniki v seji pošljejo ob njegovem prvem klicu subscribe.  
Dokler ta odgovor ne prispe, lahko sprememba, ki jo naredi udeleženec, nosi nižjo različico od tiste, ki jo imajo drugi, zato jo ti zavrnejo, medtem ko pri udeležencu ostane, starejši zapis, ki je še na poti, pa se zapiše čez novejšega, ki ga hrani inicializacija. Kjer noben delujoč urejevalnik ne odgovori, na primer ko dokument seje hrani strežnik ali shramba dokumentov, jih udeleženec nikoli ne dobi.  
Od različice `5.1.0` jih predajte skupaj z vrednostjo. V urejevalniku v seji pokličite [`flushStreamBuffers()`](#flushstreambuffers), da najprej odide vlečenje ali sprememba barve, ki ju še zadržuje, nato pa v istem trenutku preberite `runtimeValue` ter rezultata metod [`getLWW()`](#getlww) in [`getVersion()`](#getversion) njegove shrambe. Udeleženec naloži vrednost z metodo `setInitialValue`, nato pa preostalo prevzame z metodo [`mergeLWW`](#mergelww) lastne shrambe, in sicer v tem vrstnem redu, saj vsak klic `setInitialValue` zavrže registre. Njegova naslednja sprememba nato nosi različico, večjo od vsake, ki jo hrani inicializacija, zato se zapiše, ne da bi bilo treba čakati na odgovor. Na shrambi, ki že obstaja, metoda [`reseed`](#reseed) naredi oboje v enem klicu.

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

Inicializacija, ki jo hranite za odpiranje poznejših udeležencev, hrani vse troje skupaj. Ni datoteka: v shrambo je treba še naprej zapisovati `value`.  
Shramba [replicationStore](./remote-storage.md#runtimevalue-getter) ne preda nobenih registrov, zato udeleženec, inicializiran iz njene lastnosti `runtimeValue`, registre še vedno prevzame iz odgovora urejevalnikov.

## Sočasne spremembe {#concurrent-edits}

Vsak urejevalnik in vsaka replika za vsako ime in skoraj vsako drugo polje hrani različico zapisa, ki ga je nastavil: to so njegovi registri sodelovanja. Zapis se uveljavi samo, če njegova različica ni nižja od hranjene, zato urejevalniki, ki iste spremembe slišijo v različnem vrstnem redu, končajo z istim dokumentom.  
Od različice `5.1.0` vsaka različica pod svojim števcem nosi še mesto urejevalnika, ki piše, vzeto iz njegovega identifikatorja. Različice zato rastejo v korakih po 4.194.304 in presežejo 32-bitno celo število, ko števec doseže 512. `JSON.stringify` in `JSON.parse` jih prenašata nedotaknjene, vendar jih mora posrednik ali shramba, ki jih razčleni v drugem jeziku, hraniti kot 64-bitna števila, nikoli kot 32-bitna cela števila.

Od različice `5.1.0` dva urejevalnika, ki v istem trenutku spremenita isto ime ali polje, razen pri spodnjih izjemah, končata z isto vrednostjo v vsakem urejevalniku in repliki: ker pišeta pri istem števcu, zapis opremita z dvema različnima različicama, večja pa povsod zmaga. Pred različico `5.1.0` sta lahko zapis opremila z isto različico, vsak urejevalnik pa je obdržal tisto, ki jo je slišal zadnjo, zato sta lahko končala različno. Dva urejevalnika si mesto delita z verjetnostjo 1 proti 4.194.304 za vsak par in sta takrat izenačena kot prej.

Od različice `5.1.0` so na enak način opremljeni z različico tudi položaj tabele, položaj in velikost beležke ali skupine tabel ter izhodišče in stopnja povečave pogleda, tisto, kar jih premika, pa se pošlje kot mesto, kjer se konča:

- vlečenje kot eno dejanje `table.moveTo`, `memo.moveTo` ali `tableGroup.moveTo` na premaknjeno entiteto, v enem paketu, tako da vlečenje skupine nosi točke njenih tabel, od različice `5.1.1` pa tudi njenih beležk, skupaj s točko skupine;
- razveljavitev ali uveljavitev vlečenja kot točka, na katero postavi vsako entiteto;
- pomik kot `settings.scrollTo`, povečava pa kot `settings.changeZoomLevel`;
- sprememba velikosti beležke ali skupine tabel kot njen položaj in velikost skupaj.

Dva uporabnika, ki v istem trenutku premakneta ali premakneta in spremenita velikost iste tabele, beležke ali skupine tabel, zato končata z njo na isti točki in z isto velikostjo v vsakem urejevalniku in repliki. Točko dobi zapis z večjo različico, obe osi skupaj. Premik ne zapiše velikosti, zato sprememba velikosti ohrani svojo velikost, tudi kjer premik, narejen hkrati, prevzame točko.  
Pred različico `5.1.0` je vlečenje odšlo kot prepotovana razdalja, zato sta se dve vlečenji ene tabele seštevali, premik in sprememba velikosti iste beležke ali skupine tabel, narejena hkrati, pa sta lahko končala različno.  
Vlečenje pod 20 px, ki ne pusti vnosa razveljavitve, se pošlje kot vsako drugo, zato lahko kot točka preglasi vlečenje iste entitete, ki ga je v istem trenutku naredil drug uporabnik. Paket vlečenja, pomika ali povečave, ki ga prenos dostavi dvakrat, ničesar ne premakne dvakrat.

Sprememba barve je ena izjema. Odide brez različice, vsak urejevalnik in vsaka replika pa jo opremi z lastno in obdrži barvo, ki jo je slišal zadnjo, zato lahko dva uporabnika, ki v istem trenutku spremenita barvo iste tabele, beležke ali skupine tabel, končata z različnima barvama.  
Nekaj sprememb sploh ne hrani različice, zato jih vsak urejevalnik in vsaka replika uporabi v vrstnem redu, v katerem jih sliši, in tudi dve, narejeni v istem trenutku, lahko končata različno: stolpec, premaknjen znotraj svoje tabele ali indeksa (`column.move`, `indexColumn.move`), ter sprememba [zbirke podatkov](../../guide/guides/table-related-functions.md#databases), vrstice [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) ali nastavitev `Relationship DataType Sync`, `Maximum comment width` ali `Column Order` na zavihku [Nastavitve](../../guide/guides/settings.md).  
Entitete, ki jih dva uporabnika dodata v istem trenutku, na primer dve tabeli ali dva stolpca ene tabele, so lahko v vsakem urejevalniku in repliki tudi v drugačnem vrstnem redu, lastnost `value` vsakega pa shrani svoj vrstni red.

Vse to velja med urejevalniki in replikami različice `5.1.0` ali novejše; kaj spremeni starejši, pove razdelek [Mešanje izdaj](#mixing-releases).

## Mešanje izdaj {#mixing-releases}

Urejevalnik uporabi samo tiste vrste dejanj, ki jih pozna njegova izdaja, zato v seji z mešanimi izdajami starejšim urejevalnikom uide vse, kar potuje z novejšo vrsto dejanja.

Od različice `3.10.0` sprememba dejanja [ON DELETE ali ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) relacije potuje kot ena od dveh novih vrst dejanj, `relationship.changeOnDelete` in `relationship.changeOnUpdate`, dejanje `relationship.add` pa lahko nosi oboje. Posrednik, ki dejanja posreduje nespremenjena, zanje ne potrebuje ničesar novega.  
Urejevalnik izdaje pred različico `3.10.0` te vrste dejanj in polja prezre: nikoli ne izve za ON DELETE ali ON UPDATE relacije, dokument, shranjen iz takega urejevalnika, pa nima ne enega ne drugega. Relacija, ki jo doda starejši urejevalnik, prispe brez njiju, zato imata obe dejanji na začetku vrednost `Not set`.

Vse druge spremembe, ki jih pošlje urejevalnik različice `3.10.0`, potujejo z vrstami dejanj, ki jih starejši urejevalniki že poznajo.  
Ukaz `Replace All` v [iskanju in zamenjavi](../../guide/guides/find-and-replace.md#replacing) svoje spremembe pošlje kot en paket istih dejanj za preimenovanje, komentar in beležko, kot jih pošlje ročna sprememba. [Možnosti pogleda](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` in `Referential Actions` potujeta z obstoječim dejanjem `settings.changeShow`.

Od različice `4.0.0` te spremembe potujejo z novimi vrstami dejanj, posrednik, ki dejanja posreduje nespremenjena, pa zanje ne potrebuje ničesar novega:

- dodana, premaknjena, po velikosti spremenjena, preimenovana, prebarvana ali odstranjena [skupina tabel](../../guide/guides/table-groups.md): `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` in `tableGroup.remove`; tabela, ki se pridruži skupini ali jo zapusti: `table.changeGroup`;
- klik gumba `Save` v oknu [Preslikaj stolpce](../../guide/guides/relationship-editing.md#map-columns) pri obstoječi relaciji, ki hkrati nastavi oba njena seznama stolpcev: `relationship.changeColumns`;
- vklopljen ali izklopljen [zaklep](../../guide/guides/settings.md#lock): `settings.changeLockSettings`;
- sprememba skripta `Before tables` ali `After tables` na zavihku [Shema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

Možnosti pogleda `Table Groups` in `Memos` potujeta z obstoječim dejanjem `settings.changeShow`.  
Dejanje `settings.changeIgnoreSaveSettings`, ki sta ga pošiljali stikali `Save Scroll Information` in `Save Zoom Information`, preden so ju nadomestili zaklepi, se ne pošilja več, dejanja `settings.changeRelationshipOptimization` pa ni več. Urejevalnik različice `4.0.0`, ki prejme katero koli od njiju, ne spremeni ničesar.

Urejevalnik izdaje pred različico `4.0.0` nove vrste dejanj prezre: nikoli ne vidi skupine tabel ali tega, katere tabele so v njej, čeprav vlečenje skupine v njem še vedno premakne tabele v skupini, saj pošlje tudi premik vsake od teh tabel.  
Po kliku gumba `Save` v oknu Preslikaj stolpce ohrani stare stolpce relacije, ko pa se v njem odstrani stolpec te stare preslikave, relacija izgine v vseh urejevalnikih. Nima ne zaklepov ne skriptov.  
Dokument, shranjen iz takega urejevalnika, nima ničesar od tega, urejevalnik različice `4.0.0` pa ga odpre z vsemi vklopljenimi zaklepi.  
Vse urejevalnike v seji in vsako shrambo [replicationStore](./remote-storage.md#dispatch-dispatchsync), ki shranjuje njen dokument, ohranjajte na različici `4.0.0` ali novejši.

Urejevalnik različice `4.1.0` ne pošilja nobene nove vrste dejanj, zato si urejevalniki in replike različic `4.0.0` in `4.1.0` delijo sejo, ne da bi kaj zgrešili.  
V njem [iskanje in zamenjava](../../guide/guides/find-and-replace.md#replacing) preiskuje tudi imena indeksov in imena skupin tabel, ukaza `Replace` in `Replace All` pa jih preimenujeta z dejanjema `index.changeName` in `tableGroup.changeName`, ki ju urejevalnik različice `4.0.0` že uporablja.

Od različice `4.2.0` te spremembe potujejo z novimi vrstami dejanj, posrednik, ki dejanja posreduje nespremenjena, pa zanje ne potrebuje ničesar novega:

- [logično ime](../../guide/guides/logical-names.md) tabele ali stolpca: `table.changeLogicalName` in `column.changeLogicalName`; ali je bilo ime [izpeljano iz slovarjev](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` in `column.changeNameDerived`;
- stolpec, ki se poveže z [domeno](../../guide/guides/dictionary.md#domains-and-data-types) ali se mu povezava z domeno prekine: `column.changeDomain`;
- beseda, izraz ali domena, ki je dodana, spremenjena (vključno z mestom na listu, kot ga določi razvrščanje) ali odstranjena na zavihku [Slovar](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` in `dictionary.remove`;
- preklop [prikaza imen](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

Zaklep `Name View` potuje z obstoječim dejanjem `settings.changeLockSettings`, možnost pogleda `Domain` z dejanjem `settings.changeShow`, premik vrstice `Logical Name` ali `Domain` v [vrstnem redu stolpcev](../../guide/guides/settings.md#adjusting-column-order) pa z dejanjem `settings.changeColumnOrder`.  
Dejanji `editor.clear` in `editor.loadJson` uvoza Sheme SQL, GraphQL, DBML ali AML z ukazom `Import` nosita `keepDictionaries: true`, kar v vseh urejevalnikih ohrani besede, izraze in domene. Enako velja za dejanji klica metode [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` ali `setSchemaAML`, ki nadomesti dokument.  
Fizično ime, ki ga izpeljejo slovarji, potuje z dejanjem `table.changeName` ali `column.changeName`, podatkovni tip, ki ga domena da svojim stolpcem, pa z dejanjem `column.changeDataType`, torej z dejanji, ki jih pošlje ročna sprememba.

Urejevalnik izdaje pred različico `4.2.0` nove vrste dejanj prezre: nima logičnih imen, povezav z domenami, slovarjev ali prikaza imen. Zaklepanje ali odklepanje nastavitve `Name View` tam ne spremeni ničesar, prav tako ne premik vrstice `Logical Name` ali `Domain` v vrstnem redu stolpcev ali premik druge vrstice na mesto ene od njiju. Ničesar ne spremeni niti zaklep `Canvas Type`, ki ga vklopi urejevalnik, ki je na zavihek Nastavitve prišel z zavihka Slovar: starejši urejevalnik tega zavihka ne pozna, zato pusti nastavitev `Canvas Type` odklenjeno. Še vedno pa prikazuje fizična imena, ki jih izpeljejo slovarji, in podatkovne tipe, ki jih dajo domene.  
Njegove lastne spremembe ne vedo ničesar o logičnih imenih, domenah ali slovarjih, kar ima na novejše urejevalnike te učinke:

- Tabela ali stolpec, ki ga ročno preimenuje, ohrani ime označeno kot izpeljano, zato lahko logično ime, ki se zanj pozneje vnese v novejšem urejevalniku, znova izpelje ime in prepiše tisto, ki ga je vnesel ta urejevalnik.
- Podatkovni tip, ki ga da stolpcu, povezanemu z domeno, povezavo pusti, zato list `Checks` navede preverjanje `Domain type mismatch`, naslednja sprememba tipa domene pa stolpcu znova da tip domene.
- Stolpci tujega ključa relacije, ki jo doda, od svojega ključa ne dobijo logičnega imena ali domene.
- Tabela, ki jo prilepi ali podvoji, prispe brez logičnih imen in povezav z domenami.
- Uvoz Sheme SQL, GraphQL, DBML ali AML v njem ne pošlje `keepDictionaries`, zato v vseh urejevalnikih izprazni besede, izraze in domene.
- Njegova razveljavitev nalaganja, uvoza ali metode `clear()` v vseh urejevalnikih naloži njegovo lastno kopijo dokumenta, ta kopija pa nima logičnih imen, povezav z domenami ali slovarjev.
- Ta kopija in dokument, ki ga v njem naloži uvoz Sheme SQL, GraphQL, DBML ali AML, v vseh urejevalnikih tudi vrneta zaklep `Name View` v stanje, v katerem ga je ta urejevalnik našel. Vsi urejevalniki nato kot prikaz imen shranijo `Physical Names` in ga, če je zaklep izklopljen, tudi prikažejo.

Dokument, shranjen iz takega urejevalnika, nima logičnih imen, povezav z domenami, slovarjev ali prikaza imen, zato ga urejevalnik različice `4.2.0` odpre v prikazu `Physical Names`. Starejši urejevalnik pa zaklep `Name View` shrani takšen, kot ga je našel, zato dokument, odklenjen v urejevalniku različice `4.2.0`, ostane odklenjen.  
Vse urejevalnike v seji in vsako shrambo [replicationStore](./remote-storage.md#dispatch-dispatchsync), ki shranjuje njen dokument, ohranjajte na različici `4.2.0` ali novejši.

Urejevalnik različice `5.1.0` ne pošilja nobene nove vrste dejanj, zato urejevalniki in replike pred različico `5.1.0` še vedno delijo sejo z njim, posrednik, ki dejanja posreduje nespremenjena, pa ne potrebuje ničesar novega. Kar opisuje razdelek [Sočasne spremembe](#concurrent-edits), pa velja samo med urejevalniki in replikami različice `5.1.0`:

- Vlečenja urejevalnika različice `5.1.0` potujejo kot točke z dejanji `table.moveTo`, `memo.moveTo` in `tableGroup.moveTo`, ki jih starejši urejevalniki že uporabljajo, njegovi pomiki in povečave pa kot točke z dejanjema `settings.scrollTo` in `settings.changeZoomLevel`, ki ju, kot vsak pomik in vsaka povečava, ne uporabi noben drug urejevalnik, prevzamejo pa ju samo replike. Starejši urejevalnik vsako točko vlečenja uporabi v vrstnem redu prihoda, zunaj vseh registrov, starejša replika pa enako z vsako točko vlečenja, pomika ali povečave, zato se lahko dve točki, poslani hkrati za isto entiteto ali za pogled, tam končata različno.
- Vlečenje starejšega urejevalnika še vedno potuje kot prepotovana razdalja, ki jo vsak urejevalnik in vsaka replika sešteje zunaj svojih registrov, njegov pomik ali povečava pa tudi kot razdalja, ki jo vsaka replika sešteje enako. Razdalja in točka, narejeni hkrati na isti entiteti, se lahko končata različno na urejevalnikih in replikah, ki ju slišijo v različnem vrstnem redu, razdalja, ki jo prenos dostavi dvakrat, pa se sešteje dvakrat.
- Zunaj izjem, ki jih navaja razdelek [Sočasne spremembe](#concurrent-edits), zapis imena ali polja urejevalnika različice `5.1.0`, narejen v istem trenutku kot zapis istega pri starejšem urejevalniku, zmaga skoraj vedno, in sicer z enakim izidom v vsakem urejevalniku in repliki. Dva starejša urejevalnika lahko še vedno končata različno zaradi enega polja, zapisanega hkrati.
- Urejevalnik različice `5.1.0` spremembo jezika generatorja kode, zapisa imen ali vrste narekovajev pošlje samo, dokler je njen zaklep izklopljen, in z oznako `shared: true`, ki jo starejši urejevalnik prezre, spremembo pa uporabi kot prej. Starejši urejevalnik spremembo, narejeno pod zaklepom, še vedno pošlje neoznačeno: urejevalnik ali replika različice `5.1.0` jo zavrže, dokler je ta nastavitev tam zaklenjena, starejši urejevalniki pa jo uporabijo. Pod zaklepom torej starejši urejevalniki sledijo izbiram drug drugega, urejevalniki različice `5.1.0` pa obdržijo svoje, datoteka pa v obeh primerih ohrani zaklenjeno vrednost. Odklep, narejen v kateri koli izdaji, vrednost tistega, ki odklepa, prenese v vse urejevalnike in replike.
- Nalaganje, ki zamenja dokument, na primer prirejena lastnost `value`, `clear()` ali uvoz z zamenjavo, v vsakem urejevalniku različice `5.1.0` konča risanje relacije, v tistem, ki ga je naredil, in v vsakem, ki ga prejme. Starejši urejevalnik ohrani risanje vklopljeno tudi po njem.

Vse urejevalnike v seji in vsako shrambo [replicationStore](./remote-storage.md#dispatch-dispatchsync), ki shranjuje njen dokument, ohranjajte na različici `5.1.0` ali novejši, da spremembe, narejene v istem trenutku, povsod končajo enako, razen pri izjemah, ki jih navaja razdelek [Sočasne spremembe](#concurrent-edits); različica `4.2.0` ali novejša je še vedno tista, ki ohrani logična imena in slovarje. [Strežnik MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) pred različico `1.2.0` se tu šteje za urejevalnik pred različico `5.1.0`, urejevalnika pred različico `5.1.0` pa sploh ni mogoče povezati s sobo [Yjs](./yjs.md).

Od različice `5.1.1` pridružitev beležke [skupini tabel](../../guide/guides/table-groups.md) ali njen izstop iz nje potuje z novo vrsto dejanja `memo.changeGroup`, posrednik, ki dejanja posreduje nespremenjena, pa zanjo ne potrebuje ničesar novega. Pošlje se za beležko, spuščeno v skupino ali iz skupine, za novo skupino, narisano okoli prikazanih beležk brez skupine, za postavko `Group selected tables`, kadar so poleg tabel izbrane tudi beležke, za postavko `Remove from group`, kadar so v izboru beležke, za vsako beležko odstranjene skupine, za klice, s katerimi agent za kodiranje prek [strežnika MCP](../../mcp/tools.md#table-groups) spreminja skupine beležk, ter za razveljavitev in uveljavitev vsakega od naštetih. Pošlje ga tudi dodajanje z ukazom `Import and Add` ali z metodo `setSchemaJSON`, katerega skupine vsebujejo beležke, in prav tako njegova uveljavitev, njegova razveljavitev pa te beležke samo odstrani.

Urejevalnik ali replika iz časa pred različico `5.1.1` dejanje `memo.changeGroup` prezre, njegovo razčlenjevanje pa izpusti polje `groupId` vseh beležk, zato nikoli ne vidi beležke v skupini, čeprav vlečenje skupine v urejevalniku različice `5.1.1` tam še vedno premakne beležke skupine, saj ta urejevalnik za vsako od njih pošlje tudi dejanje `memo.moveTo`. Njegove lastne spremembe o skupinah beležk ne vedo ničesar, kar ima te posledice v novejših urejevalnikih:

- Beležka, ki jo povleče v okvir skupine, ostane zunaj skupine, članica skupine, ki jo povleče iz okvira, pa ostane v njej, pri čemer se okvir raztegne, da jo zajame.
- Njegovo vlečenje skupine, tako kot njegov ukaz `Auto Layout`, premakne skupino in njene tabele, beležke skupine pa pusti tam, kjer stojijo, in okvir se raztegne, da zajame prikazane med njimi.
- Njegov ukaz `Import and Add` ne postavi nobene beležke v skupine, ki jih doda.
- Skupina, ki jo odstrani, pusti polje `groupId` vsake svoje beležke, ki jo še vedno navaja: beležke se berejo, kot da niso v nobeni skupini, njegova razveljavitev odstranitve pa jih vrne v skupino.
- Njegova razveljavitev nalaganja, uvoza ali klica `clear()` v vsakem urejevalniku naloži njegovo lastno kopijo dokumenta, v njej pa nobena beležka ni v nobeni skupini.

Dokument, shranjen iz takega urejevalnika, nima nobene beležke v nobeni skupini, čeprav tak urejevalnik od različice `4.0.0` naprej ohrani skupine njegovih tabel.  
Vse urejevalnike v seji in vsako shrambo [replicationStore](./remote-storage.md#dispatch-dispatchsync), ki shranjuje njen dokument, ohranjajte na različici `5.1.1` ali novejši, da beležke ostanejo v svojih skupinah tabel; različica `5.1.0` ali novejša je še vedno tista, ki razreši spremembe, narejene v istem trenutku. [Strežnik MCP](../../mcp/installation.md#updating) pred različico `1.2.1` prav tako ne vidi in ne ohrani, v kateri skupini tabel je beležka.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Nastavi vzdevek, ki se v drugih urejevalnikih prikaže ob kazalcu miške tega uporabnika.  
Kadar vzdevek manjka ali je prazen, drugi uporabniki vidijo `user`.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Kazalec miške tega uporabnika oddaja drugim urejevalnikom. Privzeta vrednost je `true`.  
Kazalci, ki jih pošljejo drugi uporabniki, so na platnu ERD vedno prikazani.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Oddaja, na čem ta uporabnik dela. Privzeta vrednost je `true`.  
Tabela in celica s fokusom, tabele, beležke in skupine tabel, ki ste jih izbrali, ter okvir, ki ga vlečete po platnu, se pošljejo drugim urejevalnikom in se tam narišejo.  
Vsak uporabnik dobi svojo barvo, tako da jih lahko ločite: obroba na tabeli s fokusom, podčrtanje celice s fokusom, obroč okoli izbranih tabel, beležk in skupin tabel ter črtkan pravokotnik za okvir vlečenja.  
Od različice `4.2.0` lahko vsak uporabnik gleda drug [prikaz imen](../../guide/guides/logical-names.md#collaborators), dokler je njegov zaklep vklopljen, ali po lastnem preklopu urejevalnika samo za branje. Celica s fokusom, ki je vaš prikaz ne izriše, je podčrtana na celici, ki jo prikaz izriše na njenem mestu: ime in logično ime se nadomeščata, prav tako podatkovni tip in domena.  
Prisotnost, ki prihaja od drugih uporabnikov, se na vašem platnu vedno nariše, ne glede na to, ali je ta možnost vklopljena.  
V načinu Tok na zavihku Vizualizacija se fokus in izbor drugih uporabnikov narišeta na karticah tabel, njihovi okvirji vlečenja pa ne. Tabele, ki jih tam izberete, se še vedno pošljejo, okvir, ki ga tam vlečete, pa ne.

```js
editor.getSharedStore({ focusTracker: false });
```

Izklopite oba sledilnika, da boste skupno shrambo uporabljali kot preprost posrednik, ki ne objavlja nobene lastne prisotnosti.  
Prisotnost, ki jo pošljejo drugi urejevalniki, se še vedno prejme in nariše.  
Tako delajo urejevalniki v VS Code, v aplikaciji Obsidian, v razvojnem okolju JetBrains in v storitvi Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Kazalec, fokus, izbor in okvir vlečenja potujejo po istem toku kot spremembe dokumenta, vendar so začasni.  
Nikoli ne pridejo v dokument, v zgodovino razveljavitev ali v `editor.value`, zato jih prenos sme zavreči, shramba replicationStore pa jih prezre.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Ti metodi nastavita trenutno stanje povezave.  
Ko je povezava prekinjena, se spremembe interno zadržijo v medpomnilniku.  
Spremembe iz medpomnilnika se naročnikom oddajo, ko je prenos znova mogoč.  
Privzeto stanje je povezano (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Spremembe iz drugih primerkov urejevalnika uporabi v trenutnem primerku urejevalnika.  
Kadar paket vsebuje zahtevo drugega urejevalnika za registre, kakršno pošlje prvi klic [subscribe](#subscribe) udeleženca, ki se pridružuje, shramba prek svojih naročnikov odgovori s svojimi registri in svojo različico, razen če ne hrani nobenih registrov.  
Od različice `5.1.0` najprej pošlje vse pakete toka, ki jih še zadržuje, kot to naredi [flushStreamBuffers](#flushstreambuffers), tako da je vsaka različica v njenem odgovoru podprta z zapisom, ki so ga drugi že prejeli. Prihod udeleženca zato povzroči, da vsak urejevalnik v seji naenkrat pošlje vlečenje, pomik, povečavo, spremembo barve ali spremembo velikosti beležke, ki jo še zadržuje.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Naroči se na spremembe v urejevalniku.  
Dokler ni vsaj enega naročnika, nič ne zapusti urejevalnika, spremembe, narejene pred tem, pa se zadržijo v medpomnilniku.  
Prvi klic subscribe druge urejevalnike tudi zaprosi za njihove registre sodelovanja, ki razrešujejo [sočasne spremembe](#concurrent-edits), tako da jih tudi udeleženec, ki se pridruži pozneje, razrešuje na enak način.  
Dokumenta ne prinese, zato udeleženca, ki se pridruži pozneje, najprej [inicializirajte](#seeding-a-collaborator); od različice `5.1.0` lahko inicializacija nosi tudi registre.  
Od različice `4.0.0` shramba znova zaprosi vsakič, ko metoda `setInitialValue` ali od različice `5.1.0` metoda [reseed](#reseed) po tem prvem klicu subscribe naloži dokument v njen urejevalnik.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Pakete toka, ki jih ta shramba še zadržuje, pošlje takoj, namesto po njihovem obdobju mirovanja.  
Od različice `3.9.2` deluje na shrambi, ki jo vrne `getSharedStore`; v različici `3.9.1` je metoda del tipa, vendar ne naredi ničesar.  
Premikanje tabele, beležke ali skupine tabel, sprememba barve, sprememba velikosti beležke ter pomikanje ali povečava pogleda se vsako zase naredijo kot tok majhnih sprememb. Sprememba velikosti skupine tabel ni taka: pošlje se enkrat, ko se vlečenje konča.  
Shramba vsak tok zbere v en paket in ga zadrži, dokler tok ne miruje 200 ms, v dveh stopnjah. Sprememba barve ali sprememba velikosti beležke prestane obe, zato odide približno 400 ms po zadnji spremembi, kot je veljalo za vsak tok pred različico `5.1.0`. Od različice `5.1.0` vlečenje, pomik ali povečava odide po prvi stopnji, približno 200 ms po zadnjem koraku, kot mesto, kjer se konča (glejte razdelek [Sočasne spremembe](#concurrent-edits)).  
Klic konča to čakanje v obeh stopnjah. Ko je shramba povezana, naročnik prejme paket, preden se klic vrne. Če ni zadržano nič, klic ne pošlje ničesar.  
Metoda `destroy`, bodisi shrambe bodisi urejevalnika, zavrže paket, ki je še zadržan, zato pred njo pokličite flushStreamBuffers, kadar shrambo opustite, drugi urejevalniki pa naj obdržijo zadnjo spremembo, na primer ko se zapre zavihek.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Od različice `5.1.0` vrne kopijo registrov sodelovanja urejevalnika (glejte razdelek [Sočasne spremembe](#concurrent-edits)).  
Kopija je narejena prek JSON, zato je navaden objekt, pripravljen za `JSON.stringify`, sprememba kopije pa registrov shrambe ne spremeni.  
Predajte jo nespremenjeno metodi [mergeLWW](#mergelww) ali [reseed](#reseed) druge shrambe. Njeno obliko določa urejevalnik sam, zato ne berite nobenega njenega polja.  
Preberite jo skupaj z metodo [getVersion](#getversion) in lastnostjo `runtimeValue` urejevalnika v istem trenutku, da [inicializirate udeleženca](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Od različice `5.1.0` registre, ki jih je druga shramba predala z metodo [getLWW](#getlww), prevzame v registre te shrambe, pri čemer za vsak ohrani večjo različico, `version` pa prevzame v uro urejevalnika, ki obdrži večjo od svoje in dane.  
V dokumentu ne spremeni ničesar: ne bajta lastnosti `value` ali `runtimeValue`, ne vnosa razveljavitve in ne dogodka `change`. Samo dvigne različice, ki jih mora preseči poznejši zapis, zato se po njej zapis, starejši od danih registrov, zavrne, naslednja sprememba urejevalnika pa nosi različico, večjo od `version`.  
Ne pošlje ničesar in ne odgovori na nič. To je tisto, kar prvi klic subscribe udeleženca dobi iz odgovora drugih, prevzeto neposredno.  
Pokličite jo po metodi `setInitialValue`, nikoli pred njo: vsak klic `setInitialValue` in vsak klic [reseed](#reseed) zavrže hranjene registre in z njimi tudi to, kar je pred njim prevzel klic `mergeLWW`.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Od različice `5.1.0` vrne najvišjo različico, ki jo je ura urejevalnika združila: največjo med različicami sprememb, ki jih je naredil ali prevzel, zahtev za registre in odgovorov, ki jih izmenja pridružitev, ter vsake vrednosti `version`, dane metodi `mergeLWW` ali `reseed`.  
Kazalci, fokus, izbori in okvirji vlečenja, njegovi ali tuji, je ne premaknejo.  
Predajte jo skupaj z rezultatom metode [getLWW()](#getlww), prebranim v istem trenutku, metodi [mergeLWW](#mergelww) ali [reseed](#reseed) udeleženca. To je [različica](#concurrent-edits) kot tiste, ki jih nosijo njegova dejanja.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Od različice `5.1.0` takoj odstrani kazalec, fokus, izbor in okvir vlečenja, ki jih je poslal urejevalnik z danim identifikatorjem, ter iztek, na katerega je vsak čakal. Tisto, kar so poslali vsi drugi urejevalniki, ostane.  
Identifikator je `meta.editorId`, ki ga nosi vsako dejanje, ki ga pošlje skupna shramba tega urejevalnika. Identifikator, o katerem ta urejevalnik ne hrani ničesar, ne spremeni ničesar.  
Pokličite jo, ko vaš prenos izve, da je udeleženec odšel. Sicer ostane to, kar je poslal, narisano, dokler ne poteče: njegov kazalec 30 sekund po zadnjem prejetem, njegov fokus in izbor 90 sekund po zadnjem, njegov okvir vlečenja pa 3 sekunde po zadnjem.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Od različice `5.1.0` znova odpre dokument seje v urejevalniku, kot to naredi ponovna pridružitev. Vezava [Yjs](./yjs.md) jo pokliče, da odpre dokument sobe, ko se poveže s sobo, ki je bila inicializirana, in znova ob vsaki ponovni pridružitvi, pri čemer ohrani zaslon, ko se je že pridružila sobi.  
Naloži `value`, kot to naredi [setInitialValue](../erd-editor-element.md#setinitialvalue), in prevzame `lww` ter `version`, kot to naredi [mergeLWW](#mergelww), zato shramba nato hrani natanko dane registre, njena ura pa večjo od svoje različice in `version`. Izprazni tudi zgodovino razveljavitev in za razliko od `setInitialValue` zavrže izbor in fokus, saj lahko poimenujeta tisto, česar vrednost ne hrani več.  
Razen spodaj opisane izpeljave fizičnega imena iz logičnega ne naredi vnosa razveljavitve, ne sproži dogodka `change` in ne pošlje nobene spremembe. Ko je shramba že imela naročnika, pošlje zahtevo za registre, ki jo pošlje vsako takšno nalaganje in ki jo prenos, ki je registre že predal, lahko zavrže, ter, ko je [focusTracker](#focustracker) vklopljen, izbor in fokus, ki sta bila počiščena.  
Tako kot metoda `setInitialValue` deluje, tudi ko je nastavljena lastnost [readonly](../erd-editor-element.md#readonly), zavrže način Tok, konča risanje relacije ter zapre urejanje beležke, imena skupine tabel in celice, pri čemer vneseno ohrani ali zavrže na enak način; ime, ki ga zapiranje celice logičnega imena izpelje iz tega, kar je vnesel bralec, je navadna sprememba: pošlje se, mogoče jo je razveljaviti in sproži dogodek `change`.

Brez možnosti `keepScreen` zaslon prikazuje to, kar hrani vrednost, kot po `setInitialValue`. Z `keepScreen: true` se zaslon bralca položi nazaj čez naloženi dokument, in sicer samo na tem zaslonu:

- položaj pomika in stopnja povečave, ko ju je element že prikazal; element, ki ju še nikoli ni prikazal ali je bil naložen skrit in od tedaj ni bil prikazan, se odpre tam, kamor ga postavi vrednost, kot pri udeležencu, ki se pridruži pozneje;
- zavihek, če ga je nalaganje premaknilo, na zavihku Nastavitve pa tudi zavihek, s katerega je bralec prišel in ki ga navaja zaklep `Canvas Type`, vklopljen tam;
- prikaz imen in vsaka nastavitev generatorja kode, ki jo je bralec pod svojim zaklepom prikazoval po svoje, a samo kadar je bil ta zaklep vklopljen že pred nalaganjem, je vklopljen tudi po njem in hrani isto zaklenjeno vrednost. Če je torej udeleženec medtem nastavitev odklenil, spremenil in znova zaklenil z drugo vrednostjo, se urejevalnik odpre z novo zaklenjeno vrednostjo, kjer pa je zaklep pred nalaganjem ali po njem izklopljen, prikazuje naloženo vrednost;
- vsaka nastavitev, ki jo je bralec samo za branje spremenil na svojem zaslonu, ne glede na zaklepe.

Nič od tega se ne pošlje, `value` in `runtimeValue` pa še vedno poročata o naloženem dokumentu. Poznejši odklep udeleženca nadomesti nastavitev kode, ohranjeno na ta način, kot vsak odklep.  
Če urejevalnik lahko ureja, bralčev naslednji pomik ali povečava ohranjeni položaj pomika in stopnjo povečave spet prenese v dokument in odide tako, da ga uvede položaj, na katerem stoji zaslon, zato tudi replike prevzamejo to povečavo.

Metoda `reseed` pusti to, kar shramba zadržuje, kot je. Vlečenje, pomik ali povečava, ki se še zadržujejo, odide za njo, prebrano iz ponovno inicializiranega dokumenta; sprememba barve ali sprememba velikosti beležke odide, kot je bila narejena, čeprav je urejevalnik ne prikazuje več; to, kar je zadržal `disconnect()`, pa odide ob `connection()`.  
Zato najprej pokličite [flushStreamBuffers](#flushstreambuffers), pošljite, kar odda, nato pa pokličite `reseed` z vrednostjo, ki to vsebuje. Metode `reseed` nikoli ne kličite, ko je povezava prekinjena.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Popolnoma uniči primerek sharedStore.  
Urejevalnika samega se ne dotakne, zato je dokument po izstopu iz seje še vedno mogoče urejati.  
Sledilnika miške in fokusa se ustavita, ko se uniči zadnji primerek sharedStore, ki ga je urejevalnik vrnil.  
Paket toka, ki ga shramba še zadržuje, se zavrže skupaj z njo; da ga pošljete, najprej pokličite [flushStreamBuffers](#flushstreambuffers).  
Kazalci, fokus, izbori in okvirji vlečenja, ki so jih poslali drugi urejevalniki, ostanejo narisani, dokler ne potečejo; od različice `5.1.0` jih [forgetPeer](#forgetpeer) za en urejevalnik odstrani takoj.

```js
sharedStore.destroy();
```
