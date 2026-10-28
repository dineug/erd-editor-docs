---
sidebar_position: 3
description: "L’API de l’élément erd-viewer : un diagramme en lecture seule à partir d’une valeur ou d’une URL src, sa minicarte et sa barre de commandes, les événements load et error, les thèmes, la langue d’affichage, le focus et les touches, le chargement, et ce qu’il ajoute à une page."
---

# ErdViewerElement

Depuis la version `5.0.0`, le paquet fournit aussi `<erd-viewer>`, une vue en lecture seule d’un document : un lecteur déplace la vue, zoome, recherche et éclaire des relations, et rien n’y modifie le diagramme. Il dessine le seul canevas ERD, avec ses barres de défilement, une [minicarte](#minimap), une [barre de commandes](#controls) et une palette qui recherche dans le document, et n’a ni barre d’outils, ni onglets, ni explorateur, ni menu contextuel.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Le cadre ci-dessus est cet élément tel que l’affiche erd-editor.io/embed, ici avec l’exemple de la librairie : cliquez dessus pour lui donner le focus, puis zoomez et recherchez avec les touches de [Focus et touches](#focus-and-keys), et voyez [Intégration](../guide/guides/embedding.md) pour encadrer sans code un document de votre choix.

La visionneuse est un simple `HTMLElement`.  
Sa définition de type est la suivante.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Importer `@dineug/erd-editor/erd-viewer.js` définit `<erd-viewer>` et laisse `<erd-editor>` indéfini. Importer la racine du paquet ne définit ni l’un ni l’autre : elle exporte la classe `ErdViewerElement` et `defineErdViewer()`, qui définit la balise là où vous l’appelez, si bien qu’une page peut aussi définir la classe sous une balise de son choix (voir [Enregistrer les éléments](./installation.md#registering-the-elements)).  
Tous les points d’entrée sauf `engine.js` et `peer.js` ont besoin d’un DOM, celui-ci aussi, si bien qu’une page rendue côté serveur l’importe côté client (voir [Rendu côté serveur](./installation.md#server-side-rendering)).  
Importer le point d’entrée ajoute `erd-viewer` à `HTMLElementTagNameMap`, si bien que `document.createElement('erd-viewer')` et `document.querySelector('erd-viewer')` sont typés `ErdViewerElement` sans transtypage.

Comme l’éditeur, la visionneuse s’affiche dans un shadow root fermé : `viewer.shadowRoot` vaut donc `null`, et les styles de la page n’y entrent pas et n’en sortent pas ; stylez-la avec [setTheme](#settheme) et les propriétés personnalisées `--erd-editor-*`. Plusieurs visionneuses sur une même page conservent chacune leur propre document, leur propre vue, leur propre thème et leur propre langue.  
`<erd-viewer>` n’a pas de taille intrinsèque. Un élément personnalisé est en ligne : donnez-lui donc `display: block` et une hauteur, comme ci-dessus. La vue remplit la boîte de l’élément et la suit quand elle se redimensionne, en conservant son zoom.

`src`, `name-view`, `minimap` et `controls` sont ses seuls attributs, chacun avec une propriété du même nom, `nameView` pour `name-view`. [value](#value) est uniquement une propriété.  
Un `value`, `src`, `nameView`, `minimap` ou `controls` défini sur l’élément avant que sa balise soit définie, par exemple par un framework qui affiche l’élément avant que le point d’entrée se soit chargé, est repris une fois la balise définie, par-dessus les attributs que le balisage lui avait donnés. Ils sont repris dans l’ordre où la page a écrit chacun pour la première fois, si bien que le dernier de `value` et de `src` l’emporte. Un `value` qui ne contient aucun document n’a alors plus d’appelant à qui lever d’exception : il est signalé comme une erreur non interceptée, et la visionneuse reste vide.

Le build pour balise script, `dist/erd-viewer.umd.js`, ne contient que la visionneuse avec toutes ses dépendances. Il définit `<erd-viewer>` et place `ErdViewerElement` et `defineErdViewer` sur `window.ErdViewer`. Une URL de CDN sans chemin sert à la place le build de l’éditeur : nommez donc le fichier (voir [Balise script](./installation.md#script-tag)).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

L’URL d’un document que la visionneuse récupère et affiche. Elle vaut `''`, c’est-à-dire aucune, par défaut.  
La récupération est un simple `fetch()`, un `GET` sans option propre, si bien que ce sont les règles CORS du navigateur qui s’appliquent : un document d’une autre origine a besoin d’un serveur qui autorise l’origine de la page, et les cookies ne partent que vers l’origine de la page elle-même. Une URL relative se résout par rapport à la page.  
La réponse doit contenir un document tel que le contient un fichier `.erd.json`, la forme de stockage qu’écrivent le [value](./erd-editor-element.md#value) de l’éditeur et chaque hôte officiel. Aucun autre format n’est lu : un fichier SQL, GraphQL, DBML ou AML échoue comme un texte qui ne s’analyse pas.  
Un document qui s’analyse arrive ajusté à la vue et émet [load](#load). Une requête que le réseau ou CORS a refusée, une réponse qui n’est pas `ok` ou un texte qui ne s’analyse pas émet [error](#error) et laisse un diagramme vide (voir [Chargement](#loading)).

Seule la dernière requête compte. Un nouveau `src` abandonne la récupération en cours, si bien qu’une réponse lente n’arrive jamais par-dessus un document plus récent. Affecter [value](#value) l’abandonne aussi, tout comme retirer `src` ou le définir à `''`, ce qui cesse de le suivre et laisse le document affiché tel qu’il était.  
Le dernier de `value` et de `src` à être défini l’emporte, par la propriété comme par l’attribut. Un `src` écrit après un `value` est récupéré même s’il nomme l’URL récupérée auparavant. Écrit de nouveau par-dessus le document qu’il affiche déjà, il ne récupère rien.  
La visionneuse ne récupère que tant qu’elle est dans une page. La retirer abandonne une récupération en cours, et la remettre récupère un `src` qu’elle n’a pas encore affiché, y compris un qui a échoué, jamais un qu’elle affiche déjà.  
`src` est l’unique `fetch()` que fait le paquet : une Content Security Policy stricte liste donc l’origine du document dans `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Récupère le document affiché, qu’il vienne de `src` ou de `value`, sous forme de chaîne JSON dans la forme de stockage qu’écrit le [value](./erd-editor-element.md#value) de l’éditeur. Tant que rien n’est affiché, c’est un nouveau document vide, dont le `doc` vaut `{}`.  
Tant que le [verrou](../guide/guides/settings.md#lock) `Viewport` du document est activé, comme il l’est dans un nouveau document, il écrit le zoom et le défilement auxquels le document est verrouillé, où que le lecteur ait déplacé la vue. Seul un verrou désactivé lui fait écrire l’endroit où se trouve la vue, l’ajustement que fait une arrivée compris.  
Il écrit l’affichage des noms que le document contient, jamais celui que [nameView](#nameview) ou la barre de commandes affiche par-dessus, même dans un document dont le verrou `Name View` est désactivé.  
Il renvoie encore le document après [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Affiche un document à partir de son texte, en remplaçant celui qui est affiché, et l’ajuste à la vue (voir [Chargement](#loading)). Il prend le texte que contient un fichier ou le `value` de l’éditeur.  
Un texte qui ne s’analyse pas lève une exception avant que quoi que ce soit change, et le document affiché reste : une `SyntaxError` pour un texte qui n’est pas du JSON, une `TypeError` pour du JSON qui ne contient aucun document, comme `7`. Une chaîne vide, ou toute valeur qui n’est pas une chaîne, affiche un diagramme vide.  
L’affecter abandonne une récupération de `src` en cours, et n’émet ni `load` ni `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Affiche le diagramme dans un [affichage des noms](../guide/guides/logical-names.md#name-view) placé par-dessus celui que contient le document : `'physical'` pour `Physical Names`, `'logical'` pour `Logical Names` ou `'both'` pour `Both Names`. `null`, la valeur par défaut, affiche celui du document, et une valeur d’attribut autre que les trois est lue comme `null`.  
Il reste en vigueur sur chaque document chargé après lui, et [value](#value) ne l’écrit jamais. Retirer l’attribut revient à la vue propre du document.  
La liste `Name View` de la [barre de commandes](#controls) change aussi la vue, jusqu’à ce que le document suivant arrive ou que `nameView` change de nouveau. Un changement fait là n’est pas non plus écrit dans `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Affiche la minicarte dans le coin supérieur droit, tant que le document contient une table, un mémo affiché ou un groupe de tables affiché. Elle est activée par défaut.  
Elle fonctionne comme celle de l’éditeur : cliquez dessus pour y déplacer la vue, ou faites glisser son rectangle de vue pour la déplacer (voir [Se déplacer sur le canevas](../guide/guides/table-related-functions.md#getting-around-the-canvas)). Un doigt posé dessus appartient à la page tant que la visionneuse n’a pas le focus.  
Seul `minimap="false"` la désactive. Un attribut sans valeur, toute autre valeur et l’absence d’attribut la laissent activée.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Affiche la barre de commandes au milieu du bord inférieur du canevas. Elle est activée par défaut, et contient, de gauche à droite :

- Le zoom : `Zoom out`, le zoom actuel en pourcentage et `Zoom in`. Les deux boutons font varier le zoom comme le font les touches de zoom, et cliquer sur le pourcentage, `Reset zoom`, le remet à `100%`. Chacun indique sa touche dans son info-bulle.
- `Fit`, qui zoome et fait défiler pour que tout le diagramme tienne dans la vue, centré.
- `Name View`, un bouton qui indique la vue active et ouvre au-dessus de la barre une liste de `Physical Names`, `Logical Names` et `Both Names` (voir [nameView](#nameview)).
- La boussole `Go to content`, qui rejoint l’extrémité de la barre uniquement tant qu’aucune partie du diagramme n’est à l’écran, et amène la vue sur la partie la plus proche.

La barre est disposée de gauche à droite dans toutes les langues.  
Seul `controls="false"` la désactive, avec sa boussole et sa liste `Name View`. Un attribut sans valeur, toute autre valeur et l’absence d’attribut la laissent activée. Sans la barre, la molette, un pincement et les touches zooment encore une fois que la visionneuse a le focus.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Événement {#event}

`load` et `error` sont les deux seuls événements, et tous deux concernent `src`. Aucun ne remonte dans l’arbre du DOM : écoutez donc l’élément lui-même.

### load {#load}

Émis une fois que le document que nomme `src` a été récupéré et affiché. `event.detail` vaut `null`.  
Affecter `value` n’en émet aucun, pas plus qu’une récupération qu’un `src` ultérieur, un `value`, le retrait de l’élément de la page ou [destroy](#destroy) a abandonnée.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Émis quand la récupération de `src` échoue : le réseau ou CORS a refusé la requête, la réponse n’était pas `ok`, ou son texte ne s’est pas analysé. La visionneuse affiche alors un diagramme vide et la notification `Couldn't load the diagram` (voir [Chargement](#loading)).  
`event.detail` est la cause : la `TypeError` avec laquelle `fetch()` est rejeté, une `Error` qui nomme le statut, comme `GET /missing.erd.json answered 404 Not Found`, ou la `SyntaxError` ou la `TypeError` de l’analyseur.  
Une récupération que quelque chose a abandonnée n’émet rien.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Définit un thème prédéfini, en prenant les `ThemeOptions` de l’éditeur (voir [setPresetTheme](./erd-editor-element.md#setpresettheme)).  
La visionneuse démarre avec `appearance: 'system'`, `grayColor: 'slate'` et `accentColor: 'indigo'`, si bien que, dès sa première image, elle affiche le clair ou le sombre que signale le système d’exploitation et change quand celui-ci change. L’éditeur démarre plutôt en sombre.  
Chaque champ est appliqué séparément, si bien qu’un appel partiel laisse les deux autres tels qu’ils sont. Une valeur qui n’est pas l’un des noms est ignorée, et l’appel ne lève jamais d’exception.  
La visionneuse n’a ni configurateur de thème ni `systemDarkMode`, et n’émet aucun événement pour un thème.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Nomme le clair ou le sombre qu’affiche l’apparence `'system'`, pour une page qui a son propre clair et son propre sombre. Tant que l’un est nommé, les changements du système d’exploitation sont ignorés.  
`null`, ou toute valeur autre que `'dark'` ou `'light'`, revient au suivi du système d’exploitation.  
Tant que l’apparence est `'light'` ou `'dark'`, cela ne change rien à l’écran, mais la valeur est conservée et s’applique dès que l’apparence devient `'system'`. Cela n’émet rien.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Remplace des jetons de thème par-dessus le thème prédéfini, en prenant les jetons `Theme` de l’éditeur (voir [setTheme](./erd-editor-element.md#settheme)).  
Chaque appel remplace toute la couche de remplacement : passez donc `{}` pour revenir au thème prédéfini. Seuls les noms de jetons, avec des valeurs de type chaîne, sont conservés, et un `setPresetTheme` ultérieur change le thème prédéfini en dessous tandis que les remplacements restent.  
Les propriétés CSS personnalisées `--erd-editor-*` atteignent elles aussi la visionneuse, définies sur l’élément ou n’importe où au-dessus de lui (voir [Variables CSS](./erd-editor-element.md#css-variables)). Le canevas, qu’aucune feuille de style n’atteint, les relit quand une feuille de style du `head` de la page change, ou quand l’attribut `class` ou `style` de l’élément ou d’un élément au-dessus de lui change. Une règle ajoutée avec `insertRule()` ne change rien de tout cela : le canevas la prend donc en compte au changement suivant de ce genre.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Définit la langue d’affichage : `'system'`, la valeur par défaut, ou l’un des 25 codes que liste la [Langue d’affichage](./erd-editor-element.md#display-language) de l’éditeur. Toute autre valeur, comme un `'ko'` seul ou une valeur qui n’est pas une chaîne, est ignorée.  
La langue change les info-bulles de la barre de commandes, la liste `Name View`, la palette, les notifications de chargement et les mots que le diagramme dessine lui-même, comme `unnamed`. Les noms, les commentaires et le reste du document ne sont jamais traduits.

L’anglais fait partie du point d’entrée de la visionneuse et s’applique avant le retour de l’appel. Chaque autre langue est un module à part, que votre bundler émet comme un chunk à côté de la visionneuse et que la visionneuse récupère depuis votre bundle la première fois qu’une page demande cette langue, une seule fois pour toutes les visionneuses de la page. Tant qu’il n’est pas arrivé, la visionneuse conserve la langue qu’elle affichait, l’anglais sur une première image. S’il échoue à se charger, la visionneuse affiche l’anglais, et demander de nouveau cette langue réessaie.  
Le build pour [balise script](./installation.md#script-tag) contient les 25 langues et n’en récupère donc aucune. Un bundle qui contient aussi l’éditeur charge toutes les langues avec le chunk de l’éditeur (voir [Enregistrer les éléments](./installation.md#registering-the-elements)).  
La `Promise` qu’il renvoie se résout une fois que cette langue est arrivée ou a échoué, et ne se rejette jamais. Cette langue, ou l’anglais après un échec, est alors en vigueur, sauf si un appel ultérieur en a demandé une autre : l’appel ultérieur l’emporte, quel que soit l’ordre d’arrivée des langues.

L’hébreu, l’arabe et le persan disposent la palette et les notifications de chargement de droite à gauche. Le canevas, la minicarte, les barres de défilement et la barre de commandes avec sa boussole restent de gauche à droite, comme le canevas de l’éditeur (voir [Langues de droite à gauche](../guide/guides/language-and-theme.md#right-to-left-languages)).  
La visionneuse définit `lang` et `dir` sur sa propre racine, à l’intérieur du shadow root fermé, jamais sur l’élément hôte ni sur la page.  
Cela n’émet rien, et la visionneuse n’a pas de sélecteur de langue et ne stocke rien.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Nomme la langue que représente `'system'`, sous forme de balise BCP 47, pour une page qui a son propre réglage de langue.  
La balise est rognée. `null`, une chaîne vide ou une valeur qui n’est pas une chaîne revient aux langues de la page.  
Ce sont le `<html lang>` de la page, puis les `navigator.languages` du navigateur, lus une seule fois, quand la visionneuse se connecte pour la première fois. `'system'` prend la première d’entre elles pour laquelle la visionneuse a une langue, selon la règle de l’éditeur décrite dans [setSystemLocale](./erd-editor-element.md#setsystemlocale), et l’anglais quand elle n’en a aucune. Ainsi, une page dont le `<html lang>` nomme une langue que la visionneuse a affiche cette langue quelle que soit la préférence du navigateur, et un changement ultérieur de `lang` ou des langues du navigateur ne déplace aucune visionneuse.  
Cela ne compte que tant que l’option en vigueur est `'system'`, et sa `Promise` se résout comme celle de [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Met fin à la visionneuse pour de bon. Elle démonte la vue avant de revenir, que l’élément soit encore dans la page ou en ait été retiré avant, abandonne une récupération de `src` en cours, et cesse de suivre le jeu de couleurs du système d’exploitation et les styles de la page.  
Une visionneuse détruite ne dessine plus rien, ne récupère rien et ne demande aucune langue, même si on l’ajoute de nouveau à une page. Lire [value](#value) renvoie encore le document qu’elle contenait.  
Retirer l’élément de la page ne le détruit pas : remis en place, il continue et récupère un `src` qu’il n’a pas encore affiché (voir [Chargement](#loading)).

```js
viewer.destroy();
```

## Focus et touches {#focus-and-keys}

Une visionneuse ne prend aucun focus quand elle est montée, quand un document arrive ou quand sa palette se ferme, si bien qu’elle ne fait jamais défiler la page jusqu’à elle et ne prend jamais les touches de la page.  
Un clic ou un toucher sur son canevas lui donne le focus sans faire défiler la page, et elle est un arrêt de la touche `Tab`. Contrairement à l’éditeur, elle n’a ni `focus()` ni `blur()` propre. Un appui n’importe où ailleurs sur la page lui retire de nouveau le focus.

Tant que la visionneuse n’a pas le focus, la page garde la molette, qui la fait défiler, et le pincement du pavé tactile. Un doigt sur le canevas fait défiler la page et ne déplace rien, et chaque touche parvient à la page sans être empêchée.  
Une fois qu’elle a le focus :

- La molette déplace la vue, et `Shift + Wheel` la déplace latéralement. Sur un mémo dont le texte déborde, la molette fait défiler le mémo.
- `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac), un pincement du pavé tactile ou deux doigts sur un écran tactile zooment.
- Un doigt déplace la vue.
- `Ctrl + Plus` et `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` et `⌘ + Minus` (Mac) font varier le zoom comme le font les boutons `Zoom in` et `Zoom out`, et `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) revient directement à `100%`, en laissant le milieu de l’écran où il est.
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) ouvre la palette, et `Esc` la ferme.

Ce sont ses seules touches, et elles ne peuvent pas être réaffectées. Toute autre touche parvient à la page sans être empêchée, avec ou sans le focus : `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` et chaque combinaison qui modifie dans l’éditeur.

La palette recherche dans le seul document et ne liste aucune commande. Son champ vide montre les préfixes : `#` recherche les tables, `@` les colonnes, `:` les commentaires et les mémos, et `?` liste les préfixes, comme dans l’éditeur (voir [Rechercher dans le diagramme](../guide/guides/quick-search.md#searching-the-diagram)). Un mot sans préfixe affiche `No commands match` au-dessus des lignes qui recherchent ce mot dans le diagramme.  
Choisir une ligne déplace la vue selon la règle de l’éditeur, [Où aboutit un saut](../guide/guides/table-related-functions.md#where-a-jump-lands), en laissant le zoom tel qu’il est, et entoure d’un contour ce qu’elle a atteint, amené au premier plan : la table, la table qui contient la colonne ou le commentaire, ou le mémo.  
Choisir une ligne ou appuyer sur `Esc` ferme la palette et ne laisse le focus à aucun élément, si bien que la molette suivante fait défiler la page ; cliquez sur la vue pour lui rendre la molette et les touches. Tant que la palette est ouverte, la molette fait défiler sa liste, et les touches de zoom ne font rien.

Avec ou sans le focus, un glissement du bouton principal de la souris déplace la vue depuis n’importe quel point du canevas, sur une table aussi. Un clic ou un toucher immobile éclaire des relations : sur une table, les relations de cette table ; sur une ligne de relation, cette ligne ; ailleurs, y compris sur un mémo, il éteint l’éclairage. Un tel clic efface aussi le contour qu’un saut de la palette a laissé. Le pointeur posé sur une table éclaire ses relations tant qu’il y est.  
Aucun appui ne sélectionne, ne déplace ni ne modifie quoi que ce soit. Il n’y a de sélection que le contour d’un saut, ni rectangle de sélection, et ni un double-clic ni `Enter` n’ouvre une cellule.

## Chargement {#loading}

Pendant le chargement de `src`, une notification au milieu du canevas affiche `Loading diagram` à côté d’un indicateur qui tourne. Une fois qu’un chargement a échoué, elle affiche `Couldn't load the diagram` à côté d’un signe d’avertissement, jusqu’à ce qu’un nouveau `src` ou un `value` prenne sa place ou que `src` soit retiré. Les appuis traversent la notification jusqu’au canevas, et elle s’affiche dans la langue d’affichage, de droite à gauche dans une langue de droite à gauche.

Chaque document qui arrive, par `src` ou par `value`, est ajusté à la boîte de la visionneuse : zoomé et défilé pour que tout le diagramme tienne, centré, comme le fait `Fit`, le zoom et le défilement qu’avait enregistrés le fichier étant mis de côté. Un document remis avant que la visionneuse ait une taille, défini avant qu’elle soit dans une page ou alors que sa boîte est vide, est ajusté dès qu’elle en a une. Un redimensionnement ultérieur conserve le zoom ; `Fit` ajuste de nouveau.

La visionneuse ne récupère un `src` que tant qu’elle est dans une page. La retirer abandonne une récupération en cours, et la remettre récupère un `src` qu’elle n’a pas encore affiché, y compris un qui a échoué, jamais un qu’elle affiche déjà. Une visionneuse dont on n’a plus besoin prend fin avec [destroy](#destroy).

## Ce qu’il ajoute à une page {#what-it-adds-to-a-page}

- Aucun worker. Elle n’en démarre aucun : une Content Security Policy n’a donc pas besoin de `worker-src` pour elle.
- Aucun stockage. Elle n’écrit ni cookie, ni `localStorage`, ni `sessionStorage`, ni IndexedDB.
- Deux sortes de requêtes : la récupération de [src](#src), dont l’origine figure dans `connect-src` d’une politique stricte, et le module d’une langue d’affichage autre que l’anglais, depuis votre propre bundle (voir [setLocale](#setlocale)).
- Des styles dans des feuilles de style construites, que laisse passer un `style-src` strict. Un navigateur sans feuilles de style construites, comme Firefox avant la version 101, reçoit à la place des éléments `<style>`, qui ont besoin de `style-src 'unsafe-inline'`.
- Des écouteurs sur `window`. Importer le point d’entrée en ajoute trois pour la durée de vie de la page, pour `mousedown`, `touchstart` et l’événement `@dineug/erd-editor/internal-forward-move-start` propre au paquet. Konva, qui dessine le canevas, définit `window.Konva` et, avec son premier stage, ajoute des écouteurs de souris et de toucher à `window` et un écouteur `visibilitychange` à `document`, qu’il ne retire jamais. Le point d’entrée de l’éditeur ajoute les mêmes.
- Jusqu’à [destroy](#destroy), chaque visionneuse suit le jeu de couleurs du système d’exploitation et surveille les styles de la page pour les propriétés personnalisées que décrit [setTheme](#settheme).
