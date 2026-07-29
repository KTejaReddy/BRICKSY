import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

export async function getRecommendations(workerData: any) {
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/recommend`, workerData, {
      timeout: 10000,
    });
    return response.data;
  } catch {
    return { error: 'AI service unavailable, using fallback scoring' };
  }
}
