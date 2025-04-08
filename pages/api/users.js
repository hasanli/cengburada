import { connectToDB } from '../../lib/mongodb';
import User from '../../models/User';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
  await connectToDB();

  switch (req.method) {
    case 'POST':
      try {
        const { username, password, role } = req.body;
        const hashed = await bcrypt.hash(password, 10);

        let finalRole = 'user';
        const adminHeader = req.headers['x-admin-auth'];

        if (adminHeader === process.env.ADMIN_API_KEY) {
          finalRole = role;
        }

        const newUser = new User({
          username,
          password: hashed,
          role: finalRole,
        });

        await newUser.save();
        return res.status(201).json({ message: 'User created', user: newUser });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'GET':
      try {
        const { id } = req.query;

        if (id) {
          const user = await User.findById(id).select('-password');
          if (!user) return res.status(404).json({ message: 'User not found' });
          return res.status(200).json(user);
        }

        const users = await User.find({}).select('-password');
        return res.status(200).json(users);
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    case 'DELETE':
      try {
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'User removed' });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }

    default:
      return res.status(405).json({ message: 'Method not allowed' });
  }
}