import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios';
import {
  BookOpen,
  ClipboardCheck,
  BarChart2,
  LayoutGrid,
  UserCircle,
} from 'lucide-react';

const DashboardPage = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [counts, setCounts] = useState({
    courses: 0,
    assessments: 0
  });

  useEffect(() => {
    setName(localStorage.getItem('name') || '');
    setRole(localStorage.getItem('role') || '');
  }, []);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const [coursesRes, assessmentsRes] = await Promise.all([
          api.get('/Course'),
          api.get('/Assessments')
        ]);

        // For instructors, filter courses they teach
        const instructorCourses = role === 'Instructor' 
          ? coursesRes.data.filter(course => course.instructorId === userId)
          : coursesRes.data;

        // For instructors, filter assessments from their courses
        const courseIds = instructorCourses.map(course => course.courseId);
        const instructorAssessments = role === 'Instructor'
          ? assessmentsRes.data.filter(assessment => courseIds.includes(assessment.courseId))
          : assessmentsRes.data;

        setCounts({
          courses: instructorCourses.length,
          assessments: instructorAssessments.length
        });
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    if (role) {
      fetchCounts();
    }
  }, [role]);

  const cardVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: 'easeOut',
      },
    }),
  };

  const dashboardCards = {
    Instructor: [
      {
        to: '/courses',
        label: 'Manage Courses',
        icon: <BookOpen size={30} color="currentColor" />,
      },
      {
        to: '/assessments',
        label: 'Manage Assessments',
        icon: <ClipboardCheck size={30} color="currentColor" />,
      },
      {
        to: '/results',
        label: 'View Results',
        icon: <BarChart2 size={30} color="currentColor" />,
      },
    ],
    Student: [
      {
        to: '/student/courses',
        label: 'Browse Courses',
        icon: <LayoutGrid size={30} color="currentColor" />,
      },
      {
        to: '/student/results',
        label: 'My Results',
        icon: <BarChart2 size={30} color="currentColor" />,
      },
      {
        to: '/profile',
        label: 'My Profile',
        icon: <UserCircle size={30} color="currentColor" />,
      },
    ],
  };

  return (
    <div className="p-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold text-center mb-2 bg-gradient-to-r from-gray-300 to-white text-transparent bg-clip-text"
      >
        Welcome, {name || 'User'}!
      </motion.h1>
      <p className="text-center text-[var(--text-secondary)] mb-12">
  You are logged in as <strong className="text-[var(--text-accent)]">{role || '...'}</strong>. Let's get started!
  {role === 'Instructor' && (
    <><br />You have <strong>{counts.courses}</strong> courses and <strong>{counts.assessments}</strong> assessments.</>
  )}
</p>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(dashboardCards[role] || []).map((item, i) => (
          <motion.div
            key={item.to}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="group"
          >
            <Link
              to={item.to}
              className="block h-full p-6 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-4px] hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-accent)] group-hover:bg-[var(--bg-secondary)]">
                    {item.icon}
                  </div>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-[var(--text-primary)]">{item.label}</h2>
                  <div className="mt-2">
                    <span className="text-[var(--text-accent)] text-sm">Click to open</span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
