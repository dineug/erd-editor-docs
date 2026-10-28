---
sidebar_position: 1
description: Installer @dineug/erd-editor depuis npm ou un CDN, enregistrer les éléments éditeur et visionneuse, brancher les boîtes de dialogue de fichiers et mettre à niveau depuis la 4.x ou la 3.x.
---

# Installation

```sh
npm install @dineug/erd-editor
```

Le paquet est uniquement ESM (`"type": "module"`) et ne distribue que son dossier `dist`.
Il n’existe aucun build CommonJS, si bien que `require('@dineug/erd-editor')` ne fonctionne pas.

Il contient deux éléments personnalisés : `<erd-editor>`, l’éditeur, et, depuis la version `5.0.0`, `<erd-viewer>`, qui affiche un diagramme en lecture seule (voir [ErdViewerElement](./erd-viewer-element.md)).
Depuis la version `5.0.0`, importer la racine du paquet ne définit ni l’un ni l’autre. Chaque élément a son propre point d’entrée qui le définit (voir [Enregistrer les éléments](#registering-the-elements)).

Ses dépendances d’exécution restent externes, sous forme d’imports nus que votre bundler résout, déduplique et élague par tree shaking. Depuis la version `5.0.0`, son `dist` contient un fichier par module, si bien qu’un bundler ne conserve que les modules qu’une page atteint (voir [Points d’entrée](#entry-points)).
Ses workers partagés sont émis comme fichiers d’entrée distincts sous `dist/workers/` et construits avec `new URL('./…', import.meta.url)`, la syntaxe que Vite, webpack 5 et Rspack empaquettent comme point d’entrée de worker. Voir [Web Workers](#web-workers).
Pour une page sans bundler derrière elle, il existe deux builds autonomes (voir [Balise script](#script-tag)).

## Utilisation {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` définit `<erd-editor>` dès son importation. Une page qui se contente d’afficher un diagramme importe plutôt `@dineug/erd-editor/erd-viewer.js` (voir [ErdViewerElement](./erd-viewer-element.md)).

`<erd-editor>` n’a pas de taille intrinsèque. Donnez-lui (ou à son conteneur) une largeur et une hauteur explicites.
Depuis la version `4.1.0`, l’[explorateur](../guide/guides/explorer.md), lorsqu’il est ouvert, s’ancre dans l’élément à gauche du canevas ERD et rétrécit le canevas au lieu de le recouvrir. Un nouvel éditeur démarre avec l’explorateur fermé.
Le panneau n’est jamais dessiné plus étroit que `200px` et laisse au moins `320px` au canevas, si bien que dans un élément de moins de `520px` de large, un explorateur ouvert n’est pas dessiné tant que l’élément ne s’élargit pas (voir [À côté du canevas](../guide/guides/explorer.md#beside-the-canvas)).

`setInitialValue('')` démarre un nouveau document vide. Affecter `value` charge en revanche un document en tant que modification, qui s’inscrit donc dans l’historique d’annulation.
Depuis la version `4.0.0`, `editor.value` est le document sous la forme que contient un fichier, et c’est ce qu’il faut enregistrer. `editor.runtimeValue` est le document tel que l’éditeur le détient, entités supprimées comprises : il sert à initialiser un collaborateur et ne va jamais dans un fichier (voir [runtimeValue](./erd-editor-element.md#runtimevalue)).
Depuis la version `4.0.0`, un nouveau document a aussi tous ses [verrous de paramètres](../guide/guides/settings.md#lock) activés : la fenêtre d’affichage, l’onglet, le langage du générateur de code, les deux casses des noms, le type de délimiteur et, depuis la version `4.2.0`, l’[affichage des noms](../guide/guides/logical-names.md#name-view). Faire défiler, zoomer, changer d’onglet, changer l’affichage des noms ou modifier l’un des autres paramètres laisse `editor.value` inchangé et ne déclenche aucun `change`. Un document chargé depuis du texte conserve les verrous qu’il indique. Un document qui n’en indique aucun, comme tout fichier enregistré avant la version `4.0.0`, s’ouvre avec tous les verrous activés, à un zoom de 100 % et sur l’onglet ERD, quels que soient la fenêtre d’affichage et l’onglet qu’il a enregistrés. Sa fenêtre d’affichage est verrouillée à l’origine `0, 0`, et la vue s’ouvre plutôt sur le diagramme si aucune partie de celui-ci n’y est dessinée (voir [setInitialValue](./erd-editor-element.md#setinitialvalue)).
Un fichier enregistré avant la version `4.2.0` s’ouvre avec l’affichage des noms verrouillé sur `Physical Names`, même si tous ses autres verrous sont désactivés. Un éditeur en version `4.0.0` ou `4.1.0` conserve tel quel le verrou de l’affichage des noms lors d’un enregistrement, mais pas la vue, si bien qu’un fichier `4.2.0` enregistré avec l’affichage des noms déverrouillé reste déverrouillé, mais se rouvre sur `Physical Names`.
Pour le reste de l’API, voir [ErdEditorElement](./erd-editor-element.md).

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

`esm.run` résout pour vous les dépendances externes du paquet, si bien que cela fonctionne sans bundler.
Chaque point d’entrée s’atteint par son chemin après la version : `…/erd-editor.js` définit l’éditeur et `…/erd-viewer.js` la visionneuse, qui récupère depuis le CDN chaque langue d’affichage autre que l’anglais dès qu’une page la demande. L’URL nue du paquet, `https://esm.run/@dineug/erd-editor@5.0.0`, sert la racine, qui ne définit aucun élément.
Une URL sans version sert toujours la dernière version. Fixez une version, comme ci-dessus, si vous ne voulez pas qu’une mise à niveau majeure atteigne votre page sans prévenir.
La version `5.0.0` en est elle-même une : une page qui doit rester sur la 4.x fixe `@4.2.0` (voir [Mettre à niveau depuis la 4.x](#upgrading-from-4x)).

`esm.run` sert les workers partagés depuis `cdn.jsdelivr.net`, et un navigateur ne démarre aucun worker partagé depuis une origine autre que celle de la page. Un éditeur chargé de cette façon s’exécute donc sans ses workers, comme sur un hôte qui les bloque (voir [Web Workers](#web-workers)). Le build pour [balise script](#script-tag) les embarque dans son fichier.

### Balise script {#script-tag}

Depuis la version `3.6.0`, le paquet fournit aussi un build UMD qui réunit toutes les dépendances et tous les workers partagés dans un seul fichier, `dist/erd-editor.umd.js`.
C’est vers lui que pointent les champs `unpkg` et `jsdelivr`, si bien que l’URL nue du paquet sur l’un ou l’autre CDN le sert, et il définit `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Le charger définit `<erd-editor>`. `window.ErdEditor` expose les deux fonctions de rappel de fichiers, `ErdEditor.setExportFileCallback` et `ErdEditor.setImportFileCallback`, depuis la version `3.9.2` `ErdEditor.createKeyBindingMap`, depuis la version `4.2.0` `ErdEditor.dictionaryRowChords` (voir [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)) et, depuis la version `5.0.0`, `ErdEditor.ErdEditorElement` et `ErdEditor.defineErdEditor` (voir [Enregistrer les éléments](#registering-the-elements)). Il n’expose pas [toImage](./to-image.md).

Depuis la version `5.0.0`, un second fichier, `dist/erd-viewer.umd.js`, définit `<erd-viewer>` et place `ErdViewerElement` et `defineErdViewer` sur `window.ErdViewer`. Il ne démarre aucun worker, contient les 25 langues d’affichage et ne demande rien d’autre que le `src` qu’on lui donne.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Aucun des deux fichiers ne définit la balise de l’autre, et chacun ne laisse sur la page aucune variable globale hormis la sienne et `window.Konva`.
La carte des exports oriente toujours un bundler vers les modules ES, si bien qu’une installation depuis npm ne récupère jamais l’un ni l’autre de ces fichiers.
Une page qui ne peut charger aucun script de son cru peut plutôt encadrer la visionneuse hébergée sur erd-editor.io/embed (voir [Intégration](../guide/guides/embedding.md)).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

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
L’éditeur embarque les 25 langues d’affichage, dans le build ES comme dans le build pour balise script, si bien qu’il n’y a aucun fichier de langue à servir ni rien à enregistrer. Sans sélecteur ni appel à `setLocale()`, l’éditeur s’affiche en anglais.

Ajouter `readonly` ici ouvre l’éditeur en lecteur : l’affectation de `value`, l’appel à `clear()` et tout appel à `setSchema*()` (y compris `setSchemaJSON()` et un ajout) sont ignorés, et l’événement `change` n’est jamais déclenché. Ses onglets, l’explorateur et la recherche rapide restent disponibles en lecture, et chaque commande qui modifierait le diagramme est absente.
La lecture de `editor.value` et de `editor.runtimeValue` fonctionne toujours, et les deux conservent les paramètres propres au document : un paramètre d’affichage que modifie le lecteur, comme le zoom ou le SGBD, reste sur l’écran de cet éditeur. Chargez plutôt avec `setInitialValue()` (voir [readonly](./erd-editor-element.md#readonly)).

### Rendu côté serveur {#server-side-rendering}

Tous les points d’entrée sauf `engine.js` et `peer.js` ont besoin d’un DOM et lèvent donc une exception dans Node. `erd-editor.js` et `erd-viewer.js` définissent leur élément au niveau du module, et la racine du paquet, qui ne définit plus rien depuis la version `5.0.0`, construit tout de même les deux classes d’éléments en se chargeant.
Dans Next.js, Nuxt, SvelteKit ou Astro, importez le point d’entrée de l’élément depuis un chemin de code exécuté uniquement côté client, et de même tout import nommé depuis la racine, comme `setExportFileCallback` ou `toImage`.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

En développement, ajoutez au pré-bundling de Vite le bundle ELK qu’importe le worker de disposition de l’éditeur, faute de quoi les dispositions que fait ce worker échouent : `Flow`, `Tree - vertical` et `Tree - horizontal` de la disposition automatique, le mode Flux de l’onglet Visualisation et une importation placée par la disposition en flux.
Vite 7 et les versions plus anciennes doivent aussi exclure l’éditeur du pré-bundling, car leur pré-bundle pointe les URL des workers vers des fichiers qu’il n’écrit jamais, si bien que les trois workers échouent. Avec Vite 8, omettez cet `exclude`, qui ne fait que pousser le serveur de développement à récupérer chaque fichier du paquet séparément. Un build de production n’a besoin ni de l’un ni de l’autre.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Importer `@dineug/erd-editor/erd-editor.js` fusionne `erd-editor` dans `HTMLElementTagNameMap`, et `@dineug/erd-editor/erd-viewer.js` y fusionne `erd-viewer`, si bien que l’élément est typé sans transtypage. Tout import depuis la racine, même d’un seul type, apporte les deux.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` est exporté pour annoter vos propres variables et props. Depuis la version `5.0.0`, c’est aussi la classe de l’élément, et `ErdViewerElement` est l’interface et la classe de la visionneuse (voir [Enregistrer les éléments](#registering-the-elements)).
Depuis la version `4.0.0`, le paquet exporte aussi les types `LocaleCode`, `LocaleOption` et `SchemaSQLOptions`, et depuis la version `5.0.0` `ToImageOptions` (voir [Points d’entrée](#entry-points)). Les options que prennent les méthodes `setSchema*()` n’ont pas de nom exporté ; obtenez-les à partir de l’élément, avec `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
Depuis la version `5.0.0`, le champ `typesVersions` du paquet type aussi chaque point d’entrée de sous-chemin sous `moduleResolution: "node10"`, qui ne lit aucune carte des exports.

## Enregistrer les éléments {#registering-the-elements}

Depuis la version `5.0.0`, le paquet ne définit une balise que là où une page le lui demande.

| Import | Définit |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Rien |

Chacun des deux points d’entrée définit sa balise au moment où il est évalué et n’exporte rien, si bien qu’on l’importe pour son seul effet, et aucun des deux ne définit la balise de l’autre.
La racine exporte les deux classes d’éléments, `ErdEditorElement` et `ErdViewerElement`, ainsi que `defineErdEditor()` et `defineErdViewer()`, qui définissent leur balise là où vous les appelez :

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Un appel ne fait rien tant que la balise détient cette classe, si bien qu’un point d’entrée et un appel de définition, ou deux appels de définition, peuvent se retrouver dans une même page. Il lève une `Error` qui nomme la balise quand une autre classe la détient, comme le ferait une seconde copie du paquet empaquetée dans la même page : `Another element class already defines the custom element name erd-editor`.
Les classes de la racine sont celles que définissent les points d’entrée, si bien que `customElements.get('erd-editor') === ErdEditorElement` dès que l’un ou l’autre a été exécuté. Tant que la balise n’est pas définie, `document.createElement('erd-editor')` crée un simple `HTMLElement` sans aucun des membres de l’éditeur, et `new ErdEditorElement()` lève une exception.

Pour une balise de votre choix, définissez vous-même la classe sous ce nom et ajoutez vous-même la balise à `HTMLElementTagNameMap`. Faites-le dans une fenêtre qui ne charge ni le point d’entrée de cet élément ni son build pour [balise script](#script-tag) et n’appelle aucune fonction de définition pour lui, car une classe n’accepte qu’un seul nom par fenêtre :

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Un bundle qui contient les deux éléments fait avertir Vite et Rolldown d’un `INEFFECTIVE_DYNAMIC_IMPORT`, une fois pour chaque langue d’affichage autre que l’anglais. La visionneuse charge chacune d’elles avec un `import()` qui lui est propre, tandis que l’éditeur importe tous les dictionnaires d’un coup, si bien qu’ils restent dans le chunk de l’éditeur et se chargent avec lui. Rien n’échoue, et un bundle avec la seule visionneuse garde chaque langue dans un chunk distinct.

## Coloration syntaxique {#syntax-highlighting}

Les panneaux Schéma SQL et Générateur de code sont colorés par [Shiki](https://shiki.style), dans un worker partagé qui lui est propre, et depuis la version `4.0.0`, les scripts `Before tables` et `After tables` de l’onglet Schéma SQL le sont aussi.
Depuis la version `3.7.0`, il n’y a rien à installer ni à enregistrer : le worker est créé la première fois qu’un panneau de code s’affiche, si bien qu’une page qui n’en ouvre aucun ne télécharge jamais les grammaires.

| | |
| --- | --- |
| Langages | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Thèmes | `github-dark` et `github-light`, selon l’apparence claire ou sombre de l’éditeur |

Ce sont exactement les langages que produisent les panneaux : `JPA` est coloré comme du Java, `SQLAlchemy` comme du Python, `TypeORM`, `Sequelize`, `Drizzle` et `Zod` comme du TypeScript, `Doctrine` comme du PHP, `SeaORM` comme du Rust, `JSON Schema` comme du JSON, et `DBML` et `AML` comme du SQL, la grammaire embarquée la plus proche (voir [Générateur de code](../guide/guides/code-generator.md)).

Le moteur d’expressions régulières est en JavaScript pur, si bien qu’aucune politique de l’hôte n’a besoin de `wasm-unsafe-eval`.
Là où `SharedWorker` est absent (Chrome sur Android avant Chrome 148, Safari avant 16.4), l’échec est journalisé et le code s’affiche en texte brut ; les scripts restent modifiables.

Mise à niveau depuis la version `3.6.0` ou antérieure : `@dineug/erd-editor-shiki-worker` n’est plus publié, et `setGetShikiServiceCallback` a disparu avec lui.
Supprimez l’installation et l’enregistrement ; une page qui chargeait le worker depuis un CDN supprime aussi cette seconde balise `<script>`.

## Web Workers {#web-workers}

L’éditeur exécute trois tâches dans des `SharedWorker` : la coloration syntaxique, l’exportation d’images et la disposition des tables sur laquelle reposent la [disposition automatique](../guide/guides/table-related-functions.md#auto-layout), le [mode Flux](../guide/guides/visualization.md#how-flow-is-placed) de l’onglet Visualisation et, depuis la version `4.0.0`, le placement d’un schéma importé.
Les trois sont inclus dans `@dineug/erd-editor`. Aucun n’est à configurer, mais chacun peut être bloqué par un hôte.
Depuis la version `5.0.0`, chaque worker est construit dans un module qui lui est propre, si bien qu’un bundle ne contient que les workers que ses modules atteignent : un bundle de [toImage](./to-image.md) sans aucun élément ne contient que le worker d’exportation d’images, et `<erd-viewer>` ne démarre aucun worker (voir [Points d’entrée](#entry-points)).
Le worker qui exécutait le ramasse-miettes du document a été supprimé dans la version `4.0.0`, en même temps que le ramasse-miettes lui-même.

| Worker | Sans lui |
| --- | --- |
| Coloration syntaxique | Les panneaux Schéma SQL et Générateur de code ainsi que les scripts de Schéma SQL restent en texte brut |
| Exportation d’images | Le PNG, le SVG, `Copy to clipboard`, l’aperçu de la boîte de dialogue `Export image` et, depuis la version `5.0.0`, [toImage()](./to-image.md) sont dessinés sur le thread principal, ce qui bloque la page pendant le dessin |
| Disposition des tables | Les dispositions `Flow`, `Tree - vertical` et `Tree - horizontal` de la disposition automatique, ainsi que le mode Flux de l’onglet Visualisation, aboutissent à `Could not place tables` ; une importation placée par la disposition en flux (un fichier SQL, GraphQL, DBML ou AML issu de `Import` ou de `Import and Add`, ou un appel à `setSchema*()` avec `placement: 'auto'`) pose ses tables en lignes, sans message ; `Force` et le mode Graphe ne sont pas concernés, car ils s’exécutent dans l’éditeur |

L’exportation d’images attend dix secondes la réponse de son worker, puis dessine sur le thread principal, et la coloration syntaxique laisse le code en texte brut dès que son worker échoue, si bien qu’un hôte qui bloque les workers fait perdre des performances plutôt que des fonctionnalités.
La disposition des tables fait exception : le moteur qui calcule une disposition pèse plus lourd que l’éditeur lui-même et n’est jamais chargé dans le même processus, si bien qu’elle attend son worker trente secondes lors du premier placement, puis, une fois que le worker a répondu, laisse soixante secondes à une disposition pour revenir.
Si l’un ou l’autre délai expire, le placement se termine comme il le fait sans le worker. La disposition automatique affiche `Placing tables` dès son démarrage, tandis que le mode Flux et une importation placée par la disposition en flux ne l’affichent qu’une fois qu’un placement, démarrage de son worker compris, dure depuis six secondes.

Vite, webpack 5 et Rspack émettent les workers comme fichiers à côté de vos chunks. esbuild, et Rolldown utilisé seul plutôt que par Vite, n’en émettent aucun, si bien qu’une page qu’ils construisent s’exécute sans les workers.
Avec l’option expérimentale `experiments.outputModule` de webpack, aucun worker ne démarre, car chacun attend un chunk détaché de lui que rien ne charge. Gardez la sortie par défaut de webpack, ou définissez `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Une page soumise à une Content Security Policy stricte a besoin de ces directives pour les éléments :

- `worker-src 'self'` pour le build destiné aux bundlers, dont les workers sont des fichiers à côté du paquet, plus `blob:` là où votre bundler intègre un worker en ligne. Dans le build pour [balise script](#script-tag), les trois sont embarqués dans le fichier sous forme d’URL `data:`, si bien que cette page a plutôt besoin de `worker-src data:`. `<erd-viewer>` n’a besoin ni de l’un ni de l’autre, puisqu’il ne démarre aucun worker.
- Depuis la version `5.0.0`, les deux éléments se stylent avec des feuilles de style construites, que laisse passer `style-src 'self'`. Les panneaux de code de l’éditeur colorent encore leur texte avec des attributs `style`, et l’aperçu de la boîte de dialogue `Export image` est une image à une URL `blob:`, si bien que l’éditeur a aussi besoin de `style-src 'unsafe-inline'` et de `img-src blob:` pour eux.
- Un navigateur sans feuilles de style construites, comme Firefox avant la version 101, reçoit à la place des éléments `<style>`, qui ont besoin de `style-src 'unsafe-inline'` pour l’un ou l’autre élément.
- `<erd-viewer>` récupère son `src` avec `fetch`, si bien que cette origine va dans `connect-src` (voir [Ce qu’il ajoute à une page](./erd-viewer-element.md#what-it-adds-to-a-page)).

## Points d’entrée {#entry-points}

Le paquet a cinq points d’entrée :

| Point d’entrée | Ce qu’il est |
| --- | --- |
| `@dineug/erd-editor` | La racine : les exports ci-dessous. Depuis la version `5.0.0`, elle ne définit aucun élément, mais a tout de même besoin d’un DOM pour se charger |
| `@dineug/erd-editor/erd-editor.js` | Depuis la version `5.0.0`. Définit `<erd-editor>` et n’exporte rien |
| `@dineug/erd-editor/erd-viewer.js` | Depuis la version `5.0.0`. Définit `<erd-viewer>` et n’exporte rien |
| `@dineug/erd-editor/engine.js` | Le store du document sans DOM |
| `@dineug/erd-editor/peer.js` | Depuis la version `3.9.1`. Le pair sans interface du serveur MCP |

La racine exporte les deux classes d’éléments et leurs fonctions de définition, deux setters de fonctions de rappel, depuis la version `3.9.2` les raccourcis clavier par défaut avec leurs types, depuis la version `4.0.0` les types de langue d’affichage et le type des options de `getSchemaSQL()`, depuis la version `4.2.0` les combinaisons de lignes de l’onglet Dictionnaire et, depuis la version `5.0.0`, `toImage`.

| Export | Description |
| --- | --- |
| `ErdEditorElement` | L’interface de l’élément (voir [ErdEditorElement](./erd-editor-element.md)). Depuis la version `5.0.0`, aussi sa classe, celle sous laquelle `<erd-editor>` est défini (voir [Enregistrer les éléments](#registering-the-elements)). |
| `ErdViewerElement` | Depuis la version `5.0.0`. L’interface et la classe de la visionneuse (voir [ErdViewerElement](./erd-viewer-element.md)). |
| `defineErdEditor()`, `defineErdViewer()` | Depuis la version `5.0.0`. Définissent `<erd-editor>` ou `<erd-viewer>` sous sa classe. Un appel ne fait rien tant que la balise détient cette classe, et lève une `Error` quand une autre classe la détient (voir [Enregistrer les éléments](#registering-the-elements)). |
| `toImage(value, options)` | Depuis la version `5.0.0`. Dessine un document sous forme de `Blob` PNG ou de chaîne SVG, avec les options de la boîte de dialogue `Export image` (voir [toImage](./to-image.md)). |
| `ToImageOptions` (type) | Depuis la version `5.0.0`. Les options que prend `toImage()` : `format`, `background`, `darkMode` et `scale`. |
| `setExportFileCallback(cb)` | Remplace le téléchargement du navigateur, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Remplace le sélecteur de fichiers du navigateur, `({ type, op, accept, mode }) => void` ; `mode` depuis la version `4.0.0`. Depuis la version `4.2.0`, `Import CSV` dans l’onglet Dictionnaire ouvre le sélecteur de fichiers du navigateur même si une fonction de rappel est définie (voir [Boîtes de dialogue de fichiers](#file-dialogs)). |
| `createKeyBindingMap()` | Renvoie les raccourcis clavier par défaut sous forme d’un nouveau `KeyBindingMap` à chaque appel (voir [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap)). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (types) | Un objet de raccourcis clavier, l’union de ses noms de commandes et un raccourci clavier. |
| `dictionaryRowChords(map)` | Depuis la version `4.2.0`. Renvoie, sous forme d’un nouveau `ShortcutOption[]` à chaque appel, les combinaisons avec lesquelles la grille de l’onglet [Dictionnaire](../guide/guides/dictionary.md#adding-and-deleting-rows) insère et supprime des lignes selon le `KeyBindingMap` que vous passez. Celle qui insère des lignes au-dessus, `Alt+Shift+Enter` avec les valeurs par défaut, ne figure dans aucun raccourci clavier (voir [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords)). |
| `LocaleCode`, `LocaleOption` (types) | Depuis la version `4.0.0`. Les 25 codes de langue d’affichage, et ces codes plus `'system'`, que prend `setLocale()` (voir [Langue d’affichage](./erd-editor-element.md#display-language)). |
| `SchemaSQLOptions` (type) | Depuis la version `4.0.0`. Les options que prend `getSchemaSQL()` : `statements`, `header` et, depuis la version `4.2.0`, `logicalNameAsComment` (voir [getSchemaSQL](./erd-editor-element.md#getschemasql)). |

Depuis la version `5.0.0`, `dist` contient un fichier non minifié par module, chacun à côté de sa déclaration, et le champ `sideEffects` de `package.json` ne nomme que les deux points d’entrée de balise et deux stubs dont ont besoin les fichiers de worker. Un bundler écarte donc chaque module qu’une page n’atteint pas et ne minifie qu’une fois :

- Un import nommé depuis la racine, comme `setExportFileCallback`, n’empaquette aucun des deux éléments ni aucun worker.
- `toImage` apporte le worker d’exportation d’images et aucun élément.
- `erd-editor.js` apporte l’éditeur et les trois workers partagés.
- `erd-viewer.js` apporte la visionneuse et aucun worker, avec l’anglais en son sein et chaque autre langue d’affichage dans un chunk distinct, chargé dès qu’une page la demande.

`@dineug/erd-editor/engine.js` exécute le store du document sans DOM, si bien qu’il fonctionne dans un Web Worker (voir [Stockage distant](./advanced/remote-storage.md)).
Il exporte `createReplicationStore` et le type `ReplicationStore`. Depuis la version `3.10.0`, il exporte aussi le type `ReplicationChange`, `{ value: string; changed: boolean }`, que reçoit l’écouteur `change` d’une réplique (voir [on@change](./advanced/remote-storage.md#onchange)).
Depuis la version `4.0.0`, un `ReplicationStore` a aussi un `runtimeValue`. Son `value` et celui que transmet un `change` sont la forme de stockage que contient un fichier, comme celui de l’élément (voir [ReplicationStore](./advanced/remote-storage.md#replicationstore)).

`@dineug/erd-editor/peer.js` est le pair sans interface par lequel le [serveur MCP](../mcp/introduction.md) modifie un document. Il existe pour ce serveur, et ces pages ne le documentent pas.

### Boîtes de dialogue de fichiers {#file-dialogs}

L’importation et l’exportation passent par des fonctions de rappel injectables, si bien qu’un hôte dépourvu de boîte de dialogue de fichiers du navigateur (une webview d’IDE, par exemple) peut fournir la sienne.
Les deux ne sont pas symétriques : l’exportation vous remet le fichier terminé, tandis que l’importation se contente d’en demander un, et c’est vous qui réinjectez le contenu.
Depuis la version `4.2.0`, `Import CSV` dans l’onglet Dictionnaire est la seule importation qui n’appelle jamais la fonction de rappel d’importation, dont le `type` n’a aucune valeur CSV. Elle ouvre toujours le sélecteur de fichiers propre au navigateur, pour des fichiers `.csv` (voir [Importer et exporter des fichiers CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)).

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

Le `fileName` que génère l’éditeur est `<database name>-<timestamp>` suivi de l’extension du fichier, où l’horodatage est l’heure locale au format `yyyy-MM-dd'T'HH_mm_ss`. Un nom de base de données vide est remplacé par `unnamed`. Un fichier CSV de l’onglet Dictionnaire porte le nom de sa feuille avant l’extension, comme dans `<database name>-<timestamp>-words.csv`.
La fonction de rappel d’exportation reçoit ces fichiers. Depuis la version `4.0.0`, le SVG et les fichiers du générateur de code en font partie, et le `.sql` provient de `Save file` dans l’onglet Schéma SQL plutôt que directement de `Export`. Depuis la version `4.2.0`, le fichier CSV de l’onglet Dictionnaire en fait aussi partie. [toImage()](./to-image.md) n’appelle aucune des deux fonctions de rappel : il vous rend son image.

| Fichier | Extension | `type` du Blob |
| --- | --- | --- |
| L’exportation JSON | `.erd.json` | `application/json` |
| `Save file` dans l’onglet Schéma SQL, avec le texte qu’affiche l’onglet (voir [Schéma SQL](../guide/guides/schema-sql.md)) | `.sql` | aucun |
| La boîte de dialogue [Exporter l’image](../guide/guides/file-import-export.md#image) | `.png` ou `.svg` | `image/png` ou `image/svg+xml` |
| `Save file` dans l’onglet Générateur de code (voir [Générateur de code](../guide/guides/code-generator.md)) | Celle du langage : `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` ou `.mmd` | aucun |
| `Export CSV` dans l’onglet Dictionnaire, avec toutes les lignes de la feuille affichée, quoi que liste sa recherche (voir [Importer et exporter des fichiers CSV](../guide/guides/dictionary.md#importing-and-exporting-csv)) | `.csv` | `text/csv` |

Un hôte qui choisit un gestionnaire selon l’extension en a besoin d’un pour chacune d’elles.

Si aucune fonction de rappel n’est définie, l’éditeur utilise le comportement de téléchargement et de sélection de fichiers propre au navigateur. Passez `null` pour y revenir.

## Navigateurs pris en charge {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ : la base ES2022 pour laquelle les bundles publiés sont compilés.
Aucun polyfill n’est inclus. Ajoutez les vôtres si vous devez prendre en charge des navigateurs plus anciens.

## Mettre à niveau depuis la 4.x {#upgrading-from-4x}

`5.0.0` est une version majeure. Vérifiez chacun de ces points lorsque vous migrez une page depuis la 4.x :

- `import '@dineug/erd-editor'` ne définit plus `<erd-editor>`. Importez plutôt `@dineug/erd-editor/erd-editor.js` pour son effet, ou appelez `defineErdEditor()`, et gardez tels quels vos imports nommés depuis la racine. TypeScript ne signale pas une page restée sur l’import nu, car les déclarations de la racine nomment toujours la balise dans `HTMLElementTagNameMap`, mais l’élément qu’elle crée est un simple `HTMLElement`, si bien que son premier appel de méthode lève une `TypeError` (voir [Enregistrer les éléments](#registering-the-elements)).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Sur un CDN, il en va de même pour `https://esm.run/@dineug/erd-editor`, qui sert désormais la racine et ne définit rien : importez `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Les URL nues de jsDelivr et d’unpkg servent toujours le build pour balise script, qui définit `<erd-editor>` comme auparavant. Une URL sans version sert désormais la dernière version 5.x ; fixez `@4.2.0` pour rester sur la 4.x (voir [CDN](#cdn) et [Balise script](#script-tag)).
- La racine ne définit rien mais a toujours besoin d’un DOM : avec le rendu côté serveur, un import nommé depuis elle, comme `setExportFileCallback`, reste donc sur le chemin côté client, à côté du point d’entrée de l’élément (voir [Rendu côté serveur](#server-side-rendering)).
- `window.ErdEditor` gagne `ErdEditorElement` et `defineErdEditor`. Le build pour balise script de la visionneuse place `ErdViewerElement` et `defineErdViewer` sur `window.ErdViewer`, et aucune des deux variables globales ne porte `toImage`.
- Un éditeur `readonly` s’ouvre en lecteur. Ses six onglets, l’explorateur, la recherche rapide et la présence restent, et chaque commande qui modifierait le diagramme disparaît au lieu d’être désactivée : la barre d’outils affiche le nom du SGBD sous forme de texte, l’onglet Paramètres présente ses paramètres avec toutes ses commandes désactivées sous un badge `Read only`, et la barre d’outils flottante ne conserve que le zoom, l’affichage des noms, le mode zen et la boussole, si bien que `Hand` et `Select` disparaissent et qu’un glissement déplace la vue. Un appui ne sélectionne rien : la seule sélection est le contour qu’un saut depuis l’explorateur ou la recherche rapide place autour de ce qu’il atteint, qu’un clic immobile efface, et les raccourcis de sélection totale ne sélectionnent rien. Activer `readonly` met fin à ce qui était ouvert, comme la sélection, l’outil Main, un éditeur de cellule, un glissement, `Map Columns`, l’aperçu `Force` de la disposition automatique et le voyage dans le temps, et conserve le défilement, le zoom, l’onglet et l’affichage des noms (voir [readonly](./erd-editor-element.md#readonly)).
- Les paramètres qu’un lecteur `readonly` modifie restent sur l’écran de cet éditeur quels que soient leurs verrous : le défilement et le zoom, l’onglet, l’affichage des noms, View Option, le SGBD, ainsi que le langage, les casses des noms et le type de délimiteur du générateur de code. `value`, `runtimeValue` et l’exportation JSON conservent ceux du document, que pouvaient atteindre les modifications d’un lecteur en 4.x, et `getSharedStore()` n’en envoie aucun aux autres éditeurs. `getSchemaSQL()` sans SGBD écrit celui qu’a choisi le lecteur. Désactiver `readonly` remet le SGBD, les paramètres de code et View Option à ceux du document, et laisse le défilement, le zoom, l’onglet et l’affichage des noms là où le lecteur les a laissés.
- La ligne `Recalculation table width` de l’onglet Paramètres a disparu. Un chargement et un collage ajustent toujours la largeur de chaque table à son texte.
- Avec Vite 8, supprimez un `exclude: ['@dineug/erd-editor']` de `optimizeDeps`, dont seuls Vite 7 et les versions plus anciennes ont encore besoin, et gardez l’`include` d’ELK (voir [Vite](#vite)).

## Mettre à niveau depuis la 3.x {#upgrading-from-3x}

`4.0.0` est une version majeure. Vérifiez chacun de ces points lorsque vous migrez une page depuis la 3.x, puis ceux de [Mettre à niveau depuis la 4.x](#upgrading-from-4x) pour la version `5.0.0` :

- `editor.value`, le `value` d’une réplique et le `value` que transmet son `change` sont la forme de stockage que contient un fichier : ni entités supprimées, ni largeurs mesurées, ni ordre d’empilement, ni points d’ancrage des relations. Continuez à enregistrer `value`, et lisez ces données dans `runtimeValue` ; les horodatages des entités (`meta`) ont complètement disparu. Initialisez un collaborateur ou une réplique qui rejoint une session en cours à partir du `runtimeValue` d’un pair actif, et non de `value` ou du fichier, et n’enregistrez jamais `runtimeValue` (voir [value](./erd-editor-element.md#value) et [runtimeValue](./erd-editor-element.md#runtimevalue)).
- Les verrous de paramètres remplacent `Save Scroll Information` et `Save Zoom Information`. Un nouveau document, et tout document enregistré avant la version `4.0.0`, a tous ses verrous activés, si bien qu’un défilement, un zoom, un changement d’onglet ou une modification du langage du générateur de code, d’une casse des noms ou du type de délimiteur laisse `value` inchangé et ne déclenche aucun `change`. Une page qui conservait la vue grâce à `change` a besoin de `Viewport` (et de `Canvas Type` pour l’onglet) déverrouillé dans l’onglet Paramètres, ou d’un document dont `settings.lockSettings` laisse ces bits à zéro (voir [Verrouillage](../guide/guides/settings.md#lock)).
- `settings` n’a plus `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` ni `ignoreSaveSettings`, et les constantes `SaveSettingType` ont disparu. `settings.lockSettings`, avec les bits `LockSettingType`, remplace `ignoreSaveSettings`, que la version `4.0.0` ou ultérieure ne lit ni n’écrit (voir [Settings](./advanced/schema.md#settings)).
- Le [JSON Schema](./advanced/schema.md#json-schema) que chaque fichier indique dans `$schema` décrit désormais la seule forme de stockage et est fermé : il rejette un fichier enregistré par une version antérieure tant qu’un enregistrement par la version `4.0.0` ou ultérieure ne l’a pas réécrit.
- Le ramasse-miettes du document a disparu avec son worker, si bien qu’une entité supprimée reste dans `runtimeValue` jusqu’à la prochaine ouverture du document depuis son fichier. Il reste trois workers partagés (voir [Web Workers](#web-workers)).
- Gardez chaque éditeur et chaque réplique d’une session partagée en version `4.0.0` ou ultérieure. Une version antérieure ignore les nouveaux types d’action : ceux des groupes de tables, de la fonction Associer les colonnes, des verrous et des scripts de Schéma SQL (voir [Combiner des versions](./advanced/collaborative-editing.md#mixing-releases)).
- La fonction de rappel d’importation reçoit `mode: 'append'` pour Importer et ajouter, valeur qu’une fonction de rappel doit transmettre. La fonction de rappel d’exportation reçoit désormais aussi les fichiers `.svg` et ceux du générateur de code, et `Export` ▸ `Schema SQL` ouvre l’onglet Schéma SQL au lieu d’enregistrer, si bien que le `.sql` n’arrive plus que par `Save file` dans cet onglet (voir [Boîtes de dialogue de fichiers](#file-dialogs)).
- `Delete` et `Backspace` sont liées au nouveau `removeSelection`. Tant que l’éditeur a le focus hors d’un champ de texte, l’action par défaut de la touche est empêchée dans tous les onglets, et dans l’onglet ERD la sélection est supprimée. `KeyBindingName` et `KeyBindingMap` l’intègrent, et `setKeyBindingMap({ removeSelection: [] })` laisse les deux touches à la page (voir [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap)).
- `ThemeOptions.appearance` accepte aussi `'system'`, le `System` du configurateur de thème, que définit l’activation de `systemDarkMode`. `changePresetTheme` signale `'system'` tant que cette valeur est sélectionnée : stockez-la donc telle quelle et rendez-la à `setPresetTheme`. Avec `systemDarkMode` activé, un `setPresetTheme()` avec `'light'` ou `'dark'` est désormais conservé au lieu d’être écrasé par le prochain changement de l’OS (voir [systemDarkMode](./erd-editor-element.md#systemdarkmode) et [changePresetTheme](./erd-editor-element.md#changepresettheme)).
- `@dineug/erd-editor-mcp` `1.0.0` ou version ultérieure, l’extension VS Code `4.0.0` ou version ultérieure et les plugins Obsidian et JetBrains `1.0.0` ou version ultérieure utilisent le protocole 2 du hub. Le serveur `1.0.0` ou version ultérieure et une version antérieure de l’éditeur qui prend en charge les agents, ou un serveur antérieur et l’un de ces éditeurs, se refusent mutuellement avec `protocolMismatch`, en indiquant le côté à mettre à jour (voir [Mettre à jour](../mcp/installation.md#updating)).
- Une URL de CDN sans version sert la dernière version, la 5.x depuis la version `5.0.0`. Fixez `@3.10.0` pour rester sur la 3.x (voir [CDN](#cdn)).
