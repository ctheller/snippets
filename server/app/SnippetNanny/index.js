'use strict'
var CronJob = require('cron').CronJob;
var creds = require('../../../credentials/creds.json');
var nodemailer = require('nodemailer');
var firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: creds.serviceAccount,
  databaseURL: "https://snippets-2f32c.firebaseio.com",
});
var db = firebase.database();

function composeEmail (emailArr, subj, htmlBody) {
  var poolConfig = {
      pool: true,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: creds.snippetGmail.email,
          pass: creds.snippetGmail.password
      }
  };
  var transporter = nodemailer.createTransport(poolConfig);
  var mailOptions = {
      from: '"Snippet Nanny 👵" <snippettool@gmail.com>',
      to: emailArr.join(','), // list of receivers
      subject: subj,
      html: htmlBody
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });
// to include in message
// send email/slack message of teammates who have already submitted
}

var initialSubj = '✂ Snippet & ship it ✂';
var initialBody = '<p>Hey ho team,</p><p>Do some great stuff this week? <b>Submit your snippets</b> by the end of the day! The world wants to see...</p><img src="https://media.giphy.com/media/zfCCnYiOyihos/giphy.gif">';

var finalCallSubj = 'T-minus 60mins to Snippet... ✂';
var finalCallBody = '<p>Anything? anything!? Time is running out to submit your weeklies.</p><img src="https://media.giphy.com/media/qq7ef70oHLoAM/giphy.gif" height="150" width="150">,';

function onCronKick(orgId, iteration) {

}


var ref = db.ref("organizations"); /// specify "users" as a parameter to get users table, etc.

// Pull all organizations from DB
ref.once("value")
.then(function(snapshot) {
  // Loop through each collecting ID + Due Dates
  var dataObj = snapshot.val();
  for (var key in dataObj) {
    // create cronJob and pass orgID
    new CronJob({
      cronTime: '00 00 12 * * 3', // 00 00 12 * * 3 = every Wednesday @ 12pm // pull actual due date
      onTick: initialReminder, // should pass org ID
      start: true,
      timeZone: 'America/New_York'
    });



    console.log(dataObj[key]);
  }
  // create CronJobs for each Org based on date
})
.catch(function(err) {
  console.log("The read failed: " + errorObject.code);
});



// // https://www.npmjs.com/package/cron
// new CronJob({
//   cronTime: '00 00 12 * * 3', // 00 00 12 * * 3 = every Wednesday @ 12pm // pull actual due date
//   onTick: initialReminder, // should pass org ID
//   start: true,
//   timeZone: 'America/New_York'
// });

// new CronJob({
//   cronTime: '00 00 17 * * 3', // pull actual due date + 5 hours
//   onTick: finalCall, // should pass org ID
//   start: true,
//   timeZone: 'America/New_York'
// });




