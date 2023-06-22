import { serialize } from 'cookie';

export default async (req, res) => {
  const cookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: -1,  // setting maxAge to negative number will delete the cookie
  });

  res.setHeader('Set-Cookie', [cookie]);
  res.status(200).json({ message: 'Logout successful' });
};
