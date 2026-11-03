---
sidebar_position: 2
description: "Manter um elemento <erd-editor> ou um armazenamento de pares headless sincronizado por meio de um documento Yjs com @dineug/erd-editor-yjs, inicializar uma sala, mostrar a presença pelo Awareness, continuar editando offline e condensar o histórico da sala com um sidecar de compactação."
---

# Yjs

O `@dineug/erd-editor-yjs` mantém diagramas sincronizados por meio de um documento [Yjs](https://github.com/yjs/yjs). É um pacote à parte, lançado pela primeira vez como `0.1.0` junto com o `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` vincula um elemento `<erd-editor>`, e `bindPeerStore` um armazenamento de pares headless de `@dineug/erd-editor/peer.js`, a um `Y.Doc`.  
O provider que transporta o `Y.Doc` transporta o diagrama: um servidor websocket, WebRTC, IndexedDB ou o seu próprio. O provider e o `Y.Doc` continuam sendo seus: o vínculo nunca os conecta, desconecta nem destrói.

As edições trafegam como os próprios lotes de ações do editor, que o vínculo mantém como o armazenamento as enviou.  
Assim, os registros de colaboração do editor resolvem as edições feitas no mesmo instante como numa sessão ligada por `getSharedStore`, com as mesmas exceções, como uma mudança de cor — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).  
Cursores, foco, seleções e retângulos de arrasto trafegam pelo Awareness do provider — consulte [Presença](#presence).  
Em comparação com ligar um armazenamento compartilhado a um transporte por conta própria, o vínculo acrescenta:

- Um cliente que entra abre o diagrama que a sala contém, sem receber o [runtimeValue](../erd-editor-element.md#runtimevalue) de um editor em execução.
- Um cliente desconectado continua editando, e suas edições chegam quando ele se reconecta — consulte [Edições offline e reentradas](#offline-edits-and-rejoins).
- Um `Y.Doc` devolvido por um provider de persistência abre o diagrama que contém — consulte [O que a sala contém](#what-the-room-holds).
- Um sidecar Node opcional condensa o histórico da sala em um único instantâneo — consulte [Compactar uma sala](#compacting-a-room).

O vínculo precisa dos cinco métodos que a `5.1.0` acrescentou ao armazenamento compartilhado e ao armazenamento de pares — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) e [reseed](./collaborative-editing.md#reseed) — e faz sozinho todas as chamadas necessárias a eles.

## Instalação {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` e `y-protocols` são dependências peer, de modo que uma página contém uma cópia de cada: `@dineug/erd-editor` `5.1.0` ou posterior dentro da `5.x`, `yjs` `13.6` ou posterior dentro da `13.x` e `y-protocols` `1.0` ou posterior dentro da `1.x`.  
O pacote usa apenas os tipos deles e trabalha sobre o `Y.Doc` e o `Awareness` que você passa, de modo que não carrega nenhum código próprio de Yjs, y-protocols ou do editor.  
Duas cópias do Yjs em uma página quebram as verificações de construtor uma da outra, e a segunda registra `Yjs was already imported`. Quando seu código e um provider resolvem `yjs` de dois lugares, deduplique-o no bundler (Vite: `resolve.dedupe: ['yjs']`).

O pacote é somente ESM (`"type": "module"`), com uma única entrada, a raiz do pacote, e é marcado como livre de efeitos colaterais, de modo que um bundle que importa apenas `bindErdEditor` deixa o compactador de fora.  
`bindErdEditor` precisa de um DOM, pois vincula um elemento `<erd-editor>` definido. `bindPeerStore` também roda em Node puro, no Node.js 22.12 ou posterior, como faz o [sidecar de compactação](#compacting-a-room).

## Uso {#usage}

```ts
function bindErdEditor(
  editor: ErdEditorElement,
  doc: Y.Doc,
  options?: BindOptions
): ErdYjsBinding;
```

```js
import '@dineug/erd-editor/erd-editor.js';

import { bindErdEditor } from '@dineug/erd-editor-yjs';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc);
const editor = document.createElement('erd-editor');
document.body.appendChild(editor);

provider.on('sync', function onSync(synced) {
  if (!synced) return;
  provider.off('sync', onSync);

  const binding = bindErdEditor(editor, doc, {
    awareness: provider.awareness,
    getNickname: () => 'Ada',
  });
  binding.on('error', error => console.error(error));
  binding.on('rejoin', reason => console.info('reopened on the room', reason));
  binding.seed(); // false, and nothing written, once the room holds a diagram
});
```

`wss://yjs.example.com` e `my-diagram` representam seu próprio servidor e sua própria sala.  
Vincule e inicialize somente depois que o provider sincronizar, como o evento `sync` do y-websocket com `true` informa. Uma inicialização feita antes pode substituir o diagrama da sala — consulte [Inicializar uma sala](#seeding-a-room).

Quando o `Y.Doc` contém o instantâneo de uma sala no momento do vínculo, o vínculo o abre no elemento de imediato: carrega o instantâneo com seus registros e sua versão, como o [reseed](./collaborative-editing.md#reseed) faz, e aplica todas as edições registradas desde então.  
Essa abertura limpa e fecha o que uma reentrada limpa e fecha — consulte [Edições offline e reentradas](#offline-edits-and-rejoins) — e o elemento abre onde o instantâneo o coloca. Nenhum `rejoin` é disparado nessa primeira abertura.  
Quando o `Y.Doc` não contém nenhum instantâneo, como numa sala vazia ou antes de o provider sincronizar, o elemento mantém seu documento, e o vínculo não escreve nada na sala até que um instantâneo apareça, seja o seu próprio [seed](#seed) ou o de outro cliente.

`bindErdEditor` obtém um armazenamento compartilhado do elemento com [getSharedStore](../erd-editor-element.md#getsharedstore), e [destroy](#destroy) o libera.  
O elemento já precisa ser um `<erd-editor>`, com sua entrada importada ou `defineErdEditor()` chamado — consulte [Registrar os elementos](../installation.md#registering-the-elements). Até que a tag seja definida, um `<erd-editor>` é um `HTMLElement` comum, que o navegador atualiza quando a tag é definida e o elemento está no documento. Para um elemento ainda não atualizado, `bindErdEditor` lança um `TypeError` em vez de disparar `error`.

As edições da sala são aplicadas ao elemento, e emitem [change](../erd-editor-element.md#change), como as de um colaborador, inclusive as edições reproduzidas depois que um instantâneo é aberto.  
Abrir um instantâneo, no momento do vínculo ou em uma reentrada, não cria entrada de desfazer, não emite `change` e não escreve nada na sala, exceto a derivação do nome lógico que [Edições offline e reentradas](#offline-edits-and-rejoins) descreve.  
Para carregar outro documento em uma sala já inicializada, faça uma alteração que todos os clientes aplicam: atribua [value](../erd-editor-element.md#value), chame [clear](../erd-editor-element.md#clear) ou importe um.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) nunca é escrito na sala, pois um armazenamento compartilhado não o envia, de modo que altera somente aquele elemento enquanto os demais clientes continuam com o diagrama da sala. Em vez disso, inicialize uma sala vazia com [seed](#seed).

Um `Y.Doc` contém um único diagrama. O vínculo o mantém sob os nomes `erd:` do `Y.Doc` e define o campo `erd` do estado local do Awareness, e deixa intactos todos os outros nomes e campos.  
Dê a cada elemento vinculado um `Y.Doc` e um Awareness próprios, como cada cliente de uma sala tem: dois vínculos que compartilham um Awareness sobrescrevem o campo `erd` um do outro.

## Inicializar uma sala {#seeding-a-room}

Uma sala não contém nenhum diagrama até que um cliente a [inicialize](#seed).  
O que um editor contém nesse meio-tempo vai para a sua própria inicialização, e cede lugar à de outro cliente quando essa chega primeiro: o vínculo reabre nela com `rejoin('snapshot')`, e o documento que o elemento continha, com o que foi editado nele desde o vínculo, se perde.

Quando dois clientes inicializam ao mesmo tempo, uma inicialização vence em todos os clientes.  
Quem inicializou a outra reabre na vencedora com `rejoin('seedLost')` e perde o que editou desde a sua inicialização, e o mesmo acontece, com `rejoin('snapshot')`, com um cliente que havia entrado na inicialização perdedora. As edições deles na inicialização perdedora não chegam a ninguém.  
Uma inicialização feita antes de o provider sincronizar conta como feita no mesmo instante que a inicialização de onde veio o diagrama da sala, de modo que pode vencê-la e substituir o diagrama da sala.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

O `Awareness` que transporta cursores, foco, seleções e retângulos de arrasto, como o do provider.  
Com ele, o vínculo ativa os rastreadores de mouse e de foco do elemento e desenha no elemento a presença dos outros clientes — consulte [Presença](#presence).  
Sem ele, só o diagrama é sincronizado: o elemento não envia cursor, foco nem seleção e não desenha os de ninguém.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

O nome que os outros veem ao lado do cursor deste editor.  
O armazenamento compartilhado do elemento o lê a cada envio, como acontece com [getSharedStore](./collaborative-editing.md#getnickname), e os outros usuários veem `user` quando ele está ausente ou em branco.

```js
bindErdEditor(editor, doc, {
  awareness: provider.awareness,
  getNickname: () => 'nickname...',
});
```

## ErdYjsBinding {#erdyjsbinding}

```ts
type ErdYjsBinding = {
  seed: (value?: string) => boolean;
  on: <K extends keyof BindingEvents>(
    event: K,
    listener: BindingEvents[K]
  ) => () => void;
  destroy: () => void;
};

type BindingEvents = {
  rejoin: (reason: RejoinReason) => void;
  error: (error: Error) => void;
};

type RejoinReason = 'snapshot' | 'seedLost';
```

`on(event, listener)` retorna uma função que remove o listener.

### seed {#seed}

Escreve o primeiro instantâneo da sala a partir do documento do editor e retorna `true`.  
Dado `value`, o texto de um documento em qualquer forma que [setInitialValue](../erd-editor-element.md#setinitialvalue) lê, carrega-o primeiro no editor.  
Em seguida, descarta, sem registrá-los, os arrastos, redimensionamentos e mudanças de cor que o editor ainda retém, de modo que nenhum deles chega à sala depois do instantâneo. Sem `value`, o instantâneo já os mostra, pois toma o documento do editor; com `value`, eles pertenciam ao documento que `value` substituiu.  
Depois escreve o instantâneo que [O que a sala contém](#what-the-room-holds) descreve.  
Quando a sala já contém um instantâneo, retorna `false` e não escreve nada, sem carregar `value`, de modo que todos os clientes podem chamá-lo depois de vincular. Também retorna `false` depois que o vínculo foi destruído ou interrompido, e em um vínculo [recusado](#onerror) no momento do vínculo.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

O vínculo reabriu o editor no instantâneo da sala, como o [reseed](./collaborative-editing.md#reseed) faz; [Edições offline e reentradas](#offline-edits-and-rejoins) diz o que ele mantém e o que perde.  
`reason` informa o motivo:

- `'snapshot'`: o instantâneo contém edições que o vínculo não havia aplicado, porque esteve ausente enquanto um compactador as condensava, ou porque um compactador restaurou, em uma condensação própria, o que havia condensado em um instantâneo que o de outro compactador substituiu (consulte [Um compactador por sala](#one-compactor-per-room)). É também o motivo quando o instantâneo é o primeiro a chegar a um vínculo de uma sala vazia, e quando é a inicialização de outro cliente e este vínculo havia entrado em uma inicialização que não escreveu.
- `'seedLost'`: a inicialização de outro cliente venceu a que este vínculo escreveu.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

O vínculo se recusou a vincular, foi interrompido ou rejeitou uma opção. Cada mensagem começa com `erd-editor-yjs: `.

No momento do vínculo, ele não vincula nada quando:

- o editor ou o armazenamento de pares já está vinculado a este `Y.Doc`;
- seu `@dineug/erd-editor` foi compilado antes da `5.1.0`; o vínculo destrói o armazenamento compartilhado que tomou de um elemento;
- o armazenamento de pares foi destruído antes de ser vinculado;
- a sala contém um instantâneo em um layout que esta versão não lê (consulte [O que a sala contém](#what-the-room-holds)).

Um vínculo assim dispara `error` em uma microtask, de modo que um listener adicionado logo após a chamada o recebe, e nenhum `rejoin` é disparado nele.

Depois, o vínculo é interrompido quando:

- o instantâneo da sala passa a um layout que esta versão não lê. Todos os vínculos desta versão são interrompidos, cada editor mantém o que havia aplicado e nada editado depois é escrito;
- seu armazenamento de pares foi destruído por baixo dele, o que é percebido na próxima vez que a sala muda ou que `seed()` ou `compact()` é chamado.

Um vínculo interrompido libera o armazenamento compartilhado que tomou, e o seu armazenamento e o `Y.Doc` como um par, como faz [destroy](#destroy), e mantém seus listeners.

Só para `bindPeerStore`, estes disparam `error` e o vínculo continua:

- `compactAfter` não é um inteiro positivo: o vínculo condensa somente quando solicitado;
- `electionGraceMs` ou `retainMs` não é um número de 0 a 2.147.483.647 ms: seu padrão assume o lugar, pois um timer além desse intervalo dispara de imediato;
- `synced` é rejeitado: o vínculo nunca condensa e deixa a eleição para os outros compactadores (consulte [Um compactador por sala](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Envia à sala os arrastos, redimensionamentos e mudanças de cor que o editor ainda retém, define o campo `erd` do Awareness do vínculo como `null`, para que os outros descartem de imediato seu cursor, foco e seleção, e deixa de observar o `Y.Doc` e o Awareness.  
Para um elemento, também destrói o armazenamento compartilhado que tomou, deixando o elemento e seu documento como estão.  
Uma segunda chamada não faz nada. Depois disso, o que o editor edita não chega a ninguém.

O armazenamento de pares, o `Y.Doc` e o provider continuam sendo seus, para destruir depois do vínculo: um armazenamento de pares destruído antes nunca envia os arrastos que ainda retinha.  
O [destroy](../erd-editor-element.md#destroy) do próprio elemento destrói todos os armazenamentos compartilhados que entregou, inclusive o do vínculo, e descarta o que eles retêm, então destrua o vínculo primeiro.  
Destrua um vínculo antes de vincular o mesmo editor ou armazenamento de pares ao mesmo `Y.Doc` de novo; um que foi interrompido com `error` já os liberou.

```js
binding.destroy();
editor.destroy();
```

## Presença {#presence}

Com [awareness](#awareness), o cursor do editor, a tabela ou célula em foco, a seleção e o retângulo de arrasto trafegam no campo `erd` do seu estado local do Awareness, nunca no `Y.Doc`, de modo que nunca entram no histórico da sala, no seu instantâneo nem em um `Y.Doc` persistido.  
Os outros os desenham como desenham a presença de um colaborador — consulte [focusTracker](./collaborative-editing.md#focustracker) — e um cliente que entra desenha a presença que a sala já mostra.  
O elemento reenvia seu foco e sua seleção a cada 30 segundos e seu retângulo de arrasto a cada segundo. Cada um desses reenvios chega aos outros mesmo quando repete o último, de modo que o que um usuário ainda mantém nunca expira.

Um cliente que sai é esquecido de imediato.  
Quando o Awareness descarta seu estado, ou seu campo `erd` passa a `null`, como [destroy](#destroy) define, ou nomeia outro editor, o vínculo remove do elemento o cursor, o foco, a seleção e o retângulo de arrasto desse editor com [forgetPeer](./collaborative-editing.md#forgetpeer), em vez de esperar que expirem.  
Ele os mantém enquanto outro cliente ainda mostra o mesmo editor, como faz um elemento vinculado de novo a outro `Y.Doc` da sala.

## Edições offline e reentradas {#offline-edits-and-rejoins}

Um cliente desconectado do provider continua editando. Suas edições esperam no seu `Y.Doc` local, não no armazenamento compartilhado, e chegam aos outros quando o provider se reconecta e sincroniza.

Quando um compactador condensou edições que o cliente nunca aplicou enquanto estava ausente, o instantâneo as contém, de modo que, ao se reconectar, o cliente reabre no instantâneo com `rejoin('snapshot')`, depois de enviar os arrastos, redimensionamentos e mudanças de cor que seu editor ainda retinha. Uma condensação apenas do que o cliente havia aplicado não reabre nada.  
Uma reentrada em um instantâneo da inicialização em que o vínculo entrou reproduz todas as edições que o instantâneo não contém, inclusive as do próprio cliente feitas enquanto estava ausente, de modo que nenhuma se perde. Uma reentrada em outra inicialização não mantém nada, como [Inicializar uma sala](#seeding-a-room) descreve.

Toda reentrada limpa o histórico de desfazer, a seleção e o foco, e fecha uma exibição [Flow](../../guide/guides/visualization.md#flow-mode) aberta, um [desenho de relacionamento](../../guide/guides/editing-start.md#relationship-creation) e um editor de nota, de nome de grupo de tabelas ou de célula, pois eles podem nomear o que o instantâneo não contém mais.  
Um nome de grupo de tabelas digitado e ainda não confirmado é descartado. Uma célula de nome lógico que se fecha deriva o nome físico de um nome lógico que quem a lê digitou, onde o documento reaberto ainda o contém, como qualquer fechamento dessa célula faz. Essa derivação é uma edição comum: a sala a registra, ela cria uma entrada de desfazer e emite `change` — consulte [reseed](./collaborative-editing.md#reseed).  
Um vínculo que havia entrado na sala mantém o que seu leitor vê: a posição de rolagem, o nível de zoom e a aba, e as configurações que um leitor somente leitura alterou.  
Também mantém a exibição de nomes e as configurações de código (linguagem do Gerador de código, estilos de nome e tipo de delimitador) que o leitor mostrou por conta própria, desde que o [bloqueio](../../guide/guides/settings.md#lock) de cada um estivesse ativado antes da reentrada e continue ativado depois dela, no mesmo valor bloqueado.  
Nada do que ele mantém chega a `value`, que informa as configurações do documento reaberto — consulte [reseed](./collaborative-editing.md#reseed) com `keepScreen`.  
A posição de rolagem e o nível de zoom de um elemento não exibido desde o último carregamento, e a tela inteira de um vínculo que ainda não havia entrado, abrem onde o instantâneo os coloca.  
Um armazenamento de pares não tem tela, de modo que sua reentrada não mantém nenhuma.

## Editores somente leitura {#read-only-editors}

Um elemento [somente leitura](../erd-editor-element.md#readonly) vinculado a uma sala não escreve nada no histórico da sala: seu armazenamento compartilhado não envia nenhuma alteração, apenas seus rastreadores e o handshake dos registros, e a sala [não registra nenhum dos dois](#what-the-room-holds).  
Ele ainda aplica todas as edições que a sala transporta e, com [awareness](#awareness), o cursor, o foco, a seleção e o retângulo de arrasto de quem o lê ainda chegam aos outros.  
As configurações que quem o lê altera ficam na sua tela, como em qualquer editor somente leitura.  
[seed](#seed) não é recusado: um elemento somente leitura inicializa uma sala vazia com o documento que contém, ou com `value`, quando informado.

## O que a sala contém {#what-the-room-holds}

O vínculo mantém o diagrama em dois nomes do `Y.Doc`: `erd:snapshot`, um mapa que contém um instantâneo do documento, e `erd:log`, um array dos lotes de ações do editor desde então. Um provider de persistência armazena ambos com o resto do `Y.Doc`.

O instantâneo contém o [runtimeValue](../erd-editor-element.md#runtimevalue) do documento, inclusive as entidades removidas, seus registros de colaboração e sua versão, e até onde as edições de cada escritor estão condensadas nele. Uma inicialização o escreve, e cada condensação de um compactador também.  
Cada entrada do registro é um lote como o editor o enviou, com seus metadados, que trazem o id do editor e o apelido de quem enviou.  
Rolagens, zooms, trocas de aba, presença e o handshake dos registros nunca são registrados. Todas as outras alterações que o editor envia são registradas, inclusive uma troca da exibição de nomes feita sob o seu [bloqueio](../../guide/guides/settings.md#lock), que todos os outros clientes descartam.  
Uma linguagem do Gerador de código, um estilo de nome ou um tipo de delimitador alterado sob o seu bloqueio nunca é enviado, de modo que fica na tela daquele editor e nunca chega à sala.

Um `Y.Doc` devolvido por um provider de persistência abre o diagrama que contém, como um vínculo abre qualquer `Y.Doc` que contenha um instantâneo — consulte [Uso](#usage).

O instantâneo não é um arquivo: seu valor em tempo de execução carrega entidades removidas, que um arquivo não deve conter.  
Para escrever o diagrama da sala em um armazenamento, salve o [value](../erd-editor-element.md#value) de um elemento vinculado sempre que seu evento [change](../erd-editor-element.md#change) disparar.  
Salve-o também uma vez depois de vincular, depois de um [seed](#seed) com `value` e em um listener de [rejoin](#onrejoin), pois nenhum desses carregamentos emite `change`.  
Um elemento [somente leitura](../erd-editor-element.md#readonly) nunca emite `change`, então salve a partir de um que não seja somente leitura, ou leia `value` de um armazenamento de pares vinculado, que aplica as edições da sala à medida que chegam.  
Um [replicationStore](./remote-storage.md) não pode ser vinculado, pois lhe faltam os métodos de que um vínculo precisa, e um alimentado pelo armazenamento compartilhado de um elemento vinculado perde as edições da sala — consulte [Replicar um editor ao vivo](./remote-storage.md#replicating-a-live-editor).

O layout é privado e pode mudar com [ERD_YJS_FORMAT](#exports).  
Leia uma sala somente por meio de um vínculo e deixe os nomes `erd:` e o campo `erd` do Awareness para ele.

## Compactar uma sala {#compacting-a-room}

O histórico da sala cresce a cada edição, e cada cliente que entra o reproduz inteiro, até que algo o condense.  
`bindPeerStore` vincula um armazenamento de pares headless de `@dineug/erd-editor/peer.js` e retorna um `ErdYjsPeerBinding`: os mesmos [seed](#seed), [on](#erdyjsbinding) e [destroy](#destroy), com [compact](#compact).  
Um armazenamento de pares vinculado em um processo Node ao lado do servidor, um sidecar, condensa o histórico em um instantâneo do seu próprio diagrama.  
O vínculo de um elemento nunca condensa, e um armazenamento de pares vinculado sem `compactAfter` e sem chamada a `compact()` é um par headless comum.

```ts
function bindPeerStore(
  peer: PeerStore,
  doc: Y.Doc,
  options?: PeerBindOptions
): ErdYjsPeerBinding;

type ErdYjsPeerBinding = ErdYjsBinding & {
  compact: () => CompactResult;
};
```

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols y-websocket ws
```

```js
import { createPeerStore } from '@dineug/erd-editor/peer.js';
import { bindPeerStore } from '@dineug/erd-editor-yjs';
import WebSocket from 'ws';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';

const doc = new Y.Doc();
const provider = new WebsocketProvider('wss://yjs.example.com', 'my-diagram', doc, {
  WebSocketPolyfill: WebSocket,
});
const synced = new Promise(resolve => {
  provider.on('sync', function onSync(isSynced) {
    if (!isSynced) return;
    provider.off('sync', onSync);
    resolve();
  });
});

const peer = createPeerStore({ nickname: 'compactor', presence: false });
const binding = bindPeerStore(peer, doc, {
  awareness: provider.awareness,
  compactAfter: 1000,
  synced,
});
binding.on('error', error => console.error(error));

process.on('SIGTERM', () => {
  binding.destroy(); // first, so the peer store's held drags still reach the room
  peer.destroy();
  provider.destroy();
  doc.destroy(); // ends the provider's Awareness timer, so the process can exit
});
```

O armazenamento de pares continua sendo seu: o vínculo nunca o destrói. Seu apelido é o que foi dado a `createPeerStore`, e `presence: false` evita que ele envie um foco próprio.

Uma condensação escreve o instantâneo a partir do valor em tempo de execução, dos registros e da versão do próprio armazenamento de pares, e exclui as entradas do registro que ela cobre e todas as entradas de outra inicialização, tudo em uma única transação.  
Os clientes que aplicaram tudo veem as entradas sumirem; um que não aplicou reabre no instantâneo (consulte [Edições offline e reentradas](#offline-edits-and-rejoins)).  
Toda condensação reescreve o diagrama inteiro no instantâneo, de modo que cada uma envia a todos os clientes uma atualização do tamanho do JSON em tempo de execução do diagrama somado aos registros, por menos entradas que ela leve. Defina `compactAfter` alto o bastante para que as entradas que uma condensação leva pesem mais que uma cópia do diagrama.

### PeerBindOptions {#peerbindoptions}

```ts
type PeerBindOptions = CompactOptions & {
  awareness?: Awareness;
};

type CompactOptions = {
  compactAfter?: number;
  synced?: Promise<void>;
  electionGraceMs?: number;
  retainMs?: number;
};
```

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `awareness` | Nenhum | Mostra o armazenamento de pares no Awareness da sala, como [awareness](#awareness) faz com um elemento. Um compactador que condensa por conta própria é marcado ali, de modo que compactadores que se veem elegem um para condensar, e um que não vê nenhum outro cliente não condensa nada por conta própria — consulte [Um compactador por sala](#one-compactor-per-room). Sem ele, um compactador condensa por conta própria, sem eleição nem prazo de espera. |
| `compactAfter` | Nenhum | Condensar por conta própria quando o registro contiver este número de entradas que uma condensação levaria. Sem ele, ou sem `synced`, só `compact()` condensa, e a condensação que restaura (consulte [Um compactador por sala](#one-compactor-per-room)). |
| `synced` | Nenhum | Uma promise que é resolvida quando o provider sincroniza. Nenhuma condensação ocorre antes dela, `compact()` inclusive. Sem ela, nada condensa por conta própria e `compact()` condensa de imediato. |
| `electionGraceMs` | `3000` | Com `awareness`, por quanto tempo o compactador observa a sala antes de condensar por conta própria, depois de `synced` e de novo sempre que outros clientes aparecem depois de nenhum ter aparecido. |
| `retainMs` | `600000` (dez minutos) | Por quanto tempo as entradas de uma condensação ficam retidas para serem restauradas (consulte [Um compactador por sala](#one-compactor-per-room)), contado a partir da primeira atualização que a sala envia depois da condensação. |

Uma opção inválida, ou um `synced` que é rejeitado, dispara [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Condensa de imediato, sem eleição, prazo de espera nem limite.  
Primeiro incorpora o instantâneo atual da sala, uma reentrada inclusive, e envia o que seu armazenamento de pares ainda retém.  
Responde `{ compacted: true, generation }`, em que `generation` conta as condensações do instantâneo: `0` para uma inicialização, uma a mais por condensação.  
Caso contrário, responde `{ compacted: false, reason }`:

- `'destroyed'` quando o vínculo foi destruído ou interrompido, e em um vínculo [recusado](#onerror) no momento do vínculo, mesmo antes de `synced` ser resolvido;
- `'not-synced'` antes de `synced` ser resolvido;
- `'no-snapshot'` em uma sala que nenhum cliente inicializou.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Um compactador por sala {#one-compactor-per-room}

Execute exatamente um compactador por sala e inicie um novo somente depois que o antigo parar. Nada impõe isso.  
Entre compactadores que se veem no Awareness, só o de menor id de cliente do Yjs condensa por conta própria, e quando ele sai, ou seu `synced` é rejeitado, o próximo assume de imediato.  
Um compactador cujo Awareness não mostra nenhum outro cliente, como quando seu próprio socket se fecha e derruba todos, não condensa nada por conta própria até que outros apareçam de novo e ele tenha observado a sala por `electionGraceMs`.

Dois compactadores isolados um do outro, ou uma reinicialização cujo antecessor ainda está em execução, ainda podem condensar cada um.  
A sala então mantém um dos dois instantâneos, e o compactador cujo instantâneo perdeu restaura o que condensou e o vencedor não contém, pelo tempo em que o retém: `retainMs`, e no máximo suas últimas 1.000 entradas, por maiores que sejam.  
Assim, nada se perde quando o compactador cujo instantâneo perde é o que se reconecta, desde que ele não tenha condensado mais de 1.000 entradas enquanto estavam separados.  
Quando é o que ficou online e sua retenção expirou, o instantâneo e o histórico da sala não contêm o que ele condensou até que ele condense de novo. Um cliente que perdeu essas edições, ou um que entra nesse meio-tempo, não as tem, e retém as edições posteriores de cada escritor cujas edições o compactador condensou. A próxima condensação do compactador as traz todas de volta, a menos que o instantâneo vencedor contivesse edições que lhe faltavam, o que o reabre nesse instantâneo e perde de vez o que ele condensou.

Um compactador restaura em uma condensação própria, feita depois que ele alcançou o instantâneo vencedor, sem eleição, prazo de espera nem limite, e todos os clientes reabrem nessa condensação com `rejoin('snapshot')`.  
As edições que ele restaura não chegam a nenhum cliente fora dessa condensação, de modo que um cliente que ficou online o tempo todo termina igual aos outros e a um que entra depois, mesmo quando uma edição posterior de outro escritor se apoia em uma delas, como renomear uma tabela que outro cliente adicionou.  
Cada restauração custa a todos os clientes essa reentrada, com [o que uma reentrada perde](#offline-edits-and-rejoins). Quando dois compactadores restauram ao mesmo tempo, todos os clientes ainda terminam iguais, embora uma edição possa continuar aplicada antes daquela em que se apoia.  
Um vínculo destruído ou interrompido antes de essa condensação rodar, como quando um listener de `rejoin` o destrói, restaura, em vez disso, as edições avulsas. Nenhuma se perde, mas então um cliente que ficou online o tempo todo pode aplicar uma depois da edição de outro escritor que se apoia nela, e terminar diferente de um que entra depois.

## Limites {#limits}

- **A área visível fica em cada tela.** Rolagens, zooms e trocas de aba [nunca são registrados](#what-the-room-holds), embora uma sessão ligada por `getSharedStore` os envie (lá, eles também não movem a área visível nem a aba de nenhum outro usuário). Cada leitor mantém a sua, e o vínculo a mostra apenas no seu estado do Awareness, que nada lê ainda. Com o [bloqueio](../../guide/guides/settings.md#lock) `Viewport` ou `Canvas Type` desativado, o `value` de cada cliente salva o seu; sob os bloqueios, que um documento novo tem ativados, todos os clientes salvam o bloqueado.
- **O instantâneo cresce uma entrada por vínculo.** Ele guarda, para cada vínculo que já escreveu na sala, até onde suas edições estão condensadas, e nunca descarta uma. Um vínculo refeito, ou um que passou a outra inicialização, conta de novo, e cada condensação que restaura também. Uma entrada é um id de 32 caracteres e um número, de modo que dez mil sessões de escrita acrescentam algumas centenas de quilobytes a cada instantâneo e a cada condensação.
- **Um hub e uma sala não retransmitem nada entre si.** Um elemento vinculado a uma sala e ao [hub](../../mcp/live-and-headless.md#live) de um agente de codificação, ou a qualquer outro transporte por meio de `getSharedStore()`, aplica as edições de ambos, mas nenhum ouve as do outro, pois um armazenamento compartilhado nunca reenvia o que recebeu.
- **Adições feitas ao mesmo tempo podem ser listadas em ordens diferentes.** Tabelas ou notas que dois clientes adicionam ao mesmo tempo podem ficar em outra ordem no diagrama de cada cliente, como numa sessão ligada por `getSharedStore` — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).
- **Cores e algumas outras alterações feitas ao mesmo tempo podem terminar diferentes.** Uma mudança de cor é registrada sem versão, e cada cliente a carimba com a sua ao aplicá-la. Duas mudanças de cor da mesma tabela, nota ou grupo de tabelas feitas ao mesmo tempo podem, portanto, deixar os clientes, e um cliente que entra depois e reproduz o registro, com cores diferentes. O mesmo vale para as outras alterações que cada cliente aplica na ordem em que as ouve, como duas movimentações de coluna dentro da mesma tabela ou do mesmo índice, ou duas alterações do banco de dados — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).
- **Um cursor que sai espera pelo servidor.** O vínculo limpa o cursor de um par assim que o Awareness o descarta. Um servidor que, quando um socket se fecha, remove apenas os estados do Awareness que esse socket adicionou primeiro mantém, nas telas dos outros, um cliente que havia se reconectado depois que ele sai, até que o Awareness o expire, 30 segundos depois. Um que remove todos os estados que um socket escreveu por último, uma atualização tanto quanto uma adição, o limpa de imediato.

## Exportações {#exports}

| Exportação | Descrição |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Vincula um elemento `<erd-editor>` — consulte [Uso](#usage). Retorna um [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Vincula um armazenamento de pares de `@dineug/erd-editor/peer.js` — consulte [Compactar uma sala](#compacting-a-room). Retorna o mesmo com [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | O layout do `Y.Doc` que esta versão escreve, `1`; um vínculo recusa uma sala escrita em outro. |

Tipos: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
