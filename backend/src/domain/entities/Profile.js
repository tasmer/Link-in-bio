class Profile {
    constructor({ id, userId, title, bio, avatarUrl, backgroundColor, textColor, metaTitle, metaDescription, createdAt, updatedAt }) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.backgroundColor = backgroundColor || '#FFFFFF';
        this.textColor = textColor || '#000000';
        this.metaTitle = metaTitle;
        this.metaDescription = metaDescription;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    validate() {
        const errors = [];

        if (!this.title || this.title.trim().length === 0) {
            errors.push('Le titre est obligatoire');
        }

        if (this.title && this.title.length > 255) {
            errors.push('Le titre ne peut pas dépasser 255 caractères');
        }

        if (this.backgroundColor && !this.isValidHexColor(this.backgroundColor)) {
            errors.push('La couleur de fond doit être au format hexadécimal (#RRGGBB)');
        }

        if (this.textColor && !this.isValidHexColor(this.textColor)) {
            errors.push('La couleur du texte doit être au format hexadécimal (#RRGGBB)');
        }

        return errors;
    }

    isValidHexColor(color) {
        return /^#[0-9A-F]{6}$/i.test(color);
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            title: this.title,
            bio: this.bio,
            avatarUrl: this.avatarUrl,
            backgroundColor: this.backgroundColor,
            textColor: this.textColor,
            metaTitle: this.metaTitle,
            metaDescription: this.metaDescription,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Profile;
