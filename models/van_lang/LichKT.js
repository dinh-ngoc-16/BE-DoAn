const mongoose = require("mongoose");

const LichKTSchema = new mongoose.Schema(
  {
    id_LopHoc: { type: mongoose.Types.ObjectId, require: true, ref: "LopHoc" },
    thoiGian: {
      ngayKTra: { type: Date, require: true },
      diaDiem: { type: String, require: true },
      phong: { type: String, require: true },
      gioThi: { type: String, require: true },
      thoiGian: { type: Number, require: true },
      hinhThucThi: { type: String, require: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LichKT", LichKTSchema, "lichKT");
