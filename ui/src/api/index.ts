import axios from 'axios';

const http = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => config);

http.interceptors.response.use((response) => response, (error) => Promise.reject(error));

export default http;
