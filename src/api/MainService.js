import axios from 'axios';

const auth = axios.create({
   timeout: 60000,
   baseURL: 'http://127.0.0.1:3010/',
   // baseURL: "http://197.243.1.51:3010/"
});

const instance = axios.create({
   timeout: 60000,
   baseURL: 'http://127.0.0.1:3010',
   // baseURL: "http://197.243.1.51:3010",
   headers: {
      'Content-Type': 'application/json',
   },
});

export default auth;

export { instance };
