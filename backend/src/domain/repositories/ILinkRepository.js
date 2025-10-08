
/**
 * Interface du repository Link
 * Définit le contrat que doit respecter l'implémentation concrète
 */
class ILinkRepository  {
    async findAll(userId) {
        throw new Error('Method findAll() must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    async create(link) {
        throw new Error('Methode create() must be implemented');
    }

    async update(id,link) {
        throw new Error('Methode update() must be implemented');
    }

    async delete(id) {
        throw new Error('Methode delete() must be implemented');
    }
}

module.exports = ILinkRepository;