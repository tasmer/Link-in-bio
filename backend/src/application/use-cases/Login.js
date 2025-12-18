const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class Login {
    constructor(authRepository) {
        this.authRepository = authRepository;
    }

    async execute(username, password) {
        if (!username || !password) {
            throw new Error('Username et password requis');
        }

        const user = await this.authRepository.findByUsername(username);

        if (!user) {
            // Message générique pour éviter l'énumération des utilisateurs
            throw new Error('Identifiants incorrects');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            // Message générique pour éviter l'énumération des utilisateurs
            throw new Error('Identifiants incorrects');
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return {
            token,
            user: user.toJSON()
        };
    }
}

module.exports = Login;
