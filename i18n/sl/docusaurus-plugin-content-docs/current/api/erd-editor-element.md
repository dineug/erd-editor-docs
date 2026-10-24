---
sidebar_position: 2
description: API elementa erd-editor – atributi, value in runtimeValue, dogodki, teme, jezik prikaza, pozdravni zaslon, dodelitve tipk ter uvoz in izvoz sheme.
---

# ErdEditorElement

Urejevalnik je navaden element `HTMLElement`.  
Njegova definicija tipa je naslednja.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

Urejevalnik se izriše v zaprt senčni koren, zato ima `editor.shadowRoot` vrednost `null`, slogi strani pa ne prehajajo ne vanj ne iz njega.  
Ničesar v njem ni mogoče doseči s selektorjem – urejevalnik namesto tega oblikujte z metodo [setTheme](#settheme) in lastnostmi CSS po meri `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` in `enable-welcome-screen` so edini atributi, vseh pet pa ima privzeto vrednost `false`. Zadnja dva sta novost različice `4.0.0`. Vsak prebere svojo vrednost tako, kot je opisano v razdelku [readonly](#readonly).

Od različice `4.1.0` ima zavihek ERD [raziskovalca](../guide/guides/explorer.md), drevo diagrama, zasidrano levo od platna, z iskanjem in zamenjavo na vrhu. Noben atribut, lastnost, metoda ali dogodek ga ne odpre, ne zapre in ne poroča o njem: odpre se z gumbom `Explorer` v orodni vrstici, z ukazom `Toggle Explorer` v hitrem iskanju ali priročnem meniju platna ali z dodelitvijo [`findReplace`](#setkeybindingmap).  
Vsak element se zažene z zaprtim raziskovalcem. Stanje odprtosti raziskovalca, njegova širina, strnjene veje in iskanje se ohranijo, dokler obstaja element, tudi ob preklopih zavihkov in ob vsakem nalaganju, vključno z metodo `setInitialValue`, in niso nikoli zapisani v `value`, `runtimeValue`, zgodovini razveljavitev ali skupni shrambi.

Od različice `4.2.0` imajo lahko tabele in stolpci poleg imen tudi [logična imena](../guide/guides/logical-names.md), prikaz imen, ki je tako kot zavihek nastavitev dokumenta, pa določa, ali platno izriše njihova imena, njihova logična imena ali oboje.  
Orodna vrstica ima tudi zavihek [Slovar](../guide/guides/dictionary.md), med zavihkoma `Code Generator` in `Settings`, ki vsebuje besede, izraze in domene dokumenta ter list `Checks`. Je zavihek kot vsi drugi: njegovo vrednost `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, hrani zaklep `Canvas Type`, zato se besedilo, shranjeno na njem, z metodo [setInitialValue](#setinitialvalue) odpre na njem, preklop nanj pa se zapiše v `value` in sproži dogodek [change](#change) samo, dokler je ta zaklep izklopljen. Noben lasten atribut, lastnost, metoda ali dogodek ga ne odpre in ne poroča o njem. Spremembe na njem so spremembe dokumenta: so v `value`, sprožijo dogodek [change](#change) in dosežejo sodelavce, vendar njihova razveljavitev in uveljavitev delujeta na lastni zgodovini posameznega lista, ne na zgodovini dokumenta.  
Lastno stanje zavihka – kateri list je prikazan, sprva list `Domains`, ter iskanje, izbor, pomik in širine stolpcev posameznega lista – se ohrani, dokler obstaja element, tudi ob preklopih zavihkov in ob vsakem nalaganju, in ni nikoli zapisano v `value`, `runtimeValue`, zgodovini razveljavitev ali skupni shrambi.  
Vmesnik `ErdEditorElement` ne dobi nobenega novega člana. API doda možnost `logicalNameAsComment` med možnostmi metode [getSchemaSQL](#getschemasql), dvanajst [žetonov teme](#settheme) in izvoz [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Določa, ali je urejevalnik mogoče urejati.  
Dokler je nastavljena, se prirejanje lastnosti `value`, klici `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, razveljavitev in uveljavitev, od različice `4.2.0` tudi na listu zavihka Slovar, vse prezrejo, dogodek `change` pa se nikoli ne sproži. Dokument namesto tega naložite z metodo [setInitialValue](#setinitialvalue).  
Ogledovanje še vedno deluje: povečava, premikanje pogleda, orodje Roka, način zen, zavihek platna, zavihek [Vizualizacija](../guide/guides/visualization.md) v obeh načinih, vključno z osredotočanjem na tabele, vrsta zbirke podatkov ter nastavitve izhoda SQL in generatorja kode še naprej veljajo, tako da lahko urejevalnik samo za branje še vedno izvozi SQL za drugo vrsto zbirke podatkov ali prikaže ustvarjeno kodo.  
Od različice `4.1.0` se odpre tudi [raziskovalec](../guide/guides/explorer.md#read-only-editors), izbira ene od njegovih vrstic pa vodi do tistega, kar vrstica predstavlja, tako kot v urejevalniku, ki ga je mogoče urejati. [Iskanje in zamenjava](../guide/guides/find-and-replace.md#read-only-editors) na njegovem vrhu samo išče, brez puščice `Toggle Replace` in brez vrstice za zamenjavo, prehod na zadetek pa ga še vedno pripelje v vidno območje in izbere. Plošča ima naslov `Explorer`, opis orodja gumba v orodni vrstici pa je v vsakem urejevalniku `Explorer (Ctrl + F)` (Windows/Linux) ali `Explorer (⌘ + F)` (Mac). Od različice `3.10.0` do `4.0.0` se je iskanje in zamenjava odpiralo kot lebdeča plošča samo za iskanje z naslovom `Find`.  
Okno Lastnosti tabele se še vedno odpre in od različice `3.10.0` ob naslovu prikazuje značko `Read only`, njegov zavihek `Indexes` pa ne omogoča sprememb – glejte razdelek [Lastnosti tabele](../guide/guides/table-related-functions.md#table-properties).  
Od različice `4.0.0` urejevalnik samo za branje ne ponuja ukazov [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (glejte stran [Skupine tabel](../guide/guides/table-groups.md#read-only-editors)) ali [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) in ne prikazuje [pozdravnega zaslona](#enablewelcomescreen). Gumbi za zaklepanje na zavihku Nastavitve ne spremenijo ničesar, skriptov `Before tables` in `After tables` na zavihku Shema SQL pa ni mogoče urejati.  
Od različice `4.1.0` v [orodni vrstici platna](../guide/guides/table-related-functions.md#canvas-toolbar) tudi ne prikazuje gumbov `New Table`, `New Memo` ali `New Table Group`, dodelitvi `addTableGroup` in `groupSelectedTables` pa ne naredita ničesar.  
Od različice `4.2.0` se [prikaz imen](../guide/guides/logical-names.md#read-only-editors) še vedno preklopi z vsakim od svojih izbirnikov, vendar samo na zaslonu tega urejevalnika: ne glede na njegov zaklep preklop nikoli ne doseže sodelavcev. Ukaza `Previous table` in `Next table` v načinu Tok še vedno naredita korak nazaj in naprej, prek svojih gumbov ali tipk za razveljavitev in uveljavitev.  
Zavihek [Slovar](../guide/guides/dictionary.md#read-only-editors) se še vedno odpre: med njegovimi listi je mogoče preklapljati, v njih iskati in izbirati, se po njih pomikati in iz njih kopirati, vrstica lista `Checks` pa še vedno vodi do tistega, kar navaja. Nobena celica ne sprejme urejanja, lepljenja ali praznjenja, zavihek ne prikazuje orodij `Add Row`, `Delete Rows`, `Import CSV` ali `Export CSV` in nobenega menija na mreži, njegove kombinacije tipk za vrstice pa ničesar ne vstavijo in ne izbrišejo. Meni tabele, meni platna in hitro iskanje ne ponujajo ukazov [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) ali `Derive Physical Name Again`.  
Izbire `This window only` na zavihku Shema SQL, `Statements`, `Header`, od različice `4.2.0` `Write logical names into empty comments` in `Tables`, se nikoli ne shranijo in še vedno veljajo, enako pa velja za okno [`Export image`](../guide/guides/file-import-export.md#image), izbirnik teme in izbirnik jezika prikaza. Izbira v izbirniku teme ali izbirniku jezika prikaza še vedno sproži dogodek [changePresetTheme](#changepresettheme) ali [changeLocale](#changelocale).  
Atribut brez vrednosti, `=""` in `="true"` se preberejo kot `true`. `="false"` se prebere kot `false`, prav tako vsak drug niz – vključno z ustaljenim zapisom HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Določa, ali se urejevalnik samodejno usklajuje s temnim/svetlim načinom sistema.  
Od različice `4.0.0` vklop nastavi polje `appearance` teme na `'system'`, tako kot `setPresetTheme({ appearance: 'system' })`. Urejevalnik nato prikazuje svetli ali temni videz, ki ga sporoča operacijski sistem, ali videz, ki ga določa metoda [setSystemAppearance](#setsystemappearance), in preklopi, ko se ta spremeni.  
Poznejši klic [setPresetTheme](#setpresettheme) z vrednostjo `'light'` ali `'dark'` ali izbira `Light` ali `Dark` v izbirniku teme ali hitrem iskanju zamenja `'system'` in obvelja: naslednja sprememba v operacijskem sistemu te nastavitve ne prepiše več, čeprav je `systemDarkMode` še vedno `true`. Pred različico `4.0.0` jo je naslednja sprememba v operacijskem sistemu prepisala.  
Izklop, ko je videz `'system'`, ohrani svetli ali temni videz, prikazan v tistem trenutku. Izklop, potem ko je bil videz spremenjen iz `'system'` v drugo vrednost, videz pusti takšen, kot je.  
Sprememba te lastnosti ne sproži nobenega dogodka.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Določa, ali je na voljo uporabniški vmesnik za preprosto nastavljanje prednastavljenih tem.  
Prikaže gumb orodne vrstice `Theme`, ki odpre izbirnik teme z možnostmi `Accent color`, `Gray color` in `Appearance`. Od različice `4.0.0` možnost `Appearance` poleg `Light` in `Dark` ponuja tudi `System`, ko je ta lastnost vklopljena, pa hitro iskanje navaja ukaz `Theme` z možnostmi `System`, `Light` in `Dark`. Glejte stran [Jezik in tema](../guide/guides/language-and-theme.md).

![Odpiranje izbirnika teme iz orodne vrstice, izbira barve poudarka in sivih tonov ter preklop videza na Light in nato na System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Sprememba prednastavljene teme na tej plošči ali v hitrem iskanju sproži dogodek [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Od različice `4.0.0` določa, ali je na voljo uporabniški vmesnik za izbiro jezika prikaza urejevalnika.  
Prikaže gumb orodne vrstice `Display Language`, za gumbom `Theme`, kadar sta prikazana oba. Gumb odpre izbirnik jezika prikaza, hitro iskanje pa navaja ukaz `Display Language`. Oba ponujata `System` in 25 jezikov – glejte stran [Jezik in tema](../guide/guides/language-and-theme.md).  
Določa tudi, kaj urejevalnik prikazuje, preden se pokliče metoda [setLocale](#setlocale) ali izbere jezik: `'system'`, ko je vklopljena, in angleščino, ko je izklopljena, tako da element, ki ničesar ne nastavi, ohrani angleščino, ki jo je vedno prikazoval. Vklop ali izklop takoj preklopi med obema. Ko je jezik enkrat nastavljen ali izbran, ta izbira ostane ne glede na to, ali je lastnost vklopljena ali izklopljena.  
Nastavite jo, preden element dodate na stran, da bo že prva sličica sledila `'system'`.  
Izbira sproži dogodek [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Od različice `4.0.0` določa, ali prazen diagram bralca pozdravi s [pozdravnim zaslonom](../guide/guides/editing-start.md#welcome-screen).  
Prikazan je nad zavihkom ERD, dokler dokument nima nobene tabele, nobene prikazane beležke in nobene prikazane skupine tabel. Ni prikazan, ko je nastavljena lastnost `readonly`, v načinu zen ali ko je odprto okno Lastnosti tabele, pregledovalnik razlik, potovanje skozi čas ali predogled samodejne postavitve. Prva tabela, prikazana beležka ali prikazana skupina tabel ga odstrani, razveljavitev nazaj do praznega diagrama pa ga vrne.  
Njegove postavke `New Table`, `New Memo` in `Command Palette` prikazujejo prvo kombinacijo tipk dodelitev `addTable`, `addMemo` in `search`, kakršne jih je pustila metoda [setKeyBindingMap](#setkeybindingmap), za ime, ki je ostalo prazno, pa nobene. Njegove puščice kažejo na gumba `Theme` in `Display Language` samo tam, kjer ju prikazujeta `enableThemeBuilder` in `enableLocalePicker`.  
V njegovem meniju tipke `↑`, `↓`, `Home` in `End` premikajo fokus med postavkami ter imajo preprečeno privzeto dejanje in ustavljeno širjenje. Pri tipkah `Enter` in `Space` se širjenje ustavi, privzeto dejanje pa ni preprečeno, zato ju prejme postavka s fokusom, tipka `Escape` med formati `Import` pa vrne korak nazaj, s preprečenim privzetim dejanjem in ustavljenim širjenjem. Vsaka druga tipka kot običajno doseže urejevalnik in stran.  
V dokumentu ne spremeni ničesar, zato pusti vrednost `value` nespremenjeno in ne sproži dogodka `change`.  
Vklopite jo, ko je metoda [setInitialValue](#setinitialvalue) že naložila dokument, tako kot uradni gostitelji, da zaslon nikoli ne utripne nad datoteko, ki se še nalaga.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Vrne trenutni dokument kot niz JSON v [shemi](./advanced/schema.md), ki jo določa urejevalnik.  
Od različice `4.0.0` je to oblika za shranjevanje, torej dokument, kakršnega hrani datoteka, kar je hkrati tudi tisto, kar zapiše izvoz `json` in kar shranjujejo uradni gostitelji. Vsebuje samo žive entitete, brez odstranjenih, brez vrstnega reda prekrivanja in brez tistega, kar urejevalnik izračuna sam, na primer izmerjenih širin, oznak ključev in sidrnih točk relacij. Ključi njegovih entitet si sledijo v stalnem vrstnem redu, zamik je dva presledka, konča pa se z znakom za novo vrstico, tako da isti dokument vedno da enake bajte.  
Od različice `4.2.0` izpusti tudi vse, kar je prazno: prazen seznam v objektu `doc`, prazno kolekcijo, vrstico slovarja, ki ne vsebuje ničesar, in prazno besedilno polje entitete, na primer ime, komentar, podatkovni tip, privzeto vrednost ali barvo. Seznam znotraj entitete, na primer seznam `columnIds` tabele, se zapiše tudi, ko je prazen. Objekt `doc` novega dokumenta je `{}`, polja `collections` pa nov dokument nima, zato manjkajoče polje, seznam ali kolekcijo preberite kot prazno. Vrednost `value` vsebuje logična imena in zastavice izpeljanih imen tabel in stolpcev, povezave stolpcev z domenami ter besede, izraze in domene, pri čemer je vsak slovar zapisan kot ena glava z imeni polj, ki ji sledijo njegove vrstice, vsaka v svoji vrstici besedila, v vrstnem redu na listu. Glejte razdelek [Oblika za shranjevanje in vrednost med izvajanjem](./advanced/schema.md#storage-form-and-runtime-value).  
Vsaka nastavitev, katere [zaklep](../guide/guides/settings.md#lock) je vklopljen, se zapiše z vrednostjo, pri kateri je zaklenjena, in ne tako, kot jo prikazuje zaslon. Zaklep `Viewport` hrani `originX`, `originY` in `zoomLevel`, zaklepi `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` in od različice `4.2.0` `Name View` pa vsak svojo nastavitev. Prikaz imen se zapiše kot polje `nameViewMode`, in sicer samo, kadar ni `'physical'`. Vse druge nastavitve se zapišejo takšne, kot so, polje `lockSettings` pa se zapiše vedno. Za posamezne bite glejte razdelek [Settings](./advanced/schema.md#settings); bit zaklepa `Name View` se bere obratno.  
Nov dokument ima vklopljene vse zaklepe, ne glede na to, ali gre za dokument, ki ga element prikaže, preden dobi vrednost, ali za dokument, naložen iz prazne vrednosti. Njegova vrednost `value` ohranja izhodišče pri `0, 0`, stopnjo povečave pri `1`, zavihek ERD, privzeti jezik generatorja kode, zapis imen in vrsto narekovajev ter od različice `4.2.0` prikaz `Physical Names`, dokler ustrezni zaklep ni izklopljen.  
Pred različico `4.0.0` je getter vračal celoten dokument, kakršnega je hranil urejevalnik, z upoštevanim poljem `ignoreSaveSettings`. Dokument, kakršnega hrani urejevalnik, je zdaj [runtimeValue](#runtimevalue), polja `ignoreSaveSettings` pa urejevalnik ne bere in ne zapisuje več.

```js
const data = editor.value;
```

### setter {#setter}

Naloži prej shranjeno stanje urejevalnika. Zamenja celoten dokument – trenutni se najprej počisti. Od različice `4.2.0` zamenjava vključuje tudi besede, izraze in domene: dokument prevzame tiste, ki jih vsebuje besedilo, ali nobenih, lastna zgodovina razveljavitev vsakega lista zavihka Slovar pa se izprazni.  
Tako kot `clear()`, `setInitialValue()` in metode `setSchema*` v privzetem načinu `mode: 'replace'` tudi zavrže pogled načina Tok na zavihku Vizualizacija: njegovo postavitev, tabele, na katere je zožen, prikaz vrstic, povečavo in premik pogleda, od različice `4.2.0` pa tudi tabele, po katerih se premikata ukaza `Previous table` in `Next table`. Dodajanje (`mode: 'append'`) ga ne zavrže.  
Zabeleži se v zgodovino, kar omogoča `Undo, Redo`, in sproži dogodek `change`.  
Sprejme obliko za shranjevanje, vrednost [runtimeValue](#runtimevalue) ali datoteko, ki jo je shranila starejša izdaja.  
Prazen niz ali kar koli, kar ni niz, naloži nov dokument, namesto da bi prišlo do napake, zato vrednost preverite, preden jo priredite.  
Ta nov dokument je enak tistemu, ki ga začne `setInitialValue('')`: prazen, s privzetimi nastavitvami in od različice `4.0.0` z vsemi vklopljenimi zaklepi. V različici `3.10.x` ni shranjeval ne položaja pomika ne stopnje povečave, pred tem pa je shranjeval oboje.  
Skupna shramba to nalaganje posreduje sodelavcem s celotno kodo JSON novega dokumenta, tako da ga naloži vsak udeleženec, tudi tisti s starejšo izdajo, čeprav urejevalnik pred različico `4.2.0` izpusti tisto, česar ne pozna, na primer logična imena, povezave z domenami in slovarje – glejte razdelek [Mešanje izdaj](./advanced/collaborative-editing.md#mixing-releases).  
Od različice `4.0.0` zaklepi naloženega dokumenta in zaklenjene vrednosti, ki jih nato zapiše `value`, izhajajo iz besedila, pogled pa pristane tam, kamor ga postavi besedilo, ali na diagramu, kadar na tem mestu ni izrisan noben njegov del. Pri vsaki drugi nastavitvi, ki jo besedilo zaklene – zavihku, jeziku generatorja kode, zapisu imen, vrsti narekovajev in od različice `4.2.0` prikazu imen –, urejevalnik še naprej prikazuje tisto, kar je prikazoval pred nalaganjem. Nastavitev, ki jo besedilo pusti odklenjeno, prevzame vrednost iz besedila. Datoteka, shranjena pred različico `4.2.0`, ne navaja zaklepa `Name View`, razen če ga je v njej izklopil urejevalnik različice `4.2.0`, zato se naloži s prikazom imen, zaklenjenim na `Physical Names`, urejevalnik pa ohrani prikaz imen, ki ga je prikazoval. Metoda [setInitialValue](#setinitialvalue) pa prevzame vse vrednosti, ki jih vsebuje besedilo; njen razdelek opisuje tudi besedilo, ki ne navaja nobenega zaklepa.  
Tudi besedilo, ki ni JSON, na primer datoteka, v kateri so ostale oznake konfliktov pri združevanju, ne sproži napake: dokument se izprazni, njegove nastavitve ostanejo takšne, kot so bile, napaka razčlenjevanja pa se zapiše v konzolo.  
Dokler je nastavljena lastnost `readonly`, se prezre; za nalaganje v urejevalnik samo za branje uporabite [setInitialValue](#setinitialvalue).

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Od različice `4.0.0` vrne dokument, kakršnega hrani ta urejevalnik, kot niz JSON. Nima setterja, zato prirejanje vrednosti v kodi v strogem načinu vrže napako.  
Vsebuje tisto, kar [value](#value) izpusti: odstranjene entitete in njihov vrstni red, vrstni red prekrivanja, izmerjene širine, oznake ključev, sidrne točke relacij in zaporedja, od različice `4.2.0` pa tudi prazna besedilna polja, sezname v objektu `doc` in kolekcije; vrstice, odstranjene z lista zavihka Slovar, in tiste, ki ne vsebujejo ničesar; ključ vrstnega reda vsake vrstice slovarja; sezname besed, izrazov in domen v objektu `doc`; ter povezavo z odstranjeno domeno. Tudi tu se zaklenjene nastavitve zapišejo z zaklenjenimi vrednostmi.  
Uporabite jo za inicializacijo drugega urejevalnika, ki se pridruži že delujoči seji, na primer sodelavčevega ali drugega pogleda na isti dokument, z njegovo metodo [setInitialValue](#setinitialvalue). Razveljavitev odstranitve, ki jo seja pošlje pozneje, nato tam entiteto obnovi v celoti, medtem ko urejevalnik, inicializiran iz `value`, ne hrani nobene odstranjene entitete in namesto nje obnovi prazno tabelo brez imena ali od različice `4.2.0` prazno vrstico slovarja. Glejte stran [Sodelovalno urejanje](./advanced/collaborative-editing.md).  
Odstranjene entitete se ne čistijo več, zato v njej ostanejo, dokler se dokument naslednjič ne odpre iz svoje datoteke.  
Nikoli je ne zapisujte v datoteko: shranite vrednost `value`, ki jo [JSON Schema](./advanced/schema.md#json-schema) sprejme, te pa ne.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Naloži prej shranjeno stanje urejevalnika. Samo nalaganje se ne zabeleži v zgodovino, zato ga ni mogoče razveljaviti, dogodek `change` pa se ne sproži.  
Počisti tudi zgodovino razveljavitev, tako da ničesar, kar je bilo narejeno pred nalaganjem, ni mogoče razveljaviti ali uveljaviti na naloženem dokumentu, od različice `4.2.0` pa tudi lastno zgodovino vsakega lista zavihka Slovar.  
Sprejme obliko za shranjevanje, vrednost [runtimeValue](#runtimevalue) ali datoteko, ki jo je shranila starejša izdaja, in za razliko od prirejanja `value` prevzame vse nastavitve, ki jih vsebuje besedilo, vključno z zavihkom in nastavitvami kode.  
Prazen niz ali kar koli, kar ni niz, naloži nov dokument, namesto da bi prišlo do napake, zato `setInitialValue('')` začne prazen diagram.  
Od različice `4.0.0` ima ta nov dokument, ki ga element prikazuje tudi, preden dobi kakršno koli vrednost, vklopljene vse zaklepe. Pomikanje, povečava, preklapljanje zavihkov ter sprememba jezika generatorja kode, zapisa imen, vrste narekovajev ali od različice `4.2.0` prikaza imen pustijo vrednost `value` nespremenjeno in ne sprožijo dogodka `change`. V različici `3.10.x` ni shranjeval ne položaja pomika ne stopnje povečave, pred tem pa je shranjeval oboje.  
Dokument, naložen iz besedila, ohrani zaklepe, ki jih navaja. Dokument, ki ne navaja nobenega – vsaka datoteka, shranjena pred različico `4.0.0`, ne glede na vrednost njenega polja `ignoreSaveSettings`, in datoteka `.vuerd` različice v2 –, se odpre z vsemi vklopljenimi zaklepi, z nastavitvijo `Viewport`, zaklenjeno na izhodišče `0, 0` in stopnjo povečave `1`, na zavihku ERD ter z jezikom, zapisom imen in vrsto narekovajev, kakor jih je shranil.  
Od različice `4.2.0` se besedilo, ki navaja svoje zaklepe, ne pa tudi zaklepa `Name View`, odpre tako, da je vklopljen tudi ta zaklep, celo kadar so vsi drugi zaklepi izklopljeni. Datoteka, shranjena pred različico `4.2.0`, je takšno besedilo, razen če je ta zaklep v njej izklopil urejevalnik različice `4.2.0` (glejte razdelek [Settings](./advanced/schema.md#settings)). Odpre se v prikazu `Physical Names`, tako kot besedilo, ki ne navaja nobenega zaklepa.  
V obeh primerih se pogled odpre na pogledu dokumenta – tistem, ki ga je shranilo besedilo, kadar navaja svoje zaklepe, oziroma na izhodišču `0, 0` pri stopnji povečave `1`, kadar ne navaja nobenega – ali na diagramu, kadar na tem mestu ni izrisan noben njegov del. Pri zaklenjeni nastavitvi `Viewport` ostanejo v `value` še vedno njene zaklenjene vrednosti.  
Od različice `4.0.0` zavrže tudi stanje sodelovanja prej naloženega dokumenta, [skupna shramba](#getsharedstore) tega urejevalnika, ki je že naročena, pa druge urejevalnike znova vpraša za njihovo stanje, tako da urejevalnik, ponovno naložen v delujoči seji, dohiti druge. Takšen urejevalnik inicializirajte z vrednostjo [runtimeValue](#runtimevalue) drugega urejevalnika.  
Tudi besedilo, ki ni JSON, ne sproži napake: dokument se izprazni, njegove nastavitve ostanejo takšne, kot so bile, napaka razčlenjevanja pa se zapiše v konzolo.  
Za razliko od prirejanja `value` je lastnost `readonly` ne blokira, zato z njo naložite dokument v urejevalnik samo za branje.

```js
editor.setInitialValue('json...');
```

Nalaganje ob zagonu, shranjevanje ob spremembi.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Dogodki {#event}

`change`, `changePresetTheme` in `changeLocale` so edini trije javni dogodki; dogodek `changeLocale` je novost različice `4.0.0`.  
Element za lastno notranje povezovanje na sebi odpošilja tudi notranje dogodke `@dineug/erd-editor/internal-*`; ti niso del vmesnika API.

### change {#change}

Ko pride v urejevalniku do sprememb, se sproži dogodek.  
Dogodek je zakasnjen za 200 ms in se ne sproži, dokler ima `readonly` vrednost `true`.  
Sproži se ob vsaki spremembi dokumenta – ob urejanju v uporabniškem vmesniku, prirejanju `value`, klicu `clear()` in klicu vsake od metod `setSchema*`, od različice `4.0.0` pa tudi ob klicu `setSchemaJSON()` in ukazu `Import and Add`. Metoda `setInitialValue` ga ne sproži.  
Od različice `4.2.0` se sproži tudi ob vsaki spremembi na zavihku [Slovar](../guide/guides/dictionary.md) in vsaki njeni razveljavitvi ali uveljavitvi, ob spremembi logičnega imena ali povezave z domeno, ob ukazu `Derive Physical Names Again` in ob preklopu prikaza imen, dokler je zaklep `Name View` izklopljen.  
Nič, kar storite v načinu Tok na zavihku Vizualizacija, ga ne sproži – povečava, premikanje pogleda, premikanje kartic, `Tidy Up`, prikaz vrstic, zoženje pogleda s kartice ali od različice `4.2.0` premikanje z ukazoma `Previous table` in `Next table` ali s tipkama za razveljavitev in uveljavitev –, ker nič od tega ni sprememba dokumenta. Izjema je njegov seznam `Name View`: preklop na njem ga sproži, dokler je zaklep `Name View` izklopljen, tako kot preklop na zavihku ERD.  
Od različice `4.0.0` ga ne sproži niti sprememba nastavitve, katere [zaklep](../guide/guides/settings.md#lock) je vklopljen, ker spremeni samo zaslon in nikoli `value`: pomik ali povečava platna ERD, ko je nastavitev `Viewport` zaklenjena, preklop zavihka, ko je nastavitev `Canvas Type` zaklenjena, sprememba jezika generatorja kode, zapisa imen tabel, zapisa imen stolpcev ali vrste narekovajev, ko je vklopljen njen lastni zaklep, ter od različice `4.2.0` preklop prikaza imen, ko je nastavitev `Name View` zaklenjena. Izpuščene so samo te spremembe, zato ga paket, ki obenem ureja tudi dokument, še vedno sproži. Zaklepanje ali odklepanje nastavitve ga sproži.  
V novem dokumentu in v vsaki datoteki, shranjeni pred različico `4.0.0`, so vklopljeni vsi zaklepi, zaklep `Name View` pa je vklopljen v vsaki datoteki, shranjeni pred različico `4.2.0`, razen če ga je tam izklopil urejevalnik različice `4.2.0`, zato pomikanje, povečava, preklapljanje zavihkov in preklapljanje prikaza imen privzeto ne sprožijo ničesar. To zajema osredotočanje na tabele z zavihka ERD, gumb na kartici z zunanjo povezavo, ki vas iz načina Tok vrne na zavihek ERD, prehod na vrstico raziskovalca ali zadetek iskanja, odpiranje raziskovalca ali prehod na rezultat hitrega iskanja z drugega zavihka ter od različice `4.2.0` prehod na tabelo ali stolpec iz vrstice lista `Checks` na zavihku Slovar. Vsako od teh dejanj sproži en dogodek `change` samo, kadar je izklopljen zaklep, ki ga pokriva: `Canvas Type` za preklop zavihka in `Viewport` za pomik, ki ga opravi tudi gumb na kartici, rezultat hitrega iskanja, vrstica raziskovalca, zadetek iskanja ali vrstica lista `Checks`. Od različice `4.1.0` vsi ti pomiki sledijo enemu pravilu, [Kam pripelje skok](../guide/guides/table-related-functions.md#where-a-jump-lands), zato rezultat hitrega iskanja za tabelo platna ne pomakne več vsakič, skok, ki ga pravilo pusti na mestu, pa ne povzroči pomika, ki bi sprožil dogodek. Tudi odpiranje, zapiranje ali spreminjanje velikosti raziskovalca zoži ali razširi platno, ne da bi premaknilo njegovo izhodišče, in ne sproži ničesar. Pred različico `4.0.0` so pomikanje, povečava in preklapljanje zavihkov dogodek vedno sprožili, tudi ko je bila vrednost `editor.value` enaka.  
Če želite preskočiti zapisovanja, ki ničesar ne spremenijo, primerjajte `editor.value` z vrednostjo, ki ste jo nazadnje shranili, in ne z datoteko, ki ste jo naložili: datoteka, ki jo je zapisala starejša izdaja, datoteka različice v2 ali ročno urejena datoteka se lahko v `value` razlikuje že takoj, ko se naloži, ker jo `value` zapiše v obliki za shranjevanje. Enako velja za datoteko, katere zaklep `Viewport` je izklopljen in katere izhodišče na tem zaslonu ne prikaže nobenega dela diagrama: nalaganje premakne pogled na diagram, `value` pa zapiše mesto, kamor pristane. Od različice `4.0.0` izmerjene širine tega ne povzročajo več, ker jih `value` ne vsebuje. Od različice `4.2.0` se lahko razlikuje tudi datoteka, ki jo je shranila različica `4.0.0` ali `4.1.0`, ker `value` zdaj izpusti njena prazna besedilna polja, sezname in kolekcije, zato se takšna datoteka enkrat prepiše, in sicer ob naslednjem shranjevanju. Gostitelj, ki zapisuje datoteke, lahko namesto tega urejanje loči od spremembe pogleda z vrednostjo `changed` shrambe za replikacijo – glejte razdelek [on@change](./advanced/remote-storage.md#onchange).  
Dogodek nima polja `detail`, se ne širi navzgor in ne prečka meje senčnega korena, zato poslušajte na samem elementu in v poslušalcu preberite `editor.value`.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Sproži se, ko se prednastavljena tema spremeni z vgrajenim izbirnikom teme ali od različice `4.0.0` z ukazom `Theme` v hitrem iskanju. Sproži ga vsaka izbira, vključno z izbiro možnosti, ki že velja.  
Dogodka ne sprožijo vaši klici metod [setPresetTheme](#setpresettheme) ali [setSystemAppearance](#setsystemappearance) niti vklop ali izklop lastnosti [systemDarkMode](#systemdarkmode).  
`event.detail` je celoten objekt `ThemeOptions` po izbiri – `{ appearance, grayColor, accentColor }` –, ne delni objekt, ki je bil zahtevan. Od različice `4.0.0` ima njegovo polje `appearance` vrednost `'system'`, dokler je izbrana možnost `System`, in ne vrednosti svetlega ali temnega videza, ki ga prikazuje, zato ga shranite takšnega, kot je, in ga vrnite metodi `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Od različice `4.0.0` se sproži, ko je v urejevalniku izbran jezik, in sicer v izbirniku jezika prikaza ali z ukazom `Display Language` v hitrem iskanju, ki ju vklopi lastnost [enableLocalePicker](#enablelocalepicker).  
Sproži se, potem ko je jezik že uporabljen, ob vsaki izbiri, vključno z izbiro možnosti, ki že velja. [setLocale](#setlocale) in [setSystemLocale](#setsystemlocale) ga nikoli ne sprožita, prav tako ga ne sproži sprememba jezikov brskalnika. Preklop jezika ne sproži dogodka `change`.  
`event.detail` je `{ locale }`, vrednost tipa `LocaleOption`: `'system'`, če je bila izbrana možnost `System`, sicer koda jezika. Element si izbire ne zapomni, zato jo shranite in jo ob naslednjem nalaganju podajte metodi `setLocale`.  
Tako kot dogodek `change` se ne širi navzgor, zato poslušajte na samem elementu.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Postavi fokus na urejevalnik.

```js
editor.focus();
```

## blur {#blur}

Odstrani fokus z urejevalnika.

```js
editor.blur();
```

## clear {#clear}

Izprazni dokument in odstrani vse tabele, stolpce, relacije, indekse in beležke, od različice `4.0.0` vse skupine tabel, od različice `4.2.0` pa tudi besede, izraze in domene zavihka Slovar, pri čemer izprazni tudi lastno zgodovino razveljavitev vsakega lista.  
Vse nastavitve ostanejo, vključno z zbirko podatkov, položajem pogleda, stopnjo povečave, možnostmi pogleda tabel, vsakim zaklepom z vrednostjo, ki jo hrani, ter skriptoma `Before tables` in `After tables` na zavihku Shema SQL, tako da počiščena datoteka še naprej shranjuje tisto, kar je shranjevala. Če želite namesto tega začeti nov dokument, priredite `''` lastnosti `value` ali pokličite `setInitialValue('')`.  
Zabeleži se v zgodovino, zato ga je mogoče razveljaviti, in sproži dogodek `change`. Razveljavitev povrne dokument, kakršnega je hranil urejevalnik, vključno z njegovimi besedami, izrazi in domenami, vsako zaklenjeno nastavitev z zaklenjeno vrednostjo. Dokler je nastavljena lastnost `readonly`, se prezre.

```js
editor.clear();
```

## destroy {#destroy}

Popolnoma uniči primerek urejevalnika, tako da ga ni več mogoče znova uporabiti.  
Sprosti poslušalce in naročnine urejevalnika ter uniči vse skupne shrambe, ki jih je vrnila metoda [getSharedStore](#getsharedstore).  
Paket toka, ki ga skupna shramba še zadržuje, se zavrže skupaj z njo; če ga želite poslati, najprej pokličite metodo [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) te shrambe.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Znova določi bližnjice na tipkovnici.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` in `zoomReset` so nespremenljivi in jih ni mogoče znova določiti.  
Zapiše se samo spodnjih enaindvajset imen; vse drugo v objektu se prezre, vključno z nespremenljivimi imeni.  
Od različice `3.10.0` je mogoče znova določiti `search`, dodelitev `findReplace` pa je nova. Prej je bila dodelitev `search` nespremenljiva. Od različice `4.0.0` je nova dodelitev `removeSelection`. Od različice `4.1.0` sta nova `addTableGroup` in `groupSelectedTables`.  
Vrednost dodelitve mora biti `ShortcutOption[]`. Navaden niz se prezre, zato zapišite `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` in ne `{ addTable: 'Alt+KeyN' }`.  
Prazno polje je sprejeto in ne dodeli ničesar: `setKeyBindingMap({ findReplace: [] })` prepusti `Ctrl + F` (Windows/Linux) ali `⌘ + F` (Mac) strani, `{ search: [] }` pa enako stori za `Ctrl + K` (Windows/Linux) ali `⌘ + K` (Mac). Gumb `Search` v orodni vrstici še vedno odpre hitro iskanje, gumb `Explorer` v orodni vrstici še vedno odpre in zapre raziskovalca, ukaz `Toggle Explorer` v hitrem iskanju in v priročnem meniju platna pa še vedno odpre njegovo iskanje ali ga zapre; nobeden od njih ne prikaže bližnjice za ime, ki je ostalo prazno. `{ removeSelection: [] }` prepusti `Delete` in `Backspace` strani, postavke za brisanje v menijih tabele, beležke in skupine tabel (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) pa takrat ne prikazujejo bližnjice.  
Od različice `4.1.0` vrednost `{ addTableGroup: [] }` prepusti strani `Alt + G` (Windows/Linux) ali `⌥ + G` (Mac), vrednost `{ groupSelectedTables: [] }` pa `T` in nato `G`. `New Table Group` v orodni vrstici platna, v priročnem meniju platna in v hitrem iskanju, `Group selected tables` v meniju tabele in `Group Selected Tables` v hitrem iskanju še vedno delujejo, le da ne prikazujejo bližnjice. Opisi orodij gumbov `New Table`, `New Memo` in `New Table Group` v orodni vrstici platna navajajo prvo kombinacijo tipk dodelitev `addTable`, `addMemo` in `addTableGroup` ali pa samo gumb, če je dodelitev ostala prazna.  
Od različice `4.2.0` dodelitvi `addColumn` in `removeColumn` dajeta tudi mreži zavihka Slovar njene kombinacije tipk za vrstice, kot je opisano spodaj, zato ponovna dodelitev katere koli od njiju s seboj premakne tudi te kombinacije. Vrednost `{ addColumn: [] }` mreži ne pusti nobene kombinacije tipk za vstavljanje vrstic, dve postavki za vstavljanje v meniju mreže pa takrat ne prikazujeta bližnjice; vrednost `{ removeColumn: [] }` ji ne pusti nobene za njihovo brisanje, postavka za brisanje v meniju in opis orodja `Delete Rows` pa takrat ne prikazujeta nobene.  
Klic je delno spajanje: imena, ki jih izpustite, ohranijo privzete vrednosti, dvakratni klic pa ohrani prejšnje spremembe. Getterja za trenutne dodelitve ni: [createKeyBindingMap](#createkeybindingmap) vrne privzete vrednosti, ne tistega, kar je spremenila metoda `setKeyBindingMap`.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` in od različice `4.1.0` `groupSelectedTables` se umaknejo kazalki: ko je fokus v vnosnem polju, besedilnem območju ali elementu `contenteditable`, `$mod + A` izbere besedilo, `Space` vnese presledek, `Delete` in `Backspace` brišeta besedilo, `T` in nato `G` pa vneseta obe črki, namesto da bi pritiski dosegli platno. Pri nobenem od teh pritiskov privzeto dejanje ni preprečeno. Enako se obnašajo tudi tipke, na katere jih na novo dodelite.

Od različice `4.0.0` dodelitev `removeSelection` (`Delete` ali `Backspace`) na zavihku ERD brez vprašanja odstrani izbor kot en korak razveljavitve. Ko je tabela s fokusom edino, kar je izbrano, je izbran vsaj eden od njenih stolpcev in povečava izrisuje njene vrstice, odstrani te stolpce; sicer odstrani vse izbrane tabele, beležke in skupine tabel, pri čemer tabele skupine ostanejo. Glejte razdelek [Brisanje tabel in beležk](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Pridržana tipka odstrani le enkrat, nič pa se ne odstrani, dokler je odprto urejanje celice ali beležke ali polje za ime skupine tabel. Zunaj besedilnega polja ter plošč in zavihkov, ki zadržijo dodelitve (glejte razdelek [createKeyBindingMap](#createkeybindingmap)), je privzeto dejanje pritiska preprečeno na vsakem zavihku, dokler ima urejevalnik fokus, tudi na gumbu orodne vrstice s fokusom in v urejevalniku samo za branje, kjer ne odstrani ničesar.

Od različice `4.1.0` dodelitev `addTableGroup` (`Alt+KeyG`) na zavihku ERD vklopi risanje `New Table Group`, pri katerem naslednji pritisk glavnega gumba miške na platnu nariše skupino, ponovni pritisk te dodelitve pa risanje izklopi, tako kot gumb `New Table Group` v orodni vrstici platna. Dodelitev `groupSelectedTables` (`KeyT KeyG`, `T` in nato `G`) postavi izbrane tabele v novo skupino in odpre njeno polje za ime, tako kot `Group selected tables` v priročnem meniju tabele. Če ni izbrana nobena tabela, ne doda ničesar; izbrana beležka ali skupina tabel ne šteje. Glejte razdelka [Risanje skupine](../guide/guides/table-groups.md#drawing-a-group) in [Združevanje izbranih tabel v skupino](../guide/guides/table-groups.md#grouping-selected-tables).  
Obe delujeta samo tam, kjer meniji ponujajo skupino, ne pa, ko je nastavljena lastnost `readonly`, ko možnost pogleda `Table Groups` skriva skupine ali ko je odprto urejanje celice ali beležke ali polje za ime skupine tabel. Tako kot druge dodelitve platna delujeta samo na zavihku ERD in ne, dokler je odprto hitro iskanje, okno Lastnosti tabele, pregledovalnik razlik, potovanje skozi čas, predogled samodejne postavitve, `Export image` ali `Map Columns`. Kjer ne naredita ničesar, je privzeto dejanje pritiska vseeno preprečeno, razen ko se `groupSelectedTables` umakne kazalki. Pri dodelitvi `addTableGroup` se ustavi tudi širjenje, tako kot pri `focusView` in `zenMode`, zato pritiska nikoli ne zazna poslušalec `keydown` na strani v fazi širjenja navzgor.

Od različice `4.2.0` na zavihku [Slovar](../guide/guides/dictionary.md#adding-and-deleting-rows) vsaka kombinacija tipk dodelitve `addColumn`, ki obsega en sam pritisk, vstavi pod izbor toliko vrstic, kolikor jih zajema izbor, ista kombinacija tipk z dodatno pridržano tipko `Shift` jih vstavi nad izbor, vsaka kombinacija tipk dodelitve `removeColumn`, ki obsega en sam pritisk, pa izbriše vrstice, ki jih zajema izbor: s privzetimi nastavitvami `Alt+Enter`, `Alt+Shift+Enter` ter `Alt+Backspace` ali `Alt+Delete`. Delujejo v mreži listov `Domains`, `Words` in `Terms`, dokler ni odprto urejanje nobene celice. Kombinacija tipk dodelitve `addColumn`, ki že vsebuje `Shift`, ne da kombinacije za vstavljanje nad izbor, zaporedje, dodeljeno kateremu koli od obeh imen, pa mreži ne da ničesar.  
Pri vsakem takšnem pritisku je privzeto dejanje preprečeno, kot določa njegova možnost, širjenje pa vedno ustavljeno, zato na zavihku ERD ne doda in ne odstrani nobenega stolpca. Na listu `Checks` in v urejevalniku samo za branje ne naredi ničesar, čeprav ima še vedno preprečeno privzeto dejanje in ustavljeno širjenje. V odprtem urejanju celice ali v iskalnem polju zavihka so kombinacije tipk prepuščene besedilu: njihovo širjenje se tam ustavi, privzeto dejanje pa ni preprečeno, zato se polje nanje odzove tako kot kjer koli drugje (na računalniku Mac `⌥ + Backspace` izbriše besedo). Navaja jih funkcija [dictionaryRowChords](#dictionaryrowchords).

Od različice `3.10.0` dodelitev `findReplace` (`$mod+KeyF`) odpre [iskanje in zamenjavo](../guide/guides/find-and-replace.md). Od različice `4.1.0` preklopi [raziskovalca](../guide/guides/explorer.md#opening-and-closing), ki vsebuje iskanje in zamenjavo, zavihek Bližnjice pa jo navaja kot `Toggle Explorer`.  
Dokler je gumb `Explorer` v orodni vrstici prikazan kot pritisnjen (raziskovalec je odprt na zavihku ERD in ga ne skriva način zen), raziskovalca zapre, razen če je odprto hitro iskanje, okno Lastnosti tabele, izbirnik teme, izbirnik jezika prikaza, okno `Export image` ali `Map Columns`. Sicer zapre tisto od tega, kar je odprto, z drugega zavihka preklopi na zavihek ERD in odpre raziskovalca s kazalko v njegovem polju `Find` in izbranim iskalnim nizom. Urejevalnik, ki je preozek, da bi prikazal raziskovalca ob platnu, ga ohrani odprtega, a umaknjenega, in prikaže pojavno obvestilo `Widen the window to show the Explorer`. Pred različico `4.1.0` je odprla lebdečo ploščo iskanja in zamenjave ali njenemu polju vrnila tipkovnico in je nikoli ni zaprla.  
Kazalki se ne umakne: dokler ima urejevalnik fokus, jo ta prestreže na vsakem zavihku, s platna ali iz vnosnega polja v urejevalniku. Privzeto dejanje pritiska je preprečeno, zato brskalnik ne odpre vrstice za iskanje, širjenje pa je ustavljeno, zato ga noben poslušalec `keydown` na strani v fazi širjenja navzgor ne zazna. Ko je odprto urejanje celice ali beležke, od različice `4.0.0` polje za ime skupine tabel ali od različice `4.2.0` urejanje celice v mreži zavihka Slovar, ima pritisk še vedno preprečeno privzeto dejanje in ustavljeno širjenje, vendar dodelitev ne naredi ničesar. V zadnjem primeru ne naredi ničesar niti dodelitev `search`, zato dotlej vneseno besedilo ostane.  
Dokler je na katerem koli zavihku odprt pregledovalnik razlik, potovanje skozi čas ali predogled samodejne postavitve ali dokler vnosna metoda (IME) še sestavlja znake, pritisk nima ne preprečenega privzetega dejanja ne ustavljenega širjenja, zato ga prejme lastno iskanje brskalnika ali gostitelja. V raziskovalcu se širjenje pritiska med sestavljanjem ustavi, privzeto dejanje pa ni preprečeno. Enako se obnašajo tudi tipke, na katere na novo dodelite `findReplace`.

Dodelitev `focusView` deluje samo na zavihku ERD. Ko je izbrana vsaj ena tabela, odpre zavihek Vizualizacija v načinu Tok, zožen na te tabele in vse tabele, oddaljene za eno relacijo; izbrana beležka ali skupina tabel ne šteje, brez izbrane tabele pa ne naredi ničesar. Glejte razdelek [Osredotočanje na tabele](../guide/guides/visualization.md#focusing-on-tables).

Dodelitvi `undo` in `redo` delujeta glede na zavihek. Na zavihku ERD razveljavljata in uveljavljata spremembe v zgodovini dokumenta. Od različice `4.2.0` na zavihku Slovar razveljavljata in uveljavljata spremembe v lastni zgodovini prikazanega lista, na listu `Checks` pa ne naredita ničesar – glejte razdelek [Listi zavihka Slovar](../guide/guides/undo-redo.md#dictionary-sheets). V načinu Tok na zavihku Vizualizacija naredita korak nazaj in naprej, tako kot [`Previous table` in `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), zgodovine dokumenta pa se ne dotakneta. Na drugih zavihkih in v načinu Graf ne razveljavita ničesar.

Dodelitev `stop` (`Escape`) na zavihku ERD konča odprto urejanje celice ali beležke ali risanje relacije in pusti izbor takšen, kot je. Od različice `4.0.0` konča tudi urejanje v polju za ime skupine tabel, ne da bi zapisala ime, in risanje `New Table Group`. Urejevalnik ob tem pritisku pokliče `preventDefault()`.  
Če ni odprto nič od tega, tipka `Escape` počisti izbor in celico s fokusom, njeno privzeto dejanje pa ni preprečeno. Za izhod iz urejanja in čiščenje izbora sta zato potrebna dva pritiska.  
Od različice `4.2.0` prvi pritisk tipke `Escape`, dokler je prikazan seznam izrazov celice logičnega imena (glejte razdelek [Samodokončanje imen izrazov](../guide/guides/logical-names.md#completing-term-names)), zapre samo seznam, urejanje celice pa pusti odprto. Ta pritisk ima v celici preprečeno privzeto dejanje in ustavljeno širjenje, zato ga ne zazna ne dodelitev `stop` ne poslušalec `keydown` na strani v fazi širjenja navzgor.  
Razen v raziskovalcu, pri formatih `Import` [pozdravnega zaslona](#enablewelcomescreen), v seznamu izrazov celice logičnega imena, na zavihku [Slovar](../guide/guides/dictionary.md#keys-on-the-tab) ter v spodaj opisanih izbirnikih in oknih urejevalnik nikoli ne ustavi širjenja tipke `Escape`, zato stran, ki jo posluša sama, na primer da zapre svoje okno, zazna oba pritiska in lahko preskoči tistega, katerega `defaultPrevented` ima vrednost `true`.  
Dokler je odprto hitro iskanje, okno Lastnosti tabele, pregledovalnik razlik, predogled samodejne postavitve ali potovanje skozi čas, `Escape` namesto tega zapre tisto, kar je odprto, in pusti izbor takšen, kot je. Tudi privzeto dejanje tega pritiska ni preprečeno.  
Od različice `4.0.0` tipko `Escape` prestreže tudi odprto okno [`Export image`](../guide/guides/file-import-export.md#image) ali [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), ki se ob tem zapre in pusti izbor takšen, kot je. Vsako od obeh oken ob odprtju prevzame tipkovnico, ta pritisk tipke `Escape` pa ima preprečeno privzeto dejanje in ustavljeno širjenje.  
Od različice `4.1.0` tipka `Escape`, pritisnjena s fokusom v [raziskovalcu](../guide/guides/explorer.md#keys-in-the-explorer), v njegovem drevesu, poljih ali gumbih, vrne tipkovnico platnu, raziskovalca pa pusti odprtega in izbor takšen, kot je. Urejevalnik ob njej pokliče tako `preventDefault()` kot `stopPropagation()`, zato nikoli ne doseže poslušalca `keydown` na strani v fazi širjenja navzgor.  
Tipka `Escape` na platnu raziskovalca nikoli ne zapre. Pred različico `4.1.0` je tipka `Escape` v plošči iskanja in zamenjave to ploščo zaprla, na platnu pa jo je zaprla z istim pritiskom, ki je počistil izbor.  
Od različice `4.0.0` se izbirnik jezika prikaza in izbirnik barv zapreta s tipko `Escape`: v njiju ima pritisk preprečeno privzeto dejanje in ustavljeno širjenje, na platnu pa ju zapre z istim pritiskom, ki počisti izbor, brez preprečitve privzetega dejanja in brez ustavitve širjenja.  
Tipka `Escape`, pritisnjena, medtem ko vnosna metoda (IME) še sestavlja znake, pripada sestavljanju. Odprto urejanje pusti takšno, kot je, njeno privzeto dejanje pa ni preprečeno, zato lahko tudi stran preskoči pritisk, katerega `isComposing` ima vrednost `true` ali katerega `keyCode` je `229`. V raziskovalcu je širjenje takšnega pritiska, tako kot vsake tipke, pritisnjene tam med sestavljanjem, tudi ustavljeno, tipkovnica pa ostane v polju.  
Pred različico `3.9.2` je en sam pritisk tipke `Escape` hkrati končal urejanje ali risanje in počistil izbor, urejevalnik pa njegovega privzetega dejanja ni nikoli preprečil.

### createKeyBindingMap {#createkeybindingmap}

Od različice `3.9.2` paket izvaža funkcijo `createKeyBindingMap()`, skupaj z njo pa tudi tipe `KeyBindingMap`, `KeyBindingName` in `ShortcutOption`.  
Vrne privzete dodelitve tipk, vseh 28 imen, vključno z nespremenljivimi, ob vsakem klicu kot nov objekt, tako da sprememba vrnjenega objekta ne spremeni ničesar drugega.  
To je izhodišče vsakega urejevalnika, klic metode `setKeyBindingMap` pa se v njem ne pokaže.  
Od teh štirih je samo `createKeyBindingMap` izvoz, ki obstaja med izvajanjem; preostali trije so tipi. Od različice `4.2.0` se poleg nje izvaža tudi funkcija [dictionaryRowChords](#dictionaryrowchords).

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Vsak `shortcut` je kombinacija tipk v sintaksi [tinykeys](https://github.com/jamiebuilds/tinykeys), ki tipko poimenuje po `KeyboardEvent.code`, pri čemer je [`$mod`](#mod) v sistemu macOS `⌘`, drugod pa `Control`.  
Od različice `4.0.0` urejevalnik te kombinacije tipk bere sam in ne prek knjižnice tinykeys, v isti sintaksi. Tipka se ujema po svoji vrednosti `code` ali po vrednosti `key` ne glede na velikost črk, pritisk pa se ujema samo, kadar so pridržane natanko tiste modifikatorske tipke, ki jih navaja. `AltGraph` v sistemu Windows velja za `Control` in `Alt`, v sistemu macOS pa za `Alt`. Pritiski, ločeni s presledkom, tvorijo zaporedje, ki se začne znova, če eno sekundo ni dogodka keydown.  
Od različice `4.1.0` je ena od privzetih dodelitev zaporedje: `groupSelectedTables` je `KeyT KeyG`, `T` in nato `G`. Zaporedje se izvede ob pritisku, ki ga dokonča, in samo ta pritisk prevzame njegov `preventDefault` in `stopPropagation`, zato s privzetimi nastavitvami tipka `T` doseže stran, privzeto dejanje pa je preprečeno samo pri tipki `G`. Meniji, hitro iskanje in zavihek Bližnjice prikazujejo zaporedje kot eno tipko na pritisk.  
Nespremenljiva imena so dodeljena tipkam `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) in `$mod+Digit0` (`zoomReset`). `edit` in `stop` nimata zastavic; preostalih pet ima `preventDefault` in `stopPropagation`. Ostale so zgoraj navedene privzete dodelitve, med njimi `search` in `findReplace`.

Urejevalnik jih posluša na svojem elementu, zato mora gostitelj, ki tipke prestreže pred urejevalnikom, z globalnimi bližnjicami ali s poslušalcem `keydown` v fazi zajemanja, te tipke prepustiti, dokler ima urejevalnik fokus.  
Seznam tipk, ki jih je treba prepustiti, sestavite iz `createKeyBindingMap()`, pri čemer privzete dodelitve zamenjajte s tistimi, ki ste jih podali metodi `setKeyBindingMap`.  
Od različice `3.10.0` ta seznam vključuje `$mod+KeyF`, lastno kombinacijo tipk brskalnika za iskanje. Gostitelj, ki želi na tej kombinaciji tipk obdržati svoje iskanje, pokliče `setKeyBindingMap({ findReplace: [] })`.  
Od različice `4.0.0` vključuje tudi samostojni tipki `Delete` in `Backspace`. Gostitelj, ki želi obdržati ti tipki, pokliče `setKeyBindingMap({ removeSelection: [] })`.  
Od različice `4.1.0` vključuje tudi `Alt+KeyG` in zaporedje `KeyT KeyG`, ki je podano kot en niz: razdelite ga pri presledku in prepustite vsak pritisk, vključno s samostojnima tipkama `T` in `G`, saj se zaporedje, ki mu manjka pritisk, nikoli ne dokonča. Gostitelj, ki želi obdržati te tipke, pokliče `setKeyBindingMap({ addTableGroup: [] })` ali `setKeyBindingMap({ groupSelectedTables: [] })`.  
Od različice `4.2.0` mu dodajte kombinacije tipk, ki jih za isti objekt dodelitev vrne funkcija [dictionaryRowChords](#dictionaryrowchords), med njimi `Alt+Shift+Enter`. Gostitelj, ki želi obdržati te tipke, pokliče `setKeyBindingMap({ addColumn: [] })` ali `setKeyBindingMap({ removeColumn: [] })`, s čimer jim odvzame tudi dodajanje in odstranjevanje stolpcev na zavihku ERD.

Dokler je fokus v raziskovalcu, v njegovem drevesu, poljih `Find` in `Replace` ali gumbih, dodelitve `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` in `zoomReset` preidejo do urejevalnika, zato `findReplace` tam deluje enako kot na platnu. Vsaka druga dodelitev, kakor je trenutno nastavljena, se ustavi pri raziskovalcu, zaporedje pri svojem zadnjem pritisku (s privzetimi nastavitvami pri samostojni tipki `G`), enako pa velja za puščične tipke, `Tab`, `Enter`, `Space`, `Home`, `End` in vsako tipko, pritisnjeno, medtem ko vnosna metoda (IME) še sestavlja znake. Razen tipke `Escape`, ki vrne tipkovnico platnu, se njihovo širjenje ustavi brez preprečitve privzetega dejanja, zato v poljih, gumbih in drevesu raziskovalca delujejo kot običajne tipke in ne dosežejo ne platna ne poslušalca `keydown` na strani v fazi širjenja navzgor: `Alt + N` tam ne doda tabele, `Delete` pa ne odstrani ničesar. Tipke, ki premikajo fokus po vrsticah drevesa, vrstice strnejo ali izvedejo prehod na vrstico, ter `Enter` v polju `Find` ali `Replace`, s katerim se premikate med zadetki ali zamenjujete, imajo poleg tega preprečeno tudi privzeto dejanje.  
Vsaka druga tipka, na primer gostiteljeva kombinacija tipk za shranjevanje ali paleto ukazov, kot običajno preide naprej na stran. Glejte razdelek [Tipke v raziskovalcu](../guide/guides/explorer.md#keys-in-the-explorer). Pred različico `4.1.0` je lebdeča plošča iskanja in zamenjave zadrževala tipke na enak način, razen tipk `Home`, `End`, zadnjega pritiska zaporedja in tipke `Space`, kadar je bila dodelitev `handTool` nastavljena na drugo tipko.  
Od različice `4.0.0` izbirnik jezika prikaza zadržuje tipke na enak način: istih sedem dodelitev preide naprej, pri vsaki drugi dodelitvi (od različice `4.1.0` pri zaporedju ob njegovem zadnjem pritisku), puščičnih tipkah in tipki `Tab` pa se tam širjenje ustavi brez preprečitve privzetega dejanja, enako kot pri vsaki tipki, pritisnjeni, medtem ko vnosna metoda (IME) še sestavlja znake. `↑`, `↓`, `Home`, `End`, `Enter` in `Space` na eni od njegovih vrstic premikajo fokus med vrsticami ali izberejo eno od njih in imajo poleg tega preprečeno tudi privzeto dejanje.

Od različice `4.2.0` tipke zadržuje tudi zavihek [Slovar](../guide/guides/dictionary.md#keys-on-the-tab), do urejevalnika pa preidejo samo `search`, `findReplace`, `undo` in `redo`. Dodelitvi `undo` in `redo` delujeta na lastni zgodovini prikazanega lista, ko je odprto urejanje celice ali je fokus v iskalnem polju zavihka, pa sta prepuščeni besedilu: njuno širjenje se tam ustavi, privzeto dejanje pa ni preprečeno. Dodelitvi `search` in `findReplace` ne naredita ničesar, dokler je odprto urejanje celice, kot je opisano zgoraj. Kombinacije tipk za vrstice delujejo v mreži, kot je opisano pri dodelitvah `addColumn` in `removeColumn` zgoraj.  
Vsaka druga dodelitev, kakor je trenutno nastavljena, se ustavi pri zavihku, zaporedje pri svojem zadnjem pritisku, enako pa velja za puščične tipke, `Tab`, `Enter`, `Space`, `Home`, `End` in vsako tipko, pritisnjeno, medtem ko vnosna metoda (IME) še sestavlja znake. Nobena od njih ne doseže ne platna ne poslušalca `keydown` na strani v fazi širjenja navzgor: `Alt + N` tam ne doda tabele, `Delete` pa iz diagrama ne odstrani ničesar. Tudi dogodki kopiranja, izrezovanja in lepljenja na zavihku se ustavijo tam, zato jih diagram nikoli ne prebere kot svoje. Vsaka druga tipka kot običajno preide naprej na stran.

### dictionaryRowChords {#dictionaryrowchords}

Od različice `4.2.0` paket izvaža funkcijo `dictionaryRowChords()`. Ob vsakem klicu kot novo polje `ShortcutOption[]` vrne vse kombinacije tipk, s katerimi mreža zavihka Slovar vstavlja ali briše vrstice pri objektu dodelitev tipk, ki ga podate.  
Po vrsti so to kombinacije tipk dodelitve `addColumn`, ki obsegajo en sam pritisk in vstavijo vrstice pod izbor; vsaka od njih z dodatno pridržano tipko `Shift`, ki vstavi vrstice nad izbor, pri čemer za kombinacijo, ki že vsebuje `Shift`, takšne ni; ter kombinacije tipk dodelitve `removeColumn`, ki obsegajo en sam pritisk in izbrišejo vrstice. Vsaka ohrani `preventDefault` in `stopPropagation` dodelitve, iz katere izhaja, zaporedje pa je izpuščeno. Glejte razdelek [Dodajanje in brisanje vrstic](../guide/guides/dictionary.md#adding-and-deleting-rows).  
Kombinacija tipk, ki vstavi vrstice nad izbor, s privzetimi nastavitvami `Alt+Shift+Enter`, ni v nobeni dodelitvi, zato je gostitelj, ki modifikatorske tipke primerja natančno in seznam tipk, ki jih prepušča, sestavi samo iz funkcije [createKeyBindingMap](#createkeybindingmap), nikoli ne prepusti. Prepustite oba seznama, tako kot vtičnik za aplikacijo Obsidian.  
Prebere samo objekt, ki ga dobi, ne pa dodelitev elementa, zato ji podajte objekt, iz katerega ste sestavili svoj seznam tipk.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Glede na okolje zamenja tipko `Control`.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabela bližnjic {#shortcut-table}

Uporablja lastnosti `key, code` dogodka tipkovnice.  
Za absolutne položaje uporabite `code`, za vnesene vrednosti pa `key`.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| –             | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | –             | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2` itd. | `1`, `2` itd.   | `1`, `2` itd. | `Digit1`, `Digit2` itd.        |
| `a`, `b` itd. | `a`, `b` itd.   | `a`, `b` itd. | `KeyA`, `KeyB` itd.            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Nastavi prednastavljeno temo.  
Privzete vrednosti so `appearance: 'dark'`, `grayColor: 'slate'` in `accentColor: 'indigo'`.  
Vsako polje se uporabi samostojno, zato delni klic drugi dve polji pusti takšni, kot sta. Vrednost, ki ni eno od spodnjih imen, se prezre, klic pa nikoli ne vrže napake.  
Od različice `4.0.0` polje `appearance` sprejme tudi `'system'`, torej možnost `System` v izbirniku teme. Ta prikazuje svetli ali temni videz, ki ga sporoča operacijski sistem, ali videz, ki ga določa metoda [setSystemAppearance](#setsystemappearance), in preklopi, ko se ta spremeni.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Od različice `4.0.0` določi svetli ali temni videz, ki ga prikazuje videz `'system'`, za gostitelja z lastnim svetlim in temnim videzom, kot je tema razvojnega okolja. Dokler je videz določen, se spremembe operacijskega sistema prezrejo.  
`null` ali katera koli vrednost, ki ni `'dark'` ali `'light'`, znova vzpostavi sledenje operacijskemu sistemu.  
Dokler je videz `'light'` ali `'dark'`, na zaslonu ne spremeni ničesar, vendar se vrednost ohrani in začne veljati takoj, ko videz postane `'system'`. Sicer začne veljati takoj. Ne sproži ničesar, dogodek `changePresetTheme` pa še naprej sporoča `'system'`.  
Gostitelji VS Code, JetBrains in Obsidian jo pokličejo s svojim svetlim ali temnim videzom in znova vsakič, ko se ta spremeni.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Omogoča prilagajanje teme.  
Vsak klic zamenja celotno plast prilagoditev, zato za spremembo enega žetona poleg obstoječe prilagoditve znova podajte celoten objekt, za vrnitev na prednastavljeno temo pa podajte `{}`.  
Ohranijo se samo spodnja imena žetonov z nizovnimi vrednostmi; vse drugo se zavrže brez napake.  
Plast prilagoditev leži nad prednastavljeno temo, zato poznejši klic `setPresetTheme` zamenja prednastavljeno temo pod njo, vaše prilagoditve pa ostanejo.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` in `memoShadow` določata barvo sence, ki jo tabele in beležke mečejo na platno ERD. Temna prednastavljena tema ju pusti na `transparent`, kar pomeni brez sence, enako kot podajanje `none` ali praznega niza metodi `setTheme`; svetla prednastavljena tema uporablja `rgba(0, 0, 0, 0.18)`.

Od različice `4.0.0` je na voljo devet dodatnih žetonov:

- `tableGroupHeaderBackground`, `tableGroupBackground` in `tableGroupBorder` obarvajo naslovno vrstico, notranjost in obrobo [skupine tabel](../guide/guides/table-groups.md), ki nima lastne barve.
- `toastSuccess` in `toastError` obarvata oznako pojavnega obvestila, ki sporoča, kako se je nekaj končalo.
- `findReplaceError` in `mapColumnsError` obarvata napake, ki jih prikazujeta iskanje in zamenjava ter okno Preslikaj stolpce. Iskanje in zamenjava je prej uporabljalo `diffDeleteForeground`, zato ga prilagoditev tega žetona ne prebarva več.
- `schemaSqlWarningBackground` in `schemaSqlWarningForeground` obarvata opozorila v možnostih zavihka Shema SQL.

Od različice `4.1.0` je na voljo devet dodatnih žetonov:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` in `treeMatch` obarvajo drevo, ki si ga delita [raziskovalec](../guide/guides/explorer.md#the-tree) in [pregledovalnik razlik](../guide/guides/table-related-functions.md#diff-viewer): njegovo ozadje, ki zapolnjuje tudi polji `Find` in `Replace` raziskovalca; vrstico pod kazalcem, vrstico, izbrano s tipkovnico, ko ima drevo fokus, in gumb pod kazalcem v glavi in iskanju raziskovalca; vrstico trenutnega zadetka iskanja; bledo besedilo, kot so števci, podatkovni tipi in puščice za strnjevanje; ter poudarek pod besedilom, ki ga je našlo iskanje.
- `explorerBackground` in `explorerBorder` obarvata ploščo raziskovalca in njene črte: njen rob ob platnu, črto pod iskanjem ter obrobe njenih polj in gumbov, ki jih razpre `Search In`. `explorerBorder` nariše tudi rob drevesa pregledovalnika razlik, črto pod njegovim poljem `Filter by name` in obrobo tega polja. Ikone ključev v raziskovalcu uporabljajo `keyPK`, `keyFK` in `keyPFK`.
- `diffModifyForeground` in `diffRenameForeground` obarvata tisto, kar pregledovalnik razlik označi kot spremenjeno in preimenovano, v njegovem drevesu in na obeh dokumentih. `diffModifyForeground` obrobi tudi tabelo, beležko ali skupino tabel, ki je bila premaknjena ali ji je bila spremenjena velikost, barva ali skupina, ne glede na to, kaj drugega se je v njej spremenilo, in nariše povezovalno črto tujega ključa, ki se je spremenil.

`diffInsertForeground` in `diffDeleteForeground` zdaj obarvata tisto, kar pregledovalnik razlik označi kot dodano in odstranjeno, v njegovem drevesu in na dokumentu, ki to vsebuje, enako v besedilu, obrobah in povezovalnih črtah. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` in `diffCrossForeground` so bili v različici `4.1.0` odstranjeni, ker pregledovalnik razlik ne zapolnjuje več celic. `setTheme` jih zavrže kot vsako drugo ime, ki ga ni v `Theme`, njihove spremenljivke CSS `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` in `--erd-editor-diff-cross-foreground` pa se ne berejo več.

Od različice `4.2.0` je na voljo dvanajst dodatnih žetonov:

- `columnHandleBackground` in `columnHandleBorder` zapolnita in obrobita [ročico za vlečenje stolpca](../guide/guides/table-editing.md#rearranging-and-moving-columns), ki je izrisana tik zunaj levega roba tabele ob vrstici stolpca s fokusom, `columnHandleHoverBackground` in `columnHandleHoverBorder` pa ju zamenjata, dokler je kazalec nad njo. Oznaka za oprijem na njej uporablja `foreground`, pod kazalcem pa `active`.
- `dictionaryErrorForeground` in `dictionaryWarningForeground` obarvata tisto, kar najdejo [preverjanja slovarjev](../guide/guides/dictionary.md#what-each-check-finds), napako ali opozorilo: označeno ime na platnu ERD (glejte razdelek [Oznake na platnu](../guide/guides/dictionary.md#marks-on-the-canvas)), besedilo označene celice na listih `Domains`, `Words` in `Terms` ter števec lista `Checks`. `dictionaryErrorBackground` in `dictionaryWarningBackground` zapolnita takšno celico. `dictionaryErrorForeground` obarva tudi orodje `Delete Rows` pod kazalcem.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` in `dictionaryHeaderSelect` obarvajo list zavihka [Slovar](../guide/guides/dictionary.md#the-sheets): njegove celice, pri čemer ta barva zapolnjuje tudi iskalno polje zavihka in seznam domen izraza; njegove glave stolpcev in številke vrstic; črte med celicami, ta barva pa nariše tudi zgornji pas zavihka in obrobe njegovih polj; ter glavo vrstice ali stolpca, ki ga seka izbor. Preostanek lista uporablja skupne žetone: `foreground` za napise v glavah, `active` za besedilo celic, `grayColor7` za črto, ki ločuje glave stolpcev in številke vrstic od celic, `focus` za rob aktivne celice, `accentColor9` za rob izbranega obsega in s prekrivnostjo 20 % za njegovo zapolnitev, `accentColor6` za glavo v celoti izbrane vrstice ali stolpca, `grayColor3` za celice samo za branje ter žetone drsnega traku. Vrednost `accentColor9`, ki ni zapisana kot `#rgb` ali `#rrggbb`, pusti izbrani obseg nezapolnjen.

#### Spremenljivke CSS {#css-variables}

Vsak žeton v `Theme` ima ustrezno spremenljivko CSS z imenom `--erd-editor-`, ki mu sledi ključ v zapisu kebab-case: `grayColor10` je `--erd-editor-gray-color-10`, `keyPK` je `--erd-editor-key-pk`, `keyPFK` pa `--erd-editor-key-pfk`.  
Spremenljivke se dedujejo v urejevalnik, zato jih nastavite tam, kjer želite, da veljajo. Na `:root` določajo temo vseh urejevalnikov na strani; na samem elementu samo temo tega elementa.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Od različice `3.4.0` se napačno zapisana žetona `dargSelect` pišeta `dragSelect`, njune spremenljivke CSS pa so se spremenile iz `--erd-editor-darg-select-background` in `--erd-editor-darg-select-border` v `--erd-editor-drag-select-background` in `--erd-editor-drag-select-border`. Slogovna datoteka, ki še vedno uporablja stara imena, se prezre.

<details>
<summary>Privzete vrednosti teme</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Jezik prikaza {#display-language}

Od različice `4.0.0` je lastno besedilo urejevalnika – njegovi meniji, plošče, pogovorna okna, hitro iskanje, pojavna obvestila in besede, ki jih izriše na diagramu, kot je `unnamed`, vključno z izvozi slik – na voljo v 25 jezikih. Imena tabel in stolpcev, SQL, podatkovni tipi in ustvarjena koda se nikoli ne prevajajo. Glejte stran [Jezik in tema](../guide/guides/language-and-theme.md).  
Preden se pokliče [setLocale](#setlocale) ali izbere jezik, urejevalnik prikazuje angleščino oziroma sledi `'system'`, ko je vklopljena lastnost [enableLocalePicker](#enablelocalepicker).  
Urejevalnik nastavi `lang` in `dir` na svojem korenskem elementu znotraj zaprtega senčnega korena, nikoli na gostiteljskem elementu ali strani, zato stran, ki se piše od desne proti levi, ne obrne urejevalnika, jezik, ki se piše od desne proti levi, pa ne obrne strani. Hebrejščina, arabščina in perzijščina razporedijo vmesnik urejevalnika od desne proti levi; sam diagram ni nikoli zrcaljen. Od različice `4.1.0` [raziskovalec](../guide/guides/explorer.md) v vseh jezikih ostane na levi strani platna, njegove vrstice pa se v teh treh jezikih berejo od desne proti levi.  
Paket izvaža tipa `LocaleCode` (ena od spodnjih kod) in `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Koda    | Prikazano kot        | Jezik                     |
| ------- | -------------------- | ------------------------- |
| `id-ID` | Bahasa Indonesia     | Indonezijščina            |
| `de-DE` | Deutsch              | Nemščina                  |
| `en`    | English              | Angleščina                |
| `es-ES` | Español              | Španščina                 |
| `eu-ES` | Euskara              | Baskovščina               |
| `fr-FR` | Français             | Francoščina               |
| `it-IT` | Italiano             | Italijanščina             |
| `nl-NL` | Nederlands           | Nizozemščina              |
| `pl-PL` | Polski               | Poljščina                 |
| `pt-PT` | Português            | Portugalščina             |
| `pt-BR` | Português Brasileiro | Brazilska portugalščina   |
| `ro-RO` | Română               | Romunščina                |
| `sk-SK` | Slovenčina           | Slovaščina                |
| `sl-SI` | Slovenščina          | Slovenščina               |
| `sv-SE` | Svenska              | Švedščina                 |
| `tr-TR` | Türkçe               | Turščina                  |
| `ru-RU` | Русский              | Ruščina                   |
| `uk-UA` | Українська           | Ukrajinščina              |
| `he-IL` | עברית                | Hebrejščina               |
| `ar-SA` | العربية              | Arabščina                 |
| `fa-IR` | فارسی                | Perzijščina               |
| `ja-JP` | 日本語               | Japonščina                |
| `zh-CN` | 简体中文             | Poenostavljena kitajščina |
| `zh-TW` | 繁體中文             | Tradicionalna kitajščina  |
| `ko-KR` | 한국어               | Korejščina                |

### setLocale {#setlocale}

Nastavi jezik prikaza: `'system'` ali eno od zgornjih kod. Vse drugo, kot je samostojni `'ko'`, neznana koda ali vrednost, ki ni niz, se prezre brez napake.  
Začne veljati, še preden se klic vrne, zato je jezik, nastavljen pred dodajanjem elementa na stran, prisoten že v njegovi prvi sličici.  
Ne sproži ničesar, ne dogodka `changeLocale` ne dogodka `change`, in ne vpliva na `value`, zgodovino razveljavitev ali skupno shrambo.  
Izbira ostane ne glede na to, ali je lastnost `enableLocalePicker` vklopljena ali izklopljena, `setLocale('system')` pa sledi sistemu tudi z izklopljenim izbirnikom.  
Urejevalnik ne shrani ničesar. Če želite ohraniti bralčevo izbiro, poslušajte dogodek [changeLocale](#changelocale) in izbiro ob naslednjem nalaganju podajte nazaj.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Določi jezik, ki ga predstavlja `'system'`, kot oznako BCP 47, za gostitelja z lastnim jezikom prikaza. Gostitelji VS Code, JetBrains in Obsidian jo pokličejo s svojim jezikom prikaza.  
Oznaki se odstranijo presledki na začetku in koncu. `null`, prazen niz ali vrednost, ki ni niz, znova uporabi seznam `navigator.languages` brskalnika, ki mu urejevalnik sledi, ko se spreminja.  
Pomembna je samo, dokler je veljavna možnost `'system'`, in začne veljati takoj. Možnost `System` v izbirniku navaja jezik, v katerega se razreši.  
Oznaka ali po vrsti vsak od jezikov brskalnika se razreši v prvi jezik, ki ga urejevalnik podpira, po jezikovni podoznaki, ne glede na velikost črk in podčrtaje: `de-AT` da `de-DE`, `en-GB` pa `en`. Kitajščina se ravna po pisavi, pri čemer `Hant` da `zh-TW`, `Hans` pa `zh-CN`, brez pisave pa po regiji, pri čemer `TW`, `HK` in `MO` dajo `zh-TW`, vsaka druga pa `zh-CN`. `pt` da `pt-BR`, razen če je navedena regija, ki ni `BR`. Če se nič ne ujema, urejevalnik prikazuje angleščino.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Naloži datoteko Sheme SQL.  
Privzeto zamenja trenutni dokument, namesto da bi se z njim združila; glejte možnost `mode` spodaj. Obstoječe nastavitve se ohranijo, vključno z vsakim zaklepom in njegovo zaklenjeno vrednostjo, razen položaja pogleda in stopnje povečave, tabele pa se razporedijo, ko je datoteka prebrana, in sicer v vrstice, razen če spodnja možnost `placement` zahteva drugače. Ko je nastavitev `Viewport` zaklenjena, `value` nato zapiše pogled, na katerem se uvoz začne, izhodišče `0, 0` pri stopnji povečave `1`. Dokument, uvožen v element, ki nikoli ni dobil vrednosti, ima zato vklopljene vse zaklepe, tako kot nov dokument.  
Od različice `4.2.0` zamenjava ohrani tudi besede, izraze in domene dokumenta, ki jih besedilo ne more vsebovati, skupaj z zgodovino razveljavitev vsakega lista zavihka Slovar, ohrani pa jih tudi razveljavitev ali uveljavitev uvoza. Metoda [setSchemaJSON](#setschemajson) v načinu zamenjave in prirejanje `value` pa namesto tega prevzameta tiste, ki jih vsebuje njun dokument.  
Zabeleži se v zgodovino, kar omogoča `Undo, Redo`, in sproži dogodek `change`. Prazen niz se prezre, dokler je nastavljena lastnost `readonly`, pa klic ne naredi ničesar.  
`setSchemaGraphQL`, `setSchemaDBML` in `setSchemaAML` se obnašajo enako, njihovi razčlenjevalniki pa nikoli ne odpovejo: besedilo, ki ga ne morejo prebrati, naloži prazen dokument, namesto da bi prišlo do napake.  
Od različice `4.0.0` vse štiri sprejmejo neobvezen drugi argument `{ placement, mode }`:

- `placement: 'grid'`, privzeta vrednost, takoj razporedi tabele v vrstice, tako kot prej, klic pa ne vrne ničesar.
- `placement: 'auto'` tabele najprej razporedi glede na njihove relacije, tako kot `Import` v urejevalniku, in vrne `Promise`, ki se razreši, ko je uvoz zaključen kot en korak razveljavitve. Manj kot dve tabeli, odsotnost relacij, neuspešna postavitev, stran brez `SharedWorker` ali `Cancel` v pojavnem obvestilu `Placing tables` jih namesto tega razporedi v vrstice. Nalaganje v vmesnem času – drug uvoz z zamenjavo, prirejanje `value`, `setInitialValue()`, `clear()`, nalaganje sodelavca ali razveljavitev oziroma uveljavitev nalaganja ali klica `clear()` – ga izpodrine, `Promise` pa se razreši, ne da bi se kar koli naložilo. Uvozi, razporejeni na ta način, se zaključijo v vrstnem redu, v katerem so se začeli.
- `mode: 'replace'`, privzeta vrednost, zamenja dokument. `mode: 'append'` doda datoteko pod diagram, tako kot ukaz [Uvozi in dodaj](../guide/guides/file-import-export.md#import-and-add), in pusti vse obstoječe tabele takšne, kot so, prav tako vse nastavitve razen zavihka in položaja pogleda. Z drugega zavihka se najprej preklopi na zavihek ERD. Nove tabele in skupine tabel, ki jih prinese datoteka DBML, ko so skupine tabel prikazane, postanejo izbor, pogled pa se pomakne do njih, razen če so že dobro vidne, po pravilu, ki mu od različice `4.1.0` sledi vsak skok – glejte razdelek [Kam pripelje skok](../guide/guides/table-related-functions.md#where-a-jump-lands). Ena razveljavitev odstrani celoten dodatek. Besedilo, ki ga ne more prebrati, ne doda ničesar in pusti dokument takšen, kot je.

Dokler je nastavljena lastnost `readonly`, se zamenjava prezre, dodajanje ne doda ničesar, klic s `placement: 'auto'` pa se takoj razreši.  
Od različice `3.10.0` metoda `setSchemaSQL` bere datoteko glede na trenutno zbirko podatkov dokumenta: ko je izbran Databricks, nizi v enojnih narekovajih sledijo ubežnim zaporedjem z levo poševnico, kot jih uporablja Spark. Glejte razdelek [Komentarji](../guide/guides/file-import-export.md#comments).  
Od različice `3.10.0` metoda `setSchemaSQL` prebere `UNIQUE` nad dvema ali več stolpci kot en enoličen indeks in ne kot zastavico Enolično na vsakem stolpcu. Glejte razdelek [Enolični ključi in indeksi](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Od različice `3.10.0` uvozi SQL, DBML in AML ohranijo dejanja `ON DELETE` in `ON UPDATE` tujih ključev, ki jih preberejo.  
Od različice `4.0.0` metoda `setSchemaSQL` ohrani celoten izraz `DEFAULT` stolpca, prebere `ADD DEFAULT … FOR` in komentarje `MS_Description` zbirke podatkov SQL Server, stolpce serial in identity zbirke podatkov PostgreSQL pretvori v stolpce z zastavico Samodejno povečevanje, ohrani `UNSIGNED` in `ZEROFILL` v podatkovnem tipu ter prebere primarni ključ, ki ga `ALTER TABLE … ADD PRIMARY KEY` označi s `CLUSTERED`, `NONCLUSTERED` ali `USING BTREE`. Glejte razdelek [Shema SQL](../guide/guides/file-import-export.md#schema-sql).  
Za sintakso, ki jo sprejme posamezni razčlenjevalnik, glejte stran [Uvoz in izvoz datotek](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Naloži dokument GraphQL SDL.  
Definicije objektnih tipov postanejo tabele, polje, katerega tip je druga tabela, pa postane relacija.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Naloži datoteko DBML v formatu, ki ga uporabljata dbdiagram.io in dbdocs.  
Od različice `4.0.0` vsak `TableGroup` postane [skupina tabel](../guide/guides/table-groups.md), `headercolor` tabele pa postane njena barva. Glejte razdelek [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Naloži datoteko AML (Azimutt Markup Language). Sprejeta sta tako trenutni zapis kot starejši zapis v1.  
Od različice `4.0.0` barva entitete, bodisi eno od imen barv, ki jih pozna Azimutt, bodisi šestnajstiška vrednost v narekovajih, postane barva njene tabele. Glejte razdelek [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Od različice `4.0.0` naloži dokument `.erd.json`, na primer besedilo, ki ga vrne [value](#value).  
V privzetem načinu `mode: 'replace'` naloži dokument tako kot prirejanje `value`: zabeleži se v zgodovino, sproži dogodek `change` in na enak način prevzame zaklepe dokumenta, od različice `4.2.0` pa besede, izrazi in domene dokumenta zamenjajo tiste v urejevalniku. Za razliko od `value` se prazen niz ali vrednost, ki ni niz, prezre, namesto da bi se začel nov dokument. Besedilo, ki ni JSON, izprazni dokument, tako kot pri `value`.  
`mode: 'append'` doda tabele, relacije, indekse, beležke in skupine tabel dokumenta pod diagram z novimi identifikatorji, pri čemer ohrani njihove medsebojne položaje in izpusti nastavitve dokumenta, tako kot ukaz [Uvozi in dodaj](../guide/guides/file-import-export.md#import-and-add) z datoteko `json`. Od različice `4.2.0` ohrani logična imena in zastavice izpeljanih imen tabel in stolpcev, besede, izraze in domene dokumenta pa pusti ob strani, zato noben njegov stolpec ni povezan z domeno. Besedilo, ki ga ne more prebrati, ali dokument brez tabele in brez beležke ne doda ničesar. Sicer se doda tako kot pri dodajanju z metodo [setSchemaSQL](#setschemasql), pri čemer so nove beležke in skupine tabel izbrane skupaj s tabelami, vsaka vrsta, kadar je prikazana.  
Klic se vrne, ko je dokument naložen, dokler je nastavljena lastnost `readonly`, pa se prezre.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Izvozi trenutno stanje urejevalnika kot Shemo SQL.  
Če `databaseVendor` ni podan, deluje glede na trenutno nastavljeno vrsto zbirke podatkov. Ime, ki ga ni na spodnjem seznamu, se obravnava enako, brez napake.  
Imena se postavijo v narekovaje vrste, ki jo prikazuje urejevalnik. Ko je nastavitev `Bracket Type` [zaklenjena](../guide/guides/settings.md#lock), se ta lahko razlikuje od vrste, ki jo shrani `value`, s katero imena v narekovaje postavi orodje [`erd_read`](../mcp/tools.md#reading-a-document) agenta za kodiranje. Zapisana imena so vedno fizična, ne glede na prikaz imen.  
Od različice `4.0.0` neobvezni argument `options` izbere stavke in glavo, tako kot možnosti zavihka [Shema SQL](../guide/guides/schema-sql.md), od različice `4.2.0` pa tudi, ali logična imena zapolnijo prazne komentarje. `SchemaSQLOptions` se izvaža kot tip.

- `statements`: `'create'`, privzeta vrednost; `'ifNotExists'`, ki pri MySQL, MariaDB, PostgreSQL, SQLite in Databricks zapiše `IF NOT EXISTS`, drugod pa se vrne na `'create'`; ali `'recreate'`, ki tabele pred ustvarjanjem izbriše, pri čemer Snowflake namesto tega zapiše `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, privzeta vrednost; `'use'`, ki preklopi na zbirko podatkov ali shemo dokumenta; ali `'createAndUse'`, ki jo najprej ustvari, če ne obstaja, in nato preklopi nanjo. Zbirka podatkov, ki zahtevane možnosti nima, se vrne na nadomestno možnost tako kot zavihek: Oracle za `'createAndUse'` zapiše `'use'`, PostgreSQL za `'use'` ne zapiše glave, SQLite pa ne zapiše nobene. Glava se zapiše samo, kadar je ime zbirke podatkov dokumenta preprost identifikator – črke ASCII, števke in `_`, pri čemer se ne začne s števko.
- `logicalNameAsComment`, od različice `4.2.0`: `true` zapiše logično ime tabele ali stolpca kot komentar, kadar je komentar tabele ali stolpca prazen ali vsebuje samo presledke, logično ime pa ne, in sicer v obliki, v kateri ta zbirka podatkov zapiše komentar. Komentar z besedilom se zapiše tako kot prej. Vklopi jo samo `true`: izpuščena možnost, `false` ali katera koli druga vrednost, na primer `'true'` ali `1`, ne zapiše nobenega logičnega imena. Deluje enako kot stikalo [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) na zavihku.

Izpuščena možnost ali možnost z neznano vrednostjo se prebere kot privzeta, zato klic brez možnosti zapiše navadne stavke `CREATE` brez glave, tako kot prej.  
Od različice `4.0.0` izhod vedno vključuje skripta `Before tables` in `After tables` dokumenta, v vrstnem redu: glava, skript pred tabelami, stavki za brisanje, tabele, skript za tabelami. Lastne izbire `Statements`, `Header`, `Write logical names into empty comments` in `Tables` na zavihku Shema SQL nikoli ne vplivajo na ta klic, ki vedno zapiše celoten dokument.  
Od različice `3.10.0` vsak tuji ključ vsebuje določili `ON DELETE` in `ON UPDATE` relacije. Določilo se zapiše samo, kadar je njegovo dejanje nastavljeno in ga vrsta zbirke podatkov sprejema, zato je dejanje, ki ga ta vrsta ne podpira, izpuščeno in velja njeno privzeto dejanje. Od različice `4.0.0` Snowflake sprejema samo `NO ACTION`. Kaj zapiše posamezna zbirka podatkov, si oglejte v razdelku [ON DELETE in ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Od različice `3.10.0` se enojni narekovaj v komentarju tabele ali stolpca zapiše z ubežnim znakom, zato komentar, kot je `it's`, ne pokvari več stavka. Vsaka vrsta zbirke podatkov, ki komentarje zapisuje kot nizovne literale, ga podvoji, razen Databricks, ki pred vsak narekovaj in vsako levo poševnico postavi levo poševnico. SQLite komentarje še vedno zapisuje kot vrstice `--`.  
Od različice `4.2.0` SQL Server vsak komentar zapiše kot nacionalni literal, `N'…'`, zato se ohrani besedilo zunaj kodne strani zbirke podatkov, na primer korejsko. Oracle vsako zaporedje praznih vrstic v komentarju zapiše kot en prelom vrstice, SQLite pa prelome vrstic v komentarju zapiše kot presledke, tako da komentar ostane v svoji vrstici `--`. Glejte razdelek [Komentarji](../guide/guides/schema-sql.md#comments).  
Od različice `4.0.0` več zbirk podatkov drugače zapisuje tudi imena ključev, privzete vrednosti in samodejno povečevanje. Glejte razdelek [Kaj zapiše DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Vrne shrambo za sodelovalno urejanje v realnem času.  
`config` je `{ getNickname?, mouseTracker?, focusTracker? }`. Oba sledilnika imata privzeto vrednost `true`: `mouseTracker` drugim oddaja kazalec miške tega urejevalnika, `focusTracker` pa njegovo celico s fokusom, izbor in okvir izbora.  
Glejte stran [Sodelovalno urejanje](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Odpre pregledovalnik razlik, ki trenutno odprti dokument primerja s tistim, ki ga podate.  
Ne vrne ničesar in ne spremeni dokumenta, zato zaprtje pregledovalnika pusti urejevalnik natanko takšen, kot je bil.  
Prazna vrednost ali kar koli, kar ni niz, se primerja s praznim dokumentom.  
To je isto prekrivno okno kot postavka [Pregledovalnik razlik](../guide/guides/table-related-functions.md#diff-viewer) v priročnem meniju platna.  
Od različice `4.1.0` vsebino obeh dokumentov najprej poveže po identifikatorju in šele nato po tem, kar vsak hrani, na primer po imenu tabele ali besedilu beležke – glejte razdelek [Kaj se primerja](../guide/guides/table-related-functions.md#what-is-compared). V primerjavi s starejšo različico istega dokumenta, na primer z revizijo njegove datoteke v sistemu Git, se preimenovanje zato prikaže kot en preimenovan element; v primerjavi z dokumentom z drugačnimi identifikatorji se prikaže kot odstranitev in dodajanje. Pregledovalnik spremembe navede v drevesu ob obeh dokumentih in jih označi z barvo, namesto da bi zapolnil celice.  
Od različice `4.2.0` se oba dokumenta odpreta v prikazu imen, ki ga prikazuje ta urejevalnik, ne glede na to, kateri prikaz je shranil podani dokument, po njem pa tabele in stolpce poimenuje tudi drevo – glejte razdelek [Zunaj platna](../guide/guides/logical-names.md#beyond-the-canvas). Logična imena, povezave z domenami in slovarji se ne primerjajo, zato sprememba samo njih ne pokaže nobene spremembe.

```js
editor.setDiffValue('prev json...');
```
