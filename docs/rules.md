# Reglas de Desarrollo y Arquitectura

## Reglas de Arquitectura React
- Usar exclusivamente Componentes Funcionales y React Hooks (`useState`, `useEffect`).
- Crear Custom Hooks (ej. `useProfile`, `useReports`) para abstraer la comunicación con `localforage`.
- Estructura de carpetas: `/src/components`, `/src/hooks`, `/src/utils`, `/src/pages` (si se usa enrutador).

## Reglas de Seguridad y Privacidad
- **Cero Backend**: Está estrictamente prohibido instalar herramientas de backend o realizar peticiones de red a APIs externas para guardar datos. Toda la información del publicador y sus informes debe permanecer en el dispositivo (IndexedDB local).
- Sanitizar el input del usuario para evitar problemas de formato al generar el enlace de WhatsApp.

## Reglas de UI/UX (Mobile First)
- Diseño estructurado al 100% para uso en celular. Utilizar Tailwind CSS.
- Asegurar zonas táctiles amplias (botones de al menos `h-12 w-12` o equivalente).
- Implementar interfaces claras (tarjetas, modales) para mostrar las notificaciones del día 1°.

## Reglas de PWA y Caché Offline
- Configurar `vite-plugin-pwa` utilizando la estrategia `generateSW`.
- El Service Worker debe cachear todo el HTML, JS, CSS y fuentes/iconos, garantizando que el usuario pueda abrir la aplicación, ver su histórico y llenar el formulario sin datos móviles.