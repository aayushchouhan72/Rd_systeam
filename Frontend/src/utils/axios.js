import axios from "axios";

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : "http://localhost:5050/api",
  withCredentials: true,
});

export default Axios;
