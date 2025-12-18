class DeleteSocialLink {
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

        const deleted = await this.socialLinkRepository.delete(id);

        if (!deleted) {
            throw new Error('Échec de la suppression du lien social');
        }

        return true;
    }
}

module.exports = DeleteSocialLink;
