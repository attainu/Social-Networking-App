let Inbox = require("../models/Inbox");
let formatMessage = require("../utils/formatMessage")

module.exports = {
    sendMessage: async (req,res) => {
        try {
            let currentUser = req.user;
            let friendId = req.params.sendTo;
            let message = req.body.message;
            let formatedMessage = formatMessage(currentUser._id,message)
            let conversation = await Inbox.findOne( { $or: [ { user01:currentUser._id }, { user02: currentUser._id } ] } );
            if(!conversation){
                let messageInfo = {
                    user01:currentUser._id,
                    user02:friendId,
                }
                let inbox = new Inbox({...messageInfo});
                inbox.conversation.push(formatedMessage);
                await inbox.save();
                return res.json(inbox);
            }
            else {
                conversation.conversation.push(formatedMessage);
                await conversation.save()
                return res.json(conversation)
            }
        } 
        catch (error) {
            return res.send(error.message)
        }
        
    },
    getInbox: async (req,res) => {
        try {
            let currentUser = req.user;
            let inbox = await Inbox.find( { $or: [ { user01:currentUser._id }, { user02: currentUser._id } ] } )
            return res.json(inbox)
        } catch (error) {
            return res.json(error.message)
        }
    }
}