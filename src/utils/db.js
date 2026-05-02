import localforage from 'localforage';

// Configuración general de localforage
localforage.config({
  name: 'MiInformeDB',
  version: 1.0,
  description: 'Base de datos offline para la app Mi Informe'
});

// Instancia para la colección del perfil
export const profileStore = localforage.createInstance({
  name: 'MiInformeDB',
  storeName: 'perfil'
});

// Instancia para la colección del histórico de informes
export const reportsStore = localforage.createInstance({
  name: 'MiInformeDB',
  storeName: 'informes_historico'
});
