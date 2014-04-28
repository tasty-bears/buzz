var passport = require('../helpers/passport')
  , requireAuth = passport.requireAuth;
var courseservice = require('../services/courseservice');
var scheduleservice = require('../services/scheduleservice');
var eventservice = require('../services/eventservice');
var UserResponder = require('../helpers/responders').UserResponder;
var async = require('async');


var Connections = function () {

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.User.all(function(err, users) {
      self.respond({params: params, users: users});
    });
  };

    this.show = function (req, resp, params) {
    var self = this;

    geddy.model.User.first(params.id, function(err, user) {
      if (err) {
        throw err;
      }
      if (!user) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        user.password = '';
        self.respondWith(user);
      }
    });
  };

  // this.add = function (req, resp, params) {
  //   this.respond({params: params});
  // };

  // this.create = function (req, resp, params) {
  //   var self = this
  //     , user = geddy.model.User.create(params)
  //     , sha;

  //   // Non-blocking uniqueness checks are hard
  //   geddy.model.User.first({username: user.username}, function(err, data) {
  //     var activationUrl;
  //     if (err) {
  //       throw err;
  //     }
  //     if (data) {
  //       user.errors  = {
  //         username: 'This username is already in use.'
  //       };
  //       self.respondWith(user);
  //     }
  //     else {
  //       if (user.isValid()) {
  //         user.password = generateHash(user.password);

  //         if (EMAIL_ACTIVATION) {
  //           user.activationToken = generateHash(user.email);
  //         }
  //         else {
  //           user.activatedAt = new Date();
  //         }
  //         user.save(function(err, data) {
  //           var options = {}
  //             , mailOptions
  //             , mailCallback
  //             , mailHtml
  //             , mailText;

  //           if (err) {
  //             throw err;
  //           }

  //           if (EMAIL_ACTIVATION) {
  //             activationUrl = geddy.config.fullHostname + '/users/activate?token=' +
  //                 encodeURIComponent(user.activationToken);
  //             options.status = 'You have successfully signed up. ' +
  //                 'Check your e-mail to activate your account.';

  //             mailHtml = 'Welcome to ' + geddy.config.appName + '. ' +
  //                 'Use the following URL to activate your account: ' +
  //                 '<a href="' + activationUrl + '">' + activationUrl + '</a>.';
  //             mailText = 'Welcome to ' + geddy.config.appName + '. ' +
  //                 'Use the following URL to activate your account: ' +
  //                 activationUrl + '.';

  //             mailOptions = {
  //               from: geddy.config.mailer.fromAddressUsername + '@' +
  //                   geddy.config.hostname
  //             , to: user.email
  //             , subject: 'Welcome to ' + geddy.config.appName
  //             , html: mailHtml
  //             , text: mailText
  //             };
  //             mailCallback = function (err, data) {
  //               if (err) {
  //                 throw err;
  //               }
  //               self.respondWith(user, options);
  //             };
  //             geddy.mailer.sendMail(mailOptions, mailCallback);
  //           }

  //           else {
  //             self.respondWith(user);
  //           }
  //         });
  //       }
  //       else {
  //         self.respondWith(user, {status: err});
  //       }
  //     }
  //   });

  // };




  // this.edit = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (!user) {
  //       throw new geddy.errors.BadRequestError();
  //     }
  //     else {
  //       self.respondWith(user);
  //     }
  //   });
  // };

  // this.update = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     // Only update password if it's changed
  //     var skip = params.password ? [] : ['password'];

  //     user.updateAttributes(params, {skip: skip});

  //     if (!user.isValid()) {
  //       self.respondWith(user);
  //     }
  //     else {
  //       if (params.password) {
  //         user.password = generateHash(user.password);
  //       }

  //       user.save(function(err, data) {
  //         if (err) {
  //           throw err;
  //         }
  //         self.respondWith(user, {status: err});
  //       });
  //     }
  //   });
  // };

  // this.remove = function (req, resp, params) {
  //   var self = this;

  //   geddy.model.User.first(params.id, function(err, user) {
  //     if (err) {
  //       throw err;
  //     }
  //     if (!user) {
  //       throw new geddy.errors.BadRequestError();
  //     }
  //     else {
  //       geddy.model.User.remove(params.id, function(err) {
  //         if (err) {
  //           throw err;
  //         }
  //         self.respondWith(user);
  //       });
  //     }
  //   });
  // };

};

exports.Connections = Connections;
