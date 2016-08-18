firebase.initializeApp({
  serviceAccount: creds.serviceAccount,
  databaseURL: "https://snippets-2f32c.firebaseio.com",
});
let db = firebase.database();
module.exports = db;
