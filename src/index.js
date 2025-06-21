// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
// index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'; // Tailwind last, to override Bootstrap where needed



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
