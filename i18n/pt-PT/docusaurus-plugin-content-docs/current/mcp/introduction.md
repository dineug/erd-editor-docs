---
sidebar_position: 1
description: Permitir que um agente de programação como o Claude Code ou o Codex edite diagramas do erd-editor através do servidor MCP @dineug/erd-editor-mcp, em direto no VS Code, no Obsidian ou num IDE da JetBrains, ou diretamente no disco.
---

# Introdução

`@dineug/erd-editor-mcp` é um servidor MCP que permite a um agente de programação editar diagramas do erd-editor.
O Claude Code, o Codex e qualquer outro cliente do [Model Context Protocol](https://modelcontextprotocol.io) recebem uma ferramenta por cada operação sobre um documento: adicionar uma tabela, mudar o nome de uma coluna, relacionar duas tabelas, importar um dump de DDL, ler o esquema de volta em SQL.

Quando o documento está aberto no ERD Editor do [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), do [Obsidian](https://community.obsidian.md/plugins/erd-editor) ou de um [IDE da JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), o agente junta-se ao editor como um colaborador.
Cada alteração aparece na tela à medida que acontece, e a anulação do agente reverte apenas as edições do próprio agente.
O VS Code mantém as alterações do agente por guardar até serem guardadas pelo agente ou por si, enquanto o Obsidian e um IDE da JetBrains as guardam tal como guardam as edições feitas por si.
Sem nenhum editor que detenha o documento, as mesmas ferramentas editam o próprio ficheiro.

![Um agente de programação a adicionar tabelas e relações a um diagrama aberto no VS Code](/img/coding-agents.webp)

## O que um agente pode fazer {#what-an-agent-can-do}

- Criar ou alterar um esquema numa conversa: tabelas, colunas e todas as opções das colunas, relações com a sua cardinalidade e as suas ações ON DELETE e ON UPDATE, índices, notas, cores e posições na tela. Consulte [Relações](./tools.md#relationships).
- Reunir tabelas em [grupos de tabelas](../guide/guides/table-groups.md): adicionar um grupo à volta das tabelas que indica ou sobre uma área da tela e, depois, mudar-lhe o nome, atribuir-lhe uma cor, movê-lo com as suas tabelas, redimensioná-lo, colocar tabelas nele ou retirá-las, ou removê-lo, o que deixa as suas tabelas onde estão. Consulte [Grupos de tabelas](./tools.md#table-groups).
- Nomear tabelas e colunas a partir das palavras e dos termos do separador [Dicionário](../guide/guides/dictionary.md) do editor, e vincular colunas aos seus domínios, que lhes dão os respetivos tipos de dados. Define os [nomes lógicos](../guide/guides/logical-names.md) das tabelas e das colunas, e os dicionários derivam deles os nomes físicos, tal como fazem no editor, embora um nome físico escrito à mão se mantenha, a menos que esteja vazio. Adiciona, altera e remove domínios, palavras e termos e, depois de uma palavra ou um termo mudar, volta a derivar os nomes físicos de uma coluna, de uma tabela ou de todo o documento. Lista o que a folha `Checks` do separador encontra: palavras proibidas, palavras não registadas e sinónimos; nomes partilhados por duas linhas de um mesmo dicionário; vínculos a um domínio que o documento não contém; nomes físicos diferentes do que o respetivo termo dá; e colunas com um tipo de dados diferente do tipo do seu domínio. Consulte [Dicionários](./tools.md#dictionaries) e [Verificações do dicionário](./tools.md#dictionary-checks).
- Substituir o documento por um esquema analisado a partir de SQL DDL, GraphQL SDL, DBML ou AML, ou por outro documento `.erd.json`. Ou adicionar esse esquema ou documento abaixo do diagrama e manter tudo o que já lá está, como faz a opção [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) do editor. Um `TableGroup` do DBML chega como grupo de tabelas em ambos os casos. Um esquema que substitui o documento mantém os dicionários do documento, um documento que o substitui traz os seus próprios, e uma adição não traz nenhum. Consulte [Importação](./tools.md#import).
- Ler o diagrama de volta, com os seus nomes lógicos e as linhas dos dicionários, como uma lista de ids, como entidades completas ou como o texto `.erd.json` que se escreve ao guardar. Ou lê-lo como DDL para qualquer uma das oito bases de dados, com as opções `Statements` e `Header` do separador [Esquema SQL](../guide/guides/schema-sql.md) e o seu interruptor [`Write logical names into empty comments`](../guide/guides/schema-sql.md#logical-names-as-comments). Num esquema de milhares de tabelas, lê uma página, algumas tabelas ou as tabelas de alguns grupos de tabelas de cada vez. Consulte [Ler um documento](./tools.md#reading-a-document).
- Definir a base de dados, o nome da base de dados e os [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) escritos antes e depois das tabelas no Esquema SQL, como um `CREATE EXTENSION` antes delas ou um `GRANT` depois delas. `erd_read` devolve os scripts isoladamente, ou dentro do DDL do documento inteiro. Consulte [Definições](./tools.md#settings).
- Executar várias edições como uma só, todas ou nenhuma, que uma única anulação reverte. Consulte [erd_batch](./tools.md#erd_batch).
- Anular e refazer as edições do próprio agente, nunca as suas.

O que não faz:

- Fazer zoom, deslocar a vista ou mudar de separador. Essas ações pertencem a cada pessoa que vê o diagrama, pelo que nenhuma ferramenta o faz. Ainda assim, uma importação que substitui o documento move a vista, mesmo com a definição `Viewport` bloqueada, tal como faz a opção `Import` do editor: de volta ao início da tela a 100% ou, com `erd_import_json`, para a vista do documento que carrega, e também para o separador desse documento, a menos que este tenha a definição `Canvas Type` bloqueada. Consulte [Importação](./tools.md#import).
- Mudar a [vista de nomes](../guide/guides/logical-names.md#switching-the-view) entre `Physical Names`, `Logical Names` e `Both Names`. Pertence a cada pessoa que vê o diagrama enquanto o respetivo [bloqueio](../guide/guides/settings.md#lock) está ativado, como acontece num diagrama novo, e cabe-lhe a si escolhê-la no editor depois de o bloqueio ser desativado, pelo que nenhuma ferramenta o faz. O agente lê e escreve nomes lógicos seja qual for a vista. Um `erd_import_json` que substitua o documento só traz a vista de nomes do documento que carrega quando esse documento tem o bloqueio `Name View` desativado.
- Alterar as opções do menu [`View Option`](../guide/guides/table-related-functions.md#table-view-options), a linguagem e os formatos dos nomes do Gerador de código, o tipo de delimitador ou as definições `Relationship DataType Sync`, `Maximum comment width` e `Column Order` do separador [Definições](../guide/guides/settings.md). Cabe-lhe a si defini-las no editor, e o agente lê-as tal como o ficheiro as guarda.
- Ativar ou desativar um [bloqueio](../guide/guides/settings.md#lock). Só `erd_import_json`, ao substituir o documento inteiro, altera os bloqueios ou as definições acima, para os do documento que carrega. Um documento sem o campo `lockSettings`, como um ficheiro guardado pela extensão do VS Code anterior à `4.0.0` ou pelo plugin do Obsidian ou da JetBrains anterior à `1.0.0`, ativa todos os bloqueios. Anular qualquer importação que tenha substituído o documento repõe as definições e os bloqueios que o documento tinha antes.
- Voltar a mapear uma relação para outras colunas, como faz a opção [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Em vez disso, o agente remove a relação, o que deixa as suas colunas de chave externa no lugar, e liga as colunas que pretende com `erd_link_columns`, num só `erd_batch` que uma única anulação reverte.
- Importar ou exportar um dicionário como CSV, ordenar uma folha ou inserir linhas acima ou abaixo de uma linha, como faz o separador [Dicionário](../guide/guides/dictionary.md). O agente adiciona, altera e remove linhas, muitas de uma vez num único `erd_batch`, e uma linha nova fica no fim da respetiva folha.
- Executar o Gerador de código. `erd_read` responde com DDL ou JSON, e é o próprio agente que escreve o código a partir daí.

## Como funciona {#how-it-works}

O servidor é um processo stdio que o seu cliente MCP inicia.
Em cada chamada, procura um editor que detenha o documento: uma janela do VS Code, uma janela de cofre do Obsidian ou um IDE da JetBrains, cada um com a extensão ou o plugin ERD Editor.

- **Em direto** — um editor tem o documento na área de trabalho, no cofre ou num dos projetos abertos, ou tem-no aberto. O servidor junta-se à sessão de edição desse editor e a edição chega ao editor: por guardar no VS Code, e guardada, tal como as suas edições, no Obsidian e num IDE da JetBrains.
- **Headless** — nenhum editor. O servidor carrega o ficheiro, aplica a edição e volta a escrever o ficheiro.
- **Recusado** — um editor detém o documento, mas tem o hub desativado. O servidor lê a partir do disco, mas não escreve nada, uma vez que o editor aberto poderia substituir o ficheiro da próxima vez que guardar. Um IDE da JetBrains com o hub ativado também se recusa a alterar um documento detido apenas por projetos em que não confia, embora o agente continue a poder lê-lo. Quando o hub do editor está ativado, mas a extensão ou o plugin ERD Editor desse editor utiliza um protocolo do hub que não é o do servidor, todas as chamadas sobre o documento são recusadas, incluindo as leituras, com `protocolMismatch` e uma mensagem que indica o lado a atualizar — consulte [Atualizar](./installation.md#updating).

Consulte [Em direto e headless](./live-and-headless.md) para conhecer os pormenores.

## Requisitos {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` ou posterior, para executar o servidor |
| Um cliente MCP | Claude Code, Codex ou qualquer cliente que consiga iniciar um servidor stdio |
| VS Code, para a edição em direto | `1.101.0` ou posterior, com a extensão ERD Editor `4.0.0` ou posterior |
| Obsidian, para a edição em direto | A aplicação para computador `1.5.7` ou posterior, com o plugin ERD Editor `1.0.0` ou posterior |
| Um IDE da JetBrains, para a edição em direto | Um IDE baseado no IntelliJ `2025.2` ou posterior, com o plugin ERD Editor `1.0.0` ou posterior |

O servidor `1.0.0` ou posterior e as versões acima utilizam o protocolo 2 do hub.
As versões anteriores que servem agentes utilizam o protocolo 1: a extensão do VS Code da `3.0.0` à `3.1.0`, o plugin do Obsidian `0.1.0` e `0.2.0` e o plugin da JetBrains `0.9.0` e `0.10.0`.
Uma dessas versões e o servidor `1.0.0` ou posterior recusam-se mutuamente, e o mesmo acontece com um servidor anterior e as versões acima — consulte [Atualizar](./installation.md#updating).
Uma extensão do VS Code anterior à `3.0.0` ou um plugin da JetBrains anterior à `0.9.0` não tem hub, pelo que o servidor não vê esse editor e edita o ficheiro no disco, mesmo que o diagrama esteja aberto nele.

As ferramentas para nomes lógicos, domínios e os dicionários requerem o servidor `1.1.0` ou posterior e, onde quer que o documento esteja aberto, pelo menos a extensão do VS Code `4.2.0` ou o plugin do Obsidian ou da JetBrains `1.2.0`.
Das versões acima, uma extensão anterior à `4.2.0` ou um plugin anterior à `1.2.0` continua a permitir que o agente edite em direto, uma vez que utiliza o protocolo 2, mas ignora os nomes lógicos, os vínculos a domínios e as linhas dos dicionários que o agente escreve, e deixa-os de fora quando guarda o ficheiro.
Um servidor anterior à `1.1.0` que edite um ficheiro no disco volta a escrevê-lo sem os respetivos nomes lógicos, vínculos a domínios e linhas dos dicionários — consulte [Atualizar](./installation.md#updating).

Seguinte: [Instalação](./installation.md).
