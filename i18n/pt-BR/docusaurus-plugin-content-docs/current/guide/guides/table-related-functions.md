---
sidebar_position: 5
description: Selecionar, mover, copiar, duplicar e excluir tabelas e notas, configurar cores e opções de exibição, definir índices e chaves alternativas, escolher um banco de dados, navegar pelo canvas infinito e comparar documentos.
---

# Funções relacionadas a tabelas

Tudo o que você faz com tabelas e notas depois que elas existem — selecionar, mover, copiar, excluir, colorir e definir o que o canvas mostra — e também os controles do canvas ao redor delas.  
Primeiro vêm os comandos de tabelas e notas; depois, as propriedades da tabela, o foco em tabelas, os índices e as chaves alternativas, o layout automático e o fornecedor de banco de dados; e, por último, o próprio canvas: a barra de ferramentas do canvas, o zoom, o deslocamento da área visível e onde um salto termina, e o visualizador de diferenças.  
Os grupos de tabelas, as caixas que reúnem tabelas, têm uma página própria — consulte [Grupos de tabelas](./table-groups.md).  
O mesmo vale para os nomes lógicos e para a exibição de nomes, que decide os nomes que as tabelas mostram — consulte [Nomes lógicos](./logical-names.md).

## Seleção múltipla {#multiple-selection}

Oferece três métodos:

- `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac)
- `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac)
- `Ctrl + A` ou `Ctrl + Alt + A` (Windows/Linux), `⌘ + A` ou `⌘ + ⌥ + A` (Mac)

As notas são selecionadas da mesma forma, e qualquer um dos dois atalhos de seleção total abrange todas as tabelas e notas de uma vez. As notas ocultas com View Option → `Memos` ficam de fora da seleção total e do retângulo de seleção — consulte [Opções de exibição da tabela](#table-view-options).  
Os [grupos de tabelas](./table-groups.md#selecting-groups) são adicionados à seleção com `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) na barra de título, mas a seleção total nunca inclui um grupo.  
`Ctrl + A` dá preferência ao cursor de texto, então seleciona o texto, e não o diagrama, enquanto você edita uma célula.  
Um retângulo de seleção marca uma tabela ou nota quando cobre o meio dela, e não quando apenas toca uma borda. Ele só inclui um grupo de tabelas quando envolve a caixa inteira do grupo, então um retângulo desenhado dentro de um grupo seleciona tabelas sem o grupo.  
Um clique com o botão direito em algo já selecionado mantém toda a seleção, então itens do menu como `Color`, `Group selected tables` e `Delete selected` atuam sobre ela inteira. Um clique com o botão direito em qualquer outra tabela, nota ou grupo de tabelas seleciona só esse item, mesmo com `Ctrl` ou `⌘` pressionado, e um clique com o botão direito em um relacionamento ou em uma área vazia do canvas limpa a seleção.  
`Escape` limpa a seleção. Enquanto o editor de uma célula, de uma nota ou do nome de um grupo de tabelas está aberto, ou enquanto um relacionamento ou um `New Table Group` está sendo desenhado, o primeiro `Escape` encerra isso e um segundo limpa a seleção.

![Seleção de tabelas com ⌘ + drag e ⌘ + click e, depois, de todas as tabelas e notas com ⌘ + A](/img/demo-table-select.webp)

Em uma sessão colaborativa, a seleção, a célula em foco e o retângulo de seleção de cada participante são desenhados no canvas na cor desse participante — consulte [Edição colaborativa](../../api/advanced/collaborative-editing.md).  
Um participante que está olhando outra exibição de nomes tem sua célula em foco desenhada na célula que a sua exibição desenha no lugar dela, como a célula de nome dele na sua célula de nome lógico — consulte [Colaboradores](./logical-names.md#collaborators).

## Mover várias tabelas {#moving-multiple-tables}

Arraste qualquer tabela ou nota que já faça parte da seleção, e toda a seleção se move junto — sem precisar de tecla modificadora.  
Uma tabela é arrastada pelo cabeçalho ou por qualquer uma das suas linhas de coluna, então um arrasto que começa em uma linha de coluna move a tabela, e não a coluna. As colunas se movem, em vez disso, pela alça de arrastar ao lado da linha em foco — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).  
Em uma célula do cabeçalho ou em uma linha de coluna, a tabela só começa a se mover depois que o ponteiro percorre uma pequena distância, então um clique ali ainda coloca o foco na célula e um clique duplo ainda abre o editor dela. Um arrasto nunca começa na borda colorida de uma tabela, que abre o seletor de cores, nos botões `+` e `x` do cabeçalho dela nem no `x` de uma linha de coluna.  
Arrastar algo fora da seleção reduz a seleção a esse item e move só ele. `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) mantém a seleção em ambos os casos.  
Só o botão esquerdo do mouse move tabelas e notas. Um clique com o botão direito escolhe sobre o que o menu de contexto atua e não move nada, e um arrasto com o botão do meio desloca a área visível do canvas em vez disso — consulte [Navegar pelo canvas](#getting-around-the-canvas).

![Arrastar uma de duas tabelas selecionadas move as duas, e o relacionamento as acompanha](/img/demo-table-multiple-move.webp)

Um [grupo de tabelas](./table-groups.md) selecionado também se move, levando suas tabelas, e uma tabela que está selecionada e também em um grupo em movimento se move uma única vez.  
O lugar onde você solta uma tabela pode colocá-la em um grupo ou tirá-la dele — consulte [Adicionar e remover tabelas](./table-groups.md#adding-and-removing-tables).

Tabelas e notas compartilham uma única ordem de empilhamento. Pressionar uma tabela ou nota, com o botão esquerdo ou o direito, a traz para a frente de todas as outras tabelas e notas, e pressionar a barra de título de um grupo de tabelas, ou clicar com o botão direito no corpo dele, traz as tabelas do grupo para a frente.  
A ordem não é salva: um diagrama reaberto empilha suas tabelas na ordem em que o arquivo as lista, com todas as notas acima delas.

## Copiar e colar tabelas e notas {#copyingpasting-tables-and-memos}

Copia as tabelas e notas selecionadas e as cola de volta como novas.  
Atalhos: `Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac), `Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac)

Uma tabela copiada mantém o nome, o nome lógico, o comentário, as colunas e a cor; uma nota copiada mantém o texto, o tamanho e a cor.  
Cada coluna copiada mantém seu nome lógico, e cada nome de tabela e de coluna continua marcado como derivado ou não dos dicionários — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names).  
Uma coluna colada só mantém seu vínculo com o domínio quando duas condições são atendidas: o diagrama em que ela é colada lista exatamente esse domínio, e não apenas um com o mesmo nome, e o domínio ainda tem o tipo de dados com que a coluna foi copiada. Caso contrário, a coluna chega sem domínio e mantém o tipo com que foi copiada — consulte [Vincular uma coluna](./dictionary.md#linking-a-column).  
Índices e relacionamentos também vêm junto: um índice é copiado inteiro para a tabela copiada, e um relacionamento é copiado com seu tipo e suas ações ON DELETE e ON UPDATE quando as duas tabelas que ele liga estão no conjunto copiado. Um relacionamento pela metade é descartado, em vez de ficar apontando de volta para o original.  
As cópias coladas passam a ser a nova seleção, e colar a mesma cópia de novo a desloca mais `50px` a cada vez, então colagens repetidas não se empilham umas sobre as outras.  
Uma cópia não mantém seu [grupo de tabelas](./table-groups.md): a tabela colada não fica em nenhum grupo, mesmo quando cai dentro da caixa de um grupo, e um grupo selecionado não é copiado.  
Enquanto View Option → `Memos` oculta as notas, uma colagem ainda adiciona as notas que traz, ocultas e não selecionadas, então só as tabelas coladas passam a ser a seleção.

![Cópia de duas tabelas relacionadas, coladas duas vezes, com o relacionamento incluído](/img/demo-table-copy-paste.webp)

Quando há colunas selecionadas dentro de uma tabela em foco, o mesmo atalho copia essas colunas em vez disso — consulte [Edição de tabelas](./table-editing.md).

## Duplicar tabelas e notas {#duplicating-tables-and-memos}

Segure `Alt` e arraste uma tabela ou nota com o botão esquerdo do mouse.  
Uma tabela é pega pelo cabeçalho ou por qualquer linha de coluna, então `Alt + drag` em uma linha de coluna duplica a tabela e deixa a ordem das colunas como está. Segurar `Alt` na alça de arrastar da coluna não duplica nada: a coluna se move como a move um arrasto simples pela alça — consulte [Reordenar e mover colunas](./table-editing.md#rearranging-and-moving-columns).  
Uma pré-visualização translúcida acompanha o ponteiro, e soltar o botão deixa a cópia onde está a pré-visualização.  
Se o que você pegar já fizer parte de uma seleção, a seleção inteira é duplicada. Caso contrário, a seleção é substituída pela entidade sob o ponteiro.  
`Alt + click` sem mover coloca a cópia `50px` abaixo e à direita, avançando mais sempre que esse lugar já está ocupado.

Uma duplicata leva as mesmas coisas que uma [colagem](#copyingpasting-tables-and-memos): nomes e nomes lógicos, comentários, colunas, cores, tamanhos de notas e os índices e relacionamentos que pertencem inteiramente ao que você copiou. Como ela fica no mesmo diagrama, mantém como está o vínculo de cada coluna com o domínio. Como uma colagem, ela não fica em nenhum grupo de tabelas.  
`Alt + drag` na barra de título de um grupo de tabelas move o grupo como um arrasto simples; um grupo nunca é duplicado.

![Duplicação de uma tabela com Alt + drag e, depois, Alt + click para outra cópia abaixo e à direita](/img/demo-table-duplicate.webp)

## Exclusão de tabelas e notas {#table-and-memo-deletion}

Exclui as tabelas, notas e [grupos de tabelas](./table-groups.md) selecionados.  
Atalhos:

- `Delete` ou `Backspace`. Essas teclas removem toda a seleção, exceto quando a única coisa selecionada é uma tabela com algumas de suas colunas selecionadas e o zoom está acima de `70%`: nesse caso, removem essas colunas — consulte [Exclusão de colunas](./table-editing.md#column-deletion).
- `Ctrl + Backspace` ou `Ctrl + Delete` (Windows/Linux), `⌘ + Backspace` ou `⌘ + Delete` (Mac). Essas combinações sempre removem as tabelas, notas e grupos de tabelas selecionados, mesmo com colunas selecionadas.

![Exclusão de uma tabela e de seus relacionamentos com a tecla Delete e, depois, de uma tabela e uma nota juntas com Delete selected no menu da nota](/img/demo-table-remove.webp)

Os menus de contexto também excluem. O último item do menu de uma tabela ou de uma nota passa a ser `Delete selected` enquanto essa tabela ou nota é um de dois ou mais itens selecionados, e remove toda a seleção. Caso contrário, ele mostra `Delete` e remove só essa tabela ou nota. Sobre a linha de uma coluna selecionada, o menu da tabela passa a mostrar `Delete column` ou `Delete columns`, como em [Exclusão de colunas](./table-editing.md#column-deletion).

Remover uma tabela remove também seus relacionamentos e índices. Remover um grupo de tabelas mantém suas tabelas, sem grupo — consulte [Remover um grupo](./table-groups.md#removing-a-group).  
Não há confirmação, cada remoção é uma única etapa de desfazer e, em um editor `readonly`, nada é removido.  
Mantidas pressionadas, `Delete` e `Backspace` removem só uma vez, e nunca removem um relacionamento — consulte [Edição de relacionamentos](./relationship-editing.md#deletion). Enquanto você digita em uma célula, em uma nota ou em qualquer outro campo de texto, elas editam o texto em vez disso.  
A aba Configurações lista as duas teclas como `Delete Selection` — consulte [Atalhos](./settings.md#shortcuts).

## Cores de tabelas e notas {#table-and-memo-color-specification}

É possível atribuir cores para diferenciar por categoria.  
Uma tabela exibe sua cor ao longo da borda esquerda, e uma nota, ao longo do topo. Clique nessa borda ou faixa com o botão esquerdo, ou escolha `Color` no menu de contexto da tabela ou da nota, para abrir o seletor de cores na posição do ponteiro. A cor é aplicada a todas as tabelas, notas e grupos de tabelas selecionados, e não só ao item em que você clicou.  
Um grupo de tabelas recebe cor pelo item `Color` do seu próprio menu, e uma tabela em um grupo colorido exibe a cor do grupo em todo o cabeçalho, mantendo a própria cor na borda esquerda — consulte [Colorir um grupo](./table-groups.md#coloring-a-group).

![Escolha da predefinição Blue na faixa de cor de uma nota para duas tabelas selecionadas e a nota e, depois, remoção da cor com No color](/img/demo-table-color.webp)

O seletor contém, de cima para baixo:

- Uma área de saturação e brilho e, depois, o controle deslizante de matiz com uma pré-visualização da cor ao lado. Onde o navegador oferece um conta-gotas, um botão de pipeta antes do controle deslizante, `Pick a color from the screen`, captura uma cor de qualquer lugar da tela.
- Os campos `Hex`, `R`, `G` e `B`. `Hex` aceita 3, 4, 6 ou 8 dígitos hexadecimais, com ou sem `#`, ou um `rgb()`, `hsl()` ou nome de cor CSS colado. Um valor completo de 6 ou 8 dígitos é aplicado enquanto você digita, e qualquer outro, com `Enter` ou quando você sai do campo. `R`, `G` e `B` aceitam números inteiros, leem qualquer valor acima de `255` como `255` e são aplicados com `Enter` ou quando você sai do campo. Um texto que o seletor não consegue ler é descartado.
- Dezesseis amostras predefinidas em duas fileiras de oito: Red, Orange, Amber, Yellow, Lime, Green, Teal, Cyan, Blue, Indigo, Violet, Purple, Pink, Crimson, Brown e Gray. Passar o ponteiro sobre uma amostra mostra seu código hexadecimal.
- `Document colors`: até oito cores que as tabelas, notas e grupos de tabelas do documento já usam, as mais usadas primeiro. A fileira só aparece quando há alguma.
- `No color`.

Uma cor é sempre sólida: o seletor não tem controle de transparência e descarta qualquer transparência que um valor digitado ou colado traga.  
Abrir o seletor não altera nada, e escolher a cor que a seleção já tem não adiciona nenhuma etapa de desfazer.

`No color` remove a cor de todas as tabelas, notas e grupos de tabelas selecionados em uma única etapa de desfazer e fecha o seletor. `Remove color`, logo abaixo de `Color` nos menus de contexto de tabela, nota e grupo de tabelas enquanto algum item selecionado tem cor, faz o mesmo sem abrir o seletor.

O seletor assume o teclado ao abrir, e `Tab` e `Shift + Tab` percorrem seus controles em ciclo. As teclas de seta movem a área e o controle deslizante de matiz em 1, ou em 10 com `Shift`, e passam de amostra em amostra, aplicando cada uma pelo caminho.  
Enquanto o seletor tem o teclado, desfazer e refazer, os atalhos de zoom, `Search` e `Toggle Explorer` ainda chegam ao editor, e os outros atalhos do editor não: os atalhos de [exclusão](#table-and-memo-deletion) não removem nada, e `Delete` e `Backspace` só editam o texto dos campos `Hex`, `R`, `G` e `B`.  
`Escape` fecha o seletor, assim como pressionar o canvas fora dele.  
Pressionar dentro do [explorador](./explorer.md) não é pressionar o canvas, então o seletor continua aberto. Uma linha escolhida ali muda a seleção, e a próxima escolha colore a nova seleção.

## Opções de exibição da tabela {#table-view-options}

Oferece as seguintes opções de exibição:

- Table Comment
- Column Comment
- DataType
- Domain
- Default
- Not Null
- Unique
- Alternate Key
- Auto Increment
- Relationship
- Referential Actions
- Table Groups
- Memos

`Domain`, `Unique`, `Alternate Key` e `Auto Increment` estão desativadas por padrão, e as demais estão ativadas.  
Os nomes que as tabelas mostram não são uma opção de exibição: `Name View`, logo depois de `View Option` no menu de contexto do canvas, escolhe nomes físicos, nomes lógicos ou ambos — consulte [Trocar a exibição](./logical-names.md#switching-the-view).  
`Domain` dá a cada coluna uma célula, posicionada pela [ordem das colunas](./settings.md#adjusting-column-order), com o nome do domínio ao qual a coluna está vinculada. Uma coluna que não está vinculada a nenhum domínio que a planilha `Domains` lista mostra ali o espaço reservado `domain`, esmaecido. A célula aparece em qualquer exibição de nomes. Enquanto `Domain` está desativada, a exibição `Logical Names` mostra, em vez disso, o nome de um domínio vinculado na célula de tipo — consulte [A célula Domínio](./logical-names.md#the-domain-cell).  
`Alternate Key` marca as colunas de cada chave alternativa, como `AK1.1` — consulte [Chaves alternativas](#alternate-keys).  
`Referential Actions` mostra os rótulos `D:` e `U:` que as ações ON DELETE e ON UPDATE de um relacionamento colocam na extremidade do lado filho do seu conector — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector). Desativá-la oculta só esses rótulos e não move nenhuma tabela nem conector.  
`Table Groups` mostra os [grupos de tabelas](./table-groups.md) e as cores dos grupos nos cabeçalhos de suas tabelas. Desativá-la oculta os grupos no canvas, no minimapa e nas exportações de imagem, não move nenhuma tabela e mantém cada tabela em seu grupo — consulte [Ocultar grupos](./table-groups.md#hiding-groups). Também tira a pasta `Table Groups` do [explorador](./explorer.md#the-tree) e `New Table Group` da [barra de ferramentas do canvas](#canvas-toolbar), e a pesquisa do explorador deixa de encontrar nomes de grupos.  
`Memos` mostra as notas. Desativá-la oculta todas as notas no canvas, no minimapa e nas exportações de imagem, e não move nenhuma tabela nem conector. Notas ocultas não ocupam espaço, então as barras de rolagem, o minimapa e a bússola `Go to content` as deixam de fora.  
Ocultar as notas as remove da seleção e fecha um editor de nota aberto. O [explorador](./explorer.md#the-tree) deixa de mostrar a pasta `Memos`, e sua pesquisa de [Localizar e substituir](./find-and-replace.md) e o `:` da pesquisa rápida não pesquisam as notas. Enquanto elas estão ocultas, `New Memo` sai do menu de contexto, da [barra de ferramentas do canvas](#canvas-toolbar), da pesquisa rápida e da [tela de boas-vindas](./editing-start.md#welcome-screen), e `Alt + M` não adiciona nenhuma nota. Uma colagem ou um [Importar e adicionar](./file-import-export.md#import-and-add) ainda adiciona as notas que traz, ocultas e não selecionadas.  
Em um editor `readonly`, alternar essas opções não muda nada.

![Alternância de itens de View Option enquanto as tabelas se reorganizam, marcação de um índice único composto com AK1.1 e AK1.2 por Alternate Key e, depois, desativação e reativação de Memos](/img/demo-view-options.webp)

Os cartões do modo `Flow` da aba Visualização não seguem essas opções, nem mesmo `Domain`: eles usam sua própria [exibição de linhas](./visualization.md#row-display) e desenham seus conectores mesmo com `Relationship` desativada. As células que um cartão dispõe dependem apenas da exibição de nomes — consulte [Nomes nos cartões](./visualization.md#names-on-the-cards).

## Propriedades da tabela {#table-properties}

Abre o painel de propriedades de uma tabela.  
Comece por `Table Properties` no menu de contexto da tabela, que o abre para a tabela em que você clicou com o botão direito, ou selecione uma tabela e pressione `Alt + Space`.  
O painel abre no meio de um canvas esmaecido. Só o canvas fica esmaecido, então um [explorador](./explorer.md#dialogs-beside-it) aberto continua aberto e utilizável ao lado dele. O cabeçalho do painel contém o título `Table Properties`, as cinco tabelas abertas mais recentemente como chips, com a atual realçada, e um botão de fechar. Cada chip nomeia sua tabela como faz a [exibição de nomes](./logical-names.md#beyond-the-canvas). Clique em um chip para passar para essa tabela sem reabrir o painel.  
Abaixo do cabeçalho há três abas: `Indexes`, `Schema SQL` e `Code Generator`. O painel mantém um único tamanho para as três, então trocar de aba não o move nem o redimensiona.  
Feche-o com o botão de fechar, com `Escape` ou clicando fora dele no canvas.  
Escolher no explorador uma linha que não seja uma pasta, ou ir para uma correspondência da pesquisa dele, fecha o painel Propriedades da tabela antes do salto. O mesmo faz `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), que abre a pesquisa do explorador ou põe o cursor de texto no campo Localizar quando o explorador já está aberto. Qualquer outro clique no explorador, inclusive em uma linha de pasta, ou no botão `Explorer` da barra de ferramentas mantém o painel Propriedades da tabela aberto. Um `Escape` pressionado enquanto o teclado está no explorador só devolve o teclado ao canvas, então é preciso um segundo `Escape` para fechar o painel Propriedades da tabela.

A aba `Indexes` é abordada em [Índices](#indexes).  
A aba `Schema SQL` mostra o DDL da tabela para o [banco de dados](#databases) selecionado: seu `CREATE TABLE`, as restrições separadas que alguns bancos de dados escrevem para suas colunas únicas, e seus índices. Ela sempre escreve instruções `CREATE` simples, sem cabeçalho, sem scripts antes ou depois das tabelas e sem nomes lógicos nos comentários vazios, seja qual for a configuração da aba [Esquema SQL](./schema-sql.md) da barra de ferramentas — consulte [Nomes lógicos como comentários](./schema-sql.md#logical-names-as-comments). Ela não tem painel de opções, e seu menu de contexto oferece só `Database` e `Bracket`.  
A aba `Code Generator` gera código só para esta tabela — consulte [Gerador de código](./code-generator.md).

Em um editor `readonly`, o painel ainda abre, com um selo `Read only` ao lado do título, mas a aba `Indexes` não permite edições.

## Focar em tabelas {#focusing-on-tables}

Abre a aba Visualização no modo `Flow`, restrita às tabelas escolhidas e a todas as tabelas a um relacionamento de distância delas.  
Comece pelo menu de contexto da tabela com `Focus on this table`, ou selecione uma ou mais tabelas e pressione `Alt + F`.  
Quando a tabela em que você clica com o botão direito é uma de várias tabelas selecionadas, o item passa a ser `Focus on selected tables` e foca toda a seleção. Clicar com o botão direito em uma tabela fora da seleção foca só essa tabela.  
O atalho usa as tabelas selecionadas, deixa as notas de fora e não faz nada quando nenhuma tabela está selecionada.  
Um [grupo de tabelas](./table-groups.md) selecionado não conta para nada aqui, tanto no atalho quanto no item do menu: suas tabelas só são usadas quando elas mesmas estão selecionadas, o que o item `Select tables` do menu do grupo faz.  
O que a exibição restrita mostra, e como voltar ao diagrama inteiro, é abordado em [Visualização](./visualization.md#focusing-on-tables), e como voltar e avançar pelo que o Flow mostrou antes, em [Tabela anterior e próxima tabela](./visualization.md#previous-table-and-next-table).

## Índices {#indexes}

Os índices são definidos na aba `Indexes` do painel de propriedades da tabela e são incluídos no Esquema SQL exportado.

O lado esquerdo lista as chaves e os índices da tabela em dois grupos.  
`Keys`, exibido quando a tabela tem alguma chave, lista as chaves que suas colunas declaram: `PK_<table name>` sobre as colunas marcadas como PK e, depois, `UQ_<table name>_<column name>` para cada coluna marcada como única, na ordem das colunas. Os nomes são os nomes físicos que o Esquema SQL do banco de dados selecionado escreve, qualquer que seja a exibição de nomes, então, com `Bracket` em `None`, uma tabela qualificada com esquema como `sales.users` lista `PK_users` em todos os bancos de dados, exceto Databricks e Snowflake — consulte [Nomes de tabela qualificados com esquema](./schema-sql.md#schema-qualified-table-names). Cada uma tem a etiqueta `PK` ou `UQ` e é marcada com um cadeado. Elas são somente leitura aqui e só mudam com os sinalizadores [PK](./table-editing.md#column-primary-key) e [Único](./table-editing.md#not-null-unique-auto-increment) das colunas.  
`Indexes` lista os índices da tabela na ordem em que foram adicionados. Cada índice tem um botão de alternância `UQ` que o torna único, um campo de nome e um `x` que o remove. Um índice que é uma [chave alternativa](#alternate-keys) também mostra seu número, como `AK1`. Adicione um índice com `Add Index` no fim da lista.

O lado direito lista as colunas da tabela em `Columns`, cada uma com uma caixa de seleção. Cada linha mostra as mesmas células que a linha da coluna no canvas, seguindo a ordem das colunas, as opções de exibição e a [exibição de nomes](./logical-names.md#beyond-the-canvas). Nada é editável até que um índice seja selecionado à esquerda.  
Marque uma coluna para adicioná-la ao índice selecionado e desmarque-a para removê-la. Selecionar uma chave mostra suas colunas marcadas, mas as caixas continuam desabilitadas.  
As colunas do índice selecionado são listadas abaixo, em `Index order`, cada uma nomeada como a exibição de nomes a nomeia, com o nome entre parênteses depois do nome lógico na exibição `Both Names`, como `Member Number (member_no)`. Arraste-as pela alça de arrastar para reordená-las e clique no chip `ASC` ou `DESC` de uma linha para inverter sua ordem de classificação. Em uma chave alternativa, cada linha termina com sua marca `AK<n>.<m>`. A lista mostra três linhas por vez e rola o restante.

Em um editor `readonly`, selecionar uma chave ou um índice ainda mostra suas colunas, mas não há `Add Index` nem `x`, e nada mais na aba pode ser alterado.

O [explorador](./explorer.md#the-tree) lista os índices de cada tabela na pasta `Indexes` da tabela, e escolher um deles ali leva à sua tabela. A pesquisa dele também encontra nomes de índices e pode renomeá-los — consulte [O que é pesquisado](./find-and-replace.md#what-it-searches).

![Abertura do painel Table Properties de orders, onde a aba Indexes lista as chaves PK e UQ acima dos índices, e, depois, adição de um índice sobre member_id e ordered_at DESC e leitura dele na aba Schema SQL](/img/demo-table-properties.webp)

## Chaves alternativas {#alternate-keys}

Uma chave alternativa é um índice único sobre duas ou mais colunas: um índice na aba `Indexes` com o botão de alternância `UQ` ativado e pelo menos duas colunas da tabela marcadas.  
Um índice único sobre uma só coluna não diz mais do que o sinalizador Único dessa coluna, então não é uma chave alternativa, e um índice simples, a chave primária e uma coluna marcada como única também não são.

Com `Alternate Key` ativada nas [opções de exibição](#table-view-options), o diagrama marca as colunas de cada chave alternativa como o erwin e o IDEF1X as escrevem: `AK1.1`, `AK1.2` e assim por diante. A opção está desativada por padrão.

As chaves são numeradas pela posição de suas colunas na tabela, e não pela ordem em que os índices foram adicionados. A chave cuja primeira coluna em seu `Index order` fica mais acima na tabela é a `AK1`. Em caso de empate, a coluna seguinte de cada chave decide, e uma chave que é a parte inicial de uma mais longa vem antes dela.  
Mover uma coluna dentro da tabela, ou reordenar o `Index order` de uma chave, pode renumerar as chaves. Desfazer a remoção de uma chave devolve o número dela, e todos os colaboradores veem os mesmos números.

Cada coluna de uma chave é marcada como `AK<n>.<m>`, em que `n` é o número da chave e `m`, a posição da coluna no `Index order` da chave. Uma coluna em várias chaves leva todas as marcas, unidas por vírgula.  
Por exemplo, em uma tabela com as colunas `a`, `b` e `c`, os índices únicos sobre (`c`, `a`) e (`b`, `a`) se tornam `AK1` = (`b`, `a`) e `AK2` = (`c`, `a`), porque `b` fica acima de `c`. Assim, `b` mostra `AK1.1`, `c` mostra `AK2.1` e `a` mostra `AK1.2,AK2.2`.

A marca é desenhada no fim da linha, depois da célula que a [ordem das colunas](./settings.md#adjusting-column-order) colocar por último. Ela não é uma célula, então nunca recebe foco nem é editada ou copiada — consulte [Edição de tabelas](./table-editing.md).  
Uma coluna de chave primária ou de chave estrangeira também pode levar uma marca AK, pois a marca não substitui nada: o ícone de chave no início da linha continua mostrando PK e FK, e a célula Único mantém seu próprio `UQ`.  
Uma tabela que tem uma chave alternativa reserva espaço depois da última célula de cada linha para sua marca mais longa; uma tabela sem chave alternativa mantém sua largura.  
As marcas aparecem no canvas ERD, onde uma tabela reduzida ao nome em `70%` ou menos não mostra nenhuma, e em uma [exportação de imagem](./file-import-export.md#image), que desenha todas as tabelas por completo, seja qual for o zoom. A [pré-visualização ao passar o ponteiro](./visualization.md#hover-preview) da aba Visualização no modo `Graph` também as mostra; os cartões do `Flow` nunca as mostram.

A aba `Indexes` mostra os números esteja a opção ativada ou não — consulte [Índices](#indexes).

## Layout automático {#auto-layout}

Organiza todas as tabelas no canvas para você.  
Abra `Auto Layout` pelo menu de contexto do canvas ou pela pesquisa rápida e escolha um de quatro layouts:

| Layout | O que ele desenha |
| --- | --- |
| `Force` | Uma simulação: os relacionamentos aproximam as tabelas, as vizinhas se afastam umas das outras e as tabelas sobrepostas se separam. |
| `Flow` | Da esquerda para a direita ao longo dos relacionamentos, com cada conector recebendo seu próprio ponto de contato em uma tabela. Ele tenta manter poucos cruzamentos, mas pode deixar alguns que outro layout evitaria. |
| `Tree - vertical` | Em camadas para baixo: uma tabela pai fica acima das tabelas que têm uma chave estrangeira para ela. |
| `Tree - horizontal` | As mesmas camadas, da esquerda para a direita. |

`Force` abre uma pré-visualização enquanto o layout se estabiliza, com `Apply` e `Cancel` no aviso que ele mostra.  
A pré-visualização é enquadrada no diagrama como ele estava quando o layout começou, então as tabelas podem sair do enquadramento enquanto o layout se estabiliza. Ela é desenhada em `70%` ou menos, então suas tabelas aparecem reduzidas ao nome e à borda colorida. Ela se abre na exibição de nomes que você está olhando, qualquer que seja a exibição que o arquivo mantém — consulte [Além do canvas](./logical-names.md#beyond-the-canvas).  
`Apply` mantém as posições como estão naquele momento, e o layout é aplicado sozinho quando se estabiliza por completo. `Cancel` ou `Escape` deixa o diagrama como estava.

Os outros três são calculados de uma só vez, fora da thread principal, então não há nada para acompanhar: um aviso aparece enquanto o layout é calculado, e a disposição final é centralizada na área que o diagrama já ocupa. `Cancel` ou `Escape` descarta um layout pelo qual você não está mais esperando, e, em um host que não executa nenhum worker compartilhado, o layout termina em `Could not place tables` — consulte [Web Workers](../../api/installation.md#web-workers). Um layout que não retorna em 60 segundos termina da mesma forma.

Seja qual for a escolha, as tabelas e os grupos de tabelas são movidos, e as notas ficam onde estão. As tabelas são posicionadas com as larguras que têm na exibição de nomes que você está olhando. Um relacionamento de uma tabela consigo mesma é ignorado, e vários relacionamentos entre as mesmas duas tabelas contam uma só vez.  
Todos os layouts mantêm juntas as tabelas de cada grupo, estejam os grupos visíveis ou não, e ajustam cada grupo que contém tabelas ao redor delas — consulte [Grupos de tabelas](./table-groups.md#auto-layout).  
O resultado é registrado como uma única entrada do histórico, então um único desfazer traz todas as tabelas e grupos de volta para onde estavam.

![Organização de um amontoado de tabelas com o layout automático Flow pelo menu de contexto do canvas, que as alinha da esquerda para a direita ao longo dos relacionamentos](/img/demo-automatic-table-placement.webp)

## Bancos de dados {#databases}

Os bancos de dados compatíveis incluem:

- Databricks
- MSSQL
- MariaDB
- MySQL
- Oracle
- PostgreSQL
- Snowflake
- SQLite

Escolha um em `Database` no menu de contexto do canvas, no painel de opções ou no menu de contexto das abas Esquema SQL e Gerador de código, ou na pesquisa rápida. Todos eles alteram a mesma configuração.

Essas opções determinam a sintaxe do Esquema SQL na exportação, o preenchimento automático do tipo de dados e os tipos para os quais o código gerado e os esquemas importados são resolvidos.  
Elas decidem quais opções de `Statements` e `Header` a aba [Esquema SQL](./schema-sql.md#options-panel) pode escrever. Uma opção que o banco de dados não tem continua no painel de opções, esmaecida, e o SQL recorre à mais próxima que ele tem.  
Elas também decidem quais ações ON DELETE e ON UPDATE o Esquema SQL e os destinos ORM do Gerador de código escrevem, e quais delas os menus de relacionamento marcam como `not in <database>` — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update) e [Gerador de código](./code-generator.md#database).  
A importação de Esquema SQL mantém o tipo de dados de uma coluna, incluindo a lista de argumentos, esteja ele listado no editor ou não, como `TIMESTAMP WITH TIME ZONE`, `public.mood` ou `integer[]` — consulte [Tipos de dados](./file-import-export.md#data-types). O preenchimento automático do tipo de dados sugere só os tipos que o banco de dados selecionado lista.

![Troca do banco de dados para PostgreSQL e, depois, escolha de um tipo do PostgreSQL no preenchimento automático](/img/demo-database.webp)

![Preenchimento automático do tipo de dados com correspondência aproximada, percorrido com as teclas de seta e aceito com Right, Tab ou Enter](/img/demo-data-type-autocomplete.webp)

## Barra de ferramentas do canvas {#canvas-toolbar}

Uma pequena barra de ferramentas flutua sobre o meio da borda inferior do canvas e contém, da esquerda para a direita, as ferramentas que atuam sobre o próprio canvas e os comandos que adicionam itens a ele:

- A mão e o ponteiro. O ponteiro é o padrão; a mão transforma todo arrasto em deslocamento da área visível, tanto sobre tabelas quanto sobre espaço vazio. `Space` alterna entre os dois. Enquanto um desenho de [`New Table Group`](./table-groups.md#drawing-a-group) está preparado, o botão `New Table Group` fica marcado no lugar de qualquer um deles, e clicar em qualquer um dos dois, pressionar `Space` ou escolher uma notação de relacionamento encerra o desenho sem adicionar um grupo.
- `New Table`, `New Memo` e `New Table Group`. `New Table` adiciona uma tabela como `Alt + N` faz, e `New Memo` adiciona uma nota como `Alt + M` faz. `New Table Group` prepara o [desenho de grupo](./table-groups.md#drawing-a-group) como `Alt + G` faz e desativa a mão; um segundo clique, como um segundo `Alt + G`, encerra o desenho sem adicionar um grupo. `New Memo` fica de fora enquanto View Option → `Memos` oculta as notas, e `New Table Group`, enquanto View Option → `Table Groups` oculta os grupos. Um editor `readonly` não mostra nenhum dos três.
- O zoom: `Zoom out`, o zoom atual em porcentagem e `Zoom in`. Os dois botões alteram o zoom em etapas da mesma forma que os atalhos de zoom, e clicar na porcentagem o redefine para `100%`.
- As quatro notações de relacionamento, as mesmas quatro com que você inicia um relacionamento — consulte [Começar a editar](./editing-start.md). Escolher uma volta para o ponteiro, pois um relacionamento é desenhado clicando em duas tabelas.
- `Name View`, um botão com uma seta para baixo que mostra o nome da exibição em vigor: `Physical Names`, `Logical Names` ou `Both Names`. Ele mantém a mesma largura qualquer que seja a exibição que mostra, então uma troca nunca desloca a barra de ferramentas. Um clique abre, acima da barra de ferramentas, uma lista com as três, com a que está em vigor marcada. Escolher uma delas troca para ela e fecha a lista; um segundo clique no botão, um pressionamento em qualquer outro lugar ou `Escape` fecha a lista sem trocar. Um editor `readonly` também o mostra. O que cada exibição desenha é abordado em [Exibição de nomes](./logical-names.md#name-view), e se uma troca é salva, em [Trocar a exibição](./logical-names.md#switching-the-view).
- O modo zen, `Alt + Z`, que tira tudo da tela, exceto o canvas e esta barra de ferramentas. `Alt + Z` de novo, ou o botão, traz o restante de volta. Um explorador aberto é ocultado junto com o restante, sem ser fechado, e volta com ele. Ele ainda pode ser aberto durante o modo zen — consulte [Quando ele fica oculto](./explorer.md#when-it-stands-aside).
- A bússola `Go to content`, que aparece no fim da barra de ferramentas só enquanto nenhuma tabela, nota visível ou grupo de tabelas visível está na tela — consulte [Navegar pelo canvas](#getting-around-the-canvas).

Todo botão com atalho o indica na dica de ferramenta, como `New Table (Alt + N)` (Windows/Linux) ou `New Table (⌥ + N)` (Mac).  
A barra de ferramentas fica oculta enquanto a pré-visualização do layout automático `Force`, o painel Propriedades da tabela, a viagem no tempo ou o visualizador de diferenças está aberto, e volta assim que ele fecha.

![Adição de uma tabela e uma nota pela barra de ferramentas, preparação e cancelamento de New Table Group, deslocamento com a mão, zoom em etapas e alternância do modo zen com ⌥ + Z](/img/demo-canvas-toolbar.webp)

## Aumentar e diminuir o zoom {#zoom-inout}

Aplica zoom com `Ctrl + Wheel` (Windows/Linux) ou `⌘ + Wheel` (Mac). A roda do mouse sozinha desloca a área visível do canvas.  
Pinçar no trackpad também aplica zoom, em torno do ponto onde você pinça, assim como dois dedos em uma tela sensível ao toque, que também deslocam a área visível conforme se movem.  
Atalhos: `Ctrl + Plus` (Windows/Linux) ou `⌘ + Plus` (Mac), `Ctrl + Minus` (Windows/Linux) ou `⌘ + Minus` (Mac)  
`Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac) volta direto para `100%`, mantendo o meio da tela onde está.

Os botões `Zoom out` e `Zoom in` da [barra de ferramentas do canvas](#canvas-toolbar) alteram o zoom em etapas como os atalhos `Minus` e `Plus`: cada pressionamento o muda em 4 pontos percentuais, mantendo o meio da tela onde está. A porcentagem entre eles mostra o zoom atual, e clicar nela volta direto para `100%`, como `Ctrl + 0` (Windows/Linux) ou `⌘ + 0` (Mac).

O zoom vai de `10%` a `150%`.  
Em `70%` ou menos, as tabelas se reduzem ao nome e à borda colorida, e a edição de células, os atalhos de célula e copiar e colar param de funcionar até você aumentar o zoom de novo. O nome que uma tabela reduzida mostra segue a exibição de nomes — consulte [Exibição de nomes](./logical-names.md#name-view).

Os mesmos três atalhos também aplicam zoom na aba Visualização, tanto no modo `Graph` quanto no `Flow`, cada modo dentro de sua própria faixa — consulte [Visualização](./visualization.md#toolbar).

![Redução do zoom com ⌘ + Wheel até as tabelas se reduzirem ao nome e, depois, volta em etapas com ⌘ + Plus, ⌘ + Minus e ⌘ + 0](/img/demo-zoom.webp)

## Navegar pelo canvas {#getting-around-the-canvas}

O canvas não tem bordas nem tamanho a definir. Tabelas e notas ficam onde você as coloca, e tudo o que vem a seguir descreve o diagrama, e não uma página fixa.

Arraste uma área vazia do canvas para deslocar a área visível, ou mude para a ferramenta mão com `Space` e arraste em qualquer lugar, inclusive sobre uma tabela. A roda do mouse também desloca a área visível, e `Shift + Wheel` a desloca na horizontal.  
O corpo de um [grupo de tabelas](./table-groups.md#selecting-groups), a área abaixo da barra de título, conta como canvas vazio para o botão esquerdo: arrastá-lo desloca a área visível, `Ctrl + drag` (Windows/Linux) ou `⌘ + drag` (Mac) desenha um retângulo de seleção e um clique limpa a seleção.  
O deslocamento não tem limites: a roda do mouse, um arrasto e a ferramenta mão levam a área visível até onde você a mover, para além das tabelas em qualquer lado.

Arraste com o botão do meio do mouse (pressione a roda) para deslocar a área visível a partir de qualquer lugar do canvas, tanto com o ponteiro quanto com a mão. Funciona mesmo quando o pressionamento cai sobre uma tabela, uma nota, uma célula, um ícone ou um relacionamento.  
Um arrasto com o botão do meio não seleciona, não move e não clica em nada, e mantém a seleção. Ele fecha um menu de contexto aberto e o seletor de cores, e a rolagem e a colagem do próprio navegador com o clique do meio não começam.  
Pressionar o botão do meio sobre as barras de rolagem, o minimapa, a barra de ferramentas do canvas ou um editor de célula ou de nota aberto não desloca a área visível.

O minimapa no canto superior direito representa o diagrama com o espaço de uma tela em cada lado dele, o alcance das barras de rolagem, arredondado para fora em uma grade grossa, então, quanto mais você diminui o zoom, menor o diagrama fica nele. Clique nele para mover a área visível até esse ponto, ou arraste o retângulo da área visível para deslocá-la. Conforme você diminui o zoom, o retângulo da área visível cresce para cobrir mais do mapa.  
Ele desenha cada tabela na cor da tabela, e cada grupo de tabelas visível como uma caixa na cor do grupo, atrás de suas tabelas.  
As barras de rolagem nas bordas direita e inferior descrevem o mesmo percurso, que vai do diagrama logo além de um lado da tela até logo além do outro, então ele é pelo menos uma tela mais longo que o diagrama desenhado, e mais longo ainda enquanto a área visível está além dele. Fora do modo zen, as duas barras de rolagem aparecem sempre que o documento contém uma tabela, uma nota visível ou um grupo de tabelas visível, mesmo quando tudo cabe na tela. Um documento sem nenhum deles, como um cujas únicas notas estão ocultas com View Option → `Memos`, não mostra nenhuma das duas, nem o minimapa.  
Arrastar o marcador de uma barra de rolagem ou o retângulo da área visível do minimapa é o único deslocamento que para: ele não vai além das tabelas logo fora da tela, ou de onde o arrasto começou, se isso estava mais longe.

Se um deslocamento não deixar nenhuma tabela, nota visível ou grupo de tabelas visível na tela, uma bússola `Go to content` aparece no fim da [barra de ferramentas do canvas](#canvas-toolbar), com uma seta apontando para o mais próximo e a distância até ele. Clique nela para centralizar esse item sem alterar o zoom.

![Deslocamento da área visível arrastando o canvas vazio, com a roda do mouse, com um arrasto do botão do meio sobre uma tabela e a partir do minimapa e, depois, Shift + wheel para além do conteúdo e retorno seguindo a bússola Go to content](/img/demo-canvas-navigation.webp)

### Onde um salto termina {#where-a-jump-lands}

Todo salto que leva você a algo no canvas move a área visível por uma única regra: os resultados `#`, `@` e `:` da [pesquisa rápida](./quick-search.md#searching-the-diagram), as linhas do [explorador](./explorer.md#going-to-a-row) e as correspondências da sua pesquisa de [Localizar e substituir](./find-and-replace.md#going-to-a-match), as linhas da lista do [visualizador de diferenças](#going-to-a-change), o [botão do cartão](./visualization.md#card-buttons) de link externo no Flow, uma verificação que nomeia uma tabela ou uma coluna na [planilha Verificações](./dictionary.md#the-checks-sheet) da aba Dicionário e a chegada de um [Importar e adicionar](./file-import-export.md#import-and-add). Cada uma dessas seções diz o que o salto seleciona; esta diz para onde vai a área visível.

Um salto nunca altera o zoom e faz no máximo uma rolagem. A partir de outra aba, ele muda primeiro para a aba ERD.  
Ele mede o canvas como ele aparece: abaixo da barra de ferramentas superior, ou a altura inteira no modo zen, e à direita de um explorador aberto, que estreita o canvas em vez de cobri-lo.

A horizontal e a vertical são avaliadas separadamente, e uma direção em que o alvo já aparece bem fica exatamente como está:

- Um alvo que não passa da metade do canvas nessa direção fica parado enquanto seu meio está na metade central do canvas, entre um quarto e três quartos do caminho na horizontal ou na vertical. Caso contrário, seu meio é levado ao meio do canvas.
- Um alvo mais longo que ainda cabe com `40px` de folga em cada extremidade fica parado enquanto está inteiramente visível. Caso contrário, na horizontal, ele é centralizado; na vertical, seu topo é levado a `40px` abaixo do topo do canvas.
- Um alvo mais longo que isso fica parado enquanto está inteiramente visível ou, quando é mais longo que o canvas, enquanto sua parte principal, listada abaixo, está visível. Caso contrário, é centralizado se couber, ou então posicionado o mais perto do meio possível que ainda mantenha as duas extremidades de sua parte principal a pelo menos `40px` para dentro do canvas; uma parte principal longa demais para isso tem seu início mantido `40px` para dentro.

Assim, uma tabela pequena perto da borda esquerda do canvas, na metade da altura, se move só na horizontal.

O que um salto traz para a área visível, e a parte principal que precisa aparecer quando o todo não cabe:

- Uma tabela: a tabela inteira, pela faixa do nome no topo, ou pela célula de comentário quando a correspondência está no comentário da tabela enquanto View Option → `Table Comment` mostra os comentários. Em `70%` ou menos, onde as tabelas se reduzem ao nome, pelo nome no meio da caixa.
- Uma coluna: sua linha, pela célula para a qual o salto vai: o nome dela, o nome lógico dela no caso de uma correspondência no nome lógico ou de uma verificação sobre o nome lógico, a célula Domínio dela no caso de uma verificação sobre o domínio, ou o comentário em que está uma correspondência enquanto View Option → `Column Comment` mostra os comentários. Onde a linha não desenha essa célula, o salto vai para a célula desenhada no lugar dela: o nome lógico no lugar do nome na exibição `Logical Names`, o nome no lugar do nome lógico na exibição `Physical Names` e a célula de tipo no lugar da célula Domínio enquanto View Option → `Domain` está desativada, ou a linha como um todo enquanto `DataType` também está desativada. Em `70%` ou menos, uma coluna traz sua tabela para a área visível pela regra da tabela.
- Uma célula larga demais para aparecer inteira, como um comentário longo: pelo texto correspondente nela. Um salto para a célula desenhada no lugar daquela em que está a correspondência, como o nome no caso de uma correspondência no nome lógico na exibição `Physical Names`, não se orienta pelo texto.
- Um relacionamento: a caixa que abrange suas duas tabelas, pela tabela filha.
- Um grupo de tabelas: sua caixa, pela barra de título.
- Uma nota, ou o bloco que um Importar e adicionar insere: por inteiro.

Quando nenhuma das direções se moveria, não há rolagem, então ir para o mesmo lugar duas vezes seguidas não move nada na segunda vez. Um salto que rola o canvas registra a rolagem no [histórico de desfazer](./undo-redo.md#what-the-history-records) como qualquer outra mudança de posição da área visível, e um que não move nada não deixa nada para desfazer. Em um Importar e adicionar, a rolagem faz parte da mesma etapa que a adição. Uma linha da lista do visualizador de diferenças move só os lados somente leitura do visualizador, então nada é registrado.  
Nenhum salto inicia nem conclui um relacionamento que está sendo desenhado. A bússola `Go to content` não é um salto: ela centraliza aquilo para onde aponta.

## Visualizador de diferenças {#diff-viewer}

É possível comparar documentos salvos anteriormente com o documento atual.  
Escolha `Diff Viewer` no menu de contexto do canvas e selecione um documento `.json` que você exportou antes.

O visualizador abre sobre o canvas: o que mudou à esquerda e, depois, o documento salvo e o atual lado a lado.  
O documento atual é comparado como está quando o visualizador abre; as alterações feitas depois disso, inclusive as de um colaborador, não chegam ao visualizador. Os dois lados se abrem, e permanecem, na exibição de nomes que você está olhando, qualquer que seja a exibição que cada arquivo mantém — consulte [Além do canvas](./logical-names.md#beyond-the-canvas). Um [explorador](./explorer.md#when-it-stands-aside) aberto fica oculto enquanto o visualizador está aberto, então o visualizador ocupa toda a largura do editor.  
Cada lado se desloca com a roda do mouse, arrastando uma área vazia ou o corpo de um grupo de tabelas, ou arrastando com o botão do meio em qualquer lugar sobre ele, e aplica zoom com `Ctrl + Wheel` (Windows/Linux), `⌘ + Wheel` (Mac) ou pinçando. Em `70%` ou menos, suas tabelas se reduzem como no canvas — consulte [Marcas nos dois lados](#marks-on-the-two-sides).  
Os dois lados são somente leitura, então nada no seu documento é modificado. Cada um mantém sua própria seleção, e um clique em uma tabela ali a seleciona só naquele lado.  
Feche o visualizador com o botão `Close` do aviso `Diff Viewer` que aparece quando ele abre, ou com `Escape`.

![Abertura do visualizador de diferenças com um arquivo .json salvo, cliques em linhas marcadas com A, M, D e R na árvore, filtragem por nome e fechamento](/img/demo-diff-viewer.webp)

### O que é comparado {#what-is-compared}

Tabelas, colunas, índices, chaves estrangeiras, notas e grupos de tabelas são todos comparados.  
Cada item é pareado primeiro pelo id, então, em comparação com uma versão anterior do mesmo arquivo, que mantém os ids, uma tabela, coluna, índice ou grupo de tabelas renomeado continua sendo um único item, listado como renomeado.  
O que sobra é pareado um a um pelo que mantém: uma tabela ou um grupo de tabelas pelo nome, considerando maiúsculas e minúsculas; uma coluna ou um índice pela tabela e pelo nome; uma chave estrangeira pelas duas tabelas e pelos pares de colunas; e uma nota pelo texto e, depois, pela posição. Um índice sem nome é pareado pelas colunas, pela ordem e direção delas e por ser único ou não, e um grupo de tabelas sem nome, pelo maior número de tabelas em comum.  
Assim, em comparação com um arquivo de outra origem, como um diagrama reconstruído por importação de SQL, uma tabela renomeada aparece como uma removida e uma adicionada.

O que conta como alteração:

- Uma tabela: nome, comentário, grupo de tabelas, posição e cor.
- Uma coluna: nome, comentário, tipo de dados, valor padrão, Incremento automático, chave primária, Único, Não nulo e sua posição na tabela. Só as colunas fora da ordem que os dois documentos compartilham contam como movidas, então adicionar, remover ou mover uma coluna não marca as outras.
- Um índice: nome, UNIQUE e colunas, com a ordem e a direção delas.
- Uma chave estrangeira: pares de colunas, tipo de relacionamento e ações ON DELETE e ON UPDATE.
- Uma nota: texto, posição, tamanho e cor.
- Um grupo de tabelas: nome, tabelas que contém, cor, posição e tamanho.

Assim, uma tabela, nota ou grupo que só foi movido, redimensionado ou teve a cor mudada conta como alterado. Posições e tamanhos são comparados em pixels inteiros, e a ordem de empilhamento e o ponto onde um conector encontra uma tabela nunca contam.  
Os nomes lógicos, os vínculos com domínios e as palavras, os termos e os domínios da aba [Dicionário](./dictionary.md) não são comparados, então uma alteração apenas neles não é listada nem marcada. Um tipo de dados que um domínio alterou conta, sim, como uma alteração no tipo de dados da coluna.

### A árvore de alterações {#the-change-tree}

A lista à esquerda é desenhada como a [árvore do explorador](./explorer.md#the-tree) e contém só o que mudou: `Tables`, `Table Groups` e `Memos`, cada uma exibida só quando contém uma linha, e, sob uma tabela, suas próprias `Columns`, `Indexes` e `Foreign Keys`. Uma chave estrangeira é listada sob sua tabela filha, e uma tabela adicionada ou removida não lista nada dentro dela.  
Cada pasta mostra quantas linhas contém, e todas as pastas e tabelas começam expandidas.  
Uma linha de tabela ou de coluna é nomeada na exibição de nomes em que os lados foram abertos. Na exibição `Both Names`, ela mostra o nome lógico seguido do nome, esmaecido, e, em uma linha removida, o nome esmaecido é riscado junto com o restante. Tabelas e grupos de tabelas são listados por nome, sem diferenciar maiúsculas de minúsculas, qualquer que seja a exibição. As notas, e as colunas, os índices e as chaves estrangeiras de uma tabela, mantêm a ordem do documento atual, com um item removido recolocado onde estava. Uma linha de nota mostra a primeira linha da nota, e uma linha de chave estrangeira mostra suas colunas filhas e, depois, `→` com a tabela pai e suas colunas, como `user_id → users(id)`. Um nome em branco aparece como `unnamed` em itálico.

Cada linha termina com uma letra, e uma linha marcada com `A`, `D`, `M` ou `R` tem o nome na cor da letra:

- `A`, adicionado, em verde: só no documento atual.
- `D`, removido, em vermelho e riscado: só no documento salvo.
- `M`, modificado, em âmbar: nos dois, alterado.
- `R`, renomeado, em azul: nos dois, com um novo nome. Uma renomeação prevalece sobre qualquer outra alteração, que a dica de ferramenta ainda lista.
- `~`, em âmbar, termina cada pasta e cada tabela listada só pelo que mudou dentro dela; os nomes delas mantêm a cor habitual.

Passe o ponteiro sobre o nome de uma linha para ver a dica de ferramenta: o status, `Added`, `Deleted`, `Modified`, `Renamed` ou `Changed inside`, e depois uma linha por alteração, como `Name: users → members` ou `NN: ✗ → ✓`. Um texto é citado pela primeira linha, cortada após 40 caracteres, e um valor vazio aparece como `—`. A dica de ferramenta de um item adicionado ou removido é só o status.

`Filter by name`, acima da árvore, mantém as linhas cujo nome atual ou salvo, ou cujo nome lógico atual ou salvo, contém o que você digita, sem diferenciar maiúsculas de minúsculas, em qualquer exibição de nomes. Uma tabela cujo nome corresponde mantém todas as suas linhas, e uma que não corresponde fica só com as linhas que correspondem. Um filtro que não corresponde a nada deixa a árvore vazia.  
Quando os dois documentos não diferem em nada, a árvore mostra `No changes`.

Arraste a borda direita da árvore para alargá-la ou estreitá-la, de `200px` a `480px`, e clique duas vezes na borda para voltar a `260px`. Toda comparação abre em `260px`, e os dois lados dividem o restante da largura igualmente.  
O teclado percorre a árvore como a do explorador — consulte [Teclas no explorador](./explorer.md#keys-in-the-explorer) — mas aqui `Escape`, na árvore ou em `Filter by name`, fecha o visualizador.

### Ir para uma alteração {#going-to-a-change}

Clique em uma linha, ou pressione `Enter` ou `Space` com o teclado nela, para ir até o item dela em cada lado que o contém: um item adicionado só no lado atual, um removido só no lado salvo e qualquer item que os dois contêm nos dois lados. Uma linha de pasta só recolhe ou expande, assim como a seta no início de uma linha de tabela.

- Uma linha de tabela, coluna ou índice seleciona só a tabela.
- Uma linha de chave estrangeira traz suas duas tabelas para a área visível, ou a tabela filha quando as duas estão longe demais para aparecer juntas, seleciona a tabela filha com suas colunas de chave estrangeira e ilumina o conector — consulte [Como ler um conector](./relationship-editing.md#reading-a-connector).
- Uma linha de nota seleciona a nota, e uma linha de grupo de tabelas seleciona o grupo. Uma nota ou um grupo que o documento de um lado oculta não leva a lugar nenhum naquele lado.

Cada lado se move pela regra de [Onde um salto termina](#where-a-jump-lands), medida naquele lado, então clicar de novo na mesma linha não move nada.

### Marcas nos dois lados {#marks-on-the-two-sides}

Os dois lados colorem textos, contornos e conectores, e não preenchem nada. Adicionado é verde e aparece só no lado atual, removido é vermelho e aparece só no lado salvo, e alterado, em âmbar, e renomeado, em azul, aparecem nos dois lados. Tudo o que não mudou é desenhado como de costume.

- Uma tabela ou um grupo de tabelas adicionado ou removido é contornado nessa cor, e o nome também assume a cor. Uma nota adicionada ou removida é contornada.
- Uma coluna adicionada ou removida em uma tabela que os dois documentos contêm colore a linha inteira, e uma coluna que foi movida deixa a linha inteira em âmbar. Nada dentro de uma tabela adicionada ou removida é marcado individualmente.
- O texto de uma célula alterada fica em âmbar: o comentário de uma tabela, o comentário, o tipo de dados, o valor padrão, o Incremento automático, o Único ou o Não nulo de uma coluna, ou o texto de uma nota. Uma alteração de chave primária deixa o ícone de chave da coluna em âmbar.
- Uma tabela, coluna ou grupo de tabelas renomeado tem o nome em azul.
- Uma tabela, nota ou grupo de tabelas com uma alteração que não tem célula própria, como uma movimentação, um novo tamanho ou cor, ou uma mudança de grupo ou das tabelas de um grupo, é contornado em âmbar.
- Uma chave estrangeira adicionada, removida ou alterada desenha seu conector nessa cor. Passar o ponteiro sobre ele, ou iluminá-lo a partir de uma linha, o desenha na cor habitual de passagem do ponteiro em vez disso.
- Uma alteração de índice não marca nada em nenhum dos lados; aparece só na árvore.

Cada lado segue as opções de exibição do seu próprio documento. Uma alteração em uma célula que aquele lado não desenha aparece no nome em vez disso. Uma alteração de coluna em uma célula que uma opção de exibição oculta, como `Unique` ou `Auto Increment`, ambas desativadas por padrão, deixa o nome da coluna em âmbar, assim como uma alteração de chave primária em uma linha que não mostra ícone de chave. Uma alteração no comentário da tabela enquanto `Table Comment` está desativada deixa o nome da tabela em âmbar. O azul de uma renomeação prevalece sobre esse âmbar. Uma nota ou um grupo de tabelas que seu documento oculta é listado na árvore, mas não é desenhado naquele lado.

Na exibição `Logical Names`, que não desenha nenhuma célula de nome, o azul de uma renomeação e o âmbar de uma alteração em uma célula que o lado não desenha vão para o nome lógico desenhado no lugar do nome. Uma alteração de tipo de dados deixa a célula de tipo em âmbar em qualquer exibição de nomes, mesmo onde a célula mostra o nome de um domínio. Nenhum dos lados desenha as cores que as verificações da aba Dicionário dão aos nomes no canvas — consulte [Marcas no canvas](./dictionary.md#marks-on-the-canvas).

Em `70%` ou menos, as tabelas reduzidas mantêm o contorno. O nome mantém o verde ou o vermelho de uma tabela adicionada ou removida, ou o azul de uma renomeação, e, caso contrário, assume o âmbar de uma alteração de comentário. As alterações de coluna não são desenhadas até você aumentar o zoom de novo; a árvore ainda as lista.
