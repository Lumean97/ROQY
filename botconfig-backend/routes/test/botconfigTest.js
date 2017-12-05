const assert = require('assert');
const url = 'mongodb://141.19.145.166:27017/mydb'

let mongo = require('mongodb');
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should;

let server;
const livePersonPw = 'd"w3}~T^gVyHhFnM';

chai.use(chaiHttp);

beforeEach(function () {
    server = require('../botconfig');
})
/**
 * Test for the post method to insert a bot
 */
describe('/POST botconfig', () => {

    it('should insert a bot', (done) => {

        let testBot = { name: 'pinkSparkles', 
        botType : "faq" };

        chai.request(server)
            .post('/bot')
            //.writeHead( { 'Authorization' : livePersonPw } )
            .send(testBot)
            .end((err, res) => {
                console.log(res.body)
                res.should.have.status(404)
            });
        done();
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
            })
        done();
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
                console.log(res);
                res.should.have.status(200)
            })
        done();
    })
})

/**
 * Test for updating the Name from a bot which already exists in the database
 */
describe('/UPDATE botconfig', () => {

    beforeEach(function () {
        let testBot = { 'name': 'Kevin',
        botType = 'faq' }
    })
})

describe('/PUT intentname', () => {

    let testBot = { 'name': 'botMitNamenlosenIntents' };
    let intentRequest = { 'data': { 'intents': { 'name': '' } } }
    let botId


    beforeEach(function () {
        chai.request(server)
            .post('/bot')
            .send(testBot)
        console.log('I got this far! :)')
            .end((err, res) => {
                //TODO: Fix this:
                //Error right here: Cannot read property of end
                console.log('And now this far! :D')
                botId = res.body.Id;
            });
    })
    return new Promise(function (fullfill, reject) {
        it('should deny the request to put a nameless intent to testBot', (done) => {
            chai.request(server)
                .put('/bot/:' + botId)
                .send(intentRequest)
                .end((err, res) => {
                    console.log(res);
                    res.should.not.have.status(200);
                    resolve();
                });
        })
    }).then(function () {
        chai.request(server)
            .delete('/bot/:' + botId)
            .send()
            .end(err, res);
    })
    done();
})

describe('PUT start/stop', () => {
    let testBot = { name : 'startStopBot' }
})

describe('GET status', () => {
    let TestBot = { name : 'Statussymbol',
    botType : 'faq' }

    before(function () {
        chai.request(server)
        .post('/bot')
        .send(testBot)
        .end((err, res) {
            
        })
    })
}) 