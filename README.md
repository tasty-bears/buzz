Tasty Development Group
=========================
Angora Social Media
Web Application


Alpha Release Notes
-------------------

###Functionality###
* Create a new user and log in
* Login with Twitter and Facebook is not yet fully supported
* View basic user profile information and log out
* Create and view courses
* Create events, assign to courses, and view existing events

###Known Issues###
* __running Geddy app on Windows does not build__
* We set up Mocha as our testing framework, but have had issues integrating Mocha tests with Geddy
* Trying to run Geddy in production mode produces no errors but hangs on creating the worker process

###Building Angora###
1. Run build/dev.sh for development environment
1. In web directory, run 'geddy'
1. In browser, visit http://localhost:4000
