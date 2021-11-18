const mongoose = require("mongoose");

const schema = mongoose.Schema;

const taskSchema = new schema({
  _id: mongoose.Schema.Types.ObjectId,
  complete: Boolean,
  position : Number,
  task: {
    title: String,
  },
});

module.exports = mongoose.model("Task", taskSchema);
