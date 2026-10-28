---
sidebar_position: 15
description: Anularea și refacerea editărilor, ce înregistrează istoricul, istoricele proprii ale foilor din fila Dicționar și parcurgerea istoricului diagramei cu călătoria în timp.
---

# Anulare, refacere

Puteți reveni la o stare anterioară de editare sau avansa la una ulterioară.  
Istoricul păstrează până la `2048` de modificări.

- Anulare: `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac)
- Refacere: `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Shift + Z` (Mac)

În fila ERD, bara de instrumente oferă aceleași două comenzi sub forma butoanelor `Undo` și `Redo`, lângă butonul `Time Travel`. În fila Dicționar, afișează butoanele `Undo` și `Redo` fără butonul `Time Travel`, iar nicio altă filă nu le afișează.  
Ele devin active doar când există ceva de anulat sau de refăcut. Un editor cu atributul `readonly` le ascunde, împreună cu `Time Travel`, iar comenzile rapide nu anulează și nu refac nimic.

Anularea și refacerea acționează asupra istoricului diagramei doar în fila ERD.  
Comenzile rapide sunt inactive acolo cât timp este deschisă căutarea rapidă, panoul `Table Properties`, vizualizatorul `Diff Viewer`, previzualizarea `Auto Layout`, caseta de dialog [`Export image`](./file-import-export.md#image), caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) sau călătoria în timp.  
Ele funcționează în continuare cât timp focusul tastaturii este oriunde în [explorator](./explorer.md#keys-in-the-explorer), inclusiv în arborele său, precum și cât timp este deschis [selectorul de culori](./table-related-functions.md#table-and-memo-color-specification). Chiar și cu cursorul de text într-unul dintre câmpurile acestora, de exemplu Găsire, Înlocuire sau `Hex`, ele anulează și refac modificările diagramei, nu pe cele ale textului din câmp.

În celelalte file:

- Dicționar: anulează și refac editările foii afișate, `Domains`, `Words` sau `Terms`, din istoricul propriu al acelei foi, niciodată din cel al diagramei. În foaia `Checks` nu au niciun efect (consultați [Foile din fila Dicționar](#dictionary-sheets)).
- Vizualizare: în modul `Flow`, aceleași taste fac un pas înapoi și un pas înainte prin ce a afișat modul Flux, la fel ca butoanele `Previous table` și `Next table`, inclusiv într-un editor cu atributul `readonly`. Acolo nu anulează și nu refac niciodată modificări ale diagramei (consultați [Tabelul anterior și tabelul următor](./visualization.md#previous-table-and-next-table)). În modul `Graph` nu au niciun efect.
- Schemă SQL, Generator de cod și Setări: nu sunt disponibile. În câmpurile `Before tables` și `After tables` ale filei Schemă SQL, aceleași taste anulează și refac în schimb ce ați tastat în câmp.

Istoricul se păstrează în memorie pentru sesiunea curentă. Nu se salvează în document, așa că o diagramă redeschisă pornește cu un istoric gol.

![Mutarea unui tabel și eliminarea unei coloane cu ⌥ + Backspace, apoi anularea ambelor operații cu ⌘ + Z și refacerea lor cu ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Ce înregistrează istoricul {#what-the-history-records}

Se înregistrează:

- Tabele și note: adăugarea, eliminarea, mutarea și culoarea; numele, numele logic și comentariul unui tabel; textul și dimensiunea unei note.
- Grupuri de tabele: adăugarea, eliminarea, mutarea, redimensionarea, numele, culoarea și grupul în care se află fiecare tabel (consultați [Grupuri de tabele](./table-groups.md)).
- Coloane: adăugarea, eliminarea, reordonarea, numele logic, domeniul de care este legată fiecare și fiecare opțiune de coloană.
- Numele fizice pe care le derivă dicționarele și starea fiecărui nume, personalizat sau gestionat de dicționare: o singură anulare readuce împreună un nume și această stare (consultați [Nume personalizate](./dictionary.md#names-of-your-own)).
- Comenzile `Derive Physical Name Again` și `Derive Physical Names Again` (consultați [Derivare din nou a numelor fizice](./dictionary.md#derive-physical-names-again)).
- Relații: adăugarea, eliminarea, schimbarea tipului, coloanele setate în caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) și fiecare alegere din elementele `On Delete` sau `On Update` (consultați [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update)). Anularea unei eliminări readuce relația împreună cu acțiunile sale ON DELETE și ON UPDATE.
- Indexuri și coloanele acestora.
- Poziția vizualizării, nivelul de zoom și comutatoarele din `View Option`.
- Scripturile `Before tables` și `After tables` din fila Schemă SQL, câte un pas pentru fiecare editare pe care o aplicați părăsind câmpul (consultați [Scripturi înainte și după tabele](./schema-sql.md#before-and-after-scripts)).
- Importarea unui fișier și adăugarea unuia cu elementul [`Import and Add`](./file-import-export.md#import-and-add).

Nu se înregistrează:

- Sistemul de baze de date și numele bazei de date.
- Limbajul generatorului de cod și setările `Table Name Case` și `Column Name Case`.
- Tipul de delimitator, fie că este setat în fila Schemă SQL, fie în fila Generator de cod.
- Opțiunile `Statements`, `Header`, `Write logical names into empty comments` și `Tables` din fila Schemă SQL, care aparțin ferestrei editorului (consultați [Panoul de opțiuni](./schema-sql.md#options-panel)).
- Tot ce se află în fila Setări, inclusiv rândurile [`Lock`](./settings.md#lock).
- Schimbarea modului de afișare a numelor, din oricare dintre locurile sale, indiferent dacă blocarea sa este activată sau dezactivată (consultați [Schimbarea modului de afișare](./logical-names.md#switching-the-view)).
- Tema și limba de afișare (consultați [Limbă și temă](./language-and-theme.md)).
- Ce tabel, notă sau grup este desenat în fața celorlalte.
- [Exploratorul](./explorer.md): deschiderea, închiderea sau redimensionarea lui, restrângerea arborelui său, precum și textul căutat și opțiunile de căutare. Ce modifică comenzile `Replace` și `Replace All` se înregistrează totuși, la fel ca derularea pe care o face un salt (consultați [Un gest, un pas](#one-gesture-one-step)).
- Zoomul și deplasarea în fila Vizualizare, în oricare dintre moduri, mutarea nodurilor grafului sau a cardurilor din Flux, `Tidy Up`, afișarea rândurilor, focalizarea pe tabele și pașii făcuți cu `Previous table` și `Next table` (consultați [Modul Flux nu modifică niciodată documentul](./visualization.md#flow-never-edits-the-document)).
- Foaia afișată în fila Dicționar, precum și căutarea, selecția, derularea și lățimile coloanelor fiecărei foi (consultați [Deschiderea filei](./dictionary.md#opening-the-tab)).

Modificarea oricăruia dintre acestea nu poate fi anulată.

Un editor doar în citire nu înregistrează nimic. Poziția vizualizării, zoomul și comutatoarele `View Option` se schimbă totuși acolo, împreună cu fila, modul de afișare a numelor, baza de date și setările de cod, dar doar pe acel ecran, așa că nu există nimic de anulat (consultați [Editoare doar în citire](./settings.md#read-only-editors) din Setări).

Editările făcute în fila Dicționar pot fi anulate, dar ajung în istoricul propriei foi, nu în cel al diagramei, așa că anularea din fila ERD nu inversează niciodată vreuna dintre ele, nici măcar noua valoare `Data Type` a unui domeniu și tipurile de coloane pe care le modifică (consultați [Foile din fila Dicționar](#dictionary-sheets)).

Nici modificările care sosesc de la un alt editor nu se înregistrează, așa că anularea le inversează doar pe ale dumneavoastră. Într-o [sesiune colaborativă](../../api/advanced/collaborative-editing.md), fiecare editor își anulează propriile modificări, iar un agent de programare care editează prin [serverul MCP](../../mcp/live-and-headless.md#undo) le anulează pe ale sale cu instrumentul `erd_undo`.

Anularea unui import prin elementul `Import`, care înlocuiește întreaga diagramă, readuce diagrama anterioară așa cum o avea editorul în momentul importului, cu fiecare [blocare](./settings.md#lock) activată sau dezactivată și cu fiecare valoare blocată așa cum erau atunci.  
Dacă în acea diagramă setarea `Viewport` era blocată, vizualizarea și zoomul revin la vizualizarea blocată, cea în care se deschide diagrama, nu acolo unde erați. Dacă setarea `Viewport` a acesteia era deblocată, ele revin acolo unde erați în momentul importului. Celelalte setări blocate, de exemplu fila în care vă aflați, limbajul generatorului de cod sau modul de afișare a numelor, rămân așa cum sunt pe ecranul dumneavoastră.  
O diagramă nouă pornește cu toate blocările activate. Deblocați setarea `Viewport` înainte de import pentru a vă păstra vizualizarea la o astfel de anulare. Deblocarea ei ulterioară sau importarea unui fișier JSON a cărui blocare `Viewport` proprie este dezactivată nu schimbă locul în care vă duce anularea.

Anularea importului unui fișier JSON readuce și cuvintele, termenii și domeniile pe care le avea diagrama anterioară. Importul unui fișier Schemă SQL, GraphQL, DBML sau AML păstrează dicționarele, așa că anularea și refacerea lui le lasă așa cum sunt, inclusiv editările făcute între timp în fila Dicționar.

O anulare sau o refacere în fila ERD care leagă din nou o coloană de un domeniu sau readuce o coloană legată de unul îi dă coloanei tipul de date al domeniului așa cum este acum. Una care readuce alt tip pe o coloană legată elimină legătura coloanei cu domeniul (consultați [Domenii și tipuri de date](./dictionary.md#domains-and-data-types)).

## Un gest, un pas {#one-gesture-one-step}

Toate acțiunile trimise de un singur gest devin o singură intrare în istoric.  
Lipirea mai multor tabele și note deodată sau duplicarea lor cu `Alt + drag` se anulează într-un singur pas.

O apăsare pe `Delete` sau `Backspace` ori elementul `Delete selected` sau `Delete columns` dintr-un meniu contextual reprezintă un singur pas, oricâte tabele, note, grupuri de tabele sau coloane ar elimina.  
Activarea sau dezactivarea cheii primare pe mai multe coloane selectate reprezintă un singur pas, fie cu `Alt + K` (Windows/Linux) sau `⌥ + K` (Mac), fie cu elementul `Primary Key on selected columns` din meniul contextual al unui tabel.  
Setarea culorii selecției sau eliminarea ei cu opțiunea `No color` ori cu elementul `Remove color` reprezintă un singur pas, oricâte tabele, note și grupuri ar fi selectate. Alegerea unei culori pe care o au deja toate elementele selectate nu înregistrează niciun pas, iar opțiunea `No color` nu înregistrează niciunul când niciun element selectat nu are culoare.  
Butonul `Map` sau `Save` din caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) reprezintă un singur pas, împreună cu coloanele cheie străină pe care le adaugă și tipurile de date pe care le modifică.  
Elementul `Import and Add` reprezintă un singur pas, împreună cu derularea care aduce blocul adăugat în vizualizare, atunci când aceasta este necesară.

Alegerea unui termen din lista de sub o celulă a numelui logic reprezintă un singur pas: numele logic, numele fizic pe care îl derivă și, pentru o coloană, domeniul termenului cu tipul său de date (consultați [Completarea numelor de termeni](./logical-names.md#completing-term-names)).  
Alegerea unui domeniu în celula Domeniu a unei coloane reprezintă un singur pas, împreună cu tipul de date pe care îl dă coloanei și cu ce propagă setarea [Sincronizare tip de date în relații](./settings.md#relationship-datatype-sync) de-a lungul relațiilor. Alegerea opțiunii `None`, care elimină legătura coloanei cu domeniul, reprezintă și ea un singur pas (consultați [Celula Domeniu](./logical-names.md#the-domain-cell)). Tastarea într-o coloană legată a unui tip de date diferit de cel al domeniului ei elimină legătura coloanei cu domeniul în pasul acelei introduceri.  
Comanda `Derive Physical Name Again` sau `Derive Physical Names Again` reprezintă un singur pas, oricâte nume, legături cu domeniile și tipuri de date ar modifica. Nu înregistrează niciun pas doar când nu modifică nimic. Trecerea unui nume personalizat înapoi în gestiunea dicționarelor este o modificare, chiar și când numele conține deja ce dau acestea.

Crearea unui [grup de tabele](./table-groups.md), prin trasarea lui sau prin gruparea tabelelor selectate cu elementul `Group selected tables` ori cu `T` apoi `G`, reprezintă un singur pas, împreună cu fiecare tabel pe care îl cuprinde. Eliminarea unui grup reprezintă un singur pas, iar anularea ei readuce grupul cu tabelele sale înăuntru.  
Glisarea unui grup de bara sa de titlu mută grupul și toate tabelele sale într-un singur pas. Tabelele lăsate într-un grup sau scoase dintr-un grup își schimbă grupul în același pas cu glisarea lor când eliberați butonul în aproximativ `200ms` de la ultima mișcare, așa că o singură anulare le readuce unde erau și în grupurile din care făceau parte. După o pauză mai lungă înainte de eliberarea butonului, schimbarea grupului este un pas separat, iar prima anulare inversează doar această schimbare.  
Redimensionarea unui grup de o margine sau de un colț se înregistrează o singură dată, la eliberarea butonului.  
Aplicarea [aranjării automate](./table-related-functions.md#auto-layout) reprezintă un singur pas, inclusiv grupurile pe care le ajustează în jurul tabelelor lor.

Comanda `Replace All` din [Găsire și înlocuire](./find-and-replace.md#replacing) reprezintă și ea un singur pas, oricâte nume de tabele, nume de coloane, nume logice, nume de indexuri, nume de grupuri de tabele, comentarii și note ar modifica, inclusiv numele fizice și legăturile cu domeniile pe care le derivă numele logice. Când nu modifică nimic, ca atunci când opțiunea `Preserve Case` rescrie fiecare potrivire așa cum era, nu înregistrează niciun pas.  
O comandă `Replace` individuală reprezintă un singur pas, inclusiv ce derivă un nume logic și derularea la potrivirea următoare, când acea potrivire o necesită. Când își rescrie potrivirea așa cum era, înregistrează doar acea derulare sau nimic, dacă nu există una.  
Saltul la o potrivire derulează pânza doar când potrivirea nu este deja bine vizibilă (consultați [Unde ajunge un salt](./table-related-functions.md#where-a-jump-lands)). Această derulare se înregistrează ca orice altă schimbare a poziției vizualizării, așa că, după parcurgerea potrivirilor, anularea inversează mai întâi acele derulări, câte una pe pas.  
Celelalte salturi care ajung pe pânză își înregistrează derulările la fel: alegerea unui rând în explorator, a unui rezultat al căutării rapide, a unei verificări din foaia `Checks` din fila Dicționar care numește un tabel sau o coloană ori a [butonului cardului](./visualization.md#card-buttons) cu link extern din Flux. Un salt care lasă vizualizarea pe loc nu înregistrează nimic. Nici alegerea unui rând din lista vizualizatorului `Diff Viewer` nu înregistrează nimic, deoarece mută numai propriile părți doar în citire ale vizualizatorului de diferențe.

O glisare continuă, o deplasare a pânzei, un zoom, o ciupire sau o schimbare de culoare este reținută în buffer timp de aproximativ `200ms` și ajunge tot ca o singură intrare.  
O glisare care se deplasează în total mai puțin de `20px` nu înregistrează nicio mutare. Se înregistrează doar schimbarea de grup pe care o produce, dacă există.

Tastarea într-o celulă sau într-o notă se înregistrează pentru fiecare introducere, nu pentru fiecare gest: fiecare caracter tastat, fiecare lipire și fiecare pas al unei compuneri cu metoda de introducere (IME) este un pas separat.  
O celulă a numelui logic se înregistrează la fel. Când editorul ei se închide pe un nume logic diferit de cel cu care s-a deschis, numele fizic pe care dicționarele îl derivă din el este încă un pas după tastare. Prima anulare inversează doar acel nume, împreună cu domeniul și tipul de date aduse de un termen, și lasă numele logic pe care l-ați tastat. Când nu se derivă nimic, nu se mai înregistrează nimic (consultați [Scrierea unui nume logic](./logical-names.md#writing-a-logical-name)).  
Numele unui grup de tabele se înregistrează o singură dată, când este salvat cu `Enter` sau prin părăsirea câmpului, așa că numele pe care îl tastați pentru un grup abia creat este un pas separat de crearea lui. Tasta `Esc` sau un nume lăsat neschimbat nu înregistrează nimic.

## Foile din fila Dicționar {#dictionary-sheets}

Foile `Domains`, `Words` și `Terms` din fila Dicționar își păstrează fiecare propriul istoric, separat de cel al diagramei. Fiecare editare făcută în filă ajunge în istoricul foii ale cărei rânduri le scrie. La fel ca istoricul diagramei, fiecare istoric păstrează până la `2048` de pași și se află în memorie pe durata sesiunii.

- Cu focusul tastaturii în filă, `Ctrl + Z` (Windows/Linux) sau `⌘ + Z` (Mac) anulează ultima editare a foii afișate, iar `Ctrl + Shift + Z` (Windows/Linux) sau `⌘ + Shift + Z` (Mac) reface ultima editare anulată.
- Butoanele `Undo` și `Redo` din bara de instrumente fac același lucru și devin active doar când foaia afișată are o editare de anulat sau de refăcut. Apăsarea lor lasă focusul tastaturii unde era, în grilă sau în câmpul de căutare. Fila nu are butonul `Time Travel`.
- În foaia `Checks`, unde nu se editează nimic, butoanele rămân inactive, iar nici ele, nici tastele nu au niciun efect.
- Cu editarea unei celule deschisă sau cu cursorul de text în câmpul de căutare al filei, tastele anulează și refac în schimb ce ați tastat acolo.

Istoricele nu se amestecă niciodată. Anularea din fila ERD nu inversează niciodată editarea unei foi, iar anularea unei foi nu inversează niciodată editarea altei foi sau a diagramei. Fiecare foaie își păstrează istoricul cât timp comutați între foi sau între file.

Fiecare dintre următoarele reprezintă un singur pas al foii sale:

- Editarea unei celule, înregistrată o singură dată, când este scrisă, nu pentru fiecare caracter tastat, și doar când modifică valoarea (consultați [Editarea celulelor](./dictionary.md#editing-cells)).
- O lipire, inclusiv rândurile pe care le adaugă, și golirea celulelor selectate cu `Delete` sau `Backspace` (consultați [Copierea și lipirea](./dictionary.md#copying-and-pasting)).
- Butonul `Add Row` și fiecare inserare sau ștergere de rânduri, din bară, din meniul grilei sau cu tastele, oricâte rânduri ar cuprinde (consultați [Adăugarea și ștergerea rândurilor](./dictionary.md#adding-and-deleting-rows)).
- Domeniul unui termen ales din lista sa, inclusiv `None` (consultați [Domeniul unui termen](./dictionary.md#a-terms-domain)).
- O sortare (consultați [Sortarea](./dictionary.md#sorting)).
- Un fișier CSV importat cu `Import CSV`, oricâte rânduri ar adăuga sau actualiza. Este un pas al foii pe care o completează fișierul, pe care fila o afișează apoi, indiferent din ce foaie l-ați importat (consultați [Importarea](./dictionary.md#importing)).

O scriere care nu modifică nimic, de exemplu același fișier importat din nou sau sortarea unei foi aflate deja în acea ordine, nu înregistrează niciun pas, la fel ca o scriere refuzată cu notificarea `Nothing saved: …`. Când unui termen fără `Physical Name` i se dă un nume, numele fizic pe care îl compun cuvintele sale face parte din pasul acelei editări.

Noua valoare `Data Type` a unui domeniu reprezintă un singur pas al foii `Domains`, împreună cu tipurile pe care le dă coloanelor legate de domeniu și celor la care ajunge de la ele setarea Sincronizare tip de date în relații (consultați [Domenii și tipuri de date](./dictionary.md#domains-and-data-types)).  
Anularea sau refacerea acestui pas schimbă din nou tipul coloanelor legate de domeniu în acel moment, așa că o coloană pe care ați legat-o între timp de alt domeniu sau căreia i-ați schimbat tipul își păstrează tipul. O coloană a cărei legătură a fost eliminată de acest pas, de exemplu o cheie străină a cărei legătură cu propriul domeniu a eliminat-o sincronizarea, este legată din nou doar cât timp rămâne nelegată de niciun domeniu și are încă tipul cu care a lăsat-o pasul.

Un editor cu atributul `readonly` ascunde butoanele, iar tastele nu anulează și nu refac nimic.  
Nici modificările venite de la colaboratori și de la agenții de programare nu se înregistrează în istoricul unei foi.

Istoricul fiecărei foi se golește când dicționarele sunt înlocuite: prin importul unui fișier JSON cu elementul `Import`, făcut de dumneavoastră sau de un colaborator, prin anularea ori refacerea acestuia și prin încărcarea altei diagrame în editor. Importul unui fișier Schemă SQL, GraphQL, DBML sau AML cu elementul `Import` păstrează dicționarele și, odată cu ele, istoricul fiecărei foi, inclusiv la anularea și refacerea lui.

## Călătorie în timp {#time-travel}

Se deschide cu butonul `Time Travel` din bara de instrumente, aflat lângă butoanele de anulare și refacere în fila ERD.  
Butonul nu are niciun efect cât timp istoricul diagramei nu are încă nicio modificare înregistrată. Un editor doar în citire nu afișează un astfel de buton, iar un editor care devine doar în citire închide Time Travel fără să îl aplice.

Călătoria în timp deschide o copie separată a diagramei, doar în citire, la poziția de derulare, nivelul de zoom și [modul de afișare a numelor](./logical-names.md#name-view) pe care le afișează pânza, indiferent dacă blocarea `Viewport` sau `Name View` este activată sau nu.  
Parcurge doar istoricul diagramei, așa că editările foilor din fila Dicționar nu se numără printre punctele sale.  
Glisați glisorul sau faceți clic oriunde pe pista lui pentru a parcurge întregul istoric al editărilor și a previzualiza fiecare punct. Poziția cea mai din stânga a glisorului este starea aflată cu un pas înaintea primei modificări înregistrate, iar la deschidere cursorul glisorului se află pe starea curentă.  
Previzualizarea este inertă: desenează o minihartă, dar nu o puteți deplasa, derula sau edita, iar documentul real rămâne neatins până la aplicare.

Apăsați `Apply` pentru a restaura punctul selectat sau `Cancel` ori `Esc` pentru a lăsa documentul neschimbat.

![Deschiderea călătoriei în timp, glisarea glisorului înapoi prin sesiune și aplicarea unui punct anterior](/img/demo-time-travel.webp)
