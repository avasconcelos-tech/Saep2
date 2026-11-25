# Torque - Sistema da Oficina Mecanica

Projeto de estudo (SENAI) para controle de clientes, veiculos e agendamentos
de uma oficina mecanica, com protecao do CPF (LGPD) e login com token JWT.

## Estrutura

```
database/       script.sql (gerado pelo backend)
backend/        API Node + Express
frontend-html/  templates Mustache, estilos e scripts do frontend
```

## 1. Configuração

Copie `backend/.env.example` para `backend/.env` e ajuste as credenciais do
MySQL. Defina também uma chave aleatória de 32 bytes em `CRIPTO_CHAVE`, um IV
de 16 bytes em `CRIPTO_IV` e um segredo aleatório para `JWT_SECRET`.

No PowerShell, copie a configuração de exemplo assim:

```powershell
Copy-Item backend\.env.example backend\.env
```

## 2. Banco de dados

Tenha um MySQL rodando localmente. Gere o script SQL a partir de `backend/`:

```bash
cd backend
npm install
npm run gerar-script
cd ..
```

No PowerShell, importe `database/script.sql` a partir da raiz do projeto:

```powershell
Get-Content .\database\script.sql | mysql -u root -p
```

## 3. Backend

```bash
npm start
```

A API sobe em `http://localhost:3000`.
O comando acima funciona na raiz do projeto; também é possível executar
`npm start` dentro de `backend/`.

As telas são servidas pelo backend. Abra `http://localhost:3000` no navegador;
não existe `frontend-html/index.html` para abrir diretamente.

## Usuario de teste

- E-mail: `admin@oficina.com`
- Senha: `123456`
