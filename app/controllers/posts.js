var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var postservice = require('../services/postservice');
var mediaservice = require('../services/mediaservice');

var Posts = function () {
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        var self = this;
        
        eventservice.findEventById(params.id,
            function(err, event) {
				// refresh all posts belonging to the event
				// sort newest to oldest
                eventservice.getPostsToDisplay(event, function(err, posts) {
                    posts.sort(postservice.compare);
                    self.respond(
                        {event: event, posts: posts},
                        {layout: false}
                    );
                });
            }
        );
    };

    this.add = function(req, resp, params) {
		var self = this;
		var uId = this.session.get('userId');
		var eId = params.eventId;
		var author;
		var currentEvent = null;
		var media;
		
		// TODO use loadUserFromSession
		// load the user by whom the new post will be authored by 
		userservice.findUserById(uId, function(err, user) {
			if (err) {
				throw err;
			} else {
				 author = user;
			}
		});
		
		// locate the target event to add the new post to based on its id
		eventservice.findEventById(eId, function(err, event) {
            if (err) {
                throw err;
            } else {
                currentEvent = event;
            }
        });

		// if user attached media, create the new media object based on the ajax'd params
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
		
		// these will be used to create the new post
		var data = {
			content: params.content,
			timestamp: new Date(),
			author: author,
			// if media exists, it will be set as the new post's media
			media: media
		};

		// create the new post
		postservice.create(data, function(err, post) {
			// add the new post to the event
			eventservice.addPost(currentEvent, post, function(err, post) {
    			if (err) {
    				throw err;
    			} else {
                    self.params = currentEvent;
					// "refresh" posts to display the new post
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
