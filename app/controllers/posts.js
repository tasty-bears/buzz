var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var postservice = require('../services/postservice');
var mediaservice = require('../services/mediaservice');

var Posts = function () {	
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        var self = this;
        var event = params.event;

        eventservice.getPostsToDisplay(event, function(err, posts) {
            posts.sort(postservice.compare);
            self.respond({event: event, posts: posts});
        });
    };

    this.add = function(req, resp, params) {
		var self = this;
		var uId = this.session.get('userId');
		var eId = params.eventId;
		var author;
		var currentEvent = null;
		var media;
		
		// TODO use loadUserFromSession
		userservice.findUserById(uId, function(err, user) {
			if (err) {
				throw err;
			} else {
				 author = user;
			}
		});
		
		eventservice.findEventById(pId, function(err, event) {
            if (err) {
                throw err;
            } else {
                currentEvent = event;
            }
        });

		if (params.mediaData) {
			mediaservice.create(params.mediaData, function(err, postMedia) {
				if (err) {
					throw err;
				} else {
					media = postMedia;
				}
			});
		} 
		// if no media data, no media
		else {
			media = null;
		}

		var data = {
			// these will be used to create the new post
			content: params.content,
			timestamp: new Date(),
			author: author,
			// if media exists, it will be set as the new post's media
			media: media
		};
				
		postservice.create(data, function(err, post) {
			eventservice.addPost(currentEvent, post, function(err, post) {
    			if (err) {
    				throw err;
    			} else {
                    params.event = currentEvent;
                    self.transfer("index");
    			}
    		});
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
