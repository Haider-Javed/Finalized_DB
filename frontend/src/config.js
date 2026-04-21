// config.js - Set API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const apiConfig = {
  API_URL: API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL,
  signup: `${API_URL}/signup`,
  login: `${API_URL}/login`,
  updateProfile: `${API_URL}/update-profile`
};
