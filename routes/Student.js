const router = require("express").Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyTokenAndAuthorization } = require("./VerifyToken");

router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let sinhVienData = await SinhVien.find({ _id: req.params.id }).exec();
    res.status(200).json(sinhVienData[0]);
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
  if (res.body == undefined) {
    res.status(500);
  }
  try {
    const student = await SinhVien.findOne({ userName: req.body.userName });
    if (!student) {
      res.status(401).json("Wrong credentials!");
      return;
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      student.pass,
      process.env.PASS_SEC,
    );

    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    if (OriginalPassword !== req.body.pass) {
      res.status(401).json("Wrong credentials!");
      return;
    }
    const accessToken = jwt.sign(
      {
        id: student.id,
      },
      process.env.JWT_SEC,
      { expiresIn: "1d" },
    );

    const { _id } = student._doc;

    res.status(200).json({ id: _id, accessToken });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.patch("/:id/subject", async (req, res) => {
  try {
    console.log(req.params);
    let updateStudent = await SinhVien.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
    );
    res.status(200).json(updateStudent);
  } catch (error) {
    res.status(500).json(updateStudent);
  }
});

module.exports = router;
