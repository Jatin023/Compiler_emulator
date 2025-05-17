 
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());


const OPENROUTER_API_KEY = "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"; // <-- Your OpenRouter key here

 
app.get('/favicon.ico', (req, res) => res.status(204).end());

 
app.post("/suggest", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Compiler AI Assistant"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful C language compiler assistant. Always give direct and clear suggestions."
          },
          {
            role: "user",
            content: message
          }
        ]
      })
    });

    const data = await response.json();
    console.log(" OpenRouter raw response:", JSON.stringify(data, null, 2));

    if (data.choices && data.choices.length > 0 && data.choices[0].message?.content) {
      res.json({ suggestion: data.choices[0].message.content.trim() });
    } else {
      res.status(500).json({ error: "No valid AI response.", raw: data });
    }
  } catch (err) {
    console.error("OpenRouter API error:", err);
    res.status(500).json({ error: err.message, stack: err.stack });
  }
});
app.listen(3000, () => console.log("AI Suggestion Server (OpenRouter) running on http://localhost:3000"));