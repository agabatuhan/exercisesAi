const { redisClient } = require('../config/redis');
const AppError = require('../utils/AppError');

class TodoService {
    async createTodo(userId, todoData) {
        const { title, description } = todoData;
        const todoId = Date.now().toString();

        const todo = {
            id: todoId,
            userId,
            title,
            description: description || '',
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        await redisClient.hSet(`todo:${todoId}`, todo);
        await redisClient.sAdd(`user:${userId}:todos`, todoId);
        await redisClient.sAdd(`todos:all`, todoId);

        return todo;
    }

    async getTodos(userId, role) {
        let todoIds = [];

        if (role === 'admin') {
            todoIds = await redisClient.sMembers('todos:all');
        } else {
            todoIds = await redisClient.sMembers(`user:${userId}:todos`);
        }

        const todos = [];
        for (const id of todoIds) {
            const todo = await redisClient.hGetAll(`todo:${id}`);
            if (todo && Object.keys(todo).length > 0) {
                todos.push(todo);
            }
        }

        return todos;
    }

    async updateTodo(todoId, userId, role, updates) {
        const todoKey = `todo:${todoId}`;
        const todo = await redisClient.hGetAll(todoKey);

        if (!todo || Object.keys(todo).length === 0) {
            throw new AppError('Todo not found', 404);
        }

        if (role !== 'admin' && todo.userId !== userId) {
            throw new AppError('Access denied', 403);
        }

        delete updates.id;
        delete updates.userId;
        delete updates.createdAt;

        if (Object.keys(updates).length > 0) {
            for (const key in updates) {
                updates[key] = String(updates[key]);
            }
            await redisClient.hSet(todoKey, updates);
        }

        return await redisClient.hGetAll(todoKey);
    }

    async deleteTodo(todoId, userId, role) {
        const todoKey = `todo:${todoId}`;
        const todo = await redisClient.hGetAll(todoKey);

        if (!todo || Object.keys(todo).length === 0) {
            throw new AppError('Todo not found', 404);
        }

        if (role !== 'admin' && todo.userId !== userId) {
            throw new AppError('Access denied', 403);
        }

        await redisClient.del(todoKey);
        await redisClient.sRem(`user:${todo.userId}:todos`, todoId);
        await redisClient.sRem(`todos:all`, todoId);

        return true;
    }
}

module.exports = new TodoService();
