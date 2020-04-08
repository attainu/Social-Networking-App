let moment = require("moment");


module.exports = (userId,message) => {
    let formatedMessage = {
        user:userId,
        message:message,
        time:moment().format('h:mm a'),
        date:moment().format("dddd, MMMM Do YYYY")
    }
    return formatedMessage
}