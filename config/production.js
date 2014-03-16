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
  appName: 'Angora'
, detailedErrors: false
, hostname: 'localhost'
, port: 4000

, email_activation: false
/*
, email_activation: true
, mailer: {
    fromAddressUsername: 'noreply'
  , transport: {
      type: 'smtp'
    , options: {
        host: 'smtp.gmail.com'
      , secureConnection: true // use SSL
      , port: 465 // port for secure SMTP
      , auth: {
          user: 'process.env.EMAIL_USER'
        , pass: 'process.env.EMAIL_PASS'
        }
      }
    }
  }
*/

, model: {
    defaultAdapter: 'mongo'
  }
, db: {
    mongo: {
      username: process.env.MONGO_USER
    , dbname: process.env.MONGO_NAME
    , prefix: null
    , password: process.env.MONGO_PASS
    , host: process.env.MONGO_HOST
    , port: process.env.MONGO_PORT
    }
  }
};

module.exports = config;


