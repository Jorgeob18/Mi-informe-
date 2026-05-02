# Especificaciones del Proyecto: Mi Informe (PWA)

## Descripción General
"Mi informe" es una Progressive Web App (PWA) móvil diseñada para que los Testigos de Jehová puedan enviar su informe de predicación mensual a su superintendente de grupo vía WhatsApp. La aplicación debe funcionar offline, almacenar todo su historial localmente en el dispositivo y apegarse a las mejores prácticas de seguridad. 

## Stack Tecnológico
- Entorno: Node.js (solo para desarrollo).
- Framework Frontend: React (Componentes Funcionales + Hooks).
- Bundler: Vite.
- Estilos: Tailwind CSS.
- PWA: `vite-plugin-pwa` para gestión automática del Service Worker (caché offline) y Web App Manifest.
- Almacenamiento Local: `localforage` (wrapper robusto para IndexedDB).

## Estructura de Datos (IndexedDB)
1. **Colección `perfil`**: 
   - `nombre_publicador` (String)
   - `nombre_superintendente` (String, opcional)
   - `celular_superintendente` (String, formato internacional sin '+', opcional)
2. **Colección `informes_historico`**:
   - `id` (UUID)
   - `mes` (String, ej. "Mayo")
   - `anio` (String, ej. "2026")
   - `datos_informe` (Objeto: publicaciones, videos, horas, revisitas, estudios, notas_adicionales)
   - `fecha_envio` (Timestamp)

## Flujos Principales y Lógica de Negocio

1. **Gestión de Perfil (Onboarding y Ajustes)**: 
   - Al entrar por primera vez, se solicitará al usuario que capture su nombre (`nombre_publicador`).
   - Opcionalmente, puede guardar el nombre y número de WhatsApp de su superintendente de grupo para evitar capturarlos cada mes. 
   - Estos datos pueden ser editados en cualquier momento desde una sección de "Perfil".

2. **Sistema de Alerta / Notificación (Día 1)**: 
   - La aplicación debe evaluar la fecha actual al abrirse.
   - Si el día es el 1° de cada mes (o los primeros días) y no existe un informe guardado que corresponda al mes calendario anterior, la UI debe mostrar un aviso o tarjeta destacada indicando que es momento de enviar el informe.

3. **Captura del Informe Mensual**:
   - Formulario limpio y amigable (mobile-first).
   - El formulario preguntará/confirmará el nombre del publicador (autocompletado desde el perfil) y el mes a reportar.
   - Captura de las métricas (horas, publicaciones, videos, etc.).

4. **Lógica de Generación y Envío (WhatsApp)**:
   - Al dar click en "Enviar", se guardará una copia del informe en `informes_historico`.
   - **Estructura del Mensaje**: Se generará un texto preformateado indicando al hermano que se le envía el informe del mes en cuestión. El diseño de este texto debe simular una "tarjeta" o "imagen" usando emojis, saltos de línea y negritas de WhatsApp (ej. *Horas:* 10) para presentar los datos de forma impecable y estética.
   - **Regla de Enrutamiento a WhatsApp**:
     - *Condición A (Perfil Completo):* Si el celular del superintendente está configurado en el perfil, redirigir a la app usando: `https://wa.me/<celular_superintendente>?text=<mensaje_codificado>`.
     - *Condición B (Sin Perfil de Superintendente):* Si esos datos no están configurados, la app NO debe fallar. Debe generar un enlace general: `https://wa.me/?text=<mensaje_codificado>`. Esto abrirá WhatsApp nativo y le permitirá al usuario seleccionar manualmente a quién enviarlo de su lista de contactos.

5. **Histórico y Funcionamiento Offline**:
   - Una pestaña de "Historial" donde se puedan consultar los meses enviados anteriormente.
   - Todo debe estar cacheado para mostrar las partes de la aplicación incluso si el usuario no tiene conexión a internet (offline).