---
sidebar_position: 15
description: Editorns 25 visningsspråk, layout från höger till vänster, temaverktygets utseenden System, Light och Dark och dess färger samt var varje värdprogram lagrar dem.
---

# Språk och tema

Editorns egen text finns på 25 språk, och hur editorn ser ut bestäms av ett tema: ett utseende (`System`, `Light` eller `Dark`), en gråton och en accentfärg.  
Båda hör till personen som använder editorn, inte till diagrammet. Inget av dem sparas i filen, registreras i [ångrahistoriken](./undo-redo.md) eller delas med medarbetare, så var och en ser sina egna, och en ändring av något av dem markerar aldrig en fil som ändrad.

Inget av dem finns på fliken [Inställningar](./settings.md). Verktygsfältet har knappen `Theme` och direkt efter den knappen `Display Language`, båda efter knappen [`Explorer`](./explorer.md). [Snabbsökningen](./quick-search.md) listar `Theme` och `Display Language` på varje flik.  
Webbappen, Google Drive, VS Code, JetBrains-IDE:er och Obsidian erbjuder alla båda och kommer ihåg dina val – se [I varje värdprogram](#in-each-host). Båda fungerar även i en skrivskyddad editor.

## Visningsspråk {#display-language}

Språket gäller editorns egen text: knappbeskrivningarna i verktygsfältet, snabbmenyer, snabbsökningen, paneler och dialogrutor, fliken Inställningar, [välkomstskärmen](./editing-start.md#welcome-screen), aviseringar och meddelanden samt platshållaren som visas på arbetsytan och i en exporterad bild för ett tomt namn, en tom datatyp, ett tomt standardvärde eller en tom kommentar.  
På alla språk lämnas följande som de är skrivna: dina tabell- och kolumnnamn, kommentarer och anteckningar; databassystem, kodgeneratorns språk och filformat; datatyper, SQL-nyckelord och åtgärderna för `ON DELETE` och `ON UPDATE`; alternativen `Create`, `If not exists`, `Drop & re-create`, `USE` och `CREATE + USE` för Schema SQL; märkena `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` och `AK1.1`; statusbokstäverna `A`, `M`, `D`, `R` och `~` i [diff-visaren](./table-related-functions.md#diff-viewer); valen för skiftläge och för `Bracket` utom `None`; namnen på tangenter; temaverktygets färgnamn; genererad SQL och kod samt exporterade filnamn.

Språken, i den ordning som språkväljaren listar dem:

| I språkväljaren | Språk | Kod |
| --- | --- | --- |
| Bahasa Indonesia | Indonesiska | `id-ID` |
| Deutsch | Tyska | `de-DE` |
| English | Engelska | `en` |
| Español | Spanska | `es-ES` |
| Euskara | Baskiska | `eu-ES` |
| Français | Franska | `fr-FR` |
| Italiano | Italienska | `it-IT` |
| Nederlands | Nederländska | `nl-NL` |
| Polski | Polska | `pl-PL` |
| Português | Portugisiska | `pt-PT` |
| Português Brasileiro | Brasiliansk portugisiska | `pt-BR` |
| Română | Rumänska | `ro-RO` |
| Slovenčina | Slovakiska | `sk-SK` |
| Slovenščina | Slovenska | `sl-SI` |
| Svenska | Svenska | `sv-SE` |
| Türkçe | Turkiska | `tr-TR` |
| Русский | Ryska | `ru-RU` |
| Українська | Ukrainska | `uk-UA` |
| עברית | Hebreiska | `he-IL` |
| العربية | Arabiska | `ar-SA` |
| فارسی | Persiska | `fa-IR` |
| 日本語 | Japanska | `ja-JP` |
| 简体中文 | Förenklad kinesiska | `zh-CN` |
| 繁體中文 | Traditionell kinesiska | `zh-TW` |
| 한국어 | Koreanska | `ko-KR` |

Posten `Language` som snabbsökningen erbjuder på fliken Kodgenerator och raden `Language` i listan [Lås](./settings.md#lock) på fliken Inställningar är [kodgeneratorns målspråk](./code-generator.md#language), inte visningsspråket.

### Välja ett språk {#picking-a-language}

Knappen `Display Language` (en språkikon) öppnar väljaren `Display Language`, en panel med rubriken `Display Language` under verktygsfältet, ovanpå den flik som är öppen.  
`System` kommer först, med det språk det just nu står för bredvid sig, och förblir synligt medan listan rullar. Därefter följer de 25 språken, vart och ett under sitt eget namn, och en bock visar vilket alternativ som gäller.

![Visningsspråket byts från verktygsfältet till 한국어, sedan till العربية, som spegelvänder verktygsfältet men inte diagrammet, och tillbaka till System](/img/demo-display-language.webp)

Panelen öppnas med tangentbordsfokus på raden med bocken:

- `↑` och `↓` flyttar mellan raderna och fortsätter runt vid ändarna, och `Home` och `End` hoppar till den första och den sista.
- `Enter` eller `Space` väljer den fokuserade raden, som ett klick gör.

Ett val tillämpas direkt, stänger panelen och lämnar tillbaka tangentbordsfokus till editorn.

Stäng den utan att välja med `Escape`, med knappen `x` bredvid rubriken, vars knappbeskrivning visar `Close (ESC)`, med ett tryck var som helst i editorn utanför panelen utom på verktygsfältet eller med knappen `Display Language` igen.  
När den öppnas stängs temaverktyget och panelen Tabellegenskaper. En öppen [utforskare](./explorer.md#dialogs-beside-it) förblir öppen, och i ett språk som skrivs från vänster till höger placeras väljaren strax intill den i stället för ovanpå den.  
Den stängs när snabbsökningen eller temaverktyget öppnas, och likaså av `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac). Det kortkommandot öppnar [utforskaren](./explorer.md#opening-and-closing) med dess sökning, eller, om utforskaren redan är öppen, låter den vara öppen och flyttar tangentbordsfokus till dess sökfält. Knappen `Explorer` i verktygsfältet lämnar väljaren öppen.

Medan panelen har tangentbordsfokus fungerar några av editorns kortkommandon fortfarande: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` och `Zoom Reset` – se [Kortkommandon](./settings.md#shortcuts). Alla andra kortkommandon i editorn, piltangenterna och `Tab` når inte längre än panelen, så editorn reagerar inte på dem. Tangenter som editorn inte binder, till exempel värdprogrammets eget sparkommando, når värdprogrammet som vanligt.

I [snabbsökningen](./quick-search.md) listar posten `Display Language` alternativet `System` och de 25 språken, med en bock vid det alternativ som gäller. Där hittas ett språk även via sitt engelska namn eller sin kod, så `german` eller `de-DE` hittar `Deutsch`.

### Vad System följer {#what-system-follows}

I webbappen, Google Drive, VS Code, JetBrains-IDE:er och Obsidian är språket från början inställt på `System`. `System` följer värdprogrammets språk:

- I webbappen, Google Drive och på din egen sida: webbläsarens föredragna språk. En ändring av dem följs direkt.
- I VS Code: visningsspråket i VS Code.
- I en JetBrains-IDE: det språk som IDE:n visar sitt eget gränssnitt på.
- I Obsidian: Obsidians språk.

`System` väljer det första av dessa språk som editorn har, och engelska om den inte har något av dem.  
En regional variant räknas som sitt språk, så `de-AT` ger Deutsch och `fr-CA` ger Français. Kinesiska avgörs av skriftsystemet: traditionell skrift ger 繁體中文 och all annan skrift 简体中文. Om ingen skrift anges ger Taiwan, Hongkong eller Macao 繁體中文, och annan kinesiska ger 简体中文. Portugisiska ger Português Brasileiro om inte en annan region än Brasilien anges, så `pt-PT` ger Português; portugisiska i Obsidian ger också Português.

### Språk som skrivs från höger till vänster {#right-to-left-languages}

עברית (hebreiska), العربية (arabiska) och فارسی (persiska) ger editorn en layout från höger till vänster: verktygsfältet, menyerna, panelerna och dialogrutorna, snabbsökningen och fliken Inställningar spegelvänds. En snabbmenys undermenyer öppnas åt vänster, och ikonerna för Ångra och Gör om i verktygsfältet byter plats, så att Ångra pekar bakåt i läsriktningen för den som läser från höger till vänster.

Själva diagrammet spegelvänds aldrig. Arbetsytan med dess tabeller, kolumner, relationer och anteckningar behåller riktningen från vänster till höger, och detsamma gäller minikartan, rullningslisterna, [arbetsytans verktygsfält](./table-related-functions.md#canvas-toolbar), [visualiseringen](./visualization.md) och dess verktygsfält, datatypscellerna, koden på flikarna Schema SQL och Kodgenerator, färgväljaren, diff-visarens två sidor, tidsresan och förhandsgranskningen av automatisk layout.  
[Utforskaren](./explorer.md#beside-the-canvas) ligger kvar till vänster om arbetsytan, och diff-visarens ändringsträd till vänster i visaren, båda med sin dragkant på höger sida. Inuti läses båda från höger till vänster: deras fält och rader spegelvänds, raderna dras in från höger, och i båda träden fäller `←` ut en rad eller går till dess första underordnade rad medan `→` fäller ihop den eller går ut till dess överordnade rad – se [Tangenter i utforskaren](./explorer.md#keys-in-the-explorer).  
Namn, kommentarer och annan text som du har skrivit behåller sin egen riktning, så ett hebreiskt, arabiskt eller persiskt namn läses från höger till vänster även på arbetsytan.

## Tema {#theme}

Knappen `Theme` (en kontrastikon) öppnar temaverktyget, en panel med rubriken `Theme` under verktygsfältet, ovanpå den flik som är öppen. Det har tre delar:

- `Accent color`: 26 färgrutor. Knappbeskrivningen för var och en anger dess namn, till exempel `indigo`.
- `Gray color`: 6 färgrutor, `gray`, `mauve`, `slate`, `sage`, `olive` och `sand`.
- `Appearance`: `System`, `Light` och `Dark`.

![Temaverktyget öppnas från verktygsfältet, en accentfärg och en gråton väljs och utseendet byts till Light och sedan till System](/img/demo-theme-builder.webp)

I varje del visas vilket val som gäller, och ett val tillämpas direkt medan verktyget förblir öppet.  
Ett färgval lämnar utseendet som det är, så om du väljer en färg under `System` förblir utseendet `System`.

`System` visar ljust eller mörkt som värdprogrammet gör, och växlar när värdprogrammet växlar:

- I webbappen, Google Drive och på din egen sida: det ljusa eller mörka läge som webbläsaren rapporterar, vilket följer operativsystemet.
- I VS Code: ljust med ett ljust färgtema, och mörkt med ett mörkt färgtema eller något av de två högkontrasttemana.
- I en JetBrains-IDE: det ljusa eller mörka temat i IDE:n.
- I Obsidian: Obsidians ljusa eller mörka tema.

Stäng verktyget med `Escape`, med knappen `x` bredvid rubriken, vars knappbeskrivning visar `Close (ESC)`, med ett tryck var som helst i editorn utanför panelen utom på verktygsfältet eller med knappen `Theme` igen.  
När det öppnas stängs panelen Tabellegenskaper och väljaren `Display Language`. En öppen [utforskare](./explorer.md#dialogs-beside-it) förblir öppen, och i ett språk som skrivs från vänster till höger placeras verktyget strax intill den i stället för ovanpå den.  
Det stängs när snabbsökningen eller väljaren `Display Language` öppnas, och likaså av `Ctrl + F` (Windows/Linux) eller `⌘ + F` (Mac). Det kortkommandot öppnar [utforskaren](./explorer.md#opening-and-closing) med dess sökning, eller, om utforskaren redan är öppen, låter den vara öppen och flyttar tangentbordsfokus till dess sökfält. Knappen `Explorer` i verktygsfältet lämnar verktyget öppet.  
Verktyget fångar inga tangenter, så editorns kortkommandon fungerar medan det är öppet.

I [snabbsökningen](./quick-search.md) listar posten `Theme` alternativen `System`, `Light` och `Dark`, med en bock vid det utseende som gäller. Om du väljer ett av dem ändras bara utseendet, och gråtonen och accentfärgen lämnas som de är.

## I varje värdprogram {#in-each-host}

Det du väljer i editorn, från verktygsfältet eller snabbsökningen, sparas där värdprogrammet lagrar det, och varje öppet diagram följer en ändring av det direkt, var den än görs.  
I VS Code, en JetBrains-IDE och Obsidian motsvarar värdprogrammets `Auto` (värdet `auto` i VS Code) editorns `System`. Om du väljer `System` sparas `Auto`, och om du väljer `Light` eller `Dark` sparas det utseendet, även när `Auto` redan visade det.  
De egna inställningarna och meddelandena för tillägget och pluginen är på engelska oavsett visningsspråk.

### Webbappen och Google Drive {#web-app-and-google-drive}

På erd-editor.io, inklusive dess sessioner för gemensam redigering, och i Google Drive gäller ett språk och ett tema för appen och alla diagram i den.  
Båda lagras i den här webbläsaren, inte i schemat eller Drive-filen, och alla webbläsarflikar med erd-editor.io delar dem: ett val i en flik ändrar de andra direkt.

Språket är `System`, som följer webbläsarens föredragna språk, tills du väljer ett.  
Appens egen text, till exempel i sidofältet, papperskorgen, den gemensamma redigeringen och skärmarna för Google Drive, följer samma språk, och på hebreiska, arabiska och persiska får hela appen en layout från höger till vänster. Integritetspolicyn, användarvillkoren och supportsidorna förblir på engelska.  
Förutom editorns panel och snabbsökningen har sidofältets nedersta rad en språkknapp, vars knappbeskrivning visar `Display Language`, bredvid länkarna `Privacy` och `Terms`. Dess meny listar `System`, med det språk det står för, och sedan de 25 språken.

Temat är från början inställt på `System`, med gråtonen `olive` och accentfärgen `jade`.  
Förutom temaverktyget och snabbsökningen har sidofältets nederkant tre ikonknappar, `System`, `Light` och `Dark`: bredvid `Trash` på erd-editor.io och bredvid `Sign out` i Google Drive. De ställer in samma utseende som temaverktyget.

### VS Code {#vs-code}

Inställningarna för tillägget finns under ERD Editor i VS Code-inställningarna:

| Inställning | Värden | Standardvärde |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` eller en kod från [språktabellen](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | de sex gråtonerna | `slate` |
| `dineug.erd-editor.theme.accentColor` | de 26 accentfärgerna | `indigo` |

Inställningsredigeraren visar språkinställningens alternativ som `Auto` följt av varje språk under sitt eget namn. Ett värde i `settings.json` som inte anger något språk tolkas som `auto`.  
Ett temaval i editorn skriver alla tre temainställningarna. Ett val skrivs där dess inställning redan är angiven: i arbetsområdesmappen, annars i arbetsområdet, annars i användarinställningarna.

### JetBrains-IDE:er {#jetbrains-ides}

Settings | Tools | ERD Editor har `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` och `Display language:` (`Auto`, sedan varje språk under sitt eget namn), som sparas för hela IDE:n.  
De är från början `Auto`, `Slate`, `Indigo` och `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor har `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` och `Display language` (`Auto`, sedan varje språk under sitt eget namn), som sparas per valv.  
De är från början `Auto`, `Slate`, `Indigo` och `Auto`.  
En ändring gäller alla ERD-flikar i valvet, även de i fristående fönster.

### Din egen sida {#your-own-page}

Ett `<erd-editor>` på din egen sida visar varken knappen `Theme` eller `Display Language`, och snabbsökningen listar inget av dem, förrän sidan slår på dem med [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) och [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Tills sidan anger ett språk eller läsaren väljer ett visar editorn engelska, eller följer `System` medan `enableLocalePicker` är på.  
Temat är från början `Dark`, med gråtonen `slate` och accentfärgen `indigo`, om inte sidan anger ett annat eller slår på [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
En läsares val tillämpas direkt, men elementet sparar inget av valen: sidan anger själv startvärdena och sparar läsarens val – se [Tema](../../api/erd-editor-element.md#theme) och [Visningsspråk](../../api/erd-editor-element.md#display-language) i API:t.
