import { GoogleGenAI } from '@google/genai';
import * as fs from 'fs';
import * as path from 'path';

// Load the unit definitions
import { categories } from '../src/lib/units';

// Define the structure based on the prompt
interface SeoSnippet {
  quick_explanation: string;
  real_world_example: string;
  faq_schema_qa: { question: string; answer: string }[];
}

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY_HERE' 
});

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.warn("⚠️ Warning: GEMINI_API_KEY is not set. Please set it to proceed.");
  }

  // We'll just define a small subset of conversions to test
  // In reality, you'd loop through your popular 500 conversions.
  const conversionsToGenerate = [
    { sourceId: "gram", targetId: "ounce", context: "cooking and baking" },
    { sourceId: "celsius", targetId: "fahrenheit", context: "daily weather and cooking" },
    { sourceId: "centimeter", targetId: "inch", context: "measuring dimensions" }
  ];

  const results: Record<string, SeoSnippet> = {};
  
  for (const { sourceId, targetId, context } of conversionsToGenerate) {
    const allUnits = categories.flatMap(c => c.units);
    const sourceUnit = allUnits.find((u: any) => u.id === sourceId);
    const targetUnit = allUnits.find((u: any) => u.id === targetId);

    if (!sourceUnit || !targetUnit) {
      console.warn(`Could not find units for ${sourceId} to ${targetId}`);
      continue;
    }

    const prompt = `You are an expert technical SEO writer and mathematician. I am passing you a unit conversion query. You will output a JSON object containing three unique, highly helpful text snippets designed to help this page rank on Google.

Rules:
Never sound like a generic AI. Be concise, direct, and factual.
Use the exact keywords naturally.
Output valid JSON only.

Inputs:
Source Unit: ${sourceUnit.name}
Target Unit: ${targetUnit.name}
Search Intent Context: ${context}

Required JSON Output Structure:
{
"quick_explanation": "A 2-sentence direct explanation of how to convert {source} to {target}, mentioning the exact multiplication/division factor.",
"real_world_example": "A practical 'Did You Know?' example of this specific conversion in daily life (e.g., 'For context, a standard cup of flour is roughly 120 grams...').",
"faq_schema_qa": [
{ "question": "Is [X] {source} larger than [Y] {target}?", "answer": "..." }
]
}`;

    console.log(`Generating SEO snippets for ${sourceUnit.name} to ${targetUnit.name}...`);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview', // Or another available model
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3,
        }
      });
      
      const snippet = JSON.parse(response.text || "{}");
      const key = `${sourceId}-to-${targetId}`;
      results[key] = snippet;
      
    } catch (e) {
      console.error(`Failed to generate content for ${sourceId} to ${targetId}`, e);
    }
  }

  const outputPath = path.join(process.cwd(), 'src', 'lib', 'seoSnippets.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2), 'utf8');
  console.log(`\n🎉 Successfully generated snippets and saved to ${outputPath}`);
}

main();
