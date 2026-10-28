---
sidebar_position: 4
description: Dessiner un document sous forme de PNG ou de SVG depuis votre propre code avec toImage, en utilisant les options de la boîte de dialogue Export image, dans un navigateur et dans le worker d’exportation quand il y en a un.
---

# toImage

Depuis la version `5.0.0`, la racine du paquet exporte `toImage()`, qui dessine un document sous forme de PNG ou de SVG sans aucun éditeur sur la page.  
Il écrit les fichiers qu’écrivent les boutons `PNG` et `SVG` de la boîte de dialogue [Exporter l’image](../guide/guides/file-import-export.md#image), avec les trois options de la boîte de dialogue, `Background`, `Dark mode` et `Scale`, et aucune autre.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` est exporté comme type à côté de lui (voir [Points d’entrée](./installation.md#entry-points)).

## value {#value}

Le texte du document : ce que contient un fichier `.erd.json`, le [value](./erd-editor-element.md#value) ou le [runtimeValue](./erd-editor-element.md#runtimevalue) d’un éditeur, ou tout autre texte que charge [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Un texte vide, ou fait d’espaces seuls, dessine un diagramme vide, tout comme un JSON qui ne contient aucun des champs d’un document, que l’analyseur remplit avec des valeurs par défaut.

## Options {#options}

| Option | Valeur par défaut | Description |
| --- | --- | --- |
| `format` | Aucune ; elle est obligatoire | `'png'` se résout en un `Blob` de type `image/png`, `'svg'` en le balisage du SVG sous forme de chaîne. |
| `background` | `true` | Peint la couleur du canevas derrière le diagramme. `false` le laisse transparent, la zone sous une étiquette ON DELETE ou ON UPDATE comprise. |
| `darkMode` | `false` | Dessine le thème sombre à la place du thème clair. |
| `scale` | `2` | `1`, `2` ou `3` pixels d’image par unité du diagramme à 100 %. Il ne dimensionne que le PNG ; un SVG a la taille du diagramme quelle que soit l’échelle. |

`toImage()` ne lit aucune autre clé : une clé que le tableau ne liste pas ne change donc rien.

## Ce qu’il dessine {#what-it-draws}

L’image est celle que dessine la boîte de dialogue :

- Le diagramme entier, rogné sur ce qu’il dessine plus une marge et toujours à 100 %, quel que soit le zoom auquel le document a été enregistré, si bien que chaque table est dessinée en entier. Ce que [View Option](../guide/guides/table-related-functions.md#table-view-options) masque dans le document n’est ni dessiné ni doté d’espace, les groupes de tables sont dessinés derrière tout le reste, et les couleurs que les [vérifications du dictionnaire](../guide/guides/dictionary.md#marks-on-the-canvas) donnent aux noms ne sont pas dessinées.
- Un PNG a la taille du diagramme à 100 % multipliée par `scale`. Un PNG trop grand pour un canevas de navigateur est écrit à une résolution réduite plutôt que d’échouer, et `toImage()` ne le signale pas.
- Un SVG conserve son texte sous forme de texte et nomme ses polices au lieu de les intégrer, si bien qu’un lecteur qui n’a pas la police de l’éditeur en dessine une autre. Les ombres sont omises.

Là où la boîte de dialogue prend l’écran de l’éditeur, `toImage()` ne prend que le document, si bien qu’un document se dessine de la même façon sur toutes les pages :

- Ses couleurs sont celles du thème prédéfini du gris et de l’accent par défaut de l’élément, `slate` et `indigo`, clair sauf si `darkMode` vaut `true`. Aucun thème de la page, aucun remplacement de [setTheme](./erd-editor-element.md#settheme) et aucun changement du [configurateur de thème](../guide/guides/language-and-theme.md) ne l’atteint.
- Ses tables et ses colonnes sont nommées dans l’[affichage des noms](../guide/guides/logical-names.md#name-view) que contient le document, qui est, pour un fichier dont le verrou `Name View` est activé, celui auquel il est verrouillé.
- Les mots que le diagramme dessine lui-même, comme le texte de remplacement d’une table sans nom, sont en anglais.

## Où il s’exécute {#where-it-runs}

`toImage()` a besoin d’une page de navigateur, puisqu’il mesure et dessine sur un canevas. La racine du paquet dont il provient a besoin d’un DOM pour se charger : il n’est donc pas atteignable depuis Node ni depuis un Web Worker (voir [Rendu côté serveur](./installation.md#server-side-rendering)).  
Il attend que les polices de la page aient fini de se charger avant de dessiner.

Il dessine dans le worker partagé d’exportation d’images là où l’hôte en exécute un, comme le fait la boîte de dialogue, si bien que la page reste réactive entre-temps, et sur le thread principal là où il n’y en a pas ou quand le worker ne répond pas à temps (voir [Web Workers](./installation.md#web-workers)).  
Un bundle qui importe `toImage` sans aucun élément ne contient que le worker d’exportation d’images.  
Aucun des deux builds pour [balise script](./installation.md#script-tag) ne le contient : `window.ErdEditor` et `window.ErdViewer` n’ont pas de `toImage`.

## Rejets {#rejections}

La Promise qu’il renvoie est rejetée, avant que quoi que ce soit soit dessiné, quand :

- la page n’a pas de `document` : une `Error`, `toImage needs a browser, since it draws on a canvas` ;
- `value` n’est pas une chaîne, comme un document déjà analysé en objet : une `TypeError` ;
- une option contient une valeur que le tableau [Options](#options) ne liste pas, un `format` manquant compris, de même qu’un `scale` valant `'2'` passé avec un SVG : une `TypeError` qui nomme l’option, comme dans `toImage: scale cannot be 4` ;
- le texte n’est pas un document que l’analyseur sait lire : l’erreur de l’analyseur, une `SyntaxError` pour un texte qui n’est pas du JSON.

## Boîte de dialogue Export image {#export-image-dialog}

La boîte de dialogue et `toImage()` dessinent par la même exportation : avec les mêmes options, elles écrivent donc la même image, mais elles partent d’endroits différents :

| | Boîte de dialogue `Export image` | `toImage()` |
| --- | --- | --- |
| Document | Le diagramme tel qu’il était à l’ouverture de la boîte de dialogue | Le texte que vous passez |
| Mode sombre | Démarre en accord avec l’apparence de l’éditeur et, tant qu’il y est conforme, dessine les couleurs propres à l’écran | Désactivé sauf si `darkMode` vaut `true`, et toujours le thème prédéfini |
| Affichage des noms | Celui qu’affiche l’éditeur | Celui que contient le document |
| Langue de ses propres mots | La langue d’affichage de l’éditeur | L’anglais |
| Résultat | Enregistré par le navigateur ou par la [fonction de rappel d’exportation](./installation.md#file-dialogs), ou copié dans le presse-papiers | Vous est rendu ; aucune des deux fonctions de rappel de fichiers n’est appelée |

`Copy to clipboard` n’a pas d’équivalent. Une page qui en veut un écrit elle-même le `Blob` PNG dans le presse-papiers.
