class LinkController {
  constructor(getAllLinks, createLink, updateLink, deleteLink) {
    this.getAllLinks = getAllLinks;
    this.createLink = createLink;
    this.updateLink = updateLink;
    this.deleteLink = deleteLink;
  }

  async getAll(req, res) {
    try {
      // TODO: retrieve userId from req.user (after auth)
      const userId = 1; // Temporary
      const links = await this.getAllLinks.execute(userId);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async create(req, res) {
    try {
      const userId = 1; // Temporary
      const { label, url, icon } = req.body;
      
      const link = await this.createLink.execute(userId, { label, url, icon });
      res.status(201).json({ message: 'Lien ajouté', data: link });
    } catch (error) {
      if (error.message.includes('obligatoire') || error.message.includes('valide')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { label, url, icon } = req.body;
      
      const link = await this.updateLink.execute(id, { label, url, icon });
      res.json({ message: 'Lien mis à jour', data: link });
    } catch (error) {
      if (error.message === 'Link not found') {
        return res.status(404).json({ error: 'Lien non trouvé' });
      }
      if (error.message.includes('obligatoire') || error.message.includes('valide')) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      await this.deleteLink.execute(id);
      res.json({ message: 'Lien supprimé' });
    } catch (error) {
      if (error.message === 'Link not found') {
        return res.status(404).json({ error: 'Lien non trouvé' });
      }
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = LinkController;