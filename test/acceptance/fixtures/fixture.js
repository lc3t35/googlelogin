(function () {
    "use strict";

    var createRoute = function(route, handler) {
        WebApp.connectHandlers.stack.splice(0, 0, {
            route: '/' + route,
            handle: function (req, res) {
                res.writeHead(200, {'Content-Type': 'text/plain'});
                handler(req, res);
                res.end(route + ' complete');
            }.future()
        });
    };

    var oauthRoute = function(route, handler) {
        WebApp.connectHandlers.stack.splice(0, 0, {
            route: '/' + route,
            handle: function (req, res) {
                res.writeHead(200, {'Content-Type': 'text/html'});
                handler(req, res);
                var content =
                    '<html><head><script>window.close()</script></head></html>';
                res.end(content, 'utf-8');
            }.future()
        });
    };

    var reset = function() {
        Meteor.users.remove({});
    };

    var oauth = function() {
        console.log("_oauth");
    };

    Meteor.startup(function () {
        reset();
        createRoute('reset', reset);
        // oauthRoute('_oauth', oauth);       // no need for _oauth
    });
})();

