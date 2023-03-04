const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  test: { type: String },
});
module.exports = mongoose.model("Schedule", ScheduleSchema, "Schedule");
