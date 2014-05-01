var UserService = function() {

	this.loadUserFromSession = function(session, action) {
		var userId = session.get('userId') || null;
		if(userId == null) {
			action(null, null);
			return;
		}

		this.findUserById(userId, function(err, user) {
			action(err, user);
		});
	};
	
	this.findUserById = function(userId, action) {
		geddy.model.User.first({id: userId}, function(err, user) {
			if (err) {
				action(err);
			}
			else if(!user) {
				action(new Error("Could not find user by ID"));
			}
			else {
				action(null, user);
			}
		});
	};
};

module.exports = new UserService();
