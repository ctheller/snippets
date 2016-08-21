var firebase = require('firebase');
let creds = require('../../credentials/creds.json');
firebase.initializeApp({
  serviceAccount: creds.serviceAccount,
  databaseURL: "https://snippets-2f32c.firebaseio.com",
  databaseAuthVariableOverride: {
    uid: "snipyt-is-awesome"
  }
});
let db = firebase.database();
let ref = firebase.app().database();

module.exports = {db: db, ref: ref};
