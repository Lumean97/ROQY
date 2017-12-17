/**
 * Created by manuel.schwalm on 14.11.17.
 */

const GeneralBot = require('./Bots/GeneralBot');
const WelcomeBot = require('./Bots/WelcomeBot');
const FAQBot = require('./Bots/FAQBot');
const APPKEY = "ed2ff1a97f924b8e8a1402e6700a8bf4";
const LUISClient = require('luis-node-sdk');
const botState = {
    running:"running",
    stopped:"stopped"
};
const HUMAN_SKILL_ID = "1007213732";
const botType = {
    welcome:"welcome",
    faq:"faq"
};

let agent;
const observer = require('./observer');




let runtime = {};
let bot = undefined;


runtime.delConversation = function(convId){
    delete bot.conversations[convId];
    console.log(bot.conversations);
};

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

runtime.stopBot = function(){
    agent.setAgentState({availability: "AWAY"});
};

runtime.startBot = function(){
    agent.setAgentState({availability: "ONLINE"});
};

runtime.init = function(botId) {
    log("Runtime mit der Bot ID " + botId + " wurde gestartet!");
    const credentials = {
        accountId:bot.account,
        username: bot.name,
        password: "ROFLTEST"
    };
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
        conv.failCount = conv.failCount || 0;
        if(conv.recentlyStarted){
            conv.recentlyStarted = false;
            return;
        }
        let response = "Sorry, I could not understand you :(.";
        agent.queryResponse(contentEvent.message, conv).then(nextIntent => {
            if(nextIntent !== undefined){
                conv.failCount = 0;
                conv.intentState = nextIntent;
                response = nextIntent.answer;
            }else{
                conv.failCount++;

            }
            if(nextIntent.forwardTo !== undefined){
                agent.assignSkill(nextIntent.forwardTo, contentEvent.dialogId);
            }
            if(conv.failCount >= 3){
                response = "Sorry, I could not understand you. I will forward you to an Agent."
                agent.assignSkill(HUMAN_SKILL_ID, contentEvent.dialogId);
            }
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
};

runtime.update = function (updatedBot) {
    if(updatedBot === undefined)return;
    if(updatedBot.status !== botState.running){
        return;
    }
    if(bot === undefined){
        bot = updatedBot;
        if(bot.conversations !== undefined){
            updatedBot.conversations = bot.conversations;
        }else{
            boz.conversations = {};
        }
        runtime.init(updatedBot.id);
    }else{
        console.log("Got in Start");

        bot = updatedBot;
        if(bot.state !== updatedBot.state){
            if(updatedBot.state === botState.running){
                runtime.startBot();
            }else if(updatedBot.state === botState.stopped){
                runtime.stopBot();
            }
        }
    }


    observer.saveBot(bot);
};

function log(out, err, resp){
    err = err || "";
    resp = resp || "";
    console.log("[" + bot.name + "] " + out, err, resp);
}

module.exports = runtime;