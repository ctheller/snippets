'use strict';
var router = require('express').Router();
module.exports = router;
var firebase = require('firebase');
var userRef = firebase.database().ref("users");
// var orgRef = firebase.database().ref("organization");
var _ = require('lodash');

Object.defineProperty(
    Object.prototype,
    'renameProperty', {
        writable: false, // Cannot alter this property
        enumerable: false, // Will not show up in a for-in loop.
        configurable: false, // Cannot be deleted via the delete operator
        value: function(oldName, newName) {
            // Do nothing if the names are the same
            if (oldName == newName) {
                return this;
            }
            // Check for the old property name to
            // avoid a ReferenceError in strict mode.
            if (this.hasOwnProperty(oldName)) {
                this[newName] = this[oldName];
                delete this[oldName];
            }
            return this;
        }
    }
);

router.get('/:org', function(req, res, next) {
    userRef.once('value').then(function(snap) {
        if (!req.params.org) res.sendStatus(400);
        var users = snap.val();

        for (var key in users) {
            if (users[key].reports) users[key].renameProperty('reports', 'children');
        }

        // do pickBy for every org
        var employees = _.pickBy(users, function(user) {
            return user.organization === req.params.org
        });
        // only need email, first name, last name, manager, photoUrl from each employee
        var all = [],
            managers = [],
            CEO;
        for (var key in employees) {
            employees[key] = _.omit(employees[key], ['isAdmin', 'organization', 'snippets']);
            employees[key].id = key;
            if (employees[key].hasOwnProperty('children')) managers.push(employees[key]);
            if (!employees[key].manager) CEO = (employees[key]);
            all.push(employees[key]);
        }
        // assign report obj to manager.children[report's hash]
        var allIds = all.map(report => report.id);
        managers.map(manager => {
            for (key in manager.children) {
                var i = allIds.indexOf(key);
                manager.children[key] = _.omit(all[i], ['manager']);
            }
        });
        // console.log(CEO)
        // conver array of objects to object of objects
        var managerObjs = {};
        for (var i = 0; i < managers.length; i++) {
            managerObjs[managers[i].id] = _.omit(managers[i], 'id');
        }

        var output = managerObjs[CEO.id];
        res.json(objToArrLevel1(output))

        // convert object of objects to array of objects
        function objToArr(obj) {
            var arr = [];
            for (var key in obj) {
                arr.push(obj[key])
            }
            return arr;
        }

        function objToArrLevel1(obj) {
            obj['children'] = objToArr(obj['children']);
            objToArrLevel2(obj['children']);
            return obj
        }

        function objToArrLevel2(objReports) {
            if (objReports) {
                for (var i = 0; i < objReports.length; i++) {
                    if (objReports[i]['children']) objReports[i]['children'] = objToArr(objReports[i]['children']);
                    objToArrLevel2(objReports[i]['children'])
                }
            }
        }

    })
})
