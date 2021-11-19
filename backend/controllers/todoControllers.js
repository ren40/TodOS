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

  const _task = req.body.task;
  const _complete = req.body.complete;
  const _position = req.body.position;

  const task = new taskModel({
    task: _task,
    complete: _complete,
    position: _position,
  });

  task
    .save(task)
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
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

const updatePositionTask = (req, res) => {
    
};

module.exports = {
  getAllTask,
  getTask,
  deleteTask,
  updateTask,
  updatePositionTask,
  createNewTask,
};
