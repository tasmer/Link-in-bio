const express = require('express');
const { validateSocialLink, validateId } = require('../middlewares/validators');

function createSocialLinkRoutes(socialLinkController, authMiddleware) {
    const router = express.Router();

    // Toutes les routes nécessitent l'authentification et validation
    router.get('/', authMiddleware, (req, res) => socialLinkController.getAll(req, res));
    router.get('/:id', authMiddleware, validateId, (req, res) => socialLinkController.getById(req, res));
    router.post('/', authMiddleware, validateSocialLink, (req, res) => socialLinkController.create(req, res));
    router.put('/:id', authMiddleware, validateId, validateSocialLink, (req, res) => socialLinkController.update(req, res));
    router.delete('/:id', authMiddleware, validateId, (req, res) => socialLinkController.delete(req, res));

    return router;
}

module.exports = createSocialLinkRoutes;
