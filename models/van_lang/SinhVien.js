const mongoose = require("mongoose");

const SinhVienSchema = new mongoose.Schema(
  {
    tenSV: { type: String, require: true },
    lopSV: { type: String, require: true },
    SDT: { type: Number, require: true },
    khoa: { type: mongoose.Types.ObjectId, require: true, ref: "Khoa" },
    LH: [{ type: mongoose.Types.ObjectId, default: [], ref: "LopHoc" }],
    KT: [{ type: mongoose.Types.ObjectId, default: [], ref: "LichKT" }],
    MSSV: { type: String, require: true, unique: true },
    khoaHoc: { type: String, require: true },
    userName: { type: String, require: true },
    pass: { type: String, require: true },
    gioiTinh: { type: String, require: true },
    dob: { type: Date, require: true },
    queQuan: { type: String, require: true },
    coVan: { type: mongoose.Types.ObjectId, require: true, ref: "GiangVien" },
    thanNhan: [
      {
        hoTenThanNhan: { type: String, require: false },
        sdt: { type: Number, require: false },
        vaiTro: { type: String, require: true },
        gioiTinh: { type: String, require: true },
        dob: { type: Date, require: true },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("SinhVien", SinhVienSchema, "sinhVien");
