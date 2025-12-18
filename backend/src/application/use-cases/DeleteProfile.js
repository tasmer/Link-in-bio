class DeleteProfile {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(profileId, requestingUserId, requestingUserRole) {
        const profile = await this.profileRepository.findByUserId(profileId);

        if (!profile) {
            throw new Error('Profil non trouvé');
        }

        if (requestingUserRole !== 'admin' && requestingUserId !== profile.userId) {
            throw new Error('Accès interdit');
        }

        const deleted = await this.profileRepository.delete(profile.id);

        if (!deleted) {
            throw new Error('Échec de la suppression du profil');
        }

        return true;
    }
}

module.exports = DeleteProfile;
