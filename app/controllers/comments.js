var Comments = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

    this.index = function (req, resp, params) {
    this.respond({params: params});
    };

    this.addComment = function(req, resp, params) {
        var self = this;
        postservice.findPostById(params['addPost'], function(err, post) {
            if (err) {
                console.log("Error getting the Post");
            } else {
                params['commentdate'] = new Date();
                var post = geddy.model.Comment.create(params);

                postservice.addCommentToPost(post, comment, function(err, comment) {
                    self.refreshComments();
                });
            }
        });
    };

    this.refreshComments = function(req, resp, params) {
        var self = this;
        userservice.loadUserFromSession(self.session, function(err, user) {
            user.getEvents(function(err, events) {
                var selectedEvent = -1;
                eventservice.getPostsToDisplay(events, selectedEvent, function(err, posts) {
                    if (err) {
                        // TODO do something with err
                    } else {
                        var selectedPost = -1;
                        postservice.getCommentsToDisplay(posts, selectedPost, function(err, comments) {
                            if (err) {
                                // TODO do something with err
                            } else {
                                self.respond({params: params, events: events, posts: posts, comments: comments, selectedEvent: selectedEvent, selectedPost: selectedPost}, {
                                    format: 'html'
                                    , template: 'app/views/main/_postView'
                                    , layout: false
                                });
                            }
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

exports.Comments = Comments;
