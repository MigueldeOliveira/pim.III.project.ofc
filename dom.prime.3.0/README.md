# Dom Prime Barbearia — ASP.NET Core 8

Sistema de agendamento online integrado com SQL Server via Entity Framework Core.

---

## ✅ Pré-requisitos

| Ferramenta | Versão mínima | Download |
|---|---|---|
| .NET SDK | 8.0 | https://dotnet.microsoft.com/download |
| SQL Server | qualquer (LocalDB incluído no VS) | ou use SQL Server Express |
| VS Code | qualquer | https://code.visualstudio.com |
| Extensão C# Dev Kit | — | marketplace do VS Code |

> **Dica:** Para verificar se o .NET 8 está instalado, abra o terminal e execute `dotnet --version`

---

## 🚀 Como executar (passo a passo)

### 1. Abrir a pasta no VS Code

```
Arquivo → Abrir Pasta → selecione a pasta "DomPrime"
```

### 2. Restaurar pacotes NuGet

No terminal integrado do VS Code (`Ctrl + '`):

```bash
dotnet restore
```

> Isso baixa todos os pacotes necessários (EF Core, SQL Server, etc.)

### 3. Verificar a connection string

Abra `appsettings.json` e confira a linha:

```json
"DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=DomPrimeDb;Trusted_Connection=True;..."
```

- Se você usa **SQL Server LocalDB** (instalado com Visual Studio): ✅ já está pronto
- Se você usa **SQL Server Express**: troque por `Server=.\\SQLEXPRESS;Database=DomPrimeDb;Trusted_Connection=True;TrustServerCertificate=True`
- Se você usa **SQL Server com senha**: `Server=localhost;Database=DomPrimeDb;User Id=sa;Password=SuaSenha;TrustServerCertificate=True`

### 4. Aplicar as Migrations (criar o banco)

```bash
dotnet ef database update
```

> Isso cria o banco `DomPrimeDb` e a tabela `Agendamentos` automaticamente.
> (As migrations já estão incluídas na pasta `Migrations/`)

### 5. Executar o projeto

```bash
dotnet run
```

O site abre em: **http://localhost:5297**

Para recarregar automaticamente ao editar código:

```bash
dotnet watch run
```

---

## 📁 Estrutura do Projeto

```
DomPrime/
├── Controllers/
│   └── AgendamentoController.cs   ← API REST (/api/agendamento)
├── Data/
│   └── AppDbContext.cs            ← Contexto do banco de dados
├── Migrations/
│   └── ...                        ← Migrações do EF Core (já geradas)
├── Models/
│   └── Agendamento.cs             ← Entidade do banco
├── Properties/
│   └── launchSettings.json        ← Porta e ambiente
├── wwwroot/
│   ├── index.html                 ← Frontend principal
│   ├── css/style.css              ← Estilos
│   └── js/main.js                 ← Lógica do formulário
├── .vscode/
│   ├── launch.json                ← Debug no VS Code
│   └── tasks.json                 ← Build tasks
├── appsettings.json               ← Configurações (conexão DB)
├── Program.cs                     ← Configuração da aplicação
└── DomPrime.csproj                ← Projeto .NET 8
```

---

## 🌐 Endpoints da API

| Método | URL | Descrição |
|--------|-----|-----------|
| `POST` | `/api/agendamento` | Cria novo agendamento |
| `GET` | `/api/agendamento` | Lista todos os agendamentos |
| `GET` | `/api/agendamento/{id}` | Busca um agendamento pelo ID |
| `DELETE` | `/api/agendamento/{id}` | Cancela um agendamento |

**Swagger UI** disponível em: `http://localhost:5297/swagger`

---

## 🔧 Comandos úteis

```bash
# Restaurar pacotes
dotnet restore

# Compilar
dotnet build

# Executar
dotnet run

# Executar com hot-reload
dotnet watch run

# Criar nova migration (após alterar Model)
dotnet ef migrations add NomeDaMigration

# Aplicar migrations ao banco
dotnet ef database update

# Instalar EF Tools globalmente (se necessário)
dotnet tool install --global dotnet-ef
```

---

## ❓ Problemas comuns

| Erro | Solução |
|---|---|
| `No executable found matching command "dotnet-ef"` | Execute: `dotnet tool install --global dotnet-ef` |
| `Cannot open database` | Verifique se o SQL Server/LocalDB está rodando |
| `Port already in use` | Mude a porta em `Properties/launchSettings.json` |
| `CORS error` | Já configurado no Program.cs — não deve ocorrer |
| `SSL certificate error` | Execute: `dotnet dev-certs https --trust` |

---

## 💾 Como o agendamento é salvo

1. Usuário preenche o formulário no site
2. JavaScript envia `POST /api/agendamento` com JSON
3. `AgendamentoController` valida os dados
4. Entity Framework salva no SQL Server
5. API retorna `{ mensagem: "Agendamento realizado com sucesso!" }`
