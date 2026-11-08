const { body } = require('express-validator');

const registrationRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be between 2 and 80 characters.'),
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password')
    .isLength({ min: 8, max: 128 }).withMessage('Password must be between 8 and 128 characters.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[0-9]/).withMessage('Password must contain a number.')
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isString().notEmpty().withMessage('Password is required.')
];

module.exports = { registrationRules, loginRules };
