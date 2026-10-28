---
sidebar_position: 18
description: Mostre um diagrama somente leitura em outro site, sem código, incorporando erd-editor.io/embed, monte a URL e a linha do iframe no construtor, defina o tema, o idioma, a exibição de nomes, o minimapa, os controles e as cores na URL e sirva o arquivo pelo GitHub ou por um servidor que permita CORS.
---

# Incorporação

O [erd-editor.io/embed](https://erd-editor.io/embed) mostra um diagrama somente leitura em um visualizador que preenche a página, para outro site incorporar: uma wiki, um blog, um construtor de sites ou qualquer página que não possa carregar scripts próprios.  
O parâmetro `src` dele nomeia o documento, o endereço de um arquivo como o ERD Editor o salva, como um arquivo `.erd.json`. O restante da URL define como o visualizador o mostra, e o construtor no mesmo endereço escreve a URL e a linha do iframe para você.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Este quadro mostra [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json), do repositório erd-editor, e esta é a linha que o coloca em uma página:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## O que o quadro mostra {#what-the-frame-shows}

O quadro mostra as tabelas, as colunas, os relacionamentos, as notas e os grupos de tabelas do diagrama, e nada nele edita o diagrama nem o arquivo.  
O diagrama é ajustado ao quadro ao carregar, qualquer que seja o zoom e a posição de rolagem que o arquivo salvou, então o tamanho do quadro decide o zoom com que ele abre.

Sobre o canvas ficam:

- O minimapa, enquanto o diagrama tem conteúdo.
- A barra de controles na parte inferior: `Zoom out`, o nível de zoom, que redefine o zoom quando clicado, `Zoom in`, `Fit`, a lista `Name View` e `Go to content` enquanto nenhuma parte do diagrama está na tela.
- O link `erd-editor.io` no canto inferior direito, que abre o erd-editor.io em uma nova aba e não envia nenhum referrer, então o clique não informa ao site nada sobre o documento que o quadro mostra. Em um quadro estreito, ele pode cobrir parte da barra de controles.

Enquanto o arquivo carrega, o quadro mostra `Loading diagram`. Se ele não puder ser buscado ou não contiver nenhum documento, o quadro mostra um diagrama vazio com `Couldn't load the diagram` — consulte [Arquivos no GitHub](#files-on-github) e [Arquivos em outros servidores](#files-on-other-servers).

O quadro segue apenas a sua URL e o sistema de quem visita. O idioma e o tema próprios de quem visita no erd-editor.io não se aplicam nele.

## O construtor {#the-builder}

Abra o [erd-editor.io/embed](https://erd-editor.io/embed) sem `src` para obter o construtor, uma página intitulada `Embed a diagram`:

1. Cole o endereço do documento em `Document URL`. Ele é aplicado quando você pressiona `Enter` ou sai do campo, então digitar não busca nada. Depois de aplicado, uma linha `Loads from` sob o campo nomeia o endereço que o visualizador busca: o que você deu ou, para uma página no GitHub, o endereço dela no host raw do GitHub — consulte [Arquivos no GitHub](#files-on-github).
2. Escolha as opções. Cada uma se aplica na hora à pré-visualização, à URL e à linha do iframe:
   - `Theme`: `System`, `Light` ou `Dark`.
   - `Display Language`: `System`, com o idioma que ele representa no seu navegador ao lado, e depois os 25 idiomas, cada um no próprio nome.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` ou `Both Names`. `As Saved` mostra a exibição de nomes que o arquivo salvou.
   - `Accent color` e `Gray color`, cada uma listada por nome com uma amostra.
   - `Minimap` e `Controls`, dois interruptores, ambos ativados.
   - `Height`, em pixels, `480` para começar. Uma altura que não seja um número inteiro positivo conta como `480`.
3. Confira a `Preview`: o visualizador como o quadro o mostrará, com o link `erd-editor.io`, em uma caixa tão alta quanto `Height`. O `System` dela é o idioma do seu navegador, qualquer que seja o idioma que o próprio erd-editor.io esteja mostrando.
4. Copie o resultado. `Embed URL` é o endereço do quadro, e `Embed code` a linha do iframe, com a altura que você definiu e a largura `100%`. Cada um tem um botão `Copy`, que fica desabilitado até uma URL de documento ser aplicada e que mostra `Copied` por um instante após uma cópia, até uma alteração reescrever o que foi copiado.

Limpar `Document URL` esvazia a pré-visualização e os dois resultados quando a limpeza é aplicada.

## Parâmetros da URL {#url-parameters}

| Parâmetro | Valores | Padrão |
| --- | --- | --- |
| `src` | O endereço do documento, codificado como URL. | Nenhum: sem ele, ou com um vazio, a página é o construtor. |
| `theme` | `light`, `dark` ou `system`. | `system`: o modo claro ou escuro que o navegador de quem visita informa. |
| `locale` | `system` ou um código da [tabela de idiomas](./language-and-theme.md#display-language), como `de-DE`. | `system`: os idiomas do navegador de quem visita, correspondidos como o [System](./language-and-theme.md#what-system-follows) os corresponde, e o inglês quando o visualizador não tem nenhum deles. |
| `name-view` | `physical`, `logical` ou `both`. | A exibição de nomes que o arquivo salvou. |
| `minimap` | `false` oculta o minimapa. | Mostrado. |
| `controls` | `false` oculta a barra de controles. | Mostrada. |
| `accent-color` | Uma das 26 cores de destaque do [construtor de temas](./language-and-theme.md#theme), como `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` ou `sand`. | `slate` |

Os padrões são os do próprio visualizador, não os do aplicativo web, que começa em `jade` e `olive`.

- O construtor deixa fora da URL cada opção que está no padrão, então uma URL de incorporação contém apenas o que difere.
- Um valor que o visualizador não aceita é ignorado, e a opção mantém o padrão. Os valores são comparados exatamente como listados, então `theme=Dark` é ignorado, e `minimap` e `controls` continuam mostrados para qualquer valor diferente de `false`.
- Um parâmetro dado duas vezes usa o primeiro valor.
- `src` é codificado como URL, como o construtor o escreve, já que um endereço que contém um `&` ou um `#` próprio seria cortado de outra forma.

## Arquivos no GitHub {#files-on-github}

Um arquivo ou um gist no GitHub pode ser dado pelo endereço que a página dele mostra, como o quadro acima. O visualizador o busca no host raw do GitHub, que responde à requisição de outro site onde o endereço da própria página não responde:

- A página de um arquivo, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, ou o endereço `raw` dele, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, carrega de `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` é um branch, uma tag ou um commit: um branch mostra o arquivo como esse branch o tem, e uma tag ou um commit mantém essa versão.
- A página de um gist, `https://gist.github.com/<user>/<id>`, carrega de `https://gist.githubusercontent.com/<user>/<id>/raw`, que é o primeiro arquivo do gist. Mantenha o diagrama como o único arquivo do gist.

A URL de incorporação mantém o endereço que você deu, e a linha `Loads from` do construtor mostra o buscado.  
Isso funciona apenas para repositórios públicos e gists públicos. O host raw guarda cada arquivo em cache por cinco minutos, então uma alteração que você envia pode levar esse tempo para aparecer no quadro.

## Arquivos em outros servidores {#files-on-other-servers}

O visualizador do erd-editor.io busca o arquivo com um `GET` simples a partir do navegador de quem visita, então o servidor que o guarda precisa permitir essa requisição entre origens (CORS): a resposta dele precisa de um cabeçalho `Access-Control-Allow-Origin` que permita `https://erd-editor.io`, como `*`.  
A requisição não leva cookies, então o arquivo precisa poder ser lido sem login.  
Sem esse cabeçalho, ou para um endereço que responde com um erro ou com algo diferente de um documento do ERD Editor, o quadro mostra `Couldn't load the diagram`.

## No quadro {#in-the-frame}

O quadro não recebe roda, gesto nem tecla até que quem visita clique ou toque nele ou chegue a ele com `Tab`. Até lá, a roda, um deslize e um gesto de pinça rolam ou aplicam zoom na página ao redor dele como de costume.  
Quando ele tem o foco, a roda desloca o diagrama, `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac) e um gesto de pinça aplicam zoom, e `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac) abre uma pesquisa no documento, em que `#` encontra uma tabela, `@` uma coluna e `:` um comentário ou uma nota.  
Um arrasto desloca o diagrama, tenha o quadro o foco ou não, e um clique ou um toque acende relacionamentos: os da tabela clicada, ou o do único relacionamento clicado. A tabela sobre a qual o ponteiro está parado acende os dela. Consulte [Foco e teclas](../../api/erd-viewer-element.md#focus-and-keys) para todas as teclas.

Para experimentá-lo em um diagrama maior, aplicando zoom e pesquisando, abra o [exemplo da livraria](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nove tabelas e dois grupos de tabelas, em uma página própria.

## Análise de uso {#analytics}

O erd-editor.io conta as visitas ao quadro com o Google Analytics, como conta as visitas ao aplicativo web. O endereço que ele registra para um quadro é apenas `erd-editor.io/embed`, sem o endereço do documento que `src` nomeia.  
Consulte a [Política de Privacidade](https://erd-editor.io/privacy).

## Carregar o visualizador por conta própria {#loading-the-viewer-yourself}

Uma página que pode carregar scripts pode mostrar um diagrama com o elemento [`<erd-viewer>`](../../api/erd-viewer-element.md) do pacote `@dineug/erd-editor` em vez disso. Ele recebe as mesmas opções como atributos e métodos, não faz nenhuma requisição ao erd-editor.io e pode carregar um documento do próprio site da página, o que não precisa de CORS.
