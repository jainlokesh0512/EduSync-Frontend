import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CreateAssessmentPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    Title: '',
    Questions: '',
    MaxScore: '',
    CourseId: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/Course') // ✅ Corrected endpoint from /Courses to /Course
      .then(res => setCourses(res.data))
      .catch(err => console.error('Failed to load courses', err));
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedQuestions = JSON.parse(form.Questions); // ✅ Validate JSON

      const payload = {
        Title: form.title,
        Question: JSON.stringify(parsedQuestions), // ✅ Properly stringified
        MaxScore: parseInt(form.maxScore, 10),
        CourseId: form.courseIdourseId
      };

      console.log('Submitting payload:', payload); // Optional debug

      await api.post('/Assessments', payload);
      navigate('/assessments');
    } catch (err) {
      console.error('Failed to create assessment', err);
      alert('❗ Make sure questions are valid JSON.');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-purple-50 to-indigo-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 p-8 rounded-2xl max-w-2xl mx-auto mt-10 shadow-xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 text-center">
        Create New Assessment
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            name="Title"
            value={form.Title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded-lg bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter assessment title"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Questions (JSON Format)
          </label>
          <textarea
            name="Questions"
            value={form.Questions}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded-lg bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder={`[
  {
    "questionText": "What is 2 + 2?",
    "options": ["1", "2", "4", "5"],
    "correctAnswer": "4"
  }
]`}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Max Score</label>
          <input
            type="number"
            name="MaxScore"
            value={form.MaxScore}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded-lg bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
            placeholder="Enter max score"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Select Course</label>
          <select
            name="CourseId"
            value={form.CourseId}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 rounded-lg bg-purple-50 dark:bg-slate-700 text-slate-900 dark:text-white"
          >
            <option value="">-- Select a course --</option>
            {courses.map((c) => (
              <option key={c.courseId || c.CourseId} value={c.courseId || c.CourseId}>
                {c.title || c.Title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-semibold py-2 rounded-lg transition shadow-lg"
        >
          ➕ Create Assessment
        </button>
      </form>
    </motion.div>
  );
};

export default CreateAssessmentPage;
