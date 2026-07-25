const express = require('express');
const app = express();
const authRouter = require('./Routes/auth.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean);

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin(origin, callback) {
        // allow non-browser tools / same-origin requests with no Origin header
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
}));

const interviewRouter = require('./Routes/interview.routes');

app.use('/api/interview', interviewRouter);
app.use('/api/auth', authRouter);

module.exports = app;
