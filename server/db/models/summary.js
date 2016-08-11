'use strict';
var _ = require('lodash');
var Sequelize = require('sequelize');

var db = require('../_db');

module.exports = db.define('summary', {
	subject: {
		type: Sequelize.STRING,
		AllowNull: false
	},
	body: {
		type: Sequelize.TEXT,
		DefaultValue: "The week in brief:"
	}
})