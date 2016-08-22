'use strict';
var router = require('express').Router();
module.exports = router;
var Firebase = require('firebase')

let firebase = require("firebase");
let ref = Firebase.database().ref("snippets");

router.post('/', function(req,res,next) {
  var curr = new Date; // get current date
  var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
  var last = first + 6; // last day is the first day + 6
  var firstday = new Date(curr.setDate(first)).getTime();
  var lastday = new Date(curr.setDate(last)).getTime();

  ref.once("value")
  .then(function(snapshot){
    let filtered = {};
    let allSnips = snapshot.val();
    for (let snippet in allSnips) {
      if (allSnips[snippet].organization === req.body.orgOfUser
          && allSnips[snippet].dateAdded > firstday
          && allSnips[snippet].dateAdded < lastday) {
        filtered[snippet]= allSnips[snippet];
      }
    }

    for (let filt in filtered) {
      filtered[filt]
    }


    res.json(filtered);
  })
  .catch(function(error) {
    console.log(error);
  });
});
