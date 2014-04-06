var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');
var postservice = require('../services/postservice');

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
		
		postservice.create(data, function(err, post) {	
    		eventservice.addPost(currentEvent, post, function(err, post) {
    			if (err) {
    				throw err;
    			}
    			else {
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
