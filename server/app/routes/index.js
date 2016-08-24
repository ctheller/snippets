'use strict';
var router = require('express').Router();
module.exports = router;

router.use('/members', require('./members'));
router.use('/mailer', require('./mailer'));
router.use('/graphs', require('./graphs'));
router.use('/org', require('./org'));

// Make sure this is after all of
// the registered routes!
router.use(function (req, res) {
    res.status(404).end();
});
