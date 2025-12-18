/**
 * Interface du repository Auth
 * Définit le contrat que doit respecter l'implémentation concrète
 */
class IAuthRepository {
    async findByUsername(username) {
        throw new Error('Method findByUsername() must be implemented');
    }

    async findByEmail(email) {
        throw new Error('Method findByEmail() must be implemented');
    }
}

module.exports = IAuthRepository;
