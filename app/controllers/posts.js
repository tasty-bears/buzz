var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');

var Posts = function () {	
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        this.respond({params: params});
    };

    this.addPost = function(req, resp, params) {
		var self = this;
		var uId = this.session.get('userId');
		var eId = params.eventId;
		var author;
		var currentEvent = null;
		
		// use loadUserFromSession
		
		userservice.findUserById(uId, function(err, user) {
			if (err) {
				console.log("Error getting the User");
			} else {
				 author = user;
			}
		});
		
		// TODO eventservice.findEventById
		
	    geddy.model.Event.first(eId, function (err, event){
	      if (err){
			console.log("error getting the event");
	        throw err;
	      } else {
		      currentEvent = event;
		  }
	    });
						
		var data = {
			content: params.content,
			timestamp: new Date(),
			author: author
		};
		
		var post = geddy.model.Post.create(data);
				
		post.save(function(err, data) {
			if (err) {
				throw err;
			}
		});
						
		eventservice.addPostToEvent(currentEvent, post, function(err, post) {
			if (err) {
				throw err;
			}
			else {
				self.refreshPosts(currentEvent);
			}
		});
	};

    this.refreshPosts = function(event, req, resp, params) {
		console.log("refreshing posts\n");
		var self = this;
        userservice.loadUserFromSession(self.session, function(err, user) {			
			// TODO in show.html.ejs:
			// only show event button if event's user = current user
				
            user.getEvents(function(err, events) {
                var selectedEvent = -1;
                eventservice.getPostsToDisplay(events, selectedEvent, function(err, posts) {
                    if (err) {
                        console.log("err getting posts to display");
                    } else {
                        self.respond({params: params, event: event, events: events, posts: posts}, {
                            format: 'html'
                            , template: 'app/views/events/_postView'
                            , layout: false
                        });
                    }
                });
            });
        });
    };

//  this.add = function (req, resp, params) {
//    this.respond({params: params});
//  };

    this.create = function (req, resp, params) {
    // Save the resource, then display index page
    this.redirect({controller: this.name});
    };

    this.show = function (req, resp, params) {
    this.respond({params: params});
    };

    this.edit = function (req, resp, params) {
    this.respond({params: params});
    };

    this.update = function (req, resp, params) {
    // Save the resource, then display the item page
    this.redirect({controller: this.name, id: params.id});
    };

    this.remove = function (req, resp, params) {
    this.respond({params: params});
    };
};

exports.Posts = Posts;
