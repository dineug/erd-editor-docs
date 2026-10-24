---
sidebar_position: 17
description: Os 25 idiomas de exibição do editor, o layout da direita para a esquerda, as cores e as aparências Sistema, Claro e Escuro do construtor de temas e onde cada host os guarda.
---

# Idioma e tema

O texto do próprio editor está disponível em 25 idiomas, e seu visual é um tema: uma aparência (`System`, `Light` ou `Dark`), um tom de cinza e uma cor de destaque.  
Ambos pertencem à pessoa que usa o editor, e não ao diagrama. Nenhum dos dois é salvo no arquivo, registrado no [histórico de desfazer](./undo-redo.md) nem compartilhado com os colaboradores, então cada pessoa vê os seus, e alterar qualquer um deles nunca marca um arquivo como modificado.

Nenhum dos dois fica na aba [Configurações](./settings.md). A barra de ferramentas tem um botão `Theme` e, logo depois dele, um botão `Display Language`, ambos depois do botão [`Explorer`](./explorer.md). A [pesquisa rápida](./quick-search.md) lista `Theme` e `Display Language` em todas as abas.  
O aplicativo web, o Google Drive, o VS Code, as IDEs da JetBrains e o Obsidian oferecem os dois e lembram suas escolhas — consulte [Em cada host](#in-each-host). Ambos também funcionam em um editor somente leitura.

## Idioma de exibição {#display-language}

O idioma abrange o texto do próprio editor: as dicas de ferramenta da barra de ferramentas, o botão [`Name View`](./logical-names.md#switching-the-view) da barra de ferramentas do canvas e da barra de ferramentas do Flow, o menu de exibição de linhas do Flow, os menus de contexto, a pesquisa rápida, os painéis, as caixas de diálogo, a aba [Dicionário](./dictionary.md) (os nomes das planilhas, os cabeçalhos das colunas, as ferramentas, o menu, a linha de status e os tipos de verificação que a planilha `Checks` lista), a aba Configurações, a [tela de boas-vindas](./editing-start.md#welcome-screen), as notificações, as mensagens e o texto de espaço reservado que um nome, nome lógico, tipo de dados, domínio, valor padrão ou comentário vazio mostra no canvas e em uma imagem exportada.  
Em todos os idiomas, ele mantém tal como estão escritos: seus nomes de tabela e de coluna, [nomes lógicos](./logical-names.md), comentários e notas; as palavras, os termos e os domínios que você mantém na aba Dicionário; os fornecedores de banco de dados, as linguagens do Gerador de código e os formatos de arquivo; os tipos de dados, as palavras-chave SQL e as ações `ON DELETE` e `ON UPDATE`; as opções `Create`, `If not exists`, `Drop & re-create`, `USE` e `CREATE + USE` do Esquema SQL; as marcas `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` e `AK1.1`; as letras de status `A`, `M`, `D`, `R` e `~` do [visualizador de diferenças](./table-related-functions.md#diff-viewer); as opções de estilo de nome e de `Bracket` diferentes de `None`; os nomes das teclas; os nomes das cores do construtor de temas; o SQL e o código gerados; a linha de cabeçalho de um CSV de dicionário exportado; e os nomes dos arquivos exportados.

Na aba Dicionário, uma classificação ordena as linhas na ordem alfabética do idioma de exibição, e a pesquisa da planilha `Checks` compara as células dela como elas aparecem no idioma de exibição — consulte [Classificar](./dictionary.md#sorting) e [Pesquisar](./dictionary.md#searching).

Os idiomas, na ordem em que o seletor os lista:

| No seletor | Idioma | Código |
| --- | --- | --- |
| Bahasa Indonesia | Indonésio | `id-ID` |
| Deutsch | Alemão | `de-DE` |
| English | Inglês | `en` |
| Español | Espanhol | `es-ES` |
| Euskara | Basco | `eu-ES` |
| Français | Francês | `fr-FR` |
| Italiano | Italiano | `it-IT` |
| Nederlands | Holandês | `nl-NL` |
| Polski | Polonês | `pl-PL` |
| Português | Português | `pt-PT` |
| Português Brasileiro | Português brasileiro | `pt-BR` |
| Română | Romeno | `ro-RO` |
| Slovenčina | Eslovaco | `sk-SK` |
| Slovenščina | Esloveno | `sl-SI` |
| Svenska | Sueco | `sv-SE` |
| Türkçe | Turco | `tr-TR` |
| Русский | Russo | `ru-RU` |
| Українська | Ucraniano | `uk-UA` |
| עברית | Hebraico | `he-IL` |
| العربية | Árabe | `ar-SA` |
| فارسی | Persa | `fa-IR` |
| 日本語 | Japonês | `ja-JP` |
| 简体中文 | Chinês simplificado | `zh-CN` |
| 繁體中文 | Chinês tradicional | `zh-TW` |
| 한국어 | Coreano | `ko-KR` |

O item `Language` que a pesquisa rápida oferece na aba Gerador de código e a linha `Language` da lista de [Bloqueio](./settings.md#lock) na aba Configurações são a [linguagem de destino do Gerador de código](./code-generator.md#language), e não o idioma de exibição.

### Escolher um idioma {#picking-a-language}

O botão `Display Language` (um ícone de idiomas) abre o seletor `Display Language`, um painel com o título `Display Language` abaixo da barra de ferramentas, sobre a aba que estiver aberta.  
A opção `System` vem primeiro, com o idioma que ela representa no momento ao lado, e permanece visível enquanto a lista rola. Em seguida vêm os 25 idiomas, cada um com o nome no próprio idioma, e uma marca de seleção indica a opção em vigor.

![Troca do idioma de exibição pela barra de ferramentas para 한국어, depois para العربية, que espelha a barra de ferramentas, mas não o diagrama, e de volta para System](/img/demo-display-language.webp)

O painel se abre com o foco do teclado na linha marcada:

- `↑` e `↓` percorrem as linhas de forma circular, e `Home` e `End` saltam para a primeira e a última.
- `Enter` ou `Space` escolhe a linha em foco, como faz um clique.

Uma escolha tem efeito imediato, fecha o painel e devolve o foco do teclado ao editor.

Feche-o sem escolher com `Escape`, com o botão `x` ao lado do título, cuja dica de ferramenta diz `Close (ESC)`, pressionando qualquer ponto do editor fora do painel, exceto a barra de ferramentas, ou com o botão `Display Language` de novo.  
Abri-lo fecha o construtor de temas e o painel Propriedades da tabela. Um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto e, em um idioma da esquerda para a direita, o seletor fica logo depois dele em vez de sobre ele.  
Abrir a pesquisa rápida ou o construtor de temas o fecha, assim como `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Essa tecla abre o [explorador](./explorer.md#opening-and-closing) na pesquisa dele ou, se o explorador já estiver aberto, o mantém aberto e leva o foco do teclado ao seu campo Localizar. O botão `Explorer` da barra de ferramentas deixa o seletor aberto.

Enquanto o painel tem o foco do teclado, alguns atalhos do editor continuam funcionando: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset` — consulte [Atalhos](./settings.md#shortcuts). Todos os outros atalhos do editor, as teclas de seta e `Tab` não passam do painel, então o editor não reage a eles. As teclas que o editor não atribui a nenhum comando, como o comando de salvar do próprio host, chegam ao host normalmente.

Na [pesquisa rápida](./quick-search.md), o item `Display Language` lista `System` e os 25 idiomas, com uma marca de seleção na opção em vigor. Ali, um idioma também é encontrado pelo nome em inglês ou pelo código, então `german` ou `de-DE` encontra `Deutsch`.

### O que a opção System segue {#what-system-follows}

A opção `System` é o valor inicial do idioma no aplicativo web, no Google Drive, no VS Code, nas IDEs da JetBrains e no Obsidian. Ela segue o idioma do host:

- No aplicativo web, no Google Drive e na sua própria página: os idiomas preferidos do navegador. Uma alteração neles é acompanhada imediatamente.
- No VS Code: o idioma de exibição do VS Code.
- Em uma IDE da JetBrains: o idioma em que a IDE mostra a própria interface.
- No Obsidian: o idioma do Obsidian.

A opção `System` adota o primeiro desses idiomas que o editor oferece e, se ele não oferecer nenhum, o inglês.  
Uma variante regional conta como o seu idioma, então `de-AT` resulta em Deutsch e `fr-CA` em Français. O chinês é decidido pela escrita: uma escrita tradicional resulta em 繁體中文 e qualquer outra escrita em 简体中文. Sem escrita indicada, Taiwan, Hong Kong ou Macau resultam em 繁體中文, e qualquer outro chinês em 简体中文. O português resulta em Português Brasileiro, a menos que seja indicada uma região diferente do Brasil, então `pt-PT` resulta em Português; o português do Obsidian também resulta em Português.

### Idiomas da direita para a esquerda {#right-to-left-languages}

עברית (hebraico), العربية (árabe) e فارسی (persa) organizam o editor da direita para a esquerda: a barra de ferramentas, os menus, os painéis, as caixas de diálogo, a pesquisa rápida, a barra e a linha de status da aba Dicionário e a aba Configurações ficam espelhados. Os submenus de um menu de contexto se abrem para a esquerda, e os ícones de desfazer e refazer da barra de ferramentas trocam de lugar, para que o ícone de desfazer aponte para trás em relação ao sentido de quem lê da direita para a esquerda.

O diagrama em si nunca é espelhado. O canvas, com suas tabelas, colunas, relacionamentos e notas, continua da esquerda para a direita, assim como o minimapa, as barras de rolagem, a [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar), a aba [Visualização](./visualization.md) e sua barra de ferramentas, as células de tipo de dados, as planilhas da aba Dicionário e a lista de domínios de um termo, o código nas abas Esquema SQL e Gerador de código, o seletor de cores, os dois lados do visualizador de diferenças, a viagem no tempo e a pré-visualização do layout automático.  
No Flow, as duas setas da barra de ferramentas da aba Visualização mantêm seus lugares e trocam o que fazem: a seta que aponta para a direita é `Previous table`, e a que aponta para a esquerda, `Next table`, para que voltar aponte no mesmo sentido do ícone de desfazer. As teclas de desfazer e refazer continuam voltando e avançando um passo — consulte [Tabela anterior e próxima tabela](./visualization.md#previous-table-and-next-table).  
O [explorador](./explorer.md#beside-the-canvas) fica à esquerda do canvas, e a árvore de alterações do visualizador de diferenças, à esquerda do visualizador, cada um com sua borda de arrasto à direita. Por dentro, ambos são lidos da direita para a esquerda: seus campos e linhas ficam espelhados, as linhas são recuadas a partir da direita e, em qualquer das duas árvores, `←` expande uma linha ou passa para o primeiro item filho, enquanto `→` a recolhe ou sai para o item pai — consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer).  
Nomes, comentários e outros textos que você digitou mantêm a própria direção, então um nome em hebraico, árabe ou persa também é lido da direita para a esquerda no canvas. Cada nome que uma notificação do Dicionário lista também mantém a própria direção.

## Tema {#theme}

O botão `Theme` (um ícone de contraste) abre o construtor de temas, um painel com o título `Theme` abaixo da barra de ferramentas, sobre a aba que estiver aberta. Ele tem três partes:

- `Accent color`: 26 amostras. A dica de ferramenta de cada uma mostra seu nome, como `indigo`.
- `Gray color`: 6 amostras, `gray`, `mauve`, `slate`, `sage`, `olive` e `sand`.
- `Appearance`: `System`, `Light` e `Dark`.

![Abertura do construtor de temas pela barra de ferramentas, escolha de uma cor de destaque e de um tom de cinza e troca da aparência para Light e depois para System](/img/demo-theme-builder.webp)

A opção em vigor em cada parte fica marcada, e uma escolha tem efeito imediato enquanto o construtor continua aberto.  
Escolher uma cor mantém a aparência como está, então uma cor escolhida com `System` mantém `System`.

A opção `System` mostra claro ou escuro conforme o host e muda quando o host muda:

- No aplicativo web, no Google Drive e na sua própria página: o modo claro ou escuro informado pelo navegador, que segue o sistema operacional.
- No VS Code: claro com um tema de cores claro, e escuro com um tema escuro ou com qualquer um dos dois temas de alto contraste.
- Em uma IDE da JetBrains: o tema claro ou escuro da IDE.
- No Obsidian: o tema claro ou escuro do Obsidian.

Feche o construtor com `Escape`, com o botão `x` ao lado do título, cuja dica de ferramenta diz `Close (ESC)`, pressionando qualquer ponto do editor fora do painel, exceto a barra de ferramentas, ou com o botão `Theme` de novo.  
Abri-lo fecha o painel Propriedades da tabela e o seletor `Display Language`. Um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto e, em um idioma da esquerda para a direita, o construtor fica logo depois dele em vez de sobre ele.  
Abrir a pesquisa rápida ou o seletor `Display Language` o fecha, assim como `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Essa tecla abre o [explorador](./explorer.md#opening-and-closing) na pesquisa dele ou, se o explorador já estiver aberto, o mantém aberto e leva o foco do teclado ao seu campo Localizar. O botão `Explorer` da barra de ferramentas deixa o construtor aberto.  
O construtor não retém nenhuma tecla, então os atalhos do editor funcionam enquanto ele está aberto.

Na [pesquisa rápida](./quick-search.md), o item `Theme` lista `System`, `Light` e `Dark`, com uma marca de seleção na aparência em vigor. Escolher um deles muda só a aparência e mantém o tom de cinza e a cor de destaque como estão.

## Em cada host {#in-each-host}

O que você escolhe no editor, pela barra de ferramentas ou pela pesquisa rápida, é salvo onde o host o guarda, e todos os diagramas abertos acompanham na hora qualquer alteração, onde quer que ela seja feita.  
No VS Code, em uma IDE da JetBrains e no Obsidian, o `Auto` do host (o valor `auto` no VS Code) é o `System` do editor. Escolher `System` grava `Auto`, e escolher `Light` ou `Dark` grava essa aparência, mesmo quando `Auto` já a estava mostrando.  
As configurações e os avisos próprios da extensão e dos plugins ficam em inglês, seja qual for o idioma de exibição.

### Aplicativo web e Google Drive {#web-app-and-google-drive}

No erd-editor.io, incluindo suas sessões colaborativas, e no Google Drive, um único idioma e um único tema valem para o aplicativo e para todos os diagramas nele.  
Ambos ficam guardados neste navegador, e não no esquema nem no arquivo do Drive, e todas as abas do erd-editor.io os compartilham: uma escolha em uma aba muda as outras na hora.

O idioma é `System`, que segue os idiomas preferidos do navegador, até que você escolha um.  
O texto do próprio aplicativo, como a barra lateral, a lixeira, a colaboração e as telas do Google Drive, segue o mesmo idioma e, em hebraico, árabe e persa, o aplicativo inteiro é organizado da direita para a esquerda. A Política de Privacidade, os Termos de Serviço e as páginas de suporte continuam em inglês.  
Além do painel do editor e da pesquisa rápida, a última linha da barra lateral tem um botão de idioma, cuja dica de ferramenta diz `Display Language`, ao lado dos links `Privacy` e `Terms`. O menu dele lista `System`, com o idioma que essa opção representa, e depois os 25 idiomas.

O tema começa em `System`, com o tom de cinza `olive` e a cor de destaque `jade`.  
Além do construtor de temas e da pesquisa rápida, a parte inferior da barra lateral tem três botões de ícone, `System`, `Light` e `Dark`: ao lado de `Trash` no erd-editor.io e ao lado de `Sign out` no Google Drive. Eles definem a mesma aparência que o construtor.

### VS Code {#vs-code}

As configurações da extensão ficam em ERD Editor, na tela Settings do VS Code:

| Configuração | Valores | Padrão |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` ou um código da [tabela de idiomas](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | os seis tons de cinza | `slate` |
| `dineug.erd-editor.theme.accentColor` | as 26 cores de destaque | `indigo` |

O editor Settings lista a configuração de idioma como `Auto` e depois cada idioma pelo nome no próprio idioma. Um valor em `settings.json` que não indica nenhum idioma é lido como `auto`.  
Uma escolha de tema no editor grava as três configurações de tema. Uma escolha é gravada onde sua configuração já está definida: na pasta do espaço de trabalho, senão no espaço de trabalho, senão nas configurações do usuário.

### IDEs da JetBrains {#jetbrains-ides}

Settings | Tools | ERD Editor tem `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` e `Display language:` (`Auto` e depois cada idioma pelo nome no próprio idioma), configurações guardadas para a IDE inteira.  
Elas começam em `Auto`, `Slate`, `Indigo` e `Auto`.

### Obsidian {#obsidian}

Settings → ERD Editor tem `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` e `Display language` (`Auto` e depois cada idioma pelo nome no próprio idioma), configurações guardadas por cofre.  
Elas começam em `Auto`, `Slate`, `Indigo` e `Auto`.  
Uma alteração vale para todas as abas ERD do cofre, incluindo as que estão em janelas destacadas.

### Sua própria página {#your-own-page}

Um elemento `<erd-editor>` na sua própria página não mostra o botão `Theme` nem o botão `Display Language`, e a pesquisa rápida não lista nenhum dos dois, até que a página os ative com [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) e [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Até que a página defina um idioma ou o usuário escolha um, o editor fica em inglês ou, enquanto `enableLocalePicker` estiver ativado, segue `System`.  
O tema começa em `Dark`, com o tom de cinza `slate` e a cor de destaque `indigo`, a menos que a página defina outro ou ative [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
A escolha do usuário tem efeito imediato, mas o elemento não salva nenhuma das duas: é a própria página que define os valores iniciais e salva as escolhas do usuário — consulte [Tema](../../api/erd-editor-element.md#theme) e [Idioma de exibição](../../api/erd-editor-element.md#display-language) na API.
