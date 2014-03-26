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
		var eId = params.id;
		var currentEvent = null;

		userservice.findUserById(uId, function(err, user) {
			if (err) {
				console.log("Error getting the User");
			} else {
				params.author = user;
			}
		});
		
	    geddy.model.Event.first(eId, function (err, event){
	      if (err){
			console.log("error getting the event");
	        throw err;
	      } else {
		      currentUser = event;
			  params.timestamp = new Date();
		  }
	    });
		
        eventservice.findEventById(eId, function(err, event) {
        	if (err) {
                console.log("Error getting the Event");
            } else {
                params.timestamp = new Date();
                var post = geddy.model.Post.create(params);

                eventservice.addPostToEvent(event, post, function(err, post) {
                    self.refreshPosts();
                });
            }
        });
    };

    this.refreshPosts = function(req, resp, params) {
		var self = this;
        userservice.loadUserFromSession(self.session, function(err, user) {
            user.getEvents(function(err, events) {
                var selectedEvent = -1;
                eventservice.getPostsToDisplay(events, selectedEvent, function(err, posts) {
                    if (err) {
                        // TODO do something with err
                    } else {
                        self.respond({params: params, events: events, posts: posts, selectedEvent: selectedEvent}, {
                            format: 'html'
                            , template: 'app/views/main/_postView'
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
