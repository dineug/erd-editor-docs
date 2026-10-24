---
sidebar_position: 1
description: Namestite @dineug/erd-editor iz npm ali CDN, vstavite element po meri, povežite pogovorna okna za datoteke in nadgradite z različice 3.x.
---

# Namestitev

```sh
npm install @dineug/erd-editor
```

Paket je izključno ESM (`"type": "module"`) in vsebuje samo mapo `dist`.
Gradnje za CommonJS ni, zato klic `require('@dineug/erd-editor')` ne deluje.

Njegove odvisnosti za izvajanje ostanejo zunanje, kot goli uvozi, ki jih vaš združevalnik razreši, odpravi njihova podvajanja in iz njih izloči neuporabljeno kodo.
Njegove delovne niti shared worker se zapišejo kot ločene vstopne datoteke v mapi `dist/workers/` in se ustvarijo z `new URL('./…', import.meta.url)`, kar je zapis, ki ga Vite, webpack 5 in Rspack združijo kot vstopno točko delovne niti. Glejte razdelek [Web Workers](#web-workers).
Za stran brez združevalnika obstaja druga, samostojna gradnja – glejte razdelek [Oznaka script](#script-tag).

## Uporaba {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

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
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

Storitev `esm.run` namesto vas razreši zunanje odvisnosti paketa, zato to deluje brez združevalnika.
URL brez različice vedno vrne najnovejšo izdajo. Fiksirajte različico – `https://esm.run/@dineug/erd-editor@4.2.0` –, če ne želite, da bi nadgradnja na novo glavno različico nenapovedano dosegla vašo stran.
Tudi različica `4.0.0` je taka nadgradnja: stran, ki mora ostati na različici 3.x, fiksira `@3.10.0` – glejte razdelek [Nadgradnja z različice 3.x](#upgrading-from-3x).

### Oznaka script {#script-tag}

Od različice `3.6.0` paket vsebuje tudi gradnjo UMD, ki ima vse odvisnosti in vse delovne niti shared worker v eni datoteki.
Nanjo kažeta polji `unpkg` in `jsdelivr`, zato jo vrne goli URL paketa na katerem koli od obeh omrežij CDN, gradnja pa definira objekt `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Ko jo uvozite, na enak način registrira element `<erd-editor>`; objekt `window.ErdEditor` vsebuje oba povratna klica za datoteke, `ErdEditor.setExportFileCallback` in `ErdEditor.setImportFileCallback`, od različice `3.9.2` pa tudi `ErdEditor.createKeyBindingMap`. Od različice `4.2.0` vsebuje tudi `ErdEditor.dictionaryRowChords` – glejte razdelek [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
Preslikava izvozov še vedno usmerja združevalnik na module ES, zato namestitev iz npm te datoteke nikoli ne uporabi.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
Vseh 25 jezikov prikaza je vključenih v paket, tako v gradnjo ES kot v gradnjo za oznako script, zato ni jezikovne datoteke, ki bi jo bilo treba streči, in ničesar ni treba registrirati. Brez izbirnika in brez klica `setLocale()` urejevalnik prikazuje angleščino.

Atribut `readonly`, dodan tukaj, prepreči urejanje: prirejanje vrednosti lastnosti `value`, klic `clear()` in vsak klic `setSchema*()` – vključno z metodo `setSchemaJSON()` in dodajanjem – se prezrejo, dogodek `change` pa se nikoli ne sproži. Branje lastnosti `editor.value` in `editor.runtimeValue` še vedno deluje. Namesto tega dokument naložite z metodo `setInitialValue()`.

### Upodabljanje na strežniku {#server-side-rendering}

Uvoz paketa registrira element po meri na ravni modula, zato potrebuje DOM in v okolju Node vrže napako.
V ogrodjih Next.js, Nuxt, SvelteKit ali Astro ga uvozite iz kode, ki se izvaja samo v odjemalcu.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Uvoz paketa združi `erd-editor` v vmesnik `HTMLElementTagNameMap`, zato je element tipiziran brez pretvorbe tipa.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

Tip `ErdEditorElement` se izvaža za označevanje tipov vaših spremenljivk in lastnosti.
Od različice `4.0.0` paket izvaža tudi tipe `LocaleCode`, `LocaleOption` in `SchemaSQLOptions` – glejte razdelek [Vstopne točke](#entry-points). Možnosti, ki jih sprejemajo metode `setSchema*()`, nimajo izvoženega imena; izpeljite jih iz elementa, kot `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Označevanje sintakse {#syntax-highlighting}

Sintakso na ploščah Shema SQL in Generator kode označuje [Shiki](https://shiki.style) v svoji lastni delovni niti shared worker, od različice `4.0.0` pa tudi v skriptih `Before tables` in `After tables` na zavihku Shema SQL.
Od različice `3.7.0` ni treba ničesar namestiti in ničesar registrirati: delovna nit se ustvari ob prvem izrisu plošče s kodo, zato stran, ki nobene ne odpre, slovnic nikoli ne prenese.

| | |
| --- | --- |
| Jeziki | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Teme | `github-dark` in `github-light`, glede na svetli ali temni videz urejevalnika |

To so natanko jeziki, ki jih ustvarjata plošči: `JPA` se označi kot Java, `SQLAlchemy` kot Python, `TypeORM`, `Sequelize`, `Drizzle` in `Zod` kot TypeScript, `Doctrine` kot PHP, `SeaORM` kot Rust, `JSON Schema` kot JSON, `DBML` in `AML` pa kot SQL, najbližja slovnica v paketu – glejte stran [Generator kode](../guide/guides/code-generator.md).

Pogon za regularne izraze je čista koda JavaScript, zato nobenemu pravilniku gostitelja ni treba dovoliti `wasm-unsafe-eval`.
Kjer vmesnik `SharedWorker` ni na voljo – Chrome v sistemu Android, Safari pred različico 16.4 –, se napaka zabeleži, koda pa se prikaže kot navadno besedilo; skripte je še vedno mogoče urejati.

Nadgradnja z različice `3.6.0` ali starejše: paket `@dineug/erd-editor-shiki-worker` se ne objavlja več, z njim pa je izginila tudi funkcija `setGetShikiServiceCallback`.
Odstranite namestitev in registracijo; stran, ki je delovno nit nalagala iz CDN, odstrani tudi to drugo oznako `<script>`.

## Web Workers {#web-workers}

Urejevalnik v delovnih nitih `SharedWorker` izvaja tri opravila: označevanje sintakse, izvoz slike in postavitev tabel, ki poganja [samodejno postavitev](../guide/guides/table-related-functions.md#auto-layout), [način Tok](../guide/guides/visualization.md#how-flow-is-placed) na zavihku Vizualizacija in od različice `4.0.0` tudi razporeditev uvožene sheme.
Vse tri so vključene v paket `@dineug/erd-editor`. Nobene od njih vam ni treba nastaviti, vendar lahko vsako od njih gostitelj blokira.
Različica `4.0.0` je odstranila delovno nit, ki je izvajala zbiranje smeti dokumenta, skupaj s samim zbiranjem smeti.

| Delovna nit | Brez nje |
| --- | --- |
| Označevanje sintakse | Plošči Shema SQL in Generator kode ter skripti na zavihku Shema SQL ostanejo navadno besedilo |
| Izvoz slike | PNG, SVG, `Copy to clipboard` in predogled okna `Export image` se izrišejo v glavni niti, kar med izrisovanjem blokira stran |
| Postavitev tabel | Postavitve `Flow`, `Tree - vertical` in `Tree - horizontal` v samodejni postavitvi ter način Tok na zavihku Vizualizacija se končajo s sporočilom `Could not place tables`; uvoz, ki ga razporedi postavitev Tok – datoteka SQL, GraphQL, DBML ali AML iz ukaza `Import` ali `Import and Add` ali klic `setSchema*()` z možnostjo `placement: 'auto'` –, tabele brez sporočila postavi v vrstice; na postavitev `Force` in način Graf to ne vpliva, ker se izvajata v urejevalniku |

Izvoz slike deset sekund čaka na odgovor svoje delovne niti in nato riše v glavni niti, označevanje sintakse pa kodo pusti kot navadno besedilo takoj, ko njegova delovna nit odpove, zato gostitelj, ki blokira delovne niti, poslabša zmogljivost, ne pa delovanja.
Izjema je postavitev tabel: pogon, ki izračuna postavitev, je večji od samega urejevalnika in se nikoli ne naloži v isti proces, zato ob prvi razporeditvi na svojo delovno nit čaka trideset sekund, ko pa delovna nit enkrat odgovori, postavitvi da šestdeset sekund, da se vrne.
Če kateri koli od obeh čakalnih časov poteče, se razporeditev konča tako kot brez delovne niti. Samodejna postavitev prikaže sporočilo `Placing tables` takoj, ko se začne, način Tok in uvoz, ki ga razporedi postavitev Tok, pa ga prikažeta šele, ko razporeditev, vključno z zagonom njene delovne niti, teče že šest sekund.

V gradnji z združevalnikom se vse tri zapišejo kot datoteke ob paketu, zato strog pravilnik CSP potrebuje `worker-src 'self'` – in še `blob:`, kjer vaš združevalnik delovno nit vgradi neposredno v kodo.
V gradnji za [oznako script](#script-tag) so vse tri vgrajene v datoteko kot naslovi URL `data:`, zato ta stran namesto tega potrebuje `worker-src data:`.

## Vstopne točke {#entry-points}

Uvoz paketa `@dineug/erd-editor` kot stranski učinek registrira element `<erd-editor>`. Poleg tega izvaža tip elementa, dve funkciji za nastavljanje povratnih klicev, od različice `3.9.2` privzete dodelitve tipk z njihovimi tipi, od različice `4.0.0` tipe za jezik prikaza in tip možnosti metode `getSchemaSQL()`, od različice `4.2.0` pa kombinacije tipk za vrstice na zavihku Slovar.

| Izvoz | Opis |
| --- | --- |
| `ErdEditorElement` (tip) | Vmesnik elementa – glejte stran [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Nadomesti prenos v brskalniku, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Nadomesti izbirnik datotek v brskalniku, `({ type, op, accept, mode }) => void`; `mode` od različice `4.0.0`. Od različice `4.2.0` ukaz `Import CSV` na zavihku Slovar odpre izbirnik datotek brskalnika, tudi kadar je povratni klic nastavljen – glejte razdelek [Pogovorna okna za datoteke](#file-dialogs). |
| `createKeyBindingMap()` | Ob vsakem klicu vrne privzete dodelitve tipk kot nov objekt `KeyBindingMap` – glejte razdelek [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipi) | Preslikava dodelitev, unija imen njenih ukazov in ena dodelitev. |
| `dictionaryRowChords(map)` | Od različice `4.2.0`. Ob vsakem klicu kot novo polje `ShortcutOption[]` vrne kombinacije tipk, s katerimi mreža na zavihku [Slovar](../guide/guides/dictionary.md#adding-and-deleting-rows) vstavlja in briše vrstice pri objektu `KeyBindingMap`, ki ga podate. Kombinacija, ki vstavi vrstice nad izbor, s privzetimi dodelitvami `Alt+Shift+Enter`, ni v nobeni dodelitvi – glejte razdelek [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipa) | Od različice `4.0.0`. Kode 25 jezikov prikaza ter te kode skupaj z `'system'`, ki jih sprejme metoda `setLocale()` – glejte razdelek [Jezik prikaza](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tip) | Od različice `4.0.0`. Možnosti, ki jih sprejme metoda `getSchemaSQL()`: `statements`, `header` in od različice `4.2.0` `logicalNameAsComment` – glejte razdelek [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` je druga vstopna točka. Shrambo dokumenta izvaja brez DOM, zato deluje v delovni niti Web Worker – glejte stran [Oddaljena shramba](./advanced/remote-storage.md).
Izvaža funkcijo `createReplicationStore` in tip `ReplicationStore`. Od različice `3.10.0` izvaža tudi tip `ReplicationChange`, `{ value: string; changed: boolean }`, ki ga prejme poslušalec dogodka `change` replike – glejte razdelek [on@change](./advanced/remote-storage.md#onchange).
Od različice `4.0.0` ima shramba `ReplicationStore` tudi lastnost `runtimeValue`. Njena lastnost `value` in vrednost, ki jo preda dogodek `change`, sta v obliki za shranjevanje, kakršno hrani datoteka, tako kot pri elementu – glejte razdelek [ReplicationStore](./advanced/remote-storage.md#replicationstore).

Od različice `3.9.1` obstaja še tretja, `@dineug/erd-editor/peer.js`: udeleženec brez vmesnika, prek katerega [strežnik MCP](../mcp/introduction.md) ureja dokument. Namenjena je temu strežniku, te strani pa je ne dokumentirajo.

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
Povratni klic za izvoz prejme te datoteke. Od različice `4.0.0` so med njimi tudi slika SVG in datoteke generatorja kode, datoteka `.sql` pa pride iz gumba `Save file` na zavihku Shema SQL in ne neposredno iz menija `Export`. Od različice `4.2.0` je med njimi tudi datoteka CSV zavihka Slovar.

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

## Nadgradnja z različice 3.x {#upgrading-from-3x}

Različica `4.0.0` je glavna izdaja. Ko stran prenašate z različice 3.x, preverite vsako od naslednjih točk:

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
- URL na CDN brez različice zdaj vrne najnovejšo izdajo 4.x. Če želite ostati na različici 3.x, fiksirajte `@3.10.0` – glejte razdelek [CDN](#cdn).
