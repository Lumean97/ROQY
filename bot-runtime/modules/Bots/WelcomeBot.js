
const GeneralBot = require('./GeneralBot');

let runtime;

class WelcomeBot extends GeneralBot {

    constructor(conf, rtm, welcome) {
        super(conf, rtm, welcome);
        runtime = rtm;
    }

        queryResponse(message, conv){
        return new Promise(function(resolve){

            runtime.LUISClient.predict(message, {
                onSuccess: function(response){
                    let avialableIntents = [];

                    for(let i = 0; i<conv.intentState.nextIntents.length; i++){
                        for(let j = 0; j<conv.config.length; j++){
                            if(conv.config[j].id === conv.intentState.nextIntents[i]){
                                avialableIntents.push(conv.config[j]);
                            }
                        }
                    }

                    let topIntent = {
                        score:0
                    };
                    for(let i = 0; i<avialableIntents.length; i++){
                        for(let j = 0; j<response.intents.length; j++){
                            if(avialableIntents[i].name === response.intents[j].intent && response.intents[j].score > topIntent.score && response.intents[j].score >= 0.1){
                                topIntent = avialableIntents[i];
                                topIntent.score = response.intents[j].score;
                            }
                        }
                    }
                    if(response.topScoringIntent === 'None'){
                        resolve(undefined);
                    }else{
                        delete topIntent.score;
                        resolve(topIntent);
                    }
                },
                onFailure: function(response)
                {
                    console.log(response);
                }
            })

        });
    }


}

module.exports = WelcomeBot;