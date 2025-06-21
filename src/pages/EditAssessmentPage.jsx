import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditAssessmentPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    courseId: '',
    title: '',
    maxScore: 100,
    questions: '',
  });

  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assessmentRes, coursesRes] = await Promise.all([
          api.get(`/Assessments/${id}`),
          api.get('/Course'),
        ]);

        const a = assessmentRes.data;
        setForm({
          courseId: a.courseId,
          title: a.title,
          maxScore: a.maxScore,
          questions: a.questions,
        });

        setCourses(coursesRes.data);
      } catch (err) {
        console.error('Error loading assessment or courses:', err);
      }
    };
    fetchData();
  }, [id]);

  const handleUpdateAssessment = async (e) => {
    e.preventDefault();
    try {
      JSON.parse(form.questions); // ✅ Validate JSON
      const payload = {
        ...form,
        question: form.questions,
      };
      await api.put(`/Assessments/${id}`, payload);
      navigate('/assessments');
    } catch (error) {
      alert('❗ Please enter valid JSON in the Questions field.');
      console.error('Update failed:', error);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">
        Edit Assessment
      </h2>

      <form
        onSubmit={handleUpdateAssessment}
        className="space-y-4 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl shadow border dark:border-slate-700"
      >
        <select
          value={form.courseId}
          onChange={(e) => setForm({ ...form, courseId: e.target.value })}
          className="w-full px-4 py-2 rounded border border-gray-200 dark:border-slate-600 dark:bg-slate-700 text-slate-900 dark:text-white"
          required
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.courseId} value={course.courseId}>
              {course.title}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Assessment Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white"
          required
        />

        <textarea
          placeholder="Questions (as JSON)"
          value={form.questions}
          onChange={(e) => setForm({ ...form, questions: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white"
          rows={6}
          required
        />

        <input
          type="number"
          placeholder="Max Score"
          value={form.maxScore}
          onChange={(e) => setForm({ ...form, maxScore: e.target.value })}
          className="w-full px-4 py-2 border border-gray-200 dark:border-slate-600 rounded dark:bg-slate-700 text-slate-900 dark:text-white"
        />

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-gray-700 to-gray-500 hover:from-gray-800 hover:to-gray-600 text-white px-5 py-2.5 rounded-md font-semibold transition shadow-md"
        >
          💾 Update Assessment
        </button>
      </form>
    </motion.div>
  );
};

export default EditAssessmentPage;
