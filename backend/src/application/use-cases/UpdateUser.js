const User = require('../../domain/entities/User');
const bcrypt = require('bcrypt'); 

class UpdateUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(requestingUserId, requestingUserRole, id, {username, password, email, fullName, role}){
        // Check permission.
        if(requestingUserId !== id && requestingUserRole !=='admin') {
           throw new Error('Unauthorized: You can only update your own profile');
        }
        
        
        const existingUser = await this.userRepository.findById(id);
        if (!existingUser) {
            throw new Error('User not found');
        }

        if (username && username !== existingUser.username) {
            const usernameExists = await this.userRepository.findByUsername(username);
            if (usernameExists) {
                throw new Error('Ce username est déjà utilisé');
            }
        }

        if (email && email !== existingUser.email) {
            const emailExists = await this.userRepository.findByEmail(email);
            if (emailExists) {
                throw new Error('Cet email est déjà utilisé');
            }
        }

        const updatedUser = new User({
            ...existingUser,
            username: username ?? existingUser.username,
            password: password ?? existingUser.password,
            email: email ?? existingUser.email,
            fullName: fullName ?? existingUser.fullName,
            role: role ?? existingUser.role
        });


        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedUser.password = hashedPassword;
        }

        const errors = updatedUser.validate();
        if( errors.length > 0 ){
            throw new Error(errors.join(', '));
        }

        await this.userRepository.update(id, updatedUser);

        return updatedUser.toJSON();
    }
}