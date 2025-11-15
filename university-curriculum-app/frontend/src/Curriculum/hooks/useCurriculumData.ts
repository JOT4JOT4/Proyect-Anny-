import { useState, useEffect } from 'react';
import type { UserData, Course, Avance } from '../types';

export const useCurriculumData = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [mallas, setMallas] = useState<Record<string, Course[]>>({});
  const [avances, setAvances] = useState<Record<string, Avance[]>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Cargar UserData desde localStorage al montar
  useEffect(() => {
    const raw = localStorage.getItem('userData');
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as UserData;
      setUserData(parsed);
    } catch (err) {
      console.error('Invalid userData in localStorage', err);
      setError('Error al cargar datos de usuario.');
    }
  }, []);

  // 2. Fetch Mallas y Avances cuando UserData cambia
  useEffect(() => {
    const fetchAll = async () => {
      if (!userData) return;
      setLoading(true);
      setError(null);
      try {
        const newMallas: Record<string, Course[]> = {};
        const newAvances: Record<string, Avance[]> = {};

        for (const carrera of userData.carreras) {
          const key = `${carrera.codigo}-${carrera.catalogo}`;
          
          // Fetch malla
          const res = await fetch(`http://localhost:3000/mallas/${carrera.codigo}/${carrera.catalogo}`);
          newMallas[key] = res.ok ? await res.json() : [];

          // Fetch avance
          const avRes = await fetch(`http://localhost:3000/mallas/avance?rut=${encodeURIComponent(userData.rut)}&codcarrera=${encodeURIComponent(carrera.codigo)}`);
          newAvances[carrera.codigo] = avRes.ok ? await avRes.json() : [];
        }

        setMallas(newMallas);
        setAvances(newAvances);
      } catch (err) {
        setError('Error al obtener los datos de la malla o avance.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userData]);

  return { userData, mallas, avances, loading, error, setUserData };
};