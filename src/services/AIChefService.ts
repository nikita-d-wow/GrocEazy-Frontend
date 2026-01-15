import { GoogleGenerativeAI } from '@google/generative-ai';
import toast from 'react-hot-toast';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Ensure you have this in .env

// Mock fallback to prevent crashes if no key
import { generateChefRecipe as generateMockRecipe } from './AIChefServiceMock';

export interface AISuggestion {
  type: 'RECIPE' | 'ROUTINE' | 'HACK';
  title: string;
  description: string;
  items_needed: string[];
  steps: string[];
  persona_message: string;
  time: string;
  difficulty: string;
  metrics_label?: string; // e.g. "Calories" or "Steps"
  metrics_value?: string; // e.g. "450 kcal" or "5 Steps"
}

export const generateSmartSuggestion = async (
  ingredients: string[]
): Promise<AISuggestion> => {
  if (!API_KEY || API_KEY === 'your_key_here') {
    toast.error('Using Mock AI Service (No API Key found)');
    return generateMockRecipe(ingredients);
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    // Create Gemini Instance (Conceptually in 2026, we use the latest stable flash model)
    // Switch to 1.5-flash for better free tier limits (2.5 is very limited currently)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `
        You are a smart e-commerce assistant. Analyze these items bought by a user: ${JSON.stringify(ingredients)}.
        
        Determine the dominant category:
        1. FOOD: If mostly edible ingredients.
        2. BEAUTY/SELF-CARE: If mostly skincare, soaps, cosmetics.
        3. HOUSEHOLD: If mostly cleaning supplies, tools.
        
        Generate a suggestion based on the category:
        - If FOOD: Generate a delicious RECIPE using the items.
        - If BEAUTY: Generate a "Usage Routine" or "Self-Care Ritual".
        - If HOUSEHOLD: Generate a "Cleaning Hack" or "Pro Tip".
        
        CRITICAL SAFETY RULE: NEVER start a RECIPE if the items are soap, detergent, or inedible chemicals. Default to HACK or ROUTINE in those cases.
        
        Return STRICT JSON format:
        {
            "type": "RECIPE" | "ROUTINE" | "HACK",
            "title": "Creative Title",
            "description": "Short engaging description.",
            "items_needed": ["List of user items used"],
            "steps": ["Step 1...", "Step 2..."],
            "persona_message": "A short, witty message from the assistant.",
            "time": "Duration (e.g. 15 min)",
            "difficulty": "Easy" | "Medium" | "Hard",
            "metrics_label": "Calories" (for food) or "Effect" (for others),
            "metrics_value": "450 kcal" (for food) or "Glowing Skin" (for others)
        }
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean markdown code blocks if present
    const jsonString = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

    return JSON.parse(jsonString);
  } catch (error) {
    toast.error('Gemini AI Quota/Error (Using Fallback):');
    // Fallback to mock logic if AI fails
    return generateMockRecipe(ingredients);
  }
};
