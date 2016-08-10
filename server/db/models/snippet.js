'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('snippet', {
    subject: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        defaultValue: 'Achievement'
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.STRING)
    },
    submitted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
    }
}, {
    instanceMethods: {
        
    },
    classMethods: {
        
    },
    hooks: {
        beforeValidate: function (snippet) {
            
        }
    }
});
