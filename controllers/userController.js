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
<<<<<<< HEAD

        // Send token in cookie
        res.cookie('token', result.token, {
            expires: new Date(Date.now() + 3600000), // 1 hour
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({
            status: 'success',
            data: { role: result.role }
=======
        res.status(200).json({
            status: 'success',
            data: result
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f
        });
    } catch (error) {
        next(error);
    }
};

<<<<<<< HEAD
const logout = (req, res) => {
    res.cookie('token', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

const getProfile = async (req, res, next) => {
    try {
        const user = await userService.getProfile(req.user.id);
        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, logout, getProfile };
=======
module.exports = { register, login };
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f
