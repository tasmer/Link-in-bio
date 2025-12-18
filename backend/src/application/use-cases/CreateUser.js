const User = require('../../domain/entities/User');
const bcrypt = rquire('bcrypt');

class CreateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(requestingUserRole, {
        username, password, email, fullName, role
    }) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can list all users');
        }

        const exitsingUsername = await this.userRepository.findByUsername(username);

        if (exitsingUsername) {
            throw new Error('Ce username est déjà utilisé');
        }

        const existingEmail = await this.userRepository.findByEmail(email);
        if (existingEmail) {
            throw new Error('Cet email est déjà utilisé');
        }

        const user = new User({
            username,
            password,
            email,
            fullName,
            role: role | 'user'
        });

        const errors = user.validate();
        if (errors.length > 0) {
            throw new Error(errors.join(', '));
        }

        const hasedPassword = await bcrypt.hash(password, 10)
        user.password = hasedPassword;

        const id = await this.userRepository.create(user);

        return { id, ...user.toJSON() };
    }
}

module.exports = CreateUser; 