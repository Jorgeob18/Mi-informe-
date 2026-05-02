import React, { useState, useEffect } from 'react';
import { useProfile } from '../hooks/useProfile';
import { useReports } from '../hooks/useReports';
import { shareReport } from '../utils/reportGenerator';
import { Send, CheckCircle, BookOpen, Clock, MessageSquare, Calendar, X } from 'lucide-react';

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

const ReportForm = ({ editingReport, onClearEdit }) => {
  const { profile } = useProfile();
  const { saveReport, loading: saving } = useReports();
  
  // Establecer mes anterior por defecto si estamos en los primeros 5 días
  const today = new Date();
  const isEarlyInMonth = today.getDate() <= 5;
  const defaultMonthIndex = isEarlyInMonth 
    ? (today.getMonth() === 0 ? 11 : today.getMonth() - 1) 
    : today.getMonth();
    
  const defaultYear = isEarlyInMonth && today.getMonth() === 0 
    ? today.getFullYear() - 1 
    : today.getFullYear();

  const [formData, setFormData] = useState({
    mes: MESES[defaultMonthIndex],
    anio: defaultYear.toString(),
    participo: true,
    cursos: '',
    horas: '',
    notas: ''
  });

  useEffect(() => {
    if (editingReport) {
      setFormData({
        mes: editingReport.mes,
        anio: editingReport.anio.toString(),
        participo: editingReport.participo,
        cursos: editingReport.cursos || '',
        horas: editingReport.horas || '',
        notas: editingReport.notas || ''
      });
    }
  }, [editingReport]);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleToggleParticipo = () => {
    setFormData({ ...formData, participo: !formData.participo });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Parseo seguro de números
    const cleanData = {
      ...formData,
      cursos: parseInt(formData.cursos) || 0,
      horas: parseInt(formData.horas) || 0,
      notas: formData.notas.trim()
    };

    if (editingReport && editingReport.id) {
      cleanData.id = editingReport.id;
    }

    // 1. Guardar en la base de datos
    const savedRecord = await saveReport(cleanData);
    
    if (savedRecord) {
      // 2. Generar canvas y compartir
      await shareReport(cleanData, profile);
      
      // Limpiar modo edición si aplica
      if (onClearEdit) {
        onClearEdit();
        // Reset form
        setFormData({
          mes: MESES[defaultMonthIndex],
          anio: defaultYear.toString(),
          participo: true,
          cursos: '',
          horas: '',
          notas: ''
        });
      }
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-blue-50 p-4 border-b border-blue-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-blue-900">
            {editingReport ? 'Editando Informe' : 'Tu Informe'}
          </h2>
          <p className="text-sm text-blue-600 font-medium">{profile?.nombre_publicador}</p>
        </div>
        <div className="flex space-x-2">
          {editingReport && (
            <button 
              onClick={() => {
                onClearEdit();
                setFormData({
                  mes: MESES[defaultMonthIndex],
                  anio: defaultYear.toString(),
                  participo: true,
                  cursos: '',
                  horas: '',
                  notas: ''
                });
              }}
              className="w-10 h-10 bg-red-100 hover:bg-red-200 rounded-full flex items-center justify-center text-red-600 transition"
              title="Cancelar edición"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-5 space-y-6">
        
        {/* Mes y Año */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Mes</label>
            <select 
              name="mes"
              value={formData.mes}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800 font-medium"
            >
              {MESES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Año</label>
            <input 
              type="number"
              name="anio"
              value={formData.anio}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800 font-medium"
            />
          </div>
        </div>

        {/* Participación (Toggle gigante) */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">¿Participaste en la predicación?</label>
          <button
            type="button"
            onClick={handleToggleParticipo}
            className={`w-full py-4 px-6 rounded-xl flex items-center justify-between transition-all border-2 ${
              formData.participo 
                ? 'bg-blue-50 border-blue-500 text-blue-700' 
                : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="font-bold text-lg">{formData.participo ? 'Sí, participé' : 'No participé'}</span>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              formData.participo ? 'bg-blue-500 text-white' : 'bg-gray-300 text-transparent'
            }`}>
              <CheckCircle className="w-5 h-5" />
            </div>
          </button>
        </div>

        {/* Métricas */}
        {formData.participo && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-indigo-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800">Diferentes Cursos Bíblicos</label>
              </div>
              <div className="w-24">
                <input 
                  type="number" 
                  name="cursos"
                  min="0"
                  value={formData.cursos}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-semibold text-gray-800">Horas</label>
                <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Nota: Si eres precursor, misionero o superintendente</p>
              </div>
              <div className="w-24">
                <input 
                  type="number" 
                  name="horas"
                  min="0"
                  value={formData.horas}
                  onChange={handleChange}
                  placeholder="0"
                  className="w-full px-4 py-3 text-center text-lg font-bold rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all"
                />
              </div>
            </div>
          </div>
        )}

        {/* Comentarios */}
        <div className="pt-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2 text-gray-500" />
            Comentarios
          </label>
          <textarea 
            name="notas"
            value={formData.notas}
            onChange={handleChange}
            rows="3"
            placeholder="Alguna nota o comentario adicional para el superintendente..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <button 
          type="submit"
          disabled={saving}
          className="w-full h-14 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-bold text-lg flex items-center justify-center shadow-lg shadow-green-200 transition-all disabled:opacity-70"
        >
          {saving ? (
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              Guardar y Enviar
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReportForm;
