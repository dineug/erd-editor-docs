---
sidebar_position: 11
description: "Explorer le schéma sous forme de graphe dirigé par les forces ou de flux de cartes de tables : zoomer et déplacer la vue, mettre en surbrillance les tables liées à une table, se concentrer sur quelques tables à la fois et revenir en arrière parmi les vues restreintes précédentes."
---

# Visualisation

Affiche tout le document d’un coup d’œil, dans l’un des deux modes suivants :

- `Graph`, un graphe dirigé par les forces représentant chaque table, ses colonnes et les relations entre les tables (voir [Mode Graphe](#graph-mode)).
- `Flow`, où chaque table est dessinée sous forme de carte et disposée selon ses relations (voir [Mode Flux](#flow-mode)).

Ouvrez-la depuis l’onglet `Visualization` de la barre d’outils en haut, ou depuis la [recherche rapide](./quick-search.md), sous `Tab`.  
Depuis l’onglet ERD, `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac) et l’entrée `Focus on this table` du menu contextuel d’une table l’ouvrent directement en mode `Flow`, restreinte aux tables que vous avez choisies et aux tables situées à une relation d’elles (voir [Se concentrer sur des tables](#focusing-on-tables)).

Changez de mode avec les boutons `Graph` et `Flow`, à l’extrémité gauche de la [barre d’outils](#toolbar).  
Un éditeur nouvellement ouvert démarre en mode `Graph`. Le mode choisi est conservé tant que l’éditeur reste ouvert, même après un passage par d’autres onglets, mais il n’est pas enregistré dans le document.

## Barre d’outils {#toolbar}

Une barre d’outils flotte au milieu du bord inférieur de l’onglet. De gauche à droite :

- `Graph` et `Flow`, avec le mode actuel mis en évidence.
- `Previous table` et `Next table`, en mode `Flow` uniquement : une flèche vers la gauche et une flèche vers la droite qui reviennent en arrière et avancent parmi les tables auxquelles le mode Flux a été restreint (voir [Table précédente et table suivante](#previous-table-and-next-table)). Chacune est grisée tant qu’il n’y a rien vers quoi aller dans ce sens.
- `Zoom out`, le niveau de zoom actuel en pourcentage, comme `100%`, et `Zoom in`. Chaque appui modifie le zoom de 4 points de pourcentage, en gardant le milieu de l’écran en place. Le pourcentage indique le zoom du mode dans lequel vous êtes, et un clic dessus ramène ce zoom à `100%`.
- `Fit`, qui ramène dans la vue tout ce que le mode affiche : chaque nœud en mode `Graph`, chaque carte en mode `Flow`.
- `Tidy Up`, en mode `Flow` uniquement, qui dispose à nouveau les cartes (voir [Disposition en mode Flux](#how-flow-is-placed)).
- Le menu d’affichage des lignes, en mode `Flow` uniquement, dont l’étiquette indique le choix actuel (voir [Affichage des lignes](#row-display)).
- La liste `Name View`, en mode `Flow` uniquement, dont l’étiquette indique la vue active (voir [Noms sur les cartes](#names-on-the-cards)).
- `Show all`, en mode `Flow` uniquement et seulement tant que la vue est restreinte, qui revient au diagramme entier (voir [Se concentrer sur des tables](#focusing-on-tables)).
- La boussole `Go to content`, qui s’ajoute à l’extrémité de la barre d’outils seulement tant qu’aucun nœud ni aucune carte n’est à l’écran. Elle affiche une flèche pointant vers le nœud ou la carte le plus proche, ainsi que sa distance, comme `1.2k`. Cliquez dessus pour centrer ce nœud ou cette carte sans changer le zoom.

Les boutons de zoom et les deux flèches indiquent leur raccourci dans leur info-bulle, par exemple `Zoom in (Ctrl + Plus)` (Windows/Linux) ou `Zoom in (⌘ + Plus)` (Mac), et `Previous table (Ctrl + Z)` (Windows/Linux) ou `Previous table (⌘ + Z)` (Mac).  
`Ctrl + Plus` et `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` et `⌘ + Minus` (Mac) font varier le zoom par paliers comme les boutons, dans les deux modes, et `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) revient directement à `100%`. En mode `Flow`, `Ctrl + Z` et `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Z` et `⌘ + Shift + Z` (Mac) agissent comme les deux flèches.  
Un clic sur le pourcentage a le même effet que `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac), et son info-bulle indique ce raccourci. Les raccourcis sont sans effet tant que la recherche rapide est ouverte.

## Mode Graphe {#graph-mode}

Dessine tout le document sous forme de graphe dirigé par les forces, afin que vous puissiez voir d’un coup d’œil comment les tables sont liées entre elles et lesquelles occupent le centre d’un domaine.

![Ouverture du mode Graphe, survol d’une table pour afficher son aperçu, glissement d’un nœud, puis zoom arrière et retour en zoom avant](/img/demo-visualization.webp)

### Lire le graphe {#reading-the-graph}

Chaque table et chaque colonne est un nœud, et les deux types sont dessinés dans des couleurs différentes. Les mémos et les [groupes de tables](./table-groups.md) ne sont pas dessinés.  
Chaque nœud de colonne est relié à la table à laquelle il appartient, et deux tables jointes par une relation sont reliées l’une à l’autre.  
Des tables jointes par plusieurs relations dans le même sens ne sont reliées qu’une seule fois, et une relation qui commence et se termine sur la même table ne trace aucun lien.

Les noms des tables apparaissent sur le graphe lors d’un zoom avant, en fondu entre `50%` et `100%`, et un nom de plus de 15 caractères est tronqué. Les nœuds de colonne ne portent aucune étiquette, quel que soit le zoom.  
Les étiquettes suivent l’affichage des noms (voir [Au-delà du canevas](./logical-names.md#beyond-the-canvas)). Dans la vue `Both Names`, une étiquette place le nom logique sur une ligne et le nom sur la ligne en dessous, et chaque ligne est tronquée séparément.

### Se déplacer en mode Graphe {#getting-around-the-graph}

La molette zoome autour du point situé sous le pointeur, de `10%` à `400%`.  
Un pincement sur le pavé tactile zoome de la même façon, et deux doigts sur un écran tactile zooment autour du point situé entre eux et déplacent la vue à mesure qu’ils bougent.  
Faites glisser l’arrière-plan pour déplacer la vue, ou faites glisser avec le bouton central de la souris depuis n’importe où, nœud compris, comme sur le [canevas ERD](./table-related-functions.md#getting-around-the-canvas). Un glissement avec le bouton central ne fait que déplacer la vue : il n’entraîne jamais de nœud.

Les boutons de zoom de la [barre d’outils](#toolbar) et les raccourcis de zoom gardent au contraire le milieu de l’écran fixe, dans la même plage, et `Fit` ramène tous les nœuds dans la vue.

### Aperçu au survol {#hover-preview}

Survolez un nœud de table pour afficher un aperçu de cette table, à côté du curseur.  
Le survol d’un nœud de colonne trace seulement un cercle autour de lui ; aucun aperçu ne s’ouvre.

L’aperçu affiche les mêmes colonnes et les mêmes cellules que le canevas ERD, dans le même ordre, et les nomme comme le fait le canevas dans l’affichage des noms où vous vous trouvez (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options), [Modifier l’ordre des colonnes](./settings.md#adjusting-column-order) et [Affichage des noms](./logical-names.md#name-view)).  
Avec l’option d’affichage `Alternate Key` activée, chaque colonne d’une [clé alternative](./table-related-functions.md#alternate-keys) porte sa marque, comme `AK1.1`, en dernier dans sa ligne, et l’aperçu s’élargit pour l’accueillir, comme le fait la table sur le canevas ERD.  
Contrairement à une table sur le canevas ERD, son en-tête ne prend jamais la couleur du [groupe](./table-groups.md#coloring-a-group) de la table, et ses noms ne portent jamais les [marques](./dictionary.md#marks-on-the-canvas) que les vérifications du dictionnaire placent sur le canevas.  
L’aperçu ne sert qu’à l’affichage, et il est masqué pendant que vous faites glisser un nœud ou déplacez la vue.

### Mettre en évidence un voisinage {#highlighting-a-neighbourhood}

Le survol d’une table met aussi en surbrillance son voisinage : la table elle-même, ses propres colonnes, les tables que ses relations rejoignent dans un sens comme dans l’autre, et les liens qui les relient.  
Tout le reste du graphe s’estompe, si bien que ce que touche la table ressort seul.

### Déplacer les nœuds {#moving-nodes}

Faites glisser un nœud avec le bouton gauche de la souris pour l’entraîner, avec tout ce qui lui est relié, vers une nouvelle position.  
Le nœud reste fixé sous le pointeur tant que vous le maintenez, et la disposition se remet en mouvement autour de lui.  
Il se stabilise à nouveau quand vous le relâchez : rien ne reste fixé là où vous l’avez déposé.  
Un appui ou un glissement avec le bouton droit sur un nœud ne l’entraîne pas et ne déplace pas non plus la vue.

### Le graphe est un instantané {#the-graph-is-a-snapshot}

Le graphe est construit à partir du document tel qu’il est au moment où vous ouvrez cet onglet, et il est entièrement reconstruit chaque fois que vous y revenez.  
Passer de `Flow` à `Graph` le reconstruit également, et chaque reconstruction repart de `100%`.

## Mode Flux {#flow-mode}

Dessine chaque table sous forme de carte et dispose les cartes selon leurs relations. Les mémos et les [groupes de tables](./table-groups.md) ne sont pas dessinés.  
Il ne s’agit pas du placement `Flow` de la [disposition automatique](./table-related-functions.md#auto-layout), qui déplace les tables dans l’onglet ERD lui-même.

Chaque carte est dessinée comme une table de l’onglet ERD : la couleur de la table le long de son bord gauche, un bandeau d’en-tête avec une icône de table et les noms de la table tels que les montre l’[affichage des noms](#names-on-the-cards), puis les lignes que demande son [affichage des lignes](#row-display). Contrairement à une table de l’onglet ERD, une carte trace aussi un trait entre ses lignes, et son en-tête ne prend jamais la couleur du [groupe](./table-groups.md#coloring-a-group) de la table. Les cartes gardent cet aspect à tous les niveaux de zoom et ne se réduisent jamais à leur nom comme le font les tables de l’onglet ERD à `70%` et en dessous. Aucun élément d’une carte n’est modifiable.

Un connecteur est une seule courbe régulière d’une table à l’autre, dessinée sous les cartes, si bien qu’il peut passer derrière l’une d’elles. Une relation d’une table vers elle-même s’incurve autour du coin supérieur droit de la carte, comme dans l’onglet ERD (voir [Tracé des connecteurs](./relationship-editing.md#connector-routing)). Chaque connecteur est dessiné avec le même trait gris continu, que la relation soit identifiante ou non, avec les mêmes marques d’extrémité que dans l’onglet ERD (voir [Lire un connecteur](./relationship-editing.md#reading-a-connector)). Le mode Flux dessine les connecteurs même lorsque l’[option d’affichage](./table-related-functions.md#table-view-options) `Relationship` est désactivée. Il ne dessine jamais les étiquettes `D:` et `U:` des actions ON DELETE et ON UPDATE d’une relation et n’affiche jamais l’info-bulle qui les détaille, quel que soit le réglage de l’option d’affichage `Referential Actions`.

Sur l’ensemble du diagramme, les tables qu’aucune relation ne relie à une autre table sont regroupées en un seul bloc au lieu d’être dispersées parmi les autres.

![Passage en mode Flux, survol de la table orders pour la mettre en surbrillance avec ses voisines, épinglage de la surbrillance, choix de Keys only, puis zoom avant avec ⌘ + Wheel et appui sur Fit](/img/demo-visualization-flow.webp)

### Affichage des lignes {#row-display}

Le menu d’affichage des lignes de la [barre d’outils](#toolbar) définit quelle part de chaque carte est dessinée. Son étiquette est le choix actuel, et son info-bulle indique par exemple `Row display: Name only`.  
Le menu s’ouvre au-dessus de la barre d’outils, avec une coche à côté du choix actuel. Il se ferme lorsque vous choisissez une option, cliquez à nouveau sur l’étiquette, cliquez n’importe où ailleurs dans l’éditeur, appuyez sur `Escape` ou passez en mode `Graph`.

| Affichage des lignes | Ce que montre chaque carte |
| --- | --- |
| `Name only` | L’en-tête seul. |
| `Keys only` | Les colonnes de clé primaire et de clé étrangère, plus toute autre colonne sur laquelle aboutit une relation. |
| `All fields` | Toutes les colonnes. |

Les lignes suivent l’ordre des colonnes de la table. Chaque ligne affiche le nom de la colonne, précédé d’une icône de clé lorsque la colonne est une clé primaire, une clé étrangère ou les deux, et le type de données à droite, que la carte soit [en surbrillance](#lighting-related-tables) ou non. L’[affichage des noms](#names-on-the-cards) détermine quels noms affiche une ligne et si elle affiche le domaine de la colonne.  
Aucune autre cellule ni marque de clé alternative n’est dessinée, et ni les [Options d’affichage des tables](./table-related-functions.md#table-view-options) ni [Modifier l’ordre des colonnes](./settings.md#adjusting-column-order), qui ordonne les cellules d’une ligne, ne s’appliquent aux cartes.

À sa première ouverture, le mode Flux démarre sur `Name only`, ou sur `Keys only` s’il a été ouvert pour [se concentrer sur des tables](#focusing-on-tables). Ensuite, l’affichage des lignes ne change que lorsque vous en choisissez un autre, et restreindre ou élargir la vue le conserve.  
Changer l’affichage des lignes redimensionne les cartes, si bien que le mode Flux les dispose à nouveau et les ajuste à l’écran.

### Noms sur les cartes {#names-on-the-cards}

Une carte nomme sa table et ses colonnes selon l’affichage des noms, celui-là même dans lequel dessine l’onglet ERD (voir [Affichage des noms](./logical-names.md#name-view)).  
Changez de vue ici avec la liste `Name View` de la [barre d’outils](#toolbar). Son bouton indique la vue active, `Physical Names`, `Logical Names` ou `Both Names`, et son info-bulle indique `Name View`. La liste s’ouvre au-dessus de la barre d’outils, avec une coche à côté de la vue active, et se ferme comme le menu d’[affichage des lignes](#row-display). Un choix change la vue de tout l’éditeur, onglet ERD compris, comme un changement de vue effectué n’importe où ailleurs (voir [Changer de vue](./logical-names.md#switching-the-view)).

Les cartes disposent leurs cellules selon le seul affichage des noms. Aucune [option d’affichage](./table-related-functions.md#table-view-options) ne les modifie, `Domain` compris :

| Affichage des noms | En-tête | Chaque ligne |
| --- | --- | --- |
| `Physical Names` | Le nom de la table. | Le nom de la colonne, puis le type de données. |
| `Logical Names` | Le nom logique de la table. | Le nom logique de la colonne, puis le nom de son [domaine](./dictionary.md#domains-and-data-types), ou son type de données tant qu’elle n’en a pas. |
| `Both Names` | Le nom logique, puis le nom de la table, atténué. | Le nom logique, le nom, le domaine et le type de données. |

Tant qu’un nom logique est vide, la vue `Logical Names` affiche le nom à sa place, grisé, ou le texte indicatif `table` ou `column` lorsque le nom est vide lui aussi, et la vue `Both Names` affiche le texte indicatif grisé `logical`. Dans la vue `Both Names`, une colonne sans domaine affiche le texte indicatif grisé `domain`.  
Une carte ne porte jamais les [marques](./dictionary.md#marks-on-the-canvas) que les vérifications du dictionnaire placent sur les noms dans l’onglet ERD.  
Changer de vue redimensionne les cartes, si bien que le mode Flux les dispose à nouveau (voir [Disposition en mode Flux](#how-flow-is-placed)).

### Se déplacer en mode Flux {#getting-around-the-flow}

La molette déplace la vue, et `Shift + Wheel` la déplace latéralement. `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) zoome en gardant le milieu de l’écran en place.  
Un pincement sur le pavé tactile zoome autour du point où vous pincez, et deux doigts sur un écran tactile zooment autour du point situé entre eux et déplacent la vue à mesure qu’ils bougent.  
Faites glisser l’arrière-plan pour déplacer la vue, ou faites glisser avec le bouton central de la souris depuis n’importe où, carte comprise. Un glissement avec le bouton central ne fait que déplacer la vue et laisse la sélection telle quelle. Le déplacement de la vue n’a pas de limites, comme sur le [canevas ERD](./table-related-functions.md#getting-around-the-canvas).  
Le zoom va de `10%` à `150%`. Le mode Flux conserve son propre zoom et sa propre position de la vue, distincts de ceux de l’onglet ERD, et aucun des deux n’est enregistré dans le document.

Un appui sur l’arrière-plan efface la sélection, et `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) sur l’arrière-plan trace un rectangle de sélection.  
Le mode Flux n’a ni minicarte ni barres de défilement. Lorsqu’un déplacement de la vue ne laisse plus aucune carte à l’écran, utilisez la boussole `Go to content` de la [barre d’outils](#toolbar).

### Mettre en surbrillance les tables liées {#lighting-related-tables}

Survolez une carte pour la mettre en surbrillance, ainsi que les tables situées à une relation d’elle et les connecteurs qui la relient à ces tables. Un connecteur entre deux de ces tables reste sans surbrillance.  
Une carte en surbrillance reçoit une bordure et un halo de la couleur d’accentuation, et celles de ses lignes sur lesquelles aboutit une relation sont teintées. Un connecteur en surbrillance prend la couleur d’accentuation.  
Rien d’autre ne s’estompe, contrairement au [mode Graphe](#highlighting-a-neighbourhood), et rien n’est en surbrillance tant qu’aucune carte n’est survolée ni épinglée.

Cliquez sur une carte pour épingler sa surbrillance, afin qu’elle reste en surbrillance quand le pointeur s’éloigne. Cliquez à nouveau sur la même carte, ou cliquez sur l’arrière-plan, pour la relâcher ; un clic sur une autre carte y déplace l’épinglage. La carte survolée et la carte épinglée sont mises en surbrillance ensemble.  
Le glissement, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac), le déplacement de la vue et les [boutons des cartes](#card-buttons) ne permettent ni d’épingler ni de relâcher une carte.

Des particules parcourent chaque connecteur en surbrillance, de l’extrémité de la table parente, où se trouve la clé primaire, à l’extrémité de la table enfant. Lorsque plus de 60 connecteurs sont en surbrillance à la fois, les particules s’arrêtent et la surbrillance demeure.

### Boutons des cartes {#card-buttons}

Tant que le pointeur est sur une carte, deux boutons à icône, tous deux sans info-bulle, apparaissent à l’extrémité droite de son en-tête :

- L’icône de points de passage, la même que celle du bouton `Flow`, restreint le mode Flux à cette table et aux tables situées à une relation d’elle (voir [Se concentrer sur des tables](#focusing-on-tables)). Ce que le mode Flux affichait auparavant reste à un appui sur `Previous table` (voir [Table précédente et table suivante](#previous-table-and-next-table)).
- L’icône de lien externe passe à l’onglet ERD, sélectionne uniquement cette table, la met au premier plan et place la cellule active sur son nom, ou sur son nom logique dans les vues `Logical Names` et `Both Names`, sauf si la cellule active se trouve déjà dans cette table. Le canevas ne défile jusqu’à la table que si elle n’est pas déjà bien visible (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)). Elle ne démarre ni ne termine jamais le tracé d’une relation.

Un appui sur l’un ou l’autre bouton ne concerne que le bouton : contrairement à un appui ailleurs sur la carte, il ne sélectionne pas la carte et ne la met pas au premier plan. Le bouton de points de passage laisse donc la sélection que vous aviez ; le bouton de lien externe ne sélectionne la table que dans le cadre de son passage à l’onglet ERD. Seul un clic gauche actionne l’un ou l’autre bouton.

### Déplacer les cartes {#moving-cards}

Faites glisser une carte avec le bouton gauche de la souris en la saisissant n’importe où, sauf sur ses deux boutons ; un glissement avec le bouton droit ne déplace rien.  
Un appui sur une carte la sélectionne, `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) l’ajoute à la sélection, et faire glisser une carte sélectionnée déplace toutes les cartes sélectionnées. La sélection est celle qu’utilise l’onglet ERD, si bien que ce que vous sélectionnez ici reste sélectionné lorsque vous y retournez.

Une carte ne se déplace qu’en mode Flux : sa table reste à sa place dans l’onglet ERD.  
Une carte déplacée reste en place malgré les déplacements de la vue, les zooms et `Fit`. Elle revient là où la disposition l’avait placée lorsque vous quittez l’onglet ou passez en mode `Graph` puis revenez, et lorsque `Show all` ou une [étape](#previous-table-and-next-table) revient à une disposition que le mode Flux possède déjà. Une nouvelle disposition la place à nouveau, en tenant compte de l’endroit où vous l’avez laissée (voir [Disposition en mode Flux](#how-flow-is-placed)).

### Se concentrer sur des tables {#focusing-on-tables}

Dans l’onglet ERD, sélectionnez une ou plusieurs tables et appuyez sur `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac), ou cliquez avec le bouton droit sur une table et choisissez `Focus on this table`.  
L’onglet Visualisation s’ouvre en mode `Flow`, restreint à ces tables et à toutes les tables situées à une relation de l’une d’elles, dans un sens comme dans l’autre. Seuls les connecteurs entre les tables affichées sont dessinés.

Lorsque la table sur laquelle vous cliquez avec le bouton droit fait partie de plusieurs tables sélectionnées, l’entrée indique `Focus on selected tables` et concentre la vue sur toute la sélection. Un clic droit sur une table hors de la sélection concentre la vue sur cette seule table.  
`Alt + F` prend les tables sélectionnées et laisse de côté les mémos et les [groupes de tables](./table-groups.md). Sans table sélectionnée, il ne fait rien, même si un groupe est sélectionné : choisissez d’abord `Select tables` dans le menu contextuel du groupe (voir [Sélectionner des groupes](./table-groups.md#selecting-groups)).  
Il est ignoré pendant la modification d’une cellule, d’un mémo ou du nom d’un groupe, lorsque le focus clavier est dans l’[explorateur](./explorer.md#keys-in-the-explorer), ou lorsque la recherche rapide, la boîte de dialogue Propriétés de la table, la visionneuse de différences, l’aperçu de la disposition automatique, le voyage dans le temps, la boîte de dialogue [`Export image`](./file-import-export.md#image) ou [`Map Columns`](./relationship-editing.md#map-columns) est ouverte.

En mode Flux, le [bouton de carte](#card-buttons) de points de passage restreint la vue de la même façon, à cette seule table. `Show all` de la [barre d’outils](#toolbar) revient au diagramme entier. `Previous table` et `Next table` de la barre d’outils, ou leurs touches, reviennent en arrière et avancent parmi les vues restreintes successives du mode Flux (voir [Table précédente et table suivante](#previous-table-and-next-table)).  
Une vue restreinte est disposée séparément et ajustée à l’écran. Elle reste restreinte lorsque vous quittez l’onglet ou passez en mode `Graph` puis revenez, et `Escape` ne l’élargit pas.

![Concentration sur la table orders avec ⌥ + F, restriction à members avec le bouton de points de passage de sa carte, puis Show all](/img/demo-visualization-focus.webp)

### Table précédente et table suivante {#previous-table-and-next-table}

Le mode Flux mémorise ce à quoi il a été restreint, comme l’historique d’un navigateur. Chaque fois que la vue passe à d’autres tables, par la [concentration sur des tables](#focusing-on-tables) depuis l’onglet ERD, par le [bouton de carte](#card-buttons) de points de passage ou par `Show all`, ce qu’elle affichait auparavant est conservé comme une étape en arrière, qu’il s’agisse de quelques tables ou du diagramme entier.

![Restriction du mode Flux à orders avec ⌥ + F puis à members, retour en arrière avec Previous table, avance avec ⌘ + Shift + Z et retour avec ⌘ + Z, puis Show all](/img/demo-visualization-steps.webp)

- `Previous table` dans la [barre d’outils](#toolbar) revient d’une étape en arrière, et `Next table` avance de nouveau vers ce que `Previous table` a quitté.
- En mode `Flow`, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) revient en arrière comme `Previous table`, et `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac) avance comme `Next table`. Ils n’y annulent ni ne rétablissent jamais une modification du diagramme. En mode `Graph`, et tant que la recherche rapide est ouverte, ils ne font rien.
- Restreindre la vue ou appuyer sur `Show all` après être revenu en arrière abandonne les étapes en avant. Se concentrer de nouveau exactement sur les tables auxquelles le mode Flux est déjà restreint n’ajoute aucune étape et n’en abandonne aucune.
- Les 100 dernières étapes en arrière sont conservées, et la plus ancienne disparaît en premier.

Une étape affiche celles de ses tables qui figurent encore dans le diagramme, avec toutes les tables situées à une relation d’elles, comme le fait une concentration. Une étape dont toutes les tables ont été supprimées est ignorée et abandonnée, de même qu’une étape qui laisserait le mode Flux là où il en est : sur les tables mêmes auxquelles il est restreint actuellement, ou sur le diagramme entier alors que le mode Flux l’affiche déjà.  
Un bouton est grisé, et sans effet, tant qu’il ne reste aucune étape dans ce sens. Les deux sont grisés à la première ouverture du mode Flux, que ce soit sur le diagramme entier ou sur les tables avec lesquelles une concentration l’a ouvert. Une fois le mode Flux ouvert, une concentration ultérieure depuis l’onglet ERD conserve comme étape en arrière ce que le mode Flux affichait lorsque vous l’avez quitté.  
Une étape est disposée et ajustée à l’écran comme une concentration (voir [Disposition en mode Flux](#how-flow-is-placed)), et l’affichage des lignes reste tel quel.

Les étapes sont propres au mode Flux. Elles sont conservées tant que l’éditeur est ouvert, y compris lors des passages par d’autres onglets et par le mode `Graph`, mais elles ne sont ni enregistrées dans le document ni envoyées aux collaborateurs, et elles n’ajoutent rien à l’historique d’annulation. Le remplacement de tout le document les abandonne avec le reste du mode Flux.

Dans une langue d’affichage de droite à gauche, la barre d’outils conserve son ordre et les deux flèches échangent leur rôle, si bien que `Previous table` est la flèche pointant vers la droite. Les touches restent les mêmes (voir [Langues de droite à gauche](./language-and-theme.md#right-to-left-languages)).

### Disposition en mode Flux {#how-flow-is-placed}

La première fois que le mode `Flow` est affiché, les tables qu’il montre sont disposées hors du thread principal, et le résultat est ajusté à l’écran.  
La disposition est conservée tant que l’éditeur est ouvert. Si vous quittez l’onglet ou passez en mode `Graph` puis revenez, le mode Flux la réutilise, avec le zoom et la position de la vue là où vous les aviez laissés.  
Le mode Flux conserve une disposition pour le diagramme entier et une pour les tables auxquelles il a été restreint en dernier, si bien que `Show all` revient à la disposition du diagramme entier et l’ajuste à l’écran sans la recalculer, tant que rien de ce qui a servi à l’établir n’a changé. Une [étape](#previous-table-and-next-table) vers le diagramme entier, ou vers les tables auxquelles le mode Flux a été restreint en dernier, réutilise cette disposition de la même façon.

Le mode Flux dispose à nouveau les cartes lorsque :

- Vous appuyez sur `Tidy Up`. Le résultat est ajusté à l’écran.
- Vous changez l’affichage des lignes, restreignez la vue à d’autres tables, ou passez à d’autres tables avec `Previous table` ou `Next table`. Le résultat est ajusté à l’écran.
- Vous choisissez une autre vue dans la liste `Name View`. Le résultat est ajusté à l’écran.
- Des tables ou des relations sont ajoutées ou supprimées, ou l’affichage des noms change de vue : pendant que vous êtes hors du mode Flux, ce qui est pris en compte à votre retour, ou par un collaborateur pendant que vous êtes en mode Flux. Le zoom et la position de la vue restent inchangés.

Chaque disposition tient compte de l’emplacement actuel des cartes, si bien que `Tidy Up` ne rétablit pas nécessairement un agencement antérieur.  
Une modification qui ne fait que redimensionner une carte, comme renommer une table, écrire un nom logique ou ajouter une colonne, ne dispose pas à nouveau les cartes. Appuyez sur `Tidy Up` si des cartes finissent par se chevaucher.

Une disposition qui prend plus de 6 secondes affiche un message `Placing tables`, avec une icône de chargement qui tourne et `Cancel`.  
`Cancel`, ou `Escape` à tout moment pendant le calcul de la disposition, l’abandonne ; `Tidy Up`, ou un retour au mode `Flow`, la redemande.  
Si une disposition échoue (l’hôte n’exécute aucun worker partagé, le worker ne démarre pas, ou aucune disposition n’est renvoyée dans les 60 secondes), le mode Flux affiche un message `Could not place tables` avec un signe d’avertissement, et `Tidy Up` réessaie. Voir [Web Workers](../../api/installation.md#web-workers).  
Le mode Flux ne dessine que les tables placées par sa dernière disposition, aussi bien sur le diagramme entier que dans une vue restreinte, si bien que la première fois qu’il est affiché, il peut n’y avoir aucune carte tant qu’une disposition n’a pas réussi.  
Chaque fois que le mode Flux dispose à nouveau les cartes, par exemple lorsque vous restreignez la vue à d’autres tables, l’agencement précédent reste à l’écran jusqu’à l’arrivée de la nouvelle disposition, et il y reste si cette disposition est annulée ou échoue.

Lorsque tout le document est remplacé, par exemple par l’importation d’un fichier, les dispositions, la vue restreinte, les étapes `Previous table` et `Next table`, l’affichage des lignes, le zoom et la position de la vue du mode Flux sont abandonnés, et la prochaine fois que vous ouvrez le mode Flux, il repart comme la première fois : sur le diagramme entier, ou restreint si vous l’ouvrez pour [vous concentrer sur des tables](#focusing-on-tables).

### Le mode Flux ne modifie jamais le document {#flow-never-edits-the-document}

Le mode Flux ne fait que lire le diagramme. Le zoom, le déplacement de la vue, le déplacement des cartes, `Tidy Up`, l’affichage des lignes, les épinglages, la concentration sur des tables et le parcours avec `Previous table` et `Next table` n’ajoutent rien à l’[historique d’annulation](./undo-redo.md#what-the-history-records).  
Ils ne modifient rien non plus dans le diagramme. Un appui sur une carte met bien sa table au premier plan, comme le fait un clic sur une table de l’onglet ERD, si bien qu’elle y est aussi au premier plan, mais l’ordre d’empilement n’est pas enregistré (voir [Déplacer plusieurs tables](./table-related-functions.md#moving-multiple-tables)). Le mode `Graph` laisse de même le diagramme intact.  
La liste `Name View` fait exception, et seulement tant que le [verrou](./settings.md#lock) `Name View` est désactivé : un choix change alors l’affichage des noms du diagramme, qui est enregistré et que suivent les collaborateurs. Tant que le verrou est activé, comme c’est le cas par défaut, un choix ne modifie que votre propre écran. Dans les deux cas, il n’ajoute rien à l’historique d’annulation.  
Un appui sur une carte n’ajoute jamais de relation. Si vous avez quitté l’onglet ERD pendant le tracé d’une relation, un appui sur une carte choisit sa table comme point de départ si aucune n’a encore été choisie, et sinon met fin au tracé.  
Le [bouton de carte](#card-buttons) de lien externe va plus loin, car il vous fait sortir du mode Flux : lorsque l’onglet ERD doit défiler jusqu’à la table, ce défilement est enregistré comme tout autre changement de position de la vue.

Les modifications des collaborateurs continuent d’atteindre le diagramme pendant que vous êtes en mode Flux, et les cartes suivent les tables et les relations qu’ils ajoutent ou suppriment (voir [Disposition en mode Flux](#how-flow-is-placed)).  
Leurs contours de sélection et de focus sont dessinés sur les cartes, mais pas leurs curseurs ni leurs rectangles de sélection (voir [Édition collaborative](../../api/advanced/collaborative-editing.md)).

Les deux modes, y compris la concentration sur des tables et le parcours des étapes, fonctionnent aussi dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), de même que la liste `Name View`, qui n’y change que votre propre écran.  
Sur l’onglet ERD d’un éditeur en lecture seule, le menu de la table ne contient que `Table Properties` et un appui ne sélectionne aucune table : concentrez-vous donc avec `Alt + F` (Windows/Linux) ou `⌥ + F` (Mac) sur la table qu’un saut depuis l’[explorateur](./explorer.md#going-to-a-row) ou la [recherche rapide](./quick-search.md) a sélectionnée.
