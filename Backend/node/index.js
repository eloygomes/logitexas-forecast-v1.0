// index.js
const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2/promise");
const axios = require("axios");

const app = express();

// 1. Configurações de segurança
app.use(helmet()); // Adiciona cabeçalhos de segurança

// 2. Parser para JSON
app.use(express.json());

// 3. Rate Limiting para evitar abusos
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limita a 100 requisições por IP a cada 15 minutos
  message: "Muitas requisições, tente novamente mais tarde.",
});
app.use(limiter);

// 4. Conexão com o MySQL utilizando um pool de conexões
const pool = mysql.createPool({
  host: "meu-mysql", // Nome do serviço MySQL no Docker
  user: "root",
  password: "senha_root",
  database: "meubanco",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 5. Rota para verificação de status (health check)
app.get("/api/status", async (req, res) => {
  try {
    // Testa a conexão com o banco de dados
    await pool.query("SELECT 1");
    res
      .status(200)
      .json({ status: "API funcionando e conexão com o banco OK" });
  } catch (error) {
    console.error("Erro de conexão com o banco:", error);
    res.status(500).json({ status: "Erro na conexão com o banco" });
  }
});

// 6. Rota para inserir dados brutos no MySQL
app.post("/api/data", async (req, res) => {
  try {
    const { value } = req.body;

    // Validação básica de entrada
    if (!value) {
      return res.status(400).json({ error: 'Campo "value" é obrigatório.' });
    }

    // Insere o dado na tabela "raw_data"
    const [result] = await pool.execute(
      "INSERT INTO raw_data (value) VALUES (?)",
      [value]
    );
    res
      .status(201)
      .json({ message: "Dado inserido com sucesso", id: result.insertId });
  } catch (error) {
    console.error("Erro ao inserir dado:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 7. Rota para processar dados via container Python
app.post("/api/process", async (req, res) => {
  try {
    const { data } = req.body;

    // Validação básica de entrada
    if (!data) {
      return res.status(400).json({ error: 'Campo "data" é obrigatório.' });
    }

    // Encaminha os dados para o container Python
    // Na rede do Docker Compose, o container Python pode ser acessado pelo hostname "python"
    const pythonResponse = await axios.post("http://python:5000/process", {
      data,
    });

    // Supondo que o container Python retorne os dados processados em pythonResponse.data
    const processedData = pythonResponse.data;

    // Opcional: Insere o dado processado na tabela "processed_data"
    const [result] = await pool.execute(
      "INSERT INTO processed_data (processed_value) VALUES (?)",
      [processedData.processed_value]
    );

    res.status(200).json({
      message: "Dados processados e armazenados com sucesso",
      id: result.insertId,
      processedData,
    });
    ``;
  } catch (error) {
    console.error("Erro ao processar dados:", error);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// 8. Inicia o servidor na porta definida (3000 ou variável de ambiente PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});
