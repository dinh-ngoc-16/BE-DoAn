const GiangVien = require("../models/van_lang/GiangVien");
const MonHoc = require("../models/van_lang/MonHoc");
const router = require("express").Router();
const LichKT = require("../models/van_lang/LichKT");
const LopHoc = require("../models/van_lang/LopHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const { verifyTokenAndAuthorization, verifyToken } = require("./VerifyToken");

const weekday = ["CN", "2", "3", "4", "5", "6", "7"];

//schedule subject
router.get("/lichhoc/:idUser", async (req, res) => {
  try {
    let sinhVienData = await SinhVien.findOne({
      _id: req.params.idUser,
    }).populate({
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
      populate: [
        {
          path: "id_MonHoc",
          select: "id tenMonHoc TC",
        },
        {
          path: "thoiGian.gioHoc.GV",
          select: "id tenGV",
        },
      ],

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
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/detail/:idMonHoc", verifyToken, async (req, res) => {
  try {
    let detailMonHoc = await LopHoc.findOne({
      _id: req.params.idMonHoc,
    })
      .select("id thoiGian maLopHoc id_MonHoc")
      .populate({
        path: "id_MonHoc",
        select: "id tenMonHoc maMonHoc",
        populate: [
          {
            path: "id_khoa",
            select: "id maKhoa tenKhoa",
          },
        ],
      })
      .populate({
        path: "thoiGian.gioHoc.GV",
        select: "tenGV",
      });

    detailMonHoc.thoiGian.gioHoc = detailMonHoc.thoiGian.gioHoc.filter(
      (item) => item.thu == weekday[new Date(req.query.date).getDay()],
    );

    res.status(200).json({ data: detailMonHoc, count: 1 });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/lichkt/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    let dataGet;

    if (
      req.query.all == undefined ||
      req.query.all == "" ||
      req.query.all == "now"
    ) {
      dataGet = await SinhVien.findOne({
        _id: req.params.id,
      }).populate({
        path: "KT",
        select: "id id_LopHoc hoanThanh chiTiet thiLai",
        match: {
          $or: [
            {
              "chiTiet.thoiGianThi": {
                $gte: Date.now(),
              },
            },
            {
              "thiLai.thoiGianThi": {
                $gte: Date.now(),
              },
            },
          ],
        },
        populate: [
          {
            path: "id_LopHoc",
            select: "id maLopHoc",
            populate: [
              {
                path: "id_MonHoc",
                select: "tenMonHoc TC",
              },
            ],
          },
        ],
        options: { sort: { "chiTiet.thoiGianThi": 1 } },
      });
    } else if (req.query.all == "all") {
      dataGet = await SinhVien.findOne({
        _id: req.params.id,
      }).populate({
        path: "KT",
        select: "id id_LopHoc hoanThanh chiTiet thiLai",
        populate: [
          {
            path: "id_LopHoc",
            select: "id maLopHoc",
            populate: [
              {
                path: "id_MonHoc",
                select: "tenMonHoc TC",
              },
            ],
          },
        ],
        options: { sort: { "chiTiet.thoiGianThi": 1 } },
      });
    }

    res.status(200).json({ data: dataGet.KT, count: dataGet.KT.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/lichkt/detail/:id", verifyToken, async (req, res) => {
  try {
    let dataGet;
    dataGet = await LichKT.findOne({
      _id: req.params.id,
    })
      .select("id id_LopHoc chiTiet thiLai")
      .populate({
        path: "id_LopHoc",
        select: "id maLopHoc",
        populate: [
          {
            path: "id_MonHoc",
            select: "tenMonHoc TC",
          },
        ],
      });

    res.status(200).json({ data: dataGet, count: 1 });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/create", async (req, res) => {
  try {
    let subject = new LichKT({
      id_LopHoc: "6480da76f0ed58e5e65be167",
      hoanThanh: false,
      chiTiet: {
        thoiGianThi: new Date("2023-06-25T08:30:00").toISOString(),
        diaDiem: "CS3",
        phong: "F06-03",
        thoiGian: 75,
        hinhThucThi: "TL",
      },
      thiLai: {
        thoiGianThi: new Date("2023-07-15T07:30:00").toISOString(),
        diaDiem: "CS3",
        phong: "F06-03",
        thoiGian: 75,
        hinhThucThi: "TL",
      },
    });
    let saveSubject = await subject.save();
    res.status(200).json(saveSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
