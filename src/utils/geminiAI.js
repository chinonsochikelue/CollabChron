import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI Client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * Summarizes text using Gemini AI.
 * @param {string} text - The text to summarize.
 * @param {number} maxLength - The maximum length of the summary.
 * @returns {Promise<string>} - The summarized text.
 */
export async function summarizeText(text, maxLength = 200) {
  if (!text) return "";
  try {
    const prompt = `Summarize the following text in under ${maxLength} characters. Focus on the key points and make it engaging for a social media post: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let summary = response.text();

    // Further trim if necessary, as Gemini might not strictly adhere to character count in prompt
    if (summary.length > maxLength) {
      summary = summary.substring(0, maxLength - 3) + "...";
    }
    return summary;
  } catch (error) {
    console.error("Error summarizing text with Gemini AI:", error);
    // Fallback to simple truncation if API fails
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text;
  }
}

/**
 * Generates relevant hashtags for a given text using Gemini AI.
 * @param {string} text - The text to generate hashtags for.
 * @param {number} maxHashtags - The maximum number of hashtags to generate.
 * @returns {Promise<string[]>} - An array of hashtags (e.g., ["#tech", "#ai"]).
 */
export async function generateHashtags(text, maxHashtags = 5) {
  if (!text) return [];
  try {
    const prompt = `Generate up to ${maxHashtags} relevant hashtags for the following text. The hashtags should be concise and suitable for social media. Return them as a comma-separated list: "${text}"`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawHashtags = response.text();
    
    // Process the raw string into an array of hashtags
    // E.g., "#AI, #ML, #Tech" -> ["#AI", "#ML", "#Tech"]
    return rawHashtags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.startsWith("#") && tag.length > 1) // Ensure they are valid hashtags
      .slice(0, maxHashtags); // Ensure we don't exceed maxHashtags
  } catch (error) {
    console.error("Error generating hashtags with Gemini AI:", error);
    // Fallback to empty array or simple keyword extraction if needed
    return [];
  }
}
