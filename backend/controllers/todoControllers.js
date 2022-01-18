const taskModel = require("../models/todoSchema");

const getAllTask = (req, res, next) => {
  const page = parseInt(req.query.page) || 0;
  const limitItems = parseInt(req.query.limit) || 10;
  const skips = (page - 1) * limitItems;
  let totalTasks = 0;
  let response = {};

  taskModel
    .countDocuments({})
    .then((numTasks) => {
      totalTasks = numTasks;
      return taskModel
        .find()
        .skip(skips)
        .limit(limitItems)
        .sort({ position: -1 });
    })
    .then((result) => {
      response["tasks"] = result;
      response["totalElement"] = totalTasks;
      res.status(200).json(response);
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

const searchAndFilter = (req, res, next) => {
  let query = {};
  let date_from = null;
  let date_to = null;
  let totalitems = 0;
  const page = parseInt(req.query.page) || 0;
  const limitItems = parseInt(req.query.limit) || 10;
  const skips = (page - 1) * limitItems;
  let response = {};

  if (req.query && req.query.filter) {
    date_from = new Date(req.query.date_from);
    date_from.setHours(0, 0, 0, 0);
    date_to = new Date(req.query.date_to);
    date_to.setHours(23, 59, 59, 999);
    query["$and"] = [
      { date_create: { $gte: date_from.toISOString() } },
      { date_create: { $lte: date_to.toISOString() } },
    ];
  }

  if (req.query && req.query.search) {
    query["task.title"] = { $regex: req.query.searchItem };
  }
  taskModel
    .countDocuments(query)
    .then((numTodos) => {
      totalitems = numTodos;
      return taskModel.find(query).skip(skips).limit(limitItems).sort({
        position: -1,
      });
    })
    .then((result) => {
      response["tasks"] = result;
      response["totalElement"] = totalitems;
      res.status(200).json(response);
    })
    .catch((err) => {
      err.statusCode = 500;
      next(err);
    });
};
module.exports = {
  getAllTask,
  getTask,
  deleteTask,
  deleteAllTasks,
  updateTask,
  updatePositionTask,
  createNewTask,
  searchAndFilter,
};
