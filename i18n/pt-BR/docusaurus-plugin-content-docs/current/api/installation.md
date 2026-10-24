---
sidebar_position: 1
description: Instalar o @dineug/erd-editor pelo npm ou por uma CDN, montar o elemento personalizado, conectar as caixas de diálogo de arquivo e atualizar a partir da 3.x.
---

# Instalação

```sh
npm install @dineug/erd-editor
```

O pacote é somente ESM (`"type": "module"`) e publica apenas a pasta `dist`.
Não há build CommonJS, então `require('@dineug/erd-editor')` não funciona.

Suas dependências de tempo de execução ficam externas, como imports simples que o seu bundler resolve, deduplica e otimiza com tree-shaking.
Seus workers compartilhados são gerados como arquivos de entrada separados em `dist/workers/` e construídos com `new URL('./…', import.meta.url)`, a forma que o Vite, o webpack 5 e o Rspack empacotam como entrada de worker. Consulte [Web Workers](#web-workers).
Para uma página sem bundler por trás, há um segundo build, autocontido — consulte [Tag script](#script-tag).

## Uso {#usage}

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

`<erd-editor>` não tem tamanho intrínseco. Defina uma largura e uma altura explícitas para ele (ou para o seu contêiner).
A partir da `4.1.0`, um [explorador](../guide/guides/explorer.md) aberto fica encaixado dentro do elemento, à esquerda do canvas ERD, e estreita o canvas em vez de cobri-lo. Um editor novo começa com ele fechado.
O painel nunca é desenhado com menos de `200px` e deixa pelo menos `320px` para o canvas, então, em um elemento mais estreito que `520px`, um explorador aberto não é desenhado até que o elemento fique mais largo — consulte [Ao lado do canvas](../guide/guides/explorer.md#beside-the-canvas).

`setInitialValue('')` inicia um documento novo e vazio. Atribuir `value`, por sua vez, carrega um documento como uma edição, então ele entra no histórico de desfazer.
A partir da `4.0.0`, `editor.value` é o documento na forma que um arquivo contém, que é o que deve ser armazenado. `editor.runtimeValue` é o documento como o editor o mantém, incluindo as entidades removidas: ele inicializa um colaborador e nunca vai para um arquivo — consulte [runtimeValue](./erd-editor-element.md#runtimevalue).
A partir da `4.0.0`, um documento novo também tem todos os [bloqueios de configuração](../guide/guides/settings.md#lock) ativados: a área visível, a aba, a linguagem do Gerador de código, os dois estilos de nome, o tipo de delimitador e, a partir da `4.2.0`, a [exibição de nomes](../guide/guides/logical-names.md#name-view). Rolar, aplicar zoom, trocar de aba, trocar a exibição de nomes ou alterar uma das outras configurações deixa `editor.value` como estava e não dispara nenhum `change`. Um documento carregado a partir de texto mantém os bloqueios que indica. Um que não indica nenhum, como qualquer arquivo salvo antes da `4.0.0`, abre com todos os bloqueios ativados, com zoom de 100% e na aba ERD, quaisquer que sejam a área visível e a aba que ele salvou. Sua área visível fica bloqueada na origem `0, 0` e, se nenhuma parte do diagrama estiver desenhada ali, a área visível abre no diagrama em vez disso — consulte [setInitialValue](./erd-editor-element.md#setinitialvalue).
Um arquivo salvo antes da `4.2.0` abre com a exibição de nomes bloqueada em `Physical Names`, mesmo um que tenha todos os outros bloqueios desativados. Um editor da `4.0.0` ou da `4.1.0` mantém o bloqueio da exibição de nomes como está ao salvar, mas descarta a exibição, então um arquivo da `4.2.0` salvo com a exibição de nomes desbloqueada continua desbloqueado, mas reabre na exibição `Physical Names`.
Consulte [ErdEditorElement](./erd-editor-element.md) para o restante da API.

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

O `esm.run` resolve as dependências externas do pacote por você, então isso funciona sem bundler.
A URL sem versão sempre entrega a versão mais recente. Fixe uma versão — `https://esm.run/@dineug/erd-editor@4.2.0` — se não quiser que uma atualização major chegue à sua página sem aviso.
A própria `4.0.0` é uma delas: uma página que precisa continuar na 3.x fixa `@3.10.0` — consulte [Atualizar a partir da 3.x](#upgrading-from-3x).

### Tag script {#script-tag}

A partir da `3.6.0`, o pacote também publica um build UMD com todas as dependências e todos os workers compartilhados dentro de um único arquivo.
É para ele que os campos `unpkg` e `jsdelivr` apontam, então a URL simples do pacote em qualquer uma das duas CDNs o entrega, e ele define `window.ErdEditor`.

```html
<erd-editor></erd-editor>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@4.2.0"></script>
<script>
  const editor = document.querySelector('erd-editor');
  editor.setInitialValue(localStorage.getItem('my-diagram') ?? '');
</script>
```

Importá-lo registra `<erd-editor>` da mesma forma; `window.ErdEditor` traz os dois callbacks de arquivo, `ErdEditor.setExportFileCallback` e `ErdEditor.setImportFileCallback`, e, a partir da `3.9.2`, `ErdEditor.createKeyBindingMap`. A partir da `4.2.0`, ele também traz `ErdEditor.dictionaryRowChords` — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords).
O mapa de exports continua apontando um bundler para os módulos ES, então uma instalação pelo npm nunca usa este arquivo.

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

A partir da `4.0.0`, o atributo `enable-locale-picker` adiciona o seletor `Display Language` da barra de ferramentas, e o `enable-welcome-screen`, a tela de boas-vindas que um diagrama vazio mostra — consulte [enableLocalePicker](./erd-editor-element.md#enablelocalepicker) e [enableWelcomeScreen](./erd-editor-element.md#enablewelcomescreen).
Uma página que carrega um documento, como em [Uso](#usage), ativa `enableWelcomeScreen` depois que `setInitialValue()` o carrega, e não na marcação, para que a tela nunca pisque sobre um arquivo que ainda está carregando.
Todos os 25 idiomas de exibição vêm dentro do pacote, tanto no build ES quanto no build da tag script, então não há arquivo de localidade para servir nem nada para registrar. Sem o seletor e sem uma chamada a `setLocale()`, o editor é exibido em inglês.

Adicionar o atributo `readonly` aqui bloqueia a edição: atribuir `value`, chamar `clear()` e todas as chamadas `setSchema*()` — incluindo `setSchemaJSON()` e as de acréscimo — são ignorados, e o evento `change` nunca é disparado. Ler `editor.value` e `editor.runtimeValue` continua funcionando. Em vez disso, carregue com `setInitialValue()`.

### Renderização no lado do servidor {#server-side-rendering}

Importar o pacote registra o elemento personalizado no escopo do módulo, então ele precisa de um DOM e lança um erro no Node.
No Next.js, Nuxt, SvelteKit ou Astro, acesse-o por um caminho executado apenas no cliente.

```js
useEffect(() => {
  import('@dineug/erd-editor');
}, []);
```

### TypeScript {#typescript}

Importar o pacote mescla `erd-editor` em `HTMLElementTagNameMap`, então o elemento é tipado sem conversão (cast).

```ts
import '@dineug/erd-editor';
import type { ErdEditorElement } from '@dineug/erd-editor';

const editor = document.createElement('erd-editor'); // ErdEditorElement
const found = document.querySelector('erd-editor'); // ErdEditorElement | null
```

`ErdEditorElement` é exportado para anotar suas próprias variáveis e props.
A partir da `4.0.0`, o pacote também exporta os tipos `LocaleCode`, `LocaleOption` e `SchemaSQLOptions` — consulte [Pontos de entrada](#entry-points). As opções que os métodos `setSchema*()` recebem não têm nome exportado; obtenha-as a partir do elemento, como `Parameters<ErdEditorElement['setSchemaSQL']>[1]`.

## Realce de sintaxe {#syntax-highlighting}

Os painéis Esquema SQL e Gerador de código recebem realce de sintaxe do [Shiki](https://shiki.style), em um worker compartilhado próprio, e, a partir da `4.0.0`, os scripts `Before tables` e `After tables` da aba Esquema SQL também.
A partir da `3.7.0`, não há nada para instalar nem para registrar: o worker é criado na primeira vez que um painel de código é renderizado, então uma página que não abre nenhum nunca baixa as gramáticas.

| | |
| --- | --- |
| Linguagens | SQL, TypeScript, GraphQL, C#, Java, Kotlin, Scala, Go, Python, PHP, Rust, Swift, JSON, Mermaid |
| Temas | `github-dark` e `github-light`, seguindo a aparência clara ou escura do editor |

Essas são exatamente as linguagens que os painéis geram: `JPA` é realçado como Java, `SQLAlchemy` como Python, `TypeORM`, `Sequelize`, `Drizzle` e `Zod` como TypeScript, `Doctrine` como PHP, `SeaORM` como Rust, `JSON Schema` como JSON, e `DBML` e `AML` como SQL, a gramática mais próxima entre as incluídas — consulte [Gerador de código](../guide/guides/code-generator.md).

O mecanismo de regex é JavaScript puro, então nenhuma política do host precisa de `wasm-unsafe-eval`.
Onde `SharedWorker` não existe — Chrome no Android, Safari anterior à 16.4 — a falha é registrada no log e o código aparece como texto simples; os scripts ainda podem ser editados.

Ao atualizar a partir da `3.6.0` ou anterior: `@dineug/erd-editor-shiki-worker` não é mais publicado, e `setGetShikiServiceCallback` deixou de existir junto com ele.
Remova a instalação e o registro; uma página que carregava o worker de uma CDN também remove essa segunda tag `<script>`.

## Web Workers {#web-workers}

O editor executa três tarefas em `SharedWorker`s: realce de sintaxe, exportação de imagem e o layout de tabelas por trás do [layout automático](../guide/guides/table-related-functions.md#auto-layout), do [modo Flow](../guide/guides/visualization.md#how-flow-is-placed) da aba Visualização e, a partir da `4.0.0`, do posicionamento de um esquema importado.
Os três vêm dentro de `@dineug/erd-editor`. Nenhum deles precisa ser configurado por você, mas cada um pode ser bloqueado por um host.
O worker que executava a coleta de lixo do documento foi removido na `4.0.0`, junto com a própria coleta.

| Worker | Sem ele |
| --- | --- |
| Realce de sintaxe | Os painéis Esquema SQL e Gerador de código e os scripts do Esquema SQL ficam como texto simples |
| Exportação de imagem | O PNG, o SVG, o botão `Copy to clipboard` e a pré-visualização da caixa de diálogo `Export image` são desenhados na thread principal, o que bloqueia a página enquanto desenha |
| Layout de tabelas | Os layouts `Flow`, `Tree - vertical` e `Tree - horizontal` do layout automático e o modo Flow da aba Visualização terminam com `Could not place tables`; uma importação posicionada pelo Flow — um arquivo SQL, GraphQL, DBML ou AML vindo de `Import` ou `Import and Add`, ou uma chamada `setSchema*()` com `placement: 'auto'` — coloca suas tabelas em linhas, sem mensagem; `Force` e o modo Graph não são afetados, pois rodam dentro do editor |

A exportação de imagem espera dez segundos pela resposta do seu worker e então desenha na thread principal, e o realce de sintaxe deixa o código como texto simples assim que seu worker falha, então um host que bloqueia workers perde desempenho, não funcionalidade.
O layout de tabelas é a exceção: o mecanismo que calcula um layout é mais pesado que o próprio editor e nunca é carregado no mesmo processo, então ele espera trinta segundos pelo seu worker no primeiro posicionamento e, depois que o worker responde, dá sessenta segundos para um layout retornar.
Se qualquer uma das esperas se esgotar, o posicionamento termina como terminaria sem o worker. O layout automático mostra `Placing tables` assim que começa, enquanto o modo Flow e uma importação posicionada pelo Flow só o mostram depois que um posicionamento, incluindo a inicialização do seu worker, está em andamento há seis segundos.

No build empacotado, os três são gerados como arquivos ao lado do pacote, então uma CSP estrita precisa de `worker-src 'self'` — mais `blob:` quando o seu bundler embute um worker.
No build da [tag script](#script-tag), os três vão dentro do arquivo como URLs `data:`, então essa página precisa de `worker-src data:` em vez disso.

## Pontos de entrada {#entry-points}

Importar `@dineug/erd-editor` registra `<erd-editor>` como efeito colateral. Além disso, ele exporta o tipo do elemento, dois setters de callback, a partir da `3.9.2` as combinações de teclas padrão com seus tipos, a partir da `4.0.0` os tipos de idioma de exibição e o tipo das opções de `getSchemaSQL()` e, a partir da `4.2.0`, as combinações de teclas de linha da aba Dicionário.

| Exportação | Descrição |
| --- | --- |
| `ErdEditorElement` (tipo) | A interface do elemento — consulte [ErdEditorElement](./erd-editor-element.md). |
| `setExportFileCallback(cb)` | Substitui o download do navegador, `(blob, { fileName }) => void`. |
| `setImportFileCallback(cb)` | Substitui o seletor de arquivos do navegador, `({ type, op, accept, mode }) => void`; `mode` a partir da `4.0.0`. A partir da `4.2.0`, o botão `Import CSV` da aba Dicionário abre o seletor do navegador mesmo com um callback definido — consulte [Caixas de diálogo de arquivo](#file-dialogs). |
| `createKeyBindingMap()` | Retorna as combinações de teclas padrão como um novo `KeyBindingMap` a cada chamada — consulte [createKeyBindingMap](./erd-editor-element.md#createkeybindingmap). |
| `KeyBindingMap`, `KeyBindingName`, `ShortcutOption` (tipos) | Um mapa de combinações de teclas, a união dos nomes de seus comandos e uma combinação de teclas. |
| `dictionaryRowChords(map)` | A partir da `4.2.0`. Retorna, como um novo `ShortcutOption[]` a cada chamada, as combinações com que a grade da aba [Dicionário](../guide/guides/dictionary.md#adding-and-deleting-rows) insere e exclui linhas sob o `KeyBindingMap` que você passa. A que insere linhas acima, `Alt+Shift+Enter` com as combinações padrão, não está em nenhuma vinculação — consulte [dictionaryRowChords](./erd-editor-element.md#dictionaryrowchords). |
| `LocaleCode`, `LocaleOption` (tipos) | A partir da `4.0.0`. Os 25 códigos de idioma de exibição e esses códigos mais `'system'`, que `setLocale()` recebe — consulte [Idioma de exibição](./erd-editor-element.md#display-language). |
| `SchemaSQLOptions` (tipo) | A partir da `4.0.0`. As opções que `getSchemaSQL()` recebe: `statements`, `header` e, a partir da `4.2.0`, `logicalNameAsComment` — consulte [getSchemaSQL](./erd-editor-element.md#getschemasql). |

`@dineug/erd-editor/engine.js` é um segundo ponto de entrada. Ele executa o armazenamento do documento sem DOM, então funciona em um Web Worker — consulte [Armazenamento remoto](./advanced/remote-storage.md).
Ele exporta `createReplicationStore` e o tipo `ReplicationStore`. A partir da `3.10.0`, também exporta o tipo `ReplicationChange`, `{ value: string; changed: boolean }`, que o listener de `change` de uma réplica recebe — consulte [on@change](./advanced/remote-storage.md#onchange).
A partir da `4.0.0`, um `ReplicationStore` também tem um `runtimeValue`. Seu `value` e o que um `change` entrega são a forma de armazenamento que um arquivo contém, como o do elemento — consulte [ReplicationStore](./advanced/remote-storage.md#replicationstore).

A partir da `3.9.1`, há um terceiro, `@dineug/erd-editor/peer.js`: o par headless por meio do qual o [servidor MCP](../mcp/introduction.md) edita um documento. Ele existe para esse servidor, e estas páginas não o documentam.

### Caixas de diálogo de arquivo {#file-dialogs}

A importação e a exportação passam por callbacks injetáveis, então um host sem caixa de diálogo de arquivo do navegador — uma webview de IDE, por exemplo — pode fornecer a sua própria.
As duas não são simétricas: a exportação entrega o arquivo pronto, enquanto a importação apenas pede um, e é você quem devolve o conteúdo ao editor.
A partir da `4.2.0`, o botão `Import CSV` da aba Dicionário é a única importação que nunca chama o callback de importação, cujo `type` não tem valor para CSV. Ele sempre abre o próprio seletor de arquivos do navegador, para arquivos `.csv` — consulte [Importar e exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv).

`op` é `set` ou `diff` — um `diff` vai para `setDiffValue()`, qualquer que seja o `type`. Caso contrário, `type` escolhe o método, e `accept` traz as extensões desse tipo, prontas para passar a uma caixa de diálogo de arquivo do host.
A partir da `4.0.0`, um `set` traz `mode: 'append'` quando o usuário escolheu [Importar e adicionar](../guide/guides/file-import-export.md#import-and-add), e nenhum `mode` para uma importação simples. Repasse-o: um callback que o descarta substitui o diagrama ao qual o usuário pediu para adicionar o arquivo.

| `type` | `accept` | Método |
| --- | --- | --- |
| `json` | `.json` | `editor.setSchemaJSON(text, { mode })` |
| `sql` | `.sql` | `editor.setSchemaSQL(text, { placement: 'auto', mode })` |
| `graphql` | `.graphql,.gql,.graphqls` | `editor.setSchemaGraphQL(text, { placement: 'auto', mode })` |
| `dbml` | `.dbml` | `editor.setSchemaDBML(text, { placement: 'auto', mode })` |
| `aml` | `.aml` | `editor.setSchemaAML(text, { placement: 'auto', mode })` |

`placement: 'auto'` organiza as tabelas pelos seus relacionamentos antes de colocá-las, como faz a própria importação do editor, e faz a chamada retornar uma Promise. Sem ele, elas são colocadas em linhas imediatamente — consulte [setSchemaSQL](./erd-editor-element.md#setschemasql) e [setSchemaJSON](./erd-editor-element.md#setschemajson).

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

Despache com base em cada `type` que você trata e ignore os demais.
Um `setSchemaJSON()` de substituição, assim como atribuir `value`, limpa o documento antes de analisar o conteúdo, então encaminhar para ele um conteúdo que não seja um documento `.erd.json` — por um `else` genérico ou porque um `type` adicionado depois não foi tratado e caiu ali — esvazia o diagrama em vez de importar qualquer coisa.

O `fileName` que o editor gera é `<database name>-<timestamp>` mais a extensão do arquivo, em que o carimbo de data e hora é a hora local no formato `yyyy-MM-dd'T'HH_mm_ss`. Um nome de banco de dados em branco é substituído por `unnamed`. Um CSV da aba Dicionário leva o nome da planilha antes da extensão, como em `<database name>-<timestamp>-words.csv`.
O callback de exportação recebe estes arquivos. A partir da `4.0.0`, o SVG e os arquivos do Gerador de código estão entre eles, e o `.sql` vem do botão `Save file` da aba Esquema SQL, e não diretamente de `Export`. A partir da `4.2.0`, o CSV da aba Dicionário também está entre eles.

| Arquivo | Extensão | `type` do Blob |
| --- | --- | --- |
| A exportação JSON | `.erd.json` | `application/json` |
| O botão `Save file` da aba Esquema SQL, com o texto que a aba mostra — consulte [Esquema SQL](../guide/guides/schema-sql.md) | `.sql` | nenhum |
| A caixa de diálogo [Exportar imagem](../guide/guides/file-import-export.md#image) | `.png` ou `.svg` | `image/png` ou `image/svg+xml` |
| O botão `Save file` da aba Gerador de código — consulte [Gerador de código](../guide/guides/code-generator.md) | A da linguagem: `.cs`, `.go`, `.java`, `.kt`, `.php`, `.rs`, `.scala`, `.swift`, `.ts`, `.py`, `.aml`, `.dbml`, `.graphql`, `.json` ou `.mmd` | nenhum |
| O botão `Export CSV` da aba Dicionário, com todas as linhas da planilha mostrada, independentemente do que a pesquisa lista — consulte [Importar e exportar CSV](../guide/guides/dictionary.md#importing-and-exporting-csv) | `.csv` | `text/csv` |

Um host que escolhe um manipulador pela extensão precisa de um para cada uma delas.

Sem callbacks definidos, o editor usa o comportamento próprio do navegador para download e seleção de arquivos. Passe `null` para voltar a ele.

## Compatibilidade com navegadores {#browser-support}

Chrome 91+, Edge 94+, Firefox 93+, Safari 16.4+ — a base ES2022 para a qual os bundles publicados são compilados.
Nenhum polyfill vem incluído. Adicione os seus se precisar atender navegadores mais antigos.

## Atualizar a partir da 3.x {#upgrading-from-3x}

A `4.0.0` é uma versão major. Verifique cada um destes pontos ao migrar uma página da 3.x:

- `editor.value`, o `value` de uma réplica e o `value` que o seu `change` entrega são a forma de armazenamento que um arquivo contém: sem entidades removidas, larguras medidas, ordem de empilhamento nem âncoras de relacionamento. Continue salvando `value` e leia essas informações de `runtimeValue`; os carimbos de data e hora das entidades (`meta`) deixaram de existir por completo. Inicialize um colaborador ou uma réplica que entra em uma sessão em andamento a partir do `runtimeValue` de um par em execução, não de `value` nem do arquivo, e nunca salve `runtimeValue` — consulte [value](./erd-editor-element.md#value) e [runtimeValue](./erd-editor-element.md#runtimevalue).
- Os bloqueios de configuração substituem `Save Scroll Information` e `Save Zoom Information`. Um documento novo, e qualquer documento salvo antes da `4.0.0`, tem todos os bloqueios ativados, então uma rolagem, um zoom, uma troca de aba ou uma alteração da linguagem do Gerador de código, de um estilo de nome ou do tipo de delimitador deixa `value` como estava e não dispara nenhum `change`. Uma página que guardava a área visível por meio de `change` precisa de `Viewport` (e de `Canvas Type`, para a aba) desbloqueado na aba Configurações, ou de um documento cujo `settings.lockSettings` deixe esses bits zerados — consulte [Bloqueio](../guide/guides/settings.md#lock).
- `settings` não tem mais `width`, `height`, `scrollTop`, `scrollLeft`, `relationshipOptimization` nem `ignoreSaveSettings`, e as constantes `SaveSettingType` deixaram de existir. `settings.lockSettings`, com os bits `LockSettingType`, toma o lugar de `ignoreSaveSettings`, que a `4.0.0` ou posterior não lê nem escreve — consulte [Settings](./advanced/schema.md#settings).
- O [JSON Schema](./advanced/schema.md#json-schema) que todo arquivo indica em `$schema` agora descreve apenas a forma de armazenamento e é fechado: ele rejeita um arquivo salvo por uma versão anterior até que um salvamento pela `4.0.0` ou posterior o reescreva.
- A coleta de lixo do documento deixou de existir junto com o seu worker, então uma entidade removida permanece em `runtimeValue` até a próxima vez que o documento for aberto a partir do seu arquivo. Restam três workers compartilhados — consulte [Web Workers](#web-workers).
- Mantenha todos os editores e réplicas de uma sessão compartilhada na `4.0.0` ou posterior. Uma versão anterior ignora os novos tipos de ação: os dos grupos de tabelas, de Mapear colunas, dos bloqueios e dos scripts do Esquema SQL — consulte [Misturar versões](./advanced/collaborative-editing.md#mixing-releases).
- O callback de importação recebe `mode: 'append'` para Importar e adicionar, que um callback precisa repassar. O callback de exportação agora também recebe arquivos `.svg` e do Gerador de código, e `Export` ▸ `Schema SQL` abre a aba Esquema SQL em vez de salvar, então o `.sql` só chega pelo botão `Save file` dessa aba — consulte [Caixas de diálogo de arquivo](#file-dialogs).
- As teclas `Delete` e `Backspace` são atribuídas à nova vinculação `removeSelection`. Enquanto o editor tem o foco fora de um campo de texto, a tecla tem a ação padrão impedida em todas as abas e, na aba ERD, a seleção é removida. `KeyBindingName` e `KeyBindingMap` passam a incluí-la, e `setKeyBindingMap({ removeSelection: [] })` deixa as duas teclas para a página — consulte [setKeyBindingMap](./erd-editor-element.md#setkeybindingmap).
- `ThemeOptions.appearance` também aceita `'system'`, o `System` do construtor de temas, que é definido ao ativar `systemDarkMode`. O evento `changePresetTheme` informa `'system'` enquanto ele está selecionado, então armazene-o como está e devolva-o a `setPresetTheme`. Com `systemDarkMode` ativado, um `setPresetTheme()` com `'light'` ou `'dark'` agora permanece, em vez de ser sobrescrito pela próxima mudança do sistema operacional — consulte [systemDarkMode](./erd-editor-element.md#systemdarkmode) e [changePresetTheme](./erd-editor-element.md#changepresettheme).
- `@dineug/erd-editor-mcp` `1.0.0` ou posterior, a extensão do VS Code `4.0.0` ou posterior e os plugins do Obsidian e da JetBrains `1.0.0` ou posterior usam a versão 2 do protocolo do hub. O servidor `1.0.0` ou posterior e uma versão anterior do editor que atende agentes, ou um servidor anterior e um destes editores, se recusam mutuamente com `protocolMismatch`, indicando o lado a atualizar — consulte [Atualizar](../mcp/installation.md#updating).
- Uma URL de CDN sem versão agora entrega a versão 4.x mais recente. Fixe `@3.10.0` para continuar na 3.x — consulte [CDN](#cdn).
