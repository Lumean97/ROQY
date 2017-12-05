

const runtime = require('./modules/runtime');
let id = process.env.BOT_ID;
setTimeout(() => runtime.start(id), 1000);

