---
sidebar_position: 1
description: Deja que un agente de programación como Claude Code o Codex edite diagramas de erd-editor a través del servidor MCP @dineug/erd-editor-mcp, en vivo en VS Code, Obsidian o un IDE de JetBrains, o directamente en disco.
---

# Introducción

`@dineug/erd-editor-mcp` es un servidor MCP que permite a un agente de programación editar diagramas de erd-editor.
Claude Code, Codex y cualquier otro cliente del [Model Context Protocol](https://modelcontextprotocol.io) disponen de una herramienta por cada operación sobre un documento: añadir una tabla, cambiar el nombre de una columna, relacionar dos tablas, importar un volcado DDL, leer el esquema como SQL.

Cuando el documento está abierto en el ERD Editor de [VS Code](https://marketplace.visualstudio.com/items?itemName=dineug.vuerd-vscode), [Obsidian](https://community.obsidian.md/plugins/erd-editor) o un [IDE de JetBrains](https://plugins.jetbrains.com/plugin/23594-erd-editor), el agente se une al editor como un colaborador.
Cada cambio aparece en el lienzo en el momento en que se produce, y el deshacer del agente revierte solo sus propias ediciones.
VS Code mantiene sin guardar los cambios del agente hasta que los guarde el agente o los guardes tú, mientras que Obsidian y un IDE de JetBrains los guardan como guardan los tuyos.
Si ningún editor tiene el documento, las mismas herramientas editan el propio archivo.

![Un agente de programación añade tablas y relaciones a un diagrama abierto en VS Code](/img/coding-agents.webp)

## Qué puede hacer un agente {#what-an-agent-can-do}

- Crear o modificar un esquema en una conversación: tablas, columnas y todas las opciones de columna, relaciones con su cardinalidad y sus acciones ON DELETE y ON UPDATE, índices, notas, colores y posiciones en el lienzo. Consulta [Relaciones](./tools.md#relationships).
- Reunir tablas en [grupos de tablas](../guide/guides/table-groups.md): añadir un grupo alrededor de las tablas que indica o sobre un área del lienzo y, después, cambiarle el nombre, darle color, moverlo con sus tablas, cambiar su tamaño, añadirle o quitarle tablas, o eliminarlo, lo que deja sus tablas donde están. Consulta [Grupos de tablas](./tools.md#table-groups).
- Reemplazar el documento por un esquema analizado a partir de SQL DDL, GraphQL SDL, DBML o AML, o por otro documento `.erd.json`. O bien añadir ese esquema o documento debajo del diagrama y conservar todo lo que ya hay, como hace la opción [`Import and Add`](../guide/guides/file-import-export.md#import-and-add) del editor. Un `TableGroup` de DBML se convierte en un grupo de tablas en ambos casos. Consulta [Importación](./tools.md#import).
- Leer el diagrama como una lista de ids, como entidades completas, como el texto `.erd.json` que se escribe al guardar o como DDL para cualquiera de las ocho bases de datos, con las opciones `Statements` y `Header` de la pestaña [Esquema SQL](../guide/guides/schema-sql.md). En un esquema de miles de tablas, lee una página, unas pocas tablas o las tablas de unos pocos grupos de tablas cada vez. Consulta [Leer un documento](./tools.md#reading-a-document).
- Establecer la base de datos, el nombre de la base de datos y los [scripts](../guide/guides/schema-sql.md#before-and-after-scripts) que se escriben antes y después de las tablas en el Esquema SQL, como un `CREATE EXTENSION` delante de ellas o un `GRANT` detrás. `erd_read` devuelve los scripts solos, o dentro del DDL de todo el documento. Consulta [Ajustes](./tools.md#settings).
- Ejecutar varias ediciones como una sola, todas o ninguna, que se revierten con un solo deshacer. Consulta [erd_batch](./tools.md#erd_batch).
- Deshacer y rehacer sus propias ediciones, nunca las tuyas.

Lo que no hace:

- Hacer zoom, desplazar la vista o cambiar de pestaña. Eso corresponde a cada persona que ve el diagrama, así que ninguna herramienta lo hace. Aun así, una importación que reemplaza el documento mueve la vista, incluso con `Viewport` bloqueado, como hace el submenú `Import` del editor: vuelve al inicio del lienzo al 100 % o, con `erd_import_json`, a la vista del documento que carga, y también a su pestaña, salvo que ese documento bloquee `Canvas Type`. Consulta [Importación](./tools.md#import).
- Cambiar el menú [`View Option`](../guide/guides/table-related-functions.md#table-view-options), el lenguaje y los estilos de nombres del Generador de código, el tipo de delimitador o los ajustes `Relationship DataType Sync`, `Maximum comment width` y `Column Order` de la pestaña [Configuración](../guide/guides/settings.md). Esos los ajustas tú en el editor, y el agente los lee tal como los guarda el archivo.
- Activar o desactivar un [bloqueo](../guide/guides/settings.md#lock). Solo `erd_import_json`, al reemplazar todo el documento, cambia los bloqueos o los ajustes indicados arriba, que pasan a ser los del documento que carga. Un documento sin campo `lockSettings`, como un archivo guardado por la extensión de VS Code anterior a la `4.0.0` o por el plugin de Obsidian o de JetBrains anterior a la `1.0.0`, activa todos los bloqueos. Deshacer cualquier importación que haya reemplazado el documento restablece los ajustes y los bloqueos que el documento tenía antes.
- Reasignar una relación a otras columnas, como hace el cuadro de diálogo [`Map Columns`](../guide/guides/relationship-editing.md#map-columns). En su lugar, el agente elimina la relación, lo que deja en su sitio sus columnas de clave externa, y vincula las columnas que quiere con `erd_link_columns`, en un solo `erd_batch` que se revierte con un solo deshacer.
- Ejecutar el Generador de código. `erd_read` responde con DDL o JSON, y el propio agente escribe el código a partir de ello.

## Cómo funciona {#how-it-works}

El servidor es un proceso stdio que inicia tu cliente MCP.
En cada llamada busca un editor que tenga el documento: una ventana de VS Code, una ventana de bóveda de Obsidian o un IDE de JetBrains, cada uno con la extensión o el plugin ERD Editor.

- **En vivo**: un editor tiene el documento en su área de trabajo, en su bóveda o en uno de sus proyectos abiertos, o lo tiene abierto. El servidor se une a la sesión de edición de ese editor y la edición llega al editor: sin guardar en VS Code, y guardada igual que tus propias ediciones en Obsidian y en un IDE de JetBrains.
- **Headless**: no hay ningún editor. El servidor carga el archivo, aplica la edición y vuelve a escribir el archivo.
- **Rechazado**: un editor tiene el documento, pero con el hub desactivado. El servidor lee desde el disco pero no escribe nada, ya que el editor abierto podría sobrescribir el archivo en su siguiente guardado. Un IDE de JetBrains con el hub activado también se niega a modificar un documento que solo tienen proyectos en los que no confía, aunque el agente aún puede leerlo. Cuando el hub del editor está activado pero su extensión o plugin ERD Editor habla un protocolo de hub distinto del que usa el servidor, se rechaza toda llamada sobre el documento, incluidas las lecturas, con `protocolMismatch` y un mensaje que indica qué lado hay que actualizar; consulta [Actualizar](./installation.md#updating).

Consulta [En vivo y headless](./live-and-headless.md) para ver los detalles.

## Requisitos {#requirements}

| | |
| --- | --- |
| Node.js | `22.12` o posterior, para ejecutar el servidor |
| Un cliente MCP | Claude Code, Codex o cualquier cliente que pueda iniciar un servidor stdio |
| VS Code, para la edición en vivo | `1.101.0` o posterior, con la extensión ERD Editor `4.0.0` o posterior |
| Obsidian, para la edición en vivo | La aplicación de escritorio `1.5.7` o posterior, con el plugin ERD Editor `1.0.0` o posterior |
| Un IDE de JetBrains, para la edición en vivo | Un IDE basado en IntelliJ `2025.2` o posterior, con el plugin ERD Editor `1.0.0` o posterior |

El servidor `1.0.0` y las versiones indicadas arriba usan el protocolo 2 del hub.
Las versiones anteriores que dan servicio a agentes usan el protocolo 1: la extensión de VS Code de la `3.0.0` a la `3.1.0`, el plugin de Obsidian `0.1.0` y `0.2.0`, y el plugin de JetBrains `0.9.0` y `0.10.0`.
Una versión así y el servidor `1.0.0` se rechazan mutuamente, y lo mismo ocurre con un servidor anterior y las versiones indicadas arriba; consulta [Actualizar](./installation.md#updating).
Una extensión de VS Code anterior a la `3.0.0` o un plugin de JetBrains anterior a la `0.9.0` no tiene hub, así que el servidor no lo detecta y edita el archivo en disco, incluso si el diagrama está abierto en él.

Siguiente: [Instalación](./installation.md).
