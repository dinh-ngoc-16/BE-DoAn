const mongoose = require("mongoose");

const SinhVienSchema = new mongoose.Schema(
  {
    tenSV: { type: String, require: true },
    lopSV: { type: String, require: true },
    SDT: { type: Number, require: true },
    khoa: { type: mongoose.Types.ObjectId, require: true, ref: "Khoa" },
    LH: [{ type: mongoose.Types.ObjectId, default: [], ref: "LopHoc" }],
    MSSV: { type: String, require: true, unique: true },
    khoaHoc: { type: String, require: true },
    userName: { type: String, require: true },
    // nhớ hash passowrd
    pass: { type: String, require: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("SinhVien", SinhVienSchema, "sinhVien");
