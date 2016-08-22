app.factory('Search', function($state, $rootScope) {
    var PATH = 'search';
    var database = firebase.database();
    var searchParams = {};
    var searchOption = null;
    var previousUrl = null;

    var userSearchParams = [
        { key: "first_name", name: "first name", placeholder: "first name:", allowMultiple: true },
        { key: "last_name", name: "last name", placeholder: "last name:", allowMultiple: true },
        { key: "email", name: "email", placeholder: "email:", allowMultiple: true },
    ];

    var snippetSearchParams = [
        { key: "subject", name: "subject", placeholder: "subject:", allowMultiple: true },
        { key: "contents", name: "contains", placeholder: "contains:", allowMultiple: true },
    ];

    function sendSearchQuery(searchFor, params, url) {
        previousUrl = url;
        searchParams = params;
        searchOption = searchFor;
        var terms = makeTerm(searchParams);
        if (terms === '*' || !terms) return
        doSearch(terms);
    }

    function doSearch(query) {
        var index = 'firebase';
        var ref = database.ref().child(PATH);
        var type = searchOption;
        var key = ref.child('request').push({ index: index, type: type, query: query }).key;
        ref.child('response/' + key).on('value', sendResults);
    }

    function sendResults(snap) {
        if (!snap.exists()) {
            return; // wait until we get data
        }
        var data = snap.val();
        var result = { 'data': data };
        console.log(previousUrl);
        if (data.hits) $state.go('search', { 'result': result, 'type': searchOption, 'goBackTo': previousUrl});
    }

    function makeTerm(params) {
        var keys = Object.keys(params);
        var searching = ['organization:' + $rootScope.user.organization];
        var term;
        if (!keys.length) {
            return
        }
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
        makeTerm: makeTerm,
        userSearchParams: userSearchParams,
        snippetSearchParams: snippetSearchParams
    }
})
