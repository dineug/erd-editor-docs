---
sidebar_position: 4
description: Desenhe um documento como PNG ou SVG a partir do seu próprio código com toImage, usando as opções da caixa de diálogo Export image, num navegador e no worker de exportação onde existir.
---

# toImage

A partir da `5.0.0`, a raiz do pacote exporta `toImage()`, que desenha um documento como PNG ou SVG sem nenhum editor na página.  
Escreve os ficheiros que os botões `PNG` e `SVG` da caixa de diálogo [Export image](../guide/guides/file-import-export.md#image) escrevem, com as três opções da caixa de diálogo, `Background`, `Dark mode` e `Scale`, e nenhuma outra.

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

`ToImageOptions` é exportado como tipo ao lado dela — consulte [Pontos de entrada](./installation.md#entry-points).

## value {#value}

O texto do documento: o que contém um ficheiro `.erd.json`, o [value](./erd-editor-element.md#value) ou o [runtimeValue](./erd-editor-element.md#runtimevalue) de um editor, ou qualquer outro texto que [setInitialValue](./erd-editor-element.md#setinitialvalue) carregue.  
Um texto vazio, ou só com espaços em branco, desenha um diagrama vazio, e o mesmo acontece com um JSON que não contém nenhum dos campos de um documento, que o analisador preenche com valores predefinidos.

## Opções {#options}

| Opção | Predefinição | Descrição |
| --- | --- | --- |
| `format` | Nenhuma; é obrigatória | `'png'` resolve para um `Blob` do tipo `image/png`, `'svg'` para o código do SVG como cadeia. |
| `background` | `true` | Pinta a cor da tela por trás do diagrama. `false` deixa-a transparente, incluindo a caixa por trás de uma etiqueta ON DELETE ou ON UPDATE. |
| `darkMode` | `false` | Desenha o tema escuro em vez do claro. |
| `scale` | `2` | `1`, `2` ou `3` píxeis de imagem por unidade do diagrama a 100%. Dimensiona apenas o PNG; um SVG tem o tamanho do diagrama, seja qual for a escala. |

`toImage()` não lê nenhuma outra chave, pelo que uma chave que a tabela não lista não altera nada.

## O que desenha {#what-it-draws}

A imagem é a que a caixa de diálogo desenha:

- O diagrama inteiro, recortado ao que desenha mais uma margem e sempre a 100%, seja qual for o zoom com que o documento foi guardado, pelo que todas as tabelas são desenhadas por inteiro. O que as [Opções de vista](../guide/guides/table-related-functions.md#table-view-options) ocultam no documento não é desenhado nem recebe espaço, os grupos de tabelas são desenhados por trás de tudo o resto, e as cores que as [verificações do dicionário](../guide/guides/dictionary.md#marks-on-the-canvas) dão aos nomes não são desenhadas.
- Um PNG tem o tamanho do diagrama a 100% vezes `scale`. Um demasiado grande para uma tela de navegador é escrito com resolução reduzida em vez de falhar, e `toImage()` não o indica.
- Um SVG mantém o seu texto como texto e nomeia os seus tipos de letra em vez de os incorporar, pelo que um visualizador sem o tipo de letra do editor desenha outro. As sombras ficam de fora.

Onde a caixa de diálogo toma o ecrã do editor, `toImage()` toma apenas o documento, pelo que um documento é desenhado da mesma forma em todas as páginas:

- As suas cores são o tema predefinido do cinzento e do destaque predefinidos do elemento, `slate` e `indigo`, claro a menos que `darkMode` seja `true`. Nenhum tema da página, nenhuma substituição de [setTheme](./erd-editor-element.md#settheme) e nenhuma alteração do [criador de temas](../guide/guides/language-and-theme.md) o alcança.
- As suas tabelas e colunas são nomeadas na [vista de nomes](../guide/guides/logical-names.md#name-view) que o documento contém, que, para um ficheiro com o bloqueio `Name View` ativado, é a bloqueada.
- As palavras que o próprio diagrama desenha, como o marcador de uma tabela sem nome, estão em inglês.

## Onde funciona {#where-it-runs}

`toImage()` precisa de uma página de navegador, uma vez que mede e desenha numa tela. A raiz do pacote de onde vem precisa de um DOM para carregar, pelo que não é alcançada a partir do Node nem de um Web Worker — consulte [Renderização do lado do servidor](./installation.md#server-side-rendering).  
Espera que os tipos de letra da página terminem de carregar antes de desenhar.

Desenha no worker partilhado de exportação de imagem onde o host executa um, como faz a caixa de diálogo, pelo que a página continua a responder entretanto, e na thread principal onde não há nenhum ou o worker não responde a tempo — consulte [Web Workers](./installation.md#web-workers).  
Um bundle que importa `toImage` e nenhum elemento leva apenas o worker de exportação de imagem.  
Nenhuma das compilações da [etiqueta script](./installation.md#script-tag) o leva: `window.ErdEditor` e `window.ErdViewer` não têm `toImage`.

## Rejeições {#rejections}

A Promise que devolve é rejeitada, antes de se desenhar o que quer que seja, quando:

- a página não tem `document`: um `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` não é uma cadeia, como um documento já analisado para um objeto: um `TypeError`;
- uma opção contém um valor que a tabela de [Opções](#options) não lista, incluindo um `format` em falta, e o mesmo acontece com um `scale` de `'2'` passado com um SVG: um `TypeError` que nomeia a opção, como em `toImage: scale cannot be 4`;
- o texto não é um documento que o analisador consiga ler: o erro do analisador, um `SyntaxError` para texto que não é JSON.

## Caixa de diálogo Export Image {#export-image-dialog}

A caixa de diálogo e `toImage()` desenham através da mesma exportação, pelo que, com as mesmas opções, escrevem a mesma imagem, mas partem de sítios diferentes:

| | Caixa de diálogo `Export image` | `toImage()` |
| --- | --- | --- |
| Documento | O diagrama tal como estava quando a caixa de diálogo se abriu | O texto que passar |
| Modo escuro | Começa a corresponder ao aspeto do editor e, enquanto corresponde, desenha as cores do próprio ecrã | Desativado a menos que `darkMode` seja `true`, e sempre o tema predefinido |
| Vista de nomes | A que o editor mostra | A que o documento contém |
| Idioma das suas próprias palavras | O idioma de apresentação do editor | Inglês |
| Resultado | Guardado através do navegador ou do [callback de exportação](./installation.md#file-dialogs), ou copiado para a área de transferência | Devolvido a si; nenhum dos callbacks de ficheiros é chamado |

`Copy to clipboard` não tem equivalente. Uma página que queira um escreve ela própria o `Blob` PNG na área de transferência.
