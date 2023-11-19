import mongoose from "mongoose";
import bcrypt from "bcryptjs";
const UserCheme = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  secret: String, 
  img: {
    type:String,
    default:
      'https://static-images.vnncdn.net/files/publish/2023/5/7/dien-vien-2-821.jpg',
  },
  role: {
    type: String,
    default: "member",
  },
  refreshToken: {
    type: String,
},
  phoneNumber: String
},{
  timestamps: true
});
UserCheme.methods = {
  isCorrectPassword: async function (password) {
      return await bcrypt.compare(password, this.password)
  }
}
export default mongoose.model("User", UserCheme);