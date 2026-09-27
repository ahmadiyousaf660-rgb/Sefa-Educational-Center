require("dotenv").config();
const express = require("express");
const path = require("path");
const OpenAI = require("openai");

const app = express();
app.use(express.json({limit:"1mb"}));
app.use(express.static(__dirname));

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

app.post("/api/chat", async (req,res)=>{
  try{
    const message = String(req.body?.message || "").trim();
    if(!message) return res.status(400).json({error:"Message is required."});
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: "You are SEFA Educational Center AI English tutor. Help students learn English. Be friendly, clear, concise, correct mistakes, and give examples. If the student asks in Pashto, you may explain in Pashto while keeping English examples.",
      input: message
    });
    res.json({reply: response.output_text || "I could not generate a response."});
  }catch(err){
    console.error(err);
    res.status(500).json({error:"AI server error. Check your API key and server logs."});
  }
});

const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`SEFA Educational Center running at http://localhost:${PORT}`));
