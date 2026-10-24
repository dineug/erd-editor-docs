---
sidebar_position: 4
description: Dar nomes lógicos a tabelas e colunas, mostrar os nomes físicos, os nomes lógicos ou ambos com a vista de nomes, completar os nomes dos termos à medida que escreve, vincular colunas a domínios e ver em que outros locais os nomes seguem a vista.
---

# Nomes lógicos

Uma tabela e cada uma das suas colunas podem ter um nome lógico ao lado do nome. O nome lógico é o que as pessoas leem, como `Customer Name` para `CUST_NM`. O nome em si é o nome físico, o que o [Esquema SQL](./schema-sql.md) e o [Gerador de código](./code-generator.md) escrevem.  
A vista de nomes decide qual dos dois a tela ERD desenha: os nomes, os nomes lógicos ou ambos — consulte [Vista de nomes](#name-view).  
Um nome lógico também pode dar à sua tabela ou coluna um nome físico, derivado das palavras e dos termos do separador [Dicionário](./dictionary.md) — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
Uma coluna pode ser vinculada a um domínio, um tipo de dados com nome, como `Name` para `VARCHAR(100)`, guardado na folha `Domains` do separador Dicionário, e passa então a ter o tipo de dados do domínio — consulte [A célula Domínio](#the-domain-cell).  
O Esquema SQL pode escrever cada nome lógico num comentário vazio — consulte [Nomes lógicos como comentários](./schema-sql.md#logical-names-as-comments).

## Vista de nomes {#name-view}

Há três vistas, e cada uma desenha à sua maneira o cabeçalho e as linhas de uma tabela:

- A vista `Physical Names`, a de um diagrama novo, não desenha nenhum nome lógico. O cabeçalho mostra o nome da tabela e, enquanto Opções de vista → `Table Comment` está ativada, o seu comentário, e cada linha mostra as suas células pela [ordem das colunas](./settings.md#adjusting-column-order).
- A vista `Logical Names` desenha o nome lógico no lugar de cada nome: no cabeçalho e, em cada linha, na posição que `Name` ocupa na ordem das colunas. A célula do tipo de uma linha pode representar o domínio da coluna, como se descreve abaixo.
- A vista `Both Names` desenha o nome lógico ao lado do nome. O cabeçalho mostra o nome lógico, depois o nome e depois o comentário, e cada linha ganha uma célula `Logical Name`, que a ordem das colunas coloca, por predefinição, imediatamente antes de `Name`.

Um nome lógico em branco, incluindo um feito apenas de espaços, mostra um substituto esbatido. Na vista `Logical Names`, é o nome desenhado no seu lugar, ou o marcador de posição `table` ou `column` quando o nome também está em branco. Na vista `Both Names`, é o marcador de posição `logical`.

Na vista `Logical Names`, uma coluna vinculada a um domínio com nome na folha `Domains` do separador Dicionário mostra o nome desse domínio na sua célula do tipo, em vez do seu tipo de dados. Todas as outras colunas mostram aí o seu tipo de dados.  
Enquanto Opções de vista → `Domain` está ativada, o domínio tem uma célula própria e a célula do tipo mantém o tipo de dados, pelo que nenhuma linha mostra o domínio duas vezes — consulte [A célula Domínio](#the-domain-cell).

Cada tabela é tão larga quanto as células que desenha na vista, pelo que uma mudança de vista redimensiona as tabelas e volta a traçar os seus conectores. Nenhuma tabela se move.  
A `70%` ou menos, uma tabela fica reduzida ao nome — consulte [Ampliar e reduzir](./table-related-functions.md#zoom-inout). Na vista `Logical Names`, mostra o nome lógico, ou o nome esbatido enquanto não houver nenhum. Na vista `Both Names`, mostra o nome lógico com o nome numa linha por baixo, ou apenas o nome enquanto não houver nome lógico.

As verificações do separador Dicionário podem escrever um nome lógico ou um nome a vermelho ou a âmbar onde o assinalam — consulte [Marcas na tela](./dictionary.md#marks-on-the-canvas).

## Mudar de vista {#switching-the-view}

Há quatro locais que mudam a vista, e cada um apresenta `Physical Names`, `Logical Names` e `Both Names` com a vista em vigor marcada:

- O botão `Name View` na [barra de ferramentas da tela](./table-related-functions.md#canvas-toolbar), entre as quatro notações de relação e o modo zen. Mostra o nome da vista em vigor, com uma seta para baixo, e a sua dica indica `Name View`. Um clique abre a lista acima da barra de ferramentas, e uma escolha fecha-a.
- A opção `Name View` no menu de contexto da tela, logo a seguir a `View Option`: um submenu com as três vistas. O menu continua aberto depois de uma escolha.
- A mesma lista na barra de ferramentas do separador Visualização no modo `Flow`, a seguir ao menu de apresentação das linhas — consulte [Barra de ferramentas](./visualization.md#toolbar).
- A entrada `Name View` na [pesquisa rápida](./quick-search.md#what-the-palette-lists), logo a seguir a `Tab` e apresentada apenas no separador ERD. O seu submenu abre-se com o realce na vista em vigor.

![Mudar a vista de nomes para Logical Names a partir da barra de ferramentas da tela, para Both Names a partir do menu da tela e de volta para Physical Names, com ordered_at, que não tem nome lógico, esbatido e depois mostrado como o marcador de posição logical](/img/demo-name-view.webp)

Os quatro definem a mesma vista. A barra de ferramentas superior não tem nenhum botão para ela.

Uma mudança de vista mantém a seleção e não fica registada no [histórico de anulação](./undo-redo.md#what-the-history-records).  
Quando a nova vista não desenha a célula com o foco, o foco passa para a célula desenhada no seu lugar: o nome e o nome lógico ocupam o lugar um do outro, tal como o tipo e o domínio. Um editor de célula aberto nessa célula fecha-se. Ativar ou desativar Opções de vista → `Domain` move o foco da mesma forma.  
Enquanto o bloqueio `Name View` está ativado, como acontece num diagrama novo, uma mudança de vista altera apenas o seu próprio ecrã, e o ficheiro mantém a vista com que foi bloqueado. Com o bloqueio desativado, o ficheiro guarda a vista para a qual muda — consulte [Bloqueio](./settings.md#lock).

## Escrever um nome lógico {#writing-a-logical-name}

A vista `Physical Names` não desenha nenhum nome lógico, pelo que, para escrever um na tela, mude para a vista `Logical Names` ou `Both Names`:

- Na vista `Logical Names`, as células do nome do cabeçalho e das linhas contêm os nomes lógicos, pelo que, nesta vista, não é possível editar um nome físico na tela.
- Na vista `Both Names`, as células do nome lógico contêm os nomes lógicos e as células do nome contêm os nomes físicos.

Uma célula do nome lógico edita-se como qualquer outra célula: comece com `Enter` ou com um duplo clique — consulte [Edição de tabelas](./table-editing.md). Quando é aberto num nome lógico em branco, o editor mostra como marcador de posição o que a célula desenhava: o nome na vista `Logical Names` e `logical` na vista `Both Names`.  
O que escreve altera apenas o nome lógico. O nome físico é derivado dele quando o editor se fecha (`Enter`, `Tab`, `Escape` ou um clique noutro sítio) com um nome lógico alterado, num passo de anulação próprio, a seguir ao que escreveu. Um nome físico que tenha escrito por si fica como está — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).

`Tab` e `Shift + Tab` percorrem as células que a vista desenha, pela respetiva ordem — consulte [Tecla Tab](./table-editing.md#tab-key):

- Na vista `Logical Names`, o nome lógico do cabeçalho, depois o seu comentário e depois as células de cada linha pela ordem das colunas, com o nome lógico no lugar do nome.
- Na vista `Both Names`, o nome lógico, o nome e o comentário do cabeçalho e depois as células de cada linha pela ordem das colunas, com a célula `Logical Name` em primeiro lugar por predefinição.

`Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) adiciona uma coluna e dá o foco à sua célula do nome, que, na vista `Logical Names`, é o seu nome lógico.

Uma coluna de chave externa adicionada por uma relação copia o nome lógico e o domínio da sua chave, juntamente com o tipo — consulte [Relações identificadoras](./relationship-editing.md#identifying-relationships).  
Copiar colunas para uma folha de cálculo e colar colunas a partir de uma utilizam as células que a vista desenha, incluindo as células do nome lógico e as células Domínio — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).

## Completar os nomes dos termos {#completing-term-names}

Enquanto escreve numa célula do nome lógico, seja a do cabeçalho ou a de uma linha, uma lista por baixo da célula propõe os termos cujos nomes começam pelo texto, sem distinguir maiúsculas de minúsculas e ignorando os espaços antes dele. Um termo é um nome lógico completo guardado na folha `Terms` do separador Dicionário, com o nome físico e o domínio que atribui. A lista mostra até oito termos, ordenados pelo nome, com o texto escrito realçado. Não há lista enquanto nenhum termo começar dessa forma.

![Adicionar uma coluna com ⌥ + Enter na vista Both Names, escolher Order Amount na lista de termos por baixo do seu nome lógico para preencher ORD_AMT, DECIMAL(10,2) e o domínio Amount e depois escrever Order Date, cujo nome, ORD_DT, as palavras compõem quando Enter fecha o editor](/img/demo-logical-names.webp)

- De início, nada está realçado. `↑` e `↓` movem o realce, dando a volta nas duas extremidades, e o termo realçado mostra a tecla `Enter`.
- `Enter` num termo realçado escreve o seu nome como nome lógico e termina a edição. A menos que o nome físico seja um que escreveu por si, o mesmo passo de anulação deriva de imediato o nome físico a partir do termo e dá também a uma coluna o domínio do termo. `Enter` sem nada realçado termina a edição e mantém o que escreveu.
- Um clique num termo escreve-o da mesma forma e deixa o editor aberto.
- `Escape` enquanto a lista está visível fecha apenas a lista, e o `Escape` seguinte termina a edição.
- `Tab` avança com o texto tal como foi escrito, e o nome físico é derivado dele quando o editor se fecha.
- Enquanto um método de introdução está a compor texto, as setas e `Enter` pertencem à composição.

O que um termo dá a uma tabela ou a uma coluna é explicado em [Derivar nomes físicos](./dictionary.md#deriving-physical-names).

## A célula Domínio {#the-domain-cell}

Opções de vista → `Domain`, desativada por predefinição, dá a cada linha uma célula Domínio em todas as vistas, na posição que `Domain` ocupa na ordem das colunas, logo a seguir a `DataType` por predefinição — consulte [Opções de vista das tabelas](./table-related-functions.md#table-view-options).  
A célula mostra o nome do domínio a que a coluna está vinculada ou, numa coluna não vinculada a nenhum domínio que a folha `Domains` apresente, o marcador de posição `domain`, esbatido.

![Ativar Opções de vista → Domain, escolher Amount na célula Domínio de PAY_AMT depois de restringir a lista com amo, alterar o Data Type do domínio Amount para DECIMAL(12,2) no separador Dicionário e ver que a coluna mudou com ele, e depois escrever NUMERIC(12,2) na coluna, o que a desvincula](/img/demo-domains.webp)

`Enter` ou um duplo clique abre um seletor sobre a célula: um campo vazio com o texto da célula como marcador de posição e, por baixo, `None` e depois todos os domínios com nome da folha `Domains`, pela ordem da folha. O realce começa no domínio vinculado ou em `None`.

- Escrever apresenta apenas os domínios cujos nomes contêm o texto, sem distinguir maiúsculas de minúsculas, retira `None` e realça o primeiro. `↑` e `↓` movem o realce.
- `Enter` vincula o domínio realçado, e um clique vincula o domínio clicado. Qualquer um deles dá à coluna o tipo de dados do domínio, num único passo de anulação, e termina a edição. `None` desvincula a coluna e mantém o seu tipo de dados.
- O que escreve nunca é escrito na coluna. Enquanto a folha `Domains` não tiver nenhum domínio com nome, não há lista, e `Enter` termina a edição sem escrever nada.

Na vista `Logical Names`, com Opções de vista → `Domain` desativada, uma célula do tipo que mostra o nome de um domínio abre este seletor, e uma que mostra um tipo de dados abre o editor do tipo de dados — consulte [Preenchimento automático do tipo de dados](./table-editing.md#datatype-autocomplete). Para vincular um domínio a uma coluna que não tem nenhum, ative a célula Domínio.  
Uma coluna vinculada tem o tipo de dados do seu domínio e acompanha-o quando o tipo do domínio muda, e escrever outro tipo na sua célula DataType desvincula-a — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

## Além da tela {#beyond-the-canvas}

A maioria dos outros locais que dão nome a uma tabela ou a uma coluna também segue a vista de nomes:

- A vista `Physical Names` mostra o nome.
- A vista `Logical Names` mostra o nome lógico ou, enquanto o nome lógico estiver em branco, o nome, esbatido onde o local o permite.
- A vista `Both Names` mostra o nome lógico seguido do nome: esbatido numa linha de texto, numa segunda linha numa etiqueta do Graph e entre parênteses onde um único texto tem de conter ambos, como em `Member (member)`. Uma tabela ou coluna sem nome lógico mostra apenas o nome.

Uma lista ordenada pelo nome, como as tabelas do explorador ou as linhas `#` da pesquisa rápida, continua ordenada pelo nome em todas as vistas, nunca pelo nome lógico.

Os locais que seguem a vista:

- No separador Visualização, os cartões do Flow — consulte [Nomes nos cartões](./visualization.md#names-on-the-cards) — e, no Graph, as etiquetas e a pré-visualização ao passar o ponteiro — consulte [Como ler o grafo](./visualization.md#reading-the-graph) e [Pré-visualização ao passar o ponteiro](./visualization.md#hover-preview).
- O painel [Propriedades da tabela](./table-related-functions.md#table-properties): os seus chips e, no separador `Indexes`, as linhas em `Columns` e a lista `Index order` — consulte [Índices](./table-related-functions.md#indexes).
- As linhas das tabelas e das colunas do [explorador](./explorer.md#the-tree) e as tabelas apresentadas em cada grupo de tabelas.
- As linhas `#` da pesquisa rápida — consulte [Pesquisar no diagrama](./quick-search.md#searching-the-diagram).
- A árvore de alterações e os dois lados do [visualizador de diferenças](./table-related-functions.md#diff-viewer).
- A caixa de diálogo [Mapear colunas](./relationship-editing.md#map-columns) e a dica `<parent> has no primary key to copy` que a opção `Create new columns` pode mostrar enquanto se desenha uma relação — consulte [Criação de relações](./editing-start.md#relationship-creation).
- A cópia das linhas que o arrasto de uma coluna leva sobre a tela vazia, que mostra as células do nome e do tipo de cada linha tal como a linha as desenha — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).
- A coluna `Target` da folha `Checks` do separador Dicionário — consulte [A folha Verificações](./dictionary.md#the-checks-sheet).
- Uma [imagem exportada](./file-import-export.md#image).

Alguns locais mantêm os nomes seja qual for a vista: as linhas de índices e de chaves externas do explorador, o grupo `Keys` no separador `Indexes` do painel Propriedades da tabela, a linha `New column: <name>` da caixa de diálogo Mapear colunas e o local escrito ao lado de uma linha `@` ou `:` da pesquisa rápida.

O visualizador de diferenças, a [viagem no tempo](./undo-redo.md#time-travel), a pré-visualização `Force` da [disposição automática](./table-related-functions.md#auto-layout) e a caixa de diálogo `Export image` abrem-se na vista de nomes que está a ver, seja qual for a vista que o ficheiro guarda. Cada um mantém essa vista enquanto está aberto.  
Todas as disposições automáticas, tal como uma importação com `Import` ou `Import and Add` de Esquema SQL, GraphQL, DBML ou AML, posicionam as tabelas com as larguras que ocupam na sua vista.

## Localizar pelo nome lógico {#finding-by-logical-name}

Os nomes lógicos são encontrados em todas as vistas, incluindo a vista `Physical Names`, em que a tela não desenha nenhum:

- [Localizar e substituir](./find-and-replace.md#what-it-searches) pesquisa-os como um tipo de texto próprio, `Logical names`, tanto em tabelas como em colunas, e esse tipo está ativado quando a pesquisa é aberta pela primeira vez. Substituir um nome lógico deriva o nome físico a partir dele, tal como acontece ao escrever um.
- Na [pesquisa rápida](./quick-search.md#searching-the-diagram), `#` encontra uma tabela pelo nome ou pelo nome lógico, e `@` encontra uma coluna por qualquer um dos dois, com `Logical name` ao lado numa correspondência no nome lógico. A parte da tabela em `@`, antes do `.`, também corresponde ao nome ou ao nome lógico de uma tabela.

Mudar a vista de nomes altera a forma como os resultados são nomeados, nunca o que é encontrado.

## Colaboradores {#collaborators}

Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), os nomes lógicos e os vínculos aos domínios chegam a todos os editores como qualquer outra edição.  
Enquanto o bloqueio `Name View` está ativado, cada editor mantém uma vista própria, e uma mudança de vista só aparece no editor que a fez. Enquanto está desativado, uma mudança de vista em qualquer editor que não seja só de leitura muda a vista de todos os editores — consulte [Bloqueio](./settings.md#lock), que também explica o que ativar ou desativar o bloqueio faz à vista de cada editor.  
Quando a célula com o foco de um participante é uma que a sua vista não desenha, a cor desse participante aparece na célula que a sua vista desenha no lugar dela: uma célula do nome na vista `Physical Names` aparece na sua célula do nome lógico na vista `Logical Names`, e vice-versa, e uma célula do tipo e o domínio que ocupa o seu lugar correspondem-se da mesma forma.

Um agente de programação que trabalhe através do servidor MCP define nomes lógicos e vincula domínios seja qual for a vista que está a ver, e não tem nenhuma ferramenta que mude a vista de nomes — consulte [Dicionários](../../mcp/tools.md#dictionaries) e [Definições](../../mcp/tools.md#settings).

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), todos os seletores da vista de nomes funcionam, e uma mudança de vista altera apenas esse ecrã, seja qual for o bloqueio.  
Os nomes lógicos e os domínios não podem ser editados aí, pelo que não se abre nenhuma lista de termos nem nenhum seletor de domínios, e não é proposta nenhuma das entradas `Derive Physical Name Again` e `Derive Physical Names Again`. Opções de vista → `Domain` não altera nada aí, tal como nenhuma [opção de vista](./table-related-functions.md#table-view-options) altera.
