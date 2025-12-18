class GetAllUsers {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(requestingUserId, requestingUserRole) {
        if (requestingUserRole !== 'admin') {
            throw new Error('Unauthorized: Only admins can list all users');
        }

        const users = await this.userRepository.findAll();

        return users.map(user => user.toJSON());
    }
}