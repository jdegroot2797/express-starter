const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const PasswordManager = require('../services/password-manager');

const router = express.Router();

router.post(
  '/',
  // Form validation
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('Password must be valid'),
  ],
  //TODO: add authentication middleware
  async (req, res, next) => {
    // get the email and password from body
    const { email, password } = req.body;

    // check if the user already exists
    const existingUser = await User.findOne({ email });

    // handle existing user
    if (existingUser) {
      //TODO: error handling
      console.log('invalid login credentials');
    }

    // verify the password against the stored hashed password
    const passwordsMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordsMatch) {
      //TODO: error handling
      console.log('password provided does not match DB records');
    }

    // generate a JWT token for authentication
    const userJWT = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY
    );

    // store JWT token in the session
    req.session = {
      jwt: userJWT,
    };

    // send back a response
    res.status(200).send(existingUser);
  }
);

module.exports = router;
