var fooRepo = require('../repositories/foorepo');

var FooService = function() {
    // do useful stuff with FooRepo calls
    
    this.get_mimeType = function(blobId, callback) {
        fooRepo.get_content_info(blobId, function(err, data) {
            if(err) {
                callback(err, data);
            }
            else {
                callback(null, data.MimeType);
            }
        });
    }

};

module.exports = new FooService();
