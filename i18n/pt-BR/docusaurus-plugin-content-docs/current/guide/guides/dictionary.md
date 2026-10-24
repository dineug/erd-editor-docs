---
sidebar_position: 14
description: Manter os domínios, as palavras e os termos do diagrama na aba Dicionário, derivar nomes físicos a partir de nomes lógicos, deixar que um domínio defina o tipo de dados de suas colunas, ler o que a planilha Verificações encontra, editar e classificar as planilhas como em uma planilha eletrônica e importá-las e exportá-las como arquivos CSV.
---

# Dicionário

A aba Dicionário guarda o padrão de nomenclatura do diagrama em três dicionários, cada um em uma planilha que você edita como uma planilha eletrônica:

- `Domains`: tipos de dados com nome, como `Name` para `VARCHAR(100)`. Uma coluna vinculada a um domínio mantém o tipo de dados dele.
- `Words`: as palavras padrão que compõem os nomes lógicos, cada uma com a abreviatura que um nome físico usa para ela, como `Customer` e `CUST`.
- `Terms`: nomes lógicos inteiros, cada um com o nome físico e o domínio que ele dá, como `Customer Name` com `CUST_NM`.

O [nome lógico](./logical-names.md) de uma tabela ou de uma coluna deriva seu nome físico desses dicionários, e o termo de uma coluna também pode vinculá-la a um domínio — consulte [Derivar nomes físicos](#deriving-physical-names).  
Uma quarta planilha, `Checks`, lista o que os dicionários encontram de errado nos nomes e tipos do diagrama e nos próprios dicionários, como uma palavra proibida em um nome lógico — consulte [A planilha Verificações](#the-checks-sheet).

## Abrir a aba {#opening-the-tab}

Mude para a aba `Dictionary` na barra de ferramentas, o botão com ícone de livro entre `Code Generator` e `Settings`, ou escolha `Dictionary` em `Tab` na [pesquisa rápida](./quick-search.md).  
Ela pode ser a aba em que o diagrama abre — consulte `Canvas Type` em [Bloqueio](./settings.md#lock).

A aba abre na planilha `Domains` até que você escolha outra.  
Cada vez que ela abre, a planilha volta com a seleção e a rolagem em que você a deixou ou, na primeira visita, com sua primeira célula selecionada. Sua grade recebe o teclado, então digitar ou usar as teclas de seta tem efeito imediato.

A planilha exibida e a pesquisa, a seleção, a rolagem e as larguras de coluna de cada planilha são só suas.  
Nada disso é salvo no arquivo, registrado no histórico de desfazer ou compartilhado com os colaboradores. Tudo isso é mantido enquanto o editor permanece aberto, nas trocas de aba e entre documentos carregados no mesmo editor.

## As planilhas {#the-sheets}

A barra no topo contém os quatro botões de planilha, `Domains`, `Words`, `Terms` e `Checks`, e o botão da planilha exibida aparece pressionado. Cada um mostra um contador ao lado do nome: as linhas que sua planilha contém, independentemente do que a pesquisa mostra, ou, na planilha `Checks`, o número de verificações, colorido pelo nível delas — consulte [A planilha Verificações](#the-checks-sheet).  
O campo de pesquisa vem em seguida — consulte [Pesquisar](#searching). No fim da barra, nas planilhas `Domains`, `Words` e `Terms` e fora de um editor somente leitura, vêm quatro ferramentas: `Add Row`, `Delete Rows`, `Import CSV` e `Export CSV` — consulte [Adicionar e excluir linhas](#adding-and-deleting-rows) e [Importar e exportar CSV](#importing-and-exporting-csv).  
Em um painel estreito ou em um idioma de exibição de textos longos, a barra quebra em mais linhas, para que todos os botões continuem ao alcance.

Sob a grade, uma linha de status conta as linhas que a pesquisa deixa, como em `4 rows`, e, enquanto a seleção abrange alguma linha, quantas ela abrange, como em `1 selected`. Uma linha que dois intervalos compartilham conta uma única vez, então esse número é quantas linhas `Delete Rows` removeria.  
Os números de linha à esquerda contam as linhas na ordem em que a planilha as mostra, a partir de 1. Uma célula somente leitura, o que inclui toda célula da planilha `Checks` e toda célula de um editor somente leitura, é desenhada sobre um fundo cinza, exceto onde uma verificação a marca.  
Uma planilha `Domains`, `Words` ou `Terms` vazia diz `Import a CSV file or add a row`, exceto em um editor somente leitura.

As colunas de cada planilha, na ordem:

| Planilha | Colunas |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

O que as células fazem:

- O `Data Type` de um domínio é escrito como um tipo de coluna, como `VARCHAR(100)` ou `NUMERIC(15,2)`, e toda coluna vinculada ao domínio o mantém — consulte [Domínios e tipos de dados](#domains-and-data-types).
- A `Abbreviation` de uma palavra é o que um nome físico usa para a palavra — consulte [A partir das palavras](#from-the-words).
- Os `Synonyms` e as `Forbidden Words` de uma palavra listam outras palavras para a mesma coisa, separadas por vírgulas. Os espaços nas pontas de cada item são removidos, um item vazio é descartado e um item igual à própria palavra é ignorado. Um nome lógico que usa um deles não compõe nenhum nome físico, e a planilha `Checks` o aponta e indica a palavra a usar no lugar — consulte [O que cada verificação encontra](#what-each-check-finds).
- O `Term` de um termo é um nome lógico inteiro, e seu `Physical Name` é o nome que esse nome lógico dá — consulte [A partir de um termo](#from-a-term).
- O `Domain` de um termo mostra o nome do domínio que ele vincula e fica vazio enquanto ele não vincula nenhum ou vincula um domínio que já foi removido — consulte [O domínio de um termo](#a-terms-domain).
- `Category`, `English Name`, cada `Description` e os `Synonyms` de um termo são anotações. Eles não alteram nada, e nenhuma verificação os lê.

Em um [idioma de exibição da direita para a esquerda](./language-and-theme.md#right-to-left-languages), a barra, o menu da grade e a linha de status são espelhados, enquanto as planilhas e a lista de domínios de um termo continuam da esquerda para a direita.

## Derivar nomes físicos {#deriving-physical-names}

Os dicionários podem dar a uma tabela ou a uma coluna seu nome físico, o nome que o Esquema SQL e o Gerador de código escrevem, a partir de seu nome lógico. Primeiro procura-se um termo cujo `Term` seja o nome lógico; caso contrário, o nome é composto a partir das abreviaturas das palavras.  
Por exemplo, com as palavras `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) e `Date` (`DT`), e o termo `Customer Number` com o nome físico `CUST_NO` e o domínio `Number`, cujo tipo de dados é `INT`:

- O nome lógico `Customer Number` dá a uma coluna o nome `CUST_NO`, vincula-a a `Number` e dá a ela o tipo `INT`.
- `Order Date` compõe `ORD_DT`.
- Uma tabela com o nome lógico `Customer` recebe o nome `CUST`.

Com a planilha `Words` e a planilha `Terms` vazias, nada é derivado.

### Quando um nome é derivado {#when-a-name-is-derived}

Um nome físico é derivado quando um nome lógico é escrito:

- No canvas, quando o editor da célula de nome lógico se fecha com um nome lógico diferente daquele com que abriu, por `Enter`, `Tab`, `Escape` ou um clique em outro lugar. Cada tecla digitada escreve apenas o nome lógico — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).
- Imediatamente, quando você escolhe um termo na lista sob a célula — consulte [Completar nomes de termos](./logical-names.md#completing-term-names).
- Quando uma colagem escreve em uma célula de nome lógico — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).
- Quando [Localizar e substituir](./find-and-replace.md#replacing) substitui um nome lógico, uma correspondência ou todas.
- Quando um agente de codificação define um nome lógico.

Ele só é derivado enquanto o nome físico está vazio ou foi ele próprio derivado — consulte [Nomes escritos por você](#names-of-your-own).  
Um termo escolhido, uma colagem ou uma substituição escreve o nome lógico e o que ele deriva como uma única etapa de desfazer. No canvas, o nome derivado quando o editor se fecha é uma etapa própria depois da digitação: o primeiro desfazer reverte o nome derivado, com o domínio e o tipo que um termo trouxe, e deixa o nome lógico que você digitou.

Nada é derivado novamente mais tarde por conta própria. Uma nova `Abbreviation` de uma palavra, um novo `Physical Name` ou `Domain` de um termo e novas palavras ou novos termos deixam os nomes já derivados como estão; para isso, use [Derivar nomes físicos novamente](#derive-physical-names-again). O `Data Type` de um domínio é a exceção: ele chega às suas colunas imediatamente.

### A partir de um termo {#from-a-term}

Primeiro, a planilha `Terms` é pesquisada em busca de um termo cujo `Term` seja igual ao nome lógico. Os espaços nas pontas e a composição Unicode são ignorados, mas maiúsculas e minúsculas são diferenciadas, então `customer number` não corresponde a `Customer Number`. De dois termos com o mesmo nome, vale o primeiro da planilha.

- O termo dá seu `Physical Name` ou, enquanto ele está vazio, o nome que suas palavras compõem, como descrito abaixo, se elas compuserem um.
- Para uma coluna, o termo também vincula seu `Domain` enquanto a planilha `Domains` o lista, o que dá à coluna o tipo de dados do domínio — consulte [Vincular uma coluna](#linking-a-column). Ele faz isso mesmo quando não dá nenhum nome. Um termo sem domínio não desvincula nada.
- Uma tabela recebe apenas o nome físico do termo.

### A partir das palavras {#from-the-words}

Sem um termo correspondente, as palavras compõem o nome:

1. O nome lógico é cortado nos espaços, em `_`, `-`, `·` e `/`, e nenhuma palavra atravessa um corte.
2. Cada pedaço é lido a partir da esquerda, tomando em cada ponto o texto mais longo que a planilha `Words` lista, como `Word`, sinônimo ou palavra proibida, e sem nunca voltar atrás. Com as palavras `가입`, `가입일` e `일자`, `가입일자` é lido como `가입일` e `자`, o que deixa `자` não registrado, enquanto `가입 일자` é lido como `가입` e `일자`. Maiúsculas e minúsculas são diferenciadas: `member` não é a palavra `Member`.
3. O nome físico é formado pela `Abbreviation` de cada palavra, tal como foi digitada, com as abreviaturas unidas por `_`, como em `ORD_DT`. De duas palavras com o mesmo nome, a primeira da planilha dá a abreviatura. Nenhum limite de comprimento se aplica, e `Table Name Case` e `Column Name Case` do Gerador de código não têm nenhum papel.

É tudo ou nada. Se algum trecho for um sinônimo, uma palavra proibida ou um texto que nenhuma palavra lista, ou se uma palavra tiver a `Abbreviation` vazia, nenhum nome é composto, e o nome físico continua como está.

### Nomes escritos por você {#names-of-your-own}

Os dicionários só preenchem um nome físico enquanto ele está vazio ou foi preenchido por eles próprios. O editor guarda essa informação para cada tabela e coluna, embora nada no canvas a mostre.

- Um nome que você escreve passa a contar como escrito por você: digitar em uma célula de nome, substituir o nome de uma tabela ou de uma coluna com Localizar e substituir, colar sobre a célula de nome de uma coluna e a renomeação feita por um agente de codificação. Um nome lógico escrito depois o deixa como está, escreve apenas o nome lógico e não vincula nenhum domínio.
- Limpar o nome o devolve aos dicionários, já que um nome vazio é sempre derivado.
- Um nome lógico que não deriva nada deixa o nome físico e seu estado como estavam: um nome vazio continua vazio, e um nome derivado se mantém e continua pertencendo aos dicionários.
- Uma nova tabela ou coluna começa com o nome vazio, então seu primeiro nome lógico o deriva. Uma coluna de chave estrangeira que um relacionamento adiciona recebe o nome de sua chave, e esse nome conta como escrito por você — consulte [Nomes das colunas de chave estrangeira](./relationship-editing.md#foreign-key-column-names).
- Os nomes que um `Import` ou `Import and Add` de Esquema SQL, GraphQL, DBML ou AML traz e os nomes de um diagrama feito por uma versão anterior à aba Dicionário contam como escritos por você, então um nome lógico escrito neles depois não deriva nada.
- Uma [tabela duplicada](./table-related-functions.md#duplicating-tables-and-memos), uma coluna [movida para outra tabela](./table-editing.md#rearranging-and-moving-columns) pela alça de arrastar, uma colagem de tabelas copiadas e o `Import and Add` de um arquivo JSON mantêm o estado de cada nome. Os nomes de colunas coladas em tabelas selecionadas como novas colunas contam como escritos por você, a menos que o nome colado esteja vazio e o nome lógico delas derive um.
- [Derivar nomes físicos novamente](#derive-physical-names-again) devolve aos dicionários um nome escrito por você, inclusive um importado.

### Duas colunas, um nome {#two-columns-one-name}

Uma coluna não deriva nada quando outra coluna da sua tabela já tem o nome que ela derivaria. Ela mantém seu nome, seu estado e seu vínculo com o domínio, e apenas seu nome lógico é escrito. Os nomes são comparados sem diferenciar maiúsculas de minúsculas e ignorando os espaços nas pontas, como os nomes das colunas de chave estrangeira.  
Quando uma única alteração daria o mesmo nome a duas colunas, como `Replace All` ou `Derive Physical Names Again` sobre uma tabela podem fazer, a primeira da tabela fica com ele.  
Por exemplo, uma autorreferência em `members` com a chave `MBR_NO` adiciona `MBR_NO_2`, que copia o nome lógico `Member Number`. `Derive Physical Names Again` lhe daria o nome `MBR_NO`, que a chave já tem, então ela mantém `MBR_NO_2`.  
As tabelas não têm essa regra: duas tabelas podem derivar o mesmo nome.

## Derivar nomes físicos novamente {#derive-physical-names-again}

Use o item `Derive Physical Names Again` depois de alterar a `Abbreviation` de uma palavra ou o `Physical Name` ou o `Domain` de um termo, já que essas alterações não renomeiam nada por conta própria. Ele devolve aos dicionários os nomes que abrange e os deriva novamente pelas regras acima, inclusive os nomes que você mesmo escreveu. Ele só é oferecido na aba ERD, e não em um editor somente leitura:

- O menu de contexto da tabela, logo depois de `Focus on this table` ou `Focus on selected tables`. Enquanto a tabela é uma de duas ou mais tabelas selecionadas, `Derive Physical Names Again` abrange todas elas, onde quer que você clique com o botão direito na tabela. Caso contrário, um clique com o botão direito na linha de uma coluna oferece `Derive Physical Name Again`, só para essa coluna, e um no cabeçalho oferece `Derive Physical Names Again`, para o nome da tabela e todas as colunas.
- O menu de contexto do canvas, logo depois de `Name View`: `Derive Physical Names Again`, para todas as tabelas e colunas do diagrama. Ele fica de fora enquanto o diagrama não tem nenhuma tabela.
- A [pesquisa rápida](./quick-search.md#what-the-palette-lists), como itens para a coluna em foco, a tabela em foco, as tabelas selecionadas e o diagrama inteiro.

![Alteração da abreviatura de Number de NO para NUM na planilha Words, com os nomes físicos permanecendo MBR_NO e PAY_NO no diagrama, depois Derive Physical Names Again no menu do canvas transformando-os em MBR_NUM e PAY_NUM, enquanto ORD_NO, que vem do seu termo, permanece](/img/demo-derive-physical-names.webp)

Cada tabela e coluna abrangida que tem um nome lógico é derivada novamente. Uma coluna também recebe o domínio que seu termo dá e, com ele, o tipo do domínio, que se propaga pelos relacionamentos enquanto a [sincronização do tipo de dados nos relacionamentos](./settings.md#relationship-datatype-sync) está ativada.  
Ele não mexe em uma tabela ou coluna sem nome lógico, nem em uma coluna cujo novo nome outra coluna da sua tabela já tem — consulte [Duas colunas, um nome](#two-columns-one-name). Cada uma delas mantém seu nome e seu estado, escrito por você ou dos dicionários, e uma coluna também mantém seu vínculo com o domínio.  
Um nome lógico que agora não deriva nada deixa o nome físico como está, mas o devolve aos dicionários, então o próximo nome lógico que você escrever o deriva.  
É uma única etapa de desfazer, por mais nomes, vínculos e tipos que altere. Ele só não registra nenhuma etapa quando não altera nada, e devolver aos dicionários um nome escrito por você conta como alteração, mesmo quando o nome já contém o que eles dão.

O próprio `Physical Name` de um termo não é composto novamente a partir das palavras alteradas, então edite o termo antes de derivar novamente.

## Domínios e tipos de dados {#domains-and-data-types}

Uma coluna vinculada a um domínio mantém o `Data Type` do domínio. Vincular uma coluna dá a ela esse tipo imediatamente.  
Quando o `Data Type` de um domínio muda, seja editado, colado ou importado na planilha `Domains`, seja alterado por um colaborador ou por um agente de codificação, toda coluna vinculada a ele recebe o novo tipo na mesma etapa. Enquanto a [sincronização do tipo de dados nos relacionamentos](./settings.md#relationship-datatype-sync) está ativada, cada uma dessas alterações segue pelos relacionamentos como faz uma alteração digitada; enquanto ela está desativada, só as colunas vinculadas mudam.  
Renomear um domínio altera apenas o nome que as células Domínio das colunas mostram.

Uma alteração de tipo feita na planilha `Domains` é desfeita ali, junto com os tipos de coluna que ela deu — consulte [Planilhas do dicionário](./undo-redo.md#dictionary-sheets).  
Um desfazer ou refazer na aba ERD que vincula novamente uma coluna a um domínio, ou que traz de volta uma coluna vinculada a um, dá à coluna o tipo atual do domínio. Um que restaura outro tipo desvincula a coluna.

### Vincular uma coluna {#linking-a-column}

Uma coluna é vinculada a um domínio por:

- A escolha do domínio na célula Domínio da coluna, que View Option → `Domain` mostra, ou, na exibição `Logical Names`, na célula de tipo que ocupa o lugar dela — consulte [A célula Domínio](./logical-names.md#the-domain-cell).
- Um nome lógico cujo termo dá um domínio — consulte [A partir de um termo](#from-a-term). Isso só acontece enquanto o nome é derivado, então não para um nome escrito por você nem para uma coluna cujo nome derivado outra coluna já tem.
- `Derive Physical Name Again` ou `Derive Physical Names Again`, que vincula o domínio do termo de cada coluna abrangida.
- Um relacionamento: uma coluna de chave estrangeira copia o domínio de sua chave, junto com o tipo e o nome lógico dela — consulte [Relacionamentos identificadores](./relationship-editing.md#identifying-relationships). Uma chave cuja cópia recebe outro tipo, como acontece com a de uma chave serial, não repassa nenhum domínio.
- A duplicação da sua tabela ou a movimentação dela para outra tabela pela alça de arrastar, que mantêm o vínculo. Uma colagem de tabelas ou colunas copiadas só o mantém enquanto este diagrama lista o domínio e o domínio ainda tem o tipo da coluna copiada, então uma cópia de outro diagrama chega desvinculada — consulte [Copiar e colar tabelas e notas](./table-related-functions.md#copyingpasting-tables-and-memos). `Import and Add` não vincula nenhuma coluna.
- O nome de um domínio colado em uma célula Domínio — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).

### Desvincular {#unlinking}

- Digitar um tipo na célula `DataType` de uma coluna vinculada, ou aceitar uma sugestão, desvincula a coluna assim que seu tipo difere do tipo do domínio, e a coluna mantém o tipo que você digitou — consulte [Preenchimento automático do tipo de dados](./table-editing.md#datatype-autocomplete). Digitar de volta o tipo do domínio não a vincula novamente; em vez disso, escolha o domínio na célula Domínio dela. Uma colagem sobre a célula `DataType` e uma alteração de tipo feita por um agente de codificação desvinculam da mesma forma.
- Enquanto a sincronização do tipo de dados nos relacionamentos está ativada, toda coluna alcançada por uma alteração de tipo cujo novo tipo difere do tipo do seu próprio domínio é desvinculada na mesma etapa, como uma chave estrangeira vinculada a um domínio próprio. [Mapear colunas](./relationship-editing.md#map-columns) desvincula da mesma forma as colunas cujo tipo altera.
- `None` na célula Domínio desvincula a coluna e mantém seu tipo.
- Alterar ou limpar o `Domain` de um termo, ou remover um termo, não altera nenhuma coluna.

### Remover um domínio {#removing-a-domain}

Remover a linha de um domínio deixa suas colunas com os tipos que têm, e os vínculos delas continuam. As colunas não mostram nenhum domínio, e a planilha `Checks` lista `Unknown domain` para cada uma delas enquanto a planilha `Domains` ainda contém algum domínio. Desfazer a remoção na planilha `Domains` mostra os vínculos novamente.  
Enquanto o domínio não existe, digitar em uma dessas colunas um tipo diferente do tipo do domínio a desvincula de vez, e `None` na célula Domínio dela também.  
O arquivo deixa esses vínculos de fora quando é salvo, então o diagrama reabre com essas colunas desvinculadas.

Um termo vinculado a um domínio removido mostra uma célula `Domain` vazia, marcada como `Unknown domain`. `Delete` ou `Backspace` na célula o desvincula — consulte [O domínio de um termo](#a-terms-domain).

## A planilha Verificações {#the-checks-sheet}

A planilha `Checks` lista o que as verificações dos dicionários encontram nos dicionários e nas tabelas e colunas do diagrama. As verificações apenas leem: elas não alteram nada.  
Cada verificação só é executada enquanto a planilha que ela lê contém uma linha, e as verificações de palavras só enquanto a planilha `Words` contém uma palavra com nome, então um diagrama com os dicionários vazios não lista nada.

![Customer Num em vermelho e Order Stat em âmbar na exibição Logical Names, a planilha Checks listando suas três verificações com um contador vermelho, um clique duplo na linha Forbidden word voltando a Customer Num no diagrama e a redigitação como Member Number, que deixa uma verificação](/img/demo-dictionary-checks.webp)

Suas três colunas são somente leitura:

- `Type` indica a verificação — consulte [O que cada verificação encontra](#what-each-check-finds).
- `Target` indica uma palavra, um termo ou um domínio pelo nome, uma tabela pelo nome e uma coluna como `table.column`, com a tabela e a coluna nomeadas como a [exibição de nomes](./logical-names.md#beyond-the-canvas) as nomeia, e `unnamed` onde a exibição não mostra nenhum nome.
- `Detail` mostra o que a verificação encontrou e, depois de `→`, o que os dicionários oferecem no lugar, com várias opções unidas por vírgulas, como `멤버 → 회원`. Um lado vazio aparece como `—`, como em `— → NUMERIC(15)`.

As verificações das palavras vêm primeiro, depois as dos termos e as dos domínios, depois tabela por tabela, cada tabela seguida de suas colunas.  
A lista acompanha cada edição assim que ela chega, inclusive a de um colaborador e a de um agente de codificação, e cada troca da exibição de nomes.  
O contador do botão `Checks` fica vermelho enquanto alguma verificação é um erro, âmbar enquanto todas são avisos, e esmaecido quando não há nenhuma.

As linhas não podem ser editadas, adicionadas, excluídas, classificadas, importadas nem exportadas: a barra não mostra nenhuma ferramenta, um clique com o botão direito não abre o menu da grade, e desfazer e refazer não fazem nada. Pesquisar, selecionar e copiar funcionam como nas outras planilhas.

`Enter` ou um clique duplo em uma linha vai para o que ela indica:

- Uma palavra, um termo ou um domínio: a aba mostra a planilha correspondente com a célula que a verificação lê selecionada, o nome ou o `Domain` de um termo, e com a linha dela como a primeira visível. A pesquisa da planilha é limpa se esconder a linha. Uma linha que já foi removida não leva a lugar nenhum.
- Uma tabela ou uma coluna: a aba ERD aparece com apenas essa tabela selecionada e a célula que a verificação lê em foco. Essa célula é o nome, o nome lógico ou a célula Domínio ou, onde a linha não desenha essa célula, a célula desenhada no lugar dela. O canvas recebe o teclado, e a área visível se move pela regra de [Onde um salto termina](./table-related-functions.md#where-a-jump-lands).

Um clique duplo em um cabeçalho, na borda de uma coluna, em uma barra de rolagem ou abaixo das linhas não leva a lugar nenhum.  
Um agente de codificação lista as mesmas verificações, na mesma ordem, com `erd_list_checks` — consulte [Verificações do dicionário](../../mcp/tools.md#dictionary-checks).

As outras três planilhas marcam as células que as verificações leem, um nome ou o `Domain` de um termo, com texto em vermelho ou âmbar sobre um fundo tingido:

- Vermelho: um nome que outra linha da sua planilha tem, o `Domain` de um termo que vincula um domínio removido e um `Term` que usa uma palavra proibida.
- Âmbar: um `Term` que usa um sinônimo ou uma palavra não registrada.

Uma célula assume o mais forte dos seus níveis. As marcas também aparecem em um editor somente leitura, e a própria planilha `Checks` não é colorida. Para as marcas no canvas ERD, consulte [Marcas no canvas](#marks-on-the-canvas).

### O que cada verificação encontra {#what-each-check-finds}

| `Type` | Nível | Encontra | `Detail`, por exemplo |
| --- | --- | --- | --- |
| `Duplicate name` | Erro | Um `Word`, `Term` ou `Domain` que outra linha da mesma planilha também tem. Cada uma das linhas é listada. | `Member` |
| `Unknown domain` | Erro | Uma coluna ou um termo ainda vinculado a um domínio removido, enquanto a planilha `Domains` contém algum domínio | O nome do domínio removido |
| `Forbidden word` | Erro | Um trecho de um nome lógico ou de um `Term` que uma palavra lista em suas `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Aviso | Um trecho do nome lógico de uma tabela ou de uma coluna, ou de um `Term`, que nenhuma palavra lista | `자` |
| `Synonym` | Aviso | Um trecho que uma palavra lista em seus `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Aviso | Uma tabela ou uma coluna cujo nome lógico corresponde a um termo, mas cujo nome físico não é o que o termo dá | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Aviso | Uma coluna cujo `DataType` não é o `Data Type` do domínio que ela vincula | `INT → NUMERIC(15)` |

- Os nomes são comparados sem os espaços das pontas e diferenciando maiúsculas de minúsculas, então `Member` e `member` são dois nomes, e um nome vazio nunca é duplicado. As planilhas recusam uma edição que daria o mesmo nome a duas linhas, então `Duplicate name` só aparece onde duas edições se cruzaram, como quando dois colaboradores nomeiam linhas ao mesmo tempo, ou em um arquivo editado em outro lugar.
- As verificações de palavras leem um nome como descrito em [A partir das palavras](#from-the-words) e listam cada trecho diferente uma vez por nome. `Forbidden word` e `Synonym` oferecem a palavra que lista o trecho.
- `Physical name mismatch` compara o nome, sem os espaços das pontas, com o `Physical Name` do termo, ou com o que as palavras dele compõem enquanto ele não tem um, e não indica nada enquanto o termo não dá nenhum nome. Uma coluna de chave estrangeira que copiou o nome lógico de sua chave apresenta essa verificação sempre que seu próprio nome difere do nome do termo, como `members_id → MBR_ID`. `Derive Physical Name Again` resolve isso, a menos que outra coluna já tenha esse nome.
- `Domain type mismatch` nunca resulta de edições em um único editor, já que uma coluna vinculada sempre termina com o tipo do seu domínio. Essa verificação pode surgir quando um colaborador vincula uma coluna enquanto outro altera o tipo desse domínio, ou em um arquivo escrito em outro lugar. Escolher o domínio novamente na célula Domínio da coluna dá à coluna o tipo dele, e `None` a desvincula. Um vínculo com um domínio removido só aparece como `Unknown domain`.

### Marcas no canvas {#marks-on-the-canvas}

O canvas ERD escreve um nome que as verificações apontam na cor da sua verificação:

- Uma célula de nome lógico, no cabeçalho da tabela ou na linha de uma coluna, fica vermelha enquanto seu nome lógico usa uma palavra proibida e, caso contrário, âmbar enquanto ele usa um sinônimo ou uma palavra que a planilha `Words` não tem.
- Uma célula de nome físico, no cabeçalho ou em uma linha, fica âmbar enquanto o termo ao qual seu nome lógico corresponde dá outro nome físico.

Só esses dois tipos de célula são marcados, nunca a célula Domínio ou a célula `DataType`, então `Unknown domain` e `Domain type mismatch` de uma coluna só aparecem na planilha `Checks`.  
Uma célula só é marcada pelo que desenha: a exibição `Physical Names` só pode marcar nomes físicos, a `Logical Names` só nomes lógicos e a `Both Names` cada célula pelas próprias verificações — consulte [Exibição de nomes](./logical-names.md#name-view). Uma célula em branco mantém a cor do texto de espaço reservado, e dicionários vazios não marcam nada.  
No cabeçalho de uma tabela em um [grupo de tabelas](./table-groups.md) colorido, uma marca só mantém sua cor enquanto continua legível sobre a cor do grupo; caso contrário, o nome assume o preto ou o branco do próprio cabeçalho.

As marcas aparecem no canvas ERD, na [viagem no tempo](./undo-redo.md#time-travel) e na pré-visualização do [layout automático](./table-related-functions.md#auto-layout), também em um editor somente leitura. A aba Visualização, os dois lados do [visualizador de diferenças](./table-related-functions.md#diff-viewer) e uma imagem exportada não desenham nenhuma.  
Elas acompanham cada alteração assim que acontece, seja em um nome, seja em uma palavra, um termo ou um domínio.

## Pesquisar {#searching}

O campo de pesquisa diz `Search` e aparece nas quatro planilhas, também em um editor somente leitura. Cada planilha tem sua própria pesquisa.  
Uma linha corresponde quando uma das células pesquisadas contém o texto, sem diferenciar maiúsculas de minúsculas e ignorando a composição Unicode e os espaços em torno do termo de pesquisa. Uma correspondência nunca se estende por duas células. As células pesquisadas:

- `Domains`: `Domain`, `Data Type` e `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` e `Description`.
- `Terms`: `Term`, `Physical Name` e `Description`.
- `Checks`: as três, como aparecem no idioma de exibição.

Uma nova pesquisa coloca a seleção na primeira célula e rola até o topo.  
Enquanto o campo contém texto, um botão `x` com a dica de ferramenta `Clear search` o esvazia e deixa o cursor de texto no campo. `Escape` no campo também o esvazia.  
No campo, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) desfaz sua digitação, não a planilha, e as teclas de linha de [Adicionar e excluir linhas](#adding-and-deleting-rows) são teclas de texto.  
`Add Row` e as inserções limpam a pesquisa primeiro, já que uma linha vazia não corresponde a nenhuma pesquisa. Uma importação a mantém.

## Selecionar e mover {#selecting-and-moving}

A grade seleciona como faz uma planilha eletrônica:

- Um clique seleciona uma célula, e um arrasto seleciona um intervalo, rolando na borda da planilha. `Shift + click` estende a seleção a partir da célula ativa, e `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) adiciona outro intervalo.
- Um cabeçalho de coluna seleciona sua coluna, um número de linha sua linha e o canto superior esquerdo todas as células, como faz `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac).
- No Mac, `Ctrl + click` é um clique com o botão direito — consulte [O menu da grade](#the-grids-menu).

Com o teclado:

- As teclas de seta movem uma célula e, com `Ctrl` (Windows/Linux) ou `⌘` (Mac) pressionado, vão até a borda da planilha naquela direção.
- `Home` e `End` vão para a primeira e a última célula da linha e, com `Ctrl` ou `⌘` pressionado, para a primeira e a última célula da planilha.
- `Page Up` e `Page Down` movem uma tela de linhas.
- Manter `Shift` pressionado com qualquer uma das teclas acima estende a seleção em vez disso.
- `Tab` e `Shift + Tab` movem para a direita e para a esquerda, e `Shift + Enter` move para cima. `Enter` sozinho edita a célula — consulte [Editar células](#editing-cells).

Quando linhas desaparecem sob a seleção, por um desfazer ou pela remoção feita por um colaborador, ela é trazida de volta para dentro das linhas restantes.

Arraste a borda direita do cabeçalho de uma coluna para redimensioná-la, ou clique duas vezes na borda para ajustar a coluna ao texto mais largo das linhas visíveis. Nenhuma tecla redimensiona uma coluna.

## Editar células {#editing-cells}

Digitar na célula selecionada substitui seu valor. `Enter`, `F2` ou um clique duplo edita o valor atual, com o cursor de texto no fim.  
Uma célula contém uma única linha, então uma tabulação ou uma quebra de linha colada nela vira um espaço.

- `Enter` grava a edição e move para baixo, e `Tab` a grava e move para a direita. Com `Shift`, eles movem para cima ou para a esquerda.
- Um clique em outro lugar, ou o teclado saindo da grade, também a grava.
- `Escape` a cancela.

![Edição da planilha Words: digitação de NUM sobre uma célula e Enter, inserção de uma linha com ⌥ + Enter e preenchimento com Tab, classificação por Word no menu da grade, depois pesquisa por ord e limpeza da pesquisa com Esc](/img/demo-dictionary-editing.webp)

Uma edição que deixa o valor como estava não grava nada, e uma edição gravada é uma única etapa de desfazer da sua planilha, por mais que se tenha digitado.  
`Delete` ou `Backspace`, sem nenhuma edição aberta, esvazia todas as células selecionadas, como uma única etapa.  
Enquanto uma edição está aberta, as teclas de desfazer e refazer desfazem e refazem sua digitação na célula, e as teclas de linha digitam como texto — consulte [Teclas na aba](#keys-on-the-tab).  
Toda célula da planilha `Checks`, e toda célula de um editor somente leitura, é somente leitura e não abre nenhuma edição.

Quando alguma linha de uma edição, de uma colagem ou de uma limpeza é recusada, nada dela é salvo, e uma notificação de erro diz o motivo, contando as linhas e indicando as três primeiras:

- Um nome que outra linha da planilha tem, ou que outra linha da mesma colagem grava: `Nothing saved: 1 row shares a name with another row (Member)` ou `Nothing saved: 2 rows share a name with another row (…)`. Os nomes são comparados sem os espaços das pontas e diferenciando maiúsculas de minúsculas, então `Member` e `member` são diferentes. Um nome vazio nunca é recusado.
- O `Domain` de um termo dado como um texto que nenhum domínio da planilha `Domains` tem: `Nothing saved: 1 row names an unknown domain (…)`.
- Uma linha que um colaborador removeu enquanto você a editava: `Nothing saved: the row was removed`.

Uma gravação pode ir além da sua célula:

- Um termo que recebe um `Term` enquanto seu `Physical Name` está vazio ganha o nome que suas palavras compõem, quando elas compõem um — consulte [A partir das palavras](#from-the-words). Isso acontece uma vez: o nome não é composto novamente quando as palavras mudam depois.
- O novo `Data Type` de um domínio altera o tipo de todas as colunas vinculadas ao domínio, na mesma etapa de desfazer — consulte [Domínios e tipos de dados](#domains-and-data-types).

### O domínio de um termo {#a-terms-domain}

`Enter`, `F2` ou um clique duplo na célula `Domain` de um termo abre uma lista sob a célula, ou acima dela onde há mais espaço, com um campo de pesquisa que diz `Domain`.  
A lista contém `None` e depois todos os domínios com nome na ordem da planilha `Domains`, e o realce começa no domínio que o termo vincula, ou em `None`. Digitar um caractere na célula abre a lista já pesquisada por ele.

- Digitar restringe a lista aos domínios cujos nomes contêm o texto, sem diferenciar maiúsculas de minúsculas, remove `None` e realça a primeira correspondência.
- `↑` e `↓` movem o realce, dando a volta nas duas pontas.
- `Enter` ou `Tab` escolhe a linha realçada, e um clique a linha clicada, como uma única etapa de desfazer. O termo vincula exatamente o domínio escolhido, mesmo que seja um de dois domínios com o mesmo nome, e `None` o desvincula.
- `Escape` ou um clique fora fecha a lista sem gravar nada do que foi digitado.

Sem nenhum domínio com nome na planilha `Domains`, o campo abre sem lista.  
Um texto colado vincula o primeiro domínio listado com esse nome, um texto vazio desvincula, e um texto igual ao que a célula mostra mantém o vínculo como está. Qualquer outro nome é recusado — consulte [Editar células](#editing-cells). `Delete` ou `Backspace` na célula desvincula o termo, mesmo de um domínio removido.

## Copiar e colar {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) copia a seleção como texto separado por tabulações, uma linha de texto por linha da planilha, do jeito que as planilhas eletrônicas o escrevem, então ele é colado em uma planilha eletrônica como células. Uma tabulação ou uma quebra de linha dentro de um valor vira um espaço.  
Vários intervalos só são copiados juntos quando abrangem as mesmas linhas, lado a lado, ou as mesmas colunas, um acima do outro. Caso contrário, nada é copiado, e aparece a notificação de erro `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac) cola texto separado por tabulações, como células copiadas de uma planilha eletrônica, a partir da célula ativa para baixo e para a direita:

- As aspas são coladas como texto, então uma célula de planilha eletrônica que contém uma quebra de linha não é colada como uma única célula.
- Um valor único preenche todos os intervalos selecionados.
- As linhas além da última linha são adicionadas como novas linhas, em ordem, então colar em uma planilha vazia a preenche.
- As colunas além da última coluna ficam de fora e, depois que o restante é salvo, a notificação `Columns past the last one weren't pasted` avisa isso.
- Uma colagem de várias células seleciona então o bloco que gravou.

Uma colagem é uma única etapa de desfazer, incluindo as linhas que adiciona, e é recusada por inteiro diante de um nome duplicado ou de um domínio desconhecido — consulte [Editar células](#editing-cells).  
Uma cópia, uma colagem ou uma limpeza sobre mais de um milhão de células não faz nada, e aparece a notificação de erro `Nothing done: the selection covers too many cells`.  
Recortar, `Ctrl + X` (Windows/Linux) ou `⌘ + X` (Mac), não faz nada em uma planilha. Copiar e colar nesta aba nunca chegam ao diagrama e, enquanto uma edição de célula está aberta, atuam sobre o texto da célula.

## Adicionar e excluir linhas {#adding-and-deleting-rows}

O botão `Add Row` adiciona uma linha vazia no fim da planilha. Ele limpa a pesquisa, seleciona a primeira célula da nova linha e dá o teclado à grade, então digitar preenche essa célula.  
O botão `Delete Rows` remove todas as linhas que a seleção abrange, em qualquer coluna, e um único desfazer traz todas elas de volta aos seus lugares. Sua dica de ferramenta indica a tecla que faz o mesmo.

Com o teclado na grade e nenhuma célula em edição:

- `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) insere abaixo da seleção tantas linhas vazias quantas ela abrange.
- `Alt + Shift + Enter` (Windows/Linux) ou `⌥ + Shift + Enter` (Mac) as insere acima.
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), ou `⌥ + Backspace` ou `⌥ + Delete` (Mac), exclui as linhas que a seleção abrange.

Elas fazem o que os itens de inserir e excluir linhas do menu da grade fazem — consulte [O menu da grade](#the-grids-menu). Uma inserção limpa a pesquisa e coloca as novas linhas logo acima da primeira linha que a seleção abrange, ou logo abaixo da última. Ela as seleciona na primeira coluna, com a primeira delas ativa, e é uma única etapa de desfazer.

Essas teclas são as combinações de `Add Column` e `Remove Column` da aba [Atalhos](./settings.md#shortcuts), então um host que as reatribui com [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) também as move. `Alt + Shift + Enter` é a tecla de `Add Column` com `Shift` adicionado e não tem uma linha própria ali.  
Em uma edição aberta e no campo de pesquisa, elas são teclas de texto, então no Mac `⌥ + Backspace` exclui uma palavra. Na planilha `Checks` e em um editor somente leitura, elas não fazem nada. Nesta aba, elas nunca adicionam nem removem uma coluna de tabela.  
No Obsidian, elas chegam à aba mesmo onde um atalho do Obsidian usa a mesma tecla.

Uma linha nunca preenchida, ou esvaziada de todos os valores, aparece na sua planilha e chega aos colaboradores, mas o arquivo a deixa de fora, então ela some quando o diagrama é aberto novamente.

## O menu da grade {#the-grids-menu}

Clique com o botão direito em uma célula das planilhas `Domains`, `Words` ou `Terms` para abrir o menu da grade. Uma célula fora da seleção passa a ser a seleção primeiro.  
Um clique com o botão direito abaixo da última linha ou à direita da última coluna o abre sobre a seleção como está, então uma planilha vazia o abre em qualquer lugar sob os cabeçalhos. A tecla de menu ou `Shift + F10` o abre para a célula ativa.

- `Insert 1 row above`, `Insert 1 row below` e `Delete 1 row`, cada um contando as linhas que a seleção abrange, como em `Insert 3 rows above`, com sua tecla à direita — consulte [Adicionar e excluir linhas](#adding-and-deleting-rows).
- `Sort by <column>, ascending` e `Sort by <column>, descending`, com o nome da coluna em que você clicou com o botão direito, como em `Sort by Word, ascending` — consulte [Classificar](#sorting). Eles ficam de fora à direita da última coluna.
- `Import CSV` e `Export CSV`, que fazem o que os botões da barra fazem — consulte [Importar e exportar CSV](#importing-and-exporting-csv).

Sem nenhuma linha visível, em uma planilha vazia ou com uma pesquisa que não corresponde a nada, só aparecem `Insert 1 row below`, `Import CSV` e `Export CSV`.  
A planilha `Checks` e um editor somente leitura abrem em vez dele o menu do próprio navegador, assim como um clique com o botão direito em um cabeçalho ou em uma barra de rolagem.  
O menu se fecha com uma escolha, com `Escape`, com um pressionamento em outro lugar da aba, quando a seleção ou a planilha muda e quando as linhas da planilha mudam, por uma edição sua ou de um colaborador.

## Classificar {#sorting}

`Sort by <column>, ascending` e `Sort by <column>, descending` reordenam as próprias linhas da planilha, não só a exibição. A nova ordem é salva no arquivo, vista pelos colaboradores e seguida por `Export CSV`, e um único desfazer traz a ordem antiga de volta.  
As linhas são comparadas pelo texto que a célula mostra, o `Domain` de um termo pelo nome do domínio, na ordem alfabética do idioma de exibição, com os números comparados pelo valor, então `2` vem antes de `10`. As células vazias ficam por último nos dois sentidos, e as linhas que se comparam como iguais mantêm sua ordem. Classificar uma planilha que já está nessa ordem não registra nada.  
A pesquisa continua como estava, assim como a seleção, cujas células agora contêm outras linhas.

## Importar e exportar CSV {#importing-and-exporting-csv}

Cada uma das planilhas `Domains`, `Words` e `Terms` entra a partir de um arquivo CSV e sai para um. Esses arquivos são próprios da aba Dicionário: `Import` e `Export` do menu de contexto do canvas não os leem nem os gravam — consulte [Importar ou exportar arquivos](./file-import-export.md).

### Importar {#importing}

`Import CSV`, na barra ou no menu da grade, abre o seletor de arquivos do próprio navegador para arquivos `.csv`, e não a caixa de diálogo de importação do host. Escolher o mesmo arquivo novamente o importa de novo.  
O arquivo entra no dicionário que seu cabeçalho indica, qualquer que seja a planilha exibida, e a aba então mostra essa planilha e dá o teclado à grade dela. A planilha mantém sua pesquisa, sua seleção e sua rolagem, então as linhas que a pesquisa esconde, ou as linhas adicionadas abaixo da área visível, ficam fora de vista.  
O arquivo é lido como UTF-8, com ou sem marca de ordem de bytes (BOM), ou como EUC-KR quando não é UTF-8 válido, como é o caso dos arquivos mais antigos do padrão de dados públicos.

![Abertura da aba Dicionário pela barra de ferramentas, depois importação de domínios, palavras e termos com Import CSV, com cada arquivo levando a aba para a própria planilha e informando o que adicionou](/img/demo-dictionary-import.webp)

Como as linhas chegam:

- Cada linha com nome atualiza a linha da planilha que tem esse nome, nos campos para os quais o arquivo tem colunas. As colunas que faltam no arquivo deixam esses campos como estão. Os nomes são comparados sem os espaços das pontas e diferenciando maiúsculas de minúsculas.
- Os nomes que faltam na planilha são adicionados depois da última linha dela, na ordem do arquivo.
- Uma importação nunca remove uma linha.
- Uma linha com o nome vazio é ignorada. Quando o arquivo contém um nome duas vezes, a linha posterior prevalece, e a anterior conta como ignorada. Linhas em branco não contam como linhas.
- O domínio de um termo é encontrado pelo nome, o primeiro domínio com esse nome, e um nome que nenhum domínio tem deixa o termo desvinculado, então importe os domínios primeiro.

Uma importação é uma única etapa de desfazer dessa planilha.  
A notificação então diz, por exemplo, `1 added · 1 updated · 2 skipped`. Uma linha igual à da planilha não conta como adicionada nem como atualizada, então importar o mesmo arquivo novamente não altera nada e não registra nenhuma etapa.  
Quando os termos do arquivo indicam domínios que o diagrama não tem, uma segunda linha indica os três primeiros, como em `4 unknown domains: 연월일, 금액, 번호`.  
Um arquivo cujo cabeçalho não corresponde a nenhum layout, ou corresponde a dois, não traz nada, e aparece a notificação de erro `Couldn't read this file as words, terms or domains`.

### Layouts de arquivo {#file-layouts}

Cada dicionário lê dois layouts. O primeiro é o do próprio editor, que `Export CSV` escreve, com os nomes dos campos como cabeçalho:

| Dicionário | Cabeçalho | Um arquivo precisa de |
| --- | --- | --- |
| Palavras | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Termos | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domínios | `name,category,dataType,description` | `name`, `dataType` |

As colunas podem vir em qualquer ordem, o `domain` de um termo contém o nome do domínio, e qualquer outra coluna é ignorada. No cabeçalho, maiúsculas e minúsculas são diferenciadas, e as células são lidas exatamente como estão escritas, inclusive os espaços.

O segundo é o layout dos arquivos do padrão de dados públicos da Coreia (공통표준):

| Dicionário | Um arquivo precisa de | Também lidos |
| --- | --- | --- |
| Palavras | `공통표준단어명` | `공통표준단어영문약어명` (abreviatura), `공통표준단어 영문명` (nome em inglês), `공통표준단어 설명` (descrição), `이음동의어 목록` (sinônimos), `금칙어 목록` (palavras proibidas) |
| Termos | `공통표준용어명` | `공통표준용어영문약어명` (nome físico), `공통표준도메인명` (domínio, pelo nome), `공통표준용어설명` (descrição), `용어 이음동의어 목록` (sinônimos) |
| Domínios | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categoria), `공통표준도메인설명` (descrição), `데이터길이`, `데이터소수점길이` |

O `데이터타입`, o `데이터길이` e o `데이터소수점길이` de um domínio se juntam em um único tipo de dados: `NUMERIC(15,2)`, `CHAR(8)`, só o tipo onde não há comprimento, como `DATE`, e sem a escala quando ela é 0, como em `NUMERIC(15)`.  
Nesses arquivos, os espaços das pontas das células são removidos, e as outras colunas, como o histórico de revisões, são ignoradas.  
Em qualquer um dos layouts, os espaços em um nome do cabeçalho não fazem diferença.

### Exportar {#exporting}

`Export CSV`, na barra ou no menu da grade, salva a planilha exibida no layout do próprio editor: todas as linhas na ordem da planilha, independentemente do que a pesquisa mostra, com o domínio de um termo escrito pelo nome, ou deixado vazio no caso de um domínio removido.  
O arquivo é UTF-8 com marca de ordem de bytes (BOM) e finais de linha CRLF, e só um campo que contém uma aspa, uma vírgula ou uma quebra de linha é colocado entre aspas. Ele abre em uma planilha eletrônica e é importado de volta com as mesmas linhas.  
Ele recebe o nome `<database name>-<timestamp>-words.csv`, `-terms.csv` ou `-domains.csv` e é salvo como as outras exportações do editor — consulte [Exportar](./file-import-export.md#exporting).

A planilha `Checks` não tem exportação, e um editor somente leitura não oferece importação nem exportação.

## Desfazer e refazer {#undo-and-redo}

As planilhas `Domains`, `Words` e `Terms` mantêm cada uma seu próprio histórico de desfazer, separado do histórico do diagrama. Nesta aba, `Ctrl + Z` e `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Z` e `⌘ + Shift + Z` (Mac), e os botões `Undo` e `Redo` da barra de ferramentas, atuam sobre a planilha exibida, e a barra de ferramentas não mostra o botão `Time Travel`. Na planilha `Checks`, eles não fazem nada.  
O desfazer da aba ERD nunca reverte uma edição de planilha — consulte [Planilhas do dicionário](./undo-redo.md#dictionary-sheets).

## Teclas na aba {#keys-on-the-tab}

Enquanto o teclado está na aba, estes atalhos do editor atuam — consulte [Atalhos](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac), abre a [pesquisa rápida](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), muda para a aba ERD e abre o [explorador](./explorer.md#opening-and-closing) na pesquisa dele.
- `Undo` e `Redo` atuam sobre a planilha exibida — consulte [Desfazer e refazer](#undo-and-redo).
- `Add Column` e `Remove Column` inserem e excluem linhas — consulte [Adicionar e excluir linhas](#adding-and-deleting-rows).

Enquanto uma edição de célula está aberta, inclusive a lista de domínios de um termo, `Search` e `Toggle Explorer` não fazem nada, para que o texto digitado não se perca.

Todos os outros atalhos do editor ficam na aba e nunca chegam ao canvas: `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) não adiciona nenhuma tabela, e `Delete` e `Backspace` não excluem nada no canvas.  
Em vez disso, as próprias teclas da grade atuam sobre a planilha: `Enter` edita a célula, `Delete` e `Backspace` limpam as células selecionadas, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona todas as células, e `Escape` cancela uma edição, fecha o menu da grade ou esvazia o campo de pesquisa. Copiar, recortar e colar também ficam na aba — consulte [Copiar e colar](#copying-and-pasting).

## Editores somente leitura {#read-only-editors}

Em um editor [`readonly`](../../api/erd-editor-element.md#readonly), a aba abre e mostra todas as planilhas.  
Trocar de planilha, pesquisar, selecionar, rolar, redimensionar colunas e copiar funcionam normalmente, assim como ir para uma verificação a partir da planilha `Checks` com `Enter` ou um clique duplo. As marcas das verificações também aparecem.

Nenhuma célula aceita edição, colagem ou limpeza, e toda célula que nenhuma verificação marca é desenhada sobre o fundo de somente leitura.  
`Add Row`, `Delete Rows`, `Import CSV` e `Export CSV` ficam ocultos, as teclas de linha não fazem nada, e um clique com o botão direito abre o menu do navegador. Uma planilha vazia não mostra nenhuma dica, e a barra de ferramentas não mostra `Undo` nem `Redo`.

## Colaboradores e o arquivo {#collaborators-and-the-file}

O arquivo do diagrama contém as palavras, os termos e os domínios na ordem das planilhas, inclusive a ordem dada por uma classificação, e deixa de fora uma linha que não contém nenhum valor.  
Ele também contém o nome lógico de cada tabela e coluna, se cada nome físico pertence aos dicionários e o vínculo de cada coluna com o domínio enquanto o domínio está listado. As verificações e as marcas são calculadas a partir disso e nunca são salvas.

Em uma [sessão colaborativa](../../api/advanced/collaborative-editing.md), os editores veem as edições de dicionário uns dos outros assim que chegam, inclusive classificações e inserções. Cada um mantém sua própria planilha, sua pesquisa e sua seleção, e os históricos das suas planilhas contêm apenas as suas próprias edições.  
Uma edição ou uma colagem em uma linha que um colaborador removeu nesse meio-tempo não salva nada, e aparece a notificação `Nothing saved: the row was removed`.  
Um editor de uma versão anterior à aba Dicionário salva o diagrama sem seus nomes lógicos, seus vínculos com domínios e seus dicionários — consulte [Misturar versões](../../api/advanced/collaborative-editing.md#mixing-releases).

Um `Import` de Esquema SQL, GraphQL, DBML ou AML mantém os dicionários, um `Import` de JSON os substitui pelos do arquivo, e `Import and Add` não traz nenhum — consulte [Importar arquivos externos](./file-import-export.md#importing-external-files).  
Um agente de codificação edita as palavras, os termos e os domínios, define nomes lógicos e domínios, deriva nomes físicos novamente e lista as verificações pelo servidor MCP — consulte [Dicionários](../../mcp/tools.md#dictionaries) e [Verificações do dicionário](../../mcp/tools.md#dictionary-checks). Ele não tem nenhuma ferramenta para arquivos CSV.
