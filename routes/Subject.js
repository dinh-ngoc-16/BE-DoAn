const router = require("express").Router();
const jwt = require("jsonwebtoken");
const Khoa = require("../models/van_lang/Khoa");
const MonHoc = require("../models/van_lang/MonHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const LopHoc = require("../models/van_lang/LopHoc");
const { verifyTokenAndAuthorization } = require("./VerifyToken");
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

const weekday = ["CN", "2", "3", "4", "5", "6", "7"];

//schedule subject
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let sinhVienData = await SinhVien.findOne({ _id: req.params.id }).populate({
      path: "LH",
      match: {
        $and: [
          {
            "thoiGian.ngayBD": {
              $lte: new Date(req.query.date),
            },
          },
          {
            "thoiGian.ngayKT": {
              $gte: new Date(req.query.date),
            },
          },
        ],
      },
      populate: {
        path: "id_MonHoc",
        select: "id tenMonHoc TC",
      },
      options: { sort: { "thoiGian.gioHoc.ca": 1 } },
    });

    for (let i = 0; i < sinhVienData.LH.length; i++) {
      let dataTemp = sinhVienData.LH[i];
      dataTemp.thoiGian.gioHoc = dataTemp.thoiGian.gioHoc.filter(
        (item) => item.thu == weekday[new Date(req.query.date).getDay()],
      );
    }

    sinhVienData.LH = sinhVienData.LH.filter(
      (item) => item.thoiGian.gioHoc.length > 0,
    );

    res
      .status(200)
      .json({ data: sinhVienData.LH, count: sinhVienData.LH.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    let sinhVienData = await LopHoc.find({
      $and: [
        {
          "thoiGian.ngayBD": {
            $lte: new Date(`2023-04-16`),
          },
        },
        {
          "thoiGian.ngayKT": {
            $gte: new Date(`2023-04-16`),
          },
        },
      ],
    }).exec();
    // let data = await MonHoc.find();
    res.status(200).json({ data: sinhVienData, count: sinhVienData.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    let subject = new LopHoc({
      maLopHoc: "DIT11155",
      id_MonHoc: "6480cbd818670ee33bb6e575",
      thoiGian: {
        ngayBD: new Date("2023-02-01").toISOString(),
        ngayKT: new Date("2023-04-30").toISOString(),
        gioHoc: [
          {
            diaDiem: "CS3",
            thu: "2",
            phong: "F06-03",
            ca: 2,
            loai: "LT",
          },
          {
            diaDiem: "CS3",
            thu: "7",
            phong: "F12-02",
            ca: 3,
            loai: "TH",
          },
        ],
      },
    });
    let saveSubject = await subject.save();
    res.status(200).json(saveSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
