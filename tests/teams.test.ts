"use strict";

import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { teams, teamMembers, users, snippets, orders } from '../src/db/schema';
import { eq } from 'drizzle-orm';

beforeAll(async () => {
  await db.delete(teams);
  await db.delete(teamMembers);
  await db.delete(users);
  await db.delete(snippets);
  await db.delete(orders);
});

afterAll(async () => {
  await db.delete(teams);
  await db.delete(teamMembers);
  await db.delete(users);
  await db.delete(snippets);
  await db.delete(orders);
});

describe('Teams API', () => {
  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          name: 'Test Team',
          description: 'A test team',
          subscriptionPlan: 'pro',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Team');
      expect(response.body.description).toBe('A test team');
      expect(response.body.subscriptionPlan).toBe('pro');
      expect(response.body.subscriptionStatus).toBe('trial');
    });

    it('should return 400 if team name is missing', async () => {
      const user = await db.insert(users).values({
        id: 'user_456',
        email: 'test2@example.com',
        displayName: 'Test User 2',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({})
        .expect(400);

      expect(response.body.error).toBe('Team name is required');
    });
  });

  describe('GET /api/teams', () => {
    it('should return user teams', async () => {
      const user = await db.insert(users).values({
        id: 'user_789',
        email: 'test3@example.com',
        displayName: 'Test User 3',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const team = await db.insert(teams).values({
        id: 'team_123',
        name: 'Test Team',
        slug: 'test-team',
        description: 'A test team',
        ownerId: user[0].id,
        subscriptionPlan: 'pro',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxMembers: 10,
        maxSnippets: 100,
        maxStorage: 20480,
        monthlyPrice: 2999,
      }).returning();

      await db.insert(teamMembers).values({
        id: 'member_123',
        teamId: team[0].id,
        userId: user[0].id,
        role: 'owner',
      });

      const response = await request(app)
        .get('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(1);
      expect(response.body[0].id).toBe(team[0].id);
      expect(response.body[0].name).toBe('Test Team');
    });
  });

  describe('PATCH /api/teams', () => {
    it('should upgrade team plan', async () => {
      const user = await db.insert(users).values({
        id: 'user_999',
        email: 'test4@example.com',
        displayName: 'Test User 4',
        stripeAccountId: null,
        stripeAccountStatus: 'inactive',
      }).returning();

      const team = await db.insert(teams).values({
        id: 'team_456',
        name: 'Test Team 2',
        slug: 'test-team-2',
        description: 'A test team',
        ownerId: user[0].id,
        subscriptionPlan: 'pro',
        subscriptionStatus: 'active',
        subscriptionExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        maxMembers: 10,
        maxSnippets: 100,
        maxStorage: 20480,
        monthlyPrice: 2999,
      }).returning();

      const response = await request(app)
        .patch('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          teamId: team[0].id,
          action: 'upgrade',
          plan: 'enterprise',
        })
        .expect(200);

      expect(response.body.success).toBe(true);

      const updatedTeam = await db.select().from(teams).where(eq(teams.id, team[0].id));
      expect(updatedTeam[0].subscriptionPlan).toBe('enterprise');
      expect(updatedTeam[0].maxMembers).toBe(50);
      expect(updatedTeam[0].maxSnippets).toBe(500);
      expect(updatedTeam[0].maxStorage).toBe(102400);
    });
  });
});
