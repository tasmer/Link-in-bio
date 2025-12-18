const Profile = require('../../domain/entities/Profile');

class UpdateProfile {
    constructor(profileRepository) {
        this.profileRepository = profileRepository;
    }

    async execute(userId, data) {
        const existingProfile = await this.profileRepository.findByUserId(userId);

        const profile = new Profile({
            id: existingProfile?.id,
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

        if (!existingProfile) {
            const id = await this.profileRepository.create(profile);
            return { id, ...profile.toJSON() };
        }

        const updated = await this.profileRepository.update(userId, profile);

        if (!updated) {
            throw new Error('Échec de la mise à jour du profil');
        }

        return profile.toJSON();
    }
}

module.exports = UpdateProfile;
