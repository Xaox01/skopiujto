const mongoose = require("mongoose")


const UserSchema = new mongoose.Schema({
    username: String,
    password: String
  })

UserSchema.set('timestamps', true);
module.exports = mongoose.model("User", UserSchema)

