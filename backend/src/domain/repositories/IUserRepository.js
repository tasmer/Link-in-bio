
/**
 * Interface du repository Link
 * Définit le contrat que doit respecter l'implémentation concrète
 */
class IUserRepository  {
    async findAll() {
        throw new Error('Method findAll() must be implemented');
    }

    async findById(id) {
        throw new Error('Method findById() must be implemented');
    }

    async findByUsername(username) {
        throw new Error('Method findByUsername() must be implemented');
    }

    async findByEmail(email) {
        throw new Error('Method findByEmail() must be implemented');
    }

    async create(user) {
        throw new Error('Methode create() must be implemented');
    }

    async update(id,user) {
        throw new Error('Methode update() must be implemented');
    }

    async delete(id) {
        throw new Error('Methode delete() must be implemented');
    }
}

module.exports = IUserRepository;