---
sidebar_position: 4
description: Dibuja un documento como PNG o SVG desde tu propio código con toImage, con las opciones del cuadro de diálogo Export image, en un navegador y en el worker de exportación donde lo hay.
---

# toImage

Desde la `5.0.0`, la raíz del paquete exporta `toImage()`, que dibuja un documento como PNG o SVG sin ningún editor en la página.  
Escribe los archivos que escriben los botones `PNG` y `SVG` del cuadro de diálogo [Exportar imagen](../guide/guides/file-import-export.md#image), con las tres opciones del cuadro, `Background`, `Dark mode` y `Scale`, y ninguna otra.

```ts
function toImage(
  value: string,
  options: ToImageOptions & { format: 'png' }
): Promise<Blob>;
function toImage(
  value: string,
  options: ToImageOptions & { format: 'svg' }
): Promise<string>;

type ToImageOptions = {
  format: 'png' | 'svg';
  background?: boolean;
  darkMode?: boolean;
  scale?: 1 | 2 | 3;
};
```

```js
import { toImage } from '@dineug/erd-editor';

const value = await (await fetch('/diagrams/shop.erd.json')).text();

const png = await toImage(value, { format: 'png', scale: 3 });
const svg = await toImage(value, { format: 'svg', darkMode: true, background: false });
```

`ToImageOptions` se exporta como tipo a su lado; consulta [Puntos de entrada](./installation.md#entry-points).

## value {#value}

El texto del documento: lo que contiene un archivo `.erd.json`, el [value](./erd-editor-element.md#value) o el [runtimeValue](./erd-editor-element.md#runtimevalue) de un editor, o cualquier otro texto que carga [setInitialValue](./erd-editor-element.md#setinitialvalue).  
Un texto vacío, o solo con espacios en blanco, dibuja un diagrama vacío, y también un JSON que no contiene ninguno de los campos de un documento, que el analizador rellena con valores predeterminados.

## Opciones {#options}

| Opción | Valor predeterminado | Descripción |
| --- | --- | --- |
| `format` | Ninguno; es obligatoria | `'png'` se resuelve en un `Blob` de tipo `image/png`, y `'svg'` en el marcado del SVG como cadena. |
| `background` | `true` | Pinta el color del lienzo detrás del diagrama. `false` lo deja transparente, la caja bajo una etiqueta ON DELETE o ON UPDATE incluida. |
| `darkMode` | `false` | Dibuja el tema oscuro en lugar del claro. |
| `scale` | `2` | `1`, `2` o `3` píxeles de imagen por unidad del diagrama al 100%. Da tamaño solo al PNG; un SVG tiene el tamaño del diagrama sea cual sea la escala. |

`toImage()` no lee ninguna otra clave, así que una clave que la tabla no lista no cambia nada.

## Qué dibuja {#what-it-draws}

La imagen es la que dibuja el cuadro de diálogo:

- Todo el diagrama, recortado a lo que dibuja más un margen y siempre al 100%, sea cual sea el zoom con el que se guardó el documento, de modo que cada tabla se dibuja entera. Lo que [View Option](../guide/guides/table-related-functions.md#table-view-options) oculta en el documento ni se dibuja ni se le da sitio, los grupos de tablas se dibujan detrás de todo lo demás, y los colores que las [comprobaciones del diccionario](../guide/guides/dictionary.md#marks-on-the-canvas) dan a los nombres no se dibujan.
- Un PNG tiene el tamaño del diagrama al 100% multiplicado por `scale`. Uno demasiado grande para un canvas del navegador se escribe con una resolución reducida en lugar de fallar, y `toImage()` no lo indica.
- Un SVG conserva su texto como texto y nombra sus fuentes en lugar de incrustarlas, así que un visor sin la fuente del editor dibuja otra. Se omiten las sombras.

Donde el cuadro de diálogo toma la pantalla del editor, `toImage()` toma solo el documento, así que un documento se dibuja igual en todas las páginas:

- Sus colores son el tema predefinido del gris y el énfasis predeterminados del elemento, `slate` e `indigo`, claro salvo que `darkMode` sea `true`. No le llega ningún tema de la página, ninguna sustitución de [setTheme](./erd-editor-element.md#settheme) ni ningún cambio del [generador de temas](../guide/guides/language-and-theme.md).
- Sus tablas y columnas se nombran en la [vista de nombres](../guide/guides/logical-names.md#name-view) que contiene el documento, que para un archivo con su bloqueo `Name View` activado es la bloqueada.
- Las palabras que dibuja el propio diagrama, como el marcador de una tabla sin nombre, están en inglés.

## Dónde se ejecuta {#where-it-runs}

`toImage()` necesita una página de navegador, ya que mide y dibuja en un canvas. La raíz del paquete de la que sale necesita un DOM para cargarse, así que no se llega a ella desde Node ni desde un Web Worker; consulta [Renderizado del lado del servidor](./installation.md#server-side-rendering).  
Espera a que terminen de cargarse las fuentes de la página antes de dibujar.

Dibuja en el worker compartido de exportación de imagen donde el host ejecuta uno, como hace el cuadro de diálogo, de modo que la página sigue respondiendo mientras tanto, y en el hilo principal donde no hay ninguno o el worker no responde a tiempo; consulta [Web Workers](./installation.md#web-workers).  
Un bundle que importa `toImage` y ningún elemento lleva solo el worker de exportación de imagen.  
Ninguna de las dos compilaciones de [etiqueta script](./installation.md#script-tag) lo lleva: `window.ErdEditor` y `window.ErdViewer` no tienen `toImage`.

## Rechazos {#rejections}

La Promise que devuelve se rechaza, antes de dibujar nada, cuando:

- la página no tiene `document`: un `Error`, `toImage needs a browser, since it draws on a canvas`;
- `value` no es una cadena, como un documento ya analizado a un objeto: un `TypeError`;
- una opción contiene un valor que no lista la tabla de [Opciones](#options), un `format` ausente incluido, y también un `scale` de `'2'` pasado con un SVG: un `TypeError` que nombra la opción, como en `toImage: scale cannot be 4`;
- el texto no es un documento que el analizador pueda leer: el error del analizador, un `SyntaxError` para un texto que no es JSON.

## Cuadro de diálogo Exportar imagen {#export-image-dialog}

El cuadro de diálogo y `toImage()` dibujan mediante la misma exportación, así que con las mismas opciones escriben la misma imagen, pero parten de sitios distintos:

| | Cuadro de diálogo `Export image` | `toImage()` |
| --- | --- | --- |
| Documento | El diagrama tal como estaba cuando se abrió el cuadro de diálogo | El texto que pasas |
| Modo oscuro | Empieza coincidiendo con la apariencia del editor y, mientras coincide, dibuja los colores de la propia pantalla | Desactivado salvo que `darkMode` sea `true`, y siempre el tema predefinido |
| Vista de nombres | La que muestra el editor | La que contiene el documento |
| Idioma de sus propias palabras | El idioma de la interfaz del editor | Inglés |
| Resultado | Se guarda mediante el navegador o el [callback de exportación](./installation.md#file-dialogs), o se copia al portapapeles | Se te devuelve; no se llama a ninguno de los callbacks de archivo |

`Copy to clipboard` no tiene equivalente. Una página que quiera uno escribe ella misma el `Blob` PNG en el portapapeles.
