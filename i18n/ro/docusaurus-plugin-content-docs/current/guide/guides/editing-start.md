---
sidebar_position: 1
description: Porniți de la ecranul de bun venit și creați tabele, note, grupuri de tabele și relații din meniul contextual al pânzei, din bara de instrumente a pânzei sau cu o comandă rapidă.
---

# Începerea editării

Editarea începe din meniul contextual, deschis cu un clic dreapta.

![Clicul dreapta pe pânză, deschiderea submeniului Relationship, adăugarea unui tabel, apoi meniul propriu al acestuia](/img/demo-context-menu.webp)

Un clic dreapta pe un tabel, pe o notă, pe un grup de tabele sau pe o relație deschide în schimb meniul propriu al elementului respectiv.  
Un clic dreapta pe un tabel, pe o notă sau pe un grup de tabele deja selectat păstrează întreaga selecție, așa că elementele de meniu, de exemplu `Color` și `Delete selected`, acționează asupra întregii selecții (consultați [Selecție multiplă](./table-related-functions.md#multiple-selection)).

## Ecranul de bun venit {#welcome-screen}

În aplicația web, în Google Drive, în VS Code, în Obsidian și într-un IDE JetBrains, o diagramă goală se deschide cu un ecran de bun venit deasupra pânzei ERD. Un element `<erd-editor>` din propria pagină îl afișează doar când pagina îl activează cu proprietatea [`enableWelcomeScreen`](../../api/erd-editor-element.md#enablewelcomescreen).  
O diagramă este considerată goală cât timp nu conține niciun tabel, nicio notă afișată și niciun grup de tabele afișat, așa că notele și grupurile ascunse cu View Option nu contează. Ecranul dispare de îndată ce diagrama conține unul dintre acestea și revine ori de câte ori diagrama devine din nou goală, de exemplu după ce ștergeți ultimul tabel sau anulați adăugarea primului.  
Nu se afișează într-un editor doar în citire, în modul Zen, cât timp este deschis panoul Proprietăți tabel sau cât timp vizualizatorul de diferențe, previzualizarea aranjării automate sau călătoria în timp ocupă pânza.

![Ecranul de bun venit pe o diagramă goală: deschiderea formatelor din Import, revenirea cu Esc, adăugarea unui tabel cu New Table, apoi readucerea ecranului cu ⌘ + Z](/img/demo-welcome-screen.webp)

Sub titlul `Right-click the canvas for every action.` se află un meniu:

- `New Table` adaugă un tabel, la fel ca `Alt + N`.
- `New Memo` adaugă o notă, la fel ca `Alt + M`. Lipsește cât timp notele sunt ascunse.
- `Import` înlocuiește meniul cu `Back` și cu formatele `json`, `Schema SQL`, `GraphQL`, `DBML` și `AML`. Alegerea unui format solicită un fișier în acel format și îl încarcă în locul diagramei goale (consultați [Importarea sau exportarea fișierelor](./file-import-export.md)). Cu `Back` sau cu `Escape` se revine la primul meniu.
- `Command Palette` deschide [căutarea rapidă](./quick-search.md), la fel ca `Ctrl + K` (Windows/Linux) sau `⌘ + K` (Mac).
- `Shortcuts` deschide setările în fila [`Shortcuts`](./settings.md#shortcuts).

Acolo unde pânza este suficient de lată, `New Table`, `New Memo` și `Command Palette` afișează combinația de taste asociată în prezent comenzii lor, inclusiv una reasociată de o aplicație gazdă.  
Odată ce un rând are focusul tastaturii, `↑` și `↓` parcurg rândurile și reiau lista de la capăt, `Home` și `End` sar la primul și la ultimul rând, iar `Enter` sau `Space` acționează rândul activ. Toate celelalte comenzi rapide funcționează în continuare, așa că `Alt + N` adaugă un tabel și de acolo.  
Doar meniul preia clicurile: o apăsare oriunde altundeva pe ecran ajunge la pânză, iar un clic dreapta pe pânză deschide meniul contextual ca de obicei.

Acolo unde pânza are spațiu, săgeți desenate de mână indică:

- butonul `Search` din bara de instrumente: `Search commands and tables`
- butoanele `Theme` și `Display Language`: `Pick a theme and a language` ori, când bara de instrumente îl afișează doar pe unul dintre ele, `Pick a theme` sau `Pick a language` (consultați [Limbă și temă](./language-and-theme.md))
- [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar) din partea de jos: `Pan, zoom and draw relationships`

Cât timp [exploratorul](./explorer.md) este afișat, ecranul de bun venit acoperă doar pânza de lângă el.  
O săgeată al cărei buton din bara de instrumente se află deasupra exploratorului lipsește. Săgeata pentru `Theme` și `Display Language` lipsește doar când ambele ei butoane se află deasupra exploratorului; până atunci, indică butonul aflat încă deasupra pânzei.  
O etichetă care nu are loc lângă săgeata ei apare în schimb sub săgeată.

## Crearea tabelelor {#table-creation}

Creați un tabel din meniul contextual, cu butonul `New Table` din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar) sau cu comanda rapidă `Alt + N`.

## Crearea notelor {#memo-creation}

Creați o notă din meniul contextual, cu butonul `New Memo` din bara de instrumente a pânzei sau cu comanda rapidă `Alt + M`.  
Cât timp opțiunea View Option → `Memos` este dezactivată, notele sunt ascunse, nicăieri nu se oferă `New Memo`, iar `Alt + M` nu adaugă nicio notă (consultați [Opțiuni de afișare a tabelelor](./table-related-functions.md#table-view-options)).

O notă este o însemnare cu text liber pe pânză. Faceți clic în corpul ei și tastați; textul se salvează odată cu documentul.  
`Escape` închide editorul notei, păstrând ce ați tastat și lăsând nota selectată, iar o a doua apăsare pe `Escape` deselectează tot.  
Glisați-i marginea pentru a o redimensiona. Butonul `x` din antetul ei, afișat cât timp indicatorul se află deasupra notei, o șterge.  
Un clic dreapta pe o notă deschide meniul ei, nu editorul: `Color`, `Remove color` cât timp vreun element selectat are o culoare și `Delete`, care afișează `Delete selected` cât timp nota se numără printre două sau mai multe elemente selectate. O notă selectată se șterge și cu tastele care șterg tabelele (consultați [Ștergerea tabelelor și notelor](./table-related-functions.md#table-and-memo-deletion)).

![Adăugarea unei note cu Alt + M, tastarea textului și glisarea marginii ei pentru a o redimensiona](/img/demo-memo.webp)

## Crearea grupurilor de tabele {#table-group-creation}

Un grup de tabele este un chenar care conține tabele și căruia îi puteți da un nume și o culoare. Creați unul în oricare dintre aceste două moduri:

- Alegeți `New Table Group` din meniul contextual sau din căutarea rapidă, faceți clic pe butonul `New Table Group` din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar) ori apăsați `Alt + G` (Windows/Linux) sau `⌥ + G` (Mac), apoi trasați un chenar pe pânză prin glisare. Fiecare tabel al cărui centru se află în interiorul chenarului intră în noul grup, dacă nu face deja parte din alt grup (consultați [Trasarea unui grup](./table-groups.md#drawing-a-group)).
- Selectați tabele, apoi alegeți `Group selected tables` din meniul contextual al unui tabel sau `Group Selected Tables` din căutarea rapidă ori apăsați `T` apoi `G` (consultați [Gruparea tabelelor selectate](./table-groups.md#grouping-selected-tables)).

Denumirea, colorarea, mutarea, redimensionarea și celelalte operații sunt descrise în [Grupuri de tabele](./table-groups.md).

## Crearea relațiilor {#relationship-creation}

Începeți o relație din meniul contextual, din [bara de instrumente a pânzei](./table-related-functions.md#canvas-toolbar) din partea de jos a pânzei sau cu o comandă rapidă. Fiecare tip de relație are propria comandă rapidă:

- Zero One: `Ctrl + Alt + 1` (Windows/Linux) sau `⌘ + ⌥ + 1` (Mac)
- Zero N: `Ctrl + Alt + 2` (Windows/Linux) sau `⌘ + ⌥ + 2` (Mac)
- One Only: `Ctrl + Alt + 3` (Windows/Linux) sau `⌘ + ⌥ + 3` (Mac)
- One N: `Ctrl + Alt + 4` (Windows/Linux) sau `⌘ + ⌥ + 4` (Mac)

Odată ce trasarea unui tip este activă, cursorul se schimbă. Faceți clic mai întâi pe tabelul părinte, apoi pe tabelul copil.  
Tabelul părinte primește o cheie primară dacă nu are niciuna, iar pentru fiecare coloană cheie primară a părintelui, tabelul copil primește o coloană cheie străină `Not Null` cu același tip de date, aceeași valoare implicită, același comentariu, același [nume logic](./logical-names.md) și același [domeniu](./dictionary.md#domains-and-data-types).  
O cheie de tip serial face excepție: cheia străină corespunzătoare primește tipul întreg pe care îl stochează tipul serial, de exemplu `integer` pentru `serial4`, și apoi nu leagă niciun domeniu (consultați [Relații identificatoare](./relationship-editing.md#identifying-relationships)).  
Fiecare coloană cheie străină este denumită după cheia sa: un nume dintr-un singur cuvânt, de exemplu `id`, primește în față numele tabelului părinte (`user_id`), un nume din mai multe cuvinte, de exemplu `member_id`, se păstrează, iar un nume pe care tabelul copil îl are deja primește un număr, ca în `user_id_2` (consultați [Numele coloanelor cheie străină](./relationship-editing.md#foreign-key-column-names)).  
Două clicuri pe același tabel trasează o relație autoreferențială.  
O relație nouă pornește cu `On Delete` și `On Update` setate amândouă pe `Not set`; modificați-le din meniul ei contextual (consultați [ON DELETE și ON UPDATE](./relationship-editing.md#on-delete-and-on-update)).  
Apăsați `Escape` sau apăsați din nou aceeași comandă rapidă pentru a renunța. Renunțarea lasă selecția neschimbată, iar următoarea apăsare pe `Escape` deselectează tot.

După ce ați ales tabelul părinte, trecerea indicatorului peste un tabel la care se poate încheia relația conturează tabelul respectiv și afișează lângă el două butoane:

- `Create new columns` (`+`) trasează relația cu coloane cheie străină noi, la fel ca un clic pe tabel.
- `Map to existing columns` (o pictogramă de link) încheie trasarea și deschide caseta de dialog [Mapare coloane](./relationship-editing.md#map-columns) pentru cele două tabele, astfel încât relația să poată folosi coloane pe care tabelul copil le are deja. Nu se scrie nimic până când nu apăsați `Map`.

Și tabelul părinte afișează butoanele, odată ce indicatorul s-a deplasat puțin față de locul în care ați făcut clic pe el, astfel încât și o relație autoreferențială poate fi mapată pe coloane existente.  
Degetul nu are o stare de trecere a indicatorului, așa că atunci când trasați cu el, butoanele nu apar niciodată, iar o atingere pe tabelul copil trasează imediat relația; un stilou le afișează la fel ca un mouse.  
Dacă, până ajungeți la tabelul copil, tabelul părinte și-a pierdut cheia primară, de exemplu în urma unei anulări sau a unei editări făcute de un colaborator, butonul `Create new columns` este estompat și are sfatul ecran `<parent> has no primary key to copy`, iar un clic pe tabelul copil încheie trasarea fără a trasa nimic.  
Sfatul ecran numește tabelul părinte așa cum o face [modul de afișare a numelor](./logical-names.md#beyond-the-canvas).

![Trasarea unei relații One N cu ⌘ + ⌥ + 4, apoi a uneia Zero N din bara de instrumente a pânzei, cu tabelul copil conturat și butoanele sale Map to existing columns și Create new columns](/img/demo-relationship.webp)

## Duplicarea tabelelor și notelor {#duplicating-tables-and-memos}

Tabelele și notele existente pot fi copiate, lipite și glisate cu `Alt` pentru a crea duplicate (consultați [Funcții pentru tabele](./table-related-functions.md#copyingpasting-tables-and-memos)).
