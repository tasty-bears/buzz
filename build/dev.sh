#!/usr/bin/env bash

# NOTE: Node.js and npm must be installed on the system to build Angora.
#       Please visit http://nodejs.org/ to install.

scriptdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# install packages
cd $scriptdir/..
npm install

# setup environmental variables
cp $scriptdir/.env $scriptdir/../

# setup db
cp $scriptdir/_datastore.json $scriptdir/../

# create server start script
echo "#!/usr/bin/env bash
node node_modules/foreman/nf.js start" > $scriptdir/../start.sh
chmod +x $scriptdir/../start.sh

# use ../start.sh to run server
