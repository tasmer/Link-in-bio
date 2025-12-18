const Profile = require('../../domain/entities/Profile');

class CreateProfile {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(userId, data) {
        const profile = new Profile({
            userId,
            title: data.title,
            bio: data.bio,
            avatarUrl: data.avatarUrl,
            backgroundColor: data.backgroundColor,
            textColor: data.textColor,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription
        });

        const errors = profile.validate();
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const existingProfile = await this.profileRepository.findByUserId(userId);
        if (existingProfile) {
            throw new Error('Un profil existe déjà pour cet utilisateur');
        }

        const id = await this.profileRepository.create(profile);

        return { id, ...profile.toJSON() };
    }
}

module.exports = CreateProfile;
