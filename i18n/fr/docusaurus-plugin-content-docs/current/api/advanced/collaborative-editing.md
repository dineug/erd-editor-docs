---
sidebar_position: 1
description: Relayer les modifications de l’éditeur entre instances avec getSharedStore, initialiser à partir de runtimeValue un éditeur qui rejoint la session, et afficher le curseur, le focus, la sélection et le rectangle de sélection de chaque collaborateur.
---

# Édition collaborative

`getSharedStore()` fait d’un éditeur un nœud d’une session collaborative.  
Elle émet chaque modification sous forme de flux d’actions et applique les actions que les autres éditeurs renvoient : c’est à vous de fournir le transport entre eux (WebSocket, WebRTC ou tout autre moyen capable de transporter du JSON).  
C’est l’une des méthodes d’[ErdEditorElement](../erd-editor-element.md), et elle se combine avec le [stockage distant](./remote-storage.md) lorsque les modifications relayées doivent aussi être stockées.

```ts
interface ErdEditorElement extends HTMLElement {
  // ...
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
}

type SharedStoreConfig = {
  getNickname?: () => string;
};

type SharedStore = {
  connection: () => void;
  disconnect: () => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  subscribe: (fn: (value: AnyAction[]) => void) => Unsubscribe;
  flushStreamBuffers: () => void;
  destroy: () => void;
};

// example
const sharedStore = editor.getSharedStore();
```

Une action est un simple objet sérialisable qui décrit une modification du document, si bien qu’elle passe intacte par `JSON.stringify` en route vers le transport.  
Les actions arrivent par lots : `subscribe` vous remet un tableau, et ce tableau forme une unité (relayez-le en entier et transmettez-le en entier de l’autre côté).  
Traitez une action comme opaque et faites-la suivre telle quelle plutôt que de la lire ou de la réécrire, car ce sont les données de suivi qu’elle porte qui maintiennent les éditeurs synchronisés.

Une partie de ce que fait un éditeur reste sur cet éditeur.  
Mettre une table, un mémo ou un groupe de tables au premier plan, comme le fait sa sélection, n’est pas envoyé.  
Les choix `Statements`, `Header` et `Tables` de l’onglet [Schéma SQL](../../guide/guides/schema-sql.md), qui appartiennent à la fenêtre où ils sont faits, ne le sont pas non plus.  
Depuis la version `4.1.0`, l’[explorateur](../../guide/guides/explorer.md) reste lui aussi sur son éditeur : son ouverture ou sa fermeture, sa largeur, ses lignes réduites, la ligne où se trouve le focus clavier, la position de défilement de son arborescence, ainsi que sa recherche et ses options ne sont pas envoyés.  
Aller à une clé étrangère met en surbrillance le connecteur de sa relation, et cette [surbrillance](../../guide/guides/relationship-editing.md#reading-a-connector) n’est pas envoyée non plus.  
Un défilement, un zoom ou un changement d’onglet est envoyé, mais il ne modifie jamais la vue ni l’onglet d’un autre utilisateur. Cela vaut aussi pour le défilement que provoque un saut depuis l’explorateur et pour le passage à l’onglet ERD quand l’explorateur s’ouvre depuis un autre onglet.

Les [verrous](../../guide/guides/settings.md#lock) sont partagés : le dernier verrouillage ou déverrouillage d’un paramètre l’emporte sur tous les éditeurs, et un verrou porte les valeurs de l’éditeur qui a verrouillé le paramètre, si bien que chaque éditeur et chaque réplique enregistrent la même valeur.  
Un verrou `Viewport` enregistre donc la vue de l’éditeur qui a verrouillé ce paramètre, et un verrou `Canvas Type` le dernier onglet ouvert sur cet éditeur avant l’onglet Paramètres, où se fait le verrouillage.  
Déverrouiller `Language`, `Table Name Case`, `Column Name Case` ou `Bracket Type` donne aussi à ce paramètre, sur tous les éditeurs, la valeur affichée sur l’éditeur qui l’a déverrouillé, si bien qu’ils continuent d’enregistrer une seule et même valeur. Déverrouiller `Viewport` ou `Canvas Type` ne change ni la vue ni l’onglet de personne.

Une modification du script `Before tables` ou `After tables` est envoyée en entier quand son champ perd le focus. Les modifications des deux scripts sont départagées séparément, si bien que la modification de l’un par un collaborateur n’écrase jamais l’autre.

Rien de ce qui se fait dans le [mode Flux](../../guide/guides/visualization.md#flow-never-edits-the-document) de l’onglet Visualisation n’est une modification du document, si bien qu’un éditeur en mode Flux n’envoie aucune modification aux autres, et que les modifications qu’ils envoient continuent de s’appliquer tant qu’il y reste.  
La seule exception est la sortie du mode Flux vers un autre onglet : ce changement d’onglet est envoyé comme n’importe quel autre.  
Le bouton de lien externe d’une carte, un résultat de [recherche rapide](../../guide/guides/quick-search.md#searching-the-diagram) choisi après `#`, `@` ou `:`, et l’ouverture de l’[explorateur](../../guide/guides/explorer.md#opening-and-closing) font tous quitter le mode Flux pour l’onglet ERD. Un défilement qu’y provoque le bouton de la carte ou un résultat de recherche rapide est également envoyé.

## Deux éditeurs sur une même page {#two-editors-on-one-page}

Ici, le raccordement de subscribe à dispatch tient lieu de réseau, si bien que vous voyez la forme d’une session sans qu’un transport vienne l’encombrer.

```js
const editor1 = document.createElement('erd-editor');
const editor2 = document.createElement('erd-editor');

const sharedStore1 = editor1.getSharedStore({
  getNickname: () => 'editor1',
});
const sharedStore2 = editor2.getSharedStore({
  getNickname: () => 'editor2',
});

sharedStore1.subscribe(actions => {
  sharedStore2.dispatch(actions);
});

sharedStore2.subscribe(actions => {
  sharedStore1.dispatch(actions);
});
```

Les deux éditeurs partent ici du même document, nouveau et vide, si bien qu’aucun des deux n’a besoin d’être initialisé.  
Avec trois éditeurs ou plus, envoyez les lots de chacun à tous les autres : un éditeur ne relaie jamais ce qu’il a reçu.

## Initialiser un collaborateur {#seeding-a-collaborator}

Un store partagé relaie les modifications au fur et à mesure et ne remet jamais à un nouvel arrivant le document dans son état actuel, si bien qu’un éditeur qui rejoint une session déjà en cours doit d’abord recevoir le document.  
Depuis la version `4.0.0`, initialisez-le avec [`runtimeValue`](../erd-editor-element.md#runtimevalue), lu sur un éditeur déjà présent dans la session, et non avec `value` ni avec le fichier enregistré.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

La valeur d’exécution conserve encore ce qui a été supprimé depuis l’ouverture du document, si bien que lorsqu’un autre éditeur annule plus tard une suppression, le nouvel arrivant restaure la table avec son nom et ses colonnes.  
[`value`](../erd-editor-element.md#value) est la forme que contient un fichier, sans les entités supprimées, si bien qu’un nouvel arrivant initialisé à partir de celle-ci, ou à partir du fichier, restaurerait à la place une table vide et sans nom.  
Continuez d’écrire `value` dans le stockage : `runtimeValue` sert uniquement à initialiser un autre éditeur, une seconde vue ou un [replicationStore](./remote-storage.md).  
Les éditeurs de VS Code, d’Obsidian, d’un IDE JetBrains et de l’application web initialisent ainsi une seconde vue d’un document ouvert.

`setInitialValue` n’est pas relayé, si bien qu’initialiser le nouvel arrivant ne change rien chez les autres.  
Depuis la version `4.0.0`, il efface aussi les registres de collaboration de l’éditeur, qui départagent les modifications concurrentes. Si le store partagé de l’éditeur a déjà eu un abonné, le store redemande les leurs aux autres éditeurs, comme lors de son premier [subscribe](#subscribe), si bien qu’un éditeur rechargé en cours de session départage les modifications comme le font les autres.  
Affecter `value` conserve les registres, mais contrairement à `setInitialValue`, cette affectation est relayée : dès que l’éditeur a un store partagé, tous les éditeurs de la session chargent le document affecté ; n’initialisez donc jamais un nouvel arrivant de cette façon.

## Combiner des versions {#mixing-releases}

Un éditeur n’applique que les types d’action que connaît sa propre version, si bien que, dans une session qui combine plusieurs versions, les éditeurs plus anciens manquent tout ce qui passe par un type plus récent.

Depuis la version `3.10.0`, une modification de l’[ON DELETE ou de l’ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) d’une relation passe par l’un de deux nouveaux types d’action, `relationship.changeOnDelete` et `relationship.changeOnUpdate`, et `relationship.add` peut porter les deux. Un relais qui fait suivre les actions telles quelles n’a besoin de rien de nouveau pour eux.  
Un éditeur antérieur à la version `3.10.0` ignore ces types d’action et ces champs : il n’a jamais connaissance de l’ON DELETE ni de l’ON UPDATE d’une relation, et un document enregistré depuis un tel éditeur n’a ni l’un ni l’autre. Une relation qu’ajoute un éditeur plus ancien arrive sans eux, si bien que les deux sont d’abord à `Not set`.

Toutes les autres modifications qu’envoie un éditeur en version `3.10.0` passent par des types d’action que les éditeurs plus anciens connaissent déjà.  
`Replace All`, dans [Rechercher et remplacer](../../guide/guides/find-and-replace.md#replacing), envoie ses modifications en un seul lot des mêmes actions de renommage, de commentaire et de mémo qu’envoie une modification manuelle. Les [options d’affichage](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` et `Referential Actions` passent par l’action existante `settings.changeShow`.

Depuis la version `4.0.0`, les modifications suivantes passent par de nouveaux types d’action, et un relais qui fait suivre les actions telles quelles n’a besoin de rien de nouveau pour elles :

- un [groupe de tables](../../guide/guides/table-groups.md) ajouté, déplacé, redimensionné, renommé, recoloré ou supprimé : `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` et `tableGroup.remove` ; une table qui rejoint ou quitte un groupe : `table.changeGroup` ;
- un `Save` dans la boîte de dialogue [Associer les colonnes](../../guide/guides/relationship-editing.md#map-columns) sur une relation existante, qui définit ses deux listes de colonnes à la fois : `relationship.changeColumns` ;
- un [verrou](../../guide/guides/settings.md#lock) activé ou désactivé : `settings.changeLockSettings` ;
- une modification du script `Before tables` ou `After tables` de l’onglet [Schéma SQL](../../guide/guides/schema-sql.md) : `settings.changeDDLScript`.

Les options d’affichage `Table Groups` et `Memos` passent par l’action existante `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, qu’envoyaient les interrupteurs `Save Scroll Information` et `Save Zoom Information` avant que les verrous ne les remplacent, n’est plus envoyée, et `settings.changeRelationshipOptimization` a disparu. Un éditeur en version `4.0.0` qui reçoit l’une ou l’autre ne change rien.

Un éditeur antérieur à la version `4.0.0` ignore les nouveaux types d’action : il ne voit jamais un groupe de tables ni les tables qu’il contient, bien que le glissement d’un groupe y déplace tout de même les tables du groupe, puisque ce glissement envoie aussi leur `table.move`.  
Il conserve les anciennes colonnes d’une relation après un `Save` dans Associer les colonnes, et lorsqu’une colonne de cette ancienne association y est supprimée, la relation disparaît sur tous les éditeurs. Il n’a ni verrous ni scripts.  
Un document enregistré depuis un tel éditeur n’a rien de tout cela, et un éditeur en version `4.0.0` l’ouvre avec tous les verrous activés.  
Gardez chaque éditeur d’une session, ainsi que tout [replicationStore](./remote-storage.md#dispatch-dispatchsync) qui stocke son document, en version `4.0.0` ou ultérieure.

Un éditeur en version `4.1.0` n’envoie aucun nouveau type d’action, si bien que des éditeurs et des répliques en `4.0.0` et en `4.1.0` partagent une session sans rien manquer.  
Sa fonction [Rechercher et remplacer](../../guide/guides/find-and-replace.md#replacing) recherche aussi dans les noms d’index et les noms de groupes de tables, et `Replace` et `Replace All` les renomment au moyen des actions `index.changeName` et `tableGroup.changeName` qu’un éditeur en version `4.0.0` applique déjà.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Définit le pseudonyme affiché à côté du curseur de la souris de cet utilisateur sur les autres éditeurs.  
Les autres utilisateurs voient `user` quand le pseudonyme est absent ou vide.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Diffuse le curseur de la souris de cet utilisateur aux autres éditeurs. La valeur par défaut est `true`.  
Les curseurs envoyés par les autres utilisateurs sont toujours affichés sur le canevas ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Diffuse ce sur quoi cet utilisateur travaille. La valeur par défaut est `true`.  
La table et la cellule sur lesquelles se trouve votre focus, les tables, mémos et groupes de tables que vous avez sélectionnés, et le rectangle de sélection que vous tracez sur le canevas sont envoyés aux autres éditeurs et y sont affichés.  
Chaque utilisateur reçoit sa propre couleur, pour que vous puissiez les distinguer : un contour sur la table qui a le focus, un soulignement sous la cellule active, un anneau autour des tables, mémos et groupes de tables sélectionnés, et un cadre en pointillés pour le rectangle de sélection.  
La présence qui arrive des autres utilisateurs est toujours affichée sur votre canevas, que cette option soit activée ou non.  
En mode Flux de l’onglet Visualisation, le focus et la sélection des autres utilisateurs sont affichés sur les cartes de tables, mais pas leurs rectangles de sélection. Les tables que vous y sélectionnez sont tout de même envoyées ; le rectangle de sélection que vous y tracez ne l’est pas.

```js
editor.getSharedStore({ focusTracker: false });
```

Désactivez les deux options de suivi pour utiliser le store partagé comme un simple relais qui ne publie aucune présence propre.  
La présence envoyée par les autres éditeurs est malgré tout reçue et affichée.  
C’est ce que font les éditeurs de VS Code, d’Obsidian, d’un IDE JetBrains et de Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

Le curseur, le focus, la sélection et le rectangle de sélection passent par le même flux que les modifications du document, mais ils sont éphémères.  
Ils n’entrent jamais dans le document, ni dans l’historique d’annulation, ni dans `editor.value`, si bien qu’un transport est libre de les abandonner et qu’un replicationStore les ignore.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Ces méthodes définissent l’état de connexion actuel.  
Tant que le store est déconnecté, les modifications sont mises en mémoire tampon en interne.  
Les modifications en mémoire tampon sont émises vers les abonnés dès que la transmission est de nouveau possible.  
L’état par défaut est connecté (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Applique à l’instance d’éditeur actuelle les modifications provenant d’autres instances d’éditeur.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

S’abonne aux modifications de l’éditeur.  
Rien ne quitte l’éditeur tant qu’il n’y a pas au moins un abonné, et les modifications faites avant cela sont mises en mémoire tampon.  
Le premier subscribe demande aussi aux autres éditeurs leurs registres de collaboration, qui départagent les modifications concurrentes, si bien qu’un éditeur arrivé en cours de session les départage de la même façon.  
Il n’apporte pas le document : [initialisez](#seeding-a-collaborator) donc d’abord un éditeur arrivé en cours de session.  
Depuis la version `4.0.0`, le store les redemande chaque fois que `setInitialValue` charge un document dans son éditeur après ce premier subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envoie immédiatement les lots de flux que ce store retient encore, au lieu de les envoyer après leur période d’inactivité.  
Depuis la version `3.9.2`, elle fonctionne sur un store obtenu par `getSharedStore` ; dans la version `3.9.1`, la méthode figure dans le type mais ne fait rien.  
Le déplacement d’une table, d’un mémo ou d’un groupe de tables, le changement de sa couleur, le redimensionnement d’un mémo, ainsi que le défilement ou le zoom de la vue arrivent chacun sous forme de flux de petites modifications. Ce n’est pas le cas du redimensionnement d’un groupe de tables : il est envoyé une seule fois, à la fin du glissement.  
Le store rassemble chaque flux en un seul lot et le retient jusqu’à ce que le flux soit inactif depuis 200 ms. Il procède en deux étapes, si bien que le lot part environ 400 ms après la dernière modification.  
Un appel met fin à cette attente dans les deux étapes. Tant que le store est connecté, un abonné reçoit le lot avant le retour de l’appel. Un appel alors que rien n’est retenu n’envoie rien.  
`destroy`, celui du store comme celui de l’éditeur, supprime un lot encore retenu : appelez donc d’abord cette méthode quand vous libérez un store et que les autres doivent conserver la dernière modification, comme lors de la fermeture d’un onglet.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Détruit complètement l’instance de sharedStore.  
L’éditeur lui-même n’est pas touché, si bien que quitter une session laisse le document modifiable.  
Le suivi de la souris et le suivi du focus s’arrêtent une fois détruit le dernier sharedStore fourni par l’éditeur.  
Un lot de flux que le store retient encore est supprimé avec lui ; appelez d’abord [flushStreamBuffers](#flushstreambuffers) pour l’envoyer.

```js
sharedStore.destroy();
```
