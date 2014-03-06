#!/usr/bin/env bash

scriptdir=${0%/*}

# install packages
cd $scriptdir/..
sudo npm install geddy -g
npm install 

# setup db
cp $scriptdir/_datastore.json $scriptdir/../
