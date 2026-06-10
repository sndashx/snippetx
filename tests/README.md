# Testing

This directory contains tests for the SnippetX application. All tests are written using Jest and follow the standard testing patterns for Node.js applications.

## Test Structure

The tests are organized as follows:

### API Tests

- `tests/teams.test.ts` - Tests for the Teams API endpoints
- `tests/bounties.test.ts` - Tests for the Bounties API endpoints  
- `tests/premium-vetting.test.ts` - Tests for the Premium Vetting API endpoints

### Test Framework

The tests use:
- **Jest** - JavaScript testing framework
- **Supertest** - HTTP assertion library for testing API endpoints
- **Drizzle ORM** - Database testing utilities

## Running Tests

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Environment variables configured

### Running Tests

```bash
# Install test dependencies
npm install

# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Environment

The tests use a test database that is automatically created and destroyed for each test run. This ensures that tests don't interfere with the production database.

## Test Coverage

The tests aim to achieve at least 80% code coverage for:

- API endpoint validation
- Database operations
- Error handling
- Input validation

## Test Examples

### Teams API Test

```typescript
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { teams, teamMembers, users } from '../src/db/schema';

describe('Teams API', () => {
  describe('POST /api/teams', () => {
    it('should create a new team', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
      }).returning();

      const response = await request(app)
        .post('/api/teams')
        .set('Authorization', `Bearer ${user[0].id}`)
        .send({
          name: 'Test Team',
          description: 'A test team',
        })
        .expect(200);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('Test Team');
    });
  });
});
```

### Bounties API Test

```typescript
import request from 'supertest';
import { app } from '../src/app';
import { db } from '../src/db';
import { users, snippets, orders } from '../src/db/schema';

describe('Bounties API', () => {
  describe('POST /api/bounties', () => {
    it('should create a new bounty', async () => {
      const user = await db.insert(users).values({
        id: 'user_123',
        email: 'test@example.com',
        displayName: 'Test User',
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
    });
  });
});
```

## Test Categories

### Unit Tests

- Component tests
- Utility function tests
- Database schema tests

### Integration Tests

- API endpoint tests
- Database operation tests
- Authentication tests

### E2E Tests

- User flow tests
- Authentication tests
- Data validation tests

## Test Best Practices

### Mock Data

Use mock data for:
- Database records
- API responses
- External service calls

### Test Isolation

Each test should be isolated:
- Use transactions for database operations
- Clean up test data after each test
- Mock external dependencies

### Error Handling

Test error scenarios:
- Invalid input validation
- Missing authentication
- Database connection errors
- External service failures

## Troubleshooting

### Test Failures

If tests fail:

1. Check database connectivity
2. Verify environment variables
3. Check for syntax errors in test files
4. Review test assertions

### Test Coverage Issues

If coverage is below 80%:

1. Add tests for uncovered code paths
2. Mock external dependencies
3. Review test coverage reports

## Continuous Integration

The tests can be integrated into CI/CD pipelines:

```yaml
# Example GitHub Actions workflow
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
```

## Testing Documentation

For more detailed information about testing:

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/ladjs/supertest)
- [Drizzle ORM Testing](https://orm.drizzle.team/docs/usage)

## License

This testing documentation is licensed under the MIT License.
