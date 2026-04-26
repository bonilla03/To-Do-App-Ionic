# Manual de Usuario - To Do App Ionic

## 1. Objetivo

La aplicacion permite administrar tareas personales o de trabajo desde una interfaz simple. Puedes crear tareas, organizarlas por categorias, marcarlas como completadas y filtrarlas segun su estado.

## 2. Pantalla principal

La pantalla principal esta dividida en dos zonas:

- Panel de categorias.
- Panel principal de tareas.

Tambien muestra indicadores rapidos de:

- Total de tareas.
- Tareas pendientes.
- Tareas completadas.

## 3. Crear una categoria

1. Ubica el panel `Categorias`.
2. Escribe el nombre en el campo de texto.
3. Presiona `Agregar categoria`.

## 4. Editar una categoria

1. Busca la categoria en la lista lateral.
2. Presiona `Editar`.
3. Cambia el nombre.
4. Presiona `Guardar`.

## 5. Eliminar una categoria

1. Busca la categoria en la lista lateral.
2. Presiona `Eliminar`.

Nota:

- Si una tarea tenia esa categoria asignada, la tarea no se elimina.
- La tarea queda como `Sin categoria`.

## 6. Crear una tarea

1. Escribe el nombre de la tarea en `Agrega tu tarea`.
2. Selecciona una categoria si aplica.
3. Presiona `Agregar`.

## 7. Completar una tarea

1. Busca la tarea en la lista.
2. Marca el `checkbox` junto al nombre.

Resultado:

- La tarea cambia a estado completado.
- Los indicadores superiores se actualizan automaticamente.

## 8. Editar una tarea

1. Busca la tarea en la lista.
2. Presiona `Editar`.
3. Cambia el nombre o la categoria.
4. Presiona `Guardar`.

Nota:

- Esta opcion puede depender de la feature flag `enable_task_editing`.

## 9. Eliminar una tarea

1. Busca la tarea en la lista.
2. Presiona `Eliminar`.

## 10. Filtrar tareas

La app ofrece dos filtros:

- Filtro por categoria.
- Filtro por estado.

### Filtro por categoria

1. Abre `Filtro por categoria`.
2. Selecciona `Todas` o una categoria especifica.

### Filtro por estado

1. Abre `Filtro por estado`.
2. Selecciona `Todo`, `Pendiente` o `Completado`.

Nota:

- Este filtro puede depender de la feature flag `show_status_filters`.

## 11. Persistencia de informacion

La informacion se guarda automaticamente en el navegador o contenedor movil mediante `localStorage`.

Esto significa:

- Si cierras y vuelves a abrir la app en el mismo dispositivo, tus tareas y categorias siguen disponibles.
- Si limpias el almacenamiento local del navegador o desinstalas la app, la informacion puede perderse.

## 12. Comportamiento de demostracion

La primera vez que se abre la app pueden aparecer tareas y categorias de ejemplo. Esto sirve para mostrar el funcionamiento sin necesidad de cargar datos manualmente.

## 13. Solucion de problemas

### No veo mis cambios

- Recarga la aplicacion.
- Verifica que no hayas limpiado el almacenamiento local del navegador.

### No aparece el boton Editar

- La flag `enable_task_editing` puede estar desactivada en Firebase Remote Config.

### No aparece el filtro por estado

- La flag `show_status_filters` puede estar desactivada en Firebase Remote Config.

## 14. Recomendaciones de uso

- Crea categorias antes de cargar muchas tareas.
- Usa los filtros para revisar pendientes rapidamente.
- Marca tareas completadas para mantener un tablero limpio.

