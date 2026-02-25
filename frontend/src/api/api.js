import axios from "axios";

const api_url = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = axios.create({
    baseURL: api_url,
    withCredentials: true
})
