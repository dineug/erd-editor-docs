---
sidebar_position: 2
description: Manter um elemento <erd-editor> ou um armazenamento par headless sincronizados através de um documento Yjs com @dineug/erd-editor-yjs, inicializar uma sala, mostrar a presença através do Awareness, continuar a editar offline e compactar o histórico da sala com um sidecar de compactação.
---

# Yjs

`@dineug/erd-editor-yjs` mantém os diagramas sincronizados através de um documento [Yjs](https://github.com/yjs/yjs). É um pacote à parte, lançado pela primeira vez como `0.1.0` a par do `@dineug/erd-editor` `5.1.0`.  
`bindErdEditor` liga um elemento `<erd-editor>`, e `bindPeerStore` um armazenamento par headless de `@dineug/erd-editor/peer.js`, a um `Y.Doc`.  
Qualquer fornecedor que transporte o `Y.Doc` transporta o diagrama: um servidor websocket, WebRTC, IndexedDB ou um fornecedor seu. O fornecedor e o `Y.Doc` continuam a ser seus: a ligação nunca estabelece nem termina a ligação do fornecedor e nunca os destrói.

As edições viajam como os lotes de ações do próprio editor, que a ligação conserva tal como o armazenamento os enviou.  
Assim, os registos de colaboração do editor resolvem as edições feitas no mesmo instante como numa sessão montada através de `getSharedStore`, com as mesmas exceções, como uma mudança de cor — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).  
Os cursores, o foco, as seleções e os retângulos de arrasto viajam através do Awareness do fornecedor — consulte [Presença](#presence).  
Em comparação com montar por si um armazenamento partilhado sobre um transporte, a ligação acrescenta:

- Um cliente que entra abre o diagrama que a sala contém, sem que um editor em execução lhe entregue um [runtimeValue](../erd-editor-element.md#runtimevalue).
- Um cliente desligado continua a editar, e as suas edições chegam quando volta a ligar-se — consulte [Edições offline e novas entradas](#offline-edits-and-rejoins).
- Um `Y.Doc` devolvido por um fornecedor de persistência abre o diagrama que contém — consulte [O que a sala contém](#what-the-room-holds).
- Um sidecar Node opcional compacta o histórico da sala num único instantâneo — consulte [Compactar uma sala](#compacting-a-room).

A ligação precisa dos cinco métodos que a `5.1.0` acrescentou ao armazenamento partilhado e ao armazenamento par — [getLWW](./collaborative-editing.md#getlww), [mergeLWW](./collaborative-editing.md#mergelww), [getVersion](./collaborative-editing.md#getversion), [forgetPeer](./collaborative-editing.md#forgetpeer) e [reseed](./collaborative-editing.md#reseed) — e faz ela própria todas as chamadas de que precisa.

## Instalação {#installation}

```sh
npm install @dineug/erd-editor-yjs @dineug/erd-editor yjs y-protocols
npm install y-websocket # or another provider
```

`@dineug/erd-editor`, `yjs` e `y-protocols` são dependências pares, para que uma página tenha uma só cópia de cada: `@dineug/erd-editor` `5.1.0` ou posterior dentro da `5.x`, `yjs` `13.6` ou posterior dentro da `13.x` e `y-protocols` `1.0` ou posterior dentro da `1.x`.  
O pacote usa apenas os respetivos tipos e trabalha sobre o `Y.Doc` e o `Awareness` que lhe passa, pelo que não carrega código próprio do Yjs, do y-protocols nem do editor.  
Duas cópias do Yjs numa página fazem falhar as verificações de construtor uma da outra, e a segunda regista `Yjs was already imported`. Quando o seu código e um fornecedor resolvem `yjs` a partir de dois sítios, elimine a duplicação no bundler (Vite: `resolve.dedupe: ['yjs']`).

O pacote é só ESM (`"type": "module"`), com uma única entrada, a raiz do pacote, e está marcado como livre de efeitos secundários, pelo que um bundle que importa apenas `bindErdEditor` deixa o compactador de fora.  
`bindErdEditor` precisa de um DOM, já que liga um elemento `<erd-editor>` definido. `bindPeerStore` também funciona em Node simples, no Node.js 22.12 ou posterior, tal como o [sidecar de compactação](#compacting-a-room).

## Utilização {#usage}

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

`wss://yjs.example.com` e `my-diagram` representam o seu próprio servidor e a sua própria sala.  
Ligue, e inicialize, só depois de o fornecedor sincronizar, como lhe indica o evento `sync` do y-websocket com `true`. Uma inicialização feita mais cedo pode substituir o diagrama da sala — consulte [Inicializar uma sala](#seeding-a-room).

Quando o `Y.Doc` contém o instantâneo de uma sala no momento da ligação, a ligação abre-o de imediato no elemento: carrega o instantâneo com os respetivos registos e versão, como o faz [reseed](./collaborative-editing.md#reseed), e aplica todas as edições registadas desde então.  
Essa abertura limpa e fecha o que uma nova entrada limpa e fecha — consulte [Edições offline e novas entradas](#offline-edits-and-rejoins) — e o elemento abre onde o instantâneo o coloca. Nenhum `rejoin` é disparado por esta primeira abertura.  
Quando o `Y.Doc` não contém nenhum instantâneo, como numa sala vazia ou antes de o fornecedor sincronizar, o elemento mantém o seu documento e a ligação não escreve nada na sala até aparecer um instantâneo, seja o da sua própria [inicialização](#seed), seja o de outro cliente.

`bindErdEditor` toma um armazenamento partilhado do elemento com [getSharedStore](../erd-editor-element.md#getsharedstore), e [destroy](#destroy) liberta-o.  
O elemento já tem de ser um `<erd-editor>`, com a sua entrada importada ou `defineErdEditor()` chamado — consulte [Registar os elementos](../installation.md#registering-the-elements). Enquanto a etiqueta não está definida, um `<erd-editor>` é um simples `HTMLElement`, que o navegador atualiza quando a etiqueta é definida e o elemento está no documento. Para um elemento ainda não atualizado, `bindErdEditor` gera um `TypeError` em vez de emitir `error`.

As edições da sala são aplicadas ao elemento, e emitem [change](../erd-editor-element.md#change), como as de um colaborador, incluindo as edições reproduzidas depois de um instantâneo ser aberto.  
Abrir um instantâneo, no momento da ligação ou numa nova entrada, não cria nenhuma entrada de anulação, não emite `change` e não escreve nada na sala, exceto a derivação do nome lógico que [Edições offline e novas entradas](#offline-edits-and-rejoins) descreve.  
Para carregar outro documento numa sala inicializada, faça uma alteração que todos os clientes apliquem: atribua [value](../erd-editor-element.md#value), chame [clear](../erd-editor-element.md#clear) ou importe um.  
[setInitialValue](../erd-editor-element.md#setinitialvalue) nunca é escrito na sala, já que um armazenamento partilhado não o envia, pelo que altera apenas esse elemento enquanto todos os outros clientes mantêm o diagrama da sala. Em vez disso, inicialize uma sala vazia com [seed](#seed).

Um `Y.Doc` contém um diagrama. A ligação guarda-o sob os nomes `erd:` do `Y.Doc` e define o campo `erd` do estado local do Awareness, e não mexe em nenhum outro nome nem campo.  
Dê a cada elemento ligado um `Y.Doc` e um Awareness próprios, como cada cliente de uma sala tem: duas ligações que partilham o mesmo Awareness sobrescrevem o campo `erd` uma da outra.

## Inicializar uma sala {#seeding-a-room}

Uma sala não contém nenhum diagrama até um cliente a [inicializar](#seed).  
Entretanto, o que um editor contém vai para a sua própria inicialização e cede perante a inicialização de outro cliente quando esta chega primeiro: a ligação volta a abrir-se sobre ela com `rejoin('snapshot')`, e o documento que o elemento continha, com o que nele foi editado desde a ligação, perde-se.

Quando dois clientes inicializam ao mesmo tempo, uma inicialização vence em todos os clientes.  
O outro cliente que inicializou volta a abrir-se sobre ela com `rejoin('seedLost')` e perde o que editou desde a sua inicialização, e o mesmo acontece a um cliente que tinha aderido à inicialização vencida, com `rejoin('snapshot')`. As suas edições na inicialização vencida não chegam a ninguém.  
Uma inicialização feita antes de o fornecedor sincronizar conta como feita no mesmo instante que a inicialização de onde veio o diagrama da sala, pelo que pode vencê-la e substituir o diagrama da sala.

## BindOptions {#bindoptions}

```ts
import type { Awareness } from 'y-protocols/awareness';

type BindOptions = {
  awareness?: Awareness;
  getNickname?: () => string;
};
```

### awareness {#awareness}

O `Awareness` que transporta os cursores, o foco, as seleções e os retângulos de arrasto, como o do fornecedor.  
Com ele, a ligação ativa os rastreadores de rato e de foco do elemento e desenha no elemento a presença dos outros clientes — consulte [Presença](#presence).  
Sem ele, só o diagrama é sincronizado: o elemento não envia cursor, foco nem seleção e não desenha os de mais ninguém.

```js
bindErdEditor(editor, doc, { awareness: provider.awareness });
```

### getNickname {#getnickname}

O nome que os outros veem junto ao cursor deste editor.  
O armazenamento partilhado do elemento lê-o de cada vez que envia, como com [getSharedStore](./collaborative-editing.md#getnickname), e os outros utilizadores veem `user` quando está em falta ou em branco.

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

`on(event, listener)` devolve uma função que remove o listener.

### seed {#seed}

Escreve o primeiro instantâneo da sala a partir do documento do editor e devolve `true`.  
Se lhe for dado `value`, o texto de um documento em qualquer forma que [setInitialValue](../erd-editor-element.md#setinitialvalue) leia, carrega-o primeiro no editor.  
Depois liberta, sem os registar, os arrastos, redimensionamentos e mudanças de cor que o editor ainda retém, para que nenhum chegue à sala depois do instantâneo. Sem `value`, o instantâneo já os mostra, porque toma o documento do editor; com `value`, pertenciam ao documento que `value` substituiu.  
Depois escreve o instantâneo que [O que a sala contém](#what-the-room-holds) descreve.  
Quando a sala já contém um instantâneo, devolve `false` e não escreve nada, sem carregar `value`, pelo que todos os clientes o podem chamar depois de ligar. Devolve também `false` quando a ligação foi destruída ou parou, e numa ligação [recusada](#onerror) no momento da ligação.

```js
binding.seed(); // the document the editor holds
// or
binding.seed(await (await fetch('/diagrams/shop.erd.json')).text());
```

### on@rejoin {#onrejoin}

A ligação voltou a abrir o editor sobre o instantâneo da sala, como o faz [reseed](./collaborative-editing.md#reseed); [Edições offline e novas entradas](#offline-edits-and-rejoins) diz o que conserva e o que perde.  
`reason` indica o motivo:

- `'snapshot'`: o instantâneo contém edições que a ligação não tinha aplicado, porque esteve ausente enquanto um compactador as compactava, ou porque um compactador repôs, numa compactação própria, o que tinha compactado num instantâneo que o de outro compactador substituiu (consulte [Um compactador por sala](#one-compactor-per-room)). É também o motivo quando o instantâneo é o primeiro a chegar a uma ligação de uma sala vazia, e quando é a inicialização de outro cliente e esta ligação tinha aderido a uma inicialização que não escreveu.
- `'seedLost'`: a inicialização de outro cliente venceu a inicialização que esta ligação escreveu.

```js
binding.on('rejoin', reason => {
  console.info('reopened on the room', reason);
});
```

### on@error {#onerror}

A ligação recusou ligar-se, parou ou rejeitou uma opção. Cada mensagem começa por `erd-editor-yjs: `.

No momento da ligação, não liga nada quando:

- o editor ou o armazenamento par já está ligado a este `Y.Doc`;
- o seu `@dineug/erd-editor` foi compilado antes da `5.1.0`; a ligação destrói o armazenamento partilhado que tomou de um elemento;
- o armazenamento par foi destruído antes de ser ligado;
- a sala contém um instantâneo num formato que esta versão não lê (consulte [O que a sala contém](#what-the-room-holds)).

Uma ligação assim emite `error` numa microtarefa, pelo que um listener adicionado logo a seguir à chamada o ouve, e nenhum `rejoin` é alguma vez disparado nela.

Mais tarde, a ligação para quando:

- o instantâneo da sala passa para um formato que esta versão não lê. Todas as ligações desta versão param, cada editor mantém o que tinha aplicado e nada do que é editado depois é escrito;
- o seu armazenamento par foi destruído por baixo dela, o que se descobre na vez seguinte em que a sala muda ou `seed()` ou `compact()` é chamado.

Uma ligação que para liberta o armazenamento partilhado que tomou, e o seu armazenamento e o `Y.Doc` como par, como o faz [destroy](#destroy), e mantém os seus listeners.

Só para `bindPeerStore`, estes casos emitem `error` e a ligação continua:

- `compactAfter` não é um inteiro positivo: a ligação só compacta quando lhe é pedido;
- `electionGraceMs` ou `retainMs` não é um número de 0 a 2 147 483 647 ms: o valor predefinido toma o seu lugar, já que um temporizador para além desse intervalo dispara de imediato;
- `synced` é rejeitado: a ligação nunca compacta e deixa a eleição aos outros compactadores (consulte [Um compactador por sala](#one-compactor-per-room)).

```js
binding.on('error', error => {
  console.error(error.message);
});
```

### destroy {#destroy}

Envia para a sala os arrastos, redimensionamentos e mudanças de cor que o editor ainda retém, define o campo `erd` do Awareness da ligação como `null`, para que os outros descartem de imediato o seu cursor, foco e seleção, e deixa de observar o `Y.Doc` e o Awareness.  
Para um elemento, destrói também o armazenamento partilhado que tomou, deixando o elemento e o seu documento como estão.  
Uma segunda chamada não faz nada. Depois disso, o que o editor edita não chega a ninguém.

O armazenamento par, o `Y.Doc` e o fornecedor continuam a ser seus, para destruir depois da ligação: um armazenamento par destruído primeiro nunca envia os arrastos que ainda retinha.  
O [destroy](../erd-editor-element.md#destroy) do próprio elemento destrói todos os armazenamentos partilhados que entregou, incluindo o da ligação, e descarta o que estes retêm, pelo que deve destruir primeiro a ligação.  
Destrua uma ligação antes de voltar a ligar o mesmo editor ou armazenamento par ao mesmo `Y.Doc`; uma que parou com `error` já se libertou.

```js
binding.destroy();
editor.destroy();
```

## Presença {#presence}

Com [awareness](#awareness), o cursor do editor, a tabela ou a célula com o foco, a seleção e o retângulo de arrasto viajam no campo `erd` do seu estado local do Awareness, nunca no `Y.Doc`, pelo que nunca entram no histórico da sala, no seu instantâneo nem num `Y.Doc` persistido.  
Os outros desenham-nos como desenham a presença de um colaborador — consulte [focusTracker](./collaborative-editing.md#focustracker) — e um cliente que entra desenha a presença que a sala já mostra.  
O elemento volta a enviar o seu foco e a sua seleção a cada 30 segundos e o seu retângulo de arrasto a cada segundo. Cada um desses reenvios chega aos outros mesmo quando repete o último, para que aquilo que um utilizador ainda mantém nunca caduque.

Um cliente que sai é esquecido de imediato.  
Quando o Awareness descarta o seu estado, ou o seu campo `erd` passa a `null`, como [destroy](#destroy) o define, ou indica outro editor, a ligação remove do elemento o cursor, o foco, a seleção e o retângulo de arrasto desse editor com [forgetPeer](./collaborative-editing.md#forgetpeer), em vez de esperar que expirem.  
Mantém-nos enquanto outro cliente ainda mostrar o mesmo editor, como acontece com um elemento ligado de novo a outro `Y.Doc` da sala.

## Edições offline e novas entradas {#offline-edits-and-rejoins}

Um cliente desligado do fornecedor continua a editar. As suas edições esperam no seu `Y.Doc` local, não no armazenamento partilhado, e chegam aos outros quando o fornecedor volta a ligar-se e sincroniza.

Quando um compactador compactou edições que o cliente nunca aplicou enquanto esteve ausente, o instantâneo contém-nas, pelo que, ao voltar a ligar-se, o cliente volta a abrir-se sobre o instantâneo com `rejoin('snapshot')`, depois de enviar os arrastos, redimensionamentos e mudanças de cor que o seu editor ainda retinha. Uma compactação apenas do que o cliente tinha aplicado não volta a abrir nada.  
Uma nova entrada sobre um instantâneo da inicialização a que a ligação aderiu reproduz todas as edições que o instantâneo não contém, incluindo as do próprio cliente feitas enquanto esteve ausente, pelo que nenhuma se perde. Uma nova entrada sobre outra inicialização não conserva nada, como [Inicializar uma sala](#seeding-a-room) descreve.

Cada nova entrada limpa o histórico de anulação, a seleção e o foco, e fecha uma vista [Flow](../../guide/guides/visualization.md#flow-mode) aberta, um [desenho de relação](../../guide/guides/editing-start.md#relationship-creation) e um editor de nota, de nome de grupo de tabelas ou de célula, já que podem referir o que o instantâneo já não contém.  
Um nome de grupo de tabelas escrito e ainda não confirmado é descartado. Uma célula de nome lógico que se fecha deriva o nome físico a partir de um nome lógico que o seu leitor escreveu, quando o documento reaberto ainda o contém, como qualquer fecho dessa célula faz. Essa derivação é uma edição normal: a sala regista-a, cria uma entrada de anulação e emite `change` — consulte [reseed](./collaborative-editing.md#reseed).  
Uma ligação que tinha aderido à sala conserva o que o seu leitor vê: a posição de deslocamento, o nível de zoom e o separador, e as definições que um leitor só de leitura alterou.  
Conserva também a vista de nomes e as definições de código (a linguagem do Gerador de código, os formatos dos nomes e o tipo de delimitador) que o leitor mostrava por si, desde que o [bloqueio](../../guide/guides/settings.md#lock) de cada uma estivesse ativado antes da nova entrada e continue ativado depois dela, com o mesmo valor bloqueado.  
Nada do que conserva chega a `value`, que indica as definições do documento reaberto — consulte [reseed](./collaborative-editing.md#reseed) com `keepScreen`.  
A posição de deslocamento e o nível de zoom de um elemento não mostrado desde o seu último carregamento, e o ecrã inteiro de uma ligação que ainda não tinha aderido, abrem onde o instantâneo os coloca.  
Um armazenamento par não tem ecrã, pelo que a sua nova entrada não conserva nenhum.

## Editores só de leitura {#read-only-editors}

Um elemento [só de leitura](../erd-editor-element.md#readonly) ligado a uma sala não escreve nada no histórico da sala: o seu armazenamento partilhado não envia nenhuma alteração, apenas os seus rastreadores e a negociação dos registos, e a sala [não regista nenhum dos dois](#what-the-room-holds).  
Continua a aplicar todas as edições que a sala transporta e, com [awareness](#awareness), o cursor, o foco, a seleção e o retângulo de arrasto do seu leitor continuam a chegar aos outros.  
As definições que o seu leitor altera ficam no seu ecrã, como em qualquer editor só de leitura.  
[seed](#seed) não é recusado: um elemento só de leitura inicializa uma sala vazia com o documento que contém, ou com `value` quando este é dado.

## O que a sala contém {#what-the-room-holds}

A ligação guarda o diagrama em dois nomes do `Y.Doc`: `erd:snapshot`, um mapa que contém um instantâneo do documento, e `erd:log`, uma matriz dos lotes de ações do editor desde então. Um fornecedor de persistência guarda ambos com o resto do `Y.Doc`.

O instantâneo contém o [runtimeValue](../erd-editor-element.md#runtimevalue) do documento, incluindo as entidades removidas, os seus registos de colaboração e a versão, e até que ponto as edições de cada autor estão compactadas nele. Uma inicialização escreve-o, e cada compactação de um compactador também.  
Cada entrada do registo é um lote tal como o editor o enviou, com os seus metadados, que transportam o id do editor e a alcunha de quem o enviou.  
As deslocações, os zooms, as mudanças de separador, a presença e a negociação dos registos nunca são registados. Todas as outras alterações que o editor envia são, incluindo uma mudança de vista de nomes feita sob o seu [bloqueio](../../guide/guides/settings.md#lock), que todos os outros clientes descartam.  
Uma linguagem do Gerador de código, um formato de nome ou um tipo de delimitador alterado sob o seu bloqueio nunca é enviado, pelo que fica no ecrã desse editor e nunca chega à sala.

Um `Y.Doc` devolvido por um fornecedor de persistência abre o diagrama que contém, como uma ligação abre qualquer `Y.Doc` que contenha um instantâneo — consulte [Utilização](#usage).

O instantâneo não é um ficheiro: o seu valor em tempo de execução transporta entidades removidas, que um ficheiro não deve conter.  
Para escrever o diagrama da sala em armazenamento, guarde o [value](../erd-editor-element.md#value) de um elemento ligado sempre que o seu evento [change](../erd-editor-element.md#change) for disparado.  
Guarde-o também uma vez depois de ligar, depois de uma [inicialização](#seed) com um `value` e num listener de [rejoin](#onrejoin), já que nenhum desses carregamentos emite `change`.  
Um elemento [só de leitura](../erd-editor-element.md#readonly) nunca emite `change`, pelo que deve guardar a partir de um que não seja só de leitura, ou ler `value` de um armazenamento par ligado, que aplica as edições da sala à medida que chegam.  
Um [replicationStore](./remote-storage.md) não pode ser ligado, porque lhe faltam os métodos de que uma ligação precisa, e um alimentado a partir do armazenamento partilhado de um elemento ligado perde as edições da sala — consulte [Replicar um editor em execução](./remote-storage.md#replicating-a-live-editor).

O formato é privado e pode mudar com [ERD_YJS_FORMAT](#exports).  
Leia uma sala apenas através de uma ligação e deixe os nomes `erd:` e o campo `erd` do Awareness para ela.

## Compactar uma sala {#compacting-a-room}

O histórico da sala cresce a cada edição, e cada cliente que entra reprodu-lo todo, até algo o compactar.  
`bindPeerStore` liga um armazenamento par headless de `@dineug/erd-editor/peer.js` e devolve um `ErdYjsPeerBinding`: os mesmos [seed](#seed), [on](#erdyjsbinding) e [destroy](#destroy), com [compact](#compact).  
Um armazenamento par ligado num processo Node ao lado do servidor, um sidecar, compacta o histórico num instantâneo do seu próprio diagrama.  
A ligação de um elemento nunca compacta, e um armazenamento par ligado sem `compactAfter` e sem chamada a `compact()` é um par headless normal.

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

O armazenamento par continua a ser seu: a ligação nunca o destrói. A sua alcunha é a que foi dada a `createPeerStore`, e `presence: false` impede-o de enviar um foco próprio.

Uma compactação escreve o instantâneo a partir do valor em tempo de execução, dos registos e da versão do próprio armazenamento par, e elimina as entradas do registo que cobre e todas as entradas de outra inicialização, tudo numa só transação.  
Os clientes que aplicaram tudo veem as entradas desaparecer; um cliente que não o tinha feito volta a abrir-se sobre o instantâneo (consulte [Edições offline e novas entradas](#offline-edits-and-rejoins)).  
Cada compactação reescreve o diagrama inteiro no instantâneo, pelo que cada uma envia a todos os clientes uma atualização com aproximadamente o tamanho do JSON do valor em tempo de execução do diagrama e dos registos em conjunto, por poucas que sejam as entradas que leva. Defina `compactAfter` alto o suficiente para que as entradas que uma compactação leva pesem mais do que uma cópia do diagrama.

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

| Opção | Predefinição | Descrição |
| --- | --- | --- |
| `awareness` | Nenhuma | Mostra o armazenamento par no Awareness da sala, como [awareness](#awareness) faz a um elemento. Um compactador que compacta por iniciativa própria fica aí marcado, para que os compactadores que se veem uns aos outros elejam um para compactar, e um que não vê nenhum outro cliente não compacta nada por iniciativa própria — consulte [Um compactador por sala](#one-compactor-per-room). Sem ela, um compactador compacta por iniciativa própria, sem eleição e sem tolerância. |
| `compactAfter` | Nenhuma | Compacta por iniciativa própria quando o registo contém este número de entradas que uma compactação levaria. Sem ela, ou sem `synced`, só `compact()` compacta, e a compactação que repõe (consulte [Um compactador por sala](#one-compactor-per-room)). |
| `synced` | Nenhuma | Uma Promise que é resolvida quando o fornecedor sincroniza. Nenhuma compactação vem antes dela, incluindo `compact()`. Sem ela, nada compacta por iniciativa própria e `compact()` compacta de imediato. |
| `electionGraceMs` | `3000` | Com `awareness`, quanto tempo o compactador observa a sala antes de compactar por iniciativa própria, depois de `synced` e de novo sempre que outros clientes aparecem depois de nenhum ter aparecido. |
| `retainMs` | `600000` (dez minutos) | Quanto tempo as entradas de uma compactação ficam retidas para serem repostas (consulte [Um compactador por sala](#one-compactor-per-room)), contado a partir da primeira atualização que a sala envia depois da compactação. |

Uma opção inválida, ou um `synced` que é rejeitado, emite [error](#onerror).

### compact {#compact}

```ts
type CompactResult =
  | { compacted: true; generation: number }
  | {
      compacted: false;
      reason: 'not-synced' | 'no-snapshot' | 'destroyed';
    };
```

Compacta de imediato, sem eleição, tolerância nem limiar.  
Primeiro incorpora o instantâneo atual da sala, incluindo uma nova entrada, e envia o que o seu armazenamento par ainda retém.  
Responde `{ compacted: true, generation }`, em que `generation` conta as compactações do instantâneo: `0` para uma inicialização, mais uma por compactação.  
Caso contrário, responde `{ compacted: false, reason }`:

- `'destroyed'` quando a ligação foi destruída ou parou, e numa ligação [recusada](#onerror) no momento da ligação, mesmo antes de `synced` ser resolvido;
- `'not-synced'` antes de `synced` ser resolvido;
- `'no-snapshot'` numa sala que nenhum cliente inicializou.

```js
const result = binding.compact();
if (!result.compacted) console.warn(result.reason);
```

## Um compactador por sala {#one-compactor-per-room}

Execute exatamente um compactador por sala e só inicie um novo depois de o antigo ter parado. Nada o impõe.  
Entre compactadores que se veem uns aos outros no Awareness, só o que tem o menor id de cliente do Yjs compacta por iniciativa própria e, quando sai, ou o seu `synced` é rejeitado, o seguinte assume de imediato.  
Um compactador cujo Awareness não mostra nenhum outro cliente, como quando o seu próprio socket se fecha e os descarta a todos, não compacta nada por iniciativa própria até os outros voltarem a aparecer e ele ter observado a sala durante `electionGraceMs`.

Dois compactadores isolados um do outro, ou um reinício cujo antecessor ainda está em execução, podem ainda assim compactar ambos.  
A sala fica então com um dos dois instantâneos, e o compactador cujo instantâneo perdeu repõe o que compactou e o vencedor não contém, enquanto o retiver: `retainMs`, e no máximo as suas últimas 1000 entradas, por grandes que sejam.  
Assim, nada se perde quando o compactador cujo instantâneo perde é o que volta a ligar-se, desde que não tenha compactado mais de 1000 entradas enquanto esteve separado.  
Quando é o que ficou em linha e a sua retenção expirou, o instantâneo e o histórico da sala não têm o que ele compactou até voltar a compactar. Um cliente que perdeu essas edições, ou um que entra entretanto, não as tem, e retém as edições posteriores de cada autor cujas edições o compactador compactou. A compactação seguinte do compactador devolve-as todas, a menos que o instantâneo vencedor contivesse edições que lhe faltavam, o que o volta a abrir sobre esse instantâneo e perde para sempre o que compactou.

Um compactador repõe numa compactação própria, feita depois de ter alcançado o instantâneo vencedor, sem eleição, tolerância nem limiar, e todos os clientes voltam a abrir-se sobre essa compactação com `rejoin('snapshot')`.  
As edições que repõe não chegam a nenhum cliente fora dessa compactação, pelo que um cliente que esteve em linha o tempo todo termina igual aos outros e a um que entre mais tarde, mesmo quando uma edição posterior de outro autor se apoia numa delas, como a mudança do nome de uma tabela que outro cliente adicionou.  
Cada reposição custa a todos os clientes essa nova entrada, com [o que uma nova entrada perde](#offline-edits-and-rejoins). Quando dois compactadores repõem ao mesmo tempo, todos os clientes terminam ainda assim iguais, embora uma edição possa ficar aplicada antes daquela em que se apoia.  
Uma ligação destruída ou parada antes de essa compactação ocorrer, como quando um listener de `rejoin` a destrói, repõe as edições por si. Nenhuma se perde, mas então um cliente que esteve em linha o tempo todo pode aplicar uma depois da edição de outro autor que se apoia nela, e terminar diferente de um que entre mais tarde.

## Limites {#limits}

- **A área visível fica em cada ecrã.** As deslocações, os zooms e as mudanças de separador [nunca são registados](#what-the-room-holds), embora uma sessão montada através de `getSharedStore` os envie (também lá não movem a vista nem o separador de nenhum outro utilizador). Cada leitor conserva os seus, e a ligação só os mostra no seu estado do Awareness, que nada lê ainda. Com o [bloqueio](../../guide/guides/settings.md#lock) `Viewport` ou `Canvas Type` desativado, o `value` de cada cliente guarda os seus; sob os bloqueios, que um documento novo tem ativados, todos os clientes guardam o bloqueado.
- **O instantâneo cresce uma entrada por ligação.** Guarda, para cada ligação que alguma vez escreveu na sala, até que ponto as suas edições estão compactadas, e nunca elimina nenhuma. Uma ligação feita de novo, ou uma que passou para outra inicialização, conta de novo, e o mesmo acontece a cada compactação que repõe. Uma entrada é um id de 32 caracteres e um número, pelo que dez mil sessões de escrita acrescentam algumas centenas de quilobytes a cada instantâneo e a cada compactação.
- **Um hub e uma sala não retransmitem nada entre si.** Um elemento ligado a uma sala e ao [hub](../../mcp/live-and-headless.md#live) de um agente de programação, ou a qualquer outro transporte através de `getSharedStore()`, aplica as edições de ambos, mas nenhum ouve as do outro, já que um armazenamento partilhado nunca reenvia o que recebeu.
- **As adições feitas ao mesmo tempo podem ficar listadas por outra ordem.** As tabelas ou notas que dois clientes adicionam ao mesmo tempo podem ficar numa ordem diferente no diagrama de cada cliente, como numa sessão montada através de `getSharedStore` — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).
- **As cores e algumas outras alterações feitas ao mesmo tempo podem terminar diferentes.** Uma mudança de cor é registada sem versão, e cada cliente marca-a com a sua própria ao aplicá-la. Duas mudanças de cor de uma tabela, nota ou grupo de tabelas feitas ao mesmo tempo podem, por isso, deixar os clientes, e um cliente que entra mais tarde e reproduz o registo, com cores diferentes. O mesmo acontece com as outras alterações que cada cliente aplica pela ordem em que as ouve, como dois movimentos de colunas dentro de uma tabela ou de um índice, ou duas mudanças da base de dados — consulte [Edições simultâneas](./collaborative-editing.md#concurrent-edits).
- **Um cursor que sai espera pelo servidor.** A ligação limpa o cursor de um par assim que o Awareness o descarta. Um servidor que, quando um socket se fecha, remove apenas os estados do Awareness que esse socket adicionou em primeiro lugar mantém, depois de sair, um cliente que se tinha voltado a ligar nos ecrãs dos outros, até o Awareness o dar como expirado, 30 segundos depois. Um que remove todos os estados que um socket escreveu por último, uma atualização tanto como uma adição, limpa-o de imediato.

## Exportações {#exports}

| Exportação | Descrição |
| --- | --- |
| `bindErdEditor(editor, doc, options?)` | Liga um elemento `<erd-editor>` — consulte [Utilização](#usage). Devolve um [ErdYjsBinding](#erdyjsbinding). |
| `bindPeerStore(peer, doc, options?)` | Liga um armazenamento par de `@dineug/erd-editor/peer.js` — consulte [Compactar uma sala](#compacting-a-room). Devolve o mesmo com [compact](#compact) (`ErdYjsPeerBinding`). |
| `ERD_YJS_FORMAT` | O formato do `Y.Doc` que esta versão escreve, `1`; uma ligação recusa uma sala escrita noutro. |

Tipos: `BindOptions`, `PeerBindOptions`, `CompactOptions`, `CompactResult`, `BindingEvents`, `RejoinReason`, `ErdYjsBinding`, `ErdYjsPeerBinding`.
