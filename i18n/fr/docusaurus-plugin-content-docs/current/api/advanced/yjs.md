---
sidebar_position: 2
description: Synchroniser un élément <erd-editor> ou un store pair sans interface par un document Yjs avec @dineug/erd-editor-yjs, initialiser une salle, afficher la présence avec Awareness, continuer à modifier hors ligne et replier l’historique de la salle avec un sidecar de compactage.
---

# Yjs

`@dineug/erd-editor-yjs` synchronise des diagrammes par un document [Yjs](https://github.com/yjs/yjs). C’est un paquet à part, publié pour la première fois en version `0.1.0` à côté de `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` lie un élément `<erd-editor>`, et `bindPeerStore` un store pair sans interface de `@dineug/erd-editor/peer.js`, à un `Y.Doc`.  
Le fournisseur qui transporte le `Y.Doc` transporte le diagramme : un serveur websocket, WebRTC, IndexedDB, ou le vôtre. Le fournisseur et le `Y.Doc` restent à vous : la liaison ne les connecte, ne les déconnecte et ne les détruit jamais.

Les modifications circulent sous la forme des lots d’actions de l’éditeur, que la liaison conserve tels que le store les a envoyés.  
Ainsi, les registres de collaboration de l’éditeur départagent les modifications faites au même moment comme dans une session branchée par `getSharedStore`, avec les mêmes exceptions, comme un changement de couleur (voir [Modifications concurrentes](./collaborative-editing.md#concurrent-edits)).  
Les curseurs, le focus, les sélections et les rectangles de sélection circulent par l’Awareness du fournisseur (voir [Présence](#presence)).  
Par rapport à un store partagé que vous brancheriez vous-même à un transport, la liaison ajoute :

- Un client qui arrive ouvre le diagramme que détient la salle, sans [runtimeValue](../erd-editor-element.md#runtimevalue) transmis par un éditeur en cours d’exécution.
- Un client déconnecté continue à modifier, et ses modifications arrivent à sa reconnexion (voir [Modifications hors ligne et nouvelles arrivées](#offline-edits-and-rejoins)).
- Un `Y.Doc` que restitue un fournisseur de persistance ouvre le diagramme qu’il détient (voir [Contenu de la salle](#what-the-room-holds)).
- Un sidecar Node facultatif replie l’historique de la salle dans un seul instantané (voir [Compacter une salle](#compacting-a-room)).

La liaison a besoin des cinq méthodes que la version `5.1.0` a ajoutées au store partagé et au store pair ([getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) et [reseed](./collaborative-editing.md#reseed)), et fait elle-même tous les appels dont elle a besoin.

## Installation {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` et `y-protocols` sont des dépendances pairs, si bien qu’une page en contient une seule copie de chacun : `@dineug/erd-editor` `5.1.0` ou version ultérieure dans la `5.x`, `yjs` `13.6` ou version ultérieure dans la `13.x`, et `y-protocols` `1.0` ou version ultérieure dans la `1.x`.  
Le paquet n’utilise que leurs types et travaille sur le `Y.Doc` et l’`Awareness` que vous lui passez, donc il ne charge aucun code Yjs, y-protocols ou éditeur qui lui soit propre.  
Deux copies de Yjs dans une même page faussent les vérifications de constructeur l’une de l’autre, et la seconde journalise `Yjs was already imported`. Si votre code et un fournisseur résolvent `yjs` depuis deux endroits, dédupliquez-le dans le bundler (Vite : `resolve.dedupe: ['yjs']`).

Le paquet est uniquement ESM (`"type": "module"`), avec un seul point d’entrée, la racine du paquet, et il est déclaré sans effet de bord, si bien qu’un bundle qui n’importe que `bindErdEditor` laisse le compacteur de côté.  
`bindErdEditor` a besoin d’un DOM, puisqu’il lie un élément `<erd-editor>` défini. `bindPeerStore` fonctionne aussi dans Node.js seul, à partir de Node.js 22.12, comme le fait le [sidecar de compactage](#compacting-a-room).

## Utilisation {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` et `my-diagram` représentent votre propre serveur et votre propre salle.  
Liez, et initialisez, seulement une fois le fournisseur synchronisé, comme l’indique l’événement `sync` de y-websocket avec `true`. Une initialisation faite plus tôt peut remplacer le diagramme de la salle (voir [Initialiser une salle](#seeding-a-room)).

Quand le `Y.Doc` contient l’instantané d’une salle au moment de la liaison, la liaison l’ouvre aussitôt dans l’élément : elle charge l’instantané avec ses registres et sa version, comme le fait [reseed](./collaborative-editing.md#reseed), puis applique toutes les modifications journalisées depuis.  
Cette ouverture efface et ferme ce que fait une nouvelle arrivée (voir [Modifications hors ligne et nouvelles arrivées](#offline-edits-and-rejoins)), et l’élément s’ouvre là où l’instantané le place. Aucun `rejoin` n’est déclenché pour cette première ouverture.  
Quand le `Y.Doc` ne contient aucun instantané, comme dans une salle vide ou avant que le fournisseur se soit synchronisé, l’élément garde son document, et la liaison n’écrit rien dans la salle tant qu’aucun instantané n’apparaît, sa propre [initialisation](#seed) ou celle d’un autre client.

`bindErdEditor` prend un store partagé de l’élément avec [getSharedStore](../erd-editor-element.md#getsharedstore), et [destroy](#destroy) le libère.  
L’élément doit déjà être un `<erd-editor>`, son point d’entrée importé ou `defineErdEditor()` appelé (voir [Enregistrer les éléments](../installation.md#registering-the-elements)). Tant que la balise n’est pas définie, un `<erd-editor>` est un simple `HTMLElement`, que le navigateur met à niveau une fois la balise définie et l’élément dans le document. Pour un élément pas encore mis à niveau, `bindErdEditor` lève une `TypeError` au lieu de déclencher `error`.

Les modifications de la salle s’appliquent à l’élément, et déclenchent [change](../erd-editor-element.md#change), comme celles d’un collaborateur, y compris les modifications rejouées après l’ouverture d’un instantané.  
L’ouverture d’un instantané, à la liaison ou lors d’une nouvelle arrivée, ne crée aucune entrée d’annulation, ne déclenche aucun `change` et n’écrit rien dans la salle, hormis la dérivation du nom logique que décrit [Modifications hors ligne et nouvelles arrivées](#offline-edits-and-rejoins).  
Pour charger un autre document dans une salle initialisée, faites une modification que chaque client applique : affectez [value](../erd-editor-element.md#value), appelez [clear](../erd-editor-element.md#clear), ou importez-en un.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) n’est jamais écrit dans la salle, puisqu’un store partagé ne l’envoie pas, si bien qu’il ne change que cet élément pendant que tous les autres clients gardent le diagramme de la salle. Initialisez plutôt une salle vide avec [seed](#seed).

Un `Y.Doc` contient un seul diagramme. La liaison le conserve sous les noms `erd:` du `Y.Doc` et renseigne le champ `erd` de l’état Awareness local, et laisse intacts tous les autres noms et champs.  
Donnez à chaque élément lié son propre `Y.Doc` et sa propre Awareness, comme chaque client d’une salle : deux liaisons qui partagent une même Awareness s’écrasent mutuellement le champ `erd`.

## Initialiser une salle {#seeding-a-room}

Une salle ne contient aucun diagramme tant qu’un client ne l’[initialise](#seed) pas.  
Ce qu’un éditeur contient entre-temps entre dans sa propre initialisation, et cède la place à l’initialisation d’un autre client si celle-ci arrive la première : la liaison se rouvre dessus avec `rejoin('snapshot')`, et le document que l’élément contenait, avec ce qui y a été modifié depuis la liaison, est perdu.

Quand deux clients initialisent en même temps, une initialisation l’emporte sur tous les clients.  
L’autre client qui a initialisé se rouvre dessus avec `rejoin('seedLost')` et perd ce qu’il a modifié depuis son initialisation, tout comme un client qui avait rejoint l’initialisation perdante, avec `rejoin('snapshot')`. Leurs modifications dans l’initialisation perdante n’arrivent à personne.  
Une initialisation faite avant que le fournisseur se soit synchronisé compte comme faite au même moment que l’initialisation dont provient le diagramme de la salle, si bien qu’elle peut l’emporter sur elle et remplacer le diagramme de la salle.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

L’`Awareness` qui transporte les curseurs, le focus, les sélections et les rectangles de sélection, comme celle du fournisseur.  
Avec elle, la liaison active les suiveurs de la souris et du focus de l’élément et dessine sur l’élément la présence des autres clients (voir [Présence](#presence)).  
Sans elle, seul le diagramme est synchronisé : l’élément n’envoie ni curseur, ni focus, ni sélection, et ne dessine pas ceux des autres.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

Le nom que les autres voient à côté du curseur de cet éditeur.  
Le store partagé de l’élément le lit à chaque envoi, comme avec [getSharedStore](./collaborative-editing.md#getnickname), et les autres utilisateurs voient `user` quand il est absent ou vide.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` renvoie une fonction qui retire l’écouteur.

### seed {#seed}

Écrit le premier instantané de la salle à partir du document de l’éditeur et renvoie `true`.  
Avec `value`, un texte de document sous toute forme que lit [setInitialValue](../erd-editor-element.md#setinitialvalue), la méthode le charge d’abord dans l’éditeur.  
Elle abandonne ensuite, sans les journaliser, les glissements, redimensionnements et changements de couleur que l’éditeur retient encore, si bien qu’aucun n’arrive dans la salle après l’instantané. Sans `value`, l’instantané les montre déjà, puisqu’il prend le document de l’éditeur ; avec `value`, ils appartenaient au document que `value` a remplacé.  
Elle écrit ensuite l’instantané que décrit [Contenu de la salle](#what-the-room-holds).  
Une fois que la salle contient un instantané, elle renvoie `false` et n’écrit rien, sans charger `value`, si bien que chaque client peut l’appeler après la liaison. Elle renvoie aussi `false` quand la liaison a été détruite ou arrêtée, et sur une liaison [refusée](#onerror) au moment de la liaison.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

La liaison a rouvert l’éditeur sur l’instantané de la salle, comme le fait [reseed](./collaborative-editing.md#reseed) ; [Modifications hors ligne et nouvelles arrivées](#offline-edits-and-rejoins) dit ce qu’elle conserve et ce qu’elle perd.  
`reason` indique pourquoi :

- `'snapshot'` : l’instantané contient des modifications que la liaison n’avait pas appliquées, parce qu’elle était absente pendant qu’un compacteur les repliait, ou parce qu’un compacteur a remis, dans un repli qui lui est propre, ce qu’il avait replié dans un instantané qu’a remplacé celui d’un autre compacteur (voir [Un compacteur par salle](#one-compactor-per-room)). C’est aussi la raison quand l’instantané est le premier à atteindre une liaison dans une salle vide, et quand il provient d’une autre initialisation et que cette liaison avait rejoint une initialisation qu’elle n’avait pas écrite.
- `'seedLost'` : l’initialisation d’un autre client l’a emporté sur celle qu’a écrite cette liaison.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

La liaison a refusé de lier, s’est arrêtée, ou a rejeté une option. Chaque message commence par `erd-editor-yjs: `.

Au moment de la liaison, elle ne lie rien quand :

- l’éditeur ou le store pair est déjà lié à ce `Y.Doc` ;
- son `@dineug/erd-editor` a été construit avant la version `5.1.0` ; la liaison détruit le store partagé qu’elle avait pris à un élément ;
- le store pair a été détruit avant d’être lié ;
- la salle contient un instantané dans une structure que cette version ne lit pas (voir [Contenu de la salle](#what-the-room-holds)).

Une telle liaison déclenche `error` dans une microtâche, si bien qu’un écouteur ajouté juste après l’appel l’entend, et aucun `rejoin` n’est jamais déclenché sur elle.

Plus tard, la liaison s’arrête quand :

- l’instantané de la salle passe à une structure que cette version ne lit pas. Toutes les liaisons de cette version s’arrêtent, chaque éditeur garde ce qu’il avait appliqué, et rien de ce qui est modifié ensuite n’est écrit ;
- son store pair a été détruit sous elle, ce qu’elle constate la prochaine fois que la salle change ou que `seed()` ou `compact()` est appelé.

Une liaison qui s’arrête libère le store partagé qu’elle avait pris, ainsi que la paire formée par son store et son `Y.Doc`, comme le fait [destroy](#destroy), et conserve ses écouteurs.

Pour `bindPeerStore` seulement, ces cas déclenchent `error` et la liaison continue :

- `compactAfter` n’est pas un entier positif : la liaison ne replie que sur demande ;
- `electionGraceMs` ou `retainMs` n’est pas un nombre de 0 à 2 147 483 647 ms : sa valeur par défaut le remplace, puisqu’un minuteur au-delà de cette plage se déclenche aussitôt ;
- `synced` est rejetée : la liaison ne replie jamais, et laisse l’élection aux autres compacteurs (voir [Un compacteur par salle](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Envoie dans la salle les glissements, redimensionnements et changements de couleur que l’éditeur retient encore, met le champ Awareness `erd` de la liaison à `null`, si bien que les autres abandonnent aussitôt son curseur, son focus et sa sélection, et cesse d’observer le `Y.Doc` et l’Awareness.  
Pour un élément, elle détruit aussi le store partagé qu’elle avait pris, en laissant l’élément et son document tels quels.  
Un second appel ne fait rien. Ensuite, ce que l’éditeur modifie n’arrive à personne.

Le store pair, le `Y.Doc` et le fournisseur restent à vous, à détruire après la liaison : un store pair détruit en premier n’envoie jamais les glissements qu’il retenait encore.  
Le [destroy](../erd-editor-element.md#destroy) de l’élément détruit tous les stores partagés qu’il a remis, y compris celui de la liaison, et abandonne ce qu’ils retiennent, donc détruisez d’abord la liaison.  
Détruisez une liaison avant de lier à nouveau le même éditeur ou le même store pair au même `Y.Doc` ; une liaison arrêtée par `error` s’est déjà libérée.

```js
binding.destroy();
editor.destroy();
```

## Présence {#presence}

Avec [awareness](#awareness), le curseur de l’éditeur, la table ou la cellule qui a le focus, la sélection et le rectangle de sélection circulent dans le champ `erd` de son état Awareness local, jamais dans le `Y.Doc`, si bien qu’ils n’entrent jamais dans l’historique de la salle, son instantané ou un `Y.Doc` persisté.  
Les autres les dessinent comme ils dessinent la présence d’un collaborateur (voir [focusTracker](./collaborative-editing.md#focustracker)), et un client qui arrive dessine la présence que la salle montre déjà.  
L’élément renvoie son focus et sa sélection toutes les 30 secondes, et son rectangle de sélection chaque seconde. Chacun de ces renvois atteint les autres même quand il répète le précédent, si bien que ce qu’un utilisateur tient encore n’expire jamais.

Un client qui part est oublié aussitôt.  
Quand l’Awareness abandonne son état, ou que son champ `erd` passe à `null`, comme le fait [destroy](#destroy), ou désigne un autre éditeur, la liaison retire de l’élément le curseur, le focus, la sélection et le rectangle de sélection de cet éditeur avec [forgetPeer](./collaborative-editing.md#forgetpeer) au lieu d’attendre leur expiration.  
Elle les conserve tant qu’un autre client montre encore le même éditeur, comme le fait un élément lié à nouveau à un autre `Y.Doc` de la salle.

## Modifications hors ligne et nouvelles arrivées {#offline-edits-and-rejoins}

Un client déconnecté du fournisseur continue à modifier. Ses modifications attendent dans son `Y.Doc` local, pas dans le store partagé, et arrivent aux autres quand le fournisseur se reconnecte et se synchronise.

Quand un compacteur a replié des modifications que le client n’avait jamais appliquées pendant son absence, l’instantané les contient, si bien qu’à la reconnexion le client se rouvre sur l’instantané avec `rejoin('snapshot')`, après avoir envoyé les glissements, redimensionnements et changements de couleur que son éditeur retenait encore. Un repli de seulement ce que le client avait appliqué ne rouvre rien.  
Une nouvelle arrivée sur un instantané de l’initialisation que la liaison avait rejointe rejoue toutes les modifications que l’instantané ne contient pas, y compris celles de ce client faites pendant son absence, si bien qu’aucune n’est perdue. Une nouvelle arrivée sur une autre initialisation ne conserve rien, comme le décrit [Initialiser une salle](#seeding-a-room).

Toute nouvelle arrivée efface l’historique d’annulation, la sélection et le focus, et ferme une vue [Flux](../../guide/guides/visualization.md#flow-mode) ouverte, un [tracé de relation](../../guide/guides/editing-start.md#relationship-creation), et un éditeur de mémo, de nom de groupe de tables ou de cellule, puisqu’ils peuvent désigner ce que l’instantané ne contient plus.  
Un nom de groupe de tables saisi et pas encore validé est abandonné. Une cellule de nom logique qui se ferme dérive le nom physique d’un nom logique que son lecteur a saisi, là où le document rouvert le contient encore, comme le fait toute fermeture de cette cellule. Cette dérivation est une modification ordinaire : la salle la journalise, elle crée une entrée d’annulation et elle déclenche `change` (voir [reseed](./collaborative-editing.md#reseed)).  
Une liaison qui avait rejoint la salle conserve ce que voit son lecteur : la position de défilement, le niveau de zoom et l’onglet, ainsi que les paramètres qu’un lecteur en lecture seule a changés.  
Elle conserve aussi l’affichage des noms et les paramètres de code (langage du générateur de code, casse des noms et type de délimiteur) que le lecteur avait choisis pour lui, tant que le [verrou](../../guide/guides/settings.md#lock) de chacun était activé avant la nouvelle arrivée et l’est encore après, à la même valeur verrouillée.  
Rien de ce qu’elle conserve n’arrive dans `value`, qui rend compte des paramètres du document rouvert (voir [reseed](./collaborative-editing.md#reseed) avec `keepScreen`).  
La position de défilement et le niveau de zoom d’un élément non affiché depuis son dernier chargement, et tout l’écran d’une liaison qui n’avait pas encore rejoint la salle, s’ouvrent là où l’instantané les place.  
Un store pair n’a pas d’écran, donc sa nouvelle arrivée n’en conserve aucun.

## Éditeurs en lecture seule {#read-only-editors}

Un élément [en lecture seule](../erd-editor-element.md#readonly) lié à une salle n’écrit rien dans l’historique de la salle : son store partagé n’envoie aucune modification, seulement ses suiveurs et la poignée de main des registres, et la salle [ne journalise ni l’un ni l’autre](#what-the-room-holds).  
Il applique tout de même toutes les modifications que porte la salle, et avec [awareness](#awareness) le curseur, le focus, la sélection et le rectangle de sélection de son lecteur atteignent toujours les autres.  
Les paramètres que son lecteur change restent sur son écran, comme sur tout éditeur en lecture seule.  
[seed](#seed) n’est pas refusé : un élément en lecture seule initialise une salle vide avec le document qu’il contient, ou avec `value` s’il est donné.

## Contenu de la salle {#what-the-room-holds}

La liaison conserve le diagramme sous deux noms du `Y.Doc` : `erd:snapshot`, une map qui contient un instantané du document, et `erd:log`, un tableau des lots d’actions de l’éditeur depuis. Un fournisseur de persistance stocke les deux avec le reste du `Y.Doc`.

L’instantané contient le [runtimeValue](../erd-editor-element.md#runtimevalue) du document, entités supprimées comprises, ses registres de collaboration et sa version, ainsi que la mesure dans laquelle les modifications de chaque rédacteur y sont repliées. Une initialisation l’écrit, et chaque repli d’un compacteur aussi.  
Chaque entrée du journal est un lot tel que l’éditeur l’a envoyé, méta comprise, qui porte l’identifiant d’éditeur et le pseudonyme de l’expéditeur.  
Les défilements, zooms, changements d’onglet, la présence et la poignée de main des registres ne sont jamais journalisés. Toute autre modification que l’éditeur envoie l’est, y compris un changement d’affichage des noms fait sous son [verrou](../../guide/guides/settings.md#lock), que tous les autres clients abandonnent.  
Un langage du générateur de code, une casse des noms ou un type de délimiteur changé sous son verrou n’est jamais envoyé, si bien qu’il reste sur l’écran de cet éditeur et n’arrive jamais dans la salle.

Un `Y.Doc` que restitue un fournisseur de persistance ouvre le diagramme qu’il contient, comme une liaison ouvre tout `Y.Doc` qui contient un instantané (voir [Utilisation](#usage)).

L’instantané n’est pas un fichier : sa valeur d’exécution porte des entités supprimées, qu’un fichier ne doit pas contenir.  
Pour écrire le diagramme de la salle dans un stockage, enregistrez le [value](../erd-editor-element.md#value) d’un élément lié chaque fois que son événement [change](../erd-editor-element.md#change) se déclenche.  
Enregistrez-le aussi une fois après la liaison, après un [seed](#seed) avec un `value`, et dans un écouteur de [rejoin](#onrejoin), puisqu’aucun de ces chargements ne déclenche `change`.  
Un élément [en lecture seule](../erd-editor-element.md#readonly) ne déclenche jamais `change`, donc enregistrez depuis un élément qui n’est pas en lecture seule, ou lisez `value` sur un store pair lié, qui applique les modifications de la salle à mesure qu’elles arrivent.  
Un [replicationStore](./remote-storage.md) ne peut pas être lié, puisqu’il n’a pas les méthodes dont une liaison a besoin, et un replicationStore alimenté par le store partagé d’un élément lié manque les modifications de la salle (voir [Répliquer un éditeur en cours d’exécution](./remote-storage.md#replicating-a-live-editor)).

La structure est privée et peut changer avec [ERD_YJS_FORMAT](#exports).  
Ne lisez une salle qu’à travers une liaison, et laissez-lui les noms `erd:` et le champ Awareness `erd`.

## Compacter une salle {#compacting-a-room}

L’historique de la salle grandit à chaque modification, et chaque client qui arrive le rejoue en entier, tant que rien ne le replie.  
`bindPeerStore` lie un store pair sans interface de `@dineug/erd-editor/peer.js` et renvoie un `ErdYjsPeerBinding` : les mêmes [seed](#seed), [on](#erdyjsbinding) et [destroy](#destroy), avec [compact](#compact).  
Un store pair lié dans un processus Node à côté du serveur, un sidecar, replie l’historique dans un instantané de son propre diagramme.  
La liaison d’un élément ne replie jamais, et un store pair lié sans `compactAfter` ni appel de `compact()` est un pair sans interface ordinaire.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

Le store pair reste à vous : la liaison ne le détruit jamais. Son pseudonyme est celui qu’a reçu `createPeerStore`, et `presence: false` l’empêche d’envoyer un focus qui lui soit propre.

Un repli écrit l’instantané à partir de la valeur d’exécution, des registres et de la version du store pair, et supprime les entrées du journal qu’il couvre ainsi que toutes les entrées d’une autre initialisation, le tout dans une seule transaction.  
Les clients qui ont tout appliqué voient les entrées disparaître ; un client qui n’avait pas tout appliqué se rouvre sur l’instantané (voir [Modifications hors ligne et nouvelles arrivées](#offline-edits-and-rejoins)).  
Chaque repli réécrit tout le diagramme dans l’instantané, si bien que chacun envoie à chaque client une mise à jour à peu près de la taille du JSON d’exécution et des registres du diagramme réunis, aussi peu d’entrées qu’il prenne. Fixez `compactAfter` assez haut pour que les entrées qu’un repli prend pèsent plus qu’une copie du diagramme.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Option | Valeur par défaut | Description |
| --- | --- | --- |
| `awareness` | Aucune | Montre le store pair dans l’Awareness de la salle, comme [awareness](#awareness) le fait pour un élément. Un compacteur qui replie de lui-même y est marqué, si bien que les compacteurs qui se voient en élisent un pour replier, et que celui qui ne voit aucun autre client ne replie rien de lui-même (voir [Un compacteur par salle](#one-compactor-per-room)). Sans elle, un compacteur replie de lui-même, sans élection ni délai de grâce. |
| `compactAfter` | Aucune | Replier de lui-même dès que le journal contient ce nombre d’entrées qu’un repli prendrait. Sans elle, ou sans `synced`, seul `compact()` replie, et le repli qui remet (voir [Un compacteur par salle](#one-compactor-per-room)). |
| `synced` | Aucune | Une promesse qui se résout une fois le fournisseur synchronisé. Aucun repli ne vient avant, `compact()` compris. Sans elle, rien ne replie de lui-même et `compact()` replie aussitôt. |
| `electionGraceMs` | `3000` | Avec `awareness`, la durée pendant laquelle le compacteur observe la salle avant de replier de lui-même, après `synced` et de nouveau chaque fois que d’autres clients apparaissent alors qu’aucun n’apparaissait. |
| `retainMs` | `600000` (dix minutes) | La durée pendant laquelle les entrées d’un repli restent conservées pour être remises (voir [Un compacteur par salle](#one-compactor-per-room)), comptée à partir de la première mise à jour que la salle envoie après le repli. |

Une option invalide, ou une `synced` rejetée, déclenche [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Replie aussitôt, sans élection, délai de grâce ni seuil.  
Elle prend d’abord en compte l’instantané actuel de la salle, nouvelle arrivée comprise, et envoie ce que son store pair retient encore.  
Elle répond `{ compacted: true, generation }`, où `generation` compte les replis de l’instantané : `0` pour une initialisation, un de plus par repli.  
Sinon, elle répond `{ compacted: false, reason }` :

- `'destroyed'` une fois la liaison détruite ou arrêtée, et sur une liaison [refusée](#onerror) au moment de la liaison, même avant que `synced` se résolve ;
- `'not-synced'` avant que `synced` se résolve ;
- `'no-snapshot'` dans une salle qu’aucun client n’a initialisée.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Un compacteur par salle {#one-compactor-per-room}

Exécutez exactement un compacteur par salle, et n’en démarrez un nouveau qu’une fois l’ancien arrêté. Rien ne l’impose.  
Parmi les compacteurs qui se voient dans l’Awareness, seul celui dont l’identifiant de client Yjs est le plus petit replie de lui-même, et quand il part, ou que sa `synced` est rejetée, le suivant prend aussitôt le relais.  
Un compacteur dont l’Awareness ne montre aucun autre client, comme quand son propre socket se ferme et les fait tous disparaître, ne replie rien de lui-même tant que d’autres n’apparaissent pas de nouveau et qu’il n’a pas observé la salle pendant `electionGraceMs`.

Deux compacteurs coupés l’un de l’autre, ou un redémarrage dont le prédécesseur tourne encore, peuvent tout de même replier chacun.  
La salle garde alors l’un des deux instantanés, et le compacteur dont l’instantané a perdu remet ce qu’il avait replié et que le gagnant ne contient pas, aussi longtemps qu’il le conserve : `retainMs`, et au plus ses 1 000 dernières entrées, quelle que soit leur taille.  
Rien n’est donc perdu quand le compacteur dont l’instantané perd est celui qui se reconnecte, pourvu qu’il n’ait pas replié plus de 1 000 entrées pendant la séparation.  
Quand c’est celui qui est resté en ligne et que sa conservation est épuisée, l’instantané et l’historique de la salle ne contiennent pas ce qu’il avait replié jusqu’à ce qu’il replie de nouveau. Un client qui a manqué ces modifications, ou qui arrive entre-temps, ne les a pas, et retient les modifications ultérieures de chaque rédacteur dont le compacteur avait replié les modifications. Le repli suivant du compacteur les ramène toutes, sauf si l’instantané gagnant contenait des modifications qui lui manquaient, ce qui le rouvre sur cet instantané et lui fait perdre définitivement ce qu’il avait replié.

Un compacteur remet dans un repli qui lui est propre, fait une fois rattrapé l’instantané gagnant, sans élection, délai de grâce ni seuil, et chaque client se rouvre sur ce repli avec `rejoin('snapshot')`.  
Les modifications qu’il remet n’atteignent aucun client en dehors de ce repli, si bien qu’un client resté en ligne aboutit au même résultat que les autres et qu’un client qui arrive plus tard, même quand une modification ultérieure d’un autre rédacteur s’appuie sur l’une d’elles, comme le renommage d’une table qu’un autre client a ajoutée.  
Chaque remise coûte à chaque client cette nouvelle arrivée, avec [ce qu’une nouvelle arrivée fait perdre](#offline-edits-and-rejoins). Quand deux compacteurs remettent en même temps, chaque client aboutit tout de même au même résultat, bien qu’une modification puisse rester appliquée avant celle sur laquelle elle s’appuie.  
Une liaison détruite ou arrêtée avant l’exécution de ce repli, comme quand un écouteur de `rejoin` la détruit, remet plutôt les modifications seules. Aucune n’est perdue, mais alors un client resté en ligne peut en appliquer une après la modification d’un autre rédacteur qui s’appuie sur elle, et se retrouver différent d’un client qui arrive plus tard.

## Limites {#limits}

- **La fenêtre d’affichage reste sur chaque écran.** Les défilements, zooms et changements d’onglet ne sont [jamais journalisés](#what-the-room-holds), bien qu’une session branchée par `getSharedStore` les envoie (ils ne déplacent pas non plus la vue ou l’onglet d’un autre utilisateur dans ce cas). Chaque lecteur garde les siens, et la liaison ne les montre que dans son état Awareness, que rien ne lit encore. Avec le [verrou](../../guide/guides/settings.md#lock) `Viewport` ou `Canvas Type` désactivé, le `value` de chaque client enregistre la sienne ; sous les verrous, qu’un nouveau document a activés, chaque client enregistre la valeur verrouillée.
- **L’instantané grandit d’une entrée par liaison.** Il conserve, pour chaque liaison qui a jamais écrit dans la salle, la mesure dans laquelle ses modifications sont repliées, et n’en abandonne jamais aucune. Une liaison refaite, ou une qui est passée à une autre initialisation, compte à nouveau, tout comme chaque repli qui remet. Une entrée est un identifiant de 32 caractères et un nombre, si bien que dix mille sessions d’écriture ajoutent quelques centaines de kilo-octets à chaque instantané et à chaque repli.
- **Un hub et une salle ne relaient rien entre eux.** Un élément lié à une salle et au [hub](../../mcp/live-and-headless.md#live) d’un agent de codage, ou à tout autre transport par `getSharedStore()`, applique les modifications des deux, mais aucun n’entend celles de l’autre, puisqu’un store partagé ne retransmet jamais ce qu’il a reçu.
- **Des ajouts faits en même temps peuvent être listés dans un ordre différent.** Des tables ou des mémos que deux clients ajoutent en même temps peuvent se trouver dans un autre ordre dans le diagramme de chaque client, comme dans une session branchée par `getSharedStore` (voir [Modifications concurrentes](./collaborative-editing.md#concurrent-edits)).
- **Les couleurs et quelques autres modifications faites en même temps peuvent aboutir à des résultats différents.** Un changement de couleur est journalisé sans version, et chaque client l’estampille de la sienne en l’appliquant. Deux changements de couleur d’une même table, d’un même mémo ou d’un même groupe de tables faits en même temps peuvent donc laisser des clients, et un client qui arrive plus tard et rejoue le journal, avec des couleurs différentes. Il en va de même des autres modifications que chaque client applique dans l’ordre où il les entend, comme deux déplacements de colonnes dans une même table ou un même index, ou deux changements de SGBD (voir [Modifications concurrentes](./collaborative-editing.md#concurrent-edits)).
- **Un curseur qui part attend le serveur.** La liaison efface le curseur d’un pair dès que l’Awareness l’abandonne. Un serveur qui, à la fermeture d’un socket, ne retire que les états Awareness que ce socket a ajoutés en premier garde sur l’écran des autres, après son départ, un client qui s’était reconnecté, jusqu’à ce que l’Awareness l’expire, 30 secondes plus tard. Un serveur qui retire tous les états qu’un socket a écrits en dernier, une mise à jour comme un ajout, l’efface aussitôt.

## Exports {#exports}

| Export | Description |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Lie un élément `<erd-editor>` (voir [Utilisation](#usage)). Renvoie un [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Lie un store pair de `@dineug/erd-editor/peer.js` (voir [Compacter une salle](#compacting-a-room)). Renvoie la même chose avec [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | La structure du `Y.Doc` que cette version écrit, `1` ; une liaison refuse une salle écrite dans une autre. |

Types : `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
