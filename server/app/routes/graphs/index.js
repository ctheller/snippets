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

    let wordCloudData = {};

    for (let filt in filtered) {
      let textArr = filtered[filt].contents.split(' ').concat(filtered[filt].subject.split(' '));
      for (let i=0; i<textArr.length; i++) {
        if (!wordCloudData[textArr[i]]) {
          wordCloudData[textArr[i]] = 1;
        } else {
          wordCloudData[textArr[i]]++;
        }
      }
    }
    let toReturn = [];
    let blacklist = ['of', 'and','a', 'with', 'in', 'the', 'The', '&', 'from', 'that', 'this', 'This', 'by', 'Our', 'our', 'for', 'to'];
    for (let word in wordCloudData) {
      if (blacklist.indexOf(word) === -1) {
        toReturn.push([word, wordCloudData[word]]);
      }
    }

    res.json(toReturn);
  })
  .catch(function(error) {
    console.log(error);
  });
});
