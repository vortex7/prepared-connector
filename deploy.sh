#!/bin/sh

date

echo "building ..."
./undeploy.sh
./build.sh

pm2 start
