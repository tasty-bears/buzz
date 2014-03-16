var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var userservice = require('../services/userservice');
var eventservice = require('../services/eventservice');


var Event = function () {

  this.addEvent = function(req, resp, params) {

    var self = this;
    userservice.loadUserFromSession(self.session, function(err, user) {
      var event = geddy.model.Event.create(params);
      eventservice.addEvent(user, event, function(err, events) {
        self.respond({params: params, events: events, selectedEvent: -1}, {
          format: 'html'
          , template: 'app/views/main/_eventView'
          , layout: false
        });
      });
    });
  };
}

exports.Event = Event;




// var Events = function () {
//   this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
//   this.before(requireAuth, {});

//   this.index = function (req, resp, params) {
//     var self = this;

//     geddy.model.Event.all({createdAt: {ne: null}}, {sort: {date: 'asc'}},function(err, events) {
//       if (err) {
//         throw err;
//       }
//       self.respond({events: events});
//     });
//   };

//   this.add = function (req, resp, params) {
//     var self = this;
//     geddy.model.Course.all(function (err, data) {
//       if (err) {
//         throw err;
//       }
//       self.respond({params: params, courses: data});
//     });
//   };

//   this.create = function (req, resp, params) {
//     var self = this
//       , event = geddy.model.Event.create(params);

//     if (!event.isValid()) {
//       this.respondWith(event);
//     }
//     else {
//       event.save(function(err, data) {
//         if (err) {
//           throw err;
//         }
//         self.respondWith(event, {status: err});
//       });
//     }
//   };

//   this.show = function (req, resp, params) {
//     var self = this;

//     geddy.model.Event.first(params.id, function(err, event) {
//       if (err) {
//         throw err;
//       }
//       if (!event) {
//         throw new geddy.errors.NotFoundError();
//       }
//       else {
//         self.respond({event: event});
//       }
//     });
//   };

//   this.edit = function (req, resp, params) {
//     var self = this;

//     geddy.model.Event.first(params.id, function(err, event) {
//       if (err) {
//         throw err;
//       }
//       if (!event) {
//         throw new geddy.errors.BadRequestError();
//       }
//       else {
//         geddy.model.Course.all(function (err, data) {
//           if (err) {
//             throw err;
//           }
//           self.respond({event: event, courses: data});
//         });
//       }
//     });
//   };

//   this.update = function (req, resp, params) {
//     var self = this;

//     geddy.model.Event.first(params.id, function(err, event) {
//       if (err) {
//         throw err;
//       }
//       event.updateProperties(params);

//       if (!event.isValid()) {
//         self.respondWith(event);
//       }
//       else {
//         event.save(function(err, data) {
//           if (err) {
//             throw err;
//           }
//           self.respondWith(event, {status: err});
//         });
//       }
//     });
//   };

//   this.remove = function (req, resp, params) {
//     var self = this;

//     geddy.model.Event.first(params.id, function(err, event) {
//       if (err) {
//         throw err;
//       }
//       if (!event) {
//         throw new geddy.errors.BadRequestError();
//       }
//       else {
//         geddy.model.Event.remove(params.id, function(err) {
//           if (err) {
//             throw err;
//           }
//           self.respondWith(event);
//         });
//       }
//     });
//   };

// };

// exports.Events = Events;



