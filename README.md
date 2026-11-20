# Arena Roster · Misión M4

## Uso de IA

* **Herramienta usada:** Gemini.
* **Qué hice con IA:** La estructura inicial de las carpetas (`schemas`, `services`, `components`), las reglas de validación de Zod y el diseño CSS básico.
* **Prompts que utilicé:**
  1. *"Hazme un esquema en Zod para un formulario de torneo donde el código de equipo sea obligatorio solo si marcas la casilla de capitán."*
  2. *"Crea una función para pedir datos a una API y comprobar con safeParse de Zod si vienen datos mal escritos."*
* **Cómo lo revisé:** Probé el formulario en el navegador metiendo datos mal a propósito (campos vacíos, correos sin arroba, marcar capitán sin poner código) y revisé en la consola del navegador que las peticiones se enviaban bien y que no quedaba ningún `useEffect` haciendo `fetch`.
* **Qué escribí a mano:** Las etiquetas de accesibilidad en el formulario (`aria-invalid` y mensajes de error), la parte de `App.jsx` para añadir los jugadores nuevos a la lista al instante y la configuración del archivo `.env`.

## Autopsia

1. **Convertir los puntos (LP) a número dentro de Zod (`z.coerce.number()`):**
   * **Qué elegí:** Dejar que Zod convierta el texto del input numérico a número directamente en el esquema.
   * **Por qué es discutible y qué descarté:** Si borras por completo el número en la caja de texto, `z.coerce.number()` lo convierte en `0` en lugar de decir que está vacío. Descarté usar `valueAsNumber: true` en React Hook Form porque cuando el campo queda vacío devuelve `NaN` y daba mensajes de error más raros para el usuario.

2. **Guardar los nuevos registros en un estado de React además de usar `invalidateQueries`:**
   * **Qué elegí:** Al enviar el formulario, invalido la caché con TanStack Query y también guardo el jugador nuevo en un estado local en `App.jsx` para mostrarlo arriba de la lista.
   
   * **Por qué es discutible y qué descarté:** En una API real con base de datos no haría falta guardar nada en un estado aparte porque al recargar la lista ya vendría del servidor. Como uso JSONPlaceholder (que simula que guarda el dato pero luego no lo devuelve al pedir la lista), si solo usaba `invalidateQueries` el jugador desaparecía. Descarté modificar la caché a mano con `setQueryData` para que se viera claramente cómo funciona la invalidación real de TanStack Query.