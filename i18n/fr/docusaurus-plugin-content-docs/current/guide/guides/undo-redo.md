---
sidebar_position: 15
description: Annuler et rétablir des modifications, ce que l’historique enregistre, les historiques propres aux feuilles du dictionnaire, et parcourir pas à pas l’historique du diagramme avec le voyage dans le temps.
---

# Annuler et rétablir

Vous pouvez revenir à un état d’édition antérieur ou avancer vers un état ultérieur.  
L’historique conserve jusqu’à `2048` modifications.

- Annuler : `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Rétablir : `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

Dans l’onglet ERD, la barre d’outils propose les deux mêmes commandes sous la forme des boutons `Undo` et `Redo`, à côté de `Time Travel`. Dans l’onglet Dictionnaire, elle affiche `Undo` et `Redo` sans `Time Travel`, et aucun autre onglet ne les affiche.  
Ils ne sont actifs que lorsqu’il y a quelque chose à annuler ou à rétablir. Un éditeur `readonly` les masque, ainsi que `Time Travel`, et les raccourcis n’y annulent ni ne rétablissent rien.

Annuler et Rétablir n’agissent sur l’historique du diagramme que dans l’onglet ERD.  
Les raccourcis y sont inactifs tant que la recherche rapide, `Table Properties`, `Diff Viewer`, l’aperçu de `Auto Layout`, la boîte de dialogue [`Export image`](./file-import-export.md#image), [Associer les colonnes](./relationship-editing.md#map-columns) ou le voyage dans le temps est ouvert.  
Ils continuent de fonctionner tant que le focus clavier se trouve n’importe où dans l’[explorateur](./explorer.md#keys-in-the-explorer), arborescence comprise, et tant que le [sélecteur de couleur](./table-related-functions.md#table-and-memo-color-specification) est ouvert. Même lorsque le point d’insertion se trouve dans l’un de leurs champs, comme Rechercher, Remplacer ou `Hex`, ils annulent et rétablissent les modifications du diagramme plutôt que celles du texte du champ.

Dans les autres onglets :

- Dictionnaire : ils annulent et rétablissent les modifications de la feuille affichée, `Domains`, `Words` ou `Terms`, à partir de l’historique propre de cette feuille, jamais de celui du diagramme. Dans la feuille `Checks`, ils ne font rien (voir [Feuilles du dictionnaire](#dictionary-sheets)).
- Visualisation : en mode `Flow`, les mêmes touches reviennent en arrière et avancent parmi ce qu’a affiché le mode Flux, comme le font `Previous table` et `Next table`, y compris dans un éditeur `readonly`. Elles n’y annulent ni ne rétablissent jamais rien dans le diagramme (voir [Table précédente et table suivante](./visualization.md#previous-table-and-next-table)). En mode `Graph`, elles ne font rien.
- Schéma SQL, Générateur de code et Paramètres : ils sont indisponibles. Dans les champs `Before tables` et `After tables` de l’onglet Schéma SQL, les mêmes touches annulent et rétablissent plutôt votre saisie dans le champ.

L’historique est conservé en mémoire pour la session en cours. Il n’est pas enregistré dans le document, si bien qu’un diagramme rouvert démarre avec un historique vide.

![Déplacement d’une table et suppression d’une colonne avec ⌥ + Backspace, puis annulation des deux avec ⌘ + Z et rétablissement avec ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Ce que l’historique enregistre {#what-the-history-records}

Sont enregistrés :

- Tables et mémos : ajout, suppression, déplacement et couleur ; nom, nom logique et commentaire d’une table ; texte et taille d’un mémo.
- Groupes de tables : ajout, suppression, déplacement, redimensionnement, nom, couleur et groupe auquel appartient chaque table (voir [Groupes de tables](./table-groups.md)).
- Colonnes : ajout, suppression, réorganisation, nom logique, domaine auquel chacune est liée et toutes les options de colonne.
- Les noms physiques que dérivent les dictionnaires, et le fait que chaque nom soit personnel ou dérivé par les dictionnaires : une seule annulation restaure ensemble un nom et cet état (voir [Vos propres noms](./dictionary.md#names-of-your-own)).
- `Derive Physical Name Again` et `Derive Physical Names Again` (voir [Dériver à nouveau les noms physiques](./dictionary.md#derive-physical-names-again)).
- Relations : ajout, suppression, changement de type, colonnes définies dans [Associer les colonnes](./relationship-editing.md#map-columns) et chaque choix dans `On Delete` ou `On Update` (voir [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update)). Annuler une suppression fait revenir la relation avec ses actions ON DELETE et ON UPDATE.
- Index et leurs colonnes.
- Position de la vue, niveau de zoom et options de `View Option`.
- Les scripts `Before tables` et `After tables` de l’onglet Schéma SQL, à raison d’une étape par modification appliquée en quittant le champ (voir [Scripts avant et après les tables](./schema-sql.md#before-and-after-scripts)).
- L’importation d’un fichier, et l’ajout d’un fichier avec [`Import and Add`](./file-import-export.md#import-and-add).

Ne sont pas enregistrés :

- Le SGBD et le nom de la base de données.
- Le langage du générateur de code, `Table Name Case` et `Column Name Case`.
- Le type de délimiteur, qu’il soit défini dans l’onglet Schéma SQL ou dans l’onglet Générateur de code.
- Les choix `Statements`, `Header`, `Write logical names into empty comments` et `Tables` de l’onglet Schéma SQL, qui appartiennent à la fenêtre de l’éditeur (voir [Panneau des options](./schema-sql.md#options-panel)).
- Tout le contenu de l’onglet Paramètres, lignes [`Lock`](./settings.md#lock) comprises.
- Le changement de vue de l’affichage des noms, depuis n’importe lequel de ses emplacements, que son verrou soit activé ou désactivé (voir [Changer de vue](./logical-names.md#switching-the-view)).
- Le thème et la langue d’affichage (voir [Langue et thème](./language-and-theme.md)).
- Quelle table, quel mémo ou quel groupe s’affiche devant les autres.
- L’[explorateur](./explorer.md) : son ouverture, sa fermeture ou son redimensionnement, le repli de son arborescence, ainsi que le texte et les options de recherche. Ce que modifient `Replace` et `Replace All` est toutefois enregistré, tout comme le défilement que produit un « aller à » (voir [Un geste, une étape](#one-gesture-one-step)).
- Le zoom et le déplacement de la vue dans l’onglet Visualisation, quel que soit le mode, le déplacement des nœuds du graphe ou des cartes du mode Flux, `Tidy Up`, l’affichage des lignes, la concentration sur des tables et le parcours avec `Previous table` et `Next table` (voir [Le mode Flux ne modifie jamais le document](./visualization.md#flow-never-edits-the-document)).
- La feuille affichée de l’onglet Dictionnaire, ainsi que la recherche, la sélection, le défilement et les largeurs de colonne de chaque feuille (voir [Ouvrir l’onglet](./dictionary.md#opening-the-tab)).

Aucun de ces changements ne peut être annulé.

Un éditeur en lecture seule n’enregistre rien du tout. La position de la vue, le zoom et les bascules de `View Option` y changent encore, de même que l’onglet, l’affichage des noms, le SGBD et les paramètres de code, mais sur cet écran seulement, si bien qu’il n’y a rien à annuler (voir [Éditeurs en lecture seule](./settings.md#read-only-editors) dans Paramètres).

Les modifications effectuées dans l’onglet Dictionnaire peuvent être annulées, mais elles vont dans l’historique de leur propre feuille plutôt que dans celui-ci, si bien qu’Annuler dans l’onglet ERD n’en défait jamais aucune, pas même le nouveau `Data Type` d’un domaine et les types de colonne qu’il modifie (voir [Feuilles du dictionnaire](#dictionary-sheets)).

Les modifications provenant d’un autre éditeur ne sont pas enregistrées non plus, si bien qu’Annuler ne revient que sur les vôtres. Dans une [session collaborative](../../api/advanced/collaborative-editing.md), chaque éditeur annule ses propres modifications, et un agent de codage qui modifie le diagramme via le [serveur MCP](../../mcp/live-and-headless.md#undo) annule les siennes avec `erd_undo`.

Annuler un `Import`, qui remplace tout le diagramme, ramène le diagramme précédent tel que l’éditeur le contenait au moment de l’importation, avec chaque [verrou](./settings.md#lock) activé ou désactivé et chaque valeur verrouillée tels qu’ils étaient alors.  
Si `Viewport` était verrouillé dans ce diagramme, la vue et le zoom reviennent à la vue verrouillée, celle où s’ouvre le diagramme, plutôt qu’à l’endroit où vous vous trouviez. Si son `Viewport` était déverrouillé, ils reviennent à l’endroit où vous vous trouviez au moment de l’importation. Les autres paramètres verrouillés, comme l’onglet où vous vous trouvez, le langage du générateur de code ou l’affichage des noms, restent tels qu’ils sont sur votre écran.  
Un nouveau diagramme démarre avec tous les verrous activés. Déverrouillez `Viewport` avant d’importer pour conserver votre vue lors d’une telle annulation. Le déverrouiller après coup, ou importer un fichier JSON dont le propre verrou `Viewport` est désactivé, ne change pas l’endroit où l’annulation vous ramène.

Annuler l’importation d’un fichier JSON fait aussi revenir les mots, les termes et les domaines du diagramme précédent. Une importation Schéma SQL, GraphQL, DBML ou AML conserve les dictionnaires, si bien que son annulation et son rétablissement les laissent tels qu’ils sont, modifications effectuées depuis dans l’onglet Dictionnaire comprises.

Une annulation ou un rétablissement dans l’onglet ERD qui lie de nouveau une colonne à un domaine, ou qui fait revenir une colonne liée à un domaine, donne à la colonne le type de données actuel du domaine. Si l’un ou l’autre remet un autre type sur une colonne liée, il la délie (voir [Domaines et types de données](./dictionary.md#domains-and-data-types)).

## Un geste, une étape {#one-gesture-one-step}

Tout ce que déclenche un même geste devient une seule entrée de l’historique.  
Coller plusieurs tables et mémos à la fois, ou les dupliquer avec `Alt + drag`, s’annule en une seule étape.

Un appui sur `Delete` ou `Backspace`, ou l’entrée `Delete selected` ou `Delete columns` d’un menu contextuel, constitue une seule étape, quel que soit le nombre de tables, de mémos, de groupes de tables ou de colonnes supprimés.  
Activer ou désactiver la clé primaire sur plusieurs colonnes sélectionnées constitue une seule étape, que ce soit avec `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac) ou avec `Primary Key on selected columns` dans le menu contextuel d’une table.  
Définir la couleur de la sélection, ou la retirer avec `No color` ou `Remove color`, constitue une seule étape, quel que soit le nombre de tables, de mémos et de groupes sélectionnés. Choisir une couleur que possèdent déjà tous les éléments sélectionnés n’enregistre aucune étape, pas plus que `No color` lorsqu’aucun élément sélectionné n’a de couleur.  
`Map` ou `Save` dans [Associer les colonnes](./relationship-editing.md#map-columns) constitue une seule étape, y compris les colonnes de clé étrangère qu’il ajoute et les types de données qu’il modifie.  
`Import and Add` constitue une seule étape, y compris le défilement qui amène le bloc ajouté dans la vue lorsqu’il en faut un.

Choisir un terme dans la liste sous une cellule du nom logique constitue une seule étape : le nom logique, le nom physique qu’il dérive et, pour une colonne, le domaine du terme avec son type de données (voir [Saisie semi-automatique des termes](./logical-names.md#completing-term-names)).  
Choisir un domaine dans la cellule Domaine d’une colonne constitue une seule étape, avec le type de données qu’il donne à la colonne et ce que la [synchronisation du type de données des relations](./settings.md#relationship-datatype-sync) propage le long des relations. Choisir `None`, qui délie la colonne, constitue aussi une seule étape (voir [La cellule Domaine](./logical-names.md#the-domain-cell)). Saisir dans une colonne liée un type de données autre que celui de son domaine délie la colonne dans l’étape de cette saisie.  
`Derive Physical Name Again` ou `Derive Physical Names Again` constitue une seule étape, quel que soit le nombre de noms, de liens de domaine et de types de données qu’il modifie. Ce n’est que lorsqu’il ne change rien qu’il n’enregistre aucune étape. Rendre un nom personnel aux dictionnaires constitue une modification, même lorsque le nom contient déjà ce qu’ils donnent.

Créer un [groupe de tables](./table-groups.md), en le traçant ou en regroupant les tables sélectionnées avec `Group selected tables` ou `T` puis `G`, constitue une seule étape avec toutes les tables qu’il accueille. Supprimer un groupe constitue une seule étape, et annuler cette suppression fait revenir le groupe avec ses tables.  
Faire glisser un groupe par sa barre de titre déplace le groupe et toutes ses tables en une seule étape. Les tables déposées dans un groupe ou sorties d’un groupe changent de groupe dans la même étape que leur glissement si vous relâchez moins de `200ms` environ après le dernier mouvement, si bien qu’une seule annulation les remet à leur place et dans les groupes où elles se trouvaient. Après une pause plus longue avant de relâcher, le changement de groupe constitue une étape distincte, et la première annulation ne défait que lui.  
Le redimensionnement d’un groupe par un bord ou un coin est enregistré une seule fois, lorsque vous relâchez.  
Appliquer la [disposition automatique](./table-related-functions.md#auto-layout) constitue une seule étape, ajustement des groupes autour de leurs tables compris.

`Replace All` dans [Rechercher et remplacer](./find-and-replace.md#replacing) constitue lui aussi une seule étape, quel que soit le nombre de noms de table, de noms de colonne, de noms logiques, de noms d’index, de noms de groupe de tables, de commentaires et de mémos modifiés, noms physiques et liens de domaine que dérivent les noms logiques compris. Lorsqu’il ne change rien, comme lorsque `Preserve Case` réécrit chaque correspondance à l’identique, il n’enregistre aucune étape.  
Un `Replace` isolé constitue une seule étape, y compris ce que dérive un nom logique et le défilement jusqu’à la correspondance suivante lorsque celle-ci en nécessite un. Lorsqu’il réécrit sa correspondance à l’identique, il n’enregistre que ce défilement, ou rien s’il n’y en a pas.  
Aller à une correspondance ne fait défiler le canevas que si la correspondance n’est pas déjà bien visible (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)). Ce défilement est enregistré comme tout autre changement de position de la vue, si bien qu’après un parcours des correspondances, Annuler défait d’abord ces défilements, un par étape.  
Les autres « aller à » qui aboutissent sur le canevas enregistrent leurs défilements de la même façon : choisir une ligne dans l’explorateur, un résultat de la recherche rapide, une vérification de la feuille `Checks` de l’onglet Dictionnaire qui désigne une table ou une colonne, ou le [bouton de carte](./visualization.md#card-buttons) de lien externe en mode Flux. Un « aller à » qui laisse la vue en place n’enregistre rien. Choisir une ligne dans la liste de `Diff Viewer` n’enregistre rien non plus, puisque cela ne déplace que les côtés en lecture seule propres à la visionneuse de différences.

Un glissement continu, un déplacement de la vue du canevas, un zoom, un pincement ou un changement de couleur est mis en mémoire tampon pendant `200ms` environ et forme lui aussi une seule entrée.  
Un glissement de moins de `20px` au total n’enregistre aucun déplacement. Seul le changement de groupe qu’il entraîne, le cas échéant, est enregistré.

Dans une cellule ou un mémo, la saisie est enregistrée entrée par entrée plutôt que geste par geste : chaque caractère saisi, chaque collage et chaque étape d’une composition IME constitue une étape distincte.  
Une cellule du nom logique est enregistrée de la même façon. Lorsque son éditeur se ferme sur un nom logique différent de celui avec lequel il s’est ouvert, le nom physique que les dictionnaires en dérivent constitue une étape supplémentaire après la saisie. La première annulation ne défait que ce nom, avec le domaine et le type de données qu’a apportés un terme, et laisse le nom logique que vous avez saisi. Lorsque rien n’est dérivé, rien de plus n’est enregistré (voir [Écrire un nom logique](./logical-names.md#writing-a-logical-name)).  
Le nom d’un groupe de tables est enregistré une seule fois, lorsque `Enter` ou la sortie du champ le valide, si bien que le nom saisi dans un groupe que vous venez de créer constitue une étape distincte de sa création. `Esc`, ou un nom laissé inchangé, n’enregistre rien.

## Feuilles du dictionnaire {#dictionary-sheets}

Les feuilles `Domains`, `Words` et `Terms` de l’onglet Dictionnaire conservent chacune leur propre historique, distinct de celui du diagramme. Chaque modification effectuée dans l’onglet va dans l’historique de la feuille dont elle écrit les lignes. Comme celui du diagramme, chaque historique conserve jusqu’à `2048` étapes et réside en mémoire pour la session.

- Lorsque le focus clavier se trouve dans l’onglet, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) annule la dernière modification de la feuille affichée, et `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac) rétablit la dernière modification annulée.
- Les boutons `Undo` et `Redo` de la barre d’outils font de même, et ne sont actifs que lorsque la feuille affichée a une modification à annuler ou à rétablir. Appuyer dessus laisse le focus clavier là où il était, dans la grille ou dans le champ de recherche. L’onglet n’a pas de `Time Travel`.
- Dans la feuille `Checks`, où rien n’est modifié, les boutons restent inactifs, et ni eux ni les touches n’ont d’effet.
- Lorsqu’une modification de cellule est ouverte, ou que le point d’insertion se trouve dans le champ de recherche de l’onglet, les touches annulent et rétablissent plutôt votre saisie à cet endroit.

Les historiques ne se croisent jamais. Annuler dans l’onglet ERD ne défait jamais une modification d’une feuille, et Annuler dans une feuille ne défait jamais une modification d’une autre feuille ni du diagramme. Chaque feuille conserve son historique lorsque vous changez de feuille ou d’onglet.

Chacun des éléments suivants constitue une seule étape de sa feuille :

- Une modification de cellule, enregistrée une seule fois lorsqu’elle est écrite plutôt qu’à chaque caractère saisi, et seulement lorsqu’elle change la valeur (voir [Modifier les cellules](./dictionary.md#editing-cells)).
- Un collage, lignes qu’il ajoute comprises, et l’effacement des cellules sélectionnées avec `Delete` ou `Backspace` (voir [Copier et coller](./dictionary.md#copying-and-pasting)).
- `Add Row`, et chaque insertion ou suppression de lignes, depuis la barre, le menu de la grille ou les touches, quel que soit le nombre de lignes concernées (voir [Ajouter et supprimer des lignes](./dictionary.md#adding-and-deleting-rows)).
- Le domaine d’un terme choisi dans sa liste, `None` compris (voir [Le domaine d’un terme](./dictionary.md#a-terms-domain)).
- Un tri (voir [Trier](./dictionary.md#sorting)).
- Un fichier CSV importé avec `Import CSV`, quel que soit le nombre de lignes qu’il ajoute ou met à jour. Il constitue une étape de la feuille que le fichier remplit, que l’onglet affiche alors, quelle que soit la feuille depuis laquelle vous l’avez importé (voir [Importer](./dictionary.md#importing)).

Une écriture qui ne change rien, comme le même fichier importé de nouveau ou le tri d’une feuille déjà dans cet ordre, n’enregistre aucune étape, pas plus qu’une écriture refusée avec une notification `Nothing saved: …`. Lorsqu’un terme sans `Physical Name` reçoit un nom, le nom physique que composent ses mots fait partie de l’étape de cette modification.

Le nouveau `Data Type` d’un domaine constitue une seule étape de la feuille `Domains`, avec les types qu’il donne aux colonnes liées au domaine et à celles que la synchronisation du type de données des relations atteint à partir de ces colonnes (voir [Domaines et types de données](./dictionary.md#domains-and-data-types)).  
L’annuler ou le rétablir modifie le type des colonnes liées au domaine à ce moment-là, si bien qu’une colonne que vous avez depuis liée à un autre domaine ou dont vous avez changé le type conserve son type. Une colonne que l’étape a déliée, comme une clé étrangère que la synchronisation a retirée d’un domaine qui lui était propre, n’est liée de nouveau que si elle est encore déliée et qu’elle a encore le type que l’étape lui a laissé.

Un éditeur `readonly` masque les boutons, et les touches n’y annulent ni ne rétablissent rien.  
Les modifications des collaborateurs et des agents de codage ne sont pas non plus enregistrées dans l’historique d’une feuille.

L’historique de chaque feuille est vidé lorsque les dictionnaires sont remplacés : par un `Import` d’un fichier JSON, le vôtre ou celui d’un collaborateur, par son annulation ou son rétablissement, et par le chargement d’un autre diagramme dans l’éditeur. Un `Import` Schéma SQL, GraphQL, DBML ou AML conserve les dictionnaires, et avec eux l’historique de chaque feuille, y compris lors de son annulation et de son rétablissement.

## Voyage dans le temps {#time-travel}

Le voyage dans le temps s’ouvre avec le bouton `Time Travel` de la barre d’outils, à côté d’Annuler et de Rétablir dans l’onglet ERD.  
Le bouton est sans effet tant que l’historique du diagramme ne compte aucune modification enregistrée. Un éditeur en lecture seule n’affiche pas ce bouton, et un éditeur qui passe en lecture seule ferme le voyage dans le temps sans l’appliquer.

Le voyage dans le temps ouvre une copie distincte du diagramme, en lecture seule, à la position de défilement, au niveau de zoom et dans l’[affichage des noms](./logical-names.md#name-view) qu’affiche le canevas, que le verrou `Viewport` ou `Name View` soit activé ou non.  
Il ne parcourt que l’historique du diagramme, si bien que les modifications des feuilles du dictionnaire ne figurent pas parmi ses points.  
Faites glisser le curseur, ou cliquez n’importe où sur sa piste, pour parcourir tout l’historique des modifications et prévisualiser chaque point. La position la plus à gauche du curseur correspond à l’état situé une étape avant la première modification enregistrée, et il s’ouvre avec sa poignée sur l’état actuel.  
L’aperçu est inerte : il dessine une minicarte, mais vous ne pouvez ni y déplacer la vue, ni le faire défiler, ni le modifier, et le document réel reste intact tant que vous n’appliquez pas.

Appuyez sur `Apply` pour restaurer le point sélectionné, ou sur `Cancel` ou `Esc` pour laisser le document inchangé.

![Ouverture du voyage dans le temps, glissement du curseur en arrière dans la session et application d’un point antérieur](/img/demo-time-travel.webp)
