# GitBase-GraphQL

A [GraphQL](http://graphql.org/) API on top of [GitBase](https://github.com/src-d/gitquery).

This is a proof of concept with a lot of missing functionality.

## Requirements

You will need a running [GitBase](https://github.com/src-d/gitquery) with some data. The code has been tested against `v0.10.0`.

For now the server is expected to be listening on `localhost:3306`, mysql user `root`, with no password.

```bash
wget https://github.com/src-d/gitquery/releases/download/v0.10.0/gitquery_v0.10.0_linux_amd64.tar.gz
tar xzvf gitquery_v0.10.0_linux_amd64.tar.gz
cd gitquery_linux_amd64/
mkdir repos
cd repos
git clone https://github.com/src-d/gitquery.git
git clone https://github.com/src-d/engine.git
git clone https://github.com/src-d/ml.git
cd ..
./gitquery server -g repos
```

## Usage

Clone this repo, and then execute:

```bash
yarn install
yarn start
```

Then go to [http://localhost:3000/graphiql](http://localhost:3000/graphiql) and explore!

![Demo](./docs/demo.gif)