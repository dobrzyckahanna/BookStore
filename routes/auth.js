const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('login', {
    errors: ["Test error message 1", "Test error message 2"]
  });
})

module.exports = router;