const mongoose = require("mongoose");

module.exports = function (winston) {
  mongoose
    .connect("mongodb://localhost/vidly", {
      // poolSize: 10,
      // bufferMaxEntries: 0,
      reconnectTries: 5000,
      useNewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => winston.info("Connected to mongodb successfully"));
  //==>No need to catch, an uncaught exception will be thrown, logged and terminate the process
};
