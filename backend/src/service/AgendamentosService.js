// Regras de negócio de agendamentos.
const AgendamentoRepository = require("../repositories/AgendamentoRepository");

function normalizarData(data) {
  if (typeof data !== "string") {
    throw new Error("Informe a data e o horário do agendamento.");
  }

  const valor = data.trim().replace("T", " ");
  if (!/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(valor)) {
    throw new Error("Data ou horário inválido.");
  }

  return valor.length === 16 ? `${valor}:00` : valor;
}

async function listar() {
  return AgendamentoRepository.listarTodos();
}

async function atualizarData(id, novaData) {
  const data = normalizarData(novaData);
  await AgendamentoRepository.atualizarData(id, data);
  return { id, data_agendamento: data };
}

async function cadastrar(veiculoId, dataAgendamento, servico) {
  if (!veiculoId) throw new Error("Selecione um veículo.");
  const data = normalizarData(dataAgendamento);
  const id = await AgendamentoRepository.cadastrar(veiculoId, data, servico || null);
  return { id, veiculo_id: veiculoId, data_agendamento: data, servico: servico || null };
}

async function excluir(id) {
  await AgendamentoRepository.excluir(id);
}

module.exports = { listar, atualizarData, cadastrar, excluir };