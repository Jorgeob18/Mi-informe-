import { useState, useEffect } from 'react';
import { profileStore } from '../utils/db';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await profileStore.getItem('user_profile');
        setProfile(data || {});
      } catch (error) {
        console.error("Error al cargar el perfil:", error);
        setProfile({});
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const saveProfile = async (newProfile) => {
    try {
      await profileStore.setItem('user_profile', newProfile);
      setProfile(newProfile);
      return true;
    } catch (error) {
      console.error("Error al guardar el perfil:", error);
      return false;
    }
  };

  // El perfil está completo si existe el nombre del publicador y no está vacío
  const isProfileComplete = profile && profile.nombre_publicador && profile.nombre_publicador.trim().length > 0;

  return { profile, loading, saveProfile, isProfileComplete };
};
