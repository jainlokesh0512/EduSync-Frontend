import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';

const AssessmentResultsPage = () => {
  const { id } = useParams();
  const [results, setResults] = useState([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    fetchAssessmentTitle();
    fetchResults();
  }, [id]);

  const fetchAssessmentTitle = async () => {
    try {
      const res = await api.get(`/Assessments/${id}`);
      setTitle(res.data.Title);
    } catch (err) {
      console.error('Error fetching assessment title', err);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await api.get(`/Results/Assessment/${id}`);
      setResults(res.data);
    } catch (err) {
      console.error('Error fetching results', err);
    }
  };

  return (
    <motion.div
      className="p-6 max-w-5xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6 text-center">
        Results for: {title}
      </h2>

      {results.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-slate-600 dark:text-slate-300"
        >
          No results found for this assessment.
        </motion.p>
      ) : (
        <motion.div
          className="overflow-x-auto bg-white dark:bg-slate-800 shadow-xl rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <table className="table-auto w-full border-separate border-spacing-y-2 px-4 py-2">
            <thead>
              <tr className="text-left bg-purple-100 dark:bg-slate-700 rounded">
                <th className="py-3 px-4 rounded-l-xl">#</th>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4 rounded-r-xl">Attempt Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r, index) => (
                <motion.tr
                  key={r.ResultId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-purple-50 dark:bg-slate-700 hover:bg-purple-100 dark:hover:bg-slate-600 transition-all rounded-lg text-sm shadow-sm"
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{r.UserName}</td>
                  <td className="py-3 px-4 font-semibold">{r.Score}</td>
                  <td className="py-3 px-4">
                    {new Date(r.AttemptDate).toLocaleString('en-IN')}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AssessmentResultsPage;
