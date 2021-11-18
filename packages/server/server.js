const config = require("./config/conf")();
const express = require("express");
const router = require('./routes/index')

const app = express();

console.log(config)

app.use('/hello', router)

app.listen(config.getPort(), () => {
  console.log(`Server is running on port ${config.getPort()}`);
});
