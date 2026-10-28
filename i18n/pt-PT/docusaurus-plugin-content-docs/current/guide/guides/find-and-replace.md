---
sidebar_position: 10
description: Pesquisar nomes de tabelas, colunas, índices e grupos de tabelas, nomes lógicos, comentários e notas a partir do topo do explorador, percorrer as correspondências na respetiva árvore e na tela e substituir uma correspondência ou todas.
---

# Localizar e substituir

Localiza texto em todo o diagrama, leva-o até cada correspondência na tela ERD e substitui uma correspondência ou todas.  
Pesquisa oito tipos de texto: nomes de tabelas, comentários de tabelas, nomes de colunas, comentários de colunas, notas, nomes de índices, nomes de grupos de tabelas e os [nomes lógicos](./logical-names.md) de tabelas e colunas — consulte [O que é pesquisado](#what-it-searches).

Fica no topo do [explorador](./explorer.md), o painel ancorado à esquerda da tela ERD, entre a barra de título do explorador e a respetiva árvore. Não tem título próprio. De cima para baixo, contém:

- O campo Localizar, com as três [opções](#options) dentro dele, no final, e a seta `Toggle Replace` antes dele.
- A linha `Replace`, inicialmente recolhida — consulte [Substituir](#replacing).
- A contagem, depois as setas para cima e para baixo que percorrem as correspondências, e o botão `Search In` de três pontos.
- Os [tipos de texto](#what-it-searches), que o botão `Search In` expande.

Enquanto o campo Localizar tem texto, a árvore do explorador mostra as correspondências — consulte [Os resultados](#the-results).  
Numa tela baixa, a pesquisa mantém toda a sua altura e a árvore por baixo dela ocupa o espaço restante e desloca-se.

![Abrir Localizar e substituir no explorador com ⌘ + F, percorrer as seis correspondências de member e depois, com Preserve Case ativado, substituir as seis por user (⌘ + Enter)](/img/demo-find-and-replace.webp)

## Abrir e fechar {#opening-and-closing}

`Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), e a entrada `Toggle Explorer` na [pesquisa rápida](./quick-search.md) ou no menu de contexto da tela, abrem o explorador na sua pesquisa. O cursor de texto vai para o campo Localizar com o respetivo texto selecionado, e a consulta volta a ser pesquisada sem nenhuma correspondência atual.  
O botão `Explorer` da barra de ferramentas apenas abre ou fecha o painel. Não coloca o cursor de texto no campo Localizar e deixa a consulta e a correspondência atual como estavam.  
Quando a tecla apenas devolve o cursor de texto a um explorador já visível, como acontece enquanto a pesquisa rápida ou uma das cinco caixas de diálogo de [Caixas de diálogo ao seu lado](./explorer.md#dialogs-beside-it) está aberta, a correspondência atual mantém-se atual.

O fecho do explorador, o que a tecla e as duas entradas `Toggle Explorer` fazem enquanto está aberto e as caixas de diálogo que fecham são explicados em [Abrir e fechar](./explorer.md#opening-and-closing), na página do explorador.  
[Quando se afasta](./explorer.md#when-it-stands-aside) explica como outro separador e o modo zen o ocultam e como o visualizador de diferenças, a viagem no tempo e a pré-visualização da disposição automática o ocultam e impedem que se abra. [Ao lado da tela](./explorer.md#beside-the-canvas) explica o caso de um editor demasiado estreito para ele.

Reabrir mantém a última consulta, bem como o texto de substituição, as [opções](#options), os [tipos de texto](#what-it-searches) que estavam ativados e o estado expandido ou recolhido da linha `Replace` e dos tipos de texto.  
São mantidos enquanto o editor está aberto e não são guardados no documento. Um editor acabado de abrir começa com todas as opções desativadas, a linha `Replace` e os tipos de texto recolhidos e apenas os quatro tipos de nome e `Logical names` ativados — consulte [O que é pesquisado](#what-it-searches).

## A barra de localização do navegador {#the-browsers-find-bar}

Enquanto o editor tem o foco do teclado, `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) pertence-lhe em todos os separadores e também nos seus próprios campos de texto, pelo que a barra de localização do navegador não se abre.  
A tecla passa para o navegador ou para o host enquanto está aberto o visualizador de diferenças, a viagem no tempo ou a pré-visualização da disposição automática, e enquanto o foco está fora do editor.

- Aplicação web e Google Drive: a barra de localização do navegador só se abre nesses dois casos.
- VS Code: a extensão mantém desativado o widget de localização do próprio VS Code no ERD Editor, pelo que a tecla nunca abre nenhum aí.
- Obsidian: a tecla chega ao editor sempre que o separador do diagrama está ativo, em vez do comando `Search current file` do Obsidian.
- IDE da JetBrains: se o mapa de teclas do IDE reservar `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac) para si, abra a pesquisa a partir da entrada `Toggle Explorer` na pesquisa rápida ou no menu de contexto da tela, ou abra o explorador com o botão `Explorer` da barra de ferramentas e clique no campo Localizar.

Uma página que incorpora o editor pode mudar a tecla ou removê-la — consulte [Alterar o atalho](#changing-the-shortcut).

## O que é pesquisado {#what-it-searches}

Oito botões escolhem os tipos de texto pesquisados, por esta ordem: `Table names`, `Table comments`, `Column names`, `Column comments`, `Memos`, `Index names`, `Table group names` e `Logical names`.  
Inicialmente estão recolhidos. O botão `Search In`, no fim da linha da contagem, expande-os por baixo dessa linha e volta a recolhê-los, e está realçado enquanto estão visíveis.  
Um botão de tipo realçado está ativado. Clique num deles para o ativar ou desativar, e a pesquisa é executada de novo. Com os oito desativados, não se encontra nada.

De início, a pesquisa abre com os quatro tipos de nome, `Table names`, `Column names`, `Index names` e `Table group names`, e com `Logical names`, pelo que uma mudança de nome não chega aos comentários nem às notas, a menos que os ative.  
`Logical names` é um único tipo para os nomes lógicos tanto de tabelas como de colunas.  
Os nomes de índices são os nomes dos índices do separador `Indexes` do painel [Propriedades da tabela](./table-related-functions.md#indexes), e não as chaves `PK_` e `UQ_` listadas acima deles.

Não é pesquisado mais nada: nem os tipos de dados, o domínio de uma coluna, os valores predefinidos, as colunas de um índice, o nome da base de dados, o [Esquema SQL](./schema-sql.md) com os respetivos scripts `Before tables` e `After tables`, o código gerado, nem as folhas do separador [Dicionário](./dictionary.md), que têm uma [pesquisa própria](./dictionary.md#searching).  
Os nomes lógicos são pesquisados seja o que for que a [vista de nomes](./logical-names.md#name-view) desenhe, incluindo a vista `Physical Names`, em que a tela não mostra nenhum. Um comentário oculto por uma [opção de vista das tabelas](./table-related-functions.md#table-view-options) também continua a ser pesquisado. As notas ocultadas com Opções de vista → `Memos` e os [grupos de tabelas](./table-groups.md#hiding-groups) ocultados com Opções de vista → `Table Groups` não o são, mesmo com o respetivo botão ativado, pelo que a ação `Replace All` nunca reescreve uma nota nem muda o nome de um grupo que não consegue ver.

## Opções {#options}

Três interruptores dentro do campo Localizar, no final, alteram a forma como a consulta encontra correspondências. O nome de cada um aparece na respetiva dica, e ficam realçados enquanto estão ativados. Os três começam desativados, e alterar um deles volta a pesquisar.

- `Match Case`: quando está desativado, a correspondência não distingue maiúsculas de minúsculas.
- `Match Whole Word`: uma correspondência só conta quando não continua para dentro de uma palavra de nenhum dos lados. As letras, os algarismos e os sinais diacríticos de qualquer sistema de escrita contam como caracteres de palavra, tal como o sublinhado. Por isso, `user` corresponde em `user id` e `user.id`, mas não dentro de `users`, `user_id` ou `superuser`. Uma extremidade da consulta que não seja ela própria um carácter de palavra, como o ponto em `.id`, não precisa de limite desse lado.
- `Use Regular Expression`: a consulta é uma expressão regular de JavaScript, sempre no modo Unicode, pelo que `\p{L}` funciona. `^` e `$` correspondem ao início e ao fim de cada linha de um comentário ou de uma nota com várias linhas, e `.` não atravessa uma quebra de linha. As sequências de escape que se escrevem muitas vezes em nomes, como `\_` e `\-`, são aceites.

Uma expressão regular que não é possível analisar, como `user(`, não encontra nada: a contagem indica `Invalid regular expression` a vermelho e o campo Localizar fica com um contorno vermelho.  
As opções `Match Case` e `Match Whole Word` também se aplicam a uma expressão regular. Uma correspondência de comprimento zero, como `^` sozinho, nunca é listada.

O texto simples é pesquisado à medida que escreve. Uma expressão regular é pesquisada quando a escrita faz uma pausa, ou de imediato quando prime `Enter`, um botão de navegação, `Replace` ou `Replace All`, ou escolhe uma linha que contém uma correspondência.  
A pesquisa não tem limite de tempo, pelo que uma expressão regular com muito retrocesso pode deixar o editor sem resposta até terminar.

Um quarto interruptor, `Preserve Case`, fica dentro do campo `Replace`, no final, pelo que só aparece enquanto a linha `Replace` está expandida. Começa desativado. Não altera nada do que é encontrado, apenas a forma como as ações `Replace` e `Replace All` escrevem a substituição — consulte [Substituir](#replacing). Ativá-lo ou desativá-lo não pesquisa nada, e a correspondência atual mantém-se atual.

## Os resultados {#the-results}

A contagem, no início da linha por baixo dos campos, indica onde se encontra. Está vazia enquanto o campo Localizar está vazio.

| Contagem | Quando |
| --- | --- |
| `No results` | Nada corresponde. |
| `12 matches` | Antes de passar para uma delas; `1 match` quando há só uma. |
| `3 of 12` | A terceira correspondência é a atual. |
| `Invalid regular expression` | Não é possível analisar a expressão regular. |
| `Replaced 12 matches` | A ação `Replace All` alterou esse número de correspondências; `Replaced 1 match` quando é só uma. |
| `No changes` | A ação `Replace All` não alterou nada. |
| `No more matches` | Uma série de ações `Replace` voltou ao ponto onde começou — consulte [Substituir](#replacing). |

As mensagens `Replaced …`, `No changes` e `No more matches` dão lugar à contagem na próxima pesquisa ou no próximo movimento, incluindo a pesquisa iniciada por uma edição ou por uma anulação.

Enquanto o campo Localizar tem texto, a [árvore](./explorer.md#the-tree) do explorador mostra os resultados em vez do diagrama completo: apenas as linhas que contêm uma correspondência e as linhas acima delas. Quando nada corresponde, ou não é possível analisar a expressão regular, fica vazia. Eliminar a consulta repõe a árvore completa, recolhida tal como estava antes.

- As pastas `Tables`, `Table Groups` e `Memos` só aparecem quando contêm uma correspondência, e a contagem de cada pasta é o número de linhas diretamente por baixo dela nos resultados.
- Na pasta `Tables` aparecem as tabelas que contêm uma correspondência, por ordem de nome, nunca por nome lógico. Por baixo de cada tabela aparecem uma linha por cada correspondência no seu comentário, depois uma pasta `Columns` com as colunas que contêm uma correspondência, pela ordem das colunas, cada uma com uma linha por cada correspondência no seu comentário, e depois uma pasta `Indexes` com os índices cujo nome corresponde. Não há pasta `Foreign Keys`.
- Na pasta `Table Groups` aparecem os grupos cujo nome corresponde, por ordem de nome, sem as respetivas tabelas. Uma tabela encontrada aparece na pasta `Tables`.
- Na pasta `Memos` aparecem as notas que contêm uma correspondência, pela ordem do documento, cada uma apresentada pela sua primeira linha e com uma linha por cada correspondência que contém.

Uma correspondência num nome é realçada na própria linha desse nome, pelo que um nome que contém a consulta duas vezes é uma só linha com dois realces. Uma correspondência no nome lógico de uma tabela ou coluna também fica na linha dessa tabela ou coluna, nunca numa linha própria.  
Essas linhas nomeiam a tabela ou a coluna como a [vista de nomes](./logical-names.md#beyond-the-canvas) a mostra, e cada um dos dois nomes que uma linha pode mostrar realça apenas as suas próprias correspondências. Uma linha encontrada apenas no nome que a sua vista omite, o nome lógico na vista `Physical Names` ou o nome na vista `Logical Names`, acrescenta esse nome a seguir ao que mostra, esbatido como na vista `Both Names`, com a correspondência realçada. Quando o nome que mostra também contém uma correspondência, a linha mostra apenas esse nome, pelo que as correspondências no nome que a sua vista omite são contadas e percorridas, mas não realçadas.  
Uma correspondência num comentário ou numa nota tem uma linha própria: um balão de fala para um comentário de tabela ou de coluna, ou uma nota autocolante para uma nota, e depois um excerto do texto com a correspondência realçada. Um texto longo é cortado com `…` e as quebras de linha aparecem como espaços. Passe o ponteiro sobre a linha para ver o texto completo.  
Todas as outras linhas têm o mesmo aspeto que fora de uma pesquisa: uma coluna mostra o seu tipo de dados, um índice as suas colunas e um nome vazio indica `unnamed`.

Todas as linhas com linhas por baixo aparecem expandidas quando uma pesquisa começa. Uma linha que recolha, ou que o botão `Collapse All` recolha, fica recolhida até uma correspondência por baixo dela se tornar a atual, ou até mudar a consulta, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou um tipo de texto, ou até a pesquisa ser aberta de novo com a tecla ou com uma entrada `Toggle Explorer`.  
A linha da correspondência atual fica realçada e é deslocada até ficar visível. A árvore lista todas as correspondências, sejam quantas forem.  
As correspondências são percorridas pela ordem da árvore: tabela a tabela, o nome lógico, o nome e o comentário da tabela, depois o nome lógico, o nome e o comentário de cada uma das suas colunas pela ordem das colunas e depois os nomes dos seus índices; depois, os nomes dos grupos de tabelas; depois, as notas.

Os resultados acompanham o documento enquanto o explorador está visível. Quando as edições fazem uma pausa, qualquer alteração aos textos pesquisados volta a pesquisar, e a correspondência atual mantém-se atual se ainda existir. Isto abrange um nome, um nome lógico, um comentário ou o texto de uma nota editados, uma tabela, coluna, índice, nota ou grupo de tabelas adicionados ou removidos, uma coluna movida e as notas ou os grupos de tabelas ocultados ou mostrados com Opções de vista, o que retira as suas correspondências da árvore ou as repõe. Uma edição na tela, uma ação de anular ou refazer, uma importação e uma edição de um colaborador ou de um agente de programação contam todas. Selecionar, mover tabelas, notas ou grupos na tela, deslocar a vista, fazer zoom e passar o ponteiro não contam.  
Também não conta mudar a vista de nomes, o que não altera nenhum texto que a pesquisa lê: as mesmas correspondências mantêm-se e as linhas assumem os nomes que a nova vista mostra.  
As edições feitas enquanto o explorador está fechado ou fora de vista são pesquisadas assim que volta a aparecer.

## Ir para uma correspondência {#going-to-a-match}

A tecla `Enter` no campo Localizar vai para a correspondência seguinte, e `Shift + Enter` para a anterior. Os botões de seta para cima e para baixo a seguir à contagem fazem o mesmo; as suas dicas indicam `Previous Match (Shift+Enter)` e `Next Match (Enter)`, e estão desativados enquanto não há nenhuma correspondência.  
O movimento dá a volta nas duas extremidades. Nenhuma correspondência é atual até ao primeiro movimento, pelo que premir `Enter` pela primeira vez leva à primeira correspondência e premir `Shift + Enter` pela primeira vez leva à última.

Um clique numa linha dos resultados, ou premir `Enter` ou `Space` com o foco do teclado nela, faz uma destas coisas:

- Uma linha cujo próprio nome ou nome lógico contém uma correspondência vai para a sua primeira correspondência, a do nome lógico antes da do nome.
- Uma linha que mostra um excerto de um comentário ou de uma nota vai para essa correspondência.
- Qualquer outra linha, como uma tabela cujo nome e nome lógico não correspondem ou a linha da própria nota, vai para o que a linha representa e deixa a correspondência atual como está — consulte [Ir para uma linha](./explorer.md#going-to-a-row).
- Uma pasta recolhe-se ou expande-se.

Sempre que uma correspondência se torna a atual, a árvore expande as linhas recolhidas acima dela e coloca lá o foco do teclado, pelo que as teclas de seta na árvore continuam a partir dela.

Ir para uma correspondência fecha o painel Propriedades da tabela, se estiver aberto, e depois:

- Para o nome, o nome lógico ou o comentário de uma tabela ou de uma coluna, seleciona apenas a tabela, trá-la para a frente e move a célula com o foco para a célula que contém a correspondência. Uma correspondência num comentário oculto por uma [opção de vista das tabelas](./table-related-functions.md#table-view-options) move, em vez disso, a célula com o foco para o nome ao lado. Onde a [vista de nomes](./logical-names.md#name-view) não desenha nenhuma célula para o nome ou para o nome lógico, a célula com o foco passa para a que é desenhada no seu lugar: o nome na vista `Physical Names` e o nome lógico na vista `Logical Names`.
- Para o nome de um índice, seleciona apenas a tabela do índice e trá-la para a frente, com a célula com o foco no nome da tabela, ou no seu nome lógico nas vistas `Logical Names` e `Both Names`, a menos que a célula com o foco já esteja nessa tabela. Os nomes dos índices não são desenhados na tela.
- Para o nome de um grupo de tabelas, seleciona apenas o grupo e trá-lo para a frente com as respetivas tabelas.
- Para uma nota, seleciona apenas a nota e trá-la para a frente.

A tela só se desloca quando o destino ainda não está bem visível, e o zoom nunca muda — consulte [Onde termina um salto](./table-related-functions.md#where-a-jump-lands).

Depois de premir `Enter` no campo Localizar, o cursor de texto fica lá, e depois de escolher uma linha o foco do teclado fica na árvore, pelo que o que escrever a seguir não chega à tabela selecionada.  
Ir para uma correspondência nunca inicia nem termina uma relação que esteja a ser desenhada.

## Substituir {#replacing}

A linha `Replace` está inicialmente recolhida. A seta antes do campo Localizar, cuja dica indica `Toggle Replace`, expande-a e recolhe-a. Recolhê-la mantém o texto de substituição.  
A linha contém o campo `Replace`, com o interruptor `Preserve Case` dentro dele, no final, e dois botões, cujas dicas indicam `Replace (Enter)` e `Replace All`. Os dois botões estão desativados enquanto não há nenhuma correspondência.

A ação `Replace` é executada com `Enter` no campo Substituir, com ou sem `Shift`, ou com o seu botão:

- Sem nenhuma correspondência atual, premir pela primeira vez apenas leva à correspondência seguinte, pelo que vê o que seria alterado antes de algo mudar.
- Com uma correspondência atual, substitui essa única ocorrência, deixando qualquer outra ocorrência no mesmo texto, e avança para a correspondência seguinte depois do texto que escreveu. O que escreveu é ignorado mesmo quando contém a consulta: substituir `user` por `super_user` não para depois dentro de `super_user`.
- Uma correspondência que a substituição voltaria a escrever exatamente como estava fica como está, e premir apenas avança para a correspondência seguinte.
- A substituição e a deslocação até à correspondência seguinte são um único passo de anulação.

Uma série de ações `Replace` para assim que dá a volta e chega ao ponto onde começou. A contagem indica `No more matches`, nenhuma correspondência é atual e premir novamente não substitui nada.  
Por isso, `Customer` substituído por `Big Customer` é substituído uma só vez, em vez de se transformar em `Big Big Customer`.  
Ir para uma correspondência, alterar a consulta, `Match Case`, `Match Whole Word`, `Use Regular Expression` ou um tipo de texto, abrir a pesquisa com a tecla ou com uma entrada `Toggle Explorer`, ou a ação `Replace All` inicia uma nova série, tal como uma anulação ou qualquer outra edição que altere o texto onde a série começou. Alterar o texto de substituição ou `Preserve Case` não o faz, nem a tecla quando apenas devolve o cursor de texto a um explorador já visível.  
Enquanto uma série dura, uma tabela ou um grupo de tabelas cujo nome a série altera mantém o seu lugar na árvore e na ordem das correspondências, pelo que um elemento cujo novo nome o colocaria mais abaixo na ordenação não volta a ser encontrado. A série seguinte repõe a árvore por ordem de nome, e a linha com o nome alterado passa para o seu novo lugar.

A ação `Replace All` é executada com `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) no campo Substituir, ou com o seu botão:

- Substitui todas as correspondências nos tipos de texto ativados e não toca nos outros tipos, exceto nos nomes físicos que um nome lógico substituído deriva, que escreve mesmo enquanto `Table names` e `Column names` estão desativados — consulte abaixo. Com os tipos predefinidos, muda o nome de tabelas, colunas, índices e grupos de tabelas e reescreve os nomes lógicos de tabelas e colunas; os comentários e as notas ficam intactos.
- Tudo o que altera é um único passo de anulação — consulte [Um gesto, um passo](./undo-redo.md#one-gesture-one-step).
- A contagem indica `Replaced N matches`, contando apenas as ocorrências cujo texto mudou efetivamente. Quando nenhuma mudou, indica `No changes` e nada é registado no histórico, como ao substituir a expressão regular `(user)` por `$1`.
- Em seguida, os resultados são pesquisados de novo sem nenhuma correspondência atual, pelo que podem listar correspondências contidas no novo texto.

Ambas leem cada texto tal como está no momento em que prime, e não como a última pesquisa o encontrou.

Como é utilizado o texto de substituição:

- Sem `Use Regular Expression`, `$` não tem significado especial, e o texto de substituição é utilizado tal como foi escrito, à exceção das maiúsculas e minúsculas que `Preserve Case` lhe dá.
- Com `Use Regular Expression`, `$1` a `$99`, `$<name>`, `$&`, `` $` ``, `$'` e `$$` expandem-se como no método `String.prototype.replace` do JavaScript.
- Sem `Preserve Case`, as maiúsculas e minúsculas do texto correspondido não são transferidas: com `Match Case` desativado, substituir `user` por `member` transforma `Users` em `members`.
- Com `Preserve Case`, cada substituição recebe as maiúsculas e minúsculas do texto que substitui, depois de `$1` e os restantes serem expandidos, pelo que a mesma substituição transforma `Users` em `Members`:
  - Uma correspondência toda em maiúsculas recebe a substituição toda em maiúsculas, e uma correspondência toda em minúsculas recebe-a toda em minúsculas: `USER` com `account` dá `ACCOUNT`, e `user` com `Account` dá `account`.
  - Qualquer outra correspondência põe o primeiro carácter da substituição em maiúscula ou minúscula conforme o primeiro carácter da correspondência e deixa o resto como foi escrito: `UserId` com `accountKey` dá `AccountKey`, e `uSER` com `AccountKey` dá `accountKey`. Quando o primeiro carácter da correspondência não tem maiúscula nem minúscula, a substituição fica como foi escrita: `_Ab` com `xyz` dá `xyz`.
  - Quando a correspondência e a substituição contêm ambas `-`, ou ambas `_`, e esse separador as divide no mesmo número de partes, cada parte recebe as maiúsculas e minúsculas da parte correspondente: `USER_id` com `account_key` dá `ACCOUNT_key`, e `User-Name` com `account-key` dá `Account-Key`. Quando tanto `-` como `_` as dividem dessa forma, as maiúsculas e minúsculas aplicam-se ao conjunto como um todo.
  - Uma correspondência sem letras que tenham maiúscula e minúscula, como `123`, deixa a substituição como foi escrita.
  - Uma correspondência reescrita tal como estava não conta: com `Match Case` desativado, substituir `customer` por `Customer` volta a escrever `customer`, `Customer` e `CUSTOMER` tal como estavam, e nenhuma delas é contada.
- Um campo Substituir vazio elimina a correspondência.

Uma substituição é uma edição normal, tal como escrever por si o novo nome da tabela, o nome da coluna, o nome lógico, o comentário ou o texto da nota, mudar o nome do índice no painel Propriedades da tabela ou mudar o nome do grupo de tabelas.  
É registada no histórico e chega aos colaboradores e a um agente de programação como qualquer outra edição.

Assim, um nome de tabela ou de coluna que uma substituição escreve passa a ser um nome escrito por si, que um nome lógico escrito mais tarde deixa como está até que a opção [Voltar a derivar os nomes físicos](./dictionary.md#derive-physical-names-again) o devolva aos dicionários. Um nome que uma substituição deixa vazio volta, em vez disso, a pertencer aos dicionários, tal como qualquer nome apagado — consulte [Nomes escritos por si](./dictionary.md#names-of-your-own).  
Enquanto o nome físico de uma tabela ou coluna estiver vazio ou tiver sido ele próprio derivado, um nome lógico substituído deriva-o a partir dos dicionários, tal como acontece ao fechar a célula do nome lógico com um novo nome lógico — consulte [Derivar nomes físicos](./dictionary.md#deriving-physical-names). Nesse caso, uma coluna cujo novo nome lógico seja um termo recebe também o domínio do termo e, com ele, o tipo de dados do domínio. O que deriva faz parte do passo de anulação da substituição e não é contado em `Replaced N matches`.  
Quando uma mesma ação `Replace All` reescreve tanto o nome lógico como o nome da mesma tabela ou coluna, o nome que escreve prevalece sobre o que o novo nome lógico derivaria.

## Teclas nos campos de pesquisa {#keys-in-the-search-fields}

- No campo Localizar, `Enter` vai para a correspondência seguinte e `Shift + Enter` para a anterior.
- No campo Substituir, `Enter` substitui, com ou sem `Shift`, e `Ctrl + Enter` (Windows/Linux) ou `⌘ + Enter` (Mac) substitui tudo.
- Enquanto um método de introdução está a compor texto em qualquer um dos campos, `Enter` pertence à composição e não navega nem substitui.

O que a tecla `Escape`, os atalhos do editor que continuam a funcionar e todas as outras teclas fazem nestes campos é explicado em [Teclas no explorador](./explorer.md#keys-in-the-explorer).

## Editores só de leitura {#read-only-editors}

Num editor [`readonly`](../../api/erd-editor-element.md#readonly), a pesquisa apenas localiza. Não há a seta `Toggle Replace` nem a linha `Replace`, pelo que não há campo Substituir, `Preserve Case`, `Replace` nem `Replace All`.  
O campo Localizar, as suas três opções, os tipos de texto, a contagem, os resultados e a ida para uma correspondência funcionam todos. Ir para uma correspondência seleciona o ponto onde chega, como em [Ir para uma correspondência](#going-to-a-match), e essa seleção é a única que um editor só de leitura faz: um clique na tela que não se move limpa-a.  
Abra a pesquisa com a tecla ou com `Toggle Explorer` na pesquisa rápida, uma vez que o menu de contexto da tela não tem aí `Toggle Explorer`. O resto do explorador está descrito em [Editores só de leitura](./explorer.md#read-only-editors), na página do explorador.

No VS Code, uma revisão de um diagrama, como uma revisão do Git ou uma entrada de Local History, abre-se como texto JSON. Reaberta como diagrama com `Reopen Editor With...`, é só de leitura e tem esta pesquisa que apenas localiza.

## Alterar o atalho {#changing-the-shortcut}

Uma página que incorpora o editor pode reatribuir `Ctrl + F` (Windows/Linux) ou `⌘ + F` (Mac), ou removê-lo, com o nome `findReplace` através de [`setKeyBindingMap`](../../api/erd-editor-element.md#setkeybindingmap).  
Com o atalho removido, a tecla fica para a página em todos os separadores. O botão `Explorer` da barra de ferramentas continua a abrir e a fechar o explorador, e a entrada `Toggle Explorer` na pesquisa rápida e no menu de contexto da tela continua a abrir a pesquisa ou a fechar o explorador, mas nenhum deles mostra um atalho, pelo que a dica do botão indica apenas `Explorer`. A linha `Toggle Explorer` do separador [Atalhos](./settings.md#shortcuts) das Definições também não mostra nenhuma tecla. Com o atalho reatribuído, todos mostram a nova tecla.
