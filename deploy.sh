#!/bin/sh

date

echo "pulling ..."
git pull

echo "building ..."
./undeploy.sh
./build.sh

pm2 start
