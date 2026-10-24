---
sidebar_position: 4
description: Dar nomes lógicos a tabelas e colunas, mostrar nomes físicos, nomes lógicos ou ambos com a exibição de nomes, completar nomes de termos ao digitar, vincular colunas a domínios e ver onde mais os nomes acompanham a exibição.
---

# Nomes lógicos

Uma tabela e cada uma de suas colunas podem ter um nome lógico ao lado do nome. O nome lógico é o que as pessoas leem, como `Customer Name` para `CUST_NM`. O nome em si é o nome físico, o que o [Esquema SQL](./schema-sql.md) e o [Gerador de código](./code-generator.md) escrevem.  
A exibição de nomes decide qual dos dois o canvas ERD desenha: os nomes, os nomes lógicos ou ambos — consulte [Exibição de nomes](#name-view).  
Um nome lógico também pode dar à sua tabela ou coluna um nome físico, derivado das palavras e dos termos da aba [Dicionário](./dictionary.md) — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
Uma coluna pode ser vinculada a um domínio, um tipo de dados com nome, como `Name` para `VARCHAR(100)`, mantido na planilha `Domains` da aba Dicionário, e passa então a ter o tipo de dados do domínio — consulte [A célula Domínio](#the-domain-cell).  
O Esquema SQL pode escrever cada nome lógico em um comentário vazio — consulte [Nomes lógicos como comentários](./schema-sql.md#logical-names-as-comments).

## Exibição de nomes {#name-view}

Há três exibições, e cada uma desenha o cabeçalho e as linhas de uma tabela à sua maneira:

- `Physical Names`, a exibição de um diagrama novo, não desenha nenhum nome lógico. O cabeçalho mostra o nome da tabela e, enquanto View Option → `Table Comment` está ativado, o comentário dela, e cada linha mostra suas células na [ordem das colunas](./settings.md#adjusting-column-order).
- `Logical Names` desenha o nome lógico no lugar de cada nome: no cabeçalho e, em cada linha, onde `Name` fica na ordem das colunas. A célula de tipo de uma linha pode representar o domínio da coluna, como descrito abaixo.
- `Both Names` desenha o nome lógico ao lado do nome. O cabeçalho mostra o nome lógico, depois o nome e depois o comentário, e cada linha ganha uma célula `Logical Name`, que a ordem das colunas posiciona logo antes de `Name` por padrão.

Um nome lógico em branco, inclusive um formado só por espaços, mostra um substituto esmaecido. Na exibição `Logical Names`, ele é o nome desenhado no seu lugar, ou o espaço reservado `table` ou `column` quando o nome também está em branco. Na exibição `Both Names`, ele é o espaço reservado `logical`.

Na exibição `Logical Names`, uma coluna vinculada a um domínio com nome na planilha `Domains` da aba Dicionário mostra o nome desse domínio na célula de tipo em vez do tipo de dados. Todas as outras colunas mostram ali o tipo de dados.  
Enquanto View Option → `Domain` está ativado, o domínio tem uma célula própria e a célula de tipo mantém o tipo de dados, então nenhuma linha mostra o domínio duas vezes — consulte [A célula Domínio](#the-domain-cell).

Cada tabela tem a largura das células que desenha na exibição, então uma troca redimensiona as tabelas e refaz o traçado dos conectores delas. Nenhuma tabela se move.  
Em `70%` ou menos, uma tabela se reduz ao nome — consulte [Aumentar e diminuir o zoom](./table-related-functions.md#zoom-inout). Na exibição `Logical Names`, ela mostra o nome lógico, ou o nome esmaecido enquanto não há nome lógico. Na exibição `Both Names`, ela mostra o nome lógico com o nome em uma linha abaixo dele, ou só o nome enquanto não há nome lógico.

As verificações do Dicionário podem escrever um nome lógico ou um nome em vermelho ou âmbar onde o apontam — consulte [Marcas no canvas](./dictionary.md#marks-on-the-canvas).

## Trocar a exibição {#switching-the-view}

Quatro lugares trocam a exibição, e cada um lista `Physical Names`, `Logical Names` e `Both Names`, com a exibição em vigor marcada:

- O botão `Name View` da [barra de ferramentas do canvas](./table-related-functions.md#canvas-toolbar), entre as quatro notações de relacionamento e o modo zen. Ele mostra o nome da exibição em vigor, com uma seta para baixo, e sua dica de ferramenta diz `Name View`. Um clique abre a lista acima da barra de ferramentas, e uma escolha a fecha.
- `Name View` no menu de contexto do canvas, logo depois de `View Option`: um submenu com as três exibições. O menu continua aberto depois de uma escolha.
- A mesma lista na barra de ferramentas da aba Visualização, no modo `Flow`, depois do menu de exibição de linhas — consulte [Barra de ferramentas](./visualization.md#toolbar).
- `Name View` na [pesquisa rápida](./quick-search.md#what-the-palette-lists), logo depois de `Tab` e listado somente na aba ERD. Seu submenu se abre com o realce na exibição em vigor.

![Troca da exibição de nomes para Logical Names pela barra de ferramentas do canvas, para Both Names pelo menu do canvas e de volta para Physical Names, com ordered_at, que não tem nome lógico, esmaecido e depois mostrado como o espaço reservado logical](/img/demo-name-view.webp)

Os quatro definem a mesma exibição. A barra de ferramentas superior não tem nenhum botão para ela.

Uma troca mantém a seleção e não é registrada no [histórico de desfazer](./undo-redo.md#what-the-history-records).  
Uma célula em foco que a nova exibição não desenha passa para a célula desenhada no lugar dela: o nome e o nome lógico ocupam o lugar um do outro, assim como o tipo e o domínio. Um editor de célula aberto nessa célula se fecha. Ativar ou desativar View Option → `Domain` move o foco da mesma maneira.  
Enquanto o bloqueio `Name View` está ativado, como em um diagrama novo, uma troca altera apenas a sua própria tela, e o arquivo mantém a exibição em que foi bloqueado. Com o bloqueio desativado, o arquivo salva a exibição para a qual você troca — consulte [Bloqueio](./settings.md#lock).

## Escrever um nome lógico {#writing-a-logical-name}

A exibição `Physical Names` não desenha nenhum nome lógico, então troque para `Logical Names` ou `Both Names` para escrever um no canvas:

- Na exibição `Logical Names`, as células de nome do cabeçalho e das linhas contêm os nomes lógicos, então um nome físico não pode ser editado no canvas nessa exibição.
- Na exibição `Both Names`, as células de nome lógico contêm os nomes lógicos, e as células de nome, os nomes físicos.

Uma célula de nome lógico é editada como qualquer outra célula: comece com `Enter` ou um clique duplo — consulte [Edição de tabelas](./table-editing.md). Aberto em um nome lógico em branco, o editor mostra como texto de espaço reservado o que a célula desenhava: o nome na exibição `Logical Names`, `logical` na exibição `Both Names`.  
Digitar escreve apenas o nome lógico. O nome físico é derivado dele quando o editor se fecha (`Enter`, `Tab`, `Escape` ou um clique em outro lugar) sobre um nome lógico alterado, como uma etapa de desfazer própria, depois da sua digitação. Um nome físico escrito por você fica como está — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).

`Tab` e `Shift + Tab` percorrem as células que a exibição desenha, na ordem delas — consulte [Tecla Tab](./table-editing.md#tab-key):

- Na exibição `Logical Names`, o nome lógico do cabeçalho, depois o comentário dele e depois as células de cada linha na ordem das colunas, com o nome lógico no lugar do nome.
- Na exibição `Both Names`, o nome lógico, o nome e o comentário do cabeçalho e depois as células de cada linha na ordem das colunas, com a célula `Logical Name` primeiro por padrão.

`Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) adiciona uma coluna e coloca o foco na célula de nome dela, que na exibição `Logical Names` é o nome lógico.

Uma coluna de chave estrangeira que um relacionamento adiciona copia o nome lógico e o domínio da sua chave, junto com o tipo — consulte [Relacionamentos identificadores](./relationship-editing.md#identifying-relationships).  
Copiar colunas para uma planilha eletrônica e colar colunas a partir de uma usam as células que a exibição desenha, inclusive as células de nome lógico e Domínio — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).

## Completar nomes de termos {#completing-term-names}

Enquanto você digita em uma célula de nome lógico, a do cabeçalho ou a de uma linha, uma lista sob a célula oferece os termos cujos nomes começam com o texto, sem diferenciar maiúsculas de minúsculas e ignorando os espaços antes dele. Um termo é um nome lógico inteiro mantido na planilha `Terms` da aba Dicionário, com o nome físico e o domínio que ele dá. A lista mostra até oito termos, classificados por nome, com o texto digitado realçado. Não há lista enquanto nenhum termo começa assim.

![Adição de uma coluna com ⌥ + Enter em Both Names, escolha de Order Amount na lista de termos sob o nome lógico dela para preencher ORD_AMT, DECIMAL(10,2) e o domínio Amount e depois digitação de Order Date, cujo nome ORD_DT as palavras dão quando Enter fecha o editor](/img/demo-logical-names.webp)

- No início, nada está realçado. `↑` e `↓` movem o realce, dando a volta nas duas pontas, e o termo realçado mostra a tecla `Enter`.
- `Enter` em um termo realçado escreve o nome dele como nome lógico e encerra a edição. A menos que o nome físico tenha sido escrito por você, a mesma etapa de desfazer deriva imediatamente o nome físico a partir do termo e também dá a uma coluna o domínio do termo. `Enter` sem nada realçado encerra a edição e mantém o que você digitou.
- Um clique em um termo o escreve da mesma maneira e deixa o editor aberto.
- `Escape` enquanto a lista está visível fecha apenas a lista, e o `Escape` seguinte encerra a edição.
- `Tab` segue adiante com o texto como foi digitado, e o nome físico é derivado dele quando o editor se fecha.
- Enquanto um método de entrada está compondo, as setas e `Enter` pertencem à composição.

O que um termo dá a uma tabela ou a uma coluna é abordado em [Derivar nomes físicos](./dictionary.md#deriving-physical-names).

## A célula Domínio {#the-domain-cell}

View Option → `Domain`, desativado por padrão, dá a cada linha uma célula Domínio em todas as exibições, onde `Domain` fica na ordem das colunas, logo depois de `DataType` por padrão — consulte [Opções de exibição da tabela](./table-related-functions.md#table-view-options).  
A célula mostra o nome do domínio ao qual a coluna está vinculada ou, para uma coluna não vinculada a nenhum domínio que a planilha `Domains` lista, o espaço reservado `domain`, esmaecido.

![Ativação de View Option → Domain, escolha de Amount na célula Domínio de PAY_AMT depois de restringir a lista com amo, alteração do Data Type de Amount para DECIMAL(12,2) na aba Dicionário com a coluna alterada junto e depois digitação de NUMERIC(12,2) na coluna, o que a desvincula](/img/demo-domains.webp)

`Enter` ou um clique duplo abre um seletor sobre a célula: um campo vazio com o texto da célula como texto de espaço reservado e, abaixo dele, `None` e depois todos os domínios com nome da planilha `Domains`, na ordem da planilha. O realce começa no domínio vinculado ou em `None`.

- Digitar lista apenas os domínios cujos nomes contêm o texto, sem diferenciar maiúsculas de minúsculas, remove `None` e realça o primeiro. `↑` e `↓` movem o realce.
- `Enter` vincula o domínio realçado, e um clique vincula o domínio clicado. Ambos dão à coluna o tipo de dados do domínio, como uma única etapa de desfazer, e encerram a edição. `None` desvincula a coluna e mantém o tipo de dados dela.
- O que você digita nunca é escrito na coluna. Enquanto a planilha `Domains` não tem nenhum domínio com nome, não há lista, e `Enter` encerra a edição sem escrever nada.

Na exibição `Logical Names` com View Option → `Domain` desativado, uma célula de tipo que mostra o nome de um domínio abre esse seletor, e uma que mostra um tipo de dados abre o editor de tipo de dados — consulte [Preenchimento automático do tipo de dados](./table-editing.md#datatype-autocomplete). Para vincular um domínio a uma coluna que não tem nenhum, ative a célula Domínio.  
Uma coluna vinculada mantém o tipo de dados do seu domínio e o acompanha quando o tipo do domínio muda, e digitar outro tipo na célula DataType dela a desvincula — consulte [Domínios e tipos de dados](./dictionary.md#domains-and-data-types).

## Além do canvas {#beyond-the-canvas}

A maioria dos outros lugares que nomeiam uma tabela ou uma coluna também acompanha a exibição de nomes:

- `Physical Names` mostra o nome.
- `Logical Names` mostra o nome lógico ou, enquanto o nome lógico está em branco, o nome, esmaecido onde o lugar consegue esmaecê-lo.
- `Both Names` mostra o nome lógico com o nome depois dele: esmaecido em uma linha de texto, em uma segunda linha em um rótulo do Graph e entre parênteses onde um único texto precisa conter os dois, como `Member (member)`. Uma tabela ou coluna sem nome lógico mostra apenas o nome.

Uma lista classificada por nome, como as tabelas do explorador ou os itens `#` da pesquisa rápida, continua classificada por nome em todas as exibições, nunca por nome lógico.

Os lugares que acompanham a exibição:

- Na aba Visualização, os cartões do Flow — consulte [Nomes nos cartões](./visualization.md#names-on-the-cards) — e, no Graph, os rótulos e a pré-visualização ao passar o ponteiro — consulte [Como ler o grafo](./visualization.md#reading-the-graph) e [Pré-visualização ao passar o ponteiro](./visualization.md#hover-preview).
- O painel [Propriedades da tabela](./table-related-functions.md#table-properties): seus chips e, na aba `Indexes`, as linhas `Columns` e a lista `Index order` — consulte [Índices](./table-related-functions.md#indexes).
- As linhas de tabela e de coluna do [explorador](./explorer.md#the-tree) e as tabelas listadas sob cada grupo de tabelas.
- Os itens `#` da pesquisa rápida — consulte [Pesquisar no diagrama](./quick-search.md#searching-the-diagram).
- A árvore de alterações do [visualizador de diferenças](./table-related-functions.md#diff-viewer) e os dois lados dele.
- [Mapear colunas](./relationship-editing.md#map-columns) e a dica de ferramenta `<parent> has no primary key to copy` que `Create new columns` pode mostrar enquanto um relacionamento é desenhado — consulte [Criação de relacionamentos](./editing-start.md#relationship-creation).
- A cópia das linhas que o arrasto de uma coluna leva sobre o canvas vazio, que mostra as células de nome e de tipo de cada linha como a linha as desenha — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).
- A coluna `Target` da planilha `Checks` da aba Dicionário — consulte [A planilha Verificações](./dictionary.md#the-checks-sheet).
- Uma [imagem exportada](./file-import-export.md#image).

Alguns lugares mantêm os nomes qualquer que seja a exibição: as linhas de índice e de chave estrangeira do explorador, as `Keys` na aba `Indexes` do painel Propriedades da tabela, a opção `New column: <name>` de Mapear colunas e a localização escrita ao lado de um item `@` ou `:` da pesquisa rápida.

O visualizador de diferenças, a [viagem no tempo](./undo-redo.md#time-travel), a pré-visualização `Force` do [layout automático](./table-related-functions.md#auto-layout) e a caixa de diálogo `Export image` abrem na exibição de nomes que você está vendo, qualquer que seja a exibição que o arquivo mantém. Cada um mantém essa exibição enquanto está aberto.  
Todo layout automático, assim como um `Import` ou `Import and Add` de Esquema SQL, GraphQL, DBML ou AML, posiciona as tabelas com as larguras que elas têm na sua exibição.

## Localizar pelo nome lógico {#finding-by-logical-name}

Os nomes lógicos são encontrados em todas as exibições de nomes, inclusive na exibição `Physical Names`, em que o canvas não desenha nenhum:

- [Localizar e substituir](./find-and-replace.md#what-it-searches) os pesquisa como um tipo de texto, `Logical names`, tanto para tabelas quanto para colunas, e esse tipo está ativado quando a pesquisa abre pela primeira vez. Substituir um nome lógico deriva dele o nome físico, assim como escrever um.
- Na [pesquisa rápida](./quick-search.md#searching-the-diagram), `#` encontra uma tabela pelo nome ou pelo nome lógico, e `@` encontra uma coluna por qualquer um dos dois, com `Logical name` ao lado quando a correspondência está no nome lógico. A parte da tabela em `@`, antes do `.`, também corresponde ao nome ou ao nome lógico de uma tabela.

Trocar a exibição de nomes muda como os resultados são nomeados, nunca o que é encontrado.

## Colaboradores {#collaborators}

Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), os nomes lógicos e os vínculos com domínios chegam a todos os editores como qualquer outra edição.  
Enquanto o bloqueio `Name View` está ativado, cada editor mantém uma exibição própria, e uma troca aparece apenas no editor que a fez. Enquanto ele está desativado, uma troca em qualquer editor que não seja somente leitura troca a exibição de todos os editores — consulte [Bloqueio](./settings.md#lock), que também aborda o que ativar ou desativar o bloqueio faz com a exibição de cada editor.  
Quando a célula em foco de um participante é uma que a sua exibição não desenha, a cor dele aparece na célula que a sua exibição desenha no lugar dela: uma célula de nome na exibição `Physical Names` aparece na sua célula de nome lógico na exibição `Logical Names`, e vice-versa, e uma célula de tipo e o domínio que ocupa o lugar dela se correspondem da mesma maneira.

Um agente de codificação que trabalha pelo servidor MCP define nomes lógicos e vincula domínios qualquer que seja a exibição que você está vendo, e não tem nenhuma ferramenta que troque a exibição de nomes — consulte [Dicionários](../../mcp/tools.md#dictionaries) e [Configurações](../../mcp/tools.md#settings).

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), todos os seletores da exibição de nomes funcionam, e uma troca altera apenas aquela tela, qualquer que seja o bloqueio.  
Ali, os nomes lógicos e os domínios não podem ser editados, então nenhuma lista de termos nem seletor de domínio se abre, e nenhum dos itens `Derive Physical Name Again` e `Derive Physical Names Again` é oferecido. View Option → `Domain` não altera nada ali, assim como nenhuma [opção de exibição](./table-related-functions.md#table-view-options) altera.
