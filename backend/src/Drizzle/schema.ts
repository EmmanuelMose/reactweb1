
import { pgTable, serial, text, boolean, varchar, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
  isVerified: boolean('is_verified').notNull().default(false),
  verificationCode: varchar('verification_code', { length: 6 }),
  verificationTime: timestamp('verification_time', { mode: 'date' }).defaultNow(), 
});
