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
                        })
                }
                done();
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

    let testBot = { 'name': 'botMitNamenlosenIntents' };
    let intentRequest = { 'data': { 'intents': { 'name': '' } } }
    let botId


    beforeEach(function (done) {
        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                botId = res.body.Id;
                done();
            });
    })

    afterEach(function (done) {
        chai.request(server)
            .delete('/bot/' + botId)
            .set('Authorization', authKey)
            .send()
            .end((err, res) => {
                done()
            });
    })

    it('should deny the request to put a nameless intent to testBot', (done) => {
        chai.request(server)
            .put('/bot/' + botId)
            .set('Authorization', authKey)
            .send(intentRequest)
            .end((err, res) => {
                res.should.not.have.status(200);
                done();
            });
    })
})

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
        name: 'Statussymbol',
        botType: 'faq'
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
                    done()
                }
                else {
                    testBotId = res.body.Id
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