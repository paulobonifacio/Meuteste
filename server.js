const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Token vindo das variáveis de ambiente
const HF_API_KEY = process.env.HF_API_KEY;

// Endpoint correto da HF com router
const HF_MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base";

// ===============================
//       ROTA DE EMOÇÃO
// ===============================
app.post("/emotion", async (req, res) => {
  try {
    const userText = req.body.text;

    console.log("\n========================");
    console.log("📩 Texto recebido:", userText);
    console.log("========================");

    const response = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: userText }),
    });

    const data = await response.json();
    console.log("🔍 HF RESPONSE:", JSON.stringify(data, null, 2));

    return res.json(data);

  } catch (err) {
    console.error("❌ Erro no servidor:", err);
    return res.status(500).json({ error: "Erro no servidor" });
  }
});

// ===============================
//       PORTA CORRETA NO RENDER
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
