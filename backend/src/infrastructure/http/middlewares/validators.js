const { body, param, validationResult } = require('express-validator');

// Middleware pour vérifier les erreurs de validation
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Données invalides',
            details: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// Validation pour le login
const validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Le username est requis')
        .isLength({ min: 3, max: 50 }).withMessage('Le username doit contenir entre 3 et 50 caractères')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le username ne peut contenir que des lettres, chiffres, _ et -'),
    body('password')
        .notEmpty().withMessage('Le mot de passe est requis')
        .isLength({ min: 6 }).withMessage('Le mot de passe doit contenir au moins 6 caractères'),
    validate
];

// Validation pour créer/modifier un profil
const validateProfile = [
    body('title')
        .trim()
        .notEmpty().withMessage('Le titre est requis')
        .isLength({ max: 255 }).withMessage('Le titre ne peut pas dépasser 255 caractères'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 1000 }).withMessage('La bio ne peut pas dépasser 1000 caractères'),
    body('avatarUrl')
        .optional()
        .trim()
        .isURL().withMessage('L\'URL de l\'avatar doit être valide'),
    body('backgroundColor')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('La couleur de fond doit être au format hexadécimal (#RRGGBB)'),
    body('textColor')
        .optional()
        .matches(/^#[0-9A-F]{6}$/i).withMessage('La couleur du texte doit être au format hexadécimal (#RRGGBB)'),
    body('metaTitle')
        .optional()
        .trim()
        .isLength({ max: 255 }).withMessage('Le meta titre ne peut pas dépasser 255 caractères'),
    body('metaDescription')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('La meta description ne peut pas dépasser 500 caractères'),
    validate
];

// Validation pour créer/modifier un lien
const validateLink = [
    body('label')
        .trim()
        .notEmpty().withMessage('Le label est requis')
        .isLength({ max: 255 }).withMessage('Le label ne peut pas dépasser 255 caractères'),
    body('url')
        .trim()
        .notEmpty().withMessage('L\'URL est requise')
        .isURL().withMessage('L\'URL doit être valide'),
    body('icon')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('L\'icône ne peut pas dépasser 100 caractères'),
    validate
];

// Validation pour créer/modifier un lien social
const validateSocialLink = [
    body('platform')
        .trim()
        .notEmpty().withMessage('La plateforme est requise')
        .isIn(['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'youtube', 'tiktok', 'discord', 'twitch'])
        .withMessage('Plateforme non supportée'),
    body('url')
        .trim()
        .notEmpty().withMessage('L\'URL est requise')
        .isURL().withMessage('L\'URL doit être valide'),
    body('isVisible')
        .optional()
        .isBoolean().withMessage('isVisible doit être un booléen'),
    body('position')
        .optional()
        .isInt({ min: 0 }).withMessage('La position doit être un entier positif'),
    validate
];

// Validation pour les paramètres ID
const validateId = [
    param('id')
        .isInt({ min: 1 }).withMessage('L\'ID doit être un entier positif'),
    validate
];

// Validation pour le username dans l'URL
const validateUsername = [
    param('username')
        .trim()
        .notEmpty().withMessage('Le username est requis')
        .isLength({ min: 3, max: 50 }).withMessage('Le username doit contenir entre 3 et 50 caractères')
        .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Le username ne peut contenir que des lettres, chiffres, _ et -'),
    validate
];

module.exports = {
    validateLogin,
    validateProfile,
    validateLink,
    validateSocialLink,
    validateId,
    validateUsername
};
