let creds = require('../../../credentials/creds.json');
let firebase = require("firebase");
let Chance = require('chance');
let ref = firebase.database().ref();
let chance = new Chance();
let jsonfile = require('jsonfile');

let seedy = {};

let CLevelPerson;
let CLevelsOrg;

function addOneOrg (seedObj) {
  if (!seedObj.users) {
    seedObj.users = {};
  }

  let CEO = [];
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

  if (!CLevelsOrg) {
    CLevelsOrg = orgName;
  }

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
      organization: orgName,
      reports: {},
      deletedUser: chance.bool({likelihood: 2})
    };

  // do managers after creating users
    if (i === 0) {
      CEO.push(username);
    } else if (i < 6) {
      managerCLevel.push(username);
      seedObj.users[username].manager = CEO[0];
      if (!CLevelPerson) {
        CLevelPerson = username;
      }
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

  let wholeOrg = CEO.concat(managerCLevel).concat(managerTopLevel).concat(managerMidLevel).concat(lowestLevel);

  // add reports to manager's object
  wholeOrg.forEach(function(user) {
    wholeOrg.forEach(function(user2) {
      if (user !== user2 && seedObj.users[user2].manager === user) {
        seedObj.users[user].reports[user2] = true;
      }
    });
  });

  // create snippets
  if(!seedObj.snippets) {
    seedObj.snippets = {};
  }

  for (let i=0; i<500; i++) {
    let snippetId = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 15});

    seedObj.snippets[snippetId] = snipGenerator();

    let randomUser = chance.pickone(wholeOrg);
    seedObj.snippets[snippetId].owner = randomUser;
    seedObj.snippets[snippetId].team = seedObj.users[randomUser].manager;
    seedObj.snippets[snippetId].organization = seedObj.users[randomUser].organization;

    // add snippet Id to owner's table
    if(!seedObj.users[randomUser].snippets) {
      seedObj.users[randomUser].snippets = {};
    }
    if (!seedObj.users[randomUser].snippets.asOwner) {
      seedObj.users[randomUser].snippets.asOwner = {};
    }
    seedObj.users[randomUser].snippets.asOwner[snippetId] = seedObj.snippets[snippetId].dateAdded;

    let level;
    if (CEO.indexOf(randomUser) !== -1) {
      level = CEO;
    } else if (managerCLevel.indexOf(randomUser) !== -1) {
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

// getting random users for inserting team members into database
// var organs = Object.keys(seedy.organizations);
// var pickedOrgan = chance.pickone(organs);
// var organUsers = seedy.organizations[pickedOrgan].users;
// var toReplace = chance.pickset(Object.keys(organUsers), 4);

var gabeObj = {
  id: 'We8iLkQsY3OEeAYoSuOuLFsBjzu2',
  email: "grod220@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-AqkAdKInFSU/AAAAAAAAAAI/AAAAAAAAKtI/-n_yz9wAC9U/s96-c/photo.jpg",
  first_name: "Gabe",
  last_name: "Rodriguez",
  manager: 'kKCwoTNYpURej7sv3bKMcy7oMKI3',
  reports: {},
  snippets: {
    asOwner: {},
    asTeamMember: {},
    asCollaborator: {},
    asManager: {}
  }
};

var tammyObj = {
  id: 'me4lpzRP3OUFzDjzpu11Utx323Q2',
  email: "tctammychu@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-oYfo7EWvvj0/AAAAAAAAAAI/AAAAAAAAAU8/dt8TeNi4nco/s96-c/photo.jpg",
  first_name: "Tammy",
  last_name: "Chu",
  manager: CLevelPerson,
  reports: {
    'kKCwoTNYpURej7sv3bKMcy7oMKI3': true
  },
  snippets: {
    asOwner: {},
    asTeamMember: {},
    asCollaborator: {},
    asManager: {}
  }
};

var nickObj = {
  id: 'eTeGzfSeoxPMx1qwCV8PwUtCii53',
  email: "nicolaas.koster@gmail.com",
  first_name: "Nicky",
  last_name: "Koster",
  photoUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
  manager: 'kKCwoTNYpURej7sv3bKMcy7oMKI3',
  reports: {},
  snippets: {
    asOwner: {},
    asTeamMember: {},
    asCollaborator: {},
    asManager: {}
  }
};

var chrisObj = {
  id: 'kKCwoTNYpURej7sv3bKMcy7oMKI3',
  email: "ctheller12@gmail.com",
  photoUrl: "https://lh4.googleusercontent.com/-SUsrR9RW9dM/AAAAAAAAAAI/AAAAAAAAA4M/f9GV-l536rc/s96-c/photo.jpg",
  first_name: "Chris",
  last_name: "Heller",
  manager: 'me4lpzRP3OUFzDjzpu11Utx323Q2',
  reports: {
    'We8iLkQsY3OEeAYoSuOuLFsBjzu2': true,
    'eTeGzfSeoxPMx1qwCV8PwUtCii53': true
  },
  snippets: {
    asOwner: {},
    asTeamMember: {},
    asCollaborator: {},
    asManager: {}
  }
};

// loop to get replace random employee
for (let i=0; i< 4; i++) {

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

  // // delete old property
  // delete organUsers[toReplace[i]];
  // // add user to org
  // organUsers[newGuy.id] = true;

  // add user to org (NEW)
  seedy.organizations[CLevelsOrg].users[newGuy.id] = true;

  // add newGuy to users table
  seedy.users[newGuy.id] = {
    email: newGuy.email,
    photoUrl: newGuy.photoUrl,
    first_name: newGuy.first_name,
    last_name: newGuy.last_name,
    isAdmin: true,
    organization: CLevelsOrg,
    manager: newGuy.manager,
    reports: newGuy.reports,
    snippets: newGuy.snippets,
    deletedUser: false
  };

  for (let i=0; i<50; i++) {
    let sampleSnip = chance.string({pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', length: 10}) + '--SEEDY';
    seedy.snippets[sampleSnip] = snipGenerator();
    seedy.snippets[sampleSnip].owner = newGuy.id;
    let arrOfUsers = Object.keys(seedy.organizations[CLevelsOrg].users);

    let amountOfCollabs = chance.integer({min: 0, max: 4});
    for (let i=0; i<amountOfCollabs; i++) {
      let randosId = chance.pickone(arrOfUsers);
      seedy.snippets[sampleSnip].collaborators[randosId] = true;
    }
    let randoX = chance.pickone(arrOfUsers);
    let weightz;
    if (newGuy.first_name === 'Chris' || newGuy.first_name === 'Tammy') {
     weightz = [10,2,5];
    } else {
     weightz = [10,4,8];
    }

    let typeSnip = chance.weighted(['asTeamMember', 'asOwner', 'asCollaborator'], weightz);
    if (typeSnip === 'asOwner') {
      seedy.snippets[sampleSnip].organization = CLevelsOrg;
      seedy.users[newGuy.id].snippets.asTeamMember[sampleSnip] = seedy.snippets[sampleSnip].dateAdded;
      seedy.users[newGuy.id].snippets.asOwner[sampleSnip] = seedy.snippets[sampleSnip].dateAdded;
      seedy.snippets[sampleSnip].team = newGuy.manager;
      seedy.snippets[sampleSnip].collaborators[newGuy.id] = true;
    } else if (typeSnip === 'asTeamMember') {
      seedy.users[newGuy.id].snippets[typeSnip][sampleSnip] = seedy.snippets[sampleSnip].dateAdded;
      seedy.snippets[sampleSnip].owner = randoX;
      seedy.snippets[sampleSnip].collaborators[randoX] = true;
      seedy.snippets[sampleSnip].team = newGuy.manager;
    } else if (typeSnip === 'asCollaborator') {
      seedy.users[newGuy.id].snippets[typeSnip][sampleSnip] = seedy.snippets[sampleSnip].dateAdded;
      seedy.snippets[sampleSnip].collaborators[newGuy.id] = true;
      seedy.snippets[sampleSnip].owner = randoX;
      seedy.snippets[sampleSnip].collaborators[randoX] = true;
    }
  }




  // // loop through users
  //   // if manager is replace[i], swap with me
  // for (let userKey in seedy.users) {
  //   if (seedy.users[userKey].manager && seedy.users[userKey].manager === toReplace[i]) {
  //       seedy.users[userKey].manager = newGuy.id;
  //   }
  // }

  // // move over manager
  // seedy.users[newGuy.id].manager = seedy.users[toReplace[i]].manager;

  // // move over asOwner, asTeamMember, As collaborator snippets
  // if (seedy.users[toReplace[i]].snippets) {
  //   seedy.users[newGuy.id].snippets = seedy.users[toReplace[i]].snippets;
  // }


  // // delete user
  // delete seedy.users[toReplace[i]];
}

 // loop through snippets
  for (let snippetKey in seedy.snippets) {
    if (seedy.snippets[snippetKey].team) {
      let theManager = seedy.snippets[snippetKey].team;
      if (!seedy.users[theManager].snippets) {
        seedy.users[theManager].snippets = {};
      }
      if (!seedy.users[theManager].snippets.asManager) {
        seedy.users[theManager].snippets.asManager = {};
      }
      seedy.users[theManager].snippets.asManager[snippetKey] = seedy.snippets[snippetKey].dateAdded;
    }
  }

// console.log(seedy);

// write to local hard drive
var file = '/Users/grodriguez/desktop/seed.json';
let obj = seedy;
jsonfile.writeFile(file, obj, function (err) {
  console.error(err);
});

  // // send to live database ---- THROWS ERRORS?
  // ref.set(seedy)
  // .then(function(result) {
  //   console.log('success: ', result);
  // });


  // HELPER FUNCTIONS
  function snipGenerator () {

    function contentsGen() {

      let eventName = chance.pickone([`${chance.capitalize(chance.word())}Con`, 'Executive Summit', 'Acceleration 2016', 'Matching event', chance.capitalize(chance.word()), 'HalfStack Fair', 'SEAN Week', `${chance.capitalize(chance.word())} Festival`, 'Creative Camp', `${chance.capitalize(chance.word())} Gala`, `${chance.capitalize(chance.word())} Design Awards`]);
      let eventSentence = chance.pickone([
                                         `${eventName} launches to fanfare`,
                                         `This year's ${eventName} brings huge crowds`,
                                         `Over ${chance.integer({min: 36, max: 122})} press mentions featuring ${eventName}`,
                                         `Trained year's ${eventName} brings huge crowds`,
                                         `Debuted new research at ${eventName} on local market challenges and ROI.`,
                                         `${chance.pickone(['Started', 'Wrapped up', 'Ended', 'Commissioned', 'Sourced', 'Explored'])} partnership with ${chance.name()}`,
                                         `Hosted ${eventName} in ${chance.city()} with ${chance.integer({min: 36, max: 122})} execs.`]);
      let eventContents = chance.pickone([
                                         `${eventName} is a partnership between the Ministry of Finance in ${chance.country({ full: true })}, SAP and Upwork to educate, certify and build capacity for 200k developers. Our announcement of the winners for the best Apps received widespread press coverage.`,
                                         `Our university outreach exceeded all expectations (see full report) and trained 3k ppl at <$10 CPT incl. 400+ user-generated Social Media posts and 120+ PR articles (45M reach). H3 Outlook: Extend format for and scale it to 20+ with regional focus for local endorsement.`,
                                         `Continuing big company push and featuring a lineup of global & local speakers, and a sales activation plan. 27% uplift in "${eventName} helps me understand the industry" from pre & post survey.`]);

      let productName = chance.pickone(['CodecCourse', 'EngineUtilityv2', 'LifeStrong', 'MegaDash', 'WikiStack Courseware', 'CryptoPass', 'Stackspace', 'Trip Planner', 'Juke', `Pledge v${chance.integer()}`, 'GraceShopper', 'CompilerDuo', 'Middler']);
      let productSentence = chance.pickone([
                                           `Sales of ${productName} ${chance.pickone(['increase by', 'decrease by', 'see an uplift of', 'see a downturn of', 'drop by', 'lift by'])} ${chance.integer({min: 55, max: 122})}%`,
                                           `New product ${productName} launches in ${chance.integer({min: 3, max: 32})} languages`,
                                           `Launched the Developer Preview of ${productName} in ${chance.city()}`,
                                           `${chance.pickone(['Rolled out', 'Launched', 'Released', 'Introduced', 'Unveiled', 'Opened beta testing for'])} ${productName}`,
                                           `${productName} marketing campaign in ${chance.country({ full: true })} kicked off`]);
      let productContents = chance.pickone([
                                           `As part of our plan to anchor ${productName} within the local culture, celebrated the 22nd Anniversary of the inauguration of David Yang with a local marketing campaign inspired by this legendary artist from ${chance.country({ full: true })}. Enthusiastic press reactions (including TV and print), endorsement on Twitter and positive users`,
                                           `The partnership with leading ${chance.country()} telco to offer all their customers a 4 month free trial of ${productName} has delivered ${chance.integer({min: 55, max: 122})}k new trials in the last 4 months. The offer was extended until July to continue growth.`,
                                           `This cross-functional effort showed that ${productName} is great for the community. Our commitment to help  has been received with amazement, counting 100s of thankful tweets, calls and emails.`,
                                           `The pilot targets the million dollar advertising opportunity that exists within the client portfolio of markets in ${chance.country()}, by increasing our share of total advertising spend with the Top 1K clients in our portfolio.`]);
      let eventObj = {
        subject: eventSentence,
        contents: eventContents
      }

      let productObj = {
        subject: productSentence,
        contents: productContents
      }

     return chance.pickone([eventObj, productObj])

    }

    let toReturn = contentsGen();
    return {
      subject: toReturn.subject,
      contents: toReturn.contents,
      submitted: chance.bool({likelihood: 50}),
      dateAdded: chance.integer({min: Date.now() - 1.814e+9, max: Date.now() + 800000000}),
      collaborators: {}
    };
  }
