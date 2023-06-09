const mongoose = require("mongoose");

const MonHocSchema = new mongoose.Schema(
  {
    tenMonHoc: { type: String, require: true },
    maMonHoc: { type: String, require: true },
    id_khoa: { type: mongoose.Types.ObjectId, require: true, ref: "Khoa" },
    TC: { type: Number, require: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MonHoc", MonHocSchema, "monHoc");
