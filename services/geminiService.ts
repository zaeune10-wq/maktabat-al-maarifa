
import { GoogleGenAI, Type } from "@google/genai";

// Use process.env.API_KEY directly as per GenAI guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getLibrarianResponse = async (userMessage: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: `You are a helpful, knowledgeable Arabic Virtual Librarian for "مكتبة المعرفة الإلكترونية".
        You have context about available books: ${context}.
        Respond in polite, professional Arabic. Help users find books, summarize them, or explain literary and historical concepts.
        If a user asks for a book that isn't in the context, suggest similar genres or explain how you can help.`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "عذراً، واجهت مشكلة في الاتصال بذكائي الاصطناعي. كيف يمكنني مساعدتك بشكل آخر؟";
  }
};

export const generateBookSuggestions = async (existingCategories: string[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Suggest 3 real and famous Arabic books that would be great additions to an electronic library. 
      The suggestions should cover these categories if possible: ${existingCategories.join(', ')}.
      Make sure the descriptions and author biographies are engaging and in Arabic.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Title of the book in Arabic" },
              author: { type: Type.STRING, description: "Author of the book in Arabic" },
              category: { type: Type.STRING, description: "One of the provided categories" },
              description: { type: Type.STRING, description: "A brief, enticing description in Arabic" },
              authorBio: { type: Type.STRING, description: "A short biography of the author in Arabic" },
              year: { type: Type.STRING, description: "Year of publication or era" },
              coverUrl: { type: Type.STRING, description: "A placeholder image URL from Unsplash related to books" }
            },
            required: ["title", "author", "category", "description", "year", "authorBio"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    return JSON.parse(text);
  } catch (error) {
    console.error("Suggestion Error:", error);
    return [];
  }
};
