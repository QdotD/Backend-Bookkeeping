import { UserModel } from './utils/models.js';
import withAuth from './utils/withAuth.js';

export default withAuth(async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Return the account data
    const accountData = {
      name: user.name,
      email: user.email,
      // ... other account data
    };
    res.json(accountData);
  } catch (error) {
    console.error('Error fetching account data:', error);
    res.status(500).json({ error: 'Error fetching account data' });
  }
});
