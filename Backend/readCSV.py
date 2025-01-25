
import pandas as pd
from prettytable import PrettyTable

def ler_planilha_csv(caminho_csv):
    try:
        df = pd.read_csv(caminho_csv, on_bad_lines='skip')
        return df
    except FileNotFoundError:
        print("Erro: Arquivo CSV não encontrado no caminho especificado.")
    except pd.errors.EmptyDataError:
        print("Erro: O arquivo CSV está vazio.")
    except pd.errors.ParserError:
        print("Erro: Problema ao analisar o arquivo CSV. Verifique o formato.")
    except Exception as e:
        print(f"Erro inesperado: {e}")

if __name__ == "__main__":

    planilha = ler_planilha_csv('./data/ACC_MAN.csv')

    if planilha is not None:

        tabela = PrettyTable()


        tabela.field_names = planilha.columns.tolist()


        for _, row in planilha.iterrows():
            tabela.add_row(row.tolist())


        print(tabela)