import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { motion } from 'framer-motion';

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'var(--bg-primary)',
    padding: '16px',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  },
  container: {
    maxWidth: '480px',
    width: '100%',
    backgroundColor: 'var(--bg-secondary)',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px var(--shadow-color)',
    overflow: 'hidden',
    padding: '40px',
    border: '1px solid var(--border-color)',
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  companyName: {
    fontSize: '24px',
    fontWeight: '700',
    color: 'var(--text-accent)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '28px',
    fontWeight: '700',
    color: 'var(--text-primary)',
    marginBottom: '8px',
    textAlign: 'center',
  },
  subheading: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
    marginBottom: '32px',
    textAlign: 'center',
  },
  messageError: {
    color: '#ef4444',
    marginBottom: '16px',
    fontSize: '14px',
    padding: '12px 16px',
    backgroundColor: 'var(--error-bg)',
    borderRadius: '8px',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
    color: 'var(--text-primary)',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    color: 'var(--text-primary)',
  },
  inputFocus: {
    borderColor: 'var(--text-accent)',
    boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
  },
  button: {
    width: '100%',
    padding: '16px',
    background: 'var(--button-gradient)',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '600',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.3)',
    marginTop: '16px',
  },
  buttonHover: {
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 8px -1px rgba(37, 99, 235, 0.4)',
  },
  footerText: {
    fontSize: '14px',
    color: 'var(--text-secondary)',
    textAlign: 'center',
    marginTop: '32px',
  },
  link: {
    color: 'var(--text-accent)',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'color 0.2s ease',
  },
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [btnHover, setBtnHover] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/Auth/login', { email, password });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userId', res.data.user.userId);
      localStorage.setItem('name', res.data.user.name);
      localStorage.setItem('email', res.data.user.email);
      localStorage.setItem('role', res.data.user.role);

      window.location.href = '/dashboard';
    } catch {
      setError('Invalid email or password.');
    }
  };

  return (
    <div style={styles.page}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={styles.container}
      >
        <div style={styles.header}>
          <div style={styles.companyName}>EduSync</div>
          <h2 style={styles.heading}>Welcome Back</h2>
          <p style={styles.subheading}>Sign in to continue to your account</p>
        </div>

        {error && <div style={styles.messageError}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
              required
              style={{
                ...styles.input,
                ...(emailFocus ? styles.inputFocus : {})
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setPasswordFocus(true)}
              onBlur={() => setPasswordFocus(false)}
              required
              style={{
                ...styles.input,
                ...(passwordFocus ? styles.inputFocus : {})
              }}
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Sign In
          </motion.button>
        </form>

        <p style={styles.footerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.link}>
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
