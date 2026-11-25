// Controller de clientes: recebe HTTP e chama a camada de serviço.
const ClienteService = require("../service/ClienteService");

async function listar(req, res) {
  const clientes = await ClienteService.listar(req.query.busca || "");
  res.json(clientes);
}

async function atualizar(req, res) {
  try {
    const { nome, cpf, telefone, email } = req.body;
    const cliente = await ClienteService.atualizar(
      req.params.id, nome, cpf, telefone, email
    );
    if (!cliente) return res.status(404).json({ mensagem: "Cliente não encontrado." });
    res.json(cliente);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

async function cadastrar(req, res) {
  try {
    const { nome, cpf, telefone, email } = req.body;
    const cliente = await ClienteService.cadastrar(nome, cpf, telefone, email);
    res.status(201).json(cliente);
  } catch (erro) {
    res.status(400).json({ mensagem: erro.message });
  }
}

async function excluir(req, res) {
  await ClienteService.excluir(req.params.id);
  res.json({ mensagem: "Cliente removido." });
}

module.exports = { listar, atualizar, cadastrar, excluir };
