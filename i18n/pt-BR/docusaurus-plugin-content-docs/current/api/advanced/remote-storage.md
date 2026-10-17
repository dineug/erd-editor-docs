---
sidebar_position: 2
description: Replicar um editor ao vivo em um armazenamento headless fora da thread principal e serializar o documento para armazená-lo.
---

# Armazenamento remoto

Enviar todo o estado do editor a cada alteração é ineficiente.  
Para esse caso, o editor oferece uma API de replicação de dados em tempo real.

## Instalação {#installation}

```sh
npm install @dineug/erd-editor
```

O armazenamento de replicação fica no subcaminho `@dineug/erd-editor/engine.js`, não na raiz do pacote.  
Esse ponto de entrada não toca no DOM, então é executado em um Web Worker ou em qualquer outro lugar fora da thread principal.  
Importar a raiz do pacote, em vez disso, registra o elemento personalizado `<erd-editor>`, que precisa de um documento.

## Uso {#usage}

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

## Replicar um editor ao vivo {#replicating-a-live-editor}

As ações vêm do armazenamento compartilhado de um editor ao vivo.  
Consulte [Edição colaborativa](./collaborative-editing.md).

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

Só a alteração atravessa a fronteira, nunca o documento inteiro.  
A réplica a aplica e serializa o resultado do seu próprio lado.  
O evento `change` entrega esse resultado como `value`, e `changed` indica quando vale a pena gravá-lo.

A partir da `4.0.0`, inicialize a réplica com o `runtimeValue` do editor, como acima, e não com o arquivo armazenado nem com o `value` do editor.  
O arquivo não tem as edições feitas desde que foi salvo, e o `value` não tem as entidades removidas na sessão.  
Uma réplica inicializada sem uma tabela removida a traz de volta sem o nome nem as colunas quando um editor desfaz a remoção, e a salva assim.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mede uma string em pixels.  
O armazenamento não tem DOM, então não consegue medir texto por conta própria, e recalcula as larguras das colunas com esta função sempre que um nome, tipo de dados, valor padrão ou comentário muda.  
Ele também mede de novo todas as tabelas e colunas sempre que [setInitialValue](#setinitialvalue) carrega um documento.  
A partir da `4.0.0`, as larguras ficam apenas no [runtimeValue](#runtimevalue-getter), nunca no `value`.  
Assim, um documento salvo por esta versão é lido de volta com o mesmo `value`, byte a byte, onde quer que tenha sido salvo e independentemente de como o texto era medido ali.

Meça como o editor mede — `400 12px` na pilha de fontes do editor, arredondado, mais 2 px de espaçamento interno.  
Caso contrário, as larguras no `runtimeValue` se afastam das que aparecem na tela.

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

`text.length * 10` é a alternativa usada quando nenhum canvas está disponível.  
Ela basta para um armazenamento cujo documento é apenas salvo, nunca renderizado.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializa o estado atual do editor.  
Retorna uma string JSON, pronta para ser armazenada como está — não um objeto analisado.

```js
const data = replicationStore.value;
```

A partir da `4.0.0`, `value` é a forma de armazenamento: o documento tal como um arquivo o contém, o mesmo texto que o [value](../erd-editor-element.md#value) do elemento retorna.  
Ele contém apenas as entidades ativas, em uma ordem fixa, sem as removidas, a ordem de empilhamento ou qualquer coisa que um carregamento calcule de novo, como as larguras que [toWidth](#towidth) mede.  
Ele é indentado com dois espaços e termina com uma quebra de linha, então o mesmo documento sempre gera os mesmos bytes.  
Consulte [Forma de armazenamento e valor em tempo de execução](./schema.md#storage-form-and-runtime-value) para saber o que ele contém.

Cada configuração cujo [bloqueio](../../guide/guides/settings.md#lock) está ativado é gravada com o valor em que foi bloqueada, e todas as outras, como estão.  
O bloqueio `Viewport` abrange a origem da área visível e o nível de zoom juntos, e a aba, a linguagem do Gerador de código, os dois estilos de nome e o tipo de delimitador têm, cada um, seu próprio bloqueio.  
Os bloqueios substituem o campo `ignoreSaveSettings` do documento, que não é lido nem gravado a partir da `4.0.0`.  
Antes da `4.0.0`, `value` era o documento inteiro tal como o armazenamento o mantinha, com os bits de rolagem e de zoom desse campo aplicados.

### runtimeValue getter {#runtimevalue-getter}

A partir da `4.0.0`, serializa o documento tal como a réplica o mantém, incluindo as entidades removidas e tudo o que um carregamento calcula de novo.  
Aqui também, cada configuração bloqueada é gravada com seu valor bloqueado.

```js
const snapshot = replicationStore.runtimeValue;
```

Use-o para inicializar um editor ou outro armazenamento que entre depois, por meio do `setInitialValue` dele; consulte [Edição colaborativa](./collaborative-editing.md).  
Nunca o armazene como o arquivo: ele traz as entidades removidas, e o [JSON Schema](./schema.md#json-schema) publicado o recusa.  
São essas entidades removidas que permitem que o desfazer de uma remoção, enviado depois, traga a entidade de volta inteira no armazenamento inicializado a partir dele.  
Elas permanecem até a próxima vez que o documento for aberto a partir do seu arquivo, cuja forma as deixa de fora.

### setInitialValue {#setinitialvalue}

Carrega o estado do editor armazenado anteriormente.

```js
replicationStore.setInitialValue('json...');
```

Aceita a forma de armazenamento, um valor em tempo de execução ou um documento salvo por uma versão anterior, incluindo um documento v2.  
Uma string em branco, ou qualquer coisa que não seja uma string, carrega um documento novo e vazio em vez de gerar um erro.  
Um armazenamento que nunca recebeu um valor começa como esse mesmo documento novo.  
A partir da `4.0.0`, esse documento tem todos os [bloqueios](../../guide/guides/settings.md#lock) ativados, então seu `value` mantém a área visível, a aba, a linguagem do Gerador de código, os estilos de nome e o tipo de delimitador com que começou enquanto os editores que ele replica rolam, aplicam zoom, trocam de aba ou alteram essas configurações. Na `3.10.0`, ele não salvava nem a rolagem nem o zoom, e antes disso salvava os dois.  
Um documento armazenado mantém os bloqueios que indica.  
Um que não indica nenhum, o que vale para todo documento salvo antes da `4.0.0`, incluindo um documento v2, é carregado com todos os bloqueios ativados: a origem da área visível em `0, 0`, o nível de zoom em `1` e a aba em ERD, independentemente do que tenha salvo, e a linguagem do Gerador de código, os estilos de nome e o tipo de delimitador como os salvou.  
A partir da `4.0.0`, `setInitialValue` também descarta os registros de colaboração mantidos para o documento anterior, como faz o [setInitialValue](../erd-editor-element.md#setinitialvalue) do elemento.  
Um texto que não é JSON, como um arquivo que ficou com marcadores de conflito de merge, também não gera erro: o erro de análise é apenas registrado no console, o documento é esvaziado e as configurações ficam como estavam.

A partir da `4.0.0`, o carregamento não executa coleta de lixo, então as entidades removidas permanecem no [runtimeValue](#runtimevalue-getter).  
Antes, ele descartava as entidades que já não apareciam em `doc` e não tinham sido alteradas havia quatro dias ou mais.

As reescritas do carregamento terminam antes que `setInitialValue` retorne: as marcas de chave nas colunas, lidas das opções de cada coluna e dos relacionamentos; a largura de cada tabela e coluna, medida de novo com `toWidth`; os pontos em que cada conector encontra suas tabelas; e o sinalizador identificador de cada relacionamento e o símbolo na sua extremidade do lado pai.  
Nenhuma delas faz parte do `value`, mas `replicationStore.runtimeValue`, lido logo após a chamada, já contém todas elas.  
Uma ação que chega logo depois do carregamento, como uma rolagem reproduzida, é comparada com o documento carregado, então o próprio carregamento nunca é informado como [`changed`](#onchange).

Nem o carregamento nem qualquer dessas reescritas emite `change`.  
Leia você mesmo `replicationStore.value` assim que `setInitialValue` retornar se quiser que o documento carregado seja gravado de volta na forma de armazenamento.

### on@change {#onchange}

Assina as alterações no estado do editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

O `change` tem debounce de 200 ms, então uma rajada de ações chega como uma única notificação.  
Ele dispara apenas para ações de um tipo que pode alterar o documento, além da ação `settings.changeIgnoreSaveSettings` que um editor mais antigo ainda pode enviar (consulte [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Uma ação de presença retransmitida ou `editor.mergeLWW` nunca o aciona.  
Chame a função retornada para cancelar a assinatura.

A partir da `3.10.0`, o listener recebe um `ReplicationChange`, um tipo que `@dineug/erd-editor/engine.js` exporta ao lado de `ReplicationStore`.  
Antes da `3.10.0`, ele não recebia nada, e um listener que ignora o argumento continua funcionando.  
`value` é o documento serializado na forma de armazenamento, a mesma string que `replicationStore.value` retorna naquele momento, então não é preciso serializá-lo de novo.  
`changed` é `false` quando as ações desde o `change` anterior, ou desde o carregamento, deixaram `value` byte a byte como estava.

Uma alteração que um [bloqueio](../../guide/guides/settings.md#lock) deixa fora do `value` ainda dispara `change`, com `changed` definido como `false`, então grave apenas quando `changed` for `true`.  
É o caso de uma rolagem ou um zoom enquanto `Viewport` está bloqueado, de uma troca de aba enquanto `Canvas Type` está bloqueado e de uma alteração da linguagem do Gerador de código, de um estilo de nome ou do tipo de delimitador enquanto seu próprio bloqueio está ativado.  
O evento [change](../erd-editor-element.md#change) do elemento deixa essa alteração de fora, mas a réplica ainda a informa.  
Todos os bloqueios estão ativados em um documento novo e em um salvo antes da `4.0.0`.  
Com `Viewport` desbloqueado, uma rolagem ou um zoom altera `value`, e, com `Canvas Type` desbloqueado, abrir outra das abas do editor também o altera.  
Ativar ou desativar um bloqueio também altera `value`.

A partir da `4.0.0`, `changed` compara a forma de armazenamento, que não contém nem as entidades removidas nem a ordem de empilhamento.  
Assim, uma tabela adicionada e removida de novo dentro de um mesmo `change`, uma edição que recai sobre uma entidade que outro colaborador removeu e um carregamento retransmitido que só altera a ordem de empilhamento também resultam, todos, em `changed` definido como `false`.

`changed` nunca compara com o seu arquivo armazenado, que já pode diferir de `value` assim que é carregado: é o caso de um arquivo salvo por uma versão anterior, incluindo um arquivo v2, e também de um arquivo que começa com uma marca de ordem de bytes e de um editado à mão.  
Comparar bytes com um arquivo assim contaria como edição até mesmo uma rolagem que um bloqueio deixa de fora.  
O primeiro `change` com `changed` definido como `true` devolve esse arquivo na forma de armazenamento, então gravá-lo reescreve o arquivo uma única vez.  
Um arquivo salvo por esta versão não difere, onde quer que tenha sido salvo, como [toWidth](#towidth) explica.  
Se `setInitialValue` chegar enquanto um `change` ainda estiver pendente, e nada for despachado antes do momento previsto para ele, esse `change` ainda chega, com o `value` carregado e `changed` definido como `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica ao replicationStore as alterações de um editor remoto.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

`dispatch` adia a aplicação para uma microtarefa, e `dispatchSync` aplica o lote imediatamente.

É possível repassar o fluxo de um armazenamento compartilhado sem filtrá-lo.  
Os dois métodos mantêm apenas as ações de um tipo que pode alterar o documento, além das duas descritas no fim desta seção, e descartam o resto, então a presença que uma sessão colaborativa transporta — o cursor do mouse, o foco, a seleção e o retângulo de arrasto de cada usuário — passa sem efeito algum.

A partir da `3.10.0`, as ações mantidas incluem `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` traz `onDelete` e `onUpdate`.  
Um armazenamento de uma versão anterior descarta essas ações e ignora esses campos, então perde as ações [ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de um relacionamento.

A partir da `4.0.0`, as ações mantidas também incluem `table.changeGroup`, sete das oito ações `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` e `tableGroup.changeColor`, todas exceto a alteração de empilhamento `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` e `settings.changeDDLScript`.  
A ação `settings.changeRelationshipOptimization` não existe mais, então os dois métodos a descartam.  
Um armazenamento de uma versão anterior descarta as novas ações, então perde os [grupos de tabelas](../../guide/guides/table-groups.md), os [bloqueios](../../guide/guides/settings.md#lock), os scripts do [Esquema SQL](../../guide/guides/schema-sql.md) e as colunas que [Mapear colunas](../../guide/guides/relationship-editing.md#map-columns) atribui a um relacionamento existente.  
Execute a réplica na mesma versão dos editores ou em uma mais recente.

A `4.1.0` não adiciona nenhum tipo de ação e deixa `@dineug/erd-editor/engine.js` como estava, então uma réplica `4.0.0` mantém todas as alterações que um editor `4.1.0` envia, assim como uma réplica `4.1.0`.  
A partir da `4.1.0`, `Replace` e `Replace All` em [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) também renomeiam índices e grupos de tabelas, por meio das ações `index.changeName` e `tableGroup.changeName` que uma réplica `4.0.0` já mantém.  
O estado próprio do [explorador](../../guide/guides/explorer.md) nunca é enviado, e uma troca de aba ou uma rolagem que ele faz chega como qualquer outra troca de aba ou rolagem; consulte [Edição colaborativa](./collaborative-editing.md).

A partir da `4.0.0`, os dois métodos também aplicam a ação `editor.mergeLWW`, que traz os registros de colaboração com que um editor responde quando outro entra na sessão, então a réplica resolve as edições simultâneas como os editores fazem.  
Ela não altera nenhum byte de `value` e não dispara nenhum `change`.  
A ação `settings.changeIgnoreSaveSettings`, que um editor lançado antes da `4.0.0` ainda pode enviar, é mantida, mas não altera nada: ela dispara `change` com `changed` definido como `false`.

### destroy {#destroy}

Destrói completamente a instância do replicationStore.

```js
replicationStore.destroy();
```

Depois disso, o armazenamento deixa de emitir `change` e ignora os despachos seguintes.  
O documento fica congelado no seu último valor em vez de gerar um erro.  
Crie um novo armazenamento para recomeçar.
