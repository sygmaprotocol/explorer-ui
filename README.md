<p align="center"><a href="https://https://chainsafe.io/"><img width="250" title="Sygma UI" src='../../assets/full-logo.png'/></a></p>

# Sygma Explorer UI

This repo contains the our Explorer UI app for checking the data of the tokens transfer for our Transfer UI.

## Dependencies

For local usage, clone [this repo](https://github.com/sygmaprotocol/sygma-explorer-indexer). Once cloned, follow instructions there to start the mock server.

## Usage

```bash
touch .env
```

Add the following to the env file:

```
VITE_INDEXER_URL="http://localhost:8080"
```

```bash
yarn
yarn start
```

## Env variables needed

You will need to define the following `env` variables on a `.env` file:

```
VITE_INDEXER_URL="INDEXER_URL"
VITE_SHARED_CONFIG_URL="SHARED_CONFIG_URL"
VITE_EXPLORER_URLS='[{ "id": number, "url": EXPLORER_URL }]'
VITE_NATIVE_TOKEN_TRANSFER_RESOURCE_ID: "0x1000000000000000000000000000000000000000000000000000000000000000"
```