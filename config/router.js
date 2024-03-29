/*
 * Geddy JavaScript Web development framework
 * Copyright 2112 Matthew Eernisse (mde@fleegix.org)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
*/


var router = new geddy.RegExpRouter();

// Basic routes
// router.match('/moving/pictures/:id', 'GET').to('Moving.pictures');
//
// router.match('/farewells/:farewelltype/kings/:kingid', 'GET').to('Farewells.kings');
//
// Can also match specific HTTP methods only
// router.get('/xandadu').to('Xanadu.specialHandler');
// router.del('/xandadu/:id').to('Xanadu.killItWithFire');
//
// Resource-based routes
// router.resource('hemispheres');
//
// Nested Resource-based routes
// router.resource('hemispheres', function(){
//   this.resource('countries');
//   this.get('/print(.:format)').to('Hemispheres.print');
// });

// root
router.get('/').to('Main.index');
router.get('/login').to('Main.login');
router.get('/logout').to('Main.logout');

// authentication
router.post('/auth/local').to('Auth.local');
router.get('/auth/twitter').to('Auth.twitter');
router.get('/auth/twitter/callback').to('Auth.twitterCallback');
router.get('/auth/facebook').to('Auth.facebook');
router.get('/auth/facebook/callback').to('Auth.facebookCallback');

// resources
router.resource('users');
router.resource('events');
router.resource('courses');
router.resource('medias');
router.resource('posts');

// media upload
router.match('/stash').to({controller: 'Stash', action: 'index'});
router.match('/stash/:action').to({controller: 'Stash', action: ':action'});

// foo manager
router.match('/foo').to({controller: 'FooManager', action: 'index'});
router.match('/foo/:action').to({controller: 'FooManager', action: ':action'});

// general / fallback
router.match('/:controller/:action').to({controller: ':controller', action: ':action'});
router.match('/:controller').to({controller: ':controller', action: 'index'});

exports.router = router;
