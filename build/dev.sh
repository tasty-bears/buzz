#!/usr/bin/env bash

# NOTE: Node.js and npm must be installed on the system to build Buzz.
#       Please visit http://nodejs.org/ to install.

scriptdir=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

#---------------------------------- OPTIONS -----------------------------------

args=$(getopt -l "hard:" -o "H:h" -- "$@")

eval set -- "$args"

while [ $# -ge 1 ]; do
        case "$1" in
                --)
                    # No more options left.
                    shift
                    break
                   ;;
                -H|--hard)
                        HARD="$2"
                        shift
                        ;;
                -h)
                        echo "OPTIONS:
-h      Show this message
-H,--hard  Clean all untracked files, not just ignored."
                        exit 0
                        ;;
        esac

        shift
done

#------------------------------------------------------------------------------

# clear existing build files
if [[ HARD ]]
then
    cleanCmd="git clean -Xd"
else
    cleanCmd="git clean -xd"
fi

echo -e "====================\n\
The following files will be removed:\n\n\
$($cleanCmd -n | awk '{print $NF}')\n"

read -p "Are you sure? [y/N] " response
if [[ $response =~ ^([yY][eE][sS]|[yY])$ ]]
then
    echo -e ""
    $cleanCmd -f
    echo -e "===================="
else
    echo -e "\ndude wat r u doin\n===================="
    exit 0
fi

# install node modules
echo -e "Installing node modules...\n"
cd $scriptdir/..
npm install
echo -e "===================="

# setup env file, filestore db, and sessions
echo -e "Setting up environment...\n"
cp $scriptdir/.env $scriptdir/../
cp $scriptdir/_datastore.json $scriptdir/../
echo -e "===================="

# create server start script
echo -e "Creating server start script 'start.sh'..."
echo "#!/usr/bin/env bash
node node_modules/foreman/nf.js start" > $scriptdir/../start.sh
chmod +x $scriptdir/../start.sh
echo -e "===================="
# use ../start.sh to run server
