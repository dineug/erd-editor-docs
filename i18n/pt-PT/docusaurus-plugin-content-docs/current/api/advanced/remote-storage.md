---
sidebar_position: 2
description: Replicar um editor em execução num armazenamento headless fora da thread principal e serializar o documento para o guardar.
---

# Armazenamento remoto

Enviar todo o estado do editor a cada alteração é ineficiente.  
Para esse caso, o editor disponibiliza uma API de replicação de dados em tempo real.

## Instalação {#installation}

```sh
npm install @dineug/erd-editor
```

O armazenamento de replicação está no subcaminho `@dineug/erd-editor/engine.js`, não na raiz do pacote.  
Esse ponto de entrada não toca no DOM, pelo que funciona num Web Worker ou em qualquer outro lugar fora da thread principal.  
Importar a raiz do pacote, em vez disso, precisa de um documento: a partir da `5.0.0` não define nenhum elemento, mas avaliá-la constrói as duas classes de elemento. Antes da `5.0.0` registava o elemento personalizado `<erd-editor>`.

## Utilização {#usage}

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

## Replicar um editor em execução {#replicating-a-live-editor}

As ações vêm do armazenamento partilhado de um editor em execução.  
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
A réplica aplica-a e serializa o resultado do seu próprio lado.  
O evento `change` entrega esse resultado como `value`, e `changed` indica quando vale a pena escrevê-lo.

A partir da `4.0.0`, inicialize a réplica com o `runtimeValue` do editor, como acima, e não com o ficheiro guardado nem com o `value` do editor.  
O ficheiro não tem as edições feitas desde que foi guardado, e o `value` não tem as entidades removidas na sessão.  
Uma réplica inicializada sem uma tabela removida repõe-na sem o nome nem as colunas quando um editor anula a remoção, e guarda-a assim.  
A partir da `4.2.0`, o mesmo acontece com uma palavra, um termo ou um domínio removido de uma folha do separador [Dicionário](../../guide/guides/dictionary.md).  
Quando um editor anula a remoção, uma réplica inicializada sem a linha volta a listá-la vazia e, como o `value` deixa de fora uma linha vazia, a réplica guarda o documento sem ela.  
No caso de um domínio, as colunas e os termos que lhe estavam vinculados também ficam desvinculados nessa réplica, uma vez que esta nunca teve os vínculos e a anulação não os envia.

## InjectEngineContext {#injectenginecontext}

### toWidth {#towidth}

Mede uma cadeia de caracteres em píxeis.  
O armazenamento não tem DOM, pelo que não consegue medir texto por si próprio, e recalcula as larguras das colunas com esta função sempre que muda um nome, um tipo de dados, um valor predefinido ou um comentário.  
A partir da `4.2.0`, isso inclui o [nome lógico](../../guide/guides/logical-names.md) de uma tabela ou de uma coluna.  
Mede a célula Domínio de uma coluna, que mostra o nome do domínio a que a coluna está vinculada, sempre que a coluna é vinculada a um domínio ou desvinculada dele e sempre que esse domínio é adicionado, muda de nome ou é removido.  
Também volta a medir todas as tabelas e colunas sempre que [setInitialValue](#setinitialvalue) carrega um documento.  
A partir da `4.0.0`, as larguras ficam apenas em [runtimeValue](#runtimevalue-getter), nunca em `value`.  
Assim, um documento que esta versão guardou, ao ser relido, dá o mesmo `value` byte a byte, onde quer que tenha sido guardado e seja qual for a forma como o texto aí foi medido.

Meça como o editor mede — `400 12px` na pilha de tipos de letra do editor, arredondado, mais 2 px de preenchimento.  
Caso contrário, as larguras em `runtimeValue` afastam-se das que aparecem no ecrã.

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

`text.length * 10` é a solução de recurso quando não há nenhum canvas disponível.  
Basta para um armazenamento cujo documento é apenas guardado, nunca renderizado.

## ReplicationStore {#replicationstore}

### value getter {#value-getter}

Serializa o estado atual do editor.  
Devolve uma cadeia JSON, pronta a guardar tal como está — não um objeto já analisado.

```js
const data = replicationStore.value;
```

A partir da `4.0.0`, o `value` é a forma de armazenamento: o documento tal como um ficheiro o contém, o mesmo texto que o [value](../erd-editor-element.md#value) do elemento devolve.  
Contém só as entidades ativas, numa ordem fixa, sem as removidas, a ordem de sobreposição ou qualquer coisa que um carregamento volte a calcular, como as larguras que [toWidth](#towidth) mede.  
A partir da `4.2.0`, contém também os nomes lógicos, a indicação de se cada nome foi derivado dos dicionários, os vínculos aos domínios e as palavras, os termos e os domínios do separador [Dicionário](../../guide/guides/dictionary.md).  
Também deixa de fora, a partir da `4.2.0`, cada campo de texto vazio de uma entidade, cada lista de `doc` e cada coleção que não contenha nada e o próprio `collections` quando todas as coleções estão vazias.  
Tem uma indentação de dois espaços, com cada linha de um dicionário numa linha de texto própria, e termina com uma quebra de linha, pelo que o mesmo documento dá sempre os mesmos bytes.  
Consulte [Forma de armazenamento e valor em tempo de execução](./schema.md#storage-form-and-runtime-value) para saber o que contém.

Cada definição com o [bloqueio](../../guide/guides/settings.md#lock) ativado é escrita com o valor em que foi bloqueada, e todas as outras definições tal como estão.  
O bloqueio `Viewport` abrange em conjunto a origem da vista e o nível de zoom, e o separador, a linguagem do Gerador de código, os dois formatos dos nomes e o tipo de delimitador têm cada um o seu próprio bloqueio.  
A partir da `4.2.0`, o mesmo acontece com a [vista de nomes](../../guide/guides/logical-names.md#name-view), cujo bloqueio `Name View` está ativado num documento novo.  
Os bloqueios substituem o `ignoreSaveSettings` do documento, que não é lido nem escrito a partir da `4.0.0`.  
Antes da `4.0.0`, o `value` era o documento inteiro tal como o armazenamento o tinha, com os bits de deslocamento e de zoom desse campo aplicados.

### runtimeValue getter {#runtimevalue-getter}

A partir da `4.0.0`, serializa o documento tal como a réplica o tem, incluindo as entidades removidas e tudo o que um carregamento calcula.  
Também aqui, cada definição bloqueada é escrita com o seu valor bloqueado.

```js
const snapshot = replicationStore.runtimeValue;
```

Use-o para inicializar um editor ou outro armazenamento que se junte mais tarde, através do respetivo `setInitialValue`; consulte [Edição colaborativa](./collaborative-editing.md).  
Nunca o guarde como o ficheiro: contém as entidades removidas, e o [JSON Schema](./schema.md#json-schema) publicado recusa-o.  
São essas entidades removidas que permitem que uma anulação de uma remoção, enviada mais tarde, reponha a entidade inteira no armazenamento inicializado a partir dele.  
Permanecem até o documento voltar a ser aberto a partir do respetivo ficheiro, cuja forma as deixa de fora.

### setInitialValue {#setinitialvalue}

Carrega o estado do editor guardado anteriormente.

```js
replicationStore.setInitialValue('json...');
```

Aceita a forma de armazenamento, um valor em tempo de execução ou um documento guardado por uma versão anterior, incluindo um documento v2.  
Uma cadeia em branco, ou qualquer coisa que não seja uma cadeia, carrega um documento novo e vazio em vez de gerar um erro.  
Um armazenamento que nunca recebeu um valor começa como esse mesmo documento novo.  
A partir da `4.0.0`, esse documento tem todos os [bloqueios](../../guide/guides/settings.md#lock) ativados, pelo que o seu `value` mantém a vista, o separador, a linguagem do Gerador de código, os formatos dos nomes e o tipo de delimitador com que começou enquanto os editores que replica se deslocam, fazem zoom, mudam de separador ou alteram essas definições. Na `3.10.0`, não guardava nem o deslocamento nem o zoom, e antes disso guardava ambos.  
A partir da `4.2.0`, mantém também a sua vista de nomes, `Physical Names`, enquanto os editores mudam a deles.  
Um documento guardado mantém os bloqueios que indica.  
Um documento que não indique nenhum, o que é o caso de qualquer documento guardado antes da `4.0.0`, incluindo um documento v2, é carregado com todos os bloqueios ativados: a origem da vista em `0, 0`, o nível de zoom em `1` e o separador em ERD, independentemente do que tenha guardado, e a linguagem do Gerador de código, os formatos dos nomes e o tipo de delimitador tal como os guardou.  
Um documento guardado antes da `4.2.0` não indica nenhum bloqueio `Name View`, pelo que é carregado com esse bloqueio ativado e na vista `Physical Names`, mesmo que tenha sido guardado com todos os outros bloqueios desativados.  
A partir da `4.0.0`, o `setInitialValue` também descarta os registos de colaboração mantidos para o documento anterior, tal como faz o [setInitialValue](../erd-editor-element.md#setinitialvalue) do elemento.  
Um texto que não seja JSON, como um ficheiro que ficou com marcadores de conflito de fusão, também não gera um erro: o erro de análise é apenas registado na consola, o documento é esvaziado e as definições ficam como estavam.

A partir da `4.0.0`, o carregamento não executa recolha de lixo, pelo que as entidades removidas permanecem em [runtimeValue](#runtimevalue-getter).  
Antes, descartava as entidades que já não apareciam em `doc` e que não tinham sido modificadas havia quatro dias ou mais.

As reescritas do carregamento terminam antes de o `setInitialValue` retornar: as marcas de chave nas colunas, lidas das opções de cada coluna e das relações; todas as larguras de tabelas e colunas, medidas de novo com `toWidth`; os pontos onde cada conector encontra as suas tabelas; e o sinalizador de relação identificadora e o símbolo na extremidade pai de cada relação.  
Nenhuma delas faz parte do `value`, mas o `replicationStore.runtimeValue` lido logo após a chamada já as contém todas.  
Uma ação que chegue logo a seguir ao carregamento, como um deslocamento reproduzido, é avaliada em relação ao documento carregado, pelo que o próprio carregamento nunca é indicado como [`changed`](#onchange).

Nem o carregamento nem nenhuma destas reescritas emite `change`.  
Leia o `replicationStore.value` por sua conta assim que o `setInitialValue` retornar, se quiser voltar a escrever o documento carregado na forma de armazenamento.

### on@change {#onchange}

Subscreve as alterações do estado do editor.

```js
const unsubscribe = replicationStore.on({
  change: ({ value, changed }) => {
    if (changed) {
      // save value...
    }
  },
});
```

O `change` tem um debounce de 200 ms, pelo que uma rajada de ações chega como uma única notificação.  
Só dispara para ações de um tipo que pode alterar o documento, além do `settings.changeIgnoreSaveSettings` que um editor mais antigo ainda pode enviar (consulte [dispatch, dispatchSync](#dispatch-dispatchsync)).  
Uma ação de presença retransmitida ou um `editor.mergeLWW` nunca o desperta.  
Chame a função devolvida para cancelar a subscrição.

A partir da `3.10.0`, o listener recebe um `ReplicationChange`, um tipo que `@dineug/erd-editor/engine.js` exporta juntamente com `ReplicationStore`.  
Antes da `3.10.0`, não recebia nada, e um listener que ignore o argumento continua a funcionar.  
O `value` é o documento serializado na forma de armazenamento, a mesma cadeia que o `replicationStore.value` devolve nesse momento, pelo que não é preciso voltar a serializá-lo.  
O `changed` é `false` quando as ações desde o `change` anterior, ou desde o carregamento, deixaram o `value` byte a byte como estava.

Uma alteração que um [bloqueio](../../guide/guides/settings.md#lock) deixa fora do `value` continua a disparar `change`, com `changed` definido como `false`, por isso escreva apenas quando `changed` for `true`.  
É o caso de um deslocamento ou de um zoom enquanto a definição `Viewport` está bloqueada, de uma mudança de separador enquanto a definição `Canvas Type` está bloqueada e de uma alteração da linguagem do Gerador de código, de um formato do nome ou do tipo de delimitador enquanto o respetivo bloqueio está ativado.  
A partir da `4.2.0`, o mesmo acontece com uma mudança da vista de nomes enquanto a definição `Name View` está bloqueada: o editor continua a enviá-la, mas a réplica descarta-a, tal como fazem os outros editores.  
Uma mudança da vista de nomes feita num editor só de leitura é descartada da mesma forma, seja qual for o seu bloqueio.  
O evento [change](../erd-editor-element.md#change) do elemento omite uma alteração deste tipo, mas a réplica continua a comunicá-la.  
Todos os bloqueios estão ativados num documento novo e num documento guardado antes da `4.0.0`, e a definição `Name View` está bloqueada em qualquer documento guardado antes da `4.2.0`.  
Com a definição `Viewport` desbloqueada, um deslocamento ou um zoom altera o `value`, com a definição `Canvas Type` desbloqueada o mesmo acontece ao abrir outro dos separadores do editor e com a definição `Name View` desbloqueada o mesmo acontece com uma mudança da vista de nomes feita num editor que não seja só de leitura.  
Ativar ou desativar um bloqueio também altera o `value`.

A partir da `4.0.0`, o `changed` compara a forma de armazenamento, que não contém nem as entidades removidas nem a ordem de sobreposição.  
Assim, uma tabela adicionada e de novo removida dentro de um mesmo `change`, uma edição que incide numa entidade que outro colaborador removeu e um carregamento retransmitido que só altera a ordem de sobreposição também resultam todos em `changed` definido como `false`.  
A partir da `4.2.0`, o mesmo acontece com uma linha adicionada a uma folha do separador Dicionário e deixada vazia, porque a forma de armazenamento deixa de fora uma linha que não contenha nada.

O `changed` nunca compara com o seu ficheiro guardado, que pode já diferir do `value` depois de carregado: é o caso de um ficheiro guardado por uma versão anterior, incluindo um ficheiro v2, e também de um ficheiro que começa com uma marca de ordem de bytes e de um ficheiro editado à mão.  
A partir da `4.2.0`, isso inclui um ficheiro guardado pela `4.0.0` ou pela `4.1.0`, porque o `value` deixa de fora os campos de texto vazios das suas entidades e as listas de `doc` e as coleções vazias que um ficheiro destes contém.  
Comparar bytes com um ficheiro destes contaria como edição até um deslocamento que um bloqueio deixa de fora.  
O primeiro `change` com `changed` definido como `true` devolve um ficheiro destes na forma de armazenamento, pelo que escrevê-lo reescreve o ficheiro uma vez.  
Um ficheiro guardado por esta versão não difere, onde quer que tenha sido guardado, como explica [toWidth](#towidth).  
Se o `setInitialValue` chegar enquanto um `change` ainda está pendente, e nada for despachado antes da hora prevista, esse `change` chega na mesma, com o `value` carregado e `changed` definido como `false`.

### dispatch, dispatchSync {#dispatch-dispatchsync}

Aplica as alterações de editores remotos ao replicationStore.

```js
replicationStore.dispatch(actions); // async
replicationStore.dispatchSync(actions); // sync
```

O `dispatch` adia a aplicação para uma microtarefa e o `dispatchSync` aplica o lote de imediato.

Pode entregar o fluxo de um armazenamento partilhado sem filtrar.  
Ambos os métodos mantêm apenas as ações de um tipo que pode alterar o documento, além das duas descritas no fim desta secção, e descartam as restantes, pelo que a presença que uma sessão colaborativa transporta — o cursor do rato, o foco, a seleção e o retângulo de arrasto de cada utilizador — passa sem qualquer efeito.

A partir da `3.10.0`, as ações mantidas incluem `relationship.changeOnDelete` e `relationship.changeOnUpdate`, e `relationship.add` transporta `onDelete` e `onUpdate`.  
Um armazenamento de uma versão anterior descarta essas ações e ignora esses campos, pelo que perde as ações [ON DELETE e ON UPDATE](../../guide/guides/relationship-editing.md#on-delete-and-on-update) de uma relação.

A partir da `4.0.0`, as ações mantidas incluem também `table.changeGroup`, sete das oito ações `tableGroup` (`tableGroup.add`, `tableGroup.move`, `tableGroup.moveTo`, `tableGroup.remove`, `tableGroup.resize`, `tableGroup.changeName` e `tableGroup.changeColor`, todas exceto a alteração da ordem de sobreposição `tableGroup.changeZIndex`), `relationship.changeColumns`, `settings.changeLockSettings` e `settings.changeDDLScript`.  
O `settings.changeRelationshipOptimization` já não existe, pelo que ambos os métodos o descartam.  
Um armazenamento de uma versão anterior descarta as novas ações, pelo que perde os [grupos de tabelas](../../guide/guides/table-groups.md), os [bloqueios](../../guide/guides/settings.md#lock), os scripts do [Esquema SQL](../../guide/guides/schema-sql.md) e as colunas que [Mapear colunas](../../guide/guides/relationship-editing.md#map-columns) atribui a uma relação existente.  
Execute a réplica na mesma versão dos editores ou numa mais recente.

A `4.1.0` não acrescenta nenhum tipo de ação e deixa `@dineug/erd-editor/engine.js` como estava, pelo que uma réplica `4.0.0` mantém todas as alterações que um editor `4.1.0` envia, tal como uma réplica `4.1.0`.  
A partir da `4.1.0`, os botões `Replace` e `Replace All` de [Localizar e substituir](../../guide/guides/find-and-replace.md#replacing) também mudam o nome de índices e grupos de tabelas, através das ações `index.changeName` e `tableGroup.changeName` que uma réplica `4.0.0` já mantém.  
O estado próprio do [explorador](../../guide/guides/explorer.md) nunca é enviado, e uma mudança de separador ou um deslocamento que ele faça chega como qualquer outra mudança de separador ou deslocamento; consulte [Edição colaborativa](./collaborative-editing.md).

A partir da `4.2.0`, as ações mantidas incluem também `table.changeLogicalName`, `table.changeNameDerived`, `column.changeLogicalName`, `column.changeDomain`, `column.changeNameDerived`, `settings.changeNameViewMode` e `dictionary.add`, `dictionary.update` e `dictionary.remove`, que transportam todas as edições, ordenações e importações de CSV nas folhas do separador [Dicionário](../../guide/guides/dictionary.md).  
Das mudanças da vista de nomes, uma réplica só aplica as que um editor que não seja só de leitura faz enquanto a definição `Name View` está desbloqueada, e descarta as restantes (consulte [on@change](#onchange)).  
Um armazenamento de uma versão anterior descarta todas estas ações, pelo que perde os [nomes lógicos](../../guide/guides/logical-names.md), os vínculos aos domínios, a indicação de se cada nome veio dos dicionários, as palavras, os termos e os domínios, bem como a vista de nomes.  
Um editor anterior à `4.2.0` na sessão pode ainda retirar parte disto a uma réplica `4.2.0`.  
Uma importação de Esquema SQL, GraphQL, DBML ou AML com `Import` nesse editor, mas não com `Import and Add`, esvazia as palavras, os termos e os domínios da réplica.  
A sua anulação de um carregamento, de um `Import` ou de `clear()` carrega na réplica a sua própria cópia do documento, sem nomes lógicos, vínculos aos domínios nem dicionários; consulte [Misturar versões](./collaborative-editing.md#mixing-releases).  
`@dineug/erd-editor/engine.js` exporta os mesmos `createReplicationStore`, `ReplicationStore` e `ReplicationChange` que antes, e `createReplicationStore` recebe o mesmo contexto.

A partir da `4.0.0`, ambos os métodos aplicam também o `editor.mergeLWW`, que transporta os registos de colaboração com que um editor responde quando outro se junta à sessão, pelo que a réplica resolve as edições simultâneas da mesma forma que os editores.  
Não altera nenhum byte do `value` nem dispara nenhum `change`.  
O `settings.changeIgnoreSaveSettings`, que um editor lançado antes da `4.0.0` ainda pode enviar, é mantido mas não altera nada: dispara `change` com `changed` definido como `false`.

### destroy {#destroy}

Destrói por completo a instância de replicationStore.

```js
replicationStore.destroy();
```

Depois disso, o armazenamento deixa de emitir `change` e ignora quaisquer despachos posteriores.  
O documento fica congelado no seu último valor em vez de gerar um erro.  
Crie um novo armazenamento para recomeçar.
