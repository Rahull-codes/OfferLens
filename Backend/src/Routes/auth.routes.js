const express = require('express');
const authController = require('../Controller/auth.controller');
const authMiddleware = require('../Middlewares/auth.middleware');

const authRouter = express.Router();

/**
 * @route POST /api/auth/register
 * @description Register a new user
 * @access Public
 */
authRouter.post('/register', authController.registerUsercontroller);

/**
 * @route POST /api/auth/login
 * @description Login a user
 * @access Public
 */
authRouter.post('/login', authController.loginUsercontroller);

/**
 * @route POST /api/auth/logout
 * @description Logout a user by blacklisting the token
 * @access Public
 */
authRouter.get('/logout', authController.logoutUsercontroller);

/**
 * @route GET /api/auth/getme
 * @description Get the user details
 * @access Private
 */
authRouter.get('/get-me', authMiddleware.Authuser, authController.getmecontroller);

module.exports = authRouter;
