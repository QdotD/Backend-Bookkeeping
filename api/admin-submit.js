import { DateTime } from './utils/models.js';

export default async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    const dateTime = new DateTime({ date, startTime, endTime });
    await dateTime.save();
    res.json({ success: true, message: 'Data saved successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
