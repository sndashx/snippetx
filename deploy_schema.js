const { Client } = require('pg');
const fs = require('fs');

async function deploy() {
  const client = new Client({
    connectionString: 'postgresql://postgres.evqulhegalbwezzrkbxp:SnippetX2024!@54.70.143.232:5432/postgres',
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Connected to database via pooler IP');
    const sql = fs.readFileSync('/root/Desktop/Patrick Devine files/schema.sql', 'utf8');
    await client.query(sql);
    console.log('Schema deployed successfully');
  } catch (err) {
    console.error('Error deploying schema:', err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

deploy();
