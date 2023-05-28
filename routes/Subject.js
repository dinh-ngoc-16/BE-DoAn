const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyToken, verifyTokenAndAuthorization } = require("./VerifyToken");
//detail subject
// router.get("/:id", async (req, res) => {
//   try {
//     let data = await MonHoc.find({
//       _id: req.params.id,
//     });

//     res.status(200).json({ data, count: data.length });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

//schedule subject
router.post("/", verifyTokenAndAuthorization, async (req, res) => {
  try {
    // let sinhVienData = await SinhVien.find({ _id: req.body.id })
    //   .populate({
    //     path: "MH",
    //     match: {
    //       "lichHoc.ngayBD": {
    //         $lte: new Date(`${req.query.dtime}`),
    //         // "2023-02-02"
    //       },
    //       "lichHoc.ngayKT": {
    //         $gte: new Date(`${req.query.dtime}`),
    //       },
    //     },
    //     options: {
    //       sort: {
    //         "lichHoc.ca": 1,
    //       },
    //     },
    //   })
    //   .exec();
    let data = await MonHoc.find();
    res.status(200).json({ data: data, count: data.length });
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
