const mongoose = require("mongoose");

const KhoaSchema = new mongoose.Schema({
    maKhoa: {type: String, required: true},
    tenKhoa: {type: String, required: true},
})

module.exports = mongoose.model('Khoa', KhoaSchema, 'khoa');