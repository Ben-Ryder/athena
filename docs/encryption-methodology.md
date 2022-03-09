# Encryption Methodology
This document details the encryption methodology used as part of Athena.  
I'm not a mathematician or cryptographer so if you think there's a vulnerability or problem with this
methodology feel free to get in touch.

## Basics
All content is client side encrypted using a secret key that is never shared with the server.  
This means that the server application and anyone with access to the server or database has no way of viewing your content.   
The only way for your content to be viewed is for it to be decrypted at the client with your secret.

### What's not encrypted?
Content metadata is not encrypted, this includes:
- "created at" and "updated at" timestamps
- content relationships such as tags (although tag content itself is encrypted)

### How is the client secret checked?
When a user enters their secret into a client app it is "validated". This is done for two main reasons:
- The client can ensure the secret has a high likelihood of working before pulling down and attempting to decrypt a user's content.
- It helps prevent a user from submitting new content with a different secret as this would then mean they
couldn't properly access & decrypt all their content at the same time.

The user's secret is checked using a "check field" on a user's account. When a user first enters their client side
secret it is used to encrypt some known data which is saved to this check field.  
From then on, when the user enters their secret this field can be decrypted and verified by the client.  
If the decrypted content matches the known data then the client knows that the user entered their secret correctly.  

**IMPORTANT NOTE:** This is only a client check. The server itself offers no protection from submitting data with different encryption secrets.
This means it is completely plausible that a client could come across 

## Implementation
- Password hashing for users is done server side using `bcrypt`.
- The user enters an 'encryption passphrase' on a client which is then transformed to an encryption key via a KDF function (PBKDF2 or Argon2?)
- Content encryption is done client side using AES encryption from the `crypto-js` library using the users derived key.
