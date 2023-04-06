const router = require("express").Router();
const Khoa = require("../models/van_lang/Khoa");
const GiangVien = require("../models/van_lang/GiangVien");
const SinhVien = require("../models/van_lang/SinhVien");
const MonHoc = require("../models/van_lang/MonHoc");

router.post("/students", async (req, res) => {
  let students;
  let count;
  try {
    // students = await Khoa.find();
    // count = await Khoa.find().count();
    let a = await SinhVien.find({ _id: req.body.id })
      .populate(["id_MH", "id_khoa"])
      .exec();

    res.status(200).json({ data: a, count: 10 });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

// router.post("/create", async (req, res) => {
//   let students;
//   let count = 20;
//   try {
//     console.log(req.body);
//     students = await Khoa.find();
//     const student = new GiangVien({
//       tenGV: req.body.tenGV,
//       SDT: req.body.SDT,
//       MSGV: req.body.MSGV,
//       id_khoa: students[0]._id,
//     });
//     let a = await student.save();
//     console.log(a);
//     res.status(200).json({ items: a, count });
//   } catch (error) {
//     console.log(error);
//     res.status(500);
//   }
// });

module.exports = router;
