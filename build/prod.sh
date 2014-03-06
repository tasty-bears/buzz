#!/usr/bin/env bash

scriptdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# install packages
cd $scriptdir/..
sudo npm install geddy -g
npm install 

# setup db
cp $scriptdir/_datastore.json $scriptdir/../

# setup secrets
cp $scriptdir/fakesecrets.json $scriptdir/../config/secrets.json
geddy gen secret
