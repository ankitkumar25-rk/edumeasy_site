import axios from 'axios';

const apiURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: apiURL,
  withCredentials: true,
});

export default axiosInstance;
