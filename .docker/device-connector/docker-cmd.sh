#!/bin/bash

#(while true; do
#  arduino-cli daemon --port 50051 --daemonize --verbose --log-file logs/arduino-cli/"$(date '+%F-%T')".log
#done) &

node --loader esbuild-node-loader src/index.ts 2>&1 | tee logs/device-connector/"$(date '+%F-%T')".log
