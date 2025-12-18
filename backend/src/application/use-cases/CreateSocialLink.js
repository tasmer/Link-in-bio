const SocialLink = require('../../domain/entities/SocialLink');

class CreateSocialLink {
    constructor(socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    async execute(userId, data) {
        const socialLink = new SocialLink({
            userId,
            platform: data.platform,
            url: data.url,
            isVisible: data.isVisible,
            position: data.position
        });

        const errors = socialLink.validate();
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const id = await this.socialLinkRepository.create(socialLink);

        return { id, ...socialLink.toJSON() };
    }
}

module.exports = CreateSocialLink;
