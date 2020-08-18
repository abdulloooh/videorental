const winston = require("winston");
const express = require("express");
const app = express();
require("./startup/startup")(app);

const port = process.env.PORT || 3002;
app.listen(port, () => winston.info(`Listening on port ${port}`));
