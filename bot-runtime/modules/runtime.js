/**
 * Created by manuel.schwalm on 14.11.17.
 */

/*
Features to implement:
FAQ Bot Conversation
When should we forward to another bot?
Function: forwardToAgent()
Function: assignSkill(String botId)

Questions for Liveperson:
Wenn ein Bot auf der Oberfläche erstellt wird, wie erhält er beispielsweise einen Skill, dass er für password_recovery
zuständig ist? Gibt es eine API um Skills & Agents in LiveEngage zu erstellen?



 */

const Agent = require('node-agent-sdk').Agent;
const config = require('dotenv').config;
const GeneralBot = require('./Bots/GeneralBot');
const WelcomeBot = require('./Bots/WelcomeBot');
const FAQBot = require('./Bots/FAQBot');
const APPKEY = "ed2ff1a97f924b8e8a1402e6700a8bf4";
const LUISClient = require('luis-node-sdk');

const botType = {
    welcome:"welcome",
    faq:"faq"
}

let agent;
config();
const observer = require('./observer');
const refreshTime = 5000;
const state = {
    running: "running",
    stopped: "stopped",
    test: "test"
};



let runtime = {};
let bot = undefined;

/*let bot = {
    "name":"botTester1ForLUIS",
    "description":"I am a bot Test",
    "intents": [

        {
            "id": 0,
            "name":"weather",
            "answer": "Okay! I tell you something about weather!",
            "nextIntents": [
                1
            ],
            "questions": [
                "Tell me something about weather!"
            ]
        },
        {
            "id": 1,
            "name":"weather_for",
            "answer": "Very good!!",
            "nextIntents": [0, 2],
            "questions": [
                "How will be weather?"
            ]
        },
        {
            "id": 2,
            "name":"sky",
            "answer": "Sure, when do you want to get program?",
            "nextIntents": [3, 4],
            "questions": [
                "Could you tell me what will be on sky?"
            ]
        },
        {
            "id": 3,
            "name":"matrix",
            "answer": "At 20:15 you can see Matrix! Do you want to get more program?",
            "nextIntents": [5, 6],
            "questions": [
                "20:15",
                "At 20:15"
            ]
        },
        {
            "id": 4,
            "name":"matrix_reloaded",
            "answer": "At 22:15 you can see Matrix: Reloaded! Do you want to get more program?",
            "nextIntents": [5, 6],
            "questions": [
                "22:15",
                "At 22:15"
            ]
        },
        {
            "id": 5,
            "name":"sky_yes",
            "answer": "Okay, when do you want to get the next program?",
            "nextIntents": [3, 4],
            "questions": [
                "Yes",
                "Sure",
                "definetly"
            ]
        },
        {
            "id": 6,
            "name":"sky_no",
            "answer": "Okay, how may I help you?",
            "nextIntents": [0, 2],
            "questions": [
                "No",
                "Never"
            ]
        }
    ],
    "intentState": {
        "id": -1,
        "nextIntents": [
            0
        ]
    },
    "botType":"welcome",
    "privacy":"private",
    "img":"../assets/bot.png",
    "status": "running"
};
*/

runtime.delConversation = function(convId){
    delete bot.conversations[convId];
    console.log(bot.conversations);
}

runtime.addConversation = function(convId){
    if(bot.conversations === undefined)
        bot.conversations = {};
    if(bot.conversations[convId] === undefined)
    bot.conversations[convId] = {
        convId:convId,
        intentState: bot.originIntentState,
        recentlyStarted: true,
        config: bot.intents
    };
    console.log(bot.conversations);
};

runtime.start = function (botId) {
    runtime.LUISClient = LUISClient({
        appId:botId,
        appKey:APPKEY,
        verbose:true
    });
    observer.start(runtime, botId);

};

runtime.init = function(botId) {
    log("Runtime mit der Bot ID " + botId + " wurde gestartet!");
    const credentials = {
        accountId:23625217,
        username: bot.name,
        password: "ROFLTEST"
    };
    console.log(credentials);
    if(bot.botType === botType.welcome){
        agent = new WelcomeBot(credentials, runtime, bot.originIntentState.answer);
    }else if(bot.botType === botType.faq){
        agent = new FAQBot(credentials, runtime, bot.originIntentState.answer);
    }else{
        agent = new GeneralBot(credentials, runtime, bot.originIntentState.answer);
        console.error("Warning: General Bot is not for Productivity!");
    }

    agent.on('GeneralBot.ContentEvnet',(contentEvent)=>{
        let conv = bot.conversations[contentEvent.dialogId];
        if(conv === undefined){
            runtime.addConversation(contentEvent.dialogId);
            conv = bot.conversations[contentEvent.dialogId];
        }
        if(conv.recentlyStarted){
            conv.recentlyStarted = false;
            return;
        }
        let response = "Sorry, I could not understand you :(.";
        agent.queryResponse(contentEvent.message, conv).then(nextIntent => {
            if(nextIntent !== undefined){
                conv.intentState = nextIntent;
                response = nextIntent.answer;
            }
            if(nextIntent.forwardTo !== undefined)
                agent.assignSkill(nextIntent.forwardTo, contentEvent.dialogId);
            agent.publishEvent({
                dialogId:contentEvent.dialogId,
                event: {
                    type:'ContentEvent',
                    contentType:'text/plain',
                    message: response
                }
            })
        });

    });
}

runtime.update = function (updatedBot) {
    if(bot === undefined){
        bot = updatedBot;
        runtime.init(updatedBot.id);
    }
    if(bot.conversations !== undefined)
    updatedBot.conversations = bot.conversations;
    bot = updatedBot;
    observer.saveBot(bot);
};

runtime.checkSyntax = function (bot) {
    let initState = bot.id && bot.status && bot.intents && bot.originIntentState;
    if(bot.status === undefined){
        observer.error("Bot status must be set!", bot.id);
    }
    else if(bot.status !== "running" || bot.status !== "stopped" || bot.status !== "error"){
        observer.error("Bot status is invalid: " + bot.status, bot.id);
    }
    else if(bot.intents === undefined){
        observer.error("Intents must be set, or at least an array!", bot.id);
    }
    else if(bot.status === undefined){
        observer.error("Bot status must be set!", bot.id);
    }


}


function log(out, err, resp){
    err = err || "";
    resp = resp || "";
    console.log("[" + bot.name + "] " + out, err, resp);
}

module.exports = runtime;