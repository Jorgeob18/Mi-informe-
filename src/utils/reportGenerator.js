// Generador de Reporte (S-4-S) y Lógica de Compartir

// COORDENADAS TEMPORALES PARA EL CANVAS
// Tendrás que ajustar estos valores para que encajen perfectamente en la imagen public/formato_s4s.png
const COORDINATES = {
  nombre: { x: 200, y: 95 },
  mes: { x: 180, y: 137 },
  participo_si: { x: 677, y: 235 },
  participo_no: { x: 670, y: 220 }, // Si no participó, no dibujamos X en la casilla, pero lo dejamos apuntando igual
  cursos: { x: 675, y: 295 },
  horas: { x: 675, y: 355 },
  comentarios: { x: 220, y: 440 }
};

/**
 * Formatea el texto del informe para WhatsApp (Fallback)
 */
const generateTextReport = (data, profile) => {
  const { mes, anio, participo, cursos, horas, notas } = data;
  const nombre = profile.nombre_publicador;

  let text = `*Informe de Predicación*\n`;
  text += `👤 *Publicador:* ${nombre}\n`;
  text += `📅 *Mes:* ${mes} ${anio}\n\n`;
  text += `✅ *Participó:* ${participo ? 'Sí' : 'No'}\n`;

  if (cursos > 0) text += `📚 *Cursos Bíblicos:* ${cursos}\n`;
  if (horas > 0) text += `⏱️ *Horas:* ${horas}\n`;
  if (notas) text += `\n📝 *Comentarios:*\n${notas}\n`;

  return text;
};

/**
 * Intenta dibujar el informe en el Canvas
 */
export const generateCanvasBlob = async (data, profile) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    // Cargar la plantilla S-4-S
    img.src = '/formato_s4s.png';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Dibujar imagen de fondo
      ctx.drawImage(img, 0, 0);

      // Configurar fuente
      ctx.font = '24px Arial';
      ctx.fillStyle = '#000000';

      // Escribir datos
      ctx.fillText(profile.nombre_publicador, COORDINATES.nombre.x, COORDINATES.nombre.y);
      ctx.fillText(`${data.mes} ${data.anio}`, COORDINATES.mes.x, COORDINATES.mes.y);

      // Centrar texto para los valores de la columna derecha
      ctx.textAlign = 'center';

      if (data.participo) {
        ctx.fillText('X', COORDINATES.participo_si.x, COORDINATES.participo_si.y);
      } else {
        ctx.fillText('X', COORDINATES.participo_no.x, COORDINATES.participo_no.y);
      }

      if (data.cursos > 0) {
        ctx.fillText(data.cursos.toString(), COORDINATES.cursos.x, COORDINATES.cursos.y);
      }
      if (data.horas > 0) {
        ctx.fillText(data.horas.toString(), COORDINATES.horas.x, COORDINATES.horas.y);
      }

      // Restaurar alineación a la izquierda para los comentarios
      ctx.textAlign = 'left';
      if (data.notas) {
        ctx.font = '18px Arial'; // Letra más pequeña para notas
        ctx.fillText(data.notas, COORDINATES.comentarios.x, COORDINATES.comentarios.y);
      }

      // Exportar a Blob
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Fallo al generar el Blob del Canvas'));
      }, 'image/png');
    };

    img.onerror = () => {
      console.error("No se pudo cargar la imagen formato_s4s.png. Fallback a texto.");
      reject(new Error("Image load failed"));
    };
  });
};

/**
 * Función principal para compartir
 */
export const shareReport = async (data, profile) => {
  const textMessage = generateTextReport(data, profile);
  const waNumber = profile.celular_superintendente;

  // URL generada para el fallback
  const waUrl = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(textMessage)}`
    : `https://wa.me/?text=${encodeURIComponent(textMessage)}`;

  try {
    // 1. Intentar generar imagen
    const imageBlob = await generateCanvasBlob(data, profile);
    const file = new File([imageBlob], `Informe_${data.mes}_${data.anio}.png`, { type: 'image/png' });

    // 2. Intentar usar la API Nativa de compartir (Web Share API) con archivo
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: `Informe de Predicación - ${data.mes}`,
        text: textMessage,
        files: [file]
      });
      return { success: true, method: 'share_api_with_image' };
    }

    // 3. Fallback a Share API solo con texto
    if (navigator.share) {
      await navigator.share({
        title: `Informe de Predicación - ${data.mes}`,
        text: textMessage
      });
      return { success: true, method: 'share_api_text_only' };
    }

    // 4. Último fallback: Abrir WhatsApp web/app
    window.open(waUrl, '_blank');
    return { success: true, method: 'whatsapp_url' };

  } catch (error) {
    console.error("Error intentando compartir con Canvas:", error);
    // Fallback de emergencia si todo lo anterior falla
    window.open(waUrl, '_blank');
    return { success: true, method: 'whatsapp_url_fallback' };
  }
};
