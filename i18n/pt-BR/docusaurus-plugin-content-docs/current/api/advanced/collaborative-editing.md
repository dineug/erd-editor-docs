---
sidebar_position: 1
description: Retransmitir as alterações do editor entre instâncias com getSharedStore, inicializar um editor que entra a partir de runtimeValue e dos registros do armazenamento, resolver as edições feitas no mesmo instante e mostrar o cursor, o foco, a seleção e o retângulo de arrasto de cada colaborador.
---

# Edição colaborativa

`getSharedStore()` transforma um editor em um nó de uma sessão colaborativa.  
Ele emite cada alteração como um fluxo de ações e aplica as ações que os outros editores enviam de volta — o transporte entre eles fica por sua conta (WebSocket, WebRTC ou qualquer outro meio capaz de transportar JSON).  
É um dos métodos de [ErdEditorElement](../erd-editor-element.md) e é usado em conjunto com o [armazenamento remoto](./remote-storage.md) quando as alterações retransmitidas também precisam ser armazenadas.  
A partir da `5.1.0`, para compartilhar um diagrama por meio de um documento Yjs e de qualquer um dos seus providers, em vez de montar o transporte você mesmo, vincule o editor com `@dineug/erd-editor-yjs`; consulte [Yjs](./yjs.md).

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

`@dineug/erd-editor` não exporta nenhum desses tipos pelo nome. O código TypeScript chega a eles por meio de `ErdEditorElement`, como em `ReturnType<ErdEditorElement['getSharedStore']>`.

Uma ação é um objeto simples e serializável que descreve uma alteração no documento, então ela passa intacta por `JSON.stringify` a caminho do transporte.  
As ações chegam em lotes: `subscribe` entrega um array, e esse array é uma unidade — retransmita-o inteiro e despache-o inteiro do outro lado.  
Trate uma ação como opaca e repasse-a sem alterações, em vez de lê-la ou reescrevê-la, pois os dados de controle que ela carrega, como a sua [versão](#concurrent-edits), é que mantêm os editores sincronizados.

Parte do que um editor faz fica restrita a esse editor.  
Trazer uma tabela, uma nota ou um grupo de tabelas para a frente, como acontece ao selecionar um deles, não é enviado.  
Também não são enviadas as escolhas `Statements`, `Header`, `Write logical names into empty comments` (a partir da `4.2.0`) e `Tables` da aba [Esquema SQL](../../guide/guides/schema-sql.md), que pertencem à janela em que são feitas.  
A partir da `4.1.0`, o [explorador](../../guide/guides/explorer.md) também fica restrito ao seu editor: se ele está aberto, sua largura, suas linhas recolhidas, a linha em que o teclado está, a posição de rolagem da árvore, sua pesquisa e suas opções não são enviados.  
Também não é enviada a [iluminação](../../guide/guides/relationship-editing.md#reading-a-connector) que ir para uma chave estrangeira aplica ao conector do relacionamento dela.  
A partir da `4.2.0`, a aba [Dicionário](../../guide/guides/dictionary.md) também fica restrita ao seu editor: qual planilha é mostrada e a pesquisa, a seleção, a rolagem e as larguras das colunas de cada planilha não são enviados. Já suas edições, classificações e importações de CSV são enviadas.  
Uma rolagem, um zoom ou uma troca de aba são enviados, mas nunca movem a área visível nem a aba de outro usuário. Isso inclui a rolagem que um salto a partir do explorador faz, a troca para a aba ERD quando o explorador é aberto a partir de outra aba e a troca de aba e a rolagem de um salto da planilha [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) da aba Dicionário para uma tabela ou coluna. Um salto dessa planilha para uma palavra, um termo ou um domínio permanece na aba Dicionário, então nada disso é enviado.

A partir da `4.2.0`, uma troca da [exibição de nomes](../../guide/guides/logical-names.md#switching-the-view) também é enviada, e o [bloqueio](../../guide/guides/settings.md#lock) dela decide o que os outros editores fazem com ela. O bloqueio `Name View` está ativado em um diagrama novo e em qualquer documento anterior à `4.2.0`.  
Enquanto o bloqueio está ativado, a troca aparece apenas no editor que a fez: ela continua sendo enviada, mas todos os outros editores e todas as réplicas a descartam, então cada usuário pode olhar para uma exibição diferente enquanto `value` mantém a exibição bloqueada.  
Enquanto o bloqueio está desativado, uma troca feita em um editor que pode editar altera a exibição de nomes em todos os editores e réplicas, prevalecendo a troca mais recente, e todos eles a salvam.  
Uma troca feita por um editor somente leitura sempre fica restrita a esse editor, e o editor continua seguindo as trocas compartilhadas dos outros.

A partir da `5.1.0`, uma alteração da linguagem do [Gerador de código](../../guide/guides/code-generator.md), do estilo do nome da tabela, do estilo do nome da coluna ou do tipo de delimitador segue o próprio bloqueio (`Language`, `Table Name Case`, `Column Name Case` ou `Bracket Type`) da mesma forma, com uma diferença: enquanto o bloqueio está ativado, a alteração nem chega a ser enviada.  
Ela aparece apenas no editor que a fez, cujas abas Gerador de código e Esquema SQL a seguem, e nenhum outro editor nem réplica a vê. `value` e `runtimeValue` mantêm o valor bloqueado, então um editor que entra inicializado a partir de qualquer editor também não a vê, e cada usuário pode olhar para uma linguagem, um estilo de nome ou um tipo de delimitador diferente enquanto o bloqueio está ativado.  
Enquanto o bloqueio está desativado, uma alteração feita em um editor que pode editar é enviada marcada como compartilhada (`shared: true` em seu payload). Ela altera a configuração em todos os editores e réplicas, prevalecendo a alteração mais recente, e todos eles a salvam. Um editor ou uma réplica `5.1.0` aplica uma alteração marcada, qualquer que seja o seu próprio bloqueio, então uma alteração feita logo após um desbloqueio chega a todos os lugares, mesmo onde ela chega antes do desbloqueio.  
Antes da `5.1.0`, uma alteração dessas chegava a todos os editores e réplicas, estivesse o bloqueio ativado ou não, enquanto o arquivo mantinha o valor bloqueado.

A partir da `5.0.0`, um editor [somente leitura](../erd-editor-element.md#readonly) não envia nenhuma alteração. A rolagem, o zoom, a aba, a exibição de nomes, o banco de dados, a linguagem do Gerador de código, os estilos de nome, o tipo de delimitador e as linhas de `View Option` que quem lê altera ficam na tela dele, quaisquer que sejam os bloqueios; antes da `5.0.0`, as rolagens, os zooms, as trocas de aba, o banco de dados e as configurações de código dele eram enviados como os de um editor editável.  
O store dele continua enviando o que seus rastreadores enviam do cursor, do foco, da seleção e do retângulo de arrasto de quem lê, responde aos registros que um editor que está entrando pede e aplica todas as alterações que os outros enviam. Uma alteração do banco de dados, de uma configuração do Gerador de código ou de uma linha de `View Option` chega ao documento dele, e à tela também, a menos que quem lê tenha alterado essa configuração ali, e uma troca compartilhada da exibição de nomes aparece na tela de qualquer forma. A partir da `5.1.0`, ele recebe uma configuração do Gerador de código somente quando essa configuração foi alterada com o bloqueio desativado ou quando um desbloqueio a traz.  
Quando o editor passa a ser somente leitura, ele primeiro envia o que o store ainda retém de um arrasto ou de uma rolagem, como faz [flushStreamBuffers](#flushstreambuffers), para que os outros fiquem com o último trecho.

Os [bloqueios](../../guide/guides/settings.md#lock) são compartilhados: o bloqueio ou desbloqueio mais recente de uma configuração prevalece em todos os editores, e um bloqueio carrega os valores do editor que o ativou, então todos os editores e réplicas salvam o mesmo valor.  
Portanto, um bloqueio `Viewport` salva a área visível do editor que o ativou, e um bloqueio `Canvas Type`, a última aba em que esse editor estava antes da aba Configurações, onde os bloqueios são ativados.  
Desativar o bloqueio `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ou, a partir da `4.2.0`, `Name View` também define essa configuração, em todos os editores, com o valor mostrado no editor que o desativou, incluída a própria alteração dele feita sob o bloqueio, para que todos continuem salvando um único valor. Desativar `Viewport` ou `Canvas Type` não move a área visível nem a aba de ninguém.

Uma edição no script `Before tables` ou `After tables` é enviada inteira quando o campo dele perde o foco. Os dois scripts são resolvidos separadamente, então a edição de um colaborador em um deles nunca sobrescreve o outro.

Nada do que se faz no [modo Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) da aba Visualização é uma alteração no documento, então um editor no Flow não envia alterações aos outros, e as alterações que eles enviam continuam sendo aplicadas enquanto ele está lá.  
Há duas exceções. Sair do Flow para outra aba é uma troca de aba, enviada como qualquer outra. A partir da `4.2.0`, uma escolha na lista de exibição de nomes da barra do Flow é uma troca da exibição de nomes, enviada e aplicada como uma feita no canvas.  
`Previous table`, `Next table` e as teclas de desfazer e refazer, que [percorrem as exibições](../../guide/guides/visualization.md#previous-table-and-next-table) no Flow, não são enviados.  
O botão de link externo do cartão, um resultado da [pesquisa rápida](../../guide/guides/quick-search.md#searching-the-diagram) escolhido após `#`, `@` ou `:` e a abertura do [explorador](../../guide/guides/explorer.md#opening-and-closing) saem todos do Flow para a aba ERD. Uma rolagem feita ali pelo botão do cartão ou por um resultado da pesquisa rápida também é enviada.

## Dois editores em uma página {#two-editors-on-one-page}

Aqui, a ligação de subscribe a dispatch faz o papel da rede, para que seja possível ver a forma de uma sessão sem um transporte no caminho.

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

Os dois editores aqui partem do mesmo documento novo e vazio, então nenhum deles precisa ser inicializado.  
Com três ou mais editores, envie os lotes de cada um a todos os outros: um editor nunca repassa o que recebeu.

## Inicializar um colaborador {#seeding-a-collaborator}

Um armazenamento compartilhado retransmite as alterações à medida que são feitas e nunca entrega ao editor que entra o documento no estado em que está, então um editor que entra em uma sessão já em andamento precisa receber o documento primeiro.  
A partir da `4.0.0`, inicialize-o com o [`runtimeValue`](../erd-editor-element.md#runtimevalue) de um editor que já está na sessão, não com `value` nem com o arquivo salvo.  
Uma sala vinculada com [`@dineug/erd-editor-yjs`](./yjs.md) guarda o próprio documento depois que um cliente a [inicializa](./yjs.md#seeding-a-room), então todo editor vinculado a ela abre esse documento sem que nenhum `runtimeValue` seja entregue.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

O valor em tempo de execução ainda contém o que foi removido desde que o documento foi aberto, então, quando outro editor desfaz uma remoção mais tarde, o editor que entrou traz a tabela de volta com seu nome e suas colunas.  
[`value`](../erd-editor-element.md#value) é a forma que um arquivo contém, sem as entidades removidas, então um editor que entra inicializado com ele, ou com o arquivo, traria de volta, em vez disso, uma tabela vazia e sem nome.  
A partir da `4.2.0`, o mesmo vale para uma palavra, um termo ou um domínio removido de uma planilha da aba [Dicionário](../../guide/guides/dictionary.md): quando outro editor desfaz a remoção, um editor que entra inicializado com `runtimeValue` lista a linha de novo inteira, e um inicializado com `value` lista uma linha vazia, que o próprio `value` dele então deixa de fora.  
Continue escrevendo `value` no armazenamento: `runtimeValue` serve apenas para inicializar outro editor, uma segunda exibição ou um [replicationStore](./remote-storage.md).  
Os editores no VS Code, no Obsidian, em uma IDE da JetBrains e no aplicativo web inicializam assim uma segunda exibição de um documento aberto.

`setInitialValue` não é retransmitido, então inicializar o editor que entra não altera nada nos outros.  
A partir da `4.0.0`, ele também descarta os registros de colaboração do editor, que resolvem as [edições simultâneas](#concurrent-edits). Se o armazenamento compartilhado do editor já teve um assinante, o armazenamento pede de novo os registros dos outros editores, como no seu primeiro [subscribe](#subscribe), para que um editor carregado novamente no meio de uma sessão resolva as edições da mesma forma que os outros.  
Atribuir `value` mantém os registros, mas, ao contrário de `setInitialValue`, é retransmitido: assim que o editor tem um armazenamento compartilhado, todos os editores da sessão carregam o documento atribuído, então nunca inicialize dessa forma um editor que entra.

Nem `value` nem `runtimeValue` contêm os registros nem a versão que o relógio do editor alcançou, então um editor que entra inicializado apenas com `runtimeValue` os obtém da resposta que os editores da sessão enviam ao seu primeiro subscribe.  
Até essa resposta chegar, uma edição feita pelo editor que entra pode carregar uma versão inferior à que os outros têm, então eles a recusam enquanto ela permanece nele, e uma escrita mais antiga ainda a caminho prevalece sobre a mais nova que a inicialização contém. Onde nenhum editor em execução responde, como quando um servidor ou um armazenamento de documentos guarda o documento da sessão, o editor que entra nunca os recebe.  
A partir da `5.1.0`, entregue-os junto com o valor. Em um editor da sessão, chame [`flushStreamBuffers()`](#flushstreambuffers), para que um arrasto ou uma mudança de cor que ele ainda retém saia primeiro, e então leia `runtimeValue` e o [`getLWW()`](#getlww) e o [`getVersion()`](#getversion) do seu armazenamento no mesmo instante. O editor que entra carrega o valor com `setInitialValue` e depois obtém o restante com o [`mergeLWW`](#mergelww) do seu próprio armazenamento, nessa ordem, já que todo `setInitialValue` descarta os registros. A edição seguinte dele carrega então uma versão acima de todas as que a inicialização contém, então ela prevalece sem nenhuma resposta a esperar. Em um armazenamento que já existe, [`reseed`](#reseed) faz as duas coisas em uma única chamada.

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

Uma inicialização guardada assim para abrir editores que entrarem depois contém as três coisas juntas. Ela não é um arquivo: `value` continua sendo o que se deve gravar no armazenamento.  
Um [replicationStore](./remote-storage.md#runtimevalue-getter) não entrega nenhum registro, então um editor que entra inicializado com o `runtimeValue` dele ainda obtém os registros da resposta dos editores.

## Edições simultâneas {#concurrent-edits}

Todo editor e toda réplica guarda, para cada nome e para quase todos os outros campos, a versão da escrita que o definiu: são os seus registros de colaboração. Uma escrita só prevalece quando a sua versão não é inferior à que está guardada, então editores que recebem as mesmas alterações em ordens diferentes terminam com o mesmo documento.  
A partir da `5.1.0`, cada versão carrega, abaixo do seu contador, uma posição própria do editor que escreve, obtida do id dele. As versões crescem, portanto, em passos de 4.194.304 e ultrapassam um inteiro de 32 bits quando o contador chega a 512. `JSON.stringify` e `JSON.parse` as transportam intactas, mas um retransmissor ou armazenamento que as interprete em outra linguagem deve mantê-las como números de 64 bits, nunca como inteiros de 32 bits.

A partir da `5.1.0`, dois editores que alteram um mesmo nome ou campo no mesmo instante, exceto pelas exceções abaixo, terminam com o mesmo valor em todos os editores e réplicas: escrevendo no mesmo contador, eles carimbam duas versões diferentes, e a maior prevalece em todos os lugares. Antes da `5.1.0`, ambos podiam carimbar uma mesma versão, e cada editor mantinha a que recebeu por último, então podiam terminar diferentes. Dois editores compartilham uma posição com probabilidade de 1 em 4.194.304 por par, e então empatam como antes.

A partir da `5.1.0`, a posição de uma tabela, a posição e o tamanho de uma nota ou de um grupo de tabelas, e a origem e o nível de zoom da área visível são versionados da mesma forma, e o que os move sai como o ponto onde terminam:

- um arrasto como um único `table.moveTo`, `memo.moveTo` ou `tableGroup.moveTo` por entidade movida, em um só lote, então o arrasto de um grupo carrega os pontos de suas tabelas, e a partir da `5.1.1` os de suas notas, junto com o do grupo;
- o desfazer ou refazer de um arrasto como o ponto em que ele coloca cada entidade;
- um deslocamento como `settings.scrollTo` e um zoom como `settings.changeZoomLevel`;
- o redimensionamento de uma nota ou de um grupo de tabelas como sua posição e seu tamanho juntos.

Assim, dois usuários que movem, ou movem e redimensionam, uma mesma tabela, nota ou grupo de tabelas no mesmo instante terminam com ela em um só ponto e com um só tamanho em todos os editores e réplicas. O ponto vai para a escrita de maior versão, com os dois eixos juntos. Uma movimentação não escreve tamanho, então um redimensionamento mantém o seu tamanho mesmo onde uma movimentação feita ao mesmo tempo fica com o ponto.  
Antes da `5.1.0`, um arrasto saía como a distância percorrida, então dois arrastos de uma mesma tabela se somavam, e uma movimentação e um redimensionamento de uma mesma nota ou grupo de tabelas feitos ao mesmo tempo podiam terminar diferentes.  
Um arrasto de menos de 20 px, que não deixa entrada de desfazer, é enviado como qualquer outro, então, como um ponto, ele pode se sobrepor a um arrasto da mesma entidade feito por outro usuário no mesmo instante. Um lote de arrasto, deslocamento ou zoom que um transporte entrega duas vezes não move nada duas vezes.

Uma mudança de cor é uma exceção. Ela sai sem versão, e cada editor e cada réplica a carimba com a sua própria e mantém a cor que recebeu por último, então dois usuários que mudam a cor de uma mesma tabela, nota ou grupo de tabelas no mesmo instante podem terminar com cores diferentes.  
Algumas alterações não guardam nenhuma versão, então cada editor e cada réplica as aplica na ordem em que as recebe, e duas feitas no mesmo instante também podem terminar diferentes: uma coluna movida dentro da sua tabela ou do seu índice (`column.move`, `indexColumn.move`) e uma alteração do [banco de dados](../../guide/guides/table-related-functions.md#databases), de uma linha de [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) ou de `Relationship DataType Sync`, `Maximum comment width` ou `Column Order` da aba [Configurações](../../guide/guides/settings.md).  
Entidades que dois usuários adicionam no mesmo instante, como duas tabelas ou duas colunas de uma mesma tabela, também podem ficar em ordens diferentes em cada editor e em cada réplica, e o `value` de cada um salva a sua própria ordem.

Tudo isso vale entre editores e réplicas da `5.1.0` ou posterior; [Misturar versões](#mixing-releases) diz o que um mais antigo altera.

## Misturar versões {#mixing-releases}

Um editor aplica apenas os tipos de ação que a sua própria versão conhece, então, em uma sessão que mistura versões, os editores mais antigos perdem tudo o que trafega em um tipo mais novo.

A partir da `3.10.0`, uma alteração no [ON DELETE ou ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de um relacionamento trafega como um de dois novos tipos de ação, `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` pode carregar ambos. Um retransmissor que repassa as ações sem alterações não precisa de nada novo para eles.  
Um editor anterior à `3.10.0` ignora esses tipos de ação e campos: ele nunca fica sabendo do ON DELETE ou do ON UPDATE de um relacionamento, e um documento salvo por um deles não tem nenhum dos dois. Um relacionamento que um editor mais antigo adiciona chega sem eles, então ambos começam em `Not set`.

Todas as outras alterações que um editor `3.10.0` envia trafegam em tipos de ação que os editores mais antigos já conhecem.  
`Replace All`, em [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing), envia suas edições como um único lote das mesmas ações de renomeação, comentário e nota que uma edição manual envia. As [opções de exibição](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` e `Referential Actions` trafegam na ação existente `settings.changeShow`.

A partir da `4.0.0`, estas alterações trafegam em novos tipos de ação, e um retransmissor que repassa as ações sem alterações não precisa de nada novo para elas:

- um [grupo de tabelas](../../guide/guides/table-groups.md) adicionado, movido, redimensionado, renomeado, com a cor alterada ou removido: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` e `tableGroup.remove`; uma tabela que entra em um grupo ou sai dele: `table.changeGroup`;
- um `Save` em [Mapear colunas](../../guide/guides/relationship-editing.md#map-columns) para um relacionamento existente, que define as duas listas de colunas dele de uma só vez: `relationship.changeColumns`;
- um [bloqueio](../../guide/guides/settings.md#lock) ativado ou desativado: `settings.changeLockSettings`;
- uma edição no script `Before tables` ou `After tables` da aba [Esquema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

As opções de exibição `Table Groups` e `Memos` trafegam na ação existente `settings.changeShow`.  
`settings.changeIgnoreSaveSettings`, que os interruptores `Save Scroll Information` e `Save Zoom Information` enviavam antes de os bloqueios os substituírem, não é mais enviado, e `settings.changeRelationshipOptimization` deixou de existir. Um editor `4.0.0` que receba qualquer um dos dois não altera nada.

Um editor anterior à `4.0.0` ignora os novos tipos de ação: ele nunca vê um grupo de tabelas nem quais tabelas estão nele, embora arrastar um grupo ainda mova as tabelas do grupo nesse editor, já que o arrasto também envia uma movimentação de cada uma dessas tabelas.  
Ele mantém as colunas antigas de um relacionamento após um `Save` em Mapear colunas, e, quando uma coluna desse mapeamento antigo é removida nele, o relacionamento desaparece em todos os editores. Ele não tem bloqueios nem scripts.  
Um documento salvo por um deles não tem nada disso, e um editor `4.0.0` o abre com todos os bloqueios ativados.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que armazene o documento dela, na `4.0.0` ou posterior.

Um editor `4.1.0` não envia nenhum tipo de ação novo, então editores e réplicas `4.0.0` e `4.1.0` compartilham uma sessão sem perder nada.  
Nele, [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) também pesquisa nomes de índices e nomes de grupos de tabelas, e `Replace` e `Replace All` os renomeiam com as ações `index.changeName` e `tableGroup.changeName` que um editor `4.0.0` já aplica.

A partir da `4.2.0`, estas alterações trafegam em novos tipos de ação, e um retransmissor que repassa as ações sem alterações não precisa de nada novo para elas:

- o [nome lógico](../../guide/guides/logical-names.md) de uma tabela ou coluna: `table.changeLogicalName` e `column.changeLogicalName`; se o nome dela foi [derivado dos dicionários](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` e `column.changeNameDerived`;
- uma coluna vinculada a um [domínio](../../guide/guides/dictionary.md#domains-and-data-types) ou desvinculada: `column.changeDomain`;
- uma palavra, um termo ou um domínio adicionado, alterado (incluindo sua posição na planilha, como uma classificação a define) ou removido na aba [Dicionário](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` e `dictionary.remove`;
- uma troca da [exibição de nomes](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

O bloqueio `Name View` trafega na ação existente `settings.changeLockSettings`, a opção de exibição `Domain`, em `settings.changeShow`, e uma movimentação de `Logical Name` ou `Domain` na [ordem das colunas](../../guide/guides/settings.md#adjusting-column-order), em `settings.changeColumnOrder`.  
Os `editor.clear` e `editor.loadJson` de uma importação de Esquema SQL, GraphQL, DBML ou AML feita por `Import` trazem `keepDictionaries: true`, que mantém as palavras, os termos e os domínios em todos os editores. O mesmo acontece com os de um [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` ou `setSchemaAML` de substituição.  
Um nome físico que os dicionários derivam trafega em `table.changeName` ou `column.changeName`, e o tipo de dados que um domínio dá às suas colunas, em `column.changeDataType`, as ações que uma edição manual envia.

Um editor anterior à `4.2.0` ignora os novos tipos de ação: ele não tem nomes lógicos, vínculos com domínios, dicionários nem exibição de nomes. Um bloqueio ou desbloqueio de `Name View` não altera nada nele, e o mesmo vale para uma movimentação de `Logical Name` ou `Domain` na ordem das colunas, ou para uma movimentação para a posição de qualquer um deles. Também não altera nada um bloqueio `Canvas Type` ativado por um editor que chegou à aba Configurações a partir da aba Dicionário: o editor mais antigo não conhece essa aba, então mantém `Canvas Type` desbloqueado. Ele continua mostrando os nomes físicos que os dicionários derivam e os tipos de dados que os domínios dão.  
As próprias edições dele não sabem nada de nomes lógicos, domínios nem dicionários, com estes efeitos nos editores mais novos:

- Uma tabela ou coluna que ele renomeia manualmente mantém o nome marcado como derivado, então um nome lógico escrito para ela mais tarde em um editor mais novo pode derivar o nome novamente por cima do que ele digitou.
- Um tipo de dados que ele dá a uma coluna vinculada a um domínio mantém o vínculo, então a planilha `Checks` lista `Domain type mismatch`, e a próxima alteração de tipo do domínio dá à coluna o tipo do domínio novamente.
- As colunas de chave estrangeira de um relacionamento que ele adiciona não recebem nome lógico nem domínio da sua chave.
- Uma tabela que ele cola ou duplica chega sem nomes lógicos nem vínculos com domínios.
- Uma importação de Esquema SQL, GraphQL, DBML ou AML feita nele não envia `keepDictionaries`, então esvazia as palavras, os termos e os domínios em todos os editores.
- Desfazer nele um carregamento, uma importação ou um `clear()` carrega a própria cópia do documento dele em todos os editores, e essa cópia não tem nomes lógicos, vínculos com domínios nem dicionários.
- Essa cópia, e o documento que uma importação de Esquema SQL, GraphQL, DBML ou AML feita nele carrega, também devolvem o bloqueio `Name View` em todos os editores ao estado em que esse editor o encontrou. Todos os editores passam então a salvar `Physical Names` como a exibição de nomes, e também a mostrá-la se o bloqueio estiver desativado.

Um documento salvo por um deles não tem nomes lógicos, vínculos com domínios, dicionários nem exibição de nomes, então um editor `4.2.0` o abre na exibição `Physical Names`. O editor mais antigo salva, sim, o bloqueio `Name View` como o encontrou, então um documento desbloqueado em um editor `4.2.0` continua desbloqueado.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que armazene o documento dela, na `4.2.0` ou posterior.

Um editor `5.1.0` não envia nenhum tipo de ação novo, então editores e réplicas anteriores à `5.1.0` ainda compartilham uma sessão com ele, e um retransmissor que repassa as ações sem alterações não precisa de nada novo. O que [Edições simultâneas](#concurrent-edits) descreve, porém, vale apenas entre editores e réplicas `5.1.0`:

- Os arrastos de um editor `5.1.0` trafegam como pontos em `table.moveTo`, `memo.moveTo` e `tableGroup.moveTo`, que os editores mais antigos já aplicam, e seus deslocamentos e zooms, como pontos em `settings.scrollTo` e `settings.changeZoomLevel`, que, como todo deslocamento e todo zoom, nenhum outro editor aplica e apenas as réplicas recebem. Um editor mais antigo aplica cada ponto de um arrasto na ordem em que ele chega, fora de qualquer registro, e uma réplica mais antiga faz o mesmo com cada ponto de um arrasto, de um deslocamento ou de um zoom, então dois pontos enviados ao mesmo tempo para uma entidade, ou para a área visível, podem terminar diferentes ali.
- O arrasto de um editor mais antigo ainda trafega como uma distância percorrida, que todo editor e toda réplica somam fora dos seus registros, e o deslocamento ou o zoom dele também como uma distância, que toda réplica soma da mesma forma. Uma distância e um ponto sobre uma mesma entidade feitos ao mesmo tempo podem terminar diferentes em editores e réplicas que os recebem em ordens diferentes, e uma distância que um transporte entrega duas vezes é somada duas vezes.
- Fora das exceções que [Edições simultâneas](#concurrent-edits) cita, a escrita de um nome ou campo feita por um editor `5.1.0` ao mesmo tempo que a escrita do mesmo por um editor mais antigo prevalece quase sempre, com a mesma resposta em todos os editores e réplicas. Dois editores mais antigos ainda podem terminar diferentes sobre um campo escrito ao mesmo tempo.
- Um editor `5.1.0` envia uma alteração da linguagem, do estilo de nome ou do tipo de delimitador do Gerador de código somente enquanto o bloqueio está desativado, com a marca `shared: true`, que um editor mais antigo ignora, aplicando a alteração como antes. Um editor mais antigo ainda envia, sem marca, a que faz sob o bloqueio: um editor ou uma réplica `5.1.0` a descarta enquanto essa configuração está bloqueada ali, e os editores mais antigos a aplicam. Assim, sob um bloqueio, os editores mais antigos seguem as escolhas uns dos outros enquanto os editores `5.1.0` mantêm as suas, e o arquivo mantém o valor bloqueado nos dois casos. Um desbloqueio feito em qualquer uma das versões leva o valor de quem desbloqueou a todos os editores e réplicas.
- Um carregamento que substitui o documento, como um `value` atribuído, `clear()` ou uma importação de substituição, encerra o desenho de um relacionamento em todos os editores `5.1.0`, tanto no que o fez quanto em cada um que o recebe. Um editor mais antigo mantém o desenho armado durante ele.

Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que armazene o documento dela, na `5.1.0` ou posterior, para que as edições feitas no mesmo instante terminem iguais em todos os lugares, exceto pelas exceções que [Edições simultâneas](#concurrent-edits) cita; a `4.2.0` ou posterior continua sendo o que mantém os nomes lógicos e os dicionários. Um [servidor MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) anterior à `1.2.0` conta aqui como um editor anterior à `5.1.0`, e um editor anterior à `5.1.0` não pode ser vinculado de forma alguma a uma sala [Yjs](./yjs.md).

A partir da `5.1.1`, uma nota que entra em um [grupo de tabelas](../../guide/guides/table-groups.md) ou sai dele trafega em um novo tipo de ação, `memo.changeGroup`, e um retransmissor que repassa as ações sem alterações não precisa de nada novo para ele. Essa ação é enviada para uma nota solta dentro de um grupo ou fora dele, para um novo grupo desenhado em torno de notas exibidas que não estão em nenhum grupo, para `Group selected tables` com notas selecionadas junto com as tabelas, para `Remove from group` com notas na seleção, para cada nota de um grupo removido, para as chamadas de um agente de codificação que alteram o grupo das notas pelo [servidor MCP](../../mcp/tools.md#table-groups) e para o desfazer e o refazer de cada uma delas. Um acréscimo de `Import and Add` ou de `setSchemaJSON` cujos grupos contêm notas também a envia, e o mesmo vale para o seu refazer, enquanto o seu desfazer apenas remove essas notas.

Um editor ou uma réplica anterior à `5.1.1` ignora `memo.changeGroup`, e sua análise descarta o `groupId` de todas as notas, então ele nunca vê uma nota em um grupo, embora o arrasto de um grupo em um editor `5.1.1` ainda mova ali as notas do grupo, já que também envia um `memo.moveTo` para cada uma delas. Suas próprias edições não sabem nada dos grupos das notas, com estes efeitos nos editores mais novos:

- Uma nota que ele arrasta para dentro da caixa de um grupo permanece fora do grupo, e uma nota do grupo que ele arrasta para fora da caixa permanece nele, com a caixa se estendendo para contê-la.
- O arrasto de um grupo nele, como o seu `Auto Layout`, move o grupo e suas tabelas, mas deixa as notas do grupo onde estão, e a caixa se estende para conter ali as exibidas.
- Um `Import and Add` nele não coloca nenhuma nota nos grupos que acrescenta.
- Um grupo que ele remove deixa o `groupId` de cada uma de suas notas indicando-o: as notas passam a ser lidas como em nenhum grupo, e o seu desfazer da remoção as coloca de volta no grupo.
- O seu desfazer de um carregamento, de uma importação ou de `clear()` carrega a sua própria cópia do documento em todos os editores, e essa cópia não tem nenhuma nota em nenhum grupo.

Um documento salvo por um deles não tem nenhuma nota em nenhum grupo, embora um da `4.0.0` em diante mantenha os grupos de suas tabelas.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que armazene o documento dela, na `5.1.1` ou posterior, para manter as notas em seus grupos de tabelas; a `5.1.0` ou posterior continua sendo o que resolve as edições feitas no mesmo instante. Um [servidor MCP](../../mcp/installation.md#updating) anterior à `1.2.1` também não vê nem mantém em qual grupo de tabelas uma nota está.

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Define o apelido mostrado ao lado do cursor do mouse deste usuário nos outros editores.  
Os outros usuários veem `user` quando o apelido está ausente ou em branco.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Transmite o cursor do mouse deste usuário aos outros editores. O padrão é `true`.  
Os cursores enviados por outros usuários são sempre mostrados no canvas ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Transmite aquilo em que este usuário está trabalhando. O padrão é `true`.  
A tabela e a célula que você tem em foco, as tabelas, as notas e os grupos de tabelas que você selecionou e o retângulo que você arrasta no canvas são enviados aos outros editores e desenhados neles.  
Cada usuário recebe uma cor própria, para que seja possível distingui-los: um contorno na tabela em foco, um sublinhado na célula em foco, um anel ao redor das tabelas, notas e grupos de tabelas selecionados e um retângulo tracejado para o retângulo de arrasto.  
A partir da `4.2.0`, cada usuário pode estar olhando para uma [exibição de nomes](../../guide/guides/logical-names.md#collaborators) diferente enquanto o bloqueio dela está ativado, ou depois de uma troca feita por um editor somente leitura. Uma célula em foco que a sua exibição não desenha é sublinhada na célula que ela desenha no lugar dela: o nome e o nome lógico ocupam o lugar um do outro, assim como o tipo de dados e o domínio.  
A presença que chega de outros usuários é sempre desenhada no seu canvas, esteja esta opção ativada ou não.  
No modo Flow da aba Visualização, o foco e a seleção dos outros usuários são desenhados nos cartões das tabelas, mas os retângulos de arrasto deles não. As tabelas que você seleciona ali continuam sendo enviadas; o retângulo que você arrasta ali, não.

```js
editor.getSharedStore({ focusTracker: false });
```

Desative os dois rastreadores para usar o armazenamento compartilhado como um simples retransmissor que não publica nenhuma presença própria.  
A presença enviada por outros editores continua sendo recebida e desenhada.  
É o que fazem os editores no VS Code, no Obsidian, em uma IDE da JetBrains e no Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

O cursor, o foco, a seleção e o retângulo de arrasto trafegam no mesmo fluxo que as alterações do documento, mas são efêmeros.  
Eles nunca entram no documento, no histórico de desfazer nem em `editor.value`, então um transporte pode descartá-los livremente e um replicationStore os ignora.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Estes métodos definem o estado atual da conexão.  
Enquanto o armazenamento está desconectado, as alterações ficam em buffer internamente.  
As alterações em buffer são emitidas aos assinantes assim que a transmissão volta a ser possível.  
O estado padrão é conectado (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica as alterações de outras instâncias do editor à instância atual do editor.  
Quando um lote contém o pedido de registros de outro editor, como o primeiro [subscribe](#subscribe) de um editor que entra envia, o armazenamento responde por meio dos seus assinantes com os seus registros e a sua versão, a menos que não tenha nenhum registro.  
A partir da `5.1.0`, ele antes envia todos os lotes de fluxo que ainda retém, como faz [flushStreamBuffers](#flushstreambuffers), para que cada versão que a resposta carrega se apoie em uma escrita já enviada aos outros. A chegada de um editor que entra faz, portanto, todos os editores da sessão enviarem de uma vez um arrasto, um deslocamento, um zoom, uma mudança de cor ou um redimensionamento de nota que ainda retêm.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Assina as alterações do editor.  
Nada sai do editor até que haja pelo menos um assinante, e as alterações feitas antes disso ficam em buffer.  
O primeiro subscribe também pede aos outros editores os registros de colaboração deles, que resolvem as [edições simultâneas](#concurrent-edits), para que um editor que entra tarde as resolva da mesma forma.  
Ele não traz o documento, então [inicialize](#seeding-a-collaborator) primeiro um editor que entra tarde; a partir da `5.1.0`, a inicialização também pode carregar os registros.  
A partir da `4.0.0`, o armazenamento volta a pedi-los sempre que `setInitialValue`, ou, a partir da `5.1.0`, [reseed](#reseed), carrega um documento no seu editor depois desse primeiro subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envia agora os lotes de fluxo que este armazenamento ainda está retendo, em vez de depois do período de inatividade deles.  
A partir da `3.9.2`, ele funciona em um armazenamento obtido de `getSharedStore`; na `3.9.1`, o método está no tipo, mas não faz nada.  
Mover uma tabela, uma nota ou um grupo de tabelas, mudar a cor de um deles, redimensionar uma nota e rolar ou aplicar zoom na área visível são feitos, cada um, como um fluxo de pequenas alterações. Redimensionar um grupo de tabelas não é: ele é enviado uma única vez, quando o arrasto termina.  
O armazenamento reúne cada fluxo em um único lote e o retém até que o fluxo fique inativo por 200 ms, em duas etapas. Uma mudança de cor ou um redimensionamento de nota passa pelas duas, então sai cerca de 400 ms após a última alteração, como todo fluxo fazia antes da `5.1.0`. A partir da `5.1.0`, um arrasto, um deslocamento ou um zoom sai após a primeira etapa, cerca de 200 ms após o seu último passo, como o ponto onde termina (consulte [Edições simultâneas](#concurrent-edits)).  
Uma chamada encerra essa espera nas duas etapas. Enquanto o armazenamento está conectado, um assinante recebe o lote antes que a chamada retorne. Uma chamada sem nada retido não envia nada.  
`destroy`, seja o do armazenamento ou o do editor, descarta um lote que ainda está retido, então chame este método primeiro quando deixar de usar um armazenamento e os outros editores precisarem manter a última alteração, como quando uma aba é fechada.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

A partir da `5.1.0`, retorna uma cópia dos registros de colaboração do editor (consulte [Edições simultâneas](#concurrent-edits)).  
A cópia é feita por meio de JSON, então é um objeto simples pronto para `JSON.stringify`, e uma alteração nela deixa os registros do armazenamento como estavam.  
Entregue-a como está ao [mergeLWW](#mergelww) ou ao [reseed](#reseed) de outro armazenamento. O formato dela é o do próprio editor, então não leia nenhum campo dela.  
Leia-a junto com [getVersion](#getversion) e o `runtimeValue` do editor no mesmo instante para [inicializar um editor que entra](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

A partir da `5.1.0`, incorpora aos registros deste armazenamento os registros que outro armazenamento entregou com [getLWW](#getlww), mantendo a maior versão de cada um, e incorpora `version` ao relógio do editor, que mantém a maior entre a sua própria e a informada.  
Ele não altera nada no documento: nenhum byte de `value` ou `runtimeValue`, nenhuma entrada de desfazer e nenhum evento `change`. Ele apenas eleva as versões que uma escrita posterior precisa superar, então uma escrita mais antiga que os registros informados é recusada depois, e a edição seguinte do editor carrega uma versão acima de `version`.  
Ele não envia nem responde nada. É o que o primeiro subscribe de um editor que entra obtém da resposta dos outros, incorporado diretamente.  
Chame-o depois de `setInitialValue`, nunca antes: todo `setInitialValue` e todo [reseed](#reseed) descarta os registros guardados, e com eles o que um `mergeLWW` anterior incorporou.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

A partir da `5.1.0`, retorna a maior versão que o relógio do editor incorporou: a maior entre as versões das alterações que ele fez ou recebeu, dos pedidos de registros e das respostas que uma entrada troca, e de cada `version` informada a `mergeLWW` ou `reseed`.  
Cursores, foco, seleções e retângulos de arrasto, dele ou de outro editor, não a movem.  
Entregue-a, com [getLWW()](#getlww) lido no mesmo instante, ao [mergeLWW](#mergelww) ou ao [reseed](#reseed) de um editor que entra. É uma [versão](#concurrent-edits) como as que as ações dele carregam.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

A partir da `5.1.0`, remove de imediato o cursor, o foco, a seleção e o retângulo de arrasto que o editor com o id informado enviou, e a expiração que cada um aguardava. Os de todos os outros editores permanecem.  
O id é o `meta.editorId` carregado por toda ação que o armazenamento compartilhado desse editor envia. Um id do qual este editor não guarda nada não altera nada.  
Chame-o quando o seu transporte souber que um par saiu. Caso contrário, o que o par enviou permanece desenhado até expirar: o cursor 30 segundos após o último recebido, o foco e a seleção 90 segundos depois, e o retângulo de arrasto 3 segundos depois.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

A partir da `5.1.0`, abre de novo no editor o documento de uma sessão, como faz uma reentrada. O vínculo com [Yjs](./yjs.md) o chama para abrir o documento de uma sala quando se vincula a uma sala que foi inicializada, e de novo a cada reentrada, mantendo a tela depois que ele entrou na sala.  
Ele carrega `value` como [setInitialValue](../erd-editor-element.md#setinitialvalue) faz e incorpora `lww` e `version` como [mergeLWW](#mergelww) faz, então o armazenamento passa a guardar exatamente os registros informados, e o seu relógio, a maior entre a sua própria versão e `version`. Ele também esvazia o histórico de desfazer e, ao contrário de `setInitialValue`, descarta a seleção e o foco, pois eles podem nomear o que o valor não contém mais.  
Exceto pela derivação de nome lógico abaixo, ele não cria entrada de desfazer, não emite evento `change` e não envia nenhuma alteração. Depois que o armazenamento teve um assinante, ele envia o pedido de registros que todo carregamento desse tipo envia, que um transporte que já entregou os registros pode descartar, e, com o [focusTracker](#focustracker) ativado, a seleção e o foco esvaziados.  
Como `setInitialValue`, ele funciona enquanto [readonly](../erd-editor-element.md#readonly) está definido, descarta uma exibição Flow, encerra o desenho de um relacionamento e fecha os editores de nota, de nome de grupo de tabelas e de célula, mantendo ou descartando o que foi digitado neles da mesma forma; um nome que uma célula de nome lógico derive ao fechar a partir do que o leitor digitou é uma edição comum: enviada, desfazível e emitida como evento `change`.

Sem `keepScreen`, a tela mostra o que o valor contém, como depois de `setInitialValue`. Com `keepScreen: true`, a tela do leitor é recolocada sobre o documento carregado, somente nessa tela:

- a posição de rolagem e o nível de zoom, depois que o elemento os mostrou; um que nunca foi mostrado, ou carregado enquanto oculto e não mostrado desde então, abre onde o valor o coloca, como acontece com um editor que entra tarde;
- a aba, quando o carregamento a moveu, e, na aba Configurações, também a aba de onde o leitor veio, que um bloqueio `Canvas Type` ativado ali nomeia;
- a exibição de nomes e cada configuração do Gerador de código que o leitor mostrava por conta própria sob o seu bloqueio, mas somente quando esse bloqueio estava ativado antes do carregamento, continua ativado depois dele e guarda o mesmo valor bloqueado. Assim, quando um par desbloqueou, alterou e bloqueou de novo uma configuração com outro valor nesse meio tempo, o editor abre com o novo valor bloqueado, e onde o bloqueio está desativado antes ou depois do carregamento, ele mostra o valor carregado;
- toda configuração que um leitor somente leitura alterou na própria tela, quaisquer que sejam os bloqueios.

Nada disso é enviado, e `value` e `runtimeValue` continuam informando o documento carregado. O desbloqueio posterior de um par substitui uma configuração de código mantida assim, como todo desbloqueio faz.  
A próxima rolagem ou o próximo zoom do leitor feito enquanto o editor pode editar torna a posição de rolagem e o nível de zoom mantidos novamente os do documento, e sai encabeçado por onde a tela está, para que as réplicas também recebam esse zoom.

Uma reinicialização deixa como está o que o armazenamento retém. Um arrasto, um deslocamento ou um zoom ainda retido sai depois dele, lido a partir do documento reinicializado; uma mudança de cor ou um redimensionamento de nota sai como foi feito, embora o editor não o mostre mais; e o que `disconnect()` reteve sai em `connection()`.  
Portanto, chame [flushStreamBuffers](#flushstreambuffers) antes, envie o que ele emitir e reinicialize com um valor que o contenha. Nunca reinicialize enquanto estiver desconectado.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Destrói completamente a instância de sharedStore.  
O próprio editor não é afetado, então sair de uma sessão mantém o documento editável.  
Os rastreadores de mouse e de foco param assim que o último sharedStore que o editor forneceu é destruído.  
Um lote de fluxo que o armazenamento ainda está retendo é descartado junto com ele; chame [flushStreamBuffers](#flushstreambuffers) antes para enviá-lo.  
Os cursores, o foco, as seleções e os retângulos de arrasto que outros editores enviaram permanecem desenhados até expirar; a partir da `5.1.0`, [forgetPeer](#forgetpeer) remove de imediato os de um editor.

```js
sharedStore.destroy();
```
