'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Snippet = require('./models/snippet');
var Organization = require('./models/organization');
var Summary = require('./models/summary');

User.belongsTo(User, {as: 'manager'});
User.hasMany(User, {as: 'Reports', foreignKey: 'managerId'});

Snippet.belongsTo(User, {as: 'owner'});
Snippet.belongsToMany(User, {through: 'snippetCollaborators'});
User.belongsToMany(Snippet, {through: 'snippetCollaborators', foreignKey: 'collaboratorId'});

User.belongsTo(Organization);

Summary.belongsTo(User);
Summary.hasMany(Snippet);
Snippet.belongsToMany(Summary, {through: 'summarySnippets'});