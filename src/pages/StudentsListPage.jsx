import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const ResultsPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const instructorId = localStorage.getItem('userId');
  const [assessmentFilter, setAssessmentFilter] = useState('');
  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, assessmentsRes, resultsRes, usersRes] = await Promise.all([
          api.get('/Courses'),
          api.get('/Assessments'),
          api.get('/Results'),
          api.get('/Users'),
        ]);

        const instructorCourses = coursesRes.data.filter(c => c.instructorId === instructorId);
        const courseMap = Object.fromEntries(instructorCourses.map(c => [c.courseId, c.title]));

        const instructorAssessments = assessmentsRes.data.filter(a => courseMap[a.courseId]);
        setAssessments(instructorAssessments);

        const assessmentMap = Object.fromEntries(instructorAssessments.map(a => [a.assessmentId, courseMap[a.courseId]]));

        const usersMap = Object.fromEntries(usersRes.data.map(u => [u.userId, u.fullName || u.name || 'Unknown']));

        const filteredResults = resultsRes.data
          .filter(r => assessmentMap[r.assessmentId])
          .map((r, i) => ({
            id: i + 1,
            student: usersMap[r.userId],
            course: assessmentMap[r.assessmentId],
            assessmentId: r.assessmentId,
            score: r.score,
            date: new Date(r.attemptDate).toLocaleString('en-IN'),
          }));

        setData(filteredResults);
      } catch (err) {
        console.error('Error loading results', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [instructorId]);

  const filteredData = assessmentFilter
    ? data.filter((d) => d.assessmentId === assessmentFilter)
    : data;

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold mb-6 text-purple-800 dark:text-white">
        Assessment Results
      </h2>

      <div className="mb-6 max-w-md">
        <label className="block font-medium text-slate-700 dark:text-slate-300 mb-2">
          Filter by assessment:
        </label>
        <select
          value={assessmentFilter}
          onChange={(e) => setAssessmentFilter(e.target.value)}
          className="w-full px-4 py-2 border border-purple-200 dark:border-slate-600 bg-purple-50 dark:bg-slate-700 text-slate-800 dark:text-white rounded"
        >
          <option value="">-- All Assessments --</option>
          {assessments.map((a) => (
            <option key={a.assessmentId} value={a.assessmentId}>
              {a.title}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filteredData.length === 0 ? (
        <p className="text-gray-500">No results found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-purple-100 dark:bg-slate-700 text-left">
              <tr>
                <th className="px-4 py-2 border dark:border-slate-600">#</th>
                <th className="px-4 py-2 border dark:border-slate-600">Student</th>
                <th className="px-4 py-2 border dark:border-slate-600">Course</th>
                <th className="px-4 py-2 border dark:border-slate-600">Score</th>
                <th className="px-4 py-2 border dark:border-slate-600">Attempted On</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="hover:bg-purple-50 dark:hover:bg-slate-700 transition"
                >
                  <td className="px-4 py-2 border dark:border-slate-600">{item.id}</td>
                  <td className="px-4 py-2 border dark:border-slate-600">{item.student}</td>
                  <td className="px-4 py-2 border dark:border-slate-600">{item.course}</td>
                  <td className="px-4 py-2 border dark:border-slate-600">{item.score}</td>
                  <td className="px-4 py-2 border dark:border-slate-600">{item.date}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default ResultsPage;
