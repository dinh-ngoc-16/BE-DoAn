const mongoose = require("mongoose");

const MonHocSchema = new mongoose.Schema(
  {
    tenMonHoc: { type: String, require: true },
    maMonHoc: { type: String, require: true },
    id_khoa: { type: mongoose.Types.ObjectId, require: true, ref: "Khoa" },
    diaDiem: { type: String, require: true },
    TC: { type: Number, require: true },
    lichHoc: {
      buoiHoc: { type: String, require: true },
      ca: { type: Number, require: true },
      ngayBD: { type: Date, require: true },
      ngayKT: { type: Date, require: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MonHoc", MonHocSchema, "monHoc");
