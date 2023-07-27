const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");


const UserSchema = new Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    licenseNumber: {
        type: String
    },
    age: {
        type: Number
    },
    dob: {
        type: String
    },
    carDetails: {
        make: {
            type: String
        },
        model: {
            type: String
        },
        year: {
            type: Number
        },
        plateNumber: {
            type: String
        },
    },
    username: {type: String},
    password: {type: String},
    cpassword: {type: String},
    userType: {type: String},
});

UserSchema.pre("save", function (next) {
    const user = this;
    if (
      user.licenseNumber == null || user.licenseNumber == "" || user.licenseNumber == undefined
    ) {
      bcrypt.hash(user.password, 10, (error, hash) => {
        user.password = hash;
        next();
      });
    } else {
      bcrypt.hash(user.licenseNumber, 10, (error, hash) => {
        user.licenseNumber = hash;
        next();
      });
    }
  });

const User = mongoose.model('User', UserSchema);

module.exports = User