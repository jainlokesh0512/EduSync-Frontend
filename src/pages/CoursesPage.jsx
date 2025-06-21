import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    mediaUrl: '',
  });
  const [courseToDelete, setCourseToDelete] = useState(null);

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem('userId');
      
      const payload = {
        title: form.title || null,
        description: form.description || null,
        mediaUrl: form.mediaUrl || null,
        instructorId: userId ? userId : null
      };

      console.log('Sending course creation request with payload:', payload);
      
      const response = await api.post('/Course', payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Course created successfully:', response.data);
      
      setForm({ title: '', description: '', mediaUrl: '' });
      await fetchCourses();
      
      alert('Course created successfully!');
    } catch (error) {
      console.error('Error creating course:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 
                         error.response?.data?.title || 
                         'Failed to create course. Please check your input and try again.';
      
      alert(`Error: ${errorMessage}`);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await api.delete(`/Course/${courseId}`);
      setCourseToDelete(null);
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. See console for details.');
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#0f172a] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">
          Welcome to EduSync
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Explore our interactive online courses and start learning today
        </p>

        {/* Create Course Form */}
        <motion.form
          onSubmit={handleCreateCourse}
          className="space-y-4 mb-12 bg-[#1e293b] rounded-2xl shadow-lg p-8 border border-gray-800"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Create New Course
          </h3>
          <input
            type="text"
            placeholder="Title"
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f172a] text-white placeholder-gray-500 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-opacity-20 transition-all"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f172a] text-white placeholder-gray-500 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-opacity-20 transition-all"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={4}
          />
          <input
            type="text"
            placeholder="Media URL"
            className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-[#0f172a] text-white placeholder-gray-500 focus:border-[#f97316] focus:ring-2 focus:ring-[#f97316] focus:ring-opacity-20 transition-all"
            value={form.mediaUrl}
            onChange={(e) => setForm({ ...form, mediaUrl: e.target.value })}
          />
          <button
            type="submit"
            className="w-full block mx-auto bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl font-semibold transition-all"
          >
            Create Course
          </button>
        </motion.form>

        {/* Course Cards */}
        {courses.length === 0 ? (
          <p className="text-center text-gray-400">No courses found.</p>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } },
            }}
          >
            {courses.map((course) => (
              <motion.div
                key={course.courseId}
                className="bg-[#1e293b] rounded-2xl shadow-lg p-6 border border-gray-800 hover:border-[#f97316] transition-all group"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h4 className="text-xl font-semibold text-white mb-2 group-hover:text-[#f97316] transition-colors">
                  {course.title}
                </h4>
                <p className="text-gray-400 mb-6">
                  {course.description || 'No description'}
                </p>

                <div className="flex justify-between">
                  <Link
                    to={`/courses/edit/${course.courseId}`}
                    className="w-full text-center bg-[#f97316] text-white py-3 rounded-xl font-medium hover:bg-[#ea580c] transition-all flex items-center justify-center gap-2"
                  >
                    View Course
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Delete Confirmation Modal */}
        {courseToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-md shadow-xl border border-gray-800">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Confirm Delete
              </h3>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete <strong className="text-white">{courseToDelete.title}</strong>?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setCourseToDelete(null)}
                  className="px-6 py-2.5 text-gray-400 hover:text-white transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteCourse(courseToDelete.courseId)}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl transition-all font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default CoursesPage;
