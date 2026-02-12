const todoService = require('../services/todoService');

const createTodo = async (req, res, next) => {
    try {
        const todo = await todoService.createTodo(req.user.id, req.body);
        res.status(201).json({
            status: 'success',
            data: { todo }
        });
    } catch (error) {
        next(error);
    }
};

const getTodos = async (req, res, next) => {
    try {
        const todos = await todoService.getTodos(req.user.id, req.user.role);
        res.status(200).json({
            status: 'success',
            results: todos.length,
            data: { todos }
        });
    } catch (error) {
        next(error);
    }
};

const updateTodo = async (req, res, next) => {
    try {
        const updatedTodo = await todoService.updateTodo(
            req.params.id,
            req.user.id,
            req.user.role,
            req.body
        );
        res.status(200).json({
            status: 'success',
            data: { todo: updatedTodo }
        });
    } catch (error) {
        next(error);
    }
};

const deleteTodo = async (req, res, next) => {
    try {
        await todoService.deleteTodo(req.params.id, req.user.id, req.user.role);
        res.status(200).json({
            status: 'success',
            message: 'Todo deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
