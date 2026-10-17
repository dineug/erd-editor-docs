---
sidebar_position: 1
description: Retransmitir as alterações do editor entre instâncias com getSharedStore, inicializar um editor que entra a partir de runtimeValue e mostrar o cursor, o foco, a seleção e o retângulo de arrasto de cada colaborador.
---

# Edição colaborativa

`getSharedStore()` transforma um editor em um nó de uma sessão colaborativa.  
Ele emite cada alteração como um fluxo de ações e aplica as ações que os outros editores enviam de volta — o transporte entre eles fica por sua conta (WebSocket, WebRTC ou qualquer outro meio capaz de transportar JSON).  
É um dos métodos de [ErdEditorElement](../erd-editor-element.md) e é usado em conjunto com o [armazenamento remoto](./remote-storage.md) quando as alterações retransmitidas também precisam ser armazenadas.

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

Uma ação é um objeto simples e serializável que descreve uma alteração no documento, então ela passa intacta por `JSON.stringify` a caminho do transporte.  
As ações chegam em lotes: `subscribe` entrega um array, e esse array é uma unidade — retransmita-o inteiro e despache-o inteiro do outro lado.  
Trate uma ação como opaca e repasse-a sem alterações, em vez de lê-la ou reescrevê-la, pois são os dados de controle que ela carrega que mantêm os editores sincronizados.

Parte do que um editor faz fica restrita a esse editor.  
Trazer uma tabela, uma nota ou um grupo de tabelas para a frente, como acontece ao selecionar um deles, não é enviado.  
Também não são enviadas as escolhas `Statements`, `Header` e `Tables` da aba [Esquema SQL](../../guide/guides/schema-sql.md), que pertencem à janela em que são feitas.  
A partir da `4.1.0`, o [explorador](../../guide/guides/explorer.md) também fica restrito ao seu editor: se ele está aberto, sua largura, suas linhas recolhidas, a linha em que o teclado está, a posição de rolagem da árvore, sua pesquisa e suas opções não são enviados.  
Também não é enviada a [iluminação](../../guide/guides/relationship-editing.md#reading-a-connector) que ir para uma chave estrangeira aplica ao conector do relacionamento dela.  
Uma rolagem, um zoom ou uma troca de aba são enviados, mas nunca movem a área visível nem a aba de outro usuário. Isso inclui a rolagem que um salto a partir do explorador faz e a troca para a aba ERD quando o explorador é aberto a partir de outra aba.

Os [bloqueios](../../guide/guides/settings.md#lock) são compartilhados: o bloqueio ou desbloqueio mais recente de uma configuração prevalece em todos os editores, e um bloqueio carrega os valores do editor que o ativou, então todos os editores e réplicas salvam o mesmo valor.  
Portanto, um bloqueio `Viewport` salva a área visível do editor que o ativou, e um bloqueio `Canvas Type`, a última aba em que esse editor estava antes da aba Configurações, onde os bloqueios são ativados.  
Desativar o bloqueio `Language`, `Table Name Case`, `Column Name Case` ou `Bracket Type` também define essa configuração, em todos os editores, com o valor mostrado no editor que o desativou, para que todos continuem salvando um único valor. Desativar `Viewport` ou `Canvas Type` não move a área visível nem a aba de ninguém.

Uma edição no script `Before tables` ou `After tables` é enviada inteira quando o campo dele perde o foco. Os dois scripts são resolvidos separadamente, então a edição de um colaborador em um deles nunca sobrescreve o outro.

Nada do que se faz no [modo Flow](../../guide/guides/visualization.md#flow-never-edits-the-document) da aba Visualização é uma alteração no documento, então um editor no Flow não envia alterações aos outros, e as alterações que eles enviam continuam sendo aplicadas enquanto ele está lá.  
A única exceção é sair do Flow para outra aba: essa troca de aba é enviada como qualquer outra.  
O botão de link externo do cartão, um resultado da [pesquisa rápida](../../guide/guides/quick-search.md#searching-the-diagram) escolhido após `#`, `@` ou `:` e a abertura do [explorador](../../guide/guides/explorer.md#opening-and-closing) saem todos do Flow para a aba ERD. Uma rolagem feita ali pelo botão do cartão ou por um resultado da pesquisa rápida também é enviada.

## Dois editores em uma página {#two-editors-on-one-page}

Aqui, a ligação de subscribe a dispatch faz o papel da rede, para que seja possível ver a forma de uma sessão sem um transporte no caminho.

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

Os dois editores aqui partem do mesmo documento novo e vazio, então nenhum deles precisa ser inicializado.  
Com três ou mais editores, envie os lotes de cada um a todos os outros: um editor nunca repassa o que recebeu.

## Inicializar um colaborador {#seeding-a-collaborator}

Um armazenamento compartilhado retransmite as alterações à medida que são feitas e nunca entrega ao editor que entra o documento no estado em que está, então um editor que entra em uma sessão já em andamento precisa receber o documento primeiro.  
A partir da `4.0.0`, inicialize-o com o [`runtimeValue`](../erd-editor-element.md#runtimevalue) de um editor que já está na sessão, não com `value` nem com o arquivo salvo.

```js
editor2.setInitialValue(editor1.runtimeValue);

const sharedStore2 = editor2.getSharedStore();
```

O valor em tempo de execução ainda contém o que foi removido desde que o documento foi aberto, então, quando outro editor desfaz uma remoção mais tarde, o editor que entrou traz a tabela de volta com seu nome e suas colunas.  
[`value`](../erd-editor-element.md#value) é a forma que um arquivo contém, sem as entidades removidas, então um editor que entra inicializado com ele, ou com o arquivo, traria de volta, em vez disso, uma tabela vazia e sem nome.  
Continue escrevendo `value` no armazenamento: `runtimeValue` serve apenas para inicializar outro editor, uma segunda exibição ou um [replicationStore](./remote-storage.md).  
Os editores no VS Code, no Obsidian, em uma IDE da JetBrains e no aplicativo web inicializam assim uma segunda exibição de um documento aberto.

`setInitialValue` não é retransmitido, então inicializar o editor que entra não altera nada nos outros.  
A partir da `4.0.0`, ele também descarta os registros de colaboração do editor, que resolvem as edições simultâneas. Se o armazenamento compartilhado do editor já teve um assinante, o armazenamento pede de novo os registros dos outros editores, como no seu primeiro [subscribe](#subscribe), para que um editor carregado novamente no meio de uma sessão resolva as edições da mesma forma que os outros.  
Atribuir `value` mantém os registros, mas, ao contrário de `setInitialValue`, é retransmitido: assim que o editor tem um armazenamento compartilhado, todos os editores da sessão carregam o documento atribuído, então nunca inicialize dessa forma um editor que entra.

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

Um editor anterior à `4.0.0` ignora os novos tipos de ação: ele nunca vê um grupo de tabelas nem quais tabelas estão nele, embora arrastar um grupo ainda mova as tabelas do grupo nesse editor, já que o arrasto também envia o `table.move` delas.  
Ele mantém as colunas antigas de um relacionamento após um `Save` em Mapear colunas, e, quando uma coluna desse mapeamento antigo é removida nele, o relacionamento desaparece em todos os editores. Ele não tem bloqueios nem scripts.  
Um documento salvo por um deles não tem nada disso, e um editor `4.0.0` o abre com todos os bloqueios ativados.  
Mantenha todos os editores de uma sessão, e qualquer [replicationStore](./remote-storage.md#dispatch-dispatchsync) que armazene o documento dela, na `4.0.0` ou posterior.

Um editor `4.1.0` não envia nenhum tipo de ação novo, então editores e réplicas `4.0.0` e `4.1.0` compartilham uma sessão sem perder nada.  
Nele, [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) também pesquisa nomes de índices e nomes de grupos de tabelas, e `Replace` e `Replace All` os renomeiam com as ações `index.changeName` e `tableGroup.changeName` que um editor `4.0.0` já aplica.

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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Assina as alterações do editor.  
Nada sai do editor até que haja pelo menos um assinante, e as alterações feitas antes disso ficam em buffer.  
O primeiro subscribe também pede aos outros editores os registros de colaboração deles, que resolvem as edições simultâneas, para que um editor que entra tarde as resolva da mesma forma.  
Ele não traz o documento, então [inicialize](#seeding-a-collaborator) primeiro um editor que entra tarde.  
A partir da `4.0.0`, o armazenamento volta a pedi-los sempre que `setInitialValue` carrega um documento no seu editor depois desse primeiro subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envia agora os lotes de fluxo que este armazenamento ainda está retendo, em vez de depois do período de inatividade deles.  
A partir da `3.9.2`, ele funciona em um armazenamento obtido de `getSharedStore`; na `3.9.1`, o método está no tipo, mas não faz nada.  
Mover uma tabela, uma nota ou um grupo de tabelas, mudar a cor de um deles, redimensionar uma nota e rolar ou aplicar zoom na área visível chegam, cada um, como um fluxo de pequenas alterações. Redimensionar um grupo de tabelas não: ele é enviado uma única vez, quando o arrasto termina.  
O armazenamento reúne cada fluxo em um único lote e o retém até que o fluxo fique inativo por 200 ms. Ele faz isso em duas etapas, então o lote sai cerca de 400 ms após a última alteração.  
Uma chamada encerra essa espera nas duas etapas. Enquanto o armazenamento está conectado, um assinante recebe o lote antes que a chamada retorne. Uma chamada sem nada retido não envia nada.  
`destroy`, seja o do armazenamento ou o do editor, descarta um lote que ainda está retido, então chame este método primeiro quando deixar de usar um armazenamento e os outros editores precisarem manter a última alteração, como quando uma aba é fechada.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Destrói completamente a instância de sharedStore.  
O próprio editor não é afetado, então sair de uma sessão mantém o documento editável.  
Os rastreadores de mouse e de foco param assim que o último sharedStore que o editor forneceu é destruído.  
Um lote de fluxo que o armazenamento ainda está retendo é descartado junto com ele; chame [flushStreamBuffers](#flushstreambuffers) antes para enviá-lo.

```js
sharedStore.destroy();
```
