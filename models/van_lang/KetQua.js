const mongoose = require("mongoose");

const KetQuaSchema = new mongoose.Schema(
  {
    id_LopHoc: { type: mongoose.Types.ObjectId, require: true, ref: "LopHoc" },
    id_SV: { type: mongoose.Types.ObjectId, require: true, ref: "SinhVien" },
    chiTiet: [
      {
        title: { type: String, require: true },
        phanTram: { type: Number, require: true },
        diem: { type: Number, require: true },
      },
    ],
    tongDiem: { type: Number, require: true, default: 0 },
    pass: { type: Boolean, require: true, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("KetQua", KetQuaSchema, "ketQua");
