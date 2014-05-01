var async = require('async');

var PostService = function() {
	var userservice = require('../services/userservice');
	var eventservice = require('../services/eventservice');
	var mediaservice = require('../services/mediaservice');

	// post creation function
	this.create = function(params, action) {
		var self = this
		, media;

		// if post has no attached media, null media object's members
		if (!params.media) {
			media = {
				mimeType: null,
				hostname: null,
				blobId: null
			};
		}

		// these will be used the new post's data members
		var data = {
			content: params.content,
			timestamp: params.timestamp,
			author: params.author,
			media: params.media
		};

		// create the new post object
    var post = geddy.model.Post.create(data);

		// save the new post + its media
    // save calls isValid, will throw err if false
    post.save(function(err, data) {
        if (err) {
          action(err, null);
        }
				action(null, post);
    });

	// TODO implement post hasOne media
	// if (params.media) {
	// 	post.setMedia(post, params.media, function(err, post) {
	// 		if (err) {
	// 			throw err;
	// 		} else {
	// 			console.log(post.getMedia());
	// 		}
	// 	});
	// }


	}

	// get a post based on its ID
	this.findPostById = function(postId, action) {
		geddy.model.Post.first({id: postId}, function(err, post) {
			if (err || !post) {
				action({post: 'The post was not found'}, null);
			} else {
				action(null, post);
			}
		});
	};

	// compare two posts by timestamp
	this.compare = function(a,b) {
		if (a.timestamp.getTime() > b.timestamp.getTime()) {
			return -1;
		} else if (a.timestamp.getTime() < b.timestamp.getTime()) {
			return 1;
		} else {
			return 0;
		}
	}

//	// Add a new comment to a post
// 	this.addComment = function(postModel, commentModel, action) {
// 		var self = this;
// 		postModel.addPost(commentModel);
// 		postModel.save(function(err, data) {
// 			if (err) {
// 				action(err, null);
// 			} else {
// 				action(null, data);
// 			}
// 		});
// 	};

//	// TODO implement this
//	// set a post's relationship with a media object
// 	this.setMedia = function(postModel, mediaModel, action) {
// 		var self = this;
// 		// post hasOne media
// 		postModel.setMedia(mediaModel);
// 		postModel.save(function(err, data) {
// 			if (err) {
// 				action(err, null);
// 			} else {
// 				action(null, data);
// 			}
// 		})
// 	}

	// get the relevant comments to display that belong to a specific post
	this.getCommentsToDisplay = function(post, action) {
		post.getComments(function(err, comments) {
			if (err) {
				action(err, null);
			} else {
				// add event attribute to each post(the view needs it I guess)
				// for (var i = 0; i < posts.length; i++) {
				// 	comments[i].getPost(function(err, post) {
				// 		comments[i].post = post;
				// 	});
				// }
				// async code below is the equivilant of this code block

				async.eachSeries(comments, function(comment, callback){
					comment.getPost(function(err,post){
						comment.post = post;
						callback(err);
					});
				}, function(err) {
					if (err) {
						action(err,null);
					}
					action(null, comments);
				});
			}
		});
	};

	// get all existing comments for display
	this.getAllCommentsToDisplay = function(posts, action) {
		var self = this;
		var comments = [];
		// foreach post, get each comment belonging to that post
		// for(var i in posts) {
		// 	this.getCommentsToDisplay(posts[i], function(err, data) {
		// 		comments.concat(data);
		// 	});
		// }
		// action(null, comments);
		//async block is the equivilant of this commented out code

		async.eachSeries(posts, function(post,callback) {
			self.getCommentsToDisplay(post, function(err, data) {
				comments.concat(data);
				callback(err);
			});
		}, function(err){
			if(err) {
				action(err,null);
			}
			action(null, comments);
		});
	};

	this.format_for_display = function(post, callback) {
		if(post.media) {
			mediaservice.format_for_display(post.media);
		}
	}
};

module.exports = new PostService();
