const express = require("express");
const jsonParser = express.json();
const router = express.Router();
const todoController = require("../controllers/todoControllers");

router.get("/", function (req, res) {
  res.send("Hello world");
});

router.get("/tasks", todoController.getAllTask);
router.get("/task/:id", todoController.getTask);
router.post("/task", jsonParser, todoController.createNewTask);
router.patch("/task/:id", jsonParser, todoController.updateTask);
router.patch("/task/position", jsonParser, todoController.updatePositionTask);
router.delete("/task/:id", todoController.deleteTask);

module.exports = router;
