#!/bin/bash
PORT=9090
BSPORT=3000

while [ -n "$(lsof -Pi :${PORT} -sTCP:LISTEN -t)" ]; do
    ((PORT++))
done

while [ -n "$(lsof -Pi :${BSPORT} -sTCP:LISTEN -t)" ]; do
    ((BSPORT += 2))
done

echo "BS will run on port ${BSPORT}"

echo $PORT > ".port"
echo $BSPORT > ".bs-port"

echo "Server is running on port ${PORT} and BrowserSync on port ${BSPORT}"
php -S localhost:${PORT}