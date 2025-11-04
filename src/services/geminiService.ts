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
const genAI = new GoogleGenerativeAI(apiKey);

export async function getChatResponse(message: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'll represent Muhib Waqar with his authentic voice and personality." }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}