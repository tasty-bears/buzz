var UserService = function() {

	this.loadUserFromSession = function(session, action) {
		geddy.model.User.first(session.get('userId'), function(err, data) {
			if (err) {
				action(err, null);
			} else {
				action(null, data);
			}
		});
	};
	
	this.findUserById = function(userId, action) {
		geddy.model.User.first({id: userId}, function(err, user) {
			if (err || !user) {
				console.log("Could not find user by ID");
				// action({user: 'The user was not found'}, null);
			} else {
				action(null, user);
			}
		});
	};
};

module.exports = new UserService();
