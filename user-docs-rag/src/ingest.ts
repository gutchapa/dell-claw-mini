import { promises as fs } from 'fs';
import path from 'path';
import { glob } from 'glob';
import { RAGDatabase } from './db';
import { DocumentChunker } from './chunker';
import { EmbeddingGenerator } from './embeddings';
import { Document, Chunk } from './types';

export class DocumentIngestor {
  private db: RAGDatabase;
  private chunker: DocumentChunker;
  private embedder: EmbeddingGenerator;

  constructor(db: RAGDatabase) {
    this.db = db;
    this.chunker = new DocumentChunker();
    this.embedder = new EmbeddingGenerator();
  }

  async ingestAll(docsDir: string): Promise<void> {
    const files = await glob('**/*.{md,txt}', { cwd: docsDir });
    console.log(`📁 Found ${files.length} documents to ingest`);

    for (let i = 0; i < files.length; i++) {
      const filePath = files[i];
      console.log(`\n[${i + 1}/${files.length}] Processing: ${filePath}`);
      await this.ingestFile(path.join(docsDir, filePath), filePath);
    }

    const stats = await this.db.getStats();
    console.log(`\n✅ Ingestion complete: ${stats.documents} documents, ${stats.chunks} chunks`);
  }

  async ingestFile(fullPath: string, relativePath: string): Promise<void> {
    try {
      const content = await fs.readFile(fullPath, 'utf-8');
      const title = path.basename(relativePath, path.extname(relativePath));
      
      const doc: Document = {
        id: this.generateId(relativePath),
        path: relativePath,
        title,
        content,
        createdAt: new Date()
      };

      await this.db.insertDocument(doc);
      console.log(`  📄 Document: ${doc.id}`);

      // Chunk by headings for markdown, paragraphs for text
      const chunks = relativePath.endsWith('.md') 
        ? this.chunker.chunkByHeadings(content, doc.id)
        : this.chunker.chunkByParagraphs(content, doc.id);

      console.log(`  ✂️  Chunks: ${chunks.length}`);

      // Generate embeddings in batches
      const batchSize = 10;
      for (let i = 0; i < chunks.length; i += batchSize) {
        const batch = chunks.slice(i, i + batchSize);
        const texts = batch.map(c => c.content);
        const embeddings = await this.embedder.generateEmbeddings(texts);
        
        for (let j = 0; j < batch.length; j++) {
          batch[j].embedding = embeddings[j];
          await this.db.insertChunk(batch[j]);
        }
        
        process.stdout.write(`  🔢 Embeddings: ${Math.min(i + batchSize, chunks.length)}/${chunks.length}\r`);
      }
      console.log('');

    } catch (error) {
      console.error(`  ❌ Error processing ${relativePath}:`, error);
    }
  }

  private generateId(path: string): string {
    return path.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  }
}