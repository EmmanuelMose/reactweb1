import express, { Request, Response } from 'express';
import { sendVerificationEmail } from '../mailer';
import db from '../Drizzle/db';
import { users } from '../Drizzle/schema';
import { eq } from 'drizzle-orm';
import { hash } from 'bcryptjs';
import bcrypt from 'bcryptjs';


const router = express.Router();


router.post('/check-user', async (req: Request, res: Response): Promise<void> => {
  const { username } = req.body;

  if (!username) {
    res.status(400).json({ error: 'Username is required' });
    return;
  }

  try {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);

    if (result.length > 0) {
      res.status(200).json({ exists: true });
    } else {
      res.status(404).json({ exists: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('User lookup error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


router.post('/send-code', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email is required' });
    return;
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const now = new Date(); 

  try {
    await sendVerificationEmail(email, code);

    await db
      .update(users)
      .set({
        verificationCode: code,
        verificationTime: now,
      })
      .where(eq(users.username, email));

    res.status(200).json({ message: 'Verification code sent and saved' });
  } catch (err) {
    console.error('Error sending code:', err);
    res.status(500).json({ error: 'Failed to send verification code' });
  }
});


router.post('/verify-code', async (req: Request, res: Response): Promise<void> => {
  const { email, code } = req.body;

  if (!email || !code) {
    res.status(400).json({ error: 'Email and code are required' });
    return;
  }

  try {
    const result = await db.select().from(users).where(eq(users.username, email)).limit(1);

    if (result.length === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const user = result[0];

    if (user.verificationCode !== code) {
      res.status(401).json({ error: 'Invalid verification code' });
      return;
    }

    if (!user.verificationTime) {
      res.status(410).json({ error: 'Verification code expired' });
      return;
    }

    const now = new Date();
    const codeTime = new Date(user.verificationTime);
    const diffMinutes = (now.getTime() - codeTime.getTime()) / (1000 * 60);

    console.log('Now:', now.toISOString());
    console.log('Code time:', codeTime.toISOString());
    console.log('Diff minutes:', diffMinutes);

    if (diffMinutes > 5) {
      res.status(410).json({ error: 'Verification code expired' });
      return;
    }

    res.status(200).json({ success: true, message: 'Code verified' });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: 'Email and new password are required' });
    return;
  }

  try {
    const hashed = await hash(password, 10);

    await db
      .update(users)
      .set({
        password: hashed,
        verificationCode: null,
        verificationTime: null,
        isVerified: true,
      })
      .where(eq(users.username, email));

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

export default router;
