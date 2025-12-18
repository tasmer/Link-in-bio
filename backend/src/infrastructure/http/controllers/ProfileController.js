class ProfileController {
    constructor(getProfileByUserId, getProfileByUsername, createProfile, updateProfile, deleteProfile) {
        this.getProfileByUserId = getProfileByUserId;
        this.getProfileByUsername = getProfileByUsername;
        this.createProfile = createProfile;
        this.updateProfile = updateProfile;
        this.deleteProfile = deleteProfile;
    }

    async getCurrent(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.getProfileByUserId.execute(userId);

            if (!profile) {
                return res.status(404).json({ error: 'Profil non trouvé' });
            }

            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async getById(req, res) {
        try {
            const profileUserId = parseInt(req.params.id);

            if (req.user.role !== 'admin' && req.user.id !== profileUserId) {
                return res.status(403).json({ error: 'Accès interdit' });
            }

            const profile = await this.getProfileByUserId.execute(profileUserId);

            if (!profile) {
                return res.status(404).json({ error: 'Profil non trouvé' });
            }

            res.json(profile);
        } catch (error) {
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async getByUsername(req, res) {
        try {
            const { username } = req.params;
            const profile = await this.getProfileByUsername.execute(username);

            res.json(profile);
        } catch (error) {
            if (error.message === 'Profil non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async create(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.createProfile.execute(userId, req.body);

            res.status(201).json({ message: 'Profil créé', data: profile });
        } catch (error) {
            if (error.message.includes('obligatoire') || error.message.includes('existe déjà')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async update(req, res) {
        try {
            const userId = req.user.id;
            const profile = await this.updateProfile.execute(userId, req.body);

            res.json({ message: 'Profil mis à jour', data: profile });
        } catch (error) {
            if (error.message.includes('obligatoire') || error.message.includes('format')) {
                return res.status(400).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }

    async delete(req, res) {
        try {
            const profileId = parseInt(req.params.id);
            await this.deleteProfile.execute(profileId, req.user.id, req.user.role);

            res.json({ message: 'Profil supprimé' });
        } catch (error) {
            if (error.message === 'Profil non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            if (error.message === 'Accès interdit') {
                return res.status(403).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = ProfileController;
