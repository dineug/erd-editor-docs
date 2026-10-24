---
sidebar_position: 17
description: Os 25 idiomas de apresentação do editor, a disposição da direita para a esquerda, os aspetos System, Light e Dark do criador de temas, as respetivas cores e o local onde cada host os guarda.
---

# Idioma e tema

O texto do próprio editor está disponível em 25 idiomas, e a sua aparência é um tema: um aspeto (`System`, `Light` ou `Dark`), um tom de cinzento e uma cor de destaque.  
Ambos pertencem à pessoa que utiliza o editor, e não ao diagrama. Nenhum deles é guardado no ficheiro, registado no [histórico de anulação](./undo-redo.md) nem partilhado com os colaboradores, pelo que cada pessoa vê os seus, e alterar qualquer um deles nunca marca um ficheiro como modificado.

Nenhum deles está no separador [Definições](./settings.md). A barra de ferramentas tem um botão `Theme` e, logo a seguir, um botão `Display Language`, ambos depois do botão [`Explorer`](./explorer.md). A [pesquisa rápida](./quick-search.md) apresenta as entradas `Theme` e `Display Language` em todos os separadores.  
A aplicação web, o Google Drive, o VS Code, os IDE da JetBrains e o Obsidian oferecem ambos e memorizam as suas escolhas — consulte [Em cada host](#in-each-host). Ambos funcionam também num editor só de leitura.

## Idioma de apresentação {#display-language}

O idioma abrange o texto do próprio editor: as dicas da barra de ferramentas, o botão [`Name View`](./logical-names.md#switching-the-view) na barra de ferramentas da tela e na barra de ferramentas do Flow, o menu de apresentação das linhas do Flow, os menus de contexto, a pesquisa rápida, os painéis e as caixas de diálogo, o separador [Dicionário](./dictionary.md) (os nomes das folhas, os cabeçalhos das colunas, as ferramentas, o menu, a linha de estado e os tipos de verificação que a folha `Checks` apresenta), o separador Definições, o [ecrã de boas-vindas](./editing-start.md#welcome-screen), as notificações, as mensagens e o marcador de posição que um nome, nome lógico, tipo de dados, domínio, valor predefinido ou comentário vazio apresenta na tela e numa imagem exportada.  
Em todos os idiomas, deixa tal como estão: os nomes das suas tabelas e colunas, os [nomes lógicos](./logical-names.md), os comentários e as notas; as palavras, os termos e os domínios que guarda no separador Dicionário; as bases de dados, as linguagens do Gerador de código e os formatos de ficheiro; os tipos de dados, as palavras-chave SQL e as ações `ON DELETE` e `ON UPDATE`; as opções `Create`, `If not exists`, `Drop & re-create`, `USE` e `CREATE + USE` do Esquema SQL; as marcas `PK`, `FK`, `UQ`, `AI`, `NN`, `N-N`, `NULL` e `AK1.1`; as letras de estado `A`, `M`, `D`, `R` e `~` do [visualizador de diferenças](./table-related-functions.md#diff-viewer); as escolhas de formato do nome e de `Bracket` que não sejam `None`; os nomes das teclas do teclado; os nomes das cores do criador de temas; o SQL e o código gerados; a linha de cabeçalho de um CSV de dicionário exportado; e os nomes dos ficheiros exportados.

No separador Dicionário, uma ordenação ordena as linhas pela ordem alfabética do idioma de apresentação, e a pesquisa da folha `Checks` compara as suas células tal como aparecem no idioma de apresentação — consulte [Ordenar](./dictionary.md#sorting) e [Pesquisar](./dictionary.md#searching).

Os idiomas, pela ordem em que o seletor os apresenta:

| No seletor | Idioma | Código |
| --- | --- | --- |
| Bahasa Indonesia | Indonésio | `id-ID` |
| Deutsch | Alemão | `de-DE` |
| English | Inglês | `en` |
| Español | Espanhol | `es-ES` |
| Euskara | Basco | `eu-ES` |
| Français | Francês | `fr-FR` |
| Italiano | Italiano | `it-IT` |
| Nederlands | Neerlandês | `nl-NL` |
| Polski | Polaco | `pl-PL` |
| Português | Português | `pt-PT` |
| Português Brasileiro | Português do Brasil | `pt-BR` |
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

A entrada `Language` que a pesquisa rápida oferece no separador Gerador de código e a linha `Language` da lista [Bloqueio](./settings.md#lock) no separador Definições são a [linguagem de destino do Gerador de código](./code-generator.md#language), e não o idioma de apresentação.

### Escolher um idioma {#picking-a-language}

O botão `Display Language` (um ícone de idiomas) abre o seletor `Display Language`, um painel com o título `Display Language` por baixo da barra de ferramentas, sobre o separador que estiver aberto.  
A opção `System` aparece em primeiro lugar, com o idioma que representa neste momento ao seu lado, e mantém-se visível enquanto a lista se desloca. Seguem-se os 25 idiomas, cada um com o seu próprio nome, e um visto assinala a opção em vigor.

![Mudar o idioma de apresentação para 한국어 a partir da barra de ferramentas, depois para العربية, que espelha a barra de ferramentas, mas não o diagrama, e voltar a System](/img/demo-display-language.webp)

O painel abre-se com o foco do teclado na linha assinalada:

- `↑` e `↓` percorrem as linhas de forma circular, e `Home` e `End` saltam para a primeira e para a última.
- `Enter` ou `Space` escolhe a linha com o foco, tal como um clique.

Uma escolha aplica-se de imediato, fecha o painel e devolve o foco do teclado ao editor.

Sem fazer nenhuma escolha, feche-o com `Escape`, com o botão `x` ao lado do título, cuja dica indica `Close (ESC)`, ao premir o botão do rato em qualquer ponto do editor fora do painel, exceto na barra de ferramentas, ou novamente com o botão `Display Language`.  
Abri-lo fecha o criador de temas e o painel Propriedades da tabela. Um [explorador](./explorer.md#dialogs-beside-it) aberto mantém-se aberto, e num idioma da esquerda para a direita o seletor fica logo a seguir a ele, em vez de por cima dele.  
Abrir a pesquisa rápida ou o criador de temas fecha-o, e o mesmo acontece com `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Essa tecla abre o [explorador](./explorer.md#opening-and-closing) na respetiva pesquisa ou, se o explorador já estiver aberto, mantém-no aberto e leva o foco do teclado para o respetivo campo Localizar. O botão `Explorer` da barra de ferramentas deixa o seletor aberto.

Enquanto o painel tem o foco do teclado, alguns atalhos do editor continuam a funcionar: `Search`, `Toggle Explorer`, `Undo`, `Redo`, `Zoom In`, `Zoom Out` e `Zoom Reset` — consulte [Atalhos](./settings.md#shortcuts). Todos os outros atalhos do editor, as teclas de seta e a tecla `Tab` não passam do painel, pelo que o editor não reage a eles. As teclas sem associação no editor, como a de guardar do próprio host, chegam ao host como habitualmente.

Na [pesquisa rápida](./quick-search.md), a entrada `Display Language` apresenta `System` e os 25 idiomas, com um visto na opção em vigor. Um idioma também se encontra aí pelo seu nome em inglês ou pelo seu código, pelo que `german` ou `de-DE` encontra `Deutsch`.

### O que a opção System segue {#what-system-follows}

Na aplicação web, no Google Drive, no VS Code, nos IDE da JetBrains e no Obsidian, o idioma começa na opção `System`. Esta opção segue o idioma do host:

- Na aplicação web, no Google Drive e na sua própria página: os idiomas preferidos do navegador. Uma alteração a esses idiomas é seguida de imediato.
- No VS Code: o idioma de apresentação do VS Code.
- Num IDE da JetBrains: o idioma em que o IDE apresenta a sua própria interface.
- No Obsidian: o idioma do Obsidian.

A opção `System` adota o primeiro desses idiomas que o editor disponibiliza, e o inglês quando não disponibiliza nenhum deles.  
Uma variante regional conta como o respetivo idioma, pelo que `de-AT` resulta em Deutsch e `fr-CA` em Français. O chinês é determinado pela escrita: uma escrita tradicional resulta em 繁體中文 e qualquer outra escrita em 简体中文. Sem escrita indicada, Taiwan, Hong Kong ou Macau resultam em 繁體中文, e as restantes variantes do chinês em 简体中文. O português resulta em Português Brasileiro, a menos que seja indicada uma região diferente do Brasil, pelo que `pt-PT` resulta em Português; o português do Obsidian também resulta em Português.

### Idiomas da direita para a esquerda {#right-to-left-languages}

עברית (hebraico), العربية (árabe) e فارسی (persa) dispõem o editor da direita para a esquerda: a barra de ferramentas, os menus, os painéis e as caixas de diálogo, a pesquisa rápida, a barra e a linha de estado do separador Dicionário e o separador Definições ficam espelhados. Os submenus de um menu de contexto abrem-se para a esquerda, e os ícones Anular e Refazer da barra de ferramentas trocam entre si, para que Anular aponte para trás em relação ao sentido de leitura da direita para a esquerda.

O próprio diagrama nunca é espelhado. A tela, com as suas tabelas, colunas, relações e notas, mantém-se da esquerda para a direita, tal como o minimapa, as barras de deslocamento, a [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar), a [Visualização](./visualization.md) e a respetiva barra de ferramentas, as células do tipo de dados, as folhas do separador Dicionário e a lista de domínios de um termo, o código nos separadores Esquema SQL e Gerador de código, o seletor de cores, os dois lados do visualizador de diferenças, a viagem no tempo e a pré-visualização da disposição automática.  
No Flow, as duas setas da barra de ferramentas da Visualização mantêm o seu lugar e trocam de função: a seta que aponta para a direita é `Previous table` e a que aponta para a esquerda é `Next table`, para que recuar aponte no mesmo sentido que Anular. As teclas de anular e refazer continuam a recuar e a avançar um passo — consulte [Tabela anterior e tabela seguinte](./visualization.md#previous-table-and-next-table).  
O [explorador](./explorer.md#beside-the-canvas) mantém-se à esquerda da tela, e a árvore de alterações do visualizador de diferenças à esquerda do visualizador, cada um com o seu bordo de arrastamento do lado direito. No interior, ambos se leem da direita para a esquerda: os seus campos e linhas ficam espelhados, as linhas são indentadas a partir da direita e, em qualquer das árvores, `←` expande uma linha ou passa para o primeiro filho, enquanto `→` a recolhe ou sobe para o pai — consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer).  
Os nomes, os comentários e outros textos que escreveu mantêm a sua própria direção, pelo que um nome em hebraico, árabe ou persa também se lê da direita para a esquerda na tela. Cada nome que uma notificação do separador Dicionário apresenta também mantém a sua própria direção.

## Tema {#theme}

O botão `Theme` (um ícone de contraste) abre o criador de temas, um painel com o título `Theme` por baixo da barra de ferramentas, sobre o separador que estiver aberto. Tem três partes:

- `Accent color`: 26 amostras. A dica de cada uma indica o seu nome, como `indigo`.
- `Gray color`: 6 amostras, `gray`, `mauve`, `slate`, `sage`, `olive` e `sand`.
- `Appearance`: `System`, `Light` e `Dark`.

![Abrir o criador de temas a partir da barra de ferramentas, escolher uma cor de destaque e um tom de cinzento e mudar o aspeto para Light e depois para System](/img/demo-theme-builder.webp)

A opção em vigor em cada parte está assinalada, e uma escolha aplica-se de imediato enquanto o criador permanece aberto.  
Escolher uma cor deixa o aspeto como está, pelo que uma cor escolhida com o aspeto `System` mantém `System`.

A opção `System` apresenta o aspeto claro ou escuro tal como o host, e muda quando o host muda:

- Na aplicação web, no Google Drive e na sua própria página: o modo claro ou escuro que o navegador indica, que segue o sistema operativo.
- No VS Code: claro com um tema de cores claro, e escuro com um tema escuro ou com qualquer um dos dois temas de alto contraste.
- Num IDE da JetBrains: o tema claro ou escuro do IDE.
- No Obsidian: o tema claro ou escuro do Obsidian.

Feche o criador com `Escape`, com o botão `x` ao lado do título, cuja dica indica `Close (ESC)`, ao premir o botão do rato em qualquer ponto do editor fora do painel, exceto na barra de ferramentas, ou novamente com o botão `Theme`.  
Abri-lo fecha o painel Propriedades da tabela e o seletor `Display Language`. Um [explorador](./explorer.md#dialogs-beside-it) aberto mantém-se aberto, e num idioma da esquerda para a direita o criador fica logo a seguir a ele, em vez de por cima dele.  
Abrir a pesquisa rápida ou o seletor `Display Language` fecha-o, e o mesmo acontece com `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Essa tecla abre o [explorador](./explorer.md#opening-and-closing) na respetiva pesquisa ou, se o explorador já estiver aberto, mantém-no aberto e leva o foco do teclado para o respetivo campo Localizar. O botão `Explorer` da barra de ferramentas deixa o criador aberto.  
O criador não retém nenhuma tecla, pelo que os atalhos do editor funcionam enquanto está aberto.

Na [pesquisa rápida](./quick-search.md), a entrada `Theme` apresenta `System`, `Light` e `Dark`, com um visto no aspeto em vigor. Escolher um deles altera apenas o aspeto e deixa o tom de cinzento e a cor de destaque como estão.

## Em cada host {#in-each-host}

O que escolher no editor, a partir da barra de ferramentas ou da pesquisa rápida, fica guardado no local onde o host o mantém, e todos os diagramas abertos seguem de imediato uma alteração, onde quer que seja feita.  
No VS Code, num IDE da JetBrains e no Obsidian, a opção `Auto` do host (o valor `auto` no VS Code) corresponde à opção `System` do editor. Escolher `System` guarda `Auto`, e escolher `Light` ou `Dark` guarda esse aspeto, mesmo quando `Auto` já o estava a mostrar.  
As definições e os avisos próprios da extensão e dos plugins estão em inglês, seja qual for o idioma de apresentação.

### Aplicação web e Google Drive {#web-app-and-google-drive}

Em erd-editor.io, incluindo as suas sessões colaborativas, e no Google Drive, um único idioma e um único tema servem a aplicação e todos os diagramas que contém.  
Ambos ficam guardados neste navegador, e não no esquema nem no ficheiro do Drive, e são partilhados por todos os separadores de erd-editor.io: uma escolha num separador altera os outros de imediato.

O idioma fica na opção `System`, que segue os idiomas preferidos do navegador, até escolher um.  
O texto da própria aplicação, como a barra lateral, o lixo, a colaboração e os ecrãs do Google Drive, segue o mesmo idioma, e em hebraico, árabe e persa toda a aplicação é disposta da direita para a esquerda. A Política de Privacidade, os Termos de Serviço e as páginas de suporte mantêm-se em inglês.  
Além do painel do editor e da pesquisa rápida, a linha inferior da barra lateral tem um botão de idioma, cuja dica indica `Display Language`, ao lado das ligações `Privacy` e `Terms`. O respetivo menu apresenta `System`, com o idioma que representa, e depois os 25 idiomas.

O tema começa no aspeto `System`, com o tom de cinzento `olive` e a cor de destaque `jade`.  
Além do criador de temas e da pesquisa rápida, a parte inferior da barra lateral tem três botões com ícone, `System`, `Light` e `Dark`: ao lado de `Trash` em erd-editor.io e ao lado de `Sign out` no Google Drive. Definem o mesmo aspeto que o criador.

### VS Code {#vs-code}

As definições da extensão estão em ERD Editor, no editor Settings do VS Code:

| Definição | Valores | Predefinição |
| --- | --- | --- |
| `dineug.erd-editor.locale` | `auto` ou um código da [tabela de idiomas](#display-language) | `auto` |
| `dineug.erd-editor.theme.appearance` | `auto`, `light`, `dark` | `auto` |
| `dineug.erd-editor.theme.grayColor` | os seis tons de cinzento | `slate` |
| `dineug.erd-editor.theme.accentColor` | as 26 cores de destaque | `indigo` |

O editor Settings apresenta, na definição de idioma, `Auto` e depois cada idioma pelo seu próprio nome. Um valor em `settings.json` que não designe nenhum idioma é lido como `auto`.  
Uma escolha de tema no editor escreve as três definições de tema. Uma escolha é escrita onde a respetiva definição já tem um valor: na pasta da área de trabalho, senão na área de trabalho, senão nas definições do utilizador.

### IDE da JetBrains {#jetbrains-ides}

Em Settings | Tools | ERD Editor estão as opções `Appearance:` (`Auto`, `Light`, `Dark`), `Gray color:`, `Accent color:` e `Display language:` (`Auto` e depois cada idioma pelo seu próprio nome), guardadas para todo o IDE.  
Começam em `Auto`, `Slate`, `Indigo` e `Auto`.

### Obsidian {#obsidian}

Em Settings → ERD Editor estão as opções `Appearance` (`Auto`, `Light`, `Dark`), `Gray color`, `Accent color` e `Display language` (`Auto` e depois cada idioma pelo seu próprio nome), guardadas por cofre.  
Começam em `Auto`, `Slate`, `Indigo` e `Auto`.  
Uma alteração aplica-se a todos os separadores ERD do cofre, incluindo os que estão em janelas destacadas.

### A sua própria página {#your-own-page}

Um elemento `<erd-editor>` na sua própria página não mostra os botões `Theme` nem `Display Language`, e a pesquisa rápida não apresenta nenhum dos dois, até que a página os ative com [`enableThemeBuilder`](../../api/erd-editor-element.md#enablethemebuilder) e [`enableLocalePicker`](../../api/erd-editor-element.md#enablelocalepicker).  
Até que a página defina um idioma ou o leitor escolha um, o editor apresenta-se em inglês, ou segue a opção `System` enquanto `enableLocalePicker` estiver ativado.  
O tema começa no aspeto `Dark`, com o tom de cinzento `slate` e a cor de destaque `indigo`, a menos que a página defina outro ou ative [`systemDarkMode`](../../api/erd-editor-element.md#systemdarkmode).  
A escolha de um leitor aplica-se de imediato, mas o elemento não guarda nenhuma das duas escolhas: é a própria página que define as iniciais e guarda as escolhas do leitor — consulte [Tema](../../api/erd-editor-element.md#theme) e [Idioma de apresentação](../../api/erd-editor-element.md#display-language) na API.
