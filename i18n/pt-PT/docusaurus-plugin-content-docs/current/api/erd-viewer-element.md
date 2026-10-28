---
sidebar_position: 3
description: A API do elemento erd-viewer — um diagrama só de leitura a partir de um value ou de um URL src, o seu minimapa e a barra de controlos, os eventos load e error, temas, idioma de apresentação, foco e teclas, carregamento e o que acrescenta a uma página.
---

# ErdViewerElement

A partir da `5.0.0`, o pacote distribui também o `<erd-viewer>`, uma vista só de leitura de um documento: um leitor desloca a vista, faz zoom, pesquisa e ilumina relações, e nada nele edita. Desenha apenas a tela ERD, com as suas barras de deslocamento, um [minimapa](#minimap), uma [barra de controlos](#controls) e uma paleta que pesquisa o documento, e não tem barra de ferramentas, separadores, explorador nem menu de contexto.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

A moldura acima é este elemento tal como o erd-editor.io/embed o mostra, aqui com o exemplo da livraria: clique nela para lhe dar o foco, depois faça zoom e pesquise com as teclas de [Foco e teclas](#focus-and-keys), e consulte [Incorporar](../guide/guides/embedding.md) para incorporar um documento seu numa moldura, sem código.

O visualizador é um simples `HTMLElement`.  
A sua definição de tipo é a seguinte.

```ts
interface ErdViewerElement extends HTMLElement {
  src: string;
  nameView: 'physical' | 'logical' | 'both' | null;
  minimap: boolean;
  controls: boolean;
  value: string;
  setPresetTheme: (themeOptions: Partial<ThemeOptions>) => void;
  setSystemAppearance: (appearance: 'dark' | 'light' | null) => void;
  setTheme: (theme: Partial<Theme>) => void;
  setLocale: (locale: LocaleOption) => Promise<void>;
  setSystemLocale: (locale: string | null) => Promise<void>;
  destroy: () => void;
}
```

Importar `@dineug/erd-editor/erd-viewer.js` define `<erd-viewer>` e deixa `<erd-editor>` por definir. Importar a raiz do pacote não define nenhum dos dois: exporta a classe `ErdViewerElement` e `defineErdViewer()`, que define a etiqueta onde a chamar, pelo que uma página também pode definir a classe sob uma etiqueta sua — consulte [Registar os elementos](./installation.md#registering-the-elements).  
Todas as entradas exceto `engine.js` e `peer.js` precisam de um DOM, esta também, pelo que uma página renderizada no servidor a importa no cliente — consulte [Renderização do lado do servidor](./installation.md#server-side-rendering).  
Importar a entrada acrescenta `erd-viewer` a `HTMLElementTagNameMap`, pelo que `document.createElement('erd-viewer')` e `document.querySelector('erd-viewer')` ficam tipados como `ErdViewerElement` sem conversão de tipo.

Tal como o editor, o visualizador é renderizado num shadow root fechado, pelo que `viewer.shadowRoot` é `null` e os estilos da página não entram nem saem; estilize-o através de [setTheme](#settheme) e das propriedades personalizadas `--erd-editor-*`. Vários visualizadores numa página mantêm cada um o seu próprio documento, vista, tema e idioma.  
O `<erd-viewer>` não tem tamanho intrínseco. Um elemento personalizado é inline, pelo que lhe deve atribuir `display: block` e uma altura, como acima. A vista preenche a caixa do elemento e acompanha-a quando é redimensionada, mantendo o zoom.

`src`, `name-view`, `minimap` e `controls` são os seus únicos atributos, cada um com uma propriedade com o mesmo nome, `nameView` para `name-view`. [value](#value) é apenas uma propriedade.  
Um `value`, `src`, `nameView`, `minimap` ou `controls` definido no elemento antes de a sua etiqueta ser definida, por exemplo por uma framework que renderiza o elemento antes de a entrada ter carregado, é assumido quando a etiqueta é definida, sobrepondo-se aos atributos que a marcação lhe deu. São assumidos pela ordem em que a página escreveu cada um pela primeira vez, pelo que prevalece o mais recente entre `value` e `src`. Um `value` que não contém nenhum documento já não tem a quem lançar a exceção: é comunicado como um erro não capturado, e o visualizador fica vazio.

A compilação da etiqueta script, `dist/erd-viewer.umd.js`, contém apenas o visualizador com todas as dependências. Define `<erd-viewer>` e coloca `ErdViewerElement` e `defineErdViewer` em `window.ErdViewer`. Um URL de CDN sem caminho serve, em vez disso, a compilação do editor, pelo que deve indicar o ficheiro — consulte [Etiqueta script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

O URL de um documento para o visualizador ir buscar e mostrar. Por predefinição é `''`, nenhum.  
A obtenção é um simples `fetch()`, um `GET` sem opções próprias, pelo que as regras de CORS do navegador a governam: um documento noutra origem precisa de um servidor que permita a origem da página, e os cookies só vão para a origem da própria página. Um URL relativo é resolvido em relação à página.  
A resposta tem de conter um documento como o de um ficheiro `.erd.json`, a forma de armazenamento que o [value](./erd-editor-element.md#value) do editor e todos os hosts oficiais escrevem. Nenhum outro formato é lido: um ficheiro SQL, GraphQL, DBML ou AML falha como texto que não se consegue analisar.  
Um documento que é analisado com êxito fica ajustado à vista e emite [load](#load). Um pedido que a rede ou o CORS recusou, uma resposta que não é `ok` ou um texto que não se consegue analisar emite [error](#error) e deixa um diagrama vazio — consulte [Carregamento](#loading).

Só conta o pedido mais recente. Um novo `src` aborta a obtenção que ainda decorre, pelo que uma resposta lenta nunca chega por cima de um documento posterior. Atribuir [value](#value) também a aborta, tal como remover `src` ou defini-lo como `''`, o que deixa de o seguir e deixa o documento mostrado como estava.  
Prevalece o que for definido em último lugar entre `value` e `src`, tanto através da propriedade como do atributo. Um `src` escrito depois de um `value` é obtido mesmo que indique o URL obtido antes. Escrito de novo sobre o documento que já mostra, não obtém nada.  
O visualizador só obtém enquanto está numa página. Retirá-lo aborta uma obtenção que ainda decorre, e voltar a pô-lo obtém um `src` que ainda não mostrou, um que falhou incluído, nunca um que já mostra.  
O `src` é o único `fetch()` que o pacote faz, pelo que uma Content Security Policy restrita lista a origem do documento em `connect-src`.

```js
viewer.src = 'https://example.com/diagrams/shop.erd.json';
// or
viewer.setAttribute('src', 'https://example.com/diagrams/shop.erd.json');
```

```html
<erd-viewer src="https://example.com/diagrams/shop.erd.json"></erd-viewer>
```

## value {#value}

### getter {#getter}

Obtém o documento mostrado, venha de `src` ou de `value`, como uma cadeia JSON na forma de armazenamento que o [value](./erd-editor-element.md#value) do editor escreve. Antes de se mostrar qualquer coisa, é um documento novo e vazio, cujo `doc` é `{}`.  
Enquanto o [bloqueio](../guide/guides/settings.md#lock) `Viewport` do documento está ativado, como num documento novo, escreve o zoom e o deslocamento em que o documento está bloqueado, onde quer que o leitor tenha movido a vista. Só com esse bloqueio desativado escreve onde a vista está, incluindo o ajuste que uma aterragem faz.  
Escreve a vista de nomes que o documento contém, nunca a que [nameView](#nameview) ou a barra de controlos mostram por cima dela, mesmo num documento cujo bloqueio `Name View` está desativado.  
Continua a devolver o documento depois de [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Mostra um documento a partir do seu texto, substituindo o que está mostrado, e ajusta-o à vista — consulte [Carregamento](#loading). Recebe o texto que um ficheiro ou o `value` do editor contém.  
Um texto que não se consegue analisar gera uma exceção antes de qualquer coisa mudar, e o documento mostrado fica: um `SyntaxError` para texto que não é JSON, um `TypeError` para JSON que não contém nenhum documento, como `7`. Uma cadeia em branco, ou qualquer valor que não seja uma cadeia, mostra um diagrama vazio.  
Atribuí-lo aborta uma obtenção de `src` que ainda decorre, e não emite `load` nem `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Mostra o diagrama numa [vista de nomes](../guide/guides/logical-names.md#name-view) por cima da que o documento contém: `'physical'` para `Physical Names`, `'logical'` para `Logical Names` ou `'both'` para `Both Names`. `null`, a predefinição, mostra a do próprio documento, e um valor de atributo que não seja um dos três é lido como `null`.  
Mantém-se em vigor sobre todos os documentos carregados depois dela, e [value](#value) nunca a escreve. Remover o atributo volta à vista do próprio documento.  
A lista `Name View` da [barra de controlos](#controls) também muda a vista, até o documento seguinte chegar ou `nameView` mudar de novo. Uma mudança aí também não é escrita em `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Mostra o minimapa no canto superior direito, enquanto o documento contém uma tabela, uma nota visível ou um grupo de tabelas visível. Está ativado por predefinição.  
Funciona como o do editor: clique nele para mover a vista para aí, ou arraste o seu retângulo de visualização para deslocar a vista — consulte [Navegar na tela](../guide/guides/table-related-functions.md#getting-around-the-canvas). Um dedo nele pertence à página até o visualizador ter o foco.  
Só `minimap="false"` o desativa. Um atributo sem valor, qualquer outro valor e a ausência de atributo deixam-no ativado.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Mostra a barra de controlos sobre o meio da margem inferior da tela. Está ativada por predefinição e contém, da esquerda para a direita:

- O zoom: `Zoom out`, o zoom atual em percentagem e `Zoom in`. Os dois botões dão passos de zoom como as teclas de zoom, e clicar na percentagem, `Reset zoom`, repõe-no em `100%`. Cada um indica a sua tecla na dica.
- `Fit`, que faz zoom e desloca a vista para que todo o diagrama apareça na vista, centrado.
- `Name View`, um botão que indica a vista em vigor e abre uma lista de `Physical Names`, `Logical Names` e `Both Names` por cima da barra — consulte [nameView](#nameview).
- A bússola `Go to content`, que se junta ao fim da barra apenas enquanto nenhuma parte do diagrama está no ecrã, e leva a vista à parte mais próxima dele.

A barra fica da esquerda para a direita em todos os idiomas.  
Só `controls="false"` a desativa, com a sua bússola e a sua lista `Name View`. Um atributo sem valor, qualquer outro valor e a ausência de atributo deixam-na ativada. Sem a barra, a roda, o gesto de pinça e as teclas continuam a fazer zoom depois de o visualizador ter o foco.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Eventos {#event}

`load` e `error` são os únicos dois eventos, e ambos dizem respeito a `src`. Nenhum dos dois borbulha, pelo que deve escutar no próprio elemento.

### load {#load}

Emitido quando o documento que `src` indica foi obtido e mostrado. `event.detail` é `null`.  
Atribuir `value` não emite nenhum, e uma obtenção que um `src` posterior, um `value`, a retirada do elemento da página ou [destroy](#destroy) abortou também não.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Emitido quando a obtenção de `src` falha: a rede ou o CORS recusou o pedido, a resposta não era `ok` ou o seu texto não foi analisado. O visualizador mostra então um diagrama vazio e o aviso `Couldn't load the diagram` — consulte [Carregamento](#loading).  
`event.detail` é a causa: o `TypeError` com que `fetch()` é rejeitado, um `Error` que nomeia o estado, como `GET /missing.erd.json answered 404 Not Found`, ou o `SyntaxError` ou `TypeError` do analisador.  
Uma obtenção que algo abortou não emite nada.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Define um tema predefinido, recebendo o `ThemeOptions` do editor — consulte [setPresetTheme](./erd-editor-element.md#setpresettheme).  
O visualizador começa com `appearance: 'system'`, `grayColor: 'slate'` e `accentColor: 'indigo'`, pelo que desde a primeira imagem mostra o claro ou o escuro que o sistema operativo indica, e muda quando isso muda. O editor começa, em vez disso, em escuro.  
Cada campo é aplicado por si só, pelo que uma chamada parcial deixa os outros dois como estão. Um valor que não seja um dos nomes é ignorado, e a chamada nunca gera uma exceção.  
O visualizador não tem criador de temas nem `systemDarkMode`, e não emite nenhum evento para um tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Indica o claro ou o escuro que o aspeto `'system'` mostra, para uma página com um claro e um escuro próprios. Enquanto um estiver indicado, as mudanças do sistema operativo são ignoradas.  
`null`, ou qualquer valor que não seja `'dark'` nem `'light'`, volta a seguir o sistema operativo.  
Enquanto o aspeto é `'light'` ou `'dark'`, não altera nada no ecrã, mas o valor é mantido e aplica-se logo que o aspeto passe a `'system'`. Não emite nada.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Substitui tokens do tema por cima do tema predefinido, recebendo os tokens `Theme` do editor — consulte [setTheme](./erd-editor-element.md#settheme).  
Cada chamada substitui toda a sobreposição, pelo que deve passar `{}` para voltar ao tema predefinido. Apenas os nomes de token, com valores de cadeia, são mantidos, e um `setPresetTheme` posterior troca o tema predefinido por baixo enquanto as substituições ficam.  
As propriedades personalizadas CSS `--erd-editor-*` chegam também ao visualizador, definidas no elemento ou em qualquer ponto acima dele — consulte [Variáveis CSS](./erd-editor-element.md#css-variables). A tela, que nenhuma folha de estilos alcança, volta a lê-las quando muda uma folha de estilos no `head` da página, ou quando muda o atributo `class` ou `style` do elemento ou de um elemento acima dele. Uma regra acrescentada com `insertRule()` não altera nenhum destes, pelo que a tela só a assume na mudança seguinte.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Define o idioma de apresentação: `'system'`, a predefinição, ou um dos 25 códigos que o [idioma de apresentação](./erd-editor-element.md#display-language) do editor lista. Qualquer outra coisa, como um simples `'ko'` ou um valor que não seja uma cadeia, é ignorada.  
O idioma altera as dicas da barra de controlos, a lista `Name View`, a paleta, os avisos de carregamento e as palavras que o próprio diagrama desenha, como `unnamed`. Os nomes, os comentários e o resto do documento nunca são traduzidos.

O inglês faz parte da entrada do visualizador e aplica-se antes de a chamada devolver. Todos os outros idiomas são um módulo próprio, que o seu bundler emite como um chunk ao lado do visualizador e que o visualizador vai buscar ao seu bundle na primeira vez que uma página pede esse idioma, uma vez para todos os visualizadores da página. Até chegar, o visualizador continua a mostrar o idioma que mostrava, o inglês numa primeira imagem. Se falhar o carregamento, o visualizador mostra o inglês, e pedir esse idioma de novo tenta outra vez.  
A compilação da [etiqueta script](./installation.md#script-tag) contém os 25 idiomas, pelo que não vai buscar nenhum. Um bundle que contenha também o editor carrega todos os idiomas com o chunk do editor — consulte [Registar os elementos](./installation.md#registering-the-elements).  
A `Promise` que devolve é resolvida quando esse idioma chegou ou falhou, e nunca é rejeitada. Esse idioma, ou o inglês depois de uma falha, fica então em vigor, a menos que uma chamada posterior tenha pedido outro: prevalece a chamada posterior, seja qual for a ordem em que os idiomas chegam.

O hebraico, o árabe e o persa dispõem a paleta e os avisos de carregamento da direita para a esquerda. A tela, o minimapa, as barras de deslocamento e a barra de controlos com a sua bússola ficam da esquerda para a direita, como a tela do editor — consulte [Idiomas da direita para a esquerda](../guide/guides/language-and-theme.md#right-to-left-languages).  
O visualizador define `lang` e `dir` na sua própria raiz dentro do shadow root fechado, nunca no elemento host nem na página.  
Não emite nada, e o visualizador não tem seletor de idioma e não guarda nada.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Indica o idioma que `'system'` representa, como uma etiqueta BCP 47, para uma página com uma definição de idioma própria.  
A etiqueta é aparada. `null`, uma cadeia em branco ou um valor que não seja uma cadeia volta aos idiomas da página.  
Esses são o `<html lang>` da página e, depois, o `navigator.languages` do navegador, lidos uma só vez, quando o visualizador se liga pela primeira vez. `'system'` toma o primeiro deles para o qual o visualizador tem um idioma, pela regra do editor em [setSystemLocale](./erd-editor-element.md#setsystemlocale), e o inglês quando não tem nenhum. Assim, uma página cujo `<html lang>` indica um idioma que o visualizador tem mostra esse idioma seja qual for a preferência do navegador, e uma mudança posterior de `lang` ou dos idiomas do navegador não move nenhum visualizador.  
Só importa enquanto a opção em vigor é `'system'`, e a sua `Promise` é resolvida como a de [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Termina o visualizador para sempre. Desmonta a vista antes de devolver, quer o elemento ainda esteja na página, quer tenha sido retirado primeiro, aborta uma obtenção de `src` que ainda decorre e deixa de seguir o esquema de cores do sistema operativo e os estilos da página.  
Um visualizador destruído já não desenha nada, não obtém nada e não pede nenhum idioma, mesmo que seja acrescentado de novo a uma página. Ler [value](#value) continua a devolver o documento que continha.  
Retirar o elemento da página não o destrói: voltando a pô-lo, continua, e obtém um `src` que ainda não mostrou — consulte [Carregamento](#loading).

```js
viewer.destroy();
```

## Foco e teclas {#focus-and-keys}

Um visualizador não toma o foco ao ser montado, quando um documento chega nem quando a sua paleta se fecha, pelo que nunca desloca a página para si nem toma as teclas da página.  
Um clique ou um toque na sua tela dá-lhe o foco sem deslocar a página, e é uma paragem da tecla `Tab`. Ao contrário do editor, não tem nenhum membro `focus()` nem `blur()` próprio. Premir em qualquer outro ponto da página volta a tirar-lhe o foco.

Até o visualizador ter o foco, a página fica com a roda, que desloca a página, e com o gesto de pinça do trackpad. Um dedo na tela desloca a página e não desloca nada na vista, e todas as teclas chegam à página sem serem impedidas.  
Quando tem o foco:

- A roda desloca a vista, e `Shift + Wheel` desloca-a para os lados. Sobre uma nota cujo texto transborda, a roda desloca a nota.
- `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac), o gesto de pinça do trackpad ou dois dedos num ecrã tátil fazem zoom.
- Um dedo desloca a vista.
- `Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` e `⌘ + Minus` (Mac) dão passos de zoom como os botões `Zoom in` e `Zoom out`, e `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta direto a `100%`, mantendo o meio do ecrã onde está.
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) abre a paleta, e `Esc` fecha-a.

Estas são as suas únicas teclas, e não podem ser reassociadas. Todas as outras teclas chegam à página sem serem impedidas, com ou sem foco: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` e todas as combinações que editam no editor.

A paleta pesquisa apenas o documento e não lista nenhum comando. A sua entrada vazia mostra os prefixos: `#` pesquisa as tabelas, `@` as colunas, `:` os comentários e as notas, e `?` lista os prefixos, como no editor — consulte [Pesquisar no diagrama](../guide/guides/quick-search.md#searching-the-diagram). Uma palavra sem prefixo mostra `No commands match` por cima das linhas que pesquisam o diagrama por ela.  
Escolher uma linha move a vista pela regra do editor, [Onde termina um salto](../guide/guides/table-related-functions.md#where-a-jump-lands), deixando o zoom como está, e contorna o que alcançou, trazido para a frente: a tabela, a tabela que contém a coluna ou o comentário, ou a nota.  
Escolher uma linha ou premir `Esc` fecha a paleta e deixa o foco sem nenhum elemento, pelo que a roda seguinte desloca a página; clique na vista para lhe voltar a dar a roda e as teclas. Enquanto a paleta está aberta, a roda desloca a sua lista, e as teclas de zoom não fazem nada.

Com ou sem foco, um arrastamento com o botão principal do rato desloca a vista a partir de qualquer ponto da tela, numa tabela também. Um clique ou um toque que não se move ilumina relações: numa tabela, as relações dessa tabela; numa linha de relação, essa linha; em qualquer outro sítio, uma nota incluída, apaga a iluminação. Esse clique limpa também o contorno que um salto da paleta deixou. O ponteiro pousado numa tabela ilumina as suas relações enquanto lá está.  
Nenhuma pressão seleciona, move ou edita nada. Não há nenhuma seleção além do contorno de um salto, nem caixa de seleção, e nenhum duplo clique nem `Enter` abre uma célula.

## Carregamento {#loading}

Enquanto `src` carrega, um aviso sobre o meio da tela diz `Loading diagram` ao lado de um indicador a rodar. Quando um carregamento falha, diz `Couldn't load the diagram` ao lado de um sinal de aviso, até um novo `src` ou um `value` ocupar o seu lugar ou `src` ser removido. As pressões atravessam o aviso até à tela, e este lê-se no idioma de apresentação, da direita para a esquerda num idioma da direita para a esquerda.

Todos os documentos que chegam, de `src` ou de `value`, são ajustados à caixa do visualizador: com zoom e deslocamento para que todo o diagrama apareça, centrado, como faz `Fit`, deixando de lado o zoom e o deslocamento que o ficheiro guardou. Um documento entregue antes de o visualizador ter um tamanho, definido antes de estar numa página ou enquanto a sua caixa está vazia, é ajustado quando passa a ter um. Um redimensionamento posterior mantém o zoom; `Fit` ajusta de novo.

O visualizador só obtém um `src` enquanto está numa página. Retirá-lo aborta uma obtenção que ainda decorre, e voltar a pô-lo obtém um `src` que ainda não mostrou, um que falhou incluído, nunca um que já mostra. Um visualizador que já não é necessário termina-se com [destroy](#destroy).

## O que acrescenta a uma página {#what-it-adds-to-a-page}

- Nenhum worker. Não inicia nenhum, pelo que uma Content Security Policy não precisa de `worker-src` para ele.
- Nenhum armazenamento. Não escreve nenhum cookie, `localStorage`, `sessionStorage` nem IndexedDB.
- Dois tipos de pedido: a obtenção de [src](#src), cuja origem uma política restrita lista em `connect-src`, e o módulo de um idioma de apresentação que não seja o inglês, a partir do seu próprio bundle — consulte [setLocale](#setlocale).
- Estilos em folhas de estilo construídas, que um `style-src` restrito deixa passar. Um navegador sem folhas de estilo construídas, como o Firefox anterior à 101, recebe em vez disso elementos `<style>`, que precisam de `style-src 'unsafe-inline'`.
- Listeners em `window`. Importar a entrada acrescenta três durante a vida da página, para `mousedown`, `touchstart` e o evento `@dineug/erd-editor/internal-forward-move-start` do próprio pacote. O Konva, que desenha a tela, define `window.Konva` e, com o seu primeiro stage, acrescenta listeners de rato e de toque a `window` e um listener `visibilitychange` a `document`, que nunca remove. A entrada do editor acrescenta os mesmos.
- Até [destroy](#destroy), cada visualizador segue o esquema de cores do sistema operativo e vigia os estilos da página à procura das propriedades personalizadas que [setTheme](#settheme) descreve.
