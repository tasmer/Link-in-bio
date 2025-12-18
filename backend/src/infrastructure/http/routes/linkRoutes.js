const express = require('express');
const { validateLink, validateId } = require('../middlewares/validators');
const authMiddleware = require('../middlewares/authMiddleware');

function createLinkRoutes(linkController) {
  const router = express.Router();

  // Toutes les routes nécessitent l'authentification
  router.get('/', authMiddleware, (req, res) => linkController.getAll(req, res));
  router.post('/', authMiddleware, validateLink, (req, res) => linkController.create(req, res));
  router.put('/:id', authMiddleware, validateId, validateLink, (req, res) => linkController.update(req, res));
  router.delete('/:id', authMiddleware, validateId, (req, res) => linkController.delete(req, res));

  return router;
}

module.exports = createLinkRoutes;