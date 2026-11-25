// Regras de negócio de veículos.
const VeiculoRepository = require("../repositories/VeiculoRepository");

async function listar() {
  return VeiculoRepository.listarTodos();
}

function validarVeiculo(clienteId, placa, ano) {
  if (!clienteId) throw new Error("Selecione um cliente para o veículo.");

  const placaLimpa = String(placa || "").trim().toUpperCase();
  if (!placaLimpa) throw new Error("Informe a placa do veículo.");
  if (placaLimpa.length > 10) throw new Error("A placa deve ter no máximo 10 caracteres.");

  const anoNumero = ano ? Number(ano) : null;
  if (anoNumero !== null && (!Number.isInteger(anoNumero) || anoNumero < 1900 || anoNumero > 2100)) {
    throw new Error("Informe um ano válido para o veículo.");
  }

  return { clienteId, placa: placaLimpa, ano: anoNumero };
}

async function cadastrar(clienteId, placa, marca, modelo, ano) {
  const dados = validarVeiculo(clienteId, placa, ano);
  const id = await VeiculoRepository.cadastrar(
    dados.clienteId, dados.placa, marca || null, modelo || null, dados.ano
  );
  return { id, cliente_id: dados.clienteId, placa: dados.placa, marca, modelo, ano: dados.ano };
}

async function atualizar(id, clienteId, placa, marca, modelo, ano) {
  const dados = validarVeiculo(clienteId, placa, ano);
  await VeiculoRepository.atualizar(
    id, dados.clienteId, dados.placa, marca || null, modelo || null, dados.ano
  );
  return { id, cliente_id: dados.clienteId, placa: dados.placa, marca, modelo, ano: dados.ano };
}

async function excluir(id) {
  await VeiculoRepository.excluir(id);
}

module.exports = { listar, cadastrar, atualizar, excluir };