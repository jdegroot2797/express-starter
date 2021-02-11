const express = require('express');
const currentUser = require('../middleware/current-user');

const router = express.Router();

router.get('/', currentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
  console.log('ooga booga');
});

module.exports = router;
