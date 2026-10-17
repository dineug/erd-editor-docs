---
sidebar_position: 15
description: Cele 25 de limbi de afișare ale editorului, aranjarea de la dreapta la stânga, aspectele sistem, luminos și întunecat ale configuratorului de teme și culorile acestuia, precum și locul în care fiecare aplicație gazdă le păstrează.
---

# Limbă și temă

Textul propriu al editorului există în 25 de limbi, iar înfățișarea sa este o temă: un aspect (`System`, `Light` sau `Dark`), un ton de gri și o culoare de accent.  
Ambele țin de persoana care folosește editorul, nu de diagramă. Niciuna nu se salvează în fișier, nu se înregistrează în [istoricul anulărilor](./undo-redo.md) și nu se partajează cu colaboratorii, așa că fiecare persoană le vede pe ale sale, iar schimbarea oricăreia dintre ele nu marchează niciodată un fișier ca modificat.

Niciuna nu se află în fila [Setări](./settings.md). Bara de instrumente are un buton `Theme` și, imediat după el, un buton `Display Language`, ambele după butonul [`Explorer`](./explorer.md). [Căutarea rapidă](./quick-search.md) listează comenzile `Theme` și `Display Language` în fiecare filă.  
Aplicația web, Google Drive, VS Code, IDE-urile JetBrains și Obsidian le oferă pe amândouă și rețin alegerile făcute (consultați [În fiecare aplicație gazdă](#in-each-host)). Ambele funcționează și într-un editor doar în citire.

## Limbă de afișare {#display-language}

Limba se aplică textului propriu al editorului: sfaturile ecran din bara de instrumente, meniurile contextuale, căutarea rapidă, panourile și casetele de dialog, fila Setări, [ecranul de bun venit](./editing-start.md#welcome-screen), notificările și mesajele, precum și textul substituent afișat pe pânză și într-o imagine exportată când lipsește un nume, un tip de date, o valoare implicită sau un comentariu.  
Lasă așa cum sunt scrise, în orice limbă, următoarele: numele tabelelor și coloanelor, comentariile și notele dumneavoastră; sistemele de baze de date, limbajele generatorului de cod și formatele de fișiere; tipurile de date, cuvintele cheie SQL și acțiunile `ON DELETE` și `ON UPDATE`; opțiunile filei Schemă SQL `Create`, `If not exists`, `Drop & re-create`, `USE` și `CREATE + USE`; marcajele `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` și `AK1.1`; literele de stare `A`, `M`, `D`, `R` și `~` ale [vizualizatorului de diferențe](./table-related-functions.md#diff-viewer); variantele stilului de denumire și ale opțiunii `Bracket`, în afară de `None`; numele tastelor; numele culorilor din configuratorul de teme; SQL-ul și codul generate; și numele fișierelor exportate.

Limbile, în ordinea în care le listează selectorul:

| În selector | Limbă | Cod |
| --- | --- | --- |
| Bahasa Indonesia | Indoneziană | `id-ID` |
| Deutsch | Germană | `de-DE` |
| English | Engleză | `en` |
| Español | Spaniolă | `es-ES` |
| Euskara | Bască | `eu-ES` |
| Français | Franceză | `fr-FR` |
| Italiano | Italiană | `it-IT` |
| Nederlands | Neerlandeză | `nl-NL` |
| Polski | Poloneză | `pl-PL` |
| Português | Portugheză | `pt-PT` |
| Português Brasileiro | Portugheză braziliană | `pt-BR` |
| Română | Română | `ro-RO` |
| Slovenčina | Slovacă | `sk-SK` |
| Slovenščina | Slovenă | `sl-SI` |
| Svenska | Suedeză | `sv-SE` |
| Türkçe | Turcă | `tr-TR` |
| Русский | Rusă | `ru-RU` |
| Українська | Ucraineană | `uk-UA` |
| עברית | Ebraică | `he-IL` |
| العربية | Arabă | `ar-SA` |
| فارسی | Persană | `fa-IR` |
| 日本語 | Japoneză | `ja-JP` |
| 简体中文 | Chineză simplificată | `zh-CN` |
| 繁體中文 | Chineză tradițională | `zh-TW` |
| 한국어 | Coreeană | `ko-KR` |

Comanda `Language` pe care o oferă căutarea rapidă în fila Generator de cod și rândul `Language` din lista [Blocare](./settings.md#lock) din fila Setări reprezintă [limbajul țintă al generatorului de cod](./code-generator.md#language), nu limba de afișare.

### Alegerea unei limbi {#picking-a-language}

Butonul `Display Language` (o pictogramă de limbi) deschide selectorul `Display Language`, un panou cu titlul `Display Language` sub bara de instrumente, peste fila deschisă, oricare ar fi aceasta.  
Opțiunea `System` apare prima, având alături limba pe care o reprezintă în acest moment, și rămâne vizibilă cât timp lista se derulează. Urmează cele 25 de limbi, fiecare cu numele în propria limbă, iar o bifă marchează opțiunea aplicată.

![Schimbarea limbii de afișare din bara de instrumente în 한국어, apoi în العربية, care afișează în oglindă bara de instrumente, dar nu și diagrama, și revenirea la System](/img/demo-display-language.webp)

Panoul se deschide cu focusul tastaturii pe rândul bifat:

- `↑` și `↓` parcurg rândurile și reiau de la capăt, iar `Home` și `End` sar la primul și la ultimul.
- `Enter` sau `Space` alege rândul activ, la fel ca un clic.

O alegere se aplică imediat, închide panoul și redă editorului focusul tastaturii.

Închideți-l fără a alege: cu `Escape`, cu butonul `x` de lângă titlu, al cărui sfat ecran afișează `Close (ESC)`, cu o apăsare oriunde în editor în afara panoului, cu excepția barei de instrumente, sau din nou cu butonul `Display Language`.  
Deschiderea lui închide configuratorul de teme și panoul Proprietăți tabel. Un [explorator](./explorer.md#dialogs-beside-it) deschis rămâne deschis, iar într-o limbă scrisă de la stânga la dreapta selectorul se așază imediat alături de el, nu peste el.  
Deschiderea căutării rapide sau a configuratorului de teme îl închide, la fel ca `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac). Această combinație de taste deschide [exploratorul](./explorer.md#opening-and-closing) la căutarea sa sau, dacă exploratorul este deja deschis, îl lasă deschis și mută focusul tastaturii în câmpul Găsire al acestuia. Butonul `Explorer` din bara de instrumente lasă selectorul deschis.

Cât timp panoul are focusul tastaturii, câteva comenzi rapide ale editorului funcționează în continuare: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` și `Zoom Reset` (consultați [Comenzi rapide](./settings.md#shortcuts)). Toate celelalte comenzi rapide ale editorului, tastele săgeți și tasta `Tab` nu ajung mai departe de panou, așa că editorul nu reacționează la ele. Tastele neasociate de editor, de exemplu salvarea proprie a aplicației gazdă, ajung la aplicația gazdă ca de obicei.

În [căutarea rapidă](./quick-search.md), comanda `Display Language` listează `System` și cele 25 de limbi, cu o bifă pe opțiunea aplicată. Acolo, o limbă se găsește și după numele său în engleză sau după cod, așa că `german` sau `de-DE` găsește `Deutsch`.

### Ce urmează opțiunea System {#what-system-follows}

În aplicația web, în Google Drive, în VS Code, în IDE-urile JetBrains și în Obsidian, limba pornește de la opțiunea `System`. Aceasta urmează limba aplicației gazdă:

- În aplicația web, în Google Drive și în propria pagină: limbile preferate ale browserului. O modificare a acestora este preluată imediat.
- În VS Code: limba de afișare din VS Code.
- Într-un IDE JetBrains: limba în care IDE-ul își afișează propria interfață.
- În Obsidian: limba din Obsidian.

Opțiunea `System` alege prima dintre aceste limbi pe care editorul o oferă, iar engleza când nu oferă niciuna dintre ele.  
O variantă regională este tratată ca limba sa, așa că `de-AT` duce la Deutsch, iar `fr-CA` la Français. Pentru chineză contează scrierea: o scriere tradițională duce la 繁體中文, iar orice altă scriere la 简体中文. Fără o scriere specificată, regiunea Taiwan, Hong Kong sau Macao duce la 繁體中文, iar orice altă variantă de chineză la 简体中文. Portugheza duce la Português Brasileiro, cu excepția cazului în care este specificată o altă regiune decât Brazilia, așa că `pt-PT` duce la Português; portugheza din Obsidian duce, de asemenea, la Português.

### Limbi scrise de la dreapta la stânga {#right-to-left-languages}

עברית (ebraică), العربية (arabă) și فارسی (persană) aranjează editorul de la dreapta la stânga: bara de instrumente, meniurile, panourile și casetele de dialog, căutarea rapidă și fila Setări sunt afișate în oglindă. Submeniurile unui meniu contextual se deschid spre stânga, iar pictogramele de anulare și refacere din bara de instrumente își schimbă locul, astfel încât pictograma de anulare să indice înapoi pentru cine citește de la dreapta la stânga.

Diagrama însăși nu este niciodată afișată în oglindă. Pânza, cu tabelele, coloanele, relațiile și notele sale, rămâne de la stânga la dreapta, la fel ca miniharta, barele de derulare, [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar), fila [Vizualizare](./visualization.md) și bara ei de instrumente, celulele tipurilor de date, codul din filele Schemă SQL și Generator de cod, selectorul de culori, cele două părți ale vizualizatorului de diferențe, călătoria în timp și previzualizarea aranjării automate.  
[Exploratorul](./explorer.md#beside-the-canvas) rămâne în stânga pânzei, iar arborele modificărilor din vizualizatorul de diferențe în stânga vizualizatorului, fiecare cu marginea de glisare în dreapta. În interior, ambele se citesc de la dreapta la stânga: câmpurile și rândurile lor sunt afișate în oglindă, rândurile se indentează din dreapta, iar în oricare dintre arbori `←` extinde un rând sau trece la primul său nod copil, în timp ce `→` îl restrânge sau iese la nodul său părinte (consultați [Taste în explorator](./explorer.md#keys-in-the-explorer)).  
Numele, comentariile și alte texte pe care le-ați tastat își păstrează propria direcție, așa că un nume în ebraică, arabă sau persană se citește de la dreapta la stânga și pe pânză.

## Temă {#theme}

Butonul `Theme` (o pictogramă de contrast) deschide configuratorul de teme, un panou cu titlul `Theme` sub bara de instrumente, peste fila deschisă, oricare ar fi aceasta. Acesta are trei părți:

- `Accent color`: 26 de mostre de culoare. Sfatul ecran al fiecăreia îi indică numele, de exemplu `indigo`.
- `Gray color`: 6 mostre de culoare, `gray`, `mauve`, `slate`, `sage`, `olive` și `sand`.
- `Appearance`: `System`, `Light` și `Dark`.

![Deschiderea configuratorului de teme din bara de instrumente, alegerea unei culori de accent și a unui ton de gri și trecerea aspectului la Light, apoi la System](/img/demo-theme-builder.webp)

Opțiunea aplicată din fiecare parte este marcată, iar o alegere se aplică imediat, în timp ce configuratorul rămâne deschis.  
Alegerea unei culori lasă aspectul neschimbat, așa că o culoare aleasă cu aspectul `System` păstrează `System`.

Opțiunea `System` afișează aspectul luminos sau întunecat la fel ca aplicația gazdă și se schimbă odată cu aceasta:

- În aplicația web, în Google Drive și în propria pagină: modul luminos sau întunecat raportat de browser, care urmează sistemul de operare.
- În VS Code: luminos cu o temă de culori luminoasă și întunecat cu o temă întunecată sau cu oricare dintre cele două teme cu contrast ridicat.
- Într-un IDE JetBrains: tema luminoasă sau întunecată a IDE-ului.
- În Obsidian: tema luminoasă sau întunecată din Obsidian.

Închideți configuratorul cu `Escape`, cu butonul `x` de lângă titlu, al cărui sfat ecran afișează `Close (ESC)`, cu o apăsare oriunde în editor în afara panoului, cu excepția barei de instrumente, sau din nou cu butonul `Theme`.  
Deschiderea lui închide panoul Proprietăți tabel și selectorul `Display Language`. Un [explorator](./explorer.md#dialogs-beside-it) deschis rămâne deschis, iar într-o limbă scrisă de la stânga la dreapta configuratorul se așază imediat alături de el, nu peste el.  
Deschiderea căutării rapide sau a selectorului `Display Language` îl închide, la fel ca `Ctrl + F` (Windows/Linux) sau `⌘ + F` (Mac). Această combinație de taste deschide [exploratorul](./explorer.md#opening-and-closing) la căutarea sa sau, dacă exploratorul este deja deschis, îl lasă deschis și mută focusul tastaturii în câmpul Găsire al acestuia. Butonul `Explorer` din bara de instrumente lasă configuratorul deschis.  
Configuratorul nu reține nicio tastă, așa că comenzile rapide ale editorului funcționează cât timp este deschis.

În [căutarea rapidă](./quick-search.md), comanda `Theme` listează `System`, `Light` și `Dark`, cu o bifă pe aspectul aplicat. Alegerea unuia schimbă doar aspectul și lasă neschimbate tonul de gri și culoarea de accent.

## În fiecare aplicație gazdă {#in-each-host}

Alegerile făcute în editor, din bara de instrumente sau din căutarea rapidă, se salvează acolo unde le păstrează aplicația gazdă, iar fiecare diagramă deschisă preia imediat o modificare a lor, oriunde ar fi făcută.  
În VS Code, într-un IDE JetBrains și în Obsidian, opțiunea `Auto` a aplicației gazdă (valoarea `auto` în VS Code) corespunde opțiunii `System` a editorului. Alegerea opțiunii `System` stochează `Auto`, iar alegerea opțiunii `Light` sau `Dark` stochează acel aspect, chiar dacă `Auto` îl afișa deja.  
Setările și notificările proprii ale extensiei și ale pluginurilor sunt în engleză, indiferent de limba de afișare.

### Aplicația web și Google Drive {#web-app-and-google-drive}

Pe erd-editor.io, inclusiv în sesiunile sale colaborative, și în Google Drive, o singură limbă și o singură temă sunt folosite pentru aplicație și pentru fiecare diagramă din ea.  
Ambele se păstrează în acest browser, nu în schemă sau în fișierul din Drive, iar toate filele cu erd-editor.io le au în comun: o alegere într-o filă le schimbă imediat pe celelalte.

Limba rămâne la opțiunea `System`, care urmează limbile preferate ale browserului, până când alegeți una.  
Textul propriu al aplicației, de exemplu bara laterală, coșul de gunoi, colaborarea și ecranele pentru Google Drive, urmează aceeași limbă, iar în ebraică, arabă și persană întreaga aplicație este aranjată de la dreapta la stânga. Politica de confidențialitate, Condițiile de utilizare și paginile de asistență rămân în engleză.  
Pe lângă panoul editorului și căutarea rapidă, rândul de jos al barei laterale are un buton de limbă, al cărui sfat ecran afișează `Display Language`, lângă linkurile `Privacy` și `Terms`. Meniul său listează `System`, cu limba pe care o reprezintă, și apoi cele 25 de limbi.

Tema pornește de la aspectul `System`, cu tonul de gri `olive` și culoarea de accent `jade`.  
Pe lângă configuratorul de teme și căutarea rapidă, partea de jos a barei laterale are trei butoane cu pictograme, `System`, `Light` și `Dark`: lângă `Trash` pe erd-editor.io și lângă `Sign out` în Google Drive. Ele setează același aspect ca și configuratorul.

### VS Code {#vs-code}

Setările extensiei se află la ERD Editor, în Settings din VS Code:

| Setare | Valori | Valoare implicită |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` sau un cod din [tabelul limbilor](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | cele șase tonuri de gri | `slate` |
| `dineug.erd-editor.theme.accentColor` | cele 26 de culori de accent | `indigo` |

Editorul Settings afișează pentru setarea de limbă opțiunea `Auto` și apoi fiecare limbă cu numele în propria limbă. O valoare din `settings.json` care nu denumește nicio limbă este interpretată ca `auto`.  
O alegere de temă în editor scrie toate cele trei setări ale temei. O alegere se scrie acolo unde setarea sa este deja definită: în folderul spațiului de lucru, altfel în spațiul de lucru, altfel în setările utilizatorului.

### IDE-uri JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor conține setările `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` și `Display language:` (`Auto`, apoi fiecare limbă cu numele în propria limbă), păstrate pentru întregul IDE.  
Valorile lor inițiale sunt `Auto`, `Slate`, `Indigo` și `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor conține setările `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` și `Display language` (`Auto`, apoi fiecare limbă cu numele în propria limbă), păstrate pentru fiecare seif.  
Valorile lor inițiale sunt `Auto`, `Slate`, `Indigo` și `Auto`.  
O modificare se aplică fiecărei file ERD din seif, inclusiv celor din ferestrele detașate.

### Pagina proprie {#your-own-page}

Un element `<erd-editor>` din propria pagină nu afișează nici butonul `Theme`, nici butonul `Display Language`, iar căutarea rapidă nu le listează, până când pagina le activează cu [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) și [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Până când pagina setează o limbă sau cititorul alege una, editorul afișează engleza ori urmează opțiunea `System` cât timp atributul `enableLocalePicker` este activat.  
Tema pornește de la aspectul `Dark`, cu tonul de gri `slate` și culoarea de accent `indigo`, cu excepția cazului în care pagina setează alta sau activează atributul [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
Alegerea cititorului se aplică imediat, dar elementul nu salvează niciuna dintre cele două alegeri: pagina setează valorile inițiale și salvează ea însăși alegerile cititorului (consultați [Temă](../../api/erd-editor-element.md#theme) și [Limbă de afișare](../../api/erd-editor-element.md#display-language) din API).
