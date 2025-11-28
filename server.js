const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔑 Carregar chave da HuggingFace via variável de ambiente
const HF_API_KEY = process.env.HF_API_KEY;

// 🚀 Endpoint correto da HuggingFace
const HF_MODEL_URL =
  "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base";

// ========================================================
//  🚀 Rota de emoção com LOG
// ========================================================
app.post("/emotion", async (req, res) => {
  try {
    const userText = req.body.text;

    console.log("\n========================");
    console.log("📩 Texto recebido:", userText);
    console.log("========================");

    const callModel = async () => {
      const response = await fetch(HF_MODEL_URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: userText }),
      });

      const result = await response.json();

      console.log("🔍 HF RESPONSE:", JSON.stringify(result, null, 2));
      return result;
    };

    let result = await callModel();

    // Caso o modelo ainda esteja carregando
    if (result.error && result.error.includes("loading")) {
      console.log("⏳ Modelo carregando... aguardando 3s...");
      await new Promise((r) => setTimeout(r, 3000));
      console.log("🔄 Tentando novamente...");
      result = await callModel();
    }

    res.json(result);

  } catch (err) {
    console.error("❌ Erro no servidor:", err);
    res.status(500).json({ error: "Erro ao obter emoção" });
  }
});

// ========================================================
//  🚀 Porta dinâmica para o Render
// ========================================================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});