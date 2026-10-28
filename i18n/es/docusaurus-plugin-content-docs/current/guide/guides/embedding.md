---
sidebar_position: 18
description: Muestra un diagrama en solo lectura en otro sitio sin código enmarcando erd-editor.io/embed, construye su URL y su línea de iframe en el generador, define el tema, el idioma, la vista de nombres, el minimapa, los controles y los colores en la URL, y sirve el archivo desde GitHub o desde un servidor que permita CORS.
---

# Incrustación

[erd-editor.io/embed](https://erd-editor.io/embed) muestra un diagrama en solo lectura en un visor que ocupa la página, para que lo enmarque otro sitio: una wiki, un blog, un creador de sitios o cualquier página que no pueda cargar scripts propios.  
Su parámetro `src` nombra el documento, la dirección de un archivo tal como lo guarda ERD Editor, como un archivo `.erd.json`. El resto de la URL define cómo lo muestra el visor, y el generador de la misma dirección escribe por ti la URL y su línea de iframe.

<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style={{ border: 0 }} loading="lazy" title="ERD Editor"></iframe>

Este marco muestra [`data/embed-small.erd.json`](https://github.com/dineug/erd-editor/blob/main/data/embed-small.erd.json) del repositorio de erd-editor, y esta es la línea que lo pone en una página:

```html
<iframe src="https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fembed-small.erd.json" width="100%" height="480" style="border: 0" loading="lazy" title="ERD Editor"></iframe>
```

## Qué muestra el marco {#what-the-frame-shows}

El marco muestra las tablas, columnas, relaciones, notas y grupos de tablas del diagrama, y nada en él edita el diagrama ni el archivo.  
El diagrama se ajusta al marco al cargarse, sea cual sea el zoom y la posición de desplazamiento con que se guardó el archivo, así que el tamaño del marco decide el zoom con el que se abre.

Sobre el lienzo hay:

- El minimapa, mientras el diagrama tiene contenido.
- La barra de controles en la parte inferior: `Zoom out`, el nivel de zoom, que restablece el zoom al hacer clic en él, `Zoom in`, `Fit`, la lista `Name View` y `Go to content` mientras nada del diagrama está en pantalla.
- El enlace `erd-editor.io` en la parte inferior derecha, que abre erd-editor.io en una pestaña nueva y no le envía ningún referrer, así que el clic no cuenta al sitio nada del documento que muestra el marco. En un marco estrecho puede cubrir parte de la barra de controles.

Mientras se carga el archivo, el marco muestra `Loading diagram`. Si no se puede descargar o no contiene ningún documento, el marco muestra un diagrama vacío con `Couldn't load the diagram`; consulta [Archivos en GitHub](#files-on-github) y [Archivos en otros servidores](#files-on-other-servers).

El marco sigue solo su URL y el sistema del visitante. El idioma y el tema propios de un visitante en erd-editor.io no se aplican en él.

## El generador {#the-builder}

Abre [erd-editor.io/embed](https://erd-editor.io/embed) sin `src` para obtener el generador, una página titulada `Embed a diagram`:

1. Pega la dirección del documento en `Document URL`. Se aplica al pulsar `Enter` o al salir del campo, así que escribir no descarga nada. Una vez aplicada, una línea `Loads from` bajo el campo nombra la dirección que descarga el visor: la que diste o, para una página de GitHub, su dirección en el host raw de GitHub; consulta [Archivos en GitHub](#files-on-github).
2. Elige las opciones. Cada una se aplica al instante a la vista previa, a la URL y a la línea de iframe:
   - `Theme`: `System`, `Light` o `Dark`.
   - `Display Language`: `System`, con el idioma que representa en tu navegador a su lado, y luego los 25 idiomas, cada uno con su propio nombre.
   - `Name View`: `As Saved`, `Physical Names`, `Logical Names` o `Both Names`. `As Saved` muestra la vista de nombres que guardó el archivo.
   - `Accent color` y `Gray color`, cada uno listado por nombre con una muestra.
   - `Minimap` y `Controls`, dos interruptores, ambos activados.
   - `Height`, en píxeles, `480` para empezar. Una altura que no es un entero positivo cuenta como `480`.
3. Comprueba la `Preview`: el visor tal como lo mostrará el marco, con el enlace `erd-editor.io`, en una caja tan alta como `Height`. Su idioma `System` es el de tu navegador, sea cual sea el idioma que muestre el propio erd-editor.io.
4. Copia el resultado. `Embed URL` es la dirección del marco, y `Embed code` la línea de iframe, con la altura que definiste y el ancho `100%`. Cada uno tiene un botón `Copy`, que se queda desactivado hasta que se aplica una URL de documento, y que dice `Copied` un momento tras una copia, hasta que un cambio reescribe lo que copió.

Vaciar `Document URL` vacía la vista previa y los dos resultados en cuanto se aplica.

## Parámetros de la URL {#url-parameters}

| Parámetro | Valores | Valor predeterminado |
| --- | --- | --- |
| `src` | La dirección del documento, codificada como URL. | Ninguno: sin él, o con uno vacío, la página es el generador. |
| `theme` | `light`, `dark` o `system`. | `system`: el modo claro u oscuro que indica el navegador del visitante. |
| `locale` | `system`, o un código de la [tabla de idiomas](./language-and-theme.md#display-language), como `de-DE`. | `system`: los idiomas del navegador del visitante, emparejados como los empareja [System](./language-and-theme.md#what-system-follows), y el inglés cuando el visor no tiene ninguno de ellos. |
| `name-view` | `physical`, `logical` o `both`. | La vista de nombres que guardó el archivo. |
| `minimap` | `false` oculta el minimapa. | Mostrado. |
| `controls` | `false` oculta la barra de controles. | Mostrada. |
| `accent-color` | Uno de los 26 colores de énfasis del [generador de temas](./language-and-theme.md#theme), como `jade`. | `indigo` |
| `gray-color` | `gray`, `mauve`, `slate`, `sage`, `olive` o `sand`. | `slate` |

Los valores predeterminados son los del propio visor, no los de la aplicación web, que empieza en `jade` y `olive`.

- El generador deja fuera de la URL cada opción que está en su valor predeterminado, así que una URL de incrustación contiene solo lo que difiere.
- Un valor que el visor no admite se ignora, y su opción conserva el valor predeterminado. Los valores se comparan exactamente como se listan, así que `theme=Dark` se ignora, y `minimap` y `controls` siguen mostrándose con cualquier valor que no sea `false`.
- Un parámetro dado dos veces toma su primer valor.
- `src` se codifica como URL, como lo escribe el generador, ya que una dirección que contiene un `&` o un `#` propios se corta si no.

## Archivos en GitHub {#files-on-github}

Un archivo o un gist de GitHub se puede dar con la dirección que muestra su página, como el marco de arriba. En su lugar, el visor lo descarga del host raw de GitHub, que responde a la petición de otro sitio donde la dirección de la propia página no lo hace:

- La página de un archivo, `https://github.com/<owner>/<repo>/blob/<ref>/<path>`, o su dirección `raw`, `https://github.com/<owner>/<repo>/raw/<ref>/<path>`, se carga desde `https://raw.githubusercontent.com/<owner>/<repo>/<ref>/<path>`. `<ref>` es una rama, una etiqueta o un commit: una rama muestra el archivo tal como lo tiene esa rama, y una etiqueta o un commit conserva esa versión.
- La página de un gist, `https://gist.github.com/<user>/<id>`, se carga desde `https://gist.githubusercontent.com/<user>/<id>/raw`, que es el primer archivo del gist. Conserva el diagrama como único archivo del gist.

La URL de incrustación conserva la dirección que diste, y la línea `Loads from` del generador muestra la que se descarga.  
Esto funciona solo para repositorios públicos y gists públicos. El host raw guarda en caché cada archivo cinco minutos, así que un cambio que subas puede tardar ese tiempo en verse en el marco.

## Archivos en otros servidores {#files-on-other-servers}

El visor de erd-editor.io descarga el archivo con un `GET` simple desde el navegador del visitante, así que el servidor que lo contiene tiene que permitir esa petición entre orígenes (CORS): su respuesta necesita una cabecera `Access-Control-Allow-Origin` que permita `https://erd-editor.io`, como `*`.  
La petición no lleva cookies, así que el archivo tiene que poder leerse sin iniciar sesión.  
Sin esa cabecera, o con una dirección que responde con un error o con algo que no es un documento de ERD Editor, el marco muestra `Couldn't load the diagram`.

## En el marco {#in-the-frame}

El marco no toma ninguna rueda, gesto ni tecla hasta que un visitante hace clic o toca en él, o llega a él con `Tab`. Hasta entonces, la rueda, un deslizamiento y un gesto de pellizco desplazan o amplían la página que lo rodea como de costumbre.  
Una vez que tiene el foco, la rueda desplaza el diagrama, `Ctrl + Wheel` (Windows/Linux) o `⌘ + Wheel` (Mac) y un pellizco hacen zoom en él, y `Ctrl + K` (Windows/Linux) o `⌘ + K` (Mac) abre una búsqueda en el documento, donde `#` encuentra una tabla, `@` una columna y `:` un comentario o una nota.  
Un arrastre desplaza el diagrama tenga o no el marco el foco, y un clic o un toque ilumina relaciones: las de la tabla en la que se hizo clic, o la única relación en la que se hizo clic. La tabla sobre la que descansa el puntero ilumina las suyas. Consulta [Foco y teclas](../../api/erd-viewer-element.md#focus-and-keys) para ver todas las teclas.

Para probarlo en un diagrama mayor, con zoom y búsqueda, abre el [ejemplo de la librería](https://erd-editor.io/embed?src=https%3A%2F%2Fgithub.com%2Fdineug%2Ferd-editor%2Fblob%2Fmain%2Fdata%2Fbookstore.erd.json), nueve tablas y dos grupos de tablas, en una página propia.

## Analítica {#analytics}

erd-editor.io cuenta las visitas al marco con Google Analytics, como cuenta las visitas a la aplicación web. La dirección que registra para un marco es solo `erd-editor.io/embed`, sin la dirección del documento que nombra `src`.  
Consulta la [Política de privacidad](https://erd-editor.io/privacy).

## Cargar el visor tú mismo {#loading-the-viewer-yourself}

Una página que puede cargar scripts puede mostrar un diagrama con el elemento [`<erd-viewer>`](../../api/erd-viewer-element.md) del paquete `@dineug/erd-editor` en su lugar. Admite las mismas opciones como atributos y métodos, no hace ninguna petición a erd-editor.io y puede cargar un documento del propio sitio de la página, lo que no necesita CORS.
