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
<<<<<<< HEAD
const cookieParser = require('cookie-parser');
=======
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f

// Load environment variables
dotenv.config();

<<<<<<< HEAD
if (!process.env.JWT_SECRET) {
    console.error('FATAL: JWT_SECRET environment variable is not set. Create a .env file with JWT_SECRET=your_secret');
    process.exit(1);
}

=======
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f
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
<<<<<<< HEAD
app.use(cookieParser());
=======
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f

// Data sanitization against XSS
app.use(xssMiddleware);

// Protect against HTTP Parameter Pollution
app.use(hpp());

// Implement CORS
<<<<<<< HEAD
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend URL
    credentials: true
}));
=======
app.use(cors());
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f

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

const apiRouter = express.Router();
<<<<<<< HEAD
apiRouter.get('/me', authenticate, userController.getProfile);

apiRouter.post('/register', validate(registerSchema), userController.register);
apiRouter.post('/login', validate(loginSchema), userController.login);
apiRouter.post('/logout', userController.logout);
=======

apiRouter.post('/register', validate(registerSchema), userController.register);
apiRouter.post('/login', validate(loginSchema), userController.login);
>>>>>>> 52f0b2b14a4535d2b2beab190e8cbcc4d34a007f

// Todo Routes (under authentication)
apiRouter.use('/todos', authenticate);
apiRouter.post('/todos', validate(createTodoSchema), todoController.createTodo);
apiRouter.get('/todos', todoController.getTodos);
apiRouter.put('/todos/:id', validate(updateTodoSchema), todoController.updateTodo);
apiRouter.delete('/todos/:id', todoController.deleteTodo);

// Mount API router
app.use('/api', apiRouter);

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
