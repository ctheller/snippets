let creds = require('../../../credentials/creds.json');
let firebase = require("firebase");
let Chance = require('chance');
let ref = firebase.database().ref();
let chance = new Chance();
let jsonfile = require('jsonfile');

let seedy = {};

function addOneOrg (seedObj) {
  if (!seedObj.users) {
    seedObj.users = {};
  }

  let managerCLevel = [];
  let managerTopLevel = [];
  let managerMidLevel = [];
  let lowestLevel = [];


  // create org obj
  if (!seedObj.organizations) {
    seedObj.organizations = {};
  }

  let orgName = chance.word() + ' Inc';
  seedObj.organizations[orgName] = {
    dueDay: {
      day: chance.integer({min: 0, max: 6}),
      time: chance.hour({twentyfour: true}) * 100
    },
    users: {}
  };

  // create users
  for (let i=0; i<250; i++) {

    // no  $ # [ ] / or .
    let username = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 10});
    seedObj.users[username] = {
      email: chance.email(),
      first_name: chance.first(),
      isAdmin: chance.bool({likelihood: 5}),
      last_name: chance.last(),
      photoUrl : `https://randomuser.me/api/portraits/${chance.pickone(['men', 'women'])}/${chance.integer({min: 0, max: 99})}.jpg`,
      organization: orgName
    };

  // do managers after creating users
    if (i < 5) {
      managerCLevel.push(username);
    } else if (i < 25) {
      managerTopLevel.push(username);
      seedObj.users[username].manager = chance.pickone(managerCLevel);
    } else if (i < 75) {
      managerMidLevel.push(username);
      seedObj.users[username].manager = chance.pickone(managerTopLevel);
    } else {
      lowestLevel.push(username);
      seedObj.users[username].manager = chance.pickone(managerMidLevel);
    }
  }

  let wholeOrg = managerCLevel.concat(managerTopLevel).concat(managerMidLevel).concat(lowestLevel);

  // create snippets
  if(!seedObj.snippets) {
    seedObj.snippets = {};
  }
  // console.log(new Date(chance.integer({min: Date.now() - 1.814e+9, max: Date.now()})))
  // console.log(Date.parse(Date()))
  // console.log(new Date())
  for (let i=0; i<500; i++) {
    let snippetId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 15});
    seedObj.snippets[snippetId] = {
      contents: chance.paragraph(),
      subject: chance.sentence({words: 6}),
      submitted: chance.bool({likelihood: 50}),
      dateAdded: chance.integer({min: Date.now() - 1.814e+9, max: Date.now()})
    };

    let randomUser = chance.pickone(wholeOrg);
    seedObj.snippets[snippetId].owner = randomUser;
    seedObj.snippets[snippetId].team = seedObj.users[randomUser].manager;

    // add snippet Id to owner's table
    if(!seedObj.users[randomUser].snippets) {
      seedObj.users[randomUser].snippets = {};
    }
    if (!seedObj.users[randomUser].snippets.asOwner) {
      seedObj.users[randomUser].snippets.asOwner = {};
    }
    seedObj.users[randomUser].snippets.asOwner[snippetId] = seedObj.snippets[snippetId].dateAdded;

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
    for (let user in seedObj.users) {
      if (seedObj.users[user].manager === seedObj.users[randomUser].manager) {
        teammates.push(user);
      }
    }
    let collabLoop = chance.integer({min: 0, max: 4});
    for (let i=0; i<collabLoop; i++) {
      if (!seedObj.snippets[snippetId].collaborators) {
        seedObj.snippets[snippetId].collaborators = {};
      }
      if (chance.bool({likelihood: 80})) {
        // collaborators come from teammates array
          let userToAdd = teammates[chance.integer({min: 0, max: teammates.length-1})];
          seedObj.snippets[snippetId].collaborators[userToAdd] = true;
        // add to collaborators table
        if(!seedObj.users[userToAdd].snippets) {
          seedObj.users[userToAdd].snippets = {};
        }
        if (!seedObj.users[userToAdd].snippets.asCollaborator) {
          seedObj.users[userToAdd].snippets.asCollaborator = {};
        }
        seedObj.users[userToAdd].snippets.asCollaborator[snippetId] = seedObj.snippets[snippetId].dateAdded;
      } else {
        // collaborators come from org (on your level) array
        let randomTeammate = chance.integer({min: 0, max: level.length-1});
        let userToAdd = level[randomTeammate];

        seedObj.snippets[snippetId].collaborators[userToAdd] = true;
        // add to collaborators table
        if(!seedObj.users[userToAdd].snippets) {
          seedObj.users[userToAdd].snippets = {};
        }
        if (!seedObj.users[userToAdd].snippets.asCollaborator) {
          seedObj.users[userToAdd].snippets.asCollaborator = {};
        }
        seedObj.users[userToAdd].snippets.asCollaborator[snippetId] = seedObj.snippets[snippetId].dateAdded;
      }
    }
  }

  // ADD snippets asTeamMembers to users
    // loop through snippets
  for (let snippetKey in seedObj.snippets) {
    // get team aka manager ID
    let manager = seedObj.snippets[snippetKey].team;
    // loop through user table
    for (let userKey in seedObj.users) {
      // if user.manager === managerID && user !== snippet.owner
      if (seedObj.snippets[snippetKey].owner !== userKey && seedObj.users[userKey].manager === manager) {
        // user.snippets.asTeamMember exists?, if not add {}
        if(!seedObj.users[userKey].snippets) {
          seedObj.users[userKey].snippets = {};
        }
        if (!seedObj.users[userKey].snippets.asTeamMember) {
          seedObj.users[userKey].snippets.asTeamMember = {};
        }
        // user.snippets.asTeamMember[snippetId] = true
        seedObj.users[userKey].snippets.asTeamMember[snippetKey] = seedObj.snippets[snippetKey].dateAdded;
      }
    }
  }

  // add all users to organization's table
  for (let i=0; i<wholeOrg.length; i++) {
    seedObj.organizations[orgName].users[wholeOrg[i]] = true;
  }
}

addOneOrg(seedy);
addOneOrg(seedy);
addOneOrg(seedy);

// inserting team members into database
var organs = Object.keys(seedy.organizations);
var pickedOrgan = chance.pickone(organs);
var organUsers = seedy.organizations[pickedOrgan].users;
var toReplace = chance.pickset(Object.keys(organUsers), 4);

var gabeObj = {
  id: 'We8iLkQsY3OEeAYoSuOuLFsBjzu2',
  email: "grod220@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-AqkAdKInFSU/AAAAAAAAAAI/AAAAAAAAKtI/-n_yz9wAC9U/s96-c/photo.jpg",
  first_name: "Gabe",
  last_name: "Rodriguez",
};

var tammyObj = {
  id: 'me4lpzRP3OUFzDjzpu11Utx323Q2',
  email: "tctammychu@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-oYfo7EWvvj0/AAAAAAAAAAI/AAAAAAAAAU8/dt8TeNi4nco/s96-c/photo.jpg",
  first_name: "Tammy",
  last_name: "Chu",
};

var nickObj = {
  id: 'eTeGzfSeoxPMx1qwCV8PwUtCii53',
  email: "nicolaas.koster@gmail.com",
  first_name: "Nicky",
  last_name: "Koster",
  photoUrl: 'https://randomuser.me/api/portraits/men/42.jpg'
};

var chrisObj = {
  id: 'kKCwoTNYpURej7sv3bKMcy7oMKI3',
  email: "ctheller12@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-SUsrR9RW9dM/AAAAAAAAAAI/AAAAAAAAA4M/f9GV-l536rc/s96-c/photo.jpg",
  first_name: "Chris",
  last_name: "Heller",
};

for (let i=0; i< toReplace.length; i++) { //
  // to replace
  // console.log(toReplace[i]);

  // insert team members data
  let newGuy;
  if (i === 0) {
    newGuy = gabeObj;
  } else if (i === 1) {
    newGuy = tammyObj;
  } else if(i === 2) {
    newGuy = nickObj;
  } else if(i === 3) {
    newGuy = chrisObj;
  }

  // delete old property
  delete organUsers[toReplace[i]];
  // add user to org
  organUsers[newGuy.id] = true;

  // loop through snippets
  for (let snippetKey in seedy.snippets) {
    // if owner is replace[i], then replace with me
    if (seedy.snippets[snippetKey].owner === toReplace[i]) {
      seedy.snippets[snippetKey].owner = newGuy.id;
    }
    // if collaborators, delete and add me
    if (seedy.snippets[snippetKey].collaborators && seedy.snippets[snippetKey].collaborators[toReplace[i]]) {
      delete seedy.snippets[snippetKey].collaborators[toReplace[i]];
      seedy.snippets[snippetKey].collaborators[newGuy.id] = true;
    }
    // if team is the older ID, replace
    if (seedy.snippets[snippetKey].team && seedy.snippets[snippetKey].team === toReplace[i]) {
      seedy.snippets[snippetKey].team = newGuy.id;
    }
  }

  // loop through users
    // if manager is replace[i], swap with me
  for (let userKey in seedy.users) {
    if (seedy.users[userKey].manager && seedy.users[userKey].manager === toReplace[i]) {
        seedy.users[userKey].manager = newGuy.id;
    }
  }
  // add newGuy to users table
  seedy.users[newGuy.id] = {
    email: newGuy.email,
    photoUrl: newGuy.photoUrl,
    first_name: newGuy.first_name,
    last_name: newGuy.last_name,
    isAdmin: true
  };
  // move over manager
  seedy.users[newGuy.id].manager = seedy.users[toReplace[i]].manager;

  // move over asOwner, asTeamMember, As collaborator snippets
  if (seedy.users[toReplace[i]].snippets) {
    seedy.users[newGuy.id].snippets = seedy.users[toReplace[i]].snippets;
  }

  // delete user
  delete seedy.users[toReplace[i]];
}



// console.log(seedy);

// write to local hard drive
var file = '/Users/grodriguez/desktop/seed.json';
let obj = seedy;
jsonfile.writeFile(file, obj, function (err) {
  console.error(err);
});



  // // send to live database
  // ref.set(seedy)
  // .then(function(result) {
  //   console.log('success: ', result);
  // });
