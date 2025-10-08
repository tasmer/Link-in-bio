const express = require('express');

function createLinkRoutes(linkController) {
  const router = express.Router();

  router.get('/', (req, res) => linkController.getAll(req, res));
  router.post('/', (req, res) => linkController.create(req, res));
  router.put('/:id', (req, res) => linkController.update(req, res));
  router.delete('/:id', (req, res) => linkController.delete(req, res));

  return router;
}

module.exports = createLinkRoutes;