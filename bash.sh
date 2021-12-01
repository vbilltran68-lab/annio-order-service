#!/usr/bin/env bash

CMD=$2
: ${CMD:=/bin/bash}

docker start annio-order-service-dev
docker exec -it annio-order-service-dev ${CMD}
