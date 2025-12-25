import { GoogleGenAI, Chat, Type } from "@google/genai";
import { Deal, SearchFilters } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface IntermediateDeal {
  title: string;
  price: number;
  url: string;
}

// Helper: Search a specific retailer site with scraper-like strictness
const searchRetailer = async (site: string, retailerName: string, filters: SearchFilters): Promise<Deal[]> => {
  // ISO date for precision
  const today = new Date().toISOString().split('T')[0];
  
  // High specificity query
  const query = `site:${site} buy "${filters.size}" "${filters.ddr}" ${filters.speed} RAM memory`;

  const prompt = `
  ACT AS A PRECISE WEB SCRAPING API.
  
  CONTEXT:
  - Target Domain: ${site}
  - Target Product: ${filters.size} ${filters.ddr} ${filters.speed} Desktop RAM
  - Current Date: ${today}
  
  INSTRUCTIONS:
  1. Perform a deep Google Search for the query: [${query}]
  2. Parse the search results to find specific product pages.
  3. Extract EXACT data found in the search snippets.
  
  STRICT DATA INTEGRITY RULES:
  - **URLS**: usage of "..." or truncated URLs is FORBIDDEN. You must output the full, valid URL found in the source.
  - **PRICES**: Extract the current selling price. Ignore "was", "save", or "monthly".
  - **freshness**: Discard results that are clearly old news, forums, or reviews. Only list purchase pages.
  - **HALLUCINATION**: If a field (like price) is not explicitly visible in the search result, DO NOT INVENT IT. Skip the item.
  
  OUTPUT FORMAT:
  Return a raw JSON array of objects. No markdown formatting.
  
  Example structure:
  [
    {
      "title": "Corsair Vengeance 32GB DDR5 6000MHz",
      "price": 99.99,
      "url": "https://www.amazon.com/..."
    }
  ]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        temperature: 0, // Deterministic output for scraper behavior
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              price: { type: Type.NUMBER },
              url: { type: Type.STRING },
            },
            required: ["title", "price", "url"],
          },
        },
      },
    });

    // Check grounding metadata to debug/verify (logic implicit in model behavior due to prompt)
    // const grounding = response.candidates?.[0]?.groundingMetadata;

    const data = response.text ? JSON.parse(response.text) as IntermediateDeal[] : [];
    
    // Rigorous filtering
    return data
      .filter(d => {
        const hasValidPrice = d.price > 10; // RAM is rarely under $10
        const hasValidUrl = d.url && d.url.startsWith('http') && !d.url.includes('google.com/url');
        const isTargetSite = d.url.includes(site.replace('www.', ''));
        return hasValidPrice && hasValidUrl && isTargetSite;
      })
      .map(d => ({ ...d, retailer: retailerName }));
      
  } catch (error) {
    console.error(`Scraping Error for ${retailerName}:`, error);
    return [];
  }
};

// Scans retailers for RAM deals based on filter selection
export const scanRamDeals = async (filters: SearchFilters): Promise<Deal[]> => {
  try {
    const tasks: Promise<Deal[]>[] = [];

    // Parallel execution acting like a multi-threaded scraper
    if (filters.retailer === 'all' || filters.retailer === 'amazon') {
      tasks.push(searchRetailer('amazon.com', 'Amazon', filters));
    }

    if (filters.retailer === 'all' || filters.retailer === 'newegg') {
      tasks.push(searchRetailer('newegg.com', 'Newegg', filters));
    }

    const results = await Promise.all(tasks);
    
    // Flatten and Sort
    return results.flat().sort((a, b) => a.price - b.price);

  } catch (error) {
    console.error("Global Search Error:", error);
    throw new Error("Unable to fetch real-time data.");
  }
};

// Chat with Gemini Flash
export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: "You are a helpful PC hardware assistant. You help users choose RAM and other components. You are knowledgeable about compatibility (DDR4 vs DDR5), speeds (MHz), and latency (CL). Keep answers concise and helpful.",
    }
  });
};

export const sendMessageStream = async (chat: Chat, message: string) => {
  return chat.sendMessageStream({ message });
};

// Low latency tip using Flash Lite
export const getMarketTip = async (): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: "Provide a single, short sentence (max 15 words) advice about buying computer RAM right now (e.g. price trends or new tech).",
    });
    return response.text || "Check prices frequently for the best deals.";
  } catch (error) {
    console.error("Tip Error:", error);
    return "Stay updated on the latest hardware trends.";
  }
};