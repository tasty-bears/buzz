var Post = function () {

  this.defineProperties({
    // we will want to query for posts primarily by their datetime
    timestamp: {type: 'datetime', required: true},
    locationDescription: {type: 'string'},
    locationLat: {type: 'number'},
    locationLong: {type: 'number'},
    // querying by posting user will also be important
    postingUser: {type: 'object', required: true},
    comments: {type: 'object'},
    // is the post natively created in Buzz, or pulled in from Twitter/Facebook?
    nativePost: {type: 'boolean', required: true}
  });

  // each post is associated with one event
  this.belongsTo('Event');
  // each event may have many posts
  this.hasMany('Comment');

  //? is this correct
  this.validatesPresent('postingUser');

  // returns the name of event that the post belongs to
  this.getEventName = function () {
    var self = this;
    var name = null;
    // searches all events for event that the post belongs to
    geddy.model.Event.first(self.eventId, function(err, event) {
      if (err) {
        throw err;
      }
      // assign name of event to variable name
      name = event.name;
    });
    // returns event's name
    return name;
  };

  // returns the dateTime of the event that the post belongs to
  this.getEventDateTime = function () {
    var self = this;
    var dateTime = null;
    // search all events for the event that the post belongs to
    geddy.model.Event.first(self.eventId, function(err, event) {
      if (err) {
        throw err;
      }
      // assign dateTime of event to dateTime
      dateTime = event.dateTime;
    });
    // return event's dateTime
    return name;
  }

  // TODO write method to add comment to post
  // comment will have text and associated posting user

  // TODO write method to somehow associate file with post

};

exports.Post = Post;
//? TODO register
