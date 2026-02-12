import api from './api';
import type { RegisterFormData, LoginFormData } from '@/utils/validation';

export const authService = {
    /**
     * Register a new user
     */
    register: async (data: RegisterFormData) => {
        const response = await api.post('/register', data);
        return response.data;
    },

    /**
     * Login user and get token
     */
    login: async (data: LoginFormData) => {
        const response = await api.post('/login', data);
        if (response.data.data && response.data.data.token) {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data;
    },

    /**
     * Logout user
     */
    logout: () => {
        localStorage.removeItem('token');
    },
};
