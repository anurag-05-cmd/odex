import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { LRUCache } from 'lru-cache'; // Fixed: Named import for v7+
import { RegExpMatcher, englishDataset, englishRecommendedTransformers } from 'obscenity';

// Tier 0: In-memory cache to save API credits
const cache = new LRUCache<string, boolean>({ max: 500, ttl: 1000 * 60 * 60 });

// Tier 1: Local Matcher (Instant & Truly Unlimited)
const matcher = new RegExpMatcher({
  ...englishDataset.build(),
  ...englishRecommendedTransformers,
});

/**
 * TIER 2: Perspective API (Free, High Quota, Multilingual)
 * Gold standard for toxicity/insults across 100+ languages.
 */
async function callPerspective(text: string): Promise<boolean> {
  const API_KEY = process.env.GOOGLE_API_KEY; // Same key as Gemini often works
  const url = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${API_KEY}`;
  
  try {
    const res = await fetch(url, {
      method: "POST",
      body: JSON.stringify({
        comment: { text },
        languages: ["en"], // Perspective handles auto-detection well
        requestedAttributes: { TOXICITY: {}, INSULT: {}, IDENTITY_ATTACK: {} }
      })
    });
    const data = await res.json();
    // Flag if any score is above 0.7 (70% probability of being toxic/derogatory)
    const scores = data.attributeScores;
    return (
      scores.TOXICITY.summaryScore.value > 0.7 || 
      scores.INSULT.summaryScore.value > 0.7 ||
      scores.IDENTITY_ATTACK.summaryScore.value > 0.7
    );
  } catch (e) {
    console.error("Perspective API failed, moving to Gemini...");
    return false; // Fail open to let next tier decide
  }
}

/**
 * TIER 3: Gemini (Contextual check)
 */
async function callGemini(text: string) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-lite' });
  const prompt = `Moderate this marketplace item for vulgarity or derogatory slang. 
  Respond strictly in JSON: {"safe": boolean, "reason": "string"}. 
  Content: "${text}"`;

  const result = await model.generateContent(prompt);
  const jsonMatch = result.response.text().match(/\{[\s\S]*\}/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : { safe: true };
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    const text = `${title} ${description}`.trim();

    // 1. Cache & Local Filter
    if (cache.get(text) === false) return flaggedResponse('CACHE');
    if (matcher.hasMatch(text)) return flaggedResponse('LOCAL_REGEX');

    // 2. Perspective API Check (The "High Traffic" Shield)
    const isUnsafePerspective = await callPerspective(text);
    if (isUnsafePerspective) {
      cache.set(text, false);
      return flaggedResponse('PERSPECTIVE_FLAGGED');
    }

    // 3. Gemini Check (The Fail-Safe)
    try {
      const gemini = await callGemini(text);
      if (!gemini.safe) return flaggedResponse('AI_FLAGGED', gemini.reason);
    } catch (err) {
      console.warn("Gemini busy (429), trusting previous filters.");
    }

    return NextResponse.json({ flagged: false, message: 'Clean' });

  } catch (error: any) {
    return NextResponse.json({ error: 'System busy' }, { status: 500 });
  }
}

function flaggedResponse(reason: string, details?: string) {
  return NextResponse.json({ flagged: true, reason, message: details || 'Inappropriate content.' });
}