---
sidebar_position: 18
description: "Afficher un diagramme en lecture seule sur un autre site sans code en encadrant erd-editor.io/embed, construire son URL et sa ligne iframe dans le générateur, régler le thème, la langue, l’affichage des noms, la minicarte, les commandes et les couleurs dans l’URL, et servir le fichier depuis GitHub ou depuis un serveur qui autorise CORS."
---

# Intégration

[erd-editor.io/embed](https://erd-editor.io/embed) affiche un diagramme en lecture seule dans une visionneuse qui remplit la page, pour qu’un autre site l’encadre : un wiki, un blog, un constructeur de site ou toute page qui ne peut pas charger de scripts de son cru.  
Son paramètre `src` nomme le document, l’adresse d’un fichier tel que l’enregistre ERD Editor, comme un fichier `.erd.json`. Le reste de l’URL règle la façon dont la visionneuse l’affiche, et le générateur, à la même adresse, écrit pour vous l’URL et sa ligne iframe.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Ce cadre affiche [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) du dépôt erd-editor, et voici la ligne qui le place dans une page :

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Ce que le cadre affiche {#what-the-frame-shows}

Le cadre affiche les tables, les colonnes, les relations, les mémos et les groupes de tables du diagramme, et rien n’y modifie le diagramme ni le fichier.  
Le diagramme est ajusté au cadre pendant son chargement, quels que soient le zoom et la position de défilement qu’avait enregistrés le fichier : la taille du cadre décide donc du zoom auquel il s’ouvre.

Sur le canevas se trouvent :

- La minicarte, tant que le diagramme a du contenu.
- La barre de commandes en bas : `Zoom out`, le niveau de zoom, qui réinitialise le zoom quand on clique dessus, `Zoom in`, `Fit`, la liste `Name View` et `Go to content` tant qu’aucune partie du diagramme n’est à l’écran.
- Le lien `erd-editor.io` en bas à droite, qui ouvre erd-editor.io dans un nouvel onglet sans lui envoyer de référent : le clic n’apprend donc rien au site sur le document que le cadre affiche. Dans un cadre étroit, il peut recouvrir une partie de la barre de commandes.

Pendant le chargement du fichier, le cadre affiche `Loading diagram`. S’il ne peut pas être récupéré ou ne contient aucun document, le cadre affiche un diagramme vide avec `Couldn't load the diagram` (voir [Fichiers sur GitHub](#files-on-github) et [Fichiers sur d’autres serveurs](#files-on-other-servers)).

Le cadre ne suit que son URL et le système du visiteur. La langue et le thème propres au visiteur sur erd-editor.io ne s’y appliquent pas.

## Le générateur {#the-builder}

Ouvrez [erd-editor.io/embed](https://erd-editor.io/embed) sans `src` pour obtenir le générateur, une page intitulée `Embed a diagram` :

1. Collez l’adresse du document dans `Document URL`. Elle s’applique quand vous appuyez sur `Enter` ou quittez le champ : saisir ne récupère donc rien. Une fois appliquée, une ligne `Loads from` sous le champ nomme l’adresse que récupère la visionneuse : celle que vous avez donnée ou, pour une page sur GitHub, son adresse sur l’hôte brut de GitHub (voir [Fichiers sur GitHub](#files-on-github)).
2. Choisissez les options. Chacune s’applique aussitôt à l’aperçu, à l’URL et à la ligne iframe :
   - `Theme` : `System`, `Light` ou `Dark`.
   - `Display Language` : `System`, avec à côté la langue qu’il représente dans votre navigateur, puis les 25 langues, chacune dans son propre nom.
   - `Name View` : `As Saved`, `Physical Names`, `Logical Names` ou `Both Names`. `As Saved` affiche l’affichage des noms qu’a enregistré le fichier.
   - `Accent color` et `Gray color`, chacune listée par nom avec un échantillon.
   - `Minimap` et `Controls`, deux interrupteurs, tous deux activés.
   - `Height`, en pixels, `480` au départ. Une hauteur qui n’est pas un entier positif compte pour `480`.
3. Vérifiez l’aperçu, `Preview` : la visionneuse telle que la montrera le cadre, avec le lien `erd-editor.io`, dans une boîte aussi haute que `Height`. Sa langue `System` est celle de votre navigateur, quelle que soit la langue qu’affiche erd-editor.io lui-même.
4. Copiez le résultat. `Embed URL` est l’adresse du cadre, et `Embed code` la ligne iframe, avec la hauteur que vous avez réglée et la largeur `100%`. Chacun a un bouton `Copy`, qui reste désactivé tant qu’aucune URL de document ne s’applique, et qui affiche `Copied` un instant après une copie, jusqu’à ce qu’un changement réécrive ce qu’il a copié.

Effacer `Document URL` vide l’aperçu et les deux résultats une fois que cela s’applique.

## Paramètres d’URL {#url-parameters}

| Paramètre | Valeurs | Valeur par défaut |
| --- | --- | --- |
| `src` | L’adresse du document, encodée en URL. | Aucune : sans lui, ou avec un paramètre vide, la page est le générateur. |
| `theme` | `light`, `dark` ou `system`. | `system` : le mode clair ou sombre que signale le navigateur du visiteur. |
| `locale` | `system`, ou un code du [tableau des langues](./language-and-theme.md#display-language), comme `de-DE`. | `system` : les langues du navigateur du visiteur, appariées comme le fait [System](./language-and-theme.md#what-system-follows), et l’anglais quand la visionneuse n’en a aucune. |
| `name-view` | `physical`, `logical` ou `both`. | L’affichage des noms qu’a enregistré le fichier. |
| `minimap` | `false` masque la minicarte. | Affichée. |
| `controls` | `false` masque la barre de commandes. | Affichée. |
| `accent-color` | L’une des 26 couleurs d’accentuation du [configurateur de thème](./language-and-theme.md#theme), comme `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` ou `sand`. | `slate` |

Les valeurs par défaut sont celles de la visionneuse, et non celles de l’application web, qui démarre sur `jade` et `olive`.

- Le générateur laisse chaque option à sa valeur par défaut hors de l’URL : une URL d’intégration ne contient donc que ce qui diffère.
- Une valeur que la visionneuse ne prend pas est ignorée, et son option garde la valeur par défaut. Les valeurs sont appariées exactement comme listées : `theme=Dark` est donc ignoré, et `minimap` et `controls` restent affichés pour toute valeur autre que `false`.
- Un paramètre donné deux fois prend sa première valeur.
- `src` est encodé en URL, comme l’écrit le générateur, car une adresse qui contient un `&` ou un `#` est sinon coupée net.

## Fichiers sur GitHub {#files-on-github}

Un fichier ou un gist sur GitHub peut être donné par l’adresse qu’affiche sa page, comme l’est le cadre ci-dessus. La visionneuse le récupère plutôt depuis l’hôte brut de GitHub, qui répond à la requête d’un autre site là où l’adresse de la page elle-même ne le fait pas :

- La page d’un fichier, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, ou son adresse `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, se charge depuis `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` est une branche, une étiquette ou un commit : une branche montre le fichier tel que cette branche l’a, et une étiquette ou un commit conserve cette version.
- La page d’un gist, `https://gist.github.com/<user>/<id>`, se charge depuis `https://gist.githubusercontent.com/<user>/<id>/raw`, qui est le premier fichier du gist. Gardez le diagramme comme seul fichier du gist.

L’URL d’intégration conserve l’adresse que vous avez donnée, et la ligne `Loads from` du générateur montre celle qui est récupérée.  
Cela ne fonctionne que pour les dépôts publics et les gists publics. L’hôte brut met chaque fichier en cache pendant cinq minutes : une modification que vous poussez peut donc mettre ce temps à apparaître dans le cadre.

## Fichiers sur d’autres serveurs {#files-on-other-servers}

La visionneuse d’erd-editor.io récupère le fichier avec un simple `GET` depuis le navigateur du visiteur : le serveur qui le détient doit donc autoriser cette requête inter-origines (CORS). Sa réponse a besoin d’un en-tête `Access-Control-Allow-Origin` qui autorise `https://erd-editor.io`, comme `*`.  
La requête ne porte aucun cookie : le fichier doit donc être lisible sans connexion.  
Sans cet en-tête, ou pour une adresse qui répond par une erreur ou par autre chose qu’un document ERD Editor, le cadre affiche `Couldn't load the diagram`.

## Dans le cadre {#in-the-frame}

Le cadre ne prend ni molette, ni geste, ni touche tant qu’un visiteur n’a pas cliqué ou touché dessus ou n’y est pas arrivé avec `Tab`. D’ici là, la molette, un balayage et un pincement font défiler ou zoomer la page autour de lui comme d’habitude.  
Une fois qu’il a le focus, la molette déplace le diagramme, `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) et un pincement le zooment, et `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) ouvre une recherche dans le document, où `#` trouve une table, `@` une colonne et `:` un commentaire ou un mémo.  
Un glissement déplace le diagramme que le cadre ait le focus ou non, et un clic ou un toucher éclaire des relations : celles de la table cliquée, ou la seule relation cliquée. La table sur laquelle repose le pointeur éclaire les siennes. Voir [Focus et touches](../../api/erd-viewer-element.md#focus-and-keys) pour chaque touche.

Pour l’essayer sur un diagramme plus grand, en zoomant et en recherchant, ouvrez l’[exemple de la librairie](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), neuf tables et deux groupes de tables, dans une page à part.

## Statistiques {#analytics}

erd-editor.io compte les visites du cadre avec Google Analytics, comme il compte celles de l’application web. L’adresse qu’il enregistre pour un cadre est `erd-editor.io/embed` seule, sans l’adresse du document que nomme `src`.  
Voir la [politique de confidentialité](https://erd-editor.io/privacy).

## Charger vous-même la visionneuse {#loading-the-viewer-yourself}

Une page qui peut charger des scripts peut afficher un diagramme avec l’élément [`<erd-viewer>`](../../api/erd-viewer-element.md) du paquet `@dineug/erd-editor` plutôt qu’avec un cadre. Il prend les mêmes options sous forme d’attributs et de méthodes, ne fait aucune requête vers erd-editor.io, et peut charger un document depuis le site même de la page, ce qui n’a pas besoin de CORS.
