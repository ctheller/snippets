app.factory('Search', function ($state) {
    var PATH = 'search';
    var database = firebase.database();
    var searchParams = {};

    function sendSearchQuery (params) {
        searchParams = params;
        doSearch(makeTerm(searchParams));
    }

    function doSearch(query) {
        var index = 'firebase';
        var ref = database.ref().child(PATH);
        var type = 'snippet';
        var key = ref.child('request').push({ index: index, type: type, query: query }).key;
        ref.child('response/' + key).on('value', sendResults);
    }

    function sendResults(snap) {
        if (!snap.exists()) {
            return;
        } // wait until we get data
        var data = snap.val();
        var result = { 'data': data };
        if (data.hits) $state.go('search', { 'result': result });
    }

    function makeTerm(params) {
        var keys = Object.keys(params);
        var searching = [];
        var term;
        for (var key in params) {
            term = params[key]
            if (!term.match(/^\*/)) { term = '*' + term; }
            if (!term.match(/\*$/)) { term += '*'; }
            var queryStr = (key !== 'query') ? ('' + key + ':' + term) : (term)

            searching.push(queryStr);
        }
        return searching.join(' AND ');
    }

    return {
        sendSearchQuery: sendSearchQuery,
        doSearch: doSearch,
        sendResults: sendResults,
        makeTerm: makeTerm
    }
})
