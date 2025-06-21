import React from 'react';
import '../styles/AuthBackground.css';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-edu-gradient px-4 relative">
      <div className="absolute inset-0 bg-blur" />
      <div className="z-10 w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
