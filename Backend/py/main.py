import os
import re
import json
import pandas as pd
from flask import Flask, request, jsonify
import mysql.connector

app = Flask(__name__)

def get_db_connection():
    # Ajuste conforme o seu ambiente (host, user, etc.)
    return mysql.connector.connect(
        host="mysql",      # se estiver usando docker-compose e o serviço se chamar 'mysql'
        user="usuario",
        password="senhausuario",
        database="meubanco"
    )

@app.route("/process", methods=["POST"])
def process():
    try:
        # 1. Recebe o caminho do arquivo enviado pelo Node
        file_path = request.json["filePath"]
        # Exemplo: "uploads/1738703124275.csv"

        # 2. Lê o arquivo CSV ou Excel (dentro do container Python)
        if file_path.lower().endswith(".csv"):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)

        # 3. Conecta ao MySQL
        conn = get_db_connection()
        cursor = conn.cursor()

        # 4. Garante que a tabela base exista
        table_name = "my_dynamic_table"
        create_base_table = f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            id INT AUTO_INCREMENT PRIMARY KEY
        )
        """
        cursor.execute(create_base_table)
        conn.commit()

        # 5. Obter colunas existentes na tabela
        cursor.execute(f"SHOW COLUMNS FROM {table_name}")
        existing_cols = set(row[0] for row in cursor.fetchall())

        # 6. Para cada coluna do DataFrame, cria se não existir
        for col in df.columns:
            # Substitui espaços e caracteres especiais para adequar ao MySQL
            col_safe = re.sub(r"\W+", "_", col.strip())
            # Se a coluna ainda não existe, cria
            if col_safe not in existing_cols:
                alter_sql = f"ALTER TABLE {table_name} ADD COLUMN `{col_safe}` TEXT"
                cursor.execute(alter_sql)
                existing_cols.add(col_safe)

        conn.commit()

        # 7. Monta a SQL de INSERT dinâmico
        #    (usa o nome das colunas do dataframe, já "sanitizado")
        df_cols_safe = [re.sub(r"\W+", "_", c.strip()) for c in df.columns]
        col_names_sql = ", ".join(f"`{c}`" for c in df_cols_safe)
        placeholders = ", ".join(["%s"] * len(df_cols_safe))
        insert_sql = f"INSERT INTO {table_name} ({col_names_sql}) VALUES ({placeholders})"

        # 8. Inserir cada linha do DF (transformando NaN em None)
        for _, row in df.iterrows():
            row_values = [str(x) if pd.notnull(x) else None for x in row]
            cursor.execute(insert_sql, row_values)

        conn.commit()

        # Fecha a conexão
        cursor.close()
        conn.close()

        # Retorna sucesso
        return jsonify({"message": "Dados inseridos com sucesso na tabela!"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Exemplo local; se estiver rodando em Docker, ajusta host e porta no Dockerfile ou docker-compose
    app.run(debug=True, host="0.0.0.0", port=5000)