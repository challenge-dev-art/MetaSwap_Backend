#!/usr/bin/env bash

set -o nounset
set -o errexit

API_URL="https://metaswap.freeblock.site/api/v1"
WWW_DIR="/var/www/metaswap.freeblock.site/metaswap_front"
REMOTE_REPO="git@metaswap-front-deploy:devmetis/metaswap_front.git"
LOCAL_REPO="/home/metaswap/metaswap_front"

echo "Pull commits..."
LOCAL_REPO_VC_DIR="$LOCAL_REPO/.git"
if [ ! -d "$LOCAL_REPO_VC_DIR" ]
then
    git clone "$REMOTE_REPO" "$LOCAL_REPO"
else
    cd "$LOCAL_REPO"
    git checkout .
    git pull "$REMOTE_REPO"
fi

echo "Build..."
cd "$LOCAL_REPO"
yarn install
REACT_APP_API_URL="$API_URL" REACT_APP_DEBUG="false" npm run build

echo "Publish..."
cd "$LOCAL_REPO"
rsync -a --delete ./build/ "$WWW_DIR/"

echo "Done."

