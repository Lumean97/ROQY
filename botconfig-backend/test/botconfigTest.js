const assert = require('assert');

let chai = require('chai');
let chaiHttp = require('chai-http');
const chaiJson = require('chai-json');
const fs = require('fs');
let should = chai.should();
const backend = require('../routes/botconfig')
let server;
const authKey = 'ed2ff1a97f924b8e8a1402e6700a8bf4';

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
describe('/POST botconfig', () => {

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

describe('/PUT intentname', () => {

})

describe('PUT start/stop', () => {

    let testBot = {
        name: 'StartStopBot',
        description: 'Im a testobject to test the start-stop-technology',
        test: true,
        privacy: 'public',
        botType: 'faq',
        intents: []
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
                "username": "Hallo",
                "password": "Welt"
            })
            .end((err, res) => {
                if (err) done(err);
                res.should.have.status(200);
                assert.equal(res.body.extra.Authorization, 23625217);
                done();
            });
    })
})

describe('GET status', () => {
    let testBot = {
        name: 'Statussymbol',
        description: '',
        test: true,
        privacy: 'public',
        botType: 'faq',
        intents: []
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

describe('insert an public bot and check if it gets returned', () => {
    it('should return the bot which got inserted before'), (done) => {
        let botId
        let testBot = {
            name: 'publicBot',
            description: 'Im public, everyone can take me',
            test: true,
            privacy: 'public',
            botType: 'faq',
            intents: []
        }

        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                if (err) {
                    done('publicBot cant get inserted!')
                }
                else {
                    botId = res.body.extra.botId
                    chai.request(server)
                    .get('/bot/public')
                    .send()
                    .end((err, res) => {
                        console.log("Found");
                        if (err) {
                            done('Cant recieve public-bots')
                        }
                        else {
                            let botFound = false;
                            for(let i = 0; i<res.body.extra.length; i++){
                                if(res.body.extra[i].id === botId){
                                    done();
                                    console.log("BOT FOUND");
                                    botFound = true;
                                }
                            }
                            if(!botFound)done("Bot not found");
                        }
                    })
                }
            })
    }
});

describe('parse config to intents', () => {
    it('should come the correct config', (done) => {
        let parseConfigExpected = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/parseConfigExpected.json', 'utf8'));
        let parseConfigPayload = JSON.parse(fs.readFileSync(__dirname + '/pre-built-jsons/parseConfigPayload.json', 'utf8'));
        backend.parseConfigTointents(parseConfigPayload)
        assert.deepEqual(parseConfigPayload, parseConfigExpected);
        done();
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