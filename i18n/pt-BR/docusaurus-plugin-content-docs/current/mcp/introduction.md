---
sidebar_position: 1
description: Permitir que um agente de codificação, como o Claude Code ou o Codex, edite diagramas do erd-editor por meio do servidor MCP @dineug/erd-editor-mcp, ao vivo no VS Code, no Obsidian ou em uma IDE da JetBrains, ou diretamente em disco.
---

# Introdução

`@dineug/erd-editor-mcp` é um servidor MCP que permite que um agente de codificação edite diagramas do erd-editor.
O Claude Code, o Codex e qualquer outro cliente do [Model Context Protocol](https://modelcontextprotocol.io) recebem uma ferramenta para cada operação em um documento: adicionar uma tabela, renomear uma coluna, relacionar duas tabelas, importar um dump de DDL, ler o esquema de volta como SQL.

Quando o documento está aberto no ERD Editor do [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), do [Obsidian](https://community.obsidian.md/plugins/erd-editor) ou de uma [IDE da JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), o agente entra no editor como um colaborador.
Cada alteração aparece no canvas assim que acontece, e o desfazer do agente reverte apenas as edições do próprio agente.
O VS Code mantém as alterações do agente não salvas até que o agente ou você salve, enquanto o Obsidian e uma IDE da JetBrains as salvam como salvam as suas.
Sem nenhum editor que mantenha o documento, as mesmas ferramentas editam o próprio arquivo.

![Um agente de codificação adicionando tabelas e relacionamentos a um diagrama aberto no VS Code](/img/coding-agents.webp)

## O que um agente pode fazer {#what-an-agent-can-do}

- Criar ou alterar um esquema em uma conversa: tabelas, colunas e todas as opções de coluna, relacionamentos com sua cardinalidade e suas ações ON DELETE e ON UPDATE, índices, notas, cores e posições no canvas. Consulte [Relacionamentos](./tools.md#relationships).
- Reunir tabelas em [grupos de tabelas](../guide/guides/table-groups.md): adicionar um grupo em torno das tabelas que o agente indica ou sobre uma área do canvas e, depois, renomeá-lo, colori-lo, movê-lo com suas tabelas, redimensioná-lo, colocar tabelas nele ou retirá-las, ou removê-lo, o que deixa as tabelas dele onde estão. Consulte [Grupos de tabelas](./tools.md#table-groups).
- Substituir o documento por um esquema analisado a partir de SQL DDL, GraphQL SDL, DBML ou AML, ou por outro documento `.erd.json`. Ou adicionar esse esquema ou documento abaixo do diagrama e manter tudo o que já está nele, como faz o item [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) do editor. Nos dois casos, um `TableGroup` do DBML chega como um grupo de tabelas. Consulte [Importação](./tools.md#import).
- Ler o diagrama de volta como uma lista de ids, como entidades inteiras, como o texto `.erd.json` que um salvamento grava ou como DDL para qualquer um dos oito bancos de dados, com as opções `Statements` e `Header` da aba [Esquema SQL](../guide/guides/schema-sql.md). Em um esquema de milhares de tabelas, o agente lê uma página, algumas tabelas ou as tabelas de alguns grupos de tabelas por vez. Consulte [Ler um documento](./tools.md#reading-a-document).
- Definir o banco de dados, o nome do banco de dados e os [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) escritos antes e depois das tabelas no Esquema SQL, como `CREATE EXTENSION` antes delas ou `GRANT` depois delas. A ferramenta `erd_read` retorna os scripts sozinhos ou dentro do DDL do documento inteiro. Consulte [Configurações](./tools.md#settings).
- Executar várias edições como uma só, todas ou nenhuma, que um único desfazer reverte. Consulte [erd_batch](./tools.md#erd_batch).
- Desfazer e refazer as próprias edições, nunca as suas.

O que o agente não faz:

- Aplicar zoom, rolar ou trocar de aba. Isso pertence a cada usuário que visualiza o documento, por isso nenhuma ferramenta o faz. Uma importação que substitui o documento ainda move a área visível, mesmo com `Viewport` bloqueado, como faz o `Import` do editor: de volta ao início do canvas em 100% ou, com `erd_import_json`, para a área visível do documento que ela carrega e também para a aba dele, a menos que esse documento bloqueie `Canvas Type`. Consulte [Importação](./tools.md#import).
- Alterar as opções de [`View Option`](../guide/guides/table-related-functions.md#table-view-options), a linguagem e os estilos de nome do Gerador de código, o tipo de delimitador ou as opções `Relationship DataType Sync`, `Maximum comment width` e `Column Order` da aba [Configurações](../guide/guides/settings.md). Cabe a você definir tudo isso no editor, e o agente lê esses valores como o arquivo os salva.
- Ativar ou desativar um [bloqueio](../guide/guides/settings.md#lock). Somente a ferramenta `erd_import_json`, ao substituir o documento inteiro, altera os bloqueios ou as configurações acima, para os do documento que ela carrega. Um documento sem o campo `lockSettings`, como um arquivo salvo pela extensão do VS Code anterior à `4.0.0` ou pelo plugin do Obsidian ou da JetBrains anterior à `1.0.0`, ativa todos os bloqueios. Desfazer qualquer importação que substituiu o documento traz de volta as configurações e os bloqueios que o documento tinha antes.
- Remapear um relacionamento para outras colunas, como faz a caixa de diálogo [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). Em vez disso, o agente remove o relacionamento, o que deixa as colunas de chave estrangeira dele no lugar, e liga as colunas que deseja com `erd_link_columns`, em um só `erd_batch` que um único desfazer reverte.
- Executar o Gerador de código. A ferramenta `erd_read` responde com DDL ou JSON, e o próprio agente escreve o código a partir disso.

## Como funciona {#how-it-works}

O servidor é um processo stdio que seu cliente MCP inicia.
A cada chamada, ele procura um editor que mantenha o documento: uma janela do VS Code, uma janela de cofre do Obsidian ou uma IDE da JetBrains, cada uma com a extensão ou o plugin ERD Editor.

- **Ao vivo** — um editor tem o documento em seu espaço de trabalho, em seu cofre ou em um de seus projetos abertos, ou o tem aberto. O servidor entra na sessão de edição desse editor e a edição chega ao editor: fica não salva no VS Code e é salva como as suas próprias edições no Obsidian e em uma IDE da JetBrains.
- **Headless** — nenhum editor. O servidor carrega o arquivo, aplica a edição e grava o arquivo de volta.
- **Recusado** — um editor mantém o documento, mas está com o hub desativado. O servidor lê do disco, mas não grava nada, pois o editor aberto poderia sobrescrever o arquivo no próximo salvamento. Uma IDE da JetBrains com o hub ativado também se recusa a alterar um documento mantido apenas por projetos em que ela não confia, embora o agente ainda possa lê-lo. Quando o hub do editor está ativado, mas a extensão ou o plugin ERD Editor dele usa um protocolo do hub diferente do usado pelo servidor, toda chamada sobre o documento é recusada, incluindo as leituras, com `protocolMismatch` e uma mensagem que indica o lado a atualizar — consulte [Atualizar](./installation.md#updating).

Consulte [Ao vivo e headless](./live-and-headless.md) para ver os detalhes.

## Requisitos {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` ou posterior, para executar o servidor |
| Um cliente MCP | Claude Code, Codex ou qualquer cliente capaz de iniciar um servidor stdio |
| VS Code, para a edição ao vivo | `1.101.0` ou posterior, com a extensão ERD Editor `4.0.0` ou posterior |
| Obsidian, para a edição ao vivo | O aplicativo para desktop `1.5.7` ou posterior, com o plugin ERD Editor `1.0.0` ou posterior |
| Uma IDE da JetBrains, para a edição ao vivo | Uma IDE baseada no IntelliJ `2025.2` ou posterior, com o plugin ERD Editor `1.0.0` ou posterior |

O servidor `1.0.0` e as versões acima usam o protocolo 2 do hub.
As versões anteriores que atendem agentes usam o protocolo 1: a extensão do VS Code da `3.0.0` à `3.1.0`, o plugin do Obsidian nas versões `0.1.0` e `0.2.0` e o plugin da JetBrains nas versões `0.9.0` e `0.10.0`.
Uma versão assim e o servidor `1.0.0` se recusam mutuamente, assim como um servidor anterior e as versões acima — consulte [Atualizar](./installation.md#updating).
Uma extensão do VS Code anterior à `3.0.0` ou um plugin da JetBrains anterior à `0.9.0` não tem hub, então o servidor não enxerga esse editor e edita o arquivo em disco, mesmo o de um diagrama aberto nele.

Próximo: [Instalação](./installation.md).
