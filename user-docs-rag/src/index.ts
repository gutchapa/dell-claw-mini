#!/usr/bin/env bun
import { Command } from 'commander';
import { RAGDatabase } from './db';
import { DocumentIngestor } from './ingest';
import { DocumentSearcher } from './search';

const program = new Command();
const db = new RAGDatabase();

program
  .name('user-docs-rag')
  .description('TypeScript RAG with PGlite and Ollama')
  .version('1.0.0');

program
  .command('ingest')
  .description('Ingest documents from docs/ directory')
  .option('-d, --dir <path>', 'Documents directory', './docs')
  .action(async (options) => {
    console.log('🚀 Starting ingestion...');
    await db.init();
    
    const ingestor = new DocumentIngestor(db);
    await ingestor.ingestAll(options.dir);
    
    await db.close();
  });

program
  .command('search')
  .description('Search documents interactively')
  .action(async () => {
    await db.init();
    
    const searcher = new DocumentSearcher(db);
    await searcher.interactiveSearch();
    
    await db.close();
  });

program
  .command('stats')
  .description('Show database statistics')
  .action(async () => {
    await db.init();
    
    const searcher = new DocumentSearcher(db);
    await searcher.displayStats();
    
    await db.close();
  });

program.parse();