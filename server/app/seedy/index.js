let creds = require('../../../credentials/creds.json');
let firebase = require("firebase");
let Chance = require('chance');
let ref = firebase.database().ref("organizations");
let chance = new Chance();
let jsonfile = require('jsonfile')
var file = '/Users/grodriguez/desktop/seed.json';



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
  let lowestLevel = [];

  // create users
  for (let i=0; i<250; i++) {
    // no  $ # [ ] / or .
    let username = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 10});
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
      lowestLevel.push(username);
      toReturn.users[username].manager = chance.pickone(managerMidLevel);
    }
  }

  // create snippets
  toReturn.snippets = {};
  for (let i=0; i<500; i++) {
    let snippetId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 15});
    toReturn.snippets[snippetId] = {
      contents: chance.paragraph(),
      subject: chance.sentence({words: 6}),
      submitted: chance.bool({likelihood: 50}),
      dateAdded: chance.integer({min: Date.now() - 1.814e+9, max: Date.now()})
    };

    let randomUser = chance.pickone(Object.keys(toReturn.users));
    toReturn.snippets[snippetId].owner = randomUser;
    toReturn.snippets[snippetId].team = toReturn.users[randomUser].manager;

    // add snippet Id to owner's table
    if(!toReturn.users[randomUser].snippets) {
      toReturn.users[randomUser].snippets = {};
    }
    if (!toReturn.users[randomUser].snippets.asOwner) {
      toReturn.users[randomUser].snippets.asOwner = {};
    }
    toReturn.users[randomUser].snippets.asOwner[snippetId] = true;

    let level;
    if (managerCLevel.indexOf(randomUser) !== -1) {
      level = managerCLevel;
    } else if (managerTopLevel.indexOf(randomUser) !== -1) {
      level = managerTopLevel;
    } else if (managerMidLevel.indexOf(randomUser) !== -1) {
      level = managerMidLevel;
    } else if (lowestLevel.indexOf(randomUser) !== -1) {
      level = lowestLevel;
    }

    let teammates = [];
    for (let user in toReturn.users) {
      if (toReturn.users[user].manager === toReturn.users[randomUser].manager) {
        teammates.push(user);
      }
    }
    let collabLoop = chance.integer({min: 0, max: 4});
    for (let i=0; i<collabLoop; i++) {
      if (!toReturn.snippets[snippetId].collaborators) {
        toReturn.snippets[snippetId].collaborators = {};
      }
      if (chance.bool({likelihood: 80})) {
        // collaborators come from teammates array
          let userToAdd = teammates[chance.integer({min: 0, max: teammates.length-1})];
          toReturn.snippets[snippetId].collaborators[userToAdd] = true;
        // add to collaborators table
        if(!toReturn.users[userToAdd].snippets) {
          toReturn.users[userToAdd].snippets = {};
        }
        if (!toReturn.users[userToAdd].snippets.asCollaborator) {
          toReturn.users[userToAdd].snippets.asCollaborator = {};
        }
        toReturn.users[userToAdd].snippets.asCollaborator[snippetId] = true;
      } else {
        // collaborators come from org (on your level) array
        let userToAdd = level[chance.integer({min: 0, max: teammates.length-1})];
        toReturn.snippets[snippetId].collaborators[userToAdd] = true;
        // add to collaborators table
        if(!toReturn.users[userToAdd].snippets) {
          toReturn.users[userToAdd].snippets = {};
        }
        if (!toReturn.users[userToAdd].snippets.asCollaborator) {
          toReturn.users[userToAdd].snippets.asCollaborator = {};
        }
        toReturn.users[userToAdd].snippets.asCollaborator[snippetId] = true;
      }
    }
  }

  // ADD snippets asTeamMembers to users
    // loop through snippets
  for (let snippetKey in toReturn.snippets) {
    // get team aka manager ID
    let manager = toReturn.snippets[snippetKey].team;
    // loop through user table
    for (let userKey in toReturn.users) {
      // if user.manager === managerID && user !== snippet.owner
      if (toReturn.snippets[snippetKey].owner !== userKey && toReturn.users[userKey].manager === manager) {
        // user.snippets.asTeamMember exists?, if not add {}
        if(!toReturn.users[userKey].snippets) {
          toReturn.users[userKey].snippets = {};
        }
        if (!toReturn.users[userKey].snippets.asTeamMember) {
          toReturn.users[userKey].snippets.asTeamMember = {};
        }
        // user.snippets.asTeamMember[snippetId] = true
        toReturn.users[userKey].snippets.asTeamMember[snippetKey] = true;
      }
    }

  }
  return toReturn;
}

console.log(buildSeed())

let obj = buildSeed();
jsonfile.writeFile(file, obj, function (err) {
  console.error(err)
});
