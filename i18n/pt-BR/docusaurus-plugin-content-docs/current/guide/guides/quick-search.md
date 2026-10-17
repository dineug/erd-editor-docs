---
sidebar_position: 7
description: Abrir a paleta de comandos para trocar de aba, executar um comando da aba atual, abrir ou fechar o explorador, mudar o tema ou o idioma de exibição ou ir para uma tabela, coluna, comentário ou nota digitando um prefixo.
---

# Pesquisa rápida

A pesquisa rápida é a paleta de comandos do editor.  
Ela lista os comandos disponíveis na aba em que você está. Comece a pesquisa com `#`, `@` ou `:` para pesquisar no diagrama em vez disso e ir para uma tabela, uma coluna ou um comentário ou nota.

Abra-a com `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac), ou clique em `Search` na barra de ferramentas.  
O mesmo atalho a fecha, assim como `Esc` e um clique fora do painel. Abri-la fecha o painel Propriedades da tabela, o [construtor de temas](./language-and-theme.md#theme), o seletor [`Display Language`](./language-and-theme.md#picking-a-language), a caixa de diálogo [`Export image`](./file-import-export.md#image) e a caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns), que descarta o que você tinha escolhido nela. Ela não abre enquanto você está editando uma célula de tabela, uma nota ou o nome de um grupo de tabelas.

O botão da barra de ferramentas logo depois de `Search` é `Explorer`. Ele abre ou fecha o [explorador](./explorer.md), uma árvore do diagrama encaixada à esquerda do canvas, com Localizar e substituir no topo.  
Abrir a paleta deixa o explorador aberto, e `Esc` então fecha só a paleta. `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), pressionado na paleta, a fecha e leva o foco do teclado ao campo Localizar do explorador, abrindo o explorador na pesquisa dele se ele não estiver visível. Ao contrário do item `Toggle Explorer`, a tecla nunca fecha o explorador a partir da paleta — consulte [Abrir e fechar](./explorer.md#opening-and-closing). Enquanto o visualizador de diferenças, a viagem no tempo ou a pré-visualização do layout automático está aberta, o editor não intercepta a tecla: a paleta continua aberta e a tecla segue para o navegador ou o host — consulte [A barra de localização do navegador](./find-and-replace.md#the-browsers-find-bar).  
Um host que incorpora o editor pode atribuir a pesquisa rápida a outra tecla, que a dica de ferramenta do botão `Search` passa a mostrar — consulte [Atalhos](./settings.md#shortcuts).

![Abertura da paleta com ⌘ + K e, depois, salto para uma tabela com #pay, para uma coluna com @price e para um comentário de tabela com :address](/img/demo-quick-search.webp)

## Pesquisar e navegar {#searching-and-navigating}

Digite para filtrar a lista. Cada tecla digitada pesquisa de novo a lista inteira que está à sua frente, então apagar caracteres, ou digitar uma nova palavra sobre uma que não encontrou nada, traz de volta os itens correspondentes.  
A correspondência é aproximada e abrange tanto o nome de um item quanto as palavras-chave mostradas ao lado dele. Dentro do submenu `Import`, por exemplo, `sdl` encontra `GraphQL`, `dbdiagram` encontra `DBML` e `azimutt` encontra `AML`. Um pequeno erro de digitação ainda encontra o item, como quando `tabel` encontra `New Table` e `imprt` encontra `Import`, mas um item que só se parece vagamente com o que você digitou fica de fora: `memo` lista apenas `New Memo`. Um item cujo nome ou palavras-chave contêm o que você digitou, sem diferenciar maiúsculas de minúsculas, é sempre listado, e um que a correspondência aproximada não encontra vem depois das correspondências aproximadas. O que você digitou é realçado onde quer que um item o contenha, sem diferenciar maiúsculas de minúsculas.  
Em um idioma de exibição diferente do inglês, os comandos e os itens de submenu também são encontrados pelos nomes e palavras-chave em inglês, que a lista não mostra, então `new table` encontra `New Table` seja qual for o idioma em que ele é mostrado.  
Percorra a lista com `↑` e `↓` — ela dá a volta nas duas extremidades — e execute o item realçado com `Enter`. Um comando que tem um atalho próprio o mostra no final da linha: à direita, ou à esquerda em um idioma de exibição da direita para a esquerda. Enquanto um método de entrada ainda está compondo, como no meio de uma sílaba coreana, `↑`, `↓` e `Enter` pertencem a ele e não movem o realce nem executam um item.

Um item como `Database`, `Import` ou `Auto Layout` abre um submenu: os itens dele substituem a lista e o campo de pesquisa é limpo. Os submenus de `Database`, `Bracket`, `Language`, dos dois estilos de nome, de `Schema SQL: Statements`, `Schema SQL: Header`, `Theme` e `Display Language` marcam a escolha atual e se abrem com o realce nela, então `Enter` a mantém; os outros submenus se abrem sem nada realçado.  
A filtragem sempre se aplica apenas à lista que está à sua frente, e não há como voltar um nível, então feche e reabra a paleta para recomeçar. Dentro de um submenu, `#`, `@`, `:` e `?` são texto simples, não [prefixos](#searching-the-diagram).

## O que a paleta lista {#what-the-palette-lists}

A lista depende da aba em que você está. Em toda aba, a lista começa com `Tab`, que muda para `Entity Relationship Diagram`, `Visualization`, `Schema SQL`, `Code Generator` ou `Settings`, deixando de fora a aba em que você já está.

Na aba ERD: `Database`, `Import`, `Import and Add` e `Export`, depois `New Table`, `New Memo`, `New Table Group` e `Group Selected Tables`, os quatro tipos de relacionamento e `Auto Layout`. As tabelas não são listadas aqui; digite `#` para [ir para uma delas](#searching-the-diagram).  
`Import and Add` fica de fora em um editor somente leitura, e `New Memo`, enquanto [View Option](./table-related-functions.md#table-view-options) → `Memos` oculta as notas. `New Table Group` começa a desenhar um [grupo de tabelas](./table-groups.md) no canvas, e `Group Selected Tables` coloca as tabelas selecionadas em um novo grupo e abre o nome dele para digitação. Os dois ficam de fora em um editor somente leitura e enquanto View Option → `Table Groups` oculta os grupos, e `Group Selected Tables` também exige pelo menos uma tabela selecionada. As linhas deles mostram as teclas: `Alt + G` (Windows/Linux) ou `⌥ + G` (Mac) para [desenhar um grupo](./table-groups.md#drawing-a-group), e `T` e depois `G` para [agrupar as tabelas selecionadas](./table-groups.md#grouping-selected-tables).  
Esses itens executam os mesmos comandos do menu de contexto do canvas, exceto `Group Selected Tables`, que é o item `Group selected tables` do menu da tabela; `View Option` e `Diff Viewer` estão só no menu de contexto. `Export` oferece os mesmos `json`, `Schema SQL` e `Image` do menu de contexto, e digitar `png` ou `svg` dentro dele encontra `Image`.  
Consulte [Importar ou exportar arquivos](./file-import-export.md) para saber o que cada formato, [Importar e adicionar](./file-import-export.md#import-and-add) e a [exportação de imagem](./file-import-export.md#image) fazem, e [Funções relacionadas a tabelas](./table-related-functions.md#databases) para saber o que a escolha do banco de dados afeta.

Na aba Esquema SQL: `Database` de novo e `Bracket`, que define o caractere delimitador colocado em volta dos nomes de tabelas, colunas, restrições e índices no SQL gerado — `SingleQuote`, `DoubleQuote`, `Backtick` ou `None`, para não usar delimitador nenhum. Depois, `Schema SQL: Statements` e `Schema SQL: Header`, que fazem as mesmas escolhas do painel de opções da aba, mas listam só as que o banco de dados selecionado gera, e `Schema SQL: Options panel`, que mostra ou oculta esse painel. Consulte [Esquema SQL](./schema-sql.md) para saber o que cada escolha gera.

Na aba Gerador de código: `Database`, `Bracket` enquanto a linguagem é `Doctrine`, `JPA` ou `SeaORM`, depois `Language`, `Table Name Case`, `Column Name Case` e `Code Generator: Options panel`, que mostra ou oculta o painel de opções da aba. Consulte [Gerador de código](./code-generator.md) para saber o que cada destino produz.

As abas Visualização e Configurações não têm comandos próprios, só `Tab` e os comandos abaixo, que toda aba lista.

Perto do final da lista de toda aba, também em um editor somente leitura, fica `Toggle Explorer`, que mostra seu atalho, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac). Digitar `find`, `replace`, `rename`, `tree`, `outline` ou `objects` também o encontra.  
Executá-lo fecha a paleta e faz o que o atalho faz no canvas. Enquanto o botão `Explorer` da barra de ferramentas aparece pressionado, ou seja, enquanto o explorador está aberto na aba ERD e não está oculto pelo modo zen, ele fecha o explorador. Caso contrário, ele muda para a aba ERD e abre o explorador na pesquisa dele, com o cursor de texto no campo Localizar — consulte [Abrir e fechar](./explorer.md#opening-and-closing). Ele fica de fora enquanto o visualizador de diferenças, a viagem no tempo ou a pré-visualização do layout automático está aberta.

### Tema e idioma de exibição {#theme-and-display-language}

Depois de `Toggle Explorer`, toda aba lista `Theme` e `Display Language`, também em um editor somente leitura. Cada um só é listado onde o editor oferece o seletor correspondente, como mostram os botões `Theme` e `Display Language` da barra de ferramentas. O aplicativo web, o Google Drive, o VS Code, as IDEs da JetBrains e o Obsidian oferecem os dois — consulte [Em cada host](./language-and-theme.md#in-each-host).

`Theme` abre `System`, `Light` e `Dark`, com a aparência atual marcada. Escolher um deles muda só a aparência e mantém o tom de cinza e a cor de destaque, como fazem os botões `Appearance` do construtor de temas.  
`Display Language` abre `System` e depois os 25 idiomas, cada um com o nome no próprio idioma e na ordem do seletor, com a opção atual marcada. Aqui, um idioma também é encontrado pelo nome em inglês ou pelo código: `german` ou `de-DE` encontra `Deutsch`, e `korean` encontra `한국어`.  
Uma escolha em qualquer um dos dois tem efeito imediato, fecha a paleta e é mantida da mesma forma que uma escolha feita no construtor de temas ou no seletor `Display Language`. Se o idioma de exibição mudar enquanto a paleta está aberta, a lista passa para ele, mantendo o que você digitou e o submenu em que você está.

## Pesquisar no diagrama {#searching-the-diagram}

Comece a pesquisa com um prefixo para pesquisar no diagrama em vez de nos comandos: `#` para tabelas, `@` para colunas, `:` para comentários e notas ou `?` para listar os prefixos. Um prefixo funciona em qualquer aba. Ele só conta quando é o primeiro caractere, ignorando os espaços antes dele. Um espaço depois dele é opcional, então `#users` e `# users` são a mesma pesquisa, e os caracteres de largura total `＃`, `＠`, `：` e `？` que um método de entrada japonês ou chinês digita também contam.  
Enquanto o campo de pesquisa está vazio no nível superior, uma linha abaixo dele mostra os quatro prefixos; clique em um para digitá-lo. Enquanto um prefixo está em vigor, o final do campo indica o escopo dele: `Tables`, `Columns`, `Comments & memos` ou `Help`. Apague o prefixo para ter os comandos de volta.

`#` lista as tabelas, cada uma com `Table` ao lado, e uma tabela com nome em branco é listada como `unnamed`. Sem nada depois de `#`, elas são ordenadas por nome. O texto depois de `#` é comparado só com os nomes das tabelas, de forma aproximada, como descrito acima, e as tabelas cujo nome o contém vêm primeiro. Os nomes de grupos de tabelas e de índices não são pesquisados com nenhum prefixo; [Localizar e substituir](./find-and-replace.md#what-it-searches) pesquisa os dois.

`@` lista as colunas por nome, cada uma com sua localização ao lado, como `users.email · Column`. O texto depois de `@` precisa aparecer no nome da coluna, sem diferenciar maiúsculas de minúsculas; essa correspondência não é aproximada. O texto antes do primeiro `.` restringe a pesquisa às tabelas cujo nome o contém: `@users.em` lista as colunas que contêm `em` nas tabelas cujo nome contém `users`, `@users.` lista as colunas dessas tabelas e `@.em` pesquisa todas as tabelas. Sem nada depois de `@`, as colunas são listadas sem filtro.

`:` lista comentários de tabelas, comentários de colunas e notas, nunca nomes. Cada linha mostra um trecho do texto em torno da correspondência, com `users · Table comment`, `users.email · Column comment` ou `Memo` ao lado. O texto depois de `:` precisa aparecer no comentário ou na nota, sem diferenciar maiúsculas de minúsculas, como com `@`. Sem nada depois de `:`, são listados os comentários e as notas que não estão vazios. Enquanto View Option → `Memos` oculta as notas, `:` não lista nenhuma nota.

`@` e `:` listam suas linhas na ordem em que estão no documento: tabela por tabela, o comentário de cada tabela antes das colunas dela, na ordem das colunas, e as notas por último.

`?` lista `Tables`, `Columns` e `Comments & memos`, e o texto depois de `?` os filtra. Escolher um deles substitui o conteúdo do campo pelo prefixo correspondente e deixa a paleta aberta.

Uma lista com prefixo contém todas as correspondências, quantas houver. Um prefixo cuja pesquisa não encontra nada deixa a lista vazia, sem nenhuma mensagem.

Escolher uma tabela, coluna, comentário ou nota fecha a paleta e muda para a aba ERD se você estiver em outra.  
O canvas rola até o item, a menos que ele já esteja bem visível — consulte [Onde um salto termina](./table-related-functions.md#where-a-jump-lands). Uma tabela fica então como a única selecionada e é trazida para a frente, com o nome em foco, a menos que o foco já estivesse nessa tabela.  
Uma nota fica como a única selecionada e é trazida para a frente. No caso de uma coluna ou de um comentário, a tabela correspondente fica como a única selecionada, é trazida para a frente e recebe o foco na célula que contém o texto, ou no nome ao lado de um comentário que uma [opção de exibição da tabela](./table-related-functions.md#table-view-options) oculta.  
Nenhum salto inicia nem conclui um relacionamento que esteja sendo desenhado.

Para `Match Case`, `Match Whole Word` ou `Use Regular Expression`, ou para substituir texto, use [Localizar e substituir](./find-and-replace.md) no topo do explorador.

## Quando nenhum comando corresponde {#when-no-command-matches}

No nível superior, sem prefixo, se nenhum comando listado contiver o que você digitou, sem diferenciar maiúsculas de minúsculas, três linhas aparecem depois dos comandos: `Search tables for "…"`, `Search columns for "…"` e `Search comments & memos for "…"`, cada uma com seu prefixo como ícone. Escolher uma delas digita esse prefixo antes do seu texto, então `users` vira `#users`, e a paleta continua aberta nesses resultados.  
Se a pesquisa não encontrar comando algum, `No commands match` aparece acima da lista, que então contém só as três linhas. Se encontrar só comandos que não contêm o texto, eles vêm primeiro: na aba ERD, sem nenhuma tabela selecionada, `tables` lista `New Table`, `Database` e, onde é oferecido, `New Table Group` antes das três linhas. Com uma tabela selecionada, `Group Selected Tables`, onde é oferecido, contém `tables`, então as três linhas não aparecem.  
Dentro de um submenu, uma pesquisa que não encontra nada deixa a lista vazia, sem nenhuma mensagem.

## Pesquisar em coreano {#searching-in-korean}

Uma pesquisa que contém hangul também encontra correspondências pelas letras, nos comandos, nos submenus e com qualquer prefixo.  
Cada etapa pela qual um método de entrada coreano passa continua encontrando a linha cujo texto você está digitando, então `ㅅ`, `사`, `상`, `사요` e `사용` encontram todos `사용자`. Uma pesquisa feita só de consoantes iniciais corresponde às consoantes iniciais das sílabas, ignorando os espaços: `ㅅㅇㅈ` encontra `사용자`, e `ㅈㅁ` encontra `주문 내역`. Um grupo consonantal que um método de entrada do Windows compõe a partir de duas iniciais digitadas em sequência, como `ㅄ`, conta como as duas (`ㅂㅅ`), enquanto uma consoante dupla como `ㄲ` continua sendo uma única letra. O texto armazenado em forma decomposta, como ficam os nomes de arquivo no macOS, corresponde como se estivesse composto.  
As linhas cujo texto inteiro forma o termo de pesquisa, letra por letra ou inicial por inicial, vêm primeiro, depois as linhas que começam com ele e depois as que o contêm. Com `@` e `:`, as linhas que contêm o termo de pesquisa tal como foi digitado vêm antes de todas essas, na ordem do documento. O realce abrange sílabas inteiras, então `상` realça `사용` em `사용자`.
