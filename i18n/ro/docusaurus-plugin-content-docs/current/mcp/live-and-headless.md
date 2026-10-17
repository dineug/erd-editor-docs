---
sidebar_position: 3
description: Cum alege serverul MCP între editarea în direct într-un editor (VS Code, Obsidian sau un IDE JetBrains) și editarea fișierului pe disc și ce fac salvarea, anularea și un editor închis în fiecare caz.
---

# În direct și fără interfață

La fiecare apel, serverul caută un editor care deține documentul, prin fișierele de blocare pe care editoarele le păstrează în `~/.erd-editor/ide/`.
Fiecare fereastră VS Code și fiecare fereastră de seif Obsidian cu ERD Editor păstrează câte unul, iar un IDE JetBrains păstrează unul pentru întregul IDE, care listează fiecare proiect deschis în el.
Un editor își elimină fișierul de blocare atunci când se închide.
Ceea ce găsește serverul determină unde ajunge editarea.

| Ce găsește | Ce face o editare |
| --- | --- |
| Un editor al cărui spațiu de lucru, seif sau proiect deschis conține documentul sau care îl are deschis | **În direct.** Deschide documentul în ERD Editor dacă este nevoie, se alătură sesiunii de editare și aplică modificarea acolo. Editările apar imediat și sunt salvate așa cum editorul le salvează pe ale dumneavoastră (consultați [Salvarea](#saving)). |
| Niciun editor | **Fără interfață.** Încarcă fișierul, aplică modificarea și înlocuiește fișierul. Instrumentul `erd_save` nu are nimic de făcut. |
| Un editor cu hubul dezactivat | **Refuzat.** Citirile funcționează în continuare, de pe disc. O modificare scrisă în fișier cât timp un editor îl are deschis ar putea fi suprascrisă la următoarea salvare a acestuia, așa că serverul nu scrie nimic. |
| Un editor al cărui hub este activat, dar folosește un alt protocol decât cel al serverului: cu versiunea `1.0.0` a serverului, o extensie pentru VS Code `3.x`, un plugin pentru Obsidian `0.x` sau un plugin pentru JetBrains `0.9.0` sau `0.10.0`; cu un server anterior versiunii `1.0.0`, extensia `4.0.0` sau o versiune ulterioară ori un plugin `1.0.0` sau o versiune ulterioară | **Refuzat**, inclusiv citirile, cu codul `protocolMismatch`. Mesajul indică partea care trebuie actualizată: extensia sau pluginul ori serverul (consultați [Actualizarea](./installation.md#updating)). |
| Pe Windows, un editor care deține documentul printr-o altă cale către același fișier: agentul l-a indicat printr-o partajare de rețea sau printr-o unitate de rețea mapată a acestui computer, de exemplu `\\localhost\C$\…`, iar editorul îl deține prin calea cu litera unității, sau invers | **Refuzat**, inclusiv citirile, cu codul `invalidPath`. Mesajul indică calea prin care editorul deține documentul; apelați din nou cu acea cale. |
| Pe Windows, un editor la care Windows nu permite accesul agentului: unul pornit ca administrator când agentul nu a fost pornit astfel sau orice editor când agentul rulează într-un mediu izolat (sandbox) | **Refuzat**, inclusiv citirile, cu codul `hubUnreachable` și un mesaj care explică motivul. Rulați editorul și agentul cu aceleași drepturi, de exemplu repornind editorul fără drepturi de administrator. |

Rezultatul unei editări indică modul în care a rulat, `live` sau `headless`, iar o editare refuzată spune de ce.
Căutarea se reia la fiecare apel, așa că deschiderea sau închiderea unui editor se reflectă deja în următorul apel.

Când mai multe editoare dețin documentul, unul care îl are deschis are întâietate față de unul care doar deservește un folder ce îl conține, iar dintre cele care deservesc un folder câștigă cel al cărui folder se află cel mai adânc.
La egalitate, de exemplu când două editoare îl au amândouă deschis, câștigă cel al cărui fișier de blocare s-a modificat ultimul.
Astfel, un document dintr-un seif Obsidian aflat într-un folder al spațiului de lucru VS Code revine lui Obsidian, cu excepția cazului în care VS Code îl are deschis, iar Obsidian nu.

Apelurile asupra aceluiași document rulează pe rând, în ordinea în care au ajuns la server. Apelurile asupra unor documente diferite rulează în paralel.

## În direct {#live}

Agentul se alătură editorului ca încă un colaborator.
Editările sale ajung imediat în fiecare editor în care documentul este deschis, iar focusul său este desenat pe tabelul și celula pe care le editează, la fel ca al unui colaborator (consultați [focusTracker](../api/advanced/collaborative-editing.md#focustracker)).

O citire nu deschide niciodată un editor. O editare deschide documentul în ERD Editor dacă nu este încă deschis, fără a prelua focusul tastaturii.

### Salvarea {#saving}

Fiecare editor salvează editările agentului așa cum le salvează pe ale dumneavoastră.

În VS Code, editările agentului marchează fila ca modificată, la fel ca ale dumneavoastră, și ajung pe disc doar când documentul este salvat.
Instrumentul `erd_save` îl salvează prin VS Code, așa cum o face propria comandă de salvare a acestuia. În schimb, puteți salva chiar dumneavoastră, cu `Ctrl + S` (Windows/Linux) sau `⌘ + S` (Mac).
La închiderea editorului cu editări nesalvate ale agentului, apare întrebarea dacă doriți să le salvați, ca pentru orice altă modificare nesalvată.

Obsidian salvează editările agentului la aproximativ două secunde după ce editarea se oprește, iar la închiderea filei le salvează fără să întrebe.
Un IDE JetBrains le scrie la o fracțiune de secundă după ce editarea se oprește, iar închiderea filei scrie ce a rămas în așteptare; fila nu apare niciodată ca modificată.
În ambele, instrumentul `erd_save` le scrie imediat.

Instrumentul `erd_save` așteaptă mai întâi până la două secunde ca editorul să conțină fiecare editare făcută de agent.
Este refuzat cu codul `notSaved` când editorul nu a putut confirma acest lucru sau nu a scris fișierul: VS Code păstrează o filă nesalvată când fișierul s-a modificat pe disc, iar un IDE JetBrains nu a putut să-l scrie, de exemplu cât timp era deschisă o casetă de dialog sau când fișierul nu poate fi scris.

În VS Code și într-un IDE JetBrains, instrumentul `erd_save` apelat pe un document fără nimic rămas de salvat reușește și lasă fișierul așa cum este.
Așa se întâmplă odată ce fiecare editare este salvată, lucru pe care un IDE JetBrains îl face singur, și rămâne așa cât timp fiecare modificare ulterioară este una pe care o [blocare](../guide/guides/settings.md#lock) o ține în afara fișierului, de exemplu derularea sau modificarea zoomului cu setarea `Viewport` blocată ori schimbarea filelor cu setarea `Canvas Type` blocată. Toate blocările sunt activate implicit.
Un fișier pe care un IDE JetBrains nu îl poate scrie este refuzat chiar și atunci.

Când editorul închide documentul după ultima editare a agentului, următorul apel al agentului conține o mențiune că acele editări se află în fișier doar dacă au fost salvate înainte de închiderea editorului.

### Anulare {#undo}

Instrumentul `erd_undo` anulează ultima editare făcută de agent, niciodată pe ale dumneavoastră, iar `erd_redo` o aplică din nou.
[Anularea](../guide/guides/undo-redo.md) proprie a editorului funcționează invers: anulează editările dumneavoastră și niciodată pe ale agentului, deoarece modificările care sosesc de la un alt editor nu sunt înregistrate în istoricul dumneavoastră.

Câteva editări nu creează niciun pas de anulare în editor: `erd_set_database` și `erd_set_database_name`, dintre [instrumentele pentru setări](./tools.md#settings), și `erd_resize_memo`.
Același lucru este valabil pentru un apel `erd_move_table_group` care mută grupul cu mai puțin de 20 de pixeli în total, adunând deplasarea pe orizontală și pe verticală, deși grupul rămâne acolo unde a fost mutat.
De asemenea, un apel care nu modifică nimic nu creează niciun pas de anulare: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` sau `erd_set_index_column_order` care setează o valoare pe care documentul o are deja; `erd_add_index_column` cu o coloană aflată deja în index; `erd_set_table_group` cu tabele aflate deja în acel grup (sau deja în niciun grup, cu `groupId` `null`); `erd_move_table_group` către punctul în care grupul se află deja; `erd_resize_table_group` la dreptunghiul pe care grupul îl are deja; `erd_sort_tables` pe un document fără niciun tabel; sau un import cu `mode` `append` care nu aduce niciun tabel (pentru `erd_import_json`, niciun tabel și nicio notă).
Instrumentul `erd_undo` le omite și le menționează în rezultatul său.
Alte editări, de exemplu `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` și `erd_set_ddl_script`, creează un pas de anulare chiar și atunci când setează o valoare pe care documentul o are deja.

Istoricul anulărilor agentului se încheie, cu o mențiune în rezultat, atunci când:

- Agentul se alătură din nou documentului, de exemplu după ce editorul l-a eliminat din acesta.
- Editorul se închide sau închide documentul și încetează să îl deservească, iar agentul continuă să editeze fișierul pe disc.
- Un editor preia un document pe care agentul îl edita pe disc.

Serverul închide și un document asupra căruia agentul nu a făcut niciun apel timp de 30 de minute, iar istoricul anulărilor dispare odată cu el, fără nicio mențiune.

### Când editorul dispare {#when-the-editor-goes-away}

Cât timp un editor deține un document, serverul nu trece niciodată din proprie inițiativă la fișier.
Dacă conexiunea se întrerupe, se reconectează.
Doar după ce editorul s-a închis sau a închis documentul și nu mai listează nici documentul, nici un folder care îl conține, serverul editează fișierul și menționează acest lucru în rezultat.
Acest lucru se întâmplă când închideți o diagramă aflată în afara oricărui folder deservit de editor (în VS Code, una deschisă din afara spațiului de lucru), când dezactivați pluginul ERD Editor în Obsidian și când închideți proiectul care conține documentul într-un IDE JetBrains sau dezactivați pluginul acolo.
O diagramă închisă dintr-un folder deservit de editor rămâne la editor, iar următoarea editare a agentului o redeschide.

Un editor care încă rulează, dar al cărui fișier de blocare a dispărut și a cărui conexiune s-a închis fără ca el să fi închis documentul, refuză următoarea editare cu codul `hubGone`.
Mesajul spune ce eliberează documentul: în VS Code, reîncărcați acea fereastră sau închideți-o pentru a-i permite agentului să editeze direct fișierul; în Obsidian, reactivați pluginul ERD Editor sau închideți acea fereastră; într-un IDE JetBrains, reactivați pluginul sau ieșiți din IDE.

În schimb, o citire se face din fișierul de pe disc, cu o mențiune că lipsesc editările încă nesalvate în editor, în două cazuri: când editorul care deține documentul are hubul dezactivat și în cazul `hubGone` de mai sus.
O citire care nu se poate conecta la hubul unui editor este refuzată cu codul `hubUnreachable`, la fel ca o editare.

## Fără interfață {#headless}

Când niciun editor nu deservește documentul, fiecare editare încarcă fișierul, aplică modificarea și scrie fișierul înapoi.
Scrierea se face într-un fișier temporar de lângă document, numit `.<name>.<id>.tmp`, care apoi îl înlocuiește, astfel încât documentul nu rămâne niciodată scris pe jumătate, cu excepția suprascrierii directe de pe Windows, descrisă mai jos.

Înainte de acest ultim pas, serverul verifică dacă fișierul s-a modificat pe disc în timpul apelului.
Dacă da, nu se scrie nimic, fișierul este încărcat din nou, iar apelul este refuzat cu codul `conflict`. Agentul apelează din nou.
Un fișier care s-a modificat între două apeluri este doar încărcat din nou, iar istoricul anulărilor agentului de dinainte de acel moment este eliminat.

Un fișier doar în citire este lăsat așa cum este, iar editarea este refuzată cu codul `readonly`: un fișier fără permisiune de scriere pentru proprietarul său sau, pe Windows, cu atributul doar în citire, de exemplu un fișier Perforce sau TFVC pentru care nu s-a făcut check-out.
Permiteți scrierea în fișier, apoi apelați din nou. Citirile funcționează în continuare.

Dacă un editor începe să deservească documentul în timp ce agentul îl editează pe disc, doar acea editare este refuzată cu codul `hubAppeared` și nu se scrie nimic. Următorul apel editează prin intermediul editorului.

Pe Windows se aplică încă două reguli:

- Un document cu permisiuni proprii, diferite de cele ale folderului său, este suprascris direct în loc să fie înlocuit, astfel încât să le păstreze, iar fișierul temporar este eliminat după aceea. Un program care citește documentul în timpul acestei scrieri poate găsi un text care nu poate fi parsat.
- Un fișier pe care un alt program îl ține deschis nu poate fi înlocuit, așa că serverul reîncearcă timp de până la două secunde. Fiecare încercare caută mai întâi din nou un editor, iar un editor care a început între timp să deservească documentul refuză scrierea cu codul `hubAppeared` sau cu codul `blocked` când are hubul dezactivat. Dacă fișierul este încă ținut deschis după două secunde, nu se scrie nimic, fișierul este încărcat din nou, iar apelul eșuează cu un mesaj care citează eroarea sistemului.

## Refuzat {#refused}

O fereastră VS Code își păstrează fișierul de blocare chiar și când hubul său este dezactivat: când setarea `dineug.erd-editor.agentHub.enabled` este dezactivată, când spațiul de lucru nu este de încredere sau când hubul său nu a putut asculta conexiuni.
O fereastră de seif Obsidian își păstrează fișierul de blocare cu hubul dezactivat când opțiunea Coding agents este dezactivată și când hubul său nu a putut asculta conexiuni.
Un IDE JetBrains își păstrează fișierul de blocare cu hubul dezactivat când opțiunea Coding agents este dezactivată, când hubul său nu a putut asculta conexiuni și în timp ce IDE-ul se închide.

O editare a unui astfel de document este refuzată cu codul `blocked`, deoarece editorul deschis ar putea suprascrie, la următoarea salvare, o modificare scrisă în fișier.
Citirile funcționează în continuare, din fișierul de pe disc.

Pentru a-i permite agentului să editeze, reactivați hubul, așa cum spune mesajul pentru acel editor: în VS Code, marcați spațiul de lucru drept de încredere și activați setarea sau reîncărcați fereastra; în Obsidian, activați opțiunea Coding agents sau reîncărcați Obsidian; într-un IDE JetBrains, activați opțiunea Coding agents sau reporniți IDE-ul dacă opțiunea este deja activată.

Un IDE JetBrains refuză, de asemenea, cu codul `hubDisabled`, să modifice un document deținut doar de proiecte pe care nu le consideră de încredere.
Agenții pot citi în continuare un astfel de document, iar `erd_list_documents` îl listează ca `readonly`. Marcați proiectul drept de încredere, apoi apelați din nou.

Un editor care nu păstrează niciun fișier de blocare nu protejează nimic, iar agentul editează fișierul pe disc chiar și cât timp diagrama este deschisă acolo.
Așa stau lucrurile pentru Obsidian sau pentru un IDE JetBrains instalat ca Flatpak pe Linux, pentru un IDE JetBrains fără JCEF și pentru un IDE JetBrains al cărui hub nu a putut porni (consultați [Configurarea Obsidian](./installation.md#set-up-obsidian) și [Configurarea unui IDE JetBrains](./installation.md#set-up-a-jetbrains-ide)).
Nici o extensie pentru VS Code anterioară versiunii `3.0.0` și nici un plugin pentru JetBrains anterior versiunii `0.9.0` nu păstrează vreunul, deoarece nu au hub.

## Documente {#documents}

Un document este indicat prin argumentul `path`, o cale absolută sau relativă la directorul de lucru al serverului.

- Documentele noi sunt fișiere `.erd.json`. Instrumentul `erd_open_document` cu `create` creează fișierul, adăugând `.erd.json` unui nume care nu are extensie. La fel ca o diagramă nouă din editor, documentul nou are toate [blocările](../guide/guides/settings.md#lock) activate, așa că derularea, modificarea zoomului, schimbarea filelor sau alegerea unui alt limbaj al generatorului de cod, a unui alt stil de denumire sau a unui alt tip de delimitator într-un editor nu modifică niciodată fișierul. Niciun instrument nu activează sau dezactivează o singură blocare: faceți acest lucru în fila Setări a editorului. Instrumentul `erd_import_json` în modul `replace` le înlocuiește pe toate cu cele ale documentului pe care îl încarcă (consultați [Import](./tools.md#import)).
- Se deschid și fișierele existente `.erd`, `.vuerd` și `.vuerd.json`. O cale cu orice altă extensie este refuzată cu codul `invalidPath`.
- Pe Windows, o cale care conține un nume pe care Windows nu îl stochează așa cum este scris este refuzată cu codul `invalidPath` înainte ca documentul să fie citit sau scris, inclusiv la citiri: un nume cu două puncte sau cu un alt caracter pe care Windows îl refuză, de exemplu `orders:v2.erd`; un nume de dispozitiv, de exemplu `NUL.erd` sau `CON.erd`, indiferent de majuscule; sau un nume care se termină cu punct sau cu spațiu. Redenumiți-l, de exemplu cu `-` în loc de `:`.
- Un fișier care nu este un document pe care editorul îl poate citi, de exemplu unul rămas cu marcaje de conflict de îmbinare, este refuzat cu codul `invalidDocument` și lăsat așa cum este. Nu este niciodată încărcat ca diagramă goală și scris înapoi.

Agentul modifică un document doar prin intermediul instrumentelor și este instruit să nu scrie niciodată el însuși fișierul.

Instrumentul `erd_list_documents` listează documentele cu `path`, `open`, `active`, `dirty` și `readonly`.
Acesta interoghează editorul care deservește directorul de lucru, ales la fel ca pentru un document, și listează diagramele deschise în el, apoi fișierele ERD pe care le deservește: cele din folderele spațiului de lucru al unei ferestre VS Code, dintr-un seif Obsidian sau din fiecare proiect deschis într-un IDE JetBrains.
Altfel, listează fișierele ERD din directorul de lucru, unde un fișier doar în citire este marcat `readonly` și, pe Windows, un nume pe care Windows nu îl stochează așa cum este scris este omis.
