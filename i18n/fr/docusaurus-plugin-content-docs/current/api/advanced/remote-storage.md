---
sidebar_position: 2
description: Répliquer un éditeur en cours d’exécution dans un store sans interface hors du thread principal, et sérialiser le document pour le stockage.
---

# Stockage distant

Envoyer tout l’état de l’éditeur à chaque modification est inefficace.  
Pour ce cas de figure, l’éditeur fournit une API de réplication des données en temps réel.

## Installation {#installation}

```sh
npm install @dineug/erd-editor
```

Le store de réplication se trouve dans le sous-chemin `@dineug/erd-editor/engine.js`, et non à la racine du paquet.  
Ce point d’entrée ne touche à aucun DOM, il s’exécute donc dans un Web Worker ou n’importe où ailleurs hors du thread principal.  
Importer plutôt la racine du paquet a besoin d’un document : depuis la version `5.0.0`, elle ne définit aucun élément, mais son évaluation construit les deux classes d’éléments. Avant la version `5.0.0`, elle enregistrait l’élément personnalisé `<erd-editor>`.

## Utilisation {#usage}

```ts
type ReplicationStore = {
  readonly value: string;
  readonly runtimeValue: string;
  on: (
    listeners: Partial<{ change: (change: ReplicationChange) => void }>
  ) => Unsubscribe;
  setInitialValue: (value: string) => void;
  dispatch: (actions: Array<AnyAction> | AnyAction) => void;
  dispatchSync: (actions: Array<AnyAction> | AnyAction) => void;
  destroy: () => void;
};

type ReplicationChange = {
  value: string;
  changed: boolean;
};

type InjectEngineContext = {
  toWidth: (text: string) => number;
};

type CreateReplicationStore = (
  context: InjectEngineContext
) => ReplicationStore;

// example
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({
  toWidth: text => text.length * 10,
});
```

## Répliquer un éditeur en cours d’exécution {#replicating-a-live-editor}

Les actions proviennent du store partagé d’un éditeur en cours d’exécution.  
Voir [Édition collaborative](./collaborative-editing.md).

```js
import { createReplicationStore } from '@dineug/erd-editor/engine.js';

const replicationStore = createReplicationStore({ toWidth });
replicationStore.setInitialValue(editor.runtimeValue);

replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) save(value);
  },
});

const sharedStore = editor.getSharedStore();
sharedStore.subscribe(actions => {
  replicationStore.dispatch(actions);
});
```

Seule la modification franchit la frontière, jamais le document entier.  
La réplique l’applique et sérialise le résultat de son côté.  
`change` vous transmet ce résultat dans `value`, et `changed` vous indique quand il vaut la peine de l’écrire.

Depuis la version `4.0.0`, initialisez la réplique à partir du `runtimeValue` de l’éditeur, comme ci-dessus, plutôt qu’à partir du fichier stocké ou du `value` de l’éditeur.  
Le fichier ne contient pas les modifications faites depuis son enregistrement, et `value` ne contient pas les entités supprimées pendant la session.  
Une réplique initialisée sans une table supprimée la fait revenir sans son nom ni ses colonnes quand un éditeur annule la suppression, et l’enregistre ainsi.  
Depuis la version `4.2.0`, il en va de même pour un mot, un terme ou un domaine supprimé d’une feuille de l’onglet [Dictionnaire](../../guide/guides/dictionary.md).  
Quand un éditeur annule la suppression, une réplique initialisée sans la ligne la fait réapparaître vide, et comme `value` omet une ligne vide, la réplique enregistre le document sans elle.  
Pour un domaine, les colonnes et les termes qui y étaient liés restent aussi déliés dans cette réplique, puisqu’elle n’a jamais détenu les liens et que l’annulation ne les envoie pas.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mesure une chaîne en pixels.  
Le store n’a pas de DOM, il ne peut donc pas mesurer le texte lui-même, et il recalcule la largeur des colonnes à l’aide de cette fonction chaque fois qu’un nom, un type de données, une valeur par défaut ou un commentaire change.  
Depuis la version `4.2.0`, cela inclut le [nom logique](../../guide/guides/logical-names.md) d’une table ou d’une colonne.  
Il mesure la cellule Domaine d’une colonne, qui affiche le nom du domaine auquel la colonne est liée, chaque fois que la colonne est liée à un domaine ou en est déliée, et chaque fois que ce domaine est ajouté, renommé ou supprimé.  
Il mesure aussi à nouveau toutes les tables et toutes les colonnes chaque fois que [setInitialValue](#setinitialvalue) charge un document.  
Depuis la version `4.0.0`, les largeurs sont conservées uniquement dans [runtimeValue](#runtimevalue-getter), jamais dans `value`.  
Ainsi, un document enregistré par cette version se relit avec le même `value`, octet pour octet, quel que soit l’endroit où il a été enregistré et la façon dont le texte y était mesuré.

Mesurez comme le fait l’éditeur : `400 12px` dans la pile de polices de l’éditeur, arrondi, plus 2 px de marge intérieure.  
Sinon, les largeurs de `runtimeValue` s’écartent de celles affichées à l’écran.

```js
const TEXT_PADDING = 2;
const FONT =
  "400 12px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, " +
  "'Helvetica Neue', 'Open Sans', system-ui, sans-serif, " +
  "'Apple Color Emoji', 'Segoe UI Emoji'";

let context = null;

function getContext() {
  if (context) return context;

  try {
    context = new OffscreenCanvas(0, 0).getContext('2d');
    if (context) context.font = FONT;
  } catch {
    // no canvas available
  }

  return context;
}

function toWidth(text) {
  const context = getContext();
  const width = context ? context.measureText(text).width : text.length * 10;

  return Math.round(width) + TEXT_PADDING;
}

const replicationStore = createReplicationStore({ toWidth });
```

`text.length * 10` est la solution de repli quand aucun canevas n’est disponible.  
Elle suffit pour un store dont le document est seulement stocké, jamais rendu.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Sérialise l’état actuel de l’éditeur.  
Renvoie une chaîne JSON prête à être stockée telle quelle, et non un objet analysé.

```js
const data = replicationStore.value;
```

Depuis la version `4.0.0`, `value` est la forme de stockage : le document tel qu’un fichier le contient, le même texte que renvoie le [value](../erd-editor-element.md#value) de l’élément.  
Il ne contient que les entités actives, dans un ordre fixe, sans les entités supprimées, l’ordre d’empilement ni rien de ce qu’un chargement recalcule, comme les largeurs que mesure [toWidth](#towidth).  
Depuis la version `4.2.0`, il contient aussi les noms logiques, l’indication que chaque nom a été dérivé ou non des dictionnaires, les liens de domaine, ainsi que les mots, les termes et les domaines de l’onglet [Dictionnaire](../../guide/guides/dictionary.md).  
Il omet aussi, depuis la version `4.2.0`, chaque champ de texte vide d’une entité, chaque liste de `doc` et chaque collection qui ne contient rien, et `collections` lui-même quand toutes les collections sont vides.  
Il est indenté de deux espaces, avec chaque ligne de dictionnaire sur sa propre ligne de texte, et se termine par un saut de ligne, de sorte que le même document donne toujours les mêmes octets.  
Pour son contenu, voir [Forme de stockage et valeur d’exécution](./schema.md#storage-form-and-runtime-value).

Chaque paramètre dont le [verrou](../../guide/guides/settings.md#lock) est activé est écrit avec la valeur à laquelle il a été verrouillé, et tout autre paramètre tel qu’il est.  
Le verrou `Viewport` couvre à la fois l’origine de la vue et le niveau de zoom, et l’onglet, le langage du générateur de code, les deux casses des noms et le type de délimiteur ont chacun leur propre verrou.  
Depuis la version `4.2.0`, l’[affichage des noms](../../guide/guides/logical-names.md#name-view) a lui aussi le sien, le verrou `Name View`, activé dans un nouveau document.  
Les verrous remplacent le `ignoreSaveSettings` du document, qui n’est ni lu ni écrit depuis la version `4.0.0`.  
Avant la version `4.0.0`, `value` était le document entier tel que le store le détenait, avec les bits de défilement et de zoom de ce champ appliqués.

### runtimeValue getter {#runtimevalue-getter}

Depuis la version `4.0.0`, sérialise le document tel que la réplique le détient, y compris les entités supprimées et tout ce qu’un chargement recalcule.  
Ici aussi, chaque paramètre verrouillé est écrit avec sa valeur verrouillée.

```js
const snapshot = replicationStore.runtimeValue;
```

Utilisez-le pour initialiser un éditeur ou un autre store qui rejoint la session plus tard, via son `setInitialValue` (voir [Édition collaborative](./collaborative-editing.md)).  
Ne le stockez jamais comme fichier : il contient les entités supprimées, et le [JSON Schema](./schema.md#json-schema) publié le refuse.  
Ce sont ces entités supprimées qui permettent à l’annulation d’une suppression, envoyée plus tard, de faire revenir l’entité complète dans le store initialisé à partir de lui.  
Elles restent jusqu’à la prochaine ouverture du document depuis son fichier, dont la forme les exclut.

### setInitialValue {#setinitialvalue}

Charge l’état de l’éditeur stocké précédemment.

```js
replicationStore.setInitialValue('json...');
```

Il accepte la forme de stockage, une valeur d’exécution ou un document enregistré par une version antérieure, y compris un document v2.  
Une chaîne vide, ou tout ce qui n’est pas une chaîne, charge un nouveau document vide au lieu de lever une erreur.  
Un store qui n’a jamais reçu de valeur démarre avec ce même nouveau document.  
Depuis la version `4.0.0`, ce document a tous ses [verrous](../../guide/guides/settings.md#lock) activés, si bien que son `value` conserve la vue, l’onglet, le langage du générateur de code, les casses des noms et le type de délimiteur qu’il avait au départ pendant que les éditeurs qu’il réplique font défiler la vue, zooment, changent d’onglet ou modifient ces paramètres. Dans la version `3.10.0`, il n’enregistrait ni le défilement ni le zoom, et avant, il enregistrait les deux.  
Depuis la version `4.2.0`, il conserve aussi son affichage des noms, `Physical Names`, pendant que les éditeurs changent le leur.  
Un document stocké conserve les verrous qu’il indique.  
Un document qui n’en indique aucun, c’est-à-dire tout document enregistré avant la version `4.0.0`, y compris un document v2, se charge avec tous les verrous activés : l’origine de sa vue à `0, 0`, son niveau de zoom à `1` et son onglet sur ERD, quoi qu’il ait enregistré, et le langage du générateur de code, les casses des noms et le type de délimiteur tels qu’il les a enregistrés.  
Un document enregistré avant la version `4.2.0` n’indique aucun verrou `Name View`, si bien qu’il se charge avec ce verrou activé et dans la vue `Physical Names`, même s’il a été enregistré avec tous les autres verrous désactivés.  
Depuis la version `4.0.0`, `setInitialValue` supprime aussi les registres de collaboration conservés pour le document précédent, comme le fait le [setInitialValue](../erd-editor-element.md#setinitialvalue) de l’élément.  
Un texte qui n’est pas du JSON, comme un fichier où sont restés des marqueurs de conflit de fusion, ne lève pas non plus d’erreur : l’erreur d’analyse est seulement consignée dans la console, le document est vidé et les paramètres restent tels qu’ils étaient.

Depuis la version `4.0.0`, le chargement ne lance aucun ramasse-miettes, si bien que les entités supprimées restent dans [runtimeValue](#runtimevalue-getter).  
Auparavant, il supprimait les entités qui n’apparaissaient plus dans `doc` et n’avaient pas été modifiées depuis quatre jours ou plus.

Les réécritures du chargement se terminent avant le retour de `setInitialValue` : les marques de clé des colonnes, relues dans les options de chaque colonne et dans les relations ; la largeur de chaque table et de chaque colonne, mesurée à nouveau avec `toWidth` ; les points où chaque connecteur rejoint ses tables ; et, pour chaque relation, son indicateur de relation identifiante et le symbole à son extrémité parente.  
Aucune d’elles ne fait partie de `value`, mais `replicationStore.runtimeValue`, lu juste après l’appel, les contient déjà toutes.  
Une action qui arrive juste après le chargement, comme un défilement rejoué, est évaluée par rapport au document chargé, si bien que le chargement lui-même n’est jamais signalé comme [`changed`](#onchange).

Ni le chargement ni aucune de ces réécritures n’émet `change`.  
Lisez vous-même `replicationStore.value` une fois `setInitialValue` terminé si vous voulez réécrire le document chargé dans la forme de stockage.

### on@change {#onchange}

S’abonne aux changements de l’état de l’éditeur.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

`change` est soumis à un anti-rebond de 200 ms, de sorte qu’une rafale d’actions arrive en une seule notification.  
Il ne se déclenche que pour les types d’actions qui peuvent modifier le document, plus le `settings.changeIgnoreSaveSettings` qu’un éditeur plus ancien peut encore envoyer (voir [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Une action de présence relayée ou `editor.mergeLWW` ne le réveille jamais.  
Appelez la fonction renvoyée pour vous désabonner.

Depuis la version `3.10.0`, l’écouteur reçoit un `ReplicationChange`, un type que `@dineug/erd-editor/engine.js` exporte à côté de `ReplicationStore`.  
Avant la version `3.10.0`, il ne recevait rien, et un écouteur qui ignore l’argument continue de fonctionner.  
`value` est le document sérialisé dans la forme de stockage, la même chaîne que renvoie `replicationStore.value` à ce moment-là, il n’est donc pas nécessaire de le sérialiser à nouveau.  
`changed` vaut `false` quand les actions survenues depuis le `change` précédent, ou depuis le chargement, ont laissé `value` tel qu’il était, octet pour octet.

Une modification qu’un [verrou](../../guide/guides/settings.md#lock) exclut de `value` déclenche quand même `change`, avec `changed` à `false` : n’écrivez donc que lorsque `changed` vaut `true`.  
C’est le cas d’un défilement ou d’un zoom quand `Viewport` est verrouillé, d’un changement d’onglet quand `Canvas Type` est verrouillé, et d’une modification du langage du générateur de code, d’une casse des noms ou du type de délimiteur quand son propre verrou est activé.  
Depuis la version `4.2.0`, c’est aussi le cas d’un changement de l’affichage des noms quand `Name View` est verrouillé : l’éditeur l’envoie quand même, mais la réplique l’écarte, comme le font les autres éditeurs.  
Un changement de l’affichage des noms fait dans un éditeur en lecture seule est écarté de la même façon, quel que soit son verrou.  
L’événement [change](../erd-editor-element.md#change) de l’élément ignore une telle modification, mais la réplique la signale quand même.  
Tous les verrous sont activés dans un nouveau document et dans un document enregistré avant la version `4.0.0`, et `Name View` est verrouillé dans tout document enregistré avant la version `4.2.0`.  
Avec `Viewport` déverrouillé, un défilement ou un zoom modifie `value`, avec `Canvas Type` déverrouillé, l’ouverture d’un autre onglet de l’éditeur aussi, et avec `Name View` déverrouillé, un changement de l’affichage des noms venu d’un éditeur qui n’est pas en lecture seule aussi.  
Verrouiller ou déverrouiller un paramètre modifie aussi `value`.

Depuis la version `4.0.0`, `changed` compare la forme de stockage, qui ne contient ni les entités supprimées ni l’ordre d’empilement.  
Ainsi, une table ajoutée puis supprimée au sein d’un même `change`, une modification qui porte sur une entité qu’un autre collaborateur a supprimée et un chargement relayé qui ne change que l’ordre d’empilement donnent tous aussi `changed` à `false`.  
Depuis la version `4.2.0`, c’est aussi le cas d’une ligne ajoutée à une feuille de l’onglet Dictionnaire et laissée vide, car la forme de stockage omet une ligne qui ne contient rien.

`changed` ne compare jamais avec votre fichier stocké, qui peut déjà différer de `value` une fois chargé : c’est le cas d’un fichier enregistré par une version antérieure, y compris un fichier v2, ainsi que d’un fichier qui commence par un indicateur d’ordre des octets et d’un fichier modifié à la main.  
Depuis la version `4.2.0`, cela inclut un fichier enregistré par la version `4.0.0` ou `4.1.0`, car `value` omet les champs de texte vides de ses entités ainsi que les listes de `doc` et les collections vides que contient un tel fichier.  
Comparer les octets avec un tel fichier compterait comme une modification même un défilement qu’un verrou exclut.  
Le premier `change` avec `changed` à `true` restitue un tel fichier dans la forme de stockage, si bien que son écriture réécrit le fichier une fois.  
Un fichier enregistré par cette version ne diffère pas, quel que soit l’endroit où il a été enregistré, comme l’explique [toWidth](#towidth).  
Si `setInitialValue` intervient alors qu’un `change` est encore en attente, et que rien n’est transmis avant son échéance, ce `change` arrive quand même, avec le `value` chargé et `changed` à `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Applique au replicationStore les modifications des éditeurs distants.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` reporte l’application à une microtâche, et `dispatchSync` applique le lot immédiatement.

Vous pouvez transmettre le flux d’un store partagé sans le filtrer.  
Les deux méthodes ne conservent que les types d’actions qui peuvent modifier le document, plus les deux décrites à la fin de cette section, et écartent le reste, si bien que la présence que transporte une session collaborative (le curseur de souris, le focus, la sélection et le rectangle de sélection de chaque utilisateur) passe sans effet.

Depuis la version `3.10.0`, les actions conservées incluent `relationship.changeOnDelete` et `relationship.changeOnUpdate`, et `relationship.add` transporte `onDelete` et `onUpdate`.  
Un store d’une version antérieure écarte ces actions et ignore ces champs, il perd donc les actions [ON DELETE et ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) d’une relation.

Depuis la version `4.0.0`, les actions conservées incluent aussi `table.changeGroup`, sept des huit actions `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` et `tableGroup.changeColor`, toutes sauf le changement d’empilement `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` et `settings.changeDDLScript`.  
`settings.changeRelationshipOptimization` n’existe plus, les deux méthodes l’écartent donc.  
Un store d’une version antérieure écarte les nouvelles actions, il perd donc les [groupes de tables](../../guide/guides/table-groups.md), les [verrous](../../guide/guides/settings.md#lock), les scripts du [Schéma SQL](../../guide/guides/schema-sql.md) et les colonnes attribuées à une relation existante par [Associer les colonnes](../../guide/guides/relationship-editing.md#map-columns).  
Exécutez la réplique sur la même version que les éditeurs, ou sur une version plus récente.

La version `4.1.0` n’ajoute aucun type d’action et laisse `@dineug/erd-editor/engine.js` tel quel, si bien qu’une réplique `4.0.0` conserve chaque modification qu’envoie un éditeur `4.1.0`, tout comme une réplique `4.1.0`.  
Depuis la version `4.1.0`, `Replace` et `Replace All` de [Rechercher et remplacer](../../guide/guides/find-and-replace.md#replacing) renomment aussi les index et les groupes de tables, au moyen des actions `index.changeName` et `tableGroup.changeName` qu’une réplique `4.0.0` conserve déjà.  
L’état propre de l’[explorateur](../../guide/guides/explorer.md) n’est jamais envoyé, et un changement d’onglet ou un défilement qu’il provoque arrive comme tout autre changement d’onglet ou défilement (voir [Édition collaborative](./collaborative-editing.md)).

Depuis la version `4.2.0`, les actions conservées incluent aussi `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode`, ainsi que `dictionary.add`, `dictionary.update` et `dictionary.remove`, qui transportent chaque modification, chaque tri et chaque importation CSV des feuilles de l’onglet [Dictionnaire](../../guide/guides/dictionary.md).  
Parmi les changements de l’affichage des noms, une réplique n’applique que ceux que fait un éditeur qui n’est pas en lecture seule pendant que `Name View` est déverrouillé, et écarte les autres (voir [on@change](#onchange)).  
Un store d’une version antérieure écarte toutes ces actions, il perd donc les [noms logiques](../../guide/guides/logical-names.md), les liens de domaine, l’indication que chaque nom provient ou non des dictionnaires, les mots, les termes et les domaines, ainsi que l’affichage des noms.  
Un éditeur antérieur à la version `4.2.0` présent dans la session peut tout de même retirer une partie de tout cela à une réplique `4.2.0`.  
Un `Import` Schéma SQL, GraphQL, DBML ou AML sur cet éditeur, mais pas un `Import and Add`, vide les mots, les termes et les domaines de la réplique.  
Son annulation d’un chargement, d’un `Import` ou de `clear()` charge dans la réplique sa propre copie du document, sans noms logiques, ni liens de domaine, ni dictionnaires (voir [Combiner des versions](./collaborative-editing.md#mixing-releases)).  
`@dineug/erd-editor/engine.js` exporte les mêmes `createReplicationStore`, `ReplicationStore` et `ReplicationChange` qu’auparavant, et `createReplicationStore` prend le même contexte.

Depuis la version `4.0.0`, les deux méthodes appliquent aussi `editor.mergeLWW`, qui transporte les registres de collaboration par lesquels un éditeur répond quand un autre rejoint la session, si bien que la réplique départage les modifications concurrentes comme le font les éditeurs.  
Cette action ne modifie aucun octet de `value` et ne déclenche aucun `change`.  
`settings.changeIgnoreSaveSettings`, qu’un éditeur antérieur à la version `4.0.0` peut encore envoyer, est conservée mais ne change rien : elle déclenche `change` avec `changed` à `false`.

### destroy {#destroy}

Détruit complètement l’instance de replicationStore.

```js
replicationStore.destroy();
```

Ensuite, le store cesse d’émettre `change` et ignore toute transmission ultérieure.  
Le document reste figé à sa dernière valeur au lieu de lever une erreur.  
Créez un nouveau store pour recommencer.
