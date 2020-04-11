var mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URL.replace("<password>", process.env.MONGO_PASSWORD),
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(function () {
        console.log("Database Connected Successfully")
    })
    .catch(function (err) {
        console.log(err.message)
    })