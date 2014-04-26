// Repository pattern for FooCDN

var format = require('util').format;

var FooRepo = function() {
    // http://geddyjs.org/reference#utilities_request

    // Returns the binary content associated with provided blob identifier
    this.get_content = function(blobId, callback) {
        
        geddy.request(
            {
                url: this.get_content_url(blobId),
                method:'GET'
            },
            callback
        );
    };

    // Stores the binary content from the multi-part form data contents of the
    // request body in the storage location associated with the provided blob identifier
    //TODO: untested
    this.set_content = function(blobId, content, callback) {
        geddy.request(
            {
                url: this.set_content_url(blobId),
                method: 'POST',
                data: content
            },
            callback
        );
    };

    // Moves the content for the provided blob identifier to the specified
    // storage location
    //TODO: untested
    this.move_content = function(blobId, locationType, callback) {
        // locationType: (MEMCACHE | DISK | TAPE)

        var url = this.move_content_url(blobId)
        var params = format('type=%s', locationType);
        geddy.request(
            {
                url: url + '?' + params,
                method: 'PUT'
            },
            callback
        );
    };

    // Deletes the content item and associated binary data for the provided blob
    // identifier
    //TODO: untested
    this.delete_content = function(blobId, callback) {
        geddy.request(
            {
                url: this.delete_content_url(blobId),
                method: 'DELETE'
            },
            callback
        );
    };

    // Returns the information bundle for the provided blob identifier 
    //TODO: untested
    this.get_content_info = function(blobId, callback) {
        // Example Response: {
        //    "ID":7,
        //    "BlobID":"3a39c0ef-7f37-475f-a2f4-d7ea19a31081",
        //     "BlobSize":546189,
        //     "MimeType":"image/jpg",
        //     "Account":{
        //         "Id":1,
        //         "Key":"F4LH-8KFS-42NB-9HJZ",
        //         "Name":"Test Account"
        //     },
        //     "Created":"2014-02-10T14:51:39.717",
        //     "Location":0,
        //     "Deleted":false,
        //     "DeletedOn":null
        // }

        var jsonCallback = function(err, data) {
            if(err) {
                callback(err, data);
            }
            else {
                callback(err, JSON.parse(data));
            }
        }
        
        geddy.request(
            {
                url: this.get_content_info_url(blobId),
                method: 'GET'
            },
            jsonCallback
        );
    };

    //TODO: untested
    this.create_container = function(accountKey, mimeType, callback) {
        // POST /api/content/new
        // Creates a new container and blob identifier into which content can be
        // stored and retrieved
        
        // Example Request Body: {"Account Key":"000-000-0000", "MimeType":"image/jpg"} 
        // Response: 3a39c0ef-7f37-475f-a2f4-d7ea19a31081
        
        geddy.request(
            {
                url: this.create_container_url(),
                method: 'POST',
                data: {
                    "Account Key": accountKey,
                    "MimeType": mimeType
                }
                // geddy reference says data should be a string, but FooCDN
                // implies it should be JSON
            },
            callback
        );
    }

};

FooRepo.prototype.hostname = "foocdn.azurewebsites.net";

// urls
FooRepo.prototype.get_content_url =
FooRepo.prototype.set_content_url =
FooRepo.prototype.move_content_url =
FooRepo.prototype.delete_content_url = function(blobId) {
    return this._format_url(blobId, null);
}
FooRepo.prototype.get_content_info_url = function(blobId) {
    return this._format_url(blobId, "info");
}
FooRepo.prototype.create_container_url = function() {
    return this._format_url(null, "add");
}

// "static" method to piece together a content url given an endpoint
FooRepo.prototype._format_url = function(blobId, suffix) {
    var apiPath = "/api/content/"
    return format('http://%s%s%s%s',
                  this.hostname,
                  apiPath,
                  blobId ? (blobId + '/') : '',
                  suffix ? (suffix + '/') : ''
                  );
}

//TODO: make a test!
// console.log(FooRepo.prototype.get_content_url('1234'));
// console.log(FooRepo.prototype.set_content_url('1234'));
// console.log(FooRepo.prototype.move_content_url('1234'));
// console.log(FooRepo.prototype.delete_content_url('1234'));
// console.log(FooRepo.prototype.get_content_info_url('1234'));
// console.log(FooRepo.prototype.create_container_url());

module.exports = new FooRepo();
