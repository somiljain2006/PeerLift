import axios from 'axios';
import { SubmissionStatus } from '../types';

const API_URL = 'http://localhost:8080/api/v1';

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
                    const { data } = await axios.post(`${API_URL}/auth/refresh-token`, {
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
    login: (data: any) => api.post('/auth/login', data),

    register: (data: any) => api.post('/auth/registration', data),

    validateRegistration: (data: any) => api.post('/auth/validateRegistration',
        data),

    googleLogin: (idToken: string) => api.post('/auth/google', { idToken }),
    forgotPassword: (email: string) => api.post('/auth/forgotPassword',
        { email }),

    validateForgotOtp: (data: { email: string; otp: string }) =>
        api.post('/auth/validateForgotPassword', data),

    resetPassword: (data: { newPassword: string; Token: string }) =>
        api.post('/auth/resetpassword', data),

    resendForgotOtp: (data: { email: string; token?: string }) =>
        api.post('/auth/resendForgotOtp', data),

    resendOtp: (data: any) => api.post('/auth/resendotp', data),
};

export const taskService = {
    createTask: (data: { title: string; description: string; subject: string; rewardCredits: number }, images?:
    File[]) => {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
        formData.append('data', jsonBlob);

        if (images) {
            images.forEach((file) => formData.append('images', file));
        }

        return api.post('/tasks', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },

    getOpenTasks: () => api.get('/tasks/open'),

    getMyPostedTasks: () => api.get('/tasks/my-posted'),

    getMyAcceptedTasks: () => api.get('/tasks/my-accepted'),

    acceptTask: (taskId: number) => api.post(`/tasks/${taskId}/accept`),

    reviewSubmission: (taskId: number, status: SubmissionStatus, feedback: string) =>
        api.post(`/submissions/${taskId}/review`, { status, feedback }),
};

export const submissionService = {
    submitSolution: (taskId: number, files: File[]) => {
        const formData = new FormData();
        files.forEach((file) => formData.append('images', file));
        return api.post(`/submissions/${taskId}/submit`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getSubmission: (taskId: number) => api.get(`/submissions/${taskId}`),

    rateSubmission: (taskId: number, rating: number) =>
        api.post(`/submissions/${taskId}/rate`, { rating }),
};

export const leaderboardService = {
    getLeaderboard: () => api.get('/leaderboard'),
};