---
sidebar_position: 1
description: Namestite @dineug/erd-editor iz npm ali CDN, registrirajte elementa urejevalnika in pregledovalnika, povežite pogovorna okna za datoteke in nadgradite z različice 4.x ali 3.x.
---

# Namestitev

```sh
npm install @dineug/erd-editor
```

Paket je izključno ESM (`"type": "module"`) in vsebuje samo mapo `dist`.
Gradnje za CommonJS ni, zato klic `require('@dineug/erd-editor')` ne deluje.

Vsebuje dva elementa po meri: `<erd-editor>`, urejevalnik, in od različice `5.0.0` `<erd-viewer>`, ki prikaže diagram samo za branje – glejte [ErdViewerElement](./erd-viewer-element.md).
Od različice `5.0.0` uvoz korena paketa ne definira nobenega. Vsak element ima lastno vstopno točko, ki ga definira – glejte razdelek [Registracija elementov](#registering-the-elements).

Njegove odvisnosti za izvajanje ostanejo zunanje, kot goli uvozi, ki jih vaš združevalnik razreši, odpravi njihova podvajanja in iz njih izloči neuporabljeno kodo. Od različice `5.0.0` njegova mapa `dist` vsebuje eno datoteko na modul, zato združevalnik obdrži samo module, ki jih stran doseže – glejte razdelek [Vstopne točke](#entry-points).
Njegove delovne niti shared worker se zapišejo kot ločene vstopne datoteke v mapi `dist/workers/` in se ustvarijo z `new URL('./…', import.meta.url)`, kar je zapis, ki ga Vite, webpack 5 in Rspack združijo kot vstopno točko delovne niti. Glejte razdelek [Web Workers](#web-workers).
Za stran brez združevalnika obstajata dve samostojni gradnji – glejte razdelek [Oznaka script](#script-tag).

## Uporaba {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` definira `<erd-editor>` ob uvozu. Stran, ki samo prikazuje diagram, namesto tega uvozi `@dineug/erd-editor/erd-viewer.js` – glejte [ErdViewerElement](./erd-viewer-element.md).

Element `<erd-editor>` nima lastne velikosti. Določite mu (ali njegovemu vsebniku) izrecno širino in višino.
Od različice `4.1.0` se odprt [raziskovalec](../guide/guides/explorer.md) zasidra v elementu levo od platna ERD in platno zoži, namesto da bi ga prekril. Nov urejevalnik se zažene z zaprtim raziskovalcem.
Plošča se nikoli ne izriše ožja od `200px` in platnu pusti vsaj `320px`, zato se v elementu, ožjem od `520px`, odprt raziskovalec ne izriše, dokler se element ne razširi – glejte razdelek [Ob platnu](../guide/guides/explorer.md#beside-the-canvas).

Klic `setInitialValue('')` začne nov, prazen dokument. Če pa lastnosti `value` priredite vrednost, se dokument naloži kot sprememba, zato se zapiše v zgodovino razveljavitev.
Od različice `4.0.0` je lastnost `editor.value` dokument v obliki, v kateri ga hrani datoteka, in prav to shranjujte. Lastnost `editor.runtimeValue` je dokument, kot ga hrani urejevalnik, vključno z odstranjenimi entitetami: služi za inicializacijo sodelavca in se nikoli ne zapiše v datoteko – glejte razdelek [runtimeValue](./erd-editor-element.md#runtimevalue).
Od različice `4.0.0` ima nov dokument vklopljene tudi vse [zaklepe nastavitev](../guide/guides/settings.md#lock): vidno območje, zavihek, jezik generatorja kode, oba zapisa imen, vrsto narekovajev in od različice `4.2.0` [prikaz imen](../guide/guides/logical-names.md#name-view). Pomikanje, povečava, preklapljanje zavihkov, preklapljanje prikaza imen ali sprememba katere od drugih nastavitev pusti lastnost `editor.value` nespremenjeno in ne sproži dogodka `change`. Dokument, naložen iz besedila, ohrani zaklepe, ki jih navaja. Dokument, ki ne navaja nobenega, na primer vsaka datoteka, shranjena pred različico `4.0.0`, se odpre z vsemi vklopljenimi zaklepi, pri povečavi 100 % in na zavihku ERD, ne glede na vidno območje in zavihek, ki ju je shranil. Njegovo vidno območje je zaklenjeno na izhodišče `0, 0`, pogled pa se namesto tega odpre na diagramu, če tam ni izrisan noben del diagrama – glejte razdelek [setInitialValue](./erd-editor-element.md#setinitialvalue).
Datoteka, shranjena pred različico `4.2.0`, se odpre s prikazom imen, zaklenjenim na `Physical Names`, tudi datoteka, v kateri so vsi drugi zaklepi izklopljeni. Urejevalnik različice `4.0.0` ali `4.1.0` zaklep prikaza imen ob shranjevanju ohrani takšen, kot je, prikaz pa izpusti, zato datoteka različice `4.2.0`, shranjena z odklenjenim prikazom imen, ostane odklenjena, vendar se znova odpre v prikazu `Physical Names`.
Za preostali API glejte stran [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

Storitev `esm.run` namesto vas razreši zunanje odvisnosti paketa, zato to deluje brez združevalnika.
Do vsake vstopne točke pridete s potjo za različico: `…/erd-editor.js` definira urejevalnik, `…/erd-viewer.js` pa pregledovalnik, ki vsak jezik prikaza razen angleščine pridobi iz CDN, ko ga stran zahteva. Goli URL paketa, `https://esm.run/@dineug/erd-editor@5.0.0`, vrne koren, ki ne definira nobenega elementa.
URL brez različice vedno vrne najnovejšo izdajo. Fiksirajte različico, kot zgoraj, če ne želite, da bi nadgradnja na novo glavno različico nenapovedano dosegla vašo stran.
Tudi različica `5.0.0` je taka nadgradnja: stran, ki mora ostati na različici 4.x, fiksira `@4.2.0` – glejte razdelek [Nadgradnja z različice 4.x](#upgrading-from-4x).

Storitev `esm.run` streže delovne niti shared worker z `cdn.jsdelivr.net`, brskalnik pa ne zažene delovne niti shared worker z drugega izvora, kot je izvor strani. Zato urejevalnik, naložen tako, deluje brez svojih delovnih niti, kot na gostitelju, ki jih blokira – glejte razdelek [Web Workers](#web-workers). Gradnja z [oznako script](#script-tag) jih nosi v svoji datoteki.

### Oznaka script {#script-tag}

Od različice `3.6.0` paket vsebuje tudi gradnjo UMD, ki ima vse odvisnosti in vse delovne niti shared worker v eni datoteki, `dist/erd-editor.umd.js`.
Nanjo kažeta polji `unpkg` in `jsdelivr`, zato jo vrne goli URL paketa na katerem koli od obeh omrežij CDN, gradnja pa definira objekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Ko se naloži, definira `<erd-editor>`. Objekt `window.ErdEditor` vsebuje oba povratna klica za datoteke, `ErdEditor.setExportFileCallback` in `ErdEditor.setImportFileCallback`, od različice `3.9.2` `ErdEditor.createKeyBindingMap`, od različice `4.2.0` `ErdEditor.dictionaryRowChords` – glejte razdelek [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) – in od različice `5.0.0` `ErdEditor.ErdEditorElement` ter `ErdEditor.defineErdEditor` – glejte razdelek [Registracija elementov](#registering-the-elements). Ne vsebuje funkcije [toImage](./to-image.md).

Od različice `5.0.0` druga datoteka, `dist/erd-viewer.umd.js`, definira `<erd-viewer>` in da `ErdViewerElement` ter `defineErdViewer` na `window.ErdViewer`. Ne zažene nobene delovne niti, vsebuje vseh 25 jezikov prikaza in ne zahteva ničesar razen `src`, ki ga dobi.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Nobena datoteka ne definira oznake druge, vsaka pa na strani ne pusti nobenega globalnega objekta razen svojega in `window.Konva`.
Preslikava izvozov še vedno usmerja združevalnik na module ES, zato namestitev iz npm nobene od datotek nikoli ne uporabi.
Stran, ki ne more naložiti lastne skripte, lahko namesto tega vstavi gostovani pregledovalnik na erd-editor.io/embed – glejte razdelek [Vdelava](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Od različice `4.0.0` atribut `enable-locale-picker` doda izbirnik `Display Language` v orodni vrstici, atribut `enable-welcome-screen` pa pozdravni zaslon, ki ga prikaže prazen diagram – glejte razdelka [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) in [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Stran, ki naloži dokument, kot to stori primer v razdelku [Uporaba](#usage), vklopi lastnost `enableWelcomeScreen` šele, ko ga je naložila metoda `setInitialValue()`, in ne že v oznakah HTML, zato se zaslon nikoli ne pokaže za hip čez datoteko, ki se še nalaga.
Urejevalnik vsebuje vseh 25 jezikov prikaza, tako v gradnji ES kot v gradnji za oznako script, zato ni jezikovne datoteke, ki bi jo bilo treba streči, in ničesar ni treba registrirati. Brez izbirnika in brez klica `setLocale()` urejevalnik prikazuje angleščino.

Atribut `readonly`, dodan tukaj, odpre urejevalnik kot bralnik: prirejanje vrednosti lastnosti `value`, klic `clear()` in vsak klic `setSchema*()` – vključno z metodo `setSchemaJSON()` in dodajanjem – se prezrejo, dogodek `change` pa se nikoli ne sproži. Njegovi zavihki, raziskovalec in hitro iskanje ostanejo za branje, vsak kontrolnik, ki bi urejal diagram, pa je odstranjen.
Branje lastnosti `editor.value` in `editor.runtimeValue` še vedno deluje, obe pa ohranita dokumentove lastne nastavitve: nastavitev pogleda, ki jo bralec spremeni, na primer povečava ali zbirka podatkov, ostane na zaslonu tega urejevalnika. Namesto tega dokument naložite z metodo `setInitialValue()` – glejte [readonly](./erd-editor-element.md#readonly).

### Upodabljanje na strežniku {#server-side-rendering}

Vsaka vstopna točka razen `engine.js` in `peer.js` potrebuje DOM, zato v okolju Node vrže napako. `erd-editor.js` in `erd-viewer.js` definirata svoj element na ravni modula, koren paketa, ki od različice `5.0.0` ne definira ničesar, pa ob nalaganju še vedno zgradi oba razreda elementov.
V ogrodjih Next.js, Nuxt, SvelteKit ali Astro vstopno točko elementa uvozite iz kode, ki se izvaja samo v odjemalcu, imenovan uvoz iz korena, na primer `setExportFileCallback` ali `toImage`, pa iz iste kode.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

V razvoju dodajte paket ELK, ki ga uvozi postavitvena delovna nit urejevalnika, v vnaprejšnje združevanje Vite, sicer postavitve te delovne niti spodletijo: `Flow`, `Tree - vertical` in `Tree - horizontal` funkcije Auto Layout, način Tok na zavihku Vizualizacija in uvoz, umeščen s funkcijo Flow.
Vite 7 in starejši potrebujejo tudi urejevalnik, izločen iz vnaprejšnjega združevanja, saj njihov vnaprej združeni paket usmeri URL-je delovnih niti na datoteke, ki jih nikoli ne zapiše, zato spodletijo vse tri delovne niti. Na Vite 8 ta `exclude` izpustite, kar samo povzroči, da razvojni strežnik pridobi vsako datoteko paketa posebej. Produkcijska gradnja ne potrebuje nobenega od obeh.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Uvoz `@dineug/erd-editor/erd-editor.js` združi `erd-editor` v vmesnik `HTMLElementTagNameMap`, `@dineug/erd-editor/erd-viewer.js` pa `erd-viewer`, zato je element tipiziran brez pretvorbe tipa. Vsak uvoz iz korena, tudi samo tipa, prinese oba.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Tip `ErdEditorElement` se izvaža za označevanje tipov vaših spremenljivk in lastnosti. Od različice `5.0.0` je tudi razred elementa, `ErdViewerElement` pa je vmesnik in razred pregledovalnika – glejte razdelek [Registracija elementov](#registering-the-elements).
Od različice `4.0.0` paket izvaža tudi tipe `LocaleCode`, `LocaleOption` in `SchemaSQLOptions`, od različice `5.0.0` pa `ToImageOptions` – glejte razdelek [Vstopne točke](#entry-points). Možnosti, ki jih sprejemajo metode `setSchema*()`, nimajo izvoženega imena; izpeljite jih iz elementa, kot `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Od različice `5.0.0` polje `typesVersions` v paketu tipizira tudi vsako vstopno točko podpoti pri `moduleResolution: "node10"`, ki ne bere preslikave izvozov.

## Registracija elementov {#registering-the-elements}

Od različice `5.0.0` paket definira oznako samo tam, kjer jo stran zahteva.

| Uvoz | Definira |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nič |

Vsaka od obeh vstopnih točk definira svojo oznako, ko se ovrednoti, in ničesar ne izvaža, zato se uvozi zaradi učinka, nobena pa ne definira oznake druge.
Koren izvaža oba razreda elementov, `ErdEditorElement` in `ErdViewerElement`, ter `defineErdEditor()` in `defineErdViewer()`, ki definirata svojo oznako tam, kjer ju pokličete:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Klic ne naredi ničesar, dokler oznaka že vsebuje ta razred, zato se vstopna točka in klic define ali dva klica define lahko srečata na isti strani. Vrže `Error` z imenom oznake, kadar jo vsebuje drug razred, kot bi ga povzročila druga kopija paketa, zbrana na isto stran: `Another element class already defines the custom element name erd-editor`.
Razreda korena sta tista, ki ju definirata vstopni točki, zato velja `customElements.get('erd-editor') === ErdEditorElement`, ko se ena od njiju izvede. Dokler oznaka ni definirana, `document.createElement('erd-editor')` ustvari navaden `HTMLElement` brez članov urejevalnika, `new ErdEditorElement()` pa vrže napako.

Za lastno oznako razred definirajte pod njo sami in oznako sami dodajte v `HTMLElementTagNameMap`. To storite v oknu, ki ne naloži ne vstopne točke tega elementa ne njegove gradnje z [oznako script](#script-tag) in zanj ne pokliče nobene funkcije define, saj razred v oknu dobi eno ime:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Paket, ki vsebuje oba elementa, povzroči, da Vite in Rolldown opozorita na `INEFFECTIVE_DYNAMIC_IMPORT`, enkrat za vsak jezik prikaza razen angleščine. Pregledovalnik vsakega od njih naloži z lastnim `import()`, urejevalnik pa uvozi vse slovarje naenkrat, zato ostanejo v kosu urejevalnika in se naložijo z njim. Nič ne spodleti, paket samo s pregledovalnikom pa vsak jezik hrani v lastnem kosu.

## Označevanje sintakse {#syntax-highlighting}

Sintakso na ploščah Shema SQL in Generator kode označuje [Shiki](https://shiki.style) v svoji lastni delovni niti shared worker, od različice `4.0.0` pa tudi v skriptih `Before tables` in `After tables` na zavihku Shema SQL.
Od različice `3.7.0` ni treba ničesar namestiti in ničesar registrirati: delovna nit se ustvari ob prvem izrisu plošče s kodo, zato stran, ki nobene ne odpre, slovnic nikoli ne prenese.

| | |
| --- | --- |
| Jeziki | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teme | `github-dark` in `github-light`, glede na svetli ali temni videz urejevalnika |

To so natanko jeziki, ki jih ustvarjata plošči: `JPA` se označi kot Java, `SQLAlchemy` kot Python, `TypeORM`, `Sequelize`, `Drizzle` in `Zod` kot TypeScript, `Doctrine` kot PHP, `SeaORM` kot Rust, `JSON Schema` kot JSON, `DBML` in `AML` pa kot SQL, najbližja slovnica v paketu – glejte stran [Generator kode](../guide/guides/code-generator.md).

Pogon za regularne izraze je čista koda JavaScript, zato nobenemu pravilniku gostitelja ni treba dovoliti `wasm-unsafe-eval`.
Kjer vmesnik `SharedWorker` ni na voljo – Chrome v sistemu Android pred različico Chrome 148, Safari pred različico 16.4 –, se napaka zabeleži, koda pa se prikaže kot navadno besedilo; skripte je še vedno mogoče urejati.

Nadgradnja z različice `3.6.0` ali starejše: paket `@dineug/erd-editor-shiki-worker` se ne objavlja več, z njim pa je izginila tudi funkcija `setGetShikiServiceCallback`.
Odstranite namestitev in registracijo; stran, ki je delovno nit nalagala iz CDN, odstrani tudi to drugo oznako `<script>`.

## Web Workers {#web-workers}

Urejevalnik v delovnih nitih `SharedWorker` izvaja tri opravila: označevanje sintakse, izvoz slike in postavitev tabel, ki poganja [samodejno postavitev](../guide/guides/table-related-functions.md#auto-layout), [način Tok](../guide/guides/visualization.md#how-flow-is-placed) na zavihku Vizualizacija in od različice `4.0.0` tudi razporeditev uvožene sheme.
Vse tri so vključene v paket `@dineug/erd-editor`. Nobene od njih vam ni treba nastaviti, vendar lahko vsako od njih gostitelj blokira.
Od različice `5.0.0` je vsaka delovna nit zgrajena v lastnem modulu, zato paket nosi samo delovne niti, ki jih njegovi moduli dosežejo: paket funkcije [toImage](./to-image.md) brez elementa nosi samo delovno nit za izvoz slik, `<erd-viewer>` pa ne zažene nobene – glejte razdelek [Vstopne točke](#entry-points).
Različica `4.0.0` je odstranila delovno nit, ki je izvajala zbiranje smeti dokumenta, skupaj s samim zbiranjem smeti.

| Delovna nit | Brez nje |
| --- | --- |
| Označevanje sintakse | Plošči Shema SQL in Generator kode ter skripti na zavihku Shema SQL ostanejo navadno besedilo |
| Izvoz slike | PNG, SVG, `Copy to clipboard`, predogled okna `Export image` in od različice `5.0.0` [toImage()](./to-image.md) se izrišejo v glavni niti, kar med izrisovanjem blokira stran |
| Postavitev tabel | Postavitve `Flow`, `Tree - vertical` in `Tree - horizontal` v samodejni postavitvi ter način Tok na zavihku Vizualizacija se končajo s sporočilom `Could not place tables`; uvoz, ki ga razporedi postavitev Tok – datoteka SQL, GraphQL, DBML ali AML iz ukaza `Import` ali `Import and Add` ali klic `setSchema*()` z možnostjo `placement: 'auto'` –, tabele brez sporočila postavi v vrstice; na postavitev `Force` in način Graf to ne vpliva, ker se izvajata v urejevalniku |

Izvoz slike deset sekund čaka na odgovor svoje delovne niti in nato riše v glavni niti, označevanje sintakse pa kodo pusti kot navadno besedilo takoj, ko njegova delovna nit odpove, zato gostitelj, ki blokira delovne niti, poslabša zmogljivost, ne pa delovanja.
Izjema je postavitev tabel: pogon, ki izračuna postavitev, je večji od samega urejevalnika in se nikoli ne naloži v isti proces, zato ob prvi razporeditvi na svojo delovno nit čaka trideset sekund, ko pa delovna nit enkrat odgovori, postavitvi da šestdeset sekund, da se vrne.
Če kateri koli od obeh čakalnih časov poteče, se razporeditev konča tako kot brez delovne niti. Samodejna postavitev prikaže sporočilo `Placing tables` takoj, ko se začne, način Tok in uvoz, ki ga razporedi postavitev Tok, pa ga prikažeta šele, ko razporeditev, vključno z zagonom njene delovne niti, teče že šest sekund.

Vite, webpack 5 in Rspack delovne niti oddajo kot datoteke ob vaših kosih. esbuild in Rolldown, uporabljen sam in ne prek Vite, ne oddata nobene, zato stran, ki ju zgradita, teče brez delovnih niti.
Pri eksperimentalni nastavitvi webpack `experiments.outputModule` se ne zažene nobena delovna nit, saj vsaka čaka na kos, odcepljen od nje, ki ga nič ne naloži. Obdržite privzeti izhod webpack ali nastavite `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Stran s strogim pravilnikom Content Security Policy za elementa potrebuje te direktive:

- `worker-src 'self'` za gradnjo z združevalnikom, katere delovne niti so datoteke ob paketu, in še `blob:`, kjer vaš združevalnik delovno nit vgradi neposredno v kodo. V gradnji za [oznako script](#script-tag) so vse tri vgrajene v datoteko kot naslovi URL `data:`, zato ta stran namesto tega potrebuje `worker-src data:`. `<erd-viewer>` ne potrebuje nobenega, saj ne zažene nobene delovne niti.
- Od različice `5.0.0` oba elementa oblikujeta sebe s sestavljenimi slogovnimi listi, ki jih `style-src 'self'` spusti skozi. Plošči s kodo urejevalnika še vedno obarvata besedilo z atributi `style`, predogled okna `Export image` pa je slika na naslovu URL `blob:`, zato urejevalnik zanju potrebuje tudi `style-src 'unsafe-inline'` in `img-src blob:`.
- Brskalnik brez sestavljenih slogovnih listov, na primer Firefox pred različico 101, dobi elemente `<style>`, ki za kateri koli element potrebujejo `style-src 'unsafe-inline'`.
- `<erd-viewer>` pridobi svoj `src`, zato ta izvor sodi v `connect-src` – glejte razdelek [Kaj doda strani](./erd-viewer-element.md#what-it-adds-to-a-page).

## Vstopne točke {#entry-points}

Paket ima pet vstopnih točk:

| Vstopna točka | Kaj je |
| --- | --- |
| `@dineug/erd-editor` | Koren: spodnji izvozi. Od različice `5.0.0` ne definira nobenega elementa, čeprav za nalaganje še vedno potrebuje DOM |
| `@dineug/erd-editor/erd-editor.js` | Od različice `5.0.0`. Definira `<erd-editor>` in ničesar ne izvaža |
| `@dineug/erd-editor/erd-viewer.js` | Od različice `5.0.0`. Definira `<erd-viewer>` in ničesar ne izvaža |
| `@dineug/erd-editor/engine.js` | Shramba dokumenta brez DOM |
| `@dineug/erd-editor/peer.js` | Od različice `3.9.1`. Udeleženec brez vmesnika strežnika MCP |

Koren izvaža oba razreda elementov in njuni funkciji define, dve funkciji za nastavljanje povratnih klicev, od različice `3.9.2` privzete dodelitve tipk z njihovimi tipi, od različice `4.0.0` tipe za jezik prikaza in tip možnosti metode `getSchemaSQL()`, od različice `4.2.0` kombinacije tipk za vrstice na zavihku Slovar, od različice `5.0.0` pa `toImage`.

| Izvoz | Opis |
| --- | --- |
| `ErdEditorElement` | Vmesnik elementa – glejte stran [ErdEditorElement](./erd-editor-element.md). Od različice `5.0.0` tudi njegov razred, tisti, kot katerega je definiran `<erd-editor>` – glejte razdelek [Registracija elementov](#registering-the-elements). |
| `ErdViewerElement` | Od različice `5.0.0`. Vmesnik in razred pregledovalnika – glejte stran [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | Od različice `5.0.0`. Definirata `<erd-editor>` ali `<erd-viewer>` kot njegov razred. Klic ne naredi ničesar, dokler oznaka vsebuje ta razred, in vrže `Error`, kadar jo vsebuje drug razred – glejte razdelek [Registracija elementov](#registering-the-elements). |
| `toImage(value, options)` | Od različice `5.0.0`. Nariše dokument kot `Blob` PNG ali niz SVG z možnostmi okna `Export image` – glejte stran [toImage](./to-image.md). |
| `ToImageOptions` (tip) | Od različice `5.0.0`. Možnosti, ki jih sprejme `toImage()`: `format`, `background`, `darkMode` in `scale`. |
| `setExportFileCallback(cb)` | Nadomesti prenos v brskalniku, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nadomesti izbirnik datotek v brskalniku, `({ type, op, accept, mode }) => void`; `mode` od različice `4.0.0`. Od različice `4.2.0` ukaz `Import CSV` na zavihku Slovar odpre izbirnik datotek brskalnika, tudi kadar je povratni klic nastavljen – glejte razdelek [Pogovorna okna za datoteke](#file-dialogs). |
| `createKeyBindingMap()` | Ob vsakem klicu vrne privzete dodelitve tipk kot nov objekt `KeyBindingMap` – glejte razdelek [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipi) | Preslikava dodelitev, unija imen njenih ukazov in ena dodelitev. |
| `dictionaryRowChords(map)` | Od različice `4.2.0`. Ob vsakem klicu kot novo polje `ShortcutOption[]` vrne kombinacije tipk, s katerimi mreža na zavihku [Slovar](../guide/guides/dictionary.md#adding-and-deleting-rows) vstavlja in briše vrstice pri objektu `KeyBindingMap`, ki ga podate. Kombinacija, ki vstavi vrstice nad izbor, s privzetimi dodelitvami `Alt+Shift+Enter`, ni v nobeni dodelitvi – glejte razdelek [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipa) | Od različice `4.0.0`. Kode 25 jezikov prikaza ter te kode skupaj z `'system'`, ki jih sprejme metoda `setLocale()` – glejte razdelek [Jezik prikaza](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tip) | Od različice `4.0.0`. Možnosti, ki jih sprejme metoda `getSchemaSQL()`: `statements`, `header` in od različice `4.2.0` `logicalNameAsComment` – glejte razdelek [getSchemaSQL](./erd-editor-element.md#getschemasql). |

Od različice `5.0.0` mapa `dist` vsebuje eno nezmanjšano datoteko na modul, vsako ob njeni deklaraciji, polje `sideEffects` v `package.json` pa poimenuje samo obe vstopni točki oznak in dva stub-a, ki ju potrebujejo datoteke delovnih niti. Zato združevalnik zavrže vsak modul, ki ga stran ne doseže, in zmanjša enkrat:

- Imenovan uvoz iz korena, na primer `setExportFileCallback`, ne združi nobenega elementa in nobene delovne niti.
- `toImage` prinese delovno nit za izvoz slik in noben element.
- `erd-editor.js` prinese urejevalnik in vse tri delovne niti shared worker.
- `erd-viewer.js` prinese pregledovalnik in nobene delovne niti, z angleščino v njem in vsakim drugim jezikom prikaza v lastnem kosu, ki se naloži, ko ga stran zahteva.

`@dineug/erd-editor/engine.js` izvaja shrambo dokumenta brez DOM, zato deluje v delovni niti Web Worker – glejte stran [Oddaljena shramba](./advanced/remote-storage.md).
Izvaža funkcijo `createReplicationStore` in tip `ReplicationStore`. Od različice `3.10.0` izvaža tudi tip `ReplicationChange`, `{ value: string; changed: boolean }`, ki ga prejme poslušalec dogodka `change` replike – glejte razdelek [on@change](./advanced/remote-storage.md#onchange).
Od različice `4.0.0` ima shramba `ReplicationStore` tudi lastnost `runtimeValue`. Njena lastnost `value` in vrednost, ki jo preda dogodek `change`, sta v obliki za shranjevanje, kakršno hrani datoteka, tako kot pri elementu – glejte razdelek [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` je udeleženec brez vmesnika, prek katerega [strežnik MCP](../mcp/introduction.md) ureja dokument. Namenjena je temu strežniku, te strani pa je ne dokumentirajo.

### Pogovorna okna za datoteke {#file-dialogs}

Uvoz in izvoz potekata prek povratnih klicev, ki jih je mogoče nadomestiti, zato lahko gostitelj brez brskalnikovega pogovornega okna za datoteke – na primer pogled webview v razvojnem okolju – zagotovi svoje.
Povratna klica nista simetrična: izvoz vam preda končano datoteko, medtem ko uvoz datoteko le zahteva, vsebino pa nato vstavite nazaj sami.
Od različice `4.2.0` je ukaz `Import CSV` na zavihku Slovar edini uvoz, ki nikoli ne pokliče povratnega klica za uvoz, katerega lastnost `type` nima vrednosti za CSV. Vedno odpre lastni izbirnik datotek brskalnika za datoteke `.csv` – glejte razdelek [Uvoz in izvoz CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

Lastnost `op` je `set` ali `diff` – `diff` se preda metodi `setDiffValue()` ne glede na vrednost `type`. Sicer metodo izbere `type`, `accept` pa vsebuje končnice tega tipa, pripravljene za predajo gostiteljevemu pogovornemu oknu za datoteke.
Od različice `4.0.0` zahteva `set` vsebuje `mode: 'append'`, ko je uporabnik izbral ukaz [Uvozi in dodaj](../guide/guides/file-import-export.md#import-and-add), pri navadnem uvozu pa lastnosti `mode` ni. Posredujte jo naprej: povratni klic, ki jo izpusti, zamenja diagram, v katerega je uporabnik želel dodati.

| `type` | `accept` | Metoda |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

Možnost `placement: 'auto'` tabele razporedi glede na njihove relacije, preden se pojavijo, tako kot lastni uvoz urejevalnika, in povzroči, da klic vrne objekt Promise. Brez nje se tabele takoj pojavijo v vrsticah – glejte razdelka [setSchemaSQL](./erd-editor-element.md#setschemasql) in [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Za vsako vrednost `type`, ki jo obdelujete, izberite ustrezno vejo, ostale pa prezrite.
Klic `setSchemaJSON()`, ki zamenja vsebino, pred razčlenjevanjem počisti dokument tako kot prirejanje vrednosti lastnosti `value`, zato se diagram, če tja usmerite podatke, ki niso dokument `.erd.json` – prek vseobsegajoče veje `else` ali ker je pozneje dodana vrednost `type` zdrsnila skozi –, izprazni, namesto da bi se kar koli uvozilo.

Vrednost `fileName`, ki jo ustvari urejevalnik, je `<database name>-<timestamp>` s končnico datoteke, pri čemer je časovni žig lokalni čas v obliki `yyyy-MM-dd'T'HH_mm_ss`. Če je ime zbirke podatkov prazno, se uporabi `unnamed`. Ime datoteke CSV z zavihka Slovar pred končnico navede list, kot v `<database name>-<timestamp>-words.csv`.
Povratni klic za izvoz prejme te datoteke. Od različice `4.0.0` so med njimi tudi slika SVG in datoteke generatorja kode, datoteka `.sql` pa pride iz gumba `Save file` na zavihku Shema SQL in ne neposredno iz menija `Export`. Od različice `4.2.0` je med njimi tudi datoteka CSV zavihka Slovar. [toImage()](./to-image.md) ne pokliče nobenega od obeh povratnih klicev: sliko vam vrne.

| Datoteka | Končnica | `type` objekta Blob |
| --- | --- | --- |
| Izvoz JSON | `.erd.json` | `application/json` |
| `Save file` na zavihku Shema SQL z besedilom, ki ga zavihek prikazuje – glejte stran [Shema SQL](../guide/guides/schema-sql.md) | `.sql` | Brez |
| Pogovorno okno [Izvoz slike](../guide/guides/file-import-export.md#image) | `.png` ali `.svg` | `image/png` ali `image/svg+xml` |
| `Save file` na zavihku Generator kode – glejte stran [Generator kode](../guide/guides/code-generator.md) | Končnica jezika: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` ali `.mmd` | Brez |
| `Export CSV` na zavihku Slovar z vsemi vrsticami prikazanega lista, ne glede na to, kaj navaja njegovo iskanje – glejte razdelek [Uvoz in izvoz CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Gostitelj, ki obravnavalnik izbira glede na končnico, potrebuje obravnavalnik za vsako od njih.

Če povratnih klicev ne nastavite, urejevalnik uporablja lastno vedenje brskalnika za prenos in izbiro datotek. Podajte `null`, da se vrnete k njemu.

## Podpora brskalnikov {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ – osnova ES2022, za katero so zgrajene objavljene gradnje.
Paket ne vključuje knjižnic polyfill. Če morate podpreti starejše brskalnike, jih dodajte sami.

## Nadgradnja z različice 4.x {#upgrading-from-4x}

Različica `5.0.0` je glavna izdaja. Ko stran prenašate z različice 4.x, preverite vsako od naslednjih točk:

- `import '@dineug/erd-editor'` ne definira več `<erd-editor>`. Namesto tega zaradi učinka uvozite `@dineug/erd-editor/erd-editor.js` ali pokličite `defineErdEditor()`, imenovane uvoze iz korena pa pustite, kot so. TypeScript strani, ki ostane pri golem uvozu, ne označi, saj deklaracije korena še vedno poimenujejo oznako v `HTMLElementTagNameMap`, vendar je element, ki ga naredi, navaden `HTMLElement`, zato njegov prvi klic metode vrže `TypeError` – glejte razdelek [Registracija elementov](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Na CDN velja enako za `https://esm.run/@dineug/erd-editor`, ki zdaj vrne koren in ne definira ničesar: uvozite `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Goli URL-ji jsDelivr in unpkg še vedno vrnejo gradnjo z oznako script, ki definira `<erd-editor>` kot prej. URL brez različice zdaj vrne najnovejšo izdajo 5.x; za ostanek na 4.x fiksirajte `@4.2.0` – glejte razdelka [CDN](#cdn) in [Oznaka script](#script-tag).
- Koren ne definira ničesar, vendar še vedno potrebuje DOM, zato pri upodabljanju na strežniku imenovan uvoz iz njega, na primer `setExportFileCallback`, ostane na poti samo za odjemalca ob vstopni točki elementa – glejte razdelek [Upodabljanje na strežniku](#server-side-rendering).
- `window.ErdEditor` dobi `ErdEditorElement` in `defineErdEditor`. Gradnja pregledovalnika z oznako script da `ErdViewerElement` in `defineErdViewer` na `window.ErdViewer`, nobeden od obeh globalnih objektov pa ne vsebuje `toImage`.
- Urejevalnik `readonly` se odpre kot bralnik. Njegovih šest zavihkov, raziskovalec, hitro iskanje in prisotnost ostanejo, vsak kontrolnik, ki bi urejal diagram, pa je izginil in ne onemogočen: orodna vrstica prikazuje ime zbirke podatkov kot besedilo, zavihek Nastavitve prikazuje svoje nastavitve z vsemi onemogočenimi kontrolniki pod značko `Read only`, lebdeča orodna vrstica pa ohrani samo povečavo, prikaz imen, način zen in kompas, zato `Hand` in `Select` izgineta, vlečenje pa premika pogled. Pritisk ne izbere ničesar: edina izbira je obris, ki ga skok iz raziskovalca ali hitrega iskanja nariše okoli tistega, kar doseže, in ga miren klik počisti, tipke za izbiro vsega pa ničesar ne izberejo. Vklop `readonly` konča, kar je bilo odprto, na primer izbiro, orodje Roka, urejevalnik celice, vlečenje, Map Columns, predogled `Force` funkcije Auto Layout in Time Travel, ohrani pa pomik, povečavo, zavihek in prikaz imen – glejte [readonly](./erd-editor-element.md#readonly).
- Nastavitve, ki jih bralec `readonly` spremeni, ostanejo na zaslonu tega urejevalnika, ne glede na njihove zaklepe: pomik in povečava, zavihek, prikaz imen, View Option, zbirka podatkov ter jezik, zapisi imen in vrsta narekovajev generatorja kode. `value`, `runtimeValue` in izvoz JSON ohranijo dokumentove lastne, do katerih so spremembe bralca v 4.x lahko prišle, `getSharedStore()` pa nobene od njih ne pošlje drugim urejevalnikom. `getSchemaSQL()` brez vrste zbirke podatkov zapiše zbirko podatkov, ki jo je izbral bralec. Izklop `readonly` vrne zbirko podatkov, nastavitve kode in View Option na dokumentove, pomik, povečavo, zavihek in prikaz imen pa pusti tam, kjer jih je pustil bralec.
- Vrstice `Recalculation table width` na zavihku Nastavitve ni več. Nalaganje in lepljenje še vedno prilagodita širino vsake tabele njenemu besedilu.
- Na Vite 8 odstranite `exclude: ['@dineug/erd-editor']` iz `optimizeDeps`, ki ga še potrebujejo samo Vite 7 in starejši, `include` za ELK pa obdržite – glejte razdelek [Vite](#vite).

## Nadgradnja z različice 3.x {#upgrading-from-3x}

Različica `4.0.0` je glavna izdaja. Ko stran prenašate z različice 3.x, preverite vsako od naslednjih točk, nato pa še tiste iz razdelka [Nadgradnja z različice 4.x](#upgrading-from-4x) za `5.0.0`:

- Lastnost `editor.value`, lastnost `value` replike in vrednost `value`, ki jo preda njen dogodek `change`, so v obliki za shranjevanje, ki jo hrani datoteka: brez odstranjenih entitet, izmerjenih širin, vrstnega reda prekrivanja ali sidrnih točk relacij. Še naprej shranjujte `value`, te podatke pa berite iz lastnosti `runtimeValue`; časovnih žigov entitet (`meta`) sploh ni več. Sodelavca ali repliko, ki se pridruži delujoči seji, inicializirajte iz lastnosti `runtimeValue` delujočega udeleženca, ne iz `value` ali datoteke, lastnosti `runtimeValue` pa nikoli ne shranjujte – glejte razdelka [value](./erd-editor-element.md#value) in [runtimeValue](./erd-editor-element.md#runtimevalue).
- Zaklepi nastavitev nadomeščajo `Save Scroll Information` in `Save Zoom Information`. Nov dokument, pa tudi vsak dokument, shranjen pred različico `4.0.0`, ima vklopljene vse zaklepe, zato pomik, povečava, preklop zavihka ali sprememba jezika generatorja kode, zapisa imen ali vrste narekovajev pusti vrednost `value` nespremenjeno in ne sproži dogodka `change`. Stran, ki je pogled ohranjala prek dogodka `change`, potrebuje na zavihku Nastavitve odklenjeno nastavitev `Viewport` (in `Canvas Type` za zavihek) ali pa dokument, katerega `settings.lockSettings` pusti te bite počiščene – glejte razdelek [Zaklepanje](../guide/guides/settings.md#lock).
- Objekt `settings` nima več `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ali `ignoreSaveSettings`, konstante `SaveSettingType` pa so odstranjene. Lastnost `settings.lockSettings` z biti `LockSettingType` nadomešča lastnost `ignoreSaveSettings`, ki je različica `4.0.0` ali novejša niti ne bere niti ne zapisuje – glejte razdelek [Settings](./advanced/schema.md#settings).
- [JSON Schema](./advanced/schema.md#json-schema), ki jo vsaka datoteka navaja v `$schema`, zdaj opisuje samo obliko za shranjevanje in je zaprta: zavrne datoteko, ki jo je shranila starejša izdaja, dokler je ne prepiše shranjevanje z različico `4.0.0` ali novejšo.
- Zbiranje smeti dokumenta je izginilo skupaj s svojo delovno nitjo, zato odstranjena entiteta ostane v lastnosti `runtimeValue`, dokler se dokument naslednjič ne odpre iz svoje datoteke. Ostale so tri delovne niti shared worker – glejte razdelek [Web Workers](#web-workers).
- Vse urejevalnike in replike v skupni seji imejte na različici `4.0.0` ali novejši. Starejša izdaja prezre nove vrste dejanj: dejanja skupin tabel, okna Preslikaj stolpce, zaklepov in skriptov na zavihku Shema SQL – glejte razdelek [Mešanje izdaj](./advanced/collaborative-editing.md#mixing-releases).
- Povratni klic za uvoz pri ukazu Uvozi in dodaj prejme vrednost `mode: 'append'`, ki jo mora povratni klic posredovati naprej. Povratni klic za izvoz zdaj prejema tudi datoteke `.svg` in datoteke generatorja kode, `Export` ▸ `Schema SQL` pa namesto shranjevanja odpre zavihek Shema SQL, zato datoteka `.sql` pride samo iz gumba `Save file` na tem zavihku – glejte razdelek [Pogovorna okna za datoteke](#file-dialogs).
- Tipki `Delete` in `Backspace` sta dodeljeni novemu ukazu `removeSelection`. Ko ima urejevalnik fokus zunaj besedilnega polja, se privzeto dejanje tipke prepreči na vsakem zavihku, na zavihku ERD pa se izbor odstrani. Tipa `KeyBindingName` in `KeyBindingMap` ga vključujeta, klic `setKeyBindingMap({ removeSelection: [] })` pa obe tipki prepusti strani – glejte razdelek [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- Lastnost `ThemeOptions.appearance` sprejme tudi vrednost `'system'`, tj. možnost `System` v izbirniku teme, ki jo nastavi vklop lastnosti `systemDarkMode`. Dogodek `changePresetTheme` sporoča `'system'`, dokler je ta vrednost izbrana, zato jo shranite takšno, kot je, in jo vrnite metodi `setPresetTheme`. Ko je lastnost `systemDarkMode` vklopljena, klic `setPresetTheme()` z vrednostjo `'light'` ali `'dark'` zdaj ostane v veljavi, namesto da bi ga prepisala naslednja sprememba v operacijskem sistemu – glejte razdelka [systemDarkMode](./erd-editor-element.md#systemdarkmode) in [changePresetTheme](./erd-editor-element.md#changepresettheme).
- Paket `@dineug/erd-editor-mcp` različice `1.0.0` ali novejše, razširitev za VS Code različice `4.0.0` ali novejše ter vtičnika za Obsidian in JetBrains različice `1.0.0` ali novejše uporabljajo protokol središča različice 2. Strežnik različice `1.0.0` ali novejše in starejša izdaja urejevalnika, ki streže agentom, ali starejši strežnik in eden od teh urejevalnikov se medsebojno zavrneta z napako `protocolMismatch` in navedeta stran, ki jo je treba posodobiti – glejte razdelek [Posodabljanje](../mcp/installation.md#updating).
- URL na CDN brez različice vrne najnovejšo izdajo, od različice `5.0.0` 5.x. Če želite ostati na različici 3.x, fiksirajte `@3.10.0` – glejte razdelek [CDN](#cdn).
