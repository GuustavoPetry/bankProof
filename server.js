const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get('/json', (req, res) => {
  const filePath = path.join(__dirname, 'localizacoes.json');
  
  if (fs.existsSync(filePath)) {
    // Lê o arquivo JSON e envia como resposta
    const dados = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.status(200).json(dados);
  } else {
    res.status(404).json({ message: 'Arquivo localizacao.json não encontrado.' });
  }
});

app.post("/localizacao", async (req, res) => {
  const { latitude, longitude } = req.body;

  // 1️⃣ Salvar no arquivo JSON
  const novaLocalizacao = {
    latitude,
    longitude,
    timestamp: new Date().toISOString()
  };

  let registros = [];
  if (fs.existsSync("localizacoes.json")) {
    registros = JSON.parse(fs.readFileSync("localizacoes.json", "utf-8"));
  }

  registros.push(novaLocalizacao);

  fs.writeFileSync("localizacoes.json", JSON.stringify(registros, null, 2));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
