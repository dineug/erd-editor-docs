---
sidebar_position: 2
description: A API do elemento erd-editor — como registá-lo, atributos, value e runtimeValue, eventos, temas, idioma de apresentação, o ecrã de boas-vindas, combinações de teclas e importação e exportação de esquemas.
---

# ErdEditorElement

O editor é um simples `HTMLElement`, a etiqueta `<erd-editor>` que a importação de `@dineug/erd-editor/erd-editor.js` define.  
A partir da `5.0.0`, importar a raiz do pacote não define nenhuma etiqueta. A raiz exporta `ErdEditorElement` como o tipo e como a classe do elemento, e `defineErdEditor()`, que define a etiqueta onde a chamar — consulte [Registar os elementos](./installation.md#registering-the-elements).  
Para uma página que apenas mostra um diagrama, [`<erd-viewer>`](./erd-viewer-element.md) é um elemento só de leitura à parte.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

A sua definição de tipo é a seguinte.

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

O editor é renderizado num shadow root fechado, pelo que `editor.shadowRoot` é `null` e os estilos da página não entram nem saem.  
Nada no seu interior pode ser alcançado com um seletor — em vez disso, aplique estilos através de [setTheme](#settheme) e das propriedades personalizadas `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` e `enable-welcome-screen` são os únicos atributos, e os cinco têm `false` como predefinição. Os dois últimos são novos na `4.0.0`. Cada um lê o seu valor como descrito em [readonly](#readonly).

A partir da `4.1.0`, o separador ERD tem um [explorador](../guide/guides/explorer.md), uma árvore do diagrama ancorada à esquerda da tela, com Localizar e substituir no topo. Nenhum atributo, propriedade, método ou evento o abre, o fecha ou indica o seu estado: abre-se a partir do botão `Explorer` da barra de ferramentas, da entrada `Toggle Explorer` na pesquisa rápida ou no menu de contexto da tela, ou com a associação [`findReplace`](#setkeybindingmap).  
Todos os elementos começam com o explorador fechado. O seu estado aberto ou fechado, a sua largura, o que tem recolhido e a sua pesquisa duram tanto como o elemento, ao longo das mudanças de separador e de todos os carregamentos, `setInitialValue` incluído, e nunca ficam em `value`, em `runtimeValue`, no histórico de anulação nem num armazenamento partilhado.

A partir da `4.2.0`, as tabelas e as colunas podem ter [nomes lógicos](../guide/guides/logical-names.md) ao lado dos seus nomes, e a vista de nomes, uma definição do documento tal como o separador, decide se a tela desenha os seus nomes, os seus nomes lógicos ou ambos.  
A barra de ferramentas também tem um separador [Dicionário](../guide/guides/dictionary.md), entre `Code Generator` e `Settings`, que contém as palavras, os termos e os domínios do documento e uma folha `Checks`. É um separador como os outros: o seu `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, é abrangido pelo bloqueio `Canvas Type`, pelo que um texto guardado nele se abre nele através de [setInitialValue](#setinitialvalue), e uma mudança para ele é escrita em `value` e emite [change](#change) apenas enquanto esse bloqueio está desativado. Nenhum atributo, propriedade, método ou evento próprio o abre nem indica o seu estado. As suas edições são alterações do documento: ficam em `value`, emitem [change](#change) e chegam aos colaboradores, mas anulam-se e refazem-se no histórico próprio de cada folha, e não no do documento.  
O estado próprio do separador — a folha mostrada, `Domains` de início, e a pesquisa, a seleção, o deslocamento e as larguras das colunas de cada folha — dura tanto como o elemento, ao longo das mudanças de separador e de todos os carregamentos, e nunca fica em `value`, em `runtimeValue`, num histórico de anulação nem num armazenamento partilhado.  
A interface `ErdEditorElement` não ganha nenhum membro. O que a API acrescenta é `logicalNameAsComment` nas opções de [getSchemaSQL](#getschemasql), doze [tokens de tema](#settheme) e a exportação [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Define a capacidade de edição do editor.  
Enquanto estiver definido, a atribuição de `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, anular e refazer, incluindo, a partir da `4.2.0`, os de uma folha do separador Dicionário, são todos ignorados, e o evento `change` nunca é emitido. Em vez disso, carregue um documento com [setInitialValue](#setinitialvalue).  
A partir da `5.0.0`, um editor só de leitura é um leitor, e não um editor com os controlos desativados. Mantém os seus seis separadores, o [explorador](../guide/guides/explorer.md#read-only-editors), o minimapa, a pesquisa rápida, as Propriedades da tabela, o [visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer), `Export`, o modo zen e os cursores, o foco e as seleções dos colaboradores, e todos os controlos que editariam o diagrama são omitidos em vez de desenhados desativados. Antes da `5.0.0`, muitos dos seus controlos de edição ainda eram desenhados, e o editor descartava o que eles enviavam.

No separador ERD, um arrastamento desloca a vista seja onde for que comece, numa tabela também, e uma pressão não seleciona, não move nem abre nada. O ponteiro pousado numa tabela ilumina as suas relações, um clique parado numa tabela ou numa relação mantém essa iluminação, e um clique parado em qualquer outro sítio apaga-a, como no [`<erd-viewer>`](./erd-viewer-element.md). A única seleção é o contorno que um salto deixa: ir para uma linha do explorador, para uma das suas correspondências de Localizar ou para um resultado da pesquisa rápida depois de `#`, `@` ou `:` seleciona o que alcança, e o clique parado seguinte limpa-o. Copiar copia o que essa seleção contém.  
A [barra de ferramentas da tela](../guide/guides/table-related-functions.md#canvas-toolbar) mantém `Zoom out`, o nível de zoom (`Reset zoom`), `Zoom in`, a lista da vista de nomes, `Zen Mode` e a bússola, sem `Hand` nem `Select`, sem `New Table`, `New Memo` nem `New Table Group` e sem botões de relações. O menu da tela mantém `View Option`, `Name View`, `Export` e `Diff Viewer`, o menu da tabela mantém `Table Properties`, e uma nota, uma relação ou um grupo de tabelas não abre nenhum menu. A pesquisa rápida no separador ERD não lista nenhuma linha que escreva no diagrama: mantém `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, as linhas `Theme` e `Display Language` que [enableThemeBuilder](#enablethemebuilder) e [enableLocalePicker](#enablelocalepicker) ativam e as pesquisas `#`, `@` e `:`. Nos outros separadores lista o que lista num editor editável. A barra de ferramentas mostra o nome da base de dados como texto e nenhum botão `Undo`, `Redo` ou `Time Travel`.  
Nada oferece `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, uma linha de grupo de tabelas (consulte [Grupos de tabelas](../guide/guides/table-groups.md#read-only-editors)) nem [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), e nenhum [ecrã de boas-vindas](#enablewelcomescreen) é mostrado.  
As associações que adicionam, removem ou editam não fazem nada: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, as quatro associações de relações e `handTool`, cada uma continuando a ser impedida conforme a sua opção indica. Uma colagem e `Tab` também não fazem nada e chegam à página sem serem impedidos. As associações de zoom, `zenMode`, `focusView`, `tableProperties` na tabela que um salto selecionou, `search`, `findReplace`, copiar, `Escape` e as teclas de seta continuam a funcionar. Nenhum editor de célula, de nome de nota ou de nome de grupo de tabelas se abre, e nenhuma relação é desenhada.

[Localizar e substituir](../guide/guides/find-and-replace.md#read-only-editors), no topo do explorador, apenas localiza, sem a seta `Toggle Replace` nem a linha Substituir. O painel tem o título `Explorer`, e a dica do botão da barra de ferramentas é `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac) em todos os editores. O explorador abre-se num editor só de leitura desde a `4.1.0`; da `3.10.0` à `4.0.0`, Localizar e substituir abria-se aí como um painel flutuante só de localização com o título `Find`.  
O painel Propriedades da tabela abre-se a partir do menu da tabela ou da associação `tableProperties` e, a partir da `3.10.0`, mostra um distintivo `Read only` ao lado do título, e o seu separador `Indexes` não permite edições — consulte [Propriedades da tabela](../guide/guides/table-related-functions.md#table-properties).  
O separador Definições tem o mesmo distintivo `Read only` e mostra todas as definições num controlo que não aceita pressão: os seus dois interruptores, o campo `Maximum comment width` e os sete botões `Lock` estão desativados, e as linhas de `Column Order` não se arrastam. Os scripts `Before tables` e `After tables` do separador Esquema SQL não aceitam escrita. O separador [Visualização](../guide/guides/visualization.md) funciona como num editor editável, uma vez que nada aí edita o documento; no Flow, `Previous table` e `Next table` continuam a percorrer as tabelas passo a passo, com os seus botões ou com as teclas de anular e refazer.  
O separador [Dicionário](../guide/guides/dictionary.md#read-only-editors) continua a abrir-se: é possível mudar de folha, pesquisar, selecionar, deslocar e copiar nas suas folhas, e uma linha da folha `Checks` continua a levar ao que indica. Nenhuma célula aceita uma edição, uma colagem nem uma limpeza, o separador não mostra as ferramentas `Add Row`, `Delete Rows`, `Import CSV` nem `Export CSV` nem nenhum menu na grelha, e as suas combinações de teclas para linhas não inserem nem eliminam nada. O menu da tabela, o menu da tela e a pesquisa rápida não oferecem as opções [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) nem `Derive Physical Name Again`.

A partir da `5.0.0`, as definições que um leitor ainda pode alterar ficam no ecrã desse editor: o deslocamento e o zoom, o separador, a base de dados, a linguagem do Gerador de código, os dois formatos do nome, o tipo de delimitador, as linhas de `View Option` e a [vista de nomes](../guide/guides/logical-names.md#read-only-editors) a partir de cada um dos seus seletores, que fica no ecrã desde a `4.2.0`. Digam o que disserem os respetivos [bloqueios](../guide/guides/settings.md#lock), nenhuma delas chega a `value`, `runtimeValue`, à exportação `json`, ao histórico de anulação, ao evento [change](#change) nem a um armazenamento partilhado, pelo que `value` mantém as definições do documento, seja qual for a forma como o leitor o vê. Os painéis de opções do [Esquema SQL](../guide/guides/schema-sql.md#read-only-editors) e do Gerador de código legendam essas definições como `This window only` enquanto `readonly` está definido, onde num editor editável se lê `Saved in the document`. O que os dois separadores mostram, copiam e guardam segue o ecrã, e o mesmo acontece com [getSchemaSQL](#getschemasql) chamado sem uma base de dados.  
Antes da `5.0.0`, o deslocamento, o zoom, a mudança de separador, a base de dados e as definições de código de um leitor iam para `value` enquanto nenhum bloqueio os retivesse, o que a base de dados nunca tem, e um armazenamento partilhado enviava-os aos outros editores.  
As escolhas `This window only` do próprio separador Esquema SQL, `Statements`, `Header`, a partir da `4.2.0` `Write logical names into empty comments`, e `Tables`, nunca são guardadas em nenhum editor e continuam a aplicar-se, e o mesmo acontece com a caixa de diálogo [`Export image`](../guide/guides/file-import-export.md#image), o criador de temas e o seletor de idioma. Uma escolha no criador de temas ou no seletor de idioma continua a emitir [changePresetTheme](#changepresettheme) ou [changeLocale](#changelocale).

Enquanto estiver definido, nada entra no histórico de anulação, nem sequer um deslocamento ou um zoom, e um [armazenamento partilhado](#getsharedstore) do editor não envia nenhuma alteração: apenas o que os seus rastreadores enviam do cursor, do foco, da seleção e da caixa de arrastamento do leitor, e os registos que outro editor pede quando se junta (consulte [Edição colaborativa](./advanced/collaborative-editing.md)). Continua a aplicar todas as alterações que os outros enviam. Uma alteração da base de dados, de uma definição do Gerador de código ou de uma linha de `View Option` chega ao documento, e também ao ecrã, a menos que o leitor tenha alterado essa definição aí, e uma mudança partilhada da vista de nomes aparece no ecrã em qualquer caso.

Ao ativá-lo, termina o que estava aberto: um editor de célula, de nome de nota ou de nome de grupo de tabelas, uma relação a ser desenhada, um arrastamento de uma tabela, de uma nota, de um grupo de tabelas ou de uma coluna, as cópias de um arrastamento com Alt, o redimensionamento de uma nota ou de um grupo de tabelas, uma pré-visualização ou colocação de Auto Layout ainda em curso, `Map Columns`, Time Travel e o seletor de cores. Limpa a seleção, pousa a ferramenta mão e envia primeiro o que cada armazenamento partilhado ainda retém de um arrastamento ou de um deslocamento, como o faz [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). As Propriedades da tabela, agora só de leitura, o visualizador de diferenças e a caixa de diálogo `Export image` ficam abertos, e o deslocamento, o zoom, o separador e a vista de nomes ficam como estavam. Um elemento que já é só de leitura quando é montado pela primeira vez começa da mesma forma, e um que um host move na página mantém o contorno que um salto deixou.  
Ao desativá-lo, os controlos de edição regressam sem nada selecionado nem aberto. A base de dados, a linguagem do Gerador de código, os dois formatos do nome, o tipo de delimitador e as linhas de `View Option` voltam aos do documento, enquanto o deslocamento, o zoom, o separador e a vista de nomes ficam onde o leitor os deixou e `value` mantém os do documento até o leitor voltar a alterá-los. Nenhuma das duas passagens emite `change`.  
Um atributo sem valor, `=""` e `="true"` são todos lidos como `true`. `="false"` é lido como `false`, tal como qualquer outra cadeia — incluindo a expressão idiomática HTML `readonly="readonly"`.

```js
editor.readonly = true;
// or
editor.setAttribute('readonly', 'true');
```

```html
<erd-editor readonly></erd-editor>
```

## systemDarkMode {#systemdarkmode}

Determina se o editor se sincroniza automaticamente com o modo escuro/claro do sistema.  
A partir da `4.0.0`, ativá-lo define o `appearance` do tema como `'system'`, tal como `setPresetTheme({ appearance: 'system' })`. O editor passa então a mostrar o claro ou o escuro que o sistema operativo indica, ou o que [setSystemAppearance](#setsystemappearance) indicar, e muda quando esse valor muda.  
Uma chamada posterior a [setPresetTheme](#setpresettheme) com `'light'` ou `'dark'`, ou a escolha de `Light` ou `Dark` no criador de temas ou na pesquisa rápida, substitui `'system'` e mantém-se: a mudança seguinte do sistema operativo já não a substitui, embora `systemDarkMode` continue a ser `true`. Antes da `4.0.0`, a mudança seguinte do sistema operativo substituía-a.  
Desativá-lo enquanto o aspeto é `'system'` mantém o claro ou o escuro mostrado nesse momento. Desativá-lo depois de o aspeto ter deixado de ser `'system'` deixa-o como está.  
Alterá-lo não emite nenhum evento.

```js
editor.systemDarkMode = true;
// or
editor.setAttribute('system-dark-mode', 'true');
```

```html
<erd-editor system-dark-mode></erd-editor>
```

## enableThemeBuilder {#enablethemebuilder}

Determina se é fornecida uma interface para definir facilmente temas predefinidos.  
Mostra o botão `Theme` da barra de ferramentas, que abre o criador de temas com os campos `Accent color`, `Gray color` e `Appearance`. A partir da `4.0.0`, a opção `Appearance` oferece `System` além de `Light` e `Dark` e, enquanto esta propriedade está ativada, a pesquisa rápida apresenta a entrada `Theme` com `System`, `Light` e `Dark`. Consulte [Idioma e tema](../guide/guides/language-and-theme.md).

![Abertura do criador de temas a partir da barra de ferramentas, escolha da cor de destaque e do tom de cinzento e mudança do aspeto para Light e depois para System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Mudar o tema predefinido a partir deste painel, ou da pesquisa rápida, emite o evento [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

A partir da `4.0.0`, determina se é fornecida uma interface para escolher o idioma de apresentação do editor.  
Mostra o botão `Display Language` da barra de ferramentas, a seguir ao botão `Theme` quando ambos são mostrados. O botão abre o seletor de idioma, e a pesquisa rápida apresenta a entrada `Display Language`. Ambos oferecem `System` e os 25 idiomas — consulte [Idioma e tema](../guide/guides/language-and-theme.md).  
Também decide o que um editor mostra antes de [setLocale](#setlocale) ser chamado ou de um idioma ser escolhido: `'system'` enquanto está ativado, inglês enquanto está desativado, pelo que um elemento que não configura nada mantém o inglês que sempre mostrou. Ativá-lo ou desativá-lo alterna de imediato entre os dois. Depois de um idioma ter sido definido ou escolhido, essa escolha mantém-se, esteja ele ativado ou desativado.  
Defina-o antes de o elemento ser anexado para que o primeiro fotograma siga `'system'`.  
Uma escolha emite [changeLocale](#changelocale).

```js
editor.enableLocalePicker = true;
// or
editor.setAttribute('enable-locale-picker', 'true');
```

```html
<erd-editor enable-locale-picker></erd-editor>
```

## enableWelcomeScreen {#enablewelcomescreen}

A partir da `4.0.0`, determina se um diagrama vazio recebe o leitor com o [ecrã de boas-vindas](../guide/guides/editing-start.md#welcome-screen).  
Fica sobre o separador ERD enquanto o documento não tem nenhuma tabela, nenhuma nota visível e nenhum grupo de tabelas visível. Não é mostrado enquanto `readonly` está definido, no modo zen ou enquanto o painel Propriedades da tabela, o visualizador de diferenças, a viagem no tempo ou a pré-visualização da disposição automática estão abertos. A primeira tabela, nota visível ou grupo de tabelas visível fá-lo desaparecer, e uma anulação que regresse a um diagrama vazio volta a mostrá-lo.  
As suas linhas `New Table`, `New Memo` e `Command Palette` mostram a primeira combinação de `addTable`, `addMemo` e `search` tal como [setKeyBindingMap](#setkeybindingmap) as deixou, e nenhuma para um nome deixado vazio. As suas setas apontam para os botões `Theme` e `Display Language` apenas onde `enableThemeBuilder` e `enableLocalePicker` os mostram.  
No seu menu, `↑`, `↓`, `Home` e `End` percorrem as linhas, com a ação predefinida cancelada e a propagação interrompida. `Enter` e `Space` têm a propagação interrompida, mas não a ação predefinida cancelada, pelo que a linha com o foco os recebe, e `Escape` nos formatos de `Import` volta atrás, com a ação predefinida cancelada e a propagação interrompida. Todas as outras teclas chegam ao editor e à página como habitualmente.  
Não altera nada no documento, pelo que deixa `value` como estava e não emite nenhum `change`.  
Ative-o depois de [setInitialValue](#setinitialvalue) ter carregado o documento, como fazem os hosts oficiais, para que o ecrã nunca apareça momentaneamente sobre um ficheiro que ainda está a carregar.

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

Obtém o documento atual como uma cadeia JSON, no [esquema](./advanced/schema.md) que o editor define.  
A partir da `4.0.0`, é a forma de armazenamento, o documento tal como um ficheiro o guarda, que é também o que a exportação `json` escreve e o que os hosts oficiais guardam. Contém apenas as entidades existentes, sem as removidas, sem a ordem de sobreposição e sem o que o editor calcula por si, como as larguras medidas, as marcas de chave e as âncoras das relações. As chaves das suas entidades seguem uma ordem fixa, está indentado com dois espaços e termina com uma quebra de linha, pelo que o mesmo documento dá sempre os mesmos bytes.  
A partir da `4.2.0`, também deixa de fora o que está vazio: uma lista `doc` vazia, uma coleção vazia, uma linha de dicionário que não contém nada e um campo de texto vazio de uma entidade, como um nome, um comentário, um tipo de dados, um valor predefinido ou uma cor. Uma lista dentro de uma entidade, como os `columnIds` de uma tabela, continua a ser escrita quando está vazia. O `doc` de um documento novo é `{}` e não tem `collections`, por isso leia um campo, uma lista ou uma coleção em falta como vazios. Contém os nomes lógicos e os sinalizadores de nome derivado das tabelas e das colunas, os vínculos das colunas aos domínios e as palavras, os termos e os domínios, sendo cada dicionário escrito como um cabeçalho de nomes de campos seguido das suas linhas, uma linha de dados por linha de texto, pela ordem da folha. Consulte [Forma de armazenamento e valor em tempo de execução](./advanced/schema.md#storage-form-and-runtime-value).  
Cada definição cujo [bloqueio](../guide/guides/settings.md#lock) está ativado é escrita com o valor em que está bloqueada, e não como o ecrã a mostra. O bloqueio `Viewport` abrange `originX`, `originY` e `zoomLevel`, e os bloqueios `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` e, a partir da `4.2.0`, `Name View` abrangem cada um a sua própria definição. A vista de nomes é escrita como `nameViewMode`, e apenas enquanto não for `'physical'`. Todas as outras definições são escritas tal como estão, e `lockSettings` é sempre escrito. Consulte [Definições](./advanced/schema.md#settings) para conhecer os bits; o bit do bloqueio `Name View` lê-se ao contrário.  
A partir da `5.0.0`, as definições que o leitor de um editor [só de leitura](#readonly) altera são também escritas com os valores do documento, bloqueadas ou não, uma vez que ficam nesse ecrã.  
Um documento novo tem todos os bloqueios ativados, quer seja o que um elemento mostra antes de lhe ser atribuído um valor, quer seja um carregado a partir de um valor em branco. O seu `value` mantém a origem em `0, 0`, o nível de zoom em `1`, o separador ERD, a linguagem do Gerador de código, os formatos dos nomes e o tipo de delimitador predefinidos e, a partir da `4.2.0`, a vista `Physical Names`, até que o bloqueio correspondente seja desativado.  
Antes da `4.0.0`, devolvia o documento inteiro tal como o editor o tinha, com `ignoreSaveSettings` aplicado. O documento tal como o editor o tem é agora [runtimeValue](#runtimevalue), e `ignoreSaveSettings` já não é lido nem escrito.

```js
const data = editor.value;
```

### setter {#setter}

Carrega um estado do editor guardado anteriormente. Substitui o documento inteiro — o atual é limpo primeiro. A partir da `4.2.0`, isso inclui as palavras, os termos e os domínios: o documento fica com os que o texto contém, ou com nenhum, e o histórico de anulação próprio de cada folha do separador Dicionário é esvaziado.  
Tal como `clear()`, `setInitialValue()` e os métodos `setSchema*` no seu `mode: 'replace'` predefinido, também descarta a vista Flow do separador Visualização: a sua disposição, as tabelas a que está restrita, a apresentação das linhas, o zoom e a deslocação da vista e, a partir da `4.2.0`, as tabelas que os seus botões `Previous table` e `Next table` percorrem. Uma adição (`mode: 'append'`) não a descarta.  
Fica registado na lista do histórico, o que permite `Undo, Redo`, e emite `change`.  
Aceita a forma de armazenamento, um [runtimeValue](#runtimevalue) ou um ficheiro guardado por uma versão anterior.  
Uma cadeia em branco, ou qualquer valor que não seja uma cadeia, carrega um documento novo em vez de gerar um erro, por isso valide o valor antes de o atribuir.  
Esse documento novo é o mesmo que `setInitialValue('')` inicia: vazio, com as definições predefinidas e, a partir da `4.0.0`, com todos os bloqueios ativados. Na `3.10.x`, não guardava nem a posição de deslocamento nem o nível de zoom, e antes disso guardava ambos.  
Um armazenamento partilhado retransmite esse carregamento aos colaboradores com o JSON completo do documento novo, pelo que todos os pares, incluindo um de uma versão mais antiga, o carregam, embora um editor anterior à `4.2.0` descarte o que não conhece, como os nomes lógicos, os vínculos aos domínios e os dicionários — consulte [Misturar versões](./advanced/collaborative-editing.md#mixing-releases).  
A partir da `4.0.0`, os bloqueios do documento carregado, e os valores bloqueados que `value` passa a escrever, vêm do texto, e a vista fica onde o texto a coloca, ou sobre o diagrama quando nenhuma parte dele está aí desenhada. Para cada uma das outras definições que o texto bloqueia — o separador, a linguagem do Gerador de código, os formatos dos nomes, o tipo de delimitador e, a partir da `4.2.0`, a vista de nomes — o editor continua a mostrar o que mostrava antes do carregamento. Uma definição que o texto deixa desbloqueada assume o valor do texto. Um ficheiro guardado antes da `4.2.0` não indica nenhum bloqueio `Name View`, a menos que um editor `4.2.0` tenha desativado esse bloqueio nele, pelo que se carrega com a vista de nomes bloqueada em `Physical Names`, e o editor mantém a vista de nomes que mostrava. Pelo contrário, [setInitialValue](#setinitialvalue) assume todos os valores que o texto contém; consulte também essa secção no caso de um texto que não indique nenhum bloqueio.  
Um texto que não seja JSON, como um ficheiro que ficou com marcadores de conflito de fusão, também não gera um erro: o documento é esvaziado, as suas definições ficam como estavam e o erro de análise é registado na consola.  
É ignorado enquanto `readonly` está definido; utilize [setInitialValue](#setinitialvalue) para carregar num editor só de leitura.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

A partir da `4.0.0`, obtém o documento tal como este editor o tem, como uma cadeia JSON. Não tem setter, pelo que atribuir-lhe um valor gera uma exceção em código no modo estrito.  
Inclui o que [value](#value) deixa de fora: as entidades removidas e a respetiva ordem, a ordem de sobreposição, as larguras medidas, as marcas de chave, as âncoras das relações e as sequências e, a partir da `4.2.0`, os campos de texto, as listas `doc` e as coleções vazios; as linhas removidas de uma folha do separador Dicionário e as que não contêm nada; a chave de ordenação de cada linha de dicionário; as listas `doc` de palavras, de termos e de domínios; e um vínculo a um domínio removido. Também aqui as definições bloqueadas são escritas com os seus valores bloqueados.  
Utilize-o para inicializar, através do respetivo [setInitialValue](#setinitialvalue), outro editor que se junta a uma sessão já em curso, como um colaborador ou uma segunda vista do mesmo documento. Uma anulação de uma remoção que a sessão envie mais tarde restaura então aí a entidade completa, enquanto um editor inicializado a partir de `value` não tem nenhuma entidade removida e restaura em vez disso uma tabela vazia e sem nome ou, a partir da `4.2.0`, uma linha de dicionário vazia. Consulte [Edição colaborativa](./advanced/collaborative-editing.md).  
Já nada recolhe as entidades removidas, pelo que permanecem nele até o documento voltar a ser aberto a partir do seu ficheiro.  
Nunca o escreva num ficheiro: guarde `value`, que o [JSON Schema](./advanced/schema.md#json-schema) aceita, ao contrário deste.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Carrega um estado do editor guardado anteriormente. O carregamento em si não fica registado na lista do histórico, pelo que não pode ser anulado, e não é emitido nenhum evento `change`.  
Também limpa o histórico de anulação, pelo que nada do que foi feito antes do carregamento pode ser anulado ou refeito sobre o documento carregado, e, a partir da `4.2.0`, limpa também o histórico próprio de cada folha do separador Dicionário.  
Aceita a forma de armazenamento, um [runtimeValue](#runtimevalue) ou um ficheiro guardado por uma versão anterior e, ao contrário da atribuição de `value`, assume todas as definições que o texto contém, incluindo o separador e as definições de código.  
Uma cadeia em branco, ou qualquer valor que não seja uma cadeia, carrega um documento novo em vez de gerar um erro, pelo que `setInitialValue('')` inicia um diagrama em branco.  
A partir da `4.0.0`, esse documento novo, que é também o que um elemento mostra antes de lhe ser atribuído qualquer valor, tem todos os bloqueios ativados. Deslocar, fazer zoom, mudar de separador e alterar a linguagem do Gerador de código, os formatos dos nomes, o tipo de delimitador ou, a partir da `4.2.0`, a vista de nomes deixam `value` como estava e não emitem nenhum `change`. Na `3.10.x`, não guardava nem a posição de deslocamento nem o nível de zoom, e antes disso guardava ambos.  
Um documento carregado a partir de texto mantém os bloqueios que indica. Um que não indique nenhum — qualquer ficheiro guardado antes da `4.0.0`, independentemente do que dizia o seu `ignoreSaveSettings`, e um ficheiro `.vuerd` v2 — abre-se com todos os bloqueios ativados, com a definição `Viewport` bloqueada na origem `0, 0` e no nível de zoom `1`, no separador ERD, e com a linguagem, os formatos dos nomes e o tipo de delimitador tal como os guardou.  
A partir da `4.2.0`, um texto que indica os seus bloqueios, mas não o bloqueio `Name View`, também se abre com esse bloqueio ativado, mesmo quando todos os outros bloqueios estão desativados. Um ficheiro guardado antes da `4.2.0` é um texto deste tipo, a menos que um editor `4.2.0` tenha desativado esse bloqueio nele (consulte [Definições](./advanced/schema.md#settings)). Abre-se na vista `Physical Names`, tal como um que não indica nenhum bloqueio.  
Em ambos os casos, a vista abre-se na vista do documento — a que o texto guardou quando indica os seus bloqueios, a origem `0, 0` com o nível de zoom `1` quando não indica nenhum — ou sobre o diagrama quando nenhuma parte dele está aí desenhada. Uma definição `Viewport` bloqueada continua a manter os seus valores bloqueados em `value`.  
A partir da `4.0.0`, também descarta o estado de colaboração do documento que tinha antes, e um [armazenamento partilhado](#getsharedstore) deste editor que já esteja subscrito volta a pedir o seu estado aos outros editores, pelo que um editor recarregado numa sessão em curso fica atualizado. Inicialize esse editor com o [runtimeValue](#runtimevalue) de outro editor.  
Um texto que não seja JSON também não gera um erro: o documento é esvaziado, as suas definições ficam como estavam e o erro de análise é registado na consola.  
Ao contrário da atribuição de `value`, não é bloqueado por `readonly`, pelo que é a forma de carregar um documento num editor só de leitura. Um editor só de leitura mostra então as definições que o texto carregado contém, descartando as que o seu leitor tinha alterado no ecrã.

```js
editor.setInitialValue('json...');
```

Carregar ao iniciar, guardar a cada alteração.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Eventos {#event}

`change`, `changePresetTheme` e `changeLocale` são os três únicos eventos públicos; `changeLocale` é novo na `4.0.0`.  
O elemento também despacha em si próprio eventos internos `@dineug/erd-editor/internal-*` para as suas próprias ligações internas; esses não fazem parte da API.

### change {#change}

Quando há alterações no editor, é emitido um evento.  
O evento tem um debounce de 200 ms e não é emitido enquanto `readonly` é `true`.  
É disparado por qualquer alteração do documento — uma edição na interface, a atribuição de `value`, `clear()`, cada um dos métodos `setSchema*` e, a partir da `4.0.0`, `setSchemaJSON()` e a opção `Import and Add`. `setInitialValue` não o emite.  
A partir da `4.2.0`, isso inclui cada edição no separador [Dicionário](../guide/guides/dictionary.md) e cada vez que uma delas é anulada ou refeita, uma alteração de um nome lógico ou de um vínculo a um domínio, a opção `Derive Physical Names Again` e uma mudança da vista de nomes enquanto o bloqueio `Name View` está desativado.  
Nada do que se faz no modo Flow do separador Visualização o emite — o zoom, a deslocação da vista, mover cartões, o botão `Tidy Up`, a apresentação das linhas, restringir a vista a partir de um cartão ou, a partir da `4.2.0`, percorrer as tabelas com `Previous table` e `Next table` ou com as teclas de anular e refazer — já que nada disso é uma alteração do documento. A sua lista `Name View` é a exceção: uma mudança aí emite-o enquanto o bloqueio `Name View` está desativado, tal como uma no separador ERD.  
A partir da `4.0.0`, uma alteração de uma definição cujo [bloqueio](../guide/guides/settings.md#lock) está ativado também não o emite, porque só altera o ecrã e nunca `value`: um deslocamento ou um zoom da tela ERD enquanto a definição `Viewport` está bloqueada, uma mudança de separador enquanto a definição `Canvas Type` está bloqueada, uma alteração da linguagem do Gerador de código, do formato do nome da tabela, do formato do nome da coluna ou do tipo de delimitador enquanto o respetivo bloqueio está ativado e, a partir da `4.2.0`, uma mudança da vista de nomes enquanto a definição `Name View` está bloqueada. Apenas essas alterações ficam de fora, pelo que um lote que também edita o documento continua a emiti-lo. Bloquear ou desbloquear uma definição emite-o.  
Todos os bloqueios estão ativados num documento novo e em qualquer ficheiro guardado antes da `4.0.0`, e o bloqueio `Name View` está ativado em qualquer ficheiro guardado antes da `4.2.0`, a menos que um editor `4.2.0` o tenha desativado nele, pelo que, por predefinição, deslocar, fazer zoom, mudar de separador e mudar a vista de nomes não emitem nada. Isto abrange focar em tabelas a partir do separador ERD, o botão de ligação externa do cartão que leva do Flow de volta ao separador ERD, ir para uma linha do explorador ou para uma correspondência da pesquisa, abrir o explorador ou ir para um resultado da pesquisa rápida a partir de outro separador e, a partir da `4.2.0`, ir para uma tabela ou uma coluna a partir de uma linha da folha `Checks` do separador Dicionário. Cada uma destas ações emite um `change` apenas enquanto o bloqueio que a abrange está desativado: `Canvas Type` para a mudança de separador e `Viewport` para o deslocamento que um botão do cartão, um resultado da pesquisa rápida, uma linha do explorador, uma correspondência da pesquisa ou uma linha de `Checks` também provocam. A partir da `4.1.0`, todos esses deslocamentos seguem uma única regra, [Onde termina um salto](../guide/guides/table-related-functions.md#where-a-jump-lands), pelo que um resultado de tabela da pesquisa rápida já não desloca a vista de todas as vezes, e um salto que a regra deixa no lugar não provoca nenhum deslocamento que o emita. Abrir, fechar ou redimensionar o explorador estreita ou alarga a tela sem mover a sua origem, e também não emite nada. Antes da `4.0.0`, deslocar, fazer zoom e mudar de separador emitiam-no sempre, mesmo quando `editor.value` ficava igual.  
Para evitar escritas que não alteram nada, compare `editor.value` com o último valor que guardou, e não com o ficheiro que carregou: um ficheiro escrito por uma versão anterior, um ficheiro v2 ou um editado à mão pode sair diferente em `value` logo que é carregado, porque `value` o escreve na forma de armazenamento. O mesmo pode acontecer com um ficheiro cujo bloqueio `Viewport` está desativado e cuja origem não desenha nenhuma parte do diagrama neste ecrã: o carregamento move a vista para o diagrama, e `value` escreve onde ela fica. A partir da `4.0.0`, as larguras medidas já não causam isto, porque `value` não contém nenhuma. A partir da `4.2.0`, um ficheiro guardado pela `4.0.0` ou pela `4.1.0` também pode sair diferente, já que `value` passa a deixar de fora os seus campos de texto, listas e coleções vazios, pelo que esse ficheiro é reescrito uma vez, quando voltar a ser guardado. Em alternativa, um host que escreve ficheiros pode distinguir uma edição de uma mudança de vista com o `changed` de um armazenamento de replicação — consulte [on@change](./advanced/remote-storage.md#onchange).  
O evento não traz `detail`, não se propaga nem atravessa a fronteira do shadow root, por isso escute-o no próprio elemento e leia `editor.value` no listener.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

É emitido quando o tema predefinido é alterado a partir do criador de temas incorporado ou, a partir da `4.0.0`, da entrada `Theme` na pesquisa rápida. É emitido em todas as escolhas, incluindo a da opção que já está em vigor.  
Chamar diretamente [setPresetTheme](#setpresettheme) ou [setSystemAppearance](#setsystemappearance), ou ativar ou desativar [systemDarkMode](#systemdarkmode), não o emite.  
`event.detail` é o `ThemeOptions` completo após a escolha — `{ appearance, grayColor, accentColor }` — e não o objeto parcial que foi pedido. A partir da `4.0.0`, o seu `appearance` é `'system'` enquanto `System` está escolhido, e não o claro ou o escuro que mostra, por isso guarde-o tal como está e devolva-o a `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

A partir da `4.0.0`, é emitido quando se escolhe um idioma no editor, a partir do seletor de idioma ou da entrada `Display Language` na pesquisa rápida, ambos ativados por [enableLocalePicker](#enablelocalepicker).  
É disparado depois de o idioma ter sido aplicado, em todas as escolhas, incluindo a da opção que já está em vigor. [setLocale](#setlocale) e [setSystemLocale](#setsystemlocale) nunca o emitem, nem uma alteração dos idiomas do navegador. Uma mudança de idioma não emite nenhum `change`.  
`event.detail` é `{ locale }`, um `LocaleOption`: `'system'` quando foi escolhido `System`, caso contrário o código do idioma. O elemento não memoriza a escolha, por isso guarde-a e passe-a a `setLocale` no carregamento seguinte.  
Tal como `change`, não se propaga, por isso escute-o no próprio elemento.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Dá o foco ao editor.

```js
editor.focus();
```

## blur {#blur}

Retira o foco do editor.

```js
editor.blur();
```

## clear {#clear}

Esvazia o documento, removendo todas as tabelas, colunas, relações, índices e notas, a partir da `4.0.0`, todos os grupos de tabelas e, a partir da `4.2.0`, as palavras, os termos e os domínios do separador Dicionário, esvaziando também o histórico de anulação próprio de cada folha.  
Todas as definições se mantêm, incluindo a base de dados, a posição da vista, o nível de zoom, as opções de vista das tabelas, cada bloqueio com o valor que guarda e os scripts `Before tables` e `After tables` do separador Esquema SQL, pelo que um ficheiro limpo continua a guardar o que guardava. Para iniciar, em vez disso, um documento novo, atribua `''` a `value` ou chame `setInitialValue('')`.  
Fica registado na lista do histórico, pelo que pode ser anulado, e emite `change`. Uma anulação repõe o documento tal como o editor o tinha, incluindo as suas palavras, termos e domínios, cada definição bloqueada com o seu valor bloqueado. É ignorado enquanto `readonly` está definido.

```js
editor.clear();
```

## destroy {#destroy}

Destrói completamente a instância do editor, de modo que já não pode ser reutilizada.  
Liberta os listeners e as subscrições do editor e destrói todos os armazenamentos partilhados devolvidos por [getSharedStore](#getsharedstore).  
Um lote do fluxo que um armazenamento partilhado ainda esteja a reter é descartado com ele; chame primeiro o [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) desse armazenamento para o enviar.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Redefine os atalhos de teclado.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` são fixos e não podem ser redefinidos.  
Apenas os vinte e um nomes abaixo são escritos; tudo o resto no objeto é ignorado, incluindo os nomes fixos.  
A partir da `3.10.0`, `search` pode ser redefinido e `findReplace` é novo. Antes, `search` era fixo. A partir da `4.0.0`, `removeSelection` é novo. A partir da `4.1.0`, `addTableGroup` e `groupSelectedTables` são novos.  
O valor de uma associação tem de ser um `ShortcutOption[]`. Uma cadeia simples é ignorada, por isso escreva `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` em vez de `{ addTable: 'Alt+KeyN' }`.  
Um array vazio é aceite e não associa nada: `setKeyBindingMap({ findReplace: [] })` deixa `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) para a página, e `{ search: [] }` faz o mesmo com `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac). O botão `Search` da barra de ferramentas continua a abrir a pesquisa rápida, o botão `Explorer` da barra de ferramentas continua a abrir e a fechar o explorador, e a entrada `Toggle Explorer` na pesquisa rápida e no menu de contexto da tela continua a abrir a pesquisa do explorador ou a fechá-lo; nenhum destes mostra um atalho para um nome deixado vazio. `{ removeSelection: [] }` deixa `Delete` e `Backspace` para a página, e as opções de eliminação dos menus da tabela, da nota e do grupo de tabelas (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) deixam então de mostrar um atalho.  
A partir da `4.1.0`, `{ addTableGroup: [] }` deixa `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) para a página, e `{ groupSelectedTables: [] }` deixa `T` e depois `G`. A opção `New Table Group` na barra de ferramentas da tela, no menu de contexto da tela e na pesquisa rápida, a opção `Group selected tables` no menu da tabela e a entrada `Group Selected Tables` na pesquisa rápida continuam a funcionar, sem mostrar nenhum atalho. As dicas dos botões `New Table`, `New Memo` e `New Table Group` da barra de ferramentas da tela indicam a primeira combinação de `addTable`, `addMemo` e `addTableGroup`, ou apenas o botão no caso de uma associação deixada vazia.  
A partir da `4.2.0`, `addColumn` e `removeColumn` também dão à grelha do separador Dicionário as suas combinações de teclas para linhas, como se descreve abaixo, pelo que reatribuir qualquer um deles leva essas combinações consigo. `{ addColumn: [] }` deixa a grelha sem nenhuma combinação para inserir linhas, e as duas opções de inserção do menu da grelha deixam então de mostrar um atalho; `{ removeColumn: [] }` deixa-a sem nenhuma para as eliminar, e a opção de eliminação do menu e a dica da ferramenta `Delete Rows` deixam então de mostrar um atalho.  
A chamada é uma fusão parcial: os nomes que omitir mantêm as suas predefinições, e chamá-la duas vezes mantém as alterações anteriores. Não existe nenhum getter para as associações atuais: [createKeyBindingMap](#createkeybindingmap) devolve as predefinições, e não o que `setKeyBindingMap` alterou.

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

`selectAllTable`, `handTool`, `removeSelection` e, a partir da `4.1.0`, `groupSelectedTables` cedem a vez a um cursor de texto: enquanto o foco está num campo de entrada, numa área de texto ou num `contenteditable`, `$mod + A` seleciona o texto, `Space` escreve um espaço, `Delete` e `Backspace` apagam texto e `T` e depois `G` escrevem as duas letras, em vez de chegarem à tela. Nenhuma dessas teclas premidas tem a ação predefinida cancelada. Seja qual for a tecla a que as reatribua, o comportamento é o mesmo.

A partir da `4.0.0`, `removeSelection` (`Delete` ou `Backspace`) remove a seleção no separador ERD como um único passo de anulação, sem perguntar. Quando a tabela com o foco é a única coisa selecionada, uma ou mais das suas colunas estão selecionadas e o zoom desenha as suas linhas, remove essas colunas; caso contrário, remove todas as tabelas, notas e grupos de tabelas selecionados, mantendo as tabelas de um grupo. Consulte [Eliminação de tabelas e notas](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Uma tecla mantida premida remove apenas uma vez, e nada é removido enquanto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas está aberto. Fora de um campo de texto e dos painéis e separadores que retêm as associações (consulte [createKeyBindingMap](#createkeybindingmap)), a ação predefinida da tecla é cancelada em todos os separadores enquanto o editor tem o foco, também num botão da barra de ferramentas com o foco e num editor só de leitura, onde não remove nada.

A partir da `4.1.0`, `addTableGroup` (`Alt+KeyG`) prepara o desenho `New Table Group` no separador ERD, em que o premir seguinte do botão principal na tela desenha o grupo, e premir de novo a combinação cancela o desenho, tal como o botão `New Table Group` da barra de ferramentas da tela. `groupSelectedTables` (`KeyT KeyG`, `T` e depois `G`) coloca as tabelas selecionadas num novo grupo e abre o editor do seu nome, tal como a opção `Group selected tables` no menu de contexto de uma tabela. Sem nenhuma tabela selecionada, não adiciona nada; uma nota ou um grupo de tabelas selecionado não conta. Consulte [Desenhar um grupo](../guide/guides/table-groups.md#drawing-a-group) e [Agrupar as tabelas selecionadas](../guide/guides/table-groups.md#grouping-selected-tables).  
Ambas só atuam onde os menus oferecem um grupo: não enquanto `readonly` está definido, enquanto a opção de vista `Table Groups` oculta os grupos ou enquanto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas está aberto. Tal como as outras associações da tela, só atuam no separador ERD, e não enquanto a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a viagem no tempo, a pré-visualização da disposição automática ou a caixa de diálogo `Export image` ou `Map Columns` estão abertos. Onde não fazem nada, a ação predefinida da tecla continua a ser cancelada, a menos que `groupSelectedTables` ceda a vez a um cursor de texto. A propagação de `addTableGroup` também é interrompida, tal como a de `focusView` e de `zenMode`, pelo que um listener de `keydown` da página na fase de propagação nunca o recebe.

A partir da `4.2.0`, no separador [Dicionário](../guide/guides/dictionary.md#adding-and-deleting-rows), cada combinação de um só premir de `addColumn` insere abaixo da seleção tantas linhas quantas a seleção abrange, a mesma combinação com `Shift` também premido insere-as acima, e cada combinação de um só premir de `removeColumn` elimina as linhas que a seleção abrange: `Alt+Enter`, `Alt+Shift+Enter` e `Alt+Backspace` ou `Alt+Delete` com as predefinições. Atuam na grelha das folhas `Domains`, `Words` e `Terms` enquanto nenhuma edição de célula está aberta. Uma combinação de `addColumn` que já inclua `Shift` não dá nenhuma combinação para inserir acima, e uma sequência associada a qualquer um dos dois nomes não dá nada à grelha.  
Em cada uma destas teclas premidas, a ação predefinida é cancelada conforme a sua opção indica e a propagação é sempre interrompida, pelo que não adiciona nem remove nenhuma coluna no separador ERD. Na folha `Checks` e num editor só de leitura não faz nada, embora a ação predefinida continue a ser cancelada e a propagação interrompida. Numa edição de célula aberta ou no campo de pesquisa do separador, as combinações ficam para o texto: a propagação é aí interrompida, mas a ação predefinida não é cancelada, pelo que o campo reage a elas como reagiria em qualquer outro lado (num Mac, `⌥ + Backspace` apaga uma palavra). [dictionaryRowChords](#dictionaryrowchords) enumera-as.

A partir da `3.10.0`, `findReplace` (`$mod+KeyF`) abre [Localizar e substituir](../guide/guides/find-and-replace.md). A partir da `4.1.0`, abre ou fecha o [explorador](../guide/guides/explorer.md#opening-and-closing) que o contém, e o separador Atalhos apresenta-o como `Toggle Explorer`.  
Enquanto o botão `Explorer` da barra de ferramentas aparece premido (o explorador aberto no separador ERD e não oculto pelo modo zen), fecha o explorador, a menos que a pesquisa rápida, o painel Propriedades da tabela, o criador de temas, o seletor de idioma, a caixa de diálogo `Export image` ou `Map Columns` estejam abertos. Caso contrário, fecha o que estiver aberto de entre estes, passa para o separador ERD a partir de qualquer outro separador e abre o explorador com o cursor de texto no campo `Find` e a consulta selecionada. Um editor demasiado estreito para mostrar o explorador ao lado da tela mantém-no aberto, mas afastado, e mostra a notificação `Widen the window to show the Explorer`. Antes da `4.1.0`, abria o painel flutuante Localizar e substituir, ou devolvia o foco do teclado ao seu campo, e nunca o fechava.  
Não cede a vez a um cursor de texto: enquanto o editor tem o foco, é captado em todos os separadores, a partir da tela ou de um campo de entrada dentro do editor. A ação predefinida da tecla é cancelada, pelo que o navegador não abre nenhuma barra de localização, e a sua propagação é interrompida, pelo que nenhum listener de `keydown` da página na fase de propagação a recebe. Com o editor de uma célula ou de uma nota aberto, a partir da `4.0.0`, o editor do nome de um grupo de tabelas ou, a partir da `4.2.0`, uma edição de célula na grelha do separador Dicionário, a ação predefinida continua a ser cancelada e a propagação interrompida, mas não faz nada. Neste último caso, `search` também não faz nada, pelo que o texto escrito até então se mantém.  
Enquanto o visualizador de diferenças, a viagem no tempo ou a pré-visualização da disposição automática estão abertos, seja em que separador for, ou enquanto um IME ainda está a compor, nem a ação predefinida é cancelada nem a propagação é interrompida, pelo que a localização do próprio navegador ou do host a recebe. Dentro do explorador, a propagação de uma tecla premida ainda em composição é interrompida aí, embora a ação predefinida não seja cancelada. Seja qual for a tecla a que reatribua `findReplace`, o comportamento é o mesmo.

`focusView` só atua no separador ERD. Com pelo menos uma tabela selecionada, abre o separador Visualização no modo Flow, restrito a essas tabelas e a todas as tabelas à distância de uma relação; uma nota ou um grupo de tabelas selecionado não conta e, sem nenhuma tabela selecionada, não faz nada. Consulte [Focar em tabelas](../guide/guides/visualization.md#focusing-on-tables).

`undo` e `redo` atuam consoante o separador. No separador ERD, anulam e refazem passos do histórico do documento. A partir da `4.2.0`, no separador Dicionário, anulam e refazem passos do histórico próprio da folha mostrada, e não fazem nada na folha `Checks` — consulte [Folhas do dicionário](../guide/guides/undo-redo.md#dictionary-sheets). No modo Flow do separador Visualização, recuam e avançam um passo tal como [`Previous table` e `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), sem tocar no histórico do documento. Nos outros separadores, e no modo Graph, não anulam nada.

`stop` (`Escape`) no separador ERD termina o editor de uma célula ou de uma nota que esteja aberto, ou uma relação que esteja a ser desenhada, e deixa a seleção como está. A partir da `4.0.0`, também termina o editor do nome de um grupo de tabelas, sem escrever nenhum nome, e um desenho `New Table Group`. O editor chama `preventDefault()` quando essa tecla é premida.  
Sem nenhum destes aberto, `Escape` limpa a seleção e retira o foco da célula, e a sua ação predefinida não é cancelada. Sair de uma edição e limpar a seleção requer, por isso, premir a tecla duas vezes.  
A partir da `4.2.0`, enquanto a lista de termos de uma célula do nome lógico está visível (consulte [Completar os nomes dos termos](../guide/guides/logical-names.md#completing-term-names)), o primeiro `Escape` fecha apenas a lista e deixa o editor aberto. Nessa tecla premida, a ação predefinida é cancelada e a propagação é interrompida na célula, pelo que nem `stop` nem um listener de `keydown` da página na fase de propagação a recebem.  
À exceção do explorador, dos formatos de `Import` do [ecrã de boas-vindas](#enablewelcomescreen), da lista de termos de uma célula do nome lógico, do separador [Dicionário](../guide/guides/dictionary.md#keys-on-the-tab) e dos seletores e caixas de diálogo abaixo, o editor nunca impede a propagação de `Escape`, pelo que uma página que esteja ela própria à escuta desta tecla, por exemplo para fechar uma caixa de diálogo sua, recebe os dois eventos de tecla e pode ignorar aquele cujo `defaultPrevented` é `true`.  
Enquanto a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização da disposição automática ou a viagem no tempo estão abertos, `Escape` fecha o que estiver aberto, em vez disso, e deixa a seleção como está. A ação predefinida dessa tecla também não é cancelada.  
A partir da `4.0.0`, uma caixa de diálogo [`Export image`](../guide/guides/file-import-export.md#image) ou [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) aberta também recebe `Escape`, que a fecha e deixa a seleção como está. Cada uma capta o foco do teclado quando se abre, e nesse `Escape` a ação predefinida é cancelada e a propagação é interrompida.  
A partir da `4.1.0`, um `Escape` premido com o foco dentro do [explorador](../guide/guides/explorer.md#keys-in-the-explorer), na sua árvore, nos seus campos ou nos seus botões, devolve o foco do teclado à tela e deixa o explorador aberto e a seleção como está. O editor chama `preventDefault()` e `stopPropagation()` sobre ele, pelo que nunca chega a um listener de `keydown` da página na fase de propagação.  
Um `Escape` na tela nunca fecha o explorador. Antes da `4.1.0`, um `Escape` dentro do painel Localizar e substituir fechava-o, e um na tela fechava-o no mesmo premir que limpava a seleção.  
A partir da `4.0.0`, o seletor de idioma e o seletor de cores fecham-se com `Escape`: dentro deles, a ação predefinida é cancelada e a propagação é interrompida, e na tela fecha-os no mesmo premir que limpa a seleção, sem cancelar a ação predefinida nem interromper a propagação.  
Um `Escape` premido enquanto um IME ainda está a compor pertence à composição. Deixa um editor aberto como está e a sua ação predefinida não é cancelada, pelo que uma página também pode ignorar uma tecla premida cujo `isComposing` é `true`, ou cujo `keyCode` é `229`. Dentro do explorador, a propagação dessa tecla, como a de qualquer tecla aí premida a meio de uma composição, também é interrompida, e o foco do teclado fica no campo.  
Antes da `3.9.2`, um único `Escape` terminava uma edição ou um desenho e limpava a seleção, e o editor nunca cancelava a sua ação predefinida.

### createKeyBindingMap {#createkeybindingmap}

A partir da `3.9.2`, o pacote exporta `createKeyBindingMap()` e, com ele, os tipos `KeyBindingMap`, `KeyBindingName` e `ShortcutOption`.  
Devolve as combinações de teclas predefinidas, os 28 nomes incluindo os fixos, como um novo mapa em cada chamada, pelo que alterar o mapa que devolve não altera mais nada.  
É o ponto de partida de todos os editores, e uma chamada a `setKeyBindingMap` não se reflete nele.  
Destes quatro, apenas `createKeyBindingMap` é uma exportação em tempo de execução; os outros três são tipos. A partir da `4.2.0`, [dictionaryRowChords](#dictionaryrowchords) é exportado ao lado dele.

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

Cada `shortcut` é uma combinação na sintaxe do [tinykeys](https://github.com/jamiebuilds/tinykeys) que designa a sua tecla por `KeyboardEvent.code`, em que [`$mod`](#mod) é `⌘` no macOS e `Control` nos restantes sistemas.  
A partir da `4.0.0`, o editor lê estas combinações por si próprio, em vez de através do tinykeys, com a mesma sintaxe. Uma tecla corresponde pelo seu `code`, ou pelo seu `key` sem distinguir maiúsculas de minúsculas, e uma tecla premida só corresponde se estiverem premidas exatamente as teclas modificadoras que a combinação indica. `AltGraph` conta como `Control` e `Alt` no Windows e como `Alt` no macOS. Teclas separadas por um espaço formam uma sequência, que recomeça após um segundo sem nenhum keydown.  
A partir da `4.1.0`, uma das predefinições é uma sequência: `groupSelectedTables` é `KeyT KeyG`, `T` e depois `G`. Uma sequência é executada na tecla premida que a completa, e só essa recebe o seu `preventDefault` e o seu `stopPropagation`, pelo que, com as predefinições, `T` chega à página e só `G` tem a ação predefinida cancelada. Os menus, a pesquisa rápida e o separador Atalhos mostram uma sequência como uma tecla por cada tecla premida.  
Os nomes fixos estão associados a `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) e `$mod+Digit0` (`zoomReset`). `edit` e `stop` não têm sinalizadores; os outros cinco têm `preventDefault` e `stopPropagation`. Os restantes são as predefinições acima, entre elas `search` e `findReplace`.

O editor escuta-as no seu próprio elemento, pelo que um host que capta as teclas antes do editor, com atalhos globais ou um listener de `keydown` na fase de captura, tem de as deixar passar enquanto o editor tem o foco.  
Construa a lista das teclas a deixar passar a partir de `createKeyBindingMap()`, com as associações que passou a `setKeyBindingMap` no lugar das predefinições.  
A partir da `3.10.0`, essa lista inclui `$mod+KeyF`, a combinação de localização do próprio navegador. Um host que queira manter a sua própria localização nessa combinação passa `setKeyBindingMap({ findReplace: [] })`.  
A partir da `4.0.0`, inclui também `Delete` e `Backspace` sem modificadores. Um host que queira manter essas teclas passa `setKeyBindingMap({ removeSelection: [] })`.  
A partir da `4.1.0`, inclui também `Alt+KeyG` e a sequência `KeyT KeyG`, que vem numa única cadeia: divida-a no espaço e deixe passar cada tecla premida, incluindo `T` e `G` sem modificadores, já que uma sequência a que falte uma tecla nunca se completa. Um host que queira manter essas teclas passa `setKeyBindingMap({ addTableGroup: [] })` ou `setKeyBindingMap({ groupSelectedTables: [] })`.  
A partir da `4.2.0`, acrescente-lhe as combinações que [dictionaryRowChords](#dictionaryrowchords) devolve para o mesmo mapa, entre elas `Alt+Shift+Enter`. Um host que queira manter essas teclas passa `setKeyBindingMap({ addColumn: [] })` ou `setKeyBindingMap({ removeColumn: [] })`, o que também as retira da adição e da remoção de colunas no separador ERD.

Enquanto o foco está dentro do explorador, na sua árvore, nos seus campos `Find` e `Replace` ou nos seus botões, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` passam para o editor, pelo que `findReplace` atua aí como na tela. Todas as outras associações, tal como estão definidas, param no explorador, uma sequência pela sua última tecla premida (um `G` sem modificadores com as predefinições), e o mesmo acontece com as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla premida enquanto um IME ainda está a compor. À exceção de `Escape`, que devolve o foco do teclado à tela, a sua propagação é interrompida sem que a ação predefinida seja cancelada, pelo que funcionam como teclas normais nos campos, botões e árvore do explorador e não chegam nem à tela nem a um listener de `keydown` da página na fase de propagação: aí, `Alt + N` não adiciona nenhuma tabela e `Delete` não remove nada. As teclas que movem, recolhem ou vão para uma linha da árvore, e `Enter` no campo `Find` ou `Replace`, que percorre as correspondências ou substitui, também têm a ação predefinida cancelada.  
Qualquer outra tecla, como a combinação para guardar ou para a paleta de comandos de um host, segue para a página como habitualmente. Consulte [Teclas no explorador](../guide/guides/explorer.md#keys-in-the-explorer). Antes da `4.1.0`, o painel flutuante Localizar e substituir retinha as teclas da mesma forma, à exceção de `Home`, `End`, da última tecla premida de uma sequência e de `Space` enquanto `handTool` estava associado a outra tecla.  
A partir da `4.0.0`, o seletor de idioma retém as teclas da mesma forma: as mesmas sete associações passam, e todas as outras associações (a partir da `4.1.0`, uma sequência pela sua última tecla premida), as teclas de seta e `Tab` têm aí a propagação interrompida sem que a ação predefinida seja cancelada, tal como qualquer tecla premida enquanto um IME ainda está a compor. `↑`, `↓`, `Home`, `End`, `Enter` e `Space` numa das suas linhas percorrem as linhas ou escolhem uma, e também têm a ação predefinida cancelada.

A partir da `4.2.0`, o separador [Dicionário](../guide/guides/dictionary.md#keys-on-the-tab) também retém as teclas, e apenas `search`, `findReplace`, `undo` e `redo` passam para o editor. `undo` e `redo` atuam no histórico próprio da folha mostrada e, com uma edição de célula aberta ou com o foco no campo de pesquisa do separador, ficam para o texto, com a propagação interrompida aí, mas sem que a ação predefinida seja cancelada. `search` e `findReplace` não fazem nada enquanto uma edição de célula está aberta, como acima. As combinações de teclas para linhas atuam na grelha, como se descreve acima em `addColumn` e `removeColumn`.  
Todas as outras associações, tal como estão definidas, param no separador, uma sequência pela sua última tecla premida, e o mesmo acontece com as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla premida enquanto um IME ainda está a compor. Nenhuma delas chega à tela nem a um listener de `keydown` da página na fase de propagação: aí, `Alt + N` não adiciona nenhuma tabela e `Delete` não remove nada do diagrama. Os eventos de copiar, cortar e colar no separador também param aí, pelo que o diagrama nunca os lê como seus. Qualquer outra tecla segue para a página como habitualmente.

### dictionaryRowChords {#dictionaryrowchords}

A partir da `4.2.0`, o pacote exporta `dictionaryRowChords()`. Devolve, como um novo `ShortcutOption[]` em cada chamada, todas as combinações com que a grelha do separador Dicionário insere ou elimina linhas segundo o mapa de combinações de teclas que lhe passar.  
Por ordem, são as combinações de um só premir de `addColumn`, que inserem linhas abaixo da seleção; cada uma delas com `Shift` também premido, que inserem linhas acima, nenhuma no caso de uma combinação que já inclua `Shift`; e as combinações de um só premir de `removeColumn`, que eliminam linhas. Cada uma mantém o `preventDefault` e o `stopPropagation` da associação de onde vem, e uma sequência fica de fora. Consulte [Adicionar e eliminar linhas](../guide/guides/dictionary.md#adding-and-deleting-rows).  
A combinação que insere linhas acima, `Alt+Shift+Enter` com as predefinições, não está em nenhuma associação, pelo que um host que compara as teclas modificadoras com exatidão e constrói a sua lista das teclas a deixar passar apenas a partir de [createKeyBindingMap](#createkeybindingmap) nunca a deixa passar. Deixe passar as duas listas, como faz o plugin do Obsidian.  
Lê apenas o mapa que recebe, e não as associações do elemento, por isso passe-lhe o mapa a partir do qual construiu a sua lista de teclas.

```ts
declare function dictionaryRowChords(
  keyBindingMap: KeyBindingMap
): ShortcutOption[];

// example
import { createKeyBindingMap, dictionaryRowChords } from '@dineug/erd-editor';

const map = createKeyBindingMap();
const shortcuts = [
  ...Object.values(map).flat(),
  ...dictionaryRowChords(map),
].map(({ shortcut }) => shortcut);
// dictionaryRowChords(map): 'Alt+Enter', 'Alt+Shift+Enter', 'Alt+Backspace', 'Alt+Delete'
```

### $mod {#mod}

Muda a tecla `Control` consoante o ambiente.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabela de atalhos {#shortcut-table}

Utiliza as propriedades `key, code` dos eventos de teclado.  
Utilize `code` para posições absolutas e `key` para valores introduzidos.

| Windows       | macOS           | `key`         | `code`                         |
| ------------- | --------------- | ------------- | ------------------------------ |
| N/D           | `Command` / `⌘` | `Meta`        | `MetaLeft` / `MetaRight`       |
| `Alt`         | `Option` / `⌥`  | `Alt`         | `AltLeft` / `AltRight`         |
| `Control`     | `Control` / `^` | `Control`     | `ControlLeft` / `ControlRight` |
| `Shift`       | `Shift`         | `Shift`       | `ShiftLeft` / `ShiftRight`     |
| `Space`       | `Space`         | N/D           | `Space`                        |
| `Enter`       | `Return`        | `Enter`       | `Enter`                        |
| `Esc`         | `Esc`           | `Escape`      | `Escape`                       |
| `Backspace`   | `Delete` / `⌫`  | `Backspace`   | `Backspace`                    |
| `Delete`      | `fn` + `Delete` | `Delete`      | `Delete`                       |
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Define um tema predefinido.  
As predefinições são `appearance: 'dark'`, `grayColor: 'slate'` e `accentColor: 'indigo'`.  
Cada campo é aplicado por si só, pelo que uma chamada parcial deixa os outros dois como estão. Um valor que não seja um dos nomes abaixo é ignorado, e a chamada nunca gera uma exceção.  
A partir da `4.0.0`, `appearance` também aceita `'system'`, a opção `System` do criador de temas. Mostra o claro ou o escuro que o sistema operativo indica, ou o que [setSystemAppearance](#setsystemappearance) indicar, e muda quando esse valor muda.

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

A partir da `4.0.0`, indica o claro ou o escuro que o aspeto `'system'` mostra, para um host com um claro e um escuro próprios, como o tema de um IDE. Enquanto um deles estiver indicado, as alterações do sistema operativo são ignoradas.  
`null`, ou qualquer valor diferente de `'dark'` ou `'light'`, volta a seguir o sistema operativo.  
Enquanto o aspeto é `'light'` ou `'dark'`, não altera nada no ecrã, mas o valor é mantido e aplica-se logo que o aspeto passa a ser `'system'`. Caso contrário, aplica-se de imediato. Não emite nada, e `changePresetTheme` continua a indicar `'system'`.  
Os hosts VS Code, JetBrains e Obsidian chamam-no com o seu próprio claro ou escuro, e novamente sempre que este muda.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Permite personalizar o tema.  
Cada chamada substitui toda a camada personalizada, por isso passe novamente o objeto completo para alterar um token sobre uma personalização existente, e passe `{}` para voltar ao tema predefinido.  
Apenas os nomes de token abaixo, com valores de cadeia, são mantidos; tudo o resto é descartado sem erro.  
A camada fica sobre o tema predefinido, pelo que um `setPresetTheme` posterior troca o tema predefinido por baixo, enquanto as suas personalizações se mantêm.

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

  columnHandleBackground: string;
  columnHandleBorder: string;
  columnHandleHoverBackground: string;
  columnHandleHoverBorder: string;

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

  dictionaryErrorForeground: string;
  dictionaryErrorBackground: string;
  dictionaryWarningForeground: string;
  dictionaryWarningBackground: string;
  dictionaryBackground: string;
  dictionaryHeaderBackground: string;
  dictionaryGridLine: string;
  dictionaryHeaderSelect: string;

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

`tableShadow` e `memoShadow` são a cor da sombra que as tabelas e as notas projetam na tela ERD. O tema predefinido escuro deixa-os como `transparent`, o que não projeta nenhuma sombra, tal como passar `none` ou uma cadeia vazia a `setTheme`; o tema predefinido claro utiliza `rgba(0, 0, 0, 0.18)`.

A partir da `4.0.0`, há mais nove tokens:

- `tableGroupHeaderBackground`, `tableGroupBackground` e `tableGroupBorder` dão cor à barra de título, ao corpo e ao contorno de um [grupo de tabelas](../guide/guides/table-groups.md) que não tem cor própria.
- `toastSuccess` e `toastError` dão cor à marca de uma notificação que indica como algo terminou.
- `findReplaceError` e `mapColumnsError` dão cor aos erros que Localizar e substituir e a caixa de diálogo Mapear colunas mostram. Antes, Localizar e substituir utilizava `diffDeleteForeground`, pelo que personalizar esse token já não lhe muda a cor.
- `schemaSqlWarningBackground` e `schemaSqlWarningForeground` dão cor aos avisos nas opções do separador Esquema SQL.

A partir da `4.1.0`, há mais nove tokens:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` e `treeMatch` dão cor à árvore que o [explorador](../guide/guides/explorer.md#the-tree) e o [visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer) partilham: o seu fundo, que também preenche os campos `Find` e `Replace` do explorador; uma linha sob o ponteiro, a linha do foco do teclado enquanto a árvore tem o foco e um botão sob o ponteiro no cabeçalho e na pesquisa do explorador; a linha da correspondência atual da pesquisa; o texto esbatido, como contagens, tipos de dados e as setas para recolher; e a marca por trás do texto que uma pesquisa encontrou.
- `explorerBackground` e `explorerBorder` dão cor ao painel do explorador e às suas linhas: o seu limite junto à tela, a linha por baixo da sua pesquisa e os contornos dos seus campos e dos botões que a opção `Search In` expande. `explorerBorder` também desenha o limite da árvore do visualizador de diferenças, a linha por baixo do seu campo `Filter by name` e o contorno desse campo. Os ícones de chave do explorador usam `keyPK`, `keyFK` e `keyPFK`.
- `diffModifyForeground` e `diffRenameForeground` dão cor ao que o visualizador de diferenças marca como modificado e com o nome alterado, na sua árvore e em ambos os documentos. `diffModifyForeground` também contorna uma tabela, nota ou grupo de tabelas que foi movido, redimensionado, mudado de cor ou de grupo, independentemente do que mais tenha mudado, e desenha o conector de uma chave externa que mudou.

`diffInsertForeground` e `diffDeleteForeground` dão agora cor ao que o visualizador de diferenças marca como adicionado e eliminado, na sua árvore e no documento que o contém, tanto no texto como nos contornos e nos conectores. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` e `diffCrossForeground` foram removidos na `4.1.0`, já que o visualizador de diferenças deixou de preencher células. `setTheme` descarta-os como qualquer outro nome que não esteja em `Theme`, e os respetivos hooks, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` e `--erd-editor-diff-cross-foreground`, já não são lidos.

A partir da `4.2.0`, há mais doze tokens:

- `columnHandleBackground` e `columnHandleBorder` preenchem e contornam a [pega de arrastamento da coluna](../guide/guides/table-editing.md#rearranging-and-moving-columns), desenhada logo fora do limite esquerdo de uma tabela, ao lado da linha da coluna com o foco, e `columnHandleHoverBackground` e `columnHandleHoverBorder` substituem-nos enquanto o ponteiro está sobre ela. O desenho da pega usa `foreground` e, sob o ponteiro, `active`.
- `dictionaryErrorForeground` e `dictionaryWarningForeground` dão cor ao que as [verificações do dicionário](../guide/guides/dictionary.md#what-each-check-finds) encontram, um erro ou um aviso: um nome assinalado na tela ERD (consulte [Marcas na tela](../guide/guides/dictionary.md#marks-on-the-canvas)), o texto de uma célula assinalada nas folhas `Domains`, `Words` e `Terms` e a contagem de `Checks`. `dictionaryErrorBackground` e `dictionaryWarningBackground` preenchem essa célula. `dictionaryErrorForeground` também dá cor à ferramenta `Delete Rows` sob o ponteiro.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` e `dictionaryHeaderSelect` dão cor à folha do separador [Dicionário](../guide/guides/dictionary.md#the-sheets): às suas células, cuja cor também preenche o campo de pesquisa do separador e a lista de domínios de um termo; aos seus cabeçalhos de coluna e números de linha; às linhas entre as células, cuja cor também desenha a barra do separador e os contornos dos seus campos; e a um cabeçalho cuja linha ou coluna toca a seleção. O resto da folha usa tokens partilhados: `foreground` para os rótulos dos cabeçalhos, `active` para o texto das células, `grayColor7` para a linha que separa os cabeçalhos de coluna e os números de linha das células, `focus` para o limite da célula ativa, `accentColor9` para o limite de um intervalo selecionado e, com 20% de opacidade, para o seu preenchimento, `accentColor6` para o cabeçalho de uma linha ou coluna inteira selecionada, `grayColor3` para as células só de leitura e os tokens da barra de deslocamento. Um `accentColor9` que não esteja escrito como `#rgb` ou `#rrggbb` deixa um intervalo selecionado sem preenchimento.

#### Variáveis CSS {#css-variables}

Cada token de `Theme` tem um hook CSS correspondente, cujo nome é `--erd-editor-` seguido da chave em kebab-case: `grayColor10` é `--erd-editor-gray-color-10`, `keyPK` é `--erd-editor-key-pk` e `keyPFK` é `--erd-editor-key-pfk`.  
Os hooks são herdados para dentro do editor, por isso defina-os onde quiser que se apliquem. Em `:root`, aplicam o tema a todos os editores da página; no próprio elemento, aplicam-no apenas a esse.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

A partir da `3.4.0`, os tokens `dargSelect`, com o erro ortográfico, escrevem-se `dragSelect`, e os respetivos hooks mudaram de `--erd-editor-darg-select-background` e `--erd-editor-darg-select-border` para `--erd-editor-drag-select-background` e `--erd-editor-drag-select-border`. Uma folha de estilos que ainda utilize os nomes antigos é ignorada.

<details>
<summary>Valores predefinidos do tema</summary>

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
  --erd-editor-column-handle-background: #18191b;
  --erd-editor-column-handle-border: #363a3f;
  --erd-editor-column-handle-hover-background: #2e3135;
  --erd-editor-column-handle-hover-border: #43484e;
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
  --erd-editor-dictionary-error-foreground: #ff9592;
  --erd-editor-dictionary-error-background: #500f1c;
  --erd-editor-dictionary-warning-foreground: #ffca16;
  --erd-editor-dictionary-warning-background: #3f2700;
  --erd-editor-dictionary-background: #18191b;
  --erd-editor-dictionary-header-background: #2e3135;
  --erd-editor-dictionary-grid-line: #363a3f;
  --erd-editor-dictionary-header-select: #182449;
  --erd-editor-diff-insert-foreground: #3dd68c;
  --erd-editor-diff-delete-foreground: #ff9592;
  --erd-editor-diff-modify-foreground: #ffca16;
  --erd-editor-diff-rename-foreground: #70b8ff;
}
```

</details>

## Idioma de apresentação {#display-language}

A partir da `4.0.0`, o texto do próprio editor — os seus menus, painéis, caixas de diálogo, pesquisa rápida, notificações e as palavras que desenha no diagrama, como `unnamed`, incluindo nas exportações de imagem — está disponível em 25 idiomas. Os nomes das tabelas e das colunas, o SQL, os tipos de dados e o código gerado nunca são traduzidos. Consulte [Idioma e tema](../guide/guides/language-and-theme.md).  
Antes de [setLocale](#setlocale) ser chamado ou de um idioma ser escolhido, o editor apresenta-se em inglês, ou segue `'system'` enquanto [enableLocalePicker](#enablelocalepicker) está ativado.  
O editor define `lang` e `dir` na sua própria raiz dentro do shadow root fechado, nunca no elemento host nem na página, pelo que uma página da direita para a esquerda não inverte o editor e um idioma da direita para a esquerda não inverte a página. O hebraico, o árabe e o persa dispõem a interface do editor da direita para a esquerda; o próprio diagrama nunca é espelhado. A partir da `4.1.0`, o [explorador](../guide/guides/explorer.md) fica à esquerda da tela em todos os idiomas, com as suas próprias linhas a ler-se da direita para a esquerda nesses três.  
O pacote exporta os tipos `LocaleCode` (um dos códigos abaixo) e `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Código  | Apresentado como     | Idioma               |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonésio            |
| `de-DE` | Deutsch              | Alemão               |
| `en`    | English              | Inglês               |
| `es-ES` | Español              | Espanhol             |
| `eu-ES` | Euskara              | Basco                |
| `fr-FR` | Français             | Francês              |
| `it-IT` | Italiano             | Italiano             |
| `nl-NL` | Nederlands           | Neerlandês           |
| `pl-PL` | Polski               | Polaco               |
| `pt-PT` | Português            | Português            |
| `pt-BR` | Português Brasileiro | Português do Brasil  |
| `ro-RO` | Română               | Romeno               |
| `sk-SK` | Slovenčina           | Eslovaco             |
| `sl-SI` | Slovenščina          | Esloveno             |
| `sv-SE` | Svenska              | Sueco                |
| `tr-TR` | Türkçe               | Turco                |
| `ru-RU` | Русский              | Russo                |
| `uk-UA` | Українська           | Ucraniano            |
| `he-IL` | עברית                | Hebraico             |
| `ar-SA` | العربية              | Árabe                |
| `fa-IR` | فارسی                | Persa                |
| `ja-JP` | 日本語               | Japonês              |
| `zh-CN` | 简体中文             | Chinês simplificado  |
| `zh-TW` | 繁體中文             | Chinês tradicional   |
| `ko-KR` | 한국어               | Coreano              |

### setLocale {#setlocale}

Define o idioma de apresentação: `'system'` ou um dos códigos acima. Qualquer outro valor, como um simples `'ko'`, um código desconhecido ou um valor que não seja uma cadeia, é ignorado sem erro.  
Aplica-se antes de a chamada terminar, pelo que um idioma definido antes de o elemento ser anexado já aparece no seu primeiro fotograma.  
Não emite nada, nem `changeLocale` nem `change`, e não mexe em `value`, no histórico de anulação nem num armazenamento partilhado.  
A escolha mantém-se, esteja `enableLocalePicker` ativado ou desativado, e `setLocale('system')` segue o sistema também com o seletor desativado.  
O editor não guarda nada. Para manter a escolha de um leitor, escute [changeLocale](#changelocale) e volte a passá-la no carregamento seguinte.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Indica o idioma que `'system'` representa, como uma etiqueta BCP 47, para um host com um idioma de apresentação próprio. Os hosts VS Code, JetBrains e Obsidian chamam-no com o seu próprio idioma de apresentação.  
São removidos os espaços no início e no fim da etiqueta. `null`, uma cadeia em branco ou um valor que não seja uma cadeia volta a `navigator.languages` do navegador, que o editor acompanha à medida que muda.  
Só tem efeito enquanto a opção em vigor é `'system'`, e aplica-se de imediato. A linha `System` do seletor indica o idioma para o qual se resolve.  
A etiqueta, ou cada um dos idiomas do navegador por ordem, resolve-se para o primeiro idioma que o editor tem, pela sua subetiqueta de idioma, sem distinguir maiúsculas de minúsculas nem ter em conta os caracteres de sublinhado: `de-AT` dá `de-DE` e `en-GB` dá `en`. O chinês resolve-se pela escrita, com `Hant` a dar `zh-TW` e `Hans` a dar `zh-CN`, e, sem ela, pela região, com `TW`, `HK` e `MO` a dar `zh-TW` e qualquer outra a dar `zh-CN`. `pt` dá `pt-BR`, a menos que seja indicada uma região diferente de `BR`. Quando nada corresponde, o editor mostra inglês.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Carrega um ficheiro de Esquema SQL.  
Por predefinição, substitui o documento atual em vez de se fundir com ele; consulte `mode` abaixo. As definições que já tem são mantidas, incluindo cada bloqueio e o respetivo valor bloqueado, à exceção da posição da vista e do nível de zoom, e as tabelas são posicionadas depois de o ficheiro ser lido, em linhas, a menos que `placement` abaixo indique outra coisa. Com a definição `Viewport` bloqueada, `value` passa a escrever a vista em que a importação começa, a origem `0, 0` com o nível de zoom `1`. Um documento importado para um elemento a que nunca foi atribuído um valor tem, por isso, todos os bloqueios ativados, tal como um documento novo.  
A partir da `4.2.0`, uma substituição também mantém as palavras, os termos e os domínios do documento, que o texto não pode conter, juntamente com o histórico de anulação de cada folha do separador Dicionário, e anular ou refazer a importação também os mantém. Um [setSchemaJSON](#setschemajson) em substituição e a atribuição de `value` assumem, em vez disso, os que o seu documento contém.  
Fica registado na lista do histórico, o que permite `Undo, Redo`, e emite `change`. Uma cadeia vazia é ignorada, e a chamada não faz nada enquanto `readonly` está definido.  
`setSchemaGraphQL`, `setSchemaDBML` e `setSchemaAML` comportam-se da mesma forma, e os seus analisadores nunca falham: um texto que não consigam ler carrega um documento vazio em vez de gerar um erro.  
A partir da `4.0.0`, os quatro aceitam um segundo argumento opcional, `{ placement, mode }`:

- `placement: 'grid'`, a predefinição, coloca as tabelas em linhas de imediato, como antes, e a chamada não devolve nada.
- `placement: 'auto'` dispõe primeiro as tabelas de acordo com as suas relações, tal como a opção `Import` no editor, e devolve uma `Promise` que se resolve quando a importação tiver sido concluída como um único passo de anulação. Menos de duas tabelas, nenhuma relação, uma disposição que falhe, uma página sem `SharedWorker` ou o botão `Cancel` na notificação `Placing tables` levam a que as tabelas sejam colocadas em linhas, em vez disso. Um carregamento entretanto — outra importação que substitui, a atribuição de `value`, `setInitialValue()`, `clear()`, o carregamento de um colaborador ou a anulação ou o refazer de um carregamento ou de `clear()` — sobrepõe-se a ela, e a `Promise` resolve-se sem nada carregado. As importações posicionadas desta forma são concluídas pela ordem em que começaram.
- `mode: 'replace'`, a predefinição, substitui o documento. `mode: 'append'` adiciona o ficheiro por baixo do diagrama, tal como [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add), deixando como estão todas as tabelas que já lá existem e todas as definições, à exceção do separador e da posição da vista. A partir de outro separador, o separador ERD é mostrado primeiro. As novas tabelas, e os grupos de tabelas que um ficheiro DBML traz enquanto os grupos de tabelas estão visíveis, passam a ser a seleção, e a vista desloca-se até elas, a menos que já estejam bem visíveis, segundo a regra que todos os saltos seguem a partir da `4.1.0` — consulte [Onde termina um salto](../guide/guides/table-related-functions.md#where-a-jump-lands). Uma única anulação remove toda a adição. Um texto que não consiga ler não adiciona nada e deixa o documento como está.

Enquanto `readonly` está definido, uma substituição é ignorada, uma adição não adiciona nada e uma chamada com `placement: 'auto'` resolve-se de imediato.  
A partir da `3.10.0`, `setSchemaSQL` lê o ficheiro de acordo com a base de dados atual do documento: com Databricks selecionado, as cadeias entre aspas simples seguem as sequências de escape com barra invertida do Spark. Consulte [Comentários](../guide/guides/file-import-export.md#comments).  
A partir da `3.10.0`, `setSchemaSQL` lê um `UNIQUE` sobre duas ou mais colunas como um só índice único, e não como um sinalizador Único em cada coluna. Consulte [Chaves únicas e índices](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
A partir da `3.10.0`, as importações de SQL, DBML e AML mantêm as ações `ON DELETE` e `ON UPDATE` das chaves externas que leem.  
A partir da `4.0.0`, `setSchemaSQL` mantém a expressão `DEFAULT` completa de uma coluna, lê o `ADD DEFAULT … FOR` do SQL Server e os seus comentários `MS_Description`, transforma as colunas serial e identity do PostgreSQL em Incremento automático, mantém `UNSIGNED` e `ZEROFILL` num tipo de dados e lê uma chave primária que `ALTER TABLE … ADD PRIMARY KEY` marca como `CLUSTERED`, `NONCLUSTERED` ou `USING BTREE`. Consulte [Esquema SQL](../guide/guides/file-import-export.md#schema-sql).  
Consulte [Importar ou exportar ficheiros](../guide/guides/file-import-export.md) para conhecer a sintaxe que cada analisador aceita.

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

Carrega um documento GraphQL SDL.  
As definições de tipos de objeto tornam-se tabelas, e um campo cujo tipo é outra tabela torna-se uma relação.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Carrega um ficheiro DBML, o formato utilizado pelo dbdiagram.io e pelo dbdocs.  
A partir da `4.0.0`, cada `TableGroup` torna-se um [grupo de tabelas](../guide/guides/table-groups.md), e o `headercolor` de uma tabela torna-se a sua cor. Consulte [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Carrega um ficheiro AML (Azimutt Markup Language). São aceites tanto a grafia atual como a antiga grafia v1.  
A partir da `4.0.0`, a cor de uma entidade, um dos nomes de cores do Azimutt ou um valor hexadecimal entre aspas, torna-se a cor da respetiva tabela. Consulte [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

A partir da `4.0.0`, carrega um documento `.erd.json`, como o texto que [value](#value) devolve.  
No seu `mode: 'replace'` predefinido, carrega o documento tal como a atribuição de `value`: fica registado na lista do histórico, emite `change` e assume os bloqueios do documento da mesma forma, e, a partir da `4.2.0`, as palavras, os termos e os domínios do documento substituem os do editor. Ao contrário de `value`, uma cadeia vazia ou um valor que não seja uma cadeia é ignorado, em vez de iniciar um documento novo. Um texto que não seja JSON esvazia o documento, tal como acontece com `value`.  
`mode: 'append'` adiciona as tabelas, relações, índices, notas e grupos de tabelas do documento por baixo do diagrama com novos ids, mantendo as suas posições relativas e deixando de fora as definições do documento, tal como [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) faz com um ficheiro `json`. A partir da `4.2.0`, mantém os nomes lógicos e os sinalizadores de nome derivado das tabelas e das colunas, mas deixa para trás as palavras, os termos e os domínios do documento, pelo que nenhuma das suas colunas fica vinculada a um domínio. Um texto que não consiga ler, ou um documento sem nenhuma tabela e sem nenhuma nota, não adiciona nada. Caso contrário, é colocado tal como numa adição de [setSchemaSQL](#setschemasql), com as suas novas notas e grupos de tabelas selecionados juntamente com as suas tabelas, cada tipo enquanto estiver visível.  
Termina depois de o documento ter sido colocado, e é ignorado enquanto `readonly` está definido.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporta o estado atual do editor como Esquema SQL.  
Se `databaseVendor` não for especificado, escreve para a base de dados que o editor mostra: a do documento, a menos que o leitor de um editor [só de leitura](#readonly) tenha escolhido outra, que desde a `5.0.0` fica nesse ecrã e é a que o seu separador Esquema SQL mostra. Um nome que não esteja na lista abaixo é tratado da mesma forma, sem gerar um erro.  
Os nomes são delimitados com o tipo de delimitador que o editor mostra. Enquanto `Bracket Type` está [bloqueado](../guide/guides/settings.md#lock), ou num editor só de leitura cujo leitor tenha escolhido outro desde a `5.0.0`, este pode ser diferente do que `value` guarda, que é aquele com que o [`erd_read`](../mcp/tools.md#reading-a-document) de um agente de programação delimita os nomes. Os nomes escritos são sempre os físicos, seja qual for a vista de nomes.  
A partir da `4.0.0`, um argumento opcional `options` escolhe as instruções e o cabeçalho, tal como as opções do separador [Esquema SQL](../guide/guides/schema-sql.md), e, a partir da `4.2.0`, se os nomes lógicos preenchem os comentários vazios. `SchemaSQLOptions` é exportado como um tipo.

- `statements`: `'create'`, a predefinição; `'ifNotExists'`, que escreve `IF NOT EXISTS` em MySQL, MariaDB, PostgreSQL, SQLite e Databricks e recorre a `'create'` nas restantes; ou `'recreate'`, que elimina as tabelas antes de as criar, ao passo que o Snowflake escreve, em vez disso, `CREATE OR REPLACE TABLE`.
- `header`: `'none'`, a predefinição; `'use'`, que muda para a base de dados ou o esquema do documento; ou `'createAndUse'`, que primeiro o cria, se não existir, e depois muda para ele. Uma base de dados que não suporte o cabeçalho pedido recorre a uma alternativa, tal como o separador: o Oracle escreve `'use'` para `'createAndUse'`, o PostgreSQL não escreve nenhum cabeçalho para `'use'` e o SQLite não escreve nenhum. Só é escrito um cabeçalho enquanto o nome da base de dados do documento for um identificador simples — letras ASCII, algarismos e `_`, sem começar por um algarismo.
- `logicalNameAsComment`, a partir da `4.2.0`: `true` escreve o nome lógico de uma tabela ou de uma coluna como o seu comentário quando o seu próprio comentário está vazio ou só tem espaços em branco e o nome lógico não, na forma como essa base de dados escreve um comentário. Um comentário com texto é escrito como antes. Só `true` o ativa: omitido, `false` ou qualquer outro valor, como `'true'` ou `1`, não escreve nenhum nome lógico. Faz o mesmo que o interruptor [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) do separador.

Uma opção omitida, ou com um valor desconhecido, é lida como a sua predefinição, pelo que uma chamada sem opções escreve instruções `CREATE` simples sem cabeçalho, como antes.  
A partir da `4.0.0`, a saída inclui sempre os scripts `Before tables` e `After tables` do documento, pela ordem cabeçalho, script antes das tabelas, instruções DROP, tabelas, script depois das tabelas. As escolhas `Statements`, `Header`, `Write logical names into empty comments` e `Tables` do próprio separador Esquema SQL nunca afetam esta chamada, que escreve sempre o documento inteiro.  
A partir da `3.10.0`, cada chave externa inclui as cláusulas `ON DELETE` e `ON UPDATE` da relação. Uma cláusula só é escrita quando a sua ação está definida e a base de dados a aceita, pelo que uma ação que essa base de dados não aceite é omitida e aplica-se a sua predefinição. A partir da `4.0.0`, o Snowflake só aceita `NO ACTION`. Consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) para saber o que cada base de dados escreve.  
A partir da `3.10.0`, uma aspa simples dentro de um comentário de tabela ou de coluna é escapada, pelo que um comentário como `it's` já não quebra a instrução. Todas as bases de dados que escrevem os comentários como literais de cadeia duplicam-na, exceto o Databricks, que coloca uma barra invertida antes de cada aspa e de cada barra invertida. O SQLite continua a escrever os comentários como linhas `--`.  
A partir da `4.2.0`, o SQL Server escreve cada comentário como um literal nacional, `N'…'`, pelo que o texto fora da página de código da base de dados, como o coreano, é preservado. O Oracle escreve cada sequência de linhas em branco num comentário como uma única quebra de linha, e o SQLite escreve as quebras de linha de um comentário como espaços, pelo que este fica na sua linha `--`. Consulte [Comentários](../guide/guides/schema-sql.md#comments).  
A partir da `4.0.0`, várias bases de dados também escrevem de forma diferente os nomes das chaves, os valores predefinidos e o incremento automático. Consulte [O que o DDL escreve](../guide/guides/schema-sql.md#what-the-ddl-writes).

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
  logicalNameAsComment?: boolean;
};

const schemaSQL = editor.getSchemaSQL();
// or
const postgresSQL = editor.getSchemaSQL('PostgreSQL');
// or
const mysqlSQL = editor.getSchemaSQL('MySQL', {
  statements: 'ifNotExists',
  header: 'createAndUse',
});
// or
const commentedSQL = editor.getSchemaSQL('PostgreSQL', {
  logicalNameAsComment: true,
});
```

## getSharedStore {#getsharedstore}

Devolve um armazenamento para edição colaborativa em tempo real.  
`config` é `{ getNickname?, mouseTracker?, focusTracker? }`. Ambos os rastreadores têm `true` como predefinição: `mouseTracker` transmite o cursor deste editor aos outros, e `focusTracker` transmite a sua célula com o foco, a sua seleção e o seu retângulo de seleção.  
A partir da `5.0.0`, o armazenamento não envia nenhuma alteração enquanto [readonly](#readonly) está definido, apenas o que os seus rastreadores enviam e os registos que um editor que se junta pede, e continua a aplicar o que os outros enviam.  
Consulte [Edição colaborativa](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Abre o visualizador de diferenças, comparando o documento aberto atualmente com o que passar.  
Não devolve nada e não modifica o documento, pelo que fechar o visualizador deixa o editor exatamente como estava.  
Um valor em branco, ou qualquer valor que não seja uma cadeia, é comparado com um documento vazio.  
É a mesma sobreposição que a opção [Visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer) do menu de contexto da tela.  
A partir da `4.1.0`, emparelha o que os dois documentos contêm primeiro pelo id e só depois pelo que cada um guarda, como o nome de uma tabela ou o texto de uma nota — consulte [O que é comparado](../guide/guides/table-related-functions.md#what-is-compared). Em comparação com uma versão anterior do mesmo documento, como uma revisão Git do seu ficheiro, uma mudança de nome aparece, por isso, como um único item com o nome alterado; em comparação com um documento cujos ids são diferentes, aparece como uma remoção e uma adição. O visualizador apresenta o que mudou numa árvore ao lado dos dois documentos e marca as alterações com cor em vez de preencher células.  
A partir da `4.2.0`, os dois documentos abrem-se na vista de nomes que este editor mostra, seja qual for a que o documento passado guardou, e a árvore também nomeia as tabelas e as colunas segundo essa vista — consulte [Além da tela](../guide/guides/logical-names.md#beyond-the-canvas). Os nomes lógicos, os vínculos aos domínios e os dicionários não são comparados, pelo que uma alteração apenas a estes não aparece como alteração.

```js
editor.setDiffValue('prev json...');
```
