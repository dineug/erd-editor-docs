---
sidebar_position: 1
description: Instalar o @dineug/erd-editor a partir do npm ou de uma CDN, registar os elementos do editor e do visualizador, ligar as caixas de diálogo de ficheiros e atualizar a partir da 4.x ou da 3.x.
---

# Instalação

```sh
npm install @dineug/erd-editor
```

O pacote é exclusivamente ESM (`"type": "module"`) e distribui apenas a sua pasta `dist`.
Não existe uma compilação CommonJS, pelo que `require('@dineug/erd-editor')` não funciona.

Contém dois elementos personalizados: `<erd-editor>`, o editor, e, a partir da `5.0.0`, `<erd-viewer>`, que mostra um diagrama só para leitura — consulte [ErdViewerElement](./erd-viewer-element.md).
A partir da `5.0.0`, importar a raiz do pacote não define nenhum dos dois. Cada elemento tem uma entrada própria que o define — consulte [Registar os elementos](#registering-the-elements).

As suas dependências de tempo de execução ficam externas, como importações simples que o seu bundler resolve, desduplica e às quais aplica tree-shaking. A partir da `5.0.0`, a sua pasta `dist` contém um ficheiro por módulo, pelo que um bundler mantém apenas os módulos que uma página alcança — consulte [Pontos de entrada](#entry-points).
Os seus workers partilhados são gerados como ficheiros de entrada separados em `dist/workers/` e construídos com `new URL('./…', import.meta.url)`, a forma de escrita que o Vite, o webpack 5 e o Rspack empacotam como entrada de worker. Consulte [Web Workers](#web-workers).
Para uma página sem bundler por trás, existem duas compilações autónomas — consulte [Etiqueta script](#script-tag).

## Utilização {#usage}

```js
import '@dineug/erd-editor/erd-editor.js';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

`@dineug/erd-editor/erd-editor.js` define `<erd-editor>` ao ser importado. Uma página que apenas mostra um diagrama importa antes `@dineug/erd-editor/erd-viewer.js` — consulte [ErdViewerElement](./erd-viewer-element.md).

`<erd-editor>` não tem tamanho intrínseco. Atribua-lhe (ou ao seu contentor) uma largura e uma altura explícitas.
A partir da `4.1.0`, um [explorador](../guide/guides/explorer.md) aberto fica ancorado dentro do elemento, à esquerda da tela ERD, e torna a tela mais estreita em vez de a cobrir. Um editor novo começa com ele fechado.
O painel nunca é desenhado com menos de `200px` e deixa à tela pelo menos `320px`, pelo que, num elemento mais estreito do que `520px`, um explorador aberto não é desenhado até que o elemento se alargue — consulte [Ao lado da tela](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` inicia um documento novo e vazio. Atribuir `value`, pelo contrário, carrega um documento como uma edição, pelo que este fica no histórico de anulação.
A partir da `4.0.0`, `editor.value` é o documento na forma que um ficheiro contém, que é o que deve ser guardado. `editor.runtimeValue` é o documento tal como o editor o mantém, incluindo as entidades removidas: inicializa um colaborador e nunca vai para um ficheiro — consulte [runtimeValue](./erd-editor-element.md#runtimevalue).
A partir da `4.0.0`, um documento novo tem também todos os [bloqueios de definições](../guide/guides/settings.md#lock) ativados: a área visível, o separador, a linguagem do Gerador de código, ambos os formatos dos nomes, o tipo de delimitador e, a partir da `4.2.0`, a [vista de nomes](../guide/guides/logical-names.md#name-view). Deslocar a vista, fazer zoom, mudar de separador, mudar a vista de nomes ou alterar uma das outras definições deixa `editor.value` como estava e não dispara nenhum `change`. Um documento carregado a partir de texto mantém os bloqueios que indica. Um que não indique nenhum, como qualquer ficheiro guardado antes da `4.0.0`, abre com todos os bloqueios ativados, com o zoom a 100% e no separador ERD, independentemente da área visível e do separador que tenha guardado. A sua área visível fica bloqueada na origem `0, 0` e, se nenhuma parte do diagrama estiver desenhada aí, a vista abre, em vez disso, sobre o diagrama — consulte [setInitialValue](./erd-editor-element.md#setinitialvalue).
Um ficheiro guardado antes da `4.2.0` abre com a vista de nomes bloqueada em `Physical Names`, mesmo que tenha todos os outros bloqueios desativados. Um editor da `4.0.0` ou da `4.1.0` mantém o bloqueio da vista de nomes tal como está ao guardar, mas descarta a vista, pelo que um ficheiro da `4.2.0` guardado com a vista de nomes desbloqueada continua desbloqueado, mas volta a abrir-se na vista `Physical Names`.
Consulte [ErdEditorElement](./erd-editor-element.md) para o resto da API.

### CDN {#cdn}

```html
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js"></script>
```

O `esm.run` encarrega-se de resolver as dependências externas do pacote, pelo que isto funciona sem bundler.
Cada entrada é alcançada pelo seu caminho depois da versão: `…/erd-editor.js` define o editor e `…/erd-viewer.js` o visualizador, que vai buscar à CDN cada idioma de apresentação exceto o inglês quando uma página o pede. O URL simples do pacote, `https://esm.run/@dineug/erd-editor@5.0.0`, serve a raiz, que não define nenhum elemento.
Um URL sem versão serve sempre a versão mais recente. Fixe uma versão, como acima, se não quiser que uma atualização de versão principal chegue à sua página sem aviso.
A própria `5.0.0` é uma delas: uma página que tenha de se manter na 4.x fixa `@4.2.0` — consulte [Atualizar a partir da 4.x](#upgrading-from-4x).

O `esm.run` serve os workers partilhados a partir de `cdn.jsdelivr.net`, e um navegador não inicia nenhum worker partilhado a partir de uma origem diferente da da página. Assim, um editor carregado desta forma funciona sem os seus workers, como num host que os bloqueia — consulte [Web Workers](#web-workers). A compilação da [etiqueta script](#script-tag) leva-os dentro do seu ficheiro.

### Etiqueta script {#script-tag}

A partir da `3.6.0`, o pacote distribui também uma compilação UMD com todas as dependências e todos os workers partilhados dentro de um único ficheiro, `dist/erd-editor.umd.js`.
É para ela que apontam os campos `unpkg` e `jsdelivr`, pelo que o URL simples do pacote em qualquer uma das duas CDN a serve, e esta define `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Carregá-la define `<erd-editor>`. `window.ErdEditor` contém os dois callbacks de ficheiros, `ErdEditor.setExportFileCallback` e `ErdEditor.setImportFileCallback`, a partir da `3.9.2` `ErdEditor.createKeyBindingMap`, a partir da `4.2.0` `ErdEditor.dictionaryRowChords` — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords) — e, a partir da `5.0.0`, `ErdEditor.ErdEditorElement` e `ErdEditor.defineErdEditor` — consulte [Registar os elementos](#registering-the-elements). Não contém [toImage](./to-image.md).

A partir da `5.0.0`, um segundo ficheiro, `dist/erd-viewer.umd.js`, define `<erd-viewer>` e coloca `ErdViewerElement` e `defineErdViewer` em `window.ErdViewer`. Não inicia nenhum worker, contém os 25 idiomas de apresentação e não pede nada além do `src` que recebe.

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

Nenhum dos ficheiros define a etiqueta do outro, e cada um não deixa na página nenhuma global além da sua e de `window.Konva`.
O mapa de exportações continua a encaminhar um bundler para os módulos ES, pelo que uma instalação a partir do npm nunca recorre a nenhum destes ficheiros.
Uma página que não consiga carregar um script próprio pode, em alternativa, incorporar numa moldura o visualizador alojado em erd-editor.io/embed — consulte [Incorporar](../guide/guides/embedding.md).

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js';

  const editor = document.querySelector('erd-editor');
</script>
```

```css
erd-editor {
  display: block;
  width: 100%;
  height: 100vh;
}
```

A partir da `4.0.0`, o atributo `enable-locale-picker` adiciona o seletor `Display Language` da barra de ferramentas, e o `enable-welcome-screen`, o ecrã de boas-vindas que um diagrama vazio mostra — consulte [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) e [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Uma página que carrega um documento, como em [Utilização](#usage), ativa `enableWelcomeScreen` depois de `setInitialValue()` o ter carregado, e não na marcação, para que o ecrã nunca apareça por instantes sobre um ficheiro que ainda está a carregar.
O editor inclui todos os 25 idiomas de apresentação, tanto na compilação ES como na compilação da etiqueta script, pelo que não há nenhum ficheiro de localização a servir nem nada a registar. Sem o seletor e sem uma chamada a `setLocale()`, o editor é apresentado em inglês.

Adicionar `readonly` aqui abre o editor como um leitor: atribuir `value`, chamar `clear()` e todas as chamadas `setSchema*()` — incluindo `setSchemaJSON()` e uma adição — são ignorados, e o evento `change` nunca é disparado. Os seus separadores, o explorador e a Pesquisa rápida continuam disponíveis para leitura, e todos os controlos que editariam o diagrama desaparecem.
Ler `editor.value` e `editor.runtimeValue` continua a funcionar, e ambos mantêm as definições do próprio documento: uma definição de vista que o leitor altere, como o zoom ou a base de dados, fica no ecrã desse editor. Para carregar, use antes `setInitialValue()` — consulte [readonly](./erd-editor-element.md#readonly).

### Renderização do lado do servidor {#server-side-rendering}

Todas as entradas exceto `engine.js` e `peer.js` precisam de um DOM, pelo que geram uma exceção no Node. `erd-editor.js` e `erd-viewer.js` definem o seu elemento no âmbito do módulo, e a raiz do pacote, que a partir da `5.0.0` não define nada, continua a construir as duas classes de elemento ao ser carregada.
No Next.js, Nuxt, SvelteKit ou Astro, alcance a entrada do elemento a partir de um caminho executado apenas no cliente, e uma importação nomeada da raiz, como `setExportFileCallback` ou `toImage`, a partir do mesmo caminho.

```js
useEffect(() => {
  import('@dineug/erd-editor/erd-editor.js');
}, []);
```

### Vite {#vite}

Em desenvolvimento, acrescente ao pré-empacotamento do Vite o bundle do ELK que o worker de disposição do editor importa, ou as disposições que esse worker faz falham: o `Flow`, o `Tree - vertical` e o `Tree - horizontal` da disposição automática, o modo Flow do separador Visualização e uma importação posicionada pelo Flow.
O Vite 7 e anteriores precisam também de que o editor fique fora do pré-empacotamento, já que o seu pré-bundle aponta os URLs dos workers para ficheiros que nunca escreve, pelo que os três workers falham. No Vite 8, deixe de fora este `exclude`, que apenas faz o servidor de desenvolvimento ir buscar cada ficheiro do pacote por si só. Uma compilação de produção não precisa de nenhum dos dois.

```js
// vite.config.js
export default {
  optimizeDeps: {
    include: ['@dineug/erd-editor > elkjs/lib/elk.bundled.js'],
    // Vite 7 and older only:
    // exclude: ['@dineug/erd-editor'],
  },
};
```

### TypeScript {#typescript}

Importar `@dineug/erd-editor/erd-editor.js` funde `erd-editor` em `HTMLElementTagNameMap`, e `@dineug/erd-editor/erd-viewer.js` funde `erd-viewer`, pelo que o elemento fica tipado sem conversão de tipo. Qualquer importação da raiz, mesmo só de um tipo, traz os dois.

```ts
import '@dineug/erd-editor/erd-editor.js';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` é exportado para anotar as suas próprias variáveis e props. A partir da `5.0.0`, é também a classe do elemento, e `ErdViewerElement` é a interface e a classe do visualizador — consulte [Registar os elementos](#registering-the-elements).
A partir da `4.0.0`, o pacote exporta também os tipos `LocaleCode`, `LocaleOption` e `SchemaSQLOptions` e, a partir da `5.0.0`, `ToImageOptions` — consulte [Pontos de entrada](#entry-points). As opções que os métodos `setSchema*()` recebem não têm nome exportado; obtenha-as a partir do elemento, como `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.
A partir da `5.0.0`, os `typesVersions` do pacote tipam também cada entrada de subcaminho com `moduleResolution: "node10"`, que não lê nenhum mapa de exportações.

## Registar os elementos {#registering-the-elements}

A partir da `5.0.0`, o pacote só define uma etiqueta onde uma página lho pede.

| Importação | Define |
| --- | --- |
| `@dineug/erd-editor/erd-editor.js` | `<erd-editor>` |
| `@dineug/erd-editor/erd-viewer.js` | `<erd-viewer>` |
| `@dineug/erd-editor` | Nada |

Cada uma das duas entradas define a sua etiqueta ao ser avaliada e não exporta nada, pelo que se importa pelo seu efeito, e nenhuma define a etiqueta da outra.
A raiz exporta as duas classes de elemento, `ErdEditorElement` e `ErdViewerElement`, e `defineErdEditor()` e `defineErdViewer()`, que definem a sua etiqueta onde as chamar:

```js
import { defineErdEditor } from '@dineug/erd-editor';

defineErdEditor();
```

Uma chamada não faz nada enquanto a etiqueta já tiver essa classe, pelo que uma entrada e uma chamada de definição, ou duas chamadas de definição, podem coincidir numa página. Gera um `Error` com o nome da etiqueta quando outra classe a tem, como aconteceria com uma segunda cópia do pacote empacotada na mesma página: `Another element class already defines the custom element name erd-editor`.
As classes da raiz são as que as entradas definem, pelo que `customElements.get('erd-editor') === ErdEditorElement` depois de qualquer uma ter sido executada. Enquanto a etiqueta não está definida, `document.createElement('erd-editor')` cria um `HTMLElement` simples sem nenhum dos membros do editor, e `new ErdEditorElement()` gera uma exceção.

Para uma etiqueta sua, defina a classe sob ela e acrescente a etiqueta a `HTMLElementTagNameMap` por si. Faça-o numa janela que não carregue a entrada desse elemento nem a respetiva compilação da [etiqueta script](#script-tag) e não chame nenhuma função de definição para ele, uma vez que uma classe recebe um só nome por janela:

```ts
import { ErdEditorElement } from '@dineug/erd-editor';

customElements.define('my-erd-editor', ErdEditorElement);

declare global {
  interface HTMLElementTagNameMap {
    'my-erd-editor': ErdEditorElement;
  }
}
```

Um bundle que contenha os dois elementos faz o Vite e o Rolldown avisarem de um `INEFFECTIVE_DYNAMIC_IMPORT` uma vez por cada idioma de apresentação exceto o inglês. O visualizador carrega cada um deles com um `import()` próprio, e o editor importa todos os dicionários de uma só vez, pelo que ficam no chunk do editor e carregam com ele. Nada falha, e um bundle só com o visualizador mantém cada idioma num chunk próprio.

## Realce de sintaxe {#syntax-highlighting}

Os painéis Esquema SQL e Gerador de código são realçados pelo [Shiki](https://shiki.style), num worker partilhado próprio, e, a partir da `4.0.0`, também o são os scripts `Before tables` e `After tables` do separador Esquema SQL.
A partir da `3.7.0`, não há nada a instalar nem nada a registar: o worker é criado da primeira vez que um painel de código é renderizado, pelo que uma página que não abra nenhum nunca transfere as gramáticas.

| | |
| --- | --- |
| Linguagens | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temas | `github-dark` e `github-light`, consoante o aspeto claro ou escuro do editor |

São exatamente as linguagens que os painéis geram: `JPA` é realçado como Java, `SQLAlchemy` como Python, `TypeORM`, `Sequelize`, `Drizzle` e `Zod` como TypeScript, `Doctrine` como PHP, `SeaORM` como Rust, `JSON Schema` como JSON, e `DBML` e `AML` como SQL, a gramática mais próxima entre as incluídas — consulte [Gerador de código](../guide/guides/code-generator.md).

O motor de expressões regulares é JavaScript puro, pelo que nenhuma política do host precisa de `wasm-unsafe-eval`.
Onde `SharedWorker` não existe — Chrome no Android anterior ao Chrome 148, Safari anterior à 16.4 — a falha é registada e o código aparece como texto simples; os scripts continuam a poder ser editados.

Ao atualizar a partir da `3.6.0` ou anterior: `@dineug/erd-editor-shiki-worker` deixou de ser publicado, e `setGetShikiServiceCallback` desapareceu com ele.
Retire a instalação e o registo; uma página que carregava o worker a partir de uma CDN retira também essa segunda etiqueta `<script>`.

## Web Workers {#web-workers}

O editor executa três tarefas em `SharedWorker`s: o realce de sintaxe, a exportação de imagem e a disposição das tabelas por trás da [disposição automática](../guide/guides/table-related-functions.md#auto-layout), do [modo Flow](../guide/guides/visualization.md#how-flow-is-placed) do separador Visualização e, a partir da `4.0.0`, do posicionamento de um esquema importado.
Os três vêm incluídos em `@dineug/erd-editor`. Nenhum deles é algo que tenha de configurar, mas cada um é algo que um host pode bloquear.
A partir da `5.0.0`, cada worker é construído num módulo próprio, pelo que um bundle leva apenas os workers que os seus módulos alcançam: um bundle de [toImage](./to-image.md) e de nenhum elemento leva só o worker de exportação de imagem, e o `<erd-viewer>` não inicia nenhum worker — consulte [Pontos de entrada](#entry-points).
O worker que executava a recolha de lixo do documento foi removido na `4.0.0`, juntamente com a própria recolha.

| Worker | Sem ele |
| --- | --- |
| Realce de sintaxe | Os painéis Esquema SQL e Gerador de código e os scripts do Esquema SQL ficam em texto simples |
| Exportação de imagem | O PNG, o SVG, o botão `Copy to clipboard` e a pré-visualização da caixa de diálogo `Export image` e, a partir da `5.0.0`, [toImage()](./to-image.md) são desenhados na thread principal, o que bloqueia a página enquanto está a desenhar |
| Disposição das tabelas | As disposições `Flow`, `Tree - vertical` e `Tree - horizontal` da disposição automática e o modo Flow do separador Visualização terminam em `Could not place tables`; uma importação posicionada pelo Flow — um ficheiro SQL, GraphQL, DBML ou AML a partir de `Import` ou de `Import and Add`, ou uma chamada `setSchema*()` com `placement: 'auto'` — coloca as suas tabelas em linhas, sem qualquer mensagem; `Force` e o modo Graph não são afetados, uma vez que são executados dentro do editor |

A exportação de imagem espera dez segundos pela resposta do seu worker e depois desenha na thread principal, e o realce de sintaxe deixa o código em texto simples assim que o seu worker falha, pelo que um host que bloqueie workers custa desempenho, e não funcionalidade.
A disposição das tabelas é a exceção: o motor que calcula uma disposição pesa mais do que o próprio editor e nunca é carregado no mesmo processo, pelo que espera trinta segundos pelo seu worker no primeiro posicionamento e, depois de o worker ter respondido, dá a uma disposição sessenta segundos para ser devolvida.
Se qualquer uma das esperas se esgotar, o posicionamento termina como terminaria sem o worker. A disposição automática mostra `Placing tables` assim que começa, enquanto o modo Flow e uma importação posicionada pelo Flow só o mostram quando um posicionamento, incluindo o arranque do seu worker, já decorre há seis segundos.

O Vite, o webpack 5 e o Rspack geram os workers como ficheiros ao lado dos seus chunks. O esbuild, e o Rolldown usado por si só em vez de através do Vite, não geram nenhum, pelo que uma página que eles construam funciona sem os workers.
Com o `experiments.outputModule` experimental do webpack, nenhum worker arranca, uma vez que cada um espera por um chunk separado dele que nada carrega. Mantenha a saída predefinida do webpack ou defina `optimization.splitChunks: false`.

### Content Security Policy {#content-security-policy}

Uma página sob uma Content Security Policy restrita precisa destas diretivas para os elementos:

- `worker-src 'self'` para a compilação empacotada, cujos workers são ficheiros ao lado do pacote, mais `blob:` onde o seu bundler incorpora um worker em linha. Na compilação da [etiqueta script](#script-tag), os três viajam dentro do ficheiro como URLs `data:`, pelo que essa página precisa, em vez disso, de `worker-src data:`. O `<erd-viewer>` não precisa de nenhuma, uma vez que não inicia nenhum worker.
- A partir da `5.0.0`, os dois elementos aplicam o seu próprio estilo com folhas de estilo construídas, que o `style-src 'self'` deixa passar. Os painéis de código do editor continuam a colorir o texto com atributos `style`, e a pré-visualização da caixa de diálogo `Export image` é uma imagem num URL `blob:`, pelo que o editor precisa também de `style-src 'unsafe-inline'` e `img-src blob:` para eles.
- Um navegador sem folhas de estilo construídas, como o Firefox anterior à 101, recebe em vez disso elementos `<style>`, que precisam de `style-src 'unsafe-inline'` para qualquer um dos elementos.
- O `<erd-viewer>` vai buscar o seu `src`, pelo que essa origem entra em `connect-src` — consulte [O que acrescenta a uma página](./erd-viewer-element.md#what-it-adds-to-a-page).

## Pontos de entrada {#entry-points}

O pacote tem cinco entradas:

| Entrada | O que é |
| --- | --- |
| `@dineug/erd-editor` | A raiz: as exportações abaixo. A partir da `5.0.0` não define nenhum elemento, embora continue a precisar de um DOM para carregar |
| `@dineug/erd-editor/erd-editor.js` | A partir da `5.0.0`. Define `<erd-editor>` e não exporta nada |
| `@dineug/erd-editor/erd-viewer.js` | A partir da `5.0.0`. Define `<erd-viewer>` e não exporta nada |
| `@dineug/erd-editor/engine.js` | O armazenamento do documento sem DOM |
| `@dineug/erd-editor/peer.js` | A partir da `3.9.1`. O par headless do servidor MCP |

A raiz exporta as duas classes de elemento e as suas funções de definição, dois setters de callback, a partir da `3.9.2` as combinações de teclas predefinidas com os respetivos tipos, a partir da `4.0.0` os tipos de idioma de apresentação e o tipo das opções de `getSchemaSQL()`, a partir da `4.2.0` as combinações de teclas de linha do separador Dicionário e, a partir da `5.0.0`, `toImage`.

| Exportação | Descrição |
| --- | --- |
| `ErdEditorElement` | A interface do elemento — consulte [ErdEditorElement](./erd-editor-element.md). A partir da `5.0.0`, também a sua classe, aquela com que `<erd-editor>` é definido — consulte [Registar os elementos](#registering-the-elements). |
| `ErdViewerElement` | A partir da `5.0.0`. A interface e a classe do visualizador — consulte [ErdViewerElement](./erd-viewer-element.md). |
| `defineErdEditor()`, `defineErdViewer()` | A partir da `5.0.0`. Definem `<erd-editor>` ou `<erd-viewer>` como a sua classe. Uma chamada não faz nada enquanto a etiqueta tiver essa classe e gera um `Error` quando outra classe a tem — consulte [Registar os elementos](#registering-the-elements). |
| `toImage(value, options)` | A partir da `5.0.0`. Desenha um documento como um `Blob` PNG ou uma cadeia SVG, com as opções da caixa de diálogo `Export image` — consulte [toImage](./to-image.md). |
| `ToImageOptions` (tipo) | A partir da `5.0.0`. As opções que `toImage()` recebe: `format`, `background`, `darkMode` e `scale`. |
| `setExportFileCallback(cb)` | Substitui a transferência do navegador, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Substitui o seletor de ficheiros do navegador, `({ type, op, accept, mode }) => void`; `mode` a partir da `4.0.0`. A partir da `4.2.0`, o botão `Import CSV` do separador Dicionário abre o seletor do navegador mesmo com um callback definido — consulte [Caixas de diálogo de ficheiros](#file-dialogs). |
| `createKeyBindingMap()` | Devolve as combinações de teclas predefinidas como um novo `KeyBindingMap` a cada chamada — consulte [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipos) | Um mapa de associações, a união dos nomes dos seus comandos e uma associação. |
| `dictionaryRowChords(map)` | A partir da `4.2.0`. Devolve, como um novo `ShortcutOption[]` a cada chamada, as combinações com que a grelha do separador [Dicionário](../guide/guides/dictionary.md#adding-and-deleting-rows) insere e elimina linhas segundo o `KeyBindingMap` que passar. A que insere linhas acima, `Alt+Shift+Enter` com as predefinições, não está em nenhuma associação — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipos) | A partir da `4.0.0`. Os 25 códigos de idioma de apresentação e esses códigos mais `'system'`, que `setLocale()` recebe — consulte [Idioma de apresentação](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | A partir da `4.0.0`. As opções que `getSchemaSQL()` recebe: `statements`, `header` e, a partir da `4.2.0`, `logicalNameAsComment` — consulte [getSchemaSQL](./erd-editor-element.md#getschemasql). |

A partir da `5.0.0`, a pasta `dist` contém um ficheiro sem minificação por módulo, cada um ao lado da sua declaração, e o `sideEffects` do `package.json` nomeia apenas as duas entradas de etiqueta e dois stubs de que os ficheiros de worker precisam. Assim, um bundler deixa cair todos os módulos que uma página não alcança e minifica uma só vez:

- Uma importação nomeada da raiz, como `setExportFileCallback`, não empacota nenhum elemento nem nenhum worker.
- `toImage` traz o worker de exportação de imagem e nenhum elemento.
- `erd-editor.js` traz o editor e os três workers partilhados.
- `erd-viewer.js` traz o visualizador e nenhum worker, com o inglês dentro dele e cada um dos outros idiomas de apresentação num chunk próprio, carregado quando uma página o pede.

`@dineug/erd-editor/engine.js` executa o armazenamento do documento sem DOM, pelo que funciona num Web Worker — consulte [Armazenamento remoto](./advanced/remote-storage.md).
Exporta `createReplicationStore` e o tipo `ReplicationStore`. A partir da `3.10.0`, exporta também o tipo `ReplicationChange`, `{ value: string; changed: boolean }`, que o listener de `change` de uma réplica recebe — consulte [on@change](./advanced/remote-storage.md#onchange).
A partir da `4.0.0`, um `ReplicationStore` tem também um `runtimeValue`. O seu `value` e o que um `change` entrega são a forma de armazenamento que um ficheiro contém, tal como os do elemento — consulte [ReplicationStore](./advanced/remote-storage.md#replicationstore).

`@dineug/erd-editor/peer.js` é o par headless através do qual o [servidor MCP](../mcp/introduction.md) edita um documento. Existe para esse servidor, e estas páginas não o documentam.

### Caixas de diálogo de ficheiros {#file-dialogs}

A importação e a exportação passam por callbacks injetáveis, pelo que um host sem caixa de diálogo de ficheiros do navegador — uma webview de um IDE, por exemplo — pode fornecer a sua própria.
As duas não são simétricas: a exportação entrega-lhe o ficheiro pronto, enquanto a importação apenas pede um, e cabe-lhe a si voltar a introduzir o conteúdo.
A partir da `4.2.0`, o botão `Import CSV` do separador Dicionário é a única importação que nunca chama o callback de importação, cujo `type` não tem nenhum valor para CSV. Abre sempre o seletor de ficheiros do próprio navegador, para ficheiros `.csv` — consulte [Importar e exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` é `set` ou `diff` — um `diff` vai para `setDiffValue()`, seja qual for o `type`. Caso contrário, `type` escolhe o método, e `accept` contém as extensões desse tipo, prontas a passar a uma caixa de diálogo de ficheiros do host.
A partir da `4.0.0`, um `set` traz `mode: 'append'` quando o utilizador escolheu [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add), e nenhum `mode` numa importação simples. Transmita-o: um callback que o descarte substitui o diagrama ao qual o utilizador pediu para acrescentar a importação.

| `type` | `accept` | Método |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` dispõe as tabelas de acordo com as suas relações antes de serem colocadas, tal como faz a própria importação do editor, e faz com que a chamada devolva uma Promise. Sem ele, são colocadas em linhas de imediato — consulte [setSchemaSQL](./erd-editor-element.md#setschemasql) e [setSchemaJSON](./erd-editor-element.md#setschemajson).

```js
import { setExportFileCallback, setImportFileCallback } from '@dineug/erd-editor';

setExportFileCallback((blob, { fileName }) => host.writeFile(fileName, blob));

setImportFileCallback(async ({ type, op, accept, mode }) => {
  const text = await host.pickFile(accept);

  if (op === 'diff') {
    editor.setDiffValue(text);
  } else if (type === 'json') {
    editor.setSchemaJSON(text, { mode });
  } else if (type === 'sql') {
    editor.setSchemaSQL(text, { placement: 'auto', mode });
  } else if (type === 'graphql') {
    editor.setSchemaGraphQL(text, { placement: 'auto', mode });
  } else if (type === 'dbml') {
    editor.setSchemaDBML(text, { placement: 'auto', mode });
  } else if (type === 'aml') {
    editor.setSchemaAML(text, { placement: 'auto', mode });
  }
});
```

Encaminhe cada `type` que trata e ignore os restantes.
Um `setSchemaJSON()` de substituição, tal como atribuir `value`, limpa o documento antes de analisar o conteúdo, pelo que encaminhar para aí um conteúdo que não seja um documento `.erd.json` — através de um `else` genérico, ou porque um `type` adicionado mais tarde não foi tratado e foi lá parar — esvazia o diagrama em vez de importar o que quer que seja.

O `fileName` que o editor gera é `<database name>-<timestamp>` mais a extensão do ficheiro, em que o carimbo de data/hora é a hora local no formato `yyyy-MM-dd'T'HH_mm_ss`. Um nome da base de dados em branco é substituído por `unnamed`. Um CSV do separador Dicionário indica a respetiva folha antes da extensão, como em `<database name>-<timestamp>-words.csv`.
O callback de exportação recebe estes ficheiros. A partir da `4.0.0`, o SVG e os ficheiros do Gerador de código estão entre eles, e o `.sql` vem do botão `Save file` do separador Esquema SQL, e não diretamente do submenu `Export`. A partir da `4.2.0`, o CSV do separador Dicionário também está entre eles. [toImage()](./to-image.md) não chama nenhum dos callbacks: devolve-lhe a imagem.

| Ficheiro | Extensão | `type` do Blob |
| --- | --- | --- |
| A exportação JSON | `.erd.json` | `application/json` |
| O botão `Save file` do separador Esquema SQL, com o texto que o separador mostra — consulte [Esquema SQL](../guide/guides/schema-sql.md) | `.sql` | nenhum |
| A caixa de diálogo [Exportar imagem](../guide/guides/file-import-export.md#image) | `.png` ou `.svg` | `image/png` ou `image/svg+xml` |
| O botão `Save file` do separador Gerador de código — consulte [Gerador de código](../guide/guides/code-generator.md) | A da linguagem: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` ou `.mmd` | nenhum |
| O botão `Export CSV` do separador Dicionário, com todas as linhas da folha mostrada, independentemente das que a pesquisa lista — consulte [Importar e exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Um host que escolha a rotina de tratamento pela extensão precisa de uma para cada uma delas.

Se não forem definidos, o editor usa o comportamento próprio do navegador para a transferência e a seleção de ficheiros. Passe `null` para voltar a ele.

## Suporte de navegadores {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — a base de referência ES2022 para a qual os bundles publicados são compilados.
Não é incluído nenhum polyfill. Adicione os seus se precisar de suportar navegadores mais antigos.

## Atualizar a partir da 4.x {#upgrading-from-4x}

A `5.0.0` é uma versão principal. Verifique cada um destes pontos ao migrar uma página da 4.x:

- `import '@dineug/erd-editor'` já não define `<erd-editor>`. Importe antes `@dineug/erd-editor/erd-editor.js` pelo seu efeito, ou chame `defineErdEditor()`, e mantenha como estão as suas importações nomeadas da raiz. O TypeScript não assinala uma página que ficou com a importação simples, uma vez que as declarações da raiz continuam a nomear a etiqueta em `HTMLElementTagNameMap`, mas o elemento que ela cria é um `HTMLElement` simples, pelo que a sua primeira chamada de método gera um `TypeError` — consulte [Registar os elementos](#registering-the-elements).

  ```diff
  -import '@dineug/erd-editor';
  +import '@dineug/erd-editor/erd-editor.js';
   import { setExportFileCallback } from '@dineug/erd-editor';
  ```

- Numa CDN, o mesmo vale para `https://esm.run/@dineug/erd-editor`, que passa a servir a raiz e não define nada: importe `https://esm.run/@dineug/erd-editor@5.0.0/erd-editor.js`. Os URLs simples do jsDelivr e do unpkg continuam a servir a compilação da etiqueta script, que define `<erd-editor>` como antes. Um URL sem versão serve agora a versão 5.x mais recente; fixe `@4.2.0` para se manter na 4.x — consulte [CDN](#cdn) e [Etiqueta script](#script-tag).
- A raiz não define nada, mas continua a precisar de um DOM, pelo que, com renderização do lado do servidor, uma importação nomeada dela, como `setExportFileCallback`, fica no caminho executado apenas no cliente ao lado da entrada do elemento — consulte [Renderização do lado do servidor](#server-side-rendering).
- `window.ErdEditor` ganha `ErdEditorElement` e `defineErdEditor`. A compilação da etiqueta script do visualizador coloca `ErdViewerElement` e `defineErdViewer` em `window.ErdViewer`, e nenhuma das globais contém `toImage`.
- Um editor `readonly` abre como um leitor. Os seus seis separadores, o explorador, a Pesquisa rápida e a presença mantêm-se, e todos os controlos que editariam o diagrama desaparecem em vez de ficarem desativados: a barra de ferramentas mostra o nome da base de dados como texto, o separador Definições mostra as suas definições com todos os controlos desativados sob um distintivo `Read only`, e a barra de ferramentas flutuante mantém apenas o zoom, a vista de nomes, o modo zen e a bússola, pelo que `Hand` e `Select` desaparecem e um arrastamento desloca a vista. Uma pressão não seleciona nada: a única seleção é o contorno que um salto a partir do explorador ou da Pesquisa rápida coloca à volta do que alcança, que um clique parado limpa, e as teclas de selecionar tudo não selecionam nada. Ativar `readonly` termina o que estava aberto, como a seleção, a ferramenta mão, um editor de célula, um arrastamento, `Map Columns`, a pré-visualização `Force` da disposição automática e o Time Travel, e mantém o deslocamento, o zoom, o separador e a vista de nomes — consulte [readonly](./erd-editor-element.md#readonly).
- As definições que o leitor de um editor `readonly` altera ficam no ecrã desse editor, digam o que disserem os seus bloqueios: o deslocamento e o zoom, o separador, a vista de nomes, View Option, a base de dados e a linguagem, os formatos do nome e o tipo de delimitador do Gerador de código. `value`, `runtimeValue` e a exportação JSON mantêm as do próprio documento, que as alterações de um leitor da 4.x podiam alcançar, e `getSharedStore()` não envia nenhuma delas aos outros editores. `getSchemaSQL()` sem base de dados escreve a que o leitor escolheu. Desativar `readonly` repõe a base de dados, as definições de código e View Option nos do documento, e deixa o deslocamento, o zoom, o separador e a vista de nomes onde o leitor os deixou.
- A linha `Recalculation table width` do separador Definições desapareceu. Um carregamento e uma colagem continuam a ajustar a largura de cada tabela ao seu texto.
- No Vite 8, retire de `optimizeDeps` um `exclude: ['@dineug/erd-editor']`, que apenas o Vite 7 e anteriores ainda precisam, e mantenha o `include` do ELK — consulte [Vite](#vite).

## Atualizar a partir da 3.x {#upgrading-from-3x}

A `4.0.0` é uma versão principal. Verifique cada um destes pontos ao migrar uma página da 3.x e, depois, os de [Atualizar a partir da 4.x](#upgrading-from-4x) para a `5.0.0`:

- `editor.value`, o `value` de uma réplica e o `value` que o seu `change` entrega são a forma de armazenamento que um ficheiro contém: sem entidades removidas, larguras medidas, ordem de sobreposição nem âncoras de relações. Continue a guardar `value` e leia esses dados a partir de `runtimeValue`; os carimbos de data/hora das entidades (`meta`) desapareceram por completo. Inicialize um colaborador ou uma réplica que se junta a uma sessão em curso a partir do `runtimeValue` de um par em execução, e não a partir de `value` nem do ficheiro, e nunca guarde `runtimeValue` — consulte [value](./erd-editor-element.md#value) e [runtimeValue](./erd-editor-element.md#runtimevalue).
- Os bloqueios de definições substituem `Save Scroll Information` e `Save Zoom Information`. Um documento novo, e qualquer documento guardado antes da `4.0.0`, tem todos os bloqueios ativados, pelo que um deslocamento, um zoom, uma mudança de separador ou uma alteração da linguagem do Gerador de código, de um formato do nome ou do tipo de delimitador deixa `value` como estava e não dispara nenhum `change`. Uma página que guardava a vista através de `change` precisa de ter `Viewport` (e `Canvas Type`, para o separador) desbloqueados no separador Definições, ou de um documento cujo `settings.lockSettings` deixe esses bits a zero — consulte [Bloqueio](../guide/guides/settings.md#lock).
- `settings` já não tem `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`, e as constantes `SaveSettingType` desapareceram. `settings.lockSettings`, com os bits `LockSettingType`, ocupa o lugar de `ignoreSaveSettings`, que a `4.0.0` ou posterior não lê nem escreve — consulte [Definições](./advanced/schema.md#settings).
- O [JSON Schema](./advanced/schema.md#json-schema) que cada ficheiro indica em `$schema` descreve agora apenas a forma de armazenamento e é fechado: rejeita um ficheiro guardado por uma versão anterior até que este seja reescrito ao ser guardado pela `4.0.0` ou posterior.
- A recolha de lixo do documento desapareceu juntamente com o seu worker, pelo que uma entidade removida permanece em `runtimeValue` até à próxima vez que o documento for aberto a partir do seu ficheiro. Restam três workers partilhados — consulte [Web Workers](#web-workers).
- Mantenha todos os editores e réplicas de uma sessão partilhada na `4.0.0` ou posterior. Uma versão anterior ignora os novos tipos de ação: os dos grupos de tabelas, de Mapear colunas, dos bloqueios e dos scripts do Esquema SQL — consulte [Misturar versões](./advanced/collaborative-editing.md#mixing-releases).
- O callback de importação recebe `mode: 'append'` em Importar e adicionar, valor que um callback tem de transmitir. O callback de exportação recebe agora também ficheiros `.svg` e do Gerador de código, e `Export` ▸ `Schema SQL` abre o separador Esquema SQL em vez de guardar, pelo que o `.sql` só chega através do botão `Save file` desse separador — consulte [Caixas de diálogo de ficheiros](#file-dialogs).
- As teclas `Delete` e `Backspace` estão atribuídas à nova associação `removeSelection`. Enquanto o editor tem o foco fora de um campo de texto, a ação predefinida da tecla é cancelada em todos os separadores e, no separador ERD, a seleção é removida. `KeyBindingName` e `KeyBindingMap` passam a incluí-la, e `setKeyBindingMap({ removeSelection: [] })` deixa as duas teclas para a página — consulte [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` aceita também `'system'`, a opção `System` do criador de temas, que é definida ao ativar `systemDarkMode`. `changePresetTheme` indica `'system'` enquanto esta estiver escolhida, por isso guarde-o tal como está e devolva-o a `setPresetTheme`. Com `systemDarkMode` ativado, um `setPresetTheme()` com `'light'` ou `'dark'` mantém-se agora, em vez de ser substituído pela próxima alteração do sistema operativo — consulte [systemDarkMode](./erd-editor-element.md#systemdarkmode) e [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` ou posterior, a extensão do VS Code `4.0.0` ou posterior e os plugins do Obsidian e da JetBrains `1.0.0` ou posterior utilizam o protocolo 2 do hub. O servidor `1.0.0` ou posterior e uma versão anterior do editor que sirva agentes, ou um servidor anterior e um destes editores, recusam-se mutuamente com `protocolMismatch`, indicando o lado a atualizar — consulte [Atualizar](../mcp/installation.md#updating).
- Um URL de CDN sem versão serve a versão mais recente, a 5.x desde a `5.0.0`. Fixe `@3.10.0` para se manter na 3.x — consulte [CDN](#cdn).
