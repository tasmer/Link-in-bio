const helmet = require('helmet');

// Configuration de sécurité avec Helmet
const securityHeaders = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
    hsts: {
        maxAge: 31536000, // 1 an
        includeSubDomains: true,
        preload: true
    },
    frameguard: {
        action: 'deny' // Empêche l'iframe (clickjacking)
    },
    noSniff: true, // Empêche le MIME sniffing
    xssFilter: true, // Active le filtre XSS
    referrerPolicy: {
        policy: 'strict-origin-when-cross-origin'
    }
});

// Middleware pour sanitizer les entrées
const sanitizeInput = (req, res, next) => {
    // Nettoyer les entrées pour éviter les injections
    if (req.body) {
        Object.keys(req.body).forEach(key => {
            if (typeof req.body[key] === 'string') {
                // Supprimer les caractères dangereux
                req.body[key] = req.body[key]
                    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Supprimer les scripts
                    .trim();
            }
        });
    }
    next();
};

// Middleware pour logger les tentatives suspectes
const logSuspiciousActivity = (req, res, next) => {
    const suspiciousPatterns = [
        /(\%27)|(\')|(\-\-)|(\%23)|(#)/i, // SQL Injection
        /(<script|<iframe|javascript:|onerror=)/i, // XSS
        /(\.\.\/|\.\.\\)/i // Path traversal
    ];

    const checkString = JSON.stringify(req.body) + JSON.stringify(req.query) + req.url;

    suspiciousPatterns.forEach(pattern => {
        if (pattern.test(checkString)) {
            console.warn('⚠️ Activité suspecte détectée:', {
                ip: req.ip,
                method: req.method,
                url: req.url,
                userAgent: req.get('user-agent'),
                timestamp: new Date().toISOString()
            });
        }
    });

    next();
};

module.exports = {
    securityHeaders,
    sanitizeInput,
    logSuspiciousActivity
};
