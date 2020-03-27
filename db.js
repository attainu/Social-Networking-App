let { connect } = require("mongoose");


connect("mongodb://127.0.0.1:2065/social", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(function () {
        console.log("Database Connected Successfully")
    })
    .catch(function (err) {
        console.log(err.message)
    })

