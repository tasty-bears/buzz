
var UserService = function() {

	this.loadUserFromSession = function(session, action) {
		geddy.model.User.first(session.get('userId'), function(err, data) {
			action(null, data);
		});
	}
};

module.exports = new UserService();
