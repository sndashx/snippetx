const { Client } = require('pg');
const fs = require('fs');

async function deploy() {
  const client = new Client({
    connectionString: 'postgresql://postgres.evqulhegalbwezzrkbxp:SnippetX2024!@aws-0-us-west-2.pooler.supabase.com:6543/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database via pooler (6543)');
    const sql = fs.readFileSync('/root/Desktop/Patrick Devine files/expanded_schema.sql', 'utf8');
    await client.query(sql);
    console.log('Expanded schema deployed successfully');
  } catch (err) {
    console.error('Error deploying expanded schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

deploy();
