const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');
const AppError = require('../utils/AppError');

class UserService {
    async register(userData) {
        const { username, email, password, role } = userData;

        const existingId = await redisClient.get(`user:email:${email}`);
        if (existingId) {
            throw new AppError('User already exists', 400);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const userId = Date.now().toString();

        const user = {
            id: userId,
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        };

        await redisClient.hSet(`user:${userId}`, user);
        await redisClient.set(`user:email:${email}`, userId);

        return { id: userId, username, email, role: user.role };
    }

    async login(email, password) {
        const userId = await redisClient.get(`user:email:${email}`);
        if (!userId) {
            throw new AppError('Invalid credentials', 401);
        }

        const user = await redisClient.hGetAll(`user:${userId}`);
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new AppError('Invalid credentials', 401);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, role: user.role };
    }

    async getProfile(userId) {
        const user = await redisClient.hGetAll(`user:${userId}`);
        if (!user || Object.keys(user).length === 0) {
            throw new AppError('User not found', 404);
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        };
    }
}

module.exports = new UserService();
