#!/usr/bin/env bash

# NOTE: Node.js and npm must be installed on the system to build Angora.
#       Please visit http://nodejs.org/ to install.

scriptdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# clear existing build files
echo -e "====================\n\
The following files will be removed:\n\n\
$(git clean -X -n | awk '{print $NF}')\n"

read -p "Are you sure? [y/N] " response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo -e ""
    git clean -x -f
    echo "===================="
else
    echo -e "\ndude wat r u doin\n===================="
    exit 0
fi

# install node modules
echo -e "Installing node modules...\n"
cd $scriptdir/..
npm install
echo -e "===================="


# # clear local env file, filestore db, and sessions
# echo -e "Setting up environment...\n"
#
# heroku_env=$(heroku config --app tastybears-angora | sed 1d | sed s/:/=/ | sed -e "s/ //g")
#
# read -p "Would you like to reset the Mongo database? [y/N] " response
# if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
# then
#     echo -e ""
#     env $heroku_env node $scriptdir/seed_mongo.js 
# fi
# echo -e "===================="


# create server start script
echo -e "Creating server start script 'start.sh'..."
echo "#!/usr/bin/env bash
heroku_env=$(heroku config --app tastybears-angora | sed 1d | sed s/:/=/ | sed -e "s/ //g")
env $heroku_env PORT=5000 node server.js" > $scriptdir/../start.sh
chmod +x $scriptdir/../start.sh
echo -e "===================="
# use ../start.sh to run server
