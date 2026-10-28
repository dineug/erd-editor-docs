---
sidebar_position: 1
description: Retransmitir as alterações do editor entre instâncias com getSharedStore, inicializar a partir de runtimeValue um editor que se junta à sessão e mostrar o cursor, o foco, a seleção e o retângulo de arrasto de cada colaborador.
---

# Edição colaborativa

`getSharedStore()` transforma um editor num nó de uma sessão colaborativa.  
Emite cada alteração como um fluxo de ações e aplica as ações que os outros editores enviam de volta — cabe-lhe fornecer o transporte entre eles (WebSocket, WebRTC ou qualquer outro meio capaz de transportar JSON).  
É um dos métodos de [ErdEditorElement](../erd-editor-element.md) e combina-se com o [armazenamento remoto](./remote-storage.md) quando as alterações retransmitidas também têm de ser armazenadas.

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

Uma ação é um objeto simples e serializável que descreve uma alteração ao documento, pelo que sobrevive a `JSON.stringify` a caminho do transporte.  
As ações chegam em lotes: `subscribe` entrega-lhe um array e esse array é uma unidade — retransmita-o inteiro e despache-o inteiro do outro lado.  
Trate uma ação como opaca e reencaminhe-a tal como está, em vez de a ler ou reescrever, já que a informação de controlo que transporta é o que mantém os editores sincronizados.

Parte do que um editor faz fica nesse editor.  
Trazer uma tabela, uma nota ou um grupo de tabelas para a frente, como acontece ao selecionar um deles, não é enviado.  
Também não são enviadas as escolhas `Statements`, `Header`, `Write logical names into empty comments` (a partir da `4.2.0`) e `Tables` do separador [Esquema SQL](../../guide/guides/schema-sql.md), que pertencem à janela em que são feitas.  
A partir da `4.1.0`, o [explorador](../../guide/guides/explorer.md) também fica no seu editor: se está aberto, a sua largura, as suas linhas recolhidas, a linha com o foco do teclado, a posição de deslocamento da árvore e a sua pesquisa e opções não são enviados.  
Também não é enviada a [iluminação](../../guide/guides/relationship-editing.md#reading-a-connector) que o conector da relação recebe quando se vai para uma chave externa.  
A partir da `4.2.0`, o separador [Dicionário](../../guide/guides/dictionary.md) também fica no seu editor: a folha que é mostrada e, em cada folha, a pesquisa, a seleção, o deslocamento e as larguras das colunas não são enviados. As suas edições, ordenações e importações de CSV são.  
Um deslocamento, um zoom ou uma mudança de separador são enviados, mas nunca alteram a vista nem o separador de outro utilizador. Isto inclui o deslocamento provocado por um salto a partir do explorador, a mudança para o separador ERD quando o explorador se abre a partir de outro separador e ainda a mudança de separador e o deslocamento provocados por um salto da folha [`Checks`](../../guide/guides/dictionary.md#the-checks-sheet) do separador Dicionário para uma tabela ou coluna. Um salto dessa folha para uma palavra, um termo ou um domínio fica no separador Dicionário, pelo que nada disso é enviado.

A partir da `4.2.0`, uma mudança da [vista de nomes](../../guide/guides/logical-names.md#switching-the-view) também é enviada, e o seu [bloqueio](../../guide/guides/settings.md#lock) decide o que os outros editores fazem com ela. O bloqueio `Name View` está ativado num diagrama novo e em qualquer documento anterior à `4.2.0`.  
Enquanto o bloqueio está ativado, a mudança só aparece no editor que a fez: continua a ser enviada, mas todos os outros editores e todas as réplicas a descartam, pelo que cada utilizador pode estar a ver uma vista diferente enquanto o `value` mantém a vista bloqueada. Uma alteração da linguagem, de um formato do nome ou do tipo de delimitador é diferente: chega a todos os editores, quer o respetivo bloqueio esteja ativado, quer não.  
Enquanto o bloqueio está desativado, uma mudança feita num editor que pode editar muda a vista de nomes em todos os editores e réplicas, prevalecendo a mudança mais recente, e todos eles a guardam.  
A mudança feita por um editor só de leitura fica sempre nesse editor, e esse editor continua a seguir as mudanças partilhadas dos outros.

A partir da `5.0.0`, um editor [só de leitura](../erd-editor-element.md#readonly) não envia nenhuma alteração. O deslocamento, o zoom, o separador, a vista de nomes, a base de dados, a linguagem do Gerador de código, os formatos do nome, o tipo de delimitador e as linhas de `View Option` que o seu leitor altera ficam no seu ecrã, digam o que disserem os respetivos bloqueios; antes da `5.0.0`, os seus deslocamentos, zooms, mudanças de separador, base de dados e definições de código eram enviados como os de um editor editável.  
O seu armazenamento continua a enviar o que os seus rastreadores enviam do cursor, do foco, da seleção e da caixa de arrastamento do leitor, responde aos registos que um editor que se junta lhe pede e aplica todas as alterações que os outros enviam. Uma alteração da base de dados, de uma definição do Gerador de código ou de uma linha de `View Option` chega ao seu documento, e também ao seu ecrã, a menos que o seu leitor tenha alterado essa definição aí, e uma mudança partilhada da vista de nomes aparece no seu ecrã em qualquer caso.  
Quando o editor passa a só de leitura, envia primeiro o que o armazenamento ainda retém de um arrastamento ou de um deslocamento, tal como [flushStreamBuffers](#flushstreambuffers) o faz, para que os outros fiquem com o final.

Os [bloqueios](../../guide/guides/settings.md#lock) são partilhados: o último bloqueio ou desbloqueio de uma definição prevalece em todos os editores, e um bloqueio transporta os valores do editor que o ativou, pelo que todos os editores e réplicas guardam o mesmo valor.  
Assim, um bloqueio `Viewport` guarda a vista do editor que o ativou, e um bloqueio `Canvas Type` o último separador em que esse editor esteve antes do separador Definições, onde os bloqueios são ativados.  
Desativar o bloqueio `Language`, `Table Name Case`, `Column Name Case`, `Bracket Type` ou, a partir da `4.2.0`, `Name View` também muda essa definição, em todos os editores, para o valor mostrado no editor que o desativou, pelo que continuam a guardar um único valor. Desativar `Viewport` ou `Canvas Type` não altera a vista nem o separador de ninguém.

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
A partir da `4.0.0`, também descarta os registos de colaboração do editor, que resolvem as edições simultâneas. Se o armazenamento partilhado do editor já teve um subscritor, o armazenamento volta a pedir aos outros editores os registos deles, como no seu primeiro [subscribe](#subscribe), para que um editor carregado de novo a meio de uma sessão resolva as edições da mesma forma que os outros.  
Atribuir `value` mantém os registos, mas, ao contrário de `setInitialValue`, é retransmitido: assim que o editor tem um armazenamento partilhado, todos os editores da sessão carregam o documento atribuído, pelo que nunca inicialize desse modo um editor que se junta.

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

Um editor anterior à `4.0.0` ignora os novos tipos de ação: nunca vê um grupo de tabelas nem quais as tabelas que dele fazem parte, embora o arrasto de um grupo continue a mover aí as tabelas do grupo, já que também envia o respetivo `table.move`.  
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

```js
sharedStore.dispatch(actions); // async
sharedStore.dispatchSync(actions); // sync
```

### subscribe {#subscribe}

Subscreve as alterações do editor.  
Nada sai do editor enquanto não houver pelo menos um subscritor, e as alterações feitas antes disso são acumuladas.  
O primeiro subscribe também pede aos outros editores os respetivos registos de colaboração, que resolvem as edições simultâneas, para que um editor que se junta mais tarde as resolva da mesma forma.  
Não traz o documento, por isso [inicialize](#seeding-a-collaborator) primeiro um editor que se junta mais tarde.  
A partir da `4.0.0`, o armazenamento volta a pedi-los sempre que `setInitialValue` carrega um documento no seu editor depois desse primeiro subscribe.

```js
const unsubscribe = sharedStore.subscribe(actions => {
  // send...
});
```

### flushStreamBuffers {#flushstreambuffers}

Envia de imediato os lotes de fluxo que este armazenamento ainda retém, em vez de os enviar após o respetivo período de inatividade.  
A partir da `3.9.2`, funciona num armazenamento obtido com `getSharedStore`; na `3.9.1`, o método existe no tipo, mas não faz nada.  
Mover uma tabela, uma nota ou um grupo de tabelas, mudar a sua cor, redimensionar uma nota e deslocar ou aplicar zoom à vista chegam, cada um, como um fluxo de pequenas alterações. Redimensionar um grupo de tabelas não: é enviado uma vez, quando o arrasto termina.  
O armazenamento junta cada fluxo num único lote e retém-no até o fluxo estar inativo durante 200 ms. Fá-lo em duas fases, pelo que o lote sai cerca de 400 ms após a última alteração.  
Uma chamada termina essa espera nas duas fases. Enquanto o armazenamento está ligado, um subscritor recebe o lote antes de a chamada retornar. Uma chamada sem nada retido não envia nada.  
O método `destroy`, seja o do armazenamento ou o do editor, descarta um lote que ainda esteja retido, por isso chame primeiro `flushStreamBuffers` quando deixar de usar um armazenamento e os outros devam ficar com a última alteração, como quando se fecha um separador.

```js
sharedStore.flushStreamBuffers();
sharedStore.destroy();
```

### destroy {#destroy}

Destrói completamente a instância de sharedStore.  
O próprio editor não é afetado, pelo que sair de uma sessão mantém o documento editável.  
Os rastreadores do rato e do foco param assim que o último sharedStore que o editor forneceu é destruído.  
Um lote de fluxo que o armazenamento ainda retenha é descartado com ele; chame primeiro [flushStreamBuffers](#flushstreambuffers) para o enviar.

```js
sharedStore.destroy();
```
