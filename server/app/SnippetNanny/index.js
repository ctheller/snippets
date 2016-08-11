'use strict'
var CronJob = require('cron').CronJob;
var creds = require('../../../credentials/creds.json');
var nodemailer = require('nodemailer');


function initialReminder (orgId) {
// Grab all users who have not submitted any snippets
// check to see what their notification preferences are

// for.Each(user)
  // IF EMAIL -------------
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
      to: 'grod220@gmail.com', // list of receivers --- TRUE USEREMAIL
      subject: '✂ Snippet & ship it ✂',
      html: '<p>Hey ho team,</p><p>Do some great stuff this week? <b>Submit your snippets</b> by the end of the day! The world wants to see...</p><img src="https://media.giphy.com/media/zfCCnYiOyihos/giphy.gif">'
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });


  // IF SLACK ---------






// to include in message
// send email/slack message of teammates who have already submitted

}

function finalCall (orgId) {
  // Grab all users who have not submitted any snippets
  // check to see what their notification preferences are

  // for.Each(user)
    // IF EMAIL -------------
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
      to: 'grod220@gmail.com', // list of receivers --- TRUE USEREMAIL
      subject: 'T-minus 60mins to Snippet... ✂',
      html: '<p>Anything? anything!? Time is running out to submit your weeklies.</p><img src="https://media.giphy.com/media/qq7ef70oHLoAM/giphy.gif" height="150" width="150">,'
  };
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);
  });


}


// Pull all organizations from DB

// Loop through each collecting ID + Due Dates
    // create CronJobs for each Org based on date

// https://www.npmjs.com/package/cron
new CronJob({
  cronTime: '00 00 12 * * 3', // 00 00 12 * * 3 = every Wednesday @ 12pm // pull actual due date
  onTick: initialReminder,
  start: true,
  timeZone: 'America/New_York'
});

new CronJob({
  cronTime: '00 00 17 * * 3', // pull actual due date + 5 hours
  onTick: finalCall,
  start: true,
  timeZone: 'America/New_York'
});




