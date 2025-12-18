const rateLimit = require('express-rate-limit');

// Rate limiter pour les tentatives de login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 tentatives max
    message: {
        error: 'Trop de tentatives de connexion. Réessayez dans 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Utiliser l'IP pour identifier l'utilisateur
    keyGenerator: (req) => {
        return req.ip || req.connection.remoteAddress;
    }
});

// Rate limiter général pour l'API
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requêtes max
    message: {
        error: 'Trop de requêtes. Réessayez plus tard.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

// Rate limiter pour les routes publiques
const publicLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 30, // 30 requêtes max
    message: {
        error: 'Trop de requêtes. Réessayez dans une minute.'
    },
    standardHeaders: true,
    legacyHeaders: false
});

module.exports = {
    loginLimiter,
    apiLimiter,
    publicLimiter
};
