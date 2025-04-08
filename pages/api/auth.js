import { connectToDB } from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await connectToDB();

  if (req.method === 'POST') {
    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ message: "Invalid password" });
      }

      return res.status(200).json({
        message: "Login successful",
        user: {
          _id: user._id,
          username: user.username,
          role: user.role
        }
      });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
