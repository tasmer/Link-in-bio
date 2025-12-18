class AuthController {
    constructor(loginUseCase) {
        this.loginUseCase = loginUseCase;
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const result = await this.loginUseCase.execute(username, password);

            res.json({
                message: 'Connexion réussie',
                token: result.token,
                user: result.user
            });
        } catch (error) {
            if (error.message.includes('requis') || error.message.includes('non trouvé') || error.message.includes('incorrect')) {
                return res.status(401).json({ error: error.message });
            }
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}

module.exports = AuthController;
