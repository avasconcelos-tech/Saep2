// Regras de negócio de clientes e proteção do CPF.
const ClienteRepository = require("../repositories/ClienteRepository");
const { criptografarCpf, descriptografarCpf } = require("../utils/cripto");

function validarCliente(nome, cpf) {
  const nomeLimpo = String(nome || "").trim();
  const cpfLimpo = String(cpf || "").replace(/\D/g, "");

  if (!nomeLimpo) throw new Error("Informe o nome do cliente.");
  if (cpfLimpo.length !== 11) throw new Error("O CPF deve conter 11 números.");

  return { nome: nomeLimpo, cpf: cpfLimpo };
}

function descriptografarLista(clientes) {
  return clientes.map((cliente) => ({
    ...cliente,
    cpf: descriptografarCpf(cliente.cpf),
  }));
}

async function listar(busca = "") {
  const clientes = busca
    ? await ClienteRepository.buscarPorNome(String(busca).trim())
    : await ClienteRepository.listarTodos();

  return descriptografarLista(clientes);
}

async function atualizar(id, nome, cpf, telefone, email) {
  const dados = validarCliente(nome, cpf);
  const cpfCriptografado = criptografarCpf(dados.cpf);

  await ClienteRepository.atualizar(
    id,
    dados.nome,
    cpfCriptografado,
    telefone || null,
    email || null
  );

  const clienteAtualizado = await ClienteRepository.buscarPorId(id);
  if (!clienteAtualizado) return null;

  return {
    ...clienteAtualizado,
    cpf: descriptografarCpf(clienteAtualizado.cpf),
  };
}

async function cadastrar(nome, cpf, telefone, email) {
  const dados = validarCliente(nome, cpf);
  const cpfCriptografado = criptografarCpf(dados.cpf);
  const id = await ClienteRepository.cadastrar(
    dados.nome,
    cpfCriptografado,
    telefone || null,
    email || null
  );

  return {
    id,
    nome: dados.nome,
    cpf: dados.cpf,
    telefone: telefone || null,
    email: email || null,
  };
}

async function excluir(id) {
  await ClienteRepository.excluir(id);
}

module.exports = { listar, atualizar, cadastrar, excluir };