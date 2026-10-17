---
sidebar_position: 12
description: Gerar código para vinte e dois destinos a partir do diagrama, escolher a linguagem, o banco de dados, o estilo de nome e o delimitador no painel de opções, ver quais destinos escrevem as ações ON DELETE e ON UPDATE de um relacionamento e salvar ou copiar o resultado.
---

# Gerador de código

Mude para a aba `Code Generator` na barra de ferramentas. A aba mostra o código do documento inteiro à esquerda e, à direita dele, um painel de opções com o título `Code Generator`, onde você escolhe a linguagem, o banco de dados, os estilos de nome e, para alguns destinos, o delimitador.  
O painel se abre sozinho, a menos que o editor tenha menos de 640 px de largura quando a aba é aberta pela primeira vez. `Hide options`, no topo do painel, o recolhe, e `Show options`, no canto superior direito do código, o traz de volta. Ele permanece aberto ou recolhido ao trocar de aba enquanto o editor estiver aberto, independentemente do painel da aba Esquema SQL, e nunca é salvo no arquivo.

Clique com o botão direito no código para abrir seu menu de contexto: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (só para `Doctrine`, `JPA` e `SeaORM`), cada um com um submenu que marca o valor atual, depois `Options panel`, que recolhe ou abre o painel e fica marcado enquanto ele está visível, e `Save file`.  
Enquanto esta aba está aberta, a [pesquisa rápida](./quick-search.md) oferece `Database`, `Bracket` (só para `Doctrine`, `JPA` e `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` e `Code Generator: Options panel`, que recolhe ou abre o painel.

![Escolha de TypeScript e depois de Rust no menu de contexto do código, troca dos nomes de coluna para Snake no painel de opções e cópia do código](/img/demo-code-generator.webp)

A mesma exibição de código também é a aba `Code Generator` do painel [Propriedades da tabela](./table-related-functions.md#table-properties), onde ela gera o código só dessa tabela em vez do documento inteiro. Ali ela não tem painel de opções, e seu menu de contexto altera as mesmas configurações, mas não tem `Options panel` nem `Save file`.  
Quando o código do documento inteiro começa com importações ou um cabeçalho, o código de uma única tabela começa com aqueles de que essa tabela precisa, como `<?php` para `PHP`, `import Foundation` para `Swift` ou `$schema` para `JSON Schema`.

O código é escrito quando a aba se abre e novamente sempre que muda a linguagem, o banco de dados, um estilo de nome ou o delimitador. Uma edição feita no diagrama enquanto a aba está aberta, como a de um colaborador ou de um agente de codificação, aparece quando você sai da aba e volta, ou quando uma dessas configurações muda.

## Painel de opções {#options-panel}

Sob a legenda `Saved in the document`, o painel lista `Language`, `Database`, `Table Name Case` e `Column Name Case`, seguidos de `Bracket` enquanto a linguagem for `Doctrine`, `JPA` ou `SeaORM`. Cada um é uma lista suspensa, e uma alteração reescreve o código imediatamente.  
Quando a linguagem selecionada ignora `Database` ou os estilos de nome, eles continuam no painel, esmaecidos, com uma observação como `Not used by DBML` abaixo deles, e ainda podem ser alterados.  
`Save file` e `Copy` ficam no rodapé do painel — consulte [Salvar ou copiar o resultado](#saving-or-copying-the-result).

Estas são as próprias configurações do diagrama, as mesmas que o menu de contexto e a pesquisa rápida também alteram. `Database` é salvo no arquivo como qualquer edição.  
`Language`, `Table Name Case`, `Column Name Case` e `Bracket` só são salvos enquanto o respectivo bloqueio na aba Configurações está desativado (`Bracket Type` para `Bracket`), e um diagrama novo tem todos os bloqueios ativados. Enquanto um bloqueio está ativado, uma alteração reescreve o código na sua tela, mas o arquivo mantém o valor bloqueado e o diagrama é reaberto com ele. O painel não mostra nenhum sinal de bloqueio; para manter uma escolha no arquivo, desative o bloqueio dela — consulte [Bloqueio](./settings.md#lock).

## Linguagem {#language}

Há suporte a vinte e dois destinos, listados em três grupos — linguagens, ORMs e depois esquemas — cada um em ordem alfabética. A lista do painel e o menu de contexto traçam uma linha entre os grupos, mas não dão nome a nenhum deles:

| Destino | Grupo | Relacionamentos | Índices | ON DELETE / ON UPDATE | Salvo como |
| --- | --- | --- | --- | --- | --- |
| `C#` | Linguagem | — | — | — | `.cs` |
| `Go` | Linguagem | — | — | — | `.go` |
| `Java` | Linguagem | — | — | — | `.java` |
| `Kotlin` | Linguagem | — | — | — | `.kt` |
| `PHP` | Linguagem | — | — | — | `.php` |
| `Rust` | Linguagem | — | — | — | `.rs` |
| `Scala` | Linguagem | — | — | — | `.scala` |
| `Swift` | Linguagem | — | — | — | `.swift` |
| `TypeScript` | Linguagem | — | — | — | `.ts` |
| `Doctrine` | ORM | ✓ | ✓ | Só ON DELETE | `.php` |
| `Drizzle` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `JPA` | ORM | ✓ | — | — | `.java` |
| `SeaORM` | ORM | ✓ | Só únicos | ✓ | `.rs` |
| `Sequelize` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `SQLAlchemy` | ORM | ✓ | ✓ | ✓ | `.py` |
| `TypeORM` | ORM | ✓ | ✓ | ✓ | `.ts` |
| `AML` | Esquema | ✓ | ✓ | ✓ | `.aml` |
| `DBML` | Esquema | ✓ | ✓ | ✓ | `.dbml` |
| `GraphQL` | Esquema | ✓ | — | — | `.graphql` |
| `JSON Schema` | Esquema | — | — | — | `.json` |
| `Mermaid` | Esquema | ✓ | — | — | `.mmd` |
| `Zod` | Esquema | — | — | — | `.ts` |

O padrão é `GraphQL`. Todo destino emite colunas; as marcas ✓ mostram o que mais ele emite.  
As tabelas são emitidas ordenadas pelo nome, e não na ordem em que estão no canvas, e os índices são os listados em `Indexes` no painel [Propriedades da tabela](./table-related-functions.md#indexes), não as linhas `Keys` acima deles. O `SeaORM` escreve só os índices únicos, e o `Mermaid` marca uma coluna única com `UK`, mas não escreve nenhum índice.  
Todo destino, exceto `Java`, `AML`, `DBML` e `Mermaid`, escreve uma coluna de chave primária como não nula, esteja ou não `Not Null` definido nela. O `Java` não marca nenhuma coluna como anulável ou não, e `AML`, `DBML` e `Mermaid` mantêm o sinalizador como está no diagrama.

O que alguns dos destinos escrevem:

- `PHP`: classes simples de propriedades públicas tipadas, que começam com `<?php` e `declare(strict_types=1);`.
- `Doctrine`: entidades do Doctrine ORM 3 com atributos, para o DBAL 4.2 ou posterior, cada coluna com seu tipo DBAL e suas opções para o banco de dados selecionado.
- `Rust`: uma `pub struct` por tabela, com os tipos escritos pelo caminho completo, como `chrono::NaiveDateTime` ou `rust_decimal::Decimal`, sem nenhuma linha `use`.
- `SeaORM`: entidades do SeaORM 2.0 no formato denso, com cada tabela como um `pub mod`, de modo que o texto inteiro compila como um único arquivo.
- `Swift`: uma struct `Codable`, `Hashable`, `Sendable` por tabela, que exige o Swift 6.1 ou posterior.
- `TypeScript`: uma `export interface` por tabela que descreve a linha como JSON, assim como faz o esquema `Zod` — uma data ou uma hora é uma `string`, e uma coluna anulável é `T | null`.
- `Zod`: um esquema de linha do Zod 4 por tabela e o tipo que ele infere, sem esquema de inserção e sem relações.
- `JSON Schema`: um único documento JSON Schema draft 2020-12, com um esquema de linha por tabela em `$defs`.
- `Mermaid`: um `erDiagram`, o tipo que o GitHub renderiza, com cada tabela como uma entidade que lista todas as colunas com o tipo e qualquer marca `PK`, `FK` ou `UK`, e cada relacionamento como uma linha entre suas duas tabelas.

`AML`, `DBML` e `GraphQL` são formatos de ida e volta: cada um também é uma fonte de importação. Consulte [Importar ou exportar arquivos](./file-import-export.md). Os outros esquemas, `JSON Schema`, `Mermaid` e `Zod`, são somente de saída.  
O `DBML` escreve a cor de cada tabela como `headercolor` e, no código do documento inteiro, um bloco `TableGroup` depois dos `Ref`s para cada [grupo de tabelas](./table-groups.md) que contém uma tabela. O `AML` escreve a cor de uma tabela como o nome de cor do AML mais próximo dela.

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

As ações ON DELETE e ON UPDATE de um relacionamento são definidas no menu de contexto dele — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Os destinos com ✓ na coluna `ON DELETE / ON UPDATE` da tabela em [Linguagem](#language) escrevem as ações que um relacionamento define; uma ação deixada em `Not set` não escreve nada.  
Quais ações os destinos ORM mantêm depende do banco de dados selecionado, enquanto `AML` e `DBML` mantêm todas — consulte [Banco de dados](#database).

- O `Doctrine` escreve só ON DELETE, já que o Doctrine não tem ON UPDATE. Ele adiciona `onDelete: 'CASCADE'` a cada `#[ORM\JoinColumn]` do `ManyToOne` ou `OneToOne` do lado proprietário, como `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, e nada no `OneToMany` ou `OneToOne` do lado inverso. Um relacionamento com uma coluna única que não é a chave primária continua como colunas simples, que o Doctrine mapeia sem associação, então ele não escreve nenhuma ação.
- O `Drizzle` as escreve em minúsculas. Em `.references()` elas são opções, como `{ onDelete: "cascade", onUpdate: "set null" }`; em um `foreignKey()`, que uma chave de várias colunas recebe, elas são encadeadas, como `.onDelete("restrict").onUpdate("no action")`.
- O `SeaORM` as escreve na relação `belongs_to` da tabela filha, com ON UPDATE primeiro, nos nomes do SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` e `Restrict`, como `on_update = "Cascade", on_delete = "SetNull"`. O `has_one` ou `has_many` da tabela pai não recebe nenhuma.
- O `Sequelize` escreve entradas `onDelete: "CASCADE"` e `onUpdate` nas duas chamadas de associação: `hasMany` ou `hasOne`, e `belongsTo`. Uma chave de várias colunas não recebe chamadas de associação, então o `Sequelize` não escreve nenhuma ação para ela.
- O `SQLAlchemy` passa os argumentos `ondelete="CASCADE"` e `onupdate` para `ForeignKey()` no caso de uma chave de uma coluna e para `ForeignKeyConstraint()` no caso de uma chave de várias colunas.
- O `TypeORM` escreve as opções `onDelete: "CASCADE"` e `onUpdate` no `@ManyToOne` ou `@OneToOne` do lado proprietário, nunca no lado inverso. Ele sempre omite `SET DEFAULT`, porque o TypeORM o escreveria como `DEFAULT`, que nenhum banco de dados aceita.
- O `DBML` adiciona configurações ao `Ref`, como `[delete: set null, update: no action]`.
- O `AML` escreve um relacionamento que tem uma ação como uma instrução `rel` independente com propriedades, como `{onDelete: cascade, onUpdate: "set null"}`, em vez de embuti-lo na sua coluna.

O `JPA` não escreve nenhuma: o JPA puro não tem opção para elas, e o gerador não usa o `@OnDelete` do Hibernate. O `Mermaid` também não escreve nenhuma, já que uma linha de `erDiagram` não tem lugar para elas.  
Na aba `Code Generator` do painel Propriedades da tabela, que mostra uma única tabela, o `DBML` não escreve nenhum `Ref` e o `AML`, nenhuma instrução `rel`, então nenhum dos dois mostra as ações ali; o `AML` mantém embutida na sua coluna uma relação de uma coluna que tem ações, como faz com uma que não as tem. O `Mermaid` não escreve ali nenhuma linha de relacionamento. O `Doctrine` e o `SeaORM` escrevem ali a mesma entidade que no documento inteiro, incluindo as ações.

## Estilo de nome {#name-case}

`Table Name Case` e `Column Name Case` aceitam, cada um, `Pascal`, `Camel`, `Snake` e `None`.  
Os padrões são `Pascal` para nomes de tabela e `Camel` para nomes de coluna. `None` emite um nome tal como está escrito no diagrama.  
Em qualquer estilo, um nome que a linguagem do destino reserva é escapado onde essa linguagem permite escapá-lo, como `@class` em `C#` ou `r#type` em `Rust`, e renomeado onde não permite, como `class_` em `Java`.

`AML`, `DBML` e `Mermaid` ignoram as duas configurações e sempre emitem os nomes do diagrama.  
O `SeaORM` também as ignora: ele nomeia campos e módulos em snake case, a forma que o SeaORM lê de volta, e informa os nomes armazenados em `table_name` e, quando diferem, em `column_name`.  
Para esses quatro destinos, o painel esmaece as duas listas, com a observação `Not used by` abaixo delas.

## Banco de dados {#database}

Os tipos de dados são resolvidos de acordo com o banco de dados selecionado — consulte [Bancos de dados](./table-related-functions.md#databases).  
Escolha-o nesta aba na lista `Database` do painel, em `Database` no menu de contexto ou na pesquisa rápida, e o código é reescrito imediatamente. É a única configuração de banco de dados do diagrama, a mesma que o menu de contexto do canvas e a aba [Esquema SQL](./schema-sql.md) definem, então uma alteração aqui também aparece lá.  
O `Drizzle` obtém seu dialeto da mesma configuração: `pgTable` para PostgreSQL, `mysqlTable` para MySQL e MariaDB, `sqliteTable` para SQLite e `pgTable` para todos os outros bancos de dados.  
O `SeaORM` escreve um `column_type` onde, sem ele, o SeaORM criaria um tipo de coluna diferente no PostgreSQL, MySQL, MariaDB ou SQLite, e nenhum no MSSQL, Oracle, Snowflake ou Databricks, para os quais o SeaORM não tem backend.

O banco de dados selecionado também decide quais ações ON DELETE e ON UPDATE os destinos ORM escrevem.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` e `TypeORM` omitem qualquer ação que o Esquema SQL desse banco de dados omite, como `SET DEFAULT` no MySQL e no MariaDB, `RESTRICT` no MSSQL ou todas as ações exceto `NO ACTION` no Snowflake e no Databricks, para que valha o padrão do banco de dados. A lista completa está em [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
O `Drizzle`, por sua vez, segue o dialeto que escreve: o código `mysqlTable` omite `SET DEFAULT`, enquanto os códigos `pgTable` e `sqliteTable` mantêm todas as ações, incluindo o código `pgTable` que ele escreve para MSSQL, Oracle, Snowflake e Databricks.

`AML`, `DBML` e `Mermaid` são a exceção: eles emitem cada tipo de dados tal como está escrito no diagrama, então a configuração de banco de dados não altera sua saída, e o painel esmaece `Database` para eles. `AML` e `DBML` escrevem todas as ações que um relacionamento define, e o `Mermaid` não escreve nenhuma.

## Delimitador {#bracket}

`Bracket` só é oferecido no painel, no menu de contexto e na pesquisa rápida enquanto a linguagem for `Doctrine`, `JPA` ou `SeaORM`.  
É a mesma configuração que o delimitador da aba Esquema SQL — consulte [Esquema SQL](./schema-sql.md#database-and-bracket) — então uma alteração aqui também muda como o Esquema SQL delimita os nomes. Ele oferece `SingleQuote`, `DoubleQuote`, `Backtick` e `None`, e começa em `None`.

- `Doctrine`: com qualquer delimitador exceto `None`, todo nome de tabela, de coluna e de coluna de junção é envolvido em acentos graves, que é como o Doctrine marca um nome a ser delimitado, como ``#[ORM\Table(name: '`order`')]``. Com `None`, só um nome que precisa disso é envolvido: uma palavra que um banco de dados reserva, um nome que não é um identificador ASCII simples ou um nome digitado entre aspas.
- `JPA`: com qualquer delimitador exceto `None`, um nome de tabela que é uma palavra reservada é delimitado dentro de `@Table`, como `@Table(name = "\"user\"")`. Com `None`, ele fica sem delimitação, como o Esquema SQL o deixa.
- `SeaORM`: com `None`, os nomes são escritos como o banco de dados os armazena: um nome de tabela com ponto é dividido em `schema_name` e `table_name`, e no PostgreSQL um nome sem delimitação é convertido para minúsculas. Com qualquer outro delimitador, um nome é mantido inteiro, tal como está escrito.

## Salvar ou copiar o resultado {#saving-or-copying-the-result}

`Save file`, no rodapé do painel de opções ou no menu de contexto, salva como arquivo o código mostrado.  
O arquivo é nomeado como qualquer exportação, `<database name>-<timestamp>`, seguido da extensão indicada na tabela em [Linguagem](#language), como `shop-2026-10-12T04_05_06.ts`, e vai para onde vai qualquer exportação no seu host — consulte [Exportar](./file-import-export.md#exporting). `Java` e `JPA` colocam todas as classes em um único arquivo `.java`, como a aba as mostra.  
O menu Exportar não tem um item para o Gerador de código, e a aba `Code Generator` do painel Propriedades da tabela não pode salvar arquivos.

Para copiar o código, clique em `Copy` no rodapé do painel ou passe o ponteiro sobre o código e clique no botão de copiar no canto superior direito dele, a única forma no painel Propriedades da tabela.  
Uma notificação `Copied!` com uma marca de seleção confirma a cópia por dois segundos. Se o navegador ou o host recusar o acesso à área de transferência, em vez disso uma notificação `Couldn't copy to the clipboard` com um sinal de alerta informa o ocorrido. Copiar de novo substitui a notificação em vez de adicionar outra.  
O texto também pode ser selecionado, então é possível pegar só a parte de que você precisa.
