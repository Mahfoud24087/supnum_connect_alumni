// backend/scripts/test_ai.js
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
    console.log("Testing Gemini API Key...");
    console.log("API Key:", process.env.GEMINI_API_KEY ? "EXISTS (Length: " + process.env.GEMINI_API_KEY.length + ")" : "MISSING");
    
    if (!process.env.GEMINI_API_KEY) return;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    try {
        console.log("\nAttempting to list models using v1beta...");
        // Use fetch to list models directly if SDK fails
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => console.log(` - ${m.name}`));
        } else {
            console.error("No models returned. Error:", data);
        }

        console.log("\nAttempting a simple text generation with gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello! What is your name?");
        const text = await result.response.text();
        console.log("Response:", text);

    } catch (error) {
        console.error("Test failed:", error);
    }
}

test();
