#!/bin/sh
CONTAINER_PORT=${1}
RESULT=$(netstat -tln | grep ${CONTAINER_PORT} | awk -F '[ :]+' '{print $4}')
if [ ${RESULT}x = ${CONTAINER_PORT}x ]
then
    echo 'port used, exit.'
    exit 1
fi