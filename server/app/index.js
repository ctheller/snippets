'use strict';
var path = require('path');
var express = require('express');
var app = express();

var ElasticSearch = require('elasticsearch'),
   conf          = require('./elasticsearch/config'),
   fbutil        = require('./elasticsearch/lib/fbutil'),
   PathMonitor   = require('./elasticsearch/lib/PathMonitor'),
   SearchQueue   = require('./elasticsearch/lib/SearchQueue');

// connect to ElasticSearch
var esc = new ElasticSearch.Client({ hosts: [
    {
      host: conf.ES_HOST,
      port: conf.ES_PORT,
      auth: (conf.ES_USER && conf.ES_PASS) ? conf.ES_USER + ':' + conf.ES_PASS : null
    }
  ] });

console.log('Connected to ElasticSearch host %s:%s'.grey, conf.ES_HOST, conf.ES_PORT);

fbutil.init(conf.FB_URL, conf.FB_SERVICEACCOUNT);
PathMonitor.process(esc, conf.paths, conf.FB_PATH);
SearchQueue.init(esc, conf.FB_REQ, conf.FB_RES, conf.CLEANUP_INTERVAL);


module.exports = function (db) {

    // Pass our express application pipeline into the configuration
    // function located at server/app/configure/index.js
    require('./configure')(app, db);

    // Routes that will be accessed via AJAX should be prepended with
    // /api so they are isolated from our GET /* wildcard.
    app.use('/api', require('./routes'));


    /*
     This middleware will catch any URLs resembling a file extension
     for example: .js, .html, .css
     This allows for proper 404s instead of the wildcard '/*' catching
     URLs that bypass express.static because the given file does not exist.
     */
    app.use(function (req, res, next) {

        if (path.extname(req.path).length > 0) {
            res.status(404).end();
        } else {
            next(null);
        }

    });

    app.get('/*', function (req, res) {
        res.sendFile(app.get('indexHTMLPath'));
    });

    // Error catching endware.
    app.use(function (err, req, res, next) {
        console.error(err);
        console.error(err.stack);
        res.status(err.status || 500).send(err.message || 'Internal server error.');
    });

    return app;

};

