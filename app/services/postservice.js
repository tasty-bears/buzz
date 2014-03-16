
var PostService = function() {
	var userservice = require('../services/userservice');
	var eventservice = require('../services/eventservice');

	this.addPost = function(eventModel, postModel) {
		var self = this;
		eventModel.addPost(postModel);
		eventModel.save(function(err, data) {
			if (err) {
				action(err, null);
			} else {
				data.getPosts(function(err, data) {
					action(null, data);
				});
			}
		});
	};

	this.addCommentToPost = function(postModel, commentModel, action) {
		var self = this;
		postModel.addComment(commentModel);
		postModel.save(function(err, data) {
			if (err) {
				action(err, null);
			} else {
				action(null, data);
			}
		});
	};

	this.findPostById = function(postId, action) {
		geddy.model.Post.first({id: postId}, function(err, post) {
			if (err || !post) {
				// TODO : single or double quote here?
				action({post: 'The post was not found'}, null);
			} else {
				action(null, post);
			}
		});
	};

	this.getCommentsToDisplay = function(posts, selectedPost, action) {
		var comments = new Array();

		// TODO make this block its own function in the controller that calls
	    // getTweetsToDisplay
	    // that way it will be getTweetsToDisplay(feeds, action)
	    // will be called in posts.js and main.js
		if (selectedPost != -1) {
			for (var i = 0, len = posts.length; i < len; i++) {
				if (posts[i].id == selectedPost) {
					posts = [posts[i]];
					break;
				}
			}
		}

		// iterate through comments in a post
		(function() {
			if (feeds.length > 0) {
				for (var i = 0, len1 = posts.length; i < len1; i++) {
					(function() {
						posts[i].getComments(function(err, postComments) {
							if (err) {
								action(err, null);
							} else {
								comments = comments.concat(postComments);
								if (i == len1-1) {
									comments.sort(function(a,b) {
										if (a.postdate.getTime() > b.post.getTime()) {
											return -1;
										} else if (a.postdate.getTime() < b.postdate.getTime()) {
											return 1;
										} else {
											return 0;
										}
									});

									(function() {
										var unpacked = new Array();
										for (var j = 0, len2 = comments.length; j < len2; j++) {
											var comment = comments[j];

											comment.getPost(function(err, post) {
												post.getEvent(function(err, event) {
													event.getUser(function(err, user) {
														comment.author = owner ? owner : {name: "No Author"};
														comment.post = post;
														unpacked.push(comment);
														if (j == len2-1) {
															action(null, unpacked);
														}
													});
												});
											});
										}
										action(null, comments);
									}());
								}
							}
						});
					}());
				}
			} else {
				action(null, []);
			}
		}());
	};
};

module.exports = new PostService();
