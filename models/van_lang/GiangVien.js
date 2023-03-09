const mongoose = require("mongoose");

const GiangVienSchema = new mongoose.Schema({
    tenGV: {type: String, require: true},
    SDT: {type: Number, require: true},
    MSGV: {type: String, require: true},
    id_khoa: {type: mongoose.Schema.Types.ObjectId, require: true,ref: 'Khoa'}
},
    {timestamps: true}    
)
module.exports = mongoose.model('GiangVien', GiangVienSchema, 'giangVien');