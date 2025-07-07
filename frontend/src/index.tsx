import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';

// Set axios defaults
axios.defaults.baseURL = 'http://localhost:2000';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
); 