// Gera o arquivo database/script.sql
//
// O CPF criptografado e a senha com hash nao podem ser escritos a mao no SQL,
// por isso este script usa a mesma chave do .env (utils/cripto.js) e o bcrypt
// para gerar os valores corretos e montar o arquivo .sql pronto.
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

const fs = require("fs");
const bcrypt = require("bcryptjs");
const { criptografarCpf } = require("./src/utils/cripto");

const senhaHash = bcrypt.hashSync("123456", 10);
const cpfs = [
  criptografarCpf("11122233344"),
  criptografarCpf("22233344455"),
  criptografarCpf("33344455566"),
];

const sql = `-- Script gerado automaticamente por backend/gerar-script.js
-- Pode ser executado novamente sem duplicar os registros de exemplo.

CREATE DATABASE IF NOT EXISTS oficina
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE oficina;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf VARCHAR(255) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS veiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT NOT NULL,
  placa VARCHAR(10) NOT NULL UNIQUE,
  marca VARCHAR(50),
  modelo VARCHAR(50),
  ano INT,
  CONSTRAINT fk_veiculos_clientes
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS agendamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  veiculo_id INT NOT NULL,
  data_agendamento DATETIME NOT NULL,
  servico VARCHAR(100),
  CONSTRAINT fk_agendamentos_veiculos
    FOREIGN KEY (veiculo_id) REFERENCES veiculos(id)
    ON UPDATE CASCADE ON DELETE RESTRICT
);

-- Usuarios de teste: admin@oficina.com / 123456
INSERT INTO usuarios (nome, email, senha)
SELECT 'Administrador', 'admin@oficina.com', '${senhaHash}'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@oficina.com');

INSERT INTO usuarios (nome, email, senha)
SELECT 'Carlos Mecanico', 'carlos@oficina.com', '${senhaHash}'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'carlos@oficina.com');

INSERT INTO usuarios (nome, email, senha)
SELECT 'Fernanda Atendente', 'fernanda@oficina.com', '${senhaHash}'
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'fernanda@oficina.com');

-- CPFs armazenados criptografados [RN03].
INSERT INTO clientes (nome, cpf, telefone, email)
SELECT 'Joao da Silva', '${cpfs[0]}', '(11) 90000-1111', 'joao.silva@email.com'
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE cpf = '${cpfs[0]}');

INSERT INTO clientes (nome, cpf, telefone, email)
SELECT 'Maria Souza', '${cpfs[1]}', '(11) 90000-2222', 'maria.souza@email.com'
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE cpf = '${cpfs[1]}');

INSERT INTO clientes (nome, cpf, telefone, email)
SELECT 'Pedro Oliveira', '${cpfs[2]}', '(11) 90000-3333', 'pedro.oliveira@email.com'
WHERE NOT EXISTS (SELECT 1 FROM clientes WHERE cpf = '${cpfs[2]}');

-- Veiculos associados aos clientes por e-mail.
INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano)
SELECT c.id, 'ABC1D23', 'Volkswagen', 'Gol', 2018
FROM clientes c
WHERE c.email = 'joao.silva@email.com'
  AND NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'ABC1D23');

INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano)
SELECT c.id, 'DEF4E56', 'Fiat', 'Palio', 2015
FROM clientes c
WHERE c.email = 'maria.souza@email.com'
  AND NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'DEF4E56');

INSERT INTO veiculos (cliente_id, placa, marca, modelo, ano)
SELECT c.id, 'GHI7F89', 'Chevrolet', 'Onix', 2021
FROM clientes c
WHERE c.email = 'pedro.oliveira@email.com'
  AND NOT EXISTS (SELECT 1 FROM veiculos WHERE placa = 'GHI7F89');

-- Agendamentos de exemplo; datas em ordem variada para testar a ordenacao.
INSERT INTO agendamentos (veiculo_id, data_agendamento, servico)
SELECT v.id, '2026-11-05 09:00:00', 'Troca de oleo'
FROM veiculos v
WHERE v.placa = 'DEF4E56'
  AND NOT EXISTS (
    SELECT 1 FROM agendamentos
    WHERE veiculo_id = v.id AND data_agendamento = '2026-11-05 09:00:00'
  );

INSERT INTO agendamentos (veiculo_id, data_agendamento, servico)
SELECT v.id, '2026-10-20 14:30:00', 'Alinhamento e balanceamento'
FROM veiculos v
WHERE v.placa = 'ABC1D23'
  AND NOT EXISTS (
    SELECT 1 FROM agendamentos
    WHERE veiculo_id = v.id AND data_agendamento = '2026-10-20 14:30:00'
  );

INSERT INTO agendamentos (veiculo_id, data_agendamento, servico)
SELECT v.id, '2026-10-28 08:00:00', 'Revisao dos freios'
FROM veiculos v
WHERE v.placa = 'GHI7F89'
  AND NOT EXISTS (
    SELECT 1 FROM agendamentos
    WHERE veiculo_id = v.id AND data_agendamento = '2026-10-28 08:00:00'
  );
`;

const caminhoSaida = path.join(__dirname, "..", "database", "script.sql");
fs.mkdirSync(path.dirname(caminhoSaida), { recursive: true });
fs.writeFileSync(caminhoSaida, sql, "utf8");
console.log(`Arquivo gerado em ${caminhoSaida}`);
