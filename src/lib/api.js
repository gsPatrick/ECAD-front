import axios from 'axios';

const api = axios.create({
    baseURL: '/api/extractor',
    withCredentials: true, // Important for sending cookies
});

// Interceptor to handle 401/403 errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event("session-expired"));
            }
        }
        return Promise.reject(error);
    }
);

export default api;
