---
sidebar_position: 3
description: Cómo decide el servidor MCP entre editar en vivo en un editor (VS Code, Obsidian o un IDE de JetBrains) y editar el archivo en disco, y qué hacen en cada caso el guardado, el deshacer y un editor cerrado.
---

# En vivo y headless

En cada llamada, el servidor busca un editor que tenga el documento, a través de los archivos de bloqueo que los editores mantienen en `~/.erd-editor/ide/`.
Cada ventana de VS Code y cada ventana de bóveda de Obsidian con el ERD Editor mantiene uno, y un IDE de JetBrains mantiene uno para todo el IDE, que enumera todos los proyectos abiertos en él.
Un editor elimina su archivo de bloqueo al cerrarse.
Lo que encuentra el servidor decide adónde va la edición.

| Qué encuentra | Qué hace una edición |
| --- | --- |
| Un editor cuya área de trabajo, bóveda o proyecto abierto contiene el documento, o que lo tiene abierto | **En vivo.** Abre el documento en el ERD Editor si hace falta, se une a la sesión de edición y aplica allí el cambio. Las ediciones aparecen al instante y se guardan como el editor guarda las tuyas; consulta [Guardar](#saving). |
| Ningún editor | **Headless.** Carga el archivo, aplica el cambio y reemplaza el archivo. `erd_save` no tiene nada que hacer. |
| Un editor con el hub desactivado | **Rechazado.** Las lecturas siguen funcionando, desde el disco. Un cambio escrito en el archivo a espaldas de un editor abierto podría quedar sobrescrito en su siguiente guardado, así que el servidor no escribe nada. |
| Un editor cuyo hub está activado pero habla un protocolo distinto del que usa el servidor: con el servidor `1.0.0`, una extensión de VS Code `3.x`, un plugin de Obsidian `0.x` o un plugin de JetBrains `0.9.0` o `0.10.0`; con un servidor anterior a la `1.0.0`, la extensión `4.0.0` o posterior, o un plugin `1.0.0` o posterior | **Rechazado**, lecturas incluidas, con `protocolMismatch`. El mensaje indica qué lado hay que actualizar: la extensión o el plugin, o el servidor; consulta [Actualizar](./installation.md#updating). |
| En Windows, un editor que tiene el documento con otra ruta al mismo archivo: el agente lo indicó mediante un recurso compartido de red o una unidad asignada de este ordenador, como `\\localhost\C$\…`, y el editor lo tiene por su ruta de unidad, o al revés | **Rechazado**, lecturas incluidas, con `invalidPath`. El mensaje indica la ruta con la que el editor tiene el documento; vuelve a llamar con esa ruta. |
| En Windows, un editor al que Windows no deja acceder al agente: uno iniciado como administrador cuando el agente no se inició así, o cualquier editor cuando el agente se ejecuta en un entorno aislado | **Rechazado**, lecturas incluidas, con `hubUnreachable` y un mensaje que explica el motivo. Ejecuta el editor y el agente con los mismos privilegios, por ejemplo, volviendo a iniciar el editor sin privilegios de administrador. |

El resultado de una edición indica el modo en que se ejecutó, `live` o `headless`, y una edición rechazada indica el motivo.
La búsqueda se repite en cada llamada, así que abrir o cerrar un editor cambia adónde va la siguiente llamada.

Cuando más de un editor tiene el documento, uno que lo tiene abierto prevalece sobre uno que solo sirve una carpeta que lo contiene, y entre los que sirven una carpeta prevalece aquel cuya carpeta está a mayor profundidad.
Un empate, como dos editores que lo tienen abierto, se resuelve a favor de aquel cuyo archivo de bloqueo cambió más recientemente.
Así, un documento de una bóveda de Obsidian situada dentro de una carpeta del área de trabajo de VS Code va a Obsidian, salvo que VS Code lo tenga abierto y Obsidian no.

Las llamadas sobre un mismo documento se ejecutan de una en una, en el orden en que llegaron al servidor. Las llamadas sobre documentos distintos se ejecutan en paralelo.

## En vivo {#live}

El agente se une al editor como un colaborador más.
Sus ediciones llegan al instante a todos los editores que tienen abierto el documento, y su foco se dibuja en la tabla y la celda que está editando, como el de un colaborador; consulta [focusTracker](../api/advanced/collaborative-editing.md#focustracker).

Una lectura nunca abre un editor. Una edición abre el documento en el ERD Editor cuando aún no está abierto, sin tomar el foco del teclado.

### Guardar {#saving}

Cada editor guarda las ediciones del agente igual que guarda las tuyas.

En VS Code, las ediciones del agente marcan la pestaña con cambios sin guardar, igual que las tuyas, y solo llegan al disco cuando se guarda el documento.
`erd_save` lo guarda a través de VS Code, como hace su propio comando de guardar. En su lugar, puedes guardarlo tú, con `Ctrl + S` (Windows/Linux) o `⌘ + S` (Mac).
Al cerrar el editor con ediciones del agente sin guardar, se pregunta si guardarlas, como con cualquier otro cambio sin guardar.

Obsidian guarda las ediciones del agente unos dos segundos después de que se deje de editar, y al cerrar la pestaña las guarda sin preguntar.
Un IDE de JetBrains las escribe una fracción de segundo después de que se deje de editar, y al cerrar la pestaña escribe lo que aún esté pendiente; la pestaña nunca aparece como modificada.
En ambos, `erd_save` las escribe de inmediato.

`erd_save` espera primero hasta dos segundos a que el editor tenga todas las ediciones que hizo el agente.
Se rechaza con `notSaved` cuando el editor no pudo confirmarlo o no escribió el archivo: VS Code deja una pestaña sin guardar cuando el archivo ha cambiado en disco, y un IDE de JetBrains no ha podido escribirlo, por ejemplo, mientras había un cuadro de diálogo abierto o cuando no se puede escribir en el archivo.

En VS Code y en un IDE de JetBrains, `erd_save` sobre un documento sin nada pendiente de guardar tiene éxito y deja el archivo tal como está.
Es el caso una vez guardadas todas las ediciones, cosa que un IDE de JetBrains hace por sí solo, y sigue siéndolo mientras cada cambio posterior sea uno que un [bloqueo](../guide/guides/settings.md#lock) mantiene fuera del archivo, como desplazar o hacer zoom con `Viewport` bloqueado, o cambiar de pestaña con `Canvas Type` bloqueado. Todos los bloqueos están activados de forma predeterminada.
Un archivo en el que un IDE de JetBrains no puede escribir se rechaza incluso entonces.

Cuando el editor cierra el documento después de la última edición del agente, la siguiente llamada del agente incluye una nota que indica que esas ediciones solo están en el archivo si se guardaron antes de que se cerrara el editor.

### Deshacer {#undo}

`erd_undo` revierte la última edición que hizo el agente, nunca las tuyas, y `erd_redo` la vuelve a aplicar.
La acción [Deshacer](../guide/guides/undo-redo.md) del propio editor funciona al revés: revierte tus ediciones y nunca las del agente, ya que los cambios que llegan desde otro editor no se registran en tu historial.

Algunas ediciones no crean ninguna entrada de deshacer en el editor: `erd_set_database` y `erd_set_database_name`, entre las [herramientas de ajustes](./tools.md#settings), y `erd_resize_memo`.
Tampoco la crea un `erd_move_table_group` que mueve el grupo menos de 20 píxeles en total, sumando el desplazamiento horizontal y el vertical, aunque el grupo se queda donde se movió.
Una llamada que no cambia nada tampoco crea ninguna: `erd_set_column_primary_key`, `erd_set_column_unique`, `erd_set_column_not_null`, `erd_set_column_auto_increment`, `erd_set_index_unique` o `erd_set_index_column_order` cuando establecen un valor que el documento ya tiene; `erd_add_index_column` con una columna que ya está en el índice; `erd_set_table_group` con tablas que ya están en ese grupo (o que ya están sin grupo, con `groupId` `null`); `erd_move_table_group` al punto donde ya está el grupo; `erd_resize_table_group` al rectángulo que ya tiene el grupo; `erd_sort_tables` en un documento sin tablas; o una importación con `mode` `append` que no aporta ninguna tabla (en el caso de `erd_import_json`, ninguna tabla y ninguna nota).
`erd_undo` las omite y las indica en su resultado.
Otras ediciones, como `erd_change_relationship_type`, `erd_change_relationship_on_delete`, `erd_change_relationship_on_update`, `erd_change_table_group_name`, `erd_change_table_group_color` y `erd_set_ddl_script`, crean una entrada incluso cuando establecen un valor que el documento ya tiene.

El historial de deshacer del agente termina, con una nota en el resultado, cuando:

- El agente vuelve a unirse al documento, por ejemplo, después de que el editor lo haya sacado de él.
- El editor se cierra, o cierra el documento y deja de servirlo, y el agente sigue editando el archivo en disco.
- Un editor se hace cargo de un documento que el agente estaba editando en disco.

El servidor también cierra un documento sobre el que el agente no ha hecho ninguna llamada durante 30 minutos, y el historial de deshacer desaparece con él, sin ninguna nota.

### Cuando el editor desaparece {#when-the-editor-goes-away}

Mientras un editor tiene un documento, el servidor nunca recurre al archivo por su cuenta.
Si se cae la conexión, vuelve a conectarse.
Solo cuando el editor se ha cerrado, o ha cerrado el documento y ya no lo enumera ni enumera una carpeta que lo contenga, el servidor edita el archivo, y lo indica en el resultado.
Eso ocurre cuando cierras un diagrama que está fuera de todas las carpetas que sirve el editor (en VS Code, uno abierto desde fuera del área de trabajo), cuando desactivas el plugin ERD Editor en Obsidian y cuando cierras el proyecto que contiene el documento en un IDE de JetBrains o desactivas allí el plugin.
Un diagrama cerrado dentro de una carpeta que sirve el editor sigue con el editor, y la siguiente edición del agente lo vuelve a abrir.

Un editor que sigue en ejecución, pero cuyo archivo de bloqueo ha desaparecido y cuya conexión se cerró sin que cerrara el documento, rechaza la siguiente edición con `hubGone`.
El mensaje indica qué libera el documento: en VS Code, recarga esa ventana o ciérrala para que el agente edite el archivo directamente; en Obsidian, vuelve a activar el plugin ERD Editor o cierra esa ventana; en un IDE de JetBrains, vuelve a activar el plugin o cierra el IDE.

Una lectura va en su lugar al archivo en disco, con una nota que indica que faltan las ediciones aún no guardadas en el editor, en dos casos: cuando el editor que tiene el documento tiene el hub desactivado y en el caso de `hubGone` descrito arriba.
Una lectura que no puede conectarse al hub de un editor se rechaza con `hubUnreachable`, igual que una edición.

## Headless {#headless}

Sin ningún editor que sirva el documento, cada edición carga el archivo, aplica el cambio y vuelve a escribir el archivo.
La escritura va a un archivo temporal junto al documento, llamado `.<name>.<id>.tmp`, que luego lo reemplaza, de modo que el documento nunca queda escrito a medias, salvo en Windows, en el caso de escritura en el propio archivo que se describe más abajo.

Antes de ese último paso, el servidor comprueba si el archivo cambió en disco durante la llamada.
Si cambió, no se escribe nada, el archivo se vuelve a cargar y la llamada se rechaza con `conflict`. El agente vuelve a llamar.
Un archivo que cambió entre dos llamadas simplemente se vuelve a cargar, y se descarta el historial de deshacer del agente anterior a ese momento.

Un archivo de solo lectura se deja tal como está, y la edición se rechaza con `readonly`: un archivo sin permiso de escritura para su propietario, o con el atributo de solo lectura en Windows, como un archivo de Perforce o TFVC que no se ha desprotegido.
Haz que se pueda escribir en él y vuelve a llamar. Las lecturas siguen funcionando.

Si un editor empieza a servir el documento mientras el agente lo edita en disco, esa única edición se rechaza con `hubAppeared` y no se escribe nada. La siguiente llamada edita a través del editor.

En Windows se aplican dos reglas más:

- Un documento con permisos propios, distintos de los de su carpeta, se escribe en el propio archivo en lugar de reemplazarse, para que los conserve, y el archivo temporal se elimina después. Un programa que lea el documento durante esa escritura puede encontrar texto que no se puede analizar.
- Un archivo que otro programa tiene abierto no se puede reemplazar, así que el servidor lo vuelve a intentar durante un máximo de dos segundos. Cada intento vuelve a buscar primero un editor, y un editor que haya empezado a servir el documento entretanto rechaza la escritura con `hubAppeared`, o con `blocked` cuando tiene el hub desactivado. Si otro programa sigue teniendo abierto el archivo al cabo de dos segundos, no se escribe nada, el archivo se vuelve a cargar y la llamada falla con un mensaje que cita el error del sistema.

## Rechazado {#refused}

Una ventana de VS Code mantiene su archivo de bloqueo incluso con el hub desactivado: cuando `dineug.erd-editor.agentHub.enabled` está desactivado, cuando el área de trabajo no es de confianza o cuando su hub no pudo escuchar.
Una ventana de bóveda de Obsidian mantiene su archivo de bloqueo con el hub desactivado cuando Coding agents está desactivado y cuando su hub no pudo escuchar.
Un IDE de JetBrains mantiene su archivo de bloqueo con el hub desactivado cuando Coding agents está desactivado, cuando su hub no pudo escuchar y mientras el IDE se cierra.

Una edición de un documento así se rechaza con `blocked`, porque el editor abierto podría sobrescribir en su siguiente guardado un cambio escrito en el archivo.
Las lecturas siguen funcionando, desde el archivo en disco.

Para que el agente pueda editar, vuelve a activar el hub, como indica el mensaje para ese editor: en VS Code, confía en el área de trabajo y activa el ajuste, o recarga la ventana; en Obsidian, activa Coding agents o recarga Obsidian; en un IDE de JetBrains, activa Coding agents o reinicia el IDE si ya está activado.

Un IDE de JetBrains también se niega, con `hubDisabled`, a cambiar un documento que solo tienen proyectos en los que no confía.
Los agentes pueden seguir leyendo un documento así, y `erd_list_documents` lo enumera como `readonly`. Confía en el proyecto y vuelve a llamar.

Un editor que no mantiene ningún archivo de bloqueo no protege nada, y el agente edita el archivo en disco incluso mientras el diagrama está abierto en él.
Es el caso de Obsidian o un IDE de JetBrains instalados como Flatpak en Linux, de un IDE de JetBrains sin JCEF y de un IDE de JetBrains cuyo hub no pudo iniciarse; consulta [Configurar Obsidian](./installation.md#set-up-obsidian) y [Configurar un IDE de JetBrains](./installation.md#set-up-a-jetbrains-ide).
Una extensión de VS Code anterior a la `3.0.0` y un plugin de JetBrains anterior a la `0.9.0` tampoco mantienen ninguno, ya que no tienen hub.

## Documentos {#documents}

Un documento se indica por su `path`, absoluto o relativo al directorio de trabajo del servidor.

- Los documentos nuevos son `.erd.json`. `erd_open_document` con `create` crea el archivo y añade `.erd.json` a un nombre que no tiene extensión. Como un diagrama nuevo en el editor, el documento nuevo tiene todos los [bloqueos](../guide/guides/settings.md#lock) activados, así que desplazar, hacer zoom, cambiar de pestaña o elegir otro lenguaje del Generador de código, estilo de nombres o tipo de delimitador en un editor nunca cambia el archivo. Ninguna herramienta activa ni desactiva un bloqueo concreto: eso lo haces tú en la pestaña Configuración del editor. `erd_import_json` en modo `replace` los reemplaza todos por los del documento que carga; consulta [Importación](./tools.md#import).
- También se abren los archivos `.erd`, `.vuerd` y `.vuerd.json` existentes. Una ruta con cualquier otra extensión se rechaza con `invalidPath`.
- En Windows, una ruta que contiene un nombre que Windows no almacena tal como está escrito se rechaza con `invalidPath` antes de leer o escribir el documento, lecturas incluidas: un nombre con dos puntos u otro carácter que Windows rechaza, como `orders:v2.erd`; un nombre de dispositivo como `NUL.erd` o `CON.erd`, con cualquier combinación de mayúsculas y minúsculas; o un nombre que termina en punto o en espacio. Cámbiale el nombre, por ejemplo, con `-` en lugar de `:`.
- Un archivo que no es un documento que el editor pueda leer, como uno que haya quedado con marcadores de conflicto de fusión, se rechaza con `invalidDocument` y se deja tal como está. Nunca se carga como un diagrama vacío ni se vuelve a escribir.

El agente solo cambia un documento a través de las herramientas y tiene instrucciones de no escribir nunca el archivo por sí mismo.

`erd_list_documents` enumera los documentos con `path`, `open`, `active`, `dirty` y `readonly`.
Consulta al editor que sirve el directorio de trabajo, elegido como para un documento, y enumera los diagramas abiertos en él y, a continuación, los archivos ERD que sirve: los de las carpetas del área de trabajo de una ventana de VS Code, los de una bóveda de Obsidian o los de todos los proyectos abiertos en un IDE de JetBrains.
Si no lo hay, enumera los archivos ERD que hay dentro del directorio de trabajo, donde un archivo de solo lectura se marca como `readonly` y, en Windows, se omite un nombre que Windows no almacena tal como está escrito.
