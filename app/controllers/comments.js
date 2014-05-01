var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var postservice = require('../services/postservice');
var async = require('async');

var Comments = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
	    this.respond({params: params});
    };

	// add a new comment
    this.add = function(req, resp, params) {
        var self = this
        , uId = this.session.get('userId')
        , pId = params.postId
        , author = null
		      // the post the comment belongs to
        , currentPost = null;

		  // determine the authoring user
      var _getUser = function (callback) {
        userservice.findUserById(uId, function(err, user) {
            if (err) {
                throw err;
            } else {
                author = user;
            }
            callback(err);
        });
      }

		  // find the post the comment belongs to
      var _getPost = function (callback) {
        postservice.findPostById(pId, function(err, post) {
            if (err) {
                throw err;
            } else {
                currentPost = post;
            }
            callback(err);
        });
      }


		  // comment creation members
      var _createCommentParams = function (callback) {
        var commentParams = {
            author: param.content,
            timestamp: new Date(),
            author: author
        };
        callback(null, commentParams);
      }


		  // create the new comment
      var _createComment = function (callback) {
        commentservice.create(commentParams, function(err, comment) {
          // add the new comment to the appropriate post
          postservice.addComment(currentPost, comment, function(err, comment) {
            callback(err);
          });
        });
      }

      async.waterfall([_getUser,_getPost,_createCommentParams,_createComment],function(err) {
        if (err) {
            throw err;
        } else {
            params.post = currentPost;
  // "refresh" the comments to display the new comment
            self.transfer('index');
        }
      });

    };

    // this.create = function (req, resp, params) {
    //     // Save the resource, then display index page
    //     this.redirect({controller: this.name});
    // };

    // this.show = function (req, resp, params) {
    //     this.respond({params: params});
    // };

    // this.edit = function (req, resp, params) {
    //     this.respond({params: params});
    // };

    // this.update = function (req, resp, params) {
    //     // Save the resource, then display the item page
    //     this.redirect({controller: this.name, id: params.id});
    // };

    // this.remove = function (req, resp, params) {
    //     this.respond({params: params});
    // };

};

exports.Comments = Comments;
