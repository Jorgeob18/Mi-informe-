import React, { useState, useEffect } from 'react';
import { reportsStore } from '../utils/db';
import { Calendar, BookOpen, Clock, FileText, Edit2, Trash2 } from 'lucide-react';

const History = ({ onEditReport }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este informe?")) {
      try {
        await reportsStore.removeItem(id);
        setReports(reports.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error al eliminar el reporte:", error);
      }
    }
  };

  useEffect(() => {
    const loadReports = async () => {
      try {
        const loadedReports = [];
        await reportsStore.iterate((value) => {
          loadedReports.push(value);
        });
        
        // Sort by timestamp descending
        loadedReports.sort((a, b) => b.fecha_envio - a.fecha_envio);
        setReports(loadedReports);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">No hay informes aún</h2>
        <p className="text-gray-500 mt-2 text-sm">
          Tus informes enviados aparecerán aquí para tu registro personal.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-4">
      <h2 className="text-xl font-bold text-gray-800 px-2">Historial de Informes</h2>
      
      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <Calendar className="w-5 h-5 text-blue-500 mr-2" />
                <h3 className="font-bold text-gray-800">{report.mes} {report.anio}</h3>
              </div>
              <div className="flex items-center">
                <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded-md mr-2">
                  {new Date(report.fecha_envio).toLocaleDateString()}
                </span>
                {onEditReport && (
                  <button 
                    onClick={() => onEditReport(report)}
                    className="p-1.5 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition flex-shrink-0"
                    title="Editar informe"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(report.id)}
                  className="p-1.5 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition flex-shrink-0 ml-2"
                  title="Eliminar informe"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {report.participo ? (
              <div className="flex space-x-4 mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center mr-2">
                    <BookOpen className="w-4 h-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Cursos</p>
                    <p className="font-bold text-gray-800">{report.cursos || 0}</p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm">
                  <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center mr-2">
                    <Clock className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Horas</p>
                    <p className="font-bold text-gray-800">{report.horas || 0}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-2 pt-2 border-t border-gray-50">
                <p className="text-sm text-gray-500 italic">No participó en la predicación este mes.</p>
              </div>
            )}
            
            {report.notas && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold block mb-1">Notas:</span>
                  {report.notas}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
