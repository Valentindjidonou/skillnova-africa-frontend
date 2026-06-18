
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export default function useExercises() {
  const [exercises, setExercises] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [discipline, setDiscipline] = useState('tout');
  const [niveau, setNiveau] = useState('tout');
  const [search, setSearch] = useState('');
  const [answering, setAnswering] = useState(null);
  const [results, setResults] = useState({});

  const fetchExercises = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (discipline !== 'tout') params.append('discipline', discipline);
      if (niveau !== 'tout') params.append('niveau', niveau);
      if (search) params.append('search', search);

      const [exRes, attRes] = await Promise.all([
        api.get(`/exercises?${params}`),
        api.get('/exercises/user/attempts'),
      ]);

      setExercises(exRes.data);

      // Transformer attempts en map { exercise_id: attempt }
      const attMap = {};
      attRes.data.forEach(a => { attMap[a.exercise_id] = a; });
      setAttempts(attMap);
    } catch (err) {
      setError('Impossible de charger les exercices');
    } finally {
      setLoading(false);
    }
  }, [discipline, niveau, search]);

  useEffect(() => { fetchExercises(); }, [fetchExercises]);

  const answer = async (exerciseId, chosenIndex) => {
    setAnswering(exerciseId);
    try {
      const res = await api.post(`/exercises/${exerciseId}/answer`, {
        chosen_index: chosenIndex
      });
      setResults(prev => ({ ...prev, [exerciseId]: { ...res.data, chosen_index: chosenIndex } }));
      if (!res.data.already_answered) {
        setAttempts(prev => ({
          ...prev,
          [exerciseId]: { is_correct: res.data.is_correct, chosen_index: chosenIndex }
        }));
      }
      return res.data;
    } catch (err) {
      return null;
    } finally {
      setAnswering(null);
    }
  };

  const getResult = (id) => results[id] || null;
  const getAttempt = (id) => attempts[id] || null;

  const stats = {
    total: exercises.length,
    resolus: Object.keys(attempts).length,
    corrects: Object.values(attempts).filter(a => a.is_correct).length,
  };

  return {
    exercises, loading, error,
    discipline, setDiscipline,
    niveau, setNiveau,
    search, setSearch,
    answer, answering,
    getResult, getAttempt,
    stats,
  };
}