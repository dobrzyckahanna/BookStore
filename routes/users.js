const {
  User,
  validate
} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('registration', {
    errors: ["Test error message 1", "Test error message 2"]
  });
})

module.exports = router;