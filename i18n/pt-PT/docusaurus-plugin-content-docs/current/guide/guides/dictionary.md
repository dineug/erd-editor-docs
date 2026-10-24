---
sidebar_position: 14
description: Manter os domínios, as palavras e os termos do diagrama no separador Dicionário, derivar nomes físicos a partir de nomes lógicos, deixar que um domínio defina o tipo de dados das suas colunas, ler o que a folha Verificações encontra, editar e ordenar as folhas como numa folha de cálculo e importá-las e exportá-las como ficheiros CSV.
---

# Dicionário

O separador Dicionário guarda a norma de nomenclatura do diagrama em três dicionários, cada um numa folha que se edita como numa folha de cálculo:

- `Domains`: tipos de dados com nome, como `Name` para `VARCHAR(100)`. Uma coluna vinculada a um domínio tem o tipo de dados deste.
- `Words`: as palavras normalizadas que compõem os nomes lógicos, cada uma com a abreviatura que um nome físico utiliza para ela, como `Customer` e `CUST`.
- `Terms`: nomes lógicos completos, cada um com o nome físico e o domínio que atribui, como `Customer Name` com `CUST_NM`.

O [nome lógico](./logical-names.md) de uma tabela ou de uma coluna deriva o seu nome físico destes dicionários, e o termo de uma coluna também a pode vincular a um domínio — consulte [Derivar nomes físicos](#deriving-physical-names).  
Uma quarta folha, `Checks`, lista o que os dicionários encontram de errado nos nomes e nos tipos do diagrama e nos próprios dicionários, como uma palavra proibida num nome lógico — consulte [A folha Verificações](#the-checks-sheet).

## Abrir o separador {#opening-the-tab}

Mude para o separador `Dictionary` na barra de ferramentas, o botão com o ícone de um livro entre `Code Generator` e `Settings`, ou escolha `Dictionary` em `Tab` na [pesquisa rápida](./quick-search.md).  
Pode ser o separador em que o diagrama se abre — consulte `Canvas Type` em [Bloqueio](./settings.md#lock).

O separador abre-se na folha `Domains` até escolher outra.  
Sempre que se abre, a folha volta com a seleção e o deslocamento em que a deixou, ou com a primeira célula selecionada numa primeira visita. A sua grelha recebe o foco do teclado, pelo que a escrita e as teclas de seta atuam de imediato.

A folha mostrada, bem como a pesquisa, a seleção, o deslocamento e as larguras das colunas de cada folha, são só seus.  
Nada disto é guardado no ficheiro, registado no histórico de anulação nem partilhado com os colaboradores. É mantido enquanto o editor está aberto, ao mudar de separador e entre os documentos carregados no mesmo editor.

## As folhas {#the-sheets}

A barra no topo contém os quatro botões das folhas, `Domains`, `Words`, `Terms` e `Checks`, e o botão da folha mostrada aparece premido. Cada um mostra uma contagem ao lado do nome: as linhas que a sua folha contém, seja o que for que a pesquisa mostre, ou, na folha `Checks`, o número de verificações, com a cor do respetivo nível — consulte [A folha Verificações](#the-checks-sheet).  
Segue-se o campo de pesquisa — consulte [Pesquisar](#searching). No fim da barra, nas folhas `Domains`, `Words` e `Terms` e não num editor só de leitura, surgem quatro ferramentas: `Add Row`, `Delete Rows`, `Import CSV` e `Export CSV` — consulte [Adicionar e eliminar linhas](#adding-and-deleting-rows) e [Importar e exportar CSV](#importing-and-exporting-csv).  
Num painel estreito ou num idioma de apresentação com textos longos, a barra passa para mais linhas, pelo que todos os botões continuam ao alcance.

Por baixo da grelha, uma linha de estado conta as linhas que a pesquisa deixa, como em `4 rows`, e, enquanto a seleção abrange alguma linha, quantas abrange, como em `1 selected`. Uma linha partilhada por dois intervalos conta uma vez, pelo que esse número corresponde às linhas que o botão `Delete Rows` removeria.  
Os números das linhas, à esquerda, contam as linhas pela ordem em que a folha as mostra, a partir de 1. Uma célula só de leitura, ou seja, todas as células da folha `Checks` e todas as células de um editor só de leitura, é desenhada sobre um fundo cinzento, exceto onde uma verificação a marca.  
Uma folha `Domains`, `Words` ou `Terms` vazia indica `Import a CSV file or add a row`, exceto num editor só de leitura.

As colunas de cada folha, por ordem:

| Folha | Colunas |
| --- | --- |
| `Domains` | `Domain`, `Category`, `Data Type`, `Description` |
| `Words` | `Word`, `Abbreviation`, `English Name`, `Description`, `Synonyms`, `Forbidden Words` |
| `Terms` | `Term`, `Physical Name`, `Domain`, `Description`, `Synonyms` |
| `Checks` | `Type`, `Target`, `Detail` |

O que fazem as células:

- A célula `Data Type` de um domínio escreve-se como o tipo de uma coluna, como `VARCHAR(100)` ou `NUMERIC(15,2)`, e todas as colunas vinculadas ao domínio têm esse tipo — consulte [Domínios e tipos de dados](#domains-and-data-types).
- A célula `Abbreviation` de uma palavra é o que um nome físico utiliza para essa palavra — consulte [A partir das palavras](#from-the-words).
- As células `Synonyms` e `Forbidden Words` de uma palavra listam outras palavras para a mesma coisa, separadas por vírgulas. Os espaços nas extremidades de cada item são removidos, um item vazio é descartado e um item igual à própria palavra é ignorado. Um nome lógico que utilize um deles não compõe nenhum nome físico, e a folha `Checks` assinala-o e indica a palavra a utilizar em vez dele — consulte [O que cada verificação encontra](#what-each-check-finds).
- A célula `Term` de um termo é um nome lógico completo, e a sua célula `Physical Name` é o nome que esse nome lógico atribui — consulte [A partir de um termo](#from-a-term).
- A célula `Domain` de um termo mostra o nome do domínio vinculado ao termo e fica vazia enquanto o termo não tiver nenhum domínio vinculado ou estiver vinculado a um domínio entretanto removido — consulte [O domínio de um termo](#a-terms-domain).
- As células `Category` e `English Name`, todas as células `Description` e a célula `Synonyms` de um termo são observações. Não mudam nada, e nenhuma verificação as lê.

Num [idioma de apresentação da direita para a esquerda](./language-and-theme.md#right-to-left-languages), a barra, o menu da grelha e a linha de estado ficam espelhados, enquanto as folhas e a lista de domínios de um termo se mantêm da esquerda para a direita.

## Derivar nomes físicos {#deriving-physical-names}

Os dicionários podem dar a uma tabela ou a uma coluna o seu nome físico, o nome que o Esquema SQL e o Gerador de código escrevem, a partir do seu nome lógico. Procura-se primeiro um termo cuja célula `Term` seja o nome lógico; caso contrário, o nome é composto a partir das abreviaturas das palavras.  
Por exemplo, com as palavras `Customer` (`CUST`), `Name` (`NM`), `Number` (`NO`), `Order` (`ORD`) e `Date` (`DT`), e o termo `Customer Number` com o nome físico `CUST_NO` e o domínio `Number`, cujo tipo de dados é `INT`:

- O nome lógico `Customer Number` dá a uma coluna o nome `CUST_NO`, vincula-a a `Number` e dá-lhe o tipo `INT`.
- `Order Date` compõe `ORD_DT`.
- Uma tabela com o nome lógico `Customer` recebe o nome `CUST`.

Com a folha `Words` e a folha `Terms` vazias, não se deriva nada.

### Quando um nome é derivado {#when-a-name-is-derived}

Um nome físico é derivado quando se escreve um nome lógico:

- Na tela, quando o editor da célula do nome lógico se fecha com um nome lógico diferente daquele com que abriu, com `Enter`, `Tab`, `Escape` ou um clique noutro sítio. Cada tecla premida escreve apenas o nome lógico — consulte [Escrever um nome lógico](./logical-names.md#writing-a-logical-name).
- De imediato, quando escolhe um termo na lista por baixo da célula — consulte [Completar os nomes dos termos](./logical-names.md#completing-term-names).
- Quando uma colagem escreve uma célula de nome lógico — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).
- Quando [Localizar e substituir](./find-and-replace.md#replacing) substitui um nome lógico, uma correspondência ou todas.
- Quando um agente de programação define um nome lógico.

Só é derivado enquanto o nome físico está vazio ou foi ele próprio derivado — consulte [Nomes escritos por si](#names-of-your-own).  
A escolha de um termo, uma colagem ou uma substituição escreve o nome lógico e o que este deriva num só passo de anulação. Na tela, o nome derivado quando o editor se fecha é um passo próprio, depois da escrita: a primeira anulação retira o nome derivado, com o domínio e o tipo que um termo trouxe, e deixa o nome lógico que escreveu.

Mais tarde, nada volta a ser derivado por si só. Um novo valor na célula `Abbreviation` de uma palavra ou nas células `Physical Name` ou `Domain` de um termo, bem como novas palavras ou novos termos, deixam os nomes já derivados como estão; para isso, utilize [Voltar a derivar os nomes físicos](#derive-physical-names-again). O valor `Data Type` de um domínio é a exceção: chega de imediato às suas colunas.

### A partir de um termo {#from-a-term}

Procura-se primeiro na folha `Terms` um termo cuja célula `Term` seja igual ao nome lógico. Os espaços nas extremidades e a composição Unicode são ignorados, mas distinguem-se maiúsculas de minúsculas, pelo que `customer number` não corresponde a `Customer Number`. De dois termos com o mesmo nome, conta o primeiro da folha.

- O termo atribui o valor da sua célula `Physical Name` ou, enquanto esta estiver vazia, o nome que as suas palavras compõem, como se descreve abaixo, se compuserem algum.
- No caso de uma coluna, o termo também a vincula ao domínio da sua célula `Domain`, enquanto a folha `Domains` o listar, o que dá à coluna o tipo de dados desse domínio — consulte [Vincular uma coluna](#linking-a-column). Fá-lo mesmo quando o termo não atribui nenhum nome. Um termo sem domínio não desvincula nada.
- Uma tabela recebe apenas o nome físico do termo.

### A partir das palavras {#from-the-words}

Sem nenhum termo correspondente, as palavras compõem o nome:

1. O nome lógico é cortado nos espaços e em `_`, `-`, `·` e `/`, e nenhuma palavra atravessa um corte.
2. Cada parte é lida a partir da esquerda, tomando em cada ponto o texto mais longo que a folha `Words` lista, como valor da coluna `Word`, sinónimo ou palavra proibida, sem nunca recuar. Com as palavras `가입`, `가입일` e `일자`, `가입일자` lê-se como `가입일` e `자`, o que deixa `자` como palavra não registada, enquanto `가입 일자` se lê como `가입` e `일자`. Distinguem-se maiúsculas de minúsculas: `member` não é a palavra `Member`.
3. O nome físico junta com `_` o valor `Abbreviation` de cada palavra, tal como foi escrito, como em `ORD_DT`. De duas palavras com o mesmo nome, é a primeira da folha que dá a abreviatura. Não se aplica nenhum limite de comprimento, e as opções `Table Name Case` e `Column Name Case` do Gerador de código não têm qualquer papel.

É tudo ou nada. Se algum trecho for um sinónimo, uma palavra proibida ou um texto que nenhuma palavra lista, ou se uma palavra tiver a célula `Abbreviation` vazia, não é composto nenhum nome, e o nome físico fica como está.

### Nomes escritos por si {#names-of-your-own}

Os dicionários só preenchem um nome físico enquanto este está vazio ou foi ele próprio preenchido por eles. O editor memoriza isto para cada tabela e coluna, embora nada na tela o mostre.

- Um nome que escreve passa a contar como escrito por si: escrever numa célula de nome, substituir o nome de uma tabela ou de uma coluna com Localizar e substituir, colar sobre a célula do nome de uma coluna e uma mudança de nome feita por um agente de programação. Um nome lógico escrito mais tarde deixa-o como está, escreve apenas o nome lógico e não vincula nenhum domínio.
- Limpar o nome devolve-o aos dicionários, uma vez que um nome vazio é sempre derivado.
- Um nome lógico que não deriva nada deixa o nome físico e o seu estado como estavam: um nome vazio continua vazio, e um nome derivado mantém-se como está e continua a pertencer aos dicionários.
- Uma nova tabela ou coluna começa com um nome vazio, pelo que o seu primeiro nome lógico o deriva. Uma coluna de chave externa que uma relação adiciona recebe um nome baseado na sua chave, e esse nome conta como escrito por si — consulte [Nomes das colunas de chave externa](./relationship-editing.md#foreign-key-column-names).
- Os nomes trazidos pela opção `Import` ou `Import and Add` de um ficheiro de Esquema SQL, GraphQL, DBML ou AML, bem como os nomes de um diagrama criado por uma versão anterior ao separador Dicionário, contam como escritos por si, pelo que um nome lógico escrito mais tarde sobre eles não deriva nada.
- Uma [tabela duplicada](./table-related-functions.md#duplicating-tables-and-memos), uma coluna [movida para outra tabela](./table-editing.md#rearranging-and-moving-columns) pela sua pega de arrastamento, uma colagem de tabelas copiadas e a opção `Import and Add` de um ficheiro JSON mantêm o estado de cada nome. Os nomes das colunas coladas em tabelas selecionadas como novas colunas contam como escritos por si, a menos que o nome colado esteja vazio e o nome lógico da coluna derive um.
- [Voltar a derivar os nomes físicos](#derive-physical-names-again) devolve aos dicionários um nome escrito por si, incluindo um importado.

### Duas colunas, um nome {#two-columns-one-name}

Uma coluna não deriva nada quando outra coluna da sua tabela já tem o nome que derivaria. Mantém o seu nome, o seu estado e o seu vínculo ao domínio, e só o seu nome lógico é escrito. Os nomes são comparados sem distinguir maiúsculas de minúsculas e sem os espaços nas extremidades, tal como os nomes das colunas de chave externa.  
Quando uma alteração daria o mesmo nome a duas colunas, como pode acontecer com a ação `Replace All` ou com a opção `Derive Physical Names Again` numa tabela, é a primeira da tabela que o recebe.  
Por exemplo, uma autorreferência em `members` com a chave `MBR_NO` adiciona `MBR_NO_2`, que copia o nome lógico `Member Number`. Com a opção `Derive Physical Names Again`, o nome seria `MBR_NO`, que a chave já tem, pelo que a coluna mantém `MBR_NO_2`.  
As tabelas não têm esta regra: duas tabelas podem derivar o mesmo nome.

## Voltar a derivar os nomes físicos {#derive-physical-names-again}

Utilize a opção `Derive Physical Names Again` depois de alterar a célula `Abbreviation` de uma palavra ou a célula `Physical Name` ou `Domain` de um termo, uma vez que essas alterações, por si só, não mudam nenhum nome. Devolve aos dicionários os nomes que abrange e volta a derivá-los segundo as regras acima, incluindo os nomes escritos por si. Só é oferecida no separador ERD, e não num editor só de leitura:

- O menu de contexto da tabela, logo a seguir a `Focus on this table` ou `Focus on selected tables`. Enquanto a tabela for uma de duas ou mais tabelas selecionadas, a opção `Derive Physical Names Again` abrange todas, seja qual for o ponto da tabela em que clique com o botão direito. Caso contrário, um clique com o botão direito na linha de uma coluna oferece `Derive Physical Name Again`, só para essa coluna, e um no cabeçalho oferece `Derive Physical Names Again`, para o nome da tabela e todas as colunas.
- O menu de contexto da tela, logo a seguir a `Name View`: `Derive Physical Names Again`, para todas as tabelas e colunas do diagrama. É omitida enquanto o diagrama não tiver nenhuma tabela.
- A [pesquisa rápida](./quick-search.md#what-the-palette-lists), como entradas para a coluna com o foco, a tabela com o foco, as tabelas selecionadas e todo o diagrama.

![Mudar a abreviatura de Number de NO para NUM na folha Words, com os nomes físicos a manterem-se MBR_NO e PAY_NO no diagrama, e depois Derive Physical Names Again no menu da tela a transformá-los em MBR_NUM e PAY_NUM, enquanto ORD_NO, que o seu termo atribui, se mantém](/img/demo-derive-physical-names.webp)

Cada tabela e coluna abrangida que tenha um nome lógico volta a ser derivada. Uma coluna também recebe o domínio que o seu termo atribui e, com ele, o tipo desse domínio, que se propaga ao longo das relações enquanto a definição [Sincronização do tipo de dados nas relações](./settings.md#relationship-datatype-sync) está ativada.  
Não mexe numa tabela ou coluna sem nome lógico, nem numa coluna cujo novo nome outra coluna da sua tabela já tem — consulte [Duas colunas, um nome](#two-columns-one-name). Cada uma delas mantém o seu nome e o seu estado, escrito por si ou pertencente aos dicionários, e uma coluna também mantém o seu vínculo ao domínio.  
Um nome lógico que agora não deriva nada deixa o nome físico como está, mas devolve-o aos dicionários, pelo que o próximo nome lógico que escrever o deriva.  
É um único passo de anulação, sejam quantos forem os nomes, vínculos e tipos que altera. Só não regista nenhum passo quando não altera nada, e devolver aos dicionários um nome escrito por si conta como uma alteração, mesmo quando o nome já tem o que eles atribuem.

A própria célula `Physical Name` de um termo não volta a ser composta a partir das palavras alteradas; por isso, edite o termo antes de voltar a derivar.

## Domínios e tipos de dados {#domains-and-data-types}

Uma coluna vinculada a um domínio tem o valor `Data Type` desse domínio. Vincular uma coluna dá-lhe esse tipo de imediato.  
Quando o valor `Data Type` de um domínio muda, seja editado, colado ou importado na folha `Domains`, seja alterado por um colaborador ou por um agente de programação, todas as colunas vinculadas a ele recebem o novo tipo no mesmo passo. Enquanto a definição [Sincronização do tipo de dados nas relações](./settings.md#relationship-datatype-sync) está ativada, cada uma dessas alterações continua ao longo das relações, tal como acontece com uma alteração escrita; enquanto está desativada, só mudam as colunas vinculadas.  
Mudar o nome de um domínio só muda o nome que as células Domínio das colunas mostram.

Uma alteração de tipo feita na folha `Domains` é anulada aí, juntamente com os tipos de coluna que atribuiu — consulte [Folhas do dicionário](./undo-redo.md#dictionary-sheets).  
Uma anulação ou uma ação de refazer no separador ERD que volte a vincular uma coluna a um domínio, ou que reponha uma coluna vinculada a um, dá à coluna o tipo atual do domínio. Uma que reponha outro tipo desvincula a coluna.

### Vincular uma coluna {#linking-a-column}

Uma coluna fica vinculada a um domínio através de:

- A escolha do domínio na célula Domínio da coluna, que Opções de vista → `Domain` mostra, ou, na vista `Logical Names`, na célula do tipo que ocupa o seu lugar — consulte [A célula Domínio](./logical-names.md#the-domain-cell).
- Um nome lógico cujo termo atribui um domínio — consulte [A partir de um termo](#from-a-term). Isto só acontece enquanto o nome é derivado, portanto não num nome escrito por si nem numa coluna cujo nome derivado outra coluna já tem.
- A opção `Derive Physical Name Again` ou `Derive Physical Names Again`, que vincula cada coluna abrangida ao domínio do seu termo.
- Uma relação: uma coluna de chave externa copia o domínio da sua chave, juntamente com o tipo e o nome lógico desta — consulte [Relações identificadoras](./relationship-editing.md#identifying-relationships). Uma chave cuja cópia recebe outro tipo, como acontece com a de uma chave serial, não transmite nenhum domínio.
- A duplicação da sua tabela, ou a sua deslocação para outra tabela pela pega de arrastamento, que mantêm ambas o vínculo. Uma colagem de tabelas ou colunas copiadas só o mantém enquanto este diagrama listar o domínio e o domínio ainda tiver o tipo da coluna copiada, pelo que uma cópia de outro diagrama chega sem vínculo — consulte [Copiar e colar tabelas e notas](./table-related-functions.md#copyingpasting-tables-and-memos). A opção `Import and Add` não vincula nenhuma coluna.
- O nome de um domínio colado numa célula Domínio — consulte [Copiar e colar colunas](./table-editing.md#copyingpasting-columns).

### Desvincular {#unlinking}

- Escrever um tipo na célula `DataType` de uma coluna vinculada, ou aceitar uma sugestão, desvincula a coluna assim que o seu tipo difere do tipo do seu domínio, e a coluna mantém o tipo que escreveu — consulte [Preenchimento automático do tipo de dados](./table-editing.md#datatype-autocomplete). Voltar a escrever o tipo do domínio não a volta a vincular; em vez disso, escolha o domínio na sua célula Domínio. Uma colagem sobre a célula `DataType` e uma alteração de tipo feita por um agente de programação desvinculam da mesma forma.
- Enquanto a definição Sincronização do tipo de dados nas relações está ativada, cada coluna a que uma alteração de tipo chega e cujo novo tipo difere do tipo do seu próprio domínio é desvinculada no mesmo passo, como uma chave externa vinculada a um domínio próprio. [Mapear colunas](./relationship-editing.md#map-columns) desvincula da mesma forma as colunas cujo tipo altera.
- A opção `None` na célula Domínio desvincula a coluna e mantém o seu tipo.
- Alterar ou limpar a célula `Domain` de um termo, ou remover um termo, não altera nenhuma coluna.

### Remover um domínio {#removing-a-domain}

Remover a linha de um domínio deixa as suas colunas com os respetivos tipos, e os seus vínculos mantêm-se. As colunas não mostram nenhum domínio, e a folha `Checks` lista a verificação `Unknown domain` para cada uma delas enquanto a folha `Domains` ainda contiver um domínio. Anular a remoção na folha `Domains` volta a mostrar os vínculos.  
Enquanto o domínio não existir, escrever numa dessas colunas um tipo diferente do tipo do domínio desvincula-a definitivamente, e o mesmo acontece com a opção `None` na sua célula Domínio.  
O ficheiro omite esses vínculos quando é guardado, pelo que o diagrama volta a abrir com essas colunas desvinculadas.

Um termo vinculado a um domínio removido mostra uma célula `Domain` vazia, marcada como `Unknown domain`. `Delete` ou `Backspace` na célula desvincula-o — consulte [O domínio de um termo](#a-terms-domain).

## A folha Verificações {#the-checks-sheet}

A folha `Checks` lista o que as verificações dos dicionários encontram nos dicionários e nas tabelas e colunas do diagrama. As verificações só leem: não alteram nada.  
Cada verificação só é executada enquanto a folha que lê contém uma linha, e as verificações de palavras só enquanto a folha `Words` contém uma palavra com nome, pelo que um diagrama com os dicionários vazios não lista nada.

![Customer Num desenhado a vermelho e Order Stat a âmbar na vista Logical Names, a folha Checks a listar as suas três verificações com uma contagem a vermelho, um duplo clique na linha Forbidden word a voltar a Customer Num no diagrama e a reescrita deste como Member Number, que deixa uma verificação](/img/demo-dictionary-checks.webp)

As suas três colunas são só de leitura:

- A coluna `Type` indica a verificação — consulte [O que cada verificação encontra](#what-each-check-finds).
- A coluna `Target` indica uma palavra, um termo ou um domínio pelo seu nome, uma tabela pelo seu nome e uma coluna como `table.column`, com a tabela e a coluna designadas como a [vista de nomes](./logical-names.md#beyond-the-canvas) as designa, e `unnamed` onde a vista não mostra nenhum nome.
- A coluna `Detail` mostra o que a verificação encontrou e, depois de `→`, o que os dicionários oferecem em vez disso, com várias opções unidas por vírgulas, como `멤버 → 회원`. Um lado vazio indica `—`, como em `— → NUMERIC(15)`.

Primeiro vêm as verificações das palavras, depois as dos termos e as dos domínios e, a seguir, tabela a tabela, cada tabela seguida pelas suas colunas.  
A lista acompanha cada edição à medida que chega, incluindo as de um colaborador e as de um agente de programação, e cada mudança da vista de nomes.  
A contagem do botão `Checks` fica a vermelho enquanto alguma verificação for um erro, a âmbar enquanto todas forem avisos, e esbatida quando não há nenhuma.

As linhas não podem ser editadas, adicionadas, eliminadas, ordenadas, importadas nem exportadas: a barra não mostra ferramentas, um clique com o botão direito não abre o menu da grelha, e Anular e Refazer não fazem nada. Pesquisar, selecionar e copiar funcionam como nas outras folhas.

`Enter` ou um duplo clique numa linha leva ao que esta indica:

- Uma palavra, um termo ou um domínio: o separador mostra a respetiva folha com a célula que a verificação lê selecionada, o nome ou a célula `Domain` de um termo, e com a sua linha como a primeira visível. A pesquisa da folha é limpa se ocultar a linha. Uma linha entretanto removida não leva a lado nenhum.
- Uma tabela ou uma coluna: o separador ERD surge com apenas a tabela selecionada e com o foco na célula que a verificação lê. Essa célula é o nome, o nome lógico ou a célula Domínio, ou, onde a linha não desenha essa célula, a célula desenhada no seu lugar. A tela recebe o foco do teclado, e a vista move-se segundo a regra de [Onde termina um salto](./table-related-functions.md#where-a-jump-lands).

Um duplo clique num cabeçalho, no limite de uma coluna, numa barra de deslocamento ou abaixo das linhas não leva a lado nenhum.  
Um agente de programação lista as mesmas verificações, pela mesma ordem, com `erd_list_checks` — consulte [Verificações do dicionário](../../mcp/tools.md#dictionary-checks).

As outras três folhas marcam as células que as verificações leem, um nome ou a célula `Domain` de um termo, com texto a vermelho ou a âmbar sobre um fundo tingido:

- Vermelho: um nome que outra linha da sua folha tem, a célula `Domain` de um termo vinculado a um domínio removido e uma célula `Term` que utiliza uma palavra proibida.
- Âmbar: uma célula `Term` que utiliza um sinónimo ou uma palavra não registada.

Uma célula recebe o mais forte dos seus níveis. As marcas também aparecem num editor só de leitura, e a própria folha `Checks` não tem cores. Para as marcas na tela ERD, consulte [Marcas na tela](#marks-on-the-canvas).

### O que cada verificação encontra {#what-each-check-finds}

| `Type` | Nível | Deteta | `Detail`, por exemplo |
| --- | --- | --- | --- |
| `Duplicate name` | Erro | Um valor `Word`, `Term` ou `Domain` que outra linha da mesma folha também tem. Cada uma das linhas é listada. | `Member` |
| `Unknown domain` | Erro | Uma coluna ou um termo ainda vinculado a um domínio removido, enquanto a folha `Domains` contém um domínio | O nome do domínio removido |
| `Forbidden word` | Erro | Um trecho de um nome lógico ou de uma célula `Term` que uma palavra lista na sua célula `Forbidden Words` | `커스터머 → 고객` |
| `Unregistered word` | Aviso | Um trecho do nome lógico de uma tabela ou de uma coluna, ou de uma célula `Term`, que nenhuma palavra lista | `자` |
| `Synonym` | Aviso | Um trecho que uma palavra lista na sua célula `Synonyms` | `멤버 → 회원` |
| `Physical name mismatch` | Aviso | Uma tabela ou uma coluna cujo nome lógico corresponde a um termo, mas cujo nome físico não é o que o termo atribui | `mbr_no → MBR_NO` |
| `Domain type mismatch` | Aviso | Uma coluna cujo valor `DataType` não é o valor `Data Type` do domínio a que está vinculada | `INT → NUMERIC(15)` |

- Os nomes são comparados sem os espaços nas extremidades e com distinção entre maiúsculas e minúsculas, pelo que `Member` e `member` são dois nomes, e um nome vazio nunca é um duplicado. As folhas recusam uma edição que daria o mesmo nome a duas linhas, pelo que a verificação `Duplicate name` só surge onde duas edições se cruzaram, como quando dois colaboradores dão nome a linhas ao mesmo tempo, ou num ficheiro editado noutro sítio.
- As verificações de palavras leem um nome como descrito em [A partir das palavras](#from-the-words) e listam cada trecho diferente uma vez por nome. As verificações `Forbidden word` e `Synonym` oferecem a palavra que lista o trecho.
- A verificação `Physical name mismatch` compara o nome, sem os espaços nas extremidades, com a célula `Physical Name` do termo, ou com o que as suas palavras compõem enquanto esta estiver vazia, e não indica nada enquanto o termo não atribuir nenhum nome. Uma coluna de chave externa que copiou o nome lógico da sua chave mostra-a sempre que o seu próprio nome difere do nome do termo, como `members_id → MBR_ID`. A opção `Derive Physical Name Again` corrige-a, a menos que outra coluna tenha esse nome.
- A verificação `Domain type mismatch` nunca resulta de edições num só editor, uma vez que uma coluna vinculada acaba sempre com o tipo do seu domínio. Pode surgir quando um colaborador vincula uma coluna enquanto outro altera o tipo desse domínio, ou num ficheiro escrito noutro sítio. Voltar a escolher o domínio na célula Domínio da coluna dá à coluna o tipo deste, e a opção `None` desvincula-a. Um vínculo a um domínio removido só aparece como `Unknown domain`.

### Marcas na tela {#marks-on-the-canvas}

A tela ERD escreve na cor da respetiva verificação um nome que as verificações assinalam:

- Uma célula de nome lógico, no cabeçalho da tabela ou na linha de uma coluna, fica a vermelho enquanto o seu nome lógico utiliza uma palavra proibida e, caso contrário, a âmbar enquanto utiliza um sinónimo ou uma palavra que a folha `Words` não tem.
- Uma célula de nome físico, no cabeçalho ou numa linha, fica a âmbar enquanto o termo a que o seu nome lógico corresponde atribui outro nome físico.

Só esses dois tipos de célula são marcados, nunca a célula Domínio nem a célula `DataType`, pelo que as verificações `Unknown domain` e `Domain type mismatch` de uma coluna só aparecem na folha `Checks`.  
Uma célula só é marcada pelo que desenha: a vista `Physical Names` só pode marcar nomes físicos, a vista `Logical Names` só nomes lógicos, e a vista `Both Names` marca cada célula pelas suas próprias verificações — consulte a [vista de nomes](./logical-names.md#name-view). Uma célula em branco mantém a cor do seu marcador de posição, e os dicionários vazios não marcam nada.  
No cabeçalho de uma tabela que esteja num [grupo de tabelas](./table-groups.md) com cor, uma marca só mantém a sua cor enquanto continuar legível sobre a cor do grupo; caso contrário, o nome assume o preto ou o branco do próprio cabeçalho.

As marcas aparecem na tela ERD, na [viagem no tempo](./undo-redo.md#time-travel) e na pré-visualização da [disposição automática](./table-related-functions.md#auto-layout), também num editor só de leitura. O separador Visualização, os dois lados do [visualizador de diferenças](./table-related-functions.md#diff-viewer) e uma imagem exportada não desenham nenhuma.  
Acompanham cada alteração no momento em que acontece, seja a um nome, seja a uma palavra, um termo ou um domínio.

## Pesquisar {#searching}

O campo de pesquisa indica `Search` e aparece nas quatro folhas, também num editor só de leitura. Cada folha tem a sua própria pesquisa.  
Uma linha corresponde quando uma das células pesquisadas contém o texto, sem distinguir maiúsculas de minúsculas e ignorando a composição Unicode e os espaços à volta da pesquisa. Uma correspondência nunca se estende por duas células. As células pesquisadas:

- `Domains`: `Domain`, `Data Type` e `Description`.
- `Words`: `Word`, `Abbreviation`, `English Name` e `Description`.
- `Terms`: `Term`, `Physical Name` e `Description`.
- `Checks`: as três, tal como aparecem no idioma de apresentação.

Uma nova pesquisa coloca a seleção na primeira célula e desloca a folha até ao topo.  
Enquanto o campo tem texto, um botão `x` com a dica `Clear search` esvazia-o e deixa o cursor de texto no campo. `Escape` no campo também o esvazia.  
No campo, `Ctrl + Z` (Windows/Linux) ou `⌘ + Z` (Mac) anula o que escreveu, e não a folha, e as teclas de linhas de [Adicionar e eliminar linhas](#adding-and-deleting-rows) são teclas de texto.  
O botão `Add Row` e as inserções limpam primeiro a pesquisa, uma vez que uma linha vazia não corresponde a nenhuma pesquisa. Uma importação mantém-na.

## Selecionar e mover {#selecting-and-moving}

A grelha seleciona como faz uma folha de cálculo:

- Um clique seleciona uma célula, e um arrasto seleciona um intervalo e desloca a folha ao chegar ao seu limite. `Shift + click` expande a seleção a partir da célula ativa, e `Ctrl + click` (Windows/Linux) ou `⌘ + click` (Mac) adiciona outro intervalo.
- Um cabeçalho de coluna seleciona a sua coluna, um número de linha a sua linha, e o canto superior esquerdo todas as células, tal como `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac).
- Num Mac, `Ctrl + click` é um clique com o botão direito — consulte [O menu da grelha](#the-grids-menu).

Com o teclado:

- As teclas de seta movem uma célula e, com `Ctrl` (Windows/Linux) ou `⌘` (Mac) premido, vão até ao limite da folha nessa direção.
- `Home` e `End` vão para a primeira e a última célula da linha e, com `Ctrl` ou `⌘` premido, para a primeira e a última célula da folha.
- `Page Up` e `Page Down` movem um ecrã de linhas.
- Manter `Shift` premido com qualquer das teclas acima expande, em vez disso, a seleção.
- `Tab` e `Shift + Tab` movem para a direita e para a esquerda, e `Shift + Enter` move para cima. `Enter` sozinho edita a célula — consulte [Editar células](#editing-cells).

Quando desaparecem linhas sob a seleção, por uma anulação ou por uma remoção feita por um colaborador, a seleção é trazida de volta para dentro das linhas restantes.

Arraste o limite direito do cabeçalho de uma coluna para a redimensionar, ou faça duplo clique nesse limite para ajustar a coluna ao texto mais largo das linhas visíveis. Nenhuma tecla redimensiona uma coluna.

## Editar células {#editing-cells}

Escrever na célula selecionada substitui o seu valor. `Enter`, `F2` ou um duplo clique edita o valor tal como está, com o cursor de texto no fim.  
Uma célula contém uma só linha, pelo que uma tabulação ou uma quebra de linha colada nela se torna um espaço.

- `Enter` escreve a edição e move para baixo, e `Tab` escreve-a e move para a direita. Com `Shift`, movem para cima ou para a esquerda.
- Um clique noutro sítio, ou o foco do teclado a sair da grelha, também a escreve.
- `Escape` cancela-a.

![Editar a folha Words: escrever NUM sobre uma célula e premir Enter, inserir uma linha com ⌥ + Enter e preenchê-la com Tab, ordenar por Word a partir do menu da grelha e depois pesquisar ord e esvaziar a pesquisa com Esc](/img/demo-dictionary-editing.webp)

Uma edição que deixa o valor como estava não escreve nada, e uma edição escrita é um passo de anulação da sua folha, seja qual for a quantidade de texto escrito.  
`Delete` ou `Backspace`, sem nenhuma edição aberta, esvazia todas as células selecionadas, num só passo.  
Enquanto uma edição está aberta, as teclas de anular e refazer anulam e refazem o que escreveu na célula, e as teclas de linhas escrevem como texto — consulte [Teclas no separador](#keys-on-the-tab).  
Todas as células da folha `Checks`, e todas as células de um editor só de leitura, são só de leitura e não abrem nenhuma edição.

Quando alguma linha de uma edição, de uma colagem ou de uma limpeza é recusada, nada dessa operação é guardado, e uma notificação de erro indica porquê, com o número de linhas e os nomes das três primeiras:

- Um nome que outra linha da folha tem, ou que outra linha da mesma colagem escreve: `Nothing saved: 1 row shares a name with another row (Member)` ou `Nothing saved: 2 rows share a name with another row (…)`. Os nomes são comparados sem os espaços nas extremidades e com distinção entre maiúsculas e minúsculas, pelo que `Member` e `member` são diferentes. Um nome vazio nunca é recusado.
- Uma célula `Domain` de um termo preenchida com um texto que nenhum domínio da folha `Domains` tem: `Nothing saved: 1 row names an unknown domain (…)`.
- Uma linha que um colaborador removeu enquanto a editava: `Nothing saved: the row was removed`.

Uma escrita pode ir além da sua célula:

- Um termo que recebe um valor `Term` enquanto a sua célula `Physical Name` está vazia recebe o nome que as suas palavras compõem, quando compõem algum — consulte [A partir das palavras](#from-the-words). Isto acontece uma vez: o nome não volta a ser composto quando as palavras mudam mais tarde.
- Um novo valor `Data Type` de um domínio altera o tipo de todas as colunas vinculadas ao domínio, no mesmo passo de anulação — consulte [Domínios e tipos de dados](#domains-and-data-types).

### O domínio de um termo {#a-terms-domain}

`Enter`, `F2` ou um duplo clique na célula `Domain` de um termo abre uma lista por baixo da célula, ou por cima dela onde houver mais espaço, com um campo de pesquisa que indica `Domain`.  
A lista contém `None` e depois todos os domínios com nome, pela ordem da folha `Domains`, e o realce começa no domínio vinculado ao termo, ou em `None`. Escrever um carácter na célula abre a lista já pesquisada por esse carácter.

- Escrever restringe a lista aos domínios cujos nomes contêm o texto, sem distinguir maiúsculas de minúsculas, retira `None` e realça a primeira correspondência.
- `↑` e `↓` movem o realce, que dá a volta nas duas extremidades.
- `Enter` ou `Tab` escolhe a linha realçada, e um clique a linha clicada, num só passo de anulação. O termo fica vinculado exatamente ao domínio escolhido, mesmo que seja um de dois domínios com o mesmo nome, e `None` desvincula-o.
- `Escape` ou um clique fora fecha a lista sem escrever o texto introduzido.

Sem nenhum domínio com nome na folha `Domains`, o campo abre-se sem lista.  
Um texto colado vincula o termo ao primeiro domínio listado com esse nome, um texto vazio desvincula-o, e um texto igual ao que a célula mostra mantém o vínculo como está. Qualquer outro nome é recusado — consulte [Editar células](#editing-cells). `Delete` ou `Backspace` na célula desvincula o termo, mesmo de um domínio removido.

## Copiar e colar {#copying-and-pasting}

`Ctrl + C` (Windows/Linux) ou `⌘ + C` (Mac) copia a seleção como texto separado por tabulações, uma linha de texto por linha, tal como as folhas de cálculo o escrevem, pelo que é colado numa folha de cálculo como células. Uma tabulação ou uma quebra de linha dentro de um valor torna-se um espaço.  
Vários intervalos só são copiados em conjunto quando abrangem as mesmas linhas, lado a lado, ou as mesmas colunas, uns por cima dos outros. Caso contrário, não é copiado nada, e aparece a notificação de erro `Nothing copied: the ranges share no rows or columns`.

`Ctrl + V` (Windows/Linux) ou `⌘ + V` (Mac) cola texto separado por tabulações, como células copiadas de uma folha de cálculo, a partir da célula ativa, para baixo e para a direita:

- As aspas são coladas como texto, pelo que uma célula de folha de cálculo que contenha uma quebra de linha não é colada como uma só célula.
- Um único valor preenche todos os intervalos selecionados.
- As linhas para além da última linha são adicionadas como novas linhas, por ordem, pelo que colar numa folha vazia a preenche.
- As colunas para além da última coluna ficam de fora e, depois de o resto ser guardado, a notificação `Columns past the last one weren't pasted` indica-o.
- Uma colagem de várias células seleciona depois o bloco que escreveu.

Uma colagem é um passo de anulação, incluindo as linhas que adiciona, e é recusada por inteiro perante um nome duplicado ou um domínio desconhecido — consulte [Editar células](#editing-cells).  
Uma cópia, uma colagem ou uma limpeza de mais de um milhão de células não faz nada, e aparece a notificação de erro `Nothing done: the selection covers too many cells`.  
Cortar, com `Ctrl + X` (Windows/Linux) ou `⌘ + X` (Mac), não faz nada numa folha. Copiar e colar neste separador nunca chegam ao diagrama e, enquanto a edição de uma célula está aberta, atuam sobre o texto da célula.

## Adicionar e eliminar linhas {#adding-and-deleting-rows}

O botão `Add Row` adiciona uma linha vazia no fim da folha. Limpa a pesquisa, seleciona a primeira célula da nova linha e dá o foco do teclado à grelha, pelo que escrever preenche essa célula.  
O botão `Delete Rows` remove todas as linhas que a seleção abrange, em qualquer coluna, e uma anulação repõe-nas todas nos seus lugares. A sua dica indica a tecla que faz o mesmo.

Com o foco do teclado na grelha e nenhuma célula a ser editada:

- `Alt + Enter` (Windows/Linux) ou `⌥ + Enter` (Mac) insere abaixo da seleção tantas linhas vazias quantas as que esta abrange.
- `Alt + Shift + Enter` (Windows/Linux) ou `⌥ + Shift + Enter` (Mac) insere-as acima.
- `Alt + Backspace` ou `Alt + Delete` (Windows/Linux), ou `⌥ + Backspace` ou `⌥ + Delete` (Mac), elimina as linhas que a seleção abrange.

Fazem o mesmo que as opções de inserir e eliminar linhas do menu da grelha — consulte [O menu da grelha](#the-grids-menu). Uma inserção limpa a pesquisa e coloca as novas linhas imediatamente acima da primeira linha que a seleção abrange, ou imediatamente abaixo da última. Seleciona-as na primeira coluna, com a primeira delas ativa, e é um passo de anulação.

Estas teclas são as associações `Add Column` e `Remove Column` do separador [Atalhos](./settings.md#shortcuts), pelo que um host que reatribua essas associações com [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap) também muda estas teclas. `Alt + Shift + Enter` é a tecla de `Add Column` com `Shift` acrescentado, e não tem uma linha própria aí.  
Numa edição aberta e no campo de pesquisa são teclas de texto, pelo que, num Mac, `⌥ + Backspace` apaga uma palavra. Na folha `Checks` e num editor só de leitura não fazem nada. Neste separador nunca adicionam nem removem uma coluna de uma tabela.  
No Obsidian chegam ao separador mesmo quando uma tecla de atalho do Obsidian utiliza a mesma tecla.

Uma linha nunca preenchida, ou uma linha da qual se esvaziaram todos os valores, aparece na sua folha e chega aos colaboradores, mas o ficheiro omite-a, pelo que desaparece quando o diagrama volta a ser aberto.

## O menu da grelha {#the-grids-menu}

Clique com o botão direito numa célula das folhas `Domains`, `Words` ou `Terms` para abrir o menu da grelha. Uma célula fora da seleção passa primeiro a ser a seleção.  
Um clique com o botão direito abaixo da última linha ou à direita da última coluna abre-o sobre a seleção tal como está, pelo que numa folha vazia se abre em qualquer ponto abaixo dos cabeçalhos. A tecla de menu ou `Shift + F10` abre-o para a célula ativa.

- `Insert 1 row above`, `Insert 1 row below` e `Delete 1 row`, cada uma com a contagem das linhas que a seleção abrange, como em `Insert 3 rows above`, e com a sua tecla à direita — consulte [Adicionar e eliminar linhas](#adding-and-deleting-rows).
- `Sort by <column>, ascending` e `Sort by <column>, descending`, com o nome da coluna em que clicou com o botão direito, como em `Sort by Word, ascending` — consulte [Ordenar](#sorting). São omitidas à direita da última coluna.
- `Import CSV` e `Export CSV`, que fazem o mesmo que os botões da barra — consulte [Importar e exportar CSV](#importing-and-exporting-csv).

Sem nenhuma linha visível, numa folha vazia ou com uma pesquisa que não corresponde a nada, só aparecem `Insert 1 row below`, `Import CSV` e `Export CSV`.  
A folha `Checks` e um editor só de leitura abrem, em vez disso, o menu do próprio navegador, tal como um clique com o botão direito num cabeçalho ou numa barra de deslocamento.  
O menu fecha-se com uma escolha, com `Escape`, ao premir noutro ponto do separador, quando a seleção ou a folha muda e quando as linhas da folha mudam, por uma edição sua ou de um colaborador.

## Ordenar {#sorting}

As opções `Sort by <column>, ascending` e `Sort by <column>, descending` reordenam as próprias linhas da folha, e não apenas a vista. A nova ordem é guardada no ficheiro, vista pelos colaboradores e seguida por `Export CSV`, e uma anulação repõe a ordem anterior.  
As linhas são comparadas pelo texto que a célula mostra, a célula `Domain` de um termo pelo nome do domínio, pela ordem alfabética do idioma de apresentação, com os números comparados pelo valor, pelo que `2` vem antes de `10`. As células vazias ficam no fim em ambos os sentidos, e as linhas consideradas iguais mantêm a sua ordem. Ordenar uma folha que já está nessa ordem não regista nada.  
A pesquisa fica como estava, tal como a seleção, cujas células passam a conter outras linhas.

## Importar e exportar CSV {#importing-and-exporting-csv}

Cada uma das folhas `Domains`, `Words` e `Terms` é importada de um ficheiro CSV e exportada para um. Estes ficheiros são próprios do separador Dicionário: os submenus `Import` e `Export` do menu de contexto da tela não os leem nem os escrevem — consulte [Importar ou exportar ficheiros](./file-import-export.md).

### Importar {#importing}

A opção `Import CSV`, na barra ou no menu da grelha, abre o seletor de ficheiros do próprio navegador para ficheiros `.csv`, e não a caixa de diálogo de importação do host. Escolher novamente o mesmo ficheiro volta a importá-lo.  
O ficheiro entra no dicionário que o seu cabeçalho indica, seja qual for a folha mostrada, e o separador mostra então essa folha e dá o foco do teclado à sua grelha. A folha mantém a sua pesquisa, a sua seleção e o seu deslocamento, pelo que as linhas que a pesquisa oculta, ou as linhas adicionadas abaixo da área visível, ficam fora de vista.  
O ficheiro é lido como UTF-8, com ou sem marca de ordem de bytes, ou como EUC-KR quando não é UTF-8 válido, como acontece com os ficheiros mais antigos da norma de dados públicos.

![Abrir o separador Dicionário a partir da barra de ferramentas e depois importar domínios, palavras e termos com Import CSV, com cada ficheiro a mudar o separador para a sua própria folha e a indicar o que adicionou](/img/demo-dictionary-import.webp)

Como as linhas entram:

- Cada linha com nome atualiza a linha da folha com esse nome, nos campos para os quais o ficheiro tem colunas. As colunas que faltam no ficheiro deixam esses campos como estão. Os nomes são comparados sem os espaços nas extremidades e com distinção entre maiúsculas e minúsculas.
- Os nomes que a folha não tem são adicionados depois da sua última linha, pela ordem do ficheiro.
- Uma importação nunca remove uma linha.
- Uma linha com o nome vazio é ignorada. Quando o ficheiro contém um nome duas vezes, prevalece a linha posterior, e a anterior conta como ignorada. As linhas de texto em branco não contam como linhas.
- O domínio de um termo é encontrado pelo nome, o primeiro domínio com esse nome, e um nome que nenhum domínio tem deixa o termo sem vínculo; por isso, importe primeiro os domínios.

Uma importação é um passo de anulação dessa folha.  
A notificação indica então, por exemplo, `1 added · 1 updated · 2 skipped`. Uma linha igual à da folha não conta como adicionada nem como atualizada, pelo que importar novamente o mesmo ficheiro não altera nada nem regista nenhum passo.  
Enquanto os termos do ficheiro indicarem domínios que o diagrama não tem, uma segunda linha indica os três primeiros, como em `4 unknown domains: 연월일, 금액, 번호`.  
Um ficheiro cujo cabeçalho não corresponde a nenhuma estrutura, ou corresponde a duas, não traz nada, e aparece a notificação de erro `Couldn't read this file as words, terms or domains`.

### Estruturas de ficheiro {#file-layouts}

Cada dicionário lê duas estruturas. A primeira é a do próprio editor, que `Export CSV` escreve, com os nomes dos campos como cabeçalho:

| Dicionário | Cabeçalho | Um ficheiro precisa de |
| --- | --- | --- |
| Palavras | `name,abbreviation,englishName,description,synonyms,forbiddenWords` | `name`, `abbreviation` |
| Termos | `name,physicalName,domain,description,synonyms` | `name`, `physicalName` |
| Domínios | `name,category,dataType,description` | `name`, `dataType` |

As colunas podem vir por qualquer ordem, a coluna `domain` de um termo contém o nome do domínio, e qualquer outra coluna é ignorada. No cabeçalho, distinguem-se maiúsculas de minúsculas, e as células são lidas exatamente como estão escritas, incluindo os espaços.

A segunda é a estrutura dos ficheiros da norma de dados públicos da Coreia (공통표준):

| Dicionário | Um ficheiro precisa de | Também lidos |
| --- | --- | --- |
| Palavras | `공통표준단어명` | `공통표준단어영문약어명` (abreviatura), `공통표준단어 영문명` (nome em inglês), `공통표준단어 설명` (descrição), `이음동의어 목록` (sinónimos), `금칙어 목록` (palavras proibidas) |
| Termos | `공통표준용어명` | `공통표준용어영문약어명` (nome físico), `공통표준도메인명` (domínio, pelo nome), `공통표준용어설명` (descrição), `용어 이음동의어 목록` (sinónimos) |
| Domínios | `공통표준도메인명`, `데이터타입` | `공통표준도메인분류명` (categoria), `공통표준도메인설명` (descrição), `데이터길이`, `데이터소수점길이` |

As colunas `데이터타입`, `데이터길이` e `데이터소수점길이` de um domínio juntam-se num só tipo de dados: `NUMERIC(15,2)`, `CHAR(8)`, o tipo sozinho onde não há comprimento, como `DATE`, e uma escala de 0 omitida, como em `NUMERIC(15)`.  
Nestes ficheiros, os espaços nas extremidades das células são removidos, e as outras colunas, como o histórico de revisões, são ignoradas.  
Em qualquer das estruturas, os espaços no nome de um cabeçalho não contam.

### Exportar {#exporting}

A opção `Export CSV`, na barra ou no menu da grelha, guarda a folha mostrada na estrutura do próprio editor: todas as linhas pela ordem da folha, seja o que for que a pesquisa mostre, com o domínio de um termo escrito pelo seu nome, ou deixado vazio no caso de um domínio removido.  
O ficheiro é UTF-8 com marca de ordem de bytes e finais de linha CRLF, e só um campo que contenha aspas, uma vírgula ou uma quebra de linha é colocado entre aspas. Abre-se numa folha de cálculo e volta a ser importado com as mesmas linhas.  
Recebe o nome `<database name>-<timestamp>-words.csv`, `-terms.csv` ou `-domains.csv`, e é guardado da mesma forma que as outras exportações do editor — consulte [Exportar](./file-import-export.md#exporting).

A folha `Checks` não tem exportação, e um editor só de leitura não oferece importação nem exportação.

## Anular e refazer {#undo-and-redo}

As folhas `Domains`, `Words` e `Terms` mantêm cada uma o seu próprio histórico de anulação, separado do histórico do diagrama. Neste separador, `Ctrl + Z` e `Ctrl + Shift + Z` (Windows/Linux) ou `⌘ + Z` e `⌘ + Shift + Z` (Mac), e os botões `Undo` e `Redo` da barra de ferramentas, atuam sobre a folha mostrada, e a barra de ferramentas não mostra o botão `Time Travel`. Na folha `Checks` não fazem nada.  
A anulação no separador ERD nunca retira a edição de uma folha — consulte [Folhas do dicionário](./undo-redo.md#dictionary-sheets).

## Teclas no separador {#keys-on-the-tab}

Enquanto o foco do teclado está no separador, atuam estes atalhos do editor — consulte [Atalhos](./settings.md#shortcuts):

- `Search`, `Ctrl + K` (Windows/Linux) ou `⌘ + K` (Mac), abre a [pesquisa rápida](./quick-search.md).
- `Toggle Explorer`, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), muda para o separador ERD e abre o [explorador](./explorer.md#opening-and-closing) na sua pesquisa.
- `Undo` e `Redo` atuam sobre a folha mostrada — consulte [Anular e refazer](#undo-and-redo).
- `Add Column` e `Remove Column` inserem e eliminam linhas — consulte [Adicionar e eliminar linhas](#adding-and-deleting-rows).

Enquanto a edição de uma célula está aberta, incluindo a lista de domínios de um termo, `Search` e `Toggle Explorer` não fazem nada, pelo que o texto escrito não se perde.

Todos os outros atalhos do editor ficam no separador e nunca chegam à tela: `Alt + N` (Windows/Linux) ou `⌥ + N` (Mac) não adiciona nenhuma tabela, e `Delete` e `Backspace` não eliminam nada na tela.  
Em vez disso, as teclas próprias da grelha atuam sobre a folha: `Enter` edita a célula, `Delete` e `Backspace` limpam as células selecionadas, `Ctrl + A` (Windows/Linux) ou `⌘ + A` (Mac) seleciona todas as células, e `Escape` cancela uma edição, fecha o menu da grelha ou esvazia o campo de pesquisa. Copiar, cortar e colar também ficam no separador — consulte [Copiar e colar](#copying-and-pasting).

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), o separador abre-se e mostra todas as folhas.  
Mudar de folha, pesquisar, selecionar, deslocar, redimensionar colunas e copiar funcionam como habitualmente, tal como ir para uma verificação a partir da folha `Checks` com `Enter` ou um duplo clique. As marcas das verificações também aparecem.

Nenhuma célula aceita uma edição, uma colagem ou uma limpeza, e todas as células que nenhuma verificação marca são desenhadas sobre o fundo das células só de leitura.  
Os botões `Add Row`, `Delete Rows`, `Import CSV` e `Export CSV` ficam ocultos, as teclas de linhas não fazem nada, e um clique com o botão direito abre o menu do navegador. Uma folha vazia não mostra nenhuma indicação, e a barra de ferramentas não mostra os botões `Undo` nem `Redo`.

## Os colaboradores e o ficheiro {#collaborators-and-the-file}

O ficheiro do diagrama guarda as palavras, os termos e os domínios pela ordem das suas folhas, incluindo a de uma ordenação, e omite uma linha que não tenha nenhum valor.  
Guarda também o nome lógico de cada tabela e coluna, se cada nome físico pertence aos dicionários e o vínculo de cada coluna ao domínio enquanto o domínio estiver listado. As verificações e as marcas são calculadas a partir destes dados e nunca são guardadas.

Numa [sessão colaborativa](../../api/advanced/collaborative-editing.md), os editores veem as edições dos dicionários uns dos outros à medida que chegam, incluindo ordenações e inserções. Cada um mantém a sua própria folha, pesquisa e seleção, e os históricos das suas folhas só contêm as suas próprias edições.  
Uma edição ou uma colagem sobre uma linha que um colaborador entretanto removeu não guarda nada, e aparece a notificação `Nothing saved: the row was removed`.  
Um editor de uma versão anterior ao separador Dicionário guarda o diagrama sem os seus nomes lógicos, vínculos a domínios e dicionários — consulte [Misturar versões](../../api/advanced/collaborative-editing.md#mixing-releases).

Uma importação de Esquema SQL, GraphQL, DBML ou AML com `Import` mantém os dicionários, uma importação de JSON com `Import` substitui-os pelos do ficheiro, e `Import and Add` não traz nenhum — consulte [Importar ficheiros externos](./file-import-export.md#importing-external-files).  
Um agente de programação edita as palavras, os termos e os domínios, define nomes lógicos e domínios, volta a derivar nomes físicos e lista as verificações através do servidor MCP — consulte [Dicionários](../../mcp/tools.md#dictionaries) e [Verificações do dicionário](../../mcp/tools.md#dictionary-checks). Não tem nenhuma ferramenta para ficheiros CSV.
