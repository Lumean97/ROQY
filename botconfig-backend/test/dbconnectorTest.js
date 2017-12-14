const assert = require('assert'); //node.js core module
const dbconnector = require('../modules/dbconnector');
const mongoClient = require('mongodb').MongoClient;
const mongoURL = process.env.MONGO_URI ||'mongodb://141.19.157.239:27017/mydb';


describe('DBConnector', function () {
    describe('#writeToDB', function () {
        it('should show the inserted bot inside the DB', function (done) {

            mongoClient.connect(mongoURL, function (err, db) {
                if (err) throw err;
                //Inputparameter for data and for the searchrequest
                var requestToDB = {
                    data: {name : 'writeTestBot',
                description : 'Im a testobject to test the writeToDB method',
                test : true,
                privacy : 'public',
                botType : 'faq',
                intents : []}}


                //Make a create bot Request
                dbconnector.writeToDB(requestToDB).then(res => {
                    //To get the inserted bot right off the database and save it in result
                    db.collection('botAgents').findOne({ name : requestToDB.data.name}, function (err, result) {
                        if (err) console.log('The inserted Bot can not be found or could not be inserted!')

                        //Check if the bot which got inserted by the connector is in the database
                        assert.equal(result.name, requestToDB.data.name)
                        clean({name:requestToDB.data.name}).then(() => {
                            done();
                        });  
                    });

                })
            })
        })
    })

    describe('#writeConfig', function () {
        let bot = {
            id: "very special",
            config: null
        };
        before(function (done) {
            mongoClient.connect(mongoURL, function (err, db) {
                db.collection('botAgents').insertOne(bot, function (err, res) {
                    if (err) done(err);
                    bot.config = "Hallo Welt";
                    done();
                })
            });
        });
        it('should write the config to the db', (done) => {

            dbconnector.writeConfig(bot.config, bot.id).then(res => {
                mongoClient.connect(mongoURL, function (err, db) {
                    db.collection('botAgents').findOne({id: bot.id}, function (err, res) {
                        assert.deepEqual(res.config, bot.config);
                        done();
                    });
                });
            })
        })
        after((done) => {
            clean({id:bot.id}).then(() => {
                done();
            });         
        })
    });

    describe('#setPrivacy', function () {
        let bot = {
            id: "very special privacy",
            privacy: "public"
        };
        before(function (done) {
            mongoClient.connect(mongoURL, function (err, db) {
                db.collection('botAgents').insertOne(bot, function (err, res) {
                    if (err) done(err);
                    bot.privacy = "private";
                    done();
                })
            });
        });
        it('should write the config to the db', (done) => {
            console.log(bot.privacy);
            dbconnector.setPrivacy(bot.id, bot.privacy).then(res => {
                mongoClient.connect(mongoURL, function (err, db) {
                    db.collection('botAgents').findOne({id: bot.id}, function (err, res) {
                        assert.equal(res.privacy, bot.privacy);
                        done();
                    });
                });
            })
        })
        after((done) => {
            clean({id:bot.id}).then(() => {
                done();
            });          
        })

    });

});

function clean(payload){
    return new Promise((resolve) => {
        mongoClient.connect(mongoURL, function (err, db) {
            db.collection('botAgents').deleteOne(payload, function(err, res){
                if(err)resolve(err);
                else resolve();
            });
        })
    })

}

