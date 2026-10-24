---
sidebar_position: 3
description: Hoe de MCP-server kiest tussen live bewerken in een editor (VS Code, Obsidian of een JetBrains-IDE) en het bestand op schijf bewerken, en wat opslaan, ongedaan maken en een gesloten editor in elke modus doen.
---

# Live en headless

Bij elke aanroep zoekt de server naar een editor die het document beheert, via de lockbestanden die de editors in `~/.erd-editor/ide/` bijhouden.
Elk VS Code-venster en elk Obsidian-kluisvenster met de ERD Editor houdt er een bij, en een JetBrains-IDE houdt er een bij voor de hele IDE, met daarin elk project dat in de IDE geopend is.
Een editor verwijdert zijn lockbestand wanneer hij wordt afgesloten.
Wat de server vindt, bepaalt waar de bewerking terechtkomt.

| Wat hij vindt | Wat een bewerking doet |
| --- | --- |
| Een editor waarvan de werkruimte, de kluis of een geopend project het document bevat, of die het geopend heeft | **Live.** Opent het document zo nodig in de ERD Editor, neemt deel aan de bewerkingssessie en past de wijziging daar toe. Bewerkingen verschijnen direct en worden opgeslagen zoals de editor die van jou opslaat — zie [Opslaan](#saving). |
| Geen editor | **Headless.** Laadt het bestand, past de wijziging toe en vervangt het bestand voordat er een antwoord komt, dus het resultaat vermeldt `saved: true` en `erd_save` hoeft niets te doen. |
| Een editor met uitgeschakelde hub | **Geweigerd.** Lezen werkt nog, vanaf schijf. Een wijziging die naar het bestand wordt geschreven terwijl een editor het geopend heeft, kan worden overschreven wanneer die editor de volgende keer opslaat, dus de server schrijft niets. |
| Een editor waarvan de hub aanstaat maar die een ander protocol gebruikt dan de server: bij server `1.0.0` of later een VS Code-extensie `3.x`, een Obsidian-plug-in `0.x` of een JetBrains-plug-in `0.9.0` of `0.10.0`; bij een server vóór `1.0.0` de extensie `4.0.0` of later, of een plug-in `1.0.0` of later | **Geweigerd**, leesopdrachten inbegrepen, met `protocolMismatch`. Het bericht noemt de kant die moet worden bijgewerkt: de extensie of plug-in, of de server — zie [Bijwerken](./installation.md#updating). |
| Op Windows een editor die het document beheert onder een ander pad naar hetzelfde bestand: de agent heeft het genoemd via een netwerkshare of een toegewezen station van deze computer, zoals `\\localhost\C$\…`, en de editor beheert het onder het pad met stationsletter, of andersom | **Geweigerd**, leesopdrachten inbegrepen, met `invalidPath`. Het bericht noemt het pad waaronder de editor het document beheert; roep opnieuw aan met dat pad. |
| Op Windows een editor waartoe Windows de agent geen toegang geeft: een editor die als administrator is gestart terwijl de agent dat niet was, of elke editor wanneer de agent in een sandbox draait | **Geweigerd**, leesopdrachten inbegrepen, met `hubUnreachable` en een bericht dat zegt waarom. Laat de editor en de agent met dezelfde rechten draaien, bijvoorbeeld door de editor opnieuw te starten zonder administratorrechten. |

Het resultaat van een bewerking noemt de modus waarin die is uitgevoerd, `live` of `headless`, en een geweigerde bewerking zegt waarom.
De zoektocht wordt bij elke aanroep opnieuw uitgevoerd, dus als een editor wordt geopend of gesloten, gaat de volgende aanroep daarin mee.

Als meer dan één editor het document beheert, wint een editor die het geopend heeft van een editor die alleen een map bedient waarin het staat, en van de editors die een map bedienen wint de editor waarvan de map het diepst ligt.
Bij een gelijkspel, zoals twee editors die het allebei geopend hebben, wint de editor waarvan het lockbestand het laatst is gewijzigd.
Een document in een Obsidian-kluis binnen een werkruimtemap van VS Code gaat dus naar Obsidian, tenzij VS Code het geopend heeft en Obsidian niet.

Aanroepen voor één document worden één voor één uitgevoerd, in de volgorde waarin ze de server bereikten. Aanroepen voor verschillende documenten worden naast elkaar uitgevoerd.

## Live {#live}

De agent voegt zich bij de editor als nog een medebewerker.
Zijn bewerkingen bereiken direct elke editor waarin het document geopend is, en zijn focus wordt getekend op de tabel en de cel die hij bewerkt, zoals die van een medebewerker — zie [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Een leesopdracht opent nooit een editor. Een bewerking opent het document in de ERD Editor als het nog niet geopend is, zonder de toetsenbordfocus over te nemen.

Een editor met een VS Code-extensie vóór `4.2.0`, of een Obsidian- of JetBrains-plug-in vóór `1.2.0`, verwerkt de bewerkingen van de agent nog steeds live, maar toont noch behoudt de logische namen, domeinkoppelingen en woordenboekrijen die de agent schrijft — zie [Bijwerken](./installation.md#updating).

### Opslaan {#saving}

Elke editor slaat de bewerkingen van de agent op zoals hij die van jou opslaat.

In VS Code markeren de bewerkingen van de agent het tabblad als gewijzigd, net als die van jou, en komen ze pas op schijf wanneer het document wordt opgeslagen.
`erd_save` slaat het op via VS Code, zoals de eigen opslagopdracht van VS Code dat doet. In plaats daarvan kun je zelf opslaan, met `Ctrl + S` (Windows/Linux) of `⌘ + S` (Mac).
Als je de editor sluit terwijl bewerkingen van de agent nog niet zijn opgeslagen, wordt gevraagd of ze moeten worden opgeslagen, zoals bij elke andere wijziging die niet is opgeslagen.

Obsidian slaat de bewerkingen van de agent op ongeveer twee seconden nadat het bewerken is gestopt, en bij het sluiten van het tabblad worden ze zonder te vragen opgeslagen.
Een JetBrains-IDE schrijft ze weg een fractie van een seconde nadat het bewerken is gestopt, en bij het sluiten van het tabblad wordt weggeschreven wat nog openstaat; het tabblad wordt nooit als gewijzigd weergegeven.
In beide schrijft `erd_save` ze direct weg.

`erd_save` wacht eerst maximaal twee seconden tot de editor elke bewerking bevat die de agent heeft gemaakt.
De aanroep wordt geweigerd met `notSaved` als de editor dat niet kon bevestigen, of het bestand niet heeft weggeschreven: VS Code slaat een tabblad niet op wanneer het bestand op schijf is gewijzigd, en een JetBrains-IDE kon het niet wegschrijven, bijvoorbeeld terwijl er een dialoogvenster open was of wanneer het bestand niet kan worden geschreven.

In VS Code en een JetBrains-IDE slaagt `erd_save` bij een document waarin niets meer op te slaan valt, en blijft het bestand zoals het is.
Dat is het geval zodra elke bewerking is opgeslagen, wat een JetBrains-IDE uit zichzelf doet, en het blijft zo zolang elke latere wijziging er een is die een [vergrendeling](../guide/guides/settings.md#lock) buiten het bestand houdt, zoals scrollen of zoomen terwijl `Viewport` vergrendeld is, van tabblad wisselen terwijl `Canvas Type` vergrendeld is of de [naamweergave](../guide/guides/logical-names.md#name-view) wisselen terwijl `Name View` vergrendeld is. Elke vergrendeling staat standaard aan.
Een bestand dat een JetBrains-IDE niet kan wegschrijven, wordt zelfs dan geweigerd.

Als de editor het document sluit na de laatste bewerking van de agent, bevat de volgende aanroep van de agent een notitie dat die bewerkingen alleen in het bestand staan als ze zijn opgeslagen voordat de editor werd gesloten.

### Ongedaan maken {#undo}

`erd_undo` maakt de laatste bewerking van de agent ongedaan, nooit die van jou, en `erd_redo` voert die opnieuw uit.
[Ongedaan maken](../guide/guides/undo-redo.md) in de editor zelf werkt andersom: het maakt jouw bewerkingen ongedaan en nooit die van de agent, omdat wijzigingen die van een andere editor binnenkomen niet in jouw geschiedenis worden vastgelegd.

Een paar bewerkingen leveren in de editor geen stap in de geschiedenis op: `erd_set_database` en `erd_set_database_name` uit de [tools voor instellingen](./tools.md#settings), en `erd_resize_memo`.
Ook een `erd_move_table_group` die de groep in totaal minder dan 20 pixels verplaatst, horizontaal en verticaal bij elkaar opgeteld, levert er geen op, al blijft de groep staan waar hij naartoe is verplaatst.
Een aanroep die niets verandert, levert er ook geen op: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` of `erd_set_index_column_order` die een waarde instelt die het document al heeft; `erd_add_index_column` met een kolom die al in de index zit; `erd_set_table_group` met tabellen die al in die groep zitten (of al in geen enkele, met `groupId` `null`); `erd_move_table_group` naar het punt waar de groep al staat; `erd_resize_table_group` naar de rechthoek die de groep al heeft; `erd_sort_tables` op een document zonder tabel; `erd_set_table_logical_name` of `erd_set_column_logical_name` met de logische naam die de tabel of kolom al heeft, als afleiden daaruit niets zou veranderen; `erd_set_column_domain` met het domein waaraan de kolom al is gekoppeld, als de kolom al het type van dat domein heeft en [Gegevenstypen via relaties synchroniseren](../guide/guides/settings.md#relationship-datatype-sync) langs haar relaties geen enkele kolom een ander type zou geven; `erd_update_word`, `erd_update_term` of `erd_update_domain` met alleen waarden die de rij al bevat, tenzij een term zonder fysieke naam zijn `name` krijgt en de woorden ervan er een samenstellen; `erd_derive_physical_names` als elke naam die de aanroep bestrijkt en die een logische naam heeft, al bevat wat de [woordenboeken](./tools.md#dictionaries) hem geven en als afgeleid is gemarkeerd; of een import met `mode` `append` die geen tabel meebrengt (bij `erd_import_json` geen tabel en geen memo).
`erd_undo` slaat deze over en noemt ze in zijn resultaat.
Andere bewerkingen, zoals `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` en `erd_set_ddl_script`, leveren wel een stap op, ook wanneer ze een waarde instellen die het document al heeft.

De geschiedenis van de agent eindigt, met een notitie in het resultaat, wanneer:

- De agent opnieuw aan het document deelneemt, bijvoorbeeld nadat de editor de agent eruit heeft verwijderd.
- De editor stopt, of het document sluit en het niet meer bedient, en de agent het bestand op schijf verder bewerkt.
- Een editor een document overneemt dat de agent op schijf aan het bewerken was.

De server sluit ook een document waarvoor de agent 30 minuten geen aanroep heeft gedaan, en de geschiedenis verdwijnt mee, zonder notitie.

### Als de editor verdwijnt {#when-the-editor-goes-away}

Zolang een editor een document beheert, valt de server nooit uit zichzelf terug op het bestand.
Als de verbinding wegvalt, maakt hij opnieuw verbinding.
Pas wanneer de editor is gestopt, of het document heeft gesloten en het of een map waarin het staat niet meer vermeldt, bewerkt de server het bestand, en dat meldt hij in het resultaat.
Dat gebeurt wanneer je een diagram sluit dat buiten elke map ligt die de editor bedient (in VS Code een diagram dat van buiten de werkruimte is geopend), wanneer je de ERD Editor-plug-in in Obsidian uitschakelt en wanneer je in een JetBrains-IDE het project sluit dat het document bevat of daar de plug-in uitschakelt.
Een gesloten diagram in een map die de editor bedient, blijft bij de editor, en de volgende bewerking van de agent opent het opnieuw.

Een editor die nog draait, maar waarvan het lockbestand weg is en waarvan de verbinding is verbroken zonder dat hij het document heeft gesloten, weigert de volgende bewerking met `hubGone`.
Het bericht zegt wat het document vrijgeeft: laad in VS Code dat venster opnieuw, of sluit het zodat de agent het bestand direct kan bewerken; schakel in Obsidian de ERD Editor-plug-in weer in, of sluit dat venster; schakel in een JetBrains-IDE de plug-in weer in, of sluit de IDE af.

Een leesopdracht gaat in twee gevallen in plaats daarvan naar het bestand op schijf, met een notitie dat bewerkingen ontbreken die nog niet in de editor zijn opgeslagen: als de editor die het document beheert een uitgeschakelde hub heeft, en in het geval `hubGone` hierboven.
Een leesopdracht die geen verbinding kan maken met de hub van een editor, wordt geweigerd met `hubUnreachable`, net als een bewerking.

## Headless {#headless}

Als geen editor het document bedient, laadt elke bewerking het bestand, past de wijziging toe en schrijft het bestand terug voordat er een antwoord komt, dus het resultaat ervan vermeldt `saved: true` — zie [Resultaten](./tools.md#results).
Er wordt geschreven naar een tijdelijk bestand naast het document, met de naam `.<name>.<id>.tmp`, dat het daarna vervangt, zodat het document nooit half geschreven achterblijft, behalve op Windows in het hieronder beschreven geval waarin ter plaatse wordt geschreven.

Vóór die laatste stap controleert de server of het bestand tijdens de aanroep op schijf is gewijzigd.
Zo ja, dan wordt er niets geschreven, wordt het bestand opnieuw geladen en wordt de aanroep geweigerd met `conflict`. De agent roept dan opnieuw aan.
Een bestand dat tussen twee aanroepen is gewijzigd, wordt gewoon opnieuw geladen, en de geschiedenis van de agent van vóór dat moment vervalt.

Een alleen-lezenbestand blijft zoals het is, en de bewerking wordt geweigerd met `readonly`: een bestand zonder schrijfrechten voor de eigenaar, of met het attribuut alleen-lezen op Windows, zoals een Perforce- of TFVC-bestand dat niet is uitgecheckt.
Maak het beschrijfbaar en roep daarna opnieuw aan. Lezen werkt nog.

Als een editor het document gaat bedienen terwijl de agent het op schijf bewerkt, wordt die ene bewerking geweigerd met `hubAppeared` en wordt er niets geschreven. De volgende aanroep bewerkt via de editor.

Op Windows gelden nog twee regels:

- Een document met eigen machtigingen, anders dan die van zijn map, wordt ter plaatse geschreven in plaats van vervangen, zodat het die behoudt, en het tijdelijke bestand wordt daarna verwijderd. Een programma dat het document tijdens het schrijven leest, kan tekst aantreffen die niet te parseren is.
- Een bestand dat een ander programma geopend houdt, kan niet worden vervangen, dus probeert de server het maximaal twee seconden opnieuw. Elke poging zoekt eerst opnieuw naar een editor, en een editor die intussen het document is gaan bedienen, weigert het schrijven met `hubAppeared`, of met `blocked` als zijn hub uitgeschakeld is. Als het bestand na twee seconden nog steeds geopend is, wordt er niets geschreven, wordt het bestand opnieuw geladen en mislukt de aanroep met een bericht dat de systeemfout citeert.

Een server vóór `1.1.0` leest een document zonder de logische namen, de domeinkoppelingen van de kolommen en de woorden, termen en domeinen ervan, dus de eerste bewerking die hij naar het bestand schrijft, laat ze weg. Werk de server bij — zie [Bijwerken](./installation.md#updating).

## Geweigerd {#refused}

Een VS Code-venster behoudt zijn lockbestand ook als zijn hub uitgeschakeld is: wanneer `dineug.erd-editor.agentHub.enabled` uitstaat, wanneer de werkruimte niet wordt vertrouwd of wanneer zijn hub niet kon luisteren.
Een Obsidian-kluisvenster behoudt zijn lockbestand met uitgeschakelde hub wanneer Coding agents is uitgeschakeld en wanneer zijn hub niet kon luisteren.
Een JetBrains-IDE behoudt zijn lockbestand met uitgeschakelde hub wanneer Coding agents is uitgeschakeld, wanneer zijn hub niet kon luisteren en terwijl de IDE afsluit.

Een bewerking van zo'n document wordt geweigerd met `blocked`, omdat de geopende editor een wijziging die naar het bestand is geschreven, bij de volgende keer opslaan zou kunnen overschrijven.
Lezen werkt nog, vanaf het bestand op schijf.

Schakel de hub weer in om de agent te laten bewerken, zoals het bericht voor die editor aangeeft: vertrouw in VS Code de werkruimte en schakel de instelling in, of laad het venster opnieuw; schakel in Obsidian Coding agents in, of laad Obsidian opnieuw; schakel in een JetBrains-IDE Coding agents in, of start de IDE opnieuw als Coding agents al is ingeschakeld.

Een JetBrains-IDE weigert ook, met `hubDisabled`, een document te wijzigen dat alleen in projecten staat die hij niet vertrouwt.
Agents kunnen zo'n document nog wel lezen, en `erd_list_documents` vermeldt het als `readonly`. Vertrouw het project en roep daarna opnieuw aan.

Een editor die geen lockbestand bijhoudt, beschermt niets, en de agent bewerkt het bestand op schijf, zelfs terwijl het diagram daar geopend is.
Dat geldt voor Obsidian of een JetBrains-IDE die als Flatpak op Linux is geïnstalleerd, een JetBrains-IDE zonder JCEF en een JetBrains-IDE waarvan de hub niet kon starten — zie [Obsidian instellen](./installation.md#set-up-obsidian) en [Een JetBrains-IDE instellen](./installation.md#set-up-a-jetbrains-ide).
Een VS Code-extensie vóór `3.0.0` en een JetBrains-plug-in vóór `0.9.0` houden er ook geen bij, omdat ze geen hub hebben.

## Documenten {#documents}

Een document wordt aangeduid met `path`, absoluut of relatief ten opzichte van de werkmap van de server.

- Nieuwe documenten zijn `.erd.json`-bestanden. `erd_open_document` met `create` maakt het bestand aan en voegt `.erd.json` toe aan een naam zonder extensie. Net als bij een nieuw diagram in de editor staat in het nieuwe document elke [vergrendeling](../guide/guides/settings.md#lock) aan, zodat het bestand nooit verandert door in een editor te scrollen, te zoomen, van tabblad te wisselen, de naamweergave te wisselen of in de Codegenerator een andere taal, naamnotatie of een ander type aanhalingstekens te kiezen. Geen enkele tool schakelt een afzonderlijke vergrendeling in of uit: dat doe je op het tabblad Instellingen van de editor. `erd_import_json` in de modus `replace` vervangt ze allemaal door die van het document dat de tool laadt — zie [Importeren](./tools.md#import).
- Bestaande `.erd`-, `.vuerd`- en `.vuerd.json`-bestanden kunnen ook worden geopend. Een pad met een andere extensie wordt geweigerd met `invalidPath`.
- Op Windows wordt een pad met een naam die Windows niet opslaat zoals hij geschreven is, geweigerd met `invalidPath` voordat het document wordt gelezen of geschreven, leesopdrachten inbegrepen: een naam met een dubbele punt of een ander teken dat Windows weigert, zoals `orders:v2.erd`; een apparaatnaam zoals `NUL.erd` of `CON.erd`, ongeacht hoofdlettergebruik; of een naam die eindigt op een punt of een spatie. Wijzig de naam, bijvoorbeeld met `-` in plaats van `:`.
- Een bestand dat geen document is dat de editor kan lezen, zoals een bestand waarin markeringen van een mergeconflict zijn achtergebleven, wordt geweigerd met `invalidDocument` en blijft zoals het is. Het wordt nooit als leeg diagram geladen en teruggeschreven.

De agent wijzigt een document alleen via de tools en krijgt de instructie het bestand nooit zelf te schrijven.

`erd_list_documents` toont de documenten met `path`, `open`, `active`, `dirty` en `readonly`.
De tool raadpleegt de editor die de werkmap bedient, gekozen zoals bij een document, en toont de diagrammen die daarin geopend zijn en daarna de ERD-bestanden die hij bedient: die in de werkruimtemappen van een VS Code-venster, in een Obsidian-kluis of in elk project dat in een JetBrains-IDE geopend is.
Anders toont de tool de ERD-bestanden onder de werkmap, waarbij een alleen-lezenbestand als `readonly` wordt gemarkeerd en op Windows een naam die Windows niet opslaat zoals hij geschreven is, wordt weggelaten.
