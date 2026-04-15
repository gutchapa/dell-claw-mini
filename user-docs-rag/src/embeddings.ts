import ollama from 'ollama';

export class EmbeddingGenerator {
  private model: string;

  constructor(model: string = 'nomic-embed-text') {
    this.model = model;
  }

  async checkModel(): Promise<boolean> {
    try {
      const models = await ollama.list();
      return models.models.some(m => m.name === this.model);
    } catch {
      return false;
    }
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await ollama.embeddings({
      model: this.model,
      prompt: text
    });
    return response.embedding;
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const text of texts) {
      const embedding = await this.generateEmbedding(text);
      embeddings.push(embedding);
    }
    return embeddings;
  }
}