import { RAGDatabase } from './db';
import { EmbeddingGenerator } from './embeddings';
import { SearchResult } from './types';

export class DocumentSearcher {
  private db: RAGDatabase;
  private embedder: EmbeddingGenerator;

  constructor(db: RAGDatabase) {
    this.db = db;
    this.embedder = new EmbeddingGenerator();
  }

  async search(query: string, limit: number = 5): Promise<SearchResult[]> {
    const queryEmbedding = await this.embedder.generateEmbedding(query);
    const results = await this.db.searchSimilar(queryEmbedding, limit);
    return results;
  }

  async interactiveSearch(): Promise<void> {
    console.log('\n🔍 Interactive Search (type "quit" to exit)');
    console.log('=' .repeat(50));

    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const askQuestion = () => {
      rl.question('\nQuery: ', async (query) => {
        if (query.toLowerCase() === 'quit') {
          rl.close();
          return;
        }

        console.log('  Searching...');
        const results = await this.search(query);
        
        console.log(`\n  Found ${results.length} results:\n`);
        results.forEach((r, i) => {
          console.log(`  ${i + 1}. ${r.chunk.heading || r.document.title} (${(r.similarity * 100).toFixed(1)}%)`);
          console.log(`     From: ${r.document.path}`);
          console.log(`     ${r.chunk.content.substring(0, 200)}...`);
          console.log('');
        });

        askQuestion();
      });
    };

    askQuestion();
  }

  async displayStats(): Promise<void> {
    const stats = await this.db.getStats();
    console.log('\n📊 Database Stats:');
    console.log(`   Documents: ${stats.documents}`);
    console.log(`   Chunks: ${stats.chunks}`);
  }
}