import axios from 'axios';

const service = axios.create({
  baseURL: 'http://127.0.0.1:8888/api/private/v1/',
  timeout:6000
});

export default service;