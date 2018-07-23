#!/bin/bash

echo "Cloning test repositores..."
REPOS_FOLDER=/tmp/test-repos
mkdir $REPOS_FOLDER
git clone https://github.com/carlosms/gitbase-graphql.git $REPOS_FOLDER/gitbase-graphql
git clone https://github.com/src-d/gitbase.git $REPOS_FOLDER/gitbase

echo
echo "Starting gitbase & bblfshd containers from docker-compose.yml..."
GITBASE_GQL_REPOS_FOLDER=$REPOS_FOLDER docker-compose up -d gitbase bblfsh
sleep 3s

echo
echo "Running jest tests..."
npx jest

echo
echo "Stopping gitbase & bblfshd containers..."
docker-compose down
