import { UserModel } from './utils/models.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new UserModel({ email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};
