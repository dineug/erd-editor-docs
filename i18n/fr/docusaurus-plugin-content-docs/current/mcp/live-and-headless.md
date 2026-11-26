---
sidebar_position: 3
description: Comment le serveur MCP choisit entre la modification en direct dans un éditeur (VS Code, Obsidian ou un IDE JetBrains) et la modification du fichier sur le disque, et ce que font l’enregistrement, l’annulation et un éditeur fermé dans chaque cas.
---

# En direct et sans interface

À chaque appel, le serveur cherche un éditeur qui détient le document, au moyen des fichiers de verrou que les éditeurs conservent dans `~/.erd-editor/ide/`.
Chaque fenêtre VS Code et chaque fenêtre de coffre Obsidian dotée d’ERD Editor en conserve un, et un IDE JetBrains en conserve un pour tout l’IDE, qui liste tous les projets ouverts dans celui-ci.
Un éditeur supprime son fichier de verrou quand il se ferme.
Ce que trouve le serveur détermine où va la modification.

| Ce qu’il trouve | Ce que fait une modification |
| --- | --- |
| Un éditeur dont l’espace de travail, le coffre ou un projet ouvert contient le document, ou qui l’a ouvert | **En direct.** Ouvre le document dans ERD Editor si nécessaire, rejoint la session d’édition et y applique le changement. Les modifications apparaissent immédiatement et sont enregistrées comme l’éditeur enregistre les vôtres (voir [Enregistrement](#saving)). |
| Aucun éditeur | **Sans interface.** Charge le fichier, applique le changement et remplace le fichier avant de répondre, si bien que le résultat indique `saved: true` et que `erd_save` n’a rien à faire. |
| Un éditeur dont le hub est désactivé | **Refusé.** Les lectures et `erd_export_svg` fonctionnent toujours, depuis le disque. Un changement écrit dans le fichier alors qu’un éditeur l’a ouvert pourrait être écrasé par le prochain enregistrement de cet éditeur, si bien que le serveur n’écrit rien dans le document. |
| Un éditeur dont le hub est activé mais qui utilise un autre protocole que celui du serveur : avec le serveur `1.0.0` ou version ultérieure, une extension VS Code `3.x`, un plugin Obsidian `0.x` ou un plugin JetBrains `0.9.0` ou `0.10.0` ; avec un serveur antérieur à la version `1.0.0`, l’extension `4.0.0` ou version ultérieure, ou un plugin `1.0.0` ou version ultérieure | **Refusé**, lectures comprises, avec `protocolMismatch`. Le message indique le côté à mettre à jour : l’extension ou le plugin, ou bien le serveur (voir [Mettre à jour](./installation.md#updating)). |
| Sous Windows, un éditeur qui détient le document sous un autre chemin menant au même fichier : l’agent l’a désigné par un partage réseau ou un lecteur réseau mappé de cet ordinateur, comme `\\localhost\C$\…`, et l’éditeur le détient par son chemin de lecteur, ou l’inverse | **Refusé**, lectures comprises, avec `invalidPath`. Le message indique le chemin sous lequel l’éditeur détient le document ; refaites l’appel avec ce chemin. |
| Sous Windows, un éditeur dont Windows tient l’agent à l’écart : un éditeur lancé en tant qu’administrateur alors que l’agent ne l’a pas été, ou tout éditeur quand l’agent s’exécute dans un bac à sable | **Refusé**, lectures comprises, avec `hubUnreachable` et un message qui dit pourquoi. Exécutez l’éditeur et l’agent avec les mêmes droits, par exemple en relançant l’éditeur sans droits d’administrateur. |

Le résultat d’une modification indique le mode dans lequel elle s’est exécutée, `live` ou `headless`, et une modification refusée dit pourquoi.
La recherche est refaite à chaque appel, si bien qu’ouvrir ou fermer un éditeur réoriente l’appel suivant en conséquence.

Quand plusieurs éditeurs détiennent le document, celui qui l’a ouvert l’emporte sur celui qui ne fait que prendre en charge un dossier qui le contient, et parmi ceux qui prennent en charge un dossier, l’emporte celui dont le dossier est le plus profond.
En cas d’égalité, comme lorsque deux éditeurs l’ont tous deux ouvert, le document revient à celui dont le fichier de verrou a changé en dernier.
Ainsi, un document d’un coffre Obsidian situé dans un dossier d’espace de travail VS Code revient à Obsidian, sauf si VS Code l’a ouvert et pas Obsidian.

Les appels sur un même document s’exécutent un par un, dans l’ordre où ils sont parvenus au serveur. Les appels sur des documents différents s’exécutent en parallèle.
`erd_export_svg` n’attend son tour que pour lire le document : un appel ultérieur sur le document n’attend donc pas le dessin, et le serveur dessine une exportation à la fois, même pour deux documents (voir [Exportation SVG](./tools.md#svg-export)).

## En direct {#live}

L’agent rejoint l’éditeur comme un collaborateur de plus.
Ses modifications parviennent immédiatement à chaque éditeur ouvert sur le document, et son focus est affiché sur la table et la cellule qu’il modifie, comme celui d’un collaborateur (voir [focusTracker](../api/advanced/collaborative-editing.md#focustracker)).

Une lecture n’ouvre jamais d’éditeur, pas plus que `erd_export_svg`, qui dessine ce que l’éditeur détient, modifications non encore enregistrées comprises. Une modification ouvre le document dans ERD Editor s’il n’est pas encore ouvert, sans prendre le focus clavier.

Un éditeur doté d’une extension VS Code antérieure à la version `4.2.0`, ou d’un plugin Obsidian ou JetBrains antérieur à la version `1.2.0`, reçoit toujours en direct les modifications de l’agent, mais n’affiche ni ne conserve les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrit l’agent (voir [Mettre à jour](./installation.md#updating)).
De même, un éditeur doté d’une extension antérieure à la version `4.3.1` ou d’un plugin antérieur à la version `1.3.1` n’affiche ni ne conserve le groupe de tables dans lequel se trouve un mémo : un mémo que l’agent place dans un groupe n’est dans aucun groupe dans cet éditeur, et l’éditeur omet le groupe du mémo dans le fichier lorsqu’il enregistre, bien que l’appel de l’agent réussisse.

Avec l’extension VS Code `4.3.0` ou version ultérieure, ou le plugin Obsidian ou JetBrains `1.3.0` ou version ultérieure, une importation en mode `replace`, ainsi qu’un `erd_undo` ou un `erd_redo` d’une telle importation, mettent fin à une relation que vous tracez dans l’éditeur, quelle que soit la version du serveur (voir [Création de relations](../guide/guides/editing-start.md#relationship-creation)).
Avant ces versions, le tracé restait activé, et un clic sur une table pouvait ajouter une relation à partir d’une table qui ne figurait plus dans le diagramme.
Une importation en mode `append` laisse le tracé activé.
Un éditeur de mémo, de nom de groupe de tables ou de cellule que vous avez ouvert reste ouvert tant que le diagramme contient encore et affiche encore ce qu’il modifie.

### Modifications faites au même moment {#edits-made-at-the-same-moment}

Avec le serveur `1.2.0` ou version ultérieure et, dans l’éditeur, l’extension VS Code `4.3.0` ou version ultérieure ou le plugin Obsidian ou JetBrains `1.3.0` ou version ultérieure, les modifications que vous et l’agent faites au même élément au même moment aboutissent au même résultat dans l’éditeur, dans le fichier qu’il enregistre et dans ce que `erd_list`, `erd_get` et `erd_read` donnent à l’agent.
Cela couvre un nom ou un autre champ d’une table, d’une colonne, d’une relation, d’un index, d’un mémo, d’un groupe de tables ou d’une ligne de dictionnaire, le nom de la base de données et les [scripts avant et après les tables](../guide/guides/schema-sql.md#before-and-after-scripts), ainsi que la position ou la taille d’une table, d’un mémo ou d’un groupe de tables, mais ni une couleur, ni l’ordre des colonnes d’une table ou d’un index, ni le SGBD.
Deux modifications d’un même nom ou champ, deux déplacements ou deux redimensionnements aboutissent à l’une des deux, jamais à un mélange : une modification faite après que l’autre est parvenue à son côté l’emporte, et de deux modifications faites exactement au même moment, l’une l’emporte, la même de chaque côté, quelle que soit celle qui arrive en premier.

Deux changements de couleur d’une même table, d’un même mémo ou d’un même groupe de tables faits au même moment, comme le vôtre et le `erd_change_table_color` de l’agent, peuvent aboutir à des résultats différents, voire échangés, puisque chaque côté conserve la couleur qu’il a reçue en dernier.
Un changement d’ordre des colonnes, le vôtre ou le `erd_move_column` ou `erd_move_index_column` de l’agent, est appliqué de chaque côté dans l’ordre où il arrive, si bien que deux changements faits au même moment dans une même table ou un même index peuvent laisser ses colonnes dans des ordres différents.
Un changement de SGBD, le vôtre ou le `erd_set_database` de l’agent, est lui aussi appliqué dans l’ordre où il arrive, si bien que deux changements faits au même moment peuvent laisser l’éditeur et l’agent sur des SGBD différents.

Votre glissement et les `erd_move_table`, `erd_move_tables`, `erd_move_memo`, `erd_move_table_group` et `erd_sort_tables` de l’agent voyagent sous la forme des points où ils se terminent, si bien que deux déplacements d’une même table, d’un même mémo ou d’un même groupe de tables aboutissent là où l’un d’eux l’a placé, jamais à la somme des deux.
`erd_move_table_group` envoie le point du groupe et celui de chacune de ses tables en un seul lot, comme le fait le glissement de la barre de titre du groupe, et, depuis la version `1.2.1` du serveur, le point de chacun de ses mémos aussi.
Un redimensionnement écrit la position et la taille ensemble, si bien qu’un déplacement et un redimensionnement d’un même mémo ou groupe de tables faits au même moment, comme `erd_resize_memo` pendant que vous faites glisser ce mémo, aboutissent à un même rectangle des deux côtés : celui du redimensionnement ou, quand le déplacement l’emporte, le point du déplacement avec la taille du redimensionnement.
Un déplacement de moins de 20 pixels, qui ne crée aucune entrée d’annulation, part lui aussi sous la forme du point où il se termine, si bien qu’il peut l’emporter sur le déplacement de l’autre côté, qu’il s’agisse d’un court `erd_move_table_group` ou d’un court glissement de votre part, comme un clic qui déplace une table de quelques pixels.

Les versions plus anciennes se connectent toujours, puisque le serveur `1.2.0` et les suivants parlent le protocole 2 du hub, comme le font les serveurs `1.0.0` à `1.1.1`.
Avec un serveur antérieur à la version `1.2.0`, une extension antérieure à la version `4.3.0` ou un plugin antérieur à la version `1.3.0`, un déplacement ou un redimensionnement d’une même table, d’un même mémo ou d’un même groupe de tables fait au même moment peut laisser l’éditeur et l’agent avec des positions différentes.
Un éditeur plus ancien envoie votre glissement sous la forme de la distance parcourue, et un serveur antérieur à la version `1.2.0` envoie `erd_move_table_group` de la même façon.
L’autre côté ajoute cette distance au point qu’il détient.
Le côté plus ancien applique aussi les points de l’autre côté dans l’ordre où ils arrivent.
L’agent lit et modifie alors à partir de sa propre position pour cette table, ce mémo ou ce groupe de tables, et non celle que l’éditeur affiche et enregistre.
Cela dure jusqu’à ce qu’un déplacement ultérieur voyage sous la forme d’un point, comme votre glissement dans un éditeur plus récent ou le `erd_move_table` de l’agent, ou jusqu’à ce que l’agent rejoigne à nouveau le document, comme après que l’éditeur l’a abandonné ou après 30 minutes sans appel sur le document.
Hormis une couleur, l’ordre des colonnes et le SGBD, un nom ou un autre champ changé au même moment aboutit tout de même au même résultat quand un seul côté est plus ancien, presque toujours en faveur de la modification du côté plus récent.
Si les deux côtés sont plus anciens, les deux modifications peuvent encore aboutir à des résultats différents.

Rien de cela ne s’applique à une modification sans interface, qui n’écrit que le fichier.

### Enregistrement {#saving}

Chaque éditeur enregistre les modifications de l’agent comme il enregistre les vôtres.

Dans VS Code, les modifications de l’agent marquent l’onglet comme non enregistré, comme les vôtres, et n’atteignent le disque que lorsque le document est enregistré.
`erd_save` l’enregistre par l’intermédiaire de VS Code, comme le fait sa propre commande d’enregistrement. Vous pouvez enregistrer à la place, avec `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac).
Si vous fermez l’éditeur alors que des modifications de l’agent ne sont pas enregistrées, il demande s’il faut les enregistrer, comme pour tout autre changement non enregistré.

Obsidian enregistre les modifications de l’agent environ deux secondes après l’arrêt des modifications, et fermer l’onglet les enregistre sans rien demander.
Un IDE JetBrains les écrit une fraction de seconde après l’arrêt des modifications, et fermer l’onglet écrit ce qui reste en attente ; l’onglet n’apparaît jamais comme modifié.
Dans les deux cas, `erd_save` les écrit immédiatement.

`erd_save` attend d’abord jusqu’à deux secondes que l’éditeur détienne toutes les modifications faites par l’agent.
Il est refusé avec `notSaved` quand l’éditeur n’a pas pu le confirmer, ou n’a pas écrit le fichier : VS Code laisse un onglet non enregistré quand le fichier a changé sur le disque, et un IDE JetBrains n’a pas pu l’écrire, par exemple pendant qu’une boîte de dialogue était ouverte ou quand le fichier ne peut pas être écrit.

Dans VS Code et dans un IDE JetBrains, `erd_save` sur un document qui n’a plus rien à enregistrer réussit et laisse le fichier tel quel.
C’est le cas dès que toutes les modifications sont enregistrées, ce qu’un IDE JetBrains fait de lui-même, et cela reste le cas tant que chaque changement ultérieur est de ceux qu’un [verrou](../guide/guides/settings.md#lock) tient hors du fichier, comme faire défiler ou zoomer quand `Viewport` est verrouillé, changer d’onglet quand `Canvas Type` est verrouillé, ou changer de vue dans l’[affichage des noms](../guide/guides/logical-names.md#name-view) quand `Name View` est verrouillé. Tous les verrous sont activés par défaut.
Un fichier qu’un IDE JetBrains ne peut pas écrire est refusé même dans ce cas.

Quand l’éditeur ferme le document après la dernière modification de l’agent, l’appel suivant de l’agent porte une note indiquant que ces modifications ne figurent dans le fichier que si elles ont été enregistrées avant la fermeture de l’éditeur.

### Annulation {#undo}

`erd_undo` annule la dernière modification faite par l’agent, jamais les vôtres, et `erd_redo` la réapplique.
L’[annulation](../guide/guides/undo-redo.md) propre à l’éditeur fonctionne à l’inverse : elle annule vos modifications et jamais celles de l’agent, puisque les changements qui arrivent d’un autre éditeur ne sont pas enregistrés dans votre historique.

Quelques modifications ne créent aucune étape d’annulation dans l’éditeur : `erd_set_database` et `erd_set_database_name` parmi les [outils de paramètres](./tools.md#settings), et `erd_resize_memo`.
Un `erd_move_table_group` qui déplace le groupe de moins de 20 pixels au total, déplacements horizontal et vertical additionnés, n’en crée pas non plus, bien que le groupe reste là où il a été déplacé.
Un appel qui ne change rien n’en crée pas non plus : `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` ou `erd_set_index_column_order` qui définit une valeur que le document contient déjà ; `erd_add_index_column` avec une colonne déjà présente dans l’index ; `erd_set_table_group` avec des tables déjà dans ce groupe (ou déjà hors de tout groupe, avec `groupId` `null`) ; `erd_set_memo_group` avec des mémos déjà dans ce groupe (ou déjà hors de tout groupe) ; `erd_move_table_group` vers le point où le groupe se trouve déjà ; `erd_resize_table_group` vers le rectangle que le groupe occupe déjà ; `erd_sort_tables` sur un document sans aucune table ; `erd_set_table_logical_name` ou `erd_set_column_logical_name` avec le nom logique que la table ou la colonne contient déjà, lorsque la dérivation à partir de celui-ci ne changerait rien ; `erd_set_column_domain` avec le domaine auquel la colonne est déjà liée, lorsque la colonne a déjà le type de ce domaine et que la [synchronisation du type de données des relations](../guide/guides/settings.md#relationship-datatype-sync) ne changerait le type d’aucune colonne le long de ses relations ; `erd_update_word`, `erd_update_term` ou `erd_update_domain` avec uniquement des valeurs que la ligne contient déjà, sauf si un terme qui n’a pas de nom physique reçoit son `name` et que ses mots en composent un ; `erd_derive_physical_names` lorsque chaque nom qu’il couvre et qui a un nom logique contient déjà ce que lui donnent les [dictionnaires](./tools.md#dictionaries) et est marqué comme dérivé ; ou une importation avec `mode` `append` qui n’apporte aucune table (pour `erd_import_json`, aucune table et aucun mémo).
`erd_undo` les saute et les nomme dans son résultat.
D’autres modifications, comme `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` et `erd_set_ddl_script`, créent une étape même quand elles définissent une valeur que le document contient déjà.

L’historique d’annulation de l’agent prend fin, avec une note dans le résultat, quand :

- L’agent rejoint de nouveau le document, par exemple après que l’éditeur l’en a déconnecté.
- L’éditeur s’arrête, ou ferme le document et cesse de le prendre en charge, et l’agent continue de modifier le fichier sur le disque.
- Un éditeur prend la main sur un document que l’agent modifiait sur le disque.

Le serveur ferme aussi un document sur lequel l’agent n’a fait aucun appel depuis 30 minutes, et l’historique d’annulation disparaît avec lui, sans note.

### Quand l’éditeur disparaît {#when-the-editor-goes-away}

Tant qu’un éditeur détient un document, le serveur ne se rabat jamais de lui-même sur le fichier.
Si la connexion tombe, il se reconnecte.
Ce n’est que lorsque l’éditeur s’est arrêté, ou a fermé le document et ne liste plus ni celui-ci ni un dossier qui le contient, que le serveur modifie le fichier, et il l’indique dans le résultat.
Cela se produit quand vous fermez un diagramme situé hors de tous les dossiers que l’éditeur prend en charge (dans VS Code, un diagramme ouvert depuis l’extérieur de l’espace de travail), quand vous désactivez le plugin ERD Editor dans Obsidian, et quand vous fermez le projet qui contient le document dans un IDE JetBrains ou y désactivez le plugin.
Un diagramme fermé situé dans un dossier que l’éditeur prend en charge reste confié à l’éditeur, et la modification suivante de l’agent le rouvre.

Un éditeur qui tourne toujours, mais dont le fichier de verrou a disparu et dont la connexion s’est fermée sans qu’il ait fermé le document, refuse la modification suivante avec `hubGone`.
Le message indique ce qui libère le document : dans VS Code, rechargez cette fenêtre, ou fermez-la pour laisser l’agent modifier directement le fichier ; dans Obsidian, réactivez le plugin ERD Editor, ou fermez cette fenêtre ; dans un IDE JetBrains, réactivez le plugin, ou quittez l’IDE.

Une lecture, ou `erd_export_svg`, passe plutôt par le fichier sur le disque, avec une note indiquant que les modifications non encore enregistrées dans l’éditeur y manquent, dans deux cas : quand le hub de l’éditeur qui détient le document est désactivé, et dans le cas `hubGone` ci-dessus.
Une lecture qui ne peut pas se connecter au hub d’un éditeur est refusée avec `hubUnreachable`, comme une modification.

## Sans interface {#headless}

Quand aucun éditeur ne prend en charge le document, chaque modification charge le fichier, applique le changement et réécrit le fichier avant de répondre, si bien que son résultat indique `saved: true` (voir [Résultats](./tools.md#results)).
L’écriture se fait dans un fichier temporaire à côté du document, nommé `.<name>.<id>.tmp`, qui le remplace ensuite, si bien que le document n’est jamais laissé à moitié écrit, sauf sous Windows dans le cas de l’écriture sur place décrit ci-dessous.

Avant cette dernière étape, le serveur vérifie si le fichier a changé sur le disque pendant l’appel.
Si c’est le cas, rien n’est écrit, le fichier est rechargé et l’appel est refusé avec `conflict`. L’agent refait l’appel.
Un fichier qui a changé entre deux appels est seulement rechargé, et l’historique d’annulation que l’agent avait jusque-là est abandonné.

Un fichier en lecture seule est laissé tel quel, et la modification est refusée avec `readonly` : un fichier sans droit d’écriture pour son propriétaire, ou portant l’attribut lecture seule sous Windows, comme un fichier Perforce ou TFVC qui n’est pas extrait.
Rendez-le accessible en écriture, puis refaites l’appel. Les lectures et `erd_export_svg` fonctionnent toujours.

Si un éditeur commence à prendre en charge le document pendant que l’agent le modifie sur le disque, cette modification-là est refusée avec `hubAppeared` et rien n’est écrit. L’appel suivant modifie le document par l’intermédiaire de l’éditeur.

Sous Windows, deux règles supplémentaires s’appliquent :

- Un document doté de ses propres autorisations, différentes de celles de son dossier, est écrit sur place au lieu d’être remplacé, afin qu’il les conserve, et le fichier temporaire est supprimé ensuite. Un programme qui lit le document pendant cette écriture peut y trouver un texte impossible à analyser.
- Un fichier qu’un autre programme garde ouvert ne peut pas être remplacé, si bien que le serveur réessaie pendant deux secondes au plus. Chaque tentative cherche d’abord de nouveau un éditeur, et un éditeur qui a commencé entre-temps à prendre en charge le document refuse l’écriture avec `hubAppeared`, ou avec `blocked` quand son hub est désactivé. Si le fichier est toujours tenu ouvert après deux secondes, rien n’est écrit, le fichier est rechargé et l’appel échoue avec un message qui cite l’erreur système.

Un serveur antérieur à la version `1.1.0` lit un document sans ses noms logiques, sans les liens de domaine de ses colonnes et sans ses mots, ses termes et ses domaines, si bien que la première modification qu’il écrit dans le fichier les omet. Un serveur antérieur à la version `1.2.1` le lit de même sans les groupes de tables de ses mémos, si bien que la première modification qu’il écrit dans le fichier sort chaque mémo de son groupe. Mettez à jour le serveur (voir [Mettre à jour](./installation.md#updating)).

## Refusé {#refused}

Une fenêtre VS Code conserve son fichier de verrou même quand son hub est désactivé : quand `dineug.erd-editor.agentHub.enabled` est désactivé, quand l’espace de travail n’est pas approuvé, ou quand son hub n’a pas pu se mettre à l’écoute.
Une fenêtre de coffre Obsidian conserve son fichier de verrou avec son hub désactivé quand Coding agents est désactivé, et quand son hub n’a pas pu se mettre à l’écoute.
Un IDE JetBrains conserve son fichier de verrou avec son hub désactivé quand Coding agents est désactivé, quand son hub n’a pas pu se mettre à l’écoute, et pendant que l’IDE s’arrête.

Une modification d’un tel document est refusée avec `blocked`, car l’éditeur ouvert pourrait écraser, lors de son prochain enregistrement, un changement écrit dans le fichier.
Les lectures fonctionnent toujours, depuis le fichier sur le disque, tout comme `erd_export_svg`, dont le résultat indique alors le mode `blocked`.

Pour permettre à l’agent de modifier le document, réactivez le hub, comme l’indique le message pour cet éditeur : dans VS Code, approuvez l’espace de travail et activez le paramètre, ou rechargez la fenêtre ; dans Obsidian, activez Coding agents, ou rechargez Obsidian ; dans un IDE JetBrains, activez Coding agents, ou redémarrez l’IDE si le paramètre est déjà activé.

Un IDE JetBrains refuse aussi, avec `hubDisabled`, de modifier un document que seuls détiennent des projets qu’il n’approuve pas.
Les agents peuvent toujours lire un tel document, et `erd_list_documents` le liste comme `readonly`. Approuvez le projet, puis refaites l’appel.

Un éditeur qui ne conserve aucun fichier de verrou ne protège rien, et l’agent modifie le fichier sur le disque même pendant que le diagramme y est ouvert.
C’est le cas d’Obsidian ou d’un IDE JetBrains installé en Flatpak sous Linux, d’un IDE JetBrains sans JCEF et d’un IDE JetBrains dont le hub n’a pas pu démarrer (voir [Configurer Obsidian](./installation.md#set-up-obsidian) et [Configurer un IDE JetBrains](./installation.md#set-up-a-jetbrains-ide)).
Une extension VS Code antérieure à la version `3.0.0` et un plugin JetBrains antérieur à la version `0.9.0` n’en conservent pas non plus, puisqu’ils n’ont pas de hub.

## Documents {#documents}

Un document est désigné par `path`, absolu ou relatif au répertoire de travail du serveur.

- Les nouveaux documents sont des `.erd.json`. `erd_open_document` avec `create` crée le fichier, en ajoutant `.erd.json` à un nom qui n’a pas d’extension. Comme un nouveau diagramme dans l’éditeur, le nouveau document a tous ses [verrous](../guide/guides/settings.md#lock) activés, si bien que faire défiler, zoomer, changer d’onglet, changer de vue dans l’affichage des noms, ou choisir un autre langage du générateur de code, une autre casse des noms ou un autre type de délimiteur dans un éditeur ne change jamais le fichier. Aucun outil n’active ou ne désactive un verrou en particulier : vous le faites dans l’onglet Paramètres de l’éditeur. `erd_import_json` en mode `replace` les remplace tous par ceux du document qu’il charge (voir [Importation](./tools.md#import)).
- Les fichiers `.erd`, `.vuerd` et `.vuerd.json` existants s’ouvrent aussi. Un chemin ayant toute autre extension est refusé avec `invalidPath`.
- Sous Windows, un chemin contenant un nom que Windows ne stocke pas tel qu’il est écrit est refusé avec `invalidPath` avant que le document soit lu ou écrit, lectures comprises : un nom contenant un deux-points ou un autre caractère que Windows refuse, comme `orders:v2.erd` ; un nom de périphérique comme `NUL.erd` ou `CON.erd`, quelle que soit la casse ; ou un nom se terminant par un point ou un espace. Renommez-le, par exemple avec `-` à la place de `:`.
- Un fichier qui n’est pas un document que l’éditeur peut lire, comme un fichier où sont restés des marqueurs de conflit de fusion, est refusé avec `invalidDocument` et laissé tel quel. Il n’est jamais chargé comme un diagramme vide puis réécrit.

L’agent ne modifie un document que par les outils, et il a pour consigne de ne jamais écrire lui-même le fichier.

`erd_list_documents` liste les documents avec `path`, `open`, `active`, `dirty` et `readonly`.
Il interroge l’éditeur qui prend en charge le répertoire de travail, choisi comme pour un document, et liste les diagrammes ouverts dans celui-ci, puis les fichiers ERD qu’il prend en charge : ceux des dossiers d’espace de travail d’une fenêtre VS Code, d’un coffre Obsidian ou de tous les projets ouverts dans un IDE JetBrains.
Sinon, il liste les fichiers ERD situés sous le répertoire de travail, où un fichier en lecture seule est marqué `readonly` et où, sous Windows, un nom que Windows ne stocke pas tel qu’il est écrit est omis.
