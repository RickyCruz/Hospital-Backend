let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let hospitalSchema = new Schema({
        name: { type: String, required: true },
        img: { type: String, required: false },
        user: { type: Schema.Types.ObjectId, ref: 'User' }
    },
    { collection: 'hospitals' } // Custom name
);

module.exports = mongoose.model('Hospital', hospitalSchema);
