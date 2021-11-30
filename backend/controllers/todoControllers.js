const taskModel = require("../models/todoSchema");
const listUtils = require("../utils/list_utils");

const getAllTask = (req, res) => {
  taskModel
    .find()
    .then((list) => {
      res.json(listUtils.sortList(listUtils.formatedList(list)));
    })
    .catch((err) => res.sendStatus(500));
};

const filterTaskList = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  let date_from = new Date(req.body.date_from);
  date_from.setHours(0, 0, 0, 0);
  let date_to = new Date(req.body.date_to);
  date_to.setHours(23, 59, 59, 999);
  taskModel
    .find({
      $and: [
        { date_create: { $gte: date_from.toISOString() } },
        { date_create: { $lte: date_to.toISOString() } },
      ],
    })
    .then((list) => {
      res.json(listUtils.sortList(listUtils.formatedList(list)));
    })
    .catch((err) => res.sendStatus(500));
};

const getTask = (req, res) => {
  const id = req.params.id;
  taskModel
    .findOne({ _id: id })
    .then((task) => res.json(task))
    .catch((err) => res.sendStatus(500));
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
  taskModel
    .findByIdAndDelete(id)
    .then((task) => {
      res.json(task);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
};

const updateTask = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const id = req.params.id;
  taskModel
    .findByIdAndUpdate(id, req.body)
    .then((task) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.sendStatus(500);
    });
};

const updatePositionTask = (req, res) => {
  if (!req.body) {
    return res.sendStatus(400);
  }
  const newPosition = req.body.position.newPosition;
  const id = req.body.id;
  taskModel
    .findOne({ position: newPosition })
    .then((task_old) => {
      return taskModel.findByIdAndUpdate(task_old._id, {
        position: req.body.position.fromIndex,
      });
    })
    .then((result) => {
      return taskModel.findByIdAndUpdate(id, { position: newPosition });
    })
    .then((data) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = {
  filterTaskList,
  getAllTask,
  getTask,
  deleteTask,
  updateTask,
  updatePositionTask,
  createNewTask,
};
