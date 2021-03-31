# RetroMatch

![Wireframe eerste versie](https://github.com/LarsHVA/Challenger/blob/main/doc/Group%202.png?raw=true)

Challenger is a matching app that helps users to find people who like the same game and want to challenge each other; who is the best in the game?
Also search for companions ( andperhaps new friends).

## Installation

### Pre install

- [NodeJS](https://nodejs.org/en/)
- [Git](https://git-scm.com/)

### Make account

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Gmail](https://www.google.com/intl/nl/gmail/about/#)
- [Twitch dev](https://dev.twitch.tv/)

#### Documentation

- [NodeJS](https://nodejs.org/en/docs/)
- [Git](https://git-scm.com/docs)
- [MongoDB Atlas](https://docs.atlas.mongodb.com/getting-started/)

### App install

Run the following code in your terminal.

`git clone https://github.com/LarsHVA/Challenger.git`

`git install`

Make a `.env` file with:

```js
URI = //URI of MongoDB
SESSION_SECRET = //Random key
TWITCH_CLIENT_ID = //Twitch client id
TWITCH_APP_ACCESS_TOKEN = //Twitch app access token
MAIL= //Gmail mail
PASSWOORDMAIL= //Gmail passwoord
```

### Create Database

```js
Database: Project;
Collection: users;
```

### Run App
When the setup is complete
run `npm start` in the terminal. You can find the app under `http://localhost:8000/`

## DOCS

[Wiki](https://github.com/LarsHVA/Challenger/wiki)

## Dependencies

- [axios](https://www.npmjs.com/package/axios)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [date-fns](https://www.npmjs.com/package/date-fns)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [ejs](https://www.npmjs.com/package/ejs)
- [express](https://www.npmjs.com/package/express)
- [express-flash](https://www.npmjs.com/package/express-flash)
- [express-session](https://www.npmjs.com/package/express-session)
- [ioredis](https://www.npmjs.com/package/ioredis)
- [mongodb](https://www.npmjs.com/package/mongodb)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [multer](https://www.npmjs.com/package/multer)
- [nodemailer](https://www.npmjs.com/package/nodemailer)
- [passport](https://www.npmjs.com/package/passport)
- [passport-local](https://www.npmjs.com/package/passport-local)
- [socket.io](https://www.npmjs.com/package/socket.io)
- [socket.io-redis](https://www.npmjs.com/package/socket.io-redis)

## devDependencies

- [nodemon](https://www.npmjs.com/package/nodemon)
