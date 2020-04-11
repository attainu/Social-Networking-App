let Inbox = require("../models/Inbox");
let formatMessage = require("../utils/formatMessage")

module.exports = {
    sendMessage: async (req,res) => {
        try {
            let currentUser = req.user;
            let friendId = req.params.sendTo;
            let message = req.body.message;
            let formatedMessage = formatMessage(currentUser._id,message,currentUser.name);
            let userConversation = await Inbox.findOne( { $and : [ { user: currentUser._id}, { friend: friendId } ] } ).populate({path:"conversation",populate:{path:"user"}});
            let friendConversation = await Inbox.findOne( { $and : [ { user: friendId }, { friend: currentUser._id } ] } );
            if(!userConversation){
                let messageInfoUser = {
                    user:currentUser._id,
                    friend:friendId,
                }
                let userInbox = new Inbox({...messageInfoUser});
                userInbox.conversation.push(formatedMessage);
                await userInbox.save();

                let messageInfoFriend = {
                    user:friendId,
                    friend:currentUser._id,
                }
                let friendInbox = new Inbox({...messageInfoFriend});
                friendInbox.conversation.push(formatedMessage);
                await friendInbox.save();
                return res.json(formatedMessage);
            }
            else {
                userConversation.conversation.push(formatedMessage);
                friendConversation.conversation.push(formatedMessage);
                await friendConversation.save()
                await userConversation.save()
                return res.json(formatedMessage)
            }
        } 
        catch (error) {
            return res.send(error.message)
        }
        
    },
    getInbox: async (req,res) => {
        try {
            let currentUser = req.user;
            let convo = await Inbox.find({user:currentUser._id}).populate("friend",["name","profilePicture"])
            return res.json(convo)
        } catch (error) {
            return res.json(error.message)
        }
    }
}