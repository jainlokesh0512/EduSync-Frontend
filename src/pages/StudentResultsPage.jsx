import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { motion } from 'framer-motion';

const StudentResultsPage = () => {
  const [results, setResults] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token =
          localStorage.getItem('token') ||
          localStorage.getItem('authToken') ||
          localStorage.getItem('accessToken');

        if (!token) {
          throw new Error('No authentication token found. Please log in again.');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        const [resResults, resAssessments] = await Promise.all([
          api.get('/Results', config),
          api.get('/Assessments', config),
        ]);

        const userResults = resResults.data.filter(
          (r) =>
            r.userId === userId ||
            r.userId?.toString() === userId ||
            r.userId?.toString().toLowerCase() === userId?.toLowerCase()
        );

        setResults(userResults);
        setAssessments(resAssessments.data);
      } catch (err) {
        console.error('Failed to fetch student results', err);
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError("You don't have permission to view results.");
        } else if (err.message.includes('No authentication token')) {
          setError(err.message);
        } else {
          setError('Failed to load results. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    } else {
      setError('No user ID found. Please log in again.');
      setLoading(false);
    }
  }, [userId]);

  const getAssessment = (assessmentId) =>
    assessments.find((a) => a.assessmentId === assessmentId);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--text-accent)]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-500 px-6 py-4 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-5 py-2 rounded-lg hover:bg-[var(--bg-secondary)] transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="p-6 max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white mb-8 text-center">
        My Results
      </h2>

      {results.length === 0 ? (
        <div className="text-center">
          <p className="text-[var(--text-primary)] mb-4">No results found.</p>
          <p className="text-sm text-[var(--text-secondary)]">
            Complete some assessments to see your results here.
          </p>
        </div>
      ) : (
        <motion.div
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
        >
          {results.map((r, i) => {
            const assessment = getAssessment(r.assessmentId);
            const title = assessment?.title || 'Unknown Assessment';
            const maxScore = assessment?.maxScore || 100;
            const percentage = Math.round((r.score / maxScore) * 100);
            const isPass = percentage >= 40;

            return (
              <motion.div
                key={r.resultId}
                className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-lg p-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                    {title}
                  </h3>
                  <span
                    className={`text-sm px-4 py-1.5 rounded-full font-semibold ${
                      isPass
                        ? 'bg-green-500 bg-opacity-10 text-green-500'
                        : 'bg-red-500 bg-opacity-10 text-red-500'
                    }`}
                  >
                    {isPass ? 'Pass' : 'Fail'}
                  </span>
                </div>

                <p className="text-[var(--text-primary)] mb-1">
                  Score: <strong>{r.score}</strong> / {maxScore} ({percentage}%)
                </p>
                <p className="text-sm text-[var(--text-secondary)] mb-3">
                  Attempted on: {new Date(r.attemptDate).toLocaleString()}
                </p>

                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 0.7 }}
                    className={`h-3 rounded-full ${
                      isPass ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </motion.div>
  );
};

export default StudentResultsPage;
