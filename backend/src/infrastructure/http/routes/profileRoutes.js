const express = require('express');
const { validateProfile, validateId, validateUsername } = require('../middlewares/validators');

function createProfileRoutes(profileController, authMiddleware) {
    const router = express.Router();

    // Public route avec validation
    router.get('/public/:username', validateUsername, (req, res) => profileController.getByUsername(req, res));

    // Protected routes avec validation
    router.get('/', authMiddleware, (req, res) => profileController.getCurrent(req, res));
    router.get('/:id', authMiddleware, validateId, (req, res) => profileController.getById(req, res));
    router.post('/', authMiddleware, validateProfile, (req, res) => profileController.create(req, res));
    router.put('/', authMiddleware, validateProfile, (req, res) => profileController.update(req, res));
    router.delete('/:id', authMiddleware, validateId, (req, res) => profileController.delete(req, res));

    return router;
}

module.exports = createProfileRoutes;
