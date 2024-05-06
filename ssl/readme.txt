You can put your own RSA certificate here.
but make sure the file name is same as this format.
private.pem --> Private key certificate use for run the server in SSL mode (Optional if you want to run in unsecure mode)
cert.pem --> Certificate file use for run the server in SSL mode (Optional if you want to run in unsecure mode)
jwt_private.key --> RSA private key use to sign the jwt token (Required)
jwt_public.key --> RSA public key use to verify the jwt token (Required)

Note:
if you run the server without file that mark as required the server will not be able to run because the file that need to
sign and verify the token is not present in this directory.So make sure you have those file before you run the server!.
The private.pem and cert.pem files only use if you run the server in SSL mode!.
