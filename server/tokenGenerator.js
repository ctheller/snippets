var firebase = require('firebase')
var db = require('./db')
var uid = "snippet-server";
var additionalClaims = {
  premiumAccount: true
};
var token = firebase.auth().createCustomToken(uid, additionalClaims);
module.exports = token;
