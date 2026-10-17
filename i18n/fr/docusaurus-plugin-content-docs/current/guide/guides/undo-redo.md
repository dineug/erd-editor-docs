---
sidebar_position: 13
description: Annuler et rétablir des modifications, ce que l’historique enregistre, et le parcourir pas à pas avec le voyage dans le temps.
---

# Annuler et rétablir

Vous pouvez revenir à un état d’édition antérieur ou avancer vers un état ultérieur.  
L’historique conserve jusqu’à `2048` modifications.

- Annuler : `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac)
- Rétablir : `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Shift + Z` (Mac)

La barre d’outils propose les deux mêmes commandes sous la forme des boutons `Undo` et `Redo`, à côté de `Time Travel`.  
Ils ne sont actifs que lorsqu’il y a quelque chose à annuler ou à rétablir. Un éditeur `readonly` masque les trois, et les raccourcis y sont sans effet.

Annuler et Rétablir ne fonctionnent que dans l’onglet ERD. Ils sont indisponibles dans les onglets Visualisation, Schéma SQL, Générateur de code et Paramètres. Dans les champs `Before tables` et `After tables` de l’onglet Schéma SQL, les mêmes touches annulent et rétablissent plutôt votre saisie dans le champ.  
Les raccourcis sont aussi inactifs tant que la recherche rapide, `Table Properties`, `Diff Viewer`, l’aperçu de `Auto Layout`, la boîte de dialogue [`Export image`](./file-import-export.md#image), [Associer les colonnes](./relationship-editing.md#map-columns) ou le voyage dans le temps est ouvert.  
Ils continuent de fonctionner tant que le focus clavier se trouve n’importe où dans l’[explorateur](./explorer.md#keys-in-the-explorer), arborescence comprise, et tant que le [sélecteur de couleur](./table-related-functions.md#table-and-memo-color-specification) est ouvert. Même lorsque le point d’insertion se trouve dans l’un de leurs champs, comme Rechercher, Remplacer ou `Hex`, ils annulent et rétablissent les modifications du diagramme plutôt que celles du texte du champ.

L’historique est conservé en mémoire pour la session en cours. Il n’est pas enregistré dans le document, si bien qu’un diagramme rouvert démarre avec un historique vide.

![Déplacement d’une table et suppression d’une colonne avec ⌥ + Backspace, puis annulation des deux avec ⌘ + Z et rétablissement avec ⌘ + Shift + Z](/img/demo-undo-redo.webp)

## Ce que l’historique enregistre {#what-the-history-records}

Sont enregistrés :

- Tables et mémos : ajout, suppression, déplacement, couleur, nom et commentaire, texte et taille des mémos.
- Groupes de tables : ajout, suppression, déplacement, redimensionnement, nom, couleur et groupe auquel appartient chaque table (voir [Groupes de tables](./table-groups.md)).
- Colonnes : ajout, suppression, réorganisation et toutes les options de colonne.
- Relations : ajout, suppression, changement de type, colonnes définies dans [Associer les colonnes](./relationship-editing.md#map-columns) et chaque choix dans `On Delete` ou `On Update` (voir [ON DELETE et ON UPDATE](./relationship-editing.md#on-delete-and-on-update)). Annuler une suppression fait revenir la relation avec ses actions ON DELETE et ON UPDATE.
- Index et leurs colonnes.
- Position de la vue, niveau de zoom et options de `View Option`.
- Les scripts `Before tables` et `After tables` de l’onglet Schéma SQL, à raison d’une étape par modification appliquée en quittant le champ (voir [Scripts avant et après les tables](./schema-sql.md#before-and-after-scripts)).
- L’importation d’un fichier, et l’ajout d’un fichier avec [`Import and Add`](./file-import-export.md#import-and-add).

Ne sont pas enregistrés :

- Le SGBD et le nom de la base de données.
- Le langage du générateur de code, `Table Name Case` et `Column Name Case`.
- Le type de délimiteur, qu’il soit défini dans l’onglet Schéma SQL ou dans l’onglet Générateur de code.
- Les choix `Statements`, `Header` et `Tables` de l’onglet Schéma SQL, qui appartiennent à la fenêtre de l’éditeur (voir [Panneau des options](./schema-sql.md#options-panel)).
- Tout le contenu de l’onglet Paramètres, lignes [`Lock`](./settings.md#lock) comprises.
- Le thème et la langue d’affichage (voir [Langue et thème](./language-and-theme.md)).
- Quelle table, quel mémo ou quel groupe s’affiche devant les autres.
- L’[explorateur](./explorer.md) : son ouverture, sa fermeture ou son redimensionnement, le repli de son arborescence, ainsi que le texte et les options de recherche. Ce que modifient `Replace` et `Replace All` est toutefois enregistré, tout comme le défilement que produit un « aller à » (voir [Un geste, une étape](#one-gesture-one-step)).
- Le zoom et le déplacement de la vue dans l’onglet Visualisation, quel que soit le mode, le déplacement des nœuds du graphe ou des cartes du mode Flux, `Tidy Up`, l’affichage des lignes et la concentration sur des tables (voir [Le mode Flux ne modifie jamais le document](./visualization.md#flow-never-edits-the-document)).

Aucun de ces changements ne peut être annulé.

Les modifications provenant d’un autre éditeur ne sont pas enregistrées non plus, si bien qu’Annuler ne revient que sur les vôtres. Dans une [session collaborative](../../api/advanced/collaborative-editing.md), chaque éditeur annule ses propres modifications, et un agent de codage qui modifie le diagramme via le [serveur MCP](../../mcp/live-and-headless.md#undo) annule les siennes avec `erd_undo`.

Annuler un `Import`, qui remplace tout le diagramme, ramène le diagramme précédent tel que l’éditeur le contenait au moment de l’importation, avec chaque [verrou](./settings.md#lock) activé ou désactivé et chaque valeur verrouillée tels qu’ils étaient alors.  
Si `Viewport` était verrouillé dans ce diagramme, la vue et le zoom reviennent à la vue verrouillée, celle où s’ouvre le diagramme, plutôt qu’à l’endroit où vous vous trouviez. Si son `Viewport` était déverrouillé, ils reviennent à l’endroit où vous vous trouviez au moment de l’importation. Les autres paramètres verrouillés, comme l’onglet où vous vous trouvez ou le langage du générateur de code, restent tels qu’ils sont sur votre écran.  
Un nouveau diagramme démarre avec tous les verrous activés. Déverrouillez `Viewport` avant d’importer pour conserver votre vue lors d’une telle annulation. Le déverrouiller après coup, ou importer un fichier JSON dont le propre verrou `Viewport` est désactivé, ne change pas l’endroit où l’annulation vous ramène.

## Un geste, une étape {#one-gesture-one-step}

Tout ce que déclenche un même geste devient une seule entrée de l’historique.  
Coller plusieurs tables et mémos à la fois, ou les dupliquer avec `Alt + drag`, s’annule en une seule étape.

Un appui sur `Delete` ou `Backspace`, ou l’entrée `Delete selected` ou `Delete columns` d’un menu contextuel, constitue une seule étape, quel que soit le nombre de tables, de mémos, de groupes de tables ou de colonnes supprimés.  
Activer ou désactiver la clé primaire sur plusieurs colonnes sélectionnées constitue une seule étape, que ce soit avec `Alt + K` (Windows/Linux) ou `⌥ + K` (Mac) ou avec `Primary Key on selected columns` dans le menu contextuel d’une table.  
Définir la couleur de la sélection, ou la retirer avec `No color` ou `Remove color`, constitue une seule étape, quel que soit le nombre de tables, de mémos et de groupes sélectionnés. Choisir une couleur que possèdent déjà tous les éléments sélectionnés n’enregistre aucune étape, pas plus que `No color` lorsqu’aucun élément sélectionné n’a de couleur.  
`Map` ou `Save` dans [Associer les colonnes](./relationship-editing.md#map-columns) constitue une seule étape, y compris les colonnes de clé étrangère qu’il ajoute et les types de données qu’il modifie.  
`Import and Add` constitue une seule étape, y compris le défilement qui amène le bloc ajouté dans la vue lorsqu’il en faut un.

Créer un [groupe de tables](./table-groups.md), en le traçant ou en regroupant les tables sélectionnées avec `Group selected tables` ou `T` puis `G`, constitue une seule étape avec toutes les tables qu’il accueille. Supprimer un groupe constitue une seule étape, et annuler cette suppression fait revenir le groupe avec ses tables.  
Faire glisser un groupe par sa barre de titre déplace le groupe et toutes ses tables en une seule étape. Les tables déposées dans un groupe ou sorties d’un groupe changent de groupe dans la même étape que leur glissement si vous relâchez moins de `200ms` environ après le dernier mouvement, si bien qu’une seule annulation les remet à leur place et dans les groupes où elles se trouvaient. Après une pause plus longue avant de relâcher, le changement de groupe constitue une étape distincte, et la première annulation ne défait que lui.  
Le redimensionnement d’un groupe par un bord ou un coin est enregistré une seule fois, lorsque vous relâchez.  
Appliquer la [disposition automatique](./table-related-functions.md#auto-layout) constitue une seule étape, ajustement des groupes autour de leurs tables compris.

`Replace All` dans [Rechercher et remplacer](./find-and-replace.md#replacing) constitue lui aussi une seule étape, quel que soit le nombre de noms de table, de noms de colonne, de noms d’index, de noms de groupe de tables, de commentaires et de mémos modifiés. Lorsqu’il ne change rien, comme lorsque `Preserve Case` réécrit chaque correspondance à l’identique, il n’enregistre aucune étape.  
Un `Replace` isolé constitue une seule étape, y compris le défilement jusqu’à la correspondance suivante lorsque celle-ci en nécessite un. Lorsqu’il réécrit sa correspondance à l’identique, il n’enregistre que ce défilement, ou rien s’il n’y en a pas.  
Aller à une correspondance ne fait défiler le canevas que si la correspondance n’est pas déjà bien visible (voir [Où aboutit un saut](./table-related-functions.md#where-a-jump-lands)). Ce défilement est enregistré comme tout autre changement de position de la vue, si bien qu’après un parcours des correspondances, Annuler défait d’abord ces défilements, un par étape.  
Les autres « aller à » qui aboutissent sur le canevas enregistrent leurs défilements de la même façon : choisir une ligne dans l’explorateur, un résultat de la recherche rapide ou le [bouton de carte](./visualization.md#card-buttons) de lien externe en mode Flux. Un « aller à » qui laisse la vue en place n’enregistre rien. Choisir une ligne dans la liste de `Diff Viewer` n’enregistre rien non plus, puisque cela ne déplace que les côtés en lecture seule propres à la visionneuse de différences.

Un glissement continu, un déplacement de la vue du canevas, un zoom, un pincement ou un changement de couleur est mis en mémoire tampon pendant `200ms` environ et forme lui aussi une seule entrée.  
Un glissement de moins de `20px` au total n’enregistre aucun déplacement. Seul le changement de groupe qu’il entraîne, le cas échéant, est enregistré.

Dans une cellule ou un mémo, la saisie est enregistrée entrée par entrée plutôt que geste par geste : chaque caractère saisi, chaque collage et chaque étape d’une composition IME constitue une étape distincte.  
Le nom d’un groupe de tables est enregistré une seule fois, lorsque `Enter` ou la sortie du champ le valide, si bien que le nom saisi dans un groupe que vous venez de créer constitue une étape distincte de sa création. `Esc`, ou un nom laissé inchangé, n’enregistre rien.

## Voyage dans le temps {#time-travel}

Le voyage dans le temps s’ouvre avec le bouton `Time Travel` de la barre d’outils, à côté d’Annuler et de Rétablir.  
Le bouton est sans effet tant que la session ne compte aucune modification enregistrée.

Le voyage dans le temps ouvre une copie distincte du diagramme, en lecture seule, à la position de défilement et au niveau de zoom qu’affiche le canevas, que le verrou `Viewport` soit activé ou non.  
Faites glisser le curseur, ou cliquez n’importe où sur sa piste, pour parcourir tout l’historique des modifications et prévisualiser chaque point. La position la plus à gauche du curseur correspond à l’état situé une étape avant la première modification enregistrée, et il s’ouvre avec sa poignée sur l’état actuel.  
L’aperçu est inerte : il dessine une minicarte, mais vous ne pouvez ni y déplacer la vue, ni le faire défiler, ni le modifier, et le document réel reste intact tant que vous n’appliquez pas.

Appuyez sur `Apply` pour restaurer le point sélectionné, ou sur `Cancel` ou `Esc` pour laisser le document inchangé.

![Ouverture du voyage dans le temps, glissement du curseur en arrière dans la session et application d’un point antérieur](/img/demo-time-travel.webp)
