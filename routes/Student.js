const router = require("express").Router();
const Schedule = require("../models/Schedule");

router.get("/", async (req, res) => {
  let students;
  let count;
  try {
    students = await Schedule.find();
    count = await Schedule.find().count();

    res.status(200).json({ items: students, count });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

module.exports = router;
