var PostService = function() {
	var userservice = require('../services/userservice');
	var eventservice = require('../services/eventservice');
	var mediaservice = require('../services/mediaservice');

	this.create = function(params, action) {
		var self = this
		, media;
		
		if (!params.media) {
			media = {
				mimeType: null,
				hostname: null,
				blobId: null
			};
		}
		
		var data = {
			content: params.content,
			timestamp: params.timestamp,
			author: params.author,
			media: params.media
		};
				
        var post = geddy.model.Post.create(data);
		
		if (post.media) {
			post.mediaLink = mediaservice.get_content_url(post.media);
		} else {
			post.mediaLink = 'No media';
		}

        // save calls isValid, will throw err if false
        post.save(function(err, data) {
            if (err) {
              action(err, null);
            }
        });
						
		// TODO implement post hasOne media...fuck bugs
		// // check that media is present; if so, add the media object to the post
		// // post hasOne media
		// if (params.media) {
		// 	media = params.media;
		// 	post.setMedia(media);
		// 	post.save(function(err, data) {
		// 		if (err) {
		// 			action(err, null);
		// 		}
		// 	});
		// 	console.log(post);
		// 	console.log(media);
		// 	console.log('---');
		// 	var temp = post.getMedia();
		// 	console.log(temp);
		// }
		
		action(null, post);
	}

	this.findPostById = function(postId, action) {
		geddy.model.Post.first({id: postId}, function(err, post) {
			if (err || !post) {
				action({post: 'The post was not found'}, null);
			} else {
				action(null, post);
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
	
	// this.addCommentToPost = function(postModel, commentModel, action) {
	// 	var self = this;
	// 	postModel.addComment(commentModel);
	// 	postModel.save(function(err, data) {
	// 		if (err) {
	// 			action(err, null);
	// 		} else {
	// 			action(null, data);
	// 		}
	// 	});
	// };
	
	// this.getCommentsToDisplay = function(posts, selectedPost, action) {
	// 	var comments = new Array();
	// 
	// 	// TODO make this like getPostsToDisplay
	// 	if (selectedPost != -1) {
	// 		for (var i = 0, len = posts.length; i < len; i++) {
	// 			if (posts[i].id == selectedPost) {
	// 				posts = [posts[i]];
	// 				break;
	// 			}
	// 		}
	// 	}
	// 
	// 	// iterate through comments in a post
	// 	(function() {
	// 		if (feeds.length > 0) {
	// 			for (var i = 0, len1 = posts.length; i < len1; i++) {
	// 				(function() {
	// 					posts[i].getComments(function(err, postComments) {
	// 						if (err) {
	// 							action(err, null);
	// 						} else {
	// 							comments = comments.concat(postComments);
	// 							if (i == len1-1) {
	// 								comments.sort(function(a,b) {
	// 									if (a.postdate.getTime() > b.post.getTime()) {
	// 										return -1;
	// 									} else if (a.postdate.getTime() < b.postdate.getTime()) {
	// 										return 1;
	// 									} else {
	// 										return 0;
	// 									}
	// 								});
	// 
	// 								(function() {
	// 									var unpacked = new Array();
	// 									for (var j = 0, len2 = comments.length; j < len2; j++) {
	// 										var comment = comments[j];
	// 
	// 										comment.getPost(function(err, post) {
	// 											post.getEvent(function(err, event) {
	// 												event.getUser(function(err, user) {
	// 													comment.author = owner ? owner : {name: "No Author"};
	// 													comment.post = post;
	// 													unpacked.push(comment);
	// 													if (j == len2-1) {
	// 														action(null, unpacked);
	// 													}
	// 												});
	// 											});
	// 										});
	// 									}
	// 									action(null, comments);
	// 								}());
	// 							}
	// 						}
	// 					});
	// 				}());
	// 			}
	// 		} else {
	// 			action(null, []);
	// 		}
	// 	}());
	// };
};

module.exports = new PostService();
