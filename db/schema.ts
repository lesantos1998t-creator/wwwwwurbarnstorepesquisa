import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const registrations = pgTable('registrations', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  ageRange: text('age_range').notNull(),
  gender: text('gender').notNull(),
  email: text('email').notNull(),
  address: text('address').notNull(),
  houseNumber: text('house_number').notNull(),
  truthfulData: boolean('truthful_data').notNull(),
  voluntaryParticipation: boolean('voluntary_participation').notNull(),
  privacyConsent: boolean('privacy_consent').notNull(),
  academicUseConsent: boolean('academic_use_consent').notNull(),
  consentVersion: text('consent_version').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  product: text('product').notNull(),
  stars: integer('stars').notNull(),
  comment: text('comment').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const feedback = pgTable('feedback', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  message: text('message').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});
