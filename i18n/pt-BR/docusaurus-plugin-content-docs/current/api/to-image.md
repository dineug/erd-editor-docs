---
sidebar_position: 4
description: Desenhe um documento como PNG ou SVG a partir do seu próprio código com toImage, usando as opções da caixa de diálogo Export image, em um navegador e no worker de exportação, onde houver um.
---

# toImage

A partir da `5.0.0`, a raiz do pacote exporta `toImage()`, que desenha um documento como PNG ou SVG sem nenhum editor na página.  
Ele escreve os arquivos que os botões `PNG` e `SVG` da caixa de diálogo [Export image](../guide/guides/file-import-export.md#image) escrevem, com as três opções da caixa, `Background`, `Dark mode` e `Scale`, e nenhuma outra.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` é exportado como tipo ao lado dele — consulte [Pontos de entrada](./installation.md#entry-points).

## value {#value}

O texto do documento: o que um arquivo `.erd.json` contém, o [value](./erd-editor-element.md#value) ou o [runtimeValue](./erd-editor-element.md#runtimevalue) de um editor, ou qualquer outro texto que [setInitialValue](./erd-editor-element.md#setinitialvalue) carregue.  
Um texto vazio, ou só com espaços em branco, desenha um diagrama vazio, e o mesmo vale para um JSON que não contém nenhum dos campos de um documento, que o analisador preenche com os padrões.

## Opções {#options}

| Opção | Padrão | Descrição |
| --- | --- | --- |
| `format` | Nenhum; é obrigatório | `'png'` resolve para um `Blob` do tipo `image/png`, `'svg'` para a marcação do SVG como string. |
| `background` | `true` | Pinta a cor do canvas atrás do diagrama. `false` o deixa transparente, inclusive a caixa sob um rótulo de ON DELETE ou ON UPDATE. |
| `darkMode` | `false` | Desenha o tema escuro no lugar do claro. |
| `scale` | `2` | `1`, `2` ou `3` pixels de imagem por unidade do diagrama a 100%. Dimensiona apenas o PNG; um SVG tem o tamanho do diagrama, qualquer que seja a escala. |

`toImage()` não lê nenhuma outra chave, então uma chave que a tabela não lista não altera nada.

## O que ele desenha {#what-it-draws}

A imagem é a que a caixa de diálogo desenha:

- O diagrama inteiro, recortado ao que ele desenha mais uma margem e sempre a 100%, qualquer que seja o zoom em que o documento foi salvo, então toda tabela é desenhada por inteiro. O que [View Option](../guide/guides/table-related-functions.md#table-view-options) oculta no documento não é desenhado nem recebe espaço, os grupos de tabelas são desenhados atrás de tudo o mais, e as cores que as [verificações do dicionário](../guide/guides/dictionary.md#marks-on-the-canvas) dão aos nomes não são desenhadas.
- Um PNG tem o tamanho do diagrama a 100% vezes `scale`. Um grande demais para um canvas de navegador é escrito em resolução reduzida em vez de falhar, e `toImage()` não avisa.
- Um SVG mantém o texto como texto e nomeia as suas fontes em vez de embuti-las, então um visualizador sem a fonte do editor desenha com outra. As sombras ficam de fora.

Onde a caixa de diálogo usa a tela do editor, `toImage()` usa apenas o documento, então um documento é desenhado igual em toda página:

- Suas cores são as do tema predefinido do cinza e do destaque padrão do elemento, `slate` e `indigo`, claro a menos que `darkMode` seja `true`. Nenhum tema da página, nenhuma substituição de [setTheme](./erd-editor-element.md#settheme) e nenhuma alteração do [construtor de temas](../guide/guides/language-and-theme.md) o alcança.
- Suas tabelas e colunas são nomeadas na [exibição de nomes](../guide/guides/logical-names.md#name-view) que o documento contém, que para um arquivo com o bloqueio `Name View` ativado é a bloqueada.
- As palavras que o próprio diagrama desenha, como o texto provisório de uma tabela sem nome, ficam em inglês.

## Onde ele roda {#where-it-runs}

`toImage()` precisa de uma página de navegador, pois mede e desenha em um canvas. A raiz do pacote de que ele vem precisa de um DOM para carregar, então ele não é alcançado a partir do Node nem de um Web Worker — consulte [Renderização no lado do servidor](./installation.md#server-side-rendering).  
Ele espera as fontes da página terminarem de carregar antes de desenhar.

Ele desenha no shared worker de exportação de imagem onde o host executa um, como a caixa de diálogo faz, para que a página continue responsiva enquanto isso, e na thread principal onde não há nenhum ou o worker não responde a tempo — consulte [Web Workers](./installation.md#web-workers).  
Um bundle que importa `toImage` e nenhum elemento carrega apenas o worker de exportação de imagem.  
Nenhum dos dois builds da [tag script](./installation.md#script-tag) o carrega: `window.ErdEditor` e `window.ErdViewer` não têm `toImage`.

## Rejeições {#rejections}

A Promise que ele retorna é rejeitada, antes de qualquer coisa ser desenhada, quando:

- a página não tem `document`: um `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` não é uma string, como um documento já convertido em objeto: um `TypeError`;
- uma opção contém um valor que a tabela de [Opções](#options) não lista, inclusive um `format` ausente, e o mesmo vale para um `scale` de `'2'` passado com um SVG: um `TypeError` que nomeia a opção, como em `toImage: scale cannot be 4`;
- o texto não é um documento que o analisador consegue ler: o erro do analisador, um `SyntaxError` para texto que não é JSON.

## Caixa de diálogo Export image {#export-image-dialog}

A caixa de diálogo e `toImage()` desenham pela mesma exportação, então, com as mesmas opções, escrevem a mesma imagem, mas partem de lugares diferentes:

| | Caixa de diálogo `Export image` | `toImage()` |
| --- | --- | --- |
| Documento | O diagrama como estava quando a caixa de diálogo abriu | O texto que você passa |
| Dark mode | Começa de acordo com a aparência do editor e, enquanto coincide, desenha as cores da própria tela | Desativado a menos que `darkMode` seja `true`, e sempre o tema predefinido |
| Exibição de nomes | A que o editor mostra | A que o documento contém |
| Idioma das próprias palavras | O idioma de exibição do editor | Inglês |
| Resultado | Salvo pelo navegador ou pelo [callback de exportação](./installation.md#file-dialogs), ou copiado para a área de transferência | Devolvido a você; nenhum dos callbacks de arquivo é chamado |

`Copy to clipboard` não tem equivalente. Uma página que quiser isso escreve ela mesma o `Blob` PNG na área de transferência.
