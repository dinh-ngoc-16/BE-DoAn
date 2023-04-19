const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyToken } = require("./VerifyToken");

router.get("/", async (req, res) => {
  try {
    let data = await MonHoc.find({
      "lichHoc.ngayBD": {
        $eq: new Date("2023-04-16"),
      },
    });

    res.status(200).json({ data, count: data.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    let subject = new MonHoc({
      tenMonHoc: "Toan Cao Cap 5",
      maMonHoc: "DIA19000",
      id_khoa: "6408d07d4f19e1d44681911d",
      diaDiem: "CS2",
      TC: 3.0,
      lichHoc: {
        buoiHoc: "2-5",
        ca: 2.0,
        ngayBD: new Date("2023-04-16").toISOString(),
        ngayKT: new Date("2023-05-30").toISOString(),
      },
    });
    let saveSubject = await subject.save();
    res.status(200).json(saveSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
