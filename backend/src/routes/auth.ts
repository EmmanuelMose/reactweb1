import express, { Request, Response } from 'express';
import db from '../Drizzle/db';
import { users } from '../Drizzle/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcrypt';

const router = express.Router();


const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  const { email, password } = result.data;

  try {
    const user = await db.select().from(users).where(eq(users.username, email));

    if (!user.length) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user[0].password);
    if (!isMatch) {
      res.status(401).json({ error: 'Incorrect password' });
      return;
    }

    res.status(200).json({ message: 'Login successful', user: user[0] });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});


router.post('/register', async (req: Request, res: Response): Promise<void> => {
  const result = authSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: 'Invalid input' });
    return;
  }

  const { email, password } = result.data;

  try {
    const exists = await db.select().from(users).where(eq(users.username, email));

    if (exists.length > 0) {
      res.status(400).json({ error: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username: email,
      password: hashedPassword,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

export default router;
