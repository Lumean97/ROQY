# Installation guide for ROQY
Version 1.0

## 1) Running ROQY with docker compose


Requirements:

 - [Docker](https://www.docker.com/)
 - [Docker Compose](https://docs.docker.com/compose/install/)

To run ROQY on a local computer via docker compose simply run `docker-compose up` in ROQY's root directory (may require elevated permissions depending on platform). Afterwards you can access the website on http://localhost:8000/.

If you want other machines to access ROQY enter the host's reachable IP in the `host.env` file. Hosting ROQY this way is recommended exclusively for testing purposes.

## 2) Modules
ROQY consist of 3 core modules botconfig-frontend, botconfig-backend and bot-runtime.
Requirements:

 -  All modules require [Node.js](https://nodejs.org/en/) to run.
 - The servers require a [mongoDB](https://www.mongodb.com/) server.

**1) bot-runtime**

- Setup
Dependencies can be installed with `npm install`.
Running the runtime manually is not recommended. The runtime will be started automatically by the backend when necessary.

- Parameters
BOT_ID : The bots unique id.
MONGO_URI : The full URL of the mongoDB server. Default is `mongodb://localhost:27017/mydb`.

**2) botconfig-backend**

- Setup 
Dependencies can be installed with `npm install`.
The backend can be run with `npm start`.
Make sure to setup the bot-runtime before running this!

- Parameters
MONGO_URI : The full URL of the mongoDB server. Default is `mongodb://localhost:27017/mydb`.

**3) botconfig-frontend**

- Setup 
Dependencies can be installed with `npm install`.
The frontend can be run with `npm start` or build with `npm build` for deployment. 

- Parameters
API_URL : The backend base URL. Make sure that this path is reachable by all users.



