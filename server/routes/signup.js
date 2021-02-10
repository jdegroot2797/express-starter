const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();

router.post(
  '/',
  // Form validation
  [
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 6, max: 72 })
      .withMessage('Please enter a valid password between 6-72 characters'),
  ],
  //TODO: create generic error message handling middleware for valid requests
  async (req, res, next) => {
    // get the email and password from body
    const { email, password } = req.body;

    // check if the user already exists
    //const existingUser = await User.findOne({ email });

    // handle existing user
    // if (existingUser) {
    //   res.status(400).send('Email already in use');
    // }

    // creation of the users
    //const user = User.create({ email, password });
    //await user.save();

    // generate a JWT token for authentication
    // const userJWT = jwt.sign(
    //   {
    //     id: user.id,
    //     email: user.email,
    //   },
    //   process.env.JWT_KEY
    // );

    // // store JWT token in the session
    // req.session = {
    //   jwt: userJWT,
    // };

    // send back a response
    res.status(201).send({ response: req.body });
  }
);

module.exports = router;
