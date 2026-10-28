---
sidebar_position: 2
description: A API do elemento erd-editor — como registrá-lo, atributos, value e runtimeValue, eventos, temas, idioma de exibição, tela de boas-vindas, combinações de teclas e importação e exportação de esquemas.
---

# ErdEditorElement

O editor é um `HTMLElement` comum, a tag `<erd-editor>` que a importação de `@dineug/erd-editor/erd-editor.js` define.  
A partir da `5.0.0`, importar a raiz do pacote não define nenhuma tag. A raiz exporta `ErdEditorElement` como o tipo e a classe do elemento, e `defineErdEditor()`, que define a tag onde você a chama — consulte [Registrar os elementos](./installation.md#registering-the-elements).  
Para uma página que apenas mostra um diagrama, o [`<erd-viewer>`](./erd-viewer-element.md) é um elemento somente leitura à parte.

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
```

Sua definição de tipo é a seguinte.

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

O editor é renderizado em um shadow root fechado, então `editor.shadowRoot` é `null` e os estilos da página não entram nem saem dele.  
Nada dentro dele pode ser alcançado com um seletor — em vez disso, estilize-o por meio de [setTheme](#settheme) e das propriedades personalizadas `--erd-editor-*`.

`readonly`, `system-dark-mode`, `enable-theme-builder`, `enable-locale-picker` e `enable-welcome-screen` são os únicos atributos, e todos os cinco têm `false` como padrão. Os dois últimos são novos na `4.0.0`. Cada um lê seu valor como [readonly](#readonly) descreve.

A partir da `4.1.0`, a aba ERD tem um [explorador](../guide/guides/explorer.md), uma árvore do diagrama encaixada à esquerda do canvas com Localizar e substituir no topo. Nenhum atributo, propriedade, método ou evento o abre, fecha ou informa seu estado: ele se abre pelo botão `Explorer` da barra de ferramentas, por `Toggle Explorer` na pesquisa rápida ou no menu de contexto do canvas, ou com a vinculação [`findReplace`](#setkeybindingmap).  
Todo elemento começa com ele fechado. Seu estado aberto ou fechado, sua largura, o que está recolhido nele e sua pesquisa duram enquanto o elemento existir, atravessando trocas de aba e todo carregamento, `setInitialValue` incluído, e nunca entram em `value`, `runtimeValue`, no histórico de desfazer nem em um armazenamento compartilhado.

A partir da `4.2.0`, tabelas e colunas podem ter [nomes lógicos](../guide/guides/logical-names.md) ao lado de seus nomes, e a exibição de nomes, uma configuração do documento como a aba, decide se o canvas desenha seus nomes, seus nomes lógicos ou ambos.  
A barra de ferramentas também tem uma aba [Dicionário](../guide/guides/dictionary.md), entre `Code Generator` e `Settings`, que guarda as palavras, os termos e os domínios do documento e uma planilha `Checks`. É uma aba como as outras: seu `canvasType`, `'@dineug/erd-editor/builtin-dictionary'`, é guardado pelo bloqueio `Canvas Type`, então um texto salvo nela se abre nela por meio de [setInitialValue](#setinitialvalue), e uma troca para ela é escrita em `value` e emite [change](#change) somente enquanto esse bloqueio está desativado. Nenhum atributo, propriedade, método ou evento próprio a abre ou informa sobre ela. Suas edições são alterações no documento: entram em `value`, emitem [change](#change) e chegam aos colaboradores, mas o desfazer e o refazer delas funcionam no histórico próprio de cada planilha, não no do documento.  
O estado da própria aba — qual planilha é mostrada, `Domains` no início, e a pesquisa, a seleção, a rolagem e as larguras das colunas de cada planilha — dura enquanto o elemento existir, atravessando trocas de aba e todo carregamento, e nunca entra em `value`, `runtimeValue`, em um histórico de desfazer nem em um armazenamento compartilhado.  
A interface `ErdEditorElement` não ganha nenhum membro. O que a API acrescenta é `logicalNameAsComment` nas opções de [getSchemaSQL](#getschemasql), doze [tokens de tema](#settheme) e a exportação [dictionaryRowChords](#dictionaryrowchords).

## readonly {#readonly}

Define a capacidade de edição do editor.  
Enquanto ele está definido, atribuir `value`, `clear()`, `setSchemaSQL()`, `setSchemaGraphQL()`, `setSchemaDBML()`, `setSchemaAML()`, `setSchemaJSON()`, desfazer e refazer, incluindo, a partir da `4.2.0`, os de uma planilha da aba Dicionário, são todos ignorados, e o evento `change` nunca é emitido. Em vez disso, carregue um documento com [setInitialValue](#setinitialvalue).  
A partir da `5.0.0`, um editor somente leitura é um leitor, e não um editor com os controles desativados. Ele mantém suas seis abas, o [explorador](../guide/guides/explorer.md#read-only-editors), o minimapa, a pesquisa rápida, as Propriedades da tabela, o [Visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer), `Export`, o modo zen e os cursores, os focos e as seleções dos colaboradores, e todo controle que editaria o diagrama é omitido em vez de desenhado desativado. Antes da `5.0.0`, muitos de seus controles de edição ainda eram desenhados, e o editor descartava o que eles enviavam.

Na aba ERD, um arrasto desloca a área visível onde quer que comece, inclusive sobre uma tabela, e um pressionar não seleciona, move nem abre nada. O ponteiro parado sobre uma tabela acende os relacionamentos dela, um clique sem movimento sobre uma tabela ou um relacionamento mantém esse realce, e um clique sem movimento em qualquer outro lugar o apaga, como no [`<erd-viewer>`](./erd-viewer-element.md). A única seleção é o contorno que um salto deixa: ir para uma linha do explorador, para uma de suas correspondências do Localizar ou para um resultado da pesquisa rápida depois de `#`, `@` ou `:` seleciona o que ele alcança, e o próximo clique sem movimento a limpa. Copiar copia o que essa seleção contém.  
A [barra de ferramentas do canvas](../guide/guides/table-related-functions.md#canvas-toolbar) mantém `Zoom out`, o nível de zoom (`Reset zoom`), `Zoom in`, a lista de exibição de nomes, `Zen Mode` e a bússola, sem `Hand` nem `Select`, sem `New Table`, `New Memo` nem `New Table Group` e sem os botões de relacionamento. O menu do canvas mantém `View Option`, `Name View`, `Export` e `Diff Viewer`, o menu da tabela mantém `Table Properties`, e uma nota, um relacionamento ou um grupo de tabelas não abre menu. A pesquisa rápida na aba ERD não lista nenhuma linha que escreva no diagrama: ela mantém `Tab`, `Name View`, `Database`, `Export`, `Toggle Explorer`, as linhas `Theme` e `Display Language` que [enableThemeBuilder](#enablethemebuilder) e [enableLocalePicker](#enablelocalepicker) ativam e as pesquisas `#`, `@` e `:`. Nas outras abas, ela lista o que lista em um editor editável. A barra de ferramentas mostra o nome do banco de dados como texto e nenhum botão `Undo`, `Redo` nem `Time Travel`.  
Nada oferece `Import`, [`Import and Add`](../guide/guides/file-import-export.md#import-and-add), `Auto Layout`, uma linha de grupo de tabelas (consulte [Grupos de tabelas](../guide/guides/table-groups.md#read-only-editors)) nem [`Map Columns`](../guide/guides/relationship-editing.md#map-columns), e nenhuma [tela de boas-vindas](#enablewelcomescreen) é mostrada.  
As vinculações que adicionam, removem ou editam não fazem nada: `edit`, `addTable`, `addColumn`, `addMemo`, `addTableGroup`, `groupSelectedTables`, `removeTable`, `removeColumn`, `removeSelection`, `primaryKey`, `selectAllTable`, `selectAllColumn`, as quatro vinculações de relacionamento e `handTool`, cada uma ainda com o default impedido, como a sua opção diz. Uma colagem e `Tab` também não fazem nada e chegam à página sem serem impedidos. As vinculações de zoom, `zenMode`, `focusView`, `tableProperties` na tabela que um salto selecionou, `search`, `findReplace`, copiar, `Escape` e as teclas de seta continuam funcionando. Nenhum editor de célula, de nota ou de nome de grupo de tabelas se abre, e nenhum relacionamento é desenhado.

O [Localizar e substituir](../guide/guides/find-and-replace.md#read-only-editors) no topo do explorador apenas localiza, sem a seta `Toggle Replace` e sem a linha Substituir. O painel tem o título `Explorer`, e a dica de ferramenta do botão da barra de ferramentas é `Explorer (Ctrl + F)` (Windows/Linux) ou `Explorer (⌘ + F)` (Mac) em todo editor. O explorador se abre em um editor somente leitura desde a `4.1.0`; da `3.10.0` à `4.0.0`, o Localizar e substituir se abria ali como um painel flutuante só de localização com o título `Find`.  
As Propriedades da tabela se abrem pelo menu da tabela ou pela vinculação `tableProperties` e, a partir da `3.10.0`, mostram um selo `Read only` ao lado do título, e sua aba `Indexes` não oferece edições — consulte [Propriedades da tabela](../guide/guides/table-related-functions.md#table-properties).  
A aba Configurações tem o mesmo selo `Read only` e mostra cada configuração em um controle que não aceita clique: seus dois interruptores, o campo `Maximum comment width` e os sete botões `Lock` ficam desabilitados, e as linhas de `Column Order` não são arrastadas. Os scripts `Before tables` e `After tables` da aba Esquema SQL não aceitam digitação. A aba [Visualização](../guide/guides/visualization.md) funciona como em um editor editável, já que nada ali edita o documento; `Previous table` e `Next table` do Flow ainda voltam e avançam passos, por seus botões ou pelas teclas de desfazer e refazer.  
A aba [Dicionário](../guide/guides/dictionary.md#read-only-editors) continua se abrindo: suas planilhas podem ser trocadas, pesquisadas, selecionadas, roladas e copiadas, e uma linha da planilha `Checks` ainda leva ao que ela nomeia. Nenhuma célula aceita edição, colagem nem limpeza, a aba não mostra as ferramentas `Add Row`, `Delete Rows`, `Import CSV` nem `Export CSV` nem um menu na grade, e suas combinações de teclas de linha não inserem nem excluem nada. O menu da tabela, o menu do canvas e a pesquisa rápida não oferecem [`Derive Physical Names Again`](../guide/guides/dictionary.md#derive-physical-names-again) nem `Derive Physical Name Again`.

A partir da `5.0.0`, as configurações que quem lê ainda pode alterar ficam na tela desse editor: a rolagem e o zoom, a aba, o banco de dados, a linguagem do Gerador de código, os dois estilos de nome, o tipo de delimitador, as linhas de `View Option` e a [exibição de nomes](../guide/guides/logical-names.md#read-only-editors) em cada um de seus seletores, que fica na tela desde a `4.2.0`. Quaisquer que sejam os seus [bloqueios](../guide/guides/settings.md#lock), nenhuma delas chega a `value`, `runtimeValue`, à exportação `json`, ao histórico de desfazer, ao evento [change](#change) nem a um store compartilhado, então `value` mantém as configurações do documento, não importa como quem lê o esteja olhando. Os painéis de opções do [Esquema SQL](../guide/guides/schema-sql.md#read-only-editors) e do Gerador de código dão a essas configurações a legenda `This window only` enquanto `readonly` está definido, onde os de um editor editável dizem `Saved in the document`. O que as duas abas mostram, copiam e salvam segue a tela, e o mesmo vale para [getSchemaSQL](#getschemasql) chamado sem um fornecedor.  
Antes da `5.0.0`, a rolagem, o zoom, a troca de aba, o banco de dados e as configurações de código de quem lê iam para `value` enquanto nenhum bloqueio os segurava, o que nunca acontece com o banco de dados, e um store compartilhado os enviava aos outros editores.  
As escolhas `This window only` da própria aba Esquema SQL, `Statements`, `Header`, `Write logical names into empty comments` (a partir da `4.2.0`) e `Tables`, nunca são salvas em nenhum editor e continuam valendo, e o mesmo vale para a caixa de diálogo [`Export image`](../guide/guides/file-import-export.md#image), o construtor de temas e o seletor de idioma. Uma escolha no construtor de temas ou no seletor de idioma ainda emite [changePresetTheme](#changepresettheme) ou [changeLocale](#changelocale).

Enquanto ele está definido, nada entra no histórico de desfazer, nem mesmo uma rolagem ou um zoom, e um [store compartilhado](#getsharedstore) do editor não envia nenhuma alteração: apenas o que seus rastreadores enviam do cursor, do foco, da seleção e da caixa de arrasto de quem lê, e os registros que outro editor pede ao entrar (consulte [Edição colaborativa](./advanced/collaborative-editing.md)). Ele continua aplicando todas as alterações que os outros enviam. Uma alteração do banco de dados, de uma configuração do Gerador de código ou de uma linha de `View Option` chega ao documento, e à tela também, a menos que quem lê tenha alterado essa configuração ali, e uma troca compartilhada da exibição de nomes aparece na tela de qualquer forma.

Ativá-lo encerra o que estava aberto: um editor de célula, de nota ou de nome de grupo de tabelas, um relacionamento sendo desenhado, um arrasto de tabela, nota, grupo de tabelas ou coluna, as cópias de um arrasto com Alt, o redimensionamento de uma nota ou de um grupo de tabelas, uma prévia ou um posicionamento do Layout automático ainda em andamento, `Map Columns`, o Time Travel e o seletor de cores. Ele limpa a seleção, solta a ferramenta mão e primeiro envia o que cada store compartilhado ainda retém de um arrasto ou de uma rolagem, como faz [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers). As Propriedades da tabela, agora somente leitura, o Visualizador de diferenças e a caixa de diálogo `Export image` continuam abertos, e a rolagem, o zoom, a aba e a exibição de nomes ficam como estavam. Um elemento que já está somente leitura quando é montado começa da mesma forma, e um que o host move na página mantém o contorno que um salto deixou.  
Desativá-lo traz de volta os controles de edição, sem nada selecionado nem aberto. O banco de dados, a linguagem do Gerador de código, os dois estilos de nome, o tipo de delimitador e as linhas de `View Option` voltam aos do documento, enquanto a rolagem, o zoom, a aba e a exibição de nomes ficam onde quem lê os deixou e `value` mantém os do documento até que quem lê os altere de novo. Nenhuma das duas mudanças emite `change`.  
Um atributo sem valor, `=""` e `="true"` são todos lidos como `true`. `="false"` é lido como `false`, assim como qualquer outra string — incluindo a convenção do HTML `readonly="readonly"`.

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
A partir da `4.0.0`, ativá-lo define o `appearance` do tema como `'system'`, como faz `setPresetTheme({ appearance: 'system' })`. O editor passa então a mostrar o claro ou o escuro que o sistema operacional informa, ou o que [setSystemAppearance](#setsystemappearance) indicar, e alterna quando isso muda.  
Um [setPresetTheme](#setpresettheme) posterior com `'light'` ou `'dark'`, ou uma escolha de `Light` ou `Dark` no construtor de temas ou na pesquisa rápida, substitui `'system'` e permanece: a próxima mudança do sistema operacional não o sobrescreve mais, mesmo que `systemDarkMode` continue `true`. Antes da `4.0.0`, a próxima mudança do sistema operacional o sobrescrevia.  
Desativá-lo enquanto a aparência é `'system'` mantém o claro ou o escuro mostrado naquele momento. Desativá-lo depois que a aparência deixou de ser `'system'` a mantém como está.  
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

Determina se é oferecida uma interface para definir temas predefinidos com facilidade.  
Ele mostra o botão `Theme` da barra de ferramentas, que abre o construtor de temas com `Accent color`, `Gray color` e `Appearance`. A partir da `4.0.0`, `Appearance` oferece `System` ao lado de `Light` e `Dark` e, enquanto ele estiver ativado, a pesquisa rápida lista `Theme` com `System`, `Light` e `Dark`. Consulte [Idioma e tema](../guide/guides/language-and-theme.md).

![Abertura do construtor de temas pela barra de ferramentas, escolha da cor de destaque e do tom de cinza e troca da aparência para Light e depois para System](/img/demo-theme-builder.webp)

```js
editor.enableThemeBuilder = true;
// or
editor.setAttribute('enable-theme-builder', 'true');
```

```html
<erd-editor enable-theme-builder></erd-editor>
```

Alterar o tema predefinido neste painel, ou na pesquisa rápida, emite o evento [changePresetTheme](#changepresettheme).

## enableLocalePicker {#enablelocalepicker}

A partir da `4.0.0`, determina se é oferecida uma interface para escolher o idioma de exibição do editor.  
Ele mostra o botão `Display Language` da barra de ferramentas, depois de `Theme` quando ambos são mostrados. O botão abre o seletor de idioma, e a pesquisa rápida lista `Display Language`. Ambos oferecem `System` e os 25 idiomas — consulte [Idioma e tema](../guide/guides/language-and-theme.md).  
Ele também decide o que um editor mostra antes de [setLocale](#setlocale) ser chamado ou de um idioma ser escolhido: `'system'` enquanto está ativado, inglês enquanto está desativado, de modo que um elemento que não configura nada mantém o inglês que sempre mostrou. Ativá-lo ou desativá-lo alterna entre os dois imediatamente. Depois que um idioma é definido ou escolhido, essa escolha permanece, esteja ele ativado ou desativado.  
Defina-o antes de o elemento ser anexado para que o primeiro quadro siga `'system'`.  
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

A partir da `4.0.0`, determina se um diagrama vazio recebe o usuário com a [tela de boas-vindas](../guide/guides/editing-start.md#welcome-screen).  
Ela fica sobre a aba ERD enquanto o documento não tem nenhuma tabela, nenhuma nota exibida e nenhum grupo de tabelas exibido. Ela não é mostrada enquanto `readonly` está definido, no modo zen, nem enquanto o painel Propriedades da tabela, o visualizador de diferenças, a viagem no tempo ou a pré-visualização do layout automático está aberto. A primeira tabela, nota exibida ou grupo de tabelas exibido a remove, e um desfazer que volta a um diagrama vazio a traz de volta.  
Seus itens `New Table`, `New Memo` e `Command Palette` mostram a primeira combinação de `addTable`, `addMemo` e `search` como [setKeyBindingMap](#setkeybindingmap) as deixou, e nenhuma para um nome deixado vazio. Suas setas apontam para os botões `Theme` e `Display Language` somente onde `enableThemeBuilder` e `enableLocalePicker` os mostram.  
Em seu menu, `↑`, `↓`, `Home` e `End` navegam entre os itens e têm a ação padrão impedida e a propagação interrompida. `Enter` e `Space` têm a propagação interrompida, mas não a ação padrão impedida, para que o item em foco os receba, e `Escape` entre os formatos de `Import` volta, com a ação padrão impedida e a propagação interrompida. Todas as outras teclas chegam ao editor e à página como de costume.  
Ela não altera nada no documento, então deixa `value` como estava e não emite `change`.  
Ative-o depois que [setInitialValue](#setinitialvalue) tiver carregado o documento, como fazem os hosts oficiais, para que a tela nunca pisque sobre um arquivo que ainda está sendo carregado.

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

Obtém o documento atual como uma string JSON, no [esquema](./advanced/schema.md) que o editor define.  
A partir da `4.0.0`, ele é a forma de armazenamento, o documento tal como um arquivo o guarda, que também é o que a exportação `json` escreve e o que os hosts oficiais salvam. Ele contém apenas as entidades ativas, sem as removidas, sem a ordem de empilhamento e sem o que o editor calcula por conta própria, como larguras medidas, marcas de chave e âncoras de relacionamento. As chaves de suas entidades seguem uma ordem fixa, ele é indentado com dois espaços e termina com uma quebra de linha, então o mesmo documento sempre gera os mesmos bytes.  
A partir da `4.2.0`, ele também deixa de fora o que está vazio: uma lista de `doc` vazia, uma coleção vazia, uma linha de dicionário que não contém nada e um campo de texto vazio de uma entidade, como um nome, um comentário, um tipo de dados, um valor padrão ou uma cor. Uma lista dentro de uma entidade, como o `columnIds` de uma tabela, ainda é escrita quando está vazia. O `doc` de um documento novo é `{}`, e ele não tem `collections`, então leia um campo, uma lista ou uma coleção ausente como vazio. Ele contém os nomes lógicos e os sinalizadores de nome derivado de tabelas e colunas, os vínculos das colunas com domínios e as palavras, os termos e os domínios, cada dicionário escrito como um cabeçalho de nomes de campos seguido de suas linhas, uma por linha de texto, na ordem da planilha. Consulte [Forma de armazenamento e valor em tempo de execução](./advanced/schema.md#storage-form-and-runtime-value).  
Cada configuração cujo [bloqueio](../guide/guides/settings.md#lock) está ativado é escrita com o valor em que está bloqueada, não como a tela a mostra. O bloqueio `Viewport` guarda `originX`, `originY` e `zoomLevel`, e `Canvas Type`, `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` e, a partir da `4.2.0`, `Name View` guardam cada um sua própria configuração. A exibição de nomes é escrita como `nameViewMode`, e somente enquanto não é `'physical'`. Todas as outras configurações são escritas como estão, e `lockSettings` é sempre escrito. Consulte [Settings](./advanced/schema.md#settings) para ver os bits; o bit do bloqueio `Name View` é lido ao contrário.  
A partir da `5.0.0`, as configurações que quem lê de um editor [somente leitura](#readonly) altera também são escritas com os valores do documento, bloqueadas ou não, já que ficam nessa tela.  
Um documento novo tem todos os bloqueios ativados, seja o que um elemento mostra antes de receber um valor, seja um carregado a partir de um valor em branco. Seu `value` mantém a origem em `0, 0`, o nível de zoom em `1`, a aba ERD, a linguagem do Gerador de código, os estilos de nome e o tipo de delimitador padrão e, a partir da `4.2.0`, `Physical Names`, até que o bloqueio correspondente seja desativado.  
Antes da `4.0.0`, ele retornava o documento inteiro como o editor o mantinha, com `ignoreSaveSettings` aplicado. O documento tal como o editor o mantém agora é [runtimeValue](#runtimevalue), e `ignoreSaveSettings` não é mais lido nem escrito.

```js
const data = editor.value;
```

### setter {#setter}

Carrega um estado do editor salvo anteriormente. Ele substitui o documento inteiro — o atual é limpo primeiro. A partir da `4.2.0`, isso inclui as palavras, os termos e os domínios: o documento assume os que o texto contém, ou nenhum, e o histórico de desfazer próprio de cada planilha da aba Dicionário é esvaziado.  
Assim como `clear()`, `setInitialValue()` e os métodos `setSchema*` em seu `mode: 'replace'` padrão, ele também descarta a exibição Flow da aba Visualização: seu layout, as tabelas às quais ela está restrita, sua exibição de linhas, o zoom e o deslocamento e, a partir da `4.2.0`, as tabelas que seus `Previous table` e `Next table` percorrem. Um acréscimo (`mode: 'append'`) não a descarta.  
Ele é registrado na lista do histórico, o que habilita `Undo, Redo`, e emite `change`.  
Ele aceita a forma de armazenamento, um [runtimeValue](#runtimevalue) ou um arquivo salvo por uma versão anterior.  
Uma string em branco, ou qualquer coisa que não seja uma string, carrega um documento novo em vez de lançar um erro, então verifique o valor antes de atribuí-lo.  
Esse documento novo é o mesmo que `setInitialValue('')` inicia: vazio, com as configurações padrão e, a partir da `4.0.0`, com todos os bloqueios ativados. Na `3.10.x`, ele não salvava nem a posição de rolagem nem o nível de zoom e, antes disso, salvava ambos.  
Um armazenamento compartilhado retransmite esse carregamento aos colaboradores com o JSON completo do documento novo, então todo par, mesmo um de uma versão mais antiga, o carrega, embora um editor anterior à `4.2.0` descarte o que não conhece, como os nomes lógicos, os vínculos com domínios e os dicionários — consulte [Misturar versões](./advanced/collaborative-editing.md#mixing-releases).  
A partir da `4.0.0`, os bloqueios do documento carregado, e os valores bloqueados que `value` passa a escrever, vêm do texto, e a área visível fica onde o texto a coloca, ou sobre o diagrama quando nenhuma parte dele é desenhada ali. Para cada uma das outras configurações que o texto bloqueia — a aba, a linguagem do Gerador de código, os estilos de nome, o tipo de delimitador e, a partir da `4.2.0`, a exibição de nomes — o editor continua mostrando o que mostrava antes do carregamento. Uma configuração que o texto deixa desbloqueada assume o valor do texto. Um arquivo salvo antes da `4.2.0` não indica nenhum bloqueio `Name View`, a menos que um editor da `4.2.0` tenha desativado esse bloqueio nele, então ele carrega com a exibição de nomes bloqueada em `Physical Names`, e o editor mantém a exibição de nomes que mostrava. Já [setInitialValue](#setinitialvalue) assume todos os valores que o texto contém; consulte-o também para um texto que não indica nenhum bloqueio.  
Um texto que não é JSON, como um arquivo que ficou com marcadores de conflito de merge, também não lança erro: o documento é esvaziado, suas configurações ficam como estavam e o erro de análise é registrado no console.  
Ele é ignorado enquanto `readonly` está definido; use [setInitialValue](#setinitialvalue) para carregar em um editor somente leitura.

```js
editor.value = 'json...';
```

## runtimeValue {#runtimevalue}

A partir da `4.0.0`, obtém o documento como este editor o mantém, como uma string JSON. Ele não tem setter, então atribuí-lo lança um erro em código no modo estrito.  
Ele traz o que [value](#value) deixa de fora: as entidades removidas e sua ordem, a ordem de empilhamento, as larguras medidas, as marcas de chave, as âncoras de relacionamento e as sequências e, a partir da `4.2.0`, os campos de texto vazios, as listas de `doc` vazias e as coleções vazias; as linhas removidas de uma planilha da aba Dicionário e as que não contêm nada; a chave de ordem de cada linha de dicionário; as listas de `doc` de palavras, termos e domínios; e um vínculo com um domínio removido. As configurações bloqueadas também são escritas aqui com seus valores bloqueados.  
Use-o para inicializar, por meio do [setInitialValue](#setinitialvalue) dele, outro editor que entra em uma sessão já em andamento, como um colaborador ou uma segunda exibição do mesmo documento. Um desfazer de uma remoção que a sessão envie depois restaura então a entidade inteira ali, enquanto um editor inicializado a partir de `value` não contém nenhuma entidade removida e, em vez disso, restaura uma tabela vazia e sem nome ou, a partir da `4.2.0`, uma linha de dicionário vazia. Consulte [Edição colaborativa](./advanced/collaborative-editing.md).  
As entidades removidas não são mais coletadas, então elas permanecem nele até a próxima vez que o documento for aberto a partir de seu arquivo.  
Nunca o escreva em um arquivo: salve `value`, que o [JSON Schema](./advanced/schema.md#json-schema) aceita, ao contrário deste.

```js
otherEditor.setInitialValue(editor.runtimeValue);
```

## setInitialValue {#setinitialvalue}

Carrega um estado do editor salvo anteriormente. O carregamento em si não é registrado na lista do histórico, então não pode ser desfeito, e nenhum evento `change` é emitido.  
Ele também limpa o histórico de desfazer, então nada feito antes do carregamento pode ser desfeito ou refeito sobre o documento carregado, e, a partir da `4.2.0`, limpa também o histórico próprio de cada planilha da aba Dicionário.  
Ele aceita a forma de armazenamento, um [runtimeValue](#runtimevalue) ou um arquivo salvo por uma versão anterior e, ao contrário de atribuir `value`, assume todas as configurações que o texto contém, incluindo a aba e as configurações de código.  
Uma string em branco, ou qualquer coisa que não seja uma string, carrega um documento novo em vez de lançar um erro, então `setInitialValue('')` inicia um diagrama em branco.  
A partir da `4.0.0`, esse documento novo, que também é o que um elemento mostra antes de receber qualquer valor, tem todos os bloqueios ativados. Rolar, aplicar zoom, trocar de aba e alterar a linguagem do Gerador de código, os estilos de nome, o tipo de delimitador ou, a partir da `4.2.0`, a exibição de nomes deixam `value` como estava e não emitem `change`. Na `3.10.x`, ele não salvava nem a posição de rolagem nem o nível de zoom e, antes disso, salvava ambos.  
Um documento carregado a partir de texto mantém os bloqueios que indica. Um que não indica nenhum — qualquer arquivo salvo antes da `4.0.0`, seja qual for o valor de seu `ignoreSaveSettings`, e um arquivo `.vuerd` v2 — abre com todos os bloqueios ativados, seu `Viewport` bloqueado na origem `0, 0` e no nível de zoom `1`, na aba ERD, com sua linguagem, seus estilos de nome e seu tipo de delimitador como os salvou.  
A partir da `4.2.0`, um texto que indica seus bloqueios, mas não o bloqueio `Name View`, também abre com esse bloqueio ativado, mesmo quando todos os outros bloqueios estão desativados. Um arquivo salvo antes da `4.2.0` é um texto assim, a menos que um editor da `4.2.0` tenha desativado esse bloqueio nele (consulte [Settings](./advanced/schema.md#settings)). Ele abre em `Physical Names`, como faz um que não indica bloqueio nenhum.  
De qualquer forma, a área visível abre na área visível do documento — a que o texto salvou quando indica seus bloqueios, a origem `0, 0` no nível de zoom `1` quando não indica nenhum — ou sobre o diagrama quando nenhuma parte dele é desenhada ali. Um `Viewport` bloqueado ainda mantém seus valores bloqueados em `value`.  
A partir da `4.0.0`, ele também descarta o estado de colaboração do documento mantido antes, e um [armazenamento compartilhado](#getsharedstore) deste editor que já tenha assinado pede de novo o estado dos outros editores, para que um editor recarregado em uma sessão em andamento se atualize. Inicialize esse editor com o [runtimeValue](#runtimevalue) de outro editor.  
Um texto que não é JSON também não lança erro: o documento é esvaziado, suas configurações ficam como estavam e o erro de análise é registrado no console.  
Ao contrário de atribuir `value`, ele não é bloqueado por `readonly`, então é assim que se carrega um documento em um editor somente leitura. Um editor somente leitura passa então a mostrar as configurações que o texto carregado contém, descartando as que quem lê havia alterado na tela.

```js
editor.setInitialValue('json...');
```

Carregue ao iniciar, salve a cada alteração.

```js
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

## Eventos {#event}

`change`, `changePresetTheme` e `changeLocale` são os três únicos eventos públicos; `changeLocale` é novo na `4.0.0`.  
O elemento também despacha em si mesmo eventos internos `@dineug/erd-editor/internal-*` para seu próprio funcionamento interno; eles não fazem parte da API.

### change {#change}

Quando há alterações no editor, ele emite um evento.  
O evento tem debounce de 200 ms e não é emitido enquanto `readonly` é `true`.  
Ele é disparado por qualquer alteração no documento — uma edição na interface, atribuir `value`, `clear()`, cada um dos métodos `setSchema*` e, a partir da `4.0.0`, `setSchemaJSON()` e `Import and Add`. `setInitialValue` não o emite.  
A partir da `4.2.0`, isso inclui toda edição na aba [Dicionário](../guide/guides/dictionary.md) e todo desfazer ou refazer de uma delas, uma alteração de um nome lógico ou de um vínculo com domínio, `Derive Physical Names Again` e uma troca da exibição de nomes enquanto o bloqueio `Name View` está desativado.  
Nada do que se faz no modo Flow da aba Visualização o emite — zoom, deslocamento da área visível, mover cartões, `Tidy Up`, a exibição de linhas, restringir a exibição a partir de um cartão ou, a partir da `4.2.0`, voltar e avançar passos com `Previous table` e `Next table` ou com as teclas de desfazer e refazer — porque nada disso é uma alteração no documento. Sua lista `Name View` é a exceção: uma troca nela o emite enquanto o bloqueio `Name View` está desativado, como acontece com uma troca na aba ERD.  
A partir da `4.0.0`, uma alteração em uma configuração cujo [bloqueio](../guide/guides/settings.md#lock) está ativado também não o emite, porque ela muda apenas a tela e nunca `value`: uma rolagem ou um zoom do canvas ERD enquanto `Viewport` está bloqueado, uma troca de aba enquanto `Canvas Type` está bloqueado, uma alteração da linguagem do Gerador de código, do estilo do nome da tabela, do estilo do nome da coluna ou do tipo de delimitador enquanto seu próprio bloqueio está ativado e, a partir da `4.2.0`, uma troca da exibição de nomes enquanto `Name View` está bloqueado. Somente essas alterações ficam de fora, então um lote que também edita o documento ainda o emite. Bloquear ou desbloquear uma configuração o emite.  
Todos os bloqueios estão ativados em um documento novo e em qualquer arquivo salvo antes da `4.0.0`, e o bloqueio `Name View` está ativado em qualquer arquivo salvo antes da `4.2.0`, a menos que um editor da `4.2.0` o tenha desativado ali, então, por padrão, rolar, aplicar zoom, trocar de aba e trocar a exibição de nomes não emitem nada. Isso inclui focar em tabelas a partir da aba ERD, o botão de link externo do cartão que leva do Flow de volta à aba ERD, ir para uma linha do explorador ou para uma correspondência da pesquisa, abrir o explorador ou ir para um resultado da pesquisa rápida a partir de outra aba e, a partir da `4.2.0`, ir para uma tabela ou coluna a partir de uma linha da planilha `Checks` da aba Dicionário. Cada uma dessas ações emite um `change` somente enquanto um bloqueio que a abrange está desativado: `Canvas Type` para a troca de aba e `Viewport` para a rolagem que um botão do cartão, um resultado da pesquisa rápida, uma linha do explorador, uma correspondência da pesquisa ou uma linha de `Checks` também faz. A partir da `4.1.0`, cada uma dessas rolagens segue uma única regra, [Onde um salto termina](../guide/guides/table-related-functions.md#where-a-jump-lands), então um resultado de tabela da pesquisa rápida não rola mais toda vez, e um salto que a regra deixa no lugar não faz nenhuma rolagem que o emita. Abrir, fechar ou redimensionar o explorador estreita ou alarga o canvas sem mover sua origem e também não emite nada. Antes da `4.0.0`, rolar, aplicar zoom e trocar de aba sempre o emitiam, mesmo quando `editor.value` saía igual.  
Para evitar gravações que não mudam nada, compare `editor.value` com o último valor que você armazenou, não com o arquivo que carregou: um arquivo escrito por uma versão anterior, um arquivo v2 ou um editado à mão pode sair diferente em `value` assim que é carregado, porque `value` o escreve na forma de armazenamento. O mesmo pode acontecer com um arquivo cujo bloqueio `Viewport` está desativado e cuja origem não desenha nenhuma parte do diagrama nesta tela: o carregamento move a área visível para o diagrama, e `value` escreve onde ela fica. A partir da `4.0.0`, as larguras medidas não causam mais isso, porque `value` não contém nenhuma. A partir da `4.2.0`, um arquivo salvo pela `4.0.0` ou pela `4.1.0` também pode sair diferente, já que `value` agora deixa de fora seus campos de texto, listas e coleções vazios, então um arquivo assim é reescrito uma vez, no próximo salvamento. Em vez disso, um host que escreve arquivos pode distinguir uma edição de uma mudança da área visível com o `changed` de um armazenamento de replicação — consulte [on@change](./advanced/remote-storage.md#onchange).  
O evento não traz `detail`, não se propaga e não atravessa a fronteira do shadow root, então escute no próprio elemento e leia `editor.value` no listener.

```js
editor.addEventListener('change', event => {
  const data = event.target.value;
});
```

### changePresetTheme {#changepresettheme}

Emitido quando o tema predefinido é alterado pelo construtor de temas integrado ou, a partir da `4.0.0`, por `Theme` na pesquisa rápida. Toda escolha o emite, incluindo a escolha da opção já em vigor.  
Chamar você mesmo [setPresetTheme](#setpresettheme) ou [setSystemAppearance](#setsystemappearance), ou ativar ou desativar [systemDarkMode](#systemdarkmode), não o emite.  
`event.detail` é o `ThemeOptions` completo após a escolha — `{ appearance, grayColor, accentColor }` — e não o objeto parcial que foi solicitado. A partir da `4.0.0`, seu `appearance` é `'system'` enquanto `System` está escolhido, e não o claro ou o escuro que ele mostra, então armazene-o como está e devolva-o a `setPresetTheme`.

```js
editor.addEventListener('changePresetTheme', event => {
  const themeOptions = event.detail;
});
```

### changeLocale {#changelocale}

A partir da `4.0.0`, emitido quando um idioma é escolhido no editor, pelo seletor de idioma ou por `Display Language` na pesquisa rápida, ambos ativados por [enableLocalePicker](#enablelocalepicker).  
Ele é disparado depois que o idioma é aplicado, a cada escolha, incluindo a escolha da opção já em vigor. [setLocale](#setlocale) e [setSystemLocale](#setsystemlocale) nunca o emitem, nem uma mudança dos idiomas do navegador. Uma troca de idioma não emite `change`.  
`event.detail` é `{ locale }`, um `LocaleOption`: `'system'` quando `System` foi escolhido e, caso contrário, o código do idioma. O elemento não memoriza a escolha, então armazene-a e passe-a a `setLocale` no próximo carregamento.  
Assim como `change`, ele não se propaga, então escute no próprio elemento.

```js
editor.addEventListener('changeLocale', event => {
  const { locale } = event.detail; // 'system' | 'ko-KR' | ...
});
```

## focus {#focus}

Coloca o foco no editor.

```js
editor.focus();
```

## blur {#blur}

Remove o foco do editor.

```js
editor.blur();
```

## clear {#clear}

Esvazia o documento, removendo todas as tabelas, colunas, relacionamentos, índices e notas, a partir da `4.0.0`, todos os grupos de tabelas e, a partir da `4.2.0`, as palavras, os termos e os domínios da aba Dicionário, esvaziando também o histórico de desfazer próprio de cada planilha.  
Todas as configurações permanecem, incluindo o banco de dados, a posição da área visível, o nível de zoom, as opções de exibição da tabela, cada bloqueio com o valor que guarda e os scripts `Before tables` e `After tables` da aba Esquema SQL, então um arquivo limpo continua salvando o que salvava. Para iniciar um documento novo em vez disso, atribua `''` a `value` ou chame `setInitialValue('')`.  
Ele é registrado na lista do histórico, então pode ser desfeito, e emite `change`. Um desfazer traz o documento de volta como o editor o mantinha, incluindo suas palavras, seus termos e seus domínios, cada configuração bloqueada com seu valor bloqueado. Ele é ignorado enquanto `readonly` está definido.

```js
editor.clear();
```

## destroy {#destroy}

Destrói completamente a instância do editor, de modo que ela não possa mais ser reutilizada.  
Libera os listeners e as assinaturas do editor e destrói todos os armazenamentos compartilhados retornados por [getSharedStore](#getsharedstore).  
Um lote de fluxo que um armazenamento compartilhado ainda esteja retendo é descartado junto; chame antes o [flushStreamBuffers](./advanced/collaborative-editing.md#flushstreambuffers) desse armazenamento para enviá-lo.

```js
editor.destroy();
```

## setKeyBindingMap {#setkeybindingmap}

Redefine os atalhos de teclado.  
`edit`, `stop`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` são fixos e não podem ser redefinidos.  
Somente os vinte e um nomes abaixo são escritos; qualquer outra coisa no objeto é ignorada, incluindo os nomes fixos.  
A partir da `3.10.0`, `search` pode ser redefinido, e `findReplace` é novo. Antes, `search` era fixo. A partir da `4.0.0`, `removeSelection` é novo. A partir da `4.1.0`, `addTableGroup` e `groupSelectedTables` são novos.  
O valor de uma vinculação deve ser um `ShortcutOption[]`. Uma string simples é ignorada, então escreva `{ addTable: [{ shortcut: 'Alt+KeyN' }] }` em vez de `{ addTable: 'Alt+KeyN' }`.  
Um array vazio é aceito e não vincula nada: `setKeyBindingMap({ findReplace: [] })` deixa `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) para a página, e `{ search: [] }` faz o mesmo com `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac). O botão `Search` da barra de ferramentas ainda abre a pesquisa rápida, o botão `Explorer` da barra de ferramentas ainda abre e fecha o explorador, e `Toggle Explorer` na pesquisa rápida e no menu de contexto do canvas ainda abre a pesquisa dele ou o fecha; nenhum deles mostra um atalho para um nome deixado vazio. `{ removeSelection: [] }` deixa `Delete` e `Backspace` para a página, e os itens de exclusão dos menus de tabela, de nota e de grupo de tabelas (`Delete`, `Delete selected`, `Delete column`, `Delete columns`) passam a não mostrar atalho.  
A partir da `4.1.0`, `{ addTableGroup: [] }` deixa `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) para a página, e `{ groupSelectedTables: [] }` deixa `T` e depois `G`. `New Table Group` na barra de ferramentas do canvas, no menu de contexto do canvas e na pesquisa rápida, `Group selected tables` no menu da tabela e `Group Selected Tables` na pesquisa rápida continuam funcionando, sem mostrar atalho. As dicas de ferramenta dos botões `New Table`, `New Memo` e `New Table Group` da barra de ferramentas do canvas indicam a primeira combinação de `addTable`, `addMemo` e `addTableGroup`, ou apenas o botão para uma vinculação deixada vazia.  
A partir da `4.2.0`, `addColumn` e `removeColumn` também dão à grade da aba Dicionário suas combinações de teclas de linha, como descrito abaixo, então reatribuir qualquer uma delas leva essas combinações junto. `{ addColumn: [] }` deixa a grade sem combinação para inserir linhas, e os dois itens de inserção do menu da grade passam a não mostrar atalho; `{ removeColumn: [] }` a deixa sem nenhuma para excluí-las, e o item de exclusão do menu e a dica de ferramenta de `Delete Rows` passam a não mostrar nenhum.  
A chamada é uma mesclagem parcial: os nomes que você omitir mantêm seus padrões, e chamar o método duas vezes mantém as alterações anteriores. Não há getter para as vinculações atuais: [createKeyBindingMap](#createkeybindingmap) retorna os padrões, e não o que `setKeyBindingMap` alterou.

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

`selectAllTable`, `handTool`, `removeSelection` e, a partir da `4.1.0`, `groupSelectedTables` cedem a vez ao cursor de texto: enquanto o foco está em um input, um textarea ou um `contenteditable`, `$mod + A` seleciona o texto, `Space` digita um espaço, `Delete` e `Backspace` apagam texto e `T` e depois `G` digitam as duas letras, em vez de chegar ao canvas. Nenhum desses pressionamentos tem a ação padrão impedida. Qualquer tecla a que você as reatribuir se comporta da mesma forma.

A partir da `4.0.0`, `removeSelection` (`Delete` ou `Backspace`) remove a seleção na aba ERD como uma única etapa de desfazer, sem perguntar. Quando a tabela em foco é a única coisa selecionada, uma ou mais de suas colunas estão selecionadas e o zoom desenha suas linhas, remove essas colunas; caso contrário, remove todas as tabelas, notas e grupos de tabelas selecionados, mantendo as tabelas de um grupo. Consulte [Exclusão de tabelas e notas](../guide/guides/table-related-functions.md#table-and-memo-deletion).  
Uma tecla mantida pressionada remove uma única vez, e nada é removido enquanto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas está aberto. Fora de um campo de texto e dos painéis e das abas que retêm as vinculações (consulte [createKeyBindingMap](#createkeybindingmap)), o pressionamento tem a ação padrão impedida em todas as abas enquanto o editor tem o foco, também em um botão da barra de ferramentas em foco, e em um editor somente leitura, onde não remove nada.

A partir da `4.1.0`, `addTableGroup` (`Alt+KeyG`) prepara o desenho de `New Table Group` na aba ERD, cujo próximo pressionamento do botão principal no canvas desenha o grupo, e pressionar de novo cancela o desenho, como faz o botão `New Table Group` da barra de ferramentas do canvas. `groupSelectedTables` (`KeyT KeyG`, `T` e depois `G`) coloca as tabelas selecionadas em um novo grupo e abre o editor de nome dele, como faz `Group selected tables` no menu de contexto de uma tabela. Sem nenhuma tabela selecionada, não adiciona nada; uma nota ou um grupo de tabelas selecionado não conta. Consulte [Desenhar um grupo](../guide/guides/table-groups.md#drawing-a-group) e [Agrupar tabelas selecionadas](../guide/guides/table-groups.md#grouping-selected-tables).  
Ambas só agem onde os menus oferecem um grupo: não enquanto `readonly` está definido, enquanto a opção de exibição `Table Groups` oculta os grupos ou enquanto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas está aberto. Assim como as outras vinculações do canvas, elas só agem na aba ERD, e não enquanto a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a viagem no tempo, a pré-visualização do layout automático, `Export image` ou `Map Columns` está aberto. Onde não fazem nada, o pressionamento ainda tem a ação padrão impedida, a menos que `groupSelectedTables` ceda a vez ao cursor de texto. `addTableGroup` também tem a propagação interrompida, assim como `focusView` e `zenMode`, então o listener de `keydown` da página na fase de propagação nunca o recebe.

A partir da `4.2.0`, na aba [Dicionário](../guide/guides/dictionary.md#adding-and-deleting-rows), cada combinação de um só pressionamento de `addColumn` insere abaixo da seleção tantas linhas quantas a seleção abrange, a mesma combinação com `Shift` também pressionado as insere acima, e cada combinação de um só pressionamento de `removeColumn` exclui as linhas que a seleção abrange: `Alt+Enter`, `Alt+Shift+Enter` e `Alt+Backspace` ou `Alt+Delete` com os padrões. Elas agem na grade das planilhas `Domains`, `Words` e `Terms` enquanto nenhuma edição de célula está aberta. Uma combinação de `addColumn` que já contém `Shift` não gera nenhuma combinação para inserir acima, e uma sequência vinculada a qualquer um dos dois nomes não dá nada à grade.  
Cada um desses pressionamentos tem a ação padrão impedida conforme indica sua opção e sempre tem a propagação interrompida, então não adiciona nem remove nenhuma coluna na aba ERD. Na planilha `Checks` e em um editor somente leitura, ele não faz nada, embora ainda tenha a ação padrão impedida e a propagação interrompida. Em uma edição de célula aberta ou no campo de pesquisa da aba, as combinações ficam para o texto: ali elas têm a propagação interrompida, mas não a ação padrão impedida, então o campo age sobre elas como agiria em qualquer lugar (no Mac, `⌥ + Backspace` apaga uma palavra). [dictionaryRowChords](#dictionaryrowchords) as lista.

A partir da `3.10.0`, `findReplace` (`$mod+KeyF`) abre o [Localizar e substituir](../guide/guides/find-and-replace.md). A partir da `4.1.0`, ela alterna o [explorador](../guide/guides/explorer.md#opening-and-closing) que o contém, e a aba Atalhos a lista como `Toggle Explorer`.  
Enquanto o botão `Explorer` da barra de ferramentas aparece pressionado (o explorador aberto na aba ERD e não oculto pelo modo zen), ela fecha o explorador, a menos que a pesquisa rápida, o painel Propriedades da tabela, o construtor de temas, o seletor de idioma, a caixa de diálogo `Export image` ou `Map Columns` esteja aberto. Caso contrário, ela fecha o que estiver aberto entre esses, traz a aba ERD a partir de qualquer outra aba e abre o explorador com o cursor de texto no campo `Find` e o termo de pesquisa selecionado. Um editor estreito demais para mostrar o explorador ao lado do canvas o mantém aberto, mas oculto, e mostra a notificação `Widen the window to show the Explorer`. Antes da `4.1.0`, ela abria o painel flutuante Localizar e substituir, ou devolvia o teclado ao campo dele, e nunca o fechava.  
Ela não cede a vez ao cursor de texto: enquanto o editor está em foco, ela é tratada em todas as abas, a partir do canvas ou de um input dentro do editor. O pressionamento tem a ação padrão impedida, então o navegador não abre nenhuma barra de localização, e a propagação interrompida, então nenhum listener de `keydown` da página na fase de propagação o recebe. Com o editor de uma célula ou de uma nota aberto, a partir da `4.0.0`, o editor do nome de um grupo de tabelas ou, a partir da `4.2.0`, uma edição de célula na grade da aba Dicionário, ela ainda tem a ação padrão impedida e a propagação interrompida, mas não faz nada. Nesse último caso, `search` também não faz nada, então o texto digitado até ali permanece.  
Enquanto o visualizador de diferenças, a viagem no tempo ou a pré-visualização do layout automático está aberto, em qualquer aba, ou enquanto um IME ainda está compondo, ela não tem a ação padrão impedida nem a propagação interrompida, então a localização do próprio navegador ou do host a recebe. Dentro do explorador, um pressionamento ainda em composição tem a propagação interrompida ali, embora não a ação padrão impedida. Qualquer tecla a que você reatribuir `findReplace` se comporta da mesma forma.

`focusView` age somente na aba ERD. Com pelo menos uma tabela selecionada, ela abre a aba Visualização no modo Flow, restrita a essas tabelas e a todas as tabelas a um relacionamento de distância; uma nota ou um grupo de tabelas selecionado não conta e, sem nenhuma tabela selecionada, ela não faz nada. Consulte [Focar em tabelas](../guide/guides/visualization.md#focusing-on-tables).

`undo` e `redo` agem conforme a aba. Na aba ERD, desfazem e refazem o histórico do documento. A partir da `4.2.0`, na aba Dicionário, desfazem e refazem o histórico próprio da planilha mostrada, e nada na planilha `Checks` — consulte [Planilhas do dicionário](../guide/guides/undo-redo.md#dictionary-sheets). No modo Flow da aba Visualização, voltam e avançam passos como fazem [`Previous table` e `Next table`](../guide/guides/visualization.md#previous-table-and-next-table), sem mexer no histórico do documento. Nas outras abas, e no modo Graph, não desfazem nada.

`stop` (`Escape`) na aba ERD encerra um editor de célula ou de nota aberto, ou um relacionamento sendo desenhado, e deixa a seleção como está. A partir da `4.0.0`, também encerra um editor de nome de grupo de tabelas, sem escrever nenhum nome, e um desenho de `New Table Group`. O editor chama `preventDefault()` nesse pressionamento.  
Quando nenhum deles está aberto, `Escape` limpa a seleção e a célula em foco, e não tem a ação padrão impedida. Portanto, sair de uma edição e limpar a seleção exige dois pressionamentos.  
A partir da `4.2.0`, enquanto a lista de termos de uma célula de nome lógico aparece (consulte [Completar nomes de termos](../guide/guides/logical-names.md#completing-term-names)), o primeiro `Escape` fecha só a lista e deixa o editor aberto. Esse pressionamento tem a ação padrão impedida e a propagação interrompida na célula, então nem `stop` nem o listener de `keydown` da página na fase de propagação o recebe.  
Exceto no explorador, nos formatos de `Import` da [tela de boas-vindas](#enablewelcomescreen), na lista de termos de uma célula de nome lógico, na aba [Dicionário](../guide/guides/dictionary.md#keys-on-the-tab) e nos seletores e caixas de diálogo abaixo, o editor nunca impede a propagação de `Escape`, então uma página que o escuta por conta própria, para fechar uma caixa de diálogo própria, por exemplo, recebe ambos os pressionamentos e pode ignorar aquele cujo `defaultPrevented` é `true`.  
Enquanto a pesquisa rápida, o painel Propriedades da tabela, o visualizador de diferenças, a pré-visualização do layout automático ou a viagem no tempo está aberto, `Escape`, em vez disso, fecha o que estiver aberto e deixa a seleção como está. Esse pressionamento também não tem a ação padrão impedida.  
A partir da `4.0.0`, uma caixa de diálogo [`Export image`](../guide/guides/file-import-export.md#image) ou [`Map Columns`](../guide/guides/relationship-editing.md#map-columns) aberta também recebe `Escape`, fechando-se e deixando a seleção como está. Cada uma toma o teclado quando se abre, e esse `Escape` tem tanto a ação padrão impedida quanto a propagação interrompida.  
A partir da `4.1.0`, um `Escape` pressionado com o foco dentro do [explorador](../guide/guides/explorer.md#keys-in-the-explorer), em sua árvore, em seus campos ou em seus botões, devolve o teclado ao canvas e deixa o explorador aberto e a seleção como está. O editor chama tanto `preventDefault()` quanto `stopPropagation()` nele, então ele nunca chega ao listener de `keydown` da página na fase de propagação.  
Um `Escape` no canvas nunca fecha o explorador. Antes da `4.1.0`, um `Escape` dentro do painel Localizar e substituir o fechava, e um no canvas o fechava no mesmo pressionamento que limpava a seleção.  
A partir da `4.0.0`, o seletor de idioma e o seletor de cores se fecham com `Escape`: dentro deles, ele tem a ação padrão impedida e a propagação interrompida e, no canvas, ele os fecha no mesmo pressionamento que limpa a seleção, sem ter a ação padrão impedida nem a propagação interrompida.  
Um `Escape` pressionado enquanto um IME ainda está compondo pertence à composição. Ele deixa um editor aberto como está e não tem a ação padrão impedida, então uma página também pode ignorar um pressionamento cujo `isComposing` é `true`, ou cujo `keyCode` é `229`. Dentro do explorador, esse pressionamento, como qualquer tecla pressionada ali no meio de uma composição, também tem a propagação interrompida, e o teclado permanece no campo.  
Antes da `3.9.2`, um único `Escape` tanto encerrava uma edição ou um desenho quanto limpava a seleção, e o editor nunca impedia sua ação padrão.

### createKeyBindingMap {#createkeybindingmap}

A partir da `3.9.2`, o pacote exporta `createKeyBindingMap()` e, com ela, os tipos `KeyBindingMap`, `KeyBindingName` e `ShortcutOption`.  
Ela retorna as combinações de teclas padrão, todos os 28 nomes, incluindo os fixos, como um novo mapa a cada chamada, então alterar o mapa que ela retorna não altera mais nada.  
É desse mapa que todo editor parte, e uma chamada a `setKeyBindingMap` não se reflete nele.  
Destes quatro, somente `createKeyBindingMap` é uma exportação em tempo de execução; os outros três são tipos. A partir da `4.2.0`, [dictionaryRowChords](#dictionaryrowchords) é exportada ao lado dela.

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

Cada `shortcut` é uma combinação na sintaxe do [tinykeys](https://github.com/jamiebuilds/tinykeys) que nomeia sua tecla pelo `KeyboardEvent.code`, em que [`$mod`](#mod) é `⌘` no macOS e `Control` nos demais sistemas.  
A partir da `4.0.0`, o próprio editor lê essas combinações, em vez de usar o tinykeys, na mesma sintaxe. Uma tecla corresponde pelo seu `code`, ou pelo seu `key` em maiúsculas ou minúsculas, e um pressionamento só corresponde quando estão pressionadas exatamente as teclas modificadoras que a combinação nomeia. `AltGraph` conta como `Control` e `Alt` no Windows e como `Alt` no macOS. Pressionamentos separados por um espaço formam uma sequência, que recomeça após um segundo sem keydown.  
A partir da `4.1.0`, um dos padrões é uma sequência: `groupSelectedTables` é `KeyT KeyG`, `T` e depois `G`. Uma sequência é executada no pressionamento que a completa, e somente esse pressionamento recebe seus `preventDefault` e `stopPropagation`, então, com os padrões, `T` chega à página e somente `G` tem a ação padrão impedida. Os menus, a pesquisa rápida e a aba Atalhos mostram uma sequência como uma tecla por pressionamento.  
Os nomes fixos estão vinculados a `Enter` (`edit`), `Escape` (`stop`), `$mod+KeyZ` (`undo`), `$mod+Shift+KeyZ` (`redo`), `$mod+Equal` (`zoomIn`), `$mod+Minus` (`zoomOut`) e `$mod+Digit0` (`zoomReset`). `edit` e `stop` não têm sinalizadores; os outros cinco têm `preventDefault` e `stopPropagation`. Os demais são os padrões acima, entre eles `search` e `findReplace`.

O editor escuta essas combinações em seu próprio elemento, então um host que captura teclas antes do editor, com atalhos globais ou um listener de `keydown` na fase de captura, precisa deixá-las passar enquanto o editor está em foco.  
Monte a lista do que deixar passar a partir de `createKeyBindingMap()`, com as vinculações que você passou a `setKeyBindingMap` no lugar dos padrões.  
A partir da `3.10.0`, essa lista inclui `$mod+KeyF`, a combinação de localização do próprio navegador. Um host que queira manter sua própria localização nessa combinação passa `setKeyBindingMap({ findReplace: [] })`.  
A partir da `4.0.0`, ela também inclui `Delete` e `Backspace` sem modificadores. Um host que queira manter essas teclas passa `setKeyBindingMap({ removeSelection: [] })`.  
A partir da `4.1.0`, ela também inclui `Alt+KeyG` e a sequência `KeyT KeyG`, que vem como uma única string: divida-a no espaço e deixe passar cada pressionamento, incluindo `T` e `G` sem modificadores, já que uma sequência à qual falta um pressionamento nunca se completa. Um host que queira manter essas teclas passa `setKeyBindingMap({ addTableGroup: [] })` ou `setKeyBindingMap({ groupSelectedTables: [] })`.  
A partir da `4.2.0`, acrescente a ela as combinações que [dictionaryRowChords](#dictionaryrowchords) retorna para o mesmo mapa, entre elas `Alt+Shift+Enter`. Um host que queira manter essas teclas passa `setKeyBindingMap({ addColumn: [] })` ou `setKeyBindingMap({ removeColumn: [] })`, o que também as tira da adição e da remoção de colunas na aba ERD.

Enquanto o foco está dentro do explorador, em sua árvore, em seus campos `Find` e `Replace` ou em seus botões, `findReplace`, `search`, `undo`, `redo`, `zoomIn`, `zoomOut` e `zoomReset` passam para o editor, então `findReplace` age ali como no canvas. Todas as outras vinculações, como estão definidas no momento, param no explorador, uma sequência pelo seu último pressionamento (um `G` sem modificadores com os padrões), e o mesmo acontece com as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla pressionada enquanto um IME ainda está compondo. Exceto `Escape`, que devolve o teclado ao canvas, elas têm a propagação interrompida sem ter a ação padrão impedida, então agem como teclas comuns nos campos, nos botões e na árvore do explorador e não chegam nem ao canvas nem ao listener de `keydown` da página na fase de propagação: ali, `Alt + N` não adiciona nenhuma tabela, e `Delete` não remove nada. As teclas que movem, recolhem ou vão para uma linha da árvore, e `Enter` no campo `Find` ou `Replace`, que percorre as correspondências ou substitui, também têm a ação padrão impedida.  
Qualquer outra tecla, como a combinação de salvar ou da paleta de comandos de um host, segue para a página como de costume. Consulte [Teclas no explorador](../guide/guides/explorer.md#keys-in-the-explorer). Antes da `4.1.0`, o painel flutuante Localizar e substituir retinha as teclas da mesma forma, exceto `Home`, `End`, o último pressionamento de uma sequência e `Space` enquanto `handTool` estava vinculada a outra tecla.  
A partir da `4.0.0`, o seletor de idioma retém as teclas da mesma forma: as mesmas sete vinculações passam, e todas as outras vinculações (a partir da `4.1.0`, uma sequência pelo seu último pressionamento), as teclas de seta e `Tab` têm a propagação interrompida ali sem ter a ação padrão impedida, assim como qualquer tecla pressionada enquanto um IME ainda está compondo. `↑`, `↓`, `Home`, `End`, `Enter` e `Space` em uma de suas linhas percorrem as linhas ou escolhem uma e também têm a ação padrão impedida.

A partir da `4.2.0`, a aba [Dicionário](../guide/guides/dictionary.md#keys-on-the-tab) também retém teclas, e só `search`, `findReplace`, `undo` e `redo` passam para o editor. `undo` e `redo` executam o histórico próprio da planilha mostrada e, com uma edição de célula aberta ou com o foco no campo de pesquisa da aba, ficam para o texto, com a propagação interrompida ali, mas sem a ação padrão impedida. `search` e `findReplace` não fazem nada enquanto uma edição de célula está aberta, como descrito acima. As combinações de teclas de linha agem na grade, como descrito acima em `addColumn` e `removeColumn`.  
Todas as outras vinculações, como estão definidas no momento, param na aba, uma sequência pelo seu último pressionamento, e o mesmo acontece com as teclas de seta, `Tab`, `Enter`, `Space`, `Home`, `End` e qualquer tecla pressionada enquanto um IME ainda está compondo. Nenhuma delas chega ao canvas nem ao listener de `keydown` da página na fase de propagação: ali, `Alt + N` não adiciona nenhuma tabela, e `Delete` não remove nada do diagrama. Os eventos de copiar, recortar e colar na aba também param ali, então o diagrama nunca os lê como seus. Qualquer outra tecla segue para a página como de costume.

### dictionaryRowChords {#dictionaryrowchords}

A partir da `4.2.0`, o pacote exporta `dictionaryRowChords()`. Ela retorna, como um novo `ShortcutOption[]` a cada chamada, todas as combinações com que a grade da aba Dicionário insere ou exclui linhas sob o mapa de combinações de teclas que você passar.  
Em ordem, são as combinações de um só pressionamento de `addColumn`, que inserem linhas abaixo da seleção; cada uma delas com `Shift` também pressionado, que inserem linhas acima, nenhuma para uma combinação que já contém `Shift`; e as combinações de um só pressionamento de `removeColumn`, que excluem linhas. Cada uma mantém o `preventDefault` e o `stopPropagation` da vinculação de onde vem, e uma sequência fica de fora. Consulte [Adicionar e excluir linhas](../guide/guides/dictionary.md#adding-and-deleting-rows).  
A combinação que insere linhas acima, `Alt+Shift+Enter` com os padrões, não está em nenhuma vinculação, então um host que compara as teclas modificadoras com exatidão e monta sua lista de teclas a deixar passar apenas a partir de [createKeyBindingMap](#createkeybindingmap) nunca a deixa passar. Deixe passar as duas listas, como faz o plugin do Obsidian.  
Ela lê apenas o mapa que recebe, não as vinculações do elemento, então passe a ela o mapa a partir do qual você montou sua lista de teclas.

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

Troca a tecla `Control` conforme o ambiente.

- Mac: $mod = Meta (⌘)
- Windows/Linux: $mod = Control

### Tabela de atalhos {#shortcut-table}

Usa as propriedades `key, code` do evento de teclado.  
Use `code` para posições absolutas e `key` para valores de entrada.

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
| `1`, `2`, etc | `1`, `2`, etc   | `1`, `2`, etc | `Digit1`, `Digit2`, etc        |
| `a`, `b`, etc | `a`, `b`, etc   | `a`, `b`, etc | `KeyA`, `KeyB`, etc            |
| `-`           | `-`             | `-`           | `Minus`                        |
| `=`           | `=`             | `=`           | `Equal`                        |
| `+`           | `+`             | `+`           | `Equal`                        |

## Tema {#theme}

### setPresetTheme {#setpresettheme}

Define um tema predefinido.  
Os padrões são `appearance: 'dark'`, `grayColor: 'slate'` e `accentColor: 'indigo'`.  
Cada campo é aplicado separadamente, então uma chamada parcial deixa os outros dois como estão. Um valor que não seja um dos nomes abaixo é ignorado, e a chamada nunca lança erro.  
A partir da `4.0.0`, `appearance` também aceita `'system'`, o `System` do construtor de temas. Ele mostra o claro ou o escuro que o sistema operacional informa, ou o que [setSystemAppearance](#setsystemappearance) indicar, e alterna quando isso muda.

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

A partir da `4.0.0`, indica o claro ou o escuro que a aparência `'system'` mostra, para um host com claro e escuro próprios, como o tema de uma IDE. Enquanto um deles está indicado, as mudanças do sistema operacional são ignoradas.  
`null`, ou qualquer valor diferente de `'dark'` ou `'light'`, volta a seguir o sistema operacional.  
Enquanto a aparência é `'light'` ou `'dark'`, ele não altera nada na tela, mas o valor é guardado e se aplica assim que a aparência passa a ser `'system'`. Caso contrário, aplica-se imediatamente. Ele não emite nada, e `changePresetTheme` continua informando `'system'`.  
Os hosts do VS Code, da JetBrains e do Obsidian o chamam com seu próprio claro ou escuro, e de novo sempre que isso muda.

```js
editor.setPresetTheme({ appearance: 'system' });
editor.setSystemAppearance('light'); // null follows the OS again
```

### setTheme {#settheme}

Permite personalizar o tema.  
Cada chamada substitui toda a camada sobreposta personalizada, então passe o objeto completo de novo para alterar um token sobre uma substituição existente, e passe `{}` para voltar ao tema predefinido.  
Somente os nomes de token abaixo, com valores do tipo string, são mantidos; todo o resto é descartado sem erro.  
A camada sobreposta fica sobre o tema predefinido, então um `setPresetTheme` posterior troca o tema predefinido por baixo enquanto suas substituições permanecem.

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

`tableShadow` e `memoShadow` são a cor da sombra que tabelas e notas projetam no canvas ERD. O tema predefinido escuro os deixa como `transparent`, o que não projeta sombra, assim como passar `none` ou uma string vazia a `setTheme`; o tema predefinido claro usa `rgba(0, 0, 0, 0.18)`.

A partir da `4.0.0`, há mais nove tokens:

- `tableGroupHeaderBackground`, `tableGroupBackground` e `tableGroupBorder` colorem a barra de título, o corpo e o contorno de um [grupo de tabelas](../guide/guides/table-groups.md) que não tem cor própria.
- `toastSuccess` e `toastError` colorem a marca de uma notificação que informa como algo terminou.
- `findReplaceError` e `mapColumnsError` colorem os erros que o Localizar e substituir e a caixa de diálogo Mapear colunas mostram. Antes, o Localizar e substituir usava `diffDeleteForeground`, então substituir esse token não muda mais a cor dele.
- `schemaSqlWarningBackground` e `schemaSqlWarningForeground` colorem os avisos nas opções da aba Esquema SQL.

A partir da `4.1.0`, há mais nove tokens:

- `treeBackground`, `treeRowHover`, `treeRowCurrent`, `treeMuted` e `treeMatch` colorem a árvore que o [explorador](../guide/guides/explorer.md#the-tree) e o [visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer) compartilham: seu fundo, que também preenche os campos `Find` e `Replace` do explorador; uma linha sob o ponteiro, a linha do teclado enquanto a árvore tem o foco e um botão sob o ponteiro no cabeçalho e na pesquisa do explorador; a linha da correspondência atual da pesquisa; o texto esmaecido, como contadores, tipos de dados e as setas de recolher e expandir; e a marca atrás do texto que uma pesquisa encontrou.
- `explorerBackground` e `explorerBorder` colorem o painel do explorador e suas linhas: sua borda ao lado do canvas, a linha sob a pesquisa e as bordas de seus campos e dos botões que `Search In` expande. `explorerBorder` também desenha a borda da árvore do visualizador de diferenças, a linha sob seu campo `Filter by name` e a borda desse campo. Os ícones de chave do explorador usam `keyPK`, `keyFK` e `keyPFK`.
- `diffModifyForeground` e `diffRenameForeground` colorem o que o visualizador de diferenças marca como alterado e renomeado, em sua árvore e nos dois documentos. `diffModifyForeground` também contorna uma tabela, nota ou grupo de tabelas que foi movido, redimensionado, teve a cor mudada ou mudou de grupo, independentemente do que mais tenha mudado nele, e desenha o conector de uma chave estrangeira que mudou.

`diffInsertForeground` e `diffDeleteForeground` agora colorem o que o visualizador de diferenças marca como adicionado e removido, em sua árvore e no documento que o contém, tanto em textos quanto em contornos e conectores. `diffInsertBackground`, `diffDeleteBackground`, `diffCrossBackground` e `diffCrossForeground` foram removidos na `4.1.0`, pois o visualizador de diferenças não preenche mais células. `setTheme` os descarta como qualquer outro nome que não está em `Theme`, e seus hooks, `--erd-editor-diff-insert-background`, `--erd-editor-diff-delete-background`, `--erd-editor-diff-cross-background` e `--erd-editor-diff-cross-foreground`, não são mais lidos.

A partir da `4.2.0`, há mais doze tokens:

- `columnHandleBackground` e `columnHandleBorder` preenchem e contornam a [alça de arrastar da coluna](../guide/guides/table-editing.md#rearranging-and-moving-columns), desenhada logo fora da borda esquerda de uma tabela, ao lado da linha de uma coluna em foco, e `columnHandleHoverBackground` e `columnHandleHoverBorder` assumem enquanto o ponteiro está sobre ela. O ícone da alça usa `foreground` e, sob o ponteiro, `active`.
- `dictionaryErrorForeground` e `dictionaryWarningForeground` colorem o que as [verificações do dicionário](../guide/guides/dictionary.md#what-each-check-finds) encontram, um erro ou um aviso: um nome apontado no canvas ERD (consulte [Marcas no canvas](../guide/guides/dictionary.md#marks-on-the-canvas)), o texto de uma célula apontada nas planilhas `Domains`, `Words` e `Terms` e o contador de `Checks`. `dictionaryErrorBackground` e `dictionaryWarningBackground` preenchem uma célula assim. `dictionaryErrorForeground` também colore a ferramenta `Delete Rows` sob o ponteiro.
- `dictionaryBackground`, `dictionaryHeaderBackground`, `dictionaryGridLine` e `dictionaryHeaderSelect` colorem a planilha da aba [Dicionário](../guide/guides/dictionary.md#the-sheets): suas células, cuja cor também preenche o campo de pesquisa da aba e a lista de domínios de um termo; seus cabeçalhos de coluna e números de linha; as linhas entre as células, cuja cor também desenha a barra da aba e as bordas de seus campos; e um cabeçalho cuja linha ou coluna encontra a seleção. O restante da planilha usa tokens compartilhados: `foreground` para os rótulos dos cabeçalhos, `active` para o texto das células, `grayColor7` para a linha que separa os cabeçalhos de coluna e os números de linha das células, `focus` para a borda da célula ativa, `accentColor9` para a borda de um intervalo selecionado e, com 20% de opacidade, para seu preenchimento, `accentColor6` para o cabeçalho de uma linha ou coluna inteira selecionada, `grayColor3` para as células somente leitura e os tokens da barra de rolagem. Um `accentColor9` não escrito como `#rgb` ou `#rrggbb` deixa um intervalo selecionado sem preenchimento.

#### Variáveis CSS {#css-variables}

Todo token em `Theme` tem um hook CSS correspondente chamado `--erd-editor-` mais a chave em kebab-case: `grayColor10` é `--erd-editor-gray-color-10`, `keyPK` é `--erd-editor-key-pk` e `keyPFK` é `--erd-editor-key-pfk`.  
Os hooks são herdados pelo editor, então defina-os onde quiser que se apliquem. Em `:root`, eles aplicam o tema a todos os editores da página; no próprio elemento, aplicam o tema apenas a ele.

```css
erd-editor {
  --erd-editor-canvas-background: #1b1b1f;
}
```

A partir da `3.4.0`, os tokens `dargSelect`, com erro de grafia, passaram a se chamar `dragSelect`, e seus hooks mudaram de `--erd-editor-darg-select-background` e `--erd-editor-darg-select-border` para `--erd-editor-drag-select-background` e `--erd-editor-drag-select-border`. Uma folha de estilos que ainda use os nomes antigos é ignorada.

<details>
<summary>Valores padrão do tema</summary>

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

## Idioma de exibição {#display-language}

A partir da `4.0.0`, o próprio texto do editor — seus menus, painéis, caixas de diálogo, a pesquisa rápida, as notificações e as palavras que ele desenha no diagrama, como `unnamed`, incluindo as exportações de imagem — está disponível em 25 idiomas. Nomes de tabelas e colunas, SQL, tipos de dados e código gerado nunca são traduzidos. Consulte [Idioma e tema](../guide/guides/language-and-theme.md).  
Antes de [setLocale](#setlocale) ser chamado ou de um idioma ser escolhido, o editor mostra o inglês, ou segue `'system'` enquanto [enableLocalePicker](#enablelocalepicker) está ativado.  
O editor define `lang` e `dir` em sua própria raiz dentro do shadow root fechado, nunca no elemento host nem na página, então uma página da direita para a esquerda não inverte o editor, e um idioma da direita para a esquerda não inverte a página. O hebraico, o árabe e o persa dispõem a interface do editor da direita para a esquerda; o diagrama em si nunca é espelhado. A partir da `4.1.0`, o [explorador](../guide/guides/explorer.md) fica à esquerda do canvas em todos os idiomas, com suas próprias linhas lidas da direita para a esquerda nesses três.  
O pacote exporta os tipos `LocaleCode` (um dos códigos abaixo) e `LocaleOption`.

```ts
type LocaleOption = LocaleCode | 'system';
```

| Código  | Exibido como         | Idioma               |
| ------- | -------------------- | -------------------- |
| `id-ID` | Bahasa Indonesia     | Indonésio            |
| `de-DE` | Deutsch              | Alemão               |
| `en`    | English              | Inglês               |
| `es-ES` | Español              | Espanhol             |
| `eu-ES` | Euskara              | Basco                |
| `fr-FR` | Français             | Francês              |
| `it-IT` | Italiano             | Italiano             |
| `nl-NL` | Nederlands           | Holandês             |
| `pl-PL` | Polski               | Polonês              |
| `pt-PT` | Português            | Português            |
| `pt-BR` | Português Brasileiro | Português brasileiro |
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

Define o idioma de exibição: `'system'` ou um dos códigos acima. Qualquer outra coisa, como um `'ko'` isolado, um código desconhecido ou um valor que não seja uma string, é ignorada sem erro.  
Ele se aplica antes de retornar, então um idioma definido antes de o elemento ser anexado já aparece em seu primeiro quadro.  
Ele não emite nada, nem `changeLocale` nem `change`, e não toca em `value`, no histórico de desfazer nem em um armazenamento compartilhado.  
A escolha permanece, esteja `enableLocalePicker` ativado ou desativado, e `setLocale('system')` segue o sistema também com o seletor desativado.  
O editor não armazena nada. Para manter a escolha de um usuário, escute [changeLocale](#changelocale) e passe-a de volta no próximo carregamento.

```js
editor.enableLocalePicker = true;
editor.setLocale(localStorage.getItem('locale') ?? 'system');
editor.addEventListener('changeLocale', event => {
  localStorage.setItem('locale', event.detail.locale);
});
```

### setSystemLocale {#setsystemlocale}

Indica o idioma que `'system'` representa, como uma tag BCP 47, para um host com idioma de exibição próprio. Os hosts do VS Code, da JetBrains e do Obsidian o chamam com seu próprio idioma de exibição.  
A tag tem os espaços das extremidades removidos. `null`, uma string em branco ou um valor que não seja uma string volta ao `navigator.languages` do navegador, que o editor acompanha conforme ele muda.  
Ele só importa enquanto a opção em vigor é `'system'`, e se aplica imediatamente. A linha `System` do seletor indica o idioma para o qual a opção é resolvida.  
A tag, ou cada um dos idiomas do navegador em ordem, é resolvida para o primeiro idioma que o editor tem, pela sua subtag de idioma, ignorando maiúsculas e minúsculas e sublinhados: `de-AT` resulta em `de-DE` e `en-GB` resulta em `en`. O chinês é resolvido pela escrita, com `Hant` resultando em `zh-TW` e `Hans` em `zh-CN`, e, sem escrita, pela região, com `TW`, `HK` e `MO` resultando em `zh-TW` e qualquer outra em `zh-CN`. `pt` resulta em `pt-BR`, a menos que seja indicada uma região diferente de `BR`. Quando nada corresponde, o editor mostra o inglês.

```js
editor.setLocale('system');
editor.setSystemLocale('pt-PT'); // null follows the browser again
```

## setSchemaSQL {#setschemasql}

Carrega um arquivo de Esquema SQL.  
Por padrão, ele substitui o documento atual em vez de mesclar com ele; consulte `mode` abaixo. As configurações que você já tem são mantidas, incluindo cada bloqueio e seu valor bloqueado, exceto a posição da área visível e o nível de zoom, e as tabelas são posicionadas depois que o arquivo é lido, em linhas, a menos que `placement` abaixo peça outra coisa. Com `Viewport` bloqueado, `value` passa a escrever a área visível em que a importação começa, a origem `0, 0` no nível de zoom `1`. Portanto, um documento importado em um elemento que nunca recebeu um valor tem todos os bloqueios ativados, como um documento novo.  
A partir da `4.2.0`, uma substituição também mantém as palavras, os termos e os domínios do documento, que o texto não pode conter, junto com o histórico de desfazer de cada planilha da aba Dicionário, e um desfazer ou refazer da importação também os mantém. Já um [setSchemaJSON](#setschemajson) que substitui e a atribuição de `value` assumem os que seu documento contém.  
Ele é registrado na lista do histórico, o que habilita `Undo, Redo`, e emite `change`. Uma string vazia é ignorada, e a chamada não faz nada enquanto `readonly` está definido.  
`setSchemaGraphQL`, `setSchemaDBML` e `setSchemaAML` se comportam da mesma forma, e seus parsers nunca falham: um texto que eles não conseguem ler carrega um documento vazio em vez de lançar um erro.  
A partir da `4.0.0`, os quatro aceitam um segundo argumento opcional, `{ placement, mode }`:

- `placement: 'grid'`, o padrão, coloca as tabelas em linhas imediatamente, como antes, e a chamada não retorna nada.
- `placement: 'auto'` primeiro organiza as tabelas pelos seus relacionamentos, como faz `Import` no editor, e retorna uma `Promise` que é resolvida quando a importação tiver sido aplicada como uma única etapa de desfazer. Menos de duas tabelas, nenhum relacionamento, um layout que falha, uma página sem `SharedWorker` ou `Cancel` na notificação `Placing tables` fazem com que, em vez disso, elas sejam colocadas em linhas. Um carregamento nesse meio-tempo — outra importação que substitui, atribuir `value`, `setInitialValue()`, `clear()`, o carregamento de um colaborador, ou um desfazer ou refazer de um carregamento ou de `clear()` — a anula, e a `Promise` é resolvida sem nada carregado. As importações posicionadas dessa forma são aplicadas na ordem em que começaram.
- `mode: 'replace'`, o padrão, substitui o documento. `mode: 'append'` adiciona o arquivo abaixo do diagrama, como faz [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add), deixando como estão todas as tabelas que já existem e todas as configurações, exceto a aba e a posição da área visível. A partir de outra aba, a aba ERD aparece primeiro. As novas tabelas, e os grupos de tabelas que um arquivo DBML traz enquanto os grupos de tabelas são exibidos, passam a ser a seleção, e a área visível rola até eles, a menos que já estejam bem visíveis, pela regra que todo salto segue a partir da `4.1.0` — consulte [Onde um salto termina](../guide/guides/table-related-functions.md#where-a-jump-lands). Um único desfazer remove toda a adição. Um texto que ele não consegue ler não adiciona nada e deixa o documento como está.

Enquanto `readonly` está definido, uma substituição é ignorada, um acréscimo não adiciona nada e uma chamada com `placement: 'auto'` é resolvida imediatamente.  
A partir da `3.10.0`, `setSchemaSQL` lê o arquivo de acordo com o banco de dados atual do documento: com Databricks selecionado, strings entre aspas simples seguem os escapes com barra invertida do Spark. Consulte [Comentários](../guide/guides/file-import-export.md#comments).  
A partir da `3.10.0`, `setSchemaSQL` lê um `UNIQUE` sobre duas ou mais colunas como um único índice único, em vez de um sinalizador Único em cada coluna. Consulte [Chaves únicas e índices](../guide/guides/file-import-export.md#unique-keys-and-indexes).  
A partir da `3.10.0`, as importações de SQL, DBML e AML mantêm as ações `ON DELETE` e `ON UPDATE` das chaves estrangeiras que leem.  
A partir da `4.0.0`, `setSchemaSQL` mantém a expressão `DEFAULT` inteira de uma coluna, lê o `ADD DEFAULT … FOR` do SQL Server e seus comentários `MS_Description`, transforma colunas serial e identity do PostgreSQL em Incremento automático, mantém `UNSIGNED` e `ZEROFILL` em um tipo de dados e lê uma chave primária que `ALTER TABLE … ADD PRIMARY KEY` marca como `CLUSTERED`, `NONCLUSTERED` ou `USING BTREE`. Consulte [Esquema SQL](../guide/guides/file-import-export.md#schema-sql).  
Consulte [Importar ou exportar arquivos](../guide/guides/file-import-export.md) para ver a sintaxe que cada parser aceita.

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
As definições de tipo de objeto se tornam tabelas, e um campo cujo tipo é outra tabela se torna um relacionamento.

```js
editor.setSchemaGraphQL('GraphQL SDL...');
```

## setSchemaDBML {#setschemadbml}

Carrega um arquivo DBML, o formato usado pelo dbdiagram.io e pelo dbdocs.  
A partir da `4.0.0`, cada `TableGroup` se torna um [grupo de tabelas](../guide/guides/table-groups.md), e o `headercolor` de uma tabela se torna sua cor. Consulte [DBML](../guide/guides/file-import-export.md#dbml).

```js
editor.setSchemaDBML('DBML...');
```

## setSchemaAML {#setschemaaml}

Carrega um arquivo AML (Azimutt Markup Language). Tanto a grafia atual quanto a grafia legada da v1 são aceitas.  
A partir da `4.0.0`, a cor de uma entidade, um dos nomes de cor do Azimutt ou um valor hexadecimal entre aspas, se torna a cor de sua tabela. Consulte [AML](../guide/guides/file-import-export.md#aml).

```js
editor.setSchemaAML('AML...');
```

## setSchemaJSON {#setschemajson}

A partir da `4.0.0`, carrega um documento `.erd.json`, como o texto que [value](#value) retorna.  
Em seu `mode: 'replace'` padrão, ele carrega o documento como faz a atribuição de `value`: é registrado na lista do histórico, emite `change` e assume os bloqueios do documento da mesma forma e, a partir da `4.2.0`, as palavras, os termos e os domínios do documento substituem os do editor. Ao contrário de `value`, uma string vazia ou um valor que não seja uma string é ignorado em vez de iniciar um documento novo. Um texto que não é JSON esvazia o documento, como acontece com `value`.  
`mode: 'append'` adiciona as tabelas, os relacionamentos, os índices, as notas e os grupos de tabelas do documento abaixo do diagrama com novos ids, mantendo suas posições relativas entre si e deixando de fora as configurações do documento, como faz [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add) com um arquivo `json`. A partir da `4.2.0`, ele mantém os nomes lógicos e os sinalizadores de nome derivado das tabelas e das colunas, mas deixa para trás as palavras, os termos e os domínios do documento, então nenhuma de suas colunas fica vinculada a um domínio. Um texto que ele não consegue ler, ou um documento sem nenhuma tabela e nenhuma nota, não adiciona nada. Caso contrário, é aplicado como um acréscimo de [setSchemaSQL](#setschemasql), com suas novas notas e seus novos grupos de tabelas selecionados junto com as tabelas, cada tipo enquanto estiver exibido.  
Ele retorna depois que o documento é aplicado e é ignorado enquanto `readonly` está definido.

```js
editor.setSchemaJSON('json...');
// or
editor.setSchemaJSON('json...', { mode: 'append' });
```

## getSchemaSQL {#getschemasql}

Exporta o estado atual do editor como Esquema SQL.  
Se `databaseVendor` não for especificado, ele escreve para o banco de dados que o editor mostra: o do documento, a menos que quem lê de um editor [somente leitura](#readonly) tenha escolhido outro, o que, a partir da `5.0.0`, fica nessa tela e é o que a aba Esquema SQL dele mostra. Um nome que não está na lista abaixo é tratado da mesma forma, sem lançar erro.  
Os nomes são delimitados com o tipo de delimitador que o editor mostra. Enquanto `Bracket Type` está [bloqueado](../guide/guides/settings.md#lock), ou em um editor somente leitura cujo leitor escolheu outro desde a `5.0.0`, ele pode ser diferente do que `value` salva, que é o tipo com que o [`erd_read`](../mcp/tools.md#reading-a-document) de um agente de codificação delimita os nomes. Os nomes escritos são sempre os físicos, seja qual for a exibição de nomes.  
A partir da `4.0.0`, um argumento opcional `options` escolhe as instruções e o cabeçalho, como fazem as opções da aba [Esquema SQL](../guide/guides/schema-sql.md), e, a partir da `4.2.0`, se os nomes lógicos preenchem os comentários vazios. `SchemaSQLOptions` é exportado como tipo.

- `statements`: `'create'`, o padrão; `'ifNotExists'`, que escreve `IF NOT EXISTS` no MySQL, MariaDB, PostgreSQL, SQLite e Databricks e recorre a `'create'` nos demais; ou `'recreate'`, que exclui as tabelas antes de criá-las, sendo que o Snowflake escreve `CREATE OR REPLACE TABLE` em vez disso.
- `header`: `'none'`, o padrão; `'use'`, que muda para o banco de dados ou esquema do documento; ou `'createAndUse'`, que primeiro o cria, se não existir, e depois muda para ele. Um banco de dados que não oferece o cabeçalho pedido recorre a uma alternativa como a aba faz: o Oracle escreve `'use'` para `'createAndUse'`, o PostgreSQL não escreve cabeçalho para `'use'` e o SQLite não escreve nenhum. Um cabeçalho só é escrito enquanto o nome do banco de dados do documento é um identificador simples — letras ASCII, dígitos e `_`, sem começar com um dígito.
- `logicalNameAsComment`, a partir da `4.2.0`: `true` escreve o nome lógico de uma tabela ou coluna como seu comentário onde o próprio comentário está vazio ou só tem espaços em branco e o nome lógico não, na forma em que esse banco de dados escreve um comentário. Um comentário com texto é escrito como antes. Só `true` o ativa: omitido, `false` ou qualquer outro valor, como `'true'` ou `1`, não escreve nenhum nome lógico. Ele faz o que faz o interruptor [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments) da aba.

Uma opção omitida, ou com um valor desconhecido, é lida como seu padrão, então uma chamada sem opções escreve instruções `CREATE` simples sem cabeçalho, como antes.  
A partir da `4.0.0`, a saída sempre inclui os scripts `Before tables` e `After tables` do documento, na ordem: cabeçalho, script antes das tabelas, instruções DROP, tabelas, script depois das tabelas. As escolhas `Statements`, `Header`, `Write logical names into empty comments` e `Tables` da própria aba Esquema SQL nunca afetam esta chamada, que sempre escreve o documento inteiro.  
A partir da `3.10.0`, cada chave estrangeira traz as cláusulas `ON DELETE` e `ON UPDATE` do relacionamento. Uma cláusula só é escrita quando sua ação está definida e o fornecedor a aceita, então uma ação que esse fornecedor não aceita fica de fora e se aplica o padrão. A partir da `4.0.0`, o Snowflake aceita apenas `NO ACTION`. Consulte [ON DELETE e ON UPDATE](../guide/guides/relationship-editing.md#on-delete-and-on-update) para ver o que cada banco de dados escreve.  
A partir da `3.10.0`, uma aspa simples dentro de um comentário de tabela ou de coluna é escapada, então um comentário como `it's` não quebra mais a instrução. Todo fornecedor que escreve comentários como literais de string a duplica, exceto o Databricks, que coloca uma barra invertida antes de cada aspa e de cada barra invertida. O SQLite continua escrevendo os comentários como linhas `--`.  
A partir da `4.2.0`, o SQL Server escreve cada comentário como um literal nacional, `N'…'`, então um texto fora da página de código do banco de dados, como o coreano, é preservado. O Oracle escreve cada sequência de linhas em branco de um comentário como uma única quebra de linha, e o SQLite escreve as quebras de linha de um comentário como espaços, para que ele permaneça em sua linha `--`. Consulte [Comentários](../guide/guides/schema-sql.md#comments).  
A partir da `4.0.0`, vários bancos de dados também escrevem nomes de chave, valores padrão e incremento automático de forma diferente. Consulte [O que o DDL escreve](../guide/guides/schema-sql.md#what-the-ddl-writes).

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

Retorna um armazenamento para edição colaborativa em tempo real.  
`config` é `{ getNickname?, mouseTracker?, focusTracker? }`. Ambos os rastreadores têm `true` como padrão: `mouseTracker` transmite o cursor deste editor aos outros, e `focusTracker` transmite sua célula em foco, sua seleção e seu retângulo de arrasto.  
A partir da `5.0.0`, o store não envia nenhuma alteração enquanto [readonly](#readonly) está definido, apenas o que seus rastreadores enviam e os registros que um editor que está entrando pede, e continua aplicando o que os outros enviam.  
Consulte [Edição colaborativa](./advanced/collaborative-editing.md).

```js
const sharedStore = editor.getSharedStore({
  mouseTracker: false,
  focusTracker: false,
});
```

## setDiffValue {#setdiffvalue}

Abre o visualizador de diferenças, comparando o documento aberto no momento com o que você passar.  
Ele não retorna nada e não modifica o documento, então fechar o visualizador deixa o editor exatamente como estava.  
Um valor em branco, ou qualquer coisa que não seja uma string, é comparado com um documento vazio.  
É a mesma camada sobreposta que o item [Visualizador de diferenças](../guide/guides/table-related-functions.md#diff-viewer) do menu de contexto do canvas.  
A partir da `4.1.0`, ele emparelha o conteúdo dos dois documentos primeiro pelo id e só depois pelo que cada item guarda, como o nome de uma tabela ou o texto de uma nota — consulte [O que é comparado](../guide/guides/table-related-functions.md#what-is-compared). Em comparação com uma versão anterior do mesmo documento, como uma revisão Git de seu arquivo, uma renomeação aparece, portanto, como um único item renomeado; em comparação com um documento cujos ids são diferentes, aparece como uma remoção e uma adição. O visualizador lista o que mudou em uma árvore ao lado dos dois documentos e marca as alterações em cores em vez de preencher células.  
A partir da `4.2.0`, os dois documentos se abrem na exibição de nomes que este editor mostra, seja qual for a que o documento passado salvou, e a árvore também nomeia tabelas e colunas por ela — consulte [Além do canvas](../guide/guides/logical-names.md#beyond-the-canvas). Os nomes lógicos, os vínculos com domínios e os dicionários não são comparados, então uma alteração apenas neles não mostra nenhuma alteração.

```js
editor.setDiffValue('prev json...');
```
