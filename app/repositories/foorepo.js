// Repository pattern for FooCDN

var hostname = "foocdn.azurewebsites.net"

// returns a cookie-cutter callback closure
var request_callback = function(action) {
    return function(err,data) {
        if (err) {
            action(err, null);
        } else {
            action(null, data);
        }
    }
}

var FooRepo = function() {
    // http://geddyjs.org/reference#utilities_request

    // Returns the binary content associated with provided blob identifier
    this.get_content = function(blobId, action) {
        var endpoint = '/api/content/{0}'.format(blobId)
        geddy.request(
            {
                url:'http://{0}{1}'.format(hostname, endpoint),
                method:'GET'
            },
            request_callback(action)
        );
    };

    // Stores the binary content from the multi-part form data contents of the
    // request body in the storage location associated with the provided blob identifier
    this.set_content = function(blobId, content, action) {
        var endpoint = '/api/content/{0}'.format(blobId)
        geddy.request(
            {
                url:'http://{0}{1}/'.format(hostname, endpoint),
                method:'POST'
            },
            request_callback(action)
        );
    };

    // Moves the content for the provided blob identifier to the specified
    // storage location
    this.move_content = function(blobID, locationType, action) {
        // locationType: (MEMCACHE | DISK | TAPE)

        var endpoint = '/api/content/{0}'.format(blobId)
        geddy.request(
            {
                url:'http://{0}{1}/'.format(hostname, endpoint),
                method:'PUT',
                data:'?type={0}'.format(locationType)
            },
            request_callback(action)
        );
    };

    // Deletes the content item and associated binary data for the provided blob
    // identifier
    this.delete_content = function(blobId, action) {
        var endpoint = '/api/content/{0}'.format(blobId)
        geddy.request(
            {
                url:'http://{0}{1}/'.format(hostname, endpoint),
                method:'DELETE'
            },
            request_callback(action)
        );
    };

    // Returns the information bundle for the provided blob identifier 
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
        
        var endpoint = '/api/content/{0}/info'.format(blobId)
        geddy.request(
            {
                url:'http://{0}{1}/'.format(hostname, endpoint),
                method:'GET'
            },
            request_callback(action)
        );
    };

    this.create_container = function(accountKey, mimeType, action) {
        // POST /api/content/new
        // Creates a new container and blob identifier into which content can be
        // stored and retrieved 
        
        // Example Request Body: {"Account Key":"000-000-0000", "MimeType":"image/jpg"} 
        // Response: 3a39c0ef-7f37-475f-a2f4-d7ea19a31081
        
        var endpoint = '/api/content/add'
        geddy.request(
            {
                url:'http://{0}{1}/'.format(hostname, endpoint),
                method:'POST',
                data:{
                    "Account Key":accountKey,
                    "MimeType":mimeType
                }
                // geddy reference says data should be a string, but FooCDN
                // implies it should be JSON
            },
            request_callback(action)
        );
    }

};

module.exports = new FooRepo();
