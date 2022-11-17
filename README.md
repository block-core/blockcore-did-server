# Blockcore DID Server

DID Server that can host a DID Method implementation that supports public sync and sharing.

This software can be used to implement your own DID Method.

Blockcore uses this software to host the public available "did:is" DID Method.

## Architecture

The DID Server is a straight forward service that stores and allows updates to DID Documents. All requests to the APIs are in the form of signed JWTs (JWS).

The first key in the verificationMethod is required to be the public key that is used to derive the DID, e.g. "did:is:publickey".

Operations must be signed with a key in the `authentication` section of the DID Document. All keys in `authentication` can be updated through key rotation.

### Storage

The DID Server relies on LevelDB for storage. Whenever a new update is performed, the sequence number must be correct and in order.

### Throttling

The APIs have throttling (rate-limiting) configured by default to reduce spam-attacks, but it doesn't completely mitigate it.

### Allow Listing

The APIs allows server hosts to run it in allow-listing mode, meaning that the server won't host a DID unless it's part of the allow-list.

### API

The API for the DID Server is not very complex, they are based around JSON Web Tokens that has to be signed by the keys available in the DID Document.

### Sync

The data on a single instance of the Blockcore DID Server, can sync with other instances very easily. When a sync happens, the same requests that a normal user performs, is re-run on the other server and same verification happens as when the user originally made the request. This ensures that zero trust is needed between instances of DID Servers.

## API Schema

APIs calls are based upon JWS that MUST correspond to the following specifications. All the fields in the example below must be provided and is required, except the "rules" field which can be omitted.

Decoded JWS:

```json
{
  "kid": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key0",
  "alg": "ES256K"
}.{
  "version": 0,
  "iat": 1668606262,
  "content": { }
}.[Signature]
```

### "kid"

The "kid" is the Key ID available in the current document upon `"version": 0` or in the existing (`version - 1`) DID Document.

### "iat"

Issued at, this should be the time at which the user generates the DID Document. It is not verified any further.

### "version"

Version 0 indicates that this is a new DID Document and other rules are applied than updates.
Version 1 or higher indicates that this is an updated DID Document and other rules are applied.

### "content"

This is the DID Document. Can be empty, which means the user want to delete the DID Document. If a delete is performed the DID Document can never be restored again.

#### Version 0 rules

There cannot exist any other DID Document already with the same DID Subject.

#### Version 1 rules

The version must be +1 from the current synced document.

### POST

The server hosts a generic endpoint at the root that can receive the JWS as a raw binary object through a POST method.

## Request to be forgotten

There will in the future be a separate API that anyone can use to request a complete history wipe of their DID Document history. This API will allow users to provide an encrypted personal message for the DID Server host (public key discoverable using the .well-known configuration).

## Manual Delete

The host of the DID Server can always manually delete (and block further sync, added to deny-list) entries in their databases. If access to keys are lost, a user can send a manual request to the service provider and ask to be deleted (wiped) from the database.
