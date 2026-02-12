const userService = require('../services/userService');

const register = async (req, res, next) => {
    try {
        const user = await userService.register(req.body);
        res.status(201).json({
            status: 'success',
            message: 'User registered successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await userService.login(email, password);
        res.status(200).json({
            status: 'success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login };
