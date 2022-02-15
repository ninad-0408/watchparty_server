# watchparty_server

## Instructions for local setup:

Clone this repo using
```bash
git clone https://github.com/ninad-0408/watchparty_server.git
cd watchparty_server
```
After cloning create a <code>.env</code> file to store all the environment variables.
<br>Fill in the <code>.env</code> file with the content as follows.

```
CONNECTION_URL  = RETRACTED (Put your Mongodb Atlas database url here)
hashtoken = RETRACTED (any random string)
NODE_ENV = "dev"
CLIENT_ID2=  RETRACTED (Put Your client id given by google developer console)
CLIENT_SECRET2 = RETRACTED (Put Your client secret given by google developer console)
EMAIL =  RETRACTED (email from which you want to send email)
REFRESH_TOKEN2 =  RETRACTED (Put Your refresh token given by google developer console)
```
After setting the <code>.env</code> file,
<br>For installing all Modules and Packages
```javascript
npm install
```
To start the server run the command
```javascript
npm start
```

