import axios from 'axios';
import 'nprogress/nprogress.css';

const NProgress = require('nprogress');

NProgress.configure({ showSpinner: false });

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

http.interceptors.request.use((config) => {
  NProgress.start();
  return config;
});

http.interceptors.response.use((response) => {
  NProgress.done();
  return response;
}, (error) => {
  NProgress.done();
  return Promise.reject(error);
});

export default http;
