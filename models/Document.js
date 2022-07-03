const mongoose = require("mongoose")
const documentScheme = new mongoose.Schema({
  
  value: {
    type: String,
    required: true,
  }
})


const UserSchema = new mongoose.Schema({
  username: String,
  password: String
})

documentScheme.set('timestamps', true);
module.exports = mongoose.model("Document", documentScheme)
