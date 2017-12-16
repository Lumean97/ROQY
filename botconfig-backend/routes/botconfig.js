const express = require('express');
const ncmd = require('node-command-line');
const requestPromise = require('request-promise');
const router = express.Router();
const ILuis = require('luis-node-sdk');
const dbcon = require('../modules/dbconnector');

var APPID = "4f51b70e-cc17-46b8-8009-801a34e28c90";
const APPKEY = "ed2ff1a97f924b8e8a1402e6700a8bf4";

/**
 * Here are all messages defined, so for changes we don't have redundant data.
 * @type {{botNotFound: string, botAlreadyExists: string, botDeleted: string, botHasBeenCreated: string, botsFound: string, errorWhileCreating: string, botHasBeenStarted: string, botHasBeenStopped: string, generalError: string, botUpdated: string}}
 */
const messages = {
    "botNotFound": "The specified bot could not be found: ",
    "botAlreadyExists": "A bot with that name already exists!",
    "botDeleted": "The bot has been deleted successfully!",
    "botHasBeenCreated": "The bot has been created successfully.",
    "botsFound": "All bots has been returned.",
    "botFound": "The bot has been returned",
    "errorWhileCreating": "Error while creating the bot, please try again.",
    "botHasBeenStarted":"The bot has been successfully started!",
    "botHasBeenStopped":"The bot has been successfully stopped!",
    "generalError":"An error occured.",
    "botUpdated":"Bot has been updated successfully!",
    "authSuccess":"Authorization was successfull!",
    "unauthorized":"Sorry, you are not authorized for this action!",
    "privacyNotAcceptable":"Privacy type is not acceptable!",
    "noDescrption":"Description must be set!",
    "noPrivacy":"Privacy must be set!",
    "noBotType":"BotType must be set!",
    "botTypeNotAcceptable":"BotType is not acceptable!",
    "privacyUpdated":"Privacy has been updated successfully!",
    "writeDBError":"Error while writing into DB.",
    "readDBError":"Error while reading from DB",
    "deleteDBError":"Error while deleting from DB"
};

const maxCallsOnLUIS = 5;

const waitTimeForLUIS = 5000/maxCallsOnLUIS;


const LUISKEY = "ed2ff1a97f924b8e8a1402e6700a8bf4";
let LUISClient;

/**
 * Sends a response to client
 * @param res - JSON Object - response object for client
 * @param status - Number - status code
 * @param error - Boolean - is an error occured?
 * @param message - String - returned message
 * @param add - Object - extra data for client, this could be everything and should be specified!
 */
function responseToClient(res, status, error, message, add) {
    res.header("Content-Type", "application/json");
    let responseMessage = {
        "status": status,
        "error": error,
        "message": message,
        "extra": add || {}
    };

    res.status(status).send(JSON.stringify(responseMessage));
}
/**
 * Checks wether a bot with this id already exists or not
 * @param id - id of Bot
 * @returns
 *      {
 *          "exists": true when a bot with this name exists,
 *          "agentResponse": Response from Luis with Information about Agent
 *      }
 */
function existsAgent(id) {
    return new Promise(function (resolve) {
        let options = {
            uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + id,
            method: 'GET',
            headers: {
                "Ocp-Apim-Subscription-Key": APPKEY
            },
            json: true
        };
        requestPromise(options).then(res => {
            resolve({
                "exists": true,
                res
            });
        }).catch(res => {
            resolve({
                "exists": false
            });
        });
    })
};


/**
 *
 */
router.post("/auth", function(req, clientResponse){
    // TODO Real authorization --> Liveperson!
    clientResponse.header("Access-Control-Allow-Origin", "*");
    let username = req.param("username");
    let password = req.param("password");
    console.log(username + " " + password);
    if(username !== undefined && password !== undefined){
        responseToClient(clientResponse, 200, false, messages.authSuccess, {Authorization:23625217});
    }else {
        responseToClient(clientResponse, 401, true, messages.unauthorized);
    }
});

/**
 * Get all Bots
 * This endpoint returns all Bots.
 * Parameters:
 *      none
 * Headers
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.get("/bot", function (req, clientResponse) {
    let auth = req.header("Authorization");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    clientResponse.setHeader("Content-Type", "text/html; charset=utf-8");
    let bots = dbcon.readFromDB({
    }).then(res => {
        responseToClient(clientResponse, 200, false, messages.botsFound, res);
    });
});

/**
 * Create Bot
 * This endpoint creates a new Bot
 *
 * Parameters:
 *      name - name of the Bot
 *      img - image of the Bot
 *      description - description of the Bot
 *      intents - an Array of intents
 *              id - id of the intent
 *              name - name of the intent
 *              answer - answer when this intent is called
 *              nextIntents - an Array of ID's of the following intents
 *              questions - an Array of Strings, how you could ask for this intent
 *
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.post('/bot', function (req, clientResponse) {

    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    clientResponse.header("Access-Control-Allow-Origin", "*");
    console.log("Create Bots");
    let appId = "";
    let userData = req.body;
    userData.status = "stopped";
    userData.account = auth;
    if(userData.description === undefined){
        responseToClient(clientResponse, 406, true, messages.noDescrption);
        return;
    }
    if(userData.botType === undefined){
        responseToClient(clientResponse, 406, true, messages.noBotType);
        return;
    }
    if(userData.botType !== "faq" && userData.botType !== "welcome"){
        responseToClient(clientResponse, 406, true, messages.botTypeNotAcceptable);
        return;
    }
    if(userData.privacy === undefined){
        responseToClient(clientResponse, 406, true, messages.noPrivacy);
        return;
    }
    if(userData.privacy !== "public" && userData.privacy !== "private"){
        responseToClient(clientResponse, 406, true, messages.privacyNotAcceptable);
        return;
    }


    userData.img = userData.img || "../assets/bot.png";
    const initVersion = "1.0";
    let numberOfQuestions = 0;
    let questionsDelivered = 0;
    let options = {
        uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/",
        method: "POST",
        body: {
            "name": userData.name,
            "description": "",
            "culture": "en-us",
            "usageScenario": "IoT",
            "domain": "Comics",
            "initialVersionId": initVersion
        },
        headers: {
            "Ocp-Apim-Subscription-Key": APPKEY
        },
        json: true
    };

    if (userData.test === undefined){
        requestPromise(options)
            .then(res => {
                appId = res;
                options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId + "/versions/" + initVersion + "/intents";
                let i = 0;
                let intentInterval = setInterval( () => {

                    if(i >= userData.intents.length){
                        clearInterval(intentInterval);
                        return;
                    }
                    let currentIntent = userData.intents[i];
                    options.body = {
                        name: userData.intents[i].name
                    };
                    requestPromise(options);
                    i++;
                }, waitTimeForLUIS);
                return new Promise(ret => {
                    ret();
                })
            }).delay(waitTimeForLUIS * userData.intents.length * 1.5)
            .then(res => {
                options.method = "GET";
                return new Promise(function (resolve) {
                    let waitUntilIntentsCreatedIntervall = setInterval(() => {
                        requestPromise(options)
                            .then(res => {
                                if (res.length >= userData.intents.length) {
                                    clearInterval(waitUntilIntentsCreatedIntervall);
                                    resolve(res);
                                }
                            })
                    }, waitTimeForLUIS)
                })
            }).delay(waitTimeForLUIS)
            .then(res => {
                console.log("Intents done");
                options.method = "POST";
                options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId + "/versions/" + initVersion + "/examples";
                let i = 0;
                let questionInterval = setInterval(() => {
                    if(i >= userData.intents.length){
                        clearInterval(questionInterval);
                        return;
                    }
                    let currentIntent = userData.intents[i];
                    options.body = [];
                    for (let j = 0; j < currentIntent.questions.length; j++) {
                        options.body.push({
                            "text": currentIntent.questions[j],
                            "intentName": currentIntent.name,
                            "entityLabels": []
                        });

                        numberOfQuestions++;
                    }
                    requestPromise(options);

                    i++;
                }, waitTimeForLUIS);
            }).delay(waitTimeForLUIS * userData.intents.length *1.5)
            .then(res => {
                console.log("Questions done");
                options.method = "GET";
                return new Promise(function (resolve) {
                    let waitUntilIntentsCreatedIntervall = setInterval(() => {
                        requestPromise(options)
                            .then(res => {
                                if (res.length >= numberOfQuestions) {
                                    clearInterval(waitUntilIntentsCreatedIntervall);
                                    options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId + "/versions/" + initVersion + "/train";
                                    options.method = "POST";
                                    resolve(res);
                                }
                            })
                    }, waitTimeForLUIS)
                })
            }).delay(waitTimeForLUIS*4)
            .then(() => requestPromise(options))
            .delay(waitTimeForLUIS)
            .then(res => {
                console.log("Start Training");
                options.method = "GET";
                return new Promise(function (resolve) {
                    let waitUntilIntentsCreatedIntervall = setInterval(() => {
                        requestPromise(options)
                            .then(res => {
                                let trainingDone = true;
                                for (let i = 0; i < res.length && trainingDone; i++) {
                                    if (res[i].details.statusId === 1) {
                                        // TODO maybe retrain?
                                        throw new Error(messages.errorWhileCreating, 409);
                                    }
                                    if (res[i].details.statusId !== 0) {
                                        trainingDone = false;
                                    }
                                }
                                if (trainingDone) {
                                    console.log("Training done");
                                    clearInterval(waitUntilIntentsCreatedIntervall);
                                    options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId + "/publish";
                                    options.method = "POST";
                                    options.body = {
                                        "versionId": "1.0",
                                        "isStaging": false,
                                        "region": "westus"
                                    }
                                    resolve(res);
                                }
                            })
                    }, waitTimeForLUIS)
                })
            })
            .delay(waitTimeForLUIS)
            .then(() => requestPromise(options))
            .delay(waitTimeForLUIS)
            .then(res => {
                userData.id = appId;
                userData.status = "running";

            })
            .then(() => createLivepersonUser(userData, auth))
            .then(response => {
                if(response !== undefined)
                    console.log("User with Skill ID " + response + " has been created!");
                    userData.skill = response;
            })
            .then(() =>dbcon.writeToDB({
                "data": userData
            }))
            .then(success => {
                if(success){
                    let res = {
                        botId:appId
                    };
                    ncmd.run('docker run -e BOT_ID="' + appId + '" runtime');
                    // TODO Start Docker Image with appId from here!
                    console.log("Successfully wrote to DB!");
                    responseToClient(clientResponse, 201, false, messages.botHasBeenCreated, res);
                }else{
                    responseToClient(clientResponse, 500, true, messages.writeDBError);
                    console.log("Error occured while writing into mongodb!");
                }

            })
            .catch(err => {
                    console.log(err.statusCode);
                    console.log(err.message);
                    if (err.statusCode === 400) {
                        responseToClient(clientResponse, 409, true, messages.botAlreadyExists);
                    } else if (err.statusCode === 409) {
                        responseToClient(clientResponse, 409, true, messages.errorWhileCreating);
                        options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + appId
                        options.method = "DELETE";
                        requestPromise(options);
                    } else {
                        responseToClient(clientResponse, err.statusCode, err.message);
                    }
                }
            );

    }else{
        userData.id =  Date.now() + "id";
        userData.status = "test";
        dbcon.writeToDB({
            data: userData
        }).then(success => {
            console.log("Test");
            if(success){
                responseToClient(clientResponse, 200, false, "Test Erfolgreich", {botId: userData.id});
            }else {
                responseToClient(clientResponse, 500, true, messages.writeDBError);
            }
        });
    }
});


router.post("/test", function(req, res){
    if(updateIntents([{
        "id": 0,
        "name": "password_trouble",
        "answer": "I will forward you to the password FAQ Bot",
        "nextIntents": [-1],
        "forwardTo": "1eed14b1-7bec-4752-a2a2-fc26b146d6ec",
        "questions": ["I have problems with my password!", "I need a new password", "password", "password problems"]
    },
        {
            "id": 1,
            "name": "Account_problem",
            "answer": "Describe you problem.",
            "nextIntents": [0],
            "questions": ["I have a problem with my account", "My account is locked", "Account"]
        }
    ], "de88eb67-172c-432a-a010-1b5e25c6a35b")){
        responseToClient(res, 200, false, "Done", "WUHU");
    }else{
        responseToClient(res, 400, true, "Not done", "Moah");
    }
})

function createLivepersonUser(bot, accountId){
    return new Promise(resolve => {
        let skillId= -1;
        const livePersonLoginDomain = "https://lo.agentvep.liveperson.net/api/account/" + accountId + "/login?v=1.3";
        const livePersonAccountDomain = "https://lo.ac.liveperson.net/api/account/" + accountId + "/configuration/le-users/users";
        const livePersonSkillDomain = "https://lo.ac.liveperson.net/api/account/" + accountId + "/configuration/le-users/skills"
        const createUserPayload = {
            "loginName": bot.name,
            "fullName": bot.name,
            "nickname": bot.name,
            "isEnabled": true,
            "maxChats": -1,
            "email": "bot@sep-ravenclaw.de",
            "passwordSh": "ROFLTEST",
            "memberOf": {"agentGroupId": "-1", "assignmentDate": "2015-06-22 19:20:03"},
            "permissionGroups":[1],
            "profileIds": [968980532, 968980832, 968980732, 968980632],
            "isApiUser": false,
            "userTypeId": "2"
        };
        const authPayload = {
            "username":"BotMaster",
            "password":"masterOfBots"
        };
        const skillPayload = {
            "name":bot.name + "Skill",
            "skillRoutingConfiguration":[
                {
                    "priority":1,
                    "splitPercentage":10,
                    "agentGroupId":-1
                }
            ]
        };

        let options = {
            "uri":livePersonLoginDomain,
            "method":"POST",
            "body":authPayload,
            "headers":{
                "Content-Type":"application/json"
            },
            "json":true
        };
        if(bot.botType === "welcome"){
            requestPromise(options)
                .then(response => {
                    options.headers.Authorization = "Bearer " + response.bearer;
                    options.uri = livePersonAccountDomain;
                    options.body = createUserPayload;
                    requestPromise(options).then(response => {
                                resolve(response.id);

                    })
                })
        }else {
            requestPromise(options)
                .then(response => {
                    options.headers.Authorization = "Bearer " + response.bearer;
                    options.uri = livePersonSkillDomain;
                    options.body = skillPayload;
                    requestPromise(options).then(response => {
                        createUserPayload.skillIds = [response.id];
                        skillId = response.id;
                        options.uri = livePersonAccountDomain;
                        options.body = createUserPayload;
                        requestPromise(options)
                            .then(response => {
                                resolve(skillId);
                            })
                    })
                })
        }


    })
}
function deleteLivepersonUser(bot, accountId){
    return new Promise(resolve => {
        const livePersonLoginDomain = "https://lo.agentvep.liveperson.net/api/account/" + accountId + "/login?v=1.3";
        const livePersonAccountDomain = "https://lo.ac.liveperson.net/api/account/" + accountId + "/configuration/le-users/users";
        const livePersonSkillDomain = "https://lo.ac.liveperson.net/api/account/" + accountId + "/configuration/le-users/skills";
        const authPayload = {
            "username":"BotMaster",
            "password":"masterOfBots"
        };
        let options = {
            "uri":livePersonLoginDomain,
            "method":"POST",
            "body":authPayload,
            "headers":{
                "Content-Type":"application/json"
            },
            "json":true
        };
        requestPromise(options)
            .then(response => {
                options.headers.Authorization = "Bearer " + response.bearer;
                options.uri = livePersonAccountDomain;
                options.method = "GET";
            }).then(() => requestPromise(options))
            .then(response => {
                let accountId = undefined;
                for(let i = 0; i<response.length && accountId === undefined; i++){
                    if(response[i].loginName === bot.name){
                        accountId = response[i].id;
                    }
                }
                options.method = "DELETE";
                options.body = [accountId];
            })
            .then(() => requestPromise(options))
            .then(response => {
                delete options.body;
                options.uri = livePersonSkillDomain + "/" +  bot.skill;
            }).then(requestPromise(options))
            .then(response => {
                resolve(response);
            });
    })
}


router.get('/bot/public', function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.setHeader("Content-Type", "text/html; charset=utf-8");
    let bots = dbcon.readFromDB({
    }).then(res => {
        let retval = [];
        for(let i = 0; i<res.length; i++){
            if(res[i].privacy === "public"){
                retval.push(res[i]);
            }
        }
        responseToClient(clientResponse, 200, false, messages.botsFound, retval);
    });
});
/**
 * Delete
 * Deletes the specified Bot.
 *
 * Parameters:
 *      :id - ID of the bot which should be deleted
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.delete("/bot/:id", function (req, clientResponse) {
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }

    // options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + exres.agentResponse.id;
    clientResponse.header("Access-Control-Allow-Origin", "*");
    let id = req.params.id;
    let options = {
        uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + id,
        method: 'DELETE',
        headers: {
            "Ocp-Apim-Subscription-Key": APPKEY
        },
        json: true
    };
    let userData = req.body;
    let bot = undefined;
    if(userData.test !== undefined){
        dbcon.deleteFromDB({
            botId:id
        }).then(success => {
            if(success){
                responseToClient(clientResponse, 200, false, messages.botDeleted);
            }else{
                responseToClient(clientResponse, 404, true, messages.botNotFound);
            }
        });
    }else {
        existsAgent(id).then(res => {
            if (!res.exists) {
                responseToClient(clientResponse, 404, true, messages.botNotFound);
            }

            else {
                requestPromise(options).then(res => {
                    dbcon.readFromDB({
                        botId: id
                    }).then(response => {
                        bot = response;
                        dbcon.deleteFromDB({
                            botId: id
                        }).then(success => {
                            if(success){
                                deleteLivepersonUser(bot, auth);
                                responseToClient(clientResponse, 200, false, messages.botDeleted);
                            }else{
                                responseToClient(clientResponse, 404, true, messages.botNotFound);
                            }
                        });
                    })
                }).catch(err => {
                    responseToClient(clientResponse, 400, true, err.message);
                })
            }
        }).catch(err => {
            responseToClient(clientResponse, 400, true, err.message);
        })
    }
});

/**
 * Update
 * Updates the bot with new Data.
 *
 * Parameters:
 *      :id - ID of the bot which sould be updated
 *      data - JSON Object of the Bot.
 *              name - name of the Bot
 *              img - image of the Bot
 *              description - description of the Bot
 *              intents - an Array of intents
 *                      id - id of the intent
 *                      name - name of the intent
 *                      answer - answer when this intent is called
 *                      nextIntents - an Array of ID's of the following intents
 *                      questions - an Array of Strings, how you could ask for this intent
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.put('/bot/:id', function(req, clientResponse){
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    let id = req.params.id;
    dbcon.readFromDB({
        botId:id
    }).then(res => {
        console.log(res);
        res.name = req.body.name;
        let write = dbcon.writeToDB({
            botId:id,
            data:res
        }).then(success => {
            if(success){
                responseToClient(clientResponse, 200, false, messages.botUpdated, res);
            }else{
                responseToClient(clientResponse, 404, true, messages.botNotFound);
            }
        });
    })
});

/**
 * Returns a bot by ID 
 */
router.get('/bot/:id', function(req, clientResponse){
    let auth = req.header("Authorization");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    let id = req.params.id;
    dbcon.readFromDB({
        botId:id
    }).then(res => {
        if (Object.getOwnPropertyNames(res).length !== 0) {
            responseToClient(clientResponse, 200, false, messages.botFound, res)
        } else {
            responseToClient(clientResponse, 404, true, messages.botNotFound)
        }        
    })
})
/**
 * Config
 * This endpoint is for getting a request to save config-files into the database.
 */
router.put('/bot/:id/config', function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Origin", "*");
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
    }
    let id = req.params.id;
    let body = req.body;
    dbcon.writeConfig(body, id);

    responseToClient(clientResponse, 200, false, messages.botUpdated);
})

/**
 * Status
 * When you make a get Request on this endpoint, the bot status is returned. "stopped" for a stopped bot, "running" for
 * a running Bot, "test" for a test state and "problem" when a unknown problem occured.
 *
 * Parameters:
 *      :id - ID of the bot
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.get('/bot/:id/status', function(req, clientResponse){
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    let id = req.params.id;
    dbcon.readFromDB({
        "botId":id
    }).then(bot => {
        responseToClient(clientResponse, 200, false, messages.botsFound, {"status":bot.status});
    });
});

router.put('/bot/:id/privacy', function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Origin", "*");
    let auth = req.header("Authorization");
    let id = req.params.id;
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    let privacy = req.body.privacy;
    if(privacy === undefined){
        responseToClient(clientResponse, 406, true, messages.privacyNotAcceptable);
        return;
    }
    dbcon.setPrivacy(id, privacy)
    .then(function () {
        responseToClient(clientResponse, 200, false, messages.privacyUpdated);
    })
    .catch(function () {
        responseToClient(clientResponse, 500, true, messages.botNotFound);
    })
});

/**
 * Start bot
 * When you make a put Request on this Endpoint, the bot which is specified by :id get started
 *
 * Parameters:
 *      :id - ID of the bot
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.put('/bot/:id/start', function(req, clientResponse){
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    clientResponse.header("Access-Control-Allow-Origin", "*");

    let id = req.params.id;
    dbcon.readFromDB({
        botId:id
    }).then(res => {
        if(res !== {}){
            res.status = "running";
            let write = dbcon.writeToDB({
                botId:id,
                data:res
            }).then(success => {
                if(success){
                    responseToClient(clientResponse, 200, false, messages.botHasBeenStarted);
                }else{
                    responseToClient(clientResponse, 500, true, messages.botNotFound);
                }
            });


        }

    });
});

/**
 * Stop bot
 * When you make a put Request on this Endpoint, the bot which is specified by :id is stopped.
 *
 * Parameters:
 *      :id - ID of the bot
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.put('/bot/:id/stop', function(req, clientResponse){
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    clientResponse.header("Access-Control-Allow-Origin", "*");

    let id = req.params.id;
    dbcon.readFromDB({
        botId:id
    }).then(res => {
        if(res !== {}){
            res.status = "stopped";
            let write = dbcon.writeToDB({
                botId:id,
                data:res
            }).then(success => {
                if(success){
                    responseToClient(clientResponse, 200, false, messages.botHasBeenStopped);
                }else{
                    responseToClient(clientResponse, 500, true, messages.botNotFound);
                }
            });
        }

    });

});

function updateIntents(intents, botId){
    let options = {
        uri: "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/versions/1.0/intents/",
        method:"GET",
        body: {},
        headers: {
            "Ocp-Apim-Subscription-Key": APPKEY,
            "Content-Type": "application/json"
        },
        json:true
    }
    let existLength = 0;
    return requestPromise(options)
        .then(response => {
            existLength = response.length;
            options.method = "DELETE";
            for(let i = 0; i<response.length; i++){
                setTimeout(() => {
                    if(response[i].name === "None")return;
                    options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/versions/1.0/intents/" + response[i].id;
                    requestPromise(options);
                }, i*waitTimeForLUIS);
            }
        }).delay((existLength+5)*waitTimeForLUIS)
        .then(() => {

            options.method = "POST";
            options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/versions/1.0/intents/";
            for(let i = 0; i<intents.length; i++){
                setTimeout(() => {
                    options.body = {
                        "name": intents[i].name
                    };
                    requestPromise(options)
                }, (i+5)*waitTimeForLUIS);
            }
        }).delay((intents.length+1)*waitTimeForLUIS)
        .then(() => {
            options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/versions/1.0/examples";
            options.body = [];
            for(let i = 0; i<intents.length; i++){
                    for(let j = 0; j<intents[i].questions.length; j++) {
                        options.body.push({
                            text: intents[i].questions[j],
                            intentName: intents[i].name,
                            entityLabels: []
                        })
                    }
            }
            requestPromise(options);
    }).delay(waitTimeForLUIS*2)
        .then(() => {
            options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/versions/1.0/train";
            options.body = {};
            requestPromise(options);
        }).then(() => {
        options.method = "GET";
        let done = false;
        return new Promise(function (resolve) {
            let waitUntilIntentsCreatedIntervall = setInterval(() => {
                if(done)return;
                requestPromise(options)
                    .then(res => {
                        let trainingDone = true;
                        for (let i = 0; i < res.length && trainingDone; i++) {
                            if (res[i].details.statusId === 1) {
                                // TODO maybe retrain?
                                throw new Error(messages.errorWhileCreating, 409);
                            }
                            if (res[i].details.statusId !== 0) {
                                trainingDone = false;
                            }
                        }
                        if (trainingDone) {
                            done = true;
                            clearInterval(waitUntilIntentsCreatedIntervall);
                            options.uri = "https://westus.api.cognitive.microsoft.com/luis/api/v2.0/apps/" + botId + "/publish";
                            options.method = "POST";
                            options.body = {
                                "versionId": "1.0",
                                "isStaging": false,
                                "region": "westus"
                            };
                            requestPromise(options).then(res => {
                                resolve(true);
                            })
                        }
                    })
            }, waitTimeForLUIS)
        })
    })
        .then(res => {
            return true;
        })


}

function addToIntents(intents, children, blocks, intentIDCount) {
    let nextIntents = [];
    for (const group of children) {
        let block = blocks.get(group.block);   
        let intent = {
            id: intentIDCount.count++,
            name: block.title,
            answer: block.answer,
            questions: block.questions,
            nextIntents: group.children.length > 0 ? addToIntents(intents, group.children, blocks, intentIDCount) : []
        }
        intents.push(intent);
        nextIntents.push(intent.id);
    }

    return nextIntents;
}

router.parseConfigTointents = function(bot){
    let config = bot.config;
    let welcomeMsg = '';
    if(config === null){
        return;
    }

    let blockMap = new Map(config.blocks.map(obj => [ obj.id, obj ]));
    // Try to find a welcome message block
    for (const group of config.groups) {
        let block = blockMap.get(group.block);
        if (block.title.toUpperCase() === 'WELCOME MESSAGE') {
            welcomeMsg = block.answer;
        }
    }

    bot.originIntentState = {
        id: -1,
        answer: welcomeMsg,
        nextIntents: []
    };

    bot.originIntentState.nextIntents = addToIntents(bot.intents, config.groups, blockMap, {count: 0});
};

/**
 * Query
 * Starts a query to LUIS and responses an answer
 *
 * Parameters:
 *      :id - ID of the bot
 *      :query - Query for LUIS
 * Headers:
 *      Authorization - Account ID from LiveEngage to identify the bots this customer owns.
 */
router.get('/bot/:id/query/:query', function (req, clientResponse) {
    let auth = req.header("Authorization");
    if(auth === undefined){
        responseToClient(clientResponse, 401, true, messages.unauthorized);
        return;
    }
    clientResponse.header("Access-Control-Allow-Origin", "*");
    const id = req.params.id;
    const query = req.params.query;

    existsAgent(id).then(res => {
        if(res.exists){
            LUISClient = ILuis({
                appId:id,
                appKey:APPKEY,
                verbose:true
            });
            LUISClient.predict(query, {
                onSuccess: function(response){
                    console.log(response);
                    dbcon.readFromDB({
                        botId: id
                    }).then(bot => {
                        for(let i = 0; i<bot.intents.length; i++){
                            if(bot.intents[i].name === response.topScoringIntent.intent){
                                responseToClient(clientResponse, 200, false, bot.intents[i].answer);
                            }
                        }
                    })
                },
                onFailure: function(res){
                    console.log(res);
                }
            })
        } else {
            responseToClient(clientResponse, 404, true, messages.botNotFound);
        }
    })

});



// options. They set some Headers for CORS

router.options("/bot/:id/privacy", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});

router.options("/bot/public", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});

router.options("/auth", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "POST, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});

router.options("/bot", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});
router.options("/bot/:id", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "DELETE, PUT, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});
router.options("/bot/:id/config", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});
router.options("/bot/:id/status", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});
router.options("/bot/:id/start", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});
router.options("/bot/:id/stop", function(req, clientResponse){
    clientResponse.header("Access-Control-Allow-Methods", "PUT, OPTIONS");
    clientResponse.header("Access-Control-Allow-Origin", "*");
    clientResponse.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
    clientResponse.header("Acces-Control-Max-Age", 86400);
    clientResponse.end();
});

module.exports = router;
