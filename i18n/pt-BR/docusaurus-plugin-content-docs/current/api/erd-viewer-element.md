---
sidebar_position: 3
description: A API do elemento erd-viewer — um diagrama somente leitura a partir de um value ou de uma URL em src, seu minimapa e sua barra de controles, os eventos load e error, temas, idioma de exibição, foco e teclas, carregamento e o que ele adiciona a uma página.
---

# ErdViewerElement

A partir da `5.0.0`, o pacote também traz `<erd-viewer>`, uma visão somente leitura de um documento: quem lê desloca a área visível, aplica zoom, pesquisa e acende relacionamentos, e nada nele edita. Ele desenha apenas o canvas ERD, com suas barras de rolagem, um [minimapa](#minimap), uma [barra de controles](#controls) e uma paleta que pesquisa o documento, e não tem barra de ferramentas, abas, explorador nem menu de contexto.

```js
import '@dineug/erd-editor/erd-viewer.js';
```

```html
<erd-viewer src="/diagrams/shop.erd.json" style="display: block; height: 480px"></erd-viewer>
```

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

O quadro acima é este elemento como o erd-editor.io/embed o mostra, aqui com o exemplo da livraria: clique nele para dar o foco e aplique zoom e pesquise com as teclas de [Foco e teclas](#focus-and-keys), e consulte [Incorporação](../guide/guides/embedding.md) para incorporar um documento seu sem código.

O visualizador é um `HTMLElement` comum.  
Sua definição de tipo é a seguinte.

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

Importar `@dineug/erd-editor/erd-viewer.js` define `<erd-viewer>` e deixa `<erd-editor>` indefinido. Importar a raiz do pacote não define nenhum dos dois: ela exporta a classe `ErdViewerElement` e `defineErdViewer()`, que define a tag onde você a chama, então uma página também pode definir a classe sob uma tag própria — consulte [Registrar os elementos](./installation.md#registering-the-elements).  
Todo ponto de entrada, exceto `engine.js` e `peer.js`, precisa de um DOM, este também, então uma página renderizada no servidor o importa no cliente — consulte [Renderização no lado do servidor](./installation.md#server-side-rendering).  
Importar o ponto de entrada adiciona `erd-viewer` a `HTMLElementTagNameMap`, então `document.createElement('erd-viewer')` e `document.querySelector('erd-viewer')` são tipados como `ErdViewerElement` sem conversão (cast).

Como o editor, o visualizador renderiza em um shadow root fechado, então `viewer.shadowRoot` é `null` e os estilos da página não vazam para dentro nem para fora; estilize-o por [setTheme](#settheme) e pelas propriedades personalizadas `--erd-editor-*`. Vários visualizadores em uma página mantêm cada um o seu documento, a sua área visível, o seu tema e o seu idioma.  
`<erd-viewer>` não tem tamanho intrínseco. Um elemento personalizado é inline, então dê a ele `display: block` e uma altura, como acima. A visão preenche a caixa do elemento e a acompanha ao ser redimensionada, mantendo o zoom.

`src`, `name-view`, `minimap` e `controls` são os seus únicos atributos, cada um com uma propriedade de mesmo nome, `nameView` para `name-view`. [value](#value) é apenas uma propriedade.  
Um `value`, `src`, `nameView`, `minimap` ou `controls` definido no elemento antes de a tag dele ser definida, por exemplo por um framework que renderiza o elemento antes de o ponto de entrada ter carregado, é assumido quando a tag é definida, sobre os atributos que a marcação deu a ele. Eles são assumidos na ordem em que a página escreveu cada um pela primeira vez, então o último entre `value` e `src` prevalece. Um `value` que não contém um documento não tem então nenhum chamador a quem lançar o erro: ele é relatado como um erro não capturado, e o visualizador fica vazio.

O build da tag script, `dist/erd-viewer.umd.js`, contém apenas o visualizador com todas as dependências. Ele define `<erd-viewer>` e coloca `ErdViewerElement` e `defineErdViewer` em `window.ErdViewer`. Uma URL de CDN sem caminho entrega o build do editor em vez disso, então nomeie o arquivo — consulte [Tag script](./installation.md#script-tag).

```html
<erd-viewer src="diagram.erd.json" style="display: block; height: 480px"></erd-viewer>
<script src="https://cdn.jsdelivr.net/npm/@dineug/erd-editor@5.0.0/dist/erd-viewer.umd.js"></script>
```

## src {#src}

A URL de um documento para o visualizador buscar e mostrar. O padrão é `''`, nenhuma.  
A busca é um `fetch()` simples, um `GET` sem opções próprias, então as regras de CORS do navegador a governam: um documento em outra origem precisa de um servidor que permita a origem da página, e os cookies vão apenas para a origem da própria página. Uma URL relativa é resolvida em relação à página.  
A resposta precisa conter um documento como um arquivo `.erd.json` contém, a forma de armazenamento que o [value](./erd-editor-element.md#value) do editor e todos os hosts oficiais escrevem. Nenhum outro formato é lido: um arquivo SQL, GraphQL, DBML ou AML falha como texto que não é analisado.  
Um documento que é analisado chega ajustado à visão e emite [load](#load). Uma requisição que a rede ou o CORS recusou, uma resposta que não é `ok` ou um texto que não é analisado emite [error](#error) e deixa um diagrama vazio — consulte [Carregamento](#loading).

Só a requisição mais recente conta. Um novo `src` aborta a busca em andamento, então uma resposta lenta nunca chega por cima de um documento posterior. Atribuir [value](#value) também a aborta, e o mesmo vale para remover `src` ou defini-lo como `''`, o que deixa de segui-lo e mantém o documento mostrado como estava.  
Prevalece o último entre `value` e `src` definido, tanto pela propriedade quanto pelo atributo. Um `src` escrito depois de um `value` é buscado mesmo quando nomeia a URL buscada antes. Escrito de novo sobre o documento que já mostra, não busca nada.  
O visualizador só busca enquanto está em uma página. Retirá-lo aborta uma busca em andamento, e colocá-lo de volta busca um `src` que ele ainda não mostrou, inclusive um que falhou, nunca um que ele já mostra.  
`src` é o único `fetch()` que o pacote faz, então uma Content Security Policy estrita lista a origem do documento em `connect-src`.

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

Obtém o documento mostrado, venha ele de `src` ou de `value`, como uma string JSON na forma de armazenamento que o [value](./erd-editor-element.md#value) do editor escreve. Antes de qualquer coisa ser mostrada, é um documento novo e vazio, cujo `doc` é `{}`.  
Enquanto o [bloqueio](../guide/guides/settings.md#lock) `Viewport` do documento está ativado, como em um documento novo, ele escreve o zoom e a rolagem em que o documento está bloqueado, onde quer que quem lê tenha movido a visão. Só com esse bloqueio desativado ele escreve onde a visão está, incluindo o ajuste que uma chegada faz.  
Ele escreve a exibição de nomes que o documento contém, nunca a que [nameView](#nameview) ou a barra de controles mostra por cima dela, mesmo em um documento cujo bloqueio `Name View` está desativado.  
Ele ainda retorna o documento depois de [destroy](#destroy).

```js
const data = viewer.value;
```

### setter {#setter}

Mostra um documento a partir do seu texto, substituindo o mostrado, e o ajusta à visão — consulte [Carregamento](#loading). Ele recebe o texto que um arquivo ou o `value` do editor contém.  
Um texto que não é analisado lança um erro antes de qualquer coisa mudar, e o documento mostrado permanece: um `SyntaxError` para texto que não é JSON, um `TypeError` para um JSON que não contém um documento, como `7`. Uma string em branco, ou qualquer coisa que não seja uma string, mostra um diagrama vazio.  
Atribuí-lo aborta uma busca de `src` em andamento e não emite `load` nem `error`.

```js
viewer.value = localStorage.getItem('my-diagram') ?? '';
```

## nameView {#nameview}

Mostra o diagrama em uma [exibição de nomes](../guide/guides/logical-names.md#name-view) por cima da que o documento contém: `'physical'` para `Physical Names`, `'logical'` para `Logical Names` ou `'both'` para `Both Names`. `null`, o padrão, mostra a do próprio documento, e um valor de atributo diferente dos três é lido como `null`.  
Ela continua em vigor sobre todo documento carregado depois dela, e [value](#value) nunca a escreve. Remover o atributo volta à exibição do próprio documento.  
A lista `Name View` da [barra de controles](#controls) também troca a exibição, até que o próximo documento chegue ou `nameView` mude de novo. Uma troca ali também não é escrita em `value`.

```js
viewer.nameView = 'both';
// or
viewer.setAttribute('name-view', 'both');
```

```html
<erd-viewer name-view="logical"></erd-viewer>
```

## minimap {#minimap}

Mostra o minimapa no canto superior direito, enquanto o documento contém uma tabela, uma nota visível ou um grupo de tabelas visível. Está ativado por padrão.  
Funciona como o do editor: clique nele para mover a visão até ali, ou arraste o retângulo da área visível para deslocá-la — consulte [Navegar pelo canvas](../guide/guides/table-related-functions.md#getting-around-the-canvas). Um dedo sobre ele pertence à página até que o visualizador tenha o foco.  
Apenas `minimap="false"` o desativa. Um atributo sem valor, qualquer outro valor e a ausência do atributo o mantêm ativado.

```js
viewer.minimap = false;
// or
viewer.setAttribute('minimap', 'false');
```

```html
<erd-viewer minimap="false"></erd-viewer>
```

## controls {#controls}

Mostra a barra de controles sobre o meio da borda inferior do canvas. Está ativada por padrão e contém, da esquerda para a direita:

- O zoom: `Zoom out`, o zoom atual como porcentagem e `Zoom in`. Os dois botões dão passos de zoom como as teclas de zoom, e clicar na porcentagem, `Reset zoom`, a leva de volta a `100%`. Cada um indica a sua tecla na dica de ferramenta.
- `Fit`, que aplica zoom e rola para que o diagrama inteiro apareça na visão, centralizado.
- `Name View`, um botão que mostra o nome da exibição em vigor e abre acima da barra uma lista com `Physical Names`, `Logical Names` e `Both Names` — consulte [nameView](#nameview).
- A bússola `Go to content`, que aparece no fim da barra só enquanto nenhuma parte do diagrama está na tela, e leva a visão à parte mais próxima dele.

A barra fica da esquerda para a direita em todos os idiomas.  
Apenas `controls="false"` a desativa, com a sua bússola e a sua lista `Name View`. Um atributo sem valor, qualquer outro valor e a ausência do atributo a mantêm ativada. Sem a barra, a roda, o gesto de pinça e as teclas ainda aplicam zoom quando o visualizador tem o foco.

```js
viewer.controls = false;
// or
viewer.setAttribute('controls', 'false');
```

```html
<erd-viewer controls="false"></erd-viewer>
```

## Eventos {#event}

`load` e `error` são os dois únicos eventos, e ambos relatam sobre `src`. Nenhum deles faz bubble, então escute no próprio elemento.

### load {#load}

Emitido quando o documento que `src` nomeia foi buscado e mostrado. `event.detail` é `null`.  
Atribuir `value` não emite nenhum, e o mesmo vale para uma busca que um `src` posterior, um `value`, a retirada do elemento da página ou [destroy](#destroy) abortou.

```js
viewer.addEventListener('load', () => {
  console.log('shown', viewer.src);
});
```

### error {#error}

Emitido quando a busca de `src` falha: a rede ou o CORS recusou a requisição, a resposta não foi `ok` ou o texto dela não foi analisado. O visualizador então mostra um diagrama vazio e o aviso `Couldn't load the diagram` — consulte [Carregamento](#loading).  
`event.detail` é a causa: o `TypeError` com que `fetch()` é rejeitado, um `Error` que nomeia o status, como `GET /missing.erd.json answered 404 Not Found`, ou o `SyntaxError` ou `TypeError` do analisador.  
Uma busca que algo abortou não emite nada.

```js
viewer.addEventListener('error', event => {
  console.warn('could not show', viewer.src, event.detail);
});
```

## setPresetTheme {#setpresettheme}

Define um tema predefinido, recebendo os `ThemeOptions` do editor — consulte [setPresetTheme](./erd-editor-element.md#setpresettheme).  
O visualizador começa com `appearance: 'system'`, `grayColor: 'slate'` e `accentColor: 'indigo'`, então desde o primeiro quadro ele mostra o claro ou o escuro que o sistema operacional informa, e troca quando isso muda. O editor começa escuro.  
Cada campo é aplicado por conta própria, então uma chamada parcial deixa os outros dois como estão. Um valor que não é um dos nomes é ignorado, e a chamada nunca lança erro.  
O visualizador não tem construtor de temas nem `systemDarkMode`, e não emite nenhum evento para um tema.

```js
viewer.setPresetTheme({ appearance: 'light', accentColor: 'teal' });
```

## setSystemAppearance {#setsystemappearance}

Nomeia o claro ou o escuro que a aparência `'system'` mostra, para uma página com um claro e um escuro próprios. Enquanto um estiver nomeado, as mudanças do sistema operacional são ignoradas.  
`null`, ou qualquer valor diferente de `'dark'` ou `'light'`, volta a seguir o sistema operacional.  
Enquanto a aparência é `'light'` ou `'dark'`, isso não muda nada na tela, mas o valor é mantido e se aplica assim que a aparência passa a ser `'system'`. Não emite nada.

```js
viewer.setSystemAppearance('dark'); // null follows the OS again
```

## setTheme {#settheme}

Substitui tokens de tema por cima do tema predefinido, recebendo os tokens de `Theme` do editor — consulte [setTheme](./erd-editor-element.md#settheme).  
Cada chamada substitui a sobreposição inteira, então passe `{}` para voltar ao tema predefinido. Somente os nomes de token, com valores de string, são mantidos, e um `setPresetTheme` posterior troca o tema predefinido por baixo enquanto as substituições permanecem.  
As propriedades personalizadas CSS `--erd-editor-*` também chegam ao visualizador, definidas no elemento ou em qualquer lugar acima dele — consulte [Variáveis CSS](./erd-editor-element.md#css-variables). O canvas, que nenhuma folha de estilo alcança, as lê de novo quando uma folha de estilo no `head` da página muda, ou quando o atributo `class` ou `style` do elemento ou de um elemento acima dele muda. Uma regra adicionada com `insertRule()` não muda nenhuma dessas coisas, então o canvas a assume na próxima mudança desse tipo.

```css
erd-viewer {
  --erd-editor-canvas-background: #ffffff;
}
```

## setLocale {#setlocale}

Define o idioma de exibição: `'system'`, o padrão, ou um dos 25 códigos que o [Idioma de exibição](./erd-editor-element.md#display-language) do editor lista. Qualquer outra coisa, como um `'ko'` simples ou um valor que não é uma string, é ignorada.  
O idioma muda as dicas de ferramenta da barra de controles, a lista `Name View`, a paleta, os avisos de carregamento e as palavras que o próprio diagrama desenha, como `unnamed`. Nomes, comentários e o restante do documento nunca são traduzidos.

O inglês faz parte do ponto de entrada do visualizador e se aplica antes de a chamada retornar. Todo outro idioma é um módulo próprio, que o seu bundler gera como um chunk ao lado do visualizador e que o visualizador busca do seu bundle na primeira vez que uma página pede esse idioma, uma vez para todos os visualizadores da página. Até ele chegar, o visualizador continua mostrando o idioma que mostrava, o inglês no primeiro quadro. Se ele não carregar, o visualizador mostra o inglês, e pedir esse idioma de novo tenta outra vez.  
O build da [tag script](./installation.md#script-tag) contém os 25 idiomas, então não busca nenhum. Um bundle que também contém o editor carrega todos os idiomas com o chunk do editor — consulte [Registrar os elementos](./installation.md#registering-the-elements).  
A `Promise` que ele retorna é resolvida quando esse idioma chegou ou falhou em chegar, e nunca é rejeitada. Esse idioma, ou o inglês após uma falha, passa então a valer, a menos que uma chamada posterior tenha pedido outro: a chamada posterior prevalece, qualquer que seja a ordem em que os idiomas chegam.

Hebraico, árabe e persa dispõem a paleta e os avisos de carregamento da direita para a esquerda. O canvas, o minimapa, as barras de rolagem e a barra de controles com a sua bússola continuam da esquerda para a direita, como o canvas do editor — consulte [Idiomas da direita para a esquerda](../guide/guides/language-and-theme.md#right-to-left-languages).  
O visualizador define `lang` e `dir` na própria raiz dentro do shadow root fechado, nunca no elemento host nem na página.  
Ele não emite nada, e o visualizador não tem seletor de idioma e não armazena nada.

```js
await viewer.setLocale('ko-KR');
```

## setSystemLocale {#setsystemlocale}

Nomeia o idioma que `'system'` representa, como uma tag BCP 47, para uma página com uma configuração de idioma própria.  
A tag tem os espaços das pontas removidos. `null`, uma string em branco ou um valor que não é uma string volta aos idiomas da página.  
Esses são o `<html lang>` da página e depois o `navigator.languages` do navegador, lidos uma vez, quando o visualizador se conecta pela primeira vez. `'system'` usa o primeiro deles para o qual o visualizador tem um idioma, pela regra do editor em [setSystemLocale](./erd-editor-element.md#setsystemlocale), e o inglês quando ele não tem nenhum. Assim, uma página cujo `<html lang>` nomeia um idioma que o visualizador tem mostra esse idioma, qualquer que seja a preferência do navegador, e uma mudança posterior de `lang` ou dos idiomas do navegador não move nenhum visualizador.  
Só importa enquanto a opção em vigor é `'system'`, e a sua `Promise` é resolvida como a de [setLocale](#setlocale).

```js
viewer.setSystemLocale('ja-JP'); // null goes back to the page's languages
```

## destroy {#destroy}

Encerra o visualizador de vez. Ele desmonta a visão antes de retornar, esteja o elemento ainda na página ou tenha sido retirado antes, aborta uma busca de `src` em andamento e deixa de seguir o esquema de cores do sistema operacional e os estilos da página.  
Um visualizador destruído não desenha mais nada, não busca nada e não pede nenhum idioma, mesmo se adicionado a uma página de novo. Ler [value](#value) ainda retorna o documento que ele continha.  
Retirar o elemento da página não o destrói: recolocado, ele continua e busca um `src` que ainda não mostrou — consulte [Carregamento](#loading).

```js
viewer.destroy();
```

## Foco e teclas {#focus-and-keys}

Um visualizador não toma o foco ao ser montado, quando um documento chega nem quando a sua paleta fecha, então nunca rola a página até ele nem toma as teclas da página.  
Um clique ou um toque no canvas dele o foca sem rolar a página, e ele é uma parada da tecla `Tab`. Ao contrário do editor, ele não tem um membro `focus()` nem `blur()` próprio. Pressionar em qualquer outro lugar da página tira o foco dele de novo.

Até que o visualizador tenha o foco, a página mantém a roda, que rola a página, e o gesto de pinça do trackpad. Um dedo no canvas rola a página e não desloca nada, e toda tecla chega à página sem ser impedida.  
Quando ele tem o foco:

- A roda desloca a visão, e `Shift + Wheel` a desloca para os lados. Sobre uma nota cujo texto transborda, a roda rola a nota.
- `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac), um gesto de pinça no trackpad ou dois dedos em uma tela sensível ao toque aplicam zoom.
- Um dedo desloca a visão.
- `Ctrl + Plus` e `Ctrl + Minus` (Windows/Linux) ou `⌘ + Plus` e `⌘ + Minus` (Mac) dão passos de zoom como os botões `Zoom in` e `Zoom out`, e `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta direto a `100%`, mantendo o meio da tela onde está.
- `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) abre a paleta, e `Esc` a fecha.

Essas são as suas únicas teclas, e não podem ser reatribuídas. Toda outra tecla chega à página sem ser impedida, com ou sem foco: `Delete`, `Backspace`, `Space`, `Enter`, `Tab`, `Ctrl + A`, `Ctrl + F` e toda combinação que edita no editor.

A paleta pesquisa apenas o documento e não lista nenhum comando. Sua entrada vazia mostra os prefixos: `#` pesquisa as tabelas, `@` as colunas, `:` os comentários e as notas, e `?` lista os prefixos, como no editor — consulte [Pesquisar no diagrama](../guide/guides/quick-search.md#searching-the-diagram). Uma palavra sem prefixo mostra `No commands match` acima das linhas que pesquisam o diagrama por ela.  
Escolher uma linha move a visão pela regra do editor, [Onde um salto termina](../guide/guides/table-related-functions.md#where-a-jump-lands), deixando o zoom como está, e contorna o que ela alcançou, trazido para a frente: a tabela, a tabela que contém a coluna ou o comentário, ou a nota.  
Escolher uma linha ou pressionar `Esc` fecha a paleta e deixa o foco sem nenhum elemento, então a próxima rolagem da roda rola a página; clique na visão para dar a ela a roda e as teclas de novo. Enquanto a paleta está aberta, a roda rola a lista dela, e as teclas de zoom não fazem nada.

Com ou sem foco, um arrasto com o botão principal do mouse desloca a visão de qualquer ponto do canvas, inclusive sobre uma tabela. Um clique ou um toque sem movimento acende relacionamentos: sobre uma tabela, os relacionamentos dessa tabela; sobre a linha de um relacionamento, essa linha; em qualquer outro lugar, uma nota inclusive, apaga o realce. Esse clique também limpa o contorno que um salto da paleta deixou. O ponteiro parado sobre uma tabela acende os relacionamentos dela enquanto estiver ali.  
Nenhuma pressão seleciona, move ou edita nada. Não há seleção além do contorno de um salto, nem caixa de seleção, e nenhum clique duplo nem `Enter` abre uma célula.

## Carregamento {#loading}

Enquanto `src` carrega, um aviso sobre o meio do canvas diz `Loading diagram` ao lado de um indicador girando. Quando um carregamento falha, ele diz `Couldn't load the diagram` ao lado de um sinal de alerta, até que um novo `src` ou um `value` tome o lugar dele ou `src` seja removido. As pressões atravessam o aviso até o canvas, e ele é escrito no idioma de exibição, da direita para a esquerda em um idioma assim.

Todo documento que chega, de `src` ou de `value`, é ajustado à caixa do visualizador: com zoom e rolagem para que o diagrama inteiro apareça, centralizado, como `Fit` faz, deixando de lado o zoom e a rolagem que o arquivo salvou. Um documento entregue antes de o visualizador ter um tamanho, definido antes de ele estar em uma página ou enquanto a sua caixa está vazia, é ajustado assim que ele tem um. Um redimensionamento posterior mantém o zoom; `Fit` ajusta de novo.

O visualizador busca um `src` apenas enquanto está em uma página. Retirá-lo aborta uma busca em andamento, e colocá-lo de volta busca um `src` que ele ainda não mostrou, inclusive um que falhou, nunca um que ele já mostra. Um visualizador de que não se precisa mais é encerrado com [destroy](#destroy).

## O que ele adiciona a uma página {#what-it-adds-to-a-page}

- Nenhum worker. Ele não inicia nenhum, então uma Content Security Policy não precisa de `worker-src` para ele.
- Nenhum armazenamento. Ele não escreve nenhum cookie, `localStorage`, `sessionStorage` nem IndexedDB.
- Dois tipos de requisição: a busca de [src](#src), cuja origem uma política estrita lista em `connect-src`, e o módulo de um idioma de exibição diferente do inglês, do seu próprio bundle — consulte [setLocale](#setlocale).
- Estilos em folhas de estilo construídas, que um `style-src` estrito deixa passar. Um navegador sem folhas de estilo construídas, como o Firefox anterior ao 101, recebe elementos `<style>` em vez disso, que precisam de `style-src 'unsafe-inline'`.
- Listeners em `window`. Importar o ponto de entrada adiciona três durante a vida da página, para `mousedown`, `touchstart` e o evento `@dineug/erd-editor/internal-forward-move-start` do próprio pacote. O Konva, que desenha o canvas, define `window.Konva` e, com o seu primeiro stage, adiciona listeners de mouse e de toque a `window` e um listener de `visibilitychange` a `document`, que ele nunca remove. O ponto de entrada do editor adiciona os mesmos.
- Até [destroy](#destroy), cada visualizador segue o esquema de cores do sistema operacional e observa os estilos da página em busca das propriedades personalizadas que [setTheme](#settheme) descreve.
