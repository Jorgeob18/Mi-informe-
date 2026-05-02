import { useState } from 'react';
import { reportsStore } from '../utils/db';

export const useReports = () => {
  const [loading, setLoading] = useState(false);

  const saveReport = async (reportData) => {
    setLoading(true);
    try {
      const id = reportData.id || crypto.randomUUID();
      const timestamp = new Date().getTime();
      
      const record = {
        ...reportData,
        id,
        fecha_envio: timestamp
      };
      
      await reportsStore.setItem(id, record);
      return record;
    } catch (error) {
      console.error("Error al guardar el reporte:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const checkLastMonthReportExists = async (lastMonthString) => {
    try {
      let exists = false;
      await reportsStore.iterate((value) => {
        if (`${value.mes}-${value.anio}` === lastMonthString) {
          exists = true;
        }
      });
      return exists;
    } catch (error) {
      console.error("Error al verificar reportes antiguos:", error);
      return true; // Asumir true para no molestar al usuario si hay error
    }
  };

  return { saveReport, checkLastMonthReportExists, loading };
};
