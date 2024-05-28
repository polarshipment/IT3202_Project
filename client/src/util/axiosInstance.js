import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:7000',
});

axiosInstance.interceptors.request.use(async config => {
    let token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(response => {
    return response;
}, async error => {
    const originalRequest = error.config;
    if (error.response.status === 403 && !originalRequest._retry) {
        originalRequest._retry = true;
        const accessToken = localStorage.getItem('accessToken');
        const res = await axios.post('http://localhost:7000/refreshToken', { token: accessToken });
        if (res.data.accessToken) {
            localStorage.setItem('accessToken', res.data.accessToken);
            originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
            return axios(originalRequest);
        }
    }
    return Promise.reject(error);
});

export default axiosInstance;
