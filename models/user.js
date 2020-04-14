let mongoose = require('mongoose');

let Schema = mongoose.Schema;

let userSchema = new Schema({
    name: { type: String, required: [true, 'The name is necessary'] },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE' },
});

module.exports = mongoose.model('User', userSchema);
