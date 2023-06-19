const GiangVien = require("../models/van_lang/GiangVien");
const MonHoc = require("../models/van_lang/MonHoc");
const router = require("express").Router();
const LichKT = require("../models/van_lang/LichKT");
const LopHoc = require("../models/van_lang/LopHoc");
const SinhVien = require("../models/van_lang/SinhVien");
const KetQua = require("../models/van_lang/KetQua");
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

router.get("/lopHoc/detail/:idMonHoc", verifyToken, async (req, res) => {
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

router.get("/lopKT/detail/:id", verifyToken, async (req, res) => {
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

router.get("/ketQua/:id", verifyToken, async (req, res) => {
  try {
    let dataGet;
    dataGet = await KetQua.find({
      id_SV: req.params.id,
    })
      .select("id_LopHoc pass tongDiem")
      .populate({
        path: "id_LopHoc",
        select: "maLopHoc id_MonHoc thoiGian.ngayKT",
        populate: {
          path: "id_MonHoc",
          select: "tenMonHoc maMonHoc",
        },
      })
      .sort({
        "id_LopHoc.thoiGian.ngayKT": 1,
      });

    res.status(200).json({ data: dataGet, count: dataGet.length });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/ketQua/detail/:id", verifyToken, async (req, res) => {
  try {
    let dataGet;
    dataGet = await KetQua.findOne({
      $or: [{ _id: req.params.id }, { id_LopHoc: req.params.id }],
    })
      .select("id_LopHoc pass tongDiem chiTiet")
      .populate({
        path: "id_LopHoc",
        select: "id_MonHoc",
        populate: {
          path: "id_MonHoc",
          select: "tenMonHoc maMonHoc",
        },
      });

    res.status(200).json({ data: dataGet, count: 1 });
  } catch (err) {
    res.status(500).json(err);
  }
});

//for admin site
router.post("/create", async (req, res) => {
  try {
    let subject = new SinhVien({
      /**
       * Paste one or more documents here
       */

      tenSV: "Huỳnh Tấn Sĩ",
      lopSV: "IT7",
      SDT: 1234567890,

      khoa: "6408d07d4f19e1d44681911d",

      MSSV: "197CT16969",
      khoaHoc: "K25",
      userName: "si",
      pass: "",
      createdAt: {
        $date: "2023-04-17T18:24:00.987Z",
      },
      updatedAt: {
        $date: "2023-04-18T02:39:33.519Z",
      },
      __v: 0,
      LH: [
        {
          $oid: "6480da76f0ed58e5e65be167",
        },
        {
          $oid: "6480dafb0b57a66b26bcdc85",
        },
      ],
      KT: [
        {
          $oid: "648614a50a7d4d8d9b853fc8",
        },
        {
          $oid: "648614cf76679ce43e9779a0",
        },
      ],
      gioiTinh: "Nam",
      queQuan: "HCM",
      thanNhan: [
        {
          hoTenThanNhan: "Trần Văn Học",
          sdt: {
            $numberLong: "123121312",
          },
          dob: {
            $date: "1978-07-17T00:00:00.000Z",
          },
          gioiTinh: "Nam",
          vaiTro: "Cha",
        },
        {
          hoTenThanNhan: "Nguyễn Thu Hà",
          sdt: {
            $numberLong: "3331413414",
          },
          dob: {
            $date: "1980-11-25T00:00:00.000Z",
          },
          gioiTinh: "Nữ",
          vaiTro: "Mẹ",
        },
      ],
      dob: {
        $date: "2001-04-17T00:00:00.000Z",
      },
      coVan: {
        $oid: "6408d8c725562144e5d9ca8d",
      },
    });
    let saveSubject = await subject.save();
    res.status(200).json(saveSubject);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
