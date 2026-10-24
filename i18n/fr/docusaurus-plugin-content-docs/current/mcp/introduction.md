---
sidebar_position: 1
description: Permettre à un agent de codage comme Claude Code ou Codex de modifier des diagrammes erd-editor via le serveur MCP @dineug/erd-editor-mcp, en direct dans VS Code, Obsidian ou un IDE JetBrains, ou directement sur le disque.
---

# Introduction

`@dineug/erd-editor-mcp` est un serveur MCP qui permet à un agent de codage de modifier des diagrammes erd-editor.
Claude Code, Codex et tout autre client du [Model Context Protocol](https://modelcontextprotocol.io) disposent d’un outil par opération sur un document : ajouter une table, renommer une colonne, mettre deux tables en relation, importer un dump DDL, relire le schéma en SQL.

Lorsque le document est ouvert dans l’ERD Editor de [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), d’[Obsidian](https://community.obsidian.md/plugins/erd-editor) ou d’un [IDE JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), l’agent rejoint l’éditeur comme un collaborateur.
Chaque modification apparaît sur le canevas au moment où elle se produit, et l’annulation de l’agent ne défait que ses propres modifications.
VS Code garde les modifications de l’agent non enregistrées jusqu’à ce que l’agent ou vous les enregistriez, tandis qu’Obsidian et un IDE JetBrains les enregistrent comme ils enregistrent les vôtres.
Lorsqu’aucun éditeur ne détient le document, les mêmes outils modifient le fichier lui-même.

![Un agent de codage qui ajoute des tables et des relations à un diagramme ouvert dans VS Code](/img/coding-agents.webp)

## Ce qu’un agent peut faire {#what-an-agent-can-do}

- Construire ou modifier un schéma au fil de la conversation : tables, colonnes et toutes les options de colonne, relations avec leur cardinalité et leurs actions ON DELETE et ON UPDATE, index, mémos, couleurs et positions sur le canevas. Voir [Relations](./tools.md#relationships).
- Rassembler des tables dans des [groupes de tables](../guide/guides/table-groups.md) : ajouter un groupe autour des tables que l’agent désigne ou sur une zone du canevas, puis le renommer, le colorer, le déplacer avec ses tables, le redimensionner, y ajouter ou en retirer des tables, ou le supprimer, ce qui laisse ses tables là où elles sont. Voir [Groupes de tables](./tools.md#table-groups).
- Nommer les tables et les colonnes à partir des mots et des termes de l’onglet [Dictionnaire](../guide/guides/dictionary.md) de l’éditeur, et lier des colonnes à ses domaines, qui leur donnent leur type de données. L’agent définit les [noms logiques](../guide/guides/logical-names.md) des tables et des colonnes, et les dictionnaires en dérivent les noms physiques comme dans l’éditeur, bien qu’un nom physique écrit à la main reste en place sauf s’il est vide. Il ajoute, modifie et supprime des domaines, des mots et des termes, et, après la modification d’un mot ou d’un terme, dérive de nouveau les noms physiques pour une colonne, une table ou tout le document. Il liste ce que trouve la feuille `Checks` de l’onglet : les mots interdits, non enregistrés et synonymes ; les noms que partagent deux lignes d’un même dictionnaire ; les liens vers un domaine que le document ne répertorie pas ; les noms physiques autres que celui que donne leur terme ; et les colonnes qui s’écartent du type de données de leur domaine. Voir [Dictionnaires](./tools.md#dictionaries) et [Vérifications du dictionnaire](./tools.md#dictionary-checks).
- Remplacer le document par un schéma analysé à partir de SQL DDL, de GraphQL SDL, de DBML ou d’AML, ou par un autre document `.erd.json`. Ou bien ajouter ce schéma ou ce document sous le diagramme en conservant tout ce qui s’y trouve déjà, comme le fait [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) dans l’éditeur. Dans les deux cas, un `TableGroup` DBML devient un groupe de tables. Un schéma qui remplace le document conserve les dictionnaires du document, un document qui le remplace apporte les siens, et un ajout n’en apporte aucun. Voir [Importation](./tools.md#import).
- Relire le diagramme, avec ses noms logiques et les lignes de ses dictionnaires, sous forme de liste d’id, d’entités complètes ou du texte `.erd.json` qu’écrit un enregistrement. Ou bien le lire sous forme de DDL pour l’un des huit SGBD, avec les choix `Statements` et `Header` de l’onglet [Schéma SQL](../guide/guides/schema-sql.md) et son interrupteur [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). Sur un schéma de plusieurs milliers de tables, l’agent lit une page, quelques tables ou les tables de quelques groupes de tables à la fois. Voir [Lire un document](./tools.md#reading-a-document).
- Définir la base de données, le nom de la base de données et les [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) écrits avant et après les tables dans le Schéma SQL, comme `CREATE EXTENSION` avant elles ou `GRANT` après elles. `erd_read` renvoie les scripts seuls, ou au sein du DDL du document entier. Voir [Paramètres](./tools.md#settings).
- Exécuter plusieurs modifications comme une seule, en tout ou rien, que défait une seule annulation. Voir [erd_batch](./tools.md#erd_batch).
- Annuler et rétablir ses propres modifications, jamais les vôtres.

Ce qu’il ne fait pas :

- Zoomer, faire défiler ou changer d’onglet. Ces actions sont propres à chaque utilisateur, si bien qu’aucun outil ne les effectue. Une importation qui remplace le document déplace tout de même la vue, même avec `Viewport` verrouillé, comme le fait `Import` dans l’éditeur : vers le début du canevas à 100 %, ou, avec `erd_import_json`, vers la vue du document qu’elle charge, et aussi vers son onglet, sauf si ce document verrouille `Canvas Type`. Voir [Importation](./tools.md#import).
- Changer l’[affichage des noms](../guide/guides/logical-names.md#switching-the-view) entre `Physical Names`, `Logical Names` et `Both Names`. Il est propre à chaque utilisateur tant que son [verrou](../guide/guides/settings.md#lock) est activé, comme c’est le cas dans un nouveau diagramme, et c’est à vous de le choisir dans l’éditeur une fois le verrou désactivé, si bien qu’aucun outil ne le fait. L’agent lit et écrit les noms logiques quelle que soit la vue. Un `erd_import_json` qui remplace le document n’apporte l’affichage des noms du document qu’il charge que lorsque le verrou `Name View` de ce document est désactivé.
- Modifier [`View Option`](../guide/guides/table-related-functions.md#table-view-options), le langage et les casses des noms du générateur de code, le type de délimiteur, ou, dans l’onglet [Paramètres](../guide/guides/settings.md), `Relationship DataType Sync`, `Maximum comment width` et `Column Order`. C’est à vous de les définir dans l’éditeur, et l’agent les lit tels que le fichier les enregistre.
- [Verrouiller](../guide/guides/settings.md#lock) ou déverrouiller un paramètre. Seul `erd_import_json`, lorsqu’il remplace le document entier, modifie les verrous ou les paramètres ci-dessus, pour leur donner les valeurs du document qu’il charge. Un document sans champ `lockSettings`, comme un fichier enregistré par l’extension VS Code antérieure à la version `4.0.0` ou par le plugin Obsidian ou JetBrains antérieur à la version `1.0.0`, active tous les verrous. L’annulation de toute importation qui a remplacé le document rétablit les paramètres et les verrous qu’avait auparavant le document.
- Réassocier une relation à d’autres colonnes, comme le fait [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). À la place, l’agent supprime la relation, ce qui laisse ses colonnes de clé étrangère en place, et relie les colonnes qu’il veut avec `erd_link_columns`, dans un seul `erd_batch` que défait une seule annulation.
- Importer ou exporter un dictionnaire au format CSV, trier une feuille ou insérer des lignes au-dessus ou en dessous d’une ligne, comme le fait l’onglet [Dictionnaire](../guide/guides/dictionary.md). L’agent ajoute, modifie et supprime des lignes, plusieurs à la fois dans un seul `erd_batch`, et une nouvelle ligne se place à la fin de sa feuille.
- Exécuter le générateur de code. `erd_read` répond en DDL ou en JSON, et l’agent écrit lui-même le code à partir de ce résultat.

## Fonctionnement {#how-it-works}

Le serveur est un processus stdio que démarre votre client MCP.
À chaque appel, il cherche un éditeur qui détient le document : une fenêtre VS Code, une fenêtre de coffre Obsidian ou un IDE JetBrains, chacun avec l’extension ou le plugin ERD Editor.

- **En direct.** Un éditeur a le document dans son espace de travail, son coffre ou l’un de ses projets ouverts, ou bien l’a ouvert. Le serveur rejoint la session d’édition de cet éditeur et la modification arrive dans l’éditeur : non enregistrée dans VS Code, et enregistrée comme le sont vos propres modifications dans Obsidian et dans un IDE JetBrains.
- **Sans interface.** Aucun éditeur. Le serveur charge le fichier, applique la modification et réécrit le fichier.
- **Refusé.** Un éditeur détient le document, mais son hub est désactivé. Le serveur lit depuis le disque mais n’écrit rien, car l’éditeur ouvert pourrait écraser le fichier lors de son prochain enregistrement. Un IDE JetBrains dont le hub est activé refuse aussi de modifier un document détenu uniquement par des projets qu’il n’approuve pas, bien que l’agent puisse toujours le lire. Lorsque le hub de l’éditeur est activé mais que son extension ou son plugin ERD Editor utilise un protocole du hub différent de celui du serveur, tout appel sur le document est refusé, lectures comprises, avec `protocolMismatch` et un message qui indique le côté à mettre à jour (voir [Mettre à jour](./installation.md#updating)).

Pour les détails, voir [En direct et sans interface](./live-and-headless.md).

## Prérequis {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` ou version ultérieure, pour exécuter le serveur |
| Un client MCP | Claude Code, Codex ou tout client capable de démarrer un serveur stdio |
| VS Code, pour la modification en direct | `1.101.0` ou version ultérieure, avec l’extension ERD Editor `4.0.0` ou version ultérieure |
| Obsidian, pour la modification en direct | L’application de bureau `1.5.7` ou version ultérieure, avec le plugin ERD Editor `1.0.0` ou version ultérieure |
| Un IDE JetBrains, pour la modification en direct | Un IDE basé sur IntelliJ `2025.2` ou version ultérieure, avec le plugin ERD Editor `1.0.0` ou version ultérieure |

Le serveur `1.0.0` ou version ultérieure et les versions ci-dessus utilisent le protocole 2 du hub.
Les versions antérieures qui prennent en charge les agents utilisent le protocole 1 : l’extension VS Code de la version `3.0.0` à la version `3.1.0`, le plugin Obsidian `0.1.0` et `0.2.0`, et le plugin JetBrains `0.9.0` et `0.10.0`.
Une telle version et le serveur `1.0.0` ou version ultérieure se refusent mutuellement, tout comme un serveur antérieur et les versions ci-dessus (voir [Mettre à jour](./installation.md#updating)).
Une extension VS Code antérieure à la version `3.0.0` ou un plugin JetBrains antérieur à la version `0.9.0` n’a pas de hub : le serveur ne le voit donc pas et modifie le fichier sur le disque, même celui d’un diagramme qui y est ouvert.

Les outils des noms logiques, des domaines et des dictionnaires nécessitent le serveur `1.1.0` ou version ultérieure et, partout où le document est ouvert, au moins l’extension VS Code `4.2.0` ou le plugin Obsidian ou JetBrains `1.2.0`.
Parmi les versions ci-dessus, une extension antérieure à la version `4.2.0` ou un plugin antérieur à la version `1.2.0` permet toujours à l’agent de modifier en direct, puisqu’il utilise le protocole 2, mais il ignore les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrit l’agent, et les omet lorsqu’il enregistre le fichier.
Un serveur antérieur à la version `1.1.0` qui modifie un fichier sur le disque le réécrit sans ses noms logiques, ses liens de domaine et ses lignes des dictionnaires (voir [Mettre à jour](./installation.md#updating)).

Étape suivante : [Installation](./installation.md).
