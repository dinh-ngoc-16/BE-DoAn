const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyToken } = require("./VerifyToken");

router.get("/:id", verifyToken, async (req, res) => {
  console.log(req.params);
  try {
    // students = await Khoa.find();
    // count = await Khoa.find().count();
    let sinhVienData = await SinhVien.find({ _id: req.params.id })
      .populate(["MH", "khoa"])
      .exec();
    res.status(200).json(sinhVienData);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

router.post("/register", async (req, res) => {
  const student = new SinhVien({
    tenSV: req.body.tenSV,
    lopSV: req.body.lopSV,
    SDT: req.body.SDT,
    khoa: req.body.khoa,
    MSSV: req.body.MSSV,
    khoaHoc: req.body.khoaHoc,
    userName: req.body.userName,
    // nhớ hash passowrd
    pass: CryptoJS.AES.encrypt(req.body.pass, process.env.PASS_SEC).toString(),
  });
  try {
    let saveStudent = await student.save();
    res.status(200).json(saveStudent);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const student = await SinhVien.findOne({ userName: req.body.userName });
    if (!student) {
      res.status(401).json("Wrong credentials!");
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      student.pass,
      process.env.PASS_SEC,
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.pass) {
      res.status(401).json("Wrong credentials!");
    }
    const accessToken = jwt.sign(
      {
        id: student.userName,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" },
    );

    const { pass, ...others } = student._doc;
    res.status(200).json({ ...others, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
