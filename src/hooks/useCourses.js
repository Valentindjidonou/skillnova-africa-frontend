
import { useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

export default function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [activeFilter, setActiveFilter] = useState('tout');
  const [search, setSearch] = useState('');
  const [enrolling, setEnrolling] = useState(null);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeFilter !== 'tout') params.append('categorie', activeFilter);
      if (search) params.append('search', search);

      const [coursesRes, enrollRes] = await Promise.all([
        api.get(`/courses?${params}`),
        api.get('/courses/user/enrollments'),
      ]);
      setCourses(coursesRes.data);
      setEnrollments(enrollRes.data);
    } catch (err) {
      setError('Impossible de charger les cours');
    } finally {
      setLoading(false);
    }
  }, [activeFilter, search]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  const enroll = async (courseId) => {
    setEnrolling(courseId);
    try {
      await api.post(`/courses/${courseId}/enroll`);
      await fetchCourses();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Erreur' };
    } finally {
      setEnrolling(null);
    }
  };

  const isEnrolled = (courseId) => enrollments.some(e => e.course_id === courseId);
  const getProgress = (courseId) => enrollments.find(e => e.course_id === courseId)?.progress || 0;

  return { courses, loading, error, enrollments, activeFilter, setActiveFilter, search, setSearch, enroll, enrolling, isEnrolled, getProgress };
}
