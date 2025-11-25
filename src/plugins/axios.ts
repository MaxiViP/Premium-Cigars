import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

axios.defaults.baseURL = API;
axios.defaults.withCredentials = true;

export default axios;
