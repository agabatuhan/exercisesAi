const { z } = require('zod');

const registerSchema = z.object({
    username: z.string().min(3).max(30),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['user', 'admin']).optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

const createTodoSchema = z.object({
    title: z.string().min(1).max(100),
    description: z.string().max(500).optional()
});

const updateTodoSchema = z.object({
    title: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional(),
    status: z.enum(['pending', 'in-progress', 'completed']).optional()
});

module.exports = {
    registerSchema,
    loginSchema,
    createTodoSchema,
    updateTodoSchema
};
