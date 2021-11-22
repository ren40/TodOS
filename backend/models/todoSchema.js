const mongoose = require("mongoose");

const schema = mongoose.Schema;

const taskSchema = new schema({
  complete: Boolean,
  position: Number,
  task: {
    title: String,
  },
  date_create: { type: Date, default: Date.now },
  versionKey: false,
});

module.exports = mongoose.model("Task", taskSchema);
