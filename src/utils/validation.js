const { body, validationResult } = require('express-validator');

// --------- handle validation errors
exports.handleValidationErr = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};


//-------- Sign-up Validation
exports.validateCreateUser = [
  body('firstName')
    .notEmpty()
    .withMessage('First name is required for registration.'),

  body('lastName')
    .notEmpty()
    .withMessage('Last name is required for registration.'),

  body('email')
    .notEmpty()
    .withMessage('Email is required for registration.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),

  body('password')
    .isStrongPassword({
      minLength: 8,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    })
    .withMessage('Password must be at least 8 characters long, include an uppercase letter, a number, and a special character.'),

    body('birthday')
    .notEmpty()
    .withMessage('Birthday is required.')
    .isISO8601()
    .withMessage('Please enter a valid date in YYYY-MM-DD format.') 
];


//--------- Login Validation
exports.validateLoginUser = [
  body('email')
    .notEmpty()
    .withMessage('Email is required for login user.')
    .isEmail()
    .withMessage('Please enter a valid email address.')
    .normalizeEmail(),


  body('password')
    .notEmpty()
    .withMessage('Password is required to login.')
];
