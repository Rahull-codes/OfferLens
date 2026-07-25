const express = require('express');
const app = express();
const authRouter = require('./Routes/auth.routes');
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'https://offer-lens-lime.vercel.app',
    credentials: true,
}));

const interviewRouter = require('./Routes/interview.routes');

app.use('/api/interview', interviewRouter);

app.use('/api/auth', authRouter);

module.exports = app;
