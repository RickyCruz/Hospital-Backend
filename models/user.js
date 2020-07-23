let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'Unknown {PATH}'
};

let userSchema = new Schema({
    name: { type: String, required: [true, 'The {PATH} is required'] },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLE', enum: validRoles },
});

userSchema.plugin(uniqueValidator, { message: 'The {PATH} has already been taken'});

userSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object._id = _id;

    return object;
})

module.exports = mongoose.model('User', userSchema);
