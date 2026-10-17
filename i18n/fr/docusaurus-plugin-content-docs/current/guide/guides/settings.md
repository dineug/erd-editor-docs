---
sidebar_position: 14
description: Synchronisation du type de données des relations, largeur maximale des commentaires, recalcul de la largeur des tables, verrouillage des paramètres (vue, onglet et paramètres de code), ordre d’affichage des colonnes et liste des raccourcis.
---

# Paramètres

Ouvrez-les avec le bouton `Settings` de la barre d’outils, ou depuis la [recherche rapide](./quick-search.md) sous `Tab`.
L’écran Paramètres comporte deux onglets : `Preferences` et `Shortcuts`. `Preferences` s’ouvre en premier, sauf depuis la ligne `Shortcuts` de l’[écran d’accueil](./editing-start.md#welcome-screen), qui ouvre `Shortcuts`.

Le thème et la langue d’affichage ne se trouvent pas sur cet écran. Les boutons `Theme` et `Display Language` de la barre d’outils les ouvrent (voir [Langue et thème](./language-and-theme.md)).

## Synchronisation du type de données des relations {#relationship-datatype-sync}

Détermine s’il faut synchroniser les types de données. Ce paramètre est activé par défaut.
Modifier le type de données d’une colonne l’applique alors à toutes les colonnes qui lui sont reliées par une relation, en suivant la chaîne dans les deux sens, de sorte qu’une clé étrangère ne diverge jamais de la clé qu’elle référence.
D’une clé vers ses clés étrangères, un type serial se transmet sous la forme du type entier qu’il stocke, comme lors du tracé d’une relation (voir [Relations identifiantes](./relationship-editing.md#identifying-relationships)). Ainsi, passer une clé en `serial` donne `integer` à ses clés étrangères sous PostgreSQL, et la modification se propage ensuite plus loin le long de la chaîne.
D’une clé étrangère vers sa clé, le type se transmet tel qu’il est écrit, sauf qu’une clé serial conserve son type et que la modification s’arrête là.
La boîte de dialogue [Associer les colonnes](./relationship-editing.md#map-columns) suit aussi ce paramètre : tant qu’il est activé, chaque colonne existante qu’elle associe prend le type que sa clé parente donne à une clé étrangère, et la modification se propage le long des relations comme ci-dessus. Tant qu’il est désactivé, ou lorsque la clé n’a pas de type de données, la colonne conserve le sien.

<img src="/img/settings-relationship-data-type-sync.png" width="290" alt="Paramètre de synchronisation du type de données des relations" loading="lazy" />

![Modification de members.id en BIGINT UNSIGNED, qui met à jour tous les member_id qui lui sont reliés](/img/demo-relationship-data-type-sync.webp)

## Largeur maximale des commentaires {#maximum-comment-width}

Définit la largeur maximale de la colonne des commentaires, en pixels (`60` ~ `200`).
Désactiver l’interrupteur supprime la limite, et le champ de saisie reste inactif tant que l’interrupteur est désactivé.
À l’activation, la valeur part de `60px`. Une valeur saisie hors de la plage est ramenée à la borne la plus proche.

![Activation de Maximum comment width, saisie de 120, et l’onglet ERD affichant les commentaires tronqués à cette largeur](/img/demo-settings-comment-width.webp)

## Recalcul de la largeur des tables {#recalculation-table-width}

Appuyez sur `Sync` pour recalculer la largeur de chaque table et de chaque cellule de colonne en fonction de son texte actuel, et pour retracer les connecteurs de relation autour des nouvelles tailles.
Une notification `Recalculated table width` le confirme.
Les largeurs sont recalculées d’elles-mêmes à chaque chargement d’un document, si bien que cette action n’est nécessaire que lorsqu’un changement de police ou de rendu les a rendues obsolètes.
Les largeurs ne sont pas enregistrées dans le fichier, donc `Sync` ne le modifie jamais.

## Verrouillage {#lock}

La liste `Lock` contient six paramètres. Tant que le verrou d’un paramètre est activé, le fichier conserve la valeur qu’avait ce paramètre au moment du verrouillage, si bien que le modifier à l’écran laisse le fichier tel qu’il était.

| Ligne | Ce que conserve le fichier | Dans un nouveau diagramme |
| --- | --- | --- |
| `Viewport` | Le niveau de zoom et la position de la vue du canevas ERD, sous un seul verrou | `100% · 0, 0` |
| `Canvas Type` | L’onglet sur lequel s’ouvre le diagramme : `ERD`, `Visualization`, `Schema SQL` ou `Code Generator` | `ERD` |
| `Language` | Le langage du [générateur de code](./code-generator.md#language) | `GraphQL` |
| `Table Name Case` | La [casse des noms de table](./code-generator.md#name-case) du générateur de code | `Pascal` |
| `Column Name Case` | La [casse des noms de colonne](./code-generator.md#name-case) du générateur de code | `Camel` |
| `Bracket Type` | Le `Bracket` de l’onglet [Schéma SQL](./schema-sql.md#database-and-bracket) et des cibles du [générateur de code](./code-generator.md#bracket) qui le proposent | `None` |

Chaque ligne affiche une valeur et un bouton de verrou, et un clic sur ce bouton active ou désactive ce seul verrou.
Tant qu’un verrou est activé, le bouton affiche un cadenas fermé avec l’info-bulle `Unlock Viewport` (et ainsi de suite pour chaque ligne), et la valeur, avec l’info-bulle `Locked value`, est celle que conserve le fichier.
Tant qu’il est désactivé, le bouton affiche un cadenas ouvert avec l’info-bulle `Lock Viewport`, et la valeur, grisée, avec l’info-bulle `Current value`, correspond à l’état actuel du paramètre.
`Viewport` indique le zoom puis la position de la vue, comme `75% · -40, 91`. La position de la vue est le point de l’écran, en pixels, où se trouve le `0, 0` du diagramme, et une coordonnée de mille ou plus est abrégée, comme dans `1.2k` ou `-24k`.

Le verrouillage prend le paramètre tel qu’il est à ce moment-là.
Tant qu’un verrou est activé, le paramètre continue de fonctionner à l’écran : vous pouvez faire défiler et zoomer, changer d’onglet, et choisir un autre langage, une autre casse des noms ou un autre délimiteur depuis les menus, les panneaux des options ou la recherche rapide.
Le fichier conserve toutefois la valeur verrouillée, et la ligne continue de l’afficher, si bien que le diagramme se rouvre sur la vue verrouillée, sur l’onglet verrouillé, avec le langage, les casses des noms et le délimiteur verrouillés. Une exportation JSON écrit également les valeurs verrouillées.
Pour enregistrer ce qu’affiche l’écran, désactivez le verrou, et le fichier suit dès lors le paramètre : avec `Viewport` déverrouillé, le diagramme s’ouvre là où vous l’avez laissé. Pour verrouiller plutôt une nouvelle valeur, comme une nouvelle vue de départ, désactivez puis réactivez le verrou.
Si la vue verrouillée ne montre aucune partie du diagramme à l’ouverture du fichier, l’écran se déplace tout de même sur le diagramme, et la valeur verrouillée reste inchangée.
`Canvas Type` ne conserve jamais l’onglet Paramètres. Son activation verrouille le dernier autre onglet sur lequel vous vous trouviez, et tant que son verrou est désactivé, sa ligne indique cet onglet.

![Déverrouillage de Viewport, défilement et zoom du diagramme, puis nouveau verrouillage sur la nouvelle vue qu’affiche sa ligne](/img/demo-settings-locks.webp)

Activer ou désactiver un verrou modifie le fichier, puisque celui-ci enregistre quels verrous sont activés, mais, comme le reste de l’onglet Paramètres, cette action n’est pas inscrite dans l’[historique d’annulation](./undo-redo.md#what-the-history-records). Dans un éditeur en lecture seule, les boutons de verrou sont sans effet.
Tous les autres paramètres sont enregistrés tels quels : la base de données, les options de [`View Option`](./table-related-functions.md#table-view-options) et le reste de l’onglet `Preferences`.

Tous les verrous sont activés dans un nouveau diagramme, c’est-à-dire créé à partir de rien : un fichier vide ouvert dans VS Code, Obsidian ou un IDE JetBrains (dans Obsidian, `ERD Editor: Create new diagram` et `New ERD` en créent un), un nouveau schéma dans l’application web, un fichier créé depuis le menu New de Google Drive, ou un `<erd-editor>` sans valeur.
Un schéma ou un fichier Google Drive que l’application web crée en important un fichier SQL, DBML, AML ou GraphQL démarre lui aussi avec tous les verrous activés. Celui créé à partir d’un fichier JSON conserve les verrous que ce fichier enregistre.
Un fichier que vous ouvrez conserve les verrous avec lesquels il a été enregistré, chacun avec sa valeur verrouillée.
Un fichier qui n’enregistre aucun verrou, comme un fichier enregistré par une version antérieure aux verrous ou écrit à la main, s’ouvre avec tous les verrous activés : la vue à `100% · 0, 0` et l’onglet sur `ERD`, quels que soient la vue et l’onglet qu’il a enregistrés, et son langage, ses casses des noms et son type de délimiteur verrouillés tels qu’il les a enregistrés.
Un `Import` qui remplace le diagramme définit aussi les verrous : un fichier JSON apporte les verrous qu’il enregistre et les valeurs qu’ils contiennent, et un fichier SQL, DBML, AML ou GraphQL conserve vos verrous mais ramène la vue à `100% · 0, 0`, verrouillée ou non (voir [Importer des fichiers externes](./file-import-export.md#importing-external-files)). Annuler l’importation rétablit les verrous et les valeurs verrouillées qu’elle a remplacés.

Un changement qu’un verrou tient à l’écart du fichier n’est pas compté comme un changement. VS Code ne marque pas l’onglet comme modifié, et Obsidian et un IDE JetBrains laissent le fichier tel qu’il était, aussi bien lors de leur enregistrement automatique qu’à la fermeture de l’onglet.
Ainsi, avec tous les verrous activés, parcourir un diagramme, changer d’onglet et essayer un autre langage, une autre casse des noms ou un autre délimiteur n’apparaissent jamais dans `git diff`.
Avec `Viewport` déverrouillé, le défilement et le zoom modifient le fichier, et avec `Canvas Type` déverrouillé, le changement d’onglet aussi, y compris vers l’onglet Paramètres.
Le fichier vide d’un nouveau diagramme reste vide jusqu’au premier changement que le fichier conserve : une modification, le changement d’un paramètre qu’aucun verrou ne retient, ou l’activation ou la désactivation d’un verrou.
Ouvrir un diagramme puis le fermer sans aucun changement de ce type laisse le fichier tel qu’il était, quelle que soit la version ou la machine qui l’a écrit. Le fichier ne contient que ce qu’est le diagramme, dans un ordre fixe, et un fichier enregistré sous une forme plus ancienne est réécrit une seule fois sous cette forme, lors de son premier changement de ce type (voir [Forme de stockage et valeur d’exécution](../../api/advanced/schema.md#storage-form-and-runtime-value)).
Dans VS Code, une révision rouverte en tant que diagramme avec `Reopen Editor With...`, comme une révision Git ou une entrée de Local History, est en lecture seule et n’est jamais marquée comme modifiée.
Dans Google Drive, un défilement, un zoom ou un passage à un autre onglet n’est jamais enregistré seul, verrouillé ou non. Avec `Viewport` déverrouillé, la vue n’est écrite qu’avec un autre changement, si bien qu’un fichier Drive s’ouvre là où se trouvait la vue lors de son dernier enregistrement, et il en va de même pour l’onglet avec `Canvas Type` déverrouillé.

Dans une [session collaborative](../../api/advanced/collaborative-editing.md), l’activation ou la désactivation d’un verrou parvient à tous les éditeurs, et un verrou conserve la valeur de l’éditeur qui l’a activé.
Déverrouiller `Language`, une casse des noms ou `Bracket Type` donne à tous les éditeurs la valeur affichée dans l’éditeur qui l’a déverrouillé, si bien que tous enregistrent une même valeur. Déverrouiller `Viewport` ou `Canvas Type` ne change ni la vue ni l’onglet de qui que ce soit.
Un agent de codage passant par le serveur MCP ne dispose d’aucun outil pour les verrous ni pour les paramètres qu’ils retiennent, et, pour un langage, une casse des noms ou un type de délimiteur verrouillés, il lit la valeur que conserve le fichier. Seules ses importations en mode `replace` les atteignent, comme le fait un `Import` (voir [Paramètres](../../mcp/tools.md#settings) et [Importation](../../mcp/tools.md#import)).

## Modifier l’ordre des colonnes {#adjusting-column-order}

Définit l’ordre d’affichage des colonnes dans les tables.
Faites glisser une ligne pour la déplacer : toute la ligne peut être déplacée, et l’icône de poignée la signale. Les sept lignes, dans leur ordre par défaut, sont `Name`, `DataType`, `Not Null`, `Unique`, `Auto Increment`, `Default` et `Comment`.
Une cellule masquée par une [option d’affichage des tables](./table-related-functions.md#table-view-options) garde sa place dans la liste, si bien que l’ordre s’applique aux cellules affichées, quelles qu’elles soient.
La marque de [clé alternative](./table-related-functions.md#alternate-keys) (`AK1.1` et ainsi de suite) ne fait pas partie de ces lignes. Elle se place toujours en dernier dans une ligne, après la cellule que cet ordre place en dernier, quelle qu’elle soit.

![Défilement jusqu’à Column Order et glissement de la ligne Comment vers le haut sous Name, ce qui place chaque commentaire juste après le nom de sa colonne](/img/demo-settings-column-order.webp)

## Raccourcis {#shortcuts}

L’onglet `Shortcuts` est un tableau en lecture seule, avec les colonnes `Command` et `Keybinding`, qui liste les raccourcis clavier de la plateforme que vous utilisez.

| Commande | Windows/Linux | Mac |
| --- | --- | --- |
| Editing | `Enter` | `Enter` |
| Stop | `ESC` | `ESC` |
| Search | `Ctrl + K` | `⌘ + K` |
| [Toggle Explorer](./explorer.md) | `Ctrl + F` | `⌘ + F` |
| Undo | `Ctrl + Z` | `⌘ + Z` |
| Redo | `Ctrl + Shift + Z` | `⌘ + Shift + Z` |
| Add Table | `Alt + N` | `⌥ + N` |
| Add Column | `Alt + Enter` | `⌥ + Enter` |
| Add Memo | `Alt + M` | `⌥ + M` |
| Add Table Group | `Alt + G` | `⌥ + G` |
| Group Selected Tables | `T` puis `G` | `T` puis `G` |
| Remove Table, Memo | `Ctrl + Backspace`, `Ctrl + Delete` | `⌘ + Backspace`, `⌘ + Delete` |
| Remove Column | `Alt + Backspace`, `Alt + Delete` | `⌥ + Backspace`, `⌥ + Delete` |
| Delete Selection | `Delete`, `Backspace` | `Delete`, `Backspace` |
| Primary Key | `Alt + K` | `⌥ + K` |
| Select All Table, Memo | `Ctrl + A`, `Ctrl + Alt + A` | `⌘ + A`, `⌘ + ⌥ + A` |
| Select All Column | `Alt + A` | `⌥ + A` |
| Relationship Zero One | `Ctrl + Alt + 1` | `⌘ + ⌥ + 1` |
| Relationship Zero N | `Ctrl + Alt + 2` | `⌘ + ⌥ + 2` |
| Relationship One Only | `Ctrl + Alt + 3` | `⌘ + ⌥ + 3` |
| Relationship One N | `Ctrl + Alt + 4` | `⌘ + ⌥ + 4` |
| Table Properties | `Alt + Space` | `⌥ + Space` |
| Focus on this table | `Alt + F` | `⌥ + F` |
| Zoom In | `Ctrl + Plus` | `⌘ + Plus` |
| Zoom Out | `Ctrl + Minus` | `⌘ + Minus` |
| Zoom Reset | `Ctrl + 0` | `⌘ + 0` |
| Hand Tool | `Space` | `Space` |
| Zen Mode | `Alt + Z` | `⌥ + Z` |

La plupart d’entre eux ne se déclenchent que dans l’onglet ERD, et ils sont suspendus pendant l’ouverture de la recherche rapide, de la boîte de dialogue Propriétés de la table, de la visionneuse de différences, de l’aperçu de la disposition automatique, du voyage dans le temps, de la boîte de dialogue [`Export image`](./file-import-export.md#image) ou de [`Map Columns`](./relationship-editing.md#map-columns).
`Search`, `Toggle Explorer` et `Stop` font exception : `Search` ouvre ou ferme la recherche rapide depuis n’importe quel onglet, `Toggle Explorer` ouvre l’[explorateur](./explorer.md#opening-and-closing) sur sa recherche depuis n’importe quel onglet et affiche l’onglet ERD, et `Stop` est la touche qui ferme la recherche rapide, la boîte de dialogue Propriétés de la table, la visionneuse de différences, l’aperçu de la disposition automatique, le voyage dans le temps, la boîte de dialogue `Export image`, `Map Columns`, le configurateur de thème, le sélecteur `Display Language`, le sélecteur de couleur et un menu contextuel ouvert.
`Toggle Explorer` referme l’explorateur lorsqu’il est ouvert dans l’onglet ERD et n’est pas masqué par le mode zen, comme le fait le bouton `Explorer` de la barre d’outils. Si la recherche rapide, la boîte de dialogue Propriétés de la table, le configurateur de thème, le sélecteur `Display Language`, la boîte de dialogue `Export image` ou `Map Columns` est ouvert, il ferme plutôt cet élément et donne le focus clavier à la recherche de l’explorateur.
`Toggle Explorer` ne fait rien pendant la modification d’une cellule, d’un mémo ou du nom d’un groupe de tables. Lorsque la visionneuse de différences, l’aperçu de la disposition automatique ou le voyage dans le temps est ouvert, il laisse sa touche au navigateur ou à l’hôte (voir [La barre de recherche du navigateur](./find-and-replace.md#the-browsers-find-bar)).
Dans l’onglet ERD, `Stop` termine l’édition en cours d’une cellule ou d’un mémo, ferme l’éditeur de nom d’un [groupe de tables](./table-groups.md) sans renommer le groupe, ou annule une relation ou un `New Table Group` en cours de tracé, et laisse la sélection telle qu’elle est. Si rien de tout cela n’est ouvert, il efface la sélection, retire le focus de la cellule active et, du même appui, ferme un sélecteur de couleur ouvert. Un configurateur de thème ou un sélecteur `Display Language` ouvert se ferme du même appui dans tous les cas.
Un explorateur, un configurateur de thème ou un sélecteur `Display Language` ouvert ne suspend aucun des raccourcis sur le canevas. `Stop` ne ferme jamais l’explorateur. Pour ce que font `Stop` et les autres touches dans l’explorateur, voir [Touches dans l’explorateur](./explorer.md#keys-in-the-explorer), et dans le sélecteur, voir [Choisir une langue](./language-and-theme.md#picking-a-language).
`Delete Selection` supprime toutes les tables, tous les mémos et tous les groupes de tables sélectionnés, ou, lorsqu’une seule table est sélectionnée avec certaines de ses colonnes et que le zoom dépasse `70%`, ces colonnes (voir [Suppression de tables et de mémos](./table-related-functions.md#table-and-memo-deletion)). `Remove Table, Memo` supprime aussi les groupes de tables sélectionnés.
`Add Table Group` commence le tracé d’un [`New Table Group`](./table-groups.md#drawing-a-group), comme le fait le bouton `New Table Group` de la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar), et un second appui annule le tracé. `Group Selected Tables` consiste en deux appuis sans touche de modification, `T` puis `G` en moins d’une seconde. Il place les tables sélectionnées dans un nouveau groupe et ouvre son éditeur de nom, comme le fait `Group selected tables` dans le menu contextuel d’une table, et ne fait rien lorsqu’aucune table n’est sélectionnée (voir [Grouper les tables sélectionnées](./table-groups.md#grouping-selected-tables)). Aucun des deux n’a d’effet dans un éditeur en lecture seule ni lorsque les groupes sont [masqués](./table-groups.md#hiding-groups).
`Zoom In`, `Zoom Out` et `Zoom Reset` agissent aussi sur le zoom de l’onglet [Visualisation](./visualization.md#toolbar), en mode `Graph` comme en mode `Flow`, sauf si la recherche rapide est ouverte.
Dans l’onglet Visualisation, `Stop` ferme aussi le menu d’[affichage des lignes](./visualization.md#row-display) et annule une [disposition en mode Flux](./visualization.md#how-flow-is-placed) encore en cours ; il n’élargit pas une vue restreinte avec `Focus on this table`.
`Focus on this table` ouvre l’onglet Visualisation en mode `Flow`, restreint aux tables sélectionnées et à toutes les tables situées à une relation de distance, et ne fait rien lorsqu’aucune table n’est sélectionnée (voir [Se concentrer sur des tables](./visualization.md#focusing-on-tables)).
`Select All Table, Memo`, `Hand Tool`, `Delete Selection` et `Group Selected Tables` cèdent la place au point d’insertion : lorsque vous modifiez une cellule ou un mémo, ou que vous saisissez du texte dans un champ comme le champ Rechercher de l’explorateur, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) sélectionne le texte, `Space` insère un espace, `Delete` et `Backspace` effacent du texte, et `T` puis `G` saisit les deux lettres.
Copier et coller passent par les raccourcis propres au navigateur, `Ctrl + C` et `Ctrl + V` (Windows/Linux) ou `⌘ + C` et `⌘ + V` (Mac), et ne figurent donc pas dans cette liste (voir [Modification des tables](./table-editing.md)).

Les raccourcis clavier ne peuvent pas être modifiés depuis cet onglet.
Un hôte qui intègre l’éditeur les réaffecte avec [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap), à l’exception de `Editing`, `Stop`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` et `Zoom Reset`, qui sont fixes.
L’onglet `Shortcuts` liste alors les raccourcis clavier de l’hôte : une commande que l’hôte ne réaffecte pas conserve sa valeur par défaut, et une commande que l’hôte n’associe à aucune touche n’en affiche aucune.

Dans Obsidian, ces touches parviennent à l’éditeur dès que l’onglet Obsidian du diagramme est actif, même lorsqu’un raccourci Obsidian utilise la même touche, comme `Alt + Enter`, `Ctrl + K` et `Ctrl + F` (Windows/Linux) ou `⌥ + Enter`, `⌘ + K` et `⌘ + F` (Mac). Tous les autres raccourcis Obsidian continuent d’y fonctionner. Pour `Ctrl + F` ou `⌘ + F`, voir [La barre de recherche du navigateur](./find-and-replace.md#the-browsers-find-bar).
