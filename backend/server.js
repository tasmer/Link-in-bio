require('dotenv').config();

const express = require('express');
const cors = require('cors');
const Container = require('./src/infrastructure/container');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS - TEMPORAIREMENT DÉSACTIVÉ POUR TESTS
// ⚠️ À RÉACTIVER EN PRODUCTION !
app.use(cors()); // Accepte toutes les origines

// Configuration CORS sécurisée (à réactiver plus tard)
/*
const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
app.use(cors(corsOptions));
*/
app.use(express.json({ limit: '10mb' })); // Limite la taille des requêtes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Désactiver le header X-Powered-By
app.disable('x-powered-by');

// Middlewares de sécurité (à installer: npm install helmet express-rate-limit express-validator)
// Décommenter après installation:
//const { securityHeaders, sanitizeInput, logSuspiciousActivity } = require('./src/infrastructure/http/middlewares/security');
//const { apiLimiter } = require('./src/infrastructure/http/middlewares/rateLimiter');
//app.use(securityHeaders);
//app.use(sanitizeInput);
//app.use(logSuspiciousActivity);
//app.use('/api', apiLimiter);

const container = new Container();


//console.log('JWT_SECRET:', process.env.JWT_SECRET);
//console.log('EXPIRE:', process.env.JWT_EXPIRES_IN);

async function startServer(){
    try {
        await container.initialize();

        // Get all routes from container
        const linkRoutes = container.get('linkRoutes');
        const profileRoutes = container.get('profileRoutes');
        const socialLinkRoutes = container.get('socialLinkRoutes');
        const authRoutes = container.get('authRoutes');
        const publicRoutes = container.get('publicRoutes');

        // Mount routes
        app.use('/api/public', publicRoutes);
        app.use('/api/auth', authRoutes);
        app.use('/api/links', linkRoutes);
        app.use('/api/profiles', profileRoutes);
        app.use('/api/social-links', socialLinkRoutes);

        // Health check
        app.get('/api/health', (req, res) => {
            res.json({status: 'OK', message: 'API is running' });
        });

        app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
            console.log(`🌐 Public: http://localhost:${PORT}/api/public/:username`);
            console.log(`🔐 Auth: http://localhost:${PORT}/api/auth/login`);
            console.log(`👤 Profiles: http://localhost:${PORT}/api/profiles`);
            console.log(`🔗 Links: http://localhost:${PORT}/api/links`);
            console.log(`📱 Social Links: http://localhost:${PORT}/api/social-links`);
        });
        
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();