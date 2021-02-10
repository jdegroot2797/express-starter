const express = require('express');
const jwt = require('jsonwebtoken');

export const currentUser = (req, res, next) => {
  // check if there is a current user object
  if (!req.session.jwt) {
    // move onto the next middleware/chain of function calls
    return next();
  }

  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);
    //tell request object that the current user has a valid JWT token
    req.currentUser = payload;
  } catch (err) {
    return res.status(401).send();
  }

  // move onto the next middleware/chain of function calls
  next();
};
