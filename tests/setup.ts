"use strict";

import { app } from '../src/app';
import { db } from '../src/db';

beforeAll(async () => {
  await db.execute('BEGIN');
});

afterAll(async () => {
  await db.execute('ROLLBACK');
});

afterEach(async () => {
  await db.execute('ROLLBACK');
});
