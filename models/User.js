import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  averageRatingGiven: { type: Number, default: 0 },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
