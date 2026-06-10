#!/usr/bin/env node

import { execSync } from 'child_process';
import path from 'path';

console.log('🧪 Running tests for SnippetX...');

// Change to tests directory
process.chdir(path.join(__dirname, 'tests'));

try {
  // Run Jest tests
  execSync('npx jest --coverage', { stdio: 'inherit' });
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌ Tests failed:', error);
  process.exit(1);
}
