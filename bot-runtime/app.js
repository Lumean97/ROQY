const dbConnector = require("./modules/dbconnector");
const runtime = require('./modules/runtime');

let name = process.env.CONTAINER_NAME;
process.env.MONGO_URI = "mongodb://localhost:27017/mydb";
process.env.BOT_ID = "cf2cd8f0-9dc6-4115-b404-404f616eb37d";
let id = process.env.BOT_ID;
console.log(id)
console.log(process.env.MONGO_URI);
if(id === '0') {
   process.exit(-1);
} else {
setTimeout(() => runtime.start(id), 1000);
}

