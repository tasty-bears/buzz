var userService = require('../services/userservice');

var _create_user_respond = function(controller) {
    // return a closure that replaces a controllers respond method
    // appends the user to all response content objects

    var respond = controller.respond.bind(controller);

    return function(content, opts) {

        if (opts.format == 'html') {
            userService.loadUserFromSession(controller.session, function(err, user) {
                content.user = user;
                respond(content, opts);
            });
        }
        else {
            respond(content, opts);
        }

    }
}

var UserResponder = function (controller) {
    // appends the user to all response content objects
    controller.respond = _create_user_respond(controller);
};
UserResponder.prototype = Object.create(geddy.responder.Responder.prototype);

exports.UserResponder = UserResponder;
