const mongoose = require("mongoose");

const ThacMacSchema = new mongoose.Schema(
  {
    id_SinhVien: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "SinhVien",
    },
    title: { type: String, required: true },
    cauHoi: { type: String, required: true },
    trangThai: { type: Boolean, default: false },
    trl: [
      {
        type: mongoose.Types.ObjectId,
        require: true,
        ref: "TraLoi",
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("ThacMac", ThacMacSchema, "thacMac");
