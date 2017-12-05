const GeneralBot = require('./GeneralBot');


let runtime;
class FAQBot extends GeneralBot {
    constructor(conf, rtm, welcome){
        super(conf, rtm, welcome);
        runtime = rtm;
        console.log("FAQ")
    }

    queryResponse(message, conv){

        return new Promise(function(resolve){
            runtime.LUISClient.predict(message, {
                onSuccess: function(response){
                    let topIntent = undefined;
                    for(let i = 0; i<conv.config.length; i++){
                        if(conv.config[i].name === response.topScoringIntent.intent){
                            topIntent = conv.config[i];
                        }
                    }

                    if(response.topScoringIntent.intent === 'None'){
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

module.exports = FAQBot;