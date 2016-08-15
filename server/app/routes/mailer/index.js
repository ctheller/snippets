'use strict';
var router = require('express').Router();
var nodemailer = require('nodemailer');
var creds = require('../../../../credentials/creds.json');
module.exports = router;
let compose = require('../../SnippetNanny');


router.post('/', function(req,res,next) {
  compose.composeEmail(req.body, 'testsubj', 'testBody');
  res.end();
});
