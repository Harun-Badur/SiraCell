import axios from 'axios';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
});

// Authentication Interceptor
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Refresh Token Interceptor
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                // No refresh token available, logout
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(error);
            }

            try {
                // Add your real refresh endpoint logic here if it exists.
                // Assuming it's POST /auth/refresh according to standard patterns, though not specified explicitly.
                const { data } = await axios.post('http://127.0.0.1:8000/api/v1/auth/refresh', {
                    refresh_token: refreshToken
                });
                
                const newAccessToken = data.data?.access_token || data.access_token;
                localStorage.setItem('token', newAccessToken);
                
                if (data.data?.refresh_token || data.refresh_token) {
                    localStorage.setItem('refresh_token', data.data?.refresh_token || data.refresh_token);
                }

                api.defaults.headers.common['Authorization'] = 'Bearer ' + newAccessToken;
                originalRequest.headers.Authorization = 'Bearer ' + newAccessToken;
                
                processQueue(null, newAccessToken);
                return api(originalRequest);
            } catch (err) {
                processQueue(err, null);
                localStorage.removeItem('token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;