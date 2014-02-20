#!/usr/bin/env bash

scriptdir=${0%/*}

# setup db
cp $scriptdir/_datastore.json $scriptdir/../

# install packages
cd $scriptdir/..
sudo npm install geddy -g
npm install 
