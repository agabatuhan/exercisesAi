import api from './api';
import type { CreateTodoFormData, UpdateTodoFormData } from '@/utils/validation';

export const todoService = {
    /**
     * Get all tasks
     */
    getTodos: async () => {
        const response = await api.get('/todos');
        return response.data.data.todos;
    },

    /**
     * Create a new task
     */
    createTodo: async (data: CreateTodoFormData) => {
        const response = await api.post('/todos', data);
        return response.data.data.todo;
    },

    /**
     * Update a task
     */
    updateTodo: async (id: string, data: UpdateTodoFormData) => {
        const response = await api.put(`/todos/${id}`, data);
        return response.data.data.todo;
    },

    /**
     * Delete a task
     */
    deleteTodo: async (id: string) => {
        const response = await api.delete(`/todos/${id}`);
        return response.data;
    },
};
