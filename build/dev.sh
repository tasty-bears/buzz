#!/usr/bin/env bash

scriptdir=${0%/*}

# install packages
cd $scriptdir/..
sudo npm install geddy -g
npm install 

# setup db
cp $scriptdir/_datastore.json $scriptdir/../

# setup secrets
cp $scriptdir/fakesecrets.json $scriptdir/../config/secrets.json
geddy gen secret
