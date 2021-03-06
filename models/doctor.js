let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let doctorSchema = new Schema({
    name: { type: String, required: true },
    img: { type: String, required: false },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: Schema.Types.ObjectId, ref: 'Hospital', required: true }
});

module.exports = mongoose.model('Doctor', doctorSchema);
