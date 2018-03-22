# Mix Project Block Explorer

Mix Block Explorer is a decentralised application (dApp) designed to show real time statistics for any
Ethereum based blockchain. The system has [Metamask](https://metamask.io/) integration meaning you can connect
to any blockchain you have connected to in Metamask. Or you can simply specify a CORS enabled Ethereum node via
domain name or IP address.

Ethereum explorer is ideal for those learning about Ethereum block chains and developers
in particular who may be looking for examples of interacting with ethereum block chains via
the [Ethereum web3 api](https://github.com/ethereum/wiki/wiki/JavaScript-API).

#### Features

- Real time block chain statistics for any Ethereum based blockchain
- Metamask integration - connect to Ethereum blockchains configured in Metamask
- Easily configure connections to Ethereum nodes
- Account / transaction / block lookup

### mix-api

Mix block explorer has been built on top of the [mix-api library](https://github.com/desertedisland/mix-api) -
a separate project deployed as an NPM module. The mix-api project is designed to provide an intuitive, easy to use
set of APIs which other developers can use to build their own mix or non mix related dApps.

#### Installation

- `git clone git@github.com:link-blockchain/ethereum-explorer.git`
- `npm install`
- `npm start` will launch webpack in dev mode, you can browse to the project at localhost:8080
- `npm run build` will create a dist folder with production source

#### Usage

You will need the ability to make remote procedure calls (RPCs) to a block chain node: specifically you will
need a node which allows CORS access to your client.

We actively encourage people to
[create and run their own Link block chain node](http://docs.link-blockchain.org/en/latest/configuration.html) which
can easily be installed on a laptop and configured to allow localhost client access.

Once you have a node up and running, modify the node_uri field in config.js with your node's IP and port.

- Running npm start will launch webpack's dev server on port 8080 which will conflict with the
default dapp port if your node is run with Parity (Geth has fewer config issues in my experience).

#### The Mix project

The [Mix project](https://www.mix-blockchain.org/) aims to rebuild the web by making content:

- Decentralised - available from numerous servers via IPFS.
- Smart - essentially built on an object oriented model where content has (inheritable)
methods and attributes

#### Contributing and forking

Contributors are more than welcome, please just submit a pull request.

Ethereum Explorer is released under the Apache license, feel free to re-use as you will!
