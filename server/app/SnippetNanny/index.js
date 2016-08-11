'use strict'

var snippetNanny = {};

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
  var transporter = nodemailer.createTransport(snippetNanny.poolConfig);

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: '"Fred Foo 👥" <foo@blurdybloop.com>', // sender address
      to: 'grod220@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      text: 'Hello world 🐴', // plaintext body
      html: '<b>Hello world 🐴</b>' // html body
  };



  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          return console.log(error);
      }
      res.send('Message sent: ' + info.response);
  });

module.exports = snippetNanny;
