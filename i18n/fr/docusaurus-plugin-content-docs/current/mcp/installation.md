---
sidebar_position: 2
description: Enregistrer le serveur @dineug/erd-editor-mcp auprès de Claude Code, de Codex ou de tout autre client MCP, et configurer VS Code, Obsidian ou un IDE JetBrains pour la modification en direct.
---

# Installation

Le serveur est publié sur npm sous le nom `@dineug/erd-editor-mcp`.
C’est un fichier unique et autonome, sans dépendance d’exécution, et `npx` le télécharge la première fois que l’agent le démarre, si bien qu’il n’y a rien d’autre à installer.
Il nécessite Node.js `22.12` ou version ultérieure.

Pour que l’agent modifie un diagramme en direct, configurez aussi l’éditeur qui le contient : [VS Code](#set-up-vs-code), [Obsidian](#set-up-obsidian) ou [un IDE JetBrains](#set-up-a-jetbrains-ide).
Si aucun éditeur ne prend en charge le document, l’agent modifie le fichier sur le disque (voir [En direct et sans interface](./live-and-headless.md)).

## Claude Code {#claude-code}

Exécutez la commande suivante dans le dossier de votre projet :

```sh
claude mcp add --transport stdio erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ajoutez `--scope project` avant `--transport` pour écrire plutôt le serveur dans le fichier `.mcp.json` du projet, où toute personne qui clone le projet le récupère.

## Codex {#codex}

Exécutez la commande une seule fois. La CLI, l’application et l’extension pour IDE de Codex partagent ce paramètre :

```sh
codex mcp add erd-editor -- npx -y @dineug/erd-editor-mcp
```

Ou ajoutez le serveur à `~/.codex/config.toml`, ou à `.codex/config.toml` dans un projet approuvé :

```toml
[mcp_servers.erd-editor]
command = "npx"
args = ["-y", "@dineug/erd-editor-mcp"]
```

## Tout autre client MCP {#any-other-mcp-client}

Exécutez `npx -y @dineug/erd-editor-mcp` comme serveur stdio : la commande est `npx`, et les arguments sont `-y` et `@dineug/erd-editor-mcp`.

Le serveur résout un chemin de document relatif par rapport à son répertoire de travail : démarrez-le donc dans le dossier de votre projet.
Il prend en charge les versions `2025-06-18`, `2025-03-26` et `2024-11-05` du protocole MCP, et répond `2025-06-18` à un client qui utilise une version plus récente.

## Configurer VS Code {#set-up-vs-code}

Une fenêtre VS Code prend en charge les diagrammes de ses dossiers d’espace de travail et tout diagramme qui y est ouvert.

1. Installez l’[extension ERD Editor](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode) `4.0.0` ou version ultérieure. Elle nécessite VS Code `1.101.0` ou version ultérieure.
2. Ouvrez le dossier du projet et approuvez l’espace de travail. L’extension ne prend en charge les agents que dans un espace de travail approuvé.
3. Laissez le paramètre `dineug.erd-editor.agentHub.enabled` activé. Il est activé par défaut.

Une extension de la version `3.0.0` à la version `3.1.0` et le serveur `1.0.0` ou version ultérieure se refusent mutuellement, et une extension antérieure à la version `3.0.0` ne prend en charge aucun agent.
Une extension `4.0.0` ou `4.1.0` se connecte, mais n’affiche ni ne conserve les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrit l’agent (voir [Mettre à jour](#updating)).

L’extension démarre dans un espace de travail qui contient des fichiers `.erd`, `.erd.json`, `.vuerd` ou `.vuerd.json`, si bien qu’un agent atteint ces diagrammes avant que vous n’en ouvriez un.
Dans un espace de travail qui n’en contient aucun, elle démarre lorsque vous ouvrez un diagramme, et jusque-là l’agent modifie les fichiers sur le disque.

| Paramètre | Valeur par défaut | Effet |
| --- | --- | --- |
| `dineug.erd-editor.agentHub.enabled` | `true` | Permet au serveur MCP d’un agent de modifier les documents de cette fenêtre via un socket local, ou un canal nommé sous Windows. Lorsqu’il est désactivé, ou dans un espace de travail non approuvé, les agents peuvent toujours lire les diagrammes de la fenêtre depuis le disque, mais n’en écrivent jamais aucun à l’insu de son éditeur. |

## Configurer Obsidian {#set-up-obsidian}

Une fenêtre de coffre Obsidian prend en charge les diagrammes de son coffre.

1. Installez le [plugin ERD Editor](https://community.obsidian.md/plugins/erd-editor) `1.0.0` ou version ultérieure depuis Community plugins, et activez-le. Il ne fonctionne que dans l’application de bureau et nécessite Obsidian `1.5.7` ou version ultérieure.
2. Laissez l’option Settings → ERD Editor → Coding agents activée. Elle est activée par défaut, et chaque coffre conserve son propre paramètre.

Un plugin antérieur à la version `1.0.0` et le serveur `1.0.0` ou version ultérieure se refusent mutuellement.
Un plugin `1.0.0` ou `1.1.0` se connecte, mais n’affiche ni ne conserve les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrit l’agent (voir [Mettre à jour](#updating)).

Une fenêtre de coffre prend en charge les agents dès le chargement du plugin, si bien qu’un agent atteint les diagrammes du coffre avant que vous n’en ouvriez un.
Il n’y a pas d’étape d’approbation.
Un fichier que le coffre ne répertorie pas, comme un fichier situé dans un dossier dont le nom commence par un point, ne peut pas être ouvert dans ERD Editor, et une modification de ce fichier est donc refusée.

Demandez à l’agent de nommer les nouveaux diagrammes avec l’extension `.erd`.
Un nom sans extension reçoit `.erd.json`, et l’explorateur de fichiers d’Obsidian ne répertorie un fichier `.erd.json` que tant que Settings → Files and links → Detect all file extensions est activé.

| Paramètre | Valeur par défaut | Effet |
| --- | --- | --- |
| Coding agents | Activé | Permet au serveur MCP d’un agent de modifier les diagrammes de ce coffre via un socket local, ou un canal nommé sous Windows. Lorsqu’il est désactivé, les agents peuvent toujours lire les diagrammes du coffre depuis le disque, mais n’en écrivent jamais aucun à l’insu de son éditeur. |

Obsidian installé depuis Flathub s’exécute dans un bac à sable Flatpak, que le serveur ne peut pas atteindre.
Dans ce cas, le plugin ne prend en charge aucun agent et ne conserve aucun fichier de verrou : l’agent modifie donc les fichiers sur le disque, même un diagramme que vous avez ouvert.
Obsidian recharge le diagramme, comme après toute modification faite en dehors de lui, et une modification de votre part qu’il n’a pas encore enregistrée cède la place à celle de l’agent.
Le plugin le signale à chaque ouverture du coffre, jusqu’à ce que vous désactiviez l’option Coding agents.

## Configurer un IDE JetBrains {#set-up-a-jetbrains-ide}

Un IDE JetBrains prend en charge les diagrammes de chaque projet qui y est ouvert, ainsi que tout diagramme ouvert dans son ERD Editor.

1. Installez le [plugin ERD Editor](https://plugins.jetbrains.com/plugin/23594-erd-editor) `1.0.0` ou version ultérieure. Il nécessite un IDE basé sur IntelliJ `2025.2` ou version ultérieure, exécuté sur le JetBrains Runtime.
2. Ouvrez le projet et approuvez-le. Dans un projet que l’IDE n’approuve pas, comme un projet ouvert en mode sans échec, les agents lisent les diagrammes mais ne les modifient jamais.
3. Laissez l’option Settings | Tools | ERD Editor → Coding agents cochée. Elle est activée par défaut et s’applique à tout l’IDE.

Un plugin `0.9.0` ou `0.10.0` et le serveur `1.0.0` ou version ultérieure se refusent mutuellement, et un plugin antérieur à la version `0.9.0` ne prend en charge aucun agent.
Un plugin `1.0.0` ou `1.1.0` se connecte, mais n’affiche ni ne conserve les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrit l’agent (voir [Mettre à jour](#updating)).

L’IDE prend en charge les agents dès l’ouverture du premier projet, si bien qu’un agent atteint les diagrammes d’un projet avant que vous n’en ouvriez un.

| Paramètre | Valeur par défaut | Effet |
| --- | --- | --- |
| Coding agents | Activé | Permet au serveur MCP d’un agent de modifier les diagrammes de cet IDE via un socket local, ou un canal nommé sous Windows. Lorsqu’il est désactivé, les agents peuvent toujours lire les diagrammes des projets ouverts depuis le disque, mais n’en modifient jamais aucun à l’insu de son éditeur. |

La page des paramètres indique quand les agents de codage sont indisponibles : dans un IDE sans JCEF (où ERD Editor ne peut pas non plus s’exécuter), dans un IDE installé en tant que Flatpak sous Linux, et lorsque son hub n’a pas pu démarrer.
Dans ces cas, l’IDE ne conserve aucun fichier de verrou, et l’agent modifie les fichiers sur le disque.
ERD Editor ne recharge pas un diagramme modifié sur le disque pendant qu’il est ouvert, et votre modification suivante y réécrit le diagramme entier par-dessus les modifications de l’agent : fermez donc d’abord le diagramme.

## Essayer {#try-it}

1. Ouvrez le dossier qui contient vos diagrammes : dans VS Code, comme espace de travail que vous approuvez ; dans Obsidian, comme coffre ; dans un IDE JetBrains, comme projet que vous approuvez.
2. Démarrez l’agent dans le même dossier et formulez votre demande en langage courant, par exemple _« Ajoutez une table reviews à schema.erd.json, en relation avec users et products »_.
3. Regardez la modification apparaître sur le canevas. Dans VS Code, enregistrez avec `Ctrl + S` (Windows/Linux) ou `⌘ + S` (Mac), ou demandez à l’agent d’enregistrer. Obsidian et un IDE JetBrains enregistrent la modification comme ils enregistrent vos propres modifications, et si vous demandez à l’agent d’enregistrer, elle est écrite immédiatement.

Un diagramme qui n’est pas encore ouvert s’ouvre dans ERD Editor à la première modification de l’agent, sans prendre le focus clavier.
L’agent crée un nouveau document avec `erd_open_document`, et un nom sans extension reçoit `.erd.json`.

## Mettre à jour {#updating}

Les commandes ci-dessus ne précisent aucune version, si bien que `npx` cherche sur npm une version plus récente du serveur chaque fois que l’agent le démarre.
Un serveur déjà en cours d’exécution conserve sa version jusqu’à ce que l’agent le redémarre.

Le serveur vérifie la version de protocole qu’utilise l’éditeur avant de se connecter.
Lorsque les deux diffèrent, tout appel qui atteint cet éditeur est refusé avec `protocolMismatch`, lectures et `erd_list_documents` compris, et rien n’est écrit.
Le message indique le côté à mettre à jour : le serveur, ou ERD Editor dans l’éditeur, c’est-à-dire l’extension dans VS Code et le plugin dans Obsidian et dans un IDE JetBrains.

Le serveur `1.0.0` ou version ultérieure, l’extension VS Code `4.0.0` ou version ultérieure, le plugin Obsidian `1.0.0` ou version ultérieure et le plugin JetBrains `1.0.0` ou version ultérieure utilisent le protocole 2.
Tout serveur antérieur utilise le protocole 1, de même que toute version antérieure d’un éditeur qui prend en charge les agents : l’extension VS Code de la version `3.0.0` à la version `3.1.0`, le plugin Obsidian `0.1.0` et `0.2.0`, et le plugin JetBrains `0.9.0` et `0.10.0`.
Un tel éditeur et le serveur `1.0.0` ou version ultérieure se refusent mutuellement, tout comme un serveur antérieur et un éditeur qui utilise le protocole 2.
Une extension VS Code antérieure à la version `3.0.0` ou un plugin JetBrains antérieur à la version `0.9.0` ne prend en charge absolument aucun agent : l’agent modifie donc les fichiers sur le disque, même un diagramme qui y est ouvert.

| Combinaison | Fin du message |
| --- | --- |
| Serveur `1.0.0` ou version ultérieure avec une extension ou un plugin qui utilise le protocole 1 | `Update the ERD Editor extension or plugin in the editor until its hub speaks protocol 2.` |
| Un serveur antérieur avec une extension ou un plugin qui utilise le protocole 2 | `Update the MCP server (npx -y @dineug/erd-editor-mcp@latest) until it speaks protocol 2.` |

Mettez à jour le serveur et l’extension ou le plugin en même temps.
Un serveur et un éditeur qui utilisent le même protocole se connectent, quel que soit le plus ancien des deux, mais seul le serveur `1.1.0` ou version ultérieure dispose d’outils pour les noms logiques, les domaines et les dictionnaires (voir [Dictionnaires](./tools.md#dictionaries)).
Seuls l’extension VS Code `4.2.0` ou version ultérieure et les plugins Obsidian et JetBrains `1.2.0` ou version ultérieure affichent et conservent les noms logiques, les liens de domaine et les lignes des dictionnaires qu’écrivent ces outils.
Une extension ou un plugin antérieur qui se connecte les ignore, bien que l’appel de l’agent réussisse.
Il applique tout de même les noms physiques que dérivent les dictionnaires et les types de données que donnent les domaines.
Un serveur antérieur à la version `1.1.0` lit un fichier sans ses noms logiques, ses liens de domaine et ses lignes des dictionnaires, et les omet lorsqu’il modifie le fichier sur le disque (voir [Sans interface](./live-and-headless.md#headless)).

Mettez aussi à jour ERD Editor partout où les diagrammes sont ouverts.
L’extension VS Code antérieure à la version `4.2.0`, le plugin Obsidian antérieur à la version `1.2.0` et le plugin JetBrains antérieur à la version `1.2.0` ouvrent un diagramme qu’une version ultérieure a enregistré, ou que l’agent a modifié sur le disque, sans les noms logiques de ses tables et de ses colonnes, sans les liens de domaine de ses colonnes et sans ses mots, ses termes et ses domaines.
Lorsqu’ils enregistrent le fichier, ils les omettent.
L’extension VS Code antérieure à la version `4.0.0`, le plugin Obsidian antérieur à la version `1.0.0` et le plugin JetBrains antérieur à la version `1.0.0` affichent en outre un tel diagramme sans ses icônes de clé primaire, et en suppriment les groupes de tables et les scripts de Schéma SQL lorsqu’ils enregistrent le fichier.
L’extension VS Code antérieure à la version `3.1.0`, le plugin Obsidian antérieur à la version `0.2.0` et le plugin JetBrains antérieur à la version `0.10.0` suppriment aussi les actions ON DELETE et ON UPDATE d’un diagramme lorsqu’ils enregistrent le fichier.
Dans Obsidian, redémarrez l’application après avoir mis à jour le plugin : d’ici là, une fenêtre de coffre continue d’exécuter ERD Editor dans la version du plugin qu’elle a chargée en premier.
