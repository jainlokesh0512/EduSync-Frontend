// AuthSwitcher.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios';

const AuthSwitcher = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Password: '',
    Role: 'Student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (isLogin) {
        const res = await api.post('/Auth/login', {
          Email: form.Email,
          Password: form.Password
        });

        localStorage.setItem('token', res.data.token);
        localStorage.setItem('userId', res.data.user.userId);
        localStorage.setItem('name', res.data.user.name);
        localStorage.setItem('email', res.data.user.email);
        localStorage.setItem('role', res.data.user.role);

        window.location.href = '/dashboard';
      } else {
        await api.post('/Auth/register', form);
        setSuccess('Registered! Please login.');
        setIsLogin(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F4FF] dark:bg-slate-800 flex items-center justify-center px-4">
      <div className="relative w-full max-w-5xl h-[600px] bg-white dark:bg-slate-700 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2 transition-all duration-500">

        {/* Slide Panel */}
        <motion.div
          className="hidden md:flex items-center justify-center p-10 text-center"
          initial={{ x: isLogin ? 0 : -400 }}
          animate={{ x: isLogin ? 0 : -400 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h2 className="text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {isLogin ? 'Welcome Back!' : 'Join EduSync'}
            </h2>
            <p className="mt-2 text-sm text-indigo-600 dark:text-indigo-200">
              Learn. Grow. Succeed.
            </p>
            <img
              src="https://undraw.co/api/illustrations/597b1e9f-fb55-4077-8827-e963588c06b5"
              alt="Education"
              className="mt-4 w-64 mx-auto"
            />
          </div>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          key={isLogin ? 'login' : 'register'}
          initial={{ x: isLogin ? 300 : -300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: isLogin ? -300 : 300, opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="p-10 z-10"
        >
          <h2 className="text-3xl font-bold text-purple-800 dark:text-white mb-4">
            {isLogin ? 'Login to EduSync' : 'Create an Account'}
          </h2>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-2">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-200">Full Name</label>
                <input
                  type="text"
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border bg-purple-50 dark:bg-slate-600 border-purple-200 dark:border-slate-500"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-200">Email</label>
              <input
                type="email"
                name="Email"
                value={form.Email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border bg-purple-50 dark:bg-slate-600 border-purple-200 dark:border-slate-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-slate-700 dark:text-slate-200">Password</label>
              <input
                type="password"
                name="Password"
                value={form.Password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border bg-purple-50 dark:bg-slate-600 border-purple-200 dark:border-slate-500"
                required
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-sm text-slate-700 dark:text-slate-200">Role</label>
                <select
                  name="Role"
                  value={form.Role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded border bg-purple-50 dark:bg-slate-600 border-purple-200 dark:border-slate-500"
                >
                  <option value="Student">Student</option>
                  <option value="Instructor">Instructor</option>
                </select>
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded"
            >
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>

          <p className="text-sm mt-4 text-center text-slate-600 dark:text-slate-300">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-purple-500 hover:underline"
            >
              {isLogin ? 'Register here' : 'Login here'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthSwitcher;
