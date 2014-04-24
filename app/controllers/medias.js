var mediaService = require('../services/mediaservice');
var UserResponder = require('../helpers/responders').UserResponder;

var Medias = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];
  this.responder = new UserResponder(this);

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Media.all(function(err, medias) {
      if (err) {
        throw err;
      }
      self.respondWith(medias, {type:'Media'});
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    var self = this
      , media = geddy.model.Media.create(params);

    geddy.log.debug("Medias.create params: " + JSON.stringify(params));
    if (!media.isValid()) {
      this.respondWith(media);
    }
    else {
      media.save(function(err, data) {
        if (err) {
          throw err;
        }
        self.respondWith(media, {status: err});
      });
    }
  };

  this.show = function (req, resp, params) {
    var self = this;

    geddy.model.Media.first(params.id, function(err, media) {
      if (err) {
        throw err;
      }
      if (!media) {
        throw new geddy.errors.NotFoundError();
      }
      else {
        self.respondWith(media);
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Media.first(params.id, function(err, media) {
      if (err) {
        throw err;
      }
      if (!media) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        self.respondWith(media);
      }
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Media.first(params.id, function(err, media) {
      if (err) {
        throw err;
      }
      media.updateProperties(params);

      if (!media.isValid()) {
        self.respondWith(media);
      }
      else {
        media.save(function(err, data) {
          if (err) {
            throw err;
          }
          self.respondWith(media, {status: err});
        });
      }
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Media.first(params.id, function(err, media) {
      if (err) {
        throw err;
      }
      if (!media) {
        throw new geddy.errors.BadRequestError();
      }
      else {
        geddy.model.Media.remove(params.id, function(err) {
          if (err) {
            throw err;
          }
          self.respondWith(media);
        });
      }
    });
  };

};

exports.Medias = Medias;
