import jwt from 'jsonwebtoken';
import { UserModel } from './models.js';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET;

export default function withAuth(handler) {
  return async (req, res) => {
    try {
      const cookies = parse(req.headers.cookie || '');
      const token = cookies.authToken;
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const decodedToken = jwt.verify(token, JWT_SECRET);
      const user = await UserModel.findById(decodedToken.userId);
      if (!user) {
        throw new Error('User not found');
      }

      req.userId = decodedToken.userId;
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  };
};
