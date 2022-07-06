# Encryption Methodology - `v1.1.0`
This document details the encryption methodology used in Athena.  
I'm not a mathematician or cryptographer so if you think there's a vulnerability or problem with this methodology feel free to get in touch.

## Terminology
This list explains the terminology used in this document: 
- *Server*: The remote server/backend which stores user accounts and encrypted content.
- *Client*: Any "client side" application that the user interacts with such as the web and mobile apps.

## Basics
All content is client side encrypted which means that the server application and anyone with access to the server or database has no way of viewing or decrypting your content.

### What's not encrypted?
Content metadata is not encrypted, this includes:
- "created at" and "updated at" timestamps
- content relationships such as what vault notes & tags are stored in and what tags a note has (the vault and tag data itself is encrypted)

## Implementation
When a user creates an account they provide a `password`. This password is put through a key derivation funciton (KDF) and stretched on the client to create a `password key`. This `password key` is then split in two, the first half becomes the `master key` and the second half becomes the `server password`.
The `server password` can be sent to the server when creating an account or when a user attempts to login for authentication checks. The `master key` can be used as part of content encryption.

The `master key` is not directly used to encrypt content because then all content would need to be re-encrypted when the user's password is changed. Instead, on account creation the client will randomly generate an `encryption key` which is then used to encrypt all the user's content. This `encryption key` is itself encrypted using the user's `master key` and is then stored in the user's account as `encryption secret`.
This means that if the user changes their password the client can simply re-encrypt the `encryption key` with the new `master key` and submit the updated `encryption secret` along with the new `server password`.  
The actual `encryption key` stays the same so the application doesn't then have to re-encrypt all the users content.

## Possible limitations and improvements
- Once the `encryption key` is generated for an account there is no way to change it. This may cause future issues if I attempt changes or upgrades to the encryption methodology. Is this also a security issue? Should there be a way to rotate your `encryption key`?
- All keys are based on the user's password, meaning an attacker only needs to know the password to get access to the account and content. This could be solved by having a seperate "account password" and "encryption phrase" but if an attacker gains access to the user's password (such as with machine access or password manager etc) they could probably also get the encryption phrase.
- All content is encrypted with the same key. Could encryption be vault level? So along with the user's password and master key there is also vault passwords and master keys.

## Credits
I based this method of splitting the `password key` into a `master key` & `server password` and using the `master key` to encrypt the `encryption key` from the [Standard Notes 004](https://github.com/standardnotes/snjs/blob/main/packages/snjs/specification.md) encryption specfication.
