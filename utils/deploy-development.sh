#!/usr/bin/env bash

set -o nounset
set -o errexit

CONFIG_PATH="$1"

# navigate to the project directory
SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd "$SCRIPT_DIR"
cd ".."

# PM2 не применяет новые переменные среды, даже если применен --update-env.
# Для конфигурирования применяются файлы .env https://github.com/motdotla/dotenv
npm i
cat "$CONFIG_PATH" > .env.development.local
cat "$CONFIG_PATH" > .env # требуется для prisma
npm run build
npx prisma migrate deploy
pm2 startOrReload ecosystem.config.js --only metaswap-development

bash "$SCRIPT_DIR/deploy-front-dev.sh"

echo "Done."