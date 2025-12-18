class User {
    constructor(id, username, password, email, fullName, role, created_at, updated_at) {
        this.id = id;
        this.username = username;
        this.password = password; // hash bcrypt 
        this.email = email;
        this.fullName = fullName;
        this.role = role || 'user'; // 'admin', 'user'
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    validate() {
        const errors = [];

        if (!this.username || this.username.trim().lenght < 3) {
            errors.push('Le username doit contenir au moins 3 caractères');
        }

        if (!this.email || !this.isValidEmail(this.email)) {
            errors.push('L\'email n\'est pas valide');
        }
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isAdmin() {
        return this.role === 'admin';
    }

    toJSON() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            fullName: this.fullName,
            role: this.role,
            created_at: this.created_at,
            updated_at: this.updated_at

        }
    }
}

module.exports = User;
