class SocialLink {
    constructor({ id, userId, platform, url, isVisible, position, createdAt }) {
        this.id = id;
        this.userId = userId;
        this.platform = platform;
        this.url = url;
        this.isVisible = isVisible !== undefined ? isVisible : true;
        this.position = position || 0;
        this.createdAt = createdAt;
    }

    validate() {
        const errors = [];

        if (!this.platform || this.platform.trim().length === 0) {
            errors.push('La plateforme est obligatoire');
        }

        if (!this.url || this.url.trim().length === 0) {
            errors.push('L\'URL est obligatoire');
        }

        if (this.url && !this.isValidUrl(this.url)) {
            errors.push('L\'URL n\'est pas valide');
        }

        const validPlatforms = ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok', 'discord', 'twitch'];
        if (this.platform && !validPlatforms.includes(this.platform.toLowerCase())) {
            errors.push(`La plateforme doit être l'une des suivantes: ${validPlatforms.join(', ')}`);
        }

        return errors;
    }

    isValidUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    toJSON() {
        return {
            id: this.id,
            userId: this.userId,
            platform: this.platform,
            url: this.url,
            isVisible: this.isVisible,
            position: this.position,
            createdAt: this.createdAt
        };
    }
}

module.exports = SocialLink;
