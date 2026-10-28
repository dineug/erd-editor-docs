---
sidebar_position: 4
description: Donner des noms logiques aux tables et aux colonnes, afficher les noms physiques, les noms logiques ou les deux avec l’affichage des noms, compléter les noms des termes pendant la saisie, lier des colonnes à des domaines, et voir les autres endroits où les noms suivent la vue.
---

# Noms logiques

Une table et chacune de ses colonnes peuvent avoir un nom logique à côté de leur nom. Le nom logique est celui que lisent les gens, comme `Customer Name` pour `CUST_NM`. Le nom lui-même est le nom physique, celui qu’écrivent l’onglet [Schéma SQL](./schema-sql.md) et le [générateur de code](./code-generator.md).  
L’affichage des noms détermine lequel des deux dessine le canevas ERD : les noms, les noms logiques ou les deux (voir [Affichage des noms](#name-view)).  
Un nom logique peut aussi donner à sa table ou à sa colonne un nom physique, dérivé des mots et des termes de l’onglet [Dictionnaire](./dictionary.md) (voir [Dériver les noms physiques](./dictionary.md#deriving-physical-names)).  
Une colonne peut être liée à un domaine, un type de données nommé comme `Name` pour `VARCHAR(100)`, conservé dans la feuille `Domains` de l’onglet Dictionnaire, et contient alors le type de données du domaine (voir [La cellule Domaine](#the-domain-cell)).  
L’onglet Schéma SQL peut écrire chaque nom logique dans un commentaire vide (voir [Noms logiques en commentaire](./schema-sql.md#logical-names-as-comments)).

## Affichage des noms {#name-view}

Il existe trois vues, et chacune dessine à sa façon l’en-tête et les lignes d’une table :

- `Physical Names`, la vue d’un nouveau diagramme, ne dessine aucun nom logique. L’en-tête affiche le nom de la table et, tant que View Option → `Table Comment` est activé, son commentaire, et chaque ligne affiche ses cellules dans l’[ordre des colonnes](./settings.md#adjusting-column-order).
- `Logical Names` dessine le nom logique à la place de chaque nom : dans l’en-tête, et dans chaque ligne à l’emplacement de `Name` dans l’ordre des colonnes. La cellule du type d’une ligne peut représenter le domaine de la colonne, comme décrit ci-dessous.
- `Both Names` dessine le nom logique à côté du nom. L’en-tête affiche le nom logique, puis le nom, puis le commentaire, et chaque ligne reçoit une cellule `Logical Name`, que l’ordre des colonnes place par défaut juste avant `Name`.

Un nom logique vide, y compris un nom uniquement composé d’espaces, affiche un substitut grisé. Dans la vue `Logical Names`, c’est le nom dessiné à sa place, ou le texte indicatif `table` ou `column` lorsque le nom est vide lui aussi. Dans la vue `Both Names`, c’est le texte indicatif `logical`.

Dans la vue `Logical Names`, une colonne liée à un domaine nommé de la feuille `Domains` de l’onglet Dictionnaire affiche le nom de ce domaine dans sa cellule du type au lieu de son type de données. Toute autre colonne y affiche son type de données.  
Tant que View Option → `Domain` est activé, le domaine a sa propre cellule et la cellule du type conserve le type de données, si bien qu’aucune ligne n’affiche deux fois le domaine (voir [La cellule Domaine](#the-domain-cell)).

Chaque table a la largeur des cellules qu’elle dessine dans la vue, si bien qu’un changement de vue redimensionne les tables et redispose leurs connecteurs. Aucune table ne se déplace.  
À `70%` et en dessous, une table se réduit à son nom (voir [Zoom avant et arrière](./table-related-functions.md#zoom-inout)). Dans la vue `Logical Names`, elle affiche le nom logique, ou le nom grisé tant qu’il n’y en a pas. Dans la vue `Both Names`, elle affiche le nom logique avec le nom sur une ligne en dessous, ou le nom seul tant qu’il n’y a pas de nom logique.

Les vérifications du dictionnaire peuvent écrire un nom logique ou un nom en rouge ou en ambre là où elles le signalent (voir [Marques sur le canevas](./dictionary.md#marks-on-the-canvas)).

## Changer de vue {#switching-the-view}

Quatre endroits permettent de changer de vue, et chacun liste `Physical Names`, `Logical Names` et `Both Names`, la vue active cochée :

- Le bouton `Name View` de la [barre d’outils du canevas](./table-related-functions.md#canvas-toolbar), entre les quatre notations de relation et le mode zen. Il indique la vue active, avec une flèche vers le bas, et son info-bulle indique `Name View`. Un clic ouvre la liste au-dessus de la barre d’outils, et un choix la ferme.
- `Name View` dans le menu contextuel du canevas, juste après `View Option` : un sous-menu des trois vues. Le menu reste ouvert après un choix.
- La même liste dans la barre d’outils de l’onglet Visualisation en mode `Flow`, après le menu d’affichage des lignes (voir [Barre d’outils](./visualization.md#toolbar)).
- `Name View` dans la [recherche rapide](./quick-search.md#what-the-palette-lists), juste après `Tab`, et listé dans l’onglet ERD uniquement. Son sous-menu s’ouvre avec la surbrillance sur la vue active.

![Passage de l’affichage des noms à Logical Names depuis la barre d’outils du canevas, à Both Names depuis le menu du canevas, puis retour à Physical Names, avec ordered_at, qui n’a pas de nom logique, grisé puis affiché sous la forme du texte indicatif logical](/img/demo-name-view.webp)

Les quatre définissent la même vue. La barre d’outils supérieure n’a pas de bouton pour cela.

Un changement de vue conserve la sélection et n’est pas enregistré dans l’[historique d’annulation](./undo-redo.md#what-the-history-records).  
Lorsque la nouvelle vue ne dessine pas la cellule active, le focus passe à la cellule dessinée à sa place : le nom et le nom logique se remplacent l’un l’autre, comme le type et le domaine. Un éditeur de cellule ouvert sur cette cellule se ferme. Activer ou désactiver View Option → `Domain` déplace le focus de la même façon.  
Tant que le verrou `Name View` est activé, comme dans un nouveau diagramme, un changement de vue ne modifie que votre propre écran, et le fichier conserve la vue à laquelle il a été verrouillé. Verrou désactivé, le fichier enregistre la vue que vous choisissez (voir [Verrouillage](./settings.md#lock)).

## Écrire un nom logique {#writing-a-logical-name}

Comme la vue `Physical Names` ne dessine aucun nom logique, passez à la vue `Logical Names` ou `Both Names` pour en écrire un sur le canevas :

- Dans la vue `Logical Names`, les cellules du nom de l’en-tête et des lignes contiennent les noms logiques, si bien qu’un nom physique ne peut pas être modifié sur le canevas dans cette vue.
- Dans la vue `Both Names`, les cellules du nom logique contiennent les noms logiques, et les cellules du nom les noms physiques.

Une cellule du nom logique se modifie comme toute autre cellule : commencez avec `Enter` ou un double-clic (voir [Modification des tables](./table-editing.md)). Ouvert sur un nom logique vide, l’éditeur affiche comme texte indicatif ce que la cellule dessinait : le nom dans la vue `Logical Names`, `logical` dans la vue `Both Names`.  
La saisie n’écrit que le nom logique. Le nom physique en est dérivé une fois que l’éditeur se ferme (`Enter`, `Tab`, `Escape` ou un clic ailleurs) sur un nom logique modifié, en une étape d’annulation distincte après votre saisie. Un nom physique que vous avez écrit vous-même reste tel quel (voir [Dériver les noms physiques](./dictionary.md#deriving-physical-names)).

`Tab` et `Shift + Tab` parcourent les cellules que dessine la vue, dans leur ordre (voir [Touche Tab](./table-editing.md#tab-key)) :

- Dans la vue `Logical Names`, le nom logique de l’en-tête, puis son commentaire, puis les cellules de chaque ligne dans l’ordre des colonnes, avec le nom logique à la place du nom.
- Dans la vue `Both Names`, le nom logique, le nom et le commentaire de l’en-tête, puis les cellules de chaque ligne dans l’ordre des colonnes, sa cellule `Logical Name` en premier par défaut.

`Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) ajoute une colonne et donne le focus à la première cellule que dessine sa ligne. Avec l’ordre des colonnes par défaut, c’est sa cellule du nom, qui, dans la vue `Logical Names`, est son nom logique, et dans la vue `Both Names` sa cellule `Logical Name`, si bien que vous pouvez commencer par le nom logique (voir [Ajouter des colonnes](./table-editing.md#adding-columns)).

Une colonne de clé étrangère qu’ajoute une relation copie le nom logique et le domaine de sa clé, ainsi que son type (voir [Relations identifiantes](./relationship-editing.md#identifying-relationships)).  
La copie de colonnes vers un tableur et le collage de colonnes depuis un tableur utilisent les cellules que dessine la vue, y compris les cellules du nom logique et les cellules Domaine (voir [Copier-coller des colonnes](./table-editing.md#copyingpasting-columns)).

## Saisie semi-automatique des termes {#completing-term-names}

Pendant que vous saisissez du texte dans une cellule du nom logique, celle de l’en-tête ou celle d’une ligne, une liste sous la cellule propose les termes dont le nom commence par ce texte, sans tenir compte de la casse ni des espaces qui le précèdent. Un terme est un nom logique complet conservé dans la feuille `Terms` de l’onglet Dictionnaire, avec le nom physique et le domaine qu’il donne. La liste en affiche jusqu’à huit, triés par nom, avec le texte saisi mis en évidence. Aucune liste n’apparaît tant qu’aucun terme ne commence ainsi.

![Ajout d’une colonne avec ⌥ + Enter dans Both Names, choix d’Order Amount dans la liste des termes sous son nom logique pour remplir ORD_AMT, DECIMAL(10,2) et le domaine Amount, puis saisie d’Order Date, dont les mots donnent le nom ORD_DT lorsque Enter ferme l’éditeur](/img/demo-logical-names.webp)

- Rien n’est mis en évidence au départ. `↑` et `↓` déplacent la mise en évidence, en rebouclant aux deux extrémités, et le terme mis en évidence affiche la touche `Enter`.
- `Enter` sur un terme mis en évidence écrit son nom comme nom logique et met fin à la modification. Sauf si le nom physique est un nom que vous avez écrit vous-même, la même étape d’annulation dérive aussitôt le nom physique du terme et donne aussi à une colonne le domaine du terme. `Enter` sans rien de mis en évidence met fin à la modification et conserve ce que vous avez saisi.
- Un clic sur un terme l’écrit de la même façon et laisse l’éditeur ouvert.
- `Escape`, tant que la liste est affichée, ne ferme que la liste, et un nouvel `Escape` met fin à la modification.
- `Tab` passe à la suite avec le texte tel que saisi, et le nom physique en est dérivé à la fermeture de l’éditeur.
- Tant qu’une méthode de saisie est en cours de composition, les flèches et `Enter` appartiennent à la composition.

Ce qu’un terme donne à une table ou à une colonne est décrit dans [Dériver les noms physiques](./dictionary.md#deriving-physical-names).

## La cellule Domaine {#the-domain-cell}

View Option → `Domain`, désactivé par défaut, donne à chaque ligne une cellule Domaine dans toutes les vues, à l’emplacement de `Domain` dans l’ordre des colonnes, juste après `DataType` par défaut (voir [Options d’affichage des tables](./table-related-functions.md#table-view-options)).  
La cellule affiche le nom du domaine auquel la colonne est liée, ou le texte indicatif `domain`, grisé, pour une colonne liée à aucun domaine que liste la feuille `Domains`.

![Activation de View Option → Domain, choix d’Amount dans la cellule Domaine de PAY_AMT après avoir restreint la liste avec amo, changement du Data Type d’Amount en DECIMAL(12,2) dans l’onglet Dictionary, qui modifie aussi la colonne, puis saisie de NUMERIC(12,2) dans la colonne, ce qui la délie](/img/demo-domains.webp)

`Enter` ou un double-clic ouvre un sélecteur par-dessus la cellule : un champ vide avec le texte de la cellule comme texte indicatif, et en dessous `None`, puis chaque domaine nommé de la feuille `Domains`, dans l’ordre de la feuille. La mise en évidence commence sur le domaine lié, ou sur `None`.

- La saisie ne liste que les domaines dont le nom contient le texte, sans tenir compte de la casse, retire `None` et met en évidence le premier. `↑` et `↓` déplacent la mise en évidence.
- `Enter` lie le domaine mis en évidence, et un clic lie celui sur lequel vous cliquez. L’un comme l’autre donne à la colonne le type de données du domaine, en une seule étape d’annulation, et met fin à la modification. `None` délie la colonne et conserve son type de données.
- Ce que vous saisissez n’est jamais écrit dans la colonne. Tant que la feuille `Domains` n’a aucun domaine nommé, aucune liste n’apparaît, et `Enter` met fin à la modification sans rien écrire.

Dans la vue `Logical Names`, avec View Option → `Domain` désactivé, une cellule du type qui affiche le nom d’un domaine ouvre ce sélecteur, et une cellule du type qui affiche un type de données ouvre l’éditeur du type de données (voir [Saisie semi-automatique du type de données](./table-editing.md#datatype-autocomplete)). Pour lier un domaine à une colonne qui n’en a pas, activez la cellule Domaine.  
Une colonne liée contient le type de données de son domaine et le suit lorsque le type du domaine change, et saisir un autre type dans sa cellule Type de données la délie (voir [Domaines et types de données](./dictionary.md#domains-and-data-types)).

## Au-delà du canevas {#beyond-the-canvas}

La plupart des autres endroits qui nomment une table ou une colonne suivent aussi l’affichage des noms :

- `Physical Names` affiche le nom.
- `Logical Names` affiche le nom logique, ou, tant que le nom logique est vide, le nom, grisé là où l’endroit peut le griser.
- `Both Names` affiche le nom logique suivi du nom : atténué dans une ligne de texte, sur une seconde ligne dans une étiquette du mode Graphe, et entre parenthèses là où un seul texte doit contenir les deux, comme `Member (member)`. Une table ou une colonne sans nom logique affiche son nom seul.

Une liste triée par nom, comme les tables de l’explorateur ou les lignes `#` de la recherche rapide, reste triée par nom dans toutes les vues, jamais par nom logique.

Les endroits qui suivent la vue :

- Dans l’onglet Visualisation, les cartes du mode Flux (voir [Noms sur les cartes](./visualization.md#names-on-the-cards)) ainsi que les étiquettes et l’aperçu au survol du mode Graphe (voir [Lire le graphe](./visualization.md#reading-the-graph) et [Aperçu au survol](./visualization.md#hover-preview)).
- La boîte de dialogue [Propriétés de la table](./table-related-functions.md#table-properties) : ses puces, et dans l’onglet `Indexes`, les lignes `Columns` et la liste `Index order` (voir [Index](./table-related-functions.md#indexes)).
- Les lignes de table et de colonne de l’[explorateur](./explorer.md#the-tree), et les tables listées sous chaque groupe de tables.
- Les lignes `#` de la recherche rapide (voir [Rechercher dans le diagramme](./quick-search.md#searching-the-diagram)).
- L’arborescence des modifications de la [visionneuse de différences](./table-related-functions.md#diff-viewer) et ses deux côtés.
- La boîte de dialogue [Associer les colonnes](./relationship-editing.md#map-columns), et l’info-bulle `<parent> has no primary key to copy` que `Create new columns` peut afficher pendant le tracé d’une relation (voir [Création de relations](./editing-start.md#relationship-creation)).
- La copie des lignes qu’emporte le glissement d’une colonne au-dessus du canevas vide, qui affiche les cellules du nom et du type de chaque ligne telles que la ligne les dessine (voir [Réorganiser et déplacer des colonnes](./table-editing.md#rearranging-and-moving-columns)).
- La colonne `Target` de la feuille `Checks` de l’onglet Dictionnaire (voir [La feuille Vérifications](./dictionary.md#the-checks-sheet)).
- Une [image exportée](./file-import-export.md#image).

Quelques endroits conservent les noms quelle que soit la vue : les lignes d’index et de clé étrangère de l’explorateur, les `Keys` de l’onglet `Indexes` de la boîte de dialogue Propriétés de la table, le `New column: <name>` de la boîte de dialogue Associer les colonnes, et l’emplacement indiqué à côté d’une ligne `@` ou `:` de la recherche rapide.

La visionneuse de différences, le [voyage dans le temps](./undo-redo.md#time-travel), l’aperçu `Force` de la [disposition automatique](./table-related-functions.md#auto-layout) et la boîte de dialogue `Export image` s’ouvrent dans l’affichage des noms que vous regardez, quelle que soit la vue que conserve le fichier. Chacun conserve cette vue tant qu’il est ouvert.  
Toute disposition automatique, ainsi qu’un `Import` ou un `Import and Add` d’un fichier Schéma SQL, GraphQL, DBML ou AML, place les tables aux largeurs qu’elles prennent dans votre vue.

## Rechercher par nom logique {#finding-by-logical-name}

Les noms logiques sont trouvés dans toutes les vues de l’affichage des noms, y compris `Physical Names`, où le canevas n’en dessine aucun :

- [Rechercher et remplacer](./find-and-replace.md#what-it-searches) les recherche comme un seul type de texte, `Logical names`, pour les tables comme pour les colonnes, et ce type est activé à la première ouverture de la recherche. Remplacer un nom logique en dérive le nom physique, comme le fait l’écriture d’un nom logique.
- Dans la [recherche rapide](./quick-search.md#searching-the-diagram), `#` trouve une table par son nom ou son nom logique, et `@` trouve une colonne par l’un ou l’autre, une correspondance dans le nom logique affichant `Logical name` à côté. La partie table de `@`, avant le `.`, correspond aussi au nom ou au nom logique d’une table.

Changer de vue dans l’affichage des noms modifie la façon dont les résultats sont nommés, jamais ce qui est trouvé.

## Collaborateurs {#collaborators}

Dans une [session collaborative](../../api/advanced/collaborative-editing.md), les noms logiques et les liens de domaine parviennent à chaque éditeur comme toute autre modification.  
Tant que le verrou `Name View` est activé, chaque éditeur conserve sa propre vue, et un changement de vue n’apparaît que dans l’éditeur qui l’a effectué. Tant qu’il est désactivé, un changement de vue dans tout éditeur qui n’est pas en lecture seule change la vue de tous les éditeurs (voir [Verrouillage](./settings.md#lock), qui décrit aussi l’effet de l’activation ou de la désactivation du verrou sur la vue de chaque éditeur).  
Lorsque la cellule active d’un participant est une cellule que votre vue ne dessine pas, sa couleur apparaît sur la cellule que votre vue dessine à sa place : une cellule du nom dans la vue `Physical Names` apparaît sur votre cellule du nom logique dans la vue `Logical Names`, et inversement, et une cellule du type et le domaine qui en tient lieu se correspondent de la même façon.

Un agent de codage qui passe par le serveur MCP définit des noms logiques et lie des domaines quelle que soit la vue que vous regardez, et n’a aucun outil qui change l’affichage des noms (voir [Dictionnaires](../../mcp/tools.md#dictionaries) et [Paramètres](../../mcp/tools.md#settings)).

## Éditeurs en lecture seule {#read-only-editors}

Dans un éditeur [`readonly`](../../api/erd-editor-element.md#readonly), chaque sélecteur d’affichage des noms fonctionne : le bouton `Name View` de la barre d’outils du canevas, `Name View` dans le menu contextuel du canevas et dans la recherche rapide, et la liste de la barre d’outils de Flow.  
Un changement de vue ne modifie que cet écran, quel que soit le verrou : le fichier, les collaborateurs et l’historique d’annulation conservent la vue telle qu’elle était. Quand l’éditeur redevient modifiable, la vue choisie reste sur cet écran jusqu’au prochain changement fait là ou, tant que le verrou est désactivé, jusqu’à ce qu’un collaborateur la change ou que le document soit chargé de nouveau.  
Les noms logiques et les domaines n’y sont pas modifiables, si bien qu’aucun éditeur de cellule, aucune liste des termes ni aucun sélecteur de domaine ne s’ouvre, et aucune des entrées `Derive Physical Name Again` et `Derive Physical Names Again` n’est proposée.  
View Option → `Domain` affiche ou masque la cellule Domaine sur cet écran seulement, comme le fait là toute [option d’affichage](./table-related-functions.md#table-view-options), et quand l’éditeur redevient modifiable, les options d’affichage que contient le document reviennent.
