var formidable = require('formidable')
  , fs = require('fs')
  , path = require('path');

var Media = function () {

  this.index = function (req, resp, params) {
    var data = {
          // Pass the filename down, if this is a redirect from upload
          uploadedFile: params.uploaded_file
        }
      , opts = {
          format: 'html'
        , template: 'app/views/media/index'
        };
    this.respond(data, opts);
  };

  this.upload = function (req, resp, params) {
    var self = this
      , form = new formidable.IncomingForm()
      , uploadedFile
      , savedFile;

    // Handle each part of the multi-part post
    form.onPart = function (part) {
      // Handle each data chunk as data streams in
      part.addListener('data', function (data) {
        // Initial chunk, set the filename and create the FS stream
        if (!uploadedFile) {
          uploadedFile = encodeURIComponent(part.filename);
          savedFile = fs.createWriteStream(path.join('public', 'media', 'uploads', uploadedFile));
        }
        // Write each chunk to disk
        savedFile.write(data);
      });
      // The part is done
      part.addListener('end', function () {
        var err;
        // If everything went well, close the FS stream
        if (uploadedFile) {
          savedFile.end();
        }
        // Something went wrong
        else {
          err = new Error('Something went wrong in the upload.');
          self.error(err);
        }
      });
    };

    // Multi-part form is totally done, redirect back to index
    // and pass filename
    form.addListener('end', function () {
      self.redirect('/media?uploaded_file=' + uploadedFile);
    });

    // Do it
    form.parse(req);
  };
};

exports.Media = Media;
