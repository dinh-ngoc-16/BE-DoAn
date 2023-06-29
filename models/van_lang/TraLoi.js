const mongoose = require("mongoose");

const CautrlSchema = new mongoose.Schema(
  {
    id_cauHoi: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "ThacMac",
    },
    cauTRl: { type: String, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TraLoi", CautrlSchema, "traLoi");
