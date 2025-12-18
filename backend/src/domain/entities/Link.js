class Link {
    constructor({ id, userId, label, url, icon, createdAt, updtatedAt }) {
        this.id = id;
        this.userId = userId;
        this.label = label;
        this.url = url;
        this.icon = icon;
        this.createdAt = createdAt;
        this.updtatedAt = updtatedAt;
    }

    validate() {
        const errors = [];

        if (!this.label || this.label.trim().length === 0) {
            errors.push('Le label est obligatoire');
        }

        if (!this.url || this.url.trim().length === 0) {
            errors.push('L\'URL est obligatoire');
        }

        if (this.url && !this.isValidUrl(this.url)) {
            errors.push('L\'URL n\'est pas valide');
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
            label: this.label,
            url: this.url,
            icon: this.icon,
            createdAt: this.createdAt,
            updatedAt: this.updtatedAt
        };
    }
}

module.exports = Link;