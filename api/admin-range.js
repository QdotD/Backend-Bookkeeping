import { DateTime } from './utils/models.js';

export default async function(req, res) {
    const { start, end } = req.query;

    try {
        const dates = await DateTime.find({
            date: {
                $gte: start,
                $lte: end,
            },
        });
        res.json({ success: true, data: dates });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
