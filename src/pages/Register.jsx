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
  messageSuccess: {
    color: '#10b981',
    marginBottom: '16px',
    fontSize: '14px',
    padding: '12px 16px',
    backgroundColor: 'var(--success-bg)',
    borderRadius: '8px',
    border: '1px solid rgba(16, 185, 129, 0.2)',
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
  select: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    borderRadius: '12px',
    border: '2px solid var(--border-color)',
    backgroundColor: 'var(--input-bg)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'all 0.2s ease',
    appearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2394a3b8\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 16px center',
    backgroundSize: '16px',
    color: 'var(--text-primary)',
  },
  inputFocus: {
    borderColor: 'var(--text-accent)',
    boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
  },
  selectFocus: {
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

const Register = () => {
  const [form, setForm] = useState({
    Name: '',
    Email: '',
    Password: '',
    Role: 'Student',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [btnHover, setBtnHover] = useState(false);
  const [focusedField, setFocusedField] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      console.log('Attempting to register with data:', form);
      
      const registrationData = {
        name: form.Name,
        email: form.Email,
        password: form.Password,
        role: form.Role
      };
      
      console.log('Sending registration data:', registrationData);
      
      const response = await api.post('/Auth/register', registrationData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Registration successful:', response.data);
      setSuccess('🎉 Registration successful! Please login.');
    } catch (err) {
      console.error('Registration error:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        headers: err.response?.headers
      });
      
      const errorMessage = err.response?.data?.message || 
                         err.response?.data?.title || 
                         'Registration failed. Please check your details and try again.';
      
      setError(`❗ ${errorMessage}`);
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
          <h2 style={styles.heading}>Create Account</h2>
          <p style={styles.subheading}>Join us and start your learning journey</p>
        </div>

        {error && <div style={styles.messageError}>{error}</div>}
        {success && <div style={styles.messageSuccess}>{success}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={form.Name}
              onChange={(e) => setForm({ ...form, Name: e.target.value })}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField('')}
              required
              style={{
                ...styles.input,
                ...(focusedField === 'name' ? styles.inputFocus : {})
              }}
              placeholder="Enter your full name"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={form.Email}
              onChange={(e) => setForm({ ...form, Email: e.target.value })}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField('')}
              required
              style={{
                ...styles.input,
                ...(focusedField === 'email' ? styles.inputFocus : {})
              }}
              placeholder="Enter your email"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.Password}
              onChange={(e) => setForm({ ...form, Password: e.target.value })}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField('')}
              required
              style={{
                ...styles.input,
                ...(focusedField === 'password' ? styles.inputFocus : {})
              }}
              placeholder="Choose a secure password"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label} htmlFor="role">Role</label>
            <select
              id="role"
              value={form.Role}
              onChange={(e) => setForm({ ...form, Role: e.target.value })}
              onFocus={() => setFocusedField('role')}
              onBlur={() => setFocusedField('')}
              style={{
                ...styles.select,
                ...(focusedField === 'role' ? styles.selectFocus : {})
              }}
            >
              <option value="Student">Student</option>
              <option value="Instructor">Instructor</option>
            </select>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={btnHover ? { ...styles.button, ...styles.buttonHover } : styles.button}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
          >
            Create Account
          </motion.button>
        </form>

        <p style={styles.footerText}>
          Already have an account?{' '}
          <Link to="/login" style={styles.link}>
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
