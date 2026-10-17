---
sidebar_position: 2
description: "L’API de l’élément erd-editor : attributs, value et runtimeValue, événements, thèmes, langue d’affichage, écran d’accueil, raccourcis clavier, importation et exportation de schémas."
---

# ErdEditorElement

L’éditeur est un simple `HTMLElement`.  
Sa définition de type est la suivante.

```ts
interface ErdEditorElement extends HTMLElement {
  readonly: boolean;
  systemDarkMode: boolean; // system dark/light auto
  enableThemeBuilder: boolean;
  enableLocalePicker: boolean;
  enableWelcomeScreen: boolean;
  value: string;
  readonly runtimeValue: string;
  focus: () => void;
  blur: () => void;
  clear: () => void;
  destroy: () => void;
  setInitialValue: (value: string) => void;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => void;
  setSystemLocale: (locale: string | null) => void;
  setKeyBindingMap: (
    keyBindingMap: Partial<
      Omit<
        KeyBindingMap,
        | 'edit'
        | 'stop'
        | 'undo'
        | 'redo'
        | 'zoomIn'
        | 'zoomOut'
        | 'zoomReset'
      >
    >
  ) => void;
  setSchemaSQL: SetSchema;
  setSchemaGraphQL: SetSchema;
  setSchemaDBML: SetSchema;
  setSchemaAML: SetSchema;
  setSchemaJSON: (
    value: string,
    options?: { mode?: 'replace' | 'append' }
  ) => void;
  getSchemaSQL: (
    databaseVendor?: DatabaseVendor,
    options?: SchemaSQLOptions
  ) => string;
  getSharedStore: (
    config?: SharedStoreConfig & {
      mouseTracker?: boolean;
      focusTracker?: boolean;
    }
  ) => SharedStore;
  setDiffValue: (value: string) => void;
}
```

L’éditeur s’affiche dans une racine fantôme fermée, si bien que `editor.shadowRoot` vaut `null` et que les styles de la page ne pénètrent pas dans l’éditeur et n’en sortent pas.  
Aucun élément intérieur n’est accessible par un sélecteur : stylisez plutôt l’éditeur avec [setTheme](#settheme) et les propriétés personnalisées CSS `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` et `enable-welcome-screen` sont les seuls attributs, et tous les cinq valent `false` par défaut. Les deux derniers sont apparus dans la version `4.0.0`. Chacun lit sa valeur comme le décrit [readonly](#readonly).

Depuis la version `4.1.0`, l’onglet ERD dispose d’un [explorateur](../guide/guides/explorer.md), une arborescence du diagramme ancrée à gauche du canevas, avec Rechercher et remplacer en haut. Aucun attribut, aucune propriété, aucune méthode ni aucun événement ne l’ouvre, ne le ferme ni ne signale son état : il s’ouvre depuis le bouton `Explorer` de la barre d’outils, depuis `Toggle Explorer` dans la recherche rapide ou le menu contextuel du canevas, ou avec le raccourci clavier [`findReplace`](#setkeybindingmap).  
Chaque élément démarre avec l’explorateur fermé. Son état ouvert ou fermé, sa largeur, son repli et sa recherche durent aussi longtemps que l’élément, à travers les changements d’onglet et tous les chargements, `setInitialValue` compris, et ne figurent jamais dans `value`, `runtimeValue`, l’historique d’annulation ni un store partagé.

## readonly {#readonly}

Définit la capacité de modification de l’éditeur.  
Tant qu’il est défini, l’affectation de `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, l’annulation et le rétablissement sont tous ignorés, et l’événement `change` n’est jamais émis. Chargez plutôt un document avec [setInitialValue](#setinitialvalue).  
La consultation fonctionne toujours : le zoom, le déplacement de la vue, l’outil Main, le mode zen, l’onglet du canevas, l’onglet [Visualisation](../guide/guides/visualization.md) dans ses deux modes, concentration sur des tables comprise, le SGBD et les paramètres de sortie du SQL et du générateur de code s’appliquent tous encore, si bien qu’un utilisateur en lecture seule peut toujours exporter le SQL pour un autre SGBD ou lire le code généré.  
Depuis la version `4.1.0`, l’[explorateur](../guide/guides/explorer.md#read-only-editors) s’ouvre aussi, et choisir l’une de ses lignes mène à ce que représente la ligne, comme dans un éditeur modifiable. [Rechercher et remplacer](../guide/guides/find-and-replace.md#read-only-editors), en haut de l’explorateur, ne fait que rechercher, sans flèche `Toggle Replace` ni ligne Remplacer, et aller à une correspondance l’affiche et la sélectionne toujours. Le panneau s’intitule `Explorer`, et l’info-bulle du bouton de la barre d’outils est `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac) dans tous les éditeurs. De la version `3.10.0` à la version `4.0.0`, Rechercher et remplacer s’ouvrait sous la forme d’un panneau flottant de recherche seule intitulé `Find`.  
La boîte de dialogue Propriétés de la table s’ouvre toujours et, depuis la version `3.10.0`, elle affiche un badge `Read only` à côté de son titre et son onglet `Indexes` ne propose aucune modification (voir [Propriétés de la table](../guide/guides/table-related-functions.md#table-properties)).  
Depuis la version `4.0.0`, un éditeur en lecture seule ne propose pas [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `New Table Group`, `Group selected tables`, `Remove from group` (voir [Groupes de tables](../guide/guides/table-groups.md#read-only-editors)) ni [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), et n’affiche pas d’[écran d’accueil](#enablewelcomescreen). Les boutons de verrou de l’onglet Paramètres ne changent rien, et les scripts `Before tables` et `After tables` de l’onglet Schéma SQL ne peuvent pas être modifiés.  
Depuis la version `4.1.0`, il n’affiche pas non plus de bouton `New Table`, `New Memo` ou `New Table Group` dans la [barre d’outils du canevas](../guide/guides/table-related-functions.md#canvas-toolbar), et les raccourcis clavier `addTableGroup` et `groupSelectedTables` sont sans effet.  
Les choix `This window only` de l’onglet Schéma SQL, `Statements`, `Header` et `Tables`, ne sont jamais enregistrés et s’appliquent toujours, tout comme la boîte de dialogue [`Export image`](../guide/guides/file-import-export.md#image), le configurateur de thème et le sélecteur de langue d’affichage. Un choix dans le configurateur de thème ou le sélecteur de langue d’affichage émet toujours [changePresetTheme](#changepresettheme) ou [changeLocale](#changelocale).  
Un attribut sans valeur, `=""` et `="true"` sont tous lus comme `true`. `="false"` est lu comme `false`, de même que toute autre chaîne, y compris l’idiome HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Détermine s’il faut se synchroniser automatiquement avec le mode sombre ou clair du système.  
Depuis la version `4.0.0`, l’activer règle l’`appearance` du thème sur `'system'`, comme le fait `setPresetTheme({ appearance: 'system' })`. L’éditeur affiche alors l’apparence claire ou sombre que signale le système d’exploitation, ou celle que nomme [setSystemAppearance](#setsystemappearance), et bascule lorsqu’elle change.  
Un appel ultérieur à [setPresetTheme](#setpresettheme) avec `'light'` ou `'dark'`, ou un choix de `Light` ou `Dark` dans le configurateur de thème ou la recherche rapide, remplace `'system'` et reste en place : le changement suivant de l’OS ne l’écrase plus, même si `systemDarkMode` vaut toujours `true`. Avant la version `4.0.0`, le changement suivant de l’OS l’écrasait.  
Le désactiver alors que l’apparence est `'system'` conserve l’apparence claire ou sombre affichée à ce moment-là. Le désactiver après que l’apparence a quitté `'system'` la laisse telle quelle.  
Le modifier n’émet aucun événement.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Détermine si une interface permettant de définir facilement des thèmes prédéfinis est fournie.  
Il affiche le bouton `Theme` de la barre d’outils, qui ouvre le configurateur de thème avec `Accent color`, `Gray color` et `Appearance`. Depuis la version `4.0.0`, `Appearance` propose `System` à côté de `Light` et `Dark`, et tant que cette option est activée, la recherche rapide liste `Theme` avec `System`, `Light` et `Dark`. Voir [Langue et thème](../guide/guides/language-and-theme.md).

![Ouverture du configurateur de thème depuis la barre d’outils, choix de la couleur d’accentuation et de la nuance de gris, et passage de l’apparence à Light puis à System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Changer le thème prédéfini depuis ce panneau ou depuis la recherche rapide émet l’événement [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

Depuis la version `4.0.0`, détermine si une interface permettant de choisir la langue d’affichage de l’éditeur est fournie.  
Il affiche le bouton `Display Language` de la barre d’outils, après `Theme` quand les deux sont affichés. Le bouton ouvre le sélecteur de langue d’affichage, et la recherche rapide liste `Display Language`. Tous deux proposent `System` et les 25 langues (voir [Langue et thème](../guide/guides/language-and-theme.md)).  
Il décide aussi de ce qu’affiche un éditeur avant l’appel de [setLocale](#setlocale) ou le choix d’une langue : `'system'` lorsqu’il est activé, l’anglais lorsqu’il est désactivé, si bien qu’un élément qui ne configure rien garde l’anglais qu’il a toujours affiché. L’activer ou le désactiver bascule immédiatement entre les deux. Une fois qu’une langue a été définie ou choisie, ce choix reste, que l’option soit activée ou désactivée.  
Définissez-le avant que l’élément soit ajouté pour que la première image suive `'system'`.  
Un choix émet [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

Depuis la version `4.0.0`, détermine si un diagramme vide accueille le lecteur avec l’[écran d’accueil](../guide/guides/editing-start.md#welcome-screen).  
Il recouvre l’onglet ERD tant que le document ne contient aucune table, aucun mémo affiché et aucun groupe de tables affiché. Il n’est pas affiché lorsque `readonly` est défini, en mode zen, ni lorsque la boîte de dialogue Propriétés de la table, la visionneuse de différences, le voyage dans le temps ou l’aperçu de la disposition automatique est ouvert. La première table, le premier mémo affiché ou le premier groupe de tables affiché le fait disparaître, et une annulation qui ramène à un diagramme vide le fait revenir.  
Ses lignes `New Table`, `New Memo` et `Command Palette` affichent la première combinaison de `addTable`, `addMemo` et `search` telle que [setKeyBindingMap](#setkeybindingmap) l’a laissée, et aucune pour un nom laissé vide. Ses flèches pointent vers les boutons `Theme` et `Display Language` seulement là où `enableThemeBuilder` et `enableLocalePicker` les affichent.  
Dans son menu, `↑`, `↓`, `Home` et `End` permettent de passer d’une ligne à l’autre et sont empêchées et arrêtées. `Enter` et `Space` sont arrêtées, mais pas empêchées, si bien que la ligne qui a le focus les reçoit, et `Escape` parmi les formats `Import` revient en arrière, empêchée et arrêtée. Toutes les autres touches atteignent l’éditeur et la page comme d’habitude.  
Il ne change rien au document : il laisse donc `value` tel quel et n’émet aucun `change`.  
Activez-le une fois que [setInitialValue](#setinitialvalue) a chargé le document, comme le font les hôtes officiels, pour que l’écran n’apparaisse jamais furtivement sur un fichier encore en cours de chargement.

```js
editor.enableWelcomeScreen = true;
// or
editor.setAttribute('enable-welcome-screen', 'true');
```

```html
<erd-editor enable-welcome-screen></erd-editor>
```

## value {#value}

### getter {#getter}

Récupère le document actuel sous forme de chaîne JSON, dans le [schéma](./advanced/schema.md) que définit l’éditeur.  
Depuis la version `4.0.0`, il s’agit de la forme de stockage, le document tel qu’un fichier le contient, qui est aussi ce qu’écrit l’exportation `json` et ce qu’enregistrent les hôtes officiels. Elle ne contient que les entités actives, sans les entités supprimées, l’ordre d’empilement ni ce que l’éditeur calcule lui-même, comme les largeurs mesurées, les marques de clé et les points d’ancrage des relations. Les clés de ses entités suivent un ordre fixe, elle est indentée de deux espaces et se termine par un saut de ligne, si bien que le même document donne toujours les mêmes octets.  
Chaque paramètre dont le [verrou](../guide/guides/settings.md#lock) est activé est écrit avec sa valeur verrouillée, et non tel que l’écran l’affiche. Le verrou `Viewport` conserve `originX`, `originY` et `zoomLevel`, et `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case` et `Bracket Type` conservent chacun leur propre paramètre. Tous les autres paramètres sont écrits tels qu’ils sont, et `lockSettings` est toujours écrit. Voir [Settings](./advanced/schema.md#settings) pour les bits.  
Un nouveau document a tous ses verrous activés, qu’il s’agisse de celui qu’affiche un élément avant de recevoir une valeur ou d’un document chargé à partir d’une valeur vide. Son `value` conserve l’origine à `0, 0`, le niveau de zoom à `1`, l’onglet ERD, ainsi que le langage du générateur de code, les casses des noms et le type de délimiteur par défaut, jusqu’à ce que le verrou correspondant soit désactivé.  
Avant la version `4.0.0`, il renvoyait le document entier tel que l’éditeur le détenait, avec `ignoreSaveSettings` appliqué. Le document tel que l’éditeur le détient est désormais [runtimeValue](#runtimevalue), et `ignoreSaveSettings` n’est plus ni lu ni écrit.

```js
const data = editor.value;
```

### setter {#setter}

Charge un état de l’éditeur enregistré précédemment. Il remplace le document entier : le document actuel est d’abord effacé.  
Comme `clear()`, `setInitialValue()` et les méthodes `setSchema*` dans leur `mode: 'replace'` par défaut, il abandonne aussi la vue Flux de l’onglet Visualisation : sa disposition, les tables auxquelles elle est restreinte, son affichage des lignes, son zoom et sa position. Un ajout (`mode: 'append'`) ne l’abandonne pas.  
Il est enregistré dans l’historique, ce qui permet `Undo, Redo`, et il émet `change`.  
Il accepte la forme de stockage, un [runtimeValue](#runtimevalue) ou un fichier enregistré par une version antérieure.  
Une chaîne vide, ou tout ce qui n’est pas une chaîne, charge un nouveau document au lieu de lever une erreur : vérifiez donc la valeur avant de l’affecter.  
Ce nouveau document est celui que crée `setInitialValue('')` : vide, avec les paramètres par défaut et, depuis la version `4.0.0`, tous les verrous activés. Dans la version `3.10.x`, il n’enregistrait ni la position de défilement ni le niveau de zoom, et auparavant il enregistrait les deux.  
Un store partagé relaie ce chargement aux collaborateurs avec le JSON complet du nouveau document, si bien que chaque pair, y compris un pair d’une version plus ancienne, charge le même document.  
Depuis la version `4.0.0`, les verrous du document chargé, et les valeurs verrouillées qu’écrit ensuite `value`, proviennent du texte, et la vue se place là où le texte la met, ou sur le diagramme lorsque rien de celui-ci n’y est dessiné. Pour chacun des autres paramètres que le texte verrouille (l’onglet, le langage du générateur de code, les casses des noms et le type de délimiteur), l’éditeur continue d’afficher ce qu’il affichait avant le chargement. Un paramètre que le texte laisse déverrouillé prend la valeur du texte. [setInitialValue](#setinitialvalue), lui, prend toutes les valeurs que contient le texte ; voir aussi cette méthode pour un texte qui ne nomme aucun verrou.  
Un texte qui n’est pas du JSON, comme un fichier où sont restés des marqueurs de conflit de fusion, ne lève pas d’erreur non plus : le document est vidé, ses paramètres restent tels quels et l’erreur d’analyse est consignée dans la console.  
Il est ignoré tant que `readonly` est défini ; utilisez [setInitialValue](#setinitialvalue) pour charger un document dans un éditeur en lecture seule.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

Depuis la version `4.0.0`, récupère le document tel que cet éditeur le détient, sous forme de chaîne JSON. Il n’a pas de setter : l’affecter lève donc une exception en mode strict.  
Il contient ce que [value](#value) omet : les entités supprimées et leur ordre, l’ordre d’empilement, les largeurs mesurées, les marques de clé, les points d’ancrage des relations et les séquences. Les paramètres verrouillés y sont aussi écrits avec leurs valeurs verrouillées.  
Utilisez-le pour initialiser, par son [setInitialValue](#setinitialvalue), un autre éditeur qui rejoint une session déjà en cours, comme un collaborateur ou une seconde vue du même document. Une annulation de suppression que la session envoie plus tard y restaure alors l’entité entière, tandis qu’un éditeur initialisé à partir de `value` ne contient aucune entité supprimée et restaure à la place une table vide et sans nom. Voir [Édition collaborative](./advanced/collaborative-editing.md).  
Plus aucun ramasse-miettes n’élimine les entités supprimées : elles y restent donc jusqu’à la prochaine ouverture du document depuis son fichier.  
Ne l’écrivez jamais dans un fichier : enregistrez `value`, que le [JSON Schema](./advanced/schema.md#json-schema) accepte, contrairement à celui-ci.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Charge un état de l’éditeur enregistré précédemment. Le chargement lui-même n’est pas enregistré dans l’historique : il ne peut donc pas être annulé, et aucun événement `change` n’est émis.  
Il efface aussi l’historique d’annulation, si bien que rien de ce qui a été fait avant le chargement ne peut être annulé ou rétabli sur le document chargé.  
Il accepte la forme de stockage, un [runtimeValue](#runtimevalue) ou un fichier enregistré par une version antérieure et, contrairement à l’affectation de `value`, il prend tous les paramètres que contient le texte, y compris l’onglet et les paramètres de code.  
Une chaîne vide, ou tout ce qui n’est pas une chaîne, charge un nouveau document au lieu de lever une erreur : `setInitialValue('')` crée donc un diagramme vierge.  
Depuis la version `4.0.0`, ce nouveau document, qui est aussi ce qu’affiche un élément avant de recevoir une valeur, a tous ses verrous activés. Le défilement, le zoom, le changement d’onglet et la modification du langage du générateur de code, des casses des noms ou du type de délimiteur laissent `value` tel quel et n’émettent aucun `change`. Dans la version `3.10.x`, il n’enregistrait ni la position de défilement ni le niveau de zoom, et auparavant il enregistrait les deux.  
Un document chargé à partir d’un texte conserve les verrous qu’il nomme. Un document qui n’en nomme aucun (tout fichier enregistré avant la version `4.0.0`, quelle que soit la valeur de son `ignoreSaveSettings`, ainsi qu’un fichier `.vuerd` v2) s’ouvre avec tous ses verrous activés, son `Viewport` verrouillé à l’origine `0, 0` et au niveau de zoom `1`, sur l’onglet ERD, avec son langage, ses casses des noms et son type de délimiteur tels qu’il les a enregistrés.  
Dans les deux cas, la vue s’ouvre sur la vue du document (celle que le texte a enregistrée lorsqu’il nomme ses verrous, l’origine `0, 0` au niveau de zoom `1` lorsqu’il n’en nomme aucun), ou sur le diagramme lorsque rien de celui-ci n’y est dessiné. Un `Viewport` verrouillé conserve toujours ses valeurs verrouillées dans `value`.  
Depuis la version `4.0.0`, il abandonne aussi l’état de collaboration du document précédent, et un [store partagé](#getsharedstore) de cet éditeur déjà abonné redemande le leur aux autres éditeurs, si bien qu’un éditeur rechargé dans une session en cours se met à jour. Initialisez un tel éditeur avec le [runtimeValue](#runtimevalue) d’un autre éditeur.  
Un texte qui n’est pas du JSON ne lève pas d’erreur non plus : le document est vidé, ses paramètres restent tels quels et l’erreur d’analyse est consignée dans la console.  
Contrairement à l’affectation de `value`, il n’est pas bloqué par `readonly` : c’est donc ainsi que vous chargez un document dans un éditeur en lecture seule.

```js
editor.setInitialValue('json...');
```

Chargez au démarrage, enregistrez à chaque modification.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Événements {#event}

`change`, `changePresetTheme` et `changeLocale` sont les trois seuls événements publics ; `changeLocale` est apparu dans la version `4.0.0`.  
L’élément déclenche aussi sur lui-même des événements internes `@dineug/erd-editor/internal-*` pour son propre fonctionnement ; ils ne font pas partie de l’API.

### change {#change}

Lorsque des modifications ont lieu dans l’éditeur, il émet un événement.  
L’événement passe par un anti-rebond de 200 ms, et il n’est pas émis tant que `readonly` vaut `true`.  
Il se déclenche pour toute modification du document : une modification dans l’interface, l’affectation de `value`, `clear()`, chacune des méthodes `setSchema*` et, depuis la version `4.0.0`, `setSchemaJSON()` et `Import and Add`. `setInitialValue` ne l’émet pas.  
Rien de ce qui est fait dans le mode Flux de l’onglet Visualisation ne l’émet (zoom, déplacement de la vue, déplacement des cartes, `Tidy Up`, affichage des lignes ou restriction de la vue depuis une carte), car rien de tout cela n’est une modification du document.  
Depuis la version `4.0.0`, une modification d’un paramètre dont le [verrou](../guide/guides/settings.md#lock) est activé ne l’émet pas non plus, car elle ne change que l’écran et jamais `value` : un défilement ou un zoom du canevas ERD tant que `Viewport` est verrouillé, un changement d’onglet tant que `Canvas Type` est verrouillé, et une modification du langage du générateur de code, de la casse des noms de table, de la casse des noms de colonne ou du type de délimiteur tant que son propre verrou est activé. Seules ces modifications sont exclues : un lot qui modifie aussi le document l’émet donc toujours. Verrouiller ou déverrouiller un paramètre l’émet.  
Tous les verrous sont activés dans un nouveau document et dans tout fichier enregistré avant la version `4.0.0` : par défaut, le défilement, le zoom et le changement d’onglet n’émettent donc rien. Cela couvre la concentration sur des tables depuis l’onglet ERD, le bouton de lien externe d’une carte qui ramène du mode Flux à l’onglet ERD, l’accès à une ligne de l’explorateur ou à une correspondance de recherche, ainsi que l’ouverture de l’explorateur ou l’accès à un résultat de la recherche rapide depuis un autre onglet. Chacun d’eux n’émet un `change` que lorsqu’un verrou qui le couvre est désactivé : `Canvas Type` pour le changement d’onglet, et `Viewport` pour le défilement que provoque aussi un bouton de carte, un résultat de la recherche rapide, une ligne de l’explorateur ou une correspondance de recherche. Depuis la version `4.1.0`, chacun de ces défilements suit une même règle, [Où aboutit un saut](../guide/guides/table-related-functions.md#where-a-jump-lands), si bien qu’un résultat de table de la recherche rapide ne fait plus défiler la vue à chaque fois, et qu’un saut que la règle laisse en place ne produit aucun défilement à émettre. Ouvrir, fermer ou redimensionner l’explorateur rétrécit ou élargit le canevas sans déplacer son origine, et n’émet rien non plus. Avant la version `4.0.0`, le défilement, le zoom et le changement d’onglet l’émettaient toujours, même lorsque `editor.value` restait identique.  
Pour éviter les écritures qui ne changent rien, comparez `editor.value` à la dernière valeur que vous avez stockée, et non au fichier que vous avez chargé : un fichier écrit par une version antérieure, un fichier v2 ou un fichier modifié à la main peut ressortir différent dans `value` dès son chargement, car `value` l’écrit dans la forme de stockage. Il en va de même d’un fichier dont le verrou `Viewport` est désactivé et dont l’origine ne montre aucune partie du diagramme sur cet écran : le chargement déplace la vue sur le diagramme, et `value` écrit l’endroit où elle aboutit. Depuis la version `4.0.0`, les largeurs mesurées n’en sont plus la cause, car `value` n’en contient aucune. Un hôte qui écrit des fichiers peut plutôt distinguer une modification d’un changement de vue grâce au `changed` d’un store de réplication (voir [on@change](./advanced/remote-storage.md#onchange)).  
L’événement ne porte aucun `detail`, ne remonte pas et ne franchit pas la limite de la racine fantôme : écoutez-le donc sur l’élément lui-même et lisez `editor.value` dans le gestionnaire.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Émis lorsque le thème prédéfini est modifié depuis le configurateur de thème intégré ou, depuis la version `4.0.0`, depuis `Theme` dans la recherche rapide. Chaque choix l’émet, y compris le choix de l’option déjà en vigueur.  
Appeler vous-même [setPresetTheme](#setpresettheme) ou [setSystemAppearance](#setsystemappearance), ou activer ou désactiver [systemDarkMode](#systemdarkmode), ne l’émet pas.  
`event.detail` est le `ThemeOptions` complet après le choix (`{ appearance, grayColor, accentColor }`), et non l’objet partiel demandé. Depuis la version `4.0.0`, son `appearance` vaut `'system'` lorsque `System` est choisi, et non l’apparence claire ou sombre affichée : stockez-le donc tel quel et redonnez-le à `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

Depuis la version `4.0.0`, émis lorsqu’une langue est choisie dans l’éditeur, depuis le sélecteur de langue d’affichage ou depuis `Display Language` dans la recherche rapide, tous deux activés par [enableLocalePicker](#enablelocalepicker).  
Il se déclenche après l’application de la langue, à chaque choix, y compris le choix de l’option déjà en vigueur. [setLocale](#setlocale) et [setSystemLocale](#setsystemlocale) ne l’émettent jamais, pas plus qu’un changement des langues du navigateur. Un changement de langue n’émet aucun `change`.  
`event.detail` vaut `{ locale }`, un `LocaleOption` : `'system'` lorsque `System` a été choisi, sinon le code de la langue. L’élément ne mémorise pas le choix : stockez-le donc et passez-le à `setLocale` au chargement suivant.  
Comme `change`, il ne remonte pas : écoutez-le donc sur l’élément lui-même.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Donne le focus à l’éditeur.

```js
editor.focus();
```

## blur {#blur}

Retire le focus de l’éditeur.

```js
editor.blur();
```

## clear {#clear}

Vide le document en supprimant toutes les tables, colonnes, relations, index et mémos et, depuis la version `4.0.0`, tous les groupes de tables.  
Tous les paramètres restent, y compris la base de données, la position de la vue, le niveau de zoom, les options d’affichage des tables, chaque verrou avec la valeur qu’il conserve, et les scripts `Before tables` et `After tables` de l’onglet Schéma SQL, si bien qu’un fichier vidé continue d’enregistrer ce qu’il enregistrait. Pour créer plutôt un nouveau document, affectez `''` à `value` ou appelez `setInitialValue('')`.  
Il est enregistré dans l’historique, si bien qu’il peut être annulé, et il émet `change`. Une annulation restaure le document tel que l’éditeur le détenait, chaque paramètre verrouillé à sa valeur verrouillée. Il est ignoré tant que `readonly` est défini.

```js
editor.clear();
```

## destroy {#destroy}

Détruit complètement l’instance de l’éditeur, qui ne peut alors plus être réutilisée.  
Il libère les écouteurs et les abonnements de l’éditeur, et détruit tous les stores partagés renvoyés par [getSharedStore](#getsharedstore).  
Un lot de flux qu’un store partagé retient encore est abandonné avec lui ; appelez d’abord le [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) de ce store pour l’envoyer.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Redéfinit les raccourcis clavier.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` et `zoomReset` sont fixes et ne peuvent pas être redéfinis.  
Seuls les vingt et un noms ci-dessous sont écrits ; tout le reste de l’objet est ignoré, y compris les noms fixes.  
Depuis la version `3.10.0`, `search` peut être redéfini, et `findReplace` est nouveau. Auparavant, `search` était fixe. Depuis la version `4.0.0`, `removeSelection` est nouveau. Depuis la version `4.1.0`, `addTableGroup` et `groupSelectedTables` sont nouveaux.  
La valeur d’un raccourci clavier doit être un `ShortcutOption[]`. Une simple chaîne est ignorée : écrivez donc `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` plutôt que `{ addTable: 'Alt+KeyN' }`.  
Un tableau vide est accepté et n’associe rien : `setKeyBindingMap({ findReplace: [] })` laisse `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) à la page, et `{ search: [] }` fait de même pour `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac). Le bouton `Search` de la barre d’outils ouvre toujours la recherche rapide, le bouton `Explorer` de la barre d’outils ouvre et ferme toujours l’explorateur, et `Toggle Explorer` dans la recherche rapide et dans le menu contextuel du canevas ouvre toujours sa recherche ou le ferme ; aucun d’eux n’affiche de raccourci pour un nom laissé vide. `{ removeSelection: [] }` laisse `Delete` et `Backspace` à la page, et les entrées de suppression des menus des tables, des mémos et des groupes de tables (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) n’affichent alors aucun raccourci.  
Depuis la version `4.1.0`, `{ addTableGroup: [] }` laisse `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) à la page, et `{ groupSelectedTables: [] }` laisse `T` puis `G`. `New Table Group` dans la barre d’outils du canevas, dans le menu contextuel du canevas et dans la recherche rapide, `Group selected tables` dans le menu de la table et `Group Selected Tables` dans la recherche rapide fonctionnent toujours, sans raccourci affiché. Les info-bulles des boutons `New Table`, `New Memo` et `New Table Group` de la barre d’outils du canevas indiquent la première combinaison de `addTable`, `addMemo` et `addTableGroup`, ou seulement le nom du bouton pour un raccourci clavier laissé vide.  
L’appel est une fusion partielle : les noms que vous omettez gardent leur valeur par défaut, et l’appeler deux fois conserve les modifications antérieures. Il n’existe pas de getter pour les raccourcis clavier actuels : [createKeyBindingMap](#createkeybindingmap) renvoie les valeurs par défaut, et non ce que `setKeyBindingMap` a modifié.

```ts
type ShortcutOption = {
  shortcut: string;
  preventDefault?: boolean;
  stopPropagation?: boolean;
};

const defaultKeyBindingMap: Omit<
  KeyBindingMap,
  | 'edit'
  | 'stop'
  | 'undo'
  | 'redo'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
> = {
  search: [
    { shortcut: '$mod+KeyK', preventDefault: true, stopPropagation: true },
  ],
  findReplace: [
    { shortcut: '$mod+KeyF', preventDefault: true, stopPropagation: true },
  ],
  addTable: [{ shortcut: 'Alt+KeyN', preventDefault: true }],
  addColumn: [{ shortcut: 'Alt+Enter', preventDefault: true }],
  addMemo: [{ shortcut: 'Alt+KeyM', preventDefault: true }],
  addTableGroup: [
    { shortcut: 'Alt+KeyG', preventDefault: true, stopPropagation: true },
  ],
  groupSelectedTables: [{ shortcut: 'KeyT KeyG', preventDefault: true }],
  removeTable: [
    { shortcut: '$mod+Backspace', preventDefault: true },
    { shortcut: '$mod+Delete', preventDefault: true },
  ],
  removeColumn: [
    { shortcut: 'Alt+Backspace', preventDefault: true },
    { shortcut: 'Alt+Delete', preventDefault: true },
  ],
  removeSelection: [
    { shortcut: 'Delete', preventDefault: true },
    { shortcut: 'Backspace', preventDefault: true },
  ],
  primaryKey: [{ shortcut: 'Alt+KeyK', preventDefault: true }],
  selectAllTable: [
    { shortcut: '$mod+KeyA', preventDefault: true },
    { shortcut: '$mod+Alt+KeyA', preventDefault: true },
  ],
  selectAllColumn: [{ shortcut: 'Alt+KeyA', preventDefault: true }],
  relationshipZeroOne: [{ shortcut: '$mod+Alt+Digit1', preventDefault: true }],
  relationshipZeroN: [{ shortcut: '$mod+Alt+Digit2', preventDefault: true }],
  relationshipOneOnly: [{ shortcut: '$mod+Alt+Digit3', preventDefault: true }],
  relationshipOneN: [{ shortcut: '$mod+Alt+Digit4', preventDefault: true }],
  tableProperties: [{ shortcut: 'Alt+Space', preventDefault: true }],
  focusView: [
    { shortcut: 'Alt+KeyF', preventDefault: true, stopPropagation: true },
  ],
  handTool: [{ shortcut: 'Space', preventDefault: true }],
  zenMode: [
    { shortcut: 'Alt+KeyZ', preventDefault: true, stopPropagation: true },
  ],
};

// example
editor.setKeyBindingMap({
  addTable: [{ shortcut: '$mod+KeyN', preventDefault: true }],
});
```

`selectAllTable`, `handTool`, `removeSelection` et, depuis la version `4.1.0`, `groupSelectedTables` cèdent la place au point d’insertion : tant que le focus est dans un input, un textarea ou un `contenteditable`, `$mod + A` sélectionne le texte, `Space` saisit un espace, `Delete` et `Backspace` effacent du texte, et `T` puis `G` saisit les deux lettres, au lieu d’atteindre le canevas. Aucun de ces appuis n’est empêché. Toute touche à laquelle vous les réaffectez se comporte de la même façon.

Depuis la version `4.0.0`, `removeSelection` (`Delete` ou `Backspace`) supprime la sélection dans l’onglet ERD en une seule étape d’annulation, sans demander de confirmation. Lorsque la table qui a le focus est la seule chose sélectionnée, qu’une ou plusieurs de ses colonnes sont sélectionnées et que le zoom dessine ses lignes, il supprime ces colonnes ; sinon, il supprime toutes les tables, tous les mémos et tous les groupes de tables sélectionnés, les tables d’un groupe étant conservées. Voir [Suppression de tables et de mémos](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Une touche maintenue ne supprime qu’une fois, et rien n’est supprimé tant qu’un éditeur de cellule, de mémo ou de nom de groupe de tables est ouvert. En dehors d’un champ de texte et des panneaux qui retiennent les raccourcis clavier (voir [createKeyBindingMap](#createkeybindingmap)), l’appui est empêché dans tous les onglets tant que l’éditeur a le focus, y compris sur un bouton de la barre d’outils qui a le focus, et dans un éditeur en lecture seule, où il ne supprime rien.

Depuis la version `4.1.0`, `addTableGroup` (`Alt+KeyG`) active le tracé `New Table Group` dans l’onglet ERD, le prochain appui du bouton principal sur le canevas traçant alors le groupe, et un nouvel appui sur la touche désactive le tracé, comme le fait le bouton `New Table Group` de la barre d’outils du canevas. `groupSelectedTables` (`KeyT KeyG`, `T` puis `G`) place les tables sélectionnées dans un nouveau groupe et ouvre son éditeur de nom, comme le fait `Group selected tables` dans le menu contextuel d’une table. Sans table sélectionnée, il n’ajoute rien ; un mémo ou un groupe de tables sélectionné ne compte pas. Voir [Tracer un groupe](../guide/guides/table-groups.md#drawing-a-group) et [Grouper les tables sélectionnées](../guide/guides/table-groups.md#grouping-selected-tables).  
Tous deux n’agissent que là où les menus proposent un groupe : pas tant que `readonly` est défini, que l’option d’affichage `Table Groups` masque les groupes ou qu’un éditeur de cellule, de mémo ou de nom de groupe de tables est ouvert. Comme les autres raccourcis clavier du canevas, ils n’agissent que dans l’onglet ERD, et pas tant que la recherche rapide, la boîte de dialogue Propriétés de la table, la visionneuse de différences, le voyage dans le temps, l’aperçu de la disposition automatique, `Export image` ou `Map Columns` est ouvert. Là où ils ne font rien, l’appui est tout de même empêché, sauf si `groupSelectedTables` cède la place au point d’insertion. `addTableGroup` est aussi arrêté, comme `focusView` et `zenMode`, si bien qu’un écouteur `keydown` de la page en phase de remontée ne le reçoit jamais.

Depuis la version `3.10.0`, `findReplace` (`$mod+KeyF`) ouvre [Rechercher et remplacer](../guide/guides/find-and-replace.md). Depuis la version `4.1.0`, il affiche ou masque l’[explorateur](../guide/guides/explorer.md#opening-and-closing) qui contient cette fonction, et l’onglet Raccourcis le liste sous le nom `Toggle Explorer`.  
Tant que le bouton `Explorer` de la barre d’outils apparaît enfoncé (l’explorateur ouvert dans l’onglet ERD et non masqué par le mode zen), il ferme l’explorateur, sauf si la recherche rapide, la boîte de dialogue Propriétés de la table, le configurateur de thème, le sélecteur de langue d’affichage, la boîte de dialogue `Export image` ou `Map Columns` est ouvert. Sinon, il ferme celui de ces éléments qui est ouvert, affiche l’onglet ERD depuis tout autre onglet et ouvre l’explorateur avec le point d’insertion dans son champ `Find` et la requête sélectionnée. Un éditeur trop étroit pour afficher l’explorateur à côté du canevas le garde ouvert mais effacé, et affiche la notification `Widen the window to show the Explorer`. Avant la version `4.1.0`, il ouvrait le panneau flottant Rechercher et remplacer, ou rendait le clavier à son champ, et ne le fermait jamais.  
Il ne cède pas la place au point d’insertion : tant que l’éditeur a le focus, il est pris en charge dans tous les onglets, depuis le canevas comme depuis un input de l’éditeur. L’appui est empêché, si bien que le navigateur n’ouvre pas de barre de recherche, et arrêté, si bien qu’aucun écouteur `keydown` de la page en phase de remontée ne le reçoit. Avec un éditeur de cellule ou de mémo ouvert ou, depuis la version `4.0.0`, un éditeur de nom de groupe de tables, il est toujours empêché et arrêté, mais ne fait rien.  
Tant que la visionneuse de différences, le voyage dans le temps ou l’aperçu de la disposition automatique est ouvert, quel que soit l’onglet, ou tant qu’une méthode de saisie est encore en cours de composition, il n’est ni empêché ni arrêté, si bien que la recherche propre du navigateur ou de l’hôte le reçoit. Dans l’explorateur, un appui encore en cours de composition est arrêté, mais pas empêché. Toute touche à laquelle vous réaffectez `findReplace` se comporte de la même façon.

`focusView` n’agit que dans l’onglet ERD. Avec au moins une table sélectionnée, il ouvre l’onglet Visualisation en mode Flux, restreint à ces tables et à toutes les tables situées à une relation de distance ; un mémo ou un groupe de tables sélectionné ne compte pas, et sans table sélectionnée il ne fait rien. Voir [Se concentrer sur des tables](../guide/guides/visualization.md#focusing-on-tables).

`stop` (`Escape`) dans l’onglet ERD ferme un éditeur de cellule ou de mémo ouvert, ou met fin au tracé d’une relation, et laisse la sélection telle quelle. Depuis la version `4.0.0`, il ferme aussi un éditeur de nom de groupe de tables, sans écrire de nom, et met fin à un tracé `New Table Group`. L’éditeur appelle `preventDefault()` sur cet appui.  
Lorsque rien de tout cela n’est ouvert, `Escape` efface la sélection et la cellule active, et n’est pas empêché. Quitter une modification et effacer la sélection demande donc deux appuis.  
À part l’explorateur, les formats `Import` de l’[écran d’accueil](#enablewelcomescreen), et les sélecteurs et boîtes de dialogue ci-dessous, l’éditeur n’arrête jamais la propagation d’`Escape`, si bien qu’une page qui l’écoute elle-même, pour fermer sa propre boîte de dialogue par exemple, reçoit les deux appuis et peut ignorer celui dont `defaultPrevented` vaut `true`.  
Tant que la recherche rapide, la boîte de dialogue Propriétés de la table, la visionneuse de différences, l’aperçu de la disposition automatique ou le voyage dans le temps est ouvert, `Escape` ferme plutôt cet élément et laisse la sélection telle quelle. Cet appui n’est pas empêché non plus.  
Depuis la version `4.0.0`, une boîte de dialogue [`Export image`](../guide/guides/file-import-export.md#image) ou [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) ouverte prend aussi `Escape` : elle se ferme et laisse la sélection telle quelle. Chacune prend le clavier à son ouverture, et cet `Escape` est à la fois empêché et arrêté.  
Depuis la version `4.1.0`, un appui sur `Escape` avec le focus dans l’[explorateur](../guide/guides/explorer.md#keys-in-the-explorer), dans son arborescence, ses champs ou ses boutons, rend le clavier au canevas et laisse l’explorateur ouvert et la sélection telle quelle. L’éditeur appelle à la fois `preventDefault()` et `stopPropagation()` sur cet appui, si bien qu’il n’atteint jamais un écouteur `keydown` de la page en phase de remontée.  
Un appui sur `Escape` sur le canevas ne ferme jamais l’explorateur. Avant la version `4.1.0`, un appui sur `Escape` dans le panneau Rechercher et remplacer le fermait, et un appui sur le canevas le fermait en même temps qu’il effaçait la sélection.  
Depuis la version `4.0.0`, le sélecteur de langue d’affichage et le sélecteur de couleur se ferment avec `Escape` : à l’intérieur, l’appui est empêché et arrêté, et sur le canevas il les ferme en même temps qu’il efface la sélection, sans être ni empêché ni arrêté.  
Un appui sur `Escape` alors qu’une méthode de saisie est encore en cours de composition appartient à la composition. Il laisse un éditeur ouvert tel quel et n’est pas empêché : une page peut donc, elle aussi, ignorer un appui dont `isComposing` vaut `true` ou dont `keyCode` vaut `229`. Dans l’explorateur, un tel appui, comme toute touche enfoncée en cours de composition, est aussi arrêté, et le clavier reste dans le champ.  
Avant la version `3.9.2`, un seul appui sur `Escape` mettait fin à une modification ou à un tracé et effaçait la sélection, et l’éditeur ne l’empêchait jamais.

### createKeyBindingMap {#createkeybindingmap}

Depuis la version `3.9.2`, le paquet exporte `createKeyBindingMap()`, et avec lui les types `KeyBindingMap`, `KeyBindingName` et `ShortcutOption`.  
Il renvoie les raccourcis clavier par défaut, les 28 noms, y compris les noms fixes, sous forme d’un nouvel objet à chaque appel, si bien que modifier l’objet renvoyé ne change rien d’autre.  
C’est ce dont part chaque éditeur, et un appel à `setKeyBindingMap` ne s’y reflète pas.  
Seul `createKeyBindingMap` existe à l’exécution ; les trois autres sont des types.

```ts
type KeyBindingName =
  | 'edit'
  | 'stop'
  | 'search'
  | 'findReplace'
  | 'undo'
  | 'redo'
  | 'addTable'
  | 'addColumn'
  | 'addMemo'
  | 'addTableGroup'
  | 'groupSelectedTables'
  | 'removeTable'
  | 'removeColumn'
  | 'removeSelection'
  | 'primaryKey'
  | 'selectAllTable'
  | 'selectAllColumn'
  | 'relationshipZeroOne'
  | 'relationshipZeroN'
  | 'relationshipOneOnly'
  | 'relationshipOneN'
  | 'tableProperties'
  | 'focusView'
  | 'zoomIn'
  | 'zoomOut'
  | 'zoomReset'
  | 'handTool'
  | 'zenMode';

type KeyBindingMap = Record<KeyBindingName, ShortcutOption[]>;

declare function createKeyBindingMap(): KeyBindingMap;

// example
import { createKeyBindingMap } from '@dineug/erd-editor';

const shortcuts = Object.values(createKeyBindingMap())
  .flat()
  .map(({ shortcut }) => shortcut); // 'Enter', 'Escape', '$mod+KeyK', ...
```

Chaque `shortcut` est une combinaison dans la syntaxe de [tinykeys](https://github.com/jamiebuilds/tinykeys), qui désigne sa touche par `KeyboardEvent.code` et où [`$mod`](#mod) vaut `⌘` sous macOS et `Control` ailleurs.  
Depuis la version `4.0.0`, l’éditeur lit lui-même ces combinaisons, dans la même syntaxe, au lieu de passer par tinykeys. Une touche correspond par son `code`, ou par son `key` quelle que soit la casse, et un appui ne correspond que si exactement les touches de modification que nomme la combinaison sont maintenues. `AltGraph` compte comme `Control` et `Alt` sous Windows et comme `Alt` sous macOS. Des appuis séparés par un espace forment une séquence, qui recommence après une seconde sans keydown.  
Depuis la version `4.1.0`, l’une des valeurs par défaut est une séquence : `groupSelectedTables` vaut `KeyT KeyG`, `T` puis `G`. Une séquence s’exécute à l’appui qui la complète, et seul cet appui reçoit ses `preventDefault` et `stopPropagation` : avec les valeurs par défaut, `T` atteint donc la page et seul `G` est empêché. Les menus, la recherche rapide et l’onglet Raccourcis affichent une séquence avec une touche par appui.  
Les noms fixes sont associés à `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) et `$mod+Digit0` (`zoomReset`). `edit` et `stop` ne portent aucun indicateur ; les cinq autres portent `preventDefault` et `stopPropagation`. Les autres sont les valeurs par défaut ci-dessus, dont `search` et `findReplace`.

L’éditeur les écoute sur son propre élément : un hôte qui capte les touches avant l’éditeur, avec des raccourcis globaux ou un écouteur `keydown` en phase de capture, doit donc les laisser passer tant que l’éditeur a le focus.  
Construisez la liste des touches à laisser passer à partir de `createKeyBindingMap()`, en remplaçant les valeurs par défaut par les raccourcis clavier que vous avez passés à `setKeyBindingMap`.  
Depuis la version `3.10.0`, cette liste inclut `$mod+KeyF`, la combinaison de recherche du navigateur lui-même. Un hôte qui veut garder sa propre recherche sur cette combinaison passe `setKeyBindingMap({ findReplace: [] })`.  
Depuis la version `4.0.0`, elle inclut aussi `Delete` et `Backspace` seuls. Un hôte qui veut garder ces touches passe `setKeyBindingMap({ removeSelection: [] })`.  
Depuis la version `4.1.0`, elle inclut aussi `Alt+KeyG` et la séquence `KeyT KeyG`, qui se présente sous forme d’une seule chaîne : découpez-la à l’espace et laissez passer chaque appui, `T` et `G` seuls compris, car une séquence à laquelle il manque un appui ne se complète jamais. Un hôte qui veut garder ces touches passe `setKeyBindingMap({ addTableGroup: [] })` ou `setKeyBindingMap({ groupSelectedTables: [] })`.

Tant que le focus est dans l’explorateur, dans son arborescence, ses champs `Find` et `Replace` ou ses boutons, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` et `zoomReset` passent jusqu’à l’éditeur, si bien que `findReplace` y agit comme sur le canevas. Tous les autres raccourcis clavier, tels qu’ils sont actuellement définis, s’arrêtent à l’explorateur, une séquence par son dernier appui (un `G` seul avec les valeurs par défaut), de même que les touches fléchées, `Tab`, `Enter`, `Space`, `Home`, `End` et toute touche enfoncée alors qu’une méthode de saisie est encore en cours de composition. À part `Escape`, qui rend le clavier au canevas, ils sont arrêtés sans être empêchés, si bien qu’ils agissent comme des touches ordinaires dans les champs, les boutons et l’arborescence de l’explorateur, et n’atteignent ni le canevas ni un écouteur `keydown` de la page en phase de remontée : `Alt + N` n’y ajoute aucune table, et `Delete` n’y supprime rien. Les touches qui servent à se déplacer, à réduire ou à aller à une ligne de l’arborescence, ainsi que `Enter` dans le champ `Find` ou `Replace`, qui parcourt les correspondances ou remplace, sont en outre empêchées.  
Toute autre touche, comme la combinaison d’enregistrement ou de palette de commandes d’un hôte, continue jusqu’à la page comme d’habitude. Voir [Touches dans l’explorateur](../guide/guides/explorer.md#keys-in-the-explorer). Avant la version `4.1.0`, le panneau flottant Rechercher et remplacer retenait les touches de la même façon, à part `Home`, `End`, le dernier appui d’une séquence et `Space` lorsque `handTool` était associé à une autre touche.  
Depuis la version `4.0.0`, le sélecteur de langue d’affichage retient les touches de la même façon : les sept mêmes raccourcis clavier passent, et tous les autres raccourcis clavier (depuis la version `4.1.0`, une séquence par son dernier appui), les touches fléchées et `Tab` y sont arrêtés sans être empêchés, de même que toute touche enfoncée alors qu’une méthode de saisie est encore en cours de composition. `↑`, `↓`, `Home`, `End`, `Enter` et `Space` sur l’une de ses lignes parcourent les lignes ou en choisissent une, et sont en outre empêchées.

### $mod {#mod}

Change la touche `Control` selon l’environnement.

- Mac : $mod = Meta (⌘)
- Windows/Linux : $mod = Control

### Tableau des touches de raccourci {#shortcut-table}

Utilise les propriétés `key, code` des événements clavier.  
Utilisez `code` pour les positions absolues et `key` pour les valeurs saisies.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/A           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/A           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc. | `1`, `2`, etc.  | `1`, `2`, etc. | `Digit1`, `Digit2`, etc.       |
| `a`, `b`, etc. | `a`, `b`, etc.  | `a`, `b`, etc. | `KeyA`, `KeyB`, etc.           |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Thème {#theme}

### setPresetTheme {#setpresettheme}

Définit un thème prédéfini.  
Les valeurs par défaut sont `appearance: 'dark'`, `grayColor: 'slate'` et `accentColor: 'indigo'`.  
Chaque champ s’applique séparément : un appel partiel laisse donc les deux autres tels quels. Une valeur qui ne fait pas partie des noms ci-dessous est ignorée, et l’appel ne lève jamais d’exception.  
Depuis la version `4.0.0`, `appearance` accepte aussi `'system'`, le `System` du configurateur de thème. Il affiche l’apparence claire ou sombre que signale le système d’exploitation, ou celle que nomme [setSystemAppearance](#setsystemappearance), et bascule lorsqu’elle change.

```ts
type ThemeOptions = {
  appearance: 'dark' | 'light' | 'system';
  grayColor: 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand';
  accentColor:
    | 'gray'
    | 'gold'
    | 'bronze'
    | 'brown'
    | 'yellow'
    | 'amber'
    | 'orange'
    | 'tomato'
    | 'red'
    | 'ruby'
    | 'crimson'
    | 'pink'
    | 'plum'
    | 'purple'
    | 'violet'
    | 'iris'
    | 'indigo'
    | 'blue'
    | 'cyan'
    | 'teal'
    | 'jade'
    | 'green'
    | 'grass'
    | 'lime'
    | 'mint'
    | 'sky';
};

// example
editor.setPresetTheme({ appearance: 'light' });
```

### setSystemAppearance {#setsystemappearance}

Depuis la version `4.0.0`, nomme l’apparence claire ou sombre qu’affiche l’apparence `'system'`, pour un hôte qui a ses propres apparences claire et sombre, comme un thème d’IDE. Tant qu’une apparence est nommée, les changements du système d’exploitation sont ignorés.  
`null`, ou toute valeur autre que `'dark'` ou `'light'`, revient au suivi du système d’exploitation.  
Tant que l’apparence est `'light'` ou `'dark'`, il ne change rien à l’écran, mais la valeur est conservée et s’applique dès que l’apparence devient `'system'`. Sinon, elle s’applique immédiatement. Il n’émet rien, et `changePresetTheme` continue de signaler `'system'`.  
Les hôtes VS Code, JetBrains et Obsidian l’appellent avec leur propre apparence claire ou sombre, puis de nouveau chaque fois qu’elle change.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Permet de personnaliser le thème.  
Chaque appel remplace toute la surcouche personnalisée : repassez donc l’objet complet pour modifier un jeton par-dessus une surcharge existante, et passez `{}` pour revenir au thème prédéfini.  
Seuls les noms de jeton ci-dessous, avec des valeurs de type chaîne, sont conservés ; tout le reste est abandonné sans erreur.  
La surcouche se place au-dessus du thème prédéfini : un appel ultérieur à `setPresetTheme` remplace donc le thème prédéfini en dessous, tandis que vos surcharges restent.

#### JavaScript {#javascript}

```ts
type Theme = {
  grayColor1: string;
  grayColor2: string;
  grayColor3: string;
  grayColor4: string;
  grayColor5: string;
  grayColor6: string;
  grayColor7: string;
  grayColor8: string;
  grayColor9: string;
  grayColor10: string;
  grayColor11: string;
  grayColor12: string;

  accentColor1: string;
  accentColor2: string;
  accentColor3: string;
  accentColor4: string;
  accentColor5: string;
  accentColor6: string;
  accentColor7: string;
  accentColor8: string;
  accentColor9: string;
  accentColor10: string;
  accentColor11: string;
  accentColor12: string;

  canvasBackground: string;
  canvasBoundaryBackground: string;

  tableBackground: string;
  tableHeaderBackground: string;
  tableSelect: string;
  tableBorder: string;
  tableShadow: string;

  tableGroupHeaderBackground: string;
  tableGroupBackground: string;
  tableGroupBorder: string;

  memoBackground: string;
  memoSelect: string;
  memoBorder: string;
  memoShadow: string;

  columnSelect: string;
  columnSelectHover: string;
  columnHover: string;

  relationshipHover: string;

  visualizationLink: string;
  visualizationColumn: string;
  visualizationRelationship: string;

  toolbarBackground: string;

  contextMenuBackground: string;
  contextMenuSelect: string;
  contextMenuHover: string;
  contextMenuBorder: string;

  minimapBorder: string;
  minimapShadow: string;
  minimapViewportBorder: string;
  minimapViewportBorderHover: string;

  toastBackground: string;
  toastBorder: string;
  toastSuccess: string;
  toastError: string;

  findReplaceError: string;

  mapColumnsError: string;

  schemaSqlWarningBackground: string;
  schemaSqlWarningForeground: string;

  dragSelectBackground: string;
  dragSelectBorder: string;

  scrollbarTrack: string;
  scrollbarThumb: string;
  scrollbarThumbHover: string;

  foreground: string;
  active: string;
  placeholder: string;

  focus: string;
  inputActive: string;

  keyPK: string;
  keyFK: string;
  keyPFK: string;

  treeBackground: string;
  treeRowHover: string;
  treeRowCurrent: string;
  treeMuted: string;
  treeMatch: string;

  explorerBackground: string;
  explorerBorder: string;

  diffInsertForeground: string;
  diffDeleteForeground: string;
  diffModifyForeground: string;
  diffRenameForeground: string;
};

// example
editor.setTheme({
  canvasBackground: '#1b1b1f',
  tableBackground: '#242429',
  keyPK: '#ffc53d',
});
```

`tableShadow` et `memoShadow` sont la couleur de l’ombre que projettent les tables et les mémos sur le canevas ERD. Le thème prédéfini sombre les laisse à `transparent`, qui ne projette aucune ombre, comme le fait le passage de `none` ou d’une chaîne vide à `setTheme` ; le thème prédéfini clair utilise `rgba(0, 0, 0, 0.18)`.

Depuis la version `4.0.0`, il existe neuf jetons de plus :

- `tableGroupHeaderBackground`, `tableGroupBackground` et `tableGroupBorder` colorent la barre de titre, le corps et le contour d’un [groupe de tables](../guide/guides/table-groups.md) qui n’a pas de couleur propre.
- `toastSuccess` et `toastError` colorent la marque d’une notification qui indique comment une opération s’est terminée.
- `findReplaceError` et `mapColumnsError` colorent les erreurs qu’affichent la fonction Rechercher et remplacer et la boîte de dialogue Associer les colonnes. Rechercher et remplacer utilisait auparavant `diffDeleteForeground` : surcharger ce jeton ne le recolore donc plus.
- `schemaSqlWarningBackground` et `schemaSqlWarningForeground` colorent les avertissements dans les options de l’onglet Schéma SQL.

Depuis la version `4.1.0`, il existe neuf jetons de plus :

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` et `treeMatch` colorent l’arborescence que partagent l’[explorateur](../guide/guides/explorer.md#the-tree) et la [visionneuse de différences](../guide/guides/table-related-functions.md#diff-viewer) : son arrière-plan, qui remplit aussi les champs `Find` et `Replace` de l’explorateur ; une ligne sous le pointeur, la ligne active au clavier lorsque l’arborescence a le focus, et un bouton sous le pointeur dans l’en-tête et la recherche de l’explorateur ; la ligne de la correspondance de recherche actuelle ; le texte atténué comme les décomptes, les types de données et les flèches de repli ; et la marque derrière le texte trouvé par une recherche.
- `explorerBackground` et `explorerBorder` colorent le panneau de l’explorateur et ses traits : son bord à côté du canevas, le trait sous sa recherche, et les bordures de ses champs et des boutons que déploie `Search In`. `explorerBorder` dessine aussi le bord de l’arborescence de la visionneuse de différences, le trait sous son champ `Filter by name` et la bordure de ce champ. Les icônes de clé de l’explorateur prennent `keyPK`, `keyFK` et `keyPFK`.
- `diffModifyForeground` et `diffRenameForeground` colorent ce que la visionneuse de différences marque comme modifié et renommé, dans son arborescence et sur les deux documents. `diffModifyForeground` entoure aussi une table, un mémo ou un groupe de tables qui a été déplacé, redimensionné, recoloré ou regroupé, quelles que soient ses autres modifications, et dessine le connecteur d’une clé étrangère modifiée.

`diffInsertForeground` et `diffDeleteForeground` colorent désormais ce que la visionneuse de différences marque comme ajouté et supprimé, dans son arborescence et sur le document qui le contient, aussi bien dans le texte que dans les contours et les connecteurs. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` et `diffCrossForeground` ont été supprimés dans la version `4.1.0`, car la visionneuse de différences ne remplit plus les cellules. `setTheme` les abandonne comme tout autre nom absent de `Theme`, et leurs variables CSS, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` et `--erd-editor-diff-cross-foreground`, ne sont plus lues.

#### Variables CSS {#css-variables}

Chaque jeton de `Theme` a une variable CSS correspondante, nommée `--erd-editor-` suivi de la clé en kebab-case : `grayColor10` devient `--erd-editor-gray-color-10`, `keyPK` devient `--erd-editor-key-pk` et `keyPFK` devient `--erd-editor-key-pfk`.  
Les variables sont héritées dans l’éditeur : définissez-les donc là où vous voulez qu’elles s’appliquent. Sur `:root`, elles définissent le thème de tous les éditeurs de la page ; sur l’élément lui-même, celui de cet éditeur seulement.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

Depuis la version `3.4.0`, les jetons mal orthographiés `dargSelect` s’écrivent `dragSelect`, et leurs variables CSS sont passées de `--erd-editor-darg-select-background` et `--erd-editor-darg-select-border` à `--erd-editor-drag-select-background` et `--erd-editor-drag-select-border`. Une feuille de style qui utilise encore les anciens noms est ignorée.

<details>
<summary>Valeurs par défaut du thème</summary>

```css
:root {
  --erd-editor-gray-color-1: #111113;
  --erd-editor-gray-color-2: #18191b;
  --erd-editor-gray-color-3: #212225;
  --erd-editor-gray-color-4: #272a2d;
  --erd-editor-gray-color-5: #2e3135;
  --erd-editor-gray-color-6: #363a3f;
  --erd-editor-gray-color-7: #43484e;
  --erd-editor-gray-color-8: #5a6169;
  --erd-editor-gray-color-9: #696e77;
  --erd-editor-gray-color-10: #777b84;
  --erd-editor-gray-color-11: #b0b4ba;
  --erd-editor-gray-color-12: #edeef0;
  --erd-editor-accent-color-1: #11131f;
  --erd-editor-accent-color-2: #141726;
  --erd-editor-accent-color-3: #182449;
  --erd-editor-accent-color-4: #1d2e62;
  --erd-editor-accent-color-5: #253974;
  --erd-editor-accent-color-6: #304384;
  --erd-editor-accent-color-7: #3a4f97;
  --erd-editor-accent-color-8: #435db1;
  --erd-editor-accent-color-9: #3e63dd;
  --erd-editor-accent-color-10: #5472e4;
  --erd-editor-accent-color-11: #9eb1ff;
  --erd-editor-accent-color-12: #d6e1ff;
  --erd-editor-canvas-background: #212225;
  --erd-editor-canvas-boundary-background: #111113;
  --erd-editor-table-background: #18191b;
  --erd-editor-table-header-background: #2e3135;
  --erd-editor-table-select: #435db1;
  --erd-editor-table-border: #363a3f;
  --erd-editor-table-shadow: transparent;
  --erd-editor-table-group-header-background: #43484e;
  --erd-editor-table-group-background: #d3edf81d;
  --erd-editor-table-group-border: #43484e;
  --erd-editor-memo-background: #18191b;
  --erd-editor-memo-select: #435db1;
  --erd-editor-memo-border: #363a3f;
  --erd-editor-memo-shadow: transparent;
  --erd-editor-column-select: #182449;
  --erd-editor-column-select-hover: #1d2e62;
  --erd-editor-column-hover: #272a2d;
  --erd-editor-relationship-hover: #435db1;
  --erd-editor-visualization-link: #43484e;
  --erd-editor-visualization-column: #5a6169;
  --erd-editor-visualization-relationship: #5a6169;
  --erd-editor-toolbar-background: #111113;
  --erd-editor-context-menu-background: #18191b;
  --erd-editor-context-menu-select: #272a2d;
  --erd-editor-context-menu-hover: #3a4f97;
  --erd-editor-context-menu-border: #363a3f;
  --erd-editor-minimap-border: black;
  --erd-editor-minimap-shadow: black;
  --erd-editor-minimap-viewport-border: #3a4f97;
  --erd-editor-minimap-viewport-border-hover: #435db1;
  --erd-editor-toast-background: #18191b;
  --erd-editor-toast-border: #363a3f;
  --erd-editor-toast-success: #3dd68c;
  --erd-editor-toast-error: #ff9592;
  --erd-editor-find-replace-error: #ff9592;
  --erd-editor-map-columns-error: #ff9592;
  --erd-editor-schema-sql-warning-background: #500f1c;
  --erd-editor-schema-sql-warning-foreground: #ff9592;
  --erd-editor-drag-select-background: #253974;
  --erd-editor-drag-select-border: #435db1;
  --erd-editor-scrollbar-track: #ddeaf814;
  --erd-editor-scrollbar-thumb: #696e77;
  --erd-editor-scrollbar-thumb-hover: #777b84;
  --erd-editor-foreground: #b0b4ba;
  --erd-editor-active: #edeef0;
  --erd-editor-placeholder: #e5edfd7b;
  --erd-editor-focus: #435db1;
  --erd-editor-input-active: #5472e4;
  --erd-editor-key-pk: #ffc53d;
  --erd-editor-key-fk: #e54666;
  --erd-editor-key-pfk: #00a2c7;
  --erd-editor-tree-background: #111113;
  --erd-editor-tree-row-hover: #212225;
  --erd-editor-tree-row-current: #1d2e62;
  --erd-editor-tree-muted: #b0b4ba;
  --erd-editor-tree-match: #253974;
  --erd-editor-explorer-background: #111113;
  --erd-editor-explorer-border: #363a3f;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Langue d’affichage {#display-language}

Depuis la version `4.0.0`, le texte propre de l’éditeur (ses menus, panneaux, boîtes de dialogue, sa recherche rapide, ses notifications et les mots qu’il dessine sur le diagramme comme `unnamed`, exportations d’images comprises) existe en 25 langues. Les noms de tables et de colonnes, le SQL, les types de données et le code généré ne sont jamais traduits. Voir [Langue et thème](../guide/guides/language-and-theme.md).  
Avant l’appel de [setLocale](#setlocale) ou le choix d’une langue, l’éditeur affiche l’anglais, ou suit `'system'` tant que [enableLocalePicker](#enablelocalepicker) est activé.  
L’éditeur définit `lang` et `dir` sur sa propre racine à l’intérieur de la racine fantôme fermée, jamais sur l’élément hôte ni sur la page, si bien qu’une page de droite à gauche n’inverse pas l’éditeur et qu’une langue de droite à gauche n’inverse pas la page. L’hébreu, l’arabe et le persan disposent l’interface de l’éditeur de droite à gauche ; le diagramme lui-même n’est jamais mis en miroir. Depuis la version `4.1.0`, l’[explorateur](../guide/guides/explorer.md) reste à gauche du canevas dans toutes les langues, ses propres lignes se lisant de droite à gauche dans ces trois langues.  
Le paquet exporte les types `LocaleCode` (l’un des codes ci-dessous) et `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Code    | Nom affiché          | Langue               |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonésien           |
| `de-DE` | Deutsch              | Allemand             |
| `en`    | English              | Anglais              |
| `es-ES` | Español              | Espagnol             |
| `eu-ES` | Euskara              | Basque               |
| `fr-FR` | Français             | Français             |
| `it-IT` | Italiano             | Italien              |
| `nl-NL` | Nederlands           | Néerlandais          |
| `pl-PL` | Polski               | Polonais             |
| `pt-PT` | Português            | Portugais            |
| `pt-BR` | Português Brasileiro | Portugais du Brésil  |
| `ro-RO` | Română               | Roumain              |
| `sk-SK` | Slovenčina           | Slovaque             |
| `sl-SI` | Slovenščina          | Slovène              |
| `sv-SE` | Svenska              | Suédois              |
| `tr-TR` | Türkçe               | Turc                 |
| `ru-RU` | Русский              | Russe                |
| `uk-UA` | Українська           | Ukrainien            |
| `he-IL` | עברית                | Hébreu               |
| `ar-SA` | العربية              | Arabe                |
| `fa-IR` | فارسی                | Persan               |
| `ja-JP` | 日本語               | Japonais             |
| `zh-CN` | 简体中文             | Chinois simplifié    |
| `zh-TW` | 繁體中文             | Chinois traditionnel |
| `ko-KR` | 한국어               | Coréen               |

### setLocale {#setlocale}

Définit la langue d’affichage : `'system'` ou l’un des codes ci-dessus. Tout le reste, comme un simple `'ko'`, un code inconnu ou une valeur qui n’est pas une chaîne, est ignoré sans erreur.  
Il s’applique avant de rendre la main, si bien qu’une langue définie avant que l’élément soit ajouté figure dès sa première image.  
Il n’émet rien, ni `changeLocale` ni `change`, et ne touche ni à `value`, ni à l’historique d’annulation, ni à un store partagé.  
Le choix reste, que `enableLocalePicker` soit activé ou désactivé, et `setLocale('system')` suit aussi le système lorsque le sélecteur est désactivé.  
L’éditeur ne stocke rien. Pour conserver le choix d’un lecteur, écoutez [changeLocale](#changelocale) et repassez ce choix au chargement suivant.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Nomme la langue que représente `'system'`, sous forme d’étiquette BCP 47, pour un hôte qui a sa propre langue d’affichage. Les hôtes VS Code, JetBrains et Obsidian l’appellent avec leur propre langue d’affichage.  
Les espaces de début et de fin de l’étiquette sont supprimés. `null`, une chaîne vide ou une valeur qui n’est pas une chaîne revient au `navigator.languages` du navigateur, que l’éditeur suit au fil de ses changements.  
Il ne compte que tant que l’option en vigueur est `'system'`, et il s’applique immédiatement. La ligne `System` du sélecteur nomme la langue obtenue.  
L’étiquette, ou chacune des langues du navigateur dans l’ordre, se résout en la première langue que propose l’éditeur, d’après sa sous-étiquette de langue, sans tenir compte de la casse ni des traits de soulignement : `de-AT` donne `de-DE` et `en-GB` donne `en`. Le chinois se résout d’après son écriture, `Hant` donnant `zh-TW` et `Hans` donnant `zh-CN`, et, sans écriture, d’après la région, `TW`, `HK` et `MO` donnant `zh-TW` et toute autre région `zh-CN`. `pt` donne `pt-BR` sauf si une région autre que `BR` est indiquée. Lorsque rien ne correspond, l’éditeur affiche l’anglais.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Charge un fichier Schéma SQL.  
Par défaut, il remplace le document actuel au lieu d’y fusionner le fichier ; voir `mode` ci-dessous. Les paramètres que vous avez déjà sont conservés, y compris chaque verrou et sa valeur verrouillée, à l’exception de la position de la vue et du niveau de zoom, et les tables sont placées une fois le fichier lu, en lignes sauf si `placement` ci-dessous demande autre chose. Avec `Viewport` verrouillé, `value` écrit alors la vue sur laquelle démarre l’importation, l’origine `0, 0` au niveau de zoom `1`. Un document importé dans un élément qui n’a jamais reçu de valeur a donc tous ses verrous activés, comme un nouveau document.  
Il est enregistré dans l’historique, ce qui permet `Undo, Redo`, et il émet `change`. Une chaîne vide est ignorée, et l’appel ne fait rien tant que `readonly` est défini.  
`setSchemaGraphQL`, `setSchemaDBML` et `setSchemaAML` se comportent de la même façon, et leurs analyseurs n’échouent jamais : un texte qu’ils ne peuvent pas lire charge un document vide au lieu de lever une erreur.  
Depuis la version `4.0.0`, les quatre acceptent un second argument facultatif, `{ placement, mode }` :

- `placement: 'grid'`, la valeur par défaut, place immédiatement les tables en lignes, comme auparavant, et l’appel ne renvoie rien.
- `placement: 'auto'` dispose d’abord les tables selon leurs relations, comme le fait `Import` dans l’éditeur, et renvoie une `Promise` qui se résout une fois l’importation appliquée en une seule étape d’annulation. Moins de deux tables, aucune relation, une disposition qui échoue, une page sans `SharedWorker` ou `Cancel` sur la notification `Placing tables` les place plutôt en lignes. Un chargement entre-temps (une autre importation qui remplace, l’affectation de `value`, `setInitialValue()`, `clear()`, le chargement d’un collaborateur, ou l’annulation ou le rétablissement d’un chargement ou de `clear()`) prend le pas sur elle, et la `Promise` se résout sans que rien n’ait été chargé. Les importations placées de cette façon s’appliquent dans l’ordre où elles ont commencé.
- `mode: 'replace'`, la valeur par défaut, remplace le document. `mode: 'append'` ajoute le fichier sous le diagramme comme le fait [Importer et ajouter](../guide/guides/file-import-export.md#import-and-add), en laissant telles quelles toutes les tables déjà présentes, ainsi que tous les paramètres à l’exception de l’onglet et de la position de la vue. Depuis un autre onglet, l’onglet ERD s’affiche d’abord. Les nouvelles tables, et les groupes de tables qu’apporte un fichier DBML lorsque les groupes de tables sont affichés, deviennent la sélection, et la vue défile jusqu’à eux, sauf s’ils sont déjà bien visibles, selon la règle que suit chaque saut depuis la version `4.1.0` (voir [Où aboutit un saut](../guide/guides/table-related-functions.md#where-a-jump-lands)). Une seule annulation supprime tout l’ajout. Un texte qu’il ne peut pas lire n’ajoute rien et laisse le document tel quel.

Tant que `readonly` est défini, un remplacement est ignoré, un ajout n’ajoute rien et un appel avec `placement: 'auto'` se résout immédiatement.  
Depuis la version `3.10.0`, `setSchemaSQL` lit le fichier selon la base de données actuelle du document : avec Databricks sélectionné, les chaînes entre apostrophes suivent les échappements par barre oblique inverse de Spark. Voir [Commentaires](../guide/guides/file-import-export.md#comments).  
Depuis la version `3.10.0`, `setSchemaSQL` lit un `UNIQUE` portant sur deux colonnes ou plus comme un seul index unique plutôt que comme un indicateur Unique sur chaque colonne. Voir [Clés uniques et index](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
Depuis la version `3.10.0`, les importations SQL, DBML et AML conservent les actions `ON DELETE` et `ON UPDATE` des clés étrangères qu’elles lisent.  
Depuis la version `4.0.0`, `setSchemaSQL` conserve l’expression `DEFAULT` complète d’une colonne, lit les `ADD DEFAULT … FOR` de SQL Server et ses commentaires `MS_Description`, transforme les colonnes serial et identity de PostgreSQL en auto-incrément, conserve `UNSIGNED` et `ZEROFILL` dans un type de données, et lit une clé primaire qu’`ALTER TABLE … ADD PRIMARY KEY` marque `CLUSTERED`, `NONCLUSTERED` ou `USING BTREE`. Voir [Schéma SQL](../guide/guides/file-import-export.md#schema-sql).  
Pour la syntaxe qu’accepte chaque analyseur, voir [Importer ou exporter des fichiers](../guide/guides/file-import-export.md).

```ts
type SetSchema = {
  (
    value: string,
    options: { placement: 'auto'; mode?: 'replace' | 'append' }
  ): Promise<void>;
  (
    value: string,
    options?: { placement?: 'grid'; mode?: 'replace' | 'append' }
  ): void;
};

// example
editor.setSchemaSQL('Schema SQL...');
// or
await editor.setSchemaSQL('Schema SQL...', { placement: 'auto' });
// or
editor.setSchemaSQL('Schema SQL...', { mode: 'append' });
```

## setSchemaGraphQL {#setschemagraphql}

Charge un document GraphQL SDL.  
Les définitions de types objet deviennent des tables, et un champ dont le type est une autre table devient une relation.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Charge un fichier DBML, le format utilisé par dbdiagram.io et dbdocs.  
Depuis la version `4.0.0`, chaque `TableGroup` devient un [groupe de tables](../guide/guides/table-groups.md), et le `headercolor` d’une table devient sa couleur. Voir [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Charge un fichier AML (Azimutt Markup Language). La syntaxe actuelle comme l’ancienne syntaxe v1 sont acceptées.  
Depuis la version `4.0.0`, la couleur d’une entité, l’un des noms de couleur d’Azimutt ou une valeur hexadécimale entre guillemets, devient la couleur de sa table. Voir [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

Depuis la version `4.0.0`, charge un document `.erd.json`, comme le texte que renvoie [value](#value).  
Dans son `mode: 'replace'` par défaut, il charge le document comme le fait l’affectation de `value` : il est enregistré dans l’historique, émet `change` et prend les verrous du document de la même façon. Contrairement à `value`, une chaîne vide ou une valeur qui n’est pas une chaîne est ignorée au lieu de créer un nouveau document. Un texte qui n’est pas du JSON vide le document, comme avec `value`.  
`mode: 'append'` ajoute les tables, relations, index, mémos et groupes de tables du document sous le diagramme avec de nouveaux identifiants, en conservant leurs positions les uns par rapport aux autres et en laissant de côté les paramètres du document, comme le fait [Importer et ajouter](../guide/guides/file-import-export.md#import-and-add) avec un fichier `json`. Un texte qu’il ne peut pas lire, ou un document sans table ni mémo, n’ajoute rien. Sinon, il s’applique comme un ajout de [setSchemaSQL](#setschemasql), ses nouveaux mémos et groupes de tables étant sélectionnés avec ses tables, chaque type tant qu’il est affiché.  
Il rend la main une fois le document appliqué, et il est ignoré tant que `readonly` est défini.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporte l’état actuel de l’éditeur en Schéma SQL.  
Si `databaseVendor` n’est pas indiqué, il s’appuie sur le SGBD actuellement défini. Un nom qui ne figure pas dans la liste ci-dessous est traité de la même façon, sans lever d’erreur.  
Les noms sont délimités avec le type de délimiteur qu’affiche l’éditeur. Tant que `Bracket Type` est [verrouillé](../guide/guides/settings.md#lock), il peut différer de celui qu’enregistre `value`, qui est celui avec lequel délimite le [`erd_read`](../mcp/tools.md#reading-a-document) d’un agent de codage.  
Depuis la version `4.0.0`, un argument facultatif `options` choisit les instructions et l’en-tête, comme le font les options de l’onglet [Schéma SQL](../guide/guides/schema-sql.md). `SchemaSQLOptions` est exporté en tant que type.

- `statements` : `'create'`, la valeur par défaut ; `'ifNotExists'`, qui écrit `IF NOT EXISTS` sur MySQL, MariaDB, PostgreSQL, SQLite et Databricks et se rabat sur `'create'` ailleurs ; ou `'recreate'`, qui supprime les tables avant de les créer, Snowflake écrivant plutôt `CREATE OR REPLACE TABLE`.
- `header` : `'none'`, la valeur par défaut ; `'use'`, qui bascule vers la base de données ou le schéma du document ; ou `'createAndUse'`, qui crée d’abord la base de données ou le schéma s’il n’existe pas, puis bascule vers celui-ci. Une base de données dépourvue de l’option demandée se rabat comme le fait l’onglet : Oracle écrit `'use'` pour `'createAndUse'`, PostgreSQL n’écrit aucun en-tête pour `'use'`, et SQLite n’en écrit aucun. Un en-tête n’est écrit que si le nom de base de données du document est un identifiant simple : lettres ASCII, chiffres et `_`, sans commencer par un chiffre.

Une option omise, ou dont la valeur est inconnue, est lue comme sa valeur par défaut : un appel sans options écrit donc de simples instructions `CREATE` sans en-tête, comme auparavant.  
Depuis la version `4.0.0`, la sortie inclut toujours les scripts `Before tables` et `After tables` du document, dans l’ordre suivant : en-tête, script avant les tables, instructions de suppression, tables, script après les tables. Les choix `Statements`, `Header` et `Tables` propres à l’onglet Schéma SQL n’affectent jamais cet appel, qui écrit toujours le document entier.  
Depuis la version `3.10.0`, chaque clé étrangère porte les clauses `ON DELETE` et `ON UPDATE` de la relation. Une clause n’est écrite que si son action est définie et que le SGBD l’accepte : une action que ce SGBD ne prend pas en charge est donc omise, et sa valeur par défaut s’applique. Depuis la version `4.0.0`, Snowflake n’accepte que `NO ACTION`. Pour ce qu’écrit chaque base de données, voir [ON DELETE et ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update).  
Depuis la version `3.10.0`, une apostrophe dans un commentaire de table ou de colonne est échappée, si bien qu’un commentaire comme `it's` ne casse plus l’instruction. Chaque SGBD qui écrit les commentaires sous forme de littéraux de chaîne la double, sauf Databricks, qui place une barre oblique inverse avant chaque apostrophe et chaque barre oblique inverse. SQLite écrit toujours les commentaires sous forme de lignes `--`.  
Depuis la version `4.0.0`, plusieurs bases de données écrivent aussi différemment les noms de clés, les valeurs par défaut et l’auto-incrément. Voir [Ce qu’écrit le DDL](../guide/guides/schema-sql.md#what-the-ddl-writes).

```ts
type DatabaseVendor =
  | 'Databricks'
  | 'MariaDB'
  | 'MSSQL'
  | 'MySQL'
  | 'Oracle'
  | 'PostgreSQL'
  | 'Snowflake'
  | 'SQLite';

type SchemaSQLOptions = {
  statements?: 'create' | 'ifNotExists' | 'recreate';
  header?: 'none' | 'use' | 'createAndUse';
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
```

## getSharedStore {#getsharedstore}

Renvoie un store pour l’édition collaborative en temps réel.  
`config` vaut `{ getNickname?, mouseTracker?, focusTracker? }`. Les deux options de suivi valent `true` par défaut : `mouseTracker` diffuse le curseur de cet éditeur aux autres, et `focusTracker` diffuse sa cellule active, sa sélection et son rectangle de sélection.  
Voir [Édition collaborative](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Ouvre la visionneuse de différences, qui compare le document actuellement ouvert à celui que vous passez.  
Il ne renvoie rien et ne modifie pas le document : fermer la visionneuse laisse donc l’éditeur exactement tel qu’il était.  
Une valeur vide, ou tout ce qui n’est pas une chaîne, est comparée à un document vide.  
Il s’agit de la même vue superposée que [Visionneuse de différences](../guide/guides/table-related-functions.md#diff-viewer) dans le menu contextuel du canevas.  
Depuis la version `4.1.0`, il apparie le contenu des deux documents d’abord par identifiant, et seulement ensuite par ce que chaque élément contient, comme le nom d’une table ou le texte d’un mémo (voir [Ce qui est comparé](../guide/guides/table-related-functions.md#what-is-compared)). Face à une version antérieure du même document, comme une révision Git de son fichier, un renommage apparaît donc comme un seul élément renommé ; face à un document dont les identifiants diffèrent, il apparaît comme une suppression et un ajout. La visionneuse liste les modifications dans une arborescence à côté des deux documents et marque les changements en couleur au lieu de remplir les cellules.

```js
editor.setDiffValue('prev json...');
```
