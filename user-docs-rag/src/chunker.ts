import { Document, Chunk } from './types';

export class DocumentChunker {
  private maxChunkSize: number;
  private overlap: number;

  constructor(maxChunkSize: number = 1000, overlap: number = 100) {
    this.maxChunkSize = maxChunkSize;
    this.overlap = overlap;
  }

  chunkByHeadings(content: string, docId: string): Chunk[] {
    const lines = content.split('\n');
    const chunks: Chunk[] = [];
    let currentChunk: string[] = [];
    let currentHeading = '';
    let startLine = 0;
    let chunkId = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check for markdown heading
      if (line.startsWith('#')) {
        // Save previous chunk if exists
        if (currentChunk.length > 0) {
          chunks.push({
            id: `${docId}_${chunkId++}`,
            documentId: docId,
            content: currentChunk.join('\n').trim(),
            heading: currentHeading,
            startLine,
            endLine: i - 1
          });
        }
        currentHeading = line.replace(/^#+\s*/, '');
        currentChunk = [line];
        startLine = i;
      } else {
        currentChunk.push(line);
        
        // Check chunk size
        const chunkText = currentChunk.join('\n');
        if (chunkText.length > this.maxChunkSize) {
          chunks.push({
            id: `${docId}_${chunkId++}`,
            documentId: docId,
            content: chunkText.trim(),
            heading: currentHeading,
            startLine,
            endLine: i
          });
          // Overlap for context
          const overlapLines = currentChunk.slice(-Math.floor(this.overlap / 50));
          currentChunk = [...overlapLines, line];
          startLine = i - overlapLines.length;
        }
      }
    }

    // Don't forget last chunk
    if (currentChunk.length > 0) {
      chunks.push({
        id: `${docId}_${chunkId++}`,
        documentId: docId,
        content: currentChunk.join('\n').trim(),
        heading: currentHeading,
        startLine,
        endLine: lines.length - 1
      });
    }

    return chunks;
  }

  chunkByParagraphs(content: string, docId: string): Chunk[] {
    const paragraphs = content.split(/\n\s*\n/);
    const chunks: Chunk[] = [];
    
    for (let i = 0; i < paragraphs.length; i++) {
      if (paragraphs[i].trim()) {
        chunks.push({
          id: `${docId}_${i}`,
          documentId: docId,
          content: paragraphs[i].trim(),
          heading: '',
          startLine: -1,
          endLine: -1
        });
      }
    }

    return chunks;
  }
}