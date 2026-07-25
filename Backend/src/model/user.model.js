const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, 'Name must be unique'],
        required: [true, 'Name is required'],
    },
    email: {
        type: String,
        unique: [true, 'Email already exists'],
        required: [true, 'Email is required'],
        validate: {
            validator: function(email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Invalid email address'
        }
    },
    password: {
        type: String,
        required: true
    }
});

const userModel = mongoose.model("users", userSchema);



module.exports = userModel;