// Repository pattern for FooCDN

var sprintf = require("sprintf-js").sprintf;

var FooRepo = function() {
    // http://geddyjs.org/reference#utilities_request

    // Returns the binary content associated with provided blob identifier
    this.get_content = function(blobId, action) {
        var endpoint = sprintf('/api/content/%s', blobId);
        geddy.request(
            {
                url: this._format_url(endpoint),
                method:'GET'
            },
            action
        );
    };

    // Stores the binary content from the multi-part form data contents of the
    // request body in the storage location associated with the provided blob identifier
    //TODO: untested
    this.set_content = function(blobId, content, action) {
        var endpoint = sprintf('/api/content/%s', blobId);
        geddy.request(
            {
                url: this._format_url(endpoint),
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

        var endpoint = sprintf('/api/content/%s', blobId);
        geddy.request(
            {
                url: this._format_url(endpoint),
                method: 'PUT',
                data: '?type={0}'.format(locationType)
            },
            action
        );
    };

    // Deletes the content item and associated binary data for the provided blob
    // identifier
    //TODO: untested
    this.delete_content = function(blobId, action) {
        var endpoint = sprintf('/api/content/{0}', blobId);
        geddy.request(
            {
                url: this._format_url(endpoint),
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
        
        var endpoint = sprintf('/api/content/{0}/info', blobId);
        geddy.request(
            {
                url: this._format_url(endpoint),
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
        
        var endpoint = '/api/content/add';
        geddy.request(
            {
                url: this._format_url(endpoint),
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

// "static" method to piece together a content url given an endpoint
FooRepo.prototype._format_url = function(endpoint) {
    return sprintf('http://%s%s/', this.hostname, endpoint);
}

module.exports = new FooRepo();
