class SocialLinkController {
    constructor(getAllSocialLinks, getSocialLinkById, createSocialLink, updateSocialLink, deleteSocialLink) {
        this.getAllSocialLinks = getAllSocialLinks;
        this.getSocialLinkById = getSocialLinkById;
        this.createSocialLink = createSocialLink;
        this.updateSocialLink = updateSocialLink;
        this.deleteSocialLink = deleteSocialLink;
    }

    async getAll(req, res) {
        try {
            const userId = req.user.id;
            const socialLinks = await this.getAllSocialLinks.execute(userId);

            res.json(socialLinks);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async getById(req, res) {
        try {
            const { id } = req.params;
            const socialLink = await this.getSocialLinkById.execute(id);

            res.json(socialLink);
        } catch (error) {
            if (error.message === 'Lien social non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const socialLink = await this.createSocialLink.execute(userId, req.body);

            res.status(201).json({ message: 'Lien social créé', data: socialLink });
        } catch (error) {
            if (error.message.includes('obligatoire') || error.message.includes('valide') || error.message.includes('plateforme')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async update(req, res) {
        try {
            const { id } = req.params;
            const socialLink = await this.updateSocialLink.execute(id, req.body);

            res.json({ message: 'Lien social mis à jour', data: socialLink });
        } catch (error) {
            if (error.message === 'Lien social non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message.includes('obligatoire') || error.message.includes('valide')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            await this.deleteSocialLink.execute(id);

            res.json({ message: 'Lien social supprimé' });
        } catch (error) {
            if (error.message === 'Lien social non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = SocialLinkController;
