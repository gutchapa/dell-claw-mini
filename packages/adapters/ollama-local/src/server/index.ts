export { execute, testEnvironment } from "./execute.js";

// FIX: Add listModels function to populate the model dropdown
export async function listModels(): Promise<{ id: string; label: string }[]> {
  try {
    const response = await fetch("http://localhost:11434/api/tags");
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    const models = data.models || [];
    
    return models.map((model: { name: string; size?: number }) => ({
      id: model.name,
      label: `${model.name} (${Math.round((model.size || 0) / 1024 / 1024 / 1024 * 10) / 10}GB)`,
    }));
  } catch {
    // Ollama not running, return empty list
    return [];
  }
}