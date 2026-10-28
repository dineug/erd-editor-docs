---
sidebar_position: 6
description: Rassembler des tables liées dans un cadre nommé et coloré affiché derrière elles ; créer, nommer, colorer, déplacer, redimensionner et supprimer des groupes, y accéder depuis l’explorateur, changer les tables qu’ils contiennent, les masquer et les conserver dans la disposition automatique, le Schéma SQL et le DBML.
---

# Groupes de tables

Un groupe de tables est un cadre nommé et coloré affiché derrière des tables liées sur le canevas ERD, pour montrer quelles tables vont ensemble.  
Une table appartient à un groupe au plus. Les groupes sont enregistrés avec le diagramme, de même que le groupe auquel appartient chaque table.

Le cadre porte en haut une barre de titre qui contient une icône de groupe, le nom du groupe en gras et, tant que le pointeur survole le groupe, un `x` qui le supprime (voir [Supprimer un groupe](#removing-a-group)). Un groupe sans nom affiche `unnamed`, et un nom trop long pour la barre est tronqué par `…`.  
Le cadre contient toujours ses tables : il garde la taille qui lui a été donnée, mais s’étire pour maintenir chaque table à l’intérieur avec une marge de `24px` autour d’elle et la barre de titre au-dessus. Une table qui s’agrandit étire le cadre avec elle, de même qu’une table déposée près d’un bord avec son centre encore à l’intérieur du cadre. Pendant le glissement de tables, le cadre ne s’agrandit ni ne rétrécit. L’étirement n’est pas enregistré : le cadre reprend sa propre taille dès que la table n’a plus besoin de cette place.

Les groupes sont affichés derrière tout le reste du canevas : tables, mémos et lignes de relation.  
Là où des groupes se chevauchent, celui sur lequel vous avez appuyé ou que vous avez ajouté en dernier s’affiche devant, et le corps d’un groupe ne recouvre jamais la barre de titre d’un autre groupe. Cet ordre n’est pas enregistré, si bien qu’un diagramme rouvert empile ses groupes dans l’ordre de leur ajout.  
Les groupes apparaissent sur le canevas ERD, dans la minicarte et dans une image exportée, et l’[explorateur](./explorer.md) les liste (voir [Aller à un groupe](#going-to-a-group)). L’onglet [Visualisation](./visualization.md) n’affiche ni les groupes ni leurs couleurs, quel que soit le mode.

Un agent de codage peut aussi créer et modifier des groupes, et lire le DDL de groupes choisis (voir [Groupes de tables](../../mcp/tools.md#table-groups) dans les outils MCP).

![Activation du tracé d’un groupe avec ⌥ + G, tracé du groupe sur orders et payments, attribution du nom Billing, dépôt de order_items dans le groupe, puis déplacement et redimensionnement du groupe](/img/demo-table-group.webp)

## Créer un groupe {#creating-a-group}

Il existe deux façons de créer un groupe, chacune avec un raccourci. Aucune n’est proposée dans un éditeur en lecture seule ni lorsque les groupes sont [masqués](#hiding-groups), et leurs raccourcis sont alors sans effet.  
Comme les autres raccourcis du canevas, ils ne fonctionnent que dans l’onglet ERD et sont suspendus pendant la modification d’une cellule, d’un mémo ou du nom d’un groupe (voir [Raccourcis](./settings.md#shortcuts)).

### Tracer un groupe {#drawing-a-group}

Cliquez sur le bouton `New Table Group` de la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar), appuyez sur `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), ou choisissez `New Table Group` dans le menu contextuel du canevas, où il suit `New Table` et `New Memo`, ou dans la [recherche rapide](./quick-search.md) de l’onglet ERD. Tracez ensuite un cadre sur le canevas en faisant glisser.  
Le bouton et le raccourci activent ou désactivent le tracé, si bien qu’appuyer sur l’un ou l’autre pendant que le tracé est actif y met fin, quelle que soit la façon dont il a été lancé ; l’entrée du menu contextuel et la recherche rapide ne font que le lancer. Son lancement désactive l’outil Main et annule le tracé en cours d’une relation.  
Tant que le tracé est actif, le curseur prend la forme d’un réticule, et un appui commence le cadre là où il se produit, même sur une table, au lieu de sélectionner ou de déplacer ce qui se trouve dessous. La barre d’outils du canevas met alors en évidence son bouton `New Table Group`, et non la main ou le pointeur.

Le relâchement ajoute un groupe dans ce cadre, d’au moins `160px` de large et `100px` de haut, barre de titre comprise, si court que soit le glissement. Un clic sans glissement ajoute un groupe de `480px` de large et `320px` de haut dont le coin supérieur gauche se trouve à l’endroit du clic.  
Toute table sans groupe dont le centre se trouve dans le nouveau cadre rejoint le groupe. Une table qui appartient déjà à un autre groupe y reste.

Le bouton central de la souris déplace toujours la vue du canevas et laisse le tracé actif. Les actions suivantes mettent fin au tracé sans ajouter de groupe :

- `Escape`, ou `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac), avant l’appui ou pendant le glissement. Avant l’appui, ces touches laissent la sélection telle quelle ; l’appui qui commence le cadre l’a déjà effacée.
- Un clic droit, qui efface la sélection. Aucun menu contextuel ne s’ouvre.
- Le passage à l’outil Main avec `Space` ou la barre d’outils du canevas, un clic sur le pointeur de la barre d’outils ou sur son bouton `New Table Group`, ou le début d’une relation.
- Le passage à un autre onglet, le masquage des groupes ou le passage de l’éditeur en lecture seule.

### Grouper les tables sélectionnées {#grouping-selected-tables}

Sélectionnez une ou plusieurs tables et appuyez sur `T` puis `G`, ou choisissez `Group selected tables` dans le menu contextuel d’une table ou `Group Selected Tables` dans la recherche rapide, qui propose cette commande tant qu’une table est sélectionnée.  
Le nouveau groupe est tracé autour des tables sélectionnées avec une marge de `24px` de chaque côté et la barre de titre au-dessus. Chaque table sélectionnée le rejoint en quittant le groupe où elle se trouvait, et le groupe qu’elle quitte demeure, même s’il est désormais vide. Les mémos de la sélection sont ignorés.

`T` puis `G` correspond à deux appuis sans touche de modification, `G` en moins d’une seconde après `T`. Sans table sélectionnée, ce raccourci ne fait rien, et dans un champ de texte, comme le champ Rechercher de l’explorateur, il saisit les deux lettres.

![Regroupement de categories et products avec T puis G, attribution du nom Catalog au groupe, puis coloration en violet depuis son menu, si bien que les deux en-têtes prennent la couleur](/img/demo-table-group-selected.webp)

Dans les deux cas, le nouveau groupe n’a ni nom ni couleur. Il est le seul sélectionné, et son éditeur de nom s’ouvre sur la barre de titre pour que vous puissiez saisir un nom immédiatement (voir [Nommer un groupe](#naming-a-group)).  
Le groupe et les tables qu’il accueille forment une seule étape d’annulation, et le nom que vous saisissez en forme une autre.

## Nommer un groupe {#naming-a-group}

Le nom d’un groupe se modifie dans un champ qui s’ouvre sur sa barre de titre. Ce champ s’ouvre de lui-même dès qu’un groupe est créé, lors d’un double-clic sur la barre de titre, et depuis `Rename` dans le menu contextuel du groupe.  
`Enter`, ou un clic ailleurs, enregistre le nom. `Escape` ferme le champ sans modifier le nom et laisse le groupe sélectionné, et un second `Escape` efface la sélection.  
Un nom modifié constitue une étape d’annulation ; valider le nom inchangé n’enregistre rien. Un nom vide ou composé uniquement d’espaces s’affiche comme `unnamed`.  
Tant que le champ est ouvert, les raccourcis du canevas sont suspendus, et les raccourcis de la recherche rapide et de `Toggle Explorer` sont sans effet, comme pendant la modification d’une cellule de table.

La fonction [Rechercher et remplacer](./find-and-replace.md#what-it-searches) recherche les noms de groupe sous `Table group names` tant que les groupes sont affichés, et ses commandes `Replace` et `Replace All` renomment les groupes (voir [Remplacer](./find-and-replace.md#replacing)). La [recherche rapide](./quick-search.md#searching-the-diagram) ne recherche pas dans les noms de groupe.

## Colorer un groupe {#coloring-a-group}

Choisissez `Color` dans le menu contextuel du groupe pour ouvrir le sélecteur de couleur sur la couleur du groupe.  
Comme pour les tables et les mémos, le sélecteur colore chaque table, mémo et groupe sélectionné, et `Remove color` dans le menu, ou `No color` dans le sélecteur, retire la couleur de tous ces éléments (voir [Couleur des tables et des mémos](./table-related-functions.md#table-and-memo-color-specification)). La couleur d’un groupe est aussi proposée sous `Document colors` dans le sélecteur.

Un groupe coloré affiche sa barre de titre et son contour dans cette couleur, et son corps dans une teinte pâle de celle-ci. Un groupe sans couleur utilise les gris neutres du thème.  
Chaque table d’un groupe coloré porte la couleur du groupe sur tout son en-tête et garde sa propre couleur sur son bord gauche, de sorte que les deux sont visibles.  
Le texte et les boutons d’un tel en-tête passent en blanc, ou en noir sur une couleur claire où le noir est bien plus lisible, tout comme le nom, l’icône et le `x` de la barre de titre du groupe. Parmi les pastilles prédéfinies du sélecteur, Orange, Ambre, Jaune et Vert citron prennent le noir, et les autres le blanc.  
Une table garde son propre en-tête lorsque son groupe n’a pas de couleur, lorsque les groupes sont masqués, à un zoom de `70%` ou moins, où les tables se réduisent à leur nom, et dans l’onglet Visualisation.

Un changement de couleur est enregistré dans l’[historique d’annulation](./undo-redo.md#one-gesture-one-step), comme pour les tables et les mémos.

## Sélectionner des groupes {#selecting-groups}

Cliquez sur la barre de titre d’un groupe pour sélectionner ce seul groupe, ou utilisez `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) pour l’ajouter à la sélection.  
Un appui sur la barre de titre d’un groupe déjà sélectionné conserve toute la sélection, si bien qu’un glissement la déplace ensuite entièrement.  
Un appui sur la barre de titre, ou un clic droit sur le groupe, fait passer le groupe devant les autres groupes et ses tables devant toutes les autres tables et tous les mémos.

Pour le bouton gauche de la souris, le corps, c’est-à-dire la zone située sous la barre de titre, se comporte comme le canevas : le faire glisser déplace la vue, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) trace un rectangle de sélection, et un clic efface la sélection. Les tables, mémos et lignes de relation situés sur le corps réagissent au pointeur comme d’habitude.

Un rectangle de sélection ne prend un groupe que s’il englobe entièrement le cadre du groupe, si bien qu’un rectangle tracé à l’intérieur d’un groupe sélectionne des tables sans le groupe (voir [Sélection multiple](./table-related-functions.md#multiple-selection)).  
`Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) ne sélectionne jamais de groupe.

`Select tables` dans le menu contextuel du groupe remplace la sélection par les tables du groupe, sans le groupe lui-même, si bien que la commande suivante n’atteint que les tables.  
Utilisez cette entrée avant les commandes qui n’agissent que sur des tables, comme la copie ou le fait de [se concentrer sur des tables](./table-related-functions.md#focusing-on-tables), qui ignorent un groupe sélectionné.

Le contour d’un groupe sélectionné prend la couleur de sélection. Dans une [session collaborative](../../api/advanced/collaborative-editing.md), un groupe sélectionné par un autre participant est entouré de la couleur de ce participant.

## Aller à un groupe {#going-to-a-group}

L’[explorateur](./explorer.md#the-tree) liste les groupes dans son dossier `Table Groups`, par nom, chacun avec ses tables en dessous. La recherche rapide ne liste aucun groupe.

Choisir la ligne d’un groupe dans l’explorateur, une correspondance de [Rechercher et remplacer](./find-and-replace.md#going-to-a-match) dans le nom d’un groupe, ou la ligne d’un groupe dans la liste de la [visionneuse de différences](./table-related-functions.md#the-change-tree) mène à ce groupe.  
La vue se déplace alors pour montrer le cadre du groupe, en se calant sur sa barre de titre lorsque le cadre est plus haut que le canevas (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)). Le groupe devient ensuite le seul sélectionné et passe au premier plan avec ses tables, comme lors d’un appui sur sa barre de titre.  
Lorsque les groupes sont [masqués](#hiding-groups), ou une fois le groupe supprimé, aller à ce groupe est sans effet.  
Dans la visionneuse de différences, chaque côté ne va au groupe que si son propre document le contient et l’affiche (voir [Aller à une modification](./table-related-functions.md#going-to-a-change)).

## Déplacer et redimensionner un groupe {#moving-and-resizing-a-group}

Faites glisser un groupe par sa barre de titre pour le déplacer avec toutes ses tables.  
Si le groupe fait partie d’une sélection plus large, toute la sélection se déplace avec lui, et une table à la fois sélectionnée et membre du groupe ne se déplace qu’une fois.  
Le glissement ne commence qu’une fois que le pointeur s’est un peu déplacé, si bien qu’un clic ou un double-clic sur la barre de titre reste un clic. `Alt + drag` sur une barre de titre déplace le groupe comme un glissement ordinaire ; un groupe n’est jamais dupliqué.  
Le déplacement, avec toutes les tables qu’il emporte, constitue une seule étape d’annulation.

Faire glisser une table seule ne déplace que cette table, et peut la faire entrer dans un groupe ou en sortir (voir [Ajouter et retirer des tables](#adding-and-removing-tables)).

Chaque groupe, sélectionné ou non, a des poignées de redimensionnement sur ses quatre bords et ses quatre coins, comme un mémo.  
Faites-en glisser une avec le bouton gauche de la souris : le cadre suit le pointeur, et la nouvelle taille est enregistrée lorsque vous relâchez, en une seule étape d’annulation.  
Un groupe ne peut pas être rendu plus petit que `160px` sur `100px`, ni plus petit que ses tables avec leur marge de `24px` et la barre de titre. Le bord s’arrête là, aussi loin que le pointeur aille.

## Ajouter et retirer des tables {#adding-and-removing-tables}

Une table rejoint ou quitte un groupe selon l’endroit où vous la déposez.  
Lorsque vous faites glisser des tables puis relâchez, chaque table déplacée qui n’est pas emportée par un groupe sélectionné est évaluée d’après son centre. Elle rejoint le groupe du dessus dont le cadre contient son centre, ou quitte son groupe si son centre ne se trouve dans le cadre d’aucun groupe. Le groupe du dessus est celui qui s’affiche devant.  
Un groupe que le glissement laisse en place garde le cadre qu’il avait au début du glissement, si bien qu’une table légèrement déplacée au sein de son propre groupe y reste, et qu’il faut la faire glisser jusqu’à ce que son centre soit hors de ce cadre pour qu’elle le quitte.  
Pendant le glissement, chaque groupe dans lequel le dépôt ferait entrer une table est entouré d’un contour.

Si vous relâchez moins de `200ms` environ après le dernier mouvement, le changement de groupe fait partie de l’étape d’annulation du glissement, si bien qu’une seule annulation remet les tables à leur place et dans les groupes où elles se trouvaient. Après une pause plus longue avant de relâcher, le changement de groupe constitue une étape distincte (voir [Un geste, une étape](./undo-redo.md#one-gesture-one-step)).  
Un clic, ou un glissement de quelques pixels, ne change rien aux groupes, et aucune table ne change de groupe lorsque les groupes sont masqués.

Les autres façons de changer les tables que contient un groupe :

- `Remove from group` dans le menu contextuel d’une table retire chaque table sélectionnée de son groupe. Cette entrée s’affiche lorsqu’une table sélectionnée appartient à un groupe, même lorsque les groupes sont masqués, et constitue une seule étape d’annulation.
- `Group selected tables` place les tables sélectionnées dans un nouveau groupe (voir [Grouper les tables sélectionnées](#grouping-selected-tables)).
- Supprimer un groupe laisse ses tables sans groupe.

Une table collée ou dupliquée avec `Alt` n’appartient à aucun groupe, même lorsqu’elle arrive dans le cadre d’un groupe. La faire glisser ensuite applique la règle de dépôt.

## Supprimer un groupe {#removing-a-group}

Supprimer un groupe ne supprime jamais ses tables : elles restent où elles sont, sans groupe.

- Le `x` au bout de la barre de titre, qui s’affiche tant que le pointeur survole le groupe, supprime ce seul groupe.
- `Delete` dans le menu contextuel du groupe supprime le groupe. Lorsque le groupe fait partie de plusieurs éléments sélectionnés, l’entrée devient `Delete selected` et supprime tout ce qui est sélectionné : tables, mémos et groupes.
- Lorsque des groupes sont sélectionnés, `Delete` ou `Backspace` supprime les groupes sélectionnés ainsi que les tables et mémos sélectionnés, tout comme `Ctrl + Backspace` et `Ctrl + Delete` (Windows/Linux) ou `⌘ + Backspace` et `⌘ + Delete` (Mac) (voir [Suppression de tables et de mémos](./table-related-functions.md#table-and-memo-deletion)).

Chaque suppression constitue une seule étape d’annulation, qui fait revenir le groupe avec ses tables.

## Le menu du groupe {#the-group-menu}

Cliquez avec le bouton droit sur la barre de titre, le corps ou le bord d’un groupe pour ouvrir son menu. Sur Mac, `Ctrl + click` l’ouvre aussi, de même qu’un appui long sur un écran tactile.  
Le clic droit sélectionne d’abord le groupe, seul sauf s’il fait déjà partie de la sélection, si bien que `Color` et `Delete selected` n’atteignent le reste de la sélection que si le groupe en faisait partie.

- `Select tables` : sélectionne uniquement les tables du groupe (voir [Sélectionner des groupes](#selecting-groups)).
- `Rename` : ouvre l’éditeur de nom (voir [Nommer un groupe](#naming-a-group)).
- `Color` : ouvre le sélecteur de couleur (voir [Colorer un groupe](#coloring-a-group)).
- `Remove color` : affiché lorsqu’un élément sélectionné a une couleur.
- `Delete`, ou `Delete selected` lorsque le groupe fait partie de plusieurs éléments sélectionnés, avec la touche `Delete` indiquée à droite (voir [Supprimer un groupe](#removing-a-group)).

Le menu contextuel d’une table ajoute `Group selected tables` et `Remove from group` après `Color` et `Remove color`, avant son entrée Delete, et le menu contextuel du canevas ajoute `New Table Group`.  
`Group selected tables` affiche ses touches, `T` puis `G`, à droite, et `New Table Group` affiche `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac).

## Masquer les groupes {#hiding-groups}

`View Option` → `Table Groups` dans le menu contextuel du canevas affiche ou masque tous les groupes. Cette option est cochée par défaut (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options)).  
Une fois l’option décochée, les cadres des groupes et les couleurs de groupe sur les en-têtes de table disparaissent du canevas, de la minicarte et des images exportées, et les barres de défilement et la minicarte ne réservent plus de place aux groupes. Rien n’est déplacé ni redimensionné, et chaque table reste dans son groupe.  
Masquer les groupes les désélectionne, met fin à un tracé `New Table Group` et ferme un éditeur de nom ouvert.

Lorsque les groupes sont masqués :

- `New Table Group` et `Group selected tables` ne sont pas proposés dans les menus, ni `New Table Group` et `Group Selected Tables` dans la recherche rapide, et la barre d’outils du canevas n’affiche pas son bouton `New Table Group`. `Remove from group` reste proposé.
- `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) et `T` puis `G` sont sans effet.
- Faire glisser des tables ne change rien aux groupes, et un rectangle de sélection ne prend aucun groupe.
- L’explorateur n’affiche pas son dossier `Table Groups`, et la fonction Rechercher et remplacer ne trouve ni ne remplace les noms de groupe, même avec `Table group names` activé.
- La [disposition automatique](#auto-layout) garde toujours ensemble les tables de chaque groupe, l’onglet Schéma SQL propose toujours les [groupes au choix](#schema-sql-by-group), le DBML les écrit toujours, et [Importer et ajouter](./file-import-export.md#import-and-add) place toujours les éléments ajoutés sous les cadres masqués.

Ce choix est enregistré dans le document et consigné dans l’[historique d’annulation](./undo-redo.md#what-the-history-records), comme les autres options d’affichage. Dans un éditeur en lecture seule, il reste en revanche sur cet écran (voir [Éditeurs en lecture seule](#read-only-editors)).

## Disposition automatique {#auto-layout}

Chaque mode de [disposition automatique](./table-related-functions.md#auto-layout) garde ensemble les tables de chaque groupe, que les groupes soient affichés ou non.

- `Force` déplace chaque groupe avec ses tables comme un seul cadre, les tables gardant leur place à l’intérieur, et maintient le cadre de chaque groupe à `100px` au moins des autres groupes et des tables sans groupe. L’aperçu montre chaque groupe à sa destination.
- `Flow`, `Tree - vertical` et `Tree - horizontal` disposent les tables de chaque groupe à l’intérieur du groupe et placent les groupes selon les relations qui les relient, les tables sans groupe étant disposées autour d’eux.

Ensuite, chaque groupe qui contient des tables est ajusté à celles-ci : son cadre devient le rectangle qui les englobe, avec une marge de `24px` et la barre de titre. Un groupe sans tables garde sa place et sa taille.  
Les tables et les groupes sont placés en une seule étape d’annulation.

Une importation DBML ajuste de la même façon chaque groupe autour de ses tables, où qu’elles soient placées (voir [DBML](./file-import-export.md#dbml)).

## Schéma SQL par groupe {#schema-sql-by-group}

L’onglet [Schéma SQL](./schema-sql.md) peut écrire uniquement les tables des groupes choisis.  
Tant que le document contient un groupe, affiché ou masqué, son panneau des options affiche une ligne `Tables` sous `This window only`, avec une case pour `All`, une pour chaque groupe et une pour `No group`, c’est-à-dire les tables sans groupe (voir [Tables](./schema-sql.md#tables)).  
Ce choix est propre à la fenêtre de l’éditeur et n’est pas enregistré dans le document.

## Importation, exportation et copie {#import-export-and-copying}

- Le DBML transporte les groupes dans les deux sens. Une importation DBML transforme chaque bloc `TableGroup` en groupe (voir [DBML](./file-import-export.md#dbml)), et la cible `DBML` du générateur de code écrit un bloc `TableGroup` pour chaque groupe qui contient une table (voir [Générateur de code](./code-generator.md#language)).
- Un fichier JSON conserve ses groupes. Aucun autre format ne les transporte : les importations SQL, GraphQL et AML n’en apportent aucun, et le Schéma SQL et les autres cibles du générateur de code n’en écrivent aucun.
- [Importer et ajouter](./file-import-export.md#import-and-add) importe les groupes d’un fichier comme de nouveaux groupes contenant leurs tables, et les sélectionne avec les nouvelles tables lorsque les groupes sont affichés, si bien que faire glisser le bloc ajouté emporte ses groupes.
- Une [image exportée](./file-import-export.md#image) montre les groupes affichés derrière les tables, avec les couleurs de groupe sur leurs en-têtes.
- Le copier-coller, ou la duplication avec `Alt`, ne copie jamais de groupe (voir [Copier-coller des tables et des mémos](./table-related-functions.md#copyingpasting-tables-and-memos) et [Ajouter et retirer des tables](#adding-and-removing-tables)).

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), les groupes sont affichés et listés dans l’explorateur comme d’habitude, et il est possible d’y accéder, mais pas de les modifier :

- [Aller à un groupe](#going-to-a-group) le sélectionne, et c’est la seule façon de sélectionner un groupe à cet endroit. Un appui sur une barre de titre ne sélectionne rien et ne déplace rien : glissé, il déplace la vue du canevas, et un clic immobile retire la sélection qu’un saut a laissée.
- Il n’y a ni poignées de redimensionnement ni `x`, et un double-clic sur la barre de titre n’ouvre pas d’éditeur de nom.
- Un clic droit sur un groupe n’ouvre aucun menu, et le menu de table ne contient que `Table Properties`.
- Le menu du canevas n’a pas de `New Table Group`, et la recherche rapide ne liste aucune des deux commandes de groupe. Un tracé `New Table Group` prend fin lorsque l’éditeur passe en lecture seule.
- La [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar) ne conserve que ses commandes d’affichage, si bien qu’elle n’a pas de bouton `New Table Group`, et `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) et `T` puis `G` sont sans effet.
- Un glissement de tables ou d’un groupe en cours quand l’éditeur passe en lecture seule s’arrête là où il est et ne change aucun groupe, et un redimensionnement de groupe en cours prend fin sans changer la taille.
- `View Option` → `Table Groups` affiche ou masque les groupes sur cet écran seulement, comme toute option d’affichage à cet endroit : le document, les collaborateurs et l’historique d’annulation gardent le choix tel qu’il était, et redonner la modification à l’éditeur remet le choix du document.
- Le choix `Tables` de l’onglet Schéma SQL fonctionne toujours.
