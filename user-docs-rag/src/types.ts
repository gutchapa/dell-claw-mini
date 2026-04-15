export interface Document {
  id: string;
  path: string;
  title: string;
  content: string;
  createdAt: Date;
}

export interface Chunk {
  id: string;
  documentId: string;
  content: string;
  heading: string;
  startLine: number;
  endLine: number;
  embedding?: number[];
}

export interface SearchResult {
  chunk: Chunk;
  document: Document;
  similarity: number;
}