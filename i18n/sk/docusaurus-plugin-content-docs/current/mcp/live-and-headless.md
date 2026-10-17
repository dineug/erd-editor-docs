---
sidebar_position: 3
description: Ako server MCP rozhoduje medzi úpravami naživo v editore (VS Code, Obsidian alebo IDE od JetBrains) a úpravami súboru na disku a čo v každom z týchto režimov robí ukladanie, vrátenie späť a zatvorený editor.
---

# Live a Headless

Pri každom volaní server hľadá editor, ktorý spravuje dokument, prostredníctvom súborov zámku, ktoré si editory vedú v priečinku `~/.erd-editor/ide/`.
Každé okno VS Code a každé okno trezoru aplikácie Obsidian, v ktorom beží ERD Editor, si vedie jeden a IDE od JetBrains si vedie jeden pre celé IDE so zoznamom všetkých projektov, ktoré sú v ňom otvorené.
Editor svoj súbor zámku pri zatvorení odstráni.
To, čo server nájde, rozhoduje o tom, kam úprava smeruje.

| Čo nájde | Čo urobí úprava |
| --- | --- |
| Editor, ktorého pracovný priestor, trezor alebo otvorený projekt obsahuje dokument alebo ktorý ho má otvorený | **Live.** V prípade potreby otvorí dokument v editore ERD Editor, pripojí sa k relácii úprav a vykoná v nej zmenu. Úpravy sa zobrazia okamžite a ukladajú sa tak, ako editor ukladá vaše vlastné – pozrite si časť [Ukladanie](#saving). |
| Žiadny editor | **Headless.** Načíta súbor, vykoná zmenu a súbor nahradí. Nástroj `erd_save` nemá čo robiť. |
| Editor s vypnutým hubom | **Odmietnuté.** Čítanie stále funguje, a to z disku. Zmenu zapísanú do súboru, ktorý má otvorený editor, by mohlo prepísať ďalšie uloženie editora, preto server nezapíše nič. |
| Editor so zapnutým hubom, ktorý však používa iný protokol ako server: so serverom vo verzii `1.0.0` rozšírenie pre VS Code vo verzii `3.x`, doplnok pre Obsidian vo verzii `0.x` alebo doplnok pre JetBrains vo verzii `0.9.0` alebo `0.10.0`; so serverom starším ako verzia `1.0.0` rozšírenie vo verzii `4.0.0` alebo novšej alebo doplnok vo verzii `1.0.0` alebo novšej | **Odmietnuté** vrátane čítania, s kódom `protocolMismatch`. Správa uvádza stranu, ktorú treba aktualizovať: buď rozšírenie či doplnok, alebo server – pozrite si časť [Aktualizácia](./installation.md#updating). |
| V systéme Windows editor, ktorý spravuje dokument pod inou cestou k tomu istému súboru: agent ho zadal cez sieťové zdieľanie alebo namapovanú jednotku tohto počítača, napríklad `\\localhost\C$\…`, a editor ho spravuje pod cestou s písmenom jednotky, alebo naopak | **Odmietnuté** vrátane čítania, s kódom `invalidPath`. Správa uvádza cestu, pod ktorou editor dokument spravuje; zavolajte znova s touto cestou. |
| V systéme Windows editor, ku ktorému Windows agenta nepustí: editor spustený ako správca, zatiaľ čo agent nie, alebo akýkoľvek editor, keď agent beží v izolovanom prostredí (sandbox) | **Odmietnuté** vrátane čítania, s kódom `hubUnreachable` a so správou, ktorá uvádza dôvod. Spustite editor aj agenta s rovnakými právami, napríklad tak, že editor znova spustíte bez správcovských práv. |

Výsledok úpravy uvádza režim, v ktorom prebehla, `live` alebo `headless`, a odmietnutá úprava uvádza dôvod.
Hľadanie prebehne znova pri každom volaní, takže po otvorení alebo zatvorení editora sa podľa toho nasmeruje už ďalšie volanie.

Keď dokument spravuje viac editorov, editor, ktorý ho má otvorený, má prednosť pred editorom, ktorý iba obsluhuje priečinok s dokumentom, a spomedzi editorov, ktoré obsluhujú priečinok, má prednosť ten, ktorého priečinok leží najhlbšie.
Pri rovnosti, napríklad keď ho majú otvorený dva editory, pripadne dokument tomu, ktorého súbor zámku sa zmenil naposledy.
Dokument v trezore aplikácie Obsidian vo vnútri priečinka pracovného priestoru VS Code teda pripadne aplikácii Obsidian, ibaže ho má otvorený VS Code a Obsidian nie.

Volania pre jeden dokument prebiehajú jedno po druhom v poradí, v akom dorazili na server. Volania pre rôzne dokumenty prebiehajú súbežne.

## Live {#live}

Agent sa k editoru pripojí ako ďalší spolupracovník.
Jeho úpravy sa okamžite dostanú do každého editora, v ktorom je dokument otvorený, a jeho fokus sa vykreslí na tabuľke a bunke, ktoré upravuje, rovnako ako fokus spolupracovníka – pozrite si časť [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Čítanie nikdy neotvorí editor. Úprava otvorí dokument v editore ERD Editor, ak ešte nie je otvorený, a nezoberie pritom fokus klávesnice.

### Ukladanie {#saving}

Každý editor ukladá úpravy agenta rovnakým spôsobom ako vaše vlastné.

Vo VS Code úpravy agenta označia kartu ako neuloženú rovnako ako vaše vlastné a na disk sa dostanú až vtedy, keď sa dokument uloží.
Nástroj `erd_save` ho uloží prostredníctvom VS Code, rovnako ako to robí jeho vlastný príkaz na uloženie. Namiesto toho ho môžete uložiť sami pomocou `Ctrl + S` (Windows/Linux) alebo `⌘ + S` (Mac).
Pri zatvorení editora s neuloženými úpravami agenta sa zobrazí otázka, či ich uložiť, rovnako ako pri každej inej neuloženej zmene.

Aplikácia Obsidian ukladá úpravy agenta približne dve sekundy po skončení úprav a zatvorenie karty ich uloží bez opýtania.
IDE od JetBrains ich zapíše zlomok sekundy po skončení úprav a zatvorenie karty zapíše to, čo ešte čaká na zápis; karta sa nikdy nezobrazí ako zmenená.
V oboch prípadoch ich nástroj `erd_save` zapíše okamžite.

Nástroj `erd_save` najprv čaká až dve sekundy, kým editor neprevezme všetky úpravy, ktoré agent urobil.
Odmietne sa s kódom `notSaved`, keď to editor nedokázal potvrdiť alebo súbor nezapísal: VS Code ponechá kartu neuloženú, keď sa súbor zmenil na disku, a IDE od JetBrains ho nedokázalo zapísať, napríklad kým bolo otvorené dialógové okno alebo keď do súboru nemožno zapisovať.

Vo VS Code a v IDE od JetBrains nástroj `erd_save` pri dokumente, v ktorom nezostalo nič na uloženie, uspeje a súbor ponechá tak, ako je.
Tak je to vtedy, keď je uložená každá úprava, čo IDE od JetBrains robí samo, a zostáva to tak, kým je každá neskoršia zmena taká, ktorú [zamknutie](../guide/guides/settings.md#lock) nepustí do súboru, napríklad posúvanie alebo zmena priblíženia pri zamknutom nastavení `Viewport` alebo prepínanie kariet pri zamknutom nastavení `Canvas Type`. Každé zamknutie je predvolene zapnuté.
Súbor, do ktorého IDE od JetBrains nemôže zapisovať, sa odmietne aj vtedy.

Keď editor po poslednej úprave agenta dokument zatvorí, ďalšie volanie agenta obsahuje upozornenie, že tieto úpravy sú v súbore iba vtedy, ak sa uložili pred zatvorením editora.

### Vrátenie späť {#undo}

Nástroj `erd_undo` vráti späť poslednú úpravu, ktorú urobil agent, nikdy nie vašu, a `erd_redo` ju znova vykoná.
Vlastné [vrátenie späť](../guide/guides/undo-redo.md) v editore funguje naopak: vracia späť vaše úpravy a nikdy nie úpravy agenta, pretože zmeny, ktoré prídu z iného editora, sa do vašej histórie nezaznamenávajú.

Niekoľko úprav nevytvára v editore žiadny záznam v histórii zmien: `erd_set_database` a `erd_set_database_name` spomedzi [nástrojov nastavení](./tools.md#settings) a `erd_resize_memo`.
Nevytvára ho ani volanie `erd_move_table_group`, ktoré presunie skupinu celkovo o menej ako 20 pixelov, pričom sa sčíta posun vodorovne a zvislo, hoci skupina zostane tam, kam sa presunula.
Nevytvára ho ani volanie, ktoré nič nezmení: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` alebo `erd_set_index_column_order`, ak nastavuje hodnotu, ktorú dokument už obsahuje; `erd_add_index_column` so stĺpcom, ktorý už v indexe je; `erd_set_table_group` s tabuľkami, ktoré už v danej skupine sú (alebo už nie sú v žiadnej, s hodnotou `null` argumentu `groupId`); `erd_move_table_group` do bodu, kde skupina už je; `erd_resize_table_group` na obdĺžnik, ktorý skupina už má; `erd_sort_tables` pri dokumente bez tabuliek; alebo import s hodnotou `append` argumentu `mode`, ktorý neprinesie žiadnu tabuľku (pri `erd_import_json` žiadnu tabuľku ani poznámku).
Nástroj `erd_undo` tieto volania preskočí a vo svojom výsledku ich vymenuje.
Iné úpravy, napríklad `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` a `erd_set_ddl_script`, vytvoria záznam aj vtedy, keď nastavia hodnotu, ktorú dokument už obsahuje.

História zmien agenta sa ukončí a výsledok na to upozorní, keď:

- Agent sa k dokumentu znova pripojí, napríklad potom, ako ho editor z dokumentu odpojil.
- Editor sa ukončí alebo zatvorí dokument a prestane ho obsluhovať, pričom agent ďalej upravuje súbor na disku.
- Editor prevezme dokument, ktorý agent upravoval na disku.

Server tiež zatvorí dokument, pre ktorý agent 30 minút nezavolal žiadny nástroj, a história zmien zanikne spolu s ním, bez upozornenia.

### Keď editor prestane byť dostupný {#when-the-editor-goes-away}

Kým editor spravuje dokument, server nikdy sám od seba neprejde k úpravám súboru.
Ak sa spojenie preruší, znova sa pripojí.
Server upravuje súbor až vtedy, keď sa editor ukončil alebo zatvoril dokument a už neuvádza dokument ani priečinok, ktorý ho obsahuje, a vo výsledku to oznámi.
To nastane, keď zatvoríte diagram, ktorý leží mimo všetkých priečinkov, ktoré editor obsluhuje (vo VS Code diagram otvorený mimo pracovného priestoru), keď v aplikácii Obsidian vypnete doplnok ERD Editor a keď v IDE od JetBrains zatvoríte projekt, ktorý dokument obsahuje, alebo tam vypnete doplnok.
Zatvorený diagram v priečinku, ktorý editor obsluhuje, zostáva pri editore a ďalšia úprava agenta ho znova otvorí.

Editor, ktorý stále beží, ale jeho súbor zámku zmizol a jeho spojenie sa ukončilo bez toho, aby zatvoril dokument, odmietne ďalšiu úpravu s kódom `hubGone`.
Správa uvádza, čo dokument uvoľní: vo VS Code znova načítajte dané okno alebo ho zatvorte, aby agent mohol upravovať súbor priamo; v aplikácii Obsidian znova zapnite doplnok ERD Editor alebo zatvorte dané okno; v IDE od JetBrains znova zapnite doplnok alebo IDE ukončite.

Čítanie namiesto toho siahne po súbore na disku s upozornením, že úpravy, ktoré editor ešte neuložil, chýbajú, a to v dvoch prípadoch: keď má editor, ktorý dokument spravuje, vypnutý hub, a v prípade `hubGone` uvedenom vyššie.
Čítanie, ktoré sa nedokáže pripojiť k hubu editora, sa odmietne s kódom `hubUnreachable`, rovnako ako úprava.

## Headless {#headless}

Keď dokument neobsluhuje žiadny editor, každá úprava načíta súbor, vykoná zmenu a súbor zapíše späť.
Zápis smeruje do dočasného súboru vedľa dokumentu s názvom `.<name>.<id>.tmp`, ktorý ho potom nahradí, takže dokument nikdy nezostane zapísaný iba napoly, s výnimkou zápisu na mieste v systéme Windows opísaného nižšie.

Pred týmto posledným krokom server skontroluje, či sa súbor počas volania na disku nezmenil.
Ak áno, nič sa nezapíše, súbor sa načíta znova a volanie sa odmietne s kódom `conflict`. Agent zavolá znova.
Súbor, ktorý sa zmenil medzi dvoma volaniami, sa jednoducho načíta znova a história zmien agenta spred tohto okamihu sa zahodí.

Súbor iba na čítanie sa ponechá tak, ako je, a úprava sa odmietne s kódom `readonly`: súbor bez povolenia na zápis pre jeho vlastníka alebo v systéme Windows s atribútom iba na čítanie, napríklad súbor Perforce alebo TFVC, ktorý nie je otvorený na úpravy (check-out).
Povoľte zápis do súboru a potom zavolajte znova. Čítanie stále funguje.

Ak editor začne obsluhovať dokument, kým ho agent upravuje na disku, táto jedna úprava sa odmietne s kódom `hubAppeared` a nič sa nezapíše. Ďalšie volanie už upravuje prostredníctvom editora.

V systéme Windows platia ešte dve pravidlá:

- Dokument s vlastnými povoleniami, odlišnými od povolení jeho priečinka, sa namiesto nahradenia zapíše na mieste, aby si ich zachoval, a dočasný súbor sa potom odstráni. Program, ktorý dokument počas tohto zápisu číta, môže nájsť text, ktorý sa nedá syntakticky spracovať.
- Súbor, ktorý má otvorený iný program, nemožno nahradiť, preto to server skúša znova až dve sekundy. Každý pokus najprv znova hľadá editor a editor, ktorý medzitým začal dokument obsluhovať, odmietne zápis s kódom `hubAppeared` alebo, ak má vypnutý hub, s kódom `blocked`. Ak je súbor po dvoch sekundách stále otvorený, nič sa nezapíše, súbor sa načíta znova a volanie zlyhá so správou, ktorá cituje systémovú chybu.

## Odmietnuté {#refused}

Okno VS Code si ponechá súbor zámku, aj keď má vypnutý hub: keď je nastavenie `dineug.erd-editor.agentHub.enabled` vypnuté, keď pracovný priestor nie je dôveryhodný alebo keď jeho hub nemohol začať prijímať pripojenia.
Okno trezoru aplikácie Obsidian si ponechá súbor zámku s vypnutým hubom, keď je vypnutá možnosť Coding agents a keď jeho hub nemohol začať prijímať pripojenia.
IDE od JetBrains si ponechá súbor zámku s vypnutým hubom, keď je vypnutá možnosť Coding agents, keď jeho hub nemohol začať prijímať pripojenia a počas ukončovania IDE.

Úprava takého dokumentu sa odmietne s kódom `blocked`, pretože otvorený editor by mohol pri ďalšom uložení prepísať zmenu zapísanú do súboru.
Čítanie stále funguje, a to zo súboru na disku.

Aby agent mohol upravovať, znova zapnite hub tak, ako to pre daný editor uvádza správa: vo VS Code dôverujte pracovnému priestoru a zapnite nastavenie alebo znova načítajte okno; v aplikácii Obsidian zapnite možnosť Coding agents alebo aplikáciu Obsidian znova načítajte; v IDE od JetBrains zapnite možnosť Coding agents alebo reštartujte IDE, ak je už zapnutá.

IDE od JetBrains tiež s kódom `hubDisabled` odmietne zmeniť dokument, ktorý spravujú iba projekty, ktorým nedôveruje.
Agenti môžu taký dokument stále čítať a `erd_list_documents` ho uvádza ako `readonly`. Dôverujte projektu a potom zavolajte znova.

Editor, ktorý si nevedie žiadny súbor zámku, nič nechráni a agent upravuje súbor na disku, aj keď je v ňom diagram otvorený.
Tak je to pri aplikácii Obsidian alebo IDE od JetBrains nainštalovaných ako Flatpak v systéme Linux, pri IDE od JetBrains bez JCEF a pri IDE od JetBrains, ktorého hub sa nepodarilo spustiť – pozrite si časti [Nastavenie aplikácie Obsidian](./installation.md#set-up-obsidian) a [Nastavenie IDE od JetBrains](./installation.md#set-up-a-jetbrains-ide).
Žiadny súbor zámku si nevedú ani rozšírenie pre VS Code staršie ako verzia `3.0.0`, ani doplnok pre JetBrains starší ako verzia `0.9.0`, pretože nemajú hub.

## Dokumenty {#documents}

Dokument sa určuje argumentom `path`, absolútnou cestou alebo cestou relatívnou k pracovnému adresáru servera.

- Nové dokumenty majú príponu `.erd.json`. Nástroj `erd_open_document` s argumentom `create` vytvorí súbor a názvu bez prípony pridá príponu `.erd.json`. Rovnako ako nový diagram v editore má nový dokument zapnuté každé [zamknutie](../guide/guides/settings.md#lock), takže posúvanie, zmena priblíženia, prepínanie kariet ani výber iného cieľového jazyka na karte Generátor kódu, štýlu názvov alebo typu úvodzoviek v editore nikdy nezmení súbor. Žiadny nástroj nezapína ani nevypína jednotlivé zamknutie: to urobíte na karte Nastavenia v editore. Nástroj `erd_import_json` v režime `replace` ich všetky nahradí zamknutiami dokumentu, ktorý načíta – pozrite si časť [Import](./tools.md#import).
- Otvoria sa aj existujúce súbory `.erd`, `.vuerd` a `.vuerd.json`. Cesta s akoukoľvek inou príponou sa odmietne s kódom `invalidPath`.
- V systéme Windows sa cesta obsahujúca názov, ktorý Windows neuloží tak, ako je napísaný, odmietne s kódom `invalidPath` ešte pred čítaním alebo zápisom dokumentu, a to aj pri čítaní: názov s dvojbodkou alebo iným znakom, ktorý Windows odmieta, napríklad `orders:v2.erd`; názov zariadenia, napríklad `NUL.erd` alebo `CON.erd`, bez ohľadu na veľkosť písmen; alebo názov končiaci bodkou alebo medzerou. Premenujte súbor, napríklad so znakom `-` namiesto `:`.
- Súbor, ktorý nie je dokumentom, ktorý editor dokáže prečítať, napríklad súbor, v ktorom zostali značky konfliktu zlúčenia, sa odmietne s kódom `invalidDocument` a ponechá sa tak, ako je. Nikdy sa nenačíta ako prázdny diagram a nezapíše sa späť.

Agent mení dokument iba prostredníctvom nástrojov a má pokyn nikdy nezapisovať do súboru sám.

Nástroj `erd_list_documents` vypíše dokumenty s poľami `path`, `open`, `active`, `dirty` a `readonly`.
Opýta sa editora, ktorý obsluhuje pracovný adresár, vybraného rovnako ako pri dokumente, a vypíše diagramy, ktoré sú v ňom otvorené, potom súbory ERD, ktoré obsluhuje: súbory v priečinkoch pracovného priestoru okna VS Code, v trezore aplikácie Obsidian alebo v každom projekte otvorenom v IDE od JetBrains.
Inak vypíše súbory ERD v pracovnom adresári, pričom súbor iba na čítanie je označený ako `readonly` a v systéme Windows sa názov, ktorý Windows neuloží tak, ako je napísaný, vynechá.
