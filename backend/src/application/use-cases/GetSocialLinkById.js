class GetSocialLinkById {
    constructor(socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    async execute(id) {
        if (!id) {
            throw new Error('ID est requis');
        }

        const socialLink = await this.socialLinkRepository.findById(id);

        if (!socialLink) {
            throw new Error('Lien social non trouvé');
        }

        return socialLink.toJSON();
    }
}

module.exports = GetSocialLinkById;
