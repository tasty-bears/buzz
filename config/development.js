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

var config = {
  appName: 'Buzz (development)'
, detailedErrors: true
, debug: true
, hostname: 'localhost' // set back to null?
                        // or leave to prevent dev on a prod environment?
, model: {
    defaultAdapter: 'filesystem'
  }
, sessions: {
    store: 'filesystem'
  , filename: '_session_store.json'
  , key: 'sid'
  , expiry: 14 * 24 * 60 * 60
  }
, email_activation: false
};

module.exports = config;
