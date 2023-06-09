const mongoose = require("mongoose");

const LopHocSchema = new mongoose.Schema(
  {
    maLopHoc: { type: String, require: true },
    id_MonHoc: { type: mongoose.Types.ObjectId, require: true, ref: "MonHoc" },
    thoiGian: {
      ngayBD: { type: Date, require: true },
      ngayKT: { type: Date, require: true },
      gioHoc: [
        {
          diaDiem: { type: String, require: true },
          thu: { type: String, require: true },
          phong: { type: String, require: true },
          ca: { type: Number, require: true },
          loai: { type: String, require: true },
        },
      ],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LopHoc", LopHocSchema, "lopHoc");
