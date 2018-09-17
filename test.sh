#!/bin/bash

echo "Cloning test repositores..."
REPOS_FOLDER=/tmp/test-repos
mkdir $REPOS_FOLDER
git clone https://github.com/carlosms/gitbase-graphql.git $REPOS_FOLDER/gitbase-graphql

echo
echo "Starting gitbase & bblfshd containers from docker-compose.yml..."
export GITBASE_GQL_REPOS_FOLDER=$REPOS_FOLDER
docker-compose up -d --force-recreate gitbase bblfsh

echo
echo "Waiting for bblfsh javascript driver to be installed..."
while ! docker exec -it `docker-compose ps -q bblfsh` bblfshctl driver list | grep javascript; do
    sleep 1
    echo "."
done
sleep 3s

echo
echo "Running jest tests..."
npx jest --coverage --detectOpenHandles --forceExit
RC=$?

echo
echo "Stopping gitbase & bblfshd containers..."
docker-compose down

exit $RC