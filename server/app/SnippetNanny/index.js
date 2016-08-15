'use strict'
let CronJob = require('cron').CronJob;
let creds = require('../../../credentials/creds.json');
let nodemailer = require('nodemailer');
let firebase = require("firebase");

firebase.initializeApp({
  serviceAccount: creds.serviceAccount,
  databaseURL: "https://snippets-2f32c.firebaseio.com",
});
let db = firebase.database();
let ref = db.ref("organizations"); /// specify "users" as a parameter to get users table, etc.
let refUsers = db.ref("users");


function composeEmail (emailArr, subj, htmlBody) {
  let poolConfig = {
      pool: true,
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // use SSL
      auth: {
          user: creds.snippetGmail.email,
          pass: creds.snippetGmail.password
      }
  };
  let transporter = nodemailer.createTransport(poolConfig);
  let mailOptions = {
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

let initialSubj = '✂ Snippet & ship it ✂';
let initialBody = '<p>Hey ho team,</p><p>Do some great stuff this week? <b>Submit your snippets</b> by the end of the day! The world wants to see...</p><img src="https://media.giphy.com/media/zfCCnYiOyihos/giphy.gif">';

let finalCallSubj = 'T-minus 60mins to Snippet... ✂';
let finalCallBody = '<p>Anything? anything!? Time is running out to submit your weeklies.</p><img src="https://media.giphy.com/media/qq7ef70oHLoAM/giphy.gif" height="150" width="150">,';


function onCronKick(orgId, emailOrder) {
  let emails = [];
  let subjToSend;
  let bodyToSend;
  let orgData;

  if (emailOrder === 1) {
    subjToSend = initialSubj;
    bodyToSend = initialBody;
  } else {
    subjToSend = finalCallSubj;
    bodyToSend = finalCallBody;
  }
  // get userList by OrgID
  ref.child(orgId).once("value")
  .then(function(snapshot) {
    return snapshot.val();
  })
  .then(function(result) {
    orgData = result
    return refUsers.once("value");
  })
  .then(function(snapshotUsers) {
    return snapshotUsers.val();
  })
  .then(function(allUserData) {
    for (let user in orgData.users) {
  // push to emails array
      emails.push(allUserData[user].email);
    }
    return;
  })
  .then(function() {
    console.log(emails,subjToSend)
    // composeEmail(emails, subjToSend, bodyToSend);
  });
  // check if those users have submitted a snippet ?????

}



// Pull all organizations from DB
ref.once("value")
.then(function(snapshot) {
  // Loop through each collecting ID + Due Dates
  let dataObj = snapshot.val();
  for (let key in dataObj) {
    // create cronJob and pass orgID
    let cronDay = dataObj[key].dueDay.day;
    let earlyTime = dataObj[key].dueDay.time - 700;
    let cronEarlyTime = earlyTime.toString().slice(2,4) + " " + earlyTime.toString().slice(0,2);
    // initial email reminder
       // https://www.npmjs.com/package/cron

    new CronJob({
      cronTime: `*/5 * * * * *`,
      // cronTime: `* ${cronEarlyTime} * * ${cronDay}`, // 00 00 12 * * 3 = every Wednesday @ 12pm
      onTick: function() {
        onCronKick(key, 1); // should pass org ID
      },
      start: true,
      timeZone: 'America/New_York'
    });

    let laterTime = dataObj[key].dueDay.time - 100;
    let cronLaterTime = laterTime.toString().slice(2,4) + " " + laterTime.toString().slice(0,2);

    // last call email reminder
    new CronJob({
      cronTime: `*/11 * * * * *`,
      // cronTime: `* ${cronLaterTime} * * ${cronDay}`,
      onTick: function() {
        onCronKick(key, 2);
      },
      start: true,
      timeZone: 'America/New_York'
    });
  }
})
.catch(function(err) {
  console.log("The read failed: " + err);
});
