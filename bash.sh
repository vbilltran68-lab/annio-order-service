#!/usr/bin/env bash

CMD=$2
: ${CMD:=/bin/bash}

docker start annio-orders-service-dev
docker exec -it annio-orders-service-dev ${CMD}
