---
sidebar_position: 18
description: Mostre um diagrama só de leitura noutro site sem código, incorporando erd-editor.io/embed numa moldura, crie o seu URL e a linha do iframe no criador, defina o tema, o idioma, a vista de nomes, o minimapa, os controlos e as cores no URL, e sirva o ficheiro a partir do GitHub ou de um servidor que permita CORS.
---

# Incorporar

O [erd-editor.io/embed](https://erd-editor.io/embed) mostra um diagrama só de leitura num visualizador que preenche a página, para outro site o incorporar numa moldura: uma wiki, um blogue, um construtor de sites ou qualquer página que não consiga carregar scripts próprios.  
O seu parâmetro `src` indica o documento, o endereço de um ficheiro tal como o ERD Editor o guarda, como um ficheiro `.erd.json`. O resto do URL define a forma como o visualizador o mostra, e o criador, no mesmo endereço, escreve o URL e a respetiva linha do iframe por si.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Esta moldura mostra [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json), do repositório do erd-editor, e esta é a linha que a coloca numa página:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## O que a moldura mostra {#what-the-frame-shows}

A moldura mostra as tabelas, colunas, relações, notas e grupos de tabelas do diagrama, e nada nela edita o diagrama nem o ficheiro.  
O diagrama é ajustado à moldura ao carregar, seja qual for o zoom e a posição de deslocamento que o ficheiro guardou, pelo que o tamanho da moldura decide o zoom com que se abre.

Sobre a tela estão:

- O minimapa, enquanto o diagrama tem conteúdo.
- A barra de controlos em baixo: `Zoom out`, o nível de zoom, que repõe o zoom quando se clica, `Zoom in`, `Fit`, a lista `Name View` e `Go to content` enquanto nenhuma parte do diagrama está no ecrã.
- A ligação `erd-editor.io` em baixo à direita, que abre o erd-editor.io num novo separador e não lhe envia nenhum referrer, pelo que o clique não diz nada ao site sobre o documento que a moldura mostra. Numa moldura estreita, pode cobrir parte da barra de controlos.

Enquanto o ficheiro carrega, a moldura mostra `Loading diagram`. Se não for possível obtê-lo ou se não contiver nenhum documento, a moldura mostra um diagrama vazio com `Couldn't load the diagram` — consulte [Ficheiros no GitHub](#files-on-github) e [Ficheiros noutros servidores](#files-on-other-servers).

A moldura segue apenas o seu URL e o sistema do visitante. O idioma e o tema do próprio visitante no erd-editor.io não se aplicam nela.

## O criador {#the-builder}

Abra [erd-editor.io/embed](https://erd-editor.io/embed) sem `src` para obter o criador, uma página com o título `Embed a diagram`:

1. Cole o endereço do documento em `Document URL`. Aplica-se quando prime `Enter` ou sai do campo, pelo que escrever não obtém nada. Depois de se aplicar, uma linha `Loads from` por baixo do campo indica o endereço que o visualizador obtém: o que indicou ou, para uma página no GitHub, o seu endereço no host raw do GitHub — consulte [Ficheiros no GitHub](#files-on-github).
2. Escolha as opções. Cada uma aplica-se de imediato à pré-visualização, ao URL e à linha do iframe:
   - `Theme`: `System`, `Light` ou `Dark`.
   - `Display Language`: `System`, com o idioma que representa no seu navegador ao lado, e depois os 25 idiomas, cada um com o seu próprio nome.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` ou `Both Names`. `As Saved` mostra a vista de nomes que o ficheiro guardou.
   - `Accent color` e `Gray color`, cada uma listada por nome com uma amostra.
   - `Minimap` e `Controls`, dois interruptores, ambos ativados.
   - `Height`, em píxeis, `480` para começar. Uma altura que não seja um número inteiro positivo conta como `480`.
3. Verifique a `Preview`: o visualizador tal como a moldura o mostrará, com a ligação `erd-editor.io`, numa caixa tão alta como `Height`. O seu idioma `System` é o do seu navegador, seja qual for o idioma que o próprio erd-editor.io está a mostrar.
4. Copie o resultado. `Embed URL` é o endereço da moldura, e `Embed code` a linha do iframe, com a altura que definiu e a largura `100%`. Cada um tem um botão `Copy`, que fica desativado até um URL de documento se aplicar, e que diz `Copied` por instantes depois de uma cópia, até uma alteração reescrever o que copiou.

Limpar `Document URL` esvazia a pré-visualização e os dois resultados quando se aplica.

## Parâmetros do URL {#url-parameters}

| Parâmetro | Valores | Predefinição |
| --- | --- | --- |
| `src` | O endereço do documento, codificado como URL. | Nenhuma: sem ele, ou com um vazio, a página é o criador. |
| `theme` | `light`, `dark` ou `system`. | `system`: o modo claro ou escuro que o navegador do visitante indica. |
| `locale` | `system`, ou um código da [tabela de idiomas](./language-and-theme.md#display-language), como `de-DE`. | `system`: os idiomas do navegador do visitante, correspondidos como o [System](./language-and-theme.md#what-system-follows) os corresponde, e o inglês quando o visualizador não tem nenhum deles. |
| `name-view` | `physical`, `logical` ou `both`. | A vista de nomes que o ficheiro guardou. |
| `minimap` | `false` oculta o minimapa. | Mostrado. |
| `controls` | `false` oculta a barra de controlos. | Mostrada. |
| `accent-color` | Uma das 26 cores de destaque do [criador de temas](./language-and-theme.md#theme), como `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` ou `sand`. | `slate` |

As predefinições são as do próprio visualizador, e não as da aplicação web, que começa com `jade` e `olive`.

- O criador deixa fora do URL cada opção que está na predefinição, pelo que um URL de incorporação contém apenas o que difere.
- Um valor que o visualizador não aceita é ignorado, e a sua opção fica com a predefinição. Os valores são correspondidos exatamente como listados, pelo que `theme=Dark` é ignorado, e `minimap` e `controls` continuam mostrados para qualquer valor que não seja `false`.
- Um parâmetro indicado duas vezes toma o seu primeiro valor.
- `src` é codificado como URL, tal como o criador o escreve, uma vez que um endereço que contenha um `&` ou um `#` próprio fica, caso contrário, cortado.

## Ficheiros no GitHub {#files-on-github}

Um ficheiro ou um gist no GitHub pode ser indicado pelo endereço que a sua página mostra, como a moldura acima. O visualizador obtém-no, em vez disso, do host raw do GitHub, que responde ao pedido de outro site onde o endereço da própria página não responde:

- A página de um ficheiro, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, ou o seu endereço `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, carrega de `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` é um ramo, uma etiqueta ou um commit: um ramo mostra o ficheiro tal como esse ramo o tem, e uma etiqueta ou um commit mantém essa versão.
- A página de um gist, `https://gist.github.com/<user>/<id>`, carrega de `https://gist.githubusercontent.com/<user>/<id>/raw`, que é o primeiro ficheiro do gist. Mantenha o diagrama como único ficheiro do gist.

O URL de incorporação mantém o endereço que indicou, e a linha `Loads from` do criador mostra o que foi obtido.  
Isto funciona apenas para repositórios públicos e gists públicos. O host raw guarda cada ficheiro em cache durante cinco minutos, pelo que uma alteração que envie pode demorar esse tempo a aparecer na moldura.

## Ficheiros noutros servidores {#files-on-other-servers}

O visualizador no erd-editor.io obtém o ficheiro com um simples `GET` a partir do navegador do visitante, pelo que o servidor que o aloja tem de permitir esse pedido entre origens (CORS): a sua resposta precisa de um cabeçalho `Access-Control-Allow-Origin` que permita `https://erd-editor.io`, como `*`.  
O pedido não leva cookies, pelo que o ficheiro tem de poder ser lido sem iniciar sessão.  
Sem esse cabeçalho, ou para um endereço que responde com um erro ou com algo que não seja um documento do ERD Editor, a moldura mostra `Couldn't load the diagram`.

## Na moldura {#in-the-frame}

A moldura não recebe roda, gesto nem tecla até um visitante clicar ou tocar nela ou chegar a ela com `Tab`. Até lá, a roda, um deslize e o gesto de pinça deslocam ou ampliam a página à volta como habitualmente.  
Quando tem o foco, a roda desloca o diagrama, `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) e o gesto de pinça ampliam-no, e `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) abre uma pesquisa sobre o documento, em que `#` encontra uma tabela, `@` uma coluna e `:` um comentário ou uma nota.  
Um arrastamento desloca o diagrama, tenha a moldura o foco ou não, e um clique ou um toque ilumina relações: as da tabela clicada, ou a da única relação clicada. A tabela onde o ponteiro pousa ilumina as suas. Consulte [Foco e teclas](../../api/erd-viewer-element.md#focus-and-keys) para todas as teclas.

Para o experimentar num diagrama maior, com zoom e pesquisa, abra o [exemplo da livraria](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), com nove tabelas e dois grupos de tabelas, numa página própria.

## Análises {#analytics}

O erd-editor.io conta as visitas à moldura com o Google Analytics, como conta as visitas à aplicação web. O endereço que regista para uma moldura é apenas `erd-editor.io/embed`, sem o endereço do documento que `src` indica.  
Consulte a [Política de Privacidade](https://erd-editor.io/privacy).

## Carregar o visualizador por si {#loading-the-viewer-yourself}

Uma página que consiga carregar scripts pode, em alternativa, mostrar um diagrama com o elemento [`<erd-viewer>`](../../api/erd-viewer-element.md) do pacote `@dineug/erd-editor`. Aceita as mesmas opções como atributos e métodos, não faz nenhum pedido ao erd-editor.io e pode carregar um documento do próprio site da página, o que não precisa de CORS.
