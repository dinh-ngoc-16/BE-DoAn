const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Student = require("./routes/Student.js");
const Subject = require("./routes/Subject.js");

dotenv.config();

const PORT = process.env.PORT || 3500;

const app = express();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Database connection successful");
  })
  .catch((error) => console.log(error));

app.use(cors());
app.use(express.json());
app.use("/student", Student);
app.use("/subject", Subject);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
