/**
 * Interface du repository SocialLink
 * Définit le contrat que doit respecter l'implémentation concrète
 */
class ISocialLinkRepository {
    async findAllByUserId(userId) {
        throw new Error('Method findAllByUserId() must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    async create(socialLink) {
        throw new Error('Method create() must be implemented');
    }

    async update(id, socialLink) {
        throw new Error('Method update() must be implemented');
    }

    async delete(id) {
        throw new Error('Method delete() must be implemented');
    }

    async updatePosition(id, position) {
        throw new Error('Method updatePosition() must be implemented');
    }
}

module.exports = ISocialLinkRepository;
