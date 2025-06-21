import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const EditCoursePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: ''
  });

  useEffect(() => {
    api.get(`/Course/${id}`)
      .then(res => {
        const { title, description, mediaUrl } = res.data;
        setForm({ title, description, mediaUrl });
      })
      .catch(err => {
        console.error('Failed to load course', err);
        alert('Course not found.');
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        instructorId: localStorage.getItem('userId')
      };
      await api.put(`/Course/${id}`, payload);
      navigate('/courses');
    } catch (err) {
      console.error('Failed to update course', err);
      alert('Failed to update course. Check console.');
    }
  };

  return (
    <motion.div
      className="bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-slate-800 dark:to-slate-700 shadow-lg p-6 rounded-2xl max-w-xl mx-auto mt-10 border dark:border-slate-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-blue-500 text-center">
        Edit Course
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
          <input
            name="title"
            className="w-full px-4 py-2 border border-blue-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            required
            value={form.title}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
          <textarea
            name="description"
            rows={4}
            className="w-full px-4 py-2 border border-blue-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={form.description}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Media URL</label>
          <input
            name="mediaUrl"
            className="w-full px-4 py-2 border border-blue-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
            value={form.mediaUrl}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-800 to-blue-500 hover:from-blue-900 hover:to-blue-600 text-white py-2.5 rounded-md font-semibold transition shadow-md"
        >
          💾 Save Changes
        </button>
      </form>
    </motion.div>
  );
};

export default EditCoursePage;
