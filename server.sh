#!/bin/bash
BSPORT=3000

while [ -n "$(lsof -Pi :${BSPORT} -sTCP:LISTEN -t)" ]; do
    ((BSPORT += 2))
done

echo "BS will run on port ${BSPORT}"

echo $PORT > ".port"
echo $BSPORT > ".bs-port"
