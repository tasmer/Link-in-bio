class DeleteUser {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(requestingUserId, requestingUserRole, id) {

        if (requestingUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can delete users');
        }
        const user = await this.userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }

        if (requestingUserId === id) {
            throw new Error('You cannot delete your own account');
        }

        const deleted = await this.userRepository.delete(id);
        return deleted;
    }
}