import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: String,
  googleId: String,
  avatar: String,
  password: String, // nếu sau này muốn hỗ trợ login thường
}, { timestamps: true });

export default mongoose.model('User', userSchema);
