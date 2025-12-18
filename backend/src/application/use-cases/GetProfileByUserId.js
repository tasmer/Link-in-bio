class GetProfileByUserId {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(userId) {
        if (!userId) {
            throw new Error('User ID est requis');
        }

        const profile = await this.profileRepository.findByUserId(userId);

        if (!profile) {
            return null;
        }

        return profile.toJSON();
    }
}

module.exports = GetProfileByUserId;
