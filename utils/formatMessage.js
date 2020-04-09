let moment = require("moment");


module.exports = (userId,message,name) => {
    let formatedMessage = {
        user:userId,
        name:name,
        message:message,
        time:moment().format('h:mm a'),
        date:moment().format("dddd, MMMM Do YYYY")
    }
    return formatedMessage
}