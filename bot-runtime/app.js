const dbConnector = require("./modules/dbconnector");
const ncmd = require('node-command-line');


const runtime = require('./modules/runtime');
let name = process.env.CONTAINER_NAME;
console.log("NOW");
let id = process.env.BOT_ID;
console.log(id)
if(id === '0') {
   process.exit(-1);
} else {
setTimeout(() => runtime.start(id), 60000);
}

