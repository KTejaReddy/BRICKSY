import axios from 'axios';

const AI_SERVICE_URL = process.env.AI_SERVICE_URL;

export async function getRecommendations(workerData: any) {
  if (!AI_SERVICE_URL) {
    return { error: 'AI service unavailable, using fallback scoring' };
  }
  try {
    const response = await axios.post(`${AI_SERVICE_URL}/recommend`, workerData, {
      timeout: 10000,
    });
    return response.data;
  } catch {
    return { error: 'AI service unavailable, using fallback scoring' };
  }
}
