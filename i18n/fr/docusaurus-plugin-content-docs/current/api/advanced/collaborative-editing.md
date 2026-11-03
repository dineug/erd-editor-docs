---
sidebar_position: 1
description: Relayer les modifications de l’éditeur entre instances avec getSharedStore, initialiser à partir de runtimeValue et des registres du store un éditeur qui rejoint la session, départager les modifications faites au même moment, et afficher le curseur, le focus, la sélection et le rectangle de sélection de chaque collaborateur.
---

# Édition collaborative

`getSharedStore()` fait d’un éditeur un nœud d’une session collaborative.  
Elle émet chaque modification sous forme de flux d’actions et applique les actions que les autres éditeurs renvoient : c’est à vous de fournir le transport entre eux (WebSocket, WebRTC ou tout autre moyen capable de transporter du JSON).  
C’est l’une des méthodes d’[ErdEditorElement](../erd-editor-element.md), et elle se combine avec le [stockage distant](./remote-storage.md) lorsque les modifications relayées doivent aussi être stockées.  
Depuis la version `5.1.0`, pour partager un diagramme au moyen d’un document Yjs et de n’importe lequel de ses fournisseurs plutôt que de câbler vous-même le transport, liez l’éditeur avec `@dineug/erd-editor-yjs` ; voir [Yjs](./yjs.md).

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
  getLWW: () => SharedRegisters;
  mergeLWW: (lww: SharedRegisters, version: number) => void;
  getVersion: () => number;
  forgetPeer: (editorId: string) => void;
  reseed: (value: string, options: ReseedOptions) => void;
  destroy: () => void;
};

// a JSON object whose shape is the editor's own: hand it on as it is
type SharedRegisters = Record<string, unknown> & {
  readonly [registersBrand]: true;
};

type ReseedOptions = {
  lww: SharedRegisters;
  version: number;
  keepScreen?: boolean; // default false
};

// example
const sharedStore = editor.getSharedStore();
```

`@dineug/erd-editor` n’exporte nommément aucun de ces types. Le code TypeScript y accède par `ErdEditorElement`, comme dans `ReturnType<ErdEditorElement['getSharedStore']>`.

Une action est un simple objet sérialisable qui décrit une modification du document, si bien qu’elle passe intacte par `JSON.stringify` en route vers le transport.  
Les actions arrivent par lots : `subscribe` vous remet un tableau, et ce tableau forme une unité (relayez-le en entier et transmettez-le en entier de l’autre côté).  
Traitez une action comme opaque et faites-la suivre telle quelle plutôt que de la lire ou de la réécrire, car les données de suivi qu’elle porte, telles que sa [version](#concurrent-edits), sont ce qui maintient les éditeurs synchronisés.

Une partie de ce que fait un éditeur reste sur cet éditeur.  
Mettre une table, un mémo ou un groupe de tables au premier plan, comme le fait sa sélection, n’est pas envoyé.  
Les choix `Statements`, `Header`, `Write logical names into empty comments` (depuis la version `4.2.0`) et `Tables` de l’onglet [Schéma SQL](../../guide/guides/schema-sql.md), qui appartiennent à la fenêtre où ils sont faits, ne le sont pas non plus.  
Depuis la version `4.1.0`, l’[explorateur](../../guide/guides/explorer.md) reste lui aussi sur son éditeur : son ouverture ou sa fermeture, sa largeur, ses lignes réduites, la ligne où se trouve le focus clavier, la position de défilement de son arborescence, ainsi que sa recherche et ses options ne sont pas envoyés.  
Aller à une clé étrangère met en surbrillance le connecteur de sa relation, et cette [surbrillance](../../guide/guides/relationship-editing.md#reading-a-connector) n’est pas envoyée non plus.  
Depuis la version `4.2.0`, l’onglet [Dictionnaire](../../guide/guides/dictionary.md) reste lui aussi sur son éditeur : la feuille affichée, ainsi que la recherche, la sélection, le défilement et la largeur des colonnes de chaque feuille ne sont pas envoyés. Ses modifications, ses tris et ses importations CSV le sont.  
Un défilement, un zoom ou un changement d’onglet est envoyé, mais il ne modifie jamais la vue ni l’onglet d’un autre utilisateur. Cela vaut aussi pour le défilement que provoque un saut depuis l’explorateur, pour le passage à l’onglet ERD quand l’explorateur s’ouvre depuis un autre onglet, et pour le changement d’onglet et le défilement d’un saut depuis la feuille [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) de l’onglet Dictionnaire vers une table ou une colonne. Un saut depuis cette feuille vers un mot, un terme ou un domaine reste dans l’onglet Dictionnaire, si bien que rien n’en est envoyé.

Depuis la version `4.2.0`, un changement de l’[affichage des noms](../../guide/guides/logical-names.md#switching-the-view) est envoyé lui aussi, et son [verrou](../../guide/guides/settings.md#lock) décide de ce qu’en font les autres éditeurs. Le verrou `Name View` est activé dans un nouveau diagramme et dans tout document antérieur à la version `4.2.0`.  
Tant que le verrou est activé, le changement n’apparaît que sur l’éditeur qui l’a fait : il est tout de même envoyé, mais tous les autres éditeurs et toutes les répliques l’écartent, si bien que chaque utilisateur peut regarder une vue différente pendant que `value` conserve la vue verrouillée.  
Tant que le verrou est désactivé, un changement fait dans un éditeur qui peut modifier le document change l’affichage des noms sur tous les éditeurs et toutes les répliques, le dernier changement l’emportant, et chacun d’eux l’enregistre.  
Le changement propre à un éditeur en lecture seule reste toujours sur cet éditeur, et cet éditeur suit tout de même les changements partagés des autres.

Depuis la version `5.1.0`, un changement de langage du [générateur de code](../../guide/guides/code-generator.md), de casse des noms de tables, de casse des noms de colonnes ou de type de délimiteur suit de la même façon son propre verrou (`Language`, `Table Name Case`, `Column Name Case` ou `Bracket Type`), avec une différence : tant que le verrou est activé, le changement n’est pas envoyé du tout.  
Il n’apparaît que sur l’éditeur qui l’a fait, dont l’onglet Générateur de code et l’onglet Schéma SQL le suivent, et aucun autre éditeur ni aucune réplique ne le voit. `value` et `runtimeValue` conservent la valeur verrouillée, si bien qu’un nouvel arrivant initialisé à partir de n’importe quel éditeur ne le voit pas non plus, et que chaque utilisateur peut regarder un langage, une casse des noms ou un type de délimiteur différent tant que le verrou est activé.  
Tant que le verrou est désactivé, un changement fait dans un éditeur qui peut modifier le document est envoyé marqué comme partagé (`shared: true` dans sa charge utile). Il change le paramètre sur tous les éditeurs et toutes les répliques, le dernier changement l’emportant, et chacun d’eux l’enregistre. Un éditeur ou une réplique en version `5.1.0` applique un changement marqué quel que soit son propre verrou, si bien qu’un changement fait juste après un déverrouillage s’applique partout, même là où il arrive avant le déverrouillage.  
Avant la version `5.1.0`, un tel changement atteignait tous les éditeurs et toutes les répliques, que leur verrou soit activé ou non, tandis que le fichier conservait la valeur verrouillée.

Depuis la version `5.0.0`, un éditeur en [lecture seule](../erd-editor-element.md#readonly) n’envoie aucun changement. Le défilement, le zoom, l’onglet, l’affichage des noms, le SGBD, le langage du générateur de code, la casse des noms, le type de délimiteur et les lignes de `View Option` que modifie son lecteur restent sur son écran, quels que soient leurs verrous ; avant la version `5.0.0`, ses défilements, ses zooms, ses changements d’onglet, son SGBD et ses paramètres de code étaient envoyés comme ceux d’un éditeur modifiable.  
Son store envoie tout de même ce que ses suiveurs envoient du curseur, du focus, de la sélection et du cadre de glissement du lecteur, répond aux registres que demande un éditeur qui rejoint la session et applique tous les changements envoyés par les autres. Un changement de SGBD, un paramètre du générateur de code ou une ligne de `View Option` atteint son document, et son écran aussi sauf si son lecteur a modifié ce paramètre à cet endroit ; un changement partagé de l’affichage des noms s’affiche de toute façon sur son écran. Depuis la version `5.1.0`, il ne reçoit un paramètre du générateur de code que si ce paramètre a été changé avec son verrou désactivé ou si un déverrouillage le porte.  
Quand l’éditeur passe en lecture seule, il envoie d’abord ce que le store retient encore d’un glissement ou d’un défilement, comme le fait [flushStreamBuffers](#flushstreambuffers), si bien que les autres conservent la fin du geste.

Les [verrous](../../guide/guides/settings.md#lock) sont partagés : le dernier verrouillage ou déverrouillage d’un paramètre l’emporte sur tous les éditeurs, et un verrou porte les valeurs de l’éditeur qui a verrouillé le paramètre, si bien que chaque éditeur et chaque réplique enregistrent la même valeur.  
Un verrou `Viewport` enregistre donc la vue de l’éditeur qui a verrouillé ce paramètre, et un verrou `Canvas Type` le dernier onglet ouvert sur cet éditeur avant l’onglet Paramètres, où se fait le verrouillage.  
Déverrouiller `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ou, depuis la version `4.2.0`, `Name View` donne aussi à ce paramètre, sur tous les éditeurs, la valeur affichée sur l’éditeur qui l’a déverrouillé, y compris son propre changement fait sous le verrou, si bien qu’ils continuent d’enregistrer une seule et même valeur. Déverrouiller `Viewport` ou `Canvas Type` ne change ni la vue ni l’onglet de personne.

Une modification du script `Before tables` ou `After tables` est envoyée en entier quand son champ perd le focus. Les modifications des deux scripts sont départagées séparément, si bien que la modification de l’un par un collaborateur n’écrase jamais l’autre.

Rien de ce qui se fait dans le [mode Flux](../../guide/guides/visualization.md#flow-never-edits-the-document) de l’onglet Visualisation n’est une modification du document, si bien qu’un éditeur en mode Flux n’envoie aucune modification aux autres, et que les modifications qu’ils envoient continuent de s’appliquer tant qu’il y reste.  
Il y a deux exceptions. Quitter le mode Flux pour un autre onglet est un changement d’onglet, envoyé comme n’importe quel autre. Depuis la version `4.2.0`, un choix dans la liste d’affichage des noms de la barre d’outils du mode Flux est un changement de l’affichage des noms, envoyé et appliqué comme celui qui est fait sur le canevas.  
`Previous table`, `Next table` et les touches d’annulation et de rétablissement, qui [parcourent les vues](../../guide/guides/visualization.md#previous-table-and-next-table) en mode Flux, ne sont pas envoyés.  
Le bouton de lien externe d’une carte, un résultat de [recherche rapide](../../guide/guides/quick-search.md#searching-the-diagram) choisi après `#`, `@` ou `:`, et l’ouverture de l’[explorateur](../../guide/guides/explorer.md#opening-and-closing) font tous quitter le mode Flux pour l’onglet ERD. Un défilement qu’y provoque le bouton de la carte ou un résultat de recherche rapide est également envoyé.

## Deux éditeurs sur une même page {#two-editors-on-one-page}

Ici, le raccordement de subscribe à dispatch tient lieu de réseau, si bien que vous voyez la forme d’une session sans qu’un transport vienne l’encombrer.

```js
import '@dineug/erd-editor/erd-editor.js';

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
Une salle liée avec [`@dineug/erd-editor-yjs`](./yjs.md) détient elle-même le document dès qu’un client l’a [initialisée](./yjs.md#seeding-a-room), si bien que chaque éditeur qui y est lié ouvre ce document sans qu’aucun `runtimeValue` lui soit remis.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

La valeur d’exécution conserve encore ce qui a été supprimé depuis l’ouverture du document, si bien que lorsqu’un autre éditeur annule plus tard une suppression, le nouvel arrivant restaure la table avec son nom et ses colonnes.  
[`value`](../erd-editor-element.md#value) est la forme que contient un fichier, sans les entités supprimées, si bien qu’un nouvel arrivant initialisé à partir de celle-ci, ou à partir du fichier, restaurerait à la place une table vide et sans nom.  
Depuis la version `4.2.0`, il en va de même pour un mot, un terme ou un domaine supprimé d’une feuille de l’onglet [Dictionnaire](../../guide/guides/dictionary.md) : lorsqu’un autre éditeur annule la suppression, un nouvel arrivant initialisé à partir de `runtimeValue` affiche de nouveau la ligne complète, et celui qui a été initialisé à partir de `value` une ligne vide, que son propre `value` omet ensuite.  
Continuez d’écrire `value` dans le stockage : `runtimeValue` sert uniquement à initialiser un autre éditeur, une seconde vue ou un [replicationStore](./remote-storage.md).  
Les éditeurs de VS Code, d’Obsidian, d’un IDE JetBrains et de l’application web initialisent ainsi une seconde vue d’un document ouvert.

`setInitialValue` n’est pas relayé, si bien qu’initialiser le nouvel arrivant ne change rien chez les autres.  
Depuis la version `4.0.0`, il efface aussi les registres de collaboration de l’éditeur, qui départagent les [modifications concurrentes](#concurrent-edits). Si le store partagé de l’éditeur a déjà eu un abonné, le store redemande les leurs aux autres éditeurs, comme lors de son premier [subscribe](#subscribe), si bien qu’un éditeur rechargé en cours de session départage les modifications comme le font les autres.  
Affecter `value` conserve les registres, mais contrairement à `setInitialValue`, cette affectation est relayée : dès que l’éditeur a un store partagé, tous les éditeurs de la session chargent le document affecté ; n’initialisez donc jamais un nouvel arrivant de cette façon.

Ni `value` ni `runtimeValue` ne contiennent les registres ni la version qu’a atteinte l’horloge de l’éditeur, si bien qu’un nouvel arrivant initialisé à partir de `runtimeValue` seul les prend dans la réponse que les éditeurs de la session envoient à son premier subscribe.  
Tant que cette réponse n’est pas arrivée, une modification du nouvel arrivant peut porter une version inférieure à celle des autres, si bien qu’ils la refusent alors qu’elle reste sur le nouvel arrivant, et qu’une écriture plus ancienne encore en route l’emporte sur la plus récente que contient l’initialisation. Lorsqu’aucun éditeur en cours d’exécution ne répond, par exemple quand un serveur ou un stockage de documents conserve le document de la session, le nouvel arrivant ne les reçoit jamais.  
Depuis la version `5.1.0`, remettez-les avec la valeur. Sur un éditeur de la session, appelez [`flushStreamBuffers()`](#flushstreambuffers), pour que le glissement ou le changement de couleur qu’il retient encore parte d’abord, puis lisez au même moment `runtimeValue` ainsi que [`getLWW()`](#getlww) et [`getVersion()`](#getversion) de son store. Le nouvel arrivant charge la valeur avec `setInitialValue`, puis prend le reste avec le [`mergeLWW`](#mergelww) de son propre store, dans cet ordre, puisque chaque `setInitialValue` efface les registres. Sa modification suivante porte alors une version supérieure à toutes celles que contient l’initialisation, si bien qu’elle s’impose sans réponse à attendre. Sur un store qui existe déjà, [`reseed`](#reseed) fait les deux en un seul appel.

```js
// on an editor already in the session
sharedStore1.flushStreamBuffers();
const seed = {
  value: editor1.runtimeValue,
  lww: sharedStore1.getLWW(),
  version: sharedStore1.getVersion(),
};

// on the joiner
editor2.setInitialValue(seed.value);
const sharedStore2 = editor2.getSharedStore();
sharedStore2.mergeLWW(seed.lww, seed.version);
```

Une initialisation conservée ainsi pour ouvrir les nouveaux arrivants suivants contient les trois ensemble. Ce n’est pas un fichier : `value` reste ce qu’il faut écrire dans le stockage.  
Un [replicationStore](./remote-storage.md#runtimevalue-getter) ne remet aucun registre, si bien qu’un nouvel arrivant initialisé à partir de son `runtimeValue` les prend encore dans la réponse des éditeurs.

## Modifications concurrentes {#concurrent-edits}

Chaque éditeur et chaque réplique conserve, pour chaque nom et presque tous les autres champs, la version de l’écriture qui l’a défini : ce sont ses registres de collaboration. Une écriture ne s’impose que si sa version n’est pas inférieure à celle qui est détenue, si bien que des éditeurs qui entendent les mêmes modifications dans des ordres différents aboutissent au même document.  
Depuis la version `5.1.0`, chaque version porte, sous son compteur, un emplacement propre à l’éditeur qui écrit, tiré de son identifiant. Les versions croissent donc par pas de 4 194 304 et dépassent un entier de 32 bits dès que le compteur atteint 512. `JSON.stringify` et `JSON.parse` les transportent intactes, mais un relais ou un stockage qui les analyse dans un autre langage doit les conserver en nombres de 64 bits, jamais en entiers de 32 bits.

Depuis la version `5.1.0`, deux éditeurs qui changent au même moment un même nom ou un même champ, hors les exceptions ci-dessous, aboutissent à la même valeur sur chaque éditeur et chaque réplique : écrivant au même compteur, ils estampillent deux versions différentes, et la plus grande l’emporte partout. Avant la version `5.1.0`, les deux pouvaient estampiller une même version, et chaque éditeur conservait l’écriture entendue en dernier, si bien qu’ils pouvaient finir différents. Deux éditeurs partagent un emplacement avec une probabilité de 1 sur 4 194 304 par paire, et sont alors à égalité comme auparavant.

Depuis la version `5.1.0`, la position d’une table, la position et la taille d’un mémo ou d’un groupe de tables, ainsi que l’origine et le niveau de zoom de la vue reçoivent une version de la même façon, et ce qui les déplace est envoyé sous la forme du point d’arrivée :

- un glissement sous la forme d’un `table.moveTo`, `memo.moveTo` ou `tableGroup.moveTo` par entité déplacée, dans un même lot, si bien que le glissement d’un groupe porte les points de ses tables avec celui du groupe ;
- l’annulation ou le rétablissement d’un glissement sous la forme du point où il remet chaque entité ;
- un déplacement de la vue sous la forme de `settings.scrollTo`, et un zoom sous la forme de `settings.changeZoomLevel` ;
- le redimensionnement d’un mémo ou d’un groupe de tables sous la forme de sa position et de sa taille ensemble.

Ainsi, deux utilisateurs qui déplacent, ou déplacent et redimensionnent, une même table, un même mémo ou un même groupe de tables au même moment le retrouvent au même point et à la même taille sur chaque éditeur et chaque réplique. Le point revient à l’écriture dont la version est la plus grande, les deux axes ensemble. Un déplacement n’écrit aucune taille, si bien qu’un redimensionnement conserve sa taille même lorsqu’un déplacement fait au même moment prend le point.  
Avant la version `5.1.0`, un glissement partait sous la forme de la distance parcourue, si bien que deux glissements d’une même table s’additionnaient, et qu’un déplacement et un redimensionnement d’un même mémo ou groupe de tables faits au même moment pouvaient finir différents.  
Un glissement de moins de 20 px, qui ne laisse aucune entrée d’annulation, est envoyé comme les autres, si bien que, comme point, il peut l’emporter sur un glissement de la même entité fait au même moment par un autre utilisateur. Un lot de glissement, de déplacement de la vue ou de zoom qu’un transport livre deux fois ne déplace rien deux fois.

Un changement de couleur fait exception. Il part sans version, et chaque éditeur et chaque réplique l’estampille de la sienne et conserve la couleur entendue en dernier, si bien que deux utilisateurs qui recolorent au même moment une même table, un même mémo ou un même groupe de tables peuvent finir avec des couleurs différentes.  
Quelques changements ne conservent aucune version, si bien que chaque éditeur et chaque réplique les applique dans l’ordre où il les entend, et que deux changements faits au même moment peuvent aussi finir différents : une colonne déplacée dans sa table ou son index (`column.move`, `indexColumn.move`), et un changement de [SGBD](../../guide/guides/table-related-functions.md#databases), d’une ligne de [`View Option`](../../guide/guides/table-related-functions.md#table-view-options), ou de `Relationship DataType Sync`, `Maximum comment width` ou `Column Order` de l’onglet [Paramètres](../../guide/guides/settings.md).  
Les entités que deux utilisateurs ajoutent au même moment, comme deux tables ou deux colonnes d’une même table, peuvent aussi se retrouver dans un ordre différent sur chaque éditeur et chaque réplique, et le `value` de chacun enregistre son propre ordre.

Tout cela vaut entre éditeurs et répliques en version `5.1.0` ou ultérieure ; [Combiner des versions](#mixing-releases) dit ce que change une version plus ancienne.

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

Un éditeur antérieur à la version `4.0.0` ignore les nouveaux types d’action : il ne voit jamais un groupe de tables ni les tables qu’il contient, bien que le glissement d’un groupe y déplace tout de même les tables du groupe, puisque ce glissement envoie aussi un déplacement de chacune de ces tables.  
Il conserve les anciennes colonnes d’une relation après un `Save` dans Associer les colonnes, et lorsqu’une colonne de cette ancienne association y est supprimée, la relation disparaît sur tous les éditeurs. Il n’a ni verrous ni scripts.  
Un document enregistré depuis un tel éditeur n’a rien de tout cela, et un éditeur en version `4.0.0` l’ouvre avec tous les verrous activés.  
Gardez chaque éditeur d’une session, ainsi que tout [replicationStore](./remote-storage.md#dispatch-dispatchsync) qui stocke son document, en version `4.0.0` ou ultérieure.

Un éditeur en version `4.1.0` n’envoie aucun nouveau type d’action, si bien que des éditeurs et des répliques en `4.0.0` et en `4.1.0` partagent une session sans rien manquer.  
Sa fonction [Rechercher et remplacer](../../guide/guides/find-and-replace.md#replacing) recherche aussi dans les noms d’index et les noms de groupes de tables, et `Replace` et `Replace All` les renomment au moyen des actions `index.changeName` et `tableGroup.changeName` qu’un éditeur en version `4.0.0` applique déjà.

Depuis la version `4.2.0`, les modifications suivantes passent par de nouveaux types d’action, et un relais qui fait suivre les actions telles quelles n’a besoin de rien de nouveau pour elles :

- le [nom logique](../../guide/guides/logical-names.md) d’une table ou d’une colonne : `table.changeLogicalName` et `column.changeLogicalName` ; le fait que son nom ait été [dérivé des dictionnaires](../../guide/guides/dictionary.md#deriving-physical-names) : `table.changeNameDerived` et `column.changeNameDerived` ;
- une colonne liée à un [domaine](../../guide/guides/dictionary.md#domains-and-data-types) ou déliée : `column.changeDomain` ;
- un mot, un terme ou un domaine ajouté, modifié (y compris sa place dans la feuille, telle qu’un tri la fixe) ou supprimé dans l’onglet [Dictionnaire](../../guide/guides/dictionary.md) : `dictionary.add`, `dictionary.update` et `dictionary.remove` ;
- un changement de l’[affichage des noms](../../guide/guides/logical-names.md#switching-the-view) : `settings.changeNameViewMode`.

Le verrou `Name View` passe par l’action existante `settings.changeLockSettings`, l’option d’affichage `Domain` par `settings.changeShow`, et un déplacement de `Logical Name` ou de `Domain` dans l’[ordre des colonnes](../../guide/guides/settings.md#adjusting-column-order) par `settings.changeColumnOrder`.  
Les `editor.clear` et `editor.loadJson` d’une importation Schéma SQL, GraphQL, DBML ou AML depuis `Import` portent `keepDictionaries: true`, qui conserve les mots, les termes et les domaines sur tous les éditeurs. Il en va de même de ceux d’un [setSchemaSQL](../erd-editor-element.md#setschemasql), d’un `setSchemaGraphQL`, d’un `setSchemaDBML` ou d’un `setSchemaAML` qui remplace le document.  
Un nom physique que dérivent les dictionnaires passe par `table.changeName` ou `column.changeName`, et le type de données qu’un domaine donne à ses colonnes par `column.changeDataType`, les actions qu’envoie une modification manuelle.

Un éditeur antérieur à la version `4.2.0` ignore les nouveaux types d’action : il n’a ni noms logiques, ni liens de domaine, ni dictionnaires, ni affichage des noms. Un verrouillage ou un déverrouillage de `Name View` n’y change rien, pas plus qu’un déplacement de `Logical Name` ou de `Domain` dans l’ordre des colonnes, ou un déplacement sur l’un d’eux. Un verrou `Canvas Type` activé par un éditeur venu à l’onglet Paramètres depuis l’onglet Dictionnaire n’y change rien non plus : l’éditeur plus ancien ne connaît pas cet onglet, si bien qu’il laisse `Canvas Type` déverrouillé. Il affiche tout de même les noms physiques que dérivent les dictionnaires et les types de données que donnent les domaines.  
Ses propres modifications ignorent tout des noms logiques, des domaines et des dictionnaires, avec les effets suivants sur les éditeurs plus récents :

- Une table ou une colonne qu’il renomme à la main garde son nom marqué comme dérivé, si bien qu’un nom logique écrit plus tard pour elle sur un éditeur plus récent peut dériver de nouveau le nom par-dessus celui qu’il a saisi.
- Un type de données qu’il donne à une colonne liée à un domaine laisse le lien en place, si bien que la feuille `Checks` liste `Domain type mismatch` et que le prochain changement de type du domaine redonne à la colonne le type du domaine.
- Les colonnes de clé étrangère d’une relation qu’il ajoute ne reçoivent de leur clé ni nom logique ni domaine.
- Une table qu’il colle ou duplique arrive sans noms logiques ni liens de domaine.
- Une importation Schéma SQL, GraphQL, DBML ou AML sur cet éditeur n’envoie pas de `keepDictionaries`, si bien qu’elle vide les mots, les termes et les domaines sur tous les éditeurs.
- Son annulation d’un chargement, d’une importation ou de `clear()` charge sa propre copie du document sur tous les éditeurs, et cette copie n’a ni noms logiques, ni liens de domaine, ni dictionnaires.
- Cette copie, ainsi que le document que charge une importation Schéma SQL, GraphQL, DBML ou AML sur cet éditeur, remettent aussi le verrou `Name View` de tous les éditeurs dans l’état où cet éditeur l’a trouvé. Tous les éditeurs enregistrent alors `Physical Names` comme affichage des noms, et l’affichent aussi si le verrou est désactivé.

Un document enregistré depuis un tel éditeur n’a ni noms logiques, ni liens de domaine, ni dictionnaires, ni affichage des noms, si bien qu’un éditeur en version `4.2.0` l’ouvre dans la vue `Physical Names`. L’éditeur plus ancien enregistre bien le verrou `Name View` tel qu’il l’a trouvé, si bien qu’un document déverrouillé dans un éditeur en version `4.2.0` reste déverrouillé.  
Gardez chaque éditeur d’une session, ainsi que tout [replicationStore](./remote-storage.md#dispatch-dispatchsync) qui stocke son document, en version `4.2.0` ou ultérieure.

Un éditeur en version `5.1.0` n’envoie aucun nouveau type d’action, si bien que des éditeurs et des répliques antérieurs à la version `5.1.0` partagent encore une session avec lui, et qu’un relais qui fait suivre les actions telles quelles n’a besoin de rien de nouveau. Ce que décrit [Modifications concurrentes](#concurrent-edits) ne vaut pourtant qu’entre éditeurs et répliques en version `5.1.0` :

- Les glissements d’un éditeur en `5.1.0` voyagent sous forme de points dans `table.moveTo`, `memo.moveTo` et `tableGroup.moveTo`, que les éditeurs plus anciens appliquent déjà, et ses déplacements de la vue et ses zooms sous forme de points dans `settings.scrollTo` et `settings.changeZoomLevel` qui, comme tout déplacement de la vue et tout zoom, ne sont appliqués par aucun autre éditeur et ne sont pris que par les répliques. Un éditeur plus ancien applique chaque point d’un glissement dans l’ordre où il arrive, hors de tout registre, et une réplique plus ancienne fait de même avec chaque point d’un glissement, d’un déplacement de la vue ou d’un zoom, si bien que deux points envoyés en même temps pour une même entité, ou pour la vue, peuvent y finir différents.
- Le glissement d’un éditeur plus ancien voyage toujours sous forme de distance parcourue, que chaque éditeur et chaque réplique additionnent hors de leurs registres, et son déplacement de la vue ou son zoom sous forme de distance aussi, que chaque réplique additionne de la même façon. Une distance et un point sur une même entité, faits au même moment, peuvent finir différents sur des éditeurs et des répliques qui les entendent dans des ordres différents, et une distance qu’un transport livre deux fois est additionnée deux fois.
- Hors les exceptions que nomme [Modifications concurrentes](#concurrent-edits), l’écriture d’un nom ou d’un champ par un éditeur en `5.1.0`, faite au même moment que celle d’un éditeur plus ancien, l’emporte presque toujours, avec la même réponse sur chaque éditeur et chaque réplique. Deux éditeurs plus anciens peuvent encore finir différents sur un même champ écrit en même temps.
- Un éditeur en `5.1.0` n’envoie un changement de langage, de casse des noms ou de type de délimiteur du générateur de code que tant que son verrou est désactivé, avec la marque `shared: true`, qu’un éditeur plus ancien ignore, appliquant le changement comme auparavant. Un éditeur plus ancien envoie toujours celui qu’il fait sous le verrou, sans marque : un éditeur ou une réplique en `5.1.0` l’écarte tant que ce paramètre y est verrouillé, et les éditeurs plus anciens l’appliquent. Sous un verrou, les éditeurs plus anciens suivent donc les choix des uns et des autres tandis que les éditeurs en `5.1.0` gardent les leurs, et le fichier conserve dans les deux cas la valeur verrouillée. Un déverrouillage fait dans l’une ou l’autre version porte la valeur de celui qui déverrouille à chaque éditeur et chaque réplique.
- Un chargement qui remplace le document, comme un `value` affecté, `clear()` ou une importation qui remplace, termine le tracé d’une relation sur chaque éditeur en `5.1.0`, celui qui l’a fait et chacun de ceux qui le reçoivent. Un éditeur plus ancien garde son tracé actif pendant ce chargement.

Gardez chaque éditeur d’une session, ainsi que tout [replicationStore](./remote-storage.md#dispatch-dispatchsync) qui stocke son document, en version `5.1.0` ou ultérieure, afin que les modifications faites au même moment aboutissent au même résultat partout, hors les exceptions que nomme [Modifications concurrentes](#concurrent-edits) ; la version `4.2.0` ou ultérieure reste ce qui conserve les noms logiques et les dictionnaires. Un [serveur MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) antérieur à la version `1.2.0` compte ici comme un éditeur antérieur à la version `5.1.0`, et un éditeur antérieur à la version `5.1.0` ne peut pas du tout être lié à une salle [Yjs](./yjs.md).

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
Depuis la version `4.2.0`, les utilisateurs peuvent regarder chacun une vue différente de l’[affichage des noms](../../guide/guides/logical-names.md#collaborators) tant que son verrou est activé, ou après le changement propre à un éditeur en lecture seule. Une cellule active que votre vue n’affiche pas est soulignée sur la cellule que la vue affiche à sa place : le nom et le nom logique se remplacent l’un l’autre, comme le type de données et le domaine.  
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
Lorsqu’un lot contient la demande de registres d’un autre éditeur, comme celle qu’envoie le premier [subscribe](#subscribe) d’un nouvel arrivant, le store répond par l’intermédiaire de ses abonnés avec ses registres et sa version, sauf s’il ne détient aucun registre.  
Depuis la version `5.1.0`, il envoie d’abord chaque lot de flux qu’il retient encore, comme le fait [flushStreamBuffers](#flushstreambuffers), si bien que chaque version que porte sa réponse repose sur une écriture déjà envoyée aux autres. L’arrivée d’un nouvel éditeur fait donc envoyer en même temps, par chaque éditeur de la session, un glissement, un déplacement de la vue, un zoom, un changement de couleur ou un redimensionnement de mémo qu’il retient encore.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

S’abonne aux modifications de l’éditeur.  
Rien ne quitte l’éditeur tant qu’il n’y a pas au moins un abonné, et les modifications faites avant cela sont mises en mémoire tampon.  
Le premier subscribe demande aussi aux autres éditeurs leurs registres de collaboration, qui départagent les [modifications concurrentes](#concurrent-edits), si bien qu’un éditeur arrivé en cours de session les départage de la même façon.  
Il n’apporte pas le document : [initialisez](#seeding-a-collaborator) donc d’abord un éditeur arrivé en cours de session ; depuis la version `5.1.0`, l’initialisation peut aussi porter les registres.  
Depuis la version `4.0.0`, le store les redemande chaque fois que `setInitialValue`, ou depuis la version `5.1.0` [reseed](#reseed), charge un document dans son éditeur après ce premier subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envoie immédiatement les lots de flux que ce store retient encore, au lieu de les envoyer après leur période d’inactivité.  
Depuis la version `3.9.2`, elle fonctionne sur un store obtenu par `getSharedStore` ; dans la version `3.9.1`, la méthode figure dans le type mais ne fait rien.  
Le déplacement d’une table, d’un mémo ou d’un groupe de tables, le changement de sa couleur, le redimensionnement d’un mémo, ainsi que le défilement ou le zoom de la vue se font chacun sous forme de flux de petites modifications. Le redimensionnement d’un groupe de tables ne se fait pas ainsi : il est envoyé une seule fois, à la fin du glissement.  
Le store rassemble chaque flux en un seul lot et le retient jusqu’à ce que le flux soit inactif depuis 200 ms, en deux étapes. Un changement de couleur ou un redimensionnement de mémo franchit les deux, si bien qu’il part environ 400 ms après la dernière modification, comme tous les flux avant la version `5.1.0`. Depuis la version `5.1.0`, un glissement, un déplacement de la vue ou un zoom part après la première étape, environ 200 ms après son dernier mouvement, sous la forme du point d’arrivée (voir [Modifications concurrentes](#concurrent-edits)).  
Un appel met fin à cette attente dans les deux étapes. Tant que le store est connecté, un abonné reçoit le lot avant le retour de l’appel. Un appel alors que rien n’est retenu n’envoie rien.  
`destroy`, celui du store comme celui de l’éditeur, supprime un lot encore retenu : appelez donc d’abord cette méthode quand vous libérez un store et que les autres doivent conserver la dernière modification, comme lors de la fermeture d’un onglet.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

Depuis la version `5.1.0`, renvoie une copie des registres de collaboration de l’éditeur (voir [Modifications concurrentes](#concurrent-edits)).  
La copie est faite par JSON, si bien que c’est un objet simple prêt pour `JSON.stringify`, et qu’une modification de la copie laisse les registres du store tels qu’ils étaient.  
Remettez-la telle quelle au [mergeLWW](#mergelww) ou à [reseed](#reseed) d’un autre store. Sa forme est propre à l’éditeur, donc n’en lisez aucun champ.  
Lisez-la avec [getVersion](#getversion) et le `runtimeValue` de l’éditeur au même moment pour [initialiser un nouvel arrivant](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

Depuis la version `5.1.0`, prend dans les registres de ce store ceux qu’un autre store a remis avec [getLWW](#getlww), en gardant la plus grande version de chacun, et prend `version` dans l’horloge de l’éditeur, qui garde la plus grande entre la sienne et celle qui est donnée.  
Elle ne change rien au document : aucun octet de `value` ou de `runtimeValue`, aucune entrée d’annulation, aucun événement `change`. Elle ne fait que relever les versions qu’une écriture ultérieure doit dépasser, si bien qu’une écriture plus ancienne que les registres donnés est ensuite refusée, et que la modification suivante de l’éditeur porte une version supérieure à `version`.  
Elle n’envoie rien et ne répond à rien. C’est ce que le premier subscribe d’un nouvel arrivant obtient de la réponse des autres, pris directement.  
Appelez-la après `setInitialValue`, jamais avant : chaque `setInitialValue` et chaque [reseed](#reseed) efface les registres détenus, et avec eux ce qu’un `mergeLWW` placé avant avait pris.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

Depuis la version `5.1.0`, renvoie la plus haute version que l’horloge de l’éditeur a fusionnée : la plus grande des versions des modifications qu’il a faites ou reçues, des demandes de registres et des réponses qu’échange une arrivée, et de chaque `version` donnée à `mergeLWW` ou à `reseed`.  
Les curseurs, le focus, les sélections et les rectangles de sélection, les siens ou ceux d’un autre éditeur, ne la font pas bouger.  
Remettez-la avec [getLWW()](#getlww), lu au même moment, au [mergeLWW](#mergelww) ou à [reseed](#reseed) d’un nouvel arrivant. C’est une [version](#concurrent-edits) comme celles que portent ses actions.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

Depuis la version `5.1.0`, supprime aussitôt le curseur, le focus, la sélection et le rectangle de sélection qu’a envoyés l’éditeur dont l’identifiant est donné, ainsi que l’expiration que chacun attendait. Ceux de tous les autres éditeurs restent.  
L’identifiant est le `meta.editorId` que porte chaque action qu’envoie le store partagé de cet éditeur. Un identifiant dont cet éditeur ne détient rien ne change rien.  
Appelez-la quand votre transport apprend qu’un pair est parti. Sinon, ce que le pair a envoyé reste affiché jusqu’à son expiration : son curseur 30 secondes après le dernier reçu, son focus et sa sélection 90 secondes après, et son rectangle de sélection 3 secondes après.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

Depuis la version `5.1.0`, ouvre de nouveau dans l’éditeur le document d’une session, comme le fait une nouvelle arrivée. La liaison [Yjs](./yjs.md) l’appelle pour ouvrir le document d’une salle quand elle se lie à une salle qui a été initialisée, puis à chaque nouvelle arrivée, en conservant l’écran une fois la salle rejointe.  
Elle charge `value` comme le fait [setInitialValue](../erd-editor-element.md#setinitialvalue) et prend `lww` et `version` comme le fait [mergeLWW](#mergelww), si bien que le store détient ensuite exactement les registres donnés, et son horloge la plus grande entre sa propre version et `version`. Elle vide aussi l’historique d’annulation et, contrairement à `setInitialValue`, efface la sélection et le focus, puisqu’ils peuvent désigner ce que la valeur ne contient plus.  
Hormis la dérivation de nom logique ci-dessous, elle ne crée aucune entrée d’annulation, n’émet aucun événement `change` et n’envoie aucune modification. Une fois que le store a eu un abonné, elle envoie la demande de registres que fait tout chargement de ce genre, qu’un transport ayant déjà remis les registres peut abandonner, et, si le [focusTracker](#focustracker) est activé, la sélection et le focus effacés.  
Comme `setInitialValue`, elle fonctionne alors que [readonly](../erd-editor-element.md#readonly) est défini, abandonne une vue Flux, termine le tracé d’une relation et ferme les éditeurs du mémo, du nom de groupe de tables et de la cellule, en conservant ou en abandonnant de la même façon ce qui y était saisi ; un nom que dérive une cellule de nom logique qui se ferme, à partir de ce que son lecteur a saisi, est une modification ordinaire : envoyée, annulable et émise comme événement `change`.

Sans `keepScreen`, l’écran affiche ce que contient la valeur, comme après `setInitialValue`. Avec `keepScreen: true`, l’écran du lecteur est remis par-dessus le document chargé, sur cet écran seulement :

- la position de défilement et le niveau de zoom, une fois que l’élément les a affichés ; une position ou un niveau jamais affiché, ou chargé pendant que l’élément était masqué et pas affiché depuis, s’ouvre là où la valeur le place, comme chez un nouvel arrivant tardif ;
- l’onglet, quand le chargement l’a déplacé, et, sur l’onglet Paramètres, aussi l’onglet d’où venait le lecteur, que nomme un verrou `Canvas Type` posé là ;
- l’affichage des noms et chaque paramètre du générateur de code que le lecteur affichait de son propre chef sous son verrou, mais seulement lorsque ce verrou était activé avant le chargement, l’est encore après, et porte la même valeur verrouillée. Ainsi, quand un pair a déverrouillé, changé puis reverrouillé un paramètre à une autre valeur entre-temps, l’éditeur s’ouvre sur la nouvelle valeur verrouillée, et là où le verrou est désactivé avant ou après le chargement, il affiche la valeur chargée ;
- chaque paramètre qu’un lecteur en lecture seule a modifié sur son propre écran, quels que soient les verrous.

Rien de tout cela n’est envoyé, et `value` et `runtimeValue` rendent toujours compte du document chargé. Un déverrouillage ultérieur d’un pair remplace un paramètre de code conservé ainsi, comme le fait tout déverrouillage.  
Le prochain défilement ou zoom du lecteur, fait alors que l’éditeur peut modifier le document, fait de nouveau de la position de défilement et du niveau de zoom conservés ceux du document, et part précédé de l’endroit où se trouve l’écran, si bien que les répliques prennent aussi ce zoom.

Une réinitialisation laisse tel quel ce que le store retient. Un glissement, un déplacement de la vue ou un zoom encore retenu part après elle, lu sur le document réinitialisé ; un changement de couleur ou un redimensionnement de mémo part tel qu’il a été fait, bien que l’éditeur ne l’affiche plus ; et ce que `disconnect()` retenait part à `connection()`.  
Appelez donc d’abord [flushStreamBuffers](#flushstreambuffers), envoyez ce qu’elle émet, puis réinitialisez avec une valeur qui le contient. Ne réinitialisez jamais pendant que le store est déconnecté.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Détruit complètement l’instance de sharedStore.  
L’éditeur lui-même n’est pas touché, si bien que quitter une session laisse le document modifiable.  
Le suivi de la souris et le suivi du focus s’arrêtent une fois détruit le dernier sharedStore fourni par l’éditeur.  
Un lot de flux que le store retient encore est supprimé avec lui ; appelez d’abord [flushStreamBuffers](#flushstreambuffers) pour l’envoyer.  
Les curseurs, les focus, les sélections et les rectangles de sélection qu’ont envoyés d’autres éditeurs restent affichés jusqu’à leur expiration ; depuis la version `5.1.0`, [forgetPeer](#forgetpeer) supprime aussitôt ceux d’un éditeur.

```js
sharedStore.destroy();
```
