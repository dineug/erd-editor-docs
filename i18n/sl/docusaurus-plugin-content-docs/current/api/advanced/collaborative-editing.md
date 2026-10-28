---
sidebar_position: 1
description: Posredovanje sprememb urejevalnika med primerki z getSharedStore, inicializacija urejevalnika, ki se pridruži, iz runtimeValue ter prikaz kazalca, fokusa, izbora in okvira vlečenja vsakega sodelavca.
---

# Sodelovalno urejanje

Metoda `getSharedStore()` urejevalnik spremeni v vozlišče sodelovalne seje.  
Vsako spremembo odda kot tok dejanj in uporabi dejanja, ki mu jih pošljejo drugi urejevalniki – prenos med njimi (WebSocket, WebRTC ali kar koli drugega, kar lahko prenaša JSON) zagotovite sami.  
Je ena od metod elementa [ErdEditorElement](../erd-editor-element.md) in se dopolnjuje z [oddaljeno shrambo](./remote-storage.md), kadar je treba posredovane spremembe tudi shraniti.

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

Dejanje je navaden objekt, ki ga je mogoče serializirati in ki opisuje eno spremembo dokumenta, zato na poti do prenosa prestane `JSON.stringify`.  
Dejanja prihajajo v paketih: metoda `subscribe` vam preda polje in to polje je ena enota – posredujte ga v celoti in ga v celoti odpošljite tudi na drugi strani.  
Dejanje obravnavajte kot neprozoren objekt in ga posredujte nespremenjenega, namesto da bi ga brali ali prepisovali, saj prav evidenčni podatki, ki jih nosi, ohranjajo urejevalnike usklajene.

Nekaj tega, kar naredi urejevalnik, ostane samo v tem urejevalniku.  
Postavitev tabele, beležke ali skupine tabel v ospredje, kot se zgodi ob njenem izboru, se ne pošlje.  
Prav tako se ne pošljejo izbire `Statements`, `Header`, `Write logical names into empty comments` (od različice `4.2.0`) in `Tables` na zavihku [Shema SQL](../../guide/guides/schema-sql.md), ki pripadajo oknu, v katerem se izberejo.  
Od različice `4.1.0` tudi [raziskovalec](../../guide/guides/explorer.md) ostane v svojem urejevalniku: ali je odprt, njegova širina, strnjene vrstice, vrstica s fokusom tipkovnice, položaj pomika drevesa ter iskanje in možnosti se ne pošljejo.  
Prav tako se ne pošlje [osvetlitev](../../guide/guides/relationship-editing.md#reading-a-connector), ki jo prehod na tuji ključ prižge na povezovalni črti njegove relacije.  
Od različice `4.2.0` tudi zavihek [Slovar](../../guide/guides/dictionary.md) ostane v svojem urejevalniku: kateri list je prikazan ter iskanje, izbor, položaj pomika in širine stolpcev vsakega lista se ne pošljejo. Njegove spremembe, razvrščanja in uvozi CSV pa se pošljejo.  
Pomik, povečava ali preklop zavihka se pošlje, vendar nikoli ne premakne pogleda drugega uporabnika in ne zamenja njegovega zavihka. To velja tudi za pomik, ki ga izvede skok iz raziskovalca, za preklop na zavihek ERD, ko se raziskovalec odpre z drugega zavihka, ter za preklop zavihka in pomik ob skoku z lista [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) na zavihku Slovar na tabelo ali stolpec. Skok s tega lista na besedo, izraz ali domeno ostane na zavihku Slovar, zato se od njega ne pošlje nič.

Od različice `4.2.0` se pošlje tudi preklop [prikaza imen](../../guide/guides/logical-names.md#switching-the-view), o tem, kaj z njim naredijo drugi urejevalniki, pa odloča njegov [zaklep](../../guide/guides/settings.md#lock). Zaklep `Name View` je vklopljen v novem diagramu in v vsakem dokumentu izpred različice `4.2.0`.  
Dokler je zaklep vklopljen, se preklop pokaže samo v urejevalniku, v katerem je bil opravljen: še vedno se pošlje, vendar ga vsi drugi urejevalniki in vse replike zavržejo, zato lahko vsak uporabnik gleda drug prikaz, lastnost `value` pa ohrani zaklenjenega. Sprememba jezika, zapisa imen ali vrste narekovajev je drugačna: doseže vse urejevalnike ne glede na to, ali je njen zaklep vklopljen.  
Dokler je zaklep izklopljen, preklop v urejevalniku, ki lahko ureja, spremeni prikaz imen v vseh urejevalnikih in replikah, pri čemer obvelja zadnji preklop, vsi pa ga tudi shranijo.  
Lastni preklop urejevalnika samo za branje vedno ostane v tem urejevalniku, ta pa še vedno sledi skupnim preklopom drugih.

Od različice `5.0.0` urejevalnik [samo za branje](../erd-editor-element.md#readonly) sploh ne pošilja sprememb. Pomik, povečava, zavihek, prikaz imen, zbirka podatkov, jezik generatorja kode, zapisi imen, vrsta narekovajev in vrstice `View Option`, ki jih spremeni njegov bralec, ostanejo na njegovem zaslonu, ne glede na njihove zaklepe; pred različico `5.0.0` so se njegovi pomiki, povečave, preklopi zavihkov, zbirka podatkov in nastavitve kode pošiljali kot pri urejevalniku, ki ga je mogoče urejati.  
Njegova shramba še vedno pošilja, kar pošiljajo njeni sledilniki kazalca, fokusa, izbire in okvirja za vlečenje bralca, odgovarja na registre, ki jih zahteva urejevalnik, ki se pridruži, in uveljavi vsako spremembo, ki jo pošljejo drugi. Sprememba zbirke podatkov, nastavitve generatorja kode ali vrstice `View Option` doseže njegov dokument, in njegov zaslon, razen če je njegov bralec to nastavitev tam spremenil, skupni preklop prikaza imen pa se na njegovem zaslonu pokaže v vsakem primeru.  
Ko urejevalnik postane samo za branje, najprej pošlje, kar shramba še zadržuje od vlečenja ali pomika, kot to naredi [flushStreamBuffers](#flushstreambuffers), da drugi obdržijo zadnji del.

[Zaklepi](../../guide/guides/settings.md#lock) so skupni: v vseh urejevalnikih obvelja zadnje zaklepanje ali odklepanje nastavitve, zaklep pa nosi vrednosti urejevalnika, ki ga je vklopil, zato vsi urejevalniki in replike shranijo isto vrednost.  
Zaklep `Viewport` zato shrani pogled urejevalnika, ki ga je vklopil, zaklep `Canvas Type` pa zadnji zavihek, na katerem je bil ta urejevalnik pred zavihkom Nastavitve, kjer se zaklepi vklapljajo.  
Izklop zaklepa `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ali od različice `4.2.0` zaklepa `Name View` to nastavitev v vseh urejevalnikih postavi tudi na vrednost, prikazano v urejevalniku, ki ga je izklopil, tako da vsi še naprej shranjujejo eno samo vrednost. Izklop zaklepa `Viewport` ali `Canvas Type` nikomur ne premakne pogleda in ne zamenja zavihka.

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
Od različice `4.0.0` tudi zavrže registre sodelovanja urejevalnika, ki razrešujejo sočasne spremembe. Če je skupna shramba urejevalnika že imela naročnika, shramba druge urejevalnike znova zaprosi za njihove, kot ob prvem klicu [subscribe](#subscribe), tako da urejevalnik, ki se sredi seje znova naloži, spremembe razrešuje enako kot drugi.  
Prirejanje vrednosti lastnosti `value` registre ohrani, vendar se v nasprotju z metodo `setInitialValue` posreduje: brž ko ima urejevalnik skupno shrambo, vsak urejevalnik v seji naloži prirejeni dokument, zato novega udeleženca nikoli ne inicializirajte na ta način.

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

Urejevalnik izdaje pred različico `4.0.0` nove vrste dejanj prezre: nikoli ne vidi skupine tabel ali tega, katere tabele so v njej, čeprav vlečenje skupine v njem še vedno premakne tabele v skupini, saj pošlje tudi njihovo dejanje `table.move`.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Naroči se na spremembe v urejevalniku.  
Dokler ni vsaj enega naročnika, nič ne zapusti urejevalnika, spremembe, narejene pred tem, pa se zadržijo v medpomnilniku.  
Prvi klic subscribe druge urejevalnike tudi zaprosi za njihove registre sodelovanja, ki razrešujejo sočasne spremembe, tako da jih tudi udeleženec, ki se pridruži pozneje, razrešuje na enak način.  
Dokumenta ne prinese, zato udeleženca, ki se pridruži pozneje, najprej [inicializirajte](#seeding-a-collaborator).  
Od različice `4.0.0` shramba znova zaprosi vsakič, ko metoda `setInitialValue` po tem prvem klicu subscribe naloži dokument v njen urejevalnik.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Pakete toka, ki jih ta shramba še zadržuje, pošlje takoj, namesto po njihovem obdobju mirovanja.  
Od različice `3.9.2` deluje na shrambi, ki jo vrne `getSharedStore`; v različici `3.9.1` je metoda del tipa, vendar ne naredi ničesar.  
Premikanje tabele, beležke ali skupine tabel, sprememba barve, sprememba velikosti beležke ter pomikanje ali povečava pogleda prispejo kot tok majhnih sprememb, vsako zase. Sprememba velikosti skupine tabel ne: pošlje se enkrat, ko se vlečenje konča.  
Shramba vsak tok zbere v en paket in ga zadrži, dokler tok ne miruje 200 ms. To naredi v dveh stopnjah, zato paket odide približno 400 ms po zadnji spremembi.  
Klic konča to čakanje v obeh stopnjah. Ko je shramba povezana, naročnik prejme paket, preden se klic vrne. Če ni zadržano nič, klic ne pošlje ničesar.  
Metoda `destroy`, bodisi shrambe bodisi urejevalnika, zavrže paket, ki je še zadržan, zato pred njo pokličite flushStreamBuffers, kadar shrambo opustite, drugi urejevalniki pa naj obdržijo zadnjo spremembo, na primer ko se zapre zavihek.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Popolnoma uniči primerek sharedStore.  
Urejevalnika samega se ne dotakne, zato je dokument po izstopu iz seje še vedno mogoče urejati.  
Sledilnika miške in fokusa se ustavita, ko se uniči zadnji primerek sharedStore, ki ga je urejevalnik vrnil.  
Paket toka, ki ga shramba še zadržuje, se zavrže skupaj z njo; da ga pošljete, najprej pokličite [flushStreamBuffers](#flushstreambuffers).

```js
sharedStore.destroy();
```
