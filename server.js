const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const hpp = require('hpp');
const dotenv = require('dotenv');

const { connectRedis } = require('./config/redis');
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./middleware/errorMiddleware');
const xssMiddleware = require('./middleware/xssMiddleware');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 1. GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again in 10 minutes!'
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Data sanitization against XSS
app.use(xssMiddleware);

// Protect against HTTP Parameter Pollution
app.use(hpp());

// Implement CORS
app.use(cors());

// 2. ROUTES
const userController = require('./controllers/userController');
const todoController = require('./controllers/todoController');
const { authenticate } = require('./middleware/authMiddleware');
const validate = require('./middleware/validateMiddleware');
const { registerSchema, loginSchema, createTodoSchema, updateTodoSchema } = require('./validations/schemas');

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'To-Do API is running' });
});

// User Routes
app.post('/register', validate(registerSchema), userController.register);
app.post('/login', validate(loginSchema), userController.login);

// Todo Routes (under authentication)
app.use('/todos', authenticate);
app.post('/todos', validate(createTodoSchema), todoController.createTodo);
app.get('/todos', todoController.getTodos);
app.put('/todos/:id', validate(updateTodoSchema), todoController.updateTodo);
app.delete('/todos/:id', todoController.deleteTodo);

// Handle unhandled routes (catch-all)
app.use((req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

// START SERVER
const startServer = async () => {
    try {
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`Application running on port ${PORT}...`);
            console.log(`Environment: ${process.env.NODE_ENV}`);
        });
    } catch (err) {
        console.error('SERVER START ERROR 💥', err);
        process.exit(1);
    }
};

startServer();

module.exports = app; // For testing
