import React, { useState, useEffect } from 'react';
import { User, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

const Profile = ({ onComplete, onCancel, showCancel }) => {
  const { profile, saveProfile, loading } = useProfile();
  const [formData, setFormData] = useState({
    nombre_publicador: '',
    nombre_superintendente: '',
    celular_superintendente: ''
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile && Object.keys(profile).length > 0) {
      setFormData({
        nombre_publicador: profile.nombre_publicador || '',
        nombre_superintendente: profile.nombre_superintendente || '',
        celular_superintendente: profile.celular_superintendente || ''
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Sanitización básica: quitar espacios al inicio/fin y limpiar el celular de caracteres no numéricos
    const cleanData = {
      nombre_publicador: formData.nombre_publicador.trim(),
      nombre_superintendente: formData.nombre_superintendente.trim(),
      celular_superintendente: formData.celular_superintendente.replace(/\D/g, '') 
    };
    
    await saveProfile(cleanData);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      if (onComplete) onComplete();
    }, 1500);
  };

  if (loading) return null; // Previene flash de carga

  return (
    <div className="w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative">
        {showCancel && (
          <button 
            onClick={onCancel}
            className="absolute top-4 left-4 p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-inner mt-2">
          <User className="text-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white text-center">Tu Perfil</h2>
        <p className="text-blue-100 text-sm mt-1 text-center">Configura tus datos para enviar informes fácilmente</p>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Tu Nombre (Publicador) <span className="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            name="nombre_publicador"
            value={formData.nombre_publicador}
            onChange={handleChange}
            required
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-800"
            placeholder="Ej. Juan Pérez"
          />
        </div>

        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center">
            <User className="w-4 h-4 mr-2 text-gray-500" />
            Datos del Superintendente (Opcional)
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Nombre</label>
              <input 
                type="text" 
                name="nombre_superintendente"
                value={formData.nombre_superintendente}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800"
                placeholder="Ej. Hermano García"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">WhatsApp (con código de país)</label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-gray-400">
                  <Phone className="w-4 h-4" />
                </span>
                <input 
                  type="tel" 
                  name="celular_superintendente"
                  value={formData.celular_superintendente}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-sm text-gray-800"
                  placeholder="Ej. 5215551234567"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1 ml-1">Sin símbolo '+' ni espacios.</p>
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className={`w-full mt-6 h-14 rounded-xl text-white font-bold text-lg shadow-lg transition-all flex items-center justify-center ${
            saved ? 'bg-green-500 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
          }`}
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Guardado
            </>
          ) : (
            'Guardar Perfil'
          )}
        </button>
      </form>
    </div>
  );
};

export default Profile;
