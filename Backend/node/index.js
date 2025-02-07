const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2/promise");
const axios = require("axios");
const multer = require("multer");
const path = require("path");

const app = express();

const cors = require("cors");

// <-- Adicione essa linha para confiar nos proxies -->
// Se você está atrás de um único proxy (Nginx, por exemplo), use:
app.set("trust proxy", 1);

// Configuração do CORS (permite qualquer origem)
app.use(cors());

// Outras configurações de segurança
app.use(helmet());

// Parser para JSON
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
  host: "mysql", // Nome do serviço no Docker Compose para o container MySQL
  user: "usuario",
  password: "senhausuario",
  database: "meubanco",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 5. Configuração do Multer para o upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Separa o nome e a extensão
    const name = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    // Concatena o nome original com um timestamp para garantir unicidade
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /csv|xls|xlsx/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // Aceita o arquivo
  } else {
    cb(
      new Error(
        "Arquivo inválido! Somente arquivos CSV, XLS ou XLSX são permitidos."
      )
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // Limite de tamanho de arquivo para 30MB
});

// 6. Rota para verificação de status (health check)
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

app.post("/api/upload", upload.single("planilha"), async (req, res) => {
  try {
    console.log("Requisição recebida:", req.file); // Log do arquivo recebido

    if (!req.file) {
      console.log("Nenhum arquivo enviado.");
      return res.status(400).json({ error: "Nenhum arquivo enviado." });
    }

    const fileName = req.file.filename;
    console.log("Arquivo recebido:", fileName);

    const pythonResponse = await axios.post("http://python:5000/process", {
      filePath: `uploads/${fileName}`,
    });

    console.log("Resposta do Python:", pythonResponse.data); // Log da resposta do Python

    if (pythonResponse.status === 200) {
      res
        .status(200)
        .json({
          message: "Arquivo processado e dados inseridos com sucesso no banco!",
        });
    } else {
      res.status(500).json({ error: "Erro ao processar os dados com Python." });
    }
  } catch (error) {
    console.error("Erro ao processar o arquivo:", error);
    res.status(500).json({ error: "Erro interno ao processar o arquivo." });
  }
});

// 8. Inicia o servidor na porta definida (3000 ou variável de ambiente PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});
