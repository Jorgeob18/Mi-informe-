import React, { useRef, useState } from 'react';
import { Shield, Info, Heart, Download, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { profileStore, reportsStore } from '../utils/db';

const About = () => {
  const fileInputRef = useRef(null);
  const [message, setMessage] = useState('');

  const handleExport = async () => {
    try {
      const profile = await profileStore.getItem('user_profile');
      const reports = [];
      await reportsStore.iterate((value) => {
        reports.push(value);
      });

      const backup = {
        version: 1,
        timestamp: new Date().toISOString(),
        profile: profile || {},
        reports: reports
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backup));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `mi_informe_respaldo_${new Date().getTime()}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      setMessage('Respaldo descargado con éxito.');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al exportar:', error);
      setMessage('Error al exportar los datos.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const backup = JSON.parse(event.target.result);
        if (backup.profile) {
          await profileStore.setItem('user_profile', backup.profile);
        }
        if (backup.reports && Array.isArray(backup.reports)) {
          for (const report of backup.reports) {
            await reportsStore.setItem(report.id, report);
          }
        }
        setMessage('Datos importados. Recarga la app para verlos.');
        setTimeout(() => setMessage(''), 5000);
      } catch (error) {
        console.error('Error al importar:', error);
        setMessage('Error: El archivo no es un respaldo válido.');
        setTimeout(() => setMessage(''), 5000);
      }
      // Limpiar input
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6 space-y-6">
      <div className="text-center">
        <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Info className="text-blue-600 w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Sobre la App</h2>
        <p className="text-gray-500 text-sm mt-1">Generador de Informes de Servicio</p>
      </div>

      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h3 className="font-bold text-blue-800 flex items-center mb-2">
          <Shield className="w-5 h-5 mr-2 text-blue-600" />
          Privacidad y Seguridad
        </h3>
        <p className="text-sm text-blue-900 leading-relaxed">
          Esta aplicación está diseñada respetando tu privacidad al máximo. <strong>Ningún dato que ingreses es enviado o almacenado en servidores externos.</strong> Toda la información (tu perfil y tus informes) se guarda de manera segura y exclusiva <strong>localmente en tu dispositivo</strong>.
        </p>
      </div>

      <div className="space-y-3 text-sm text-gray-600 border border-gray-100 p-4 rounded-xl">
        <p>
          <strong className="text-gray-800">Objetivo:</strong> Facilitar y agilizar la captura mensual del informe de servicio (formato S-4-S).
        </p>
        <p>
          La herramienta permite generar una imagen digital del formato perfectamente alineada, la cual puede ser previsualizada, guardada en tu historial y enviada fácilmente a través de WhatsApp a tu superintendente de grupo.
        </p>
      </div>

      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
        <h3 className="font-bold text-gray-800 flex items-center mb-3">
          <Download className="w-5 h-5 mr-2 text-gray-600" />
          Respaldo de Datos
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Guarda una copia local de tus informes y tu perfil, o recupéralos si reinstalas la app o cambias de teléfono.
        </p>
        
        {message && (
          <div className={`mb-3 p-2 text-xs rounded font-medium flex items-center ${message.includes('Error') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
            {message.includes('Error') ? <AlertCircle className="w-4 h-4 mr-1" /> : <CheckCircle className="w-4 h-4 mr-1" />}
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={handleExport}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors shadow-sm"
          >
            <Download className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-semibold text-gray-700">Exportar (JSON)</span>
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors shadow-sm"
          >
            <Upload className="w-5 h-5 text-blue-600 mb-1" />
            <span className="text-xs font-semibold text-gray-700">Importar Datos</span>
          </button>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            className="hidden" 
          />
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400 flex items-center justify-center">
          Desarrollado con <Heart className="w-3 h-3 text-red-400 mx-1 fill-current" /> para los hermanos
        </p>
        <p className="text-sm font-semibold text-gray-700 mt-1">
          Created by <span className="text-blue-600">@GeorgeDev</span>
        </p>
      </div>
    </div>
  );
};

export default About;
