var fbutil = require('./fbutil');

function SearchQueue(esc, reqRef, resRef, cleanupInterval) {
    this.esc = esc;
    this.inRef = reqRef;
    this.outRef = resRef;
    this.cleanupInterval = cleanupInterval;
    console.log('Queue started, IN: "%s", OUT: "%s"'.grey, fbutil.pathName(this.inRef), fbutil.pathName(this.outRef));
    setTimeout(function() {
        this.inRef.on('child_added', this._process, this);
    }.bind(this), 1000);
    this._nextInterval();
}

SearchQueue.prototype = {
    _process: function(snap) {
        var dat = snap.val();
        var key = snap.key;
        // user org sent from query
        // todo add an AND clause to q
        // AND organization: user.org
        console.log(dat);
        if (this._assertValidSearch(key, dat)) {
            console.log(JSON.stringify(dat.query))
            this.esc.search({
                index: dat.index,
                type: dat.type,
                q: dat.query
            }, function(error, response) {
                if (error) {
                    this._reply(key, { error: error, total: 0 });
                } else {
                    this._reply(key, response);
                }
            }.bind(this));
        }
    },

    _reply: function(key, results) {
        if (results.error) {
            this._replyError(key, results.error);
        } else {
            console.log('result %s: %d hits'.yellow, key, results.hits.total);
            this._send(key, results.hits);
        }
    },

    _assertValidSearch: function(key, props) {
        var res = true;
        if (typeof(props) !== 'object' || !props.index || !props.type || !props.query) {
            this._replyError(key, 'search request must be a valid object with keys index, type, and query');
        }
        return res;
    },

    _replyError: function(key, err) {
        this._send(key, { total: 0, error: err })
    },

    _send: function(key, data) {
        this.inRef.child(key).remove(this._abortOnWriteError.bind(this));
        this.outRef.child(key).setWithPriority(data, new Date().valueOf());
    },

    _abortOnWriteError: function(err) {
        if (err) {
            console.log((err + '').red);
            throw new Error('Unable to remove queue item, probably a security error? ' + err);
        }
    },

    _housekeeping: function() {
        var self = this;
        // remove all responses which are older than CHECK_INTERVAL
        this.outRef.endAt(new Date().valueOf() - self.cleanupInterval).once('value', function(snap) {
            var count = snap.numChildren();
            if (count) {
                console.warn('housekeeping: found %d orphans (removing them now) %s'.red, count, new Date());
                snap.forEach(function(ss) { ss.ref.remove(); });
            }
            self._nextInterval();
        });
    },

    _nextInterval: function() {
        var interval = this.cleanupInterval > 60000 ? 'minutes' : 'seconds';
        console.log('Next cleanup in %d %s'.grey, Math.round(this.cleanupInterval / (interval === 'seconds' ? 1000 : 60000)), interval);
        setTimeout(this._housekeeping.bind(this), this.cleanupInterval);
    },

    _isJson: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
};

exports.init = function(esc, reqPath, resPath, matchWholeWords, cleanupInterval) {
    new SearchQueue(esc, fbutil.fbRef(reqPath), fbutil.fbRef(resPath), matchWholeWords, cleanupInterval);
};
