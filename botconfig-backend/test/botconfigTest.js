const assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
const chaiJson = require('chai-json');
const fs = require('fs');
let should = chai.should();
const backend = require('../routes/botconfig')
let server;
const authKey = '23625217';

chai.use(chaiHttp);

/*testBot-Template for copy-pasta
    testBot = {
        name : 'StartStopBot',
        description : 'Im a testobject to test the start-stop-technology',
        test : true,
        privacy : 'public',
        botType : 'faq',
        intents : []
    }
*/

beforeEach(function () {
    server = require('../app');
})

/* testBot-Template 
testBot = {
    name : '',
    description : '',
    test : true,
    privacy : 'public',
    botType : 'faq',
    intents : []
}
*/

/**
 * Test for the post method to insert a bot
 */
describe('/POST botconfig', (suite) => {
    it('should insert a bot', (done) => {

        let testBot = { name: 'pinkSparkles', description: 'Titty streamer on twitch.tv', test: true, privacy: 'public', botType: 'faq', intents: [] };

        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    console.log('pinkSparkles is a Zicke and dont wants to get inserted')
                }
                else {
                    res.should.have.status(200)
                    chai.request(server)
                        .delete('/bot/' + res.body.extra.botId)
                        .set('Authorization', authKey)
                        .send(testBot)
                        .end((err, res) => {
                            if (err) console.log('pinkSparkles isnt banned yet!')
                            done();
                        })
                }
            });
    })
    /*
    it('should insert REAL bot', (done) => {
        let testBot = { name: 'pinkSparklesforLUIS', description: 'Titty streamer on twitch.tv', privacy: 'public', botType: 'faq', intents: [] };
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    console.log('pinkSparkles is a Zicke and dont wants to get inserted')
                }
                else {
                    res.should.have.status(201)
                    chai.request(server)
                        .delete('/bot/' + res.body.extra.botId)
                        .set('Authorization', authKey)
                        .send()
                        .end((err, res) => {
                            if (err) console.log('pinkSparkles isnt banned yet!')
                            done();
                        })
                }
            });
    });
    it('should insert REAL bot welcome', (done) => {
        let testBot = { name: 'pinkSparklesforLUIS2', description: 'Titty streamer on twitch.tv', privacy: 'public', botType: 'welcome', intents: [] };
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    console.log('pinkSparkles is a Zicke and dont wants to get inserted')
                }
                else {
                    res.should.have.status(201)
                    chai.request(server)
                        .delete('/bot/' + res.body.extra.botId)
                        .set('Authorization', authKey)
                        .send()
                        .end((err, res) => {
                            if (err) console.log('pinkSparkles isnt banned yet!')
                            done();
                        })
                }
            });
    });
*/
})

/**
 * Test for the get method to get all bots from the database
 */
describe('/GET botconfig', () => {

    it('should return an array of bots', (done) => {

        chai.request(server)
            .get('/bot')
            .set('Authorization', authKey)
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
    })
})

/**
 * Test for the delete method to delete a bot from the database
 */
describe('/DELETE botconfig', () => {
    it('should ban Martina out of mongo', (done) => {
        let botId;


        let testBot = ({
            name: 'Martina Schulz',
            description: 'I am your personal waifu and fab',
            test: true,
            privacy: 'public',
            botType: 'faq',
            intents: []
        })

        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    console.log('Martina thinks, mongo is a weirdo and cant get inserted.')
                }
                botId = res.body.extra.botId;
                chai.request(server)
                    .delete('/bot/' + botId)
                    .set('Authorization', authKey)
                    .send(testBot)
                    .end((err, res) => {
                        res.should.have.status(200)
                        done();
                    })
            })

    })
})

describe('/PUT rename', () => {
    let testBot = {
        name : 'testBotBefore',
        description : 'Im a testobject to test the start-stop-technology',
        test : true,
        privacy : 'public',
        botType : 'faq',
        intents : []
    };
    before((done) => {
    chai.request(server)
        .post('/bot')
                .set('Authorization', authKey)
                .send(testBot)
                .end((err, res) => {
                    testBot.id = res.body.extra.botId;
                    done();
                })
        });

    it('should get an error due no name', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/rename')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(406);
                done();
            })
    });

    it('should error due false bot', (done) => {
        chai.request(server)
            .put('/bot/' + undefined + '/rename')
            .set('Authorization', authKey)
            .send({name:"Test"})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    });

    it('should error due no Auth', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/rename')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    })

    it('should rename the bot', (done) => {
        let newName = "new name"
        chai.request(server)
            .put('/bot/' + testBot.id + '/rename')
            .set('Authorization', authKey)
            .send({name:newName})
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/bot/' + testBot.id)
                    .set('Authorization', authKey)
                    .send()
                    .end((err, res) => {
                        assert.equal(res.body.extra.name, newName);
                        done();
                    });
            })
    });
    after((done) => {
        console.log("Last")
        chai.request(server)
            .delete('/bot/' + testBot.id)
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) console.log('pinkSparkles isnt banned yet!')
                done();
            })
    })
});

describe('PUT start/stop', () => {

let testBot = {
        name : 'StartStopBot',
        description : 'Im a testobject to test the start-stop-technology',
        test : true,
        privacy : 'public',
        botType : 'faq',
        intents : []
    }
    let testBotId;
    before(function (done) {
        chai.request(server)
        .post('/bot')
        .set('Authorization', authKey)
        .send(testBot)
        .end((err, res) => {
            if (err) {
                fail('StartStopBot can get saved into database!')
            }
            else {
                testBotId = res.body.extra.botId;
                it('should show as status test for StartStopBot.', (done) => {
                    chai.request(server)
                    .get('/bot/' + testBotId + '/status')
                    .send()
                    .end((err, res) => {
                        res.should.have.status(200)
                        //TODO: The body from this bot inside the response should have test as status.
                    })
                })
                done()
            }
        })
    })

    after(function (done) {
        chai.request(server)
        .delete('/bot/' + botId)
        .send()
        .end((err, res) => {
            if (err) {
                console.log('StartStopBot cant get deleted!')
            }
        })
    })
})

describe('POST /auth', () => {
    it('should get an valid auth', (done) => {
        chai.request(server)
            .post('/auth')
            .send({
                "username":"Hallo",
                "password":"Welt"
            })
            .end((err, res) => {
            if(err)done(err);
            res.should.have.status(200);
            assert.equal(res.body.extra.Authorization, 23625217);
            done();
            });
    })
})

describe('GET status', () => {
    let testBot = {
        name : 'Statussymbol',
        description : '',
        test : true,
        privacy : 'public',
        botType : 'faq',
        intents : []
    }
    let testBotId;

    before(function (done) {
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    console.log('Bot with name Statussymbol could not be inserted!');
                    done(err);
                }
                else {
                    testBotId = res.body.extra.botId;
                    done();
                }
            })
    })

    it('should have Statuscode 200 and status stopped.', (done) => {
        chai.request(server)
            .get('/bot/' + testBotId + '/status')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                if (err) {
                    console.log('Status cant got read from DB')
                }
                else {
                    res.should.have.status(200);
                    console.log(testBotId);
                    chai.request(server)
                        .delete('/bot/' + testBotId)
                        .set('Authorization', authKey)
                        .send(testBot)
                        .end((err, res) => {
                            if (err) {
                                console.log('Statussymbol cant get deleted ')
                                done(err);
                            }
                        })
                }
            })
        done();
    })
})

function getNextIntents(nextIntents, intentMap) {
    let intents = [];
    for (const intent of nextIntents) {
        intents.push(intentMap.get(intent).name);
    }
    return intents;
}


describe('parse config to intents', () => {
    it('should return the correct config', () => {
        let parseConfigPayload = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/parseConfigPayload.json', 'utf8'));
        backend.parseConfigTointents(parseConfigPayload);
        parseConfigPayload.intents.should.have.lengthOf(11);
        let intentMap = new Map(parseConfigPayload.intents.map(obj => [obj.id, obj]));
        let initIntents = getNextIntents(parseConfigPayload.originIntentState.nextIntents, intentMap);

        initIntents.should.deep.equal(['A', 'E', 'F']);

        let nextIntent = intentMap.get(parseConfigPayload.originIntentState.nextIntents[0])
        let nextIntents = getNextIntents(nextIntent.nextIntents, intentMap);
        nextIntents.should.deep.equal(['B', 'D', 'H', 'F']);

        // Path to 'Test' block
        nextIntent = intentMap.get(parseConfigPayload.originIntentState.nextIntents[2])
        nextIntent.name.should.equal('F');
        nextIntent = intentMap.get(nextIntent.nextIntents[0])
        nextIntent.name.should.equal('G');
        nextIntent = intentMap.get(nextIntent.nextIntents[0])
        nextIntent.name.should.equal('I');
        nextIntent = intentMap.get(nextIntent.nextIntents[0])
        nextIntent.name.should.equal('Test');
        nextIntent.questions.should.have.members(['Wer', 'Wie', 'Was']);
        nextIntent.answer.should.equal('Warum');
    })

    it('should set the welcome message correctly', () => {
        let parseConfigPayload = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/welcomeTest.json', 'utf8'));
        backend.parseConfigTointents(parseConfigPayload);
        parseConfigPayload.intents.should.have.lengthOf(3);
        parseConfigPayload.originIntentState.answer.should.equal('Correct welcome message');
    });
    it('should come the correct config with empty intents', (done) => {
        let parseConfigExpected = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/parseConfigExpected.json', 'utf8'));
        let parseConfigPayload = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/parseConfigPayload.json', 'utf8'));
        parseConfigExpected.intents = [];
        parseConfigExpected.config = null;
        parseConfigExpected.originIntentState.nextIntents = [];
        parseConfigPayload.config = null;
        backend.parseConfigTointents(parseConfigPayload)
        assert.deepEqual(parseConfigPayload, parseConfigExpected);
        done();
    });
});

describe('PUT config', () => {
    let testBot = {
        name : 'TestBot',
        description : '',
        test : true,
        privacy : 'public',
        botType : 'faq',
        config: null,
        intents : []
    };
    before((done) => {
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                res.should.have.status(200);
                testBot.id = res.body.extra.botId;
                done();
            })
    });
    it('should error config due no auth', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/config')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });

    it('should update config', (done) => {
        testBot.config = {
            "rowSelect": 2,
            "rootSelect": 2,
            "blocks":[],
            "groups":[]
        };
        chai.request(server)
            .put('/bot/' + testBot.id + '/config')
            .set('Authorization', authKey)
            .send(testBot.config)
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/bot/' + testBot.id)
                    .set('Authorization', authKey)
                    .send()
                    .end((err, res) => {
                        setTimeout(() => {
                            console.log(res.body);
                            assert.deepEqual(res.body.extra.config, testBot.config);
                            done();
                        }, 1000);
                    });
            })
    });

    after((done) => {
        chai.request(server)
            .delete('/bot/' + testBot.id)
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
});

describe('PUT start/stop/privacy/status', () => {
    let testBot = {
        name : 'TestBot',
        description : '',
        test : true,
        privacy : 'public',
        botType : 'faq',
        intents : []
    };
    before((done) => {
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                res.should.have.status(200);
                testBot.id = res.body.extra.botId;
                done();
            })
    });
    it('should start bot', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/start')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/bot/' + testBot.id)
                    .set('Authorization', authKey)
                    .send()
                    .end((err, res) => {
                        assert.equal(res.body.extra.status, "running");
                        done();
                    });
            })
    });
    it('should error start due no auth', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/start')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });
    it('should error start due false botId', (done) => {
        chai.request(server)
            .put('/bot/' + undefined + '/start')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    });
    it('should stop bot', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/stop')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/bot/' + testBot.id)
                    .set('Authorization', authKey)
                    .send()
                    .end((err, res) => {
                        assert.equal(res.body.extra.status, "stopped");
                        done();
                    });
            })
    });
    it('should error stop due no auth', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/stop')
            .send()
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });
    it('should error stop due false botId', (done) => {
        chai.request(server)
            .put('/bot/' + undefined + '/stop')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    });
    it('should update privacy', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/privacy')
            .set('Authorization', authKey)
            .send({privacy:"public"})
            .end((err, res) => {
                res.should.have.status(200);
                chai.request(server)
                    .get('/bot/' + testBot.id)
                    .set('Authorization', authKey)
                    .send()
                    .end((err, res) => {
                        assert.equal(res.body.extra.privacy, "public");
                        done();
                    });
            })
    });
    it('should error update privacy due no auth', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/privacy')
            .send({privacy:"public"})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });
    it('should error update privacy due false botId', (done) => {
        chai.request(server)
            .put('/bot/' + undefined + '/privacy')
            .set('Authorization', authKey)
            .send({privacy:"public"})
            .end((err, res) => {
                res.should.have.status(404);
                done();
            })
    });
    it('should error update privacy due false privacy', (done) => {
        chai.request(server)
            .put('/bot/' + testBot.id + '/privacy')
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                res.should.have.status(406);
                done();
            })
    });

    it('should error status due no auth', (done) => {
        chai.request(server)
            .get('/bot/' + testBot.id + '/status')
            .send({privacy:"public"})
            .end((err, res) => {
                res.should.have.status(401);
                done();
            })
    });

    after((done) => {
        chai.request(server)
            .delete('/bot/' + testBot.id)
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            })
    })
})

describe('OPTIONS', () => {
    it('/auth', (done) => {
        chai.request(server)
            .options('/auth')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot', (done) => {
        chai.request(server)
            .options('/bot')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/public', (done) => {
        chai.request(server)
            .options('/bot/public')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id', (done) => {
        chai.request(server)
            .options('/bot/:id')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id/config', (done) => {
        chai.request(server)
            .options('/bot/:id/config')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id/status', (done) => {
        chai.request(server)
            .options('/bot/:id/status')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id/start', (done) => {
        chai.request(server)
            .options('/bot/:id/start')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id/stop', (done) => {
        chai.request(server)
            .options('/bot/:id/stop')
            .send()
            .end((err, res) => {
                done();
            })
    });
    it('/bot/:id/privacy', (done) => {
        chai.request(server)
            .options('/bot/:id/privacy')
            .send()
            .end((err, res) => {
                done();
            })
    });
});
