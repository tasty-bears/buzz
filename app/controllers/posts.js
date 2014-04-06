var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');

var Posts = function () {	
    this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
        var self = this;
        var event = params.event;
        
        geddy.log.debug(params);

        eventservice.getPostsToDisplay(event, function(err, posts) {
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
                params.event = currentEvent;
                self.transfer("index");
			}
		});
	};

    this.show = function(req, resp, params) {
        geddy.log.debug("why am i here");
    }

    // this.create = function (req, resp, params) {
    // // Save the resource, then display index page
    // this.redirect({controller: this.name});
    // };

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
