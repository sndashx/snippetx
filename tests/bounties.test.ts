"use strict";

import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { users, snippets, orders } from '../src/db/schema';
import { eq } from 'drizzle-orm';

beforeAll(async () => {
  await db.delete(orders);
  await db.delete(snippets);
  await db.delete(users);
});

afterAll(async () => {
  await db.delete(orders);
  await db.delete(snippets);
  await db.delete(users);
});

describe('Bounties API', () => {
  describe('POST /api/bounties', () => {
    it('should create a new bounty', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/bounties')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          title: 'React Component Library',
          description: 'Build a reusable React component library',
          language: 'typescript',
          budget: 1000,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          requirements: ['TypeScript', 'Tailwind CSS'],
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe('React Component Library');
      expect(response.body.description).toBe('Build a reusable React component library');
      expect(response.body.language).toBe('typescript');
      expect(response.body.budget).toBe(1000);
      expect(response.body.status).toBe('open');
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
        .post('/api/bounties')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Missing required fields');
    });
  });

  describe('GET /api/bounties', () => {
    it('should return open bounties', async () => {
      const user = await db.insert(users).values({
        id: 'user_789',
        email: 'test3@example.com',
        displayName: 'Test User 3',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const snippet = await db.insert(snippets).values({
        id: 'snippet_123',
        sellerId: user[0].id,
        title: 'Test Snippet',
        description: 'A test snippet',
        language: 'typescript',
        price: 500,
        filePath: '/test/snippet.ts',
        tags: ['typescript', 'test'],
      }).returning();

      const order = await db.insert(orders).values({
        id: 'order_123',
        buyerId: user[0].id,
        sellerId: user[0].id,
        snippetId: snippet[0].id,
        amount: 1000,
        platformFee: 100,
        status: 'open',
      }).returning();

      const response = await request(app)
        .get('/api/bounties?status=open')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(order[0].id);
      expect(response.body[0].title).toBe('Test Snippet');
    });
  });
});
