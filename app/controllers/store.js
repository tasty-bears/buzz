var formidable = require('formidable')
  , fs = require('fs')
  , path = require('path');
var util = require('util');

var Store = function () {

  this.index = function (req, resp, params) {
    var data = {
          // Pass the filename down, if this is a redirect from upload
          uploadedFile: params.uploaded_file
        }
      , opts = {
          format: 'html'
        , template: 'app/views/store/index'
        };
    this.respond(data, opts);
  };

  this.upload = function (req, resp, params) {
    var self = this
      , form = new formidable.IncomingForm()
      , filename
      , fileStream;

    // Handle each part of the multi-part post
    form.onPart = function (part) {
      // Handle each data chunk as data streams in
      part.addListener('data', function (data) {
        // Initial chunk, set the filename and create the FS stream
        if (!fileStream) {
          filename = encodeURIComponent(part.filename);
          fileStream = fs.createWriteStream(path.join('public', 'store', 'uploads', filename));
        }
        // Write each chunk to disk
        fileStream.write(data);
      });

      // The part is done
      part.addListener('end', function () {
        // woops, looks like we were't given a file
        if (!filename) {
          self.flash.error('Please select a file to upload.');
          self.redirect('/store');
          return;
        }

        // If everything went well, close the FS stream
        if (fileStream) {
          fileStream.end();
        }
        // Something went wrong
        else {
          var err = new Error('Something went wrong in the upload.');
          self.error(err);
        }
      });
    };

    // Multi-part form is totally done, redirect back to index
    // and pass filename
    form.addListener('end', function () {
      // woops, looks like we were't given a file
      if (!filename) {
        self.flash.error('Please select a file to upload.');
        self.redirect('/store');
        return;
      }

      // javascript is bad with multiline strings :(
      self.flash.success(
        util.format('Successfully uploaded ' +
                    '<a style="text-decoration: underline"' +
                    ' href="/store/uploads/%s">%s</a>',
                filename, filename))
      //self.redirect('/store?uploaded_file=' + filename);
      self.redirect('/store');
    });

    // Do it
    form.parse(req);
  };
};

exports.Store = Store;
