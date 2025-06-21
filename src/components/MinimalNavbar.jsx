import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const syncRole = () => {
      setRole(localStorage.getItem('role') || '');
      setName(localStorage.getItem('name') || '');
    };

    syncRole();
    window.addEventListener('storage', syncRole);
    return () => window.removeEventListener('storage', syncRole);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-[var(--bg-secondary)] border-b border-[var(--border-color)] shadow-lg px-6 py-4 flex justify-between items-center rounded-b-xl"
    >
      <Link
        to="/dashboard"
        className="text-2xl font-extrabold text-[var(--text-accent)]"
      >
        EduSync
      </Link>

      <div className="flex items-center gap-5 text-sm font-semibold">
        {role === 'Instructor' && (
          <>
            <Link to="/dashboard" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Dashboard</Link>
            <Link to="/courses" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Courses</Link>
            <Link to="/assessments" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Assessments</Link>
            <Link to="/results" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Results</Link>
            <Link to="/students" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Students</Link>
          </>
        )}

        {role === 'Student' && (
          <>
            <Link to="/dashboard" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Dashboard</Link>
            <Link to="/student/courses" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">Courses</Link>
            <Link to="/student/results" className="text-[var(--text-primary)] hover:text-[var(--text-accent)] transition">My Results</Link>
          </>
        )}

        {name && (
          <motion.button
            onClick={handleLogout}
            whileHover={{ scale: 1.05 }}
            className="ml-4 px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-300"
          >
            Logout
          </motion.button>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
