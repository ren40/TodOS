const taskModel = require("../models/todoSchema");

const getAllTask = (req, res) => {
  taskModel.find((err, tasks) => {
    if (err) {
      return console.error(err);
    }
    res.json(tasks);
  });
};

const getTask = (req, res) => {
  const id = req.params.id;
  taskModel.findOne({ _id: id }, (err, task) => {
    if (err) {
      return console.error(err);
    }
    res.json(task);
  });
};

const createNewTask = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
//TODO написать парсер json 
  const task = new taskModel({});
  task.save();
};

const deleteTask = (req, res) => {
  const id = req.params.id;
  taskModel.findByIdAndDelete(id, (err, task) => {
    if (err) {
      console.error(err);
    }
    res.json(task);
  });
};

const updateTask = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const id = req.params.id;
  taskModel.findByIdAndUpdate(id, req.body, (err, task) => {
    if (err) {
      console.error(err);
    }
  });
};

const updatePositionTask = (req, res) => {};

module.exports = {
  getAllTask,
  getTask,
  deleteTask,
  updateTask,
  updatePositionTask,
  createNewTask,
};
