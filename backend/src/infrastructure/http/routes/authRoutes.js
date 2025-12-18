const express = require('express');
const { validateLogin } = require('../middlewares/validators');
const { loginLimiter } = require('../middlewares/rateLimiter');

function createAuthRoutes(authController) {
    const router = express.Router();

    // Route de login avec rate limiting et validation
    router.post('/login', loginLimiter, validateLogin, (req, res) => authController.login(req, res));

    return router;
}

module.exports = createAuthRoutes;
