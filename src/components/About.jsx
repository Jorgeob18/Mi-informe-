import React from 'react';
import { Shield, Info, Heart } from 'lucide-react';

const About = () => {
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
