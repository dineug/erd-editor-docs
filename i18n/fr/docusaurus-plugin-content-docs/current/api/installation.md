---
sidebar_position: 1
description: Installer @dineug/erd-editor depuis npm ou un CDN, monter l’élément personnalisé, brancher les boîtes de dialogue de fichiers et mettre à niveau depuis la 3.x.
---

# Installation

```sh
npm install @dineug/erd-editor
```

Le paquet est uniquement ESM (`"type": "module"`) et ne distribue que son dossier `dist`.
Il n’existe aucun build CommonJS, si bien que `require('@dineug/erd-editor')` ne fonctionne pas.

Ses dépendances d’exécution restent externes, sous forme d’imports nus que votre bundler résout, déduplique et élague par tree shaking.
Ses workers partagés sont émis comme fichiers d’entrée distincts sous `dist/workers/` et construits avec `new URL('./…', import.meta.url)`, la syntaxe que Vite, webpack 5 et Rspack empaquettent comme point d’entrée de worker. Voir [Web Workers](#web-workers).
Pour une page sans bundler derrière elle, il existe un second build, autonome (voir [Balise script](#script-tag)).

## Utilisation {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`<erd-editor>` n’a pas de taille intrinsèque. Donnez-lui (ou à son conteneur) une largeur et une hauteur explicites.
Depuis la version `4.1.0`, l’[explorateur](../guide/guides/explorer.md), lorsqu’il est ouvert, s’ancre dans l’élément à gauche du canevas ERD et rétrécit le canevas au lieu de le recouvrir. Un nouvel éditeur démarre avec l’explorateur fermé.
Le panneau n’est jamais dessiné plus étroit que `200px` et laisse au moins `320px` au canevas, si bien que dans un élément de moins de `520px` de large, un explorateur ouvert n’est pas dessiné tant que l’élément ne s’élargit pas (voir [À côté du canevas](../guide/guides/explorer.md#beside-the-canvas)).

`setInitialValue('')` démarre un nouveau document vide. Affecter `value` charge en revanche un document en tant que modification, qui s’inscrit donc dans l’historique d’annulation.
Depuis la version `4.0.0`, `editor.value` est le document sous la forme que contient un fichier, et c’est ce qu’il faut enregistrer. `editor.runtimeValue` est le document tel que l’éditeur le détient, entités supprimées comprises : il sert à initialiser un collaborateur et ne va jamais dans un fichier (voir [runtimeValue](./erd-editor-element.md#runtimevalue)).
Depuis la version `4.0.0`, un nouveau document a aussi tous ses [verrous de paramètres](../guide/guides/settings.md#lock) activés : la fenêtre d’affichage, l’onglet, le langage du générateur de code, les deux casses des noms et le type de délimiteur. Faire défiler, zoomer, changer d’onglet ou modifier l’un de ces paramètres laisse `editor.value` inchangé et ne déclenche aucun `change`. Un document chargé depuis du texte conserve les verrous qu’il indique. Un document qui n’en indique aucun, comme tout fichier enregistré avant la version `4.0.0`, s’ouvre avec tous les verrous activés, à un zoom de 100 % et sur l’onglet ERD, quels que soient la vue et l’onglet qu’il a enregistrés. Sa vue est verrouillée à l’origine `0, 0`, et s’ouvre plutôt sur le diagramme si aucune partie de celui-ci n’y est dessinée (voir [setInitialValue](./erd-editor-element.md#setinitialvalue)).
Pour le reste de l’API, voir [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

`esm.run` résout pour vous les dépendances externes du paquet, si bien que cela fonctionne sans bundler.
L’URL sans version sert toujours la dernière version. Fixez une version (`https://esm.run/@dineug/erd-editor@4.1.0`) si vous ne voulez pas qu’une mise à niveau majeure atteigne votre page sans prévenir.
La version `4.0.0` en est elle-même une : une page qui doit rester sur la 3.x fixe `@3.10.0` (voir [Mettre à niveau depuis la 3.x](#upgrading-from-3x)).

### Balise script {#script-tag}

Depuis la version `3.6.0`, le paquet fournit aussi un build UMD qui réunit toutes les dépendances et tous les workers partagés dans un seul fichier.
C’est vers lui que pointent les champs `unpkg` et `jsdelivr`, si bien que l’URL nue du paquet sur l’un ou l’autre CDN le sert, et il définit `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.1.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

L’importer enregistre `<erd-editor>` de la même manière ; `window.ErdEditor` expose les deux fonctions de rappel de fichiers, `ErdEditor.setExportFileCallback` et `ErdEditor.setImportFileCallback`, ainsi que, depuis la version `3.9.2`, `ErdEditor.createKeyBindingMap`.
La carte des exports oriente toujours un bundler vers les modules ES, si bien qu’une installation depuis npm ne récupère jamais ce fichier.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

Depuis la version `4.0.0`, `enable-locale-picker` ajoute le sélecteur `Display Language` de la barre d’outils, et `enable-welcome-screen` l’écran d’accueil qu’affiche un diagramme vide (voir [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) et [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen)).
Une page qui charge un document, comme dans [Utilisation](#usage), active `enableWelcomeScreen` une fois que `setInitialValue()` l’a chargé plutôt que dans le balisage, si bien que l’écran n’apparaît jamais furtivement par-dessus un fichier encore en cours de chargement.
Les 25 langues d’affichage sont toutes incluses dans le paquet, dans le build ES comme dans le build pour balise script, si bien qu’il n’y a aucun fichier de langue à servir ni rien à enregistrer. Sans sélecteur ni appel à `setLocale()`, l’éditeur s’affiche en anglais.

Ajouter `readonly` ici bloque toute modification : l’affectation de `value`, l’appel à `clear()` et tout appel à `setSchema*()` (y compris `setSchemaJSON()` et un ajout) sont ignorés, et l’événement `change` n’est jamais déclenché. La lecture de `editor.value` et de `editor.runtimeValue` fonctionne toujours. Chargez plutôt avec `setInitialValue()`.

### Rendu côté serveur {#server-side-rendering}

Importer le paquet enregistre l’élément personnalisé au niveau du module : il a donc besoin d’un DOM et lève une exception dans Node.
Dans Next.js, Nuxt, SvelteKit ou Astro, importez-le depuis un chemin de code exécuté uniquement côté client.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Importer le paquet fusionne `erd-editor` dans `HTMLElementTagNameMap`, si bien que l’élément est typé sans transtypage.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` est exporté pour annoter vos propres variables et props.
Depuis la version `4.0.0`, le paquet exporte aussi les types `LocaleCode`, `LocaleOption` et `SchemaSQLOptions` (voir [Points d’entrée](#entry-points)). Les options que prennent les méthodes `setSchema*()` n’ont pas de nom exporté ; obtenez-les à partir de l’élément, avec `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Coloration syntaxique {#syntax-highlighting}

Les panneaux Schéma SQL et Générateur de code sont colorés par [Shiki](https://shiki.style), dans un worker partagé qui lui est propre, et depuis la version `4.0.0`, les scripts `Before tables` et `After tables` de l’onglet Schéma SQL le sont aussi.
Depuis la version `3.7.0`, il n’y a rien à installer ni à enregistrer : le worker est créé la première fois qu’un panneau de code s’affiche, si bien qu’une page qui n’en ouvre aucun ne télécharge jamais les grammaires.

| | |
| --- | --- |
| Langages | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Thèmes | `github-dark` et `github-light`, selon l’apparence claire ou sombre de l’éditeur |

Ce sont exactement les langages que produisent les panneaux : `JPA` est coloré comme du Java, `SQLAlchemy` comme du Python, `TypeORM`, `Sequelize`, `Drizzle` et `Zod` comme du TypeScript, `Doctrine` comme du PHP, `SeaORM` comme du Rust, `JSON Schema` comme du JSON, et `DBML` et `AML` comme du SQL, la grammaire embarquée la plus proche (voir [Générateur de code](../guide/guides/code-generator.md)).

Le moteur d’expressions régulières est en JavaScript pur, si bien qu’aucune politique de l’hôte n’a besoin de `wasm-unsafe-eval`.
Là où `SharedWorker` est absent (Chrome sur Android, Safari avant 16.4), l’échec est journalisé et le code s’affiche en texte brut ; les scripts restent modifiables.

Mise à niveau depuis la version `3.6.0` ou antérieure : `@dineug/erd-editor-shiki-worker` n’est plus publié, et `setGetShikiServiceCallback` a disparu avec lui.
Supprimez l’installation et l’enregistrement ; une page qui chargeait le worker depuis un CDN supprime aussi cette seconde balise `<script>`.

## Web Workers {#web-workers}

L’éditeur exécute trois tâches dans des `SharedWorker` : la coloration syntaxique, l’exportation d’images et la disposition des tables sur laquelle reposent la [disposition automatique](../guide/guides/table-related-functions.md#auto-layout), le [mode Flux](../guide/guides/visualization.md#how-flow-is-placed) de l’onglet Visualisation et, depuis la version `4.0.0`, le placement d’un schéma importé.
Les trois sont inclus dans `@dineug/erd-editor`. Aucun n’est à configurer, mais chacun peut être bloqué par un hôte.
Le worker qui exécutait le ramasse-miettes du document a été supprimé dans la version `4.0.0`, en même temps que le ramasse-miettes lui-même.

| Worker | Sans lui |
| --- | --- |
| Coloration syntaxique | Les panneaux Schéma SQL et Générateur de code ainsi que les scripts de Schéma SQL restent en texte brut |
| Exportation d’images | Le PNG, le SVG, `Copy to clipboard` et l’aperçu de la boîte de dialogue `Export image` sont dessinés sur le thread principal, ce qui bloque la page pendant le dessin |
| Disposition des tables | Les dispositions `Flow`, `Tree - vertical` et `Tree - horizontal` de la disposition automatique, ainsi que le mode Flux de l’onglet Visualisation, aboutissent à `Could not place tables` ; une importation placée par la disposition en flux (un fichier SQL, GraphQL, DBML ou AML issu de `Import` ou de `Import and Add`, ou un appel à `setSchema*()` avec `placement: 'auto'`) pose ses tables en lignes, sans message ; `Force` et le mode Graphe ne sont pas concernés, car ils s’exécutent dans l’éditeur |

L’exportation d’images attend dix secondes la réponse de son worker, puis dessine sur le thread principal, et la coloration syntaxique laisse le code en texte brut dès que son worker échoue, si bien qu’un hôte qui bloque les workers fait perdre des performances plutôt que des fonctionnalités.
La disposition des tables fait exception : le moteur qui calcule une disposition pèse plus lourd que l’éditeur lui-même et n’est jamais chargé dans le même processus, si bien qu’elle attend son worker trente secondes lors du premier placement, puis, une fois que le worker a répondu, laisse soixante secondes à une disposition pour revenir.
Si l’un ou l’autre délai expire, le placement se termine comme il le fait sans le worker. La disposition automatique affiche `Placing tables` dès son démarrage, tandis que le mode Flux et une importation placée par la disposition en flux ne l’affichent qu’une fois qu’un placement, démarrage de son worker compris, dure depuis six secondes.

Dans le build destiné aux bundlers, les trois sont émis comme fichiers à côté du paquet, si bien qu’une CSP stricte a besoin de `worker-src 'self'`, plus `blob:` là où votre bundler intègre un worker en ligne.
Dans le build pour [balise script](#script-tag), les trois sont embarqués dans le fichier sous forme d’URL `data:`, si bien que cette page a plutôt besoin de `worker-src data:`.

## Points d’entrée {#entry-points}

Importer `@dineug/erd-editor` enregistre `<erd-editor>` comme effet de bord. Au-delà, il exporte le type de l’élément, deux setters de fonctions de rappel, depuis la version `3.9.2` les raccourcis clavier par défaut avec leurs types, et depuis la version `4.0.0` les types de langue d’affichage et le type des options de `getSchemaSQL()`.

| Export | Description |
| --- | --- |
| `ErdEditorElement` (type) | L’interface de l’élément (voir [ErdEditorElement](./erd-editor-element.md)). |
| `setExportFileCallback(cb)` | Remplace le téléchargement du navigateur, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Remplace le sélecteur de fichiers du navigateur, `({ type, op, accept, mode }) => void` ; `mode` depuis la version `4.0.0`. |
| `createKeyBindingMap()` | Renvoie les raccourcis clavier par défaut sous forme d’un nouveau `KeyBindingMap` à chaque appel (voir [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (types) | Un objet de raccourcis clavier, l’union de ses noms de commandes et un raccourci clavier. |
| `LocaleCode`, `LocaleOption` (types) | Depuis la version `4.0.0`. Les 25 codes de langue d’affichage, et ces codes plus `'system'`, que prend `setLocale()` (voir [Langue d’affichage](./erd-editor-element.md#display-language)). |
| `SchemaSQLOptions` (type) | Depuis la version `4.0.0`. Les options `statements` et `header` que prend `getSchemaSQL()` (voir [getSchemaSQL](./erd-editor-element.md#getschemasql)). |

`@dineug/erd-editor/engine.js` est un deuxième point d’entrée. Il exécute le store du document sans DOM, si bien qu’il fonctionne dans un Web Worker (voir [Stockage distant](./advanced/remote-storage.md)).
Il exporte `createReplicationStore` et le type `ReplicationStore`. Depuis la version `3.10.0`, il exporte aussi le type `ReplicationChange`, `{ value: string; changed: boolean }`, que reçoit l’écouteur `change` d’une réplique (voir [on@change](./advanced/remote-storage.md#onchange)).
Depuis la version `4.0.0`, un `ReplicationStore` a aussi un `runtimeValue`. Son `value` et celui que transmet un `change` sont la forme de stockage que contient un fichier, comme celui de l’élément (voir [ReplicationStore](./advanced/remote-storage.md#replicationstore)).

Depuis la version `3.9.1`, il en existe un troisième, `@dineug/erd-editor/peer.js` : le pair sans interface par lequel le [serveur MCP](../mcp/introduction.md) modifie un document. Il existe pour ce serveur, et ces pages ne le documentent pas.

### Boîtes de dialogue de fichiers {#file-dialogs}

L’importation et l’exportation passent par des fonctions de rappel injectables, si bien qu’un hôte dépourvu de boîte de dialogue de fichiers du navigateur (une webview d’IDE, par exemple) peut fournir la sienne.
Les deux ne sont pas symétriques : l’exportation vous remet le fichier terminé, tandis que l’importation se contente d’en demander un, et c’est vous qui réinjectez le contenu.

`op` vaut `set` ou `diff` : un `diff` va à `setDiffValue()`, quel que soit le `type`. Sinon, `type` détermine la méthode, et `accept` contient les extensions de ce type, prêtes à être passées à une boîte de dialogue de fichiers de l’hôte.
Depuis la version `4.0.0`, un `set` porte `mode: 'append'` quand l’utilisateur a choisi [Importer et ajouter](../guide/guides/file-import-export.md#import-and-add), et aucun `mode` pour une simple importation. Transmettez-le : une fonction de rappel qui l’abandonne remplace le diagramme que l’utilisateur avait demandé de compléter.

| `type` | `accept` | Méthode |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` dispose les tables selon leurs relations avant de les poser, comme le fait l’importation de l’éditeur, et fait renvoyer une Promise par l’appel. Sans cette option, elles sont posées aussitôt en lignes (voir [setSchemaSQL](./erd-editor-element.md#setschemasql) et [setSchemaJSON](./erd-editor-element.md#setschemajson)).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Aiguillez selon chaque `type` que vous gérez et ignorez les autres.
Un `setSchemaJSON()` de remplacement, comme l’affectation de `value`, vide le document avant l’analyse, si bien qu’y envoyer un contenu qui n’est pas un document `.erd.json` (par un `else` fourre-tout, ou parce qu’un `type` ajouté plus tard n’a pas été intercepté) vide le diagramme au lieu d’importer quoi que ce soit.

Le `fileName` que génère l’éditeur est `<database name>-<timestamp>` suivi de l’extension du fichier, où l’horodatage est l’heure locale au format `yyyy-MM-dd'T'HH_mm_ss`. Un nom de base de données vide est remplacé par `unnamed`.
La fonction de rappel d’exportation reçoit ces fichiers. Depuis la version `4.0.0`, le SVG et les fichiers du générateur de code en font partie, et le `.sql` provient de `Save file` dans l’onglet Schéma SQL plutôt que directement de `Export`.

| Fichier | Extension | `type` du Blob |
| --- | --- | --- |
| L’exportation JSON | `.erd.json` | `application/json` |
| `Save file` dans l’onglet Schéma SQL, avec le texte qu’affiche l’onglet (voir [Schéma SQL](../guide/guides/schema-sql.md)) | `.sql` | aucun |
| La boîte de dialogue [Exporter l’image](../guide/guides/file-import-export.md#image) | `.png` ou `.svg` | `image/png` ou `image/svg+xml` |
| `Save file` dans l’onglet Générateur de code (voir [Générateur de code](../guide/guides/code-generator.md)) | Celle du langage : `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` ou `.mmd` | aucun |

Un hôte qui choisit un gestionnaire selon l’extension en a besoin d’un pour chacune d’elles.

Si aucune fonction de rappel n’est définie, l’éditeur utilise le comportement de téléchargement et de sélection de fichiers propre au navigateur. Passez `null` pour y revenir.

## Navigateurs pris en charge {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ : la base ES2022 pour laquelle les bundles publiés sont compilés.
Aucun polyfill n’est inclus. Ajoutez les vôtres si vous devez prendre en charge des navigateurs plus anciens.

## Mettre à niveau depuis la 3.x {#upgrading-from-3x}

`4.0.0` est une version majeure. Vérifiez chacun de ces points lorsque vous migrez une page depuis la 3.x :

- `editor.value`, le `value` d’une réplique et le `value` que transmet son `change` sont la forme de stockage que contient un fichier : ni entités supprimées, ni largeurs mesurées, ni ordre d’empilement, ni points d’ancrage des relations. Continuez à enregistrer `value`, et lisez ces données dans `runtimeValue` ; les horodatages des entités (`meta`) ont complètement disparu. Initialisez un collaborateur ou une réplique qui rejoint une session en cours à partir du `runtimeValue` d’un pair actif, et non de `value` ou du fichier, et n’enregistrez jamais `runtimeValue` (voir [value](./erd-editor-element.md#value) et [runtimeValue](./erd-editor-element.md#runtimevalue)).
- Les verrous de paramètres remplacent `Save Scroll Information` et `Save Zoom Information`. Un nouveau document, et tout document enregistré avant la version `4.0.0`, a tous ses verrous activés, si bien qu’un défilement, un zoom, un changement d’onglet ou une modification du langage du générateur de code, d’une casse des noms ou du type de délimiteur laisse `value` inchangé et ne déclenche aucun `change`. Une page qui conservait la vue grâce à `change` a besoin de `Viewport` (et de `Canvas Type` pour l’onglet) déverrouillé dans l’onglet Paramètres, ou d’un document dont `settings.lockSettings` laisse ces bits à zéro (voir [Verrouillage](../guide/guides/settings.md#lock)).
- `settings` n’a plus `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ni `ignoreSaveSettings`, et les constantes `SaveSettingType` ont disparu. `settings.lockSettings`, avec les bits `LockSettingType`, remplace `ignoreSaveSettings`, que la version `4.0.0` ou ultérieure ne lit ni n’écrit (voir [Settings](./advanced/schema.md#settings)).
- Le [JSON Schema](./advanced/schema.md#json-schema) que chaque fichier indique dans `$schema` décrit désormais la seule forme de stockage et est fermé : il rejette un fichier enregistré par une version antérieure tant qu’un enregistrement par la version `4.0.0` ou ultérieure ne l’a pas réécrit.
- Le ramasse-miettes du document a disparu avec son worker, si bien qu’une entité supprimée reste dans `runtimeValue` jusqu’à la prochaine ouverture du document depuis son fichier. Il reste trois workers partagés (voir [Web Workers](#web-workers)).
- Gardez chaque éditeur et chaque réplique d’une session partagée en version `4.0.0` ou ultérieure. Une version antérieure ignore les nouveaux types d’action : ceux des groupes de tables, de la fonction Associer les colonnes, des verrous et des scripts de Schéma SQL (voir [Combiner des versions](./advanced/collaborative-editing.md#mixing-releases)).
- La fonction de rappel d’importation reçoit `mode: 'append'` pour Importer et ajouter, valeur qu’une fonction de rappel doit transmettre. La fonction de rappel d’exportation reçoit désormais aussi les fichiers `.svg` et ceux du générateur de code, et `Export` ▸ `Schema SQL` ouvre l’onglet Schéma SQL au lieu d’enregistrer, si bien que le `.sql` n’arrive plus que par `Save file` dans cet onglet (voir [Boîtes de dialogue de fichiers](#file-dialogs)).
- `Delete` et `Backspace` sont liées au nouveau `removeSelection`. Tant que l’éditeur a le focus hors d’un champ de texte, l’action par défaut de la touche est empêchée dans tous les onglets, et dans l’onglet ERD la sélection est supprimée. `KeyBindingName` et `KeyBindingMap` l’intègrent, et `setKeyBindingMap({ removeSelection: [] })` laisse les deux touches à la page (voir [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)).
- `ThemeOptions.appearance` accepte aussi `'system'`, le `System` du configurateur de thème, que définit l’activation de `systemDarkMode`. `changePresetTheme` signale `'system'` tant que cette valeur est sélectionnée : stockez-la donc telle quelle et rendez-la à `setPresetTheme`. Avec `systemDarkMode` activé, un `setPresetTheme()` avec `'light'` ou `'dark'` est désormais conservé au lieu d’être écrasé par le prochain changement de l’OS (voir [systemDarkMode](./erd-editor-element.md#systemdarkmode) et [changePresetTheme](./erd-editor-element.md#changepresettheme)).
- `@dineug/erd-editor-mcp` `1.0.0`, l’extension VS Code `4.0.0` ou version ultérieure et les plugins Obsidian et JetBrains `1.0.0` ou version ultérieure utilisent le protocole 2 du hub. Le serveur `1.0.0` et une version antérieure de l’éditeur qui prend en charge les agents, ou un serveur antérieur et l’un de ces éditeurs, se refusent mutuellement avec `protocolMismatch`, en indiquant le côté à mettre à jour (voir [Mettre à jour](../mcp/installation.md#updating)).
- Une URL de CDN sans version sert désormais la dernière version 4.x. Fixez `@3.10.0` pour rester sur la 3.x (voir [CDN](#cdn)).
