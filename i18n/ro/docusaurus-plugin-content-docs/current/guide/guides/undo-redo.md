---
sidebar_position: 13
description: Anularea și refacerea editărilor, ce înregistrează istoricul și parcurgerea lui cu călătoria în timp.
---

# Anulare, refacere

Puteți reveni la o stare anterioară de editare sau avansa la una ulterioară.  
Istoricul păstrează până la `2048` de modificări.

- Anulare: `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac)
- Refacere: `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Shift + Z` (Mac)

Bara de instrumente oferă aceleași două comenzi sub forma butoanelor `Undo` și `Redo`, lângă butonul `Time Travel`.  
Ele devin active doar când există ceva de anulat sau de refăcut. Un editor cu atributul `readonly` le ascunde pe toate trei, iar comenzile rapide nu au niciun efect.

Anularea și refacerea funcționează doar în fila ERD. Nu sunt disponibile în filele Vizualizare, Schemă SQL, Generator de cod și Setări. În câmpurile `Before tables` și `After tables` ale filei Schemă SQL, aceleași taste anulează și refac în schimb ce ați tastat în câmp.  
Comenzile rapide sunt inactive și cât timp este deschisă căutarea rapidă, panoul `Table Properties`, vizualizatorul `Diff Viewer`, previzualizarea `Auto Layout`, caseta de dialog [`Export image`](./file-import-export.md#image), caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) sau călătoria în timp.  
Ele funcționează în continuare cât timp focusul tastaturii este oriunde în [explorator](./explorer.md#keys-in-the-explorer), inclusiv în arborele său, precum și cât timp este deschis [selectorul de culori](./table-related-functions.md#table-and-memo-color-specification). Chiar și cu cursorul de text într-unul dintre câmpurile acestora, de exemplu Găsire, Înlocuire sau `Hex`, ele anulează și refac modificările diagramei, nu pe cele ale textului din câmp.

Istoricul se păstrează în memorie pentru sesiunea curentă. Nu se salvează în document, așa că o diagramă redeschisă pornește cu un istoric gol.

![Mutarea unui tabel și eliminarea unei coloane cu ⌥ + Backspace, apoi anularea ambelor operații cu ⌘ + Z și refacerea lor cu ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Ce înregistrează istoricul {#what-the-history-records}

Se înregistrează:

- Tabele și note: adăugarea, eliminarea, mutarea, culoarea, numele și comentariul, textul și dimensiunea notelor.
- Grupuri de tabele: adăugarea, eliminarea, mutarea, redimensionarea, numele, culoarea și grupul în care se află fiecare tabel (consultați [Grupuri de tabele](./table-groups.md)).
- Coloane: adăugarea, eliminarea, reordonarea și fiecare opțiune de coloană.
- Relații: adăugarea, eliminarea, schimbarea tipului, coloanele setate în caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) și fiecare alegere din elementele `On Delete` sau `On Update` (consultați [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update)). Anularea unei eliminări readuce relația împreună cu acțiunile sale ON DELETE și ON UPDATE.
- Indexuri și coloanele acestora.
- Poziția vizualizării, nivelul de zoom și comutatoarele din `View Option`.
- Scripturile `Before tables` și `After tables` din fila Schemă SQL, câte un pas pentru fiecare editare pe care o aplicați părăsind câmpul (consultați [Scripturi înainte și după tabele](./schema-sql.md#before-and-after-scripts)).
- Importarea unui fișier și adăugarea unuia cu elementul [`Import and Add`](./file-import-export.md#import-and-add).

Nu se înregistrează:

- Sistemul de baze de date și numele bazei de date.
- Limbajul generatorului de cod și setările `Table Name Case` și `Column Name Case`.
- Tipul de delimitator, fie că este setat în fila Schemă SQL, fie în fila Generator de cod.
- Opțiunile `Statements`, `Header` și `Tables` din fila Schemă SQL, care aparțin ferestrei editorului (consultați [Panoul de opțiuni](./schema-sql.md#options-panel)).
- Tot ce se află în fila Setări, inclusiv rândurile [`Lock`](./settings.md#lock).
- Tema și limba de afișare (consultați [Limbă și temă](./language-and-theme.md)).
- Ce tabel, notă sau grup este desenat în fața celorlalte.
- [Exploratorul](./explorer.md): deschiderea, închiderea sau redimensionarea lui, restrângerea arborelui său, precum și textul căutat și opțiunile de căutare. Ce modifică comenzile `Replace` și `Replace All` se înregistrează totuși, la fel ca derularea pe care o face un salt (consultați [Un gest, un pas](#one-gesture-one-step)).
- Zoomul și deplasarea în fila Vizualizare, în oricare dintre moduri, mutarea nodurilor grafului sau a cardurilor din Flux, `Tidy Up`, afișarea rândurilor și focalizarea pe tabele (consultați [Modul Flux nu modifică niciodată documentul](./visualization.md#flow-never-edits-the-document)).

Modificarea oricăruia dintre acestea nu poate fi anulată.

Nici modificările care sosesc de la un alt editor nu se înregistrează, așa că anularea le inversează doar pe ale dumneavoastră. Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), fiecare editor își anulează propriile modificări, iar un agent de programare care editează prin [serverul MCP](../../mcp/live-and-headless.md#undo) le anulează pe ale sale cu instrumentul `erd_undo`.

Anularea unui import prin elementul `Import`, care înlocuiește întreaga diagramă, readuce diagrama anterioară așa cum o avea editorul în momentul importului, cu fiecare [blocare](./settings.md#lock) activată sau dezactivată și cu fiecare valoare blocată așa cum erau atunci.  
Dacă în acea diagramă setarea `Viewport` era blocată, vizualizarea și zoomul revin la vizualizarea blocată, cea în care se deschide diagrama, nu acolo unde erați. Dacă setarea `Viewport` a acesteia era deblocată, ele revin acolo unde erați în momentul importului. Celelalte setări blocate, de exemplu fila în care vă aflați sau limbajul generatorului de cod, rămân așa cum sunt pe ecranul dumneavoastră.  
O diagramă nouă pornește cu toate blocările activate. Deblocați setarea `Viewport` înainte de import pentru a vă păstra vizualizarea la o astfel de anulare. Deblocarea ei ulterioară sau importarea unui fișier JSON a cărui blocare `Viewport` proprie este dezactivată nu schimbă locul în care vă duce anularea.

## Un gest, un pas {#one-gesture-one-step}

Toate acțiunile trimise de un singur gest devin o singură intrare în istoric.  
Lipirea mai multor tabele și note deodată sau duplicarea lor cu `Alt + drag` se anulează într-un singur pas.

O apăsare pe `Delete` sau `Backspace` ori elementul `Delete selected` sau `Delete columns` dintr-un meniu contextual reprezintă un singur pas, oricâte tabele, note, grupuri de tabele sau coloane ar elimina.  
Activarea sau dezactivarea cheii primare pe mai multe coloane selectate reprezintă un singur pas, fie cu `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac), fie cu elementul `Primary Key on selected columns` din meniul contextual al unui tabel.  
Setarea culorii selecției sau eliminarea ei cu opțiunea `No color` ori cu elementul `Remove color` reprezintă un singur pas, oricâte tabele, note și grupuri ar fi selectate. Alegerea unei culori pe care o au deja toate elementele selectate nu înregistrează niciun pas, iar opțiunea `No color` nu înregistrează niciunul când niciun element selectat nu are culoare.  
Butonul `Map` sau `Save` din caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) reprezintă un singur pas, împreună cu coloanele cheie străină pe care le adaugă și tipurile de date pe care le modifică.  
Elementul `Import and Add` reprezintă un singur pas, împreună cu derularea care aduce blocul adăugat în vizualizare, atunci când aceasta este necesară.

Crearea unui [grup de tabele](./table-groups.md), prin trasarea lui sau prin gruparea tabelelor selectate cu elementul `Group selected tables` ori cu `T` apoi `G`, reprezintă un singur pas, împreună cu fiecare tabel pe care îl cuprinde. Eliminarea unui grup reprezintă un singur pas, iar anularea ei readuce grupul cu tabelele sale înăuntru.  
Glisarea unui grup de bara sa de titlu mută grupul și toate tabelele sale într-un singur pas. Tabelele lăsate într-un grup sau scoase dintr-un grup își schimbă grupul în același pas cu glisarea lor când eliberați butonul în aproximativ `200ms` de la ultima mișcare, așa că o singură anulare le readuce unde erau și în grupurile din care făceau parte. După o pauză mai lungă înainte de eliberarea butonului, schimbarea grupului este un pas separat, iar prima anulare inversează doar această schimbare.  
Redimensionarea unui grup de o margine sau de un colț se înregistrează o singură dată, la eliberarea butonului.  
Aplicarea [aranjării automate](./table-related-functions.md#auto-layout) reprezintă un singur pas, inclusiv grupurile pe care le ajustează în jurul tabelelor lor.

Comanda `Replace All` din [Găsire și înlocuire](./find-and-replace.md#replacing) reprezintă și ea un singur pas, oricâte nume de tabele, nume de coloane, nume de indexuri, nume de grupuri de tabele, comentarii și note ar modifica. Când nu modifică nimic, ca atunci când opțiunea `Preserve Case` rescrie fiecare potrivire așa cum era, nu înregistrează niciun pas.  
O comandă `Replace` individuală reprezintă un singur pas, inclusiv derularea la potrivirea următoare, când acea potrivire o necesită. Când își rescrie potrivirea așa cum era, înregistrează doar acea derulare sau nimic, dacă nu există una.  
Saltul la o potrivire derulează pânza doar când potrivirea nu este deja bine vizibilă (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)). Această derulare se înregistrează ca orice altă schimbare a poziției vizualizării, așa că, după parcurgerea potrivirilor, anularea inversează mai întâi acele derulări, câte una pe pas.  
Celelalte salturi care ajung pe pânză își înregistrează derulările la fel: alegerea unui rând în explorator, a unui rezultat al căutării rapide sau a [butonului cardului](./visualization.md#card-buttons) cu link extern din Flux. Un salt care lasă vizualizarea pe loc nu înregistrează nimic. Nici alegerea unui rând din lista vizualizatorului `Diff Viewer` nu înregistrează nimic, deoarece mută numai propriile părți doar în citire ale vizualizatorului de diferențe.

O glisare continuă, o deplasare a pânzei, un zoom, o ciupire sau o schimbare de culoare este reținută în buffer timp de aproximativ `200ms` și ajunge tot ca o singură intrare.  
O glisare care se deplasează în total mai puțin de `20px` nu înregistrează nicio mutare. Se înregistrează doar schimbarea de grup pe care o produce, dacă există.

Tastarea într-o celulă sau într-o notă se înregistrează pentru fiecare introducere, nu pentru fiecare gest: fiecare caracter tastat, fiecare lipire și fiecare pas al unei compuneri cu metoda de introducere (IME) este un pas separat.  
Numele unui grup de tabele se înregistrează o singură dată, când este salvat cu `Enter` sau prin părăsirea câmpului, așa că numele pe care îl tastați pentru un grup abia creat este un pas separat de crearea lui. Tasta `Esc` sau un nume lăsat neschimbat nu înregistrează nimic.

## Călătorie în timp {#time-travel}

Se deschide cu butonul `Time Travel` din bara de instrumente, aflat lângă butoanele de anulare și refacere.  
Butonul nu are niciun efect cât timp sesiunea nu are încă nicio modificare înregistrată.

Călătoria în timp deschide o copie separată a diagramei, doar în citire, la poziția de derulare și nivelul de zoom pe care le afișează pânza, indiferent dacă blocarea `Viewport` este activată sau nu.  
Glisați glisorul sau faceți clic oriunde pe pista lui pentru a parcurge întregul istoric al editărilor și a previzualiza fiecare punct. Poziția cea mai din stânga a glisorului este starea aflată cu un pas înaintea primei modificări înregistrate, iar la deschidere cursorul glisorului se află pe starea curentă.  
Previzualizarea este inertă: desenează o minihartă, dar nu o puteți deplasa, derula sau edita, iar documentul real rămâne neatins până la aplicare.

Apăsați `Apply` pentru a restaura punctul selectat sau `Cancel` ori `Esc` pentru a lăsa documentul neschimbat.

![Deschiderea călătoriei în timp, glisarea glisorului înapoi prin sesiune și aplicarea unui punct anterior](/img/demo-time-travel.webp)
