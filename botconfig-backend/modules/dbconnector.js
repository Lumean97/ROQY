let MongoClient = require('mongodb').MongoClient;
let url = process.env.MONGO_URI || 'mongodb://localhost:27017/mydb';


let username = '';
let password = '';

/**
 * This method is for write a new bot or changing intents inside 
 * the Mongo Database
 * @param {*JSON-Object} request
 * @returns boolean if writing to the Database was sucessfull
 */
exports.writeToDB = function (request) {
    return new Promise(function (resolve) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            //create new entry with request.data
            //To create an complete new bot, if no botID is set
            if (request.botId === undefined) {
                db.collection("botAgents").insertOne(request.data, function (err, res) {
                    if (err) {
                        console.log('Bot couldnt get inserted! Dont ask me why.');
                        throw err;
                    }
                    resolve(true);
                });
            }

            //look for a bot with the specific botId
            //To change Intents inside a bot with it's ID
            else {
                db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {

                    //bot not found
                    if (err || res === null) {
                        console.log('Bot with such a bot ID couldnt be found!');
                        resolve(false);
                    }

                    //replace found bot with request.data
                    if (request.intendId === undefined) {
                        db.collection("botAgents").deleteOne({ id: request.botId }, function (err, res) {
                            if (err) {
                                throw err;
                            } else {
                                db.collection("botAgents").insertOne(request.data, function (err, res) {
                                    if (err) {
                                        throw err;
                                    }
                                    resolve(true);
                                });
                            }
                        });
                        resolve(true);
                    }
                });
            }
        });
    });
};

/**
 * This method is for getting a whole bot or reading intents out of the 
 * Mongo Database
 * @param { *JSON-Object } request
 */
exports.readFromDB = function (request) {

    return new Promise(function (resolve) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            if (request.botId === undefined) {
                //return all Bots
                return db.collection("botAgents").find({}).toArray(function (err, res) {
                    resolve(res);
                });

            }

            //look for a bot with the specific bodId
            //If the bot ID is set and intents from a bot are wanted
            else {
                db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {
                    if (err || res === null) {
                        console.error('A bot with such an ID can not be found!');
                        //returns an empty JSON-Object
                        resolve({});
                    }


                    else {
                        //If only one bot is wanted
                        if (request.intendId === undefined) {
                            //return found bot
                            resolve(res);
                        }
                    }
                });
            }
        });
    });
}

exports.writeConfig = function (body, id) {
    return new Promise(function (resolve) {
        MongoClient.connect(url, function (err, db) {

            let bot = db.collection('botAgents').update({ id: id }, {
                $set: {
                    config: body
                }
            }).then(() => {
                resolve();
            }).catch(function (err) {
                if (err) {
                    console.log('Update did not work.')
                    reject();
                }
            })
        })
    })
}

exports.setPrivacy = function (botID, privacy) {
    return new Promise(function (resolve) {
        MongoClient.connect(url, function (err, db) {

            let bot = db.collection('botAgents').update({ id: botID }, {
                $set: {
                    privacy: privacy
                }
            }).then(() => {
                resolve();
            }).catch(function (err) {
                if (err) {
                    console.log('Update did not work.')
                    reject();
                }
            })
        })
    })
}

/**
 * This method is for deleting a bot from the Database
 * @param { *JSON-Object } request
 */
exports.deleteFromDB = function (request) {
    return new Promise(function (resolve) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;

            if (request.botId === undefined) {
                resolve(false);
            }

            //Look for a bot with the specific botId
            else {
                return db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {
                    if (err || res === null) {
                        console.log('A bot with such an ID can not be found!');
                        resolve(false);
                    }

                    //If intents have to be deleted for an specific bot
                    else {

                        //delete found bot
                        if (request.intentId === undefined) {
                            db.collection("botAgents").deleteOne({ id: request.botId });
                            resolve(true); //Gebe ich an dieser Stelle nicht den kompletten bot zurück???
                        }


                    }
                });
            }
        });
    });
}

/*
exports.readMultipleFromDB = function (request) {
    let retval = [];
    for (let i = 0; i < request.length; i++) {
        let response = exports.readFromDB(request[i]);
        retval.push(response);
    }
    return retval;
}
*/