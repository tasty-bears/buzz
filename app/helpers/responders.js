var userService = require('../services/userservice');

//TODO: InternalResponder, a custom responder that replaces the controllers
//      respond method with a function that just "returns" the response instead
//      of responding, so that controller actions can be called by other
//      controller actions
//      i.e. for posts within Events.show

var _create_user_respond = function(controller) {
    // return a closure that replaces a controllers respond method
    // appends the user to all response content objects

    var respond = controller.respond;

    return function(content, opts) {
        var self = this; // controller when called

        // if (opts && (opts.format == 'html')) {
            userService.loadUserFromSession(self.session, function(err, user) {

                //TODO: probably not the best way to do this
                if(user) {
                    content.user = {
                        id: user.id,
                        username: user.username,
                        familyName: user.familyName,
                        givenName: user.givenName,
                        email: user.email
                    }
                }
                respond.bind(self)(content, opts);
                
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
