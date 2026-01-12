import os
import json
import subprocess
from pathlib import Path
from typing import Dict, Any


BASE_DIR = Path("./")
INFO_FILE = Path("repos_info.json")


# --------------------------------------------------
# UTILITÁRIOS
# --------------------------------------------------

def run_cmd(cmd: str, cwd: Path | None = None) -> str:
    """Executa um comando de shell e retorna a saída."""
    result = subprocess.run(cmd, cwd=cwd, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return result.stdout.strip()


def read_sonar_properties(path: Path) -> str | None:
    """Lê o arquivo sonar-project.properties se existir."""
    sonar_file = path / "sonar-project.properties"
    if sonar_file.exists():
        return sonar_file.read_text(encoding="utf-8")
    return None


# --------------------------------------------------
# FUNCIONALIDADE 1: ANALISAR REPOSITÓRIOS
# --------------------------------------------------

def analisar_repositorios():
    repos_info: Dict[str, Dict[str, Any]] = {}

    if not BASE_DIR.exists():
        print(f"Pasta {BASE_DIR} não existe.")
        return

    for repo in BASE_DIR.iterdir():
        if not repo.is_dir():
            continue

        git_folder = repo / ".git"
        if not git_folder.exists():
            continue

        print(f"Analisando {repo.name}...")

        # Obter origem
        remote_url = run_cmd("git remote get-url origin", cwd=repo)

        # Obter commit atual
        commit_hash = run_cmd("git rev-parse HEAD", cwd=repo)

        # Ler sonar-project.properties
        sonar_content = read_sonar_properties(repo)

        repos_info[repo.name] = {
            "remote_url": remote_url,
            "commit_hash": commit_hash,
            "sonar_properties": sonar_content
        }

    # Salvar JSON
    INFO_FILE.write_text(json.dumps(repos_info, indent=4, ensure_ascii=False), encoding="utf-8")

    print(f"\nArquivo {INFO_FILE} gerado com sucesso!")


# --------------------------------------------------
# FUNCIONALIDADE 2: RECLONAR E RECONSTRUIR
# --------------------------------------------------

def reconstruir_repositorios():
    if not INFO_FILE.exists():
        print("Arquivo repos_info.json não encontrado. Execute a funcionalidade 1 primeiro.")
        return

    data = json.loads(INFO_FILE.read_text(encoding="utf-8"))

    for repo_name, info in data.items():
        repo_dir = BASE_DIR / repo_name

        print(f"\nReconstruindo {repo_name}...")

        if repo_dir.exists():
            print("   - Pasta já existe, removendo...")
            subprocess.run(f"rm -rf '{repo_dir}'", shell=True)

        # Clonar repositório
        print("   - Clonando repositório...")
        run_cmd(f"git clone {info['remote_url']} {repo_dir}")

        # Fazer checkout do commit
        print("   - Trocando para commit específico...")
        run_cmd(f"git checkout {info['commit_hash']}", cwd=repo_dir)

        # Restaurar sonar-project.properties
        if info["sonar_properties"]:
            sonar_path = repo_dir / "sonar-project.properties"
            print("   - Restaurando sonar-project.properties...")
            sonar_path.write_text(info["sonar_properties"], encoding="utf-8")

    print("\nReconstrução completa!")


# --------------------------------------------------
# MAIN SIMPLES
# --------------------------------------------------

if __name__ == "__main__":
    print("""
Escolha a ação:

1 - Analisar os repositórios existentes e gerar repos_info.json
2 - Recriar repositórios a partir do repos_info.json

""")

    opc = input("Digite a opção (1 ou 2): ").strip()

    if opc == "1":
        analisar_repositorios()
    elif opc == "2":
        reconstruir_repositorios()
    else:
        print("Opção inválida!")

