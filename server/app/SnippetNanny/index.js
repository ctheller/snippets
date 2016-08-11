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

  // create reusable transporter object using the default SMTP transport
  var transporter = nodemailer.createTransport(poolConfig);

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Snippet Nanny 👵" <snippettool@gmail.com>',
      to: 'grod220@gmail.com', // list of receivers --- TRUE USEREMAIL
      subject: '✂ Snippet & ship it ✂',
      html: '<p>Hey ho team,</p><p>Do some great stuff this week? <b>Submit your snippets</b> by the end of the day! The world wants to see...</p><img src="https://media.giphy.com/media/zfCCnYiOyihos/giphy.gif">'
  };
  // send mail with defined transport object
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



}


// Pull all organizations from DB

// Loop through each collecting ID + Due Dates
    // create CronJobs for each Org based on date

// https://www.npmjs.com/package/cron
new CronJob({
  cronTime: '*/5 * * * * *', // 00 00 12 * * 3 = every Wednesday @ 12pm // pull actual due date
  onTick: initialReminder,
  start: true,
  timeZone: 'America/New_York'
});

new CronJob({
  cronTime: '* * * * * 3', // pull actual due date + 5 hours
  onTick: finalCall,
  start: true,
  timeZone: 'America/New_York'
});




