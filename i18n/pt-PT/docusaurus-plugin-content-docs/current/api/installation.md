---
sidebar_position: 1
description: Instalar o @dineug/erd-editor a partir do npm ou de uma CDN, montar o elemento personalizado, ligar as caixas de diálogo de ficheiros e atualizar a partir da 3.x.
---

# Instalação

```sh
npm install @dineug/erd-editor
```

O pacote é exclusivamente ESM (`"type": "module"`) e distribui apenas a sua pasta `dist`.
Não existe uma compilação CommonJS, pelo que `require('@dineug/erd-editor')` não funciona.

As suas dependências de tempo de execução ficam externas, como importações simples que o seu bundler resolve, desduplica e às quais aplica tree-shaking.
Os seus workers partilhados são gerados como ficheiros de entrada separados em `dist/workers/` e construídos com `new URL('./…', import.meta.url)`, a forma de escrita que o Vite, o webpack 5 e o Rspack empacotam como entrada de worker. Consulte [Web Workers](#web-workers).
Para uma página sem bundler por trás, existe uma segunda compilação autónoma — consulte [Etiqueta script](#script-tag).

## Utilização {#usage}

```js
import '@dineug/erd-editor';

const editor = document.createElement('erd-editor');
editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
document.body.appendChild(editor);

// load a document without adding an undo entry, then keep it in sync
editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
editor.addEventListener('change', () => {
  localStorage.setItem('my-diagram', editor.value);
});
```

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
  import 'https://esm.run/@dineug/erd-editor';

  const editor = document.createElement('erd-editor');
  editor.style.cssText = 'display: block; width: 100%; height: 100vh;';
  document.body.appendChild(editor);
</script>
<!-- or -->
<script type="module" src="https://esm.run/@dineug/erd-editor"></script>
```

O `esm.run` encarrega-se de resolver as dependências externas do pacote, pelo que isto funciona sem bundler.
O URL sem versão serve sempre a versão mais recente. Fixe uma versão — `https://esm.run/@dineug/erd-editor@4.2.0` — se não quiser que uma atualização de versão principal chegue à sua página sem aviso.
A própria `4.0.0` é uma delas: uma página que tenha de se manter na 3.x fixa `@3.10.0` — consulte [Atualizar a partir da 3.x](#upgrading-from-3x).

### Etiqueta script {#script-tag}

A partir da `3.6.0`, o pacote distribui também uma compilação UMD com todas as dependências e todos os workers partilhados dentro de um único ficheiro.
É para ela que apontam os campos `unpkg` e `jsdelivr`, pelo que o URL simples do pacote em qualquer uma das duas CDN a serve, e esta define `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Importá-la regista `<erd-editor>` da mesma forma; `window.ErdEditor` contém os dois callbacks de ficheiros, `ErdEditor.setExportFileCallback` e `ErdEditor.setImportFileCallback`, e, a partir da `3.9.2`, `ErdEditor.createKeyBindingMap`. A partir da `4.2.0`, contém também `ErdEditor.dictionaryRowChords` — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
O mapa de exportações continua a encaminhar um bundler para os módulos ES, pelo que uma instalação a partir do npm nunca recorre a este ficheiro.

### HTML {#html}

```html
<erd-editor system-dark-mode enable-theme-builder enable-locale-picker enable-welcome-screen></erd-editor>
<script type="module">
  import 'https://esm.run/@dineug/erd-editor';

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
Todos os 25 idiomas de apresentação vêm incluídos no pacote, tanto na compilação ES como na compilação da etiqueta script, pelo que não há nenhum ficheiro de localização a servir nem nada a registar. Sem o seletor e sem uma chamada a `setLocale()`, o editor é apresentado em inglês.

Adicionar `readonly` aqui bloqueia a edição: atribuir `value`, chamar `clear()` e todas as chamadas `setSchema*()` — incluindo `setSchemaJSON()` e uma adição — são ignorados, e o evento `change` nunca é disparado. Ler `editor.value` e `editor.runtimeValue` continua a funcionar. Para carregar, use antes `setInitialValue()`.

### Renderização do lado do servidor {#server-side-rendering}

Importar o pacote regista o elemento personalizado no âmbito do módulo, pelo que precisa de um DOM e gera uma exceção no Node.
No Next.js, Nuxt, SvelteKit ou Astro, carregue-o a partir de um caminho executado apenas no cliente.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Importar o pacote funde `erd-editor` em `HTMLElementTagNameMap`, pelo que o elemento fica tipado sem conversão de tipo.

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` é exportado para anotar as suas próprias variáveis e props.
A partir da `4.0.0`, o pacote exporta também os tipos `LocaleCode`, `LocaleOption` e `SchemaSQLOptions` — consulte [Pontos de entrada](#entry-points). As opções que os métodos `setSchema*()` recebem não têm nome exportado; obtenha-as a partir do elemento, como `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Realce de sintaxe {#syntax-highlighting}

Os painéis Esquema SQL e Gerador de código são realçados pelo [Shiki](https://shiki.style), num worker partilhado próprio, e, a partir da `4.0.0`, também o são os scripts `Before tables` e `After tables` do separador Esquema SQL.
A partir da `3.7.0`, não há nada a instalar nem nada a registar: o worker é criado da primeira vez que um painel de código é renderizado, pelo que uma página que não abra nenhum nunca transfere as gramáticas.

| | |
| --- | --- |
| Linguagens | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temas | `github-dark` e `github-light`, consoante o aspeto claro ou escuro do editor |

São exatamente as linguagens que os painéis geram: `JPA` é realçado como Java, `SQLAlchemy` como Python, `TypeORM`, `Sequelize`, `Drizzle` e `Zod` como TypeScript, `Doctrine` como PHP, `SeaORM` como Rust, `JSON Schema` como JSON, e `DBML` e `AML` como SQL, a gramática mais próxima entre as incluídas — consulte [Gerador de código](../guide/guides/code-generator.md).

O motor de expressões regulares é JavaScript puro, pelo que nenhuma política do host precisa de `wasm-unsafe-eval`.
Onde `SharedWorker` não existe — Chrome no Android, Safari anterior à 16.4 — a falha é registada e o código aparece como texto simples; os scripts continuam a poder ser editados.

Ao atualizar a partir da `3.6.0` ou anterior: `@dineug/erd-editor-shiki-worker` deixou de ser publicado, e `setGetShikiServiceCallback` desapareceu com ele.
Retire a instalação e o registo; uma página que carregava o worker a partir de uma CDN retira também essa segunda etiqueta `<script>`.

## Web Workers {#web-workers}

O editor executa três tarefas em `SharedWorker`s: o realce de sintaxe, a exportação de imagem e a disposição das tabelas por trás da [disposição automática](../guide/guides/table-related-functions.md#auto-layout), do [modo Flow](../guide/guides/visualization.md#how-flow-is-placed) do separador Visualização e, a partir da `4.0.0`, do posicionamento de um esquema importado.
Os três vêm incluídos em `@dineug/erd-editor`. Nenhum deles é algo que tenha de configurar, mas cada um é algo que um host pode bloquear.
O worker que executava a recolha de lixo do documento foi removido na `4.0.0`, juntamente com a própria recolha.

| Worker | Sem ele |
| --- | --- |
| Realce de sintaxe | Os painéis Esquema SQL e Gerador de código e os scripts do Esquema SQL ficam em texto simples |
| Exportação de imagem | O PNG, o SVG, o botão `Copy to clipboard` e a pré-visualização da caixa de diálogo `Export image` são desenhados na thread principal, o que bloqueia a página enquanto está a desenhar |
| Disposição das tabelas | As disposições `Flow`, `Tree - vertical` e `Tree - horizontal` da disposição automática e o modo Flow do separador Visualização terminam em `Could not place tables`; uma importação posicionada pelo Flow — um ficheiro SQL, GraphQL, DBML ou AML a partir de `Import` ou de `Import and Add`, ou uma chamada `setSchema*()` com `placement: 'auto'` — coloca as suas tabelas em linhas, sem qualquer mensagem; `Force` e o modo Graph não são afetados, uma vez que são executados dentro do editor |

A exportação de imagem espera dez segundos pela resposta do seu worker e depois desenha na thread principal, e o realce de sintaxe deixa o código em texto simples assim que o seu worker falha, pelo que um host que bloqueie workers custa desempenho, e não funcionalidade.
A disposição das tabelas é a exceção: o motor que calcula uma disposição pesa mais do que o próprio editor e nunca é carregado no mesmo processo, pelo que espera trinta segundos pelo seu worker no primeiro posicionamento e, depois de o worker ter respondido, dá a uma disposição sessenta segundos para ser devolvida.
Se qualquer uma das esperas se esgotar, o posicionamento termina como terminaria sem o worker. A disposição automática mostra `Placing tables` assim que começa, enquanto o modo Flow e uma importação posicionada pelo Flow só o mostram quando um posicionamento, incluindo o arranque do seu worker, já decorre há seis segundos.

Na compilação empacotada, os três são gerados como ficheiros ao lado do pacote, pelo que uma CSP restrita precisa de `worker-src 'self'` — mais `blob:` onde o seu bundler incorpora um worker em linha.
Na compilação da [etiqueta script](#script-tag), os três viajam dentro do ficheiro como URLs `data:`, pelo que essa página precisa, em vez disso, de `worker-src data:`.

## Pontos de entrada {#entry-points}

Importar `@dineug/erd-editor` regista `<erd-editor>` como efeito secundário. Além disso, exporta o tipo do elemento, dois setters de callback, a partir da `3.9.2` as combinações de teclas predefinidas com os respetivos tipos, a partir da `4.0.0` os tipos de idioma de apresentação e o tipo das opções de `getSchemaSQL()` e, a partir da `4.2.0`, as combinações de teclas de linha do separador Dicionário.

| Exportação | Descrição |
| --- | --- |
| `ErdEditorElement` (tipo) | A interface do elemento — consulte [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Substitui a transferência do navegador, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Substitui o seletor de ficheiros do navegador, `({ type, op, accept, mode }) => void`; `mode` a partir da `4.0.0`. A partir da `4.2.0`, o botão `Import CSV` do separador Dicionário abre o seletor do navegador mesmo com um callback definido — consulte [Caixas de diálogo de ficheiros](#file-dialogs). |
| `createKeyBindingMap()` | Devolve as combinações de teclas predefinidas como um novo `KeyBindingMap` a cada chamada — consulte [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipos) | Um mapa de associações, a união dos nomes dos seus comandos e uma associação. |
| `dictionaryRowChords(map)` | A partir da `4.2.0`. Devolve, como um novo `ShortcutOption[]` a cada chamada, as combinações com que a grelha do separador [Dicionário](../guide/guides/dictionary.md#adding-and-deleting-rows) insere e elimina linhas segundo o `KeyBindingMap` que passar. A que insere linhas acima, `Alt+Shift+Enter` com as predefinições, não está em nenhuma associação — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipos) | A partir da `4.0.0`. Os 25 códigos de idioma de apresentação e esses códigos mais `'system'`, que `setLocale()` recebe — consulte [Idioma de apresentação](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | A partir da `4.0.0`. As opções que `getSchemaSQL()` recebe: `statements`, `header` e, a partir da `4.2.0`, `logicalNameAsComment` — consulte [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` é um segundo ponto de entrada. Executa o armazenamento do documento sem DOM, pelo que funciona num Web Worker — consulte [Armazenamento remoto](./advanced/remote-storage.md).
Exporta `createReplicationStore` e o tipo `ReplicationStore`. A partir da `3.10.0`, exporta também o tipo `ReplicationChange`, `{ value: string; changed: boolean }`, que o listener de `change` de uma réplica recebe — consulte [on@change](./advanced/remote-storage.md#onchange).
A partir da `4.0.0`, um `ReplicationStore` tem também um `runtimeValue`. O seu `value` e o que um `change` entrega são a forma de armazenamento que um ficheiro contém, tal como os do elemento — consulte [ReplicationStore](./advanced/remote-storage.md#replicationstore).

A partir da `3.9.1`, existe um terceiro, `@dineug/erd-editor/peer.js`: o par headless através do qual o [servidor MCP](../mcp/introduction.md) edita um documento. Existe para esse servidor, e estas páginas não o documentam.

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
O callback de exportação recebe estes ficheiros. A partir da `4.0.0`, o SVG e os ficheiros do Gerador de código estão entre eles, e o `.sql` vem do botão `Save file` do separador Esquema SQL, e não diretamente do submenu `Export`. A partir da `4.2.0`, o CSV do separador Dicionário também está entre eles.

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

## Atualizar a partir da 3.x {#upgrading-from-3x}

A `4.0.0` é uma versão principal. Verifique cada um destes pontos ao migrar uma página da 3.x:

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
- Um URL de CDN sem versão serve agora a versão 4.x mais recente. Fixe `@3.10.0` para se manter na 3.x — consulte [CDN](#cdn).
