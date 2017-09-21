// Core library for interactions with Ethereum blockchains

import LinkHTTPConnector from './LinkConnector.js';
import  LinkSystemStats from './LinkSystemStats.js';
import LinkSearch from './LinkSearch.js';


export default class LinkClient {

    // Connect to a network via Metamask (https://metamask.io/) or explicit URI stored in localstorage.
    // Explicit URI overrides Metamask.
    constructor() {

        this._web3 = null;

        // If a node URI has been specified, it will be stored in localstorage
        const nodeUri = localStorage.getItem('link-node-uri');

        if (nodeUri) {

            this._web3 = LinkHTTPConnector.connect(nodeUri);

        // No direct connection specified. Try metamask.
        }else if( typeof web3 !== 'undefined'){

            this._web3 = web3;

        }

        if(!this._web3 || !this._web3.isConnected()){
            throw new Error('Not connected to network');
        }

        this._systemStats = new LinkSystemStats(this._web3);
        this._linkSearch = new LinkSearch(this._web3);


    }

    // Watch the network for new blocks
    watchNetwork(callback, errorCallback){

        const filter = this._web3.eth.filter('latest'),
            that = this;

        filter.watch(function(error, result){

            if(error){
                return errorCallback(error);
            }

            callback(result);

        });

    }

    // Take a hash or number and search for:
    // - An account balance
    // - A transaction
    // - A block
    doSearch(query){

       const results = {
           block : this._linkSearch.getBlock(query),
           balance : this._linkSearch.getBalance(query),
           transaction : this._linkSearch.getTransaction(query)
       };

       return results;

    }

    // Numerous asynchronous calls to various APIs. getLatestBlocks will initially
    // make an asynchronous call to retrieve each individual block (I'm not aware of any other way
    // of doing that with the web3 api. You can avoid that if you supply an existing list of
    // latestBlocks via the param.
    getSystemStats(latestBlocks = null) {

        // Must get system state before everything else.
        return new Promise(
            (resolve, reject)=>{

                let stats = {};

                this._systemStats.getState().then(
                    (state)=>{

                        stats.state = state;

                        let promises = [
                            this._systemStats.getPeerCount(),
                            this._systemStats.getGasPrice()
                        ];

                        if(!latestBlocks){
                            promises.push(this._systemStats.getLatestBlocks());
                        }

                        Promise.all(promises).then(
                            (results)=>{

                                stats.peerCount = results[0];
                                stats.gasPrice = results[1];

                                stats.latestBlocks = latestBlocks || results[2];

                                stats.difficulty = this._systemStats.getAverageDifficulty(stats.latestBlocks);
                                stats.blockTimes = this._systemStats.getBlockTimes(stats.latestBlocks);
                                stats.hashRate = this._systemStats.getHashRate();

                                resolve(stats);

                            }
                        ).catch(
                            (error)=>{

                                console.error(error.message);
                                reject(error);

                            }
                        );

                    }
                );

            }
        )
    }

    // Add a new block to the latestBlocks list and update the stats
    // Update the block list and stats with a new block
    updateBlocks(latestBlocks){

        this._systemStats.setLatestBlocks(latestBlocks);

        return {

            state : this._systemStats.getState(),
            latestBlocks: latestBlocks,
            peerCount: this._systemStats.getPeerCount(),
            difficulty: this._systemStats.getAverageDifficulty(),
            blockTimes: this._systemStats.getBlockTimes(),
            gasPrice: this._systemStats.getGasPrice(),
            hashRate: this._systemStats.getHashRate()

        }

    }

    getBlocks(){

        this._systemStats.getState();
        return this._systemStats.getLatestBlocks();

    }

    getBlock(hashOrNumber){

        // Returns promise
        return this._linkSearch.getBlock(hashOrNumber);

    }

    getTransaction(transactionHash){

        // Returns promise
        return this._linkSearch.getTransaction(transactionHash);

    }

    getAccountBalance(accountHash){

        // Returns promise
        return this._linkSearch.getBalance(accountHash);

    }

}