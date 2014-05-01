var async = require('async');

var CommentService = function() {
	var userservice = require('../services/userservice');
	var eventservice = require('../services/eventservice');
	var postservice = require('../services/postservice');

	// comment creation function
	this.create = function(params, action) {
		var self = this;

		// comment data members for comment creation
		var data = {
			author: params.author,
			timestamp: params.timestamp,
			content: params.content
		};

		// create the new comment
	  var comment = geddy.model.Comment.create(data);

		// save calls isValid, will throw err if false
		comment.save(function(err, data) {
		   if (err) {
		     action(err, null);
		   }
			action(null, post);
		});

		// TODO set comment belongsTo post relationship
		// comment.setPost(comment, post, function(err, comment) {
		// 	if (err) {
		// 		throw err;
		// 	} else {
		// 		console.log(comment.getPost());
		// 	}
		// });


	}

	// find a comment based on its ID
	this.findCommentById = function(commentId, action) {
		geddy.model.Comment.first({id: commentId}, function(err, comment) {
			if (err || !comment) {
				action({comment: 'The comment was not found'}, null);
			} else {
				action(null, comment);
			}
		});
	};

	// compare by timestamp
	this.compare = function(a,b) {
		if (a.timestamp.getTime() > b.timestamp.getTime()) {
			return -1;
		} else if (a.timestamp.getTime() < b.timestamp.getTime()) {
			return 1;
		} else {
			return 0;
		}
	}
}
