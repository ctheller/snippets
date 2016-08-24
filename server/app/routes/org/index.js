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

router.get('/:org/:option', function(req, res, next) {
    userRef.once('value').then(function(snap) {
        if (!req.params.org) res.sendStatus(400);
        var users = snap.val();

        for (var key in users) {
            if (users[key].reports) users[key].renameProperty('reports', 'children');
        }

        // do pickBy for every org
        var employees = _.pickBy(users, function(user) {
            return user.organization === 'lo Inc'
        });

        // only need email, first name, last name, manager, photoUrl from each employee
        var all = [],
            managers = [],
            CEO;
        for (var key in employees) {
            employees[key] = _.omit(employees[key], ['isAdmin', 'organization']);
            if (employees[key].snippets) {
                if (employees[key].snippets.asOwner) {
                    employees[key].snippets = Object.keys(employees[key].snippets.asOwner).length;
                } else {
                    employees[key].snippets = 0;
                }
            }
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

        var orgTreeJson = managerObjs[CEO.id];
        var donutChartArr = [];
        var emptyObj = {},
            name;
        objToArrLevel1(orgTreeJson)
        if (req.params.option === 'tree') res.json(orgTreeJson)
        else if (req.params.option === 'donut') res.json(donutChartArr)

        // convert object of objects to array of objects
        function objToArr(obj) {
            var arr = [];
            for (var key in obj) {
                arr.push(obj[key]);
            }
            return arr;
        }

        function objToArrLevel1(obj) {
            obj['children'] = objToArr(obj['children']);
            obj['teamSnippetCount'] = obj['children'].reduce(function(acc, cur) {
                return acc + Number(cur.snippets);
            }, 0);
            name = obj.first_name + ' ' + obj.last_name;
            emptyObj.name = name;
            emptyObj.teamSnippetCount = obj['teamSnippetCount'];
            donutChartArr.push(emptyObj);
            emptyObj = {};
            objToArrLevel2(obj['children']);
        }

        function objToArrLevel2(objReports) {
            if (objReports) {
                for (var i = 0; i < objReports.length; i++) {
                    if (objReports[i]['children']) {
                        objReports[i]['children'] = objToArr(objReports[i]['children']);
                        objReports[i]['teamSnippetCount'] = objReports[i]['children'].reduce(function(acc, cur) {
                            return acc + Number(cur.snippets);
                        }, 0);
                        name = objReports[i].first_name + ' ' + objReports[i].last_name;
                        emptyObj.name = name;
                        emptyObj.teamSnippetCount = objReports[i]['teamSnippetCount'];
                        // console.log(emptyObj.teamSnippetCount)
                        donutChartArr.push(emptyObj);
                        emptyObj = {};
                    }
                    objToArrLevel2(objReports[i]['children']);
                }
            }
        }

    })
})
