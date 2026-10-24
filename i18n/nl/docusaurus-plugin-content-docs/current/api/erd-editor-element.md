---
sidebar_position: 2
description: De API van het erd-editor-element — attributen, value en runtimeValue, events, thema's, weergavetaal, het welkomstscherm, toetscombinaties en het importeren en exporteren van schema's.
---

# ErdEditorElement

De editor is een normaal `HTMLElement`.  
De typedefinitie is als volgt.

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

De editor rendert in een gesloten shadow root, zodat `editor.shadowRoot` `null` is en de stijlen van de pagina niet naar binnen of naar buiten lekken.  
Niets daarbinnen is met een selector te bereiken — pas de stijl in plaats daarvan aan via [setTheme](#settheme) en de custom properties `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` en `enable-welcome-screen` zijn de enige attributen, en alle vijf staan standaard op `false`. De laatste twee zijn nieuw in `4.0.0`. Elk ervan leest zijn waarde zoals [readonly](#readonly) beschrijft.

Sinds `4.1.0` heeft het ERD-tabblad een [Verkenner](../guide/guides/explorer.md), een boomstructuur van het diagram die links van het canvas is vastgezet, met Zoeken en vervangen bovenaan. Geen attribuut, eigenschap, methode of event opent of sluit hem of geeft zijn toestand door: hij opent via de knop `Explorer` op de werkbalk, via `Toggle Explorer` in Snel zoeken of in het contextmenu van het canvas, of met de toewijzing [`findReplace`](#setkeybindingmap).  
Elk element begint met de Verkenner gesloten. Of hij open is, zijn breedte, wat erin is samengevouwen en zijn zoekopdracht blijven behouden zolang het element bestaat, ook bij het wisselen van tabblad en bij elke laadactie, `setInitialValue` inbegrepen, en komen nooit in `value`, `runtimeValue`, de geschiedenis of een gedeelde store terecht.

Sinds `4.2.0` kunnen tabellen en kolommen naast hun namen [logische namen](../guide/guides/logical-names.md) hebben, en bepaalt de naamweergave, net als het tabblad een documentinstelling, of het canvas hun namen, hun logische namen of beide toont.  
De werkbalk heeft ook een tabblad [Woordenboek](../guide/guides/dictionary.md), tussen `Code Generator` en `Settings`, met de woorden, termen en domeinen van het document en een blad `Checks`. Het is een tabblad zoals de andere: zijn `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, valt onder de vergrendeling `Canvas Type`, zodat een tekst die op dit tabblad is opgeslagen, via [setInitialValue](#setinitialvalue) ook op dit tabblad opent, en alleen zolang die vergrendeling uitstaat, wordt wisselen naar dit tabblad in `value` geschreven en verstuurt het [change](#change). Geen eigen attribuut, eigenschap, methode of event opent het of geeft zijn toestand door. Zijn bewerkingen zijn wijzigingen in het document: ze staan in `value`, versturen [change](#change) en bereiken medebewerkers, maar ongedaan maken en opnieuw uitvoeren ervan werken op de eigen geschiedenis van elk blad, niet op die van het document.  
De eigen toestand van het tabblad — welk blad wordt getoond, eerst `Domains`, en de zoekopdracht, selectie, scrollpositie en kolombreedtes van elk blad — blijft behouden zolang het element bestaat, ook bij het wisselen van tabblad en bij elke laadactie, en komt nooit in `value`, `runtimeValue`, een geschiedenis of een gedeelde store terecht.  
De interface `ErdEditorElement` krijgt geen nieuw lid. Wat de API toevoegt, is `logicalNameAsComment` in de opties van [getSchemaSQL](#getschemasql), twaalf [thematokens](#settheme) en de export [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Bepaalt of de editor kan worden bewerkt.  
Zolang het is ingesteld, worden het toewijzen van `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, ongedaan maken en opnieuw uitvoeren, sinds `4.2.0` die van een woordenboekblad inbegrepen, allemaal genegeerd, en wordt het event `change` nooit verstuurd. Laad een document in plaats daarvan met [setInitialValue](#setinitialvalue).  
Bekijken werkt nog steeds: zoomen, pannen, het handgereedschap, de zen-modus, het canvastabblad, het tabblad [Visualisatie](../guide/guides/visualization.md) in beide modi, focussen op tabellen inbegrepen, het databasesysteem en de uitvoerinstellingen voor SQL en de Codegenerator blijven allemaal van kracht, zodat een viewer in alleen-lezenmodus nog steeds SQL voor een ander databasesysteem kan exporteren of gegenereerde code kan lezen.  
Sinds `4.1.0` opent ook de [Verkenner](../guide/guides/explorer.md#read-only-editors), en een van zijn rijen kiezen gaat naar wat die rij voorstelt, zoals in een bewerkbare editor. [Zoeken en vervangen](../guide/guides/find-and-replace.md#read-only-editors) bovenaan zoekt alleen, zonder de pijl `Toggle Replace` en zonder vervangrij, en naar een overeenkomst gaan brengt die nog steeds in beeld en selecteert die. Het paneel heeft de titel `Explorer`, en de knopinfo van de knop op de werkbalk is in elke editor `Explorer (Ctrl + F)` (Windows/Linux) of `Explorer (⌘ + F)` (Mac). Van `3.10.0` tot `4.0.0` opende Zoeken en vervangen als zwevend paneel dat alleen kon zoeken, met de titel `Find`.  
Het paneel Tabeleigenschappen opent nog steeds en toont sinds `3.10.0` een badge `Read only` naast zijn titel, en zijn tabblad `Indexes` biedt geen bewerkingen — zie [Tabeleigenschappen](../guide/guides/table-related-functions.md#table-properties).  
Sinds `4.0.0` biedt een editor in alleen-lezenmodus geen [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (zie [Tabelgroepen](../guide/guides/table-groups.md#read-only-editors)) of [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), en toont hij geen [welkomstscherm](#enablewelcomescreen). De vergrendelknoppen op het tabblad Instellingen veranderen niets, en de scripts `Before tables` en `After tables` van het tabblad Schema SQL kunnen niet worden bewerkt.  
Sinds `4.1.0` toont hij ook geen knop `New Table`, `New Memo` of `New Table Group` op de [canvaswerkbalk](../guide/guides/table-related-functions.md#canvas-toolbar), en doen de toewijzingen `addTableGroup` en `groupSelectedTables` niets.  
Sinds `4.2.0` wisselt de [naamweergave](../guide/guides/logical-names.md#read-only-editors) nog steeds via elk van haar kiezers, maar alleen op het scherm van die editor: wat haar vergrendeling ook aangeeft, het wisselen van weergave bereikt nooit medebewerkers. `Previous table` en `Next table` van de stroomweergave gaan nog steeds een stap terug en vooruit, via hun knoppen of de toetsen voor ongedaan maken en opnieuw uitvoeren.  
Het tabblad [Woordenboek](../guide/guides/dictionary.md#read-only-editors) opent nog steeds: je kunt van blad wisselen en in de bladen zoeken, selecteren, scrollen en eruit kopiëren, en een rij van het blad `Checks` gaat nog steeds naar wat ze noemt. Geen enkele cel accepteert een bewerking, plakken of wissen, het tabblad toont geen knop `Add Row`, `Delete Rows`, `Import CSV` of `Export CSV` en geen menu op het raster, en zijn rijtoetsen voegen niets in en verwijderen niets. Het tabelmenu, het contextmenu van het canvas en Snel zoeken bieden geen [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) of `Derive Physical Name Again`.  
De keuzes `This window only` van het tabblad Schema SQL, `Statements`, `Header`, sinds `4.2.0` `Write logical names into empty comments` en `Tables`, worden nooit opgeslagen en blijven van kracht, net als het dialoogvenster [`Export image`](../guide/guides/file-import-export.md#image), de themabouwer en de taalkiezer. Een keuze in de themabouwer of de taalkiezer verstuurt nog steeds [changePresetTheme](#changepresettheme) of [changeLocale](#changelocale).  
Een attribuut zonder waarde, `=""` en `="true"` worden allemaal gelezen als `true`. `="false"` wordt gelezen als `false`, net als elke andere string — ook het HTML-idioom `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Bepaalt of er automatisch wordt gesynchroniseerd met de donkere/lichte modus van het systeem.  
Sinds `4.0.0` zet inschakelen de `appearance` van het thema op `'system'`, zoals `setPresetTheme({ appearance: 'system' })` doet. De editor toont dan het lichte of donkere uiterlijk dat het besturingssysteem meldt, of het uiterlijk dat [setSystemAppearance](#setsystemappearance) noemt, en wisselt mee wanneer dat verandert.  
Een latere aanroep van [setPresetTheme](#setpresettheme) met `'light'` of `'dark'`, of een keuze voor `Light` of `Dark` in de themabouwer of Snel zoeken, vervangt `'system'` en blijft staan: de volgende wijziging in het besturingssysteem overschrijft die niet meer, ook al is `systemDarkMode` nog steeds `true`. Vóór `4.0.0` overschreef de volgende wijziging in het besturingssysteem die.  
Uitschakelen terwijl het uiterlijk `'system'` is, behoudt het lichte of donkere uiterlijk dat op dat moment wordt getoond. Uitschakelen nadat het uiterlijk van `'system'` naar iets anders is gewijzigd, laat het uiterlijk zoals het is.  
Het wijzigen ervan verstuurt geen event.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Bepaalt of er een UI wordt geboden om gemakkelijk vooraf ingestelde thema's in te stellen.  
Het toont de knop `Theme` op de werkbalk, die de themabouwer opent met `Accent color`, `Gray color` en `Appearance`. Sinds `4.0.0` biedt `Appearance` naast `Light` en `Dark` ook `System`, en zolang dit aanstaat, toont Snel zoeken `Theme` met `System`, `Light` en `Dark`. Zie [Taal en thema](../guide/guides/language-and-theme.md).

![De themabouwer openen vanaf de werkbalk, een accentkleur en een grijstint kiezen en het uiterlijk omzetten naar Light en daarna naar System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Het vooraf ingestelde thema wijzigen vanuit dit paneel, of vanuit Snel zoeken, verstuurt het event [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Bepaalt sinds `4.0.0` of er een UI wordt geboden om de weergavetaal van de editor te kiezen.  
Het toont de knop `Display Language` op de werkbalk, na `Theme` als beide worden getoond. De knop opent de taalkiezer, en Snel zoeken toont `Display Language`. Beide bieden `System` en de 25 talen — zie [Taal en thema](../guide/guides/language-and-theme.md).  
Het bepaalt ook wat een editor toont voordat [setLocale](#setlocale) wordt aangeroepen of een taal wordt gekozen: `'system'` zolang het aanstaat, Engels zolang het uitstaat, zodat een element dat niets configureert het Engels behoudt dat het altijd toonde. In- of uitschakelen wisselt direct tussen die twee. Zodra een taal is ingesteld of gekozen, blijft die keuze staan, of het nu aan- of uitstaat.  
Stel het in voordat het element wordt toegevoegd, zodat al het eerste frame `'system'` volgt.  
Een keuze verstuurt [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Bepaalt sinds `4.0.0` of een leeg diagram de lezer begroet met het [welkomstscherm](../guide/guides/editing-start.md#welcome-screen).  
Het ligt over het ERD-tabblad zolang het document geen tabel, geen getoonde memo en geen getoonde tabelgroep bevat. Het wordt niet getoond zolang `readonly` is ingesteld, in de zen-modus, of zolang Tabeleigenschappen, de Verschilweergave, Tijdreizen of het voorbeeld van Automatische indeling open is. De eerste tabel, getoonde memo of getoonde tabelgroep laat het verdwijnen, en ongedaan maken tot een leeg diagram brengt het terug.  
Zijn rijen `New Table`, `New Memo` en `Command Palette` tonen de eerste toetscombinatie van `addTable`, `addMemo` en `search` zoals [setKeyBindingMap](#setkeybindingmap) ze heeft achtergelaten, en geen voor een naam die leeg is gelaten. Zijn pijlen wijzen alleen naar de knoppen `Theme` en `Display Language` waar `enableThemeBuilder` en `enableLocalePicker` die tonen.  
In zijn menu bewegen `↑`, `↓`, `Home` en `End` tussen de rijen en worden ze geblokkeerd en gestopt. `Enter` en `Space` worden gestopt, niet geblokkeerd, zodat de rij met de focus ze ontvangt, en `Escape` bij de formaten van `Import` gaat terug, geblokkeerd en gestopt. Elke andere toets bereikt de editor en de pagina zoals gewoonlijk.  
Het verandert niets in het document, dus het laat `value` zoals het was en verstuurt geen `change`.  
Schakel het in zodra [setInitialValue](#setinitialvalue) het document heeft geladen, zoals de officiële hosts doen, zodat het scherm nooit even verschijnt boven een bestand dat nog wordt geladen.

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

Haalt het huidige document op als JSON-string, in het [schema](./advanced/schema.md) dat de editor definieert.  
Sinds `4.0.0` is het de opslagvorm, het document zoals een bestand het bevat, en dat is ook wat de export als `json` schrijft en wat de officiële hosts opslaan. Het bevat alleen de bestaande entiteiten, zonder de verwijderde, de stapelvolgorde of wat de editor zelf berekent, zoals gemeten breedtes, sleutelmarkeringen en ankerpunten van relaties. De sleutels van zijn entiteiten staan in een vaste volgorde, het springt in met twee spaties en het eindigt met een regeleinde, zodat hetzelfde document altijd dezelfde bytes oplevert.  
Sinds `4.2.0` laat het ook weg wat leeg is: een lege lijst in `doc`, een lege collectie, een woordenboekrij die niets bevat en een leeg tekstveld van een entiteit, zoals een naam, opmerking, gegevenstype, standaardwaarde of kleur. Een lijst binnen een entiteit, zoals `columnIds` van een tabel, wordt ook als die leeg is nog steeds geschreven. De `doc` van een nieuw document is `{}`, en het heeft geen `collections`, dus lees een ontbrekend veld, een ontbrekende lijst of een ontbrekende collectie als leeg. Het bevat de logische namen en de vlaggen voor afgeleide namen van tabellen en kolommen, de domeinkoppelingen van de kolommen en de woorden, termen en domeinen, waarbij elk woordenboek wordt geschreven als één koprij met veldnamen, gevolgd door zijn rijen, één rij per regel, in de volgorde van het blad. Zie [Opslagvorm en runtimewaarde](./advanced/schema.md#storage-form-and-runtime-value).  
Elke instelling waarvan de [vergrendeling](../guide/guides/settings.md#lock) aanstaat, wordt geschreven met de waarde waarop ze is vergrendeld, niet zoals het scherm haar toont. De vergrendeling `Viewport` bevat `originX`, `originY` en `zoomLevel`, en `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` en sinds `4.2.0` `Name View` bevatten elk hun eigen instelling. De naamweergave wordt geschreven als `nameViewMode`, en alleen zolang ze niet `'physical'` is. Elke andere instelling wordt geschreven zoals ze is, en `lockSettings` wordt altijd geschreven. Zie [Settings](./advanced/schema.md#settings) voor de bits; de bit van de vergrendeling `Name View` wordt andersom gelezen.  
In een nieuw document staan alle vergrendelingen aan, of het nu het document is dat een element toont voordat het een waarde krijgt, of een document dat uit een lege waarde is geladen. Zijn `value` houdt de oorsprong op `0, 0`, het zoomniveau op `1`, het ERD-tabblad, de standaardtaal, de standaardnaamnotaties en het standaardtype aanhalingstekens van de Codegenerator en sinds `4.2.0` `Physical Names` vast totdat de bijbehorende vergrendeling wordt uitgeschakeld.  
Vóór `4.0.0` gaf het het hele document terug zoals de editor het bijhield, met `ignoreSaveSettings` toegepast. Het document zoals de editor het bijhoudt, is nu [runtimeValue](#runtimevalue), en `ignoreSaveSettings` wordt niet meer gelezen of geschreven.

```js
const data = editor.value;
```

### setter {#setter}

Laadt een eerder opgeslagen editorstatus. Het vervangt het hele document — het huidige wordt eerst gewist. Sinds `4.2.0` horen daar ook de woorden, termen en domeinen bij: het document krijgt die uit de tekst, of geen, en de eigen geschiedenis van elk woordenboekblad wordt leeggemaakt.  
Net als `clear()`, `setInitialValue()` en de methoden `setSchema*` in hun standaardmodus `mode: 'replace'` wist het ook de stroomweergave van het tabblad Visualisatie: de indeling, de tabellen waartoe die is beperkt, de rijweergave, het zoomniveau en de panpositie, en sinds `4.2.0` de tabellen waar `Previous table` en `Next table` ervan doorheen stappen. Een toevoeging (`mode: 'append'`) wist die niet.  
Het wordt in de geschiedenis vastgelegd, wat `Undo, Redo` mogelijk maakt, en het verstuurt `change`.  
Het accepteert de opslagvorm, een [runtimeValue](#runtimevalue) of een bestand dat een eerdere versie heeft opgeslagen.  
Een lege string, of alles wat geen string is, laadt een nieuw document in plaats van een fout te geven, dus controleer de waarde voordat je die toewijst.  
Dat nieuwe document is het document waarmee `setInitialValue('')` begint: leeg, met standaardinstellingen en sinds `4.0.0` met alle vergrendelingen aan. In `3.10.x` sloeg het de scrollpositie noch het zoomniveau op, en daarvóór sloeg het beide op.  
Een gedeelde store stuurt die laadactie door naar medebewerkers met de volledige JSON van het nieuwe document, zodat elke peer, ook een oudere versie, het laadt, al laat een editor van vóór `4.2.0` weg wat hij niet kent, zoals de logische namen, domeinkoppelingen en woordenboeken — zie [Versies combineren](./advanced/collaborative-editing.md#mixing-releases).  
Sinds `4.0.0` komen de vergrendelingen van het geladen document, en de vergrendelde waarden die `value` daarna schrijft, uit de tekst, en komt de weergave terecht waar de tekst haar plaatst, of op het diagram als daar niets ervan wordt getekend. Voor elke andere instelling die de tekst vergrendelt — het tabblad, de taal van de Codegenerator, de naamnotaties, het type aanhalingstekens en sinds `4.2.0` de naamweergave — blijft de editor tonen wat hij vóór het laden toonde. Een instelling die de tekst niet vergrendelt, krijgt de waarde uit de tekst. Een bestand dat vóór `4.2.0` is opgeslagen, noemt geen vergrendeling `Name View`, tenzij een editor van `4.2.0` die vergrendeling erin heeft uitgeschakeld, dus het laadt met de naamweergave vergrendeld op `Physical Names`, en de editor behoudt de naamweergave die hij toonde. [setInitialValue](#setinitialvalue) neemt daarentegen elke waarde uit de tekst over; zie die methode ook voor een tekst die geen vergrendelingen noemt.  
Tekst die geen JSON is, zoals een bestand met achtergebleven markeringen van een merge-conflict, geeft evenmin een fout: het document wordt leeggemaakt, de instellingen blijven zoals ze waren en de parseerfout wordt in de console gelogd.  
Het wordt genegeerd zolang `readonly` is ingesteld; gebruik [setInitialValue](#setinitialvalue) om in een editor in alleen-lezenmodus te laden.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Haalt sinds `4.0.0` het document op zoals deze editor het bijhoudt, als JSON-string. Het heeft geen setter, dus een toewijzing geeft in code in strict mode een fout.  
Het bevat wat [value](#value) weglaat: verwijderde entiteiten en hun volgorde, de stapelvolgorde, gemeten breedtes, sleutelmarkeringen, ankerpunten van relaties en volgordes, en sinds `4.2.0` de lege tekstvelden, lijsten in `doc` en collecties; de rijen die van een woordenboekblad zijn verwijderd en de rijen die niets bevatten; de volgordesleutel van elke woordenboekrij; de lijsten in `doc` voor woorden, termen en domeinen; en een koppeling aan een verwijderd domein. Vergrendelde instellingen worden ook hier met hun vergrendelde waarden geschreven.  
Gebruik het om een andere editor die aansluit bij een sessie die al loopt, zoals een medebewerker of een tweede weergave van hetzelfde document, te initialiseren via zijn [setInitialValue](#setinitialvalue). Wanneer de sessie later het ongedaan maken van een verwijdering stuurt, herstelt dat de entiteit daar dan in zijn geheel, terwijl een editor die vanuit `value` is geïnitialiseerd, geen verwijderde entiteit bevat en in plaats daarvan een lege tabel zonder naam, of sinds `4.2.0` een lege woordenboekrij, herstelt. Zie [Gezamenlijk bewerken](./advanced/collaborative-editing.md).  
Niets ruimt verwijderde entiteiten nog op, dus ze blijven erin staan totdat het document de volgende keer uit zijn bestand wordt geopend.  
Schrijf het nooit naar een bestand: sla `value` op, dat het [JSON Schema](./advanced/schema.md#json-schema) accepteert, in tegenstelling tot dit.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Laadt een eerder opgeslagen editorstatus. Het laden zelf wordt niet in de geschiedenis vastgelegd, dus het kan niet ongedaan worden gemaakt, en er wordt geen event `change` verstuurd.  
Het wist ook de geschiedenis, zodat niets wat vóór het laden is gedaan op het geladen document ongedaan kan worden gemaakt of opnieuw kan worden uitgevoerd, en sinds `4.2.0` ook de eigen geschiedenis van elk woordenboekblad.  
Het accepteert de opslagvorm, een [runtimeValue](#runtimevalue) of een bestand dat een eerdere versie heeft opgeslagen, en anders dan het toewijzen van `value` neemt het elke instelling uit de tekst over, het tabblad en de code-instellingen inbegrepen.  
Een lege string, of alles wat geen string is, laadt een nieuw document in plaats van een fout te geven, dus `setInitialValue('')` begint een leeg diagram.  
Sinds `4.0.0` staan in dat nieuwe document, dat ook is wat een element toont voordat het een waarde krijgt, alle vergrendelingen aan. Scrollen, zoomen, van tabblad wisselen en de taal van de Codegenerator, de naamnotaties, het type aanhalingstekens of sinds `4.2.0` de naamweergave wijzigen laten `value` zoals het was en versturen geen `change`. In `3.10.x` sloeg het de scrollpositie noch het zoomniveau op, en daarvóór sloeg het beide op.  
Een document dat uit tekst is geladen, behoudt de vergrendelingen die het noemt. Een document dat er geen noemt — elk bestand dat vóór `4.0.0` is opgeslagen, wat zijn `ignoreSaveSettings` ook aangaf, en een `.vuerd`-bestand van v2 — opent met alle vergrendelingen aan, met `Viewport` vergrendeld op oorsprong `0, 0` en zoomniveau `1`, op het ERD-tabblad, en met zijn taal, naamnotaties en type aanhalingstekens zoals het die heeft opgeslagen.  
Sinds `4.2.0` opent een tekst die zijn vergrendelingen noemt, maar niet de vergrendeling `Name View`, ook met die vergrendeling aan, zelfs als elke andere vergrendeling uitstaat. Een bestand dat vóór `4.2.0` is opgeslagen, is zo'n tekst, tenzij een editor van `4.2.0` die vergrendeling erin heeft uitgeschakeld (zie [Settings](./advanced/schema.md#settings)). Het opent in de weergave `Physical Names`, net als een tekst die helemaal geen vergrendeling noemt.  
In beide gevallen opent de weergave op die van het document — de weergave die de tekst heeft opgeslagen als die zijn vergrendelingen noemt, oorsprong `0, 0` bij zoomniveau `1` als die er geen noemt — of op het diagram als daar niets ervan wordt getekend. Een vergrendelde `Viewport` behoudt zijn vergrendelde waarden nog steeds in `value`.  
Sinds `4.0.0` verwijdert het ook de samenwerkingsstatus van het document dat het daarvoor bevatte, en vraagt een [gedeelde store](#getsharedstore) van deze editor die al is geabonneerd, de andere editors opnieuw om de hunne, zodat een editor die in een lopende sessie opnieuw wordt geladen, zijn achterstand inhaalt. Initialiseer zo'n editor met de [runtimeValue](#runtimevalue) van een andere editor.  
Tekst die geen JSON is, geeft evenmin een fout: het document wordt leeggemaakt, de instellingen blijven zoals ze waren en de parseerfout wordt in de console gelogd.  
Anders dan het toewijzen van `value` wordt het niet door `readonly` geblokkeerd, dus hiermee laad je een document in een viewer in alleen-lezenmodus.

```js
editor.setInitialValue('json...');
```

Laden bij het starten, opslaan bij een wijziging.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Event {#event}

`change`, `changePresetTheme` en `changeLocale` zijn de enige drie openbare events; `changeLocale` is nieuw in `4.0.0`.  
Het element verstuurt voor zijn eigen interne werking ook interne events `@dineug/erd-editor/internal-*` op zichzelf; die maken geen deel uit van de API.

### change {#change}

Als er wijzigingen in de editor zijn, verstuurt de editor een event.  
Het event heeft een debounce van 200 ms en wordt niet verstuurd zolang `readonly` `true` is.  
Het treedt op bij elke wijziging in het document — een bewerking in de UI, het toewijzen van `value`, `clear()`, elk van de methoden `setSchema*` en sinds `4.0.0` `setSchemaJSON()` en `Import and Add`. `setInitialValue` verstuurt het niet.  
Sinds `4.2.0` horen daar ook bij: elke bewerking op het tabblad [Woordenboek](../guide/guides/dictionary.md) en elk ongedaan maken of opnieuw uitvoeren daarvan, een wijziging van een logische naam of een domeinkoppeling, `Derive Physical Names Again` en het wisselen van de naamweergave zolang de vergrendeling `Name View` uitstaat.  
Niets wat je in de stroommodus van het tabblad Visualisatie doet, verstuurt het — zoomen, pannen, kaarten verplaatsen, `Tidy Up`, de rijweergave, de weergave vanuit een kaart beperken of sinds `4.2.0` stappen met `Previous table` en `Next table` of de toetsen voor ongedaan maken en opnieuw uitvoeren — omdat niets daarvan een wijziging in het document is. De lijst `Name View` daar is de uitzondering: wisselen daarin verstuurt het zolang de vergrendeling `Name View` uitstaat, net als op het ERD-tabblad.  
Sinds `4.0.0` verstuurt een wijziging van een instelling waarvan de [vergrendeling](../guide/guides/settings.md#lock) aanstaat het evenmin, omdat die alleen het scherm verandert en nooit `value`: scrollen of zoomen op het ERD-canvas terwijl `Viewport` is vergrendeld, een tabbladwissel terwijl `Canvas Type` is vergrendeld, een wijziging van de taal van de Codegenerator, de notatie van tabelnamen, de notatie van kolomnamen of het type aanhalingstekens terwijl de eigen vergrendeling daarvan aanstaat, en sinds `4.2.0` het wisselen van de naamweergave terwijl `Name View` is vergrendeld. Alleen die wijzigingen worden uitgesloten, dus een batch die ook het document bewerkt, verstuurt het nog steeds. Het vergrendelen of ontgrendelen van een instelling verstuurt het.  
In een nieuw document en in elk bestand dat vóór `4.0.0` is opgeslagen, staan alle vergrendelingen aan, en de vergrendeling `Name View` staat aan in elk bestand dat vóór `4.2.0` is opgeslagen, tenzij een editor van `4.2.0` haar daar heeft uitgeschakeld, dus standaard versturen scrollen, zoomen, van tabblad wisselen en de naamweergave wisselen niets. Dat geldt ook voor focussen op tabellen vanaf het ERD-tabblad, de kaartknop met de externe link die je vanuit de stroomweergave terugbrengt naar het ERD-tabblad, naar een rij in de Verkenner of een zoekovereenkomst gaan, de Verkenner openen of naar een resultaat van Snel zoeken gaan vanaf een ander tabblad, en sinds `4.2.0` naar een tabel of kolom gaan vanuit een rij van het blad `Checks` van het tabblad Woordenboek. Elk daarvan verstuurt één `change`, maar alleen zolang een vergrendeling die het dekt uitstaat: `Canvas Type` voor de tabbladwissel, en `Viewport` voor het scrollen dat een kaartknop, een resultaat van Snel zoeken, een rij in de Verkenner, een zoekovereenkomst of een rij van `Checks` ook veroorzaakt. Sinds `4.1.0` volgt elk van die scrollbewegingen één regel, [Waar een sprong terechtkomt](../guide/guides/table-related-functions.md#where-a-jump-lands), zodat een tabelresultaat van Snel zoeken niet meer elke keer scrolt, en een sprong die de regel op zijn plaats laat, maakt geen scrollbeweging die iets kan versturen. De Verkenner openen, sluiten of zijn grootte wijzigen maakt het canvas smaller of breder zonder de oorsprong te verplaatsen, en verstuurt evenmin iets. Vóór `4.0.0` verstuurden scrollen, zoomen en van tabblad wisselen het altijd, ook als `editor.value` gelijk bleef.  
Om schrijfacties over te slaan die niets veranderen, vergelijk je `editor.value` met de waarde die je het laatst hebt opgeslagen, niet met het bestand dat je hebt geladen: een bestand dat een eerdere versie heeft geschreven, een v2-bestand of een met de hand bewerkt bestand kan in `value` anders uitkomen zodra het is geladen, omdat `value` het in de opslagvorm schrijft. Hetzelfde geldt voor een bestand waarvan de vergrendeling `Viewport` uitstaat en waarvan de oorsprong op dit scherm niets van het diagram toont: het laden verplaatst de weergave naar het diagram en `value` schrijft waar die terechtkomt. Sinds `4.0.0` veroorzaken gemeten breedtes dit niet meer, omdat `value` er geen bevat. Sinds `4.2.0` kan ook een bestand dat `4.0.0` of `4.1.0` heeft opgeslagen anders uitkomen, omdat `value` nu de lege tekstvelden, lijsten en collecties ervan weglaat, dus zo'n bestand wordt één keer herschreven, bij de volgende keer opslaan. Een host die bestanden schrijft, kan in plaats daarvan met `changed` van een replicatiestore een bewerking onderscheiden van een wijziging van de weergave — zie [on@change](./advanced/remote-storage.md#onchange).  
Het event heeft geen `detail`, borrelt niet op en passeert de grens van de shadow root niet, dus luister op het element zelf en lees `editor.value` in de handler.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Wordt verstuurd wanneer het vooraf ingestelde thema wordt gewijzigd vanuit de ingebouwde themabouwer, of sinds `4.0.0` vanuit `Theme` in Snel zoeken. Elke keuze verstuurt het, ook een keuze voor de optie die al actief is.  
Zelf [setPresetTheme](#setpresettheme) of [setSystemAppearance](#setsystemappearance) aanroepen, of [systemDarkMode](#systemdarkmode) in- of uitschakelen, verstuurt het niet.  
`event.detail` is de volledige `ThemeOptions` na de keuze — `{ appearance, grayColor, accentColor }` — niet het gedeeltelijke object dat werd aangevraagd. Sinds `4.0.0` is de `appearance` daarvan `'system'` zolang `System` is gekozen, niet het lichte of donkere uiterlijk dat wordt getoond, dus sla het op zoals het is en geef het terug aan `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Wordt sinds `4.0.0` verstuurd wanneer in de editor een taal wordt gekozen, in de taalkiezer of via `Display Language` in Snel zoeken, die allebei door [enableLocalePicker](#enablelocalepicker) worden ingeschakeld.  
Het treedt op nadat de taal is toegepast, bij elke keuze, ook een keuze voor de optie die al actief is. [setLocale](#setlocale) en [setSystemLocale](#setsystemlocale) versturen het nooit, en een wijziging van de talen van de browser evenmin. Een taalwissel verstuurt geen `change`.  
`event.detail` is `{ locale }`, een `LocaleOption`: `'system'` als `System` is gekozen, anders de code van de taal. Het element onthoudt de keuze niet, dus sla die op en geef die bij de volgende keer laden door aan `setLocale`.  
Net als `change` borrelt het niet op, dus luister op het element zelf.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Geeft de editor de focus.

```js
editor.focus();
```

## blur {#blur}

Haalt de focus van de editor weg.

```js
editor.blur();
```

## clear {#clear}

Maakt het document leeg en verwijdert elke tabel, kolom, relatie, index en memo, sinds `4.0.0` elke tabelgroep en sinds `4.2.0` de woorden, termen en domeinen van het tabblad Woordenboek, waarbij ook de eigen geschiedenis van elk blad wordt leeggemaakt.  
Alle instellingen blijven behouden, waaronder de database, de weergavepositie, het zoomniveau, de weergaveopties voor tabellen, elke vergrendeling met de waarde die ze bevat en de scripts `Before tables` en `After tables` van het tabblad Schema SQL, zodat een leeggemaakt bestand blijft opslaan wat het opsloeg. Wijs `''` toe aan `value` of roep `setInitialValue('')` aan om in plaats daarvan een nieuw document te beginnen.  
Het wordt in de geschiedenis vastgelegd, dus het kan ongedaan worden gemaakt, en het verstuurt `change`. Ongedaan maken brengt het document terug zoals de editor het bijhield, zijn woorden, termen en domeinen inbegrepen, elke vergrendelde instelling op haar vergrendelde waarde. Het wordt genegeerd zolang `readonly` is ingesteld.

```js
editor.clear();
```

## destroy {#destroy}

Vernietigt de editorinstantie volledig, zodat die niet meer opnieuw kan worden gebruikt.  
Het geeft de listeners en abonnementen van de editor vrij en vernietigt elke gedeelde store die [getSharedStore](#getsharedstore) heeft teruggegeven.  
Een streambatch die een gedeelde store nog vasthoudt, gaat daarbij verloren; roep eerst [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) van die store aan om die te versturen.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Definieert sneltoetsen opnieuw.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` en `zoomReset` liggen vast en kunnen niet opnieuw worden gedefinieerd.  
Alleen de eenentwintig namen hieronder worden geschreven; al het andere in het object wordt genegeerd, ook de vaste namen.  
Sinds `3.10.0` kan `search` opnieuw worden gedefinieerd en is `findReplace` nieuw. Daarvóór lag `search` vast. Sinds `4.0.0` is `removeSelection` nieuw. Sinds `4.1.0` zijn `addTableGroup` en `groupSelectedTables` nieuw.  
De waarde van een toewijzing moet een `ShortcutOption[]` zijn. Een losse string wordt genegeerd, dus schrijf `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` in plaats van `{ addTable: 'Alt+KeyN' }`.  
Een lege array wordt geaccepteerd en wijst niets toe: `setKeyBindingMap({ findReplace: [] })` laat `Ctrl + F` (Windows/Linux) of `⌘ + F` (Mac) over aan de pagina, en `{ search: [] }` doet hetzelfde voor `Ctrl + K` (Windows/Linux) of `⌘ + K` (Mac). De knop `Search` op de werkbalk opent nog steeds Snel zoeken, de knop `Explorer` op de werkbalk opent en sluit nog steeds de Verkenner, en `Toggle Explorer` in Snel zoeken en in het contextmenu van het canvas opent nog steeds de zoekfunctie van de Verkenner of sluit hem; geen van deze toont een sneltoets voor een naam die leeg is gelaten. `{ removeSelection: [] }` laat `Delete` en `Backspace` over aan de pagina, en de verwijderitems in de menu's van tabellen, memo's en tabelgroepen (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) tonen dan geen sneltoets.  
Sinds `4.1.0` laat `{ addTableGroup: [] }` `Alt + G` (Windows/Linux) of `⌥ + G` (Mac) over aan de pagina, en laat `{ groupSelectedTables: [] }` `T` en daarna `G` over. `New Table Group` op de canvaswerkbalk, in het contextmenu van het canvas en in Snel zoeken, `Group selected tables` in het tabelmenu en `Group Selected Tables` in Snel zoeken werken nog steeds, zonder dat er een sneltoets wordt getoond. De knopinfo van de knoppen `New Table`, `New Memo` en `New Table Group` op de canvaswerkbalk noemt de eerste toetscombinatie van `addTable`, `addMemo` en `addTableGroup`, of alleen de knop voor een toewijzing die leeg is gelaten.  
Sinds `4.2.0` geven `addColumn` en `removeColumn` ook het raster van het tabblad Woordenboek zijn rijtoetsen, zoals hieronder beschreven, dus als je een van beide opnieuw toewijst, verschuiven die toetsen mee. `{ addColumn: [] }` laat het raster geen toetscombinatie om rijen in te voegen, en de twee invoegitems van het rastermenu tonen dan geen sneltoets; `{ removeColumn: [] }` laat het er geen om ze te verwijderen, en het verwijderitem van het menu en de knopinfo van `Delete Rows` tonen dan geen sneltoets.  
De aanroep is een gedeeltelijke samenvoeging: namen die je weglaat, behouden hun standaardwaarden, en bij een tweede aanroep blijven de eerdere wijzigingen behouden. Er is geen getter voor de huidige toewijzingen: [createKeyBindingMap](#createkeybindingmap) geeft de standaardwaarden terug, niet wat `setKeyBindingMap` heeft gewijzigd.

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

`selectAllTable`, `handTool`, `removeSelection` en sinds `4.1.0` `groupSelectedTables` maken plaats voor een tekstcursor: zolang de focus in een invoerveld, een textarea of een `contenteditable` staat, selecteert `$mod + A` de tekst, typt `Space` een spatie, wissen `Delete` en `Backspace` tekst en typen `T` en daarna `G` de twee letters, in plaats van het canvas te bereiken. Geen van die toetsaanslagen wordt geblokkeerd. Waaraan je ze ook opnieuw toewijst, het gedrag blijft hetzelfde.

Sinds `4.0.0` verwijdert `removeSelection` (`Delete` of `Backspace`) de selectie op het ERD-tabblad als één stap in de geschiedenis, zonder te vragen. Als de tabel met de focus het enige geselecteerde item is, een of meer van haar kolommen zijn geselecteerd en het zoomniveau haar rijen tekent, verwijdert het die kolommen; anders verwijdert het elke geselecteerde tabel, memo en tabelgroep, waarbij de tabellen van een groep behouden blijven. Zie [Tabellen en memo's verwijderen](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Een ingedrukt gehouden toets verwijdert één keer, en er wordt niets verwijderd zolang een editor voor een cel, memo of tabelgroepnaam open is. Buiten een tekstveld en de panelen en tabbladen die toewijzingen tegenhouden (zie [createKeyBindingMap](#createkeybindingmap)) wordt de toetsaanslag op elk tabblad geblokkeerd zolang de editor de focus heeft, ook op een werkbalkknop met de focus en in een editor in alleen-lezenmodus, waar hij niets verwijdert.

Sinds `4.1.0` activeert `addTableGroup` (`Alt+KeyG`) op het ERD-tabblad het tekenen van `New Table Group`, waarbij de volgende druk op de hoofdmuisknop op het canvas de groep tekent, en nogmaals drukken deactiveert het tekenen, zoals de knop `New Table Group` op de canvaswerkbalk doet. `groupSelectedTables` (`KeyT KeyG`, `T` en daarna `G`) plaatst de geselecteerde tabellen in een nieuwe groep en opent de naameditor ervan, zoals `Group selected tables` in het contextmenu van een tabel doet. Zonder geselecteerde tabel voegt het niets toe; een geselecteerde memo of tabelgroep telt niet mee. Zie [Een groep tekenen](../guide/guides/table-groups.md#drawing-a-group) en [Geselecteerde tabellen groeperen](../guide/guides/table-groups.md#grouping-selected-tables).  
Beide werken alleen waar de menu's een groep aanbieden: niet zolang `readonly` is ingesteld, zolang de weergaveoptie `Table Groups` de groepen verbergt of zolang een editor voor een cel, memo of tabelgroepnaam open is. Net als de andere canvastoewijzingen werken ze alleen op het ERD-tabblad, en niet zolang Snel zoeken, Tabeleigenschappen, de Verschilweergave, Tijdreizen, het voorbeeld van Automatische indeling, `Export image` of `Map Columns` open is. Waar ze niets doen, wordt de toetsaanslag toch geblokkeerd, tenzij `groupSelectedTables` plaatsmaakt voor een tekstcursor. `addTableGroup` wordt ook gestopt, net als `focusView` en `zenMode`, zodat een `keydown`-listener van een pagina in de bubbelfase hem nooit ontvangt.

Sinds `4.2.0` voegt op het tabblad [Woordenboek](../guide/guides/dictionary.md#adding-and-deleting-rows) elke toetscombinatie van één toetsaanslag van `addColumn` zoveel rijen onder de selectie in als de selectie beslaat, voegt dezelfde toetscombinatie met ook `Shift` ingedrukt ze erboven in, en verwijdert elke toetscombinatie van één toetsaanslag van `removeColumn` de rijen die de selectie beslaat: met de standaardwaarden `Alt+Enter`, `Alt+Shift+Enter` en `Alt+Backspace` of `Alt+Delete`. Ze werken in het raster van de bladen `Domains`, `Words` en `Terms` zolang er geen celbewerking open is. Een toetscombinatie van `addColumn` die al `Shift` bevat, levert geen toetscombinatie op om erboven in te voegen, en een reeks die aan een van beide namen is toegewezen, geeft het raster niets.  
Elk van die toetsaanslagen wordt geblokkeerd zoals de optie ervan aangeeft en altijd gestopt, zodat ze op het ERD-tabblad geen kolom toevoegen of verwijderen. Op het blad `Checks` en in een editor in alleen-lezenmodus doen ze niets, al worden ze nog steeds geblokkeerd en gestopt. In een geopende celbewerking of het zoekveld van het tabblad worden de toetscombinaties aan de tekst overgelaten: ze worden daar gestopt maar niet geblokkeerd, zodat het veld erop reageert zoals het overal zou doen (op een Mac verwijdert `⌥ + Backspace` een woord). [dictionaryRowChords](#dictionaryrowchords) somt ze op.

Sinds `3.10.0` opent `findReplace` (`$mod+KeyF`) [Zoeken en vervangen](../guide/guides/find-and-replace.md). Sinds `4.1.0` schakelt het de [Verkenner](../guide/guides/explorer.md#opening-and-closing), waarin Zoeken en vervangen zit, in en uit, en toont het tabblad Sneltoetsen het als `Toggle Explorer`.  
Zolang de knop `Explorer` op de werkbalk ingedrukt wordt weergegeven (de Verkenner open op het ERD-tabblad en niet verborgen door de zen-modus), sluit het de Verkenner, tenzij Snel zoeken, Tabeleigenschappen, de themabouwer, de taalkiezer, het dialoogvenster `Export image` of `Map Columns` open is. Anders sluit het wat daarvan open is, haalt het het ERD-tabblad naar voren vanaf elk ander tabblad en opent het de Verkenner met de tekstcursor in het veld `Find` en de zoekopdracht geselecteerd. Een editor die te smal is om de Verkenner naast het canvas te tonen, houdt hem open maar opzij en toont de melding `Widen the window to show the Explorer`. Vóór `4.1.0` opende het het zwevende paneel Zoeken en vervangen, of gaf het het veld daarvan het toetsenbord terug, en sloot het dat paneel nooit.  
Het maakt geen plaats voor een tekstcursor: zolang de editor de focus heeft, wordt het op elk tabblad opgevangen, vanaf het canvas of vanuit een invoerveld in de editor. De toetsaanslag wordt geblokkeerd, zodat de browser geen zoekbalk opent, en gestopt, zodat geen `keydown`-listener van de pagina in de bubbelfase hem ontvangt. Met een editor voor een cel of memo open, sinds `4.0.0` een editor voor een tabelgroepnaam, of sinds `4.2.0` een celbewerking in het raster van het tabblad Woordenboek, wordt het nog steeds geblokkeerd en gestopt, maar doet het niets. In dat laatste geval doet ook `search` niets, zodat de tekst die tot dan toe is getypt, behouden blijft.  
Zolang de Verschilweergave, Tijdreizen of het voorbeeld van Automatische indeling open is, op welk tabblad dan ook, of zolang een invoermethode (IME) nog tekst samenstelt, wordt het niet geblokkeerd en niet gestopt, zodat de eigen zoekfunctie van de browser of de host het ontvangt. In de Verkenner wordt een toetsaanslag tijdens het samenstellen wel gestopt, maar niet geblokkeerd. Waaraan je `findReplace` ook opnieuw toewijst, het gedrag blijft hetzelfde.

`focusView` werkt alleen op het ERD-tabblad. Met ten minste één geselecteerde tabel opent het het tabblad Visualisatie in de stroommodus, beperkt tot die tabellen en elke tabel die één relatie verderop ligt; een geselecteerde memo of tabelgroep telt niet mee, en zonder geselecteerde tabel doet het niets. Zie [Focussen op tabellen](../guide/guides/visualization.md#focusing-on-tables).

`undo` en `redo` werken per tabblad. Op het ERD-tabblad werken ze op de geschiedenis van het document. Sinds `4.2.0` werken ze op het tabblad Woordenboek op de eigen geschiedenis van het getoonde blad, en doen ze op het blad `Checks` niets — zie [Woordenboekbladen](../guide/guides/undo-redo.md#dictionary-sheets). In de stroommodus van het tabblad Visualisatie gaan ze een stap terug en vooruit zoals [`Previous table` en `Next table`](../guide/guides/visualization.md#previous-table-and-next-table) doen, en laten ze de geschiedenis van het document met rust. Op de andere tabbladen, en in de graafmodus, maken ze niets ongedaan.

`stop` (`Escape`) beëindigt op het ERD-tabblad een geopende editor voor een cel of memo, of een relatie die wordt getekend, en laat de selectie zoals ze is. Sinds `4.0.0` beëindigt het ook een editor voor een tabelgroepnaam, zonder een naam te schrijven, en het tekenen van `New Table Group`. De editor roept bij die toetsaanslag `preventDefault()` aan.  
Als geen daarvan open is, heft `Escape` de selectie op en haalt hij de focus van de cel weg, en wordt hij niet geblokkeerd. Een bewerking verlaten en de selectie opheffen kost daarom twee toetsaanslagen.  
Sinds `4.2.0` sluit de eerste `Escape`, zolang de termenlijst van een cel van een logische naam wordt getoond (zie [Termnamen aanvullen](../guide/guides/logical-names.md#completing-term-names)), alleen de lijst en laat hij de editor open. Die toetsaanslag wordt bij de cel geblokkeerd en gestopt, zodat noch `stop` noch een `keydown`-listener van een pagina in de bubbelfase hem ontvangt.  
Behalve in de Verkenner, de formaten van `Import` op het [welkomstscherm](#enablewelcomescreen), de termenlijst van een cel van een logische naam, het tabblad [Woordenboek](../guide/guides/dictionary.md#keys-on-the-tab) en de kiezers en dialoogvensters hieronder stopt de editor de propagatie van `Escape` nooit, zodat een pagina die er zelf naar luistert, bijvoorbeeld om een eigen dialoogvenster te sluiten, beide toetsaanslagen ontvangt en de toetsaanslag kan overslaan waarvan `defaultPrevented` `true` is.  
Zolang Snel zoeken, Tabeleigenschappen, de Verschilweergave, het voorbeeld van Automatische indeling of Tijdreizen open is, sluit `Escape` in plaats daarvan dat onderdeel en laat het de selectie zoals ze is. Die toetsaanslag wordt evenmin geblokkeerd.  
Sinds `4.0.0` vangt ook een geopend dialoogvenster [`Export image`](../guide/guides/file-import-export.md#image) of [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) `Escape` af, waarbij het zichzelf sluit en de selectie laat zoals ze is. Elk ervan neemt het toetsenbord over wanneer het opent, en die `Escape` wordt zowel geblokkeerd als gestopt.  
Sinds `4.1.0` geeft een `Escape` die wordt ingedrukt terwijl de focus in de [Verkenner](../guide/guides/explorer.md#keys-in-the-explorer) staat, in zijn boomstructuur, zijn velden of zijn knoppen, het toetsenbord terug aan het canvas en laat hij de Verkenner open en de selectie zoals ze is. De editor roept er zowel `preventDefault()` als `stopPropagation()` op aan, zodat hij nooit een `keydown`-listener van een pagina in de bubbelfase bereikt.  
Een `Escape` op het canvas sluit de Verkenner nooit. Vóór `4.1.0` sloot een `Escape` in het paneel Zoeken en vervangen dat paneel, en sloot een `Escape` op het canvas het met dezelfde toetsaanslag die de selectie ophief.  
Sinds `4.0.0` sluiten de taalkiezer en de kleurkiezer bij `Escape`: daarbinnen wordt hij geblokkeerd en gestopt, en op het canvas sluit hij ze met dezelfde toetsaanslag die de selectie opheft, niet geblokkeerd en niet gestopt.  
Een `Escape` die wordt ingedrukt terwijl een IME nog tekst samenstelt, hoort bij het samenstellen. Hij laat een geopende editor zoals die is en wordt niet geblokkeerd, zodat ook een pagina een toetsaanslag kan overslaan waarvan `isComposing` `true` is, of waarvan `keyCode` `229` is. In de Verkenner wordt zo'n toetsaanslag, net als elke toets die daar tijdens het samenstellen wordt ingedrukt, ook gestopt, en blijft het toetsenbord in het veld.  
Vóór `3.9.2` beëindigde één enkele `Escape` een bewerking of tekenactie en hief hij tegelijk de selectie op, en de editor blokkeerde hem nooit.

### createKeyBindingMap {#createkeybindingmap}

Sinds `3.9.2` exporteert het pakket `createKeyBindingMap()`, en daarbij de typen `KeyBindingMap`, `KeyBindingName` en `ShortcutOption`.  
Het geeft de standaardtoetscombinaties terug, alle 28 namen inclusief de vaste, bij elke aanroep als een nieuw object, zodat het wijzigen van het teruggegeven object verder niets verandert.  
Het is het uitgangspunt van elke editor, en een aanroep van `setKeyBindingMap` is er niet in te zien.  
Van deze vier is alleen `createKeyBindingMap` een runtime-export; de andere drie zijn typen. Sinds `4.2.0` wordt [dictionaryRowChords](#dictionaryrowchords) ernaast geëxporteerd.

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

Elke `shortcut` is een toetscombinatie in de syntaxis van [tinykeys](https://github.com/jamiebuilds/tinykeys) die zijn toets aanduidt met `KeyboardEvent.code`, waarbij [`$mod`](#mod) op macOS `⌘` is en elders `Control`.  
Sinds `4.0.0` leest de editor deze toetscombinaties zelf in plaats van via tinykeys, in dezelfde syntaxis. Een toets komt overeen via zijn `code`, of via zijn `key` ongeacht het hoofdlettergebruik, en een toetsaanslag komt alleen overeen als precies de modificatietoetsen die de combinatie noemt zijn ingedrukt. `AltGraph` telt op Windows als `Control` en `Alt` en op macOS als `Alt`. Toetsaanslagen die door een spatie worden gescheiden, vormen een reeks, die opnieuw begint na een seconde zonder keydown.  
Sinds `4.1.0` is één standaardwaarde een reeks: `groupSelectedTables` is `KeyT KeyG`, `T` en daarna `G`. Een reeks wordt uitgevoerd bij de toetsaanslag die hem voltooit, en alleen die toetsaanslag krijgt zijn `preventDefault` en `stopPropagation`, zodat met de standaardwaarden `T` de pagina bereikt en alleen `G` wordt geblokkeerd. Menu's, Snel zoeken en het tabblad Sneltoetsen tonen een reeks als één toets per toetsaanslag.  
De vaste namen zijn gekoppeld aan `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) en `$mod+Digit0` (`zoomReset`). `edit` en `stop` hebben geen vlaggen; de andere vijf hebben `preventDefault` en `stopPropagation`. De rest zijn de standaardwaarden hierboven, waaronder `search` en `findReplace`.

De editor luistert hiernaar op zijn eigen element, dus een host die toetsen eerder afvangt dan de editor, met globale sneltoetsen of een `keydown`-listener in de capture-fase, moet ze doorlaten zolang de editor de focus heeft.  
Stel de lijst met door te laten toetsen samen uit `createKeyBindingMap()`, met de toewijzingen die je aan `setKeyBindingMap` hebt doorgegeven in plaats van de standaardwaarden.  
Sinds `3.10.0` bevat die lijst `$mod+KeyF`, de eigen zoektoetscombinatie van de browser. Een host die zijn eigen zoekfunctie op die toetscombinatie wil houden, roept `setKeyBindingMap({ findReplace: [] })` aan.  
Sinds `4.0.0` bevat hij ook `Delete` en `Backspace` zonder modificatietoets. Een host die die toetsen wil houden, roept `setKeyBindingMap({ removeSelection: [] })` aan.  
Sinds `4.1.0` bevat hij ook `Alt+KeyG` en de reeks `KeyT KeyG`, die als één string komt: splits die bij de spatie en laat elke toetsaanslag door, ook `T` en `G` zonder modificatietoets, want een reeks waaraan een toetsaanslag ontbreekt, wordt nooit voltooid. Een host die die toetsen wil houden, roept `setKeyBindingMap({ addTableGroup: [] })` of `setKeyBindingMap({ groupSelectedTables: [] })` aan.  
Voeg er sinds `4.2.0` de toetscombinaties aan toe die [dictionaryRowChords](#dictionaryrowchords) voor hetzelfde object teruggeeft, waaronder `Alt+Shift+Enter`. Een host die die toetsen wil houden, roept `setKeyBindingMap({ addColumn: [] })` of `setKeyBindingMap({ removeColumn: [] })` aan, waardoor ze ook op het ERD-tabblad geen kolommen meer toevoegen en verwijderen.

Zolang de focus in de Verkenner staat, in zijn boomstructuur, zijn velden `Find` en `Replace` of zijn knoppen, gaan `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` en `zoomReset` door naar de editor, zodat `findReplace` daar werkt zoals op het canvas. Elke andere toewijzing, zoals die op dat moment is ingesteld, stopt bij de Verkenner, een reeks bij zijn laatste toetsaanslag (een losse `G` met de standaardwaarden), en hetzelfde geldt voor de pijltoetsen, `Tab`, `Enter`, `Space`, `Home`, `End` en elke toets die wordt ingedrukt terwijl een IME nog tekst samenstelt. Behalve `Escape`, dat het toetsenbord teruggeeft aan het canvas, worden ze gestopt zonder te worden geblokkeerd, zodat ze als gewone toetsen werken in de velden, knoppen en boomstructuur van de Verkenner en noch het canvas noch een `keydown`-listener van een pagina in de bubbelfase bereiken: `Alt + N` voegt daar geen tabel toe en `Delete` verwijdert niets. De toetsen die tussen de rijen van de boomstructuur bewegen, een rij samenvouwen of naar een rij gaan, en `Enter` in het veld `Find` of `Replace`, dat door de overeenkomsten gaat of vervangt, worden ook geblokkeerd.  
Elke andere toets, zoals de toetscombinatie voor opslaan of voor het opdrachtpalet van een host, gaat zoals gewoonlijk door naar de pagina. Zie [Toetsen in de Verkenner](../guide/guides/explorer.md#keys-in-the-explorer). Vóór `4.1.0` hield het zwevende paneel Zoeken en vervangen toetsen op dezelfde manier tegen, behalve `Home`, `End`, de laatste toetsaanslag van een reeks en `Space` zolang `handTool` aan een andere toets was gekoppeld.  
Sinds `4.0.0` houdt de taalkiezer toetsen op dezelfde manier tegen: dezelfde zeven toewijzingen gaan door, en elke andere toewijzing (sinds `4.1.0` een reeks bij zijn laatste toetsaanslag), de pijltoetsen en `Tab` worden daar gestopt zonder te worden geblokkeerd, net als elke toets die wordt ingedrukt terwijl een IME nog tekst samenstelt. `↑`, `↓`, `Home`, `End`, `Enter` en `Space` op een van zijn rijen gaan door de rijen of kiezen er een, en worden ook geblokkeerd.

Sinds `4.2.0` houdt ook het tabblad [Woordenboek](../guide/guides/dictionary.md#keys-on-the-tab) toetsen tegen, waarbij alleen `search`, `findReplace`, `undo` en `redo` doorgaan naar de editor. `undo` en `redo` werken op de eigen geschiedenis van het getoonde blad, en met een geopende celbewerking of de focus in het zoekveld van het tabblad worden ze aan de tekst overgelaten: daar gestopt, maar niet geblokkeerd. `search` en `findReplace` doen niets zolang een celbewerking open is, zoals hierboven. De rijtoetsen werken in het raster, zoals hierboven bij `addColumn` en `removeColumn` beschreven.  
Elke andere toewijzing, zoals die op dat moment is ingesteld, stopt bij het tabblad, een reeks bij zijn laatste toetsaanslag, en hetzelfde geldt voor de pijltoetsen, `Tab`, `Enter`, `Space`, `Home`, `End` en elke toets die wordt ingedrukt terwijl een IME nog tekst samenstelt. Geen daarvan bereikt het canvas of een `keydown`-listener van een pagina in de bubbelfase: `Alt + N` voegt daar geen tabel toe en `Delete` verwijdert niets uit het diagram. Events voor kopiëren, knippen en plakken in het tabblad stoppen daar ook, zodat het diagram ze nooit als de zijne leest. Elke andere toets gaat zoals gewoonlijk door naar de pagina.

### dictionaryRowChords {#dictionaryrowchords}

Sinds `4.2.0` exporteert het pakket `dictionaryRowChords()`. Het geeft bij elke aanroep als een nieuwe `ShortcutOption[]` elke toetscombinatie terug waarmee het raster van het tabblad Woordenboek rijen invoegt of verwijdert volgens het object met toetscombinaties dat je doorgeeft.  
Op volgorde zijn dat de toetscombinaties van één toetsaanslag van `addColumn`, die rijen onder de selectie invoegen; elk daarvan met ook `Shift` ingedrukt, die rijen erboven invoegen, behalve bij een toetscombinatie die al `Shift` bevat; en de toetscombinaties van één toetsaanslag van `removeColumn`, die rijen verwijderen. Elke toetscombinatie behoudt de `preventDefault` en `stopPropagation` van de toewijzing waaruit ze komt, en een reeks wordt weggelaten. Zie [Rijen toevoegen en verwijderen](../guide/guides/dictionary.md#adding-and-deleting-rows).  
De toetscombinatie die rijen erboven invoegt, met de standaardwaarden `Alt+Shift+Enter`, staat in geen enkele toewijzing, dus een host die modificatietoetsen exact vergelijkt en zijn lijst met door te laten toetsen alleen uit [createKeyBindingMap](#createkeybindingmap) samenstelt, laat haar nooit door. Laat beide lijsten door, zoals de Obsidian-plug-in doet.  
Het leest alleen het object dat het krijgt, niet de toewijzingen van het element, dus geef het het object door waaruit je je lijst met toetsen hebt samengesteld.

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

Wisselt de toets `Control` afhankelijk van de omgeving.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabel met sneltoetsen {#shortcut-table}

Gebruikt de eigenschappen `key, code` van toetsenbordevents.  
Gebruik `code` voor absolute posities en `key` voor invoerwaarden.

| Windows        | macOS           | `key`          | `code`                         |
| -------------- | --------------- | -------------- | ------------------------------ |
| n.v.t.         | `Command` / `⌘` | `Meta`         | `MetaLeft` / `MetaRight`       |
| `Alt`          | `Option` / `⌥`  | `Alt`          | `AltLeft` / `AltRight`         |
| `Control`      | `Control` / `^` | `Control`      | `ControlLeft` / `ControlRight` |
| `Shift`        | `Shift`         | `Shift`        | `ShiftLeft` / `ShiftRight`     |
| `Space`        | `Space`         | n.v.t.         | `Space`                        |
| `Enter`        | `Return`        | `Enter`        | `Enter`                        |
| `Esc`          | `Esc`           | `Escape`       | `Escape`                       |
| `Backspace`    | `Delete` / `⌫`  | `Backspace`    | `Backspace`                    |
| `Delete`       | `fn` + `Delete` | `Delete`       | `Delete`                       |
| `1`, `2`, enz. | `1`, `2`, enz.  | `1`, `2`, enz. | `Digit1`, `Digit2`, enz.       |
| `a`, `b`, enz. | `a`, `b`, enz.  | `a`, `b`, enz. | `KeyA`, `KeyB`, enz.           |
| `-`            | `-`             | `-`            | `Minus`                        |
| `=`            | `=`             | `=`            | `Equal`                        |
| `+`            | `+`             | `+`            | `Equal`                        |

## Thema {#theme}

### setPresetTheme {#setpresettheme}

Stelt een vooraf ingesteld thema in.  
De standaardwaarden zijn `appearance: 'dark'`, `grayColor: 'slate'` en `accentColor: 'indigo'`.  
Elk veld wordt afzonderlijk toegepast, dus een gedeeltelijke aanroep laat de andere twee zoals ze zijn. Een waarde die niet een van de namen hieronder is, wordt genegeerd, en de aanroep geeft nooit een fout.  
Sinds `4.0.0` accepteert `appearance` ook `'system'`, de optie `System` van de themabouwer. Die toont het lichte of donkere uiterlijk dat het besturingssysteem meldt, of het uiterlijk dat [setSystemAppearance](#setsystemappearance) noemt, en wisselt mee wanneer dat verandert.

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

Geeft sinds `4.0.0` aan of het uiterlijk `'system'` licht of donker toont, voor een host met een eigen licht en donker, zoals een IDE-thema. Zolang er een is opgegeven, worden de wijzigingen van het besturingssysteem genegeerd.  
`null`, of elke andere waarde dan `'dark'` of `'light'`, zorgt dat het besturingssysteem weer wordt gevolgd.  
Zolang het uiterlijk `'light'` of `'dark'` is, verandert het niets op het scherm, maar de waarde wordt bewaard en geldt zodra het uiterlijk `'system'` wordt. Anders geldt het direct. Het verstuurt niets, en `changePresetTheme` blijft `'system'` melden.  
De hosts voor VS Code, JetBrains en Obsidian roepen het aan met hun eigen licht of donker, en opnieuw telkens wanneer dat verandert.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Maakt het mogelijk het thema aan te passen.  
Elke aanroep vervangt de hele aangepaste laag, dus geef opnieuw het volledige object door om één token te wijzigen bovenop een bestaande overschrijving, en geef `{}` door om terug te gaan naar de voorinstelling.  
Alleen de tokennamen hieronder, met stringwaarden, blijven behouden; al het andere wordt zonder fout weggelaten.  
De laag ligt bovenop de voorinstelling, dus een latere `setPresetTheme` verwisselt de voorinstelling eronder terwijl je overschrijvingen blijven.

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

`tableShadow` en `memoShadow` zijn de kleur van de schaduw die tabellen en memo's op het ERD-canvas werpen. De donkere voorinstelling laat ze `transparent`, wat geen schaduw werpt, net als `none` of een lege string doorgeven aan `setTheme`; de lichte voorinstelling gebruikt `rgba(0, 0, 0, 0.18)`.

Sinds `4.0.0` zijn er negen tokens bij:

- `tableGroupHeaderBackground`, `tableGroupBackground` en `tableGroupBorder` kleuren de titelbalk, het vlak en de omtrek van een [tabelgroep](../guide/guides/table-groups.md) die geen eigen kleur heeft.
- `toastSuccess` en `toastError` kleuren het symbool van een melding die aangeeft hoe iets is afgelopen.
- `findReplaceError` en `mapColumnsError` kleuren de fouten die Zoeken en vervangen en het dialoogvenster Kolommen toewijzen tonen. Zoeken en vervangen gebruikte eerder `diffDeleteForeground`, dus die overschrijven geeft het geen andere kleur meer.
- `schemaSqlWarningBackground` en `schemaSqlWarningForeground` kleuren de waarschuwingen in de opties van het tabblad Schema SQL.

Sinds `4.1.0` zijn er negen tokens bij:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` en `treeMatch` kleuren de boomstructuur die de [Verkenner](../guide/guides/explorer.md#the-tree) en de [Verschilweergave](../guide/guides/table-related-functions.md#diff-viewer) delen: de achtergrond, die ook de velden `Find` en `Replace` van de Verkenner vult; een rij onder de aanwijzer, de rij van het toetsenbord zolang de boomstructuur de focus heeft, en een knop onder de aanwijzer in de kop en het zoekgedeelte van de Verkenner; de rij van de huidige zoekovereenkomst; gedimde tekst zoals aantallen, gegevenstypen en de pijlen voor samenvouwen; en de markering achter de tekst die een zoekopdracht heeft gevonden.
- `explorerBackground` en `explorerBorder` kleuren het paneel van de Verkenner en zijn lijnen: de rand naast het canvas, de lijn onder het zoekgedeelte en de randen van de velden en van de knoppen die `Search In` uitvouwt. `explorerBorder` tekent ook de rand van de boomstructuur van de Verschilweergave, de lijn onder het veld `Filter by name` en de rand van dat veld. De sleutelpictogrammen van de Verkenner gebruiken `keyPK`, `keyFK` en `keyPFK`.
- `diffModifyForeground` en `diffRenameForeground` kleuren wat de Verschilweergave als gewijzigd en hernoemd markeert, in de boomstructuur en op beide documenten. `diffModifyForeground` omlijnt ook een tabel, memo of tabelgroep die is verplaatst, van grootte of kleur is veranderd of in een andere groep is geplaatst, wat er verder ook in is gewijzigd, en tekent de verbindingslijn van een refererende sleutel die is gewijzigd.

`diffInsertForeground` en `diffDeleteForeground` kleuren nu wat de Verschilweergave als toegevoegd en verwijderd markeert, in de boomstructuur en op het document dat het bevat, zowel in tekst als in omlijningen en verbindingslijnen. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` en `diffCrossForeground` zijn in `4.1.0` verwijderd, omdat de Verschilweergave geen cellen meer vult. `setTheme` laat ze weg zoals elke andere naam die niet in `Theme` staat, en hun hooks, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` en `--erd-editor-diff-cross-foreground`, worden niet meer gelezen.

Sinds `4.2.0` zijn er twaalf tokens bij:

- `columnHandleBackground` en `columnHandleBorder` vullen en omlijnen de [sleepgreep van een kolom](../guide/guides/table-editing.md#rearranging-and-moving-columns), die net buiten de linkerrand van een tabel naast een kolomrij met de focus wordt getekend, en `columnHandleHoverBackground` en `columnHandleHoverBorder` nemen het over zolang de aanwijzer erop staat. Het greeppictogram erop gebruikt `foreground`, en `active` onder de aanwijzer.
- `dictionaryErrorForeground` en `dictionaryWarningForeground` kleuren wat de [woordenboekcontroles](../guide/guides/dictionary.md#what-each-check-finds) vinden, een fout of een waarschuwing: een gesignaleerde naam op het ERD-canvas (zie [Markeringen op het canvas](../guide/guides/dictionary.md#marks-on-the-canvas)), de tekst van een gesignaleerde cel op de bladen `Domains`, `Words` en `Terms`, en het aantal bij `Checks`. `dictionaryErrorBackground` en `dictionaryWarningBackground` vullen zo'n cel. `dictionaryErrorForeground` kleurt ook de knop `Delete Rows` onder de aanwijzer.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` en `dictionaryHeaderSelect` kleuren het blad van het tabblad [Woordenboek](../guide/guides/dictionary.md#the-sheets): de cellen, en daarmee ook het zoekveld van het tabblad en de domeinlijst van een term; de kolomkoppen en rijnummers; de lijnen tussen de cellen, en daarmee ook de balk van het tabblad en de randen van zijn velden; en een kop waarvan de rij of kolom de selectie raakt. De rest van het blad gebruikt gedeelde tokens: `foreground` voor de labels van de koppen, `active` voor de tekst in cellen, `grayColor7` voor de lijn die de kolomkoppen en de rijnummers van de cellen scheidt, `focus` voor de rand van de actieve cel, `accentColor9` voor de rand van een geselecteerd bereik en, met 20% dekking, de vulling ervan, `accentColor6` voor de kop van een volledig geselecteerde rij of kolom, `grayColor3` voor alleen-lezencellen en de tokens van de schuifbalk. Een `accentColor9` die niet als `#rgb` of `#rrggbb` is geschreven, laat een geselecteerd bereik ongevuld.

#### CSS-variabelen {#css-variables}

Elk token in `Theme` heeft een bijbehorende CSS-hook met de naam `--erd-editor-` plus de sleutel in kebab-case: `grayColor10` is `--erd-editor-gray-color-10`, `keyPK` is `--erd-editor-key-pk` en `keyPFK` is `--erd-editor-key-pfk`.  
De hooks worden overgeërfd in de editor, dus stel ze in waar je ze wilt laten gelden. Op `:root` bepalen ze het thema van elke editor op de pagina; op het element zelf alleen dat van die ene.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Sinds `3.4.0` worden de verkeerd gespelde tokens `dargSelect` gespeld als `dragSelect`, en zijn hun hooks gewijzigd van `--erd-editor-darg-select-background` en `--erd-editor-darg-select-border` naar `--erd-editor-drag-select-background` en `--erd-editor-drag-select-border`. Een stylesheet die nog de oude namen gebruikt, wordt genegeerd.

<details>
<summary>Standaardwaarden van het thema</summary>

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

## Weergavetaal {#display-language}

Sinds `4.0.0` is de eigen tekst van de editor — de menu's, panelen, dialoogvensters, Snel zoeken, meldingen en de woorden die hij op het diagram tekent, zoals `unnamed`, geëxporteerde afbeeldingen inbegrepen — beschikbaar in 25 talen. Tabel- en kolomnamen, SQL, gegevenstypen en gegenereerde code worden nooit vertaald. Zie [Taal en thema](../guide/guides/language-and-theme.md).  
Voordat [setLocale](#setlocale) wordt aangeroepen of een taal wordt gekozen, toont de editor Engels, of volgt hij `'system'` zolang [enableLocalePicker](#enablelocalepicker) aanstaat.  
De editor stelt `lang` en `dir` in op zijn eigen rootelement binnen de gesloten shadow root, nooit op het host-element of de pagina, zodat een pagina van rechts naar links de editor niet omdraait en een taal van rechts naar links de pagina niet omdraait. In het Hebreeuws, Arabisch en Perzisch wordt de interface van de editor van rechts naar links ingedeeld; het diagram zelf wordt nooit gespiegeld. Sinds `4.1.0` blijft de [Verkenner](../guide/guides/explorer.md) in elke taal links van het canvas staan, waarbij zijn eigen rijen in die drie talen van rechts naar links lezen.  
Het pakket exporteert de typen `LocaleCode` (een van de codes hieronder) en `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Code    | Weergegeven als      | Taal                  |
| ------- | -------------------- | --------------------- |
| `id-ID` | Bahasa Indonesia     | Indonesisch           |
| `de-DE` | Deutsch              | Duits                 |
| `en`    | English              | Engels                |
| `es-ES` | Español              | Spaans                |
| `eu-ES` | Euskara              | Baskisch              |
| `fr-FR` | Français             | Frans                 |
| `it-IT` | Italiano             | Italiaans             |
| `nl-NL` | Nederlands           | Nederlands            |
| `pl-PL` | Polski               | Pools                 |
| `pt-PT` | Português            | Portugees             |
| `pt-BR` | Português Brasileiro | Braziliaans-Portugees |
| `ro-RO` | Română               | Roemeens              |
| `sk-SK` | Slovenčina           | Slowaaks              |
| `sl-SI` | Slovenščina          | Sloveens              |
| `sv-SE` | Svenska              | Zweeds                |
| `tr-TR` | Türkçe               | Turks                 |
| `ru-RU` | Русский              | Russisch              |
| `uk-UA` | Українська           | Oekraïens             |
| `he-IL` | עברית                | Hebreeuws             |
| `ar-SA` | العربية              | Arabisch              |
| `fa-IR` | فارسی                | Perzisch              |
| `ja-JP` | 日本語               | Japans                |
| `zh-CN` | 简体中文             | Vereenvoudigd Chinees |
| `zh-TW` | 繁體中文             | Traditioneel Chinees  |
| `ko-KR` | 한국어               | Koreaans              |

### setLocale {#setlocale}

Stelt de weergavetaal in: `'system'` of een van de codes hierboven. Al het andere, zoals een losse `'ko'`, een onbekende code of een waarde die geen string is, wordt zonder fout genegeerd.  
Het wordt toegepast voordat het terugkeert, zodat een taal die is ingesteld voordat het element wordt toegevoegd, al in het eerste frame staat.  
Het verstuurt niets, noch `changeLocale` noch `change`, en raakt `value`, de geschiedenis en een gedeelde store niet aan.  
De keuze blijft staan, of `enableLocalePicker` nu aan- of uitstaat, en `setLocale('system')` volgt het systeem ook als de kiezer uitstaat.  
De editor slaat niets op. Om de keuze van een lezer te bewaren, luister je naar [changeLocale](#changelocale) en geef je die bij de volgende keer laden terug.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Geeft als BCP 47-tag op voor welke taal `'system'` staat, voor een host met een eigen weergavetaal. De hosts voor VS Code, JetBrains en Obsidian roepen het aan met hun eigen weergavetaal.  
Witruimte rond de tag wordt verwijderd. `null`, een lege string of een waarde die geen string is, gaat terug naar `navigator.languages` van de browser, dat de editor volgt wanneer het verandert.  
Het maakt alleen uit zolang de actieve optie `'system'` is, en het wordt direct toegepast. De rij `System` van de kiezer noemt de taal waartoe het wordt herleid.  
De tag, of elk van de talen van de browser op volgorde, wordt herleid tot de eerste taal die de editor heeft, op basis van de taalsubtag, waarbij hoofdlettergebruik en onderstrepingstekens worden genegeerd: `de-AT` geeft `de-DE` en `en-GB` geeft `en`. Voor Chinees telt het schrift, waarbij `Hant` `zh-TW` geeft en `Hans` `zh-CN`, en zonder schrift de regio, waarbij `TW`, `HK` en `MO` `zh-TW` geven en elke andere `zh-CN`. `pt` geeft `pt-BR`, tenzij een andere regio dan `BR` wordt genoemd. Als niets overeenkomt, toont de editor Engels.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Laadt een Schema SQL-bestand.  
Standaard vervangt het het huidige document in plaats van erin samen te voegen; zie `mode` hieronder. De instellingen die je al hebt, blijven behouden, inclusief elke vergrendeling en haar vergrendelde waarde, behalve de weergavepositie en het zoomniveau, en de tabellen worden geplaatst zodra het bestand is gelezen, in rijen tenzij `placement` hieronder anders vraagt. Met `Viewport` vergrendeld schrijft `value` dan de weergave waarop de import begint, oorsprong `0, 0` bij zoomniveau `1`. In een document dat is geïmporteerd in een element dat nooit een waarde heeft gekregen, staan daarom alle vergrendelingen aan, net als in een nieuw document.  
Sinds `4.2.0` behoudt een vervanging ook de woorden, termen en domeinen van het document, die de tekst niet kan bevatten, met de geschiedenis van elk woordenboekblad, en ook ongedaan maken of opnieuw uitvoeren van de import behoudt ze. Een vervangende [setSchemaJSON](#setschemajson) en het toewijzen van `value` nemen in plaats daarvan die uit hun document over.  
Het wordt in de geschiedenis vastgelegd, wat `Undo, Redo` mogelijk maakt, en het verstuurt `change`. Een lege string wordt genegeerd, en de aanroep doet niets zolang `readonly` is ingesteld.  
`setSchemaGraphQL`, `setSchemaDBML` en `setSchemaAML` gedragen zich op dezelfde manier, en hun parsers falen nooit: tekst die ze niet kunnen lezen, laadt een leeg document in plaats van een fout te geven.  
Sinds `4.0.0` accepteren alle vier een optioneel tweede argument, `{ placement, mode }`:

- `placement: 'grid'`, de standaardwaarde, plaatst de tabellen direct in rijen, zoals voorheen, en de aanroep geeft niets terug.
- `placement: 'auto'` deelt de tabellen eerst in op basis van hun relaties, zoals `Import` in de editor doet, en geeft een `Promise` terug die wordt vervuld zodra de import als één stap in de geschiedenis is geplaatst. Minder dan twee tabellen, geen relatie, een indeling die mislukt, een pagina zonder `SharedWorker` of `Cancel` op de melding `Placing tables` plaatst ze in plaats daarvan in rijen. Een laadactie in de tussentijd — een andere vervangende import, het toewijzen van `value`, `setInitialValue()`, `clear()`, een laadactie van een medebewerker, of het ongedaan maken of opnieuw uitvoeren van een laadactie of van `clear()` — vervangt die, en de `Promise` wordt vervuld zonder dat er iets is geladen. Imports die op deze manier worden geplaatst, komen terecht in de volgorde waarin ze zijn gestart.
- `mode: 'replace'`, de standaardwaarde, vervangt het document. `mode: 'append'` voegt het bestand onder het diagram toe zoals [Importeren en toevoegen](../guide/guides/file-import-export.md#import-and-add) doet, en laat elke tabel die er al staat zoals ze is, en ook elke instelling behalve het tabblad en de weergavepositie. Vanaf een ander tabblad komt eerst het ERD-tabblad naar voren. De nieuwe tabellen, en de tabelgroepen die een DBML-bestand meebrengt zolang tabelgroepen worden getoond, worden de selectie, en de weergave scrolt ernaartoe, tenzij ze al goed in beeld zijn, volgens de regel die elke sprong sinds `4.1.0` volgt — zie [Waar een sprong terechtkomt](../guide/guides/table-related-functions.md#where-a-jump-lands). Eén keer ongedaan maken verwijdert de hele toevoeging. Tekst die het niet kan lezen, voegt niets toe en laat het document zoals het is.

Zolang `readonly` is ingesteld, wordt een vervanging genegeerd, voegt een toevoeging niets toe en wordt een aanroep met `placement: 'auto'` direct vervuld.  
Sinds `3.10.0` leest `setSchemaSQL` het bestand voor de huidige database van het document: als Databricks is geselecteerd, volgen strings tussen enkele aanhalingstekens de backslash-escapes van Spark. Zie [Opmerkingen](../guide/guides/file-import-export.md#comments).  
Sinds `3.10.0` leest `setSchemaSQL` een `UNIQUE` over twee of meer kolommen als één unieke index in plaats van een vlag Uniek op elke kolom. Zie [Unieke sleutels en indexen](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Sinds `3.10.0` behouden SQL-, DBML- en AML-imports de acties `ON DELETE` en `ON UPDATE` van de refererende sleutels die ze lezen.  
Sinds `4.0.0` behoudt `setSchemaSQL` de volledige `DEFAULT`-expressie van een kolom, leest het `ADD DEFAULT … FOR` en de `MS_Description`-opmerkingen van SQL Server, zet het serial- en identity-kolommen van PostgreSQL om naar automatisch ophogen, behoudt het `UNSIGNED` en `ZEROFILL` in een gegevenstype en leest het een primaire sleutel die `ALTER TABLE … ADD PRIMARY KEY` als `CLUSTERED`, `NONCLUSTERED` of `USING BTREE` markeert. Zie [Schema SQL](../guide/guides/file-import-export.md#schema-sql).  
Zie [Bestanden importeren of exporteren](../guide/guides/file-import-export.md) voor de syntaxis die elke parser accepteert.

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

Laadt een GraphQL SDL-document.  
Definities van objecttypen worden tabellen, en een veld waarvan het type een andere tabel is, wordt een relatie.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Laadt een DBML-bestand, het formaat dat dbdiagram.io en dbdocs gebruiken.  
Sinds `4.0.0` wordt elke `TableGroup` een [tabelgroep](../guide/guides/table-groups.md), en wordt de `headercolor` van een tabel de kleur ervan. Zie [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Laadt een AML-bestand (Azimutt Markup Language). Zowel de huidige schrijfwijze als de oude v1-schrijfwijze wordt geaccepteerd.  
Sinds `4.0.0` wordt de kleur van een entiteit, een van de kleurnamen van Azimutt of een hexadecimale waarde tussen aanhalingstekens, de kleur van haar tabel. Zie [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Laadt sinds `4.0.0` een `.erd.json`-document, zoals de tekst die [value](#value) teruggeeft.  
In de standaardmodus `mode: 'replace'` laadt het het document zoals het toewijzen van `value` dat doet: het wordt in de geschiedenis vastgelegd, verstuurt `change` en neemt de vergrendelingen van het document op dezelfde manier over, en sinds `4.2.0` vervangen de woorden, termen en domeinen van het document die van de editor. Anders dan bij `value` wordt een lege string of een waarde die geen string is genegeerd in plaats van dat er een nieuw document wordt begonnen. Tekst die geen JSON is, maakt het document leeg, zoals bij `value`.  
`mode: 'append'` voegt de tabellen, relaties, indexen, memo's en tabelgroepen van het document onder het diagram toe met nieuwe id's, waarbij hun onderlinge posities behouden blijven en de instellingen van het document worden weggelaten, zoals [Importeren en toevoegen](../guide/guides/file-import-export.md#import-and-add) doet met een `json`-bestand. Sinds `4.2.0` behoudt het de logische namen en de vlaggen voor afgeleide namen van de tabellen en kolommen, maar laat het de woorden, termen en domeinen van het document achter, zodat geen van zijn kolommen aan een domein is gekoppeld. Tekst die het niet kan lezen, of een document zonder tabel en zonder memo, voegt niets toe. Anders wordt het geplaatst zoals een toevoeging met [setSchemaSQL](#setschemasql), waarbij de nieuwe memo's en tabelgroepen samen met de tabellen worden geselecteerd, elke soort zolang die wordt getoond.  
Het keert terug zodra het document is geplaatst, en het wordt genegeerd zolang `readonly` is ingesteld.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporteert de huidige editorstatus als Schema SQL.  
Als `databaseVendor` niet is opgegeven, werkt het op basis van het huidig ingestelde databasesysteem. Een naam die niet in de lijst hieronder staat, wordt op dezelfde manier behandeld, zonder een fout te geven.  
Namen worden tussen aanhalingstekens gezet met het type aanhalingstekens dat de editor toont. Zolang `Bracket Type` [vergrendeld](../guide/guides/settings.md#lock) is, kan dat verschillen van het type dat `value` opslaat, en dat is het type waarmee [`erd_read`](../mcp/tools.md#reading-a-document) van een codeeragent namen tussen aanhalingstekens zet. De geschreven namen zijn altijd de fysieke, ongeacht de naamweergave.  
Sinds `4.0.0` kiest een optioneel argument `options` de instructies en de kop, zoals de opties van het tabblad [Schema SQL](../guide/guides/schema-sql.md) dat doen, en sinds `4.2.0` of logische namen lege opmerkingen vullen. `SchemaSQLOptions` wordt als type geëxporteerd.

- `statements`: `'create'`, de standaardwaarde; `'ifNotExists'`, dat `IF NOT EXISTS` schrijft op MySQL, MariaDB, PostgreSQL, SQLite en Databricks en elders terugvalt op `'create'`; of `'recreate'`, dat de tabellen verwijdert voordat het ze aanmaakt, waarbij Snowflake in plaats daarvan `CREATE OR REPLACE TABLE` schrijft.
- `header`: `'none'`, de standaardwaarde; `'use'`, dat overschakelt naar de database of het schema van het document; of `'createAndUse'`, dat die eerst aanmaakt als die niet bestaat en er daarna naar overschakelt. Een database die de gevraagde optie niet heeft, valt terug zoals het tabblad doet: Oracle schrijft `'use'` voor `'createAndUse'`, PostgreSQL schrijft geen kop voor `'use'` en SQLite schrijft er geen. Er wordt alleen een kop geschreven zolang de databasenaam van het document een gewone identifier is — ASCII-letters, cijfers en `_`, niet beginnend met een cijfer.
- `logicalNameAsComment`, sinds `4.2.0`: `true` schrijft de logische naam van een tabel of kolom als haar opmerking waar haar eigen opmerking leeg is of alleen witruimte bevat en de logische naam niet leeg is, in de vorm waarin die database een opmerking schrijft. Een opmerking met tekst wordt geschreven zoals voorheen. Alleen `true` schakelt het in: weggelaten, `false` of elke andere waarde, zoals `'true'` of `1`, schrijft geen logische naam. Het doet wat de schakelaar [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) van het tabblad doet.

Een weggelaten optie, of een optie met een onbekende waarde, wordt gelezen als de standaardwaarde, dus een aanroep zonder opties schrijft gewone `CREATE`-instructies zonder kop, zoals voorheen.  
Sinds `4.0.0` bevat de uitvoer altijd de scripts `Before tables` en `After tables` van het document, in de volgorde kop, script vóór de tabellen, drop-instructies, tabellen, script na de tabellen. De eigen keuzes `Statements`, `Header`, `Write logical names into empty comments` en `Tables` van het tabblad Schema SQL hebben nooit invloed op deze aanroep, die altijd het hele document schrijft.  
Sinds `3.10.0` bevat elke refererende sleutel de clausules `ON DELETE` en `ON UPDATE` van de relatie. Een clausule wordt alleen geschreven als de actie ervan is ingesteld en het databasesysteem die accepteert, dus een actie die dat databasesysteem niet ondersteunt, wordt weggelaten en de standaardwaarde ervan geldt. Sinds `4.0.0` accepteert Snowflake alleen `NO ACTION`. Zie [ON DELETE en ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) voor wat elke database schrijft.  
Sinds `3.10.0` wordt een enkel aanhalingsteken in een tabel- of kolomopmerking geëscapet, zodat een opmerking zoals `it's` de instructie niet meer breekt. Elk databasesysteem dat opmerkingen als stringliteralen schrijft, verdubbelt het, behalve Databricks, dat een backslash vóór elk aanhalingsteken en elke backslash zet. SQLite schrijft opmerkingen nog steeds als `--`-regels.  
Sinds `4.2.0` schrijft SQL Server elke opmerking als nationale stringliteral, `N'…'`, zodat tekst buiten de codepagina van de database, zoals Koreaans, behouden blijft. Oracle schrijft elke reeks lege regels in een opmerking als één regeleinde, en SQLite schrijft de regeleinden van een opmerking als spaties, zodat die op haar `--`-regel blijft. Zie [Opmerkingen](../guide/guides/schema-sql.md#comments).  
Sinds `4.0.0` schrijven verschillende databases ook sleutelnamen, standaardwaarden en automatisch ophogen anders. Zie [Wat de DDL schrijft](../guide/guides/schema-sql.md#what-the-ddl-writes).

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

Geeft een store terug voor realtime gezamenlijk bewerken.  
`config` is `{ getNickname?, mouseTracker?, focusTracker? }`. Beide trackers staan standaard op `true`: `mouseTracker` zendt de cursor van deze editor uit naar de anderen, en `focusTracker` zendt de cel met de focus, de selectie en het selectiekader uit.  
Zie [Gezamenlijk bewerken](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Opent de Verschilweergave en vergelijkt het document dat nu open is met het document dat je doorgeeft.  
Het geeft niets terug en wijzigt het document niet, dus het sluiten van de Verschilweergave laat de editor precies zoals hij was.  
Een lege waarde, of alles wat geen string is, wordt vergeleken met een leeg document.  
Het is dezelfde overlay als [Verschilweergave](../guide/guides/table-related-functions.md#diff-viewer) in het contextmenu van het canvas.  
Sinds `4.1.0` koppelt het wat de twee documenten bevatten eerst op id en pas daarna op wat elk bewaart, zoals de naam van een tabel of de tekst van een memo — zie [Wat er wordt vergeleken](../guide/guides/table-related-functions.md#what-is-compared). Tegenover een eerdere versie van hetzelfde document, zoals een Git-revisie van het bestand, verschijnt een naamswijziging daarom als één hernoemd item; tegenover een document met andere id's verschijnt die als een verwijdering en een toevoeging. De Verschilweergave toont in een boomstructuur naast de twee documenten wat er is gewijzigd en markeert de wijzigingen met kleur in plaats van cellen te vullen.  
Sinds `4.2.0` openen beide documenten in de naamweergave die deze editor toont, ongeacht wat het doorgegeven document heeft opgeslagen, en noemt de boomstructuur tabellen en kolommen ook volgens die weergave — zie [Buiten het canvas](../guide/guides/logical-names.md#beyond-the-canvas). Logische namen, domeinkoppelingen en de woordenboeken worden niet vergeleken, dus een wijziging die alleen die betreft, toont geen wijziging.

```js
editor.setDiffValue('prev json...');
```
