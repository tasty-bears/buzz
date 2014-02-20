#!/usr/bin/env bash

scriptdir=${0%/*}

# install packages
cd $scriptdir/..
sudo npm install geddy -g
npm install 
