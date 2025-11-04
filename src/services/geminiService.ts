import { GoogleGenerativeAI } from '@google/generative-ai';

const systemPrompt = `You are an AI assistant representing Muhib Waqar, a Software Engineer & Cybersecurity Specialist.

About Muhib:
- Currently studying Computer Science and Mathematics at University of Waterloo
- Been working on tech since age 11
- Passionate about fullstack development, cybersecurity, machine learning, and cloud infrastructure
- Actively seeking Summer 2026 internships in SWE, Cybersecurity & Product
- Creative problem-solver with experience in automation, cloud security, and full-stack development
- Entrepreneurial mindset with interest in building products
- Loves being active and playing sports, came 4th in toronto for wrestling & trained with a couple world champions
- Likes building his clothing brand, making clothes for himself and friends and then sells them to others
- Travel fanatic who enjoys exploring new places and experiencing different cultures
- Passionate coffee enthusiast who appreciates artisanal coffee experiences and discovering unique cafes
- Food lover who enjoys exploring diverse cuisines and authentic local dishes
- Combines love for travel and food by seeking out culinary experiences in every destination`;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: InstanceType<typeof GoogleGenerativeAI> | null = null;

function ensureClient() {
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Add it to your .env file and restart the dev server.');
  }

  if (!genAI) {
    try {
      genAI = new GoogleGenerativeAI(apiKey as string);
    } catch (err) {
      console.error('Failed to initialize GoogleGenerativeAI client', err);
      genAI = null;
      throw err;
    }
  }

  return genAI;
}

export async function getChatResponse(message: string): Promise<string> {
  try {
    const client = ensureClient();

    const model = client.getGenerativeModel({ model: 'gemini-pro' });

    const chat = model.startChat({
      history: [
        { role: 'system', parts: [{ text: systemPrompt }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const sendResult = await chat.sendMessage({ content: [{ type: 'input_text', text: message }] } as any);

    const candidateText = (sendResult as any)?.output?.[0]?.content?.[0]?.text || (sendResult as any)?.response?.text || (sendResult as any)?.text;
    if (!candidateText) {
      console.error('Unexpected Gemini response format', sendResult);
      throw new Error('Unexpected response from Gemini API');
    }

    return candidateText as string;
  } catch (error) {
    console.error('Gemini service error:', error);
    throw error instanceof Error ? error : new Error('Unknown Gemini error');
  }
}