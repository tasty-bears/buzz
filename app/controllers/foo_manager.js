var FooManager = function () {

  this.index = function (req, resp, params) {
    var opts = {
          format: 'html'
        , template: 'app/views/foomanager/index'
        };
    this.respond(null, opts);
  };

};

exports.FooManager = FooManager;
