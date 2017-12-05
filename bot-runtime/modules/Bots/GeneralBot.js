'use strict';

/*
 * This demo try to use most of the API calls of the mssaging agent api. It:
 * 
 * 1) Registers the agent as online
 * 2) Accepts any routing task (== ring)
 * 3) Publishes to the conversation the consumer info when it gets new conversation
 * 4) Gets the content of the conversation
 * 5) Emit 'MyCoolAgent.ContentEvnet' to let the developer handle contentEvent responses
 * 6) Mark as "read" the handled messages
 * 
 */

const Agent = require('node-agent-sdk').Agent;
const dbConnector = require('../dbconnector');
let runtime;
class GeneralBot extends Agent {

    constructor(conf, rtm, welcome) {
        super(conf);
        runtime = rtm;
        this.conf = conf;
        this.init(welcome);
        this.CONTENT_NOTIFICATION = 'GeneralBot.ContentEvnet';
    }


    assignSkill(botId, convId){
        dbConnector.readFromDB({
            botId:botId
        }).then(res => {
            console.log("Forward to another bot");
            console.log(JSON.stringify(res));
            console.log(res.skill);
            this.updateConversationField({
                conversationId: convId,
                conversationField: [
                    {
                        field: 'Skill',
                        type: 'UPDATE',
                        skill: res.skill
                    },
                    {
                        field: 'ParticipantsChange',
                        type: 'REMOVE',
                        role: 'ASSIGNED_AGENT',
                        userId: this.__oldAgentId
                    }]
            }, function(err, res){
                console.log(err);
                console.log(res);
            })
        })

    }

    init(welcome) {
        let openConvs = {};
        console.log("init");
        this.on('connected', msg => {
            console.log('connected...', this.conf.id || '');
            this.setAgentState({availability: "ONLINE"});
            this.subscribeExConversations({
                'agentIds': [this.agentId],
                'convState': ['OPEN']
            }, (e, resp) => console.log('subscribed successfully', this.conf.id || ''));
            this.subscribeRoutingTasks({});
            setInterval(() => {

            }, 2000);
        });

        // Accept any routingTask (==ring)
        this.on('routing.RoutingTaskNotification', body => {
            body.changes.forEach(c => {
                if (c.type === "UPSERT") {
                    c.result.ringsDetails.forEach(r => {
                        if (r.ringState === 'WAITING') {
                            this.updateRingState({
                                "ringId": r.ringId,
                                "ringState": "ACCEPTED"
                            }, (e, resp) => console.log(resp));
                            runtime.addConversation(c.result.conversationId);
                        }
                    });
                }
            });
        });

        // Notification on changes in the open consversation list
        this.on('cqm.ExConversationChangeNotification', notificationBody => {
            notificationBody.changes.forEach(change => {
                if (change.type === 'UPSERT' && !openConvs[change.result.convId]) {
                    // new conversation for me
                    openConvs[change.result.convId] = {};

                    // demonstraiton of using the consumer profile calls
                    const consumerId = change.result.conversationDetails.participants.filter(p => p.role === "CONSUMER")[0].id;
                    this.getUserProfile(consumerId, (e, profileResp) => {
                        this.publishEvent({
                            dialogId: change.result.convId,
                            event: {
                                type: 'ContentEvent',
                                contentType: 'text/plain',
                                message: welcome
                            }
                        });
                    });
                    this.subscribeMessagingEvents({dialogId: change.result.convId});
                } else if (change.type === 'DELETE') {
                    // conversation was closed or transferred
                    console.log("Closed " + change.result.convId);
                    runtime.delConversation(change.result.convId);
                    delete openConvs[change.result.convId];
                }
            });
        });

        // Echo every unread consumer message and mark it as read
        this.on('ms.MessagingEventNotification', body => {
            const respond = {};
            body.changes.forEach(c => {
                // In the current version MessagingEventNotification are recived also without subscription
                // Will be fixed in the next api version. So we have to check if this notification is handled by us.
                if (openConvs[c.dialogId]) {
                    // add to respond list all content event not by me
                    if (c.event.type === 'ContentEvent' && c.originatorId !== this.agentId) {
                        respond[`${body.dialogId}-${c.sequence}`] = {
                            dialogId: body.dialogId,
                            sequence: c.sequence,
                            message: c.event.message
                        };
                    }
                    // remove from respond list all the messages that were already read
                    if (c.event.type === 'AcceptStatusEvent' && c.originatorId === this.agentId) {
                        c.event.sequenceList.forEach(seq => {
                            delete respond[`${body.dialogId}-${seq}`];
                        });
                    }
                }
            });
            let keyToUse = {sequence:-999999};
            // publish read, and echo
            Object.keys(respond).forEach(key => {
                var contentEvent = respond[key];
                if(contentEvent.sequence > keyToUse.sequence){
                    keyToUse = contentEvent;
                }
                this.publishEvent({
                    dialogId: contentEvent.dialogId,
                    event: {type: "AcceptStatusEvent", status: "READ", sequenceList: [contentEvent.sequence]}
                });
            });
            this.emit(this.CONTENT_NOTIFICATION, keyToUse);
        });

        // Tracing
        //this.on('notification', msg => console.log('got message', msg));
        this.on('error', err => console.log('got an error', err));
        this.on('closed', data => {
            console.log('socket closed', data)
            this.reconnect();
        });
    }
}

module.exports = GeneralBot;