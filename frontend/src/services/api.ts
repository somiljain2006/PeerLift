import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${API_URL}/refresh-token`, {
                        refreshToken: refreshToken,
                    });

                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    originalRequest.headers['Authorization'] = `Bearer ${data.data.accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {

    login: (data: any) => api.post('/login', data),


    register: (data: any) => api.post('/registration', data),


    validateRegistration: (data: any) => api.post('/validateRegistration', data),


    googleLogin: (idToken: string) => api.post('/google', { idToken }),

    forgotPassword: (email: string) => api.post('/forgotPassword', { email }),

    resendOtp: (data: any) => api.post('/resendotp', data),

    validateForgotOtp: (data: { email: string; otp: string }) =>
        api.post('/validateForgotPassword', data),

    resetPassword: (data: { newPassword: string; Token: string }) =>
        api.post('/resetpassword', data),

    resendForgotOtp: (data: { email: string; token?: string }) =>
        api.post('/resendForgotOtp', data),
};