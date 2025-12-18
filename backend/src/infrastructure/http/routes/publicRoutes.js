const express = require('express');
const { validateUsername } = require('../middlewares/validators');
const { publicLimiter } = require('../middlewares/rateLimiter');

function createPublicRoutes(profileController, linkController, socialLinkController) {
    const router = express.Router();

    // Public profile by username avec rate limiting et validation
    router.get('/:username', publicLimiter, validateUsername, async (req, res) => {
        try {
            const { username } = req.params;
            
            // Get profile
            const profile = await profileController.getProfileByUsername.execute(username);
            
            if (!profile) {
                return res.status(404).json({ error: 'Profil non trouvé' });
            }

            // Get links for this user
            const links = await linkController.getAllLinks.execute(profile.userId);
            
            // Get social links for this user
            const socialLinks = await socialLinkController.getAllSocialLinks.execute(profile.userId);

            res.json({
                profile,
                links,
                socialLinks: socialLinks.filter(link => link.isVisible)
            });
        } catch (error) {
            if (error.message === 'Profil non trouvé') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    });

    return router;
}

module.exports = createPublicRoutes;
