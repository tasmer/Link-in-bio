class GetProfileByUsername {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(username) {
        if (!username) {
            throw new Error('Username est requis');
        }

        const profile = await this.profileRepository.findByUsername(username);

        if (!profile) {
            throw new Error('Profil non trouvé');
        }

        return profile.toJSON();
    }
}

module.exports = GetProfileByUsername;
