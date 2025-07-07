import axios from 'axios';

// Get backend URL from environment variable or use default
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

// Configure axios defaults
axios.defaults.baseURL = `${BACKEND_URL}/api`;
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = 'Bearer dummy-token';
axios.defaults.withCredentials = true;

export default axios; 