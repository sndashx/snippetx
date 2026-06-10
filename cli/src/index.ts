import { Command } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import axios from 'axios';

const API_BASE_URL = process.env.SNIPPETX_API_URL || 'http://localhost:3000';

async function installSnippet() {
  console.log(chalk.blue('🔍 Searching for snippets...'));
  
  // Get snippet ID from user
  const { snippetId } = await inquirer.prompt([
    {
      name: 'snippetId',
      type: 'input',
      message: 'Enter the snippet ID to install:',
      validate: (input: string) => {
        if (!input.trim()) {
          return 'Snippet ID is required';
        }
        return true;
      }
    }
  ]);

  try {
    console.log(chalk.yellow(`📦 Installing snippet: ${snippetId}`));
    
    // Check if user is authenticated
    const { data: { user } } = await axios.get(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${process.env.SNIPPETX_TOKEN || ''}`
      }
    }).catch(() => ({ data: { user: null } }));

    if (!user) {
      console.log(chalk.red('❌ You must be logged in to install snippets.'));
      console.log(chalk.yellow('Please run: snippetx login'));
      return;
    }

    // Create checkout session
    const checkoutResponse = await axios.post(`${API_BASE_URL}/api/checkout`, {
      snippetId
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.SNIPPETX_TOKEN || ''}`
      }
    });

    const { url } = checkoutResponse.data;
    
    console.log(chalk.green('✅ Checkout session created!'));
    console.log(chalk.blue(`🔗 Complete checkout at: ${url}`));
    console.log(chalk.yellow('After checkout, the snippet will be available in your project.'));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(chalk.red(`❌ Error: ${error.response?.data?.error || error.message}`));
    } else {
      console.log(chalk.red(`❌ Unexpected error: ${error}`));
    }
  }
}

async function listSnippets() {
  try {
    console.log(chalk.blue('🔍 Fetching available snippets...'));
    
    const response = await axios.get(`${API_BASE_URL}/api/snippets`);
    const snippets = response.data;

    if (snippets.length === 0) {
      console.log(chalk.yellow('📭 No snippets available.'));
      return;
    }

    console.log(chalk.green('📦 Available snippets:'));
    snippets.forEach((snippet: any, index: number) => {
      console.log(chalk.cyan(`${index + 1}. ${snippet.title}`));
      console.log(chalk.gray(`   ID: ${snippet.id}`));
      console.log(chalk.gray(`   Price: $${snippet.price}`));
      console.log(chalk.gray(`   Description: ${snippet.description}`));
      console.log('');
    });

  } catch (error) {
    console.log(chalk.red(`❌ Error fetching snippets: ${error}`));
  }
}

async function main() {
  const program = new Command();

  program
    .name('snippetx')
    .description('CLI tool for managing SnippetX marketplace')
    .version('0.1.0');

  program
    .command('install')
    .description('Install a snippet from the marketplace')
    .action(async () => {
      await installSnippet();
    });

  program
    .command('list')
    .description('List available snippets')
    .action(async () => {
      await listSnippets();
    });

  program
    .command('login')
    .description('Login to SnippetX marketplace')
    .action(async () => {
      const { token } = await inquirer.prompt([
        {
          name: 'token',
          type: 'password',
          message: 'Enter your API token:',
          mask: '*'
        }
      ]);

      process.env.SNIPPETX_TOKEN = token;
      console.log(chalk.green('✅ Logged in successfully!'));
    });

  await program.parseAsync(process.argv);
}

main().catch((error) => {
  console.error(chalk.red('❌ CLI error:'), error);
  process.exit(1);
});