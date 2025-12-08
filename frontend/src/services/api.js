import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
    getProfile: (userId) => api.get(`/users/${userId}`),
    updateProfile: (userId, data) => api.put(`/users/${userId}`, data),
};

// Recipe API
export const recipeAPI = {
    getAll: (params) => api.get('/recipes', { params }),
    getById: (id) => api.get(`/recipes/${id}`),
    create: (data) => api.post('/recipes', data),
    update: (id, data) => api.put(`/recipes/${id}`, data),
    delete: (id) => api.delete(`/recipes/${id}`),
};

// Planner API
export const plannerAPI = {
    getWeeklyPlan: (userId) => api.get(`/planner/weekly/${userId}`),
    addEntry: (data) => api.post('/planner/entry', data),
    updateEntry: (id, data) => api.put(`/planner/entry/${id}`, data),
    deleteEntry: (id) => api.delete(`/planner/entry/${id}`),
};

// Grocery API
export const groceryAPI = {
    getList: (userId) => api.get(`/grocery/${userId}`),
};

// Favorites API
export const favoritesAPI = {
    getAll: (userId) => api.get(`/favorites/${userId}`),
    add: (recipeId) => api.post('/favorites', { recipeId }),
    remove: (id) => api.delete(`/favorites/${id}`),
    removeByRecipeId: (recipeId) => api.delete(`/favorites/recipe/${recipeId}`),
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getUsers: () => api.get('/admin/users'),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
