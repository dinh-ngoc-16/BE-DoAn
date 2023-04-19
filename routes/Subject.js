const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyToken } = require("./VerifyToken");

router.get("/", async (req, res) => {
  console.log(req.headers);
  try {
    let data = await MonHoc.find({
      "lichHoc.ngayBD": {
        $gt: new Date("2023-01-25"),
        $lt: new Date("2023-02-02"),
      },
    });
    console.log(data);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/create", async (req, res) => {
  console.log(req.headers);
  try {
    let subject = new MonHoc({
      tenMonHoc: "Toan Cao Cap3",
      maMonHoc: "DIA19000",
      id_khoa: "6408d07d4f19e1d44681911d",
      diaDiem: "CS2",
      TC: 3.0,
      lichHoc: {
        buoiHoc: "2-5",
        ca: 2.0,
        ngayBD: new Date("2023-12-30").toISOString(),
        ngayKT: new Date("2023-01-30").toISOString(),
      },
    });
    let saveSubject = await subject.save();
    console.log(saveSubject);
    res.status(200).json(saveSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
