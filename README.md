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
  "kid": "did:is:PMW1Ks7h4brpN8FdDVLwhPDKJ7LdA7mVdd#key-1",
  "alg": "ES256K"
}.{
  "type": "identity",
  "operation": "create",
  "sequence": 0,
  "rules": [1], // Not required
  "timestamp": 1668606262,
  "content": { }
}.[Signature]
```

### kid

The "kid" is the Key ID available in the current document upon `"operation": "create"` or in the existing (`sequence - 1`) DID Document.

### operation

Must be either: `create`, `update`, `delete`, `restore`.

When performing a delete operation, a rule can be applied to indicate what type of delete is requested to be performed. It does not mean that host of the DID Server will respect the request, but the intentions will be made clear.

delete with rule `2` applied, means the user want the entire history of the DID Document to be wiped. This is essentially a request to be "forgotten" and all history removed. A normal delete without rule `2` applied, will still be accessible using the date-based query parameters to retrieve older DID Documents.

Delete requires the content to be empty and will be stored as a empty entry. Queries against the DID in the future will return empty result, not `404 not found`.

Ability to query historically can be important in cases where verification must be made back-in-time after the DID Document has updated with new keys, etc.

Restore

## Rules

Operations can specify an optional array of rules that indicates to the server what kind of consensus rules that should be applied to the request.

Rules can only be expanded from a document, never removed (when performing an update, the same rules or additional rules must be part of the request). You need to create a completely new entry with sequence 0 to define no, or other rules.

### Rule: 0

Nothing special is applied, this is the same as having an empty array or not "rules" entry at all.

### Rule: 1

[RULE HAS BEEN DROPPED]

### Rule: 2

This indicates the user want the entire history of the DID Document to be wiped.

This is essentially a request to be "forgotten" and all history removed.

It is up to individual DID Server operators to have this feature enabled or disabled. The default value is enabled, allowing DID Documents to be wiped from storage entirely.

For certain setups it might be required to not allow a full delete of history, so individual instances of the DID Server can run with different rules in regards to delete of history.

## Manual Delete

The host of the DID Server can always manually delete (and block further sync, added to deny-list) entries in their databases. If access to keys are lost, a user can send a manual request to the service provider and ask to be deleted (wiped) from the database.
