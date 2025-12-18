class GetAllSocialLinks {
    constructor(socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    async execute(userId) {
        if (!userId) {
            throw new Error('User ID est requis');
        }

        const socialLinks = await this.socialLinkRepository.findAllByUserId(userId);

        return socialLinks.map(link => link.toJSON());
    }
}

module.exports = GetAllSocialLinks;
