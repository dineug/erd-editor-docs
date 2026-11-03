---
sidebar_position: 1
description: Retransmitir as alterações do editor entre instâncias com getSharedStore, inicializar a partir de runtimeValue e dos registos do armazenamento um editor que se junta à sessão, resolver as edições feitas no mesmo instante e mostrar o cursor, o foco, a seleção e o retângulo de arrasto de cada colaborador.
---

# Edição colaborativa

`getSharedStore()` transforma um editor num nó de uma sessão colaborativa.  
Emite cada alteração como um fluxo de ações e aplica as ações que os outros editores enviam de volta — cabe-lhe fornecer o transporte entre eles (WebSocket, WebRTC ou qualquer outro meio capaz de transportar JSON).  
É um dos métodos de [ErdEditorElement](../erd-editor-element.md) e combina-se com o [armazenamento remoto](./remote-storage.md) quando as alterações retransmitidas também têm de ser armazenadas.  
A partir da `5.1.0`, para partilhar um diagrama através de um documento Yjs e de qualquer um dos seus fornecedores, em vez de montar o transporte por si, ligue o editor com `@dineug/erd-editor-yjs`; consulte [Yjs](./yjs.md).

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

`@dineug/erd-editor` não exporta nenhum destes tipos pelo nome. O código TypeScript chega a eles através de `ErdEditorElement`, como em `ReturnType<ErdEditorElement['getSharedStore']>`.

Uma ação é um objeto simples e serializável que descreve uma alteração ao documento, pelo que sobrevive a `JSON.stringify` a caminho do transporte.  
As ações chegam em lotes: `subscribe` entrega-lhe um array e esse array é uma unidade — retransmita-o inteiro e despache-o inteiro do outro lado.  
Trate uma ação como opaca e reencaminhe-a tal como está, em vez de a ler ou reescrever, já que a informação de controlo que transporta, como a sua [versão](#concurrent-edits), é o que mantém os editores sincronizados.

Parte do que um editor faz fica nesse editor.  
Trazer uma tabela, uma nota ou um grupo de tabelas para a frente, como acontece ao selecionar um deles, não é enviado.  
Também não são enviadas as escolhas `Statements`, `Header`, `Write logical names into empty comments` (a partir da `4.2.0`) e `Tables` do separador [Esquema SQL](../../guide/guides/schema-sql.md), que pertencem à janela em que são feitas.  
A partir da `4.1.0`, o [explorador](../../guide/guides/explorer.md) também fica no seu editor: se está aberto, a sua largura, as suas linhas recolhidas, a linha com o foco do teclado, a posição de deslocamento da árvore e a sua pesquisa e opções não são enviados.  
Também não é enviada a [iluminação](../../guide/guides/relationship-editing.md#reading-a-connector) que o conector da relação recebe quando se vai para uma chave externa.  
A partir da `4.2.0`, o separador [Dicionário](../../guide/guides/dictionary.md) também fica no seu editor: a folha que é mostrada e, em cada folha, a pesquisa, a seleção, o deslocamento e as larguras das colunas não são enviados. As suas edições, ordenações e importações de CSV são.  
Um deslocamento, um zoom ou uma mudança de separador são enviados, mas nunca alteram a vista nem o separador de outro utilizador. Isto inclui o deslocamento provocado por um salto a partir do explorador, a mudança para o separador ERD quando o explorador se abre a partir de outro separador e ainda a mudança de separador e o deslocamento provocados por um salto da folha [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) do separador Dicionário para uma tabela ou coluna. Um salto dessa folha para uma palavra, um termo ou um domínio fica no separador Dicionário, pelo que nada disso é enviado.

A partir da `4.2.0`, uma mudança da [vista de nomes](../../guide/guides/logical-names.md#switching-the-view) também é enviada, e o seu [bloqueio](../../guide/guides/settings.md#lock) decide o que os outros editores fazem com ela. O bloqueio `Name View` está ativado num diagrama novo e em qualquer documento anterior à `4.2.0`.  
Enquanto o bloqueio está ativado, a mudança só aparece no editor que a fez: continua a ser enviada, mas todos os outros editores e todas as réplicas a descartam, pelo que cada utilizador pode estar a ver uma vista diferente enquanto o `value` mantém a vista bloqueada.  
Enquanto o bloqueio está desativado, uma mudança feita num editor que pode editar muda a vista de nomes em todos os editores e réplicas, prevalecendo a mudança mais recente, e todos eles a guardam.  
A mudança feita por um editor só de leitura fica sempre nesse editor, e esse editor continua a seguir as mudanças partilhadas dos outros.

A partir da `5.1.0`, uma alteração da linguagem do [Gerador de código](../../guide/guides/code-generator.md), do formato do nome das tabelas, do formato do nome das colunas ou do tipo de delimitador segue o seu próprio bloqueio (`Language`, `Table Name Case`, `Column Name Case` ou `Bracket Type`) do mesmo modo, com uma diferença: enquanto o bloqueio está ativado, a alteração não é enviada de todo.  
Aparece apenas no editor que a fez, cujos separadores Gerador de código e Esquema SQL a seguem, e nenhum outro editor nem réplica a vê. `value` e `runtimeValue` mantêm o valor bloqueado, pelo que um editor que se junta inicializado a partir de qualquer editor também não a vê, e cada utilizador pode estar a ver uma linguagem, um formato do nome ou um tipo de delimitador diferente enquanto o bloqueio está ativado.  
Enquanto o bloqueio está desativado, uma alteração feita num editor que pode editar é enviada marcada como partilhada (`shared: true` no seu payload). Muda a definição em todos os editores e réplicas, prevalecendo a alteração mais recente, e todos eles a guardam. Um editor ou uma réplica `5.1.0` aplica uma alteração marcada, diga o que disser o seu próprio bloqueio, pelo que uma alteração feita logo a seguir a um desbloqueio chega a todo o lado, mesmo onde chegue antes do desbloqueio.  
Antes da `5.1.0`, uma alteração destas chegava a todos os editores e réplicas, quer o bloqueio estivesse ativado, quer não, enquanto o ficheiro guardava o valor bloqueado.

A partir da `5.0.0`, um editor [só de leitura](../erd-editor-element.md#readonly) não envia nenhuma alteração. O deslocamento, o zoom, o separador, a vista de nomes, a base de dados, a linguagem do Gerador de código, os formatos do nome, o tipo de delimitador e as linhas de `View Option` que o seu leitor altera ficam no seu ecrã, digam o que disserem os respetivos bloqueios; antes da `5.0.0`, os seus deslocamentos, zooms, mudanças de separador, base de dados e definições de código eram enviados como os de um editor editável.  
O seu armazenamento continua a enviar o que os seus rastreadores enviam do cursor, do foco, da seleção e do retângulo de arrasto do leitor, responde aos registos que um editor que se junta lhe pede e aplica todas as alterações que os outros enviam. Uma alteração da base de dados, de uma definição do Gerador de código ou de uma linha de `View Option` chega ao seu documento, e também ao seu ecrã, a menos que o seu leitor tenha alterado essa definição aí, e uma mudança partilhada da vista de nomes aparece no seu ecrã em qualquer caso. A partir da `5.1.0`, recebe uma definição do Gerador de código apenas quando essa definição foi alterada com o bloqueio desativado ou quando um desbloqueio a transporta.  
Quando o editor passa a só de leitura, envia primeiro o que o armazenamento ainda retém de um arrastamento ou de um deslocamento, tal como [flushStreamBuffers](#flushstreambuffers) o faz, para que os outros fiquem com o final.

Os [bloqueios](../../guide/guides/settings.md#lock) são partilhados: o último bloqueio ou desbloqueio de uma definição prevalece em todos os editores, e um bloqueio transporta os valores do editor que o ativou, pelo que todos os editores e réplicas guardam o mesmo valor.  
Assim, um bloqueio `Viewport` guarda a vista do editor que o ativou, e um bloqueio `Canvas Type` o último separador em que esse editor esteve antes do separador Definições, onde os bloqueios são ativados.  
Desativar o bloqueio `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ou, a partir da `4.2.0`, `Name View` também muda essa definição, em todos os editores, para o valor mostrado no editor que o desativou, incluindo a sua própria alteração feita sob o bloqueio, pelo que continuam a guardar um único valor. Desativar `Viewport` ou `Canvas Type` não altera a vista nem o separador de ninguém.

Uma edição do script `Before tables` ou `After tables` é enviada por inteiro quando o respetivo campo perde o foco. Os dois scripts resolvem-se em separado, pelo que a edição de um deles por um colaborador nunca substitui o outro.

Nada do que se faz no [modo Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) do separador Visualização é uma alteração ao documento, pelo que um editor no Flow não envia alterações aos outros, e as alterações que estes enviam continuam a ser aplicadas enquanto lá está.  
Há duas exceções. Sair do Flow para outro separador é uma mudança de separador, enviada como qualquer outra. A partir da `4.2.0`, uma escolha na lista da vista de nomes da barra de ferramentas do Flow é uma mudança da vista de nomes, enviada e aplicada como uma feita na tela.  
`Previous table`, `Next table` e as teclas para anular e refazer, que [percorrem as vistas](../../guide/guides/visualization.md#previous-table-and-next-table) no Flow, não são enviados.  
O botão de ligação externa do cartão, um resultado da [pesquisa rápida](../../guide/guides/quick-search.md#searching-the-diagram) escolhido depois de `#`, `@` ou `:` e a abertura do [explorador](../../guide/guides/explorer.md#opening-and-closing) saem todos do Flow para o separador ERD. Um deslocamento que o botão do cartão ou um resultado da pesquisa rápida aí faça também é enviado.

## Dois editores numa página {#two-editors-on-one-page}

Aqui, a ligação de subscribe a dispatch faz as vezes da rede, para que seja possível ver a forma de uma sessão sem um transporte pelo meio.

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

Aqui, ambos os editores partem do mesmo documento novo e vazio, pelo que nenhum deles tem de ser inicializado.  
Com três ou mais editores, envie os lotes de cada um para todos os outros: um editor nunca reencaminha o que recebeu.

## Inicializar um colaborador {#seeding-a-collaborator}

Um armazenamento partilhado retransmite as alterações à medida que são feitas e nunca entrega a quem se junta o documento tal como está, pelo que um editor que se junta a uma sessão já em curso tem de receber primeiro o documento.  
A partir da `4.0.0`, inicialize-o com o [`runtimeValue`](../erd-editor-element.md#runtimevalue) de um editor que já esteja na sessão, e não com `value` nem com o ficheiro guardado.  
Uma sala ligada com [`@dineug/erd-editor-yjs`](./yjs.md) contém o próprio documento depois de um cliente a ter [inicializado](./yjs.md#seeding-a-room), pelo que todos os editores ligados a ela abrem esse documento sem que se entregue nenhum `runtimeValue`.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

O valor em tempo de execução ainda contém o que foi removido desde que o documento foi aberto, pelo que, quando outro editor anula mais tarde uma remoção, o editor que se juntou repõe a tabela com o seu nome e as suas colunas.  
[`value`](../erd-editor-element.md#value) é a forma que um ficheiro contém, sem as entidades removidas, pelo que um editor que se juntasse inicializado a partir dele, ou do ficheiro, reporia, em vez disso, uma tabela vazia e sem nome.  
A partir da `4.2.0`, o mesmo acontece com uma palavra, um termo ou um domínio removido de uma folha do separador [Dicionário](../../guide/guides/dictionary.md): quando outro editor anula a remoção, um editor que se juntou inicializado a partir de `runtimeValue` volta a listar a linha inteira, e um inicializado a partir de `value` lista uma linha vazia, que o seu próprio `value` deixa depois de fora.  
Continue a escrever `value` no armazenamento: `runtimeValue` serve apenas para inicializar outro editor, uma segunda vista ou um [replicationStore](./remote-storage.md).  
Os editores do VS Code, do Obsidian, de um IDE da JetBrains e da aplicação web inicializam deste modo uma segunda vista de um documento aberto.

`setInitialValue` não é retransmitido, pelo que inicializar o editor que se junta não altera nada nos outros.  
A partir da `4.0.0`, também descarta os registos de colaboração do editor, que resolvem as [edições simultâneas](#concurrent-edits). Se o armazenamento partilhado do editor já teve um subscritor, o armazenamento volta a pedir aos outros editores os registos deles, como no seu primeiro [subscribe](#subscribe), para que um editor carregado de novo a meio de uma sessão resolva as edições da mesma forma que os outros.  
Atribuir `value` mantém os registos, mas, ao contrário de `setInitialValue`, é retransmitido: assim que o editor tem um armazenamento partilhado, todos os editores da sessão carregam o documento atribuído, pelo que nunca inicialize desse modo um editor que se junta.

Nem `value` nem `runtimeValue` contêm os registos nem a versão a que o relógio do editor chegou, pelo que um editor que se junta inicializado apenas a partir de `runtimeValue` vai buscá-los à resposta que os editores da sessão enviam ao seu primeiro subscribe.  
Até essa resposta chegar, uma edição feita pelo editor que se junta pode transportar uma versão inferior à que os outros têm, pelo que estes a recusam enquanto ela fica só no editor que se junta, e uma escrita mais antiga ainda a caminho sobrepõe-se à mais recente que a inicialização contém. Onde nenhum editor em execução responde, como quando um servidor ou um armazenamento de documentos guarda o documento da sessão, o editor que se junta nunca os recebe.  
A partir da `5.1.0`, entregue-os juntamente com o valor. Num editor da sessão, chame [`flushStreamBuffers()`](#flushstreambuffers), para que saia primeiro um arrastamento ou uma mudança de cor que ele ainda retenha, e leia depois, no mesmo instante, `runtimeValue` e o [`getLWW()`](#getlww) e o [`getVersion()`](#getversion) do seu armazenamento. O editor que se junta carrega o valor com `setInitialValue` e recebe o resto com o [`mergeLWW`](#mergelww) do seu próprio armazenamento, por esta ordem, já que cada `setInitialValue` descarta os registos. A sua edição seguinte transporta então uma versão superior a todas as que a inicialização contém, pelo que é aplicada sem ter de esperar por nenhuma resposta. Num armazenamento que já existe, [`reseed`](#reseed) faz as duas coisas numa só chamada.

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

Uma inicialização guardada assim para abrir editores que se juntam mais tarde contém as três coisas juntas. Não é um ficheiro: `value` continua a ser o que se escreve no armazenamento.  
Um [replicationStore](./remote-storage.md#runtimevalue-getter) não entrega registos, pelo que um editor que se junta inicializado a partir do seu `runtimeValue` continua a recebê-los da resposta dos editores.

## Edições simultâneas {#concurrent-edits}

Cada editor e cada réplica guarda, para cada nome e para quase todos os outros campos, a versão da escrita que o definiu: são os seus registos de colaboração. Uma escrita só é aplicada quando a sua versão não é inferior à que está guardada, pelo que editores que ouvem as mesmas alterações por ordens diferentes terminam com o mesmo documento.  
A partir da `5.1.0`, cada versão transporta, por baixo do seu contador, uma posição própria do editor que escreve, tirada do seu id. As versões crescem, por isso, em passos de 4 194 304 e excedem um inteiro de 32 bits quando o contador chega a 512. `JSON.stringify` e `JSON.parse` transportam-nas intactas, mas um retransmissor ou um armazenamento que as analise noutra linguagem tem de as manter como números de 64 bits, nunca como inteiros de 32 bits.

A partir da `5.1.0`, dois editores que alteram o mesmo nome ou campo no mesmo instante, à parte as exceções abaixo, terminam com o mesmo valor em todos os editores e réplicas: ao escreverem no mesmo contador, marcam duas versões diferentes, e a maior prevalece em todo o lado. Antes da `5.1.0`, ambos podiam marcar a mesma versão, e cada editor guardava a que ouvia por último, pelo que podiam terminar diferentes. Dois editores partilham uma posição com a probabilidade de 1 em 4 194 304 por par, e nesse caso empatam como antes.

A partir da `5.1.0`, a posição de uma tabela, a posição e o tamanho de uma nota ou de um grupo de tabelas, e a origem e o nível de zoom da vista são versionados do mesmo modo, e o que os move sai como o ponto onde terminam:

- um arrastamento como um `table.moveTo`, `memo.moveTo` ou `tableGroup.moveTo` por entidade movida, num só lote, pelo que o arrastamento de um grupo transporta os pontos das suas tabelas juntamente com o do grupo;
- a anulação ou o refazer de um arrastamento como o ponto onde coloca cada entidade;
- um deslocamento como `settings.scrollTo` e um zoom como `settings.changeZoomLevel`;
- o redimensionamento de uma nota ou de um grupo de tabelas como a sua posição e o seu tamanho em conjunto.

Assim, dois utilizadores que movam, ou movam e redimensionem, a mesma tabela, nota ou grupo de tabelas no mesmo instante terminam com ela num só ponto e num só tamanho em todos os editores e réplicas. O ponto vai para a escrita com a versão maior, os dois eixos em conjunto. Um movimento não escreve tamanho, pelo que um redimensionamento mantém o seu tamanho mesmo onde um movimento feito ao mesmo tempo fique com o ponto.  
Antes da `5.1.0`, um arrastamento saía como a distância percorrida, pelo que dois arrastamentos da mesma tabela se somavam, e um movimento e um redimensionamento da mesma nota ou grupo de tabelas feitos ao mesmo tempo podiam terminar diferentes.  
Um arrastamento inferior a 20 px, que não deixa nenhuma entrada de anulação, é enviado como qualquer outro, pelo que, como ponto, pode substituir um arrastamento da mesma entidade que outro utilizador tenha feito no mesmo instante. Um lote de arrastamento, de deslocamento ou de zoom que um transporte entregue duas vezes não move nada duas vezes.

Uma mudança de cor é uma exceção. Sai sem versão, e cada editor e cada réplica marca-a com a sua própria e guarda a cor que ouviu por último, pelo que dois utilizadores que mudem a cor da mesma tabela, nota ou grupo de tabelas no mesmo instante podem terminar com cores diferentes.  
Algumas alterações não guardam versão nenhuma, pelo que cada editor e cada réplica as aplica pela ordem em que as ouve, e duas feitas no mesmo instante também podem terminar diferentes: uma coluna movida dentro da sua tabela ou do seu índice (`column.move`, `indexColumn.move`) e uma alteração da [base de dados](../../guide/guides/table-related-functions.md#databases), de uma linha de [`View Option`](../../guide/guides/table-related-functions.md#table-view-options) ou de `Relationship DataType Sync`, `Maximum comment width` ou `Column Order` no separador [Definições](../../guide/guides/settings.md).  
As entidades que dois utilizadores adicionam no mesmo instante, como duas tabelas ou duas colunas da mesma tabela, também podem ficar numa ordem diferente em cada editor e cada réplica, e o `value` de cada um guarda a sua própria ordem.

Tudo isto vale entre editores e réplicas da `5.1.0` ou posterior; [Misturar versões](#mixing-releases) explica o que muda com um editor ou uma réplica mais antigos.

## Misturar versões {#mixing-releases}

Um editor aplica apenas os tipos de ação que a sua própria versão conhece, pelo que, numa sessão que mistura versões, os editores mais antigos perdem tudo o que viaja num tipo mais recente.

A partir da `3.10.0`, uma alteração ao [ON DELETE ou ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de uma relação viaja como um de dois novos tipos de ação, `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` pode transportar ambos. Um retransmissor que reencaminha as ações tal como estão não precisa de nada novo para eles.  
Um editor anterior à `3.10.0` ignora esses tipos de ação e campos: nunca fica a saber o ON DELETE nem o ON UPDATE de uma relação, e um documento guardado a partir dele não tem nenhum dos dois. Uma relação que um editor mais antigo adicione chega sem eles, pelo que ambos começam em `Not set`.

Todas as outras alterações que um editor `3.10.0` envia viajam em tipos de ação que os editores mais antigos já conhecem.  
O botão `Replace All` de [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) envia as suas edições como um único lote das mesmas ações de mudança de nome, de comentário e de nota que uma edição manual envia. As [opções de vista](../../guide/guides/table-related-functions.md#table-view-options) `Alternate Key` e `Referential Actions` viajam na ação `settings.changeShow` já existente.

A partir da `4.0.0`, estas alterações viajam em novos tipos de ação, e um retransmissor que reencaminha as ações tal como estão não precisa de nada novo para elas:

- um [grupo de tabelas](../../guide/guides/table-groups.md) adicionado, movido, redimensionado, com o nome alterado, com a cor alterada ou removido: `tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.resize`, `tableGroup.changeName`, `tableGroup.changeColor` e `tableGroup.remove`; uma tabela que entra num grupo ou sai dele: `table.changeGroup`;
- um clique no botão `Save` de [Mapear colunas](../../guide/guides/relationship-editing.md#map-columns) numa relação existente, que define de uma só vez as suas duas listas de colunas: `relationship.changeColumns`;
- um [bloqueio](../../guide/guides/settings.md#lock) ativado ou desativado: `settings.changeLockSettings`;
- uma edição do script `Before tables` ou `After tables` do separador [Esquema SQL](../../guide/guides/schema-sql.md): `settings.changeDDLScript`.

As opções de vista `Table Groups` e `Memos` viajam na ação `settings.changeShow` já existente.  
A ação `settings.changeIgnoreSaveSettings`, que os interruptores `Save Scroll Information` e `Save Zoom Information` enviavam antes de os bloqueios os substituírem, já não é enviada, e a ação `settings.changeRelationshipOptimization` deixou de existir. Um editor `4.0.0` que receba qualquer uma delas não altera nada.

Um editor anterior à `4.0.0` ignora os novos tipos de ação: nunca vê um grupo de tabelas nem quais as tabelas que dele fazem parte, embora o arrasto de um grupo continue a mover aí as tabelas do grupo, já que também envia um movimento de cada uma dessas tabelas.  
Mantém as colunas antigas de uma relação após um clique no botão `Save` de Mapear colunas e, quando uma coluna desse mapeamento antigo é removida nele, a relação desaparece em todos os editores. Não tem bloqueios nem scripts.  
Um documento guardado a partir dele não tem nada disto, e um editor `4.0.0` abre-o com todos os bloqueios ativados.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que guarde o seu documento, na `4.0.0` ou posterior.

Um editor `4.1.0` não envia nenhum tipo de ação novo, pelo que editores e réplicas `4.0.0` e `4.1.0` partilham uma sessão sem que nada se perca.  
O seu [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) também pesquisa nomes de índices e nomes de grupos de tabelas, e os botões `Replace` e `Replace All` mudam-lhes o nome com as ações `index.changeName` e `tableGroup.changeName` que um editor `4.0.0` já aplica.

A partir da `4.2.0`, estas alterações viajam em novos tipos de ação, e um retransmissor que reencaminha as ações tal como estão não precisa de nada novo para elas:

- o [nome lógico](../../guide/guides/logical-names.md) de uma tabela ou de uma coluna: `table.changeLogicalName` e `column.changeLogicalName`; se o seu nome foi [derivado dos dicionários](../../guide/guides/dictionary.md#deriving-physical-names): `table.changeNameDerived` e `column.changeNameDerived`;
- uma coluna vinculada a um [domínio](../../guide/guides/dictionary.md#domains-and-data-types) ou desvinculada: `column.changeDomain`;
- uma palavra, um termo ou um domínio adicionado, alterado (incluindo o seu lugar na folha, tal como uma ordenação o define) ou removido no separador [Dicionário](../../guide/guides/dictionary.md): `dictionary.add`, `dictionary.update` e `dictionary.remove`;
- uma mudança da [vista de nomes](../../guide/guides/logical-names.md#switching-the-view): `settings.changeNameViewMode`.

O bloqueio `Name View` viaja na ação `settings.changeLockSettings` já existente, a opção de vista `Domain` em `settings.changeShow` e uma mudança de posição de `Logical Name` ou `Domain` na [ordem das colunas](../../guide/guides/settings.md#adjusting-column-order) em `settings.changeColumnOrder`.  
Os `editor.clear` e `editor.loadJson` de uma importação de Esquema SQL, GraphQL, DBML ou AML a partir de `Import` transportam `keepDictionaries: true`, que mantém as palavras, os termos e os domínios em todos os editores. O mesmo acontece com os de um [setSchemaSQL](../erd-editor-element.md#setschemasql), `setSchemaGraphQL`, `setSchemaDBML` ou `setSchemaAML` de substituição.  
Um nome físico que os dicionários derivam viaja em `table.changeName` ou `column.changeName`, e o tipo de dados que um domínio dá às suas colunas em `column.changeDataType`, as ações que uma edição manual envia.

Um editor anterior à `4.2.0` ignora os novos tipos de ação: não tem nomes lógicos, vínculos aos domínios, dicionários nem vista de nomes. Um bloqueio ou desbloqueio de `Name View` não altera nada nele, nem uma mudança de posição de `Logical Name` ou `Domain` na ordem das colunas, ou uma mudança para a posição de qualquer um deles. O mesmo acontece com um bloqueio `Canvas Type` ativado por um editor que chegou ao separador Definições a partir do separador Dicionário: o editor mais antigo não conhece esse separador, pelo que mantém `Canvas Type` desbloqueado. Continua a mostrar os nomes físicos que os dicionários derivam e os tipos de dados que os domínios dão.  
As suas próprias edições nada sabem de nomes lógicos, domínios ou dicionários, com estes efeitos nos editores mais recentes:

- Uma tabela ou coluna a que muda o nome à mão mantém o nome marcado como derivado, pelo que um nome lógico escrito para ela mais tarde num editor mais recente pode voltar a derivar o nome por cima do que ele escreveu.
- Um tipo de dados que dá a uma coluna vinculada a um domínio deixa o vínculo intacto, pelo que a folha `Checks` lista `Domain type mismatch` e a próxima alteração de tipo do domínio volta a dar à coluna o tipo do domínio.
- As colunas de chave externa de uma relação que adiciona não recebem nome lógico nem domínio da respetiva chave.
- Uma tabela que cola ou duplica chega sem nomes lógicos nem vínculos aos domínios.
- Uma importação de Esquema SQL, GraphQL, DBML ou AML feita nele não envia `keepDictionaries`, pelo que esvazia as palavras, os termos e os domínios em todos os editores.
- A sua anulação de um carregamento, de uma importação ou de `clear()` carrega a sua própria cópia do documento em todos os editores, e essa cópia não tem nomes lógicos, vínculos aos domínios nem dicionários.
- Essa cópia, e o documento que uma importação de Esquema SQL, GraphQL, DBML ou AML feita nele carrega, também repõem o bloqueio `Name View` de todos os editores no estado em que esse editor o encontrou. Todos os editores guardam então `Physical Names` como vista de nomes, e também a mostram se o bloqueio estiver desativado.

Um documento guardado a partir dele não tem nomes lógicos, vínculos aos domínios, dicionários nem vista de nomes, pelo que um editor `4.2.0` o abre na vista `Physical Names`. O editor mais antigo guarda, ainda assim, o bloqueio `Name View` tal como o encontrou, pelo que um documento desbloqueado num editor `4.2.0` continua desbloqueado.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que guarde o seu documento, na `4.2.0` ou posterior.

Um editor `5.1.0` não envia nenhum tipo de ação novo, pelo que editores e réplicas anteriores à `5.1.0` continuam a partilhar uma sessão com ele, e um retransmissor que reencaminha as ações tal como estão não precisa de nada novo. O que [Edições simultâneas](#concurrent-edits) descreve, porém, vale apenas entre editores e réplicas `5.1.0`:

- Os arrastamentos de um editor `5.1.0` viajam como pontos em `table.moveTo`, `memo.moveTo` e `tableGroup.moveTo`, que os editores mais antigos já aplicam, e os seus deslocamentos e zooms como pontos em `settings.scrollTo` e `settings.changeZoomLevel`, que, como todos os deslocamentos e zooms, nenhum outro editor aplica e só as réplicas recebem. Um editor mais antigo aplica cada ponto de um arrastamento pela ordem em que chega, fora de qualquer registo, e uma réplica mais antiga faz o mesmo com cada ponto de um arrastamento, de um deslocamento ou de um zoom, pelo que dois pontos enviados ao mesmo tempo para uma entidade, ou para a vista, podem terminar diferentes aí.
- O arrastamento de um editor mais antigo continua a viajar como uma distância percorrida, que todos os editores e réplicas somam fora dos seus registos, e o seu deslocamento ou zoom também como uma distância, que todas as réplicas somam do mesmo modo. Uma distância e um ponto numa só entidade feitos ao mesmo tempo podem terminar diferentes em editores e réplicas que os ouçam por ordens diferentes, e uma distância que um transporte entregue duas vezes é somada duas vezes.
- Fora das exceções que [Edições simultâneas](#concurrent-edits) refere, a escrita de um nome ou campo por um editor `5.1.0` feita no mesmo instante que a escrita do mesmo por um editor mais antigo prevalece quase sempre, com a mesma resposta em todos os editores e réplicas. Dois editores mais antigos ainda podem terminar diferentes por causa de um só campo escrito ao mesmo tempo.
- Um editor `5.1.0` só envia uma alteração da linguagem, do formato do nome ou do tipo de delimitador do Gerador de código enquanto o respetivo bloqueio está desativado, com a marca `shared: true`, que um editor mais antigo ignora, aplicando a alteração como antes. Um editor mais antigo continua a enviar, sem marca, a que faz sob o bloqueio: um editor ou uma réplica `5.1.0` descarta-a enquanto essa definição está bloqueada aí, e os editores mais antigos aplicam-na. Assim, sob um bloqueio, os editores mais antigos seguem as escolhas uns dos outros enquanto os editores `5.1.0` mantêm as suas, e o ficheiro guarda o valor bloqueado em qualquer dos casos. Um desbloqueio feito em qualquer uma das versões leva o valor de quem desbloqueia a todos os editores e réplicas.
- Um carregamento que substitui o documento, como um `value` atribuído, `clear()` ou uma importação de substituição, termina uma relação em desenho em todos os editores `5.1.0`, naquele que o fez e em cada um dos que o recebem. Um editor mais antigo mantém o desenho preparado ao longo dele.

Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que guarde o seu documento, na `5.1.0` ou posterior, para que as edições feitas no mesmo instante terminem iguais em todo o lado, à parte as exceções que [Edições simultâneas](#concurrent-edits) refere; a `4.2.0` ou posterior continua a ser o que mantém os nomes lógicos e os dicionários. Um [servidor MCP](../../mcp/live-and-headless.md#edits-made-at-the-same-moment) anterior à `1.2.0` conta aqui como um editor anterior à `5.1.0`, e um editor anterior à `5.1.0` não pode de todo ser ligado a uma sala [Yjs](./yjs.md).

## SharedStoreConfig {#sharedstoreconfig}

### getNickname {#getnickname}

Define a alcunha mostrada junto ao cursor do rato deste utilizador nos outros editores.  
Os outros utilizadores veem `user` quando a alcunha está em falta ou em branco.

```js
editor.getSharedStore({
  getNickname: () => 'nickname...',
});
```

### mouseTracker {#mousetracker}

Difunde o cursor do rato deste utilizador para os outros editores. A predefinição é `true`.  
Os cursores enviados por outros utilizadores são sempre mostrados na tela ERD.

```js
editor.getSharedStore({ mouseTracker: false });
```

### focusTracker {#focustracker}

Difunde aquilo em que este utilizador está a trabalhar. A predefinição é `true`.  
A tabela e a célula em que tem o foco, as tabelas, notas e grupos de tabelas que selecionou e o retângulo que arrasta na tela são enviados para os outros editores e aí desenhados.  
Cada utilizador recebe uma cor própria, para que seja possível distingui-los: um contorno na tabela com o foco, um sublinhado na célula com o foco, um anel à volta das tabelas, notas e grupos de tabelas selecionados e um retângulo de arrasto tracejado.  
A partir da `4.2.0`, cada utilizador pode estar a ver uma [vista de nomes](../../guide/guides/logical-names.md#collaborators) diferente enquanto o respetivo bloqueio está ativado, ou depois de um editor só de leitura mudar a sua própria vista. Uma célula com o foco que a sua vista não desenha é sublinhada na célula que esta desenha no seu lugar: o nome e o nome lógico ocupam o lugar um do outro, tal como o tipo de dados e o domínio.  
A presença que chega de outros utilizadores é sempre desenhada na sua tela, quer esta opção esteja ativada, quer não.  
No modo Flow do separador Visualização, o foco e a seleção dos outros utilizadores são desenhados nos cartões das tabelas, mas os seus retângulos de arrasto não. As tabelas que aí seleciona continuam a ser enviadas; o retângulo que aí arrasta não.

```js
editor.getSharedStore({ focusTracker: false });
```

Desative ambos os rastreadores para utilizar o armazenamento partilhado como um simples retransmissor que não publica presença própria.  
A presença enviada por outros editores continua a ser recebida e desenhada.  
É o que fazem os editores do VS Code, do Obsidian, de um IDE da JetBrains e do Google Drive.

```js
editor.getSharedStore({ mouseTracker: false, focusTracker: false });
```

O cursor, o foco, a seleção e o retângulo de arrasto viajam no mesmo fluxo que as alterações ao documento, mas são efémeros.  
Nunca entram no documento, no histórico de anulação nem em `editor.value`, pelo que um transporte pode descartá-los livremente e um replicationStore ignora-os.

## SharedStore {#sharedstore}

### connection, disconnect {#connection-disconnect}

Estes métodos definem o estado atual da ligação.  
Enquanto o armazenamento está desligado, as alterações são acumuladas internamente.  
As alterações acumuladas são emitidas para os subscritores assim que a transmissão volta a ser possível.  
O estado predefinido é ligado (`connection`).

```js
sharedStore.connection();
sharedStore.disconnect();
```

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica à instância atual do editor as alterações vindas de outras instâncias do editor.  
Quando um lote contém o pedido de registos de outro editor, como o primeiro [subscribe](#subscribe) de um editor que se junta envia, o armazenamento responde através dos seus subscritores com os seus registos e a sua versão, a menos que não tenha registos.  
A partir da `5.1.0`, envia primeiro todos os lotes de fluxo que ainda retém, como [flushStreamBuffers](#flushstreambuffers) o faz, para que cada versão que a sua resposta transporta assente numa escrita que já foi enviada aos outros. A chegada de um editor que se junta faz, por isso, todos os editores da sessão enviarem de uma vez um arrastamento, um deslocamento, um zoom, uma mudança de cor ou um redimensionamento de nota que ainda retenham.

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Subscreve as alterações do editor.  
Nada sai do editor enquanto não houver pelo menos um subscritor, e as alterações feitas antes disso são acumuladas.  
O primeiro subscribe também pede aos outros editores os respetivos registos de colaboração, que resolvem as [edições simultâneas](#concurrent-edits), para que um editor que se junta mais tarde as resolva da mesma forma.  
Não traz o documento, por isso [inicialize](#seeding-a-collaborator) primeiro um editor que se junta mais tarde; a partir da `5.1.0`, a inicialização também pode transportar os registos.  
A partir da `4.0.0`, o armazenamento volta a pedi-los sempre que `setInitialValue`, ou, a partir da `5.1.0`, [reseed](#reseed), carrega um documento no seu editor depois desse primeiro subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envia de imediato os lotes de fluxo que este armazenamento ainda retém, em vez de os enviar após o respetivo período de inatividade.  
A partir da `3.9.2`, funciona num armazenamento obtido com `getSharedStore`; na `3.9.1`, o método existe no tipo, mas não faz nada.  
Mover uma tabela, uma nota ou um grupo de tabelas, mudar a sua cor, redimensionar uma nota e deslocar ou aplicar zoom à vista são feitos, cada um, como um fluxo de pequenas alterações. Redimensionar um grupo de tabelas não: é enviado uma vez, quando o arrasto termina.  
O armazenamento junta cada fluxo num único lote e retém-no até o fluxo estar inativo durante 200 ms, em duas fases. Uma mudança de cor ou o redimensionamento de uma nota passa pelas duas, pelo que sai cerca de 400 ms após a última alteração, como acontecia com todos os fluxos antes da `5.1.0`. A partir da `5.1.0`, um arrastamento, um deslocamento ou um zoom sai após a primeira fase, cerca de 200 ms depois do seu último passo, como o ponto onde termina (consulte [Edições simultâneas](#concurrent-edits)).  
Uma chamada termina essa espera nas duas fases. Enquanto o armazenamento está ligado, um subscritor recebe o lote antes de a chamada retornar. Uma chamada sem nada retido não envia nada.  
O método `destroy`, seja o do armazenamento ou o do editor, descarta um lote que ainda esteja retido, por isso chame primeiro `flushStreamBuffers` quando deixar de usar um armazenamento e os outros devam ficar com a última alteração, como quando se fecha um separador.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### getLWW {#getlww}

A partir da `5.1.0`, devolve uma cópia dos registos de colaboração do editor (consulte [Edições simultâneas](#concurrent-edits)).  
A cópia é feita através de JSON, pelo que é um objeto simples pronto para `JSON.stringify`, e uma alteração a ela deixa os registos do armazenamento como estavam.  
Entregue-a tal como está ao [mergeLWW](#mergelww) ou ao [reseed](#reseed) de outro armazenamento. A sua forma é a do próprio editor, pelo que não leia nenhum campo dela.  
Leia-a juntamente com [getVersion](#getversion) e com o `runtimeValue` do editor no mesmo instante para [inicializar um editor que se junta](#seeding-a-collaborator).

```js
const lww = sharedStore.getLWW();
```

### mergeLWW {#mergelww}

A partir da `5.1.0`, incorpora nos registos deste armazenamento os registos que outro armazenamento entregou com [getLWW](#getlww), mantendo a versão maior de cada um, e incorpora `version` no relógio do editor, que mantém a maior entre a sua e a indicada.  
Não altera nada no documento: nenhum byte de `value` ou de `runtimeValue`, nenhuma entrada de anulação e nenhum evento `change`. Apenas eleva as versões que uma escrita posterior tem de superar, pelo que uma escrita mais antiga do que os registos indicados é depois recusada, e a edição seguinte do editor transporta uma versão superior a `version`.  
Não envia nada e não responde a nada. É o que o primeiro subscribe de um editor que se junta obtém da resposta dos outros, incorporado diretamente.  
Chame-o depois de `setInitialValue`, nunca antes: cada `setInitialValue` e cada [reseed](#reseed) descarta os registos guardados e, com eles, o que um `mergeLWW` anterior incorporou.

```js
sharedStore.mergeLWW(lww, version);
```

### getVersion {#getversion}

A partir da `5.1.0`, devolve a versão mais alta que o relógio do editor incorporou: a maior das versões das alterações que fez ou recebeu, dos pedidos de registos e das respostas que uma entrada na sessão troca, e de cada `version` indicada a `mergeLWW` ou `reseed`.  
Os cursores, o foco, as seleções e os retângulos de arrasto, próprios ou de outro editor, não a movem.  
Entregue-a com [getLWW()](#getlww), lido no mesmo instante, ao [mergeLWW](#mergelww) ou ao [reseed](#reseed) de um editor que se junta. É uma [versão](#concurrent-edits) como as que as suas ações transportam.

```js
const version = sharedStore.getVersion();
```

### forgetPeer {#forgetpeer}

A partir da `5.1.0`, remove de imediato o cursor, o foco, a seleção e o retângulo de arrasto que o editor com o id indicado enviou, e o prazo de expiração que cada um aguardava. Os de todos os outros editores ficam.  
O id é o `meta.editorId` que cada ação enviada pelo armazenamento partilhado desse editor transporta. Um id de que este editor não tem nada não altera nada.  
Chame-o quando o seu transporte souber que um par saiu. Caso contrário, o que o par enviou continua desenhado até expirar: o seu cursor 30 segundos após o último recebido, o seu foco e a sua seleção 90 segundos depois, e o seu retângulo de arrasto 3 segundos depois.

```js
sharedStore.forgetPeer(editorId);
```

### reseed {#reseed}

A partir da `5.1.0`, volta a abrir no editor o documento de uma sessão, como uma nova entrada o faz. A ligação [Yjs](./yjs.md) chama-o para abrir o documento de uma sala quando se liga a uma sala que foi inicializada, e de novo em cada nova entrada, mantendo o ecrã depois de ter entrado na sala.  
Carrega `value` como [setInitialValue](../erd-editor-element.md#setinitialvalue) faz e recebe `lww` e `version` como [mergeLWW](#mergelww) faz, pelo que o armazenamento passa a ter exatamente os registos indicados e o seu relógio a maior entre a sua versão e `version`. Esvazia também o histórico de anulação e, ao contrário de `setInitialValue`, descarta a seleção e o foco, já que podem nomear o que o valor já não contém.  
À parte a derivação do nome lógico abaixo, não cria nenhuma entrada de anulação, não emite nenhum evento `change` e não envia nenhuma alteração. Depois de o armazenamento ter tido um subscritor, envia o pedido de registos que todos os carregamentos deste tipo enviam, que um transporte que já entregou os registos pode descartar, e, com o [focusTracker](#focustracker) ativado, a seleção e o foco limpos.  
Tal como `setInitialValue`, funciona enquanto [readonly](../erd-editor-element.md#readonly) está definido, descarta uma vista Flow, termina uma relação em desenho e fecha os editores de nota, de nome de grupo de tabelas e de célula, mantendo ou descartando o que neles foi escrito da mesma forma; um nome que uma célula de nome lógico ao fechar derive do que o seu leitor escreveu é uma edição normal: enviada, anulável e emitida como um evento `change`.

Sem `keepScreen`, o ecrã mostra o que o valor contém, como depois de `setInitialValue`. Com `keepScreen: true`, o ecrã do leitor é recolocado por cima do documento carregado, só nesse ecrã:

- a posição de deslocamento e o nível de zoom, depois de o elemento os ter mostrado; um que nunca foi mostrado, ou que foi carregado enquanto estava oculto e não foi mostrado desde então, abre onde o valor o põe, como acontece a um editor que se junta tarde;
- o separador, quando o carregamento o moveu, e, no separador Definições, também o separador de onde o leitor veio, que um bloqueio `Canvas Type` ativado aí nomeia;
- a vista de nomes e cada definição do Gerador de código que o leitor mostrava por conta própria sob o seu bloqueio, mas só quando esse bloqueio estava ativado antes do carregamento, continua ativado depois dele e mantém o mesmo valor bloqueado. Assim, quando entretanto um par desbloqueou, alterou e voltou a bloquear uma definição com outro valor, o editor abre com o novo valor bloqueado, e onde o bloqueio está desativado antes ou depois do carregamento, mostra o valor carregado;
- todas as definições que um leitor só de leitura alterou no seu próprio ecrã, digam o que disserem os bloqueios.

Nada disto é enviado, e `value` e `runtimeValue` continuam a indicar o documento carregado. O desbloqueio posterior de um par substitui uma definição de código mantida assim, como qualquer desbloqueio.  
O deslocamento ou o zoom seguinte do leitor, feito enquanto o editor pode editar, volta a tornar a posição de deslocamento e o nível de zoom mantidos os do documento e sai encabeçado pelo ponto onde o ecrã está, pelo que as réplicas também recebem esse zoom.

Voltar a inicializar deixa como está o que o armazenamento retém. Um arrastamento, um deslocamento ou um zoom ainda retido sai depois disso, lido a partir do documento inicializado de novo; uma mudança de cor ou o redimensionamento de uma nota sai como foi feito, embora o editor já não o mostre; e o que `disconnect()` reteve sai em `connection()`.  
Por isso, chame primeiro [flushStreamBuffers](#flushstreambuffers), envie o que ele emite e volte a inicializar com um valor que o contenha. Nunca volte a inicializar enquanto estiver desligado.

```js
sharedStore.reseed(seed.value, {
  lww: seed.lww,
  version: seed.version,
  keepScreen: true,
});
```

### destroy {#destroy}

Destrói completamente a instância de sharedStore.  
O próprio editor não é afetado, pelo que sair de uma sessão mantém o documento editável.  
Os rastreadores do rato e do foco param assim que o último sharedStore que o editor forneceu é destruído.  
Um lote de fluxo que o armazenamento ainda retenha é descartado com ele; chame primeiro [flushStreamBuffers](#flushstreambuffers) para o enviar.  
Os cursores, o foco, as seleções e os retângulos de arrasto que outros editores enviaram continuam desenhados até expirarem; a partir da `5.1.0`, [forgetPeer](#forgetpeer) remove de imediato os de um editor.

```js
sharedStore.destroy();
```
