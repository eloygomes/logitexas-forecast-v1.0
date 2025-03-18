/********************************************************************
 *  Arquivo: index.js (API Node com Express, MySQL, JWT e bcrypt)
 ********************************************************************/

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mysql = require("mysql2/promise");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt"); // Usamos bcrypt para hashear as senhas
const fs = require("fs");

const app = express();
const cors = require("cors");

// Defina o SECRET antes de usá-lo
const SECRET = process.env.JWT_SECRET || "MINHA_CHAVE_SUPER_SECRETA";

// Se estiver atrás de um único proxy (Nginx), habilite trust proxy
app.set("trust proxy", 1);

// Configuração do CORS (permite qualquer origem)
app.use(cors());

// Outras configurações de segurança (via Helmet)
app.use(helmet());

// Parser para JSON no body da requisição
app.use(express.json());

// Rate Limiting para evitar abusos (ex. DOS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: "Muitas requisições, tente novamente mais tarde.",
});
app.use(limiter);

// Conexão MySQL via pool
const pool = mysql.createPool({
  host: "mysql", // Em docker-compose, serviço "mysql"
  user: "usuario",
  password: "senhausuario",
  database: "meubanco",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

/************************************************************************
 *  (1) Criação das tabelas 'users' e 'plan_uploads' caso não existam
 ************************************************************************/
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tabela 'users' criada ou já existente.");
  } catch (err) {
    console.error("Erro ao criar/verificar tabela 'users':", err);
  }
})();

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS plan_uploads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        plan_name VARCHAR(500) NOT NULL UNIQUE,
        user VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Tabela 'plan_uploads' criada ou já existente.");
  } catch (err) {
    console.error("Erro ao criar/verificar tabela 'plan_uploads':", err);
  }
})();

/************************************************************************
 *  (2) Configuração do Multer para upload
 ************************************************************************/
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
    return cb(null, true);
  } else {
    cb(new Error("Arquivo inválido! Somente CSV, XLS ou XLSX são permitidos."));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 30 * 1024 * 1024 }, // 30MB
});

/************************************************************************
 *  (3) Rota de verificação de status (health check)
 ************************************************************************/
app.get("/api/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res
      .status(200)
      .json({ status: "API funcionando e conexão com o banco OK" });
  } catch (error) {
    console.error("Erro de conexão com o banco:", error);
    res.status(500).json({ status: "Erro na conexão com o banco" });
  }
});

/************************************************************************
 *  (4) Middleware para autenticação JWT
 ************************************************************************/
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer <token>"
  if (!token)
    return res
      .status(401)
      .json({ error: "Acesso negado. Token não fornecido." });

  jwt.verify(token, SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido." });
    req.user = user; // Aqui você terá os dados do usuário (por exemplo, userId, email, etc.)
    next();
  });
};

/************************************************************************
 *  (5) Rota para upload de arquivo (envia para Python processar)
 ************************************************************************/
app.post(
  "/api/upload",
  authenticateToken,
  upload.single("planilha"),
  async (req, res) => {
    try {
      console.log("Requisição recebida:", req.file);

      if (!req.file) {
        console.log("Nenhum arquivo enviado.");
        return res.status(400).json({ error: "Nenhum arquivo enviado." });
      }

      const fileName = req.file.filename;
      console.log("Arquivo recebido:", fileName);

      // Chama o Python para processar o arquivo
      const pythonResponse = await axios.post("http://python:5000/process", {
        filePath: `uploads/${fileName}`,
      });

      console.log("Resposta do Python:", pythonResponse.data);

      if (pythonResponse.status === 200) {
        // Use os dados do usuário autenticado em req.user para inserir o registro
        const userEmail = req.user.email || "Unknown";

        const [result] = await pool.query(
          "INSERT INTO plan_uploads (plan_name, user) VALUES (?, ?)",
          [fileName, userEmail]
        );
        const insertedId = result.insertId;

        // Recupera o registro inserido para retornar os dados completos
        const [rows] = await pool.query(
          "SELECT * FROM plan_uploads WHERE id = ?",
          [insertedId]
        );
        if (rows.length > 0) {
          return res.status(200).json(rows[0]);
        } else {
          return res
            .status(500)
            .json({ error: "Erro ao recuperar o arquivo inserido." });
        }
      } else {
        res
          .status(500)
          .json({ error: "Erro ao processar os dados com Python." });
      }
    } catch (error) {
      console.error("Erro ao processar o arquivo:", error);
      res.status(500).json({ error: "Erro interno ao processar o arquivo." });
    }
  }
);

/************************************************************************
 *  (6) Rota para buscar todos os arquivos (GET /api/files)
 ************************************************************************/
app.get("/api/files", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM plan_uploads ORDER BY created_at DESC"
    );
    res.status(200).json(rows);
  } catch (error) {
    console.error("Erro ao buscar arquivos:", error);
    res.status(500).json({ error: "Erro ao buscar arquivos." });
  }
});

/************************************************************************
 *  (7) Rota para Download da planilha
 ************************************************************************/
app.get("/api/download/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM plan_uploads WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }
    const fileRecord = rows[0];
    const filePath = path.join(__dirname, "uploads", fileRecord.plan_name);
    return res.download(filePath);
  } catch (error) {
    console.error("Erro ao baixar arquivo:", error);
    return res.status(500).json({ error: "Erro ao baixar arquivo." });
  }
});

/************************************************************************
 *  (8) Rota para EXCLUSÃO da planilha
 ************************************************************************/
app.delete("/api/files/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // Busca o registro do arquivo
    const [rows] = await pool.query("SELECT * FROM plan_uploads WHERE id = ?", [
      id,
    ]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Arquivo não encontrado." });
    }
    const fileRecord = rows[0];
    const filePath = path.join(__dirname, "uploads", fileRecord.plan_name);

    // Remove o arquivo físico
    fs.unlink(filePath, async (err) => {
      if (err) {
        console.error("Erro ao excluir o arquivo:", err);
        return res.status(500).json({ error: "Erro ao excluir o arquivo." });
      }
      // Exclui o registro da tabela de planilhas
      await pool.query("DELETE FROM plan_uploads WHERE id = ?", [id]);

      // Se o Python inseriu dados em outra tabela, adicione a exclusão aqui:
      // await pool.query("DELETE FROM outra_tabela WHERE plan_upload_id = ?", [id]);

      return res.status(200).json({ message: "Arquivo excluído com sucesso." });
    });
  } catch (error) {
    console.error("Erro ao excluir arquivo:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao excluir o arquivo." });
  }
});

/************************************************************************
 *  (9) Rotas de autenticação com JWT e bcrypt
 ************************************************************************/

/**
 * 9.1 /api/register
 * Recebe: { email, password }
 * Retorna: { message } ou erro
 */
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Verifica se já existe um usuário com esse email
    const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
      email,
    ]);
    if (rows.length > 0) {
      return res.status(400).json({ error: "Usuário já existe." });
    }

    // Gera hash da senha com bcrypt
    const saltRounds = 10; // fator de custo
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insere no banco (armazenando o hash em vez da senha pura)
    await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    return res
      .status(500)
      .json({ error: "Erro interno ao registrar usuário." });
  }
});

/**
 * 9.2 /api/login
 * Recebe: { email, password }
 * Retorna: { token } se der certo ou status de erro se falhar
 */
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios." });
    }

    // Busca o usuário no banco
    const [rows] = await pool.query(
      "SELECT id, password FROM users WHERE email = ?",
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const user = rows[0];

    // Compara a senha informada com o hash salvo no DB
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    // Gerar Token JWT
    const token = jwt.sign({ userId: user.id, email: email }, SECRET, {
      expiresIn: "1h",
    });

    // Retorna o token
    return res.json({ token });
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    return res.status(500).json({ error: "Erro interno ao fazer login." });
  }
});

/************************************************************************
 *  (10) Pega a informação que no banco para o filtro
 ************************************************************************/

app.get("/api/forecast-data", authenticateToken, async (req, res) => {
  try {
    // 1) Ler colunas do INFORMATION_SCHEMA:
    const [colRows] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'meubanco'
        AND TABLE_NAME = 'base_preenchimento_forecast_sell_out_1741960279706'
      ORDER BY ORDINAL_POSITION
    `);

    // Exemplo: colRows = [ { COLUMN_NAME: 'id' }, { COLUMN_NAME: 'cliente' }, ... ]

    // 2) Transformar colunas no formato que o front-end precisa:
    const columns = colRows.map((col) => ({
      key: col.COLUMN_NAME, // Ex.: "id"
      name: col.COLUMN_NAME, // Ex.: "id"
      // adicional: se quiser forçar algo como editable, width etc.
    }));

    // 3) Ler as linhas (dados) da tabela:
    // const [rows] = await pool.query(`
    //   SELECT * FROM base_preenchimento_forecast_sell_out_1741960279706
    //   ORDER BY id
    // `);

    const [rows] = await pool.query(`
      SELECT * FROM base_preenchimento_forecast_sell_out_1741960279706  WHERE Part_Number = '910-005235' ORDER BY id;  
    `);

    // 4) Retornar {columns, rows}
    res.json({ columns, rows });
  } catch (error) {
    console.error("Erro ao buscar forecast-data:", error);
    res.status(500).json({ error: "Erro interno ao buscar dados" });
  }
});

/************************************************************************
 *  (10.1) Pega todos os clientes para o filtro
 ************************************************************************/

app.get("/api/forecast-data/clients", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT Cliente FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);

    // 4) Retornar {columns, rows}
    res.json({ rows });
  } catch (error) {
    console.error("Erro ao buscar forecast-data:", error);
    res.status(500).json({ error: "Erro interno ao buscar dados" });
  }
});

/************************************************************************
 *  (10.2) Pega todos os managers para o filtro
 ************************************************************************/

app.get("/api/forecast-data/manager", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT MANAGER FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
    res.json({ rows });
  } catch (error) {
    console.error("Erro ao buscar MANAGER:", error);
    res.status(500).json({ error: "Erro interno ao buscar MANAGER" });
  }
});

/************************************************************************
 *  (10.3) Pega todos os NAMS para o filtro
 ************************************************************************/

app.get("/api/forecast-data/nam", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT NAM FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
    res.json({ rows });
  } catch (error) {
    console.error("Erro ao buscar NAM:", error);
    res.status(500).json({ error: "Erro interno ao buscar NAM" });
  }
});

/************************************************************************
 *  (10.4) Pega todos os mktname para o filtro
 ************************************************************************/

app.get("/api/forecast-data/mktname", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT MKT_Name FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
    res.json({ rows });
  } catch (error) {
    console.error("Erro ao buscar MKT_Name:", error);
    res.status(500).json({ error: "Erro interno ao buscar MKT_Name" });
  }
});

/************************************************************************
 *  (10.6) Pega todos os runrate_npi para o filtro
 ************************************************************************/

app.get(
  "/api/forecast-data/runrate_npi",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT DISTINCT Runrate_NPI FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
      res.json({ rows });
    } catch (error) {
      console.error("Erro ao buscar Runrate_NPI:", error);
      res.status(500).json({ error: "Erro interno ao buscar Runrate_NPI" });
    }
  }
);

/************************************************************************
 *  (10.7) Pega todos os product_group para o filtro
 ************************************************************************/

app.get(
  "/api/forecast-data/product_group",
  authenticateToken,
  async (req, res) => {
    try {
      const [rows] = await pool.query(`
      SELECT DISTINCT Product_Group FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
      res.json({ rows });
    } catch (error) {
      console.error("Erro ao buscar Product_Group:", error);
      res.status(500).json({ error: "Erro interno ao buscar Product_Group" });
    }
  }
);

/************************************************************************
 *  (10.8) Pega todos os chave para o filtro
 ************************************************************************/

app.get("/api/forecast-data/chave", authenticateToken, async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT DISTINCT CHAVE FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);
    res.json({ rows });
  } catch (error) {
    console.error("Erro ao buscar CHAVE:", error);
    res.status(500).json({ error: "Erro interno ao buscar CHAVE" });
  }
});

/************************************************************************
 *  (11.0) CARREGAR TABELA FORCAST
 ************************************************************************/

/************************************************************************
 *  (10.2) Pega todas os part numbers
 ************************************************************************/
app.get(
  "/api/forecast-data/partnumbers",
  authenticateToken,
  async (req, res) => {
    try {
      const [part_numbers_list] = await pool.query(`
      SELECT DISTINCT Part_Number FROM base_preenchimento_forecast_sell_out_1741960279706;
    `);

      // 4) Retornar { part_numbers_list}
      res.json({ part_numbers_list });
    } catch (error) {
      console.error("Erro ao buscar forecast-data:", error);
      res.status(500).json({ error: "Erro interno ao buscar dados" });
    }
  }
);

/************************************************************************
 *  (10.3) Pega todas os dados dos clientes
 ************************************************************************/
app.get(
  "/api/forecast-data/clients/:clientName",
  authenticateToken,
  async (req, res) => {
    try {
      // Extrai o nome do cliente da URL
      const clientName = req.params.clientName;

      // 1) Ler colunas do INFORMATION_SCHEMA:
      const [colRows] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'meubanco'
        AND TABLE_NAME = 'base_preenchimento_forecast_sell_out_1741960279706'
      ORDER BY ORDINAL_POSITION
    `);

      // 2) Transformar colunas para o formato que o front-end precisa:
      const columns = colRows.map((col) => ({
        key: col.COLUMN_NAME,
        name: col.COLUMN_NAME,
      }));

      // 3) Buscar as linhas filtrando pelo cliente usando binding para evitar injeção de SQL
      const [rows] = await pool.query(
        `SELECT * FROM base_preenchimento_forecast_sell_out_1741960279706 WHERE Cliente = ?`,
        [clientName]
      );

      // 4) Retornar {columns, rows}
      res.json({ columns, rows });
    } catch (error) {
      console.error("Erro ao buscar forecast-data:", error);
      res.status(500).json({ error: "Erro interno ao buscar dados" });
    }
  }
);

/************************************************************************
 *  (10.4) Pega todas os item de um partnumber
 ************************************************************************/
app.get(
  "/api/forecast-data/partnumbers/:pn",
  authenticateToken,
  async (req, res) => {
    try {
      // Extrai o nome do cliente da URL
      const partNumber = req.params.pn;

      // 1) Ler colunas do INFORMATION_SCHEMA:
      const [colRows] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'meubanco'
        AND TABLE_NAME = 'base_preenchimento_forecast_sell_out_1741960279706'
      ORDER BY ORDINAL_POSITION
    `);

      // 2) Transformar colunas para o formato que o front-end precisa:
      const columns = colRows.map((col) => ({
        key: col.COLUMN_NAME,
        name: col.COLUMN_NAME,
      }));

      // 3) Buscar as linhas filtrando pelo cliente usando binding para evitar injeção de SQL
      const [rows] = await pool.query(
        `SELECT * FROM base_preenchimento_forecast_sell_out_1741960279706 WHERE Part_Number = ?`,
        [partNumber]
      );

      // 4) Retornar {columns, rows}
      res.json({ columns, rows });
    } catch (error) {
      console.error("Erro ao buscar forecast-data:", error);
      res.status(500).json({ error: "Erro interno ao buscar dados" });
    }
  }
);

/************************************************************************
 *  (10.5) Multiplos filtros para selecionar dados do forecast
 ************************************************************************/

app.get("/api/forecast-data/filter", authenticateToken, async (req, res) => {
  try {
    // Extrai os filtros da query string
    // Exemplo de URL:
    // /api/forecast-data/filter?client=FUJIOKA&partNumber=910-005235&nam=...&manager=...&mktName=...&runrate_npi=...&product_group=...&chave=...
    const {
      client,
      partNumber,
      nam,
      manager,
      mktName,
      runrate_npi,
      product_group,
      chave,
    } = req.query;

    // Inicia a query com uma condição sempre verdadeira para facilitar a concatenação
    let query = `
      SELECT * FROM base_preenchimento_forecast_sell_out_1741960279706
      WHERE 1 = 1
    `;
    const params = [];

    if (client) {
      query += " AND Cliente = ?";
      params.push(client);
    }

    if (nam) {
      query += " AND NAM = ?";
      params.push(nam);
    }

    if (manager) {
      query += " AND MANAGER = ?";
      params.push(manager);
    }

    if (partNumber) {
      query += " AND Part_Number = ?";
      params.push(partNumber);
    }

    if (mktName) {
      query += " AND MKT_Name = ?";
      params.push(mktName);
    }

    if (runrate_npi) {
      query += " AND Runrate_NPI = ?";
      params.push(runrate_npi);
    }

    if (product_group) {
      query += " AND Product_Group = ?";
      params.push(product_group);
    }

    if (chave) {
      query += " AND CHAVE = ?";
      params.push(chave);
    }

    query += " ORDER BY id";

    // Executa a query com os parâmetros vinculados
    const [rows] = await pool.query(query, params);

    // Busca as colunas para o front-end (opcional)
    const [colRows] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'meubanco'
        AND TABLE_NAME = 'base_preenchimento_forecast_sell_out_1741960279706'
      ORDER BY ORDINAL_POSITION
    `);

    const columns = colRows.map((col) => ({
      key: col.COLUMN_NAME,
      name: col.COLUMN_NAME,
    }));

    res.json({ columns, rows });
  } catch (error) {
    console.error("Erro ao buscar dados filtrados:", error);
    res.status(500).json({ error: "Erro interno ao buscar dados filtrados" });
  }
});

/************************************************************************
 *  (1_) Edita as informações na planilha
 ************************************************************************/

// Este PUT recebe um "id" (ou outro identificador da linha) e os campos editados
app.put("/api/forecast-data/:id", authenticateToken, async (req, res) => {
  try {
    // "id" da linha, vindo na URL
    const { id } = req.params;

    // Os novos valores para as colunas podem vir no body
    // Ex.: { cliente_t2: "novo valor", estoque_t2: 999, ... }
    const updatedFields = req.body;

    // Monta um array de chaves=valores, ex.: ["cliente_t2 = ?", "estoque_t2 = ?"...]
    const sets = Object.keys(updatedFields).map((col) => `${col} = ?`);
    // Ex.: ["cliente_t2 = ?", "estoque_t2 = ?", ...]

    // Array com só os valores, para bind no MySQL
    const values = Object.values(updatedFields);
    // Ex.: ["novo valor", 999, ...]

    // Se não tiver nada para atualizar, retorna
    if (!sets.length) {
      return res.status(400).json({ error: "Nada para atualizar." });
    }

    // Monta a query de UPDATE
    const sql = `
      UPDATE base_preenchimento_forecast_sell_out_1741960279706
      SET ${sets.join(", ")}
      WHERE id = ?
    `;

    // Executa a query, passando os valores + o id no final
    await pool.query(sql, [...values, id]);

    return res.json({ message: "Atualizado com sucesso" });
  } catch (error) {
    console.error("Erro ao atualizar dado:", error);
    return res.status(500).json({ error: "Erro interno ao atualizar dado" });
  }
});

/************************************************************************
 *  (_) Inicia o servidor
 ************************************************************************/
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor API rodando na porta ${PORT}`);
});
