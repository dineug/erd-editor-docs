---
sidebar_position: 12
description: Gerar código para vinte e dois destinos a partir do diagrama, escolher a linguagem, a base de dados, o formato dos nomes e o delimitador no painel de opções, ver que destinos escrevem as ações ON DELETE e ON UPDATE de uma relação e guardar ou copiar o resultado.
---

# Gerador de código

Mude para o separador `Code Generator` na barra de ferramentas. O separador mostra o código de todo o documento à esquerda e, à sua direita, um painel de opções com o título `Code Generator`, onde escolhe a linguagem, a base de dados, os formatos dos nomes e, para alguns destinos, o delimitador.  
O painel abre-se sozinho, exceto se o editor for mais estreito do que 640 px quando o separador se abre pela primeira vez. O botão `Hide options` no topo do painel recolhe-o e o botão `Show options` no canto superior direito do código volta a mostrá-lo. Mantém-se aberto ou recolhido ao mudar de separador enquanto o editor estiver aberto, independentemente do painel do separador Esquema SQL, e nunca é guardado no ficheiro.

Clique com o botão direito no código para abrir o respetivo menu de contexto: `Language`, `Database`, `Table Name Case`, `Column Name Case`, `Bracket` (apenas para `Doctrine`, `JPA` e `SeaORM`), cada um com um submenu que marca o valor atual, depois `Options panel`, que recolhe ou abre o painel e fica marcado enquanto este está visível, e `Save file`.  
Enquanto este separador está aberto, a [pesquisa rápida](./quick-search.md) oferece `Database`, `Bracket` (apenas para `Doctrine`, `JPA` e `SeaORM`), `Language`, `Table Name Case`, `Column Name Case` e `Code Generator: Options panel`, que recolhe ou abre o painel.

![Escolher TypeScript e depois Rust no menu de contexto do código, mudar os nomes das colunas para Snake no painel de opções e copiar o código](/img/demo-code-generator.webp)

A mesma vista de código é também o separador `Code Generator` do painel [Propriedades da tabela](./table-related-functions.md#table-properties), onde gera código para essa única tabela em vez de para todo o documento. Aí não tem painel de opções, e o seu menu de contexto altera as mesmas definições, mas não tem `Options panel` nem `Save file`.  
Onde o código de todo o documento começa com importações ou um cabeçalho, o código de uma só tabela começa com aqueles de que essa tabela precisa, como `<?php` para `PHP`, `import Foundation` para `Swift` ou `$schema` para `JSON Schema`.

O código é escrito quando o separador se abre e novamente sempre que muda a linguagem, a base de dados, um formato do nome ou o delimitador. Uma edição feita ao diagrama enquanto o separador está aberto, como a de um colaborador ou de um agente de programação, aparece quando sair do separador e voltar, ou quando uma dessas definições mudar.

## Painel de opções {#options-panel}

Sob a legenda `Saved in the document`, o painel lista as opções `Language`, `Database`, `Table Name Case` e `Column Name Case`, seguidas da opção `Bracket` enquanto a linguagem for `Doctrine`, `JPA` ou `SeaORM`. Cada uma é uma lista pendente, e uma alteração reescreve o código de imediato.  
Quando a linguagem selecionada ignora a opção `Database` ou os formatos dos nomes, essas opções permanecem no painel, esbatidas, com uma indicação como `Not used by DBML` por baixo, e continuam a poder ser alteradas.  
Os botões `Save file` e `Copy` ficam na parte inferior do painel — consulte [Guardar ou copiar o resultado](#saving-or-copying-the-result).

Estas são as definições do próprio diagrama, as mesmas que o menu de contexto e a pesquisa rápida também alteram. A opção `Database` é guardada no ficheiro como qualquer edição.  
As opções `Language`, `Table Name Case`, `Column Name Case` e `Bracket` só são guardadas enquanto o respetivo bloqueio no separador Definições estiver desativado (`Bracket Type` para `Bracket`), e um diagrama novo tem todos os bloqueios ativados. Enquanto um bloqueio está ativado, uma alteração reescreve o código no seu ecrã, mas o ficheiro mantém o valor bloqueado e o diagrama volta a abrir-se com ele. O painel não mostra nenhum sinal de bloqueio; para manter uma escolha no ficheiro, desative o respetivo bloqueio — consulte [Bloqueio](./settings.md#lock).

## Linguagem {#language}

São suportados vinte e dois destinos, listados em três grupos — linguagens, ORM e depois esquemas — cada um por ordem alfabética. A lista do painel e o menu de contexto traçam uma linha entre os grupos, mas não dão nome a nenhum deles:

| Destino | Grupo | Relações | Índices | ON DELETE / ON UPDATE | Guardado como |
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

A predefinição é `GraphQL`. Todos os destinos emitem colunas; as marcas ✓ mostram o que mais cada um emite.  
As tabelas são emitidas por ordem do nome, e não pela ordem em que estão na tela, e os índices são os listados em `Indexes` no painel [Propriedades da tabela](./table-related-functions.md#indexes), e não as linhas `Keys` acima deles. `SeaORM` escreve apenas os únicos, e `Mermaid` marca uma coluna única com `UK`, mas não escreve nenhum índice.  
Todos os destinos exceto `Java`, `AML`, `DBML` e `Mermaid` escrevem uma coluna de chave primária como não nula, quer o sinalizador `Not Null` esteja definido nela quer não. `Java` não indica, em nenhuma coluna, se aceita nulos ou não, e `AML`, `DBML` e `Mermaid` mantêm o sinalizador tal como o diagrama o tem.

O que alguns dos destinos escrevem:

- `PHP`: classes simples de propriedades públicas tipadas, que começam com `<?php` e `declare(strict_types=1);`.
- `Doctrine`: entidades Doctrine ORM 3 com atributos, para DBAL 4.2 ou posterior, cada coluna com o seu tipo DBAL e as opções para a base de dados selecionada.
- `Rust`: uma `pub struct` por tabela, com os tipos escritos pelo caminho completo, como `chrono::NaiveDateTime` ou `rust_decimal::Decimal`, sem nenhuma linha `use`.
- `SeaORM`: entidades SeaORM 2.0 no formato denso, sendo cada tabela um `pub mod`, pelo que todo o texto compila como um único ficheiro.
- `Swift`: uma struct `Codable`, `Hashable`, `Sendable` por tabela, que requer Swift 6.1 ou posterior.
- `TypeScript`: uma `export interface` por tabela que descreve a linha como JSON, tal como o esquema `Zod` — uma data ou uma hora é uma `string`, e uma coluna que aceita nulos é `T | null`.
- `Zod`: um esquema de linha Zod 4 por tabela e o tipo que este infere, sem esquema de inserção nem relações.
- `JSON Schema`: um único documento JSON Schema draft 2020-12, com um esquema de linha por tabela em `$defs`.
- `Mermaid`: um `erDiagram`, do tipo que o GitHub renderiza, em que cada tabela é uma entidade que lista todas as colunas com o respetivo tipo e qualquer marca `PK`, `FK` ou `UK`, e cada relação é uma linha entre as suas duas tabelas.

`AML`, `DBML` e `GraphQL` são formatos de ida e volta: cada um é também uma origem de importação. Consulte [Importar ou exportar ficheiros](./file-import-export.md). Os outros esquemas, `JSON Schema`, `Mermaid` e `Zod`, são apenas de saída.  
`DBML` escreve a cor de cada tabela como `headercolor` e, no código de todo o documento, um bloco `TableGroup` depois das referências `Ref` para cada [grupo de tabelas](./table-groups.md) que contém uma tabela. `AML` escreve a cor de uma tabela como o mais próximo dos nomes de cores do AML.

## ON DELETE e ON UPDATE {#on-delete-and-on-update}

As ações ON DELETE e ON UPDATE de uma relação são definidas a partir do respetivo menu de contexto — consulte [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
Os destinos com um ✓ na coluna `ON DELETE / ON UPDATE` da tabela [Linguagem](#language) escrevem as ações que uma relação define; uma ação deixada em `Not set` não escreve nada.  
As ações que os destinos ORM mantêm dependem da base de dados selecionada, enquanto `AML` e `DBML` as mantêm todas — consulte [Base de dados](#database).

- `Doctrine` escreve apenas ON DELETE, uma vez que o Doctrine não tem ON UPDATE. Acrescenta `onDelete: 'CASCADE'` a cada `#[ORM\JoinColumn]` da associação `ManyToOne` ou `OneToOne` do lado proprietário, como `#[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]`, e nada na associação `OneToMany` ou `OneToOne` do lado inverso. Uma relação com uma coluna única que não é a chave primária fica como colunas simples, que o Doctrine mapeia sem associação, pelo que não escreve nenhuma ação.
- `Drizzle` escreve-as em minúsculas. Na chamada `.references()` são opções, como `{ onDelete: "cascade", onUpdate: "set null" }`; numa chamada `foreignKey()`, que uma chave de várias colunas recebe, são encadeadas, como `.onDelete("restrict").onUpdate("no action")`.
- `SeaORM` escreve-as na relação `belongs_to` da tabela filha, primeiro o ON UPDATE, com os nomes do SeaORM `NoAction`, `Cascade`, `SetNull`, `SetDefault` e `Restrict`, como `on_update = "Cascade", on_delete = "SetNull"`. A relação `has_one` ou `has_many` da tabela pai não recebe nenhuma.
- `Sequelize` escreve as entradas `onDelete: "CASCADE"` e `onUpdate` nas duas chamadas de associação: `hasMany` ou `hasOne`, e `belongsTo`. Uma chave de várias colunas não recebe chamadas de associação, pelo que `Sequelize` não escreve nenhuma ação para ela.
- `SQLAlchemy` passa os argumentos `ondelete="CASCADE"` e `onupdate` a `ForeignKey()` para uma chave de uma coluna, e a `ForeignKeyConstraint()` para uma chave de várias colunas.
- `TypeORM` escreve as opções `onDelete: "CASCADE"` e `onUpdate` no decorador `@ManyToOne` ou `@OneToOne` do lado proprietário, nunca no lado inverso. Omite sempre `SET DEFAULT`, porque o TypeORM o escreveria como `DEFAULT`, que nenhuma base de dados aceita.
- `DBML` acrescenta definições à referência `Ref`, como `[delete: set null, update: no action]`.
- `AML` escreve uma relação que tem uma ação como uma instrução `rel` autónoma com propriedades, como `{onDelete: cascade, onUpdate: "set null"}`, em vez de em linha na respetiva coluna.

`JPA` não escreve nenhuma: o JPA simples não tem nenhuma opção para elas, e o gerador não usa a anotação `@OnDelete` do Hibernate. `Mermaid` também não escreve nenhuma, uma vez que uma linha de um `erDiagram` não tem lugar para elas.  
No separador `Code Generator` do painel Propriedades da tabela, que mostra uma só tabela, `DBML` não escreve nenhuma referência `Ref` e `AML` nenhuma instrução `rel`, pelo que nenhum deles mostra aí as ações; `AML` mantém em linha na respetiva coluna uma relação de uma coluna que tem ações, tal como faz com uma que não as tem. `Mermaid` não escreve aí absolutamente nenhuma linha de relação. `Doctrine` e `SeaORM` escrevem aí a mesma entidade que em todo o documento, incluindo as ações.

## Formato dos nomes {#name-case}

As opções `Table Name Case` e `Column Name Case` suportam cada uma `Pascal`, `Camel`, `Snake` e `None`.  
As predefinições são `Pascal` para os nomes das tabelas e `Camel` para os nomes das colunas. `None` emite um nome tal como está escrito no diagrama.  
Em qualquer formato, um nome que a linguagem do destino reserva é escapado onde essa linguagem o consegue escapar, como `@class` em `C#` ou `r#type` em `Rust`, e alterado onde não consegue, como `class_` em `Java`.

`AML`, `DBML` e `Mermaid` ignoram ambas as definições e emitem sempre os nomes do diagrama.  
`SeaORM` também as ignora: dá nome aos campos e aos módulos em snake case, a forma que o SeaORM volta a ler, e indica os nomes armazenados em `table_name` e, onde diferem, em `column_name`.  
Para estes quatro destinos, o painel esbate as duas listas, com a indicação `Not used by` por baixo.

## Base de dados {#database}

Os tipos de dados são resolvidos em função da base de dados selecionada — consulte [Bases de dados](./table-related-functions.md#databases).  
Escolha-a neste separador na lista `Database` do painel, na opção `Database` do menu de contexto ou na pesquisa rápida, e o código é reescrito de imediato. É a única definição de base de dados do diagrama, a mesma que o menu de contexto da tela e o separador [Esquema SQL](./schema-sql.md) definem, pelo que uma alteração aqui também aparece lá.  
`Drizzle` obtém o seu dialeto da mesma definição: `pgTable` para o PostgreSQL, `mysqlTable` para o MySQL e o MariaDB, `sqliteTable` para o SQLite e `pgTable` para todas as outras bases de dados.  
`SeaORM` escreve um `column_type` onde, de outro modo, o SeaORM criaria um tipo de coluna diferente no PostgreSQL, no MySQL, no MariaDB ou no SQLite, e nenhum no MSSQL, no Oracle, no Snowflake ou no Databricks, para os quais o SeaORM não tem backend.

A base de dados selecionada também decide que ações ON DELETE e ON UPDATE os destinos ORM escrevem.  
`Doctrine`, `SeaORM`, `Sequelize`, `SQLAlchemy` e `TypeORM` omitem qualquer ação que o Esquema SQL dessa base de dados omita, como `SET DEFAULT` no MySQL e no MariaDB, `RESTRICT` no MSSQL ou todas as ações exceto `NO ACTION` no Snowflake e no Databricks, pelo que se aplica a predefinição da base de dados. A lista completa está em [ON DELETE e ON UPDATE](./relationship-editing.md#on-delete-and-on-update).  
`Drizzle`, em vez disso, segue o dialeto que escreve: o código `mysqlTable` omite `SET DEFAULT`, enquanto o código `pgTable` e `sqliteTable` mantém todas as ações, incluindo o código `pgTable` que escreve para o MSSQL, o Oracle, o Snowflake e o Databricks.

`AML`, `DBML` e `Mermaid` são a exceção: emitem cada tipo de dados tal como está escrito no diagrama, pelo que a definição da base de dados não altera a sua saída, e o painel esbate a opção `Database` para eles. `AML` e `DBML` escrevem todas as ações que uma relação define, e `Mermaid` não escreve nenhuma.

## Delimitador {#bracket}

A opção `Bracket` só é oferecida no painel, no menu de contexto e na pesquisa rápida enquanto a linguagem for `Doctrine`, `JPA` ou `SeaORM`.  
É a mesma definição que o delimitador do separador Esquema SQL — consulte [Esquema SQL](./schema-sql.md#database-and-bracket) — pelo que uma alteração aqui também altera a forma como o Esquema SQL delimita os nomes. Oferece `SingleQuote`, `DoubleQuote`, `Backtick` e `None`, e começa em `None`.

- `Doctrine`: com qualquer delimitador exceto `None`, todos os nomes de tabelas, colunas e colunas de junção são envolvidos em acentos graves, que é a forma como o Doctrine marca um nome a delimitar, como ``#[ORM\Table(name: '`order`')]``. Com `None`, só é envolvido o nome que o exija: uma palavra que uma base de dados reserva, um nome que não é um identificador ASCII simples ou um nome escrito entre aspas.
- `JPA`: com qualquer delimitador exceto `None`, um nome de tabela que é uma palavra reservada é delimitado dentro de `@Table`, como `@Table(name = "\"user\"")`. Com `None`, fica sem delimitação, tal como o Esquema SQL o deixa.
- `SeaORM`: com `None`, os nomes são escritos tal como a base de dados os armazena: um nome de tabela com ponto é dividido em `schema_name` e `table_name` e, no PostgreSQL, um nome sem delimitação é convertido para minúsculas. Com qualquer outro delimitador, um nome é mantido inteiro, tal como está escrito.

## Guardar ou copiar o resultado {#saving-or-copying-the-result}

O comando `Save file`, na parte inferior do painel de opções ou no menu de contexto, guarda como ficheiro o código apresentado.  
É nomeado como qualquer exportação, `<database name>-<timestamp>`, seguido da extensão indicada na tabela [Linguagem](#language), como `shop-2026-10-12T04_05_06.ts`, e vai para onde vai qualquer exportação no seu host — consulte [Exportar](./file-import-export.md#exporting). `Java` e `JPA` colocam todas as classes num único ficheiro `.java`, tal como o separador as mostra.  
O menu Exportar não tem nenhuma entrada do Gerador de código, e o separador `Code Generator` do painel Propriedades da tabela não consegue guardar um ficheiro.

Para copiar o código, clique no botão `Copy` na parte inferior do painel, ou passe o ponteiro sobre o código e clique no botão de cópia no respetivo canto superior direito, a única forma no painel Propriedades da tabela.  
Uma notificação `Copied!` com uma marca de verificação confirma-o durante dois segundos. Se o navegador ou o host recusar o acesso à área de transferência, uma notificação `Couldn't copy to the clipboard` com um sinal de aviso indica-o em vez disso. Copiar novamente substitui a notificação em vez de acrescentar outra.  
O texto também pode ser selecionado, pelo que pode ficar apenas com a parte de que precisa.
