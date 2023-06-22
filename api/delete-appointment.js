import { connectToDatabase } from './db';
import { DateTime, UserModel } from './models';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export default async (req, res) => {
    const { db } = await connectToDatabase();

    // Authenticate the user before performing the delete operation
    const token = req.cookies.authToken;

    if (!token) {
      return res.status(403).json({ error: 'Not authenticated' });
    }

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (e) {
      if (e instanceof jwt.JsonWebTokenError) {
        return res.status(403).json({ error: 'Not authenticated' });
      }
      return res.status(400).json({ error: 'Bad request' });
    }

    const { userId } = payload;

    // Here you could check if the user is an admin before deleting the appointment
    const user = await UserModel.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized' });
    }

    if (req.method === 'DELETE') {
        // Get the ID from the request body
        const { id } = req.body;
        try {
            // Find the document by ID and delete it
            const result = await DateTime.findOneAndDelete({ _id: id });
            if (!result) {
                // If no result is returned, the document with the provided ID does not exist
                res.status(404).json({ error: 'Appointment not found' });
                return;
            }

            // If the deletion is successful, return the deleted document
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            // If an error occurred, return the error
            res.status(500).json({ error: 'An error occurred while deleting the appointment.' });
        }
    } else {
        // If the request method is not DELETE, return an error
        res.status(405).json({ error: 'Invalid request method' });
    }
};
