'use strict';
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('organization', {
    name: {
        type: Sequelize.STRING
    },
    description: {
        type: Sequelize.TEXT
    },
    subscription: {
    	type: Sequelize.ENUM('paid', 'free')
    }
});
