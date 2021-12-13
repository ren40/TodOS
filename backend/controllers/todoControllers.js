const taskModel = require("../models/todoSchema");
const listUtils = require("../utils/list_utils");

const getAllTask = (req, res, next) => {
  taskModel
    .find()
    .then((list) => {
      res.json(listUtils.sortList(listUtils.formatedList(list)));
    })
    .catch((err) => {
      err.statusCode = 404;
      next(err);
    });
};

const filterTaskList = (req, res, next) => {
  if (!req.body) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
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
    .catch((err) => {
      err.statusCode = 404;
      next(err);
    });
};

const getTask = (req, res, next) => {
  const id = req.params.id;
  taskModel
    .findOne({ _id: id })
    .then((task) => res.json(task))
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const createNewTask = (req, res, next) => {
  if (!req.body) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
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
      err.statusCode = 500;
      next(err);
    });
};

const deleteTask = (req, res, next) => {
  const id = req.params.id;
  if (!id) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
  }
  taskModel
    .findByIdAndDelete(id)
    .then((task) => {
      res.json(task);
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const deleteAllTasks = (req, res, next) => {
  taskModel
    .deleteMany()
    .then((_task) => res.sendStatus(200))
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const updateTask = (req, res, next) => {
  const id = req.params.id;
  if (!req.body || !id) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
  }
  taskModel
    .findByIdAndUpdate(id, req.body)
    .then((_task) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const updatePositionTask = (req, res, next) => {
  if (!req.body) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
  }

  const newPosition = req.body.position.newPosition;
  const id = req.body.id;
  taskModel
    .bulkWrite([
      {
        updateOne: {
          filter: {
            position: newPosition,
          },
          update: {
            position: req.body.position.fromIndex,
          },
        },
      },
      {
        updateOne: {
          filter: {
            _id: id,
          },
          update: {
            position: newPosition,
          },
        },
      },
    ])
    .then((result) => res.sendStatus(200))
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

const searchTask = (req, res, next) => {
  if (!req.body) {
    const error = new Error("Invalid request");
    error.statusCode = 400;
    throw error;
  }

  const searchItem = req.body.search;
  taskModel
    .find()
    .then((result) =>
      res.status(200).json(listUtils.searchInList(result, searchItem))
    )
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};

module.exports = {
  filterTaskList,
  getAllTask,
  getTask,
  deleteTask,
  deleteAllTasks,
  updateTask,
  updatePositionTask,
  createNewTask,
  searchTask,
};
