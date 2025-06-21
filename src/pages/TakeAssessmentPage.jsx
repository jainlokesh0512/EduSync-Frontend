import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const TakeAssessmentPage = () => {
  const { id } = useParams();
  const [assessment, setAssessment] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resultSubmitted, setResultSubmitted] = useState(false);
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken') || localStorage.getItem('accessToken');
    if (!token) throw new Error('No authentication token found. Please log in again.');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const parseFormattedQuestions = (questionText) => {
    if (!questionText?.trim()) return [];
    const questionBlocks = questionText.split('\n\n').filter(b => b.trim() !== '');
    return questionBlocks.map(block => {
      const lines = block.split('\n').map(l => l.trim()).filter(l => l !== '');
      if (lines.length < 3) return null;
      const question = lines[0].replace(/^Q\d+:\s*/, '');
      const options = lines.find(l => l.startsWith('Options:'))?.replace(/^Options:\s*/, '').split(',').map(o => o.trim());
      const answer = lines.find(l => l.startsWith('Answer:'))?.replace(/^Answer:\s*/, '').trim();
      if (!question || !options || !answer) return null;
      return { questionText: question, options, correctAnswer: answer };
    }).filter(Boolean);
  };

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        const headers = getAuthHeaders();
        const res = await api.get(`/Assessments/${id}`, { headers });
        setAssessment(res.data);
        let parsed = [];
        try {
          parsed = JSON.parse(res.data.question);
          if (!Array.isArray(parsed)) parsed = [];
        } catch {
          parsed = parseFormattedQuestions(res.data.question);
        }
        setQuestions(parsed);
        setStartTime(Date.now());
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Authentication failed. Please log in again.');
        } else if (err.response?.status === 403) {
          setError('You don\'t have permission to access this assessment.');
        } else {
          setError(err.message || 'Failed to load assessment.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAssessment();
  }, [id]);

  const handleOptionSelect = (qIndex, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qIndex]: option }));
  };

  const handleSubmit = async () => {
    if (submitted || questions.length === 0) return;
    let correct = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.correctAnswer) correct++;
    });
    const calculatedScore = Math.round((correct / questions.length) * assessment.maxScore);
    setScore(calculatedScore);
    setSubmitted(true);
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const resultData = {
      assessmentId: assessment.assessmentId,
      assessmentTitle: assessment.title,
      score: calculatedScore,
      maxScore: assessment.maxScore,
      timeTaken,
      attemptDate: new Date().toISOString(),
      questions: questions.length,
      correctAnswers: correct
    };
    try {
      const existing = JSON.parse(localStorage.getItem('userResults') || '[]');
      existing.push(resultData);
      localStorage.setItem('userResults', JSON.stringify(existing));
    } catch {}
    try {
      const headers = getAuthHeaders();
      await api.post('/Results', {
        assessmentId: assessment.assessmentId,
        userId: localStorage.getItem('userId'),
        score: calculatedScore,
        attemptDate: new Date().toISOString(),
        timeTaken,
      }, { headers });
      setResultSubmitted(true);
    } catch {
      setResultSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8 flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-[#f97316] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1e293b] border border-red-500 text-gray-200 px-6 py-4 rounded-xl">
            <h3 className="font-bold mb-2 text-white">Error</h3>
            <p className="text-gray-400">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-[#f97316] hover:bg-[#ea580c] text-white px-6 py-2 rounded-xl font-medium transition-all"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-[#0f172a] p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-white mb-2 text-center">
          {assessment.title}
        </h2>
        <p className="text-gray-400 text-center mb-8">Complete all questions to submit</p>

        {submitted && (
          <motion.div 
            className="bg-[#1e293b] p-8 rounded-xl shadow-lg border border-gray-800 mb-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center">
              <p className="text-2xl font-semibold text-[#f97316] mb-2">
                🎉 Score: {score} / {assessment.maxScore}
              </p>
              <p className="text-gray-400 mb-2">
                ⏱️ Time: {Math.floor((Date.now() - startTime) / 1000)} seconds
              </p>
              {!resultSubmitted && (
                <p className="text-sm text-gray-500 mb-4">
                  ℹ️ Result saved locally
                </p>
              )}
              <button
                onClick={() => navigate('/student/results')}
                className="bg-[#f97316] hover:bg-[#ea580c] text-white px-8 py-3 rounded-xl font-medium transition-all"
              >
                View All Results
              </button>
            </div>
          </motion.div>
        )}

        {questions.length === 0 ? (
          <div className="bg-[#1e293b] p-8 rounded-xl border border-gray-800 text-center">
            <p className="text-gray-400 mb-2">No questions found for this assessment.</p>
            <p className="text-sm text-gray-500">Please contact your instructor.</p>
          </div>
        ) : (
          <form className="space-y-6">
            {questions.map((q, index) => {
              const selected = answers[index];
              const isCorrect = selected === q.correctAnswer;
              return (
                <motion.div
                  key={index}
                  className={`bg-[#1e293b] p-6 rounded-xl shadow-lg border ${
                    submitted
                      ? isCorrect
                        ? 'border-green-500'
                        : 'border-red-500'
                      : 'border-gray-800 hover:border-[#f97316]'
                  } transition-all`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    Question {index + 1}: {q.questionText}
                  </h3>
                  <div className="space-y-3">
                    {q.options.map((option, oIndex) => (
                      <label
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${
                          submitted && option === q.correctAnswer
                            ? 'text-green-400 bg-green-900/20'
                            : submitted && option === selected && option !== q.correctAnswer
                            ? 'text-red-400 bg-red-900/20'
                            : 'text-gray-300 hover:bg-[#0f172a]'
                        } transition-all`}
                      >
                        <input
                          type="radio"
                          name={`question-${index}`}
                          value={option}
                          disabled={submitted}
                          checked={selected === option}
                          onChange={() => handleOptionSelect(index, option)}
                          className="accent-[#f97316]"
                        />
                        <span>{option}</span>
                      </label>
                    ))}
                  </div>
                  {submitted && selected !== q.correctAnswer && (
                    <p className="mt-4 text-sm text-[#f97316] bg-[#0f172a] p-3 rounded-lg">
                      Correct Answer: <strong>{q.correctAnswer}</strong>
                    </p>
                  )}
                </motion.div>
              );
            })}

            {!submitted && questions.length > 0 && (
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={Object.keys(answers).length === 0}
                  className={`px-8 py-3 rounded-xl font-medium transition-all ${
                    Object.keys(answers).length === 0
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-[#f97316] hover:bg-[#ea580c] text-white'
                  }`}
                >
                  Submit Assessment
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </motion.div>
  );
};

export default TakeAssessmentPage;
