const taskModel = require("../models/todoSchema");

const getAllTask = (req, res) => {
  taskModel.find((err, tasks) => {
    if (err) {
      return console.error(err);
    }
    res.json(tasks);
  });
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
      let sortList = [];
      Array(...list).forEach((element) => {
        sortList.push({
          id: element._id,
          task: element.task,
          position: element.position,
          complete: element.complete,
          date_create: element.date_create
        });
      });
      sortList.sort((next, prev) => {
        if (next.position > prev.position) {
          return 1;
        }
        if (next.position < prev.position) {
          return -1;
        }
        return 0;
      });
      res.json(sortList);
    })
    .catch((err) => res.sendStatus(500));
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
  if (!req.body) {
    return res.sendStatus(400);
  }
  const newPosition = req.body.position.newPosition;
  const id = req.body.id;
  taskModel
    .findOne({ position: newPosition })
    .then((task_old) => {
      taskModel
        .findByIdAndUpdate(task_old._id, {
          position: req.body.position.fromIndex,
        })
        .then((result) => {
          taskModel
            .findByIdAndUpdate(id, { position: newPosition })
            .then((data) => {
              res.sendStatus(200);
            })
            .catch((err) => {
              console.log(err);
            });
        })
        .catch((err) => {
          console.log(err);
        });
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
