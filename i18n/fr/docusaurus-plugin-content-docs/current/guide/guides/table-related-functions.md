---
sidebar_position: 4
description: Sélectionner, déplacer, copier, dupliquer et supprimer des tables et des mémos, régler les couleurs et les options d’affichage, définir des index et des clés alternatives, choisir une base de données, se déplacer sur le canevas infini et comparer des documents.
---

# Fonctions liées aux tables

Tout ce que vous faites sur les tables et les mémos une fois créés (sélection, déplacement, copie, suppression, couleur et choix de ce qu’affiche le canevas), ainsi que les commandes du canevas qui les entourent.  
Les commandes des tables et des mémos viennent d’abord ; puis les propriétés de la table, la fonction Se concentrer sur des tables, les index et les clés alternatives, la disposition automatique et le SGBD ; et enfin le canevas lui-même : la barre d’outils du canevas, le zoom, le déplacement de la vue et l’endroit où aboutit un saut, et la visionneuse de différences.  
Les groupes de tables, ces cadres qui rassemblent des tables, ont leur propre page (voir [Groupes de tables](./table-groups.md)).

## Sélection multiple {#multiple-selection}

Trois méthodes sont prises en charge :

- `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac)
- `Ctrl + A` ou `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` ou `⌘ + ⌥ + A` (Mac)

Les mémos se sélectionnent de la même manière, et chacun des deux raccourcis pour tout sélectionner prend d’un coup toutes les tables et tous les mémos. Les mémos masqués avec View Option → `Memos` ne sont sélectionnés ni par ces raccourcis ni par un rectangle de sélection (voir [Options d’affichage des tables](#table-view-options)).  
Les [groupes de tables](./table-groups.md#selecting-groups) s’ajoutent à la sélection avec `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) sur leur barre de titre, mais les raccourcis pour tout sélectionner n’en prennent jamais aucun.  
`Ctrl + A` cède le pas au point d’insertion, si bien qu’il sélectionne le texte plutôt que le diagramme pendant que vous modifiez une cellule.  
Un rectangle de sélection marque une table ou un mémo lorsqu’il en couvre le milieu, et non lorsqu’il en touche seulement un bord. Il ne prend un groupe de tables que lorsqu’il englobe tout le cadre du groupe, si bien qu’un rectangle tracé à l’intérieur d’un groupe sélectionne des tables sans le groupe.  
Un clic droit sur un élément déjà sélectionné conserve toute la sélection, si bien que les entrées de menu comme `Color`, `Group selected tables` et `Delete selected` s’appliquent à l’ensemble. Un clic droit sur toute autre table, tout autre mémo ou tout autre groupe de tables sélectionne cet élément seul, même avec `Ctrl` ou `⌘` enfoncé, et un clic droit sur une relation ou sur une zone vide du canevas efface la sélection.  
`Escape` efface la sélection. Lorsqu’un éditeur de cellule, de mémo ou de nom de groupe de tables est ouvert, ou qu’une relation ou un `New Table Group` est en cours de tracé, le premier `Escape` y met fin et un second efface la sélection.

![Sélection de tables avec ⌘ + drag et ⌘ + click, puis de toutes les tables et de tous les mémos avec ⌘ + A](/img/demo-table-select.webp)

Dans une session collaborative, la sélection, la cellule active et le rectangle de sélection de chaque participant sont dessinés sur le canevas dans la couleur de ce participant (voir [Édition collaborative](../../api/advanced/collaborative-editing.md)).

## Déplacer plusieurs tables {#moving-multiple-tables}

Faites glisser une table ou un mémo qui fait déjà partie de la sélection, et toute la sélection se déplace en même temps, sans touche de modification.  
Faire glisser un élément hors de la sélection réduit la sélection à cet élément et ne déplace que lui. `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) conserve la sélection dans les deux cas.  
Seul le bouton gauche de la souris déplace les tables et les mémos. Un clic droit choisit ce sur quoi agit le menu contextuel et ne déplace rien, et un glissement avec le bouton central déplace plutôt la vue du canevas (voir [Se déplacer sur le canevas](#getting-around-the-canvas)).

![Glissement de l’une de deux tables sélectionnées : les deux se déplacent et la relation suit](/img/demo-table-multiple-move.webp)

Un [groupe de tables](./table-groups.md) sélectionné se déplace aussi, en emportant ses tables, et une table à la fois sélectionnée et membre d’un groupe en mouvement ne se déplace qu’une fois.  
L’endroit où vous déposez une table peut la faire entrer dans un groupe ou l’en faire sortir (voir [Ajouter et retirer des tables](./table-groups.md#adding-and-removing-tables)).

Les tables et les mémos partagent un même ordre d’empilement. Un appui sur une table ou un mémo, avec le bouton gauche ou droit, place l’élément devant toutes les autres tables et tous les autres mémos, et un appui sur la barre de titre d’un groupe de tables, ou un clic droit sur son corps, met ses tables au premier plan.  
L’ordre n’est pas enregistré : un diagramme rouvert empile ses tables dans l’ordre où le fichier les liste, avec tous les mémos au-dessus d’elles.

## Copier-coller des tables et des mémos {#copyingpasting-tables-and-memos}

Copie les tables et les mémos sélectionnés et les colle comme de nouveaux éléments.  
Raccourcis : `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Une table copiée conserve son nom, son commentaire, ses colonnes et sa couleur ; un mémo copié conserve son texte, sa taille et sa couleur.  
Les index et les relations suivent aussi : un index est copié en entier sur la table copiée, et une relation est copiée avec son type et ses actions ON DELETE et ON UPDATE lorsque les deux tables qu’elle relie font partie de l’ensemble copié. Une relation à moitié copiée est abandonnée plutôt que de continuer à pointer vers l’original.  
Les copies collées deviennent la nouvelle sélection, et coller à nouveau la même copie la décale chaque fois de `50px` supplémentaires, si bien que des collages répétés ne s’empilent pas les uns sur les autres.  
Une copie ne conserve pas son [groupe de tables](./table-groups.md) : la table collée n’appartient à aucun groupe, même lorsqu’elle arrive à l’intérieur du cadre d’un groupe, et un groupe sélectionné n’est pas copié.  
Tant que View Option → `Memos` masque les mémos, un collage ajoute quand même les mémos qu’il contient, masqués et non sélectionnés, si bien que seules les tables collées deviennent la sélection.

![Copie de deux tables liées, collées deux fois, relation comprise](/img/demo-table-copy-paste.webp)

Lorsque des colonnes sont sélectionnées dans une table qui a le focus, le même raccourci copie plutôt ces colonnes (voir [Modification des tables](./table-editing.md)).

## Dupliquer des tables et des mémos {#duplicating-tables-and-memos}

Maintenez `Alt` enfoncé et faites glisser une table ou un mémo avec le bouton gauche de la souris.  
Un aperçu translucide suit le pointeur, et relâcher le bouton dépose la copie à l’emplacement de l’aperçu.  
Si ce que vous saisissez fait déjà partie d’une sélection, toute la sélection est dupliquée. Sinon, la sélection est remplacée par l’entité sous le pointeur.  
`Alt + click` sans déplacement dépose la copie `50px` plus bas et plus à droite, en se décalant encore chaque fois que cet emplacement est déjà occupé.

Un doublon emporte les mêmes éléments qu’un collage : noms, commentaires, colonnes, couleurs, tailles des mémos, ainsi que les index et les relations qui appartiennent entièrement à ce que vous avez copié. Comme un collage, il n’arrive dans aucun groupe de tables.  
`Alt + drag` sur la barre de titre d’un groupe de tables déplace le groupe comme un glissement ordinaire ; un groupe n’est jamais dupliqué.

![Duplication d’une table avec Alt + drag, puis Alt + click pour une autre copie plus bas et à droite](/img/demo-table-duplicate.webp)

## Suppression de tables et de mémos {#table-and-memo-deletion}

Supprime les tables, les mémos et les [groupes de tables](./table-groups.md) sélectionnés.  
Raccourcis :

- `Delete` ou `Backspace`. Ces touches suppriment toute la sélection, sauf lorsque le seul élément sélectionné est une table dont certaines colonnes sont sélectionnées et que le zoom dépasse `70%` : elles suppriment alors plutôt ces colonnes (voir [Suppression de colonnes](./table-editing.md#column-deletion)).
- `Ctrl + Backspace` ou `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` ou `⌘ + Delete` (Mac). Ces raccourcis suppriment toujours les tables, les mémos et les groupes de tables sélectionnés, même lorsque des colonnes sont sélectionnées.

![Suppression d’une table et de ses relations avec la touche Delete, puis d’une table et d’un mémo ensemble avec Delete selected dans le menu du mémo](/img/demo-table-remove.webp)

Les menus contextuels permettent aussi de supprimer. La dernière entrée du menu d’une table ou d’un mémo indique `Delete selected` lorsque cette table ou ce mémo fait partie de deux éléments sélectionnés ou plus, et supprime toute la sélection. Sinon, elle indique `Delete` et ne supprime que cette table ou ce mémo. Sur la ligne d’une colonne sélectionnée, le menu d’une table indique plutôt `Delete column` ou `Delete columns`, comme dans [Suppression de colonnes](./table-editing.md#column-deletion).

Supprimer une table supprime aussi ses relations et ses index. Supprimer un groupe de tables conserve ses tables, qui n’appartiennent alors à aucun groupe (voir [Supprimer un groupe](./table-groups.md#removing-a-group)).  
Aucune confirmation n’est demandée, chaque suppression constitue une étape d’annulation, et dans un éditeur `readonly` rien n’est supprimé.  
Maintenues enfoncées, les touches `Delete` et `Backspace` ne suppriment qu’une fois, et elles ne suppriment jamais une relation (voir [Modification des relations](./relationship-editing.md#deletion)). Pendant que vous saisissez du texte dans une cellule, un mémo ou tout autre champ de texte, elles modifient plutôt le texte.  
L’onglet Paramètres liste ces deux touches sous `Delete Selection` (voir [Raccourcis](./settings.md#shortcuts)).

## Couleur des tables et des mémos {#table-and-memo-color-specification}

Vous pouvez attribuer des couleurs pour distinguer les éléments par catégorie.  
Une table porte sa couleur le long de son bord gauche, et un mémo sur une bande le long de son bord supérieur. Cliquez sur ce bord ou cette bande avec le bouton gauche, ou choisissez `Color` dans le menu contextuel de la table ou du mémo, pour ouvrir le sélecteur de couleur au niveau du pointeur. La couleur s’applique à toutes les tables, à tous les mémos et à tous les groupes de tables sélectionnés, et pas seulement à celui sur lequel vous avez cliqué.  
Un groupe de tables se colore avec `Color` dans son propre menu, et une table d’un groupe coloré porte la couleur du groupe sur toute la largeur de son en-tête tout en gardant sa propre couleur sur son bord gauche (voir [Colorer un groupe](./table-groups.md#coloring-a-group)).

![Choix de la couleur prédéfinie Bleu depuis la bande de couleur d’un mémo pour deux tables sélectionnées et le mémo, puis retrait de la couleur avec No color](/img/demo-table-color.webp)

Le sélecteur contient, de haut en bas :

- Une zone de saturation et de luminosité, puis le curseur de teinte avec un aperçu de la couleur à côté. Lorsque le navigateur propose une pipette, un bouton pipette placé avant le curseur, `Pick a color from the screen`, prélève une couleur n’importe où à l’écran.
- Les champs `Hex`, `R`, `G` et `B`. `Hex` accepte 3, 4, 6 ou 8 chiffres hexadécimaux, avec ou sans `#`, ou bien un `rgb()`, un `hsl()` ou un nom de couleur CSS collé. Une valeur complète à 6 ou 8 chiffres s’applique au fil de la saisie, et toute autre valeur à l’appui sur `Enter` ou lorsque vous quittez le champ. `R`, `G` et `B` acceptent des nombres entiers, lisent toute valeur supérieure à `255` comme `255`, et s’appliquent à l’appui sur `Enter` ou lorsque vous quittez le champ. Le texte que le sélecteur ne peut pas lire est ignoré.
- Seize pastilles de couleurs prédéfinies sur deux lignes de huit : Rouge, Orange, Ambre, Jaune, Vert citron, Vert, Bleu sarcelle, Cyan, Bleu, Indigo, Violet, Pourpre, Rose, Cramoisi, Marron et Gris. Le survol d’une pastille affiche son code hexadécimal.
- `Document colors` : jusqu’à huit couleurs déjà utilisées par les tables, les mémos et les groupes de tables du document, les plus utilisées en premier. Cette ligne n’apparaît que s’il y en a.
- `No color`.

Une couleur est toujours opaque : le sélecteur n’a aucun réglage de transparence et ignore toute transparence que contient une valeur saisie ou collée.  
Ouvrir le sélecteur ne modifie rien, et choisir la couleur que la sélection a déjà n’ajoute aucune étape d’annulation.

`No color` retire la couleur de toutes les tables, de tous les mémos et de tous les groupes de tables sélectionnés en une seule étape d’annulation, et ferme le sélecteur. `Remove color`, juste sous `Color` dans les menus contextuels des tables, des mémos et des groupes de tables tant qu’un élément sélectionné a une couleur, fait de même sans ouvrir le sélecteur.

Le sélecteur prend le focus à son ouverture, et `Tab` et `Shift + Tab` parcourent ses commandes en boucle. Les touches fléchées déplacent la zone et le curseur de teinte de 1, ou de 10 avec `Shift`, et passent d’une pastille à l’autre en appliquant chacune au passage.  
Tant que le sélecteur a le focus, l’annulation et le rétablissement, les raccourcis de zoom, `Search` et `Toggle Explorer` atteignent toujours l’éditeur, mais pas les autres raccourcis de l’éditeur : les raccourcis de [suppression](#table-and-memo-deletion) ne suppriment rien, et `Delete` et `Backspace` ne font que modifier le texte des champs `Hex`, `R`, `G` et `B`.  
`Escape` ferme le sélecteur, tout comme un appui sur le canevas en dehors de celui-ci.  
Un appui dans l’[explorateur](./explorer.md) n’est pas un appui sur le canevas, si bien qu’il laisse le sélecteur ouvert. Une ligne qui y est choisie modifie la sélection, et le choix suivant colore la nouvelle sélection.

## Options d’affichage des tables {#table-view-options}

Les options d’affichage suivantes sont proposées :

- Table Comment
- Column Comment
- DataType
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Unique`, `Alternate Key` et `Auto Increment` sont désactivées par défaut, et les autres sont activées.  
`Alternate Key` marque les colonnes de chaque clé alternative, par exemple avec `AK1.1` (voir [Clés alternatives](#alternate-keys)).  
`Referential Actions` affiche les étiquettes `D:` et `U:` que les actions ON DELETE et ON UPDATE d’une relation placent à l’extrémité enfant de son connecteur (voir [Lire un connecteur](./relationship-editing.md#reading-a-connector)). La désactiver masque uniquement ces étiquettes et ne déplace ni table ni connecteur.  
`Table Groups` affiche les [groupes de tables](./table-groups.md) et les couleurs des groupes sur les en-têtes de leurs tables. La désactiver les masque sur le canevas, la minicarte et les exportations d’images, ne déplace aucune table et laisse chaque table dans son groupe (voir [Masquer les groupes](./table-groups.md#hiding-groups)). Cela retire aussi le dossier `Table Groups` de l’[explorateur](./explorer.md#the-tree) et `New Table Group` de la [barre d’outils du canevas](#canvas-toolbar), et la recherche de l’explorateur cesse de trouver les noms de groupe.  
`Memos` affiche les mémos. La désactiver masque tous les mémos sur le canevas, la minicarte et les exportations d’images, et ne déplace ni table ni connecteur. Les mémos masqués n’occupent aucune place, si bien que les barres de défilement, la minicarte et la boussole `Go to content` n’en tiennent pas compte.  
Masquer les mémos les désélectionne et ferme un éditeur de mémo ouvert. L’[explorateur](./explorer.md#the-tree) retire son dossier `Memos`, et sa fonction [Rechercher et remplacer](./find-and-replace.md) ainsi que le `:` de la recherche rapide ne cherchent pas dans les mémos. Tant qu’ils sont masqués, `New Memo` disparaît du menu contextuel, de la [barre d’outils du canevas](#canvas-toolbar), de la recherche rapide et de l’[écran d’accueil](./editing-start.md#welcome-screen), et `Alt + M` n’ajoute aucun mémo. Un collage ou une opération [Importer et ajouter](./file-import-export.md#import-and-add) ajoute quand même les mémos qu’il contient, masqués et non sélectionnés.  
Dans un éditeur `readonly`, activer ou désactiver ces options ne change rien.

![Activation et désactivation d’entrées de View Option pendant que les tables se réorganisent, marquage d’un index unique composite AK1.1 et AK1.2 avec Alternate Key, puis désactivation et réactivation de Memos](/img/demo-view-options.webp)

Les cartes du mode `Flow` de l’onglet Visualisation ne suivent pas ces options : elles utilisent leur propre [affichage des lignes](./visualization.md#row-display) et tracent leurs connecteurs même lorsque l’option `Relationship` est désactivée.

## Propriétés de la table {#table-properties}

Ouvre le panneau des propriétés d’une table.  
Choisissez `Table Properties` dans le menu contextuel de la table, qui l’ouvre pour la table sur laquelle vous avez cliqué avec le bouton droit, ou sélectionnez une table et appuyez sur `Alt + Space`.  
Le panneau s’ouvre au milieu du canevas assombri. Seul le canevas est assombri, si bien qu’un [explorateur](./explorer.md#dialogs-beside-it) ouvert reste ouvert et utilisable à côté. Son en-tête contient le titre `Table Properties`, les cinq tables ouvertes le plus récemment sous forme de puces, la table actuelle étant mise en évidence, et un bouton de fermeture. Cliquez sur une puce pour passer à cette table sans rouvrir le panneau.  
Sous l’en-tête se trouvent trois onglets : `Indexes`, `Schema SQL` et `Code Generator`. Le panneau garde la même taille pour les trois, si bien que changer d’onglet ne le déplace ni ne le redimensionne.  
Fermez-le avec le bouton de fermeture, avec `Escape` ou en cliquant en dehors de celui-ci sur le canevas.  
Choisir dans l’explorateur une ligne autre qu’un dossier, ou aller à une correspondance de sa recherche, ferme la boîte de dialogue Propriétés de la table avant le saut. Il en va de même pour `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), qui ouvre la recherche de l’explorateur, ou place le point d’insertion dans son champ Rechercher lorsque l’explorateur est déjà ouvert. Tout autre clic dans l’explorateur, y compris sur une ligne de dossier, ou sur le bouton `Explorer` de la barre d’outils, laisse la boîte de dialogue Propriétés de la table ouverte. Un appui sur `Escape` alors que le focus est dans l’explorateur ne fait que rendre le focus au canevas, si bien qu’il faut un second `Escape` pour fermer la boîte de dialogue Propriétés de la table.

L’onglet `Indexes` est décrit dans [Index](#indexes).  
L’onglet `Schema SQL` affiche le DDL de la table pour la [base de données](#databases) sélectionnée : son `CREATE TABLE`, les contraintes distinctes que certaines bases de données écrivent pour ses colonnes uniques, et ses index. Il écrit toujours de simples instructions `CREATE`, sans en-tête ni script avant ou après les tables, quel que soit le réglage de l’onglet [Schéma SQL](./schema-sql.md) de la barre d’outils. Il n’a pas de panneau des options, et son menu contextuel ne propose que `Database` et `Bracket`.  
L’onglet `Code Generator` génère du code pour cette seule table (voir [Générateur de code](./code-generator.md)).

Dans un éditeur `readonly`, le panneau s’ouvre toujours, avec un badge `Read only` à côté de son titre, mais son onglet `Indexes` ne permet aucune modification.

## Se concentrer sur des tables {#focusing-on-tables}

Ouvre l’onglet Visualisation en mode `Flow`, restreint aux tables choisies et à toutes les tables situées à une relation d’elles.  
Choisissez `Focus on this table` dans le menu contextuel de la table, ou sélectionnez une ou plusieurs tables et appuyez sur `Alt + F`.  
Lorsque la table sur laquelle vous cliquez avec le bouton droit fait partie de plusieurs tables sélectionnées, l’entrée indique `Focus on selected tables` et concentre la vue sur toute la sélection. Un clic droit sur une table hors de la sélection concentre la vue sur cette seule table.  
Le raccourci prend les tables sélectionnées, laisse de côté les mémos et ne fait rien lorsqu’aucune table n’est sélectionnée.  
Un [groupe de tables](./table-groups.md) sélectionné ne compte pas ici, pour le raccourci comme pour l’entrée de menu : ses tables ne sont prises que si elles sont elles-mêmes sélectionnées, ce que fait `Select tables` dans le menu du groupe.  
Ce qu’affiche la vue restreinte, et comment revenir au diagramme entier, est décrit dans [Visualisation](./visualization.md#focusing-on-tables).

## Index {#indexes}

Les index se définissent dans l’onglet `Indexes` du panneau des propriétés de la table et sont inclus dans le Schéma SQL exporté.

La partie gauche liste les clés et les index de la table en deux groupes.  
Le groupe `Keys`, affiché lorsque la table en a, liste les clés que déclarent ses colonnes : `PK_<table name>` sur les colonnes marquées PK, puis `UQ_<table name>_<column name>` pour chaque colonne marquée unique, dans l’ordre des colonnes. Les noms suivent le Schéma SQL de la base de données sélectionnée, si bien qu’avec `Bracket` à `None`, une table qualifiée par le schéma comme `sales.users` liste `PK_users` pour toutes les bases de données sauf Databricks et Snowflake (voir [Noms de table qualifiés par le schéma](./schema-sql.md#schema-qualified-table-names)). Chacune porte l’étiquette `PK` ou `UQ` et est marquée d’un verrou. Elles sont ici en lecture seule et ne changent qu’avec les indicateurs [PK](./table-editing.md#column-primary-key) et [Unique](./table-editing.md#not-null-unique-auto-increment) des colonnes.  
Le groupe `Indexes` liste les index de la table dans l’ordre où ils ont été ajoutés. Chaque index a un interrupteur `UQ` qui le rend unique, un champ de nom et un `x` qui le supprime. Un index qui est une [clé alternative](#alternate-keys) affiche aussi son numéro, par exemple `AK1`. Ajoutez un index avec `Add Index` en bas de la liste.

La partie droite liste les colonnes de la table sous `Columns`, chacune avec une case à cocher. Rien n’est modifiable tant qu’aucun index n’est sélectionné à gauche.  
Cochez une colonne pour l’ajouter à l’index sélectionné, et décochez-la pour l’en retirer. Sélectionner une clé affiche ses colonnes cochées, mais les cases restent désactivées.  
Les colonnes de l’index sélectionné sont listées en dessous, sous `Index order`. Faites-les glisser par leur poignée pour les réorganiser, et cliquez sur la puce `ASC` ou `DESC` d’une ligne pour inverser son ordre de tri. Dans une clé alternative, chaque ligne se termine par sa marque `AK<n>.<m>`. La liste affiche trois lignes à la fois et fait défiler le reste.

Dans un éditeur `readonly`, sélectionner une clé ou un index affiche toujours ses colonnes, mais il n’y a ni `Add Index` ni `x`, et rien d’autre dans l’onglet ne peut être modifié.

L’[explorateur](./explorer.md#the-tree) liste les index de chaque table dans le dossier `Indexes` de la table, et choisir l’un d’eux à cet endroit mène à sa table. Sa recherche trouve aussi les noms d’index et peut les renommer (voir [Ce qui est recherché](./find-and-replace.md#what-it-searches)).

![Ouverture de Table Properties sur orders, où l’onglet Indexes liste les clés PK et UQ au-dessus des index, puis ajout d’un index sur member_id et ordered_at DESC et relecture dans l’onglet Schema SQL](/img/demo-table-properties.webp)

## Clés alternatives {#alternate-keys}

Une clé alternative est un index unique portant sur deux colonnes ou plus : un index de l’onglet `Indexes` dont l’interrupteur `UQ` est activé et dont au moins deux colonnes de la table sont cochées.  
Un index unique sur une seule colonne n’exprime rien de plus que l’indicateur Unique de cette colonne, si bien que ce n’est pas une clé alternative, pas plus qu’un index ordinaire, la clé primaire ou une colonne marquée unique.

Lorsque `Alternate Key` est activée dans les [options d’affichage](#table-view-options), le diagramme marque les colonnes de chaque clé alternative comme le font erwin et IDEF1X : `AK1.1`, `AK1.2` et ainsi de suite. L’option est désactivée par défaut.

Les clés sont numérotées selon la position de leurs colonnes dans la table, et non selon l’ordre d’ajout des index. La clé dont la première colonne de son `Index order` est la plus haute dans la table est `AK1`. En cas d’égalité, c’est la colonne suivante de chaque clé qui tranche, et une clé qui constitue le début d’une clé plus longue passe avant celle-ci.  
Déplacer une colonne dans la table, ou réorganiser l’`Index order` d’une clé, peut renuméroter les clés. Annuler la suppression d’une clé lui rend son numéro, et tous les collaborateurs voient les mêmes numéros.

Chaque colonne d’une clé est marquée `AK<n>.<m>`, où `n` est le numéro de la clé et `m` la place de la colonne dans l’`Index order` de la clé. Une colonne appartenant à plusieurs clés porte toutes les marques, séparées par une virgule.  
Par exemple, dans une table aux colonnes `a`, `b` et `c`, des index uniques sur (`c`, `a`) et (`b`, `a`) deviennent `AK1` = (`b`, `a`) et `AK2` = (`c`, `a`), car `b` se trouve au-dessus de `c`. Ainsi, `b` affiche `AK1.1`, `c` affiche `AK2.1` et `a` affiche `AK1.2,AK2.2`.

La marque est dessinée en dernier dans la ligne, après la cellule, quelle qu’elle soit, que l’[ordre des colonnes](./settings.md#adjusting-column-order) place en dernier. Ce n’est pas une cellule, si bien qu’elle ne reçoit jamais le focus et n’est jamais modifiée ni copiée (voir [Modification des tables](./table-editing.md)).  
Une colonne de clé primaire ou de clé étrangère peut aussi porter une marque AK, puisque la marque ne remplace rien : l’icône de clé en début de ligne affiche toujours PK et FK, et la cellule Unique garde son propre `UQ`.  
Une table qui a une clé alternative réserve, après la dernière cellule de chaque ligne, la place de sa marque la plus longue ; une table qui n’en a pas garde sa largeur.  
Les marques s’affichent sur le canevas ERD, où une table réduite à son nom à `70%` et en dessous n’en affiche aucune, et dans une [exportation d’image](./file-import-export.md#image), qui dessine chaque table en entier quel que soit le zoom. L’[aperçu au survol](./visualization.md#hover-preview) de l’onglet Visualisation en mode `Graph` les affiche aussi ; les cartes `Flow` ne les affichent jamais.

L’onglet `Indexes` affiche les numéros, que l’option soit activée ou non (voir [Index](#indexes)).

## Disposition automatique {#auto-layout}

Dispose à votre place toutes les tables du canevas.  
Ouvrez `Auto Layout` depuis le menu contextuel du canevas ou depuis la recherche rapide, puis choisissez l’une des quatre dispositions :

| Disposition | Ce qu’elle dessine |
| --- | --- |
| `Force` | Une simulation : les relations rapprochent les tables, les tables voisines se repoussent et les tables qui se chevauchent s’écartent. |
| `Flow` | De gauche à droite le long des relations, chaque connecteur recevant son propre point de contact sur une table. Elle cherche à limiter les croisements, mais peut en laisser certains qu’une autre disposition éviterait. |
| `Tree - vertical` | En couches vers le bas : une table parente se place au-dessus des tables qui portent une clé étrangère vers elle. |
| `Tree - horizontal` | La même disposition en couches, de gauche à droite. |

`Force` ouvre un aperçu pendant que la disposition se stabilise, avec `Apply` et `Cancel` dans la notification qu’elle affiche.  
L’aperçu est cadré sur le diagramme tel qu’il était au lancement de la disposition, si bien que des tables peuvent sortir du cadre pendant que la disposition se stabilise. Il est dessiné à `70%` ou moins, si bien que ses tables apparaissent réduites à leur nom et à leur bord coloré.  
`Apply` conserve les positions telles qu’elles sont à ce moment-là, et la disposition s’applique d’elle-même une fois stabilisée. `Cancel` ou `Escape` laisse le diagramme tel qu’il était.

Les trois autres sont calculées en une seule fois, hors du thread principal, si bien qu’il n’y a rien à regarder : une notification s’affiche pendant le calcul de la disposition, et la disposition finale est centrée sur la zone que le diagramme occupe déjà. `Cancel` ou `Escape` abandonne une disposition que vous n’attendez plus, et un hôte qui n’exécute aucun worker partagé aboutit à `Could not place tables` (voir [Web Workers](../../api/installation.md#web-workers)). Une disposition qui n’a pas abouti dans les 60 secondes se termine de la même façon.

Quelle que soit la disposition choisie, les tables et les groupes de tables sont déplacés, et les mémos restent où ils sont. Une relation d’une table vers elle-même est ignorée, et plusieurs relations entre les deux mêmes tables comptent pour une.  
Chaque disposition garde ensemble les tables de chaque groupe, que les groupes soient affichés ou non, et ajuste chaque groupe contenant des tables autour de celles-ci (voir [Groupes de tables](./table-groups.md#auto-layout)).  
Le résultat constitue une seule entrée d’historique, si bien qu’une seule annulation remet chaque table et chaque groupe à sa place d’origine.

![Rangement d’un amas de tables avec la disposition automatique Flow depuis le menu contextuel du canevas, qui les aligne de gauche à droite le long de leurs relations](/img/demo-automatic-table-placement.webp)

## Bases de données {#databases}

Les bases de données prises en charge comprennent :

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Choisissez-en une avec `Database` dans le menu contextuel du canevas, dans le panneau des options ou le menu contextuel des onglets Schéma SQL et Générateur de code, ou dans la recherche rapide. Tous ces choix modifient le même paramètre.

Ces options déterminent la syntaxe du Schéma SQL à l’exportation, la saisie semi-automatique du type de données, et les types auxquels se résolvent le code généré et les schémas importés.  
Elles déterminent les choix `Statements` et `Header` que l’onglet [Schéma SQL](./schema-sql.md#options-panel) peut écrire. Un choix dont la base de données ne dispose pas reste dans le panneau des options, grisé, et le SQL se rabat sur le choix le plus proche dont elle dispose.  
Elles déterminent aussi les actions ON DELETE et ON UPDATE qu’écrivent le Schéma SQL et les cibles ORM du générateur de code, et celles que les menus des relations marquent `not in <database>` (voir [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update) et [Générateur de code](./code-generator.md#database)).  
L’importation de Schéma SQL conserve le type de données d’une colonne, liste d’arguments comprise, que l’éditeur le liste ou non, comme `TIMESTAMP WITH TIME ZONE`, `public.mood` ou `integer[]` (voir [Types de données](./file-import-export.md#data-types)). La saisie semi-automatique du type de données ne propose que les types que liste la base de données sélectionnée.

![Passage de la base de données à PostgreSQL, puis choix d’un type PostgreSQL dans la saisie semi-automatique](/img/demo-database.webp)

![Saisie semi-automatique approximative du type de données, parcourue avec les touches fléchées et validée avec Right, Tab ou Enter](/img/demo-data-type-autocomplete.webp)

## Barre d’outils du canevas {#canvas-toolbar}

Une petite barre d’outils flotte au milieu du bord inférieur du canevas et contient, de gauche à droite, les outils qui agissent sur le canevas lui-même et les commandes qui y ajoutent des éléments :

- La main et le pointeur. Le pointeur est la valeur par défaut ; la main transforme tout glissement en déplacement de la vue, sur les tables comme sur les zones vides. `Space` bascule entre les deux. Tant qu’un tracé [`New Table Group`](./table-groups.md#drawing-a-group) est actif, c’est le bouton `New Table Group` qui est marqué à leur place, et cliquer sur l’un ou l’autre, appuyer sur `Space` ou choisir une notation de relation met fin au tracé sans ajouter de groupe.
- `New Table`, `New Memo` et `New Table Group`. `New Table` ajoute une table comme le fait `Alt + N`, et `New Memo` ajoute un mémo comme le fait `Alt + M`. `New Table Group` active le [tracé de groupe](./table-groups.md#drawing-a-group) comme le fait `Alt + G` et désactive la main ; un second clic, comme un second `Alt + G`, met fin au tracé sans ajouter de groupe. `New Memo` est absent tant que View Option → `Memos` masque les mémos, et `New Table Group` tant que View Option → `Table Groups` masque les groupes. Un éditeur `readonly` n’affiche aucun des trois.
- Le zoom : `Zoom out`, le zoom actuel en pourcentage, et `Zoom in`. Les deux boutons modifient le zoom par paliers de la même manière que les raccourcis de zoom, et cliquer sur le pourcentage le ramène à `100%`.
- Les quatre notations de relation, les mêmes que celles qui servent à commencer une relation (voir [Commencer l’édition](./editing-start.md)). Choisir l’une d’elles ramène au pointeur, puisqu’une relation se trace en cliquant sur deux tables.
- Le mode zen, `Alt + Z`, qui masque tout sauf le canevas et cette barre d’outils. Un nouvel `Alt + Z`, ou le bouton, fait réapparaître le reste. Un explorateur ouvert est masqué avec le reste, sans être fermé, et réapparaît avec lui. Il peut quand même être ouvert pendant le mode zen (voir [Quand l’explorateur s’efface](./explorer.md#when-it-stands-aside)).
- La boussole `Go to content`, qui rejoint l’extrémité de la barre d’outils uniquement lorsqu’aucune table, aucun mémo affiché ni aucun groupe de tables affiché n’est à l’écran (voir [Se déplacer sur le canevas](#getting-around-the-canvas)).

Chaque bouton doté d’un raccourci l’indique dans son info-bulle, par exemple `New Table (Alt + N)` (Windows/Linux) ou `New Table (⌥ + N)` (Mac).  
La barre d’outils s’efface pendant l’affichage de l’aperçu de la disposition automatique `Force`, des propriétés de la table, du voyage dans le temps ou de la visionneuse de différences, et réapparaît à leur fermeture.

![Ajout d’une table et d’un mémo depuis la barre d’outils, activation et désactivation de New Table Group, déplacement de la vue avec la main, zoom par paliers et activation ou désactivation du mode zen avec ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Zoom avant et arrière {#zoom-inout}

Le zoom s’effectue avec `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac). La molette seule déplace la vue du canevas.  
Un pincement sur le pavé tactile zoome aussi, autour du point où vous pincez, tout comme deux doigts sur un écran tactile, qui déplacent aussi la vue en bougeant.  
Raccourcis : `Ctrl + Plus` (Windows/Linux) ou `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) ou `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) revient directement à `100%`, en gardant le milieu de l’écran à sa place.

Les boutons `Zoom out` et `Zoom in` de la [barre d’outils du canevas](#canvas-toolbar) modifient le zoom par paliers comme les raccourcis `Minus` et `Plus` : chaque appui le fait varier de 4 points de pourcentage, en gardant le milieu de l’écran à sa place. Le pourcentage entre les deux indique le zoom actuel, et cliquer dessus revient directement à `100%` comme `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac).

Le zoom va de `10%` à `150%`.  
À `70%` et en dessous, les tables se réduisent à leur nom et à leur bord coloré, et la modification des cellules, les raccourcis des cellules ainsi que le copier-coller cessent de fonctionner jusqu’à ce que vous refassiez un zoom avant.

Les trois mêmes raccourcis zooment aussi l’onglet Visualisation, en mode `Graph` comme en mode `Flow`, chaque mode dans sa propre plage (voir [Visualisation](./visualization.md#toolbar)).

![Zoom arrière avec ⌘ + Wheel jusqu’à ce que les tables se réduisent à leur nom, puis retour par paliers avec ⌘ + Plus, ⌘ + Minus et ⌘ + 0](/img/demo-zoom.webp)

## Se déplacer sur le canevas {#getting-around-the-canvas}

Le canevas n’a ni bords ni taille à définir. Les tables et les mémos restent là où vous les placez, et tout ce qui suit décrit le diagramme plutôt qu’une page fixe.

Faites glisser une zone vide du canevas pour déplacer la vue, ou passez à l’outil Main avec `Space` et faites glisser n’importe où, y compris sur une table. La molette déplace aussi la vue, et `Shift + Wheel` la déplace latéralement.  
Le corps d’un [groupe de tables](./table-groups.md#selecting-groups), la zone sous sa barre de titre, compte comme du canevas vide pour le bouton gauche : le faire glisser déplace la vue, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) trace un rectangle de sélection, et un clic efface la sélection.  
Le déplacement de la vue n’a pas de limites : la molette, un glissement et l’outil Main emmènent la vue aussi loin que vous la déplacez, au-delà des tables de tous les côtés.

Faites glisser avec le bouton central de la souris (en appuyant sur la molette) pour déplacer la vue depuis n’importe quel point du canevas, avec le pointeur comme avec la main. Cela fonctionne même lorsque l’appui tombe sur une table, un mémo, une cellule, une icône ou une relation.  
Un glissement avec le bouton central ne sélectionne rien, ne déplace rien et ne clique sur rien, et conserve la sélection. Il ferme un menu contextuel ouvert et le sélecteur de couleur, et le défilement et le collage propres au clic central du navigateur ne se déclenchent pas.  
Un appui central sur les barres de défilement, la minicarte, la barre d’outils du canevas ou un éditeur de cellule ou de mémo ouvert ne déplace pas la vue.

La minicarte, dans le coin supérieur droit, représente le diagramme avec une marge d’un écran de chaque côté, soit la portée des barres de défilement, arrondie vers l’extérieur sur une grille grossière, si bien que plus le zoom arrière est important, plus le diagramme y apparaît petit. Cliquez dessus pour déplacer la vue vers ce point, ou faites glisser le rectangle de la fenêtre d’affichage pour déplacer la vue. À mesure que vous effectuez un zoom arrière, le rectangle de la fenêtre d’affichage s’agrandit pour couvrir une plus grande partie de la carte.  
Elle dessine chaque table dans la couleur de la table, et chaque groupe de tables affiché comme un cadre de la couleur du groupe derrière ses tables.  
Les barres de défilement le long des bords droit et inférieur décrivent la même course, qui va du diagramme placé juste au-delà d’un bord de l’écran au diagramme placé juste au-delà du bord opposé, si bien qu’elle est plus longue d’au moins un écran que le diagramme tel qu’il est dessiné, et plus longue encore tant que la vue se trouve au-delà. Hors du mode zen, les deux barres de défilement s’affichent dès que le document contient une table, un mémo affiché ou un groupe de tables affiché, même si tout tient à l’écran. Un document qui ne contient aucun de ces éléments, comme un document dont les seuls mémos sont masqués avec View Option → `Memos`, n’affiche ni l’une ni l’autre, et aucune minicarte.  
Faire glisser le curseur d’une barre de défilement ou le rectangle de la fenêtre d’affichage de la minicarte est le seul déplacement de la vue qui s’arrête : il ne va pas plus loin que les tables situées juste hors de l’écran, ou que le point de départ du glissement s’il était plus éloigné.

Si un déplacement de la vue ne laisse à l’écran aucune table, aucun mémo affiché ni aucun groupe de tables affiché, une boussole `Go to content` rejoint l’extrémité de la [barre d’outils du canevas](#canvas-toolbar), avec une flèche vers l’élément le plus proche et la distance à laquelle il se trouve. Cliquez dessus pour centrer cet élément sans changer le zoom.

![Déplacement de la vue en faisant glisser le canevas vide, par un glissement avec le bouton central sur une table, avec la minicarte et avec la molette, puis retour en suivant la boussole Go to content](/img/demo-canvas-navigation.webp)

### Où aboutit un saut {#where-a-jump-lands}

Chaque « aller à » qui vous mène à un élément du canevas déplace la vue selon une même règle : les résultats `#`, `@` et `:` de la [recherche rapide](./quick-search.md#searching-the-diagram), les lignes de l’[explorateur](./explorer.md#going-to-a-row) et les correspondances de sa fonction [Rechercher et remplacer](./find-and-replace.md#going-to-a-match), les lignes de la liste de la [visionneuse de différences](#going-to-a-change), le [bouton de carte](./visualization.md#card-buttons) de lien externe en mode Flux, et l’arrivée d’une opération [Importer et ajouter](./file-import-export.md#import-and-add). Chacune de ces sections indique ce que sélectionne l’« aller à » ; celle-ci indique où va la vue.

Un saut ne change jamais le zoom et effectue au plus un défilement. Depuis un autre onglet, il passe d’abord à l’onglet ERD.  
Il mesure le canevas tel qu’il s’affiche : sous la barre d’outils supérieure, ou sur toute la hauteur en mode zen, et à droite d’un explorateur ouvert, qui rétrécit le canevas plutôt que de le recouvrir.

L’horizontale et la verticale sont évaluées séparément, et une direction dans laquelle la cible est déjà bien visible reste exactement telle quelle :

- Une cible qui ne dépasse pas la moitié du canevas dans cette direction reste en place tant que son milieu se trouve dans la moitié centrale du canevas, entre le quart et les trois quarts de la largeur, ou de la hauteur. Sinon, son milieu est amené au milieu du canevas.
- Une cible plus longue qui tient encore avec `40px` de marge à chaque extrémité reste en place tant qu’elle est entièrement visible. Sinon, horizontalement, elle est centrée ; verticalement, son haut est amené à `40px` sous le haut du canevas.
- Une cible plus longue encore reste en place tant qu’elle est entièrement visible ou, lorsqu’elle est plus longue que le canevas, tant que sa partie clé, indiquée ci-dessous, l’est. Sinon, elle est centrée si elle tient, ou bien placée aussi près du milieu que le permet le maintien des deux extrémités de sa partie clé à au moins `40px` à l’intérieur du canevas ; pour une partie clé trop longue pour cela, c’est son début qui est maintenu à `40px` à l’intérieur.

Ainsi, une petite table proche du bord gauche du canevas, à mi-hauteur, ne se déplace qu’horizontalement.

Ce qu’un saut rend visible, et la partie clé qui doit s’afficher lorsque l’ensemble ne tient pas :

- Une table : la table entière, repérée par la bande du nom en haut de la table, ou par sa cellule de commentaire pour une correspondance dans un commentaire de table lorsque View Option → `Table Comment` affiche les commentaires. À `70%` et en dessous, où les tables se réduisent à leur nom, repérée par le nom au milieu du cadre.
- Une colonne : sa ligne, repérée par la cellule visée par le saut : son nom, ou le commentaire où se trouve une correspondance lorsque View Option → `Column Comment` affiche les commentaires. À `70%` et en dessous, une colonne rend sa table visible selon la règle des tables.
- Une cellule trop large pour s’afficher en entier, comme un long commentaire : repérée par le texte correspondant qu’elle contient.
- Une relation : le rectangle englobant ses deux tables, repéré par la table enfant.
- Un groupe de tables : son cadre, repéré par sa barre de titre.
- Un mémo, ou le bloc que dépose une opération Importer et ajouter : en entier.

Lorsqu’aucune direction ne bougerait, il n’y a pas de défilement, si bien qu’aller deux fois de suite au même endroit ne déplace rien la seconde fois. Un saut qui fait défiler le canevas enregistre le défilement dans l’[historique d’annulation](./undo-redo.md#what-the-history-records) comme tout autre changement de position de la vue, et un saut qui ne déplace rien ne laisse rien à annuler. Pour une opération Importer et ajouter, le défilement fait partie de la même étape que l’ajout. Une ligne de la liste de la visionneuse de différences ne déplace que les côtés en lecture seule de la visionneuse, si bien qu’elle n’enregistre rien.  
Aucun saut ne commence ni ne termine le tracé d’une relation. La boussole `Go to content` n’est pas un saut : elle centre ce qu’elle désigne.

## Visionneuse de différences {#diff-viewer}

Vous pouvez comparer des documents enregistrés précédemment avec le document actuel.  
Choisissez `Diff Viewer` dans le menu contextuel du canevas et sélectionnez un document `.json` que vous avez exporté auparavant.

La visionneuse s’ouvre par-dessus le canevas : ce qui a changé à gauche, puis le document enregistré et le document actuel côte à côte.  
Le document actuel est comparé tel qu’il est à l’ouverture de la visionneuse ; les modifications faites ensuite, y compris celles d’un collaborateur, n’atteignent pas la visionneuse. Un [explorateur](./explorer.md#when-it-stands-aside) ouvert est masqué tant que la visionneuse est ouverte, si bien que celle-ci occupe toute la largeur de l’éditeur.  
Sur chaque côté, la vue se déplace avec la molette, en faisant glisser une zone vide ou le corps d’un groupe de tables, ou en faisant glisser avec le bouton central n’importe où sur ce côté, et le zoom s’effectue avec `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) ou un pincement. À `70%` et en dessous, les tables d’un côté se réduisent comme sur le canevas (voir [Marques des deux côtés](#marks-on-the-two-sides)).  
Les deux côtés sont en lecture seule, si bien que rien n’est modifié dans votre document. Chacun garde sa propre sélection, et un clic sur une table y sélectionne celle-ci de ce seul côté.  
Fermez la visionneuse avec le bouton `Close` de la notification `Diff Viewer` qui s’affiche à son ouverture, ou avec `Escape`.

![Ouverture de la visionneuse de différences sur un fichier .json enregistré, clic sur des lignes marquées A, M, D et R dans son arborescence, filtrage par nom, puis fermeture](/img/demo-diff-viewer.webp)

### Ce qui est comparé {#what-is-compared}

Les tables, les colonnes, les index, les clés étrangères, les mémos et les groupes de tables sont tous comparés.  
Chaque élément est d’abord apparié par son identifiant, si bien que, face à une version antérieure du même fichier, qui conserve les identifiants, une table, une colonne, un index ou un groupe de tables renommé reste un seul élément, listé comme renommé.  
Le reste est apparié un à un d’après ce qu’il conserve : une table ou un groupe de tables par son nom, casse comprise ; une colonne ou un index par sa table et son nom ; une clé étrangère par ses deux tables et ses paires de colonnes ; et un mémo par son texte, puis sa position. Un index sans nom est apparié par ses colonnes, leur ordre et leur sens, et le fait qu’il soit unique ou non, et un groupe de tables sans nom par le plus grand nombre de tables en commun.  
Ainsi, face à un fichier d’une autre provenance, comme un diagramme reconstruit par importation SQL, une table renommée apparaît comme une table supprimée et une table ajoutée.

Ce qui compte comme une modification :

- Une table : son nom, son commentaire, son groupe de tables, sa position et sa couleur.
- Une colonne : son nom, son commentaire, son type de données, sa valeur par défaut, ses indicateurs Auto-incrément, clé primaire, Unique et Non NULL, et sa place dans la table. Seules les colonnes hors de l’ordre que partagent les deux documents comptent comme déplacées, si bien qu’ajouter, supprimer ou déplacer une colonne ne marque pas les autres.
- Un index : son nom, UNIQUE, et ses colonnes, avec leur ordre et leur sens.
- Une clé étrangère : ses paires de colonnes, son type de relation et ses actions ON DELETE et ON UPDATE.
- Un mémo : son texte, sa position, sa taille et sa couleur.
- Un groupe de tables : son nom, les tables qu’il contient, sa couleur, sa position et sa taille.

Ainsi, une table, un mémo ou un groupe qui a seulement été déplacé, redimensionné ou recoloré compte comme modifié. Les positions et les tailles sont comparées en pixels entiers, et l’ordre d’empilement ainsi que le point où un connecteur rejoint une table ne comptent jamais.

### L’arborescence des modifications {#the-change-tree}

La liste de gauche est dessinée comme l’[arborescence de l’explorateur](./explorer.md#the-tree) et ne contient que ce qui a changé : `Tables`, `Table Groups` et `Memos`, chacun affiché seulement s’il contient une ligne, et sous une table ses propres `Columns`, `Indexes` et `Foreign Keys`. Une clé étrangère est listée sous sa table enfant, et une table ajoutée ou supprimée ne liste rien à l’intérieur.  
Chaque dossier indique combien de lignes il contient, et chaque dossier et chaque table sont développés au départ.  
Les tables et les groupes de tables sont listés par nom, sans tenir compte de la casse. Les mémos, ainsi que les colonnes, les index et les clés étrangères d’une table, suivent l’ordre du document actuel, un élément supprimé étant remis à sa place d’origine. Une ligne de mémo affiche la première ligne du mémo, et une ligne de clé étrangère affiche ses colonnes enfants, puis `→` avec la table parente et ses colonnes, par exemple `user_id → users(id)`. Un nom vide s’affiche sous la forme `unnamed`, en italique.

Chaque ligne se termine par une lettre, et une ligne marquée `A`, `D`, `M` ou `R` a son nom dans la couleur de la lettre :

- `A`, ajouté, en vert : uniquement dans le document actuel.
- `D`, supprimé, en rouge et barré : uniquement dans le document enregistré.
- `M`, modifié, en ambre : dans les deux, avec des modifications.
- `R`, renommé, en bleu : dans les deux, avec un nouveau nom. Un renommage l’emporte sur toute autre modification, que l’info-bulle liste quand même.
- `~`, en ambre, termine chaque dossier et toute table listée uniquement pour ce qui a changé à l’intérieur ; leurs noms gardent la couleur habituelle.

Survolez le nom d’une ligne pour afficher son info-bulle : le statut, `Added`, `Deleted`, `Modified`, `Renamed` ou `Changed inside`, puis une ligne par modification, comme `Name: users → members` ou `NN: ✗ → ✓`. Un texte est cité par sa première ligne, coupée après 40 caractères, et une valeur vide s’affiche sous la forme `—`. L’info-bulle d’un élément ajouté ou supprimé ne contient que son statut.

`Filter by name`, au-dessus de l’arborescence, garde les lignes dont le nom actuel ou enregistré contient ce que vous saisissez, sans tenir compte de la casse. Une table dont le nom correspond garde toutes ses lignes, et une table dont le nom ne correspond pas ne garde que les lignes qui correspondent. Un filtre qui ne correspond à rien laisse l’arborescence vide.  
Lorsque les deux documents ne diffèrent en rien, l’arborescence affiche `No changes`.

Faites glisser le bord droit de l’arborescence pour l’élargir ou la rétrécir, de `200px` à `480px`, et double-cliquez sur ce bord pour la ramener à `260px`. Chaque comparaison s’ouvre à `260px`, et les deux côtés se partagent équitablement le reste de la largeur.  
Le clavier parcourt l’arborescence comme celle de l’explorateur (voir [Touches dans l’explorateur](./explorer.md#keys-in-the-explorer)), mais ici `Escape`, dans l’arborescence ou dans `Filter by name`, ferme la visionneuse.

### Aller à une modification {#going-to-a-change}

Cliquez sur une ligne, ou appuyez sur `Enter` ou `Space` lorsqu’elle a le focus, pour aller à son élément sur chaque côté qui le contient : un élément ajouté du côté actuel uniquement, un élément supprimé du côté enregistré uniquement, et tout élément présent dans les deux documents, des deux côtés. Une ligne de dossier ne fait que réduire ou développer le dossier, tout comme la flèche au début d’une ligne de table.

- Une ligne de table, de colonne ou d’index sélectionne la table seule.
- Une ligne de clé étrangère rend visibles ses deux tables, ou la table enfant lorsque les deux sont trop éloignées pour s’afficher ensemble, sélectionne la table enfant avec ses colonnes de clé étrangère, et met le connecteur en surbrillance (voir [Lire un connecteur](./relationship-editing.md#reading-a-connector)).
- Une ligne de mémo sélectionne le mémo, et une ligne de groupe de tables sélectionne le groupe. Un mémo ou un groupe que masque le document d’un côté ne mène nulle part de ce côté.

Chaque côté se déplace selon la règle de [Où aboutit un saut](#where-a-jump-lands), mesurée sur ce côté, si bien que cliquer de nouveau sur la même ligne ne déplace rien.

### Marques des deux côtés {#marks-on-the-two-sides}

Les deux côtés colorent le texte, les contours et les connecteurs, et ne remplissent rien. Ce qui est ajouté est vert et n’apparaît que du côté actuel, ce qui est supprimé est rouge et n’apparaît que du côté enregistré, et ce qui est modifié, en ambre, et ce qui est renommé, en bleu, apparaissent des deux côtés. Tout ce qui n’a pas changé est dessiné comme d’habitude.

- Une table ou un groupe de tables ajouté ou supprimé est entouré de sa couleur, et son nom prend cette couleur. Un mémo ajouté ou supprimé est entouré.
- Une colonne ajoutée ou supprimée dans une table présente dans les deux documents colore toute sa ligne, et une colonne déplacée fait passer toute sa ligne en ambre. Rien à l’intérieur d’une table ajoutée ou supprimée n’est marqué individuellement.
- Le texte d’une cellule modifiée passe en ambre : le commentaire d’une table, le commentaire, le type de données, la valeur par défaut, l’indicateur Auto-incrément, Unique ou Non NULL d’une colonne, ou le texte d’un mémo. Une modification de la clé primaire fait passer l’icône de clé de la colonne en ambre.
- Une table, une colonne ou un groupe de tables renommé a son nom en bleu.
- Une table, un mémo ou un groupe de tables dont une modification n’a pas de cellule propre, comme un déplacement, une nouvelle taille ou couleur, ou un changement de groupe ou des tables d’un groupe, est entouré en ambre.
- Une clé étrangère ajoutée, supprimée ou modifiée trace son connecteur dans cette couleur. Le survol du connecteur, ou la surbrillance due à une ligne, le trace plutôt dans la couleur de survol habituelle.
- Une modification d’index ne marque rien d’aucun côté ; elle n’apparaît que dans l’arborescence.

Chaque côté suit les options d’affichage de son propre document. Une modification dans une cellule que ce côté ne dessine pas apparaît plutôt sur le nom. Une modification de colonne dans une cellule qu’une option d’affichage masque, comme `Unique` ou `Auto Increment`, toutes deux désactivées par défaut, fait passer le nom de la colonne en ambre, tout comme une modification de la clé primaire sur une ligne qui n’affiche pas d’icône de clé. Une modification du commentaire de table lorsque `Table Comment` est désactivée fait passer le nom de la table en ambre. Le bleu d’un renommage l’emporte sur cet ambre. Un mémo ou un groupe de tables que son document masque est listé dans l’arborescence mais n’est pas dessiné de ce côté.

À `70%` et en dessous, les tables réduites gardent leur contour. Le nom garde le vert ou le rouge d’une table ajoutée ou supprimée, ou le bleu d’un renommage, et prend sinon l’ambre d’une modification de commentaire. Les modifications de colonnes ne sont pas dessinées tant que vous ne refaites pas un zoom avant ; l’arborescence les liste quand même.
