let creds = require('../../../credentials/creds.json');
let firebase = require("firebase");
let Chance = require('chance');
let ref = firebase.database().ref("organizations");
let chance = new Chance();

// var orgs = {
//   'someOtherOne' : {
//     'dueDay' : {
//       'day' : 6,
//       'time' : 1300
//     },
//     'users' : {
//       '3' : true,
//       '4' : true
//     }
//   },
//   'monstersInc' : {
//     'dueDay' : {
//       'day' : 4,
//       'time' : 1700
//     },
//     'users' : {
//       'We8iLkQsY3OEeAYoSuOuLFsBjzu2' : true
//     }
//   }
// };


// ref.set(orgs)
// .then(function(result) {
//   console.log('success: ', result);
// });


function buildSeed () {
  var toReturn = {};

  // generate org chart
  toReturn.users = {};

  let managerCLevel = [];
  let managerTopLevel = [];
  let managerMidLevel = [];

  // create users
  for (let i=0; i<250; i++) {
    let username = chance.string({length: 10});
    toReturn.users[username] = {
      email: chance.email(),
      first_name: chance.first(),
      isAdmin: chance.bool({likelihood: 5}),
      last_name: chance.last(),
      photoUrl : `https://randomuser.me/api/portraits/${chance.pickone(['men', 'women'])}/${chance.integer({min: 0, max: 99})}.jpg`
    };

  // do managers after creating users
    if (i < 5) {
      managerCLevel.push(username);
    } else if (i < 25) {
      managerTopLevel.push(username);
      toReturn.users[username].manager = chance.pickone(managerCLevel);
    } else if (i < 75) {
      managerMidLevel.push(username);
      toReturn.users[username].manager = chance.pickone(managerTopLevel);
    } else {
      toReturn.users[username].manager = chance.pickone(managerMidLevel);
    }
  }

  // do team member after creating users
  for (let user1 in toReturn.users) {
    for (let user2 in toReturn.users) {
      if (user1 !== user2 && toReturn.users[user1].manager === toReturn.users[user2].manager) {
        if (toReturn.users[user1].asTeamMember) {
          toReturn.users[user1].asTeamMember[user2] = true;
        } else {
          toReturn.users[user1].asTeamMember = {};
          toReturn.users[user1].asTeamMember[user2] = true;
        }
      }
    }
  }
  // create snippets
  toReturn.snippets = {};
  for (let i=0; i<100; i++) {
    let snippetId = chance.string({length: 15});
  }

  // Associate snippets to users (and vice versa?)


  return toReturn;
}

console.log(buildSeed())
