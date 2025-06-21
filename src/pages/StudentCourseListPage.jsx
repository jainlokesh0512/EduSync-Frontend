import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const StudentCourseListPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCourses = async () => {
    try {
      const res = await api.get('/Course');
      setCourses(res.data);
    } catch (err) {
      console.error('Failed to fetch courses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAssessments = (courseId) => {
    if (!courseId) {
      alert('Invalid course ID');
      return;
    }
    navigate(`/student/courses/${courseId}/assessments`);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-[#0f172a] p-8"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">
          Available Courses
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Explore our interactive online courses and start learning today
        </p>

        {loading ? (
          <p className="text-center text-gray-400">⏳ Loading courses...</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400">No courses available.</p>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              },
            }}
          >
            {courses.map((course, index) => (
              <motion.div
                key={course.courseId}
                className="bg-[#1e293b] rounded-2xl shadow-lg p-6 border border-gray-800 hover:border-[#f97316] transition-all group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#f97316] transition-colors">
                  {course.title || 'Untitled Course'}
                </h3>
                <p className="text-gray-400 mb-6">
                  {course.description || 'No description available.'}
                </p>
                <button
                  onClick={() => handleViewAssessments(course.courseId)}
                  className="w-full bg-[#f97316] hover:bg-[#ea580c] text-white font-medium py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  📱 View Assessments
                </button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentCourseListPage;
