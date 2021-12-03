const express = require("express");
const jsonParser = express.json();
const router = express.Router();
const todoController = require("../controllers/todoControllers");

router.get("/", function (req, res) {
  res.send("Hello world");
});

router.get("/tasks", todoController.getAllTask);
router.post("/tasks/filter", jsonParser, todoController.filterTaskList);
router.get("/task/:id", todoController.getTask);
router.post("/task", jsonParser, todoController.createNewTask);
router.patch("/task/position", jsonParser, todoController.updatePositionTask);
router.patch("/task/:id", jsonParser, todoController.updateTask);
router.delete("/tasks", todoController.deleteAllTasks);
router.delete("/task/:id", todoController.deleteTask);

module.exports = router;
