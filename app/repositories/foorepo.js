// Repository pattern for FooCDN

var format = require('util').format;

var FooRepo = function() {
    // http://geddyjs.org/reference#utilities_request

    // Returns the binary content associated with provided blob identifier
    this.get_content = function(blobId, action) {
        
        geddy.request(
            {
                url: this.get_content_url(blobId),
                method:'GET'
            },
            action
        );
    };

    // Stores the binary content from the multi-part form data contents of the
    // request body in the storage location associated with the provided blob identifier
    //TODO: untested
    this.set_content = function(blobId, content, action) {
        geddy.request(
            {
                url: this.set_content_url(blobId),
                method: 'POST'
            },
            action
        );
    };

    // Moves the content for the provided blob identifier to the specified
    // storage location
    //TODO: untested
    this.move_content = function(blobID, locationType, action) {
        // locationType: (MEMCACHE | DISK | TAPE)

        geddy.request(
            {
                url: this.move_content_url(blobId),
                method: 'PUT',
                data: format('?type=%s', locationType)
            },
            action
        );
    };

    // Deletes the content item and associated binary data for the provided blob
    // identifier
    //TODO: untested
    this.delete_content = function(blobId, action) {
        geddy.request(
            {
                url: this.delete_content_url(blobId),
                method: 'DELETE'
            },
            action
        );
    };

    // Returns the information bundle for the provided blob identifier 
    //TODO: untested
    this.get_content_info = function(blobId, action) {
        // Example Response: {
        //    "ID":7,
        //    "BlobID":"3a39c0ef-7f37-475f-a2f4-d7ea19a31081",
        //     "BlobSize":546189,"MimeType":"image/jpg",
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
        
        geddy.request(
            {
                url: this.get_content_info_url(blobId),
                method: 'GET'
            },
            action
        );
    };

    //TODO: untested
    this.create_container = function(accountKey, mimeType, action) {
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
            action
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
