const assert = require('assert');
const url = 'mongodb://141.19.145.166:27017/mydb'

let mongo = require('mongodb');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

let server;
const authKey = 'ed2ff1a97f924b8e8a1402e6700a8bf4';

chai.use(chaiHttp);

beforeEach(function () {
    server = require('../app');
})
/**
 * Test for the post method to insert a bot
 */
describe('/POST botconfig', () => {

    it('should insert a bot', (done) => {

        let testBot = { name: 'pinkSparkles', description: 'Titty streamer on twitch.tv', test: true, privacy: 'public',  botType : 'faq', intents: [] };

        chai.request(server)
            .post('/bot')
            .set('Authorization', authKey)
            .send(testBot)
            .end((err, res) => {
                res.should.have.status(200)
                console.log(res.body)
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

    let botId;

    beforeEach(function () {
        let testBot = ({ name: 'Martina Schulz', 
        botType : 'faq' })

        mongo.connect(url, function (err, db) {
            if (err) console.log('Can not connect to the mongo DB in /GET botconfig')

            db.collection('botAgents').insertOne(testBot, function (err, res) {
                if (err) console.log('Martina thinks that mongo is a weirdo')
                botId = testBot._id;
                //set botId with the id from martina. Does res include it?
            })
            db.close();
        })
    })
    it('should ban Martina out of mongo', (done) => {

        chai.request(server)
            .delete('/bot/:' + botId)
            .send()
            .end((err, res) => {
                res.should.have.status(200)
                done();
            })
    })
})

/**
 * Test for updating the Name from a bot which already exists in the database
 */
/*describe('/UPDATE botconfig', () => {

    beforeEach(function () {
        let testBot = {
            'name': 'Kevin',
            'botType': 'faq' 
        }
    })
})
*/

/**
 * Test for updating the name of an Intent
 */
describe('/PUT intentname', () => {

    let testBot = { 'name': 'botMitNamenlosenIntents' };
    let intentRequest = { 'data': { 'intents': { 'name': '' } } }
    let botId


    beforeEach(function (done) {
        chai.request(server)
            .post('/bot')
            .send(testBot)
            .end((err, res) => {
                //TODO: Fix this:
                //Error right here: Cannot read property of end
                console.log('And now this far! :D')
                botId = res.body.Id;
                done();
            });
    })
    
    afterEach(function (done) {
        chai.request(server)
        .delete('/bot/' + botId)
        .send()
        .end((err, res) => {
            done()
        });
    })

    it('should deny the request to put a nameless intent to testBot', (done) => {
        chai.request(server)
            .put('/bot/:' + botId)
            .send(intentRequest)
            .end((err, res) => {
                res.should.not.have.status(200);
                done();
            });
    })
})

describe('PUT start/stop', () => {
    let TestBot = { name : 'startStopBot' }
})

describe('GET status', () => {
    let TestBot = { name : 'Statussymbol',
    botType : 'faq' }
    let testBotId;

    before(function (done) {
        chai.request(server)
        .post('/bot')
        .send(testBot)
        .end((err, res) => {
            if (err) {
                console.log('Bot with name Statussymbol could not be inserted!');
                fail()
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
        .send()
        .end((err, res) => {
            res.should.have.status(200)
            res.body.status.should.have('stopped')
            done()
        })
    })
}) 