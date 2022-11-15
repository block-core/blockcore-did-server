# Blockcore DID Server

DID Server implementation that supports public sync and sharing.

This software can be used to implement your own DID Method.

Blockcore uses this software to host the public available "did:is" DID Method.

## Architecture

The DID Server relies on LevelDB for storage.

### Throttling

The APIs have throttling (rate-limiting) configured by default to reduce spam-attacks, but it doesn't completely mitigate it.

### Allow Listing

The APIs allows server hosts to run it in allow-listing mode, meaning that the server won't host a DID unless it's part of the allow-list.
