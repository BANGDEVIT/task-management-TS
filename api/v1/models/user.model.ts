import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  fullName: String,
  password: String,
  email: String,
  token:  String,
  phone: String,
  delete: {
    type : Boolean,
    default: false
  },
  deleteAt : Date
},{
  timestamps : true, 
})

const User = mongoose.model("User",userSchema,"users");
 
export default User;