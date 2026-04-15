import { PGlite } from '@electric-sql/pglite';
import { vector } from '@electric-sql/pglite/vector';
import { Document, Chunk, SearchResult } from './types';

export class RAGDatabase {
  private db: PGlite;

  constructor(dbPath: string = './data/rag.db') {
    this.db = new PGlite(dbPath, {
      extensions: { vector }
    });
  }

  async init(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        path TEXT UNIQUE NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE TABLE IF NOT EXISTS chunks (
        id TEXT PRIMARY KEY,
        document_id TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        heading TEXT,
        start_line INTEGER,
        end_line INTEGER,
        embedding VECTOR(768),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_chunks_document ON chunks(document_id);
    `);
  }

  async insertDocument(doc: Document): Promise<void> {
    await this.db.query(
      `INSERT INTO documents (id, path, title, content) VALUES ($1, $2, $3, $4)
       ON CONFLICT (path) DO UPDATE SET title = $3, content = $4`,
      [doc.id, doc.path, doc.title, doc.content]
    );
  }

  async insertChunk(chunk: Chunk): Promise<void> {
    const embeddingStr = chunk.embedding ? `[${chunk.embedding.join(',')}]` : null;
    await this.db.query(
      `INSERT INTO chunks (id, document_id, content, heading, start_line, end_line, embedding)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (id) DO UPDATE SET content = $3, embedding = $7`,
      [chunk.id, chunk.documentId, chunk.content, chunk.heading, chunk.startLine, chunk.endLine, embeddingStr]
    );
  }

  async searchSimilar(embedding: number[], limit: number = 5): Promise<SearchResult[]> {
    const embeddingStr = `[${embedding.join(',')}]`;
    const results = await this.db.query<{
      chunk_id: string;
      document_id: string;
      content: string;
      heading: string;
      start_line: number;
      end_line: number;
      similarity: number;
      path: string;
      title: string;
    }>(`
      SELECT 
        c.id as chunk_id,
        c.document_id,
        c.content,
        c.heading,
        c.start_line,
        c.end_line,
        1 - (c.embedding <=> $1) as similarity,
        d.path,
        d.title
      FROM chunks c
      JOIN documents d ON c.document_id = d.id
      WHERE c.embedding IS NOT NULL
      ORDER BY c.embedding <=> $1
      LIMIT $2
    `, [embeddingStr, limit]);

    return results.rows.map(row => ({
      chunk: {
        id: row.chunk_id,
        documentId: row.document_id,
        content: row.content,
        heading: row.heading,
        startLine: row.start_line,
        endLine: row.end_line
      },
      document: {
        id: row.document_id,
        path: row.path,
        title: row.title,
        content: '' // Don't load full content for search results
      },
      similarity: row.similarity
    }));
  }

  async getStats(): Promise<{ documents: number; chunks: number }> {
    const docResult = await this.db.query<{ count: number }>('SELECT COUNT(*) as count FROM documents');
    const chunkResult = await this.db.query<{ count: number }>('SELECT COUNT(*) as count FROM chunks');
    return {
      documents: docResult.rows[0].count,
      chunks: chunkResult.rows[0].count
    };
  }

  async close(): Promise<void> {
    await this.db.close();
  }
}