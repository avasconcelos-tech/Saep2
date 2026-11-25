// Controller de agendamentos.
const AgendamentoService = require("../service/AgendamentosService");

async function listar(req, res) {
  const agendamentos = await AgendamentoService.listar();
  res.json(agendamentos);
}

async function atualizarData(req, res) {
  try {
    const resultado = await AgendamentoService.atualizarData(
      req.params.id,
      req.body.data_agendamento
    );
    res.json(resultado);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

async function cadastrar(req, res) {
  try {
    const { veiculo_id, data_agendamento, servico } = req.body;
    const agendamento = await AgendamentoService.cadastrar(
      veiculo_id, data_agendamento, servico
    );
    res.status(201).json(agendamento);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

async function excluir(req, res) {
  await AgendamentoService.excluir(req.params.id);
  res.json({ mensagem: "Agendamento removido." });
}

module.exports = { listar, atualizarData, cadastrar, excluir };
