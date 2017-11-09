let MongoClient = require('mongodb').MongoClient;

let url = 'mongodb://141.19.145.166:27017/mydb';

/**
 * This method is for write a new bot or changing intents inside 
 * the Mongo Database
 * @param {*JSON-Object} request
 * @returns boolean if writing to the Database was sucessfull
 */
exports.writeToDB = function (request) {

    let retval = {
        "message": "",
        "success": true
    }

    return MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        //To create a new Bot
        db.createCollection("botAgents", function (err, res) {
            if (err) throw err;
        });

        //create new entry with request.data
        //To create an complete new bot, if no botID is set
        if (request.botId === undefined) {
            db.collection("botAgents").insertOne(request.data, function (err, res) {
                if (err) {
                    console.log('Bot couldnt get inserted! Dont ask me why.');
                    throw err;
                }
                console.log('Bot sucessfull inserted!');
                return true;
            });
        }

        //look for a bot with the specific botId
        //To change Intents inside a bot with it's ID
        else {
            db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {

                //bot not found
                if (err) {
                    console.log('Bot with such a bot ID couldnt be found!');
                    return false;
                }

                //replace found bot with request.data
                if (request.intendId === undefined) {
                    db.collection("botAgents").deleteOne({ id: request.botId }, function (err, res) {
                        if (err) {
                            throw err;
                        } else {
                            db.collection("botAgents").insertOne(request.data, function (err, res) {
                                if (err) {
                                    console.log('Bot couldnt get inserted! Dont ask me why.');
                                    throw err;
                                }
                                console.log('Bot sucessfull inserted!');
                                return true;
                            });
                        }
                    });
                    return true;
                }

                //Find the specific intent with request.indentId inside the found bot
                else {
                    let intent = undefined;
                    for (let i = 0; i < res.intents.length; i++) {
                        if (res.intents[i] === request.intentId) {
                            intent = res.intents[i];
                            break;
                        }
                    }

                    //replace old intent with request.data
                    if (intent !== undefined) {
                        //TODO delte old intent and insert new
                        return true;
                    } else {
                        // Intent not found, return false.
                        return false;
                    }
                }
            });
        }
    });
}

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
                    if (err) {
                        console.log('A bot with such an ID can not be found!');
                        //returns an empty JSON-Object
                        resolve({});
                    }


                    else {
                        //If only one bot is wanted
                        if (request.intendId === undefined) {
                            //return found bot
                            resolve(res);
                        }

                        //Find the specific intent with request.intentId inside the found bot
                        else {
                            let intent = undefined;
                            for (let i = 0; i < res.intents.length; i++) {
                                if (res.intents[i] === request.intentId) {
                                    intent = res.intents[i];
                                    break;
                                }
                            }

                            //return found intent
                            if (intent !== undefined) {
                                resolve({});

                                //return an empty JSON Array    
                            } else {
                                resolve(intent);
                            }
                        }
                    }
                });
            }
        });
    });
}

/**
 * This method is for deleting a bot from the Database
 * @param { *JSON-Object } request
 */
exports.deleteFromDB = function (request) {

    return MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        if (request.botId === undefined) {
            return false;
        }

        //Look for a bot with the specific botId
        else {
            return db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {
                if (err) {
                    console.log('A bot with such an ID can not be found!');
                    return false;
                }

                //If intents have to be deleted for an specific bot
                else {

                    //delete found bot
                    if (request.intentId === undefined) {
                        db.collection("botAgents").deleteOne({ id: request.botId });
                        console.log("done");
                        return true; //Gebe ich an dieser Stelle nicht den kompletten bot zurück???
                    }

                    //Find the specific intent with request.intendId inside the found bot
                    else {
                        db.collection("botAgents").findOne({ id: request.botId }, function (err, res) {

                            let intent = undefined;
                            for (let i = 0; i < res.intents.length; i++) {
                                if (res.intents[i] === request.intentId) {
                                    intent = res.intents[i];
                                    break;
                                }
                            }

                            if(intend === undefined) {
                                return false;
                            }

                            //delete found intent
                            else {
                                db.collection.update({},
                                {$unset}) //Ab hier muss ich weiter machen!!!
                            }
                        });
                    }
                }
            });
        }
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