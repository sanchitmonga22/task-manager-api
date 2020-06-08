const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        Validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid");
            }
        },
    },
    age: {
        type: Number,
        default: 0,
        Validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number");
            }
        },
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        Validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password should be ");
            }
        },
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    // store binary data
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({
        _id: user._id.toString()
    }, process.env.JWT_SECRET);
    user.tokens = user.tokens.concat({
        token: token
    })
    await user.save()
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email: email,
    });
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Unable to login");
    }
    return user;
};

// Delete the user tasks before the user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({
        owner: user._id
    })
    next()
})


// Hash the password before sending it to the database
userSchema.pre("save", async function (next) {
    const user = this;
    //This is a middle ware,
    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
});

const User = mongoose.model("user", userSchema);

// const me = new User({
//     name: "Sanchit",
//     age: 20,
//     email: "samcnt@famail.com",
//     password: "   svsvasbsbe        ",
// });

// me.save()
//     .then(() => {
//         console.log(me);
//     })
//     .catch((error) => {
//         console.log(error);
//     });

module.exports = User;