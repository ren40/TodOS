const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const config = require("./config/conf")();
const express = require("express");
const cors = require("cors");
const todoRouter = require("./routes/todo");

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use("/", todoRouter);
app.use(bodyParser.json());

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

mongoose.connect(
  config.getUrlDB(),
  { useUnifiedTopology: true },
  function (err) {
    if (err) {
      return console.error(err);
    }
    app.listen(config.getPort(), () => {
      console.log(`Server is running on port ${config.getPort()}`);
    });
  }
);

// app.listen(config.getPort(), () => {
//   console.log(`Server is running on port ${config.getPort()}`);
// });
