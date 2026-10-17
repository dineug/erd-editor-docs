---
sidebar_position: 2
description: API:t för erd-editor-elementet – attribut, value och runtimeValue, händelser, teman, visningsspråk, välkomstskärmen, tangentkombinationer samt import och export av scheman.
---

# ErdEditorElement

Editorn är ett vanligt `HTMLElement`.  
Dess typdefinition ser ut så här.

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

Editorn renderas i en stängd shadow root, så `editor.shadowRoot` är `null` och sidans stilar läcker varken in eller ut.  
Ingenting där inne kan nås med en selektor – formge den i stället via [setTheme](#settheme) och de anpassade egenskaperna `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` och `enable-welcome-screen` är de enda attributen, och alla fem har standardvärdet `false`. De två sista är nya i `4.0.0`. Vart och ett tolkar sitt värde så som [readonly](#readonly) beskriver.

Sedan `4.1.0` har ERD-fliken en [utforskare](../guide/guides/explorer.md), ett träd över diagrammet som är dockat till vänster om arbetsytan med Sök och ersätt överst. Inga attribut, egenskaper, metoder eller händelser öppnar, stänger eller rapporterar den: den öppnas med knappen `Explorer` i verktygsfältet, med `Toggle Explorer` i snabbsökningen eller i arbetsytans snabbmeny eller med bindningen [`findReplace`](#setkeybindingmap).  
Varje element startar med den stängd. Om den är öppen, dess bredd, vad som är ihopfällt i den och dess sökning varar lika länge som elementet, genom flikbyten och varje inläsning, även med `setInitialValue`, och hamnar aldrig i `value`, `runtimeValue`, ångrahistoriken eller en delad store.

## readonly {#readonly}

Anger om editorn går att redigera.  
Medan den är satt ignoreras tilldelning av `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, ångra och göra om, och händelsen `change` skickas aldrig. Läs in ett dokument med [setInitialValue](#setinitialvalue) i stället.  
Visning fungerar fortfarande: zoomning, panorering, handverktyget, zenläget, arbetsytans flik, fliken [Visualisering](../guide/guides/visualization.md) i båda sina lägen, inklusive fokusering på tabeller, databassystemet samt utdatainställningarna för SQL och kodgeneratorn gäller fortfarande, så en skrivskyddad visare kan fortfarande exportera SQL för ett annat databassystem eller läsa genererad kod.  
Sedan `4.1.0` öppnas även [utforskaren](../guide/guides/explorer.md#read-only-editors), och om du väljer en av dess rader går du till det som raden står för, som i en redigerbar editor. [Sök och ersätt](../guide/guides/find-and-replace.md#read-only-editors) överst i den kan bara söka, utan pilen `Toggle Replace` och utan ersättningsrad, och när du går till en träff visas den fortfarande i vyn och markeras. Panelen har rubriken `Explorer`, och knappbeskrivningen för knappen i verktygsfältet är `Explorer (Ctrl + F)` (Windows/Linux) eller `Explorer (⌘ + F)` (Mac) i varje editor. Från `3.10.0` till `4.0.0` öppnades Sök och ersätt som en flytande panel med rubriken `Find` som bara kunde söka.  
Panelen Tabellegenskaper öppnas fortfarande, och sedan `3.10.0` visar den etiketten `Read only` bredvid sin rubrik och dess flik `Indexes` erbjuder inga ändringar – se [Tabellegenskaper](../guide/guides/table-related-functions.md#table-properties).  
Sedan `4.0.0` erbjuder en skrivskyddad editor inte [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (se [Tabellgrupper](../guide/guides/table-groups.md#read-only-editors)) eller [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), och den visar ingen [välkomstskärm](#enablewelcomescreen). Låsknapparna på fliken Inställningar ändrar ingenting, och skripten `Before tables` och `After tables` på fliken Schema SQL går inte att redigera.  
Sedan `4.1.0` visar den inte heller knapparna `New Table`, `New Memo` eller `New Table Group` i [arbetsytans verktygsfält](../guide/guides/table-related-functions.md#canvas-toolbar), och bindningarna `addTableGroup` och `groupSelectedTables` gör ingenting.  
Valen under `This window only` på fliken Schema SQL, `Statements`, `Header` och `Tables`, sparas aldrig och fungerar fortfarande, och det gör även dialogrutan [`Export image`](../guide/guides/file-import-export.md#image), temaverktyget och språkväljaren. Ett val i temaverktyget eller språkväljaren skickar fortfarande [changePresetTheme](#changepresettheme) eller [changeLocale](#changelocale).  
Ett attribut utan värde, `=""` och `="true"` tolkas alla som `true`. `="false"` tolkas som `false`, och det gör även varje annan sträng – inklusive HTML-idiomet `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Avgör om temat automatiskt ska synkroniseras med systemets mörka/ljusa läge.  
Sedan `4.0.0` sätts temats `appearance` till `'system'` när den slås på, som `setPresetTheme({ appearance: 'system' })` gör. Editorn visar då det ljusa eller mörka utseende som operativsystemet rapporterar, eller det som [setSystemAppearance](#setsystemappearance) anger, och växlar när det ändras.  
Ett senare anrop av [setPresetTheme](#setpresettheme) med `'light'` eller `'dark'`, eller ett val av `Light` eller `Dark` i temaverktyget eller snabbsökningen, ersätter `'system'` och består: nästa ändring i operativsystemet skriver inte längre över det, trots att `systemDarkMode` fortfarande är `true`. Före `4.0.0` skrev nästa ändring i operativsystemet över det.  
Om du slår av den medan utseendet är `'system'` behålls det ljusa eller mörka utseende som visas i det ögonblicket. Om du slår av den efter att utseendet har ändrats från `'system'` lämnas utseendet som det är.  
En ändring av den skickar ingen händelse.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Avgör om ett gränssnitt för att enkelt ställa in förinställda teman finns tillgängligt.  
Den visar knappen `Theme` i verktygsfältet, som öppnar temaverktyget med `Accent color`, `Gray color` och `Appearance`. Sedan `4.0.0` erbjuder `Appearance` `System` utöver `Light` och `Dark`, och medan egenskapen är på listar snabbsökningen `Theme` med `System`, `Light` och `Dark`. Se [Språk och tema](../guide/guides/language-and-theme.md).

![Temaverktyget öppnas från verktygsfältet, accentfärg och gråton väljs och utseendet växlas till Light och sedan till System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

En ändring av det förinställda temat från den här panelen, eller från snabbsökningen, skickar händelsen [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Avgör sedan `4.0.0` om ett gränssnitt för att välja editorns visningsspråk finns tillgängligt.  
Den visar knappen `Display Language` i verktygsfältet, efter `Theme` när båda visas. Knappen öppnar språkväljaren, och snabbsökningen listar `Display Language`. Båda erbjuder `System` och de 25 språken – se [Språk och tema](../guide/guides/language-and-theme.md).  
Den avgör också vad en editor visar innan [setLocale](#setlocale) anropas eller ett språk väljs: `'system'` medan den är på, engelska medan den är av, så ett element som inte konfigurerar något behåller den engelska det alltid har visat. Att slå på eller av den växlar genast mellan de två. När ett språk väl har angetts eller valts består det valet oavsett om den är på eller av.  
Ställ in den innan elementet infogas för att den första bildrutan ska följa `'system'`.  
Ett val skickar [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Avgör sedan `4.0.0` om ett tomt diagram möter läsaren med [välkomstskärmen](../guide/guides/editing-start.md#welcome-screen).  
Den ligger över ERD-fliken så länge dokumentet inte har någon tabell, någon synlig anteckning eller någon synlig tabellgrupp. Den visas inte medan `readonly` är satt, i zenläget eller medan panelen Tabellegenskaper, diff-visaren, tidsresan eller förhandsgranskningen av automatisk layout är öppen. Den första tabellen, synliga anteckningen eller synliga tabellgruppen tar bort den, och en ångring tillbaka till ett tomt diagram tar fram den igen.  
Dess rader `New Table`, `New Memo` och `Command Palette` visar den första tangentkombinationen för `addTable`, `addMemo` och `search` så som [setKeyBindingMap](#setkeybindingmap) lämnade dem, och ingen för ett namn som lämnats tomt. Dess pilar pekar på knapparna `Theme` och `Display Language` bara där `enableThemeBuilder` och `enableLocalePicker` visar dem.  
I dess meny flyttar `↑`, `↓`, `Home` och `End` mellan raderna och förhindras och stoppas. `Enter` och `Space` stoppas men förhindras inte, så att den fokuserade raden tar emot dem, och `Escape` bland formaten under `Import` går tillbaka och förhindras och stoppas. Alla andra tangenter når editorn och sidan som vanligt.  
Den ändrar ingenting i dokumentet, så den lämnar `value` som det var och skickar ingen `change`.  
Slå på den när [setInitialValue](#setinitialvalue) har läst in dokumentet, som de officiella värdprogrammen gör, så att skärmen aldrig blinkar till över en fil som fortfarande läses in.

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

Hämtar det aktuella dokumentet som en JSON-sträng, i det [schema](./advanced/schema.md) som editorn definierar.  
Sedan `4.0.0` är det lagringsformen, dokumentet så som en fil innehåller det, vilket också är vad exporten i formatet `json` skriver och de officiella värdprogrammen sparar. Det innehåller bara de aktiva entiteterna, utan de borttagna, staplingsordningen eller det som editorn räknar ut själv, som uppmätta bredder, nyckelmärken och relationernas fästpunkter. Dess entiteter har sina nycklar i en fast ordning, det är indraget med två blanksteg och det slutar med en radbrytning, så samma dokument ger alltid samma byte.  
Varje inställning vars [lås](../guide/guides/settings.md#lock) är på skrivs med det värde den är låst vid, inte så som skärmen visar den. Låset `Viewport` omfattar `originX`, `originY` och `zoomLevel`, och `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case` och `Bracket Type` omfattar var och en sin egen inställning. Alla andra inställningar skrivs som de är, och `lockSettings` skrivs alltid. Se [Settings](./advanced/schema.md#settings) för bitarna.  
Ett nytt dokument har alla lås på, oavsett om det är det som ett element visar innan det får ett värde eller ett som har lästs in från ett blankt värde. Dess `value` behåller origo vid `0, 0`, zoomnivån `1`, ERD-fliken samt standardvärdena för kodgeneratorns språk, namnens skiftlägen och typen av citattecken tills motsvarande lås slås av.  
Före `4.0.0` returnerade gettern hela dokumentet så som editorn hade det, med `ignoreSaveSettings` tillämpat. Dokumentet så som editorn har det är nu [runtimeValue](#runtimevalue), och `ignoreSaveSettings` varken läses eller skrivs längre.

```js
const data = editor.value;
```

### setter {#setter}

Läser in ett tidigare sparat editortillstånd. Den ersätter hela dokumentet – det aktuella töms först.  
Liksom `clear()`, `setInitialValue()` och metoderna `setSchema*` i sitt standardläge `mode: 'replace'` rensar den också flödet på fliken Visualisering: dess layout, tabellerna som det är avgränsat till, dess radvisning, zoom och panorering. Ett tillägg (`mode: 'append'`) rensar det inte.  
Den registreras i historiklistan, så att `Undo, Redo` fungerar, och den skickar `change`.  
Den tar emot lagringsformen, ett [runtimeValue](#runtimevalue) eller en fil som en tidigare version har sparat.  
En blank sträng, eller allt som inte är en sträng, läser in ett nytt dokument i stället för att orsaka ett fel, så kontrollera värdet innan du tilldelar det.  
Det nya dokumentet är det som `setInitialValue('')` startar: tomt, med standardinställningar och sedan `4.0.0` med alla lås på. I `3.10.x` sparade det varken rullningspositionen eller zoomnivån, och dessförinnan sparade det båda.  
En delad store vidarebefordrar den inläsningen till medarbetarna med det nya dokumentets fullständiga JSON, så att varje deltagare, även en med en äldre version, läser in samma dokument.  
Sedan `4.0.0` kommer det inlästa dokumentets lås, och de låsta värden som `value` sedan skriver, från texten, och vyn hamnar där texten placerar den, eller på diagrammet när ingen del av det ritas där. För varje annan inställning som texten låser – fliken, kodgeneratorns språk, namnens skiftlägen och typen av citattecken – fortsätter editorn att visa det den visade före inläsningen. En inställning som texten lämnar olåst får textens värde. [setInitialValue](#setinitialvalue) tar i stället varje värde som texten innehåller; se den även för en text som inte anger några lås.  
Text som inte är JSON, till exempel en fil där konfliktmarkörer från en sammanslagning har lämnats kvar, orsakar inte heller något fel: dokumentet töms, dess inställningar förblir som de var och tolkningsfelet loggas i konsolen.  
Den ignoreras medan `readonly` är satt; använd [setInitialValue](#setinitialvalue) för att läsa in i en skrivskyddad editor.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Hämtar sedan `4.0.0` dokumentet så som den här editorn har det, som en JSON-sträng. Den har ingen setter, så en tilldelning kastar ett undantag i kod i strikt läge.  
Den innehåller det som [value](#value) utelämnar: borttagna entiteter och deras ordning, staplingsordning, uppmätta bredder, nyckelmärken, relationernas fästpunkter och sekvenser. Låsta inställningar skrivs med sina låsta värden även här.  
Använd den för att initiera en annan editor som ansluter till en session som redan pågår, till exempel en medarbetare eller en andra vy av samma dokument, via dess [setInitialValue](#setinitialvalue). En ångring av en borttagning som sessionen skickar senare återställer då entiteten i sin helhet där, medan en editor som har initierats från `value` inte innehåller någon borttagen entitet och i stället återställer en tom, namnlös tabell. Se [Gemensam redigering](./advanced/collaborative-editing.md).  
Ingenting samlar längre in borttagna entiteter, så de ligger kvar i den tills dokumentet nästa gång öppnas från sin fil.  
Skriv den aldrig till en fil: spara `value`, som [JSON Schema](./advanced/schema.md#json-schema) godkänner, till skillnad från den här.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Läser in ett tidigare sparat editortillstånd. Själva inläsningen registreras inte i historiklistan, så den kan inte ångras, och ingen händelse `change` skickas.  
Den tömmer också ångrahistoriken, så ingenting som gjordes före inläsningen kan ångras eller göras om på det inlästa dokumentet.  
Den tar emot lagringsformen, ett [runtimeValue](#runtimevalue) eller en fil som en tidigare version har sparat, och till skillnad från en tilldelning av `value` tar den över varje inställning som texten innehåller, inklusive fliken och kodinställningarna.  
En blank sträng, eller allt som inte är en sträng, läser in ett nytt dokument i stället för att orsaka ett fel, så `setInitialValue('')` startar ett tomt diagram.  
Sedan `4.0.0` har det nya dokumentet, som också är det som ett element visar innan det får något värde, alla lås på. Rullning, zoomning, flikbyten och ändringar av kodgeneratorns språk, namnens skiftlägen eller typen av citattecken lämnar `value` som det var och skickar ingen `change`. I `3.10.x` sparade det varken rullningspositionen eller zoomnivån, och dessförinnan sparade det båda.  
Ett dokument som läses in från text behåller de lås som det anger. Ett som inte anger några – varje fil som sparades före `4.0.0`, oavsett vad dess `ignoreSaveSettings` angav, och en `.vuerd`-fil från v2 – öppnas med alla lås på, med `Viewport` låst vid origo `0, 0` och zoomnivå `1`, på ERD-fliken och med språk, namnens skiftlägen och typ av citattecken så som det sparade dem.  
I båda fallen öppnas vyn vid dokumentets vy – den som texten sparade när den anger sina lås, origo `0, 0` vid zoomnivå `1` när den inte anger några – eller på diagrammet när ingen del av det ritas där. När `Viewport` är låst behålls dess låsta värden fortfarande i `value`.  
Sedan `4.0.0` kasserar den också tillståndet för gemensam redigering för det dokument som fanns tidigare, och en [delad store](#getsharedstore) för den här editorn som redan prenumererar ber de andra editorerna om deras tillstånd igen, så att en editor som har lästs in på nytt i en pågående session kommer i kapp. Initiera en sådan editor med en annan editors [runtimeValue](#runtimevalue).  
Text som inte är JSON orsakar inte heller något fel: dokumentet töms, dess inställningar förblir som de var och tolkningsfelet loggas i konsolen.  
Till skillnad från en tilldelning av `value` blockeras den inte av `readonly`, så det är så du läser in ett dokument i en skrivskyddad visare.

```js
editor.setInitialValue('json...');
```

Läs in vid start, spara vid ändring.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Händelser {#event}

`change`, `changePresetTheme` och `changeLocale` är de enda tre offentliga händelserna; `changeLocale` är ny i `4.0.0`.  
Elementet skickar också interna händelser `@dineug/erd-editor/internal-*` till sig självt för sina egna kopplingar; de ingår inte i API:t.

### change {#change}

När något ändras i editorn skickas en händelse.  
Händelsen har en debounce på 200 ms, och den skickas inte medan `readonly` är `true`.  
Den utlöses vid varje dokumentändring – en redigering i gränssnittet, en tilldelning av `value`, `clear()`, var och en av metoderna `setSchema*` och sedan `4.0.0` `setSchemaJSON()` och `Import and Add`. `setInitialValue` skickar den inte.  
Ingenting som görs i flödesläget på fliken Visualisering skickar den – zoomning, panorering, att flytta kort, `Tidy Up`, radvisningen eller att avgränsa vyn från ett kort – eftersom inget av det är en dokumentändring.  
Sedan `4.0.0` skickas den inte heller vid en ändring av en inställning vars [lås](../guide/guides/settings.md#lock) är på, eftersom en sådan ändring bara påverkar skärmen och aldrig `value`: en rullning eller zoomning av ERD-arbetsytan medan `Viewport` är låst, ett flikbyte medan `Canvas Type` är låst och en ändring av kodgeneratorns språk, skiftläget för tabellnamn, skiftläget för kolumnnamn eller typen av citattecken medan dess eget lås är på. Bara de ändringarna utelämnas, så en batch som också redigerar dokumentet skickar den fortfarande. Att låsa eller låsa upp en inställning skickar den.  
Alla lås är på i ett nytt dokument och i varje fil som sparades före `4.0.0`, så som standard skickar rullning, zoomning och flikbyten ingenting. Det gäller även att fokusera på tabeller från ERD-fliken, kortknappen med extern länk som tar dig från flödet tillbaka till ERD-fliken, att gå till en rad i utforskaren eller en sökträff och att öppna utforskaren eller gå till ett resultat i snabbsökningen från en annan flik. Var och en av dem skickar en `change` bara medan ett lås som omfattar den är av: `Canvas Type` för flikbytet och `Viewport` för den rullning som en kortknapp, ett resultat i snabbsökningen, en rad i utforskaren eller en sökträff också gör. Sedan `4.1.0` följer alla de rullningarna en och samma regel, [Var ett hopp hamnar](../guide/guides/table-related-functions.md#where-a-jump-lands), så ett tabellresultat i snabbsökningen rullar inte längre varje gång, och ett hopp som regeln lämnar på plats gör ingen rullning som kan skicka den. Att öppna, stänga eller ändra storlek på utforskaren gör arbetsytan smalare eller bredare utan att flytta dess origo, och skickar inte heller något. Före `4.0.0` skickade rullning, zoomning och flikbyten den alltid, även när `editor.value` blev detsamma.  
För att hoppa över skrivningar som inte ändrar något jämför du `editor.value` med det värde som du senast sparade, inte med filen som du läste in: en fil som en tidigare version skrev, en v2-fil eller en handredigerad fil kan bli annorlunda i `value` så snart den läses in, eftersom `value` skriver den i lagringsformen. Detsamma gäller en fil där låset `Viewport` är av och vars origo inte ritar ut någon del av diagrammet på den här skärmen: inläsningen flyttar vyn till diagrammet, och `value` skriver var den hamnar. Sedan `4.0.0` orsakar uppmätta bredder inte längre detta, eftersom `value` inte innehåller några. Ett värdprogram som skriver filer kan i stället skilja en redigering från en vyändring med `changed` i en replikeringsstore – se [on@change](./advanced/remote-storage.md#onchange).  
Händelsen har ingen `detail`, bubblar inte och passerar inte shadow-gränsen, så lyssna på själva elementet och läs `editor.value` i hanteraren.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Skickas när det förinställda temat ändras från det inbyggda temaverktyget, eller sedan `4.0.0` från `Theme` i snabbsökningen. Varje val skickar den, även ett val av det alternativ som redan gäller.  
Om du själv anropar [setPresetTheme](#setpresettheme) eller [setSystemAppearance](#setsystemappearance), eller slår på eller av [systemDarkMode](#systemdarkmode), skickas den inte.  
`event.detail` är det fullständiga `ThemeOptions` efter valet – `{ appearance, grayColor, accentColor }` – inte det partiella objekt som begärdes. Sedan `4.0.0` är dess `appearance` `'system'` medan `System` är valt, inte det ljusa eller mörka utseende som visas, så spara det som det är och skicka tillbaka det till `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Skickas sedan `4.0.0` när ett språk väljs i editorn, från språkväljaren eller från `Display Language` i snabbsökningen, som båda slås på av [enableLocalePicker](#enablelocalepicker).  
Den utlöses efter att språket har tillämpats, vid varje val, även ett val av det alternativ som redan gäller. [setLocale](#setlocale) och [setSystemLocale](#setsystemlocale) skickar den aldrig, och det gör inte heller en ändring av webbläsarens språk. Ett språkbyte skickar ingen `change`.  
`event.detail` är `{ locale }`, ett `LocaleOption`: `'system'` när `System` valdes, annars språkets kod. Elementet kommer inte ihåg valet, så spara det och skicka det till `setLocale` vid nästa inläsning.  
Precis som `change` bubblar den inte, så lyssna på själva elementet.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Ger editorn fokus.

```js
editor.focus();
```

## blur {#blur}

Tar bort fokus från editorn.

```js
editor.blur();
```

## clear {#clear}

Tömmer dokumentet och tar bort alla tabeller, kolumner, relationer, index och anteckningar, och sedan `4.0.0` alla tabellgrupper.  
Alla inställningar finns kvar, inklusive databasen, vypositionen, zoomnivån, visningsalternativen för tabeller, varje lås med det värde det håller och skripten `Before tables` och `After tables` på fliken Schema SQL, så en tömd fil fortsätter att spara det den sparade. Om du i stället vill starta ett nytt dokument tilldelar du `''` till `value` eller anropar `setInitialValue('')`.  
Den registreras i historiklistan, så den kan ångras, och den skickar `change`. En ångring tar tillbaka dokumentet så som editorn hade det, med varje låst inställning vid sitt låsta värde. Den ignoreras medan `readonly` är satt.

```js
editor.clear();
```

## destroy {#destroy}

Förstör editorinstansen helt så att den inte längre kan återanvändas.  
Den frigör editorns lyssnare och prenumerationer och förstör varje delad store som [getSharedStore](#getsharedstore) har returnerat.  
En strömbatch som en delad store fortfarande håller inne kastas tillsammans med storen; anropa först [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) för den storen för att skicka den.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Definierar om kortkommandon.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` och `zoomReset` är fasta och kan inte definieras om.  
Bara de tjugoett namnen nedan skrivs; allt annat i objektet ignoreras, inklusive de fasta namnen.  
Sedan `3.10.0` kan `search` definieras om, och `findReplace` är ny. Tidigare var `search` fast. Sedan `4.0.0` är `removeSelection` ny. Sedan `4.1.0` är `addTableGroup` och `groupSelectedTables` nya.  
Ett bindningsvärde måste vara en `ShortcutOption[]`. En ensam sträng ignoreras, så skriv `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` i stället för `{ addTable: 'Alt+KeyN' }`.  
En tom array godtas och binder ingenting: `setKeyBindingMap({ findReplace: [] })` överlåter `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac) till sidan, och `{ search: [] }` gör detsamma för `Ctrl + K` (Windows/Linux) eller `⌘ + K` (Mac). Knappen `Search` i verktygsfältet öppnar fortfarande snabbsökningen, knappen `Explorer` i verktygsfältet öppnar och stänger fortfarande utforskaren, och `Toggle Explorer` i snabbsökningen och i arbetsytans snabbmeny öppnar fortfarande dess sökning eller stänger den; ingen av dessa visar något kortkommando för ett namn som lämnats tomt. `{ removeSelection: [] }` överlåter `Delete` och `Backspace` till sidan, och borttagningsraderna i menyerna för tabeller, anteckningar och tabellgrupper (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) visar då inget kortkommando.  
Sedan `4.1.0` överlåter `{ addTableGroup: [] }` `Alt + G` (Windows/Linux) eller `⌥ + G` (Mac) till sidan, och `{ groupSelectedTables: [] }` överlåter `T` och sedan `G`. `New Table Group` i arbetsytans verktygsfält, i arbetsytans snabbmeny och i snabbsökningen, `Group selected tables` i tabellmenyn och `Group Selected Tables` i snabbsökningen fungerar fortfarande, men utan att något kortkommando visas. Knappbeskrivningarna för knapparna `New Table`, `New Memo` och `New Table Group` i arbetsytans verktygsfält anger den första tangentkombinationen för `addTable`, `addMemo` och `addTableGroup`, eller bara knappen för en bindning som lämnats tom.  
Anropet är en partiell sammanslagning: namn som du utelämnar behåller sina standardvärden, och om du anropar den två gånger behålls de tidigare ändringarna. Det finns ingen getter för de aktuella bindningarna: [createKeyBindingMap](#createkeybindingmap) returnerar standardvärdena, inte det som `setKeyBindingMap` har ändrat.

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

`selectAllTable`, `handTool`, `removeSelection` och sedan `4.1.0` `groupSelectedTables` ger företräde åt en textmarkör: medan fokus är i ett inmatningsfält, ett textområde eller ett `contenteditable` markerar `$mod + A` texten, `Space` skriver ett blanksteg, `Delete` och `Backspace` raderar text och `T` och sedan `G` skriver de två bokstäverna, i stället för att nå arbetsytan. Inget av dessa tryck förhindras. Vad du än binder om dem till beter sig på samma sätt.

Sedan `4.0.0` tar `removeSelection` (`Delete` eller `Backspace`) bort markeringen på ERD-fliken som ett steg i ångrahistoriken, utan att fråga. När den fokuserade tabellen är det enda som är markerat, en eller flera av dess kolumner är markerade och zoomnivån ritar ut dess rader, tar den bort de kolumnerna; annars tar den bort alla markerade tabeller, anteckningar och tabellgrupper, medan gruppernas tabeller behålls. Se [Ta bort tabeller och anteckningar](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
En nedhållen tangent tar bort en gång, och ingenting tas bort medan ett redigeringsfält för en cell, en anteckning eller ett tabellgruppsnamn är öppet. Utanför textfält och de paneler som håller tillbaka bindningar (se [createKeyBindingMap](#createkeybindingmap)) förhindras trycket på varje flik medan editorn har fokus, även på en fokuserad knapp i verktygsfältet och i en skrivskyddad editor, där det inte tar bort något.

Sedan `4.1.0` aktiverar `addTableGroup` (`Alt+KeyG`) ritläget `New Table Group` på ERD-fliken, där nästa tryck med den primära musknappen på arbetsytan ritar gruppen, och ett nytt tryck på tangentkombinationen avaktiverar ritläget, precis som knappen `New Table Group` i arbetsytans verktygsfält gör. `groupSelectedTables` (`KeyT KeyG`, `T` och sedan `G`) lägger de markerade tabellerna i en ny grupp och öppnar dess namnfält, som `Group selected tables` i en tabells snabbmeny gör. Utan någon markerad tabell lägger den inte till något; en markerad anteckning eller tabellgrupp räknas inte. Se [Rita en grupp](../guide/guides/table-groups.md#drawing-a-group) och [Gruppera markerade tabeller](../guide/guides/table-groups.md#grouping-selected-tables).  
Båda verkar bara där menyerna erbjuder en grupp: inte medan `readonly` är satt, medan visningsalternativet `Table Groups` döljer grupperna eller medan ett redigeringsfält för en cell, en anteckning eller ett tabellgruppsnamn är öppet. Liksom arbetsytans övriga bindningar verkar de bara på ERD-fliken, och inte medan snabbsökningen, panelen Tabellegenskaper, diff-visaren, tidsresan, förhandsgranskningen av automatisk layout, `Export image` eller `Map Columns` är öppen. Där de inte gör något förhindras trycket ändå, utom när `groupSelectedTables` ger företräde åt en textmarkör. `addTableGroup` stoppas också, liksom `focusView` och `zenMode`, så att en lyssnare för bubblande `keydown` på sidan aldrig uppfattar trycket.

Sedan `3.10.0` öppnar `findReplace` (`$mod+KeyF`) [Sök och ersätt](../guide/guides/find-and-replace.md). Sedan `4.1.0` visar och döljer den [utforskaren](../guide/guides/explorer.md#opening-and-closing) som innehåller funktionen, och fliken Kortkommandon listar den som `Toggle Explorer`.  
Medan knappen `Explorer` i verktygsfältet visas som nedtryckt (utforskaren är öppen på ERD-fliken och inte dold av zenläget) stänger den utforskaren, om inte snabbsökningen, panelen Tabellegenskaper, temaverktyget, språkväljaren, dialogrutan `Export image` eller `Map Columns` är öppen. Annars stänger den det av dessa som är öppet, tar fram ERD-fliken från vilken annan flik som helst och öppnar utforskaren med textmarkören i fältet `Find` och sökfrågan markerad. En editor som är för smal för att visa utforskaren bredvid arbetsytan låter den vara öppen men vika undan och visar meddelandet `Widen the window to show the Explorer`. Före `4.1.0` öppnade den den flytande panelen Sök och ersätt, eller gav tillbaka tangentbordet till dess fält, och stängde den aldrig.  
Den ger inte företräde åt en textmarkör: medan editorn har fokus fångas den på varje flik, från arbetsytan eller från ett inmatningsfält i editorn. Trycket förhindras, så att webbläsaren inte öppnar någon sökruta, och stoppas, så att ingen lyssnare för bubblande `keydown` på sidan uppfattar det. När ett redigeringsfält för en cell eller anteckning är öppet, eller sedan `4.0.0` ett redigeringsfält för ett tabellgruppsnamn, förhindras och stoppas den fortfarande, men gör ingenting.  
Medan diff-visaren, tidsresan eller förhandsgranskningen av automatisk layout är öppen, på vilken flik som helst, eller medan en teckensammansättning i en IME fortfarande pågår, förhindras den inte och stoppas inte heller, så att webbläsarens eller värdprogrammets egen sökning får den. I utforskaren stoppas ett tryck under pågående teckensammansättning, men det förhindras inte. Vad du än binder om `findReplace` till beter sig på samma sätt.

`focusView` verkar bara på ERD-fliken. Med minst en markerad tabell öppnar den fliken Visualisering i flödesläget, avgränsad till de tabellerna och varje tabell en relation bort; en markerad anteckning eller tabellgrupp räknas inte, och utan någon markerad tabell gör den ingenting. Se [Fokusera på tabeller](../guide/guides/visualization.md#focusing-on-tables).

`stop` (`Escape`) på ERD-fliken avslutar ett öppet redigeringsfält för en cell eller anteckning, eller en relation som håller på att ritas, och lämnar markeringen som den är. Sedan `4.0.0` avslutar den också ett redigeringsfält för ett tabellgruppsnamn, utan att skriva något namn, och ritläget `New Table Group`. Editorn anropar `preventDefault()` för det trycket.  
När inget av dem är öppet avmarkerar `Escape` allt och släpper den fokuserade cellen, och trycket förhindras inte. Att lämna en redigering och avmarkera allt kräver därför två tryck.  
Utom i utforskaren, bland formaten under `Import` på [välkomstskärmen](#enablewelcomescreen) och i väljarna och dialogrutorna nedan hindrar editorn aldrig `Escape` från att spridas, så en sida som själv lyssnar efter den, till exempel för att stänga en egen dialogruta, uppfattar båda trycken och kan hoppa över det vars `defaultPrevented` är `true`.  
Medan snabbsökningen, panelen Tabellegenskaper, diff-visaren, förhandsgranskningen av automatisk layout eller tidsresan är öppen stänger `Escape` i stället den och lämnar markeringen som den är. Inte heller det trycket förhindras.  
Sedan `4.0.0` tar även en öppen dialogruta [`Export image`](../guide/guides/file-import-export.md#image) eller [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) emot `Escape`, stänger sig själv och lämnar markeringen som den är. Var och en tar över tangentbordet när den öppnas, och det trycket på `Escape` både förhindras och stoppas.  
Sedan `4.1.0` ger ett tryck på `Escape` med fokus i [utforskaren](../guide/guides/explorer.md#keys-in-the-explorer), i dess träd, dess fält eller dess knappar, tillbaka tangentbordet till arbetsytan och lämnar utforskaren öppen och markeringen som den är. Editorn anropar både `preventDefault()` och `stopPropagation()` för trycket, så det når aldrig en lyssnare för bubblande `keydown` på sidan.  
Ett tryck på `Escape` på arbetsytan stänger aldrig utforskaren. Före `4.1.0` stängdes panelen Sök och ersätt av ett tryck på `Escape` i den, och ett tryck på arbetsytan stängde den i samma tryck som avmarkerade allt.  
Sedan `4.0.0` stängs språkväljaren och färgväljaren med `Escape`: inuti dem förhindras och stoppas trycket, och på arbetsytan stänger det dem i samma tryck som avmarkerar allt, utan att förhindras eller stoppas.  
Ett tryck på `Escape` medan en teckensammansättning i en IME fortfarande pågår hör till teckensammansättningen. Det lämnar ett öppet redigeringsfält som det är och förhindras inte, så en sida kan också hoppa över ett tryck vars `isComposing` är `true`, eller vars `keyCode` är `229`. I utforskaren stoppas ett sådant tryck också, liksom varje tangent som trycks där mitt i en teckensammansättning, och tangentbordet stannar i fältet.  
Före `3.9.2` gjorde ett enda tryck på `Escape` både att en redigering eller ritning avslutades och att allt avmarkerades, och editorn förhindrade det aldrig.

### createKeyBindingMap {#createkeybindingmap}

Sedan `3.9.2` exporterar paketet `createKeyBindingMap()` och tillsammans med den typerna `KeyBindingMap`, `KeyBindingName` och `ShortcutOption`.  
Den returnerar standardtangentkombinationerna, alla 28 namn inklusive de fasta, som en ny mappning vid varje anrop, så att en ändring av den mappning som den returnerar inte ändrar något annat.  
Det är den som varje editor utgår från, och ett anrop av `setKeyBindingMap` syns inte i den.  
Bara `createKeyBindingMap` är en körtidsexport; de andra tre är typer.

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

Varje `shortcut` är en tangentkombination i syntaxen för [tinykeys](https://github.com/jamiebuilds/tinykeys) som anger sin tangent med `KeyboardEvent.code`, där [`$mod`](#mod) är `⌘` i macOS och `Control` på andra plattformar.  
Sedan `4.0.0` tolkar editorn själv dessa tangentkombinationer i stället för via tinykeys, med samma syntax. En tangent matchar via sin `code`, eller via sin `key` i valfritt skiftläge, och ett tryck matchar bara när exakt de modifierartangenter som anges hålls ned. `AltGraph` räknas som `Control` och `Alt` i Windows och som `Alt` i macOS. Tryck som skiljs åt av ett blanksteg bildar en tangentsekvens, som börjar om efter en sekund utan något tangenttryck.  
Sedan `4.1.0` är ett av standardvärdena en tangentsekvens: `groupSelectedTables` är `KeyT KeyG`, `T` och sedan `G`. En tangentsekvens körs vid det tryck som fullbordar den, och bara det trycket får dess `preventDefault` och `stopPropagation`, så med standardvärdena når `T` sidan och bara `G` förhindras. Menyer, snabbsökningen och fliken Kortkommandon visar en tangentsekvens som en tangent per tryck.  
De fasta namnen är bundna till `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) och `$mod+Digit0` (`zoomReset`). `edit` och `stop` har inga flaggor; de andra fem har `preventDefault` och `stopPropagation`. Resten är standardvärdena ovan, bland dem `search` och `findReplace`.

Editorn lyssnar efter dessa på sitt eget element, så ett värdprogram som fångar tangenter före editorn, med globala kortkommandon eller en lyssnare för `keydown` i capture-fasen, måste släppa igenom dem medan editorn har fokus.  
Bygg listan över vad som ska släppas igenom från `createKeyBindingMap()`, med de bindningar som du skickade till `setKeyBindingMap` i stället för standardvärdena.  
Sedan `3.10.0` innehåller den listan `$mod+KeyF`, webbläsarens egen tangentkombination för sökning. Ett värdprogram som vill behålla sin egen sökning på den tangentkombinationen anropar `setKeyBindingMap({ findReplace: [] })`.  
Sedan `4.0.0` innehåller den också `Delete` och `Backspace` utan modifierartangenter. Ett värdprogram som vill behålla de tangenterna anropar `setKeyBindingMap({ removeSelection: [] })`.  
Sedan `4.1.0` innehåller den också `Alt+KeyG` och tangentsekvensen `KeyT KeyG`, som kommer som en enda sträng: dela den vid blanksteget och släpp igenom varje tryck, även `T` och `G` utan modifierartangenter, eftersom en tangentsekvens som saknar ett tryck aldrig fullbordas. Ett värdprogram som vill behålla de tangenterna anropar `setKeyBindingMap({ addTableGroup: [] })` eller `setKeyBindingMap({ groupSelectedTables: [] })`.

Medan fokus är i utforskaren, i dess träd, dess fält `Find` och `Replace` eller dess knappar, går `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` och `zoomReset` vidare till editorn, så `findReplace` verkar där som på arbetsytan. Varje annan bindning, så som den är inställd för tillfället, stannar vid utforskaren, en tangentsekvens vid sitt sista tryck (ett ensamt `G` med standardvärdena), och det gör även piltangenterna, `Tab`, `Enter`, `Space`, `Home`, `End` och varje tangent som trycks medan en teckensammansättning i en IME fortfarande pågår. Utom `Escape`, som ger tillbaka tangentbordet till arbetsytan, stoppas de utan att förhindras, så de fungerar som vanliga tangenter i utforskarens fält, knappar och träd och når varken arbetsytan eller en lyssnare för bubblande `keydown` på sidan: `Alt + N` lägger där inte till någon tabell, och `Delete` tar inte bort något. De tangenter som flyttar mellan rader i trädet, fäller ihop dem eller går till dem, och `Enter` i fältet `Find` eller `Replace`, som flyttar mellan träffarna eller ersätter, förhindras också.  
Alla andra tangenter, till exempel ett värdprograms tangentkombination för att spara eller för kommandopaletten, går vidare till sidan som vanligt. Se [Tangenter i utforskaren](../guide/guides/explorer.md#keys-in-the-explorer). Före `4.1.0` höll den flytande panelen Sök och ersätt tillbaka tangenter på samma sätt, utom `Home`, `End`, det sista trycket i en tangentsekvens och `Space` medan `handTool` var bunden till en annan tangent.  
Sedan `4.0.0` håller språkväljaren tillbaka tangenter på samma sätt: samma sju bindningar går vidare, och varje annan bindning (sedan `4.1.0` en tangentsekvens vid sitt sista tryck), piltangenterna och `Tab` stoppas där utan att förhindras, liksom varje tangent som trycks medan en teckensammansättning i en IME fortfarande pågår. `↑`, `↓`, `Home`, `End`, `Enter` och `Space` på en av dess rader flyttar mellan raderna eller väljer en, och förhindras också.

### $mod {#mod}

Växlar tangenten `Control` beroende på miljön.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabell över kortkommandon {#shortcut-table}

Använder egenskaperna `key, code` i tangentbordshändelser.  
Använd `code` för absoluta positioner och `key` för inmatade värden.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Anger ett förinställt tema.  
Standardvärdena är `appearance: 'dark'`, `grayColor: 'slate'` och `accentColor: 'indigo'`.  
Varje fält tillämpas för sig, så ett partiellt anrop lämnar de andra två som de är. Ett värde som inte är något av namnen nedan ignoreras, och anropet kastar aldrig något undantag.  
Sedan `4.0.0` tar `appearance` även emot `'system'`, som motsvarar `System` i temaverktyget. Det visar det ljusa eller mörka utseende som operativsystemet rapporterar, eller det som [setSystemAppearance](#setsystemappearance) anger, och växlar när det ändras.

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

Anger sedan `4.0.0` det ljusa eller mörka utseende som utseendet `'system'` visar, för ett värdprogram med ett eget ljust och mörkt läge, till exempel ett IDE-tema. Medan ett sådant är angivet ignoreras operativsystemets ändringar.  
`null`, eller något annat värde än `'dark'` eller `'light'`, återgår till att följa operativsystemet.  
Medan utseendet är `'light'` eller `'dark'` ändrar den ingenting på skärmen, men värdet behålls och tillämpas så snart utseendet blir `'system'`. Annars tillämpas det genast. Den skickar ingenting, och `changePresetTheme` fortsätter att rapportera `'system'`.  
Värdprogrammen för VS Code, JetBrains och Obsidian anropar den med sitt eget ljusa eller mörka läge, och igen varje gång det ändras.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Gör det möjligt att anpassa temat.  
Varje anrop ersätter hela det anpassade lagret, så skicka hela objektet igen för att ändra en token ovanpå en befintlig åsidosättning, och skicka `{}` för att återgå till det förinställda temat.  
Bara tokennamnen nedan, med strängvärden, behålls; allt annat ignoreras utan fel.  
Lagret ligger ovanpå det förinställda temat, så ett senare `setPresetTheme` byter ut det förinställda temat under lagret medan dina åsidosättningar består.

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

`tableShadow` och `memoShadow` är färgen på den skugga som tabeller och anteckningar kastar på ERD-arbetsytan. Det mörka förinställda temat lämnar dem `transparent`, vilket inte ger någon skugga, precis som när du skickar `none` eller en tom sträng till `setTheme`; det ljusa förinställda temat använder `rgba(0, 0, 0, 0.18)`.

Sedan `4.0.0` finns ytterligare nio tokens:

- `tableGroupHeaderBackground`, `tableGroupBackground` och `tableGroupBorder` färgar namnlisten, ytan och konturen för en [tabellgrupp](../guide/guides/table-groups.md) som inte har någon egen färg.
- `toastSuccess` och `toastError` färgar märket i ett meddelande som rapporterar hur något slutade.
- `findReplaceError` och `mapColumnsError` färgar de fel som funktionen Sök och ersätt och dialogrutan Mappa kolumner visar. Sök och ersätt använde tidigare `diffDeleteForeground`, så en åsidosättning av den färgar inte längre om funktionen.
- `schemaSqlWarningBackground` och `schemaSqlWarningForeground` färgar varningarna i alternativen på fliken Schema SQL.

Sedan `4.1.0` finns ytterligare nio tokens:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` och `treeMatch` färgar trädet som [utforskaren](../guide/guides/explorer.md#the-tree) och [diff-visaren](../guide/guides/table-related-functions.md#diff-viewer) delar: dess bakgrund, som också fyller fälten `Find` och `Replace` i utforskaren; en rad under pekaren, tangentbordets rad medan trädet har fokus och en knapp under pekaren i utforskarens rubrikrad och sökning; raden för den aktuella sökträffen; nedtonad text som antal, datatyper och pilarna för att fälla ihop och ut; och märket bakom den text som en sökning hittade.
- `explorerBackground` och `explorerBorder` färgar utforskarens panel och dess linjer: dess kant mot arbetsytan, linjen under dess sökning och kanterna på dess fält och på de knappar som `Search In` fäller ut. `explorerBorder` ritar också kanten på diff-visarens träd, linjen under dess fält `Filter by name` och det fältets kant. Utforskarens nyckelikoner använder `keyPK`, `keyFK` och `keyPFK`.
- `diffModifyForeground` och `diffRenameForeground` färgar det som diff-visaren märker som ändrat och omdöpt, i sitt träd och i båda dokumenten. `diffModifyForeground` ritar också konturen runt en tabell, anteckning eller tabellgrupp som har flyttats, ändrat storlek, fått ny färg eller bytt grupp, oavsett vad mer som ändrades i den, och ritar relationslinjen för en sekundärnyckel som har ändrats.

`diffInsertForeground` och `diffDeleteForeground` färgar nu det som diff-visaren märker som tillagt och borttaget, i sitt träd och i det dokument som innehåller det, i text såväl som i konturer och relationslinjer. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` och `diffCrossForeground` togs bort i `4.1.0`, eftersom diff-visaren inte längre fyller celler. `setTheme` ignorerar dem som alla andra namn som inte finns i `Theme`, och deras krokar, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` och `--erd-editor-diff-cross-foreground`, läses inte längre.

#### CSS-variabler {#css-variables}

Varje token i `Theme` har en motsvarande CSS-krok som heter `--erd-editor-` följt av nyckeln i kebab-case: `grayColor10` är `--erd-editor-gray-color-10`, `keyPK` är `--erd-editor-key-pk` och `keyPFK` är `--erd-editor-key-pfk`.  
Krokarna ärvs in i editorn, så ange dem där du vill att de ska gälla. På `:root` styr de temat för varje editor på sidan; på själva elementet styr de temat för bara den editorn.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Sedan `3.4.0` stavas de felstavade tokens `dargSelect` som `dragSelect`, och deras krokar ändrades från `--erd-editor-darg-select-background` och `--erd-editor-darg-select-border` till `--erd-editor-drag-select-background` och `--erd-editor-drag-select-border`. En stilmall som fortfarande använder de gamla namnen ignoreras.

<details>
<summary>Standardvärden för temat</summary>

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
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Visningsspråk {#display-language}

Sedan `4.0.0` finns editorns egen text – dess menyer, paneler, dialogrutor, snabbsökningen, meddelanden och de ord den ritar på diagrammet, som `unnamed`, även i bildexporter – på 25 språk. Tabell- och kolumnnamn, SQL, datatyper och genererad kod översätts aldrig. Se [Språk och tema](../guide/guides/language-and-theme.md).  
Innan [setLocale](#setlocale) anropas eller ett språk väljs visar editorn engelska, eller följer `'system'` medan [enableLocalePicker](#enablelocalepicker) är på.  
Editorn sätter `lang` och `dir` på sin egen rot inuti den stängda shadow root, aldrig på värdelementet eller sidan, så en sida som skrivs från höger till vänster vänder inte på editorn och ett språk som skrivs från höger till vänster vänder inte på sidan. Hebreiska, arabiska och persiska lägger ut editorns gränssnitt från höger till vänster; själva diagrammet spegelvänds aldrig. Sedan `4.1.0` stannar [utforskaren](../guide/guides/explorer.md) till vänster om arbetsytan på alla språk, medan dess egna rader läses från höger till vänster på de tre språken.  
Paketet exporterar typerna `LocaleCode` (en av koderna nedan) och `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Kod     | Visas som            | Språk                    |
| ------- | -------------------- | ------------------------ |
| `id-ID` | Bahasa Indonesia     | Indonesiska              |
| `de-DE` | Deutsch              | Tyska                    |
| `en`    | English              | Engelska                 |
| `es-ES` | Español              | Spanska                  |
| `eu-ES` | Euskara              | Baskiska                 |
| `fr-FR` | Français             | Franska                  |
| `it-IT` | Italiano             | Italienska               |
| `nl-NL` | Nederlands           | Nederländska             |
| `pl-PL` | Polski               | Polska                   |
| `pt-PT` | Português            | Portugisiska             |
| `pt-BR` | Português Brasileiro | Brasiliansk portugisiska |
| `ro-RO` | Română               | Rumänska                 |
| `sk-SK` | Slovenčina           | Slovakiska               |
| `sl-SI` | Slovenščina          | Slovenska                |
| `sv-SE` | Svenska              | Svenska                  |
| `tr-TR` | Türkçe               | Turkiska                 |
| `ru-RU` | Русский              | Ryska                    |
| `uk-UA` | Українська           | Ukrainska                |
| `he-IL` | עברית                | Hebreiska                |
| `ar-SA` | العربية              | Arabiska                 |
| `fa-IR` | فارسی                | Persiska                 |
| `ja-JP` | 日本語               | Japanska                 |
| `zh-CN` | 简体中文             | Förenklad kinesiska      |
| `zh-TW` | 繁體中文             | Traditionell kinesiska   |
| `ko-KR` | 한국어               | Koreanska                |

### setLocale {#setlocale}

Anger visningsspråket: `'system'` eller en av koderna ovan. Allt annat, till exempel ett ensamt `'ko'`, en okänd kod eller ett värde som inte är en sträng, ignoreras utan fel.  
Språket tillämpas innan metoden returnerar, så ett språk som anges innan elementet infogas finns med i dess första bildruta.  
Den skickar ingenting, varken `changeLocale` eller `change`, och rör varken `value`, ångrahistoriken eller en delad store.  
Valet består oavsett om `enableLocalePicker` är på eller av, och `setLocale('system')` följer systemet även när väljaren är av.  
Editorn sparar ingenting. Om du vill behålla en läsares val lyssnar du efter [changeLocale](#changelocale) och skickar tillbaka det vid nästa inläsning.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Anger vilket språk `'system'` står för, som en BCP 47-tagg, för ett värdprogram med ett eget visningsspråk. Värdprogrammen för VS Code, JetBrains och Obsidian anropar den med sitt eget visningsspråk.  
Taggen trimmas. `null`, en blank sträng eller ett värde som inte är en sträng återgår till webbläsarens `navigator.languages`, som editorn följer när den ändras.  
Den spelar bara roll medan det gällande alternativet är `'system'`, och den tillämpas genast. Raden `System` i väljaren visar vilket språk den leder till.  
Taggen, eller vart och ett av webbläsarens språk i tur och ordning, leder till det första språk som editorn har, enligt dess språkundertagg, utan hänsyn till skiftläge och understreck: `de-AT` ger `de-DE` och `en-GB` ger `en`. Kinesiska avgörs av skriftsystemet, där `Hant` ger `zh-TW` och `Hans` ger `zh-CN`, och utan något skriftsystem av regionen, där `TW`, `HK` och `MO` ger `zh-TW` och alla andra `zh-CN`. `pt` ger `pt-BR` om ingen annan region än `BR` anges. När ingenting matchar visar editorn engelska.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Läser in en Schema SQL-fil.  
Som standard ersätter den det aktuella dokumentet i stället för att slå samman med det; se `mode` nedan. De inställningar du redan har behålls, inklusive varje lås och dess låsta värde, utom vypositionen och zoomnivån, och tabellerna placeras när filen har lästs, i rader om inte `placement` nedan anger något annat. När `Viewport` är låst skriver `value` sedan den vy som importen börjar på, origo `0, 0` vid zoomnivå `1`. Ett dokument som importeras till ett element som aldrig har fått något värde har därför alla lås på, precis som ett nytt dokument.  
Den registreras i historiklistan, så att `Undo, Redo` fungerar, och den skickar `change`. En tom sträng ignoreras, och anropet gör ingenting medan `readonly` är satt.  
`setSchemaGraphQL`, `setSchemaDBML` och `setSchemaAML` beter sig på samma sätt, och deras parsrar misslyckas aldrig: text som de inte kan läsa läser in ett tomt dokument i stället för att orsaka ett fel.  
Sedan `4.0.0` tar alla fyra emot ett valfritt andra argument, `{ placement, mode }`:

- `placement: 'grid'`, standardvärdet, placerar tabellerna i rader direkt, som tidigare, och anropet returnerar ingenting.
- `placement: 'auto'` placerar först ut tabellerna utifrån deras relationer, som `Import` i editorn gör, och returnerar ett `Promise` som uppfylls när importen har lagts in som ett steg i ångrahistoriken. Färre än två tabeller, ingen relation, en layout som misslyckas, en sida utan `SharedWorker` eller `Cancel` i meddelandet `Placing tables` placerar dem i stället i rader. En inläsning under tiden – en annan ersättande import, en tilldelning av `value`, `setInitialValue()`, `clear()`, en medarbetares inläsning eller en ångring eller omgörning av en inläsning eller av `clear()` – ersätter den, och `Promise` uppfylls utan att något har lästs in. Importer som placeras på det här sättet läggs in i den ordning de startade.
- `mode: 'replace'`, standardvärdet, ersätter dokumentet. `mode: 'append'` lägger till filen under diagrammet som [Importera och lägg till](../guide/guides/file-import-export.md#import-and-add) gör och lämnar varje tabell som redan finns som den är, liksom varje inställning utom fliken och vypositionen. Från en annan flik tas ERD-fliken fram först. De nya tabellerna, och de tabellgrupper som en DBML-fil har med sig medan tabellgrupper visas, blir markeringen, och vyn rullar till dem om de inte redan syns väl, enligt den regel som varje hopp följer sedan `4.1.0` – se [Var ett hopp hamnar](../guide/guides/table-related-functions.md#where-a-jump-lands). En ångring tar bort hela tillägget. Text som den inte kan läsa lägger inte till något och lämnar dokumentet som det är.

Medan `readonly` är satt ignoreras en ersättning, ett tillägg lägger inte till något och ett anrop med `placement: 'auto'` uppfylls genast.  
Sedan `3.10.0` läser `setSchemaSQL` filen för dokumentets aktuella databas: när Databricks är vald följer strängar inom enkla citattecken reglerna i Spark för maskering med omvänt snedstreck. Se [Kommentarer](../guide/guides/file-import-export.md#comments).  
Sedan `3.10.0` läser `setSchemaSQL` en `UNIQUE` över två eller fler kolumner som ett enda unikt index i stället för flaggan Unik på varje kolumn. Se [Unika nycklar och index](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Sedan `3.10.0` behåller SQL-, DBML- och AML-importer åtgärderna `ON DELETE` och `ON UPDATE` för de sekundärnycklar som de läser.  
Sedan `4.0.0` behåller `setSchemaSQL` hela uttrycket `DEFAULT` för en kolumn, läser `ADD DEFAULT … FOR` och kommentarerna `MS_Description` i SQL Server, gör om serial- och identity-kolumner i PostgreSQL till Automatisk uppräkning, behåller `UNSIGNED` och `ZEROFILL` i en datatyp och läser en primärnyckel som `ALTER TABLE … ADD PRIMARY KEY` anger som `CLUSTERED`, `NONCLUSTERED` eller `USING BTREE`. Se [Schema SQL](../guide/guides/file-import-export.md#schema-sql).  
Se [Importera eller exportera filer](../guide/guides/file-import-export.md) för den syntax som varje parser godtar.

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

Läser in ett GraphQL SDL-dokument.  
Definitioner av objekttyper blir tabeller, och ett fält vars typ är en annan tabell blir en relation.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Läser in en DBML-fil, det format som används av dbdiagram.io och dbdocs.  
Sedan `4.0.0` blir varje `TableGroup` en [tabellgrupp](../guide/guides/table-groups.md), och en tabells `headercolor` blir dess färg. Se [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Läser in en AML-fil (Azimutt Markup Language). Både det nuvarande skrivsättet och det äldre från v1 godtas.  
Sedan `4.0.0` blir en entitets färg, ett av färgnamnen i Azimutt eller ett hexvärde inom citattecken, färgen på dess tabell. Se [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Läser sedan `4.0.0` in ett `.erd.json`-dokument, till exempel den text som [value](#value) returnerar.  
I sitt standardläge `mode: 'replace'` läser den in dokumentet som en tilldelning av `value` gör: den registreras i historiklistan, skickar `change` och tar över dokumentets lås på samma sätt. Till skillnad från `value` ignoreras en tom sträng eller ett värde som inte är en sträng i stället för att starta ett nytt dokument. Text som inte är JSON tömmer dokumentet, precis som med `value`.  
`mode: 'append'` lägger till dokumentets tabeller, relationer, index, anteckningar och tabellgrupper under diagrammet med nya id:n, behåller deras placering i förhållande till varandra och utelämnar dokumentets inställningar, som [Importera och lägg till](../guide/guides/file-import-export.md#import-and-add) gör med en fil i formatet `json`. Text som den inte kan läsa, eller ett dokument utan någon tabell och utan någon anteckning, lägger inte till något. Annars hamnar det som vid ett tillägg med [setSchemaSQL](#setschemasql), med dess nya anteckningar och tabellgrupper markerade tillsammans med dess tabeller, varje typ medan den visas.  
Den returnerar när dokumentet har lagts in, och den ignoreras medan `readonly` är satt.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporterar det aktuella editortillståndet som Schema SQL.  
Om `databaseVendor` inte anges utgår den från det databassystem som är inställt för tillfället. Ett namn som inte finns i listan nedan behandlas på samma sätt, utan att orsaka något fel.  
Namn omges med den typ av citattecken som editorn visar. Medan `Bracket Type` är [låst](../guide/guides/settings.md#lock) kan den skilja sig från den som `value` sparar, som är den som en kodagents [`erd_read`](../mcp/tools.md#reading-a-document) använder.  
Sedan `4.0.0` väljer ett valfritt argument `options` satserna och inledningen, som alternativen på fliken [Schema SQL](../guide/guides/schema-sql.md) gör. `SchemaSQLOptions` exporteras som en typ.

- `statements`: `'create'`, standardvärdet; `'ifNotExists'`, som skriver `IF NOT EXISTS` för MySQL, MariaDB, PostgreSQL, SQLite och Databricks och faller tillbaka på `'create'` för övriga; eller `'recreate'`, som tar bort tabellerna innan de skapas, där Snowflake i stället skriver `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, standardvärdet; `'use'`, som växlar till dokumentets databas eller schema; eller `'createAndUse'`, som först skapar den om den inte finns och sedan växlar till den. En databas som saknar det begärda alternativet faller tillbaka som fliken gör: Oracle skriver `'use'` för `'createAndUse'`, PostgreSQL skriver ingen inledning för `'use'` och SQLite skriver ingen. En inledning skrivs bara medan dokumentets databasnamn är en enkel identifierare – ASCII-bokstäver, siffror och `_`, utan en siffra först.

Ett alternativ som utelämnas, eller ett med ett okänt värde, tolkas som sitt standardvärde, så ett anrop utan alternativ skriver vanliga satser med `CREATE` utan inledning, som tidigare.  
Sedan `4.0.0` innehåller utdata alltid dokumentets skript `Before tables` och `After tables`, i ordningen inledning, skript före, borttagningssatser, tabeller, skript efter. De egna valen `Statements`, `Header` och `Tables` på fliken Schema SQL påverkar aldrig det här anropet, som alltid skriver hela dokumentet.  
Sedan `3.10.0` har varje sekundärnyckel relationens satsdelar `ON DELETE` och `ON UPDATE`. En satsdel skrivs bara när dess åtgärd är angiven och databassystemet godtar den, så en åtgärd som det databassystemet inte stöder utelämnas och dess standardvärde gäller. Sedan `4.0.0` godtar Snowflake bara `NO ACTION`. Se [ON DELETE och ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) för vad varje databas skriver.  
Sedan `3.10.0` maskeras ett enkelt citattecken i en tabell- eller kolumnkommentar, så en kommentar som `it's` förstör inte längre satsen. Varje databassystem som skriver kommentarer som strängliteraler dubblerar det, utom Databricks, som sätter ett omvänt snedstreck före varje citattecken och varje omvänt snedstreck. SQLite skriver fortfarande kommentarer som rader med `--`.  
Sedan `4.0.0` skriver flera databaser också nyckelnamn, standardvärden och automatisk uppräkning på ett annat sätt. Se [Vad DDL-koden skriver](../guide/guides/schema-sql.md#what-the-ddl-writes).

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
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore {#getsharedstore}

Returnerar en store för gemensam redigering i realtid.  
`config` är `{ getNickname?, mouseTracker?, focusTracker? }`. Båda spårarna har standardvärdet `true`: `mouseTracker` sänder den här editorns markör till de andra, och `focusTracker` sänder dess fokuserade cell, markering och markeringsram.  
Se [Gemensam redigering](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Öppnar diff-visaren och jämför det dokument som är öppet med det som du skickar in.  
Den returnerar ingenting och ändrar inte dokumentet, så när du stänger visaren är editorn exakt som den var.  
Ett blankt värde, eller allt som inte är en sträng, jämförs med ett tomt dokument.  
Det är samma överlägg som [diff-visaren](../guide/guides/table-related-functions.md#diff-viewer) i arbetsytans snabbmeny.  
Sedan `4.1.0` parar den ihop innehållet i de två dokumenten i första hand efter id och först därefter efter vad vart och ett innehåller, till exempel en tabells namn eller en antecknings text – se [Vad som jämförs](../guide/guides/table-related-functions.md#what-is-compared). Mot en tidigare version av samma dokument, till exempel en Git-revision av dess fil, visas ett namnbyte därför som ett enda omdöpt objekt; mot ett dokument vars id:n skiljer sig visas det som en borttagning och ett tillägg. Visaren listar det som har ändrats i ett träd bredvid de två dokumenten och märker ändringarna med färg i stället för att fylla celler.

```js
editor.setDiffValue('prev json...');
```
