const crypto = require("crypto");

function obterChave() {
  const chave = process.env.CRIPTO_CHAVE;
  const iv = process.env.CRIPTO_IV;

  if (!chave || Buffer.byteLength(chave, "utf8") !== 32) {
    throw new Error("CRIPTO_CHAVE deve conter exatamente 32 bytes.");
  }
  if (!iv || Buffer.byteLength(iv, "utf8") !== 16) {
    throw new Error("CRIPTO_IV deve conter exatamente 16 bytes.");
  }

  return { chave, iv };
}

function criptografarCpf(cpf) {
  const { chave, iv } = obterChave();
  const cifra = crypto.createCipheriv("aes-256-cbc", chave, iv);
  return cifra.update(cpf, "utf8", "hex") + cifra.final("hex");
}

function descriptografarCpf(cpfCriptografado) {
  const { chave, iv } = obterChave();
  const decifra = crypto.createDecipheriv("aes-256-cbc", chave, iv);
  return (
    decifra.update(cpfCriptografado, "hex", "utf8") + decifra.final("utf8")
  );
}

module.exports = { criptografarCpf, descriptografarCpf };
