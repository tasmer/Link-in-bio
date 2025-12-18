/**
 * Interface du repository Profile
 * Définit le contrat que doit respecter l'implémentation concrète
 */
class IProfileRepository {
    async findByUserId(userId) {
        throw new Error('Method findByUserId() must be implemented');
    }

    async findByUsername(username) {
        throw new Error('Method findByUsername() must be implemented');
    }

    async create(profile) {
        throw new Error('Method create() must be implemented');
    }

    async update(userId, profile) {
        throw new Error('Method update() must be implemented');
    }

    async delete(id) {
        throw new Error('Method delete() must be implemented');
    }
}

module.exports = IProfileRepository;
