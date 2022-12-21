import axios from 'axios';

axios.defaults.baseURL = process.env.APP_URL;

axios.interceptors.request.use(function (config) {
  if (! /^\/api/.test(config.url)) {
    return config;
  }

  const userToken = localStorage.getItem('userToken');

  if (userToken) {
    config.headers.common['Authorization'] = `Bearer ${userToken}`;
  }

  return config;
});

axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  if (error.response.statusText === 'Unauthorized') {
    localStorage.removeItem('userToken');
    alert('Invalid user token. Window will reload');
    window.location.reload();
    // setTimeout(() => window.location.reload(), 2000);
  }

  return Promise.reject(error);
});

export default axios;