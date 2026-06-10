"use strict";

import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { users, premiumVetting, verifiedBadges } from '../src/db/schema';
import { eq } from 'drizzle-orm';

beforeAll(async () => {
  await db.delete(verifiedBadges);
  await db.delete(premiumVetting);
  await db.delete(users);
});

afterAll(async () => {
  await db.delete(verifiedBadges);
  await db.delete(premiumVetting);
  await db.delete(users);
});

describe('Premium Vetting API', () => {
  describe('POST /api/premium-vetting', () => {
    it('should create a new premium vetting submission', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/premium-vetting')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          verificationType: 'business',
          documents: ['https://example.com/doc1.pdf'],
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.userId).toBe(user[0].id);
      expect(response.body.verificationType).toBe('business');
      expect(response.body.documents).toEqual(['https://example.com/doc1.pdf']);
      expect(response.body.status).toBe('pending');
    });

    it('should return 400 if required fields are missing', async () => {
      const user = await db.insert(users).values({
        id: 'user_456',
        email: 'test2@example.com',
        displayName: 'Test User 2',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/premium-vetting')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Verification type and documents are required');
    });
  });

  describe('GET /api/premium-vetting', () => {
    it('should return pending vettings', async () => {
      const user = await db.insert(users).values({
        id: 'user_789',
        email: 'test3@example.com',
        displayName: 'Test User 3',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const vetting = await db.insert(premiumVetting).values({
        id: 'vetting_123',
        userId: user[0].id,
        status: 'pending',
        verificationType: 'identity',
        submissionDate: new Date(),
        documents: ['https://example.com/doc1.pdf'],
      }).returning();

      const response = await request(app)
        .get('/api/premium-vetting?status=pending')
        .set('Authorization', `Bearer ${user[0].id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(vetting[0].id);
      expect(response.body[0].status).toBe('pending');
    });
  });

  describe('PATCH /api/premium-vetting', () => {
    it('should approve a vetting submission', async () => {
      const reviewer = await db.insert(users).values({
        id: 'user_999',
        email: 'reviewer@example.com',
        displayName: 'Reviewer User',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const user = await db.insert(users).values({
        id: 'user_111',
        email: 'test4@example.com',
        displayName: 'Test User 4',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const vetting = await db.insert(premiumVetting).values({
        id: 'vetting_456',
        userId: user[0].id,
        status: 'pending',
        verificationType: 'business',
        submissionDate: new Date(),
        documents: ['https://example.com/doc1.pdf'],
      }).returning();

      const response = await request(app)
        .patch('/api/premium-vetting')
        .set('Authorization', `Bearer ${reviewer[0].id}`)
        .send({
          vettingId: vetting[0].id,
          action: 'approve',
          reviewerNotes: 'All documents verified successfully',
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      const updatedVetting = await db.select().from(premiumVetting).where(eq(premiumVetting.id, vetting[0].id));
      expect(updatedVetting[0].status).toBe('approved');
      expect(updatedVetting[0].reviewDate).toBeTruthy();

      const badge = await db.select().from(verifiedBadges).where(eq(verifiedBadges.userId, user[0].id));
      expect(badge.length).toBe(1);
      expect(badge[0].badgeType).toBe('verified_seller');
    });

    it('should reject a vetting submission', async () => {
      const reviewer = await db.insert(users).values({
        id: 'user_222',
        email: 'reviewer2@example.com',
        displayName: 'Reviewer User 2',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const user = await db.insert(users).values({
        id: 'user_333',
        email: 'test5@example.com',
        displayName: 'Test User 5',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const vetting = await db.insert(premiumVetting).values({
        id: 'vetting_789',
        userId: user[0].id,
        status: 'pending',
        verificationType: 'identity',
        submissionDate: new Date(),
        documents: ['https://example.com/doc1.pdf'],
      }).returning();

      const response = await request(app)
        .patch('/api/premium-vetting')
        .set('Authorization', `Bearer ${reviewer[0].id}`)
        .send({
          vettingId: vetting[0].id,
          action: 'reject',
          reviewerNotes: 'Documents are not clear enough',
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      const updatedVetting = await db.select().from(premiumVetting).where(eq(premiumVetting.id, vetting[0].id));
      expect(updatedVetting[0].status).toBe('rejected');
      expect(updatedVetting[0].reviewDate).toBeTruthy();
    });
  });
});
