import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentAssessmentListPage = () => {
  const { courseId } = useParams();
  const [assessments, setAssessments] = useState([]);
  const [courseTitle, setCourseTitle] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!courseId) return;

    const fetchAssessments = async () => {
      try {
        const res = await api.get('/Assessments');
        const filtered = res.data.filter(a => a.courseId === courseId);
        setAssessments(filtered);
      } catch (err) {
        console.error('Failed to fetch assessments', err);
      }
    };

    const fetchCourseTitle = async () => {
      try {
        const res = await api.get(`/Course/${courseId}`);
        setCourseTitle(res.data.title || 'Course');
      } catch (err) {
        console.error('Course title fetch failed', err);
      }
    };

    fetchCourseTitle();
    fetchAssessments();
  }, [courseId]);

  return (
    <motion.div
      className="min-h-screen bg-[#0f172a] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">
          {courseTitle}
        </h2>
        <p className="text-gray-400 text-center mb-12">
          Select an assessment to begin
        </p>

        {assessments.length === 0 ? (
          <div className="bg-[#1e293b] rounded-2xl p-8 border border-gray-800">
            <p className="text-center text-gray-400">
              No assessments available for this course yet.
            </p>
          </div>
        ) : (
          <motion.div
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            {assessments.map((a) => (
              <motion.div
                key={a.assessmentId}
                className="bg-[#1e293b] rounded-2xl shadow-lg p-6 border border-gray-800 hover:border-[#f97316] transition-all group"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col h-full">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#f97316] transition-colors">
                    {a.title}
                  </h3>
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-gray-400">
                      Max Score: {a.maxScore}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/student/assessments/${a.assessmentId}/take`)}
                    className="mt-auto w-full bg-[#f97316] hover:bg-[#ea580c] text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    Start Assessment
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentAssessmentListPage;
