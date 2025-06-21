import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('role');

  const fetchCourses = async () => {
    try {
      const response = await api.get('/Courses');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="p-6 max-w-6xl mx-auto"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600">
          Available Courses
        </h2>

        {userRole === 'Instructor' && (
          <a
            href="/courses/create"
            className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-md transition"
          >
            ➕ Add New Course
          </a>
        )}
      </div>

      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading...</p>
      ) : courses.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-300">No courses found.</p>
      ) : (
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {courses.map((course) => (
            <motion.div
              key={course.CourseId}
              className="p-5 border border-purple-200 dark:border-slate-700 rounded-2xl bg-white dark:bg-slate-800 shadow-md hover:shadow-xl transition-all"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold text-purple-700 dark:text-purple-300 mb-1">
                {course.Title}
              </h3>
              <p className="text-sm text-slate-700 dark:text-slate-300">
                {course.Description || 'No description provided.'}
              </p>
              {course.InstructorName && (
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                  <strong>Instructor:</strong> {course.InstructorName}
                </p>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default CoursesPage;
