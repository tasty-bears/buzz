var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var postservice = require('../services/postservice');
var mediaservice = require('../services/mediaservice');
var async = require('async');

var Posts = function () {
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        var self = this;

        self._index(params, function(posts) {
          self.respondWith(
              posts,
              {layout: false}
          );
        });
    };

    this._index = function(params, callback) {
        var self = this;

        eventservice.findEventById(params.id,
            function(err, event) {
        // refresh all posts belonging to the event
        // sort newest to oldest
                eventservice.getPostsToDisplay(event, function(err, posts) {
                    posts.sort(postservice.compare);
                    callback(posts);
                });
            }
        );
    }

    this.add = function(req, resp, params) {
  		var self = this;
  		var uId = this.session.get('userId');
  		var eId = params.eventId;
  		var author;
  		var currentEvent = null;
  		var media;

  		// TODO use loadUserFromSession
  		// load the user by whom the new post will be authored by
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

  		// locate the target event to add the new post to based on its id
      var _getEvent = function (callback) {
        eventservice.findEventById(eId, function(err, event) {
          if (err) {
              throw err;
          } else {
              currentEvent = event;
          }
          callback(err);
        });
      }

  		// if user attached media, create the new media object based on the ajax'd params
      var _createMedia = function (callback) {
        if (params.mediaData) {
          mediaservice.create(params.mediaData, function(err, postMedia) {
            if (err) {
              throw err;
            } else {
              media = postMedia;
            }
            callback(err);
          });
        }
        // if no media data, no media
        else {
          media = null;
          callback(null);
        }
      }

  		// these will be used to create the new post
      var _setDataValues = function (callback) {
        var data = {
          content: params.content,
          timestamp: new Date(),
          author: author,
          // if media exists, it will be set as the new post's media
          media: media
        };
        callback(null,data);
      }

  		// create the new post
      var _createPost = function (data, callback) {
    		postservice.create(data, function(err, post) {
    			// add the new post to the event
    			eventservice.addPost(currentEvent, post, function(err, post) {
      	     callback(err);
      		});
        });
      }

      async.waterfall([_getUser,_getEvent,_createMedia,_setDataValues,_createPost],function(err) {
        if (err) {
          throw err;
        } else {
          self.params = currentEvent;
          // "refresh" posts to display the new post
          self.transfer("index");
        }
      });
  	};

    // this.show = function (req, resp, params) {
    // this.respond({params: params});
    // };

    // this.edit = function (req, resp, params) {
    // this.respond({params: params});
    // };

    // this.update = function (req, resp, params) {
    // // Save the resource, then display the item page
    // this.redirect({controller: this.name, id: params.id});
    // };

    // this.remove = function (req, resp, params) {
    // this.respond({params: params});
    // };
};

exports.Posts = Posts;
