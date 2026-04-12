/**
 * Embedding Service - OLLAMA VERSION (Modified from OpenAI)
 * Uses local Ollama nomic-embed-text instead of OpenAI API
 * 768 dimensions (nomic-embed-text)
 */

const MODEL = 'nomic-embed-text';
const DIMENSIONS = 768;
const MAX_CHARS = 8000;

export async function embed(text: string): Promise<Float32Array> {
  const truncated = text.slice(0, MAX_CHARS);
  const result = await embedBatch([truncated]);
  return result[0];
}

export async function embedBatch(texts: string[]): Promise<Float32Array[]> {
  const results: Float32Array[] = [];
  
  for (const text of texts) {
    const truncated = text.slice(0, MAX_CHARS);
    
    try {
      const response = await fetch('http://localhost:11434/api/embeddings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: MODEL,
          prompt: truncated
        })
      });
      
      if (!response.ok) {
        throw new Error(`Ollama embedding failed: ${response.status}`);
      }
      
      const data = await response.json();
      results.push(new Float32Array(data.embedding));
    } catch (e) {
      console.error('Embedding error:', e);
      // Return zero vector as fallback
      results.push(new Float32Array(DIMENSIONS).fill(0));
    }
  }
  
  return results;
}

export { MODEL as EMBEDDING_MODEL, DIMENSIONS as EMBEDDING_DIMENSIONS };
