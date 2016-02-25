# GuildSkrypt-Boardroom

Welcome to the alpha version of BoardRoom, a blockchain governance dApp.

# Pre-Alpha

http://meteor-dapp-boardroom.meteor.com

# Install

**Please note this dApp is incomplete and is still being developed.

Clone this repo

    $ git clone http://github.com/TechEnterprises/GuildSkrypt-Boardroom
    
Create an account with geth (create a passphrase):

    $ geth account new
    
Start a local geth node instace (then hit 'enter' to promt passphrase input):

    $ geth --rpc --rpcaddr="0.0.0.0" --rpccorsdomain="*" --mine --unlock=0 --verbosity=5 --maxpeers=0 --minerthreads="4"
    
Start the app using BoardRoom

    $ cd GuildSkrypt/Boardroom/app
    $ meteor
    
# Todo

- Subcommittee MongoDB
- Proposal Data Handling
- Whisper Comms
- Budget Testing
- Swarm Integration
- Middleware Display
