const express = require("express");
const router = express.Router();
const todoController = require("../controllers/todoControllers");

router.get("/", function (req, res) {
  res.send("Hello world");
});

router.get("/task", todoController.getAllTask);

module.exports = router;
