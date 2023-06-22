import { DateTime } from './utils/models.js';

export default async (req, res) => {
  try {
    // Fetch all date and time entries from the database
    const dates = await DateTime.find();

    res.json({ success: true, data: dates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
