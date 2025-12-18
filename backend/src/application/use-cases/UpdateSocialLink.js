const SocialLink = require('../../domain/entities/SocialLink');

class UpdateSocialLink {
    constructor(socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    async execute(id, data) {
        const existing = await this.socialLinkRepository.findById(id);

        if (!existing) {
            throw new Error('Lien social non trouvé');
        }

        const socialLink = new SocialLink({
            id: existing.id,
            userId: existing.userId,
            platform: data.platform || existing.platform,
            url: data.url || existing.url,
            isVisible: data.isVisible !== undefined ? data.isVisible : existing.isVisible,
            position: data.position !== undefined ? data.position : existing.position
        });

        const errors = socialLink.validate();
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const updated = await this.socialLinkRepository.update(id, socialLink);

        if (!updated) {
            throw new Error('Échec de la mise à jour du lien social');
        }

        return socialLink.toJSON();
    }
}

module.exports = UpdateSocialLink;
