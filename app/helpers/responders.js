var userService = require('../services/userservice');

var _create_user_respond = function(controller) {
    // return a closure that replaces a controllers respond method
    // appends the user to all response content objects

    var respond = controller.respond.bind(controller);

    return function(content, opts) {
        // if (opts && (opts.format == 'html')) {
            userService.loadUserFromSession(controller.session, function(err, user) {

                //TODO: probably not the best way to do this
                content.user = {
                    id: '055B87AF-60C1-4A57-920A-EF44A2CB473C',
                    username: 'admin',
                    familyName: 'admin',
                    givenName: 'admin',
                    email: 'admin@buzz.com'
                }
                respond(content, opts);
                
            });
        // }
        // else {
        //     respond(content, opts);
        // }

    }
}

var UserResponder = function (controller) {
    // appends the user to all response content objects
    controller.respond = _create_user_respond(controller);
};
UserResponder.prototype = Object.create(geddy.responder.Responder.prototype);

exports.UserResponder = UserResponder;
